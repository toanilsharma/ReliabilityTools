import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { calculateAvailability } from '../../services/reliabilityMath';

const AvailabilityChartWidget: React.FC = () => {
  const [mtbf, setMtbf] = useState(1000);
  const [mttr, setMttr] = useState(8);

  const data = useMemo(() => {
    const points = [] as Array<{ hours: number; avail: number }>;
    for (let h = 1; h <= 48; h += 1) {
      points.push({ hours: h, avail: calculateAvailability(mtbf, h) });
    }
    return points;
  }, [mtbf]);

  const currentAvail = calculateAvailability(mtbf, mttr);

  const option = {
    grid: { left: '10%', right: '4%', bottom: '14%' },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `MTTR: ${p.value[0]} h<br/>Availability: ${Number(p.value[1]).toFixed(2)}%`;
      }
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        lineStyle: { color: '#06b6d4', width: 2.5 },
        areaStyle: { color: 'rgba(6,182,212,0.15)' },
        data: data.map((d) => [d.hours, d.avail]),
      },
      {
        type: 'scatter',
        symbolSize: 10,
        itemStyle: { color: '#ef4444' },
        data: [[mttr, currentAvail]],
      },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sensitivity: Availability vs MTTR</h3>

      <div className="space-y-6 mb-6">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>MTBF (Reliability)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{mtbf} hrs</span>
          </div>
          <input type="range" min="100" max="5000" step="100" value={mtbf} onChange={e => setMtbf(Number(e.target.value))} className="w-full accent-cyan-600" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Current MTTR</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{mttr} hrs</span>
          </div>
          <input type="range" min="1" max="48" step="1" value={mttr} onChange={e => setMttr(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>

      <div className="h-48 w-full mb-4 flex-grow">
        <ReactECharts option={option} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="text-center bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
        <div className="text-xs text-slate-500 uppercase">Resulting Availability</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{currentAvail.toFixed(3)}%</div>
      </div>
    </div>
  );
};

export default AvailabilityChartWidget;
