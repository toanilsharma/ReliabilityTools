
import React, { useState } from 'react';
import { calculateRPN } from '../../services/reliabilityMath';
import { AlertCircle, ClipboardList, Target, BookOpen } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const FmeaCalculator: React.FC = () => {
  const [severity, setSeverity] = useState(5);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(5);

  const rpn = calculateRPN(severity, occurrence, detection);

  const getRiskLevel = (rpn: number) => {
    if (rpn >= 100) return { label: 'HIGH RISK', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
    if (rpn >= 40) return { label: 'MEDIUM RISK', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    return { label: 'LOW RISK', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
  };

  const risk = getRiskLevel(rpn);

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FMEA RPN Calculator",
    "description": "Calculate Risk Priority Number (RPN) for Failure Modes and Effects Analysis based on IEC 60812.",
    "applicationCategory": "UtilitiesApplication"
  };

  const SliderInput = ({ label, val, setVal, tooltip }: any) => (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {label} <span className="text-cyan-600">({val})</span>
          <HelpTooltip text={tooltip} />
        </label>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={val} 
        onChange={(e) => setVal(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>1 (Low)</span>
        <span>10 (High)</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">FMEA RPN Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate the Risk Priority Number (RPN) for your Failure Modes & Effects Analysis (FMEA).
          Aligned with <strong>IEC 60812</strong> and <strong>AIAG/VDA</strong> standards.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-8">
           <SliderInput 
             label="Severity (S)" 
             val={severity} 
             setVal={setSeverity} 
             tooltip="1 = No Effect, 10 = Hazardous/Safety Issue without warning."
           />
           <SliderInput 
             label="Occurrence (O)" 
             val={occurrence} 
             setVal={setOccurrence} 
             tooltip="1 = Failure unlikely, 10 = Failure almost inevitable."
           />
           <SliderInput 
             label="Detection (D)" 
             val={detection} 
             setVal={setDetection} 
             tooltip="1 = Certain to detect, 10 = Cannot detect before failure."
           />
        </div>

        <div className={`p-8 rounded-2xl border-2 ${risk.bg} ${risk.border} flex flex-col items-center justify-center h-full text-center transition-colors duration-300`}>
           <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Priority Number</div>
           <div className={`text-8xl font-black ${risk.color} mb-4`}>
             {rpn}
           </div>
           <div className={`px-4 py-1 rounded-full text-xs font-bold bg-white/50 ${risk.color} border border-current`}>
             {risk.label}
           </div>
           
           {rpn >= 100 && (
             <div className="mt-6 flex items-start gap-2 text-left bg-white/60 p-4 rounded-lg text-sm text-red-800">
               <AlertCircle className="w-5 h-5 shrink-0" />
               <p><strong>Action Required:</strong> This risk score is critical. Recommended actions include design changes, adding redundancy, or implementing automated detection.</p>
             </div>
           )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
          <BookOpen className="w-5 h-5 text-cyan-600" /> Standard: IEC 60812
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This calculator follows the methodology described in <strong>IEC 60812: Failure modes and effects analysis (FMEA)</strong>. While RPN (SxOxD) is a classic metric, modern standards like the AIAG-VDA harmonization often recommend "Action Priority" (AP) tables for more nuanced decision making. However, RPN remains a standard quick-check metric in many industries.
        </p>
      </div>

      <RelatedTools currentToolId="fmea-calculator" />
    </div>
  );
};

export default FmeaCalculator;
