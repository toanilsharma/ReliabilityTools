
import React, { useState } from 'react';
import { PMTask } from '../../types';
import { Calendar, Plus, Trash2, Download, FileText, BookOpen, Target, TrendingUp, Sliders, CheckSquare, Clock } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import ToolContentLayout from '../../components/ToolContentLayout';

const PmScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<PMTask[]>([
    { id: '1', name: 'Inspect Hydraulic Seals', intervalDays: 30, lastPerformed: '2023-10-01' },
    { id: '2', name: 'Replace Oil Filter', intervalDays: 90, lastPerformed: '2023-09-15' },
    { id: '3', name: 'Calibrate Sensors', intervalDays: 180, lastPerformed: '2023-06-01' },
  ]);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskInterval, setNewTaskInterval] = useState('');
  const [newTaskLastDate, setNewTaskLastDate] = useState('');
  const [recMtbf, setRecMtbf] = useState(5000);
  const [recCriticality, setRecCriticality] = useState(2);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName || !newTaskInterval || !newTaskLastDate) return;

    const task: PMTask = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTaskName,
      intervalDays: parseInt(newTaskInterval),
      lastPerformed: newTaskLastDate
    };
    setTasks([...tasks, task]);
    setNewTaskName('');
    setNewTaskInterval('');
    setNewTaskLastDate('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const generateSchedule = () => {
    const events: { date: Date; taskName: string }[] = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 3);

    tasks.forEach(task => {
      let nextDate = new Date(task.lastPerformed);
      nextDate.setDate(nextDate.getDate() + task.intervalDays);

      while (nextDate <= endDate) {
        if (nextDate >= today) {
          events.push({ date: new Date(nextDate), taskName: task.name });
        }
        nextDate.setDate(nextDate.getDate() + task.intervalDays);
      }
    });
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const schedule = generateSchedule();

  const handleExport = () => {
    const headers = "Date,Task Name\n";
    const csv = schedule.map(e => `${e.date.toISOString().split('T')[0]},${e.taskName}`).join('\n');
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pm_schedule.csv';
    a.click();
  };

  const getRecommendation = () => {
    const factor = recCriticality === 3 ? 8 : recCriticality === 2 ? 6 : 3;
    const intervalHours = recMtbf / factor;
    const intervalDays = Math.round(intervalHours / 24);
    return { hours: Math.round(intervalHours), days: intervalDays };
  };

  const rec = getRecommendation();

  // --- Tool Component ---
  const ToolComponent = (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Add New Task
          </h3>
          <form onSubmit={addTask} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Task Description</label>
              <input value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="e.g. Inspect Belt" className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Interval (Days)</label>
                <input type="number" value={newTaskInterval} onChange={e => setNewTaskInterval(e.target.value)} placeholder="30" className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Last Done</label>
                <input type="date" value={newTaskLastDate} onChange={e => setNewTaskLastDate(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none" required />
              </div>
            </div>
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">Add Task</button>
          </form>
        </div>

        {/* Recommender */}
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-purple-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" /> AI Interval Optimizer
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Component MTBF (Hours)</label>
              <input type="number" value={recMtbf} onChange={e => setRecMtbf(Number(e.target.value))} className="w-full border border-slate-200 dark:border-slate-700 rounded p-1.5 text-sm dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Criticality</label>
              <select value={recCriticality} onChange={e => setRecCriticality(Number(e.target.value))} className="w-full border border-slate-200 dark:border-slate-700 rounded p-1.5 text-sm dark:bg-slate-800">
                <option value={1}>Low (Run to Failure)</option>
                <option value={2}>Medium (Production Loss)</option>
                <option value={3}>High (Safety/Env)</option>
              </select>
            </div>
            <div className="mt-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-purple-100 dark:border-slate-600 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold">Recommended Interval</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{rec.days} Days</div>
              <div className="text-xs text-slate-500">({rec.hours} operating hours)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule View */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" /> 3-Month Forecast
          </h3>
          <button onClick={handleExport} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-cyan-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded transition-colors">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-0 custom-scrollbar max-h-[500px]">
          {schedule.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.map((event, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-16 text-center bg-slate-100 dark:bg-slate-800 rounded-lg p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{event.date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{event.date.getDate()}</div>
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{event.taskName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {event.date.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded shadow-sm hover:text-green-600 flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" /> Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>No upcoming tasks. Add a task to generate a schedule.</p>
            </div>
          )}
        </div>

        {/* Task List Mini */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Active Definitions ({tasks.length})</h4>
          <div className="flex flex-wrap gap-2">
            {tasks.map(t => (
              <div key={t.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs font-medium dark:text-slate-300">{t.name}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 rounded text-slate-500">{t.intervalDays}d</span>
                <button onClick={() => removeTask(t.id)} className="text-slate-400 hover:text-red-500 ml-1"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Content = (
    <div>
      <h2 id="overview">What is PM Scheduling?</h2>
      <p>
        <strong>Preventive Maintenance (PM)</strong> is a proactive strategy where assets are serviced at regular intervals (time-based) or usage thresholds (meter-based) to reduce the likelihood of failure.
      </p>
      <p>
        A good PM schedule balances the cost of maintenance against the cost of failure. If you maintain too often, you waste money and risk introducing human error ("Infant Mortality"). If you maintain too rarely, you risk catastrophic breakdown.
      </p>

      <h2 id="optimization">Optimizing Intervals</h2>
      <p>
        The "Sweet Spot" for PM intervals is often determined by the <strong>P-F Curve</strong>. You want the interval to be smaller than the P-F Interval (the time between a detectable potential failure and functional failure).
      </p>
      <ul>
        <li><strong>Rule of Thumb:</strong> Set PM interval to <strong>1/2 to 1/6</strong> of the PF Interval.</li>
        <li><strong>Example:</strong> If a bearing vibrates for 3 months before seizing (PF Interval = 90 days), check it every 1 month (30 days) to catch it in time.</li>
      </ul>

      <h2 id="compliance">Compliance vs. Reliability</h2>
      <p>
        Some PMs are mandatory for regulatory compliance (e.g., Fire Safety Inspections, Pressure Vessel Testing). Others are discretionary for reliability. This tool helps you track both in a single view.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What is the difference between PM and PdM?",
      answer: "<strong>PM (Preventive)</strong> is time-based (e.g., replace oil every 3 months). <strong>PdM (Predictive)</strong> is condition-based (e.g., replace oil only when analysis shows it's degraded). PdM is generally more cost-effective but requires sensors/data."
    },
    {
      question: "Can I use this for non-time based tasks?",
      answer: "This simplified scheduler uses calendar days. For usage-based PMs (e.g., every 500 running hours), you would need to estimate the average daily usage to convert 'hours' into 'days'."
    },
    {
      question: "Why does the recommender ask for criticality?",
      answer: "Critical assets justify more frequent checks. A failure on a critical pump stops the whole plant (High Risk), so we check it often. A failure on a bathroom exhaust fan (Low Risk) is annoying but tolerable, so we check it rarely."
    }
  ];

  return (
    <ToolContentLayout
      title="Preventive Maintenance (PM) Scheduler"
      description="Create a proactive maintenance calendar. Visualize upcoming tasks, optimize intervals based on asset criticality, and export your plan to CSV."
      toolComponent={ToolComponent}
      content={Content}
      faqs={faqs}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PM Scheduler",
        "applicationCategory": "ProductivityApplication"
      }}
    />
  );
};

export default PmScheduler;
