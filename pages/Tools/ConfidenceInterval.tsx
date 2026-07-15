import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, BarChart2, AlertTriangle, Calculator } from 'lucide-react';
import { calculateMTBFConfidence } from '../../services/reliabilityMath';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath, InlineMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';
import { ConfidenceIntervalVisual } from '../../components/TheoryVisuals';


const ConfidenceInterval: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  const [hours, setHours] = useState('10000');

  const [failures, setFailures] = useState('5');
  const [confidence, setConfidence] = useState('90');

  const result = calculateMTBFConfidence(
    parseFloat(hours) || 0,
    parseFloat(failures) || 0,
    parseFloat(confidence) || 90
  );

  const { theme } = useTheme();
  
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
    area: theme === 'dark' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.1)',
  };

  const generateBellCurve = React.useMemo(() => {
    if (!result) return [];
    const stdDev = (result.upper - result.lower) / 3.5; 
    const minX = Math.max(0, result.mean - stdDev * 4);
    const maxX = result.mean + stdDev * 4;
    const step = (maxX - minX) / 100;
    
    const data = [];
    for (let x = minX; x <= maxX; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - result.mean) / stdDev, 2));
      data.push([x, y]);
    }
    return data;
  }, [result]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8" ref={toolRef}>

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
          <div className="relative group">
            {/* Glowing blur background halo */}
            <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">

              <div className="text-center mb-8 relative z-10">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Estimated MTBF (Mean)</div>
                <div className="text-5xl font-black text-cyan-600 dark:text-cyan-400">
                  {Math.round(result.mean).toLocaleString()} <span className="text-lg font-medium text-slate-400 dark:text-slate-550">Hours</span>
                </div>
              </div>

            <div className="h-64 w-full relative z-10 mt-6">
              <ReactECharts
                option={{
                  animation: false,
                  grid: { left: '5%', right: '5%', top: '10%', bottom: '15%' },
                  tooltip: {
                    trigger: 'axis',
                    formatter: (params: any) => `MTBF: ${Math.round(params[0].value[0]).toLocaleString()} hrs`,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#334155',
                    textStyle: { color: '#f8fafc' }
                  },
                  xAxis: {
                    type: 'value',
                    name: 'MTBF (Hours)',
                    nameLocation: 'middle',
                    nameGap: 25,
                    splitLine: { show: false },
                    axisLabel: { color: chartColors.axis, formatter: (val: number) => Math.round(val).toLocaleString() }
                  },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'line',
                    showSymbol: false,
                    smooth: true,
                    data: generateBellCurve,
                    lineStyle: { width: 3, color: '#06b6d4' },
                    areaStyle: { color: chartColors.area },
                    markArea: {
                      itemStyle: { color: 'rgba(6, 182, 212, 0.15)' },
                      data: [
                        [
                          { xAxis: result.lower },
                          { xAxis: result.upper }
                        ]
                      ]
                    },
                    markLine: {
                      symbol: ['none', 'none'],
                      label: { show: true, position: 'middle', formatter: 'Mean', color: '#06b6d4' },
                      lineStyle: { type: 'dashed', color: '#06b6d4', width: 2 },
                      data: [{ xAxis: result.mean }]
                    }
                  }]
                }}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>

            <div className="flex justify-between mt-2 relative z-10 px-8">
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Lower Limit</div>
                <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{Math.round(result.lower).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Upper Limit</div>
                <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{Math.round(result.upper).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
              We are <strong>{confidence}% confident</strong> that the true MTBF lies within this range.
            </div>
          </div>
        </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 p-8 text-center">
            <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Waiting for Data</h3>
            <p className="text-sm max-w-xs mx-auto">Enter Hours and Failures to calculate statistical bounds.</p>
          </div>
        )}
        <div className="mt-4">
          <ShareAndExport 
            toolName="MTBF Confidence"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={result ? `${Math.round(result.mean)}h [${Math.round(result.lower)}h - ${Math.round(result.upper)}h]` : ""}
            exportData={[
              { Parameter: "Total Operating Hours", Value: hours },
              { Parameter: "Failures", Value: failures },
              { Parameter: "Confidence Level", Value: confidence + "%" },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "MTBF Mean", Value: result ? Math.round(result.mean).toString() : "N/A" },
              { Parameter: "Lower Bound", Value: result ? Math.round(result.lower).toString() : "N/A" },
              { Parameter: "Upper Bound", Value: result ? Math.round(result.upper).toString() : "N/A" }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Statistical Confidence Bounds in Reliability Engineering
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
          Reliability data is inherently uncertain. A single MTBF value calculated from a small test sample is merely a <strong>"point estimate"</strong>—it represents a snapshot in time. In real-world engineering, we must calculate <strong>Confidence Intervals</strong> (also known as confidence bounds) to determine the range where the true, long-term system reliability resides.
        </p>
      </div>

      {/* Interactive Visual Tool */}
      <div className="my-10">
        <ConfidenceIntervalVisual />
      </div>

      {/* Explanation in Very Easy Language */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          🎯 Understanding Confidence Intervals in Plain English
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Imagine you test a single water pump, and it runs for <strong>2,000 hours</strong> before failing. You might conclude that the pump model has an MTBF of 2,000 hours. But if you test a second pump, it might fail after only 500 hours, and a third might run for 4,000 hours.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Since failures are random, a point estimate is rarely 100% accurate. A <strong>Confidence Interval</strong> builds a bracket around your estimate:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong className="text-cyan-600 dark:text-cyan-400">Lower Confidence Limit (LCL) / Conservative Estimate:</strong> This is the "worst-case scenario." We are highly confident that the actual MTBF is at least this high. This is the value engineers use to design critical safety features and draft warranty reserves.
          </li>
          <li>
            <strong className="text-violet-600 dark:text-violet-400">Upper Confidence Limit (UCL) / Optimistic Estimate:</strong> This is the "best-case scenario." It is useful for marketing and predicting long-term maintenance budgets.
          </li>
        </ul>
        <div className="p-3 bg-amber-500/10 border-l-4 border-amber-550 dark:border-amber-500 rounded-r-lg text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
          <strong>Rule of Thumb:</strong> More Failures Observed = Less Uncertainty = A Tighter Range. High Confidence Level (e.g. 99% vs 90%) = A Wider Range (because you need to be extremely certain you do not miss the true value).
        </div>
      </div>

      {/* Mathematical Chi-Square formulas using KaTeX */}
      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Time-Terminated Test (Type I)"
          icon={<Calculator className="w-5 h-5 text-cyan-600" />}
          delay={0.1}
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Use this when the reliability test is stopped at a **predetermined time** <InlineMath math="T" />, regardless of how many failures have occurred.
          </p>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">Lower Bound Formula (LCL)</span>
              <BlockMath math={"MTBF_{lower} = \\frac{2 \\cdot T}{\\chi^2_{\\alpha/2, \\, 2r+2}}"} />
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">Upper Bound Formula (UCL)</span>
              <BlockMath math={"MTBF_{upper} = \\frac{2 \\cdot T}{\\chi^2_{1-\\alpha/2, \\, 2r}}"} />
            </div>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Failure-Terminated Test (Type II)"
          icon={<Calculator className="w-5 h-5 text-violet-600" />}
          delay={0.2}
        >
          <p className="text-xs text-slate-650 dark:text-slate-400 mb-4 leading-relaxed">
            Use this when the test runs until a **predetermined number of failures** <InlineMath math="r" /> is reached, and then the test is stopped.
          </p>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">Lower Bound Formula (LCL)</span>
              <BlockMath math={"MTBF_{lower} = \\frac{2 \\cdot T}{\\chi^2_{\\alpha/2, \\, 2r}}"} />
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wide">Upper Bound Formula (UCL)</span>
              <BlockMath math={"MTBF_{upper} = \\frac{2 \\cdot T}{\\chi^2_{1-\\alpha/2, \\, 2r}}"} />
            </div>
          </div>
        </TheoryBlock>
      </div>

      {/* Variables explanation card */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm">
        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Formula Variable Guide:</h4>
        <div className="grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700 dark:text-slate-350">
          <ul className="space-y-2 list-none pl-0">
            <li><InlineMath math="T" /> = <strong>Total accumulated operational time</strong> (sum of run hours of all components).</li>
            <li><InlineMath math="r" /> = <strong>Number of observed failures</strong>.</li>
            <li><InlineMath math="\alpha" /> = <strong>Significance level / Risk</strong>, calculated as <InlineMath math="\alpha = 1 - \text{Confidence Level}" />. For example, 90% Confidence leads to <InlineMath math="\alpha = 0.10" />.</li>
          </ul>
          <ul className="space-y-2 list-none pl-0">
            <li><InlineMath math="\chi^2_{p, \, \nu}" /> = <strong>Chi-Square Distribution value</strong> for cumulative probability <InlineMath math="p" /> and degrees of freedom <InlineMath math="\nu" />.</li>
            <li><InlineMath math="2r" /> or <InlineMath math="2r+2" /> = <strong>Degrees of Freedom</strong> ($\nu$), which acts as a safety margin depending on whether the test end was time-terminated or failure-terminated.</li>
          </ul>
        </div>
      </div>

      {/* Complete Step-by-Step Example */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-950/10 dark:to-blue-950/10 border border-cyan-500/20 dark:border-cyan-800/30 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          📖 Complete Step-by-Step Practical Example
        </h3>
        
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: The Scenario</span>
            <p className="mt-1">
              You are testing a fleet of <strong>10 water pumps</strong>. You let each pump run for exactly 1,000 hours. The total operational test time accumulated is:
              <BlockMath math={"T = 10 \\text{ pumps} \\times 1,000 \\text{ hours} = 10,000 \\text{ unit-hours}"} />
              During this test, you observe exactly <strong>5 failures</strong> (represented by <InlineMath math="r = 5" />). You want to find the MTBF range with <strong>90% Confidence</strong>.
            </p>
          </div>

          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Calculate the Point Estimate (Mean MTBF)</span>
            <p className="mt-1">
              The direct average is simply total time divided by failures:
              <BlockMath math={"MTBF_{mean} = \\frac{T}{r} = \\frac{10,000}{5} = 2,000 \\text{ hours}"} />
            </p>
          </div>

          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Determine the Statistical Inputs</span>
            <p className="mt-1">
              - <strong>Risk level ($\alpha$):</strong> Since we want 90% confidence, the risk of being wrong is 10%, so <InlineMath math="\alpha = 0.10" />.
              <br />
              - <strong>Degrees of Freedom ($\nu$):</strong> Assuming a standard failure-terminated scenario, <InlineMath math="\nu = 2r = 2 \\times 5 = 10" />.
              <br />
              - <strong>Chi-Square probabilities:</strong>
              <br />
              &nbsp;&nbsp;• For the lower limit, we evaluate the upper tail probability: <InlineMath math="1 - \\alpha/2 = 1 - 0.05 = 0.95" />.
              <br />
              &nbsp;&nbsp;• For the upper limit, we evaluate the lower tail probability: <InlineMath math="\\alpha/2 = 0.05" />.
            </p>
          </div>

          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 4: Lookup Chi-Square Values</span>
            <p className="mt-1">
              Using a Chi-Square statistical table for 10 degrees of freedom:
              <br />
              &nbsp;&nbsp;• <InlineMath math="\\chi^2_{0.95, \\, 10} = 18.307" />
              <br />
              &nbsp;&nbsp;• <InlineMath math="\\chi^2_{0.05, \\, 10} = 3.940" />
            </p>
          </div>

          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 5: Compute the Confidence Limits</span>
            <p className="mt-1">
              Insert these numbers into the Failure-Terminated formulas:
              <br />
              &nbsp;&nbsp;• <strong>Lower Bound (Worst-Case LCL):</strong>
              <BlockMath math={"MTBF_{lower} = \\frac{2 \\times 10,000}{\\chi^2_{0.95, \\, 10}} = \\frac{20,000}{18.307} \\approx 1,092.5 \\text{ hours}"} />
              &nbsp;&nbsp;• <strong>Upper Bound (Best-Case UCL):</strong>
              <BlockMath math={"MTBF_{upper} = \\frac{2 \\times 10,000}{\\chi^2_{0.05, \\, 10}} = \\frac{20,000}{3.940} \\approx 5,076.1 \\text{ hours}"} />
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-cyan-500/20 rounded-xl">
            <span className="font-bold text-slate-800 dark:text-slate-100">💡 Conclusion in Simple Words:</span>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              "Although our average test speed is 2,000 hours, our sample size is small. We are <strong>90% certain</strong> that the true long-term MTBF of this pump model is somewhere between <strong>1,092 hours</strong> (conservative worst-case) and <strong>5,076 hours</strong> (optimistic best-case). If you want to design a highly safe preventative maintenance interval, schedule it before 1,092 hours, not 2,000 hours!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between a Point Estimate and a Confidence Interval?",
      answer: "A Point Estimate is a single average value (e.g. 2,000 hours) calculated from current data. A Confidence Interval is a mathematical range (e.g. 1,092 to 5,076 hours) that reflects the uncertainty in that average based on sample size. It tells you how far off your single average might be."
    },
    {
      question: "Why does the Mean MTBF not change when I adjust the confidence level?",
      answer: "The Mean (total hours divided by failures) is a physical fact of the test you completed. The confidence level changes how wide the range around that mean needs to be to reach that certainty. 99% confidence yields a wider range than 90% confidence because you must be more cautious about edge-case errors."
    },
    {
      question: "How can I shrink my confidence interval to be tighter?",
      answer: "The only way to make the lower and upper limits closer together (improve statistical precision) without lowering your confidence level is to gather more data. You must run more operational hours and observe more failures to narrow the range of uncertainty."
    },
    {
      question: "Why is the upper limit extremely high when failures are low?",
      answer: "When there are very few failures (e.g. 1 or 2), there is very little statistical evidence of system degradation. Statistically, the components could be exceptionally reliable, meaning the upper limit goes very high. With zero failures, the upper limit is mathematically infinite."
    },
    {
      question: "What is the difference between Time-Terminated and Failure-Terminated formulas?",
      answer: "A Time-Terminated test stops at a fixed time T (e.g., 500 hours) no matter what. A Failure-Terminated test runs until exactly r failures are reached. Because stopping at a fixed time introduces slightly more uncertainty (you might have failed just after the timer stopped), the Time-Terminated formula adds a small safety penalty (2r+2 degrees of freedom instead of 2r) for the lower bound calculation."
    }
  ];

  return (
    <ToolContentLayout
      title="MTBF Confidence Calculator"
      description="Calculate the statistical uncertainty of your MTBF. Determine the Lower and Upper Confidence Limits using the Chi-Square method (IEC 60605-4)."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="MTBF confidence interval, confidence bounds, chi-square reliability, MTBF interval calculator, reliability confidence bounds, error margins MTBF, reliability engineering calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/confidence-interval"
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
