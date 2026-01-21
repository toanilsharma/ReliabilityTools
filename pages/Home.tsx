
import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart2,
  Clock,
  Settings,
  Activity,
  Calculator,
  Shield,
  CheckCircle,
  FileSpreadsheet,
  ExternalLink,
  Users,
  Zap,
  Wrench,
  Factory,
  GraduationCap,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TOOLS, ARTICLES } from '../constants';
import { calculateMTBF } from '../services/reliabilityMath';
import SEO from '../components/SEO';

// Lazy load widgets to avoid loading Recharts library on initial page load
const AvailabilityChartWidget = React.lazy(() => import('../components/widgets/AvailabilityChart'));
const FailureModeIdentifier = React.lazy(() => import('../components/widgets/FailureModeIdentifier'));
const SparesForecastWidget = React.lazy(() => import('../components/widgets/SparesForecastWidget'));

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors pr-4">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const HOME_FAQS = [
  {
    question: "What are Industrial Reliability Engineering Tools?",
    answer: "This platform provides a comprehensive suite of calculators for maximizing asset uptime, minimizing costs, and ensuring safety in manufacturing, aviation, automotive, and heavy industry sectors. Our tools help engineers, technicians, and students quantify equipment performance without expensive software."
  },
  {
    question: "Why use online reliability calculators?",
    answer: "Calculating key performance indicators (KPIs) like Mean Time Between Failures (MTBF) and Availability manually can be error-prone. This platform provides standardized, instant computations based on IEEE and IEC standard formulas. It offers efficiency (answers in seconds), accuracy (verified algorithms), and accessibility (no installation required)."
  },
  {
    question: "What is MTBF (Mean Time Between Failures)?",
    answer: "MTBF is the predicted elapsed time between inherent failures of a mechanical or electronic system during normal system operation. It is a critical metric for determining asset reliability and planning maintenance schedules."
  },
  {
    question: "What is MTTR (Mean Time To Repair)?",
    answer: "MTTR represents the average time required to troubleshoot and repair a failed system. Maintaining a low MTTR is crucial for achieving high system availability and operational efficiency."
  },
  {
    question: "How does Weibull Analysis work?",
    answer: "Weibull Analysis is a powerful statistical method used to analyze life data. Unlike simple averages, it allows you to predict failure trends (Infant Mortality, Random, or Wear Out) even with small datasets, helping to determine the optimal time for preventive maintenance."
  }
];

