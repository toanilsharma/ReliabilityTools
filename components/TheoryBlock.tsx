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
    <AnimatedContainer animation="slideUp" delay={delay} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:border-cyan-500/50 hover:shadow-md transition-all group h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 flex-grow">
          {children}
        </div>
        {formula && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 overflow-x-auto flex justify-center text-slate-800 dark:text-slate-200">
              <BlockMath math={formula} />
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default TheoryBlock;
