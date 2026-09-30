import React from 'react';
import { Plus, Trash2, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Download, Layers } from 'lucide-react';

export interface CapaItem {
  id: string;
  sourceCause: string;
  actionDescription: string;
  actionType: 'Containment' | 'Permanent';
  hierarchy: 'Elimination' | 'Substitution' | 'Engineering' | 'Administrative' | 'PPE';
  owner: string;
  dueDate: string;
  verificationMetric: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

interface RcaCapaMatrixProps {
  capas: CapaItem[];
  onUpdateCapas: (capas: CapaItem[]) => void;
  suggestedCauses?: string[];
  title?: string;
  subtitle?: string;
}

export const HIERARCHY_COLORS: Record<CapaItem['hierarchy'], { badge: string; text: string }> = {
  Elimination: {
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    text: 'Elimination (Top Tier)'
  },
  Substitution: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    text: 'Substitution'
  },
  Engineering: {
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    text: 'Engineering Control'
  },
  Administrative: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    text: 'Administrative / Procedure'
  },
  PPE: {
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    text: 'PPE (Lowest Tier)'
  }
};

export const STATUS_COLORS: Record<CapaItem['status'], { badge: string; icon: React.ReactNode }> = {
  Open: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    icon: <AlertTriangle className="w-3 h-3 text-rose-500" />
  },
  'In Progress': {
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    icon: <Clock className="w-3 h-3 text-cyan-500" />
  },
  Closed: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />
  }
};

