#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Thoven Platform Health Check\n');
console.log('=' .repeat(50));

let issues = [];
let warnings = [];
let successes = [];

// Check environment variables
console.log('\n📋 Checking environment variables...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('placeholder_key_replace_with_actual')) {
    warnings.push('⚠️  .env.local contains placeholder values - replace with actual Supabase keys');
  } else {
    successes.push('✅ Environment variables configured');
  }
} else {
  issues.push('❌ Missing .env.local file');
}

// Check critical directories
console.log('\n📁 Checking directory structure...');
const criticalDirs = ['app', 'components', 'lib', 'hooks', 'public'];
criticalDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    successes.push(`✅ /${dir} directory exists`);
  } else {
    issues.push(`❌ Missing /${dir} directory`);
  }
});

// Check critical files
console.log('\n📄 Checking critical files...');
const criticalFiles = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'middleware.ts'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    successes.push(`✅ ${file} exists`);
  } else {
    issues.push(`❌ Missing ${file}`);
  }
});

// Check public assets
console.log('\n🖼️  Checking public assets...');
const requiredAssets = ['favicon.svg', 'manifest.json', 'offline.html'];
requiredAssets.forEach(asset => {
  const assetPath = path.join(__dirname, '..', 'public', asset);
  if (fs.existsSync(assetPath)) {
    successes.push(`✅ /public/${asset} exists`);
  } else {
    issues.push(`❌ Missing /public/${asset}`);
  }
});

// Check build output
console.log('\n🏗️  Checking build status...');
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  successes.push('✅ Build output exists (.next directory)');
} else {
  warnings.push('⚠️  No build output found - run "npm run build"');
}

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 Health Check Summary\n');

if (successes.length > 0) {
  console.log('✅ Successful checks:', successes.length);
  if (process.argv.includes('--verbose')) {
    successes.forEach(s => console.log('  ', s));
  }
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:', warnings.length);
  warnings.forEach(w => console.log('  ', w));
}

if (issues.length > 0) {
  console.log('\n❌ Issues found:', issues.length);
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
} else {
  console.log('\n✨ Platform health check passed!');
  console.log('\n📝 Next steps:');
  console.log('  1. Replace placeholder Supabase keys in .env.local');
  console.log('  2. Run "npm run dev" to start development server');
  console.log('  3. Visit http://localhost:3000 to view the app');
  process.exit(0);
}