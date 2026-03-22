/* ============================================================
   ANIMOTION — App Controller
   Handles: filtering, search, rendering, modals, PNG animator
   ============================================================ */

(function () {
  'use strict';

  // ── State ──
  const state = {
    activeCategory: 'all',
    activeSubcategory: null,
    searchQuery: '',
    viewMode: 'grid', // grid, compact, list
    activeTab: 'animations', // animations, icons, png-animator
    theme: localStorage.getItem('animotion-theme') || 'light',
    filtered: [],
  };

  // ── DOM Cache ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Initialize ──
  function init() {
    applyTheme(state.theme);
    injectAnimationStyles();
    renderSidebar();
    filterAndRender();
    bindEvents();
    renderStats();
  }

  // ── Inject all animation CSS classes + keyframes into the page ──
  // The keyframes.css file uses kebab-case names but data.js uses camelCase.
  // We inject both the @keyframes and .class rules from data.js to ensure
  // every animation works correctly with matching names.
  function injectAnimationStyles() {
    if (!window.ANIMOTION_DATA) return;
    const existing = document.getElementById('animotion-injected-styles');
    if (existing) return; // already injected

    const style = document.createElement('style');
    style.id = 'animotion-injected-styles';
    const parts = window.ANIMOTION_DATA.animations.map(a =>
      a.keyframeCSS + '\n' + a.css
    );
    // Force all animations to loop infinitely in the card previews
    // so users always see the animation playing. The modal and
    // exported code use the original iteration count.
    parts.push(`
      .anim-card-preview [data-animate] {
        animation-iteration-count: infinite !important;
        animation-direction: alternate !important;
      }
    `);
    style.textContent = parts.join('\n\n');
    document.head.appendChild(style);
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
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // ── Sidebar Categories ──
  function renderSidebar() {
    const nav = $('#cat-nav');
    if (!nav || !window.ANIMOTION_DATA) return;

    const { categories, animations } = window.ANIMOTION_DATA;

    let html = `
      <button class="cat-item active" data-cat="all">
        <span class="cat-dot" style="background: var(--accent)"></span>
        All Animations
        <span class="cat-count">${animations.length}</span>
      </button>
    `;

    categories.forEach(cat => {
      const count = animations.filter(a => a.category === cat.id).length;
      html += `
        <button class="cat-item" data-cat="${cat.id}">
          <span class="cat-dot" style="background: var(--cat-${cat.id})"></span>
          ${cat.name}
          <span class="cat-count">${count}</span>
        </button>
      `;
    });

    nav.innerHTML = html;
  }

  // ── Stats ──
  function renderStats() {
    if (!window.ANIMOTION_DATA) return;
    const { categories, animations } = window.ANIMOTION_DATA;
    const totalEl = $('#stat-total');
    const catEl = $('#stat-categories');
    if (totalEl) totalEl.textContent = animations.length;
    if (catEl) catEl.textContent = categories.length;
  }

  // ── Filter & Render ──
  function filterAndRender() {
    if (!window.ANIMOTION_DATA) return;
    const { animations } = window.ANIMOTION_DATA;

    let filtered = animations;

    // Category filter
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category === state.activeCategory);
    }

    // Search filter
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
    renderGrid(filtered);
    updateToolbar(filtered.length);
  }

  // ── Render Grid ──
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

    grid.innerHTML = animations.map(anim => createCardHTML(anim)).join('');
    // Start animations
    requestAnimationFrame(() => {
      $$('.anim-card-preview [data-animate]', grid).forEach(el => {
        triggerAnimation(el, el.dataset.animate);
      });
    });
  }

  // ── Create Card HTML ──
  function createCardHTML(anim) {
    const catColor = `var(--cat-${anim.category})`;
    const demoHTML = getDemoHTML(anim);

    return `
      <div class="anim-card" data-id="${anim.id}" onclick="window.AnimotionApp.openModal('${anim.id}')">
        <div class="anim-card-preview">
          ${demoHTML}
          <button class="anim-card-replay" onclick="event.stopPropagation(); window.AnimotionApp.replay('${anim.id}')" title="Replay">↻</button>
        </div>
        <div class="anim-card-info">
          <div class="anim-card-name">
            ${anim.name}
            <span class="anim-card-category" style="background: ${catColor}20; color: ${catColor}">${anim.category}</span>
          </div>
          <div class="anim-card-desc">${anim.description}</div>
          <div class="anim-card-tags">
            <span class="anim-card-tag">.${anim.cssClass}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Demo Element HTML ──
  function getDemoHTML(anim) {
    const cls = anim.cssClass;
    const animAttr = `data-animate="${cls}"`;

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
    void el.offsetWidth; // force reflow
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
  function updateToolbar(count) {
    const el = $('#toolbar-count');
    if (el) el.textContent = `${count} animation${count !== 1 ? 's' : ''}`;
  }

  // ── Open Modal ──
  function openModal(id) {
    if (!window.ANIMOTION_DATA) return;
    const anim = window.ANIMOTION_DATA.animations.find(a => a.id === id);
    if (!anim) return;

    const overlay = $('#modal-overlay');
    if (!overlay) return;

    const catColor = `var(--cat-${anim.category})`;

    // Fill modal content
    $('#modal-title').textContent = anim.name;

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
      <span class="meta-chip"><strong>Category:</strong> ${anim.category}</span>
      <span class="meta-chip"><strong>Duration:</strong> ${anim.duration}</span>
      <span class="meta-chip"><strong>Easing:</strong> ${anim.timingFunction}</span>
      <span class="meta-chip"><strong>Class:</strong> .${anim.cssClass}</span>
    `;

    // CSS code
    const cssCode = `/* Keyframe */\n${anim.keyframeCSS}\n\n/* Usage */\n${anim.css}`;
    $('#modal-css-code').textContent = cssCode;

    // HTML code
    const htmlCode = `<!-- Add the animation class to any element -->\n<div class="${anim.cssClass}">Your content here</div>\n\n<!-- With utility classes -->\n<div class="${anim.cssClass} animotion-duration-1000 animotion-delay-200">\n  Your content here\n</div>`;
    $('#modal-html-code').textContent = htmlCode;

    // JS code (for programmatic use)
    const jsCode = `// Trigger animation programmatically\nconst el = document.querySelector('.my-element');\nel.classList.add('${anim.cssClass}');\n\n// Replay animation\nfunction replayAnimation(element) {\n  element.classList.remove('${anim.cssClass}');\n  void element.offsetWidth; // force reflow\n  element.classList.add('${anim.cssClass}');\n}\n\n// Listen for animation end\nel.addEventListener('animationend', () => {\n  console.log('Animation complete!');\n});`;
    $('#modal-js-code').textContent = jsCode;

    // Show CSS tab by default
    setModalTab('css');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── Close Modal ──
  function closeModal() {
    const overlay = $('#modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
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
      btnEl.innerHTML = '✓ Copied!';
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

  // ── PNG Animator ──
  function initPNGAnimator() {
    const zone = $('#png-upload-zone');
    const input = $('#png-file-input');
    const preview = $('#png-preview-img');
    const animSelect = $('#png-anim-select');

    if (!zone || !input) return;

    // Populate dropdown
    if (window.ANIMOTION_DATA && animSelect) {
      const { categories, animations } = window.ANIMOTION_DATA;
      let optHTML = '<option value="">Select an animation...</option>';
      categories.forEach(cat => {
        const catAnims = animations.filter(a => a.category === cat.id);
        optHTML += `<optgroup label="${cat.name}">`;
        catAnims.forEach(a => {
          optHTML += `<option value="${a.cssClass}">${a.name}</option>`;
        });
        optHTML += '</optgroup>';
      });
      animSelect.innerHTML = optHTML;
    }

    // Drag & drop
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

    // Animation select change
    if (animSelect) {
      animSelect.addEventListener('change', () => {
        if (!preview) return;
        // Remove all animotion classes
        const classes = [...preview.classList].filter(c => c.startsWith('animotion-'));
        classes.forEach(c => preview.classList.remove(c));
        if (animSelect.value) {
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
      // Show controls
      const controls = $('#png-controls');
      if (controls) controls.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  // ── Export PNG Animation CSS ──
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

  // ── Bind Events ──
  function bindEvents() {
    // Category clicks
    document.addEventListener('click', e => {
      const catBtn = e.target.closest('.cat-item');
      if (catBtn) {
        $$('.cat-item').forEach(b => b.classList.remove('active'));
        catBtn.classList.add('active');
        state.activeCategory = catBtn.dataset.cat;
        filterAndRender();
      }
    });

    // Search
    const searchInput = $('#search-input');
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', e => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.searchQuery = e.target.value;
          filterAndRender();
        }, 200);
      });
    }

    // Keyboard shortcut for search
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
        $$('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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

    // Copy buttons
    document.addEventListener('click', e => {
      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        const target = copyBtn.dataset.target;
        const codeEl = $(`#${target}`);
        if (codeEl) copyCode(copyBtn, codeEl.textContent);
      }
    });

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

    // Main tabs (Animations / Icons / PNG Animator)
    $$('.main-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.maintab;
        $$('.main-tab').forEach(t => t.classList.toggle('active', t.dataset.maintab === tabName));
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

    // Sidebar toggle (mobile)
    const sidebarToggle = $('#sidebar-toggle');
    const sidebar = $('#sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // PNG Animator
    initPNGAnimator();

    // Export PNG CSS
    const exportBtn = $('#png-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportPNGCSS);
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
