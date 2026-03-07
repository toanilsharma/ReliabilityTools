import React, { useState } from 'react';
import { Plus, Trash2, GitMerge, LayoutList, Download, Activity, FileText } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import HelpTooltip from '../../components/HelpTooltip';

type NodeType = 'AND' | 'OR' | 'EVENT';

interface FTANode {
  id: string;
  type: NodeType;
  name: string;
  probability: number;
  children: FTANode[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const FaultTreeAnalysis: React.FC = () => {
  const [tree, setTree] = useState<FTANode>({
    id: generateId(),
    type: 'OR',
    name: 'Top Event',
    probability: 0,
    children: [
      { id: generateId(), type: 'EVENT', name: 'Software Failure', probability: 0.05, children: [] },
      { id: generateId(), type: 'AND', name: 'Hardware Failure', probability: 0, children: [
          { id: generateId(), type: 'EVENT', name: 'Primary Pump Fails', probability: 0.1, children: [] },
          { id: generateId(), type: 'EVENT', name: 'Backup Pump Fails', probability: 0.1, children: [] }
      ]}
    ]
  });

  // Math
  const calculateProbability = (node: FTANode): number => {
    if (node.type === 'EVENT') return node.probability;
    if (node.children.length === 0) return 0;
    
    if (node.type === 'AND') {
      return node.children.reduce((acc, child) => acc * calculateProbability(child), 1);
    } else { // OR
      const unreliabilityProd = node.children.reduce((acc, child) => acc * (1 - calculateProbability(child)), 1);
      return 1 - unreliabilityProd;
    }
  };

  const topEventProbability = calculateProbability(tree);

  // Tree manipulation
  const updateNode = (currentNode: FTANode, id: string, modifier: (n: FTANode) => FTANode): FTANode => {
    if (currentNode.id === id) return modifier({ ...currentNode });
    return {
      ...currentNode,
      children: currentNode.children.map(child => updateNode(child, id, modifier))
    };
  };

  const addChild = (parentId: string, type: NodeType) => {
    setTree(updateNode(tree, parentId, (node) => ({
      ...node,
      children: [...node.children, { id: generateId(), type, name: type === 'EVENT' ? 'New Event' : `New ${type} Gate`, probability: 0.01, children: [] }]
    })));
  };

  const removeChild = (parentId: string, childId: string) => {
    setTree(updateNode(tree, parentId, (node) => ({
      ...node,
      children: node.children.filter(c => c.id !== childId)
    })));
  };

  // UI Components
  const NodeView: React.FC<{ node: FTANode, parentId: string | null }> = ({ node, parentId }) => {
    const isGate = node.type === 'AND' || node.type === 'OR';
    const prob = isGate ? calculateProbability(node) : node.probability;

    return (
      <div className="flex flex-col items-center">
        <div className={`relative p-3 rounded-lg border-2 min-w-[160px] shadow-sm flex flex-col items-center
          ${node.type === 'OR' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300' : 
            node.type === 'AND' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 
            'bg-white dark:bg-slate-800 border-slate-300'}`}>
          
          {parentId && (
            <button onClick={() => removeChild(parentId, node.id)} className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm">
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          <div className="flex flex-col items-center text-center w-full">
            <input 
              value={node.name}
              onChange={(e) => setTree(updateNode(tree, node.id, n => ({ ...n, name: e.target.value })))}
              className="text-sm font-bold bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-cyan-500 outline-none w-full"
            />
            
            {isGate ? (
              <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-500 uppercase">{node.type} GATE</div>
            ) : (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px] text-slate-500">P =</span>
                <input 
                  type="number" step="0.001" min="0" max="1"
                  value={node.probability}
                  onChange={(e) => setTree(updateNode(tree, node.id, n => ({ ...n, probability: parseFloat(e.target.value) || 0 })))}
                  className="w-16 text-xs text-center border border-slate-200 rounded p-1 dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
            )}

            {isGate && (
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-2 font-bold">
                P(gate) = {prob.toExponential(3)}
              </div>
            )}
          </div>

          {isGate && (
            <div className="flex gap-1 mt-3">
              <button onClick={() => addChild(node.id, 'EVENT')} className="text-[10px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">+ Event</button>
              <button onClick={() => addChild(node.id, 'AND')} className="text-[10px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">+ AND</button>
              <button onClick={() => addChild(node.id, 'OR')} className="text-[10px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">+ OR</button>
            </div>
          )}
        </div>

        {/* Children rendering */}
        {node.children.length > 0 && (
          <div className="flex flex-col items-center mt-2">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex gap-6 relative">
              {/* Horizontal connecting line for > 1 child */}
              {node.children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-600"
                     style={{ left: `calc(50% / ${node.children.length})`, right: `calc(50% / ${node.children.length})` }}></div>
              )}
              {node.children.map(child => (
                <div key={child.id} className="flex flex-col items-center pt-4 relative">
                  {node.children.length > 1 && <div className="absolute top-0 w-0.5 h-4 bg-slate-300 dark:bg-slate-600"></div>}
                  <NodeView node={child} parentId={node.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ToolComponent = (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Top Event Probability</h3>
          <p className="text-sm text-slate-500">The overall likelihood of the system failure occurring.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border-2 border-cyan-500 px-6 py-3 rounded-xl shadow-sm text-center">
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {topEventProbability.toFixed(5)}
          </div>
          <div className="text-xs text-cyan-600 mt-1 uppercase font-bold tracking-wider">
            {topEventProbability.toExponential(3)}
          </div>
        </div>
      </div>

      {/* Tree View Canvas */}
      <div className="bg-slate-50 dark:bg-slate-900 overflow-x-auto p-8 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[500px]">
        <div className="flex justify-center min-w-max pb-16">
          <NodeView node={tree} parentId={null} />
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2>What is Fault Tree Analysis (FTA)?</h2>
      <p>
        FTA is a top-down, deductive failure analysis in which an undesired state of a system is analyzed using Boolean logic to combine a series of lower-level events. It is primarily used in safety engineering and reliability engineering to understand how systems can fail, to identify the best ways to reduce risk, or to determine event rates of a safety accident.
      </p>
      
      <h2>Logic Gates</h2>
      <div className="grid md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 dark:text-blue-300">AND Gate</h3>
          <p className="text-sm mt-2">The output event occurs only if ALL of the input events occur.</p>
          <code className="block mt-2 text-xs bg-white dark:bg-slate-800 p-2 rounded">P = P(A) × P(B)</code>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200">
          <h3 className="font-bold text-amber-800 dark:text-amber-300">OR Gate</h3>
          <p className="text-sm mt-2">The output event occurs if ANY of the input events occur.</p>
          <code className="block mt-2 text-xs bg-white dark:bg-slate-800 p-2 rounded">P = 1 - (1-P(A)) × (1-P(B))</code>
        </div>
      </div>
    </div>
  );

  return (
    <ToolContentLayout
      title="Visual Fault Tree Analysis (FTA)"
      description="Calculate the combined probability of complex top events using interactive Boolean logic gates (AND/OR)."
      toolComponent={ToolComponent}
      content={Content}
      faqs={[]}
      schema={{ "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "FTA Calculator", "applicationCategory": "BusinessApplication" }}
    />
  );
};

export default FaultTreeAnalysis;
