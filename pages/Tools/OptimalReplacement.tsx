import React, { useState, useMemo } from 'react';
import { calculateOptimalReplacementAge } from '../../services/reliabilityMath';
import ReactECharts from 'echarts-for-react';
import { RefreshCcw, AlertTriangle, Settings, Clock } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const OptimalReplacement: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
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
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

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
        <div className="mt-4">
          <ShareAndExport 
            toolName="Optimal Replacement Age"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={result ? `Opt: ${Math.round(result.optimalTime)}h` : ""}
            exportData={[
              { Parameter: "PM Cost (Cp)", Value: "$" + costPreventive },
              { Parameter: "CM Cost (Cf)", Value: "$" + costFailure },
              { Parameter: "Beta (Shape)", Value: beta },
              { Parameter: "Eta (Scale)", Value: eta },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "Optimal Age", Value: result ? Math.round(result.optimalTime).toString() : "N/A" },
              { Parameter: "Min Cost Rate", Value: result ? "$" + result.minCostRate.toFixed(2) + "/hr" : "N/A" }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Total Cost Optimization</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Discover the absolute lowest operating cost point by mathematically balancing preventive replacements against the financial penalty of unplanned failure downtime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Cost Equation"
          icon={<Settings className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The optimization engine finds the minimum point of the cost rate function where the mathematical derivative equals zero. This requires the Weibull shape and scale parameters to predict wear-out.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Prerequisites for PM Effectiveness"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          delay={0.2}
        >
          <ul className="space-y-2 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Wear-Out Profile:</strong> The asset must exhibit a definite wear-out characteristic (Weibull <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">\beta &gt; 1</span>). Scheduled maintenance is completely ineffective for random failures.</li>
            <li><strong>Economic Advantage:</strong> The cost of unplanned failure (<span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">C_f</span>) must be strictly greater than a planned replacement cost (<span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">C_p</span>).</li>
          </ul>
        </TheoryBlock>
      </div>
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

