
import React, { useState } from 'react';
import { calculateTestTimeForMTBF, calculateSuccessRunSampleSize } from '../../services/reliabilityMath';
import { Microscope, Clock, Users, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const TestPlanner: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
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

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const generateTradeoffCurve = React.useMemo(() => {
    if (mode !== 'MTBF') return [];
    const mtbf = parseFloat(targetMtbf) || 5000;
    const data: [number, number][] = [];
    const confLevels = [50, 60, 70, 80, 85, 90, 92, 95, 97, 99];
    
    for (const cl of confLevels) {
      const testTime = calculateTestTimeForMTBF(mtbf, cl / 100);
      data.push([cl, Math.ceil(testTime)]);
    }
    return data;
  }, [targetMtbf, mode]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8" ref={toolRef}>

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

        {mode === 'MTBF' && generateTradeoffCurve.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-64 shadow-sm mt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-cyan-600" /> Confidence vs Test Time Trade-off
            </h4>
            <ReactECharts
              option={{
                animation: false,
                grid: { left: '15%', right: '5%', top: '10%', bottom: '20%' },
                tooltip: { trigger: 'axis', formatter: (p: any) => `Confidence: ${p[0].value[0]}%<br/>Test Hours: ${p[0].value[1].toLocaleString()}`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
                xAxis: { type: 'value', name: 'Confidence (%)', nameLocation: 'middle', nameGap: 25, min: 50, max: 100, splitLine: { show: false }, axisLabel: { color: chartColors.axis } },
                yAxis: { type: 'value', name: 'Total Test Hours', nameLocation: 'middle', nameGap: 40, splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, axisLabel: { color: chartColors.axis, formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toString() } },
                series: [{
                  type: 'line',
                  data: generateTradeoffCurve,
                  showSymbol: true,
                  symbolSize: 6,
                  itemStyle: { color: '#8b5cf6' },
                  lineStyle: { width: 3 },
                  areaStyle: { color: 'rgba(139, 92, 246, 0.08)' },
                  markPoint: resultTime !== null ? {
                    data: [{ name: 'Selected', value: Math.ceil(resultTime).toLocaleString(), xAxis: parseFloat(confidence), yAxis: Math.ceil(resultTime), itemStyle: { color: '#ef4444' } }]
                  } : undefined
                }]
              }}
              style={{ height: 'calc(100% - 24px)', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        )}
        <div className="mt-4">
          <ShareAndExport 
            toolName="Reliability Test Planner"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={mode === 'MTBF' && resultTime ? `${Math.ceil(resultTime)}h Total` : mode === 'Reliability' && resultSamples ? `${resultSamples} Units` : ""}
            exportData={[
              { Parameter: "Mode", Value: mode },
              { Parameter: "Confidence Level", Value: confidence + "%" },
              ...(mode === 'MTBF' ? [
                { Parameter: "Target MTBF", Value: targetMtbf },
                { Parameter: "Test Units", Value: numUnits },
                { Parameter: "Required Total Time", Value: resultTime ? Math.ceil(resultTime).toString() : "N/A" }
              ] : [
                { Parameter: "Target Reliability", Value: targetReliability + "%" },
                { Parameter: "Required Samples", Value: resultSamples ? resultSamples.toString() : "N/A" }
              ])
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Success Run Theorem</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Physical reliability testing burns immense capital and time. The Success Run (Zero-Failure) qualification allows you to statistically bypass infinitely long test phases by front-loading highly parallel testing with zero failure tolerance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="MTBF Demonstration"
          icon={<Clock className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            When aiming for continuous operation targets (e.g., "50k hour MTBF"), calculating <strong>accumulated test hours</strong> proves statistical confidence. By running <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">10</span> physical units in parallel for <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">230 hours</span>, you effectively simulate <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded">2,300 hours</span> of field survival—assuming all 10 survive identically.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Mission Reliability %"
          icon={<Target className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            When addressing "One-Shot" explosive devices or isolated spacecraft missions, testing calculates rigid <strong>Sample Sizes</strong> rather than hours. Proving 95% rocket deployment reliability with 90% confidence dictates testing precisely 45 rockets flawlessly prior to launch.
          </p>
        </TheoryBlock>
      </div>
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
