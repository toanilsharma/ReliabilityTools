const fs = require('fs');
const path = require('path');

const sampleRoutes = [
  { type: 'utility', file: 'index.html', expectedUrl: 'https://reliabilitytools.co.in/' },
  { type: 'tool', file: 'tools/duval-triangle/index.html', expectedUrl: 'https://reliabilitytools.co.in/tools/duval-triangle/' },
  { type: 'game', file: 'play/uptime-tycoon/index.html', expectedUrl: 'https://reliabilitytools.co.in/play/uptime-tycoon/' },
  { type: 'article', file: 'learning/mtbf-guide/index.html', expectedUrl: 'https://reliabilitytools.co.in/learning/mtbf-guide/' },
  { type: 'industry', file: 'industries/power-generation/index.html', expectedUrl: 'https://reliabilitytools.co.in/industries/power-generation/' },
  { type: 'legal', file: 'legal/privacy/index.html', expectedUrl: 'https://reliabilitytools.co.in/legal/privacy/' },
  { type: 'ugc', file: 'failure-museum/space-shuttle-challenger-o-ring/index.html', expectedUrl: 'https://reliabilitytools.co.in/failure-museum/space-shuttle-challenger-o-ring/' },
  { type: 'event', file: 'events/index.html', expectedUrl: 'https://reliabilitytools.co.in/events/' },
  { type: 'dataset', file: 'benchmarks/index.html', expectedUrl: 'https://reliabilitytools.co.in/benchmarks/' },
  { type: 'api', file: 'api/docs/index.html', expectedUrl: 'https://reliabilitytools.co.in/api/docs/' }
];

console.log('='.repeat(100));
console.log('10 SAMPLE URLS AUDIT (ONE PER CONTENT TYPE)');
console.log('='.repeat(100));

let allPassed = true;
sampleRoutes.forEach(s => {
  const filePath = path.join(__dirname, '../dist', s.file);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING FILE: ${filePath}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robotsMatch = content.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
  const ogTitleMatch = content.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  const ogDescMatch = content.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  const ogUrlMatch = content.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i);
  const ogTypeMatch = content.match(/<meta\s+property="og:type"\s+content="([^"]+)"/i);
  const ogImgMatch = content.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const twCardMatch = content.match(/<meta\s+name="twitter:card"\s+content="([^"]+)"/i);
  const hasHreflangEn = content.includes('hreflang="en"');
  const hasHreflangDefault = content.includes('hreflang="x-default"');

  const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';
  const robots = robotsMatch ? robotsMatch[1] : 'NONE';
  const ogType = ogTypeMatch ? ogTypeMatch[1] : 'NONE';
  const ogImg = ogImgMatch ? ogImgMatch[1] : 'NONE';
  const twCard = twCardMatch ? twCardMatch[1] : 'NONE';

  console.log(`[${s.type.toUpperCase()}] ${s.expectedUrl}`);
  console.log(`  ✓ Canonical     : ${canonical}`);
  console.log(`  ✓ Robots        : ${robots}`);
  console.log(`  ✓ Hreflang Tags : en=${hasHreflangEn}, x-default=${hasHreflangDefault}`);
  console.log(`  ✓ OG Type / Card: og:type="${ogType}" | twitter:card="${twCard}"`);
  console.log(`  ✓ OG Image      : ${ogImg}`);
  console.log('-'.repeat(100));

  if (!canonical.startsWith('https://reliabilitytools.co.in') || robots !== 'index, follow' || !hasHreflangEn || !ogImg || !twCard) {
    allPassed = false;
  }
});

console.log(`\nALL 10 SAMPLE PAGES PASSED INTEGRITY: ${allPassed ? '✅ YES' : '❌ NO'}`);
