import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { getArticleForTool } from '../data/contentMapping';

interface ToolToArticleBannerProps {
  toolSlug?: string;
}

const ToolToArticleBanner: React.FC<ToolToArticleBannerProps> = ({ toolSlug }) => {
  const location = useLocation();
  const slug = toolSlug || location.pathname;
  const mapping = getArticleForTool(slug);

  if (!mapping) return null;

  return (
    <div className="my-8 bg-gradient-to-r from-cyan-900/40 via-slate-900/60 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl relative overflow-hidden group">
      {/* Background Ornament */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Recommended Reading
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
            Want to master this theory? Read our guide:
          </h3>
          <p className="text-slate-300 text-sm font-semibold">
            {mapping.articleTitle}
          </p>
          <p className="text-slate-400 text-xs leading-relaxed hidden sm:block">
            {mapping.articleSummary}
          </p>
        </div>

        <Link
          to={`/learning/${mapping.articleId}/`}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 whitespace-nowrap text-sm shrink-0"
        >
          <BookOpen className="w-4 h-4" /> Read Guide <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ToolToArticleBanner;
