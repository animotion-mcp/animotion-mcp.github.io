/* ============================================================
   ANIMOTION — App Controller
   Handles: filtering, search, rendering, modals, pagination,
   routing, hero showcase, syntax highlighting, accessibility
   ============================================================ */

(function () {
  'use strict';

  // ── State ──
  const state = {
    activeCategory: 'all',
    activeSubcategory: null,
    searchQuery: '',
    viewMode: 'grid',
    activeTab: 'animations',
    theme: localStorage.getItem('animotion-theme') || 'light',
    filtered: [],
    pageSize: 48,
    currentPage: 1,
    previewText: '',
    animSpeed: 1,
  };

  // ── DOM Cache ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Style Manager (lazy injection via separate style elements) ──
  const StyleManager = {
    injected: new Set(),
    baseEl: null,

    ensure(animations) {
      if (!this.baseEl) {
        this.baseEl = document.createElement('style');
        this.baseEl.id = 'animotion-base-styles';
        this.baseEl.textContent = `
          /* Animations paused by default, play on card hover */
          .anim-card-preview [data-animate] {
            animation-play-state: paused !important;
            will-change: transform, opacity;
          }
          .anim-card:hover .anim-card-preview [data-animate],
          .anim-card.playing .anim-card-preview [data-animate] {
            animation-play-state: running !important;
          }
          /* Auto-play mode when toggled */
          .anim-grid.autoplay .anim-card-preview [data-animate] {
            animation-play-state: running !important;
            animation-iteration-count: infinite !important;
            animation-direction: alternate !important;
          }
        `;
        document.head.appendChild(this.baseEl);
      }
      const newCSS = [];
      for (const a of animations) {
        if (!this.injected.has(a.id)) {
          this.injected.add(a.id);
          newCSS.push(a.keyframeCSS + '\n' + a.css);
        }
      }
      if (newCSS.length) {
        const el = document.createElement('style');
        el.textContent = newCSS.join('\n');
        document.head.appendChild(el);
      }
    }
  };

  // ── SVG Icons ──
  const UI_ICONS = {
    sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    replay: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  };

  // ── Category Groups ──
  const CATEGORY_GROUPS = [
    { name: 'Core', ids: ['entrance', 'exit', 'attention'] },
    { name: 'Elements', ids: ['text', 'button', 'card', 'form', 'navigation'] },
    { name: 'Effects', ids: ['background', 'filter', 'transform3d', 'creative'] },
    { name: 'Loaders', ids: ['loader'] },
    { name: 'Interactions', ids: ['micro', 'scroll'] },
    { name: 'Industry', ids: ['fintech', 'gaming', 'ecommerce', 'social', 'dashboard'] },
  ];

  // ── Featured animations for hero ──
  const FEATURED_IDS = ['E01', 'A01', 'L01', 'T01', 'CR01', 'BT01'];

  // ── Initialize ──
  function init() {
    if (!window.ANIMOTION_DATA) {
      const grid = $('#anim-grid');
      if (grid) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><h3>Failed to load animation data</h3><p>Please refresh the page or check your connection.</p></div>';
      }
      return;
    }

    applyTheme(state.theme);
    renderSidebar();
    renderHeroShowcase();
    renderStats();
    handleRoute();
    bindEvents();
  }

  // ── Theme ──
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    state.theme = theme;
    localStorage.setItem('animotion-theme', theme);
    const btn = $('#theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? UI_ICONS.sun : UI_ICONS.moon;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // ── Hero Showcase ──
  function renderHeroShowcase() {
    const container = $('#hero-showcase');
    if (!container || !window.ANIMOTION_DATA) return;

    const { animations } = window.ANIMOTION_DATA;
    const featured = FEATURED_IDS.map(id => animations.find(a => a.id === id)).filter(Boolean);

    // Only show if reduced motion is not preferred
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    StyleManager.ensure(featured);

    container.innerHTML = featured.map(anim => `
      <div class="hero-showcase-item">
        <div class="hero-showcase-demo">
          <div class="demo-box ${prefersReduced ? '' : anim.cssClass}" ${prefersReduced ? '' : `data-animate="${anim.cssClass}"`} style="animation-iteration-count:infinite;animation-timing-function:ease-in-out;will-change:transform,opacity;"></div>
        </div>
        <span class="hero-showcase-label">${escapeHTML(anim.name)}</span>
      </div>
    `).join('');
  }

  // ── Sidebar Categories (collapsible groups) ──
  function renderSidebar() {
    const nav = $('#cat-nav');
    if (!nav || !window.ANIMOTION_DATA) return;

    const { categories, animations } = window.ANIMOTION_DATA;
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c; });

    let html = `
      <button class="cat-item active" data-cat="all">
        <span class="cat-dot" style="background: var(--accent)"></span>
        All Animations
        <span class="cat-count">${animations.length}</span>
      </button>
    `;

    CATEGORY_GROUPS.forEach(group => {
      const groupCats = group.ids.map(id => catMap[id]).filter(Boolean);
      if (groupCats.length === 0) return;

      html += `<details class="cat-group" open>`;
      html += `<summary>${escapeHTML(group.name)}</summary>`;
      html += `<div class="cat-group-items">`;

      groupCats.forEach(cat => {
        const count = animations.filter(a => a.category === cat.id).length;
        html += `
          <button class="cat-item" data-cat="${escapeAttr(cat.id)}">
            <span class="cat-dot" style="background: var(--cat-${escapeAttr(cat.id)})"></span>
            ${escapeHTML(cat.name)}
            <span class="cat-count">${count}</span>
          </button>
        `;
      });

      html += `</div></details>`;
    });

    nav.innerHTML = html;
  }

  // ── Stats ──
  function renderStats() {
    if (!window.ANIMOTION_DATA) return;
    const { categories, animations } = window.ANIMOTION_DATA;
    const total = animations.length;
    const catCount = categories.length;

    const totalEl = $('#stat-total');
    const catEl = $('#stat-categories');
    const heroCount = $('#hero-count');
    const heroCatCount = $('#hero-cat-count');
    const footerCount = $('#footer-count');

    if (totalEl) totalEl.textContent = total;
    if (catEl) catEl.textContent = catCount;
    if (heroCount) heroCount.textContent = total;
    if (heroCatCount) heroCatCount.textContent = catCount;
    if (footerCount) footerCount.textContent = total + '+';
    const heroIconCount = $('#hero-icon-count');
    if (heroIconCount) heroIconCount.textContent = '9,000+';
  }

  // ── Filter & Render ──
  function filterAndRender() {
    if (!window.ANIMOTION_DATA) return;
    const { animations } = window.ANIMOTION_DATA;

    let filtered = animations;

    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category === state.activeCategory);
    }

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.cssClass.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    }

    state.filtered = filtered;
    state.currentPage = 1;
    renderGrid(filtered);
    updateToolbar(filtered.length);
  }

  // ── Render Grid (paginated) ──
  function renderGrid(animations) {
    const grid = $('#anim-grid');
    if (!grid) return;

    if (animations.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <h3>No animations found</h3>
          <p>Try a different search term or category</p>
        </div>
      `;
      return;
    }

    const end = state.currentPage * state.pageSize;
    const visible = animations.slice(0, end);
    const hasMore = animations.length > end;

    // Lazy-inject styles for visible animations
    StyleManager.ensure(visible);

    let html = visible.map(anim => createCardHTML(anim)).join('');

    if (hasMore) {
      html += `
        <div class="load-more-container" id="load-more-sentinel">
          <button class="load-more-btn" id="load-more-btn">
            Load More (${animations.length - end} remaining)
          </button>
        </div>
      `;
    }

    grid.innerHTML = html;

    // Animations are already applied via CSS class — they start paused
    // and play on hover. No need for reflow hacks.
    requestAnimationFrame(() => {
      if (state.animSpeed !== 1) {
        applySpeed(state.animSpeed);
      }
    });

    // Setup IntersectionObserver for infinite scroll
    if (hasMore) {
      const sentinel = $('#load-more-sentinel');
      if (sentinel) {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            loadNextPage();
          }
        }, { rootMargin: '300px' });
        observer.observe(sentinel);
      }
    }
  }

  // ── Load next page ──
  function loadNextPage() {
    state.currentPage++;
    renderGrid(state.filtered);
  }

  // ── Create Card HTML ──
  function createCardHTML(anim) {
    const catColor = `var(--cat-${anim.category})`;
    const demoHTML = getDemoHTML(anim);

    return `
      <div class="anim-card" tabindex="0" role="button" data-id="${escapeAttr(anim.id)}">
        <div class="anim-card-preview" style="--card-cat-color: ${catColor}">
          ${demoHTML}
          <span class="anim-card-play-hint">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span class="play-hint-desktop">Hover to play</span><span class="play-hint-touch">Tap to preview</span>
          </span>
          <button class="anim-card-replay" title="Replay" aria-label="Replay ${escapeAttr(anim.name)}">
            ${UI_ICONS.replay}
          </button>
          <button class="anim-card-copy" data-class=".${escapeAttr(anim.cssClass)}" title="Copy class name">
            ${UI_ICONS.copy} .${escapeHTML(anim.cssClass)}
          </button>
        </div>
        <div class="anim-card-info">
          <div class="anim-card-name">
            ${escapeHTML(anim.name)}
            <span class="anim-card-category" style="background: ${catColor}20; color: ${catColor}">${escapeHTML(anim.category)}</span>
          </div>
          <div class="anim-card-desc">${escapeHTML(anim.description)}</div>
          <div class="anim-card-tags">
            <span class="anim-card-tag">.${escapeHTML(anim.cssClass)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Demo Element HTML ──
  function getDemoHTML(anim, forceText) {
    const cls = anim.cssClass;
    const animAttr = `data-animate="${escapeAttr(cls)}"`;
    const customText = forceText || state.previewText;

    // If user typed custom text, show it as animated text for ALL demo types
    if (customText) {
      return `<div class="demo-text ${cls}" ${animAttr}>${escapeHTML(customText)}</div>`;
    }

    switch (anim.demoType) {
      case 'text':
        return `<div class="demo-text ${cls}" ${animAttr}>Animotion</div>`;
      case 'button':
        return `<div class="demo-button ${cls}" ${animAttr}>Click Me</div>`;
      case 'card':
        return `<div class="demo-card ${cls}" ${animAttr}></div>`;
      case 'circle':
        return `<div class="demo-circle ${cls}" ${animAttr}></div>`;
      case 'dots':
        return `<div class="demo-dots ${cls}" ${animAttr}><span></span><span></span><span></span></div>`;
      case 'bars':
        return `<div class="demo-bars ${cls}" ${animAttr}><span style="height:20px"></span><span style="height:32px"></span><span style="height:16px"></span><span style="height:28px"></span><span style="height:24px"></span></div>`;
      case 'background':
        return `<div class="demo-background ${cls}" ${animAttr}></div>`;
      case 'nav':
        return `<div class="demo-nav ${cls}" ${animAttr}><span>Home</span><span>About</span><span>Contact</span></div>`;
      case 'input':
        return `<div class="demo-input ${cls}" ${animAttr}></div>`;
      case 'image':
        return `<div class="demo-image ${cls}" ${animAttr}></div>`;
      default:
        return `<div class="demo-box ${cls}" ${animAttr}></div>`;
    }
  }

  // ── Trigger Animation ──
  function triggerAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  // ── Replay Animation ──
  function replay(id) {
    const card = $(`.anim-card[data-id="${id}"]`);
    if (!card) return;
    const el = $('[data-animate]', card);
    if (!el) return;
    const cls = el.dataset.animate;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ── Update Toolbar ──
  function updateToolbar(totalCount) {
    const countEl = $('#toolbar-count');
    const nameEl = $('#toolbar-category-name');

    const visibleCount = Math.min(state.currentPage * state.pageSize, totalCount);

    if (countEl) {
      if (totalCount > state.pageSize) {
        countEl.textContent = `Showing ${visibleCount} of ${totalCount}`;
      } else {
        countEl.textContent = `${totalCount} animation${totalCount !== 1 ? 's' : ''}`;
      }
    }

    if (nameEl) {
      if (state.activeCategory === 'all') {
        nameEl.textContent = 'All Animations';
      } else {
        const cat = window.ANIMOTION_DATA.categories.find(c => c.id === state.activeCategory);
        nameEl.textContent = cat ? cat.name : 'All Animations';
      }
    }
  }

  // ── Open Modal ──
  let focusTrapCleanup = null;
  let previousFocus = null;

  function openModal(id) {
    if (!window.ANIMOTION_DATA) return;
    const anim = window.ANIMOTION_DATA.animations.find(a => a.id === id);
    if (!anim) return;

    // Lazy-inject styles for this animation
    StyleManager.ensure([anim]);

    const overlay = $('#modal-overlay');
    if (!overlay) return;

    previousFocus = document.activeElement;

    // Fill modal content
    $('#modal-title').textContent = anim.name;

    // Copy class button
    const copyClassBtn = $('#modal-copy-class');
    if (copyClassBtn) {
      copyClassBtn.dataset.class = '.' + anim.cssClass;
    }

    // Preview
    const previewArea = $('#modal-preview-area');
    const demoHTML = getDemoHTML(anim);
    previewArea.innerHTML = demoHTML;
    requestAnimationFrame(() => {
      const el = $('[data-animate]', previewArea);
      if (el) triggerAnimation(el, el.dataset.animate);
    });

    // Meta
    $('#modal-meta').innerHTML = `
      <span class="meta-chip"><strong>Category:</strong> ${escapeHTML(anim.category)}</span>
      <span class="meta-chip"><strong>Duration:</strong> ${escapeHTML(anim.duration)}</span>
      <span class="meta-chip"><strong>Easing:</strong> ${escapeHTML(anim.timingFunction)}</span>
      <span class="meta-chip"><strong>Class:</strong> .${escapeHTML(anim.cssClass)}</span>
    `;

    // CSS code with syntax highlighting
    const cssCode = `/* Keyframe */\n${anim.keyframeCSS}\n\n/* Usage */\n${anim.css}`;
    $('#modal-css-code').innerHTML = highlightCSS(cssCode);

    // HTML code
    const htmlCode = `<!-- Add the animation class to any element -->\n<div class="${anim.cssClass}">Your content here</div>\n\n<!-- With utility classes -->\n<div class="${anim.cssClass} animotion-duration-1000 animotion-delay-200">\n  Your content here\n</div>`;
    $('#modal-html-code').innerHTML = highlightHTML(htmlCode);

    // JS code
    const jsCode = `// Trigger animation programmatically\nconst el = document.querySelector('.my-element');\nel.classList.add('${anim.cssClass}');\n\n// Replay animation\nfunction replayAnimation(element) {\n  element.classList.remove('${anim.cssClass}');\n  void element.offsetWidth; // force reflow\n  element.classList.add('${anim.cssClass}');\n}\n\n// Listen for animation end\nel.addEventListener('animationend', () => {\n  console.log('Animation complete!');\n});`;
    $('#modal-js-code').innerHTML = highlightJS(jsCode);

    // Show CSS tab by default
    setModalTab('css');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update URL hash
    history.pushState(null, '', '#/animation/' + anim.id);

    // Focus trap
    focusTrapCleanup = trapFocus(overlay.querySelector('.modal'));
  }

  // ── Close Modal ──
  function closeModal() {
    const overlay = $('#modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';

    if (focusTrapCleanup) {
      focusTrapCleanup();
      focusTrapCleanup = null;
    }

    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }

    // Restore URL hash to category
    if (state.activeCategory !== 'all') {
      history.pushState(null, '', '#/category/' + state.activeCategory);
    } else {
      history.pushState(null, '', window.location.pathname);
    }
  }

  // ── Focus Trap ──
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return () => {};

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    modal.addEventListener('keydown', handleTab);
    first.focus();
    return () => modal.removeEventListener('keydown', handleTab);
  }

  // ── Modal Tab Switch ──
  function setModalTab(tab) {
    $$('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    $$('.modal-code-panel').forEach(p => {
      const isActive = p.dataset.panel === tab;
      p.style.display = isActive ? 'block' : 'none';
      p.classList.toggle('active', isActive);
    });
  }

  // ── Copy to Clipboard ──
  function copyCode(btnEl, text) {
    navigator.clipboard.writeText(text).then(() => {
      btnEl.classList.add('copied');
      const originalText = btnEl.innerHTML;
      btnEl.innerHTML = '&#10003; Copied!';
      setTimeout(() => {
        btnEl.classList.remove('copied');
        btnEl.innerHTML = originalText;
      }, 2000);
      showToast('Code copied to clipboard!');
    });
  }

  // ── Toast ──
  function showToast(message) {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ── Syntax Highlighting ──
  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightCSS(code) {
    let escaped = escapeHTML(code);
    // Comments
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
    // @keyframes, from, to
    escaped = escaped.replace(/(@keyframes|@media)\b/g, '<span class="hl-keyword">$1</span>');
    escaped = escaped.replace(/\b(from|to)\b(?=\s*\{)/g, '<span class="hl-keyword">$1</span>');
    // Selectors (lines starting with . or @)
    escaped = escaped.replace(/(^|\n)(\.[\w-]+)/g, '$1<span class="hl-selector">$2</span>');
    // Properties
    escaped = escaped.replace(/([\w-]+)(\s*:)/g, '<span class="hl-property">$1</span>$2');
    // Values after colon
    escaped = escaped.replace(/(:\s*)([^;{}\n]+)/g, '$1<span class="hl-value">$2</span>');
    return escaped;
  }

  function highlightHTML(code) {
    let escaped = escapeHTML(code);
    // Comments
    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>');
    // Tags
    escaped = escaped.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="hl-keyword">$2</span>');
    // Attributes
    escaped = escaped.replace(/([\w-]+)(=)/g, '<span class="hl-property">$1</span>$2');
    // Strings
    escaped = escaped.replace(/(&quot;[^&]*?&quot;)/g, '<span class="hl-string">$1</span>');
    return escaped;
  }

  function highlightJS(code) {
    let escaped = escapeHTML(code);
    // Comments
    escaped = escaped.replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>');
    // Keywords
    escaped = escaped.replace(/\b(const|let|var|function|return|if|else|new|void)\b/g, '<span class="hl-keyword">$1</span>');
    // Strings
    escaped = escaped.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="hl-string">$1</span>');
    // Methods
    escaped = escaped.replace(/\.(querySelector|classList|add|remove|addEventListener|log|offsetWidth)\b/g, '.<span class="hl-property">$1</span>');
    return escaped;
  }

  // ── URL Hash Routing ──
  function handleRoute() {
    const hash = location.hash;

    // Allow native browser anchor scrolling for simple anchors like #app, #get-started
    if (hash === '#app' || hash === '#get-started' || hash === '#hero' || hash === '#mcp-section') {
      return; // Let the browser handle native anchor scrolling
    }

    const path = hash.slice(1) || '/';
    const parts = path.split('/').filter(Boolean);

    if (parts[0] === 'category' && parts[1]) {
      state.activeCategory = parts[1];
      $$('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === parts[1]));
      filterAndRender();
      scrollToApp();
    } else if (parts[0] === 'animation' && parts[1]) {
      filterAndRender();
      setTimeout(() => openModal(parts[1]), 100);
    } else {
      state.activeCategory = 'all';
      $$('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
      filterAndRender();
    }
  }

  function scrollToApp() {
    const app = $('#app');
    if (app) {
      const top = app.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // ── PNG Animator (init) ──
  function initPNGAnimator() {
    const zone = $('#png-upload-zone');
    const input = $('#png-file-input');
    const preview = $('#png-preview-img');
    const animSelect = $('#png-anim-select');

    if (!zone || !input) return;

    if (window.ANIMOTION_DATA && animSelect) {
      const { categories, animations } = window.ANIMOTION_DATA;
      let optHTML = '<option value="">Select an animation...</option>';
      categories.forEach(cat => {
        const catAnims = animations.filter(a => a.category === cat.id);
        optHTML += `<optgroup label="${escapeAttr(cat.name)}">`;
        catAnims.forEach(a => {
          optHTML += `<option value="${escapeAttr(a.cssClass)}">${escapeHTML(a.name)}</option>`;
        });
        optHTML += '</optgroup>';
      });
      animSelect.innerHTML = optHTML;
    }

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleImageFile(file);
    });

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', e => {
      if (e.target.files[0]) handleImageFile(e.target.files[0]);
    });

    if (animSelect) {
      animSelect.addEventListener('change', () => {
        if (!preview) return;
        const classes = [...preview.classList].filter(c => c.startsWith('animotion-'));
        classes.forEach(c => preview.classList.remove(c));
        if (animSelect.value) {
          // Ensure styles are injected for this animation
          const anim = window.ANIMOTION_DATA.animations.find(a => a.cssClass === animSelect.value);
          if (anim) StyleManager.ensure([anim]);
          void preview.offsetWidth;
          preview.classList.add(animSelect.value);
        }
      });
    }
  }

  function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = $('#png-preview-img');
      const container = $('#png-preview-container');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      }
      if (container) container.style.display = 'flex';
      const controls = $('#png-controls');
      if (controls) controls.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function exportPNGCSS() {
    const animSelect = $('#png-anim-select');
    const durationInput = $('#png-duration');
    const easingSelect = $('#png-easing');

    if (!animSelect || !animSelect.value) {
      showToast('Please select an animation first');
      return;
    }

    const anim = window.ANIMOTION_DATA.animations.find(a => a.cssClass === animSelect.value);
    if (!anim) return;

    const duration = durationInput ? durationInput.value || anim.duration : anim.duration;
    const easing = easingSelect ? easingSelect.value || anim.timingFunction : anim.timingFunction;

    const code = `${anim.keyframeCSS}\n\n.my-animated-image {\n  animation: ${anim.keyframeName} ${duration} ${easing} both;\n}`;

    navigator.clipboard.writeText(code).then(() => {
      showToast('CSS code copied! Paste it into your stylesheet.');
    });
  }

  // ── Apply Animation Speed ──
  function applySpeed(multiplier) {
    const grid = $('#anim-grid');
    if (!grid) return;
    const elements = grid.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      const computed = getComputedStyle(el);
      const current = parseFloat(computed.animationDuration) || 1;
      // Store original duration on first call
      if (!el.dataset.origDuration) {
        el.dataset.origDuration = current;
      }
      const orig = parseFloat(el.dataset.origDuration);
      el.style.animationDuration = (orig / multiplier) + 's';
    });
  }

  // ── Bind Events (all event delegation, no inline onclick) ──
  function bindEvents() {
    // Category clicks
    document.addEventListener('click', e => {
      const catBtn = e.target.closest('.cat-item');
      if (catBtn) {
        $$('.cat-item').forEach(b => b.classList.remove('active'));
        catBtn.classList.add('active');
        state.activeCategory = catBtn.dataset.cat;
        history.pushState(null, '', catBtn.dataset.cat === 'all' ? window.location.pathname : '#/category/' + catBtn.dataset.cat);
        filterAndRender();
        scrollToApp();

        // Close mobile sidebar
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        const toggle = $('#sidebar-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Card interactions (event delegation)
    document.addEventListener('click', e => {
      // Quick copy class
      const copyBtn = e.target.closest('.anim-card-copy');
      if (copyBtn) {
        e.stopPropagation();
        const className = copyBtn.dataset.class;
        navigator.clipboard.writeText(className).then(() => {
          showToast('Class name copied: ' + className);
        });
        return;
      }

      // Replay
      const replayBtn = e.target.closest('.anim-card-replay');
      if (replayBtn) {
        e.stopPropagation();
        const card = replayBtn.closest('.anim-card');
        if (card) replay(card.dataset.id);
        return;
      }

      // Open modal on card click
      const card = e.target.closest('.anim-card');
      if (card) {
        openModal(card.dataset.id);
        return;
      }

      // Load more button
      if (e.target.closest('#load-more-btn')) {
        loadNextPage();
        return;
      }
    });

    // Keyboard support for cards
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.anim-card');
        if (card) {
          e.preventDefault();
          openModal(card.dataset.id);
        }
      }
    });

    // Touch: tap card to toggle play
    if ('ontouchstart' in window) {
      document.addEventListener('touchend', e => {
        const card = e.target.closest('.anim-card');
        if (card && !e.target.closest('.anim-card-copy') && !e.target.closest('.anim-card-replay')) {
          const el = card.querySelector('[data-animate]');
          if (el && !card.classList.contains('playing')) {
            e.preventDefault();
            card.classList.add('playing');
            setTimeout(() => card.classList.remove('playing'), 2000);
          }
        }
      });
    }

    // Search
    const searchInput = $('#search-input');
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', e => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.searchQuery = e.target.value;
          filterAndRender();
          if (state.searchQuery) scrollToApp();
        }, 200);
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        closeModal();
        if (searchInput) searchInput.blur();
      }
    });

    // Theme toggle
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.add('theme-transitioning');
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 400);
      });
    }

    // View mode toggle
    $$('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.view-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.viewMode = btn.dataset.view;
        const grid = $('#anim-grid');
        if (grid) {
          grid.classList.remove('compact', 'list');
          if (state.viewMode !== 'grid') grid.classList.add(state.viewMode);
        }
      });
    });

    // Modal close
    const overlay = $('#modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
      });
    }

    const closeBtn = $('#modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Modal tabs
    $$('.modal-tab').forEach(tab => {
      tab.addEventListener('click', () => setModalTab(tab.dataset.tab));
    });

    // Copy buttons (including get-started section)
    document.addEventListener('click', e => {
      const btn = e.target.closest('.copy-btn');
      if (btn) {
        // If it has data-copy-text, use that (for get-started section)
        if (btn.dataset.copyText) {
          navigator.clipboard.writeText(btn.dataset.copyText).then(() => {
            btn.classList.add('copied');
            const orig = btn.innerHTML;
            btn.innerHTML = '&#10003; Copied!';
            setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
            showToast('Copied to clipboard!');
          });
          return;
        }
        // Otherwise, copy from target code element
        const target = btn.dataset.target;
        const codeEl = $(`#${target}`);
        if (codeEl) copyCode(btn, codeEl.textContent);
      }
    });

    // Modal copy class button
    const modalCopyClass = $('#modal-copy-class');
    if (modalCopyClass) {
      modalCopyClass.addEventListener('click', () => {
        const cls = modalCopyClass.dataset.class;
        if (cls) {
          navigator.clipboard.writeText(cls).then(() => {
            showToast('Class name copied: ' + cls);
          });
        }
      });
    }

    // Modal replay
    const modalReplay = $('#modal-replay');
    if (modalReplay) {
      modalReplay.addEventListener('click', () => {
        const previewArea = $('#modal-preview-area');
        if (!previewArea) return;
        const el = $('[data-animate]', previewArea);
        if (el) triggerAnimation(el, el.dataset.animate);
      });
    }

    // Main tabs
    $$('.main-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.maintab;
        $$('.main-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.maintab === tabName);
          t.setAttribute('aria-selected', t.dataset.maintab === tabName ? 'true' : 'false');
        });
        $$('.tab-content').forEach(tc => tc.classList.toggle('active', tc.dataset.content === tabName));
        state.activeTab = tabName;
      });
    });

    // Scroll to top
    const scrollBtn = $('#scroll-top');
    if (scrollBtn) {
      window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 400);
      });
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Sidebar toggle (mobile) with overlay
    const sidebarToggle = $('#sidebar-toggle');
    const sidebar = $('#sidebar');
    const sidebarOverlay = $('#sidebar-overlay');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        sidebarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active', isOpen);
      });
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Autoplay toggle
    const autoplayBtn = $('#autoplay-toggle');
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => {
        const grid = $('#anim-grid');
        const isActive = autoplayBtn.classList.toggle('active');
        autoplayBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (grid) grid.classList.toggle('autoplay', isActive);
      });
    }

    // Speed slider
    const speedSlider = $('#speed-slider');
    const speedValue = $('#speed-value');
    if (speedSlider) {
      speedSlider.addEventListener('input', () => {
        const speed = parseFloat(speedSlider.value);
        state.animSpeed = speed;
        if (speedValue) speedValue.textContent = speed + 'x';
        applySpeed(speed);
      });
    }

    // Preview text input
    const previewTextInput = $('#preview-text-input');
    const previewTextReset = $('#preview-text-reset');
    if (previewTextInput) {
      let previewDebounce;
      previewTextInput.addEventListener('input', () => {
        clearTimeout(previewDebounce);
        previewDebounce = setTimeout(() => {
          state.previewText = previewTextInput.value.trim();
          renderGrid(state.filtered);
        }, 300);
      });
    }
    if (previewTextReset) {
      previewTextReset.addEventListener('click', () => {
        state.previewText = '';
        if (previewTextInput) previewTextInput.value = '';
        renderGrid(state.filtered);
      });
    }

    // PNG Animator
    initPNGAnimator();

    // Export PNG CSS
    const exportBtn = $('#png-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportPNGCSS);

    // Hash routing
    window.addEventListener('hashchange', () => {
      const hash = location.hash;
      // Let browser handle native anchors
      if (hash === '#app' || hash === '#get-started' || hash === '#hero' || hash === '#mcp-section') return;
      if (!hash || hash === '#' || hash === '#/') {
        state.activeCategory = 'all';
        $$('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
        filterAndRender();
      } else if (hash.startsWith('#/category/')) {
        const cat = hash.replace('#/category/', '');
        if (cat !== state.activeCategory) {
          state.activeCategory = cat;
          $$('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
          filterAndRender();
        }
      } else if (hash.startsWith('#/animation/')) {
        const id = hash.replace('#/animation/', '');
        openModal(id);
      }
    });
  }

  // ── Public API ──
  window.AnimotionApp = {
    openModal,
    closeModal,
    replay,
    filterAndRender,
    state,
  };

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
