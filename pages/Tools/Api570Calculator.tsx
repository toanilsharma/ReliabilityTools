import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Activity, 
  ShieldAlert,
  TrendingDown
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface Api570State {
  circuitId: string;
  initialThickness: string; // t_initial (mm)
  prevThickness: string;    // t_prev (mm)
  actualThickness: string;  // t_actual (mm)
  minThickness: string;     // t_min (mm)
  initialYear: string;      // Commissioning year
  prevYear: string;         // Previous inspection year
  currYear: string;         // Current inspection year
  pipingClass: 'Class 1' | 'Class 2' | 'Class 3';
}

const Api570Calculator: React.FC = () => {
  const [state, setState] = useShareableState<Api570State>({
    circuitId: 'HC-6"-C201-A106B',
    initialThickness: '8.56', // 6" Sch 40 nominal
    prevThickness: '7.80',
    actualThickness: '6.90',
    minThickness: '3.80',
    initialYear: '2010',
    prevYear: '2020',
    currYear: '2024',
    pipingClass: 'Class 2'
  });

  const { 
    circuitId, 
    initialThickness, 
    prevThickness, 
    actualThickness, 
    minThickness, 
    initialYear, 
    prevYear, 
    currYear, 
    pipingClass 
  } = state;

  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'api-570-remaining-life',
      name: 'API 570 UT Remaining Life Calculator',
      path: '/tools/api-570-remaining-life/'
    });
  }, []);

  const tInit = Math.max(0, parseFloat(initialThickness) || 0);
  const tPrev = Math.max(0, parseFloat(prevThickness) || 0);
  const tActual = Math.max(0, parseFloat(actualThickness) || 0);
  const tMin = Math.max(0, parseFloat(minThickness) || 0);

  const yInit = parseFloat(initialYear) || 2010;
  const yPrev = parseFloat(prevYear) || 2020;
  const yCurr = parseFloat(currYear) || 2024;

  const ltYears = Math.max(0.1, yCurr - yInit);
  const stYears = Math.max(0.1, yCurr - yPrev);

  // Long-Term & Short-Term Corrosion Rates (mm/year)
  const ltRate = ltYears > 0 && tInit > tActual ? (tInit - tActual) / ltYears : 0;
  const stRate = stYears > 0 && tPrev > tActual ? (tPrev - tActual) / stYears : 0;

  // Governing Rate: conservative max
  const governingRate = Math.max(ltRate, stRate, 0.001);

  // Remaining Life (Years)
  const remainingCorrosionAllowance = Math.max(0, tActual - tMin);
  const remainingLifeYears = governingRate > 0 ? remainingCorrosionAllowance / governingRate : 99;

  // API 570 Max Inspection Interval limits (Half-Life rule: min(Half-Life, Max Limit))
  // Class 1: 5 yrs max; Class 2: 10 yrs max; Class 3: 10 yrs max
  const maxClassLimit = pipingClass === 'Class 1' ? 5 : 10;
  const halfLifeInterval = remainingLifeYears / 2;
  const nextInspectionInterval = Math.min(maxClassLimit, Math.max(0.5, halfLifeInterval));
  const nextInspectionYear = Math.round(yCurr + nextInspectionInterval);

  let statusBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let statusText = 'Piping Fitness-for-Service Acceptable';

  if (tActual <= tMin) {
    statusBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    statusText = 'RETIREMENT THRESHOLD EXCEEDED (De-rate or Replace)';
  } else if (remainingLifeYears < 2) {
    statusBadge = 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    statusText = 'Critical Corrosion (Remaining Life < 2 Years)';
  } else if (remainingLifeYears < 5) {
    statusBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    statusText = 'Moderate Corrosion (Short Inspection Interval Required)';
  }

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              API 570 / API 510 Ultrasonic Thickness (UT) Evaluation
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Piping Circuit Inspection Data
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${statusBadge}`}>
            {statusText}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Circuit / Tag ID
            </label>
            <input
              type="text"
              value={circuitId}
              onChange={(e) => setState({ ...state, circuitId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Piping Service Class
            </label>
            <select
              value={pipingClass}
              onChange={(e) => setState({ ...state, pipingClass: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            >
              <option value="Class 1">Class 1 (High Hazard / Flammable gas - Max 5 yrs)</option>
              <option value="Class 2">Class 2 (Hydrocarbons / Hydrogen - Max 10 yrs)</option>
              <option value="Class 3">Class 3 (Distillate / Utility - Max 10 yrs)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Minimum Required Thickness (<InlineMath math="t_{\text{min}}" /> mm)
            </label>
            <input
              type="number"
              step="0.01"
              value={minThickness}
              onChange={(e) => setState({ ...state, minThickness: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Thickness Measurements Timeline */}
        <div className="pt-2 grid md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">1. Initial / Nominal</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Thickness (mm)</span>
                <input
                  type="number"
                  step="0.01"
                  value={initialThickness}
                  onChange={(e) => setState({ ...state, initialThickness: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Year Installed</span>
                <input
                  type="number"
                  value={initialYear}
                  onChange={(e) => setState({ ...state, initialYear: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">2. Previous Inspection</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Thickness (mm)</span>
                <input
                  type="number"
                  step="0.01"
                  value={prevThickness}
                  onChange={(e) => setState({ ...state, prevThickness: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Year</span>
                <input
                  type="number"
                  value={prevYear}
                  onChange={(e) => setState({ ...state, prevYear: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase block mb-1">3. Current UT Actual</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Actual UT (mm)</span>
                <input
                  type="number"
                  step="0.01"
                  value={actualThickness}
                  onChange={(e) => setState({ ...state, actualThickness: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Year</span>
                <input
                  type="number"
                  value={currYear}
                  onChange={(e) => setState({ ...state, currYear: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border rounded font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Governing Corrosion Rate</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {governingRate.toFixed(3)} <span className="text-xs font-normal text-slate-400">mm/yr</span>
          </span>
          <span className="text-[11px] text-slate-400">
            ST: {stRate.toFixed(3)} | LT: {ltRate.toFixed(3)}
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Corrosion Allowance Remaining</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {remainingCorrosionAllowance.toFixed(2)} <span className="text-xs font-normal text-slate-400">mm</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {tActual.toFixed(2)} - {tMin.toFixed(2)} mm
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Calculated Remaining Life</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${remainingLifeYears < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {remainingLifeYears.toFixed(1)} <span className="text-xs font-normal text-slate-400">Years</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Retirement: ~{Math.round(yCurr + remainingLifeYears)}
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Next UT Inspection Due</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            Year {nextInspectionYear}
          </span>
          <span className="text-[11px] text-slate-400">
            Interval: {nextInspectionInterval.toFixed(1)} yrs (Half-Life rule)
          </span>
        </div>
      </div>

      <ShareAndExport
        toolName="API 570 UT Remaining Life Calculator"
        shareUrl="https://reliabilitytools.co.in/tools/api-570-remaining-life/"
        inputs={{
          "Circuit Tag": circuitId,
          "Initial Thickness": `${initialThickness} mm (${initialYear})`,
          "Previous Thickness": `${prevThickness} mm (${prevYear})`,
          "Actual Thickness": `${actualThickness} mm (${currYear})`,
          "Minimum Required": `${minThickness} mm`,
          "Service Class": pipingClass
        }}
        results={{
          "Governing Corrosion Rate": `${governingRate.toFixed(3)} mm/yr`,
          "Short-Term Rate": `${stRate.toFixed(3)} mm/yr`,
          "Long-Term Rate": `${ltRate.toFixed(3)} mm/yr`,
          "Remaining Life": `${remainingLifeYears.toFixed(1)} Years`,
          "Next Inspection Interval": `${nextInspectionInterval.toFixed(1)} Years (Due ${nextInspectionYear})`,
          "Fitness Status": statusText
        }}
        exportData={[
          { Parameter: "Circuit", Value: circuitId },
          { Parameter: "Actual Thickness (mm)", Value: actualThickness },
          { Parameter: "t_min (mm)", Value: minThickness },
          { Parameter: "Corrosion Rate (mm/yr)", Value: governingRate.toFixed(4) },
          { Parameter: "Remaining Life (yr)", Value: remainingLifeYears.toFixed(2) },
          { Parameter: "Next Inspection Year", Value: nextInspectionYear },
          { Parameter: "Piping Class", Value: pipingClass }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Pressure Piping Integrity: <span className="text-cyan-600 dark:text-cyan-400">API 570 Ultrasonic Thickness Evaluation</span>
        </h2>
        <p>
          In oil refineries, chemical processing plants, and power stations, metallic process piping is subjected to internal corrosion, erosion, and environmental cracking. Catastrophic loss of primary containment (LOPC) endangers personnel and risks regulatory shutdown. <strong>API 570</strong> (<em>Piping Inspection Code: In-service Inspection, Rating, Repair, and Alteration of Piping Systems</em>) establishes the industry standard for evaluating in-service Ultrasonic Thickness (UT) gauging data.
        </p>
        <p>
          By measuring current wall thickness against baseline and previous inspection intervals, reliability and inspection engineers calculate short-term and long-term corrosion rates, quantify the remaining corrosion allowance, project asset retirement dates, and enforce statutory inspection frequencies under the API 570 <strong>Half-Life Rule</strong>.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Determining Minimum Required Wall Thickness (t_min)
        </h3>
        <p>
          The minimum required thickness (<InlineMath math="t_{\text{min}}" />) is the sum of the pressure design thickness calculated per <strong>ASME B31.3</strong> (Process Piping Code) and structural minimum requirements:
        </p>
        <div className="my-4">
          <BlockMath math="t_{\text{pressure}} = \frac{P \times D}{2(S \times E + P \times Y)}" />
        </div>
        <p>
          Where <InlineMath math="P" /> is internal design pressure, <InlineMath math="D" /> is outside diameter, <InlineMath math="S" /> is allowable stress, <InlineMath math="E" /> is longitudinal joint quality factor, and <InlineMath math="Y" /> is temperature coefficient. On small-bore piping (NPS 2 and under), structural minimum thickness governed by pipe span deflection or vibration resistance often supersedes internal pressure calculations.
        </p>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of API 570: Formulas & Standards
        </h2>
        <p>
          API 570 Section 7 mandates the calculation of two distinct corrosion rates:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Short-Term Corrosion Rate } (CR_{\text{ST}}) = \frac{t_{\text{prev}} - t_{\text{actual}}}{\text{Time between previous and current inspections (years)}}" />
          <BlockMath math="\text{Long-Term Corrosion Rate } (CR_{\text{LT}}) = \frac{t_{\text{initial}} - t_{\text{actual}}}{\text{Time between commissioning and current inspection (years)}}" />
        </div>
        <p>
          The <strong>governing corrosion rate</strong> is selected based on process history. If process chemistry has recently turned sour, acidic, or experienced temperature elevation, the short-term rate (<InlineMath math="CR_{\text{ST}}" />) must be used.
        </p>
        <p>
          The <strong>Remaining Life (<InlineMath math="RL" />)</strong> of the piping circuit is given by:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Remaining Life } (RL) = \frac{t_{\text{actual}} - t_{\text{min}}}{CR_{\text{governing}}}" />
        </div>
        <p>
          Under the API 570 <strong>Half-Life Rule</strong>, the maximum interval between subsequent ultrasonic thickness inspections cannot exceed half the remaining life or statutory class caps:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Inspection Interval} = \min\left(\frac{RL}{2}, \text{Class Maximum}\right)" />
        </div>
        <p className="text-sm">
          Where Class Maximum is <strong>5 years</strong> for Class 1 (flammable gas / toxic) and <strong>10 years</strong> for Class 2 and Class 3 circuits.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Hydrotreater Overhead Piping
        </h3>
        <p>
          A 6-inch carbon steel line (NPS 6 Sch 40, <InlineMath math="t_{\text{initial}} = 8.56\text{ mm}" />) was commissioned in 2012:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>2018 UT thickness: <InlineMath math="t_{\text{prev}} = 7.60\text{ mm}" /></li>
          <li>2024 UT thickness: <InlineMath math="t_{\text{actual}} = 6.40\text{ mm}" /></li>
          <li>Calculated minimum thickness: <InlineMath math="t_{\text{min}} = 3.40\text{ mm}" /></li>
          <li>Class 2 service (10-year maximum inspection interval cap)</li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Calculate Corrosion Rates:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="CR_{\text{LT}} = \frac{8.56 - 6.40}{2024 - 2012} = \frac{2.16}{12} = 0.180\text{ mm/year}" />
          <BlockMath math="CR_{\text{ST}} = \frac{7.60 - 6.40}{2024 - 2018} = \frac{1.20}{6} = 0.200\text{ mm/year}" />
        </div>
        <p>
          Because corrosion has accelerated in recent years, the governing rate is <InlineMath math="CR_{\text{ST}} = 0.200\text{ mm/year}" />.
        </p>
        <p>
          <strong>Step 2: Remaining Life:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="RL = \frac{6.40 - 3.40}{0.200} = \frac{3.00}{0.200} = 15.0\text{ years}" />
        </div>
        <p>
          <strong>Step 3: Next Inspection Due:</strong>
          Applying the half-life rule: <InlineMath math="\text{Interval} = \min(15.0 / 2, 10) = \min(7.5, 10) = 7.5\text{ years}" />.
          The next full thickness measurement inspection must occur no later than <strong>mid-2031</strong>.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in API 570 Piping Life Assessments
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Relying on Long-Term Rate After Feedstock Changes:</strong> When a refinery switches to high-acid crude (TAN) or higher sulfur feeds, long-term corrosion rates dilute recent severe thinning. Short-term rates must be adopted immediately.
          </li>
          <li>
            <strong>Ignoring Injection Points & Deadlegs:</strong> Chemical injection quills and stagnant deadlegs corrode at rates up to 10× higher than straight pipe runs due to turbulent eddy impingement or stagnant acid condensation. They require separate, dedicated CMLs (Condition Monitoring Locations).
          </li>
          <li>
            <strong>Confusing Minimum Structural Thickness with Pressure Thickness:</strong> On thin-wall or high-strength alloy piping, the calculated pressure design thickness might be 1.0 mm, but structural rigidity during wind or seismic loading requires at least 2.5–3.0 mm. Retiring an asset based solely on pressure thickness causes mechanical buckling.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the API 570 Half-Life Rule for piping inspections?",
      answer: "API 570 mandates that the maximum interval between thickness measurement inspections cannot exceed half the remaining life of the piping circuit (RL / 2), up to an absolute ceiling of 5 years for Class 1 piping and 10 years for Class 2 and Class 3 piping."
    },
    {
      question: "When should short-term corrosion rate be selected over long-term?",
      answer: "Short-term corrosion rate must be selected whenever operating conditions have changed (e.g. higher operating temperature, acidic crude blends, increased flow velocity) or whenever the short-term rate significantly exceeds the long-term rate, indicating accelerated localized wastage."
    },
    {
      question: "What standards govern process piping wall thickness and design?",
      answer: "In-service inspection and remaining life evaluation are governed by <strong>API 570</strong> (Piping Inspection Code) and <strong>API 510</strong> (Pressure Vessel Code), while original design and minimum pressure thickness calculations are governed by <strong>ASME B31.3</strong> (Process Piping)."
    }
  ];

  return (
    <ToolContentLayout
      title="API 570 UT Remaining Life Calculator – Free Online | Reliability Tools"
      description="Calculate process piping corrosion rates, remaining life, and inspection intervals per API 570 and API 510 ultrasonic wall thickness UT inspection data."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="api-570-remaining-life" />
        </>
      }
      faqs={faqs}
      keywords="API 570 calculator, ultrasonic thickness calculator, piping remaining life, API 510, corrosion rate calculator, half-life inspection interval, ASME B31.3, plant piping inspection"
      canonicalUrl="https://reliabilitytools.co.in/tools/api-570-remaining-life/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "API 570 UT Remaining Life Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "API 570 / API 510",
          description: "American Petroleum Institute standards for in-service inspection, remaining life calculation, and repair of process piping systems and pressure vessels."
        }
      }}
    />
  );
};

export default Api570Calculator;
