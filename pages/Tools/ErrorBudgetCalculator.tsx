import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Clock, 
  AlertOctagon, 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface ErrorBudgetState {
  serviceName: string;
  sloTarget: string; // e.g., 99.9
  windowDays: string; // e.g., 30
  consumedDowntimeMinutes: string; // e.g., 18.5
  obsWindowHours: string; // observation window for burn rate, e.g. 1
  obsDowntimeMinutes: string; // downtime in observation window, e.g. 2.0
}

const ErrorBudgetCalculator: React.FC = () => {
  const [state, setState] = useShareableState<ErrorBudgetState>({
    serviceName: 'IIoT Telemetry Gateway API',
    sloTarget: '99.9',
    windowDays: '30',
    consumedDowntimeMinutes: '15',
    obsWindowHours: '1',
    obsDowntimeMinutes: '1.2'
  });

  const { 
    serviceName, 
    sloTarget, 
    windowDays, 
    consumedDowntimeMinutes, 
    obsWindowHours, 
    obsDowntimeMinutes 
  } = state;

  const { addRecentTools } = useRecentTools() as any;

  useEffect(() => {
    if (typeof addRecentTools === 'function') {
      addRecentTools({
        id: 'error-budget',
        name: 'Error Budget SLO Calculator',
        path: '/tools/error-budget/'
      });
    }
  }, []);

  const numSlo = Math.min(99.999, Math.max(90, parseFloat(sloTarget) || 99.9));
  const numDays = Math.max(1, parseFloat(windowDays) || 30);
  const numConsumed = Math.max(0, parseFloat(consumedDowntimeMinutes) || 0);
  const numObsHours = Math.max(0.1, parseFloat(obsWindowHours) || 1);
  const numObsDown = Math.max(0, parseFloat(obsDowntimeMinutes) || 0);

  // Time metrics
  const totalWindowMinutes = numDays * 24 * 60;
  const errorBudgetPct = 100 - numSlo;
  const totalAllowedMinutes = (totalWindowMinutes * errorBudgetPct) / 100;
  const remainingBudgetMinutes = totalAllowedMinutes - numConsumed;
  const pctConsumed = totalAllowedMinutes > 0 ? (numConsumed / totalAllowedMinutes) * 100 : 0;

  // Burn rate calculation:
  // Burn Rate = (downtime in obs window / total allowed downtime) / (obs window hours / total window hours)
  const totalWindowHours = numDays * 24;
  const burnRate = totalAllowedMinutes > 0
    ? (numObsDown / totalAllowedMinutes) / (numObsHours / totalWindowHours)
    : 1;

  // Time until budget depletion at current burn rate
  const hoursToDepletion = burnRate > 0 && remainingBudgetMinutes > 0
    ? (remainingBudgetMinutes / (burnRate * (totalAllowedMinutes / totalWindowHours)))
    : 0;

  // Alert level
  let alertBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let alertTitle = 'Budget Healthy';
  let alertRecommendation = 'Normal release velocity. Proceed with feature deployments.';

  if (remainingBudgetMinutes <= 0) {
    alertBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    alertTitle = 'Budget Exhausted (Feature Freeze)';
    alertRecommendation = 'Halt all non-critical feature releases. Direct engineering solely to reliability and bug fixes.';
  } else if (burnRate >= 14.4) {
    alertBadge = 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    alertTitle = 'Critical Fast Burn (14.4× Page Alert)';
    alertRecommendation = 'Consuming entire 30-day budget in < 2 days. Page on-call engineer immediately!';
  } else if (burnRate >= 6.0) {
    alertBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    alertTitle = 'Elevated Burn (6× Ticket Alert)';
    alertRecommendation = 'Budget consuming 6× faster than baseline. Open high-priority investigation ticket.';
  } else if (pctConsumed >= 80) {
    alertBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    alertTitle = 'Budget Low (< 20% Remaining)';
    alertRecommendation = 'Tighten release approval criteria and verify canary deployment rollbacks.';
  }

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Configuration Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              ISO 25010 / IEEE 730 Site Reliability Engineering
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              SLO Agreement & Error Budget Parameters
            </h3>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${alertBadge}`}>
            {alertTitle}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Service / API Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setState({ ...state, serviceName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target SLO (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="90"
              max="99.999"
              value={sloTarget}
              onChange={(e) => setState({ ...state, sloTarget: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">e.g. 99.9% (Three Nines)</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Rolling Window (Days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={windowDays}
              onChange={(e) => setState({ ...state, windowDays: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Consumed Downtime (Mins)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={consumedDowntimeMinutes}
              onChange={(e) => setState({ ...state, consumedDowntimeMinutes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Burn Rate Velocity Sub-form */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" /> Multi-Window Burn Rate Rate-of-Change Observation
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Recent Observation Window (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={obsWindowHours}
                onChange={(e) => setState({ ...state, obsWindowHours: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Downtime in Observation Window (Mins)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={obsDowntimeMinutes}
                onChange={(e) => setState({ ...state, obsDowntimeMinutes: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Total Allowed Downtime</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {totalAllowedMinutes.toFixed(1)} <span className="text-xs font-normal text-slate-400">mins</span>
          </span>
          <span className="text-[11px] text-slate-400">across {numDays} days</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Remaining Error Budget</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${remainingBudgetMinutes <= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {remainingBudgetMinutes.toFixed(1)} <span className="text-xs font-normal text-slate-400">mins</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {pctConsumed.toFixed(1)}% consumed
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Instantaneous Burn Rate</span>
          <span className={`text-2xl font-black font-mono mt-1 block ${burnRate >= 14.4 ? 'text-rose-500' : burnRate >= 6 ? 'text-amber-500' : 'text-cyan-500'}`}>
            {burnRate.toFixed(2)}×
          </span>
          <span className="text-[11px] text-slate-400">
            {burnRate > 1 ? `${burnRate.toFixed(1)}× faster than normal` : 'Nominal rate'}
          </span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Time to Budget Depletion</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            {remainingBudgetMinutes <= 0 ? 'Exhausted' : hoursToDepletion > 24 ? `${(hoursToDepletion / 24).toFixed(1)} days` : `${hoursToDepletion.toFixed(1)} hrs`}
          </span>
          <span className="text-[11px] text-slate-400">at current burn velocity</span>
        </div>
      </div>

      {/* Progress Bar of Consumed Budget */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">Error Budget Consumption Gauge</span>
          <span className={pctConsumed >= 100 ? 'text-rose-500' : 'text-cyan-500'}>
            {pctConsumed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pctConsumed >= 100 ? 'bg-rose-500' : pctConsumed >= 80 ? 'bg-amber-500' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min(100, pctConsumed)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          <strong>SRE Policy Recommendation:</strong> {alertRecommendation}
        </p>
      </div>

      <ShareAndExport
        toolTitle="Error Budget & SLO Calculator"
        inputs={{
          "Service Name": serviceName,
          "Target SLO": `${sloTarget}%`,
          "Rolling Window": `${windowDays} Days`,
          "Consumed Downtime": `${consumedDowntimeMinutes} mins`,
          "Obs Window": `${obsWindowHours} hrs`,
          "Obs Window Downtime": `${obsDowntimeMinutes} mins`
        }}
        results={{
          "Total Allowed Downtime": `${totalAllowedMinutes.toFixed(1)} mins`,
          "Remaining Error Budget": `${remainingBudgetMinutes.toFixed(1)} mins`,
          "Burn Rate": `${burnRate.toFixed(2)}x`,
          "Time to Depletion": `${hoursToDepletion.toFixed(1)} hrs`,
          "Status Policy": alertTitle
        }}
        exportData={[
          { Parameter: "Service", Value: serviceName },
          { Parameter: "SLO %", Value: sloTarget },
          { Parameter: "Window Days", Value: windowDays },
          { Parameter: "Total Allowed Downtime (min)", Value: totalAllowedMinutes },
          { Parameter: "Consumed Downtime (min)", Value: consumedDowntimeMinutes },
          { Parameter: "Remaining Budget (min)", Value: remainingBudgetMinutes },
          { Parameter: "Burn Rate Factor", Value: burnRate.toFixed(2) },
          { Parameter: "Alert Status", Value: alertTitle }
        ]}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Software & System Reliability: <span className="text-cyan-600 dark:text-cyan-400">Error Budgets and SLO Principles</span>
        </h2>
        <p>
          In modern industrial automation, SCADA networks, and cloud software infrastructure, achieving 100% uptime is neither economically viable nor technically desirable. Perfection halts innovation. <strong>Site Reliability Engineering (SRE)</strong> resolves this tension through the mechanism of the <strong>Error Budget</strong>.
        </p>
        <p>
          Formalized under <strong>ISO 25010</strong> (Systems and software quality requirements) and <strong>IEEE 730</strong> (Software Quality Assurance Processes), an error budget defines the acceptable margin of unreliability over a designated rolling operational window. If your Service Level Objective (SLO) is 99.9% uptime, your error budget is 0.1% allowable failure. This budget acts as a currency spent on feature deployments, infrastructure migrations, and rapid updates.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          The SRE Trinity: SLI, SLO, and SLA
        </h3>
        <p>
          Effective reliability governance requires separating metrics, internal targets, and contractual commitments:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>SLI (Service Level Indicator):</strong> The quantifiable real-time measurement of service behavior (e.g., HTTP request success rate, sensor data packet latency &lt; 200ms).
          </li>
          <li>
            <strong>SLO (Service Level Objective):</strong> The internal target agreed upon between product developers and operations engineers (e.g., 99.9% successful queries over a rolling 30-day window).
          </li>
          <li>
            <strong>SLA (Service Level Agreement):</strong> The external commercial contract with customers specifying financial penalties or credit refunds if reliability drops below a lower threshold (e.g., 99.0%).
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Error Budgets & Burn Rates: Formulas & Standards
        </h2>
        <p>
          Given a rolling window of <InlineMath math="T" /> days and an SLO target percentage, the Total Allowed Downtime (<InlineMath math="D_{\text{allowed}}" />) in minutes is:
        </p>
        <div className="my-6">
          <BlockMath math="D_{\text{allowed}} = (T \times 24 \times 60) \times \left(\frac{100 - \text{SLO}}{100}\right)" />
        </div>
        <p>
          The remaining error budget (<InlineMath math="B_{\text{rem}}" />) is simply:
        </p>
        <div className="my-6">
          <BlockMath math="B_{\text{rem}} = D_{\text{allowed}} - D_{\text{consumed}}" />
        </div>
        <p>
          To detect severe outages before the entire monthly budget evaporates, SRE practices monitor the <strong>Burn Rate</strong> (<InlineMath math="\text{BR}" />). A burn rate of 1.0 consumes exactly 100% of the budget over the full window:
        </p>
        <div className="my-6">
          <BlockMath math="\text{Burn Rate (BR)} = \frac{D_{\text{obs}} / D_{\text{allowed}}}{H_{\text{obs}} / H_{\text{window}}}" />
        </div>
        <p>
          Standard Google SRE alerting rules dictate two automated threshold triggers:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            <strong>14.4× Burn Rate (1-hour window):</strong> Consumes 2% of a 30-day budget in 1 hour (depletes 100% in 50 hours). Triggers an immediate pager alarm.
          </li>
          <li>
            <strong>6.0× Burn Rate (6-hour window):</strong> Consumes 5% of a 30-day budget in 6 hours. Generates an elevated priority ticket.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Smart Factory Telemetry Ingestion Hub
        </h3>
        <p>
          An IoT telemetry ingestion hub for an automotive factory operates under a <strong>99.9% SLO</strong> over a <strong>30-day rolling window</strong>:
        </p>
        <p className="mt-2">
          <strong>Step 1: Total Allowed Downtime:</strong>
        </p>
        <div className="my-2">
          <BlockMath math="D_{\text{allowed}} = (30 \times 24 \times 60) \times 0.001 = 43,200 \times 0.001 = 43.2\text{ minutes}" />
        </div>
        <p>
          <strong>Step 2: Burn Rate Assessment:</strong>
          Following a faulty Kubernetes node deployment, the pipeline experiences <strong>4.32 minutes</strong> of downtime over a 1-hour observation window (<InlineMath math="H_{\text{obs}} = 1" />, <InlineMath math="H_{\text{window}} = 720" />):
        </p>
        <div className="my-2">
          <BlockMath math="\text{BR} = \frac{4.32 / 43.2}{1 / 720} = \frac{0.100}{0.00139} = 72.0\times" />
        </div>
        <p>
          <strong>Step 3: Action:</strong> At a 72× burn rate, the system will exhaust the entire monthly error budget in just 10 hours. The automated deployment pipeline triggers an immediate automatic rollback to the previous container image.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in Error Budget & SLO Implementation
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Demanding 100% Availability:</strong> Mandating "five nines" (99.999% = 4.38 minutes downtime per year) for non-safety-critical systems exponentially drives up redundant cloud and database architecture costs without delivering perceptible user benefit.
          </li>
          <li>
            <strong>Alerting on Raw Error Spikes Rather Than Burn Rate:</strong> Paging engineers every time an error spike occurs causes alarm fatigue. Multi-window burn rate alerts filter out transient blips and alert only when sustained outages threaten budget exhaustion.
          </li>
          <li>
            <strong>Failing to Enforce Feature Freezes:</strong> An error budget is meaningless if development continues pushing new code after the budget is spent. Product management must commit to freezing feature rollouts when the budget drops to zero.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What happens when an Error Budget is 100% exhausted?",
      answer: "When an error budget reaches zero, SRE governance enforces a 'Feature Freeze'. Development teams halt new feature releases and redirect all engineering efforts toward reliability enhancements, bug fixes, automated rollbacks, and infrastructure stabilization until the rolling window recovers."
    },
    {
      question: "How does an Error Budget relate to ISO 25010?",
      answer: "ISO 25010 defines system and software quality models, specifically the 'Reliability' and 'Availability' sub-characteristics. SLOs and Error Budgets provide the quantitative operational governance mechanism to verify compliance with ISO 25010 availability criteria."
    },
    {
      question: "Why are multi-window burn rate alerts preferred over simple error rate alarms?",
      answer: "Simple threshold alerts suffer from high false-alarm rates during momentary network hiccups and delay alerts during slow, chronic degradation. Multi-window burn rate monitoring (e.g. 14.4x over 1 hour and 6x over 6 hours) balances rapid detection speed with near-zero false alarms."
    }
  ];

  return (
    <ToolContentLayout
      title="Error Budget SLO Calculator – Free Online | Reliability Tools"
      description="Calculate software reliability error budgets, burn rates, and allowable downtime per ISO 25010 and IEEE 730 site reliability engineering SLO benchmarks."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="error-budget" />
        </>
      }
      faqs={faqs}
      keywords="error budget calculator, SLO calculator, SRE burn rate calculator, ISO 25010, IEEE 730, site reliability engineering, service level objective, downtime budget"
      canonicalUrl="https://reliabilitytools.co.in/tools/error-budget/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "Error Budget SLO Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "ISO 25010 / IEEE 730",
          description: "International standards for systems and software quality models, reliability evaluation, and software quality assurance processes."
        }
      }}
    />
  );
};

export default ErrorBudgetCalculator;
