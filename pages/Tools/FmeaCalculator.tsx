import React, { useState, useEffect } from 'react';
import { calculateRPN } from '../../services/reliabilityMath';
import { Sliders, Table as TableIcon, Undo, Redo, Plus, AlertTriangle, Activity, Search, Landmark } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import RelatedTools from '../../components/RelatedTools';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';

interface FmeaRow {
  id: string;
  item: string;
  failureMode: string;
  effect: string;
  s: number;
  cause: string;
  o: number;
  control: string;
  d: number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const FmeaCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'worksheet'>('worksheet');

  const [severity, setSeverity] = useState(5);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(5);

  const [historyStack, setHistoryStack] = useState<FmeaRow[][]>([[
    { id: generateId(), item: 'Pump Assembly', failureMode: 'Seal Leak', effect: 'Loss of pressure', s: 7, cause: 'Worn O-ring', o: 5, control: 'Visual Inspection', d: 4 },
    { id: generateId(), item: 'Control Board', failureMode: 'Short Circuit', effect: 'System shutdown', s: 8, cause: 'Moisture ingress', o: 3, control: 'Conformal Coating', d: 2 },
  ]]);
  const [historyStep, setHistoryStep] = useState(0);

  const currentRows = historyStack[historyStep] || [];
  const { theme } = useTheme();
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;


  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const paretoData = React.useMemo(() => {
    const sorted = [...currentRows].map(r => ({
      name: r.failureMode || 'Unnamed',
      rpn: r.s * r.o * r.d
    })).sort((a, b) => b.rpn - a.rpn);
    
    return {
      names: sorted.map(i => i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name),
      rpns: sorted.map(i => i.rpn)
    };
  }, [currentRows]);

  const pushHistory = (newRows: FmeaRow[]) => {
    const newStack = historyStack.slice(0, historyStep + 1);
    newStack.push(newRows);
    setHistoryStack(newStack);
    setHistoryStep(newStack.length - 1);
  };

  const updateRow = (id: string, field: keyof FmeaRow, value: string | number) => {
    const newRows = currentRows.map(r => r.id === id ? { ...r, [field]: value } : r);
    pushHistory(newRows);
  };

  const addRow = () => pushHistory([...currentRows, { id: generateId(), item: '', failureMode: '', effect: '', s: 1, cause: '', o: 1, control: '', d: 1 }]);

