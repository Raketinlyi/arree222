#!/usr/bin/env node
const { execSync } = require('child_process');

function runAuditJson() {
  try {
    return execSync('npm audit --json', { encoding: 'utf8' });
  } catch (err) {
    if (err.stdout) return err.stdout.toString();
    throw err;
  }
}

function safeParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse npm audit output');
    console.error(jsonStr);
    process.exit(2);
  }
}

const raw = runAuditJson();
const data = safeParse(raw);

const vulns = (data.metadata && data.metadata.vulnerabilities) || {};
const total = (vulns.critical||0) + (vulns.high||0) + (vulns.moderate||0) + (vulns.low||0);

console.log('\n=== Critical security audit ===');
console.log(`Total vulnerabilities: ${total}`);
console.log(`critical: ${vulns.critical||0}, high: ${vulns.high||0}, moderate: ${vulns.moderate||0}, low: ${vulns.low||0}`);

if (total > 0) {
  if (data.advisories) {
    Object.values(data.advisories).forEach(a => {
      console.log('\n--- Advisory ---');
      console.log(`module: ${a.module_name}`);
      console.log(`severity: ${a.severity}`);
      console.log(`title: ${a.title}`);
      console.log(`url: ${a.url}`);
    });
  }
  console.error('\nFound vulnerabilities — failing CI. Please triage.');
  process.exit(1);
}

console.log('\nNo vulnerabilities found.');
process.exit(0);
