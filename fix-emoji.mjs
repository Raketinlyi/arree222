#!/usr/bin/env node
/**
 * Fix broken emoji encoding in breed/page.tsx
 */

import { readFileSync, writeFileSync } from 'fs';

// Mapping of broken encodings to correct emojis
const EMOJI_MAP = {
  'рџ§¬': '🧬',  // DNA
  'вЂў': '•',   // bullet point
  'вљЎ': '⚗️',  // test tube/flask
  'вњ…': '✅',  // check mark
  'рџ"—': '📗',  // green book
  'рџ'ё': '💸',  // money flying
  'вљҐ': '⚥',   // gender symbols
  'рџЋІ': '🎲',  // dice
  'вЏ±пёЏ': '⏱️',  // stopwatch
  'вљ пёЏ': '⚠️',  // warning
  'вљ°пёЏ': '⚰️',  // coffin
  'рџљ«': '🚫',  // prohibited
  'вЏі': '⏳',   // hourglass
  'рџ"'': '🔒',  // locked
  'OCTAAвЂ"WMON': 'OCTAA–WMON',  // em dash
};

function fixEmojiEncoding(filePath) {
  console.log(`Fixing emoji encoding in ${filePath}...`);
  
  // Read file with UTF-8 encoding
  let content = readFileSync(filePath, 'utf8');
  
  // Count replacements
  let totalReplacements = 0;
  
  // Replace broken encodings with correct emojis
  for (const [broken, correct] of Object.entries(EMOJI_MAP)) {
    const regex = new RegExp(broken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      content = content.replace(regex, correct);
      totalReplacements += count;
      console.log(`  Replaced '${broken}' → '${correct}' (${count} times)`);
    }
  }
  
  // Write back to file
  writeFileSync(filePath, content, 'utf8');
  
  console.log(`✅ Done! Total replacements: ${totalReplacements}`);
  return totalReplacements;
}

// Run fix
const filePath = 'app/breed/page.tsx';
const total = fixEmojiEncoding(filePath);

if (total === 0) {
  console.log('⚠️ No broken emojis found. File may already be fixed.');
} else {
  console.log(`🎉 Fixed ${total} broken emojis!`);
}
