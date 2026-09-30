import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { ShieldCheck, ChevronDown, ChevronUp, Copy, Check, BookOpen, Layers, Terminal } from 'lucide-react';

export interface CalculationStep {
  name: string;
  formula: string; // KaTeX string
  substitution: string; // KaTeX string with actual user numbers
  result: string; // KaTeX string with final value & units
  dimensionalAnalysis?: string; // KaTeX string showing unit cancellation
  interpretation?: string; // Engineering meaning
}

export interface CalculationProofProps {
  title?: string;
  standard?: string;
  standardClause?: string;
  steps: CalculationStep[];
  assumptions?: string[];
  auditChecklist?: string[];
  initiallyOpen?: boolean;
}

export const CalculationProofDrawer: React.FC<CalculationProofProps> = ({
  title = "Calculation Audit & Mathematical Derivation",
  standard = "ISO 14224 / MIL-HDBK-338B",
  standardClause,
  steps,
  assumptions,
  auditChecklist = [
    "Independent failure events verified",
    "Continuous operating horizon validated",
    "Right-censored / suspended data properly classified",
  ],
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copied, setCopied] = useState(false);

  const copyMemoToClipboard = () => {
    let memo = `### ${title}\nStandard Reference: ${standard} ${standardClause ? `(${standardClause})` : ''}\n\n`;
    steps.forEach((step, i) => {
      memo += `Step ${i + 1}: ${step.name}\n`;
      memo += `Formula: ${step.formula}\n`;
      memo += `Substitution: ${step.substitution}\n`;
      memo += `Result: ${step.result}\n`;
      if (step.interpretation) memo += `Note: ${step.interpretation}\n`;
      memo += `\n`;
    });
    if (assumptions && assumptions.length > 0) {
      memo += `Assumptions:\n` + assumptions.map(a => `- ${a}`).join('\n') + `\n\n`;
    }
    memo += `Generated via ReliabilityTools.co`;

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mt-6 border border-blue-200 dark:border-blue-900/60 rounded-xl bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/20 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header bar toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition hover:bg-blue-100/40 dark:hover:bg-blue-900/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                {title}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Glass-Box Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standards Reference: <span className="font-medium text-slate-700 dark:text-slate-300">{standard}</span>
              {standardClause && <span className="text-slate-500 dark:text-slate-400"> ({standardClause})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium hidden sm:inline">
            {isOpen ? "Hide Step-by-Step Proof" : "Show Step-by-Step Proof"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 border-t border-blue-100 dark:border-blue-900/40 space-y-6">
          {/* Action row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Full mathematical trace with exact parameter substitution & unit cancellation.</span>
            </div>
            <button
              onClick={copyMemoToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Audit Memo</span>
                </>
              )}
            </button>
          </div>

          {/* Steps Grid / Timeline */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs relative overflow-hidden"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {step.name}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Base Formula */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono font-semibold block mb-1">
                      Theoretical Equation
                    </span>
                    <div className="overflow-x-auto py-1">
                      <BlockMath math={step.formula || ''} renderError={() => <code className="text-xs font-mono">{step.formula}</code>} />
                    </div>
                  </div>

                  {/* Numerical Substitution */}
                  <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                    <span className="text-xs uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80 font-mono font-semibold block mb-1">
                      Numerical Value Substitution
                    </span>
                    <div className="overflow-x-auto py-1 text-blue-950 dark:text-blue-200">
                      <BlockMath math={step.substitution || ''} renderError={() => <code className="text-xs font-mono">{step.substitution}</code>} />
                    </div>
                  </div>
                </div>

                {/* Result and Dimensional Cancellation */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Evaluated Output:
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded">
                      <InlineMath math={step.result || ''} renderError={() => <code className="text-xs font-mono">{step.result}</code>} />
                    </span>
                  </div>

                  {step.dimensionalAnalysis && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>Dimensions:</span>
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        <InlineMath math={step.dimensionalAnalysis || ''} renderError={() => <code className="text-xs font-mono">{step.dimensionalAnalysis}</code>} />
                      </span>
                    </div>
                  )}
                </div>

                {step.interpretation && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50/60 dark:bg-amber-950/20 border-l-2 border-amber-400 px-2.5 py-1.5 rounded-r">
                    {step.interpretation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Engineering Assumptions & Verification Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {assumptions && assumptions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  Engineering Boundary Assumptions
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  {assumptions.map((asm, i) => (
                    <li key={i}>{asm}</li>
                  ))}
                </ul>
              </div>
            )}

            {auditChecklist && auditChecklist.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Audit & Compliance Verification
                </div>
                <ul className="text-xs text-emerald-900 dark:text-emerald-300 space-y-1.5">
                  {auditChecklist.map((chk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationProofDrawer;
