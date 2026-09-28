import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  AlertTriangle, Calendar, MapPin, DollarSign, ShieldAlert, 
  FileText, CheckCircle, ArrowLeft, ExternalLink, Share2, 
  AlertOctagon, CheckSquare, Tag, UserCheck, Lock
} from 'lucide-react';
import { 
  getFailureCaseBySlug, 
  approveDraftFailureCase, 
  FailureCase 
} from '../../data/failureMuseumData';
import { sanitizeUgcHtml } from '../../utils/ugcSanitizer';

const FailureCaseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const caseItem = useMemo(() => {
    return slug ? getFailureCaseBySlug(slug) : undefined;
  }, [slug, refreshKey]);

  if (!caseItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertOctagon className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Forensic Dossier Not Found</h1>
        <p className="text-slate-400">
          The requested failure case study does not exist or has been archived.
        </p>
        <Link
          to="/failure-museum/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Failure Museum
        </Link>
      </div>
    );
  }

  const isDraft = caseItem.status === 'draft';
  const canonicalUrl = `https://reliabilitytools.co.in/failure-museum/${caseItem.slug}/`;

  // Article Schema for Approved Cases
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: caseItem.title,
    description: caseItem.subtitle,
    image: [caseItem.imageUrl],
    datePublished: caseItem.datePublished,
    dateModified: caseItem.datePublished,
    author: {
      '@type': 'Person',
      name: caseItem.author.name,
      jobTitle: caseItem.author.role,
      worksFor: {
        '@type': 'Organization',
        name: caseItem.author.affiliation
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reliability Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://reliabilitytools.co.in/social-preview.png'
      }
    },
    articleSection: caseItem.industry,
    keywords: caseItem.tags.join(', ')
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://reliabilitytools.co.in/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Failure Museum',
        item: 'https://reliabilitytools.co.in/failure-museum/'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: caseItem.title,
        item: canonicalUrl
      }
    ]
  };

  const handleApprove = () => {
    approveDraftFailureCase(caseItem.id);
    setRefreshKey(prev => prev + 1);
  };

  // Ensure all UGC HTML is thoroughly sanitized and outbound links get rel="ugc"
  const sanitizedAnalysisHtml = sanitizeUgcHtml(caseItem.rootCauseAnalysis);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>{`${caseItem.title} – Forensic Case Study | Reliability Tools`}</title>
        <meta name="description" content={caseItem.subtitle.slice(0, 160)} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Robots: noindex for drafts, index for approved */}
        {isDraft ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={`${caseItem.title} | Reliability Tools`} />
        <meta property="og:description" content={caseItem.subtitle} />
        <meta property="og:image" content={caseItem.imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />

        {/* JSON-LD Schemas */}
        {!isDraft && (
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Draft Status Banner */}
      {isDraft && (
        <div className="bg-amber-500/15 border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-amber-300">
                Draft Case Study – Unapproved UGC (noindex)
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                This case study is stored as a draft with <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">noindex, follow</code> robots directive.
                On manual editorial approval, it will immediately flip to <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">index, follow</code> and inject Article structured data.
              </p>
            </div>
          </div>
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shrink-0"
          >
            <CheckCircle className="w-4 h-4" />
            Approve &amp; Flip to Index
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          to="/failure-museum/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Failure Museum
        </Link>
        <span className="text-xs font-mono text-slate-500 uppercase">
          Forensic Case ID: {caseItem.id}
        </span>
      </div>

      {/* Case Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400 uppercase tracking-wider">
            {caseItem.industry}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {caseItem.incidentDate}
          </span>
          {isDraft ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Draft (noindex)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Peer Reviewed &amp; Indexed
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {caseItem.title}
        </h1>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-4xl">
          {caseItem.subtitle}
        </p>
      </div>

      {/* Featured Visual & Quick Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
          <img
            src={caseItem.imageUrl}
            alt={caseItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {caseItem.location}
            </span>
            <span className="font-mono text-slate-400">
              Published: {caseItem.datePublished}
            </span>
          </div>
        </div>

        {/* Quick Facts Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Catastrophe Metrics
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-slate-400 text-xs block">Fatalities</span>
              <span className="text-2xl font-bold text-rose-400 font-mono">
                {caseItem.fatalities > 0 ? caseItem.fatalities : 'None Reported'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Financial Impact</span>
              <span className="text-xl font-bold text-amber-300 font-mono">
                {caseItem.costEstimate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Primary Breakdown Mode</span>
              <span className="text-sm font-semibold text-white">
                {caseItem.primaryFailureMode}
              </span>
            </div>
          </div>

          {/* Author Byline */}
          <div className="border-t border-slate-700/60 pt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {caseItem.author.name.charAt(0)}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white flex items-center gap-1">
                {caseItem.author.name}
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-slate-400">{caseItem.author.role}</div>
              <div className="text-slate-500">{caseItem.author.affiliation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forensic Analysis (UGC Sanitized with rel='ugc') */}
      <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Forensic Root Cause Analysis
        </h2>

        {/* Render sanitized markup */}
        <div 
          className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: sanitizedAnalysisHtml }}
        />
      </div>

      {/* Standards Violated & Engineering Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standards Breached */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Standards &amp; Codes Breached
          </h2>
          <ul className="space-y-2">
            {caseItem.standardsViolated.map((std, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span className="font-mono text-xs bg-slate-900/60 px-2 py-1 rounded border border-slate-700/60 text-rose-300">
                  {std}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Engineering Lessons Learned */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            Reliability Engineering Lessons
          </h2>
          <ul className="space-y-3">
            {caseItem.engineeringLessons.map((lesson, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="leading-snug">{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relevant Diagnostic Calculators */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Prevent Similar Failures With Free Engineering Tools</h3>
          <p className="text-xs text-slate-400">Calculate MTBF, model multi-stress fatigue, and optimize inspection intervals.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/tools/lopa/"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
          >
            LOPA Calculator
          </Link>
          <Link
            to="/tools/miners-rule/"
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors"
          >
            Miner's Fatigue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FailureCaseDetail;
