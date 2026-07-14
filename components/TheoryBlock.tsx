import React from 'react';
import { BlockMath } from 'react-katex';
import AnimatedContainer from './AnimatedContainer';
import { BookOpen } from 'lucide-react';

interface TheoryBlockProps {
  title: string;
  icon?: React.ReactNode;
  formula?: string;
  children: React.ReactNode;
  delay?: number;
}

const TheoryBlock: React.FC<TheoryBlockProps> = ({ title, icon = <BookOpen className="w-5 h-5" />, formula, children, delay = 0 }) => {
  return (
    <AnimatedContainer 
      animation="slideUp" 
      delay={delay} 
      className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden hover:border-cyan-500/40 dark:hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/5 dark:hover:shadow-cyan-500/10 transition-all duration-300 group h-full flex flex-col"
    >
      {/* Premium Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="p-6 pt-7 flex-grow flex flex-col">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border border-cyan-200/40 dark:border-cyan-800/30 text-cyan-600 dark:text-cyan-400 rounded-xl shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed space-y-4 flex-grow">
          {children}
        </div>
        
        {formula && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="bg-slate-50/50 dark:bg-slate-950/50 rounded-xl p-4 overflow-x-auto flex justify-center text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-900/60 shadow-inner">
              <BlockMath math={formula} />
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default TheoryBlock;
