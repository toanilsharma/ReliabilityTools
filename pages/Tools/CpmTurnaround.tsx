import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Plus, 
  Trash2, 
  TrendingUp,
  Activity
} from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import RelatedTools from '../../components/RelatedTools';
import ShareAndExport from '../../components/ShareAndExport';
import { useRecentTools } from '../../hooks/useRecentTools';
import { useShareableState } from '../../hooks/useShareableState';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface TurnaroundActivity {
  id: string;
  code: string;
  name: string;
  durationDays: string;
  predecessors: string; // Comma-separated codes e.g. "A, B"
}

interface CpmState {
  turnaroundName: string;
  dailyDowntimeCost: string; // Opportunity cost of outage ($/day)
  activities: TurnaroundActivity[];
}

const DEFAULT_ACTIVITIES: TurnaroundActivity[] = [
  { id: '1', code: 'A', name: 'De-inventory & Nitrogen Purging', durationDays: '2', predecessors: '' },
  { id: '2', code: 'B', name: 'Scaffolding & Insulation Strip', durationDays: '3', predecessors: 'A' },
  { id: '3', code: 'C', name: 'Manway Opening & Cleaning', durationDays: '2', predecessors: 'A' },
  { id: '4', code: 'D', name: 'Internal Inspection & UT NDT', durationDays: '4', predecessors: 'B, C' },
  { id: '5', code: 'E', name: 'Weld Overlays & Tray Replacement', durationDays: '5', predecessors: 'D' },
  { id: '6', code: 'F', name: 'Box-Up, Inerting & Hydrotest', durationDays: '3', predecessors: 'E' },
  { id: '7', code: 'G', name: 'Instrument Loop Recalibration', durationDays: '2', predecessors: 'D' }
];

interface CpmNode extends TurnaroundActivity {
  dur: number;
  preds: string[];
  es: number;
  ef: number;
  ls: number;
  lf: number;
  float: number;
  isCritical: boolean;
}

export function solveCpm(activities: TurnaroundActivity[]): { nodes: CpmNode[]; totalDuration: number; criticalPath: string[] } {
  // Map raw inputs
  const codeMap = new Map<string, TurnaroundActivity>();
  activities.forEach(a => codeMap.set(a.code.trim().toUpperCase(), a));

  const parsed = activities.map(a => {
    const dur = Math.max(0, parseFloat(a.durationDays) || 0);
    const preds = a.predecessors
      .split(',')
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0 && codeMap.has(p));
    return { ...a, dur, preds, es: 0, ef: 0, ls: 0, lf: 0, float: 0, isCritical: false };
  });

  // 1. Forward Pass (Early Start, Early Finish)
  // Multiple topological sweeps to resolve dependencies
  for (let iter = 0; iter < parsed.length + 1; iter++) {
    for (const node of parsed) {
      if (node.preds.length === 0) {
        node.es = 0;
      } else {
        let maxPredEf = 0;
        for (const pCode of node.preds) {
          const pNode = parsed.find(n => n.code.trim().toUpperCase() === pCode);
          if (pNode && pNode.ef > maxPredEf) {
            maxPredEf = pNode.ef;
          }
        }
        node.es = maxPredEf;
      }
      node.ef = node.es + node.dur;
    }
  }

  const totalDuration = Math.max(0, ...parsed.map(n => n.ef));

  // 2. Backward Pass (Late Finish, Late Start)
  for (const node of parsed) {
    node.lf = totalDuration;
  }

  for (let iter = 0; iter < parsed.length + 1; iter++) {
    for (const node of parsed) {
      const code = node.code.trim().toUpperCase();
      // Find all successors (nodes that list this node as predecessor)
      const successors = parsed.filter(n => n.preds.includes(code));
      if (successors.length === 0) {
        node.lf = totalDuration;
      } else {
        let minSuccLs = Infinity;
        for (const s of successors) {
          if (s.ls < minSuccLs) {
            minSuccLs = s.ls;
          }
        }
        node.lf = minSuccLs === Infinity ? totalDuration : minSuccLs;
      }
      node.ls = node.lf - node.dur;
      node.float = Math.max(0, node.lf - node.ef);
      node.isCritical = Math.abs(node.float) < 1e-4;
    }
  }

  const criticalPath = parsed
    .filter(n => n.isCritical)
    .sort((a, b) => a.es - b.es)
    .map(n => n.code.trim().toUpperCase());

  return { nodes: parsed, totalDuration, criticalPath };
}

