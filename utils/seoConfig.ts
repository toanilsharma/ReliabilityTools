/**
 * Centralized SEO Configuration for Reliability Tools
 * Rewritten to read EXCLUSIVELY from the single source of truth: routes-registry
 */

import { 
  BASE_URL as REGISTRY_BASE_URL, 
  ROUTES_REGISTRY, 
  getRouteByPath as lookupRouteByPath,
  normalizeRoutePath,
  RouteRegistryEntry,
  RouteBreadcrumb
} from '../routes-registry';

export const BASE_URL = REGISTRY_BASE_URL;

export interface PageSeoConfig {
  title: string;
  description: string;
  canonical: string;
  schemaTypes?: string[];
  breadcrumbs?: RouteBreadcrumb[];
  indexable?: boolean;
}

/**
 * Direct lookup map generated directly from the routes registry
 * Supports both with and without trailing slashes.
 */
export const SEO_CONFIG: Record<string, PageSeoConfig> = (() => {
  const map: Record<string, PageSeoConfig> = {};

  ROUTES_REGISTRY.forEach(route => {
    const config: PageSeoConfig = {
      title: route.titleTemplate,
      description: route.descriptionTemplate,
      canonical: `${BASE_URL}${route.path}`,
      schemaTypes: route.schemaTypes,
      breadcrumbs: route.breadcrumbs,
      indexable: route.indexable
    };

    map[route.path] = config;

    // Also support non-trailing slash key if different from '/'
    if (route.path !== '/' && route.path.endsWith('/')) {
      const withoutSlash = route.path.slice(0, -1);
      map[withoutSlash] = config;
    }
  });

  return map;
})();

/**
 * Resolves SEO metadata for any pathname, reading ONLY from the routes registry.
 */
export function getSeoMetadata(pathname: string): PageSeoConfig {
  const route = lookupRouteByPath(pathname);

  if (route) {
    return {
      title: route.titleTemplate,
      description: route.descriptionTemplate,
      canonical: `${BASE_URL}${route.path}`,
      schemaTypes: route.schemaTypes,
      breadcrumbs: route.breadcrumbs,
      indexable: route.indexable
    };
  }

  // Fallback for unregistered paths
  const normalized = normalizeRoutePath(pathname);
  return {
    title: 'Industrial Reliability Engineering Tools | Reliability Tools',
    description: 'Free industrial reliability engineering calculators for MTBF, Weibull analysis, FMEA, OEE, Availability, RBD, and PM optimization.',
    canonical: `${BASE_URL}${normalized}`,
    indexable: true
  };
}

export { lookupRouteByPath as getRouteByPath, ROUTES_REGISTRY };
