#!/usr/bin/env node

/**
 * Animotion MCP Server v2
 *
 * Model Context Protocol server that enables AI agents to:
 * - Search & use 745+ CSS3 animations
 * - Search & use 15,000+ real SVG icons from Lucide, Heroicons, Tabler, Bootstrap + built-in
 * - Compose custom animations with duration/easing/delay
 * - Get AI-friendly suggestions based on use case descriptions
 *
 * This eliminates AI-generated icons — agents use real, hand-crafted icons instead.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadAllIcons, buildSearchIndex } from './icon-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Load Animation Data ──
let animationData;
try {
  const apiPath = join(__dirname, '..', 'api.json');
  animationData = JSON.parse(readFileSync(apiPath, 'utf-8'));
} catch {
  try {
    const dataPath = join(__dirname, '..', 'js', 'data.js');
    const content = readFileSync(dataPath, 'utf-8');
    const match = content.match(/window\.ANIMOTION_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (match) animationData = JSON.parse(match[1]);
  } catch {
    animationData = { categories: [], animations: [] };
  }
}

// ── Load Built-in Icons ──
let builtinIcons = { categories: [], icons: [] };
try {
  const iconsPath = join(__dirname, '..', 'js', 'icons.js');
  const content = readFileSync(iconsPath, 'utf-8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start >= 0 && end > start) {
    let jsonStr = content.substring(start, end + 1);
    jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');
    builtinIcons = JSON.parse(jsonStr);
  }
} catch {
  // silent
}

// ── Load All External Icon Libraries ──
console.error('Loading icon libraries...');
const { providers: externalProviders, totalIcons: externalIconCount, loadTimeMs } = loadAllIcons();
console.error(`Loaded ${externalIconCount} external icons in ${loadTimeMs}ms`);

// Add built-in icons as a provider
const allProviders = {
  builtin: {
    id: 'builtin',
    name: 'Animotion Built-in',
    license: 'MIT',
    website: 'https://animotion-chi.vercel.app',
    description: '120 hand-crafted SVG icons included with Animotion',
    icons: (builtinIcons.icons || []).map(i => ({
      ...i,
      id: `builtin:${i.id}`,
      provider: 'builtin',
    })),
  },
  ...externalProviders,
};

// Build search index
const searchIndex = buildSearchIndex(allProviders);

// Total icon count
const totalIconCount = Object.values(allProviders).reduce((sum, p) => sum + p.icons.length, 0);
console.error(`Total icons available: ${totalIconCount}`);
console.error(`Animations available: ${(animationData.animations || []).length}`);

// In-memory custom icons
const customIcons = [];

// ── MCP Server ──
const server = new Server(
  { name: 'animotion', version: '2.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

// ── Tools ──
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // Animation Tools
    {
      name: 'search_animations',
      description: `Search ${(animationData.animations || []).length} CSS3 animations by name, category, or tags. Returns matching animations with CSS classes and code.`,
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query — matches name, description, CSS class, category, tags. Examples: "fade in", "bounce", "loader", "3d flip"' },
          category: { type: 'string', description: 'Filter by category: entrance, exit, attention, text, background, button, card, loader, navigation, form, transform3d, filter, micro, scroll, creative, fintech, gaming, ecommerce, social, dashboard' },
          limit: { type: 'number', description: 'Max results (default: 10, max: 50)' },
        },
      },
    },
    {
      name: 'get_animation',
      description: 'Get complete CSS code for a specific animation by ID or class name. Returns @keyframes + usage class.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Animation ID (e.g., "E01") or CSS class (e.g., "animotion-fade-in")' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_categories',
      description: 'List all 20 animation categories with counts.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'compose_animation',
      description: 'Compose custom animation CSS with custom duration/easing/delay. Returns ready-to-use CSS.',
      inputSchema: {
        type: 'object',
        properties: {
          animation: { type: 'string', description: 'Animation ID or CSS class' },
          selector: { type: 'string', description: 'CSS selector (default: ".animated")' },
          duration: { type: 'string', description: 'Duration (e.g., "0.5s")' },
          easing: { type: 'string', description: 'Timing function (e.g., "ease-out")' },
          delay: { type: 'string', description: 'Delay (e.g., "0.2s")' },
          iterationCount: { type: 'string', description: 'Iterations (e.g., "1", "infinite")' },
          fillMode: { type: 'string', description: 'Fill mode (default: "both")' },
        },
        required: ['animation'],
      },
    },
    {
      name: 'suggest_animation',
      description: 'Suggest animations for a use case. Describe what you need and get the best matches with CSS code.',
      inputSchema: {
        type: 'object',
        properties: {
          useCase: { type: 'string', description: 'Description: "modal appearing", "button hover", "loading spinner", "page section entering viewport"' },
          count: { type: 'number', description: 'Number of suggestions (default: 5)' },
        },
        required: ['useCase'],
      },
    },
    {
      name: 'get_animation_css',
      description: 'Get ONLY the CSS code for an animation — no metadata. Perfect for inserting into stylesheets.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Animation ID or CSS class' },
          includeKeyframes: { type: 'boolean', description: 'Include @keyframes (default: true)' },
        },
        required: ['id'],
      },
    },

    // Icon Tools
    {
      name: 'search_icons',
      description: `Search ${totalIconCount} real SVG icons across Lucide, Heroicons, Tabler, Bootstrap, and Animotion built-in. Returns actual SVG code — use these instead of AI-generated icons.`,
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query — matches icon name, tags, category. Examples: "home", "shopping cart", "user", "arrow right", "chart"' },
          provider: { type: 'string', description: 'Filter by provider: builtin, lucide, heroicons, tabler, bootstrap, all (default: "all")' },
          style: { type: 'string', description: 'Icon style preference: "outline", "solid", "filled" (optional, not all providers support all styles)' },
          limit: { type: 'number', description: 'Max results (default: 20, max: 100)' },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_icon',
      description: 'Get the SVG code for a specific icon by provider:id. Use this to get real hand-crafted SVG instead of generating icons.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Icon ID with provider prefix (e.g., "lucide:home", "tabler:user", "bootstrap:cart") or without prefix to search all' },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_icon_providers',
      description: `List all icon providers. ${totalIconCount} icons available across 5 providers.`,
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'add_custom_icon',
      description: 'Register a custom SVG icon for this session.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique ID (e.g., "my-logo")' },
          name: { type: 'string', description: 'Display name' },
          svg: { type: 'string', description: 'Full SVG markup' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Search tags' },
        },
        required: ['id', 'name', 'svg'],
      },
    },
  ],
}));

// ── Tool Handlers ──
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ── Animation Tools ──
    case 'search_animations': {
      const { query, category, limit = 10 } = args;
      let results = animationData.animations || [];
      if (category) results = results.filter(a => a.category === category);
      if (query) {
        const q = query.toLowerCase();
        results = results.filter(a =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.cssClass.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
        );
      }
      results = results.slice(0, Math.min(limit, 50));
      return text({
        count: results.length,
        animations: results.map(a => ({
          id: a.id, name: a.name, description: a.description,
          cssClass: a.cssClass, category: a.category, tags: a.tags, duration: a.duration,
        })),
      });
    }

    case 'get_animation': {
      const anim = findAnimation(args.id);
      if (!anim) return error(`Animation not found: ${args.id}`);
      return text(anim);
    }

    case 'list_categories': {
      const categories = (animationData.categories || []).map(cat => ({
        ...cat,
        count: (animationData.animations || []).filter(a => a.category === cat.id).length,
      }));
      return text({ categories });
    }

    case 'compose_animation': {
      const { animation, selector = '.animated', duration, easing, delay, iterationCount, fillMode = 'both' } = args;
      const anim = findAnimation(animation);
      if (!anim) return error(`Animation not found: ${animation}`);
      const dur = duration || anim.duration;
      const ease = easing || anim.timingFunction;
      const del = delay || '0s';
      const iter = iterationCount || anim.iterationCount;
      return { content: [{ type: 'text', text: `${anim.keyframeCSS}\n\n${selector} {\n  animation: ${anim.keyframeName} ${dur} ${ease} ${del} ${iter} ${fillMode};\n}` }] };
    }

    case 'suggest_animation': {
      const { useCase, count = 5 } = args;
      const suggestions = suggestAnimations(useCase, count);
      return text({
        useCase,
        suggestions: suggestions.map(s => ({
          id: s.id, name: s.name, description: s.description,
          cssClass: s.cssClass, category: s.category,
          css: s.css, keyframeCSS: s.keyframeCSS, relevanceScore: s._score,
        })),
      });
    }

    case 'get_animation_css': {
      const { id, includeKeyframes = true } = args;
      const anim = findAnimation(id);
      if (!anim) return error(`Animation not found: ${id}`);
      let css = includeKeyframes ? anim.keyframeCSS + '\n\n' : '';
      css += anim.css;
      return { content: [{ type: 'text', text: css }] };
    }

    // ── Icon Tools ──
    case 'search_icons': {
      const { query, provider = 'all', style, limit = 20 } = args;
      const q = (query || '').toLowerCase().trim();
      if (!q) return error('Please provide a search query.');

      let results = [];
      const keywords = q.split(/\s+/);

      // Determine which providers to search
      const searchProviders = provider === 'all'
        ? Object.keys(allProviders)
        : [provider];

      for (const provId of searchProviders) {
        const prov = allProviders[provId];
        if (!prov) continue;

        for (const icon of prov.icons) {
          let score = 0;
          const iconId = icon.id.split(':')[1] || icon.id;
          const iconName = icon.name.toLowerCase();
          const iconTags = (icon.tags || []).join(' ').toLowerCase();

          for (const kw of keywords) {
            if (iconId.includes(kw)) score += 3;
            if (iconName.includes(kw)) score += 2;
            if (iconTags.includes(kw)) score += 1;
            if (icon.category && icon.category.includes(kw)) score += 1;
          }

          // Style filter
          if (style && icon.tags && !icon.tags.includes(style)) continue;

          if (score > 0) {
            results.push({ ...icon, _score: score });
          }
        }
      }

      // Also search custom icons
      for (const icon of customIcons) {
        let score = 0;
        for (const kw of keywords) {
          if (icon.id.includes(kw)) score += 3;
          if (icon.name.toLowerCase().includes(kw)) score += 2;
          if (icon.tags && icon.tags.some(t => t.includes(kw))) score += 1;
        }
        if (score > 0) results.push({ ...icon, provider: 'custom', _score: score });
      }

      results.sort((a, b) => b._score - a._score);
      results = results.slice(0, Math.min(limit, 100));

      return text({
        query,
        provider,
        count: results.length,
        icons: results.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          tags: i.tags,
          provider: i.provider,
          svg: i.svg,
        })),
      });
    }

    case 'get_icon': {
      const { id } = args;

      // If has provider prefix (e.g., "lucide:home")
      if (id.includes(':')) {
        const [provId, iconId] = id.split(':', 2);
        const prov = allProviders[provId];
        if (prov) {
          const icon = prov.icons.find(i => i.id === id || i.id === `${provId}:${iconId}`);
          if (icon) return text({ id: icon.id, name: icon.name, category: icon.category, tags: icon.tags, svg: icon.svg, provider: icon.provider || provId });
        }
        // Check custom
        const custom = customIcons.find(i => i.id === id);
        if (custom) return text({ ...custom, provider: 'custom' });
        return error(`Icon not found: "${id}". Use search_icons to find available icons.`);
      }

      // No prefix — search all providers
      for (const [provId, prov] of Object.entries(allProviders)) {
        const icon = prov.icons.find(i => {
          const shortId = i.id.split(':')[1] || i.id;
          return shortId === id;
        });
        if (icon) return text({ id: icon.id, name: icon.name, category: icon.category, tags: icon.tags, svg: icon.svg, provider: icon.provider || provId });
      }
      // Check custom
      const custom = customIcons.find(i => i.id === id);
      if (custom) return text({ ...custom, provider: 'custom' });

      return error(`Icon not found: "${id}". Use search_icons to find available icons.`);
    }

    case 'list_icon_providers': {
      const providerList = Object.values(allProviders).map(p => ({
        id: p.id,
        name: p.name,
        license: p.license,
        website: p.website,
        description: p.description,
        iconCount: p.icons.length,
      }));
      providerList.push({
        id: 'custom',
        name: 'Custom Icons',
        license: 'Your own',
        description: 'Upload your own SVG icons via add_custom_icon',
        iconCount: customIcons.length,
      });
      return text({
        totalIcons: totalIconCount + customIcons.length,
        providers: providerList,
        tip: 'Use search_icons with provider="all" to search across all libraries. Use get_icon with "provider:name" format (e.g., "lucide:home") for specific icons.',
      });
    }

    case 'add_custom_icon': {
      const { id, name: iconName, svg, tags = [] } = args;
      if (!id || !iconName || !svg) return error('id, name, and svg are required.');
      const existingIdx = customIcons.findIndex(i => i.id === id);
      if (existingIdx >= 0) customIcons.splice(existingIdx, 1);
      const icon = { id, name: iconName, category: 'custom', tags, svg, provider: 'custom' };
      customIcons.push(icon);
      return text({ success: true, message: `Custom icon "${iconName}" registered.`, totalCustomIcons: customIcons.length });
    }

    default:
      return error(`Unknown tool: ${name}`);
  }
});

// ── Resources ──
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'animotion://catalog', name: 'Animation Catalog', description: `Complete catalog of ${(animationData.animations || []).length} animations`, mimeType: 'application/json' },
    { uri: 'animotion://categories', name: 'Categories', description: 'All 20 animation categories', mimeType: 'application/json' },
    { uri: 'animotion://utilities', name: 'Utility Classes', description: 'Duration, delay, easing utility classes', mimeType: 'text/css' },
    { uri: 'animotion://icons', name: 'Icon Library Stats', description: `${totalIconCount} icons across ${Object.keys(allProviders).length} providers`, mimeType: 'application/json' },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  switch (uri) {
    case 'animotion://catalog':
      return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(animationData, null, 2) }] };
    case 'animotion://categories':
      return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(animationData.categories || [], null, 2) }] };
    case 'animotion://utilities': {
      try {
        const css = readFileSync(join(__dirname, '..', 'css', 'utilities.css'), 'utf-8');
        return { contents: [{ uri, mimeType: 'text/css', text: css }] };
      } catch {
        return { contents: [{ uri, mimeType: 'text/plain', text: 'Utilities file not found' }] };
      }
    }
    case 'animotion://icons':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            totalIcons: totalIconCount + customIcons.length,
            providers: Object.values(allProviders).map(p => ({
              id: p.id, name: p.name, iconCount: p.icons.length, license: p.license,
            })),
            builtinIcons: allProviders.builtin.icons.map(i => ({ id: i.id, name: i.name, category: i.category })),
          }, null, 2),
        }],
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ── Helpers ──
function text(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function error(msg) {
  return { content: [{ type: 'text', text: msg }], isError: true };
}

function findAnimation(idOrClass) {
  if (!animationData.animations) return null;
  return animationData.animations.find(a =>
    a.id === idOrClass || a.cssClass === idOrClass || a.cssClass === `animotion-${idOrClass}`
  );
}

function suggestAnimations(useCase, count) {
  const keywords = useCase.toLowerCase().split(/\s+/);
  const categoryMap = {
    'enter': 'entrance', 'appear': 'entrance', 'show': 'entrance', 'reveal': 'entrance',
    'open': 'entrance', 'mount': 'entrance', 'arrive': 'entrance',
    'exit': 'exit', 'leave': 'exit', 'hide': 'exit', 'disappear': 'exit',
    'close': 'exit', 'dismiss': 'exit', 'remove': 'exit',
    'attention': 'attention', 'notice': 'attention', 'highlight': 'attention',
    'shake': 'attention', 'bounce': 'attention', 'pulse': 'attention',
    'text': 'text', 'title': 'text', 'heading': 'text', 'type': 'text',
    'background': 'background', 'hero': 'background', 'gradient': 'background',
    'button': 'button', 'btn': 'button', 'click': 'button', 'hover': 'button', 'cta': 'button',
    'card': 'card', 'panel': 'card', 'widget': 'card',
    'load': 'loader', 'loading': 'loader', 'spinner': 'loader', 'progress': 'loader', 'wait': 'loader',
    'nav': 'navigation', 'menu': 'navigation', 'header': 'navigation', 'sidebar': 'navigation',
    'form': 'form', 'input': 'form', 'field': 'form', 'toggle': 'form',
    '3d': 'transform3d', 'flip': 'transform3d', 'rotate': 'transform3d', 'cube': 'transform3d',
    'filter': 'filter', 'blur': 'filter', 'grayscale': 'filter',
    'micro': 'micro', 'interaction': 'micro', 'feedback': 'micro', 'like': 'micro', 'notification': 'micro',
    'scroll': 'scroll', 'viewport': 'scroll', 'parallax': 'scroll',
    'creative': 'creative', 'artistic': 'creative', 'special': 'creative',
    'finance': 'fintech', 'money': 'fintech', 'chart': 'fintech', 'price': 'fintech',
    'game': 'gaming', 'physics': 'gaming', 'level': 'gaming',
    'shop': 'ecommerce', 'cart': 'ecommerce', 'product': 'ecommerce',
    'social': 'social', 'share': 'social', 'follow': 'social',
    'dashboard': 'dashboard', 'data': 'dashboard', 'metric': 'dashboard',
  };

  const scored = (animationData.animations || []).map(anim => {
    let score = 0;
    const searchStr = `${anim.name} ${anim.description} ${anim.tags.join(' ')} ${anim.category}`.toLowerCase();
    keywords.forEach(kw => {
      if (searchStr.includes(kw)) score += 2;
      if (anim.name.toLowerCase().includes(kw)) score += 3;
      if (anim.tags.some(t => t.includes(kw))) score += 2;
      if (categoryMap[kw] && anim.category === categoryMap[kw]) score += 4;
    });
    return { ...anim, _score: score };
  });

  return scored.filter(a => a._score > 0).sort((a, b) => b._score - a._score).slice(0, count);
}

// ── Start ──
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Animotion MCP Server v2 running — ${(animationData.animations || []).length} animations, ${totalIconCount} icons`);
}

main().catch(console.error);
