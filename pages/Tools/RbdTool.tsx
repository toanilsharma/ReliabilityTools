
import React, { useState } from 'react';
import { RBDBlock, RBDBlockType } from '../../types';
import { calculateSeriesReliability, calculateParallelReliability } from '../../services/reliabilityMath';
import { Plus, Trash2, Layers, ArrowRight, Download, Calculator, BookOpen, Target, TrendingUp } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

const RbdTool: React.FC = () => {
  const [mode, setMode] = useState<RBDBlockType>(RBDBlockType.SERIES);
  const [blocks, setBlocks] = useState<RBDBlock[]>([
    { id: '1', name: 'Pump A', reliability: 0.95 },
    { id: '2', name: 'Valve B', reliability: 0.98 },
  ]);

  const addBlock = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setBlocks([...blocks, { id: newId, name: 'New Component', reliability: 0.90 }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, field: keyof RBDBlock, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const exportJson = () => {
    const data = JSON.stringify({ mode, blocks }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rbd-diagram.json';
    a.click();
  };

  const systemReliability = mode === RBDBlockType.SERIES 
    ? calculateSeriesReliability(blocks.map(b => b.reliability))
    : calculateParallelReliability(blocks.map(b => b.reliability));

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">RBD Calculator (Lite)</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Model system reliability by configuring components in Series or Parallel. Reliability Block Diagrams (RBDs) help you visualize how component failures affect the overall system.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">System Configuration</label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <button 
                onClick={() => setMode(RBDBlockType.SERIES)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === RBDBlockType.SERIES ? 'bg-cyan-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Series
              </button>
              <button 
                onClick={() => setMode(RBDBlockType.PARALLEL)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === RBDBlockType.PARALLEL ? 'bg-cyan-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Parallel
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {mode === RBDBlockType.SERIES 
                ? "All components must function for the system to work." 
                : "The system works if at least one component functions (Redundancy)."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-slate-900 dark:text-white">Components</h3>
               <button onClick={addBlock} className="p-1 bg-cyan-600 rounded hover:bg-cyan-500 transition-colors text-white">
                 <Plus className="w-4 h-4" />
               </button>
             </div>
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
               {blocks.map((block, index) => (
                 <div key={block.id} className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between mb-2">
                      <input 
                        className="bg-transparent text-sm font-medium text-slate-900 dark:text-white border-none focus:ring-0 p-0 w-24" 
                        value={block.name}
                        onChange={(e) => updateBlock(block.id, 'name', e.target.value)}
                      />
                      <button onClick={() => removeBlock(block.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">
                        R(t):
                        <HelpTooltip text="Probability of success (0.0 to 1.0) over a specific time. If unknown, calculate e^(-t/MTBF)." />
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="1"
                        value={block.reliability}
                        onChange={(e) => updateBlock(block.id, 'reliability', parseFloat(e.target.value))}
                        className="bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white rounded px-2 py-1 w-full border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="md:col-span-2 flex flex-col">
          <div className="flex-grow bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px] shadow-sm">
             {/* Toolbar */}
             <div className="absolute top-4 right-4">
                <button onClick={exportJson} className="flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded transition-colors">
                  <Download className="w-3 h-3" /> Export JSON
                </button>
             </div>

            {/* Simplified Visualization */}
            <div className={`flex ${mode === RBDBlockType.SERIES ? 'flex-row items-center overflow-x-auto max-w-full' : 'flex-col gap-4 justify-center'}`}>
               {/* Start Node */}
               <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full mr-4 flex-shrink-0"></div>
               
               <div className={`flex ${mode === RBDBlockType.SERIES ? 'flex-row gap-4 items-center' : 'flex-col gap-4'}`}>
                 {blocks.map((block) => (
                   <div key={block.id} className="w-32 h-20 bg-white dark:bg-slate-800 border-2 border-cyan-500 rounded-lg flex flex-col items-center justify-center shadow-md relative">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate px-2">{block.name}</span>
                      <span className="text-xs text-cyan-600 dark:text-cyan-400">{block.reliability}</span>
                      {mode === RBDBlockType.SERIES && <div className="absolute -right-4 top-1/2 w-4 h-0.5 bg-slate-300 dark:bg-slate-600"></div>}
                   </div>
                 ))}
               </div>

               {/* End Node */}
               <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full ml-4 flex-shrink-0"></div>
            </div>
          </div>

          {/* Logic & Result Bar */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
             <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
               <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                 <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Calculation Logic
               </h3>
               <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-black/30 p-3 rounded border border-slate-200 dark:border-transparent">
                 {mode === RBDBlockType.SERIES ? (
                   <>
                     <div>Rs = R1 × R2 × ... × Rn</div>
                     <div className="mt-2 text-slate-500">Product of all component reliabilities.</div>
                   </>
                 ) : (
                   <>
                     <div>Rs = 1 - [(1-R1) × (1-R2) × ...]</div>
                     <div className="mt-2 text-slate-500">1 minus the product of unreliabilities.</div>
                   </>
                 )}
               </div>
             </div>

             <div className="bg-white dark:bg-slate-900 border border-cyan-500/30 p-6 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">System Reliability</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {(systemReliability * 100).toFixed(4)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Unreliability (Pf)</div>
                  <div className="text-xl font-semibold text-red-500 dark:text-red-400">
                    {((1 - systemReliability) * 100).toFixed(4)}%
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Standard: IEC 61078
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This tool uses the methodology defined in <strong>IEC 61078: Reliability Block Diagrams</strong>. It mathematically models how the reliability of individual parts contributes to the success or failure of the entire system.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Series vs. Parallel
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Series (Chain):</strong> The system fails if <em>any</em> component fails. The system is only as strong as its weakest link.<br/><br/>
            <strong>Parallel (Redundant):</strong> The system works if <em>at least one</em> component works (Active Redundancy).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Significance
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            RBDs are critical during the design phase. They help justify the cost of redundancy (adding a backup pump) by proving how much it increases overall system uptime compared to a single point of failure.
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="rbd" />
    </div>
  );
};

export default RbdTool;
