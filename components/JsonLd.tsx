import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getRouteByPath, BASE_URL } from '../routes-registry';

interface JsonLdProps {
  schema?: any | any[];
}

// Learning descriptions mapped per game for FAQPage schema
const GAME_LEARNING_OUTCOMES: Record<string, string> = {
  '/play/uptime-tycoon/': 'You will learn asset degradation dynamics, Weibull distribution physics (beta and eta), P-F curve detection intervals, preventive maintenance scheduling, predictive sensor ROI, and balance sheet plant profit optimization across 24 operating months.',
  '/play/termle/': 'You will master standard ISO 14224 and IEEE reliability engineering terminology, MTBF definitions, failure rate metrics, and maintenance concepts through daily word puzzles.',
  '/play/guess-the-beta/': 'You will train your visual and statistical intuition for estimating Weibull shape parameters (infant mortality beta < 1, random failure beta = 1, wear-out beta > 1) and characteristic scale life from equipment breakdown histograms.',
  '/play/rca-detective/': 'You will master Root Cause Analysis (RCA) methodology, distinguishing physical failure causes, human actions, and latent organizational root causes through interactive 5-Why analysis and real-world failure dossiers.',
  '/play/flashcards/': 'You will retain 50+ critical reliability formulas and definitions through the SuperMemo SM-2 spaced repetition memory algorithm with active recall.',
  '/skill-test/': 'You will benchmark your professional reliability engineering competency across Weibull modeling, FMEA, RBD redundancy, and maintenance strategies against global engineering standards.'
};

/**
 * Global JsonLd injector reading directly from routes-registry.
 * Injects BreadcrumbList, Game/VideoGame, Quiz, ItemList, and FAQPage schemas.
 */
const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  const location = useLocation();
  const route = getRouteByPath(location.pathname);

  const schemasToRender: any[] = [];

  if (route) {
    // 1. BreadcrumbList Schema
    if (route.breadcrumbs && route.breadcrumbs.length > 0) {
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: route.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${BASE_URL}${crumb.path === '/' ? '' : crumb.path}`
        }))
      });
    }

    // 2. Play Hub ItemList Schema
    if (route.path === '/play/' || route.schemaTypes.includes('ItemList')) {
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Reliability Engineering Games & Simulation Suite',
        description: 'Interactive educational games and diagnostic puzzles for maintenance and reliability engineers.',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Uptime Tycoon',
            url: `${BASE_URL}/play/uptime-tycoon/`,
            description: '24-month industrial plant reliability and maintenance strategy simulator.'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Termle',
            url: `${BASE_URL}/play/termle/`,
            description: 'Daily 6-attempt reliability terminology guessing challenge.'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Guess the Beta',
            url: `${BASE_URL}/play/guess-the-beta/`,
            description: 'Weibull failure distribution histogram parameter estimation game.'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'RCA Detective',
            url: `${BASE_URL}/play/rca-detective/`,
            description: 'Root cause failure mystery investigation with forensic evidence files.'
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Glossary Flashcards',
            url: `${BASE_URL}/play/flashcards/`,
            description: 'SuperMemo SM-2 spaced-repetition glossary review system.'
          }
        ]
      });
    }

    // 3. Game & VideoGame Schema
    if (route.schemaTypes.includes('Game') || route.schemaTypes.includes('VideoGame')) {
      const cleanName = route.titleTemplate.split('–')[0].split('|')[0].trim();
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': ['Game', 'VideoGame', 'SoftwareApplication'],
        name: cleanName,
        headline: route.titleTemplate.replace(/\s*\|\s*Reliability Tools$/, ''),
        description: route.descriptionTemplate,
        url: `${BASE_URL}${route.path}`,
        genre: ['Simulation', 'Educational', 'Engineering Strategy'],
        gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
        applicationCategory: 'Game',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Reliability Tools',
          url: BASE_URL,
          logo: `${BASE_URL}/social-preview.png`
        }
      });
    }

    // 4. Quiz Schema for Mock Exams
    if (route.schemaTypes.includes('Quiz')) {
      const cleanName = route.titleTemplate.split('|')[0].trim();
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: cleanName,
        description: route.descriptionTemplate,
        url: `${BASE_URL}${route.path}`,
        educationalLevel: 'Professional / Engineering',
        about: {
          '@type': 'Thing',
          name: 'Industrial Reliability Engineering Certification'
        },
        provider: {
          '@type': 'Organization',
          name: 'Reliability Tools',
          url: BASE_URL
        }
      });
    }

    // 5. FAQPage Schema for Games & Exams
    if (route.schemaTypes.includes('FAQPage')) {
      const gameOutcome = GAME_LEARNING_OUTCOMES[route.path] || 
        'You will master fundamental industrial asset reliability, predictive maintenance, and statistical failure models.';

      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is it free to play?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, it is 100% free with no subscription, paywalls, or hidden charges. Built for engineering students and maintenance professionals.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No account or login is required. All game scores, streaks, certificates, and simulation states are preserved locally in your browser\'s localStorage.'
            }
          },
          {
            '@type': 'Question',
            name: 'What will I learn from this game?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: gameOutcome
            }
          }
        ]
      });
    }

    // 6. Tool Schema
    if (route.type === 'tool' && route.schemaTypes.includes('WebApplication')) {
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': ['WebApplication', 'SoftwareApplication'],
        name: route.titleTemplate.replace(/\s*\|\s*Reliability Tools$/, ''),
        url: `${BASE_URL}${route.path}`,
        description: route.descriptionTemplate,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0.0',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Reliability Tools',
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/social-preview.png`
          }
        }
      });
    } else if (route.path === '/') {
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Reliability Tools',
        url: BASE_URL,
        description: route.descriptionTemplate,
        publisher: {
          '@type': 'Organization',
          name: 'Reliability Tools',
          url: BASE_URL,
          logo: `${BASE_URL}/social-preview.png`
        }
      });
    }
  }

  // Append custom page-provided schemas if any
  if (schema) {
    const custom = Array.isArray(schema) ? schema.filter(Boolean) : [schema];
    schemasToRender.push(...custom);
  }

  if (schemasToRender.length === 0) return null;

  return (
    <Helmet>
      {schemasToRender.map((s, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default JsonLd;
