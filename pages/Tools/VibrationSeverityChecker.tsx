import React, { useState, useMemo, useRef } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, Info, Copy, Check, Share2, TrendingUp } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface VibrationState {
  rmsVelocity: string;
  machineGroup: 'group1' | 'group2' | 'group3' | 'group4';
}

const MACHINE_GROUPS = [
  { id: 'group1', label: 'Group 1: Large Machines (> 300 kW, Rigid Foundation)', desc: 'Large electric motors, steam turbines, and heavy industrial drives.' },
  { id: 'group2', label: 'Group 2: Medium Machines (15 kW – 300 kW, Rigid Foundation)', desc: 'Medium-sized electric motors, blowers, and general machinery.' },
  { id: 'group3', label: 'Group 3: Industrial Pumps (Rigid Foundation)', desc: 'Multi-vane centrifugal pumps with separate drivers on rigid foundations.' },
  { id: 'group4', label: 'Group 4: Industrial Pumps (Flexible Foundation)', desc: 'Centrifugal pumps on flexible or isolated structural skid foundations.' }
];

const VibrationSeverityChecker: React.FC = () => {
  const [state, setState] = useState<VibrationState>({
    rmsVelocity: '3.2',
    machineGroup: 'group2'
  });

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toolRef = useRef<HTMLDivElement>(null);

  const { rmsVelocity, machineGroup } = state;

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const v = parseFloat(rmsVelocity);
    if (!rmsVelocity || isNaN(v) || v < 0) {
      newErrors.rmsVelocity = 'Enter a valid RMS velocity in mm/s (≥ 0).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      trackToolCalculation('Vibration Severity Checker', 'vibration-severity');
    }
  };

  const evaluationResult = useMemo(() => {
    const v = parseFloat(rmsVelocity) || 0;

    let zone: 'A' | 'B' | 'C' | 'D' = 'A';
    let zoneTitle = 'Zone A (Good)';
    let zoneColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    let cardBg = 'from-emerald-950/40 to-slate-900 border-emerald-500/30';
    let recommendation = 'Unrestricted long-term operation. Machine is operating within ideal vibration limits.';
    let limits = { zoneA: 1.4, zoneB: 2.8, zoneC: 4.5 };

    if (machineGroup === 'group1') {
      limits = { zoneA: 2.3, zoneB: 4.5, zoneC: 7.1 };
    } else if (machineGroup === 'group2') {
      limits = { zoneA: 1.4, zoneB: 2.8, zoneC: 4.5 };
    } else if (machineGroup === 'group3') {
      limits = { zoneA: 1.8, zoneB: 3.5, zoneC: 7.1 };
    } else if (machineGroup === 'group4') {
      limits = { zoneA: 2.8, zoneB: 5.6, zoneC: 9.3 };
    }

    if (v <= limits.zoneA) {
      zone = 'A';
      zoneTitle = 'Zone A (Good)';
      zoneColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      cardBg = 'from-emerald-950/40 to-slate-900 border-emerald-500/30';
      recommendation = 'Unrestricted long-term operation. Newly commissioned or freshly overhauled machine condition.';
    } else if (v <= limits.zoneB) {
      zone = 'B';
      zoneTitle = 'Zone B (Acceptable)';
      zoneColor = 'bg-yellow-500/20 text-amber-400 border-yellow-500/40';
      cardBg = 'from-amber-950/40 to-slate-900 border-amber-500/30';
      recommendation = 'Acceptable for long-term continuous operation. Continue routine vibration trend monitoring.';
    } else if (v <= limits.zoneC) {
      zone = 'C';
      zoneTitle = 'Zone C (Unsatisfactory)';
      zoneColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      cardBg = 'from-orange-950/40 to-slate-900 border-orange-500/30';
      recommendation = 'Unsatisfactory severity. Investigate root cause (unbalance, misalignment, bearing looseness) and schedule corrective maintenance during next planned outage.';
    } else {
      zone = 'D';
      zoneTitle = 'Zone D (Unacceptable / Danger)';
      zoneColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      cardBg = 'from-rose-950/40 to-slate-900 border-rose-500/30';
      recommendation = 'Dangerous vibration level! High risk of structural damage or catastrophic breakdown. Take immediate shutdown or emergency maintenance action.';
    }

    return {
      zone,
      zoneTitle,
      zoneColor,
      cardBg,
      recommendation,
      limits
    };
  }, [rmsVelocity, machineGroup]);

  const handleCopySnippet = () => {
    const text = `ISO 20816 Vibration Severity Evaluation:
- Machine Group: ${MACHINE_GROUPS.find(g => g.id === machineGroup)?.label}
- RMS Velocity: ${rmsVelocity} mm/s
- Evaluation Zone: ${evaluationResult.zoneTitle}
- Recommendation: ${evaluationResult.recommendation}
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/vibration-severity/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is ISO 20816-1 / ISO 10816 vibration severity standard?',
      answer: 'ISO 20816 (which supersedes ISO 10816) establishes international vibration severity criteria for industrial machinery based on broadband RMS velocity (mm/s) measured on non-rotating structural parts.'
    },
    {
      question: 'What do Zones A, B, C, and D mean?',
      answer: 'Zone A represents newly commissioned equipment condition; Zone B is acceptable for unrestricted long-term operation; Zone C is unsatisfactory requiring planned corrective maintenance; Zone D is unacceptable vibration risking catastrophic failure.'
    },
    {
      question: 'Why is RMS velocity (mm/s) used instead of displacement or acceleration?',
      answer: 'RMS velocity directly correlates to fatigue stress and kinetic energy destruction in rotating machinery across mid-frequency operational ranges (10 Hz to 1000 Hz).'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-cyan-500" /> Vibration Inputs
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Vibration Velocity (RMS mm/s)</span>
                <HelpTooltip text="Overall vibration velocity measured in RMS mm/s (10 Hz – 1000 Hz band)." />
              </label>
              <input
                type="number"
                step="any"
                value={rmsVelocity}
                onChange={e => setState(s => ({ ...s, rmsVelocity: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.rmsVelocity && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.rmsVelocity}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ISO Machine Classification Group
              </label>
              <div className="space-y-2">
                {MACHINE_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setState(s => ({ ...s, machineGroup: g.id as any }))}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                      machineGroup === g.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <div>{g.label}</div>
                    <div className="text-[10px] opacity-80 font-normal mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Evaluate Vibration Severity
            </button>
          </form>
        </AnimatedContainer>

        {/* Results Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          <div className={`bg-gradient-to-br ${evaluationResult.cardBg} p-6 md:p-8 rounded-3xl border text-white shadow-2xl space-y-6 relative overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">ISO 20816 / ISO 10816 Standard Evaluation</span>
                <h4 className="text-2xl md:text-3xl font-black text-white mt-1">Vibration Severity Assessment</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
              </button>
            </div>

            {/* Severity Zone Card */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400">ISO Evaluation Zone</div>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-black border ${evaluationResult.zoneColor}`}>
                  {evaluationResult.zoneTitle}
                </div>
                <div className="text-xs text-slate-300 font-medium pt-1">
                  Measured Velocity: <strong className="text-white">{rmsVelocity} mm/s RMS</strong>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400">ISO Group Thresholds</div>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>Zone A: ≤ {evaluationResult.limits.zoneA} mm/s</div>
                  <div>Zone B: {evaluationResult.limits.zoneA} – {evaluationResult.limits.zoneB} mm/s</div>
                  <div>Zone C: {evaluationResult.limits.zoneB} – {evaluationResult.limits.zoneC} mm/s</div>
                  <div>Zone D: &gt; {evaluationResult.limits.zoneC} mm/s</div>
                </div>
              </div>
            </div>

            {/* Action Recommendation Banner */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Recommended Engineering Action
              </span>
              <p className="text-sm md:text-base font-extrabold text-white leading-relaxed">
                {evaluationResult.recommendation}
              </p>
            </div>

            <ShareAndExport
              toolName="Vibration Severity Checker"
              shareUrl="https://reliabilitytools.co.in/tools/vibration-severity/"
              resultSummary={`${rmsVelocity} mm/s - ${evaluationResult.zoneTitle}`}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding ISO 20816 Machinery Vibration Severity</h2>
      <p>
        Machinery vibration analysis is the primary predictive maintenance (PdM) technique for evaluating the structural condition of rotating equipment. ISO 20816-1 establishes international criteria for evaluating broadband vibration velocity measured on non-rotating bearings.
      </p>

      <h3>Vibration Zones Defined</h3>
      <ul>
        <li><strong>Zone A (Good):</strong> Vibration of newly commissioned machines entering service.</li>
        <li><strong>Zone B (Acceptable):</strong> Acceptable for long-term unrestricted continuous operation.</li>
        <li><strong>Zone C (Unsatisfactory):</strong> Indicates incipient mechanical defects; machine may operate temporarily until planned corrective maintenance.</li>
        <li><strong>Zone D (Unacceptable):</strong> Dangerous vibration levels capable of causing rapid failure or structural fatigue.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="Vibration Severity Checker (ISO 20816)"
      description="Evaluate machinery vibration severity (RMS mm/s) per ISO 20816-1 / ISO 10816 standards with instant Zone A/B/C/D classification and action recommendations."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="vibration severity checker, ISO 20816 vibration limits, ISO 10816 vibration severity chart, vibration RMS velocity mm/s, predictive maintenance"
      canonicalUrl="https://reliabilitytools.co.in/tools/vibration-severity/"
    />
  );
};

export default VibrationSeverityChecker;
