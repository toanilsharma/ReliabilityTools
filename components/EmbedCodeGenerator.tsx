import React, { useState } from 'react';
import { Code, CheckCircle, Copy } from 'lucide-react';

interface EmbedCodeGeneratorProps {
    toolId: string;
    title: string;
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({ toolId, title }) => {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const embedCode = `<iframe 
    src="${window.location.origin}/#/embed/${toolId}" 
    width="100%" 
    height="600" 
    style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" 
    title="${title} Calculator"
></iframe>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-6 rounded-full transition-colors text-sm border border-slate-200 dark:border-slate-700"
            >
                <Code className="w-4 h-4" /> Embed this calculator
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            ✕
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Embed {title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Copy the code below to embed this interactive calculator directly on your website, blog, or intranet.
                        </p>

                        <div className="relative group">
                            <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-sm font-mono text-slate-800 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                                {embedCode}
                            </pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmbedCodeGenerator;
