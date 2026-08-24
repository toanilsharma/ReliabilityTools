import React, { useState, useMemo, useRef } from 'react';
import { DollarSign, Clock, Package, Wrench, AlertTriangle, CheckCircle2, Copy, Check, Share2, TrendingUp, BarChart2, Shield } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';
import AnimatedContainer from '../../components/AnimatedContainer';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { trackToolCalculation } from '../../utils/analytics';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface DowntimeCostState {
  duration: string;
  productionRate: string;
  profitPerUnit: string;
  laborCost: string;
}

const DowntimeCostCalculator: React.FC = () => {
  const [state, setState] = useState<DowntimeCostState>({
    duration: '8',
    productionRate: '500',
    profitPerUnit: '15.00',
    laborCost: '250.00'
  });

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toolRef = useRef<HTMLDivElement>(null);

  const { duration, productionRate, profitPerUnit, laborCost } = state;

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const d = parseFloat(duration);
    if (!duration || isNaN(d) || d < 0) {
      newErrors.duration = 'Enter a valid downtime duration in hours (≥ 0).';
      isValid = false;
    }

    const r = parseFloat(productionRate);
    if (!productionRate || isNaN(r) || r < 0) {
      newErrors.productionRate = 'Enter a valid production rate in units/hr (≥ 0).';
      isValid = false;
    }

    const p = parseFloat(profitPerUnit);
    if (!profitPerUnit || isNaN(p) || p < 0) {
      newErrors.profitPerUnit = 'Enter a valid profit/margin per unit ($ ≥ 0).';
      isValid = false;
    }

    const l = parseFloat(laborCost);
    if (!laborCost || isNaN(l) || l < 0) {
      newErrors.laborCost = 'Enter a valid labor & overhead rate ($/hr ≥ 0).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      trackToolCalculation('Downtime Cost Calculator', 'downtime-cost');
    }
  };

  const calculationResults = useMemo(() => {
    const d = parseFloat(duration) || 0;
    const r = parseFloat(productionRate) || 0;
    const p = parseFloat(profitPerUnit) || 0;
    const l = parseFloat(laborCost) || 0;

    const lostUnits = d * r;
    const lostRevenueProfit = lostUnits * p;
    const laborOverheadCost = d * l;
    const totalFinancialLoss = lostRevenueProfit + laborOverheadCost;

    const hourlyDowntimeCost = d > 0 ? totalFinancialLoss / d : 0;
    const hourlyProfitRate = r * p;
    const paybackHours = hourlyProfitRate > 0 ? totalFinancialLoss / hourlyProfitRate : 0;
    const paybackDays = paybackHours / 24;

    return {
      lostUnits,
      lostRevenueProfit,
      laborOverheadCost,
      totalFinancialLoss,
      hourlyDowntimeCost,
      paybackHours,
      paybackDays
    };
  }, [duration, productionRate, profitPerUnit, laborCost]);

  const handleCopySnippet = () => {
    const text = `Downtime Impact Analysis Summary:
- Downtime Duration: ${duration} hours
- Lost Production: ${calculationResults.lostUnits.toLocaleString()} units
- Total Financial Loss: $${calculationResults.totalFinancialLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Hourly Loss Rate: $${calculationResults.hourlyDowntimeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
- Operating Payback Period: ${calculationResults.paybackDays.toFixed(1)} days
Calculated via Reliability Tools: https://reliabilitytools.co.in/tools/downtime-cost/`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const faqs = [
    {
      question: 'What is included in the Total Downtime Cost formula?',
      answer: 'Total Downtime Cost combines both direct lost gross profit margin (Lost Production Units × Profit Margin per Unit) and unabsorbed fixed operating expenses (Downtime Duration × Labor/Overhead Hourly Rate).'
    },
    {
      question: 'How does downtime affect manufacturing payback period?',
      answer: 'The payback recovery period calculates the number of future operational 24-hour days the asset must run at 100% capacity solely to earn back the gross profit lost during the outage.'
    },
    {
      question: 'Why is labor/overhead included if workers are still paid standard salaries?',
      answer: 'When a line breaks down, idle operators and plant overhead costs (rent, lighting, HVAC) continue to incur expense without producing saleable output. This is unabsorbed overhead loss.'
    }
  ];

  const toolUI = (
    <div ref={toolRef} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <AnimatedContainer animation="slideUp" delay={0.1} className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCalculate} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-cyan-500" /> Operational Inputs
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Downtime Duration (hours)</span>
                <HelpTooltip text="Total elapsed breakdown and repair time in hours." />
              </label>
              <input
                type="number"
                step="any"
                value={duration}
                onChange={e => setState(s => ({ ...s, duration: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.duration && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Production Rate (units/hour)</span>
                <HelpTooltip text="The nameplate or target production speed per hour." />
              </label>
              <input
                type="number"
                step="any"
                value={productionRate}
                onChange={e => setState(s => ({ ...s, productionRate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.productionRate && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.productionRate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Profit / Margin per Unit ($)</span>
                <HelpTooltip text="Net profit margin earned per unit sold ($)." />
              </label>
              <input
                type="number"
                step="any"
                value={profitPerUnit}
                onChange={e => setState(s => ({ ...s, profitPerUnit: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.profitPerUnit && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.profitPerUnit}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Labor & Overhead Rate ($/hour)</span>
                <HelpTooltip text="Hourly wage of maintenance/operators + unabsorbed facility overhead." />
              </label>
              <input
                type="number"
                step="any"
                value={laborCost}
                onChange={e => setState(s => ({ ...s, laborCost: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.laborCost && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.laborCost}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Calculate Financial Loss
            </button>
          </form>
        </AnimatedContainer>

        {/* Results Panel */}
        <AnimatedContainer animation="slideUp" delay={0.2} className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 p-6 md:p-8 rounded-3xl border border-cyan-500/30 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">Financial Output Summary</span>
                <h4 className="text-2xl md:text-3xl font-black text-white mt-1">Total Downtime Cost</h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSnippet ? 'Copied Summary!' : 'Share Result'}
              </button>
            </div>

            {/* Metric Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Total Financial Loss</div>
                <div className="text-2xl md:text-3xl font-black text-rose-400">
                  ${calculationResults.totalFinancialLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Direct profit loss + overhead</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Hourly Loss Rate</div>
                <div className="text-2xl md:text-3xl font-black text-cyan-400">
                  ${calculationResults.hourlyDowntimeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Cost per downtime hour</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Lost Production Units</div>
                <div className="text-2xl md:text-3xl font-black text-amber-400">
                  {calculationResults.lostUnits.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Unproduced saleable units</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Lost Profit Margin</div>
                <div className="text-xl font-black text-white">
                  ${calculationResults.lostRevenueProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Unearned gross margin</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Labor & Overhead Loss</div>
                <div className="text-xl font-black text-white">
                  ${calculationResults.laborOverheadCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Wasted wages & utilities</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 mb-1">Payback Recovery Period</div>
                <div className="text-xl font-black text-emerald-400">
                  {calculationResults.paybackDays.toFixed(1)} Days
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">Operational days to recover loss</div>
              </div>
            </div>

            <ShareAndExport
              toolName="Downtime Cost Calculator"
              shareUrl="https://reliabilitytools.co.in/tools/downtime-cost/"
              resultSummary={`Total Loss: $${calculationResults.totalFinancialLoss.toFixed(2)}`}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );

  const theoryContent = (
    <div className="space-y-6">
      <h2>Understanding the True Cost of Equipment Downtime</h2>
      <p>
        In manufacturing and continuous processing plants, the real cost of downtime extends far beyond obvious repair bills. Unplanned outages drain profitability in two primary ways: <strong>Lost Contribution Margin</strong> (unproduced saleable product) and <strong>Unabsorbed Overhead</strong> (idle operator wages, plant rent, and energy utilities).
      </p>

      <h3>The Formula</h3>
      <p>The total financial loss from an unplanned breakdown is calculated as:</p>
      <BlockMath math="\text{Total Loss} = (\text{Downtime Hours} \times \text{Units/Hr} \times \text{Profit/Unit}) + (\text{Downtime Hours} \times \text{Labor Rate/Hr})" />

      <h3>Direct vs. Indirect Costs</h3>
      <ul>
        <li><strong>Direct Lost Profit:</strong> The profit margin that would have been earned if the line had run at nameplate speed.</li>
        <li><strong>Labor & Overhead:</strong> Salaries paid to idle operators plus baseline facility expenses incurred without producing output.</li>
        <li><strong>Recovery Period:</strong> The number of operating days required solely to earn back the lost financial margin.</li>
      </ul>
    </div>
  );

  return (
    <ToolContentLayout
      title="Downtime Cost Calculator"
      description="Calculate the true total financial impact of equipment breakdowns including lost gross margin, wasted labor overhead, and payback recovery periods."
      toolComponent={toolUI}
      content={theoryContent}
      faqs={faqs}
      keywords="downtime cost calculator, cost of downtime, equipment failure cost, manufacturing downtime, lost production cost"
      canonicalUrl="https://reliabilitytools.co.in/tools/downtime-cost/"
    />
  );
};

export default DowntimeCostCalculator;
