import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  HardDrive
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface BomPart {
  id: string;
  category: string;
  baseLambda: string; // Base failure rate per 10^6 hrs
  quantity: string;
}

interface PartsCountState {
  assemblyName: string;
  environment: string; // Environment factor pi_E
  quality: string;     // Quality factor pi_Q
  missionHours: string;
  parts: BomPart[];
}

const DEFAULT_PARTS: BomPart[] = [
  { id: '1', category: 'Microcontrollers & ICs', baseLambda: '0.045', quantity: '4' },
  { id: '2', category: 'Electrolytic Capacitors', baseLambda: '0.020', quantity: '12' },
  { id: '3', category: 'SMD Ceramic Resistors', baseLambda: '0.001', quantity: '64' },
  { id: '4', category: 'Power MOSFETs / Diodes', baseLambda: '0.035', quantity: '8' },
  { id: '5', category: 'Board-to-Wire Connectors', baseLambda: '0.015', quantity: '3' }
];

const ENV_FACTORS: Record<string, { factor: number; label: string }> = {
  GB: { factor: 1.0, label: 'Ground, Benign (GB - Control room/Office)' },
  GF: { factor: 2.0, label: 'Ground, Fixed (GF - Factory floor)' },
  GM: { factor: 4.0, label: 'Ground, Mobile (GM - Truck/Vehicle)' },
  AIC: { factor: 4.5, label: 'Airborne Inhabited, Cargo (AIC)' },
  NS: { factor: 2.5, label: 'Naval, Sheltered (NS)' }
};

const QUALITY_FACTORS: Record<string, { factor: number; label: string }> = {
  MIL: { factor: 0.5, label: 'Military Hermetic / High Reliability (πQ = 0.5)' },
  IND: { factor: 1.0, label: 'Industrial / Automotive Grade (πQ = 1.0)' },
  COM: { factor: 3.0, label: 'Commercial / Consumer Off-the-Shelf (πQ = 3.0)' }
};

