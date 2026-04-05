/* ============================================================
   ANIMOTION — Icon Provider System
   Manages multiple icon providers: built-in, free CDN, paid API, custom uploads.
   Provides unified search and retrieval across all providers.
   ============================================================ */

window.ANIMOTION_ICON_PROVIDERS = (function () {
  'use strict';

  // ── Session cache helpers ──

  const CACHE_PREFIX = 'animotion_icons_';

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function cacheSet(key, data) {
    try {
      sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
    } catch { /* sessionStorage full or unavailable */ }
  }

  // ── Icon normalizer ──
  // All providers must return icons in this format:
  //   { id, name, category, tags, svg }

  function normalizeIcon(raw, providerId) {
    return {
      id: raw.id || raw.name || 'unknown',
      name: raw.name || raw.id || 'Unnamed',
      category: raw.category || 'general',
      tags: raw.tags || [],
      svg: raw.svg || '',
      provider: providerId,
    };
  }

  // ── Provider: Built-in ──

  const builtinProvider = {
    id: 'builtin',
    name: 'Animotion Built-in',
    description: '120 hand-crafted, stroke-based SVG icons included with Animotion.',
    website: 'https://github.com/animationiconsmcp/animationiconsmcp.github.io',
    license: 'MIT',
    type: 'builtin',          // builtin | free | paid | custom
    totalIcons: 120,
    loaded: false,
    icons: [],

    async load() {
      if (this.loaded) return this.icons;
      if (window.ANIMOTION_ICONS && window.ANIMOTION_ICONS.icons) {
        this.icons = window.ANIMOTION_ICONS.icons.map(i => normalizeIcon(i, this.id));
        this.totalIcons = this.icons.length;
        this.loaded = true;
      }
      return this.icons;
    },

    getCategories() {
      if (window.ANIMOTION_ICONS) return window.ANIMOTION_ICONS.categories;
      return [];
    },
  };

  // ── Provider: Lucide Icons (free, CDN) ──

  const lucideProvider = {
    id: 'lucide',
    name: 'Lucide Icons',
    description: 'Beautiful & consistent open-source icons. Community fork of Feather Icons.',
    website: 'https://lucide.dev',
    license: 'ISC',
    type: 'free',
    totalIcons: 1500,
    loaded: false,
    icons: [],

    async load() {
      if (this.loaded) return this.icons;

      // Check cache first
      const cached = cacheGet('lucide');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      // Fetch icon node definitions from unpkg CDN
      const url = 'https://unpkg.com/lucide-static@latest/icon-nodes.json';
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch Lucide icons: ${resp.status}`);
      const iconNodes = await resp.json();

      // Convert node tree to SVG strings
      this.icons = Object.entries(iconNodes).map(([name, nodes]) => {
        const inner = nodes.map(([tag, attrs]) => {
          const attrStr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
          return `<${tag} ${attrStr}/>`;
        }).join('');

        const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

        return normalizeIcon({
          id: name,
          name: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          category: 'general',
          tags: name.split('-'),
          svg,
        }, this.id);
      });

      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('lucide', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Heroicons (free, CDN — click to load) ──

  const heroiconsProvider = {
    id: 'heroicons',
    name: 'Heroicons',
    description: 'Beautiful hand-crafted SVG icons by the makers of Tailwind CSS.',
    website: 'https://heroicons.com',
    license: 'MIT',
    type: 'free',
    totalIcons: 300,
    loaded: false,
    icons: [],
    loadInstructions: 'Click "Load Icons" to fetch the Heroicons set from the CDN. Icons are outline style (24x24).',
    cdnUrl: 'https://unpkg.com/heroicons@2.1.5/24/outline/',

    async load() {
      if (this.loaded) return this.icons;

      const cached = cacheGet('heroicons');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      // Heroicons doesn't ship a single JSON manifest publicly, so we fetch
      // a curated set from the package metadata. We request the directory
      // listing from unpkg then fetch individual SVGs.
      // For performance, we fetch a known list of popular icon names.
      const popularNames = [
        'academic-cap','adjustments-horizontal','archive-box','arrow-down','arrow-left',
        'arrow-path','arrow-right','arrow-up','arrow-down-tray','arrow-up-tray',
        'bars-3','bell','bolt','bookmark','briefcase','bug-ant','building-office',
        'cake','calculator','calendar','camera','chart-bar','chart-pie',
        'chat-bubble-left','check','check-circle','chevron-down','chevron-left',
        'chevron-right','chevron-up','clipboard','clock','cloud','code-bracket',
        'cog-6-tooth','command-line','cpu-chip','credit-card','cube',
        'currency-dollar','cursor-arrow-rays','document','document-text',
        'ellipsis-horizontal','envelope','exclamation-circle','exclamation-triangle',
        'eye','eye-slash','face-smile','film','finger-print','fire','flag',
        'folder','funnel','gift','globe-alt','hand-thumb-up','heart',
        'home','identification','inbox','information-circle','key','language',
        'light-bulb','link','list-bullet','lock-closed','lock-open',
        'magnifying-glass','map','map-pin','megaphone','microphone',
        'minus','minus-circle','moon','musical-note','newspaper',
        'no-symbol','paint-brush','paper-airplane','paper-clip','pencil',
        'phone','photo','play','play-circle','plus','plus-circle',
        'power','printer','puzzle-piece','question-mark-circle',
        'queue-list','receipt-percent','rocket-launch','rss',
        'scale','scissors','server','share','shield-check',
        'shopping-bag','shopping-cart','signal','sparkles','speaker-wave',
        'star','stop','sun','swatch','table-cells','tag',
        'ticket','trash','trophy','truck','tv','user',
        'user-circle','user-group','user-plus','users',
        'video-camera','wifi','wrench','x-circle','x-mark',
      ];

      const baseUrl = this.cdnUrl;
      const results = [];

      // Fetch in batches to avoid overwhelming the browser
      const batchSize = 20;
      for (let i = 0; i < popularNames.length; i += batchSize) {
        const batch = popularNames.slice(i, i + batchSize);
        const fetches = batch.map(async (name) => {
          try {
            const resp = await fetch(baseUrl + name + '.svg');
            if (resp.ok) {
              const svg = await resp.text();
              return normalizeIcon({
                id: name,
                name: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                category: 'general',
                tags: name.split('-'),
                svg: svg.trim(),
              }, 'heroicons');
            }
          } catch { /* skip failed icons */ }
          return null;
        });
        const batchResults = await Promise.all(fetches);
        results.push(...batchResults.filter(Boolean));
      }

      this.icons = results;
      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('heroicons', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Tabler Icons (free, CDN — click to load) ──

  const tablerProvider = {
    id: 'tabler',
    name: 'Tabler Icons',
    description: 'Over 5000 free MIT-licensed SVG icons for web design.',
    website: 'https://tabler.io/icons',
    license: 'MIT',
    type: 'free',
    totalIcons: 5000,
    loaded: false,
    icons: [],
    loadInstructions: 'Click "Load Icons" to fetch Tabler Icons from the CDN. This may take a moment due to the large library size.',
    cdnUrl: 'https://unpkg.com/@tabler/icons@latest/icons/',

    async load() {
      if (this.loaded) return this.icons;

      const cached = cacheGet('tabler');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      // Tabler ships thousands of SVGs. We fetch a curated popular subset.
      const popularNames = [
        'home','search','settings','user','heart','star','mail','phone',
        'camera','image','video','music','bell','calendar','clock','map-pin',
        'bookmark','tag','folder','file','file-text','download','upload',
        'cloud','cloud-download','cloud-upload','lock','unlock','key',
        'shield','eye','eye-off','trash','edit','copy','clipboard',
        'check','x','plus','minus','alert-circle','alert-triangle',
        'info-circle','help-circle','arrow-up','arrow-down','arrow-left',
        'arrow-right','chevron-up','chevron-down','chevron-left','chevron-right',
        'menu-2','dots','dots-vertical','external-link','link','unlink',
        'share','send','message','message-circle','at','hash',
        'code','terminal','database','server','cpu','wifi','bluetooth',
        'battery','plug','power','sun','moon','cloud-rain',
        'gift','shopping-cart','credit-card','receipt','coin',
        'building','map','compass','globe','flag','rocket',
        'bug','puzzle','bulb','paint','palette','brush',
        'printer','scan','qrcode','barcode','fingerprint',
        'chart-bar','chart-line','chart-pie','chart-dots',
        'layout-dashboard','layout-grid','layout-list',
        'brand-github','brand-twitter','brand-facebook','brand-instagram',
        'brand-linkedin','brand-youtube','brand-discord','brand-slack',
        'device-desktop','device-mobile','device-tablet',
        'player-play','player-pause','player-stop','player-skip-forward',
        'volume','volume-2','volume-3','microphone',
        'filter','sort-ascending','sort-descending','adjustments',
        'refresh','rotate','maximize','minimize',
        'grip-vertical','drag-drop','hand-move','hand-click',
      ];

      const baseUrl = this.cdnUrl;
      const results = [];
      const batchSize = 20;

      for (let i = 0; i < popularNames.length; i += batchSize) {
        const batch = popularNames.slice(i, i + batchSize);
        const fetches = batch.map(async (name) => {
          try {
            const resp = await fetch(baseUrl + name + '.svg');
            if (resp.ok) {
              const svg = await resp.text();
              return normalizeIcon({
                id: name,
                name: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                category: 'general',
                tags: name.split('-'),
                svg: svg.trim(),
              }, 'tabler');
            }
          } catch { /* skip */ }
          return null;
        });
        const batchResults = await Promise.all(fetches);
        results.push(...batchResults.filter(Boolean));
      }

      this.icons = results;
      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('tabler', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Bootstrap Icons (free, CDN — click to load) ──

  const bootstrapProvider = {
    id: 'bootstrap',
    name: 'Bootstrap Icons',
    description: 'Official open-source SVG icon library for Bootstrap with over 2000 icons.',
    website: 'https://icons.getbootstrap.com',
    license: 'MIT',
    type: 'free',
    totalIcons: 2000,
    loaded: false,
    icons: [],
    loadInstructions: 'Click "Load Icons" to fetch Bootstrap Icons from the CDN.',
    cdnUrl: 'https://unpkg.com/bootstrap-icons@latest/icons/',

    async load() {
      if (this.loaded) return this.icons;

      const cached = cacheGet('bootstrap');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      const popularNames = [
        'house','search','gear','person','heart','star','envelope','telephone',
        'camera','image','film','music-note','bell','calendar','clock','geo-alt',
        'bookmark','tag','folder','file-earmark','file-text','download','upload',
        'cloud','cloud-download','cloud-upload','lock','unlock','key',
        'shield','eye','eye-slash','trash','pencil','clipboard','clipboard-check',
        'check-lg','x-lg','plus-lg','dash-lg','exclamation-circle','exclamation-triangle',
        'info-circle','question-circle','arrow-up','arrow-down','arrow-left',
        'arrow-right','chevron-up','chevron-down','chevron-left','chevron-right',
        'list','three-dots','three-dots-vertical','box-arrow-up-right','link-45deg',
        'share','send','chat','chat-dots','at','hash',
        'code-slash','terminal','database','hdd','cpu','wifi','bluetooth',
        'battery','plug','power','sun','moon','cloud-rain',
        'gift','cart','credit-card','receipt','coin',
        'building','map','compass','globe','flag','rocket',
        'bug','puzzle','lightbulb','palette','brush',
        'printer','upc-scan','qr-code',
        'bar-chart','graph-up','pie-chart',
        'grid','layout-text-sidebar','card-list',
        'github','twitter','facebook','instagram','linkedin','youtube','discord','slack',
        'display','phone','tablet',
        'play','pause','stop','skip-forward',
        'volume-up','volume-down','volume-mute','mic',
        'funnel','sort-alpha-down','sort-alpha-up','sliders',
        'arrow-clockwise','arrow-counterclockwise','fullscreen','fullscreen-exit',
        'grip-vertical','hand-index','hand-index-thumb',
      ];

      const baseUrl = this.cdnUrl;
      const results = [];
      const batchSize = 20;

      for (let i = 0; i < popularNames.length; i += batchSize) {
        const batch = popularNames.slice(i, i + batchSize);
        const fetches = batch.map(async (name) => {
          try {
            const resp = await fetch(baseUrl + name + '.svg');
            if (resp.ok) {
              const svg = await resp.text();
              return normalizeIcon({
                id: name,
                name: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                category: 'general',
                tags: name.split('-'),
                svg: svg.trim(),
              }, 'bootstrap');
            }
          } catch { /* skip */ }
          return null;
        });
        const batchResults = await Promise.all(fetches);
        results.push(...batchResults.filter(Boolean));
      }

      this.icons = results;
      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('bootstrap', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Font Awesome Pro (paid) ──

  const fontAwesomeProProvider = {
    id: 'fontawesome-pro',
    name: 'Font Awesome Pro',
    description: 'Premium icon library with 26,000+ icons in multiple styles. Requires a Font Awesome Pro Kit ID.',
    website: 'https://fontawesome.com',
    license: 'Commercial (Font Awesome Pro License)',
    type: 'paid',
    totalIcons: 26000,
    loaded: false,
    icons: [],
    apiKey: '',   // User's Kit ID / token
    apiKeyLabel: 'Font Awesome Kit ID',
    apiKeyPlaceholder: 'e.g., abc1234def',
    apiKeyHelp: 'Find your Kit ID at fontawesome.com/kits. Your key is used client-side only and never stored on any server.',

    setApiKey(key) {
      this.apiKey = key.trim();
    },

    async load() {
      if (!this.apiKey) {
        throw new Error('Font Awesome Pro requires a Kit ID. Enter your Kit ID above.');
      }
      if (this.loaded) return this.icons;

      const cached = cacheGet('fontawesome-pro');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      // Font Awesome Pro loads via a kit script. We fetch the kit JS and
      // parse icon metadata from the FA GraphQL API.
      const kitUrl = `https://kit.fontawesome.com/${this.apiKey}.js`;

      // Inject the kit script
      const script = document.createElement('script');
      script.src = kitUrl;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Use the FA GraphQL API to get icon list
      const resp = await fetch('https://api.fontawesome.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ release(version:"6.x") { icons(first:500) { id label styles } } }`,
        }),
      });

      if (!resp.ok) throw new Error('Failed to fetch Font Awesome icon catalog. Check your Kit ID.');

      const data = await resp.json();
      const faIcons = data?.data?.release?.icons || [];

      this.icons = faIcons.map(fa => normalizeIcon({
        id: fa.id,
        name: fa.label || fa.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        category: 'general',
        tags: [fa.id, ...(fa.styles || [])],
        svg: `<i class="fa-solid fa-${fa.id}" style="font-size:24px"></i>`, // FA uses font icons via kit
      }, this.id));

      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('fontawesome-pro', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Streamline Icons (paid) ──

  const streamlineProvider = {
    id: 'streamline',
    name: 'Streamline Icons',
    description: 'Premium icon library with 180,000+ icons in multiple weights. Requires an API key.',
    website: 'https://streamlinehq.com',
    license: 'Commercial (Streamline License)',
    type: 'paid',
    totalIcons: 180000,
    loaded: false,
    icons: [],
    apiKey: '',
    apiKeyLabel: 'Streamline API Key',
    apiKeyPlaceholder: 'Your Streamline API key',
    apiKeyHelp: 'Get your API key at streamlinehq.com/developers. Your key is used client-side only and never stored on any server.',

    setApiKey(key) {
      this.apiKey = key.trim();
    },

    async load() {
      if (!this.apiKey) {
        throw new Error('Streamline requires an API key. Enter your API key above.');
      }
      if (this.loaded) return this.icons;

      const cached = cacheGet('streamline');
      if (cached) {
        this.icons = cached;
        this.loaded = true;
        this.totalIcons = this.icons.length;
        return this.icons;
      }

      // Fetch icons from Streamline API
      const resp = await fetch(`https://api.streamlinehq.com/v2/icons?limit=500`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!resp.ok) throw new Error('Failed to fetch Streamline icons. Check your API key.');

      const data = await resp.json();
      const slIcons = data?.icons || data?.data || [];

      this.icons = slIcons.map(sl => normalizeIcon({
        id: sl.slug || sl.id,
        name: sl.name || sl.slug || 'Unnamed',
        category: sl.family || 'general',
        tags: sl.tags || [],
        svg: sl.svg || sl.body || '',
      }, this.id));

      this.totalIcons = this.icons.length;
      this.loaded = true;
      cacheSet('streamline', this.icons);
      return this.icons;
    },

    getCategories() {
      return [{ id: 'general', name: 'All', count: this.totalIcons }];
    },
  };

  // ── Provider: Custom (user uploads) ──

  const customProvider = {
    id: 'custom',
    name: 'Custom Icons',
    description: 'Upload your own SVG icons. They stay in your browser session only.',
    website: '',
    license: 'Your own',
    type: 'custom',
    totalIcons: 0,
    loaded: true,  // always "loaded" — icons added on the fly
    icons: [],

    async load() {
      // Restore from sessionStorage if available
      const cached = cacheGet('custom');
      if (cached && this.icons.length === 0) {
        this.icons = cached;
        this.totalIcons = this.icons.length;
      }
      return this.icons;
    },

    addIcon(id, name, svg, tags) {
      const icon = normalizeIcon({ id, name, category: 'custom', tags: tags || [], svg }, this.id);
      // Prevent duplicates
      this.icons = this.icons.filter(i => i.id !== id);
      this.icons.push(icon);
      this.totalIcons = this.icons.length;
      cacheSet('custom', this.icons);
      return icon;
    },

    removeIcon(id) {
      this.icons = this.icons.filter(i => i.id !== id);
      this.totalIcons = this.icons.length;
      cacheSet('custom', this.icons);
    },

    getCategories() {
      return [{ id: 'custom', name: 'Custom', count: this.totalIcons }];
    },
  };

  // ── Provider Registry ──

  const providers = {
    'builtin':          builtinProvider,
    'lucide':           lucideProvider,
    'heroicons':        heroiconsProvider,
    'tabler':           tablerProvider,
    'bootstrap':        bootstrapProvider,
    'fontawesome-pro':  fontAwesomeProProvider,
    'streamline':       streamlineProvider,
    'custom':           customProvider,
  };

  let activeProviderId = 'builtin';

  // ── Public API ──

  /**
   * Get a list of all registered providers with metadata.
   */
  function listProviders() {
    return Object.values(providers).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      website: p.website,
      license: p.license,
      type: p.type,
      totalIcons: p.totalIcons,
      loaded: p.loaded,
      requiresApiKey: p.type === 'paid',
      apiKeyLabel: p.apiKeyLabel || null,
    }));
  }

  /**
   * Get the currently active provider ID.
   */
  function getActiveProviderId() {
    return activeProviderId;
  }

  /**
   * Set the active provider.
   */
  function setActiveProvider(id) {
    if (!providers[id]) throw new Error(`Unknown provider: ${id}`);
    activeProviderId = id;
  }

  /**
   * Get a provider object by ID.
   */
  function getProvider(id) {
    return providers[id] || null;
  }

  /**
   * Load icons for a provider (async). Returns the icon array.
   */
  async function loadProvider(id) {
    const prov = providers[id];
    if (!prov) throw new Error(`Unknown provider: ${id}`);
    return prov.load();
  }

  /**
   * Get a single icon by its ID, optionally specifying a provider.
   * If no provider given, searches the active provider first then built-in.
   */
  function getIcon(providerId, iconId) {
    if (providerId && providers[providerId]) {
      return providers[providerId].icons.find(i => i.id === iconId) || null;
    }
    // Search active provider
    const active = providers[activeProviderId];
    if (active) {
      const found = active.icons.find(i => i.id === iconId);
      if (found) return found;
    }
    // Fallback to built-in
    if (activeProviderId !== 'builtin') {
      return builtinProvider.icons.find(i => i.id === iconId) || null;
    }
    return null;
  }

  /**
   * Search icons across one or all providers.
   * @param {string} query - search query
   * @param {string} [providerId] - limit to one provider (or search active if omitted)
   * @returns {Array} matching icons
   */
  function searchIcons(query, providerId) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return [];

    const targets = providerId
      ? [providers[providerId]].filter(Boolean)
      : [providers[activeProviderId]];

    const results = [];
    for (const prov of targets) {
      if (!prov.loaded) continue;
      for (const icon of prov.icons) {
        if (
          icon.id.toLowerCase().includes(q) ||
          icon.name.toLowerCase().includes(q) ||
          icon.tags.some(t => t.toLowerCase().includes(q))
        ) {
          results.push(icon);
        }
      }
    }
    return results;
  }

  /**
   * Search icons across ALL loaded providers.
   */
  function searchAllIcons(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return [];

    const results = [];
    for (const prov of Object.values(providers)) {
      if (!prov.loaded) continue;
      for (const icon of prov.icons) {
        if (
          icon.id.toLowerCase().includes(q) ||
          icon.name.toLowerCase().includes(q) ||
          icon.tags.some(t => t.toLowerCase().includes(q))
        ) {
          results.push(icon);
        }
      }
    }
    return results;
  }

  /**
   * Add a custom SVG icon.
   */
  function addCustomIcon(id, name, svg, tags) {
    return customProvider.addIcon(id, name, svg, tags);
  }

  /**
   * Remove a custom icon.
   */
  function removeCustomIcon(id) {
    customProvider.removeIcon(id);
  }

  // ── Expose public API ──

  return {
    providers,
    listProviders,
    getActiveProviderId,
    setActiveProvider,
    getProvider,
    loadProvider,
    getIcon,
    searchIcons,
    searchAllIcons,
    addCustomIcon,
    removeCustomIcon,
  };

})();
