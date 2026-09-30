import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Activity, Eye, Zap, Volume2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface DegradationVisualizerProps {
  pfIntervalHours: number;
  inspectionIntervalHours: number;
  technologyName: string;
  leadTimeHours?: number;
}

export const DegradationTimelineVisualizer: React.FC<DegradationVisualizerProps> = ({
  pfIntervalHours,
  inspectionIntervalHours,
  technologyName,
  leadTimeHours = 72,
}) => {
  const [progress, setProgress] = useState<number>(15); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: any;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return Math.min(100, prev + 0.75);
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Stage classification based on P-F physics
  const getStageInfo = (pct: number) => {
    if (pct < 25) {
      return {
        stage: "Stage 0: Incipient Operation (Healthy)",
        color: "text-emerald-500",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        desc: "Hydrodynamic lubrication film intact. Background vibration baseline normal. No detectable subsurface fatigue.",
        sensorStatus: "All sensors nominal",
        severity: "normal",
      };
    } else if (pct < 50) {
      return {
        stage: "Stage 1: Potential Failure (P) - Subsurface Microcracks",
        color: "text-blue-500",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
        desc: `Stress wave emissions initiate (~20-40 kHz). Detectable ONLY via High-Frequency Ultrasound (${technologyName}) or Oil Ferrography. Machine sounds completely normal to human senses.`,
        sensorStatus: "Ultrasonic / High Frequency Alert",
        severity: "p-detected",
      };
    } else if (pct < 75) {
      return {
        stage: "Stage 2: Micro-Spall Progression & Harmonic Vibration",
        color: "text-amber-500",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        desc: "Flaking/spalling spreads to bearing raceway. 1X, 2X harmonic and BPFO/BPFI defect frequencies spike on FFT vibration spectrum.",
        sensorStatus: "Vibration FFT Velocity / Acceleration High",
        severity: "warning",
      };
    } else if (pct < 90) {
      return {
        stage: "Stage 3: Thermal Dissipation & Metallic Wear",
        color: "text-orange-500",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
        desc: "High friction causes localized temperature spike (>15°C above baseline). Infrared thermography flags hotspot; oil analysis shows ferrous particulate >25µm.",
        sensorStatus: "Thermal / Oil Particle High",
        severity: "danger",
      };
    } else {
      return {
        stage: "Stage 4: Imminent Functional Failure (F)",
        color: "text-rose-600",
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
        desc: "Audible screeching, heavy thermal smoking, shaft looseness, and catastrophic mechanical seizure within hours. Immediate emergency trip required.",
        sensorStatus: "Audible Screech / Catastrophic Alarm",
        severity: "critical",
      };
    }
  };

  const currentStage = getStageInfo(progress);

  // Safety inspection calculation
  const safeThresholdHours = pfIntervalHours / 2;
  const isInspectionAdequate = inspectionIntervalHours <= safeThresholdHours;
  const isDangerous = inspectionIntervalHours > pfIntervalHours;

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Background ambient glow based on severity */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          progress < 25
            ? "bg-emerald-500"
            : progress < 50
            ? "bg-blue-500"
            : progress < 75
            ? "bg-amber-500"
            : "bg-rose-600"
        }`}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Physics-Informed P-F Degradation Digital Twin
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Interactive Simulator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate bearing/shaft physical wear trajectory against PdM inspection cycles in real time.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play Degradation
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Reset to 0% degradation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Physical Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center relative z-10">
        {/* Animated Bearing / Shaft SVG */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/80 border border-slate-800/90 relative">
          <svg viewBox="0 0 240 240" className="w-52 h-52">
            {/* Outer Ring */}
            <circle
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#334155"
              strokeWidth="14"
            />
            {/* Inner Ring */}
            <circle
              cx="120"
              cy="120"
              r="55"
              fill="#0f172a"
              stroke="#475569"
              strokeWidth="12"
            />

            {/* Rotating Center Shaft with speed modulated by health */}
            <g
              style={{
                transformOrigin: '120px 120px',
                animation: `spin ${progress > 90 ? '0.8s' : '0.4s'} linear infinite`,
              }}
            >
              <line x1="120" y1="90" x2="120" y2="150" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <line x1="90" y1="120" x2="150" y2="120" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Rolling Elements (Balls) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 120 + 80 * Math.cos(rad);
              const cy = 120 + 80 * Math.sin(rad);

              // Defect on ball 2 and 6 if progress > 25
              const hasDefect = (i === 1 || i === 5) && progress >= 25;
              const severeDefect = (i === 1 || i === 5) && progress >= 75;

              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="15"
                    fill={severeDefect ? "#ea580c" : hasDefect ? "#0284c7" : "#cbd5e1"}
                    stroke={severeDefect ? "#ef4444" : hasDefect ? "#38bdf8" : "#94a3b8"}
                    strokeWidth="2.5"
                  />
                  {/* Micro-defect crack mark */}
                  {hasDefect && (
                    <path
                      d={`M ${cx - 5} ${cy - 5} L ${cx + 5} ${cy + 5} M ${cx - 5} ${cy + 5} L ${cx + 5} ${cy - 5}`}
                      stroke={severeDefect ? "#ffffff" : "#0f172a"}
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            {/* Ultrasonic Pulse Waves (Stage 1 & above) */}
            {progress >= 25 && progress < 55 && (
              <circle
                cx="120"
                cy="120"
                r="115"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 6"
                className="animate-ping opacity-60"
              />
            )}

            {/* Thermal / IR Hotspot Glow (Stage 3 & above) */}
            {progress >= 70 && (
              <circle
                cx="120"
                cy="120"
                r="70"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                className="animate-pulse opacity-70"
              />
            )}
          </svg>

          {/* Machine Condition Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                progress < 25
                  ? "bg-emerald-500 animate-pulse"
                  : progress < 50
                  ? "bg-blue-400 animate-ping"
                  : progress < 75
                  ? "bg-amber-400 animate-bounce"
                  : "bg-rose-500 animate-ping"
              }`}
            />
            <span className="text-xs font-mono font-medium text-slate-300">
              {progress < 25
                ? "Physical State: Baseline Stable"
                : progress < 50
                ? "Physical State: Subsurface Shear Failure (P)"
                : progress < 75
                ? "Physical State: Active Raceway Micro-Spalling"
                : progress < 90
                ? "Physical State: Severe Thermal Friction Degradation"
                : "Physical State: Catastrophic Breakdown (F)"}
            </span>
          </div>
        </div>

        {/* Dynamic Telemetry & Diagnostic Information */}
        <div className="lg:col-span-7 space-y-4">
          {/* Stage Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${currentStage.badge}`}>
                {currentStage.stage}
              </span>
              <span className="font-mono text-xs text-slate-400">
                Operating Life Elapsed: <strong className="text-white">{progress.toFixed(0)}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage.desc}
            </p>
          </div>

          {/* Sensor Detection Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            {/* Ultrasonic */}
            <div
              className={`p-2.5 rounded-lg border transition ${
                progress >= 25
                  ? "bg-blue-950/40 border-blue-500 text-blue-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-600"
              }`}
            >
              <Zap className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold text-[11px]">Ultrasound</div>
              <div className="text-[10px] opacity-80">{progress >= 25 ? "DETECTED" : "Nominal"}</div>
            </div>

            {/* Vibration FFT */}
            <div
              className={`p-2.5 rounded-lg border transition ${
                progress >= 50
                  ? "bg-amber-950/40 border-amber-500 text-amber-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-600"
              }`}
            >
              <Activity className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold text-[11px]">Vibration FFT</div>
              <div className="text-[10px] opacity-80">{progress >= 50 ? "PEAK ALARM" : "Nominal"}</div>
            </div>

            {/* Thermal / IR */}
            <div
              className={`p-2.5 rounded-lg border transition ${
                progress >= 70
                  ? "bg-orange-950/40 border-orange-500 text-orange-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-600"
              }`}
            >
              <Flame className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold text-[11px]">Thermal IR</div>
              <div className="text-[10px] opacity-80">{progress >= 70 ? "+18°C HOT" : "Nominal"}</div>
            </div>

            {/* Human Senses */}
            <div
              className={`p-2.5 rounded-lg border transition ${
                progress >= 88
                  ? "bg-rose-950/40 border-rose-500 text-rose-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-600"
              }`}
            >
              <Volume2 className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold text-[11px]">Audible Noise</div>
              <div className="text-[10px] opacity-80">{progress >= 88 ? "SCREECHING" : "Silent"}</div>
            </div>
          </div>

          {/* Interactive Degradation Scrubber Slider */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
              <span>Healthy (0%)</span>
              <span className="text-blue-400 font-semibold">P: Initial Defect (25%)</span>
              <span className="text-amber-400 font-semibold">Vibration Alarm (50%)</span>
              <span className="text-rose-400 font-semibold">F: Seizure (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={progress}
              onChange={(e) => {
                setIsPlaying(false);
                setProgress(parseFloat(e.target.value));
              }}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition"
            />
          </div>

          {/* Inspection Interval & Blind-Spot Protection Verdict */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDangerous
                ? "bg-rose-950/40 border-rose-800 text-rose-200"
                : isInspectionAdequate
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                : "bg-amber-950/40 border-amber-800 text-amber-200"
            }`}
          >
            {isDangerous ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            ) : isInspectionAdequate ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Eye className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-bold">
                {isDangerous
                  ? "CRITICAL BLIND-SPOT RISK: "
                  : isInspectionAdequate
                  ? "OPTIMAL PdM PROTECTION: "
                  : "MARGINAL COVERAGE: "}
              </span>
              {isDangerous ? (
                <span>
                  Inspection interval ({inspectionIntervalHours}h) exceeds the P-F curve ({pfIntervalHours}h). The machine can degrade from onset to catastrophic shutdown without being detected on a route.
                </span>
              ) : isInspectionAdequate ? (
                <span>
                  Inspection interval ({inspectionIntervalHours}h) $\le (P-F)/2$ ({safeThresholdHours}h). Guaranteed at least 1-2 route detections before functional failure with {leadTimeHours}h planning lead time.
                </span>
              ) : (
                <span>
                  Inspection interval ({inspectionIntervalHours}h) is between $(P-F)/2$ and $(P-F)$. You will detect the failure, but planning lead-time for parts and crew will be constrained.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegradationTimelineVisualizer;
