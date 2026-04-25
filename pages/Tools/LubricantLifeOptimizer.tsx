import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Filter, ShieldCheck, Activity } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import HelpTooltip from '../../components/HelpTooltip';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';

const LubricantLifeOptimizer: React.FC = () => {
  // Inputs
  const [baseLife, setBaseLife] = useState<string>('10000');
  
  // Temp inputs
  const [baseTemp, setBaseTemp] = useState<string>('60');
  const [actualTemp, setActualTemp] = useState<string>('80');

  // Contamination inputs
  const [isoCurrent, setIsoCurrent] = useState<string>('21/18');
  const [isoTarget, setIsoTarget] = useState<string>('16/13');
  
  const [waterCurrent, setWaterCurrent] = useState<string>('1000');
  const [waterTarget, setWaterTarget] = useState<string>('200');

  // Outputs
  const [tempMultiplier, setTempMultiplier] = useState<number>(1);
  const [particleMultiplier, setParticleMultiplier] = useState<number>(1);
  const [waterMultiplier, setWaterMultiplier] = useState<number>(1);
  const [rulCurrent, setRulCurrent] = useState<number>(0);
  const [rulTarget, setRulTarget] = useState<number>(0);

  // Helper to parse ISO code first number
  const getIsoClass = (code: string) => {
    const parts = code.split('/');
    return parseInt(parts[0]) || 21;
  };

  const { theme } = useTheme();
  const chartColors = {
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    axis: theme === 'dark' ? '#94a3b8' : '#64748b',
    line: theme === 'dark' ? '#ef4444' : '#dc2626',
  };

  const generateTempCurve = React.useMemo(() => {
    const bl = parseFloat(baseLife) || 10000;
    const bt = parseFloat(baseTemp) || 60;
    
    const data = [];
    for (let t = 40; t <= 120; t += 2) {
      const life = bl * Math.pow(0.5, (t - bt) / 10);
      data.push([t, life]);
    }
    return data;
  }, [baseLife, baseTemp]);

  const calculateLife = () => {
    const bl = parseFloat(baseLife) || 10000;
    const bt = parseFloat(baseTemp) || 60;
    const at = parseFloat(actualTemp) || 60;
    
    // Arrhenius 10-Degree Rule (Halves every 10C above base)
    const tMult = Math.pow(0.5, (at - bt) / 10);
    setTempMultiplier(tMult);

    // Particle (ISO 4406) Extension based on Noria chart approximations
    // Every step reduction in ISO code (first number) gives approx 30% life extension
    const isoC = getIsoClass(isoCurrent);
    const isoT = getIsoClass(isoTarget);
    const pMultCurrent = 1.0; // Baseline is current
    const pMultTarget = Math.pow(1.3, (isoC - isoT)); 
    setParticleMultiplier(pMultTarget);

    // Water Contamination
    // Simplified approximation: life drops exponentially as ppm increases.
    // Assume 100ppm is ideal (1.0). 
    const wC = parseFloat(waterCurrent) || 1000;
    const wT = parseFloat(waterTarget) || 200;
    
    // Water life factor approx = (Base / Current) ^ 0.6
    const wMultCurrent = Math.min(1.0, Math.pow(100 / wC, 0.6));
    const wMultTarget = Math.min(1.0, Math.pow(100 / wT, 0.6));
    
    setWaterMultiplier(wMultTarget / wMultCurrent);

    // Calculate Remaining Useful Life
    const currentLife = bl * tMult * wMultCurrent * pMultCurrent;
    const targetLife = bl * tMult * wMultTarget * pMultTarget; // Assuming Temp stays same, only filtration improves
    
    setRulCurrent(currentLife);
    setRulTarget(targetLife);
  };

  useEffect(() => {
    calculateLife();
  }, [baseLife, baseTemp, actualTemp, isoCurrent, isoTarget, waterCurrent, waterTarget]);

  const isoOptions = [
    '22/19', '21/18', '20/17', '19/16', '18/15', '17/14', '16/13', '15/12', '14/11', '13/10'
  ];

  const ToolComponent = (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        
        {/* Baseline Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-500" /> Reference Baseline</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Base Oil Life (hrs)</label>
              <input type="number" value={baseLife} onChange={(e) => setBaseLife(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reference Temp (°C)</label>
              <input type="number" value={baseTemp} onChange={(e) => setBaseTemp(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Current State Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-red-500">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4">Current Condition</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temp °C</label>
              <input type="number" value={actualTemp} onChange={(e) => setActualTemp(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> ISO 4406</label>
              <select value={isoCurrent} onChange={(e) => setIsoCurrent(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white">
                {isoOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" /> Water ppm</label>
              <input type="number" value={waterCurrent} onChange={(e) => setWaterCurrent(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Target State Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-cyan-500">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-4">Target / Cleaned Condition</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Target ISO 4406</label>
              <select value={isoTarget} onChange={(e) => setIsoTarget(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white">
                {isoOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" /> Target Water ppm</label>
              <input type="number" value={waterTarget} onChange={(e) => setWaterTarget(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

      </div>

      <div className="space-y-6">
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden text-white">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Remaining Useful Life (RUL)</h3>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div>
              <div className="text-[10px] font-bold text-red-400 uppercase mb-2">Current Condition</div>
              <div className="text-4xl font-black font-mono tracking-tighter">
                {Math.round(rulCurrent).toLocaleString()}
                <span className="text-sm font-normal text-slate-400 ml-1">hrs</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase mb-2">Target Condition</div>
              <div className="text-4xl font-black font-mono tracking-tighter text-cyan-400">
                {Math.round(rulTarget).toLocaleString()}
                <span className="text-sm font-normal text-slate-400 ml-1">hrs</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Life Extension Factor:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {rulCurrent > 0 ? (rulTarget / rulCurrent).toFixed(2) : 0}x
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Temp Penalty</div>
            <div className={`font-mono font-bold ${tempMultiplier < 1 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {tempMultiplier.toFixed(2)}x
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">ISO Gain</div>
            <div className={`font-mono font-bold ${particleMultiplier > 1 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {particleMultiplier.toFixed(2)}x
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Water Gain</div>
            <div className={`font-mono font-bold ${waterMultiplier > 1 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {waterMultiplier.toFixed(2)}x
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
           <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Arrhenius Rate Formula (Temperature)</h4>
           <BlockMath math={"Life_{new} = Life_{base} \\times 0.5^{\\frac{T_{actual} - T_{base}}{10}}"} />
        </div>
        
        <div className="h-64 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-500" /> Temperature Degradation Curve
          </h4>
          <ReactECharts
            option={{
              animation: false,
              grid: { left: '15%', right: '5%', top: '10%', bottom: '20%' },
              tooltip: { trigger: 'axis', formatter: (p: any) => `Temp: ${p[0].value[0]}°C<br/>Base Life: ${Math.round(p[0].value[1]).toLocaleString()} hrs`, backgroundColor: 'rgba(15, 23, 42, 0.9)', textStyle: { color: '#f8fafc' }, borderColor: '#334155' },
              xAxis: { 
                type: 'value', 
                name: 'Temperature (°C)', 
                nameLocation: 'middle', 
                nameGap: 25, 
                splitLine: { show: false }, 
                axisLabel: { color: chartColors.axis } 
              },
              yAxis: { 
                type: 'value', 
                name: 'Base Life (hrs)',
                nameLocation: 'middle', 
                nameGap: 40, 
                splitLine: { lineStyle: { color: chartColors.grid, type: 'dashed' } }, 
                axisLabel: { color: chartColors.axis, formatter: (v: number) => (v / 1000) + 'k' } 
              },
              series: [{
                type: 'line',
                data: generateTempCurve,
                showSymbol: false,
                itemStyle: { color: chartColors.line },
                lineStyle: { width: 3 },
                areaStyle: { color: 'rgba(239, 68, 68, 0.1)' },
                markPoint: {
                  data: [
                    { name: 'Actual', value: 'Current', xAxis: parseFloat(actualTemp), yAxis: (parseFloat(baseLife) || 10000) * Math.pow(0.5, (parseFloat(actualTemp) - parseFloat(baseTemp)) / 10), itemStyle: { color: '#ef4444' } },
                    { name: 'Base', value: 'Base', xAxis: parseFloat(baseTemp), yAxis: parseFloat(baseLife), itemStyle: { color: '#3b82f6' } }
                  ]
                }
              }]
            }}
            style={{ height: 'calc(100% - 24px)', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Lubricant Life Optimization</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Predict remaining useful life (RUL) of industrial oils and assess the financial ROI of implementing better filtration, dehydration, and cooling systems.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock title="Arrhenius 10-Degree Rule" icon={<Thermometer className="w-5 h-5" />} delay={0.1}>
          <p>
            Thermal degradation of oil follows the Arrhenius chemical rate equation. A widely accepted rule of thumb is that for every 10°C (18°F) increase in operating temperature above a baseline (typically 60°C for mineral oils), the rate of oxidation doubles—cutting the oil's life in half.
          </p>
        </TheoryBlock>
        <TheoryBlock title="Particulate Contamination (ISO 4406)" icon={<Filter className="w-5 h-5" />} delay={0.2}>
          <p>
            According to life extension tables pioneered by Noria and SKF, reducing particulate contamination (moving to a lower ISO 4406 code) significantly reduces abrasive wear and prevents solid particles from acting as catalysts for oil oxidation.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="Lubricant Life Optimizer"
      description="Calculate Remaining Useful Life (RUL) based on Temperature, Water (ppm), and Particulate Contamination."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[
        {
          question: "How does water reduce oil life?",
          answer: "Water promotes oxidation, causes additive depletion (hydrolysis), and reduces the film strength of the lubricant. Keeping water levels below the saturation point (often < 200 ppm) is critical for maximizing both oil life and bearing life."
        },
        {
          question: "What does an ISO 4406 code mean?",
          answer: "It represents the number of particles >4μm, >6μm, and >14μm per mL of oil on a logarithmic scale. A drop of 1 in the ISO code represents halving the amount of particulate contamination in the system."
        }
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Lubricant Life Optimizer",
        "applicationCategory": "EngineeringApplication"
      }}
    />
  );
};

export default LubricantLifeOptimizer;
