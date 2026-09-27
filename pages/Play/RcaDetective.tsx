import React, { useState, useEffect } from 'react';
import { 
  Search, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { trackGameCompleted, trackResultShared } from '../../utils/analytics';
import { getPlayerProfile } from '../../utils/playStorage';

interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  snippet: string;
  details: string;
  isRedHerring?: boolean;
}

interface MysteryCase {
  id: string;
  title: string;
  asset: string;
  plant: string;
  lossValue: string;
  incidentBrief: string;
  evidence: EvidenceItem[];
  fiveWhySteps: {
    question: string;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  }[];
  rootCauses: {
    physical: string;
    human: string;
    latent: string;
  };
  forensicExplanation: string;
  relatedToolLinks: { name: string; url: string }[];
}

const CASES: MysteryCase[] = [
  {
    id: 'case-101',
    title: 'The Catastrophic Feedwater Pump Seal Fracture',
    asset: 'High-Pressure Boiler Feedwater Pump 2A (3,200 kW)',
    plant: 'Apex Power Generation Station',
    lossValue: '$148,000 in unscheduled turbine derate downtime',
    incidentBrief: 'At 03:14 AM during a rapid boiler load ramp from 60% to 95%, Boiler Feedwater Pump 2A suffered a catastrophic mechanical seal blowout, spewing 160°C demineralized feedwater into the pump bay. High vibration trip sensors engaged automatically.',
    evidence: [
      {
        id: 'ev-1',
        title: 'SCADA DCS Historian Trend',
        source: 'Process Control Network',
        snippet: 'Seal flush buffer pressure dropped from 42 bar to 18 bar 4 minutes before vibration spiked.',
        details: 'The trend shows suction pressure remained steady at 12 bar, but seal flush cooling water plan 23 temperature rose from 45°C to 118°C just prior to the seal face thermal shattering.'
      },
      {
        id: 'ev-2',
        title: 'Lubricating Oil ICP Lab Report',
        source: 'Condition Monitoring Lab',
        snippet: 'Bearing oil iron (Fe) 12 ppm, Copper (Cu) 4 ppm — normal baseline levels.',
        details: 'Lab analysis confirms bearing wear was minimal. The bearings did not seize or cause shaft deflection prior to the seal failure.',
        isRedHerring: true
      },
      {
        id: 'ev-3',
        title: 'Fractography Inspection of Seal Faces',
        source: 'Metallurgical Lab Analysis',
        snippet: 'Silicon Carbide (SiC) rotating seal ring exhibits severe thermal heat checking radial micro-cracks.',
        details: 'Microscopic inspection revealed concentric blue temper discoloration and radial thermal stress fractures, indicating dry running and instant vapor flashing across the seal faces.'
      },
      {
        id: 'ev-4',
        title: 'Operator Shift Handover Log',
        source: 'Operations Control Room',
        snippet: '"Auxiliary cooling water recirculation valve CW-402 was throttled 80% closed during previous night shift cleaning."',
        details: 'The night shift throttled valve CW-402 to suppress pipe water hammer noises without notifying day engineers or logging a work order tag.'
      }
    ],
    fiveWhySteps: [
      {
        question: 'Why did Boiler Feedwater Pump 2A trip on high vibration?',
        options: [
          { text: 'The silicon carbide mechanical seal catastrophically fractured, releasing high-pressure water', isCorrect: true, feedback: 'Correct: The mechanical seal blew out, spraying 160°C feedwater and causing dynamic rotor vibration.' },
          { text: 'The thrust bearing seized due to lack of lubrication', isCorrect: false, feedback: 'Incorrect: Evidence 2 showed normal iron and copper levels in bearing oil.' },
          { text: 'The motor driver suffered electrical insulation flashover', isCorrect: false, feedback: 'Incorrect: The driver remained fully energized until vibration tripped the breaker.' }
        ]
      },
      {
        question: 'Why did the silicon carbide seal faces thermal-stress and shatter?',
        options: [
          { text: 'The flush liquid inside the seal chamber flashed to vapor, creating dry running and extreme frictional heat', isCorrect: true, feedback: 'Correct: Without adequate cooling, water reached saturation temperature and flashed into steam.' },
          { text: 'The manufacturer supplied counterfeit off-spec seal faces', isCorrect: false, feedback: 'Incorrect: Inspection confirmed genuine OEM sintered silicon carbide material.' },
          { text: 'Excessive shaft radial misalignment over 2.5 mm', isCorrect: false, feedback: 'Incorrect: Shaft runout was measured within ISO alignment tolerances.' }
        ]
      },
      {
        question: 'Why did the seal chamber liquid reach steam saturation temperature?',
        options: [
          { text: 'Cooling water flow through API Plan 23 heat exchanger was starved', isCorrect: true, feedback: 'Correct: Seal flush temperature spiked to 118°C because cooling supply was restricted.' },
          { text: 'The boiler steam superheater overheated the main reservoir', isCorrect: false, feedback: 'Incorrect: Main suction supply water remained at standard 160°C operating temperature.' },
          { text: 'The pump impeller was spinning backwards', isCorrect: false, feedback: 'Incorrect: Non-return check valves were fully functional.' }
        ]
      },
      {
        question: 'Why was cooling water flow through the Plan 23 heat exchanger starved?',
        options: [
          { text: 'Cooling isolation valve CW-402 was throttled 80% closed during an unlogged shift adjustment', isCorrect: true, feedback: 'Correct: Evidence 4 proved the night operator throttled valve CW-402 to stop water hammer without paperwork.' },
          { text: 'A cooling water pipe ruptured underground', isCorrect: false, feedback: 'Incorrect: Header pressure in the plant utility water system was stable.' },
          { text: 'The heat exchanger coils were 100% blocked with calcium scale', isCorrect: false, feedback: 'Incorrect: The heat exchanger had been descaled 3 weeks prior.' }
        ]
      },
      {
        question: 'What is the latent organizational root cause behind valve CW-402 being throttled?',
        options: [
          { text: 'Lack of Lock-Out / Tag-Out (LOTO) valve position car-sealing and missing Management of Change (MOC) protocol for utility adjustments', isCorrect: true, feedback: 'Correct! The latent root cause is that safety-critical cooling valves had no car-seal locks or MOC procedures to prevent unauthorized position changes.' },
          { text: 'The operators had not taken a basic mechanical engineering degree', isCorrect: false, feedback: 'Incorrect: Blaming individual qualifications ignores system-level procedural defenses.' },
          { text: 'The pump manufacturer had a poor warranty policy', isCorrect: false, feedback: 'Incorrect: Warranty policies do not prevent unauthorized plant valve tampering.' }
        ]
      }
    ],
    rootCauses: {
      physical: 'Mechanical seal face thermal dry-running and vapor-lock thermal shock fracture.',
      human: 'Operator throttled manual cooling water isolation valve CW-402 without authorization to suppress pipe noise.',
      latent: 'Absence of Valve Car-Seal locks, missing Critical Valve Registry, and lack of MOC enforcement for auxiliary cooling systems.'
    },
    forensicExplanation: 'This classic industrial failure illustrates the danger of treating auxiliary cooling as non-critical. Because manual valve CW-402 was not locked open (Car-Sealed Open), an unlogged human adjustment starved the API Plan 23 heat exchanger. During load increase, heat buildup vaporized water between the seal faces, causing frictional heating and brittle fracture in seconds.',
    relatedToolLinks: [
      { name: '5-Why RCA Tool', url: '/tools/5-why/' },
      { name: 'Ishikawa Fishbone Tool', url: '/tools/fishbone/' },
      { name: 'FMEA RPN Calculator', url: '/tools/fmea/' },
      { name: 'Downtime Cost Calculator', url: '/tools/downtime-cost/' }
    ]
  },
  {
    id: 'case-102',
    title: 'The Rotary Kiln Main Gearbox Pinion Shear',
    asset: 'Heavy Helical Reducer Gearbox (450 kW, 3.2 RPM)',
    plant: 'Apex Cement & Mineral Processing Plant',
    lossValue: '$210,000 in lost clinker production & emergency crane rental',
    incidentBrief: 'At 16:42, the primary rotary kiln main drive came to an abrupt halt with a deafening metallic bang. High motor torque overload tripped the drive inverter. Emergency inspection revealed intermediate pinion teeth sheared completely off.',
    evidence: [
      {
        id: 'ev-1',
        title: 'Oil Lab Spectrometric Ferrogram',
        source: 'Used Oil Laboratory',
        snippet: 'Severe cutting fatigue micro-flakes and large abnormal copper-alloy brass particles detected 3 weeks earlier.',
        details: 'The oil analysis showed ASTM D5185 iron was 240 ppm (threshold 80 ppm). The lab report recommended urgent borescopic inspection, but the email was marked unread in the maintenance inbox.'
      },
      {
        id: 'ev-2',
        title: 'Vibration FFT Spectrum from Previous Month',
        source: 'Online PdM System',
        snippet: 'High 1X intermediate shaft sidebands around gear mesh frequency (GMF = 142 Hz).',
        details: 'The FFT spectrum showed prominent tooth mesh harmonics and sidebands indicative of gear tooth pitch-line pitting and dynamic eccentric wobble.'
      },
      {
        id: 'ev-3',
        title: 'Broken Pinion Fractographic Examination',
        source: 'Failure Analysis Institute',
        snippet: 'Beach marks propagating from root fillet radius indicating multi-cycle bending fatigue, followed by final ductile shear overload.',
        details: 'SEM imaging demonstrated progressive fatigue beach marks initiating from heavy pitch-line micro-pitting stress concentration notches at the dedendum fillet.'
      },
      {
        id: 'ev-4',
        title: 'Maintenance Lubrication Route Checklist',
        source: 'Plant CMMS Records',
        snippet: 'Synthetic ISO VG 460 gear oil was topped up with standard ISO VG 68 hydraulic oil during last preventive servicing.',
        details: 'Technicians grabbed an unmarked transfer container from the lube room containing low-viscosity hydraulic oil, reducing operating viscosity film thickness by 65%.'
      }
    ],
    fiveWhySteps: [
      {
        question: 'Why did the rotary kiln intermediate pinion shear off?',
        options: [
          { text: 'High-cycle bending fatigue initiated from root pitting stress notches and propagated to final fracture', isCorrect: true, feedback: 'Correct: SEM fractography confirmed classic progressive bending fatigue beach marks.' },
          { text: 'The kiln shell was struck by lightning', isCorrect: false, feedback: 'Incorrect: No electrical surge was recorded on grounding rods.' },
          { text: 'A boulder fell directly onto the pinion gear', isCorrect: false, feedback: 'Incorrect: The gearbox housing was fully enclosed.' }
        ]
      },
      {
        question: 'Why did severe tooth pitting and stress notches develop at the dedendum fillet?',
        options: [
          { text: 'Elastohydrodynamic (EHL) oil film collapsed, creating boundary metal-to-metal tooth contact', isCorrect: true, feedback: 'Correct: Without adequate viscosity, asperities made contact, causing high localized contact stress and pitting.' },
          { text: 'The gear teeth were made of mild cast iron', isCorrect: false, feedback: 'Incorrect: Pinion was forged 18CrNiMo7-6 carburized case-hardened alloy steel.' },
          { text: 'Ambient dust caused chemical corrosion', isCorrect: false, feedback: 'Incorrect: Chemical testing confirmed clean oil with zero acid buildup.' }
        ]
      },
      {
        question: 'Why did the elastohydrodynamic lubricant film collapse?',
        options: [
          { text: 'Operating oil viscosity was severely degraded because ISO VG 460 was topped up with ISO VG 68 oil', isCorrect: true, feedback: 'Correct: Mixing ISO 68 hydraulic oil into ISO 460 gear oil reduced viscosity from 460 cSt to under 160 cSt.' },
          { text: 'The gearbox was operated with zero oil inside', isCorrect: false, feedback: 'Incorrect: Sump level was full to the high sight glass mark.' },
          { text: 'The plant ambient temperature reached 90°C', isCorrect: false, feedback: 'Incorrect: Ambient temperature was normal 28°C.' }
        ]
      },
      {
        question: 'Why was low-viscosity ISO VG 68 oil added to the high-load industrial gearbox?',
        options: [
          { text: 'Unmarked, shared oil transfer jugs were stored in the lube room without color-coded labeling or dedicated filtration carts', isCorrect: true, feedback: 'Correct: Technicians had no visual distinction between oil containers in the oil storage shed.' },
          { text: 'The purchasing department canceled all gear oil orders', isCorrect: false, feedback: 'Incorrect: Proper gear oil drums were in the warehouse.' },
          { text: 'The gearbox manufacturer specified ISO 68 oil', isCorrect: false, feedback: 'Incorrect: Nameplate clearly specified ISO VG 460 synthetic.' }
        ]
      },
      {
        question: 'What is the latent organizational root cause behind the lube cross-contamination and unread oil lab reports?',
        options: [
          { text: 'Absence of Lubrication Excellence Program (color-coding, dedicated transfer carts) and broken PdM alert triage workflow in CMMS', isCorrect: true, feedback: 'Correct! The organization lacked 5S lubrication storage standards and had no closed-loop SLA for reviewing critical oil lab and vibration alerts.' },
          { text: 'Kiln speed was set 2% too high by management', isCorrect: false, feedback: 'Incorrect: Kiln speed was within design specifications.' },
          { text: 'The gearbox should have been replaced with a direct-drive magnet motor', isCorrect: false, feedback: 'Incorrect: Gearboxes operate reliably when lubricated properly.' }
        ]
      }
    ],
    rootCauses: {
      physical: 'EHL film breakdown leading to severe tooth pitting and high-cycle bending fatigue tooth fracture.',
      human: 'Technician cross-contaminated gearbox by pouring ISO 68 hydraulic oil from an unmarked transfer jug into ISO 460 gearbox.',
      latent: 'Lack of Lubrication 5S standard (color-coded containers, dedicated pumps) and absence of closed-loop CMMS notification workflow for critical lab alerts.'
    },
    forensicExplanation: 'Over 70% of gear and bearing failures trace back to improper lubrication. In this case, cross-contamination silently lowered viscosity below the minimum Elasto-Hydrodynamic Lubrication threshold. Even though the lab detected the resulting wear weeks early, the failure occurred because the alert was never assigned to an actionable work order.',
    relatedToolLinks: [
      { name: 'Gearbox Reliability Calculator', url: '/tools/gearbox/' },
      { name: 'Lubricant Life Optimizer', url: '/tools/lubricant-life/' },
      { name: 'Bearing Life Calculator', url: '/tools/bearing-life/' },
      { name: '5-Why RCA Tool', url: '/tools/5-why/' }
    ]
  }
];

