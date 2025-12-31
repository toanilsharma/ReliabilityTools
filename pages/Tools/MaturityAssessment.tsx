
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CheckCircle2, TrendingUp, AlertTriangle, Printer, BarChart } from 'lucide-react';
import RelatedTools from '../../components/RelatedTools';

interface Question {
  id: number;
  category: string;
  text: string;
}

const QUESTIONS: Question[] = [
  // Strategy
  { id: 1, category: 'Strategy', text: 'Does your organization have defined reliability goals aligned with business objectives?' },
  { id: 2, category: 'Strategy', text: 'Is there a formal asset criticality ranking used to prioritize work?' },
  // Data
  { id: 3, category: 'Data', text: 'Is maintenance data (failure codes, costs, hours) accurately captured in a CMMS?' },
  { id: 4, category: 'Data', text: 'Are bad actors (worst performing assets) identified and tracked monthly?' },
  // Analysis
  { id: 5, category: 'Analysis', text: 'Do you perform Root Cause Analysis (RCA) on all critical failures?' },
  { id: 6, category: 'Analysis', text: 'Are preventive maintenance intervals optimized using data (Weibull/MTBF)?' },
  // Execution
  { id: 7, category: 'Execution', text: 'Is the ratio of Preventive to Corrective maintenance greater than 60:40?' },
  { id: 8, category: 'Execution', text: 'Are spare parts kitted and available before a job starts?' },
  // Culture
  { id: 9, category: 'Culture', text: 'Are operators involved in basic equipment care (Autonomous Maintenance)?' },
  { id: 10, category: 'Culture', text: 'Does management support long-term reliability over short-term production fixes?' },
];

const CATEGORIES = ['Strategy', 'Data', 'Analysis', 'Execution', 'Culture'];

const MaturityAssessment: React.FC = () => {
  const [scores, setScores] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleScoreChange = (id: number, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const calculateResults = () => {
    const data = CATEGORIES.map(cat => {
      const catQuestions = QUESTIONS.filter(q => q.category === cat);
      const totalScore = catQuestions.reduce((acc, q) => acc + (scores[q.id] || 0), 0);
      const maxScore = catQuestions.length * 5;
      const normalized = (totalScore / maxScore) * 100;
      return { subject: cat, A: Math.round(normalized), fullMark: 100 };
    });
    return data;
  };

  const chartData = calculateResults();
  const overallScore = Math.round(chartData.reduce((acc, d) => acc + d.A, 0) / CATEGORIES.length);

  const getLevel = (score: number) => {
    if (score < 40) return { label: 'Reactive', color: 'text-red-500', desc: 'Fire-fighting mode. Maintenance is driven by breakdowns.' };
    if (score < 70) return { label: 'Planned', color: 'text-yellow-500', desc: 'Basic PMs are in place, but optimization is lacking.' };
    if (score < 90) return { label: 'Proactive', color: 'text-blue-500', desc: 'Data-driven decisions and RCA are standard practice.' };
    return { label: 'World Class', color: 'text-green-500', desc: 'Reliability is part of the DNA. Continuous improvement is autonomous.' };
  };

  const level = getLevel(overallScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Reliability Maturity Assessment</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
            Evaluate your facility's reliability culture and processes. Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree) to generate your maturity profile.
          </p>
        </div>
        {showResult && (
          <button 
            onClick={handlePrint}
            className="no-print flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors font-medium text-sm"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        )}
      </div>

      {!showResult ? (
        <div className="space-y-8">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide mb-1 block">{q.category}</span>
                  <p className="text-slate-900 dark:text-white font-medium text-lg">{q.text}</p>
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-lg shrink-0">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleScoreChange(q.id, val)}
                      className={`w-10 h-10 rounded-md font-bold transition-all ${
                        scores[q.id] === val 
                          ? 'bg-cyan-600 text-white shadow-md transform scale-105' 
                          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-6">
            <button 
              onClick={() => setShowResult(true)}
              disabled={Object.keys(scores).length < QUESTIONS.length}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 text-lg"
            >
              <BarChart className="w-5 h-5" /> Generate Report
            </button>
          </div>
          <p className="text-center text-sm text-slate-500">
            {Object.keys(scores).length} of {QUESTIONS.length} questions answered
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center justify-center">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Maturity Profile</h3>
               <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                     <PolarGrid stroke="#94a3b8" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar
                       name="Score"
                       dataKey="A"
                       stroke="#06b6d4"
                       strokeWidth={3}
                       fill="#06b6d4"
                       fillOpacity={0.5}
                     />
                     <Tooltip />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
                 <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Overall Maturity Score</div>
                 <div className="text-6xl font-extrabold text-slate-900 dark:text-white mb-4">{overallScore}%</div>
                 <div className={`inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-900 ${level.color} font-bold text-lg`}>
                   {level.label}
                 </div>
                 <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                   {level.desc}
                 </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" /> Recommendations
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {chartData.filter(d => d.A < 60).map(d => (
                    <li key={d.subject} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Focus on <strong>{d.subject}</strong>: Scores are low. Look for quick wins to build momentum.</span>
                    </li>
                  ))}
                  {chartData.filter(d => d.A >= 80).map(d => (
                    <li key={d.subject} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>{d.subject}</strong> is a strength. Use this to drive improvements in other areas.</span>
                    </li>
                  ))}
                  {chartData.every(d => d.A >= 60 && d.A < 80) && (
                    <li>You have a balanced profile. Aim to standardize processes to move to the next level.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
             <button 
               onClick={() => setShowResult(false)} 
               className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
             >
               Retake Assessment
             </button>
          </div>
        </div>
      )}

      <RelatedTools currentToolId="assessment" />
    </div>
  );
};

export default MaturityAssessment;
