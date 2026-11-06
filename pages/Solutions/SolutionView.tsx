import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getSolutionBySlug, SOLUTIONS } from '../../data/solutionsData';
import { TOOLS } from '../../constants';
import { 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  Zap, 
  Compass,
  FileSpreadsheet,
  Target
} from 'lucide-react';
import SEO from '../../components/SEO';
import { BASE_URL } from '../../utils/seoConfig';

const SolutionView: React.FC = () => {
  const { solutionSlug } = useParams<{ solutionSlug: string }>();
  const solution = getSolutionBySlug(solutionSlug || '');

  if (!solution) {
    return <Navigate to="/solutions/" replace />;
  }

  const canonicalUrl = `${BASE_URL}/solutions/${solution.slug}/`;

  // Get matching recommended tools from constants
  const recommendedTools = TOOLS.filter(tool =>
    solution.recommendedToolSlugs.some(slug => tool.path.includes(`/${slug}/`))
  );

  const displayTools = recommendedTools.length > 0 ? recommendedTools : TOOLS.slice(0, 6);

  // Other solutions for cross-pillar PageRank flow
  const otherSolutions = SOLUTIONS.filter(s => s.slug !== solution.slug);

  const solutionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: solution.name,
    description: solution.metaDescription,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Reliability Tools',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/social-preview.png`
      }
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: displayTools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        url: `${BASE_URL}${tool.path}`
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      <SEO
        title={solution.metaTitle}
        description={solution.metaDescription}
        canonicalUrl={canonicalUrl}
        schema={solutionSchema}
      />

      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 no-print">
        <Link to="/" className="hover:text-cyan-500 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/solutions/" className="hover:text-cyan-500 transition-colors">Solutions</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">{solution.shortName}</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-14 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" /> Topic Cluster &amp; Engineering Solution
            </span>
            {solution.standards.map((std) => (
              <span key={std} className="px-2.5 py-1 bg-white/10 rounded-full text-slate-300 text-[11px] font-mono">
                {std}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
            {solution.name}
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
            {solution.heroDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#workflow"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-sm transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25"
            >
              <Zap className="w-4 h-4" /> View Integrated Workflow <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#tools-grid"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 transition-all"
            >
              <Wrench className="w-4 h-4" /> Browse Calculators ({solution.recommendedToolSlugs.length})
            </a>
          </div>
        </div>
      </div>

      {/* Executive Summary & Engineering Challenge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Compass className="w-4 h-4" /> Engineering Framework
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Why an Integrated Reliability Workflow Matters
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {solution.executiveSummary}
        </p>

        <div className="grid md:grid-cols-2 gap-4 pt-4">
          {solution.keyOutcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-semibold">{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Step-by-Step Engineering Workflow */}
      <div id="workflow" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Step-by-Step Calculation Loop
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              End-to-End Reliability Execution Pipeline
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {solution.workflowSteps.length} Sequential Analysis Stages
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.workflowSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-black text-sm flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Analysis Stage</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.objective}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-400">Inputs: </span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">{step.inputMetric}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Outputs: </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{step.outputMetric}</span>
                  </div>
                </div>
              </div>

              <Link
                to={step.toolPath}
                className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-black text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-all"
              >
                <span>Launch {step.toolName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tools Grid */}
      <div id="tools-grid" className="space-y-6 pt-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Dedicated Engineering Calculators
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Calculators Included in This Solution Hub
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    {tool.category}
                  </span>
                  <Wrench className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-cyan-600 dark:text-cyan-400">
                <span>Open Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore Other Solution Pillars (PageRank Distribution) */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Cross-Disciplinary Reliability Architecture
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Explore Other Engineering Solutions
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {otherSolutions.map((other) => (
            <Link
              key={other.slug}
              to={`/solutions/${other.slug}/`}
              className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">
                  {other.standards[0]} Solution
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors text-base">
                  {other.shortName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {other.tagline}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>View Solution Hub</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionView;

