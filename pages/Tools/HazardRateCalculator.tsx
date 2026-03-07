import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, Zap } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const HazardRateCalculator: React.FC = () => {
  const [beta, setBeta] = useState<string>('1.5');
  const [eta, setEta] = useState<string>('1000');
  const [timeHorizon, setTimeHorizon] = useState<string>('2000');

  const data = useMemo(() => {
    const b = parseFloat(beta) || 1.5;
    const e = parseFloat(eta) || 1000;
    const maxT = parseFloat(timeHorizon) || 2000;
    const points = [] as Array<{ t: number; h: number }>;

    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * maxT;
      const h = t > 0 ? (b / e) * Math.pow((t / e), b - 1) : 0;
      points.push({ t, h });
    }
    return points;
  }, [beta, eta, timeHorizon]);

  const option = {
    grid: { left: '10%', right: '5%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `Time: ${Number(p.value[0]).toFixed(1)}<br/>h(t): ${Number(p.value[1]).toExponential(4)}`;
      },
    },
    xAxis: {
      type: 'value',
      name: 'Time (t)',
      nameLocation: 'middle' as const,
      nameGap: 26,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      name: 'Failure Rate h(t)',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: '#06b6d4' },
        areaStyle: { color: 'rgba(6,182,212,0.12)' },
        data: data.map((d) => [d.t, d.h]),
      },
    ],
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600" /> Weibull Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Shape (beta)
              <HelpTooltip text="Slope of hazard profile." why="beta determines whether failure risk is decreasing, flat, or increasing." />
            </label>
            <input type="number" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scale (eta)</label>
            <input type="number" value={eta} onChange={e => setEta(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Horizon</label>
            <input type="number" value={timeHorizon} onChange={e => setTimeHorizon(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl h-[450px] flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" /> Hazard Rate Function h(t)
          </h3>
          <div className="flex-grow">
            <ReactECharts option={option} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">Hazard Rate Interpretation</h2>
      <p>
        Hazard rate captures instantaneous failure risk conditional on survival up to time t.
      </p>
      <ul>
        <li><strong>beta &lt; 1:</strong> Decreasing hazard (infant mortality).</li>
        <li><strong>beta = 1:</strong> Constant hazard (random failures).</li>
        <li><strong>beta &gt; 1:</strong> Increasing hazard (wear out).</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="Hazard Rate Calculator"
      description="Visualize instantaneous failure rate h(t) using Weibull parameters with high-performance ECharts rendering."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Hazard Rate Calculator', applicationCategory: 'UtilitiesApplication' }}
    />
  );
};

export default HazardRateCalculator;
