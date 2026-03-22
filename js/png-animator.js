/* ============================================================
   ANIMOTION — PNG Animator (Enhanced)
   Upload PNG/SVG/JPG, apply any animation, export CSS
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  let uploadedImage = null;
  let currentAnimation = null;
  let currentDuration = '1s';
  let currentEasing = 'ease';
  let currentIterations = '1';
  let currentDelay = '0s';

  function init() {
    bindEvents();
  }

  function bindEvents() {
    // Duration input
    const durInput = $('#png-duration');
    if (durInput) {
      durInput.addEventListener('input', () => {
        currentDuration = durInput.value || '1s';
        applyAnimation();
      });
    }

    // Easing select
    const easeSelect = $('#png-easing');
    if (easeSelect) {
      easeSelect.addEventListener('change', () => {
        currentEasing = easeSelect.value;
        applyAnimation();
      });
    }

    // Iteration count
    const iterInput = $('#png-iterations');
    if (iterInput) {
      iterInput.addEventListener('input', () => {
        currentIterations = iterInput.value || '1';
        applyAnimation();
      });
    }

    // Delay input
    const delayInput = $('#png-delay');
    if (delayInput) {
      delayInput.addEventListener('input', () => {
        currentDelay = delayInput.value || '0s';
        applyAnimation();
      });
    }

    // Replay button
    const replayBtn = $('#png-replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        const img = $('#png-preview-img');
        if (!img || !currentAnimation) return;
        img.style.animation = 'none';
        void img.offsetWidth;
        applyAnimation();
      });
    }
  }

  function applyAnimation() {
    const img = $('#png-preview-img');
    if (!img || !currentAnimation) return;

    const anim = findAnimation(currentAnimation);
    if (!anim) return;

    // Inject keyframe if not already present
    ensureKeyframe(anim);

    img.style.animation = `${anim.keyframeName} ${currentDuration} ${currentEasing} ${currentDelay} ${currentIterations} both`;
  }

  function findAnimation(cssClass) {
    if (!window.ANIMOTION_DATA) return null;
    return window.ANIMOTION_DATA.animations.find(a => a.cssClass === cssClass);
  }

  function ensureKeyframe(anim) {
    const id = `animotion-injected-${anim.id}`;
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = anim.keyframeCSS;
    document.head.appendChild(style);
  }

  // Export function for the export button
  window.AnimotionPNGExport = function () {
    if (!currentAnimation) {
      alert('Please select an animation first.');
      return;
    }

    const anim = findAnimation(currentAnimation);
    if (!anim) return;

    const code = `/* Animotion: ${anim.name} */\n${anim.keyframeCSS}\n\n.my-animated-image {\n  animation: ${anim.keyframeName} ${currentDuration} ${currentEasing} ${currentDelay} ${currentIterations} both;\n}`;

    navigator.clipboard.writeText(code).then(() => {
      const container = document.getElementById('toast-container');
      if (container) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'CSS exported to clipboard!';
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    });
  };

  // Hook into animation select change
  const observer = new MutationObserver(() => {
    const select = $('#png-anim-select');
    if (select && !select._bound) {
      select._bound = true;
      select.addEventListener('change', () => {
        currentAnimation = select.value;
        applyAnimation();
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
