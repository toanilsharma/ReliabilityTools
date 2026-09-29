import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Activity, 
  Target, 
  Layers, 
  BookOpen, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export const ReliabilityFundamentals: React.FC = () => {
  // Interactive Sandbox State
  const [missionHours, setMissionHours] = useState<number>(2160); // 90 days
  const [mtbfHours, setMtbfHours] = useState<number>(7300);
  const [hasRedundancy, setHasRedundancy] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'standards' | 'formulas' | 'steps' | 'rams'>('standards');

  // Math Calculations
  const lambda = mtbfHours > 0 ? 1 / mtbfHours : 0;
  const singleReliability = mtbfHours > 0 ? Math.exp(-lambda * missionHours) : 0;
  const singleRelPercent = Math.min(100, Math.max(0, singleReliability * 100));
  const unreliabilityPercent = 100 - singleRelPercent;
  
  // Parallel active redundancy (1-out-of-2)
  const parallelReliability = 1 - Math.pow(1 - singleReliability, 2);
  const parallelRelPercent = Math.min(100, Math.max(0, parallelReliability * 100));

  const effectiveReliability = hasRedundancy ? parallelRelPercent : singleRelPercent;

  const STANDARDS_LIST = [
    {
      code: 'ISO 14224',
      org: 'International Organization for Standardization',
      title: 'Reliability & Maintenance Data Collection',
      badge: 'Data & Taxonomy',
      desc: 'The global benchmark in petroleum, process, and manufacturing industries. Defines standard equipment taxonomies, boundary definitions, failure modes, and operating time logging rules.'
    },
    {
      code: 'IEC 60050-192',
      org: 'International Electrotechnical Commission',
      title: 'Vocabulary: Dependability (IEV 192)',
      badge: 'Core Definition',
      desc: 'The official international definition of Reliability, Availability, Maintainability, and Safety (RAMS). Establishes standardized terminology for engineering contracts.'
    },
    {
      code: 'IEC 61508 / 61511',
      org: 'International Electrotechnical Commission',
      title: 'Functional Safety & SIL Determination',
      badge: 'Safety Critical',
      desc: 'Mandates probability of failure on demand (PFDavg) and Safety Integrity Levels (SIL 1 to SIL 4) for safety instrumented systems protecting human life and the environment.'
    },
    {
      code: 'IEEE Std 493',
      org: 'IEEE ("Gold Book")',
      title: 'Industrial & Commercial Power System Reliability',
      badge: 'Electrical',
      desc: 'The universally recognized authority for electrical power system reliability data, circuit breaker failure rates, transformer MTBFs, and outage cost estimation.'
    },
    {
      code: 'MIL-HDBK-217F',
      org: 'US Dept of Defense / Telcordia SR-332',
      title: 'Electronic Reliability Prediction',
      badge: 'Electronics',
      desc: 'Parts-count and part-stress failure rate models accounting for operating temperature, electrical stress, and environmental quality factors.'
    },
    {
      code: 'SAE JA1011 / JA1012',
      org: 'Society of Automotive Engineers',
      title: 'Reliability-Centered Maintenance (RCM)',
      badge: 'Maintenance',
      desc: 'Sets the 7 strict evaluation criteria that any maintenance strategy must satisfy to legally qualify as true Reliability-Centered Maintenance.'
    }
  ];

  return (
    <section className="relative py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,#0284c70d,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-200 dark:border-cyan-800">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Approved International Engineering Standards
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Reliability</span>?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            In engineering, reliability is not an abstract concept or subjective rating. It is a strictly governed mathematical probability defined by international consensus bodies.
          </p>
        </div>

        {/* The Formal International Standard Definition Box */}
        <div className="mb-16 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> IEC 60050-192 / ISO 14224 / IEEE 493 Consensus Definition
              </span>
              <blockquote className="text-xl sm:text-2xl font-serif italic text-slate-900 dark:text-slate-100 leading-snug">
                &ldquo;Reliability is the probability that an item will perform a required function without failure under stated operating conditions for a specified period of time.&rdquo;
              </blockquote>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If an equipment specification omits any of these four elements, it is mathematically invalid. An asset cannot simply be &ldquo;reliable&rdquo;—it can only have a defined probability of surviving a defined duration under specific operating stresses.
              </p>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto">
              <Link 
                to="/learning/what-is-reliability-engineering-guide/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02]"
              >
                Read Complete Master Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The 4 Mandatory Pillars Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-xs">1</span>
                Probability (R)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A number between 0 and 1 (0% to 100%). Reliability is never an absolute guarantee; it quantifies statistical survival confidence.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs">2</span>
                Required Function
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Exact threshold defining operational success (e.g. delivering ≥ 150 m³/h at 6 bar discharge pressure without exceeding 4.5 mm/s RMS vibration).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs">3</span>
                Stated Conditions
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Operating environment: temperature, load cycles, voltage stability, and ISO 4406 oil cleanliness. Altering conditions alters reliability.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs">4</span>
                Mission Time (t)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Reliability is strictly time-dependent: R(t). Specifying mission duration (e.g. 720 hours or 8,760 hours) is mathematically essential.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Deep Dive Elements */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'standards'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-500" /> Approved Standards
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'formulas'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-500" /> Governing Formulas
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'steps'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5-Step Calculation
          </button>

          <button
            onClick={() => setActiveTab('rams')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'rams'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-500" /> RAMS Framework
          </button>
        </div>

        {/* Tab 1: Approved Standards Grid */}
        {activeTab === 'standards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {STANDARDS_LIST.map((std, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-base text-cyan-600 dark:text-cyan-400">{std.code}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {std.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{std.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">{std.org}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{std.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Enforced Globally</span>
                  <Link to="/faq/" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Learn more</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Governing Formulas */}
        {activeTab === 'formulas' && (
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Constant Failure Rate (Useful Life)</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3">Exponential Reliability</h3>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-slate-900 dark:text-cyan-300 font-bold text-base mb-4 border border-slate-200 dark:border-slate-700">
                  R(t) = e^(-t / MTBF) = e^(-λt)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
                  Applies during the flat middle of the Bathtub Curve where failures occur at a constant random rate (λ = const). 
                </p>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                  <strong>The 36.8% Rule:</strong> At t = MTBF, R(t) = e⁻¹ ≈ 36.8%. Over 63.2% of assets fail before reaching their MTBF!
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/tools/mtbf/" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Open MTBF Calculator <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Aging & Wear-Out Physics</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3">2-Parameter Weibull</h3>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-slate-900 dark:text-blue-300 font-bold text-base mb-4 border border-slate-200 dark:border-slate-700">
                  R(t) = e^(-(t / η)^β)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Models variable hazard rates under IEC 61649. Shape parameter β dictates the physical failure mechanism:
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong>β &lt; 1:</strong> Infant mortality (early manufacturing defects)</li>
                  <li><strong>β = 1:</strong> Constant random failure rate (exponential)</li>
                  <li><strong>β &gt; 1:</strong> Mechanical wear-out, fatigue, and aging</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/tools/weibull/" className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Open Weibull Tool <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Network Topology</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3">System Redundancy</h3>
                <div className="space-y-2 mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg font-mono text-center text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    Series: R_sys = &prod; R_i
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg font-mono text-center text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    Parallel: R_sys = 1 - &prod; (1 - R_i)
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  In a <strong>series</strong> system, any single component trip stops the line. In an <strong>active parallel</strong> setup, the system functions as long as at least one redundant path survives.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/tools/rbd/" className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Open Reliability Block Diagram (RBD) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 5-Step Calculation Roadmap */}
        {activeTab === 'steps' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <span className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm flex items-center justify-center mb-3">1</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Define Mission Time (t)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Establish the required uninterrupted operational duration (e.g. 720 hours for a monthly run, 8,760 hours for annual baseload).
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center mb-3">2</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Collect ISO 14224 Data</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Extract total operating hours (T) and unscheduled inherent breakdowns (r), filtering out planned outages and operator mistakes.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm flex items-center justify-center mb-3">3</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Compute Failure Rate (λ) &amp; MTBF</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculate failure rate: λ = r / T. Compute Mean Time Between Failures: MTBF = 1 / λ = T / r.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 font-extrabold text-sm flex items-center justify-center mb-3">4</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Calculate Reliability R(t)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Evaluate R(t) = e^(-λt). Compute Unreliability F(t) = 1 - R(t) to assess the probability of mission failure.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center mb-3">5</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Apply Mitigation &amp; RBD</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  If survival confidence fails target SLA, install active parallel redundancy (1 - (1-R)²) or optimize condition monitoring (PdM).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: RAMS Framework */}
        {activeTab === 'rams' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">The RAMS Hierarchy (IEC 60050-192 / EN 50126)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Never confuse Reliability with Availability or Maintainability. They govern distinct facets of asset dependability:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-400">R: Reliability</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">Survival Probability R(t)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Will the asset complete the specified mission duration without stopping?</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">A: Availability</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">Uptime Percentage (A)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Is the equipment ready to perform when called upon? A = MTBF / (MTBF + MTTR).</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">M: Maintainability</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">Repair Velocity M(t)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">How rapidly can technicians diagnose and restore the asset? M(t) = 1 - e^(-t/MTTR).</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-red-600 dark:text-red-400">S: Safety &amp; Integrity</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">Hazard Containment (SIL)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">When failures occur, does the system fail safely without harming people or the environment?</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Interactive Calculation Sandbox */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/40 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Reliability Calculation Sandbox</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Test how mission duration and MTBF govern survival probability in real-time.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Input 1 */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Target Mission Time (t in Hours)
              </label>
              <input
                type="number"
                min="1"
                value={missionHours}
                onChange={(e) => setMissionHours(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">e.g., 2,160 hrs (90-day campaign)</span>
            </div>

            {/* Input 2 */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Component MTBF (Hours)
              </label>
              <input
                type="number"
                min="1"
                value={mtbfHours}
                onChange={(e) => setMtbfHours(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Hourly failure rate (λ): {(lambda * 1000).toFixed(4)} failures/1,000 hrs</span>
            </div>

            {/* Redundancy Toggle */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Active Redundancy?</span>
                <button
                  type="button"
                  onClick={() => setHasRedundancy(!hasRedundancy)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    hasRedundancy ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasRedundancy ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {hasRedundancy ? 'Enabled: 1-out-of-2 Active Parallel Standby' : 'Disabled: Single asset (Series dependency)'}
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Calculated Reliability R(t)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-300 mt-1">
                {effectiveReliability.toFixed(2)}%
              </div>
              <span className="text-[11px] text-cyan-700/80 dark:text-cyan-400/80 block mt-1">
                Probability of unfailed operation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Unreliability Risk F(t)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-300 mt-1">
                {(100 - effectiveReliability).toFixed(2)}%
              </div>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 block mt-1">
                Probability of breakdown before mission time t
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Engineering Assessment
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {effectiveReliability >= 95
                    ? 'Excellent: Meets world-class industrial mission targets.'
                    : effectiveReliability >= 80
                    ? 'Moderate: Suitable for non-critical assets; monitor with PdM.'
                    : 'High Risk: Redundancy or interval reduction recommended.'}
                </p>
              </div>
              <Link 
                to="/tools/mtbf/"
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-2 hover:underline inline-flex items-center gap-1"
              >
                Detailed Analysis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReliabilityFundamentals;
