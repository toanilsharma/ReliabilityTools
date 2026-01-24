
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine } from 'recharts';
import { Settings, Clock, DollarSign, Shield, Activity, AlertTriangle, Trophy, Target, RefreshCcw, Check, X, HelpCircle } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';

// Utility Components
const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-cyan-500 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
    {children}
  </div>
);

// Simulator Components
const DonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        <circle cx="100" cy="100" r={radius} stroke="#e2e8f0" strokeWidth="15" fill="transparent" className="dark:stroke-slate-700" />
        <circle
          cx="100" cy="100" r={radius} stroke="#06b6d4" strokeWidth="15" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-white">{percentage.toFixed(4)}%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">Availability</span>
      </div>
    </div>
  );
};

const RiskGauge = ({ availability }: { availability: number }) => {
  let riskLevel = "Low";
  let color = "text-emerald-600 dark:text-emerald-400";
  let bg = "bg-emerald-50 dark:bg-emerald-900/20";
  let icon = <Shield className="w-5 h-5" />;

  if (availability < 0.95) {
    riskLevel = "Critical"; color = "text-red-600 dark:text-red-400"; bg = "bg-red-50 dark:bg-red-900/20"; icon = <AlertTriangle className="w-5 h-5" />;
  } else if (availability < 0.99) {
    riskLevel = "Moderate"; color = "text-orange-600 dark:text-orange-400"; bg = "bg-orange-50 dark:bg-orange-900/20"; icon = <Activity className="w-5 h-5" />;
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${bg} ${color.replace('text', 'border')} bg-opacity-50`}>
      <div className="flex items-center gap-2">
        {icon} <span className="font-bold text-slate-700 dark:text-slate-300">Risk Level</span>
      </div>
      <span className={`font-bold ${color}`}>{riskLevel}</span>
    </div>
  );
};

const AvailabilityCalculator: React.FC = () => {
  const [mtbf, setMtbf] = useState(1000);
  const [mttr, setMttr] = useState(10);
  const [hourlyRevenue, setHourlyRevenue] = useState(5000);
  const [operationMode, setOperationMode] = useState("24/7");

  const yearlyHours = operationMode === "24/7" ? 8760 : 2080;

  const availability = useMemo(() => {
    if (mtbf < 0 || mttr < 0) return 0;
    const val = mtbf / (mtbf + mttr);
    return isNaN(val) ? 0 : val;
  }, [mtbf, mttr]);

  const sensitivityData = useMemo(() => {
    const data = [];
    for (let r = 0; r <= 60; r += 2) {
      if (r === 0) continue;
      const avail = (mtbf / (mtbf + r)) * 100;
      data.push({ mttr: r, availability: avail });
    }
    return data;
  }, [mtbf]);

  const downtimePercent = 1 - availability;
  const downtimeHoursPerYear = yearlyHours * downtimePercent;
  const yearlyLoss = downtimeHoursPerYear * hourlyRevenue;


  const ToolComponent = (
    <div className="grid lg:grid-cols-12 gap-6 animate-fadeIn">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6 h-full border-t-4 border-t-cyan-500">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Input Parameters
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">MTBF (Hours)</label>
                <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 rounded">{mtbf} h</span>
              </div>
              <input type="range" min="100" max="10000" step="50" value={mtbf} onChange={(e) => setMtbf(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">MTTR (Hours)</label>
                <span className="text-sm font-mono text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 rounded">{mttr} h</span>
              </div>
              <input type="range" min="0.5" max="60" step="0.5" value={mttr} onChange={(e) => setMttr(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Operation Mode</label>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  {["24/7", "Business"].map(m => (
                    <button key={m} onClick={() => setOperationMode(m)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${operationMode === m ? "bg-white dark:bg-slate-600 text-cyan-600 dark:text-cyan-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revenue Loss / Hour ($)</label>
                <input type="number" value={hourlyRevenue} onChange={(e) => setHourlyRevenue(Number(e.target.value))} className="w-full mt-1 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4"><Tooltip text="Inherent Availability (Ai)" /></div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">System Health</h3>
            <DonutChart percentage={availability * 100} />
            <div className="w-full mt-6"><RiskGauge availability={availability} /></div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Annual Impact</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm"><Clock className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase">Total Downtime</div>
                    <div className="text-sm text-red-400 dark:text-red-300">Per Year</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-red-700 dark:text-red-400 font-mono">{downtimeHoursPerYear.toFixed(1)} hrs</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                  <div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Revenue Risk</div>
                    <div className="text-sm text-emerald-400 dark:text-emerald-300">Annual Projection</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">${yearlyLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Sensitivity Analysis: Impact of Repair Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensitivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="mttr" stroke="#94a3b8" fontSize={12} label={{ value: 'Repair Time (Hours)', position: 'bottom', offset: 0 }} />
                <YAxis domain={['auto', 100]} stroke="#94a3b8" fontSize={12} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(val: any) => Number(val).toFixed(2) + '%'} labelFormatter={(l: any) => `MTTR: ${l}h`} />
                <Area type="monotone" dataKey="availability" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAvail)" />
                <ReferenceLine x={mttr} stroke="#ec4899" strokeDasharray="3 3" label={{ value: 'Current', fill: '#ec4899', fontSize: 12, position: 'insideTopRight' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is Inherent Availability?</h2>
      <p>
        <strong>Inherent Availability (Ai)</strong> is the steady-state availability of a system when considering only corrective maintenance (breakdowns) in an ideal support environment. It is calculated as:
      </p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4 overflow-x-auto">
        Au = MTBF / (MTBF + MTTR)
      </div>
      <p>
        Where <strong>MTBF</strong> is Mean Time Between Failures (Reliability) and <strong>MTTR</strong> is Mean Time To Repair (Maintainability).
      </p>

      <h2 id="nines">The "Nine's" of Availability</h2>
      <p>
        In mission-critical systems (like data centers or aerospace), availability is often measured in "Nines". Here is what that means in downtime per year (24/7 operation):
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 my-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-bold text-xs">
            <tr>
              <th className="px-4 py-2">Availability</th>
              <th className="px-4 py-2">Downtime / Year</th>
              <th className="px-4 py-2">Typical Application</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
            <tr><td className="px-4 py-2 font-bold">99% (2 Nines)</td><td className="px-4 py-2 text-orange-500">3.65 days</td><td className="px-4 py-2">Enterprise Server</td></tr>
            <tr><td className="px-4 py-2 font-bold">99.9% (3 Nines)</td><td className="px-4 py-2 text-yellow-500">8.76 hours</td><td className="px-4 py-2">Cloud Service</td></tr>
            <tr><td className="px-4 py-2 font-bold">99.99% (4 Nines)</td><td className="px-4 py-2 text-emerald-500">52.56 mins</td><td className="px-4 py-2">Payment Gateway</td></tr>
            <tr><td className="px-4 py-2 font-bold">99.999% (5 Nines)</td><td className="px-4 py-2 text-emerald-600">5.26 mins</td><td className="px-4 py-2">Telecom / Carrier Grade</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="optimization">How to Improve Availability?</h2>
      <ol>
        <li><strong>Increase Reliability (MTBF):</strong> Use higher quality components, derate stress levels, and perform preventive maintenance.</li>
        <li><strong>Decrease Repair Time (MTTR):</strong> Improve modularity, keep spare parts on-site, and train technicians for faster diagnosis.</li>
        <li><strong>Add Redundancy:</strong> Use parallel systems (e.g., 2 pumps where only 1 is needed). This dramatically increases reliability.</li>
      </ol>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between Ai and Ao?",
      answer: "<strong>Ai (Inherent Availability)</strong> considers only repair time (MTTR). <strong>Ao (Operational Availability)</strong> includes logistics delays (Mean Down Time), administrative wait times, and preventive maintenance downtime. Ao is the 'real world' availability."
    },
    {
      question: "How do I calculate System Availability with redundancy?",
      answer: "For two parallel redundant units (where 1 success path is needed), Availability = 1 - (Unavailability_A * Unavailability_B). If component A and B are 90% available (0.9), unavailability is 0.1. System Unavailability = 0.1 * 0.1 = 0.01. System Availability = 99%."
    },
    {
      question: "Can Availability be greater than 100%?",
      answer: "No. Availability is a probability between 0 and 1 (or 0% and 100%)."
    }
  ];

  return (
    <ToolContentLayout
      title="Availability Calculator"
      description="Calculate Inherent Availability (Ai), visualize the impact of downtime in 'Nines', and simulate the financial risk of unreliability."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Availability Calculator",
        "applicationCategory": "BusinessApplication"
      }}
    />
  );
};

export default AvailabilityCalculator;
