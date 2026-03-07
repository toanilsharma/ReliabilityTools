import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';

const MobileCTA: React.FC = () => {
    const location = useLocation();

    // Hide if already on a tool page, embed page, or inside the learning center.
    const isToolPage = location.pathname.includes('/tools') || 
                       location.pathname === '/mtbf-calculator' || 
                       location.pathname === '/weibull-analysis' || 
                       location.pathname === '/fmea-tool' || 
                       location.pathname === '/oee-calculator' ||
                       location.pathname.startsWith('/embed') ||
                       location.pathname.startsWith('/learning');

    if (isToolPage) {
        return null;
    }

    return (
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent pb-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <Link
                to="/mtbf-calculator"
                className="w-full h-[54px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
            >
                <div className="bg-white/20 p-1.5 rounded-md">
                    <Play className="w-4 h-4 fill-current" />
                </div>
                Open Free MTBF Calculator &rarr;
            </Link>
        </div>
    );
};

export default MobileCTA;
