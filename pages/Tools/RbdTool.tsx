
import React, { useState } from 'react';
import { RBDBlock, RBDBlockType } from '../../types';
import { calculateSeriesReliability, calculateParallelReliability } from '../../services/reliabilityMath';
import { Plus, Trash2, Layers, ArrowRight, Download, Calculator, BookOpen, Target, TrendingUp, Network } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const RbdTool: React.FC = () => {
  const [mode, setMode] = useState<RBDBlockType>(RBDBlockType.SERIES);
  const [blocks, setBlocks] = useState<RBDBlock[]>([
    { id: '1', name: 'Pump A', reliability: 0.95 },
    { id: '2', name: 'Valve B', reliability: 0.98 },
  ]);

  const addBlock = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setBlocks([...blocks, { id: newId, name: 'New Block', reliability: 0.90 }]);
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

  // --- Visuals ---
  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Config Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4">
            <button onClick={() => setMode(RBDBlockType.SERIES)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === RBDBlockType.SERIES ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>SERIES (Chain)</button>
            <button onClick={() => setMode(RBDBlockType.PARALLEL)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === RBDBlockType.PARALLEL ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>PARALLEL (Redundant)</button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {blocks.map((block) => (
              <div key={block.id} className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <input
                    value={block.name}
                    onChange={(e) => updateBlock(block.id, 'name', e.target.value)}
                    className="text-sm font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-700 dark:text-slate-200 w-24"
                  />
                  <button onClick={() => removeBlock(block.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500 w-8">Rel:</div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={block.reliability}
                    onChange={(e) => updateBlock(block.id, 'reliability', parseFloat(e.target.value))}
                    className="flex-grow h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs font-mono font-bold text-blue-600 w-8 text-right">{block.reliability.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addBlock} className="w-full mt-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add Component
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="flex-grow bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center relative min-h-[300px]">
          {/* Toolbar */}
          <div className="absolute top-4 right-4 z-10">
            <button onClick={exportJson} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 text-slate-500" title="Export JSON"><Download className="w-4 h-4" /></button>
          </div>

          {/* Diagram */}
          <div className={`flex ${mode === RBDBlockType.SERIES ? 'flex-row items-center gap-4' : 'flex-col gap-4 items-center'}`}>
            {/* Input Node */}
            <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-400" />

            {/* Connection Lines (Logic Simplified for Lite Tool) */}
            {mode === RBDBlockType.SERIES ? (
              <div className="flex items-center">
                {blocks.map((b, i) => (
                  <div key={b.id} className="flex items-center">
                    {i > 0 && <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600" />}
                    <div className="w-24 h-16 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded flex flex-col items-center justify-center shadow-md relative z-10">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">{b.name}</span>
                      <span className="text-[10px] text-blue-500 font-mono">{b.reliability.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 relative pl-8 pr-8 border-l-2 border-r-2 border-slate-300 dark:border-slate-600 py-4">
                {/* Parallel Lines Hack */}
                <div className="absolute left-0 top-1/2 w-8 h-0.5 bg-slate-300 dark:bg-slate-600 -translate-x-full" />
                <div className="absolute right-0 top-1/2 w-8 h-0.5 bg-slate-300 dark:bg-slate-600 translate-x-full" />

                {blocks.map((b) => (
                  <div key={b.id} className="relative">
                    <div className="absolute top-1/2 right-full w-8 h-0.5 bg-slate-300 dark:bg-slate-600" />
                    <div className="w-24 h-16 bg-white dark:bg-slate-800 border-2 border-purple-500 rounded flex flex-col items-center justify-center shadow-md relative z-10">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">{b.name}</span>
                      <span className="text-[10px] text-purple-500 font-mono">{b.reliability.toFixed(2)}</span>
                    </div>
                    <div className="absolute top-1/2 left-full w-8 h-0.5 bg-slate-300 dark:bg-slate-600" />
                  </div>
                ))}
              </div>
            )}

            {/* Output Node */}
            <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-400" />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold">System Reliability</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{(systemReliability * 100).toFixed(4)}%</div>
            </div>
            <div className={`p-2 rounded-full ${systemReliability > 0.9 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {systemReliability > 0.9 ? <div className="w-6 h-6"><Check className="w-6 h-6" /></div> : <div className="w-6 h-6">!</div>}
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Formula Used</div>
            <code className="text-xs font-mono text-slate-700 dark:text-slate-300 block">
              {mode === RBDBlockType.SERIES ? "Rs = R1 × R2 × ..." : "Rs = 1 - [(1-R1)×...]"}
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is a Reliability Block Diagram (RBD)?</h2>
      <p>
        An <strong>RBD</strong> is a graphical representation of the components in a system and how they are reliability-wise connected. It allows engineers to calculate the probability of system success based on the configuration of its parts.
      </p>

      <h2 id="configurations">Series vs. Parallel Logic</h2>
      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Series Configuration</h3>
          <p className="text-sm text-blue-800/80">
            The "Weakest Link" model. Every single component must work for the system to work.
            <br /><br />
            <em>Example:</em> An O-ring in a fuel pipe. If it fails, the whole engine stops.
          </p>
        </div>
        <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
          <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Parallel Configuration</h3>
          <p className="text-sm text-purple-800/80">
            The "Redundancy" model. The system works as long as at least one component works.
            <br /><br />
            <em>Example:</em> Dual engines on an aircraft. If one fails, the other keeps the plane flying.
          </p>
        </div>
      </div>

      <h2 id="math">The Mathematics</h2>
      <p>For a Series system with reliabilities R1, R2, ... Rn:</p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4">
        R_system = R1 × R2 × ... × Rn
      </div>
      <p>For a Parallel (Active Redundant) system:</p>
      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-center my-4">
        R_system = 1 - [(1 - R1) × (1 - R2) × ... × (1 - Rn)]
      </div>

      <h2 id="applications">Practical Uses</h2>
      <p>
        RBDs are used in Fault Tree Analysis (FTA) and System Design. By adding redundancy (Parallel blocks), you can massively increase system reliability without needing perfect components. This is why data centers use backup generators; adding a 90% reliable generator to another 90% reliable one increases total availability to <strong>99%</strong>.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What is active vs. standby redundancy?",
      answer: "<strong>Active Redundancy</strong> means all units are running simultaneously (share load). <strong>Standby Redundancy</strong> means one unit is off and only turns on when the primary fails. This tool calculates Active Redundancy."
    },
    {
      question: "Can I model complex systems (Series-Parallel)?",
      answer: "This Lite tool only supports pure Series or pure Parallel modes. For complex nesting (e.g., two parallel branches in series with a valve), users typically calculate the sub-system reliability first and then enter it as a single block."
    },
    {
      question: "How do I find the reliability of a single block?",
      answer: "Use the Reliability Function: <code>R(t) = e^(-t/MTBF)</code>. If you have a pump with 1000h MTBF and you run it for 100h, its reliability is <code>e^(-0.1) = 0.9048</code>."
    }
  ];

  return (
    <ToolContentLayout
      title="Reliability Block Diagram (RBD) Tool"
      description="Model system reliability using Series and Parallel configurations. Visualize redundancy and calculate the probability of total system success."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "RBD Calculator",
        "applicationCategory": "UtilitiesApplication"
      }}
    />
  );
};

export default RbdTool;
