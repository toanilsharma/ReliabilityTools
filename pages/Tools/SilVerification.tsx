
import React, { useState } from 'react';
import { calculateSIL } from '../../services/reliabilityMath';
import { ShieldAlert, Activity, CheckCircle, AlertOctagon, BookOpen, Calculator, Info } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const SilVerification: React.FC = () => {
  const [lambdaDU, setLambdaDU] = useState<string>('1.5e-6');
  const [testInterval, setTestInterval] = useState<string>('8760'); // 1 year
  const [arch, setArch] = useState<'1oo1' | '1oo2' | '2oo2' | '2oo3'>('1oo1');

  // Logic to parse scientific notation or float
  const l = parseFloat(lambdaDU);
  const t = parseFloat(testInterval);

  const result = (!isNaN(l) && !isNaN(t)) ? calculateSIL(l, t, arch) : null;

  const getSilColor = (level: number) => {
    if (level === 4) return 'bg-purple-600';
    if (level === 3) return 'bg-red-600';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-yellow-500';
    return 'bg-slate-500';
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> SIF Parameters
        </h3>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Architecture (Voting)
            <HelpTooltip text="1oo1: Single channel. 1oo2: Redundant (safe). 2oo2: Redundant (reliable but less safe). 2oo3: TMR." />
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['1oo1', '1oo2', '2oo2', '2oo3'] as const).map(a => (
              <button
                key={a}
                onClick={() => setArch(a)}
                className={`py-2 text-sm font-bold rounded-lg border transition-all ${arch === a
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Lambda DU (Failures/Hour)
            <HelpTooltip text="Dangerous Undetected failure rate. e.g. 1.5e-6" />
          </label>
          <input
            type="text"
            value={lambdaDU}
            onChange={e => setLambdaDU(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-slate-900 dark:text-white"
            placeholder="1.5e-6"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Proof Test Interval (Hours)
            <HelpTooltip text="Time between full functional tests. 8760 = 1 Year." />
          </label>
          <input
            type="number"
            value={testInterval}
            onChange={e => setTestInterval(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setTestInterval('4380')} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">6 Mo</button>
            <button onClick={() => setTestInterval('8760')} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">1 Yr</button>
            <button onClick={() => setTestInterval('17520')} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">2 Yrs</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {result ? (
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl text-center relative overflow-hidden">

            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Achieved Performance</div>

              <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${getSilColor(result.silLevel)} text-white shadow-2xl mb-8 ring-4 ring-white dark:ring-slate-800`}>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-black tracking-tighter">SIL {result.silLevel}</div>
                  {result.silLevel === 0 && <div className="text-xs opacity-80 mt-1 font-bold">Unrated</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">PFD (Avg)</div>
                  <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{result.pfd.toExponential(2)}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">RRF</div>
                  <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">{Math.round(result.rrf).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-slate-400">
            <Calculator className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter failure rates to calculate SIL.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-slate-500" /> Reference Table (Low Demand)
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { sil: 4, range: '≥ 10⁻⁵ to < 10⁻⁴', color: 'text-purple-600' },
              { sil: 3, range: '≥ 10⁻⁴ to < 10⁻³', color: 'text-red-600' },
              { sil: 2, range: '≥ 10⁻³ to < 10⁻²', color: 'text-orange-600' },
              { sil: 1, range: '≥ 10⁻² to < 10⁻¹', color: 'text-yellow-600' },
            ].map((row) => (
              <div key={row.sil} className={`flex justify-between items-center p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${result?.silLevel === row.sil ? 'ring-2 ring-cyan-500' : 'opacity-60'}`}>
                <span className={`font-bold ${row.color}`}>SIL {row.sil}</span>
                <span className="text-slate-500">{row.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is SIL Verification?</h2>
      <p>
        <strong>Safety Integrity Level (SIL)</strong> is a measure of the reliability of a Safety Instrumented Function (SIF). It defines the probability that a safety system (like an Emergency Shutdown Valve) will successfully perform its function when a dangerous condition occurs.
      </p>

      <h2 id="pfd">PFDavg and RRF</h2>
      <p>
        For Low Demand Mode (systems activated less than once per year), SIL is determined by the <strong>Average Probability of Failure on Demand (PFDavg)</strong>.
      </p>
      <ul>
        <li><strong>PFDavg:</strong> The likelihood the system is broken when you need it. Lower is better.</li>
        <li><strong>RRF (Risk Reduction Factor):</strong> The inverse of PFD (1/PFD). It represents how many times the risk is reduced. Higher is better. (e.g. RRF 100 means the risk is cut simply by 100 times).</li>
      </ul>

      <h2 id="architecture">Voting Logic</h2>
      <p>
        The architecture (1oo1, 1oo2, etc.) dramatically affects PFD.
      </p>
      <ul>
        <li><strong>1oo1 (No Redundancy):</strong> Simple but prone to failure.</li>
        <li><strong>1oo2 (Safety Redundancy):</strong> Two sensors, if <em>either</em> trips, the system trips. Very safe, but higher false trip rate.</li>
        <li><strong>2oo3 (TMR):</strong> Triple Modular Redundancy. Needs 2 out of 3 to trip. High safety AND high availability (fewer false trips).</li>
      </ul>
    </div>
  );

  const faqs = [
    {
      question: "Does this tool replace a HAZOP/LOPA?",
      answer: "<strong>Absolutely not.</strong> This tool performs the mathematical <em>verification</em> step (Step 4 of the Safety Lifecycle). You must determined the <em>Required</em> SIL through risk analysis (LOPA) before verifying if your hardware meets it."
    },
    {
      question: "What is Proof Testing?",
      answer: "Safety systems can fail silently (Dangerous Undetected). A Proof Test is a periodic manual test to find and fix these hidden failures. More frequent proof testing lowers the PFDavg and improves SIL."
    },
    {
      question: "Where do I get Lambda DU values?",
      answer: "From the manufacturer's safety manual (certified data), or industry databases like OREDA or exida SERH."
    }
  ];

  return (
    <ToolContentLayout
      title="SIL Verification Calculator"
      description="Verify the Safety Integrity Level (SIL) of your Safety Instrumented Functions (SIF). Calculate PFDavg and Risk Reduction Factor (RRF) according to IEC 61508."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SIL Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default SilVerification;
