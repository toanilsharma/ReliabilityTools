
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceArea, 
  Label,
  AreaChart,
  Area
} from 'recharts';
import { 
  BookOpen, 
  Anchor, 
  TrendingUp, 
  AlertTriangle, 
  Rocket, 
  Activity, 
  ChevronRight, 
  Hash, 
  Cpu, 
  ArrowRight,
  Library
} from 'lucide-react';
import SEO from '../components/SEO';

const KnowledgeHub: React.FC = () => {
  
  useEffect(() => {
    document.title = "Reliability Engineering Knowledge Hub | History, Theory & Standards";
  }, []);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Reliability Engineering Knowledge Hub",
    "description": "Master the basics of Reliability Engineering. Learn about the Bathtub Curve, P-F Interval, and perform Weibull Analysis with our free tools.",
    "author": {
      "@type": "Organization",
      "name": "Reliability Tools"
    }
  };

  // Data for Bathtub Curve
  const bathtubData = [
    { t: 0, r: 8 }, { t: 5, r: 4 }, { t: 10, r: 2.5 }, { t: 15, r: 1.5 }, 
    { t: 20, r: 1 }, { t: 30, r: 1 }, { t: 40, r: 1 }, { t: 50, r: 1 }, 
    { t: 60, r: 1 }, { t: 70, r: 1.2 }, { t: 80, r: 2 }, { t: 90, r: 4 }, { t: 100, r: 9 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEO schema={pageSchema} />
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
            <BookOpen className="w-4 h-4" /> Educational Resource
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            The Reliability <span className="text-blue-500">Knowledge Hub</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            From the V-2 Rocket to modern predictive analytics. Master the history, mathematics, and lessons learned that define our industry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Table of Contents</h3>
                <nav className="space-y-1 border-l-2 border-slate-200 dark:border-slate-800">
                  <a href="#history" className="block pl-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-l-2 hover:-ml-[2px] border-transparent hover:border-blue-600 transition-all">
                    1. History & Origins
                  </a>
                  <a href="#theory" className="block pl-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-l-2 hover:-ml-[2px] border-transparent hover:border-blue-600 transition-all">
                    2. The Bathtub Curve
                  </a>
                  <a href="#pf-interval" className="block pl-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-l-2 hover:-ml-[2px] border-transparent hover:border-blue-600 transition-all">
                    3. The P-F Interval
                  </a>
                  <a href="#cases" className="block pl-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-l-2 hover:-ml-[2px] border-transparent hover:border-blue-600 transition-all">
                    4. Case Studies
                  </a>
                  <a href="#modern" className="block pl-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-l-2 hover:-ml-[2px] border-transparent hover:border-blue-600 transition-all">
                    5. Modern Era (PdM)
                  </a>
                </nav>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-2">Did you know?</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  The term "Reliability Engineering" was coined in the 1950s by the US Military's AGREE task force.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-20">
            
            {/* SECTION A: HISTORY */}
            <section id="history" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                  <Rocket className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">From Rockets to Electronics</h2>
              </div>
              
              <article className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-serif leading-8">
                <p className="mb-6 text-xl text-slate-600 dark:text-slate-400 font-sans font-light">
                  Reliability engineering wasn't born in a classroom. It was born on the launchpads of World War II, out of necessity and failure.
                </p>
                <p className="mb-6">
                  In the early 1940s, Wernher von Braun and his team were developing the <strong>V-2 Rocket</strong>. 
                  Initially, these rockets were a disaster. Despite using high-quality components, the majority of the rockets exploded on the pad or failed mid-flight. 
                  Engineers were baffled. If every single part was 99% reliable, why did the system fail so often?
                </p>
                <div className="my-8 p-6 bg-white dark:bg-slate-800 border-l-4 border-blue-600 rounded-r-xl shadow-sm font-sans not-italic">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lusser's Law</h4>
                  <p className="text-base text-slate-600 dark:text-slate-400">
                    Mathematician Robert Lusser proposed a groundbreaking concept: 
                    <span className="block my-3 font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded text-center text-blue-700 dark:text-blue-400">
                      R<sub>system</sub> = R<sub>1</sub> × R<sub>2</sub> × ... × R<sub>n</sub>
                    </span>
                    The reliability of a series system is the <em>product</em> of its component reliabilities. You can model this using our <Link to="/tools/rbd" className="text-blue-600 hover:underline font-bold">RBD Calculator</Link>.
                  </p>
                  <div className="mt-6">
                    <Link to="/tools/rbd" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
                      Calculate System Reliability Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <p className="mb-6">
                  Think about the math. A V-2 rocket had roughly 2,000 critical components. If each component is 99% reliable (which sounds good), the total system reliability is:
                  <br/>
                  <span className="font-mono text-sm bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">0.99<sup>2000</sup> ≈ 0.000000002</span>
                </p>
                <p>
                  This realization changed engineering forever. It proved that complex systems require exponentially higher component quality to function. 
                  This led to the 1952 <strong>AGREE Report</strong> (Advisory Group on Reliability of Electronic Equipment) by the US Department of Defense, 
                  which standardized the definitions of reliability and <Link to="/tools/mtbf" className="text-blue-600 hover:underline font-bold">MTBF</Link> we use today.
                </p>
              </article>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* SECTION B: CORE THEORY */}
            <section id="theory" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Core Theory: The Math of Failure</h2>
              </div>

              <div className="space-y-16">
                {/* Bathtub Curve */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">The Bathtub Curve</h3>
                    <p className="text-sm text-slate-500">Hazard Rate λ(t) over time</p>
                  </div>
                  
                  <div className="h-80 w-full p-4 bg-slate-50 dark:bg-slate-900/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bathtubData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="t" hide />
                        <YAxis hide />
                        <Tooltip content={() => null} />
                        
                        {/* Zones */}
                        <ReferenceArea x1={0} x2={20} fill="#ef4444" fillOpacity={0.08} />
                        <ReferenceArea x1={20} x2={70} fill="#10b981" fillOpacity={0.08} />
                        <ReferenceArea x1={70} x2={100} fill="#f59e0b" fillOpacity={0.08} />

                        {/* Labels - Hidden on small screens to prevent overlap */}
                        <Label value="Infant Mortality" position="insideTopLeft" offset={20} className="fill-red-600 dark:fill-red-400 text-xs font-bold uppercase hidden sm:block" />
                        <Label value="Useful Life (Random)" position="insideBottom" offset={20} className="fill-emerald-600 dark:fill-emerald-400 text-xs font-bold uppercase hidden sm:block" />
                        <Label value="Wear Out" position="insideTopRight" offset={20} className="fill-amber-600 dark:fill-amber-400 text-xs font-bold uppercase hidden sm:block" />

                        <Line 
                          type="monotone" 
                          dataKey="r" 
                          stroke="#3b82f6" 
                          strokeWidth={4} 
                          dot={false}
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    <div className="p-6">
                      <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">1. Infant Mortality</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">High but decreasing failure rate. Caused by defects, poor installation, or start-up stress.</p>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">2. Useful Life</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Constant, low failure rate. Failures are random (stress > strength). This is where <Link to="/tools/mtbf" className="text-emerald-600 hover:underline">MTBF</Link> applies.</p>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-amber-600 mb-2 flex items-center gap-2">3. Wear Out</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Increasing failure rate. Physical degradation (fatigue, corrosion, erosion) sets in.</p>
                    </div>
                  </div>
                </div>

                {/* P-F Curve */}
                <div id="pf-interval" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 scroll-mt-24">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">The P-F Interval</h3>
                   <div className="grid md:grid-cols-2 gap-12 items-center">
                     <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                       <p className="mb-4">
                         The <strong>P-F Interval</strong> is the window of time between the point where a potential failure can be detected (Point P) and the point where functional failure occurs (Point F).
                       </p>
                       <p>
                         Condition-based maintenance (CBM) relies entirely on using technology (Vibration, Ultrasound, Thermography) to find failure signals early on the curve, maximizing the "Opportunity Window" to plan a repair.
                       </p>
                     </div>
                     
                     {/* SVG Visualization */}
                     <div className="relative h-64 w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
                        <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                          {/* Grid */}
                          <line x1="20" y1="180" x2="380" y2="180" stroke="#cbd5e1" strokeWidth="2" />
                          <line x1="20" y1="180" x2="20" y2="20" stroke="#cbd5e1" strokeWidth="2" />
                          <text x="350" y="195" className="text-[8px] sm:text-[10px] fill-slate-400 font-bold uppercase">Time</text>
                          <text x="15" y="15" className="text-[8px] sm:text-[10px] fill-slate-400 font-bold uppercase">Condition</text>

                          {/* Degradation Curve */}
                          <path d="M 20 40 Q 150 40 200 80 T 350 180" fill="none" stroke="#64748b" strokeWidth="3" />
                          
                          {/* Point P */}
                          <circle cx="200" cy="80" r="5" fill="#eab308" stroke="white" strokeWidth="2" />
                          <text x="210" y="75" className="text-[10px] sm:text-xs font-bold fill-slate-700 dark:fill-slate-200">Point P</text>
                          <text x="210" y="90" className="text-[8px] sm:text-[10px] fill-slate-500 hidden sm:block">Vibration / Heat Detectable</text>

                          {/* Point F */}
                          <circle cx="350" cy="180" r="5" fill="#dc2626" stroke="white" strokeWidth="2" />
                          <text x="350" y="165" className="text-[10px] sm:text-xs font-bold fill-red-600" textAnchor="end">Point F (Failure)</text>

                          {/* Interval */}
                          <line x1="200" y1="120" x2="350" y2="120" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
                          <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                              <path d="M0,0 L10,5 L0,10" fill="#3b82f6" />
                            </marker>
                          </defs>
                          <rect x="235" y="110" width="80" height="20" fill="white" className="dark:fill-slate-800" />
                          <text x="275" y="124" className="text-[8px] sm:text-[10px] font-bold fill-blue-600" textAnchor="middle">Opportunity Window</text>
                        </svg>
                     </div>
                   </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* SECTION C: CASE STUDIES */}
            <section id="cases" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Learning from Failure</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Case 1 */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 relative shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Rocket className="w-16 h-16 text-slate-400 dark:text-slate-500 opacity-50" />
                    </div>
                    <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">1986</div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Space Shuttle Challenger</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      <strong>The Failure:</strong> The catastrophic failure of an O-ring seal in the solid rocket booster due to cold weather.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 mb-6 flex-1">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Reliability Lesson</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <Link to="/tools/weibull" className="text-blue-600 hover:underline font-bold">Weibull analysis</Link> of test data would have shown that O-ring reliability was heavily dependent on temperature. Launching at 31°F (well below the test envelope) effectively reduced the reliability to zero.
                      </p>
                    </div>
                    <Link to="/tools/weibull" className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold rounded-lg transition-all shadow-md group-hover:shadow-lg">
                      Run Weibull Analysis on Your Data <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Case 2 */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 relative shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Anchor className="w-16 h-16 text-slate-400 dark:text-slate-500 opacity-50" />
                    </div>
                    <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">1940</div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Tacoma Narrows Bridge</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      <strong>The Failure:</strong> Mechanical resonance induced by 40mph winds caused the bridge to twist and collapse.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex-1">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Reliability Lesson</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        A proper <Link to="/tools/fmea" className="text-blue-600 hover:underline font-bold">FMEA</Link> (Failure Mode and Effects Analysis) during design would have identified "High Wind" + "Flexible Deck" as a critical failure mode leading to "Aeroelastic Flutter".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* SECTION D: MODERN HISTORY */}
            <section id="modern" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">2020s: The Era of Predictive Maintenance (PdM)</h2>
              </div>
              
              <article className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-serif leading-8">
                <p className="mb-6 text-xl text-slate-600 dark:text-slate-400 font-sans font-light">
                  Today, we don't just calculate failure rates; we predict them.
                </p>
                <p>
                  With the rise of <strong>IIoT (Industrial Internet of Things)</strong>, reliability has moved from 'Preventive' (Time-based) to 'Predictive' (Condition-based). 
                  Instead of replacing a bearing every 5,000 hours regardless of its condition, smart sensors now stream real-time vibration and thermal data to the cloud.
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                   <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Machine Learning</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Algorithms now analyze vibration signatures to detect the P-point weeks before a human inspector could, identifying complex patterns like bearing cage faults or early gear wear.</p>
                   </div>
                   <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Digital Twins</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Virtual replicas of physical assets allow engineers to simulate "What-if" scenarios (e.g., "What happens if we increase load by 10%?") without risking the actual equipment.</p>
                   </div>
                </div>
              </article>
            </section>

            {/* REFERENCES FOOTER */}
            <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Library className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">References & Standards</span>
              </div>
              <ul className="text-xs text-slate-500 dark:text-slate-500 space-y-2 font-mono">
                <li>• MIL-HDBK-217F: Reliability Prediction of Electronic Equipment</li>
                <li>• IEC 61508: Functional Safety of Electrical/Electronic/Programmable Electronic Safety-related Systems</li>
                <li>• NASA System Engineering Handbook, Rev 2</li>
                <li>• OREDA: Offshore and Onshore Reliability Data Handbook</li>
              </ul>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
