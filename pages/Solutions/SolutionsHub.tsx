import React from 'react';
import { Link } from 'react-router-dom';
import { SOLUTIONS } from '../../data/solutionsData';
import { Layers, ArrowRight, ShieldCheck, Sparkles, Compass, CheckCircle2, Wrench, Activity } from 'lucide-react';
import SEO from '../../components/SEO';
import { BASE_URL } from '../../utils/seoConfig';

const SolutionsHub: React.FC = () => {
  const canonicalUrl = `${BASE_URL}/solutions/`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Industrial Reliability Engineering Solutions & Topic Clusters',
    description: 'Explore tailored reliability engineering solution clusters for Maintenance Optimization, Functional Safety (SIL), Manufacturing OEE, and Statistical Life Data Analysis.',
    url: canonicalUrl
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      <SEO
        title="Industrial Reliability Engineering Solutions | Reliability Tools"
        description="Explore comprehensive reliability solution workflows: Maintenance Optimization, Functional Safety (SIL), Manufacturing OEE, and Statistical Life Data Modeling."
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-14 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-4">
          <Layers className="w-4 h-4" /> Integrated Topic Clusters
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
          Industrial Reliability Engineering Solutions
        </h1>

        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
          Select an engineering problem domain below to access multi-tool calculation workflows, governing standards (ISO, IEC, API, JIPM), and step-by-step optimization frameworks.
        </p>
      </div>

      {/* Grid of All 4 Solutions */}
      <div className="grid md:grid-cols-2 gap-8">
        {SOLUTIONS.map((solution, idx) => (
          <Link
            key={solution.slug}
            to={`/solutions/${solution.slug}/`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {solution.standards.slice(0, 3).map((std) => (
                    <span key={std} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-mono font-bold">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                {solution.name}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {solution.tagline}
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Stages:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {solution.workflowSteps.slice(0, 4).map((step) => (
                    <div key={step.stepNumber} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <span className="truncate">{step.toolName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-cyan-600 dark:text-cyan-400 group-hover:underline">
              <span>View Solution Hub &amp; Pipeline ({solution.recommendedToolSlugs.length} Tools)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SolutionsHub;

