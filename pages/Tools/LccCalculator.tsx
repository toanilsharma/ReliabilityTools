import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Activity, BookOpen, Target, Award, CheckCircle, AlertCircle, ArrowRight, Clock, Shield, AlertTriangle, Settings, Info, BarChart2, RotateCcw } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';

// Mock function if service is missing or not exposed properly, 
// though we usually expect services to be there. 
// I will implement the calculation logic locally to be safe and self-contained.
const calculateLCCLocal = (params: any) => {
  const { capex, energy, maint, downtimeHours, downtimeCostPerHour, years, residual, discountRate, inflationRate } = params;
  const r = discountRate / 100;
  const i = inflationRate / 100;
  let npv = capex;
  const cumulativeData = [{ year: 0, cost: capex }];
  const baseAnnualOpex = energy + maint + (downtimeHours * downtimeCostPerHour);
  let currentAccumulated = capex;

  for (let year = 1; year <= years; year++) {
    const inflatedOpex = baseAnnualOpex * Math.pow(1 + i, year);
    const pvOpex = inflatedOpex / Math.pow(1 + r, year);
    npv += pvOpex;
    currentAccumulated += pvOpex;

    if (year === years && residual > 0) {
      const inflatedResidual = residual * Math.pow(1 + i, year);
      const pvResidual = inflatedResidual / Math.pow(1 + r, year);
      npv -= pvResidual;
      currentAccumulated -= pvResidual;
    }
    cumulativeData.push({ year, cost: currentAccumulated });
  }
  return { npv, cumulativeData, baseAnnualOpex };
};

