import React, { useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Menu, X, ShieldCheck, ChevronDown, Sun, Moon, AlertTriangle, ExternalLink, Calculator, Zap, Linkedin, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { TOOLS, AUTHOR_NAME, ARTICLES } from '../constants';
import CookieConsent from './CookieConsent';
import { useTheme } from '../context/ThemeContext';
import SEO from './SEO';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const [shareUrl, setShareUrl] = useState('');

  React.useEffect(() => {
    setShareUrl(window.location.href);
  }, [location]);

  // Generate Dynamic Breadcrumb Schema
  const generateBreadcrumbSchema = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const baseUrl = 'https://reliabilitytools.co.in';

    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      let name = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Check for tools
      const tool = TOOLS.find(t => t.path === currentPath);
      if (tool) name = tool.name;

      // Check for articles (if we are in a learning route)
      if (pathSegments[0] === 'learning' && index === 1) {
        const article = ARTICLES.find(a => a.id === segment);
        if (article) name = article.title;
      }

      if (segment === 'tools' && index === 0) name = 'Tools';
      if (segment === 'learning' && index === 0) name = 'Learning Center';
      if (segment === 'knowledge-hub') name = 'Knowledge Hub';

      items.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": `${baseUrl}${currentPath}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
      <SEO schema={generateBreadcrumbSchema()} />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                <div className="p-2 bg-cyan-500/10 dark:bg-cyan-900/30 rounded-lg border border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Reliability<span className="text-cyan-600 dark:text-cyan-400">Tools</span></span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>

                {/* Tools Dropdown */}
                <div className="relative group">
                  <button className="flex items-center hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">
                    Tools <ChevronDown className="ml-1 h-3 w-3" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="py-1">
                      {TOOLS.map((tool) => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white"
                        >
                          {tool.name}
                        </Link>
                      ))}
                      <div className="border-t border-slate-200 dark:border-slate-700 mt-1 pt-1">
                        <Link to="/tools" className="block px-4 py-2 text-sm text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-700">View All Tools</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/knowledge-hub" className="hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Knowledge Hub</Link>
                <Link to="/downloads" className="hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Templates</Link>
                <Link to="/learning" className="hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Articles</Link>
                <Link to="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Home</Link>

              <div className="px-3 py-2 font-medium text-slate-500 dark:text-slate-400">Tools</div>
              {TOOLS.map((tool) => (
                <Link key={tool.id} to={tool.path} onClick={closeMenu} className="block pl-6 pr-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">
                  {tool.name}
                </Link>
              ))}

              <Link to="/knowledge-hub" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Knowledge Hub</Link>
              <Link to="/downloads" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Templates</Link>
              <Link to="/learning" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Articles</Link>
              <Link to="/glossary" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Glossary</Link>
              <Link to="/about" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">About</Link>
              <Link to="/contact" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-white">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Outlet />
        </div>
      </main>

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-900 pt-16 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
                <span className="text-lg font-bold text-white tracking-tight">Reliability<span className="text-cyan-400">Tools</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Open-source grade tools for maintenance reliability professionals.
                Calculate MTBF, perform Weibull analysis, and plan maintenance schedules free of charge.
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 text-slate-400 uppercase tracking-wider mb-3">
                  Share this page
                </p>
                <div className="flex gap-4">
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" aria-label="Share on LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied to clipboard!'); }} className="text-slate-400 hover:text-cyan-400 transition-colors" aria-label="Copy Link (Instagram)">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" aria-label="Share on Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20tool!`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors" aria-label="Share on Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={`mailto:?subject=Reliability%20Tools&body=Check%20out%20this%20website:%20${encodeURIComponent(shareUrl)}`} className="text-slate-400 hover:text-cyan-400 transition-colors" aria-label="Share via Email">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/tools" className="hover:text-cyan-400 transition-colors">All Tools</Link></li>
                <li><Link to="/downloads" className="hover:text-cyan-400 transition-colors">Templates & Downloads</Link></li>
                <li><Link to="/knowledge-hub" className="hover:text-cyan-400 transition-colors">Knowledge Hub</Link></li>
                <li><Link to="/glossary" className="hover:text-cyan-400 transition-colors">Glossary</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6">Legal</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/legal/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/cookies" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-6">Other websites developed by us</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>
                  <a href="https://designcalculators.co.in" target="_blank" rel="noopener noreferrer" className="group block hover:bg-slate-800/50 -mx-3 p-3 rounded-lg transition-all">
                    <div className="flex items-center gap-2 font-bold text-slate-200 group-hover:text-cyan-400 mb-1">
                      <Calculator className="w-4 h-4" />
                      Design Calculators
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-400">Engineering calculations for design and reliability improvements</p>
                  </a>
                </li>
                <li>
                  <a href="https://electrosafe.homes" target="_blank" rel="noopener noreferrer" className="group block hover:bg-slate-800/50 -mx-3 p-3 rounded-lg transition-all">
                    <div className="flex items-center gap-2 font-bold text-slate-200 group-hover:text-cyan-400 mb-1">
                      <Zap className="w-4 h-4" />
                      ElectroSafe Homes
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-400">Electrical home safety tips & tools.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-12 flex flex-col items-center">
            {/* Disclaimer Box */}
            <div className="w-full max-w-4xl bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 hidden sm:block" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-500 uppercase tracking-wide mr-2">Disclaimer:</span>
                  These tools are for estimation and educational purposes. <strong className="text-white">Do not use for safety-critical life-support system validation without independent verification by a certified Professional Engineer.</strong>
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                &copy; {new Date().getFullYear()} Reliability Tools. Created by: <span className="text-white font-medium">{AUTHOR_NAME}</span>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;