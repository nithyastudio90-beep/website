const fs = require('fs');
const path = require('path');

console.log('\n--- VERIFYING PRODUCTION BUILD ARTIFACTS ---');

const distDir = path.join(__dirname, '../dist');

// 1. Required files check
const requiredFiles = [
  'index.html',
  'site.webmanifest',
  'favicon.svg',
  'favicon.ico',
  '.nojekyll',
  '404.html'
];

for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`✕ ERROR: Missing required build artifact: dist/${file}`);
    process.exit(1);
  }
  console.log(`✓ Found: dist/${file}`);
}

// 2. index.html inspection
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

if (indexHtml.includes('/src/main.tsx')) {
  console.error('✕ ERROR: dist/index.html still references raw "/src/main.tsx"!');
  process.exit(1);
}
console.log('✓ Validated: dist/index.html does not contain raw /src/main.tsx entry point');

if (indexHtml.includes('%BASE_URL%')) {
  console.error('✕ ERROR: dist/index.html contains unresolved %BASE_URL% placeholder!');
  process.exit(1);
}
console.log('✓ Validated: dist/index.html has no unresolved %BASE_URL% placeholders');

// 3. Confirm asset paths start with /website/
if (!indexHtml.includes('/website/assets/') && !indexHtml.includes('./assets/')) {
  console.error('✕ ERROR: dist/index.html does not reference assets under /website/assets/ or ./assets/');
  process.exit(1);
}
console.log('✓ Validated: Production assets correctly resolved under /website/assets/');

console.log('--- ALL PRODUCTION ARTIFACT CHECKS PASSED ---\n');
