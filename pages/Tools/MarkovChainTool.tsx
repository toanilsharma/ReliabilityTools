import React, { useState, useMemo } from 'react';
import { Network, Plus, Trash2, ArrowRightCircle, Target } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';

// Simple Gaussian Elimination to solve linear systems A * x = B
const solveLinearSystem = (A: number[][], B: number[]) => {
  const n = B.length;
  // Create augmented matrix
  const M = A.map((row, i) => [...row, B[i]]);

  for (let i = 0; i < n; i++) {
    // Search for maximum in this column
    let maxEl = Math.abs(M[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > maxEl) {
        maxEl = Math.abs(M[k][i]);
        maxRow = k;
      }
    }

    // Swap maximum row with current row
    for (let k = i; k < n + 1; k++) {
      const tmp = M[maxRow][k];
      M[maxRow][k] = M[i][k];
      M[i][k] = tmp;
    }

    if (Math.abs(M[i][i]) < 1e-12) continue; // Singular

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j < n + 1; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  // Solve equation Ax=b for an upper triangular matrix M
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    if (Math.abs(M[i][i]) < 1e-12) return null; // Unsolvable
    x[i] = M[i][n] / M[i][i];
    for (let k = i - 1; k >= 0; k--) {
      M[k][n] -= M[k][i] * x[i];
    }
  }
  return x;
};

// Calculate steady state vector pi for continuous-time Markov chain using rate matrix Q
// pi * Q = 0 and sum(pi) = 1
// We transpose Q so Q^T * pi^T = 0.
// Then replace last row of Q^T with 1s, and set last element of B to 1.
const calculateSteadyState = (Q: number[][]) => {
  const n = Q.length;
  if (n === 0) return [];
  
  // Create Q Transpose
  const QT = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      QT[j][i] = Q[i][j];
    }
  }

  // Replace last row with 1s for the probability constraint sum(P) = 1
  for (let j = 0; j < n; j++) {
    QT[n - 1][j] = 1;
  }

  // B vector is [0, 0, ..., 1]
  const B = Array(n).fill(0);
  B[n - 1] = 1;

  const res = solveLinearSystem(QT, B);
  return res || Array(n).fill(0);
};

