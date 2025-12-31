
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-8 text-slate-400">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
        <ShieldCheck className="w-12 h-12 text-cyan-600 dark:text-cyan-400 animate-bounce" />
      </div>
      <div className="mt-4 text-xs font-bold tracking-widest uppercase animate-pulse text-cyan-600 dark:text-cyan-400">
        Loading Assets...
      </div>
    </div>
  );
};

export default Loading;
