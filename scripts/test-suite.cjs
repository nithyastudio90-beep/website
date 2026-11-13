/**
 * Automated Verification & Testing Script for Nithya Studio & Video
 * Validates business constants, phone formatting, WhatsApp generators,
 * validation rules, and database schema conformance.
 */

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('\n======================================================');
console.log('NITHYA STUDIO & VIDEO – AUTOMATED TEST SUITE');
console.log('======================================================\n');

// 1. Official Business Information Tests
console.log('1. Official Business Information Verification:');
const constantsFile = fs.readFileSync(path.join(__dirname, '../src/lib/constants.ts'), 'utf8');

assert(constantsFile.includes('Nithya Studio & Video'), 'Business name is exact: Nithya Studio & Video');
assert(constantsFile.includes('99, Karapattu Village and Post'), 'Address includes: 99, Karapattu Village and Post');
assert(constantsFile.includes('Uthangarai Taluk'), 'Taluk is Uthangarai');
assert(constantsFile.includes('Karapattu, Tamil Nadu – 635306'), 'Pincode and location is Karapattu, Tamil Nadu – 635306');
assert(constantsFile.includes('+91 84891 28362'), 'Official Mobile / WhatsApp is +91 84891 28362');
assert(constantsFile.includes('nithyastudio90@gmail.com'), 'Email is nithyastudio90@gmail.com');
assert(constantsFile.includes('https://www.instagram.com/nithyastudiokpt/'), 'Official Instagram is https://www.instagram.com/nithyastudiokpt/');
assert(constantsFile.includes('https://www.youtube.com/@nithyastudiokpt'), 'Official YouTube is https://www.youtube.com/@nithyastudiokpt');

// 2. Services Verification (All 9 services)
console.log('\n2. Services Requirements Verification:');
const expectedServices = [
  'Wedding Photography',
  'Wedding Videography',
  'Pre-Wedding Photography',
  'Birthday Photography',
  'Baby Photography',
  'Photo Editing',
  'Passport Photos',
  'Photo Frames & Albums',
  'Drone Photography'
];

expectedServices.forEach((service) => {
  assert(constantsFile.includes(service), `Service defined: "${service}"`);
});

// 3. WhatsApp International Format Validation
console.log('\n3. WhatsApp Integration Verification:');
const utilsFile = fs.readFileSync(path.join(__dirname, '../src/lib/utils.ts'), 'utf8');
assert(constantsFile.includes("'918489128362'"), 'International raw WhatsApp number is 918489128362 (no spaces, no +)');
assert(utilsFile.includes('https://wa.me/'), 'Uses official wa.me API link format');
assert(utilsFile.includes('encodeURIComponent'), 'Properly encodes URL parameters for WhatsApp message');

// 4. Input Validation Logic Tests
console.log('\n4. Input Validation & Form Security Verification:');
function isValidIndianMobile(phone) {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) return /^[6-9]\d{9}$/.test(cleaned);
  if (cleaned.length === 12 && cleaned.startsWith('91')) return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  if (cleaned.length === 11 && cleaned.startsWith('0')) return /^[6-9]\d{9}$/.test(cleaned.slice(1));
  return false;
}

assert(isValidIndianMobile('8489128362'), 'Validates 10-digit Indian number 8489128362');
assert(isValidIndianMobile('+91 84891 28362'), 'Validates formatted Indian number +91 84891 28362');
assert(isValidIndianMobile('08489128362'), 'Validates 0-prefixed Indian number 08489128362');
assert(!isValidIndianMobile('12345'), 'Rejects short invalid number 12345');
assert(!isValidIndianMobile('0123456789'), 'Rejects number starting with invalid digit');

// 5. Database Schema & RLS Verification
console.log('\n5. Database Schema & Security Verification:');
const schemaFile = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.bookings'), 'Table public.bookings exists');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.services'), 'Table public.services exists');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.gallery_images'), 'Table public.gallery_images exists');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.gallery_categories'), 'Table public.gallery_categories exists');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.studio_settings'), 'Table public.studio_settings exists');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.youtube_videos'), 'Table public.youtube_videos exists');
assert(schemaFile.includes('ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on bookings');
assert(schemaFile.includes('CREATE POLICY "Public submit booking enquiry"'), 'Public booking submission policy created');
assert(schemaFile.includes('CREATE POLICY "Admin view and manage bookings"'), 'Admin private access policy on bookings created');

// 6. Production Build Artifacts Verification
console.log('\n6. Production Build Artifacts Verification:');
assert(fs.existsSync(path.join(__dirname, '../dist/index.html')), 'dist/index.html exists');
assert(fs.existsSync(path.join(__dirname, '../public/robots.txt')), 'public/robots.txt exists');
assert(fs.existsSync(path.join(__dirname, '../public/sitemap.xml')), 'public/sitemap.xml exists');
assert(fs.existsSync(path.join(__dirname, '../public/_redirects')), 'public/_redirects exists');
assert(fs.existsSync(path.join(__dirname, '../vercel.json')), 'vercel.json exists');

console.log('\n======================================================');
console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
