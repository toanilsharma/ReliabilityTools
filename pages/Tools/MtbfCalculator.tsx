
import React, { useState } from 'react';
import { calculateMTBF } from '../../services/reliabilityMath';
import { Clock, RotateCcw, AlertCircle, Copy, Check, BookOpen, Target, TrendingUp, BarChart, Table } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import { ASSET_BENCHMARKS } from '../../constants';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const MtbfCalculator: React.FC = () => {
  const [mode, setMode] = useState<'MTBF' | 'MTTF'>('MTBF');
  const [totalHours, setTotalHours] = useState<string>('');
  const [failures, setFailures] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ hours?: string; failures?: string }>({});

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MTBF Calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "description": "Calculate Mean Time Between Failures (MTBF) for repairable systems and MTTF for non-repairable items.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: { hours?: string; failures?: string } = {};
    let isValid = true;

    // Validate Hours
    const h = parseFloat(totalHours);
    if (!totalHours || isNaN(h)) {
      newErrors.hours = 'Please enter a valid number.';
      isValid = false;
    } else if (h < 0) {
      newErrors.hours = 'Operational time cannot be negative.';
      isValid = false;
    }

    // Validate Failures
    const f = parseFloat(failures);
    if (!failures || isNaN(f)) {
      newErrors.failures = 'Please enter a valid number.';
      isValid = false;
    } else if (f < 0) {
      newErrors.failures = 'Number of failures/units cannot be negative.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateInputs()) {
      const hours = parseFloat(totalHours);
      const count = parseFloat(failures);
      setResult(calculateMTBF(hours, count));
    } else {
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`${mode}: ${result.toFixed(2)} Hours, ${mode === 'MTBF' ? 'Failures' : 'Failed Units'}: ${failures}, Hours: ${totalHours}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Lookup Table Data Generator
  const generateLookupTable = () => {
    const basis = 8760; // 1 year
    return [0.5, 1, 2, 4, 12, 52].map(f => ({
      failures: f,
      mtbf: basis / f,
      period: f <= 1 ? `Every ${Math.round(1/f)} Years` : f === 12 ? 'Monthly' : f === 52 ? 'Weekly' : f === 4 ? 'Quarterly' : `${f} per Year`
    }));
  };
  const lookupData = generateLookupTable();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{mode} Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {mode === 'MTBF' 
            ? 'Calculate the Mean Time Between Failures. This metric represents the average time expected between inherent failures of a repairable system during normal operating hours.'
            : 'Calculate the Mean Time To Failure. This metric represents the average time expected until a non-repairable item (like a fuse, bulb, or seal) fails and requires replacement.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex shadow-sm">
        <button 
          onClick={() => setMode('MTBF')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'MTBF' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          MTBF (Repairable)
        </button>
        <button 
          onClick={() => setMode('MTTF')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'MTTF' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          MTTF (Non-Repairable)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Operational Time (Hours)
                  <HelpTooltip text="The sum of operating hours for all units in the population during the observation period. Source: SCADA runtime logs or maintenance shift records." />
                </label>
                <input 
                  type="number" 
                  value={totalHours}
                  onChange={(e) => {
                    setTotalHours(e.target.value);
                    if (errors.hours) setErrors({ ...errors, hours: undefined });
                  }}
                  placeholder="e.g., 8760"
                  min="0"
                  className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${
                    errors.hours 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.hours && (
                  <p className="mt-1 text-sm text-red-500 font-medium flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> {errors.hours}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {mode === 'MTBF' ? 'Number of Failures' : 'Number of Failed Units'}
                  <HelpTooltip 
                    text={mode === 'MTBF' 
                      ? "Total count of inherent breakdowns requiring repair. Exclude Preventive Maintenance and operator errors. Source: CMMS work order history."
                      : "Total count of components that failed and were replaced/discarded during the period."
                    } 
                  />
                </label>
                <input 
                  type="number" 
                  value={failures}
                  onChange={(e) => {
                    setFailures(e.target.value);
                    if (errors.failures) setErrors({ ...errors, failures: undefined });
                  }}
                  placeholder={mode === 'MTBF' ? "e.g., 5" : "e.g., 12"}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${
                    errors.failures 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  min="0"
                />
                {errors.failures && (
                  <p className="mt-1 text-sm text-red-500 font-medium flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> {errors.failures}
                  </p>
                )}
              </div>
              <button 
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" /> Calculate {mode}
              </button>
            </div>
          </form>

          {result !== null && (
            <div className="bg-white dark:bg-slate-800/50 border border-cyan-500/30 p-6 rounded-xl relative group shadow-sm">
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="Copy Result"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              
              <div className="mb-6">
                <div className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider mb-1">Calculated {mode}</div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} 
                  <span className="text-lg ml-2 text-slate-500 dark:text-slate-400 font-normal">Hours</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
                 <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Failure Rate (λ):</span>
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">
                      {(1/result).toExponential(5)} <span className="text-xs text-slate-500">failures/hour</span>
                    </span>
                 </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-700/50 pt-3">
                <strong>Note:</strong> {mode} is a statistical average, not a lifetime guarantee. It represents the mean time {mode === 'MTBF' ? 'between failures' : 'to failure'} for a large population.
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-3">
              <RotateCcw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> 
              Formula Explained
            </h3>
            <code className="block bg-slate-100 dark:bg-black/30 p-3 rounded text-cyan-700 dark:text-cyan-300 font-mono text-center mb-4 border border-slate-200 dark:border-transparent">
              {mode} = Total Operational Time / Total {mode === 'MTBF' ? 'Failures' : 'Units Failed'}
            </code>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
               <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                 <Table className="w-4 h-4" /> Quick Reference Lookup
               </h4>
               <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                 <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-3 py-2 font-medium text-slate-600 dark:text-slate-300">Failure Frequency</th>
                        <th className="px-3 py-2 font-medium text-slate-600 dark:text-slate-300">Failures/Year</th>
                        <th className="px-3 py-2 font-medium text-slate-600 dark:text-slate-300 text-right">Approx MTBF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                      {lookupData.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-slate-900 dark:text-white font-medium">{row.period}</td>
                          <td className="px-3 py-2 text-slate-500">{row.failures}</td>
                          <td className="px-3 py-2 text-right font-mono text-cyan-600 dark:text-cyan-400">{Math.round(row.mtbf).toLocaleString()} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Benchmarks Sidebar */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white mb-4">
              <BarChart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Industry Benchmarks
            </h3>
            <div className="space-y-3">
              {Object.entries(ASSET_BENCHMARKS).map(([asset, data]) => (
                <div key={asset} className="text-sm">
                  <div className="flex justify-between font-medium text-slate-800 dark:text-slate-200">
                    <span>{asset}</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{data.range}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                    {data.note}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
              Source: <strong>IEEE 493 (Gold Book)</strong> and <strong>IEC 61709</strong> general industry reliability data. Actuals may vary by environment.
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <section className="grid md:grid-cols-3 gap-8 pt-12 border-t border-slate-200 dark:border-slate-800">
        
        {/* Card 1: What is this tool? */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden h-full">
          <div className="p-6 flex-grow">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg mb-3">
              <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              What is this tool?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {mode === 'MTBF' 
                ? 'This calculator computes the Mean Time Between Failures (MTBF), the gold standard KPI for measuring reliability in repairable systems (motors, pumps, drives).'
                : 'This calculator computes the Mean Time To Failure (MTTF), used for non-repairable items (switches, fuses, bearings) to predict the expected lifespan before replacement.'
              }
            </p>
          </div>
        </div>

        {/* Card 2: Significance */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden h-full">
          <div className="p-6 flex-grow">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg mb-3">
              <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Why is it significant?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {mode} helps engineers forecast spare parts requirements and schedule {mode === 'MTBF' ? 'preventive maintenance' : 'replacements'}. A low {mode} indicates a need for root cause analysis or design improvements, while a high {mode} validates the robustness of your system.
            </p>
          </div>
        </div>

        {/* Card 3: How to read results */}
        <div className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden h-full">
          <div className="p-6 flex-grow">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              How to read results?
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
              <p>
                <strong>High {mode}:</strong> Indicates a reliable system/part. This demonstrates <em>system robustness</em> and confirms that design choices are effective.
              </p>
              <p>
                <strong>Low {mode}:</strong> Indicates frequent failures. This signals that the system is unstable or aging and highlights an immediate <em>need for investigation</em>.
              </p>
              <p className="text-xs italic pt-2 border-t border-slate-200 dark:border-slate-700 font-medium text-slate-500">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Warning: Do not confuse {mode} with "Lifetime". A system with a 10,000 hr {mode} describes the population average, not a guarantee that a single unit will last that long.
              </p>
            </div>
          </div>
        </div>

      </section>

      <RelatedTools currentToolId="mtbf" />
    </div>
  );
};

export default MtbfCalculator;
