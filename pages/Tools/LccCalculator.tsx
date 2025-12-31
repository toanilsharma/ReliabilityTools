
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  DollarSign, TrendingUp, Activity, BookOpen, Target, Award, CheckCircle, 
  AlertCircle, ChevronRight, BarChart2, Zap, Clock, Shield, RefreshCw, 
  PieChart, ArrowRight, Brain, Layers, Settings, AlertTriangle, 
  Info, TrendingDown, Play, Pause, ChevronDown, ChevronUp
} from 'lucide-react';

/**
 * --- DATA: QUESTION BANK (30+ Questions) ---
 */
const QUESTION_BANK = [
  // EASY
  { id: 1, level: 'easy', q: "What does LCC stand for?", options: ["Low Cost Calculation", "Life Cycle Cost", "Last Cycle Check", "Linear Cost Curve"], correct: 1, explanation: "LCC stands for Life Cycle Cost, the total cost of ownership over the life of an asset." },
  { id: 2, level: 'easy', q: "Which cost is typically the 'Tip of the Iceberg'?", options: ["Maintenance", "Energy", "Disposal", "Acquisition (Purchase)"], correct: 3, explanation: "Acquisition cost is visible upfront but usually represents only 10-15% of total costs." },
  { id: 3, level: 'easy', q: "What is MTBF?", options: ["Mean Time Between Failures", "Max Time Before Failure", "Mean Time Between Fixes", "Max Time Between Fixes"], correct: 0, explanation: "MTBF (Mean Time Between Failures) is a key reliability metric for repairable items." },
  { id: 4, level: 'easy', q: "Which phase of the Bathtub curve has a constant failure rate?", options: ["Infant Mortality", "Wear Out", "Useful Life", "End of Life"], correct: 2, explanation: "The 'Useful Life' phase is characterized by random failures and a constant failure rate." },
  { id: 5, level: 'easy', q: "Capex generally refers to:", options: ["Operational Expenditure", "Capital Expenditure", "Cost and Profit", "Cash and Price"], correct: 1, explanation: "Capex stands for Capital Expenditure, funds used to acquire or upgrade physical assets." },
  { id: 6, level: 'easy', q: "Opex includes which of the following?", options: ["Purchase Price", "Installation Cost", "Energy & Maintenance", "Commissioning"], correct: 2, explanation: "Opex (Operational Expenditure) covers ongoing costs like energy, maintenance, and labor." },
  { id: 7, level: 'easy', q: "A 'Lemon' asset is characterized by:", options: ["High Reliability", "Low Failure Rate", "Early and Frequent Failures", "Long Useful Life"], correct: 2, explanation: "Lemons suffer from infant mortality issues that persist or recur frequently." },
  { id: 8, level: 'easy', q: "Preventive Maintenance is performed:", options: ["After failure", "To fix a broken part", "On a schedule to prevent failure", "Only on holidays"], correct: 2, explanation: "PM is time-based or meter-based maintenance intended to prevent failures." },
  { id: 9, level: 'easy', q: "What is the primary goal of Reliability Engineering?", options: ["Fixing things fast", "Ensuring assets perform their function when required", "Buying the cheapest parts", "Eliminating all maintenance"], correct: 1, explanation: "Reliability is the probability that an item will perform its intended function for a specified interval." },
  { id: 10, level: 'easy', q: "If a motor efficiency increases, energy cost usually:", options: ["Increases", "Decreases", "Stays the same", "Doubles"], correct: 1, explanation: "Higher efficiency means less energy is wasted, reducing operating costs." },

  // MEDIUM
  { id: 11, level: 'medium', q: "What is Net Present Value (NPV)?", options: ["Inflation rate", "Future cash flows discounted to today's value", "Total cash spent", " ROI percentage"], correct: 1, explanation: "NPV accounts for the time value of money, converting future costs to present-day dollars." },
  { id: 12, level: 'medium', q: "Which maintenance strategy relies on sensor data?", options: ["Run-to-Failure", "Preventive", "Predictive (CBM)", "Reactive"], correct: 2, explanation: "Predictive maintenance (Condition Based Maintenance) uses data (vibration, heat) to predict failure." },
  { id: 13, level: 'medium', q: "On the P-F Curve, what is 'P'?", options: ["Potential Failure point", "Functional Failure point", "Prevention point", "Predictive point"], correct: 0, explanation: "'P' is the point where a potential failure can first be detected." },
  { id: 14, level: 'medium', q: "A high Discount Rate (e.g. 15%) favors:", options: ["Low Capex, High Opex", "High Capex, Low Opex", "Long lifespan assets", "Premium efficiency"], correct: 0, explanation: "High discount rates heavily reduce the value of future savings, favoring cheap upfront options." },
  { id: 15, level: 'medium', q: "What is the difference between Availability and Reliability?", options: ["No difference", "Availability includes repair time (MTTR)", "Reliability includes repair time", "Availability is only for software"], correct: 1, explanation: "Availability = MTBF / (MTBF + MTTR). It accounts for how quickly you can return to service." },
  { id: 16, level: 'medium', q: "Pareto Analysis (80/20 rule) in maintenance implies:", options: ["80% of costs come from 20% of assets", "80% of time is spent on 20% of repairs", "Both usually apply", "Neither applies"], correct: 2, explanation: "The Pareto principle is ubiquitous in reliability; a few 'bad actors' usually cause most costs." },
  { id: 17, level: 'medium', q: "What is RCM?", options: ["Rapid Cost Modeling", "Reliability Centered Maintenance", "Root Cause Monitor", "Random Check Method"], correct: 1, explanation: "RCM is a process to ensure that systems continue to do what their users require." },
  { id: 18, level: 'medium', q: "Which failure pattern is most common in complex electronics?", options: ["Bathtub", "Wear out only", "Infant Mortality followed by random", "Random constant failure"], correct: 2, explanation: "Complex electronics often show infant mortality then run randomly; they rarely wear out mechanically." },
  { id: 19, level: 'medium', q: "MTTR stands for:", options: ["Mean Time To Repair", "Max Time To Repair", "Mean Time To Restore", "Mean Technical Time Repair"], correct: 0, explanation: "MTTR measures maintainability—the average time to recover from a failure." },
  { id: 20, level: 'medium', q: "The cost of 'Unavailability' includes:", options: ["Spare parts", "Lost production / Profit opportunity", "Labor", "Shipping"], correct: 1, explanation: "Unavailability cost is the opportunity cost of not producing while the machine is down." },

  // PRO
  { id: 21, level: 'pro', q: "In Weibull Analysis, a Beta (β) < 1 indicates:", options: ["Wear Out", "Random Failures", "Infant Mortality", "Old Age"], correct: 2, explanation: "Beta < 1 implies a decreasing failure rate (Infant Mortality)." },
  { id: 22, level: 'pro', q: "What is the primary benefit of improving OEE?", options: ["Reducing labor", "Increasing manufacturing capacity without new Capex", "Reducing energy rates", "Lowering tax"], correct: 1, explanation: "Improving Overall Equipment Effectiveness unlocks 'hidden factory' capacity." },
  { id: 23, level: 'pro', q: "Hidden Failures are most critical in:", options: ["Pumps", "Protective Devices (Alarms/Trips)", "Motors", "Conveyors"], correct: 1, explanation: "Protective devices that fail silently (hidden) leave the system unprotected against catastrophe." },
  { id: 24, level: 'pro', q: "Calculate System Reliability: Two 0.9 reliability components in Parallel.", options: ["0.81", "0.90", "0.99", "0.18"], correct: 2, explanation: "R_sys = 1 - ((1-0.9) * (1-0.9)) = 1 - 0.01 = 0.99." },
  { id: 25, level: 'pro', q: "Which is NOT a valid method for determining PF Interval?", options: ["Experience/History", "Stress testing to destruction", "Guessing", "OEM Data"], correct: 2, explanation: "Guessing is not engineering. PF intervals must be based on data or tests." },
  { id: 26, level: 'pro', q: "Root Cause Analysis (RCA) '5 Whys' usually stops when:", options: ["You find a person to blame", "You reach a systemic or procedural cause", "You run out of time", "You find a broken part"], correct: 1, explanation: "RCA should find the systemic root (process/design), not just the physical symptom or human error." },
  { id: 27, level: 'pro', q: "Beta (β) = 1.0 in Weibull analysis represents:", options: ["Exponential Distribution (Constant Failure Rate)", "Normal Distribution", "Log-Normal", "Rayleigh"], correct: 0, explanation: "Beta = 1 denotes random failures, independent of time (useful life)." },
  { id: 28, level: 'pro', q: "If MTBF is 1000 hrs, what is reliability at 1000 hrs? (Exponential)", options: ["50%", "36.8%", "100%", "63.2%"], correct: 1, explanation: "R(t) = e^(-t/MTBF). R(1000) = e^-1 ≈ 0.368." },
  { id: 29, level: 'pro', q: "Lifecycle Cost Analysis should ideally use which cost model?", options: ["Nominal Costs", "Real Costs (Inflation adjusted)", "Whatever is easiest", "Capex only"], correct: 1, explanation: "Real cost models or discounted cash flow models accounting for inflation give the most accurate TCO." },
  { id: 30, level: 'pro', q: "The '6 Losses' of OEE do NOT include:", options: ["Breakdowns", "Setup/Adjustments", "Reduced Speed", "Planned Capital Upgrades"], correct: 3, explanation: "Planned capital work is not an OEE loss; OEE measures effectiveness during scheduled operating time." },
];

