import React, { useState, useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import ToolContentLayout from '../../components/ToolContentLayout';

const WarrantyPrediction: React.FC = () => {
  const [beta, setBeta] = useState<number>(1.5);
  const [eta, setEta] = useState<number>(24);
  const [salesPerMonth, setSalesPerMonth] = useState<number>(1000);
  const [monthsOfSales, setMonthsOfSales] = useState<number>(12);
  const [warrantyLength, setWarrantyLength] = useState<number>(12);
  const [costPerReturn, setCostPerReturn] = useState<number>(250);

  const { forecast, summary } = useMemo(() => {
    const forecastData = [] as Array<{ month: number; failures: number; cost: number }>;
    let totalFailures = 0;

    for (let futureMonth = 1; futureMonth <= warrantyLength; futureMonth++) {
      let monthlyFailures = 0;
      for (let cohort = 1; cohort <= monthsOfSales; cohort++) {
        const ageAtStartOfMonth = (cohort - 1) + (futureMonth - 1);
        const ageAtEndOfMonth = ageAtStartOfMonth + 1;
        if (ageAtEndOfMonth > warrantyLength) continue;

        const cdfStart = 1 - Math.exp(-Math.pow(ageAtStartOfMonth / eta, beta));
        const cdfEnd = 1 - Math.exp(-Math.pow(ageAtEndOfMonth / eta, beta));
        monthlyFailures += salesPerMonth * (cdfEnd - cdfStart);
      }

      forecastData.push({ month: futureMonth, failures: monthlyFailures, cost: monthlyFailures * costPerReturn });
      totalFailures += monthlyFailures;
    }

    return { forecast: forecastData, summary: { totalFailures, liability: totalFailures * costPerReturn } };
  }, [beta, eta, salesPerMonth, monthsOfSales, warrantyLength, costPerReturn]);

  const option = {
    grid: { left: '8%', right: '8%', bottom: '12%' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' as const },
      formatter: (params: any[]) => {
        const units = params.find((p) => p.seriesName === 'Units');
        const cost = params.find((p) => p.seriesName === 'Cost');
        return `Month ${units.axisValue}<br/>Units: ${Number(units.value).toFixed(0)}<br/>Cost: $${Number(cost.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      }
    },
    xAxis: {
      type: 'category',
      name: 'Future Month',
      data: forecast.map((f) => f.month),
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Units Returned',
        axisLabel: { color: '#0ea5e9' },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      {
        type: 'value',
        name: 'Cost ($)',
        axisLabel: { color: '#f59e0b', formatter: (v: number) => `$${Math.round(v / 1000)}k` },
      }
    ],
    series: [
      {
        name: 'Units',
        type: 'bar',
        itemStyle: { color: '#0ea5e9' },
        data: forecast.map((f) => f.failures),
      },
      {
        name: 'Cost',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { color: '#f59e0b', width: 2 },
        data: forecast.map((f) => f.cost),
      },
    ],
  };

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">Product Reliability</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shape (beta)</label>
              <input type="number" step="0.1" value={beta} onChange={e => setBeta(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scale (eta mo)</label>
              <input type="number" step="1" value={eta} onChange={e => setEta(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
            </div>
          </div>

          <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6">Sales and Cost Data</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avg Sales / Month</label>
            <input type="number" value={salesPerMonth} onChange={e => setSalesPerMonth(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Past Months of Sales</label>
            <input type="number" value={monthsOfSales} onChange={e => setMonthsOfSales(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Warranty (mo)</label>
              <input type="number" value={warrantyLength} onChange={e => setWarrantyLength(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost / Return ($)</label>
              <input type="number" value={costPerReturn} onChange={e => setCostPerReturn(parseFloat(e.target.value) || 0)} className="w-full p-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-6 rounded-xl">
          <h3 className="text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5" /> Expected Warranty Liability</h3>
          <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mb-2">
            ${summary.liability.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-500">
            Predicted cost for {summary.totalFailures.toLocaleString(undefined, { maximumFractionDigits: 0 })} returned units over the next {warrantyLength} months.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="h-[500px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 px-4 pt-2">Forecasted Monthly Returns (Next {warrantyLength} Months)</h3>
          <div className="flex-grow min-h-0">
            <ReactECharts option={option} opts={{ renderer: 'svg' }} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2>Warranty Prediction Model</h2>
      <p>
        Forecast return volume and financial liability by combining Weibull reliability with cohort sales history.
      </p>
    </div>
  );

  return (
    <ToolContentLayout
      title="Warranty Prediction Model"
      description="Estimate future warranty liabilities and return volumes with industrial-scale chart rendering."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Warranty Forecaster', applicationCategory: 'BusinessApplication' }}
    />
  );
};

export default WarrantyPrediction;
