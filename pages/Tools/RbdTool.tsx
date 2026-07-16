import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  Position,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RBDBlock, RBDBlockType } from '../../types';
import { calculateSeriesReliability, calculateParallelReliability, calculateMonteCarloRBD } from '../../services/reliabilityMath';
import { 
  Plus, 
  Trash2, 
  Download, 
  Check, 
  Link2, 
  Map as MapIcon,
  Settings,
  Layers,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useLocation } from 'react-router-dom';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { RbdSeriesParallelDiagram } from '../../components/TheoryVisuals';

const PRESETS = [
  {
    name: "Series Train",
    shortDesc: "3 inline parts (Sensor, PLC, Valve)",
    mode: RBDBlockType.SERIES,
    blocks: [
      { id: '1', name: 'Pressure Sensor', reliability: 0.95 },
      { id: '2', name: 'PLC Logic Module', reliability: 0.99 },
      { id: '3', name: 'Actuator Valve', reliability: 0.92 }
    ],
    ccfBeta: 0,
    useMonteCarlo: false
  },
  {
    name: "Redundancy (1oo2)",
    shortDesc: "2 parallel pumps with 5% CCF",
    mode: RBDBlockType.PARALLEL,
    blocks: [
      { id: '1', name: 'Pump A (Duty)', reliability: 0.88 },
      { id: '2', name: 'Pump B (Standby)', reliability: 0.88 }
    ],
    ccfBeta: 0.05,
    useMonteCarlo: false
  },
  {
    name: "High-Availability",
    shortDesc: "3 parallel parts with Monte Carlo",
    mode: RBDBlockType.PARALLEL,
    blocks: [
      { id: '1', name: 'Generator A', reliability: 0.85 },
      { id: '2', name: 'Generator B', reliability: 0.85 },
      { id: '3', name: 'Generator C', reliability: 0.85 }
    ],
    ccfBeta: 0.02,
    useMonteCarlo: true
  }
];

const RBDBlockNode = ({ data }: any) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md p-3 min-w-[130px] text-center relative hover:shadow-lg transition">
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-655 border border-white" style={{ left: -5 }} />
      <div className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 mb-1">{data.category || 'Component'}</div>
      <div className="text-xs font-black text-slate-800 dark:text-white truncate">{data.name}</div>
      <div className="mt-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full inline-block">
        R: {data.reliability.toFixed(3)}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-655 border border-white" style={{ right: -5 }} />
    </div>
  );
};

