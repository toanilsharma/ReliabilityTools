import React, { useState, useMemo, useEffect } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RBDBlock, RBDBlockType } from '../../types';
import { calculateSeriesReliability, calculateParallelReliability, calculateMonteCarloRBD } from '../../services/reliabilityMath';
import { Plus, Trash2, Download, Check, Link2, Map as MapIcon } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


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


  const addBlock = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setBlocks([...blocks, { id: newId, name: 'New Block', reliability: 0.9 }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, field: keyof RBDBlock, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  useEffect(() => {
    const previousPositions = new Map(nodes.map(n => [n.id, n.position]));

    const defaultNodes: Node[] = [];
    const defaultEdges: Edge[] = [];

    defaultNodes.push({
      id: 'start',
      position: previousPositions.get('start') ?? { x: 30, y: mode === RBDBlockType.SERIES ? 170 : (Math.max(blocks.length, 1) * 100) / 2 },
      data: { label: 'In' },
      type: 'input',
      style: { width: 44, height: 44, borderRadius: '50%', background: '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' },
      sourcePosition: Position.Right,
      draggable: true,
    });

    blocks.forEach((b, i) => {
      defaultNodes.push({
        id: b.id,
        position: previousPositions.get(b.id) ?? (mode === RBDBlockType.SERIES ? { x: 180 + i * 180, y: 150 } : { x: 260, y: 70 + i * 110 }),
        data: { label: `${b.name}\nR: ${b.reliability.toFixed(2)}` },
        style: {
          background: '#fff',
          border: `2px solid ${mode === RBDBlockType.SERIES ? '#3b82f6' : '#a855f7'}`,
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          minWidth: '110px'
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
      });
    });

    defaultNodes.push({
      id: 'end',
      position: previousPositions.get('end') ?? (mode === RBDBlockType.SERIES ? { x: 210 + blocks.length * 180, y: 170 } : { x: 520, y: (Math.max(blocks.length, 1) * 100) / 2 }),
      data: { label: 'Out' },
      type: 'output',
      style: { width: 44, height: 44, borderRadius: '50%', background: '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' },
      targetPosition: Position.Left,
      draggable: true,
    });

    if (mode === RBDBlockType.SERIES) {
      if (blocks.length > 0) {
        defaultEdges.push({ id: `e-start-${blocks[0].id}`, source: 'start', target: blocks[0].id, type: 'smoothstep', animated: true, style: { strokeWidth: 2 } });
        for (let i = 0; i < blocks.length - 1; i++) {
          defaultEdges.push({ id: `e-${blocks[i].id}-${blocks[i + 1].id}`, source: blocks[i].id, target: blocks[i + 1].id, type: 'smoothstep', animated: true, style: { strokeWidth: 2 } });
        }
        defaultEdges.push({ id: `e-${blocks[blocks.length - 1].id}-end`, source: blocks[blocks.length - 1].id, target: 'end', type: 'smoothstep', animated: true, style: { strokeWidth: 2 } });
      } else {
        defaultEdges.push({ id: 'e-start-end', source: 'start', target: 'end', animated: true });
      }
    } else {
      blocks.forEach(b => {
        defaultEdges.push({ id: `e-start-${b.id}`, source: 'start', target: b.id, type: 'smoothstep', animated: true, style: { strokeWidth: 2 } });
        defaultEdges.push({ id: `e-${b.id}-end`, source: b.id, target: 'end', type: 'smoothstep', animated: true, style: { strokeWidth: 2 } });
      });
    }

    setNodes(defaultNodes);
    if (!manualWiring) setEdges(defaultEdges);
  }, [blocks, mode]);

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

  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4">
            <button onClick={() => setMode(RBDBlockType.SERIES)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === RBDBlockType.SERIES ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>SERIES</button>
            <button onClick={() => setMode(RBDBlockType.PARALLEL)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === RBDBlockType.PARALLEL ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>PARALLEL</button>
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

          <div className="mt-6 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
              Advanced Modeling
              <HelpTooltip text="Drag nodes directly on canvas. Toggle manual wiring to create custom connector lines." />
            </h4>

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={useMonteCarlo} onChange={(e) => setUseMonteCarlo(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-transparent" />
              Use Monte Carlo Simulation (10k iter.)
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={manualWiring} onChange={(e) => setManualWiring(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-transparent" />
              Manual Connector Lines
            </label>

            {mode === RBDBlockType.PARALLEL && (
              <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">CCF Beta Factor</span>
                  <span className="text-xs text-blue-600 font-mono">{ccfBeta.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0" max="0.5" step="0.01"
                  value={ccfBeta}
                  onChange={(e) => setCcfBeta(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="flex-grow bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 relative min-h-[420px]">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={exportJson} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 text-slate-500" title="Export JSON"><Download className="w-4 h-4" /></button>
            {manualWiring && <div className="px-2 py-1 text-xs rounded bg-cyan-600 text-white flex items-center gap-1"><Link2 className="w-3 h-3" /> Connect nodes</div>}
          </div>

          <div className="w-full h-[400px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              onNodesChange={(changes) => setNodes((n) => applyNodeChanges(changes, n))}
              onEdgesChange={(changes) => setEdges((e) => applyEdgeChanges(changes, e))}
              onConnect={(connection: Connection) => {
                if (!manualWiring) return;
                setEdges((eds) => addEdge({ ...connection, animated: true, style: { strokeWidth: 2 } }, eds));
              }}
              nodesDraggable
              className="bg-slate-50 dark:bg-slate-900"
            >
              <Background gap={12} size={1} />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold">System Reliability</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{(systemReliability * 100).toFixed(4)}%</div>
            </div>
            <div className={`p-2 rounded-full ${systemReliability > 0.9 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {systemReliability > 0.9 ? <Check className="w-6 h-6" /> : <div className="w-6 h-6">!</div>}
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Formula Used</div>
            <code className="text-xs font-mono text-slate-700 dark:text-slate-300 block">
              {useMonteCarlo ? 'Monte Carlo (N=10,000)' : (mode === RBDBlockType.SERIES ? 'Rs = R1 * R2 * ...' : 'Rs = R_ind * (1 - Q_ccf)')}
            </code>
          </div>
          </div>
        </div>
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
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Interactive RBD Builder</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Build complex system architectures by dragging graphical nodes onto the canvas and wiring custom connector lines to calculate aggregated system availability and reliability.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="Canvas Interface Features"
          icon={<MapIcon className="w-5 h-5" />}
          delay={0.1}
        >
          <ul className="space-y-2 mt-3 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Persistent Placement:</strong> Drag nodes freely across the workspace without layout snapping.</li>
            <li><strong>Custom Paths:</strong> Enable 'Manual Connector Lines' to wire precise redundant pathways instead of relying on auto-layout.</li>
            <li><strong>Data Integrity:</strong> Download the entire simulated network, including physical 2D node coordinates and edge vectors, via JSON export.</li>
          </ul>
        </TheoryBlock>
      </div>
    </div>
  );

  const faqs = [
    {
      question: 'Can I drag nodes freely?',
      answer: 'Yes. All nodes are draggable, including start/end anchors.'
    },
    {
      question: 'How do I draw custom connectors?',
      answer: 'Enable Manual Connector Lines and drag from one node handle to another.'
    }
  ];

  return (
    <ToolContentLayout
      title="Reliability Block Diagram (RBD) Tool"
      description="Build and drag reliability nodes on a live canvas, connect paths, and calculate system reliability for series or parallel architectures."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
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


