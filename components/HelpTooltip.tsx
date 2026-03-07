import React from 'react';
import { HelpCircle, Info, Calculator } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  why?: string;
  formula?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, why, formula }) => {
  return (
    <div className="group relative inline-block ml-2 align-middle">
      <HelpCircle className="w-4 h-4 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-help transition-colors" />
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 pointer-events-none overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">Information</span>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {text}
          </div>
          
          {why && (
            <div className="p-2.5 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-lg border border-cyan-100/50 dark:border-cyan-900/30">
              <div className="font-bold text-cyan-700 dark:text-cyan-400 mb-1 text-[10px] uppercase">Why It Matters</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px] italic">{why}</div>
            </div>
          )}
          
          {formula && (
            <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px] flex items-start gap-2">
              <Calculator className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
              <code className="text-slate-700 dark:text-slate-300">{formula}</code>
            </div>
          )}
        </div>
        
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-slate-900 drop-shadow-sm"></div>
      </div>
    </div>
  );
};

export default HelpTooltip;

