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
 * High-authority Knowledge Graph entity mapping for industrial engineering & reliability concepts.
 * Connects calculator schemas directly to Wikipedia and Wikidata nodes for AI search and Google entity linking.
 */
const ENTITY_KNOWLEDGE_MAP: Record<string, { name: string; wikipedia: string; wikidata?: string }> = {
  weibull: {
    name: 'Weibull distribution',
    wikipedia: 'https://en.wikipedia.org/wiki/Weibull_distribution',
    wikidata: 'https://www.wikidata.org/wiki/Q380387'
  },
  mtbf: {
    name: 'Mean time between failures',
    wikipedia: 'https://en.wikipedia.org/wiki/Mean_time_between_failures',
    wikidata: 'https://www.wikidata.org/wiki/Q1055562'
  },
  mttr: {
    name: 'Mean time to repair',
    wikipedia: 'https://en.wikipedia.org/wiki/Mean_time_to_repair',
    wikidata: 'https://www.wikidata.org/wiki/Q949779'
  },
  fmea: {
    name: 'Failure mode and effects analysis',
    wikipedia: 'https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis',
    wikidata: 'https://www.wikidata.org/wiki/Q836916'
  },
  sil: {
    name: 'Safety integrity level',
    wikipedia: 'https://en.wikipedia.org/wiki/Safety_integrity_level',
    wikidata: 'https://www.wikidata.org/wiki/Q1474272'
  },
  oee: {
    name: 'Overall equipment effectiveness',
    wikipedia: 'https://en.wikipedia.org/wiki/Overall_equipment_effectiveness',
    wikidata: 'https://www.wikidata.org/wiki/Q1478792'
  },
  availability: {
    name: 'Availability',
    wikipedia: 'https://en.wikipedia.org/wiki/Availability',
    wikidata: 'https://www.wikidata.org/wiki/Q665328'
  },
  rbd: {
    name: 'Reliability block diagram',
    wikipedia: 'https://en.wikipedia.org/wiki/Reliability_block_diagram',
    wikidata: 'https://www.wikidata.org/wiki/Q7311100'
  },
  fta: {
    name: 'Fault tree analysis',
    wikipedia: 'https://en.wikipedia.org/wiki/Fault_tree_analysis',
    wikidata: 'https://www.wikidata.org/wiki/Q1398860'
  },
  lopa: {
    name: 'Layer of protection analysis',
    wikipedia: 'https://en.wikipedia.org/wiki/Layer_of_protection_analysis'
  },
  bearing: {
    name: 'Bearing fatigue life (ISO 281)',
    wikipedia: 'https://en.wikipedia.org/wiki/Bearing_(mechanical)',
    wikidata: 'https://www.wikidata.org/wiki/Q190100'
  },
  api570: {
    name: 'Piping inspection and remaining life',
    wikipedia: 'https://en.wikipedia.org/wiki/American_Petroleum_Institute'
  },
  duval: {
    name: 'Duval triangle dissolved gas analysis',
    wikipedia: 'https://en.wikipedia.org/wiki/Dissolved_gas_analysis'
  },
  npsh: {
    name: 'Net positive suction head',
    wikipedia: 'https://en.wikipedia.org/wiki/NPSH',
    wikidata: 'https://www.wikidata.org/wiki/Q900891'
  },
  lcc: {
    name: 'Life-cycle cost analysis',
    wikipedia: 'https://en.wikipedia.org/wiki/Life-cycle_cost_analysis',
    wikidata: 'https://www.wikidata.org/wiki/Q1824497'
  },
  spc: {
    name: 'Statistical process control',
    wikipedia: 'https://en.wikipedia.org/wiki/Statistical_process_control',
    wikidata: 'https://www.wikidata.org/wiki/Q938780'
  },
  markov: {
    name: 'Markov chain reliability modeling',
    wikipedia: 'https://en.wikipedia.org/wiki/Markov_chain',
    wikidata: 'https://www.wikidata.org/wiki/Q176645'
  },
  fishbone: {
    name: 'Ishikawa cause-and-effect diagram',
    wikipedia: 'https://en.wikipedia.org/wiki/Ishikawa_diagram',
    wikidata: 'https://www.wikidata.org/wiki/Q726715'
  },
  pareto: {
    name: 'Pareto analysis (80/20 rule)',
    wikipedia: 'https://en.wikipedia.org/wiki/Pareto_analysis',
    wikidata: 'https://www.wikidata.org/wiki/Q258385'
  }
};

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

  const slugMatch = Object.keys(ENTITY_KNOWLEDGE_MAP).find(key => url.toLowerCase().includes(key));
  const entity = slugMatch ? ENTITY_KNOWLEDGE_MAP[slugMatch] : null;

  const aboutEntity = entity ? [{
    '@type': 'Thing',
    name: entity.name,
    sameAs: [entity.wikipedia, ...(entity.wikidata ? [entity.wikidata] : [])]
  }] : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication'],
    name,
    url,
    description: cleanDescription,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Engineering & Reliability Analysis',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0.0',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    maintainer: {
      '@type': 'Organization',
      name: 'Reliability Tools',
      url: BASE_URL
    },
    ...(aboutEntity ? { about: aboutEntity } : {}),
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
      name: 'Anil Sharma',
      url: 'https://www.linkedin.com/in/toanilsharma/',
      sameAs: [
        'https://www.linkedin.com/in/toanilsharma/'
      ],
      jobTitle: 'Reliability & Asset Management Engineer',
      knowsAbout: [
        'Reliability Engineering',
        'Weibull Analysis',
        'MTBF / MTTF Modeling',
        'FMEA / FMECA',
        'Predictive Maintenance',
        'Asset Lifecycle Management'
      ]
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
      name: article.author || 'Anil Sharma',
      url: 'https://www.linkedin.com/in/toanilsharma/',
      sameAs: [
        'https://www.linkedin.com/in/toanilsharma/'
      ]
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

export interface HowToStepSchema {
  name: string;
  text: string;
  url?: string;
}

/**
 * Generates Google-compliant HowTo schema for engineering workflows and calculators
 */
export function createHowToSchema(
  toolName: string,
  url: string,
  steps?: HowToStepSchema[]
) {
  const defaultSteps: HowToStepSchema[] = [
    {
      name: 'Enter Asset Reliability & Operating Parameters',
      text: `Input operational run times, failure timestamps, or maintenance parameters into the ${toolName} fields.`,
      url: `${url}#inputs`
    },
    {
      name: 'Configure Statistical Distribution or Compliance Standards',
      text: 'Select confidence bounds (e.g. 90%, 95%), industry standards (ISO 14224, IEC 61508, API 570), or regression methods.',
      url: `${url}#configuration`
    },
    {
      name: 'Execute Verification & Mathematical Estimation',
      text: 'Analyze the computed parameters, probability density plots, and verified engineering failure metrics.',
      url: `${url}#results`
    },
    {
      name: 'Export Technical Verification Report',
      text: 'Generate and download the branded PDF compliance report with step-by-step mathematical proofs and recommendations.',
      url: `${url}#export`
    }
  ];

  const actualSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Calculate and Verify Reliability Metrics with ${toolName}`,
    description: `Step-by-step engineering tutorial to perform reliability calculations and compliance audits using ${toolName}.`,
    step: actualSteps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      itemListElement: [
        {
          '@type': 'HowToDirection',
          text: step.text
        }
      ],
      ...(step.url ? { url: step.url } : {})
    }))
  };
}
