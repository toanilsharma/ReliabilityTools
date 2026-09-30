import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Target,
  Sparkles
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import AnimatedNumber from '../../components/AnimatedNumber';
import CalculationProofDrawer from '../../components/CalculationProofDrawer';
import DegradationTimelineVisualizer from '../../components/DegradationTimelineVisualizer';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface PfState {
  failureMode: string;
  pfDurationDays: string; // P-F interval in days
  inspectionCost: string;  // Cost per inspection ($)
  unplannedCost: string;   // Breakdown cost ($)
  proactiveCost: string;   // Planned repair cost ($)
  mtbfYears: string;       // Mean Time Between Failures (years)
  safetyCritical: boolean; // High criticality requires P-F / 3 or P-F / 4
}

export interface CbmPreset {
  id: string;
  label: string;
  failureMode: string;
  technology: string;
  sensorLocation: string;
  pfDays: number;
  cadence: string;
  inspectionCost: number;
  plannedCost: number;
  unplannedCost: number;
  mtbfYears: number;
  isoStandard: string;
  pPoint: string;
  fPoint: string;
  leadTimeBenefit: string;
}

export const CBM_PRESETS: CbmPreset[] = [
  {
    id: 'bearing-ultrasonic',
    label: 'Bearing Micro-Fatigue (Ultrasonic)',
    failureMode: 'Rolling Element Bearing Subsurface Micro-Cracking',
    technology: 'High-Frequency Acoustic Emission & PeakVue Stress Wave',
    sensorLocation: 'Radial on bearing housing load zone (rigid stud mount)',
    pfDays: 180,
    cadence: 'Monthly route (every 30 days)',
    inspectionCost: 120,
    plannedCost: 2800,
    unplannedCost: 38000,
    mtbfYears: 4.0,
    isoStandard: 'ISO 18436-8 (Condition Monitoring: Ultrasound)',
    pPoint: 'High-frequency stress wave energy spike (> 15 g-sE) with zero velocity increase',
    fPoint: 'Severe spalling, temperature trip (> 95°C), and shaft damage',
    leadTimeBenefit: 'Detects microscopic subsurface shear stress 4–6 months before standard vibration velocity'
  },
  {
    id: 'bearing-vibration',
    label: 'Bearing Surface Spalling (Vibration)',
    failureMode: 'Bearing Outer/Inner Race Spalling & Flaking',
    technology: 'Vibration Velocity Spectrum (FFT) & Envelope Demodulation (HFE)',
    sensorLocation: 'Horizontal, Vertical & Axial on bearing cap',
    pfDays: 60,
    cadence: 'Bi-weekly (every 14-20 days)',
    inspectionCost: 150,
    plannedCost: 3500,
    unplannedCost: 35000,
    mtbfYears: 3.5,
    isoStandard: 'ISO 20816-1 / ISO 10816-3 (Mechanical Vibration Criteria)',
    pPoint: 'BPFO / BPFI bearing defect harmonics with sidebands; overall velocity > 4.5 mm/s',
    fPoint: 'Cage breakup, roller lockup, catastrophic motor rotor-to-stator rub',
    leadTimeBenefit: 'Provides 60-day window to stage replacement bearing and execute during scheduled PM'
  },
  {
    id: 'unbalance-misalignment',
    label: 'Rotor Unbalance / Misalignment',
    failureMode: 'Shaft Dynamic Unbalance & Angular/Offset Misalignment',
    technology: '1X & 2X Harmonics Phase Analysis & Laser Optical Alignment',
    sensorLocation: 'Coupling adjacent radial and axial bearing points',
    pfDays: 120,
    cadence: 'Monthly (every 30 days)',
    inspectionCost: 180,
    plannedCost: 1200,
    unplannedCost: 24000,
    mtbfYears: 2.5,
    isoStandard: 'ISO 1940-1 (Balance Quality) / ANSI/ASA S2.75',
    pPoint: '1X phase stability shift > 30° or 2X axial vibration > 2.8 mm/s',
    fPoint: 'Coupling elastomer shredding, bearing housing fatigue crack, shaft shear',
    leadTimeBenefit: 'Enables quick cold/hot alignment trim without requiring machine overhaul'
  },
  {
    id: 'gearbox-oil',
    label: 'Gearbox Tooth Wear (Oil Analysis)',
    failureMode: 'Gear Tooth Surface Pitting, Micropitting & Scuffing',
    technology: 'Lube Oil Wear Debris Ferrography & Particle Count (ISO 4406)',
    sensorLocation: 'Sump oil drain valve sample port upstream of filter',
    pfDays: 90,
    cadence: 'Monthly (every 30 days)',
    inspectionCost: 220,
    plannedCost: 6500,
    unplannedCost: 85000,
    mtbfYears: 5.0,
    isoStandard: 'ISO 4406 Cleanliness Code / ASTM D7684 Ferrography',
    pPoint: 'Ferrous wear index > 150 ppm; large cutting wear particles > 50 µm',
    fPoint: 'Broken gear teeth, gearbox seizure, full production train shutdown',
    leadTimeBenefit: 'Identifies abrasive particulate wear months before metal chips enter gearbox filters'
  },
  {
    id: 'motor-mcsa',
    label: 'Motor Stator Insulation (MCSA)',
    failureMode: 'Motor Stator Winding Insulation Breakdown & Broken Rotor Bars',
    technology: 'Motor Current Signature Analysis (MCSA) & Offline Tan-Delta',
    sensorLocation: 'MCC starter cabinet CT/PT secondary current clamps',
    pfDays: 45,
    cadence: 'Bi-weekly (every 14-20 days)',
    inspectionCost: 160,
    plannedCost: 4500,
    unplannedCost: 48000,
    mtbfYears: 4.5,
    isoStandard: 'IEEE 522 / IEEE 43 Insulation Resistance Standard',
    pPoint: 'Sideband current peaks around line frequency [f_L(1 ± 2s)] exceed -45 dB',
    fPoint: 'Phase-to-ground flashover, breaker trip, rewind required',
    leadTimeBenefit: 'Prevents motor burn-out by identifying degraded varnish insulation early'
  },
  {
    id: 'pump-seal',
    label: 'Mechanical Seal Leak (Pressure/AE)',
    failureMode: 'Centrifugal Pump Mechanical Seal Face Degradation & Dry Running',
    technology: 'Buffer Fluid Barrier Pressure Differential & Airborne Ultrasound',
    sensorLocation: 'Seal gland barrier fluid pot & atmospheric drain vent',
    pfDays: 21,
    cadence: 'Weekly (every 7 days)',
    inspectionCost: 90,
    plannedCost: 2200,
    unplannedCost: 26000,
    mtbfYears: 2.0,
    isoStandard: 'API 682 (Pumps - Shaft Sealing Systems)',
    pPoint: 'Barrier pot pressure loss > 0.5 bar/day or ultrasonic hissing at gland',
    fPoint: 'Toxic/flammable chemical leakage, environmental reportable incident',
    leadTimeBenefit: 'Prevents hazardous fluid release and expensive shaft sleeve gouging'
  },
  {
    id: 'electrical-ir',
    label: 'Switchgear Busbar (Infrared IR)',
    failureMode: 'High-Resistance Loose Bolted Connection & Phase Imbalance',
    technology: 'Radiometric Thermal Imaging (Infrared Route at >40% load)',
    sensorLocation: 'Open cabinet inspection window (IR viewport camera)',
    pfDays: 60,
    cadence: 'Bi-monthly (every 60 days)',
    inspectionCost: 250,
    plannedCost: 800,
    unplannedCost: 55000,
    mtbfYears: 6.0,
    isoStandard: 'NFPA 70B / ASTM E1934 Thermal Inspection Standard',
    pPoint: 'Connection temperature rise ΔT > 10°C above adjacent phases',
    fPoint: 'Arc-flash incident, busbar melting, substation catastrophic fire',
    leadTimeBenefit: 'Enables 15-minute torquing correction during plant turnaround, eliminating fire risk'
  },
  {
    id: 'valve-passing',
    label: 'Control Valve Passing (Acoustic)',
    failureMode: 'Control Valve Seat Erosion, Cavitation & Internal Leakage',
    technology: 'Acoustic Emission Leak Detection & Smart Positioner Travel Diagnostics',
    sensorLocation: 'Valve body neck downstream of trim seat',
    pfDays: 75,
    cadence: 'Monthly (every 30 days)',
    inspectionCost: 110,
    plannedCost: 1800,
    unplannedCost: 32000,
    mtbfYears: 3.0,
    isoStandard: 'IEC 60534-4 (Industrial-Process Control Valves)',
    pPoint: 'Ultrasonic decibel level > 35 dBµV with valve in closed position',
    fPoint: 'Process contamination, runaway reaction, pressure relief valve lifting',
    leadTimeBenefit: 'Identifies internal seat passing without unbolting or process line isolation'
  }
];

