import React, { useState, useMemo, useRef } from 'react';
import { BarChart2, Plus, Trash2, Copy, Check, Share2, TrendingUp, Info } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';

interface ParetoItem {
  id: string;
  name: string;
  count: number;
}

const DEFAULT_PARETO_ITEMS: ParetoItem[] = [
  { id: '1', name: 'Bearing Wear & Fatigue', count: 45 },
  { id: '2', name: 'Mechanical Seal Leak', count: 28 },
  { id: '3', name: 'Electrical Motor Trip', count: 14 },
  { id: '4', name: 'Shaft Misalignment', count: 8 },
  { id: '5', name: 'Lubricant Contamination', count: 5 }
];

const ParetoChartTool: React.FC = () => {
  const [items, setItems] = useState<ParetoItem[]>(DEFAULT_PARETO_ITEMS);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [error, setError] = useState('');
  const toolRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    const nextId = String(items.length + 1);
    setItems(prev => [...prev, { id: nextId, name: `Failure Mode ${nextId}`, count: 10 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: 'name' | 'count', value: string | number) => {
    setItems(prev => {
      const next = [...prev];
      if (field === 'count') {
        next[index].count = Math.max(0, Number(value) || 0);
      } else {
        next[index].name = String(value);
      }
      return next;
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.name.trim())) {
      setError('Please provide names for all failure modes.');
      return;
    }
    setError('');
    trackToolCalculation('Pareto Chart Tool', 'pareto');
  };

  const paretoAnalysis = useMemo(() => {
    // 1. Sort descending by count
    const sorted = [...items].sort((a, b) => b.count - a.count);
    const totalCount = sorted.reduce((sum, item) => sum + item.count, 0);

    let cumulativeSum = 0;
    let vitalFewCount = 0;

    const chartData = sorted.map((item, idx) => {
      cumulativeSum += item.count;
      const cumulativePercent = totalCount > 0 ? (cumulativeSum / totalCount) * 100 : 0;

      // Check if this item is part of the vital few <= 80% (or the first item crossing 80%)
      const isVitalFew = cumulativePercent <= 80 || (idx > 0 && (cumulativeSum - item.count) / totalCount * 100 < 80);
      if (isVitalFew) vitalFewCount++;

      return {
        name: item.name,
        count: item.count,
        cumulativePercent: Number(cumulativePercent.toFixed(1)),
        isVitalFew
      };
    });

    const vitalFewItems = chartData.filter(d => d.isVitalFew);
    const vitalFewPercent = vitalFewItems.length > 0 ? vitalFewItems[vitalFewItems.length - 1].cumulativePercent : 0;

    const insightSentence = `The top ${vitalFewCount} failure mode${vitalFewCount > 1 ? 's' : ''} ("${vitalFewItems.map(v => v.name).join('", "')}") account for ${vitalFewPercent}% of total failure impact.`;

    return {
      chartData,
      totalCount,
      vitalFewCount,
      vitalFewPercent,
      insightSentence
    };
  }, [items]);

  const handleCopySnippet = () => {
    const text = `Pareto 80/20 Analysis Summary:
- Total Failures: ${paretoAnalysis.totalCount}
- Vital Few Modes: ${paretoAnalysis.vitalFewCount}
- Insight: ${paretoAnalysis.insightSentence}
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/pareto/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is a Pareto Chart and the 80/20 Rule?',
      answer: 'The Pareto principle states that roughly 80% of equipment downtime or failure costs are caused by 20% of the failure modes. A Pareto chart combines sorted bar columns (frequencies) with a cumulative percentage line.'
    },
    {
      question: 'How does Pareto Analysis benefit maintenance planning?',
      answer: 'Pareto analysis helps reliability engineers prioritize maintenance expenditure, FMEA actions, and spare parts stocking by focusing resources on the "Vital Few" high-impact failure modes.'
    },
    {
      question: 'Should I prioritize by failure frequency or downtime cost?',
      answer: 'While frequency shows how often a machine breaks down, analyzing downtime cost ($) or lost production hours yields a truer financial picture of risk.'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Form Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-500" /> Failure Modes Table
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Mode
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mode #{idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.name}
                    onChange={e => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Failure mode name..."
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Impact (Count / $):</span>
                    <input
                      type="number"
                      min="0"
                      value={item.count}
                      onChange={e => handleItemChange(idx, 'count', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Generate Pareto Chart
            </button>
          </form>
        </AnimatedContainer>

        {/* Results Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 md:p-8 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">Pareto 80/20 Distribution</span>
                <h4 className="text-2xl md:text-3xl font-black text-white mt-1">Pareto Analysis Output</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
              </button>
            </div>

            {/* Vital Few Insight Banner */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3 text-cyan-200 text-xs leading-relaxed">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-0.5">Pareto Vital Few Insight</strong>
                {paretoAnalysis.insightSentence}
              </div>
            </div>

            {/* Dual-Axis Recharts Pareto Chart */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoAnalysis.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#38bdf8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#f59e0b" fontSize={11} unit="%" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar yAxisId="left" dataKey="count" radius={[6, 6, 0, 0]}>
                    {paretoAnalysis.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isVitalFew ? '#06b6d4' : '#64748b'} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <ShareAndExport
              toolName="Pareto Chart Tool"
              shareUrl="https://reliabilitytools.co.in/tools/pareto/"
              resultSummary={paretoAnalysis.insightSentence}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding Pareto Analysis in Reliability Engineering</h2>
      <p>
        Named after Italian economist Vilfredo Pareto, Pareto analysis is a decision-making technique based on the 80/20 rule. In plant reliability, 80% of maintenance expenditure and outage hours are generated by approximately 20% of the root failure modes.
      </p>

      <h3>Constructing a Pareto Diagram</h3>
      <ul>
        <li><strong>Step 1:</strong> List all failure modes or downtime categories.</li>
        <li><strong>Step 2:</strong> Quantify impact using frequency count or downtime financial cost ($).</li>
        <li><strong>Step 3:</strong> Sort modes in descending order of magnitude.</li>
        <li><strong>Step 4:</strong> Calculate cumulative frequency sum and percentage curve.</li>
        <li><strong>Step 5:</strong> Focus RCM resources on the "Vital Few" modes preceding the 80% cutoff line.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="Pareto Chart Tool (80/20 Failure Analysis)"
      description="Perform Pareto 80/20 analysis on failure modes and downtime events with dual-axis bar and cumulative percentage chart visualization."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="pareto chart tool, 80/20 failure analysis, pareto diagram generator, reliability centered maintenance, vital few failure modes"
      canonicalUrl="https://reliabilitytools.co.in/tools/pareto/"
    />
  );
};

export default ParetoChartTool;
