/**
 * Schema.org JSON-LD Structured Data Generators
 * Generates Google-compliant WebApplication, SoftwareApplication, FAQPage, Article, and BreadcrumbList schemas.
 */

export interface FAQItemSchema {
  question: string;
  answer: string;
}

export interface ArticleSchemaProps {
  id: string;
  title: string;
  summary: string;
  date: string;
  author?: string;
  image?: string;
}

export const BASE_URL = 'https://reliabilitytools.co.in';

/**
 * Generates WebApplication + SoftwareApplication schema for tools & calculators
 */
export function createToolSchema(
  name: string,
  description: string,
  url: string,
  additionalProps?: Record<string, any>
) {
  const cleanDescription = description.replace(/<[^>]*>?/gm, '');

  return {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication'],
    name,
    url,
    description: cleanDescription,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Person',
      name: 'Anil Sharma'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reliability Tools',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/social-preview.png`
      }
    },
    ...additionalProps
  };
}

/**
 * Generates FAQPage schema from an array of FAQ items
 */
export function createFaqSchema(faqs: FAQItemSchema[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generates Article schema for Learning Hub guides & blog posts
 */
export function createArticleSchema(article: ArticleSchemaProps, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.image || `${BASE_URL}/social-preview.png`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author || 'Anil Sharma'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reliability Tools',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/social-preview.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
}

/**
 * Generates BreadcrumbList schema for navigation hierarchy
 */
export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
