import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateSIL } from '../../services/reliabilityMath';
import { ShieldAlert, Activity, ChevronRight, ChevronLeft, Loader2, Landmark } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import TheoryBlock from '../../components/TheoryBlock';
import WizardWrapper from '../../components/WizardWrapper';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';
import { motion } from 'framer-motion';


const SilVerification: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  const [lambdaDU, setLambdaDU] = useState<string>('1.5e-6');

  const [testInterval, setTestInterval] = useState<string>('8760');
  const [arch, setArch] = useState<'1oo1' | '1oo2' | '2oo2' | '2oo3'>('1oo1');
  const [mode, setMode] = useState<'wizard' | 'expert'>('wizard');
  const [isCalculating, setIsCalculating] = useState(false);

  const l = parseFloat(lambdaDU);
  const t = parseFloat(testInterval);
  const isValid = !isNaN(l) && !isNaN(t) && l > 0 && t > 0;

  const [computed, setComputed] = useState(() => isValid ? calculateSIL(l, t, arch) : null);

  const runCalculation = () => {
    if (!isValid) return;
    setIsCalculating(true);
    setTimeout(() => {
      setComputed(calculateSIL(l, t, arch));
      setIsCalculating(false);
    }, 300);
  };

  React.useEffect(() => {
    if (mode === 'expert') runCalculation();
  }, [lambdaDU, testInterval, arch, mode]);

  const result = computed;

  const getSilColor = (level: number) => {
    if (level === 4) return 'bg-purple-600';
    if (level === 3) return 'bg-red-600';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-yellow-500';
    return 'bg-slate-500';
  };

  const equationByArch: Record<'1oo1' | '1oo2' | '2oo2' | '2oo3', string> = {
    '1oo1': 'PFD_{avg} = \\frac{\\lambda_{DU} \\cdot T_I}{2}',
    '1oo2': 'PFD_{avg} = \\frac{(\\lambda_{DU} \\cdot T_I)^2}{3}',
    '2oo2': 'PFD_{avg} = \\lambda_{DU} \\cdot T_I',
    '2oo3': 'PFD_{avg} = (\\lambda_{DU} \\cdot T_I)^2',
  };

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const generateSawtoothCurve = React.useMemo(() => {
    if (!isValid) return [];
    const lambda = parseFloat(lambdaDU);
    const ti = parseFloat(testInterval);
    const data: [number, number][] = [];
    const numIntervals = 3;
    const stepsPerInterval = 50;
    
    for (let interval = 0; interval < numIntervals; interval++) {
      for (let step = 0; step <= stepsPerInterval; step++) {
        const tWithinInterval = (step / stepsPerInterval) * ti;
        const totalTime = interval * ti + tWithinInterval;
        let pfd = 0;
        if (arch === '1oo1') pfd = lambda * tWithinInterval;
        else if (arch === '1oo2') pfd = Math.pow(lambda * tWithinInterval, 2);
        else if (arch === '2oo2') pfd = 2 * lambda * tWithinInterval;
        else if (arch === '2oo3') pfd = 3 * Math.pow(lambda * tWithinInterval, 2);
        pfd = Math.min(1, pfd);
        data.push([totalTime, pfd]);
      }
    }
    return data;
  }, [lambdaDU, testInterval, arch, isValid]);

  const steps = [
    {
      title: 'Choose Architecture',
      description: 'Select the system redundancy and voting logic.',
      isValid: true,
      content: (
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Voting Logic</label>
          <div className="grid grid-cols-4 gap-3">
            {(['1oo1', '1oo2', '2oo2', '2oo3'] as const).map(a => (
              <button
                key={a}
                onClick={() => setArch(a)}
                className={`py-3 text-sm font-black rounded-xl border-2 transition-all ${arch === a
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-cyan-400 hover:text-cyan-600'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Failure Rate Data',
      description: 'Input the Dangerous Undetected failure metric.',
      isValid: !isNaN(parseFloat(lambdaDU)) && parseFloat(lambdaDU) > 0,
      content: (
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
            Lambda DU (failures/hr)
            <HelpTooltip text="Dangerous undetected failure rate from safety data." why="PFD is proportional to lambdaDU." formula="PFD_{avg} \propto \lambda_{DU}" />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="text"
              value={lambdaDU}
              onChange={e => setLambdaDU(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-24 py-3 outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-slate-900 dark:text-white text-lg"
              placeholder="1.5e-6"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550">λ / hour</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Proof Test Interval',
      description: 'Define the frequency of safety validation tests.',
      isValid: !isNaN(parseFloat(testInterval)) && parseFloat(testInterval) > 0,
      content: (
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
            Test Interval (hours)
            <HelpTooltip text="Time between full function tests." why="Longer intervals increase the risk window." formula="PFD_{avg} \propto T_I" />
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number"
              value={testInterval}
              onChange={e => setTestInterval(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-16 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white text-lg font-bold"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-550">hours</span>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { l: '6 Mo', v: '4380' },
              { l: '1 Yr', v: '8760' },
              { l: '2 Yr', v: '17520' }
            ].map(b => (
              <button key={b.v} onClick={() => setTestInterval(b.v)} className="flex-1 py-2 text-[10px] font-black uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {b.l}
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8" ref={toolRef}>

      <div className="space-y-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-855 rounded-xl w-fit relative border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMode('wizard')}
            className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-lg transition-colors duration-200 relative z-10 ${
              mode === 'wizard' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Guided Wizard
            {mode === 'wizard' && (
              <motion.div
                layoutId="activeModePill"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
          
          <button
            onClick={() => setMode('expert')}
            className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-lg transition-colors duration-200 relative z-10 ${
              mode === 'expert' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Expert Mode
            {mode === 'expert' && (
              <motion.div
                layoutId="activeModePill"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>

        {mode === 'wizard' ? (
          <WizardWrapper 
            steps={steps} 
            onFinish={runCalculation} 
            isLoading={isCalculating}
            finishText="Verify SIL"
            finishIcon={<ShieldAlert className="w-4 h-4" />}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {steps.map((panel) => (
              <div key={panel.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">{panel.title}</h3>
                {panel.content}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Live Math</h4>
          <BlockMath math={equationByArch[arch]} />
          {isValid && <div className="text-xs text-slate-500 mt-2">Current input: lambdaDU={lambdaDU}, TI={testInterval} h</div>}
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="relative group">
            {/* Glowing blur background halo */}
            <div className={`absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r ${
              result.silLevel === 4 ? 'from-purple-500 to-indigo-650' :
              result.silLevel === 3 ? 'from-red-500 to-rose-600' :
              result.silLevel === 2 ? 'from-orange-500 to-amber-600' :
              result.silLevel === 1 ? 'from-yellow-500 to-yellow-600' :
              'from-slate-500 to-slate-650'
            }`}></div>
            
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-center overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Achieved Performance</div>

                <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${getSilColor(result.silLevel)} text-white shadow-2xl mb-8 ring-4 ring-white dark:ring-slate-800`}>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-black tracking-tighter">SIL {result.silLevel}</div>
                    {result.silLevel === 0 && <div className="text-xs opacity-80 mt-1 font-bold">Unrated</div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-bold mb-1">PFD (Avg)</div>
                    <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{result.pfd.toExponential(2)}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] text-slate-400 dark:text-slate-550 uppercase font-bold mb-1">RRF</div>
                    <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{Math.round(result.rrf).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-slate-400">
            <Activity className="w-16 h-16 mb-4 opacity-20" />
            <p>Complete inputs to calculate SIL.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-slate-500" /> Reference Table (Low Demand)
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { sil: 4, range: '>=1e-5 to <1e-4', color: 'text-purple-600' },
              { sil: 3, range: '>=1e-4 to <1e-3', color: 'text-red-600' },
              { sil: 2, range: '>=1e-3 to <1e-2', color: 'text-orange-600' },
              { sil: 1, range: '>=1e-2 to <1e-1', color: 'text-yellow-600' },
            ].map((row) => (
              <div key={row.sil} className={`flex justify-between items-center p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${result?.silLevel === row.sil ? 'ring-2 ring-cyan-500' : 'opacity-60'}`}>
                <span className={`font-bold ${row.color}`}>SIL {row.sil}</span>
                <span className="text-slate-500">{row.range}</span>
              </div>
            ))}
          </div>
        </div>

        {result && generateSawtoothCurve.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-64 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" /> PFD(t) Sawtooth Curve
            </h4>
            <ReactECharts
              option={{
                animation: false,
                grid: { left: '15%', right: '5%', top: '10%', bottom: '20%' },
                tooltip: { trigger: 'axis', formatter: (p: any) => `Time: ${Math.round(p[0].value[0]).toLocaleString()} hrs<br/>PFD: ${p[0].value[1].toExponential(2)}`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
                xAxis: { type: 'value', name: 'Time (hours)', nameLocation: 'middle', nameGap: 25, splitLine: { show: false }, axisLabel: { color: chartColors.axis } },
                yAxis: { type: 'value', name: 'PFD(t)', nameLocation: 'middle', nameGap: 40, splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, axisLabel: { color: chartColors.axis, formatter: (v: number) => v.toExponential(1) } },
                series: [
                  { type: 'line', data: generateSawtoothCurve, showSymbol: false, itemStyle: { color: '#ef4444' }, lineStyle: { width: 2 }, areaStyle: { color: 'rgba(239, 68, 68, 0.08)' } },
                  { type: 'line', data: [[0, result.pfd], [generateSawtoothCurve[generateSawtoothCurve.length - 1]?.[0] || 0, result.pfd]], showSymbol: false, itemStyle: { color: '#06b6d4' }, lineStyle: { width: 2, type: 'dashed' }, name: 'PFDavg' }
                ]
              }}
              style={{ height: 'calc(100% - 24px)', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
        <div className="mt-4">
          <ShareAndExport 
            toolName="SIL Verification"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={result ? `SIL ${result.silLevel}` : ""}
            exportData={[
              { Parameter: "Architecture", Value: arch },
              { Parameter: "Lambda DU", Value: lambdaDU },
              { Parameter: "Test Interval (Hrs)", Value: testInterval },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "SIL Level", Value: result ? result.silLevel.toString() : "N/A" },
              { Parameter: "PFD Avg", Value: result ? result.pfd.toExponential(2) : "N/A" },
              { Parameter: "Risk Reduction Factor", Value: result ? Math.round(result.rrf).toString() : "N/A" }
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
          Understanding <span className="text-cyan-600 dark:text-cyan-400">Safety Integrity Level (SIL)</span> Verification
        </h2>
        <p>
          In high-risk process industries like chemical reactors, refineries, and nuclear plants, maintaining functional safety systems is paramount to preventing catastrophic accidents. The <span className="font-extrabold text-cyan-600 dark:text-cyan-400">SIL Verification Calculator</span> evaluates the performance of Safety Instrumented Functions (SIFs) by calculating their <strong>Average Probability of Failure on Demand (PFDavg)</strong> and <strong>Risk Reduction Factor (RRF)</strong>. By determining safety performance under low-demand operation, this tool translates hardware architectures and failure rates directly into quantified safety compliance indexes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Mathematical Equations"
          icon={<ShieldAlert className="w-5 h-5 text-cyan-600" />}
          delay={0.1}
        >
          <p>
            PFDavg represents the average probability that a safety function will fail to operate when a process demand occurs. It is calculated using formulas specific to the voting logic architecture:
            <br />
            • <strong>1oo1:</strong> <InlineMath math="PFD_{avg} = \frac{\lambda_{DU} \cdot T_I}{2}" />
            <br />
            • <strong>1oo2:</strong> <InlineMath math="PFD_{avg} = \frac{(\lambda_{DU} \cdot T_I)^2}{3}" />
            <br />
            • <strong>2oo3:</strong> <InlineMath math="PFD_{avg} = (\lambda_{DU} \cdot T_I)^2" />
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Pillars of Functional Safety"
          icon={<Activity className="w-5 h-5 text-cyan-600" />}
          delay={0.2}
        >
          <ul className="space-y-2 mt-1 text-sm">
            <li><strong className="text-amber-600 dark:text-amber-400">Dangerous Undetected (λDU):</strong> Solitary failure modes that are both dangerous and un-diagnosed by internal software loops, remaining hidden until a proof test.</li>
            <li><strong className="text-rose-600 dark:text-rose-455">Proof Test Interval (TI):</strong> The scheduled maintenance cycle where the function is physically tripped to detect latent faults, resetting the PFD risk curve.</li>
          </ul>
        </TheoryBlock>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
        📖 Step-by-Step Practical Safety Example: 2oo3 Voting Logic SIF
      </h3>

      <div className="space-y-4 text-sm leading-relaxed text-slate-750 dark:text-slate-300">
        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: System Parameters</span>
          <p className="mt-1">
            Let's evaluate a distillation column overpressure protection system:
            <br />
            &nbsp;&nbsp;• Transmitters failure rate: <InlineMath math="\lambda_{DU} = 1.2 \times 10^{-6} \text{ failures / hour}" />
            <br />
            &nbsp;&nbsp;• Proof Test Interval: 1 year (<InlineMath math="T_I = 8{,}760 \text{ hours}" />)
            <br />
            &nbsp;&nbsp;• Voting Architecture: <strong>2oo3</strong> (2 out of 3 pressure transmitters must vote to trip)
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Solve the PFDavg Equation</span>
          <p className="mt-1">
            Using the standard 2oo3 low-demand formula:
            <BlockMath math="\lambda_{DU} \cdot T_I = (1.2 \times 10^{-6}) \times 8760 = 0.010512" />
            <BlockMath math="PFD_{avg} = (0.010512)^2 \approx 1.105 \times 10^{-4}" />
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Determine SIL Rating and Risk Reduction</span>
          <p className="mt-1">
            The Risk Reduction Factor (RRF) is:
            <BlockMath math="RRF = \frac{1}{PFD_{avg}} = \frac{1}{1.105 \times 10^{-4}} \approx 9{,}050" />
            Consulting the IEC standard low-demand demand table:
            <br />
            &nbsp;&nbsp;• A PFDavg between <InlineMath math="10^{-4}" /> and <InlineMath math="10^{-3}" /> corresponds to <strong>SIL 3</strong>.
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
          <span className="font-bold text-slate-800 dark:text-slate-100">💡 Engineering Takeaway:</span>
          <p className="mt-1 text-slate-650 dark:text-slate-400">
            "By choosing a 2oo3 transmitter configuration with a 1-year test cycle, this Safety Instrumented Function achieves a certified <strong>SIL 3</strong> rating, reducing column overpressure hazards by a factor of <strong>9,050</strong>."
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-cyan-600" /> Functional Safety Standards
        </h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350">
          SIL verification is strictly governed by global engineering regulatory standards:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-350">
          <li><strong>IEC 61508:</strong> Functional Safety of Electrical/Electronic/Programmable Electronic Safety-Related Systems. It defines the low-demand PFD categories (SIL 1 to SIL 4).</li>
          <li><strong>IEC 61511:</strong> Functional Safety standard tailored specifically for the Process Industries (chemical plants, oil & gas, pulp & paper).</li>
          <li><strong>ANSI/ISA-84.00.01:</strong> The US standard governing Safety Instrumented Systems (SIS) design and verification.</li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between Low-Demand and High-Demand/Continuous operating modes?",
      answer: "In Low-Demand Mode, the safety function is only activated occasionally (less than once per year). Risk is measured using the Average Probability of Failure on Demand (PFDavg). In High-Demand or Continuous Mode, the safety function is activated frequently (more than once per year) or is continuously active. Risk is measured as the Average Probability of Failure per Hour (PFH). This calculator is designed for Low-Demand PFDavg verification."
    },
    {
      question: "What is a 'Dangerous Undetected' failure rate (λDU), and how is it different from other failure rates?",
      answer: "Safety systems have four failure modes defined by Failure Modes, Effects, and Diagnostic Analysis (FMEDA): Safe Detected (λSD), Safe Undetected (λSU), Dangerous Detected (λDD), and Dangerous Undetected (λDU). Safe failures trip the system safely but cause nuisance downtime. Dangerous Detected failures are caught by diagnostics, placing the system in a safe state. Dangerous Undetected failures are the most critical because they prevent the system from shutting down during an emergency and go unnoticed until a proof test or actual demand occurs."
    },
    {
      question: "How does the Proof Test Coverage (PTC) affect SIL verification?",
      answer: "A standard proof test rarely checks 100% of failure modes. Proof Test Coverage (PTC) is the percentage of dangerous undetected failures detected during a test. If PTC is less than 100% (e.g., 90%), some failures remain undetected, and the PFDavg will accumulate over multiple intervals rather than resetting to near-zero. This calculator assumes 100% PTC for baseline calculations."
    },
    {
      question: "Why are voting architectures like 1oo2 or 2oo3 preferred over 1oo1 or 2oo2?",
      answer: "The choice represents a trade-off between safety and spurious trips (uptime). A 1oo2 configuration provides excellent safety (higher SIL) because only one sensor needs to work to trip the system, but it doubles the risk of nuisance spurious trips due to a single sensor malfunction. A 2oo2 configuration prevents spurious trips but reduces safety (lower SIL) because both sensors must work. A 2oo3 configuration is the industry gold standard because it provides both safety redundancy (failsafe) and spurious trip protection (fault-tolerance) through voting."
    },
    {
      question: "What is the 'Beta Factor' (β) in SIL verification, and why does it set a ceiling on redundancy gains?",
      answer: "The Beta Factor represents the percentage of failures caused by Common Cause Failures (CCF)—events that fail multiple redundant channels simultaneously (e.g., extreme temperature, electrical surges, or calibration errors). In real-world systems, CCF limits the safety gains of redundancy. Even if a 1oo2 system mathematically has a very low PFD, a 5% common cause factor (β = 0.05) will dominate the calculation, placing a physical limit on the maximum SIL level achievable."
    }
  ];

  return (
    <ToolContentLayout
      title="SIL Verification Calculator"
      description="Verify SIL with guided wizard mode, live equation rendering, and instant PFD/RRF scoring aligned to IEC low-demand ranges."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="SIL verification calculator, safety integrity level, PFDavg calculator, IEC 61508, safety instrumented system, SIL 1 SIL 2 SIL 3 SIL 4, voting logic PFD, reliability engineering calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/sil"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SIL Calculator',
        applicationCategory: 'UtilitiesApplication'
      }}
    />
  );
};

export default SilVerification;