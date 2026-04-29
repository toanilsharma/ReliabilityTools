
import React, { useState } from 'react';
import { CheckSquare, Shield, AlertTriangle, FileText, ClipboardCheck, ThumbsUp, Scale, ZapOff } from 'lucide-react';
import ToolContentLayout from '../../components/ToolContentLayout';
import TheoryBlock from '../../components/TheoryBlock';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../context/ThemeContext';
import ShareAndExport from '../../components/ShareAndExport';
import { useRef } from 'react';


const SystemReliabilityValidator: React.FC = () => {
    const toolRef = useRef<HTMLDivElement>(null);
    const shareUrl = window.location.href;
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

    const { theme } = useTheme();

    const categoryScores = React.useMemo(() => {
        const categories = [...new Set(checklist.map(i => i.category))];
        return categories.map(cat => {
            const items = checklist.filter(i => i.category === cat);
            const score = Math.round((items.filter(i => i.checked).length / items.length) * 100);
            return { category: cat, score };
        });
    }, [checklist]);

    const ToolComponent = (
        <div className="grid lg:grid-cols-3 gap-8" ref={toolRef}>

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

                    <div className="mt-6 h-56">
                        <ReactECharts
                            option={{
                                animation: false,
                                radar: {
                                    indicator: categoryScores.map(c => ({ name: c.category, max: 100 })),
                                    shape: 'polygon',
                                    splitArea: { areaStyle: { color: theme === 'dark' ? ['rgba(6, 182, 212, 0.05)', 'rgba(6, 182, 212, 0.02)'] : ['rgba(6, 182, 212, 0.08)', 'rgba(6, 182, 212, 0.02)'] } },
                                    axisName: { color: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 },
                                    splitLine: { lineStyle: { color: theme === 'dark' ? '#334155' : '#e2e8f0' } },
                                    axisLine: { lineStyle: { color: theme === 'dark' ? '#334155' : '#e2e8f0' } }
                                },
                                series: [{
                                    type: 'radar',
                                    data: [{
                                        value: categoryScores.map(c => c.score),
                                        itemStyle: { color: '#06b6d4' },
                                        areaStyle: { color: 'rgba(6, 182, 212, 0.2)' },
                                        lineStyle: { width: 2 }
                                    }]
                                }]
                            }}
                            style={{ height: '100%', width: '100%' }}
                            opts={{ renderer: 'svg' }}
                        />
                    </div>
                    <div className="mt-4">
                        <ShareAndExport
                            toolName="System Reliability Validation"
                            shareUrl={shareUrl}
                            chartRef={toolRef}
                            resultSummary={`${progress}% Readiness`}
                            exportData={[
                                { Parameter: "Overall Readiness", Value: progress + "%" },
                                {},
                                { Parameter: "--- CHECKLIST STATUS ---", Value: "" },
                                ...checklist.map(item => ({ Parameter: item.text, Value: item.checked ? "YES" : "NO" }))
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const Content = (
        <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center mb-10">
                <h2 id="overview" className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Design for Reliability (DfR)</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">System Reliability Validation is not just testing; it's a proactive engineering process of ensuring that reliability is engineered into the product from Day 1.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <TheoryBlock
                    title="Component Derating"
                    icon={<Scale className="w-5 h-5" />}
                    delay={0.1}
                >
                    <p>
                        <strong>Derating</strong> is the practice of operating a component at significantly less than its rated maximum limit (e.g., using a 50V capacitor in a 12V circuit).
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Per the Arrhenius Equation, reducing thermal and electrical stress exponentially increases the life expectancy of electronic components.
                    </p>
                </TheoryBlock>

                <TheoryBlock
                    title="Single Point of Failure (SPOF)"
                    icon={<ZapOff className="w-5 h-5" />}
                    delay={0.2}
                >
                    <p>
                        A <strong>Single Point of Failure (SPOF)</strong> is a node in a system architecture that, if it fails, will halt the entire system from working.
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        A robust reliability design explicitly identifies and eliminates SPOFs through redundant pathways, fail-safe mechanisms, or structural reinforcement.
                    </p>
                </TheoryBlock>
            </div>
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
