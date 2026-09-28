import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  ShieldAlert, 
  Waves,
  Gauge
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface NpshState {
  pumpTag: string;
  suctionPressureKpa: string; // P_abs in kPa (absolute)
  vaporPressureKpa: string;   // P_vap in kPa (absolute)
  liquidDensity: string;      // kg/m3 (e.g. 1000 for water, 800 for hydrocarbon)
  staticHeadMeters: string;   // Z_s (+ for flooded, - for suction lift)
  frictionLossMeters: string; // h_f in meters
  npshRequiredMeters: string; // NPSHr / NPSH3 in meters
  pumpService: 'General' | 'Hydrocarbon' | 'BoilerFeed' | 'Slurry';
}

const NpshCalculator: React.FC = () => {
  const [state, setState] = useShareableState<NpshState>({
    pumpTag: 'P-101A Condensate Extraction',
    suctionPressureKpa: '101.3', // 1 atm abs
    vaporPressureKpa: '12.3',    // Water at 50°C
    liquidDensity: '988',        // Water at 50°C
    staticHeadMeters: '3.5',     // 3.5m flooded suction
    frictionLossMeters: '0.8',   // 0.8m line head loss
    npshRequiredMeters: '4.2',   // Vendor NPSHr curve
    pumpService: 'General'
  });

  const { 
    pumpTag, 
    suctionPressureKpa, 
    vaporPressureKpa, 
    liquidDensity, 
    staticHeadMeters, 
    frictionLossMeters, 
    npshRequiredMeters, 
    pumpService 
  } = state;

  const { addRecentTools } = useRecentTools() as any;

  useEffect(() => {
    if (typeof addRecentTools === 'function') {
      addRecentTools({
        id: 'npsh-cavitation',
        name: 'NPSH Cavitation Calculator',
        path: '/tools/npsh-cavitation/'
      });
    }
  }, []);

  const pAbs = Math.max(0, parseFloat(suctionPressureKpa) || 101.3);
  const pVap = Math.max(0, parseFloat(vaporPressureKpa) || 0);
  const rho = Math.max(100, parseFloat(liquidDensity) || 1000);
  const zS = parseFloat(staticHeadMeters) || 0;
  const hF = Math.max(0, parseFloat(frictionLossMeters) || 0);
  const npshR = Math.max(0.1, parseFloat(npshRequiredMeters) || 3.0);

  const g = 9.80665; // m/s^2

  // Pressure heads (m): (kPa * 1000) / (rho * g)
  const hAbs = (pAbs * 1000) / (rho * g);
  const hVap = (pVap * 1000) / (rho * g);

  // NPSHa = h_abs - h_vap + Z_s - h_f
  const npshA = Math.max(0, hAbs - hVap + zS - hF);

  // Margin ratio & difference
  const marginRatio = npshA / npshR;
  const marginDelta = npshA - npshR;

  // ANSI/HI 9.6.1 & API 610 Recommended Cavitation Margin Ratios
  let targetRatio = 1.2;
  let targetMinDelta = 1.0; // meters

  switch (pumpService) {
    case 'Hydrocarbon':
      targetRatio = 1.15; // API 610 Annex A
      targetMinDelta = 0.6;
      break;
    case 'BoilerFeed':
      targetRatio = 1.8; // High energy boiler feed pump
      targetMinDelta = 2.0;
      break;
    case 'Slurry':
      targetRatio = 1.4;
      targetMinDelta = 1.5;
      break;
    default:
      targetRatio = 1.25; // Standard HI water service
      targetMinDelta = 1.0;
  }

  let statusBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let statusText = 'Adequate Cavitation Margin (ANSI/HI Compliant)';

  if (npshA <= npshR) {
    statusBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    statusText = 'SEVERE CAVITATION ACTIVE (Impeller Erosion Risk)';
  } else if (marginRatio < targetRatio || marginDelta < targetMinDelta) {
    statusBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    statusText = 'Marginal Cavitation Risk (Below Standard Margin)';
  }

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              ANSI/HI 9.6.1 / API 610 Hydraulic Analysis
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Centrifugal Pump Suction Hydraulic Conditions
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${statusBadge}`}>
            {statusText}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Pump Tag / Machine Designation
            </label>
            <input
              type="text"
              value={pumpTag}
              onChange={(e) => setState({ ...state, pumpTag: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Operating Service Category (ANSI/HI 9.6.1)
            </label>
            <select
              value={pumpService}
              onChange={(e) => setState({ ...state, pumpService: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            >
              <option value="General">General Water / Chemical (Target Ratio: 1.25×)</option>
              <option value="Hydrocarbon">API 610 Refinery Hydrocarbon (Target Ratio: 1.15×)</option>
              <option value="BoilerFeed">High Energy Boiler Feedwater (Target Ratio: 1.80×)</option>
              <option value="Slurry">Abrasive Heavy Slurry (Target Ratio: 1.40×)</option>
            </select>
          </div>
        </div>

        {/* Hydraulic Pressure & Head Inputs */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Suction Vessel Pressure (<InlineMath math="P_{\text{abs}}" /> kPa abs)
            </label>
            <input
              type="number"
              step="0.1"
              value={suctionPressureKpa}
              onChange={(e) => setState({ ...state, suctionPressureKpa: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">Atmospheric = 101.3 kPa abs</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Vapor Pressure at Temp (<InlineMath math="P_{\text{vap}}" /> kPa abs)
            </label>
            <input
              type="number"
              step="0.1"
              value={vaporPressureKpa}
              onChange={(e) => setState({ ...state, vaporPressureKpa: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">Boiling point: P_vap = P_abs</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Liquid Density (<InlineMath math="\rho" /> kg/m³)
            </label>
            <input
              type="number"
              step="1"
              value={liquidDensity}
              onChange={(e) => setState({ ...state, liquidDensity: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Static Suction Head (<InlineMath math="Z_s" /> meters)
            </label>
            <input
              type="number"
              step="0.1"
              value={staticHeadMeters}
              onChange={(e) => setState({ ...state, staticHeadMeters: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">+ for Flooded, - for Suction Lift</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Suction Pipe Friction Loss (<InlineMath math="h_f" /> meters)
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={frictionLossMeters}
              onChange={(e) => setState({ ...state, frictionLossMeters: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">Total piping, valves & strainer loss</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Vendor NPSH Required (<InlineMath math="\text{NPSHr / NPSH3}" /> m)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={npshRequiredMeters}
              onChange={(e) => setState({ ...state, npshRequiredMeters: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm font-bold text-cyan-600 dark:text-cyan-400"
            />
            <span className="text-[10px] text-slate-400">From pump performance curve</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">NPSH Available (NPSHa)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${npshA <= npshR ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
            {npshA.toFixed(2)} <span className="text-xs font-normal text-slate-400">meters</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Head: {hAbs.toFixed(2)}m - {hVap.toFixed(2)}m
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">NPSH Required (NPSHr)</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {npshR.toFixed(2)} <span className="text-xs font-normal text-slate-400">meters</span>
          </span>
          <span className="text-[11px] text-slate-400">3% head drop datum</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Cavitation Margin Ratio</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${marginRatio >= targetRatio ? 'text-emerald-500' : marginRatio >= 1.0 ? 'text-amber-500' : 'text-rose-500'}`}>
            {marginRatio.toFixed(2)}×
          </span>
          <span className="text-[11px] text-slate-400">
            Target: ≥ {targetRatio.toFixed(2)}×
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Absolute Net Margin (<InlineMath math="\Delta" />)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${marginDelta >= targetMinDelta ? 'text-emerald-500' : 'text-rose-500'}`}>
            {marginDelta >= 0 ? `+${marginDelta.toFixed(2)}m` : `${marginDelta.toFixed(2)}m`}
          </span>
          <span className="text-[11px] text-slate-400">
            Target Delta: ≥ +{targetMinDelta.toFixed(1)}m
          </span>
        </div>
      </div>

      <ShareAndExport
        toolTitle="NPSH Cavitation Calculator"
        inputs={{
          "Pump Tag": pumpTag,
          "Suction Pressure": `${suctionPressureKpa} kPa abs`,
          "Vapor Pressure": `${vaporPressureKpa} kPa abs`,
          "Density": `${liquidDensity} kg/m3`,
          "Static Head": `${staticHeadMeters} m`,
          "Friction Head Loss": `${frictionLossMeters} m`,
          "NPSH Required": `${npshRequiredMeters} m`,
          "Service": pumpService
        }}
        results={{
          "NPSH Available (NPSHa)": `${npshA.toFixed(2)} m`,
          "NPSH Required (NPSHr)": `${npshR.toFixed(2)} m`,
          "Cavitation Margin Ratio": `${marginRatio.toFixed(2)}x`,
          "Net Margin Delta": `${marginDelta.toFixed(2)} m`,
          "Compliance Status": statusText
        }}
        exportData={[
          { Parameter: "Pump Tag", Value: pumpTag },
          { Parameter: "NPSHa (m)", Value: npshA.toFixed(2) },
          { Parameter: "NPSHr (m)", Value: npshR.toFixed(2) },
          { Parameter: "Margin Ratio", Value: marginRatio.toFixed(3) },
          { Parameter: "Net Delta (m)", Value: marginDelta.toFixed(2) },
          { Parameter: "Service", Value: pumpService },
          { Parameter: "Status", Value: statusText }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Centrifugal Pump Reliability: <span className="text-cyan-600 dark:text-cyan-400">NPSH and Cavitation Physics</span>
        </h2>
        <p>
          Cavitation is the leading root cause of mechanical seal failure, bearing brinelling, and catastrophic impeller destruction in industrial pumping systems. When local static pressure drops below the fluid's vapor pressure at operating temperature, micro-bubbles flash into vapor. As these bubbles sweep into higher-pressure zones along the impeller vanes, they implode violently, generating micro-jets with localized pressures up to 10,000 bar (1 GPa) and acoustic shock waves.
        </p>
        <p>
          To safeguard equipment, <strong>ANSI/HI 9.6.1</strong> (Hydraulic Institute Standard for NPSH Margin) and <strong>API 610</strong> (Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas Industries) govern the mathematical calculation of <strong>Net Positive Suction Head Available (NPSHa)</strong> and prescribe safety margins above manufacturer-published <strong>NPSHr (NPSH3)</strong> curves.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Understanding NPSHr vs. NPSH3: The 3% Head Fallacy
        </h3>
        <p>
          A widespread misunderstanding in plant operations is assuming that operating at <InlineMath math="\text{NPSHa} = \text{NPSHr}" /> prevents cavitation. Under ISO 9906 and Hydraulic Institute testing standards:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong>NPSHr is defined as NPSH3:</strong> It is the suction head at which the pump has <em>already cavitated severely enough</em> to cause a 3% drop in total discharge head!
          </li>
          <li>
            <strong>Incipient Cavitation (<InlineMath math="\text{NPSH}_i" />):</strong> Bubble inception actually starts at heads <strong>2 to 5 times higher</strong> than NPSH3. Operating without an adequate cavitation margin (<InlineMath math="\text{NPSHa} / \text{NPSHr} > 1.2" />) results in chronic erosion and high-frequency vane-pass vibration.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of NPSH: Formulas & Standards
        </h2>
        <p>
          Net Positive Suction Head Available (<InlineMath math="\text{NPSHa}" />) is defined at the pump suction centerline as:
        </p>
        <div className="my-6">
          <BlockMath math="\text{NPSHa} = h_{\text{abs}} - h_{\text{vap}} + Z_s - h_f" />
        </div>
        <p>
          Converting pressures from kPa (absolute) into equivalent liquid head meters (<InlineMath math="h = \frac{P \times 1000}{\rho \times g}" />):
        </p>
        <div className="my-6">
          <BlockMath math="\text{NPSHa} = \frac{P_{\text{abs}} \times 1000}{\rho \times g} - \frac{P_{\text{vap}} \times 1000}{\rho \times g} + Z_s - h_f" />
        </div>
        <p>
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><InlineMath math="P_{\text{abs}}" /> = Absolute pressure on the liquid surface in the suction vessel (kPa abs).</li>
          <li><InlineMath math="P_{\text{vap}}" /> = Vapor pressure of the liquid at pumping temperature (kPa abs).</li>
          <li><InlineMath math="\rho" /> = Fluid density at pumping temperature (kg/m³).</li>
          <li><InlineMath math="Z_s" /> = Static liquid height above (+) or below (-) pump suction centerline (meters).</li>
          <li><InlineMath math="h_f" /> = Total friction head loss in suction piping, elbows, isolation valves, and strainers (meters).</li>
        </ul>
        <p className="mt-4">
          Per <strong>ANSI/HI 9.6.1</strong> and <strong>API 610</strong>, the Cavitation Margin Ratio (<InlineMath math="\text{CMR}" />) is:
        </p>
        <div className="my-4">
          <BlockMath math="\text{CMR} = \frac{\text{NPSHa}}{\text{NPSHr}} \ge 1.15 \text{ to } 1.80" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Boiler Condensate Hotwell Pump
        </h3>
        <p>
          A condensate extraction pump draws deaerated water at 70°C (<InlineMath math="\rho = 978\text{ kg/m}^3" />) from a condenser hotwell:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Condenser vacuum: <InlineMath math="P_{\text{abs}} = 31.2\text{ kPa abs}" /></li>
          <li>Vapor pressure at 70°C: <InlineMath math="P_{\text{vap}} = 31.2\text{ kPa abs}" /> (Liquid is at saturation boiling point!)</li>
          <li>Liquid elevation above impeller: <InlineMath math="Z_s = +4.80\text{ meters}" /></li>
          <li>Suction line friction and strainer loss: <InlineMath math="h_f = 0.60\text{ meters}" /></li>
          <li>Pump vendor curve NPSHr: <InlineMath math="3.20\text{ meters}" /></li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Calculate Heads:</strong> Because the fluid is at its boiling point, <InlineMath math="h_{\text{abs}} - h_{\text{vap}} = 0" />!
        </p>
        <div className="my-2">
          <BlockMath math="\text{NPSHa} = 0 + 4.80 - 0.60 = 4.20\text{ meters}" />
        </div>
        <p>
          <strong>Step 2: Margin Ratio:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{CMR} = \frac{4.20}{3.20} = 1.31\times \quad (\Delta = +1.00\text{ m})" />
        </div>
        <p>
          <strong>Step 3: Engineering Conclusion:</strong> The 1.31× ratio provides a safe buffer above the 1.25× ANSI/HI requirement. However, if the suction strainer fouls and adds an additional 1.2m of head loss, NPSHa drops to 3.00m, triggering violent cavitation. A differential pressure transmitter across the suction strainer is recommended.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Engineering Mistakes in NPSH & Cavitation Design
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Entering Gauge Pressure Instead of Absolute Pressure:</strong> Forgetting to add atmospheric pressure (101.3 kPa / 14.7 psi) to an open tank gauge reading results in negative calculated heads and invalid conclusions.
          </li>
          <li>
            <strong>Ignoring Vapor Pressure Escalation with Temperature:</strong> Liquid vapor pressure escalates exponentially with temperature (Antoine equation). A 10°C temperature excursion on a boiler feedwater suction line can increase <InlineMath math="P_{\text{vap}}" /> by 50 kPa, instantly vapor-locking the pump.
          </li>
          <li>
            <strong>Throttling the Suction Valve to Control Flow:</strong> Suction valves must never be throttled; throttling directly increases <InlineMath math="h_f" />, destroys NPSHa, and induces severe cavitation. Flow must always be modulated on the pump discharge valve or via a variable frequency drive (VFD).
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the minimum recommended cavitation margin ratio per ANSI/HI 9.6.1?",
      answer: "ANSI/HI 9.6.1 recommends a cavitation margin ratio (NPSHa / NPSHr) between 1.1x and 1.3x for general chemical and hydrocarbon services, and 1.5x to 2.0x for high-energy pumps (such as boiler feed pumps operating above 100 kW/stage)."
    },
    {
      question: "Why does operating at boiling point make NPSHa independent of surface pressure?",
      answer: "When a fluid is at saturated boiling equilibrium (e.g. inside a deaerator or condensate hotwell), the vapor pressure equals the surface pressure (P_abs = P_vap). Consequently, h_abs - h_vap cancels out to zero, meaning NPSHa is provided solely by the static liquid column height (Zs) minus suction pipe friction (hf)."
    },
    {
      question: "What international standards govern centrifugal pump cavitation and testing?",
      answer: "Hydraulic pump design and cavitation margin guidelines are governed by <strong>ANSI/HI 9.6.1</strong>, <strong>ISO 9906</strong> (Rotodynamic pumps - Hydraulic performance acceptance tests), and <strong>API 610</strong> (Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas Industries)."
    }
  ];

  return (
    <ToolContentLayout
      title="NPSH Cavitation Calculator – Free Online | Reliability Tools"
      description="Calculate Net Positive Suction Head available (NPSHa) and cavitation safety margins for centrifugal pumps per ANSI/HI 9.6.1, ISO 9906, and API 610 standards."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="npsh-cavitation" />
        </>
      }
      faqs={faqs}
      keywords="NPSH calculator, NPSHa calculator, pump cavitation calculator, ANSI/HI 9.6.1, API 610, ISO 9906, net positive suction head, cavitation margin ratio"
      canonicalUrl="https://reliabilitytools.co.in/tools/npsh-cavitation/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "NPSH Cavitation Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "ANSI/HI 9.6.1 / ISO 9906 / API 610",
          description: "International standards for rotodynamic pump hydraulic performance, NPSH margin determination, and centrifugal pump testing."
        }
      }}
    />
  );
};

export default NpshCalculator;
