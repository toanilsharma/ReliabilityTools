
import React, { useState } from 'react';
import { calculateKOutOfN } from '../../services/reliabilityMath';
import { Layers, Cuboid, Zap, CheckCircle2, AlertOctagon, Target, Info, Server } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const KOutOfN: React.FC = () => {
  const [n, setN] = useState<string>('3');
  const [k, setK] = useState<string>('2');
  const [componentRel, setComponentRel] = useState<string>('95');
  const [time, setTime] = useState<string>('8760');

  const rel = parseFloat(componentRel) / 100;
  const result = calculateKOutOfN(
    parseInt(n) || 0,
    parseInt(k) || 0,
    rel || 0
  );

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Redundancy Configuration
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Total Components (N)
            <HelpTooltip text="Total number of parallel units available." />
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range" min="1" max="10"
              value={n} onChange={e => { setN(e.target.value); if (parseInt(k) > parseInt(e.target.value)) setK(e.target.value); }}
              className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <span className="font-mono font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 w-12 text-center">{n}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Required for Success (K)
            <HelpTooltip text="Minimum number of units that must work for the system to function." />
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range" min="1" max={n}
              value={k} onChange={e => setK(e.target.value)}
              className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <span className="font-mono font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 w-12 text-center">{k}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Component Reliability (%)
            <HelpTooltip text="Reliability of a single unit over the mission time." />
          </label>
          <input
            type="number" step="0.1" max="100"
            value={componentRel} onChange={e => setComponentRel(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">System Reliability</div>
            <div className="text-5xl font-black tracking-tight mb-2">{(result * 100).toFixed(4)}%</div>
            <div className="text-xs opacity-80">
              Probability that at least {k} out of {n} units will survive.
            </div>
          </div>
          <Server className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Improvement</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {result > rel ? `+${((result - rel) * 100).toFixed(2)}%` : '0%'}
            </div>
            <div className="text-[10px] text-slate-400">Gain over single unit</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Failure Probability</div>
            <div className="text-xl font-bold text-red-500 dark:text-red-400">
              {((1 - result) * 100).toFixed(4)}%
            </div>
            <div className="text-[10px] text-slate-400">Risk of system failure</div>
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is K-out-of-N Redundancy?</h2>
      <p>
        <strong>K-out-of-N</strong> is a flexible redundancy calculation used when a system has <code>N</code> identical components, but only <code>K</code> are required for the system to function successfully.
      </p>
      <ul>
        <li><strong>Parallel Redundancy (1oo2):</strong> 1 out of 2. Only requires 1 to work. High reliability.</li>
        <li><strong>Dual Modular Redundancy (2oo2):</strong> 2 out of 2. Requires both to work. Low reliability (series).</li>
        <li><strong>Triple Modular Redundancy (2oo3):</strong> 2 out of 3. Voting logic. Ideal balance of safety and availability.</li>
      </ul>

      <h2 id="examples">Real World Examples</h2>
      <ul>
        <li><strong>Pumps:</strong> You have 3 pumps installed (N=3). The flow requirement can be met by 2 pumps running (K=2). The system only fails if 2 or more pumps fail.</li>
        <li><strong>Data Centers:</strong> You have 10 hard drives in a RAID array. The data is safe as long as at least 8 drives are alive (K=8).</li>
        <li><strong>Power Grid:</strong> 4 Generators available. Peak load requires 3 Generators.</li>
      </ul>

      <h2 id="formula">The Math</h2>
      <p>
        It calculates the cumulative binomial probability:
        <br />
        <code>R_system = Σ [N! / (i!(N-i)!)] * R^i * (1-R)^(N-i)</code>
        <br />
        Summed from i = K to N.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "Is K-out-of-N better than simple parallel?",
      answer: "Simple parallel (1-out-of-N) is always the <em>most</em> reliable, but it is often expensive or practically impossible (e.g., one small pump cannot handle the whole flow). K-out-of-N allows for 'Partial Redundancy', which is a cost-effective compromise."
    },
    {
      question: "Does this assume independent failures?",
      answer: "Yes. The formula assumes that the failure of one unit does not affect the others (Active Redundancy). If you have 'Common Cause Failures' (e.g., all pumps share the same dirty power supply), the actual reliability will be much lower."
    }
  ];

  return (
    <ToolContentLayout
      title="K-Out-Of-N Calculator"
      description="Calculate reliability for systems with partial redundancy (e.g., 2-out-of-3 voting logic). Essential for RAID arrays, pump stations, and voting safety systems."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "K-Out-Of-N Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default KOutOfN;
