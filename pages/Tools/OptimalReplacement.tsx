import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calculateOptimalReplacementAge } from '../../services/reliabilityMath';
import ReactECharts from 'echarts-for-react';
import { RefreshCcw, AlertTriangle, Settings, Clock, Landmark } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const OptimalReplacement: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  const [costPreventive, setCostPreventive] = useState<string>('500');

  const [costFailure, setCostFailure] = useState<string>('5000');
  const [beta, setBeta] = useState<string>('2.5');
  const [eta, setEta] = useState<string>('10000');

  const result = useMemo(() => {
    const cp = parseFloat(costPreventive);
    const cf = parseFloat(costFailure);
    const b = parseFloat(beta);
    const e = parseFloat(eta);

    if (isNaN(cp) || isNaN(cf) || isNaN(b) || isNaN(e) || b <= 1) return null;
    return calculateOptimalReplacementAge(cp, cf, b, e);
  }, [costPreventive, costFailure, beta, eta]);

  const option = result ? {
    grid: { left: '10%', right: '5%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `Age: ${Number(p.value[0]).toFixed(1)} h<br/>Cost: $${Number(p.value[1]).toFixed(2)} / h`;
      }
    },
    xAxis: {
      type: 'value',
      name: 'Replacement Age (hours)',
      nameLocation: 'middle' as const,
      nameGap: 28,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      name: 'Cost / Hour ($)',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: '#06b6d4' },
        data: result.curve.map((c) => [c.t, c.costRate]),
      },
      {
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#ef4444' },
        data: [[result.optimalTime, result.minCostRate]],
      },
    ],
  } : null;

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-205 dark:border-slate-700/80 shadow-sm">
          <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Cost of Preventive (Cp)
                <HelpTooltip text="Planned replacement cost." />
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">$</span>
                </div>
                <input
                  type="number"
                  value={costPreventive}
                  onChange={e => setCostPreventive(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded-lg pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Cost of Failure (Cf)
                <HelpTooltip text="Unplanned failure cost including downtime." />
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">$</span>
                </div>
                <input
                  type="number"
                  value={costFailure}
                  onChange={e => setCostFailure(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded-lg pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Weibull Shape (beta)</label>
              <input
                type="number" step="0.1"
                value={beta}
                onChange={e => setBeta(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
              />
              {parseFloat(beta) <= 1 && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3" /> PM is ineffective for beta &lt;= 1
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Weibull Scale (eta)</label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="number"
                  value={eta}
                  onChange={e => setEta(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded-lg pl-4 pr-16 py-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative group">
                {/* Glowing blur background halo */}
                <div className="absolute -inset-0.5 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-700 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                
                <div className="bg-gradient-to-br from-cyan-600 to-blue-750 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="relative z-10">
                    <div className="text-xs font-bold uppercase opacity-85 mb-1">Optimal Replacement Age</div>
                    <div className="text-4xl font-extrabold mb-1">
                      {result.optimalTime.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-lg font-medium opacity-85">Hours</span>
                    </div>
                  </div>
                  <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Minimum Cost Rate</div>
                <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mb-1">
                  ${result.minCostRate.toFixed(2)} <span className="text-sm font-medium text-slate-500 dark:text-slate-500">/ Hour</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg h-[420px] flex flex-col">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Cost Optimization Curve</h3>
              <div className="flex-grow">
                <ReactECharts option={option!} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 p-12 text-center">
            <RefreshCcw className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">Input Data Needed</h3>
            <p className="max-w-md">Please ensure beta &gt; 1.0.</p>
          </div>
        )}
        <div className="mt-4">
          <ShareAndExport 
            toolName="Optimal Replacement Age"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={result ? `Opt: ${Math.round(result.optimalTime)}h` : ""}
            exportData={[
              { Parameter: "PM Cost (Cp)", Value: "$" + costPreventive },
              { Parameter: "CM Cost (Cf)", Value: "$" + costFailure },
              { Parameter: "Beta (Shape)", Value: beta },
              { Parameter: "Eta (Scale)", Value: eta },
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "Optimal Age", Value: result ? Math.round(result.optimalTime).toString() : "N/A" },
              { Parameter: "Min Cost Rate", Value: result ? "$" + result.minCostRate.toFixed(2) + "/hr" : "N/A" }
            ]}
          />
        </div>
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Understanding <span className="text-cyan-600 dark:text-cyan-400">Optimal Replacement Age</span> & Cost Rate Optimization
        </h2>
        <p>
          In modern maintenance management, finding the absolute lowest operating cost point is critical to optimizing capital spend. The <span className="font-extrabold text-cyan-600 dark:text-cyan-400">Optimal Replacement Age calculator</span> balances two opposing economic forces: the low cost of planned preventive maintenance (<InlineMath math="C_p" />) and the high financial penalty of unplanned corrective maintenance failures (<InlineMath math="C_f" />). By mathematically modeling equipment wear-out rates, maintenance managers can shift from reactive firefighting to high-precision scheduling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The Cost Equation"
          icon={<Settings className="w-5 h-5 text-cyan-600" />}
          delay={0.1}
        >
          <p>
            The optimization engine calculates the expected cost rate per unit time <InlineMath math="C(t_p)" /> using the renewal reward theorem formula:
            <BlockMath math="C(t_p) = \frac{C_p \cdot R(t_p) + C_f \cdot [1 - R(t_p)]}{\int_{0}^{t_p} R(t) dt}" />
            Where <InlineMath math="R(t)" /> represents the reliability function over time modeled using Weibull statistics:
            <BlockMath math="R(t) = e^{-(t/\eta)^\beta}" />
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Prerequisites for PM Effectiveness"
          icon={<AlertTriangle className="w-5 h-5 text-rose-650" />}
          delay={0.2}
        >
          <ul className="space-y-2 mt-2 text-sm">
            <li><strong className="text-amber-600 dark:text-amber-400">Wear-Out Profile (β &gt; 1):</strong> The asset must exhibit progressive aging (Weibull shape <InlineMath math="\beta > 1" />). Preventive maintenance is useless for purely random failure modes.</li>
            <li><strong className="text-rose-600 dark:text-rose-455">Economic Penalty (Cf &gt; Cp):</strong> The cost of unplanned failures (<InlineMath math="C_f" />) must be strictly greater than planned replacement (<InlineMath math="C_p" />). If they are equal, it is always cheaper to run-to-failure.</li>
          </ul>
        </TheoryBlock>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
        📖 Complete Step-by-Step Practical Example
      </h3>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: Define the Costs and Parameters</span>
          <p className="mt-1">
            Imagine you operate a critical mining conveyor belt motor:
            <br />
            &nbsp;&nbsp;• Planned preventive cost: <InlineMath math="C_p = \$500" />
            <br />
            &nbsp;&nbsp;• Corrective failure cost: <InlineMath math="C_f = \$5{,}000" /> (includes emergency repairs and lost production downtime)
            <br />
            &nbsp;&nbsp;• Weibull shape parameter: <InlineMath math="\beta = 2.5" /> (definite wear-out signature)
            <br />
            &nbsp;&nbsp;• Weibull scale parameter: <InlineMath math="\eta = 10{,}000 \text{ hours}" /> (characteristic operating lifespan)
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Understand the Economic Trade-Off</span>
          <p className="mt-1">
            Unplanned failure is 10 times more expensive than planned maintenance (<InlineMath math="C_f/C_p = 10" />). If we replace the motor too early, we waste its remaining life; if we replace it too late, we risk a catastrophic $5,000 breakdown.
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 3: Solve for the Minimum Cost Rate</span>
          <p className="mt-1">
            This tool evaluates the cost rate function <InlineMath math="C(t_p)" /> across an array of possible replacement intervals. The resulting cost curve behaves as a U-shape.
            <BlockMath math="\text{Optimal Replacement Age } t_p^* = 3{,}907 \text{ operating hours}" />
            At this specific point, the expected long-term maintenance cost rate is minimized at its lowest possible value of <strong>$0.15 / hour</strong>.
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
          <span className="font-bold text-slate-800 dark:text-slate-100">💡 Conclusion in Simple Words:</span>
          <p className="mt-1 text-slate-650 dark:text-slate-400">
            "Instead of waiting for the motor to fail at its characteristic lifetime of 10,000 hours (which results in a costly $5,050 shutdown), the plant should schedule a proactive preventive replacement every <strong>3,907 operating hours</strong>. This strategy yields the lowest overall maintenance expenditure."
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-cyan-600" /> Industrial Engineering Standards
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Determining the optimal age for preventive component replacement is aligned with standard global frameworks in asset lifecycle optimization:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>ISO 55000 / ISO 55001:</strong> Asset Management — Guidelines for optimizing physical assets across their entire lifecycle to minimize risk and cost.</li>
          <li><strong>SAE JA1011 / JA1012:</strong> Evaluation Criteria for Reliability-Centered Maintenance (RCM) processes, validating the mathematical feasibility of preventive tasks.</li>
          <li><strong>BS EN 60300-3-11:</strong> Dependability Management Application Guide for RCM, structuring scheduled task selections.</li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "Why is preventive replacement ineffective when the Weibull shape parameter (β) is 1.0 or less?",
      answer: "When β = 1.0, the component exhibits a constant failure rate (random failures), which means it does not wear out or age. An old component is just as reliable as a brand new one. Replacing a working unit preventively has zero impact on reducing future failures, and simply wastes the replacement cost Cp. If β < 1.0, the failure rate decreases over time (infant mortality), and replacing it actually increases system failure risk."
    },
    {
      question: "What costs should be included in the 'Cost of Failure' (Cf)?",
      answer: "The Cost of Failure must reflect the total financial impact of an unplanned breakdown. This includes the cost of replacement hardware, immediate shipping charges, emergency labor rates, safety cleanup fees, and most importantly, the lost production revenue due to downtime. In many industries, production losses represent over 90% of the total Cf."
    },
    {
      question: "How does the ratio of Cf to Cp affect the optimal replacement interval?",
      answer: "The higher the failure cost Cf relative to planned cost Cp, the earlier you should replace the component. For example, if a failure costs 100 times more than preventive action, the optimal age will shrink significantly to avoid failure. If the costs are close (e.g. Cf ≈ Cp), the optimal replacement age moves closer to the characteristic life (η)."
    },
    {
      question: "What is the difference between Age-Based and Calendar-Based replacement?",
      answer: "An Age-Based Replacement Policy replaces a component when it reaches a specific operating age (such as 4,000 running hours) or immediately upon failure. A Calendar-Based (Block) Policy replaces components at fixed calendar intervals (e.g., every 6 months) regardless of individual running hours. Age-based policy is statistically more optimal but requires tracking cumulative runtime for every component, whereas calendar-based policy is simpler to schedule."
    },
    {
      question: "How are Weibull parameters (β and η) obtained for this calculation?",
      answer: "These parameters are calculated by analyzing historical failure times (life data) of the asset class. By gathering the operational lifetimes of failed components, you can fit them to a Weibull probability plot. This can be done directly online using our integrated Weibull Analysis Tool, which extracts the shape (β) and scale (η) parameters automatically from your data."
    }
  ];

  return (
    <ToolContentLayout
      title="Optimal Replacement Age Calculator"
      description="Determine the preventive maintenance interval that minimizes total operating cost."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="optimal replacement age, group replacement policy, block replacement, Weibull replacement age, wear out replacement, maintenance replacement interval, reliability engineering calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/optimal-replacement"
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Optimal Replacement Age Calculator', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default OptimalReplacement;