const PfOptimizer: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bearing-vibration');
  const [state, setState] = useShareableState<PfState>({
    failureMode: 'Bearing Outer/Inner Race Spalling & Flaking',
    pfDurationDays: '60', // 2 months
    inspectionCost: '150', // $150 vibration route cost
    unplannedCost: '35000', // $35,000 catastrophic failure + downtime
    proactiveCost: '3500', // $3,500 planned seal & bearing swap
    mtbfYears: '3.5',
    safetyCritical: false
  });

  const { 
    failureMode, 
    pfDurationDays, 
    inspectionCost, 
    unplannedCost, 
    proactiveCost, 
    mtbfYears, 
    safetyCritical 
  } = state;

  const activePreset = CBM_PRESETS.find(p => p.id === selectedPresetId) || CBM_PRESETS[1];

  const handleApplyPreset = (preset: CbmPreset) => {
    setSelectedPresetId(preset.id);
    setState({
      failureMode: preset.failureMode,
      pfDurationDays: String(preset.pfDays),
      inspectionCost: String(preset.inspectionCost),
      unplannedCost: String(preset.unplannedCost),
      proactiveCost: String(preset.plannedCost),
      mtbfYears: String(preset.mtbfYears),
      safetyCritical: preset.id === 'pump-seal' || preset.id === 'electrical-ir'
    });
  };

  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'pf-interval-optimizer',
      name: 'P-F Interval Optimizer',
      path: '/tools/pf-interval-optimizer/'
    });
  }, []);

  const pfDays = Math.max(1, parseFloat(pfDurationDays) || 60);
  const costInsp = Math.max(0, parseFloat(inspectionCost) || 0);
  const costUnplanned = Math.max(0, parseFloat(unplannedCost) || 0);
  const costProactive = Math.max(0, parseFloat(proactiveCost) || 0);
  const numMtbfYears = Math.max(0.1, parseFloat(mtbfYears) || 3.5);

  // RCM Standard Inspection Frequency:
  // Standard rule: Interval = (P-F) / 2
  // High Criticality / Safety rule: Interval = (P-F) / 3
  const divisor = safetyCritical ? 3 : 2;
  const optimalIntervalDays = Math.max(1, Math.round(pfDays / divisor));
  const leadTimeDays = pfDays - optimalIntervalDays;

  // Annual Financials
  const annualInspections = 365 / optimalIntervalDays;
  const annualInspectionCost = annualInspections * costInsp;

  // Annual Expected Unplanned Failures without PdM = 1 / MTBF
  const annualFailuresBaseline = 1 / numMtbfYears;
  const baselineAnnualFailureCost = annualFailuresBaseline * costUnplanned;

  // With PdM: Failures caught proactively
  const pdmAnnualCost = (annualFailuresBaseline * costProactive) + annualInspectionCost;
  const netAnnualSavings = Math.max(0, baselineAnnualFailureCost - pdmAnnualCost);
  const roiPct = annualInspectionCost > 0 ? (netAnnualSavings / annualInspectionCost) * 100 : 0;

  const ToolComponent = (
    <div className="space-y-8">
      {/* Failure Mechanism Presets Selector */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
            Industrial Failure Mechanism & Technology Presets
          </span>
          <span className="text-xs text-slate-500">
            Click to auto-populate established ISO / RCM values
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CBM_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                }`}
              >
                <div className="font-bold truncate">{preset.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  P-F: {preset.pfDays}d &bull; {preset.cadence}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              SAE JA1011 / JA1012 Reliability-Centered Maintenance
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              P-F Degradation & Inspection Parameters
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Safety / High Criticality Asset:
            </label>
            <input
              type="checkbox"
              checked={safetyCritical}
              onChange={(e) => setState({ ...state, safetyCritical: e.target.checked })}
              className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Asset & Failure Mode Description
            </label>
            <input
              type="text"
              value={failureMode}
              onChange={(e) => setState({ ...state, failureMode: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              P-F Interval Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={pfDurationDays}
              onChange={(e) => setState({ ...state, pfDurationDays: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">Potential detection to Functional failure</span>
          </div>
        </div>

        {/* Economic Values */}
        <div className="grid md:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Inspection Cost / Event ($)
            </label>
            <input
              type="number"
              value={inspectionCost}
              onChange={(e) => setState({ ...state, inspectionCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Planned Repair Cost ($)
            </label>
            <input
              type="number"
              value={proactiveCost}
              onChange={(e) => setState({ ...state, proactiveCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              Unplanned Failure Cost ($)
            </label>
            <input
              type="number"
              value={unplannedCost}
              onChange={(e) => setState({ ...state, unplannedCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-900/60 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Asset Baseline MTBF (Years)
            </label>
            <input
              type="number"
              step="0.5"
              value={mtbfYears}
              onChange={(e) => setState({ ...state, mtbfYears: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block">Recommended Task Interval</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            Every <AnimatedNumber value={optimalIntervalDays} /> Days
          </span>
          <span className="text-[11px] text-slate-400">
            {safetyCritical ? 'Rule: (P-F) / 3' : 'Rule: (P-F) / 2'}
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block">Minimum Warning Lead Time</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            <AnimatedNumber value={leadTimeDays} /> Days
          </span>
          <span className="text-[11px] text-slate-400">
            Guaranteed planning window
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block">Net Annual Savings</span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-1 block">
            <AnimatedNumber value={Math.round(netAnnualSavings)} prefix="$" />
          </span>
          <span className="text-[11px] text-slate-400">
            Avoided breakdown downtime
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block">Condition Monitoring ROI</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            <AnimatedNumber value={Math.round(roiPct)} suffix="%" />
          </span>
          <span className="text-[11px] text-slate-400">
            Annual insp cost: ${Math.round(annualInspectionCost).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Interactive Physics-Informed Degradation Digital Twin Simulator */}
      <DegradationTimelineVisualizer
        pfIntervalHours={pfDays * 24}
        inspectionIntervalHours={optimalIntervalDays * 24}
        technologyName={activePreset.technology}
        leadTimeHours={leadTimeDays * 24}
      />

      {/* CBM Technology & Sensor Placement Protocol Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              Diagnostic Protocol & Standards Matrix
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {activePreset.technology}
            </h4>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
            {activePreset.isoStandard}
          </span>
        </div>

        {/* Visual Timeline Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Point P: Detectable Defect</span>
            <span>Task Interval: {optimalIntervalDays}d</span>
            <span>Intervention Window: {leadTimeDays}d</span>
            <span>Point F: Functional Failure</span>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${(optimalIntervalDays / pfDays) * 100}%` }} 
              className="bg-cyan-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
              title={`Max Inspection Gap: ${optimalIntervalDays} Days`}
            >
              Inspection Interval
            </div>
            <div 
              style={{ width: `${(leadTimeDays / pfDays) * 100}%` }} 
              className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
              title={`Protected Lead Time: ${leadTimeDays} Days`}
            >
              Guaranteed Lead Time
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              Sensor Mounting Point & Technique:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {activePreset.sensorLocation}
            </p>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
              Lead Time Operational Advantage:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {activePreset.leadTimeBenefit}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50 space-y-1">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              Point P Alarm Threshold (Potential Failure):
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              {activePreset.pPoint}
            </p>
          </div>
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/50 space-y-1">
            <span className="font-bold text-rose-800 dark:text-rose-300 block">
              Point F Consequence (Functional Failure):
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              {activePreset.fPoint}
            </p>
          </div>
        </div>
      </div>

      {/* Glass-Box Step-by-Step Mathematical Derivation & Standards Proof */}
      <CalculationProofDrawer
        title="P-F Interval & Inspection Cadence Proof"
        standard="SAE JA1011 / JA1012 & ISO 17359"
        standardClause="SAE JA1011 §5.5 (On-Condition Tasks)"
        steps={[
          {
            name: "1. Optimal Inspection Cadence (Nyquist Condition Sampling)",
            formula: "T_{\\text{insp}} \\le \\frac{P-F}{k} \\quad (k = 2 \\text{ standard}, k = 3 \\text{ critical})",
            substitution: `T_{\\text{insp}} = \\frac{${pfDays}\\text{ days}}{${divisor}} = ${optimalIntervalDays}\\text{ days}`,
            result: `T_{\\text{insp}} = ${optimalIntervalDays}\\text{ days}`,
            dimensionalAnalysis: "\\frac{[\\text{calendar days}]}{[\\text{inspection frequency}]}",
            interpretation: "Guarantees at least 1-2 inspections occur within the P-F degradation window before functional breakdown."
          },
          {
            name: "2. Actionable Lead-Time Buffer (Planning Window)",
            formula: "T_{\\text{lead}} = (P-F) - T_{\\text{insp}}",
            substitution: `T_{\\text{lead}} = ${pfDays}\\text{ days} - ${optimalIntervalDays}\\text{ days} = ${leadTimeDays}\\text{ days}`,
            result: `T_{\\text{lead}} = ${leadTimeDays}\\text{ days}`,
            dimensionalAnalysis: "[\\text{days of advance notice}]",
            interpretation: "Maintenance planners have this guaranteed buffer to kit parts, stage scaffolding, and plan scheduled outage."
          },
          {
            name: "3. Annual Net Cost Avoidance & PdM ROI",
            formula: "\\Delta C = \\left( \\frac{C_{\\text{unplanned}}}{\\text{MTBF}} \\right) - \\left[ \\left( \\frac{C_{\\text{planned}}}{\\text{MTBF}} \\right) + C_{\\text{insp}} \\cdot \\left( \\frac{365}{T_{\\text{insp}}} \\right) \\right]",
            substitution: `\\Delta C = \\left(\\frac{\\$${costUnplanned}}{${numMtbfYears}}\\right) - \\left[\\left(\\frac{\\$${costProactive}}{${numMtbfYears}}\\right) + \\$${costInsp} \\cdot ${Math.round(annualInspections)}\\right] = \\$${Math.round(netAnnualSavings).toLocaleString()}`,
            result: `\\text{Net Savings} = \\$${Math.round(netAnnualSavings).toLocaleString()}/\\text{yr}`,
            dimensionalAnalysis: "\\frac{[\\text{currency}]}{[\\text{operating year}]}",
            interpretation: `Generating a ${Math.round(roiPct)}% return on condition monitoring investment.`
          }
        ]}
        assumptions={[
          "Failure mode degradation follows a monotonic P-F curve without abrupt stress-induced rupture.",
          `Detection technology (${activePreset.technology}) has demonstrated probability of detection (PoD > 95%) at Point P.`,
          "Repairs conducted before Point F prevent secondary damage to impellers, casings, and drive trains."
        ]}
        auditChecklist={[
          "SAE JA1011 §5.5.1: Clear potential failure condition (Point P) physically defined.",
          "SAE JA1011 §5.5.2: P-F interval is consistent and predictable under continuous operating conditions.",
          "SAE JA1011 §5.5.3: Task interval is less than P-F interval with sufficient lead time to take preventative action."
        ]}
      />

      <ShareAndExport
        toolName="P-F Interval Optimization Calculator"
        shareUrl="https://reliabilitytools.co.in/tools/pf-interval-optimizer/"
        resultSummary={`Optimal Interval: Every ${optimalIntervalDays} Days | Net Savings: $${Math.round(netAnnualSavings).toLocaleString()}/yr`}
        pdfData={{
          inputs: {
            "Asset / Failure Mode": failureMode,
            "CBM Technology": activePreset.technology,
            "Applicable Standard": activePreset.isoStandard,
            "P-F Interval": `${pfDurationDays} Days`,
            "Inspection Cost": `$${inspectionCost}`,
            "Planned Repair Cost": `$${proactiveCost}`,
            "Unplanned Failure Cost": `$${unplannedCost}`,
            "Baseline MTBF": `${mtbfYears} Years`,
            "High Criticality": safetyCritical ? "Yes (P-F / 3)" : "No (P-F / 2)"
          },
          results: {
            "Optimal Inspection Interval": `Every ${optimalIntervalDays} Days`,
            "Minimum Lead Time": `${leadTimeDays} Days`,
            "Net Annual Savings": `$${Math.round(netAnnualSavings).toLocaleString()}/yr`,
            "PdM Program ROI": `${Math.round(roiPct)}%`
          }
        }}
        exportData={[
          { Parameter: "Failure Mode", Value: failureMode },
          { Parameter: "Technology", Value: activePreset.technology },
          { Parameter: "Governing Standard", Value: activePreset.isoStandard },
          { Parameter: "P-F Days", Value: pfDays },
          { Parameter: "Optimal Task Interval (Days)", Value: optimalIntervalDays },
          { Parameter: "Intervention Window (Days)", Value: leadTimeDays },
          { Parameter: "Annual Inspections", Value: Math.round(annualInspections) },
          { Parameter: "Annual Savings ($)", Value: Math.round(netAnnualSavings) },
          { Parameter: "ROI (%)", Value: Math.round(roiPct) }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Condition-Based Maintenance: <span className="text-cyan-600 dark:text-cyan-400">The P-F Interval & RCM Principles</span>
        </h2>
        <p>
          In Reliability-Centered Maintenance (RCM), equipment failure is not an instantaneous event; it is a progressive physical degradation process. The <strong>P-F Curve</strong> (pioneered by John Moubray and codified under <strong>SAE JA1011</strong> and <strong>SAE JA1012</strong>) illustrates the timeline from the point where a potential failure (<InlineMath math="P" />) becomes detectable until functional failure (<InlineMath math="F" />) occurs.
        </p>
        <p>
          The duration between point <InlineMath math="P" /> and point <InlineMath math="F" /> is the <strong>P-F Interval</strong>. To guarantee that a developing defect is intercepted before catastrophic breakdown, predictive maintenance (PdM) condition monitoring tasks—such as vibration spectrum analysis, infrared thermography, and acoustic ultrasound—must be executed at mathematically optimized intervals governed by the P-F curve.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The Two Cardinal Rules of P-F Task Selection
        </h3>
        <p>
          Per SAE JA1011 Section 5.5, an on-condition predictive maintenance task is technically feasible and compliant only if it satisfies two fundamental criteria:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Clear Potential Failure Point:</strong> There must exist a distinct, measurable physical indicator of impending failure (e.g. 4 kHz bearing cage defect frequencies, 5°C thermal gradient rise on an electrical breaker lug).
          </li>
          <li>
            <strong>Reasonably Consistent P-F Interval:</strong> The time span between point <InlineMath math="P" /> and point <InlineMath math="F" /> must be consistent enough to establish an inspection frequency, and must be substantially longer than the administrative lead time required to order parts, schedule craft labor, and isolate the machine.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of P-F Optimization: Formulas & Standards
        </h2>
        <p>
          To ensure that a developing fault is reliably detected regardless of where in the cycle it initiates, RCM standards establish the <strong>Half-Interval Rule</strong>:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Inspection Interval } (T_{\text{insp}}) \le \frac{P-F}{2}" />
        </div>
        <p>
          This guarantees a minimum warning lead time (<InlineMath math="T_{\text{lead}}" />) for corrective intervention:
        </p>
        <div className="my-6">
          <BlockMath math="T_{\text{lead}} = (P-F) - T_{\text{insp}} \ge \frac{P-F}{2}" />
        </div>
        <p>
          For critical production bottlenecks or environmental/safety hazards, conservative asset management policies under <strong>ISO 55000</strong> apply a third or quarter interval divisor:
        </p>
        <div className="my-6">
          <BlockMath math="T_{\text{insp, critical}} = \frac{P-F}{3} \quad \text{or} \quad \frac{P-F}{4}" />
        </div>
        <p>
          The financial viability of the on-condition task is validated when total annual PdM cost is significantly less than the unmitigated failure consequences:
        </p>
        <div className="my-4">
          <BlockMath math="\text{Net Annual Savings} = \left(\frac{C_{\text{unplanned}} - C_{\text{proactive}}}{\text{MTBF}}\right) - \left(\frac{365}{T_{\text{insp}}} \times C_{\text{insp}}\right)" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Heavy Crusher Gearbox Bearing
        </h3>
        <p>
          A cement ball mill trunnion gearbox bearing failure mode exhibits an established P-F interval of <strong>90 days</strong> using high-frequency vibration acceleration enveloping:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>P-F duration: 90 days</li>
          <li>Inspection route cost: $120 per test</li>
          <li>Catastrophic unplanned failure cost (gear tooth stripping + 36 hr kiln downtime): $85,000</li>
          <li>Planned proactive bearing swap during scheduled weekend stop: $6,000</li>
          <li>Mean Time Between Failures: 4.0 years</li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Determine Task Interval:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="T_{\text{insp}} = \frac{90 \text{ days}}{2} = 45 \text{ days}" />
        </div>
        <p>
          The vibration analysis route must be conducted at least <strong>every 45 days</strong> (or monthly in practice).
        </p>
        <p>
          <strong>Step 2: Warning Lead Time:</strong>
          If a defect initiates 1 day after an inspection, the next inspection 44 days later will catch the defect with:
          <InlineMath math="T_{\text{lead}} = 90 - 45 = 45\text{ days}" /> remaining before failure. This provides ample time to procure specialized spherical roller bearings and arrange rigging cranes.
        </p>
        <p>
          <strong>Step 3: Annual Cost-Benefit:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{Avoided Annual Breakdown Cost} = \frac{\$85,000 - \$6,000}{4.0} = \$19,750 \text{ /year}" />
          <BlockMath math="\text{Annual PdM Route Cost} = \left(\frac{365}{45}\right) \times \$120 \approx \$973 \text{ /year}" />
          <BlockMath math="\text{Net Annual Benefit} = \$19,750 - \$973 = \$18,777 \text{ /year } (\text{ROI } \approx 1,930\%)" />
        </div>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in P-F Curve Condition Monitoring
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Setting Task Interval Equal to the P-F Interval:</strong> If <InlineMath math="T_{\text{insp}} = P-F" /> (e.g. testing every 90 days for a 90-day P-F interval), a defect starting immediately after an inspection will reach complete failure 1 day before the next scheduled reading.
          </li>
          <li>
            <strong>Using a Technology with an Insufficient P-F Lead Time:</strong> Human sensory inspections (audible noise or tactile heat) occur very late on the P-F curve (often only hours or days before seizure), leaving zero administrative time to prevent catastrophic secondary damage.
          </li>
          <li>
            <strong>Treating P-F as Constant Across Different Speeds:</strong> The P-F interval is measured in operating cycles, not calendar days. A fan bearing rotating at 3,600 RPM has a P-F interval in days that is four times shorter than an identical bearing operating at 900 RPM.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Why must the inspection interval be less than half the P-F interval?",
      answer: "Setting the inspection interval to less than half the P-F interval (T ≤ (P-F) / 2) mathematically ensures that at least one inspection occurs between potential failure point P and functional failure point F, guaranteeing at least half the P-F duration as an administrative warning window."
    },
    {
      question: "What is the difference between Point P and Point F on the P-F Curve?",
      answer: "Point P (Potential Failure) is the earliest detectable physical symptom of degradation (e.g. sub-surface fatigue spalling detected via ultrasound or vibration). Point F (Functional Failure) is the moment the asset is no longer able to perform its intended operational function."
    },
    {
      question: "What international standards govern RCM and P-F intervals?",
      answer: "Reliability-Centered Maintenance criteria and P-F interval principles are defined by <strong>SAE JA1011</strong> (Evaluation Criteria for Reliability-Centered Maintenance (RCM) Processes) and <strong>SAE JA1012</strong> (A Guide to the Reliability-Centered Maintenance (RCM) Standard), aligned with <strong>ISO 55000</strong> asset management."
    }
  ];

  return (
    <ToolContentLayout
      title="P-F Interval Optimizer Calculator – Free Online | Reliability Tools"
      description="Determine optimal condition monitoring inspection frequencies along the P-F interval curve per SAE JA1011, SAE JA1012, and ISO 55000 asset management rules."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="pf-interval-optimizer" />
        </>
      }
      faqs={faqs}
      keywords="P-F interval calculator, condition monitoring frequency, RCM calculator, SAE JA1011, SAE JA1012, ISO 55000, predictive maintenance interval, vibration frequency calculator"
      canonicalUrl="https://reliabilitytools.co.in/tools/pf-interval-optimizer/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "P-F Interval Optimizer Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "SAE JA1011 / SAE JA1012 / ISO 55000",
          description: "Society of Automotive Engineers standards for Reliability-Centered Maintenance criteria and condition monitoring P-F interval optimization."
        }
      }}
    />
  );
};

export default PfOptimizer;
