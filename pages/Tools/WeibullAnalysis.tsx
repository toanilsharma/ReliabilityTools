import React, { useState, useRef, useMemo } from 'react';
import { calculateWeibull, generateWeibullCurves, calculate3ParameterWeibull, generateContourPlotData } from '../../services/reliabilityMath';
import { WeibullResult } from '../../types';
import { Activity, Upload, AlertTriangle, CheckCircle2, Download, RotateCcw, Save, Loader2, BookOpen, TrendingUp, BarChart2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { useTheme } from '../../context/ThemeContext';
import Papa from 'papaparse';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';
import ToolContentLayout from '../../components/ToolContentLayout';
import ShareAndExport from '../../components/ShareAndExport';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useLocation } from 'react-router-dom';
import { downloadSvgAsEps, downloadSvgElement } from '../../services/exportUtils';

type ChartTab = 'prob' | 'rel' | 'pdf' | 'hazard' | 'contour';

type Scenario = {
  id: string;
  name: string;
  beta: number;
  eta: number;
  color: string;
};

const SCENARIO_COLORS = ['#14b8a6', '#f97316', '#6366f1', '#ef4444', '#eab308'];

const WeibullAnalysis: React.FC = () => {
  const [inputData, setInputData] = useState<string>('120\n245+\n310\n550\n900');
  const [result, setResult] = useState<WeibullResult | null>(null);
  const [activeTab, setActiveTab] = useState<ChartTab>('prob');
  const [is3Parameter, setIs3Parameter] = useState(false);
  const [showBounds, setShowBounds] = useState(false);
  const [lineControl, setLineControl] = useState<{ start: { time: number; medianRank: number }; end: { time: number; medianRank: number } } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scenarioName, setScenarioName] = useState('Design A');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<ReactECharts>(null);
  const toolWrapperRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { addRecentTool } = useRecentTools();
  const location = useLocation();

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#/weibull-analysis?data=${encodeURIComponent(inputData)}`
    : '';

  const parseRawData = React.useCallback((raw: string) => {
    return raw
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        const isSuspended = s.endsWith('+') || s.toLowerCase().endsWith('s');
        const numStr = s.replace(/[^0-9.]/g, '');
        return { time: parseFloat(numStr), suspended: isSuspended };
      })
      .filter(d => !isNaN(d.time) && d.time > 0);
  }, []);

  React.useEffect(() => {
    addRecentTool({
      id: 'weibull',
      name: 'Weibull Analysis',
      path: '/weibull-analysis'
    });

    const searchParams = new URLSearchParams(location.search);
    const data = searchParams.get('data');
    if (data) {
      const decoded = decodeURIComponent(data);
      setInputData(decoded);
      setTimeout(() => {
        const dataPts = parseRawData(decoded);
        if (dataPts.filter(d => !d.suspended).length >= 2) setResult(calculateWeibull(dataPts));
      }, 100);
    }
  }, [location.search, addRecentTool, parseRawData]);

  React.useEffect(() => {
    if (result?.linePoints.length && result.linePoints.length >= 2) {
      setLineControl({
        start: { ...result.linePoints[0] },
        end: { ...result.linePoints[1] },
      });
    }
  }, [result]);

  const manualFit = useMemo(() => {
    if (!result || !lineControl) return null;

    const ordered = lineControl.start.time <= lineControl.end.time
      ? lineControl
      : { start: lineControl.end, end: lineControl.start };

    const x1 = Math.log(Math.max(1e-6, ordered.start.time));
    const x2 = Math.log(Math.max(1e-6, ordered.end.time));
    const y1 = Math.log(-Math.log(1 - Math.min(0.99, Math.max(0.01, ordered.start.medianRank))));
    const y2 = Math.log(-Math.log(1 - Math.min(0.99, Math.max(0.01, ordered.end.medianRank))));

    const dx = x2 - x1;
    if (!isFinite(dx) || Math.abs(dx) < 1e-8) return null;

    const beta = (y2 - y1) / dx;
    if (!isFinite(beta) || beta <= 0) return null;

    const intercept = y1 - beta * x1;
    const eta = Math.exp(-intercept / beta);
    if (!isFinite(eta) || eta <= 0) return null;

    const failures = result.points.filter(p => !p.suspended && typeof p.medianRank === 'number') as Array<{ time: number; medianRank: number }>;
    const residuals = failures.map((p) => {
      const yActual = Math.log(-Math.log(1 - p.medianRank));
      const yPred = beta * Math.log(p.time) + intercept;
      return yActual - yPred;
    });

    const ssRes = residuals.reduce((acc, v) => acc + v * v, 0);
    const meanY = failures.length
      ? failures.reduce((acc, p) => acc + Math.log(-Math.log(1 - p.medianRank)), 0) / failures.length
      : 0;
    const ssTot = failures.reduce((acc, p) => {
      const y = Math.log(-Math.log(1 - p.medianRank));
      return acc + (y - meanY) * (y - meanY);
    }, 0);
    const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;

    const b10 = eta * Math.pow(-Math.log(0.9), 1 / beta);

    return {
      ...result,
      beta,
      eta,
      rSquared,
      b10,
      linePoints: [ordered.start, ordered.end],
    } as WeibullResult;
  }, [result, lineControl]);

  const activeModel = manualFit ?? result;

  const outliers = useMemo(() => {
    if (!activeModel) return [] as Array<{ time: number; medianRank: number }>;

    const failures = activeModel.points.filter(p => !p.suspended && typeof p.medianRank === 'number') as Array<{ time: number; medianRank: number }>;
    if (failures.length < 4) return [];

    const residuals = failures.map((p) => {
      const shifted = Math.max(1e-6, p.time - (activeModel.t0 ?? 0));
      const predicted = 1 - Math.exp(-Math.pow(shifted / activeModel.eta, activeModel.beta));
      return Math.abs(predicted - p.medianRank);
    });

    const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const variance = residuals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / residuals.length;
    const std = Math.sqrt(variance);
    const limit = mean + 2 * std;

    return failures.filter((p, idx) => residuals[idx] > limit);
  }, [activeModel]);

  const handleAnalyze = () => {
    const dataPoints = parseRawData(inputData);
    const failures = dataPoints.filter(d => !d.suspended);

    if (failures.length < 2) {
      alert('Please enter at least 2 valid failure data points > 0');
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const res = is3Parameter ? calculate3ParameterWeibull(dataPoints) : calculateWeibull(dataPoints);
      setResult(res);
      setIsCalculating(false);
    }, 350);
  };

  const curveData = useMemo(() => {
    if (!activeModel) return { curves: [], contour: [], boundsLines: [] as any[] };

    const maxTime = Math.max(...activeModel.points.map(p => p.time)) * 1.5;
    const curves = generateWeibullCurves(activeModel.beta, activeModel.eta, maxTime);
    if (activeModel.t0) curves.forEach(c => c.t += activeModel.t0!);

    let contour: any[] = [];
    if (activeModel.bounds) {
      contour = generateContourPlotData(activeModel.beta, activeModel.eta, activeModel.bounds.varBeta, activeModel.bounds.varEta);
    }

    const boundsLines: any[] = [];
    if (activeModel.bounds && activeModel.linePoints.length >= 2) {
      const startT = activeModel.linePoints[0].time;
      const endT = activeModel.linePoints[1].time;
      const { betaLower, betaUpper, etaLower, etaUpper } = activeModel.bounds;
      boundsLines.push([
        { time: startT, medianRank: 1 - Math.exp(-Math.pow(startT / etaUpper, betaUpper)) },
        { time: endT, medianRank: 1 - Math.exp(-Math.pow(endT / etaUpper, betaUpper)) }
      ]);
      boundsLines.push([
        { time: startT, medianRank: 1 - Math.exp(-Math.pow(startT / etaLower, betaLower)) },
        { time: endT, medianRank: 1 - Math.exp(-Math.pow(endT / etaLower, betaLower)) }
      ]);
    }

    return { curves, contour, boundsLines };
  }, [activeModel]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const values: string[] = [];
        results.data.forEach((row: any) => {
          let valStr = '';
          if (Array.isArray(row)) {
            valStr = String(row[0]).trim();
            if (row.length > 1 && String(row[1]).toUpperCase().startsWith('S')) valStr += '+';
          } else if (typeof row === 'object' && row !== null) {
            valStr = String(Object.values(row)[0]).trim();
          } else {
            valStr = String(row).trim();
          }
          if (valStr.match(/[0-9]/)) values.push(valStr);
        });

        if (values.length > 0) setInputData(values.join('\n'));
        else alert('Could not find valid data in the CSV file.');
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const getBetaInterpretation = (beta: number) => {
    if (beta < 0.9) return { title: 'Infant Mortality', description: 'Early failures due to defects.', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> };
    if (beta >= 0.9 && beta <= 1.1) return { title: 'Random Failures', description: 'Constant failure rate.', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> };
    return { title: 'Wear Out', description: 'Failures increase with time.', icon: <Activity className="w-5 h-5 text-red-500" /> };
  };

  const updateControlPoint = React.useCallback((target: 'start' | 'end', next: { time: number; medianRank: number }) => {
    setLineControl(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [target]: {
          time: Math.max(1e-3, next.time),
          medianRank: Math.min(0.99, Math.max(0.01, next.medianRank)),
        }
      };
    });
  }, []);

  React.useEffect(() => {
    if (activeTab !== 'prob' || !activeModel || !lineControl || !chartRef.current) return;

    const instance = chartRef.current.getEchartsInstance();
    if (!instance) return;

    const syncHandles = () => {
      const toPixel = (point: { time: number; medianRank: number }) =>
        instance.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [point.time, point.medianRank]) as [number, number];

      instance.setOption({
        graphic: [
          {
            id: 'fit-start',
            type: 'circle',
            draggable: true,
            z: 100,
            cursor: 'move',
            position: toPixel(lineControl.start),
            shape: { r: 8 },
            style: { fill: '#22c55e', stroke: '#ffffff', lineWidth: 2 },
            ondrag: function (this: any) {
              const converted = instance.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, this.position) as unknown;
              const [time, rank] = Array.isArray(converted) ? converted as number[] : [0, 0];
              updateControlPoint('start', { time: Number(time), medianRank: Number(rank) });
            },
          },
          {
            id: 'fit-end',
            type: 'circle',
            draggable: true,
            z: 100,
            cursor: 'move',
            position: toPixel(lineControl.end),
            shape: { r: 8 },
            style: { fill: '#f97316', stroke: '#ffffff', lineWidth: 2 },
            ondrag: function (this: any) {
              const converted = instance.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, this.position) as unknown;
              const [time, rank] = Array.isArray(converted) ? converted as number[] : [0, 0];
              updateControlPoint('end', { time: Number(time), medianRank: Number(rank) });
            },
          },
        ]
      });
    };

    syncHandles();
    window.addEventListener('resize', syncHandles);

    return () => {
      window.removeEventListener('resize', syncHandles);
      instance.setOption({ graphic: [] });
    };
  }, [activeTab, activeModel, lineControl, updateControlPoint]);

  const addScenario = () => {
    if (!activeModel) return;
    const id = Math.random().toString(36).slice(2, 10);
    const color = SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length];
    const name = scenarioName.trim() || `Design ${String.fromCharCode(65 + scenarios.length)}`;

    setScenarios(prev => [...prev, { id, name, beta: activeModel.beta, eta: activeModel.eta, color }]);
    setScenarioName(`Design ${String.fromCharCode(66 + scenarios.length)}`);
  };

  const exportChart = async (format: 'svg' | 'eps') => {
    const svg = chartRef.current?.getEchartsInstance()?.getDom()?.querySelector('svg') as SVGSVGElement | null;
    if (!svg) {
      alert('Chart export is only available after rendering a chart.');
      return;
    }

    const baseName = `weibull-${activeTab}-${new Date().toISOString().slice(0, 10)}`;
    if (format === 'svg') downloadSvgElement(svg, `${baseName}.svg`);
    else await downloadSvgAsEps(svg, `${baseName}.eps`);
  };
  const ToolComponent = (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6" ref={toolWrapperRef}>
      <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center">
              Failures & Suspensions
              <HelpTooltip 
                text="Enter raw failure times (numbers) and suspensions (numbers with +)." 
                why="Weibull analysis requires both success and failure data to avoid over-optimistic life estimates."
                formula="F(t) = 1 - e^{-(t/\eta)^\beta}"
              />
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
            >
              <Upload className="w-3 h-3" /> Import CSV
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt" className="hidden" />
          </div>

          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={8}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            placeholder="100&#10;250+&#10;500..."
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={is3Parameter} onChange={(e) => setIs3Parameter(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 bg-transparent" />
              Use 3-Parameter Weibull
              <HelpTooltip text="Estimate t0 (failure-free delay)." why="Useful when assets have a known guarantee period before wear starts." />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={showBounds} onChange={(e) => setShowBounds(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 bg-transparent" />
              Show Confidence Bounds
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isCalculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />} Calculate Parameters
          </button>

          {isCalculating && (
            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
              <div className="h-full w-full bg-cyan-500 animate-pulse" />
            </div>
          )}
        </div>

        {activeModel && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-4">
            <div className={`grid ${activeModel.t0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center shadow-sm">
                <div className="text-sm text-slate-500 dark:text-slate-400">Beta (&beta;)</div>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{activeModel.beta.toFixed(3)}</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center shadow-sm">
                <div className="text-sm text-slate-500 dark:text-slate-400">Eta (&eta;)</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-200">{activeModel.eta.toFixed(1)}</div>
              </div>
              {activeModel.t0 ? (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center shadow-sm">
                  <div className="text-sm text-slate-500 dark:text-slate-400">t_0 (Guar.)</div>
                  <div className="text-xl font-bold text-teal-600 dark:text-teal-400">{activeModel.t0.toFixed(1)}</div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-cyan-500 shadow-sm">
              {getBetaInterpretation(activeModel.beta).icon}
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{getBetaInterpretation(activeModel.beta).title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{getBetaInterpretation(activeModel.beta).description}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center">R2 Fit: {activeModel.rSquared.toFixed(3)} | B10 Life: {activeModel.b10.toFixed(1)}</div>
            {outliers.length > 0 && <div className="text-xs text-amber-600 dark:text-amber-400 text-center">Outliers detected: {outliers.length} points beyond 2-sigma residual</div>}

            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 mt-2 overflow-x-auto">
              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                <RotateCcw className="w-3 h-3" /> Live Equation
              </h4>
              <BlockMath math={`R(t) = e^{-\\left(\\frac{t ${activeModel.t0 ? `- ${activeModel.t0.toFixed(2)}` : ''}}{${activeModel.eta.toFixed(2)}}\\right)^{${activeModel.beta.toFixed(3)}}}`} />
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800/70">
              <div className="text-xs font-semibold text-slate-500 mb-2">Scenario Compare</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                  placeholder="Design A"
                />
                <button onClick={addScenario} className="px-2 py-1 text-xs bg-cyan-600 text-white rounded flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
              </div>
              {scenarios.length > 0 && (
                <div className="mt-2 space-y-1 max-h-20 overflow-auto text-xs">
                  {scenarios.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>{s.name}</span>
                      <span className="text-slate-500">beta {s.beta.toFixed(2)} / eta {s.eta.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatedContainer>

      <AnimatedContainer animation="staggerContainer" delay={0.2} className="lg:col-span-2">
        {activeModel ? (
          <div className="h-[520px] flex flex-col">
            <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
              <div className="flex items-center space-x-2">
                {['prob', 'rel', 'pdf', 'hazard', 'contour'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as ChartTab)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize border ${activeTab === tab ? 'bg-cyan-600 text-white border-cyan-600' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-cyan-500'}`}
                  >
                    {tab === 'prob' ? 'Probability' : tab}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => exportChart('svg')} className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:border-cyan-500"><Download className="w-3 h-3" /> SVG</button>
                <button onClick={() => exportChart('eps')} className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:border-cyan-500"><Download className="w-3 h-3" /> EPS</button>
              </div>
            </div>

            <div className="flex-grow bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-2" style={{ minHeight: 0 }}>
              {activeTab === 'prob' && (
                <ReactECharts
                  ref={chartRef}
                  option={{
                    animationDurationUpdate: 450,
                    progressive: 4000,
                    grid: { left: '8%', right: '5%', bottom: '14%' },
                    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 16 }],
                    tooltip: { 
                      trigger: 'item', 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: '#334155',
                      textStyle: { color: '#f8fafc' },
                      formatter: (p: any) => `<div class="font-bold border-b border-slate-700 pb-1 mb-1">${p.seriesName}</div><div class="flex justify-between gap-4 text-xs mt-1"><span>Time (t):</span> <span class="text-cyan-400 font-mono">${Number(p.value[0]).toFixed(2)}</span></div><div class="flex justify-between gap-4 text-xs mt-1"><span>Rank:</span> <span class="text-cyan-400 font-mono">${(p.value[1] * 100).toFixed(2)}%</span></div>` 
                    },
                    xAxis: { type: 'log', name: 'Time (t)', nameLocation: 'middle', nameGap: 30, splitLine: { lineStyle: { type: 'dashed', color: chartColors.grid } }, axisLabel: { color: chartColors.axis } },
                    yAxis: { type: 'value', min: 0.01, max: 0.99, splitLine: { lineStyle: { type: 'dashed', color: chartColors.grid } }, axisLabel: { color: chartColors.axis, formatter: (v: number) => `${(v * 100).toFixed(0)}%` } },
                    backgroundColor: 'transparent',
                    series: [
                      { name: 'Failures', type: 'scatter', large: true, largeThreshold: 2000, itemStyle: { color: '#06b6d4' }, data: activeModel.points.filter(p => !p.suspended).map(p => [p.time, p.medianRank]) },
                      { name: 'Suspensions', type: 'scatter', symbol: 'triangle', itemStyle: { color: '#94a3b8' }, data: activeModel.points.filter(p => p.suspended).map(p => [p.time, 0.01]) },
                      { name: 'Fit Line (Drag Endpoints)', type: 'line', showSymbol: false, itemStyle: { color: '#f43f5e' }, lineStyle: { width: 2.5 }, data: activeModel.linePoints.map(p => [p.time, p.medianRank]) },
                      { name: 'Outliers', type: 'scatter', symbol: 'diamond', symbolSize: 10, itemStyle: { color: '#f59e0b' }, data: outliers.map(p => [p.time, p.medianRank]) },
                      ...scenarios.map((s) => ({
                        name: s.name,
                        type: 'line',
                        showSymbol: false,
                        lineStyle: { width: 1.6, type: 'dashed', color: s.color },
                        data: activeModel.linePoints.map((p) => [
                          p.time,
                          1 - Math.exp(-Math.pow(p.time / s.eta, s.beta)),
                        ])
                      })),
                      ...(showBounds ? curveData.boundsLines.map((line: any) => ({ name: 'Bounds', type: 'line', showSymbol: false, itemStyle: { color: '#f43f5e' }, lineStyle: { type: 'dashed', width: 1 }, data: line.map((p: any) => [p.time, p.medianRank]) })) : [])
                    ]
                  }}
                  opts={{ renderer: 'svg' }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
              {activeTab === 'contour' && (
                <ReactECharts
                  ref={chartRef}
                  option={{
                    animationDurationUpdate: 450,
                    grid: { left: '8%', right: '5%', bottom: '10%' },
                    tooltip: { trigger: 'item', formatter: (p: any) => p.componentSubType === 'scatter' && p.seriesName === 'Likelihood' ? `Eta: ${p.value[0].toFixed(2)}<br/>Beta: ${p.value[1].toFixed(3)}<br/>Likelihood: ${(p.value[2] * 100).toFixed(1)}%` : 'Optimal Fit' },
                    xAxis: { type: 'value', name: 'Scale (Eta)', scale: true, nameLocation: 'middle', nameGap: 25, splitLine: { lineStyle: { type: 'dashed', color: chartColors.grid } }, axisLabel: { color: chartColors.axis } },
                    yAxis: { type: 'value', name: 'Shape (Beta)', scale: true, splitLine: { lineStyle: { type: 'dashed', color: chartColors.grid } }, axisLabel: { color: chartColors.axis } },
                    backgroundColor: 'transparent',
                    series: [
                      { name: 'Likelihood', type: 'scatter', symbolSize: (data: any) => Math.max(2, data[2] * 20), itemStyle: { color: 'rgba(14, 165, 233, 0.6)' }, data: curveData.contour.map((c: any) => [c.eta, c.beta, c.likelihood]) },
                      { name: 'Optimal', type: 'scatter', symbol: 'star', symbolSize: 15, itemStyle: { color: '#f43f5e' }, data: [[activeModel.eta, activeModel.beta]] }
                    ]
                  }}
                  opts={{ renderer: 'svg' }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
              {['rel', 'pdf', 'hazard'].includes(activeTab) && (
                <ReactECharts
                  ref={chartRef}
                  option={{
                    animationDurationUpdate: 450,
                    progressive: 4000,
                    grid: { left: '8%', right: '5%', bottom: '10%' },
                    tooltip: { trigger: 'axis', formatter: (params: any) => `Time: ${params[0].value[0].toFixed(1)}<br/>Value: ${params[0].value[1].toFixed(5)}` },
                    xAxis: { type: 'value', name: 'Time (t)', nameLocation: 'middle', nameGap: 25, splitLine: { lineStyle: { color: chartColors.grid } }, axisLabel: { color: chartColors.axis } },
                    yAxis: { type: 'value', splitLine: { lineStyle: { color: chartColors.grid } }, axisLabel: { color: chartColors.axis } },
                    backgroundColor: 'transparent',
                    series: [
                      { name: activeTab, type: 'line', showSymbol: false, itemStyle: { color: '#06b6d4' }, lineStyle: { width: 3 }, data: curveData.curves.map((c: any) => [c.t, c[activeTab as keyof typeof c]]) },
                      ...scenarios.map((s) => {
                        const comparisonCurve = generateWeibullCurves(s.beta, s.eta, Math.max(...curveData.curves.map((c: any) => c.t || 1), 1));
                        return {
                          name: s.name,
                          type: 'line',
                          showSymbol: false,
                          lineStyle: { width: 1.8, type: 'dashed', color: s.color },
                          data: comparisonCurve.map((c: any) => [c.t, c[activeTab as keyof typeof c]])
                        };
                      })
                    ]
                  }}
                  opts={{ renderer: 'svg' }}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
            <Activity className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter data and click Calculate</p>
          </div>
        )}
      </AnimatedContainer>
      
      {activeModel && (
        <AnimatedContainer animation="slideUp" delay={0.3} className="lg:col-span-3">
          <ShareAndExport 
            toolName="Weibull Analysis"
            shareUrl={shareUrl}
            chartRef={toolWrapperRef}
            resultSummary={`\u03B2=${activeModel.beta.toFixed(2)}, \u03B7=${activeModel.eta.toFixed(0)}`}
            pdfData={{
              inputs: {
                "Total Data Points": activeModel.points.length,
                "Failures": activeModel.points.filter(p => !p.suspended).length,
                "Suspensions": activeModel.points.filter(p => p.suspended).length,
                "Model Type": is3Parameter ? "3-Parameter Weibull" : "2-Parameter Weibull"
              },
              results: {
                "Shape Parameter (\u03B2)": activeModel.beta.toFixed(4),
                "Scale Parameter (\u03B7)": `${activeModel.eta.toFixed(2)} hours/units`,
                "Location Parameter (\u03B3)": activeModel.t0?.toFixed(2) || "0.00",
                "B10 Life": activeModel.b10.toFixed(2),
                "R-Squared (Fit)": activeModel.rSquared.toFixed(4),
                "Failure Mode": getBetaInterpretation(activeModel.beta).title
              }
            }}
            exportData={[
              { Parameter: "Shape Parameter (\u03B2)", Value: activeModel.beta },
              { Parameter: "Scale Parameter / Characteristic Life (\u03B7)", Value: activeModel.eta },
            { Parameter: "Location Parameter (\u03B3)", Value: activeModel.t0 || 0 },
            { Parameter: "B10 Life", Value: activeModel.b10 },
            { Parameter: "R-Squared", Value: activeModel.rSquared },
            {}, // Empty row for separation
            { Parameter: "--- DATA POINTS ---", Value: "" },
            ...activeModel.points.map(p => ({
              "Time (t)": p.time,
              "Status": p.suspended ? "Suspended" : "Failed",
              "Median Rank": p.medianRank || "N/A"
            }))
          ]}
        />
        </AnimatedContainer>
      )}
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Weibull Analysis Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Weibull Analysis is the premier method for examining life data. Its primary strength lies in its profound flexibility to model various life behaviors simply by adjusting its parameters.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Shape Parameter (Beta β)"
          icon={<TrendingUp className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The Shape Parameter (<span className="font-serif italic font-bold">β</span>) is the slope of the line on a Weibull probability plot. It fundamentally defines the failure mode of the asset:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-sm dark:text-slate-300">
            <li><strong>β &lt; 1 (Infant Mortality):</strong> The failure rate decreases over time. Often caused by manufacturing defects or installation errors.</li>
            <li><strong>β = 1 (Random Failures):</strong> A constant failure rate. The Weibull distribution becomes identical to the Exponential distribution.</li>
            <li><strong>β &gt; 1 (Wear-Out):</strong> The failure rate increases over time due to aging, friction, or fatigue.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="The Scale Parameter (Eta η)"
          icon={<BarChart2 className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The Scale Parameter (<span className="font-serif italic font-bold">η</span>), also known as characteristic life, determines the spread of the distribution data. 
          </p>
          <p className="mt-2">
            By definition, it is the time at which <strong>63.2%</strong> of the units will have failed. If <span className="font-serif italic font-bold">η</span> increases while <span className="font-serif italic font-bold">β</span> remains constant, the distribution stretches out to the right (representing a longer effective life) while its absolute peak height drops.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Probability Density Function (PDF)"
          icon={<BookOpen className="w-5 h-5" />}
          formula="f(T) = \frac{\beta}{\eta} \left( \frac{T}{\eta} \right)^{\beta-1} e^{-\left(\frac{T}{\eta}\right)^\beta}"
          delay={0.3}
        >
          <p>
            The PDF defines the probability that a unit will fail within an infinitesimally small interval of time. It illustrates the relative frequency of failures across the asset's lifespan.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Cumulative Distribution Function (CDF)"
          icon={<Activity className="w-5 h-5" />}
          formula="F(T) = 1 - e^{-\left(\frac{T}{\eta}\right)^\beta}"
          delay={0.4}
        >
          <p>
            The CDF (Unreliability) gives the total fraction of units that will have failed by time T. Consequently, Reliability is simply <code>R(T) = 1 - F(T)</code>.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: 'How do I drag the fitted line?',
      answer: 'Open the Probability tab and drag the green/orange endpoints on the line. Beta and Eta update instantly.'
    },
    {
      question: 'What counts as an outlier?',
      answer: 'Points with residuals above mean + 2 sigma from the fitted CDF trend are highlighted as outliers.'
    },
    {
      question: 'Can I compare multiple designs?',
      answer: 'Yes. Save each active fit as a scenario and it will be overlaid as dashed comparison curves.'
    }
  ];

  return (
    <ToolContentLayout
      title="Free Weibull Analysis Calculator"
      description="Estimate Weibull beta and eta, drag the probability fit line interactively, detect outliers, and compare side-by-side design scenarios."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="weibull" />
        </>
      }
      faqs={faqs}
      keywords="Weibull analysis tool, free Weibull calculator, Weibull distribution, beta eta parameters, reliability analysis India, life data analysis, B10 life, characteristic life"
      canonicalUrl="https://reliabilitytools.co.in/#/weibull-analysis"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Free Weibull Analysis Calculator',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    />
  );
};

export default WeibullAnalysis;



