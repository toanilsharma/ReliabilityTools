
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculatePoissonDistribution } from '../../services/reliabilityMath';
import { HelpCircle } from 'lucide-react';

const SparesForecastWidget: React.FC = () => {
  const [mtbf, setMtbf] = useState(2000);
  const [qty, setQty] = useState(10);
  
  // Weekly lambda: (Operating Hrs/Week * Qty) / MTBF
  // Assuming 24/7 operation = 168 hours/week
  const lambda = (168 * qty) / mtbf;
  
  const data = useMemo(() => calculatePoissonDistribution(lambda, 6), [lambda]);

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
          <input 
            type="number" 
            value={mtbf} 
            onChange={e => setMtbf(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Installed Qty</label>
          <input 
            type="number" 
            value={qty} 
            onChange={e => setQty(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm"
          />
        </div>
      </div>

      <div className="h-40 w-full mb-2 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="k" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-xs p-2 rounded shadow-xl border border-slate-700">
                      <p className="font-bold">{payload[0].payload.k} Spares</p>
                      <p>{Number(payload[0].value).toFixed(1)}% probability</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.k === Math.round(lambda) ? '#06b6d4' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center text-xs text-slate-500 mt-2">
        Most likely demand: <strong className="text-slate-700 dark:text-slate-300">{Math.round(lambda)} parts/week</strong>
      </div>
    </div>
  );
};

export default SparesForecastWidget;
