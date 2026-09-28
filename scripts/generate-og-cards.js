const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OG_DIR = path.resolve(__dirname, '../public/og');

const CARDS = [
  {
    fileName: 'play-hub.png',
    badge: 'GAMIFIED TRAINING SUITE',
    badgeColor: '#06b6d4',
    title: 'Reliability Engineering Play Hub',
    subtitle: 'Interactive Simulation Games, Daily Puzzles & Spaced Repetition',
    pills: ['Uptime Tycoon', 'Termle', 'Guess the Beta', 'RCA Detective', 'Flashcards'],
    url: 'reliabilitytools.co.in/play/',
    accentGrad: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    icon: '🎮'
  },
  {
    fileName: 'uptime-tycoon.png',
    badge: 'PLANT RELIABILITY SIMULATION GAME',
    badgeColor: '#06b6d4',
    title: 'Uptime Tycoon',
    subtitle: 'Command a 10-Asset Factory Across 24 Months of Weibull Failure Physics',
    pills: ['Monte-Carlo Failures', 'P-F Curve Warnings', 'PM vs PdM Strategy', 'Plant P&L Debrief'],
    url: 'reliabilitytools.co.in/play/uptime-tycoon/',
    accentGrad: 'linear-gradient(135deg, #22d3ee 0%, #0284c7 100%)',
    icon: '🏭'
  },
  {
    fileName: 'termle.png',
    badge: 'DAILY WORD GUESSER',
    badgeColor: '#f59e0b',
    title: 'Termle',
    subtitle: 'Daily Reliability Engineering Term Guesser in 6 Attempts',
    pills: ['Glossary Clues', 'Letter Feedback Tiles', 'Streak Tracker', 'Daily Share Grid'],
    url: 'reliabilitytools.co.in/play/termle/',
    accentGrad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: '🔥'
  },
  {
    fileName: 'guess-the-beta.png',
    badge: 'WEIBULL HISTOGRAM CHALLENGE',
    badgeColor: '#a855f7',
    title: 'Guess the Beta',
    subtitle: 'Estimate Shape (β) & Scale (η) Across 5 Failure Distribution Rounds',
    pills: ['Simulated Histograms (N=70)', 'Infant vs Wear-out', 'Physics Explanations', '5000 Pts Score'],
    url: 'reliabilitytools.co.in/play/guess-the-beta/',
    accentGrad: 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)',
    icon: '📈'
  },
  {
    fileName: 'rca-detective.png',
    badge: 'FORENSIC FAILURE MYSTERY',
    badgeColor: '#10b981',
    title: 'RCA Detective',
    subtitle: 'Solve Industrial Equipment Breakdown Mysteries with 5-Why Analysis',
    pills: ['SCADA Trends', 'Oil Lab Spectrometry', 'Fractography Evidence', 'Physical & Latent Roots'],
    url: 'reliabilitytools.co.in/play/rca-detective/',
    accentGrad: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    icon: '🔍'
  },
  {
    fileName: 'flashcards.png',
    badge: 'SPACED REPETITION ENGINE',
    badgeColor: '#0ea5e9',
    title: 'Glossary Flashcards',
    subtitle: 'Master 50+ Reliability Terms & Formulas with SuperMemo SM-2',
    pills: ['SM-2 Spaced Algorithm', 'Active Recall Rating', 'Daily Study Streak', 'Keyboard Driven'],
    url: 'reliabilitytools.co.in/play/flashcards/',
    accentGrad: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
    icon: '📚'
  },
  {
    fileName: 'skill-test.png',
    badge: 'PROFESSIONAL CERTIFICATION QUIZ',
    badgeColor: '#ec4899',
    title: 'Reliability Engineer Mock Exam',
    subtitle: '20-Question Timed Diagnostic Assessment with Instant Scorecard',
    pills: ['Weibull & MTBF Math', 'RBD & Redundancy', 'FMEA Risk Priority', 'Detailed Explanations'],
    url: 'reliabilitytools.co.in/skill-test/',
    accentGrad: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
    icon: '🎯'
  },
  {
    fileName: 'duval-triangle.png',
    badge: 'IEC 60599 / IEEE C57.104 DGA',
    badgeColor: '#06b6d4',
    title: 'Duval Triangle Calculator',
    subtitle: 'Dissolved Gas Analysis (DGA) Transformer Fault Classification',
    pills: ['% CH4 / C2H4 / C2H2', 'Ternary SVG Plot', 'Thermal Overheating', 'Arcing & PD Detection'],
    url: 'reliabilitytools.co.in/tools/duval-triangle/',
    accentGrad: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    icon: '⚡'
  },
  {
    fileName: 'lopa.png',
    badge: 'IEC 61511 / CCPS FUNCTIONAL SAFETY',
    badgeColor: '#10b981',
    title: 'LOPA & SIL Determination Calculator',
    subtitle: 'Layer of Protection Analysis and Target Safety Integrity Level (SIL)',
    pills: ['Initiating Frequencies', 'Independent Layers (IPL)', 'Mitigated Event Freq', 'Target SIL Allocation'],
    url: 'reliabilitytools.co.in/tools/lopa/',
    accentGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: '🛡️'
  },
  {
    fileName: 'miners-rule.png',
    badge: 'ISO 12107 / ASTM E1049 FATIGUE',
    badgeColor: '#6366f1',
    title: "Miner's Rule Fatigue Calculator",
    subtitle: 'Palmgren-Miner Linear Cumulative Structural Damage Modeling',
    pills: ['Variable Stress Bins', 'S-N Curve Endurance', 'Damage Summation (D)', 'Remaining Life Factor'],
    url: 'reliabilitytools.co.in/tools/miners-rule/',
    accentGrad: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    icon: '🏗️'
  },
  {
    fileName: 'error-budget.png',
    badge: 'ISO 25010 / IEEE 730 SRE METRICS',
    badgeColor: '#f59e0b',
    title: 'Error Budget SLO Calculator',
    subtitle: 'Site Reliability Engineering Downtime Budgets & Multi-Window Burn Rates',
    pills: ['SLO & Uptime Targets', 'Allowable Outage Min', '14.4x Pager Burn Alerts', 'Feature Freeze Trigger'],
    url: 'reliabilitytools.co.in/tools/error-budget/',
    accentGrad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: '⏱️'
  },
  {
    fileName: 'api-570-remaining-life.png',
    badge: 'API 570 / API 510 PIPING INTEGRITY',
    badgeColor: '#3b82f6',
    title: 'API 570 UT Remaining Life Calculator',
    subtitle: 'Process Piping Ultrasonic Thickness & Half-Life Inspection Intervals',
    pills: ['Short/Long Corrosion Rates', 'Corrosion Allowance', 'Remaining Life Years', 'Half-Life Rule Intervals'],
    url: 'reliabilitytools.co.in/tools/api-570-remaining-life/',
    accentGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    icon: '🔧'
  },
  {
    fileName: 'npsh-cavitation.png',
    badge: 'ANSI/HI 9.6.1 / API 610 HYDRAULICS',
    badgeColor: '#0ea5e9',
    title: 'NPSH Cavitation Calculator',
    subtitle: 'Centrifugal Pump Suction Head & Cavitation Safety Margin Analysis',
    pills: ['NPSHa Available Head', 'Vapor Pressure Correction', 'Cavitation Margin Ratio', 'Erosion Prevention'],
    url: 'reliabilitytools.co.in/tools/npsh-cavitation/',
    accentGrad: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    icon: '💧'
  },
  {
    fileName: 'parts-count-mtbf.png',
    badge: 'MIL-HDBK-217F / TELCORDIA SR-332',
    badgeColor: '#a855f7',
    title: 'Parts-Count MTBF Calculator',
    subtitle: 'Electronic Assembly Reliability & Failure Rate Prediction',
    pills: ['Interactive BOM Input', 'Environmental Factors (πE)', 'Quality Grades (πQ)', 'FITs & MTBF Hours'],
    url: 'reliabilitytools.co.in/tools/parts-count-mtbf/',
    accentGrad: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    icon: '💻'
  },
  {
    fileName: 'eafor.png',
    badge: 'IEEE 762 / NERC GADS UTILITY METRICS',
    badgeColor: '#10b981',
    title: 'EAF & EFOR Availability Calculator',
    subtitle: 'Power Generation Equivalent Availability Factor & Forced Outage Rate',
    pills: ['Equivalent Availability (EAF)', 'Eq. Forced Outages (EFOR)', 'Capacity Derated Hours', 'NERC GADS Benchmarks'],
    url: 'reliabilitytools.co.in/tools/eafor/',
    accentGrad: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    icon: '⚡'
  },
  {
    fileName: 'pf-interval-optimizer.png',
    badge: 'SAE JA1011 / ISO 55000 RCM STANDARDS',
    badgeColor: '#f97316',
    title: 'P-F Interval Optimizer Calculator',
    subtitle: 'Condition Monitoring Inspection Frequencies Along the P-F Curve',
    pills: ['(P-F) / 2 Half-Interval Rule', 'Degradation Warning Time', 'Avoided Breakdown Savings', 'PdM ROI Analysis'],
    url: 'reliabilitytools.co.in/tools/pf-interval-optimizer/',
    accentGrad: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    icon: '📉'
  },
  {
    fileName: 'cpm-turnaround.png',
    badge: 'ISO 21500 / PMI PMBOK TURNAROUND',
    badgeColor: '#ef4444',
    title: 'CPM Turnaround Calculator',
    subtitle: 'Critical Path Method & Shutdown Outage Schedule Optimizer',
    pills: ['Forward/Backward Pass', 'Total Float & Slack', 'Critical Path Detection', 'Schedule Crashing Savings'],
    url: 'reliabilitytools.co.in/tools/cpm-turnaround/',
    accentGrad: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    icon: '📅'
  },
  {
    fileName: 'failure-museum.png',
    badge: 'FORENSIC DISASTER ARCHIVE',
    badgeColor: '#f43f5e',
    title: 'The Industrial Failure Museum',
    subtitle: 'Forensic Case Studies of Historic Industrial Catastrophes & Lessons',
    pills: ['Root Cause 5-Why', 'Standards Breached', '14+ Case Dossiers', 'UGC Submission Sandbox'],
    url: 'reliabilitytools.co.in/failure-museum/',
    accentGrad: 'linear-gradient(135deg, #f43f5e 0%, #ea580c 100%)',
    icon: '🏛️'
  },
  {
    fileName: 'benchmarks.png',
    badge: 'EMPIRICAL ASSET BENCHMARKS',
    badgeColor: '#10b981',
    title: 'Industrial Reliability Benchmarks',
    subtitle: 'ISO 14224 Quartile Metrics Across 7 Global Manufacturing Sectors',
    pills: ['Availability Quartiles', 'Unplanned Downtime', 'Cost % of RAV', 'Interactive Ranker'],
    url: 'reliabilitytools.co.in/benchmarks/',
    accentGrad: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    icon: '📊'
  },
  {
    fileName: 'events.png',
    badge: 'CONFERENCES & JOBS DIGEST',
    badgeColor: '#6366f1',
    title: 'Reliability Events & Jobs Hub',
    subtitle: 'IEEE RAMS, SMRP Conferences, Free Webinars & Verified Vacancies',
    pills: ['Global Conferences', 'Free Pass Offers', 'Monthly Jobs Digest', 'Asset Management Roles'],
    url: 'reliabilitytools.co.in/events/',
    accentGrad: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
    icon: '📅'
  },
  {
    fileName: 'api-docs.png',
    badge: 'REST CALCULATION API',
    badgeColor: '#8b5cf6',
    title: 'Reliability Calculation REST API',
    subtitle: 'Programmatic High-Speed Endpoints for MTBF, Weibull & Benchmarks',
    pills: ['MTBF & Hazard Rate', 'Weibull R(t) & h(t)', 'OEE Calculator', 'cURL / Node / Python'],
    url: 'reliabilitytools.co.in/api/docs/',
    accentGrad: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    icon: '⚡'
  },
  {
    fileName: 'tool-fallback.png',
    badge: 'INDUSTRIAL RELIABILITY CALCULATOR',
    badgeColor: '#06b6d4',
    title: 'Reliability Engineering Calculator Suite',
    subtitle: 'Free ISO / IEEE / API Certified Calculators for Plant Engineers',
    pills: ['MTBF & Availability', 'Weibull Analysis', 'FMEA & LOPA', 'Interactive Diagnostics'],
    url: 'reliabilitytools.co.in/tools/',
    accentGrad: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    icon: '⚙️'
  },
  {
    fileName: 'article-fallback.png',
    badge: 'KNOWLEDGE HUB & TECHNICAL GUIDE',
    badgeColor: '#3b82f6',
    title: 'Reliability Engineering Knowledge Base',
    subtitle: 'Expert Peer-Reviewed Methodology, Formulas & Worked Examples',
    pills: ['ISO 14224 Standards', 'Weibull Physics', 'RCM Methodology', 'Worked Case Studies'],
    url: 'reliabilitytools.co.in/learning/',
    accentGrad: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    icon: '📚'
  },
  {
    fileName: 'industry-fallback.png',
    badge: 'VERTICAL INDUSTRY PLAYBOOK',
    badgeColor: '#10b981',
    title: 'Industrial Sector Reliability Guides',
    subtitle: 'Tailored Asset Management Strategies & Recommended Calculation Suites',
    pills: ['Sector KPIs', 'Dominant Failure Modes', 'Recommended Tools', 'SMRP Quartiles'],
    url: 'reliabilitytools.co.in/industries/',
    accentGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: '🏭'
  },
  {
    fileName: 'default-fallback.png',
    badge: 'OPEN RELIABILITY PLATFORM',
    badgeColor: '#06b6d4',
    title: 'Reliability Tools Platform',
    subtitle: 'The Open-Source Grade Suite for Industrial Maintenance & Reliability',
    pills: ['47+ Calculators', 'Simulation Games', 'Empirical Benchmarks', 'Developer API'],
    url: 'reliabilitytools.co.in',
    accentGrad: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    icon: '🛡️'
  }
];

