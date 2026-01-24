
import React, { useState } from 'react';
import { calculateOEE } from '../../services/reliabilityMath';
import { Gauge, Play, Pause, AlertOctagon, ClipboardList, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const OeeCalculator: React.FC = () => {
  const [shiftLength, setShiftLength] = useState<string>('480'); // 8 hours
  const [breaks, setBreaks] = useState<string>('60');
  const [downtime, setDowntime] = useState<string>('30');
  const [idealCycle, setIdealCycle] = useState<string>('60'); // 60 sec/part
  const [totalCount, setTotalCount] = useState<string>('350');
  const [rejects, setRejects] = useState<string>('10');

  const result = calculateOEE(
    parseFloat(shiftLength) || 0,
    parseFloat(breaks) || 0,
    parseFloat(downtime) || 0,
    parseFloat(idealCycle) || 0,
    parseFloat(totalCount) || 0,
    parseFloat(rejects) || 0
  );

  const formatPct = (val: number) => (val * 100).toFixed(1) + '%';

  const getColor = (val: number) => {
    if (val >= 0.85) return 'text-green-500';
    if (val >= 0.60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">

      {/* Input Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Production Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Shift Length (min)</label>
              <input type="number" value={shiftLength} onChange={e => setShiftLength(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Breaks (min)</label>
              <input type="number" value={breaks} onChange={e => setBreaks(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Unplanned Downtime (min)</label>
            <input type="number" value={downtime} onChange={e => setDowntime(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
              Ideal Cycle Time (sec/part)
              <HelpTooltip text="The theoretical fastest time to produce one part." />
            </label>
            <input type="number" value={idealCycle} onChange={e => setIdealCycle(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Total Count</label>
              <input type="number" value={totalCount} onChange={e => setTotalCount(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Rejects</label>
              <input type="number" value={rejects} onChange={e => setRejects(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Availability */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</h3>
          <div className={`text-3xl font-bold ${getColor(result.availability)} mb-2`}>{formatPct(result.availability)}</div>
          <p className="text-xs text-slate-500">Run Time / Planned Time</p>
        </div>

        {/* Performance */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
            <Gauge className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Performance</h3>
          <div className={`text-3xl font-bold ${getColor(result.performance)} mb-2`}>{formatPct(result.performance)}</div>
          <p className="text-xs text-slate-500">(Total * Cycle) / Run Time</p>
        </div>

        {/* Quality */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
            <AlertOctagon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Quality</h3>
          <div className={`text-3xl font-bold ${getColor(result.quality)} mb-2`}>{formatPct(result.quality)}</div>
          <p className="text-xs text-slate-500">Good Parts / Total Parts</p>
        </div>

        {/* Total OEE */}
        <div className="md:col-span-3 bg-slate-900 dark:bg-slate-100 p-8 rounded-xl shadow-lg flex items-center justify-between mt-4">
          <div>
            <h3 className="text-xl font-bold text-white dark:text-slate-900 mb-1">OEE Score</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Target: World Class > 85%</p>
          </div>
          <div className="text-6xl font-extrabold text-cyan-400 dark:text-cyan-600">
            {formatPct(result.oee)}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is OEE?</h2>
      <p>
        <strong>Overall Equipment Effectiveness (OEE)</strong> is the gold standard for measuring manufacturing productivity. It identifies the percentage of manufacturing time that is truly productive. An OEE score of 100% means you are manufacturing:
      </p>
      <ul>
        <li><strong>Good Parts</strong> only (100% Quality)</li>
        <li><strong>At Maximum Speed</strong> (100% Performance)</li>
        <li><strong>Without Interruption</strong> (100% Availability)</li>
      </ul>

      <h2 id="losses">The Six Big Losses</h2>
      <p>
        OEE analysis breaks down efficiency losses into three categories ("The OEE Factors") and six specific loss types:
      </p>

      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Availability Loss</h3>
          <ul className="text-xs text-blue-800/80 list-disc pl-4 space-y-1">
            <li>Equipment Breakdowns</li>
            <li>Setup & Adjustments</li>
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Performance Loss</h3>
          <ul className="text-xs text-amber-800/80 list-disc pl-4 space-y-1">
            <li>Idling & Minor Stops</li>
            <li>Reduced Speed (Slow Cycles)</li>
          </ul>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
          <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Quality Loss</h3>
          <ul className="text-xs text-purple-800/80 list-disc pl-4 space-y-1">
            <li>Startup Rejects</li>
            <li>Production Defects</li>
          </ul>
        </div>
      </div>

      <h2 id="calculation">How to Calculate</h2>
      <p>
        The formula is simple: <code>OEE = Availability × Performance × Quality</code>.
      </p>
      <p>
        However, measuring the inputs correctly is the challenge.
      </p>
      <ol>
        <li><strong>Availability:</strong> Run Time / Planned Production Time.</li>
        <li><strong>Performance:</strong> (Ideal Cycle Time × Total Count) / Run Time.</li>
        <li><strong>Quality:</strong> Good Cycle Count / Total Cycle Count.</li>
      </ol>
    </div>
  );

  const faqs = [
    {
      question: "What is a 'Good' OEE Score?",
      answer: "<ul><li><strong>100%</strong>: Perfect production (theoretical).</li><li><strong>85%</strong>: World Class for discrete manufacturers.</li><li><strong>60%</strong>: Typical for many manufacturers.</li><li><strong>40%</strong>: Common for low-volume or unoptimized processes.</li></ul>"
    },
    {
      question: "Does OEE include planned downtime?",
      answer: "No. Planned downtime (scheduled maintenance, holidays, lack of orders) is excluded from the calculation. OEE measures how effectively you use the time you are <em>scheduled</em> to run."
    },
    {
      question: "Why can Performance be > 100%?",
      answer: "If your Ideal Cycle Time is set too low (e.g., you underestimated the machine speed), Performance can exceed 100%. This usually means your standard cycle time needs updating."
    }
  ];

  return (
    <ToolContentLayout
      title="OEE Calculator"
      description="Calculate Overall Equipment Effectiveness (OEE) to pinpoint production losses. Measure Availability, Performance, and Quality against the ISO 22400 standard."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "OEE Calculator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default OeeCalculator;
