import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';

/**
 * Defines the logical calculation pipelines connecting tools.
 * Each tool can appear in multiple pipelines.
 */
interface PipelineStep {
  slug: string;
  name: string;
  path: string;
  description: string;
}

interface Pipeline {
  id: string;
  name: string;
  steps: PipelineStep[];
}

const PIPELINES: Pipeline[] = [
  {
    id: 'reliability-core',
    name: 'Reliability & Availability Analysis',
    steps: [
      { slug: 'mtbf', name: 'MTBF Calculator', path: '/tools/mtbf/', description: 'Calculate Mean Time Between Failures' },
      { slug: 'mttr', name: 'MTTR Calculator', path: '/tools/mttr/', description: 'Calculate Mean Time To Repair' },
      { slug: 'availability', name: 'Availability Calculator', path: '/tools/availability/', description: 'Determine system availability from MTBF & MTTR' },
      { slug: 'lcc', name: 'Life Cycle Cost', path: '/tools/lcc/', description: 'Evaluate total cost of ownership' },
      { slug: 'spares', name: 'Spare Part Estimator', path: '/tools/spares/', description: 'Optimize spare parts inventory levels' },
    ]
  },
  {
    id: 'failure-analysis',
    name: 'Failure Analysis Pipeline',
    steps: [
      { slug: 'weibull', name: 'Weibull Analysis', path: '/tools/weibull/', description: 'Determine failure distribution parameters' },
      { slug: 'hazard-rate', name: 'Hazard Rate Calculator', path: '/tools/hazard-rate/', description: 'Compute instantaneous failure rates' },
      { slug: 'optimal-replacement', name: 'Optimal Replacement', path: '/tools/optimal-replacement/', description: 'Find cost-optimal replacement intervals' },
      { slug: 'pm', name: 'PM Optimizer', path: '/tools/pm/', description: 'Optimize preventive maintenance schedules' },
    ]
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Pipeline',
    steps: [
      { slug: 'fmea', name: 'FMEA Calculator', path: '/tools/fmea/', description: 'Evaluate failure modes and risk priority' },
      { slug: 'fta', name: 'Fault Tree Analysis', path: '/tools/fta/', description: 'Model top-down failure pathways' },
      { slug: 'rcm-decision', name: 'RCM Decision Wizard', path: '/tools/rcm-decision/', description: 'Select optimal maintenance strategies' },
      { slug: 'sil', name: 'SIL Verification', path: '/tools/sil/', description: 'Verify Safety Integrity Levels (IEC 61508)' },
    ]
  },
  {
    id: 'system-design',
    name: 'System Reliability Design',
    steps: [
      { slug: 'rbd', name: 'Reliability Block Diagram', path: '/tools/rbd/', description: 'Model series/parallel system configurations' },
      { slug: 'k-out-of-n', name: 'K-out-of-N Calculator', path: '/tools/k-out-of-n/', description: 'Calculate redundant system reliability' },
      { slug: 'reliability-allocation', name: 'Reliability Allocation', path: '/tools/reliability-allocation/', description: 'Distribute reliability targets across components' },
      { slug: 'validator', name: 'System Validator', path: '/tools/validator/', description: 'Validate total system reliability compliance' },
    ]
  },
  {
    id: 'production-efficiency',
    name: 'Production Efficiency Analysis',
    steps: [
      { slug: 'oee', name: 'OEE Calculator', path: '/tools/oee/', description: 'Measure Overall Equipment Effectiveness' },
      { slug: 'downtime-cost', name: 'Downtime Cost Calculator', path: '/tools/downtime-cost/', description: 'Quantify the financial impact of downtime' },
      { slug: 'pareto', name: 'Pareto Chart', path: '/tools/pareto/', description: 'Identify the vital few causes of losses' },
      { slug: 'fishbone', name: 'Fishbone Diagram', path: '/tools/fishbone/', description: 'Root cause analysis with Ishikawa diagrams' },
    ]
  },
  {
    id: 'equipment-health',
    name: 'Equipment Health Monitoring',
    steps: [
      { slug: 'vibration-severity', name: 'Vibration Severity', path: '/tools/vibration-severity/', description: 'Check vibration levels per ISO 10816' },
      { slug: 'bearing-life', name: 'Bearing Life Calculator', path: '/tools/bearing-life/', description: 'Estimate bearing L10 fatigue life' },
      { slug: 'gearbox', name: 'Gearbox Reliability', path: '/tools/gearbox/', description: 'Analyze gearbox failure probabilities' },
      { slug: 'lubricant-life', name: 'Lubricant Life Optimizer', path: '/tools/lubricant-life/', description: 'Optimize lubricant change intervals' },
    ]
  },
  {
    id: 'root-cause',
    name: 'Root Cause Analysis Pipeline',
    steps: [
      { slug: 'fishbone', name: 'Fishbone Diagram', path: '/tools/fishbone/', description: 'Brainstorm potential root causes visually' },
      { slug: '5-why', name: '5 Why Analysis', path: '/tools/5-why/', description: 'Drill down to the true root cause' },
      { slug: 'fmea', name: 'FMEA Calculator', path: '/tools/fmea/', description: 'Quantify risks and prioritize actions' },
    ]
  }
];

