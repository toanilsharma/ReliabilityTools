import React, { useState } from 'react';
import { Gamepad2, Cpu, ExternalLink, Zap, ShieldCheck, HelpCircle, Activity, CheckCircle2, Shield, Flame, Search, Info, X, Sparkles, Layers } from 'lucide-react';
import SEO from '../components/SEO';

interface InteractiveItem {
  id: string;
  title: string;
  type: 'game' | 'simulator';
  typeLabel: string;
  description: string;
  url: string;
  buttonLabel: string;
  features: string[];
  usefulness: string;
  icon: React.ReactNode;
  badgeColor: string;
  accentGradient: string;
  tags: string[];
}

const INTERACTIVE_ITEMS: InteractiveItem[] = [
  {
    id: 'safety-swipe',
    title: 'Safety Swipe',
    type: 'game',
    typeLabel: 'Electrical Safety Game',
    description: 'Rapid hazard-recognition game training workers on electrical safety protocols, PPE selection, and LOTO compliance.',
    url: 'https://safetyswipe.netlify.app',
    buttonLabel: 'Play Safety Swipe',
    features: [
      'Visual hazard recognition training',
      'Real-time safety decision feedback',
      'Lockout-Tagout (LOTO) compliance testing',
      'Risk-free emergency decision sandbox'
    ],
    usefulness: 'Replaces passive slideshows with active hazard-swipe mechanics. Operators learn to identify ground faults, check insulation, and select PPE in split seconds, increasing compliance retention by over 70%.',
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    accentGradient: 'from-amber-500 to-orange-600',
    tags: ['LOTO Rules', 'PPE Selection', 'Hazard Swipe', 'OSHA Compliance']
  },
  {
    id: 'electrolive',
    title: 'ElectroLive Simulator',
    type: 'simulator',
    typeLabel: 'Electrical Hazard Simulator',
    description: 'Interactive electrical hazard simulation platform visualizing live electrical failure modes and safety compliance protocols.',
    url: 'https://electrolive.netlify.app',
    buttonLabel: 'Launch ElectroLive',
    features: [
      'Live electrical hazard & failure mode simulation',
      'IEC, IEEE, OSHA & NFPA compliance guidelines',
      'Role-based scenarios (Electrician, Supervisor, Amateur)',
      'Interactive hazard matrices & safety oversight training'
    ],
    usefulness: 'Provides plant operators, safety supervisors, and technicians with a risk-free virtual environment to experience electrical hazards, internalize safety protocols, and understand critical hazard factors.',
    icon: <Activity className="w-5 h-5 text-emerald-500" />,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    accentGradient: 'from-emerald-500 to-teal-600',
    tags: ['Live Hazards', 'IEEE / NFPA', 'Multi-Role', 'Failure Modes']
  },
  {
    id: 'arc-flash-explorer',
    title: 'Arc Flash Explorer',
    type: 'simulator',
    typeLabel: 'Arc Flash & PPE Simulator',
    description: 'Comprehensive interactive guide and boundary calculator for mastering arc flash safety, NFPA 70E compliance, and IEEE 1584.',
    url: 'https://arcflashinfo.netlify.app',
    buttonLabel: 'Launch Arc Flash',
    features: [
      'Arc Flash & approach boundary calculations (IEEE 1584)',
      'Dynamic incident energy & PPE category selector',
      'Hierarchy of Controls & Safety Pyramid framework',
      'Interactive arc flash knowledge quiz & safety checklist'
    ],
    usefulness: 'Helps electrical engineers and safety personnel visualize thermal burn and shock boundaries, select proper arc-rated PPE, and enforce NFPA 70E safety distances to prevent catastrophic accidents.',
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    accentGradient: 'from-orange-500 to-red-600',
    tags: ['IEEE 1584', 'NFPA 70E', 'PPE Category', 'Boundary Calc']
  },
  {
    id: 'ups-simulator',
    title: 'Industrial UPS Lab',
    type: 'simulator',
    typeLabel: 'Power Grid Simulator',
    description: 'Mathematical simulation modeling industrial Uninterruptible Power Supply (UPS) behaviors, bypass switches, and load flows.',
    url: 'https://upslab.netlify.app',
    buttonLabel: 'Launch UPS Lab',
    features: [
      'Dynamic bypass & load switching',
      'Mains power utility failure simulation',
      'Battery state-of-charge discharge curves',
      'Critical control logic visualization'
    ],
    usefulness: 'Allows engineers and control room operators to simulate grid failure events, test bypass transfer speeds, and study battery capacities under varying loads - building operator muscle memory.',
    icon: <Cpu className="w-5 h-5 text-cyan-500" />,
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    accentGradient: 'from-cyan-500 to-blue-600',
    tags: ['UPS Bypass', 'Grid Failure', 'Battery Curves', 'Load Transfer']
  },
  {
    id: 'relay-school',
    title: 'Relay School',
    type: 'simulator',
    typeLabel: 'Protection Relay Training',
    description: 'Interactive learning platform for electrical protection engineers to understand relay principles, coordination, and fault testing.',
    url: 'https://relayschool.netlify.app',
    buttonLabel: 'Launch Relay School',
    features: [
      'Distance, Differential, Overcurrent and Earth Fault relay simulations',
      'Relay coordination visualization',
      'Protection scheme tutorials',
      'Fault scenario simulations',
      'Interactive learning modules'
    ],
    usefulness: 'Learn numerical and electromechanical relay concepts, practice relay coordination studies, understand protection logic and fault clearing, and improve troubleshooting skills.',
    icon: <Shield className="w-5 h-5 text-indigo-500" />,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    accentGradient: 'from-indigo-500 to-purple-600',
    tags: ['Overcurrent', 'Earth Fault', 'Coordination', 'Fault Clearing']
  }
];

const InteractiveHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'game' | 'simulator'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalItem, setSelectedModalItem] = useState<InteractiveItem | null>(null);

  const filteredItems = INTERACTIVE_ITEMS.filter(item => {
    const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Industrial Simulators & Electrical Safety Games",
    "description": "Interactive simulators and gamified training tools for electrical safety and reliability engineering. Risk-free simulation for plant operators and students.",
    "publisher": {
      "@type": "Organization",
      "name": "Reliability Tools"
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <SEO 
        title="Interactive Simulators & Safety Games" 
        description="Learn reliability engineering and electrical safety protocols through interactive games and simulator tools. Hands-on learning without real-world risks."
        schema={schema}
      />

      {/* Commercial Hero Section - Compact & High-Impact */}
      <div className="relative py-6 px-6 sm:px-8 bg-slate-900 rounded-3xl border border-slate-800 text-white shadow-xl overflow-hidden">
        {/* Glow & Grid Accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Certified Virtual Engineering Labs
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 shrink-0" />
              Interactive Safety & Simulator Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Risk-free virtual environments for field technicians, safety supervisors, and reliability engineers.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 backdrop-blur-md">
            <div className="text-center px-3 border-r border-slate-700">
              <div className="text-xl font-black text-cyan-400">5</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Labs</div>
            </div>
            <div className="text-center px-3 border-r border-slate-700">
              <div className="text-xl font-black text-emerald-400">100%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Free Access</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-black text-amber-400">Zero</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Field Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Control Bar: Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            All Labs ({INTERACTIVE_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'game' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Safety Games ({INTERACTIVE_ITEMS.filter(i => i.type === 'game').length})
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'simulator' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Simulators ({INTERACTIVE_ITEMS.filter(i => i.type === 'simulator').length})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search simulators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* All Tools Visible Grid (3-Column Commercial Layout - Fits Above Fold!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Subtle Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentGradient}`}></div>

              <div className="space-y-3.5">
                {/* Header Row: Icon + Type Badge + Pulse Indicator */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${item.badgeColor}`}>
                      {item.typeLabel}
                    </span>
                  </div>

                  {/* Live Status Pulse */}
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE LAB
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                  {item.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-semibold border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-xs uppercase tracking-wider bg-gradient-to-r ${item.accentGradient} focus:outline-none`}
                >
                  {item.buttonLabel}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedModalItem(item)}
                  title="View Specs & Details"
                  className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium">
          No interactive tools match your search criteria.
        </div>
      )}

      {/* Commercial Trust & Extensibility Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Verified Industrial & Educational Compliance
            </h4>
            <p className="text-xs text-slate-400">
              All tools run entirely in your web browser with zero server data storage or installation requirements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Updated Monthly</span>
        </div>
      </div>

      {/* Feature Specs Modal / Slide Drawer */}
      {selectedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedModalItem(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                {selectedModalItem.icon}
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${selectedModalItem.badgeColor} mb-1`}>
                  {selectedModalItem.typeLabel}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {selectedModalItem.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Overview</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {selectedModalItem.description}
              </p>
            </div>

            {/* Capabilities */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Key Capabilities</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {selectedModalItem.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industrial Value */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
                Industrial & Safety Value
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {selectedModalItem.usefulness}
              </p>
            </div>

            {/* Modal Launch Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedModalItem(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
              <a
                href={selectedModalItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-xl text-xs uppercase tracking-wider bg-gradient-to-r ${selectedModalItem.accentGradient} shadow-md hover:shadow-lg transition-all`}
              >
                {selectedModalItem.buttonLabel}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveHub;

