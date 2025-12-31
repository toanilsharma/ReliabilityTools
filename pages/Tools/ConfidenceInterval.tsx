
import React, { useState } from 'react';
import { calculateMTBFConfidence } from '../../services/reliabilityMath';
import { Target, BarChart2, BookOpen, AlertTriangle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const ConfidenceInterval: React.FC = () => {
  const [hours, setHours] = useState('10000');
  const [failures, setFailures] = useState('5');
  const [confidence, setConfidence] = useState('90');

  const result = calculateMTBFConfidence(
    parseFloat(hours) || 0,
    parseFloat(failures) || 0,
    parseFloat(confidence) || 90
  );

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MTBF Confidence Interval Calculator",
    "description": "Calculate statistical confidence intervals for MTBF using Chi-Square distribution.",
    "applicationCategory": "UtilitiesApplication"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">MTBF Confidence Interval Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Move beyond point estimates. Calculate the statistical Lower and Upper bounds of your MTBF based on the number of observed failures.
          Uses the Chi-Square ($\chi^2$) distribution for exponential failure rates, compliant with <strong>IEC 60605-4</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-600" /> Test Data
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Accumulated Hours
                  <HelpTooltip text="Sum of operating hours of all units (failed + suspended)." />
                </label>
                <input 
                  type="number" 
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Number of Failures
                  <HelpTooltip text="Must be > 0. For zero failures, use the 'Zero-Failure' Test Planner." />
                </label>
                <input 
                  type="number" 
                  value={failures}
                  onChange={e => setFailures(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confidence Level (%)
                  <HelpTooltip text="Typically 80%, 90% or 95%. Higher confidence yields a wider range." />
                </label>
                <select 
                  value={confidence}
                  onChange={e => setConfidence(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="60">60%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                  <option value="90">90% (Standard)</option>
                  <option value="95">95% (High)</option>
                  <option value="99">99% (Very High)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
             <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
               <BookOpen className="w-4 h-4 text-cyan-600" /> Why use Confidence Intervals?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
               A calculated MTBF of 2,000 hours means nothing if it's based on only 1 failure. The true MTBF could be anywhere from 500 to 50,000 hours.
               Confidence intervals quantify this uncertainty. As you collect more data (more failures), the interval tightens, giving you more certainty.
             </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
               <div className="text-center mb-8">
                 <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Point Estimate (Mean)</div>
                 <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                   {Math.round(result.mean).toLocaleString()} <span className="text-lg font-medium text-slate-400">Hours</span>
                 </div>
               </div>

               <div className="relative pt-8 pb-4 px-4">
                  {/* Visual Range Bar */}
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full relative w-full">
                     <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-cyan-200 dark:bg-cyan-900 rounded-full"></div>
                     </div>
                     
                     {/* Mean Marker */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 dark:bg-white rounded-full border-4 border-cyan-500 z-10"></div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                     <div className="text-left">
                        <div className="text-xs font-bold text-slate-500 uppercase">Lower Limit</div>
                        <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{Math.round(result.lower).toLocaleString()}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs font-bold text-slate-500 uppercase">Upper Limit</div>
                        <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{Math.round(result.upper).toLocaleString()}</div>
                     </div>
                  </div>
               </div>

               <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-100 dark:border-cyan-800">
                 We are <strong>{confidence}% confident</strong> that the true MTBF lies between <strong>{Math.round(result.lower).toLocaleString()}</strong> and <strong>{Math.round(result.upper).toLocaleString()}</strong> hours.
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 p-8 text-center">
              <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-bold mb-2">Insufficient Data</h3>
              <p>Enter at least 1 failure to calculate confidence intervals.</p>
            </div>
          )}

          {/* Warning for low failures */}
          {parseFloat(failures) > 0 && parseFloat(failures) < 5 && (
            <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
               <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
               <div className="text-sm text-amber-800 dark:text-amber-200">
                 <strong>Low Sample Size Warning:</strong> With fewer than 5 failures, the uncertainty range is extremely wide. Be cautious using this data for critical decisions.
               </div>
            </div>
          )}
        </div>
      </div>

      <RelatedTools currentToolId="confidence-interval" />
    </div>
  );
};

export default ConfidenceInterval;
