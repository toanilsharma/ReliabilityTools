
import React, { useState, useMemo } from 'react';
import { calculateOptimalReplacementAge } from '../../services/reliabilityMath';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { RefreshCcw, DollarSign, TrendingUp, AlertTriangle, Calculator, BookOpen, Target, Settings } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const OptimalReplacement: React.FC = () => {
  const [costPreventive, setCostPreventive] = useState<string>('500');
  const [costFailure, setCostFailure] = useState<string>('5000');
  const [beta, setBeta] = useState<string>('2.5'); // Wear out
  const [eta, setEta] = useState<string>('10000');

  const result = useMemo(() => {
    const cp = parseFloat(costPreventive);
    const cf = parseFloat(costFailure);
    const b = parseFloat(beta);
    const e = parseFloat(eta);

    if (isNaN(cp) || isNaN(cf) || isNaN(b) || isNaN(e) || b <= 1) {
      return null;
    }

    return calculateOptimalReplacementAge(cp, cf, b, e);
  }, [costPreventive, costFailure, beta, eta]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Cost of Preventive (Cp)
                <HelpTooltip text="Total cost to replace the part scheduled (Parts + Labor + Scheduled Downtime)." />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                <input type="number" value={costPreventive} onChange={e => setCostPreventive(e.target.value)} className="w-full pl-6 p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Cost of Failure (Cf)
                <HelpTooltip text="Total cost if it breaks (Parts + Labor + Emergency Downtime + Collateral Damage)." />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                <input type="number" value={costFailure} onChange={e => setCostFailure(e.target.value)} className="w-full pl-6 p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Weibull Shape (&beta;)
                  <HelpTooltip text="Must be > 1.0 (Wear out). If Beta <= 1, random failure dominates and PM is not effective." />
                </label>
                <input type="number" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-cyan-500" />
                {parseFloat(beta) <= 1 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3" /> PM is ineffective for Beta &le; 1
                  </p>
                )}
              </div>
              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Weibull Scale (&eta;)
                  <HelpTooltip text="Characteristic life (time at which 63.2% fail)." />
                </label>
                <input type="number" value={eta} onChange={e => setEta(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Chart */}
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
                  <p className="text-xs opacity-90">Maximize value by replacing at this interval.</p>
                </div>
                <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Minimum Cost Rate</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  ${result.minCostRate.toFixed(2)} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ Hour</span>
                </div>
                <p className="text-xs text-slate-400">Lowest possible cost of operation.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg h-[400px] flex flex-col">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Cost Optimization Curve</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.curve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis
                      dataKey="t"
                      type="number"
                      stroke="#94a3b8"
                      label={{ value: 'Replacement Age (Hours)', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(val) => val.toFixed(0)}
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      label={{ value: 'Cost / Hour ($)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(val: number) => `$${val.toFixed(2)}`}
                      labelFormatter={(label) => `Age: ${Math.round(Number(label))} hrs`}
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="costRate" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <ReferenceLine x={result.optimalTime} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Optimal Point', fill: '#ef4444', fontSize: 12, position: 'insideTopRight' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 p-12 text-center">
            <RefreshCcw className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Input Data Needed</h3>
            <p className="max-w-md">
              Please ensure Beta &gt; 1.0. This calculation determines the "Sweet Spot" for replacing wearing parts.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is Optimal Replacement Age (ORA)?</h2>
      <p>
        For components that "wear out" (where failure rate increases over time, &beta; &gt; 1), there is a mathematical "sweet spot" for replacement.
      </p>
      <ul>
        <li><strong>Replacing too early</strong> wastes the remaining life of the component (high Preventive Cost).</li>
        <li><strong>Replacing too late</strong> risks expensive catastrophic failure (high Failure Cost).</li>
      </ul>
      <p>
        The ORA calculation finds the replacement interval that minimizes the <strong>Total Cost per Unit Time</strong>.
      </p>

      <h2 id="formula">The Math</h2>
      <p>
        The model minimizes the cost function:
      </p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4 overflow-x-auto text-sm">
        C(t) = [Cp × R(t) + Cf × (1 - R(t))] / ∫ R(t) dt
      </div>
      <p>
        Where <code>Cp</code> is Preventive Cost, <code>Cf</code> is Failure Cost, and <code>R(t)</code> is the Reliability function.
      </p>

      <h2 id="application">When to use this?</h2>
      <p>
        Use this tool for <strong>Age-Based Maintenance</strong> (e.g., replacing a conveyer belt every 5,000 hours). It is NOT useful for random failure modes (like electronics), where the failure rate is constant. For those, use Condition Monitoring instead.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "Why must Beta be > 1?",
      answer: "If Beta &le; 1, the failure rate is constant or decreasing. Replacing an old part with a new one does not improve reliability (and might be worse due to infant mortality). Therefore, the 'optimal' age is infinite (run to failure)."
    },
    {
      question: "What items costs should be included in Cf (Cost of Failure)?",
      answer: "Include <strong>everything</strong>: The spare part, labor (usually overtime), production downtime (lost profit), collateral damage to other machines, and safety/environmental cleanup costs."
    },
    {
      question: "Is this the same as PF Interval?",
      answer: "No. This is a statistical calculation based on <em>history</em> (Weibull). The PF Interval is a physical property based on <em>condition detection</em> (Warning time). If you can detect failure (PdM), always use PdM over Age Management."
    }
  ];

  return (
    <ToolContentLayout
      title="Optimal Replacement Age Calculator"
      description="Determine the exact preventive maintenance interval that minimizes total cost. Balance the cost of planned replacement against the risk of unplanned failure."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Optimal Replacement Age Calculator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default OptimalReplacement;