/**
 * --- UTILITIES ---
 */
const calculateAdvancedLCC = (params) => {
  const { 
    capex, energy, maint, downtimeHours, downtimeCostPerHour, 
    years, residual, discountRate, inflationRate 
  } = params;

  const r = discountRate / 100;
  const i = inflationRate / 100;
  
  // Real Discount Rate (Fisher Equation approx for low rates, or (1+r)/(1+i)-1 exact)
  // We will project cash flows with inflation, then discount with nominal rate.
  
  let npv = capex;
  let cumulativeData: any[] = [{ year: 0, cost: capex, cashFlow: capex }];
  let currentAccumulated = capex;

  const baseAnnualOpex = energy + maint + (downtimeHours * downtimeCostPerHour);

  for (let year = 1; year <= years; year++) {
    // Inflate costs
    const inflatedOpex = baseAnnualOpex * Math.pow(1 + i, year);
    
    // Discount to PV
    const pvOpex = inflatedOpex / Math.pow(1 + r, year);
    
    npv += pvOpex;
    
    // For chart, we often want "Accumulated Nominal" or "Accumulated PV". 
    // "Accumulated PV" is best for investment decision.
    currentAccumulated += pvOpex; 

    // Handle Residual in final year
    if (year === years && residual > 0) {
      const inflatedResidual = residual * Math.pow(1 + i, year); // Assets might inflate or depreciate. Usually market value.
      const pvResidual = inflatedResidual / Math.pow(1 + r, year);
      npv -= pvResidual;
      currentAccumulated -= pvResidual;
    }

    cumulativeData.push({ 
      year, 
      cost: currentAccumulated,
      annualNominal: inflatedOpex
    });
  }

  return { npv, cumulativeData, baseAnnualOpex };
};

