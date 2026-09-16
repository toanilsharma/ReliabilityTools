const fs = require('fs');
const path = require('path');
const http = require('http');

const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_URL = 'https://reliabilitytools.co.in';

const ROUTES = [
  '/',
  '/about/',
  '/contact/',
  '/downloads/',
  '/tools/',
  '/tools/mtbf/',
  '/tools/weibull/',
  '/tools/rbd/',
  '/tools/availability/',
  '/tools/mttr/',
  '/tools/pm/',
  '/tools/spares/',
  '/tools/lcc/',
  '/tools/oee/',
  '/tools/test-planner/',
  '/tools/assessment/',
  '/tools/converter/',
  '/tools/optimal-replacement/',
  '/tools/eoq/',
  '/tools/sil/',
  '/tools/fmea/',
  '/tools/confidence-interval/',
  '/tools/k-out-of-n/',
  '/tools/hazard-rate/',
  '/tools/validator/',
  '/tools/fishbone/',
  '/tools/fta/',
  '/tools/markov/',
  '/tools/growth/',
  '/tools/warranty/',
  '/tools/cost-risk/',
  '/tools/gearbox/',
  '/tools/lubricant-life/',
  '/tools/downtime-cost/',
  '/tools/bearing-life/',
  '/tools/vibration-severity/',
  '/tools/5-why/',
  '/tools/pareto/',
  '/tools/reliability-allocation/',
  '/tools/spc/',
  '/tools/rcm-decision/',
  '/industries/',
  '/industries/cement/',
  '/industries/steel/',
  '/industries/automotive/',
  '/industries/pharmaceuticals/',
  '/industries/fmcg/',
  '/industries/power-generation/',
  '/professors/',
  '/press/',
  '/learning/',
  '/learning/spare-parts-optimization-guide/',
  '/learning/mtbf-vs-mttf-vs-mttr-guide/',
  '/learning/weibull-analysis-spinning-machines-case-study/',
  '/learning/mtbf-guide/',
  '/learning/weibull-guide/',
  '/learning/fmea-guide/',
  '/learning/oee-guide/',
  '/knowledge-hub/',
  '/interactive-hub/',
  '/faq/',
  '/reliability-engineering-glossary/',
  '/methodology/',
  '/skill-test/',
  '/legal/privacy/',
  '/legal/terms/',
  '/legal/cookies/'
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parses SEO metadata directly from seoConfig.ts
 */
function loadSeoMetadata() {
  const seoPath = path.resolve(__dirname, '../utils/seoConfig.ts');
  const metadata = {};

  try {
    const content = fs.readFileSync(seoPath, 'utf8');
    const regex = /'(\/[^']*)':\s*\{[\s\S]*?title:\s*'([^']+)'[\s\S]*?description:\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const rawRoute = match[1];
      const title = match[2];
      const description = match[3];
      const normalizedRoute = rawRoute.endsWith('/') ? rawRoute : `${rawRoute}/`;
      const canonical = `${BASE_URL}${normalizedRoute}`;

      metadata[normalizedRoute] = { title, description, canonical };
      if (!rawRoute.endsWith('/')) {
        metadata[rawRoute] = { title, description, canonical };
      }
    }
  } catch (err) {
    console.warn('Warning: Could not parse seoConfig.ts, using fallback metadata:', err.message);
  }

  return metadata;
}

const SEO_METADATA = loadSeoMetadata();

function getSeoForRoute(route) {
  const normalized = route.endsWith('/') ? route : `${route}/`;
  if (SEO_METADATA[normalized]) return SEO_METADATA[normalized];
  if (SEO_METADATA[route]) return SEO_METADATA[route];

  // Dynamic fallback
  const segments = route.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';
  const formattedName = lastSegment
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = `${formattedName} | Reliability Engineering Tools`;
  const description = `Free industrial reliability engineering tool for ${formattedName}. Access calculators, formulas, and benchmarks.`;
  const canonical = `${BASE_URL}${normalized}`;

  return { title, description, canonical };
}

/**
 * Generates rich semantic HTML with metadata for crawlers without needing headless browser
 */
