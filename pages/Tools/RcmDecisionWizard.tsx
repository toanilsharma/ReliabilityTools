import React, { useState, useMemo, useRef } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, RotateCcw, Copy, Check, Share2, FileText, Printer } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  title: string;
  question: string;
  tooltip: string;
}

const RCM_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Failure Evidentness',
    question: 'Is the failure mode evident to the operating crew on its own under normal operating conditions?',
    tooltip: 'An evident failure gives direct indication to operators (e.g. alarm, noise, leakage).'
  },
  {
    id: 2,
    title: 'Safety & Environmental Consequence',
    question: 'Does this failure mode cause a safety hazard or breach environmental regulations?',
    tooltip: 'Direct risk of injury, fatality, toxic release, or statutory environmental non-compliance.'
  },
  {
    id: 3,
    title: 'Operational & Financial Impact',
    question: 'Does this failure mode cause significant production downtime loss or direct repair cost?',
    tooltip: 'Financial loss from lost production units, high spare part costs, or customer impact.'
  },
  {
    id: 4,
    title: 'Condition-Based Maintenance (PdM)',
    question: 'Is an on-condition / predictive task (vibration, oil analysis, thermography) technically feasible to detect failure before functional breakdown?',
    tooltip: 'Requires a clear P-F interval where potential failure can be detected before functional failure.'
  },
  {
    id: 5,
    title: 'Scheduled Restoration (Overhaul)',
    question: 'Is a scheduled overhaul task at or before a known age limit technically feasible to reduce failure risk?',
    tooltip: 'Requires a identifiable wear-out age where overhaul restores original reliability.'
  },
  {
    id: 6,
    title: 'Scheduled Discard (Replacement)',
    question: 'Is a scheduled component replacement task at a fixed age limit technically feasible to reduce risk?',
    tooltip: 'Requires a definite safe-life or fatigue life limit where discard eliminates failure risk.'
  },
  {
    id: 7,
    title: 'Failure-Finding Task (Functional Check)',
    question: 'Is a periodic functional check task technically feasible to confirm hidden protective device availability?',
    tooltip: 'Applies to hidden failure modes (e.g. emergency trip valves, relief valves, backup generators).'
  }
];

const RcmDecisionWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [assetName, setAssetName] = useState<string>('Centrifugal Pump P-101 (Bearing Overheating)');
  const [copiedTrail, setCopiedTrail] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentStep]: answer };
    setAnswers(newAnswers);

    // Decision Logic per SAE JA1011 / Nowlan & Heap RCM Decision Diagram
    const isEvident = newAnswers[1];
    const isSafety = newAnswers[2];
    const isOperational = newAnswers[3];
    const isCbmFeasible = newAnswers[4];
    const isRestorationFeasible = newAnswers[5];
    const isDiscardFeasible = newAnswers[6];

    // Branching rules
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (isCbmFeasible) {
        // Condition-Based Task selected
        setCurrentStep(8); // Step 8 = Final Recommendation Screen
        trackToolCalculation('RCM Decision Wizard', 'rcm-decision');
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 5) {
      if (isRestorationFeasible) {
        // Scheduled Restoration selected
        setCurrentStep(8);
        trackToolCalculation('RCM Decision Wizard', 'rcm-decision');
      } else {
        setCurrentStep(6);
      }
    } else if (currentStep === 6) {
      if (isDiscardFeasible) {
        // Scheduled Discard selected
        setCurrentStep(8);
        trackToolCalculation('RCM Decision Wizard', 'rcm-decision');
      } else {
        if (!isEvident) {
          // Hidden failure needs Q7 Failure Finding check
          setCurrentStep(7);
        } else {
          // Evident failure with no feasible proactive task
          setCurrentStep(8);
          trackToolCalculation('RCM Decision Wizard', 'rcm-decision');
        }
      }
    } else if (currentStep === 7) {
      setCurrentStep(8);
      trackToolCalculation('RCM Decision Wizard', 'rcm-decision');
    }
  };

  const decisionResult = useMemo(() => {
    if (currentStep < 8) return null;

    const isEvident = answers[1];
    const isSafety = answers[2];
    const isOperational = answers[3];
    const isCbm = answers[4];
    const isRestoration = answers[5];
    const isDiscard = answers[6];
    const isFailureFinding = answers[7];

    let taskType = 'Run-to-Failure (No Scheduled Maintenance)';
    let colorClass = 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    let actionDesc = 'No proactive maintenance task is technically feasible or cost-effective. Run the asset to failure while maintaining spare parts inventory.';

    if (isCbm) {
      taskType = 'Condition-Based Maintenance (PdM)';
      colorClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      actionDesc = 'Implement predictive monitoring (vibration analysis, oil sampling, thermography) based on P-F interval inspections.';
    } else if (isRestoration) {
      taskType = 'Scheduled Restoration (Major Overhaul)';
      colorClass = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      actionDesc = 'Schedule periodic shop overhaul at or before a specified age limit to restore original component reliability.';
    } else if (isDiscard) {
      taskType = 'Scheduled Discard (Component Replacement)';
      colorClass = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      actionDesc = 'Schedule component replacement at fixed operating age regardless of condition to eliminate fatigue failure risk.';
    } else if (!isEvident && isFailureFinding) {
      taskType = 'Failure-Finding Task (Functional Check)';
      colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      actionDesc = 'Schedule periodic functional checks (e.g., monthly trip test) to confirm hidden protective safety device availability.';
    } else if (isSafety && !isCbm && !isRestoration && !isDiscard) {
      taskType = 'Mandatory Redesign Required';
      colorClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      actionDesc = 'Because a safety or environmental hazard exists and no proactive task reduces risk, redesign of the equipment is mandatory per SAE JA1011!';
    }

    return {
      taskType,
      colorClass,
      actionDesc,
      answers
    };
  }, [currentStep, answers]);

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({});
  };

  const handleCopyTrail = () => {
    if (!decisionResult) return;
    const trailText = RCM_QUESTIONS.map(q => answers[q.id] !== undefined ? `${q.title}: ${answers[q.id] ? 'YES' : 'NO'}` : null).filter(Boolean).join('\n');
    const text = `SAE JA1011 RCM DECISION AUDIT LOG
=====================================
Asset Failure Mode: ${assetName}
Recommended Strategy: ${decisionResult.taskType}

Decision Logic Trail:
${trailText}

Action: ${decisionResult.actionDesc}

Generated via Reliability Tools: https://reliabilitytools.co.in/tools/rcm-decision/`;

    navigator.clipboard.writeText(text);
    setCopiedTrail(true);
    setTimeout(() => setCopiedTrail(false), 2000);
  };

  const faqs = [
    {
      question: 'What is an RCM Decision Logic Tree?',
      answer: 'An RCM Decision Logic Tree (per SAE JA1011) is a standardized series of questions designed to select the most technically feasible and cost-effective maintenance task for each failure mode.'
    },
    {
      question: 'What is a Failure-Finding task?',
      answer: 'Failure-finding tasks are periodic functional tests applied strictly to hidden failure modes (such as relief valves or standby pumps) to ensure protective devices operate when needed.'
    },
    {
      question: 'When is equipment Redesign mandatory in RCM?',
      answer: 'Redesign is mandatory when a failure mode causes a safety or environmental hazard and no proactive maintenance task (PdM, overhaul, replacement) can reduce failure probability to an acceptable level.'
    }
  ];

  const currentQ = RCM_QUESTIONS.find(q => q.id === currentStep);

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Asset Name & Guided Flow */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-cyan-500" /> SAE JA1011 RCM Decision Wizard
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Asset & Failure Mode Description
              </label>
              <input
                type="text"
                value={assetName}
                onChange={e => setAssetName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Step Question Box */}
            {currentStep <= 7 && currentQ && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                  <span>Question {currentStep} of 7 — {currentQ.title}</span>
                  <HelpTooltip text={currentQ.tooltip} />
                </div>

                <p className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    YES
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    NO
                  </button>
                </div>
              </div>
            )}

            {/* Restart Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>
          </div>
        </AnimatedContainer>

        {/* Right Column: Decision Output Card */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">RCM Recommendation</span>
              {decisionResult && (
                <button
                  onClick={handleCopyTrail}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
                >
                  {copiedTrail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTrail ? 'Copied!' : 'Copy Trail'}
                </button>
              )}
            </div>

            {decisionResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border ${decisionResult.colorClass} space-y-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Recommended Task Type</div>
                  <div className="text-lg font-black leading-snug">{decisionResult.taskType}</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engineering Action</div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {decisionResult.actionDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                  <Link
                    to="/learning/rcm-complete-guide/"
                    className="block font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Read Complete RCM Methodology Guide &rarr;
                  </Link>
                  <Link
                    to="/learning/fmea-india-guide/"
                    className="block font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Read FMEA Step-by-Step Guide &rarr;
                  </Link>
                </div>

                <ShareAndExport
                  toolName="RCM Decision Wizard"
                  shareUrl="https://reliabilitytools.co.in/tools/rcm-decision/"
                  resultSummary={`Asset: ${assetName} - Recommendation: ${decisionResult.taskType}`}
                />
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p>Answer the 7 guided questions on the left to generate an RCM task recommendation.</p>
              </div>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding SAE JA1011 RCM Decision Logic</h2>
      <p>
        Reliability-Centered Maintenance (RCM) uses a logical decision process to determine the optimal maintenance strategy for physical assets. Standardized by SAE JA1011, RCM categorizes failure consequences into Evident vs Hidden, Safety/Environmental, Operational, and Non-Operational impacts.
      </p>

      <h3>Hierarchy of Proactive Maintenance Tasks</h3>
      <ol>
        <li><strong>On-Condition (PdM):</strong> Preferred task type whenever a P-F interval can be established.</li>
        <li><strong>Scheduled Restoration:</strong> Fixed-age overhaul applied to wear-out failure modes.</li>
        <li><strong>Scheduled Discard:</strong> Fixed-age component replacement.</li>
        <li><strong>Failure-Finding:</strong> Periodic testing of hidden protective safety devices.</li>
      </ol>
    </div>
  );

  return (
    <ToolContentLayout
      title="RCM Decision Wizard (SAE JA1011 Logic Tree)"
      description="Interactive 7-question Reliability-Centered Maintenance decision wizard to select optimal maintenance task strategies per SAE JA1011 standards."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="rcm decision wizard, SAE JA1011 decision tree, reliability centered maintenance tool, maintenance task selection, condition based maintenance"
      canonicalUrl="https://reliabilitytools.co.in/tools/rcm-decision/"
    />
  );
};

export default RcmDecisionWizard;