  const handleUndo = () => { if (historyStep > 0) setHistoryStep(s => s - 1); };
  const handleRedo = () => { if (historyStep < historyStack.length - 1) setHistoryStep(s => s + 1); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo(); else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyStep, historyStack.length]);

  const rpn = calculateRPN(severity, occurrence, detection);
  const risk = rpn >= 100
    ? { label: 'Critical Action', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-800' }
    : rpn >= 40
      ? { label: 'Mitigate Soon', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-800' }
      : { label: 'Monitor', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-800' };

  const ToolComponent = (
    <div className="space-y-6" ref={toolRef}>

      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-855 rounded-xl w-full max-w-sm mx-auto mb-8 relative border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('worksheet')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 relative z-10 ${
            activeTab === 'worksheet' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <TableIcon className="w-4 h-4" /> Worksheet (Grid)
          {activeTab === 'worksheet' && (
            <motion.div
              layoutId="activeTabPill"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg -z-10 shadow-sm"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 relative z-10 ${
            activeTab === 'calculator' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <Sliders className="w-4 h-4" /> Single Risk Calc
          {activeTab === 'calculator' && (
            <motion.div
              layoutId="activeTabPill"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg -z-10 shadow-sm"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {activeTab === 'worksheet' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px] animate-fadeIn">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-20">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200"><TableIcon className="w-5 h-5 text-cyan-600" /> FMEA Master Grid</h3>
            <div className="flex gap-2">
              <button disabled={historyStep === 0} onClick={handleUndo} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700" title="Undo (Ctrl+Z)"><Undo className="w-4 h-4" /></button>
              <button disabled={historyStep === historyStack.length - 1} onClick={handleRedo} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700" title="Redo (Ctrl+Y)"><Redo className="w-4 h-4" /></button>
              <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button onClick={addRow} className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded flex items-center gap-2 hover:bg-cyan-500"><Plus className="w-4 h-4" /> Add Row</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Process / Item</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Failure Mode</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Failure Effect</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 w-16 text-center text-red-600 dark:text-red-400 bg-slate-100 dark:bg-slate-800">S</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Potential Cause</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 w-16 text-center text-orange-600 dark:text-orange-400 bg-slate-100 dark:bg-slate-800">O</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Current Controls</th>
                  <th className="p-3 border-r border-b border-slate-200 dark:border-slate-700 w-16 text-center text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800">D</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-24 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">RPN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {currentRows.map(row => {
                  const rpnVal = row.s * row.o * row.d;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50 min-w-[150px]"><input type="text" value={row.item} onChange={e => updateRow(row.id, 'item', e.target.value)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-cyan-500 rounded text-slate-800 dark:text-slate-200" placeholder="Item name..." /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50 min-w-[150px]"><input type="text" value={row.failureMode} onChange={e => updateRow(row.id, 'failureMode', e.target.value)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-cyan-500 rounded text-slate-800 dark:text-slate-200" placeholder="How it fails..." /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50 min-w-[200px]"><input type="text" value={row.effect} onChange={e => updateRow(row.id, 'effect', e.target.value)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-cyan-500 rounded text-slate-800 dark:text-slate-200" placeholder="What happens..." /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50"><input type="number" min="1" max="10" value={row.s} onChange={e => updateRow(row.id, 's', parseInt(e.target.value) || 1)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-red-500 rounded text-center text-red-600 dark:text-red-400 font-bold" /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50 min-w-[200px]"><input type="text" value={row.cause} onChange={e => updateRow(row.id, 'cause', e.target.value)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-cyan-500 rounded text-slate-800 dark:text-slate-200" placeholder="Why it fails..." /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50"><input type="number" min="1" max="10" value={row.o} onChange={e => updateRow(row.id, 'o', parseInt(e.target.value) || 1)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-orange-500 rounded text-center text-orange-600 dark:text-orange-400 font-bold" /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50 min-w-[200px]"><input type="text" value={row.control} onChange={e => updateRow(row.id, 'control', e.target.value)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-cyan-500 rounded text-slate-800 dark:text-slate-200" placeholder="How we catch it..." /></td>
                      <td className="p-1 border-r border-slate-100 dark:border-slate-800/50"><input type="number" min="1" max="10" value={row.d} onChange={e => updateRow(row.id, 'd', parseInt(e.target.value) || 1)} className="w-full p-2 bg-transparent outline-none focus:ring-1 focus:ring-blue-500 rounded text-center text-blue-600 dark:text-blue-400 font-bold" /></td>
                      <td className={`p-3 font-black text-center sticky right-0 shadow-[inset_1px_0_0_rgba(0,0,0,0.05)] ${rpnVal >= 100 ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : rpnVal >= 40 ? 'bg-orange-50 text-orange-500 dark:bg-orange-900/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'}`}>{rpnVal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {currentRows.length > 0 && (
            <div className="h-64 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" /> RPN Pareto Analysis
              </h4>
              <ReactECharts
                option={{
                  animation: false,
                  grid: { left: '5%', right: '5%', top: '10%', bottom: '25%' },
                  tooltip: { trigger: 'axis', backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
                  xAxis: { 
                    type: 'category', 
                    data: paretoData.names,
                    axisLabel: { color: chartColors.axis, interval: 0, rotate: 15, fontSize: 10 },
                    axisLine: { lineStyle: { color: chartColors.grid } }
                  },
                  yAxis: { 
                    type: 'value', 
                    splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } },
                    axisLabel: { color: chartColors.axis }
                  },
                  series: [{
                    name: 'RPN',
                    type: 'bar',
                    data: paretoData.rpns,
                    itemStyle: {
                      color: (params: any) => {
                        const val = params.value;
                        if (val >= 100) return '#ef4444'; // red
                        if (val >= 40) return '#f59e0b';  // orange
                        return '#10b981'; // green
                      },
                      borderRadius: [4, 4, 0, 0]
                    },
                    label: { show: true, position: 'top', color: chartColors.axis, fontSize: 10 }
                  }]
                }}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-cyan-600" /> Assessment Inputs
              </h3>

              {[
                { label: 'Severity (S)', val: severity, set: setSeverity, min: '1 (None)', max: '10 (Catastrophic)' },
                { label: 'Occurrence (O)', val: occurrence, set: setOccurrence, min: '1 (Remote)', max: '10 (Inevitable)' },
                { label: 'Detection (D)', val: detection, set: setDetection, min: '1 (Certain)', max: '10 (Un-detectable)' },
              ].map((input, i) => (
                <div key={i} className="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{input.label}</span>
                    <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 font-mono">{input.val} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={input.val}
                    onChange={(e) => input.set(parseInt(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
                    <span>{input.min}</span>
                    <span>{input.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative group h-full">
              {/* Glowing blur background halo */}
              <div className={`absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r ${
                rpn >= 100 ? 'from-red-500 to-rose-600' : rpn >= 40 ? 'from-amber-500 to-orange-600' : 'from-emerald-500 to-teal-650'
              }`}></div>
              
              <div className={`relative p-8 rounded-2xl border ${risk.border} ${risk.bg} dark:bg-opacity-10 flex flex-col items-center justify-center h-full text-center shadow-lg bg-slate-50 dark:bg-slate-900`}>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Risk Priority Number (RPN)</div>
                <div className={`text-8xl font-black ${risk.color} mb-4 drop-shadow-sm font-mono`}>{rpn}</div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold bg-white/90 dark:bg-slate-800 ${risk.color} border border-current shadow-sm`}>{risk.label}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <ShareAndExport 
          toolName="FMEA Analysis"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary={activeTab === 'calculator' ? `RPN: ${rpn}` : `${currentRows.length} failure modes identified`}
          exportData={[
            { Parameter: "Current View", Value: activeTab },
            ...(activeTab === 'calculator' ? [
              { Parameter: "Severity (S)", Value: severity.toString() },
              { Parameter: "Occurrence (O)", Value: occurrence.toString() },
              { Parameter: "Detection (D)", Value: detection.toString() },
              { Parameter: "RPN Score", Value: rpn.toString() }
            ] : [
              { Parameter: "Number of Failure Modes", Value: currentRows.length.toString() },
              {},
              { Parameter: "--- WORKSHEET DATA ---", Value: "" },
              ...currentRows.flatMap(r => [
                { Parameter: `Item (${r.id})`, Value: r.item },
                { Parameter: "Failure Mode", Value: r.failureMode },
                { Parameter: "RPN", Value: (r.s * r.o * r.d).toString() },
              ])
            ])
          ]}
        />
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Ultimate Risk Assessment Guide: FMEA and RPN Methodology
        </h2>
        <p>
          In design engineering and industrial operations, predicting how a system might fail is key to avoiding catastrophic downtimes, safety hazards, and financial losses. This interactive <span className="font-extrabold text-cyan-600 dark:text-cyan-400">FMEA template</span> and <span className="font-extrabold text-cyan-600 dark:text-cyan-400">RPN calculator online</span> provides a structured workspace for engineers to perform Failure Modes and Effects Analysis (FMEA). By cataloging potential component failures, assigning risk indexes (Severity, Occurrence, and Detection), and computing the <strong>Risk Priority Number (RPN)</strong>, organizations can identify critical vulnerabilities and implement preventive action plans before they reach the plant floor. This tool represents a vital framework in our <strong>reliability engineering calculator</strong> repository.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          What is Failure Modes and Effects Analysis (FMEA)?
        </h3>
        <p>
          FMEA is a systematic, bottom-up analytical technique used to identify potential failure modes in a system, product, or process, evaluate their associated risks, and identify corrective actions to mitigate those risks. Originally developed in the 1940s by the US military (under MIL-P-1629) and later popularized in aerospace, automotive (via AIAG/VDA standards), and nuclear industries, FMEA has become a cornerstone of Quality Management Systems (QMS) and Design for Reliability (DfR).
        </p>
        <p>
          There are two primary types of FMEA:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-350">
          <li>
            <strong>Design FMEA (DFMEA):</strong> Focuses on product design vulnerabilities at the subsystem or component level to prevent safety hazards, reduce warranty costs, and improve product life before manufacturing begins.
          </li>
          <li>
            <strong>Process FMEA (PFMEA):</strong> Analyzes manufacturing, assembly, or service processes, focusing on equipment malfunctions, operator errors, and environmental factors that could lead to product defects.
          </li>
        </ul>
        <p>
          To systematically validate your design changes against standard checklists, you can run our <Link to="/tools/validator" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">System Reliability Validator</Link> to ensure full engineering standard compliance.
        </p>

        <h2 id="how-to" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Three Pillars of Risk: Severity, Occurrence, and Detection
        </h2>
        <p>
          In a standard FMEA worksheet, every identified failure mode is scored on a scale from 1 to 10 across three distinct parameters:
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          1. Severity (S) - Impact of the Failure
        </h3>
        <p>
          Severity measures the seriousness of the effect of a failure mode. A score of 1 represents no noticeable effect, while a score of 10 represents a catastrophic event—such as a major safety violation, environmental disaster, or total system loss—occurring without warning. Because Severity is inherent to the failure's effect, it cannot be reduced unless the system is redesigned (e.g., adding an automatic safety relief valve to lower a high-pressure explosion risk).
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          2. Occurrence (O) - Likelihood of the Cause
        </h3>
        <p>
          Occurrence represents the likelihood that a specific cause will happen and trigger the failure mode during the asset's design life. A score of 1 represents a remote probability of occurrence (e.g., once in 10 years), while a score of 10 indicates that the failure is virtually inevitable (occurring daily). Occurrence scores are often derived from historic MTBF metrics. If you have historical breakdown records, you can calculate the exact mean runtimes using our <Link to="/mtbf-calculator" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">MTBF Calculator</Link> to assign realistic Occurrence scores.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          3. Detection (D) - Ability to Catch the Defect
        </h3>
        <p>
          Detection is an assessment of the ability of current controls to detect a cause or failure mode *before* the defect escapes to the customer or leads to system failure. Crucially, <strong>Detection is scored in reverse</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-355 font-medium">
          <li>
            A score of <strong>1</strong> represents almost certain detection (e.g., automatic sensor loops shut down the machine instantly when an anomaly is detected).
          </li>
          <li>
            A score of <strong>10</strong> represents absolute certainty that the failure will pass undetected (flying blind with no monitoring or inspection routines in place).
          </li>
        </ul>

        <h2 id="applications" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Calculating the Risk Priority Number (RPN)
        </h2>
        <p>
          The Risk Priority Number (RPN) is the mathematical product of the three scores, yielding a value between 1 and 1000:
        </p>
        <div className="my-6">
          <BlockMath math="\text{RPN} = \text{Severity (S)} \times \text{Occurrence (O)} \times \text{Detection (D)}" />
        </div>
        <p>
          Historically, organizations prioritized corrective actions by setting a hard RPN threshold (e.g., "any failure mode with an RPN &gt; 150 requires immediate mitigation"). However, modern standards (like the AIAG-VDA FMEA Handbook) caution against relying solely on threshold limits. 
        </p>
        <p>
          For example, a failure mode with a Severity of 10 (Critical Safety Risk), Occurrence of 2, and Detection of 4 yields an RPN of 80. Conversely, a Severity of 3 (Minor Operational Issue), Occurrence of 8, and Detection of 8 yields an RPN of 192. Relying strictly on the RPN score would lead engineers to address the minor issue first, leaving the critical safety hazard unmitigated. Therefore, modern guidelines prioritize failures based on the <strong>Severity score itself</strong>, establishing that any Severity score of 9 or 10 demands corrective action, regardless of the overall RPN.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
          📖 Step-by-Step Practical Example: Process Control Valve
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-slate-750 dark:text-slate-300">
          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: Identify Process & Failure Mode</span>
            <p className="mt-1">
              • <strong>Process/Item:</strong> Chemical Reactor Feed Line Valve (Actuator System)
              <br />
              • <strong>Failure Mode:</strong> Valve stuck in "closed" position
              <br />
              • <strong>Failure Effect:</strong> Raw material flow is cut off, causing batch cooling, crystallization, and complete system shutdown, resulting in <strong>$50,000 in lost production</strong>.
            </p>
          </div>
          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Assign Initial Risk Scores (S, O, D)</span>
            <p className="mt-1">
              • <strong>Severity (S): 8 (Very High)</strong> — High financial loss and process downtime.
              <br />
              • <strong>Occurrence (O): 4 (Low-to-Medium)</strong> — Coil burnout happens occasionally (MTBF ~25,000 hours).
              <br />
              • <strong>Detection (D): 7 (Poor)</strong> — Visually checked daily, but internal coil degradation cannot be seen ahead of time.
              <br />
              • <strong>Initial RPN:</strong> <InlineMath math="8 \times 4 \times 7 = 224" /> (Critical Mitigation Zone).
            </p>
          </div>
          <div>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Implement Corrective Actions</span>
            <p className="mt-1">
              • Redesign with a <strong>dual redundant coil setup (1oo2 voting logic)</strong> to drop Occurrence to <strong>2</strong>.
              <br />
              • Install an <strong>automatic resistance feedback sensor</strong> to drop Detection to <strong>2</strong> (system alarms instantly when coil fails).
              <br />
              • <strong>New RPN:</strong> <InlineMath math="8 \times 2 \times 2 = 32" /> (85.7% risk reduction, shifting to safe Monitor Zone).
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-600" /> Industrial FMEA & Risk Standards
          </h3>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350">
            FMEA studies are highly structured to comply with major global engineering quality standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-350">
            <li><strong>IEC 60812:</strong> International standard for Failure Modes and Effects Analysis (FMEA and FMECA), outlining standard worksheet formatting and risk matrices.</li>
            <li><strong>AIAG & VDA FMEA Handbook:</strong> Combined automotive guidelines developed by the Automotive Industry Action Group and Verband der Automobilindustrie, establishing Action Priority (AP) tables.</li>
            <li><strong>SAE ARP5580:</strong> Aerospace standard for failure modes, effects and criticality analysis (FMECA) in civil and military aviation systems.</li>
            <li><strong>MIL-STD-1629A:</strong> The foundational military standard establishing RPN criticality analysis procedures.</li>
          </ul>
        </div>

        <h2 id="standards" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Advanced Risk Analysis: FTA and Root Cause Tools
        </h2>
        <p>
          FMEA is a bottom-up, inductive analysis (asking "what happens if this part fails?"). To perform a comprehensive risk assessment, it should be paired with top-down, deductive methodologies:
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-bold text-rose-600 dark:text-rose-455 mb-2">Fault Tree Analysis (FTA)</h4>
            <p className="text-sm">
               Use a top-down deductive model to identify the combination of component failures, software bugs, and human errors that could lead to a defined "Top Event" hazard. Analyze logical relationships using our interactive <Link to="/tools/fta" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Fault Tree Analysis Tool</Link>.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-bold text-rose-600 dark:text-rose-455 mb-2">Fishbone Diagram Generator</h4>
            <p className="text-sm">
              Brainstorm and map all potential causes contributing to a failure mode across the "6 Ms" (Man, Machine, Material, Method, Measurement, Mother Nature). Visualize root causality in our <Link to="/tools/fishbone" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Fishbone Diagram Tool</Link>.
            </p>
          </div>
        </div>
        <p>
          By combining FMEA worksheets with Fault Trees and Fishbone diagrams, engineering teams can build robust, redundant systems, continuously lowering occurrence probabilities and raising detection capabilities across the entire lifecycle of their assets.
        </p>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between FMEA and FMECA?",
      answer: "FMEA (Failure Modes and Effects Analysis) catalogs failure modes and their local/system-wide consequences. FMECA (Failure Modes, Effects, and Criticality Analysis) builds directly upon FMEA by adding a Criticality Analysis, plotting each failure mode on a criticality matrix (likelihood vs. severity) to quantitatively identify safety-critical failure risks."
    },
    {
      question: "Why does the modern AIAG-VDA standard deprecate relying solely on RPN thresholds?",
      answer: "Relying on hard RPN limits (like only mitigating if RPN > 100) is dangerous. A severe safety risk with Severity=10, Occurrence=2, Detection=3 yields RPN=60 (ignored under thresholds), while a minor cosmetic defect with Severity=2, Occurrence=8, Detection=8 yields RPN=128 (prioritized). The AIAG-VDA standard replaces RPN thresholds with Action Priority (AP) tables (High, Medium, Low) to guarantee high-severity failure effects are always addressed first."
    },
    {
      question: "Can I reduce the Severity (S) score of a failure mode?",
      answer: "Severity is inherent to the failure's physical effect (e.g., cylinder explosion). You cannot make an explosion physically less severe unless you redesign the system layout (e.g., adding blast shielding, venting ducts, or switching to lower operating pressures)."
    },
    {
      question: "How do Occurrence (O) scores relate to industrial failure data like MTBF?",
      answer: "Occurrence scores represent probability categories. Ideally, they map to actual failure rates (λ). For example, Occurrence=1 maps to a failure rate < 1 per million hours, while Occurrence=10 indicates failures are virtually constant. Teams consult internal maintenance logs or industry standards (OREDA, NPRD) to map MTBF data directly to FMEA occurrence categories."
    },
    {
      question: "How does FMEA relate to Reliability-Centered Maintenance (RCM) and Root Cause Analysis (RCA)?",
      answer: "FMEA is the core diagnostic step of RCM, identifying failure modes to select the best proactive maintenance tasks. FMEA is proactive (conducted before deployment or during design updates), while Root Cause Analysis (RCA) is reactive, triggered after a failure happens to investigate the specific physical, human, and organizational causes."
    }
  ];

  return (
    <ToolContentLayout
      title="Free FMEA Template & RPN Calculator Online"
      description="Assess risk using Failure Modes and Effects Analysis. Calculate the Risk Priority Number (RPN) to prioritize which failure modes need immediate attention."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="fmea-calculator" />
        </>
      }
      faqs={faqs}
      keywords="FMEA calculator, RPN calculator online, failure mode effects analysis, FMEA tool free, risk priority number, FMEA India, FMEA worksheet, IEC 60812, DFMEA PFMEA"
      canonicalUrl="https://reliabilitytools.co.in/#/fmea-tool"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Free FMEA Template & RPN Calculator Online',
        applicationCategory: 'UtilitiesApplication'
      }}
    />
  );
};

export default FmeaCalculator;
