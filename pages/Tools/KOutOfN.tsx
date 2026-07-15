
import React, { useState } from 'react';
import { calculateKOutOfN } from '../../services/reliabilityMath';
import { Layers, Cuboid, Zap, CheckCircle2, AlertOctagon, Target, Info, Server, Activity } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { InlineMath, BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';
import { RbdSeriesParallelDiagram } from '../../components/TheoryVisuals';


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
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Total Components (N)
            <HelpTooltip text="Total number of parallel units available." />
          </label>
          <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
            <input
              type="range" min="1" max="10"
              value={n} onChange={e => { setN(e.target.value); if (parseInt(k) > parseInt(e.target.value)) setK(e.target.value); }}
              className="flex-grow h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <span className="font-mono font-black bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-12 text-center text-slate-800 dark:text-white shadow-sm">{n}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Required for Success (K)
            <HelpTooltip text="Minimum number of units that must work for the system to function." />
          </label>
          <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
            <input
              type="range" min="1" max={n}
              value={k} onChange={e => setK(e.target.value)}
              className="flex-grow h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <span className="font-mono font-black bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-12 text-center text-slate-800 dark:text-white shadow-sm">{k}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Component Reliability (%)
            <HelpTooltip text="Reliability of a single unit over the mission time." />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number" step="0.1" max="100"
              value={componentRel} onChange={e => setComponentRel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="space-y-6">
        <div className="relative group">
          {/* Glowing blur background halo */}
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">System Reliability</div>
              <div className="text-5xl font-black tracking-tight mb-2">{(result * 100).toFixed(4)}%</div>
              <div className="text-xs opacity-85">
                Probability that at least {k} out of {n} units will survive.
              </div>
            </div>
            <Server className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
          </div>
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
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Understanding <span className="text-cyan-600 dark:text-cyan-400">K-out-of-N</span> Redundancy and Partial Failures
        </h2>
        <p>
          In high-reliability engineering, simple serial or simple parallel systems are not always practical or cost-effective. Instead, engineers design systems using <span className="font-extrabold text-cyan-600 dark:text-cyan-400">K-out-of-N redundancy</span>, which models partial redundancy. A K-out-of-N system contains <InlineMath math="N" /> identical, independent components configured in parallel. The system survives if and only if at least <InlineMath math="K" /> components remain operational during the mission time. This models active redundancy, where all units run simultaneously to share the operational burden.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Binomial Probability"
          icon={<Target className="w-5 h-5 text-cyan-600" />}
          formula="R_{sys} = \sum_{i=K}^{N} \binom{N}{i} R^i (1-R)^{N-i}"
          delay={0.1}
        >
          <p>
            The mathematical foundation of partial redundancy. It uses the <span className="font-bold text-indigo-600 dark:text-indigo-400">Binomial Distribution</span> to calculate the cumulative probability that at least <InlineMath math="K" /> out of <InlineMath math="N" /> independent components survive, where every unit has individual reliability <InlineMath math="R" /> and the binomial coefficient is calculated as:
            <BlockMath math="\binom{N}{i} = \frac{N!}{i!(N-i)!}" />
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Common Redundancy Types"
          icon={<Layers className="w-5 h-5 text-violet-600" />}
          delay={0.2}
        >
          <ul className="space-y-3 mt-2 text-sm">
            <li><strong className="text-cyan-600 dark:text-cyan-400">1-out-of-2 (1oo2):</strong> Simple Parallel Redundancy. Provides maximum reliability; only requires 1 of the 2 units to function.</li>
            <li><strong className="text-rose-600 dark:text-rose-455">2-out-of-2 (2oo2):</strong> Series Configuration. Requires both to work. Decreases reliability but ensures system fails safe if either faults.</li>
            <li><strong className="text-violet-600 dark:text-violet-400">2-out-of-3 (2oo3):</strong> Triple Modular Redundancy (TMR). Uses voting logic to balance extreme reliability with safety against false trips.</li>
          </ul>
        </TheoryBlock>
      </div>

      <div className="my-8">
        <RbdSeriesParallelDiagram />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
        📖 Complete Step-by-Step Practical Example
      </h3>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: Define the Scenario</span>
          <p className="mt-1">
            Imagine a critical reactor valve in a chemical plant operated by a Triple Modular Redundancy (2oo3) voting logic. There are <strong>3 pressure sensors</strong> (<InlineMath math="N = 3" />) checking for overpressure. The valve shuts down the reactor if at least <strong>2 sensors</strong> (<InlineMath math="K = 2" />) agree that safety limits are exceeded. Each sensor has an individual reliability of 95% (<InlineMath math="R = 0.95" />) over the inspection cycle.
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Expand the Binomial Sum</span>
          <p className="mt-1">
            To find the system reliability, we sum the probabilities of having exactly 2 working sensors and exactly 3 working sensors:
            <BlockMath math="R_{sys} = P(i = 2) + P(i = 3)" />
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Calculate Component Probabilities</span>
          <p className="mt-1">
            Using the binomial equation:
            <br />
            &nbsp;&nbsp;• <strong>Exactly 2 sensors succeed:</strong>
            <BlockMath math="P(2) = \binom{3}{2} (0.95)^2 (1-0.95)^1 = 3 \times 0.9025 \times 0.05 = 0.135375" />
            &nbsp;&nbsp;• <strong>Exactly 3 sensors succeed:</strong>
            <BlockMath math="P(3) = \binom{3}{3} (0.95)^3 (1-0.95)^0 = 1 \times 0.857375 \times 1 = 0.857375" />
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 4: Sum the Probabilities</span>
          <p className="mt-1">
            Sum the individual probabilities together to get the final system reliability:
            <BlockMath math="R_{sys} = 0.135375 + 0.857375 = 0.99275 \text{ (99.275%)}" />
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
          <span className="font-bold text-slate-800 dark:text-slate-100">💡 Conclusion in Simple Words:</span>
          <p className="mt-1 text-slate-650 dark:text-slate-400">
            "While a single sensor has a 5% chance of failing, configuring them in a 2-out-of-3 voting logic drops the system's chance of failure to only <strong>0.725%</strong> (<InlineMath math="100\% - 99.275\% = 0.725\%" />). This design protects the plant from single sensor hardware failures without inducing false trips from a single faulty reading."
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Real-World Applications</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-gradient-to-b from-cyan-500/5 to-transparent border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Cuboid className="w-4 h-4 text-cyan-600" /> Pumps & Motors</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">A facility has 3 cooling pumps (N=3). The thermal load require flow from 2 pumps (K=2) during high summer temperature. The system only fails if multiple pumps break down.</p>
          </div>
          <div className="p-5 bg-gradient-to-b from-cyan-500/5 to-transparent border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Server className="w-4 h-4 text-cyan-600" /> Data Centers</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">A high-reliability RAID array utilizes 10 hard drives. Data remains accessible and recoverable as long as at least 8 drives remain operational (K=8).</p>
          </div>
          <div className="p-5 bg-gradient-to-b from-cyan-500/5 to-transparent border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-cyan-600" /> Power Grid</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">An offshore rig has 4 turbine generators available. Peak operational load requires at least 3 generators running to prevent grid instability.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What does 'K-out-of-N' mean in simple terms?",
      answer: "In a K-out-of-N configuration, you have a total of N identical, independent components in parallel. The system functions successfully if at least K of these components remain operational. For example, a 2oo3 (2-out-of-3) system has 3 units and requires at least 2 of them to work to prevent system failure."
    },
    {
      question: "How does single component reliability affect the overall K-out-of-N reliability?",
      answer: "If individual component reliability (R) is high (typically R > 0.5), adding active redundancy (making K < N) significantly boosts system reliability. However, if individual reliability is extremely low (R < 0.5), adding more components can actually lower system reliability because the math of the binomial expansion works against you."
    },
    {
      question: "What is the difference between Active Redundancy and Standby Redundancy?",
      answer: "In Active Redundancy (which this calculator models), all N components operate continuously. If one fails, the remaining active units continue to bear the load without any switching delays. In Standby Redundancy, only K components run actively while the other N-K components are dormant ('cold' or 'warm' standby) and are switched on by a control system only when an active unit fails."
    },
    {
      question: "What is a 'Common Cause Failure' (CCF) and how does it limit redundancy?",
      answer: "A Common Cause Failure occurs when a single external event (such as a power spike, high temperature, flooding, or software bug) causes multiple redundant components to fail simultaneously. CCF places a mathematical ceiling on reliability; no matter how many parallel units you add, if they share a common failure mode, the system's reliability is limited by the probability of that common cause."
    },
    {
      question: "Why is a 2-out-of-3 (2oo3) voting configuration so popular in industrial safety?",
      answer: "A 2oo3 system balances safety and operational uptime. A 1oo2 system is very reliable but prone to 'false trips' (nuisance shutdowns if one sensor malfunctions). A 2oo2 system prevents false trips but is less safe because both must agree to shut down. 2oo3 provides '2-out-of-3 voting logic' which requires at least 2 sensors to agree, preventing single-point failure trips while maintaining high safety."
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
