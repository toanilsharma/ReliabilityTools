const fs = require('fs');
const path = require('path');
const { ROUTES_REGISTRY, BASE_URL } = require('../routes-registry.js');

const TODAY = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

function generateSitemapXml() {
  // Only include indexable routes from the single source of truth registry
  const indexableRoutes = ROUTES_REGISTRY.filter(route => route.indexable);

  const urlBlocks = indexableRoutes.map(entry => {
    const loc = `${BASE_URL}${entry.path}`;
    const priority = entry.sitemapPriority.toFixed(1);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlBlocks}
</urlset>`;
}

function writeSitemaps() {
  const xml = generateSitemapXml();
  const indexableCount = ROUTES_REGISTRY.filter(r => r.indexable).length;

  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicPath, xml, 'utf8');
  console.log(`Generated canonical sitemap -> public/sitemap.xml (${indexableCount} URLs from routes-registry)`);

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, xml, 'utf8');
    console.log(`Generated canonical sitemap -> dist/sitemap.xml (${indexableCount} URLs from routes-registry)`);
  }
}

writeSitemaps();
