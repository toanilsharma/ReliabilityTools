import React from 'react';
import SEO from '../components/SEO';
import { BookOpen, ShieldCheck, FileText, Settings, Activity } from 'lucide-react';

const Methodology: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 animate-fade-in">
      <SEO 
        title="Reliability Engineering Methodology & Standards"
        description="Learn about the engineering standards and mathematical formulas (IEEE, IEC, MIL-HDBK) powering ReliabilityTools."
      />

      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl mb-6">
          <BookOpen className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">About the Methodology</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We adhere to established global standards for all calculations. Here are the core methodologies driving our tools.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
          <ShieldCheck className="w-6 h-6 text-cyan-500" /> Applicable Standards
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">IEEE Std 762</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Definitions for Use in Reporting Electric Generating Unit Reliability, Availability, and Productivity.</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">IEC 60300</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dependability management - managing risk and reliability in the asset lifecycle.</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">MIL-HDBK-217</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reliability Prediction of Electronic Equipment - standardizing component failure rates.</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">ISO 14224</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Petroleum, petrochemical and natural gas industries - Collection and exchange of reliability and maintenance data.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white px-2">Core Mathematical Formulas</h2>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
            <Activity className="w-5 h-5 text-cyan-600" /> MTBF and Reliability
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Under the assumption of a constant failure rate, reliability $R(t)$ follows an exponential distribution:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center font-mono text-slate-800 dark:text-slate-200 overflow-x-auto text-lg mb-4">
            R(t) = e^{"^{-(t / MTBF)}"}
          </div>
          <p className="text-slate-600 dark:text-slate-400">Where $t$ is the operating time.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
            <FileText className="w-5 h-5 text-purple-600" /> Weibull Distribution
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The 2-parameter Weibull Reliability function models varying failure rates, utilizing Shape ($\beta$) and Scale ($\eta$):
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center font-mono text-slate-800 dark:text-slate-200 overflow-x-auto text-lg mb-4">
            R(t) = e^{"^{-(t / \\eta)^\\beta}"}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            This site employs Median Rank Regression (MRR) via Benard's Approximation: MR = (i - 0.3) / (N + 0.4)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
            <Settings className="w-5 h-5 text-amber-600" /> Overall Equipment Effectiveness (OEE)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Productivity is quantified through the universal standard of OEE:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center font-mono text-slate-800 dark:text-slate-200 overflow-x-auto text-lg">
            OEE = Availability × Performance × Quality
          </div>
        </div>

      </div>
    </div>
  );
};

export default Methodology;
