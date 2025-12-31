
import React, { useState } from 'react';
import { calculateEOQ } from '../../services/reliabilityMath';
import { Package, ShoppingCart, TrendingUp, Archive } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const EoqCalculator: React.FC = () => {
  const [demand, setDemand] = useState<string>('1000');
  const [orderingCost, setOrderingCost] = useState<string>('50');
  const [holdingCost, setHoldingCost] = useState<string>('2.5');
  
  const eoq = calculateEOQ(parseFloat(demand)||0, parseFloat(orderingCost)||0, parseFloat(holdingCost)||0);
  const ordersPerYear = (parseFloat(demand)||0) / (eoq || 1);

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EOQ Calculator",
    "description": "Calculate Economic Order Quantity for MRO spare parts.",
    "applicationCategory": "BusinessApplication"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Economic Order Quantity (EOQ)</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Determine the ideal order quantity that minimizes the total costs of inventory management (ordering costs + holding costs). Essential for optimizing spare parts warehouses.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Parameters
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Annual Demand (Units)
              <HelpTooltip text="Total quantity used per year." />
            </label>
            <input type="number" value={demand} onChange={e => setDemand(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ordering Cost ($ per Order)
              <HelpTooltip text="Fixed cost to place one order (admin time, shipping, handling)." />
            </label>
            <input type="number" value={orderingCost} onChange={e => setOrderingCost(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Holding Cost ($ per Unit per Year)
              <HelpTooltip text="Cost to store one unit for one year (Storage space, insurance, capital interest)." />
            </label>
            <input type="number" value={holdingCost} onChange={e => setHoldingCost(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <div className="text-sm font-bold text-cyan-400 uppercase mb-2">Optimal Order Quantity</div>
               <div className="text-5xl font-extrabold mb-4">{Math.round(eoq)} <span className="text-xl font-medium text-slate-400">Units</span></div>
               <div className="flex gap-4 text-sm text-slate-300">
                 <div className="flex items-center gap-2">
                   <ShoppingCart className="w-4 h-4" /> {ordersPerYear.toFixed(1)} orders / year
                 </div>
               </div>
             </div>
             <Archive className="absolute -right-6 -bottom-6 w-40 h-40 text-white opacity-5" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" /> Formula
            </h4>
            <div className="bg-white dark:bg-black/30 p-3 rounded font-mono text-center text-sm border border-slate-200 dark:border-transparent">
              EOQ = √ [ (2 × Demand × OrderCost) / HoldingCost ]
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              This formula creates a balance where the annual ordering cost exactly equals the annual holding cost, mathematically minimizing the Total Inventory Cost.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="eoq" />
    </div>
  );
};

export default EoqCalculator;
