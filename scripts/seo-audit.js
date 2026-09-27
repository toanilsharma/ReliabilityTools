#!/usr/bin/env node

/**
 * Build-Time SEO Audit Script for Reliability Tools
 * Fails the build (exit code 1) if:
 *  - Any route lacks a title, canonical, schema assignment, or sitemap decision.
 *  - Any two routes share an identical title.
 *  - Any route has invalid type, missing breadcrumbs, or invalid canonical URL.
 */

const path = require('path');
const { ROUTES_REGISTRY, BASE_URL } = require('../routes-registry.js');

const VALID_TYPES = ['tool', 'game', 'article', 'industry', 'ugc', 'event', 'utility', 'legal'];
const VALID_CHANGEFREQ = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

console.log('====================================================');
console.log('🔍 RUNNING BUILD-TIME SEO ROUTE REGISTRY AUDIT');
console.log(`🔍 Auditing ${ROUTES_REGISTRY.length} registered routes...`);
console.log('====================================================\n');

const errors = [];
const warnings = [];
const seenTitles = new Map(); // title -> path
const seenPaths = new Set();

ROUTES_REGISTRY.forEach((route, index) => {
  const routePrefix = `[Route ${index + 1}: ${route.path || 'UNKNOWN'}]`;

  // 1. Path check
  if (!route.path || typeof route.path !== 'string') {
    errors.push(`${routePrefix} Missing or invalid 'path'.`);
    return;
  }
  if (!route.path.startsWith('/')) {
    errors.push(`${routePrefix} Path must start with '/'. Found: "${route.path}"`);
  }
  if (route.path !== '/' && !route.path.endsWith('/')) {
    errors.push(`${routePrefix} Path must have a trailing slash for canonical standard. Found: "${route.path}"`);
  }
  if (seenPaths.has(route.path)) {
    errors.push(`${routePrefix} Duplicate path detected: "${route.path}"`);
  }
  seenPaths.add(route.path);

  // 2. Canonical check
  const canonical = `${BASE_URL}${route.path}`;
  if (!canonical.startsWith('https://reliabilitytools.co.in/')) {
    errors.push(`${routePrefix} Canonical URL invalid: "${canonical}"`);
  }

  // 3. Title check & Uniqueness
  if (!route.titleTemplate || typeof route.titleTemplate !== 'string' || route.titleTemplate.trim() === '') {
    errors.push(`${routePrefix} Missing or empty 'titleTemplate'.`);
  } else {
    const title = route.titleTemplate.trim();
    if (seenTitles.has(title)) {
      errors.push(
        `${routePrefix} DUPLICATE TITLE DETECTED!\n` +
        `   Title: "${title}"\n` +
        `   Conflicts with: "${seenTitles.get(title)}"`
      );
    } else {
      seenTitles.set(title, route.path);
    }

    if (!title.endsWith('| Reliability Tools')) {
      warnings.push(`${routePrefix} Title should end with '| Reliability Tools'. Found: "${title}"`);
    }
    if (title.length < 35 || title.length > 80) {
      warnings.push(`${routePrefix} Title length (${title.length} chars) is outside optimal 40-70 range: "${title}"`);
    }
  }

  // 4. Description check
  if (!route.descriptionTemplate || typeof route.descriptionTemplate !== 'string' || route.descriptionTemplate.trim() === '') {
    errors.push(`${routePrefix} Missing or empty 'descriptionTemplate'.`);
  } else {
    const desc = route.descriptionTemplate.trim();
    if (desc.length < 60 || desc.length > 180) {
      warnings.push(`${routePrefix} Description length (${desc.length} chars) outside optimal 120-160 range.`);
    }
  }

  // 5. Type check
  if (!route.type || !VALID_TYPES.includes(route.type)) {
    errors.push(`${routePrefix} Invalid 'type': "${route.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // 6. Indexable decision check
  if (typeof route.indexable !== 'boolean') {
    errors.push(`${routePrefix} 'indexable' must be a boolean (true/false). Found: ${route.indexable}`);
  }

  // 7. Sitemap priority & changefreq check
  if (typeof route.sitemapPriority !== 'number' || route.sitemapPriority < 0 || route.sitemapPriority > 1.0) {
    errors.push(`${routePrefix} 'sitemapPriority' must be a number between 0.0 and 1.0. Found: ${route.sitemapPriority}`);
  }
  if (!route.changefreq || !VALID_CHANGEFREQ.includes(route.changefreq)) {
    errors.push(`${routePrefix} Invalid 'changefreq': "${route.changefreq}". Must be one of: ${VALID_CHANGEFREQ.join(', ')}`);
  }

  // 8. Schema Types check
  if (!Array.isArray(route.schemaTypes) || route.schemaTypes.length === 0) {
    errors.push(`${routePrefix} 'schemaTypes' must be a non-empty array of schema names.`);
  } else {
    route.schemaTypes.forEach(schema => {
      if (!schema || typeof schema !== 'string') {
        errors.push(`${routePrefix} Invalid schema type in array: ${JSON.stringify(schema)}`);
      }
    });
  }

  // 9. Breadcrumbs check
  if (!Array.isArray(route.breadcrumbs) || route.breadcrumbs.length === 0) {
    errors.push(`${routePrefix} 'breadcrumbs' must be a non-empty array of { name, path } items.`);
  } else {
    // First breadcrumb must always be Home
    if (route.breadcrumbs[0].path !== '/' || route.breadcrumbs[0].name !== 'Home') {
      errors.push(`${routePrefix} First breadcrumb must be { name: 'Home', path: '/' }. Found: ${JSON.stringify(route.breadcrumbs[0])}`);
    }
    // Last breadcrumb path should match route path
    const lastCrumb = route.breadcrumbs[route.breadcrumbs.length - 1];
    if (lastCrumb.path !== route.path) {
      warnings.push(`${routePrefix} Last breadcrumb path ("${lastCrumb.path}") does not match route path ("${route.path}").`);
    }
    // Every item check
    route.breadcrumbs.forEach((crumb, cIdx) => {
      if (!crumb.name || !crumb.path) {
        errors.push(`${routePrefix} Breadcrumb at index ${cIdx} is missing 'name' or 'path': ${JSON.stringify(crumb)}`);
      }
    });
  }
});

// Print Warnings if any
if (warnings.length > 0) {
  console.warn(`⚠️  SEO AUDIT WARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.warn(`   • ${w}`));
  console.warn('');
}

// Check Failures
if (errors.length > 0) {
  console.error(`❌ SEO AUDIT FAILED WITH ${errors.length} CRITICAL ERROR(S):`);
  errors.forEach(err => console.error(`   🚨 ${err}`));
  console.error('\nBuild aborted. Fix the routes-registry entries above to continue.\n');
  process.exit(1);
}

// Print Success Breakdown
const typeBreakdown = ROUTES_REGISTRY.reduce((acc, r) => {
  acc[r.type] = (acc[r.type] || 0) + 1;
  return acc;
}, {});

const indexableCount = ROUTES_REGISTRY.filter(r => r.indexable).length;
const nonIndexableCount = ROUTES_REGISTRY.filter(r => !r.indexable).length;

console.log('✅ ALL SEO AUDIT CHECKS PASSED:');
console.log(`   • Total Routes Registered: ${ROUTES_REGISTRY.length}`);
console.log(`   • 100% Unique Titles: Verified (${seenTitles.size} unique titles)`);
console.log(`   • Indexable Routes for Sitemap: ${indexableCount}`);
console.log(`   • Non-Indexable / Protected Routes: ${nonIndexableCount}`);
console.log(`   • Route Types Breakdown:`);
Object.entries(typeBreakdown).forEach(([type, count]) => {
  console.log(`      - ${type.padEnd(10)}: ${count}`);
});
console.log('====================================================\n');
process.exit(0);
