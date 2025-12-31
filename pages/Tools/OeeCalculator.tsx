
import React, { useState } from 'react';
import { calculateOEE } from '../../services/reliabilityMath';
import { Gauge, Play, Pause, AlertOctagon, ClipboardList, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

const OeeCalculator: React.FC = () => {
  const [shiftLength, setShiftLength] = useState<string>('480'); // 8 hours
  const [breaks, setBreaks] = useState<string>('60');
  const [downtime, setDowntime] = useState<string>('30');
  const [idealCycle, setIdealCycle] = useState<string>('60'); // 60 sec/part
  const [totalCount, setTotalCount] = useState<string>('350');
  const [rejects, setRejects] = useState<string>('10');

  const result = calculateOEE(
    parseFloat(shiftLength)||0, 
    parseFloat(breaks)||0, 
    parseFloat(downtime)||0, 
    parseFloat(idealCycle)||0, 
    parseFloat(totalCount)||0, 
    parseFloat(rejects)||0
  );

  const formatPct = (val: number) => (val * 100).toFixed(1) + '%';
  
  const getColor = (val: number) => {
    if (val >= 0.85) return 'text-green-500';
    if (val >= 0.60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">OEE Calculator</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
            Calculate Overall Equipment Effectiveness. OEE is the gold standard for measuring manufacturing productivity (defined in <strong>ISO 22400-2</strong>). It identifies the percentage of manufacturing time that is truly productive.
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="no-print flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Production Data
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Shift Length (min)</label>
                  <input type="number" value={shiftLength} onChange={e => setShiftLength(e.target.value)} className="input-field" />
                 </div>
                 <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Breaks (min)</label>
                  <input type="number" value={breaks} onChange={e => setBreaks(e.target.value)} className="input-field" />
                 </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Unplanned Downtime (min)</label>
                <input type="number" value={downtime} onChange={e => setDowntime(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                   Ideal Cycle Time (sec/part)
                   <HelpTooltip text="The theoretical fastest time to produce one part." />
                </label>
                <input type="number" value={idealCycle} onChange={e => setIdealCycle(e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Total Count</label>
                  <input type="number" value={totalCount} onChange={e => setTotalCount(e.target.value)} className="input-field" />
                 </div>
                 <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Rejects</label>
                  <input type="number" value={rejects} onChange={e => setRejects(e.target.value)} className="input-field" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
           
           {/* Availability */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                 <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</h3>
              <div className={`text-4xl font-bold ${getColor(result.availability)} mb-2`}>{formatPct(result.availability)}</div>
              <p className="text-xs text-slate-500">Operating Time / Planned Time</p>
           </div>

           {/* Performance */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
                 <Gauge className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Performance</h3>
              <div className={`text-4xl font-bold ${getColor(result.performance)} mb-2`}>{formatPct(result.performance)}</div>
              <p className="text-xs text-slate-500">(Total Parts / Run Time) / Ideal Rate</p>
           </div>

           {/* Quality */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                 <AlertOctagon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Quality</h3>
              <div className={`text-4xl font-bold ${getColor(result.quality)} mb-2`}>{formatPct(result.quality)}</div>
              <p className="text-xs text-slate-500">Good Parts / Total Parts</p>
           </div>

           {/* Total OEE */}
           <div className="md:col-span-3 bg-slate-900 dark:bg-slate-100 p-8 rounded-xl shadow-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white dark:text-slate-900 mb-1">OEE Score</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm">World Class OEE is generally considered to be 85%.</p>
              </div>
              <div className="text-6xl font-extrabold text-cyan-400 dark:text-cyan-600">
                {formatPct(result.oee)}
              </div>
           </div>
        </div>

      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 no-print">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Availability
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
             Availability takes into account Down Time Loss, including breakdowns, setup, and adjustments.
             <br/><em>Formula: Run Time / Planned Production Time</em>
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Performance
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Performance accounts for Speed Loss, including small stops and slow cycles.
            <br/><em>Formula: (Ideal Cycle Time × Total Count) / Run Time</em>
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Quality
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Quality accounts for Quality Loss, which accounts for manufactured parts that do not meet quality standards.
            <br/><em>Formula: Good Count / Total Count</em>
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="oee" />

      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          outline: none;
        }
        :global(.dark) .input-field {
          background-color: #0f172a;
          border: 1px solid #334155;
          color: white;
        }
        .input-field {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default OeeCalculator;
