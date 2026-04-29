
import React, { useState } from 'react';
import { GitBranch, Plus, X, Download, HelpCircle, ZoomIn } from 'lucide-react';
import html2canvas from 'html2canvas';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import { Settings, Users, Hammer, Ruler, Waves, Microscope } from 'lucide-react';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


interface Bone {
    category: string;
    causes: string[];
}

const FishboneDiagramGenerator: React.FC = () => {
    const toolRef = useRef<HTMLDivElement>(null);
    const shareUrl = window.location.href;
    const [problem, setProblem] = useState('Motor Vibration High');

    const [bones, setBones] = useState<Bone[]>([
        { category: 'Machine', causes: ['Misalignment', 'Unbalance', 'Bearing Defect'] },
        { category: 'Method', causes: ['No Alignment Procedure', 'Wrong Lubrication Schedule'] },
        { category: 'Material', causes: ['Poor Quality Grease', 'Soft Foot'] },
        { category: 'Man (People)', causes: ['Lack of Training', 'Haste'] },
        { category: 'Measurement', causes: ['Sensor loose', 'Wrong Calibration'] },
        { category: 'Environment', causes: ['High Ambient Temp', 'Dust Ingress'] }
    ]);

    const [newCause, setNewCause] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const addCause = (categoryIndex: number) => {
        if (!newCause.trim()) return;
        const newBones = [...bones];
        newBones[categoryIndex].causes.push(newCause);
        setBones(newBones);
        setNewCause('');
        setActiveCategory(null);
    };

    const removeCause = (catIndex: number, causeIndex: number) => {
        const newBones = [...bones];
        newBones[catIndex].causes.splice(causeIndex, 1);
        setBones(newBones);
    };



  const ToolComponent = (
        <div className="space-y-6" ref={toolRef}>

            {/* Controls */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-grow w-full md:w-auto">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Problem Statement (Head)</label>
                    <input 
                        type="text" 
                        value={problem} 
                        onChange={(e) => setProblem(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Describe the failure..."
                    />
                </div>
                <div className="flex gap-2">
                    <ShareAndExport 
                        toolName="Fishbone Analysis"
                        shareUrl={shareUrl}
                        chartRef={toolRef}
                        resultSummary={problem}
                        exportData={[
                            { Parameter: "Problem Statement", Value: problem },
                            {},
                            { Parameter: "--- CAUSES ---", Value: "" },
                            ...bones.flatMap(b => b.causes.map(c => ({ Parameter: b.category, Value: c })))
                        ]}
                    />
                </div>
            </div>


            {/* Diagram Area */}
            <div className="overflow-x-auto pb-4">
                <div id="fishbone-diagram" className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl min-w-[900px] relative transition-colors">

                    {/* Main Spine */}
                    <div className="absolute top-1/2 left-10 right-40 h-[4px] bg-slate-900 dark:bg-slate-400 z-0"></div>

                    {/* Head */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 w-36 h-24 border-2 border-slate-900 dark:border-slate-400 rounded-xl flex items-center justify-center p-2 bg-white dark:bg-slate-900 z-10 shadow-sm">
                        <span className="font-extrabold text-center text-sm text-slate-900 dark:text-white line-clamp-3">{problem}</span>
                    </div>

                    {/* Ribs Container */}
                    <div className="grid grid-cols-3 gap-y-32 gap-x-8 relative z-10 py-12">
                        {bones.map((bone, idx) => (
                            <div key={idx} className={`relative flex flex-col ${idx < 3 ? 'items-end' : 'items-end'}`}>

                                {/* The Rib Line */}
                                <div className={`absolute border-l-2 border-slate-400 h-24 ${idx < 3 ? 'bottom-[-48px] rotate-[-60deg] origin-bottom-right right-1/2' : 'top-[-48px] rotate-[60deg] origin-top-right right-1/2'}`}></div>

                                {/* Category Box */}
                                <div className="mb-2 relative z-20">
                                    <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-3 py-1 rounded font-bold text-sm border border-cyan-200 dark:border-cyan-800">
                                        {bone.category}
                                    </span>
                                </div>

                                {/* Causes List */}
                                <div className="space-y-1 text-right pr-4">
                                    {bone.causes.map((cause, cIdx) => (
                                        <div key={cIdx} className="group relative pr-6">
                                            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm border border-slate-100 dark:border-slate-700 inline-block max-w-[150px] truncate">
                                                {cause}
                                            </div>
                                            {/* Connector from cause to rib */}
                                            <div className="absolute right-0 top-1/2 w-6 h-[1px] bg-slate-300"></div>

                                            <button
                                                onClick={() => removeCause(idx, cIdx)}
                                                className="absolute -left-4 top-0 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Cause Input */}
                                    <div className="relative mt-2">
                                        {activeCategory === bone.category ? (
                                            <div className="flex gap-1 items-center justify-end">
                                                <input
                                                    autoFocus
                                                    value={newCause}
                                                    onChange={e => setNewCause(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addCause(idx)}
                                                    className="w-24 text-xs p-1 border rounded outline-none dark:bg-slate-700 dark:text-white"
                                                    placeholder="Add..."
                                                />
                                                <button onClick={() => addCause(idx)} className="text-green-500"><Plus className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setActiveCategory(bone.category)}
                                                className="text-xs text-cyan-600 hover:underline flex items-center justify-end gap-1 w-full"
                                            >
                                                <Plus className="w-3 h-3" /> Add Cause
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    </div>
);

  const Content = (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Visualizing Root Causality</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The Ishikawa (Fishbone) diagram is the premier tool for brainstorming failure modes. It forces a 360-degree view of an event, preventing the "tunnel vision" that often plagues initial RCA sessions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryBlock 
          title="The 6Ms Framework"
          icon={<Settings className="w-5 h-5" />}
          delay={0.1}
        >
          <ul className="space-y-2 mt-2 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Machine:</strong> Equipment flaws, wear, or design defects.</li>
            <li><strong>Method:</strong> Flaws in operating procedures or PM schedules.</li>
            <li><strong>Material:</strong> Poor raw material quality or incorrect parts.</li>
            <li><strong>Man (People):</strong> Skill gaps, fatigue, or communication errors.</li>
            <li><strong>Measurement:</strong> Sensor drift, miscalibration, or bad data.</li>
            <li><strong>Mother Nature:</strong> Heat, dust, vibration, and humidity.</li>
          </ul>
        </TheoryBlock>

        <TheoryBlock 
          title="From Effect to Cause"
          icon={<Microscope className="w-5 h-5" />}
          delay={0.2}
        >
          <p>
            The "Head" represents the Effect (the problem statement). The "Bones" represent the Categories. To find the root, ask "Why?" for each cause until you reach a point where a corrective action can be taken.
          </p>
        </TheoryBlock>
      </div>
    </div>
  );

    const faqs = [
        {
            question: "When should I use this?",
            answer: "Use this during brainstorming sessions <em>after</em> a failure has occurred (Corrective Maintenance) but <em>before</em> jumping to conclusions. It prevents 'Tunnel Vision' by forcing you to look at all possible categories."
        },
        {
            question: "What comes next?",
            answer: "After populating the Fishbone, use the <strong>5 Whys</strong> technique on the most likely causes to drill down to the true Root Cause."
        }
    ];

    return (
        <ToolContentLayout
            title="Fishbone Diagram Generator"
            description="Create interactive Ishikawa (Cause-and-Effect) diagrams for Root Cause Analysis. brainstorm failure causes using the standardized 6M framework."
            toolComponent={ToolComponent}
            content={Content}
            faqs={faqs}
            schema={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Fishbone Diagram Generator",
                "applicationCategory": "ProductivityApplication"
            }}
        />
    );
};

export default FishboneDiagramGenerator;
