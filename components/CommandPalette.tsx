import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calculator, BookOpen, ChevronRight, Activity, Briefcase } from 'lucide-react';
import { TOOLS, ARTICLES } from '../constants';
import { IconMap, getThemeClasses } from '../utils/themeHelper';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery(''); // Reset query on close
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const lowerQuery = query.toLowerCase();
  
  const filteredTools = TOOLS.filter(
    tool => tool.name.toLowerCase().includes(lowerQuery) || tool.description.toLowerCase().includes(lowerQuery)
  );
  
  const filteredArticles = ARTICLES.filter(
    article => article.title.toLowerCase().includes(lowerQuery) || article.summary.toLowerCase().includes(lowerQuery)
  );

  const hasResults = filteredTools.length > 0 || filteredArticles.length > 0;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Palette Modal */}
      <div 
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Area */}
        <div className="relative flex items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 absolute left-6" />
          <input
            ref={inputRef}
            type="text"
            className="w-full pl-10 pr-10 py-3 bg-transparent text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            placeholder="Search tools, articles, calculators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 flex-grow custom-scrollbar">
          {!hasResults && query && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p>No results found for "{query}"</p>
            </div>
          )}

          {query === '' && (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Quick Navigation</div>
          )}

          {filteredTools.length > 0 && (
            <div className="mb-6">
              {query && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Tools & Calculators</div>}
              <div className="space-y-1">
                {filteredTools.map(tool => {
                  const IconComponent = tool.iconName ? IconMap[tool.iconName] : (
                    tool.category === 'Analysis' ? Activity :
                    tool.category === 'Planning' ? Briefcase : Calculator
                  );
                  
                  // Adjust color classes to be slightly smaller padded for the palette list
                  const theme = getThemeClasses(tool.colorTheme, tool.category);
                  const bgAndTextColors = theme.icon;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNavigate(tool.path)}
                      className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${bgAndTextColors}`}>
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{tool.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{tool.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredArticles.length > 0 && (
            <div>
              {query && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Learning Articles</div>}
              <div className="space-y-1">
                {filteredArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => handleNavigate(`/learning/${article.id}`)}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors"
                  >
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-slate-900 dark:text-white">{article.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{article.summary}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
          <div>Use <kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">Esc</kbd> to close</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">{filteredTools.length + filteredArticles.length}</span> results</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
