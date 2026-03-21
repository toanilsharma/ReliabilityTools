
import React, { useState } from 'react';
import { calculateOEE } from '../../services/reliabilityMath';
import { Gauge, Play, Pause, AlertOctagon, ClipboardList, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
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

interface OeeState {
  shiftLength: string;
  breaks: string;
  downtime: string;
  idealCycle: string;
  totalCount: string;
  rejects: string;
}

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
    if (val >= 0.85) return 'text-green-500';
    if (val >= 0.60) return 'text-yellow-500';
    return 'text-red-500';
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
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Production Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Shift Length (min)</label>
              <input type="number" value={shiftLength} onChange={e => setState(s => ({ ...s, shiftLength: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Breaks (min)</label>
              <input type="number" value={breaks} onChange={e => setState(s => ({ ...s, breaks: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Unplanned Downtime (min)</label>
            <input type="number" value={downtime} onChange={e => setState(s => ({ ...s, downtime: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
              Ideal Cycle Time (sec/part)
              <HelpTooltip text="The theoretical fastest time to produce one part." />
            </label>
            <input type="number" value={idealCycle} onChange={e => setState(s => ({ ...s, idealCycle: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Total Count</label>
              <input type="number" value={totalCount} onChange={e => setState(s => ({ ...s, totalCount: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Rejects</label>
              <input type="number" value={rejects} onChange={e => setState(s => ({ ...s, rejects: e.target.value }))} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          {/* Feature 13 Validation */}
          {(result.oee > 1 || result.availability > 1 || result.performance > 1 || result.quality > 1) && (
            <div className="p-4 rounded-lg border-l-4 bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200 text-sm flex items-start gap-3 mt-4">
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
        <AnimatedContainer animation="scaleUp" className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</h3>
          <div className={`text-3xl font-bold ${getColor(result.availability)} mb-2`}>{formatPct(result.availability)}</div>
          <p className="text-xs text-slate-500">Run Time / Planned Time</p>
        </AnimatedContainer>

        {/* Performance */}
        <AnimatedContainer animation="scaleUp" className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
            <Gauge className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Performance</h3>
          <div className={`text-3xl font-bold ${getColor(result.performance)} mb-2`}>{formatPct(result.performance)}</div>
          <p className="text-xs text-slate-500">(Total * Cycle) / Run Time</p>
        </AnimatedContainer>

        {/* Quality */}
        <AnimatedContainer animation="scaleUp" className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
            <AlertOctagon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Quality</h3>
          <div className={`text-3xl font-bold ${getColor(result.quality)} mb-2`}>{formatPct(result.quality)}</div>
          <p className="text-xs text-slate-500">Good Parts / Total Parts</p>
        </AnimatedContainer>

        {/* Total OEE */}
        <AnimatedContainer animation="slideUp" className="md:col-span-3 bg-slate-900 dark:bg-slate-100 p-8 rounded-xl shadow-lg flex items-center justify-between mt-4">
          <div>
            <h3 className="text-xl font-bold text-white dark:text-slate-900 mb-1">OEE Score</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Target: World Class &gt; 85%</p>
          </div>
          <div className="text-6xl font-extrabold text-cyan-400 dark:text-cyan-600">
            {formatPct(result.oee)}
          </div>
        </AnimatedContainer>
        
        {/* Radar Chart Visual */}
        <AnimatedContainer animation="slideUp" className="md:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mt-2 h-80">
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
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Overall Equipment Effectiveness (OEE) is the gold standard for measuring manufacturing productivity. Here is the mathematical breakdown of the "Hidden Factory".</p>
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
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div><strong>Good Parts</strong> only (100% Quality)</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><strong>At Maximum Speed</strong> (100% Performance)</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><strong>Without Interruption</strong> (100% Availability)</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Availability"
          icon={<Play className="w-5 h-5" />}
          formula="\text{Availability} = \frac{\text{Run Time}}{\text{Planned Production Time}}"
          delay={0.2}
        >
          <p>
            Measures Uptime against Scheduled Time. Planned downtime (holidays, no scheduled shifts) does <strong>not</strong> penalize Availability.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-sm mt-1 text-slate-700 dark:text-slate-300">
              <li>Equipment Breakdowns (Unplanned)</li>
              <li>Setup & Adjustments</li>
            </ul>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Performance"
          icon={<Gauge className="w-5 h-5" />}
          formula="\text{Performance} = \frac{\text{Ideal Cycle Time} \times \text{Total Count}}{\text{Run Time}}"
          delay={0.3}
        >
          <p>
            Accounts for anything that causes the manufacturing process to run at less than the maximum possible speed.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-sm mt-1 text-slate-700 dark:text-slate-300">
              <li>Idling & Minor Stops</li>
              <li>Reduced Speed / Slow Cycles</li>
            </ul>
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Calculating Quality"
          icon={<AlertOctagon className="w-5 h-5" />}
          formula="\text{Quality} = \frac{\text{Good Count}}{\text{Total Count}}"
          delay={0.4}
        >
          <p>
            Accounts for manufactured parts that do not meet quality standards, including parts that need rework.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mt-3 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-xs text-slate-500 uppercase">Six Big Losses Category</h4>
            <ul className="list-disc pl-4 text-sm mt-1 text-slate-700 dark:text-slate-300">
              <li>Startup Rejects</li>
              <li>Production Defects (Scrap/Rework)</li>
            </ul>
          </div>
        </TheoryBlock>
      </div>
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
      keywords="OEE calculator free, overall equipment effectiveness, OEE formula, manufacturing efficiency, TPM India, six big losses, availability performance quality"
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
