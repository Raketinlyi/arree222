#!/usr/bin/env node
// Lightweight wrapper around `npm audit` for CI (CommonJS)
const { execSync } = require('child_process');

function runAudit() {
  try {
    const out = execSync('npm audit --omit=dev --json', { encoding: 'utf8' });
    return out;
  } catch (err) {
    if (err.stdout) return err.stdout.toString();
    throw err;
  }
}

function safeParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse npm audit output as JSON');
    console.error(jsonStr);
    process.exit(2);
  }
}

const raw = runAudit();
const data = safeParse(raw);

const vulns = (data.metadata && data.metadata.vulnerabilities) || {};
const critical = vulns.critical || 0;
const high = vulns.high || 0;
const moderate = vulns.moderate || 0;
const low = vulns.low || 0;

console.log('\n=== Security audit summary (production deps only) ===');
console.log(`critical: ${critical}, high: ${high}, moderate: ${moderate}, low: ${low}`);

if (critical > 0 || high > 0) {
  console.error('\n🚨 High/critical vulnerabilities detected.');
  console.error('Run `npm audit fix` to apply non-breaking fixes.');
  console.error('For remaining issues consider running `npm audit fix --force` in a feature branch and fully testing web3 flows.');
  process.exit(1);
}

console.log('\nNo high or critical vulnerabilities detected for production dependencies.');
process.exit(0);
