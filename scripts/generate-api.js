#!/usr/bin/env node

/**
 * Generate api.json from data.js
 * Run: node scripts/generate-api.js
 *
 * This extracts the ANIMOTION_DATA from data.js and writes a clean
 * api.json file for machine consumption (AI agents, MCP server, etc.)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Read data.js and extract the data
const dataContent = readFileSync(join(root, 'js', 'data.js'), 'utf-8');

// Execute in a sandboxed context
const window = {};
const fn = new Function('window', dataContent + '\nreturn window.ANIMOTION_DATA;');
const data = fn(window);

if (!data) {
  console.error('Failed to extract ANIMOTION_DATA from data.js');
  process.exit(1);
}

// Build api.json
const apiJson = {
  name: 'animotion',
  version: '1.0.0',
  description: 'The largest open-source CSS3 animation library. 1000+ production-ready animations across 20 categories.',
  license: 'MIT',
  author: 'Bachao.AI',
  repository: 'https://github.com/nickshouvik/css3-animations',
  website: 'https://nickshouvik.github.io/css3-animations',
  totalAnimations: data.animations.length,
  totalCategories: data.categories.length,
  categories: data.categories.map(cat => ({
    ...cat,
    count: data.animations.filter(a => a.category === cat.id).length,
  })),
  animations: data.animations,
};

writeFileSync(join(root, 'api.json'), JSON.stringify(apiJson, null, 2));
console.log(`Generated api.json with ${apiJson.totalAnimations} animations across ${apiJson.totalCategories} categories`);
