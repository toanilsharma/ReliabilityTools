import React, { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle, Linkedin, Twitter } from 'lucide-react';

interface ShareResultProps {
    title: string;
    params: Record<string, string | number>;
}

const ShareResult: React.FC<ShareResultProps> = ({ title, params }) => {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.set(key, String(value));
            }
        });
        
        const url = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`;
        setShareUrl(url);
    }, [params]);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const encodedTitle = encodeURIComponent(`Check out my calculated ${title} result on Reliability Tools!`);
    const encodedUrl = encodeURIComponent(shareUrl);

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    return (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                <Share2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Share this result
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-blue-200 dark:border-blue-900/50 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="w-4 h-4" />
                </a>
                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default ShareResult;
