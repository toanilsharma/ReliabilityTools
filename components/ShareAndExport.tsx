import React, { useState } from 'react';
import { 
  Share2, 
  Download, 
  FileText, // For CSV
  FileImage, // For Image
  Printer, // For PDF/Print
  Copy, 
  Check,
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle // WhatsApp
} from 'lucide-react';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

interface ShareAndExportProps {
  toolName: string;
  shareUrl: string;
  exportData?: Record<string, any>[]; // Data for CSV export
  chartRef?: React.RefObject<HTMLElement>; // Ref to the element to capture as image
  resultSummary?: string; // Text summary to share on social
}

const ShareAndExport: React.FC<ShareAndExportProps> = ({ 
  toolName, 
  shareUrl, 
  exportData, 
  chartRef,
  resultSummary = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Default share text for social platforms
  const shareText = resultSummary 
    ? `Calculated ${toolName} result: ${resultSummary} via ReliabilityTools.co.in`
    : `Check out this free ${toolName} tool on ReliabilityTools.co.in`;

  // --- Actions ---

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy check permissions:', err);
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateImage = async () => {
    if (!chartRef?.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // High resolution
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        logging: false,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${toolName.replace(/\s+/g, '-')}-Result-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = () => {
    if (!exportData || exportData.length === 0) return;
    try {
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${toolName.replace(/\s+/g, '-')}-Data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export CSV data.');
    }
  };

  const handlePrint = () => {
    // We rely on CSS @media print styles to format the page correctly for printing (which includes Save as PDF)
    window.print();
  };

  // --- Render ---

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mt-8 no-print transition-colors">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Share & Export Results
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Share Section */}
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Unique Shareable Link</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={shareUrl}
              className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono overflow-ellipsis"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button 
              onClick={copyToClipboard}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2"
              title="Copy link to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2 pt-2">
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800" title="Share on WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800" title="Share on LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors border border-transparent hover:border-sky-200 dark:hover:border-sky-800" title="Share on Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800" title="Share on Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium md:border-l border-slate-200 dark:border-slate-700 md:pl-6">Download & Export</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:pl-6">
            
            <button 
              onClick={handlePrint}
              className="flex flex-col items-center justify-center p-3 gap-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group text-slate-700 dark:text-slate-300"
              title="Print or Save as PDF"
            >
              <Printer className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
              <span className="text-xs font-semibold">PDF / Print</span>
            </button>
            
            {exportData && exportData.length > 0 && (
              <button 
                onClick={exportCSV}
                className="flex flex-col items-center justify-center p-3 gap-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group text-slate-700 dark:text-slate-300"
                title="Download CSV for Excel"
              >
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-xs font-semibold">Data (CSV)</span>
              </button>
            )}

            {chartRef && (
              <button 
                onClick={generateImage}
                disabled={isExporting}
                className="flex flex-col items-center justify-center p-3 gap-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export high-res image of results"
              >
                <FileImage className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-semibold">{isExporting ? 'Exporting...' : 'Image (PNG)'}</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAndExport;
