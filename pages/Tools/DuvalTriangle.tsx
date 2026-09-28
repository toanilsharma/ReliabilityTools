import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Flame, 
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface DuvalState {
  ch4: string; // Methane (ppm)
  c2h4: string; // Ethylene (ppm)
  c2h2: string; // Acetylene (ppm)
  transformerId: string;
}

export type DuvalFaultType = 
  | 'PD' 
  | 'T1' 
  | 'T2' 
  | 'T3' 
  | 'D1' 
  | 'D2' 
  | 'DT';

interface FaultDiagnosis {
  code: DuvalFaultType;
  name: string;
  severity: 'normal' | 'caution' | 'warning' | 'critical';
  description: string;
  recommendedAction: string;
}

export function classifyDuvalTriangle1(pctCH4: number, pctC2H4: number, pctC2H2: number): FaultDiagnosis {
  // IEC 60599 & IEEE C57.104 Duval Triangle 1 Coordinate Boundaries
  if (pctCH4 >= 98) {
    return {
      code: 'PD',
      name: 'Partial Discharge (Corona)',
      severity: 'warning',
      description: 'Cold discharge in gas voids or paper insulation cavities leading to dielectric degradation.',
      recommendedAction: 'Perform acoustic PD detection, check oil moisture, and trend monthly.'
    };
  }

  if (pctC2H2 >= 13 && pctC2H4 < 23) {
    return {
      code: 'D1',
      name: 'Discharge of Low Energy (Sparking)',
      severity: 'caution',
      description: 'Low-energy sparks between floating potential conductors or static discharge.',
      recommendedAction: 'Inspect tap changer selector contacts and verify tank grounding.'
    };
  }

  if (pctC2H2 >= 29 || (pctC2H2 >= 13 && pctC2H4 >= 23 && pctCH4 < 40)) {
    return {
      code: 'D2',
      name: 'Discharge of High Energy (Arcing)',
      severity: 'critical',
      description: 'Flashover, high-voltage breakdown, or power arc through transformer oil and pressboard.',
      recommendedAction: 'Immediate shutdown advised. Perform Doble power factor and dielectric breakdown tests.'
    };
  }

  if (pctC2H2 >= 4 && pctC2H2 < 13 && pctC2H4 >= 50) {
    return {
      code: 'DT',
      name: 'Mixture of Thermal & Electrical Faults',
      severity: 'critical',
      description: 'Simultaneous electrical sparking and localized overheating exceeding 700°C.',
      recommendedAction: 'Inspect core-and-coil assembly and winding insulation clamping structure.'
    };
  }

  if (pctC2H4 < 20 && pctC2H2 < 4) {
    return {
      code: 'T1',
      name: 'Thermal Fault < 300°C',
      severity: 'caution',
      description: 'Low temperature hot spot (e.g. overloaded copper windings or core stray flux).',
      recommendedAction: 'Check cooling fans, radiators, and oil pump circulation rates.'
    };
  }

  if (pctC2H4 >= 20 && pctC2H4 < 50 && pctC2H2 < 4) {
    return {
      code: 'T2',
      name: 'Thermal Fault 300°C - 700°C',
      severity: 'warning',
      description: 'Medium thermal overheating causing carbonization of paper insulation around conductors.',
      recommendedAction: 'De-rate transformer load and monitor carbon monoxide (CO) / CO2 ratio.'
    };
  }

  // Fallback: T3
  return {
    code: 'T3',
    name: 'Thermal Fault > 700°C',
    severity: 'critical',
    description: 'High temperature hot spot with severe oil boiling and metal spalling.',
    recommendedAction: 'Immediate de-energization and internal inspection for loose connection lugs or shorted laminations.'
  };
}

