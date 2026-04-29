
import React, { useState } from 'react';
import { calculateKOutOfN } from '../../services/reliabilityMath';
import { Layers, Cuboid, Zap, CheckCircle2, AlertOctagon, Target, Info, Server, Activity } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const KOutOfN: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
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

  const { theme } = useTheme();

  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
    line: theme === 'dark' ? '#0ea5e9' : '#0284c7',
  };

  const generateSensitivityCurve = React.useMemo(() => {
    const data = [];
    const nVal = parseInt(n) || 0;
    const kVal = parseInt(k) || 0;
    if (nVal <= 0 || kVal <= 0 || kVal > nVal) return [];

    for (let r = 0; r <= 100; r += 2) {
      const sysRel = calculateKOutOfN(nVal, kVal, r / 100);
      data.push([r, sysRel * 100]);
    }
    return data;
  }, [n, k]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8" ref={toolRef}>

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

        <div className="h-64 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600" /> Sensitivity Analysis
          </h4>
          <ReactECharts
            option={{
              animation: false,
              grid: { left: '12%', right: '5%', top: '10%', bottom: '20%' },
              tooltip: { trigger: 'axis', formatter: (p: any) => `Component: ${p[0].value[0].toFixed(1)}%<br/>System: ${p[0].value[1].toFixed(2)}%`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
              xAxis: { 
                type: 'value', 
                name: 'Component Reliability (%)', 
                nameLocation: 'middle', 
                nameGap: 25, 
                splitLine: { show: false }, 
                axisLabel: { color: chartColors.axis } 
              },
              yAxis: { 
                type: 'value', 
                name: 'System Rel. (%)',
                nameLocation: 'middle', 
                nameGap: 35, 
                splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, 
                axisLabel: { color: chartColors.axis } 
              },
              series: [{
                type: 'line',
                data: generateSensitivityCurve,
                showSymbol: false,
                itemStyle: { color: chartColors.line },
                lineStyle: { width: 3 },
                areaStyle: { color: 'rgba(14, 165, 233, 0.1)' },
                markPoint: {
                  data: [
                    { name: 'Current', value: `${(result * 100).toFixed(1)}%`, xAxis: parseFloat(componentRel), yAxis: result * 100, itemStyle: { color: '#ef4444' } }
                  ]
                }
              }]
            }}
            style={{ height: 'calc(100% - 24px)', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
        <div className="mt-4">
          <ShareAndExport 
            toolName="K-Out-Of-N Analysis"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={`${(result * 100).toFixed(4)}%`}
            exportData={[
              { Parameter: "Total Units (N)", Value: n },
              { Parameter: "Required Units (K)", Value: k },
              { Parameter: "Component Reliability", Value: componentRel + "%" },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "System Reliability", Value: (result * 100).toFixed(4) + "%" },
              { Parameter: "Failure Probability", Value: ((1 - result) * 100).toFixed(4) + "%" }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">K-out-of-N Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">K-out-of-N is a flexible redundancy calculation used when a system has <code>N</code> identical components, but only <code>K</code> are required for the system to function successfully.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Binomial Probability"
          icon={<Target className="w-5 h-5" />}
          formula="R_{sys} = \sum_{i=K}^{N} \binom{N}{i} R^i (1-R)^{N-i}"
          delay={0.1}
        >
          <p>
            The mathematical foundation of partial redundancy. It calculates the cumulative probability that at least <code>K</code> out of <code>N</code> independent units survive a specified mission time, where every unit has reliability <code>R</code>.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Common Redundancy Types"
          icon={<Layers className="w-5 h-5" />}
          delay={0.2}
        >
          <ul className="space-y-3 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong className="text-cyan-700 dark:text-cyan-400">1-out-of-2 (1oo2):</strong> Simple Parallel Redundancy. Provides maximum reliability; only requires 1 to work.</li>
            <li><strong className="text-pink-700 dark:text-pink-400">2-out-of-2 (2oo2):</strong> Series Configuration. Requires both to work. Decreases reliability but ensures system fails safe if either faults.</li>
            <li><strong className="text-purple-700 dark:text-purple-400">2-out-of-3 (2oo3):</strong> Triple Modular Redundancy (TMR). Uses voting logic to balance extreme reliability with safety against false trips.</li>
          </ul>
        </TheoryBlock>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Real-World Applications</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Cuboid className="w-4 h-4 text-cyan-600" /> Pumps & Motors</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">A facility has 3 massive cooling pumps installed (N=3). The maximum summer thermal load requires the flow of exactly 2 pumps (K=2). The system only fails if multiple pumps drop out simultaneously.</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Server className="w-4 h-4 text-cyan-600" /> Data Centers</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">A high-availability RAID array utilizes 10 hard drives. Operational continuity is guaranteed as long as at least 8 drives remain readable (K=8).</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-cyan-600" /> Power Grid</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">An offshore rig has 4 turbine generators available. Peak operational load requires 3 generators running to maintain voltage stability.</p>
          </div>
        </div>
      </div>
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
