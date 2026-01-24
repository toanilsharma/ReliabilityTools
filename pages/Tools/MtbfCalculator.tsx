
import React, { useState } from 'react';
import { calculateMTBF } from '../../services/reliabilityMath';
import { Clock, RotateCcw, AlertCircle, Copy, Check, Table, BarChart, BookOpen, Target, TrendingUp } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import { ASSET_BENCHMARKS } from '../../constants';
import ToolContentLayout from '../../components/ToolContentLayout';

const MtbfCalculator: React.FC = () => {
  const [mode, setMode] = useState<'MTBF' | 'MTTF'>('MTBF');
  const [totalHours, setTotalHours] = useState<string>('');
  const [failures, setFailures] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ hours?: string; failures?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { hours?: string; failures?: string } = {};
    let isValid = true;
    const h = parseFloat(totalHours);
    if (!totalHours || isNaN(h)) { newErrors.hours = 'Please enter a valid number.'; isValid = false; }
    else if (h < 0) { newErrors.hours = 'Operational time cannot be negative.'; isValid = false; }

    const f = parseFloat(failures);
    if (!failures || isNaN(f)) { newErrors.failures = 'Please enter a valid number.'; isValid = false; }
    else if (f < 0) { newErrors.failures = 'Count cannot be negative.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setResult(calculateMTBF(parseFloat(totalHours), parseFloat(failures)));
    } else {
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`${mode}: ${result.toFixed(2)} Hours`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateLookupTable = () => {
    const basis = 8760;
    return [0.5, 1, 2, 4, 12, 52].map(f => ({
      failures: f,
      mtbf: basis / f,
      period: f <= 1 ? `Every ${Math.round(1 / f)} Years` : f === 12 ? 'Monthly' : f === 52 ? 'Weekly' : f === 4 ? 'Quarterly' : `${f} per Year`
    }));
  };
  const lookupData = generateLookupTable();

  // --- Tool Component ---
  const ToolComponent = (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Toggle Calculation Mode */}
        <div className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setMode('MTBF')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'MTBF' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            MTBF (Repairable)
          </button>
          <button
            onClick={() => setMode('MTTF')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'MTTF' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            MTTF (Non-Repairable)
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Operational Time (Hours)
              <HelpTooltip text="Sum of runtime for all units. (e.g. 10 motors * 1000 hours = 10,000 unit-hours)" />
            </label>
            <input
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="e.g., 8760"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${errors.hours ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {errors.hours && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.hours}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'MTBF' ? 'Number of Failures' : 'Number of Failed Units'}
              <HelpTooltip text={mode === 'MTBF' ? "Total breakdown events." : "Total items discarded."} />
            </label>
            <input
              type="number"
              value={failures}
              onChange={(e) => setFailures(e.target.value)}
              placeholder="e.g., 5"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${errors.failures ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {errors.failures && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.failures}</p>}
          </div>

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <Clock className="w-5 h-5" /> Calculate {mode}
          </button>
        </form>

        {result !== null && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 relative group">
            <button onClick={handleCopy} className="absolute top-4 right-4 text-slate-400 hover:text-cyan-500 transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Result ({mode})</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {result.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-lg text-slate-500 font-normal">hours</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              Failure Rate (λ): <strong>{(1 / result).toExponential(4)}</strong> failures/hour
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Formula Box */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <RotateCcw className="w-4 h-4 text-cyan-600" /> Calculation Formula
          </h3>
          <code className="block bg-white dark:bg-black/20 p-3 rounded text-center text-cyan-700 dark:text-cyan-300 font-mono text-sm border border-slate-200 dark:border-transparent">
            {mode} = Total Time / {mode === 'MTBF' ? 'Failures' : 'Count'}
          </code>
        </div>

        {/* Benchmarks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <BarChart className="w-4 h-4 text-cyan-600" /> Industry Benchmarks (IEEE 493)
          </h3>
          <div className="space-y-3">
            {Object.entries(ASSET_BENCHMARKS).slice(0, 3).map(([asset, data]) => (
              <div key={asset} className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{asset}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{data.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- Content Strategies ---
  const Content = (
    <div>
      <h2 id="overview">Understanding MTBF & MTTF</h2>
      <p>
        <strong>Mean Time Between Failures (MTBF)</strong> and <strong>Mean Time To Failure (MTTF)</strong> are the two most critical Key Performance Indicators (KPIs) in reliability engineering. They provide a data-driven baseline for predicting system availability and planning maintenance schedules.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-xl border border-cyan-100 dark:border-cyan-800/30">
          <h3 className="text-lg font-bold text-cyan-800 dark:text-cyan-300 mb-2">MTBF (Repairable)</h3>
          <p className="text-sm text-cyan-800/80 dark:text-cyan-200/70">
            Used for assets that can be fixed, such as pumps, motors, and conveyor belts. It measures the average time between one breakdown and the next.
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">MTTF (Non-Repairable)</h3>
          <p className="text-sm text-purple-800/80 dark:text-purple-200/70">
            Used for disposable items like light bulbs, fuses, or O-rings. It measures the average lifespan before the item must be replaced.
          </p>
        </div>
      </div>

      <h2 id="calculation">How to Calculate MTBF</h2>
      <p>
        The calculation is straightforward but often misunderstood. It is simply the ratio of total operating time to the number of failures.
      </p>
      <p><strong>Example:</strong></p>
      <ul>
        <li>You have a fleet of <strong>10 pumps</strong>.</li>
        <li>They run for <strong>24 hours</strong> a day for <strong>10 days</strong>.</li>
        <li>Total Operational Time = 10 pumps * 24 hours * 10 days = <strong>2,400 hours</strong>.</li>
        <li>During this time, you experience <strong>4 breakdowns</strong>.</li>
      </ul>
      <p>
        <code>MTBF = 2,400 hours / 4 failures = 600 Hours</code>.
      </p>

      <h2 id="availability">Relationship with Availability</h2>
      <p>
        MTBF is a core component of the Inherent Availability formula, along with Mean Time To Repair (MTTR):
      </p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4">
        Availability = MTBF / (MTBF + MTTR)
      </div>
      <p>
        To increase availability, you must either increase reliability (MTBF) or decrease downtime (MTTR). World-class organizations focus on both.
      </p>

      <h2 id="bathtub">The Bathtub Curve</h2>
      <p>
        It is vital to assume that MTBF applies to the "Useful Life" phase of the Bathtub Curve, where the failure rate is constant.
      </p>
      <ul>
        <li><strong>Infant Mortality:</strong> High failure rate at startup (installation errors).</li>
        <li><strong>Useful Life:</strong> Constant, low failure rate (random events).</li>
        <li><strong>Wear Out:</strong> Increasing failure rate (aging).</li>
      </ul>
      <p>
        MTBF is the inverse of the constant failure rate (&lambda;) during the useful life phase. <code>MTBF = 1 / &lambda;</code>.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "Is MTBF the same as 'Lifetime'?",
      answer: "<strong>No.</strong> This is the most common myth. A human has an MTBF of roughly 800 years (if we assume a constant low accident rate), but a lifespan of only 80 years. MTBF measures the probability of random failure, not the wear-out time."
    },
    {
      question: "Does MTBF include maintenance time?",
      answer: "No. MTBF refers only to operating time. If a machine is down for scheduled maintenance, that time is excluded from the calculation."
    },
    {
      question: "What is a 'Good' MTBF?",
      answer: "It depends entirely on the asset. For a centrifugal pump, 25,000 hours (ANSI standard) is good. For a hard drive, 1,000,000 hours is standard. Check the <strong>Industry Benchmarks</strong> sidebar for specific values."
    },
    {
      question: "How do I improve MTBF?",
      answer: "1. <strong>Design:</strong> Use higher quality components.<br>2. <strong>Installation:</strong> Ensure precision alignment and balancing.<br>3. <strong>Operation:</strong> Run equipment within design specifications (don't overload)."
    },
    {
      question: "Can I use MTBF for software?",
      answer: "Yes, in software reliability, it stands for Mean Time Between Failures (crashes or bugs). It is calculated based on runtime hours divided by the number of critical defects encountered."
    }
  ];

  return (
    <ToolContentLayout
      title={mode === 'MTBF' ? "MTBF Calculator" : "MTTF Calculator"}
      description={`Calculate the ${mode === 'MTBF' ? 'Mean Time Between Failures' : 'Mean Time To Failure'} to predict reliability and optimize maintenance schedules.`}
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${mode} Calculator`,
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default MtbfCalculator;
