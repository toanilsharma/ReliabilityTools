
import React, { useState, useMemo } from 'react';
import { calculateAdvancedLCC } from '../../services/reliabilityMath';
import { DollarSign, TrendingUp, Activity, BookOpen, Target, Award, CheckCircle, AlertCircle, ArrowRight, Clock, Shield, AlertTriangle, Settings, Info, BarChart2 } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';

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
        <div className="flex gap-4">
          <div className="w-32">
            <label className="text-xs font-bold text-slate-500">Discount Rate %</label>
            <input type="number" value={params.discountRate} onChange={e => handleChange('discountRate', Number(e.target.value))} className="w-full p-1 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div className="w-32">
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
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is Life Cycle Costing (LCC)?</h2>
      <p>
        <strong>Life Cycle Costing</strong> is an economic analysis used to select the most cost-effective alternative over the asset's entire life span. It moves beyond "lowest purchase price" thinking to consider the Total Cost of Ownership (TCO).
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-red-500" /> Capex (Capital Expenditure)</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The upfront cost to buy and install. This is the "Tip of the Iceberg", typically only <strong>10-20%</strong> of the total cost.
          </p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-blue-500" /> Opex (Operational Expenditure)</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The ongoing cost to run, maintain, and power the asset. This is the submerged part of the iceberg, often <strong>80-90%</strong> of the total cost.
          </p>
        </div>
      </div>

      <h2 id="npv">Why uses Net Present Value (NPV)?</h2>
      <p>
        Money today is worth more than money tomorrow. A dollar spent 10 years from now is less painful than a dollar spent today.
      </p>
      <p>
        <strong>LCC</strong> uses discounted cash flow analysis to convert all future costs into "Present Value" dollars, allowing for a fair "apples-to-apples" comparison between a cheap asset with high running costs and an expensive asset with low running costs.
      </p>

      <h2 id="applications">Applications</h2>
      <ul>
        <li><strong>Equipment Selection:</strong> Choosing between a Standard Efficiency Motor ($1,000) and a Premium Efficiency Motor ($1,500).</li>
        <li><strong>Repair vs. Replace:</strong> Deciding whether to rebuild an old pump or buy a new one.</li>
        <li><strong>Project Justification:</strong> Proving that a higher initial investment will yield massive long-term savings.</li>
      </ul>
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
