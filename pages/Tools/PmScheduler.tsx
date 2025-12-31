
import React, { useState } from 'react';
import { PMTask } from '../../types';
import { Calendar, Plus, Trash2, Download, FileText, BookOpen, Target, TrendingUp, Sliders } from 'lucide-react';
import HelpTooltip from '../../components/HelpTooltip';
import RelatedTools from '../../components/RelatedTools';

const PmScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<PMTask[]>([
    { id: '1', name: 'Inspect Hydraulic Seals', intervalDays: 30, lastPerformed: '2023-10-01' },
    { id: '2', name: 'Replace Oil Filter', intervalDays: 90, lastPerformed: '2023-09-15' },
  ]);
  
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskInterval, setNewTaskInterval] = useState('');
  const [newTaskLastDate, setNewTaskLastDate] = useState('');

  // Recommender State
  const [recMtbf, setRecMtbf] = useState(5000);
  const [recCriticality, setRecCriticality] = useState(2); // 1 Low, 2 Med, 3 High

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

  // Generate Schedule for next 3 months simplified for grid
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
          events.push({
             date: new Date(nextDate),
             taskName: task.name
          });
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

  // Recommendation Logic
  const getRecommendation = () => {
    // Basic rule of thumb: PM interval should be much shorter than failure rate
    // High Criticality: MTBF / 8
    // Med Criticality: MTBF / 6
    // Low Criticality: MTBF / 3
    const factor = recCriticality === 3 ? 8 : recCriticality === 2 ? 6 : 3;
    const intervalHours = recMtbf / factor;
    const intervalDays = Math.round(intervalHours / 24); // Assuming 24h operation
    return { hours: Math.round(intervalHours), days: intervalDays };
  };

  const rec = getRecommendation();

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">PM Scheduler</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create a simple Preventive Maintenance schedule based on fixed time intervals. 
          Add tasks below to generate a forecast.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Task Entry */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Task</h3>
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">
                  Task Name
                  <HelpTooltip text="Description of the maintenance task. Source: OEM Manual." />
                </label>
                <input 
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white text-sm focus:border-cyan-500 outline-none"
                  placeholder="e.g. Inspect Belt"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Interval (Days)
                    <HelpTooltip text="Frequency of the task. Source: OEM recommendation or RCM analysis." />
                  </label>
                  <input 
                    type="number"
                    value={newTaskInterval}
                    onChange={e => setNewTaskInterval(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white text-sm focus:border-cyan-500 outline-none"
                    placeholder="30"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">
                    Last Done
                    <HelpTooltip text="Date the task was last completed. Source: Maintenance records." />
                  </label>
                  <input 
                    type="date"
                    value={newTaskLastDate}
                    onChange={e => setNewTaskLastDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white text-sm focus:border-cyan-500 outline-none"
                    required
                  />
                </div>
              </div>
              <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 rounded transition-colors">
                Add to Plan
              </button>
            </form>
          </div>

          {/* New Interval Optimizer Widget */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
               <Sliders className="w-4 h-4 text-cyan-600" /> Interval Recommender
             </h3>
             <div className="space-y-3">
               <div>
                 <label className="text-xs text-slate-500 mb-1 block">Component MTBF (Hrs)</label>
                 <input 
                   type="number" 
                   value={recMtbf} 
                   onChange={e => setRecMtbf(Number(e.target.value))}
                   className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm"
                 />
               </div>
               <div>
                 <label className="text-xs text-slate-500 mb-1 block">Criticality Risk</label>
                 <select 
                   value={recCriticality} 
                   onChange={e => setRecCriticality(Number(e.target.value))}
                   className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm"
                 >
                   <option value={1}>Low - Run to Failure OK</option>
                   <option value={2}>Medium - Production Impact</option>
                   <option value={3}>High - Safety/Env Impact</option>
                 </select>
               </div>
               <div className="mt-2 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                 <div className="text-xs text-slate-500 uppercase">Suggested PM Interval</div>
                 <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                   {rec.days} Days <span className="text-xs font-normal text-slate-400">({rec.hours} hrs)</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Current Tasks ({tasks.length})</h3>
             <div className="space-y-2 max-h-[300px] overflow-y-auto">
               {tasks.map(task => (
                 <div key={task.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                   <div>
                     <div className="text-sm font-medium text-slate-900 dark:text-white">{task.name}</div>
                     <div className="text-xs text-slate-500">Every {task.intervalDays} days</div>
                   </div>
                   <button onClick={() => removeTask(task.id)} className="text-slate-500 hover:text-red-500">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               ))}
               {tasks.length === 0 && <div className="text-slate-500 text-sm italic">No tasks defined.</div>}
             </div>
          </div>
        </div>

        {/* Calendar/List View */}
        <div className="md:col-span-2">
           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
             <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
               <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> 
                 Upcoming Schedule (Next 3 Months)
               </h3>
               <button 
                 onClick={handleExport}
                 className="flex items-center gap-1 text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded transition-colors"
               >
                 <Download className="w-3 h-3" /> Export CSV
               </button>
             </div>
             
             <div className="flex-grow p-0 overflow-y-auto max-h-[600px]">
               {schedule.length > 0 ? (
                 <div className="divide-y divide-slate-200 dark:divide-slate-700">
                   {schedule.map((event, idx) => (
                     <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center gap-4">
                       <div className="flex-shrink-0 w-16 text-center">
                         <div className="text-xs text-slate-500 uppercase">{event.date.toLocaleString('default', { month: 'short' })}</div>
                         <div className="text-xl font-bold text-slate-900 dark:text-white">{event.date.getDate()}</div>
                       </div>
                       <div className="flex-grow">
                         <div className="font-medium text-slate-800 dark:text-slate-200">{event.taskName}</div>
                         <div className="text-xs text-slate-500">{event.date.toLocaleDateString()}</div>
                       </div>
                       <div className="flex-shrink-0">
                         <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12">
                   <FileText className="w-12 h-12 mb-4 opacity-20" />
                   <p>No upcoming tasks found based on current intervals.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>

      {/* Educational Content */}
      <section className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            About PM Scheduling
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Preventive Maintenance (PM) is time-based maintenance aimed at preventing breakdowns before they occur. This tool helps you generate a forward-looking calendar based on simple fixed intervals (e.g., Monthly, Quarterly).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Why Schedule?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Without a plan, maintenance becomes purely reactive (fighting fires). Scheduling ensures compliance tasks (safety checks) and routine care (lubrication) are not forgotten, extending asset life and reducing unplanned downtime.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            How to use this tool?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            1. Add your critical tasks with their frequency.<br/>
            2. Enter the last date performed.<br/>
            3. The tool automatically projects the due dates for the next 3 months.<br/>
            4. Export the CSV to share with your technician team.
          </p>
        </div>
      </section>

      <RelatedTools currentToolId="pm" />
    </div>
  );
};

export default PmScheduler;
