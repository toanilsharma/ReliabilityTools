import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import SEO from './SEO';
import { ExternalLink, Sparkles } from 'lucide-react';
import { BASE_URL } from '../utils/seoConfig';

// Import tool components directly for embed view
const MtbfCalculator = React.lazy(() => import('../pages/Tools/MtbfCalculator'));
const MttrCalculator = React.lazy(() => import('../pages/Tools/MttrCalculator'));
const OeeCalculator = React.lazy(() => import('../pages/Tools/OeeCalculator'));
const WeibullAnalysis = React.lazy(() => import('../pages/Tools/WeibullAnalysis'));
const FmeaCalculator = React.lazy(() => import('../pages/Tools/FmeaCalculator'));
const DowntimeCostCalculator = React.lazy(() => import('../pages/Tools/DowntimeCostCalculator'));
const BearingLifeCalculator = React.lazy(() => import('../pages/Tools/BearingLifeCalculator'));

interface ToolEmbedInfo {
  component: React.LazyExoticComponent<any>;
  name: string;
  canonicalPath: string;
}

const TOOL_EMBED_MAP: Record<string, ToolEmbedInfo> = {
  'mtbf': { component: MtbfCalculator, name: 'MTBF / MTTF Calculator', canonicalPath: '/tools/mtbf/' },
  'mtbf-calculator': { component: MtbfCalculator, name: 'MTBF / MTTF Calculator', canonicalPath: '/tools/mtbf/' },
  'mttr': { component: MttrCalculator, name: 'MTTR Calculator', canonicalPath: '/tools/mttr/' },
  'mttr-calculator': { component: MttrCalculator, name: 'MTTR Calculator', canonicalPath: '/tools/mttr/' },
  'oee': { component: OeeCalculator, name: 'OEE Calculator', canonicalPath: '/tools/oee/' },
  'oee-calculator': { component: OeeCalculator, name: 'OEE Calculator', canonicalPath: '/tools/oee/' },
  'weibull': { component: WeibullAnalysis, name: 'Weibull Analysis Tool', canonicalPath: '/tools/weibull/' },
  'weibull-analysis': { component: WeibullAnalysis, name: 'Weibull Analysis Tool', canonicalPath: '/tools/weibull/' },
  'fmea': { component: FmeaCalculator, name: 'FMEA RPN Calculator', canonicalPath: '/tools/fmea/' },
  'fmea-tool': { component: FmeaCalculator, name: 'FMEA RPN Calculator', canonicalPath: '/tools/fmea/' },
  'downtime-cost': { component: DowntimeCostCalculator, name: 'Downtime Cost Calculator', canonicalPath: '/tools/downtime-cost/' },
  'bearing-life': { component: BearingLifeCalculator, name: 'L10 Bearing Life Calculator', canonicalPath: '/tools/bearing-life/' }
};

const EmbedView: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const normalizedSlug = (toolId || '').toLowerCase().trim();
  const embedInfo = TOOL_EMBED_MAP[normalizedSlug];

  if (!embedInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-900 text-white text-center space-y-3">
        <SEO title="Calculator Embed" noIndex={true} />
        <h3 className="text-xl font-bold">Calculator Widget Not Found</h3>
        <p className="text-sm text-slate-400">The requested tool embed ID is invalid.</p>
        <a href={`${BASE_URL}/embed/`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 underline">
          Open Widget Builder &rarr;
        </a>
      </div>
    );
  }

  const ToolComponent = embedInfo.component;
  const canonicalUrl = `${BASE_URL}${embedInfo.canonicalPath}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-2 sm:p-4 p-embed font-sans">
      <SEO
        title={`${embedInfo.name} Widget`}
        noIndex={true}
      />

      <style>{`
        /* Strip surrounding layout elements for clean embed *\/
        .p-embed header, 
        .p-embed footer, 
        .p-embed nav,
        .p-embed .prose, 
        .p-embed h1, 
        .p-embed p.text-lg, 
        .p-embed #overview, 
        .p-embed #how-to, 
        .p-embed section:not(#tool-container) {
          display: none !important;
        }
        .p-embed #tool-container {
          margin-bottom: 0 !important;
          padding: 0 !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
        {/* Widget Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs font-black text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{embedInfo.name}</span>
          </div>

          <a
            href={canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full"
          >
            Full Calculator <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tool Component Container */}
        <div className="p-2 sm:p-4">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400"><Loading /></div>}>
            <ToolComponent />
          </Suspense>
        </div>

        {/* Mandatory Branded Backlink Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 text-center flex items-center justify-between text-xs">
          <span className="text-slate-500 font-semibold">Reliability Engineering Embed Widget</span>
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
          >
            Powered by Reliability Tools <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmbedView;
