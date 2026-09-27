import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSeoMetadata, BASE_URL } from '../utils/seoConfig';

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

  // Determine OG type (game vs website)
  const isGamePage = location.pathname.startsWith('/play/') && location.pathname !== '/play/';

  // Dynamic OG image card per game
  const GAME_OG_IMAGES: Record<string, string> = {
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
    '/skill-test/': `${BASE_URL}/og/skill-test.png`
  };

  const ogImageUrl = customOgImage || GAME_OG_IMAGES[location.pathname] || `${BASE_URL}/social-preview.png`;

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

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={isGamePage ? 'game' : 'website'} />
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