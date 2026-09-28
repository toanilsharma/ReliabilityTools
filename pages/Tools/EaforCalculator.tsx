import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Flame,
  Gauge
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface EaforState {
  unitName: string;
  capacityMw: string;
  ph: string;   // Period Hours (e.g. 8760)
  sh: string;   // Service Hours
  rsh: string;  // Reserve Shutdown Hours
  foh: string;  // Forced Outage Hours
  poh: string;  // Planned Outage Hours
  efdh: string; // Equivalent Forced Derated Hours
  epdh: string; // Equivalent Planned Derated Hours
}

const EaforCalculator: React.FC = () => {
  const [state, setState] = useShareableState<EaforState>({
    unitName: 'Unit 3 CCGT (600 MW)',
    capacityMw: '600',
    ph: '8760',
    sh: '6850',
    rsh: '720',
    foh: '310',
    poh: '680',
    efdh: '120',
    epdh: '80'
  });

  const { unitName, capacityMw, ph, sh, rsh, foh, poh, efdh, epdh } = state;
  const { addRecentTools } = useRecentTools() as any;

  useEffect(() => {
    if (typeof addRecentTools === 'function') {
      addRecentTools({
        id: 'eafor',
        name: 'EAF EFOR Calculator',
        path: '/tools/eafor/'
      });
    }
  }, []);

  const numPh = Math.max(1, parseFloat(ph) || 8760);
  const numSh = Math.max(0, parseFloat(sh) || 0);
  const numRsh = Math.max(0, parseFloat(rsh) || 0);
  const numFoh = Math.max(0, parseFloat(foh) || 0);
  const numPoh = Math.max(0, parseFloat(poh) || 0);
  const numEfdh = Math.max(0, parseFloat(efdh) || 0);
  const numEpdh = Math.max(0, parseFloat(epdh) || 0);

  // Available Hours AH = SH + RSH
  const ah = numSh + numRsh;

  // Unweighted Availability Factor AF = (AH / PH) * 100%
  const af = Math.min(100, (ah / numPh) * 100);

  // Equivalent Available Hours = AH - (EFDH + EPDH)
  const eah = Math.max(0, ah - (numEfdh + numEpdh));

  // Equivalent Availability Factor EAF = (EAH / PH) * 100%
  const eaf = Math.min(100, Math.max(0, (eah / numPh) * 100));

  // Forced Outage Rate FOR = [FOH / (FOH + SH)] * 100%
  const forDenominator = numFoh + numSh;
  const forRate = forDenominator > 0 ? (numFoh / forDenominator) * 100 : 0;

  // Equivalent Forced Outage Rate EFOR = [(FOH + EFDH) / (FOH + SH + EFDH)] * 100%
  const eforDenominator = numFoh + numSh + numEfdh;
  const eforRate = eforDenominator > 0 ? ((numFoh + numEfdh) / eforDenominator) * 100 : 0;

  // NERC GADS Benchmarks
  let eafBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let eafStatus = 'World-Class Grid Availability';

  if (eaf < 80) {
    eafBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    eafStatus = 'Below Industry Average Availability';
  } else if (eaf < 88) {
    eafBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    eafStatus = 'Acceptable Commercial Availability';
  }

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              IEEE 762 / NERC GADS Utility Reliability Metrics
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Generating Unit Operational Hour Log
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${eafBadge}`}>
            {eafStatus}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Generating Unit ID
            </label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setState({ ...state, unitName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Rated Capacity (MW)
            </label>
            <input
              type="number"
              value={capacityMw}
              onChange={(e) => setState({ ...state, capacityMw: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Total Period Hours (PH)
            </label>
            <input
              type="number"
              value={ph}
              onChange={(e) => setState({ ...state, ph: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">8760 hrs = 1 non-leap year</span>
          </div>
        </div>

        {/* Operating Hours Breakdown */}
        <div className="pt-2 grid md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Service Hours (SH) [Grid Synchronized]
            </label>
            <input
              type="number"
              value={sh}
              onChange={(e) => setState({ ...state, sh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Reserve Shutdown Hours (RSH) [Standby]
            </label>
            <input
              type="number"
              value={rsh}
              onChange={(e) => setState({ ...state, rsh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Planned Outage Hours (POH) [Overhauls]
            </label>
            <input
              type="number"
              value={poh}
              onChange={(e) => setState({ ...state, poh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Forced Outages and Derating */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              Forced Outage Hours (FOH) [Trips]
            </label>
            <input
              type="number"
              value={foh}
              onChange={(e) => setState({ ...state, foh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-900/60 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
              Eq. Forced Derated Hours (EFDH)
            </label>
            <input
              type="number"
              value={efdh}
              onChange={(e) => setState({ ...state, efdh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-900/60 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Eq. Planned Derated Hours (EPDH)
            </label>
            <input
              type="number"
              value={epdh}
              onChange={(e) => setState({ ...state, epdh: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Equivalent Availability (EAF)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${eaf >= 88 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {eaf.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400">IEEE 762 Core Metric</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Eq. Forced Outage Rate (EFOR)</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${eforRate <= 4 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {eforRate.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400">Benchmark: &lt; 3.5%</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Commercial Availability (AF)</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {af.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400">AH: {ah} hrs / {numPh} hrs</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Forced Outage Rate (FOR)</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {forRate.toFixed(2)}%
          </span>
          <span className="text-[11px] text-slate-400">Unweighted trip rate</span>
        </div>
      </div>

      <ShareAndExport
        toolTitle="IEEE 762 EAF & EFOR Calculator"
        inputs={{
          "Unit Name": unitName,
          "Capacity": `${capacityMw} MW`,
          "Period Hours (PH)": `${numPh} hrs`,
          "Service Hours (SH)": `${numSh} hrs`,
          "Reserve Shutdown (RSH)": `${numRsh} hrs`,
          "Forced Outages (FOH)": `${numFoh} hrs`,
          "Planned Outages (POH)": `${numPoh} hrs`,
          "Derated (EFDH/EPDH)": `${numEfdh} / ${numEpdh} hrs`
        }}
        results={{
          "Equivalent Availability Factor (EAF)": `${eaf.toFixed(2)}%`,
          "Equivalent Forced Outage Rate (EFOR)": `${eforRate.toFixed(2)}%`,
          "Availability Factor (AF)": `${af.toFixed(2)}%`,
          "Forced Outage Rate (FOR)": `${forRate.toFixed(2)}%`,
          "Assessment": eafStatus
        }}
        exportData={[
          { Parameter: "Unit", Value: unitName },
          { Parameter: "Capacity MW", Value: capacityMw },
          { Parameter: "EAF (%)", Value: eaf.toFixed(2) },
          { Parameter: "EFOR (%)", Value: eforRate.toFixed(2) },
          { Parameter: "AF (%)", Value: af.toFixed(2) },
          { Parameter: "FOR (%)", Value: forRate.toFixed(2) },
          { Parameter: "FOH", Value: numFoh },
          { Parameter: "SH", Value: numSh }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Power Plant Reliability: <span className="text-cyan-600 dark:text-cyan-400">IEEE 762 EAF and EFOR Metrics</span>
        </h2>
        <p>
          In the electric power generation and utility industry, traditional industrial availability formulas fail to reflect operational reality. Power plants frequently run at partial megawatts due to boiler tube leaks, high ambient turbine intake temperatures, or condenser tube fouling. Furthermore, peaking units may sit idle for months in reserve shutdown without being broken.
        </p>
        <p>
          To establish standardized benchmarking across fossil, nuclear, hydroelectric, and combined-cycle fleets, the <strong>North American Electric Reliability Corporation (NERC) GADS</strong> system and <strong>IEEE Std 762</strong> (<em>IEEE Standard Definitions for Use in Reporting Electric Generating Unit Reliability, Availability, and Productivity</em>) formalize the <strong>Equivalent Availability Factor (EAF)</strong> and <strong>Equivalent Forced Outage Rate (EFOR)</strong>.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The Power of Derated Equivalent Hours
        </h3>
        <p>
          The critical breakthrough of IEEE 762 is converting partial megawatt capacity reductions into equivalent outage hours:
        </p>
        <div className="my-4">
          <BlockMath math="\text{EFDH} = \frac{\Delta \text{MW} \times \text{Hours}}{\text{Net Maximum Capacity (NMC)}}" />
        </div>
        <p>
          If a 500 MW generator is restricted to 400 MW (a 100 MW de-rating) for 24 hours due to a cooling fan outage, it experiences:
          <InlineMath math="\text{EFDH} = (100 \times 24) / 500 = 4.8\text{ Equivalent Forced Derated Hours}" />. This mathematically prevents utilities from masking partial degradation as 100% available uptime.
        </p>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of IEEE 762: Formulas & Standards
        </h2>
        <p>
          The <strong>Equivalent Availability Factor (EAF)</strong> represents the percentage of a given period that a unit was capable of producing its rated capacity:
        </p>
        <div className="my-6">
          <BlockMath math="\text{EAF} = \frac{\text{AH} - (\text{EFDH} + \text{EPDH} + \text{EUDH})}{\text{PH}} \times 100\%" />
        </div>
        <p>
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><InlineMath math="\text{AH}" /> = Available Hours (<InlineMath math="\text{SH} + \text{RSH}" />).</li>
          <li><InlineMath math="\text{PH}" /> = Period Hours (8,760 hours in a non-leap calendar year).</li>
          <li><InlineMath math="\text{EFDH}" /> = Equivalent Forced Derated Hours.</li>
          <li><InlineMath math="\text{EPDH}" /> = Equivalent Planned Derated Hours.</li>
          <li><InlineMath math="\text{EUDH}" /> = Equivalent Unplanned Maintenance Derated Hours.</li>
        </ul>
        <p className="mt-4">
          The <strong>Equivalent Forced Outage Rate (EFOR)</strong> measures the probability that a unit will fail when called upon to generate:
        </p>
        <div className="my-4">
          <BlockMath math="\text{EFOR} = \frac{\text{FOH} + \text{EFDH}}{\text{FOH} + \text{SH} + \text{EFDH}} \times 100\%" />
        </div>
        <p className="text-sm">
          Notice the denominator does <em>not</em> contain Period Hours (<InlineMath math="\text{PH}" />) or Reserve Shutdown Hours (<InlineMath math="\text{RSH}" />). EFOR reflects operational exposure time; a peaking turbine that runs for only 200 hours and trips for 20 hours will correctly show an EFOR of ~9%, rather than an artificially diluted 0.2%.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Combined Cycle Base-Load Unit
        </h3>
        <p>
          An 800 MW Combined Cycle Gas Turbine (CCGT) logs the following operational hours over a full calendar year (<InlineMath math="\text{PH} = 8,760\text{ hrs}" />):
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Service Hours (<InlineMath math="\text{SH}" />) = 7,200 hrs</li>
          <li>Reserve Standby (<InlineMath math="\text{RSH}" />) = 400 hrs</li>
          <li>Planned Overhaul (<InlineMath math="\text{POH}" />) = 720 hrs</li>
          <li>Forced Outage Trips (<InlineMath math="\text{FOH}" />) = 440 hrs</li>
          <li>Equivalent Forced Derated Hours (<InlineMath math="\text{EFDH}" />) = 160 hrs</li>
          <li>Equivalent Planned Derated Hours (<InlineMath math="\text{EPDH}" />) = 80 hrs</li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Calculate EAF:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{AH} = 7,200 + 400 = 7,600\text{ hrs}" />
          <BlockMath math="\text{EAF} = \frac{7,600 - (160 + 80)}{8,760} \times 100\% = \frac{7,360}{8,760} \times 100\% = 84.02\%" />
        </div>
        <p>
          <strong>Step 2: Calculate EFOR:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{EFOR} = \frac{440 + 160}{440 + 7,200 + 160} \times 100\% = \frac{600}{7,800} \times 100\% = 7.69\%" />
        </div>
        <p>
          While the unit achieved an 84% availability factor, its EFOR of 7.69% exceeds the NERC GADS regional top-quartile benchmark of 3.5%, alerting asset managers to frequent forced boiler tube leaks during peak demand hours.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in Power Generation Reliability Reporting
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Dividing EFOR by Period Hours:</strong> Dividing forced outage hours by total period hours (8760) confuses Forced Outage Rate with Forced Outage Factor (FOF). EFOR must be calculated against active operating exposure (<InlineMath math="\text{SH} + \text{FOH}" />).
          </li>
          <li>
            <strong>Ignoring Partial Megawatt Deratings:</strong> Running at 70% load due to gas compressor overheating cannot be recorded as 100% available. EFDH must be logged to reflect lost megawatt-hour capacity.
          </li>
          <li>
            <strong>Counting Reserve Shutdown as Forced Downtime:</strong> Peaking units shutdown due to low market electricity spot prices are fully available to generate. Categorizing economic reserve shutdown (<InlineMath math="\text{RSH}" />) as an outage heavily distorts availability metrics.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between EAF and commercial Availability Factor (AF)?",
      answer: "Commercial Availability Factor (AF) measures only whether the generator was synchronized or in reserve standby (AH / PH), ignoring partial load restrictions. Equivalent Availability Factor (EAF) deducts equivalent derated hours (EFDH and EPDH), providing an exact reflection of true megawatt-hour generation capacity."
    },
    {
      question: "Why does the EFOR formula exclude Reserve Shutdown Hours (RSH)?",
      answer: "EFOR measures the likelihood of failure when the unit is operating or attempting to operate. Including standby hours (RSH) would artificially dilute the outage rate for peaking turbines, masking dangerous mechanical unreliability under false high numbers."
    },
    {
      question: "What standards govern electric power generation reliability data?",
      answer: "Power generation reliability metrics and accounting rules are standardized by <strong>IEEE 762</strong> (Standard Definitions for Use in Reporting Electric Generating Unit Reliability, Availability, and Productivity) and the <strong>NERC GADS</strong> (Generating Availability Data System) reporting protocols."
    }
  ];

  return (
    <ToolContentLayout
      title="EAF EFOR Calculator – Free Online | Reliability Tools"
      description="Calculate Equivalent Availability Factor (EAF) and Equivalent Forced Outage Rate (EFOR) for power generation units per IEEE 762 and NERC GADS standards."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="eafor" />
        </>
      }
      faqs={faqs}
      keywords="EAF calculator, EFOR calculator, IEEE 762, NERC GADS, power plant availability, equivalent forced outage rate, power generation reliability, derated hours"
      canonicalUrl="https://reliabilitytools.co.in/tools/eafor/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "EAF EFOR Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "IEEE 762 / NERC GADS",
          description: "IEEE and NERC standards for reporting generating unit reliability, Equivalent Availability Factor (EAF), and Equivalent Forced Outage Rate (EFOR)."
        }
      }}
    />
  );
};

export default EaforCalculator;
