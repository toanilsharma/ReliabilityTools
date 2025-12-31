
import React, { useState } from 'react';
import { calculateTestTimeForMTBF, calculateSuccessRunSampleSize } from '../../services/reliabilityMath';
import { Microscope, Clock, Users, BookOpen, Target, TrendingUp, Printer } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

const TestPlanner: React.FC = () => {
  const [mode, setMode] = useState<'MTBF' | 'Reliability'>('MTBF');
  
  // MTBF Inputs
  const [targetMtbf, setTargetMtbf] = useState<string>('5000');
  const [confidence, setConfidence] = useState<string>('90');
  
  // Reliability Inputs
  const [targetReliability, setTargetReliability] = useState<string>('90');
  const [numUnits, setNumUnits] = useState<string>('10');
  
  // Results
  const [resultTime, setResultTime] = useState<number | null>(null);
  const [resultSamples, setResultSamples] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const conf = parseFloat(confidence) / 100;

    if (mode === 'MTBF') {
      const mtbf = parseFloat(targetMtbf);
      if (!isNaN(mtbf) && !isNaN(conf)) {
        setResultTime(calculateTestTimeForMTBF(mtbf, conf));
        setResultSamples(null);
      }
    } else {
      const rel = parseFloat(targetReliability) / 100;
      if (!isNaN(rel) && !isNaN(conf)) {
        const samples = calculateSuccessRunSampleSize(rel, conf);
        setResultSamples(samples);
        setResultTime(null);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Reliability Test Planner</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
            Design "Zero-Failure" qualification tests (Success Run Theorem) compliant with principles in <strong>IEC 61124</strong>. Calculate how long you need to test to demonstrate a target MTBF or Reliability with a specific confidence level.
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="no-print flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors font-medium text-sm"
        >
          <Printer className="w-4 h-4" /> Print Plan
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex shadow-sm w-full">
            <button 
              onClick={() => { setMode('MTBF'); setResultTime(null); setResultSamples(null); }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'MTBF' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              Demonstrate MTBF
            </button>
            <button 
              onClick={() => { setMode('Reliability'); setResultTime(null); setResultSamples(null); }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Reliability' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              Demonstrate Reliability %
            </button>
          </div>

          <form onSubmit={handleCalculate} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="space-y-5">
              
              {mode === 'MTBF' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target MTBF (Hours)
                    <HelpTooltip text="The Mean Time Between Failures you want to prove the product achieves." />
                  </label>
                  <input type="number" value={targetMtbf} onChange={e => setTargetMtbf(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Reliability (%)
                    <HelpTooltip text="The probability (0-100%) that the unit survives the test duration." />
                  </label>
                  <input type="number" max="99.99" step="0.01" value={targetReliability} onChange={e => setTargetReliability(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confidence Level (%)
                  <HelpTooltip text="How confident you want to be in the result. Standard is 90% or 95%." />
                </label>
                <select 
                  value={confidence} 
                  onChange={e => setConfidence(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="60">60%</option>
                  <option value="80">80%</option>
                  <option value="90">90%</option>
                  <option value="95">95%</option>
                  <option value="99">99%</option>
                </select>
              </div>

              {mode === 'MTBF' && (
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sample Size (Units)
                    <HelpTooltip text="How many units will you test simultaneously? This divides the total test time." />
                  </label>
                  <input type="number" value={numUnits} onChange={e => setNumUnits(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="1" />
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Microscope className="w-5 h-5" /> Calculate Plan
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg h-full flex flex-col justify-center">
             
             {mode === 'MTBF' && resultTime !== null && (
               <div className="text-center">
                 <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Required Test Time</div>
                 <div className="text-5xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-2">
                   {Math.ceil(resultTime).toLocaleString()} <span className="text-lg text-slate-400">Total Hours</span>
                 </div>
                 <div className="text-slate-600 dark:text-slate-300 mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    If testing <strong>{numUnits}</strong> units, run each for:
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {Math.ceil(resultTime / parseFloat(numUnits)).toLocaleString()} Hours
                    </div>
                    <div className="text-xs text-red-500 mt-2 font-medium">With ZERO failures allowed.</div>
                 </div>
               </div>
             )}

             {mode === 'Reliability' && resultSamples !== null && (
               <div className="text-center">
                 <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Required Sample Size</div>
                 <div className="text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
                   {resultSamples} <span className="text-lg text-slate-400">Units</span>
                 </div>
                 <div className="text-slate-600 dark:text-slate-300 mt-4 text-sm">
                    You must test <strong>{resultSamples}</strong> units for the full duration of the mission time without any failures to prove <strong>{targetReliability}%</strong> reliability with <strong>{confidence}%</strong> confidence.
                 </div>
               </div>
             )}

             {resultTime === null && resultSamples === null && (
               <div className="text-center text-slate-400">
                 <Microscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
                 <p>Enter parameters to generate a test plan.</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 no-print">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Standard: IEC 61124
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            These calculations align with <strong>IEC 61124</strong> (Reliability testing - Compliance tests for constant failure rate and constant failure intensity). It uses the Success Run Theorem to calculate the minimum test effort required to statistically prove a reliability target.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Confidence Level
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Confidence represents the risk you are willing to take. 90% Confidence means there is a 10% risk that the product actually has a lower MTBF than what you demonstrated, due to statistical luck.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Accelerated Testing?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This tool calculates "Equivalent Operating Hours". If you use accelerated stress (temperature/vibration), you can divide the required hours by your Acceleration Factor (AF) to get the actual test chamber time.
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="test-planner" />
    </div>
  );
};

export default TestPlanner;
