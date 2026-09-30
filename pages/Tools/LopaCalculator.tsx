import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface IPLItem {
  id: string;
  name: string;
  pfd: string; // Probability of Failure on Demand
  type: string;
}

interface LopaState {
  scenarioName: string;
  ief: string; // Initiating event frequency (events/year)
  pIgnition: string; // Probability of ignition
  pOccupancy: string; // Occupancy factor
  targetFreq: string; // Tolerable frequency (events/year)
  ipls: IPLItem[];
}

const DEFAULT_IPLS: IPLItem[] = [
  { id: '1', name: 'Basic Process Control Loop (BPCS)', pfd: '0.1', type: 'Control' },
  { id: '2', name: 'Critical Alarm + Operator Action', pfd: '0.1', type: 'Human' },
  { id: '3', name: 'Pressure Safety Valve (PSV)', pfd: '0.01', type: 'Mechanical' }
];

const LopaCalculator: React.FC = () => {
  const [state, setState] = useShareableState<LopaState>({
    scenarioName: 'Distillation Column Overpressure',
    ief: '1.0',
    pIgnition: '0.5',
    pOccupancy: '0.2',
    targetFreq: '0.0001', // 1E-4
    ipls: DEFAULT_IPLS
  });

  const { scenarioName, ief, pIgnition, pOccupancy, targetFreq, ipls } = state;
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'lopa',
      name: 'LOPA & SIL Calculator',
      path: '/tools/lopa/'
    });
  }, []);

  const numIef = Math.max(0, parseFloat(ief) || 0);
  const numPIgn = Math.min(1, Math.max(0, parseFloat(pIgnition) || 0));
  const numPOcc = Math.min(1, Math.max(0, parseFloat(pOccupancy) || 0));
  const numTarget = Math.max(1e-9, parseFloat(targetFreq) || 1e-4);

  // Unmitigated Frequency: IEF * P(ign) * P(occ)
  const unmitigatedFreq = numIef * numPIgn * numPOcc;

  // Multiply all valid IPL PFDs
  const combinedIplPfd = ipls.reduce((acc, item) => {
    const val = parseFloat(item.pfd);
    return !isNaN(val) && val > 0 && val <= 1 ? acc * val : acc;
  }, 1);

  // Mitigated Event Frequency
  const mitigatedFreq = unmitigatedFreq * combinedIplPfd;

  // Risk Gap & Required Risk Reduction Factor (RRF)
  const requiredRrf = unmitigatedFreq > 0 ? unmitigatedFreq / numTarget : 1;
  const residualRiskGap = mitigatedFreq / numTarget;

  // SIL Assignment
  let silLevel = 'SIL Not Required';
  let silBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let requiredSisPfd = 1;

  if (residualRiskGap > 1) {
    requiredSisPfd = 1 / residualRiskGap;
    if (residualRiskGap >= 10000) {
      silLevel = 'SIL 4 (Redesign Strongly Urged)';
      silBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    } else if (residualRiskGap >= 1000) {
      silLevel = 'Target: SIL 3 Required';
      silBadge = 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    } else if (residualRiskGap >= 100) {
      silLevel = 'Target: SIL 2 Required';
      silBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    } else {
      silLevel = 'Target: SIL 1 Required';
      silBadge = 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    }
  }

  const addIpl = () => {
    const newItem: IPLItem = {
      id: Date.now().toString(),
      name: `New IPL ${ipls.length + 1}`,
      pfd: '0.1',
      type: 'Mitigation'
    };
    setState({ ...state, ipls: [...ipls, newItem] });
  };

  const updateIpl = (id: string, field: keyof IPLItem, val: string) => {
    setState({
      ...state,
      ipls: ipls.map(item => item.id === id ? { ...item, [field]: val } : item)
    });
  };

  const removeIpl = (id: string) => {
    setState({
      ...state,
      ipls: ipls.filter(item => item.id !== id)
    });
  };

  const ToolComponent = (
    <div className="space-y-8">
      {/* Top Header & Scenario Settings */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              IEC 61511 / CCPS Semi-Quantitative Risk Assessment
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Scenario Definition & Hazard Criteria
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${silBadge}`}>
            {silLevel}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Hazard Scenario Description
            </label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setState({ ...state, scenarioName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Initiating Frequency (events/yr)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={ief}
              onChange={(e) => setState({ ...state, ief: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Tolerable Freq (events/yr)
            </label>
            <input
              type="number"
              step="0.00001"
              value={targetFreq}
              onChange={(e) => setState({ ...state, targetFreq: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Ignition Probability (<InlineMath math="P_{\text{ign}}" />) [0.0 - 1.0]
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={pIgnition}
              onChange={(e) => setState({ ...state, pIgnition: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Occupancy Factor (<InlineMath math="P_{\text{occ}}" />) [0.0 - 1.0]
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={pOccupancy}
              onChange={(e) => setState({ ...state, pOccupancy: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Independent Protection Layers (IPL) Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" /> Independent Protection Layers (IPLs)
          </h4>
          <button
            onClick={addIpl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Protection Layer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Layer Description</th>
                <th className="p-3">Layer Classification</th>
                <th className="p-3">PFD (<InlineMath math="10^{-x}" />)</th>
                <th className="p-3">Risk Reduction (RRF)</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ipls.map((ipl) => {
                const pfdVal = parseFloat(ipl.pfd) || 1;
                const rrfVal = pfdVal > 0 ? (1 / pfdVal).toFixed(0) : '0';
                return (
                  <tr key={ipl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="text"
                        value={ipl.name}
                        onChange={(e) => updateIpl(ipl.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={ipl.type}
                        onChange={(e) => updateIpl(ipl.id, 'type', e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300"
                      >
                        <option value="Control">BPCS Loop (0.1)</option>
                        <option value="Human">Operator Action (0.1)</option>
                        <option value="Mechanical">Relief Device (0.01)</option>
                        <option value="Mitigation">Bund / Dike (0.1)</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0.0001"
                        max="1"
                        value={ipl.pfd}
                        onChange={(e) => updateIpl(ipl.id, 'pfd', e.target.value)}
                        className="w-24 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-100"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {rrfVal}×
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeIpl(ipl.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        title="Remove Layer"
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

      {/* Results Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Unmitigated Event Frequency</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {unmitigatedFreq.toExponential(2)}
          </span>
          <span className="text-[11px] text-slate-400">events per year</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Mitigated Event Frequency (MEF)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${residualRiskGap <= 1 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {mitigatedFreq.toExponential(2)}
          </span>
          <span className="text-[11px] text-slate-400">Target: {numTarget.toExponential(1)}/yr</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Residual Risk Ratio</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${residualRiskGap <= 1 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {residualRiskGap <= 1 ? 'Tolerable (≤ 1.0)' : `${residualRiskGap.toFixed(1)}× Over`}
          </span>
          <span className="text-[11px] text-slate-400">
            {residualRiskGap > 1 ? `Requires RRF of ${Math.ceil(residualRiskGap)}` : 'Risk is ALARP'}
          </span>
        </div>
      </div>

      <ShareAndExport
        toolName="LOPA & SIL Determination Calculator"
        shareUrl="https://reliabilitytools.co.in/tools/lopa/"
        inputs={{
          "Scenario Name": scenarioName,
          "Initiating Event Frequency": `${ief} events/yr`,
          "Ignition Probability": pIgnition,
          "Occupancy Factor": pOccupancy,
          "Target Frequency": `${targetFreq} events/yr`,
          "Active IPL Count": ipls.length
        }}
        results={{
          "Unmitigated Frequency": `${unmitigatedFreq.toExponential(2)} /yr`,
          "Combined IPL PFD": combinedIplPfd.toExponential(2),
          "Mitigated Event Frequency": `${mitigatedFreq.toExponential(2)} /yr`,
          "Safety Integrity Level": silLevel
        }}
        exportData={[
          { Parameter: "Scenario", Value: scenarioName },
          { Parameter: "IEF", Value: ief },
          { Parameter: "Unmitigated Freq", Value: unmitigatedFreq },
          { Parameter: "Combined IPL PFD", Value: combinedIplPfd },
          { Parameter: "Mitigated Freq", Value: mitigatedFreq },
          { Parameter: "Target Freq", Value: targetFreq },
          { Parameter: "Target SIL", Value: silLevel }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Layer of Protection Analysis (LOPA): <span className="text-cyan-600 dark:text-cyan-400">IEC 61511 Functional Safety</span>
        </h2>
        <p>
          <strong>Layer of Protection Analysis (LOPA)</strong> is a standardized semi-quantitative risk assessment methodology developed by the Center for Chemical Process Safety (CCPS) and formalized in <strong>IEC 61511</strong>. LOPA bridges the qualitative insights of a HAZOP (Hazard and Operability Study) with the rigorous quantitative requirements of Safety Instrumented System (SIS) SIL allocation.
        </p>
        <p>
          By evaluating initiating event frequencies, conditional probabilities (such as ignition likelihood and personnel occupancy), and the failure rates of independent protection layers (IPLs), LOPA determines whether existing safeguards reduce process risk to As Low As Reasonably Practicable (ALARP) or whether an instrumented Safety Instrumented Function (SIF) is mandatory.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The 4 Core Criteria of a True Independent Protection Layer (IPL)
        </h3>
        <p>
          Under IEC 61511 and CCPS rules, a protective safeguard can only be credited as an IPL if it strictly satisfies four engineering criteria:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Specificity:</strong> The safeguard must be specifically engineered to detect and prevent the exact sequence of events leading to the consequence.
          </li>
          <li>
            <strong>Independence:</strong> The layer must be completely decoupled from the initiating event and all other credited IPLs. For example, a BPCS control loop cannot act as an IPL if the failure of that very same BPCS sensor initiated the hazardous scenario.
          </li>
          <li>
            <strong>Dependability:</strong> The layer must have an empirically demonstrated Probability of Failure on Demand (PFD), typically verified through proof-testing schedules and diagnostic coverage.
          </li>
          <li>
            <strong>Auditability:</strong> The system must be periodically inspected, functionally tested, and maintained under formal safety management operating procedures.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of LOPA: Formulas & Standards
        </h2>
        <p>
          The unmitigated frequency (<InlineMath math="F_u" />) of a hazardous event is calculated by compounding the initiating cause frequency (<InlineMath math="f_{\text{init}}" />) with conditional modifiers:
        </p>
        <div className="my-6">
          <BlockMath math="F_u = f_{\text{init}} \times P_{\text{enab}} \times P_{\text{ign}} \times P_{\text{occ}}" />
        </div>
        <p>
          When <InlineMath math="n" /> independent protection layers are active, the Mitigated Event Frequency (<InlineMath math="F_m" />) is given by:
        </p>
        <div className="my-6">
          <BlockMath math="F_m = F_u \times \prod_{i=1}^{n} \text{PFD}_i" />
        </div>
        <p>
          If <InlineMath math="F_m > F_{\text{tolerable}}" />, a residual risk gap exists. The required Risk Reduction Factor (<InlineMath math="\text{RRF}_{\text{req}}" />) determines the target Safety Integrity Level (SIL) for the Safety Instrumented System (SIS):
        </p>
        <div className="my-6">
          <BlockMath math="\text{RRF}_{\text{req}} = \frac{F_m}{F_{\text{tolerable}}} = \frac{1}{\text{PFD}_{\text{SIS}}}" />
        </div>
        <p>
          Per <strong>IEC 61511-1</strong> (<em>"Functional safety – Safety instrumented systems for the process industry sector"</em>):
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong>SIL 1:</strong> <InlineMath math="10 \le \text{RRF} < 100 \implies \text{PFDavg } 0.1 \text{ to } 0.01" /></li>
          <li><strong>SIL 2:</strong> <InlineMath math="100 \le \text{RRF} < 1000 \implies \text{PFDavg } 0.01 \text{ to } 0.001" /></li>
          <li><strong>SIL 3:</strong> <InlineMath math="1000 \le \text{RRF} < 10000 \implies \text{PFDavg } 0.001 \text{ to } 0.0001" /></li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Hydrocarbon Receiver Drum Overfill
        </h3>
        <p>
          Consider a chemical refinery receiver drum where a control valve fails open (<InlineMath math="f_{\text{init}} = 0.2\text{ events/year}" />):
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Ignition probability <InlineMath math="P_{\text{ign}} = 0.5" /></li>
          <li>Operator occupancy <InlineMath math="P_{\text{occ}} = 0.1" /></li>
          <li>Corporate tolerable fatality frequency <InlineMath math="F_{\text{tolerable}} = 1.0 \times 10^{-5}\text{ /year}" /></li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Unmitigated Frequency:</strong>
        </p>
        <div className="my-2">
          <InlineMath math="F_u = 0.2 \times 0.5 \times 0.1 = 0.01 = 1.0 \times 10^{-2}\text{ /year}" />
        </div>
        <p>
          <strong>Step 2: Credited IPLs:</strong>
          Two independent safeguards exist:
          (1) High-level alarm with trained operator dump procedure (<InlineMath math="\text{PFD}_1 = 0.1" />);
          (2) Atmospheric overflow weir to flare sump (<InlineMath math="\text{PFD}_2 = 0.1" />).
        </p>
        <div className="my-2">
          <BlockMath math="F_m = 1.0 \times 10^{-2} \times 0.1 \times 0.1 = 1.0 \times 10^{-4}\text{ /year}" />
        </div>
        <p>
          <strong>Step 3: Risk Gap & SIL Allocation:</strong>
          Because <InlineMath math="F_m = 10^{-4}" /> exceeds <InlineMath math="F_{\text{tolerable}} = 10^{-5}" /> by a factor of 10, an additional Risk Reduction Factor (<InlineMath math="\text{RRF} = 10" />) is required. Therefore, an automated High-High Level Trip interlock classified as <strong>SIL 1</strong> must be implemented to achieve safety compliance.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Engineering Mistakes in LOPA Studies
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Crediting the Initiating Loop as an IPL:</strong> If the failure of level transmitter LT-101 causes the overfill, an alarm derived from LT-101 cannot be claimed as an independent layer. It must originate from a completely separate sensor (e.g. LIT-102).
          </li>
          <li>
            <strong>Taking Excessive Operator Credit:</strong> CCPS limits manual operator action to a maximum PFD credit of 0.1 (10% error rate), and only if the operator has independent annunciation, at least 10–20 minutes of diagnostic reaction time, and clear documented SOPs.
          </li>
          <li>
            <strong>Claiming Multiple IPLs on Common Actuation:</strong> Claiming credit for both a control loop and an emergency shutdown function that actuate through the same physical control valve violates the independence requirement.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between HAZOP and LOPA?",
      answer: "HAZOP is a qualitative brainstorming exercise that identifies potential process hazards and causes using guide words. LOPA is a semi-quantitative follow-up methodology that evaluates the numerical adequacy of safeguards and calculates the required SIL target for safety instrumented systems."
    },
    {
      question: "Can standard fire sprinklers or deluge systems be counted as an IPL?",
      answer: "Deluge and foam systems can be credited as mitigation IPLs for thermal radiation or fire spread consequences (typically PFD 0.1), provided they are designed per NFPA standards, independently initiated, and do not share utilities with the primary process unit."
    },
    {
      question: "How does IEC 61511 define independence in LOPA?",
      answer: "IEC 61511 mandates that an IPL must operate without dependence on any other protection layer or the initiating event. A single failure anywhere in the architecture (sensors, wiring, logic solvers, or valves) must not render two or more credited IPLs simultaneously ineffective."
    }
  ];

  return (
    <ToolContentLayout
      title="LOPA Calculator – Free Online | Reliability Tools"
      description="Perform Layer of Protection Analysis per IEC 61511 and CCPS guidelines. Quantify independent protection layers (IPLs) and determine target SIL requirements."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="lopa" />
        </>
      }
      faqs={faqs}
      keywords="LOPA calculator, layer of protection analysis, IEC 61511, CCPS, target SIL calculator, independent protection layer, PFD calculator, risk reduction factor"
      canonicalUrl="https://reliabilitytools.co.in/tools/lopa/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "LOPA Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "IEC 61511 / CCPS",
          description: "International standard for functional safety and safety instrumented systems for the process industry sector."
        }
      }}
    />
  );
};

export default LopaCalculator;
