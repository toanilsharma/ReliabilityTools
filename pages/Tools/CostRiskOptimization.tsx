import { Target, TrendingDown, DollarSign, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { BlockMath, InlineMath } from 'react-katex';

const CostRiskOptimization: React.FC = () => {
  const [beta, setBeta] = useState<number>(2.5);
  const [eta, setEta] = useState<number>(1000);
  const [cPM, setCPM] = useState<number>(500);
  const [cCM, setCCM] = useState<number>(5000);

  const { data, optimalTime, minCost } = useMemo(() => {
    if (beta <= 1) return { data: [], optimalTime: null as number | null, minCost: null as number | null };

    const points: Array<{ time: number; cost: number }> = [];
    let minC = Infinity;
    let optT = 0;

    const maxT = eta * 1.5;
    const steps = 400;
    const stepSize = maxT / steps;

    let integralR = 0;
    let prevR = 1;

    for (let i = 1; i <= steps; i++) {
      const t = i * stepSize;
      const r = Math.exp(-Math.pow(t / eta, beta));
      integralR += (prevR + r) / 2 * stepSize;
      prevR = r;
      const expectedCost = (cPM * r + cCM * (1 - r)) / integralR;

      if (expectedCost < minC) {
        minC = expectedCost;
        optT = t;
      }

      points.push({ time: t, cost: expectedCost });
    }

    return { data: points, optimalTime: optT, minCost: minC };
  }, [beta, eta, cPM, cCM]);

  const chartOption = {
    grid: { left: '10%', right: '5%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `PM interval: ${Number(p.value[0]).toFixed(1)}<br/>Cost: $${Number(p.value[1]).toFixed(2)} / hr`;
      }
    },
    xAxis: {
      type: 'value',
      name: 'PM Interval',
      nameLocation: 'middle' as const,
      nameGap: 25,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#cbd5e1', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      name: 'Expected Cost ($/hr)',
      axisLabel: { color: '#0ea5e9' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        name: 'Cost Curve',
        type: 'line',
        showSymbol: false,
        lineStyle: { width: 3, color: '#0ea5e9' },
        data: data.map((d) => [d.time, d.cost]),
      },
      ...(optimalTime ? [{
        name: 'Optimal',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#10b981' },
        data: [[optimalTime, minCost]],
      }] : []),
    ],
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 p-6 space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Component Reliability</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shape / Wear-out (beta)</label>
              <input type="number" step="0.1" min="1.1" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value) || 1.1)} className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded" />
              {beta <= 1 && <p className="text-xs text-red-500 mt-1">Beta must be greater than 1 for PM optimization.</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scale / Life (eta)</label>
              <input type="number" step="10" min="1" value={eta} onChange={(e) => setEta(parseFloat(e.target.value) || 100)} className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Financials</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Preventive Cost (PM)</label>
              <input type="number" step="10" min="0" value={cPM} onChange={(e) => setCPM(parseFloat(e.target.value) || 0)} className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-red-500" /> Corrective Cost (CM)</label>
              <input type="number" step="100" min="0" value={cCM} onChange={(e) => setCCM(parseFloat(e.target.value) || 0)} className="w-full text-sm p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded border-l-4 border-l-red-500" />
            </div>
          </div>
        </div>

        {optimalTime && (
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 py-4 px-6 rounded-lg text-center shadow-sm">
            <div className="text-xs font-bold text-emerald-600 uppercase mb-1 flex justify-center items-center gap-1"><Target className="w-4 h-4" /> Optimal PM Interval</div>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{optimalTime.toFixed(1)}</div>
            <div className="text-xs text-emerald-600 mt-1">Min. Cost: ${minCost?.toFixed(2)} / hr</div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl h-[500px] flex flex-col relative">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-4 px-4 pt-2">Cost per Unit Time vs PM Interval</h3>
          {beta <= 1 ? (
            <div className="flex-grow flex items-center justify-center text-slate-500 flex-col gap-2">
              <TrendingDown className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="font-bold">No Optimal Interval Exists</p>
              <p className="text-sm text-center max-w-xs">Because beta &lt;= 1, PM does not reduce expected cost. Run-to-failure is likely better.</p>
            </div>
          ) : (
            <div className="flex-grow min-h-0">
              <ReactECharts option={chartOption} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">The U-Shaped Cost Curve</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Age-based replacement logic creates a fundamental financial trade-off. This model identifies the exact interval that balances planned costs against the risk of catastrophic unplanned downtime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Total Cost of Ownership"
          icon={<DollarSign className="w-5 h-5" />}
          delay={0.1}
        >
          <p>
            The total cost rate is the expected value of maintenance over an infinite horizon, considering the probability of the asset surviving until the next scheduled intervention.
          </p>
          <div className="mt-4">
            <BlockMath math={"C(t) = \\frac{C_{pm} \cdot R(t) + C_{cm} \cdot [1-R(t)]}{\\int_0^t R(x)dx}"} />
          </div>
        </TheoryBlock>

        <TheoryBlock 
          title="Optimization Dynamics"
          icon={<TrendingDown className="w-5 h-5" />}
          delay={0.2}
        >
          <ul className="space-y-2 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Preventive Cost (<InlineMath math="C_{pm}" />):</strong> Low-cost, planned action. Reduces the probability of <InlineMath math="C_{cm}" />.</li>
            <li><strong>Corrective Cost (<InlineMath math="C_{cm}" />):</strong> High-cost failure event. Includes secondary damage and production losses.</li>
            <li><strong>The Bottom Loop:</strong> The tool solves the equation where <InlineMath math="\frac{d}{dt}C(t) = 0" /> to find the absolute financial sweet spot.</li>
          </ul>
        </TheoryBlock>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="Cost-Risk Optimization Curve"
      description="Find the financial sweet spot for preventative maintenance intervals using age replacement modeling."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Cost Risk Optimizer', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default CostRiskOptimization;

