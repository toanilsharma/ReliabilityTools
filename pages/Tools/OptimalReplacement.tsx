import React, { useState, useMemo } from 'react';
import { calculateOptimalReplacementAge } from '../../services/reliabilityMath';
import ReactECharts from 'echarts-for-react';
import { RefreshCcw, AlertTriangle, Settings, Clock } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const OptimalReplacement: React.FC = () => {
  const [costPreventive, setCostPreventive] = useState<string>('500');
  const [costFailure, setCostFailure] = useState<string>('5000');
  const [beta, setBeta] = useState<string>('2.5');
  const [eta, setEta] = useState<string>('10000');

  const result = useMemo(() => {
    const cp = parseFloat(costPreventive);
    const cf = parseFloat(costFailure);
    const b = parseFloat(beta);
    const e = parseFloat(eta);

    if (isNaN(cp) || isNaN(cf) || isNaN(b) || isNaN(e) || b <= 1) return null;
    return calculateOptimalReplacementAge(cp, cf, b, e);
  }, [costPreventive, costFailure, beta, eta]);

  const option = result ? {
    grid: { left: '10%', right: '5%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `Age: ${Number(p.value[0]).toFixed(1)} h<br/>Cost: $${Number(p.value[1]).toFixed(2)} / h`;
      }
    },
    xAxis: {
      type: 'value',
      name: 'Replacement Age (hours)',
      nameLocation: 'middle' as const,
      nameGap: 28,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      name: 'Cost / Hour ($)',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: '#06b6d4' },
        data: result.curve.map((c) => [c.t, c.costRate]),
      },
      {
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#ef4444' },
        data: [[result.optimalTime, result.minCostRate]],
      },
    ],
  } : null;

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Cost of Preventive (Cp)
                <HelpTooltip text="Planned replacement cost." />
              </label>
              <input type="number" value={costPreventive} onChange={e => setCostPreventive(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Cost of Failure (Cf)
                <HelpTooltip text="Unplanned failure cost including downtime." />
              </label>
              <input type="number" value={costFailure} onChange={e => setCostFailure(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weibull Shape (beta)</label>
              <input type="number" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
              {parseFloat(beta) <= 1 && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3" /> PM is ineffective for beta &lt;= 1
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weibull Scale (eta)</label>
              <input type="number" value={eta} onChange={e => setEta(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-bold uppercase opacity-80 mb-1">Optimal Replacement Age</div>
                  <div className="text-4xl font-extrabold mb-2">
                    {result.optimalTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-lg font-medium opacity-80">Hours</span>
                  </div>
                </div>
                <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Minimum Cost Rate</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  ${result.minCostRate.toFixed(2)} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ Hour</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg h-[420px] flex flex-col">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Cost Optimization Curve</h3>
              <div className="flex-grow">
                <ReactECharts option={option!} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 p-12 text-center">
            <RefreshCcw className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Input Data Needed</h3>
            <p className="max-w-md">Please ensure beta &gt; 1.0.</p>
          </div>
        )}
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">Optimal Replacement Age</h2>
      <p>
        Balance preventive and corrective maintenance cost to find the lowest long-run cost rate.
      </p>
    </div>
  );

  return (
    <ToolContentLayout
      title="Optimal Replacement Age Calculator"
      description="Determine the preventive maintenance interval that minimizes total operating cost."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Optimal Replacement Age Calculator', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default OptimalReplacement;