const LccCalculator: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState({
    currency: 'USD',
    discountRate: 8,
    inflationRate: 2,
    lifespan: 10,
    costA: 15000, energyA: 4000, maintA: 1200, downtimeA: 20, residualA: 0,
    costB: 22000, energyB: 2500, maintB: 400, downtimeB: 5, residualB: 2000,
    downtimeCost: 500
  });

  const handleChange = (field: string, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const analysisA = useMemo(() => calculateLCCLocal({
    capex: params.costA, energy: params.energyA, maint: params.maintA,
    downtimeHours: params.downtimeA, downtimeCostPerHour: params.downtimeCost,
    years: params.lifespan, residual: params.residualA,
    discountRate: params.discountRate, inflationRate: params.inflationRate
  }), [params]);

  const analysisB = useMemo(() => calculateLCCLocal({
    capex: params.costB, energy: params.energyB, maint: params.maintB,
    downtimeHours: params.downtimeB, downtimeCostPerHour: params.downtimeCost,
    years: params.lifespan, residual: params.residualB,
    discountRate: params.discountRate, inflationRate: params.inflationRate
  }), [params]);

  const diff = analysisA.npv - analysisB.npv;
  const isBBetter = analysisB.npv < analysisA.npv;
  const savingsPercent = (Math.abs(diff) / analysisA.npv) * 100;

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const chartData = useMemo(() => {
    return analysisA.cumulativeData.map((a, i) => ({
      year: a.year,
      costA: Math.round(a.cost),
      costB: Math.round(analysisB.cumulativeData[i]?.cost || 0)
    }));
  }, [analysisA, analysisB]);

  // --- Components for the Tool Area ---
  const InputRow = ({ label, value, onChange, icon }: any) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
      <div className="relative w-32">
        <span className="absolute left-3 top-1.5 text-slate-400 text-xs font-bold">{icon}</span>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full py-1 pl-8 pr-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
        />
      </div>
    </div>
  );

  const ToolComponent = (
    <div className="space-y-6">
      {/* Global Settings */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="w-28">
            <label className="text-xs font-bold text-slate-500">Discount Rate %</label>
            <input type="number" value={params.discountRate} onChange={e => handleChange('discountRate', Number(e.target.value))} className="w-full p-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div className="w-28">
            <label className="text-xs font-bold text-slate-500">Inflation Rate %</label>
            <input type="number" value={params.inflationRate} onChange={e => handleChange('inflationRate', Number(e.target.value))} className="w-full p-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div className="w-28">
            <label className="text-xs font-bold text-slate-500">Lifespan (Yrs)</label>
            <input type="number" value={params.lifespan} onChange={e => handleChange('lifespan', Number(e.target.value))} className="w-full p-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div className="w-32">
            <label className="text-xs font-bold text-slate-500">Downtime Cost $/Hr</label>
            <input type="number" value={params.downtimeCost} onChange={e => handleChange('downtimeCost', Number(e.target.value))} className="w-full p-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-cyan-600 font-bold underline">
          {showAdvanced ? "Simple Mode" : "Advanced Mode"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Option A */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 border-slate-400 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-bl-xl text-xs font-bold text-slate-500">Standard Option</div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Option A (Standard)</h3>
          <InputRow label="Purchase Cost" value={params.costA} onChange={(v: any) => handleChange('costA', v)} icon="$" />
          <InputRow label="Annual Energy" value={params.energyA} onChange={(v: any) => handleChange('energyA', v)} icon="$" />
          <InputRow label="Annual Maint" value={params.maintA} onChange={(v: any) => handleChange('maintA', v)} icon="$" />
          <InputRow label="Downtime Hrs/Yr" value={params.downtimeA} onChange={(v: any) => handleChange('downtimeA', v)} icon="H" />
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
              <span>Total NPV:</span>
              <span>${analysisA.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Option B */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-l-4 border-cyan-500 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-cyan-100 dark:bg-cyan-900 rounded-bl-xl text-xs font-bold text-cyan-700 dark:text-cyan-400">Premium Option</div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Option B (Premium)</h3>
          <InputRow label="Purchase Cost" value={params.costB} onChange={(v: any) => handleChange('costB', v)} icon="$" />
          <InputRow label="Annual Energy" value={params.energyB} onChange={(v: any) => handleChange('energyB', v)} icon="$" />
          <InputRow label="Annual Maint" value={params.maintB} onChange={(v: any) => handleChange('maintB', v)} icon="$" />
          <InputRow label="Downtime Hrs/Yr" value={params.downtimeB} onChange={(v: any) => handleChange('downtimeB', v)} icon="H" />
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between font-bold text-cyan-600 dark:text-cyan-400">
              <span>Total NPV:</span>
              <span>${analysisB.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Banner */}
      <div className={`p-6 rounded-xl border ${isBBetter ? 'bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800' : 'bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
              {isBBetter ? "Option B is the better investment" : "Option A is the better investment"}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You will save <strong className={isBBetter ? "text-cyan-600" : "text-slate-600"}>${Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> over {params.lifespan} years.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-bold">ROI / Savings</div>
            <div className="text-xl font-bold text-green-500">{savingsPercent.toFixed(1)}%</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-lg mt-6 border border-slate-200 dark:border-slate-800 h-80">
          <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
            <BarChart2 className="w-4 h-4 text-cyan-500" /> Cumulative Cost Analysis (Break-Even)
          </h4>
          <ReactECharts
            option={{
              animation: false,
              grid: { left: '15%', right: '5%', top: '15%', bottom: '15%' },
              tooltip: { 
                trigger: 'axis', 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: '#334155', 
                textStyle: { color: '#f8fafc' },
                formatter: (params: any) => {
                  let res = `<div class="font-bold border-b border-slate-700 pb-1 mb-1">Year ${params[0].value[0]}</div>`;
                  params.forEach((p: any) => {
                    res += `<div class="flex justify-between gap-4 mt-1"><span style="color:${p.color}">${p.seriesName}</span> <span class="font-mono">$${p.value[p.seriesIndex + 1].toLocaleString()}</span></div>`;
                  });
                  return res;
                }
              },
              legend: { data: ['Option A (Standard)', 'Option B (Premium)'], bottom: 0, textStyle: { color: chartColors.axis } },
              xAxis: { 
                type: 'value', 
                name: 'Years', 
                nameLocation: 'middle', 
                nameGap: 25, 
                splitLine: { show: false }, 
                axisLabel: { color: chartColors.axis } 
              },
              yAxis: { 
                type: 'value', 
                name: 'Cumulative Cost ($)', 
                splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, 
                axisLabel: { color: chartColors.axis, formatter: (val: number) => `$${val.toLocaleString()}` } 
              },
              series: [
                { name: 'Option A (Standard)', type: 'line', data: chartData.map(d => [d.year, d.costA, d.costB]), encode: { x: 0, y: 1 }, itemStyle: { color: '#94a3b8' }, lineStyle: { width: 3 } },
                { name: 'Option B (Premium)', type: 'line', data: chartData.map(d => [d.year, d.costA, d.costB]), encode: { x: 0, y: 2 }, itemStyle: { color: '#06b6d4' }, lineStyle: { width: 3 } }
              ]
            }}
            style={{ height: 'calc(100% - 30px)', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        {/* Live Math Rendering */}
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-lg mt-6 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto shadow-inner">
           <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
             <RotateCcw className="w-3 h-3 text-cyan-500" /> Live Equation (NPV for ${isBBetter ? 'Option B' : 'Option A'})
           </h4>
           <div className="text-sm">
             <BlockMath math={`\\text{NPV} = \\text{Capex} + \\sum_{t=1}^{${params.lifespan}} \\frac{\\text{Recurring Costs}}{(1 + ${params.discountRate/100} - ${params.inflationRate/100})^t} = \\mathbf{\\$${(isBBetter ? analysisB.npv : analysisA.npv).toLocaleString(undefined, { maximumFractionDigits: 0 })}}`} />
           </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Total Cost of Ownership (TCO) Theory</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Life Cycle Costing (LCC) is a rigorous economic analysis used to select the most cost-effective alternative over an asset's entire life span.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Capex (Capital Expenditure)"
          icon={<DollarSign className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The upfront cost to buy and install the equipment. This is the "Tip of the Iceberg", typically representing only <strong>10-20%</strong> of the total cost.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Opex (Operational Expenditure)"
          icon={<Activity className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The ongoing cost to run, maintain, and power the asset. This is the submerged part of the iceberg, commonly responsible for <strong>80-90%</strong> of the total lifetime cost.
          </p>
        </TheoryBlock>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">Net Present Value (NPV) Justification</h3>
        <TheoryBlock 
          title="The Time Value of Money"
          icon={<TrendingUp className="w-5 h-5" />}
          formula="\text{NPV} = \sum_{t=1}^{N} \frac{\text{Cash Flow}_t}{(1 + r)^t} - \text{Initial Investment}"
          delay={0.3}
        >
          <p>
            Money today is worth more than money tomorrow. A dollar spent 10 years from now mathematically hurts less than a dollar spent today due to the potential earning power of capital.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            LCC uses discounted cash flow analysis to convert all future Operational Expenditures into "Present Value" dollars. This allows for an equal comparison between a cheap asset with high running costs and an expensive asset with low running costs.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is a 'Discount Rate'?",
      answer: "The discount rate represents the 'Time Value of Money'. It is the interest rate you <em>could</em> earn if you invested the money elsewhere (e.g., 8%). A higher discount rate reduces the impact of future costs."
    },
    {
      question: "What is Residual Value?",
      answer: "The estimated scrap or resale value of the asset at the end of its useful life. This is subtracted from the total life cycle cost."
    },
    {
      question: "How does inflation affect LCC?",
      answer: "Inflation increases future Opex costs (labor, energy, parts). If inflation is high, the value of buying an efficient, low-maintenance asset today increases because future maintenance will be very expensive."
    }
  ];

  return (
    <ToolContentLayout
      title="Life Cycle Cost (LCC) Calculator"
      description="Compare the Total Cost of Ownership (TCO) of two options using Net Present Value (NPV) analysis. Make smarter investment decisions by looking beyond the price tag."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LCC Calculator",
        "applicationCategory": "FinanceApplication"
      }}
    />
  );
};

export default LccCalculator;