const getRandomQuestions = (level, count = 5) => {
  const pool = QUESTION_BANK.filter(q => q.level === level);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const formatMoney = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * --- COMPONENTS ---
 */

/* 1. Theory Hub - Enhanced */
const TheoryHub = () => {
  const [activeModule, setActiveModule] = useState('lcc');

  const modules = [
    { id: 'lcc', label: 'The Iceberg Model', icon: Layers },
    { id: 'pf', label: 'The P-F Curve', icon: Activity },
    { id: 'bathtub', label: 'Failure Patterns', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Navigation */}
      <div className="flex flex-wrap gap-4 justify-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100 max-w-fit mx-auto">
        {modules.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeModule === m.id 
              ? 'bg-slate-900 text-white shadow-lg scale-105' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
        {activeModule === 'lcc' && (
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center animate-fadeIn">
            <div>
               <div className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wide mb-4">Core Concept</div>
               <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Total Cost of Ownership</h2>
               <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                 Amateurs look at the price tag. Professionals look at the <strong>Life Cycle Cost (LCC)</strong>.
               </p>
               <ul className="space-y-4">
                 {[
                   { title: "Acquisition (15%)", desc: "Design, Purchase, Installation, Commissioning" },
                   { title: "Operation (35%)", desc: "Energy, Operators, Cleaning, Setup" },
                   { title: "Maintenance (35%)", desc: "Labor, Spares, Lubrication, Overhauls" },
                   { title: "Disposal (15%)", desc: "Decommissioning, Removal, Environmental Fees" }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">{i+1}</div>
                     <div>
                       <h4 className="font-bold text-slate-900">{item.title}</h4>
                       <p className="text-sm text-slate-500">{item.desc}</p>
                     </div>
                   </li>
                 ))}
               </ul>
            </div>
            <div className="relative h-96 bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl p-8 flex flex-col items-center justify-center border border-sky-200">
               {/* Iceberg SVG Visualization */}
               <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                  {/* Water Line */}
                  <path d="M0 100 Q 75 110 150 100 T 300 100" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 5" />
                  
                  {/* Tip */}
                  <path d="M120 100 L 150 40 L 180 100 Z" fill="white" stroke="#94a3b8" strokeWidth="2" />
                  <text x="190" y="70" className="text-xs font-bold fill-slate-700">Capex (Visible)</text>
                  
                  {/* Submerged */}
                  <path d="M120 100 L 100 250 Q 150 280 200 250 L 180 100 Z" fill="url(#iceGradient)" stroke="#94a3b8" strokeWidth="2" />
                  <defs>
                    <linearGradient id="iceGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#bae6fd" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  
                  <text x="50" y="160" className="text-sm font-bold fill-slate-800">Energy</text>
                  <text x="50" y="190" className="text-sm font-bold fill-slate-800">Maintenance</text>
                  <text x="50" y="220" className="text-sm font-bold fill-slate-800">Downtime</text>
                  <line x1="120" y1="160" x2="90" y2="160" stroke="#64748b" />
                  <line x1="120" y1="190" x2="90" y2="190" stroke="#64748b" />
                  <line x1="130" y1="220" x2="90" y2="220" stroke="#64748b" />
               </svg>
            </div>
          </div>
        )}

        {activeModule === 'pf' && (
          <div className="p-8 md:p-12 animate-fadeIn">
             <div className="max-w-3xl mx-auto text-center mb-12">
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4">The P-F Curve</h2>
               <p className="text-slate-600">The fundamental concept of Condition Based Maintenance (CBM). We must detect failure before it becomes functional.</p>
             </div>
             
             <div className="relative h-80 w-full bg-slate-900 rounded-2xl p-6 shadow-inner overflow-hidden">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  {/* Axes */}
                  <line x1="50" y1="350" x2="750" y2="350" stroke="#475569" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#475569" strokeWidth="2" />
                  
                  {/* Curve */}
                  <path d="M 50 100 Q 400 100 600 350" fill="none" stroke="#22d3ee" strokeWidth="4" />
                  
                  {/* Points */}
                  <circle cx="250" cy="115" r="6" fill="#facc15" />
                  <text x="250" y="90" fill="white" textAnchor="middle" className="text-sm">P (Potential Failure)</text>
                  <text x="250" y="145" fill="#94a3b8" textAnchor="middle" className="text-xs">Vibration / Heat / Noise starts</text>
                  
                  <circle cx="600" cy="350" r="6" fill="#ef4444" />
                  <text x="600" y="380" fill="#ef4444" textAnchor="middle" className="font-bold">F (Functional Failure)</text>
                  
                  {/* Interval Line */}
                  <line x1="250" y1="200" x2="600" y2="200" stroke="white" strokeDasharray="5 5" />
                  <text x="425" y="190" fill="white" textAnchor="middle" className="font-bold">P-F Interval</text>
                  <text x="425" y="220" fill="#94a3b8" textAnchor="middle" className="text-xs">Window of Opportunity to Act</text>
                </svg>
             </div>
          </div>
        )}

        {activeModule === 'bathtub' && (
          <div className="p-8 md:p-12 animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">The Bathtub Curve</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <div className="text-red-600 font-bold mb-2">Phase 1: Infant Mortality</div>
                  <div className="h-20 flex items-end mb-4">
                     <svg viewBox="0 0 100 50" className="w-full h-full">
                       <path d="M0 0 Q 30 40 100 45" fill="none" stroke="#dc2626" strokeWidth="3" />
                     </svg>
                  </div>
                  <p className="text-sm text-slate-600">Decreasing failure rate. caused by manufacturing defects, poor installation, or design errors. "Burn-in" tests filter these out.</p>
               </div>
               <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="text-green-600 font-bold mb-2">Phase 2: Useful Life</div>
                  <div className="h-20 flex items-end mb-4">
                     <svg viewBox="0 0 100 50" className="w-full h-full">
                       <line x1="0" y1="45" x2="100" y2="45" stroke="#16a34a" strokeWidth="3" />
                     </svg>
                  </div>
                  <p className="text-sm text-slate-600">Constant failure rate. Random failures caused by stress exceeding strength. Maintenance is effective here.</p>
               </div>
               <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <div className="text-orange-600 font-bold mb-2">Phase 3: Wear Out</div>
                  <div className="h-20 flex items-end mb-4">
                     <svg viewBox="0 0 100 50" className="w-full h-full">
                       <path d="M0 45 Q 70 40 100 0" fill="none" stroke="#ea580c" strokeWidth="3" />
                     </svg>
                  </div>
                  <p className="text-sm text-slate-600">Increasing failure rate. Components degrade due to fatigue, corrosion, or friction. Replace before this slope spikes.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* 2. Commercial Simulator - Enhanced */
const ProSimulator = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState({
    currency: 'USD',
    discountRate: 8,
    inflationRate: 2,
    lifespan: 10,
    
    // Option A
    costA: 15000,
    energyA: 4000,
    maintA: 1200,
    downtimeA: 20, // Hours
    residualA: 0,
    
    // Option B
    costB: 22000,
    energyB: 2500,
    maintB: 400,
    downtimeB: 5, // Hours
    residualB: 2000,

    downtimeCost: 500 // per hour
  });

  const handleChange = (field, value) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const analysisA = useMemo(() => calculateAdvancedLCC({
    capex: params.costA, energy: params.energyA, maint: params.maintA, 
    downtimeHours: params.downtimeA, downtimeCostPerHour: params.downtimeCost,
    years: params.lifespan, residual: params.residualA, 
    discountRate: params.discountRate, inflationRate: params.inflationRate
  }), [params]);

  const analysisB = useMemo(() => calculateAdvancedLCC({
    capex: params.costB, energy: params.energyB, maint: params.maintB,
    downtimeHours: params.downtimeB, downtimeCostPerHour: params.downtimeCost,
    years: params.lifespan, residual: params.residualB,
    discountRate: params.discountRate, inflationRate: params.inflationRate
  }), [params]);

  const diff = analysisA.npv - analysisB.npv;
  const isBBetter = analysisB.npv < analysisA.npv;
  const savingsPercent = (Math.abs(diff) / analysisA.npv) * 100;
  
  // Breakeven logic (Cross over year)
  let breakevenYear = "Never";
  for(let i=1; i < analysisA.cumulativeData.length; i++) {
    if (analysisB.cumulativeData[i].cost < analysisA.cumulativeData[i].cost) {
      breakevenYear = `Year ${i}`;
      break;
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
               <Activity className="w-5 h-5" />
             </div>
             <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Analysis Engine</span>
           </div>
           <h2 className="text-3xl font-bold text-slate-900">Commercial LCC Simulator</h2>
           <p className="text-slate-500 mt-1">Compare Standard vs. Premium assets with inflation & downtime logic.</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium border ${showAdvanced ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            <Settings className="w-4 h-4" />
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* INPUT PANEL (Left - 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Global Settings */}
           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Project Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-500">Discount Rate (%)</label>
                    <input type="number" value={params.discountRate} onChange={e => handleChange('discountRate', Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 {showAdvanced && (
                   <div>
                      <label className="text-xs font-semibold text-slate-500">Inflation Rate (%)</label>
                      <input type="number" value={params.inflationRate} onChange={e => handleChange('inflationRate', Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                 )}
                 <div>
                    <label className="text-xs font-semibold text-slate-500">Lifespan (Yrs)</label>
                    <input type="number" value={params.lifespan} onChange={e => handleChange('lifespan', Number(e.target.value))} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 {showAdvanced && (
                   <div>
                      <label className="text-xs font-semibold text-slate-500">Downtime Cost ($/Hr)</label>
                      <input type="number" value={params.downtimeCost} onChange={e => handleChange('downtimeCost', Number(e.target.value))} className="w-full mt-1 p-2 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none" />
                   </div>
                 )}
              </div>
           </div>

           {/* Asset A */}
           <div className="bg-white p-5 rounded-xl border-l-4 border-slate-400 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 bg-slate-100 rounded-bl-xl text-xs font-bold text-slate-500">Standard Option</div>
              <h3 className="font-bold text-lg text-slate-800 mb-4">Option A</h3>
              <div className="space-y-3">
                 <InputRow label="Capex (Buy)" value={params.costA} onChange={v => handleChange('costA', v)} icon="$" />
                 <InputRow label="Annual Energy" value={params.energyA} onChange={v => handleChange('energyA', v)} icon="$" />
                 <InputRow label="Annual Maint" value={params.maintA} onChange={v => handleChange('maintA', v)} icon="$" />
                 {showAdvanced && (
                   <InputRow label="Downtime (Hrs/Yr)" value={params.downtimeA} onChange={v => handleChange('downtimeA', v)} icon="Hr" />
                 )}
              </div>
           </div>

           {/* Asset B */}
           <div className="bg-gradient-to-br from-white to-cyan-50 p-5 rounded-xl border-l-4 border-cyan-500 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 bg-cyan-100 rounded-bl-xl text-xs font-bold text-cyan-700">Premium Option</div>
              <h3 className="font-bold text-lg text-slate-800 mb-4">Option B</h3>
              <div className="space-y-3">
                 <InputRow label="Capex (Buy)" value={params.costB} onChange={v => handleChange('costB', v)} icon="$" bg="bg-white" />
                 <InputRow label="Annual Energy" value={params.energyB} onChange={v => handleChange('energyB', v)} icon="$" bg="bg-white" />
                 <InputRow label="Annual Maint" value={params.maintB} onChange={v => handleChange('maintB', v)} icon="$" bg="bg-white" />
                 {showAdvanced && (
                   <InputRow label="Downtime (Hrs/Yr)" value={params.downtimeB} onChange={v => handleChange('downtimeB', v)} icon="Hr" bg="bg-white" />
                 )}
                 {showAdvanced && (
                   <InputRow label="Residual Value" value={params.residualB} onChange={v => handleChange('residualB', v)} icon="$" bg="bg-white" />
                 )}
              </div>
           </div>
        </div>

        {/* OUTPUT PANEL (Right - 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
           {/* KPI CARDS */}
           <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                   <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total NPV Savings</div>
                   <div className="text-3xl font-bold tracking-tight text-emerald-400">
                     {formatMoney(Math.abs(diff), params.currency)}
                   </div>
                   <div className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-xs">{savingsPercent.toFixed(1)}%</span>
                     better than {isBBetter ? 'Option A' : 'Option B'}
                   </div>
                </div>
                {/* Background Decor */}
                <div className="absolute -right-4 -bottom-4 opacity-10 text-white transform rotate-12">
                   <DollarSign className="w-32 h-32" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                 <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-4">
                    <Clock className="w-4 h-4" /> Breakeven Point
                 </div>
                 <div className="text-3xl font-bold text-slate-800">{breakevenYear}</div>
                 <div className="text-xs text-slate-400 mt-2">Point where Premium investment pays off via Opex savings.</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                 <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-4">
                    <AlertTriangle className="w-4 h-4" /> Risk Exposure
                 </div>
                 <div className="text-lg font-medium text-slate-600">
                    <span className="font-bold text-slate-900">{formatMoney(analysisA.baseAnnualOpex - analysisB.baseAnnualOpex, params.currency)}</span> / yr
                 </div>
                 <div className="text-xs text-slate-400 mt-1">Annual cash flow risk (Energy + Maint + Downtime) avoided by choosing Option B.</div>
              </div>
           </div>

           {/* CHART AREA */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[450px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      Lifecycle Cost Accumulation (NPV)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Cumulative Present Value over {params.lifespan} years</p>
                 </div>
                 <div className="flex gap-6 text-xs font-bold bg-slate-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div> Option A
                    </div>
                    <div className="flex items-center gap-2 text-cyan-600">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div> Option B
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 relative w-full px-2 pb-6">
                 {(() => {
                    const maxVal = Math.max(
                      analysisA.cumulativeData[analysisA.cumulativeData.length-1].cost,
                      analysisB.cumulativeData[analysisB.cumulativeData.length-1].cost
                    ) * 1.1; // 10% buffer

                    // Helper to map data to SVG coordinates (0-100)
                    const getCoord = (data, idx) => {
                       const x = (idx / params.lifespan) * 100;
                       const y = 100 - ((data.cost / maxVal) * 100);
                       return [x, y];
                    };

                    // Create path commands
                    const createPath = (data) => {
                       return data.map((d, i) => {
                          const [x, y] = getCoord(d, i);
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                       }).join(' ');
                    };
                    
                    // Create area commands (close loop to bottom)
                    const createArea = (data) => {
                       const lineCmd = createPath(data);
                       return `${lineCmd} L 100 100 L 0 100 Z`;
                    };

                    const pathA = createPath(analysisA.cumulativeData);
                    const areaA = createArea(analysisA.cumulativeData);
                    
                    const pathB = createPath(analysisB.cumulativeData);
                    const areaB = createArea(analysisB.cumulativeData);

                    return (
                       <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                             <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0"/>
                             </linearGradient>
                             <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                             </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          {[0, 25, 50, 75, 100].map(y => (
                            <g key={y}>
                              <line x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                              <text x="-2" y={y + 1} className="text-[3px] fill-slate-300 text-right select-none" textAnchor="end">
                                 {formatMoney(maxVal * (1 - y/100), params.currency).replace('.00', '')}
                              </text>
                            </g>
                          ))}

                          {/* Option A (Standard) - Area & Line */}
                          <path d={areaA} fill="url(#gradA)" />
                          <path d={pathA} fill="none" stroke="#94a3b8" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
                          
                          {/* Option B (Premium) - Area & Line */}
                          <path d={areaB} fill="url(#gradB)" />
                          <path d={pathB} fill="none" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                          {/* End Points */}
                          <circle cx="100" cy={getCoord(analysisA.cumulativeData[analysisA.cumulativeData.length-1], params.lifespan)[1]} r="1.5" fill="#94a3b8" />
                          <circle cx="100" cy={getCoord(analysisB.cumulativeData[analysisB.cumulativeData.length-1], params.lifespan)[1]} r="1.5" fill="#06b6d4" />

                       </svg>
                    );
                 })()}
                 
                 {/* X Axis Labels */}
                 <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>Year 0</span>
                    <span>Year {Math.round(params.lifespan / 2)}</span>
                    <span>Year {params.lifespan}</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const InputRow = ({ label, value, onChange, icon, bg="bg-slate-50" }) => (
  <div className="flex items-center justify-between">
     <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
     <div className="relative w-32">
        <span className="absolute left-3 top-1.5 text-slate-400 text-xs font-bold">{icon}</span>
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(Number(e.target.value))}
          className={`w-full py-1 pl-8 pr-2 ${bg} border border-slate-200 rounded text-sm font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all`}
        />
     </div>
  </div>
);

/* 3. Random Quiz Engine - Commercial Grade */
const ProQuiz = () => {
  const [screen, setScreen] = useState('menu'); // menu, quiz, result
  const [level, setLevel] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = (lvl) => {
    setLevel(lvl);
    setQuestions(getRandomQuestions(lvl, 5));
    setCurrentIdx(0);
    setScore(0);
    setScreen('quiz');
    setSelected(null);
    setShowExplanation(false);
  };

  const handleOptionClick = (optIdx) => {
    if (selected !== null) return; // Block double clicks
    setSelected(optIdx);
    
    const isCorrect = optIdx === questions[currentIdx].correct;
    if (isCorrect) setScore(s => s + 1);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
       setCurrentIdx(p => p + 1);
       setSelected(null);
       setShowExplanation(false);
    } else {
       setScreen('result');
    }
  };

  const progress = ((currentIdx + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto min-h-[500px] animate-fadeIn">
       
       {screen === 'menu' && (
         <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
            <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <Award className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Reliability Certification</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Test your knowledge with our adaptive question bank. 5 random questions generated each time.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
               {[
                 { id: 'easy', label: 'Apprentice', color: 'hover:bg-green-50 hover:border-green-200', text: 'text-green-600' },
                 { id: 'medium', label: 'Practitioner', color: 'hover:bg-orange-50 hover:border-orange-200', text: 'text-orange-600' },
                 { id: 'pro', label: 'Expert', color: 'hover:bg-red-50 hover:border-red-200', text: 'text-red-600' }
               ].map((lvl) => (
                 <button
                   key={lvl.id}
                   onClick={() => startQuiz(lvl.id)}
                   className={`p-6 rounded-xl border border-slate-200 transition-all duration-300 group ${lvl.color}`}
                 >
                    <h3 className={`font-bold text-lg capitalize mb-1 ${lvl.text}`}>{lvl.id}</h3>
                    <p className="text-xs text-slate-400 group-hover:text-slate-600">{lvl.label} Level</p>
                 </button>
               ))}
            </div>
         </div>
       )}

       {screen === 'quiz' && questions.length > 0 && (
         <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100">
               <div className="h-full bg-cyan-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
            </div>

            <div className="p-8 md:p-12 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                     Question {currentIdx + 1} / {questions.length}
                  </span>
                  <span className="font-bold text-slate-300 capitalize">{level} Mode</span>
               </div>

               <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">
                  {questions[currentIdx].q}
               </h3>

               <div className="space-y-3 mb-8">
                  {questions[currentIdx].options.map((opt, idx) => {
                     let stateClass = "border-slate-200 hover:border-cyan-300 hover:bg-cyan-50";
                     if (selected !== null) {
                        if (idx === questions[currentIdx].correct) stateClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                        else if (idx === selected) stateClass = "border-red-500 bg-red-50 text-red-700";
                        else stateClass = "border-slate-100 opacity-40";
                     }

                     return (
                       <button
                         key={idx}
                         onClick={() => handleOptionClick(idx)}
                         disabled={selected !== null}
                         className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${stateClass}`}
                       >
                         <span>{opt}</span>
                         {selected !== null && idx === questions[currentIdx].correct && <CheckCircle className="w-5 h-5 text-green-600" />}
                         {selected === idx && idx !== questions[currentIdx].correct && <AlertCircle className="w-5 h-5 text-red-600" />}
                       </button>
                     )
                  })}
               </div>

               {/* Explanation Footer */}
               {showExplanation && (
                 <div className="mt-auto animate-fadeIn bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                       <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold text-slate-700 mb-1">Expert Note:</p>
                          <p className="text-sm text-slate-600">{questions[currentIdx].explanation}</p>
                       </div>
                    </div>
                    <button 
                      onClick={nextQuestion}
                      className="w-full mt-4 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               )}
            </div>
         </div>
       )}

       {screen === 'result' && (
         <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100 animate-fadeIn">
             <div className="relative inline-block mb-6">
                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                   <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                   <circle 
                     cx="50" cy="50" r="45" 
                     stroke={score >= 4 ? "#22c55e" : score >= 3 ? "#f59e0b" : "#ef4444"} 
                     strokeWidth="8" 
                     fill="none" 
                     strokeDasharray="283"
                     strokeDashoffset={283 - (283 * (score/questions.length))}
                     className="transition-all duration-1000 ease-out"
                   />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-3xl font-bold text-slate-900">{Math.round((score/questions.length)*100)}%</span>
                </div>
             </div>
             
             <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {score === 5 ? "Perfect Score! Certified Expert." : score >= 3 ? "Solid Performance." : "Review Theory & Try Again."}
             </h2>
             <p className="text-slate-500 mb-8">You got {score} out of {questions.length} correct.</p>

             <div className="flex gap-4 justify-center">
                <button onClick={() => setScreen('menu')} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                   Choose Level
                </button>
                <button onClick={() => startQuiz(level)} className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg">
                   Retry {level}
                </button>
             </div>
         </div>
       )}

    </div>
  );
};

/* 4. Main Layout */
const LccSuite = () => {
  const [activeTab, setActiveTab] = useState('simulator');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-200 selection:text-cyan-900">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('theory')}>
              <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-none">Reliability<span className="text-cyan-600">Pro</span></span>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Master Suite</span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex bg-slate-100/50 p-1 rounded-full">
              {[
                { id: 'theory', icon: BookOpen, label: 'Theory Hub' },
                { id: 'simulator', icon: Activity, label: 'Pro Simulator' },
                { id: 'quiz', icon: Award, label: 'Certification' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-md transform scale-105 ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-cyan-600' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <div className="md:hidden">
               <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-wider">{activeTab}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'theory' && <TheoryHub />}
        {activeTab === 'simulator' && <ProSimulator />}
        {activeTab === 'quiz' && <ProQuiz />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center gap-6 mb-6 opacity-30">
              <Shield className="w-6 h-6" />
              <Zap className="w-6 h-6" />
              <Globe className="w-6 h-6" />
              <Activity className="w-6 h-6" />
           </div>
           <p className="text-slate-400 text-sm font-medium">
             ReliabilityPro v3.0 • Commercial Grade Asset Management Suite
           </p>
           <p className="text-slate-300 text-xs mt-2">
             All calculations based on standard NPV & Reliability formulas including <strong>IEC 60300-3-3</strong>.
           </p>
        </div>
      </footer>

      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around z-50 pb-safe">
          {[
            { id: 'theory', icon: BookOpen, label: 'Learn' },
            { id: 'simulator', icon: Activity, label: 'Simulate' },
            { id: 'quiz', icon: Award, label: 'Quiz' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-xl w-full transition-all ${
                activeTab === tab.id ? 'text-cyan-600 bg-cyan-50' : 'text-slate-400'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

// Icon Helper
const Globe = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default LccSuite;
