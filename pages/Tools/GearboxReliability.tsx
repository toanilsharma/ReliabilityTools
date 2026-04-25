import React, { useState, useEffect } from 'react';
import { Settings, Activity, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import HelpTooltip from '../../components/HelpTooltip';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';

const GearboxReliability: React.FC = () => {
  // Base Inputs
  const [calcStress, setCalcStress] = useState<string>('120000'); // Sc or St in psi
  const [allowStress, setAllowStress] = useState<string>('150000'); // Sac or Sat in psi
  const [cycles, setCycles] = useState<string>('10000000'); // N cycles
  const [stressType, setStressType] = useState<'contact' | 'bending'>('contact');
  
  // Modification Factors
  const [tempFactor, setTempFactor] = useState<string>('1.0'); // Kt
  
  // Outputs
  const [requiredKr, setRequiredKr] = useState<number | null>(null);
  const [reliabilityLevel, setReliabilityLevel] = useState<{percent: string, text: string, color: string} | null>(null);
  const [lifeFactor, setLifeFactor] = useState<number>(1.0);
  const { theme } = useTheme();

  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
  };

  const generateSNCurve = React.useMemo(() => {
    const data = [];
    for (let power = 4; power <= 10; power += 0.1) {
      const n = Math.pow(10, power);
      let lf = 1.0;
      if (stressType === 'contact') {
        lf = n < 1e7 ? 1.2 - 0.02 * Math.log10(n) : 1.44 - 0.063 * Math.log10(n);
      } else {
        lf = n < 3e6 ? 1.3 - 0.04 * Math.log10(n) : 1.6 - 0.08 * Math.log10(n);
      }
      data.push([n, lf]);
    }
    return data;
  }, [stressType]);

  const calculateAGMA = () => {
    const sc = parseFloat(calcStress);
    const sac = parseFloat(allowStress);
    const n = parseFloat(cycles);
    const kt = parseFloat(tempFactor);

    if (isNaN(sc) || isNaN(sac) || isNaN(n) || isNaN(kt) || sc <= 0 || sac <= 0 || n <= 0) {
      setRequiredKr(null);
      return;
    }

    // Simplified Life Factor (Zn or Yn) curve estimation for steel gears
    let lf = 1.0;
    if (stressType === 'contact') {
      // Zn for pitting
      if (n < 1e7) {
        lf = 1.2 - 0.02 * Math.log10(n); // rough approx
      } else {
        lf = 1.44 - 0.063 * Math.log10(n); // typical curve for >1e7
      }
    } else {
      // Yn for bending
      if (n < 3e6) {
        lf = 1.3 - 0.04 * Math.log10(n);
      } else {
        lf = 1.6 - 0.08 * Math.log10(n);
      }
    }
    setLifeFactor(lf);

    // AGMA Fundamental Rating Formula rearranged for Kr:
    // Sc <= (Sac * Zn) / (Kt * Kr)  => Kr <= (Sac * Zn) / (Sc * Kt)
    const kr = (sac * lf) / (sc * kt);
    setRequiredKr(kr);

    // Determine Reliability Level based on Kr
    if (kr >= 1.50) setReliabilityLevel({ percent: '99.99%', text: '1 failure in 10,000', color: 'text-emerald-500' });
    else if (kr >= 1.25) setReliabilityLevel({ percent: '99.9%', text: '1 failure in 1,000', color: 'text-cyan-500' });
    else if (kr >= 1.00) setReliabilityLevel({ percent: '99%', text: '1 failure in 100', color: 'text-blue-500' });
    else if (kr >= 0.85) setReliabilityLevel({ percent: '90%', text: '1 failure in 10', color: 'text-yellow-500' });
    else if (kr >= 0.70) setReliabilityLevel({ percent: '50%', text: '1 failure in 2', color: 'text-orange-500' });
    else setReliabilityLevel({ percent: '< 50%', text: 'High Risk of Failure', color: 'text-red-500' });
  };

  useEffect(() => {
    calculateAGMA();
  }, [calcStress, allowStress, cycles, tempFactor, stressType]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">Gear Stress Parameters</h3>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Analysis Type</label>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button 
                onClick={() => setStressType('contact')} 
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${stressType === 'contact' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Pitting (Contact Stress)
              </button>
              <button 
                onClick={() => setStressType('bending')} 
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${stressType === 'bending' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Bending Strength
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Calculated Stress ({stressType === 'contact' ? 'Sc' : 'St'})
                <HelpTooltip text="The actual operational stress calculated from torque, geometry, and application factors." />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={calcStress}
                  onChange={(e) => setCalcStress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 pr-12 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">psi</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Allowable Stress ({stressType === 'contact' ? 'Sac' : 'Sat'})
                <HelpTooltip text="Material allowable stress limit based on metallurgy and heat treatment." />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={allowStress}
                  onChange={(e) => setAllowStress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 pr-12 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">psi</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Expected Cycles (N)
                </label>
                <input
                  type="number"
                  value={cycles}
                  onChange={(e) => setCycles(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Temp Factor (Kt)
                </label>
                <input
                  type="number"
                  value={tempFactor}
                  onChange={(e) => setTempFactor(e.target.value)}
                  step="0.1"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">AGMA Standard Formula</h4>
           <BlockMath math={stressType === 'contact' ? "K_R \\le \\frac{S_{ac} \\cdot Z_N}{S_c \\cdot K_T}" : "K_R \\le \\frac{S_{at} \\cdot Y_N}{S_t \\cdot K_T}"} />
        </div>
      </div>

      <div className="space-y-6">
        {requiredKr !== null && reliabilityLevel ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Calculated Reliability Factor (K<sub className="lowercase">R</sub>)</h3>
              
              <div className="text-6xl font-black text-slate-900 dark:text-white mb-2 font-mono tracking-tighter">
                {requiredKr.toFixed(3)}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-500 uppercase mb-3">Estimated Statistical Reliability</div>
                <div className={`text-3xl font-black ${reliabilityLevel.color} flex items-center justify-center gap-3`}>
                  {requiredKr >= 1.0 ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  {reliabilityLevel.percent}
                </div>
                <div className="text-slate-500 mt-2 font-medium">{reliabilityLevel.text}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Life Factor ({stressType === 'contact' ? 'Zn' : 'Yn'})</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300">{lifeFactor.toFixed(3)}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Safety Margin</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300">{((requiredKr - 1) * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="mt-8 h-48 border-t border-slate-100 dark:border-slate-700 pt-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Life Factor Degradation Curve</div>
                <ReactECharts
                  option={{
                    animation: false,
                    grid: { left: '10%', right: '5%', top: '5%', bottom: '20%' },
                    tooltip: { trigger: 'axis', formatter: (p: any) => `Cycles: 10^${Math.log10(p[0].value[0]).toFixed(1)}<br/>Factor: ${p[0].value[1].toFixed(3)}` },
                    xAxis: { 
                      type: 'log', 
                      name: 'Cycles (N)', 
                      nameLocation: 'middle', 
                      nameGap: 20, 
                      splitLine: { show: false }, 
                      axisLabel: { color: chartColors.axis } 
                    },
                    yAxis: { 
                      type: 'value', 
                      min: 'dataMin', 
                      splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, 
                      axisLabel: { color: chartColors.axis } 
                    },
                    series: [{
                      type: 'line',
                      data: generateSNCurve,
                      showSymbol: false,
                      itemStyle: { color: '#0ea5e9' },
                      lineStyle: { width: 3 },
                      markLine: {
                        symbol: ['none', 'none'],
                        label: { show: false },
                        lineStyle: { color: '#ef4444', type: 'dashed' },
                        data: [{ xAxis: parseFloat(cycles) || 1e7 }]
                      }
                    }]
                  }}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-slate-400">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">Enter valid stress parameters to calculate reliability.</p>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
           <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-xs uppercase tracking-wide">
             <Info className="w-4 h-4 text-cyan-500" /> Standard AGMA K_R Values
           </h4>
           <div className="space-y-1 text-xs">
             {[
               { kr: '1.50', r: '99.99%', fail: '1 in 10,000' },
               { kr: '1.25', r: '99.9%', fail: '1 in 1,000' },
               { kr: '1.00', r: '99%', fail: '1 in 100' },
               { kr: '0.85', r: '90%', fail: '1 in 10' },
               { kr: '0.70', r: '50%', fail: '1 in 2' }
             ].map((row) => (
               <div key={row.kr} className="flex justify-between p-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
                 <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{row.kr}</span>
                 <span className="text-slate-500">{row.r}</span>
                 <span className="text-slate-400 w-20 text-right">{row.fail}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">ANSI/AGMA Gear Reliability</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Evaluate the statistical probability of gear failure based on contact stress (pitting) and bending strength using the fundamental AGMA 2001-D04 standards.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock title="Reliability Factor (KR)" icon={<Settings className="w-5 h-5" />} delay={0.1}>
          <p>
            The Reliability Factor ($K_R$ or $Y_Z$) accounts for the statistical distribution of material fatigue failures. Allowable stress numbers are generally based on a 99% reliability ($K_R = 1.0$, or 1 failure in 100). To achieve higher reliability for critical systems (like aerospace or power generation), a higher $K_R$ penalty factor must be applied.
          </p>
        </TheoryBlock>
        <TheoryBlock title="Life Factors (Zn & Yn)" icon={<Activity className="w-5 h-5" />} delay={0.2}>
          <p>
            The stress cycle factors for pitting resistance ($Z_N$) and bending strength ($Y_N$) adjust the allowable stress based on the total number of expected load cycles ($N$). As the required lifespan (cycles) increases, the allowable stress capacity of the gear tooth decreases due to fatigue accumulation.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="AGMA Gearbox Reliability"
      description="Calculate gear failure probability and required Reliability Factors (KR) per ANSI/AGMA 2001-D04."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[
        {
          question: "What is the difference between Contact and Bending stress?",
          answer: "Contact stress refers to the surface pressure between gear teeth that causes pitting fatigue. Bending stress refers to the load at the root of the tooth that can cause tooth breakage. Gearsets must be analyzed for both, and the lowest resulting reliability governs the gearbox."
        },
        {
          question: "Why use 99% as the baseline reliability?",
          answer: "AGMA material fatigue testing data establishes the baseline allowable stress curves at a 1% failure rate (99% reliability). For critical equipment, engineers increase the KR factor to 1.25 or 1.50 to reduce this failure probability."
        }
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AGMA Gear Reliability Calculator",
        "applicationCategory": "EngineeringApplication"
      }}
    />
  );
};

export default GearboxReliability;