const CpmTurnaround: React.FC = () => {
  const [state, setState] = useShareableState<CpmState>({
    turnaroundName: 'FCCU Reactor Overhaul Turnaround',
    dailyDowntimeCost: '75000',
    activities: DEFAULT_ACTIVITIES
  });

  const { turnaroundName, dailyDowntimeCost, activities } = state;
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool({
      id: 'cpm-turnaround',
      name: 'CPM Turnaround Scheduler',
      path: '/tools/cpm-turnaround/'
    });
  }, []);

  const downtimePerDay = Math.max(0, parseFloat(dailyDowntimeCost) || 0);
  const { nodes, totalDuration, criticalPath } = solveCpm(activities);
  const totalOutageCost = totalDuration * downtimePerDay;

  const addActivity = () => {
    const nextCode = String.fromCharCode(65 + (activities.length % 26));
    const newAct: TurnaroundActivity = {
      id: Date.now().toString(),
      code: nextCode,
      name: `New Shutdown Task ${nextCode}`,
      durationDays: '3',
      predecessors: activities.length > 0 ? activities[activities.length - 1].code : ''
    };
    setState({ ...state, activities: [...activities, newAct] });
  };

  const updateActivity = (id: string, field: keyof TurnaroundActivity, val: string) => {
    setState({
      ...state,
      activities: activities.map(a => a.id === id ? { ...a, [field]: val } : a)
    });
  };

  const removeActivity = (id: string) => {
    setState({
      ...state,
      activities: activities.filter(a => a.id !== id)
    });
  };

  const ToolComponent = (
    <div className="space-y-8">
      {/* Parameter Configuration Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              ISO 21500 / PMI PMBOK Turnaround Network Logic
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Turnaround Shutdown Activity Schedule
            </h3>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full border font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
            Critical Path: {criticalPath.join(' → ')}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Turnaround / Outage Event Name
            </label>
            <input
              type="text"
              value={turnaroundName}
              onChange={(e) => setState({ ...state, turnaroundName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Daily Plant Downtime Opportunity Cost ($/Day)
            </label>
            <input
              type="number"
              value={dailyDowntimeCost}
              onChange={(e) => setState({ ...state, dailyDowntimeCost: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-cyan-500" /> Activity Network Logic Table
          </h4>
          <button
            onClick={addActivity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Turnaround Activity
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 w-16">Code</th>
                <th className="p-3">Work Scope Description</th>
                <th className="p-3 w-28">Duration (Days)</th>
                <th className="p-3 w-32">Predecessors</th>
                <th className="p-3">ES / EF</th>
                <th className="p-3">LS / LF</th>
                <th className="p-3">Total Float</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {nodes.map((node) => (
                <tr 
                  key={node.id} 
                  className={`transition-colors ${node.isCritical ? 'bg-rose-500/5 dark:bg-rose-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}`}
                >
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    <input
                      type="text"
                      value={node.code}
                      onChange={(e) => updateActivity(node.id, 'code', e.target.value)}
                      className="w-12 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded font-mono text-center font-bold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={node.name}
                      onChange={(e) => updateActivity(node.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={node.durationDays}
                      onChange={(e) => updateActivity(node.id, 'durationDays', e.target.value)}
                      className="w-20 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="e.g. A, B"
                      value={node.predecessors}
                      onChange={(e) => updateActivity(node.id, 'predecessors', e.target.value)}
                      className="w-24 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm uppercase text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                    Day {node.es} → {node.ef}
                  </td>
                  <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                    Day {node.ls} → {node.lf}
                  </td>
                  <td className="p-3 font-mono font-bold">
                    {node.isCritical ? (
                      <span className="text-xs px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded font-bold">
                        0 Days (Critical)
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                        +{node.float} Days
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeActivity(node.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Total Turnaround Duration</span>
          <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {totalDuration} Days
          </span>
          <span className="text-[11px] text-slate-400">Fixed by Critical Path</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Critical Path Sequence</span>
          <span className="text-xl font-black font-mono text-rose-500 mt-1 block">
            {criticalPath.join(' → ')}
          </span>
          <span className="text-[11px] text-slate-400">{criticalPath.length} Bottleneck Activities</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Downtime Revenue Penalty</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            ${Math.round(totalOutageCost).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400">@ ${Math.round(downtimePerDay).toLocaleString()}/day</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 block">Crashing Opportunity</span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-1 block">
            ${Math.round(downtimePerDay).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400">Value per critical day saved</span>
        </div>
      </div>

      <ShareAndExport
        toolName="CPM Turnaround & Shutdown Calculator"
        shareUrl="https://reliabilitytools.co.in/tools/cpm-turnaround/"
        inputs={{
          "Turnaround Event": turnaroundName,
          "Daily Downtime Cost": `$${dailyDowntimeCost}/day`,
          "Total Activities": activities.length
        }}
        results={{
          "Total Project Duration": `${totalDuration} Days`,
          "Critical Path": criticalPath.join(' -> '),
          "Total Outage Production Loss": `$${Math.round(totalOutageCost).toLocaleString()}`,
          "Critical Tasks Count": criticalPath.length
        }}
        exportData={nodes.map(n => ({
          Code: n.code,
          Activity: n.name,
          Duration_Days: n.dur,
          Predecessors: n.predecessors,
          Early_Start: n.es,
          Early_Finish: n.ef,
          Late_Start: n.ls,
          Late_Finish: n.lf,
          Total_Float_Days: n.float,
          Critical: n.isCritical ? "YES" : "NO"
        }))}
      />
    </div>
  );

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-6">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Plant Turnaround Management: <span className="text-cyan-600 dark:text-cyan-400">The Critical Path Method (CPM)</span>
        </h2>
        <p>
          In continuous process industries—including petrochemical refineries, cement plants, steel mills, and power generation stations—major overhauls, outages, and plant turnarounds (STOs) represent the single largest maintenance expenditure and financial risk. With plant downtime opportunity costs often exceeding $50,000 to $200,000 per day, schedule overruns directly erode annual corporate profitability.
        </p>
        <p>
          Standardized under <strong>ISO 21500</strong> (<em>Project, programme and portfolio management</em>) and the <strong>PMI PMBOK Guide</strong>, the <strong>Critical Path Method (CPM)</strong> provides the mathematical network scheduling algorithm required to identify which specific sequence of dependent activities directly dictates the total outage duration.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Understanding Total Float vs. Free Float
        </h3>
        <p>
          Activities in a plant turnaround fall into two distinct operational categories:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Critical Path Activities (Float = 0):</strong> Tasks where any delay directly extends the overall plant startup date. Expediting non-critical tasks yields zero time savings, whereas saving one day on a critical path task saves one full day of plant downtime.
          </li>
          <li>
            <strong>Total Float (Slack):</strong> The amount of time an activity can slip without delaying the final project completion date (<InlineMath math="\text{Float} = LF - EF = LS - ES" />). Non-critical tasks (such as motor recalibration or secondary painting) can absorb resource delays without affecting plant startup.
          </li>
        </ul>

        <h2 id="math" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          The Mathematics of CPM: Formulas & Standards
        </h2>
        <p>
          The Critical Path algorithm operates in two continuous mathematical sweeps across the activity precedence network:
        </p>
        <p className="mt-2 font-bold">1. Forward Pass (Calculates Earliest Times):</p>
        <div className="my-4">
          <BlockMath math="ES_j = \max_{i \in \text{Pred}(j)} (EF_i), \quad EF_j = ES_j + D_j" />
        </div>
        <p className="font-bold">2. Backward Pass (Calculates Latest Times):</p>
        <div className="my-4">
          <BlockMath math="LF_i = \min_{j \in \text{Succ}(i)} (LS_j), \quad LS_i = LF_i - D_i" />
        </div>
        <p className="font-bold">3. Total Float and Criticality Condition:</p>
        <div className="my-4">
          <BlockMath math="\text{Total Float } (TF_i) = LF_i - EF_i = LS_i - ES_i" />
          <BlockMath math="\text{Critical Condition: } TF_i = 0 \implies i \in \text{Critical Path}" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
          Worked Industrial Example: Crude Distillation Unit (CDU) Turnaround
        </h3>
        <p>
          Consider a 14-day turnaround overhaul sequence on a refinery atmospheric distillation tower:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong>Activity A (Purging & De-inventory):</strong> Duration = 2 days. <InlineMath math="ES=0, EF=2" />. Predecessors: None.</li>
          <li><strong>Activity B (Scaffolding & Insulation):</strong> Duration = 3 days. <InlineMath math="ES=2, EF=5" />. Predecessor: A.</li>
          <li><strong>Activity C (Manway Opening):</strong> Duration = 2 days. <InlineMath math="ES=2, EF=4" />. Predecessor: A.</li>
          <li><strong>Activity D (Internal Tray Overhaul):</strong> Duration = 5 days. Predecessors: B & C. <InlineMath math="ES = \max(5, 4) = 5, EF = 10" />.</li>
          <li><strong>Activity E (Hydrotest & Box Up):</strong> Duration = 3 days. Predecessor: D. <InlineMath math="ES = 10, EF = 13" />.</li>
        </ul>
        <p className="mt-3">
          <strong>Float Analysis for Activity C:</strong>
          The project finishes on Day 13 (<InlineMath math="LF_E = 13" />). Working backwards, for Activity D: <InlineMath math="LF_D = 10, LS_D = 5" />.
          For Activity C: <InlineMath math="LF_C = LS_D = 5" />. Since <InlineMath math="EF_C = 4" />,
          <InlineMath math="TF_C = 5 - 4 = 1\text{ Day of Float}" />.
        </p>
        <p>
          <strong>Outcome:</strong> The Critical Path is <strong>A → B → D → E (Total = 13 Days)</strong>. Activity C can absorb 1 day of delay without impacting restart. Expediting scaffolding (Activity B) by double-shifting scaffolding crews is the only valid way to compress the early turnaround schedule.
        </p>

        <h2 id="mistakes" className="text-3xl font-extrabold text-slate-900 dark:text-white mt-12 mb-6">
          Common Mistakes in Turnaround & Outage Scheduling
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Crashing Non-Critical Activities:</strong> Paying overtime premiums to accelerate work that has positive float wastes turnaround budget while leaving the overall plant restart date completely unchanged.
          </li>
          <li>
            <strong>Ignoring Critical Path Shifts (Dynamic Criticality):</strong> When you successfully compress an activity on the primary critical path, a near-critical sub-path can instantly become the new critical path. Schedules must be recalculated dynamically after every progress update.
          </li>
          <li>
            <strong>Uncontrolled Discovery Scope Creep:</strong> Over 40% of turnaround delays originate from unexpected corrosion or cracking found upon vessel opening. Discovery work orders must be scheduled against pre-planned contingency buffers rather than inserted indiscriminately into critical path lines.
          </li>
        </ul>
      </div>
    </div>
  );

  const faqs = [
    {
      question: "What is Schedule Crashing in a plant turnaround?",
      answer: "Schedule crashing is the technique of adding extra labor, multi-shift overtime, or specialized rigging equipment to compress the duration of activities strictly on the Critical Path, weighed against the financial value of recovering lost plant downtime."
    },
    {
      question: "What is the difference between Total Float and Free Float?",
      answer: "Total Float is the maximum time an activity can be delayed without delaying the final turnaround completion date. Free Float is the time an activity can slip without delaying the Early Start of any immediate successor activity."
    },
    {
      question: "What international standards govern project and turnaround scheduling?",
      answer: "Turnaround scheduling and Critical Path network management are formalized under <strong>ISO 21500</strong> (Guidance on project management) and the <strong>Project Management Institute (PMI) PMBOK Guide</strong> standards."
    }
  ];

  return (
    <ToolContentLayout
      title="CPM Turnaround Calculator – Free Online | Reliability Tools"
      description="Calculate the critical path, total float, and plant shutdown schedule duration for industrial maintenance turnarounds per ISO 21500 and PMI methodologies."
      toolComponent={ToolComponent}
      content={
        <>
          {Content}
          <RelatedTools currentToolId="cpm-turnaround" />
        </>
      }
      faqs={faqs}
      keywords="CPM turnaround calculator, critical path method, plant shutdown scheduling, ISO 21500, PMI PMBOK, outage planning, total float calculator, turnaround crashing"
      canonicalUrl="https://reliabilitytools.co.in/tools/cpm-turnaround/"
      schema={{
        "@context": "https://schema.org",
        "@type": ["WebApplication", "SoftwareApplication"],
        name: "CPM Turnaround Calculator – Free Online | Reliability Tools",
        applicationCategory: "EngineeringApplication",
        operatingSystem: "Web Browser",
        about: {
          "@type": "Thing",
          name: "ISO 21500 / PMI PMBOK",
          description: "International standards for project management and Critical Path Method (CPM) schedule optimization for plant outages and turnarounds."
        }
      }}
    />
  );
};

export default CpmTurnaround;
