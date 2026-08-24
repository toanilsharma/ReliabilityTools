import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getIndustryBySlug, INDUSTRIES } from '../data/industriesData';
import { TOOLS } from '../constants';
import { Factory, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { BASE_URL } from '../utils/seoConfig';

const IndustryView: React.FC = () => {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const industry = getIndustryBySlug(industrySlug || '');

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const canonicalUrl = `${BASE_URL}/industries/${industry.slug}/`;

  // Get matching recommended tools
  const recommendedTools = TOOLS.filter(tool =>
    industry.recommended_tool_slugs.some(slug => tool.path.includes(`/${slug}/`))
  );

  // Fallback to top tools if none matched
  const displayTools = recommendedTools.length > 0 ? recommendedTools : TOOLS.slice(0, 6);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Reliability & Maintenance Calculators for ${industry.name}`,
    description: industry.hero_description,
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
        title={`Reliability Engineering for ${industry.name} | Reliability Tools`}
        description={industry.hero_description.slice(0, 155)}
        canonicalUrl={canonicalUrl}
        schema={websiteSchema}
      />

      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 no-print">
        <Link to="/" className="hover:text-cyan-500 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/industries" className="hover:text-cyan-500 transition-colors">Industries</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">{industry.name}</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-14 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            <Factory className="w-4 h-4" /> Sector Reliability Solutions
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Reliability & Maintenance Calculators for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{industry.name}</span> Sector
          </h1>

          <p className="text-slate-300 text-base md:text-xl leading-relaxed font-medium">
            {industry.hero_description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#tools-grid"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-sm transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25"
            >
              <Wrench className="w-4 h-4" /> Explore Sector Tools <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Pain Points Section */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Critical Reliability Challenges
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
            Key Maintenance Pain Points in {industry.name}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Understand the physics of failure and operational risks unique to this manufacturing sector:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {industry.pain_points.map((point, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-500 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                  {point.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Tools Grid */}
      <section id="tools-grid" className="space-y-8 scroll-mt-24">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Tailored Toolkit
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Recommended Calculators for {industry.name}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full w-fit">
            Showing {displayTools.length} Targeted Tools
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400">
                    {tool.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center text-xs font-extrabold text-cyan-600 dark:text-cyan-400 group-hover:underline">
                Open Calculator <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IndustryView;
