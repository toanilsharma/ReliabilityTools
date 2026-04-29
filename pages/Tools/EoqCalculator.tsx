
import React, { useState } from 'react';
import { calculateEOQ } from '../../services/reliabilityMath';
import { Package, ShoppingCart, TrendingUp, Archive, Settings, Info } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const EoqCalculator: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  const [demand, setDemand] = useState<string>('1000');

  const [orderingCost, setOrderingCost] = useState<string>('50');
  const [holdingCost, setHoldingCost] = useState<string>('2.5');

  const eoq = calculateEOQ(parseFloat(demand) || 0, parseFloat(orderingCost) || 0, parseFloat(holdingCost) || 0);
  const ordersPerYear = (parseFloat(demand) || 0) / (eoq || 1);
  const { theme } = useTheme();

  const generateEoqData = React.useMemo(() => {
    const d = parseFloat(demand) || 0;
    const o = parseFloat(orderingCost) || 0;
    const h = parseFloat(holdingCost) || 0;
    if (d <= 0 || o <= 0 || h <= 0) return [];
    
    const optimalQ = Math.round(calculateEOQ(d, o, h));
    if (optimalQ === 0) return [];
    
    const step = Math.max(1, Math.round(optimalQ / 10));
    const maxQ = optimalQ * 2.5;
    
    const data = [];
    for (let q = step; q <= maxQ; q += step) {
      const holdC = (q / 2) * h;
      const orderC = (d / q) * o;
      const totalC = holdC + orderC;
      data.push([q, holdC, orderC, totalC]);
    }
    return data;
  }, [demand, orderingCost, holdingCost]);

  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    text: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8" ref={toolRef}>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Inventory Parameters
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Annual Demand (Units)
            <HelpTooltip text="Total quantity used per year." />
          </label>
          <input type="number" value={demand} onChange={e => setDemand(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Ordering Cost ($ per Order)
            <HelpTooltip text="Fixed cost to place one order (admin time, shipping, handling)." />
          </label>
          <input type="number" value={orderingCost} onChange={e => setOrderingCost(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Holding Cost ($ per Unit per Year)
            <HelpTooltip text="Cost to store one unit for one year (Storage space, insurance, capital interest)." />
          </label>
          <input type="number" value={holdingCost} onChange={e => setHoldingCost(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 p-8 rounded-xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm font-bold text-cyan-400 dark:text-cyan-600 uppercase tracking-widest mb-4">Optimal Order Quantity</div>
            <div className="text-6xl font-black mb-6">{Math.round(eoq)} <span className="text-xl font-medium opacity-50">Units</span></div>
            <div className="flex gap-4 text-sm opacity-80 border-t border-white/10 dark:border-slate-900/10 pt-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> {ordersPerYear.toFixed(1)} orders / year
              </div>
            </div>
          </div>
          <Archive className="absolute -right-6 -bottom-6 w-48 h-48 opacity-5 text-white dark:text-slate-900" />
        </div>

        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase">
            <Info className="w-4 h-4 text-cyan-600" /> Insight
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            By ordering <strong>{Math.round(eoq)}</strong> units at a time, you perfectly balance the cost of holding inventory against the cost of placing orders, mathematically minimizing your Total Cost of Ownership.
          </p>
        </div>

        {eoq > 0 && generateEoqData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-72">
            <ReactECharts
              option={{
                animation: false,
                grid: { left: '15%', right: '5%', top: '15%', bottom: '15%' },
                tooltip: { 
                  trigger: 'axis',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#334155',
                  textStyle: { color: '#f8fafc' },
                  formatter: (params: any) => {
                    const q = params[0].value[0];
                    let res = `<div class="font-bold border-b border-slate-700 pb-1 mb-1">Quantity: ${Math.round(q)}</div>`;
                    params.forEach((p: any) => {
                      res += `<div class="flex justify-between gap-4 mt-1"><span style="color:${p.color}">${p.seriesName}</span> <span class="font-mono">$${p.value[p.seriesIndex + 1].toFixed(2)}</span></div>`;
                    });
                    return res;
                  }
                },
                legend: { data: ['Holding Cost', 'Ordering Cost', 'Total Cost'], textStyle: { color: chartColors.text }, bottom: 0 },
                xAxis: { 
                  type: 'value', 
                  name: 'Order Quantity', 
                  nameLocation: 'middle', 
                  nameGap: 25, 
                  splitLine: { show: false }, 
                  axisLabel: { color: chartColors.text } 
                },
                yAxis: { 
                  type: 'value', 
                  name: 'Cost ($)', 
                  splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, 
                  axisLabel: { color: chartColors.text } 
                },
                series: [
                  { name: 'Holding Cost', type: 'line', data: generateEoqData, encode: { x: 0, y: 1 }, itemStyle: { color: '#0ea5e9' }, showSymbol: false },
                  { name: 'Ordering Cost', type: 'line', data: generateEoqData, encode: { x: 0, y: 2 }, itemStyle: { color: '#f59e0b' }, showSymbol: false },
                  { name: 'Total Cost', type: 'line', data: generateEoqData, encode: { x: 0, y: 3 }, itemStyle: { color: '#8b5cf6' }, lineStyle: { width: 3 }, showSymbol: false,
                    markLine: {
                      symbol: ['none', 'none'],
                      lineStyle: { type: 'dashed', color: '#10b981', width: 2 },
                      label: { formatter: 'EOQ', position: 'insideEndTop', color: '#10b981' },
                      data: [{ xAxis: eoq }]
                    }
                  }
                ]
              }}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
        <div className="mt-4">
          <ShareAndExport 
            toolName="EOQ Analysis"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={`EOQ: ${Math.round(eoq)} Units`}
            exportData={[
              { Parameter: "Annual Demand", Value: demand },
              { Parameter: "Ordering Cost", Value: "$" + orderingCost },
              { Parameter: "Holding Cost", Value: "$" + holdingCost },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "Optimal Quantity (EOQ)", Value: Math.round(eoq).toString() },
              { Parameter: "Orders per Year", Value: ordersPerYear.toFixed(2) }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Inventory Optimization Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Economic Order Quantity (EOQ) is an inventory management formula used to determine the ideal order volume to precisely minimize the total costs of warehouse space, capital tie-up, and shipping logistics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Trade-off Balance"
          icon={<ShoppingCart className="w-5 h-5" />}
          delay={0.1}
        >
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Frequent Small Batches:</strong> Generates high administrative/shipping overhead, but frees up warehouse space and liquid capital.</li>
            <li><strong>Infrequent Large Batches:</strong> Maximizes bulk discounts and minimizes logistics, but spikes holding costs (insurance, footprint) and risks obsolescence.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="Optimal Quantity Equation"
          icon={<TrendingUp className="w-5 h-5" />}
          formula="EOQ = \sqrt{\frac{2 \cdot D \cdot O}{H}}"
          delay={0.2}
        >
          <p>
            Where <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">D</span> = Annual Demand, <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">O</span> = Ordering Cost, and <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">H</span> = Holding Cost. This differential calculation definitively proves the lowest point on the Total Cost curve.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Does this account for bulk discounts?",
      answer: "No. The standard EOQ formula assumes a fixed price. If a vendor offers price breaks (e.g., 10% off if you buy 1000), you need to calculate the Total Cost for each price point manually to see if the discount outweighs the extra holding cost."
    },
    {
      question: "What is Holding Cost?",
      answer: "It includes the Cost of Capital (interest you could have earned), Storage Space (rent/electricity), Insurance, and Obsolescence risk. A common rule of thumb is <strong>20-25% of the item's value</strong> per year."
    }
  ];

  return (
    <ToolContentLayout
      title="EOQ Calculator"
      description="Calculate Economic Order Quantity (EOQ). Optimize your warehouse procurement by balancing ordering costs against holding costs for consumable parts."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "EOQ Calculator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default EoqCalculator;
