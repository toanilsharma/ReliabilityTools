
import React, { useState } from 'react';
import { calculateMTBFConfidence } from '../../services/reliabilityMath';
import { Target, BarChart2, BookOpen, AlertTriangle, Calculator, Divide } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const ConfidenceInterval: React.FC = () => {
  const [hours, setHours] = useState('10000');
  const [failures, setFailures] = useState('5');
  const [confidence, setConfidence] = useState('90');

  const result = calculateMTBFConfidence(
    parseFloat(hours) || 0,
    parseFloat(failures) || 0,
    parseFloat(confidence) || 90
  );

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Test Data Inputs
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Total Operating Hours
                <HelpTooltip text="Sum of operating hours of all units (failed + suspended)." />
              </label>
              <input
                type="number"
                value={hours}
                onChange={e => setHours(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Number of Failures
                <HelpTooltip text="Must be > 0. For zero failures, use the 'Test Planner' tool." />
              </label>
              <input
                type="number"
                value={failures}
                onChange={e => setFailures(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Confidence Level (%)
                <HelpTooltip text="Typically 90% or 95%. Higher confidence yields a wider range." />
              </label>
              <select
                value={confidence}
                onChange={e => setConfidence(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              >
                <option value="60">60% (Low)</option>
                <option value="80">80%</option>
                <option value="85">85%</option>
                <option value="90">90% (Standard)</option>
                <option value="95">95% (High)</option>
                <option value="99">99% (Very High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warning for low failures */}
        {parseFloat(failures) > 0 && parseFloat(failures) < 5 && (
          <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Stat Warning:</strong> Small sample size (&lt; 5 failures). The confidence interval will be very wide, indicating high uncertainty.
            </div>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <div className="space-y-6">
        {result ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">

            <div className="text-center mb-8 relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated MTBF (Mean)</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white">
                {Math.round(result.mean).toLocaleString()} <span className="text-lg font-medium text-slate-400">Hours</span>
              </div>
            </div>

            <div className="relative pt-8 pb-4 px-4 z-10">
              {/* Visual Range Bar */}
              <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-full relative w-full overflow-hidden">
                <div className="absolute top-0 bottom-0 left-[10%] right-[10%] bg-gradient-to-r from-cyan-400/20 via-cyan-400/60 to-cyan-400/20 border-x border-cyan-400/50"></div>
              </div>

              {/* Marker - Fake Visual for effect since scale is log */}
              <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-900 dark:bg-white z-20"></div>

              <div className="flex justify-between mt-4 relative">
                <div className="text-left w-1/3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Lower Limit</div>
                  <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{Math.round(result.lower).toLocaleString()}</div>
                </div>
                <div className="text-right w-1/3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Upper Limit</div>
                  <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{Math.round(result.upper).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
              We are <strong>{confidence}% confident</strong> that the true MTBF lies within this range.
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 p-8 text-center">
            <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Waiting for Data</h3>
            <p className="text-sm max-w-xs mx-auto">Enter Hours and Failures to calculate statistical bounds.</p>
          </div>
        )}
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">Why Confidence Intervals?</h2>
      <p>
        Reliability data is inherently uncertain. If you test 10 units and 1 fails at 1000 hours, calculating an MTBF of 10,000 hours (Total Hours / Failures) is just a <strong>Point Estimate</strong>. It is "probably" wrong.
      </p>
      <p>
        A <strong>Confidence Interval</strong> gives you a range (e.g., 2,500 to 45,000 hours) where the "True" MTBF actually lives.
      </p>

      <h2 id="chisquare">The Chi-Square Method</h2>
      <p>
        For constant failure rate (Exponential distribution), the confidence limits are calculated using the <strong>Chi-Square ($\chi^2$)</strong> distribution formula:
      </p>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-xs my-4 overflow-x-auto text-slate-600 dark:text-slate-300">
        MTBF_lower = 2 * TotalHours / χ²(α/2, 2r+2)<br />
        MTBF_upper = 2 * TotalHours / χ²(1-α/2, 2r)
      </div>
      <p>
        Where <code>r</code> is number of failures and <code>α</code> is (1 - Confidence).
      </p>

      <h2 id="interpretation">Interpretation</h2>
      <ul>
        <li><strong>Lower Limit:</strong> The pessimistic view. "At worst, the MTBF is..." (Used for Safety/Warranty calculations).</li>
        <li><strong>Upper Limit:</strong> The optimistic view. "At best, the MTBF is..."</li>
        <li><strong>Narrow Gap:</strong> Good data. We are sure.</li>
        <li><strong>Wide Gap:</strong> Bad data (too few failures). We are guessing.</li>
      </ul>
    </div>
  );

  const faqs = [
    {
      question: "Why does the Mean MTBF not change with confidence?",
      answer: "The Mean (Point Estimate) is simply Total Hours / Total Failures. It is a fixed number. Confidence only changes the <em>width</em> of the uncertainty range around that mean."
    },
    {
      question: "Can I use this for zero failures?",
      answer: "Technically yes (using a Lower Confidence Limit calculation), but this tool is optimized for >= 1 failure. For zero failure planning, use the 'Test Planner' tool."
    }
  ];

  return (
    <ToolContentLayout
      title="MTBF Confidence Calculator"
      description="Calculate the statistical uncertainty of your MTBF. Determine the Lower and Upper Confidence Limits using the Chi-Square method (IEC 60605-4)."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Confidence Interval Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default ConfidenceInterval;
