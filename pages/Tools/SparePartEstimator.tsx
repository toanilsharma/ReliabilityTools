
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateSpareParts } from '../../services/reliabilityMath';
import { SERVICE_LEVELS } from '../../constants';
import { Package, ShoppingCart, Info, BookOpen, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import AnimatedNumber from '../../components/AnimatedNumber';
import CalculationProofDrawer from '../../components/CalculationProofDrawer';
import { useRef } from 'react';


const SparePartEstimator: React.FC = () => {
  const [partName, setPartName] = useState<string>('Centrifugal Pump Mechanical Seal Cartridge');
  const [unitCost, setUnitCost] = useState<string>('1500');
  const [vedCategory, setVedCategory] = useState<'V' | 'E' | 'D'>('V');
  const [fsnOverride, setFsnOverride] = useState<'auto' | 'F' | 'S' | 'N'>('auto');

  const [mtbf, setMtbf] = useState<string>('5000');
  const [usage, setUsage] = useState<string>('8760');
  const [quantity, setQuantity] = useState<string>('1');
  const [leadTime, setLeadTime] = useState<string>('30');
  const [serviceLevelIdx, setServiceLevelIdx] = useState<number>(1); // Default 95%

  const [result, setResult] = useState<any>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(mtbf);
    const u = parseFloat(usage);
    const q = parseFloat(quantity);
    const l = parseFloat(leadTime);

    if (!isNaN(m) && !isNaN(u) && !isNaN(q) && !isNaN(l) && m > 0) {
      setResult(calculateSpareParts(m, u, q, l, SERVICE_LEVELS[serviceLevelIdx].z));
    }
  };

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const poissonData = React.useMemo(() => {
    if (!result || !result.leadTimeDemand) return { spares: [] as number[], probs: [] as number[] };
    const lambda = result.leadTimeDemand;
    const maxK = Math.max(10, Math.ceil(lambda * 3));
    const spares: number[] = [];
    const probs: number[] = [];
    
    let prob = Math.exp(-lambda);
    for (let k = 0; k <= maxK; k++) {
      if (k > 0) {
        prob = (prob * lambda) / k;
      }
      spares.push(k);
      probs.push(parseFloat((prob * 100).toFixed(2)));
    }
    return { spares, probs };
  }, [result]);

  const costNum = Math.max(0, parseFloat(unitCost) || 0);

  // Derived FSN Velocity Classification
  const derivedFsn = React.useMemo(() => {
    if (fsnOverride !== 'auto') return fsnOverride;
    if (!result) return 'S';
    if (result.annualDemand >= 5) return 'F';
    if (result.annualDemand >= 1) return 'S';
    return 'N';
  }, [fsnOverride, result]);

  // Derived ABC Value Classification
  const derivedAbc = React.useMemo(() => {
    const annualSpend = result ? result.annualDemand * costNum : costNum;
    if (costNum >= 2000 || annualSpend >= 10000) return 'A';
    if (costNum >= 300 || annualSpend >= 1500) return 'B';
    return 'C';
  }, [costNum, result]);

  // Inventory Policy Formulation based on VED + ABC + FSN
  const inventoryPolicy = React.useMemo(() => {
    const code = `${vedCategory}-${derivedAbc}-${derivedFsn}`;
    
    if (vedCategory === 'V' && (derivedAbc === 'A' || derivedFsn === 'N')) {
      return {
        code,
        title: 'Capitalized Insurance Spare',
        badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
        strategy: 'Maintain minimum 1 reserved unit permanently in plant store. Zero stockout allowance.',
        procurement: 'OEM Long-Term Service Agreement (LTSA) with 48h emergency replacement courier clause.',
        preservation: 'Climate-controlled storage, nitrogen blanketed packaging, manual shaft rotation every 30 days.',
        recommendedServiceLevel: '99% (Vital Criticality)'
      };
    }

    if (vedCategory === 'V' && derivedFsn === 'F') {
      return {
        code,
        title: 'Vendor-Managed Critical Consumable',
        badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        strategy: 'Continuous Min-Max replenishment. Consignment stock hosted in plant warehouse.',
        procurement: 'Consignment inventory agreement with local distributor; billing triggered upon issue voucher.',
        preservation: 'Store in original desiccated packaging; first-in-first-out (FIFO) inventory rotation.',
        recommendedServiceLevel: '98% - 99%'
      };
    }

    if (vedCategory === 'E' && derivedAbc === 'A') {
      return {
        code,
        title: 'Shared Consortium or Strategic Min-Max',
        badgeColor: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
        strategy: 'Stock 1 safety unit or share spare pool with adjacent sister plant site.',
        procurement: 'Framework contract with guaranteed vendor lead-time SLA and late-delivery penalty.',
        preservation: 'Periodic visual inspection and protective oil film refresh every 6 months.',
        recommendedServiceLevel: '95% (Standard Baseline)'
      };
    }

    if (derivedAbc === 'C' && derivedFsn === 'F') {
      return {
        code,
        title: 'Two-Bin Kanban Replenishment',
        badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        strategy: 'Visual 2-bin system. Order automatic batch lot when Bin 1 empties; Bin 2 covers lead time.',
        procurement: 'Local hardware supplier blanket purchase order with quarterly volume discount.',
        preservation: 'Standard dry store bins. Low risk of shelf-life degradation.',
        recommendedServiceLevel: '90% - 95%'
      };
    }

    return {
      code,
      title: 'Standard Economical Order Point (ROP)',
      badgeColor: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      strategy: 'Standard safety stock buffer sized to lead-time demand standard deviation.',
      procurement: 'Routine purchase requisition triggered whenever inventory balances dip below ROP.',
      preservation: 'Standard shelf storage with routine environmental dust and humidity protection.',
      recommendedServiceLevel: '95%'
    };
  }, [vedCategory, derivedAbc, derivedFsn]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

      <div className="lg:col-span-1">
        <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Part & Reliability Inputs
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Part Description / Tag
            </label>
            <input 
              type="text" 
              value={partName} 
              onChange={e => setPartName(e.target.value)} 
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-cyan-500" 
              placeholder="e.g. Pump Mechanical Seal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Unit Cost ($)
                <HelpTooltip text="Replacement procurement cost per single item. Determines ABC Value class." />
              </label>
              <input 
                type="number" 
                value={unitCost} 
                onChange={e => setUnitCost(e.target.value)} 
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                VED Criticality
                <HelpTooltip text="Vital: line stops immediately; Essential: degraded running/standby; Desirable: minor impact." />
              </label>
              <select
                value={vedCategory}
                onChange={e => setVedCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              >
                <option value="V">V - Vital (Plant Shutdown)</option>
                <option value="E">E - Essential (Degraded)</option>
                <option value="D">D - Desirable (Minor)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                FSN Velocity
                <HelpTooltip text="Fast: >5/yr; Slow: 1-5/yr; Non-moving: <1/yr insurance spare." />
              </label>
              <select
                value={fsnOverride}
                onChange={e => setFsnOverride(e.target.value as any)}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="auto">Auto (from MTBF)</option>
                <option value="F">F - Fast (&gt;5/yr)</option>
                <option value="S">S - Slow (1-5/yr)</option>
                <option value="N">N - Non-moving</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Lead Time (Days)
                <HelpTooltip text="Days to receive the part after placing purchase order." />
              </label>
              <input type="number" value={leadTime} onChange={e => setLeadTime(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                MTBF (Hours)
                <HelpTooltip text="Mean Time Between Failures of this specific component." />
              </label>
              <input type="number" value={mtbf} onChange={e => setMtbf(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Qty Installed
                <HelpTooltip text="Total number of identical operating units in the facility." />
              </label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Annual Usage (Hrs/Unit)
              <HelpTooltip text="Hours per year the equipment runs. 8760 = 24/7 continuous operation." />
            </label>
            <input type="number" value={usage} onChange={e => setUsage(e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Service Level (Target Reliability)
              <HelpTooltip text="Probability that warehouse will have the part in stock when demanded." />
            </label>
            <select
              value={serviceLevelIdx}
              onChange={e => setServiceLevelIdx(parseInt(e.target.value))}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            >
              {SERVICE_LEVELS.map((sl, idx) => (
                <option key={sl.label} value={idx}>{sl.label} (Z = {sl.z})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <Package className="w-4 h-4" /> Calculate Stock & Inventory Policy
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Recommended Reorder Point (ROP)</div>
              <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-2">
                <AnimatedNumber value={result.reorderPoint} /> <span className="text-lg text-slate-500 font-medium">Units</span>
              </div>
              <div className="text-xs text-slate-500">Order immediately when stock drops to this level.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Safety Stock</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                <AnimatedNumber value={result.safetyStock} /> <span className="text-sm text-slate-400 font-normal">Units</span>
              </div>
              <div className="text-xs text-slate-500">Buffer held for demand surges or delays.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Annual Consumption</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                <AnimatedNumber value={result.annualDemand} decimals={1} />
              </div>
              <div className="text-xs text-slate-500">Expected usage per year.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Lead Time Demand</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                <AnimatedNumber value={result.leadTimeDemand} decimals={1} />
              </div>
              <div className="text-xs text-slate-500">Consumption while waiting for resupply.</div>
            </div>
          </div>

          {/* Strategic VED / ABC / FSN Inventory Governance Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-700/80 shadow-xl text-white space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Industrial MRO Governance Framework
                </span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  VED &bull; ABC &bull; FSN Inventory Policy
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${inventoryPolicy.badgeColor}`}>
                  Class: {inventoryPolicy.code}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-bold">VED Criticality</div>
                <div className="text-sm font-bold text-cyan-300">
                  {vedCategory === 'V' ? 'Vital (Zero Outage)' : vedCategory === 'E' ? 'Essential (Degraded)' : 'Desirable (Secondary)'}
                </div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-bold">ABC Value Class</div>
                <div className="text-sm font-bold text-amber-300">
                  Class {derivedAbc} (${costNum.toLocaleString()} / unit)
                </div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-bold">FSN Velocity</div>
                <div className="text-sm font-bold text-emerald-300">
                  {derivedFsn === 'F' ? 'Fast (>5/yr)' : derivedFsn === 'S' ? 'Slow (1-5/yr)' : 'Non-Moving (Insurance)'}
                </div>
              </div>
            </div>

            {/* Recommended Policy Details */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-cyan-400 font-bold block mb-0.5">Recommended Stocking Strategy:</span>
                <p className="text-slate-300 leading-relaxed font-medium">{inventoryPolicy.title} &mdash; {inventoryPolicy.strategy}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Procurement Protocol:</span>
                  <p className="text-slate-300">{inventoryPolicy.procurement}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">MRO Warehouse Preservation:</span>
                  <p className="text-slate-300">{inventoryPolicy.preservation}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-slate-400">
                <span>Recommended Target Service Level: <strong className="text-white">{inventoryPolicy.recommendedServiceLevel}</strong></span>
                <span>Buffer Capital Value: <strong className="text-cyan-300">${(result.safetyStock * costNum).toLocaleString()}</strong></span>
              </div>
            </div>

            {/* 3x3 VED x ABC Interactive Visual Grid */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                VED &times; ABC Decision Matrix Position:
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="p-1 font-bold text-slate-500"></div>
                <div className="p-1.5 bg-slate-800 rounded font-bold text-slate-300">A (High $)</div>
                <div className="p-1.5 bg-slate-800 rounded font-bold text-slate-300">B (Medium $)</div>
                <div className="p-1.5 bg-slate-800 rounded font-bold text-slate-300">C (Low $)</div>

                {/* Row V */}
                <div className="p-2 bg-slate-800 rounded font-bold text-rose-400 flex items-center justify-center">V (Vital)</div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'V' && derivedAbc === 'A' ? 'bg-rose-500/30 border-rose-400 text-white ring-2 ring-rose-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  VA (Insurance Spare)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'V' && derivedAbc === 'B' ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  VB (Strict Min-Max)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'V' && derivedAbc === 'C' ? 'bg-cyan-500/30 border-cyan-400 text-white ring-2 ring-cyan-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  VC (High Safety Stock)
                </div>

                {/* Row E */}
                <div className="p-2 bg-slate-800 rounded font-bold text-amber-400 flex items-center justify-center">E (Essential)</div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'E' && derivedAbc === 'A' ? 'bg-purple-500/30 border-purple-400 text-white ring-2 ring-purple-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  EA (Consortium / SLA)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'E' && derivedAbc === 'B' ? 'bg-cyan-500/30 border-cyan-400 text-white ring-2 ring-cyan-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  EB (Balanced ROP)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'E' && derivedAbc === 'C' ? 'bg-emerald-500/30 border-emerald-400 text-white ring-2 ring-emerald-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  EC (Two-Bin Kanban)
                </div>

                {/* Row D */}
                <div className="p-2 bg-slate-800 rounded font-bold text-emerald-400 flex items-center justify-center">D (Desirable)</div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'D' && derivedAbc === 'A' ? 'bg-slate-800/80 border-slate-600 text-slate-300' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  DA (Order On Demand)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'D' && derivedAbc === 'B' ? 'bg-slate-800/80 border-slate-600 text-slate-300' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  DB (Lean Buffer)
                </div>
                <div className={`p-2 rounded border font-semibold ${vedCategory === 'D' && derivedAbc === 'C' ? 'bg-emerald-500/30 border-emerald-400 text-white ring-2 ring-emerald-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  DC (Bulk Reorder)
                </div>
              </div>
            </div>
          </div>

          {poissonData.spares.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-64 shadow-sm sm:col-span-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-600" /> Poisson Demand Distribution
              </h4>
              <ReactECharts
                option={{
                  animation: false,
                  grid: { left: '10%', right: '5%', top: '10%', bottom: '20%' },
                  tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].value} spares: ${poissonData.probs[p[0].dataIndex]}% probability`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
                  xAxis: { type: 'category', data: poissonData.spares.map(String), name: 'Spares Needed', nameLocation: 'middle', nameGap: 25, axisLabel: { color: chartColors.axis } },
                  yAxis: { type: 'value', name: 'Probability (%)', splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, axisLabel: { color: chartColors.axis } },
                  series: [{
                    type: 'bar',
                    data: poissonData.probs,
                    itemStyle: {
                      color: (params: any) => params.dataIndex <= (result?.reorderPoint || 0) ? '#06b6d4' : '#94a3b8',
                      borderRadius: [4, 4, 0, 0]
                    },
                    label: { show: poissonData.spares.length <= 15, position: 'top', color: chartColors.axis, fontSize: 9, formatter: '{c}%' }
                  }]
                }}
                style={{ height: 'calc(100% - 24px)', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          )}

          {/* Glass-Box Mathematical Trace & Standards Derivation */}
          <CalculationProofDrawer
            title="MRO Spare Parts Inventory Sizing Proof"
            standard="ISO 14224 & IEEE 493 (Gold Book)"
            standardClause="Poisson Arrival Model with Safety Stock Sizing"
            steps={[
              {
                name: "1. Expected Lead-Time Consumption (\u03BC)",
                formula: "\\mu = \\lambda \\cdot L = \\left( \\frac{N \\times U}{\\text{MTBF}} \\right) \\times \\left( \\frac{L}{365} \\right)",
                substitution: `\\mu = \\left( \\frac{${quantity} \\times ${usage}\\text{ hrs}}{${mtbf}\\text{ hrs}} \\right) \\times \\left( \\frac{${leadTime}}{365} \\right) = ${result.leadTimeDemand.toFixed(2)}\\text{ units}`,
                result: `\\mu = ${result.leadTimeDemand.toFixed(2)}\\text{ units}`,
                dimensionalAnalysis: "\\frac{[\\text{failed units}]}{[\\text{procurement replenishment window}]}",
                interpretation: "Nominal expected demand of parts incurred while waiting for purchase order delivery."
              },
              {
                name: `2. Safety Stock Buffer (Z = ${SERVICE_LEVELS[serviceLevelIdx].z.toFixed(2)} @ ${SERVICE_LEVELS[serviceLevelIdx].label} Cycle Service Level)`,
                formula: "SS = \\lceil Z_{\\alpha} \\cdot \\sigma_L \\rceil = \\lceil Z_{\\alpha} \\cdot \\sqrt{\\mu} \\rceil",
                substitution: `SS = \\lceil ${SERVICE_LEVELS[serviceLevelIdx].z.toFixed(2)} \\times \\sqrt{${result.leadTimeDemand.toFixed(2)}} \\rceil = \\lceil ${(SERVICE_LEVELS[serviceLevelIdx].z * Math.sqrt(result.leadTimeDemand)).toFixed(2)} \\rceil = ${result.safetyStock}\\text{ units}`,
                result: `SS = ${result.safetyStock}\\text{ units}`,
                dimensionalAnalysis: "[\\text{discrete buffer stock units}]",
                interpretation: "Prevents plant stockout in the event of unexpected delivery port delays or clustered equipment failures."
              },
              {
                name: "3. Reorder Point (ROP)",
                formula: "\\text{ROP} = \\lceil \\mu + SS \\rceil",
                substitution: `\\text{ROP} = \\lceil ${result.leadTimeDemand.toFixed(2)} + ${result.safetyStock} \\rceil = ${result.reorderPoint}\\text{ units}`,
                result: `\\text{ROP} = ${result.reorderPoint}\\text{ units}`,
                dimensionalAnalysis: "[\\text{on-hand inventory trigger count}]",
                interpretation: `When warehouse stock drops to ${result.reorderPoint} units, trigger an automated purchase requisition in ERP/SAP.`
              }
            ]}
            assumptions={[
              "Demand arrival follows a homogeneous Poisson process (memoryless failure events).",
              `Supplier resupply lead time is deterministic or holds within stated buffer of ${leadTime} calendar days.`,
              `Policy classification ${inventoryPolicy.code} assigns stocking mandate per VED and ABC criteria.`
            ]}
            auditChecklist={[
              "Vital (V) assets require service level \u2265 95% to avoid unmitigated environmental or safety shutdown.",
              "Economic holding cost evaluated against consequence of unscheduled plant trip.",
              "Minimum packaging unit and consignment agreement with OEM confirmed."
            ]}
          />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center text-slate-400">
            <Package className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter MTBF and Lead Time to calculate optimal inventory levels.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Calculation Logic
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div className="bg-white dark:bg-black/20 p-2 rounded border border-slate-200 dark:border-transparent">
              Demand (D) = (Usage × Qty) / MTBF
            </div>
            <div className="bg-white dark:bg-black/20 p-2 rounded border border-slate-200 dark:border-transparent">
              Safety Stock = Z × √ (Lead Time Demand)
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">
            Based on Poisson distribution approximation for slow-moving spare parts (IEC 62550).
          </p>
        </div>
        <div className="mt-4">
          <ShareAndExport 
            toolName="Spare Part Estimator"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={result ? `ROP: ${result.reorderPoint} Units | Policy: ${inventoryPolicy.code}` : ""}
            exportData={[
              { Parameter: "Part Description", Value: partName },
              { Parameter: "Unit Cost ($)", Value: unitCost },
              { Parameter: "VED Criticality", Value: vedCategory },
              { Parameter: "ABC Value Class", Value: derivedAbc },
              { Parameter: "FSN Velocity Class", Value: derivedFsn },
              { Parameter: "Inventory Governance Policy", Value: inventoryPolicy.title },
              { Parameter: "MTBF (Hours)", Value: mtbf },
              { Parameter: "Annual Usage (Hrs)", Value: usage },
              { Parameter: "Qty Installed", Value: quantity },
              { Parameter: "Lead Time (Days)", Value: leadTime },
              { Parameter: "Service Level", Value: SERVICE_LEVELS[serviceLevelIdx].label },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "Reorder Point (ROP)", Value: result ? result.reorderPoint.toString() : "N/A" },
              { Parameter: "Safety Stock", Value: result ? result.safetyStock.toString() : "N/A" },
              { Parameter: "Annual Demand", Value: result ? result.annualDemand.toFixed(2) : "N/A" },
              { Parameter: "Safety Stock Holding Capital ($)", Value: result ? (result.safetyStock * costNum).toFixed(2) : "N/A" }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Statistical Inventory Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Carrying arbitrary inventory costs approximately 20-25% of the capital value per year. Optimal stocking levels directly influence logistics delays, which are factored into operational availability calculations in our <Link to="/tools/availability/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Availability Calculator</Link>.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <TheoryBlock 
          title="Reorder Point (ROP)"
          icon={<TrendingUp className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The critical inventory threshold triggering a replenishment order. Composed of your expected consumption while awaiting the shipment, plus your buffered safety stock.
          </p>
          <code className="block mt-2 font-mono text-center bg-slate-100 dark:bg-slate-900 p-2 rounded text-slate-600 dark:text-slate-400">
            ROP = (Lead Time Demand) + Safety Stock
          </code>
        </TheoryBlock>

        <TheoryBlock 
          title="Safety Stock Tolerance"
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The "Service Level" defines the statistical probability that a part is available the second maintenance reaches for it.
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><strong>99% (High):</strong> "A-Class" critical assets. Unacceptable downtime.</li>
            <li><strong>95% (Standard):</strong> The baseline median for optimal risk-to-cost ratios.</li>
            <li><strong>80% (Low):</strong> Non-essential hardware. Stock-outs are permitted.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="VED & ABC Matrix Classification"
          icon={<Target className="w-5 h-5" />}
          delay={0.3}
        >
          <p>
            Industrial MRO governance pairs physical consequence with financial capital:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><strong>VED:</strong> Vital (line stop), Essential (standby/degraded), Desirable (minor).</li>
            <li><strong>ABC:</strong> High Value (&gt; $1,000), Medium ($200-$1,000), Low (&lt; $200).</li>
            <li><strong>FSN:</strong> Fast moving (&gt; 5/yr), Slow (1-5/yr), Non-moving (Insurance spares).</li>
          </ul>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "How do VED, ABC, and FSN classifications guide spare parts ordering?",
      answer: "VED determines criticality to continuous production, ABC segments parts by capital holding value, and FSN measures issue velocity. A Vital, High-Value, Non-moving part (V-A-N) represents a <strong>Capitalized Insurance Spare</strong> requiring strict climate-controlled preservation, whereas a Desirable, Low-Cost, Fast-moving part (D-C-F) is governed by lean <strong>Two-Bin Kanban</strong> replenishment."
    },
    {
      question: "Can I use this for consumables like oil/filters?",
      answer: "No. Consumables have deterministic demand (you know exactly when you will change them). This tool is for <strong>stochastic</strong> (random) failures, like bearings, seals, or motors breaking unexpectedly."
    },
    {
      question: "What if I don't know the MTBF?",
      answer: "Check the 'Recommended Spare Parts' list from the OEM, use industry data (OREDA/IEEE), or estimate based on how many you used in the last 5 years."
    },
    {
      question: "Why is the Reorder Point sometimes lower than Safety Stock?",
      answer: "It shouldn't be. ROP is always Safety Stock + Lead Time Demand. If Lead Time is 0, then ROP = Safety Stock."
    }
  ];

  return (
    <ToolContentLayout
      title="Spare Part Estimator"
      description="Optimize your MRO inventory. Calculate Safety Stock and Reorder Points (ROP) based on equipment reliability (MTBF) and your acceptable risk level."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="spare part estimator, spare parts forecasting, Poisson spares calculator, inventory service level, critical spares calculator, maintenance inventory, reliability engineering calculator"
      canonicalUrl="https://reliabilitytools.co.in/tools/spares/"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Spare Part Estimator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default SparePartEstimator;