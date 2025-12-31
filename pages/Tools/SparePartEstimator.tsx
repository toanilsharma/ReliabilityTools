
import React, { useState } from 'react';
import { calculateSpareParts } from '../../services/reliabilityMath';
import { SERVICE_LEVELS } from '../../constants';
import { Package, ShoppingCart, Info, BookOpen, Target, TrendingUp } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

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
    
    if (!isNaN(m) && !isNaN(u) && !isNaN(q) && !isNaN(l)) {
      setResult(calculateSpareParts(m, u, q, l, SERVICE_LEVELS[serviceLevelIdx].z));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Spare Part Estimator</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Estimate annual consumption, safety stock, and reorder points for MRO spare parts based on reliability data (MTBF) and service level targets.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                MTBF (Hours)
                <HelpTooltip text="Mean Time Between Failures. Source: Vendor datasheet, historical calculation, or OREDA database." />
              </label>
              <input type="number" value={mtbf} onChange={e => setMtbf(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Annual Usage (Hours/Unit)
                <HelpTooltip text="Hours per year the equipment runs. 8760 = 24/7 operation. Source: Production schedule." />
              </label>
              <input type="number" value={usage} onChange={e => setUsage(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Qty Installed
                <HelpTooltip text="Number of identical parts used in the system. Source: P&ID or Bill of Materials (BOM)." />
              </label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lead Time (Days)
                <HelpTooltip text="Days to receive the part after ordering. Source: Supplier quote or ERP data." />
              </label>
              <input type="number" value={leadTime} onChange={e => setLeadTime(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Service Level
                <HelpTooltip text="Probability that you will have the part when needed (e.g., 95% means you accept a 5% risk of stockout)." />
              </label>
              <select 
                value={serviceLevelIdx}
                onChange={e => setServiceLevelIdx(parseInt(e.target.value))}
                className="input-field"
              >
                {SERVICE_LEVELS.map((sl, idx) => (
                  <option key={sl.label} value={idx}>{sl.label} ({sl.z})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Package className="w-4 h-4" /> Calculate
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Annual Consumption</div>
                 <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.annualDemand.toFixed(2)}</div>
                 <div className="text-xs text-slate-500">Units per year</div>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Reorder Point (ROP)</div>
                 <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">{result.reorderPoint}</div>
                 <div className="text-xs text-slate-500">Units (Order when stock hits this)</div>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Safety Stock</div>
                 <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.safetyStock}</div>
                 <div className="text-xs text-slate-500">Buffer stock units</div>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Lead Time Demand</div>
                 <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.leadTimeDemand.toFixed(2)}</div>
                 <div className="text-xs text-slate-500">Units used while waiting for order</div>
               </div>
            </div>
          ) : (
            <div className="h-64 bg-slate-50 dark:bg-slate-800/30 border-dashed border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500">
              Enter parameters to estimate spare parts.
            </div>
          )}

          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-3">
              <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Methodology
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              This tool uses a standard inventory management formula adapted for reliability data, aligning with principles in <strong>IEC 62550: Spare parts provisioning</strong>.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 font-mono text-xs">
              <li>Annual Demand (D) = (Usage Hours * Qty) / MTBF</li>
              <li>Lead Time Demand (LTD) = D * (Lead Time / 365)</li>
              <li>Safety Stock = Z_score * sqrt(LTD)</li>
              <li>Reorder Point = LTD + Safety Stock</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">
              *Note: This assumes failures follow a Poisson process which is approximated here for general estimation.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            What is Spare Part Estimation?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This tool links reliability data (MTBF) directly to warehouse inventory. Instead of guessing how many spare motors to buy, you calculate the statistical probability of usage over the lead time to ensure you have parts when needed without overstocking.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Service Level & Risk
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Service Level (e.g., 95%):</strong> This implies you are willing to accept a 5% risk of a stockout (not having the part when a failure occurs). Higher service levels require significantly more safety stock (cash tied up in inventory).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            How to read the results?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Reorder Point (ROP):</strong> When your shelf count drops to this number, place a new order immediately.
            <br/><br/>
            <strong>Safety Stock:</strong> This is your "insurance" inventory to cover for failures that happen faster than average or supplier delays.
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="spares" />

      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          outline: none;
        }
        /* Dark Mode Input */
        :global(.dark) .input-field {
          background-color: #0f172a;
          border: 1px solid #334155;
          color: white;
        }
        :global(.dark) .input-field:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
        }
        /* Light Mode Input */
        .input-field {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }
        .input-field:focus {
          border-color: #0891b2;
          box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.2);
        }

        .btn-primary {
          background-color: #0891b2;
          color: white;
          font-weight: 700;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default SparePartEstimator;
