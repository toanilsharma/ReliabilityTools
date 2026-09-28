import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Target,
  Sparkles
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface PfState {
  failureMode: string;
  pfDurationDays: string; // P-F interval in days
  inspectionCost: string;  // Cost per inspection ($)
  unplannedCost: string;   // Breakdown cost ($)
  proactiveCost: string;   // Planned repair cost ($)
  mtbfYears: string;       // Mean Time Between Failures (years)
  safetyCritical: boolean; // High criticality requires P-F / 3 or P-F / 4
}

const PfOptimizer: React.FC = () => {
  const [state, setState] = useShareableState<PfState>({
    failureMode: 'Centrifugal Pump Bearing Spalling & Wear',
    pfDurationDays: '60', // 2 months
    inspectionCost: '150', // $150 vibration route cost
    unplannedCost: '35000', // $35,000 catastrophic failure + downtime
    proactiveCost: '3500', // $3,500 planned seal & bearing swap
    mtbfYears: '3.5',
    safetyCritical: false
  });

  const { 
    failureMode, 
    pfDurationDays, 
    inspectionCost, 
    unplannedCost, 
    proactiveCost, 
    mtbfYears, 
    safetyCritical 
  } = state;

  const { addRecentTools } = useRecentTools() as any;

  useEffect(() => {
    if (typeof addRecentTools === 'function') {
      addRecentTools({
        id: 'pf-interval-optimizer',
        name: 'P-F Interval Optimizer Calculator',
        path: '/tools/pf-interval-optimizer/'
      });
    }
  }, []);

  const pfDays = Math.max(1, parseFloat(pfDurationDays) || 60);
  const costInsp = Math.max(0, parseFloat(inspectionCost) || 0);
  const costUnplanned = Math.max(0, parseFloat(unplannedCost) || 0);
  const costProactive = Math.max(0, parseFloat(proactiveCost) || 0);
  const numMtbfYears = Math.max(0.1, parseFloat(mtbfYears) || 3.5);

  // RCM Standard Inspection Frequency:
  // Standard rule: Interval = (P-F) / 2
  // High Criticality / Safety rule: Interval = (P-F) / 3
  const divisor = safetyCritical ? 3 : 2;
  const optimalIntervalDays = Math.max(1, Math.round(pfDays / divisor));
  const leadTimeDays = pfDays - optimalIntervalDays;

  // Annual Financials
  const annualInspections = 365 / optimalIntervalDays;
  const annualInspectionCost = annualInspections * costInsp;

  // Annual Expected Unplanned Failures without PdM = 1 / MTBF
  const annualFailuresBaseline = 1 / numMtbfYears;
  const baselineAnnualFailureCost = annualFailuresBaseline * costUnplanned;

  // With PdM: Failures caught proactively
  const pdmAnnualCost = (annualFailuresBaseline * costProactive) + annualInspectionCost;
  const netAnnualSavings = Math.max(0, baselineAnnualFailureCost - pdmAnnualCost);
  const roiPct = annualInspectionCost > 0 ? (netAnnualSavings / annualInspectionCost) * 100 : 0;

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              SAE JA1011 / JA1012 Reliability-Centered Maintenance
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              P-F Degradation & Inspection Parameters
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Safety / High Criticality Asset:
            </label>
            <input
              type="checkbox"
              checked={safetyCritical}
              onChange={(e) => setState({ ...state, safetyCritical: e.target.checked })}
              className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Asset & Failure Mode Description
            </label>
            <input
              type="text"
              value={failureMode}
              onChange={(e) => setState({ ...state, failureMode: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              P-F Interval Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={pfDurationDays}
              onChange={(e) => setState({ ...state, pfDurationDays: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400">Potential detection to Functional failure</span>
          </div>
        </div>

        {/* Economic Values */}
        <div className="grid md:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Inspection Cost / Event ($)
            </label>
            <input
              type="number"
              value={inspectionCost}
              onChange={(e) => setState({ ...state, inspectionCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Planned Repair Cost ($)
            </label>
            <input
              type="number"
              value={proactiveCost}
              onChange={(e) => setState({ ...state, proactiveCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              Unplanned Failure Cost ($)
            </label>
            <input
              type="number"
              value={unplannedCost}
              onChange={(e) => setState({ ...state, unplannedCost: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-900/60 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Asset Baseline MTBF (Years)
            </label>
            <input
              type="number"
              step="0.5"
              value={mtbfYears}
              onChange={(e) => setState({ ...state, mtbfYears: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Recommended Task Interval</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            Every {optimalIntervalDays} Days
          </span>
          <span className="text-[11px] text-slate-400">
            {safetyCritical ? 'Rule: (P-F) / 3' : 'Rule: (P-F) / 2'}
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Minimum Warning Lead Time</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {leadTimeDays} Days
          </span>
          <span className="text-[11px] text-slate-400">
            Guaranteed planning window
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Net Annual Savings</span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-1 block">
            ${Math.round(netAnnualSavings).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400">
            Avoided breakdown downtime
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Condition Monitoring ROI</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {Math.round(roiPct).toLocaleString()}%
          </span>
          <span className="text-[11px] text-slate-400">
            Annual insp cost: ${Math.round(annualInspectionCost).toLocaleString()}
          </span>
        </div>
      </div>

      <ShareAndExport
        toolTitle="P-F Interval Optimization Calculator"
        inputs={{
          "Asset / Failure Mode": failureMode,
          "P-F Interval": `${pfDurationDays} Days`,
          "Inspection Cost": `$${inspectionCost}`,
          "Planned Repair Cost": `$${proactiveCost}`,
          "Unplanned Failure Cost": `$${unplannedCost}`,
          "Baseline MTBF": `${mtbfYears} Years`,
          "High Criticality": safetyCritical ? "Yes (P-F / 3)" : "No (P-F / 2)"
        }}
        results={{
          "Optimal Inspection Interval": `Every ${optimalIntervalDays} Days`,
          "Minimum Lead Time": `${leadTimeDays} Days`,
          "Net Annual Savings": `$${Math.round(netAnnualSavings).toLocaleString()}/yr`,
          "PdM Program ROI": `${Math.round(roiPct)}%`
        }}
        exportData={[
          { Parameter: "Failure Mode", Value: failureMode },
          { Parameter: "P-F Days", Value: pfDays },
          { Parameter: "Optimal Task Interval (Days)", Value: optimalIntervalDays },
          { Parameter: "Intervention Window (Days)", Value: leadTimeDays },
          { Parameter: "Annual Inspections", Value: Math.round(annualInspections) },
          { Parameter: "Annual Savings ($)", Value: Math.round(netAnnualSavings) },
          { Parameter: "ROI (%)", Value: Math.round(roiPct) }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Condition-Based Maintenance: <span className="text-cyan-600 dark:text-cyan-400">The P-F Interval & RCM Principles</span>
        </h2>
        <p>
          In Reliability-Centered Maintenance (RCM), equipment failure is not an instantaneous event; it is a progressive physical degradation process. The <strong>P-F Curve</strong> (pioneered by John Moubray and codified under <strong>SAE JA1011</strong> and <strong>SAE JA1012</strong>) illustrates the timeline from the point where a potential failure (<InlineMath math="P" />) becomes detectable until functional failure (<InlineMath math="F" />) occurs.
        </p>
        <p>
          The duration between point <InlineMath math="P" /> and point <InlineMath math="F" /> is the <strong>P-F Interval</strong>. To guarantee that a developing defect is intercepted before catastrophic breakdown, predictive maintenance (PdM) condition monitoring tasks—such as vibration spectrum analysis, infrared thermography, and acoustic ultrasound—must be executed at mathematically optimized intervals governed by the P-F curve.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The Two Cardinal Rules of P-F Task Selection
        </h3>
        <p>
          Per SAE JA1011 Section 5.5, an on-condition predictive maintenance task is technically feasible and compliant only if it satisfies two fundamental criteria:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Clear Potential Failure Point:</strong> There must exist a distinct, measurable physical indicator of impending failure (e.g. 4 kHz bearing cage defect frequencies, 5°C thermal gradient rise on an electrical breaker lug).
          </li>
          <li>
            <strong>Reasonably Consistent P-F Interval:</strong> The time span between point <InlineMath math="P" /> and point <InlineMath math="F" /> must be consistent enough to establish an inspection frequency, and must be substantially longer than the administrative lead time required to order parts, schedule craft labor, and isolate the machine.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of P-F Optimization: Formulas & Standards
        </h2>
        <p>
          To ensure that a developing fault is reliably detected regardless of where in the cycle it initiates, RCM standards establish the <strong>Half-Interval Rule</strong>:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Inspection Interval } (T_{\text{insp}}) \le \frac{P-F}{2}" />
        </div>
        <p>
          This guarantees a minimum warning lead time (<InlineMath math="T_{\text{lead}}" />) for corrective intervention:
        </p>
        <div className="my-6">
          <BlockMath math="T_{\text{lead}} = (P-F) - T_{\text{insp}} \ge \frac{P-F}{2}" />
        </div>
        <p>
          For critical production bottlenecks or environmental/safety hazards, conservative asset management policies under <strong>ISO 55000</strong> apply a third or quarter interval divisor:
        </p>
        <div className="my-6">
          <BlockMath math="T_{\text{insp, critical}} = \frac{P-F}{3} \quad \text{or} \quad \frac{P-F}{4}" />
        </div>
        <p>
          The financial viability of the on-condition task is validated when total annual PdM cost is significantly less than the unmitigated failure consequences:
        </p>
        <div className="my-4">
          <BlockMath math="\text{Net Annual Savings} = \left(\frac{C_{\text{unplanned}} - C_{\text{proactive}}}{\text{MTBF}}\right) - \left(\frac{365}{T_{\text{insp}}} \times C_{\text{insp}}\right)" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Heavy Crusher Gearbox Bearing
        </h3>
        <p>
          A cement ball mill trunnion gearbox bearing failure mode exhibits an established P-F interval of <strong>90 days</strong> using high-frequency vibration acceleration enveloping:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>P-F duration: 90 days</li>
          <li>Inspection route cost: $120 per test</li>
          <li>Catastrophic unplanned failure cost (gear tooth stripping + 36 hr kiln downtime): $85,000</li>
          <li>Planned proactive bearing swap during scheduled weekend stop: $6,000</li>
          <li>Mean Time Between Failures: 4.0 years</li>
        </ul>
        <p className="mt-3">
          <strong>Step 1: Determine Task Interval:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="T_{\text{insp}} = \frac{90 \text{ days}}{2} = 45 \text{ days}" />
        </div>
        <p>
          The vibration analysis route must be conducted at least <strong>every 45 days</strong> (or monthly in practice).
        </p>
        <p>
          <strong>Step 2: Warning Lead Time:</strong>
          If a defect initiates 1 day after an inspection, the next inspection 44 days later will catch the defect with:
          <InlineMath math="T_{\text{lead}} = 90 - 45 = 45\text{ days}" /> remaining before failure. This provides ample time to procure specialized spherical roller bearings and arrange rigging cranes.
        </p>
        <p>
          <strong>Step 3: Annual Cost-Benefit:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="\text{Avoided Annual Breakdown Cost} = \frac{\$85,000 - \$6,000}{4.0} = \$19,750 \text{ /year}" />
          <BlockMath math="\text{Annual PdM Route Cost} = \left(\frac{365}{45}\right) \times \$120 \approx \$973 \text{ /year}" />
          <BlockMath math="\text{Net Annual Benefit} = \$19,750 - \$973 = \$18,777 \text{ /year } (\text{ROI } \approx 1,930\%)" />
        </div>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in P-F Curve Condition Monitoring
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Setting Task Interval Equal to the P-F Interval:</strong> If <InlineMath math="T_{\text{insp}} = P-F" /> (e.g. testing every 90 days for a 90-day P-F interval), a defect starting immediately after an inspection will reach complete failure 1 day before the next scheduled reading.
          </li>
          <li>
            <strong>Using a Technology with an Insufficient P-F Lead Time:</strong> Human sensory inspections (audible noise or tactile heat) occur very late on the P-F curve (often only hours or days before seizure), leaving zero administrative time to prevent catastrophic secondary damage.
          </li>
          <li>
            <strong>Treating P-F as Constant Across Different Speeds:</strong> The P-F interval is measured in operating cycles, not calendar days. A fan bearing rotating at 3,600 RPM has a P-F interval in days that is four times shorter than an identical bearing operating at 900 RPM.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Why must the inspection interval be less than half the P-F interval?",
      answer: "Setting the inspection interval to less than half the P-F interval (T ≤ (P-F) / 2) mathematically ensures that at least one inspection occurs between potential failure point P and functional failure point F, guaranteeing at least half the P-F duration as an administrative warning window."
    },
    {
      question: "What is the difference between Point P and Point F on the P-F Curve?",
      answer: "Point P (Potential Failure) is the earliest detectable physical symptom of degradation (e.g. sub-surface fatigue spalling detected via ultrasound or vibration). Point F (Functional Failure) is the moment the asset is no longer able to perform its intended operational function."
    },
    {
      question: "What international standards govern RCM and P-F intervals?",
      answer: "Reliability-Centered Maintenance criteria and P-F interval principles are defined by <strong>SAE JA1011</strong> (Evaluation Criteria for Reliability-Centered Maintenance (RCM) Processes) and <strong>SAE JA1012</strong> (A Guide to the Reliability-Centered Maintenance (RCM) Standard), aligned with <strong>ISO 55000</strong> asset management."
    }
  ];

  return (
    <ToolContentLayout
      title="P-F Interval Optimizer Calculator – Free Online | Reliability Tools"
      description="Determine optimal condition monitoring inspection frequencies along the P-F interval curve per SAE JA1011, SAE JA1012, and ISO 55000 asset management rules."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="pf-interval-optimizer" />
        </>
      }
      faqs={faqs}
      keywords="P-F interval calculator, condition monitoring frequency, RCM calculator, SAE JA1011, SAE JA1012, ISO 55000, predictive maintenance interval, vibration frequency calculator"
      canonicalUrl="https://reliabilitytools.co.in/tools/pf-interval-optimizer/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "P-F Interval Optimizer Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "SAE JA1011 / SAE JA1012 / ISO 55000",
          description: "Society of Automotive Engineers standards for Reliability-Centered Maintenance criteria and condition monitoring P-F interval optimization."
        }
      }}
    />
  );
};

export default PfOptimizer;
