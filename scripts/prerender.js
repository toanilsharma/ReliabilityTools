const fs = require('fs');
const path = require('path');
const http = require('http');

const { ROUTES_REGISTRY, BASE_URL, getRouteByPath } = require('../routes-registry.js');
const DIST_DIR = path.resolve(__dirname, '../dist');

// Derive all routes directly from single source of truth
const ROUTES = ROUTES_REGISTRY.map(r => r.path);

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSeoForRoute(route) {
  const regEntry = getRouteByPath(route);
  if (regEntry) {
    return {
      title: regEntry.titleTemplate,
      description: regEntry.descriptionTemplate,
      canonical: `${BASE_URL}${regEntry.path}`,
      indexable: regEntry.indexable,
      schemaTypes: regEntry.schemaTypes,
      breadcrumbs: regEntry.breadcrumbs,
      type: regEntry.type,
      path: regEntry.path
    };
  }

  const normalized = route.endsWith('/') ? route : `${route}/`;
  return {
    title: 'Industrial Reliability Engineering Tools | Reliability Tools',
    description: 'Free industrial reliability engineering calculators for MTBF, Weibull analysis, FMEA, OEE, Availability, RBD, and PM optimization.',
    canonical: `${BASE_URL}${normalized}`,
    indexable: true,
    breadcrumbs: [{ name: 'Home', path: '/' }],
    type: 'utility',
    path: normalized
  };
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

  // 3. Inject Canonical Tag and hreflang alternates
  html = html.replace(/<link\s+rel="alternate"\s+href=".*?"\s+hreflang=".*?"\s*\/?>/gi, '');
  const canonicalAndHreflang = `<link rel="canonical" href="${seo.canonical}" data-rh="true" />
  <link rel="alternate" href="${seo.canonical}" hreflang="en" data-rh="true" />
  <link rel="alternate" href="${seo.canonical}" hreflang="x-default" data-rh="true" />`;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, canonicalAndHreflang);
  } else {
    html = html.replace('</head>', `  ${canonicalAndHreflang}\n</head>`);
  }

  // 4. Remove default OG and Twitter meta tags from template to avoid duplicates
  html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']twitter:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');

  const isGameRoute = seo.type === 'game' || (normalizedRoute.startsWith('/play/') && normalizedRoute !== '/play/');

  const DYNAMIC_OG_PATHS = {
    '/play/': `${BASE_URL}/og/play-hub.png`,
    '/play/uptime-tycoon/': `${BASE_URL}/og/uptime-tycoon.png`,
    '/play/termle/': `${BASE_URL}/og/termle.png`,
    '/play/guess-the-beta/': `${BASE_URL}/og/guess-the-beta.png`,
    '/play/rca-detective/': `${BASE_URL}/og/rca-detective.png`,
    '/play/flashcards/': `${BASE_URL}/og/flashcards.png`,
    '/skill-test/': `${BASE_URL}/og/skill-test.png`,
    '/tools/duval-triangle/': `${BASE_URL}/og/duval-triangle.png`,
    '/tools/lopa/': `${BASE_URL}/og/lopa.png`,
    '/tools/miners-rule/': `${BASE_URL}/og/miners-rule.png`,
    '/tools/error-budget/': `${BASE_URL}/og/error-budget.png`,
    '/tools/api-570/': `${BASE_URL}/og/api-570.png`,
    '/tools/npsh/': `${BASE_URL}/og/npsh.png`,
    '/tools/parts-count-mtbf/': `${BASE_URL}/og/parts-count-mtbf.png`,
    '/tools/eafor/': `${BASE_URL}/og/eafor.png`,
    '/tools/pf-optimizer/': `${BASE_URL}/og/pf-optimizer.png`,
    '/tools/cpm-turnaround/': `${BASE_URL}/og/cpm-turnaround.png`,
    '/failure-museum/': `${BASE_URL}/og/failure-museum.png`,
    '/events/': `${BASE_URL}/og/events.png`,
    '/benchmarks/': `${BASE_URL}/og/benchmarks.png`,
    '/api/': `${BASE_URL}/og/api-docs.png`
  };

  const BRANDED_FALLBACKS = {
    tool: `${BASE_URL}/og/tool-fallback.png`,
    article: `${BASE_URL}/og/article-fallback.png`,
    industry: `${BASE_URL}/og/industry-fallback.png`,
    ugc: `${BASE_URL}/og/failure-museum.png`,
    event: `${BASE_URL}/og/events.png`,
    game: `${BASE_URL}/og/play-hub.png`,
    utility: `${BASE_URL}/og/default-fallback.png`,
    legal: `${BASE_URL}/og/default-fallback.png`
  };

  const ogImageUrl = DYNAMIC_OG_PATHS[normalizedRoute] || BRANDED_FALLBACKS[seo.type] || `${BASE_URL}/og/default-fallback.png`;
  const ogType = (seo.type === 'article' || seo.type === 'ugc') ? 'article'
    : (seo.type === 'game' || normalizedRoute.startsWith('/play/')) ? 'game'
    : 'website';

  const socialMeta = `
  <!-- SEO & Social Sharing (Pre-rendered) -->
  <meta property="og:title" content="${escapeHtml(seo.title)}" data-rh="true" />
  <meta property="og:description" content="${escapeHtml(seo.description)}" data-rh="true" />
  <meta property="og:url" content="${seo.canonical}" data-rh="true" />
  <meta property="og:type" content="${ogType}" data-rh="true" />
  <meta property="og:site_name" content="Reliability Tools" data-rh="true" />
  <meta property="og:image" content="${ogImageUrl}" data-rh="true" />
  <meta name="twitter:card" content="summary_large_image" data-rh="true" />
  <meta name="twitter:title" content="${escapeHtml(seo.title)}" data-rh="true" />
  <meta name="twitter:description" content="${escapeHtml(seo.description)}" data-rh="true" />
  <meta name="twitter:image" content="${ogImageUrl}" data-rh="true" />
  <meta name="robots" content="${seo.indexable === false ? 'noindex, follow' : 'index, follow'}" data-rh="true" />`;

  html = html.replace('</head>', `${socialMeta}\n</head>`);

  // 5. Inject Structured Data JSON-LD Schemas from route registry
  const breadcrumbItems = (seo.breadcrumbs && seo.breadcrumbs.length > 0)
    ? seo.breadcrumbs
    : [{ name: 'Home', path: '/' }];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": c.name,
      "item": `${BASE_URL}${c.path === '/' ? '' : c.path}`
    }))
  };

  let schemas = [breadcrumbSchema];

  // Per-game enrichment data for unique pre-rendered landing shells & FAQPage schemas
  const GAME_ENRICHMENT = {
    '/play/': {
      category: 'Interactive Suite',
      howToPlay: [
        'Select from 5 interactive educational games: plant management simulation, daily vocabulary guessing, Weibull estimation, failure forensics, or spaced repetition flashcards.',
        'Play directly in your browser with zero registration or downloads. All scores, streaks, and simulation states save automatically in local storage.',
        'Track your high scores, extend daily study streaks, and benchmark your engineering competence.'
      ],
      whatYouLearn: 'Asset degradation physics, Weibull parameter intuition, Root Cause Analysis (RCA), maintenance optimization trade-offs, and standard ISO 14224 terminology.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, the Reliability Engineering Play Hub and all included games are 100% free with no sign-up, subscriptions, or paywalls.' },
        { q: 'Do I need to create an account?', a: 'No account required. All scores, streaks, and saved states are preserved privately in your browser local storage.' },
        { q: 'What will I learn from the Play Hub?', a: 'You will master asset failure dynamics, Weibull distribution physics, Root Cause Analysis (RCA), preventive maintenance trade-offs, and ISO 14224 terminology.' }
      ]
    },
    '/play/uptime-tycoon/': {
      category: 'Plant Reliability Simulation Game',
      howToPlay: [
        'Take command as Plant Reliability Director over a 10-asset manufacturing fleet (Crushers, Pumps, Kilns, Compressors, etc.) across 24 simulated operating months.',
        'Assign maintenance strategies per asset: Run-to-Failure (RTF), Time-Based PM, Condition-Based PdM (IoT sensor monitoring), or Capital Redesign.',
        'Respond to P-F curve degradation warnings before catastrophic secondary damage occurs.',
        'Maximize cumulative plant profit, maintain high availability and OEE, and receive an end-of-game strategy debrief certificate.'
      ],
      whatYouLearn: 'Asset degradation curves, Weibull shape (beta) and scale (eta) dynamics, economic trade-offs of preventive vs corrective repairs, sensor ROI, and overall plant availability modeling.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, Uptime Tycoon is 100% free with no subscription or hidden charges. Built for maintenance professionals and engineering students.' },
        { q: 'Do I need to create an account?', a: 'No account or login is required. All plant states, monthly turns, and certificate cards save locally in your browser.' },
        { q: 'What will I learn from Uptime Tycoon?', a: 'You will learn asset degradation dynamics, Weibull distribution physics (beta and eta), P-F curve detection intervals, preventive maintenance scheduling, predictive sensor ROI, and balance sheet plant profit optimization across 24 operating months.' }
      ]
    },
    '/play/termle/': {
      category: 'Daily Word Guesser',
      howToPlay: [
        'Guess the hidden 4-to-7 letter reliability engineering term in 6 attempts.',
        'Colored tile feedback guides your next guess: Green (correct letter & position), Yellow (letter in word, wrong position), Gray (letter not in word).',
        'Unlock progressive category clues and glossary definitions if you get stuck.',
        'Extend your daily streak flame 🔥 and generate an emoji result grid to share with colleagues.'
      ],
      whatYouLearn: 'Standard reliability engineering taxonomy, ISO 14224 definitions, statistical failure metrics (MTBF, MTTF, MTTR), functional safety terminology, and RCM concepts.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, Termle is completely free with a new puzzle released every day at midnight.' },
        { q: 'Do I need to create an account?', a: 'No account or login is required. Your streak, guess distribution, and win percentage save locally in your browser.' },
        { q: 'What will I learn from Termle?', a: 'You will master standard ISO 14224 and IEEE reliability engineering terminology, MTBF definitions, failure rate metrics, and maintenance concepts through daily word puzzles.' }
      ]
    },
    '/play/guess-the-beta/': {
      category: 'Weibull Histogram Challenge',
      howToPlay: [
        'Analyze 70 simulated time-to-failure data points plotted on an equipment failure frequency histogram.',
        'Estimate the Weibull Shape Parameter (β): choose whether the asset exhibits infant mortality (β < 1), random failures (β ≈ 1), or wear-out (β > 1).',
        'Estimate the Characteristic Scale Life (η): predict the 63.2% cumulative failure time.',
        'Score up to 1,000 points per round (5,000 max) and read the physics explanation of the failure mode.'
      ],
      whatYouLearn: 'Visual and mathematical intuition for Weibull distribution shapes, the bathtub curve phases, characteristic life determination, and real-world failure mode identification.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, Guess the Beta is completely free with unlimited replays.' },
        { q: 'Do I need to create an account?', a: 'No account required. Your personal best scores and accuracy ratings are preserved in local browser storage.' },
        { q: 'What will I learn from Guess the Beta?', a: 'You will train your visual and statistical intuition for estimating Weibull shape parameters (infant mortality beta < 1, random failure beta = 1, wear-out beta > 1) and characteristic scale life from equipment breakdown histograms.' }
      ]
    },
    '/play/rca-detective/': {
      category: 'Forensic Failure Mystery Game',
      howToPlay: [
        'Review the breakdown case dossier, equipment nameplate, and failure chronology.',
        'Inspect forensic evidence files: vibration FFT spectra, lubricating oil spectrometry, operator interviews, and SEM fractography micrographs.',
        'Construct the 5-Why deduction cascade connecting symptoms to physical mechanism, human action, and latent organizational root causes.',
        'Submit your findings to receive an investigative competency grade and corrective action summary.'
      ],
      whatYouLearn: 'Root Cause Analysis (RCA) methodology, distinguishing physical vs human vs latent systemic causes, oil analysis interpretation, vibration signature analysis, and the 5-Why problem solving framework.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, RCA Detective is 100% free with full forensic case files accessible.' },
        { q: 'Do I need to create an account?', a: 'No registration required. Case completion badges, detective grades, and scores save in your browser.' },
        { q: 'What will I learn from RCA Detective?', a: 'You will master Root Cause Analysis (RCA) methodology, distinguishing physical failure causes, human actions, and latent organizational root causes through interactive 5-Why analysis and real-world failure dossiers.' }
      ]
    },
    '/play/flashcards/': {
      category: 'Spaced Repetition Retention Engine',
      howToPlay: [
        'Read the prompt card face and actively recall the reliability formula or definition.',
        'Flip the 3D card (Spacebar or click) to check the verified answer and mathematical formula.',
        'Rate your recall ease (Again, Hard, Good, Easy) to schedule optimal future review intervals via the SuperMemo SM-2 algorithm.',
        'Study daily to keep your study streak flame 🔥 alive and transfer knowledge to permanent long-term memory.'
      ],
      whatYouLearn: 'Formulas and definitions for MTBF, MTTF, MTTR, Availability, PFDavg, SIL, RPN, Weibull parameters, RCM decision logic, and ISO standards.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, 100% free with full access to all 50+ reliability flashcards.' },
        { q: 'Do I need to create an account?', a: 'No login required. SM-2 review intervals, ease factors, and study streaks are stored locally.' },
        { q: 'What will I learn from Flashcards?', a: 'You will retain 50+ critical reliability formulas and definitions through the SuperMemo SM-2 spaced repetition memory algorithm with active recall.' }
      ]
    },
    '/skill-test/': {
      category: 'Certification Mock Exam & Quiz',
      howToPlay: [
        'Click Start Mock Exam to launch the 20-question timed practice assessment.',
        'Answer questions covering Weibull modeling, MTBF calculations, FMEA RPN, RBD redundancy, and maintenance strategies.',
        'Receive immediate answer rationales, reference formulas, and a personalized competency score report.'
      ],
      whatYouLearn: 'Benchmark readiness for CRE, CMRP, and industrial maintenance certifications with rigorous quantitative and conceptual questions.',
      faqs: [
        { q: 'Is it free to play?', a: 'Yes, the mock exam and certification assessment is 100% free.' },
        { q: 'Do I need to create an account?', a: 'No account required. Quiz results and printable certificates are generated directly in your browser.' },
        { q: 'What will I learn from this mock exam?', a: 'You will benchmark your professional reliability engineering competency across Weibull modeling, FMEA, RBD redundancy, and maintenance strategies against global engineering standards.' }
      ]
    }
  };

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
  const toolEnrichment = toolSlug ? TOOL_ENRICHMENT[toolSlug] : null;
  const gameEnrichment = GAME_ENRICHMENT[normalizedRoute] || null;

  // WebApplication Schema for Tools
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
      "author": { 
        "@type": "Person", 
        "name": "Anil Sharma",
        "url": "https://www.linkedin.com/in/toanilsharma/",
        "sameAs": ["https://www.linkedin.com/in/toanilsharma/"]
      },
      "publisher": { "@type": "Organization", "name": "Reliability Tools", "url": BASE_URL }
    });

    if (toolEnrichment && toolEnrichment.faqs && toolEnrichment.faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": toolEnrichment.faqs.map(faq => ({
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

  // ItemList Schema for /play/ Hub
  if (normalizedRoute === '/play/' || (seo.schemaTypes && seo.schemaTypes.includes('ItemList'))) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Reliability Engineering Games & Simulation Suite",
      "description": "Interactive educational games and diagnostic simulation puzzles for maintenance and reliability engineers.",
      "numberOfItems": 5,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Uptime Tycoon", "url": `${BASE_URL}/play/uptime-tycoon/`, "description": "24-month plant reliability and maintenance strategy simulator." },
        { "@type": "ListItem", "position": 2, "name": "Termle", "url": `${BASE_URL}/play/termle/`, "description": "Daily 6-attempt reliability terminology word challenge." },
        { "@type": "ListItem", "position": 3, "name": "Guess the Beta", "url": `${BASE_URL}/play/guess-the-beta/`, "description": "Weibull failure distribution histogram parameter estimation game." },
        { "@type": "ListItem", "position": 4, "name": "RCA Detective", "url": `${BASE_URL}/play/rca-detective/`, "description": "Root cause failure mystery investigation with forensic evidence dossiers." },
        { "@type": "ListItem", "position": 5, "name": "Glossary Flashcards", "url": `${BASE_URL}/play/flashcards/`, "description": "SuperMemo SM-2 spaced-repetition glossary review system." }
      ]
    });
  }

  // Game & VideoGame Schema for Game Pages
  if (seo.schemaTypes && (seo.schemaTypes.includes('Game') || seo.schemaTypes.includes('VideoGame'))) {
    const cleanGameName = seo.title.split('–')[0].split('|')[0].trim();
    schemas.push({
      "@context": "https://schema.org",
      "@type": ["Game", "VideoGame", "SoftwareApplication"],
      "name": cleanGameName,
      "headline": seo.title.replace(/\s*\|\s*Reliability Tools$/, ''),
      "description": seo.description,
      "url": seo.canonical,
      "genre": ["Simulation", "Educational", "Engineering Strategy"],
      "gamePlatform": ["Web Browser", "Desktop", "Mobile"],
      "applicationCategory": "Game",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": { "@type": "Organization", "name": "Reliability Tools", "url": BASE_URL, "logo": `${BASE_URL}/social-preview.png` }
    });
  }

  // Quiz Schema for Mock Exam
  if (seo.schemaTypes && seo.schemaTypes.includes('Quiz')) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Quiz",
      "name": seo.title.replace(/\s*\|\s*Reliability Tools$/, ''),
      "description": seo.description,
      "url": seo.canonical,
      "educationalLevel": "Professional / Engineering",
      "about": { "@type": "Thing", "name": "Industrial Reliability Engineering Certification" },
      "provider": { "@type": "Organization", "name": "Reliability Tools", "url": BASE_URL }
    });
  }

  // FAQPage Schema for Games and Mock Exams
  if (gameEnrichment && gameEnrichment.faqs && gameEnrichment.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": gameEnrichment.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  const schemaTags = schemas.map(s => `  <script type="application/ld+json" data-rh="true">${JSON.stringify(s)}</script>`).join('\n');
  html = html.replace('</head>', `${schemaTags}\n</head>`);

  // 6. Generate Semantic Body Content inside Landing Shell
  let landingShellHtml = '';
  if (gameEnrichment) {
    const howToPlayList = gameEnrichment.howToPlay.map((step, idx) => `
      <li style="margin-bottom: 0.75rem; line-height: 1.6; display: flex; align-items: flex-start; gap: 0.75rem;">
        <span style="background: #0284c7; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; flex-shrink: 0; margin-top: 2px;">${idx + 1}</span>
        <span>${escapeHtml(step)}</span>
      </li>
    `).join('\n');

    const faqAccordion = gameEnrichment.faqs.map(faq => `
      <details style="border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 0.5rem; background: #ffffff;">
        <summary style="padding: 0.85rem 1rem; cursor: pointer; font-weight: 700; color: #0f172a; font-size: 0.95rem;">${escapeHtml(faq.q)}</summary>
        <div style="padding: 0 1rem 0.85rem 1rem; color: #475569; line-height: 1.6; font-size: 0.9rem;">${escapeHtml(faq.a)}</div>
      </details>
    `).join('\n');

    landingShellHtml = `
      <section style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
        <div style="display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
          ${escapeHtml(gameEnrichment.category)}
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">How to Play</h2>
        <ol style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          ${howToPlayList}
        </ol>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">What You Will Learn</h3>
        <p style="color: #334155; line-height: 1.6; font-size: 0.95rem; margin: 0;">
          ${escapeHtml(gameEnrichment.whatYouLearn)}
        </p>
      </section>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">Frequently Asked Questions</h2>
        ${faqAccordion}
      </section>
    `;
  } else if (toolEnrichment) {
    const standardsList = toolEnrichment.standards.map(s => `<li style="margin-bottom: 0.25rem;"><strong>${escapeHtml(s.split('(')[0].trim())}</strong>${s.includes('(') ? ' — ' + escapeHtml(s.split('(')[1].replace(')', '')) : ''}</li>`).join('\n          ');
    const faqHtml = toolEnrichment.faqs.map(faq => `
        <details style="border: 1px solid #e2e8f0; border-radius: 0.5rem; margin-bottom: 0.5rem; background: #ffffff;">
          <summary style="padding: 0.75rem 1rem; cursor: pointer; font-weight: 700; color: #0f172a; font-size: 0.95rem;">${escapeHtml(faq.q)}</summary>
          <div style="padding: 0 1rem 0.75rem 1rem; color: #475569; line-height: 1.6; font-size: 0.9rem;">${escapeHtml(faq.a)}</div>
        </details>`).join('\n');

    landingShellHtml = `
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #0c4a6e; margin-bottom: 0.75rem;">Core Formula</h2>
        <p style="font-family: 'Courier New', monospace; font-size: 1rem; font-weight: 600; color: #0369a1; background: #fff; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #bae6fd;">${escapeHtml(toolEnrichment.formula)}</p>
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
    landingShellHtml = `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Engineering Tool Overview & Calculation Engine
        </h2>
        <p style="color: #334155; line-height: 1.6; margin-bottom: 1rem;">
          This industrial reliability resource enables reliability engineers, maintenance managers, and plant analysts to model component lifespan, calculate failure probability, and optimize preventive maintenance intervals.
        </p>
        <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
          Compliant with international standards: <strong>ISO 14224</strong> (Taxonomy & Failure Collection), <strong>IEC 61508</strong> (Functional Safety), and <strong>AIAG &amp; VDA FMEA</strong>.
        </p>
      </div>`;
  }

  // 7. Inject Semantic Content into <noscript> and #root
  if (route !== '/') {
    const breadcrumbHtml = `
      <nav aria-label="Breadcrumb" style="font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem;">
        ${breadcrumbItems.map((c, idx) => {
          const isLast = idx === breadcrumbItems.length - 1;
          if (isLast) return `<span>${escapeHtml(c.name)}</span>`;
          return `<a href="${c.path === '/' ? '/' : c.path}" style="color: #0284c7; text-decoration: none;">${escapeHtml(c.name)}</a> &gt; `;
        }).join('')}
      </nav>
    `;

    const fullLandingHtml = `
      <div class="landing-shell-container" style="max-width: 1100px; margin: 1.5rem auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        ${breadcrumbHtml}
        <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.2; color: #0f172a; margin-bottom: 1rem;">
          ${escapeHtml(seo.title.split('|')[0].trim())}
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.6; color: #475569; margin-bottom: 2rem;">
          ${escapeHtml(seo.description)}
        </p>
        ${landingShellHtml}
      </div>
    `;

    // Replace noscript
    const semanticNoscript = `<noscript>${fullLandingHtml}</noscript>`;
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, semanticNoscript);

    // If game or play route, also inject the landing shell inside #root alongside hidden loader
    // This allows crawlers reading the DOM before JS executes to index full H1, how-to-play, FAQs!
    // React replaces #root cleanly upon client hydration/mount.
    if (isGameRoute || normalizedRoute === '/play/' || normalizedRoute === '/skill-test/') {
      const rootShell = `
  <div id="root">
    <div class="initial-loader" style="display:none;" aria-hidden="true"></div>
    ${fullLandingHtml}
  </div>`;
      html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, rootShell);
    }
  }

  return html;
}

/**
 * Pure Node.js static generator that runs on all environments (Local and CI/Netlify)
 */
function runStaticGenerator() {
  console.log('Running Universal Static HTML Pre-renderer...');
  let templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  // Strip any existing pre-rendered SEO & Schema blocks so multiple runs don't stack
  templateHtml = templateHtml.replace(/<!-- SEO & Social Sharing \(Pre-rendered\) -->[\s\S]*?(?=<script|<link|<\/head>)/gi, '');
  templateHtml = templateHtml.replace(/<script type="application\/ld\+json" data-rh="true">[\s\S]*?<\/script>/gi, '');

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
