
import React, { useState } from 'react';
import { calculateEOQ } from '../../services/reliabilityMath';
import { Package, ShoppingCart, TrendingUp, Archive, Settings, Info } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const EoqCalculator: React.FC = () => {
  const [demand, setDemand] = useState<string>('1000');
  const [orderingCost, setOrderingCost] = useState<string>('50');
  const [holdingCost, setHoldingCost] = useState<string>('2.5');

  const eoq = calculateEOQ(parseFloat(demand) || 0, parseFloat(orderingCost) || 0, parseFloat(holdingCost) || 0);
  const ordersPerYear = (parseFloat(demand) || 0) / (eoq || 1);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
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
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is EOQ?</h2>
      <p>
        <strong>Economic Order Quantity (EOQ)</strong> is a formula used to calculate the ideal quantity of inventory to order for a given product. The goal is to minimize total inventory costs.
      </p>

      <h2 id="formula">The Formula</h2>
      <p>
        There is a trade-off:
      </p>
      <ul>
        <li><strong>Order often (small batches):</strong> High ordering costs (shipping/admin), but low holding costs (less space).</li>
        <li><strong>Order rarely (large batches):</strong> Low ordering costs (bulk), but high holding costs (warehouse space, capital tied up).</li>
      </ul>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-center my-4 overflow-x-auto text-sm">
        EOQ = √ [ (2 × Demand × OrderCost) / HoldingCost ]
      </div>

      <h2 id="application">When to use</h2>
      <p>
        Use EOQ for parts with <strong>steady, predictable demand</strong> (like filters, lubricants, or belts). Do not use EOQ for critical spares that are rarely used (use the Spare Part Estimator tool instead).
      </p>
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
