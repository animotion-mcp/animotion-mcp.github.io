/**
 * Icon Loader — Loads 15,000+ icons from installed npm packages
 * Supports: Lucide, Heroicons, Tabler, Bootstrap Icons, + built-in Animotion icons
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Scan a directory for SVG files and return icon objects
 */
function scanSVGDirectory(dir, provider, opts = {}) {
  const icons = [];
  if (!existsSync(dir)) return icons;

  const { categoryOverride, styleTag } = opts;

  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      const id = basename(file, '.svg');
      const name = id
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      try {
        const svg = readFileSync(join(dir, file), 'utf-8').trim();
        // Generate tags from the filename
        const tags = id.split(/[-_]/).filter(t => t.length > 1);
        if (styleTag) tags.push(styleTag);

        icons.push({
          id: `${provider}:${id}`,
          name,
          category: categoryOverride || guessCategoryFromName(id),
          tags,
          svg,
          provider,
        });
      } catch {
        // Skip unreadable files
      }
    }
  } catch {
    // Directory not readable
  }

  return icons;
}

/**
 * Guess an icon category from its name
 */
function guessCategoryFromName(name) {
  const n = name.toLowerCase();
  if (/arrow|chevron|caret|direction|sort|move|expand|collapse/.test(n)) return 'arrows';
  if (/home|menu|search|settings|gear|cog|filter|layout|grid|list|table/.test(n)) return 'ui';
  if (/user|people|person|group|team|avatar/.test(n)) return 'people';
  if (/file|folder|document|paper|clipboard|book|note/.test(n)) return 'files';
  if (/mail|message|chat|comment|phone|call|video/.test(n)) return 'communication';
  if (/cart|shop|store|bag|credit|payment|wallet|money|dollar|currency/.test(n)) return 'commerce';
  if (/play|pause|stop|music|volume|speaker|mic|camera|image|photo|film/.test(n)) return 'media';
  if (/code|terminal|bug|git|database|server|cloud|api|cpu|globe|wifi|link/.test(n)) return 'development';
  if (/heart|star|thumb|bookmark|flag|trophy|award|medal/.test(n)) return 'social';
  if (/sun|moon|cloud|rain|snow|wind|thermometer/.test(n)) return 'weather';
  if (/lock|unlock|key|shield|eye|alert|warning|ban|check|x\b/.test(n)) return 'security';
  if (/calendar|clock|watch|timer|alarm/.test(n)) return 'time';
  if (/chart|graph|trend|analytics|bar-chart|pie/.test(n)) return 'charts';
  if (/edit|pen|pencil|brush|paint|color|palette|crop|cut|copy|paste/.test(n)) return 'editing';
  if (/map|pin|location|compass|navigation|globe/.test(n)) return 'maps';
  if (/brand|logo|twitter|facebook|github|google|apple|android/.test(n)) return 'brands';
  return 'general';
}

/**
 * Load all icon providers
 */
export function loadAllIcons() {
  const providers = {};
  const startTime = Date.now();

  // 1. Lucide Icons (~1900 icons)
  const lucideDir = join(__dirname, 'node_modules', 'lucide-static', 'icons');
  providers.lucide = {
    id: 'lucide',
    name: 'Lucide Icons',
    license: 'ISC',
    website: 'https://lucide.dev',
    description: 'Beautiful & consistent open-source icons',
    icons: scanSVGDirectory(lucideDir, 'lucide'),
  };

  // 2. Heroicons - outline (24px)
  const heroOutlineDir = join(__dirname, 'node_modules', 'heroicons', '24', 'outline');
  const heroSolidDir = join(__dirname, 'node_modules', 'heroicons', '24', 'solid');
  const heroOutline = scanSVGDirectory(heroOutlineDir, 'heroicons', { styleTag: 'outline' });
  const heroSolid = scanSVGDirectory(heroSolidDir, 'heroicons', { styleTag: 'solid' });
  // Deduplicate — prefer outline, mark solid variants
  const heroMap = new Map();
  for (const icon of heroOutline) heroMap.set(icon.id, icon);
  for (const icon of heroSolid) {
    const outlineId = icon.id;
    if (!heroMap.has(outlineId)) {
      heroMap.set(outlineId, icon);
    }
  }
  providers.heroicons = {
    id: 'heroicons',
    name: 'Heroicons',
    license: 'MIT',
    website: 'https://heroicons.com',
    description: 'Hand-crafted SVG icons by the Tailwind CSS team',
    icons: Array.from(heroMap.values()),
  };

  // 3. Tabler Icons - outline
  const tablerOutlineDir = join(__dirname, 'node_modules', '@tabler', 'icons', 'icons', 'outline');
  const tablerFilledDir = join(__dirname, 'node_modules', '@tabler', 'icons', 'icons', 'filled');
  const tablerOutline = scanSVGDirectory(tablerOutlineDir, 'tabler', { styleTag: 'outline' });
  const tablerFilled = scanSVGDirectory(tablerFilledDir, 'tabler', { styleTag: 'filled' });
  // Prefer outline, deduplicate
  const tablerMap = new Map();
  for (const icon of tablerOutline) tablerMap.set(icon.id, icon);
  for (const icon of tablerFilled) {
    if (!tablerMap.has(icon.id)) tablerMap.set(icon.id, icon);
  }
  providers.tabler = {
    id: 'tabler',
    name: 'Tabler Icons',
    license: 'MIT',
    website: 'https://tabler.io/icons',
    description: '5000+ free MIT-licensed SVG icons',
    icons: Array.from(tablerMap.values()),
  };

  // 4. Bootstrap Icons
  const bootstrapDir = join(__dirname, 'node_modules', 'bootstrap-icons', 'icons');
  providers.bootstrap = {
    id: 'bootstrap',
    name: 'Bootstrap Icons',
    license: 'MIT',
    website: 'https://icons.getbootstrap.com',
    description: 'Official open-source icon library for Bootstrap',
    icons: scanSVGDirectory(bootstrapDir, 'bootstrap'),
  };

  const elapsed = Date.now() - startTime;
  const totalIcons = Object.values(providers).reduce((sum, p) => sum + p.icons.length, 0);

  return { providers, totalIcons, loadTimeMs: elapsed };
}

/**
 * Build a search index for fast lookups
 */
export function buildSearchIndex(allProviders) {
  const index = new Map(); // keyword -> Set of icon references

  for (const [providerId, provider] of Object.entries(allProviders)) {
    for (const icon of provider.icons) {
      // Index by name words, tags, and category
      const words = new Set([
        ...icon.id.replace(`${providerId}:`, '').split(/[-_]/),
        ...icon.tags,
        icon.category,
      ]);

      for (const word of words) {
        const key = word.toLowerCase();
        if (key.length < 2) continue;
        if (!index.has(key)) index.set(key, []);
        index.get(key).push(icon);
      }
    }
  }

  return index;
}
