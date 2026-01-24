
import React, { useState } from 'react';
import { calculateSpareParts } from '../../services/reliabilityMath';
import { SERVICE_LEVELS } from '../../constants';
import { Package, ShoppingCart, Info, BookOpen, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const SparePartEstimator: React.FC = () => {
  const [mtbf, setMtbf] = useState<string>('5000');
  const [usage, setUsage] = useState<string>('8760');
  const [quantity, setQuantity] = useState<string>('1');
  const [leadTime, setLeadTime] = useState<string>('30');
  const [serviceLevelIdx, setServiceLevelIdx] = useState<number>(1); // Default 95%

  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(mtbf);
    const u = parseFloat(usage);
    const q = parseFloat(quantity);
    const l = parseFloat(leadTime);

    if (!isNaN(m) && !isNaN(u) && !isNaN(q) && !isNaN(l) && m > 0) {
      setResult(calculateSpareParts(m, u, q, l, SERVICE_LEVELS[serviceLevelIdx].z));
    }
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Inputs
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              MTBF (Hours)
              <HelpTooltip text="Mean Time Between Failures. Source: Vendor datasheet, historical calculation, or OREDA database." />
            </label>
            <input type="number" value={mtbf} onChange={e => setMtbf(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Annual Usage (Hrs/Unit)
              <HelpTooltip text="Hours per year the equipment runs. 8760 = 24/7 operation. Source: Production schedule." />
            </label>
            <input type="number" value={usage} onChange={e => setUsage(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Qty Installed
                <HelpTooltip text="Number of identical parts used in the system." />
              </label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Lead Time (Days)
                <HelpTooltip text="Days to receive the part after ordering." />
              </label>
              <input type="number" value={leadTime} onChange={e => setLeadTime(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Service Level (Risk)
              <HelpTooltip text="Probability that you will have the part when needed." />
            </label>
            <select
              value={serviceLevelIdx}
              onChange={e => setServiceLevelIdx(parseInt(e.target.value))}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {SERVICE_LEVELS.map((sl, idx) => (
                <option key={sl.label} value={idx}>{sl.label} ({sl.z})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <Package className="w-4 h-4" /> Calculate Stock
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Recommended Reorder Point (ROP)</div>
              <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-2">{result.reorderPoint} <span className="text-lg text-slate-500 font-medium">Units</span></div>
              <div className="text-xs text-slate-500">Order immediately when stock drops to this level.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Safety Stock</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.safetyStock}</div>
              <div className="text-xs text-slate-500">Buffer held for demand surges or delays.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Annual Consumption</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.annualDemand.toFixed(1)}</div>
              <div className="text-xs text-slate-500">Expected usage per year.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Lead Time Demand</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.leadTimeDemand.toFixed(1)}</div>
              <div className="text-xs text-slate-500">Consumption while waiting for resupply.</div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center text-slate-400">
            <Package className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter MTBF and Lead Time to calculate optimal inventory levels.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Calculation Logic
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div className="bg-white dark:bg-black/20 p-2 rounded border border-slate-200 dark:border-transparent">
              Demand (D) = (Usage × Qty) / MTBF
            </div>
            <div className="bg-white dark:bg-black/20 p-2 rounded border border-slate-200 dark:border-transparent">
              Safety Stock = Z × √ (Lead Time Demand)
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">
            Based on Poisson distribution approximation for slow-moving spare parts (IEC 62550).
          </p>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">Why Statistical Spare Parts Estimation?</h2>
      <p>
        Carrying inventory costs money (roughly 20-25% of the part's value per year in storage, insurance, and depreciation). However, running out of a critical spare part costs even more in lost production.
      </p>
      <p>
        Instead of guessing ("let's buy 2 just in case"), this tool uses your equipment's reliability data (MTBF) to statistically calculate exactly how many parts you need to achieve a desired service level.
      </p>

      <h2 id="service-level">Understanding Service Level</h2>
      <p>
        <strong>Service Level</strong> is the probability that a part will be on the shelf when you reach for it.
      </p>
      <ul>
        <li><strong>99% (High Criticality):</strong> For A-critical assets where downtime is unacceptable. High safety stock.</li>
        <li><strong>95% (Standard):</strong> The industry standard balance between cost and risk.</li>
        <li><strong>80% (Low Criticality):</strong> For non-essential items where waiting a few days is acceptable.</li>
      </ul>

      <h2 id="definitions">Key Definitions</h2>
      <dl>
        <dt><strong>Reorder Point (ROP):</strong></dt>
        <dd>The inventory level that triggers a new order. <code>ROP = Lead Time Demand + Safety Stock</code>.</dd>

        <dt><strong>Safety Stock:</strong></dt>
        <dd>Extra inventory held to protect against variability in demand or supplier delays.</dd>

        <dt><strong>Lead Time Demand:</strong></dt>
        <dd>How many parts you will consume while waiting for the shipment to arrive.</dd>
      </dl>
    </div>
  );

  const faqs = [
    {
      question: "Can I use this for consumables like oil/filters?",
      answer: "No. Consumables have deterministic demand (you know exactly when you will change them). This tool is for <strong>stochastic</strong> (random) failures, like bearings, seals, or motors breaking unexpectedly."
    },
    {
      question: "What if I don't know the MTBF?",
      answer: "Check the 'Recommended Spare Parts' list from the OEM, use industry data (OREDA/IEEE), or estimate based on how many you used in the last 5 years."
    },
    {
      question: "Why is the Reorder Point sometimes lower than Safety Stock?",
      answer: "It shouldn't be. ROP is always Safety Stock + Lead Time Demand. If Lead Time is 0, then ROP = Safety Stock."
    }
  ];

  return (
    <ToolContentLayout
      title="Spare Part Estimator"
      description="Optimize your MRO inventory. Calculate Safety Stock and Reorder Points (ROP) based on equipment reliability (MTBF) and your acceptable risk level."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Spare Part Estimator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default SparePartEstimator;
