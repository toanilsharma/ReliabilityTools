import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  RotateCcw,
  Activity,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Gauge,
  Layers,
  Clock,
  HelpCircle
} from 'lucide-react';
import { calculateMTBF, calculateAvailability, calculateWeibull } from '../services/reliabilityMath';

export type WizardGoal = 'mtbf' | 'availability' | 'weibull' | 'fmea' | 'oee' | 'k-out-of-n' | 'pm-replacement';

interface GoalOption {
  id: WizardGoal;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  badge: string;
  colorTheme: 'cyan' | 'blue' | 'purple' | 'rose' | 'emerald' | 'amber' | 'indigo';
  route: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'mtbf',
    title: 'MTBF & Failure Rate',
    shortDesc: 'Calculate Mean Time Between Failures from operational hours and failure counts.',
    icon: Activity,
    badge: 'Popular',
    colorTheme: 'cyan',
    route: '/tools/mtbf-calculator'
  },
  {
    id: 'availability',
    title: 'System Availability %',
    shortDesc: 'Determine inherent uptime percentage from MTBF and MTTR metrics.',
    icon: CheckCircle,
    badge: 'High Value',
    colorTheme: 'teal',
    route: '/tools/availability-calculator'
  },
  {
    id: 'weibull',
    title: 'Weibull Life Analysis',
    shortDesc: 'Fit failure points to find shape parameter (\u03B2) and wear-out phase.',
    icon: TrendingUp,
    badge: 'Statistical',
    colorTheme: 'purple',
    route: '/tools/weibull-calculator'
  },
  {
    id: 'fmea',
    title: 'FMEA Risk Priority (RPN)',
    shortDesc: 'Score failure mode risk priority (Severity \u00D7 Occurrence \u00D7 Detection).',
    icon: AlertTriangle,
    badge: 'ISO Standard',
    colorTheme: 'rose',
    route: '/fmea-tool'
  },
  {
    id: 'oee',
    title: 'OEE Equipment Efficiency',
    shortDesc: 'Calculate Overall Equipment Effectiveness (Availability \u00D7 Performance \u00D7 Quality).',
    icon: Gauge,
    badge: 'TPM Key KPI',
    colorTheme: 'emerald',
    route: '/oee-calculator'
  },
  {
    id: 'k-out-of-n',
    title: 'K-out-of-N Redundancy',
    shortDesc: 'Calculate voting system reliability where K units out of N must operate.',
    icon: Layers,
    badge: 'Safety Systems',
    colorTheme: 'blue',
    route: '/tools/k-out-of-n'
  },
  {
    id: 'pm-replacement',
    title: 'Optimal PM Age',
    shortDesc: 'Find the cost-optimal age to preventively replace a component.',
    icon: Clock,
    badge: 'Cost Saver',
    colorTheme: 'amber',
    route: '/tools/pm-optimization'
  }
];

const QuickStartWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<WizardGoal>('mtbf');
  const [copied, setCopied] = useState(false);

  // Input states for each tool type
  const [mtbfInputs, setMtbfInputs] = useState({ operatingHours: '8760', failures: '4' });
  const [availInputs, setAvailInputs] = useState({ mtbf: '2190', mttr: '12' });
  const [weibullInputs, setWeibullInputs] = useState({ times: '120, 250, 410, 580, 920' });
  const [fmeaInputs, setFmeaInputs] = useState({ severity: '8', occurrence: '5', detection: '3' });
  const [oeeInputs, setOeeInputs] = useState({ availabilityPct: '92', performancePct: '95', qualityPct: '98' });
  const [kInputs, setKInputs] = useState({ n: '3', k: '2', unitR: '0.95' });
  const [pmInputs, setPmInputs] = useState({ costPreventive: '500', costFailure: '5000', beta: '2.5', eta: '1200' });

  // Preset Handlers
  const applyPreset = (type: string) => {
    if (selectedGoal === 'mtbf') {
      if (type === 'pump') setMtbfInputs({ operatingHours: '17500', failures: '2' });
      if (type === 'motor') setMtbfInputs({ operatingHours: '43800', failures: '3' });
      if (type === 'electronics') setMtbfInputs({ operatingHours: '100000', failures: '1' });
    } else if (selectedGoal === 'availability') {
      if (type === 'high') setAvailInputs({ mtbf: '5000', mttr: '2' });
      if (type === 'medium') setAvailInputs({ mtbf: '1000', mttr: '8' });
      if (type === 'critical') setAvailInputs({ mtbf: '8760', mttr: '4' });
    }
  };

  const handleCopyResults = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentGoalConfig = GOAL_OPTIONS.find(g => g.id === selectedGoal) || GOAL_OPTIONS[0];

  // Computation logic for Step 3
  const getResults = () => {
    switch (selectedGoal) {
      case 'mtbf': {
        const hrs = parseFloat(mtbfInputs.operatingHours) || 0;
        const fails = parseFloat(mtbfInputs.failures) || 1;
        const mtbf = calculateMTBF(hrs, fails);
        const failureRate = hrs > 0 ? (fails / hrs) : 0;
        return {
          primaryValue: `${mtbf.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hours`,
          primaryLabel: 'Mean Time Between Failures (MTBF)',
          secondaryValue: `${failureRate.toExponential(4)} failures/hr`,
          secondaryLabel: 'Failure Rate (\u03BB)',
          status: mtbf > 4000 ? 'High Reliability' : mtbf > 1000 ? 'Moderate Reliability' : 'Requires Attention',
          statusColor: mtbf > 4000 ? 'emerald' : mtbf > 1000 ? 'amber' : 'rose',
          formula: 'MTBF = Operating Hours / Total Failures',
          summaryText: `MTBF Analysis: Operating Hours = ${hrs}, Failures = ${fails}. Calculated MTBF = ${mtbf.toFixed(1)} hrs (\u03BB = ${failureRate.toExponential(4)} failures/hr).`
        };
      }
      case 'availability': {
        const mtbf = parseFloat(availInputs.mtbf) || 1;
        const mttr = parseFloat(availInputs.mttr) || 0;
        const availPct = calculateAvailability(mtbf, mttr);
        const downtimeYr = ((100 - availPct) / 100) * 8760;
        return {
          primaryValue: `${availPct.toFixed(3)}%`,
          primaryLabel: 'Inherent Availability (A_i)',
          secondaryValue: `${downtimeYr.toFixed(1)} Hours/Year`,
          secondaryLabel: 'Estimated Annual Downtime',
          status: availPct >= 99.9 ? 'Class-3 (Three Nines)' : availPct >= 99 ? 'High Availability' : 'Sub-Optimal Availability',
          statusColor: availPct >= 99 ? 'emerald' : 'amber',
          formula: 'Availability = MTBF / (MTBF + MTTR)',
          summaryText: `Availability Analysis: MTBF = ${mtbf} hrs, MTTR = ${mttr} hrs. Availability = ${availPct.toFixed(3)}% (Downtime = ${downtimeYr.toFixed(1)} hrs/yr).`
        };
      }
      case 'weibull': {
        const points = weibullInputs.times.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0);
        if (points.length < 2) {
          return {
            primaryValue: 'Input Invalid',
            primaryLabel: 'Requires at least 2 time-to-failure numbers',
            secondaryValue: 'N/A',
            secondaryLabel: 'Shape \u03B2',
            status: 'Input Error',
            statusColor: 'rose',
            formula: 'R(t) = exp(-(t/\u03B7)^\u03B2)',
            summaryText: 'Weibull Analysis: Invalid input points.'
          };
        }
        const weibResult = calculateWeibull(points.map(t => ({ time: t, suspended: false })));
        const phase = weibResult.beta < 0.9 ? 'Infant Mortality (Early Life)' : weibResult.beta <= 1.1 ? 'Random Failures (Useful Life)' : 'Wear-Out Phase (Aging)';
        return {
          primaryValue: `\u03B2 = ${weibResult.beta.toFixed(2)}, \u03B7 = ${weibResult.eta.toFixed(1)} hrs`,
          primaryLabel: 'Weibull Parameters (Shape \u03B2 & Scale \u03B7)',
          secondaryValue: `${weibResult.b10.toFixed(1)} Hours`,
          secondaryLabel: 'B10 Life (90% Reliability)',
          status: phase,
          statusColor: weibResult.beta > 1.2 ? 'amber' : weibResult.beta < 0.9 ? 'rose' : 'emerald',
          formula: 'Weibull Distribution: F(t) = 1 - exp(-(t/\u03B7)^\u03B2)',
          summaryText: `Weibull Analysis: Data points = ${points.join(', ')}. Shape \u03B2 = ${weibResult.beta.toFixed(2)}, Scale \u03B7 = ${weibResult.eta.toFixed(1)} hrs, B10 Life = ${weibResult.b10.toFixed(1)} hrs.`
        };
      }
      case 'fmea': {
        const s = parseInt(fmeaInputs.severity) || 1;
        const o = parseInt(fmeaInputs.occurrence) || 1;
        const d = parseInt(fmeaInputs.detection) || 1;
        const rpn = s * o * d;
        const actionReq = rpn >= 200 ? 'Critical Priority - Immediate Action Required' : rpn >= 100 ? 'High Priority - Plan Mitigation' : 'Low to Moderate Risk';
        return {
          primaryValue: `RPN = ${rpn}`,
          primaryLabel: 'Risk Priority Number (Severity \u00D7 Occurrence \u00D7 Detection)',
          secondaryValue: `S:${s} \u00B7 O:${o} \u00B7 D:${d}`,
          secondaryLabel: 'Input Scores (Scale 1-10)',
          status: actionReq,
          statusColor: rpn >= 200 ? 'rose' : rpn >= 100 ? 'amber' : 'emerald',
          formula: 'RPN = Severity \u00D7 Occurrence \u00D7 Detection',
          summaryText: `FMEA Analysis: Severity = ${s}, Occurrence = ${o}, Detection = ${d}. RPN = ${rpn} (${actionReq}).`
        };
      }
      case 'oee': {
        const a = (parseFloat(oeeInputs.availabilityPct) || 0) / 100;
        const p = (parseFloat(oeeInputs.performancePct) || 0) / 100;
        const q = (parseFloat(oeeInputs.qualityPct) || 0) / 100;
        const oee = a * p * q * 100;
        const rating = oee >= 85 ? 'World Class (85%+)' : oee >= 70 ? 'Typical Industrial Level' : 'Significant Improvement Needed';
        return {
          primaryValue: `${oee.toFixed(2)}%`,
          primaryLabel: 'Overall Equipment Effectiveness (OEE)',
          secondaryValue: `A:${(a*100).toFixed(0)}% \u00B7 P:${(p*100).toFixed(0)}% \u00B7 Q:${(q*100).toFixed(0)}%`,
          secondaryLabel: 'Component Breakdown',
          status: rating,
          statusColor: oee >= 85 ? 'emerald' : oee >= 70 ? 'blue' : 'amber',
          formula: 'OEE = Availability \u00D7 Performance \u00D7 Quality',
          summaryText: `OEE Analysis: Availability = ${(a*100).toFixed(0)}%, Performance = ${(p*100).toFixed(0)}%, Quality = ${(q*100).toFixed(0)}%. Calculated OEE = ${oee.toFixed(2)}%.`
        };
      }
      case 'k-out-of-n': {
        const n = parseInt(kInputs.n) || 1;
        const k = parseInt(kInputs.k) || 1;
        const r = parseFloat(kInputs.unitR) || 0.9;
        
        // Binomial combination
        const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);
        const nCr = (nVal: number, rVal: number) => factorial(nVal) / (factorial(rVal) * factorial(nVal - rVal));
        
        let sysR = 0;
        for (let i = k; i <= n; i++) {
          sysR += nCr(n, i) * Math.pow(r, i) * Math.pow(1 - r, n - i);
        }
        
        return {
          primaryValue: `${(sysR * 100).toFixed(3)}%`,
          primaryLabel: `System Reliability (${k}-out-of-${n} Redundancy)`,
          secondaryValue: `Unit R = ${(r * 100).toFixed(1)}%`,
          secondaryLabel: 'Single Component Reliability',
          status: sysR > r ? 'Redundancy Gain Active' : 'No Redundancy Benefit',
          statusColor: 'emerald',
          formula: 'R_sys = \u2211 [n! / (i!(n-i)!)] \u00D7 R^i \u00D7 (1-R)^(n-i)',
          summaryText: `K-out-of-N Analysis: N = ${n}, K = ${k}, Unit R = ${r}. System Reliability = ${(sysR * 100).toFixed(3)}%.`
        };
      }
      case 'pm-replacement': {
        const cp = parseFloat(pmInputs.costPreventive) || 100;
        const cf = parseFloat(pmInputs.costFailure) || 1000;
        const b = parseFloat(pmInputs.beta) || 2.0;
        const eta = parseFloat(pmInputs.eta) || 1000;

        // Approx optimal age for Weibull PM: t_opt ≈ eta * [ (Cp / (Cf * (b - 1))) ^ (1 / b) ]
        let tOpt = 0;
        if (b > 1 && cf > cp) {
          tOpt = eta * Math.pow(cp / (cf * (b - 1)), 1 / b);
        }

        return {
          primaryValue: tOpt > 0 ? `${tOpt.toFixed(0)} Hours` : 'No PM Advantage (Beta \u2264 1)',
          primaryLabel: 'Optimal Preventive Replacement Age (t_opt)',
          secondaryValue: `Cost Ratio: 1:${(cf/cp).toFixed(1)}`,
          secondaryLabel: 'Failure vs Preventive Cost Ratio',
          status: b > 1 ? 'Preventive Replacement Saves Cost' : 'Run-to-Failure Recommended (\u03B2 \u2264 1)',
          statusColor: b > 1 ? 'emerald' : 'amber',
          formula: 't_opt \u2248 \u03B7 \u00D7 [ C_p / (C_f \u00D7 (\u03B2 - 1)) ]^(1/\u03B2)',
          summaryText: `PM Replacement Age: Cp = ${cp}, Cf = ${cf}, \u03B2 = ${b}, \u03B7 = ${eta}. Optimal Replacement Age = ${tOpt > 0 ? tOpt.toFixed(0) + ' hrs' : 'N/A'}.`
        };
      }
    }
  };

  const results = getResults();

  return (
    <div id="quick-start-wizard" className="scroll-mt-24 max-w-5xl mx-auto px-4">
      {/* Wizard Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>

        <div className="p-6 md:p-10">
          {/* Header Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Quick Start Guided Wizard
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Reliability Calculation in <span className="text-cyan-600 dark:text-cyan-400">3 Simple Steps</span>
              </h2>
            </div>

            {/* Stepper Progress Badges */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentStep === 1 ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
                <span>Select Goal</span>
              </div>

              <div className="w-4 h-0.5 bg-slate-200 dark:bg-slate-800"></div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentStep === 2 ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
                <span>Enter Data</span>
              </div>

              <div className="w-4 h-0.5 bg-slate-200 dark:bg-slate-800"></div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentStep === 3 ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
                <span>Results</span>
              </div>
            </div>
          </div>

          {/* STEP 1: SELECT GOAL */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">What do you want to calculate today?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Choose your calculation objective below to launch the guided setup.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GOAL_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedGoal === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedGoal(option.id)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-lg ring-2 ring-cyan-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-3 rounded-xl ${
                            isSelected
                              ? 'bg-cyan-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {option.badge}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {option.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          {option.shortDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-500'}`}>
                          {isSelected ? 'Selected' : 'Click to Select'}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Next: Enter Your Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER DATA */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-cyan-50/50 dark:bg-cyan-950/20 p-4 rounded-2xl border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-600 text-white rounded-lg">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Target Goal: {currentGoalConfig.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{currentGoalConfig.shortDesc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
                >
                  Change Goal
                </button>
              </div>

              {/* Dynamic Inputs Based on Goal */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                {selectedGoal === 'mtbf' && (
                  <>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
                      <button onClick={() => applyPreset('pump')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">Pumps</button>
                      <button onClick={() => applyPreset('motor')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">Motors</button>
                      <button onClick={() => applyPreset('electronics')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">Electronics</button>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Total Operational Hours (t)
                      </label>
                      <input
                        type="number"
                        value={mtbfInputs.operatingHours}
                        onChange={(e) => setMtbfInputs({ ...mtbfInputs, operatingHours: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Number of Inherent Failures (r)
                      </label>
                      <input
                        type="number"
                        value={mtbfInputs.failures}
                        onChange={(e) => setMtbfInputs({ ...mtbfInputs, failures: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {selectedGoal === 'availability' && (
                  <>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
                      <button onClick={() => applyPreset('high')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">High Uptime</button>
                      <button onClick={() => applyPreset('medium')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">Standard Plant</button>
                      <button onClick={() => applyPreset('critical')} className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-cyan-600">Critical Asset</button>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">MTBF (Hours)</label>
                      <input
                        type="number"
                        value={availInputs.mtbf}
                        onChange={(e) => setAvailInputs({ ...availInputs, mtbf: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">MTTR (Hours)</label>
                      <input
                        type="number"
                        value={availInputs.mttr}
                        onChange={(e) => setAvailInputs({ ...availInputs, mttr: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {selectedGoal === 'weibull' && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Time-to-Failure Data Points (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={weibullInputs.times}
                      onChange={(e) => setWeibullInputs({ times: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono text-sm"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Example: 120, 250, 410, 580, 920 (Hours)</span>
                  </div>
                )}

                {selectedGoal === 'fmea' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Severity (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={fmeaInputs.severity}
                        onChange={(e) => setFmeaInputs({ ...fmeaInputs, severity: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Occurrence (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={fmeaInputs.occurrence}
                        onChange={(e) => setFmeaInputs({ ...fmeaInputs, occurrence: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Detection (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={fmeaInputs.detection}
                        onChange={(e) => setFmeaInputs({ ...fmeaInputs, detection: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedGoal === 'oee' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Availability %</label>
                      <input
                        type="number"
                        value={oeeInputs.availabilityPct}
                        onChange={(e) => setOeeInputs({ ...oeeInputs, availabilityPct: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Performance %</label>
                      <input
                        type="number"
                        value={oeeInputs.performancePct}
                        onChange={(e) => setOeeInputs({ ...oeeInputs, performancePct: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Quality %</label>
                      <input
                        type="number"
                        value={oeeInputs.qualityPct}
                        onChange={(e) => setOeeInputs({ ...oeeInputs, qualityPct: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedGoal === 'k-out-of-n' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Total Units (N)</label>
                      <input
                        type="number"
                        value={kInputs.n}
                        onChange={(e) => setKInputs({ ...kInputs, n: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Required (K)</label>
                      <input
                        type="number"
                        value={kInputs.k}
                        onChange={(e) => setKInputs({ ...kInputs, k: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Unit R (0 to 1)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={kInputs.unitR}
                        onChange={(e) => setKInputs({ ...kInputs, unitR: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedGoal === 'pm-replacement' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Preventive Cost (Cp)</label>
                      <input
                        type="number"
                        value={pmInputs.costPreventive}
                        onChange={(e) => setPmInputs({ ...pmInputs, costPreventive: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Failure Cost (Cf)</label>
                      <input
                        type="number"
                        value={pmInputs.costFailure}
                        onChange={(e) => setPmInputs({ ...pmInputs, costFailure: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Weibull Shape (\u03B2)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pmInputs.beta}
                        onChange={(e) => setPmInputs({ ...pmInputs, beta: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Weibull Scale (\u03B7)</label>
                      <input
                        type="number"
                        value={pmInputs.eta}
                        onChange={(e) => setPmInputs({ ...pmInputs, eta: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Calculate Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS + EXPORT */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700/80">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 3 Result Output</span>
                    <h3 className="text-2xl font-extrabold">{currentGoalConfig.title}</h3>
                  </div>
                  <span className={`self-start md:self-auto text-xs font-extrabold px-3 py-1.5 rounded-full border ${
                    results.statusColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : results.statusColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {results.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">{results.primaryLabel}</span>
                    <span className="text-3xl font-black text-cyan-400 leading-tight block">{results.primaryValue}</span>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">{results.secondaryLabel}</span>
                    <span className="text-xl font-bold text-slate-200 leading-tight block">{results.secondaryValue}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300">
                  <span className="text-slate-500 block mb-1 font-sans font-semibold">Standard Engineering Formula:</span>
                  <code>{results.formula}</code>
                </div>
              </div>

              {/* Action Buttons: Export & Launch Full Tool */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Calculation
                  </button>

                  <button
                    onClick={() => handleCopyResults(results.summaryText)}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>

                <Link
                  to={currentGoalConfig.route}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Launch Dedicated Full Tool</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartWizard;
