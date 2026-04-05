/* ============================================================
   ANIMOTION — Icons Tab Controller
   Handles: provider selection, rendering, filtering, searching,
   copying icons, custom uploads, API key entry
   ============================================================ */

(function () {
  'use strict';

  function sanitizeSVG(svgStr) {
    if (!svgStr) return '';
    // Strip script tags, event handlers, and dangerous elements
    return svgStr
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s\S]*?>/gi, '')
      .replace(/javascript\s*:/gi, 'blocked:')
      .replace(/data\s*:\s*text\/html/gi, 'blocked:');
  }

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  let iconSearchQuery = '';
  let iconCategory = 'all';
  let loadingProvider = false;

  function IP() { return window.ANIMOTION_ICON_PROVIDERS; }

  async function init() {
    // Load built-in provider immediately
    if (IP()) {
      await IP().loadProvider('builtin');
      // Also restore custom icons from session
      await IP().loadProvider('custom');
    }
    renderIconsTab();
    bindIconEvents();
  }

  // ── Render the full Icons tab ──

  function renderIconsTab() {
    const container = $('[data-content="icons"]');
    if (!container) return;

    const ip = IP();
    if (!ip) {
      container.innerHTML = '<div class="empty-state"><h3>Icon system not loaded</h3></div>';
      return;
    }

    const activeId = ip.getActiveProviderId();
    const provider = ip.getProvider(activeId);
    const providerList = ip.listProviders();

    let icons = provider && provider.loaded ? provider.icons : [];

    // Filter by category
    if (iconCategory !== 'all') {
      icons = icons.filter(i => i.category === iconCategory);
    }

    // Filter by search
    if (iconSearchQuery) {
      const q = iconSearchQuery.toLowerCase();
      icons = icons.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // ── Provider selector toolbar ──
    let html = `
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">Icons Library</span>
          <span class="toolbar-count">${provider && provider.loaded ? icons.length + ' icons' : ''}</span>
        </div>
        <div class="toolbar-right" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <select id="icon-provider-select" style="height:36px; padding:0 8px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; font-family:var(--font); outline:none;">
            ${providerList.map(p => {
              const badge = p.type === 'paid' ? ' [Pro]' : p.type === 'custom' ? ' [Custom]' : p.type === 'free' ? ' [Free]' : '';
              return `<option value="${p.id}" ${p.id === activeId ? 'selected' : ''}>${p.name}${badge}</option>`;
            }).join('')}
          </select>
          <input type="text" id="icon-search" placeholder="Search icons..."
                 value="${iconSearchQuery}"
                 style="height:36px; padding:0 12px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; font-family:var(--font); outline:none; width:200px;">
        </div>
      </div>
    `;

    // ── Provider info bar ──
    if (provider) {
      html += `
        <div style="padding:10px 16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:12px; font-size:13px; color:var(--text2); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <strong style="color:var(--text);">${provider.name}</strong>
            &mdash; ${provider.description}
            ${provider.website ? ` &middot; <a href="${provider.website}" target="_blank" style="color:var(--accent); text-decoration:none;">${provider.website}</a>` : ''}
          </div>
          <div style="font-size:12px; color:var(--text3);">
            License: ${provider.license} &middot; ~${provider.totalIcons.toLocaleString()} icons
          </div>
        </div>
      `;
    }

    // ── Paid provider: API key input ──
    if (provider && provider.type === 'paid') {
      const currentKey = provider.apiKey || '';
      html += `
        <div style="padding:16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:12px;">
          <label style="display:block; font-size:13px; font-weight:600; color:var(--text); margin-bottom:6px;">
            ${provider.apiKeyLabel || 'API Key'}
          </label>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <input type="password" id="icon-api-key" placeholder="${provider.apiKeyPlaceholder || 'Enter API key'}"
                   value="${currentKey}"
                   style="flex:1; min-width:200px; height:36px; padding:0 12px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; font-family:var(--font); outline:none;">
            <button id="icon-load-btn" class="header-btn" style="background:var(--accent); color:#fff; border-color:var(--accent); height:36px; padding:0 16px; cursor:pointer;">
              ${loadingProvider ? 'Loading...' : 'Load Icons'}
            </button>
          </div>
          <p style="margin-top:8px; font-size:11px; color:var(--text3);">
            ${provider.apiKeyHelp || 'Your key is used client-side only and never stored on any server.'}
          </p>
        </div>
      `;
    }

    // ── Free CDN provider: Load button ──
    if (provider && provider.type === 'free' && !provider.loaded) {
      html += `
        <div style="padding:16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:12px; text-align:center;">
          <p style="font-size:13px; color:var(--text2); margin-bottom:12px;">
            ${provider.loadInstructions || `Click below to fetch icons from the ${provider.name} CDN.`}
          </p>
          <button id="icon-load-btn" class="header-btn" style="background:var(--accent); color:#fff; border-color:var(--accent); height:40px; padding:0 24px; cursor:pointer; font-size:14px;">
            ${loadingProvider ? 'Loading... please wait' : 'Load Icons'}
          </button>
        </div>
      `;
    }

    // ── Custom provider: Upload zone ──
    if (provider && provider.type === 'custom') {
      html += `
        <div id="icon-upload-zone" style="padding:32px 16px; background:var(--surface); border:2px dashed var(--border); border-radius:var(--radius-sm); margin-bottom:12px; text-align:center; cursor:pointer; transition: border-color 0.2s, background 0.2s;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px; height:40px; margin:0 auto 8px; display:block; opacity:0.5;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p style="font-size:14px; color:var(--text2); margin-bottom:4px;">Drag & drop SVG files here, or click to browse</p>
          <small style="color:var(--text3);">Only .svg files are accepted. Icons stay in your browser session only.</small>
          <input type="file" id="icon-svg-upload" accept=".svg" multiple style="display:none;">
        </div>
      `;
    }

    // ── Category filter pills ──
    if (provider && provider.loaded && provider.icons.length > 0) {
      const categories = provider.getCategories ? provider.getCategories() : [];
      if (categories.length > 0) {
        html += `<div class="tag-filters" id="icon-cat-filters">`;
        html += `<button class="tag-pill ${iconCategory === 'all' ? 'active' : ''}" data-icon-cat="all">All</button>`;
        categories.forEach(c => {
          html += `<button class="tag-pill ${iconCategory === c.id ? 'active' : ''}" data-icon-cat="${c.id}">${c.name} (${c.count})</button>`;
        });
        html += `</div>`;
      }
    }

    // ── Icon grid ──
    if (provider && provider.loaded && icons.length > 0) {
      html += '<div class="icons-grid">';
      icons.forEach(icon => {
        html += `
          <div class="icon-card" data-icon-id="${icon.id}" data-icon-provider="${icon.provider || provider.id}" title="${icon.name}">
            ${sanitizeSVG(icon.svg)}
            <div class="icon-card-name">${icon.name}</div>
          </div>
        `;
      });
      html += '</div>';
    } else if (provider && provider.loaded && icons.length === 0 && (iconSearchQuery || iconCategory !== 'all')) {
      html += `
        <div class="empty-state">
          <h3>No icons found</h3>
          <p>Try a different search term or category</p>
        </div>
      `;
    } else if (provider && provider.loaded && provider.icons.length === 0 && provider.type === 'custom') {
      html += `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <h3>No custom icons yet</h3>
          <p>Upload SVG files using the drop zone above</p>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // ── Event bindings ──

  function bindIconEvents() {
    document.addEventListener('click', e => {
      // Provider selector
      // (handled via change event below)

      // Category pill
      const catPill = e.target.closest('[data-icon-cat]');
      if (catPill) {
        iconCategory = catPill.dataset.iconCat;
        renderIconsTab();
        return;
      }

      // Load button (free CDN or paid)
      if (e.target.id === 'icon-load-btn' || e.target.closest('#icon-load-btn')) {
        handleLoadProvider();
        return;
      }

      // Upload zone click
      if (e.target.closest('#icon-upload-zone')) {
        const fileInput = $('#icon-svg-upload');
        if (fileInput) fileInput.click();
        return;
      }

      // Icon card click -> copy SVG
      const iconCard = e.target.closest('.icon-card');
      if (iconCard) {
        const iconId = iconCard.dataset.iconId;
        const provId = iconCard.dataset.iconProvider || IP().getActiveProviderId();
        const icon = IP().getIcon(provId, iconId);
        if (!icon) return;

        navigator.clipboard.writeText(sanitizeSVG(icon.svg)).then(() => {
          iconCard.style.borderColor = 'var(--success)';
          iconCard.style.background = 'rgba(16, 185, 129, 0.1)';
          const nameEl = iconCard.querySelector('.icon-card-name');
          const origName = nameEl.textContent;
          nameEl.textContent = 'Copied!';
          nameEl.style.color = 'var(--success)';

          setTimeout(() => {
            iconCard.style.borderColor = '';
            iconCard.style.background = '';
            nameEl.textContent = origName;
            nameEl.style.color = '';
          }, 1500);

          showToast(`Copied ${icon.name} SVG!`);
        });
        return;
      }
    });

    // Provider dropdown change
    document.addEventListener('change', e => {
      if (e.target.id === 'icon-provider-select') {
        const newId = e.target.value;
        IP().setActiveProvider(newId);
        iconSearchQuery = '';
        iconCategory = 'all';

        // If already loaded, just re-render
        const prov = IP().getProvider(newId);
        if (prov.loaded) {
          renderIconsTab();
        } else {
          renderIconsTab();
        }
      }

      // Custom SVG file upload
      if (e.target.id === 'icon-svg-upload') {
        handleSvgUpload(e.target.files);
      }
    });

    // Icon search (delegated since input is re-rendered)
    document.addEventListener('input', e => {
      if (e.target.id === 'icon-search') {
        clearTimeout(e.target._debounce);
        e.target._debounce = setTimeout(() => {
          iconSearchQuery = e.target.value;
          renderIconsTab();
          const newInput = document.getElementById('icon-search');
          if (newInput) {
            newInput.focus();
            newInput.selectionStart = newInput.selectionEnd = newInput.value.length;
          }
        }, 200);
      }
    });

    // Drag-and-drop on upload zone
    document.addEventListener('dragover', e => {
      const zone = e.target.closest('#icon-upload-zone');
      if (zone) {
        e.preventDefault();
        zone.style.borderColor = 'var(--accent)';
        zone.style.background = 'rgba(99, 102, 241, 0.05)';
      }
    });
    document.addEventListener('dragleave', e => {
      const zone = e.target.closest('#icon-upload-zone');
      if (zone) {
        zone.style.borderColor = '';
        zone.style.background = '';
      }
    });
    document.addEventListener('drop', e => {
      const zone = e.target.closest('#icon-upload-zone');
      if (zone) {
        e.preventDefault();
        zone.style.borderColor = '';
        zone.style.background = '';
        const files = e.dataTransfer.files;
        handleSvgUpload(files);
      }
    });
  }

  // ── Load provider handler ──

  async function handleLoadProvider() {
    if (loadingProvider) return;
    const ip = IP();
    const activeId = ip.getActiveProviderId();
    const provider = ip.getProvider(activeId);

    // For paid providers, set the API key first
    if (provider.type === 'paid') {
      const keyInput = $('#icon-api-key');
      if (keyInput && keyInput.value.trim()) {
        provider.setApiKey(keyInput.value.trim());
      }
    }

    loadingProvider = true;
    renderIconsTab();

    try {
      await ip.loadProvider(activeId);
      iconCategory = 'all';
      iconSearchQuery = '';
      showToast(`Loaded ${provider.icons.length} icons from ${provider.name}`);
    } catch (err) {
      showToast(`Error: ${err.message}`, true);
    } finally {
      loadingProvider = false;
      renderIconsTab();
    }
  }

  // ── SVG upload handler ──

  function handleSvgUpload(files) {
    if (!files || files.length === 0) return;
    const ip = IP();
    let added = 0;

    Array.from(files).forEach(file => {
      if (!file.name.endsWith('.svg')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const svgContent = ev.target.result;
        const name = file.name.replace('.svg', '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const id = file.name.replace('.svg', '').toLowerCase().replace(/\s+/g, '-');
        ip.addCustomIcon(id, name, svgContent, []);
        added++;
        if (added === files.length || added === Array.from(files).filter(f => f.name.endsWith('.svg')).length) {
          showToast(`Added ${added} custom icon(s)`);
          renderIconsTab();
        }
      };
      reader.readAsText(file);
    });
  }

  // ── Toast helper ──

  function showToast(message, isError) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) toast.style.borderColor = 'var(--error, #ef4444)';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ── Boot ──

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
