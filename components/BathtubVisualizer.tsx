import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { HelpCircle, AlertCircle, CheckCircle2, Wrench, ShieldAlert, Cpu } from 'lucide-react';

interface BathtubVisualizerProps {
  currentBeta?: number;
  interactive?: boolean;
}

export const BathtubVisualizer: React.FC<BathtubVisualizerProps> = ({
  currentBeta = 1.5,
  interactive = true,
}) => {
  const [scrubbedBeta, setScrubbedBeta] = useState<number>(currentBeta);

  // Sync if currentBeta prop changes and interactive is true
  React.useEffect(() => {
    if (currentBeta && !isNaN(currentBeta)) {
      setScrubbedBeta(currentBeta);
    }
  }, [currentBeta]);

  const beta = scrubbedBeta;

  // Determine active zone
  let activeZone: 'infant' | 'random' | 'wearout';
  if (beta < 0.9) {
    activeZone = 'infant';
  } else if (beta <= 1.15) {
    activeZone = 'random';
  } else {
    activeZone = 'wearout';
  }

  // Calculate position along curve (x from 40 to 460)
  let markerX = 250;
  let markerY = 120;
  if (activeZone === 'infant') {
    // Map beta from 0.3 to 0.9 -> x: 50 to 140
    const ratio = Math.max(0, Math.min(1, (0.9 - beta) / 0.6));
    markerX = 140 - ratio * 80;
    markerY = 60 + (1 - ratio) * 60;
  } else if (activeZone === 'random') {
    // Map beta from 0.9 to 1.15 -> x: 160 to 320
    const ratio = Math.max(0, Math.min(1, (beta - 0.9) / 0.25));
    markerX = 160 + ratio * 160;
    markerY = 135;
  } else {
    // Map beta from 1.15 to 4.0 -> x: 330 to 440
    const ratio = Math.max(0, Math.min(1, (beta - 1.15) / 2.85));
    markerX = 330 + ratio * 110;
    markerY = 135 - ratio * 75;
  }

  return (
    <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Dynamic Bathtub Curve & Life-Stage Synchronizer
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                SAE JA1011 / IEC 61649
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlates the Weibull shape parameter (<InlineMath math="\beta" />) with the physical failure physics regime.
            </p>
          </div>
        </div>

        {/* Live Beta readout */}
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg">
          <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">
            Active <InlineMath math="\beta" />:
          </span>
          <span className="font-mono font-bold text-sm text-purple-700 dark:text-purple-300">
            {beta.toFixed(2)}
          </span>
        </div>
      </div>

      {/* SVG Bathtub curve */}
      <div className="mt-4 relative overflow-hidden bg-slate-50/70 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
        <svg viewBox="0 0 500 180" className="w-full h-44 sm:h-52 select-none">
          {/* Grid lines */}
          <line x1="50" y1="140" x2="460" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
          <line x1="50" y1="30" x2="50" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="50" y1="140" x2="460" y2="140" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Region Background shading */}
          {/* Infant Mortality Shading */}
          <rect
            x="50"
            y="20"
            width="110"
            height="120"
            fill={activeZone === 'infant' ? '#ef4444' : '#cbd5e1'}
            opacity={activeZone === 'infant' ? '0.15' : '0.04'}
            className="transition-all duration-300"
          />
          {/* Useful Life Shading */}
          <rect
            x="160"
            y="20"
            width="160"
            height="120"
            fill={activeZone === 'random' ? '#3b82f6' : '#cbd5e1'}
            opacity={activeZone === 'random' ? '0.15' : '0.04'}
            className="transition-all duration-300"
          />
          {/* Wear-Out Shading */}
          <rect
            x="320"
            y="20"
            width="140"
            height="120"
            fill={activeZone === 'wearout' ? '#eab308' : '#cbd5e1'}
            opacity={activeZone === 'wearout' ? '0.15' : '0.04'}
            className="transition-all duration-300"
          />

          {/* Zone Dividers */}
          <line x1="160" y1="20" x2="160" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="320" y1="20" x2="320" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Labels for Regions */}
          <text x="105" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeZone === 'infant' ? '#ef4444' : '#64748b'}>
            Zone I: Infant Mortality (DFR)
          </text>
          <text x="240" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeZone === 'random' ? '#2563eb' : '#64748b'}>
            Zone II: Useful Life (CFR)
          </text>
          <text x="390" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill={activeZone === 'wearout' ? '#ca8a04' : '#64748b'}>
            Zone III: Wear-Out (IFR)
          </text>

          {/* The Classic Bathtub Curve Path */}
          <path
            d="M 55 45 C 80 120, 130 135, 165 135 L 315 135 C 350 135, 410 115, 445 45"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Live Position Marker */}
          <circle
            cx={markerX}
            cy={markerY}
            r="8"
            fill={activeZone === 'infant' ? '#ef4444' : activeZone === 'random' ? '#2563eb' : '#ca8a04'}
            stroke="#ffffff"
            strokeWidth="2.5"
            className="transition-all duration-200 shadow-lg"
          />
          <circle
            cx={markerX}
            cy={markerY}
            r="16"
            fill="none"
            stroke={activeZone === 'infant' ? '#ef4444' : activeZone === 'random' ? '#2563eb' : '#ca8a04'}
            strokeWidth="1.5"
            className="animate-ping opacity-60"
          />

          {/* Axis Labels */}
          <text x="25" y="85" textAnchor="middle" fontSize="9" fill="#94a3b8" transform="rotate(-90 25 85)">
            Failure Rate λ(t)
          </text>
          <text x="250" y="158" textAnchor="middle" fontSize="10" fill="#94a3b8">
            Operating Life / Accumulated Cycles (t) →
          </text>
        </svg>

        {/* Interactive Scrubbing Slider */}
        {interactive && (
          <div className="mt-3 px-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Drag to test physical regimes:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                Simulated <InlineMath math="\beta" /> = {beta.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="4.0"
              step="0.05"
              value={beta}
              onChange={(e) => setScrubbedBeta(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.3 (Quality / Burn-in)</span>
              <span>1.0 (Random Stress)</span>
              <span>2.5 (Mechanical Fatigue)</span>
              <span>4.0 (Rapid Aging)</span>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Maintenance Diagnosis */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Infant Mortality Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeZone === 'infant'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 ring-2 ring-red-400/40'
              : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-red-700 dark:text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Infant Mortality (<InlineMath math="\beta < 1" />)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Failure rate drops over time (DFR). Dominated by manufacturer defects, assembly misalignment, or poor commissioning.
          </p>
          <div className="mt-2 text-[11px] font-semibold text-red-800 dark:text-red-300 bg-red-100/60 dark:bg-red-900/40 p-1.5 rounded">
            Strategy: Burn-in screening, QA audits, commissioning checklists. <strong>Do NOT do time-based overhaul.</strong>
          </div>
        </div>

        {/* Useful Life Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeZone === 'random'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-2 ring-blue-400/40'
              : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Random Failures (<InlineMath math="\beta \approx 1" />)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Constant failure rate (CFR / Exponential). Equipment has no memory of age. Failures triggered by external shocks, operator error, or weather.
          </p>
          <div className="mt-2 text-[11px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 p-1.5 rounded">
            Strategy: <strong>Condition-Based Monitoring (CBM/PdM) only.</strong> Scheduled component replacement causes infant mortality.
          </div>
        </div>

        {/* Wear-Out Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeZone === 'wearout'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 ring-2 ring-amber-400/40'
              : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Wrench className="w-4 h-4" />
            <span>Wear-Out Zone (<InlineMath math="\beta > 1" />)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Increasing failure rate (IFR). Dominated by cumulative fatigue, corrosion, erosion, and friction degradation.
          </p>
          <div className="mt-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-900/40 p-1.5 rounded">
            Strategy: <strong>Preventive replacement IS effective!</strong> Schedule overhaul at <InlineMath math="B_{10}" /> life threshold to avoid functional failure.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BathtubVisualizer;
