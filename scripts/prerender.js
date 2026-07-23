const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = 4567;

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/downloads',
  '/tools',
  '/mtbf-calculator',
  '/weibull-analysis',
  '/fmea-tool',
  '/oee-calculator',
  '/tools/mtbf-calculator',
  '/tools/weibull-calculator',
  '/tools/availability-calculator',
  '/tools/mttr-calculator',
  '/tools/reliability-calculator',
  '/tools/failure-rate-calculator',
  '/tools/system-reliability',
  '/tools/k-out-of-n',
  '/tools/sample-size',
  '/tools/pm-optimization',
  '/tools/rbd',
  '/tools/availability',
  '/tools/mttr',
  '/tools/pm',
  '/tools/spares',
  '/tools/lcc',
  '/tools/test-planner',
  '/tools/assessment',
  '/tools/converter',
  '/tools/optimal-replacement',
  '/tools/eoq',
  '/tools/sil',
  '/tools/confidence-interval',
  '/tools/hazard-rate',
  '/tools/validator',
  '/tools/fishbone',
  '/tools/fta',
  '/tools/markov',
  '/tools/growth',
  '/tools/warranty',
  '/tools/cost-risk',
  '/tools/gearbox',
  '/tools/lubricant-life',
  '/learning',
  '/knowledge-hub',
  '/interactive-hub',
  '/faq',
  '/reliability-engineering-glossary',
  '/methodology',
  '/skill-test'
];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.woff2': return 'font/woff2';
    default: return 'application/octet-stream';
  }
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      let filePath = path.join(DIST_DIR, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // Fallback to dist/index.html for SPA routes
        const indexPath = path.join(DIST_DIR, 'index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      }
    });

    server.listen(PORT, () => {
      console.log(`Prerender server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('Starting prerendering process...');
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const route of ROUTES) {
    const targetUrl = `http://localhost:${PORT}${route}`;

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Wait until initial loader disappears
      await page.waitForFunction(() => !document.querySelector('.initial-loader'), { timeout: 10000 });
      
      // Wait an additional 500ms for Helmet & React renders to finalize
      await new Promise(r => setTimeout(r, 500));

      let html = await page.content();

      let outDir;
      let outFile;

      if (route === '/') {
        outDir = DIST_DIR;
        outFile = path.join(DIST_DIR, 'index.html');
      } else {
        const routeSegments = route.split('/').filter(Boolean);
        outDir = path.join(DIST_DIR, ...routeSegments);
        outFile = path.join(outDir, 'index.html');
      }

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, html, 'utf8');
      console.log(` Saved ${route} -> ${path.relative(DIST_DIR, outFile)}`);
    } catch (err) {
      console.error(` Error prerendering ${route}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('Prerendering completed successfully for all routes!');
}

prerender().catch(err => {
  console.error('Fatal prerender error:', err);
  process.exit(1);
});