const RBDAnchorNode = ({ data }: any) => {
  return (
    <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-700 dark:border-slate-200 shadow-md flex items-center justify-center font-black text-xs relative">
      {data.type === 'input' && <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-400" style={{ right: -3 }} />}
      {data.label}
      {data.type === 'output' && <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-400" style={{ left: -3 }} />}
    </div>
  );
};

const RbdTool: React.FC = () => {
  const [mode, setMode] = useState<RBDBlockType>(RBDBlockType.SERIES);
  const [useMonteCarlo, setUseMonteCarlo] = useState(false);
  const [ccfBeta, setCcfBeta] = useState<number>(0);
  const [blocks, setBlocks] = useState<RBDBlock[]>([
    { id: '1', name: 'Pump A', reliability: 0.95 },
    { id: '2', name: 'Valve B', reliability: 0.98 },
  ]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [manualWiring, setManualWiring] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);
  const shareUrl = window.location.href;
  
  const { addRecentTool } = useRecentTools();
  const location = useLocation();

  useEffect(() => {
    addRecentTool({
      id: 'rbd',
      name: 'RBD Builder',
      path: '/tools/rbd'
    });
  }, []);

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

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setMode(preset.mode);
    setCcfBeta(preset.ccfBeta);
    setUseMonteCarlo(preset.useMonteCarlo);
    setBlocks(preset.blocks.map(b => ({ ...b })));
  };

  const nodeTypes = useMemo(() => ({
    rbdBlock: RBDBlockNode,
    rbdAnchor: RBDAnchorNode
  }), []);

  useEffect(() => {
    const previousPositions = new Map(nodes.map(n => [n.id, n.position]));

    const defaultNodes: Node[] = [];
    const defaultEdges: Edge[] = [];

    defaultNodes.push({
      id: 'start',
      position: previousPositions.get('start') ?? { x: 30, y: mode === RBDBlockType.SERIES ? 170 : (Math.max(blocks.length, 1) * 120) / 2 },
      data: { label: 'In', type: 'input' },
      type: 'rbdAnchor',
      draggable: true,
    });

    blocks.forEach((b, i) => {
      defaultNodes.push({
        id: b.id,
        position: previousPositions.get(b.id) ?? (mode === RBDBlockType.SERIES ? { x: 180 + i * 190, y: 120 } : { x: 260, y: 70 + i * 120 }),
        data: { name: b.name, reliability: b.reliability, category: mode === RBDBlockType.SERIES ? 'Series Block' : 'Parallel Block' },
        type: 'rbdBlock',
        draggable: true,
      });
    });

    defaultNodes.push({
      id: 'end',
      position: previousPositions.get('end') ?? (mode === RBDBlockType.SERIES ? { x: 230 + blocks.length * 190, y: 170 } : { x: 520, y: (Math.max(blocks.length, 1) * 120) / 2 }),
      data: { label: 'Out', type: 'output' },
      type: 'rbdAnchor',
      draggable: true,
    });

    if (mode === RBDBlockType.SERIES) {
      if (blocks.length > 0) {
        defaultEdges.push({ id: `e-start-${blocks[0].id}`, source: 'start', target: blocks[0].id, type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#06b6d4' } });
        for (let i = 0; i < blocks.length - 1; i++) {
          defaultEdges.push({ id: `e-${blocks[i].id}-${blocks[i + 1].id}`, source: blocks[i].id, target: blocks[i + 1].id, type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#06b6d4' } });
        }
        defaultEdges.push({ id: `e-${blocks[blocks.length - 1].id}-end`, source: blocks[blocks.length - 1].id, target: 'end', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#06b6d4' } });
      } else {
        defaultEdges.push({ id: 'e-start-end', source: 'start', target: 'end', animated: true, style: { stroke: '#94a3b8' } });
      }
    } else {
      blocks.forEach(b => {
        defaultEdges.push({ id: `e-start-${b.id}`, source: 'start', target: b.id, type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#a855f7' } });
        defaultEdges.push({ id: `e-${b.id}-end`, source: b.id, target: 'end', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#a855f7' } });
      });
    }

    setNodes(defaultNodes);
    if (!manualWiring) setEdges(defaultEdges);
  }, [blocks, mode, manualWiring]);

  const exportJson = () => {
    const data = JSON.stringify({ mode, useMonteCarlo, ccfBeta, blocks, nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rbd-diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateAnalyticalRef = () => {
    if (mode === RBDBlockType.SERIES) {
      return calculateSeriesReliability(blocks.map(b => b.reliability));
    }

    const indRel = calculateParallelReliability(blocks.map(b => b.reliability));
    const avgUnrel = 1 - (blocks.reduce((acc, b) => acc + b.reliability, 0) / (blocks.length || 1));
    const qCcf = ccfBeta * avgUnrel;
    return indRel * (1 - qCcf);
  };

  const systemReliability = useMonteCarlo
    ? calculateMonteCarloRBD(blocks.map(b => b.reliability), mode, 10000, ccfBeta)
    : calculateAnalyticalRef();

  const getReliabilityColor = (val: number) => {
    if (val >= 0.99) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40';
    if (val >= 0.95) return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/40';
    if (val >= 0.90) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40';
    return 'text-rose-600 dark:text-rose-455 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40';
  };

  const reliabilitySteps = useMemo(() => {
    if (blocks.length === 0) return { formula: 'R_s = 1.0000', expansion: 'R_s = 1.0000', result: '1.0000' };
    const rels = blocks.map(b => b.reliability);
    if (mode === RBDBlockType.SERIES) {
      const formulaStr = blocks.map((_, i) => `R_${i + 1}`).join(' \\times ');
      const valStr = rels.map(r => r.toFixed(4)).join(' \\times ');
      const finalVal = rels.reduce((acc, r) => acc * r, 1);
      return {
        formula: `R_s = ${formulaStr}`,
        expansion: `R_s = ${valStr}`,
        result: finalVal.toFixed(6)
      };
    } else {
      const formulaStr = `1 - \\prod_{i=1}^{n} (1 - R_i)`;
      const expansionStr = `1 - ` + rels.map(r => `(1 - ${r.toFixed(4)})`).join(' \\times ');
      const unrelProduct = rels.reduce((acc, r) => acc * (1 - r), 1);
      const indRel = 1 - unrelProduct;
      
      if (ccfBeta > 0) {
        const avgUnrel = 1 - (rels.reduce((acc, r) => acc + r, 0) / (rels.length || 1));
        const qCcf = ccfBeta * avgUnrel;
        const finalRel = indRel * (1 - qCcf);
        return {
          formula: `R_s = R_{\\text{independent}} \\times (1 - \\beta \\cdot Q_{\\text{avg}})`,
          expansion: `R_s = ${indRel.toFixed(4)} \\times (1 - ${ccfBeta.toFixed(2)} \\times ${avgUnrel.toFixed(4)})`,
          result: finalRel.toFixed(6)
        };
      }
      return {
        formula: `R_s = ${formulaStr}`,
        expansion: `R_s = ${expansionStr}`,
        result: indRel.toFixed(6)
      };
    }
  }, [blocks, mode, ccfBeta]);

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

      <div className="lg:col-span-1 space-y-6">
        
        {/* Presets Grid */}
        <div className="bg-slate-100 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-inner space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Quick-Start Industrial Presets
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset)}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:shadow transition flex flex-col items-center justify-between text-center gap-1 min-h-[70px]"
              >
                <span className="font-extrabold text-[9px] line-clamp-1">{preset.name}</span>
                <span className="text-[8px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-tight">{preset.shortDesc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-slate-805 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Settings className="w-4 h-4 text-cyan-600" /> RBD Configuration
          </h3>

          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-850">
            <button onClick={() => setMode(RBDBlockType.SERIES)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === RBDBlockType.SERIES ? 'bg-white dark:bg-slate-800 shadow text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700'}`}>SERIES</button>
            <button onClick={() => setMode(RBDBlockType.PARALLEL)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === RBDBlockType.PARALLEL ? 'bg-white dark:bg-slate-800 shadow text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700'}`}>PARALLEL</button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {blocks.map((block) => (
              <div key={block.id} className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-750 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <input
                    value={block.name}
                    onChange={(e) => updateBlock(block.id, 'name', e.target.value)}
                    className="text-xs font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-200 w-32 outline-none focus:border-b focus:border-cyan-500"
                  />
                  <button onClick={() => removeBlock(block.id)} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase w-8">Rel:</div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={block.reliability}
                    onChange={(e) => updateBlock(block.id, 'reliability', parseFloat(e.target.value))}
                    className="flex-grow h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 w-10 text-right">{block.reliability.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addBlock} className="w-full py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add Component
          </button>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between items-center">
              Advanced Modeling
              <HelpTooltip text="Toggle manual connector lines to link anchor ports directly on the canvas." />
            </h4>

            <label className="flex items-center gap-2.5 text-xs text-slate-750 dark:text-slate-300 cursor-pointer font-bold">
              <input type="checkbox" checked={useMonteCarlo} onChange={(e) => setUseMonteCarlo(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 bg-transparent" />
              Use Monte Carlo Simulation (10k iter.)
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-750 dark:text-slate-300 cursor-pointer font-bold">
              <input type="checkbox" checked={manualWiring} onChange={(e) => setManualWiring(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 bg-transparent" />
              Manual Connector Lines
            </label>

            {mode === RBDBlockType.PARALLEL && (
              <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">CCF Beta Factor (β)</span>
                  <span className="text-xs text-cyan-600 font-mono font-bold">{ccfBeta.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0" max="0.5" step="0.01"
                  value={ccfBeta}
                  onChange={(e) => setCcfBeta(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col space-y-6">
        
        {/* ReactFlow Canvas Panel */}
        <div className="flex-grow bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-slate-205 dark:border-slate-800 p-4 relative min-h-[430px] shadow-inner">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={exportJson} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 text-slate-500 shadow-sm transition" title="Export JSON"><Download className="w-4 h-4" /></button>
            {manualWiring && <div className="px-2.5 py-1 text-[10px] rounded bg-cyan-600 text-white flex items-center gap-1 font-bold"><Link2 className="w-3.5 h-3.5" /> Manual Wiring Mode</div>}
          </div>

          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              onNodesChange={(changes) => setNodes((n) => applyNodeChanges(changes, n))}
              onEdgesChange={(changes) => setEdges((e) => applyEdgeChanges(changes, e))}
              onConnect={(connection: Connection) => {
                if (!manualWiring) return;
                setEdges((eds) => addEdge({ ...connection, animated: true, style: { strokeWidth: 2, stroke: '#06b6d4' } }, eds));
              }}
              nodesDraggable
            >
              <Background gap={14} size={1.2} />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>
        </div>

        {/* Results Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm transition ${getReliabilityColor(systemReliability)}`}>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">System Reliability</div>
              <div className="text-3xl font-black mt-1">{(systemReliability * 100).toFixed(4)}%</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-inner flex items-center justify-center shrink-0">
              {systemReliability > 0.95 ? (
                <Check className="w-6 h-6 text-emerald-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-500" />
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-205 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Logical Formula</div>
              <code className="text-xs font-mono text-slate-700 dark:text-slate-300 block bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 truncate">
                {useMonteCarlo ? 'Monte Carlo (N=10,000)' : (mode === RBDBlockType.SERIES ? 'Rs = R1 * R2 * ...' : 'Rs = R_ind * (1 - Q_ccf)')}
              </code>
            </div>
          </div>
        </div>

        {/* KaTeX math steps */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-750 overflow-x-auto space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <RotateCcw className="w-4 h-4 text-cyan-600" /> RBD Math Calculation Steps
          </h3>
          <div className="bg-white dark:bg-slate-900/80 p-5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase">Active Formula</span>
              <BlockMath math={reliabilitySteps.formula} />
            </div>
            <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-black uppercase">Expansion Step</span>
              <BlockMath math={reliabilitySteps.expansion} />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-[10px] text-slate-400 font-black uppercase">Resulting System Reliability</span>
              <span className="font-mono font-black text-cyan-600 dark:text-cyan-400">R_s = {reliabilitySteps.result}</span>
            </div>
          </div>
        </div>

        {/* Share and Export */}
        <div className="mt-4">
          <ShareAndExport 
            toolName="RBD Analysis"
            shareUrl={shareUrl}
            chartRef={toolRef}
            resultSummary={`${(systemReliability * 100).toFixed(4)}%`}
            exportData={[
              { Parameter: "RBD Mode", Value: mode },
              { Parameter: "Simulation Mode", Value: useMonteCarlo ? "Monte Carlo" : "Analytical" },
              { Parameter: "CCF Beta", Value: ccfBeta.toString() },
              { Parameter: "Number of Blocks", Value: blocks.length.toString() },
              {},
              { Parameter: "--- BLOCKS ---", Value: "" },
              ...blocks.map(b => ({ Parameter: b.name, Value: b.reliability.toFixed(4) })),
              {},
              { Parameter: "--- RESULTS ---", Value: "" },
              { Parameter: "System Reliability", Value: (systemReliability * 100).toFixed(4) + "%" }
            ]}
          />
        </div>

      </div>
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Logical Architecture of RBD</h2>
        <p className="text-slate-655 dark:text-slate-400 max-w-2xl mx-auto">
          A Reliability Block Diagram (RBD) is a visual, logical representation of how components must work together to sustain system success.
        </p>
      </div>

      <div className="my-8">
        <RbdSeriesParallelDiagram />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Logical vs. Physical Connections"
          icon={<Layers className="w-5 h-5" />}
          delay={0.1}
        >
          <p className="text-sm text-slate-655 dark:text-slate-300 leading-relaxed">
            It is critical to distinguish between physical wiring and <strong className="text-cyan-600 dark:text-cyan-400 font-bold">logical routing</strong>. Two pumps physically arranged side-by-side are physically connected in parallel, but they represent a logical parallel in an RBD only if one is standby (a single pump keeps flow alive). If both must work to sustain full capacity, they are represented in logical <span className="text-rose-600 dark:text-rose-455 font-semibold">Series</span>.
          </p>
        </TheoryBlock>

        <TheoryBlock 
          title="Common Cause Failures (CCF) & Beta Factor"
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.2}
        >
          <p className="text-sm text-slate-655 dark:text-slate-300 leading-relaxed">
            Standard parallel calculations assume that failures are completely independent. In reality, shared environment factors (heat, layout, power source) cause simultaneous failures. The <strong className="text-purple-600 dark:text-purple-400 font-bold">Beta Factor (β)</strong> models this coupling. Even with infinite parallel redundancy, system reliability is capped by the likelihood of a shared failure path.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: 'Can I drag nodes freely?',
      answer: 'Yes. All block elements, including input and output anchors, are freely draggable on the canvas.'
    },
    {
      question: 'How do I draw custom connectors?',
      answer: 'Enable the **Manual Connector Lines** toggle. Once active, drag from the source handle (Right side of a block) to the target handle (Left side of another block) to create custom routing paths.'
    },
    {
      question: 'What is the Common Cause Failure (CCF) Beta factor?',
      answer: 'The Beta factor ($\\beta$) represents the proportion of failures that affect multiple redundant components simultaneously. Adding a Beta factor penalizes parallel system reliability to prevent overly optimistic estimates.'
    },
    {
      question: 'How does the Monte Carlo simulation handle complex RBDs?',
      answer: 'The simulator runs 10,000 statistical trials where each block is randomly set to a working or failed state based on its reliability. It then uses connectivity algorithms to check if there is an unbroken path from the input \'In\' anchor to the output \'Out\' anchor.'
    },
    {
      question: 'What is the difference between physical wiring and logical RBD routing?',
      answer: 'A Reliability Block Diagram shows logical failure relationships, not physical wiring. For example, two pumps in physical series might be in logical parallel (RBD parallel) if only one of them is required to sustain operational flow.'
    }
  ];

  return (
    <ToolContentLayout
      title="Reliability Block Diagram (RBD) Tool"
      description="Build and drag reliability nodes on a live canvas, connect paths, and calculate system reliability for series or parallel architectures."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      keywords="reliability block diagram calculator, RBD builder, series parallel reliability, common cause failures beta, Monte Carlo system simulation reliability, safety loops redundancy"
      canonicalUrl="https://reliabilitytools.co.in/#/tools/rbd"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'RBD Calculator',
        applicationCategory: 'UtilitiesApplication'
      }}
    />
  );
};

export default RbdTool;
