import React, { useState } from "react";
import { calculateMTBF } from "../../services/reliabilityMath";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { reliabilityStandards, getGroupedStandards } from "../../data/standards";
import {
  Clock,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  Table,
  BarChart,
  BookOpen,
  Target,
  TrendingUp,
  Activity,
  Calculator,
} from "lucide-react";
import HelpTooltip from "../../components/HelpTooltip";
import { ASSET_BENCHMARKS } from "../../constants";
import ToolContentLayout from "../../components/ToolContentLayout";
import RelatedTools from "../../components/RelatedTools";
// Removed unused ShareResult import
import { useRecentTools } from "../../hooks/useRecentTools";
import { useLocation, Link } from "react-router-dom";
// Removed unused useReactToPrint import
import { useShareableState } from "../../hooks/useShareableState";
import ShareAndExport from "../../components/ShareAndExport";
import { useRef } from "react";
import AnimatedContainer from "../../components/AnimatedContainer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import TheoryBlock from "../../components/TheoryBlock";
import { BathtubCurveDiagram, AvailabilityTimeline } from "../../components/TheoryVisuals";

interface MtbfState {
  mode: "MTBF" | "MTTF";
  totalHours: string;
  failures: string;
  selectedStandardId: string;
  result: number | null;
}

const MtbfCalculator: React.FC = () => {
  const [state, setState, shareUrl] = useShareableState<MtbfState>({
    mode: "MTBF",
    totalHours: "8760",
    failures: "4",
    selectedStandardId: "",
    result: null,
  });

  const { mode, totalHours, failures, selectedStandardId, result } = state;
  
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ hours?: string; failures?: string }>({});
  
  const { addRecentTool } = useRecentTools();
  const location = useLocation();
  const toolRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Log tool visit
    addRecentTool({
        id: 'mtbf',
        name: 'MTBF Calculator',
        path: '/mtbf-calculator'
    });

    // Parse legacy URL params for sharing (if any)
    const searchParams = new URLSearchParams(location.search);
    const h = searchParams.get('hours');
    const f = searchParams.get('failures');
    
    if (h || f) {
        setState(s => {
          const newState = { ...s };
          if (h) newState.totalHours = h;
          if (f) newState.failures = f;
          if (h && f && !isNaN(parseFloat(h)) && !isNaN(parseFloat(f))) {
             newState.result = calculateMTBF(parseFloat(h), parseFloat(f));
          }
          return newState;
        });
    }
  }, [location.search]);

  const validateInputs = (): boolean => {
    const newErrors: { hours?: string; failures?: string } = {};
    let isValid = true;
    const h = parseFloat(totalHours);
    if (!totalHours || isNaN(h)) {
      newErrors.hours = "Please enter a valid number.";
      isValid = false;
    } else if (h < 0) {
      newErrors.hours = "Operational time cannot be negative.";
      isValid = false;
    }

    const f = parseFloat(failures);
    if (!failures || isNaN(f)) {
      newErrors.failures = "Please enter a valid number.";
      isValid = false;
    } else if (f < 0) {
      newErrors.failures = "Count cannot be negative.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setState(s => ({ ...s, result: calculateMTBF(parseFloat(s.totalHours), parseFloat(s.failures)) }));
    } else {
      setState(s => ({ ...s, result: null }));
    }
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`${mode}: ${result.toFixed(2)} Hours`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStandardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setState(s => ({ ...s, selectedStandardId: id }));
    if (!id) return;
    
    const comp = reliabilityStandards.find(c => c.id === id);
    if (comp) {
       // comp.failureRate is in Failures Per Million Hours (FPMH)
       const mHours = 1000000 / comp.failureRate;
       setState(s => ({ 
         ...s, 
         totalHours: "1000000",
         failures: comp.failureRate.toString(),
         result: mHours
       }));
       setErrors({});
    }
  };

  const generateLookupTable = () => {
    const basis = 8760;
    return [0.5, 1, 2, 4, 12, 52].map((f) => ({
      failures: f,
      mtbf: basis / f,
      period:
        f <= 1
          ? `Every ${Math.round(1 / f)} Years`
          : f === 12
            ? "Monthly"
            : f === 52
              ? "Weekly"
              : f === 4
                ? "Quarterly"
                : `${f} per Year`,
    }));
  };
  const lookupData = generateLookupTable();

  // --- Tool Component ---
  const ToolComponent = (
    <div className="grid md:grid-cols-2 gap-8" ref={toolRef}>
      <AnimatedContainer animation="slideUp" delay={0.1} className="space-y-6">
        {/* Toggle Calculation Mode */}
        <div className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setState(s => ({ ...s, mode: "MTBF" }))}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "MTBF" ? "bg-cyan-600 text-white shadow" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            MTBF (Repairable)
          </button>
          <button
            onClick={() => setState(s => ({ ...s, mode: "MTTF" }))}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "MTTF" ? "bg-cyan-600 text-white shadow" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            MTTF (Non-Repairable)
          </button>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600" /> Standard Component Library
            <HelpTooltip text="Auto-fill failure rates from industry standards like MIL-HDBK-217F or Telcordia (values in Failures Per Million Hours)." />
          </label>
          <select 
            value={selectedStandardId}
            onChange={handleStandardSelect}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="">-- Custom Input --</option>
            {Object.entries(getGroupedStandards()).map(([std, comps]) => (
              <optgroup key={std} label={std}>
                {comps.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.category} - {c.name} ({c.failureRate} FPMH)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Total Operational Time (Hours)
              <HelpTooltip text="Sum of runtime for all units. (e.g. 10 motors * 1000 hours = 10,000 unit-hours)" />
            </label>
            <input
              type="number"
              value={totalHours}
              onChange={(e) => setState(s => ({ ...s, totalHours: e.target.value }))}
              placeholder="e.g., 8760"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${errors.hours ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
            />
            {errors.hours && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.hours}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {mode === "MTBF"
                ? "Number of Failures"
                : "Number of Failed Units"}
              <HelpTooltip
                text={
                  mode === "MTBF"
                    ? "Total breakdown events."
                    : "Total items discarded."
                }
              />
            </label>
            <input
              type="number"
              value={failures}
              onChange={(e) => setState(s => ({ ...s, failures: e.target.value }))}
              placeholder="e.g., 5"
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors ${errors.failures ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
            />
            {errors.failures && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.failures}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Clock className="w-5 h-5" /> Calculate {mode}
          </button>
        </form>

        {result !== null && (
          <AnimatedContainer animation="scaleUp" delay={0.1} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 relative group">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 text-slate-400 hover:text-cyan-500 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">
              Result ({mode})
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {result.toLocaleString(undefined, { maximumFractionDigits: 1 })}{" "}
              <span className="text-lg text-slate-500 font-normal">hours</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              failures/hour
            </div>
          </AnimatedContainer>
        )}
      </AnimatedContainer>

      <AnimatedContainer animation="slideUp" delay={0.2} className="space-y-6">
        {/* Formula Box - Live Math Rendering */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <RotateCcw className="w-4 h-4 text-cyan-600" /> Live Equation
            <HelpTooltip text="Mathematical representation of the current inputs. Updates automatically as you type." />
          </h3>
          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
             <BlockMath math={`\\text{${mode}} = \\frac{\\text{Total Time}}{\\text{Failures}} = \\frac{${totalHours || 'T'}}{${failures || 'F'}} ${result ? `= \\mathbf{${result.toLocaleString(undefined, { maximumFractionDigits: 1 })}}` : ''}`} />
          </div>
        </div>

        {/* MTBF vs Failure Rate Trend Graph */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-64 flex flex-col">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <TrendingUp className="w-4 h-4 text-cyan-600" /> MTBF vs Failure Frequency (Basis: 1 Yr / 8760 Hr)
            <HelpTooltip text="Shows how rapidly MTBF degrades as breakdowns become more frequent. Notice the non-linear relationship." />
          </h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lookupData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="mtbf" stroke="#0891b2" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#22d3ee' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value: number) => [`${Math.round(value).toLocaleString()} Hours`, 'MTBF']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
            <BarChart className="w-4 h-4 text-cyan-600" /> Industry Benchmarks
            (IEEE 493)
          </h3>
          <div className="space-y-3">
            {Object.entries(ASSET_BENCHMARKS)
              .slice(0, 3)
              .map(([asset, data]) => (
                <div key={asset} className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {asset}
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    {data.range}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </AnimatedContainer>
      
      <div className="md:col-span-2">
        <ShareAndExport 
          toolName="MTBF Calculator"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary={result !== null ? `${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hours` : undefined}
          pdfData={result !== null ? {
            inputs: {
              "Calculation Mode": mode,
              "Operational Time (Hrs)": totalHours,
              "Number of Failures": failures,
              "Standard Component": selectedStandardId ? reliabilityStandards.find(s => s.id === selectedStandardId)?.name || "Custom" : "Custom"
            },
            results: {
              [`Mean Time (${mode})`]: `${result.toLocaleString(undefined, { maximumFractionDigits: 1 })} Hours`,
              "Failure Rate (\u03BB)": `${(1 / result).toFixed(8)} failures/hour`,
              "Reliability Profile": mode === 'MTBF' ? 'Repairable System' : 'Disposable Asset'
            }
          } : undefined}
          exportData={result !== null ? [
            { Parameter: "Calculation Mode", Value: mode },
            { Parameter: "Total Operational Time (Hours)", Value: totalHours },
            { Parameter: "Number of Failures", Value: failures },
            { Parameter: `Result (${mode} in Hours)`, Value: result },
            { Parameter: "Failure Rate (\u03BB in failures/hour)", Value: (1 / result) }
          ] : undefined}
        />
      </div>
    </div>
  );

  // --- Content Strategies ---
  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Ultimate Reliability Metrics Guide: MTBF vs. MTTF
        </h2>
        <p>
          In the field of modern asset management and plant maintenance, understanding failure patterns is critical to achieving high reliability. This comprehensive guide, integrated into our <strong>reliability engineering calculator</strong> platform, explores the core concepts of Mean Time Between Failures (MTBF) and Mean Time To Failure (MTTF). By utilizing this <strong>MTBF calculator free</strong> online tool, reliability engineers and maintenance supervisors can extract actionable insights from raw operational data, transitioning from reactive firefighting to predictive maintenance excellence.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          What is MTBF? (Designed for Repairable Systems)
        </h3>
        <p>
          Mean Time Between Failures (MTBF) is a foundational metric representing the average operational time elapsed between consecutive failures of a repairable system or asset. A system is defined as "repairable" if it can be restored to full operational capacity through maintenance actions (such as part replacement, calibration, or software patching) without replacing the entire asset. Typical examples of repairable assets include industrial pumps, gearboxes, compressor trains, manufacturing assembly robots, and software operating systems.
        </p>
        <p>
          Calculating MTBF helps plant engineers assess the overall health and reliability profile of their physical assets. A declining MTBF indicates a deteriorating system that may require immediate design review, root cause analysis, or a revised preventive maintenance strategy. It is essential to recognize that MTBF applies to the "Useful Life" phase of an asset's lifecycle, where the failure rate remains relatively constant. For non-constant failure rates, such as during run-in wear or rapid aging, modeling must be performed using a dedicated <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull Analysis Tool</Link> to accurately determine the wear-out shape parameters.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          What is MTTF? (Designed for Non-Repairable Components)
        </h3>
        <p>
          In contrast, Mean Time To Failure (MTTF) is a statistical metric representing the expected operational lifespan of a non-repairable component before it fails and is discarded. Because these items cannot be cost-effectively repaired, the first failure terminates their service life. Examples of non-repairable parts include microprocessors, LED light bulbs, rolling-element bearings, electrical fuses, and structural bolts.
        </p>
        <p>
          MTTF represents the true average lifetime of an asset class. In practice, MTTF is calculated by testing a large batch of identical components until they all fail, summing their cumulative operating lifetimes, and dividing by the total number of tested items. When engineering systems for critical applications, selecting components with verified high MTTF scores is paramount to preventing premature catastrophic system failure.
        </p>

        <h2 id="how-to" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of Reliability: MTBF Formula & Uptime Calculations
        </h2>
        <p>
          The basic formula for computing Mean Time Between Failures is the ratio of total operational time to the total number of failure events observed within that time frame:
        </p>
        <div className="my-6">
          <BlockMath math="\text{MTBF} = \frac{\text{Total Operational Time (Hours)}}{\text{Number of Failures (F)}}" />
        </div>
        <p>
          While the equation appears simple, applying it to real-world industrial systems requires careful data collection. Here is a detailed breakdown of the variables:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Total Operational Time:</strong> This is the net active operating duration of the system. It is critical to subtract scheduled downtime (such as planned preventive maintenance, safety shutdowns, or holidays) and administrative delays from the calendar time. Only the time when the equipment was energized and capable of producing output should be counted.
          </li>
          <li>
            <strong>Number of Failures (F):</strong> This represents the count of unscheduled breakdown events that interrupted operations. If a failure occurs and is resolved instantly through a redundant backup system without affecting output, it must still be logged to maintain an accurate failure rate database.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Multi-Asset Fleet Calculation Example
        </h3>
        <p>
          Consider a factory operating a fleet of 10 identical centrifugal pumps. The fleet is monitored over a one-year evaluation period (8,760 hours). 
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Initially, the gross calendar hours for the fleet would be: <InlineMath math="10 \text{ pumps} \times 8{,}760 \text{ hours/pump} = 87{,}600 \text{ pump-hours}" />.
          </li>
          <li>
            However, during the year, each pump was shut down for 160 hours of planned preventive maintenance: <InlineMath math="10 \times 160 = 1{,}600 \text{ planned downtime hours}" />.
          </li>
          <li>
            Furthermore, the plant logged a total of 8 unscheduled pump breakdowns during this time frame, resulting in 200 hours of cumulative repair time.
          </li>
          <li>
            The net operational time for the pump fleet is: <InlineMath math="87{,}600 - 1{,}600 - 200 = 85{,}800 \text{ active running hours}" />.
          </li>
          <li>
            Applying our <strong>free MTBF calculator online</strong> math: <InlineMath math="\text{MTBF} = \frac{85{,}800 \text{ hours}}{8 \text{ failures}} = 10{,}725 \text{ hours}" />.
          </li>
        </ol>
        <p>
          This indicates that, on average, any given pump in the fleet is expected to run for 10,725 operational hours before experiencing a failure.
        </p>

        <h2 id="applications" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Bathtub Curve and Failure Rate Profiles
        </h2>
        <p>
          To apply MTBF effectively, engineers must reference the <strong>Bathtub Curve</strong>, which describes the hazard rate (failure frequency) of a product over time. The curve is divided into three distinct phases:
        </p>
        
        <div className="my-8">
          <BathtubCurveDiagram />
        </div>
        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">1. Infant Mortality</h4>
            <p className="text-sm">
              Characterized by a rapidly decreasing failure rate. Failures are caused by manufacturing defects, poor installation, or material weaknesses. To analyze infant mortality and fit life data parameters, engineers rely on a <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull analysis tool</Link> with Beta (β) &lt; 1.
            </p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">2. Useful Life</h4>
            <p className="text-sm">
              The failure rate remains low and statistically constant (constant hazard rate, β = 1). Failures occur randomly due to environmental stresses or operator error. <strong>MTBF is only valid during this phase.</strong>
            </p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">3. Wear-Out Phase</h4>
            <p className="text-sm">
              Characterized by a rapidly increasing failure rate (β &gt; 1) as components reach their mechanical limits due to friction, fatigue, or corrosion. Engineers must track this to compute the <Link to="/tools/optimal-replacement" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Optimal Replacement Age</Link>.
            </p>
          </div>
        </div>

        <h2 id="standards" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Integrating MTBF, MTTR, and System Availability
        </h2>
        <p>
          MTBF cannot be viewed in isolation. True plant uptime is governed by the relationship between how frequently a system breaks down (MTBF) and how fast it can be repaired (Mean Time to Repair, or MTTR). Together, these metrics define the system's <strong>Inherent Availability (Ai)</strong>:
        </p>
        <div className="my-6">
          <BlockMath math="A_i = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}" />
        </div>
        
        <div className="my-8">
          <AvailabilityTimeline />
        </div>
        <p>
          To calculate the exact financial cost of downtime and simulate various reliability scenarios, engineers can navigate to our specialized <Link to="/tools/availability" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">System Availability Calculator</Link> and <Link to="/tools/mttr" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">MTTR Calculator</Link>.
        </p>
        <p>
          By extending MTBF (e.g., through precision alignment or component upgrades) or drastically reducing MTTR (e.g., through standardized repair kits and stocking critical spares in local inventory via the <Link to="/tools/spares" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Spare Part Estimator</Link>), organizations can drive their availability toward the coveted "five-nines" (99.999% uptime) benchmark.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Standards in Reliability Engineering
        </h3>
        <p>
          When estimating initial failure rates before historical data is accumulated, reliability engineers utilize standardized component libraries. Primary predictive modeling methodologies include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>MIL-HDBK-217F:</strong> The military standard for electronic reliability prediction, utilizing empirical formulas to calculate base failure rates adjusted for environment and temperature.
          </li>
          <li>
            <strong>Telcordia SR-332:</strong> Widely used in the telecommunications sector, combining empirical model predictions with lab test data and field tracking.
          </li>
          <li>
            <strong>NSWC (Naval Surface Warfare Center):</strong> Focuses on mechanical component predictions (valves, gearboxes, springs), taking into account fluid cleanliness, stress ratios, and material properties.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Is MTBF the same as 'Lifetime'?",
      answer:
        "<strong>No.</strong> This is the most common myth. A human has an MTBF of roughly 800 years (if we assume a constant low accident rate), but a lifespan of only 80 years. MTBF measures the probability of random failure, not the wear-out time.",
    },
    {
      question: "Does MTBF include maintenance time?",
      answer:
        "No. MTBF refers only to operating time. If a machine is down for scheduled maintenance, that time is excluded from the calculation.",
    },
    {
      question: "What is a 'Good' MTBF?",
      answer:
        "It depends entirely on the asset. For a centrifugal pump, 25,000 hours (ANSI standard) is good. For a hard drive, 1,000,000 hours is standard. Check the <strong>Industry Benchmarks</strong> sidebar for specific values.",
    },
    {
      question: "How do I improve MTBF?",
      answer:
        "1. <strong>Design:</strong> Use higher quality components.<br>2. <strong>Installation:</strong> Ensure precision alignment and balancing.<br>3. <strong>Operation:</strong> Run equipment within design specifications (don't overload).",
    },
    {
      question: "Can I use MTBF for software?",
      answer:
        "Yes, in software reliability, it stands for Mean Time Between Failures (crashes or bugs). It is calculated based on runtime hours divided by the number of critical defects encountered.",
    },
  ];

  return (
    <ToolContentLayout
      title="Free MTBF Calculator Online - Mean Time Between Failures"
      description={`Calculate ${mode === "MTBF" ? "Mean Time Between Failures" : "Mean Time To Failure"} to predict reliability and optimize maintenance schedules.`}
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="mtbf" />
        </>
      }
      faqs={faqs}
      keywords="free MTBF calculator, MTBF calculator online, mean time between failures, MTTF calculator, reliability calculator India, MTBF formula, failure rate calculator, MTBF calculation example"
      canonicalUrl="https://reliabilitytools.co.in/#/mtbf-calculator"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Free MTBF Calculator Online - Mean Time Between Failures",
        applicationCategory: "UtilitiesApplication",
      }}
    />
  );
};

export default MtbfCalculator;
