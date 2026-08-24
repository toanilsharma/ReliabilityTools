import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractTocHeadings(content: string): TocItem[] {
  const lines = content.split('\n');
  const toc: TocItem[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').trim();
      const id = slugifyHeading(text);
      if (id && text) toc.push({ id, text, level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').trim();
      const id = slugifyHeading(text);
      if (id && text) toc.push({ id, text, level: 3 });
    }
  });

  return toc;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags if any
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    const parsed = extractTocHeadings(content);
    setHeadings(parsed);
    if (parsed.length > 0) {
      setActiveId(parsed[0].id);
    }
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -40% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC Drawer */}
      <div className="lg:hidden mb-8 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden no-print">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 dark:text-white"
        >
          <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
            <List className="w-4 h-4 text-cyan-500" /> Table of Contents ({headings.length})
          </span>
          {isOpenMobile ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {isOpenMobile && (
          <nav className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700/50 space-y-1.5 max-h-72 overflow-y-auto">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  heading.level === 3 ? 'pl-6' : ''
                } ${
                  activeId === heading.id
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <div className="hidden lg:block sticky top-24 space-y-4 no-print">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
          <List className="w-4 h-4 text-cyan-500" /> Table of Contents
        </div>

        <nav className="space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left py-2 px-3 rounded-xl text-xs transition-all duration-200 leading-snug ${
                heading.level === 3 ? 'pl-6' : ''
              } ${
                activeId === heading.id
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-extrabold border-l-2 border-cyan-500 pl-3'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TableOfContents;
