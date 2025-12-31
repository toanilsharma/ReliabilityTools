
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text }) => {
  return (
    <div className="group relative inline-block ml-2 align-middle">
      <HelpCircle className="w-4 h-4 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-help transition-colors" />
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
      </div>
    </div>
  );
};

export default HelpTooltip;
