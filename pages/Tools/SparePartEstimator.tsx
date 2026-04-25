
import React, { useState } from 'react';
import { calculateSpareParts } from '../../services/reliabilityMath';
import { SERVICE_LEVELS } from '../../constants';
import { Package, ShoppingCart, Info, BookOpen, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';

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

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const poissonData = React.useMemo(() => {
    if (!result) return { spares: [] as number[], probs: [] as number[] };
    const lambda = result.leadTimeDemand;
    const spares: number[] = [];
    const probs: number[] = [];
    
    for (let k = 0; k <= Math.max(10, Math.ceil(lambda * 3)); k++) {
      let prob = Math.exp(-lambda);
      for (let i = 1; i <= k; i++) {
        prob *= lambda / i;
      }
      spares.push(k);
      probs.push(parseFloat((prob * 100).toFixed(2)));
    }
    return { spares, probs };
  }, [result]);

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
          <>
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

          {poissonData.spares.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-64 shadow-sm sm:col-span-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-600" /> Poisson Demand Distribution
              </h4>
              <ReactECharts
                option={{
                  animation: false,
                  grid: { left: '10%', right: '5%', top: '10%', bottom: '20%' },
                  tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].value} spares: ${poissonData.probs[p[0].dataIndex]}% probability`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
                  xAxis: { type: 'category', data: poissonData.spares.map(String), name: 'Spares Needed', nameLocation: 'middle', nameGap: 25, axisLabel: { color: chartColors.axis } },
                  yAxis: { type: 'value', name: 'Probability (%)', splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, axisLabel: { color: chartColors.axis } },
                  series: [{
                    type: 'bar',
                    data: poissonData.probs,
                    itemStyle: {
                      color: (params: any) => params.dataIndex <= (result?.reorderPoint || 0) ? '#06b6d4' : '#94a3b8',
                      borderRadius: [4, 4, 0, 0]
                    },
                    label: { show: poissonData.spares.length <= 15, position: 'top', color: chartColors.axis, fontSize: 9, formatter: '{c}%' }
                  }]
                }}
                style={{ height: 'calc(100% - 24px)', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          )}
          </>
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
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Statistical Inventory Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Carrying arbitrary inventory costs approximately 20-25% of the capital value per year. Conversely, a stock-out of a critical spare costs orders of magnitude more in raw downtime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Reorder Point (ROP)"
          icon={<TrendingUp className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The critical inventory threshold triggering a replenishment order. Composed of your expected consumption while awaiting the shipment, plus your buffered safety stock.
          </p>
          <code className="block mt-2 font-mono text-center bg-slate-100 dark:bg-slate-900 p-2 rounded text-slate-600 dark:text-slate-400">
            ROP = (Lead Time Demand) + Safety Stock
          </code>
        </TheoryBlock>

        <TheoryBlock 
          title="Safety Stock Tolerance"
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The "Service Level" defines the statistical probability that a part is available the second maintenance reaches for it.
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><strong>99% (High):</strong> "A-Class" critical assets. Unacceptable downtime.</li>
            <li><strong>95% (Standard):</strong> The baseline median for optimal risk-to-cost ratios.</li>
            <li><strong>80% (Low):</strong> Non-essential hardware. Stock-outs are permitted.</li>
          </ul>
        </TheoryBlock>
      </div>
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
