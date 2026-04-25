
import React, { useState } from 'react';
import { calculateMTTR } from '../../services/reliabilityMath';
import { Wrench, Clock, AlertCircle, Copy, Check, BookOpen, Target, TrendingUp, BarChart, Search, CheckCircle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';

const MttrCalculator: React.FC = () => {
  const [downtime, setDowntime] = useState<string>('120');
  const [repairs, setRepairs] = useState<string>('15');
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

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

        {result !== null && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-72">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-cyan-600" /> MTTR Gauge & Availability Impact
            </h4>
            <ReactECharts
              option={{
                animation: false,
                series: [{
                  type: 'gauge',
                  startAngle: 180,
                  endAngle: 0,
                  min: 0,
                  max: Math.max(24, result * 2),
                  splitNumber: 4,
                  itemStyle: { color: result <= 4 ? '#10b981' : result <= 8 ? '#f59e0b' : '#ef4444' },
                  progress: { show: true, roundCap: true, width: 14 },
                  pointer: { show: false },
                  axisLine: { roundCap: true, lineStyle: { width: 14, color: [[1, theme === 'dark' ? '#334155' : '#e2e8f0']] } },
                  axisTick: { show: false },
                  splitLine: { length: 8, lineStyle: { width: 2, color: theme === 'dark' ? '#475569' : '#94a3b8' } },
                  axisLabel: { distance: 18, color: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 },
                  title: { show: true, offsetCenter: [0, '30%'], fontSize: 12, color: theme === 'dark' ? '#94a3b8' : '#64748b' },
                  detail: { valueAnimation: false, formatter: '{value} hrs', offsetCenter: [0, '-10%'], fontSize: 22, fontWeight: 'bold', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' },
                  data: [{ value: parseFloat(result.toFixed(2)), name: 'Avg Repair Time' }]
                }]
              }}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">MTTR Engineering Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Mean Time To Repair (MTTR) is the master metric for maintenance efficiency. Where MTBF measures reliability, MTTR dictates maintainability.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The MTTR Formula"
          icon={<Wrench className="w-5 h-5" />}
          formula="\text{MTTR} = \frac{\text{Total Maintenance Time}}{\text{Total Number of Repairs}}"
          delay={0.1}
        >
          <p>
            MTTR measures the average time required to functionally restore a failed asset back to operating condition. Lower MTTR directly yields higher system availability.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/30 mt-3 flex gap-2 text-sm text-yellow-800 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p><strong>Warning:</strong> MTTR mathematically assumes only active repair time ("Wrench Time"). If you include logistical wait time, you are actually calculating Mean Down Time (MDT).</p>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="The 4 Stages of Repair"
          icon={<Clock className="w-5 h-5" />}
          delay={0.2}
        >
          <p>To reduce MTTR, you must analyze and optimize its distinct components:</p>
          <ul className="space-y-2 mt-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex gap-2 items-start"><AlertCircle className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" /> <strong>Notification:</strong> Time from failure until a tech is alerted.</li>
            <li className="flex gap-2 items-start"><Search className="w-4 h-4 mt-1 text-amber-500 flex-shrink-0" /> <strong>Diagnosis:</strong> Time to isolate the root cause (often the longest stage).</li>
            <li className="flex gap-2 items-start"><Wrench className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" /> <strong>Repair:</strong> Time to execute the physical fix or replacement.</li>
            <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" /> <strong>Verification:</strong> Time to test performance before returning to ops.</li>
          </ul>
        </TheoryBlock>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Strategies to Reduce MTTR</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-cyan-700 dark:text-cyan-400 mb-1">Advanced Diagnostics</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Utilize fault codes and IIoT sensors to bypass lengthy manual troubleshooting.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-cyan-700 dark:text-cyan-400 mb-1">Modular Design</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Implement components that can be quickly swapped out completely ("plug-and-play") rather than repaired in-situ.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-cyan-700 dark:text-cyan-400 mb-1">Standardized Kitting</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Pre-package required tools, lock-out tags, and spare parts near critical machines.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-cyan-700 dark:text-cyan-400 mb-1">Digital Documentation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Eliminate time spent searching for schematics via mobile-first digital asset management.</p>
          </div>
        </div>
      </div>
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
