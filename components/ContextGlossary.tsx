import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Book, X, Search, ChevronRight } from 'lucide-react';

interface GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY_DATA: Record<string, GlossaryItem[]> = {
  'weibull': [
    { term: 'Beta (β)', definition: 'Shape parameter. < 1 means infant mortality, 1 means random, > 1 means wear-out.', category: 'Parameters' },
    { term: 'Eta (η)', definition: 'Scale parameter. The characteristic life where 63.2% of units fail.', category: 'Parameters' },
    { term: 'Censored Data', definition: 'Units that haven\'t failed yet (right-censored). Marked with "+".', category: 'Data' },
  ],
  'fmea': [
    { term: 'RPN', definition: 'Risk Priority Number (Severity × Occurrence × Detection).', category: 'Metrics' },
    { term: 'Severity', definition: 'How bad the failure effect is on the end user or system.', category: 'Rating' },
    { term: 'Detection', definition: 'The ability of current controls to catch the failure before it reachs the user.', category: 'Rating' },
  ],
  'rbd': [
    { term: 'Series', definition: 'Configuration where all components must work for system success.', category: 'Logic' },
    { term: 'Parallel', definition: 'Configuration where at least one component must work for system success.', category: 'Logic' },
    { term: 'Redundancy', definition: 'Duplication of critical components to increase reliability.', category: 'Strategy' },
  ],
  'growth': [
    { term: 'Crow-AMSAA', definition: 'A model tracking reliability growth over time using cumulative failures.', category: 'Models' },
    { term: 'Growth Rate', definition: 'The slope of the log-log plot of cumulative failures vs time.', category: 'Metrics' },
  ]
};

const DEFAULT_TERMS: GlossaryItem[] = [
  { term: 'MTBF', definition: 'Mean Time Between Failures. Average time between system breakdowns.', category: 'General' },
  { term: 'Availability', definition: 'Percentage of time the system is operational (Uptime / Total Time).', category: 'General' },
];

const ContextGlossary: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const getContext = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('weibull')) return 'weibull';
    if (path.includes('fmea')) return 'fmea';
    if (path.includes('rbd')) return 'rbd';
    if (path.includes('growth')) return 'growth';
    return 'default';
  };

  const context = getContext();
  const contextTerms = GLOSSARY_DATA[context] || [];
  const allDisplayTerms = [...contextTerms, ...DEFAULT_TERMS];

  const filteredTerms = allDisplayTerms.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <Book className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700">
          Reliability Glossary
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 z-[100] bg-white dark:bg-slate-900 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <Book className="w-5 h-5 text-cyan-500" />
          <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Glossary</h2>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {context !== 'default' && searchTerm === '' && (
          <div className="mb-6">
            <h3 className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              Active Context: {context}
            </h3>
          </div>
        )}

        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => (
            <div key={idx} className="group p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                  {item.term}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full uppercase">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <Search className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">No matches found</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          Powered by Reliability Engine
        </p>
      </div>
    </div>
  );
};

export default ContextGlossary;
