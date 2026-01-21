
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ARTICLES, TOOLS } from '../constants';
import { ChevronRight, Calendar, User, Printer, Info, CheckCircle2, Wrench } from 'lucide-react';
import SEO from '../components/SEO';

const ArticleView: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = ARTICLES.find(a => a.id === articleId);

  if (!article) {
    return <Navigate to="/learning" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.summary,
    "image": "https://reliabilitytools.co.in/logo.png",
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Reliability Tools",
      "logo": {
        "@type": "ImageObject",
        "url": "https://reliabilitytools.co.in/logo.png"
      }
    },
    "datePublished": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://reliabilitytools.co.in/learning/${article.id}`
    }
  };

  // Helper to render Math expressions with basic LaTeX formatting
  const renderMathContent = (latex: string) => {
    // Handle superscripts: e^{-t} -> e<sup>-t</sup>
    const parts = latex.split(/(\^\{.*?\}|\^.)/g);

    return parts.map((part, i) => {
      // Match ^{...} or ^x
      if (part.startsWith('^')) {
        let content = part.startsWith('^{') ? part.slice(2, -1) : part.slice(1);
        return <sup key={i} className="text-xs">{content}</sup>;
      }

      // Basic symbol replacement for the base text
      let text = part
        .replace(/\\approx/g, '≈')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\beta/g, 'β')
        .replace(/\\eta/g, 'η')
        .replace(/\\times/g, '×')
        .replace(/\\le/g, '≤')
        .replace(/\\ge/g, '≥')
        .replace(/\\infty/g, '∞')
        .replace(/[{}]/g, ''); // Clean up remaining braces

      return <span key={i}>{text}</span>;
    });
  };

  // Process text for Italics (*...*)
  const processItalics = (text: string) => {
    // Regex matches *text* but excludes **text** (bold) by ensuring we are inside the bold splitter's result
    // Simple approach: split by *
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

  // Process text for Math ($...$) - Priority over Bold/Italic
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
      // If not math, proceed to parse Bold/Italic
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

      // Handle Tables
      if (line.trim().startsWith('|')) {
        inTable = true;
        tableBuffer.push(line);
        continue;
      } else if (inTable) {
        // Render the buffered table
        elements.push(renderTable(tableBuffer, i));
        tableBuffer = [];
        inTable = false;
      }

      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6 border-l-4 border-cyan-500 pl-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullets
      else if (line.startsWith('• ') || line.startsWith('- ')) {
        elements.push(
          <div key={i} className="flex items-start gap-3 mb-3 ml-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-1 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              {parseText(line.replace(/^[-•] /, ''))}
            </span>
          </div>
        );
      }
      // Callouts
      else if (line.startsWith('> ')) {
        elements.push(
          <div key={i} className="bg-slate-50 dark:bg-slate-800 border-l-4 border-cyan-500 p-6 my-8 rounded-r-lg shadow-sm">
            <div className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-lg font-serif">
              {parseText(line.replace('> ', ''))}
            </div>
          </div>
        );
      }
      // Empty Lines
      else if (line.trim() === '') {
        elements.push(<div key={i} className="h-4"></div>);
      }
      // Paragraphs
      else {
        elements.push(
          <p key={i} className="text-slate-600 dark:text-slate-300 leading-8 mb-4 text-lg">
            {parseText(line)}
          </p>
        );
      }
    }

    // Flush any remaining table at end of file
    if (inTable) {
      elements.push(renderTable(tableBuffer, lines.length));
    }

    return elements;
  };

  const renderTable = (rows: string[], keyPrefix: number) => {
    if (rows.length < 3) return null;

    const headers = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
    const bodyRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

    return (
      <div key={`table-${keyPrefix}`} className="overflow-x-auto my-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-bold">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  {h}
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      <SEO schema={articleSchema} />

      <div className="flex justify-between items-center mb-6 no-print">
        <Link
          to="/learning"
          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-medium group"
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4" /> Print Article
        </button>
      </div>

      <article className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-14 border border-slate-200 dark:border-slate-800 shadow-xl">
        <header className="mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4 text-cyan-600" /> {article.date}
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <User className="w-4 h-4 text-cyan-600" /> {article.author}
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Info className="w-4 h-4 text-cyan-600" /> ~10 min read
            </div>
          </div>
        </header>

        <div className="max-w-none">
          {renderContent(article.content)}
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-10 no-print">
            <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
              <Wrench className="w-5 h-5 text-cyan-600" /> Tools Mentioned
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {TOOLS.slice(0, 3).map(tool => (
                <Link key={tool.id} to={tool.path} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{tool.name}</div>
                    <div className="text-xs text-slate-500">{tool.category}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Written By</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{article.author}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">Technical Professional & Reliability Expert</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleView;
