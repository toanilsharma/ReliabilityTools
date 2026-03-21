import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CheckCircle2, TrendingUp, AlertTriangle, Printer, BarChart, CheckSquare } from 'lucide-react';
import RelatedTools from '../../components/RelatedTools';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath } from 'react-katex';

interface Question {
  id: number;
  category: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: 1, category: 'Strategy', text: 'Does your organization have reliability goals tied to business outcomes?' },
  { id: 2, category: 'Strategy', text: 'Is asset criticality ranking used to prioritize work?' },
  { id: 3, category: 'Data', text: 'Is CMMS failure/cost data complete and accurate?' },
  { id: 4, category: 'Data', text: 'Are bad actors tracked monthly?' },
  { id: 5, category: 'Analysis', text: 'Do you run RCA on critical failures?' },
  { id: 6, category: 'Analysis', text: 'Are PM intervals data-optimized?' },
  { id: 7, category: 'Execution', text: 'Is PM:CM ratio better than 60:40?' },
  { id: 8, category: 'Execution', text: 'Are parts kitted before jobs?' },
  { id: 9, category: 'Culture', text: 'Are operators involved in autonomous care?' },
  { id: 10, category: 'Culture', text: 'Does leadership prioritize long-term reliability?' },
];

const CATEGORIES = ['Strategy', 'Data', 'Analysis', 'Execution', 'Culture'];

const MaturityAssessment: React.FC = () => {
  const [scores, setScores] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleScoreChange = (id: number, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const chartData = CATEGORIES.map(cat => {
    const catQuestions = QUESTIONS.filter(q => q.category === cat);
    const totalScore = catQuestions.reduce((acc, q) => acc + (scores[q.id] || 0), 0);
    const maxScore = catQuestions.length * 5;
    const normalized = (totalScore / maxScore) * 100;
    return { category: cat, value: Math.round(normalized) };
  });

  const overallScore = Math.round(chartData.reduce((acc, d) => acc + d.value, 0) / CATEGORIES.length);

  const getLevel = (score: number) => {
    if (score < 40) return { label: 'Reactive', color: 'text-red-500', bg: 'bg-red-100', desc: 'Breakdown-driven and highly unstable.' };
    if (score < 70) return { label: 'Planned', color: 'text-yellow-500', bg: 'bg-yellow-100', desc: 'Basic controls in place, optimization still weak.' };
    if (score < 90) return { label: 'Proactive', color: 'text-blue-500', bg: 'bg-blue-100', desc: 'Data and RCA are routine across teams.' };
    return { label: 'World Class', color: 'text-green-500', bg: 'bg-green-100', desc: 'Reliability is embedded in culture and design.' };
  };

  const level = getLevel(overallScore);

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: chartData.map((d) => ({ name: d.category, max: 100 })),
      splitLine: { lineStyle: { color: '#94a3b8' } },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitArea: { areaStyle: { color: ['rgba(148,163,184,0.03)'] } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: chartData.map((d) => d.value),
        areaStyle: { color: 'rgba(6,182,212,0.4)' },
        lineStyle: { color: '#06b6d4', width: 3 },
      }],
    }],
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
                      className={`w-10 h-10 rounded-lg font-bold transition-all border border-slate-200 dark:border-slate-700 ${scores[q.id] === val ? 'bg-cyan-600 text-white shadow-md scale-110 border-cyan-600' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
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
            <button onClick={() => setShowResult(false)} className="text-sm text-slate-500 hover:text-cyan-600 font-bold">Back to Assessment</button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-sm font-bold"><Printer className="w-4 h-4" /> Print Report</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Maturity Radar</h3>
              <div className="w-full h-[320px]">
                <ReactECharts option={radarOption} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
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
                  {level.desc}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" /> Improvement Plan
                </h4>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  {chartData.filter(d => d.value < 60).length > 0 ? (
                    chartData.filter(d => d.value < 60).map(d => (
                      <li key={d.category} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>{d.category}:</strong> Score is critical. Prioritize this area.</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2 bg-green-50 dark:bg-green-900/10 p-2 rounded text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>No critical weaknesses found.</span>
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
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Maturity Benchmarking</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Reliability is a journey, not a destination. This assessment benchmarks your maintenance organization across five critical pillars to identify bottlenecks and strategic growth gaps.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Maturity Spectrum"
          icon={<BarChart className="w-5 h-5" />}
          delay={0.1}
        >
          <ul className="space-y-2 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Level 1 (Reactive):</strong> Maintenance is a cost center. "Fix it when it breaks."</li>
            <li><strong>Level 2 (Planned):</strong> Work order controls are in place. Basic preventive maintenance (PM) starts.</li>
            <li><strong>Level 3 (Proactive):</strong> Data-driven decision making. Root Cause Analysis (RCA) is mandatory.</li>
            <li><strong>Level 4 (World Class):</strong> Reliability is designed-in. Operators own autonomous maintenance.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="Quantitative Scoring"
          icon={<CheckSquare className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The overall maturity index is calculated as a normalized percentage of your agreement with industry best practices across Strategy, Data, Analysis, Execution, and Culture.
          </p>
          <div className="mt-4">
            <BlockMath math={"M_{index} = \\frac{\\sum_{i=1}^{n} S_i}{\\sum_{i=1}^{n} Max(S_i)}"} />
          </div>
        </TheoryBlock>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="Reliability Maturity Assessment"
      description="Evaluate maintenance culture and process maturity with a radar report and targeted improvement focus."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="assessment" />
        </>
      }
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Maturity Assessment', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default MaturityAssessment;
