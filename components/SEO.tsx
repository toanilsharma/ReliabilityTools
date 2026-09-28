import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSeoMetadata, getRouteByPath, BASE_URL } from '../utils/seoConfig';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  schema?: any;
  noIndex?: boolean;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title: customTitle,
  description: customDescription,
  canonicalUrl: customCanonicalUrl,
  keywords,
  schema,
  noIndex = false,
  ogImage: customOgImage
}) => {
  const location = useLocation();
  const defaultSeo = getSeoMetadata(location.pathname);

  const title = customTitle || defaultSeo.title;
  const description = customDescription || defaultSeo.description;

  // Ensure canonical URL is always stripped of query parameters (canonicalizes duel/challenge/result states to base URL)
  const rawCanonical = customCanonicalUrl || defaultSeo.canonical;
  const canonicalUrl = rawCanonical.split('?')[0].split('#')[0];

  // Exclude result states, challenge seeds, duel query parameters, and save/resume states from search indexing
  const hasStateQueryParams = !!location.search && location.search.length > 1;
  const shouldNoIndex = noIndex || defaultSeo.indexable === false || hasStateQueryParams;

  // Determine route and page type from routes registry
  const route = defaultSeo ? getRouteByPath(location.pathname) : undefined;
  const routeType = route?.type;

  // Determine OG type (article vs game vs website)
  const isArticleLike = routeType === 'article' || 
    routeType === 'ugc' || 
    location.pathname.startsWith('/learning/') || 
    location.pathname.startsWith('/failure-museum/');

  const isGameLike = routeType === 'game' || location.pathname.startsWith('/play/');

  const ogType = isArticleLike ? 'article' : isGameLike ? 'game' : 'website';

  // Branded fallback OG image card based on page type
  let typeFallbackImage = `${BASE_URL}/og/default-fallback.png`;
  if (routeType === 'tool' || location.pathname.startsWith('/tools/')) {
    typeFallbackImage = `${BASE_URL}/og/tool-fallback.png`;
  } else if (routeType === 'article' || location.pathname.startsWith('/learning/') || location.pathname.startsWith('/knowledge-hub')) {
    typeFallbackImage = `${BASE_URL}/og/article-fallback.png`;
  } else if (routeType === 'industry' || location.pathname.startsWith('/industries/')) {
    typeFallbackImage = `${BASE_URL}/og/industry-fallback.png`;
  } else if (routeType === 'ugc' || location.pathname.startsWith('/failure-museum')) {
    typeFallbackImage = `${BASE_URL}/og/failure-museum.png`;
  } else if (routeType === 'event' || location.pathname.startsWith('/events')) {
    typeFallbackImage = `${BASE_URL}/og/events.png`;
  } else if (routeType === 'game' || location.pathname.startsWith('/play/')) {
    typeFallbackImage = `${BASE_URL}/og/play-hub.png`;
  }

  // Dynamic OG image card per route/game/tool
  const ROUTE_OG_IMAGES: Record<string, string> = {
    '/play': `${BASE_URL}/og/play-hub.png`,
    '/play/': `${BASE_URL}/og/play-hub.png`,
    '/play/uptime-tycoon': `${BASE_URL}/og/uptime-tycoon.png`,
    '/play/uptime-tycoon/': `${BASE_URL}/og/uptime-tycoon.png`,
    '/play/termle': `${BASE_URL}/og/termle.png`,
    '/play/termle/': `${BASE_URL}/og/termle.png`,
    '/play/guess-the-beta': `${BASE_URL}/og/guess-the-beta.png`,
    '/play/guess-the-beta/': `${BASE_URL}/og/guess-the-beta.png`,
    '/play/rca-detective': `${BASE_URL}/og/rca-detective.png`,
    '/play/rca-detective/': `${BASE_URL}/og/rca-detective.png`,
    '/play/flashcards': `${BASE_URL}/og/flashcards.png`,
    '/play/flashcards/': `${BASE_URL}/og/flashcards.png`,
    '/skill-test': `${BASE_URL}/og/skill-test.png`,
    '/skill-test/': `${BASE_URL}/og/skill-test.png`,
    '/tools/duval-triangle': `${BASE_URL}/og/duval-triangle.png`,
    '/tools/duval-triangle/': `${BASE_URL}/og/duval-triangle.png`,
    '/tools/lopa': `${BASE_URL}/og/lopa.png`,
    '/tools/lopa/': `${BASE_URL}/og/lopa.png`,
    '/tools/miners-rule': `${BASE_URL}/og/miners-rule.png`,
    '/tools/miners-rule/': `${BASE_URL}/og/miners-rule.png`,
    '/tools/error-budget': `${BASE_URL}/og/error-budget.png`,
    '/tools/error-budget/': `${BASE_URL}/og/error-budget.png`,
    '/tools/api-570-remaining-life': `${BASE_URL}/og/api-570-remaining-life.png`,
    '/tools/api-570-remaining-life/': `${BASE_URL}/og/api-570-remaining-life.png`,
    '/tools/npsh-cavitation': `${BASE_URL}/og/npsh-cavitation.png`,
    '/tools/npsh-cavitation/': `${BASE_URL}/og/npsh-cavitation.png`,
    '/tools/parts-count-mtbf': `${BASE_URL}/og/parts-count-mtbf.png`,
    '/tools/parts-count-mtbf/': `${BASE_URL}/og/parts-count-mtbf.png`,
    '/tools/eafor': `${BASE_URL}/og/eafor.png`,
    '/tools/eafor/': `${BASE_URL}/og/eafor.png`,
    '/tools/pf-interval-optimizer': `${BASE_URL}/og/pf-interval-optimizer.png`,
    '/tools/pf-interval-optimizer/': `${BASE_URL}/og/pf-interval-optimizer.png`,
    '/tools/cpm-turnaround': `${BASE_URL}/og/cpm-turnaround.png`,
    '/tools/cpm-turnaround/': `${BASE_URL}/og/cpm-turnaround.png`,
    '/failure-museum': `${BASE_URL}/og/failure-museum.png`,
    '/failure-museum/': `${BASE_URL}/og/failure-museum.png`,
    '/benchmarks': `${BASE_URL}/og/benchmarks.png`,
    '/benchmarks/': `${BASE_URL}/og/benchmarks.png`,
    '/events': `${BASE_URL}/og/events.png`,
    '/events/': `${BASE_URL}/og/events.png`,
    '/events/jobs-digest': `${BASE_URL}/og/events.png`,
    '/events/jobs-digest/': `${BASE_URL}/og/events.png`,
    '/api/docs': `${BASE_URL}/og/api-docs.png`,
    '/api/docs/': `${BASE_URL}/og/api-docs.png`
  };

  const ogImageUrl = customOgImage || ROUTE_OG_IMAGES[location.pathname] || typeFallbackImage;

  return (
    <Helmet>
      {/* Title Tag (50-65 chars ending with '| Reliability Tools') */}
      <title>{title}</title>

      {/* Meta Description (120-160 chars) */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots meta tag (noindex, follow for leaderboards, query params, result states) */}
      {shouldNoIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* CRITICAL: Self-Referencing Clean Canonical Tag */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Internationalization / hreflang alternates */}
      <link rel="alternate" href={canonicalUrl} hrefLang="en" />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Reliability Tools" />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* JSON-LD Structured Data Schema */}
      {schema && (Array.isArray(schema) ? schema : [schema]).filter(Boolean).map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;