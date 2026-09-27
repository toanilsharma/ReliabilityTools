import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getRouteByPath, BASE_URL } from '../routes-registry.ts';

interface JsonLdProps {
  schema?: any | any[];
}

/**
 * Global JsonLd injector reading directly from routes-registry.
 * Automatically injects BreadcrumbList and Type-based Structured Data schemas
 * matching the route's declared schemaTypes and breadcrumbs.
 */
const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  const location = useLocation();
  const route = getRouteByPath(location.pathname);

  const schemasToRender: any[] = [];

  if (route) {
    // 1. Auto-generate BreadcrumbList schema from registry breadcrumbs
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

    // 2. Auto-generate Type-Specific Schema based on route.schemaTypes
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
      // Homepage Organization & WebSite
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

  // 3. Append custom page-provided schemas if any
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
