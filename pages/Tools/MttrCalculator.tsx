
import React, { useState } from 'react';
import { calculateMTTR } from '../../services/reliabilityMath';
import { Wrench, Clock, AlertCircle, Copy, Check, BookOpen, Target, TrendingUp, BarChart } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

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
    } else {
      alert("Please enter valid positive numbers. Repairs must be > 0.");
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`MTTR: ${result.toFixed(2)} Hours`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ToolComponent = (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Repair Time (Hours)
              <HelpTooltip text="Total clock hours spent on active repair tasks (wrench time + diagnosis + testing). Do not include logistics delay if you want 'Mean Corrective Maintenance Time'." />
            </label>
            <input
              type="number"
              value={downtime}
              onChange={(e) => setDowntime(e.target.value)}
              placeholder="e.g., 120"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Number of Repairs
              <HelpTooltip text="Total count of corrective repair events during the period." />
            </label>
            <input
              type="number"
              value={repairs}
              onChange={(e) => setRepairs(e.target.value)}
              placeholder="e.g., 15"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              required
              min="1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Wrench className="w-5 h-5" /> Calculate MTTR
          </button>
        </form>

        {result !== null && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl relative group">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 text-slate-400 hover:text-cyan-500 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Result</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-lg text-slate-500 font-normal">hours</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              On average, it takes <strong>{result.toFixed(1)} hours</strong> to restore the system.
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Formula Box */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <Clock className="w-4 h-4 text-cyan-600" /> Calculation Formula
          </h3>
          <code className="block bg-white dark:bg-black/20 p-3 rounded text-center text-cyan-700 dark:text-cyan-300 font-mono text-sm border border-slate-200 dark:border-transparent">
            MTTR = Total Maintenance Time / Total Number of Repairs
          </code>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is MTTR?</h2>
      <p>
        <strong>Mean Time To Repair (MTTR)</strong> is the "speedometer" of your maintenance team. It measures the average time required to troubleshoot and repair a failed component and return it to normal operating conditions.
      </p>
      <p>
        While MTBF measures reliability (how often it breaks), MTTR measures <strong>maintainability</strong> (how fast you can fix it). It is a critical metric for minimizing downtime and production losses.
      </p>

      <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-100 dark:border-yellow-800/30 my-8">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Warning: Define Your Terms
        </h3>
        <p className="text-sm text-yellow-900/80 dark:text-yellow-200/70">
          Does your MTTR include "Lead Time" for spare parts?
          <br /><br />
          Strictly speaking, MTTR is "Wrench Time" + Diagnosis. If you include logistics delays, you are calculating <strong>Mean Down Time (MDT)</strong>. Be sure your organization agrees on the definition!
        </p>
      </div>

      <h2 id="components">The 4 Stages of Repair</h2>
      <p>To reduce MTTR, you must analyze its four components:</p>
      <ol>
        <li><strong>Notification:</strong> Time from failure to when the technician is alerted.</li>
        <li><strong>Diagnosis:</strong> Time to figure out <em>what</em> is wrong. (Often the longest part!)</li>
        <li><strong>Repair:</strong> Time to replace the part or fix the issue.</li>
        <li><strong>Verification:</strong> Time to test and calibrate the machine before handing it back to Ops.</li>
      </ol>

      <h2 id="strategies">Strategies to Reduce MTTR</h2>
      <ul>
        <li><strong>Better Documentation:</strong> Ensure wiring diagrams and manuals are instantly accessible.</li>
        <li><strong>Training:</strong> Upskill technicians on root cause analysis.</li>
        <li><strong>Modular Design:</strong> Use "plug-and-play" components (e.g., quick-disconnect motors).</li>
        <li><strong>Kitting:</strong> Have repair kits (tools + parts) ready for critical assets.</li>
      </ul>
    </div>
  );

  const faqs = [
    {
      question: "Is lower MTTR always better?",
      answer: "Generally, yes. However, if technicians rush repairs to 'beat the clock', they might cause repeat failures aka 'callback' work. Speed should never compromise quality or safety."
    },
    {
      question: "How does MTTR affect Availability?",
      answer: "Availability = MTBF / (MTBF + MTTR). As MTTR approaches zero, availability approaches 100%. Reducing MTTR is often cheaper and easier than increasing MTBF."
    },
    {
      question: "Does MTTR apply to Preventive Maintenance (PM)?",
      answer: "No. MTTR is strictly for <strong>corrective</strong> maintenance (fixing breakdowns). The time spent on scheduled PMs is tracked separately."
    }
  ];

  return (
    <ToolContentLayout
      title="MTTR Calculator"
      description="Calculate Mean Time To Repair to measure your maintenance team's efficiency and identify opportunities to reduce downtime."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MTTR Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default MttrCalculator;
