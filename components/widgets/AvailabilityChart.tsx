
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { calculateAvailability } from '../../services/reliabilityMath';

const AvailabilityChartWidget: React.FC = () => {
  const [mtbf, setMtbf] = useState(1000);
  const [mttr, setMttr] = useState(8);

  const data = useMemo(() => {
    // Generate a curve of Availability vs MTTR for the fixed MTBF
    const points = [];
    for (let h = 1; h <= 48; h += 1) {
      points.push({
        hours: h,
        avail: calculateAvailability(mtbf, h),
        label: `${h}h`
      });
    }
    return points;
  }, [mtbf]);

  const currentAvail = calculateAvailability(mtbf, mttr);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sensitivity: Availability vs MTTR</h3>
      
      <div className="space-y-6 mb-6">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>MTBF (Reliability)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{mtbf} hrs</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            step="100" 
            value={mtbf} 
            onChange={e => setMtbf(Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Current MTTR (Repair Time)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{mttr} hrs</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="48" 
            step="1" 
            value={mttr} 
            onChange={e => setMttr(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      <div className="h-48 w-full mb-4 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="hours" stroke="#94a3b8" fontSize={10} tickCount={6} />
            <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} />
            <Tooltip 
              formatter={(val: number) => val.toFixed(2) + '%'}
              labelFormatter={(label) => `MTTR: ${label} hrs`}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="avail" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAvail)" />
            <ReferenceLine x={mttr} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Current', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
        <div className="text-xs text-slate-500 uppercase">Resulting Availability</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{currentAvail.toFixed(3)}%</div>
      </div>
    </div>
  );
};

export default AvailabilityChartWidget;
