import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Settings, Clock, DollarSign, Shield, Activity, AlertTriangle, CheckCircle2, Save, Loader2, Download, BookOpen, TrendingUp, Cpu, Wrench } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import { downloadSvgAsEps, downloadSvgElement } from '../../services/exportUtils';
import RelatedTools from '../../components/RelatedTools';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { AvailabilityTimeline } from '../../components/TheoryVisuals';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

import { Link } from 'react-router-dom';

type AvailabilityScenario = {
  label: 'Design A' | 'Design B';
  mtbf: number;
  mttr: number;
  availability: number;
  color: string;
};

const DonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        <circle cx="100" cy="100" r={radius} stroke="#e2e8f0" strokeWidth="15" fill="transparent" className="dark:stroke-slate-700" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#06b6d4"
          strokeWidth="15"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-white">{percentage.toFixed(4)}%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">Availability</span>
      </div>
    </div>
  );
};

const AvailabilityCalculator: React.FC = () => {
  const [draftMtbf, setDraftMtbf] = useState(1000);
  const [draftMttr, setDraftMttr] = useState(10);
  const [draftHourlyRevenue, setDraftHourlyRevenue] = useState(5000);
  const [draftOperationMode, setDraftOperationMode] = useState<'24/7' | 'Business'>('24/7');
  const [targetAvailability, setTargetAvailability] = useState('99.5');

  const [mtbf, setMtbf] = useState(1000);
  const [mttr, setMttr] = useState(10);
  const [hourlyRevenue, setHourlyRevenue] = useState(5000);
  const [operationMode, setOperationMode] = useState<'24/7' | 'Business'>('24/7');
  const [isCalculating, setIsCalculating] = useState(false);

  const [scenarioA, setScenarioA] = useState<AvailabilityScenario | null>(null);
  const [scenarioB, setScenarioB] = useState<AvailabilityScenario | null>(null);

  const chartRef = React.useRef<ReactECharts>(null);

  const applyCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setMtbf(draftMtbf);
      setMttr(draftMttr);
      setHourlyRevenue(draftHourlyRevenue);
      setOperationMode(draftOperationMode);
      setIsCalculating(false);
    }, 350);
  };

  const yearlyHours = operationMode === '24/7' ? 8760 : 2080;

  const availability = useMemo(() => {
    if (mtbf <= 0 || mttr < 0) return 0;
    const val = mtbf / (mtbf + mttr);
    return isNaN(val) ? 0 : val;
  }, [mtbf, mttr]);

  const sensitivityData = useMemo(() => {
    const data = [] as Array<{ mttr: number; availability: number }>;
    for (let r = 0.5; r <= 60; r += 0.5) {
      const avail = (mtbf / (mtbf + r)) * 100;
      data.push({ mttr: Number(r.toFixed(1)), availability: avail });
    }
    return data;
  }, [mtbf]);

  const downtimePercent = 1 - availability;
  const downtimeHoursPerYear = yearlyHours * downtimePercent;
  const yearlyLoss = downtimeHoursPerYear * hourlyRevenue;

  const targetParsed = parseFloat(targetAvailability);
  const targetInvalidHigh = !isNaN(targetParsed) && targetParsed > 100;
  const targetInvalidLow = !isNaN(targetParsed) && targetParsed < 0;
  const targetNormalized = targetInvalidHigh ? 99.9 : targetInvalidLow ? 0 : targetParsed;
  const requiredMttr = !isNaN(targetNormalized) && targetNormalized > 0 && targetNormalized < 100
    ? mtbf * (1 - targetNormalized / 100) / (targetNormalized / 100)
    : null;

  const showMttrWarning = mttr > mtbf * 0.25;
  const showExtremeWarning = mttr >= mtbf;

  const saveScenario = (slot: 'A' | 'B') => {
    const scenario: AvailabilityScenario = {
      label: slot === 'A' ? 'Design A' : 'Design B',
      mtbf,
      mttr,
      availability: availability * 100,
      color: slot === 'A' ? '#14b8a6' : '#f97316',
    };

    if (slot === 'A') setScenarioA(scenario);
    else setScenarioB(scenario);
  };

  const riskLevel = availability < 0.95 ? 'Critical' : availability < 0.99 ? 'Moderate' : 'Low';

  const exportChart = async (format: 'svg' | 'eps') => {
    const svg = chartRef.current?.getEchartsInstance()?.getDom()?.querySelector('svg') as SVGSVGElement | null;
    if (!svg) {
      alert('Run a calculation first, then export.');
      return;
    }
    const filename = `availability-sensitivity-${new Date().toISOString().slice(0, 10)}`;
    if (format === 'svg') downloadSvgElement(svg, `${filename}.svg`);
    else await downloadSvgAsEps(svg, `${filename}.eps`);
  };

  const chartOption = {
    animationDurationUpdate: 450,
    grid: { left: '8%', right: '5%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `MTTR: ${p.value[0]} h<br/>Availability: ${Number(p.value[1]).toFixed(3)}%`;
      }
    },
    xAxis: {
      type: 'value',
      name: 'Repair Time (hours)',
      nameLocation: 'middle' as const,
      nameGap: 25,
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' as const } }
    },
    yAxis: {
      type: 'value',
      name: 'Availability %',
      min: Math.max(85, Math.floor((availability * 100) - 5)),
      max: 100,
      axisLabel: { color: '#64748b', formatter: (v: number) => `${v.toFixed(1)}%` },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    series: [
      {
        name: 'Current Design',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: '#06b6d4' },
        areaStyle: { color: 'rgba(6,182,212,0.12)' },
        data: sensitivityData.map((d) => [d.mttr, d.availability]),
      },
      {
        name: 'Current Point',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#ec4899' },
        data: [[mttr, availability * 100]],
      },
      ...(scenarioA ? [{
        name: scenarioA.label,
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 2, type: 'dashed' as const, color: scenarioA.color },
        data: sensitivityData.map((d) => [d.mttr, (scenarioA.mtbf / (scenarioA.mtbf + d.mttr)) * 100]),
      }] : []),
      ...(scenarioB ? [{
        name: scenarioB.label,
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 2, type: 'dashed' as const, color: scenarioB.color },
        data: sensitivityData.map((d) => [d.mttr, (scenarioB.mtbf / (scenarioB.mtbf + d.mttr)) * 100]),
      }] : []),
    ],
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-12 gap-6">
      <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6 h-full border-t-4 border-t-cyan-500">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Input Parameters
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 transition-colors cursor-pointer" onClick={() => setDraftMtbf(1000)}>MTBF (Hours)</label>
                <div className="flex items-center">
                  <input type="number" min="0" value={draftMtbf} onChange={(e) => setDraftMtbf(Number(e.target.value))} className="w-20 text-right text-sm font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40 px-2 py-0.5 rounded-l border border-cyan-200 dark:border-cyan-800 outline-none focus:ring-1 focus:ring-cyan-500" />
                  <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/60 px-2 py-0.5 border border-l-0 border-cyan-200 dark:border-cyan-800 rounded-r">h</span>
                </div>
              </div>
              <input type="range" min="100" max="10000" step="50" value={draftMtbf} onChange={(e) => setDraftMtbf(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-pink-600 transition-colors cursor-pointer" onClick={() => setDraftMttr(10)}>MTTR (Hours)</label>
                <div className="flex items-center">
                  <input type="number" min="0" step="0.5" value={draftMttr} onChange={(e) => setDraftMttr(Number(e.target.value))} className="w-20 text-right text-sm font-mono text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/40 px-2 py-0.5 rounded-l border border-pink-200 dark:border-pink-800 outline-none focus:ring-1 focus:ring-pink-500" />
                  <span className="text-sm font-mono text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/60 px-2 py-0.5 border border-l-0 border-pink-200 dark:border-pink-800 rounded-r">h</span>
                </div>
              </div>
              <input type="range" min="0.5" max="60" step="0.5" value={draftMttr} onChange={(e) => setDraftMttr(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Operation Mode</label>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  {(['24/7', 'Business'] as const).map(m => (
                    <button key={m} onClick={() => setDraftOperationMode(m)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${draftOperationMode === m ? 'bg-white dark:bg-slate-600 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue Loss / Hour ($)</label>
                <input type="number" value={draftHourlyRevenue} onChange={(e) => setDraftHourlyRevenue(Number(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">Target Availability (%)
                  <HelpTooltip text="Desired availability target." why="Used to back-calculate required MTTR at your current MTBF." formula="MTTR = MTBF*(1-A)/A" />
                </label>
                <input type="number" value={targetAvailability} onChange={(e) => setTargetAvailability(e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
            </div>

            <button onClick={applyCalculation} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              {isCalculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />} Calculate
            </button>
            {isCalculating && <div className="h-1 bg-cyan-200 rounded"><div className="h-1 w-full bg-cyan-500 animate-pulse" /></div>}

            {(showMttrWarning || showExtremeWarning || targetInvalidHigh || targetInvalidLow) && (
              <div className={`p-4 rounded-lg border-l-4 flex items-start gap-3 mt-4 text-sm ${showExtremeWarning || targetInvalidHigh || targetInvalidLow ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-800 dark:text-amber-200'}`}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">Did you mean?</h4>
                  {targetInvalidHigh && <p>Availability cannot exceed 100%. Suggested correction: 99.9%.</p>}
                  {targetInvalidLow && <p>Availability cannot be negative. Suggested correction: 0%.</p>}
                  {!targetInvalidHigh && !targetInvalidLow && showExtremeWarning && <p>MTTR is equal to or greater than MTBF. The system spends more time down than running.</p>}
                  {!targetInvalidHigh && !targetInvalidLow && !showExtremeWarning && showMttrWarning && <p>MTTR is high compared with MTBF (over 25%). Verify units and maintenance assumptions.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="staggerContainer" delay={0.2} className="lg:col-span-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatedContainer animation="scaleUp" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6 flex flex-col items-center justify-center relative">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">System Health</h3>
            <DonutChart percentage={availability * 100} />
            <div className="w-full mt-6 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 flex justify-between text-sm">
              <span className="font-semibold">Risk Level</span>
              <span className={`${riskLevel === 'Critical' ? 'text-red-600' : riskLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'} font-bold`}>{riskLevel}</span>
            </div>
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Annual Impact</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase">Total Downtime</div>
                    <div className="text-sm text-red-400 dark:text-red-300">Per Year</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-red-700 dark:text-red-400 font-mono">{downtimeHoursPerYear.toFixed(1)} hrs</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Revenue Risk</div>
                    <div className="text-sm text-emerald-400 dark:text-emerald-300">Annual Projection</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">${yearlyLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        <AnimatedContainer animation="slideUp" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sensitivity Analysis and Scenario Overlay</h3>
            <div className="flex gap-2">
              <button onClick={() => saveScenario('A')} className="px-3 py-1.5 text-xs rounded bg-teal-600 text-white flex items-center gap-1"><Save className="w-3 h-3" /> Save A</button>
              <button onClick={() => saveScenario('B')} className="px-3 py-1.5 text-xs rounded bg-orange-500 text-white flex items-center gap-1"><Save className="w-3 h-3" /> Save B</button>
              <button onClick={() => exportChart('svg')} className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1"><Download className="w-3 h-3" /> SVG</button>
              <button onClick={() => exportChart('eps')} className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1"><Download className="w-3 h-3" /> EPS</button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ReactECharts ref={chartRef} option={chartOption} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs">
            {requiredMttr !== null ? (
              <div className="p-3 rounded border border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-800">
                Required MTTR for {targetNormalized.toFixed(2)}% target: <strong>{requiredMttr.toFixed(2)} hours</strong>
              </div>
            ) : (
              <div className="p-3 rounded border border-slate-200 bg-slate-50 dark:bg-slate-900/40 dark:border-slate-700">
                Enter a valid target availability between 0 and 100 to compute required MTTR.
              </div>
            )}
            <div className="p-3 rounded border border-slate-200 bg-slate-50 dark:bg-slate-900/40 dark:border-slate-700 flex items-center gap-2">
              {availability >= 0.99 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Shield className="w-4 h-4 text-amber-500" />} Current availability: <strong>{(availability * 100).toFixed(4)}%</strong>
            </div>
          </div>
        </AnimatedContainer>
      </AnimatedContainer>
      
      <div className="lg:col-span-12">
        <ShareAndExport 
          toolName="Availability Calculator"
          shareUrl={window.location.href}
          chartRef={chartRef as any}
          resultSummary={`${(availability * 100).toFixed(4)}% Availability`}
          pdfData={{
            inputs: {
              "MTBF (Hours)": mtbf,
              "MTTR (Hours)": mttr,
              "Hourly Revenue Risk": `$${hourlyRevenue}/hr`,
              "Operation Mode": operationMode
            },
            results: {
              "System Availability": `${(availability * 100).toFixed(4)}%`,
              "Annual Downtime Hours": `${downtimeHoursPerYear.toFixed(1)} hrs`,
              "Projected Revenue Risk": `$${yearlyLoss.toLocaleString()}`,
              "Reliability Risk Level": riskLevel
            }
          }}
        />
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          System Availability: Uptime and Plant Readiness Metrics
        </h2>
        <p>
          In industrial manufacturing, power generation, and critical web infrastructures, system uptime is the ultimate benchmark of operational success. This interactive <strong>system availability calculator</strong> is a premium tool designed to help reliability engineers, maintenance managers, and operations heads analyze and project system readiness. By inputting Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR), you can quickly evaluate your current inherent availability profile. In doing so, this tool bridges the gap between hardware engineering and corporate financial performance, acting as a crucial component of our <strong>reliability engineering calculator</strong> suite.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Defining Availability in Engineering Terms
        </h3>
        <p>
          Availability is defined as the probability that a system or piece of equipment will be in a functioning state at a given point in time when operated under specified conditions. Unlike reliability, which measures the probability that a system will operate *without interruption* over a specified interval, availability takes into account both how often a system breaks down and how fast it can be returned to service.
        </p>
        <p>
          To understand failure frequencies over time before calculating availability, engineers can leverage our <strong>MTBF calculator free</strong> online tool or perform a complete data-fit using our interactive <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull Analysis Tool</Link> to check whether equipment is experiencing infant mortality, random breakdowns, or end-of-life wear-out patterns.
        </p>

        <h2 id="how-to" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Three Dimensions of Uptime: Types of Availability
        </h2>
        <p>
          In reliability literature, availability is classified into three distinct categories based on which downtime elements are included in the mathematical model:
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Inherent Availability (<InlineMath math="A_i" />)
        </h3>
        <p>
          Inherent Availability represents the steady-state probability that an asset is operational, accounting *only* for active corrective maintenance (actual repair time). It represents the maximum design-level availability of the equipment under ideal conditions:
        </p>
        <div className="my-6">
          <BlockMath math="A_i = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}" />
        </div>
        
        <div className="my-8">
          <AvailabilityTimeline />
        </div>
        <p>
          This calculation assumes that spare parts are immediately available, technicians are standing by, and no administrative delays exist. It is the core metric modeled by our calculator. For deep-dive repair time calculations, you can use our dedicated <Link to="/tools/mttr" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">MTTR Calculator</Link> to analyze active repair actions.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. Achieved Availability (<InlineMath math="A_a" />)
        </h3>
        <p>
          Achieved Availability expands on inherent availability by including planned preventive maintenance (PM) activities. It is defined as:
        </p>
        <div className="my-6">
          <BlockMath math="A_a = \frac{\text{MTBM}}{\text{MTBM} + \text{MAMT}}" />
        </div>
        <p>
          Where <InlineMath math="\text{MTBM}" /> is the Mean Time Between Maintenance events (both corrective and preventive), and <InlineMath math="\text{MAMT}" /> is the Mean Active Maintenance Time. Achieved availability isolates the efficiency of the maintenance schedule itself, excluding external logistics.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. Operational Availability (<InlineMath math="A_o" />)
        </h3>
        <p>
          Operational Availability is the realistic metric experienced in day-to-day operations. It includes all forms of downtime: corrective repairs, planned preventive service, logistics delays (e.g., waiting for parts to be shipped), and administrative wait times (e.g., waiting for safety permit sign-offs). It is calculated as:
        </p>
        <div className="my-6">
          <BlockMath math="A_o = \frac{\text{Operating Time} + \text{Standby Time}}{\text{Total Calendar Time}}" />
        </div>
        <p>
          In many facilities, operational availability is significantly lower than inherent availability due to logistics bottlenecks. Keeping critical spares in stock or designing redundant systems is key to narrowing this gap.
        </p>

        <h2 id="applications" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Economic Cost of Unreliability
        </h2>
        <p>
          A fraction of a percentage point in availability can translate to millions of dollars in revenue. For instance, in a continuous-process chemical plant, an availability of 95% means the plant is down for 438 hours per year. If the hourly revenue risk is $10,000, this equates to a loss of $4.38 million. Improving availability to 98% reduces downtime by 263 hours, reclaiming $2.63 million in lost revenue.
        </p>
        <p>
          To justify the cost of purchasing higher-quality components or installing redundant backup systems, engineers should model the Total Cost of Ownership (TCO) using our <Link to="/tools/lcc" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Life Cycle Cost (LCC) Calculator</Link>.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Availability and Overall Equipment Effectiveness (OEE)
        </h3>
        <p>
          Availability is also the first and most critical pillar of Overall Equipment Effectiveness (OEE). OEE combines Availability, Performance (operating speed vs. design capacity), and Quality (good units produced vs. total units) into a single metric representing plant efficiency. If you are calculating total manufacturing throughput, you can input your availability directly into our <Link to="/oee-calculator" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">OEE Calculator</Link> to derive your total process efficiency.
        </p>

        <h2 id="standards" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Strategies for Maximizing System Availability
        </h2>
        <p>
          Reliability engineers utilize three primary levers to increase system availability:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Extend Uptime (Maximize MTBF):</strong> Use high-quality components, implement predictive monitoring to intervene before failure occurs, and design system redundancies. If you are designing parallel or standby configuration systems, you can calculate joint probabilities using our <Link to="/tools/k-out-of-n" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">K-out-of-N Redundancy Calculator</Link>.
          </li>
          <li>
            <strong>Minimize Repair Time (Minimize MTTR):</strong> Ensure replacement parts are stocked locally, standard operating procedures are drafted, and modular "plug-and-play" components are installed to speed up swap-out times.
          </li>
          <li>
            <strong>Eliminate Logistics Bottlenecks:</strong> Streamline administrative tasks, permit approvals, and vendor contracts.
          </li>
        </ul>
        <p>
          In almost all industrial settings, mathematically, <strong>reducing MTTR yields far higher and faster availability gains</strong> than attempting to engineer large MTBF improvements. For example, doubling a 1,000-hour MTBF to 2,000 hours (for a 10-hour repair) improves availability from 99.01% to 99.50%. However, cutting a 10-hour MTTR in half (5 hours, at 1,000-hour MTBF) yields the exact same 99.50% availability—often at a fraction of the cost of redesigning the equipment for double reliability.
        </p>
      </div>
    </div>
  );

  const faqs = [
    {
      question: 'Can availability be greater than 100%?',
      answer: 'No. Availability is a probability expressed as a percentage. The theoretical maximum is 100%, which would imply a system that never fails (MTBF = infinity) or takes literally zero seconds to repair (MTTR = 0).'
    },
    {
      question: 'Why does the calculator use Inherent Availability instead of Operational Availability?',
      answer: 'Inherent Availability focuses purely on the equipment\'s design (MTBF and active repair time). Operational Availability includes highly variable logistical factors (like shipping delays for a spare part from another country), making it difficult to benchmark pure engineering design tradeoffs.'
    },
    {
      question: 'What is the "Five Nines" standard?',
      answer: 'In industries like telecommunications and data centers, "Five Nines" refers to an availability of 99.999%. This equates to an allowable downtime of only 5.26 minutes per year.'
    },
    {
      question: 'What is the fastest way to improve availability?',
      answer: 'In almost all industrial settings, reducing MTTR provides much faster and computationally higher gains in availability than attempting to engineer large MTBF improvements. Focus on modular repairs, better tooling, and staging spare parts locally.'
    },
    {
      question: 'Why test Design A against Design B in the scenario analyzer?',
      answer: 'Scenario overlays allow engineers to visualize tradeoffs. For example, Design A might use expensive ultra-reliable parts (High MTBF, High Repair Time), while Design B uses cheaper, modular parts (Lower MTBF, but very fast MTTR). The overlay instantly shows which design yields better overall uptime.'
    }
  ];

  return (
    <ToolContentLayout
      title="Availability Calculator"
      description="Calculate Inherent Availability, visualize MTTR sensitivity at scale, and compare Design A/B scenarios with high-resolution exports."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="availability" />
        </>
      }
      faqs={faqs}
      keywords="availability calculator, system availability, MTBF MTTR availability, inherent availability, operational availability India, five nines, uptime calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/availability"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Availability Calculator',
        applicationCategory: 'BusinessApplication'
      }}
    />
  );
};

export default AvailabilityCalculator;
