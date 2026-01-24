
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CheckCircle2, TrendingUp, AlertTriangle, Printer, BarChart, CheckSquare, Target, BookOpen } from 'lucide-react';
import RelatedTools from '../../components/RelatedTools';
import ToolContentLayout from '../../components/ToolContentLayout';

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
    if (score < 40) return { label: 'Reactive', color: 'text-red-500', bg: 'bg-red-100', desc: 'Fire-fighting mode. Maintenance is driven by breakdowns.' };
    if (score < 70) return { label: 'Planned', color: 'text-yellow-500', bg: 'bg-yellow-100', desc: 'Basic PMs are in place, but optimization is lacking.' };
    if (score < 90) return { label: 'Proactive', color: 'text-blue-500', bg: 'bg-blue-100', desc: 'Data-driven decisions and RCA are standard practice.' };
    return { label: 'World Class', color: 'text-green-500', bg: 'bg-green-100', desc: 'Reliability is part of the DNA. Continuous improvement is autonomous.' };
  };

  const level = getLevel(overallScore);

  const handlePrint = () => {
    window.print();
  };

  const ToolComponent = (
    <div>
      {!showResult ? (
        <div className="space-y-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Rate each statement from <strong>1 (Strongly Disagree)</strong> to <strong>5 (Strongly Agree)</strong>.
            </p>
          </div>

          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide mb-1 block">{q.category}</span>
                  <p className="text-slate-900 dark:text-white font-medium">{q.text}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleScoreChange(q.id, val)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all border border-slate-200 dark:border-slate-700 ${scores[q.id] === val
                          ? 'bg-cyan-600 text-white shadow-md scale-110 border-cyan-600 ring-2 ring-cyan-200 dark:ring-cyan-900'
                          : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              {Object.keys(scores).length} of {QUESTIONS.length} questions answered
            </p>
            <button
              onClick={() => setShowResult(true)}
              disabled={Object.keys(scores).length < QUESTIONS.length}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <BarChart className="w-5 h-5" /> Generate Report
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center no-print">
            <button onClick={() => setShowResult(false)} className="text-sm text-slate-500 hover:text-cyan-600 font-bold">← Back to Assessment</button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-sm font-bold"><Printer className="w-4 h-4" /> Print Report</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Maturity Radar</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#94a3b8" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
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
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Score</div>
                <div className="text-6xl font-black text-slate-900 dark:text-white mb-4">{overallScore}%</div>
                <div className={`inline-block px-4 py-1.5 rounded-full ${level.bg} ${level.color} font-bold text-sm uppercase tracking-wide`}>
                  {level.label}
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{level.desc}"
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" /> Improvement Plan
                </h4>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  {chartData.filter(d => d.A < 60).length > 0 ? (
                    chartData.filter(d => d.A < 60).map(d => (
                      <li key={d.subject} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>{d.subject}:</strong> Score is critical. Prioritize this area immediately.</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2 bg-green-50 dark:bg-green-900/10 p-2 rounded text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Excellent! No critical weaknesses found. Focus on sustaining your high performance.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is Reliability Maturity?</h2>
      <p>
        Reliability Maturity measures how "evolved" your maintenance organization is. It tracks the shift from a reactive "fix it when it breaks" culture to a proactive "predict and prevent" culture.
      </p>

      <h2 id="levels">The Maturity Ladder</h2>
      <ul className="list-none pl-0 space-y-4">
        <li className="flex gap-4 items-start">
          <div className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded">Level 1</div>
          <div><strong>Reactive (Chaos):</strong> Maintenance is viewed as a cost center. High overtime, frequent emergency repairs. "We don't have time to fix it right."</div>
        </li>
        <li className="flex gap-4 items-start">
          <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded">Level 2</div>
          <div><strong>Planned (Control):</strong> Work is scheduled. PM compliance is tracked. Basic parts manageemnt is in place. "We are getting organized."</div>
        </li>
        <li className="flex gap-4 items-start">
          <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded">Level 3</div>
          <div><strong>Proactive (Improvement):</strong> Defect elimination. Root Cause Analysis is standard. Condition Monitoring is used. "We are fixing the root causes."</div>
        </li>
        <li className="flex gap-4 items-start">
          <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded">Level 4</div>
          <div><strong>Strategic (Excellence):</strong> Reliability is designed in. Maintenance and Operations are partners. Lowest total cost of ownership is achieved. "Reliability is everyone's job."</div>
        </li>
      </ul>
    </div>
  );

  const faqs = [
    {
      question: "How often should I assess maturity?",
      answer: "Annually. Cultural change takes time. Use this tool once a year to track trend improvements and validate if your initiatives are working."
    },
    {
      question: "Why focus on 'Culture'?",
      answer: "Peter Drucker said 'Culture eats strategy for breakfast'. You can buy the best software and sensors (Strategy/Data), but if technicians don't care to use them (Culture), reliability will fail."
    }
  ];

  return (
    <ToolContentLayout
      title="Reliability Maturity Assessment"
      description="Evaluate your organization's maintenance culture against world-class standards. Identify gaps in Strategy, Data, Analysis, Execution, and Culture."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Maturity Assessment",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default MaturityAssessment;
