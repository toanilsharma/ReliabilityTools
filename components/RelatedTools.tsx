
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, ARTICLES } from '../constants';
import { Wrench, ArrowRight, BookOpen } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
}

const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId }) => {
  const relatedTools = useMemo(() => {
    const currentTool = TOOLS.find(t => t.id === currentToolId);
    
    return TOOLS
      .filter(t => t.id !== currentToolId)
      .sort((a, b) => {
        const aMatch = a.category === currentTool?.category;
        const bMatch = b.category === currentTool?.category;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
      .slice(0, 3);
  }, [currentToolId]);

  const relatedArticles = useMemo(() => {
    const currentTool = TOOLS.find(t => t.id === currentToolId);
    const searchTerm = currentToolId.toLowerCase().split('-')[0];

    // Match articles related to tool ID or fallback to top articles
    const matched = ARTICLES.filter(a => 
      a.id.toLowerCase().includes(searchTerm) || 
      a.title.toLowerCase().includes(searchTerm) ||
      (currentTool && a.summary.toLowerCase().includes(currentTool.name.toLowerCase().split(' ')[0]))
    );

    return matched.length > 0 ? matched.slice(0, 2) : ARTICLES.slice(0, 2);
  }, [currentToolId]);

  return (
    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 no-print space-y-12">
      {/* Section 1: Related Tools */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> 
          Related Reliability Tools
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedTools.map(tool => (
            <Link 
              key={tool.id} 
              to={tool.path}
              className="group flex flex-col p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                  {tool.category}
                </span>
              </div>
              <div className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2">
                {tool.name}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                {tool.description}
              </p>
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Tool <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section 2: Learn More / Educational Guides */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" /> 
          Learn More: Recommended Guides
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {relatedArticles.map(article => (
            <Link 
              key={article.id} 
              to={`/learning/${article.id}`}
              className="group p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all duration-300 block"
            >
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                Learning Hub Article
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                {article.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {article.summary}
              </p>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Full Article <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedTools;
