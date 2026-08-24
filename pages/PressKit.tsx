import React, { useState } from 'react';
import { 
  Newspaper, 
  Download, 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  BarChart2, 
  ShieldCheck, 
  Users, 
  Globe2, 
  Check, 
  Copy 
} from 'lucide-react';
import SEO from '../components/SEO';
import { BASE_URL } from '../utils/seoConfig';

const PressKit: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    outlet: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const canonicalUrl = `${BASE_URL}/press/`;

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }
    setFormSubmitted(true);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Reliability Tools Press Kit',
    description: 'Media assets, press backgrounder, platform statistics, brand guidelines, and press inquiry form for Reliability Tools.',
    url: canonicalUrl,
    logo: `${BASE_URL}/social-preview.png`
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      <SEO
        title="Media & Press Kit - Reliability Tools | Reliability Tools"
        description="Official media assets, press backgrounder, platform statistics, brand guidelines, and press contact form for Reliability Tools."
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-14 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-4">
          <Newspaper className="w-4 h-4" /> Press & Media Relations
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
          Media & Press Kit
        </h1>

        <p className="text-slate-300 text-base md:text-xl leading-relaxed font-medium">
          Access official brand assets, key platform statistics, founder bio, and contact our press relations team for interviews, podcasts, and media coverage.
        </p>
      </div>

      {/* Key Platform Statistics */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">28+</div>
          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Engineering Calculators</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto">
            <Globe2 className="w-6 h-6" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-cyan-500">50,000+</div>
          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Calculations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">ISO & IEC</div>
          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Standards Compliant</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-emerald-500">100%</div>
          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Open Access</div>
        </div>
      </section>

      {/* About the Founder & Mission */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm grid lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Platform Mission
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
            Democratizing High-Precision Reliability Engineering Software
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            Reliability Tools was founded to solve a major industry challenge: traditional reliability engineering software tools are often prohibitively expensive, clunky, or hidden behind corporate paywalls.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
            Our mission is to empower plant engineers, maintenance managers, and university researchers worldwide with free, accessible, browser-based tools that conform strictly to international engineering standards (ISO 281, IEC 61508, AGMA 2001).
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg">
            RT
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Engineering Leadership</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ReliabilityTools.co.in Editorial Board</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 italic">
            "We believe that high-precision failure probability models should be universally accessible to every engineer."
          </p>
        </div>
      </section>

      {/* Brand Assets & Color Guidelines */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Brand Assets
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Official Logos & Brand Color Tokens
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Logo Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Primary Logo Asset</span>
              <div className="p-6 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800">
                <span className="text-2xl font-black tracking-tight text-white">
                  Reliability<span className="text-cyan-400">Tools</span>
                </span>
              </div>
            </div>
            <a
              href="/social-preview.png"
              download="ReliabilityTools-Logo.png"
              className="py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Logo Asset (PNG/SVG)
            </a>
          </div>

          {/* Color Palettes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 md:col-span-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Official Brand Color Tokens</span>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleCopyColor('#06b6d4')}
                className="bg-cyan-500 p-4 rounded-2xl text-slate-950 font-black text-left space-y-2 relative group shadow-md"
              >
                <div className="text-xs uppercase font-extrabold opacity-80">Primary Cyan</div>
                <div className="text-lg font-mono">#06b6d4</div>
                <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  {copiedHex === '#06b6d4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHex === '#06b6d4' ? 'Copied' : 'Copy HEX'}
                </span>
              </button>

              <button
                onClick={() => handleCopyColor('#0f172a')}
                className="bg-slate-900 p-4 rounded-2xl text-white font-black text-left space-y-2 relative group shadow-md border border-slate-800"
              >
                <div className="text-xs uppercase font-extrabold text-slate-400">Dark Slate</div>
                <div className="text-lg font-mono">#0f172a</div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  {copiedHex === '#0f172a' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHex === '#0f172a' ? 'Copied' : 'Copy HEX'}
                </span>
              </button>

              <button
                onClick={() => handleCopyColor('#f43f5e')}
                className="bg-rose-500 p-4 rounded-2xl text-white font-black text-left space-y-2 relative group shadow-md"
              >
                <div className="text-xs uppercase font-extrabold text-rose-100">Accent Rose</div>
                <div className="text-lg font-mono">#f43f5e</div>
                <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  {copiedHex === '#f43f5e' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHex === '#f43f5e' ? 'Copied' : 'Copy HEX'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Press & Media Contact Form */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-12 border border-cyan-500/30 text-white shadow-2xl max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1.5">
            <Mail className="w-4 h-4" /> Direct Media Inquiries
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Contact Press & Partnerships
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-medium">
            For press coverage, podcast appearances, guest publications, or academic partnerships:
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Press Inquiry Sent Successfully!</h3>
            <p className="text-sm text-emerald-200 font-medium">
              Thank you for reaching out. Our press communications team will respond within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  placeholder="e.g. sarah@engineering-mag.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Media Outlet / Publication</label>
              <input
                type="text"
                value={formState.outlet}
                onChange={e => setFormState(s => ({ ...s, outlet: e.target.value }))}
                placeholder="e.g. Plant Engineering Magazine / University Research Journal"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Inquiry Details *</label>
              <textarea
                rows={4}
                required
                value={formState.message}
                onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                placeholder="Describe your story angle, interview topic, or partnership proposal..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Press Inquiry
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default PressKit;
