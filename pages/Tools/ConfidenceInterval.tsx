import React, { useState } from 'react';
import { Target, BarChart2, AlertTriangle, Calculator } from 'lucide-react';
import { calculateMTBFConfidence } from '../../services/reliabilityMath';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


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
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">

            <div className="text-center mb-8 relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated MTBF (Mean)</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white">
                {Math.round(result.mean).toLocaleString()} <span className="text-lg font-medium text-slate-400">Hours</span>
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
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Statistical Confidence Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Reliability data is inherently uncertain. A single MTBF number is only a "point estimate". Confidence intervals establish the mathematical boundaries where the true system reliability likely resides.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Chi-Square Method"
          icon={<Calculator className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            For time-terminated tests with an exponential distribution, we utilize the Chi-Square ($\chi^2$) distribution to calculate upper and lower bounds based on the number of failures recorded.
          </p>
          <div className="mt-4 space-y-2">
            <BlockMath math={"MTBF_{lower} = \\frac{2 \cdot T}{\chi^2_{\alpha/2, 2r+2}}"} />
            <BlockMath math={"MTBF_{upper} = \\frac{2 \cdot T}{\chi^2_{1-\alpha/2, 2r}}"} />
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Data Interpretation"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          delay={0.2}
        >
          <ul className="space-y-2 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Lower Limit:</strong> The "Conservative" estimate. Essential for safety-critical systems and warranty reserve planning.</li>
            <li><strong>Upper Limit:</strong> The "Optimistic" ceiling. Useful for marketing and long-term asset life projections.</li>
            <li><strong>Sample Size:</strong> A narrow interval indicates high data volume. A wide interval alerts you to statistically insignificant results.</li>
          </ul>
        </TheoryBlock>
      </div>
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
