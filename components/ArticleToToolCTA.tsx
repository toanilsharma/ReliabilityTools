import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, Calculator } from 'lucide-react';
import { getToolForArticle } from '../data/contentMapping';

interface ArticleToToolCTAProps {
  articleId?: string;
}

const ArticleToToolCTA: React.FC<ArticleToToolCTAProps> = ({ articleId }) => {
  const mapping = getToolForArticle(articleId || '');

  if (!mapping) return null;

  return (
    <div className="my-10 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 border-2 border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Calculator className="w-48 h-48 text-cyan-400" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5" /> Interactive Calculator
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
          Calculate Your Own Data Now
        </h3>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-medium">
          Skip manual calculations! Put this engineering theory into practice instantly using our free, interactive <strong>{mapping.toolName}</strong>.
        </p>

        <div className="pt-2">
          <Link
            to={mapping.toolPath}
            className="inline-flex items-center gap-3 px-7 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base rounded-2xl shadow-xl hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-1"
          >
            Open Free {mapping.toolName} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleToToolCTA;
