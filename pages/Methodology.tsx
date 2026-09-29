import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BookOpen, ShieldCheck, FileText, Settings, Activity, ArrowRight, Layers, CheckCircle2, Scale } from 'lucide-react';

const Methodology: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 animate-fade-in px-4 sm:px-6">
      <SEO 
        title="Reliability Engineering Methodology & Standards | Reliability Tools"
        description="Learn the mathematical formulas, 4 core pillars, and international consensus standards (ISO 14224, IEC 60050-192, IEEE 493) powering ReliabilityTools."
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl mb-6 text-cyan-600 dark:text-cyan-400">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
          Reliability Engineering Methodology
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
          Every calculation on this platform strictly complies with approved international consensus standards from ISO, IEC, IEEE, SAE, and MIL-HDBK.
        </p>
      </div>

      {/* What is Reliability: The Approved International Standard Definition */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10">
        <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3">
          <Scale className="w-5 h-5" /> The International Standard Definition (IEC 60050-192 / ISO 14224)
        </div>
        <blockquote className="text-xl sm:text-2xl font-serif italic text-slate-900 dark:text-slate-100 leading-relaxed mb-6 border-l-4 border-cyan-500 pl-4 py-1">
          &ldquo;Reliability is the probability that an item will perform a required function without failure under stated operating conditions for a specified period of time.&rdquo;
        </blockquote>

        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">The 4 Mandatory Dimensions of Reliability:</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-xs text-cyan-600 dark:text-cyan-400 uppercase">1. Probability ($R$)</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">A statistical confidence number between 0% and 100%. Reliability is never an absolute guarantee.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">2. Required Function</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Crisp operational threshold defining success (e.g., flow rate, pressure, vibration limit) vs. failure.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase">3. Stated Conditions</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Environmental limits: ambient temperature, contamination, voltage harmonics, and lubrication quality.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase">4. Specified Duration ($t$)</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Reliability is always a time-dependent function: $R(t)$. An asset can only be reliable over a mission timeframe.</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Want an in-depth mathematical walkthrough?</span>
          <Link 
            to="/learning/what-is-reliability-engineering-guide/" 
            className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Read the Master Reliability Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Applicable Standards Table */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
          <ShieldCheck className="w-6 h-6 text-cyan-500" /> Governing International Standards
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">ISO 14224</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">Data Standard</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Petroleum, petrochemical and natural gas industries - Collection and exchange of reliability and maintenance data for equipment. Defines standard taxonomies, failure modes, and boundary definitions.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">IEC 60050-192 / IEC 60300</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">Vocabulary</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">International Electrotechnical Vocabulary: Dependability & Dependability Management. Core definitions of RAMS (Reliability, Availability, Maintainability, Safety).</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">IEC 61508 / IEC 61511</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">Functional Safety</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Functional Safety of Electrical/Electronic/Programmable Electronic Safety-Related Systems. Mandates PFDavg, SIL levels (SIL 1 to SIL 4), and architectural constraints.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">IEEE Std 493 ("Gold Book")</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Electrical Power</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Recommended Practice for the Design of Reliable Industrial and Commercial Power Systems. Established benchmark failure rates and outage durations for electrical gear.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">MIL-HDBK-217F / Telcordia</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Electronics</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Reliability Prediction of Electronic Equipment. Parts-count and part-stress failure rate modeling for circuit boards, power electronics, and sensors.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">SAE JA1011 / JA1012</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Maintenance Strategy</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Evaluation Criteria for Reliability-Centered Maintenance (RCM) Processes. Establishes the 7 mandatory RCM questions and P-F interval inspection frequencies.</p>
          </div>
        </div>
      </div>

      {/* Core Mathematical Formulas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white px-2">Core Mathematical Formulas</h2>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
            <Activity className="w-5 h-5 text-cyan-600" /> Exponential Reliability (Constant Failure Rate)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            During the useful operating life of repairable equipment, the failure rate is constant ($\lambda = 1 / \text{MTBF}$). Reliability follows an exponential decay:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center font-mono text-cyan-600 dark:text-cyan-400 font-bold text-xl mb-4 border border-slate-200 dark:border-slate-700">
            R(t) = e^{"^{-\\lambda t}"} = e^{"^{-(t / MTBF)}"}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Key Insight:</strong> When operating time equals MTBF ($t = \text{MTBF}$), $R(t) = e^{-1} \approx 36.8\%$. Over 63.2% of assets fail before reaching their MTBF!
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
            <FileText className="w-5 h-5 text-purple-600" /> Weibull Distribution (Aging, Wear-Out & Infant Mortality)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Under IEC 61649, varying failure rates are modeled with Shape ($\beta$) and Scale / Characteristic Life ($\eta$):
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center font-mono text-purple-600 dark:text-purple-400 font-bold text-xl mb-4 border border-slate-200 dark:border-slate-700">
            R(t) = e^{"^{-(t / \\eta)^\\beta}"}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Our Weibull tool employs Median Rank Regression (MRR) via Benard's Approximation: $\text{MR} = (i - 0.3) / (N + 0.4)$.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
            <Layers className="w-5 h-5 text-indigo-600" /> System Reliability Network (RBD)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Under IEC 61078, system survival depends on component configuration:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Series Configuration</span>
              R_sys = &prod; R_i = e^{"^{-(\\sum \\lambda_i)t}"}
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Active Parallel Standby</span>
              R_sys = 1 - &prod; (1 - R_i)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
            <Settings className="w-5 h-5 text-amber-600" /> Overall Equipment Effectiveness (OEE) & Availability
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Productivity is quantified through the universal ISO 22400 standard of OEE:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center font-mono text-amber-600 dark:text-amber-400 font-bold text-xl mb-4 border border-slate-200 dark:border-slate-700">
            OEE = Availability × Performance × Quality
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-center font-mono text-xs text-slate-700 dark:text-slate-300">
            Availability = MTBF / (MTBF + MTTR)
          </div>
        </div>
      </div>

      {/* 5-Step Calculation Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-cyan-400" /> How to Calculate Reliability in 5 Easy Steps
        </h2>
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-white">Define Target Mission Time ($t$):</strong> Determine the exact operational duration required (e.g. 720 hours for monthly campaign).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-white">Collect Clean Operating Data per ISO 14224:</strong> Extract total operating hours ($T$) and count of unscheduled inherent breakdowns ($r$).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-white">Compute Failure Rate (λ) &amp; MTBF:</strong> λ = r / T, and MTBF = 1 / λ = T / r.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
            <div>
              <strong className="text-white">Calculate Component Reliability R(t):</strong> Substitute into R(t) = e^(-λt) to determine survival probability percentage.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
            <div>
              <strong className="text-white">Mitigate with Redundancy or PdM:</strong> If single reliability falls short of safety goals, apply active parallel redundancy: R_parallel = 1 - (1 - R)².
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
