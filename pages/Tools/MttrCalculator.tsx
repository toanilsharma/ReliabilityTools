
import React, { useState } from 'react';
import { calculateMTTR } from '../../services/reliabilityMath';
import { Wrench, Clock, AlertCircle, Copy, Check, BookOpen, Target, TrendingUp } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

const MttrCalculator: React.FC = () => {
  const [downtime, setDowntime] = useState<string>('');
  const [repairs, setRepairs] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(downtime);
    const r = parseFloat(repairs);
    
    if (!isNaN(d) && !isNaN(r) && d >= 0 && r > 0) {
      setResult(calculateMTTR(d, r));
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`MTTR: ${result.toFixed(2)} Hours`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">MTTR Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate Mean Time To Repair (MTTR), a measure of the maintainability of repairable items. It represents the average time required to repair a failed component or device.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Maintenance Time (Hours)
                  <HelpTooltip text="Total clock hours spent on corrective maintenance (Wrench time + diagnosis + testing). Source: Work order actual hours." />
                </label>
                <p className="text-xs text-slate-500 mb-2">Sum of all time spent on corrective repairs.</p>
                <input 
                  type="number" 
                  value={downtime}
                  onChange={(e) => setDowntime(e.target.value)}
                  placeholder="e.g., 120"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Number of Repairs
                  <HelpTooltip text="Total count of corrective repair events. Source: CMMS logs." />
                </label>
                <input 
                  type="number" 
                  value={repairs}
                  onChange={(e) => setRepairs(e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                  min="1"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Wrench className="w-5 h-5" /> Calculate MTTR
              </button>
            </div>
          </form>

          {result !== null && (
            <div className="bg-white dark:bg-slate-800/50 border border-cyan-500/30 p-6 rounded-xl relative shadow-sm">
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="Copy Result"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <div className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider mb-1">MTTR Result</div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">Hours</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Per Repair Average
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-3">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> 
              Formula Explained
            </h3>
            <code className="block bg-slate-100 dark:bg-black/30 p-3 rounded text-cyan-700 dark:text-cyan-300 font-mono text-center mb-4 border border-slate-200 dark:border-transparent">
              MTTR = Total Corrective Maintenance Time / Total Number of Repairs
            </code>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              MTTR includes:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <li>Notification time</li>
              <li>Diagnosis time</li>
              <li>Fix/Repair time</li>
              <li>Assembly/Calibration time</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
              It typically <strong>excludes</strong> Lead Time for parts (that would be Mean Down Time or MDT).
            </p>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            What is MTTR?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            MTTR (Mean Time To Repair) measures the average time it takes to recover a system from a failure. It is the primary KPI for "Maintainability". A lower MTTR means your team can fix issues faster.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Why does it matter?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Availability is a function of MTBF and MTTR. If you cannot prevent failures (MTBF), you must fix them quickly (MTTR) to maintain uptime. Reducing MTTR involves better spare parts logistics, training, and modular equipment design.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Interpreting the Result
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Lower is Better:</strong> If your MTTR is trending up, investigate:
            <ul className="list-disc pl-4 mt-1">
              <li>Are technicians waiting for parts?</li>
              <li>Is the diagnosis taking too long?</li>
              <li>Are manuals/drawings hard to find?</li>
            </ul>
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="mttr" />
    </div>
  );
};

export default MttrCalculator;
