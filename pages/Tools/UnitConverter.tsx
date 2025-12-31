
import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Thermometer, 
  Clock, 
  Gauge, 
  Zap, 
  Activity, 
  Droplets, 
  RotateCw, 
  Ruler,
  Waves,
  Weight,
  Beaker,
  Hammer
} from 'lucide-react';
import SEO from '../../components/SEO';
import RelatedTools from '../../components/RelatedTools';

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
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:border-cyan-500/30 transition-colors">
    <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3 ${color} bg-opacity-10`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-').replace('/10', '')}`} />
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

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
    <div className="flex justify-between">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      <span className="text-xs text-slate-400 font-mono">{unit}</span>
    </div>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none font-mono transition-shadow"
    />
  </div>
);

const UnitConverter: React.FC = () => {
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

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Reliability Unit Converter",
    "description": "Convert industrial units: Time, Temperature, Pressure, Power, Vibration, Flow, Torque, Frequency, Mass, Force, and Volume.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web"
  };

  // --- Handlers ---

  // Time (Based on 8760 hrs/yr)
  const handleHours = (val: string) => {
    setHours(val);
    const h = parseFloat(val);
    if (!isNaN(h)) {
      setYears((h / 8760).toFixed(4));
      setDays((h / 24).toFixed(2));
    } else {
      setYears(''); setDays('');
    }
  };

  const handleYears = (val: string) => {
    setYears(val);
    const y = parseFloat(val);
    if (!isNaN(y)) {
      setHours((y * 8760).toFixed(0));
      setDays((y * 365).toFixed(1));
    } else {
      setHours(''); setDays('');
    }
  };

  // Temp
  const handleCelsius = (val: string) => {
    setCelsius(val);
    const c = parseFloat(val);
    if (!isNaN(c)) {
      setFahrenheit(((c * 9/5) + 32).toFixed(1));
    } else {
      setFahrenheit('');
    }
  };

  const handleFahrenheit = (val: string) => {
    setFahrenheit(val);
    const f = parseFloat(val);
    if (!isNaN(f)) {
      setCelsius(((f - 32) * 5/9).toFixed(1));
    } else {
      setCelsius('');
    }
  };

  // Pressure
  const handlePsi = (val: string) => {
    setPsi(val);
    const p = parseFloat(val);
    if (!isNaN(p)) {
      setBar((p * 0.0689476).toFixed(3));
    } else {
      setBar('');
    }
  };

  const handleBar = (val: string) => {
    setBar(val);
    const b = parseFloat(val);
    if (!isNaN(b)) {
      setPsi((b * 14.5038).toFixed(1));
    } else {
      setPsi('');
    }
  };

  // Power
  const handleKw = (val: string) => {
    setKw(val);
    const k = parseFloat(val);
    if (!isNaN(k)) {
      setHp((k * 1.34102).toFixed(2));
    } else {
      setHp('');
    }
  };

  const handleHp = (val: string) => {
    setHp(val);
    const h = parseFloat(val);
    if (!isNaN(h)) {
      setKw((h * 0.7457).toFixed(2));
    } else {
      setKw('');
    }
  };

  // Vibration
  const handleIps = (val: string) => {
    setIps(val);
    const i = parseFloat(val);
    if (!isNaN(i)) {
      setMms((i * 25.4).toFixed(2));
    } else {
      setMms('');
    }
  };

  const handleMms = (val: string) => {
    setMms(val);
    const m = parseFloat(val);
    if (!isNaN(m)) {
      setIps((m / 25.4).toFixed(3));
    } else {
      setIps('');
    }
  };

  // Flow
  const handleGpm = (val: string) => {
    setGpm(val);
    const g = parseFloat(val);
    if (!isNaN(g)) {
      setM3h((g * 0.227125).toFixed(2));
    } else {
      setM3h('');
    }
  };

  const handleM3h = (val: string) => {
    setM3h(val);
    const m = parseFloat(val);
    if (!isNaN(m)) {
      setGpm((m * 4.40287).toFixed(2));
    } else {
      setGpm('');
    }
  };

  // Torque
  const handleNm = (val: string) => {
    setNm(val);
    const n = parseFloat(val);
    if (!isNaN(n)) {
      setFtlb((n * 0.737562).toFixed(2));
    } else {
      setFtlb('');
    }
  };

  const handleFtlb = (val: string) => {
    setFtlb(val);
    const f = parseFloat(val);
    if (!isNaN(f)) {
      setNm((f * 1.35582).toFixed(2));
    } else {
      setNm('');
    }
  };

  // Length
  const handleMils = (val: string) => {
    setMils(val);
    const m = parseFloat(val);
    if (!isNaN(m)) {
      setMicrons((m * 25.4).toFixed(1));
    } else {
      setMicrons('');
    }
  };

  const handleMicrons = (val: string) => {
    setMicrons(val);
    const u = parseFloat(val);
    if (!isNaN(u)) {
      setMils((u / 25.4).toFixed(3));
    } else {
      setMils('');
    }
  };

  // Frequency
  const handleHz = (val: string) => {
    setHz(val);
    const h = parseFloat(val);
    if (!isNaN(h)) {
      setCpm((h * 60).toFixed(0));
    } else {
      setCpm('');
    }
  };

  const handleCpm = (val: string) => {
    setCpm(val);
    const c = parseFloat(val);
    if (!isNaN(c)) {
      setHz((c / 60).toFixed(2));
    } else {
      setHz('');
    }
  };

  // Mass
  const handleKg = (val: string) => {
    setKg(val);
    const k = parseFloat(val);
    if (!isNaN(k)) {
      setLbs((k * 2.20462).toFixed(2));
    } else {
      setLbs('');
    }
  };

  const handleLbs = (val: string) => {
    setLbs(val);
    const l = parseFloat(val);
    if (!isNaN(l)) {
      setKg((l / 2.20462).toFixed(2));
    } else {
      setKg('');
    }
  };

  // Force
  const handleNewtons = (val: string) => {
    setNewtons(val);
    const n = parseFloat(val);
    if (!isNaN(n)) {
      setLbf((n * 0.224809).toFixed(2));
    } else {
      setLbf('');
    }
  };

  const handleLbf = (val: string) => {
    setLbf(val);
    const l = parseFloat(val);
    if (!isNaN(l)) {
      setNewtons((l / 0.224809).toFixed(2));
    } else {
      setNewtons('');
    }
  };

  // Volume
  const handleLiters = (val: string) => {
    setLiters(val);
    const l = parseFloat(val);
    if (!isNaN(l)) {
      setGallons((l * 0.264172).toFixed(2));
    } else {
      setGallons('');
    }
  };

  const handleGallons = (val: string) => {
    setGallons(val);
    const g = parseFloat(val);
    if (!isNaN(g)) {
      setLiters((g / 0.264172).toFixed(2));
    } else {
      setLiters('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <SEO schema={toolSchema} />

      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Engineering Unit Converter</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Quickly convert between common units used in reliability engineering, maintenance planning, and equipment datasheets.
        </p>
      </div>

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

        {/* Frequency Conversion */}
        <ConversionCard title="Vibration Frequency" icon={Waves} color="bg-pink-500">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <InputGroup label="Hertz" unit="Hz" value={hz} onChange={handleHz} />
            </div>
            <ArrowRightLeft className="w-5 h-5 text-slate-400 mt-6" />
            <div className="flex-1">
              <InputGroup label="Cycles/Minute" unit="CPM" value={cpm} onChange={handleCpm} />
            </div>
          </div>
          <div className="text-xs text-slate-500 text-center mt-2">
            1 Hz = 60 CPM (Standard for spectrum analysis)
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
             <button onClick={() => handleCelsius('0')} className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1 rounded text-slate-600 dark:text-slate-300">Freezing (0°C)</button>
             <button onClick={() => handleCelsius('25')} className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1 rounded text-slate-600 dark:text-slate-300">Room (25°C)</button>
             <button onClick={() => handleCelsius('100')} className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-1 rounded text-slate-600 dark:text-slate-300">Boiling (100°C)</button>
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

        {/* Flow Conversion */}
        <ConversionCard title="Pump Flow Rate" icon={Droplets} color="bg-cyan-500">
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
            Common units for pump curves
          </div>
        </ConversionCard>

        {/* Volume Conversion */}
        <ConversionCard title="Fluid Volume" icon={Beaker} color="bg-teal-500">
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
            1 US Gal ≈ 3.785 Liters
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
            1 Nm ≈ 0.74 ft-lb
          </div>
        </ConversionCard>

        {/* Force Conversion */}
        <ConversionCard title="Force / Tension" icon={Hammer} color="bg-red-600">
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
            1 lbf ≈ 4.45 N
          </div>
        </ConversionCard>

        {/* Power Conversion */}
        <ConversionCard title="Motor Power" icon={Zap} color="bg-amber-500">
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
            1 HP ≈ 0.746 kW (Electrical)
          </div>
        </ConversionCard>

        {/* Mass Conversion */}
        <ConversionCard title="Mass / Weight" icon={Weight} color="bg-slate-500">
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

        {/* Precision Length */}
        <ConversionCard title="Alignment / Clearance" icon={Ruler} color="bg-indigo-500">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <InputGroup label="Mils (Thous)" unit="mil" value={mils} onChange={handleMils} />
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

      </div>

      <RelatedTools currentToolId="converter" />
    </div>
  );
};

export default UnitConverter;
