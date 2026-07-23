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
  const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      let filePath = path.join(DIST_DIR, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // Fallback to original SPA template index.html in memory
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(templateHtml);
      }
    });

    server.listen(0, () => {
      const port = server.address().port;
      console.log(`Prerender server running on http://localhost:${port}`);
      resolve({ server, port });
    });
  });
}

async function prerender() {
  console.log('Starting prerendering process...');
  const { server, port } = await startServer();
  const chromePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ].find(p => fs.existsSync(p));

  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
  if (chromePath) {
    console.log(`Using browser engine at: ${chromePath}`);
    launchOptions.executablePath = chromePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('PAGE CONSOLE ERROR:', msg.text());
  });
  await page.setViewport({ width: 1280, height: 800 });

  for (const route of ROUTES) {
    const targetUrl = `http://localhost:${port}${route}`;

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Wait until initial loader disappears
      await page.waitForFunction(() => !document.querySelector('.initial-loader'), { timeout: 30000 });
      
      // Wait an additional 500ms for Helmet & React renders to finalize
      await new Promise(r => setTimeout(r, 500));

      let html = await page.content();
      if (route === '/') {
        console.log('DEBUG / ROUTE -> Has wizard:', html.includes('quick-start-wizard'), '| Has proof:', html.includes('10,000+ engineers'));
      }

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
