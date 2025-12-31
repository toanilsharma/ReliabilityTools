
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { Wrench, ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
}

const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId }) => {
  const related = useMemo(() => {
    const currentTool = TOOLS.find(t => t.id === currentToolId);
    
    // Logic: Prioritize tools in the same category, then fill with others
    return TOOLS
      .filter(t => t.id !== currentToolId)
      .sort((a, b) => {
        // Sort by category match first
        const aMatch = a.category === currentTool?.category;
        const bMatch = b.category === currentTool?.category;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
      .slice(0, 3);
  }, [currentToolId]);

  return (
    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 no-print">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> 
        Related Tools
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map(tool => (
          <Link 
            key={tool.id} 
            to={tool.path}
            className="group flex flex-col p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wide bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
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
  );
};

export default RelatedTools;
