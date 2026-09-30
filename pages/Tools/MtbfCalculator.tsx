import React, { useState } from "react";
import { calculateMTBF } from "../../services/reliabilityMath";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { motion } from "framer-motion";
import {
  Clock,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  Table,
  BarChart,
  Target,
  TrendingUp,
  Activity,
  Calculator,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import HelpTooltip from "../../components/HelpTooltip";
import { ASSET_BENCHMARKS } from "../../constants";
import ToolContentLayout from "../../components/ToolContentLayout";
import RelatedTools from "../../components/RelatedTools";
// Removed unused ShareResult import
import { useRecentTools } from "../../hooks/useRecentTools";
import { useLocation, Link } from "react-router-dom";
// Removed unused useReactToPrint import
import { useShareableState } from "../../hooks/useShareableState";
import ShareAndExport from "../../components/ShareAndExport";
import AnimatedNumber from "../../components/AnimatedNumber";
import CalculationProofDrawer from "../../components/CalculationProofDrawer";
import { useRef } from "react";
import AnimatedContainer from "../../components/AnimatedContainer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import TheoryBlock from "../../components/TheoryBlock";
import { BathtubCurveDiagram, AvailabilityTimeline } from "../../components/TheoryVisuals";
import { trackToolCalculation } from "../../utils/analytics";

// Chi-Square and Normal Quantile Functions for Reliability Confidence Bounds
function normInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  const isUpper = p > 0.5;
  const q = isUpper ? 1 - p : p;
  const t = Math.sqrt(-2 * Math.log(q));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;
  const num = c0 + (c1 + c2 * t) * t;
  const den = 1 + ((d1 + d2 * t) * t + d3 * t * t) * t;
  const z = t - num / den;
  return isUpper ? z : -z;
}

function chiSquareInv(p: number, df: number): number {
  if (df <= 0) return 0;
  if (df === 2) return -2 * Math.log(Math.max(1e-12, 1 - p));
  const z = normInv(p);
  const factor = 2 / (9 * df);
  const term = 1 - factor + z * Math.sqrt(factor);
  return df * Math.pow(Math.max(0, term), 3);
}

interface MtbfState {
  mode: "MTBF" | "MTTF";
  totalHours: string;
  failures: string;
  result: number | null;
}

