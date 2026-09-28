import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, AlertOctagon, Flame, ChevronRight, Filter, Search, 
  PlusCircle, CheckCircle, ShieldAlert, Award, Calendar, MapPin, 
  DollarSign, FileText, ArrowRight, ExternalLink, Lock
} from 'lucide-react';
import { 
  getApprovedFailureCases, 
  getDraftFailureCases, 
  saveDraftFailureCase, 
  approveDraftFailureCase, 
  FailureCase 
} from '../../data/failureMuseumData';
import { sanitizeUgcHtml } from '../../utils/ugcSanitizer';
import Breadcrumbs from '../../components/Breadcrumbs';

const CASES_PER_PAGE = 12; // 12+ cases per pagination page as required

const FailureMuseumHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approved' | 'drafts'>('approved');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Community Submission Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    incidentDate: '',
    location: '',
    industry: 'Oil & Gas Exploration',
    fatalities: 0,
    costEstimate: '',
    primaryFailureMode: '',
    standardsViolated: '',
    rootCauseAnalysis: '',
    engineeringLessons: '',
    authorName: '',
    authorRole: '',
    authorAffiliation: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    tags: ''
  });

  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  const approvedCases = useMemo(() => getApprovedFailureCases(), [submissionSuccess]);
  const draftCases = useMemo(() => getDraftFailureCases(), [submissionSuccess]);

  const targetList = activeTab === 'approved' ? approvedCases : draftCases;

  // Filter cases
  const filteredCases = useMemo(() => {
    return targetList.filter(c => {
      const matchesIndustry = selectedIndustry === 'All' || c.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
      const matchesSearch = searchQuery.trim() === '' || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryFailureMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.standardsViolated.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesIndustry && matchesSearch;
    });
  }, [targetList, selectedIndustry, searchQuery]);

  // Pagination (12+ cases per page)
  const totalPages = Math.ceil(filteredCases.length / CASES_PER_PAGE) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * CASES_PER_PAGE;
    return filteredCases.slice(start, start + CASES_PER_PAGE);
  }, [filteredCases, currentPage]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    approvedCases.forEach(c => set.add(c.industry));
    return ['All', ...Array.from(set)];
  }, [approvedCases]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const sanitizedRca = sanitizeUgcHtml(formData.rootCauseAnalysis);

    const newCase = saveDraftFailureCase({
      slug: slug || `case-${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle,
      incidentDate: formData.incidentDate || new Date().toISOString().split('T')[0],
      location: formData.location || 'Industrial Facility',
      industry: formData.industry,
      fatalities: Number(formData.fatalities) || 0,
      costEstimate: formData.costEstimate || 'Under Assessment',
      primaryFailureMode: formData.primaryFailureMode || 'Mechanical Breakdown',
      standardsViolated: formData.standardsViolated.split(',').map(s => s.trim()).filter(Boolean),
      rootCauseAnalysis: sanitizedRca,
      engineeringLessons: formData.engineeringLessons.split('\n').map(l => l.trim()).filter(Boolean),
      author: {
        name: formData.authorName || 'Anonymous Contributor',
        role: formData.authorRole || 'Reliability Engineer',
        affiliation: formData.authorAffiliation || 'Independent Industry Practitioner'
      },
      imageUrl: formData.imageUrl,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      ugcContentHtml: sanitizedRca
    });

    setLastSubmittedId(newCase.id);
    setSubmissionSuccess(true);
    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setSubmissionSuccess(false);
      setActiveTab('drafts');
    }, 2000);
  };

  const handleApproveDraft = (id: string) => {
    approveDraftFailureCase(id);
    setSubmissionSuccess(prev => !prev); // Trigger refresh
  };

  // Schema: ItemList for the 12+ cases on the listing page
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Industrial Failure Museum – Forensic Reliability Engineering Case Studies',
    description: 'Curated repository of forensic disaster investigations, root-cause analyses, and mechanical breakdown lessons across global industry.',
    numberOfItems: paginatedCases.length,
    itemListElement: paginatedCases.map((c, index) => ({
      '@type': 'ListItem',
      position: (currentPage - 1) * CASES_PER_PAGE + index + 1,
      name: c.title,
      url: `https://reliabilitytools.co.in/failure-museum/${c.slug}/`,
      description: c.subtitle,
      image: c.imageUrl
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>Failure Museum – Industrial Disaster Case Studies | Reliability Tools</title>
        <meta 
          name="description" 
          content="Explore forensic engineering case studies of historic industrial catastrophes, root causes, standards violated, and reliability lessons learned." 
        />
        <link rel="canonical" href="https://reliabilitytools.co.in/failure-museum/" />
        {activeTab === 'drafts' ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 p-8 md:p-12 border border-slate-700/60 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            Forensic Engineering Archive
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400">Failure Museum</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Every catastrophic breakdown leaves an indelible engineering lesson. Explore rigorous forensic analyses of historic 
            process safety disasters, structural collapses, and software anomalies — detailing root causes, standards breached, and preventive reliability designs.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-sm shadow-lg shadow-rose-900/30 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Community Case Study
            </button>
            <a
              href="#cases-grid"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all"
            >
              Browse 14+ Forensic Cases
            </a>
          </div>
        </div>
      </div>

      {/* Editorial Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300 space-y-1">
          <p className="font-semibold text-amber-400">
            Editorial Submission Policy &amp; Anti-Spam Safeguards:
          </p>
          <p className="text-slate-400">
            Community contributions are initially saved as <strong className="text-slate-200">noindex drafts</strong> pending technical peer review. Once verified for engineering accuracy and sanitized per ISO safety guidelines, cases are approved and indexed with full <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-amber-300">schema.org/Article</code> structured data. All UGC HTML is sanitized with automatic <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-amber-300">rel="ugc"</code> outbound attribution.
          </p>
        </div>
      </div>

      {/* Tabs: Curated Library vs Review Sandbox */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('approved'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'approved'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Curated Library ({approvedCases.length})
          </button>
          <button
            onClick={() => { setActiveTab('drafts'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'drafts'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Review Sandbox / Drafts ({draftCases.length})
            <span className="text-xs px-1.5 py-0.2 bg-slate-900 rounded-full font-mono text-amber-300">noindex</span>
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search failure modes, standards..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedIndustry}
            onChange={(e) => { setSelectedIndustry(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Cases (12+ cases per page) */}
      <div id="cases-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCases.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <AlertOctagon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No failure cases match your current filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search term or selecting 'All' industries.</p>
          </div>
        ) : (
          paginatedCases.map((c) => (
            <article 
              key={c.id} 
              className="group flex flex-col bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src={c.imageUrl} 
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-sm">
                    {c.industry}
                  </span>
                  {c.status === 'draft' && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/90 text-slate-900 backdrop-blur-sm">
                      Draft (noindex)
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {c.incidentDate}
                  </span>
                  <span className="font-semibold text-rose-400">
                    {c.fatalities > 0 ? `${c.fatalities} Fatalities` : 'Zero Fatalities'}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {c.subtitle}
                  </p>
                </div>

                {/* Key metadata pills */}
                <div className="space-y-2 border-t border-slate-700/60 pt-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500 font-medium">Primary Mode:</span>
                    <span className="font-semibold text-slate-200 line-clamp-1">{c.primaryFailureMode}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500 font-medium">Standards Violated:</span>
                    <span className="text-rose-400 font-mono text-[11px] line-clamp-1">{c.standardsViolated.join(', ')}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={`/failure-museum/${c.slug}/`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                  >
                    Forensic Dossier <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  {c.status === 'draft' && (
                    <button
                      onClick={() => handleApproveDraft(c.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Manual approval flips draft to indexable with Article schema"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve &amp; Index
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination Bar (Ensuring 12+ cases per page navigable) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                currentPage === i + 1
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Community Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Submit Industrial Failure Case Study</h2>
                <p className="text-xs text-slate-400">Submissions are saved as noindex drafts and sanitized with rel="ugc".</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Submission Stored as Draft (noindex)</h3>
                <p className="text-sm text-slate-300">
                  Your case study has been recorded locally with draft status. Visit the "Review Sandbox / Drafts" tab to preview or test manual peer approval to flip it to indexable!
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Case Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Compressor Station Stage 2 Impeller Fatigue Fracture"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">One-Sentence Technical Subtitle *</label>
                  <input
                    type="text"
                    required
                    placeholder="Summary of failure mode and immediate consequence..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Industry Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. Petrochemical Refining"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Primary Failure Mode</label>
                    <input
                      type="text"
                      placeholder="e.g. High-Cycle Fatigue Cracking"
                      value={formData.primaryFailureMode}
                      onChange={(e) => setFormData({ ...formData, primaryFailureMode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Governing Standards Breached</label>
                    <input
                      type="text"
                      placeholder="e.g. API 617, ISO 10816, ASME Section VIII"
                      value={formData.standardsViolated}
                      onChange={(e) => setFormData({ ...formData, standardsViolated: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Incident Date</label>
                    <input
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Forensic Root Cause Analysis (HTML / UGC Allowed) *
                  </label>
                  <p className="text-xs text-slate-500 mb-1">
                    HTML is sanitized with DOMPurify; all hyperlinks automatically receive <code className="text-amber-300">rel="ugc nofollow"</code>.
                  </p>
                  <textarea
                    required
                    rows={4}
                    placeholder="<p>Detailed sequence of physical failure, human factors, latent management deficiencies...</p>"
                    value={formData.rootCauseAnalysis}
                    onChange={(e) => setFormData({ ...formData, rootCauseAnalysis: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Engineering Lessons (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Lesson 1: Verify vibration spectra at 2x running speed&#10;Lesson 2: Enforce mandatory LOTO verification"
                    value={formData.engineeringLessons}
                    onChange={(e) => setFormData({ ...formData, engineeringLessons: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Author Name &amp; Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe, CMRP"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Affiliation / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Asset Integrity Solutions Ltd."
                      value={formData.authorAffiliation}
                      onChange={(e) => setFormData({ ...formData, authorAffiliation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold hover:from-rose-500 hover:to-amber-500 transition-all"
                  >
                    Save as Draft (noindex)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FailureMuseumHub;