const MarkovChainTool: React.FC = () => {
  const [states, setStates] = useState<{id: string, name: string}[]>([
    { id: 'S1', name: 'Working (OK)' },
    { id: 'S2', name: 'Degraded' },
    { id: 'S3', name: 'Failed (Repair)' }
  ]);

  // Rates matrix format: Record<fromId, Record<toId, rate>>
  const [rates, setRates] = useState<Record<string, Record<string, number>>>({
    'S1': { 'S2': 0.005, 'S3': 0.001 },
    'S2': { 'S1': 0.010, 'S3': 0.008 },
    'S3': { 'S1': 0.050, 'S2': 0.000 }
  });

  const addState = () => {
    const newId = `S${Math.max(0, ...states.map(s => parseInt(s.id.replace('S', '')) || 0)) + 1}`;
    setStates([...states, { id: newId, name: `New State ${newId}` }]);
    setRates(prev => ({
      ...prev,
      [newId]: {}
    }));
  };

  const removeState = (idToRemove: string) => {
    if (states.length <= 2) return alert("System must have at least 2 states.");
    setStates(states.filter(s => s.id !== idToRemove));
    
    // Clean up rates
    const newRates = { ...rates };
    delete newRates[idToRemove];
    Object.keys(newRates).forEach(fromId => {
      const row = { ...newRates[fromId] };
      delete row[idToRemove];
      newRates[fromId] = row;
    });
    setRates(newRates);
  };

  const updateRate = (fromId: string, toId: string, val: number) => {
    setRates(prev => ({
      ...prev,
      [fromId]: {
        ...(prev[fromId] || {}),
        [toId]: val
      }
    }));
  };

  const updateStateName = (id: string, name: string) => {
    setStates(states.map(s => s.id === id ? { ...s, name } : s));
  };

  const { QMatrix, steadyStates, availability } = useMemo(() => {
    const n = states.length;
    const Q = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // Fill off-diagonals
    for (let i = 0; i < n; i++) {
        let rowSum = 0;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const rate = rates[states[i].id]?.[states[j].id] || 0;
                Q[i][j] = rate;
                rowSum += rate;
            }
        }
        // Fill diagonal
        Q[i][i] = -rowSum;
    }

    const ss = calculateSteadyState(Q);
    
    // Calculate simple availability: sum of probabilities of states not containing "Fail"
    let avail = 0;
    ss.forEach((p, idx) => {
      if (!states[idx].name.toLowerCase().includes('fail')) avail += p;
    });

    return { QMatrix: Q, steadyStates: ss, availability: avail };
  }, [states, rates]);


  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex justify-between items-center">
            System States
            <button onClick={addState} className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded hover:bg-cyan-200 flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
          </h3>
          
          <div className="space-y-3">
            {states.map((s, idx) => (
              <div key={s.id} className={`flex items-center gap-2 p-2 rounded border ${s.name.toLowerCase().includes('fail') ? 'bg-red-50 dark:bg-red-900/10 border-red-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                <div className="text-xs font-mono font-bold text-slate-500 w-6">S{idx+1}</div>
                <input 
                  value={s.name} onChange={(e) => updateStateName(s.id, e.target.value)} 
                  className="flex-grow text-sm bg-transparent border-none focus:ring-0 p-0 dark:text-slate-200" 
                />
                <button onClick={() => removeState(s.id)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center shadow-sm">
           <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Target className="w-4 h-4" /> System Availability</h3>
           <div className="text-4xl font-bold text-slate-900 dark:text-white my-2">{(availability * 100).toFixed(4)}%</div>
           <p className="text-xs text-indigo-700/80 dark:text-indigo-400">Sum of steady-state probabilities for non-failed states.</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Transition Rates Matrix (Failures/Repairs per hour)</h3>
          
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-2 border-b-2 border-slate-300 dark:border-slate-700 font-bold text-slate-500 uppercase text-xs">From \ To</th>
                {states.map(s => <th key={`h-${s.id}`} className="p-2 border-b-2 border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">{s.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {states.map((fromS, i) => (
                <tr key={`r-${fromS.id}`} className="border-b border-slate-200 dark:border-slate-800/50">
                  <td className="p-2 font-bold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/30 rounded-l">{fromS.name}</td>
                  {states.map((toS, j) => (
                    <td key={`c-${fromS.id}-${toS.id}`} className="p-1">
                      {i === j ? (
                        <div className="text-slate-400 text-center text-xs p-2 bg-slate-100 dark:bg-slate-800/50 rounded cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700">
                          {QMatrix[i][j].toFixed(4)}
                        </div>
                      ) : (
                        <input 
                          type="number" step="0.001" min="0" placeholder="0.0"
                          value={rates[fromS.id]?.[toS.id] || ''}
                          onChange={(e) => updateRate(fromS.id, toS.id, parseFloat(e.target.value) || 0)}
                          className="w-full text-center text-sm p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:border-cyan-500 outline-none transition-colors"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><ArrowRightCircle className="w-4 h-4 text-cyan-500" /> Steady-State Probabilities</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {states.map((s, i) => (
              <div key={`prob-${s.id}`} className={`p-4 rounded-lg flex flex-col items-center justify-center border shadow-sm ${s.name.toLowerCase().includes('fail') ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 text-center">{s.name}</span>
                <span className="text-2xl font-mono text-slate-900 dark:text-white">{(steadyStates[i] * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2>What is Markov Chain Modeling?</h2>
      <p>
        A <strong>Continuous-Time Markov Chain (CTMC)</strong> is a mathematical model used to analyze the reliability and availability of complex, repairable systems. Unlike Fault Trees or RBDs which assume components are either perfectly distinct or not dynamically repairable, Markov chains map the exact probability of jumping from one fluid "State" to another over time.
      </p>
      
      <h3>The Transition Rate Matrix (Q-Matrix)</h3>
      <p>
        The table you fill out defines the failure rates ($\lambda$) and repair rates ($\mu$) between states. The diagonal elements are calculated automatically to equal the negative sum of the rest of the row, so that each row sums to zero.
      </p>

      <h3>Steady-State Probabilities</h3>
      <p>
        By solving the linear algebra equation <code>P × Q = 0</code>, the tool finds the equilibrium (steady-state) probability of finding the system in any given state if it runs for a very long time. True System Availability is simply the sum of the probabilities of all "working" states.
      </p>
    </div>
  );

  return (
    <ToolContentLayout
      title="Markov Chain Modeler"
      description="Model highly complex repairable system states and calculate steady-state availability using continuous-time rate matrices."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Markov Modeler", "applicationCategory": "BusinessApplication" }}
    />
  );
};

export default MarkovChainTool;
