
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  BarChart2, 
  BookOpen, 
  Calculator, 
  Check, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  Info, 
  Layout, 
  RefreshCcw, 
  Settings, 
  Target, 
  TrendingUp, 
  Trophy, 
  Zap,
  AlertTriangle,
  Shield,
  X 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ReferenceLine 
} from 'recharts';

/**
 * UTILITY COMPONENTS
 */

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "blue" }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const Confetti = () => {
  // Simple CSS-based confetti effect
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    bg: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 w-2 h-2 rounded-full animate-confetti opacity-0"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.bg,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

/**
 * SECTION 1: THEORY
 */

const BathtubCurve = () => (
  <div className="relative h-64 w-full bg-slate-50 rounded-lg border border-slate-100 p-4 mt-6">
    <h4 className="absolute top-4 left-4 text-sm font-bold text-slate-500 uppercase tracking-wider">The Bathtub Curve</h4>
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* Grid Lines */}
      <line x1="40" y1="180" x2="380" y2="180" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="40" y1="20" x2="40" y2="180" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Curve */}
      <path 
        d="M 40 40 Q 80 140 120 140 L 280 140 Q 340 140 380 40" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Labels */}
      <text x="25" y="15" className="text-[10px] fill-slate-400 font-bold" textAnchor="middle">Failure Rate</text>
      <text x="380" y="195" className="text-[10px] fill-slate-400 font-bold" textAnchor="middle">Time</text>
      
      {/* Regions */}
      <line x1="120" y1="180" x2="120" y2="20" stroke="#94a3b8" strokeDasharray="4" />
      <line x1="280" y1="180" x2="280" y2="20" stroke="#94a3b8" strokeDasharray="4" />
      
      <text x="80" y="170" className="text-[10px] fill-red-500 font-bold" textAnchor="middle">Infant Mortality</text>
      <text x="200" y="170" className="text-[10px] fill-emerald-600 font-bold" textAnchor="middle">Normal Life (Useful)</text>
      <text x="330" y="170" className="text-[10px] fill-orange-500 font-bold" textAnchor="middle">Wear Out</text>
    </svg>
    <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 italic">Failure Rate λ(t) vs Time</div>
  </div>
);

const TheorySection = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Concept */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Core Concepts
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-white hover:bg-slate-50 transition-colors rounded-lg border border-slate-200 shadow-sm group">
              <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">MTBF (Mean Time Between Failures)</h3>
              <p className="text-sm text-slate-600">The predicted elapsed time between inherent failures of a mechanical or electronic system during normal system operation. It is the primary measure of <strong className="text-blue-600">Reliability</strong>.</p>
            </div>
            <div className="p-4 bg-white hover:bg-slate-50 transition-colors rounded-lg border border-slate-200 shadow-sm group">
              <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-red-600 transition-colors">MTTR (Mean Time To Repair)</h3>
              <p className="text-sm text-slate-600">The average time required to repair a failed component or device. It includes diagnosis, repair, and testing. It is a measure of <strong className="text-blue-600">Maintainability</strong>.</p>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-1">Inherent Availability (Ai)</h3>
              <p className="text-sm text-blue-700">The steady-state availability considering only corrective maintenance (breakdowns) as defined in <strong>IEC 60050-192</strong>. It excludes scheduled maintenance, logistics delays, and supply shortages.</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 flex flex-col justify-center h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              The Golden Formula
            </h2>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center gap-4 text-2xl md:text-3xl font-mono text-slate-800">
                <span>Ai</span>
                <span>=</span>
                <div className="flex flex-col items-center group cursor-default">
                  <span className="border-b-2 border-slate-800 px-4 mb-1 w-full text-center group-hover:text-blue-600 transition-colors">MTBF</span>
                  <span className="text-lg md:text-xl text-slate-600 group-hover:text-emerald-600 transition-colors">MTBF + MTTR</span>
                </div>
              </div>
            </div>

            <BathtubCurve />
          </Card>
        </div>
      </div>

      {/* The Nines Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          The Cost of "Nines"
        </h2>
        <p className="text-slate-600 mb-6">Understanding what availability percentages actually mean in terms of annual downtime (based on 24/7/365 operation).</p>
        
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">"Nines"</th>
                <th className="px-6 py-4">Downtime / Year</th>
                <th className="px-6 py-4">Typical Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">90%</td>
                <td className="px-6 py-4">1 Nine</td>
                <td className="px-6 py-4 text-red-600 font-bold">36.5 days</td>
                <td className="px-6 py-4 text-slate-500">Personal Computer</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">99%</td>
                <td className="px-6 py-4">2 Nines</td>
                <td className="px-6 py-4 text-orange-600 font-bold">3.65 days</td>
                <td className="px-6 py-4 text-slate-500">Enterprise Server</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">99.9%</td>
                <td className="px-6 py-4">3 Nines</td>
                <td className="px-6 py-4 text-yellow-600 font-bold">8.76 hours</td>
                <td className="px-6 py-4 text-slate-500">ISP / Cloud Services</td>
              </tr>
              <tr className="bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 font-medium text-blue-700">99.99%</td>
                <td className="px-6 py-4">4 Nines</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">52.56 mins</td>
                <td className="px-6 py-4 text-slate-500">Payment Processors</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">99.999%</td>
                <td className="px-6 py-4">5 Nines</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">5.26 mins</td>
                <td className="px-6 py-4 text-slate-500">Telecommunications</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

/**
 * SECTION 2: SIMULATOR
 */

const DonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="15"
          fill="transparent"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#3b82f6"
          strokeWidth="15"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800">{percentage.toFixed(4)}%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">Availability</span>
      </div>
    </div>
  );
};

