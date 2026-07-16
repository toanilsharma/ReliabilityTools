import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  BookOpen, 
  Target, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Info, 
  BarChart2, 
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import RelatedTools from '../../components/RelatedTools';
import AnimatedContainer from '../../components/AnimatedContainer';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'CNY', symbol: '¥', label: 'CNY (¥)' }
];

interface LccState {
  currency: string;
  discountRate: number;
  inflationRate: number;
  lifespan: number;
  downtimeCost: number;
  
  // Option A (Standard)
  costA: number;
  installationA: number;
  energyA: number;
  maintA: number;
  downtimeA: number;
  overhaulA: number;
  overhaulYearA: number;
  disposalA: number;
  residualA: number;
  
  // Option B (Premium)
  costB: number;
  installationB: number;
  energyB: number;
  maintB: number;
  downtimeB: number;
  overhaulB: number;
  overhaulYearB: number;
  disposalB: number;
  residualB: number;
}

const calculateLCCLocal = (params: {
  capex: number;
  installation: number;
  energy: number;
  maint: number;
  downtimeHours: number;
  downtimeCostPerHour: number;
  overhaul: number;
  overhaulYear: number;
  disposal: number;
  years: number;
  residual: number;
  discountRate: number;
  inflationRate: number;
}) => {
  const { capex, installation, energy, maint, downtimeHours, downtimeCostPerHour, overhaul, overhaulYear, disposal, years, residual, discountRate, inflationRate } = params;
  const r = discountRate / 100;
  const i = inflationRate / 100;

  const pvAcquisition = capex + installation;
  let runningNPV = pvAcquisition;
  const cumulativeData = [{ year: 0, cost: pvAcquisition }];
  
  let pvEnergy = 0;
  let pvMaint = 0;
  let pvDowntime = 0;
  let pvOverhaul = 0;

  for (let year = 1; year <= years; year++) {
    const opexRecur = energy + maint + (downtimeHours * downtimeCostPerHour);
    const pvOpex = (opexRecur * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
    
    pvEnergy += (energy * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
    pvMaint += (maint * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
    pvDowntime += ((downtimeHours * downtimeCostPerHour) * Math.pow(1 + i, year)) / Math.pow(1 + r, year);

    let yearOverhaulPV = 0;
    if (year === overhaulYear && overhaul > 0) {
      yearOverhaulPV = (overhaul * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
      pvOverhaul += yearOverhaulPV;
    }

    let yearDisposalPV = 0;
    let yearResidualPV = 0;
    if (year === years) {
      if (disposal > 0) {
        yearDisposalPV = (disposal * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
      }
      if (residual > 0) {
        yearResidualPV = (residual * Math.pow(1 + i, year)) / Math.pow(1 + r, year);
      }
    }

    runningNPV += pvOpex + yearOverhaulPV + yearDisposalPV - yearResidualPV;
    cumulativeData.push({ year, cost: runningNPV });
  }

  const pvDisposal = (disposal * Math.pow(1 + i, years)) / Math.pow(1 + r, years);
  const pvResidual = (residual * Math.pow(1 + i, years)) / Math.pow(1 + r, years);

  return {
    npv: runningNPV,
    cumulativeData,
    pvAcquisition,
    pvEnergy,
    pvMaint: pvMaint + pvOverhaul,
    pvDowntime,
    pvDisposal,
    pvResidual
  };
};

const CostBreakdownChart = ({ analysisA, analysisB, curSymbol }: { analysisA: any; analysisB: any; curSymbol: string }) => {
  const maxNpv = Math.max(analysisA.npv, analysisB.npv);
  
  const getWidthPercent = (val: number) => {
    if (maxNpv <= 0) return "0%";
    return `${(val / maxNpv) * 100}%`;
  };

  const renderOptionBar = (label: string, data: any, isPremium: boolean) => {
    const wAcq = getWidthPercent(data.pvAcquisition);
    const wEnergy = getWidthPercent(data.pvEnergy);
    const wMaint = getWidthPercent(data.pvMaint);
    const wDowntime = getWidthPercent(data.pvDowntime);
    const wDisposal = getWidthPercent(data.pvDisposal);
    
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className={isPremium ? "text-cyan-600 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400"}>{label}</span>
          <span className="font-mono text-slate-800 dark:text-slate-300">{curSymbol}{Math.round(data.npv).toLocaleString()}</span>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-900/60 h-8 rounded-xl overflow-hidden flex border border-slate-205 dark:border-slate-800 shadow-inner">
          <div style={{ width: wAcq }} className="bg-indigo-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-bold" title={`Capex: ${curSymbol}${Math.round(data.pvAcquisition).toLocaleString()}`}>
            {parseFloat(wAcq) > 12 && "CapEx"}
          </div>
          <div style={{ width: wEnergy }} className="bg-amber-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-bold" title={`Energy: ${curSymbol}${Math.round(data.pvEnergy).toLocaleString()}`}>
            {parseFloat(wEnergy) > 12 && "Power"}
          </div>
          <div style={{ width: wMaint }} className="bg-emerald-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-bold" title={`Maintenance: ${curSymbol}${Math.round(data.pvMaint).toLocaleString()}`}>
            {parseFloat(wMaint) > 12 && "Maint"}
          </div>
          <div style={{ width: wDowntime }} className="bg-rose-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-bold" title={`Downtime: ${curSymbol}${Math.round(data.pvDowntime).toLocaleString()}`}>
            {parseFloat(wDowntime) > 12 && "Down"}
          </div>
          {data.pvDisposal > 0 && (
            <div style={{ width: wDisposal }} className="bg-slate-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] text-white font-bold" title={`Disposal: ${curSymbol}${Math.round(data.pvDisposal).toLocaleString()}`}>
              {parseFloat(wDisposal) > 12 && "Disp"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <Layers className="w-4 h-4 text-cyan-600" /> Life Cycle Cost Breakdown (NPV)
      </h3>
      
      <div className="space-y-4">
        {renderOptionBar("Option A (Standard)", analysisA, false)}
        {renderOptionBar("Option B (Premium)", analysisB, true)}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-md"></span> Acquisition (CapEx)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-md"></span> Energy / Power</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-md"></span> Maint & Overhauls</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-md"></span> Outage Downtime</span>
      </div>
    </div>
  );
};

const LccCalculator: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const { addRecentTool } = useRecentTools();
  const location = useLocation();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [state, setState, shareUrl] = useShareableState<LccState>({
    currency: 'USD',
    discountRate: 8,
    inflationRate: 2.5,
    lifespan: 12,
    downtimeCost: 600,
    
    costA: 15000,
    installationA: 1500,
    energyA: 4200,
    maintA: 1300,
    downtimeA: 24,
    overhaulA: 3000,
    overhaulYearA: 6,
    disposalA: 1000,
    residualA: 500,
    
    costB: 24000,
    installationB: 2000,
    energyB: 2200,
    maintB: 450,
    downtimeB: 6,
    overhaulB: 0,
    overhaulYearB: 0,
    disposalB: 800,
    residualB: 3000
  });

  const {
    currency, discountRate, inflationRate, lifespan, downtimeCost,
    costA, installationA, energyA, maintA, downtimeA, overhaulA, overhaulYearA, disposalA, residualA,
    costB, installationB, energyB, maintB, downtimeB, overhaulB, overhaulYearB, disposalB, residualB
  } = state;

  useEffect(() => {
    addRecentTool({
      id: 'lcc',
      name: 'Life Cycle Cost (LCC)',
      path: '/tools/lcc'
    });
  }, []);

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const checkPositive = (val: number, name: string) => {
      if (isNaN(val) || val < 0) {
        newErrors[name] = "Enter a valid positive number.";
        isValid = false;
      }
    };

    checkPositive(discountRate, "discountRate");
    checkPositive(inflationRate, "inflationRate");
    checkPositive(lifespan, "lifespan");
    checkPositive(downtimeCost, "downtimeCost");

    checkPositive(costA, "costA");
    checkPositive(energyA, "energyA");
    checkPositive(maintA, "maintA");
    checkPositive(downtimeA, "downtimeA");

    checkPositive(costB, "costB");
    checkPositive(energyB, "energyB");
    checkPositive(maintB, "maintB");
    checkPositive(downtimeB, "downtimeB");

    if (showAdvanced) {
      checkPositive(installationA, "installationA");
      checkPositive(overhaulA, "overhaulA");
      checkPositive(disposalA, "disposalA");
      checkPositive(residualA, "residualA");
      
      checkPositive(installationB, "installationB");
      checkPositive(overhaulB, "overhaulB");
      checkPositive(disposalB, "disposalB");
      checkPositive(residualB, "residualB");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (field: keyof LccState, val: string | number) => {
    setState(s => ({ ...s, [field]: typeof val === 'string' ? (field === 'currency' ? val : parseFloat(val) || 0) : val }));
  };

  const currentCurrency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  }, [currency]);

  const curSymbol = currentCurrency.symbol;

  const analysisA = useMemo(() => {
    return calculateLCCLocal({
      capex: costA,
      installation: showAdvanced ? installationA : 0,
      energy: energyA,
      maint: maintA,
      downtimeHours: downtimeA,
      downtimeCostPerHour: downtimeCost,
      overhaul: showAdvanced ? overhaulA : 0,
      overhaulYear: showAdvanced ? overhaulYearA : 0,
      disposal: showAdvanced ? disposalA : 0,
      years: lifespan,
      residual: showAdvanced ? residualA : 0,
      discountRate,
      inflationRate
    });
  }, [state, showAdvanced]);

  const analysisB = useMemo(() => {
    return calculateLCCLocal({
      capex: costB,
      installation: showAdvanced ? installationB : 0,
      energy: energyB,
      maint: maintB,
      downtimeHours: downtimeB,
      downtimeCostPerHour: downtimeCost,
      overhaul: showAdvanced ? overhaulB : 0,
      overhaulYear: showAdvanced ? overhaulYearB : 0,
      disposal: showAdvanced ? disposalB : 0,
      years: lifespan,
      residual: showAdvanced ? residualB : 0,
      discountRate,
      inflationRate
    });
  }, [state, showAdvanced]);

  const diff = analysisA.npv - analysisB.npv;
  const isBBetter = analysisB.npv < analysisA.npv;
  const savingsPercent = (Math.abs(diff) / Math.max(1, analysisA.npv)) * 100;

  const chartData = useMemo(() => {
    return analysisA.cumulativeData.map((pt, idx) => ({
      year: pt.year,
      "Option A (Standard)": Math.round(pt.cost),
      "Option B (Premium)": Math.round(analysisB.cumulativeData[idx]?.cost || 0)
    }));
  }, [analysisA, analysisB]);

  // Compute break-even year
  const breakevenYear = useMemo(() => {
    for (let y = 0; y <= lifespan; y++) {
      const ptA = analysisA.cumulativeData[y];
      const ptB = analysisB.cumulativeData[y];
      if (ptB && ptA && ptB.cost < ptA.cost) {
        return y;
      }
    }
    return null;
  }, [analysisA, analysisB, lifespan]);

  const ToolComponent = (
    <div className="space-y-6" ref={toolRef}>
      
      {/* Settings Grid Card */}
      <div className="bg-slate-105 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-inner">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-805 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-600" /> Economic Parameters
          </h3>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="text-xs bg-white dark:bg-slate-850 hover:border-cyan-500 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl font-black text-cyan-655 dark:text-cyan-400 shadow-sm transition"
          >
            {showAdvanced ? "⚡ Simple Modeling" : "🛠️ Enable Advanced Fields"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500">Currency</label>
              <HelpTooltip text="Select the currency for CapEx, OpEx, and Downtime Cost calculations." />
            </div>
            <select
              value={currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
              className="w-full bg-white dark:bg-slate-850 border border-slate-305 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500">Discount Rate (%)</label>
              <HelpTooltip text="The annual cost of capital, representing the earning potential if money was invested elsewhere." />
            </div>
            <input
              type="number"
              step="0.5"
              value={discountRate}
              onChange={(e) => handleFieldChange("discountRate", e.target.value)}
              className="w-full bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500">Inflation Rate (%)</label>
              <HelpTooltip text="The annual rate at which OPEX costs (labor, power, materials) will increase over time." />
            </div>
            <input
              type="number"
              step="0.1"
              value={inflationRate}
              onChange={(e) => handleFieldChange("inflationRate", e.target.value)}
              className="w-full bg-white dark:bg-slate-855 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500">Asset Lifespan (Years)</label>
              <HelpTooltip text="Duration of life-cycle evaluation." />
            </div>
            <input
              type="number"
              value={lifespan}
              onChange={(e) => handleFieldChange("lifespan", e.target.value)}
              className="w-full bg-white dark:bg-slate-850 border border-slate-305 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-505">Downtime Cost ({curSymbol}/Hr)</label>
              <HelpTooltip text="Production loss or operational cost penalty per hour of unscheduled breakdown." />
            </div>
            <input
              type="number"
              value={downtimeCost}
              onChange={(e) => handleFieldChange("downtimeCost", e.target.value)}
              className="w-full bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Option A (Standard) */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-205 dark:border-slate-700/80 shadow-sm relative border-t-4 border-t-slate-450">
          <div className="absolute top-4 right-4 bg-slate-105 dark:bg-slate-900/60 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-400 border border-slate-200 dark:border-slate-800">
            Baseline Design
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-6">Option A (Standard)</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Purchase Price (CapEx)</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={costA} onChange={(e) => handleFieldChange("costA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annual Energy Cost</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={energyA} onChange={(e) => handleFieldChange("energyA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-905 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annual Maintenance</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={maintA} onChange={(e) => handleFieldChange("maintA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-905 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Downtime (Hrs/Yr)</label>
                <div className="relative rounded-lg shadow-sm">
                  <input type="number" value={downtimeA} onChange={(e) => handleFieldChange("downtimeA", e.target.value)} className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-[10px]">hrs</span>
                </div>
              </div>
            </div>

            {showAdvanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Installation Cost</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={installationA} onChange={(e) => handleFieldChange("installationA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mid-Life Overhaul Cost</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={overhaulA} onChange={(e) => handleFieldChange("overhaulA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Overhaul Year</label>
                  <input type="number" value={overhaulYearA} onChange={(e) => handleFieldChange("overhaulYearA", e.target.value)} className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">End-of-Life Disposal</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={disposalA} onChange={(e) => handleFieldChange("disposalA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Salvage / Residual Value</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={residualA} onChange={(e) => handleFieldChange("residualA", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-bold text-slate-505">
              <span>Standard NPV:</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-200">{curSymbol}{Math.round(analysisA.npv).toLocaleString()}</span>
            </div>
          </div>
        </AnimatedContainer>

        {/* Option B (Premium) */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative border-t-4 border-t-cyan-505">
          <div className="absolute top-4 right-4 bg-cyan-100 dark:bg-cyan-955/60 px-2 py-0.5 rounded text-[10px] font-black uppercase text-cyan-600 border border-cyan-200 dark:border-cyan-900">
            Premium Design
          </div>
          <h3 className="font-extrabold text-lg text-slate-905 dark:text-white mb-6">Option B (Premium)</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Purchase Price (CapEx)</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={costB} onChange={(e) => handleFieldChange("costB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annual Energy Cost</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={energyB} onChange={(e) => handleFieldChange("energyB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annual Maintenance</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                  <input type="number" value={maintB} onChange={(e) => handleFieldChange("maintB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Downtime (Hrs/Yr)</label>
                <div className="relative rounded-lg shadow-sm">
                  <input type="number" value={downtimeB} onChange={(e) => handleFieldChange("downtimeB", e.target.value)} className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500" />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-[10px]">hrs</span>
                </div>
              </div>
            </div>

            {showAdvanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Installation Cost</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={installationB} onChange={(e) => handleFieldChange("installationB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mid-Life Overhaul Cost</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={overhaulB} onChange={(e) => handleFieldChange("overhaulB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Overhaul Year</label>
                  <input type="number" value={overhaulYearB} onChange={(e) => handleFieldChange("overhaulYearB", e.target.value)} className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-905 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">End-of-Life Disposal</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={disposalB} onChange={(e) => handleFieldChange("disposalB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Salvage / Residual Value</label>
                  <div className="relative rounded-lg shadow-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{curSymbol}</span>
                    <input type="number" value={residualB} onChange={(e) => handleFieldChange("residualB", e.target.value)} className="w-full pl-7 pr-2 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <span>Premium NPV:</span>
              <span className="text-lg font-black">{curSymbol}{Math.round(analysisB.npv).toLocaleString()}</span>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Decision Results Panel */}
      <div className={`p-6 rounded-2xl border ${isBBetter ? 'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-900/40' : 'bg-slate-100 border-slate-205 dark:bg-slate-800/40 dark:border-slate-700/80'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs bg-emerald-105 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-350 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full font-black uppercase">
                🎯 Best NPV Choice
              </span>
            </div>
            <h4 className="font-black text-xl text-slate-900 dark:text-white">
              {isBBetter ? "Option B (Premium) is the recommended investment" : "Option A (Standard) is the recommended investment"}
            </h4>
            <p className="text-sm text-slate-505 dark:text-slate-400">
              By selecting the recommended option, you will save <strong className="text-emerald-600 dark:text-emerald-450">{curSymbol}{Math.round(Math.abs(diff)).toLocaleString()}</strong> in present value dollars over the {lifespan} year evaluation period.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NPV Savings</span>
              <span className="text-2xl font-black text-emerald-505 block mt-1">
                {savingsPercent.toFixed(1)}%
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payback Break-Even</span>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 block mt-1">
                {breakevenYear !== null ? `Year ${breakevenYear}` : "No breakeven"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Breakdown Bars */}
      <CostBreakdownChart analysisA={analysisA} analysisB={analysisB} curSymbol={curSymbol} />

      {/* Recharts Chart - Cumulative Break-Even Curve */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-805 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-600" /> Cumulative Present Value Cost curves
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            The intersection point represents the payback year. After this point, Option B's lower OPEX pays off its higher purchase CapEx.
          </p>
        </div>

        <div className="h-80 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="year" stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${curSymbol}${val.toLocaleString()}`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '6px' }}
                formatter={(value: any) => [`${curSymbol}${value.toLocaleString()}`, undefined]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '12px' }} />
              <Line type="monotone" dataKey="Option A (Standard)" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Option B (Premium)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KaTeX Equation steps */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-205 dark:border-slate-700 overflow-x-auto">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
          <RotateCcw className="w-4 h-4 text-cyan-600" /> Life Cycle Cost NPV Formula
        </h3>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 space-y-4">
          <p className="text-xs text-slate-505 leading-normal">
            Calculated as the sum of purchase price, installation, and annually discounted/inflated operational costs, minus final salvage value:
          </p>
          <BlockMath math={`\\text{NPV} = \\text{Capex} + \\text{Install} + \\sum_{t=1}^{N} \\frac{\\text{Energy} + \\text{Maint} + \\text{Downtime}}{(1 + r - i)^t} + \\frac{\\text{Overhaul}}{(1+r-i)^{k}} + \\frac{\\text{Disposal} - \\text{Residual}}{(1+r-i)^N}`} />
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid gap-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Option A NPV:</span>
              <span className="font-black text-slate-800 dark:text-slate-200">{curSymbol}{Math.round(analysisA.npv).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-500">Option B NPV:</span>
              <span className="font-black text-cyan-605 dark:text-cyan-400">{curSymbol}{Math.round(analysisB.npv).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share and Export */}
      <div className="mt-4">
        <ShareAndExport 
          toolName="LCC Calculator"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary={isBBetter ? "Option B (Premium) is recommended" : "Option A (Standard) is recommended"}
          pdfData={{
            inputs: {
              "Currency Type": currency,
              "Lifespan Evaluated": `${lifespan} Years`,
              "Discount Rate": `${discountRate}%`,
              "Inflation Rate": `${inflationRate}%`,
              "Downtime Cost Rate": `${curSymbol}${downtimeCost}/Hour`,
              "Option A CapEx / Install": `${curSymbol}${costA} / ${curSymbol}${installationA}`,
              "Option A Energy / Maint": `${curSymbol}${energyA} / ${curSymbol}${maintA} (Annual)`,
              "Option B CapEx / Install": `${curSymbol}${costB} / ${curSymbol}${installationB}`,
              "Option B Energy / Maint": `${curSymbol}${energyB} / ${curSymbol}${maintB} (Annual)`
            },
            results: {
              "Option A Life Cycle NPV": `${curSymbol}${Math.round(analysisA.npv).toLocaleString()}`,
              "Option B Life Cycle NPV": `${curSymbol}${Math.round(analysisB.npv).toLocaleString()}`,
              "Discounted Savings": `${curSymbol}${Math.round(Math.abs(diff)).toLocaleString()}`,
              "Break-Even Year": breakevenYear !== null ? `Year ${breakevenYear}` : "Never breaks even",
              "Recommendation": isBBetter ? "Option B (Premium)" : "Option A (Standard)"
            }
          }}
          exportData={[
            { Parameter: "Currency Select", Value: currency },
            { Parameter: "Lifespan (Years)", Value: lifespan },
            { Parameter: "Discount Rate (%)", Value: discountRate },
            { Parameter: "Inflation Rate (%)", Value: inflationRate },
            { Parameter: `Downtime Hourly Rate (${curSymbol}/hr)`, Value: downtimeCost },
            { Parameter: `Option A CapEx (${curSymbol})`, Value: costA },
            { Parameter: `Option A Annual Energy (${curSymbol})`, Value: energyA },
            { Parameter: `Option A Annual Maint (${curSymbol})`, Value: maintA },
            { Parameter: "Option A Downtime (Hrs/yr)", Value: downtimeA },
            { Parameter: `Option A NPV Cost (${curSymbol})`, Value: analysisA.npv },
            { Parameter: `Option B CapEx (${curSymbol})`, Value: costB },
            { Parameter: `Option B Annual Energy (${curSymbol})`, Value: energyB },
            { Parameter: `Option B Annual Maint (${curSymbol})`, Value: maintB },
            { Parameter: "Option B Downtime (Hrs/yr)", Value: downtimeB },
            { Parameter: `Option B NPV Cost (${curSymbol})`, Value: analysisB.npv },
            { Parameter: `Life Cycle Savings (${curSymbol})`, Value: Math.abs(diff) },
            { Parameter: "Payback Period (Years)", Value: breakevenYear || "N/A" }
          ]}
        />
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-805">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Understanding Life Cycle Costing (LCC) & Total Cost of Ownership
        </h2>
        <p>
          In capital-intensive industries (such as chemical processing, power generation, and heavy manufacturing), the purchase price of an asset is only the <strong>"tip of the iceberg."</strong> Typically, acquisition CapEx represents only <strong>10% to 20%</strong> of the total cost incurred over the asset's service life. The remaining 80% to 90% is spent on electricity/energy, preventative repairs, operational labor, and unscheduled downtime.
        </p>
        <p>
          <strong>Life Cycle Costing (LCC)</strong>, also referred to as Total Cost of Ownership (TCO) analysis, is a structured financial engineering process that converts all future operating costs into "Present Value" dollars. This enables equal side-by-side comparison between high-initial-price premium assets (Option B) and low-initial-price standard options (Option A).
        </p>

        <h3 className="text-2xl font-bold text-slate-905 dark:text-white mt-8 mb-4">
          Discount Rates & The Time Value of Money (NPV)
        </h3>
        <p>
          LCC relies on the economic principle that money today is worth more than the same amount of money in the future. This is because capital today can be invested to earn interest or returns. 
        </p>
        <p>
          To make future expenses comparable to cash spent today, future costs are discounted using the <strong>Discount Rate (r)</strong>. Simultaneously, the <strong>Inflation Rate (i)</strong> is applied to opex costs to adjust for the rising cost of labor, spares, and utilities. If the discount rate is high, future maintenance costs carry less weight in today's decisions. If inflation is high, the financial benefit of purchasing an efficient, low-maintenance premium option today increases dramatically.
        </p>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Advanced Cost Breakdown Drivers
        </h2>
        <p>
          When modeling Life Cycle Costs in professional plant engineering (standards like ISO 15663), calculations are grouped into five primary categories:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Acquisition (Capex + Installation):</strong> Upfront cash flow to buy, transport, mount, and commission the equipment.
          </li>
          <li>
            <strong>Operating Costs (Energy):</strong> Ongoing power consumption. High-efficiency premium motors, pumps, and gearboxes can lower electricity bills enough to pay off their price difference in under two years.
          </li>
          <li>
            <strong>Maintenance Costs (Maint + Overhaul):</strong> Cumulative costs of oil checks, seals, spare gaskets, and major mid-life overhauls.
          </li>
          <li>
            <strong>Unscheduled Downtime:</strong> The cost of lost production. A premium machine that reduces breakdown frequency (calculated using an <Link to="/mtbf-calculator" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">MTBF Calculator</Link>) from 24 hours a year to 6 hours a year will easily justify its premium price tag in factories where hourly losses exceed $1,000.
          </li>
          <li>
            <strong>End-of-Life (Disposal - Salvage):</strong> Costs to decommission, transport, and recycle materials, minus any salvage/resale scrap value of the retired machine.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the typical discount rate used in LCC?",
      answer: "In corporate asset management, the discount rate is usually set to the company's <strong>Weighted Average Cost of Capital (WACC)</strong>, typically ranging between <strong>6% and 12%</strong>. Government projects or municipal utility evaluations often use lower discount rates (3% to 5%)."
    },
    {
      question: "How does inflation affect the break-even payback year?",
      answer: "Higher inflation increases future operating expenses (opex) such as labor and electricity. This makes standard/inefficient options more expensive over time, pushing the break-even curve earlier and making the premium Option B more financially attractive."
    },
    {
      question: "Why should downtime be included in Life Cycle Costing?",
      answer: "For critical factory assets, a single hour of downtime can cost thousands of dollars in lost production. Selecting a highly reliable design with a high MTBF and low MTTR minimizes this cost driver, which is often the largest opex variable in LCC calculations."
    },
    {
      question: "What is the difference between Simple Payback and LCC NPV?",
      answer: "Simple payback ignores the 'Time Value of Money' and does not discount future cash flows. Life Cycle Costing uses Net Present Value (NPV), which is mathematically accurate because it accounts for discount rates, inflation rates, and the timing of mid-life overhauls or salvage values."
    },
    {
      question: "Can I model Life Cycle Costing for software or cloud assets?",
      answer: "Yes. In IT and software architectures, CapEx represents the initial setup/development, while OpEx represents monthly hosting subscriptions, database storage fees, and system administration labor. The same NPV calculations apply."
    }
  ];

  return (
    <ToolContentLayout
      title="Life Cycle Cost (LCC) Calculator - Total Cost of Ownership"
      description="Compare the Total Cost of Ownership (TCO) of two equipment options using Net Present Value (NPV) and break-even payback analysis."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="lcc" />
        </>
      }
      faqs={faqs}
      keywords="life cycle cost calculator, LCC calculator, total cost of ownership, NPV calculator capex opex, break even payback year, finance reliability engineering, asset lifecycle cost ISO 15663"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/lcc"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Life Cycle Cost (LCC) Calculator - Total Cost of Ownership",
        applicationCategory: "FinanceApplication",
      }}
    />
  );
};

export default LccCalculator;