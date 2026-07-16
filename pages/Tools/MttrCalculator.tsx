
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { calculateMTTR } from '../../services/reliabilityMath';
import { 
  Wrench, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  BookOpen, 
  Target, 
  TrendingUp, 
  BarChart, 
  Search, 
  CheckCircle,
  Activity,
  DollarSign,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import RelatedTools from '../../components/RelatedTools';
import AnimatedContainer from '../../components/AnimatedContainer';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { motion } from 'framer-motion';

interface MttrState {
  mode: "STANDARD" | "STAGES";
  // STANDARD inputs
  totalHours: string;
  repairs: string;
  // STAGES inputs
  detectTime: string;      // Detection & diagnosis time (avg hrs per event)
  logisticsTime: string;   // Logistics delay / spares wait (avg hrs per event)
  activeRepairTime: string; // Active mechanical/electrical repair (avg hrs per event)
  testTime: string;        // Verification, testing & recommissioning (avg hrs per event)
  stagesRepairs: string;   // Number of events for stages mode
  // Global params for impact analysis
  assumedMtbf: string;
  hourlyDowntimeCost: string;
}

const WrenchEfficiencyRing = ({ percentage }: { percentage: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = "stroke-rose-500 text-rose-500";
  let textColor = "text-rose-600 dark:text-rose-400";
  let bg = "bg-rose-100 dark:bg-rose-950/40 border-rose-250 dark:border-rose-900/60";
  let label = "Critical Bottlenecks";
  
  if (percentage >= 70) {
    color = "stroke-emerald-500 text-emerald-500";
    textColor = "text-emerald-600 dark:text-emerald-400";
    bg = "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-250 dark:border-emerald-900/60";
    label = "World-Class Efficiency";
  } else if (percentage >= 40) {
    color = "stroke-amber-500 text-amber-500";
    textColor = "text-amber-605 dark:text-amber-400";
    bg = "bg-amber-100 dark:bg-amber-950/40 border-amber-250 dark:border-amber-900/60";
    label = "Moderate Efficiency";
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-inner">
      <div className="relative flex items-center justify-center">
        <svg width="110" height="110" className="transform -rotate-90">
          <circle cx="55" cy="55" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" className="dark:stroke-slate-700" />
          <motion.circle
            cx="55"
            cy="55"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`transition-all duration-1000 ease-out ${color}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-black text-slate-905 dark:text-white">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className={`mt-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${bg} ${textColor}`}>
        {label}
      </div>
      <span className="text-[10px] text-slate-400 mt-2 font-semibold text-center leading-normal">
        Wrench Time vs. Total Down Time
      </span>
    </div>
  );
};

const MttrCalculator: React.FC = () => {
  const [state, setState, shareUrl] = useShareableState<MttrState>({
    mode: "STANDARD",
    totalHours: "120",
    repairs: "15",
    detectTime: "1.5",
    logisticsTime: "4.5",
    activeRepairTime: "3.0",
    testTime: "1.0",
    stagesRepairs: "10",
    assumedMtbf: "500",
    hourlyDowntimeCost: "5000"
  });

  const { mode, totalHours, repairs, detectTime, logisticsTime, activeRepairTime, testTime, stagesRepairs, assumedMtbf, hourlyDowntimeCost } = state;

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { addRecentTool } = useRecentTools();
  const location = useLocation();
  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addRecentTool({
      id: 'mttr',
      name: 'MTTR Calculator',
      path: '/tools/mttr'
    });
  }, []);

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (mode === "STANDARD") {
      const hours = parseFloat(totalHours);
      if (!totalHours || isNaN(hours) || hours < 0) {
        newErrors.totalHours = "Enter a valid positive number.";
        isValid = false;
      }
      const reps = parseFloat(repairs);
      if (!repairs || isNaN(reps) || reps <= 0) {
        newErrors.repairs = "Enter a valid count greater than 0.";
        isValid = false;
      }
    } else {
      const detect = parseFloat(detectTime);
      if (!detectTime || isNaN(detect) || detect < 0) {
        newErrors.detectTime = "Enter a positive number.";
        isValid = false;
      }
      const logistics = parseFloat(logisticsTime);
      if (!logisticsTime || isNaN(logistics) || logistics < 0) {
        newErrors.logisticsTime = "Enter a positive number.";
        isValid = false;
      }
      const active = parseFloat(activeRepairTime);
      if (!activeRepairTime || isNaN(active) || active < 0) {
        newErrors.activeRepairTime = "Enter a positive number.";
        isValid = false;
      }
      const test = parseFloat(testTime);
      if (!testTime || isNaN(test) || test < 0) {
        newErrors.testTime = "Enter a positive number.";
        isValid = false;
      }
      const reps = parseFloat(stagesRepairs);
      if (!stagesRepairs || isNaN(reps) || reps <= 0) {
        newErrors.stagesRepairs = "Enter a count > 0.";
        isValid = false;
      }
    }

    const mtbf = parseFloat(assumedMtbf);
    if (!assumedMtbf || isNaN(mtbf) || mtbf <= 0) {
      newErrors.assumedMtbf = "Enter a valid MTBF (> 0).";
      isValid = false;
    }

    const cost = parseFloat(hourlyDowntimeCost);
    if (!hourlyDowntimeCost || isNaN(cost) || cost < 0) {
      newErrors.hourlyDowntimeCost = "Enter a valid cost.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    validateInputs();
  };

  // Perform calculations based on inputs
  const parseVal = (val: string) => parseFloat(val) || 0;

  const mttrResult = React.useMemo(() => {
    if (!validateInputs()) return null;
    
    if (mode === "STANDARD") {
      return calculateMTTR(parseVal(totalHours), parseVal(repairs));
    } else {
      // Strictly speaking, MTTR is active diagnosis + active repair + testing. Logistics wait time is excluded.
      return parseVal(detectTime) + parseVal(activeRepairTime) + parseVal(testTime);
    }
  }, [mode, totalHours, repairs, detectTime, activeRepairTime, testTime]);

  const mdtResult = React.useMemo(() => {
    if (!validateInputs()) return null;
    
    if (mode === "STANDARD") {
      return calculateMTTR(parseVal(totalHours), parseVal(repairs)); // No logistics breakdown
    } else {
      // Mean Down Time (MDT) includes logistics delays
      return parseVal(detectTime) + parseVal(logisticsTime) + parseVal(activeRepairTime) + parseVal(testTime);
    }
  }, [mode, totalHours, repairs, detectTime, logisticsTime, activeRepairTime, testTime]);

  const wrenchRatio = React.useMemo(() => {
    if (mode === "STANDARD" || !mdtResult || mdtResult === 0) return 100;
    return (parseVal(activeRepairTime) / mdtResult) * 100;
  }, [mode, activeRepairTime, mdtResult]);

  // Financial Availability calculations
  const mtbfVal = parseVal(assumedMtbf);
  const costPerHour = parseVal(hourlyDowntimeCost);

  const availabilityInherent = React.useMemo(() => {
    if (!mttrResult || mtbfVal <= 0) return 0;
    return (mtbfVal / (mtbfVal + mttrResult)) * 100;
  }, [mttrResult, mtbfVal]);

  const availabilityOperational = React.useMemo(() => {
    if (!mdtResult || mtbfVal <= 0) return 0;
    return (mtbfVal / (mtbfVal + mdtResult)) * 100;
  }, [mdtResult, mtbfVal]);

  const yearlyDowntimeInherent = (1 - availabilityInherent / 100) * 8760;
  const yearlyDowntimeOperational = (1 - availabilityOperational / 100) * 8760;
  const logisticsPenaltyHours = Math.max(0, yearlyDowntimeOperational - yearlyDowntimeInherent);
  const logisticsPenaltyCost = logisticsPenaltyHours * costPerHour;

  const handleCopy = () => {
    if (mttrResult !== null) {
      const summaryText = mode === "STANDARD" 
        ? `MTTR: ${mttrResult.toFixed(2)} Hours`
        : `MTTR (Active Repair): ${mttrResult.toFixed(2)} Hours, MDT (Total Downtime): ${mdtResult?.toFixed(2)} Hours, Wrench Time Efficiency: ${wrenchRatio.toFixed(1)}%`;
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simulating optimization presets
  const applyPreset = (preset: "BASELINE" | "ALERTS" | "KITTING" | "WORLDCLASS") => {
    if (preset === "BASELINE") {
      setState(s => ({
        ...s,
        mode: "STAGES",
        detectTime: "2.0",
        logisticsTime: "8.0",
        activeRepairTime: "4.0",
        testTime: "1.0",
        stagesRepairs: "10"
      }));
    } else if (preset === "ALERTS") {
      setState(s => ({
        ...s,
        mode: "STAGES",
        detectTime: "0.5",
        logisticsTime: "8.0",
        activeRepairTime: "4.0",
        testTime: "1.0",
        stagesRepairs: "10"
      }));
    } else if (preset === "KITTING") {
      setState(s => ({
        ...s,
        mode: "STAGES",
        detectTime: "2.0",
        logisticsTime: "1.5",
        activeRepairTime: "4.0",
        testTime: "1.0",
        stagesRepairs: "10"
      }));
    } else if (preset === "WORLDCLASS") {
      setState(s => ({
        ...s,
        mode: "STAGES",
        detectTime: "0.5",
        logisticsTime: "1.0",
        activeRepairTime: "3.0",
        testTime: "0.5",
        stagesRepairs: "10"
      }));
    }
  };

  // Timeline proportions
  const tDetect = parseVal(detectTime);
  const tLogistics = parseVal(logisticsTime);
  const tActive = parseVal(activeRepairTime);
  const tTest = parseVal(testTime);
  const tSum = tDetect + tLogistics + tActive + tTest;

  const wDetect = tSum > 0 ? (tDetect / tSum) * 100 : 25;
  const wLogistics = tSum > 0 ? (tLogistics / tSum) * 100 : 25;
  const wActive = tSum > 0 ? (tActive / tSum) * 100 : 25;
  const wTest = tSum > 0 ? (tTest / tSum) * 100 : 25;

  const MTTR_BENCHMARKS = [
    { asset: "Microelectronics / PLC Cards", range: "0.1 - 0.5 Hours", method: "Hot-swappable module cards" },
    { asset: "Centrifugal Pumps & Seals", range: "4.0 - 8.0 Hours", method: "Laser shaft alignment & quick-cartridge seal replacement" },
    { asset: "Overhead Cranes & Heavy Hoists", range: "8.0 - 16.0 Hours", method: "Mechanical hoisting rigging and drive unit rebuild" },
    { asset: "Centrifugal Gas Compressors", range: "24.0 - 72.0 Hours", method: "Heavy casing disassembly and balancing check" },
    { asset: "Subsea Control Modules (Offshore)", range: "72.0 - 168.0 Hours", method: "Marine vessel charter & ROV retrieval operations" }
  ];

  const ToolComponent = (
    <div className="grid md:grid-cols-2 gap-8" ref={toolRef}>
      <AnimatedContainer animation="slideUp" delay={0.1} className="space-y-6">
        
        {/* Toggle Calculation Mode */}
        <div className="bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl inline-flex w-full border border-slate-200 dark:border-slate-800 relative shadow-inner">
          <button
            type="button"
            onClick={() => setState(s => ({ ...s, mode: "STANDARD" }))}
            className={`relative z-10 flex-1 px-6 py-2.5 rounded-xl text-sm font-black transition-colors duration-300 ${mode === "STANDARD" ? "text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"}`}
          >
            {mode === "STANDARD" && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl -z-10 shadow-md shadow-orange-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            Standard MTTR
          </button>
          <button
            type="button"
            onClick={() => setState(s => ({ ...s, mode: "STAGES" }))}
            className={`relative z-10 flex-1 px-6 py-2.5 rounded-xl text-sm font-black transition-colors duration-300 ${mode === "STAGES" ? "text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"}`}
          >
            {mode === "STAGES" && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl -z-10 shadow-md shadow-orange-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            Detailed Stages (MDT)
          </button>
        </div>

        {/* Input Parameters Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-500" /> Maintenance Logs
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            {mode === "STANDARD" ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                    Total Corrective Downtime Time (Hours)
                    <HelpTooltip text="Cumulative hours the machine was in failed state during corrective repairs." />
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      value={totalHours}
                      onChange={(e) => setState(s => ({ ...s, totalHours: e.target.value }))}
                      placeholder="e.g., 120"
                      className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-4 pr-16 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.totalHours ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">hours</span>
                    </div>
                  </div>
                  {errors.totalHours && (
                    <p className="mt-1 text-[11px] text-red-550 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.totalHours}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                    Number of Repairs
                    <HelpTooltip text="Total number of corrective repair events executed." />
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      value={repairs}
                      onChange={(e) => setState(s => ({ ...s, repairs: e.target.value }))}
                      placeholder="e.g., 15"
                      className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-4 pr-16 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.repairs ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">repairs</span>
                    </div>
                  </div>
                  {errors.repairs && (
                    <p className="mt-1 text-[11px] text-red-550 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.repairs}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                      1. Diagnosis Time (Avg)
                      <HelpTooltip text="Time elapsed from alert to diagnosing root cause (hours)." />
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        step="0.1"
                        value={detectTime}
                        onChange={(e) => setState(s => ({ ...s, detectTime: e.target.value }))}
                        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.detectTime ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500">hrs</span>
                      </div>
                    </div>
                    {errors.detectTime && <p className="mt-1 text-[10px] text-red-500">{errors.detectTime}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                      2. Logistics / Spares (Avg)
                      <HelpTooltip text="Logistical delay: waiting for spares, permits, or crew mobilization (hours)." />
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        step="0.1"
                        value={logisticsTime}
                        onChange={(e) => setState(s => ({ ...s, logisticsTime: e.target.value }))}
                        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.logisticsTime ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500">hrs</span>
                      </div>
                    </div>
                    {errors.logisticsTime && <p className="mt-1 text-[10px] text-red-500">{errors.logisticsTime}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                      3. Wrench Time (Avg)
                      <HelpTooltip text="Active physical mechanical/electrical repair work (hours)." />
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        step="0.1"
                        value={activeRepairTime}
                        onChange={(e) => setState(s => ({ ...s, activeRepairTime: e.target.value }))}
                        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.activeRepairTime ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500">hrs</span>
                      </div>
                    </div>
                    {errors.activeRepairTime && <p className="mt-1 text-[10px] text-red-500">{errors.activeRepairTime}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                      4. Verification & Test (Avg)
                      <HelpTooltip text="Recommissioning testing, safety clearances, and production restart (hours)." />
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        step="0.1"
                        value={testTime}
                        onChange={(e) => setState(s => ({ ...s, testTime: e.target.value }))}
                        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.testTime ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500">hrs</span>
                      </div>
                    </div>
                    {errors.testTime && <p className="mt-1 text-[10px] text-red-500">{errors.testTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-655 dark:text-slate-300 mb-1">
                    Number of Failure Events
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      value={stagesRepairs}
                      onChange={(e) => setState(s => ({ ...s, stagesRepairs: e.target.value }))}
                      className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg pl-4 pr-16 py-3 text-slate-905 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${errors.stagesRepairs ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">events</span>
                    </div>
                  </div>
                  {errors.stagesRepairs && <p className="mt-1 text-[11px] text-red-500">{errors.stagesRepairs}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              <Clock className="w-5 h-5 animate-pulse" /> Calculate MTTR
            </button>
          </form>
        </div>

        {/* Preset Simulator (Only for Stages Mode) */}
        {mode === "STAGES" && (
          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-3">
              🚀 Plant Downtime Optimization Presets
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset("BASELINE")}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:bg-orange-500/5 transition"
              >
                🔴 Unoptimized Baseline
              </button>
              <button
                type="button"
                onClick={() => applyPreset("ALERTS")}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:bg-orange-500/5 transition"
              >
                🟡 Smart IoT Alarms
              </button>
              <button
                type="button"
                onClick={() => applyPreset("KITTING")}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:bg-orange-500/5 transition"
              >
                🟢 Spares Kitting Kits
              </button>
              <button
                type="button"
                onClick={() => applyPreset("WORLDCLASS")}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-705 dark:text-slate-300 hover:border-orange-500 hover:bg-orange-500/5 transition"
              >
                💎 World Class Facility
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Clicking a preset will dynamically update the diagnosis and logistics wait times above to model specific efficiency gains.
            </p>
          </div>
        )}
      </AnimatedContainer>

      {/* Results Column */}
      <AnimatedContainer animation="slideUp" delay={0.2} className="space-y-6">
        
        {/* Results Card */}
        {mttrResult !== null && (
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            
            <div className="relative border rounded-2xl p-6 shadow-xl bg-white dark:bg-slate-905 border-orange-500/25 dark:border-orange-500/35">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 text-slate-400 hover:text-orange-500 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/55 text-orange-700 dark:text-orange-350 border border-orange-200 dark:border-orange-900">
                  🔧 {mode === "STANDARD" ? "Standard Mean Repair" : "Downtime Breakdown Profile"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                    Mean Time to Repair (MTTR)
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    {mttrResult.toFixed(2)}{" "}
                    <span className="text-sm text-slate-450 dark:text-slate-500 font-normal">hours</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1 font-medium">
                    Diagnostics + Active work + Testing
                  </span>
                </div>

                {mode === "STAGES" && (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                      Mean Down Time (MDT)
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {mdtResult?.toFixed(2)}{" "}
                      <span className="text-sm text-slate-450 dark:text-slate-500 font-normal">hours</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-1 font-medium">
                      Total elapsed offline time
                    </span>
                  </div>
                )}
              </div>

              {/* Stacked Wrench Efficiency Rings */}
              {mode === "STAGES" && (
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <WrenchEfficiencyRing percentage={wrenchRatio} />
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-center text-xs">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Crew Utilisation</span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      The wrench time ratio represents how much of the downtime is active hands-on repair. 
                      {wrenchRatio < 40 ? " A ratio below 40% indicates heavy logistical and administrative blockages." : " A high ratio means your technicians are highly efficient with minimal delays."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Equation Block */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <Clock className="w-4 h-4 text-orange-500" /> Live Equation
          </h3>
          <div className="bg-white dark:bg-slate-900/80 p-5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            {mode === "STANDARD" ? (
              <BlockMath math={`\\text{MTTR} = \\frac{\\text{Total Repair Time}}{\\text{Repairs}} = \\frac{${totalHours || 'T'}}{${repairs || 'N'}} ${mttrResult ? `= \\mathbf{${mttrResult.toFixed(2)}} \\text{ hrs}` : ''}`} />
            ) : (
              <div className="space-y-3 text-xs">
                <BlockMath math={`\\text{MTTR} = T_{\\text{detect}} + T_{\\text{active}} + T_{\\text{test}} = ${detectTime} + ${activeRepairTime} + ${testTime} ${mttrResult ? `= \\mathbf{${mttrResult.toFixed(2)}} \\text{ hrs}` : ''}`} />
                <BlockMath math={`\\text{MDT} = \\text{MTTR} + T_{\\text{logistics}} = ${mttrResult ? mttrResult.toFixed(2) : 'MTTR'} + ${logisticsTime} ${mdtResult ? `= \\mathbf{${mdtResult.toFixed(2)}} \\text{ hrs}` : ''}`} />
                <BlockMath math={`\\text{Efficiency} = \\frac{T_{\\text{active}}}{\\text{MDT}} = \\frac{${activeRepairTime}}{${mdtResult ? mdtResult.toFixed(2) : 'MDT'}} ${wrenchRatio ? `= \\mathbf{${wrenchRatio.toFixed(1)}\\%}` : ''}`} />
              </div>
            )}
          </div>
        </div>

        {/* Interactive Timeline breakdown */}
        {mode === "STAGES" && (
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" /> Interactive Downtime Timeline
            </h3>

            {/* Stacked Timeline Track */}
            <div className="w-full flex h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm text-[10px] font-bold text-white text-center">
              {tDetect > 0 && (
                <div style={{ width: `${wDetect}%` }} className="bg-rose-500 flex items-center justify-center shadow-inner" title={`Diagnosis: ${detectTime}h`}>
                  {wDetect > 10 && "Detect"}
                </div>
              )}
              {tLogistics > 0 && (
                <div style={{ width: `${wLogistics}%` }} className="bg-amber-500 flex items-center justify-center" title={`Logistics delay: ${logisticsTime}h`}>
                  {wLogistics > 10 && "Logistics"}
                </div>
              )}
              {tActive > 0 && (
                <div style={{ width: `${wActive}%` }} className="bg-emerald-500 flex items-center justify-center" title={`Active repair: ${activeRepairTime}h`}>
                  {wActive > 10 && "Wrench"}
                </div>
              )}
              {tTest > 0 && (
                <div style={{ width: `${wTest}%` }} className="bg-cyan-500 flex items-center justify-center" title={`Testing/restart: ${testTime}h`}>
                  {wTest > 10 && "Verify"}
                </div>
              )}
            </div>

            {/* Custom interactive legend sliders */}
            <div className="space-y-3.5 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-505 dark:text-rose-400">Diagnosis & Isolate</span>
                  <span className="font-mono">{detectTime} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="12" 
                  step="0.1" 
                  value={detectTime} 
                  onChange={(e) => setState(s => ({ ...s, detectTime: e.target.value }))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-605 dark:text-amber-400">Logistics & Permits delay</span>
                  <span className="font-mono">{logisticsTime} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="48" 
                  step="0.5" 
                  value={logisticsTime} 
                  onChange={(e) => setState(s => ({ ...s, logisticsTime: e.target.value }))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Physical Wrench Time</span>
                  <span className="font-mono">{activeRepairTime} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="48" 
                  step="0.5" 
                  value={activeRepairTime} 
                  onChange={(e) => setState(s => ({ ...s, activeRepairTime: e.target.value }))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-cyan-600 dark:text-cyan-400">Verification & Restart</span>
                  <span className="font-mono">{testTime} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="12" 
                  step="0.1" 
                  value={testTime} 
                  onChange={(e) => setState(s => ({ ...s, testTime: e.target.value }))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>

      {/* Global Impact Analysis Card (Spans both columns) */}
      {mttrResult !== null && (
        <div className="md:col-span-2">
          <AnimatedContainer animation="slideUp" delay={0.3} className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black tracking-wide flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-450" /> Availability & Loss Impact Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Analyze how your repair metrics (MTTR vs. MDT) directly impact overall system availability and plant downtime costs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 mb-1">Assumed MTBF (Hours)</label>
                  <input
                    type="number"
                    value={assumedMtbf}
                    onChange={(e) => setState(s => ({ ...s, assumedMtbf: e.target.value }))}
                    className="w-28 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-emerald-450 font-bold outline-none focus:border-emerald-500"
                  />
                  {errors.assumedMtbf && <span className="text-[9px] text-red-400">{errors.assumedMtbf}</span>}
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 mb-1">Hourly Revenue Loss ($)</label>
                  <input
                    type="number"
                    value={hourlyDowntimeCost}
                    onChange={(e) => setState(s => ({ ...s, hourlyDowntimeCost: e.target.value }))}
                    className="w-28 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-emerald-450 font-bold outline-none focus:border-emerald-500"
                  />
                  {errors.hourlyDowntimeCost && <span className="text-[9px] text-red-400">{errors.hourlyDowntimeCost}</span>}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Inherent Availability</span>
                <span className="text-3xl font-black text-emerald-450 block mt-1">
                  {availabilityInherent.toFixed(3)}%
                </span>
                <span className="text-[9px] text-slate-400 block mt-1.5 leading-normal">
                  Max potential availability using strictly active repair time (MTTR = {mttrResult.toFixed(1)}h).
                </span>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Operational Availability</span>
                <span className={`text-3xl font-black block mt-1 ${availabilityOperational < 95 ? "text-rose-400" : availabilityOperational < 99 ? "text-amber-400" : "text-emerald-450"}`}>
                  {availabilityOperational.toFixed(3)}%
                </span>
                <span className="text-[9px] text-slate-400 block mt-1.5 leading-normal">
                  Real availability achieved incorporating logistical delay (MDT = {mdtResult?.toFixed(1)}h).
                </span>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-orange-400 font-bold block uppercase tracking-wider">Logistics Revenue Penalty</span>
                  <span className="text-2xl font-black text-orange-400 block mt-1">
                    ${Math.round(logisticsPenaltyCost).toLocaleString()}/yr
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-1.5 leading-normal">
                  Annual lost production value caused strictly by waiting for logistics ({logisticsPenaltyHours.toFixed(1)} hrs delay).
                </span>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      )}

      {/* Industry Benchmarks Card */}
      <div className="md:col-span-2">
        <AnimatedContainer animation="slideUp" delay={0.4} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <BarChart className="w-4 h-4 text-orange-500" /> Equipment Repair MTTR Benchmarks (IEEE 493)
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-450 dark:text-slate-450 uppercase tracking-wider">Equipment Category</th>
                  <th className="px-4 py-3 text-center font-extrabold text-slate-450 dark:text-slate-450 uppercase tracking-wider">Typical MTTR Range</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-450 dark:text-slate-450 uppercase tracking-wider">Common Optimization Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-705/40">
                {MTTR_BENCHMARKS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150">
                    <td className="px-4 py-3 font-bold text-slate-705 dark:text-slate-300">{item.asset}</td>
                    <td className="px-4 py-3 text-center font-extrabold text-orange-600 dark:text-orange-400">{item.range}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedContainer>
      </div>

      {/* Share and Export */}
      <div className="md:col-span-2">
        <ShareAndExport 
          toolName="MTTR Calculator"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary={mttrResult !== null ? `${mttrResult.toFixed(2)} Hours` : undefined}
          pdfData={mttrResult !== null ? {
            inputs: {
              "Calculation Mode": mode,
              ...(mode === "STANDARD" ? {
                "Total Corrective Downtime": `${totalHours} Hours`,
                "Number of Repairs": repairs
              } : {
                "Diagnosis & Isolation Time": `${detectTime} Hours`,
                "Logistical & Permits Delay": `${logisticsTime} Hours`,
                "Active Wrench Time": `${activeRepairTime} Hours`,
                "Testing & Commissioning": `${testTime} Hours`,
                "Total Failure Events": stagesRepairs
              }),
              "Assumed System MTBF": `${assumedMtbf} Hours`,
              "Hourly Revenue Loss": `$${hourlyDowntimeCost}/hr`
            },
            results: {
              "Mean Time To Repair (MTTR)": `${mttrResult.toFixed(2)} Hours`,
              ...(mode === "STAGES" ? {
                "Mean Down Time (MDT)": `${mdtResult?.toFixed(2)} Hours`,
                "Wrench Time Efficiency": `${wrenchRatio.toFixed(1)}%`
              } : {}),
              "Inherent Availability (Ai)": `${availabilityInherent.toFixed(3)}%`,
              "Operational Availability (Ao)": `${availabilityOperational.toFixed(3)}%`,
              "Annual Logistics Revenue Penalty": `$${Math.round(logisticsPenaltyCost).toLocaleString()}/year`
            }
          } : undefined}
          exportData={mttrResult !== null ? [
            { Parameter: "Calculation Mode", Value: mode },
            ...(mode === "STANDARD" ? [
              { Parameter: "Total Corrective Downtime (Hrs)", Value: totalHours },
              { Parameter: "Number of Repairs", Value: repairs }
            ] : [
              { Parameter: "Diagnosis Time (Hrs)", Value: detectTime },
              { Parameter: "Logistics Delay (Hrs)", Value: logisticsTime },
              { Parameter: "Wrench Time (Hrs)", Value: activeRepairTime },
              { Parameter: "Test Time (Hrs)", Value: testTime },
              { Parameter: "Failure Events Count", Value: stagesRepairs }
            ]),
            { Parameter: "Assumed MTBF (Hrs)", Value: assumedMtbf },
            { Parameter: "Hourly Downtime Cost ($)", Value: hourlyDowntimeCost },
            { Parameter: "Mean Time To Repair (MTTR in Hrs)", Value: mttrResult },
            { Parameter: "Mean Down Time (MDT in Hrs)", Value: mdtResult },
            { Parameter: "Wrench Time Efficiency (%)", Value: wrenchRatio },
            { Parameter: "Inherent Availability (%)", Value: availabilityInherent },
            { Parameter: "Operational Availability (%)", Value: availabilityOperational },
            { Parameter: "Logistics Revenue Penalty ($/yr)", Value: logisticsPenaltyCost }
          ] : undefined}
        />
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          The Ultimate Maintenance Metric: <span className="text-orange-600 dark:text-orange-400">Mean Time to Repair (MTTR)</span>
        </h2>
        <p>
          In physical asset management, system availability is governed by two forces: how frequently systems fail, and how rapidly they can be restored. While Mean Time Between Failures (<Link to="/mtbf-calculator" className="text-orange-500 hover:underline font-bold">MTBF</Link>) measures the former, <strong>Mean Time to Repair (MTTR)</strong> is the core indicator of maintenance department response speed and capability.
        </p>
        <p>
          By utilizing this <strong>free online MTTR calculator</strong>, reliability engineers can analyze active corrective actions, identify structural bottlenecks in diagnostics or logistics, and calculate the financial impact of administrative delays on system availability.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Understanding the Distinction: MTTR vs. MDT
        </h3>
        <p>
          A common mistake in maintenance engineering is conflating <strong>MTTR</strong> with <strong>Mean Down Time (MDT)</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>MTTR (Mean Time to Repair)</strong> focuses strictly on technical repair processes. It spans from the moment diagnostics start, through physical repair/replacement ("wrench time"), to post-repair testing and restart. It represents the potential capability of the technician team.
          </li>
          <li>
            <strong>MDT (Mean Down Time)</strong> encompasses the *entire* duration the asset is offline. This includes logistical delays (e.g., waiting for parts from a central warehouse), administrative delays (work permit approval, lockout tagout clearances), and technician travel time.
          </li>
        </ul>
        <p>
          By tracking both metrics, managers can calculate the <strong>Wrench Time Efficiency</strong>. If MTTR is 2 hours, but MDT is 10 hours, the efficiency is only 20%. This reveals that 80% of downtime is waste caused by logistics rather than technical complexity. To estimate optimal stocking levels and prevent such delays, engineers can utilize our <Link to="/tools/spares" className="text-orange-500 hover:underline font-bold">Spare Part Estimator</Link>.
        </p>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Repair: Formulas & Stages
        </h2>
        <p>
          The standard equation for calculating Mean Time to Repair is the ratio of cumulative corrective repair time to the total count of completed repairs:
        </p>
        <div className="my-6">
          <BlockMath math="\text{MTTR} = \frac{\sum T_{\text{corrective}}}{N_{\text{repairs}}}" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The 4 Key Stages of the Repair Loop
        </h3>
        <p>
          To systematically reduce repair downtime, reliability engineering breaks the timeline down into 4 distinct segments:
        </p>
        <div className="grid md:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-1">1. Detect & Diagnose</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Alarm trigger, technician assignment, and troubleshooting to isolate the root failure cause.
            </p>
          </div>
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-1">2. Logistics & Permits</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Waiting for spare parts, drafting risk assessments, and securing mechanical isolation permits.
            </p>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">3. Physical Repair</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Active hands-on corrective work (e.g. alignment, bolt tightening, software module flashing).
            </p>
          </div>
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
            <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-1">4. Verify & Commission</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Functional run tests, safety check audits, and restarting the production line.
            </p>
          </div>
        </div>

        <h2 id="impact" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          How MTTR Governs Plant Availability
        </h2>
        <p>
          Availability ($A$) represents the probability that a system is up and running when needed. The relationship between MTBF and repair downtime is defined by two availability profiles:
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <h4 className="font-bold text-slate-800 dark:text-white mb-2">Inherent Availability ($A_i$)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Assumes ideal logistical environments (only active repair time is counted). Governed strictly by design parameters:
            </p>
            <div className="my-4">
              <BlockMath math="A_i = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}} \times 100\%" />
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <h4 className="font-bold text-slate-800 dark:text-white mb-2">Operational Availability ($A_o$)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Calculates real-world performance, including spares delivery bottlenecks and travel times:
            </p>
            <div className="my-4">
              <BlockMath math="A_o = \frac{\text{MTBF}}{\text{MTBF} + \text{MDT}} \times 100\%" />
            </div>
          </div>
        </div>
        <p>
          Reducing logistics delays (MDT) to approach inherent limits (MTTR) is often the fastest and most cost-effective path to achieving "five-nines" availability, compared to attempting costly design modifications to boost MTBF.
        </p>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is a good benchmark for MTTR?",
      answer: "A world-class benchmark for standard mechanical assemblies (like pumps) is typically <strong>under 4 hours</strong>. For modular electronic control cards, MTTR should be <strong>under 0.5 hours</strong>. High-complexity assets (turbines, subsea gear) can take 24 to 72 hours due to mechanical disassembly requirements."
    },
    {
      question: "Why does MTTR exclude preventive maintenance time?",
      answer: "MTTR is strictly a metric for <strong>corrective maintenance</strong> (unscheduled breakdown events). Scheduled tasks, such as calibration or oil changes, are tracked separately via Mean Preventive Maintenance Time (MPMT) because they do not represent random failure incidents."
    },
    {
      question: "What is the difference between MTTR and MTBF?",
      answer: "MTBF (Mean Time Between Failures) measures how long an asset operates continuously before failing. MTTR (Mean Time to Repair) measures how long it takes to restore it once it breaks down. Together, they dictate system availability."
    },
    {
      question: "How does spares kitting reduce MTTR/MDT?",
      answer: "Spares kitting pre-packages the exact gaskets, bearings, seals, tools, and manuals needed for a specific repair task. By eliminating travel time to warehouses and parts identification errors, kitting can reduce logistical delay (MDT) by up to 80%."
    },
    {
      question: "Can MTTR be applied to software systems?",
      answer: "Yes, in software engineering, MTTR stands for Mean Time to Resolve or Repair. It calculates the average time between a bug/incident alert and the deployment of a hotfix or rollback to restore service."
    }
  ];

  return (
    <ToolContentLayout
      title="Free MTTR Calculator Online - Mean Time To Repair"
      description="Calculate Mean Time To Repair (MTTR) and Mean Down Time (MDT) to analyze maintenance wrench efficiency and optimize asset uptime."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="mttr" />
        </>
      }
      faqs={faqs}
      keywords="MTTR calculator, mean time to repair calculator, MDT calculator, mean downtime, wrench time efficiency, reliability engineering calculators, plant uptime calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/mttr"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Free MTTR Calculator Online - Mean Time To Repair",
        applicationCategory: "UtilitiesApplication",
      }}
    />
  );
};

export default MttrCalculator;