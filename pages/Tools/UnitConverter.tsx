
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightLeft, Thermometer, Clock, Gauge, Zap, Activity, Droplets, RotateCw, Ruler, Waves, Weight, Beaker, Hammer, Landmark
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { InlineMath, BlockMath } from 'react-katex';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


// Helper for card styling
interface ConversionCardProps {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}

const ConversionCard: React.FC<ConversionCardProps> = ({
  title,
  icon: Icon,
  color,
  children
}) => {
  const textColor = color.replace('bg-', 'text-');
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-cyan-500/5 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 ${color} bg-opacity-5 dark:bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${textColor}`} />
          <h3 className="font-extrabold text-slate-900 dark:text-white tracking-wide">{title}</h3>
        </div>
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({
  label,
  unit,
  value,
  onChange
}: {
  label: string;
  unit: string;
  value: string | number;
  onChange: (val: string) => void;
}) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-3 pr-14 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm transition-all h-10"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550">{unit}</span>
      </div>
    </div>
  </div>
);

const UnitConverter: React.FC = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  // Time State
  const [hours, setHours] = useState<string>('8760');

  const [years, setYears] = useState<string>('1');
  const [days, setDays] = useState<string>('365');

  // Temp State
  const [celsius, setCelsius] = useState<string>('100');
  const [fahrenheit, setFahrenheit] = useState<string>('212');

  // Pressure State
  const [psi, setPsi] = useState<string>('100');
  const [bar, setBar] = useState<string>('6.89');

  // Power State
  const [kw, setKw] = useState<string>('75');
  const [hp, setHp] = useState<string>('100');

  // Vibration State
  const [ips, setIps] = useState<string>('0.15');
  const [mms, setMms] = useState<string>('3.81');

  // Flow State
  const [gpm, setGpm] = useState<string>('100');
  const [m3h, setM3h] = useState<string>('22.71');

  // Torque State
  const [nm, setNm] = useState<string>('100');
  const [ftlb, setFtlb] = useState<string>('73.76');

  // Length (Precision)
  const [mils, setMils] = useState<string>('1');
  const [microns, setMicrons] = useState<string>('25.4');

  // Frequency
  const [hz, setHz] = useState<string>('60');
  const [cpm, setCpm] = useState<string>('3600');

  // Mass
  const [kg, setKg] = useState<string>('100');
  const [lbs, setLbs] = useState<string>('220.46');

  // Force
  const [newtons, setNewtons] = useState<string>('1000');
  const [lbf, setLbf] = useState<string>('224.81');

  // Volume
  const [liters, setLiters] = useState<string>('100');
  const [gallons, setGallons] = useState<string>('26.42');

  // --- Handlers --- (Simplified for brevity, logic same as original)
  const handleHours = (val: string) => { setHours(val); const h = parseFloat(val); if (!isNaN(h)) { setYears((h / 8760).toFixed(4)); setDays((h / 24).toFixed(2)); } else { setYears(''); setDays(''); } };
  const handleYears = (val: string) => { setYears(val); const y = parseFloat(val); if (!isNaN(y)) { setHours((y * 8760).toFixed(0)); setDays((y * 365).toFixed(1)); } else { setHours(''); setDays(''); } };

  const handleCelsius = (val: string) => { setCelsius(val); const c = parseFloat(val); if (!isNaN(c)) setFahrenheit(((c * 9 / 5) + 32).toFixed(1)); else setFahrenheit(''); };
  const handleFahrenheit = (val: string) => { setFahrenheit(val); const f = parseFloat(val); if (!isNaN(f)) setCelsius(((f - 32) * 5 / 9).toFixed(1)); else setCelsius(''); };

  const handlePsi = (val: string) => { setPsi(val); const p = parseFloat(val); if (!isNaN(p)) setBar((p * 0.0689476).toFixed(3)); else setBar(''); };
  const handleBar = (val: string) => { setBar(val); const b = parseFloat(val); if (!isNaN(b)) setPsi((b * 14.5038).toFixed(1)); else setPsi(''); };

  const handleKw = (val: string) => { setKw(val); const k = parseFloat(val); if (!isNaN(k)) setHp((k * 1.34102).toFixed(2)); else setHp(''); };
  const handleHp = (val: string) => { setHp(val); const h = parseFloat(val); if (!isNaN(h)) setKw((h * 0.7457).toFixed(2)); else setKw(''); };

  const handleIps = (val: string) => { setIps(val); const i = parseFloat(val); if (!isNaN(i)) setMms((i * 25.4).toFixed(2)); else setMms(''); };
  const handleMms = (val: string) => { setMms(val); const m = parseFloat(val); if (!isNaN(m)) setIps((m / 25.4).toFixed(3)); else setIps(''); };

  const handleGpm = (val: string) => { setGpm(val); const g = parseFloat(val); if (!isNaN(g)) setM3h((g * 0.227125).toFixed(2)); else setM3h(''); };
  const handleM3h = (val: string) => { setM3h(val); const m = parseFloat(val); if (!isNaN(m)) setGpm((m * 4.40287).toFixed(2)); else setGpm(''); };

  const handleNm = (val: string) => { setNm(val); const n = parseFloat(val); if (!isNaN(n)) setFtlb((n * 0.737562).toFixed(2)); else setFtlb(''); };
  const handleFtlb = (val: string) => { setFtlb(val); const f = parseFloat(val); if (!isNaN(f)) setNm((f * 1.35582).toFixed(2)); else setNm(''); };

  const handleMils = (val: string) => { setMils(val); const m = parseFloat(val); if (!isNaN(m)) setMicrons((m * 25.4).toFixed(1)); else setMicrons(''); };
  const handleMicrons = (val: string) => { setMicrons(val); const u = parseFloat(val); if (!isNaN(u)) setMils((u / 25.4).toFixed(3)); else setMils(''); };

  const handleHz = (val: string) => { setHz(val); const h = parseFloat(val); if (!isNaN(h)) setCpm((h * 60).toFixed(0)); else setCpm(''); };
  const handleCpm = (val: string) => { setCpm(val); const c = parseFloat(val); if (!isNaN(c)) setHz((c / 60).toFixed(2)); else setHz(''); };

  const handleKg = (val: string) => { setKg(val); const k = parseFloat(val); if (!isNaN(k)) setLbs((k * 2.20462).toFixed(2)); else setLbs(''); };
  const handleLbs = (val: string) => { setLbs(val); const l = parseFloat(val); if (!isNaN(l)) setKg((l / 2.20462).toFixed(2)); else setKg(''); };

  const handleNewtons = (val: string) => { setNewtons(val); const n = parseFloat(val); if (!isNaN(n)) setLbf((n * 0.224809).toFixed(2)); else setLbf(''); };
  const handleLbf = (val: string) => { setLbf(val); const l = parseFloat(val); if (!isNaN(l)) setNewtons((l / 0.224809).toFixed(2)); else setNewtons(''); };

  const handleLiters = (val: string) => { setLiters(val); const l = parseFloat(val); if (!isNaN(l)) setGallons((l * 0.264172).toFixed(2)); else setGallons(''); };
  const handleGallons = (val: string) => { setGallons(val); const g = parseFloat(val); if (!isNaN(g)) setLiters((g / 0.264172).toFixed(2)); else setLiters(''); };

  const ToolComponent = (
    <div className="space-y-6" ref={toolRef}>
      <div className="grid md:grid-cols-2 gap-6">


      {/* Time Conversion */}
      <ConversionCard title="Reliability Time" icon={Clock} color="bg-blue-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Operational Hours" unit="Hrs" value={hours} onChange={handleHours} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Reliability Years" unit="Yrs" value={years} onChange={handleYears} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
          Based on <strong>8,760</strong> hours per year (24/7 Operation)
        </div>
      </ConversionCard>

      {/* Temperature Conversion */}
      <ConversionCard title="Temperature" icon={Thermometer} color="bg-red-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Celsius" unit="°C" value={celsius} onChange={handleCelsius} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Fahrenheit" unit="°F" value={fahrenheit} onChange={handleFahrenheit} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button onClick={() => handleCelsius('0')} className="text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1.5 rounded text-slate-600 dark:text-slate-300">Freezing (0°C)</button>
          <button onClick={() => handleCelsius('25')} className="text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1.5 rounded text-slate-600 dark:text-slate-300">Room (25°C)</button>
          <button onClick={() => handleCelsius('100')} className="text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1.5 rounded text-slate-600 dark:text-slate-300">Boiling (100°C)</button>
        </div>
      </ConversionCard>

      {/* Pressure Conversion */}
      <ConversionCard title="Pressure" icon={Gauge} color="bg-green-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="PSI" unit="lb/in²" value={psi} onChange={handlePsi} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Bar" unit="Bar" value={bar} onChange={handleBar} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 Bar ≈ 14.50 PSI
        </div>
      </ConversionCard>

      {/* Vibration Conversion */}
      <ConversionCard title="Vibration Velocity" icon={Activity} color="bg-orange-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Imperial (IPS)" unit="in/s" value={ips} onChange={handleIps} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Metric (ISO)" unit="mm/s" value={mms} onChange={handleMms} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          Standard metric for ISO 10816 Vibration Severity
        </div>
      </ConversionCard>

      {/* Frequency Conversion */}
      <ConversionCard title="Frequency" icon={Waves} color="bg-pink-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Hertz" unit="Hz" value={hz} onChange={handleHz} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Cycles/Min" unit="CPM" value={cpm} onChange={handleCpm} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 Hz = 60 CPM
        </div>
      </ConversionCard>

      {/* Power Conversion */}
      <ConversionCard title="Power" icon={Zap} color="bg-amber-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Kilowatts" unit="kW" value={kw} onChange={handleKw} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Horsepower" unit="HP" value={hp} onChange={handleHp} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 HP ≈ 0.746 kW
        </div>
      </ConversionCard>

      {/* Flow Conversion */}
      <ConversionCard title="Pump Flow" icon={Droplets} color="bg-cyan-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="US Gallons" unit="GPM" value={gpm} onChange={handleGpm} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Cubic Meters" unit="m³/h" value={m3h} onChange={handleM3h} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 m³/h ≈ 4.403 GPM
        </div>
      </ConversionCard>

      {/* Torque Conversion */}
      <ConversionCard title="Torque" icon={RotateCw} color="bg-purple-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Newton Meters" unit="Nm" value={nm} onChange={handleNm} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Foot Pounds" unit="ft-lb" value={ftlb} onChange={handleFtlb} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 Nm ≈ 0.738 ft-lb
        </div>
      </ConversionCard>

      {/* Precision Length */}
      <ConversionCard title="Clearance / Precision" icon={Ruler} color="bg-indigo-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Mils" unit="mil" value={mils} onChange={handleMils} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Microns" unit="µm" value={microns} onChange={handleMicrons} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 mil = 0.001 inch = 25.4 µm
        </div>
      </ConversionCard>

      {/* Mass Conversion */}
      <ConversionCard title="Mass" icon={Weight} color="bg-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Kilograms" unit="kg" value={kg} onChange={handleKg} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Pounds" unit="lbs" value={lbs} onChange={handleLbs} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 kg ≈ 2.205 lbs
        </div>
      </ConversionCard>

      {/* Force Conversion */}
      <ConversionCard title="Force" icon={Hammer} color="bg-red-600">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Newtons" unit="N" value={newtons} onChange={handleNewtons} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="Pounds-Force" unit="lbf" value={lbf} onChange={handleLbf} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 lbf ≈ 4.448 N
        </div>
      </ConversionCard>

      {/* Volume Conversion */}
      <ConversionCard title="Volume" icon={Beaker} color="bg-teal-500">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputGroup label="Liters" unit="L" value={liters} onChange={handleLiters} />
          </div>
          <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
          <div className="flex-1">
            <InputGroup label="US Gallons" unit="Gal" value={gallons} onChange={handleGallons} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          1 US Gal ≈ 3.785 L
        </div>
      </ConversionCard>

      </div>
      <div className="mt-8 flex justify-center no-print">
        <ShareAndExport 
          toolName="Engineering Unit Converter"
          shareUrl={shareUrl}
          chartRef={toolRef}
          resultSummary="Utility Conversions"
          exportData={[
            { Parameter: "Hours", Value: hours },
            { Parameter: "Years", Value: years },
            { Parameter: "Celsius", Value: celsius },
            { Parameter: "Fahrenheit", Value: fahrenheit },
            { Parameter: "PSI", Value: psi },
            { Parameter: "Bar", Value: bar }
          ]}
        />
      </div>
    </div>

  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Understanding <span className="text-cyan-600 dark:text-cyan-400">Engineering Unit Conversions</span> in Reliability
        </h2>
        <p>
          To maintain uniformity across global asset databases, engineers must convert raw mechanical telemetry into standard units before performing predictive modelling. Disparate OEM equipment ratings—whether specified in imperial units from US-based manufacturers or metric units from European/Asian manufacturers—must be harmonized. Using this <span className="font-extrabold text-cyan-600 dark:text-cyan-400">Engineering Unit Converter</span> helps prevent dangerous scaling mistakes in downstream lifetime models, such as a <Link to="/weibull-analysis" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">Weibull Analysis</Link> or maintenance scheduling in our <Link to="/tools/pm" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">PM Scheduler</Link>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Importance of Metric Harmony"
          icon={<Hammer className="w-5 h-5 text-cyan-650" />}
          delay={0.1}
        >
          <p>
            Statistical models (like Weibull and Lognormal distributions) assume that all input lifetime data points share identical unit types. Mixing calendar hours, operating cycles, or run-time years in a single column of time-to-failure data will distort the calculated shape parameter (Beta) and scale parameter (Eta), resulting in completely incorrect replacement suggestions.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Telemetry Mapping Rules"
          icon={<Waves className="w-5 h-5 text-cyan-600" />}
          delay={0.2}
        >
          <p>
            Vibration velocity is typically converted from imperial Inches per Second (IPS) to ISO-standard millimeters per second (mm/s) to comply with ISO 10816 machinery health classifications. Bearing clearance is converted between mils (thousandths of an inch) and microns to track physical wear.
          </p>
        </TheoryBlock>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 flex items-center gap-2">
        📖 Step-by-Step Practical Conversion Example: Slurry Pump Import
      </h3>

      <div className="space-y-4 text-sm leading-relaxed text-slate-750 dark:text-slate-300">
        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 1: Identify OEM Specifications (Imperial)</span>
          <p className="mt-1">
            An engineering team is importing a heavy-duty slurry pump with the following US OEM parameters:
            <br />
            &nbsp;&nbsp;• Maximum Vibration Limit: <InlineMath math="0.15 \text{ IPS}" />
            <br />
            &nbsp;&nbsp;• Rated Operating Flow: <InlineMath math="100 \text{ GPM}" />
            <br />
            &nbsp;&nbsp;• Process Temperature: <InlineMath math="212^{\circ}\text{F}" />
            <br />
            &nbsp;&nbsp;• Bearing Clearance: <InlineMath math="1 \text{ mil}" />
          </p>
        </div>

        <div>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Step 2: Convert to Standard Metric/SI Units</span>
          <p className="mt-1">
            Using the appropriate scaling factors:
            <BlockMath math="v_{\text{metric}} = 0.15 \text{ IPS} \times 25.4 = 3.81 \text{ mm/s}" />
            <BlockMath math="Q_{\text{metric}} = 100 \text{ GPM} \times 0.227125 = 22.71 \text{ m}^3\text{/h}" />
            <BlockMath math="T_{\text{celsius}} = (212^{\circ}\text{F} - 32) \times \frac{5}{9} = 100^{\circ}\text{C}" />
            <BlockMath math="c_{\text{microns}} = 1 \text{ mil} \times 25.4 = 25.4 \text{ }\mu\text{m}" />
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl">
          <span className="font-bold text-slate-800 dark:text-slate-100">💡 Asset Management Conclusion:</span>
          <p className="mt-1 text-slate-655 dark:text-slate-400">
            "By mapping the converted parameters to the plant CMMS, the diagnostic team can continuously evaluate pump condition limits against ISO 10816 vibration bounds (3.81 mm/s) and ensure replacement seals match the bearing clearance specification (25.4 microns)."
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-cyan-600" /> Engineering Calibration Standards
        </h3>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-350">
          Industrial conversions are calibrated according to global quality frameworks:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700 dark:text-slate-350">
          <li><strong>ISO 10816:</strong> Mechanical vibration — Evaluation of machine vibration by measurements on non-rotating parts (mm/s vs. IPS limit mappings).</li>
          <li><strong>ANSI/ASME PTC 19.1:</strong> Test Codes for Measurement Uncertainty — standard scaling values for temperature, pressure, and flow rates.</li>
          <li><strong>IEEE/ASTM SI 10:</strong> American National Standard for Metric Practice — governing global standard rounding and conversion coefficients.</li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between CPM (Cycles Per Minute) and Hz (Hertz)?",
      answer: "Both measure frequency. Hertz (Hz) is the SI unit representing cycles per second. CPM (Cycles Per Minute) represents cycles per minute. The conversion is CPM = Hz * 60. In vibration analysis, CPM is typically preferred for rotational shaft speeds (since it aligns with RPM—Revolutions Per Minute), while Hz is preferred for electrical line frequencies and signal processing."
    },
    {
      question: "How do you convert imperial vibration velocity in IPS (Inches Per Second) to metric in mm/s?",
      answer: "Vibration velocity represents the speed at which a machine's housing or shaft oscillates. To convert IPS to millimeters per second (mm/s), multiply by 25.4 (since there are 25.4 millimeters in an inch). For example, a vibration level of 0.15 IPS is equal to 0.15 * 25.4 = 3.81 mm/s. This is critical for mapping machine condition to ISO 10816 standards."
    },
    {
      question: "What is the distinction between Mils and Microns in precision bearing clearances?",
      answer: "Mils is an imperial unit of length equal to one-thousandth of an inch (0.001 in). Microns (micrometers, µm) is a metric unit of length equal to one-millionth of a meter (10^-6 m). The conversion is: 1 mil = 25.4 µm. Precision clearances, shaft runout, and alignment tolerances are frequently specified in these units."
    },
    {
      question: "Why is 8,760 hours used as the standard divisor for converting operational hours to reliability years?",
      answer: "8,760 is the total number of hours in a standard calendar year (24 hours/day * 365 days/year). Reliability calculations (like MTBF and failure rates) are mathematically normalized to continuous 24/7/365 operations. If an asset runs only on single-shift schedules (e.g., 2,000 hours/year), you must use actual operational hours rather than calendar years in Weibull parameters to prevent severe overestimations of asset life."
    },
    {
      question: "How is pressure converted between PSI (Pounds per Square Inch) and Bar?",
      answer: "PSI is the imperial unit of pressure (lbf/in²), and Bar is a metric unit of pressure (1 Bar = 10^5 Pascals). The conversion is: 1 PSI ≈ 0.06895 Bar (or 1 Bar ≈ 14.504 PSI). For high-pressure hydraulics, Pascals (Pa) or Megapascals (MPa) are also common (1 MPa = 10 Bar)."
    }
  ];

  return (
    <ToolContentLayout
      title="Engineering Unit Converter"
      description="Essential conversions for reliability engineering. Quickly convert between Time, Vibration, Pressure, Temperature, Flow, and Power units."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="engineering unit converter, failure rate converter, FITs to FPMH, MTBF to failure rate, reliability unit conversions, engineering converter, reliability engineering calculator"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/converter"
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Unit Converter",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default UnitConverter;