import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface StressBlock {
  id: string;
  stressMpa: string; // Stress amplitude or range (MPa)
  appliedCycles: string; // n_i
  allowableCycles: string; // N_i
}

interface MinersRuleState {
  componentName: string;
  criticalDamage: string; // Typically 1.0 (or 0.5 per offshore rules)
  blocks: StressBlock[];
}

const DEFAULT_BLOCKS: StressBlock[] = [
  { id: '1', stressMpa: '180', appliedCycles: '45000', allowableCycles: '150000' },
  { id: '2', stressMpa: '140', appliedCycles: '220000', allowableCycles: '800000' },
  { id: '3', stressMpa: '95', appliedCycles: '1200000', allowableCycles: '5000000' }
];

const MinersRule: React.FC = () => {
  const [state, setState] = useShareableState<MinersRuleState>({
    componentName: 'Overhead Crane Girders & Shaft',
    criticalDamage: '1.0',
    blocks: DEFAULT_BLOCKS
  });

  const { componentName, criticalDamage, blocks } = state;
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'miners-rule',
      name: "Miner's Rule Fatigue Calculator",
      path: '/tools/miners-rule/'
    });
  }, []);

  const critD = Math.max(0.1, parseFloat(criticalDamage) || 1.0);

  // Compute individual damage ratios d_i = n_i / N_i and cumulative damage D
  const evaluatedBlocks = blocks.map(b => {
    const n = Math.max(0, parseFloat(b.appliedCycles) || 0);
    const N = Math.max(1, parseFloat(b.allowableCycles) || 1);
    const damage = n / N;
    return { ...b, damage, n, N };
  });

  const totalDamage = evaluatedBlocks.reduce((sum, b) => sum + b.damage, 0);
  const percentLifeConsumed = (totalDamage / critD) * 100;
  const remainingLifeFactor = totalDamage > 0 ? (critD / totalDamage) : 10;

  let statusBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let statusText = 'Safe Operational Life Remaining';

  if (totalDamage >= critD) {
    statusBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    statusText = 'Critical Fatigue Limit Exceeded (Failure Imminent)';
  } else if (totalDamage >= critD * 0.75) {
    statusBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    statusText = 'High Fatigue Damage (Schedule Immediate NDT)';
  }

  const addBlock = () => {
    const newBlock: StressBlock = {
      id: Date.now().toString(),
      stressMpa: '100',
      appliedCycles: '50000',
      allowableCycles: '1000000'
    };
    setState({ ...state, blocks: [...blocks, newBlock] });
  };

  const updateBlock = (id: string, field: keyof StressBlock, val: string) => {
    setState({
      ...state,
      blocks: blocks.map(b => b.id === id ? { ...b, [field]: val } : b)
    });
  };

  const removeBlock = (id: string) => {
    setState({
      ...state,
      blocks: blocks.filter(b => b.id !== id)
    });
  };

  const ToolComponent = (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              ISO 12107 / ASTM E1049 Cumulative Fatigue Analysis
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Palmgren-Miner Linear Damage Accumulation Model
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${statusBadge}`}>
            {statusText}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Component / Structural Detail Name
            </label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setState({ ...state, componentName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Critical Damage Threshold (<InlineMath math="D_{\text{crit}}" />)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="2.0"
              value={criticalDamage}
              onChange={(e) => setState({ ...state, criticalDamage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Standard = 1.0 (0.5 for critical subsea / offshore welds).</p>
          </div>
        </div>
      </div>

      {/* Stress Spectrum Blocks Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" /> Variable Amplitude Stress Spectrum
          </h4>
          <button
            onClick={addBlock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Stress Bin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Stress Range (<InlineMath math="\Delta \sigma" /> MPa)</th>
                <th className="p-3">Applied Cycles (<InlineMath math="n_i" />)</th>
                <th className="p-3">S-N Endurance (<InlineMath math="N_i" />)</th>
                <th className="p-3">Partial Damage (<InlineMath math="n_i / N_i" />)</th>
                <th className="p-3">% Contribution</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {evaluatedBlocks.map((b) => {
                const contribPct = totalDamage > 0 ? (b.damage / totalDamage) * 100 : 0;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="number"
                        value={b.stressMpa}
                        onChange={(e) => updateBlock(b.id, 'stressMpa', e.target.value)}
                        className="w-24 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={b.appliedCycles}
                        onChange={(e) => updateBlock(b.id, 'appliedCycles', e.target.value)}
                        className="w-32 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={b.allowableCycles}
                        onChange={(e) => updateBlock(b.id, 'allowableCycles', e.target.value)}
                        className="w-32 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-100">
                      {b.damage.toFixed(4)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, contribPct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-500">{contribPct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeBlock(b.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Cumulative Damage (<InlineMath math="D" />)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${totalDamage >= critD ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
            {totalDamage.toFixed(4)}
          </span>
          <span className="text-[11px] text-slate-400">Limit: {critD.toFixed(2)}</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Life Consumed</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${percentLifeConsumed >= 100 ? 'text-rose-500' : percentLifeConsumed >= 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {percentLifeConsumed.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">of fatigue limit</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Fatigue Safety Margin</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {remainingLifeFactor >= 1 ? `${remainingLifeFactor.toFixed(2)}×` : 'Failed'}
          </span>
          <span className="text-[11px] text-slate-400">multiples of current spectrum</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Remaining Spectrum Life</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {totalDamage < critD ? `${((1 - (totalDamage / critD)) * 100).toFixed(1)}%` : '0.0%'}
          </span>
          <span className="text-[11px] text-slate-400">fatigue endurance left</span>
        </div>
      </div>

      <ShareAndExport
        toolName="Miner's Rule Cumulative Fatigue Calculator"
        shareUrl="https://reliabilitytools.co.in/tools/miners-rule/"
        inputs={{
          "Component": componentName,
          "Critical Damage Limit": criticalDamage,
          "Stress Blocks Count": blocks.length
        }}
        results={{
          "Cumulative Damage Index (D)": totalDamage.toFixed(4),
          "Fatigue Life Consumed": `${percentLifeConsumed.toFixed(2)}%`,
          "Safety Factor Against Fatigue": `${remainingLifeFactor.toFixed(2)}x`,
          "Structural Status": statusText
        }}
        exportData={evaluatedBlocks.map(b => ({
          Stress_MPa: b.stressMpa,
          Applied_Cycles: b.appliedCycles,
          Allowable_Cycles: b.allowableCycles,
          Partial_Damage: b.damage.toFixed(6)
        }))}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Fatigue Failure Physics: <span className="text-cyan-600 dark:text-cyan-400">Palmgren-Miner Linear Cumulative Damage</span>
        </h2>
        <p>
          In structural and mechanical reliability engineering, physical assets rarely operate under idealized constant-amplitude sinusoidal stress. Turbines, railway axles, continuous casting rollers, and overhead crane structures endure variable amplitude cyclical loads. <strong>Miner's Rule</strong> (also known as the Palmgren-Miner linear damage hypothesis) provides the mathematical foundation for predicting progressive microstructural damage accumulation and remaining fatigue life.
        </p>
        <p>
          Standardized under <strong>ISO 12107</strong> and reinforced by <strong>ASTM E1049</strong> (rainflow cycle counting) and <strong>BS 7608</strong> (fatigue design of welded steel joints), the hypothesis assumes that each stress cycle consumes an incremental fraction of the total fatigue life of the material, independent of load sequencing.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The S-N Wöhler Curve Connection
        </h3>
        <p>
          For every applied stress range (<InlineMath math="\Delta \sigma_i" />), material fatigue specimens tested in accordance with ISO 12107 establish an endurance capacity (<InlineMath math="N_i" />) defined by the power-law equation:
        </p>
        <div className="my-4">
          <BlockMath math="N_i \times (\Delta \sigma_i)^m = C" />
        </div>
        <p>
          Where <InlineMath math="m" /> is the inverse slope of the S-N curve (typically <InlineMath math="m = 3" /> to <InlineMath math="m = 5" /> for structural steel and welded joints) and <InlineMath math="C" /> is the fatigue detail category constant. By counting the actual applied cycles (<InlineMath math="n_i" />) within discrete stress bands, engineers calculate the partial damage contribution.
        </p>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Miner's Rule: Formulas & Standards
        </h2>
        <p>
          Under the Palmgren-Miner hypothesis, cumulative fatigue damage (<InlineMath math="D" />) is the arithmetic sum of cycle ratios across all <InlineMath math="k" /> stress blocks:
        </p>
        <div className="my-6">
          <BlockMath math="D = \sum_{i=1}^{k} \frac{n_i}{N_i}" />
        </div>
        <p>
          Theoretical fatigue failure occurs when the cumulative damage index reaches unity:
        </p>
        <div className="my-6">
          <BlockMath math="D \ge D_{\text{crit}} = 1.0" />
        </div>
        <p>
          However, in high-consequence industries governed by <strong>ISO 19902</strong> (offshore structures) and <strong>ASME Section VIII Div 2</strong>, engineers adopt conservative design criteria where <InlineMath math="D_{\text{crit}} = 0.5" /> or <InlineMath math="0.2" /> to account for corrosive environments, mean stress tensile shifts, and material scatter.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Heavy Steel Mill Crane Girder
        </h3>
        <p>
          An inspection strain gauge audit on a 100-ton steel ladle crane identifies three recurring cyclic loading regimes over 5 operational years:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong>High Load (Full Ladle Pick):</strong> <InlineMath math="\Delta \sigma_1 = 160\text{ MPa}" />, applied cycles <InlineMath math="n_1 = 30,000" />, S-N endurance <InlineMath math="N_1 = 100,000" /> cycles.
            <br />
            <InlineMath math="d_1 = \frac{30,000}{100,000} = 0.300" />
          </li>
          <li>
            <strong>Medium Load (Empty Ladle Return):</strong> <InlineMath math="\Delta \sigma_2 = 120\text{ MPa}" />, applied cycles <InlineMath math="n_2 = 180,000" />, S-N endurance <InlineMath math="N_2 = 600,000" /> cycles.
            <br />
            <InlineMath math="d_2 = \frac{180,000}{600,000} = 0.300" />
          </li>
          <li>
            <strong>Low Load (Unloaded Bridge Travel):</strong> <InlineMath math="\Delta \sigma_3 = 80\text{ MPa}" />, applied cycles <InlineMath math="n_3 = 800,000" />, S-N endurance <InlineMath math="N_3 = 4,000,000" /> cycles.
            <br />
            <InlineMath math="d_3 = \frac{800,000}{4,000,000} = 0.200" />
          </li>
        </ul>
        <p className="mt-3">
          <strong>Cumulative Damage Calculation:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="D = 0.300 + 0.300 + 0.200 = 0.800" />
        </div>
        <p>
          <strong>Life Assessment:</strong> The girder has consumed <strong>80.0%</strong> of its design fatigue life (<InlineMath math="D = 0.800" />). With 5 operational years elapsed, the estimated remaining life is:
        </p>
        <div className="my-2">
          <InlineMath math="\text{Remaining Life} = 5 \text{ years} \times \left(\frac{1.0 - 0.800}{0.800}\right) = 1.25\text{ years}" />
        </div>
        <p>
          The plant reliability team schedules ultrasonic testing (UT) and magnetic particle inspection (MPI) along the critical weld toes before the next annual shutdown.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Engineering Mistakes in Fatigue Life Analysis
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Omitting Tensile Mean Stress Corrections:</strong> Miner's Rule evaluates alternating stress range. Tensile mean stress accelerates crack propagation, whereas compressive residual stresses (e.g. from shot peening) retard crack growth. Goodman or Gerber mean stress corrections should be applied prior to entering S-N curves.
          </li>
          <li>
            <strong>Assuming Load Sequence Independence:</strong> Linear damage summation assumes high-low and low-high cycle sequences produce equal damage. In reality, high-amplitude overloads introduce compressive residual stresses at crack tips that can temporarily arrest subsequent low-cycle damage (crack retardation).
          </li>
          <li>
            <strong>Truncating Low-Stress Cycles Below Fatigue Limit:</strong> Under variable amplitude loading, cycles below the constant-amplitude endurance limit (<InlineMath math="\Delta \sigma_D" />) cause fatigue damage once microcracks have initiated from higher stress cycles (Haibach modified S-N slope rule).
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is Rainflow cycle counting (ASTM E1049) and why is it required?",
      answer: "Rainflow cycle counting is the standard algorithmic method (ASTM E1049) used to extract closed hysteresis stress-strain loops from erratic, real-world strain gauge signals. You cannot apply Miner's Rule directly to raw vibration or stress data without first converting the peaks and valleys into equivalent full and half cycles."
    },
    {
      question: "Why do some codes use D = 0.5 or D = 0.2 instead of D = 1.0?",
      answer: "A critical damage threshold of D = 1.0 is based on laboratory coupon tests under controlled environments. For welded offshore structures, nuclear piping, or uninspectable subterranean foundations, codes like ISO 19902 mandate D ≤ 0.5 (or 0.2) to compensate for corrosion, weld flaws, and catastrophic failure risk."
    },
    {
      question: "What international standards govern fatigue life testing and S-N curves?",
      answer: "Statistical fatigue data analysis is governed by <strong>ISO 12107</strong> (Metallic materials - Fatigue testing - Statistical planning and analysis of data), <strong>ASTM E1049</strong> (Cycle Counting in Fatigue Analysis), and <strong>BS 7608</strong> (Code of practice for fatigue design and assessment of steel structures)."
    }
  ];

  return (
    <ToolContentLayout
      title="Miner's Rule Fatigue Calculator – Free Online | Reliability Tools"
      description="Calculate cumulative fatigue damage and consumed structural life per ISO 12107 and ASTM E1049 using Palmgren-Miner linear damage accumulation cycle sums."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="miners-rule" />
        </>
      }
      faqs={faqs}
      keywords="Miner's rule fatigue calculator, cumulative fatigue damage, ISO 12107, ASTM E1049, Palmgren-Miner hypothesis, S-N curve, cycle counting, structural fatigue life"
      canonicalUrl="https://reliabilitytools.co.in/tools/miners-rule/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "Miner's Rule Fatigue Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "ISO 12107 / ASTM E1049",
          description: "International standards for metallic materials fatigue testing, statistical life analysis, and cycle counting in fatigue damage evaluation."
        }
      }}
    />
  );
};

export default MinersRule;
