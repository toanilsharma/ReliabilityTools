import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  FileText,
  FileSpreadsheet,
  FileImage,
  Copy, 
  Check,
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle,
  Eye,
  Download,
  X,
  ExternalLink
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { generateProfessionalPDF, PDFReportData } from '../utils/PDFService';
import { 
  renderShareCard, 
  generateShareCardDataUrl, 
  generateShareCardBlob, 
  downloadShareCard 
} from '../utils/shareCardGenerator';
import { trackResultShared, trackReportDownloaded } from '../utils/analytics';
import { getToolKnowledge } from '../utils/toolKnowledgeRegistry';

export interface ShareAndExportProps {
  toolName?: string;
  toolTitle?: string;
  shareUrl?: string;
  exportData?: Record<string, any>[]; // Data for CSV export
  chartRef?: React.RefObject<HTMLElement>; // Ref to the element to capture as image
  resultSummary?: string; // Text summary to share on social
  inputs?: Record<string, string | number>;
  results?: Record<string, string | number>;
  pdfData?: {
    inputs: Record<string, string | number>;
    results: Record<string, string | number>;
    formula?: string;
    interpretation?: string;
  };
}

const ShareAndExport: React.FC<ShareAndExportProps> = ({ 
  toolName: toolNameProp, 
  toolTitle,
  shareUrl: customShareUrl, 
  exportData, 
  chartRef,
  resultSummary = '',
  inputs: directInputs,
  results: directResults,
  pdfData
}) => {
  const toolName = toolNameProp || toolTitle || 'Reliability Engineering Calculator';
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCardUrl, setPreviewCardUrl] = useState<string | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);

  // Determine current active URL and clean canonical URL (stripped of query parameters)
  const currentUrl = customShareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://reliabilitytools.co.in');
  const canonicalUrl = currentUrl.split('?')[0].split('#')[0];

  // Resolves structured inputs & results even if tool only provided exportData or resultSummary
  const resolvedData = React.useMemo(() => {
    if (pdfData && pdfData.results && Object.keys(pdfData.results).length > 0) {
      return {
        inputs: pdfData.inputs || {},
        results: pdfData.results,
        formula: pdfData.formula,
        interpretation: pdfData.interpretation
      };
    }

    if (directResults && Object.keys(directResults).length > 0) {
      return {
        inputs: directInputs || {},
        results: directResults,
        formula: undefined,
        interpretation: undefined
      };
    }

    // Attempt smart parsing from exportData if available
    if (exportData && exportData.length > 0) {
      const inputs: Record<string, string | number> = {};
      const results: Record<string, string | number> = {};
      let isResultPhase = false;

      exportData.forEach((row) => {
        const param = row.Parameter || row.parameter || row.Metric || row.metric || row.Label || row.label;
        const val = row.Value !== undefined ? row.Value : (row.value !== undefined ? row.value : '');
        if (!param && !val) return;

        if (typeof param === 'string' && (param.includes('---') || param.toLowerCase().includes('result'))) {
          isResultPhase = true;
          return;
        }

        if (isResultPhase) {
          if (param) results[param] = val;
        } else {
          if (param) inputs[param] = val;
        }
      });

      if (Object.keys(results).length > 0) {
        return { inputs, results };
      }
    }

    // Default fallback
    const knowledge = getToolKnowledge(toolName);
    return {
      inputs: { 'Operating Assessment': toolName },
      results: {
        [knowledge.keyMetricName]: resultSummary || 'Calculation Complete',
        'Status': 'Verified Engineering Model'
      }
    };
  }, [pdfData, directInputs, directResults, exportData, toolName, resultSummary]);

  // Construct text for WhatsApp (wa.me) & social channels using canonical URL (Rule 3)
  const formattedResultsText = Object.entries(resolvedData.results)
    .slice(0, 3)
    .map(([k, v]) => `• ${k}: *${v}*`)
    .join('\n');

  const waMessage = `🛠️ *${toolName} Analysis Results*\n` +
    (formattedResultsText ? `${formattedResultsText}\n\n` : (resultSummary ? `📊 Result: *${resultSummary}*\n\n` : '')) +
    `👉 View calculation & report: ${canonicalUrl}\n` +
    `Calculated on ReliabilityTools.co.in`;

  // WhatsApp & LinkedIn MUST always share canonical URLs, never parameterized result URLs
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Calculated ${toolName} results on @ReliabilityTools:`)}&url=${encodeURIComponent(canonicalUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;

  // --- Actions ---

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      trackResultShared('copy_link', toolName);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      trackResultShared('copy_link', toolName);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const knowledge = getToolKnowledge(toolName);
      const pdfPayload: PDFReportData = {
        toolName,
        inputs: resolvedData.inputs,
        results: resolvedData.results,
        formula: resolvedData.formula || knowledge.formula,
        interpretation: resolvedData.interpretation || knowledge.interpretation,
        url: currentUrl,
        chartRef
      };

      await generateProfessionalPDF(pdfPayload);
      trackReportDownloaded(toolName);
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      alert('PDF generation encountered an error. Falling back to browser print.');
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadShareCard = async () => {
    setIsGeneratingCard(true);
    try {
      await downloadShareCard({
        toolName,
        results: resolvedData.results,
        inputs: resolvedData.inputs,
        url: currentUrl,
        category: 'INDUSTRIAL RELIABILITY CALCULATOR'
      });
      trackResultShared('download_card', toolName);
    } catch (error) {
      console.error('Failed to download share card:', error);
      alert('Failed to generate share card.');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleOpenPreview = async () => {
    setIsGeneratingCard(true);
    try {
      const dataUrl = await generateShareCardDataUrl({
        toolName,
        results: resolvedData.results,
        inputs: resolvedData.inputs,
        url: currentUrl,
        category: 'INDUSTRIAL RELIABILITY CALCULATOR'
      });
      setPreviewCardUrl(dataUrl);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error('Failed to render share card preview:', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleCopyCardImage = async () => {
    if (!previewCardUrl) return;
    try {
      const blob = await generateShareCardBlob({
        toolName,
        results: resolvedData.results,
        inputs: resolvedData.inputs,
        url: currentUrl
      });
      
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      } else {
        alert('Image copying not supported in this browser. Please use Download instead.');
      }
    } catch (err) {
      console.error('Failed to copy card image to clipboard:', err);
    }
  };

  const generateChartImage = async () => {
    if (!chartRef?.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current as HTMLElement, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        logging: false,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${toolName.replace(/\s+/g, '-')}-Chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      trackResultShared('download_chart', toolName);
    } catch (error) {
      console.error('Failed to generate chart image:', error);
      alert('Failed to generate chart image. Please try again.');
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

  // Open Graph description summary
  const ogDescription = resultSummary 
    ? `Calculated ${toolName} results: ${resultSummary}. Verify calculations on ReliabilityTools.co.in.`
    : `Explore ${toolName} calculations and industrial reliability models on ReliabilityTools.co.in.`;

  return (
    <>
      {/* Dynamic Open Graph Meta Tags for Result States */}
      <Helmet>
        <meta property="og:title" content={`${toolName} Calculation Results | Reliability Tools`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={`${toolName} Results | Reliability Tools`} />
        <meta name="twitter:description" content={ogDescription} />
      </Helmet>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mt-8 no-print transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-xl border border-cyan-200 dark:border-cyan-800/50">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Share & Report Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate branded PDF reports, share verified results, and export data.
              </p>
            </div>
          </div>

          {/* Quick 1200x630 Card Preview Button */}
          <button
            onClick={handleOpenPreview}
            disabled={isGeneratingCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-600"
            title="Preview 1200×630 Open Graph share card"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isGeneratingCard ? 'Rendering...' : 'Preview 1200×630 Card'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Share Menu Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Direct Share Link
              </span>
              <span className="text-[10px] text-slate-400">Includes calculation parameters</span>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={currentUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono overflow-ellipsis"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-sm hover:shadow-cyan-500/20 flex items-center gap-1.5 text-xs font-bold flex-shrink-0"
                title="Copy link to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Social Share Menu */}
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Share With Colleagues & Team
              </span>
              <div className="flex flex-wrap gap-2">
                {/* WhatsApp (wa.me link with prefilled text + URL) */}
                <a 
                  href={waShareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackResultShared('whatsapp', toolName)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="Share on WhatsApp with prefilled results and link"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href={linkedInShareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackResultShared('linkedin', toolName)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>LinkedIn</span>
                </a>

                {/* Twitter / X */}
                <a 
                  href={twitterShareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackResultShared('twitter', toolName)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="Share on Twitter / X"
                >
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <span>Twitter / X</span>
                </a>

                {/* Facebook */}
                <a 
                  href={facebookShareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackResultShared('facebook', toolName)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Download & Export Section */}
          <div className="space-y-4 md:border-l border-slate-200 dark:border-slate-700/60 md:pl-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Official Engineering Downloads
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Branded PDF Report Button */}
              <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/40 hover:border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-slate-900 text-slate-900 dark:text-white transition-all group shadow-sm hover:shadow-cyan-500/10 disabled:opacity-50 text-left"
                title="Download comprehensive PDF calculation report with logo, formulas, and recommendations"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-600 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                    <FileText className={`w-5 h-5 ${isGeneratingPDF ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-tight">
                      {isGeneratingPDF ? 'Generating Branded PDF...' : 'Download PDF Report'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Branded PDF with formula, inputs & engineering interpretation
                    </div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
              </button>

              {/* 1200x630 Share Card PNG Button */}
              <button 
                onClick={handleDownloadShareCard}
                disabled={isGeneratingCard}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-slate-700 dark:text-slate-200 text-xs font-bold group"
                title="Download 1200×630 share card PNG"
              >
                <FileImage className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div>Share Card (PNG)</div>
                  <div className="text-[10px] text-slate-400 font-normal">1200×630 Card</div>
                </div>
              </button>

              {/* CSV / Excel Export */}
              {exportData && exportData.length > 0 ? (
                <button 
                  onClick={exportCSV}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-slate-700 dark:text-slate-200 text-xs font-bold group"
                  title="Download calculation data as CSV for Excel"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div>Excel / CSV</div>
                    <div className="text-[10px] text-slate-400 font-normal">Raw tabular data</div>
                  </div>
                </button>
              ) : chartRef ? (
                <button 
                  onClick={generateChartImage}
                  disabled={isExporting}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-slate-700 dark:text-slate-200 text-xs font-bold group"
                  title="Export high-resolution chart diagram"
                >
                  <FileImage className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div>Chart Image</div>
                    <div className="text-[10px] text-slate-400 font-normal">High-res PNG</div>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 1200x630 Share Card Preview Modal */}
      {isPreviewOpen && previewCardUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-4xl w-full shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-cyan-400" /> 1200×630 Social Share Card
                </h4>
                <p className="text-xs text-slate-400">
                  Standard Open Graph & Twitter Summary Large Card format (1200 × 630 px)
                </p>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Preview Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
              <img 
                src={previewCardUrl} 
                alt={`${toolName} 1200x630 Share Card`} 
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                Ready for LinkedIn, X (Twitter), Slack, and WhatsApp previews.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyCardImage}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedImage ? 'Copied Image!' : 'Copy Image'}</span>
                </button>
                <button
                  onClick={handleDownloadShareCard}
                  className="flex-1 sm:flex-none px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG (1200×630)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareAndExport;
