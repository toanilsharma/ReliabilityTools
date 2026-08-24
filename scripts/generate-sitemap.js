const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://reliabilitytools.co.in';
const TODAY = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// Canonical URL definitions with metadata rules
const CANONICAL_URLS = [
  // Core / High Priority Pages
  { url: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { url: `${BASE_URL}/tools/`, changefreq: 'monthly', priority: '0.9' },

  // Top 8 Core Tools (0.9 Priority)
  { url: `${BASE_URL}/tools/mtbf/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/mttr/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/weibull/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/fmea/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/oee/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/availability/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/rbd/`, changefreq: 'monthly', priority: '0.9' },
  { url: `${BASE_URL}/tools/pm/`, changefreq: 'monthly', priority: '0.9' },

  // Additional 20 Tools (0.8 Priority)
  { url: `${BASE_URL}/tools/spares/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/lcc/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/test-planner/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/assessment/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/converter/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/optimal-replacement/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/eoq/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/sil/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/confidence-interval/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/k-out-of-n/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/hazard-rate/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/validator/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/fishbone/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/fta/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/markov/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/growth/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/warranty/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/cost-risk/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/gearbox/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/lubricant-life/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/downtime-cost/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/tools/bearing-life/`, changefreq: 'monthly', priority: '0.8' },

  // Content & Hub Pages (Weekly changefreq for content hubs)
  { url: `${BASE_URL}/learning/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/knowledge-hub/`, changefreq: 'weekly', priority: '0.7' },
  { url: `${BASE_URL}/interactive-hub/`, changefreq: 'monthly', priority: '0.7' },
  { url: `${BASE_URL}/downloads/`, changefreq: 'monthly', priority: '0.7' },
  { url: `${BASE_URL}/reliability-engineering-glossary/`, changefreq: 'monthly', priority: '0.7' },

  // Link Magnets & Resource Hubs (0.8 Priority)
  { url: `${BASE_URL}/professors/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/press/`, changefreq: 'monthly', priority: '0.7' },

  // Programmatic SEO Industry Pages (0.8 Priority)
  { url: `${BASE_URL}/industries/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/industries/cement/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/industries/steel/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/industries/automotive/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/industries/pharmaceuticals/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/industries/fmcg/`, changefreq: 'monthly', priority: '0.8' },
  { url: `${BASE_URL}/industries/power-generation/`, changefreq: 'monthly', priority: '0.8' },

  // Learning Articles (Weekly changefreq)
  { url: `${BASE_URL}/learning/mtbf-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/weibull-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/fmea-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/oee-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/spare-parts-optimization-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/mtbf-vs-mttf-vs-mttr-guide/`, changefreq: 'weekly', priority: '0.8' },
  { url: `${BASE_URL}/learning/weibull-analysis-spinning-machines-case-study/`, changefreq: 'weekly', priority: '0.8' },

  // Informational & Legal Pages (0.5 Priority)
  { url: `${BASE_URL}/about/`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/contact/`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/faq/`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/methodology/`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/skill-test/`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/legal/privacy/`, changefreq: 'monthly', priority: '0.3' },
  { url: `${BASE_URL}/legal/terms/`, changefreq: 'monthly', priority: '0.3' },
  { url: `${BASE_URL}/legal/cookies/`, changefreq: 'monthly', priority: '0.3' }
];

function generateSitemapXml() {
  const urlBlocks = CANONICAL_URLS.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Clean, Canonical-Only Sitemap for Reliability Tools -->
  <!-- Generated dynamically on build: ${TODAY} -->

${urlBlocks}

</urlset>
`;
}

function main() {
  const xmlContent = generateSitemapXml();

  // 1. Write to public/sitemap.xml
  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent, 'utf8');
  console.log(`Generated canonical sitemap -> public/sitemap.xml (${CANONICAL_URLS.length} URLs)`);

  // 2. Write to dist/sitemap.xml if dist directory exists
  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, xmlContent, 'utf8');
    console.log(`Generated canonical sitemap -> dist/sitemap.xml (${CANONICAL_URLS.length} URLs)`);
  }
}

main();
