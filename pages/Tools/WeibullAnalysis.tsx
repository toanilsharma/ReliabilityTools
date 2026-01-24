
import React, { useState, useRef, useMemo } from 'react';
import { calculateWeibull, generateWeibullCurves } from '../../services/reliabilityMath';
import { WeibullResult } from '../../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity, Upload, AlertTriangle, CheckCircle2, Download, BookOpen, FileText, Zap, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Papa from 'papaparse';
import HelpTooltip from '../../components/HelpTooltip';
import { downloadSvgAsPng } from '../../services/exportUtils';
import RelatedTools from '../../components/RelatedTools';
import ToolContentLayout from '../../components/ToolContentLayout';

const WeibullAnalysis: React.FC = () => {
  const [inputData, setInputData] = useState<string>('120\n245\n310\n550\n900');
  const [result, setResult] = useState<WeibullResult | null>(null);
  const [activeTab, setActiveTab] = useState<'prob' | 'rel' | 'pdf' | 'hazard'>('prob');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // --- Tool Logic (Refactored from original file) ---
  const handleAnalyze = () => {
    const times = inputData
      .split(/[\n,]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n) && n > 0);

    if (times.length < 2) {
      alert("Please enter at least 2 valid data points > 0");
      return;
    }
    const res = calculateWeibull(times);
    setResult(res);
  };

  const curveData = useMemo(() => {
    if (!result) return [];
    const maxTime = Math.max(...result.points.map(p => p.time)) * 1.5;
    return generateWeibullCurves(result.beta, result.eta, maxTime);
  }, [result]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const values: string[] = [];
        results.data.forEach((row: any) => {
          let val: any;
          if (Array.isArray(row)) val = row[0];
          else if (typeof row === 'object' && row !== null) val = Object.values(row)[0];
          else val = row;
          if (val && !isNaN(parseFloat(val))) values.push(String(val).trim());
        });
        if (values.length > 0) setInputData(values.join('\n'));
        else alert("Could not find valid numeric data in the CSV file.");
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const handleDownloadChart = () => {
    if (chartRef.current) {
      const svg = chartRef.current.querySelector('svg');
      if (svg) downloadSvgAsPng(svg, `weibull-${activeTab}-plot.png`);
    }
  };

  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
    tooltipBg: theme === 'dark' ? '#0f172a' : '#ffffff',
    tooltipText: theme === 'dark' ? '#f8fafc' : '#0f172a',
    tooltipBorder: theme === 'dark' ? '#334155' : '#cbd5e1',
  };

  const getBetaInterpretation = (beta: number) => {
    if (beta < 0.9) return { title: "Infant Mortality", description: "Early failures due to defects.", action: "Burn-in testing, QA check.", icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: "text-amber-600 dark:text-amber-400" };
    if (beta >= 0.9 && beta <= 1.1) return { title: "Random Failures", description: "Constant failure rate.", action: "Condition monitoring.", icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: "text-green-600 dark:text-green-400" };
    return { title: "Wear Out", description: "Failures increase with time.", action: "Preventive replacement.", icon: <Activity className="w-5 h-5 text-red-500" />, color: "text-red-600 dark:text-red-400" };
  };

  // --- Tool Component UI ---
  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Failure Times (Data)
              <HelpTooltip text="Enter times-to-failure (e.g. 100, 250, 500). Units can be hours, cycles, etc." />
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
            >
              <Upload className="w-3 h-3" /> Import CSV
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt" className="hidden" />
          </div>

          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            placeholder="100&#10;250&#10;500..."
          />
          <button
            onClick={handleAnalyze}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" /> Calculate Parameters
          </button>
        </div>

        {result && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center shadow-sm">
                <div className="text-sm text-slate-500 dark:text-slate-400">Beta (&beta;)</div>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{result.beta.toFixed(3)}</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center shadow-sm">
                <div className="text-sm text-slate-500 dark:text-slate-400">Eta (&eta;)</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-200">{result.eta.toFixed(1)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-cyan-500 shadow-sm">
              {getBetaInterpretation(result.beta).icon}
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{getBetaInterpretation(result.beta).title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{getBetaInterpretation(result.beta).description}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center">R² Fit: {result.rSquared.toFixed(3)} | B10 Life: {result.b10.toFixed(1)}</div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="lg:col-span-2">
        {result ? (
          <div className="h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                {['prob', 'rel', 'pdf', 'hazard'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize border ${activeTab === tab ? 'bg-cyan-600 text-white border-cyan-600' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-cyan-500'}`}
                  >
                    {tab === 'prob' ? 'Probability' : tab}
                  </button>
                ))}
              </div>
              <button onClick={handleDownloadChart} className="p-2 text-slate-400 hover:text-cyan-500 transition-colors" title="Download Chart">
                <Download className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4" ref={chartRef}>
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'prob' ? (
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis type="number" dataKey="time" name="Time" stroke={chartColors.axis} scale="log" domain={['auto', 'auto']} label={{ value: 'Time (t)', position: 'bottom', fill: chartColors.axis }} />
                    <YAxis type="number" dataKey="medianRank" name="Rank" stroke={chartColors.axis} domain={[0.01, 0.99]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }} />
                    <Scatter name="Failures" data={result.points} fill="#06b6d4" />
                    <Scatter name="Fit Line" data={result.linePoints} line={{ stroke: '#f43f5e', strokeWidth: 2 }} shape={() => <g />} />
                  </ScatterChart>
                ) : (
                  <LineChart data={curveData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="t" stroke={chartColors.axis} tickFormatter={(t) => t.toFixed(0)} label={{ value: 'Time (t)', position: 'bottom', fill: chartColors.axis }} />
                    <YAxis stroke={chartColors.axis} />
                    <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }} formatter={(value: number) => value.toFixed(5)} />
                    <Legend />
                    <Line type="monotone" dataKey={activeTab === 'rel' ? 'reliability' : activeTab === 'pdf' ? 'pdf' : 'hazard'} stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
            <Activity className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter data and click Calculate</p>
          </div>
        )}
      </div>
    </div>
  );

  // --- Content Strategies ---
  const Content = (
    <div>
      <h2 id="how-to">What is Weibull Analysis?</h2>
      <p>
        Weibull Analysis is the "Swiss Army Knife" of reliability engineering. Unlike a simple average (like MTBF), which assumes failures are random, Weibull Analysis helps you understand <strong>why</strong> things are failing by looking at the <em>shape</em> of the failure distribution over time.
      </p>
      <p>
        It fits a statistical curve to your failure data to determine if your assets are suffering from:
      </p>
      <ul>
        <li><strong>Early Mortality (Infant Mortality):</strong> Defects from manufacturing or installation.</li>
        <li><strong>Random Failures (Useful Life):</strong> External events or stress.</li>
        <li><strong>Wear Out (End of Life):</strong> Physical degradation like fatigue or corrosion.</li>
      </ul>

      <h2 id="parameters">The Critical Parameters: Beta & Eta</h2>
      <p>
        The 2-parameter Weibull distribution is defined by:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border-l-4 border-cyan-500">
          <h3 className="text-xl font-bold mb-2">Beta (&beta;) / Shape</h3>
          <p className="text-sm mb-4">Describes the failure pattern.</p>
          <ul className="text-sm space-y-2">
            <li><strong>&beta; &lt; 1.0:</strong> Decreasing failure rate (Burn-in needed).</li>
            <li><strong>&beta; = 1.0:</strong> Constant failure rate (Random).</li>
            <li><strong>&beta; &gt; 1.0:</strong> Increasing failure rate (Wear out).</li>
          </ul>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-bold mb-2">Eta (&eta;) / Scale</h3>
          <p className="text-sm mb-4">Characteristic Life.</p>
          <p className="text-sm">
            The time at which <strong>63.2%</strong> of the population is expected to fail. It provides a consistent benchmark for comparing the durability of different components.
          </p>
        </div>
      </div>

      <h2 id="math">Mathematical Foundation</h2>
      <p>The Probability Density Function (PDF) is given by:</p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4 overflow-x-auto">
        f(t) = (&beta;/&eta;) * (t/&eta;)^(&beta;-1) * e^(-(t/&eta;)^&beta;)
      </div>
      <p>
        Where <em>t</em> is the time-to-failure. The Reliability function R(t), which gives the probability of survival at time <em>t</em>, is:
      </p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4 overflow-x-auto">
        R(t) = e^(-(t/&eta;)^&beta;)
      </div>

      <h3 className="text-xl font-bold mt-8">Rank Regression Method (RR)</h3>
      <p>
        This tool uses <strong>Median Rank Regression (MRR)</strong>, the standard method for small sample sizes (N &lt; 30). It estimates the unreliability (probability of failure) for each data point using <strong>Benard's Approximation</strong>:
      </p>
      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded font-mono text-center my-2 text-sm">
        Median Rank = (i - 0.3) / (N + 0.4)
      </div>
      <p className="text-sm text-slate-500 text-center mb-6">Where <em>i</em> is the rank order (1st, 2nd, etc.) and <em>N</em> is the total sample size.</p>

      <h2 id="applications">Industrial Applications</h2>
      <p>
        Weibull analysis is used across aerospace, automotive, and electronics industries to:
      </p>
      <ol>
        <li><strong>Optimize Maintenance Intervals:</strong> If &beta; &gt; 1, you can calculate the optimal preventive replacement time to minimize cost and downtime.</li>
        <li><strong>Validate Supplier Quality:</strong> Compare the &eta; (characteristic life) of Component A vs. Component B.</li>
        <li><strong>Warranty Analysis:</strong> Estimate the number of returns expected within the warranty period (B10 life).</li>
      </ol>

      <h2 id="standards">Standards & Compliance</h2>
      <p>
        This tool follows the methodologies outlined in <strong>IEC 61649: Weibull analysis</strong>. It is suitable for preliminary reliability estimation, root cause analysis support, and educational purposes.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What is the minimum data required for Weibull Analysis?",
      answer: "Ideally, you need at least <strong>5-10 failure points</strong> to get a statistically significant result. However, the Rank Regression method can mathematically produce a line with as few as 2 points, though the confidence interval will be extremely wide."
    },
    {
      question: "What is B10 Life?",
      answer: "B10 life is the time at which 10% of a population will fail (or 90% reliability remains). It is a standard metric in automotive and bearing industries (L10 life). It is calculated as: <code>B10 = &eta; * (0.105)^(1/&beta;)</code>."
    },
    {
      question: "Can I use this for censored data (suspensions)?",
      answer: "Currently, this web tool supports <strong>complete data</strong> (all units failed). For censored data (where some units are still running), you need to use <em>Rank Adjustment</em> methods or Maximum Likelihood Estimation (MLE), which are planned for future updates."
    },
    {
      question: "Why is Beta so important?",
      answer: "Beta tells you the <em>physics of failure</em>. If &beta; < 1, replacing parts preventively is a waste of money (you might introduce new defects). If &beta; > 1, the part is wearing out, so preventive maintenance works."
    },
    {
      question: "How do I interpret the R-Squared value?",
      answer: "R-Squared (Coefficient of Determination) measures how well the data fits the Weibull line. A value above <strong>0.90</strong> indicates a good fit. If it's low, your data might follow a different distribution (like Lognormal or Exponential) or you might have mixed failure modes."
    }
  ];

  return (
    <ToolContentLayout
      title="Weibull Analysis Calculator"
      description="Perform 2-parameter Weibull analysis compliant with IEC 61649. Calculate Shape (Beta) and Scale (Eta) parameters, visualize Probability and Hazard plots, and determine the optimal maintenance strategy for your assets."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Weibull Analysis Calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    />
  );
};

export default WeibullAnalysis;
