
import React, { useState } from 'react';
import { CheckSquare, Shield, AlertTriangle, FileText, ClipboardCheck, ThumbsUp } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';

const SystemReliabilityValidator: React.FC = () => {
    const [checklist, setChecklist] = useState([
        { id: 1, category: 'Requirements', text: 'Are Reliability & Availability targets quantitatively defined (e.g., 99.9% Up-time)?', checked: false },
        { id: 2, category: 'Requirements', text: 'Is the environmental profile (Temp, Vibration, Humidity) defined for all mission phases?', checked: false },
        { id: 3, category: 'Design', text: 'Have Single Points of Failure (SPOF) been eliminated or mitigated?', checked: false },
        { id: 4, category: 'Design', text: 'has de-rating been applied to electronic components (e.g., operating at 50% rated power)?', checked: false },
        { id: 5, category: 'Analysis', text: 'Is a Failure Modes Effects Analysis (FMEA) complete for key subsystems?', checked: false },
        { id: 6, category: 'Analysis', text: 'Has spare parts accessibility been considered (Maintainability)?', checked: false },
        { id: 7, category: 'Testing', text: 'Is there a HALT/HASS test plan to precipitate early failures?', checked: false },
        { id: 8, category: 'Software', text: 'Are software failure modes (deadlocks, race conditions) included in the analysis?', checked: false }
    ]);

    const toggleCheck = (id: number) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const progress = Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100);

    const ToolComponent = (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-cyan-600" /> Design Validation Checklist
                    </h3>
                    <div className="space-y-3">
                        {checklist.map(item => (
                            <div key={item.id}
                                onClick={() => toggleCheck(item.id)}
                                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${item.checked ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700'}`}
                            >
                                <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border transition-colors ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>
                                    {item.checked && <CheckSquare className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">{item.category}</div>
                                    <div className={`text-sm font-medium ${item.checked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {item.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center sticky top-24">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Readiness</div>
                    <div className={`text-6xl font-black mb-4 ${progress === 100 ? 'text-green-500' : progress >= 75 ? 'text-cyan-500' : 'text-slate-400'}`}>
                        {progress}%
                    </div>

                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden mb-6">
                        <div className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-cyan-500'}`} style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className={`p-4 rounded-lg text-sm transition-colors ${progress === 100 ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-slate-50 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400'}`}>
                        {progress === 100 ? (
                            <div className="flex flex-col items-center">
                                <ThumbsUp className="w-8 h-8 mb-2" />
                                <strong>Design Validated!</strong>
                                <p className="mt-1 text-xs">Ready for Peer Review.</p>
                            </div>
                        ) : (
                            <p>Complete all items to validate the reliability design assurance case.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const Content = (
        <div>
            <h2 id="overview">What is Reliability Validation?</h2>
            <p>
                System Reliability Validation is not just testing; it's a process of ensuring that reliability is engineered into the product from Day 1. This checklist is inspired by the <strong>NASA Reliability Design Handbook</strong>.
            </p>

            <h2 id="derating">Importance of Derating</h2>
            <p>
                <strong>Derating</strong> is the practice of operating a component at less than its rated maximum limit (e.g., using a 50V capacitor in a 25V circuit). This significantly reduces stress and increases life expectancy (Arrhenius Law).
            </p>

            <h2 id="spof">No Single Points of Failure</h2>
            <p>
                A <strong>Single Point of Failure (SPOF)</strong> is a part of a system that, if it fails, will stop the entire system from working. Good design eliminates SPOFs through redundancy or effectively designs them out.
            </p>
        </div>
    );

    const faqs = [
        {
            question: "Can I customize this checklist?",
            answer: "This tool provides a standard baseline. In a real-world scenario, you would export this and add specific requirements from your Product Requirements Document (PRD)."
        },
        {
            question: "What is HALT?",
            answer: "<strong>Highly Accelerated Life Testing (HALT)</strong> is a stress test used during design to find weak links. It forces failures by applying extreme vibration and temperature changes, allowing you to fix design flaws before production."
        }
    ];

    return (
        <ToolContentLayout
            title="System Reliability Validator"
            description="Validate your system design against core reliability engineering principles. A checklist for Design for Reliability (DfR), Environmental Profiling, and Failure Analysis."
            toolComponent={ToolComponent}
            content={Content}
            faqs={faqs}
            schema={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "System Reliability Validator",
                "applicationCategory": "ProductivityApplication"
            }}
        />
    );
};

export default SystemReliabilityValidator;
