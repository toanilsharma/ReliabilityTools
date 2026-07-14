import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, ShieldAlert, Cpu, Settings, Activity, Info } from 'lucide-react';

// ==========================================
// 1. BATHTUB CURVE DIAGRAM
// ==========================================
export const BathtubCurveDiagram: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const phases = [
    {
      id: 0,
      title: '1. Infant Mortality',
      subtitle: 'Decreasing Failure Rate (β < 1)',
      desc: 'Early failures caused by manufacturing defects, material flaws, transport damage, or poor installation. Remedied by component burn-in and screening.',
      color: 'from-rose-500/20 to-rose-500/10 border-rose-500 dark:border-rose-400',
      textColor: 'text-rose-600 dark:text-rose-450'
    },
    {
      id: 1,
      title: '2. Useful Life',
      subtitle: 'Constant Failure Rate (β = 1)',
      desc: 'Random failures caused by unexpected stress spikes, operator errors, or environmental shocks. MTBF and reliability calculations are valid in this phase.',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500 dark:border-cyan-400',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      id: 2,
      title: '3. Wear-Out Phase',
      subtitle: 'Increasing Failure Rate (β > 1)',
      desc: 'Aging failures caused by fatigue, friction, corrosion, and wear. Controlled through preventive replacement (PM) and scheduled overhauls.',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500 dark:border-amber-400',
      textColor: 'text-amber-600 dark:text-amber-450'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Interactive Bathtub Curve Diagram
        </h4>
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Hover curve segments to explore
        </span>
      </div>

      <div className="relative h-60 w-full bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm p-4 overflow-hidden">
        {/* Y Axis */}
        <div className="absolute left-10 top-4 bottom-10 w-[2px] bg-slate-300 dark:bg-slate-700"></div>
        <div className="absolute left-2 top-1/2 -rotate-90 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Failure Rate (λ)</div>
        
        {/* X Axis */}
        <div className="absolute left-10 bottom-10 right-4 h-[2px] bg-slate-300 dark:bg-slate-700"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">Time (t)</div>

        {/* Phase Separators */}
        <div className="absolute left-[33%] top-4 bottom-10 border-r border-dashed border-slate-200 dark:border-slate-800"></div>
        <div className="absolute left-[66%] top-4 bottom-10 border-r border-dashed border-slate-200 dark:border-slate-800"></div>

        {/* Phase Labels */}
        <button 
          type="button"
          onMouseEnter={() => setActivePhase(0)}
          onMouseLeave={() => setActivePhase(null)}
          className={`absolute left-[15%] bottom-12 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded transition-colors ${activePhase === 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-350' : 'text-slate-400 hover:text-rose-500'}`}
        >
          Infant Mortality
        </button>
        <button 
          type="button"
          onMouseEnter={() => setActivePhase(1)}
          onMouseLeave={() => setActivePhase(null)}
          className={`absolute left-[50%] bottom-12 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded transition-colors ${activePhase === 1 ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' : 'text-slate-400 hover:text-cyan-500'}`}
        >
          Useful Life (Constant λ)
        </button>
        <button 
          type="button"
          onMouseEnter={() => setActivePhase(2)}
          onMouseLeave={() => setActivePhase(null)}
          className={`absolute left-[83%] bottom-12 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded transition-colors ${activePhase === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-350' : 'text-slate-400 hover:text-cyan-500'}`}
        >
          Wear-Out Phase
        </button>

        {/* SVGs of Curve */}
        <svg className="absolute inset-0 w-full h-full" style={{ paddingLeft: '40px', paddingBottom: '40px' }}>
          <defs>
            <linearGradient id="bathtubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#f43f5e" stopOpacity="0.02" />
              <stop offset="33%" stopColor="#0891b2" stopOpacity="0.02" />
              <stop offset="66%" stopColor="#0891b2" stopOpacity="0.02" />
              <stop offset="75%" stopColor="#d97706" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path 
            d="M 10 40 Q 60 140 100 140 L 220 140 Q 260 140 310 40 L 310 160 L 10 160 Z" 
            fill="url(#bathtubGrad)"
            className="transition-all"
          />

          {/* Phase 1 Curve */}
          <path 
            d="M 10 40 Q 60 140 100 140" 
            fill="none" 
            stroke={activePhase === 0 ? '#f43f5e' : '#cbd5e1'} 
            strokeWidth={activePhase === 0 ? 5 : 3}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setActivePhase(0)}
            onMouseLeave={() => setActivePhase(null)}
          />

          {/* Phase 2 Curve */}
          <path 
            d="M 100 140 L 220 140" 
            fill="none" 
            stroke={activePhase === 1 ? '#0891b2' : '#cbd5e1'} 
            strokeWidth={activePhase === 1 ? 5 : 3}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setActivePhase(1)}
            onMouseLeave={() => setActivePhase(null)}
          />

          {/* Phase 3 Curve */}
          <path 
            d="M 220 140 Q 260 140 310 40" 
            fill="none" 
            stroke={activePhase === 2 ? '#d97706' : '#cbd5e1'} 
            strokeWidth={activePhase === 2 ? 5 : 3}
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setActivePhase(2)}
            onMouseLeave={() => setActivePhase(null)}
          />
        </svg>
      </div>

      {/* Info Output Box */}
      <div className="min-h-[100px] transition-all">
        {activePhase !== null ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border bg-gradient-to-r ${phases[activePhase].color} transition-all`}
          >
            <h5 className={`font-bold ${phases[activePhase].textColor} mb-1 flex items-center gap-1.5`}>
              <AlertCircle className="w-4 h-4" /> {phases[activePhase].title} ({phases[activePhase].subtitle})
            </h5>
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
              {phases[activePhase].desc}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400 dark:text-slate-500">
            <Activity className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
            <p className="text-xs font-semibold">Hover over segments of the Bathtub Curve to view failure profile details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. RELIABILITY BLOCK DIAGRAM
// ==========================================
export const RbdSeriesParallelDiagram: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner">
      
      {/* Series Layout */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
          Series Configuration (Single Point of Failure)
        </h4>
        <div className="h-40 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm relative flex items-center justify-center p-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 20 80 L 70 80" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite]" />
            <path d="M 130 80 L 170 80" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite]" />
            <path d="M 230 80 L 280 80" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite]" />
          </svg>
          
          <div className="flex items-center gap-6 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In</span>
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-cyan-950/20 border-2 border-cyan-500 rounded-xl flex flex-col items-center justify-center shadow">
              <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-[10px] font-extrabold mt-1">Block A</span>
              <span className="text-[8px] text-cyan-600 dark:text-cyan-400 font-bold">R = 0.90</span>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-cyan-950/20 border-2 border-cyan-500 rounded-xl flex flex-col items-center justify-center shadow">
              <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-[10px] font-extrabold mt-1">Block B</span>
              <span className="text-[8px] text-cyan-600 dark:text-cyan-400 font-bold">R = 0.90</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out</span>
          </div>
          <div className="absolute bottom-2 text-[9px] text-slate-400 font-bold">
            System Reliability: <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-cyan-600 dark:text-cyan-400 font-bold">R = 0.81</code>
          </div>
        </div>
      </div>

      {/* Parallel Layout */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
          Parallel Configuration (Redundant Path)
        </h4>
        <div className="h-40 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm relative flex items-center justify-center p-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 20 80 L 50 80 Q 70 80 70 40 L 90 40" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 20 80 L 50 80 Q 70 80 70 120 L 90 120" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 150 40 L 170 40 Q 170 80 190 80 L 280 80" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 150 120 L 170 120 Q 170 80 190 80" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
          </svg>

          <div className="flex items-center gap-1 z-10 w-full justify-between px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In</span>
            <div className="flex flex-col gap-3">
              <div className="w-16 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 border-2 border-emerald-500 rounded-xl flex flex-col items-center justify-center shadow">
                <span className="text-[9px] font-extrabold">A1 (Active)</span>
                <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">R = 0.90</span>
              </div>
              <div className="w-16 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 border-2 border-emerald-500 rounded-xl flex flex-col items-center justify-center shadow">
                <span className="text-[9px] font-extrabold">A2 (Backup)</span>
                <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">R = 0.90</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out</span>
          </div>
          <div className="absolute bottom-2 text-[9px] text-slate-400 font-bold">
            System Reliability: <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">R = 0.99</code>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// 3. AVAILABILITY LIFECYCLE TIMELINE
// ==========================================
export const AvailabilityTimeline: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-6">
      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Availability Timeline & Downtime Breakdown
      </h4>

      {/* Timeline Bar */}
      <div className="space-y-4">
        {/* Timeline block representation */}
        <div className="w-full flex h-10 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm text-xs font-bold text-white text-center">
          <div className="w-[70%] bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center shadow-inner">
            Uptime (MTBF)
          </div>
          <div className="w-[30%] bg-gradient-to-r from-rose-600 to-orange-500 flex items-center justify-center">
            Downtime (MTTR)
          </div>
        </div>
        
        {/* MTTR Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Inside MTTR (Mean Time to Repair):</span>
          <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-bold">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-900">
              <div className="uppercase">1. Detect</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Alarm & Diagnosis</div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 rounded-lg border border-orange-200 dark:border-orange-900">
              <div className="uppercase">2. Logistics</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Spares & Permit delay</div>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-900">
              <div className="uppercase">3. Repair</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Active wrench work</div>
            </div>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 rounded-lg border border-cyan-200 dark:border-cyan-900">
              <div className="uppercase">4. Restart</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">Calibration & Testing</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-555 dark:text-slate-400 italic">
        * <strong>Formula:</strong> Availability = MTBF / (MTBF + MTTR). Reducing MTTR yields faster availability improvements than boosting MTBF in typical brownfield systems.
      </p>
    </div>
  );
};

// ==========================================
// 4. OEE LOSS WATERFALL
// ==========================================
export const OeeWaterfallDiagram: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-6">
      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> OEE Waterfall & Losses Visualizer
      </h4>

      <div className="space-y-3.5">
        {/* Total Time */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-350">1. Planned Production Time</span>
            <span className="text-slate-500">100%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
            <div className="h-full bg-indigo-500 w-full"></div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-350">2. Operating Time (Availability)</span>
            <span className="text-rose-650 dark:text-rose-400 flex items-center gap-1">Loss: Breakdowns & Setups (-10%)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
            <div className="h-full bg-cyan-500 w-[90%]"></div>
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-350">3. Net Operating Time (Performance)</span>
            <span className="text-rose-650 dark:text-rose-400 flex items-center gap-1">Loss: Slow cycles & Idling (-15%)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
            <div className="h-full bg-blue-500 w-[76.5%]"></div>
          </div>
        </div>

        {/* Quality */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-350">4. Fully Productive Time (Quality OEE)</span>
            <span className="text-rose-655 dark:text-rose-400 flex items-center gap-1">Loss: Scrap & Rejects (-5%)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
            <div className="h-full bg-emerald-500 w-[72.6%]"></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
        <span className="font-extrabold text-emerald-800 dark:text-emerald-300">OEE Score (Availability × Performance × Quality):</span>
        <span className="font-extrabold text-lg text-emerald-700 dark:text-emerald-450">72.6%</span>
      </div>
    </div>
  );
};

// ==========================================
// 5. EOQ INVENTORY SAWTOOTH MODEL
// ==========================================
export const EoqInventorySawtooth: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-6">
      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Economic Order Quantity (EOQ) Sawtooth Curve
      </h4>

      <div className="relative h-56 w-full bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm p-4 overflow-hidden">
        {/* Y Axis */}
        <div className="absolute left-12 top-4 bottom-10 w-[2px] bg-slate-300 dark:bg-slate-700"></div>
        <div className="absolute left-2 top-1/2 -rotate-90 text-[9px] font-bold text-slate-400 tracking-wider uppercase">Stock Level</div>
        
        {/* X Axis */}
        <div className="absolute left-12 bottom-10 right-4 h-[2px] bg-slate-300 dark:bg-slate-700"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 tracking-wider uppercase">Time</div>

        {/* Safety Stock Line */}
        <div className="absolute left-12 right-4 bottom-16 border-t border-dashed border-rose-500 dark:border-rose-400 opacity-60"></div>
        <div className="absolute right-6 bottom-[68px] text-[8px] font-bold text-rose-500">Safety Stock</div>

        {/* Reorder Point Line */}
        <div className="absolute left-12 right-4 bottom-24 border-t border-dotted border-amber-500 dark:border-amber-400 opacity-80"></div>
        <div className="absolute right-6 bottom-[100px] text-[8px] font-bold text-amber-500">Reorder Point (ROP)</div>

        {/* SVGs of Sawtooth */}
        <svg className="absolute inset-0 w-full h-full" style={{ paddingLeft: '48px', paddingBottom: '40px' }}>
          {/* Tooth 1 */}
          <path d="M 0 20 L 80 120 L 80 20 L 160 120 L 160 20 L 240 120 L 240 20" fill="none" stroke="#06b6d4" strokeWidth="3" />
          
          {/* Order Q dimension */}
          <path d="M 20 20 L 20 120" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
          <text x="25" y="70" fill="#64748b" fontSize="8" fontWeight="bold">Order Size (Q)</text>
        </svg>
      </div>

      <p className="text-[10px] text-slate-400 text-center font-semibold">
        The inventory curve decreases steadily during operations. Reordering occurs when stock hits the ROP, restocking instantaneously to Q size upon arrival.
      </p>
    </div>
  );
};

// ==========================================
// 6. RELIABILITY MATURITY LADDER
// ==========================================
export const MaturityStepLadder: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    { level: 5, name: '5. Prescriptive (RCM)', desc: 'Autonomous intelligence directs optimization decisions. Risk is fully modeled.', color: 'border-indigo-500 text-indigo-650 bg-indigo-50 dark:bg-indigo-950/30' },
    { level: 4, name: '4. Proactive', desc: 'Root cause analysis (RCA) is default. Redesigning systems to eliminate failure paths.', color: 'border-emerald-500 text-emerald-650 bg-emerald-50 dark:bg-emerald-950/30' },
    { level: 3, name: '3. Predictive (CBM)', desc: 'Vibration, thermography, and sensor analytics track actual health metrics.', color: 'border-cyan-500 text-cyan-605 bg-cyan-50 dark:bg-cyan-950/30' },
    { level: 2, name: '2. Preventive (PM)', desc: 'Time and cycle-based calendar scheduling of maintenance. Less random breaks.', color: 'border-amber-500 text-amber-650 bg-amber-50 dark:bg-amber-950/30' },
    { level: 1, name: '1. Reactive (Run-to-Fail)', desc: 'Fix when broken. Unscheduled breakdowns cause massive production outages.', color: 'border-rose-500 text-rose-650 bg-rose-50 dark:bg-rose-950/30' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-4">
      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Plant Reliability Maturity Staircase
      </h4>

      <div className="flex flex-col gap-2">
        {steps.map((s, idx) => (
          <div 
            key={idx}
            onMouseEnter={() => setHoveredStep(s.level)}
            onMouseLeave={() => setHoveredStep(null)}
            className={`p-3 border-l-4 rounded-r-xl transition-all cursor-pointer ${hoveredStep === s.level ? `${s.color} translate-x-2 shadow-sm` : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900/50'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">{s.name}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Maturity Level {s.level}</span>
            </div>
            {hoveredStep === s.level && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal"
              >
                {s.desc}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. FAULT TREE DIAGRAM
// ==========================================
export const FaultTreeVisual: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-4 flex flex-col items-center">
      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 self-start">
        Sample Fault Tree (FTA) Structure
      </h4>

      <div className="relative w-full max-w-sm bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 shadow-sm rounded-xl p-4 flex flex-col items-center h-56 justify-between">
        
        {/* Top Event */}
        <div className="w-32 h-10 border border-rose-500 dark:border-rose-400 bg-rose-500/10 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-450 leading-none">Top Event</span>
          <span className="text-[8px] text-slate-600 dark:text-slate-400 font-bold">Pump Overheats</span>
        </div>

        {/* Connectors to Gate */}
        <div className="w-[2px] bg-slate-300 dark:bg-slate-700 h-4 flex-grow"></div>

        {/* OR Gate */}
        <div className="w-16 h-8 border-2 border-indigo-500 rounded-b-2xl bg-indigo-500/10 flex items-center justify-center shadow-inner">
          <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400">OR GATE</span>
        </div>

        {/* Gate outputs split */}
        <div className="w-48 h-4 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute top-0 left-0 w-[2px] h-4 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute top-0 right-0 w-[2px] h-4 bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Base Events */}
        <div className="flex justify-between w-full">
          <div className="w-24 h-10 border border-cyan-500 bg-cyan-500/10 rounded-lg flex flex-col items-center justify-center shadow-sm">
            <span className="text-[8px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase">Event E1</span>
            <span className="text-[8px] text-slate-600 dark:text-slate-400">Pump Jammed</span>
          </div>
          <div className="w-24 h-10 border border-cyan-500 bg-cyan-500/10 rounded-lg flex flex-col items-center justify-center shadow-sm">
            <span className="text-[8px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase">Event E2</span>
            <span className="text-[8px] text-slate-605 dark:text-slate-400">Dry Run</span>
          </div>
        </div>
      </div>
    </div>
  );
};
