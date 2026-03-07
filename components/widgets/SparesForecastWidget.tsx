import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { calculatePoissonDistribution } from '../../services/reliabilityMath';
import { HelpCircle } from 'lucide-react';

const SparesForecastWidget: React.FC = () => {
  const [mtbf, setMtbf] = useState(2000);
  const [qty, setQty] = useState(10);

  const lambda = (168 * qty) / mtbf;
  const data = useMemo(() => calculatePoissonDistribution(lambda, 6), [lambda]);

  const option = {
    grid: { left: '8%', right: '4%', bottom: '12%' },
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => `${p.value[0]} spares<br/>${Number(p.value[1]).toFixed(1)}% probability`,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.k),
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: (params: any) => params.dataIndex === Math.round(lambda) ? '#06b6d4' : '#cbd5e1',
          borderRadius: [4, 4, 0, 0],
        },
        data: data.map((d) => [d.k, d.percentage]),
      },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Demand Forecast</h3>
        <div className="group relative">
          <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
          <div className="invisible group-hover:visible absolute right-0 w-48 bg-slate-900 text-white text-xs p-2 rounded z-50">
            Probability of needing k spares in a single week based on Poisson distribution.
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">MTBF (Hrs)</label>
          <input type="number" value={mtbf} onChange={e => setMtbf(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Installed Qty</label>
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm" />
        </div>
      </div>

      <div className="h-40 w-full mb-2 flex-grow">
        <ReactECharts option={option} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="text-center text-xs text-slate-500 mt-2">
        Most likely demand: <strong className="text-slate-700 dark:text-slate-300">{Math.round(lambda)} parts/week</strong>
      </div>
    </div>
  );
};

export default SparesForecastWidget;