const RcaDetective: React.FC = () => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const currentCase = CASES[selectedCaseIdx];

  const [openedEvidence, setOpenedEvidence] = useState<Record<string, boolean>>({});
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const toggleEvidence = (evId: string) => {
    setOpenedEvidence(prev => ({ ...prev, [evId]: !prev[evId] }));
  };

  const handleSelectOption = (stepIdx: number, optIdx: number) => {
    const isCorrect = currentCase.fiveWhySteps[stepIdx].options[optIdx].isCorrect;
    setSelectedAnswers(prev => ({ ...prev, [stepIdx]: optIdx }));

    if (isCorrect) {
      setStepErrors(prev => ({ ...prev, [stepIdx]: false }));
      if (stepIdx + 1 < currentCase.fiveWhySteps.length) {
        setTimeout(() => setCurrentStepIdx(stepIdx + 1), 700);
      } else {
        // Completed all steps
        setIsCompleted(true);
        const allCorrectFirstTry = Object.keys(stepErrors).length === 0;
        const finalScore = allCorrectFirstTry ? 100 : 80;
        setScore(finalScore);
        trackGameCompleted('RCA Detective', finalScore);
      }
    } else {
      setStepErrors(prev => ({ ...prev, [stepIdx]: true }));
    }
  };

  const resetInvestigation = () => {
    setOpenedEvidence({});
    setCurrentStepIdx(0);
    setSelectedAnswers({});
    setStepErrors({});
    setIsCompleted(false);
    setScore(0);
  };

  const shareText = `🔍 I solved '${currentCase.title}' on RCA Detective with a score of ${score}/100! Can you uncover the latent root cause? Play: https://reliabilitytools.co.in/play/rca-detective/`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      trackResultShared('copy_link', 'RCA Detective');
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEO 
        title="RCA Detective – Root Cause Failure Investigation Game | Reliability Tools"
        description="Solve real-world industrial equipment failure mysteries. Inspect SCADA trends, oil lab reports, and fractography to deduce physical and latent root causes."
        canonicalUrl="https://reliabilitytools.co.in/play/rca-detective/"
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
          <Search className="w-4 h-4" /> Industrial Incident Forensic Simulation
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          RCA <span className="text-amber-500">Detective</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Step into the shoes of a Chief Reliability Forensic Investigator. Analyze catastrophic machine failures, examine real lab evidence, drill down through the 5-Why chain, and expose physical, human, and latent organizational root causes.
        </p>

        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseIdx(idx);
                resetInvestigation();
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                selectedCaseIdx === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500/40'
              }`}
            >
              Case #{101 + idx}: {c.asset.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Case Brief Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Active Forensic Case Dossier
              </span>
              <h2 className="text-2xl font-black text-white">{currentCase.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Financial Impact</span>
              <strong className="text-sm font-mono text-red-400">{currentCase.lossValue}</strong>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block font-semibold">Equipment / Asset:</span>
              <strong className="text-slate-200 text-sm">{currentCase.asset}</strong>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <span className="text-slate-400 block font-semibold">Operating Facility:</span>
              <strong className="text-slate-200 text-sm">{currentCase.plant}</strong>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/30 p-4 rounded-2xl border border-slate-800">
            <strong>Incident Summary:</strong> {currentCase.incidentBrief}
          </p>
        </div>
      </div>

      {/* Investigation Grid: Evidence Files (Left) & 5-Why Deduction (Right) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Forensic Evidence Locker (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Evidence Locker ({currentCase.evidence.length})
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Click to Inspect</span>
          </div>

          <div className="space-y-3">
            {currentCase.evidence.map(ev => {
              const isOpened = !!openedEvidence[ev.id];
              return (
                <div
                  key={ev.id}
                  onClick={() => toggleEvidence(ev.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isOpened
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-600 dark:text-amber-400">
                      {ev.source}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isOpened ? 'Collapse' : 'Inspect'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                    "{ev.snippet}"
                  </p>

                  {isOpened && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-3 rounded-xl">
                      {ev.details}
                      {ev.isRedHerring && (
                        <div className="mt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" /> Note: This evidence eliminates bearing lubrication as a cause.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive 5-Why Deduction Chain (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-500" />
              5-Why Diagnostic Chain
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">
              Step {currentStepIdx + 1} of {currentCase.fiveWhySteps.length}
            </span>
          </div>

          <div className="space-y-4">
            {currentCase.fiveWhySteps.map((step, sIdx) => {
              const isCurrent = sIdx === currentStepIdx;
              const isPast = sIdx < currentStepIdx || isCompleted;
              const hasAnswered = selectedAnswers[sIdx] !== undefined;
              const chosenOptIdx = selectedAnswers[sIdx];
              const isError = stepErrors[sIdx];

              if (!isPast && !isCurrent) {
                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold flex items-center gap-2 opacity-60"
                  >
                    <span>Locked Why #{sIdx + 1} — Solve previous step to unlock</span>
                  </div>
                );
              }

              return (
                <div
                  key={sIdx}
                  className={`p-5 rounded-3xl border transition-all ${
                    isCurrent
                      ? 'bg-white dark:bg-slate-850 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      Why #{sIdx + 1}
                    </span>
                    {hasAnswered && !isError && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">
                    {step.question}
                  </h4>

                  <div className="space-y-2">
                    {step.options.map((opt, oIdx) => {
                      const isSelected = chosenOptIdx === oIdx;
                      let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50';

                      if (isSelected) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else {
                          btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isPast && !isCurrent}
                          onClick={() => handleSelectOption(sIdx, oIdx)}
                          className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className={`mt-3 p-3 rounded-xl text-xs ${
                      step.options[chosenOptIdx].isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    }`}>
                      {step.options[chosenOptIdx].feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion Debrief Modal / Card */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-slate-900 to-cyan-950 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Forensic Investigation Closed!</h3>
                    <p className="text-xs text-emerald-400 font-bold">Investigation Accuracy: {score}/100 Pts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyShare}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'Copied Link!' : 'Share Finding'}</span>
                  </button>
                  <button
                    onClick={resetInvestigation}
                    className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-all"
                    title="Restart Investigation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tri-Fold Root Causes Box */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-black block">1. Physical Cause</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentCase.rootCauses.physical}</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-black block">2. Human Cause</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentCase.rootCauses.human}</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-black block">3. Latent Root Cause</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentCase.rootCauses.latent}</p>
                </div>
              </div>

              {/* Forensic Debrief */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Chief Reliability Engineer Debrief:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentCase.forensicExplanation}
                </p>
              </div>

              {/* Direct Links to Tools */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 block">Apply Root Cause Findings in Our Tools:</span>
                <div className="flex flex-wrap gap-2">
                  {currentCase.relatedToolLinks.map((t, idx) => (
                    <Link
                      key={idx}
                      to={t.url}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>{t.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Landing Shell: How to Play & Educational Value */}
      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            How to Play RCA Detective
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-500">1.</span>
              <span><strong>Review Incident Dossier:</strong> Inspect real-world industrial plant breakdown briefs and financial impact figures.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-500">2.</span>
              <span><strong>Inspect Evidence Files:</strong> Click through SCADA trends, oil analysis ferrograms, vibration FFT spectra, and shift logs. Filter out red herrings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-500">3.</span>
              <span><strong>Execute 5-Why Deduction:</strong> Answer each cascading causal question correctly to drill down from physical failure to systemic latent root cause.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-500">4.</span>
              <span><strong>Review Forensic Debrief:</strong> Learn how to engineer out systemic defects using Lock-Out / Tag-Out, MOC protocols, and 5S lubrication excellence.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            What You Will Learn
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Physical vs Human vs Latent Causes:</strong> Master the 3 levels of incident causation defined by SMRP and ASQ.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Condition Monitoring Interpretation:</strong> Learn how to read vibration FFT sidebands, ASTM oil lab iron ppm thresholds, and seal Plan 23 temperature curves.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Eliminating Human Error Blame:</strong> Understand why world-class reliability programs focus on fixing systemic management procedures rather than blaming technicians.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RcaDetective;