function generateHtml(card) {
  const pillsHtml = card.pills.map(p => `
    <div style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 9999px; padding: 10px 22px; font-size: 16px; font-weight: 600; color: #e2e8f0; display: inline-flex; align-items: center; gap: 8px;">
      <span style="color: ${card.badgeColor};">✓</span> ${p}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1200px;
            height: 630px;
            background: #090d16;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 60px 70px;
          }
          .grid-bg {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: 
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
          }
          .glow-1 {
            position: absolute;
            top: -120px;
            right: -100px;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0) 70%);
            pointer-events: none;
          }
          .glow-2 {
            position: absolute;
            bottom: -150px;
            left: -100px;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%);
            pointer-events: none;
          }
          .top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 10;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .brand-logo {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
          }
          .brand-logo svg {
            width: 26px;
            height: 26px;
            fill: #090d16;
          }
          .brand-name {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #ffffff;
          }
          .brand-accent {
            color: #22d3ee;
          }
          .badge {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid ${card.badgeColor}66;
            color: ${card.badgeColor};
            padding: 8px 18px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .content {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .title-row {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .icon-bubble {
            font-size: 54px;
            line-height: 1;
          }
          .title {
            font-size: 60px;
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -1.5px;
            background: ${card.accentGrad};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .subtitle {
            font-size: 24px;
            font-weight: 500;
            color: #94a3b8;
            line-height: 1.4;
            max-width: 980px;
          }
          .pills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 10px;
          }
          .footer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 10;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            padding-top: 24px;
          }
          .free-tag {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 17px;
            font-weight: 700;
            color: #38bdf8;
          }
          .url {
            font-size: 18px;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          }
        </style>
      </head>
      <body>
        <div class="grid-bg"></div>
        <div class="glow-1"></div>
        <div class="glow-2"></div>

        <div class="top-row">
          <div class="brand">
            <div class="brand-logo">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z"/>
              </svg>
            </div>
            <div class="brand-name">Reliability<span class="brand-accent">Tools</span></div>
          </div>
          <div class="badge">${card.badge}</div>
        </div>

        <div class="content">
          <div class="title-row">
            <div class="icon-bubble">${card.icon}</div>
            <h1 class="title">${card.title}</h1>
          </div>
          <p class="subtitle">${card.subtitle}</p>
          <div class="pills-container">
            ${pillsHtml}
          </div>
        </div>

        <div class="footer-row">
          <div class="free-tag">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 10px #10b981;"></span>
            100% Free Online • No Sign-Up • Instant Browser Play
          </div>
          <div class="url">${card.url}</div>
        </div>
      </body>
    </html>
  `;
}

async function generateAllCards() {
  fs.mkdirSync(OG_DIR, { recursive: true });

  const chromePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ].find(p => fs.existsSync(p));

  console.log('Launching browser at:', chromePath || 'default puppeteer bundle');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  for (const card of CARDS) {
    const html = generateHtml(card);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 100));
    const outPath = path.join(OG_DIR, card.fileName);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`✅ Generated OG Card: ${card.fileName} (1200x630)`);
  }

  await browser.close();
  console.log(`\n🎉 Successfully generated all ${CARDS.length} OG Cards in public/og/!`);
}

generateAllCards().catch(err => {
  console.error('Error generating OG cards:', err);
  process.exit(1);
});
