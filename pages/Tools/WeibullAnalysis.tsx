
import React, { useState, useRef, useMemo } from 'react';
import { calculateWeibull, generateWeibullCurves } from '../../services/reliabilityMath';
import { WeibullResult } from '../../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity, Upload, FileText, BookOpen, Target, TrendingUp, Zap, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Papa from 'papaparse';
import HelpTooltip from '../../components/HelpTooltip';
import { downloadSvgAsPng } from '../../services/exportUtils';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const WeibullAnalysis: React.FC = () => {
  const [inputData, setInputData] = useState<string>('120\n245\n310\n550\n900');
  const [result, setResult] = useState<WeibullResult | null>(null);
  const [activeTab, setActiveTab] = useState<'prob' | 'rel' | 'pdf' | 'hazard'>('prob');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Weibull Analysis Tool",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "description": "Perform 2-parameter Weibull analysis online compliant with IEC 61649.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

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
          if (Array.isArray(row)) {
             val = row[0];
          } else if (typeof row === 'object' && row !== null) {
             val = Object.values(row)[0];
          } else {
             val = row;
          }
          
          if (val && !isNaN(parseFloat(val))) {
            values.push(String(val).trim());
          }
        });

        if (values.length > 0) {
          setInputData(values.join('\n'));
        } else {
          alert("Could not find valid numeric data in the CSV file.");
        }
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const handleDownloadChart = () => {
    if (chartRef.current) {
      const svg = chartRef.current.querySelector('svg');
      if (svg) {
        downloadSvgAsPng(svg, `weibull-${activeTab}-plot.png`);
      }
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
    if (beta < 0.9) {
      return {
        title: "Infant Mortality (Early Life)",
        description: "Components are failing due to quality defects or installation issues.",
        action: "Check manufacturing quality, improve installation training (e.g., alignment, torque). Burn-in testing recommended.",
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        color: "text-amber-600 dark:text-amber-400"
      };
    } else if (beta >= 0.9 && beta <= 1.1) {
      return {
        title: "Constant Failure Rate (Random)",
        description: "Failures are random and independent of time (useful life phase).",
        action: "Preventive replacement is ineffective here. Focus on condition monitoring or redundant systems.",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        color: "text-green-600 dark:text-green-400"
      };
    } else {
      return {
        title: "Wear Out (End of Life)",
        description: "Components are aging physically (fatigue, corrosion, erosion).",
        action: "Implement Preventive Maintenance (PM) to replace parts before they fail.",
        icon: <Activity className="w-5 h-5 text-red-500" />,
        color: "text-red-600 dark:text-red-400"
      };
    }
  };

  return (
    <div className="space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Weibull Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Perform 2-parameter Weibull analysis compliant with <strong>IEC 61649</strong>. Calculate shape (&beta;), scale (&eta;), B10 Life, and visualize failure characteristics including Hazard Rate.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Time-to-Failure Data
                <HelpTooltip text="List of raw time values (hours, cycles, or miles) at which failures occurred. Source: Historical failure records from CMMS." />
              </label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
              >
                <Upload className="w-3 h-3" /> Upload CSV
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.txt"
                className="hidden"
              />
            </div>
            <p className="text-xs text-slate-500 mb-2">Enter one value per line.</p>
            
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={10}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
            <button 
              onClick={handleAnalyze}
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" /> Run Analysis
            </button>
          </div>

          {result && (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
               <div>
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Results</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-600 dark:text-slate-400">Shape (&beta;)</span>
                     <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{result.beta.toFixed(3)}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-600 dark:text-slate-400">Scale (&eta;)</span>
                     <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{result.eta.toFixed(1)}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-600 dark:text-slate-400" title="Coefficient of Determination">R² (Fit)</span>
                     <span className={`text-lg font-bold ${result.rSquared > 0.9 ? 'text-green-500' : 'text-amber-500'}`}>
                       {result.rSquared.toFixed(3)}
                     </span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-600 dark:text-slate-400" title="Time at which 10% of units fail">B10 Life</span>
                     <span className="text-xl font-bold text-slate-900 dark:text-white">{result.b10.toFixed(1)}</span>
                   </div>
                 </div>
               </div>

               {/* Physics of Failure Interpretation */}
               <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    {getBetaInterpretation(result.beta).icon}
                    <h4 className={`font-bold text-sm ${getBetaInterpretation(result.beta).color}`}>
                      {getBetaInterpretation(result.beta).title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                    {getBetaInterpretation(result.beta).description}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                    <strong>Action:</strong> {getBetaInterpretation(result.beta).action}
                  </div>
               </div>
             </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg h-[500px] lg:h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weibull Plots</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDownloadChart}
                    className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 px-3 py-1.5 rounded transition-colors"
                  >
                    <Download className="w-3 h-3" /> PNG
                  </button>
                  <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 rounded-lg p-1 gap-1">
                    {['prob', 'rel', 'pdf', 'hazard'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        {tab === 'prob' ? 'Probability' : tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex-grow" ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === 'prob' ? (
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis 
                        type="number" 
                        dataKey="time" 
                        name="Time" 
                        stroke={chartColors.axis} 
                        scale="log" 
                        domain={['auto', 'auto']}
                        label={{ value: 'Time (t)', position: 'bottom', fill: chartColors.axis, offset: 0 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="medianRank" 
                        name="Rank" 
                        stroke={chartColors.axis} 
                        domain={[0.01, 0.99]}
                        tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                        label={{ value: 'Unreliability F(t)', angle: -90, position: 'insideLeft', fill: chartColors.axis }}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                      />
                      <Scatter name="Failures" data={result.points} fill="#06b6d4" />
                      <Scatter name="Fit Line" data={result.linePoints} line={{ stroke: '#f43f5e', strokeWidth: 2 }} shape={() => <g />} />
                    </ScatterChart>
                  ) : (
                    <LineChart data={curveData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                      <XAxis 
                        dataKey="t" 
                        stroke={chartColors.axis} 
                        tickFormatter={(t) => t.toFixed(0)}
                        label={{ value: 'Time (t)', position: 'bottom', fill: chartColors.axis, offset: 0 }}
                      />
                      <YAxis 
                        stroke={chartColors.axis} 
                        label={{ value: activeTab === 'rel' ? 'Probability' : activeTab === 'hazard' ? 'Rate' : 'Density', angle: -90, position: 'insideLeft', fill: chartColors.axis }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                        formatter={(value: number) => value.toFixed(5)}
                        labelFormatter={(label) => `Time: ${Number(label).toFixed(1)}`}
                      />
                      <Legend />
                      {activeTab === 'rel' && <Line type="monotone" dataKey="reliability" name="Reliability R(t)" stroke="#06b6d4" strokeWidth={2} dot={false} />}
                      {activeTab === 'pdf' && <Line type="monotone" dataKey="pdf" name="PDF f(t)" stroke="#f43f5e" strokeWidth={2} dot={false} />}
                      {activeTab === 'hazard' && <Line type="monotone" dataKey="hazard" name="Hazard h(t)" stroke="#8b5cf6" strokeWidth={2} dot={false} />}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl min-h-[400px]">
              <div className="text-center text-slate-400 dark:text-slate-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Run analysis to visualize plots</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Guide with Formulas Integrated */}
      <section className="grid md:grid-cols-2 gap-8 pt-12 border-t border-slate-200 dark:border-slate-800">
        
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Standard: IEC 61649
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This tool performs Rank Regression (RR) analysis as described in <strong>IEC 61649: Weibull analysis</strong>. It fits the curve to your specific failure data to reveal <em>how</em> the failure rate changes over time.
          </p>
        </div>

        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
             <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
               <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Functions & Formulas
             </h3>
             <div className="grid gap-4 text-sm">
               <div>
                 <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Reliability Function R(t)</h4>
                 <code className="block bg-white dark:bg-black/40 p-2 rounded text-cyan-700 dark:text-cyan-300 font-mono text-xs border border-slate-200 dark:border-transparent">
                   R(t) = e<sup>-(t/&eta;)<sup>&beta;</sup></sup>
                 </code>
               </div>
               <div>
                 <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Hazard Rate h(t)</h4>
                 <code className="block bg-white dark:bg-black/40 p-2 rounded text-cyan-700 dark:text-cyan-300 font-mono text-xs border border-slate-200 dark:border-transparent">
                   h(t) = (&beta;/&eta;) &times; (t/&eta;)<sup>&beta;-1</sup>
                 </code>
               </div>
             </div>
        </div>

        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
            <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Understanding Beta (Shape Parameter)
          </h3>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">Beta (&beta;)</th>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">Failure Pattern</th>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">Typical Causes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                <tr>
                  <td className="px-4 py-2 font-mono text-amber-600 dark:text-amber-400 font-bold">&lt; 1.0</td>
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900 dark:text-white">Infant Mortality</div>
                    <div className="text-xs text-slate-500">Decreasing failure rate</div>
                  </td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">Manufacturing defects, installation errors, poor quality control.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-green-600 dark:text-green-400 font-bold">= 1.0</td>
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900 dark:text-white">Random / Useful Life</div>
                    <div className="text-xs text-slate-500">Constant failure rate</div>
                  </td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">External stress, accidents, lightning strikes, operator error.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-red-600 dark:text-red-400 font-bold">&gt; 1.0</td>
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900 dark:text-white">Wear Out</div>
                    <div className="text-xs text-slate-500">Increasing failure rate</div>
                  </td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">Insulation breakdown, corrosion, fatigue, erosion, aging.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            How to use the charts?
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <p className="mb-2"><strong>Probability Plot:</strong> Points should roughly form a straight line. The steeper the slope, the more consistent the failure time.</p>
            <p className="mb-2"><strong>Hazard Plot:</strong> Shows the instantaneous risk of failure. If it curves up, your assets are wearing out.</p>
            <p><strong>R² (Goodness of Fit):</strong> Indicates how well the data follows the Weibull distribution. A value &gt; 0.9 is considered a good fit.</p>
          </div>
        </div>
      </section>
      
      <RelatedTools currentToolId="weibull" />
    </div>
  );
};

export default WeibullAnalysis;
