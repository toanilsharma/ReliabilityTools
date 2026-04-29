import React, { useState, useEffect } from 'react';
import { calculateRPN } from '../../services/reliabilityMath';
import { Sliders, Table as TableIcon, Undo, Redo, Plus, AlertTriangle, Activity, Search } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import RelatedTools from '../../components/RelatedTools';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


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

      <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg w-full max-w-sm mx-auto mb-8">
        <button onClick={() => setActiveTab('worksheet')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'worksheet' ? 'bg-white shadow text-slate-800 dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}><TableIcon className="w-4 h-4" /> Worksheet (Grid)</button>
        <button onClick={() => setActiveTab('calculator')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'calculator' ? 'bg-white shadow text-slate-800 dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}><Sliders className="w-4 h-4" /> Single Risk Calc</button>
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
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <Sliders className="w-5 h-5 text-cyan-600" /> Assessment Inputs
              </h3>

              {[
                { label: 'Severity (S)', val: severity, set: setSeverity, min: '1 (None)', max: '10 (Hazardous)' },
                { label: 'Occurrence (O)', val: occurrence, set: setOccurrence, min: '1 (Remote)', max: '10 (Inevitable)' },
                { label: 'Detection (D)', val: detection, set: setDetection, min: '1 (Certain)', max: '10 (Blind)' },
              ].map((input, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{input.label}</label>
                    <span className="font-mono font-bold text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 px-2 rounded">{input.val}</span>
                  </div>
                  <input type="range" min="1" max="10" value={input.val} onChange={(e) => input.set(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{input.min}</span>
                    <span>{input.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-8 rounded-2xl border-2 ${risk.bg} ${risk.border} dark:bg-opacity-10 flex flex-col items-center justify-center h-full text-center`}>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Priority Number</div>
              <div className={`text-8xl font-black ${risk.color} mb-4 drop-shadow-sm`}>{rpn}</div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-800 ${risk.color} border border-current shadow-sm`}>{risk.label}</div>
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
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">FMEA Methodology</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Failure Modes and Effects Analysis (FMEA) is a systematic, bottom-up approach for identifying all possible failures in a design, manufacturing process, or service.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <TheoryBlock 
          title="Severity (S)"
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            An assessment of how serious the <strong>Effect</strong> of the potential failure mode is to the customer or system functionality. A score of 10 represents a perilous hazard without warning.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Occurrence (O)"
          icon={<Activity className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The estimated likelihood that the specific <strong>Cause</strong> of the failure mode will happen. A score of 10 means the failure is absolutely inevitable.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Detection (D)"
          icon={<Search className="w-5 h-5" />}
          delay={0.3}
        >
          <p>
            An assessment of the probability that the <strong>Current Controls</strong> will detect the cause or failure mode before it reaches the customer. A score of 10 means the defect will blindly pass through (no detection capability).
          </p>
        </TheoryBlock>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Risk Priority Number (RPN)</h3>
        <TheoryBlock 
          title="The RPN Evaluation"
          icon={<Sliders className="w-5 h-5 border-transparent" />}
          formula="\text{RPN} = S \times O \times D"
          delay={0.4}
        >
          <p>
            The classical quantitative metric for risk prioritization. While an RPN of <code>1000</code> is the theoretical maximum, modern reliability standards (IEC 60812, AIAG-VDA) stipulate that any high Severity (e.g., S=9 or 10) necessitates immediate mitigation, <strong>regardless of the resulting overall RPN score.</strong>
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is a 'Good' RPN score?",
      answer: "There is no universal threshold. Many companies use <strong>100</strong> as an action limit, but it depends on the industry. Medical devices might act at 40; general manufacturing might accept 150."
    },
    {
      question: "Can I reduce Severity?",
      answer: "Usually, NO. Severity is inherent to the failure effect (e.g., 'Engine Explosion'). You cannot make an explosion less severe. You can only reduce the Occurrence (make it rare) or improve Detection (catch it early)."
    },
    {
      question: "Why is Detection scored in reverse?",
      answer: "Detection is a measure of risk. Excellent detection (catching the bug immediately) is Low Risk (Score 1). No detection (flying blind) is High Risk (Score 10)."
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
