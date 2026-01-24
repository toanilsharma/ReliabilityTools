
import React, { useState } from 'react';
import { calculateTestTimeForMTBF, calculateSuccessRunSampleSize } from '../../services/reliabilityMath';
import { Microscope, Clock, Users, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const TestPlanner: React.FC = () => {
  const [mode, setMode] = useState<'MTBF' | 'Reliability'>('MTBF');

  // MTBF Inputs
  const [targetMtbf, setTargetMtbf] = useState<string>('5000');
  const [confidence, setConfidence] = useState<string>('90');

  // Reliability Inputs
  const [targetReliability, setTargetReliability] = useState<string>('90');
  const [numUnits, setNumUnits] = useState<string>('10');

  // Results
  const [resultTime, setResultTime] = useState<number | null>(null);
  const [resultSamples, setResultSamples] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const conf = parseFloat(confidence) / 100;

    if (mode === 'MTBF') {
      const mtbf = parseFloat(targetMtbf);
      if (!isNaN(mtbf) && !isNaN(conf)) {
        setResultTime(calculateTestTimeForMTBF(mtbf, conf));
        setResultSamples(null);
      }
    } else {
      const rel = parseFloat(targetReliability) / 100;
      if (!isNaN(rel) && !isNaN(conf)) {
        const samples = calculateSuccessRunSampleSize(rel, conf);
        setResultSamples(samples);
        setResultTime(null);
      }
    }
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('MTBF'); setResultTime(null); setResultSamples(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'MTBF' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
          >
            Demonstrate MTBF
          </button>
          <button
            onClick={() => { setMode('Reliability'); setResultTime(null); setResultSamples(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'Reliability' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
          >
            Demonstrate Reliability %
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          {mode === 'MTBF' ? (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Target MTBF (Hours)
                <HelpTooltip text="The Mean Time Between Failures you want to prove the product achieves." />
              </label>
              <input type="number" value={targetMtbf} onChange={e => setTargetMtbf(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Target Reliability (%)
                <HelpTooltip text="The probability (0-100%) that the unit survives the test duration." />
              </label>
              <input type="number" max="99.99" step="0.01" value={targetReliability} onChange={e => setTargetReliability(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
              Confidence Level (%)
              <HelpTooltip text="How confident you want to be in the result. Standard is 90% or 95%." />
            </label>
            <select
              value={confidence}
              onChange={e => setConfidence(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="60">60% (Low Risk)</option>
              <option value="80">80% (Standard)</option>
              <option value="90">90% (High Confidence)</option>
              <option value="95">95% (Critical)</option>
              <option value="99">99% (Extreme)</option>
            </select>
          </div>

          {mode === 'MTBF' && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Available Sample Size (Units)
                <HelpTooltip text="How many units will you test simultaneously? This divides the total test time." />
              </label>
              <input type="number" value={numUnits} onChange={e => setNumUnits(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" required min="1" />
            </div>
          )}

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <Microscope className="w-4 h-4" /> Calculate Plan
          </button>
        </form>
      </div>

      {/* Output */}
      <div className="flex flex-col justify-center">
        {mode === 'MTBF' && resultTime !== null ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Test Hours Required</div>
            <div className="text-5xl font-black text-cyan-600 dark:text-cyan-400 mb-6">{Math.ceil(resultTime).toLocaleString()}</div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300">
              To prove <strong>{targetMtbf}h MTBF</strong> with {confidence}% confidence using <strong>{numUnits} units</strong>:
              <br /><br />
              <span className="text-lg font-bold text-slate-900 dark:text-white">Run each unit for {Math.ceil(resultTime / parseFloat(numUnits)).toLocaleString()} hours</span>
              <br />
              <span className="text-xs text-red-500 font-bold uppercase mt-2 block">With Zero Failures Allowed</span>
            </div>
          </div>
        ) : mode === 'Reliability' && resultSamples !== null ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Min. Sample Size</div>
            <div className="text-6xl font-black text-purple-600 dark:text-purple-400 mb-6">{resultSamples}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Test <strong>{resultSamples} units</strong> for one full product lifetime.
              <br />
              <span className="text-xs text-red-500 font-bold uppercase mt-2 block">Zero Failures Allowed</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <Clock className="w-16 h-16 mb-4 opacity-20" />
            <p>Calculate your test strategy.</p>
          </div>
        )}
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">Success Run Qualification</h2>
      <p>
        Reliability testing is expensive and time-consuming. The <strong>Success Run Theorem</strong> (Zero-Failure Test) allows you to demonstrate a reliability target with the minimum possible sample size and test duration, assuming no failures occur.
      </p>

      <h2 id="mtbf-demo">Option 1: Demonstrate MTBF</h2>
      <p>
        Use this when your target is a failure rate (e.g., "Must achieve 50,000 hours MTBF"). The tool calculates the total <strong>accumulated test hours</strong> needed.
      </p>
      <ul>
        <li><strong>Example:</strong> To prove 1000h MTBF with 90% confidence, you need ~2300 total test hours. You can run 1 unit for 2300h, or 10 units for 230h.</li>
      </ul>

      <h2 id="reliability-demo">Option 2: Demonstrate Reliability</h2>
      <p>
        Use this for "One-Shot" devices or mission reliability (e.g., "99% reliability for a 1-year mission"). The tool calculates the <strong>sample size</strong> needed.
      </p>
      <ul>
        <li><strong>Example:</strong> To prove 95% reliability with 90% confidence, you must test 45 units for the full mission duration with zero failures.</li>
      </ul>
    </div>
  );

  const faqs = [
    {
      question: "What if a failure occurs during the test?",
      answer: "The test fails. You have NOT demonstrated the target reliability. You must analyze the failure, fix the root cause, and restart the test (usually with a larger sample size or longer duration to prove the fix)."
    },
    {
      question: "Can I use Accelerated Life Testing (ALT)?",
      answer: "Yes. This tool calculates 'Equivalent Operating Hours'. If you test at 60°C and your Acceleration Factor (AF) is 10, then 100 actual test hours = 1000 equivalent hours."
    }
  ];

  return (
    <ToolContentLayout
      title="Reliability Test Planner"
      description="Design a 'Zero-Failure' qualification test plan according to IEC 61124. Calculate the required sample size and test duration to statistically prove your reliability targets."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Reliability Test Planner",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default TestPlanner;
