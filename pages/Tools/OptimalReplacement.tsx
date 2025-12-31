
import React, { useState, useMemo } from 'react';
import { calculateOptimalReplacementAge } from '../../services/reliabilityMath';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import { RefreshCcw, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

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

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Optimal Replacement Age Calculator",
    "description": "Calculate the optimal preventive maintenance interval to minimize costs based on Weibull parameters.",
    "applicationCategory": "BusinessApplication"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Optimal Replacement Age</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Determine the exact time to replace a component to minimize the total cost per unit time. This balances the cost of preventive replacement against the risk and cost of unplanned failure.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Cost Inputs
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cost of Preventive (Cp)
                  <HelpTooltip text="Total cost to replace the part scheduled (Parts + Labor + Scheduled Downtime)." />
                </label>
                <input type="number" value={costPreventive} onChange={e => setCostPreventive(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cost of Failure (Cf)
                  <HelpTooltip text="Total cost if it breaks (Parts + Labor + Emergency Downtime + Collateral Damage)." />
                </label>
                <input type="number" value={costFailure} onChange={e => setCostFailure(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Reliability Data
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Weibull Shape (&beta;)
                  <HelpTooltip text="Must be > 1.0 (Wear out). If Beta <= 1, random failure dominates and PM is not effective." />
                </label>
                <input type="number" step="0.1" value={beta} onChange={e => setBeta(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
                {parseFloat(beta) <= 1 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> PM ineffective for Beta &le; 1
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Weibull Scale (&eta;)
                  <HelpTooltip text="Characteristic life (time at which 63.2% fail)." />
                </label>
                <input type="number" value={eta} onChange={e => setEta(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Results & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                  <div className="text-xs font-bold uppercase opacity-80 mb-1">Optimal Replacement Time</div>
                  <div className="text-4xl font-extrabold mb-2">
                    {result.optimalTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-lg font-medium opacity-80">Hours</span>
                  </div>
                  <p className="text-xs opacity-90">Replace the component at this age to minimize costs.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Minimum Cost Rate</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    ${result.minCostRate.toFixed(2)} <span className="text-sm font-medium text-slate-500">/ Hour</span>
                  </div>
                  <p className="text-xs text-slate-500">The lowest possible long-term cost per operating hour.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg h-[400px] flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Cost Optimization Curve</h3>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.curve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="t" 
                        type="number" 
                        stroke="#94a3b8" 
                        label={{ value: 'Time (Hours)', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 12 }} 
                        tickFormatter={(val) => val.toFixed(0)}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        label={{ value: 'Cost / Hour ($)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} 
                      />
                      <Tooltip 
                        formatter={(val: number) => `$${val.toFixed(2)}`}
                        labelFormatter={(label) => `Age: ${Math.round(Number(label))} hrs`}
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="costRate" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <ReferenceLine x={result.optimalTime} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Optimal', fill: '#ef4444', fontSize: 12 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 p-12 text-center">
              <RefreshCcw className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-bold mb-2">Input Data Needed</h3>
              <p className="max-w-md">
                Enter valid costs and Weibull parameters. Note: This calculation is only valid for wear-out failure modes where <strong>Beta &gt; 1.0</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentToolId="optimal-replacement" />
    </div>
  );
};

export default OptimalReplacement;
