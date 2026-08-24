import React, { Suspense, lazy, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ARTICLES, TOOLS } from '../constants';
import {
  ChevronRight,
  Calendar,
  User,
  Printer,
  Clock,
  Share2,
  Copy,
  Check,
  Linkedin,
  Wrench,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';
import { createArticleSchema, createBreadcrumbSchema, BASE_URL } from '../utils/schemaGenerator';
import ArticleToToolCTA from '../components/ArticleToToolCTA';
import TableOfContents, { slugifyHeading } from '../components/TableOfContents';

const MtbfCalculator = lazy(() => import('./Tools/MtbfCalculator'));
const WeibullAnalysis = lazy(() => import('./Tools/WeibullAnalysis'));
const FmeaCalculator = lazy(() => import('./Tools/FmeaCalculator'));
const OeeCalculator = lazy(() => import('./Tools/OeeCalculator'));

const renderCalculator = (id: string) => {
  switch (id) {
    case 'mtbf': return <MtbfCalculator />;
    case 'weibull': return <WeibullAnalysis />;
    case 'fmea': return <FmeaCalculator />;
    case 'oee': return <OeeCalculator />;
    default: return null;
  }
};

const ArticleView: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = ARTICLES.find(a => a.id === articleId);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!article) {
    return <Navigate to="/learning" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=600');
  };

  const articleUrl = `${BASE_URL}/learning/${article.id}/`;

  // Calculate Reading Time dynamically
  const wordCount = article.content.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const articleSchema = createArticleSchema(article, articleUrl);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Learning Center', url: `${BASE_URL}/learning/` },
    { name: article.title, url: articleUrl }
  ]);

  // Helper to render Math expressions with basic LaTeX formatting
  const renderMathContent = (latex: string) => {
    const parts = latex.split(/(\^\{.*?\}|\^.)/g);

    return parts.map((part, i) => {
      if (part.startsWith('^')) {
        let content = part.startsWith('^{') ? part.slice(2, -1) : part.slice(1);
        return <sup key={i} className="text-xs">{content}</sup>;
      }

      let text = part
        .replace(/\\approx/g, '≈')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\beta/g, 'β')
        .replace(/\\eta/g, 'η')
        .replace(/\\times/g, '×')
        .replace(/\\le/g, '≤')
        .replace(/\\ge/g, '≥')
        .replace(/\\infty/g, '∞')
        .replace(/[{}]/g, '');

      return <span key={i}>{text}</span>;
    });
  };

  // Process text for Italics (*...*)
  const processItalics = (text: string) => {
    const parts = text.split(/(\*[^*]+?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  // Process text for Bold (**...**)
  const processBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{processItalics(part.slice(2, -2))}</strong>;
      }
      return <React.Fragment key={i}>{processItalics(part)}</React.Fragment>;
    });
  };

  // Process text for Math ($...$)
  const processMath = (text: string) => {
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={i} className="font-serif italic text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mx-0.5 inline-block text-[0.95em]">
            {renderMathContent(part.slice(1, -1))}
          </span>
        );
      }
      return <React.Fragment key={i}>{processBold(part)}</React.Fragment>;
    });
  };

  // Top Level Parser: Handles Links first
  const parseText = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <Link key={i} to={linkMatch[2]} className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline decoration-2 underline-offset-2">
            {linkMatch[1]}
          </Link>
        );
      }
      return <React.Fragment key={i}>{processMath(part)}</React.Fragment>;
    });
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let tableBuffer: string[] = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('|')) {
        inTable = true;
        tableBuffer.push(line);
        continue;
      } else if (inTable) {
        elements.push(renderTable(tableBuffer, i));
        tableBuffer = [];
        inTable = false;
      }

      // Headers with Slugified ID for Table of Contents & Scroll-Spy
      if (line.startsWith('## ')) {
        const rawText = line.replace('## ', '').trim();
        const headingId = slugifyHeading(rawText);
        elements.push(
          <h2 id={headingId} key={i} className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-12 mb-6 border-l-4 border-cyan-500 pl-4 scroll-mt-24">
            {rawText}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const rawText = line.replace('### ', '').trim();
        const headingId = slugifyHeading(rawText);
        elements.push(
          <h3 id={headingId} key={i} className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4 scroll-mt-24">
            {rawText}
          </h3>
        );
      }
      else if (line.startsWith('• ') || line.startsWith('- ')) {
        elements.push(
          <div key={i} className="flex items-start gap-3 mb-3 ml-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-1 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg">
              {parseText(line.replace(/^[-•] /, ''))}
            </span>
          </div>
        );
      }
      else if (line.startsWith('> ')) {
        elements.push(
          <div key={i} className="bg-slate-50 dark:bg-slate-800/80 border-l-4 border-cyan-500 p-6 my-8 rounded-r-2xl shadow-sm">
            <div className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-lg font-serif">
              {parseText(line.replace('> ', ''))}
            </div>
          </div>
        );
      }
      else if (line.trim().startsWith('{{CALCULATOR:') && line.trim().endsWith('}}')) {
        const id = line.trim().replace('{{CALCULATOR:', '').replace('}}', '');
        elements.push(
          <div key={i} className="my-12 p-1 pt-6 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl relative bg-white dark:bg-slate-900 border-t-4 border-t-cyan-500">
             <div className="absolute top-0 right-8 bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-b-lg z-10">Interactive Tool</div>
             <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Calculator...</div>}>
               {renderCalculator(id)}
             </Suspense>
          </div>
        );
      }
      else if (line.trim() === '') {
        elements.push(<div key={i} className="h-4" />);
      } else {
        elements.push(
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg mb-6">
            {parseText(line)}
          </p>
        );
      }
    }

    if (inTable) {
      elements.push(renderTable(tableBuffer, lines.length));
    }

    return elements;
  };

  const renderTable = (tableLines: string[], keyPrefix: number) => {
    if (tableLines.length < 2) return null;

    const parseRow = (rowStr: string) => rowStr.split('|').slice(1, -1).map(c => c.trim());
    const headerRow = parseRow(tableLines[0]);
    const bodyRows = tableLines.slice(2).map(parseRow);

    return (
      <div key={keyPrefix} className="my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-bold text-xs">
            <tr>
              {headerRow.map((col, idx) => (
                <th key={idx} className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  {parseText(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {parseText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      <SEO
        title={`${article.title} | Reliability Tools`}
        description={article.summary}
        canonicalUrl={articleUrl}
        schema={[articleSchema, breadcrumbSchema]}
      />

      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mb-8 no-print">
        <Link
          to="/learning"
          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-bold text-sm group"
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Learning Hub
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-all text-xs font-bold shadow-sm"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copiedLink ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={handleLinkedInShare}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl transition-all text-xs font-bold shadow-sm"
          >
            <Linkedin className="w-4 h-4" /> Share
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors text-xs font-bold"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid lg:grid-cols-4 gap-10">

        {/* Left Sidebar Table of Contents (Desktop) */}
        <aside className="lg:col-span-1">
          <TableOfContents content={article.content} />
        </aside>

        {/* Main Article Container */}
        <main className="lg:col-span-3">
          <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
            <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Authoritative Guide
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                  <User className="w-4 h-4 text-cyan-500" /> {article.author}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                  <Calendar className="w-4 h-4 text-cyan-500" /> Last Updated: {article.date}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                  <Clock className="w-4 h-4 text-cyan-500" /> {readingTimeMinutes} min read
                </div>
              </div>
            </header>

            <div className="max-w-none">
              {renderContent(article.content)}
            </div>

            <ArticleToToolCTA articleId={article.id} />

            {/* Author Credentials & Footer Social Share */}
            <footer className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 no-print">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Written By</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">{article.author}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Reliability & Maintenance Engineering Expert</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    {copiedLink ? 'Link Copied!' : 'Copy Link'}
                  </button>

                  <button
                    onClick={handleLinkedInShare}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white rounded-xl font-bold text-xs hover:bg-[#084e96] transition-colors shadow-sm"
                  >
                    <Linkedin className="w-4 h-4" /> Share on LinkedIn
                  </button>
                </div>
              </div>

              {/* Related Tools Showcase */}
              <div className="no-print">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                  <Wrench className="w-5 h-5 text-cyan-500" /> Popular Reliability Tools
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {TOOLS.slice(0, 3).map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:border-cyan-500/50 transition-all group"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">{tool.name}</div>
                        <div className="text-xs text-slate-500">{tool.category}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </footer>
          </article>
        </main>
      </div>
    </div>
  );
};

export default ArticleView;
