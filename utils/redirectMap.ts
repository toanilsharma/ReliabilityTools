/**
 * Centralized Redirect Map for Reliability Tools
 * Maps legacy, duplicate, root-level, and alias URLs to their canonical /tools/[slug]/ path (with trailing slash).
 */

export const REDIRECT_MAP: Record<string, string> = {
  // Legacy / Duplicate MTBF routes
  '/mtbf': '/tools/mtbf/',
  '/mtbf-calculator': '/tools/mtbf/',
  '/tools/mtbf': '/tools/mtbf/',
  '/tools/mtbf-calculator': '/tools/mtbf/',
  '/tools/mtbf-calculator/': '/tools/mtbf/',
  '/tools/reliability-calculator': '/tools/mtbf/',
  '/tools/reliability-calculator/': '/tools/mtbf/',

  // Legacy / Duplicate MTTR routes
  '/mttr': '/tools/mttr/',
  '/mttr-calculator': '/tools/mttr/',
  '/tools/mttr': '/tools/mttr/',
  '/tools/mttr-calculator': '/tools/mttr/',
  '/tools/mttr-calculator/': '/tools/mttr/',

  // Legacy / Duplicate RBD routes
  '/rbd': '/tools/rbd/',
  '/tools/rbd': '/tools/rbd/',

  // Legacy / Duplicate PM routes
  '/pm': '/tools/pm/',
  '/pm-optimization': '/tools/pm/',
  '/tools/pm': '/tools/pm/',
  '/tools/pm-optimization': '/tools/pm/',
  '/tools/pm-optimization/': '/tools/pm/',

  // Legacy / Duplicate OEE routes
  '/oee': '/tools/oee/',
  '/oee-calculator': '/tools/oee/',
  '/tools/oee': '/tools/oee/',
  '/tools/oee-calculator': '/tools/oee/',
  '/tools/oee-calculator/': '/tools/oee/',

  // Legacy / Duplicate Availability routes
  '/availability': '/tools/availability/',
  '/tools/availability': '/tools/availability/',
  '/tools/availability-calculator': '/tools/availability/',
  '/tools/availability-calculator/': '/tools/availability/',

  // Legacy / Duplicate FMEA routes
  '/fmea': '/tools/fmea/',
  '/fmea-tool': '/tools/fmea/',
  '/tools/fmea': '/tools/fmea/',
  '/tools/fmea-calculator': '/tools/fmea/',
  '/tools/fmea-calculator/': '/tools/fmea/',

  // Legacy / Duplicate Weibull routes
  '/weibull': '/tools/weibull/',
  '/weibull-analysis': '/tools/weibull/',
  '/tools/weibull': '/tools/weibull/',
  '/tools/weibull-calculator': '/tools/weibull/',
  '/tools/weibull-calculator/': '/tools/weibull/',

  // Additional Root-Level & Alias Tool Routes -> Canonical /tools/[slug]/
  '/spares': '/tools/spares/',
  '/tools/spares': '/tools/spares/',

  '/lcc': '/tools/lcc/',
  '/tools/lcc': '/tools/lcc/',

  '/eoq': '/tools/eoq/',
  '/tools/eoq': '/tools/eoq/',

  '/sil': '/tools/sil/',
  '/tools/sil': '/tools/sil/',

  '/converter': '/tools/converter/',
  '/tools/converter': '/tools/converter/',

  '/test-planner': '/tools/test-planner/',
  '/sample-size': '/tools/test-planner/',
  '/tools/test-planner': '/tools/test-planner/',
  '/tools/sample-size': '/tools/test-planner/',
  '/tools/sample-size/': '/tools/test-planner/',

  '/assessment': '/tools/assessment/',
  '/tools/assessment': '/tools/assessment/',

  '/confidence-interval': '/tools/confidence-interval/',
  '/tools/confidence-interval': '/tools/confidence-interval/',

  '/k-out-of-n': '/tools/k-out-of-n/',
  '/tools/k-out-of-n': '/tools/k-out-of-n/',

  '/hazard-rate': '/tools/hazard-rate/',
  '/failure-rate-calculator': '/tools/hazard-rate/',
  '/tools/hazard-rate': '/tools/hazard-rate/',
  '/tools/failure-rate-calculator': '/tools/hazard-rate/',
  '/tools/failure-rate-calculator/': '/tools/hazard-rate/',

  '/validator': '/tools/validator/',
  '/system-reliability': '/tools/validator/',
  '/tools/validator': '/tools/validator/',
  '/tools/system-reliability': '/tools/validator/',
  '/tools/system-reliability/': '/tools/validator/',

  '/fishbone': '/tools/fishbone/',
  '/tools/fishbone': '/tools/fishbone/',

  '/fta': '/tools/fta/',
  '/tools/fta': '/tools/fta/',

  '/markov': '/tools/markov/',
  '/tools/markov': '/tools/markov/',

  '/growth': '/tools/growth/',
  '/tools/growth': '/tools/growth/',

  '/warranty': '/tools/warranty/',
  '/tools/warranty': '/tools/warranty/',

  '/cost-risk': '/tools/cost-risk/',
  '/tools/cost-risk': '/tools/cost-risk/',

  '/gearbox': '/tools/gearbox/',
  '/tools/gearbox': '/tools/gearbox/',

  '/lubricant-life': '/tools/lubricant-life/',
  '/tools/lubricant-life': '/tools/lubricant-life/',

  '/optimal-replacement': '/tools/optimal-replacement/',
  '/tools/optimal-replacement': '/tools/optimal-replacement/',
};

/**
 * Checks if the current pathname requires a 301 redirect.
 * Returns the target canonical URL string or null if no redirect is required.
 */
export function getRedirectTarget(pathname: string): string | null {
  const normalizedPath = pathname.toLowerCase();
  
  // 1. Direct match in explicit redirect map
  if (REDIRECT_MAP[normalizedPath]) {
    return REDIRECT_MAP[normalizedPath];
  }

  // 2. Trailing slash normalization for any /tools/[slug] without trailing slash
  if (normalizedPath.startsWith('/tools/') && !normalizedPath.endsWith('/')) {
    return `${normalizedPath}/`;
  }

  return null;
}