/**
 * Finds which pipeline(s) the current tool belongs to and returns the next steps.
 */
function getNextSteps(currentSlug: string): { pipeline: Pipeline; currentIndex: number; nextSteps: PipelineStep[]; prevStep: PipelineStep | null }[] {
  const results: { pipeline: Pipeline; currentIndex: number; nextSteps: PipelineStep[]; prevStep: PipelineStep | null }[] = [];

  for (const pipeline of PIPELINES) {
    const currentIndex = pipeline.steps.findIndex(s => s.slug === currentSlug);
    if (currentIndex !== -1) {
      const nextSteps = pipeline.steps.slice(currentIndex + 1, currentIndex + 3); // Show next 2 steps
      const prevStep = currentIndex > 0 ? pipeline.steps[currentIndex - 1] : null;
      if (nextSteps.length > 0 || prevStep) {
        results.push({ pipeline, currentIndex, nextSteps, prevStep });
      }
    }
  }

  return results;
}

/**
 * Extracts the tool slug from a pathname like /tools/mtbf/ → mtbf
 */
function extractSlug(pathname: string): string | null {
  const match = pathname.match(/^\/tools\/([^/]+)/);
  return match ? match[1] : null;
}

const CalculationPipeline: React.FC = () => {
  const location = useLocation();
  const currentSlug = extractSlug(location.pathname);

  if (!currentSlug) return null;

  const pipelineResults = getNextSteps(currentSlug);

  if (pipelineResults.length === 0) return null;

  // Pick the best (longest) pipeline
  const best = pipelineResults.sort((a, b) => b.nextSteps.length - a.nextSteps.length)[0];

  return (
    <section className="my-10" aria-label="Calculation Pipeline">
      <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800/80 dark:to-cyan-950/20 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/5 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Next Step in Your Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {best.pipeline.name} — Step {best.currentIndex + 1} of {best.pipeline.steps.length}
              </p>
            </div>
          </div>

          {/* Pipeline Progress Bar */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 scrollbar-thin">
            {best.pipeline.steps.map((step, index) => (
              <React.Fragment key={step.slug}>
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
                <Link
                  to={step.path}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    step.slug === currentSlug
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                      : index < best.currentIndex
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:text-cyan-700 dark:hover:text-cyan-300'
                  }`}
                  title={step.description}
                >
                  {step.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Next Step Cards */}
          {best.nextSteps.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {best.nextSteps.map((step, index) => (
                <Link
                  key={step.slug}
                  to={step.path}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    index === 0
                      ? 'bg-white dark:bg-slate-800 border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-colors ${
                    index === 0
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                  }`}>
                    <ArrowRight className={`w-5 h-5 ${
                      index === 0
                        ? 'text-white'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    } group-hover:translate-x-0.5 transition-transform`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-cyan-600 dark:text-cyan-400 mb-0.5">
                      {index === 0 ? 'Recommended Next' : 'Then Try'}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors truncate">
                      {step.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {step.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CalculationPipeline;