const DuvalTriangle: React.FC = () => {
  const [state, setState] = useShareableState<DuvalState>({
    ch4: '85',
    c2h4: '145',
    c2h2: '12',
    transformerId: 'TX-MAIN-01'
  });

  const { ch4, c2h4, c2h2, transformerId } = state;
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'duval-triangle',
      name: 'Duval Triangle Calculator',
      path: '/tools/duval-triangle/'
    });
  }, []);

  const valCH4 = Math.max(0, parseFloat(ch4) || 0);
  const valC2H4 = Math.max(0, parseFloat(c2h4) || 0);
  const valC2H2 = Math.max(0, parseFloat(c2h2) || 0);
  const total = valCH4 + valC2H4 + valC2H2;

  const pctCH4 = total > 0 ? (valCH4 / total) * 100 : 33.33;
  const pctC2H4 = total > 0 ? (valC2H4 / total) * 100 : 33.33;
  const pctC2H2 = total > 0 ? (valC2H2 / total) * 100 : 33.34;

  const diagnosis = classifyDuvalTriangle1(pctCH4, pctC2H4, pctC2H2);

  // Convert ternary % (CH4: top, C2H4: bottom-right, C2H2: bottom-left) to 2D Cartesian SVG coordinates
  // Equilateral triangle with corners:
  // Top (CH4 = 100%): (200, 20)
  // Bottom-Left (C2H2 = 100%): (40, 320)
  // Bottom-Right (C2H4 = 100%): (360, 320)
  const xPt = 40 + (pctC2H4 * 3.2) + (pctCH4 * 1.6);
  const yPt = 320 - (pctCH4 * 3.0);

  const getSeverityBadge = (sev: FaultDiagnosis['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'caution':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
    }
  };

  const ToolComponent = (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-500" /> DGA Gas Concentrations (PPM)
            </h3>
            <span className="text-xs px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full font-semibold">
              IEC 60599 / IEEE C57.104
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Transformer / Asset ID
            </label>
            <input
              type="text"
              value={transformerId}
              onChange={(e) => setState({ ...state, transformerId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. TX-400KV-01"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Methane (<InlineMath math="\text{CH}_4" />) [ppm]
            </label>
            <input
              type="number"
              min="0"
              value={ch4}
              onChange={(e) => setState({ ...state, ch4: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Typical diagnostic gas for low-temperature heating & PD.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Ethylene (<InlineMath math="\text{C}_2\text{H}_4" />) [ppm]
            </label>
            <input
              type="number"
              min="0"
              value={c2h4}
              onChange={(e) => setState({ ...state, c2h4: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">High-temperature thermal gas (&gt; 300°C decomposition).</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Acetylene (<InlineMath math="\text{C}_2\text{H}_2" />) [ppm]
            </label>
            <input
              type="number"
              min="0"
              value={c2h2}
              onChange={(e) => setState({ ...state, c2h2: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Critical arcing / spark indicator gas (&gt; 1000°C breakdown).</p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Total Key Hydrocarbons:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{total.toFixed(1)} ppm</span>
          </div>
        </div>

        {/* Visual Duval Triangle Chart & Live Diagnostic */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Duval Triangle 1 (IEC 60599)
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getSeverityBadge(diagnosis.severity)}`}>
                {diagnosis.code}: {diagnosis.name}
              </span>
            </div>

            {/* Ternary SVG Visualization */}
            <div className="flex justify-center">
              <svg viewBox="0 0 400 360" className="w-full max-w-[420px] h-auto drop-shadow-md">
                {/* Background grid / Outer Triangle */}
                <polygon
                  points="200,30 40,320 360,320"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Approximate Fault Zones for Duval 1 */}
                {/* PD zone at top apex */}
                <polygon points="200,30 190,55 210,55" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="0.8" />
                <text x="200" y="48" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">PD</text>

                {/* T1 zone */}
                <polygon points="190,55 160,110 215,110 210,55" fill="#60a5fa" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="0.8" />
                <text x="190" y="90" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">T1</text>

                {/* T2 zone */}
                <polygon points="160,110 130,170 230,170 215,110" fill="#fbbf24" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="0.8" />
                <text x="185" y="145" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">T2</text>

                {/* T3 zone */}
                <polygon points="130,170 100,240 260,240 230,170" fill="#f97316" fillOpacity="0.25" stroke="#f97316" strokeWidth="0.8" />
                <text x="180" y="210" fill="#fdba74" fontSize="10" fontWeight="bold" textAnchor="middle">T3</text>

                {/* D1 zone (bottom left) */}
                <polygon points="40,320 100,240 140,280 60,320" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="0.8" />
                <text x="85" y="290" fill="#d8b4fe" fontSize="9" fontWeight="bold" textAnchor="middle">D1</text>

                {/* D2 zone (bottom right & center arcing) */}
                <polygon points="140,280 180,320 360,320 260,240" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="0.8" />
                <text x="250" y="295" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">D2</text>

                {/* DT zone (middle mixture) */}
                <polygon points="100,240 140,280 180,320 60,320" fill="#ec4899" fillOpacity="0.2" stroke="#ec4899" strokeWidth="0.8" />
                <text x="120" y="275" fill="#f472b6" fontSize="8" fontWeight="bold" textAnchor="middle">DT</text>

                {/* Triangle Labels */}
                <text x="200" y="18" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">% CH4 (Top)</text>
                <text x="25" y="340" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="start">% C2H2 (Left)</text>
                <text x="375" y="340" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">% C2H4 (Right)</text>

                {/* Active Sample Marker */}
                {total > 0 && (
                  <g>
                    <circle cx={xPt} cy={yPt} r="10" fill="#06b6d4" fillOpacity="0.3" className="animate-ping" />
                    <circle cx={xPt} cy={yPt} r="6" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" />
                    <line x1={xPt} y1={yPt} x2={xPt} y2={320} stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                  </g>
                )}
              </svg>
            </div>

            {/* Percentage Badges */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">% Methane (CH4)</span>
                <span className="text-sm font-black text-cyan-400">{pctCH4.toFixed(1)}%</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">% Ethylene (C2H4)</span>
                <span className="text-sm font-black text-amber-400">{pctC2H4.toFixed(1)}%</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block">% Acetylene (C2H2)</span>
                <span className="text-sm font-black text-rose-400">{pctC2H2.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Action Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-slate-900 dark:text-white">
                Engineering Assessment: {diagnosis.name}
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {diagnosis.description}
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide block mb-1">
                Action Protocol
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {diagnosis.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ShareAndExport
        toolTitle="Duval Triangle DGA Calculator"
        inputs={{
          "Asset ID": transformerId,
          "Methane (CH4)": `${ch4} ppm`,
          "Ethylene (C2H4)": `${c2h4} ppm`,
          "Acetylene (C2H2)": `${c2h2} ppm`
        }}
        results={{
          "Fault Classification": `${diagnosis.code} - ${diagnosis.name}`,
          "% Methane": `${pctCH4.toFixed(2)}%`,
          "% Ethylene": `${pctC2H4.toFixed(2)}%`,
          "% Acetylene": `${pctC2H2.toFixed(2)}%`,
          "Severity": diagnosis.severity.toUpperCase()
        }}
        exportData={[
          { Parameter: "Asset ID", Value: transformerId },
          { Parameter: "Methane (CH4 ppm)", Value: ch4 },
          { Parameter: "Ethylene (C2H4 ppm)", Value: c2h4 },
          { Parameter: "Acetylene (C2H2 ppm)", Value: c2h2 },
          { Parameter: "% CH4", Value: pctCH4.toFixed(2) },
          { Parameter: "% C2H4", Value: pctC2H4.toFixed(2) },
          { Parameter: "% C2H2", Value: pctC2H2.toFixed(2) },
          { Parameter: "Fault Code", Value: diagnosis.code },
          { Parameter: "Diagnosis", Value: diagnosis.name }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Transformer DGA Diagnostics: <span className="text-cyan-600 dark:text-cyan-400">The Duval Triangle Method</span>
        </h2>
        <p>
          Dissolved Gas Analysis (DGA) is the preeminent non-destructive predictive maintenance technique for oil-immersed power and distribution transformers. Thermal and electrical stresses decompose transformer mineral oil and cellulose insulation into characteristic combustible gases. While key gas concentration levels signal the presence of abnormal stress, the <strong>Duval Triangle 1</strong> diagnostic graphical method provides conclusive identification of the specific internal fault mechanism.
        </p>
        <p>
          Standardized under <strong>IEC 60599</strong> and <strong>IEEE C57.104</strong>, Duval Triangle 1 coordinates the relative percentages of three critical hydrocarbons: Methane (<InlineMath math="\text{CH}_4" />), Ethylene (<InlineMath math="\text{C}_2\text{H}_4" />), and Acetylene (<InlineMath math="\text{C}_2\text{H}_2" />). By normalizing these three gases to 100%, Duval Triangle eliminates dilution effects caused by variable oil volumes, gas sampling loss, and ambient headspace breathing.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Understanding the 7 IEC 60599 Fault Zones
        </h3>
        <p>
          Duval Triangle 1 separates transformer thermal and electrical anomalies into 7 distinct fault domains:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>PD (Partial Discharge):</strong> Cold ionization discharges inside gas bubbles, voids, or moisture-contaminated pressboard layers (<InlineMath math="\% \text{CH}_4 \ge 98\%" />).
          </li>
          <li>
            <strong>D1 (Discharges of Low Energy):</strong> Sparking, tracking, or pinhole punctures in paper insulation caused by static electricity or floating metallic components.
          </li>
          <li>
            <strong>D2 (Discharges of High Energy):</strong> Continuous power arcs, flashovers between turns, or catastrophic breakdown between phase windings and core ground. Characterized by high Acetylene (<InlineMath math="\text{C}_2\text{H}_2" />).
          </li>
          <li>
            <strong>T1 (Thermal Fault &lt; 300°C):</strong> Low-temperature heating, overloaded tank walls, or cooling duct blockage.
          </li>
          <li>
            <strong>T2 (Thermal Fault 300°C to 700°C):</strong> Overheating causing severe carbonization and embrittlement of paper wraps.
          </li>
          <li>
            <strong>T3 (Thermal Fault &gt; 700°C):</strong> Severe core laminations shorting, bolt hot spots, or circulating currents in structural clamping rings. Marked by predominant Ethylene (<InlineMath math="\text{C}_2\text{H}_4" />).
          </li>
          <li>
            <strong>DT (Electrical & Thermal Mixture):</strong> Complex combined breakdown exhibiting both electrical arcing and severe sustained local overheating.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Duval Triangle 1: Formulas & Standards
        </h2>
        <p>
          The Duval method normalizes the absolute concentrations (measured in parts per million, ppm) of the three diagnostic gases against their collective total:
        </p>
        <div className="my-6">
          <BlockMath math="\% \text{CH}_4 = \frac{[\text{CH}_4]}{[\text{CH}_4] + [\text{C}_2\text{H}_4] + [\text{C}_2\text{H}_2]} \times 100\%" />
          <BlockMath math="\% \text{C}_2\text{H}_4 = \frac{[\text{C}_2\text{H}_4]}{[\text{CH}_4] + [\text{C}_2\text{H}_4] + [\text{C}_2\text{H}_2]} \times 100\%" />
          <BlockMath math="\% \text{C}_2\text{H}_2 = \frac{[\text{C}_2\text{H}_2]}{[\text{CH}_4] + [\text{C}_2\text{H}_4] + [\text{C}_2\text{H}_2]} \times 100\%" />
        </div>
        <p>
          Governed by <strong>IEC 60599</strong> (<em>"Mineral oil-impregnated electrical equipment in service – Guide to the interpretation of dissolved and free gases analysis"</em>) and <strong>IEEE Std C57.104</strong>, the calculated percentages map onto a triangular coordinate grid where each vertex represents 100% of a specific gas.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Generator Step-Up (GSU) Transformer
        </h3>
        <p>
          A 315 MVA, 400 kV/21 kV generator step-up transformer oil lab report returns the following dissolved gas concentrations:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Methane (<InlineMath math="\text{CH}_4" />) = 110 ppm</li>
          <li>Ethylene (<InlineMath math="\text{C}_2\text{H}_4" />) = 380 ppm</li>
          <li>Acetylene (<InlineMath math="\text{C}_2\text{H}_2" />) = 10 ppm</li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Calculate Total Key Gases:</strong>
        </p>
        <div className="my-2">
          <InlineMath math="\text{Total} = 110 + 380 + 10 = 500\text{ ppm}" />
        </div>
        <p>
          <strong>Step 2: Calculate Coordinates:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\% \text{CH}_4 = \frac{110}{500} = 22.0\%, \quad \% \text{C}_2\text{H}_4 = \frac{380}{500} = 76.0\%, \quad \% \text{C}_2\text{H}_2 = \frac{10}{500} = 2.0\%" />
        </div>
        <p>
          <strong>Step 3: Diagnosis:</strong> Because <InlineMath math="\% \text{C}_2\text{H}_4 \ge 50\%" /> and <InlineMath math="\% \text{C}_2\text{H}_2 < 4\%" />, the coordinates plot squarely in the <strong>T3 zone (Thermal Fault &gt; 700°C)</strong>. The engineering team immediately schedules an infrared thermography inspection of the tank bushings and inspects the magnetic core shunts during the next maintenance window.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Engineering Mistakes in DGA Interpretation
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Applying Duval Triangle on Baseline Oil:</strong> Duval Triangle 1 is designed to classify faults <em>only after</em> total gas levels or gas generation rates exceed IEEE C57.104 Condition 1 thresholds. Running the calculator on virgin or healthy oil will trigger false positive fault classifications.
          </li>
          <li>
            <strong>Ignoring Acetylene Trace Signals:</strong> Any Acetylene (<InlineMath math="\text{C}_2\text{H}_2" />) concentration above 2–3 ppm is abnormal for a non-OLTC main tank. Even small increases drastically shift the coordinate toward destructive arcing zones (D1 or D2).
          </li>
          <li>
            <strong>Confusing OLTC Contamination with Main Tank Faults:</strong> In transformers with in-tank On-Load Tap Changers (OLTC), switching arcs naturally generate high Acetylene. Barrier board leaks will pollute the main tank oil, producing false arcing alerts.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "When should I use Duval Triangle 1 vs Duval Triangle 4 or 5?",
      answer: "Duval Triangle 1 is the universal first-line tool for diagnosing general mineral oil transformer faults. Duval Triangle 4 and 5 are specialized secondary tools applied specifically to verify low-temperature thermal faults in oil (Triangle 4) or thermal faults in cellulose and paper insulation (Triangle 5)."
    },
    {
      question: "Why does the Duval Triangle omit Hydrogen (H2) and Carbon Monoxide (CO)?",
      answer: "Duval Triangle 1 focuses strictly on hydrocarbons (CH4, C2H4, C2H2) because their thermal cracking thresholds precisely separate temperature bands and arcing energy. Hydrogen and Carbon Monoxide diffuse rapidly through gaskets and paper, making their absolute ratios less stable for geometric zone classification."
    },
    {
      question: "What international standards govern Duval Triangle calculations?",
      answer: "The Duval Triangle method is formalized under <strong>IEC 60599</strong> (Guide to the interpretation of dissolved and free gases analysis) and endorsed by <strong>IEEE C57.104</strong> (IEEE Guide for the Interpretation of Gases Generated in Mineral Oil-Immersed Transformers)."
    }
  ];

  return (
    <ToolContentLayout
      title="Duval Triangle Calculator – Free Online | Reliability Tools"
      description="Diagnose transformer DGA oil faults using the IEC 60599 and IEEE C57.104 Duval Triangle 1 method. Accurately classify thermal, arcing, and discharge faults."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="duval-triangle" />
        </>
      }
      faqs={faqs}
      keywords="Duval Triangle calculator, transformer DGA calculator, IEC 60599, IEEE C57.104, dissolved gas analysis, transformer oil fault diagnosis, partial discharge, arcing fault"
      canonicalUrl="https://reliabilitytools.co.in/tools/duval-triangle/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "Duval Triangle Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "IEC 60599 / IEEE C57.104",
          description: "International standards for the interpretation of dissolved and free gases analysis in electrical equipment mineral oil."
        }
      }}
    />
  );
};

export default DuvalTriangle;