const MtbfCalculator: React.FC = () => {
  const [state, setState, shareUrl] = useShareableState<MtbfState>({
    mode: "MTBF",
    totalHours: "8760",
    failures: "4",
    result: 2190,
  });

  const { mode, totalHours, failures, result } = state;
  
  // Statistical Confidence and Sensitivity States
  const [confidenceLevel, setConfidenceLevel] = useState<90 | 95 | 99>(90);
  const [testType, setTestType] = useState<'time' | 'failure'>('time');
  const [missionHours, setMissionHours] = useState<number>(1000);
  const [stressFactor, setStressFactor] = useState<number>(0);
  const [mttrHours, setMttrHours] = useState<number>(4);

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ hours?: string; failures?: string }>({});
  
  const { addRecentTool } = useRecentTools();
  const location = useLocation();
  const toolRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Log tool visit
    addRecentTool({
        id: 'mtbf',
        name: 'MTBF Calculator',
        path: '/tools/mtbf/'
    });

    // Parse legacy URL params for sharing (if any)
    const searchParams = new URLSearchParams(location.search);
    const h = searchParams.get('hours');
    const f = searchParams.get('failures');
    
    if (h || f) {
        setState(s => {
          const newState = { ...s };
          if (h) newState.totalHours = h;
          if (f) newState.failures = f;
          if (h && f && !isNaN(parseFloat(h)) && !isNaN(parseFloat(f))) {
             newState.result = calculateMTBF(parseFloat(h), parseFloat(f));
          }
          return newState;
        });
    }
  }, [location.search]);

  const validateInputs = (): boolean => {
    const newErrors: { hours?: string; failures?: string } = {};
    let isValid = true;
    const h = parseFloat(totalHours);
    if (!totalHours || isNaN(h)) {
      newErrors.hours = "Please enter a valid number.";
      isValid = false;
    } else if (h < 0) {
      newErrors.hours = "Operational time cannot be negative.";
      isValid = false;
    }

    const f = parseFloat(failures);
    if (!failures || isNaN(f)) {
      newErrors.failures = "Please enter a valid number.";
      isValid = false;
    } else if (f < 0) {
      newErrors.failures = "Count cannot be negative.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setState(s => ({ ...s, result: calculateMTBF(parseFloat(s.totalHours), parseFloat(s.failures)) }));
      trackToolCalculation('MTBF / MTTF Calculator', 'mtbf');
    } else {
      setState(s => ({ ...s, result: null }));
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`${mode}: ${result.toFixed(2)} Hours`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = [
      '# MTBF / MTTF Calculation & Equipment Failure Log Template (ISO 14224 Compliant)',
      '# Generated from https://reliabilitytools.co.in/tools/mtbf/',
      '',
      'Asset Tag,Asset Name,Operating Hours,Failures Count,MTBF (Hours),Failure Rate (Failures/Hr),Annual Failures,Standard Reference',
      `TAG-001,Main Plant Equipment,${totalHours || 8760},${failures || 2},${result ? result.toFixed(1) : 4380},${result ? (1/result).toExponential(4) : (2/8760).toExponential(4)},${result ? (8760/result).toFixed(2) : '2.00'},ISO 14224`,
      '',
      '# Failure Incident Log Sheet',
      'Incident ID,Date,Failure Mode,Component Affected,Operating Hours at Failure,Repair Duration (MTTR hrs),Root Cause,Action Taken',
      'INC-001,2026-01-15,Bearing Overheat,Drive End Bearing,4200,3.5,Lubrication breakdown,Replaced bearing & replenished grease',
      'INC-002,2026-06-20,Seal Leakage,Mechanical Seal,7850,2.0,Face wear,Replaced mechanical seal face'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTBF_Calculation_Log_${mode}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const generateLookupTable = () => {
    const basis = 8760;
    return [0.5, 1, 2, 4, 12, 52].map((f) => ({
      failures: f,
      mtbf: basis / f,
      period:
        f <= 1
          ? `Every ${Math.round(1 / f)} Years`
          : f === 12
            ? "Monthly"
            : f === 52
              ? "Weekly"
              : f === 4
                ? "Quarterly"
                : `${f} per Year`,
    }));
  };
  const lookupData = generateLookupTable();

  const opTime = Math.max(1, parseFloat(totalHours) || 8760);
  const failCount = Math.max(0, parseFloat(failures) || 0);
  const alpha = (100 - confidenceLevel) / 100;
  
  // Degrees of freedom for Chi-Square:
  // Time-truncated (Type I): Lower bound df = 2r + 2, Upper bound df = 2r
  // Failure-truncated (Type II): Lower bound df = 2r, Upper bound df = 2r
  const lowerDf = testType === 'time' ? 2 * failCount + 2 : 2 * failCount;
  const upperDf = 2 * failCount;

  const chi2Lower = chiSquareInv(1 - alpha / 2, lowerDf);
  const chi2Upper = upperDf > 0 ? chiSquareInv(alpha / 2, upperDf) : 0;

  const mtbfLowerBound = chi2Lower > 0 ? (2 * opTime) / chi2Lower : 0;
  const mtbfUpperBound = chi2Upper > 0 ? (2 * opTime) / chi2Upper : Infinity;

  // Sensitivity Model
  const effectiveLambda = result && result > 0 ? (1 / result) * (1 + stressFactor / 100) : 0;
  const effectiveMtbf = effectiveLambda > 0 ? 1 / effectiveLambda : 0;
  const survivalProb = effectiveMtbf > 0 ? Math.exp(-missionHours / effectiveMtbf) : 0;
  const lowerSurvivalProb = mtbfLowerBound > 0 ? Math.exp(-missionHours / mtbfLowerBound) : 0;
  const upperSurvivalProb = isFinite(mtbfUpperBound) && mtbfUpperBound > 0 ? Math.exp(-missionHours / mtbfUpperBound) : 1;
  const inherentAvailability = effectiveMtbf > 0 ? (effectiveMtbf / (effectiveMtbf + mttrHours)) * 100 : 0;

  // --- Tool Component ---
  const ToolComponent = (
    <div className="grid md:grid-cols-2 gap-8" ref={toolRef}>
      <AnimatedContainer animation="slideUp" delay={0.1} className="space-y-6">
        {/* Toggle Calculation Mode */}
        <div className="bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl inline-flex w-full sm:w-auto border border-slate-205 dark:border-slate-800 relative shadow-inner">
          <button
            type="button"
            onClick={() => setState(s => ({ ...s, mode: "MTBF" }))}
            className={`relative z-10 flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-black transition-colors duration-300 ${mode === "MTBF" ? "text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"}`}
          >
            {mode === "MTBF" && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl -z-10 shadow-md shadow-cyan-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            MTBF (Repairable)
          </button>
          <button
            type="button"
            onClick={() => setState(s => ({ ...s, mode: "MTTF" }))}
            className={`relative z-10 flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-black transition-colors duration-300 ${mode === "MTTF" ? "text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"}`}
          >
            {mode === "MTTF" && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-xl -z-10 shadow-md shadow-violet-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            MTTF (Non-Repairable)
          </button>
        </div>

        {/* Equipment Benchmark Presets */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> Equipment Benchmark Presets
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click to test real-world defaults</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Centrifugal Pump", hours: "8760", failures: "3", desc: "~2,920 hrs" },
              { name: "Electric Motor 45kW", hours: "43800", failures: "1", desc: "~43,800 hrs" },
              { name: "Screw Compressor", hours: "24000", failures: "2", desc: "~12,000 hrs" },
              { name: "CNC Spindle", hours: "8500", failures: "1", desc: "~8,500 hrs" },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setState(s => ({
                    ...s,
                    totalHours: p.hours,
                    failures: p.failures,
                    result: calculateMTBF(parseFloat(p.hours), parseFloat(p.failures))
                  }));
                  setErrors({});
                }}
                className="px-2.5 py-2 rounded-lg text-left text-xs bg-white dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 transition-all flex flex-col justify-center"
              >
                <span className="font-bold truncate">{p.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Operational Time (Hours)
              <HelpTooltip text="Sum of runtime for all units. (e.g. 10 motors * 1000 hours = 10,000 unit-hours)" />
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                value={totalHours}
                onChange={(e) => setState(s => ({ ...s, totalHours: e.target.value }))}
                placeholder="e.g., 8760"
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-4 pr-16 py-3 text-slate-900 dark:text-white focus:ring-2 ${mode === 'MTBF' ? 'focus:ring-cyan-500' : 'focus:ring-violet-500'} focus:border-transparent outline-none transition-colors ${errors.hours ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">hours</span>
              </div>
            </div>
            {errors.hours && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.hours}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {mode === "MTBF"
                ? "Number of Failures"
                : "Number of Failed Units"}
              <HelpTooltip
                text={
                  mode === "MTBF"
                    ? "Total breakdown events."
                    : "Total items discarded."
                }
              />
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                value={failures}
                onChange={(e) => setState(s => ({ ...s, failures: e.target.value }))}
                placeholder="e.g., 5"
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-4 pr-16 py-3 text-slate-900 dark:text-white focus:ring-2 ${mode === 'MTBF' ? 'focus:ring-cyan-500' : 'focus:ring-violet-500'} focus:border-transparent outline-none transition-colors ${errors.failures ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {mode === "MTBF" ? "failures" : "units"}
                </span>
              </div>
            </div>
            {errors.failures && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.failures}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${mode === "MTBF" ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20 hover:shadow-cyan-500/30" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-500/20 hover:shadow-violet-500/30"}`}
          >
            <Clock className="w-5 h-5 animate-pulse" /> Calculate {mode}
          </button>
        </form>

        {result !== null && (
          <div className="space-y-4">
            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 ${mode === "MTBF" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-gradient-to-r from-violet-500 to-fuchsia-600"}`}></div>
              
              <AnimatedContainer 
                animation="scaleUp" 
                delay={0.1} 
                className={`relative border rounded-2xl p-6 shadow-xl bg-white dark:bg-slate-900 ${mode === "MTBF" ? "border-cyan-500/25 dark:border-cyan-500/35" : "border-violet-500/25 dark:border-violet-500/35"}`}
              >
                <button
                  onClick={handleCopy}
                  className={`absolute top-4 right-4 transition-colors ${mode === "MTBF" ? "text-slate-400 hover:text-cyan-500" : "text-slate-400 hover:text-violet-500"}`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${mode === "MTBF" ? "bg-cyan-100 dark:bg-cyan-950/55 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900" : "bg-violet-100 dark:bg-violet-950/55 text-violet-705 dark:text-violet-300 border border-violet-200 dark:border-violet-900"}`}>
                    {mode === "MTBF" ? "🛠️ Repairable System" : "🛑 Non-Repairable Asset"}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                  Point Estimate Mean Time ({mode})
                </div>
                
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                  <AnimatedNumber value={result} decimals={1} />{" "}
                  <span className="text-lg text-slate-550 dark:text-slate-450 font-normal">hours</span>
                </div>

                {/* Detailed failure metrics grid */}
                <div className="grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-left">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Failures / Hour</div>
                    <div className={`text-xs font-black mt-0.5 truncate ${mode === "MTBF" ? "text-cyan-600 dark:text-cyan-400" : "text-violet-650 dark:text-violet-400"}`}>
                      {(1 / result).toExponential(3)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Failures / Year</div>
                    <div className={`text-xs font-black mt-0.5 ${mode === "MTBF" ? "text-cyan-600 dark:text-cyan-400" : "text-violet-650 dark:text-violet-400"}`}>
                      <AnimatedNumber value={8760 / result} decimals={2} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Failure Rate (FPMH)</div>
                    <div className={`text-xs font-black mt-0.5 ${mode === "MTBF" ? "text-cyan-600 dark:text-cyan-400" : "text-violet-650 dark:text-violet-400"}`}>
                      <AnimatedNumber value={1000000 / result} decimals={1} />
                    </div>
                  </div>
                </div>

                {/* Excel Template Download */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-emerald-500/10"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Download Free MTBF Excel / CSV Template (.csv)
                  </button>
                </div>
              </AnimatedContainer>
            </div>

            {/* Chi-Square Confidence Limits Card */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Chi-Square (&chi;&sup2;) Confidence Bounds
                  </span>
                </div>
                
                {/* Confidence Level Pill Selector */}
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 text-xs font-bold">
                  {([90, 95, 99] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidenceLevel(lvl)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        confidenceLevel === lvl
                          ? 'bg-cyan-500 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lvl}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Truncation Type Selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Test Censoring Protocol:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTestType('time')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                      testType === 'time'
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 text-cyan-700 dark:text-cyan-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    Time-Truncated (Field)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestType('failure')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                      testType === 'failure'
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 text-cyan-700 dark:text-cyan-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    Failure-Truncated (Bench)
                  </button>
                </div>
              </div>

              {/* 3-Way Confidence Display */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                    Lower Limit ({confidenceLevel}%)
                  </span>
                  <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                    {Math.round(mtbfLowerBound).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">hrs</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Guaranteed min</span>
                </div>

                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <span className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-300 block">
                    Point Estimate
                  </span>
                  <div className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                    {Math.round(result).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">hrs</span>
                  </div>
                  <span className="text-[9px] text-slate-400">T / r</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                    Upper Limit ({confidenceLevel}%)
                  </span>
                  <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                    {isFinite(mtbfUpperBound) ? `${Math.round(mtbfUpperBound).toLocaleString()} hrs` : '&infin;'}
                  </div>
                  <span className="text-[9px] text-slate-400">Optimistic max</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center font-mono">
                Degrees of freedom: &nu;_L = {lowerDf}, &nu;_U = {upperDf} &bull; &chi;&sup2; critical: [{chi2Upper.toFixed(2)}, {chi2Lower.toFixed(2)}]
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>

      <AnimatedContainer animation="slideUp" delay={0.2} className="space-y-6">
        {/* Formula Box - Live Math Rendering */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <RotateCcw className={`w-4 h-4 ${mode === 'MTBF' ? 'text-cyan-600' : 'text-violet-605'}`} /> Live Equation
            <HelpTooltip text="Mathematical representation of the current inputs. Updates automatically as you type." />
          </h3>
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
             <BlockMath math={`\\text{${mode}} = \\frac{\\text{Total Time}}{\\text{Failures}} = \\frac{${totalHours || 'T'}}{${failures || 'F'}} ${result ? `= \\mathbf{${result.toLocaleString(undefined, { maximumFractionDigits: 1 })}}` : ''}`} />
          </div>
        </div>

        {/* MTBF vs Failure Rate Trend Graph */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-64 flex flex-col">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <TrendingUp className={`w-4 h-4 ${mode === 'MTBF' ? 'text-cyan-600' : 'text-violet-605'}`} /> {mode} vs Failure Frequency (Basis: 1 Yr / 8760 Hr)
            <HelpTooltip text="Shows how rapidly MTBF degrades as breakdowns become more frequent. Notice the non-linear relationship." />
          </h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lookupData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="mtbf" stroke={mode === 'MTBF' ? '#06b6d4' : '#8b5cf6'} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: mode === 'MTBF' ? '#22d3ee' : '#c084fc' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value: number) => [`${Math.round(value).toLocaleString()} Hours`, mode]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <BarChart className={`w-4 h-4 ${mode === 'MTBF' ? 'text-cyan-600' : 'text-violet-605'}`} /> Industry Benchmarks (IEEE 493)
          </h3>
          <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Asset Type</th>
                  <th className="px-4 py-2.5 text-right font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Typical Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-700/40">
                {Object.entries(ASSET_BENCHMARKS)
                  .slice(0, 3)
                  .map(([asset, data]) => (
                    <tr key={asset} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                      <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">{asset}</td>
                      <td className={`px-4 py-2.5 text-right font-extrabold ${mode === 'MTBF' ? 'text-cyan-600 dark:text-cyan-400' : 'text-violet-650 dark:text-violet-400'}`}>
                        {data.range}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContainer>

      {/* Interactive Sensitivity Sliders & Survival Modeling */}
      {result !== null && (
        <AnimatedContainer animation="slideUp" delay={0.25} className="md:col-span-2">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                  Operational Sensitivity & What-If Simulation
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Mission Survival Probability & Line Availability
                </h4>
              </div>
              <span className="text-xs text-slate-500">
                Simulate stress variations and mission horizons
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Slider 1: Mission Time */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Target Mission Time (t):
                  </label>
                  <span className="font-black font-mono text-cyan-600 dark:text-cyan-400 text-sm">
                    {missionHours.toLocaleString()} hrs ({ (missionHours / 24).toFixed(1) } days)
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={missionHours}
                  onChange={(e) => setMissionHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                
                {/* Survival Probability Gauge */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Survival Probability R({missionHours}h):</span>
                    <span className="font-black font-mono text-emerald-500 text-sm">
                      {(survivalProb * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, survivalProb * 100))}%` }} 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Lower 90%: {(lowerSurvivalProb * 100).toFixed(1)}%</span>
                    <span>Failure Risk F(t): {((1 - survivalProb) * 100).toFixed(2)}%</span>
                    <span>Upper 90%: {(upperSurvivalProb * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Slider 2: Environmental Stress Variation */}
              <div className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Operating Stress Variation:
                  </label>
                  <span className={`font-black font-mono text-sm ${stressFactor > 0 ? 'text-rose-500' : stressFactor < 0 ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'}`}>
                    {stressFactor > 0 ? `+${stressFactor}% (Harsh)` : stressFactor < 0 ? `${stressFactor}% (Benign)` : '0% (Nominal)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="5"
                  value={stressFactor}
                  onChange={(e) => setStressFactor(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />

                {/* Adjusted Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Stress-Adjusted MTBF:</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      {Math.round(effectiveMtbf).toLocaleString()} hrs
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Inherent Availability (A):</span>
                    <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {inherentAvailability.toFixed(3)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      )}
      
      {result !== null && (
        <div className="md:col-span-2">
          <CalculationProofDrawer
            title={`${mode} Mathematical Derivation & Confidence Bound Audit`}
            standard="ISO 14224 §B.2.3 & MIL-HDBK-338B §5.4"
            standardClause={testType === 'time' ? "Time-Truncated Type I Test" : "Failure-Truncated Type II Test"}
            steps={[
              {
                name: `1. Point Estimate Mean Time (${mode})`,
                formula: `\\text{${mode}} = \\frac{\\sum T_i}{r} = \\frac{T_{\\text{operating}}}{r}`,
                substitution: `\\text{${mode}} = \\frac{${totalHours}\\text{ op-hours}}{${failures}\\text{ failures}} = ${result.toFixed(1)}\\text{ hours}`,
                result: `\\text{${mode}} = ${result.toFixed(1)}\\text{ hours/failure}`,
                dimensionalAnalysis: "\\frac{[\\text{cumulative operating hours}]}{[\\text{unscheduled failures}]}",
                interpretation: `Expected operational uptime between unscheduled stoppages under constant hazard rate assumption.`
              },
              {
                name: "2. Constant Failure Rate (Hazard Rate \u03BB)",
                formula: "\\lambda = \\frac{1}{\\text{MTBF}} = \\frac{r}{T}",
                substitution: `\\lambda = \\frac{1}{${result.toFixed(1)}\\text{ hrs}} = ${(1 / result).toExponential(4)}\\text{ hr}^{-1}`,
                result: `\\lambda = ${(1 / result).toExponential(4)}\\text{ failures/hour}`,
                dimensionalAnalysis: "[\\text{failures} \\cdot \\text{hour}^{-1}]",
                interpretation: `Equivalent to ${(8760 / result).toFixed(2)} expected failure events per continuous operating year (8,760 hrs).`
              },
              {
                name: `3. Wilson-Hilferty ${confidenceLevel}% Chi-Square Lower Confidence Bound`,
                formula: `\\text{MTBF}_{\\text{lower}} = \\frac{2T}{\\chi^2_{\\alpha/2, \\nu_L}} \\quad \\left(\\nu_L = ${lowerDf}\\right)`,
                substitution: `\\text{MTBF}_{\\text{lower}} = \\frac{2 \\times ${totalHours}}{${chi2Lower.toFixed(3)}} = ${Math.round(mtbfLowerBound).toLocaleString()}\\text{ hours}`,
                result: `\\text{MTBF}_{\\text{lower}} = ${Math.round(mtbfLowerBound).toLocaleString()}\\text{ hours}`,
                dimensionalAnalysis: "\\frac{[\\text{hours}]}{[\\text{dimensionless quantile}]}",
                interpretation: `With ${confidenceLevel}% statistical confidence, true population MTBF is guaranteed to meet or exceed ${Math.round(mtbfLowerBound).toLocaleString()} hours.`
              },
              {
                name: "4. Target Mission Horizon Survival Probability",
                formula: "R(t) = e^{-\\lambda t} = \\exp\\left( -\\frac{t}{\\text{MTBF}} \\right)",
                substitution: `R(${missionHours}\\text{h}) = \\exp\\left( -\\frac{${missionHours}}{${result.toFixed(1)}} \\right) = ${(survivalProb * 100).toFixed(2)}\\%`,
                result: `R(${missionHours}\\text{h}) = ${(survivalProb * 100).toFixed(2)}\\%`,
                dimensionalAnalysis: "[\\text{dimensionless probability} \\in [0, 1]]",
                interpretation: `Probability of completing a uninterrupted ${missionHours}-hour mission without unscheduled breakdown.`
              },
              {
                name: "5. Inherent Equipment Availability (Operational)",
                formula: "A_i = \\frac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}} \\times 100\\%",
                substitution: `A_i = \\frac{${result.toFixed(1)}}{${result.toFixed(1)} + ${mttrHours}} \\times 100\\% = ${inherentAvailability.toFixed(3)}\\%`,
                result: `A_i = ${inherentAvailability.toFixed(3)}\\%`,
                dimensionalAnalysis: "\\frac{[\\text{uptime hours}]}{[\\text{uptime} + \\text{repair hours}]}",
                interpretation: `Theoretical maximum uptime percentage governed exclusively by inherent reliability and active repair time.`
              }
            ]}
            assumptions={[
              "Exponential life distribution: Failure rate \u03BB is independent of operating age (constant hazard rate / Poisson process).",
              "Failures are mutually independent events without cascading or common-cause contagion.",
              `Confidence bounds calculated via exact Chi-Square inversion with ${lowerDf} lower degrees of freedom.`
            ]}
            auditChecklist={[
              "ISO 14224 Clause B.2.3 compliance: Operating time recorded net of scheduled maintenance outages.",
              "Type I (time-truncated) or Type II (failure-truncated) testing protocol appropriately specified.",
              "Point estimate verified against historical equipment class benchmarks."
            ]}
          />
        </div>
      )}
      
      <div className="md:col-span-2">
        <ShareAndExport 
          toolName="MTBF Calculator"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary={result !== null ? `MTBF: ${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hrs (${confidenceLevel}% Bounds: [${Math.round(mtbfLowerBound)}, ${isFinite(mtbfUpperBound) ? Math.round(mtbfUpperBound) : '∞'}])` : undefined}
          pdfData={result !== null ? {
            inputs: {
              "Calculation Mode": mode,
              "Operational Time (Hrs)": totalHours,
              "Number of Failures": failures,
              "Confidence Level": `${confidenceLevel}% (${testType === 'time' ? 'Time-Truncated' : 'Failure-Truncated'})`,
              "Target Mission Time": `${missionHours} hours`,
              "Operating Stress Variation": `${stressFactor}%`
            },
            results: {
              [`Mean Time (${mode})`]: `${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hours`,
              [`Lower Limit (${confidenceLevel}%)`]: `${Math.round(mtbfLowerBound).toLocaleString()} Hours`,
              [`Upper Limit (${confidenceLevel}%)`]: isFinite(mtbfUpperBound) ? `${Math.round(mtbfUpperBound).toLocaleString()} Hours` : 'Infinity',
              "Mission Survival R(t)": `${(survivalProb * 100).toFixed(2)}%`,
              "Inherent Line Availability": `${inherentAvailability.toFixed(3)}%`,
              "Failure Rate (\u03BB)": `${(1 / result).toFixed(8)} failures/hour`,
              "Reliability Profile": mode === 'MTBF' ? 'Repairable System' : 'Disposable Asset'
            },
            formula: `${mode} = Total Operational Time / Failures = ${totalHours} hrs / ${failures} events; Chi-Square Lower Limit = 2T / \u03C7\u00B2(1-\u03B1/2, 2r+2)`,
            interpretation: mode === 'MTBF'
              ? `Estimated mean operating uptime of ${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} hours. With ${confidenceLevel}% statistical confidence, true MTBF is guaranteed to exceed ${Math.round(mtbfLowerBound).toLocaleString()} operating hours. At target mission time of ${missionHours} hours, survival probability is ${(survivalProb * 100).toFixed(2)}%.`
              : `Expected non-repairable component operational lifetime of ${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} hours before failure and disposal.`
          } : undefined}
          exportData={result !== null ? [
            { Parameter: "Calculation Mode", Value: mode },
            { Parameter: "Total Operational Time (Hours)", Value: totalHours },
            { Parameter: "Number of Failures", Value: failures },
            { Parameter: `Point Estimate (${mode} in Hours)`, Value: result },
            { Parameter: `Lower Confidence Limit (${confidenceLevel}%)`, Value: Math.round(mtbfLowerBound) },
            { Parameter: `Upper Confidence Limit (${confidenceLevel}%)`, Value: isFinite(mtbfUpperBound) ? Math.round(mtbfUpperBound) : "Infinity" },
            { Parameter: "Degrees of Freedom (Lower / Upper)", Value: `${lowerDf} / ${upperDf}` },
            { Parameter: "Target Mission Time (Hours)", Value: missionHours },
            { Parameter: "Mission Survival Probability R(t)", Value: `${(survivalProb * 100).toFixed(2)}%` },
            { Parameter: "Inherent Availability (%)", Value: `${inherentAvailability.toFixed(3)}%` },
            { Parameter: "Failure Rate (\u03BB in failures/hour)", Value: (1 / result) }
          ] : undefined}
        />
      </div>
    </div>
  );

  // --- Content Strategies ---
  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Ultimate Reliability Metrics Guide: <span className="text-cyan-600 dark:text-cyan-400">MTBF</span> vs. <span className="text-violet-600 dark:text-violet-400">MTTF</span>
        </h2>
        <p>
          In the field of modern asset management and plant maintenance, understanding failure patterns is critical to achieving high reliability. This comprehensive guide, integrated into our <strong>reliability engineering calculator</strong> platform, explores the core concepts of <span className="font-extrabold text-cyan-600 dark:text-cyan-400">Mean Time Between Failures (MTBF)</span> and <span className="font-extrabold text-violet-600 dark:text-violet-400">Mean Time To Failure (MTTF)</span>. By utilizing this <strong>MTBF calculator free</strong> online tool, reliability engineers and maintenance supervisors can extract actionable insights from raw operational data, transitioning from reactive firefighting to predictive maintenance excellence.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          What is <span className="text-cyan-600 dark:text-cyan-400">MTBF</span>? (Designed for Repairable Systems)
        </h3>
        <p>
          <span className="font-extrabold text-cyan-600 dark:text-cyan-400">Mean Time Between Failures (MTBF)</span> is a foundational metric representing the average operational time elapsed between consecutive failures of a repairable system or asset. A system is defined as "repairable" if it can be restored to full operational capacity through maintenance actions (such as part replacement, calibration, or software patching) without replacing the entire asset. Typical examples of repairable assets include industrial pumps, gearboxes, compressor trains, manufacturing assembly robots, and software operating systems.
        </p>
        <p>
          Calculating <span className="font-bold text-cyan-600 dark:text-cyan-400">MTBF</span> helps plant engineers assess the overall health and reliability profile of their physical assets. A declining MTBF indicates a deteriorating system that may require immediate design review, root cause analysis, or a revised preventive maintenance strategy. It is essential to recognize that MTBF applies to the <span className="font-extrabold text-emerald-600 dark:text-emerald-450">Useful Life</span> phase of an asset's lifecycle, where the failure rate remains relatively constant. For non-constant failure rates, such as during run-in wear or rapid aging, modeling must be performed using a dedicated <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull Analysis Tool</Link> to accurately determine the wear-out shape parameters.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          What is <span className="text-violet-600 dark:text-violet-400">MTTF</span>? (Designed for Non-Repairable Components)
        </h3>
        <p>
          In contrast, <span className="font-extrabold text-violet-650 dark:text-violet-400">Mean Time To Failure (MTTF)</span> is a statistical metric representing the expected operational lifespan of a non-repairable component before it fails and is discarded. Because these items cannot be cost-effectively repaired, the first failure terminates their service life. Examples of non-repairable parts include microprocessors, LED light bulbs, rolling-element bearings, electrical fuses, and structural bolts.
        </p>
        <p>
          <span className="font-bold text-violet-650 dark:text-violet-400">MTTF</span> represents the true average lifetime of an asset class. In practice, MTTF is calculated by testing a large batch of identical components until they all fail, summing their cumulative operating lifetimes, and dividing by the total number of tested items. When engineering systems for critical applications, selecting components with verified high MTTF scores is paramount to preventing premature catastrophic system failure.
        </p>

        <h2 id="how-to" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Reliability: MTBF Formula & Uptime Calculations
        </h2>
        <p>
          The basic formula for computing Mean Time Between Failures is the ratio of total operational time to the total number of failure events observed within that time frame:
        </p>
        <div className="my-6">
          <BlockMath math="\text{MTBF} = \frac{\text{Total Operational Time (Hours)}}{\text{Number of Failures (F)}}" />
        </div>
        <p>
          While the equation appears simple, applying it to real-world industrial systems requires careful data collection. Here is a detailed breakdown of the variables:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Total Operational Time:</strong> This is the net active operating duration of the system. It is critical to subtract scheduled downtime (such as planned preventive maintenance, safety shutdowns, or holidays) and administrative delays from the calendar time. Only the time when the equipment was energized and capable of producing output should be counted.
          </li>
          <li>
            <strong>Number of Failures (F):</strong> This represents the count of unscheduled breakdown events that interrupted operations. If a failure occurs and is resolved instantly through a redundant backup system without affecting output, it must still be logged to maintain an accurate failure rate database.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Multi-Asset Fleet Calculation Example
        </h3>
        <p>
          Consider a factory operating a fleet of 10 identical centrifugal pumps. The fleet is monitored over a one-year evaluation period (8,760 hours). 
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Initially, the gross calendar hours for the fleet would be: <InlineMath math="10 \text{ pumps} \times 8{,}760 \text{ hours/pump} = 87{,}600 \text{ pump-hours}" />.
          </li>
          <li>
            However, during the year, each pump was shut down for 160 hours of planned preventive maintenance: <InlineMath math="10 \times 160 = 1{,}600 \text{ planned downtime hours}" />.
          </li>
          <li>
            Furthermore, the plant logged a total of 8 unscheduled pump breakdowns during this time frame, resulting in 200 hours of cumulative repair time.
          </li>
          <li>
            The net operational time for the pump fleet is: <InlineMath math="87{,}600 - 1{,}600 - 200 = 85{,}800 \text{ active running hours}" />.
          </li>
          <li>
            Applying our <strong>free MTBF calculator online</strong> math: <InlineMath math="\text{MTBF} = \frac{85{,}800 \text{ hours}}{8 \text{ failures}} = 10{,}725 \text{ hours}" />.
          </li>
        </ol>
        <p>
          This indicates that, on average, any given pump in the fleet is expected to run for 10,725 operational hours before experiencing a failure.
        </p>

        <h2 id="applications" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The <span className="text-cyan-600 dark:text-cyan-400">Bathtub Curve</span> and Failure Rate Profiles
        </h2>
        <p>
          To apply MTBF effectively, engineers must reference the <strong>Bathtub Curve</strong>, which describes the hazard rate (failure frequency of a product over time). The curve is divided into three distinct phases:
        </p>
        
        <div className="my-8">
          <BathtubCurveDiagram />
        </div>
        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="p-5 bg-gradient-to-b from-rose-500/5 to-transparent border border-rose-500/20 dark:border-rose-500/30 rounded-2xl shadow-sm">
            <h4 className="font-bold text-rose-600 dark:text-rose-455 mb-2">1. Infant Mortality</h4>
            <p className="text-sm">
              Characterized by a rapidly decreasing failure rate. Failures are caused by manufacturing defects, poor installation, or material weaknesses. To analyze infant mortality and fit life data parameters, engineers rely on a <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull analysis tool</Link> with Beta (β) &lt; 1.
            </p>
          </div>
          <div className="p-5 bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl shadow-sm">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">2. Useful Life</h4>
            <p className="text-sm">
              The failure rate remains low and statistically constant (constant hazard rate, β = 1). Failures occur randomly due to environmental stresses or operator error. <strong>MTBF is only valid during this phase.</strong>
            </p>
          </div>
          <div className="p-5 bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/30 rounded-2xl shadow-sm">
            <h4 className="font-bold text-amber-600 dark:text-amber-455 mb-2">3. Wear-Out Phase</h4>
            <p className="text-sm">
              Characterized by a rapidly increasing failure rate (β &gt; 1) as components reach their mechanical limits due to friction, fatigue, or corrosion. Engineers must track this to compute the <Link to="/tools/optimal-replacement/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Optimal Replacement Age</Link>.
            </p>
          </div>
        </div>

        <h2 id="standards" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Integrating <span className="text-cyan-600 dark:text-cyan-400">MTBF</span>, <span className="text-rose-600 dark:text-rose-400">MTTR</span>, and System <span className="text-emerald-600 dark:text-emerald-400">Availability</span>
        </h2>
        <p>
          MTBF cannot be viewed in isolation. True plant uptime is governed by the relationship between how frequently a system breaks down (MTBF) and how fast it can be repaired (Mean Time to Repair, or MTTR). Together, these metrics define the system's <strong>Inherent Availability (Ai)</strong>:
        </p>
        <div className="my-6">
          <BlockMath math="A_i = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}" />
        </div>
        
        <div className="my-8">
          <AvailabilityTimeline />
        </div>
        <p>
          To calculate the exact financial cost of downtime and simulate various reliability scenarios, engineers can navigate to our specialized <Link to="/tools/availability/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">System Availability Calculator</Link> and <Link to="/tools/mttr/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">MTTR Calculator</Link>.
        </p>
        <p>
          By extending MTBF (e.g., through precision alignment or component upgrades) or drastically reducing MTTR (e.g., through standardized repair kits and stocking critical spares in local inventory via the <Link to="/tools/spares/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Spare Part Estimator</Link>), organizations can drive their availability toward the coveted "five-nines" (99.999% uptime) benchmark.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Standards in Reliability Engineering
        </h3>
        <p>
          When estimating initial failure rates before historical data is accumulated, reliability engineers utilize standardized component libraries. Primary predictive modeling methodologies include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>MIL-HDBK-217F:</strong> The military standard for electronic reliability prediction, utilizing empirical formulas to calculate base failure rates adjusted for environment and temperature.
          </li>
          <li>
            <strong>Telcordia SR-332:</strong> Widely used in the telecommunications sector, combining empirical model predictions with lab test data and field tracking.
          </li>
          <li>
            <strong>NSWC (Naval Surface Warfare Center):</strong> Focuses on mechanical component predictions (valves, gearboxes, springs), taking into account fluid cleanliness, stress ratios, and material properties.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Is MTBF the same as 'Lifetime'?",
      answer:
        "<strong>No.</strong> This is the most common myth. A human has an MTBF of roughly 800 years (if we assume a constant low accident rate), but a lifespan of only 80 years. MTBF measures the probability of random failure, not the wear-out time.",
    },
    {
      question: "Does MTBF include maintenance time?",
      answer:
        "No. MTBF refers only to operating time. If a machine is down for scheduled maintenance, that time is excluded from the calculation.",
    },
    {
      question: "What is a 'Good' MTBF?",
      answer:
        "It depends entirely on the asset. For a centrifugal pump, 25,000 hours (ANSI standard) is good. For a hard drive, 1,000,000 hours is standard. Check the <strong>Industry Benchmarks</strong> sidebar for specific values.",
    },
    {
      question: "How do I improve MTBF?",
      answer:
        "1. <strong>Design:</strong> Use higher quality components.<br>2. <strong>Installation:</strong> Ensure precision alignment and balancing.<br>3. <strong>Operation:</strong> Run equipment within design specifications (don't overload).",
    },
    {
      question: "Can I use MTBF for software?",
      answer:
        "Yes, in software reliability, it stands for Mean Time Between Failures (crashes or bugs). It is calculated based on runtime hours divided by the number of critical defects encountered.",
    },
  ];

  return (
    <ToolContentLayout
      title="Free MTBF Calculator Online - Mean Time Between Failures"
      description={`Calculate ${mode === "MTBF" ? "Mean Time Between Failures" : "Mean Time To Failure"} to predict reliability and optimize maintenance schedules.`}
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="mtbf" />
        </>
      }
      faqs={faqs}
      keywords="free MTBF calculator, MTBF calculator online, mean time between failures, MTTF calculator, reliability calculator India, MTBF formula, failure rate calculator, MTBF calculation example"
      canonicalUrl="https://reliabilitytools.co.in/tools/mtbf/"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Free MTBF Calculator Online - Mean Time Between Failures",
        applicationCategory: "UtilitiesApplication",
      }}
    />
  );
};

export default MtbfCalculator;
