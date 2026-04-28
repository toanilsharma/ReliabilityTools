
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
  ChevronUp,
  Award,
  Target,
  BookOpen,
  Briefcase,
  Star,
  Trophy,
  Rocket,
  Briefcase as BriefcaseIcon,
  BadgeCheck,
  TrendingUp as TrendingUpIcon,
  Layers,
  ShieldCheck,
  Package,
  ArrowRightLeft,
  Banknote,
  Gauge,
  Network,
  Box,
  Calendar,
  ClipboardList,
  Droplets
} from 'lucide-react';
import { TOOLS, ARTICLES } from '../constants';
import { calculateMTBF } from '../services/reliabilityMath';
import SEO from '../components/SEO';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCounterAnimation } from '../hooks/useCounterAnimation';
import RecentTools from '../components/RecentTools';

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

import { IconMap, getThemeClasses } from '../utils/themeHelper';

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

  const observeElt = useIntersectionObserver();
  const { count: trustScore, countRef: trustRef } = useCounterAnimation(100, 1500);

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
        title="Free MTBF Calculator & Reliability Engineering Tools | India"
        description="20 free reliability engineering tools: MTBF calculator, Weibull analysis, FMEA worksheet, OEE calculator. Used by maintenance engineers, plant managers & engineering students across India. No signup. ISO/IEC formulas."
        keywords="free MTBF calculator, Weibull analysis tool India, reliability engineering tools, FMEA calculator, OEE calculator, availability calculator, predictive maintenance, engineering interview preparation, reliability exam preparation"
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
            <span>100% Free · No Login · ISO/IEC Standard Formulas</span>
          </div>

          <h1 className="font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 4.5vw + 1rem, 3.8rem)' }}>
            Analyze Failures, Improve Uptime, and Make Data-Driven Decisions <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
              in Seconds
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white">20 professional-grade calculators</span> trusted by maintenance professionals, reliability engineers, professors, and students worldwide.
            Master MTBF, Weibull, FMEA, OEE & more - directly in your browser.
          </p>

          <p className="text-lg text-cyan-700 dark:text-cyan-300 max-w-2xl mx-auto mb-10 font-medium">
            Whether you're optimizing plant KPIs, teaching engineering concepts, or cracking competitive exams - avoid expensive certification fees and enterprise software with our 100% free toolset.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              to="/mtbf-calculator"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Start Free - MTBF Calculator
            </Link>
            <Link
              to="/learning"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Explore Learning Hub
            </Link>
          </div>

          {/* BIG Show All Tools Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              to="/tools"
              id="show-all-tools-btn"
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-extrabold text-lg text-white overflow-hidden shadow-2xl shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-cyan-500/50 w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)',
              }}
            >
              {/* Animated shimmer overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Calculator className="w-6 h-6 flex-shrink-0" />
              <span>View All Reliability Tools Free</span>
              <span className="flex items-center gap-1 bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full border border-white/30">
                <ArrowRight className="w-4 h-4" />
                Free
              </span>
            </Link>

            <Link
              to="/skill-test"
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-extrabold text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 overflow-hidden shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full sm:w-auto border border-slate-700 dark:border-slate-200"
            >
              <Award className="w-6 h-6 flex-shrink-0 text-amber-500" />
              <span>Test Your Skill Level</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-500 dark:text-slate-400 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8" ref={observeElt}>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">20</div>
              <div className="text-sm">Engineering Tools</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white" ref={trustRef}>{trustScore}%</div>
              <div className="text-sm">Client-Side Privacy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">IEC/ISO</div>
              <div className="text-sm">Standard Formulas</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl text-slate-900 dark:text-white">₹0</div>
              <div className="text-sm">Forever Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Achieve - Persona-Specific Value Propositions */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Target className="w-3 h-3" /> What You'll Achieve
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">This Platform Was Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Your Success</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">No matter where you are in your career - this is the only reliability engineering toolkit you'll ever need.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Maintenance Engineers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Maintenance Engineers</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Reduce unplanned downtime by 30-50%</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Set data-driven PM intervals (not vendor guesses)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Present reliability KPIs to management with confidence</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Ace reliability engineering interviews</li>
              </ul>
              <Link to="/mtbf-calculator" className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Start with MTBF <ArrowRight className="w-3 h-3" /></Link>
            </div>

            {/* Reliability Engineers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Reliability Engineers</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /> Perform Weibull, FMEA & RBD analysis instantly</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /> Build compelling MTBF/availability reports</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /> Win data-driven arguments for CapEx requests</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /> Stand out in CRE / SRE certifications</li>
              </ul>
              <Link to="/weibull-analysis" className="mt-4 text-cyan-600 dark:text-cyan-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Start with Weibull <ArrowRight className="w-3 h-3" /></Link>
            </div>

            {/* Plant Managers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-purple-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Plant Managers</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> Benchmark OEE against world-class (85%+)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> Quantify downtime cost in ₹ for leadership</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> Optimize spare parts inventory & reduce capital lock-in</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> Lead TPM/RCM transformation with hard data</li>
              </ul>
              <Link to="/oee-calculator" className="mt-4 text-purple-600 dark:text-purple-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Start with OEE <ArrowRight className="w-3 h-3" /></Link>
            </div>

            {/* Engineering Students */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Engineering Students</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Crack GATE, ESE & reliability exam problems</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Build real-world project portfolios that impress</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Learn formulas interactively (not from textbooks)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Stand out in campus placement interviews</li>
              </ul>
              <Link to="/learning" className="mt-4 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Start Learning <ArrowRight className="w-3 h-3" /></Link>
            </div>

          </div>
        </div>
      </section>

      {/* Why Engineers Choose This Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3 h-3" /> Why Engineers Choose Us
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Your Competitors Don't Know About This Yet</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Most engineers rely on expensive software or manual spreadsheets. You'll have an edge they can't match.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg shrink-0">
              <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Interview-Ready Knowledge</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Every tool teaches you the formula, the theory, and the real-world application. Walk into interviews with hands-on experience, not just textbook definitions.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
              <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Competition Edge</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Present professionally-analyzed reliability data in competitions, hackathons, and design challenges. Export charts in SVG/EPS for publication-quality reports.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
              <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Certification Prep</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Practice CRE (Certified Reliability Engineer), Six Sigma, and TPM concepts with real calculators - not just MCQs. Understand why the formulas work.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Instant Plant Visibility</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Generate MTBF reports, OEE dashboards, and FMEA worksheets that make management take notice. Turn your analysis into action and your career into leadership.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg shrink-0">
              <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">No Expensive Software Needed</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise reliability software costs thousands of dollars per year. This platform gives you 80% of those capabilities - for free. Perfect for startups, SMEs, and individual engineers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
              <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Portfolio Builder</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Share your Weibull analysis or RBD model via unique URLs. Add them to your LinkedIn, resume, or portfolio to showcase applied reliability skills to recruiters.</p>
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
          <div ref={observeElt} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
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
          <div ref={observeElt} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
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
          <div ref={observeElt} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col relative group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl">
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

      {/* SEO Content: What is MTBF & Weibull Analysis */}
      <section className="relative py-24 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0ea5e90a,transparent_70%)] dark:bg-[radial-gradient(circle_at_top_right,#0ea5e905,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* MTBF Insight Card */}
            <div className="group relative p-px rounded-3xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-950 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-[23px] p-8 md:p-10 h-full flex flex-col relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    What is <span className="text-cyan-600 dark:text-cyan-400">MTBF</span>?
                  </h2>
                </div>
                
                <div className="space-y-6 flex-grow">
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <strong>Mean Time Between Failures (MTBF)</strong> is the vital heartbeat of reliability engineering. It predicts the average operational time between inherent system failures.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Core Purpose</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Maximize Uptime</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Industry Standard</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">ISO/IEC Aligned</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    By accurately measuring MTBF, plant managers can optimize preventive maintenance schedules, minimize unexpected downtime, and forecast spare parts inventory. World-class organizations seeking maximum <Link to="/tools/availability" className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold">system availability</Link> focus on increasing MTBF while lowering MTTR.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expert Knowledge Block</span>
                  <Link to="/learning/mtbf-guide" className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all">
                    Deep Dive <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Weibull Insight Card */}
            <div className="group relative p-px rounded-3xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-950 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-[23px] p-8 md:p-10 h-full flex flex-col relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUpIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    What is <span className="text-blue-600 dark:text-blue-400">Weibull</span>?
                  </h2>
                </div>
                
                <div className="space-y-6 flex-grow">
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <strong>Weibull Analysis</strong> is the elite statistical weapon for life data analysis, capable of modeling anything from infant mortality to wear-out.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Key Metric</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shape (&beta;) Analysis</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Physics of Life</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bathtub Curve</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Using a Weibull probability plot, engineers determine exactly where a component is on the <Link to="/learning" className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold">Bathtub Curve</Link>. It reveals whether a product is experiencing infant mortality, random mid-life failures, or end-of-life wear-out.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistical Insight</span>
                  <Link to="/learning/weibull-analysis-explained" className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                    Master Weibull <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 dark:bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col justify-center hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-sm">FMEA & RCA Logs</span>
                  </div>
                  <p className="text-xs text-slate-400">Standardized root cause isolation</p>
                </div>
                <div className="bg-slate-800 dark:bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col justify-center hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">Criticality Matrix</span>
                  </div>
                  <p className="text-xs text-slate-400">Rank assets by risk severity</p>
                </div>
                <div className="bg-slate-800 dark:bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col justify-center hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-sm">Spares Calculator</span>
                  </div>
                  <p className="text-xs text-slate-400">Optimize inventory levels</p>
                </div>
              </div>
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
      <section id="all-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <RecentTools />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 mt-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Reliability Calculators</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">20 professional-grade tools. Free. No signup required.</p>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md transition-all hover:-translate-y-0.5"
          >
            <Calculator className="w-4 h-4" />
            Full Tools Directory
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS.map((tool) => {
            // Check if tool.iconName exists in the IconMap
            let IconComponent = tool.iconName && IconMap[tool.iconName] ? IconMap[tool.iconName] : null;
            
            // If no icon found, use the fallback
            if (!IconComponent) {
              IconComponent = tool.category === 'Analysis' ? Activity :
                              tool.category === 'Planning' ? BriefcaseIcon : Calculator;
            }
            
            const theme = getThemeClasses(tool.colorTheme, tool.category);
            
            return (
              <Link
                key={tool.id}
                to={tool.path}
                ref={observeElt}
                className={`group flex flex-col justify-between p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 ${theme.border}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl shrink-0 transition-colors ${theme.icon}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight transition-colors ${theme.text}`}>
                      {tool.name}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Learning Hub Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
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
            <div ref={observeElt} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
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
                  <p className="text-slate-300 text-sm mt-1">Used <Link to="/weibull-analysis" className="text-cyan-400 hover:underline">Weibull Analysis</Link> to determine failure mode was 'wear-out' (Beta {'>'} 2.5), not random.</p>
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
            <div ref={observeElt} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
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
            <div ref={observeElt} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors">
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
