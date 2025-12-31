
import React, { useState } from 'react';
import { calculateKOutOfN } from '../../services/reliabilityMath';
import { Layers, HelpCircle, Activity, Box, Check, X } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const KOutOfN: React.FC = () => {
  const [totalUnits, setTotalUnits] = useState('3'); // n
  const [requiredUnits, setRequiredUnits] = useState('2'); // k
  const [compReliability, setCompReliability] = useState('0.9'); // R

  const n = parseInt(totalUnits) || 0;
  const k = parseInt(requiredUnits) || 0;
  const r = parseFloat(compReliability) || 0;

  // Validation
  const isValid = n >= k && n > 0 && k > 0 && r >= 0 && r <= 1;
  const systemReliability = isValid ? calculateKOutOfN(n, k, r) : 0;

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "K-out-of-N Reliability Calculator",
    "description": "Calculate system reliability for k-out-of-n redundancy configurations.",
    "applicationCategory": "UtilitiesApplication"
  };

  // Generate visualization blocks
  const renderBlocks = () => {
    if (!isValid || n > 20) return null; // Limit visual complexity
    
    return (
      <div className="flex flex-wrap justify-center gap-2 my-6">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-sm transition-all ${i < k ? 'bg-cyan-600 ring-2 ring-offset-2 ring-cyan-600 dark:ring-offset-slate-800' : 'bg-slate-400 opacity-50'}`}>
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">K-out-of-N Redundancy Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate the reliability of a system with partial redundancy, where <strong>k</strong> units must function out of a total of <strong>n</strong> installed units.
          Examples: 2 out of 3 pumps, 3 out of 4 generators.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Input Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600" /> Configuration
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Units Installed (n)
            </label>
            <input 
              type="number" 
              min="1"
              value={totalUnits}
              onChange={e => setTotalUnits(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Minimum Required to Run (k)
            </label>
            <input 
              type="number" 
              min="1"
              max={totalUnits}
              value={requiredUnits}
              onChange={e => setRequiredUnits(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Component Reliability (R)
              <HelpTooltip text="Probability (0-1) that a single unit works. If you have MTBF, calculate R = e^(-time/MTBF)." />
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0"
                max="1"
                step="0.01"
                value={compReliability}
                onChange={e => setCompReliability(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={compReliability}
                onChange={e => setCompReliability(e.target.value)}
                className="w-24 accent-cyan-600"
              />
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="flex flex-col space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl flex-grow flex flex-col justify-center items-center text-center relative overflow-hidden">
             
             {isValid ? (
               <div className="relative z-10 w-full">
                 <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">System Reliability</div>
                 <div className="text-6xl font-extrabold mb-6">
                   {(systemReliability * 100).toFixed(4)}%
                 </div>
                 
                 <div className="flex justify-center gap-8 border-t border-slate-700 pt-6 mt-2">
                   <div>
                     <div className="text-xs text-slate-400 uppercase">Single Unit</div>
                     <div className="text-xl font-bold text-slate-200">{(r * 100).toFixed(1)}%</div>
                   </div>
                   <div>
                     <div className="text-xs text-slate-400 uppercase">Gain</div>
                     <div className="text-xl font-bold text-emerald-400">+ {((systemReliability - r) * 100).toFixed(2)}%</div>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-slate-500 flex flex-col items-center">
                 <Activity className="w-12 h-12 mb-2 opacity-50" />
                 <p>Enter valid parameters (n &ge; k)</p>
               </div>
             )}

             {/* Background Decor */}
             <Box className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-5 rotate-12" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
             <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm flex items-center gap-2">
               Visualization ({k}-out-of-{n})
             </h4>
             <p className="text-xs text-slate-500 mb-4">
               System succeeds if at least {k} components (highlighted) are operational.
             </p>
             {renderBlocks()}
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Series Logic (n-out-of-n)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            If k = n (e.g., 3 out of 3), the system is in <strong>Series</strong>. All components must work. Reliability drops significantly.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Parallel Logic (1-out-of-n)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            If k = 1 (e.g., 1 out of 3), the system is in <strong>Parallel</strong>. Only one needs to work. Maximum reliability.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Voting Logic</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            k-out-of-n is often called "Voting Logic" (e.g., 2oo3 voting in safety PLCs). It balances safety (tripping when needed) vs reliability (avoiding nuisance trips).
          </p>
        </div>
      </div>

      <RelatedTools currentToolId="k-out-of-n" />
    </div>
  );
};

export default KOutOfN;
