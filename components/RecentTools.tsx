import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useRecentTools } from '../hooks/useRecentTools';

const RecentTools: React.FC = () => {
    const { recentTools } = useRecentTools();

    if (recentTools.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                <Clock className="w-5 h-5 text-cyan-500" />
                Continue where you left off
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                {recentTools.map((tool) => (
                    <Link
                        key={tool.id}
                        to={tool.path}
                        className="snap-start shrink-0 w-64 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recently Used</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                            {tool.name}
                        </h4>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentTools;
