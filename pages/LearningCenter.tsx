import React from 'react';
import { ARTICLES } from '../constants';
import { ChevronRight, Calendar, BookOpen, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const LearningCenter: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Reliability Engineering Learning Hub",
    "description": "Educational resources, guides, and tutorials for reliability engineering concepts including MTBF, Weibull, and RBD.",
    "publisher": {
      "@type": "Organization",
      "name": "Reliability Tools"
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-12">
      <SEO schema={schema} />

      <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Reliability Learning Center
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
          No jargon. No textbooks. Just real-world engineering stories, practical guides, and actionable strategies for the modern industry.
        </p>
      </div>

      <div className="grid gap-10">
        {ARTICLES.map((article) => (
          <Link 
            key={article.id}
            to={`/learning/${article.id}`}
            className="group relative bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 duration-300 overflow-hidden block"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/0 via-cyan-50/0 to-cyan-50/30 dark:from-cyan-900/0 dark:via-cyan-900/0 dark:to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 hidden md:flex flex-col items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 group-hover:bg-cyan-50 dark:group-hover:bg-slate-800 transition-colors">
                 <span className="text-xs font-bold text-slate-400 uppercase">{article.date.split(' ')[0]}</span>
                 <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{article.date.split(' ')[1].replace(',', '')}</span>
                 <span className="text-xs text-slate-400">{article.date.split(' ')[2]}</span>
              </div>
              
              <div className="flex-grow">
                <div className="md:hidden flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                  <Calendar className="w-3 h-3" /> {article.date}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-4">
                  {article.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed max-w-3xl">
                  {article.summary}
                </p>
                
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center text-cyan-600 dark:text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
                    Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock className="w-3 h-3" /> 8 min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearningCenter;