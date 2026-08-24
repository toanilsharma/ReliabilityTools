import React, { useState, useMemo, useRef } from 'react';
import { HelpCircle, Plus, Trash2, Copy, Check, Share2, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';

interface WhyRow {
  id: string;
  whyText: string;
  countermeasure: string;
}

const DEFAULT_WHYS: WhyRow[] = [
  { id: '1', whyText: 'Centrifugal Pump P-101 bearing seized, stopping Line 2 production.', countermeasure: 'Replace bearing and align motor shaft.' },
  { id: '2', whyText: 'The bearing ran out of lubrication and overheated.', countermeasure: 'Implement automatic lube dispenser.' },
  { id: '3', whyText: 'The manual greasing schedule was missed during the shift.', countermeasure: 'Add mandatory digital PM checklist in CMMS.' },
  { id: '4', whyText: 'Technician was assigned 3 simultaneous breakdown calls.', countermeasure: 'Rebalance maintenance technician shift workload.' },
  { id: '5', whyText: 'No priority dispatch protocol exists for critical asset PMs.', countermeasure: 'Establish RCM asset criticality ranking to protect PM schedules.' }
];

const FiveWhyTool: React.FC = () => {
  const [problemStatement, setProblemStatement] = useState<string>('Unplanned outage on Line 2 due to pump P-101 failure.');
  const [whys, setWhys] = useState<WhyRow[]>(DEFAULT_WHYS);
  const [copiedReport, setCopiedReport] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const toolRef = useRef<HTMLDivElement>(null);

  const handleAddWhy = () => {
    const nextId = String(whys.length + 1);
    setWhys(prev => [...prev, { id: nextId, whyText: '', countermeasure: '' }]);
  };

  const handleRemoveWhy = (index: number) => {
    if (whys.length <= 1) return;
    setWhys(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleWhyChange = (index: number, field: 'whyText' | 'countermeasure', value: string) => {
    setWhys(prev => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemStatement.trim()) {
      setErrors('Please enter a problem statement.');
      return;
    }
    setErrors('');
    trackToolCalculation('5-Why RCA Builder', '5-why');
  };

  const formattedReport = useMemo(() => {
    const stepsText = whys.map((w, idx) => `Why ${idx + 1}: ${w.whyText || 'N/A'}\n  - Countermeasure: ${w.countermeasure || 'N/A'}`).join('\n\n');
    const rootCause = whys.length > 0 ? whys[whys.length - 1].whyText : 'N/A';
    const finalCountermeasure = whys.length > 0 ? whys[whys.length - 1].countermeasure : 'N/A';

    const fullReportText = `ROOT CAUSE ANALYSIS (5-WHY REPORT)
=======================================
PROBLEM STATEMENT:
${problemStatement}

5-WHY CAUSAL CHAIN:
${stepsText}

ROOT CAUSE IDENTIFIED:
${rootCause}

PRIMARY SYSTEMIC COUNTERMEASURE:
${finalCountermeasure}

Generated via Reliability Tools: https://reliabilitytools.co.in/tools/5-why/`;

    return {
      fullReportText,
      rootCause,
      finalCountermeasure
    };
  }, [problemStatement, whys]);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(formattedReport.fullReportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const faqs = [
    {
      question: 'What is the 5-Why Root Cause Analysis technique?',
      answer: '5-Why is an iterative problem-solving technique pioneered by Toyota to drill down past superficial symptoms to the systemic root cause by asking "Why?" multiple times.'
    },
    {
      question: 'How do countermeasures differ from quick fixes?',
      answer: 'A quick fix restores equipment immediately (e.g. replacing a blown fuse), whereas a countermeasure alters the underlying system, process, or design so the failure mode cannot recur.'
    },
    {
      question: 'Do I have to stop exactly at 5 Whys?',
      answer: 'No. "5" is a rule of thumb. You stop when asking "Why?" leads to a root cause that is within your organizational control to address with a robust countermeasure.'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Form Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-2 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-cyan-500" /> Problem & Causal Chain Builder
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Problem Statement (Specific Event)</span>
                <HelpTooltip text="State the observed failure symptom clearly without prescribing causes." />
              </label>
              <textarea
                rows={2}
                value={problemStatement}
                onChange={e => setProblemStatement(e.target.value)}
                placeholder="e.g. Conveyor belt motor tripped on overload during shift 2."
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors}</p>}
            </div>

            {/* Dynamic Why Rows */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Causal Chain Steps ({whys.length} Whys)
                </span>
                <button
                  type="button"
                  onClick={handleAddWhy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Why Step
                </button>
              </div>

              {whys.map((w, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                      Why #{idx + 1}
                    </span>
                    {whys.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWhy(idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Why did this happen?
                    </label>
                    <input
                      type="text"
                      value={w.whyText}
                      onChange={e => handleWhyChange(idx, 'whyText', e.target.value)}
                      placeholder={`Reason for level ${idx + 1}...`}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Countermeasure / Action for this step
                    </label>
                    <input
                      type="text"
                      value={w.countermeasure}
                      onChange={e => handleWhyChange(idx, 'countermeasure', e.target.value)}
                      placeholder="Preventive action..."
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Generate RCA Summary Report
            </button>
          </form>
        </AnimatedContainer>

        {/* Output Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">RCA Summary Report</span>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReport ? 'Copied!' : 'Copy Report'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Root Cause</div>
                <div className="text-sm font-extrabold text-amber-400 leading-snug">
                  {formattedReport.rootCause}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Systemic Countermeasure</div>
                <div className="text-sm font-extrabold text-emerald-400 leading-snug">
                  {formattedReport.finalCountermeasure}
                </div>
              </div>
            </div>

            <ShareAndExport
              toolName="5-Why RCA Builder"
              shareUrl="https://reliabilitytools.co.in/tools/5-why/"
              resultSummary={`Root Cause: ${formattedReport.rootCause}`}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding 5-Why Root Cause Analysis</h2>
      <p>
        The 5-Why method is a fundamental problem-solving technique in Reliability-Centered Maintenance (RCM) and Lean Manufacturing. By repeatedly asking "Why?" when investigating equipment failure, engineers drill past superficial symptoms to uncover procedural, cultural, or design root causes.
      </p>

      <h3>Key Rules for Effective 5-Why Analysis</h3>
      <ul>
        <li><strong>Focus on Processes, Not People:</strong> Avoid assigning blame to operators; investigate why procedural safeguards allowed the error to happen.</li>
        <li><strong>Verify Cause-and-Effect Relationships:</strong> Ensure each "Why?" logical step can be read backwards as a "Therefore..." statement.</li>
        <li><strong>Implement Robust Countermeasures:</strong> True root cause analysis eliminates the possibility of failure recurrence.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="5-Why Root Cause Analysis Builder"
      description="Build structured 5-Why root cause analysis causal chains with countermeasures and export formatted RCA reports."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="5-why root cause analysis tool, 5 why template, rca builder, reliability centered maintenance, root cause analysis software"
      canonicalUrl="https://reliabilitytools.co.in/tools/5-why/"
    />
  );
};

export default FiveWhyTool;
