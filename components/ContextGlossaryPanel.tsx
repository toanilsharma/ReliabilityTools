import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { GLOSSARY_TERMS } from '../constants';

const KEYWORDS_BY_PATH: Array<{ includes: string; keywords: string[] }> = [
  { includes: 'weibull', keywords: ['Weibull', 'Beta', 'B10'] },
  { includes: 'sil', keywords: ['SIL', 'PFD', 'ALARP'] },
  { includes: 'fmea', keywords: ['FMEA', 'RPN'] },
  { includes: 'rbd', keywords: ['RBD', 'Reliability'] },
  { includes: 'availability', keywords: ['Availability', 'MTBF', 'MTTR'] },
  { includes: 'mtbf', keywords: ['MTBF', 'Failure Rate'] },
  { includes: 'mttr', keywords: ['MTTR', 'Maintainability'] },
];

const ContextGlossaryPanel: React.FC = () => {
  const location = useLocation();
  const [search, setSearch] = useState('');

  const keywords = useMemo(() => {
    const match = KEYWORDS_BY_PATH.find((p) => location.pathname.toLowerCase().includes(p.includes));
    return match?.keywords ?? ['Reliability', 'Availability', 'MTBF', 'MTTR'];
  }, [location.pathname]);

  const relevantTerms = useMemo(() => {
    const selected = GLOSSARY_TERMS.filter((term) =>
      keywords.some((k) => term.term.toLowerCase().includes(k.toLowerCase()) || term.definition.toLowerCase().includes(k.toLowerCase())),
    );

    const q = search.trim().toLowerCase();
    const filtered = q
      ? selected.filter((term) => term.term.toLowerCase().includes(q) || term.definition.toLowerCase().includes(q))
      : selected;

    return filtered.slice(0, 6);
  }, [keywords, search]);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50">
      <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Relevant Glossary
      </h3>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms"
          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="space-y-3">
        {relevantTerms.length > 0 ? (
          relevantTerms.map((term) => (
            <div key={term.term} className="bg-white dark:bg-slate-900/70 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{term.term}</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-3">{term.definition}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500">No matching terms for this tool.</p>
        )}
      </div>

      <Link to="/reliability-engineering-glossary" className="mt-4 inline-block text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500">
        Open full glossary
      </Link>
    </div>
  );
};

export default ContextGlossaryPanel;