const RcaCapaMatrix: React.FC<RcaCapaMatrixProps> = ({
  capas,
  onUpdateCapas,
  suggestedCauses = [],
  title = 'RCA-to-CAPA Action Matrix',
  subtitle = 'Translate identified root causes into auditable corrective and preventive actions with owners, hierarchy tiers, and verification metrics.'
}) => {
  const handleAddCapa = () => {
    const nextId = String(Date.now());
    const newRow: CapaItem = {
      id: nextId,
      sourceCause: suggestedCauses[0] || 'Unidentified root cause',
      actionDescription: '',
      actionType: 'Permanent',
      hierarchy: 'Engineering',
      owner: 'Reliability Engineer',
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      verificationMetric: 'Zero repeat alarms for 60 operating days',
      status: 'Open'
    };
    onUpdateCapas([...capas, newRow]);
  };

  const handleRemoveCapa = (id: string) => {
    if (capas.length <= 1) return;
    onUpdateCapas(capas.filter((c) => c.id !== id));
  };

  const handleChange = (id: string, field: keyof CapaItem, value: any) => {
    onUpdateCapas(
      capas.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const handleToggleStatus = (id: string) => {
    onUpdateCapas(
      capas.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status === 'Open' ? 'In Progress' : c.status === 'In Progress' ? 'Closed' : 'Open';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleExportCsv = () => {
    const headers = [
      'CAPA ID',
      'Source Cause',
      'Action Description',
      'Action Type',
      'Hierarchy of Controls',
      'Owner / Dept',
      'Due Date',
      'Verification Metric (KPI)',
      'Status'
    ];

    const rows = capas.map((c) => [
      `"${c.id}"`,
      `"${(c.sourceCause || '').replace(/"/g, '""')}"`,
      `"${(c.actionDescription || '').replace(/"/g, '""')}"`,
      `"${c.actionType}"`,
      `"${c.hierarchy}"`,
      `"${(c.owner || '').replace(/"/g, '""')}"`,
      `"${c.dueDate}"`,
      `"${(c.verificationMetric || '').replace(/"/g, '""')}"`,
      `"${c.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CAPA_Matrix_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics summary
  const total = capas.length;
  const closedCount = capas.filter((c) => c.status === 'Closed').length;
  const inProgressCount = capas.filter((c) => c.status === 'In Progress').length;
  const openCount = capas.filter((c) => c.status === 'Open').length;
  const permanentCount = capas.filter((c) => c.actionType === 'Permanent').length;
  const highTierControlsCount = capas.filter(
    (c) => c.hierarchy === 'Elimination' || c.hierarchy === 'Substitution' || c.hierarchy === 'Engineering'
  ).length;

  const robustActionPct = total > 0 ? Math.round((highTierControlsCount / total) * 100) : 0;
  const completionPct = total > 0 ? Math.round((closedCount / total) * 100) : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddCapa}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add CAPA Action
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Actions</span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
            {total} <span className="text-xs font-normal text-slate-400">({openCount} open, {inProgressCount} active)</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Closure Rate</span>
          <div className="text-xl font-black font-mono text-emerald-500 mt-0.5">
            {completionPct}% <span className="text-xs font-normal text-slate-400">({closedCount}/{total})</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Permanent vs Containment</span>
          <div className="text-xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
            {permanentCount} <span className="text-xs font-normal text-slate-400">Permanent ({total - permanentCount} Containment)</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">High-Tier Hierarchy Quality</span>
          <div className="text-xl font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5">
            {robustActionPct}% <span className="text-xs font-normal text-slate-400">Elim/Sub/Eng</span>
          </div>
        </div>
      </div>

      {/* Interactive CAPA Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3 w-10 text-center">#</th>
              <th className="p-3 min-w-[150px]">Source Cause</th>
              <th className="p-3 min-w-[200px]">Action Item / Task</th>
              <th className="p-3 min-w-[120px]">Type</th>
              <th className="p-3 min-w-[160px]">Hierarchy Tier</th>
              <th className="p-3 min-w-[130px]">Owner / Dept</th>
              <th className="p-3 min-w-[120px]">Due Date</th>
              <th className="p-3 min-w-[180px]">Verification Metric (KPI)</th>
              <th className="p-3 min-w-[110px] text-center">Status</th>
              <th className="p-3 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {capas.map((capa, idx) => {
              const statusCfg = STATUS_COLORS[capa.status];
              return (
                <tr key={capa.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono text-slate-400 text-center font-bold">{idx + 1}</td>
                  
                  {/* Source Cause */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={capa.sourceCause}
                      onChange={(e) => handleChange(capa.id, 'sourceCause', e.target.value)}
                      placeholder="Identified Cause..."
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </td>

                  {/* Action Description */}
                  <td className="p-3">
                    <textarea
                      rows={2}
                      value={capa.actionDescription}
                      onChange={(e) => handleChange(capa.id, 'actionDescription', e.target.value)}
                      placeholder="Specific corrective/preventive task..."
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                    />
                  </td>

                  {/* Action Type */}
                  <td className="p-3">
                    <select
                      value={capa.actionType}
                      onChange={(e) => handleChange(capa.id, 'actionType', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Containment">Containment (Immediate)</option>
                      <option value="Permanent">Permanent (Preventive)</option>
                    </select>
                  </td>

                  {/* Hierarchy Tier */}
                  <td className="p-3">
                    <select
                      value={capa.hierarchy}
                      onChange={(e) => handleChange(capa.id, 'hierarchy', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value="Elimination">Elimination (Tier 1)</option>
                      <option value="Substitution">Substitution (Tier 2)</option>
                      <option value="Engineering">Engineering Control (Tier 3)</option>
                      <option value="Administrative">Administrative / PM (Tier 4)</option>
                      <option value="PPE">PPE / Safeguards (Tier 5)</option>
                    </select>
                  </td>

                  {/* Owner */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={capa.owner}
                      onChange={(e) => handleChange(capa.id, 'owner', e.target.value)}
                      placeholder="e.g. Mechanical Reliability"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                    />
                  </td>

                  {/* Due Date */}
                  <td className="p-3">
                    <input
                      type="date"
                      value={capa.dueDate}
                      onChange={(e) => handleChange(capa.id, 'dueDate', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </td>

                  {/* Verification Metric */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={capa.verificationMetric}
                      onChange={(e) => handleChange(capa.id, 'verificationMetric', e.target.value)}
                      placeholder="Objective validation KPI..."
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200"
                    />
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(capa.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-transform active:scale-95 ${statusCfg.badge}`}
                      title="Click to cycle status: Open -> In Progress -> Closed"
                    >
                      {statusCfg.icon}
                      <span>{capa.status}</span>
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="p-3 text-center">
                    {capas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCapa(capa.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete action"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span>Click any status badge to cycle: <strong>Open &rarr; In Progress &rarr; Closed</strong></span>
        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
          OSHA / ISO 9001 / IATF 16949 Auditable Format
        </span>
      </div>
    </div>
  );
};

export default RcaCapaMatrix;
