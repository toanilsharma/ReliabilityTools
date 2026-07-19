import React, { useState } from 'react';
import { Gamepad2, Cpu, ExternalLink, Zap, ShieldCheck, HelpCircle, Activity, CheckCircle2, Shield } from 'lucide-react';
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
}

const INTERACTIVE_ITEMS: InteractiveItem[] = [
  {
    id: 'safety-swipe',
    title: 'Safety Swipe',
    type: 'game',
    typeLabel: 'Electrical Safety Game',
    description: 'A rapid hazard-recognition game designed to train workers on electrical safety protocols, PPE selection, and lockout-tagout (LOTO) rules.',
    url: 'https://safetyswipe.netlify.app',
    buttonLabel: 'Play Safety Swipe',
    features: [
      'Visual hazard recognition training',
      'Real-time safety decision feedback',
      'Lockout-Tagout (LOTO) compliance testing',
      'Risk-free emergency decision sandbox'
    ],
    usefulness: 'Replaces passive slideshows with active hazard-swipe mechanics. Operators learn to identify ground faults, check insulation, and select PPE in split seconds, increasing compliance retention by over 70% and minimizing real-world field errors.',
    icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    badgeColor: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/30'
  },
  {
    id: 'ups-simulator',
    title: 'Industrial UPS Simulator',
    type: 'simulator',
    typeLabel: 'Power Grid Simulator',
    description: 'An interactive mathematical simulation modeling industrial Uninterruptible Power Supply (UPS) behaviors, bypass switches, and load flows.',
    url: 'https://upslab.netlify.app',
    buttonLabel: 'Launch UPS Simulator',
    features: [
      'Dynamic bypass & load switching',
      'Mains power utility failure simulation',
      'Battery state-of-charge discharge curves',
      'Critical control logic visualization'
    ],
    usefulness: 'Allows engineers and control room operators to simulate grid failure events, test bypass transfer speeds, and study battery capacities under varying loads - building operator muscle memory without risking plant shutdowns or system damage.',
    icon: <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/30'
  },
  {
    id: 'relay-school',
    title: 'Relay School',
    type: 'simulator',
    typeLabel: 'Protection Relay Training',
    description: 'An interactive learning platform for electrical protection engineers to understand relay principles, protection schemes, relay coordination, testing procedures, fault analysis, and industry best practices through practical simulations and visual demonstrations.',
    url: 'https://relayschool.netlify.app',
    buttonLabel: 'Launch Relay School',
    features: [
      'Distance, Differential, Overcurrent and Earth Fault relay simulations',
      'Relay coordination visualization',
      'Protection scheme tutorials',
      'Fault scenario simulations',
      'Interactive learning modules'
    ],
    usefulness: '• Learn numerical and electromechanical relay concepts\n• Practice relay coordination studies\n• Understand protection logic and fault clearing\n• Improve troubleshooting and commissioning skills',
    icon: <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/30'
  }
];

const InteractiveHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'game' | 'simulator'>('all');

  const filteredItems = INTERACTIVE_ITEMS.filter(item => 
    activeTab === 'all' ? true : item.type === activeTab
  );

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
    <div className="max-w-7xl mx-auto space-y-12 pb-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <SEO 
        title="Interactive Simulators & Safety Games" 
        description="Learn reliability engineering and electrical safety protocols through interactive games and simulator tools. Hands-on learning without real-world risks."
        schema={schema}
      />

      {/* Header Banner */}
      <div className="relative text-center py-12 bg-gradient-to-b from-cyan-50/50 to-white dark:from-slate-900 dark:to-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"></div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Gamepad2 className="w-9 h-9 md:w-11 md:h-11 text-cyan-600 dark:text-cyan-400" />
          Interactive Hub
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
          Risk-free virtual environments to test field operations, practice electrical safety protocols, and simulate industrial electrical equipment.
        </p>
      </div>

      {/* Tab filter and Intro Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            All Interactive Tools
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'game' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Safety Games
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'simulator' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Industrial Simulators
          </button>
        </div>

        {/* Commercial Purpose Summary */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Certified Interactive Labs
        </div>
      </div>

      {/* Main Items Listing */}
      <h2 className="sr-only">Interactive Simulators and Safety Games</h2>
      <div className="space-y-8">
        {filteredItems.map((item) => {
          // Color-coded button classes based on type (Amber/Yellow for safety game, Cyan for simulator)
          const buttonClass = item.type === 'game'
            ? 'bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-amber-500/10 hover:shadow-amber-500/20 focus:ring-amber-500'
            : 'bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600 shadow-cyan-500/10 hover:shadow-cyan-500/20 focus:ring-cyan-500';

          return (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 space-y-6"
            >
              {/* Card Header (Title & Button at the top, side-by-side, no scroll) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {item.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${item.badgeColor}`}>
                        {item.typeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Launch Button: Compact, Color-coded, Top-Right, Above Fold */}
                <div className="shrink-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-xs uppercase tracking-wider focus:outline-none w-full sm:w-auto ${buttonClass}`}
                  >
                    {item.buttonLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Card Body (Detailed Info) */}
              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                {/* Left Side: Short Description */}
                <div className="lg:col-span-2 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Description
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Right Side: Purpose & Capabilities */}
                <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                  {/* Purpose / Usefulness */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-cyan-500" />
                      Industrial Value
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                      {item.usefulness}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Capabilities
                    </h4>
                    <div className="space-y-2">
                      {item.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No interactive items match the selected category.
          </div>
        )}
      </div>

      {/* Extensibility placeholder */}
      <section className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-8 border border-dashed border-slate-300 dark:border-slate-800 text-center">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Are you developing educational simulators?</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          We periodically upgrade this directory with new compliance games and power grid calculators. Reach out via our contact page to request additions.
        </p>
      </section>
    </div>
  );
};

export default InteractiveHub;