const Home: React.FC = () => {
  const [demoHours, setDemoHours] = useState('8760');
  const [demoFailures, setDemoFailures] = useState('4');
  const [demoResult, setDemoResult] = useState<number>(2190);

  const handleDemoCalc = () => {
    const h = parseFloat(demoHours);
    const f = parseFloat(demoFailures);
    if (!isNaN(h) && !isNaN(f)) {
      setDemoResult(calculateMTBF(h, f));
    }
  };

  const WidgetSkeleton = () => (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse min-h-[300px]"></div>
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": HOME_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="space-y-24 pb-12">
      <SEO
        title="Industrial Reliability Engineering Tools | MTBF & Weibull Calculator"
        description="Free professional grade reliability engineering calculators. Perform Weibull Analysis, calculate MTBF, modeling Reliability Block Diagrams (RBD), and optimize maintenance schedules."
        keywords="reliability engineering, mtbf calculator, weibull analysis, rbd tool, reliability block diagram, maintenance planning, predictive maintenance, availability calculator"
        canonicalUrl="https://reliabilitytools.co.in/"
        schema={faqSchema}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px] dark:opacity-10 animate-pulse"></div>
          <div className="absolute right-10 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600 opacity-20 blur-[100px] dark:opacity-10 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-6 border border-cyan-200 dark:border-cyan-700/50">
            <Shield className="w-4 h-4" />
            <span>Free, Private, & Secure Engineering Tools</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Industrial Reliability <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
              Engineering Suite
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Maximize asset uptime and optimize maintenance strategies.
            Calculate <span className="font-semibold text-slate-900 dark:text-white">MTBF</span>, perform <span className="font-semibold text-slate-900 dark:text-white">Weibull Analysis</span>, and model <span className="font-semibold text-slate-900 dark:text-white">System Availability</span> directly in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/tools/mtbf"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Start MTBF Calculator
            </Link>
            <Link
              to="/tools/weibull"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Run Weibull Analysis
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-500 dark:text-slate-400 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">100%</div>
              <div className="text-sm">Client-Side Privacy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">IEC</div>
              <div className="text-sm">Standard Formulas</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">Zero</div>
              <div className="text-sm">Installation Required</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">Free</div>
              <div className="text-sm">For Everyone</div>
            </div>
          </div>
        </div>
      </section>

      {/* Built For Section - Updated Header */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Built for:</h2>
            <p className="text-slate-600 dark:text-slate-400">Tailored tools for the entire asset management hierarchy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Maintenance Engineers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Troubleshoot failures, calculate MTTR, and optimize preventive maintenance schedules.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Reliability Engineers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Perform root cause analysis, Weibull distributions, and system reliability modeling.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Plant Managers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track OEE, estimate lifecycle costs (LCC), and improve asset availability.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Engineering Students</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Learn core reliability concepts, standard formulas, and failure patterns.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Engineering Micro-Tools & Widgets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" /> Live Interactive Previews
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Engineering Micro-Tools</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Test drive our calculators right here. These are <strong>mini-versions</strong> designed for quick checks. Launch the full tools for professional analysis and reporting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Availability Widget Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 uppercase tracking-wide border-b border-l border-slate-200 dark:border-slate-600">
              Mini Version
            </div>
            <div className="p-6 flex-grow">
              <Suspense fallback={<WidgetSkeleton />}>
                <AvailabilityChartWidget />
              </Suspense>
            </div>
            <Link to="/tools/availability" className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between group/link hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/link:text-cyan-700 dark:group-hover/link:text-cyan-400">Launch Full Availability Tool</span>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-400 group-hover/link:text-cyan-600 dark:group-hover/link:text-cyan-400 group-hover/link:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Failure Mode Widget Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 uppercase tracking-wide border-b border-l border-slate-200 dark:border-slate-600">
              Mini Version
            </div>
            <div className="p-6 flex-grow">
              <Suspense fallback={<WidgetSkeleton />}>
                <FailureModeIdentifier />
              </Suspense>
            </div>
            <Link to="/learning" className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between group/link hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/link:text-cyan-700 dark:group-hover/link:text-cyan-400">Open Knowledge Base</span>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-400 group-hover/link:text-cyan-600 dark:group-hover/link:text-cyan-400 group-hover/link:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Spares Widget Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 uppercase tracking-wide border-b border-l border-slate-200 dark:border-slate-600">
              Mini Version
            </div>
            <div className="p-6 flex-grow">
              <Suspense fallback={<WidgetSkeleton />}>
                <SparesForecastWidget />
              </Suspense>
            </div>
            <Link to="/tools/spares" className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between group/link hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/link:text-cyan-700 dark:group-hover/link:text-cyan-400">Complete Spares Estimator</span>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-400 group-hover/link:text-cyan-600 dark:group-hover/link:text-cyan-400 group-hover/link:scale-110 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Mini Demo */}
      <section className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Calculator className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick MTBF Estimate</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">See how instantly our calculators work.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Operational Hours</label>
                <input
                  type="number"
                  value={demoHours}
                  onChange={(e) => setDemoHours(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Total Failures</label>
                <input
                  type="number"
                  value={demoFailures}
                  onChange={(e) => setDemoFailures(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                />
              </div>
              <button
                onClick={handleDemoCalc}
                className="h-[50px] bg-slate-900 dark:bg-white hover:bg-cyan-600 dark:hover:bg-cyan-400 text-white dark:text-slate-900 font-bold rounded-lg transition-colors"
              >
                Calculate Result
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Calculated MTBF:</span>
              <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">{demoResult.toLocaleString()} <span className="text-sm font-normal text-slate-500">Hours</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Templates & Downloads Teaser */}
      <section className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Free Engineering Templates</h2>
              <p className="text-lg text-slate-300 dark:text-slate-600 mb-8">
                Save hours of work with our pre-formatted Excel/CSV templates.
                Download industry-standard forms for FMEA, Root Cause Analysis, and Maintenance Planning instantly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-600" />
                  <span className="font-medium">FMEA & RCA Log Sheets</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-600" />
                  <span className="font-medium">Asset Criticality Ranking Matrix</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-600" />
                  <span className="font-medium">Spare Part Stocking Calculator</span>
                </li>
              </ul>
              <Link to="/downloads" className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/30">
                Browse Templates <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white/10 dark:bg-black/5 p-8 rounded-2xl border border-white/10 dark:border-black/10 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-white p-4 rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-slate-900 font-bold text-sm">FMEA_Template.csv</div>
                </div>
                <div className="bg-white dark:bg-white p-4 rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-slate-900 font-bold text-sm">RCA_5_Whys.csv</div>
                </div>
                <div className="bg-white dark:bg-white p-4 rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-slate-900 font-bold text-sm">PM_Schedule.csv</div>
                </div>
                <div className="bg-white dark:bg-white p-4 rounded-xl shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-slate-900 font-bold text-sm">MTBF_Log.csv</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Reliability Calculators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group block p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                  {tool.id === 'mtbf' || tool.id === 'mttr' ? <Clock /> :
                    tool.id === 'weibull' ? <Activity /> :
                      tool.id === 'rbd' ? <Settings /> : <BarChart2 />}
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded uppercase tracking-wider">
                  {tool.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Hub Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest from Learning Hub</h2>
          <Link to="/learning" className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-semibold">View all articles</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ARTICLES.slice(0, 3).map((article) => (
            <Link key={article.id} to="/learning" className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="text-xs text-slate-500 dark:text-slate-500 mb-2">{article.date}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                {article.summary}
              </p>
              <span className="text-cyan-600 dark:text-cyan-400 text-sm font-medium flex items-center">
                Read More <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Use Cases (Replaced Testimonials) */}
      <section className="bg-slate-900 dark:bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Real-World Use Cases</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">See how reliability engineering principles apply to actual industrial challenges.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Case 1 */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-900/30 rounded-lg text-cyan-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Textile Plant</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Challenge</span>
                  <p className="text-slate-300 text-sm mt-1">Unpredictable bearing failures on high-speed spinning machines causing line stops.</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution</span>
                  <p className="text-slate-300 text-sm mt-1">Used <Link to="/tools/weibull" className="text-cyan-400 hover:underline">Weibull Analysis</Link> to determine failure mode was 'wear-out' (Beta {'>'} 2.5), not random.</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Reduced Downtime by 15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Chemical Processing</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Challenge</span>
                  <p className="text-slate-300 text-sm mt-1">Excessive capital tied up in spare mechanical seal inventory.</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution</span>
                  <p className="text-slate-300 text-sm mt-1">Applied the <Link to="/tools/spares" className="text-blue-400 hover:underline">Spare Part Estimator</Link> to calculate optimal stock for 95% service level.</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>$12k Annual Savings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Auto Assembly</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Challenge</span>
                  <p className="text-slate-300 text-sm mt-1">Single robotic arm failure costing $5,000/hr in lost production.</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution</span>
                  <p className="text-slate-300 text-sm mt-1">Modeled redundancy options in the <Link to="/tools/rbd" className="text-purple-400 hover:underline">RBD Builder</Link> to justify a standby unit.</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>99.5% System Availability</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ / SEO Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {HOME_FAQS.map((faq, idx) => (
              <AccordionItem key={idx} title={faq.question}>
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
