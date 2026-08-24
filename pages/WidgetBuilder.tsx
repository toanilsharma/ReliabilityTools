import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Code, Copy, Check, ExternalLink, Sparkles, Sliders, Layout, Eye } from 'lucide-react';
import SEO from '../components/SEO';
import { BASE_URL } from '../utils/seoConfig';

interface WidgetOption {
  id: string;
  name: string;
  category: string;
  defaultHeight: number;
}

const WIDGET_OPTIONS: WidgetOption[] = [
  { id: 'mtbf', name: 'MTBF / MTTF Calculator', category: 'Reliability', defaultHeight: 650 },
  { id: 'mttr', name: 'MTTR Calculator', category: 'Maintenance', defaultHeight: 650 },
  { id: 'oee', name: 'OEE Calculator', category: 'Manufacturing', defaultHeight: 700 },
  { id: 'weibull', name: 'Weibull Analysis Tool', category: 'Data Analysis', defaultHeight: 750 },
  { id: 'fmea', name: 'FMEA RPN Calculator', category: 'Risk Management', defaultHeight: 700 },
  { id: 'downtime-cost', name: 'Downtime Cost Calculator', category: 'Financial', defaultHeight: 650 },
  { id: 'bearing-life', name: 'L10 Bearing Life Calculator', category: 'Component Life', defaultHeight: 680 }
];

const WidgetBuilder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialToolParam = searchParams.get('tool') || 'mtbf';

  const initialWidget = WIDGET_OPTIONS.find(w => w.id === initialToolParam) || WIDGET_OPTIONS[0];

  const [selectedWidget, setSelectedWidget] = useState<WidgetOption>(initialWidget);
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<number>(initialWidget.defaultHeight);
  const [copied, setCopied] = useState(false);

  const embedUrl = `${BASE_URL}/embed/${selectedWidget.id}`;
  const iframeSnippet = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;" title="${selectedWidget.name} Widget"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToolSelect = (widget: WidgetOption) => {
    setSelectedWidget(widget);
    setHeight(widget.defaultHeight);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <SEO
        title="Embeddable Calculator Widget Builder | Reliability Tools"
        description="Customize and generate clean <iframe> embed codes for Reliability Tools calculators."
        noIndex={true}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-3">
          <Code className="w-4 h-4" /> Embeddable Widget Generator
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-3">
          Embed Reliability Calculators On Your Site
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto">
          Free embeddable widgets for blogs, university portals, engineering forums, and LMS platforms. Customize dimensions below and copy the snippet.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-500" /> Widget Options
            </h2>

            {/* Select Tool */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Calculator Tool
              </label>
              <div className="space-y-2">
                {WIDGET_OPTIONS.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => handleToolSelect(widget)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-bold flex items-center justify-between ${
                      selectedWidget.id === widget.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    <span>{widget.name}</span>
                    <span className="text-[10px] opacity-75">{widget.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Widget Width (CSS Value)
                </label>
                <input
                  type="text"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  placeholder="100% or 600px"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Widget Height (pixels)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  placeholder="650"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Generated Snippet */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                HTML Embed Code
              </label>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl text-xs font-mono break-all border border-slate-800 max-h-36 overflow-y-auto">
                <code>{iframeSnippet}</code>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied HTML Snippet!' : 'Copy <iframe> Embed Code'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <Eye className="w-4 h-4 text-cyan-500" /> Live Interactive Preview
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-500 hover:underline flex items-center gap-1"
            >
              Open Direct Embed URL <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-950 p-3 sm:p-4 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <iframe
              src={embedUrl}
              width={width}
              height={`${height}px`}
              style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}
              title={`${selectedWidget.name} Live Preview`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
