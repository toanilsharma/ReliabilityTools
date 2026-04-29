import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Activity, 
  Briefcase, 
  Calculator, 
  ArrowRight, 
  Filter,
  Zap,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TOOLS } from '../constants';
import { IconMap, getThemeClasses } from '../utils/themeHelper';
import SEO from '../components/SEO';

const AllTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Calculator', 'Analysis', 'Planning'];

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <SEO 
        title="Reliability Engineering Tools Directory | Free Online Calculators"
        description="Comprehensive directory of 28 free reliability engineering tools. MTBF, Weibull, FMEA, OEE, LCC, and more for maintenance professionals and students."
        keywords="reliability tools directory, engineering calculators, MTBF calculator, Weibull analysis, FMEA tool, OEE calculator"
      />

      {/* Header Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Layers className="w-3 h-3" /> Professional Toolset
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Reliability Engineering <span className="text-cyan-600 dark:text-cyan-400">Directory</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Access 28 professional-grade calculators for industrial maintenance, asset management, and statistical failure analysis.
          </p>

          {/* Search and Filter Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search tools, formulas, or categories..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-600" /> 
            {activeCategory === 'All' ? 'All Calculators' : `${activeCategory} Tools`}
            <span className="ml-2 text-sm font-normal text-slate-500">({filteredTools.length} tools found)</span>
          </h2>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              let IconComponent = tool.iconName && IconMap[tool.iconName] ? IconMap[tool.iconName] : null;
              if (!IconComponent) {
                IconComponent = tool.category === 'Analysis' ? Activity :
                                tool.category === 'Planning' ? Briefcase : Calculator;
              }
              const theme = getThemeClasses(tool.colorTheme, tool.category);

              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className={`group flex flex-col p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}
                >
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${theme.icon} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors`}>
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Launch Tool</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Subtle Background Glow */}
                  <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-cyan-500`}></div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found matching your search</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-6 text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Zap className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-extrabold mb-4 italic">Need a Custom Tool?</h2>
            <p className="text-cyan-100 text-lg mb-8 leading-relaxed">
              We are constantly expanding our library. If you need a specific reliability calculator or engineering template, let us know and we'll build it for you.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-900 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-lg"
            >
              Request a Calculator <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllTools;
