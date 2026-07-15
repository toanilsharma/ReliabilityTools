
import React, { useState } from 'react';
import { calculateEOQ } from '../../services/reliabilityMath';
import { Package, ShoppingCart, TrendingUp, Archive, Settings, Info, Landmark } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';
import { EoqInventorySawtooth } from '../../components/TheoryVisuals';


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

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-205 dark:border-slate-700/80 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Inventory Parameters
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Annual Demand (Units)
            <HelpTooltip text="Total quantity used per year." />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number"
              value={demand}
              onChange={e => setDemand(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded-lg pl-4 pr-16 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-550">units</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Ordering Cost ($ per Order)
            <HelpTooltip text="Fixed cost to place one order (admin time, shipping, handling)." />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-550">$</span>
            </div>
            <input
              type="number"
              value={orderingCost}
              onChange={e => setOrderingCost(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-755 rounded-lg pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Holding Cost ($ per Unit per Year)
            <HelpTooltip text="Cost to store one unit for one year (Storage space, insurance, capital interest)." />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-550">$</span>
            </div>
            <input
              type="number"
              value={holdingCost}
              onChange={e => setHoldingCost(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-755 rounded-lg pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          {/* Glowing blur background halo */}
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          
          <div className="relative bg-gradient-to-br from-cyan-600 to-blue-750 p-8 rounded-2xl text-white shadow-xl overflow-hidden h-full flex flex-col justify-center">
            <div className="relative z-10">
              <div className="text-xs font-bold uppercase opacity-85 mb-3 tracking-widest">Optimal Order Quantity (EOQ)</div>
              <div className="text-5xl font-black mb-4 font-mono">{Math.round(eoq)} <span className="text-lg font-medium opacity-85">Units</span></div>
              <div className="flex gap-4 text-xs opacity-85 border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShoppingCart className="w-4 h-4" /> {ordersPerYear.toFixed(1)} orders / year
                </div>
              </div>
            </div>
            <Archive className="absolute -right-6 -bottom-6 w-48 h-48 opacity-5 text-white rotate-12" />
          </div>
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
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Understanding <span className="text-cyan-600 dark:text-cyan-400">Economic Order Quantity (EOQ)</span> & Inventory Cost Minimization
        </h2>
        <p>
          In maintenance operations and industrial supply chain management, warehousing spare parts represents a massive capital allocation. The <span className="font-extrabold text-cyan-600 dark:text-cyan-400">Economic Order Quantity (EOQ) calculator</span> solves the classic trade-off between ordering costs (replenishment overhead) and holding costs (warehouse carrying costs). By mathematically optimizing the inventory reorder volume, managers can avoid both excessive warehouse expenditures and sudden production-stopping spare part stockouts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Trade-off Balance"
          icon={<ShoppingCart className="w-5 h-5 text-cyan-650" />}
          delay={0.1}
        >
          <ul className="space-y-2 text-sm">
            <li><strong className="text-amber-600 dark:text-amber-400">Small Frequent Batches:</strong> Low warehouse footprint and carrying costs, but high ordering administration, shipping overhead, and stockout risk.</li>
            <li><strong className="text-rose-650 dark:text-rose-455">Large Infrequent Batches:</strong> Fewer purchase orders and lower shipping fees, but high warehouse rent, insurance, tied-up working capital, and obsolescence risk.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="Optimal Quantity Equation"
          icon={<TrendingUp className="w-5 h-5 text-cyan-600" />}
          formula="EOQ = \sqrt{\frac{2 \cdot D \cdot O}{H}}"
          delay={0.2}
        >
          <p>
            Where <InlineMath math="D" /> = Annual Demand, <InlineMath math="O" /> = Ordering Cost per order, and <InlineMath math="H" /> = Holding Cost per unit per year. The derivative of the total cost curve proves that the absolute lowest cost occurs at the intersection of ordering and holding costs.
          </p>
        </TheoryBlock>
      </div>

      <div className="my-8">
        <EoqInventorySawtooth />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
        📖 Step-by-Step Practical Example: Conveyor Belt Rollers
      </h3>

      <div className="space-y-4 text-sm leading-relaxed text-slate-750 dark:text-slate-300">
        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: Gather Parameters</span>
          <p className="mt-1">
            Let's optimize spare roller procurement for a packaging facility conveyor:
            <br />
            &nbsp;&nbsp;• Annual Demand: <InlineMath math="D = 1{,}200 \text{ rollers / year}" />
            <br />
            &nbsp;&nbsp;• Ordering Cost: <InlineMath math="O = \$75 \text{ per order}" /> (requisitions, inspection, delivery log)
            <br />
            &nbsp;&nbsp;• Holding Cost: <InlineMath math="H = \$4.50 \text{ per roller / year}" /> (carrying cost calculated as 20% of the $22.50 unit cost)
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Solve the EOQ Equation</span>
          <p className="mt-1">
            Substitute the parameters into the EOQ formula:
            <BlockMath math="EOQ = \sqrt{\frac{2 \times 1200 \times 75}{4.50}}" />
            <BlockMath math="EOQ = \sqrt{\frac{180{,}000}{4.50}} = \sqrt{40{,}000} = 200 \text{ units}" />
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Analyze the Annual Frequency & Total Cost</span>
          <p className="mt-1">
            • Optimal Order Size: <strong>200 rollers / order</strong>.
            <br />
            • Orders per Year: <InlineMath math="1{,}200 / 200 = 6 \text{ orders / year}" /> (every 2 months).
            <br />
            • Annual Ordering Cost: <InlineMath math="6 \times \$75 = \$450" />.
            <br />
            • Annual Holding Cost: <InlineMath math="(200 / 2) \times \$4.50 = \$450" />.
            <br />
            • Total Policy Cost: <strong>$900 per year</strong> (Ordering Cost = Holding Cost at optimization).
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
          <span className="font-bold text-slate-800 dark:text-slate-100">💡 Supply Chain Conclusion:</span>
          <p className="mt-1 text-slate-655 dark:text-slate-400">
            "Instead of placing 12 monthly orders of 100 units (costing $1,125/yr total) or placing a single huge order of 1,200 units (costing $2,775/yr total), ordering <strong>200 units every 2 months</strong> yields the lowest possible overall cost of <strong>$900</strong>."
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-cyan-600" /> Industrial Inventory Standards
        </h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350">
          Optimal spare parts calculations represent standard industry guidelines in supply chain functional dependability:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-350">
          <li><strong>ISO 55000:</strong> Physical Asset Management — optimizing warehouse inventory structures for critical spare parts without risking operational uptime.</li>
          <li><strong>ISO 22301:</strong> Business Continuity Management — aligning spare parts holding limits with security of supply constraints and risk assessments.</li>
          <li><strong>Cranfield Inventory Research:</strong> Standard industry carrying charge models (typically 15% to 25% of unit cost).</li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What happens if the input parameters change? How sensitive is the EOQ model?",
      answer: "The EOQ model is relatively robust because it is based on a square root function. A 40% change in annual demand or ordering costs will only result in an approximate 18% change in the optimal order quantity. This makes the model highly practical even when demand forecasts or shipping rates fluctuate slightly throughout the fiscal year."
    },
    {
      question: "How does the holding cost rate (carrying charge) map to physical assets?",
      answer: "The holding cost H is typically calculated as a percentage (i) of the item's purchase cost (C), so H = i · C. The carrying charge (i) is usually between 15% and 25% annually. It covers cost of money (opportunity cost of capital), storage costs (rent, heating, security), service costs (insurance, taxes, inventory handling), and risk costs (shrinkage, physical deterioration, or obsolescence)."
    },
    {
      question: "Can the standard EOQ model handle quantity discounts (price breaks)?",
      answer: "No. The classic EOQ model assumes a constant purchase price. However, you can solve for Quantity Discounts by using an extension of the model: first calculate the basic EOQ, then compute the total annual cost (Purchase Cost + Ordering Cost + Holding Cost) at the basic EOQ and compare it to the total cost at each discount threshold. The quantity that yields the lowest total annual cost is the optimal selection."
    },
    {
      question: "What is the relationship between EOQ, Reorder Point (ROP), and Safety Stock?",
      answer: "While EOQ answers how much to order, the Reorder Point (ROP) answers when to order. The ROP is calculated based on lead time demand and safety stock: ROP = (Lead Time × Daily Demand) + Safety Stock. Safety stock is the buffer inventory held to protect against stockouts caused by demand spikes or transport delays, and it does not affect the basic EOQ calculation."
    },
    {
      question: "What are the primary assumptions of the classical EOQ model, and when do they fail?",
      answer: "The classical EOQ model assumes: (1) Demand rate is constant and continuous, (2) Lead time is fixed and known, (3) Unit price is constant, (4) No stockouts or shortages are allowed, and (5) Ordering and holding costs are independent of order size. In real-world applications, these assumptions fail during severe supply chain disruptions, variable seasonal demand, or inflationary price adjustments. In these cases, advanced dynamic lot-sizing models (such as Wagner-Whitin) are used."
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