function generateStaticHtml(route, templateHtml) {
  const seo = getSeoForRoute(route);
  const normalizedRoute = route.endsWith('/') ? route : `${route}/`;
  const segments = route.split('/').filter(Boolean);
  const pageName = segments[segments.length - 1] || 'Home';
  const readableName = pageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let html = templateHtml;

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);

  // 2. Replace or update <meta name="description">
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${escapeHtml(seo.description)}" data-rh="true" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(seo.description)}" data-rh="true" />\n</head>`);
  }

  // 3. Inject Canonical Tag
  const canonicalTag = `<link rel="canonical" href="${seo.canonical}" data-rh="true" />`;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // 4. Remove default OG and Twitter meta tags from template to avoid duplicates
  html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']twitter:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');

  const socialMeta = `
  <!-- SEO & Social Sharing (Pre-rendered) -->
  <meta property="og:title" content="${escapeHtml(seo.title)}" data-rh="true" />
  <meta property="og:description" content="${escapeHtml(seo.description)}" data-rh="true" />
  <meta property="og:url" content="${seo.canonical}" data-rh="true" />
  <meta property="og:type" content="website" data-rh="true" />
  <meta property="og:site_name" content="Reliability Tools" data-rh="true" />
  <meta property="og:image" content="${BASE_URL}/social-preview.png" data-rh="true" />
  <meta name="twitter:card" content="summary_large_image" data-rh="true" />
  <meta name="twitter:title" content="${escapeHtml(seo.title)}" data-rh="true" />
  <meta name="twitter:description" content="${escapeHtml(seo.description)}" data-rh="true" />
  <meta name="twitter:image" content="${BASE_URL}/social-preview.png" data-rh="true" />
  <meta name="robots" content="index, follow" data-rh="true" />`;

  html = html.replace('</head>', `${socialMeta}\n</head>`);

  // 5. Inject Structured Data JSON-LD Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` }
    ]
  };

  if (segments.length > 0) {
    if (segments[0] === 'tools' && segments.length > 1) {
      breadcrumbSchema.itemListElement.push(
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${BASE_URL}/tools/` },
        { "@type": "ListItem", "position": 3, "name": readableName, "item": seo.canonical }
      );
    } else if (segments[0] === 'learning' && segments.length > 1) {
      breadcrumbSchema.itemListElement.push(
        { "@type": "ListItem", "position": 2, "name": "Learning", "item": `${BASE_URL}/learning/` },
        { "@type": "ListItem", "position": 3, "name": readableName, "item": seo.canonical }
      );
    } else {
      breadcrumbSchema.itemListElement.push(
        { "@type": "ListItem", "position": 2, "name": readableName, "item": seo.canonical }
      );
    }
  }

  let schemas = [breadcrumbSchema];

  // Per-tool enrichment data for unique pre-rendered content
  const TOOL_ENRICHMENT = {
    'mtbf': {
      formula: 'MTBF = Total Operating Time / Number of Failures',
      standards: ['ISO 14224 (Petroleum & gas — Reliability data)', 'MIL-HDBK-217F (Reliability Prediction)'],
      faqs: [
        { q: 'How is MTBF calculated?', a: 'MTBF = Total Operating Time ÷ Number of Failures. For a pump running 8,760 hours with 4 failures, MTBF = 2,190 hours.' },
        { q: 'What is the difference between MTBF and MTTF?', a: 'MTBF applies to repairable systems (e.g., pumps, motors). MTTF applies to non-repairable items (e.g., light bulbs, bearings). Both use the same formula.' },
        { q: 'Can MTBF be higher than equipment design life?', a: 'Yes. MTBF is a statistical average, not a lifespan. An asset with MTBF of 50,000 hours may have a design life of 20,000 hours but fails rarely during that period.' },
      ]
    },
    'weibull': {
      formula: 'R(t) = e^(-(t/η)^β) where β = shape, η = scale',
      standards: ['IEEE 493 (Recommended Practice for Design of Reliable Systems)', 'IEC 61649 (Weibull Analysis)'],
      faqs: [
        { q: 'What does the Weibull shape parameter (Beta) tell you?', a: 'β < 1 indicates infant mortality (early-life failures), β = 1 indicates random failures (exponential), β > 1 indicates wear-out failures. Most industrial equipment has β between 1.5 and 3.5.' },
        { q: 'How many data points do I need for Weibull analysis?', a: 'A minimum of 6–10 failure data points is recommended for reliable Weibull parameter estimation. More data points give more accurate β and η values.' },
      ]
    },
    'availability': {
      formula: 'Availability = MTBF / (MTBF + MTTR) × 100%',
      standards: ['ISO 14224 (Reliability data)', 'IEC 60050 (International Electrotechnical Vocabulary)'],
      faqs: [
        { q: 'What is the difference between inherent and operational availability?', a: 'Inherent availability (Ai) considers only corrective maintenance time. Operational availability (Ao) includes preventive maintenance, logistics, and administrative delays.' },
        { q: 'What is considered good availability?', a: 'World-class manufacturing targets >95% availability. Critical infrastructure (power plants, refineries) often targets >98–99%.' },
      ]
    },
    'fmea': {
      formula: 'RPN = Severity × Occurrence × Detection (1-10 each, max 1000)',
      standards: ['AIAG & VDA FMEA Handbook (2019)', 'SAE J1739', 'IEC 60812 (FMEA Techniques)'],
      faqs: [
        { q: 'What is an acceptable RPN score?', a: 'There is no universal threshold; however, RPNs above 100–125 typically warrant corrective action. The AIAG/VDA 2019 approach uses Action Priority (AP) levels instead of RPN thresholds.' },
        { q: 'What is the difference between Design FMEA and Process FMEA?', a: 'DFMEA analyzes product design failure modes. PFMEA analyzes manufacturing/assembly process failure modes. Both use the same Severity × Occurrence × Detection rating framework.' },
      ]
    },
    'oee': {
      formula: 'OEE = Availability × Performance × Quality',
      standards: ['SEMI E10-0304 (Equipment Reliability)', 'ISO 22400 (Manufacturing Operations Management KPIs)'],
      faqs: [
        { q: 'What is a good OEE score?', a: 'World-class OEE is 85% or higher (Availability ~90%, Performance ~95%, Quality ~99.9%). The global average is around 60%.' },
        { q: 'What is the Hidden Factory concept in OEE?', a: 'The Hidden Factory represents the gap between current OEE and 100% — the unrealized production capacity lost to downtime, slow cycles, and defects.' },
      ]
    },
    'mttr': {
      formula: 'MTTR = Total Repair Time / Number of Repairs',
      standards: ['ISO 14224 (Maintenance data)', 'EN 13306 (Maintenance Terminology)'],
      faqs: [
        { q: 'What affects MTTR?', a: 'Key factors include technician skill level, spare parts availability, equipment accessibility, diagnostic procedures, and administrative/logistics delays.' },
        { q: 'How is MTTR different from MDT?', a: 'MTTR (Mean Time To Repair) covers only active repair time. MDT (Mean Down Time) includes logistics, waiting for spares, and administrative time.' },
      ]
    },
    'sil': {
      formula: 'PFDavg = 1 - e^(-λDU × TI/2) ≈ λDU × TI / 2',
      standards: ['IEC 61508 (Functional Safety of E/E/PE Systems)', 'IEC 61511 (Safety Instrumented Systems for Process Industry)'],
      faqs: [
        { q: 'What are the SIL levels?', a: 'SIL 1: PFD 0.1–0.01, SIL 2: PFD 0.01–0.001, SIL 3: PFD 0.001–0.0001, SIL 4: PFD 0.0001–0.00001. Higher SIL = lower probability of failure on demand.' },
      ]
    },
    'hazard-rate': {
      formula: 'λ(t) = f(t) / R(t) — Instantaneous failure rate',
      standards: ['MIL-HDBK-217F', 'IEC 62380 (Reliability Data Handbook)'],
      faqs: [
        { q: 'What is the Bathtub Curve?', a: 'The hazard rate follows a bathtub shape: high early (infant mortality), low constant middle (useful life), and increasing late (wear-out). This guides maintenance strategies.' },
      ]
    },
    'rbd': {
      formula: 'Series: Rs = R1 × R2 × ... × Rn | Parallel: Rp = 1 - (1-R1)(1-R2)...(1-Rn)',
      standards: ['IEC 61078 (Reliability Block Diagrams)', 'IEEE 493'],
      faqs: [
        { q: 'When should I use RBD vs Fault Tree?', a: 'RBD models success paths (what must work). Fault Trees model failure paths (what can go wrong). Use RBD for system design optimization; use FTA for safety and risk analysis.' },
      ]
    },
    'lcc': {
      formula: 'LCC = Acquisition Cost + Operating Cost + Maintenance Cost + Disposal Cost',
      standards: ['ISO 15663 (Life Cycle Costing in Petroleum & Gas)', 'IEC 60300-3-3 (Dependability Management: LCC)'],
      faqs: [
        { q: 'Why is LCC important?', a: 'Acquisition cost is typically only 10-20% of total life cycle cost. Maintenance, energy, and downtime costs dominate. LCC analysis reveals the true economic impact of asset decisions.' },
      ]
    },
    'spares': {
      formula: 'Poisson: P(X≥1) = 1 - e^(-λt) for spare demand probability',
      standards: ['ISO 14224 (Spare parts taxonomy)', 'API 689 (Collection of reliability data in refineries)'],
      faqs: [
        { q: 'How do I determine the right spare parts stock level?', a: 'Use a Poisson distribution model: calculate expected demand (failures/year × lead time), then determine stock level to achieve target service level (e.g., 95% availability).' },
      ]
    },
  };

  const toolSlug = route.startsWith('/tools/') && route !== '/tools/' ? route.split('/').filter(Boolean)[1] : null;
  const enrichment = toolSlug ? TOOL_ENRICHMENT[toolSlug] : null;

  if (route.startsWith('/tools/') && route !== '/tools/') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": seo.title,
      "url": seo.canonical,
      "description": seo.description,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Person", "name": "Anil Sharma" },
      "publisher": { "@type": "Organization", "name": "Reliability Tools", "url": BASE_URL }
    });

    // FAQPage Schema for rich snippets
    if (enrichment && enrichment.faqs && enrichment.faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": enrichment.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      });
    }
  }

  const schemaTags = schemas.map(s => `  <script type="application/ld+json" data-rh="true">${JSON.stringify(s)}</script>`).join('\n');
  html = html.replace('</head>', `${schemaTags}\n</head>`);

  // 6. Inject Semantic Body Content inside #root for Search Engine Indexing
  // Generate tool-specific enrichment HTML
  let enrichmentHtml = '';
  if (enrichment) {
    const standardsList = enrichment.standards.map(s => `<li style="margin-bottom: 0.25rem;"><strong>${escapeHtml(s.split('(')[0].trim())}</strong>${s.includes('(') ? ' — ' + escapeHtml(s.split('(')[1].replace(')', '')) : ''}</li>`).join('\n          ');
    const faqHtml = enrichment.faqs.map(faq => `
        <details style="border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 0.5rem;">
          <summary style="padding: 0.75rem 1rem; cursor: pointer; font-weight: 700; color: #0f172a; font-size: 0.95rem;">${escapeHtml(faq.q)}</summary>
          <div style="padding: 0 1rem 0.75rem 1rem; color: #475569; line-height: 1.6; font-size: 0.9rem;">${escapeHtml(faq.a)}</div>
        </details>`).join('\n');

    enrichmentHtml = `
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #0c4a6e; margin-bottom: 0.75rem;">Core Formula</h2>
        <p style="font-family: 'Courier New', monospace; font-size: 1rem; font-weight: 600; color: #0369a1; background: #fff; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #bae6fd;">${escapeHtml(enrichment.formula)}</p>
      </div>
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">Governing Standards</h2>
        <ul style="list-style: none; padding: 0; color: #334155; font-size: 0.9rem;">
          ${standardsList}
        </ul>
      </div>
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">Frequently Asked Questions</h2>
        ${faqHtml}
      </div>`;
  } else {
    enrichmentHtml = `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Engineering Tool Overview & Calculation Engine
        </h2>
        <p style="color: #334155; line-height: 1.6; margin-bottom: 1rem;">
          This industrial reliability tool enables reliability engineers, maintenance managers, and plant analysts to model component lifespan, calculate failure probability, and optimize preventive maintenance intervals.
        </p>
        <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
          Compliant with international standards: <strong>ISO 14224</strong> (Taxonomy & Failure Collection), <strong>IEC 61508</strong> (Functional Safety), and <strong>AIAG &amp; VDA FMEA</strong>.
        </p>
      </div>`;
  }

  if (route !== '/') {
    const semanticNoscript = `
  <noscript>
    <div style="max-width: 1100px; margin: 2rem auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
        <a href="/" style="color: #0284c7; text-decoration: none;">Home</a> &gt; 
        ${segments.length > 1 ? `<a href="/${segments[0]}/" style="color: #0284c7; text-decoration: none;">${segments[0].toUpperCase()}</a> &gt; ` : ''}
        <span>${escapeHtml(readableName)}</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.2; color: #0f172a; margin-bottom: 1rem;">
        ${escapeHtml(seo.title.split('|')[0].trim())}
      </h1>
      <p style="font-size: 1.15rem; line-height: 1.6; color: #475569; margin-bottom: 2rem;">
        ${escapeHtml(seo.description)}
      </p>
      ${enrichmentHtml}
    </div>
  </noscript>`;

    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, semanticNoscript);
  }

  return html;
}

/**
 * Pure Node.js static generator that runs on all environments (Local and CI/Netlify)
 */
function runStaticGenerator() {
  console.log('Running Universal Static HTML Pre-renderer...');
  const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

  let generatedCount = 0;
  for (const route of ROUTES) {
    try {
      const renderedHtml = generateStaticHtml(route, templateHtml);
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
      fs.writeFileSync(outFile, renderedHtml, 'utf8');
      generatedCount++;
    } catch (err) {
      console.error(`Failed to pre-render ${route}:`, err.message);
    }
  }

  console.log(`Successfully generated static pre-rendered HTML for ${generatedCount} routes in dist/!`);
}

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
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(templateHtml);
      }
    });

    server.listen(0, () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function runPuppeteerPrerender() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('Puppeteer not installed, using universal static generator.');
    runStaticGenerator();
    return;
  }

  const chromePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ].find(p => fs.existsSync(p));

  if (!chromePath) {
    console.log('No local Chrome/Edge binary found; using universal static generator.');
    runStaticGenerator();
    return;
  }

  console.log(`Starting Puppeteer pre-render using engine at: ${chromePath}`);
  const { server, port } = await startServer();

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const route of ROUTES) {
      const targetUrl = `http://localhost:${port}${route}`;
      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForFunction(() => !document.querySelector('.initial-loader'), { timeout: 20000 });
        await new Promise(r => setTimeout(r, 400));

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
        console.log(` [Puppeteer] Saved ${route} -> ${path.relative(DIST_DIR, outFile)}`);
      } catch (err) {
        console.warn(` [Puppeteer Fallback] Could not load ${route} via browser: ${err.message}. Using static template.`);
        const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
        const fallbackHtml = generateStaticHtml(route, templateHtml);
        const routeSegments = route.split('/').filter(Boolean);
        const outDir = path.join(DIST_DIR, ...routeSegments);
        const outFile = path.join(outDir, 'index.html');
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, fallbackHtml, 'utf8');
      }
    }

    await browser.close();
    server.close();
    console.log('Puppeteer pre-rendering completed successfully!');
  } catch (err) {
    console.error('Puppeteer encountered an error, falling back to static generator:', err.message);
    server.close();
    runStaticGenerator();
  }
}

async function main() {
  // Always run static generator first to ensure 100% of routes have valid, rich HTML files
  runStaticGenerator();

  // If in CI or Netlify, static generation is complete and perfectly optimized
  if (process.env.CI || process.env.NETLIFY) {
    console.log('CI/Netlify build complete. Static HTML files ready for deployment.');
    return;
  }

  // If local and puppeteer flag is explicitly passed, run client-rendered snapshots
  if (process.argv.includes('--puppeteer')) {
    await runPuppeteerPrerender();
  }
}

main().catch(err => {
  console.error('Pre-render script error:', err);
  process.exit(1);
});
