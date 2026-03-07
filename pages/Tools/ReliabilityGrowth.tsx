import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ReliabilityGrowth: React.FC = () => {
  const [inputData, setInputData] = useState<string>('12.5\n28.0\n49.5\n75.2\n118.0\n185.0\n270.0');

  const { points, beta, lambda, fitLine, outliers } = useMemo(() => {
    const times = inputData
      .split(/[\n,]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);

    if (times.length < 2) return { points: [], beta: 0, lambda: 0, fitLine: [] as Array<{ t: number; n: number }>, outliers: [] };

    const pts = times.map((t, index) => {
      const n = index + 1;
      return { t, n, lnT: Math.log(t), lnN: Math.log(n) };
    });

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const count = pts.length;

    pts.forEach(p => {
      sumX += p.lnT;
      sumY += p.lnN;
      sumXY += p.lnT * p.lnN;
      sumXX += p.lnT * p.lnT;
    });

    const b = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
    const intercept = (sumY - b * sumX) / count;
    const l = Math.exp(intercept);

    const minT = pts[0].t * 0.8;
    const maxT = pts[count - 1].t * 1.2;

    const line = [
      { t: minT, n: l * Math.pow(minT, b) },
      { t: maxT, n: l * Math.pow(maxT, b) },
    ];

    // Outlier Detection (Cook's distance style simplified)
    const residuals = pts.map(p => {
      const pred = l * Math.pow(p.t, b);
      return Math.abs(p.n - pred);
    });
    const meanRes = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const stdRes = Math.sqrt(residuals.reduce((a, b) => a + Math.pow(b - meanRes, 2), 0) / residuals.length);
    const limit = meanRes + 2.5 * stdRes;

    const outlierIndices = residuals
      .map((r, i) => r > limit ? i : -1)
      .filter(i => i !== -1);

    return { 
      points: pts, 
      beta: b, 
      lambda: l, 
      fitLine: line,
      outliers: outlierIndices.map(i => pts[i])
    };
  }, [inputData]);

  const chartOption = {
    grid: { left: '10%', right: '5%', bottom: '15%' },
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => `Time: ${Number(p.value[0]).toFixed(2)}<br/>Cumul. Failures: ${Number(p.value[1]).toFixed(1)}`,
    },
    xAxis: {
      type: 'log',
      name: 'Cumulative Time',
      nameLocation: 'middle' as const,
      nameGap: 30,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#cbd5e1', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'log',
      name: 'Cumulative Failures',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#cbd5e1', type: 'dashed' as const } },
    },
    series: [
      { 
        type: 'scatter', 
        name: 'Actual', 
        itemStyle: { color: '#0ea5e9' }, 
        data: points.map((p) => [p.t, p.n]) 
      },
      { 
        type: 'line', 
        name: 'Trend', 
        showSymbol: false, 
        lineStyle: { color: '#f43f5e', width: 2 }, 
        data: fitLine.map((p) => [p.t, p.n]) 
      },
      {
        name: 'Anomalies',
        type: 'scatter',
        symbol: 'diamond',
        symbolSize: 12,
        itemStyle: { color: '#f59e0b', borderColor: '#fff', borderWidth: 2 },
        data: outliers.map(p => [p.t, p.n])
      }
    ],
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Cumulative Test Times
            <HelpTooltip 
              text="Input the cumulative operating time for each failure event."
              why="Crow-AMSAA requires the absolute timeline of failures to calculate growth velocity."
              formula="N(t) = λt^β"
            />
          </label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={10}
            className="w-full text-sm font-mono p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded outline-none focus:border-cyan-500 transition-all"
            placeholder="12.5&#10;28.0&#10;49.5..."
          />
        </div>

        {points.length > 1 && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 shadow-sm">Growth (β)</div>
                <div className={`text-2xl font-black ${beta < 1 ? 'text-emerald-500' : 'text-red-500'}`}>{beta.toFixed(3)}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 shadow-sm">Scale (λ)</div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-200">{lambda.toFixed(4)}</div>
              </div>
            </div>

            <div className={`p-4 rounded-xl flex items-center gap-4 border ${beta < 1 ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300' : beta > 1 ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-300' : 'bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm shrink-0">
                {beta < 1 ? <TrendingUp className="w-6 h-6" /> : beta > 1 ? <TrendingDown className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs uppercase tracking-tight leading-none mb-1">{beta < 1 ? 'Reliability is Growing' : beta > 1 ? 'Reliability is Worsening' : 'Constant Rate'}</h4>
                <p className="text-[10px] opacity-80 leading-tight">
                  {beta < 1 ? 'Failures are slowing down. Good job.' : 'Critical failure concentration detected.'}
                </p>
              </div>
            </div>

            {outliers.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-[10px] text-amber-800 dark:text-amber-400 font-bold leading-tight">
                  Detected {outliers.length} statistical anomalies in the trend. These events may have unique root causes.
                </div>
              </div>
            )}

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-inner">
               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Crow-AMSAA Process</h4>
               <BlockMath math={`N(t) = ${lambda.toFixed(4)} \\cdot t^{${beta.toFixed(3)}}`} />
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="h-[500px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2 flex items-center justify-between">
            Crow-AMSAA Log-Log Model
            <span className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] border border-slate-200 dark:border-slate-700">Trend Fit Verification</span>
          </h3>
          <div className="h-[400px]">
             <ReactECharts option={chartOption} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Reliability Growth (Crow-AMSAA)</h2>
      <p>
        The Crow-AMSAA model tracks the effectiveness of "Test-Analyze-Fix" programs. By plotting the cumulative number of failures against cumulative test time, we can calculate the **Beta (β)** growth parameter.
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="text-emerald-800 dark:text-emerald-400 font-black text-xs uppercase mb-2">Growth (β &lt; 1.0)</h4>
          <p className="text-xs">Corrective actions are preventing recurrence. The time between failures is increasing.</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
          <h4 className="text-red-800 dark:text-red-400 font-black text-xs uppercase mb-2">Degradation (β &gt; 1.0)</h4>
          <p className="text-xs">System reliability is worsening. New defects are being introduced during the fix process.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="Reliability Growth Tracker"
      description="Monitor TAAF (Test-Analyze-And-Fix) programs with industrial-grade Crow-AMSAA trend analysis and anomaly detection."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Reliability Growth Model', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default ReliabilityGrowth;

