import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../data/industriesData';
import { Factory, ArrowRight, ShieldCheck, Sparkles, Building2, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import { BASE_URL } from '../utils/seoConfig';

const IndustriesHub: React.FC = () => {
  const canonicalUrl = `${BASE_URL}/industries/`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Industry-Specific Reliability Engineering Solutions',
    description: 'Explore tailored reliability engineering calculators and maintenance strategies for Cement, Steel, Automotive, Pharma, FMCG, and Power Generation.',
    url: canonicalUrl
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      <SEO
        title="Industry-Specific Reliability Engineering Tools | Reliability Tools"
        description="Explore targeted maintenance calculators, failure mode analysis, and reliability tools tailored for Cement, Steel, Automotive, Pharma, FMCG, and Power Generation."
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-12 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-4">
          <Building2 className="w-4 h-4" /> Sector Directories
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
          Industry-Specific Reliability Engineering Solutions
        </h1>

        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
          Select your manufacturing sector below to access specialized maintenance calculators, failure mode analysis tools, and downtime reduction models.
        </p>
      </div>

      {/* Grid of All 6 Industries */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INDUSTRIES.map((industry) => (
          <Link
            key={industry.slug}
            to={`/industries/${industry.slug}/`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                <Factory className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                {industry.name}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {industry.tagline}
              </p>

              <div className="pt-2 space-y-1.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Challenges Addressed:</div>
                <ul className="space-y-1">
                  {industry.pain_points.slice(0, 2).map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                      <span className="truncate">{point.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-cyan-600 dark:text-cyan-400 group-hover:underline">
              <span>View Sector Calculators ({industry.recommended_tool_slugs.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndustriesHub;