const PartsCountMtbf: React.FC = () => {
  const [state, setState] = useShareableState<PartsCountState>({
    assemblyName: 'Industrial PLC Controller Board',
    environment: 'GF',
    quality: 'IND',
    missionHours: '8760', // 1 year
    parts: DEFAULT_PARTS
  });

  const { assemblyName, environment, quality, missionHours, parts } = state;
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'parts-count-mtbf',
      name: 'Parts-Count MTBF (MIL-217)',
      path: '/tools/parts-count-mtbf/'
    });
  }, []);

  const piE = ENV_FACTORS[environment]?.factor || 2.0;
  const piQ = QUALITY_FACTORS[quality]?.factor || 1.0;
  const missionT = Math.max(1, parseFloat(missionHours) || 8760);

  // Evaluate each BOM row: lambda_i = Qty * baseLambda * piE * piQ
  const evaluatedParts = parts.map(p => {
    const qty = Math.max(0, parseInt(p.quantity, 10) || 0);
    const base = Math.max(0, parseFloat(p.baseLambda) || 0);
    const failureRate = qty * base * piE * piQ; // Failures per 10^6 hrs
    return { ...p, qty, base, failureRate };
  });

  // Total system failure rate (Failures / 10^6 hrs)
  const totalFailureRateFpmh = evaluatedParts.reduce((sum, p) => sum + p.failureRate, 0);

  // MTBF in hours = 10^6 / totalFailureRate
  const mtbfHours = totalFailureRateFpmh > 0 ? (1000000 / totalFailureRateFpmh) : 10000000;
  const mtbfYears = mtbfHours / 8760;

  // FITs (Failures per 10^9 hours)
  const fits = totalFailureRateFpmh * 1000;

  // Mission Reliability R(t) = exp(-lambda * t)
  const lambdaPerHour = totalFailureRateFpmh / 1000000;
  const missionReliability = Math.exp(-lambdaPerHour * missionT) * 100;

  const addPart = () => {
    const newRow: BomPart = {
      id: Date.now().toString(),
      category: 'General Component',
      baseLambda: '0.010',
      quantity: '1'
    };
    setState({ ...state, parts: [...parts, newRow] });
  };

  const updatePart = (id: string, field: keyof BomPart, val: string) => {
    setState({
      ...state,
      parts: parts.map(p => p.id === id ? { ...p, [field]: val } : p)
    });
  };

  const removePart = (id: string) => {
    setState({
      ...state,
      parts: parts.filter(p => p.id !== id)
    });
  };

  const ToolComponent = (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              MIL-HDBK-217F / Telcordia SR-332 Parts-Count Prediction
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Electronic Assembly Reliability Prediction
            </h3>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full border font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
            MTBF: {Math.round(mtbfHours).toLocaleString()} Hours ({mtbfYears.toFixed(1)} Yrs)
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Assembly Designation
            </label>
            <input
              type="text"
              value={assemblyName}
              onChange={(e) => setState({ ...state, assemblyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Environment Factor (<InlineMath math="\pi_E" />)
            </label>
            <select
              value={environment}
              onChange={(e) => setState({ ...state, environment: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            >
              {Object.entries(ENV_FACTORS).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Quality Factor (<InlineMath math="\pi_Q" />)
            </label>
            <select
              value={quality}
              onChange={(e) => setState({ ...state, quality: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            >
              {Object.entries(QUALITY_FACTORS).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Mission Duration (Hours)
            </label>
            <input
              type="number"
              value={missionHours}
              onChange={(e) => setState({ ...state, missionHours: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-500" /> Component Bill of Materials (BOM)
          </h4>
          <button
            onClick={addPart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Component Line
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Component Type</th>
                <th className="p-3">Base Failure Rate (<InlineMath math="\lambda_b" /> / 10⁶ hrs)</th>
                <th className="p-3">Quantity (<InlineMath math="N" />)</th>
                <th className="p-3">Total Rate (<InlineMath math="\lambda_i" /> / 10⁶ hrs)</th>
                <th className="p-3">% Risk</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {evaluatedParts.map((p) => {
                const pctOfTotal = totalFailureRateFpmh > 0 ? (p.failureRate / totalFailureRateFpmh) * 100 : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="text"
                        value={p.category}
                        onChange={(e) => updatePart(p.id, 'category', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.001"
                        value={p.baseLambda}
                        onChange={(e) => updatePart(p.id, 'baseLambda', e.target.value)}
                        className="w-28 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) => updatePart(p.id, 'quantity', e.target.value)}
                        className="w-20 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-100">
                      {p.failureRate.toFixed(4)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, pctOfTotal)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-500">{pctOfTotal.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removePart(p.id)}
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

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Total Failure Rate (<InlineMath math="\lambda_{\text{sys}}" />)</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {totalFailureRateFpmh.toFixed(3)}
          </span>
          <span className="text-[11px] text-slate-400">Failures / 10⁶ Hours</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Predicted Parts-Count MTBF</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {Math.round(mtbfHours).toLocaleString()} <span className="text-xs font-normal text-slate-400">hrs</span>
          </span>
          <span className="text-[11px] text-slate-400">{mtbfYears.toFixed(2)} Operational Years</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Failure Rate in FITs</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {Math.round(fits).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400">Failures per 10⁹ Device Hours</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Mission Reliability <InlineMath math="R(t)" /></span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-1 block">
            {missionReliability.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400">Survival at {missionT} Hours</span>
        </div>
      </div>

      <ShareAndExport
        toolName="Parts-Count MTBF Reliability Prediction"
        shareUrl="https://reliabilitytools.co.in/tools/parts-count-mtbf/"
        inputs={{
          "Assembly": assemblyName,
          "Environment": `${environment} (πE = ${piE})`,
          "Quality Factor": `${quality} (πQ = ${piQ})`,
          "Mission Hours": `${missionHours} hrs`,
          "BOM Line Items": parts.length
        }}
        results={{
          "System Failure Rate": `${totalFailureRateFpmh.toFixed(4)} / 10^6 hrs`,
          "Parts-Count MTBF": `${Math.round(mtbfHours).toLocaleString()} Hours`,
          "System FITs": Math.round(fits),
          "Mission Reliability": `${missionReliability.toFixed(2)}%`
        }}
        exportData={evaluatedParts.map(p => ({
          Category: p.category,
          BaseLambda: p.baseLambda,
          Quantity: p.quantity,
          TotalRate_FPMH: p.failureRate.toFixed(4)
        }))}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Electronic Reliability Engineering: <span className="text-cyan-600 dark:text-cyan-400">MIL-HDBK-217F Parts-Count Prediction</span>
        </h2>
        <p>
          During the conceptual and preliminary engineering phases of electronic hardware development, detailed circuit schematics, internal thermal maps, and electrical component operating stresses are not yet finalized. To establish baseline reliability benchmarks and compare competing architectures, systems engineers rely on the <strong>Parts-Count Reliability Prediction Method</strong>.
        </p>
        <p>
          Standardized under the landmark United States Department of Defense standard <strong>MIL-HDBK-217F</strong> (<em>Reliability Prediction of Electronic Equipment</em>) and commercial telecommunication equivalent <strong>Telcordia SR-332</strong>, the parts-count method sums empirical base failure rates weighted by operating environment factors (<InlineMath math="\pi_E" />) and procurement quality grades (<InlineMath math="\pi_Q" />).
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Parts-Count Method vs. Parts-Stress Method
        </h3>
        <p>
          MIL-HDBK-217F and Telcordia delineate two complementary modeling methodologies:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Parts-Count Method:</strong> Applied during initial design phases. It requires only the generic component classifications, quantities, quality grades, and intended application environment. It assumes typical nominal operational electrical stress ratios (e.g. 50% voltage/power derating).
          </li>
          <li>
            <strong>Parts-Stress Method:</strong> Applied during detailed final design verification. It incorporates exact junction temperatures, thermal resistances, voltage spikes, and cyclic thermal stress multipliers (<InlineMath math="\pi_T" />, <InlineMath math="\pi_V" />, <InlineMath math="\pi_S" />) for every individual component.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Parts-Count Prediction: Formulas & Standards
        </h2>
        <p>
          The total equipment failure rate (<InlineMath math="\lambda_{\text{EQUIP}}" />) in failures per <InlineMath math="10^6" /> operating hours is given by:
        </p>
        <div className="my-6">
          <BlockMath math="\lambda_{\text{EQUIP}} = \sum_{i=1}^{n} N_i \times (\lambda_{g})_i" />
        </div>
        <p>
          Where for the <InlineMath math="i" />-th generic component group:
        </p>
        <div className="my-6">
          <BlockMath math="(\lambda_{g})_i = \lambda_{b,i} \times \pi_{Q,i} \times \pi_{E}" />
        </div>
        <p>
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><InlineMath math="N_i" /> = Quantity of the <InlineMath math="i" />-th component type.</li>
          <li><InlineMath math="\lambda_{b,i}" /> = Generic base failure rate for the component family (failures/<InlineMath math="10^6" /> hrs).</li>
          <li><InlineMath math="\pi_{Q,i}" /> = Quality factor representing manufacturing screen levels (0.5 for MIL-SPEC hermetic, 1.0 for automotive/industrial, 3.0 for consumer).</li>
          <li><InlineMath math="\pi_E" /> = Environmental multiplier (1.0 for Ground Benign <InlineMath math="G_B" />, 2.0 for Ground Fixed <InlineMath math="G_F" />, 4.0 for Mobile <InlineMath math="G_M" />).</li>
        </ul>
        <p className="mt-4">
          Once the total system failure rate (<InlineMath math="\lambda_{\text{sys}}" />) is established, the predicted <strong>Mean Time Between Failures (MTBF)</strong> and <strong>FITs (Failures In Time)</strong> are:
        </p>
        <div className="my-4">
          <BlockMath math="\text{MTBF} = \frac{10^6}{\lambda_{\text{sys}}} \text{ (hours)}, \quad \text{FITs} = \lambda_{\text{sys}} \times 1,000 \text{ (failures / } 10^9 \text{ hrs)}" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Automotive Electronic Control Unit (ECU)
        </h3>
        <p>
          An automotive powertrain control unit operates in a Ground Mobile environment (<InlineMath math="\pi_E = 4.0" />) using automotive-grade components (<InlineMath math="\pi_Q = 1.0" />):
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>2 Microcontrollers (<InlineMath math="\lambda_b = 0.050" />): <InlineMath math="\lambda_1 = 2 \times 0.050 \times 1.0 \times 4.0 = 0.400" /></li>
          <li>8 Power MOSFET drivers (<InlineMath math="\lambda_b = 0.030" />): <InlineMath math="\lambda_2 = 8 \times 0.030 \times 1.0 \times 4.0 = 0.960" /></li>
          <li>20 Tantalum capacitors (<InlineMath math="\lambda_b = 0.010" />): <InlineMath math="\lambda_3 = 20 \times 0.010 \times 1.0 \times 4.0 = 0.800" /></li>
          <li>50 Thick-film resistors (<InlineMath math="\lambda_b = 0.001" />): <InlineMath math="\lambda_4 = 50 \times 0.001 \times 1.0 \times 4.0 = 0.200" /></li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Total System Failure Rate:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\lambda_{\text{sys}} = 0.400 + 0.960 + 0.800 + 0.200 = 2.360 \text{ failures} / 10^6 \text{ hours}" />
        </div>
        <p>
          <strong>Step 2: Predicted MTBF:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{MTBF} = \frac{1,000,000}{2.360} = 423,728 \text{ operating hours } (\approx 48.3 \text{ continuous years})" />
        </div>
        <p>
          <strong>Step 3: 1-Year Survival Reliability:</strong>
          Over an annual operational mission of 3,000 vehicle operating hours:
        </p>
        <div className="my-2">
          <InlineMath math="R(3,000) = e^{-(2.360 \times 10^{-6}) \times 3,000} = e^{-0.00708} = 99.29\%" />
        </div>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in Electronic Reliability Predictions
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Conflating MTBF with Component Wear-Out Lifespan:</strong> An MTBF of 400,000 hours does <em>not</em> mean the ECU will function for 45 years. Parts-count models assume the constant random failure period (the bottom of the bathtub curve). Electrolytic capacitor electrolyte dry-out or solder joint fatigue will terminate life within 10–15 years regardless of MTBF.
          </li>
          <li>
            <strong>Applying Outdated MIL-HDBK-217 Base Rates to Modern FinFET ICs:</strong> MIL-HDBK-217F has not been updated since 1995. For modern 7nm/5nm submicron microprocessors, Telcordia SR-332 Issue 4 or IEC 62380 provides far more realistic base failure rates.
          </li>
          <li>
            <strong>Ignoring Solder Joint and Connector Dominance:</strong> In rugged vibrating industrial and automotive environments, mechanical board interconnects and solder joints frequently generate over 60% of total field failures, dwarfing the failure rates of passive silicon chips.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between MIL-HDBK-217F and Telcordia SR-332?",
      answer: "MIL-HDBK-217F is the historic US military defense standard designed for aerospace and military hardware under severe operational profiles. Telcordia SR-332 (formerly Bellcore) is the telecommunications industry standard, tailored for commercial electronics with provisions for empirical laboratory burn-in and field return tracking."
    },
    {
      question: "What does FIT stand for and how is it related to MTBF?",
      answer: "FIT stands for Failures In Time, defined as the number of failures occurring per 10^9 (one billion) device operating hours. FIT and MTBF have an inverse relationship: MTBF (in hours) = 1,000,000,000 / FIT."
    },
    {
      question: "What standards govern parts-count reliability modeling?",
      answer: "Parts-count reliability prediction is standardized by <strong>MIL-HDBK-217F</strong> (Department of Defense Reliability Prediction of Electronic Equipment), <strong>Telcordia SR-332</strong>, and <strong>IEC 61709</strong> (Electric components - Reliability - Reference conditions for failure rates and stress models)."
    }
  ];

  return (
    <ToolContentLayout
      title="Parts-Count MTBF Calculator – Free Online | Reliability Tools"
      description="Predict electronic assembly reliability and failure rates using the MIL-HDBK-217F and Telcordia SR-332 parts-count method for early hardware system design."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="parts-count-mtbf" />
        </>
      }
      faqs={faqs}
      keywords="parts-count MTBF calculator, MIL-HDBK-217F calculator, Telcordia SR-332, electronic reliability prediction, FITs calculator, failure rate prediction, PCB reliability"
      canonicalUrl="https://reliabilitytools.co.in/tools/parts-count-mtbf/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "Parts-Count MTBF Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "MIL-HDBK-217F / Telcordia SR-332",
          description: "Military and telecommunication standards for reliability prediction of electronic equipment and parts-count reliability modeling."
        }
      }}
    />
  );
};

export default PartsCountMtbf;
