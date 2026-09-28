import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, ExternalLink, Ticket, Briefcase, 
  Clock, Building, DollarSign, CheckCircle2, ShieldCheck, 
  Users, AlertCircle, Filter, ArrowUpRight, Archive
} from 'lucide-react';
import { 
  RELIABILITY_EVENTS, 
  MONTHLY_JOB_DIGESTS, 
  getCurrentMonthDigest, 
  getDigestByMonth,
  ReliabilityEvent,
  MonthlyJobDigest
} from '../../data/eventsData';

const EventsHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'jobs' ? 'jobs' : 'events';
  const selectedMonth = searchParams.get('month') || '2026-09';

  const currentDigest = useMemo(() => getCurrentMonthDigest(), []);
  const activeDigest = useMemo(() => {
    return getDigestByMonth(selectedMonth) || currentDigest;
  }, [selectedMonth, currentDigest]);

  const isCurrentMonth = activeDigest.isCurrentMonth;

  // Event Schema per event
  const eventsSchema = RELIABILITY_EVENTS.map(ev => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.name,
    startDate: ev.startDate,
    endDate: ev.endDate,
    eventAttendanceMode: ev.eventAttendanceMode,
    eventStatus: ev.eventStatus,
    location: {
      '@type': 'Place',
      name: ev.locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ev.locationAddress
      }
    },
    organizer: {
      '@type': 'Organization',
      name: ev.organizer,
      url: ev.organizerUrl
    },
    description: ev.description,
    offers: {
      '@type': 'Offer',
      name: ev.freeOffer.name,
      price: ev.freeOffer.price,
      priceCurrency: ev.freeOffer.priceCurrency,
      description: ev.freeOffer.description,
      availability: 'https://schema.org/InStock',
      url: ev.registrationUrl
    }
  }));

  // Canonical URL logic
  const canonicalUrl = activeTab === 'jobs'
    ? isCurrentMonth
      ? 'https://reliabilitytools.co.in/events/jobs-digest/'
      : `https://reliabilitytools.co.in/events/jobs-digest/?month=${selectedMonth}`
    : 'https://reliabilitytools.co.in/events/';

  // User requirement: "jobs digest — keep only the current month indexable, noindex older archives;"
  const shouldNoIndex = activeTab === 'jobs' && !isCurrentMonth;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>
          {activeTab === 'jobs'
            ? `Reliability Engineering Jobs Digest (${activeDigest.monthLabel}) | Reliability Tools`
            : 'Reliability Engineering Events, Conferences & Webinars | Reliability Tools'}
        </title>
        <meta
          name="description"
          content={
            activeTab === 'jobs'
              ? `Curated industrial reliability and asset integrity career opportunities for ${activeDigest.monthLabel}. Explore open engineering roles worldwide.`
              : 'Discover premier global maintenance reliability engineering conferences, RAMS symposiums, SMRP events, and free certification webinars.'
          }
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Dynamic indexing directive: noindex older job archives */}
        {shouldNoIndex ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}

        {/* JSON-LD Structured Data for Events */}
        {activeTab === 'events' && (
          <script type="application/ld+json">
            {JSON.stringify(eventsSchema)}
          </script>
        )}
      </Helmet>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 border border-slate-700/60 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            Industry Gatherings &amp; Careers
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reliability <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">Events &amp; Jobs Hub</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Connect with leading industrial reliability professionals. Explore major IEEE, SMRP, and EuroMaintenance conferences, free accredited masterclasses, and curated monthly career opportunities in asset management.
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/70 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSearchParams({ tab: 'events' })}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Conferences &amp; Webinars ({RELIABILITY_EVENTS.length})
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'jobs' })}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Monthly Jobs Digest
          </button>
        </div>

        {/* If Jobs Tab: Month Selector */}
        {activeTab === 'jobs' && (
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSearchParams({ tab: 'jobs', month: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {MONTHLY_JOB_DIGESTS.map(d => (
                <option key={d.monthKey} value={d.monthKey}>
                  {d.monthLabel} {d.isCurrentMonth ? '(Active - index)' : '(Archive - noindex)'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: EVENTS VIEW                                            */}
      {/* ============================================================ */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RELIABILITY_EVENTS.map((event) => (
              <div 
                key={event.id}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 hover:border-cyan-500/50"
              >
                <div className="space-y-4">
                  {/* Badge & Mode */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
                      {event.eventAttendanceMode.includes('Online') ? 'Online Virtual' : event.eventAttendanceMode.includes('Mixed') ? 'Hybrid Conference' : 'In-Person Expo'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white leading-snug">
                    {event.name}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Location & Organizer */}
                  <div className="space-y-2 text-xs text-slate-400 border-t border-slate-700/60 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{event.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Organizer: <strong className="text-slate-200">{event.organizer}</strong></span>
                    </div>
                  </div>

                  {/* Topics Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {event.topics.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-400 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Free Offer / Pass CTA */}
                <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                      <Ticket className="w-4 h-4 text-cyan-400" />
                      {event.freeOffer.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Free Offer: Price $0 USD ({event.freeOffer.description})
                    </div>
                  </div>
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs whitespace-nowrap inline-flex items-center gap-1 transition-colors shrink-0"
                  >
                    Claim Pass <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: JOBS DIGEST VIEW (Current vs Archived)                 */}
      {/* ============================================================ */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Indexing Status Alert */}
          {isCurrentMonth ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-emerald-400">
                  Current Month Active Digest (Indexed)
                </p>
                <p className="text-xs text-slate-400">
                  This page contains active job vacancies and is indexed by search engines. Older archives are automatically set to <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">noindex</code> to prevent broken applications and expired positions.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-amber-400">
                  Archived Digest: {activeDigest.monthLabel} (noindex)
                </p>
                <p className="text-xs text-slate-400">
                  You are viewing an archive from a past month. Per search engine hygiene guidelines, this archive carries a <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">noindex, follow</code> directive to ensure expired postings do not rank.
                </p>
              </div>
            </div>
          )}

          {/* Editorial Summary */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1">Monthly Sector Outlook:</span>
            {activeDigest.editorialSummary}
          </div>

          {/* Job Postings Grid */}
          <div className="space-y-4">
            {activeDigest.jobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 space-y-4 hover:border-indigo-500/50 transition-all shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {job.industry}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300">
                        {job.workType}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Posted: {job.postedDate}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                    <p className="text-sm text-indigo-400 font-medium flex items-center gap-1.5">
                      <Building className="w-4 h-4" /> {job.company} — <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xs text-slate-400 block">Compensation Package</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{job.salaryRange}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-200 block uppercase tracking-wider">Key Responsibilities:</span>
                    <ul className="space-y-1 text-slate-400">
                      {job.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-400">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-200 block uppercase tracking-wider">Qualifications:</span>
                    <ul className="space-y-1 text-slate-400">
                      {job.qualifications.map((q, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400">✓</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-700/60">
                  <span className="text-xs text-slate-500 font-mono">Direct Company Portal Application</span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsHub;
