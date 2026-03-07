import React, { useState } from 'react';
import { calculateSIL } from '../../services/reliabilityMath';
import { ShieldAlert, Activity, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

import WizardWrapper from '../../components/WizardWrapper';

const SilVerification: React.FC = () => {
  const [lambdaDU, setLambdaDU] = useState<string>('1.5e-6');
  const [testInterval, setTestInterval] = useState<string>('8760');
  const [arch, setArch] = useState<'1oo1' | '1oo2' | '2oo2' | '2oo3'>('1oo1');
  const [mode, setMode] = useState<'wizard' | 'expert'>('wizard');
  const [isCalculating, setIsCalculating] = useState(false);

  const l = parseFloat(lambdaDU);
  const t = parseFloat(testInterval);
  const isValid = !isNaN(l) && !isNaN(t) && l > 0 && t > 0;

  const [computed, setComputed] = useState(() => isValid ? calculateSIL(l, t, arch) : null);

  const runCalculation = () => {
    if (!isValid) return;
    setIsCalculating(true);
    setTimeout(() => {
      setComputed(calculateSIL(l, t, arch));
      setIsCalculating(false);
    }, 300);
  };

  React.useEffect(() => {
    if (mode === 'expert') runCalculation();
  }, [lambdaDU, testInterval, arch, mode]);

  const result = computed;

  const getSilColor = (level: number) => {
    if (level === 4) return 'bg-purple-600';
    if (level === 3) return 'bg-red-600';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-yellow-500';
    return 'bg-slate-500';
  };

  const equationByArch: Record<'1oo1' | '1oo2' | '2oo2' | '2oo3', string> = {
    '1oo1': 'PFD_{avg} = \\frac{\\lambda_{DU} \\cdot T_I}{2}',
    '1oo2': 'PFD_{avg} = \\frac{(\\lambda_{DU} \\cdot T_I)^2}{3}',
    '2oo2': 'PFD_{avg} = \\lambda_{DU} \\cdot T_I',
    '2oo3': 'PFD_{avg} = (\\lambda_{DU} \\cdot T_I)^2',
  };

  const steps = [
    {
      title: 'Choose Architecture',
      description: 'Select the system redundancy and voting logic.',
      isValid: true,
      content: (
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Voting Logic</label>
          <div className="grid grid-cols-4 gap-3">
            {(['1oo1', '1oo2', '2oo2', '2oo3'] as const).map(a => (
              <button
                key={a}
                onClick={() => setArch(a)}
                className={`py-3 text-sm font-black rounded-xl border-2 transition-all ${arch === a
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-cyan-400 hover:text-cyan-600'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Failure Rate Data',
      description: 'Input the Dangerous Undetected failure metric.',
      isValid: !isNaN(parseFloat(lambdaDU)) && parseFloat(lambdaDU) > 0,
      content: (
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
            Lambda DU (failures/hr)
            <HelpTooltip text="Dangerous undetected failure rate from safety data." why="PFD is proportional to lambdaDU." formula="PFD_{avg} \propto \lambda_{DU}" />
          </label>
          <input
            type="text"
            value={lambdaDU}
            onChange={e => setLambdaDU(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-slate-900 dark:text-white text-lg"
            placeholder="1.5e-6"
          />
        </div>
      )
    },
    {
      title: 'Proof Test Interval',
      description: 'Define the frequency of safety validation tests.',
      isValid: !isNaN(parseFloat(testInterval)) && parseFloat(testInterval) > 0,
      content: (
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
            Test Interval (hours)
            <HelpTooltip text="Time between full function tests." why="Longer intervals increase the risk window." formula="PFD_{avg} \propto T_I" />
          </label>
          <input
            type="number"
            value={testInterval}
            onChange={e => setTestInterval(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white text-lg font-bold"
          />
          <div className="flex gap-2">
            {[
              { l: '6 Mo', v: '4380' },
              { l: '1 Yr', v: '8760' },
              { l: '2 Yr', v: '17520' }
            ].map(b => (
              <button key={b.v} onClick={() => setTestInterval(b.v)} className="flex-1 py-2 text-[10px] font-black uppercase bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {b.l}
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
          <button onClick={() => setMode('wizard')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'wizard' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>Guided Wizard</button>
          <button onClick={() => setMode('expert')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'expert' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>Expert Mode</button>
        </div>

        {mode === 'wizard' ? (
          <WizardWrapper 
            steps={steps} 
            onFinish={runCalculation} 
            isLoading={isCalculating}
            finishText="Verify SIL"
            finishIcon={<ShieldAlert className="w-4 h-4" />}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {steps.map((panel) => (
              <div key={panel.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">{panel.title}</h3>
                {panel.content}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Live Math</h4>
          <BlockMath math={equationByArch[arch]} />
          {isValid && <div className="text-xs text-slate-500 mt-2">Current input: lambdaDU={lambdaDU}, TI={testInterval} h</div>}
        </div>
      </div>

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
            <Activity className="w-16 h-16 mb-4 opacity-20" />
            <p>Complete inputs to calculate SIL.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-slate-500" /> Reference Table (Low Demand)
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { sil: 4, range: '>=1e-5 to <1e-4', color: 'text-purple-600' },
              { sil: 3, range: '>=1e-4 to <1e-3', color: 'text-red-600' },
              { sil: 2, range: '>=1e-3 to <1e-2', color: 'text-orange-600' },
              { sil: 1, range: '>=1e-2 to <1e-1', color: 'text-yellow-600' },
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
      <h2 id="overview">Guided SIL Verification</h2>
      <p>
        The Tier 2 update adds a wizard mode that walks engineers through architecture, dangerous undetected rate, and proof test interval before calculation.
      </p>
      <h2 id="applications">Why this matters</h2>
      <p>
        Safety reviews are often done by mixed teams. Guided mode reduces input mistakes and keeps the PFD reasoning explicit.
      </p>
    </div>
  );

  const faqs = [
    {
      question: 'Does wizard mode change the math?',
      answer: 'No. Wizard and expert modes use identical formulas; wizard only changes input workflow.'
    },
    {
      question: 'Can I still use expert inputs?',
      answer: 'Yes. Switch to Expert Mode to edit all fields directly in one panel.'
    }
  ];

  return (
    <ToolContentLayout
      title="SIL Verification Calculator"
      description="Verify SIL with guided wizard mode, live equation rendering, and instant PFD/RRF scoring aligned to IEC low-demand ranges."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SIL Calculator',
        applicationCategory: 'UtilitiesApplication'
      }}
    />
  );
};

export default SilVerification;
