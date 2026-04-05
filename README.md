# Animotion

### The largest open-source CSS3 animation library. 745+ animations, 9,500+ icons via MCP, zero dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Animations](https://img.shields.io/badge/Animations-745+-6366f1)](https://animationiconsmcp.github.io)
[![Icons](https://img.shields.io/badge/MCP_Icons-9,500+-06b6d4)](mcp/)
[![MCP](https://img.shields.io/badge/MCP-v2.0-10b981)](mcp/)

**[Live Demo](https://animationiconsmcp.github.io)** | **[API Reference](#api-reference)** | **[MCP Server](#mcp-server-for-ai-agents)** | **[PNG Animator](#png-animator)**

---

## What is Animotion?

Animotion is a production-ready CSS3 animation framework built for the modern web. It provides **745+ hand-crafted animations** across 20 categories, **9,500+ real SVG icons** via MCP (from Lucide, Heroicons, Tabler, Bootstrap), a **PNG Animator** tool, and an **MCP server** so AI agents can search and use animations and icons directly.

Built for everyone — from manual coders to vibe coders, from junior developers to AI agents.

### Key Features

- **745+ CSS3 animations** across 20 categories — the largest collection available
- **9,500+ real SVG icons** via MCP — Lucide, Tabler, Bootstrap, Heroicons, built-in (eliminates AI-generated icons)
- **Zero dependencies** — pure CSS, no JavaScript frameworks required
- **GPU-optimized** — animations use `transform` and `opacity` for 60fps performance
- **Hover-to-play previews** — smooth, no GPU overload, auto-play toggle available
- **Custom text preview** — type your name/brand and see it animated across all 745 animations
- **Copy-paste ready** — every animation has a single CSS class
- **AI-friendly** — MCP v2 server with 10 tools for Claude Code, Cursor, Windsurf, Cline
- **PNG Animator** — upload any image, apply animation, export CSS
- **Utility classes** — control duration, delay, easing, iteration, stagger
- **Syntax-highlighted code** — modal shows CSS/HTML/JS with colored syntax
- **URL routing** — deep-link to any animation or category via hash
- **Accessibility** — skip link, ARIA labels, focus trap, `prefers-reduced-motion`
- **MIT Licensed** — free forever, commercial use allowed

---

## Quick Start

### Option 1: CDN (Recommended)

Add these lines to your HTML `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animationiconsmcp/animationiconsmcp.github.io@main/css/keyframes.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animationiconsmcp/animationiconsmcp.github.io@main/css/keyframes-part2.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animationiconsmcp/animationiconsmcp.github.io@main/css/utilities.css">
```

Then use any animation class:

```html
<div class="animotion-fade-in">Hello World</div>
```

### Option 2: Download

```bash
git clone https://github.com/animationiconsmcp/animationiconsmcp.github.io.git
```

Include the CSS files from the `css/` folder in your project.

### Option 3: Copy from Website

Visit [animationiconsmcp.github.io](https://animationiconsmcp.github.io), find your animation, hover to preview, click the card, and copy the CSS.

---

## Usage

### Basic — Add a class

```html
<!-- Fade in an element -->
<div class="animotion-fade-in">Welcome</div>

<!-- Bounce a button -->
<button class="animotion-bounce">Click Me</button>

<!-- Spin a loader -->
<div class="animotion-spinner-border animotion-infinite"></div>

<!-- Typewriter text -->
<p class="animotion-typewriter">Loading system...</p>
```

### With Utility Classes

Control duration, delay, easing, and more:

```html
<!-- Slow fade with delay -->
<div class="animotion-fade-in-up animotion-duration-1500 animotion-delay-500">
  Appears after 500ms, takes 1.5s
</div>

<!-- Bouncy easing -->
<div class="animotion-zoom-in animotion-ease-spring">
  Spring effect
</div>

<!-- Infinite loop -->
<div class="animotion-float animotion-infinite">
  Floating element
</div>

<!-- Alternate direction -->
<div class="animotion-pulse animotion-infinite animotion-alternate">
  Pulsing
</div>
```

### Staggered Children

Animate list items with increasing delays:

```html
<ul class="animotion-stagger">
  <li class="animotion-fade-in-up">Item 1 (0ms delay)</li>
  <li class="animotion-fade-in-up">Item 2 (50ms delay)</li>
  <li class="animotion-fade-in-up">Item 3 (100ms delay)</li>
  <li class="animotion-fade-in-up">Item 4 (150ms delay)</li>
</ul>

<!-- Wider stagger (100ms increments) -->
<div class="animotion-stagger-100">
  <div class="animotion-slide-in-left">Card 1</div>
  <div class="animotion-slide-in-left">Card 2</div>
  <div class="animotion-slide-in-left">Card 3</div>
</div>
```

### JavaScript — Trigger Programmatically

```javascript
// Add animation to an element
const el = document.querySelector('.my-element');
el.classList.add('animotion-bounce-in');

// Replay an animation
function replay(element, animClass) {
  element.classList.remove(animClass);
  void element.offsetWidth; // force reflow
  element.classList.add(animClass);
}

// Listen for animation completion
el.addEventListener('animationend', () => {
  console.log('Animation finished!');
  el.classList.remove('animotion-bounce-in'); // cleanup
});

// Chain animations
async function chainAnimations(el, animations) {
  for (const anim of animations) {
    el.classList.add(anim);
    await new Promise(resolve =>
      el.addEventListener('animationend', resolve, { once: true })
    );
    el.classList.remove(anim);
  }
}

// Usage: fade in, then pulse, then glow
chainAnimations(myElement, [
  'animotion-fade-in',
  'animotion-pulse',
  'animotion-glow-pulse'
]);
```

### Scroll-Triggered Animations

Use Intersection Observer to animate elements as they enter the viewport:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const anim = entry.target.dataset.animotion;
      entry.target.classList.add(anim);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Mark elements for scroll animation
document.querySelectorAll('[data-animotion]').forEach(el => {
  observer.observe(el);
});
```

```html
<div data-animotion="animotion-fade-in-up">Animates on scroll</div>
<div data-animotion="animotion-slide-in-left">Slides in on scroll</div>
<div data-animotion="animotion-zoom-in">Zooms in on scroll</div>
```

### Accessibility — Reduced Motion

Animotion respects `prefers-reduced-motion`. Add the utility class:

```html
<div class="animotion-fade-in animotion-respect-motion">
  This animation is disabled for users who prefer reduced motion
</div>
```

Or handle it globally:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="animotion-"] {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## Animation Categories

| # | Category | Count | Description | Example Classes |
|---|----------|-------|-------------|-----------------|
| 1 | **Entrance** | 65 | Elements appearing on screen | `animotion-fade-in`, `animotion-slide-in-up`, `animotion-zoom-in`, `animotion-bounce-in` |
| 2 | **Exit** | 50 | Elements leaving the screen | `animotion-fade-out`, `animotion-slide-out-down`, `animotion-zoom-out` |
| 3 | **Attention** | 40 | Draw user attention | `animotion-bounce`, `animotion-pulse`, `animotion-shake-x`, `animotion-heartbeat` |
| 4 | **Text** | 50 | Typography animations | `animotion-typewriter`, `animotion-shimmer-text`, `animotion-glitch-text`, `animotion-neon-flicker` |
| 5 | **Background** | 40 | Animated backgrounds | `animotion-gradient-shift`, `animotion-aurora`, `animotion-starfield`, `animotion-particle-field` |
| 6 | **Button** | 40 | Button interactions | `animotion-ripple-click`, `animotion-glow-pulse`, `animotion-shine-sweep`, `animotion-press-3d` |
| 7 | **Card** | 35 | Card animations | `animotion-card-lift`, `animotion-card-flip-3d`, `animotion-glassmorphism`, `animotion-shimmer-loading` |
| 8 | **Loader** | 60 | Spinners & progress | `animotion-spinner-border`, `animotion-dots-wave`, `animotion-bars-wave`, `animotion-orbital` |
| 9 | **Navigation** | 25 | Nav & menu animations | `animotion-underline-grow`, `animotion-hamburger-x`, `animotion-dropdown-slide` |
| 10 | **Form** | 30 | Input & form animations | `animotion-label-float`, `animotion-input-glow-focus`, `animotion-toggle-slide` |
| 11 | **3D Transform** | 35 | 3D perspective effects | `animotion-rotate-x-axis`, `animotion-card-flip-front-back`, `animotion-cube-spin-loader` |
| 12 | **Filter** | 25 | CSS filter animations | `animotion-blur-in`, `animotion-grayscale-to-color`, `animotion-hue-rotate-cycle` |
| 13 | **Micro Interaction** | 40 | UI feedback animations | `animotion-like-bounce`, `animotion-notification-pop`, `animotion-checkmark-draw` |
| 14 | **Scroll** | 25 | Scroll-triggered effects | `animotion-scroll-fade-in`, `animotion-scroll-zoom-in`, `animotion-scroll-clip-reveal` |
| 15 | **Creative** | 40 | Artistic & special effects | `animotion-paint-splash`, `animotion-ink-bleed`, `animotion-fire-flicker`, `animotion-sparkle` |
| 16 | **Fintech** | 30 | Finance & data UI | `animotion-ticker-scroll`, `animotion-price-up`, `animotion-coin-flip`, `animotion-chart-line-draw-fintech` |
| 17 | **Gaming** | 40 | Game UI & physics | `animotion-gravity-fall`, `animotion-health-bar-fill`, `animotion-level-up`, `animotion-teleport` |
| 18 | **E-Commerce** | 25 | Shopping UI animations | `animotion-add-to-cart-bounce`, `animotion-wishlist-heart`, `animotion-shipping-truck` |
| 19 | **Social** | 25 | Social media UI | `animotion-like-heart`, `animotion-story-ring`, `animotion-notification-bell` |
| 20 | **Dashboard** | 25 | Data viz & dashboards | `animotion-chart-line-draw`, `animotion-gauge-needle`, `animotion-kpi-counter` |

---

## Utility Classes Reference

### Duration

| Class | Duration |
|-------|----------|
| `.animotion-duration-100` | 100ms |
| `.animotion-duration-200` | 200ms |
| `.animotion-duration-300` | 300ms |
| `.animotion-duration-400` | 400ms |
| `.animotion-duration-500` | 500ms |
| `.animotion-duration-600` | 600ms |
| `.animotion-duration-700` | 700ms |
| `.animotion-duration-800` | 800ms |
| `.animotion-duration-1000` | 1s |
| `.animotion-duration-1200` | 1.2s |
| `.animotion-duration-1500` | 1.5s |
| `.animotion-duration-2000` | 2s |
| `.animotion-duration-2500` | 2.5s |
| `.animotion-duration-3000` | 3s |
| `.animotion-duration-5000` | 5s |

### Delay

| Class | Delay |
|-------|-------|
| `.animotion-delay-0` | 0ms |
| `.animotion-delay-100` | 100ms |
| `.animotion-delay-200` | 200ms |
| `.animotion-delay-300` | 300ms |
| `.animotion-delay-500` | 500ms |
| `.animotion-delay-700` | 700ms |
| `.animotion-delay-1000` | 1s |
| `.animotion-delay-1500` | 1.5s |
| `.animotion-delay-2000` | 2s |
| `.animotion-delay-3000` | 3s |

### Easing

| Class | Curve | Best For |
|-------|-------|----------|
| `.animotion-ease-linear` | `linear` | Continuous motion |
| `.animotion-ease-in` | `ease-in` | Exit animations |
| `.animotion-ease-out` | `ease-out` | Entrance animations |
| `.animotion-ease-in-out` | `ease-in-out` | Symmetric motion |
| `.animotion-ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Bouncy entrances |
| `.animotion-ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful UI |
| `.animotion-ease-elastic` | `cubic-bezier(0.68, -0.6, 0.32, 1.6)` | Elastic stretch |
| `.animotion-ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material Design |
| `.animotion-ease-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` | Quick transitions |
| `.animotion-ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Smooth stop |
| `.animotion-ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Smooth start |
| `.animotion-ease-overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot & settle |

### Iteration & Direction

| Class | Effect |
|-------|--------|
| `.animotion-once` | Play once |
| `.animotion-twice` | Play twice |
| `.animotion-thrice` | Play three times |
| `.animotion-infinite` | Loop forever |
| `.animotion-normal` | Normal direction |
| `.animotion-reverse` | Reverse direction |
| `.animotion-alternate` | Alternate direction |
| `.animotion-alternate-reverse` | Alternate starting in reverse |

### Fill Mode & Play State

| Class | Effect |
|-------|--------|
| `.animotion-fill-none` | No fill |
| `.animotion-fill-forwards` | Keep end state |
| `.animotion-fill-backwards` | Apply start state during delay |
| `.animotion-fill-both` | Both forwards and backwards |
| `.animotion-running` | Animation running |
| `.animotion-paused` | Animation paused |

### Performance

| Class | Effect |
|-------|--------|
| `.animotion-gpu` | Force GPU acceleration (`will-change: transform, opacity`) |
| `.animotion-respect-motion` | Disable animation for `prefers-reduced-motion` |

---

## API Reference

Animotion provides a machine-readable JSON API at [`api.json`](https://animationiconsmcp.github.io/api.json) for programmatic access.

### Endpoint

```
GET https://animationiconsmcp.github.io/api.json
```

### Response Schema

```json
{
  "name": "animotion",
  "version": "1.0.0",
  "totalAnimations": 745,
  "totalCategories": 20,
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

### Using the API

#### Fetch all animations in a category

```javascript
const response = await fetch('https://animationiconsmcp.github.io/api.json');
const data = await response.json();

// Get all loader animations
const loaders = data.animations.filter(a => a.category === 'loader');
console.log(`${loaders.length} loader animations available`);

// Search by name
const searchResults = data.animations.filter(a =>
  a.name.toLowerCase().includes('fade')
);
```

#### Get CSS for a specific animation

```javascript
const anim = data.animations.find(a => a.cssClass === 'animotion-bounce-in');

// Inject into page
const style = document.createElement('style');
style.textContent = anim.keyframeCSS + '\n' + anim.css;
document.head.appendChild(style);

// Apply to element
document.querySelector('.my-element').classList.add(anim.cssClass);
```

#### Build a dynamic animation picker

```javascript
const data = await fetch('/api.json').then(r => r.json());

// Populate a <select> dropdown
const select = document.getElementById('animation-picker');
data.categories.forEach(cat => {
  const group = document.createElement('optgroup');
  group.label = `${cat.name} (${cat.count})`;

  data.animations
    .filter(a => a.category === cat.id)
    .forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.cssClass;
      opt.textContent = a.name;
      group.appendChild(opt);
    });

  select.appendChild(group);
});
```

---

## MCP Server (for AI Agents)

Animotion includes an **MCP v2 server** with **745 animations + 9,500+ real SVG icons** from 5 providers. AI agents get real hand-crafted icons instead of generating AI-looking ones.

### Why Use This MCP?

When AI coding tools generate UIs, they often create SVG icons that look obviously AI-generated. With Animotion MCP, agents call `search_icons("shopping cart")` and get **real SVGs** from Lucide, Heroicons, Tabler, and Bootstrap — content matches the context but doesn't look AI-generated.

### Icon Providers (9,500+ icons)

| Provider | Icons | License |
|----------|-------|---------|
| Lucide | 1,941 | ISC |
| Tabler | 5,039 | MIT |
| Bootstrap | 2,078 | MIT |
| Heroicons | 324 | MIT |
| Built-in | 120 | MIT |

### Setup

```bash
cd mcp/
npm install
```

### Connect to Claude Code

Add to your project's `.claude/settings.json` or `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "animotion": {
      "command": "node",
      "args": ["/absolute/path/to/css3-animations/mcp/server.js"]
    }
  }
}
```

### Connect to Cursor / Windsurf / Cline

Add to your MCP configuration (varies by tool):

```json
{
  "animotion": {
    "command": "node",
    "args": ["/absolute/path/to/css3-animations/mcp/server.js"]
  }
}
```

### Connect to Claude Desktop

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "animotion": {
      "command": "node",
      "args": ["/absolute/path/to/css3-animations/mcp/server.js"]
    }
  }
}
```

### Available MCP Tools (10 total)

#### 1. `search_animations`

Search animations by name, category, or tags.

```json
// Input
{
  "query": "fade in",
  "category": "entrance",
  "limit": 10
}

// Output — matching animations with metadata
{
  "count": 13,
  "animations": [
    {
      "id": "E01",
      "name": "Fade In",
      "description": "Element fades in from transparent to opaque",
      "cssClass": "animotion-fade-in",
      "category": "entrance",
      "tags": ["fade", "opacity", "entrance", "basic"],
      "duration": "0.6s"
    }
  ]
}
```

#### 2. `get_animation`

Get complete details for a specific animation by ID or class name.

```json
// Input
{ "id": "E01" }
// or
{ "id": "animotion-fade-in" }

// Output — full animation object including CSS code
```

#### 3. `list_categories`

List all 20 animation categories with names, icons, colors, and counts.

```json
// No input needed

// Output
{
  "categories": [
    { "id": "entrance", "name": "Entrance", "icon": "→", "color": "#3b82f6", "count": 65 },
    { "id": "exit", "name": "Exit", "icon": "←", "color": "#94a3b8", "count": 50 },
    ...
  ]
}
```

#### 4. `compose_animation`

Compose custom CSS with your own duration, easing, delay, and selector.

```json
// Input
{
  "animation": "animotion-bounce-in",
  "selector": ".my-modal",
  "duration": "0.8s",
  "easing": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "delay": "0.1s",
  "iterationCount": "1",
  "fillMode": "both"
}

// Output — ready-to-use CSS
// @keyframes animotion-bounceIn { ... }
//
// .my-modal {
//   animation: animotion-bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s 1 both;
// }
```

#### 5. `suggest_animation`

Describe your use case in natural language and get the best matching animations.

```json
// Input
{
  "useCase": "modal appearing on screen with a bouncy effect",
  "count": 5
}

// Output — ranked suggestions with relevance scores
{
  "useCase": "modal appearing on screen with a bouncy effect",
  "suggestions": [
    {
      "id": "E30",
      "name": "Bounce In",
      "description": "Element bounces in with spring-like scaling",
      "cssClass": "animotion-bounce-in",
      "css": "...",
      "keyframeCSS": "...",
      "relevanceScore": 12
    }
  ]
}
```

#### 6. `get_animation_css`

Get ONLY the CSS code — perfect for directly inserting into stylesheets.

```json
// Input
{
  "id": "animotion-fade-in",
  "includeKeyframes": true
}

// Output — raw CSS string
// @keyframes animotion-fadeIn { from { opacity: 0; } to { opacity: 1; } }
// .animotion-fade-in { animation: animotion-fadeIn 0.6s ease-out both; }
```

#### 7. `search_icons`

Search 9,500+ real SVG icons across all providers. Use instead of generating icons.

```json
// Input
{ "query": "shopping cart", "provider": "all", "limit": 5 }

// Output — real SVGs from multiple providers
{
  "count": 5,
  "icons": [
    {
      "id": "lucide:shopping-cart",
      "name": "Shopping Cart",
      "provider": "lucide",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>"
    }
  ]
}
```

#### 8. `get_icon`

Get SVG code for a specific icon. Use `provider:name` format.

```json
// Input
{ "id": "lucide:home" }

// Output — complete SVG ready to paste
```

#### 9. `list_icon_providers`

List all 5 icon providers with counts and metadata.

#### 10. `add_custom_icon`

Register your own SVG icon for the MCP session.

### MCP Resources

The server exposes resources that AI agents can read:

| URI | Description |
|-----|-------------|
| `animotion://catalog` | Complete animation catalog (JSON) |
| `animotion://categories` | Category list with metadata (JSON) |
| `animotion://utilities` | All utility CSS classes (CSS) |
| `animotion://icons` | Icon library stats and built-in icons (JSON) |

---

## PNG Animator

Upload any image (PNG, JPG, SVG, GIF) and apply any of the 745 animations to it.

### How to use

1. Visit [the website](https://animationiconsmcp.github.io) and click **PNG Animator** tab
2. Drag & drop your image or click to browse
3. Select an animation from the dropdown (organized by category)
4. Adjust duration, easing, and delay
5. Preview the animation live
6. Click **Export CSS** to copy the ready-to-use CSS code

### What you get

```css
/* Animotion: Bounce In */
@keyframes animotion-bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.my-animated-image {
  animation: animotion-bounceIn 1s ease-out 0s 1 both;
}
```

---

## Icons Library

**9,500+ SVG icons** available via MCP server (Lucide, Tabler, Bootstrap, Heroicons) + **120 built-in icons** on the website. All icons use consistent 24x24 viewBox with stroke-based rendering.

### Categories

| Category | Count | Examples |
|----------|-------|---------|
| UI Elements | 25 | home, search, settings, menu, close, bell, user, star, heart |
| Arrows & Direction | 20 | arrow-up, chevron-down, refresh, download, external-link |
| Media & Files | 15 | file, folder, image, camera, video, play, pause |
| Social & Communication | 15 | message, mail, phone, send, share, globe, wifi |
| Commerce | 15 | shopping-cart, credit-card, tag, gift, truck, wallet |
| Developer | 15 | code, terminal, git-branch, database, server, cloud, cpu |
| Miscellaneous | 15 | sun, moon, clock, calendar, flag, zap, coffee, pen |

### Usage

Visit the **Icons** tab on the website and click any icon to copy its SVG to clipboard.

```html
<!-- Paste the SVG directly -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
```

Icons inherit `currentColor`, so they match your text color automatically.

### Programmatic Access

```javascript
// Load the icons data
const response = await fetch('js/icons.js');
// or include <script src="js/icons.js"></script>

// Access icons
const homeIcon = ANIMOTION_ICONS.icons.find(i => i.id === 'home');
document.getElementById('my-icon').innerHTML = homeIcon.svg;
```

---

## Project Structure

```
css3-animations/
├── index.html                    # Showcase website
├── api.json                      # Machine-readable catalog (608KB)
├── LICENSE                       # MIT License
├── README.md                     # This file
│
├── css/
│   ├── keyframes.css             # 500 @keyframes (Part 1)
│   ├── keyframes-part2.css       # 341 @keyframes (Part 2)
│   ├── style.css                 # Website UI styles
│   └── utilities.css             # Duration/delay/easing helpers
│
├── js/
│   ├── data.js                   # Animation registry (745 entries)
│   ├── icons.js                  # Icons registry (120 entries)
│   ├── app.js                    # Website controller
│   ├── icons-app.js              # Icons tab controller
│   └── png-animator.js           # PNG upload & animate
│
├── icons/
│   └── favicon.svg               # SVG favicon
│
├── mcp/
│   ├── server.js                 # MCP v2 server (10 tools + 4 resources)
│   ├── icon-loader.js            # Loads 9,500+ icons from npm packages
│   └── package.json              # MCP dependencies (includes icon libraries)
│
├── docs/
│   └── api.md                    # Detailed API documentation
│
├── scripts/
│   └── generate-api.js           # Regenerate api.json from data.js
│
└── .github/
    └── workflows/
        └── pages.yml             # GitHub Pages auto-deploy
```

---

## Integration Examples

### React

```jsx
import './animotion/keyframes.css';
import './animotion/utilities.css';

function Modal({ isOpen, children }) {
  return isOpen ? (
    <div className="animotion-fade-in animotion-duration-300">
      <div className="animotion-zoom-in animotion-ease-spring">
        {children}
      </div>
    </div>
  ) : null;
}
```

### Vue

```vue
<template>
  <transition enter-active-class="animotion-fade-in-up" leave-active-class="animotion-fade-out-down">
    <div v-if="show">Content</div>
  </transition>
</template>
```

### Tailwind CSS

Use alongside Tailwind — Animotion classes don't conflict:

```html
<div class="bg-white rounded-lg shadow-md p-6 animotion-card-lift">
  Tailwind styling + Animotion animation
</div>
```

### Angular

```typescript
@Component({
  template: `<div [class]="animClass">{{ message }}</div>`
})
export class MyComponent {
  animClass = 'animotion-fade-in animotion-duration-500';
}
```

---

## Browser Support

Animotion works in all modern browsers:

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |
| Opera | 47+ |
| iOS Safari | 12+ |
| Chrome Android | 60+ |

---

## Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Add animations** — add @keyframes to `css/keyframes-part2.css` and entries to `js/data.js`
3. **Add icons** — add SVG entries to `js/icons.js`
4. **Run** `node scripts/generate-api.js` to update `api.json`
5. **Submit** a pull request

### Adding a new animation

1. Add the `@keyframes` to `css/keyframes-part2.css`:
```css
@keyframes animotion-myAnimation {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

2. Add the entry to `js/data.js`:
```javascript
{
  id: 'CUSTOM01',
  name: 'My Animation',
  description: 'A custom entrance animation',
  cssClass: 'animotion-my-animation',
  keyframeName: 'animotion-myAnimation',
  category: 'entrance',
  subcategory: 'custom',
  tags: ['custom', 'entrance'],
  duration: '0.6s',
  timingFunction: 'ease-out',
  iterationCount: '1',
  fillMode: 'both',
  demoType: 'box',
  css: `.animotion-my-animation { animation: animotion-myAnimation 0.6s ease-out both; }`,
  keyframeCSS: `@keyframes animotion-myAnimation { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`
}
```

3. Regenerate API: `node scripts/generate-api.js`

---

## License

MIT License. Free forever. Commercial use allowed.

Built by [Bachao.AI](https://bachao.ai) for the developer community.

---

## Links

- **Website:** https://animationiconsmcp.github.io
- **GitHub:** https://github.com/animationiconsmcp/animationiconsmcp.github.io
- **API JSON:** https://animationiconsmcp.github.io/api.json
- **API Docs:** https://animationiconsmcp.github.io/docs/api.md
