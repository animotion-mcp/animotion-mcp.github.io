/* ============================================================
   ANIMOTION — Icons Tab Controller
   Handles: rendering, filtering, searching, copying icons
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  let iconSearchQuery = '';
  let iconCategory = 'all';

  function init() {
    if (!window.ANIMOTION_ICONS) return;
    renderIconsGrid();
    bindIconEvents();
  }

  function renderIconsGrid() {
    if (!window.ANIMOTION_ICONS) return;
    const { icons } = window.ANIMOTION_ICONS;

    let filtered = icons;

    if (iconCategory !== 'all') {
      filtered = filtered.filter(i => i.category === iconCategory);
    }

    if (iconSearchQuery) {
      const q = iconSearchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    const container = $('[data-content="icons"]');
    if (!container) return;

    // Build category filter
    const { categories } = window.ANIMOTION_ICONS;
    let catHTML = `
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">Icons Library</span>
          <span class="toolbar-count">${filtered.length} icons</span>
        </div>
        <div class="toolbar-right">
          <input type="text" id="icon-search" placeholder="Search icons..."
                 value="${iconSearchQuery}"
                 style="height:36px; padding:0 12px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:13px; font-family:var(--font); outline:none; width:200px;">
        </div>
      </div>
      <div class="tag-filters" id="icon-cat-filters">
        <button class="tag-pill ${iconCategory === 'all' ? 'active' : ''}" data-icon-cat="all">All</button>
        ${categories.map(c => `
          <button class="tag-pill ${iconCategory === c.id ? 'active' : ''}" data-icon-cat="${c.id}">${c.name} (${c.count})</button>
        `).join('')}
      </div>
    `;

    if (filtered.length === 0) {
      catHTML += `
        <div class="empty-state">
          <h3>No icons found</h3>
          <p>Try a different search term or category</p>
        </div>
      `;
    } else {
      catHTML += '<div class="icons-grid">';
      filtered.forEach(icon => {
        catHTML += `
          <div class="icon-card" data-icon-id="${icon.id}" title="${icon.name}">
            ${icon.svg}
            <div class="icon-card-name">${icon.name}</div>
          </div>
        `;
      });
      catHTML += '</div>';
    }

    container.innerHTML = catHTML;
  }

  function bindIconEvents() {
    document.addEventListener('click', e => {
      // Icon category filter
      const catPill = e.target.closest('[data-icon-cat]');
      if (catPill) {
        iconCategory = catPill.dataset.iconCat;
        renderIconsGrid();
        return;
      }

      // Icon card click -> copy SVG
      const iconCard = e.target.closest('.icon-card');
      if (iconCard) {
        const iconId = iconCard.dataset.iconId;
        if (!window.ANIMOTION_ICONS) return;
        const icon = window.ANIMOTION_ICONS.icons.find(i => i.id === iconId);
        if (!icon) return;

        navigator.clipboard.writeText(icon.svg).then(() => {
          // Show feedback
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

          // Toast
          if (window.AnimotionApp) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = `Copied ${icon.name} SVG!`;
            const container = document.getElementById('toast-container');
            if (container) {
              container.appendChild(toast);
              setTimeout(() => toast.remove(), 3000);
            }
          }
        });
        return;
      }
    });

    // Icon search (delegated since input is re-rendered)
    document.addEventListener('input', e => {
      if (e.target.id === 'icon-search') {
        clearTimeout(e.target._debounce);
        e.target._debounce = setTimeout(() => {
          iconSearchQuery = e.target.value;
          renderIconsGrid();
          // Re-focus the search input
          const newInput = document.getElementById('icon-search');
          if (newInput) {
            newInput.focus();
            newInput.selectionStart = newInput.selectionEnd = newInput.value.length;
          }
        }, 200);
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Delay to let icons.js load first
    setTimeout(init, 100);
  }
})();
