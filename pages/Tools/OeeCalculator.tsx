import React, { useState } from 'react';
import { calculateOEE } from '../../services/reliabilityMath';
import { 
  Gauge, 
  Play, 
  Pause, 
  AlertOctagon, 
  ClipboardList, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Printer, 
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useLocation } from 'react-router-dom';
import { useShareableState } from '../../hooks/useShareableState';
import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import { OeeWaterfallDiagram } from '../../components/TheoryVisuals';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface OeeState {
  shiftLength: string;
  breaks: string;
  downtime: string;
  idealCycle: string;
  totalCount: string;
  rejects: string;
}

const SixBigLossesMatrix = () => {
  const losses = [
    {
      metric: 'Availability',
      loss: 'Equipment Failures / Breakdowns',
      description: 'Unplanned downtime when a machine is scheduled to run but fails (e.g. motor burnout, gear failure, tooling breaks).',
      action: 'Implement predictive vibration analysis, thermal audits, and root cause failure analysis (RCFA).'
    },
    {
      metric: 'Availability',
      loss: 'Setups & Adjustments',
      description: 'Planned stop times for product changeovers, tooling modifications, cleaning, or initial warming runs.',
      action: 'Apply SMED (Single-Minute Exchange of Die) techniques to standardize and compress changeover operations.'
    },
    {
      metric: 'Performance',
      loss: 'Idling & Minor Stops',
      description: 'Brief interruptions (usually < 2-5 minutes) that don\'t require maintenance intervention (e.g. sensor misalignment, feed jams).',
      action: 'Deploy localized IoT sensors to register frequency logs of micro-stops and optimize parts feeding conveyor systems.'
    },
    {
      metric: 'Performance',
      loss: 'Reduced Speed (Cycle Loss)',
      description: 'Equipment running slower than its designed peak nameplate speed due to mechanical wear, operator adjustments, or minor constraints.',
      action: 'Conduct routine mechanical alignment audits, clean lead-screws, and schedule structural component rebuilds.'
    },
    {
      metric: 'Quality',
      loss: 'Process Defects & Scrap',
      description: 'Defective parts produced during steady-state normal run sequences, requiring disposal, scrap recycle, or rework.',
      action: 'Introduce inline visual inspection systems and automated Statistical Process Control (SPC) charting.'
    },
    {
      metric: 'Quality',
      loss: 'Startup Rejects (Yield Loss)',
      description: 'Out-of-spec products generated during startup phases, tooling calibration runs, or machine temperature stabilization windows.',
      action: 'Automate pre-heating parameters and stabilize material flow inputs during start-up workflows.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-205 dark:border-slate-700 shadow-sm space-y-6">
      <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-cyan-600" /> The Six Big Losses & Action Matrix
      </h3>
      <p className="text-xs text-slate-500 leading-normal">
        OEE is not just a high-level metric; it is a diagnostic tool. To drive improvement on the shop floor, identify which of the <strong>Six Big Losses</strong> is draining capacity and execute the mapped reliability action plan:
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {losses.map((loss, idx) => (
          <div 
            key={idx} 
            className="p-5 rounded-xl border border-slate-100 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900/40 hover:shadow-md hover:border-cyan-500/30 transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  loss.metric === 'Availability' 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900' 
                    : loss.metric === 'Performance'
                    ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900'
                    : 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900'
                }`}>
                  {loss.metric}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{loss.loss}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{loss.description}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-350">
              <strong className="text-cyan-600 dark:text-cyan-400 font-bold block mb-1">🛠️ Reliability Action Plan:</strong>
              {loss.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeepVsOeeCard = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="space-y-3 max-w-xl">
        <span className="text-[10px] bg-cyan-500/10 dark:bg-cyan-950/40 text-cyan-655 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900 px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> Advanced Capacity Planning
        </span>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          OEE vs. TEEP: What is the Difference?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          While <strong className="text-cyan-650 dark:text-cyan-400 font-bold">OEE (Overall Equipment Effectiveness)</strong> measures the efficiency of your equipment during <span className="text-blue-600 dark:text-blue-400 font-semibold">scheduled production time</span>, <strong className="text-amber-600 dark:text-amber-400 font-bold">TEEP (Total Effective Equipment Performance)</strong> measures efficiency against <span className="text-emerald-600 dark:text-emerald-450 font-semibold">total calendar capacity</span> (24 hours a day, 365 days a year).
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          TEEP helps manufacturing leaders decide whether they can meet increased market demand by scheduling additional operating shifts on existing assets (improving <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Asset Utilization</span>), rather than purchasing new equipment.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-full md:w-auto font-mono text-xs text-center space-y-2 shrink-0 shadow-inner">
        <div className="text-slate-500 dark:text-slate-400 font-bold">Asset Utilization Formula</div>
        <div className="text-sm font-black text-cyan-600 dark:text-cyan-400">
          <BlockMath math={`\\text{TEEP} = \\text{OEE} \\times \\text{Asset Utilization}`} />
        </div>
      </div>
    </div>
  );
};

const OeeCalculator: React.FC = () => {
  const [state, setState, shareUrl] = useShareableState<OeeState>({
    shiftLength: '480',
    breaks: '60',
    downtime: '30',
    idealCycle: '60',
    totalCount: '350',
    rejects: '10'
  });
  const { shiftLength, breaks, downtime, idealCycle, totalCount, rejects } = state;

  const toolRef = useRef<HTMLDivElement>(null);
  
  const { addRecentTool } = useRecentTools();
  const location = useLocation();

  React.useEffect(() => {
    addRecentTool({
        id: 'oee-calculator',
        name: 'OEE Calculator',
        path: '/oee-calculator'
    });

    const searchParams = new URLSearchParams(location.search);
    const s = searchParams.get('shiftLength');
    const b = searchParams.get('breaks');
    const d = searchParams.get('downtime');
    const ic = searchParams.get('idealCycle');
    const t = searchParams.get('totalCount');
    const r = searchParams.get('rejects');
    
    if (s || b || d || ic || t || r) {
      setState(prev => {
        const newState = { ...prev };
        if (s && !isNaN(parseFloat(s))) newState.shiftLength = s;
        if (b && !isNaN(parseFloat(b))) newState.breaks = b;
        if (d && !isNaN(parseFloat(d))) newState.downtime = d;
        if (ic && !isNaN(parseFloat(ic))) newState.idealCycle = ic;
        if (t && !isNaN(parseFloat(t))) newState.totalCount = t;
        if (r && !isNaN(parseFloat(r))) newState.rejects = r;
        return newState;
      });
    }
  }, [location.search]);

  const result = calculateOEE(
    parseFloat(shiftLength) || 0,
    parseFloat(breaks) || 0,
    parseFloat(downtime) || 0,
    parseFloat(idealCycle) || 0,
    parseFloat(totalCount) || 0,
    parseFloat(rejects) || 0
  );

  const formatPct = (val: number) => (val * 100).toFixed(1) + '%';

  const getColor = (val: number) => {
    if (val >= 0.85) return 'text-green-505 dark:text-green-400';
    if (val >= 0.60) return 'text-amber-505 dark:text-amber-400';
    return 'text-rose-505 dark:text-rose-455';
  };

  const radarOptions = {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: [
        { name: 'Availability', max: 100 },
        { name: 'Performance', max: 100 },
        { name: 'Quality', max: 100 },
        { name: 'Total OEE', max: 100 }
      ],
      radius: '65%',
      axisName: { color: '#64748b', fontWeight: 'bold' },
      splitArea: { areaStyle: { color: ['transparent'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              Math.min(100, Math.max(0, result.availability * 100)),
              Math.min(100, Math.max(0, result.performance * 100)),
              Math.min(100, Math.max(0, result.quality * 100)),
              Math.min(100, Math.max(0, result.oee * 100))
            ],
            name: 'OEE Metrics',
            areaStyle: { color: 'rgba(6, 182, 212, 0.2)' },
            lineStyle: { width: 3, color: '#06b6d4' },
            itemStyle: { color: '#06b6d4' }
          }
        ]
      }
    ]
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

      {/* Input Panel */}
      <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
        <div className="space-y-4 bg-slate-100 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Production Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Shift Length (min)</label>
              <input type="number" value={shiftLength} onChange={e => setState(s => ({ ...s, shiftLength: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Breaks (min)</label>
              <input type="number" value={breaks} onChange={e => setState(s => ({ ...s, breaks: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Unplanned Downtime (min)</label>
            <input type="number" value={downtime} onChange={e => setState(s => ({ ...s, downtime: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
              Ideal Cycle Time (sec/part)
              <HelpTooltip text="The theoretical fastest time to produce one part under perfect conditions." />
            </label>
            <input type="number" value={idealCycle} onChange={e => setState(s => ({ ...s, idealCycle: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Total Count</label>
              <input type="number" value={totalCount} onChange={e => setState(s => ({ ...s, totalCount: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Rejects</label>
              <input type="number" value={rejects} onChange={e => setState(s => ({ ...s, rejects: e.target.value }))} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          
          {/* Validation Banner */}
          {(result.oee > 1 || result.availability > 1 || result.performance > 1 || result.quality > 1) && (
            <div className="p-4 rounded-xl border-l-4 bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 mt-4">
              <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Impossible Physics Detected</h4>
                <p>One of your OEE metrics is calculated over 100%. Please check that <strong>Ideal Cycle Time</strong> and <strong>Total Count</strong> do not exceed the actual running time, and that <strong>Rejects</strong> are not greater than <strong>Total Count</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Results Panel */}
      <AnimatedContainer animation="staggerContainer" delay={0.2} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Availability */}
        <AnimatedContainer animation="scaleUp" className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-blue-105 dark:bg-blue-900/30 p-3 rounded-full mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</h3>
          <div className={`text-3xl font-black ${getColor(result.availability)} mb-2`}>{formatPct(result.availability)}</div>
          <p className="text-[10px] text-slate-400">Run Time / Planned Production Time</p>
        </AnimatedContainer>

        {/* Performance */}
        <AnimatedContainer animation="scaleUp" className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
            <Gauge className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Performance</h3>
          <div className={`text-3xl font-black ${getColor(result.performance)} mb-2`}>{formatPct(result.performance)}</div>
          <p className="text-[10px] text-slate-400">(Total Count * Ideal Cycle) / Run Time</p>
        </AnimatedContainer>

        {/* Quality */}
        <AnimatedContainer animation="scaleUp" className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
            <AlertOctagon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Quality</h3>
          <div className={`text-3xl font-black ${getColor(result.quality)} mb-2`}>{formatPct(result.quality)}</div>
          <p className="text-[10px] text-slate-400">Good Parts / Total Parts</p>
        </AnimatedContainer>

        {/* Total OEE */}
        <AnimatedContainer animation="slideUp" className="md:col-span-3 bg-slate-900 dark:bg-slate-100 p-8 rounded-2xl shadow-lg flex items-center justify-between mt-4">
          <div>
            <h3 className="text-xl font-black text-white dark:text-slate-900 mb-1">OEE Score</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Target: World Class Standard &gt; 85%</p>
          </div>
          <div className="text-6xl font-black text-cyan-400 dark:text-cyan-600">
            {formatPct(result.oee)}
          </div>
        </AnimatedContainer>
        
        {/* Radar Chart Visual */}
        <AnimatedContainer animation="slideUp" className="md:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-2 h-80">
          <ReactECharts option={radarOptions} style={{ height: '100%', width: '100%' }} />
        </AnimatedContainer>

        <div className="md:col-span-3">
          <ShareAndExport 
            toolName="OEE Calculator"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={`${(result.oee * 100).toFixed(1)}%`}
            exportData={[
              { Parameter: "Shift Length (min)", Value: shiftLength },
              { Parameter: "Breaks (min)", Value: breaks },
              { Parameter: "Unplanned Downtime (min)", Value: downtime },
              { Parameter: "Ideal Cycle Time (sec/part)", Value: idealCycle },
              { Parameter: "Total Count", Value: totalCount },
              { Parameter: "Rejects", Value: rejects },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "Availability", Value: formatPct(result.availability) },
              { Parameter: "Performance", Value: formatPct(result.performance) },
              { Parameter: "Quality", Value: formatPct(result.quality) },
              { Parameter: "Overall Equipment Effectiveness (OEE)", Value: formatPct(result.oee) },
            ]}
          />
        </div>
      </AnimatedContainer>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Mastering OEE Theory</h2>
        <p className="text-slate-650 dark:text-slate-400 max-w-2xl mx-auto">Overall Equipment Effectiveness (OEE) is the gold standard for measuring manufacturing productivity. Here is the mathematical breakdown of the "Hidden Factory".</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The OEE Formula"
          icon={<Target className="w-5 h-5" />}
          formula="OEE = \text{Availability} \times \text{Performance} \times \text{Quality}"
          delay={0.1}
        >
          <p>
            An OEE score of 100% means you are manufacturing:
          </p>
          <ul className="space-y-2 mt-3">
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div><strong className="text-purple-600 dark:text-purple-400">Good Parts</strong> only (100% Quality)</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><strong className="text-amber-600 dark:text-amber-400">At Maximum Speed</strong> (100% Performance)</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><strong className="text-blue-600 dark:text-blue-400">Without Interruption</strong> (100% Availability)</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Availability"
          icon={<Play className="w-5 h-5" />}
          formula="\text{Availability} = \\frac{\\text{Run Time}}{\\text{Planned Production Time}}"
          delay={0.2}
        >
          <p>
            Measures Uptime against Scheduled Time. Planned downtime (holidays, no scheduled shifts) does <span className="text-emerald-600 dark:text-emerald-400 font-semibold">not</span> penalize Availability.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-xs mt-1 text-slate-700 dark:text-slate-300">
              <li>Equipment Breakdowns (Unplanned)</li>
              <li>Setup & Adjustments</li>
            </ul>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Performance"
          icon={<Gauge className="w-5 h-5" />}
          formula="\text{Performance} = \\frac{\\text{Ideal Cycle Time} \\times \\text{Total Count}}{\\text{Run Time}}"
          delay={0.3}
        >
          <p>
            Accounts for anything that causes the manufacturing process to run at <span className="text-rose-600 dark:text-rose-455 font-semibold">less than</span> the maximum possible speed.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-xs mt-1 text-slate-700 dark:text-slate-300">
              <li>Idling & Minor Stops</li>
              <li>Reduced Speed / Slow Cycles</li>
            </ul>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Quality"
          icon={<AlertOctagon className="w-5 h-5" />}
          formula="\text{Quality} = \\frac{\\text{Good Count}}{\\text{Total Count}}"
          delay={0.4}
        >
          <p>
            Accounts for manufactured parts that do not meet quality standards, including parts that need <span className="text-purple-600 dark:text-purple-400 font-semibold">rework or scrap recycle</span>.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-xs mt-1 text-slate-700 dark:text-slate-300">
              <li>Startup Rejects</li>
              <li>Production Defects (Scrap/Rework)</li>
            </ul>
          </div>
        </TheoryBlock>
      </div>

      <div className="my-8">
        <OeeWaterfallDiagram />
      </div>

      {/* Advanced Theory Sections */}
      <SixBigLossesMatrix />
      <TeepVsOeeCard />
    </div>
  );

  const faqs = [
    {
      question: "What is a 'Good' OEE Score?",
      answer: "<ul><li><strong>100%</strong>: Perfect production (theoretical).</li><li><strong>85%</strong>: World Class for discrete manufacturers.</li><li><strong>60%</strong>: Typical for many manufacturers.</li><li><strong>40%</strong>: Common for low-volume or unoptimized processes.</li></ul>"
    },
    {
      question: "Does OEE include planned downtime?",
      answer: "No. Planned downtime (scheduled maintenance, holidays, lack of orders) is excluded from the calculation. OEE measures how effectively you use the time you are <em>scheduled</em> to run."
    },
    {
      question: "Why can Performance be > 100%?",
      answer: "If your Ideal Cycle Time is set too low (e.g., you underestimated the machine speed), Performance can exceed 100%. This usually means your standard cycle time needs updating."
    },
    {
      question: "What is the difference between OEE and TEEP?",
      answer: "OEE measures the effectiveness of your equipment during planned production hours. <strong>TEEP (Total Effective Equipment Performance)</strong> measures effectiveness against total calendar time (24/7, 365 days a year). Mathematically: TEEP = OEE × Asset Utilization."
    },
    {
      question: "Can OEE be applied to manual or semi-automated processes?",
      answer: "Yes. OEE is not exclusive to automated machinery. In manual systems, <strong>Ideal Cycle Time</strong> represents the standard time standard set by industrial engineering time studies. Downtime tracks line stoppages, and Quality tracks assembly scrap or rework defects."
    }
  ];

  return (
    <ToolContentLayout
      title="Free OEE Calculator - Overall Equipment Effectiveness"
      description="Calculate Overall Equipment Effectiveness (OEE) to pinpoint production losses. Measure Availability, Performance, and Quality against the ISO 22400 standard."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="oee" />
        </>
      }
      faqs={faqs}
      keywords="OEE calculator free, overall equipment effectiveness, OEE formula, manufacturing efficiency, TPM India, six big losses, availability performance quality, TEEP vs OEE"
      canonicalUrl="https://reliabilitytools.co.in/#/oee-calculator"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Free OEE Calculator - Overall Equipment Effectiveness",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default OeeCalculator;
