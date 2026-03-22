#!/usr/bin/env node

/**
 * Animotion MCP Server
 *
 * Model Context Protocol server that enables AI agents (Claude, GPT, etc.)
 * to search, retrieve, and compose CSS3 animations from the Animotion library.
 *
 * Tools provided:
 * - search_animations: Search animations by name, category, or tags
 * - get_animation: Get full CSS code for a specific animation
 * - list_categories: List all animation categories
 * - compose_animation: Compose custom animation with duration/easing/delay
 * - get_animation_css: Get just the CSS for direct use
 * - suggest_animation: AI-friendly suggestion based on use case description
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load animation data
let animationData;
try {
  const apiPath = join(__dirname, '..', 'api.json');
  animationData = JSON.parse(readFileSync(apiPath, 'utf-8'));
} catch {
  // Fallback: try loading from data.js by parsing it
  try {
    const dataPath = join(__dirname, '..', 'js', 'data.js');
    const content = readFileSync(dataPath, 'utf-8');
    const match = content.match(/window\.ANIMOTION_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (match) {
      animationData = JSON.parse(match[1]);
    }
  } catch {
    animationData = { categories: [], animations: [] };
  }
}

const server = new Server(
  {
    name: 'animotion',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ── Tools ──

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_animations',
      description: 'Search the Animotion CSS3 animation library. Returns matching animations with their CSS classes, descriptions, and code. Use this to find animations by name, category, tag, or technique.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query — matches against animation name, description, CSS class, category, and tags. Examples: "fade in", "bounce", "loader", "3d flip", "button hover"',
          },
          category: {
            type: 'string',
            description: 'Filter by category. Options: entrance, exit, attention, text, background, button, card, loader, navigation, form, transform3d, filter, micro, scroll, creative, fintech, gaming, ecommerce, social, dashboard',
          },
          limit: {
            type: 'number',
            description: 'Maximum results to return (default: 10, max: 50)',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_animation',
      description: 'Get the complete details and CSS code for a specific animation by its ID or CSS class name. Returns the @keyframes definition and usage class.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Animation ID (e.g., "E01") or CSS class name (e.g., "animotion-fade-in")',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_categories',
      description: 'List all animation categories with their names, icons, colors, and animation counts.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'compose_animation',
      description: 'Compose a custom animation CSS rule by combining an Animotion animation with custom duration, easing, delay, and iteration count. Returns ready-to-use CSS.',
      inputSchema: {
        type: 'object',
        properties: {
          animation: {
            type: 'string',
            description: 'Animation ID or CSS class name',
          },
          selector: {
            type: 'string',
            description: 'CSS selector for the target element (default: ".animated")',
          },
          duration: {
            type: 'string',
            description: 'Animation duration (e.g., "0.5s", "1200ms"). Default: animation default.',
          },
          easing: {
            type: 'string',
            description: 'Timing function (e.g., "ease-out", "cubic-bezier(0.4,0,0.2,1)"). Default: animation default.',
          },
          delay: {
            type: 'string',
            description: 'Animation delay (e.g., "0.2s", "500ms"). Default: "0s".',
          },
          iterationCount: {
            type: 'string',
            description: 'Iteration count (e.g., "1", "3", "infinite"). Default: animation default.',
          },
          fillMode: {
            type: 'string',
            description: 'Fill mode (none, forwards, backwards, both). Default: "both".',
          },
        },
        required: ['animation'],
      },
    },
    {
      name: 'suggest_animation',
      description: 'Suggest animations based on a use case description. Describe what you want to animate and how, and get the best matching animations. Great for AI agents building UIs.',
      inputSchema: {
        type: 'object',
        properties: {
          useCase: {
            type: 'string',
            description: 'Description of the animation need. Examples: "modal appearing on screen", "button hover effect", "loading spinner", "page section entering viewport", "notification popping up", "card flipping to show back"',
          },
          count: {
            type: 'number',
            description: 'Number of suggestions to return (default: 5)',
          },
        },
        required: ['useCase'],
      },
    },
    {
      name: 'get_animation_css',
      description: 'Get ONLY the CSS code for an animation — no metadata. Perfect for directly inserting into stylesheets. Returns the @keyframes and class rule.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Animation ID or CSS class name',
          },
          includeKeyframes: {
            type: 'boolean',
            description: 'Whether to include the @keyframes definition (default: true)',
          },
        },
        required: ['id'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_animations': {
      const { query, category, limit = 10 } = args;
      let results = animationData.animations || [];

      if (category) {
        results = results.filter(a => a.category === category);
      }

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

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            count: results.length,
            animations: results.map(a => ({
              id: a.id,
              name: a.name,
              description: a.description,
              cssClass: a.cssClass,
              category: a.category,
              tags: a.tags,
              duration: a.duration,
            })),
          }, null, 2),
        }],
      };
    }

    case 'get_animation': {
      const { id } = args;
      const anim = findAnimation(id);

      if (!anim) {
        return {
          content: [{ type: 'text', text: `Animation not found: ${id}` }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(anim, null, 2),
        }],
      };
    }

    case 'list_categories': {
      const categories = (animationData.categories || []).map(cat => {
        const count = (animationData.animations || []).filter(a => a.category === cat.id).length;
        return { ...cat, count };
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ categories }, null, 2),
        }],
      };
    }

    case 'compose_animation': {
      const { animation, selector = '.animated', duration, easing, delay, iterationCount, fillMode = 'both' } = args;
      const anim = findAnimation(animation);

      if (!anim) {
        return {
          content: [{ type: 'text', text: `Animation not found: ${animation}` }],
          isError: true,
        };
      }

      const dur = duration || anim.duration;
      const ease = easing || anim.timingFunction;
      const del = delay || '0s';
      const iter = iterationCount || anim.iterationCount;

      const css = `${anim.keyframeCSS}\n\n${selector} {\n  animation: ${anim.keyframeName} ${dur} ${ease} ${del} ${iter} ${fillMode};\n}`;

      return {
        content: [{
          type: 'text',
          text: css,
        }],
      };
    }

    case 'suggest_animation': {
      const { useCase, count = 5 } = args;
      const suggestions = suggestAnimations(useCase, count);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            useCase,
            suggestions: suggestions.map(s => ({
              id: s.id,
              name: s.name,
              description: s.description,
              cssClass: s.cssClass,
              category: s.category,
              css: s.css,
              keyframeCSS: s.keyframeCSS,
              relevanceScore: s._score,
            })),
          }, null, 2),
        }],
      };
    }

    case 'get_animation_css': {
      const { id, includeKeyframes = true } = args;
      const anim = findAnimation(id);

      if (!anim) {
        return {
          content: [{ type: 'text', text: `Animation not found: ${id}` }],
          isError: true,
        };
      }

      let css = '';
      if (includeKeyframes) {
        css += anim.keyframeCSS + '\n\n';
      }
      css += anim.css;

      return {
        content: [{ type: 'text', text: css }],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

// ── Resources ──

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'animotion://catalog',
      name: 'Animation Catalog',
      description: 'Complete catalog of all animations with metadata',
      mimeType: 'application/json',
    },
    {
      uri: 'animotion://categories',
      name: 'Categories',
      description: 'List of all animation categories',
      mimeType: 'application/json',
    },
    {
      uri: 'animotion://utilities',
      name: 'Utility Classes',
      description: 'Available utility classes for duration, delay, easing, etc.',
      mimeType: 'text/plain',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'animotion://catalog':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(animationData, null, 2),
        }],
      };

    case 'animotion://categories':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(animationData.categories || [], null, 2),
        }],
      };

    case 'animotion://utilities': {
      const utilitiesPath = join(__dirname, '..', 'css', 'utilities.css');
      try {
        const css = readFileSync(utilitiesPath, 'utf-8');
        return {
          contents: [{ uri, mimeType: 'text/css', text: css }],
        };
      } catch {
        return {
          contents: [{ uri, mimeType: 'text/plain', text: 'Utilities file not found' }],
        };
      }
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ── Helpers ──

function findAnimation(idOrClass) {
  if (!animationData.animations) return null;
  return animationData.animations.find(a =>
    a.id === idOrClass ||
    a.cssClass === idOrClass ||
    a.cssClass === `animotion-${idOrClass}`
  );
}

function suggestAnimations(useCase, count) {
  const keywords = useCase.toLowerCase().split(/\s+/);

  // Map common use case words to categories and tags
  const categoryMap = {
    'enter': 'entrance', 'appear': 'entrance', 'show': 'entrance', 'reveal': 'entrance',
    'open': 'entrance', 'mount': 'entrance', 'arrive': 'entrance',
    'exit': 'exit', 'leave': 'exit', 'hide': 'exit', 'disappear': 'exit',
    'close': 'exit', 'dismiss': 'exit', 'remove': 'exit',
    'attention': 'attention', 'notice': 'attention', 'highlight': 'attention',
    'shake': 'attention', 'bounce': 'attention', 'pulse': 'attention',
    'text': 'text', 'title': 'text', 'heading': 'text', 'type': 'text',
    'background': 'background', 'hero': 'background', 'gradient': 'background',
    'button': 'button', 'btn': 'button', 'click': 'button', 'hover': 'button',
    'cta': 'button',
    'card': 'card', 'panel': 'card', 'widget': 'card',
    'load': 'loader', 'loading': 'loader', 'spinner': 'loader', 'progress': 'loader',
    'wait': 'loader',
    'nav': 'navigation', 'menu': 'navigation', 'header': 'navigation',
    'sidebar': 'navigation',
    'form': 'form', 'input': 'form', 'field': 'form', 'checkbox': 'form',
    'toggle': 'form',
    '3d': 'transform3d', 'flip': 'transform3d', 'rotate': 'transform3d',
    'cube': 'transform3d', 'perspective': 'transform3d',
    'filter': 'filter', 'blur': 'filter', 'grayscale': 'filter',
    'micro': 'micro', 'interaction': 'micro', 'feedback': 'micro',
    'like': 'micro', 'notification': 'micro', 'toast': 'micro',
    'scroll': 'scroll', 'viewport': 'scroll', 'parallax': 'scroll',
    'creative': 'creative', 'artistic': 'creative', 'special': 'creative',
    'finance': 'fintech', 'money': 'fintech', 'chart': 'fintech',
    'price': 'fintech', 'stock': 'fintech',
    'game': 'gaming', 'physics': 'gaming', 'health': 'gaming',
    'power': 'gaming', 'level': 'gaming',
    'shop': 'ecommerce', 'cart': 'ecommerce', 'product': 'ecommerce',
    'buy': 'ecommerce',
    'social': 'social', 'like': 'social', 'share': 'social',
    'follow': 'social', 'story': 'social',
    'dashboard': 'dashboard', 'data': 'dashboard', 'metric': 'dashboard',
    'kpi': 'dashboard',
  };

  const animations = animationData.animations || [];

  // Score each animation
  const scored = animations.map(anim => {
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

  return scored
    .filter(a => a._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, count);
}

// ── Start Server ──

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Animotion MCP Server running on stdio');
}

main().catch(console.error);
