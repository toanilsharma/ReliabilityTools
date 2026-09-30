import React, { useState, useEffect } from 'react';
import { Play, Pause, AlertOctagon, CheckCircle2, Gauge, Activity, Award } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

interface ConveyorOeeVisualizerProps {
  availability: number; // 0 to 1
  performance: number;  // 0 to 1
  quality: number;      // 0 to 1
  oee: number;          // 0 to 1
  totalCount?: number;
  rejects?: number;
}

export const ConveyorOeeVisualizer: React.FC<ConveyorOeeVisualizerProps> = ({
  availability,
  performance,
  quality,
  oee,
  totalCount = 350,
  rejects = 10,
}) => {
  const safeAvail = Number.isFinite(availability) ? availability : 0;
  const safePerf = Number.isFinite(performance) ? performance : 0;
  const safeQual = Number.isFinite(quality) ? quality : 0;
  const safeOee = Number.isFinite(oee) ? oee : 0;

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [parts, setParts] = useState<Array<{ id: number; x: number; isDefective: boolean }>>([
    { id: 1, x: 15, isDefective: false },
    { id: 2, x: 35, isDefective: false },
    { id: 3, x: 55, isDefective: true },
    { id: 4, x: 75, isDefective: false },
    { id: 5, x: 95, isDefective: false },
  ]);

  // Adjust animation speed based on performance (0.5x to 2.5x)
  const speed = Math.max(0.3, Math.min(2.5, safePerf * 1.5));

  useEffect(() => {
    if (!isRunning || safeAvail < 0.1) return;

    const interval = setInterval(() => {
      setParts((prevParts) =>
        prevParts.map((part) => {
          let newX = part.x + 1.2 * speed;
          if (newX > 105) {
            // Respawn at beginning with random defect chance based on 1 - quality
            const defectChance = Math.max(0, 1 - safeQual);
            return {
              id: Date.now() + Math.random(),
              x: 0,
              isDefective: Math.random() < defectChance,
            };
          }
          return { ...part, x: newX };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isRunning, safeAvail, safeQual, speed]);

  const isWorldClass = safeOee >= 0.85;
  const isHealthy = safeOee >= 0.65;

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-xl text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          isWorldClass ? 'bg-emerald-500' : isHealthy ? 'bg-amber-500' : 'bg-rose-500'
        }`}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Production Line Digital Twin & Throughput Simulator
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
              60 FPS Physics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time simulation of part transit, line stoppages, speed deviations, and optical scrap rejection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Line
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Line
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Conveyor Belt Display Canvas */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative select-none">
        {/* Three Plant Stations Labels */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center justify-center gap-1.5 text-blue-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Station 1: Uptime ({Math.round(safeAvail * 100)}%)
          </div>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
            <Gauge className="w-3.5 h-3.5" />
            Station 2: Cadence ({Math.round(safePerf * 100)}%)
          </div>
          <div className="flex items-center justify-center gap-1.5 text-purple-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Station 3: Quality ({Math.round(safeQual * 100)}%)
          </div>
        </div>

        {/* SVG Animated Conveyor Track */}
        <div className="relative h-28 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center">
          {/* Laser Scanner Beam at 75% for Quality Inspection */}
          <div className="absolute top-0 bottom-0 left-[75%] w-1 bg-purple-500/80 shadow-[0_0_12px_#c084fc] z-20 pointer-events-none animate-pulse" />
          <div className="absolute top-1 left-[76%] text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider z-20">
            Vision QC Scan
          </div>

          {/* Scrap Bin at bottom right */}
          <div className="absolute bottom-1 right-4 p-1.5 bg-rose-950/60 border border-rose-800 rounded text-[10px] text-rose-300 font-mono z-10 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-rose-500" />
            <span>Scrap Bin: {rejects} units</span>
          </div>

          {/* Rollers along the conveyor */}
          <div className="absolute bottom-2 left-0 right-0 h-4 flex justify-between px-4 opacity-40">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-slate-400 bg-slate-700 animate-spin"
                style={{ animationDuration: `${0.8 / speed}s` }}
              />
            ))}
          </div>

          {/* Conveyor Belt Surface Track */}
          <div className="absolute bottom-6 left-0 right-0 h-2 bg-slate-700 border-y border-slate-600" />

          {/* Moving Parts */}
          {parts.map((part) => {
            // If defective and passed scanner (x > 75%), animate falling into scrap bin
            const isFallingToScrap = part.isDefective && part.x > 75;
            const topPos = isFallingToScrap ? Math.min(65, 24 + (part.x - 75) * 1.5) : 24;
            const opacity = isFallingToScrap && part.x > 90 ? 0.3 : 1;

            return (
              <div
                key={part.id}
                className="absolute transition-all duration-75 flex flex-col items-center"
                style={{
                  left: `${part.x}%`,
                  top: `${topPos}px`,
                  opacity,
                }}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shadow-md transition-colors ${
                    part.isDefective
                      ? 'bg-rose-600 text-white border-2 border-rose-400 animate-pulse'
                      : 'bg-emerald-500 text-slate-950 border-2 border-emerald-300'
                  }`}
                >
                  {part.isDefective ? '✕' : '✓'}
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">
                  {part.isDefective ? 'REJECT' : 'GOOD'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Real-time Status Telemetry */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Line State</span>
            <span className={`text-xs font-bold font-mono mt-0.5 block ${isRunning && availability > 0.1 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isRunning && availability > 0.1 ? '🟢 ACTIVE RUNNING' : '🔴 DOWNTIME STOP'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Feed Velocity</span>
            <span className="text-xs font-bold font-mono text-amber-300 mt-0.5 block">
              {(speed * 60).toFixed(0)} units/min
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">First-Pass Yield</span>
            <span className="text-xs font-bold font-mono text-purple-300 mt-0.5 block">
              <AnimatedNumber value={quality * 100} decimals={1} suffix="%" />
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Net OEE</span>
            <span className={`text-xs font-black font-mono mt-0.5 block ${isWorldClass ? 'text-emerald-400' : isHealthy ? 'text-amber-400' : 'text-rose-400'}`}>
              <AnimatedNumber value={oee * 100} decimals={1} suffix="%" />
            </span>
          </div>
        </div>
      </div>

      {/* World-Class Manufacturing Benchmark Barometer */}
      <div className="mt-4 p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs">
          <Award className={`w-5 h-5 flex-shrink-0 ${isWorldClass ? 'text-emerald-400' : 'text-slate-500'}`} />
          <div>
            <span className="font-bold text-white">
              {isWorldClass
                ? '🏆 World-Class Benchmark Achieved (OEE ≥ 85%)'
                : isHealthy
                ? '⚙️ Typical Industrial Performance (60% ≤ OEE < 85%)'
                : '⚠️ Urgent Opportunity Area (OEE < 60%)'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isWorldClass
                ? 'Your production line is operating in the top decile of global discrete manufacturing.'
                : isHealthy
                ? 'Substantial capacity trapped in minor stops and changeover idle periods. Apply SMED to recover hidden uptime.'
                : 'Over 40% of plant capital capacity is lost to unplanned downtime or excessive scrap. Targeted RCFA required.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConveyorOeeVisualizer;
