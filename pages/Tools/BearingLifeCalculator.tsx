import React, { useState, useMemo, useRef } from 'react';
import { Settings, Clock, Activity, Shield, Info, CheckCircle2, Copy, Check, Share2, TrendingUp, RotateCcw } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface BearingLifeState {
  dynamicLoadC: string;
  equivalentLoadP: string;
  speedRpm: string;
  bearingType: 'ball' | 'roller';
}

const BearingLifeCalculator: React.FC = () => {
  const [state, setState] = useState<BearingLifeState>({
    dynamicLoadC: '28.1',
    equivalentLoadP: '4.2',
    speedRpm: '1750',
    bearingType: 'ball'
  });

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toolRef = useRef<HTMLDivElement>(null);

  const { dynamicLoadC, equivalentLoadP, speedRpm, bearingType } = state;

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const c = parseFloat(dynamicLoadC);
    if (!dynamicLoadC || isNaN(c) || c <= 0) {
      newErrors.dynamicLoadC = 'Enter a valid Dynamic Load Rating C (> 0).';
      isValid = false;
    }

    const p = parseFloat(equivalentLoadP);
    if (!equivalentLoadP || isNaN(p) || p <= 0) {
      newErrors.equivalentLoadP = 'Enter a valid Equivalent Load P (> 0).';
      isValid = false;
    }

    const rpm = parseFloat(speedRpm);
    if (!speedRpm || isNaN(rpm) || rpm <= 0) {
      newErrors.speedRpm = 'Enter a valid speed in RPM (> 0).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      trackToolCalculation('L10 Bearing Life Calculator', 'bearing-life');
    }
  };

  const calculationResults = useMemo(() => {
    const c = parseFloat(dynamicLoadC) || 0;
    const p = parseFloat(equivalentLoadP) || 0;
    const rpm = parseFloat(speedRpm) || 0;

    if (c <= 0 || p <= 0 || rpm <= 0) {
      return { l10Revs: 0, l10Hours: 0, l10Years: 0, exponent: 3 };
    }

    const exponent = bearingType === 'ball' ? 3 : 10 / 3;
    const l10Revs = Math.pow(c / p, exponent); // Millions of revolutions
    const l10Hours = (1e6 * l10Revs) / (60 * rpm);
    const l10Years = l10Hours / 8760;

    return {
      l10Revs,
      l10Hours,
      l10Years,
      exponent
    };
  }, [dynamicLoadC, equivalentLoadP, speedRpm, bearingType]);

  const handleCopySnippet = () => {
    const text = `L10 Bearing Life Analysis (ISO 281):
- Bearing Type: ${bearingType === 'ball' ? 'Ball Bearing (p=3)' : 'Roller Bearing (p=10/3)'}
- Dynamic Load Rating (C): ${dynamicLoadC} kN
- Equivalent Load (P): ${equivalentLoadP} kN
- Speed: ${speedRpm} RPM
- L10 Life: ${calculationResults.l10Revs.toFixed(2)} Million Revolutions
- L10h Life: ${calculationResults.l10Hours.toLocaleString(undefined, { maximumFractionDigits: 0 })} Operating Hours (${calculationResults.l10Years.toFixed(2)} Years 24/7)
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/bearing-life/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is ISO 281 Basic Rating Life (L10)?',
      answer: 'L10 life is the rating life associated with 90% reliability. It specifies the number of revolutions or operating hours that 90% of a population of identical bearings will achieve before showing the first signs of fatigue flaking or spalling under steady operating conditions.'
    },
    {
      question: 'What is the difference between Ball and Roller bearing life exponents?',
      answer: 'Per ISO 281 standard, ball bearings use a life exponent p = 3 due to point contact stress distribution. Roller bearings use p = 10/3 (approx 3.333) due to line contact stress distribution.'
    },
    {
      question: 'How do lubrication and contamination affect real-world bearing life?',
      answer: 'Standard L10 assumes clean lubrication and ideal alignment. For modified life (L10m), ISO 281 introduces life adjustment factors (a1 for reliability level, aISO for contamination, viscosity ratio, and fatigue load limit).'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-cyan-500" /> Bearing Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Bearing Construction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setState(s => ({ ...s, bearingType: 'ball' }))}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all ${
                    bearingType === 'ball'
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Ball Bearing (p=3)
                </button>
                <button
                  type="button"
                  onClick={() => setState(s => ({ ...s, bearingType: 'roller' }))}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all ${
                    bearingType === 'roller'
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Roller (p=10/3)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Basic Dynamic Load Rating C (kN)</span>
                <HelpTooltip text="Catalog dynamic load rating C from manufacturer specifications." />
              </label>
              <input
                type="number"
                step="any"
                value={dynamicLoadC}
                onChange={e => setState(s => ({ ...s, dynamicLoadC: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.dynamicLoadC && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.dynamicLoadC}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Equivalent Dynamic Load P (kN)</span>
                <HelpTooltip text="Calculated equivalent radial + axial dynamic load acting on the bearing." />
              </label>
              <input
                type="number"
                step="any"
                value={equivalentLoadP}
                onChange={e => setState(s => ({ ...s, equivalentLoadP: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.equivalentLoadP && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.equivalentLoadP}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Rotational Speed (RPM)</span>
                <HelpTooltip text="Shaft operating speed in revolutions per minute." />
              </label>
              <input
                type="number"
                step="any"
                value={speedRpm}
                onChange={e => setState(s => ({ ...s, speedRpm: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.speedRpm && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.speedRpm}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Calculate L10 Bearing Life
            </button>
          </form>
        </AnimatedContainer>

        {/* Results Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 md:p-8 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">ISO 281 Life Evaluation</span>
                <h4 className="text-2xl md:text-3xl font-black text-white mt-1">L10 Rating Life Output</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
              </button>
            </div>

            {/* ISO 281 Rating Life Notice Banner */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3 text-cyan-200 text-xs leading-relaxed">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-0.5">Basic Rating Life (90% Reliability)</strong>
                Per ISO 281, L10 specifies the life that 90% of a group of identical bearings will achieve or exceed before material fatigue flaking occurs.
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">L10 Operating Hours</div>
                <div className="text-2xl md:text-3xl font-black text-cyan-400">
                  {calculationResults.l10Hours.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Operating hours (L10h)</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">L10 Revolutions</div>
                <div className="text-2xl md:text-3xl font-black text-emerald-400">
                  {calculationResults.l10Revs.toFixed(2)} M
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Millions of revolutions</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">L10 Years (24/7)</div>
                <div className="text-2xl md:text-3xl font-black text-amber-400">
                  {calculationResults.l10Years.toFixed(2)} yrs
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Continuous 24/7 service</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Load Ratio (C / P)</div>
                <div className="text-xl font-black text-white">
                  {(parseFloat(dynamicLoadC) / (parseFloat(equivalentLoadP) || 1)).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Dynamic load capacity ratio</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Life Exponent (p)</div>
                <div className="text-xl font-black text-white">
                  {calculationResults.exponent.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">{bearingType === 'ball' ? 'Ball (point contact)' : 'Roller (line contact)'}</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Reliability Level</div>
                <div className="text-xl font-black text-cyan-400">
                  90% (R=0.90)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Standard ISO 281 baseline</div>
              </div>
            </div>

            <ShareAndExport
              toolName="L10 Bearing Life Calculator (ISO 281)"
              shareUrl="https://reliabilitytools.co.in/tools/bearing-life/"
              resultSummary={`L10h: ${calculationResults.l10Hours.toFixed(0)} hours`}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>ISO 281 Rolling Element Bearing Life Theory</h2>
      <p>
        Rolling element bearings are among the most critical components in industrial rotating machinery. Under clean, properly lubricated operating conditions, bearing failure is caused by fatigue flaking of the rolling elements or raceways.
      </p>

      <h3>The Standard ISO 281 L10 Formula</h3>
      <p>The basic rating life <InlineMath math="L_{10}" /> in millions of revolutions is expressed as:</p>
      <BlockMath math="L_{10} = \left(\frac{C}{P}\right)^p" />

      <p>Where:</p>
      <ul>
        <li><strong>C:</strong> Basic Dynamic Load Rating in kN (from manufacturer rating tables).</li>
        <li><strong>P:</strong> Equivalent Dynamic Bearing Load in kN (<InlineMath math="P = X F_r + Y F_a" />).</li>
        <li><strong>p:</strong> Life exponent (<InlineMath math="p = 3" /> for ball bearings; <InlineMath math="p = 10/3" /> for roller bearings).</li>
      </ul>

      <h3>Converting to Operating Hours</h3>
      <p>To convert millions of revolutions <InlineMath math="L_{10}" /> to operating hours <InlineMath math="L_{10h}" /> at a constant speed RPM:</p>
      <BlockMath math="L_{10h} = \frac{10^6 \times L_{10}}{60 \times \text{RPM}}" />
    </div>
  );

  return (
    <ToolContentLayout
      title="L10 Bearing Life Calculator (ISO 281)"
      description="Calculate Basic Rating Life (L10 in revolutions and L10h in operating hours) for ball and roller bearings per ISO 281 standard."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="L10 bearing life calculator, ISO 281 bearing life, basic rating life, ball bearing life formula, roller bearing life hours"
      canonicalUrl="https://reliabilitytools.co.in/tools/bearing-life/"
    />
  );
};

export default BearingLifeCalculator;
