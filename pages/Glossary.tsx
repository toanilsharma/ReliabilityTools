
import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../constants';
import { Search, Book } from 'lucide-react';

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Reliability Engineering Glossary</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Master the terminology. A curated list of essential terms for students and reliability professionals.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-shadow shadow-sm"
          placeholder="Search terms (e.g. Beta, MTBF)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Book className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  {item.term}
                </h3>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs rounded-full font-medium uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No terms found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
