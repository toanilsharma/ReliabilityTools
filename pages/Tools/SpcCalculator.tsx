import React, { useState, useMemo, useRef } from 'react';
import { Activity, ShieldCheck, AlertCircle, Copy, Check, Share2, Info, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface SpcState {
  meansInput: string; // Comma separated subgroup means
  rangesInput: string; // Comma separated subgroup ranges
  usl: string;
  lsl: string;
  subgroupSize: number;
}

// Factors for n=5 (standard default)
const A2_FACTOR = 0.577;
const D2_FACTOR = 2.326;

const SpcCalculator: React.FC = () => {
  const [state, setState] = useState<SpcState>({
    meansInput: '10.02, 10.05, 9.98, 10.01, 10.04, 10.03, 9.99, 10.02',
    rangesInput: '0.12, 0.15, 0.10, 0.14, 0.11, 0.13, 0.09, 0.12',
    usl: '10.30',
    lsl: '9.70',
    subgroupSize: 5
  });

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toolRef = useRef<HTMLDivElement>(null);

  const { meansInput, rangesInput, usl, lsl } = state;

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const u = parseFloat(usl);
    const l = parseFloat(lsl);
    if (isNaN(u) || isNaN(l) || u <= l) {
      newErrors.usl = 'USL must be strictly greater than LSL.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      trackToolCalculation('SPC & Process Capability Calculator', 'spc');
    }
  };

  const spcResults = useMemo(() => {
    const means = meansInput.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
    const ranges = rangesInput.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));

    const USL = parseFloat(usl) || 10.30;
    const LSL = parseFloat(lsl) || 9.70;

    if (means.length === 0 || ranges.length === 0) {
      return null;
    }

    // Grand Mean (X-double-bar)
    const grandMean = means.reduce((a, b) => a + b, 0) / means.length;
    // Mean Range (R-bar)
    const meanRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;

    // Control Limits
    const UCL = grandMean + (A2_FACTOR * meanRange);
    const LCL = grandMean - (A2_FACTOR * meanRange);

    // Process Sigma estimate
    const processSigma = meanRange / D2_FACTOR;

    // Process Capability Indices
    const Cp = processSigma > 0 ? (USL - LSL) / (6 * processSigma) : 0;
    const Cpu = processSigma > 0 ? (USL - grandMean) / (3 * processSigma) : 0;
    const Cpl = processSigma > 0 ? (grandMean - LSL) / (3 * processSigma) : 0;
    const Cpk = Math.min(Cpu, Cpl);

    let statusTitle = 'Capable Process';
    let statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    let statusDesc = 'Cpk > 1.33. Process is well within specification limits with low risk of producing non-conforming parts.';

    if (Cpk < 1.0) {
      statusTitle = 'Incapable Process (High Defect Risk)';
      statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      statusDesc = 'Cpk < 1.0. Process spread exceeds specification limits; significant risk of non-conforming defect parts.';
    } else if (Cpk <= 1.33) {
      statusTitle = 'Marginal Process Capability';
      statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      statusDesc = '1.0 ≤ Cpk ≤ 1.33. Process is marginally capable; tight monitoring or process variability reduction required.';
    }

    const chartData = means.map((m, idx) => ({
      subgroup: `SG #${idx + 1}`,
      mean: Number(m.toFixed(3)),
      ucl: Number(UCL.toFixed(3)),
      cl: Number(grandMean.toFixed(3)),
      lcl: Number(LCL.toFixed(3))
    }));

    return {
      grandMean,
      meanRange,
      UCL,
      LCL,
      processSigma,
      Cp,
      Cpk,
      statusTitle,
      statusColor,
      statusDesc,
      chartData
    };
  }, [meansInput, rangesInput, usl, lsl]);

  const handleCopySnippet = () => {
    if (!spcResults) return;
    const text = `SPC & Process Capability (Cpk) Summary:
- Grand Mean (X-double-bar): ${spcResults.grandMean.toFixed(4)}
- Cp Index: ${spcResults.Cp.toFixed(2)}
- Cpk Index: ${spcResults.Cpk.toFixed(2)}
- Capability Status: ${spcResults.statusTitle}
- Control Limits: UCL = ${spcResults.UCL.toFixed(3)}, LCL = ${spcResults.LCL.toFixed(3)}
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/spc/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is Statistical Process Control (SPC)?',
      answer: 'SPC is a quality control methodology using statistical charts (X-bar and R charts) to monitor process stability and detect special-cause variation before non-conforming defects occur.'
    },
    {
      question: 'What is the difference between Cp and Cpk?',
      answer: 'Cp measures potential process capability assuming the process is perfectly centered between specification limits. Cpk accounts for process centering and measures actual capability.'
    },
    {
      question: 'What Cpk benchmark is required for Six Sigma quality?',
      answer: 'A Cpk of 1.33 (4-sigma capability) is standard for industrial manufacturing, while a Cpk of 2.0 represents Six Sigma quality (less than 3.4 defects per million opportunities).'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Form Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-cyan-500" /> SPC Subgroup Data
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Subgroup Means (comma separated)</span>
                <HelpTooltip text="Paste subgroup average values." />
              </label>
              <textarea
                rows={3}
                value={meansInput}
                onChange={e => setState(s => ({ ...s, meansInput: e.target.value }))}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Subgroup Ranges (comma separated)</span>
                <HelpTooltip text="Paste subgroup range values (Max - Min)." />
              </label>
              <textarea
                rows={3}
                value={rangesInput}
                onChange={e => setState(s => ({ ...s, rangesInput: e.target.value }))}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  USL (Upper Limit)
                </label>
                <input
                  type="number"
                  step="any"
                  value={usl}
                  onChange={e => setState(s => ({ ...s, usl: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  LSL (Lower Limit)
                </label>
                <input
                  type="number"
                  step="any"
                  value={lsl}
                  onChange={e => setState(s => ({ ...s, lsl: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
            {errors.usl && <p className="text-rose-500 text-xs font-semibold">{errors.usl}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Calculate Control Limits & Cpk
            </button>
          </form>
        </AnimatedContainer>

        {/* Results Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          {spcResults && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 md:p-8 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">X-bar & R Control Chart Analysis</span>
                  <h4 className="text-2xl md:text-3xl font-black text-white mt-1">SPC & Capability Output</h4>
                </div>
                <button
                  onClick={handleCopySnippet}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
                >
                  {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
                </button>
              </div>

              {/* Status Banner */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400">Process Capability Status</div>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-black border ${spcResults.statusColor}`}>
                  {spcResults.statusTitle}
                </div>
                <p className="text-xs text-slate-300 font-medium pt-1">
                  {spcResults.statusDesc}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cp Index</span>
                  <span className="text-xl font-black text-cyan-300">{spcResults.Cp.toFixed(2)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cpk Index</span>
                  <span className="text-xl font-black text-amber-300">{spcResults.Cpk.toFixed(2)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">UCL (Upper)</span>
                  <span className="text-xl font-black text-white">{spcResults.UCL.toFixed(3)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">LCL (Lower)</span>
                  <span className="text-xl font-black text-white">{spcResults.LCL.toFixed(3)}</span>
                </div>
              </div>

              {/* X-bar Control Chart */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spcResults.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="subgroup" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#38bdf8" fontSize={11} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <ReferenceLine y={spcResults.UCL} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'UCL', fill: '#f43f5e', fontSize: 10 }} />
                    <ReferenceLine y={spcResults.grandMean} stroke="#10b981" label={{ value: 'CL', fill: '#10b981', fontSize: 10 }} />
                    <ReferenceLine y={spcResults.LCL} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'LCL', fill: '#f43f5e', fontSize: 10 }} />
                    <Line type="monotone" dataKey="mean" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <ShareAndExport
                toolName="SPC & Process Capability Calculator"
                shareUrl="https://reliabilitytools.co.in/tools/spc/"
                resultSummary={`Cpk: ${spcResults.Cpk.toFixed(2)} - ${spcResults.statusTitle}`}
              />
            </div>
          )}
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding SPC & Process Capability Indices (Cp, Cpk)</h2>
      <p>
        Statistical Process Control (SPC) uses control charts to separate natural common-cause process variation from assignable special causes. Process Capability indices (<InlineMath math="C_p, C_{pk}" />) quantify how well a stable process satisfies engineering specification tolerances.
      </p>

      <h3>Capability Interpretation Thresholds</h3>
      <ul>
        <li><strong><InlineMath math="C_{pk} < 1.0" />:</strong> Process is incapable; defects are being produced.</li>
        <li><strong><InlineMath math="1.0 \le C_{pk} \le 1.33" />:</strong> Marginally capable; requires close statistical monitoring.</li>
        <li><strong><InlineMath math="C_{pk} > 1.33" />:</strong> Capable process producing fewer than 64 defects per million.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="SPC & Process Capability Calculator (Cpk)"
      description="Calculate X-bar control chart limits (UCL, CL, LCL) and process capability indices (Cp, Cpk) with visual control chart plots."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="spc calculator, process capability cpk, x-bar control chart, upper control limit ucl, six sigma process capability"
      canonicalUrl="https://reliabilitytools.co.in/tools/spc/"
    />
  );
};

export default SpcCalculator;
