
import React, { useState } from 'react';
import { GitBranch, Plus, X, Download, HelpCircle, ZoomIn } from 'lucide-react';
import html2canvas from 'html2canvas';
import ToolContentLayout from '../../components/ToolContentLayout';

interface Bone {
    category: string;
    causes: string[];
}

const FishboneDiagramGenerator: React.FC = () => {
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

    const exportImage = async () => {
        const element = document.getElementById('fishbone-diagram');
        if (element) {
            // Temporarily remove shadow and border for clean export
            const originalStyle = element.className;
            element.className = "bg-white p-8 min-w-[800px]";

            const canvas = await html2canvas(element);
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = 'fishbone-rca.png';
            link.click();

            // Restore style
            element.className = originalStyle;
        }
    };

    const ToolComponent = (
        <div className="space-y-6">
            {/* Controls */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-grow w-full md:w-auto">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Problem Statement (Head)</label>
                    <input
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-slate-900 dark:text-white"
                        placeholder="Describe the failure..."
                    />
                </div>
                <button
                    onClick={exportImage}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg"
                >
                    <Download className="w-4 h-4" /> Export PNG
                </button>
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
        <div>
            <h2 id="overview">What is a Fishbone Diagram?</h2>
            <p>
                Also known as the <strong>Ishikawa Diagram</strong> or Cause-and-Effect Diagram, this tool is fundamental for <strong>Root Cause Analysis (RCA)</strong>. It helps categorize likely causes of problems to identify the root cause systematically.
            </p>

            <h2 id="6m">The 6Ms Framework</h2>
            <p>
                The standard categories for manufacturing RCA are:
            </p>
            <ul>
                <li><strong>Machine:</strong> Failures in equipment, tools, or facilities.</li>
                <li><strong>Method:</strong> Flaws in processes, procedures, or rules.</li>
                <li><strong>Material:</strong> Defects in raw materials or parts.</li>
                <li><strong>Man (People):</strong> Human error, lack of training, or fatigue.</li>
                <li><strong>Measurement:</strong> Errors in data, calibration, or inspection.</li>
                <li><strong>Mother Nature (Environment):</strong> Heat, humidity, vibration, or dust.</li>
            </ul>
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
