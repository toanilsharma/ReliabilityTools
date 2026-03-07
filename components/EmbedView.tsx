import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

// Import tools directly for the embed view to bypass Layout
const MtbfCalculator = React.lazy(() => import('../pages/Tools/MtbfCalculator'));
const WeibullAnalysis = React.lazy(() => import('../pages/Tools/WeibullAnalysis'));
const FmeaCalculator = React.lazy(() => import('../pages/Tools/FmeaCalculator'));
const OeeCalculator = React.lazy(() => import('../pages/Tools/OeeCalculator'));

const TOOL_MAP: Record<string, React.LazyExoticComponent<any>> = {
    'mtbf-calculator': MtbfCalculator,
    'weibull-analysis': WeibullAnalysis,
    'fmea-tool': FmeaCalculator,
    'oee-calculator': OeeCalculator,
};

const EmbedView: React.FC = () => {
    const { toolId } = useParams<{ toolId: string }>();

    const ToolComponent = toolId ? TOOL_MAP[toolId] : null;

    if (!ToolComponent) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-500">
                Calculator not found or not available for embedding.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-6 p-embed">
            <style>{`
                /* Hide the surrounding layout elements when embedded *\/
                .p-embed header, .p-embed footer, .p-embed .prose, .p-embed h1, .p-embed p.text-lg, .p-embed #overview, .p-embed #how-to, .p-embed section {
                    display: none !important;
                }
                /* Only show the tool container *\/
                .p-embed #tool-container {
                    margin-bottom: 0 !important;
                }
                /* Hide the embed button inside the embed *\/
                .p-embed button:has(.lucide-code) {
                    display: none !important;
                }
            `}</style>
            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="p-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-20 dark:opacity-40"></div>
                
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="font-bold text-slate-700 dark:text-slate-200">
                        ReliabilityTools.co.in
                    </div>
                    <a href={`https://reliabilitytools.co.in/#/${toolId}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-600 hover:text-cyan-500 transition-colors bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 px-3 py-1.5 rounded-full">
                        View Full Readout &rarr;
                    </a>
                </div>

                <div className="p-0">
                    <Suspense fallback={<div className="p-8"><Loading /></div>}>
                        <ToolComponent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default EmbedView;
