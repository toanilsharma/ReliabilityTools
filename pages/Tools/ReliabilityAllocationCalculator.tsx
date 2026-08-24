import React, { useState, useMemo, useRef } from 'react';
import { Layers, Clock, Settings, Copy, Check, Share2, Info, Calculator } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface SubsystemData {
  id: string;
  name: string;
  importance: number; // Operational importance weight w_i (0 to 1)
  complexity: number;  // Subsystem complexity / part count E_i
}

interface AllocationState {
  targetReliability: string; // R_s(t)
  missionTime: string;       // t in hours
  method: 'equal' | 'agree';
  subsystems: SubsystemData[];
}

const DEFAULT_SUBSYSTEMS: SubsystemData[] = [
  { id: '1', name: 'Subsystem A (Power Supply)', importance: 1.0, complexity: 120 },
  { id: '2', name: 'Subsystem B (Control Unit)', importance: 0.9, complexity: 350 },
  { id: '3', name: 'Subsystem C (Actuator Drive)', importance: 1.0, complexity: 80 },
  { id: '4', name: 'Subsystem D (Sensor Module)', importance: 0.8, complexity: 50 }
];

const ReliabilityAllocationCalculator: React.FC = () => {
  const [state, setState] = useState<AllocationState>({
    targetReliability: '0.95',
    missionTime: '1000',
    method: 'agree',
    subsystems: DEFAULT_SUBSYSTEMS
  });

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toolRef = useRef<HTMLDivElement>(null);

  const { targetReliability, missionTime, method, subsystems } = state;

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const r = parseFloat(targetReliability);
    if (!targetReliability || isNaN(r) || r <= 0 || r >= 1) {
      newErrors.targetReliability = 'Target reliability must be between 0 and 1 (e.g., 0.95).';
      isValid = false;
    }

    const t = parseFloat(missionTime);
    if (!missionTime || isNaN(t) || t <= 0) {
      newErrors.missionTime = 'Mission duration must be greater than 0 hours.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      trackToolCalculation('Reliability Allocation Calculator', 'reliability-allocation');
    }
  };

  const handleSubsystemChange = (index: number, field: 'name' | 'importance' | 'complexity', value: any) => {
    setState(prev => {
      const nextSubs = [...prev.subsystems];
      if (field === 'name') {
        nextSubs[index].name = String(value);
      } else {
        nextSubs[index][field] = Math.max(0.01, Number(value) || 0);
      }
      return { ...prev, subsystems: nextSubs };
    });
  };

  const handleAddSubsystem = () => {
    const nextId = String(subsystems.length + 1);
    setState(prev => ({
      ...prev,
      subsystems: [
        ...prev.subsystems,
        { id: nextId, name: `Subsystem ${nextId}`, importance: 1.0, complexity: 100 }
      ]
    }));
  };

  const handleRemoveSubsystem = (index: number) => {
    if (subsystems.length <= 1) return;
    setState(prev => ({
      ...prev,
      subsystems: prev.subsystems.filter((_, idx) => idx !== index)
    }));
  };

  const calculationResults = useMemo(() => {
    const Rs = parseFloat(targetReliability) || 0.95;
    const t = parseFloat(missionTime) || 1000;
    const N = subsystems.length || 1;

    // Overall System Failure Rate: lambda_s = -ln(R_s) / t
    const lambdaSystem = -Math.log(Rs) / t; // failures per hour

    if (method === 'equal') {
      // Equal Apportionment: R_i = R_s^(1/N)
      const allocatedR = Math.pow(Rs, 1 / N);
      const allocatedLambda = lambdaSystem / N;

      const allocatedSubs = subsystems.map(sub => ({
        ...sub,
        allocatedReliability: allocatedR,
        allocatedLambda: allocatedLambda,
        allocatedMtbf: allocatedLambda > 0 ? 1 / allocatedLambda : 0
      }));

      return {
        Rs,
        t,
        lambdaSystem,
        allocatedSubs,
        methodLabel: 'Equal Apportionment Method'
      };
    } else {
      // AGREE Allocation Method:
      // Weighted product sum: sum(w_j * E_j)
      const sumWeightedComplexity = subsystems.reduce((sum, s) => sum + (s.importance * s.complexity), 0) || 1;

      const allocatedSubs = subsystems.map(sub => {
        // Subsystem failure rate: lambda_i = (w_i * E_i / sumWeightedComplexity) * lambda_s
        const weightFactor = (sub.importance * sub.complexity) / sumWeightedComplexity;
        const allocatedLambda = weightFactor * lambdaSystem;
        const allocatedR = Math.exp(-allocatedLambda * t);
        const allocatedMtbf = allocatedLambda > 0 ? 1 / allocatedLambda : 0;

        return {
          ...sub,
          weightFactor,
          allocatedReliability: allocatedR,
          allocatedLambda,
          allocatedMtbf
        };
      });

      return {
        Rs,
        t,
        lambdaSystem,
        allocatedSubs,
        methodLabel: 'AGREE Weighted Allocation Method'
      };
    }
  }, [targetReliability, missionTime, method, subsystems]);

  const handleCopySnippet = () => {
    const text = `Reliability Allocation Summary:
- Target System Reliability R_s: ${(calculationResults.Rs * 100).toFixed(2)}%
- Mission Duration: ${missionTime} hrs
- Method: ${calculationResults.methodLabel}
- Allocated Subsystems: ${subsystems.length}
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/reliability-allocation/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is Reliability Allocation?',
      answer: 'Reliability Allocation (or apportionment) is the process of assigning reliability requirements to individual subsystems so that the overall system meets a top-level reliability target.'
    },
    {
      question: 'What is the difference between Equal Apportionment and the AGREE Method?',
      answer: 'Equal Apportionment divides requirements equally assuming all subsystems are identical. The AGREE method weights allocations based on subsystem complexity (number of parts) and operational importance.'
    },
    {
      question: 'How do allocated failure rates relate to MTBF?',
      answer: 'The allocated Mean Time Between Failures (MTBF) for each subsystem is the inverse of its allocated failure rate: MTBF_i = 1 / lambda_i.'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Form Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-cyan-500" /> Allocation Target Inputs
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Target System Reliability Rs(t)</span>
                <HelpTooltip text="Target probability of success (between 0 and 1, e.g. 0.95)." />
              </label>
              <input
                type="number"
                step="any"
                value={targetReliability}
                onChange={e => setState(s => ({ ...s, targetReliability: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.targetReliability && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.targetReliability}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Mission Duration t (hours)</span>
                <HelpTooltip text="Total required mission operating hours." />
              </label>
              <input
                type="number"
                step="any"
                value={missionTime}
                onChange={e => setState(s => ({ ...s, missionTime: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.missionTime && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.missionTime}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Allocation Apportionment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setState(s => ({ ...s, method: 'agree' }))}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                    method === 'agree'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  AGREE Weighted
                </button>
                <button
                  type="button"
                  onClick={() => setState(s => ({ ...s, method: 'equal' }))}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                    method === 'equal'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Equal Apportionment
                </button>
              </div>
            </div>

            {/* Subsystem Configuration List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Subsystems ({subsystems.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddSubsystem}
                  className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add Subsystem
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {subsystems.map((sub, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={e => handleSubsystemChange(idx, 'name', e.target.value)}
                        className="font-bold text-xs bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white outline-none"
                      />
                      {subsystems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubsystem(idx)}
                          className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {method === 'agree' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Importance (w_i)</label>
                          <input
                            type="number"
                            step="any"
                            value={sub.importance}
                            onChange={e => handleSubsystemChange(idx, 'importance', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Complexity (E_i)</label>
                          <input
                            type="number"
                            step="any"
                            value={sub.complexity}
                            onChange={e => handleSubsystemChange(idx, 'complexity', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Calculate Reliability Allocation
            </button>
          </form>
        </AnimatedContainer>

        {/* Results & Math Breakdown Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 md:p-8 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">{calculationResults.methodLabel}</span>
                <h4 className="text-2xl md:text-3xl font-black text-white mt-1">Allocated Reliability Output</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
              </button>
            </div>

            {/* Subsystem Allocation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-cyan-400 font-extrabold uppercase">
                    <th className="py-2.5 px-3">Subsystem Name</th>
                    <th className="py-2.5 px-3">Allocated R_i(t)</th>
                    <th className="py-2.5 px-3">Allocated Fail Rate (λ_i)</th>
                    <th className="py-2.5 px-3">Allocated MTBF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {calculationResults.allocatedSubs.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-white">{sub.name}</td>
                      <td className="py-3 px-3 font-black text-cyan-300">{(sub.allocatedReliability * 100).toFixed(3)}%</td>
                      <td className="py-3 px-3 text-amber-300">{sub.allocatedLambda.toExponential(4)} /hr</td>
                      <td className="py-3 px-3 text-emerald-300">{Math.round(sub.allocatedMtbf).toLocaleString()} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live KaTeX Formula Steps */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> Live Mathematical Equations
              </span>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <p>1. Total System Failure Rate (<InlineMath math="\lambda_s" />):</p>
                <BlockMath math={`\\lambda_s = \\frac{-\\ln(R_s)}{t} = \\frac{-\\ln(${calculationResults.Rs})}{${calculationResults.t}} = ${calculationResults.lambdaSystem.toExponential(4)} \\text{ failures/hr}`} />

                {method === 'equal' ? (
                  <>
                    <p>2. Equal Apportionment Reliability per Subsystem (<InlineMath math="R_i" />):</p>
                    <BlockMath math={`R_i = R_s^{1/N} = (${calculationResults.Rs})^{1/${subsystems.length}} = ${(calculationResults.allocatedSubs[0].allocatedReliability * 100).toFixed(3)}\\%`} />
                  </>
                ) : (
                  <>
                    <p>2. AGREE Weighted Failure Rate (<InlineMath math="\lambda_i" />):</p>
                    <BlockMath math={`\\lambda_i = \\frac{w_i E_i}{\\sum w_j E_j} \\cdot \\lambda_s`} />
                  </>
                )}
              </div>
            </div>

            <ShareAndExport
              toolName="Reliability Allocation Calculator"
              shareUrl="https://reliabilitytools.co.in/tools/reliability-allocation/"
              resultSummary={`System Target: ${(calculationResults.Rs * 100).toFixed(2)}% over ${missionTime} hrs`}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding System Reliability Allocation</h2>
      <p>
        Reliability allocation is a top-down design process performed during early system architecture design. By apportioning failure rate budgets to individual subsystems, design teams ensure that the overall system meets its required mission reliability goal $R_s(t)$.
      </p>

      <h3>The AGREE Method</h3>
      <p>Developed by the Advisory Group on Reliability of Electronic Equipment, the AGREE allocation method weights failure rates based on:</p>
      <ul>
        <li><strong>Importance Factor (<InlineMath math="w_i" />):</strong> Probability that subsystem failure results in system failure (<InlineMath math="0 < w_i \le 1.0" />).</li>
        <li><strong>Complexity Factor (<InlineMath math="E_i" />):</strong> Estimated number of sub-components or active modules in subsystem <InlineMath math="i" />.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="Reliability Allocation Calculator"
      description="Apportion top-level system reliability targets and failure rate budgets to individual subsystems using Equal Apportionment and AGREE weighted methods."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="reliability allocation calculator, AGREE allocation method, equal apportionment reliability, failure rate budget, subsystem MTBF allocation"
      canonicalUrl="https://reliabilitytools.co.in/tools/reliability-allocation/"
    />
  );
};

export default ReliabilityAllocationCalculator;
