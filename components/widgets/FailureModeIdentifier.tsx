
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const DATA: any = {
  'Centrifugal Pump': {
    'Loud Noise': 'Cavitation or Bearing Failure',
    'No Flow': 'Loss of Prime or Broken Shaft',
    'Leakage': 'Mechanical Seal Failure',
    'High Vibration': 'Misalignment or Imbalance'
  },
  'Electric Motor': {
    'Overheating': 'Overload or Blocked Ventilation',
    'Humming': 'Single Phasing (Electrical)',
    'Vibration': 'Soft Foot or Bearing Wear',
    'Trips Breaker': 'Short Circuit or Ground Fault'
  },
  'Hydraulic Valve': {
    'Stuck Open': 'Debris in Seat or Solenoid Failure',
    'Stuck Closed': 'Coil Burnout or Spool Jam',
    'Internal Leak': 'Seat Wear or O-Ring Failure'
  }
};

const FailureModeIdentifier: React.FC = () => {
  const [component, setComponent] = useState(Object.keys(DATA)[0]);
  const [symptom, setSymptom] = useState(Object.keys(DATA[Object.keys(DATA)[0]])[0]);

  const handleComponentChange = (c: string) => {
    setComponent(c);
    setSymptom(Object.keys(DATA[c])[0]);
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" /> Failure Mode Identifier
      </h3>
      
      <div className="space-y-4 flex-grow">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">1. Select Asset</label>
          <select 
            value={component}
            onChange={(e) => handleComponentChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {Object.keys(DATA).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">2. Select Symptom</label>
          <select 
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {Object.keys(DATA[component]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="pt-4 mt-auto">
          <div className="flex items-start gap-3 bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-100 dark:border-cyan-900/50">
             <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
             <div>
               <div className="text-xs text-cyan-800 dark:text-cyan-300 font-bold uppercase mb-1">Likely Failure Mode</div>
               <div className="text-slate-900 dark:text-white font-semibold leading-tight">
                 {DATA[component][symptom]}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailureModeIdentifier;
