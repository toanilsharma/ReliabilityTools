
import React, { useState } from 'react';
import { calculateRPN } from '../../services/reliabilityMath';
import { AlertCircle, ClipboardList, Target, BookOpen, Sliders, Shield } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const FmeaCalculator: React.FC = () => {
  const [severity, setSeverity] = useState(5);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(5);

  const rpn = calculateRPN(severity, occurrence, detection);

  const getRiskLevel = (rpn: number) => {
    if (rpn >= 100) return { label: 'HIGH RISK', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
    if (rpn >= 40) return { label: 'MEDIUM RISK', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    return { label: 'LOW RISK', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
  };

  const risk = getRiskLevel(rpn);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <div className="space-y-8 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-cyan-600" /> Assessment Inputs
        </h3>

        {/* Severity */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Severity (S)</label>
            <span className="font-mono font-bold text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 px-2 rounded">{severity}</span>
          </div>
          <input type="range" min="1" max="10" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1 (None)</span>
            <span>10 (Hazardous)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            {severity >= 9 ? "Failure causes injury/death" : severity >= 7 ? "Major disruption" : severity >= 4 ? "Minor annoyance" : "No effect"}
          </p>
        </div>

        {/* Occurrence */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Occurrence (O)</label>
            <span className="font-mono font-bold text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 px-2 rounded">{occurrence}</span>
          </div>
          <input type="range" min="1" max="10" value={occurrence} onChange={(e) => setOccurrence(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1 (Remote)</span>
            <span>10 (Inevitable)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            {occurrence >= 9 ? "Failure is almost certain" : occurrence >= 7 ? "Frequent failures" : occurrence >= 4 ? "Occasional failures" : "Highly unlikely"}
          </p>
        </div>

        {/* Detection */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Detection (D)</label>
            <span className="font-mono font-bold text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 px-2 rounded">{detection}</span>
          </div>
          <input type="range" min="1" max="10" value={detection} onChange={(e) => setDetection(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1 (Certain)</span>
            <span>10 (Blind)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            {detection >= 9 ? "Cannot detect before failure" : detection >= 7 ? "Low chance of detection" : detection >= 4 ? "Likely to detect" : "Certain to detect"}
          </p>
        </div>
      </div>

      <div className={`p-8 rounded-2xl border-2 ${risk.bg} ${risk.border} dark:bg-opacity-10 flex flex-col items-center justify-center h-full text-center transition-colors duration-300`}>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Priority Number</div>
        <div className={`text-8xl font-black ${risk.color} mb-4 drop-shadow-sm`}>
          {rpn}
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-800 ${risk.color} border border-current shadow-sm`}>
          {risk.label}
        </div>

        <div className="mt-8 text-left bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 w-full">
          <h4 className="font-bold mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Recommendation</h4>
          {rpn >= 100 ? (
            <p><strong>Immediate Action:</strong> This failure mode poses an unacceptable risk. Redesign the process to eliminate the cause or implement fail-safe detection.</p>
          ) : rpn >= 40 ? (
            <p><strong>Review Required:</strong> Investigate options to reduce Occurrence or improve Detection. Monitor closely.</p>
          ) : (
            <p><strong>Acceptable:</strong> Keep under observation. No immediate design change needed unless Severity is 9-10.</p>
          )}
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is FMEA?</h2>
      <p>
        <strong>Failure Modes and Effects Analysis (FMEA)</strong> is a systematic method for evaluating a process to identify where and how it might fail, and to assess the relative impact of different failures to identify the parts of the process that are most in need of change.
      </p>

      <h2 id="rpn">The RPN Formula</h2>
      <p>
        The Risk Priority Number (RPN) is calculated by multiplying three factors (scored 1-10):
      </p>
      <div className="grid md:grid-cols-3 gap-4 my-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
          <strong className="text-red-700 dark:text-red-400 block mb-1">Severity (S)</strong>
          <span className="text-xs text-red-800/70 dark:text-red-200/70">How bad is it if it fails? (10 = Hazardous)</span>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
          <strong className="text-orange-700 dark:text-orange-400 block mb-1">Occurrence (O)</strong>
          <span className="text-xs text-orange-800/70 dark:text-orange-200/70">How often does the cause happen? (10 = Always)</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <strong className="text-blue-700 dark:text-blue-400 block mb-1">Detection (D)</strong>
          <span className="text-xs text-blue-800/70 dark:text-blue-200/70">Can we catch it before it fails? (10 = Blind)</span>
        </div>
      </div>
      <p className="text-center font-mono text-lg font-bold bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        RPN = Severity × Occurrence × Detection
      </p>

      <h2 id="standard">IEC 60812 Standard</h2>
      <p>
        This tool follows the methodology described in <strong>IEC 60812</strong>. Note that while RPN is the classic metric, newer standards (like AIAG-VDA 2019) are moving towards "Action Priority" (AP) tables because RPN can be misleading (e.g., S=10, O=1, D=1 gives RPN=10, which looks low but is actually a severe safety hazard).
      </p>
      <p>
        <strong>Always prioritize high Severity (9-10) regardless of the RPN score.</strong>
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What is a 'Good' RPN score?",
      answer: "There is no universal threshold. Many companies use <strong>100</strong> as an action limit, but it depends on the industry. Medical devices might act at 40; general manufacturing might accept 150."
    },
    {
      question: "Can I reduce Severity?",
      answer: "Usually, NO. Severity is inherent to the failure effect (e.g., 'Engine Explosion'). You cannot make an explosion less severe. You can only reduce the Occurrence (make it rare) or improve Detection (catch it early)."
    },
    {
      question: "Why is Detection scored in reverse?",
      answer: "Detection is a measure of risk. Excellent detection (catching the bug immediately) is Low Risk (Score 1). No detection (flying blind) is High Risk (Score 10)."
    }
  ];

  return (
    <ToolContentLayout
      title="FMEA Calculator (RPN)"
      description="Assess risk using Failure Modes and Effects Analysis. Calculate the Risk Priority Number (RPN) to prioritize which failure modes need immediate attention."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "FMEA Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default FmeaCalculator;
