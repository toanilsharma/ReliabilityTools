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
}

const SEO: React.FC<SEOProps> = ({
  title: customTitle,
  description: customDescription,
  canonicalUrl: customCanonicalUrl,
  keywords,
  schema,
  noIndex = false
}) => {
  const location = useLocation();
  const defaultSeo = getSeoMetadata(location.pathname);

  const title = customTitle || defaultSeo.title;
  const description = customDescription || defaultSeo.description;
  const canonicalUrl = customCanonicalUrl || defaultSeo.canonical;

  return (
    <Helmet>
      {/* Title Tag (50-60 chars ending with '| Reliability Tools') */}
      <title>{title}</title>

      {/* Meta Description (120-155 chars) */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots meta tag (noindex, follow for embeds/internal pages) */}
      {noIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* CRITICAL: Self-Referencing Canonical Tag */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Reliability Tools" />
      <meta property="og:image" content={`${BASE_URL}/social-preview.png`} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/social-preview.png`} />

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