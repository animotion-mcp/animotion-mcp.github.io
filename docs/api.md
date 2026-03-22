# Animotion API & Integration Guide

> 1000+ CSS3 Animations & Icons — for humans and AI agents alike.

## Quick Start

### CDN (Recommended)
```html
<!-- Full library (all animations) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nickshouvik/css3-animations@main/css/keyframes.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nickshouvik/css3-animations@main/css/keyframes-part2.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nickshouvik/css3-animations@main/css/utilities.css">
```

### Usage
```html
<!-- Add animation class to any element -->
<div class="animotion-fade-in">Hello World</div>

<!-- With utility modifiers -->
<div class="animotion-bounce-in animotion-duration-1000 animotion-delay-200">
  Bouncy content
</div>

<!-- Infinite loop -->
<div class="animotion-spin animotion-infinite">
  Loading...
</div>
```

---

## Animation Categories (20)

| Category | Count | Description |
|----------|-------|-------------|
| entrance | 65 | Fade in, slide in, zoom in, flip in, bounce in |
| exit | 50 | Fade out, slide out, zoom out, flip out |
| attention | 40 | Bounce, pulse, shake, wobble, heartbeat |
| text | 50 | Typewriter, shimmer, glitch, neon, wave |
| background | 40 | Gradients, aurora, particles, starfield |
| button | 40 | Ripple, glow, fill, 3D press, shine |
| card | 35 | Lift, flip, tilt, glassmorphism, skeleton |
| loader | 60 | Spinners, dots, bars, progress, orbital |
| navigation | 25 | Underline, hamburger, dropdown, drawer |
| form | 30 | Float label, focus glow, toggle, checkbox |
| transform3d | 35 | Rotate, cube, flip, perspective, helix |
| filter | 25 | Blur, grayscale, sepia, hue-rotate |
| micro | 40 | Like, cart, notification, tooltip, modal |
| scroll | 25 | Scroll-triggered entrance animations |
| creative | 40 | Paint, ink, origami, fire, lightning |
| fintech | 30 | Ticker, chart, coin, price, transaction |
| gaming | 40 | Physics, health bar, level up, damage |
| ecommerce | 25 | Add to cart, wishlist, price, shipping |
| social | 25 | Like heart, story ring, notification bell |
| dashboard | 25 | Chart draw, gauge, sparkline, KPI counter |

---

## API Reference (api.json)

The machine-readable catalog is available at `api.json`. This is designed for AI agents and programmatic consumers.

### Endpoint
```
GET /api.json
```

### Response Schema
```json
{
  "name": "animotion",
  "version": "1.0.0",
  "totalAnimations": 755,
  "categories": [
    {
      "id": "entrance",
      "name": "Entrance",
      "icon": "→",
      "color": "#3b82f6",
      "count": 65
    }
  ],
  "animations": [
    {
      "id": "E01",
      "name": "Fade In",
      "description": "Element fades in from transparent to opaque",
      "cssClass": "animotion-fade-in",
      "keyframeName": "animotion-fadeIn",
      "category": "entrance",
      "subcategory": "fade",
      "tags": ["fade", "opacity", "entrance", "basic"],
      "duration": "0.6s",
      "timingFunction": "ease-out",
      "iterationCount": "1",
      "fillMode": "both",
      "demoType": "box",
      "css": ".animotion-fade-in { animation: animotion-fadeIn 0.6s ease-out both; }",
      "keyframeCSS": "@keyframes animotion-fadeIn { from { opacity: 0; } to { opacity: 1; } }"
    }
  ]
}
```

---

## MCP Server (for AI Agents)

Animotion includes a Model Context Protocol (MCP) server that enables AI agents like Claude to directly search and use animations.

### Setup

```bash
cd mcp/
npm install
```

### Claude Desktop Configuration

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "animotion": {
      "command": "node",
      "args": ["/path/to/css3-animations/mcp/server.js"]
    }
  }
}
```

### Available MCP Tools

#### `search_animations`
Search animations by name, category, or tags.
```json
{
  "query": "fade in",
  "category": "entrance",
  "limit": 10
}
```

#### `get_animation`
Get complete details for a specific animation.
```json
{
  "id": "E01"
}
```

#### `list_categories`
List all animation categories with counts.

#### `compose_animation`
Compose custom CSS with custom duration, easing, delay.
```json
{
  "animation": "animotion-bounce-in",
  "selector": ".my-modal",
  "duration": "0.8s",
  "easing": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "delay": "0.1s"
}
```

#### `suggest_animation`
AI-friendly suggestion based on use case description.
```json
{
  "useCase": "modal appearing on screen with a bouncy effect",
  "count": 5
}
```

#### `get_animation_css`
Get just the CSS code for direct insertion.
```json
{
  "id": "animotion-fade-in",
  "includeKeyframes": true
}
```

### MCP Resources

| URI | Description |
|-----|-------------|
| `animotion://catalog` | Full animation catalog (JSON) |
| `animotion://categories` | Category list (JSON) |
| `animotion://utilities` | Utility CSS classes |

---

## Utility Classes

### Duration
| Class | Value |
|-------|-------|
| `.animotion-duration-100` | 100ms |
| `.animotion-duration-200` | 200ms |
| `.animotion-duration-300` | 300ms |
| `.animotion-duration-500` | 500ms |
| `.animotion-duration-1000` | 1s |
| `.animotion-duration-2000` | 2s |

### Delay
| Class | Value |
|-------|-------|
| `.animotion-delay-100` | 100ms |
| `.animotion-delay-200` | 200ms |
| `.animotion-delay-500` | 500ms |
| `.animotion-delay-1000` | 1s |

### Easing
| Class | Curve |
|-------|-------|
| `.animotion-ease-linear` | linear |
| `.animotion-ease-in` | ease-in |
| `.animotion-ease-out` | ease-out |
| `.animotion-ease-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) |
| `.animotion-ease-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) |
| `.animotion-ease-elastic` | cubic-bezier(0.68, -0.6, 0.32, 1.6) |

### Iteration
| Class | Value |
|-------|-------|
| `.animotion-once` | 1 |
| `.animotion-twice` | 2 |
| `.animotion-infinite` | infinite |

### Stagger (for child elements)
```html
<div class="animotion-stagger">
  <div class="animotion-fade-in-up">Item 1</div>
  <div class="animotion-fade-in-up">Item 2</div>
  <div class="animotion-fade-in-up">Item 3</div>
</div>
```

### Reduced Motion
```html
<!-- Respects prefers-reduced-motion -->
<div class="animotion-fade-in animotion-respect-motion">
  Accessible content
</div>
```

---

## JavaScript API

### Trigger animations programmatically
```js
// Add animation
element.classList.add('animotion-bounce-in');

// Replay animation
function replay(el, animClass) {
  el.classList.remove(animClass);
  void el.offsetWidth; // force reflow
  el.classList.add(animClass);
}

// Listen for completion
element.addEventListener('animationend', () => {
  console.log('Done!');
});
```

### Intersection Observer (scroll animations)
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animotion-fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

---

## License

MIT License. Free forever. Built by [Bachao.AI](https://bachao.ai) for the dev community.
