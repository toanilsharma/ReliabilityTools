const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['./pages', './components', './public', './dist'];
const FILE_EXTENSIONS = ['.html', '.tsx', '.jsx'];

let totalImagesChecked = 0;
let missingAltCount = 0;

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Regex to match <img ... > tags
  const imgRegex = /<img\s+[^>]*\/?>/gi;

  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    totalImagesChecked++;
    const imgTag = match[0];

    // Check for alt attribute
    const hasAlt = /alt\s*=\s*["'{}]/i.test(imgTag);
    const isEmptyAlt = /alt\s*=\s*["']\s*["']/i.test(imgTag);

    if (!hasAlt) {
      missingAltCount++;
      console.log(`❌ [MISSING ALT] ${filePath}:`);
      console.log(`   Tag: ${imgTag}\n`);
    } else if (isEmptyAlt) {
      console.log(`⚠️ [EMPTY ALT] ${filePath}:`);
      console.log(`   Tag: ${imgTag}\n`);
    }
  }
}

console.log('🔍 Starting Alt Attribute Audit across codebase...\n');
DIRECTORIES_TO_SCAN.forEach(scanDirectory);

console.log(`\n====================================`);
console.log(`Audit Summary:`);
console.log(`Total <img> tags scanned: ${totalImagesChecked}`);
console.log(`Missing alt attributes:   ${missingAltCount}`);
console.log(`====================================\n`);

if (missingAltCount === 0) {
  console.log('✅ Success! All <img> tags have valid alt attributes.');
}
