
import React, { useState } from 'react';
import { calculateSIL } from '../../services/reliabilityMath';
import { ShieldAlert, Activity, CheckCircle, AlertOctagon, BookOpen } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

const SilVerification: React.FC = () => {
  const [lambdaDU, setLambdaDU] = useState<string>('1.5e-6');
  const [testInterval, setTestInterval] = useState<string>('8760'); // 1 year
  const [arch, setArch] = useState<'1oo1' | '1oo2' | '2oo2' | '2oo3'>('1oo1');

  // Logic to parse scientific notation or float
  const l = parseFloat(lambdaDU);
  const t = parseFloat(testInterval);
  
  const result = (!isNaN(l) && !isNaN(t)) ? calculateSIL(l, t, arch) : null;

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SIL Verification Calculator",
    "description": "Calculate PFDavg and determine Safety Integrity Level (SIL) for low demand mode per IEC 61508.",
    "applicationCategory": "UtilitiesApplication"
  };

  const getSilColor = (level: number) => {
    if (level === 4) return 'bg-purple-600';
    if (level === 3) return 'bg-red-600';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-yellow-500';
    return 'bg-slate-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">SIL Verification (PFDavg)</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate the Probability of Failure on Demand (PFDavg) for low-demand safety functions. Determine the achieved Safety Integrity Level (SIL) based on simplified formulas from <strong>IEC 61508</strong> and <strong>IEC 61511</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> SIF Parameters
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Architecture (Voting)
              <HelpTooltip text="1oo1: Single channel. 1oo2: Redundant (safe). 2oo2: Redundant (reliable but less safe). 2oo3: TMR." />
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['1oo1', '1oo2', '2oo2', '2oo3'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setArch(a)}
                  className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                    arch === a 
                      ? 'bg-cyan-600 text-white border-cyan-600' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Lambda DU (Failures/Hour)
              <HelpTooltip text="Dangerous Undetected failure rate. e.g. 1.5e-6" />
            </label>
            <input 
              type="text" 
              value={lambdaDU} 
              onChange={e => setLambdaDU(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 font-mono" 
              placeholder="1.5e-6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Proof Test Interval (Hours)
              <HelpTooltip text="Time between full functional tests. 8760 = 1 Year." />
            </label>
            <input 
              type="number" 
              value={testInterval} 
              onChange={e => setTestInterval(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500" 
            />
            <div className="flex gap-2 mt-2">
               <button onClick={() => setTestInterval('4380')} className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded hover:bg-slate-200">6 Mo</button>
               <button onClick={() => setTestInterval('8760')} className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded hover:bg-slate-200">1 Yr</button>
               <button onClick={() => setTestInterval('17520')} className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded hover:bg-slate-200">2 Yrs</button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
               <div className="text-sm font-bold text-slate-500 uppercase mb-4">Achieved Level</div>
               
               <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getSilColor(result.silLevel)} text-white shadow-xl mb-6`}>
                 <div>
                   <div className="text-4xl font-extrabold">SIL {result.silLevel}</div>
                   {result.silLevel === 0 && <div className="text-xs">None</div>}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                 <div>
                   <div className="text-xs text-slate-500 uppercase font-bold">PFDavg</div>
                   <div className="text-xl font-mono font-bold text-slate-800 dark:text-slate-200">{result.pfd.toExponential(3)}</div>
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 uppercase font-bold">RRF</div>
                   <div className="text-xl font-mono font-bold text-slate-800 dark:text-slate-200">{Math.round(result.rrf).toLocaleString()}</div>
                 </div>
               </div>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
             <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
               <ShieldAlert className="w-4 h-4 text-cyan-600" /> SIL Table (IEC 61508 Low Demand)
             </h4>
             <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 font-mono">
               <div className="flex justify-between"><span>SIL 4</span> <span>≥ 10⁻⁵ to &lt; 10⁻⁴</span></div>
               <div className="flex justify-between"><span>SIL 3</span> <span>≥ 10⁻⁴ to &lt; 10⁻³</span></div>
               <div className="flex justify-between"><span>SIL 2</span> <span>≥ 10⁻³ to &lt; 10⁻²</span></div>
               <div className="flex justify-between"><span>SIL 1</span> <span>≥ 10⁻² to &lt; 10⁻¹</span></div>
             </div>
          </div>
        </div>
      </div>

      {/* Standards Reference Section */}
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
            <BookOpen className="w-5 h-5 text-cyan-600" /> Applicable Standards
          </h3>
          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li>
              <strong>IEC 61508-6:</strong> Functional safety of electrical/electronic/programmable electronic safety-related systems. (Simplified equations for PFDavg).
            </li>
            <li>
              <strong>IEC 61511:</strong> Functional safety - Safety instrumented systems for the process industry sector.
            </li>
          </ul>
        </div>
      </div>

      <RelatedTools currentToolId="sil-verification" />
    </div>
  );
};

export default SilVerification;