const RiskGauge = ({ availability }: { availability: number }) => {
  let riskLevel = "Low";
  let color = "text-emerald-600";
  let bg = "bg-emerald-50";
  let icon = <Shield className="w-5 h-5" />;

  if (availability < 0.95) {
    riskLevel = "Critical";
    color = "text-red-600";
    bg = "bg-red-50";
    icon = <AlertTriangle className="w-5 h-5" />;
  } else if (availability < 0.99) {
    riskLevel = "Moderate";
    color = "text-orange-600";
    bg = "bg-orange-50";
    icon = <Activity className="w-5 h-5" />;
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${bg} ${color.replace('text', 'border')} bg-opacity-50`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold">Risk Level</span>
      </div>
      <span className={`font-bold ${color}`}>{riskLevel}</span>
    </div>
  );
};

const SimulatorSection = () => {
  const [mtbf, setMtbf] = useState(1000);
  const [mttr, setMttr] = useState(10);
  const [hourlyRevenue, setHourlyRevenue] = useState(5000);
  const [operationMode, setOperationMode] = useState("24/7"); // "24/7" or "Business"

  const yearlyHours = operationMode === "24/7" ? 8760 : 2080; // 2080 = 40hrs * 52weeks

  const availability = useMemo(() => {
    if (mtbf < 0 || mttr < 0) return 0;
    const val = mtbf / (mtbf + mttr);
    return isNaN(val) ? 0 : val;
  }, [mtbf, mttr]);

  // Generate sensitivity data: Availability vs MTTR (keeping MTBF constant)
  // We want to show how increasing repair time hurts availability
  const sensitivityData = useMemo(() => {
    const data = [];
    // Generate a range from 1 to ~100 hours of MTTR (or up to 2x current MTTR for context)
    // Fixed range 0-50 provides good resolution for most engineering contexts.
    for (let r = 0; r <= 60; r += 2) {
      if (r === 0) continue;
      const avail = (mtbf / (mtbf + r)) * 100;
      data.push({
        mttr: r,
        availability: avail
      });
    }
    return data;
  }, [mtbf]);

  const downtimePercent = 1 - availability;
  const downtimeHoursPerYear = yearlyHours * downtimePercent;
  const yearlyLoss = downtimeHoursPerYear * hourlyRevenue;

  return (
    <div className="grid lg:grid-cols-12 gap-6 animate-fadeIn">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6 h-full border-t-4 border-t-blue-500">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Input Parameters
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">MTBF (Hours)</label>
                <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 rounded">{mtbf} h</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={mtbf}
                onChange={(e) => setMtbf(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                value={mtbf}
                onChange={(e) => setMtbf(Number(e.target.value))}
                className="mt-2 w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Reliability: Time between breakdowns.</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">MTTR (Hours)</label>
                <span className="text-sm font-mono text-red-600 bg-red-50 px-2 rounded">{mttr} h</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="60"
                step="0.5"
                value={mttr}
                onChange={(e) => setMttr(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
               <input
                type="number"
                value={mttr}
                onChange={(e) => setMttr(Number(e.target.value))}
                className="mt-2 w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Maintainability: Time to fix.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Operation Schedule</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setOperationMode("24/7")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${operationMode === "24/7" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    24/7 (8760h)
                  </button>
                  <button
                    onClick={() => setOperationMode("Business")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${operationMode === "Business" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Business (2080h)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Revenue Loss / Hour ($)</label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input 
                    type="number" 
                    value={hourlyRevenue}
                    onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                    className="w-full pl-7 p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Visuals & Results */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col items-center justify-center relative">
             <div className="absolute top-4 right-4">
               <Tooltip text="Visual representation of Inherent Availability" />
             </div>
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">System Health</h3>
             <DonutChart percentage={availability * 100} />
             <div className="w-full mt-6">
               <RiskGauge availability={availability} />
             </div>
          </Card>

          <Card className="p-6">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Annual Impact Analysis</h3>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <Clock className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-xs text-red-600 font-semibold uppercase">Total Downtime</div>
                      <div className="text-sm text-red-400">Per Year ({operationMode})</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-red-700 font-mono">
                    {downtimeHoursPerYear.toFixed(2)} hrs
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-600 font-semibold uppercase">Revenue at Risk</div>
                      <div className="text-sm text-emerald-400">Annual Projection</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    ${yearlyLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center mt-4">
                  Insight: Reducing MTTR from {mttr}h to {(mttr * 0.5).toFixed(1)}h would save 
                  <span className="text-emerald-600 font-bold ml-1">
                    ${(yearlyLoss - (yearlyHours * (1 - (mtbf/(mtbf+(mttr*0.5)))) * hourlyRevenue)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span> per year.
                </div>
             </div>
          </Card>
        </div>

        {/* Interactive Sensitivity Chart (The "Wow" Factor) */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Sensitivity: Availability vs MTTR
            </h3>
            <div className="text-xs text-slate-400">Fixed MTBF: {mtbf} hrs</div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensitivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="mttr" 
                  label={{ value: 'Repair Time (MTTR)', position: 'bottom', offset: 0, fontSize: 12 }} 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  domain={['auto', 100]} 
                  label={{ value: 'Availability %', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [`${Number(value).toFixed(3)}%`, 'Availability']}
                  labelFormatter={(label: any) => `MTTR: ${label} hours`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="availability" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAvail)" 
                  animationDuration={500}
                />
                {/* Current Operating Point */}
                <ReferenceLine 
                  x={mttr} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Current', 
                    fill: '#ef4444', 
                    fontSize: 12, 
                    position: 'insideTopRight' 
                  }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            This curve shows how quickly Availability drops as Repair Time increases.
          </p>
        </Card>
      </div>
    </div>
  );
};

/**
 * SECTION 3: QUIZ
 */

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  easy: [
    {
      id: 1,
      question: "What does MTBF stand for?",
      options: [
        "Maximum Time Before Failure",
        "Mean Time Between Failures",
        "Mean Time Before Fix",
        "Minimum Time Between Failures"
      ],
      correct: 1,
      explanation: "MTBF stands for Mean Time Between Failures. It is the predicted elapsed time between inherent failures of a mechanical or electronic system during normal system operation."
    },
    {
      id: 2,
      question: "Which metric represents the average time to fix a broken component?",
      options: ["MTBF", "MTTR", "MTTF", "ROI"],
      correct: 1,
      explanation: "MTTR (Mean Time To Repair) measures the average time required to repair a failed component or device."
    },
    {
      id: 3,
      question: "Which of the following best describes Availability?",
      options: [
        "How fast a machine runs",
        "The probability a system is operational when needed",
        "The cost of spare parts",
        "The total life of a machine"
      ],
      correct: 1,
      explanation: "Availability is the probability that a system, at a point in time, will be operational and able to perform its agreed function."
    },
    {
      id: 4,
      question: "If a machine never breaks down, what is its MTBF?",
      options: ["Zero", "Infinity", "100 hours", "Undefined"],
      correct: 1,
      explanation: "If a machine never fails, the time between failures is infinite, implying perfect reliability."
    },
    {
      id: 5,
      question: "What represents 'λ' (Lambda) in reliability engineering?",
      options: ["Repair Rate", "Failure Rate", "Availability", "Utilization"],
      correct: 1,
      explanation: "Lambda (λ) is the standard symbol for Failure Rate, which is the inverse of MTBF (λ = 1/MTBF)."
    }
  ],
  medium: [
    {
      id: 6,
      question: "If MTBF is 100 hours and MTTR is 100 hours, what is the Availability?",
      options: ["100%", "75%", "50%", "0%"],
      correct: 2,
      explanation: "Availability = MTBF / (MTBF + MTTR). 100 / (100 + 100) = 100 / 200 = 0.5 or 50%."
    },
    {
      id: 7,
      question: "Which action improves Availability the most?",
      options: ["Increasing MTTR", "Decreasing MTBF", "Decreasing MTTR", "Ignoring failures"],
      correct: 2,
      explanation: "Decreasing MTTR (fixing things faster) reduces the denominator in the formula A = MTBF/(MTBF+MTTR), thus increasing the total percentage."
    },
    {
      id: 8,
      question: "What describes the 'Useful Life' period of the Bathtub Curve?",
      options: ["High failure rate", "Constant failure rate", "Increasing failure rate", "Decreasing failure rate"],
      correct: 1,
      explanation: "The 'Useful Life' (bottom of the tub) is characterized by a constant failure rate, where failures are typically random."
    },
    {
      id: 9,
      question: "In a Series system (A-B), if A is 90% reliable and B is 90% reliable, what is the system reliability?",
      options: ["90%", "81%", "99%", "180%"],
      correct: 1,
      explanation: "In a series system, you multiply reliabilities. 0.9 * 0.9 = 0.81 or 81%. The system is less reliable than its weakest link."
    },
    {
      id: 10,
      question: "What is the difference between Inherent Availability (Ai) and Operational Availability (Ao)?",
      options: [
        "No difference",
        "Ai includes logistics delay, Ao does not",
        "Ao includes logistics and admin delays, Ai does not",
        "Ai is for software, Ao is for hardware"
      ],
      correct: 2,
      explanation: "Ai (Inherent) only considers breakdown/repair time. Ao (Operational) includes all delays, such as waiting for parts, logistics, and admin time."
    }
  ],
  master: [
    {
      id: 11,
      question: "A system runs 24/7. It requires 99.9% availability. How much downtime is allowed per year?",
      options: ["87.6 hours", "8.76 hours", "52 minutes", "3.65 days"],
      correct: 1,
      explanation: "There are 8,760 hours in a year. 0.1% unavailability is 0.001 * 8760 = 8.76 hours."
    },
    {
      id: 12,
      question: "Two redundant systems (Component A and B) are in parallel. Both have 90% availability. What is the total system availability?",
      options: ["90%", "99%", "81%", "180%"],
      correct: 1,
      explanation: "For parallel redundancy: A_total = 1 - ((1 - A1) * (1 - A2)). 1 - (0.1 * 0.1) = 1 - 0.01 = 0.99 or 99%."
    },
    {
      id: 13,
      question: "Which Weibull Shape Parameter (β) indicates 'Wear Out'?",
      options: ["β < 1", "β = 1", "β > 1", "β = 0"],
      correct: 2,
      explanation: "Beta > 1 indicates an increasing failure rate, typical of the wear-out phase. Beta < 1 is infant mortality, Beta = 1 is random failures."
    },
    {
      id: 14,
      question: "In a 'k-out-of-n' system where 2 out of 3 generators must work, this is an example of:",
      options: ["Series Reliability", "Full Parallel Redundancy", "Partial Redundancy", "Standby Redundancy"],
      correct: 2,
      explanation: "This is partial redundancy (voting logic). It is more reliable than a series system but less reliable than a full parallel system."
    },
    {
      id: 15,
      question: "If MTBF is doubled and MTTR is doubled, what happens to Availability?",
      options: ["It doubles", "It halves", "It stays the same", "It increases slightly"],
      correct: 2,
      explanation: "Formula: A = MTBF / (MTBF + MTTR). If we scale both by 2: 2M / (2M + 2R) = 2M / 2(M+R) = M/(M+R). The ratio remains identical."
    }
  ]
};

const QuizSection = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const questions = QUIZ_DATA[difficulty];
  const currentQ = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    const correct = index === currentQ.correct;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = (newDifficulty?: string) => {
    setDifficulty(newDifficulty || difficulty);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (showResult) {
    const isPerfect = score === questions.length;
    
    return (
      <div className="max-w-xl mx-auto animate-fadeIn relative">
        {isPerfect && <Confetti />}
        <Card className="p-12 text-center">
          <div className="mb-6 flex justify-center">
             {isPerfect ? (
               <div className="p-4 bg-yellow-100 rounded-full animate-bounce">
                 <Trophy className="w-16 h-16 text-yellow-600" />
               </div>
             ) : score > questions.length / 2 ? (
               <div className="p-4 bg-blue-100 rounded-full">
                 <Target className="w-12 h-12 text-blue-600" />
               </div>
             ) : (
                <div className="p-4 bg-slate-100 rounded-full">
                 <RefreshCcw className="w-12 h-12 text-slate-500" />
               </div>
             )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isPerfect ? "Perfect Score!" : "Quiz Complete!"}
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            You scored <strong className={`text-xl ${isPerfect ? "text-emerald-600" : "text-slate-900"}`}>{score}</strong> out of {questions.length} on <span className="capitalize font-bold">{difficulty}</span> mode.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => resetQuiz()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCcw className="w-4 h-4" /> Retry This Level
            </button>
            <div className="flex gap-2 justify-center">
               {['easy', 'medium', 'master'].map(level => (
                 level !== difficulty && (
                   <button
                    key={level}
                    onClick={() => resetQuiz(level)}
                    className="px-4 py-2 border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-lg capitalize transition-colors bg-white hover:bg-blue-50"
                   >
                     Try {level}
                   </button>
                 )
               ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Level Selector Header */}
      <div className="flex justify-center mb-8 gap-2">
        {['easy', 'medium', 'master'].map((level) => (
          <button
            key={level}
            onClick={() => resetQuiz(level)}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
              difficulty === level 
                ? 'bg-slate-900 text-white shadow-lg scale-110 ring-4 ring-slate-100' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:scale-105'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <Card className="p-8 relative overflow-visible">
        {/* Progress */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
           <div 
             className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
             style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
           />
        </div>

        <div className="mt-4 mb-8">
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</span>
             <Badge color={difficulty === 'master' ? 'purple' : difficulty === 'medium' ? 'blue' : 'green'}>{difficulty}</Badge>
          </div>
          <h3 className="text-xl font-medium text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-blue-400 hover:bg-slate-50 hover:shadow-md";
            
            if (selectedOption !== null) {
               if (idx === currentQ.correct) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500 shadow-sm";
               else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-200";
               else stateClass = "border-slate-100 text-slate-400 bg-slate-50 opacity-40";
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${stateClass}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedOption !== null && idx === currentQ.correct && <Check className="w-5 h-5 text-emerald-600" />}
                  {selectedOption !== null && idx === selectedOption && idx !== currentQ.correct && <X className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <div className="mt-6 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 animate-fadeIn shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded text-blue-600"><Info className="w-4 h-4" /></div>
              Explanation
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed pl-8">{currentQ.explanation}</p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * MAIN APP SHELL
 */

const App = () => {
  const [activeTab, setActiveTab] = useState('simulator');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm bg-opacity-80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('simulator')}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg text-white shadow-lg group-hover:shadow-blue-200 transition-all duration-300 group-hover:scale-105">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Reliability<span className="text-blue-600">Pro</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Engineering Suite</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
              {['theory', 'simulator', 'quiz'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeTab === tab 
                      ? 'text-blue-700 bg-white shadow-sm scale-100' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Bar */}
        <div className="flex md:hidden border-t border-slate-100 bg-white">
           {['theory', 'simulator', 'quiz'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                    : 'border-transparent text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'simulator' && <SimulatorSection />}
        {activeTab === 'quiz' && <QuizSection />}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2024 ReliabilityPro Engineering Suite. Commercial Grade.</p>
          <div className="flex gap-4 text-sm text-slate-400 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
      
      {/* Global Styles */}
      <style>{`
        .stripe-pattern {
          background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
          background-size: 1rem 1rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
