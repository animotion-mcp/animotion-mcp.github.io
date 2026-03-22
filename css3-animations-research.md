# CSS3 Animation Encyclopedia — Research & Build Specification
## Project: Bachao.AI Community Tool | Open Source | GitHub Pages Ready

> **Handover Document for Claude Code**
> Author: Research compiled via Bachao.AI + Claude
> License: MIT
> Target: 300+ animations, multi-file GitHub Pages project, light theme, filterable grid, instant copy

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack & File Structure](#2-tech-stack--file-structure)
3. [Design Spec](#3-design-spec)
4. [Complete Animation Taxonomy (300+)](#4-complete-animation-taxonomy)
   - 4.1 Entrance Animations (45)
   - 4.2 Exit Animations (20)
   - 4.3 Attention Seekers (20)
   - 4.4 Text Effects (30)
   - 4.5 Background Animations (25)
   - 4.6 Button Animations (25)
   - 4.7 Card Animations (20)
   - 4.8 Loaders & Spinners (30)
   - 4.9 Navigation Animations (15)
   - 4.10 Form / Input Animations (15)
   - 4.11 3D Transform Animations (15)
   - 4.12 CSS Filter Animations (12)
   - 4.13 Micro-Interactions (20)
   - 4.14 Scroll Animations (10)
   - 4.15 Creative / Artistic (15)
   - 4.16 Fintech / Finance (12)
   - 4.17 Gaming / Physics (15)
5. [All @keyframes Definitions](#5-all-keyframes-definitions)
6. [UI/UX Feature Spec](#6-uiux-feature-spec)
7. [Branding & Donation](#7-branding--donation)
8. [GitHub Pages Setup](#8-github-pages-setup)
9. [MIT License Text](#9-mit-license)

---

## 1. PROJECT OVERVIEW

**Name:** CSS3 Animation Encyclopedia
**Tagline:** Every CSS3 Animation, Live. 300+ effects, zero dependencies.
**By:** Bachao.AI — community give-back tool for developers and vibe coders
**URL:** To be hosted on GitHub Pages (e.g. `bachao-ai.github.io/css3-animations`)
**License:** MIT (open source, free forever)

### Goals
- Single reference for every possible CSS3 animation technique
- Live preview of every animation in a card thumbnail
- One-click CSS code copy for instant use
- Filterable by category, searchable by name/technique
- Light background theme so animations pop visually
- Donation CTA (CashFree/UPI QR + online link) for Bachao.AI support
- No JS frameworks, no build tools — pure HTML/CSS/JS for GitHub Pages

---

## 2. TECH STACK & FILE STRUCTURE

```
css3-animations/                    ← repo root
├── index.html                      ← main app shell
├── LICENSE                         ← MIT license
├── README.md                       ← project readme
├── css/
│   ├── style.css                   ← layout, UI, light theme tokens
│   ├── keyframes.css               ← ALL @keyframes definitions only
│   └── demos.css                   ← animation applied to demo elements
├── js/
│   ├── data.js                     ← animations[] array (all 300+ entries)
│   └── app.js                      ← filter, search, modal, render logic
├── assets/
│   ├── qr-cashfree.png             ← CashFree/UPI QR code image
│   └── og-image.png                ← Open Graph preview image
└── .github/
    └── workflows/
        └── pages.yml               ← GitHub Pages deploy action
```

**Rules:**
- Zero npm, zero webpack, zero React — static files only
- Google Fonts via CDN: `Plus Jakarta Sans` (UI) + `Fira Code` (mono/code)
- CSS custom properties (variables) for all colors and tokens
- All animations run on `transform` and `opacity` only where possible (GPU-composited)
- `will-change: transform` on preview elements

---

## 3. DESIGN SPEC

### Color Tokens (CSS Variables)
```css
:root {
  /* Backgrounds - LIGHT THEME */
  --bg:        #f5f7fa;     /* page background */
  --bg2:       #eef0f5;     /* subtle offset bg */
  --surface:   #ffffff;     /* cards, panels */
  --surface2:  #f8fafc;     /* input, code bg */
  --overlay:   rgba(15,23,42,0.55);

  /* Text */
  --tx:   #0f172a;   /* primary text */
  --tx2:  #334155;   /* secondary */
  --tx3:  #64748b;   /* muted */
  --tx4:  #94a3b8;   /* placeholder */

  /* Borders */
  --br:   #e2e8f0;
  --br2:  #cbd5e1;

  /* Brand / Accent */
  --primary:   #6366f1;   /* indigo */
  --primary-l: #eef2ff;
  --primary-d: #4f46e5;

  /* Category Colors */
  --c-entrance:     #3b82f6;  /* blue */
  --c-exit:         #94a3b8;  /* slate */
  --c-attention:    #f59e0b;  /* amber */
  --c-text:         #8b5cf6;  /* violet */
  --c-background:   #10b981;  /* emerald */
  --c-buttons:      #ef4444;  /* red */
  --c-cards:        #06b6d4;  /* cyan */
  --c-loaders:      #6366f1;  /* indigo */
  --c-navigation:   #f97316;  /* orange */
  --c-forms:        #ec4899;  /* pink */
  --c-transforms3d: #14b8a6;  /* teal */
  --c-filters:      #a855f7;  /* purple */
  --c-micro:        #84cc16;  /* lime */
  --c-scroll:       #0ea5e9;  /* sky */
  --c-creative:     #e879f9;  /* fuchsia */
  --c-fintech:      #fbbf24;  /* yellow */
  --c-gaming:       #4ade80;  /* green */
}
```

### Typography
- **Display/UI:** `Plus Jakarta Sans` — weights 400, 600, 700, 800
- **Code:** `Fira Code` — weights 400, 500
- Base size: 14px, line-height: 1.6

### Layout
- Sticky header: 60px height
- Left sidebar: 220px, sticky, category nav + tag cloud + donate CTA
- Main content: fluid, max-width 1600px
- Card grid: `repeat(auto-fill, minmax(240px, 1fr))`, gap 16px
- Card preview area height: 200px (grid view), 120px (compact view)
- Sidebar hides at < 1024px (hamburger menu)
- Fully responsive down to 320px

### Card Anatomy
```
┌─────────────────────────────┐
│                             │  ← 200px preview area (light bg)
│      LIVE ANIMATION         │     checker pattern underneath
│                             │
├─────────────────────────────┤
│ Animation Name              │  ← 13.5px, 700 weight
│ ● Category   [technique]    │  ← badge + mono tag
│ Short description of        │  ← 2-line clamp, 11.5px muted
│ what this animation does.   │
└─────────────────────────────┘
```

Click card → opens code modal with:
- Full-size live preview (220px)
- Description
- CSS tab (copy-ready @keyframes + usage class)
- HTML tab (copy-ready HTML snippet)

---

## 4. COMPLETE ANIMATION TAXONOMY

### 4.1 ENTRANCE ANIMATIONS (45)

| ID | Name | Technique | CSS Class |
|----|------|-----------|-----------|
| E01 | Fade In | opacity | `.anim-fade-in` |
| E02 | Fade In Up | opacity + translateY | `.anim-fade-in-up` |
| E03 | Fade In Down | opacity + translateY | `.anim-fade-in-down` |
| E04 | Fade In Left | opacity + translateX | `.anim-fade-in-left` |
| E05 | Fade In Right | opacity + translateX | `.anim-fade-in-right` |
| E06 | Fade In Up Big | opacity + translateY(100%) | `.anim-fade-in-up-big` |
| E07 | Fade In Down Big | opacity + translateY(-100%) | `.anim-fade-in-down-big` |
| E08 | Fade In Left Big | opacity + translateX(-100%) | `.anim-fade-in-left-big` |
| E09 | Fade In Right Big | opacity + translateX(100%) | `.anim-fade-in-right-big` |
| E10 | Fade In Top Left | opacity + translate(-20px,-20px) | `.anim-fade-in-top-left` |
| E11 | Fade In Top Right | opacity + translate(20px,-20px) | `.anim-fade-in-top-right` |
| E12 | Fade In Bottom Left | opacity + translate(-20px,20px) | `.anim-fade-in-bottom-left` |
| E13 | Fade In Bottom Right | opacity + translate(20px,20px) | `.anim-fade-in-bottom-right` |
| E14 | Slide In Up | translateY(100%) | `.anim-slide-in-up` |
| E15 | Slide In Down | translateY(-100%) | `.anim-slide-in-down` |
| E16 | Slide In Left | translateX(-100%) | `.anim-slide-in-left` |
| E17 | Slide In Right | translateX(100%) | `.anim-slide-in-right` |
| E18 | Zoom In | scale(0.3) + opacity | `.anim-zoom-in` |
| E19 | Zoom In Up | scale + translateY | `.anim-zoom-in-up` |
| E20 | Zoom In Down | scale + translateY | `.anim-zoom-in-down` |
| E21 | Zoom In Left | scale + translateX | `.anim-zoom-in-left` |
| E22 | Zoom In Right | scale + translateX | `.anim-zoom-in-right` |
| E23 | Flip In X | perspective + rotateX | `.anim-flip-in-x` |
| E24 | Flip In Y | perspective + rotateY | `.anim-flip-in-y` |
| E25 | Rotate In | rotate(-200deg) + opacity | `.anim-rotate-in` |
| E26 | Rotate In Down Left | rotate(-45deg) origin:left-bottom | `.anim-rotate-in-down-left` |
| E27 | Rotate In Down Right | rotate(45deg) origin:right-bottom | `.anim-rotate-in-down-right` |
| E28 | Rotate In Up Left | rotate(45deg) origin:left-bottom | `.anim-rotate-in-up-left` |
| E29 | Rotate In Up Right | rotate(-90deg) origin:right-bottom | `.anim-rotate-in-up-right` |
| E30 | Bounce In | scale spring sequence | `.anim-bounce-in` |
| E31 | Bounce In Up | translateY with spring | `.anim-bounce-in-up` |
| E32 | Bounce In Down | translateY(-3000px) spring | `.anim-bounce-in-down` |
| E33 | Bounce In Left | translateX(-3000px) spring | `.anim-bounce-in-left` |
| E34 | Bounce In Right | translateX(3000px) spring | `.anim-bounce-in-right` |
| E35 | Light Speed In Left | translateX + skewX(30deg) | `.anim-light-speed-in-left` |
| E36 | Light Speed In Right | translateX + skewX(-30deg) | `.anim-light-speed-in-right` |
| E37 | Roll In | translateX(-100%) + rotate(-120deg) | `.anim-roll-in` |
| E38 | Jack In The Box | scale(0.1) + rotate(30deg) origin:bottom | `.anim-jack-in-the-box` |
| E39 | Hinge | rotate(80deg) origin:top-left, drops | `.anim-hinge` |
| E40 | Blur Reveal | filter:blur(20px) → blur(0) | `.anim-blur-reveal` |
| E41 | Clip Wipe Left | clip-path:inset(0 100% 0 0) → inset(0) | `.anim-clip-wipe-left` |
| E42 | Clip Wipe Top | clip-path:inset(100% 0 0 0) → inset(0) | `.anim-clip-wipe-top` |
| E43 | Circle Reveal | clip-path:circle(0%) → circle(150%) | `.anim-circle-reveal` |
| E44 | Iris Wipe | clip-path ellipse expand | `.anim-iris-wipe` |
| E45 | Text Wipe | clip-path:inset(0 100% 0 0) on text | `.anim-text-wipe` |

### 4.2 EXIT ANIMATIONS (20)

| ID | Name | Technique | CSS Class |
|----|------|-----------|-----------|
| X01 | Fade Out | opacity:1→0 | `.anim-fade-out` |
| X02 | Fade Out Up | opacity + translateY(-40px) | `.anim-fade-out-up` |
| X03 | Fade Out Down | opacity + translateY(40px) | `.anim-fade-out-down` |
| X04 | Fade Out Left | opacity + translateX(-40px) | `.anim-fade-out-left` |
| X05 | Fade Out Right | opacity + translateX(40px) | `.anim-fade-out-right` |
| X06 | Slide Out Up | translateY(-100%) | `.anim-slide-out-up` |
| X07 | Slide Out Down | translateY(100%) | `.anim-slide-out-down` |
| X08 | Slide Out Left | translateX(-100%) | `.anim-slide-out-left` |
| X09 | Slide Out Right | translateX(100%) | `.anim-slide-out-right` |
| X10 | Zoom Out | scale(1)→scale(0.3)+opacity | `.anim-zoom-out` |
| X11 | Zoom Out Up | scale + translateY(-2000px) | `.anim-zoom-out-up` |
| X12 | Zoom Out Down | scale + translateY(2000px) | `.anim-zoom-out-down` |
| X13 | Zoom Out Left | scale + translateX(-2000px) | `.anim-zoom-out-left` |
| X14 | Zoom Out Right | scale + translateX(2000px) | `.anim-zoom-out-right` |
| X15 | Flip Out X | perspective + rotateX(90deg) + opacity | `.anim-flip-out-x` |
| X16 | Flip Out Y | perspective + rotateY(90deg) + opacity | `.anim-flip-out-y` |
| X17 | Rotate Out | rotate(200deg) + opacity | `.anim-rotate-out` |
| X18 | Roll Out | translateX(100%) + rotate(120deg) | `.anim-roll-out` |
| X19 | Light Speed Out Left | translateX(-100%) + skewX(-30deg) | `.anim-light-speed-out-left` |
| X20 | Light Speed Out Right | translateX(100%) + skewX(30deg) | `.anim-light-speed-out-right` |

### 4.3 ATTENTION SEEKERS (20)

| ID | Name | Technique | CSS Class |
|----|------|-----------|-----------|
| A01 | Bounce | translateY with gravity easing | `.anim-bounce` |
| A02 | Flash | opacity on/off steps | `.anim-flash` |
| A03 | Pulse | scale(1)→scale(1.05) | `.anim-pulse` |
| A04 | Rubber Band | scaleX/Y squash+stretch | `.anim-rubber-band` |
| A05 | Shake X | translateX oscillation | `.anim-shake-x` |
| A06 | Shake Y | translateY oscillation | `.anim-shake-y` |
| A07 | Head Shake | translateX + rotateY | `.anim-head-shake` |
| A08 | Swing | rotate oscillation, top-center origin | `.anim-swing` |
| A09 | Tada | scale + rotate party | `.anim-tada` |
| A10 | Wobble | translateX + rotate wave | `.anim-wobble` |
| A11 | Jello | skewX/Y rapid oscillation | `.anim-jello` |
| A12 | Heart Beat | scale double-pump | `.anim-heartbeat` |
| A13 | Spin | rotate(360deg) infinite | `.anim-spin` |
| A14 | Wiggle | rotate(-5deg)→(5deg) | `.anim-wiggle` |
| A15 | Float | translateY up/down | `.anim-float` |
| A16 | Breathe | scale very subtle | `.anim-breathe` |
| A17 | Nod | rotateX slight | `.anim-nod` |
| A18 | Tilt | rotate slight left-right | `.anim-tilt` |
| A19 | Blink | opacity 1→0→1 | `.anim-blink` |
| A20 | Snap | scale(1)→(0.9)→(1) sharp | `.anim-snap` |

### 4.4 TEXT EFFECTS (30)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| T01 | Typewriter | width:0→100% + steps() + cursor blink | Classic terminal effect |
| T02 | Typewriter Delete | width loop: grow → shrink → grow | Type & delete cycle |
| T03 | Shimmer Text | bg gradient background-position sweep | Premium / metallic |
| T04 | Gradient Text | animated gradient background-clip | Rainbow colour shift |
| T05 | Glitch Text | clip-path slices + translate | Cyberpunk corruption |
| T06 | RGB Split | text-shadow color offset | Red/blue channel split |
| T07 | Neon Flicker | text-shadow on/off steps | Neon sign effect |
| T08 | Text Wipe Reveal | clip-path inset(0 100% 0 0) → 0 | Mask reveal |
| T09 | Text Split (per-char) | overflow:hidden + translateY per span | Cinematic entrance |
| T10 | Letter Wave | translateY + rotate per char stagger | Playful typography |
| T11 | Char Wave | translateY wave per character | Audio-reactive style |
| T12 | Blur Reveal | filter:blur(12px) → blur(0) | Soft focus entrance |
| T13 | Zoom Text | scale(3)→scale(1) + opacity | Impact entrance |
| T14 | 3D Flip Text | perspective + rotateX | Board/scoreboard flip |
| T15 | Outlined Pulsing | -webkit-text-stroke, color toggle | Artistic hollow text |
| T16 | Rainbow Text | color through spectrum | Festive / pride |
| T17 | Text Trail / 3D Shadow | text-shadow depth steps | Extrude effect |
| T18 | Text Pop | scale spring entrance | Notification style |
| T19 | Marquee Scroll | translateX(-100%) infinite | News ticker |
| T20 | Text Cascade | letter-spacing expand + opacity | Letterpress reveal |
| T21 | Text Scramble | filter:blur + hue-rotate glitch | Data corruption |
| T22 | Shadow Expand | text-shadow grow | Depth on hover |
| T23 | Word Flip Carousel | translateY multi-word loop | Rotating hero words |
| T24 | Typing Cursor Only | border-right blink | Standalone cursor |
| T25 | Gradient Border Text | border gradient animated | Premium badge style |
| T26 | Stagger Cascade | each word/letter with delay | Reveal sequence |
| T27 | Text Slide Up Reveal | per-line overflow:hidden reveal | Editorial style |
| T28 | Ink Drop Text | scale+blur bloom | Artistic entrance |
| T29 | Text Glitch Clone | ::before/::after offset layers | Advanced glitch |
| T30 | Counter Roll | translateY slot-machine number roll | KPI / stats |

### 4.5 BACKGROUND ANIMATIONS (25)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| B01 | Gradient Shift | background-position 400% loop | Hero section staple |
| B02 | Aurora | gradient + hue-rotate | Premium SaaS |
| B03 | Mesh Gradient | multi radial-gradient shift | Design tool aesthetic |
| B04 | Animated Grid | CSS grid lines + opacity pulse | Developer tools |
| B05 | Dot Grid Pulse | radial-gradient dot pattern | Subtle texture |
| B06 | Starfield | radial-gradient dots + translateZ | Dark mode hero |
| B07 | Bokeh Circles | blurred circles floating | Photography/art |
| B08 | Plasma | multi-layer radial gradients | Psychedelic |
| B09 | Matrix Rain | vertical columns translateY stagger | Hacker aesthetic |
| B10 | Conic Spin | conic-gradient + rotate | Loading/hero |
| B11 | Wave Blob | border-radius 8-point morph | Modern SaaS |
| B12 | Ripple Expand | scale+opacity rings | Click/pulse feedback |
| B13 | Circuit Board | SVG stroke-dashoffset lines | Tech/dev |
| B14 | Confetti Rain | multi-element translate+rotate | Celebration |
| B15 | Bubble Float | translateY circles | Playful/startup |
| B16 | Spotlight Move | radial-gradient position shift | Dark hero |
| B17 | Moving Gradient | background-size 300% shift | General purpose |
| B18 | Noise Overlay | opacity pulse on grain texture | Film grain |
| B19 | Geometric Rotate | SVG shapes rotating | Creative/agency |
| B20 | Parallax Layers | translate at different speeds | Depth illusion |
| B21 | Hue Rotate BG | filter:hue-rotate full cycle | Psychedelic bg |
| B22 | Scanline CRT | linear-gradient scanline sweep | Retro/gaming |
| B23 | Holographic Foil | conic-gradient + hue-rotate | Premium product |
| B24 | Lava Lamp | border-radius blob + translate | 70s aesthetic |
| B25 | Particle Field | many small dots floating | AI/tech dashboard |

### 4.6 BUTTON ANIMATIONS (25)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| BT01 | Ripple Click | scale+opacity ::after pseudo | Material Design |
| BT02 | Glow Pulse | box-shadow animate | CTA emphasis |
| BT03 | Shine Sweep | bg-position sweep highlight | Premium button |
| BT04 | Fill Left | scaleX from left ::before | Hover fill reveal |
| BT05 | Fill Right | scaleX from right | Hover fill reveal |
| BT06 | Fill Top | scaleY from top | Hover fill reveal |
| BT07 | Fill Bottom | scaleY from bottom | Hover fill reveal |
| BT08 | 3D Press | translateY(4px) + shadow | Tactile depth |
| BT09 | Border Draw | clip-path inset sequence | Outline reveal |
| BT10 | Gradient Border | bg gradient padding-box | Animated border |
| BT11 | Gradient Sweep | background-position animate | Colour flow |
| BT12 | Magnetic Pull | translate micro-movement | Hover magnet |
| BT13 | Shake Error | translateX oscillation | Form validation |
| BT14 | Success Checkmark | scale + checkmark draw | Confirm state |
| BT15 | Loading Spinner | spinning border inside btn | Async state |
| BT16 | Progress Fill | width 0→100% on btn bg | Countdown/install |
| BT17 | Jelly Bounce | scaleX/Y spring | Playful CTA |
| BT18 | Elastic Scale | scale spring overshoot | Fun confirmation |
| BT19 | Outline Grow | box-shadow outward ring | Accessibility focus |
| BT20 | Icon Slide In | translateX icon on hover | Add icon on hover |
| BT21 | Color Wave | background-color transition | State change |
| BT22 | Neon Glow | text-shadow + box-shadow | Dark theme CTA |
| BT23 | Spotlight Sweep | gradient position hover | Luxury feel |
| BT24 | Text Flip | translateY on text hover | Dual-state label |
| BT25 | Btn 3D Flip | perspective + rotateX | Front/back states |

### 4.7 CARD ANIMATIONS (20)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| C01 | Card Lift | translateY(-8px) + shadow | Standard hover |
| C02 | 3D Flip Front/Back | perspective + rotateY 180deg | Two-sided card |
| C03 | 3D Tilt Hover | perspective + rotateX/Y | Mouse-track feel |
| C04 | Glassmorphism Card | backdrop-filter + shimmer | Frosted glass |
| C05 | Neumorphism Press | box-shadow inset toggle | Soft UI press |
| C06 | Glow Border | box-shadow animate | Highlight/feature |
| C07 | Gradient Border Anim | bg gradient border | Premium card |
| C08 | Zoom Image | scale(1.1) on img child | Product hover |
| C09 | Overlay Reveal | translateY(100%) → 0 | Info on hover |
| C10 | Slide Info Panel | translateY from bottom | Caption reveal |
| C11 | Scale In | scale(0.85) → scale(1) | Entrance |
| C12 | Shadow Bloom | box-shadow coloured glow | Hero card |
| C13 | Shimmer Loading | gradient bg-position sweep | Skeleton loading |
| C14 | Skeleton Screen | grey bars + shimmer sheen | Content loading |
| C15 | Rotate Y | rotateY 20deg sway | 3D hint |
| C16 | Polaroid Drop | rotate + translateY drop | Photo style |
| C17 | Card Unfold | rotateX from top origin | Page-turn |
| C18 | Flip Reveal | rotateY(-90deg) → 0 | Sidebar reveal |
| C19 | Border Collapse Draw | clip-path polygon sequence | Border trace |
| C20 | Confetti Success Card | multi-particle burst | Achievement |

### 4.8 LOADERS & SPINNERS (30)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| L01 | Spinner (Border) | border + rotate | Classic |
| L02 | Dual Ring | dual border colors | Colourful |
| L03 | Triple Ring | triple border colors | Vibrant |
| L04 | Conic Spinner | conic-gradient + mask | Modern |
| L05 | Gradient Spinner | multi-color conic | Premium |
| L06 | Dots Wave | scale + stagger 3 dots | Messaging |
| L07 | Dots Bounce | translateY stagger | General |
| L08 | Dots Scale | scale in/out stagger | Clean |
| L09 | Dots Fade | opacity stagger | Minimal |
| L10 | Dots Orbit | rotate + translateX | Planetary |
| L11 | Bars Wave | height animate stagger | Equalizer |
| L12 | Bars Scale | scaleY stagger | Music/audio |
| L13 | Bars Strobe | opacity stagger | Intense |
| L14 | Orbital | dot orbiting center | Scientific |
| L15 | Ping Pulse | scale + opacity ring | Status dot |
| L16 | Progress Bar | width animation | Upload/install |
| L17 | Indeterminate Bar | translateX infinite | Unknown duration |
| L18 | Striped Progress | bg-position diagonal | Classic progress |
| L19 | Circle Progress (SVG) | stroke-dashoffset | Percentage |
| L20 | Semi-Circle Progress | stroke-dashoffset half | Speed gauge |
| L21 | Skeleton Lines | bg shimmer bars | Content load |
| L22 | Heartbeat Monitor | SVG polyline draw | Health/bio |
| L23 | DNA Helix | rotateY 3D nodes | Bio/science |
| L24 | 3D Cube Spin | rotate3d all axes | Creative loader |
| L25 | Dots Grid Pulse | 3x3 grid scale stagger | Matrix effect |
| L26 | Infinity SVG | stroke-dashoffset ∞ path | Loop concept |
| L27 | Hourglass Flip | rotate(180deg) pause sequence | Time concept |
| L28 | WiFi Bars | opacity stagger 3 bars | Connectivity |
| L29 | Battery Fill | width animate | Power/energy |
| L30 | Typing Indicator | 3 dots translate | Chat/messaging |

### 4.9 NAVIGATION ANIMATIONS (15)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| N01 | Underline Grow | scaleX from left ::after | Nav hover |
| N02 | Underline Slide | translateX indicator | Tab/nav switch |
| N03 | Hamburger → X | rotate + translate 3 bars | Mobile menu |
| N04 | Hamburger → Arrow | bar morph to back arrow | Alt mobile |
| N05 | Dropdown Slide | translateY + scaleY + opacity | Dropdown open |
| N06 | Drawer Slide In | translateX(-100%) → 0 | Side nav |
| N07 | Sticky Nav Compact | padding reduce on scroll | Scroll shrink |
| N08 | Back To Top Appear | opacity + translateY | Scroll-trigger btn |
| N09 | Scroll Progress Bar | scaleX from left | Reading progress |
| N10 | Pagination Hop | translateY hop on active | Page indicator |
| N11 | Breadcrumb Cascade | translateX stagger each item | Page trail |
| N12 | Tab Active Pill | scale bounce on tab click | Tab switcher |
| N13 | Bottom Nav Active | translateY + scale icon | Mobile bottom nav |
| N14 | Dropdown Arrow Spin | rotate(180deg) on open | Accordion/select |
| N15 | Nav Link Rainbow | color sweep on hover | Creative nav |

### 4.10 FORM / INPUT ANIMATIONS (15)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| F01 | Label Float | translateY + scale up on focus | Floating label |
| F02 | Input Glow Focus | box-shadow expand on focus | Focus ring |
| F03 | Input Shake Error | translateX oscillation | Validation error |
| F04 | Input Success Border | border-color green glow | Valid state |
| F05 | Checkbox Draw | SVG stroke-dashoffset checkmark | Check animation |
| F06 | Checkbox Scale Pop | scale spring on check | Tactile confirm |
| F07 | Radio Fill | scale(0)→(1) inner dot | Radio select |
| F08 | Radio Ping | box-shadow ripple on select | Radio feedback |
| F09 | Toggle Slide | translateX knob | On/off switch |
| F10 | Toggle Morph | knob scale + rotate | Smooth toggle |
| F11 | Search Bar Expand | width expand on focus | Search UX |
| F12 | Password Reveal | clip-path circle reveal | Show/hide pw |
| F13 | Range Fill | width grow with value | Slider fill |
| F14 | Form Progress Steps | clip-path wipe step to step | Wizard/stepper |
| F15 | Select Slide Open | translateY dropdown | Custom select |

### 4.11 3D TRANSFORM ANIMATIONS (15)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| D01 | Rotate X Axis | perspective + rotateX(360deg) | Vertical spin |
| D02 | Rotate Y Axis | perspective + rotateY(360deg) | Horizontal spin |
| D03 | Rotate Z Axis | perspective + rotateZ(360deg) | Flat spin |
| D04 | Full 3D Cube Spin | rotateX + rotateY combo | All-axis rotation |
| D05 | Card Flip Front/Back | rotateY(180deg) two-face | 2-sided card |
| D06 | Perspective Tilt | rotateX/Y hover feel | Card 3D hover |
| D07 | 3D Text Extrude | text-shadow layered depth | Dimensional text |
| D08 | Button 3D Press | translateZ(-10px) | Depth press |
| D09 | Fold From Top | rotateX(-90deg) origin:bottom → 0 | Page fold |
| D10 | Sphere Illusion | rotateY + rotateX constant | Planet spin |
| D11 | Cylinder Spin | perspective + rotateY | Drum/cylinder |
| D12 | Book Page Open | rotateY(-180deg) origin:right | Page turn |
| D13 | Door Open 3D | rotateY(-80deg) origin:left | Door hinge |
| D14 | Dice Roll | rotate3d(1,1,0,360deg) | Random/chance |
| D15 | Panorama Spin | perspective(800px) rotateY | 360 view |

### 4.12 CSS FILTER ANIMATIONS (12)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| FL01 | Blur In | blur(20px) → blur(0) | Focus entrance |
| FL02 | Unblur on Hover | blur(6px) → blur(0) | Reveal on hover |
| FL03 | Grayscale to Color | grayscale(100%) → 0 | Dramatic reveal |
| FL04 | Sepia Wash | sepia 0→1→0 | Vintage effect |
| FL05 | Brightness Pulse | brightness(1) → brightness(1.4) | Flash/pulse |
| FL06 | Contrast Pop | contrast(1) → contrast(1.8) | Bold pop |
| FL07 | Hue Rotate Cycle | hue-rotate(0→360deg) | Rainbow cycle |
| FL08 | Invert Flash | invert(0→1) | Strobe / glitch |
| FL09 | Drop Shadow Grow | drop-shadow grow on hover | Depth reveal |
| FL10 | RGB Channel Split | text-shadow R+B offset | Glitch effect |
| FL11 | Saturate Pulse | saturate(1→3) | Colour pop |
| FL12 | Glass Blur BG | backdrop-filter:blur animate | Frosted glass |

### 4.13 MICRO-INTERACTIONS (20)

| ID | Name | Technique | Notes |
|----|------|-----------|-------|
| M01 | Checkbox Animated | SVG stroke-dashoffset draw | Form feedback |
| M02 | Toggle Switch | translateX knob + bg | Settings |
| M03 | Heart Like Pop | scale spring double-pump | Social media |
| M04 | Bell Shake | rotate sequence | Notifications |
| M05 | Badge Pop | scale+rotate spring | Unread count |
| M06 | Star Rating Fill | color + glow + scale per star | Rating input |
| M07 | Hamburger → X | rotate 3-bar morph | Mobile nav |
| M08 | Button Ripple | scale+opacity ::after circle | Click feedback |
| M09 | Copy Button → Copied | scale + color transition | Clipboard |
| M10 | Delete Shake | translateX + rotate | Confirm delete |
| M11 | Tooltip Appear | translateY + scale | Hover info |
| M12 | Toast Notification | translateX slide in | System message |
| M13 | Progress Step Fill | clip-path or width step | Wizard step |
| M14 | Tab Active Slide | translateX indicator | Tab switch |
| M15 | Swipe Reveal | translateX(100%) → 0 | Mobile swipe |
| M16 | Menu Item Stagger | translateX + opacity stagger | Menu open |
| M17 | Dropdown Arrow Flip | rotate(180deg) | Expand/collapse |
| M18 | Modal Open | scale(0.88) + translateY + opacity | Dialog open |
| M19 | Drawer Peek | translateX(-100%) → 0 | Side panel |
| M20 | Search Focus Morph | width + border-radius expand | Search UX |

### 4.14 SCROLL-TRIGGERED ANIMATIONS (10)

> Note: Pure CSS scroll animations use `animation-timeline: scroll()` (modern browsers) or JS IntersectionObserver + CSS class toggle. Provide both methods.

| ID | Name | Technique |
|----|------|-----------|
| S01 | Reveal on Scroll | translateY + opacity, .is-visible class |
| S02 | Parallax Shift | translateY offset elements |
| S03 | Stagger List Items | delay per nth-child |
| S04 | Counter Count Up | JS number + CSS translateY |
| S05 | Section Wipe | clip-path inset trigger |
| S06 | Scroll Progress Bar | scaleX from left on body scroll |
| S07 | Infinite Carousel | translateX(-50%) loop no-JS |
| S08 | Scroll Reveal Left | translateX(-40px) + opacity |
| S09 | Scroll Reveal Right | translateX(40px) + opacity |
| S10 | Anchor Jump Indicator | translateY bob on anchor link |

### 4.15 CREATIVE / ARTISTIC (15)

| ID | Name | Technique |
|----|------|-----------|
| CR01 | Blob Liquid Morph | border-radius 8-handle |
| CR02 | Shape Morph (Polygon) | clip-path polygon sequence |
| CR03 | Ink Drop Bloom | scale + filter:blur + opacity |
| CR04 | Paint Splash Reveal | clip-path circle(0→150%) |
| CR05 | Neon Sign | text-shadow on/off flicker |
| CR06 | Retro CRT | brightness/contrast glitch |
| CR07 | Light Rays | gradient + hue-rotate slow |
| CR08 | Kaleidoscope | rotate + scale mirror |
| CR09 | Smoke Drift | translateY + scaleX + blur |
| CR10 | Origami Fold | rotate3d sequential folds |
| CR11 | Rainbow Trail | box-shadow color chain |
| CR12 | Crystal Shatter | scale + brightness + opacity |
| CR13 | Geometric Morph | clip-path triangle→square→hex |
| CR14 | Parallax 3D Depth | translate Z layers |
| CR15 | Color Wash | grayscale(100%) → grayscale(0) |

### 4.16 FINTECH / FINANCE (12)

| ID | Name | Technique | Context |
|----|------|-----------|---------|
| FT01 | Counter Roll-Up | translateY slot + overflow:hidden | KPI reveal |
| FT02 | Chart Line Draw | SVG stroke-dashoffset | Stock chart |
| FT03 | Ticker Scroll | translateX(-100%) infinite | Market data |
| FT04 | Price Flash Green | color + bg flash | Price up |
| FT05 | Price Flash Red | color + bg flash | Price down |
| FT06 | Coin Flip 3D | perspective + rotateY(360deg) | Crypto/payment |
| FT07 | Bar Chart Grow | scaleY from bottom origin | Dashboard |
| FT08 | Candlestick Appear | scaleY + opacity | Trading chart |
| FT09 | Wallet Pop Spring | scale + rotate sequence | Payment success |
| FT10 | Pie Chart Draw | SVG stroke-dashoffset arc | Portfolio |
| FT11 | Pulse Live Indicator | ring expand + fade | Live data |
| FT12 | Health/Battery Bar | width animate left→right | Progress metric |

### 4.17 GAMING / PHYSICS (15)

| ID | Name | Technique | Context |
|----|------|-----------|---------|
| G01 | Physics Bounce | translateY + gravity easing | Ball/element |
| G02 | Elastic Pop | scale spring overshoot | Power-up |
| G03 | Rubber Band | scaleX/Y squash-stretch | Hit reaction |
| G04 | Jello Wiggle | skewX/Y rapid oscillation | Fun UI |
| G05 | Wobble Idle | rotate oscillation | Idle state |
| G06 | Fire Flicker | scaleY + skewX + brightness | Flame effect |
| G07 | Collectible Float | translateY + rotate bob | Pickup item |
| G08 | Explosion Pop | scale + rotate + opacity | Hit/achievement |
| G09 | Sword Slash | scaleX sweep rotate | Attack anim |
| G10 | Shield Pulse | box-shadow expand | Defense |
| G11 | Damage Shake | translateX + rotate | Damage reaction |
| G12 | Level Up | scale + rotate spring | Achievement |
| G13 | Coin Collect | translateY + rotateY | Coin pickup |
| G14 | Health Bar Fill | width from 0 to var(--hp) | Status bar |
| G15 | Particle Burst | multi-element scale + opacity | Impact effect |

---

## 5. ALL @KEYFRAMES DEFINITIONS

> Below are all the `@keyframes` rules. These go in `css/keyframes.css`.

### Core Entrance/Exit
```css
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInDown { from{opacity:0;transform:translateY(-40px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInUpBig { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInDownBig { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInLeftBig { from{opacity:0;transform:translateX(-100%)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInRightBig { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInTopLeft { from{opacity:0;transform:translate(-20px,-20px)} to{opacity:1;transform:translate(0)} }
@keyframes fadeInTopRight { from{opacity:0;transform:translate(20px,-20px)} to{opacity:1;transform:translate(0)} }
@keyframes fadeInBottomLeft { from{opacity:0;transform:translate(-20px,20px)} to{opacity:1;transform:translate(0)} }
@keyframes fadeInBottomRight { from{opacity:0;transform:translate(20px,20px)} to{opacity:1;transform:translate(0)} }

@keyframes slideInUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes slideInDown { from{transform:translateY(-100%)} to{transform:translateY(0)} }
@keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }

@keyframes zoomIn { from{opacity:0;transform:scale(0.3)} to{opacity:1;transform:scale(1)} }
@keyframes zoomOut { from{opacity:1;transform:scale(1)} 50%{opacity:0;transform:scale(0.3)} to{opacity:0} }
@keyframes zoomInUp {
  from{opacity:0;transform:scale(0.1) translateY(1000px)}
  60%{opacity:1;transform:scale(0.475) translateY(-60px)}
  to{transform:scale(1) translateY(0)}
}

@keyframes flipInX {
  from{transform:perspective(400px) rotateX(90deg);opacity:0}
  40%{transform:perspective(400px) rotateX(-20deg)}
  60%{transform:perspective(400px) rotateX(10deg);opacity:1}
  80%{transform:perspective(400px) rotateX(-5deg)}
  to{transform:perspective(400px) rotateX(0)}
}
@keyframes flipInY {
  from{transform:perspective(400px) rotateY(90deg);opacity:0}
  40%{transform:perspective(400px) rotateY(-20deg)}
  60%{transform:perspective(400px) rotateY(10deg);opacity:1}
  80%{transform:perspective(400px) rotateY(-5deg)}
  to{transform:perspective(400px) rotateY(0)}
}

@keyframes bounceIn {
  from,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}
  0%{opacity:0;transform:scale3d(0.3,0.3,0.3)}
  20%{transform:scale3d(1.1,1.1,1.1)}
  40%{transform:scale3d(0.9,0.9,0.9)}
  60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}
  80%{transform:scale3d(0.97,0.97,0.97)}
  to{opacity:1;transform:scale3d(1,1,1)}
}
@keyframes bounceInUp {
  from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}
  from{opacity:0;transform:translate3d(0,3000px,0)}
  60%{opacity:1;transform:translate3d(0,-20px,0)}
  75%{transform:translate3d(0,10px,0)}
  90%{transform:translate3d(0,-5px,0)}
  to{transform:translate3d(0,0,0)}
}
@keyframes lightSpeedInLeft {
  from{transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}
  60%{transform:skewX(-20deg);opacity:1}
  80%{transform:skewX(5deg)}
  to{transform:translate3d(0,0,0)}
}
@keyframes jackInTheBox {
  from{opacity:0;transform:scale(0.1) rotate(30deg);transform-origin:center bottom}
  50%{transform:rotate(-10deg)}
  70%{transform:rotate(3deg)}
  to{opacity:1;transform:scale(1)}
}
@keyframes hinge {
  0%,to{transform-origin:top left;animation-timing-function:ease-in-out}
  20%,60%{transform:rotate(80deg);transform-origin:top left}
  40%,80%{transform:rotate(60deg);transform-origin:top left}
  to{opacity:0;transform:translate3d(0,700px,0)}
}
@keyframes rollIn {
  from{opacity:0;transform:translate3d(-100%,0,0) rotate(-120deg)}
  to{opacity:1;transform:translate3d(0,0,0) rotate(0)}
}
```

### Attention Seekers
```css
@keyframes bounce {
  from,20%,53%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0)}
  40%,43%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-30px,0) scaleY(1.1)}
  70%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-15px,0) scaleY(1.05)}
  80%{transition-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0px,0) scaleY(0.95)}
  90%{transform:translate3d(0,-4px,0) scaleY(1.02)}
}
@keyframes flash { from,50%,to{opacity:1} 25%,75%{opacity:0} }
@keyframes pulse { from{transform:scale(1)} 50%{transform:scale(1.05)} to{transform:scale(1)} }
@keyframes rubberBand {
  from{transform:scale3d(1,1,1)} 30%{transform:scale3d(1.25,.75,1)} 40%{transform:scale3d(.75,1.25,1)}
  50%{transform:scale3d(1.15,.85,1)} 65%{transform:scale3d(.95,1.05,1)} 75%{transform:scale3d(1.05,.95,1)}
  to{transform:scale3d(1,1,1)}
}
@keyframes shakeX {
  from,to{transform:translate3d(0,0,0)}
  10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}
  20%,40%,60%,80%{transform:translate3d(10px,0,0)}
}
@keyframes shakeY {
  from,to{transform:translate3d(0,0,0)}
  10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}
  20%,40%,60%,80%{transform:translate3d(0,10px,0)}
}
@keyframes headShake {
  0%{transform:translateX(0)} 6.5%{transform:translateX(-6px) rotateY(-9deg)}
  18.5%{transform:translateX(5px) rotateY(7deg)} 31.5%{transform:translateX(-3px) rotateY(-5deg)}
  43.5%{transform:translateX(2px) rotateY(3deg)} 50%{transform:translateX(0)}
}
@keyframes swing {
  20%{transform:rotate(15deg)} 40%{transform:rotate(-10deg)} 60%{transform:rotate(5deg)}
  80%{transform:rotate(-5deg)} to{transform:rotate(0deg)}
}
@keyframes tada {
  from{transform:scale3d(1,1,1)} 10%,20%{transform:scale3d(.9,.9,.9) rotate(-3deg)}
  30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate(3deg)}
  40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate(-3deg)} to{transform:scale3d(1,1,1)}
}
@keyframes wobble {
  from{transform:translate3d(0,0,0)} 15%{transform:translate3d(-25%,0,0) rotate(-5deg)}
  30%{transform:translate3d(20%,0,0) rotate(3deg)} 45%{transform:translate3d(-15%,0,0) rotate(-3deg)}
  60%{transform:translate3d(10%,0,0) rotate(2deg)} 75%{transform:translate3d(-5%,0,0) rotate(-1deg)}
  to{transform:translate3d(0,0,0)}
}
@keyframes jello {
  from,11.1%,to{transform:translate3d(0,0,0)} 22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}
  33.3%{transform:skewX(6.25deg) skewY(6.25deg)} 44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}
  55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)} 66.6%{transform:skewX(-.78125deg) skewY(-.78125deg)}
  77.7%{transform:skewX(.390625deg) skewY(.390625deg)} 88.8%{transform:skewX(-.1953125deg) skewY(-.1953125deg)}
}
@keyframes heartBeat { 0%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.3)} 70%{transform:scale(1)} }
```

### Text Keyframes
```css
@keyframes typewriterAnim { from{width:0} to{width:100%} }
@keyframes cursorBlink { 0%,100%{border-color:currentColor} 50%{border-color:transparent} }
@keyframes shimmerText { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes gradientTextAnim { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes glitchText {
  0%,100%{transform:translate(0);clip-path:none}
  20%{transform:translate(-3px,2px);clip-path:inset(20% 0 60% 0)}
  40%{transform:translate(3px,-2px);clip-path:inset(50% 0 20% 0)}
  60%{transform:translate(-1px,1px);clip-path:inset(10% 0 80% 0)}
  80%{transform:translate(2px,-1px);clip-path:inset(70% 0 10% 0)}
}
@keyframes textSplitReveal { from{transform:translateY(110%)} to{transform:translateY(0)} }
@keyframes letterWave { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-12px) rotate(-5deg)} 75%{transform:translateY(-6px) rotate(3deg)} }
@keyframes neonFlickerText {
  0%,100%{text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px currentColor,0 0 42px currentColor}
  5%,35%{text-shadow:none;opacity:.7} 10%,30%{text-shadow:0 0 7px #fff,0 0 21px currentColor;opacity:1}
}
@keyframes textWipe { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes wordFlipAnim {
  0%,20%{transform:translateY(0)} 25%,45%{transform:translateY(-100%)}
  50%,70%{transform:translateY(-200%)} 75%,95%{transform:translateY(-300%)} 100%{transform:translateY(-400%)}
}
@keyframes rainbowText { 0%{color:#ef4444} 17%{color:#f97316} 33%{color:#fbbf24} 50%{color:#4ade80} 67%{color:#38bdf8} 83%{color:#a78bfa} 100%{color:#ef4444} }
@keyframes marqueeScroll { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
@keyframes rgbSplit { 0%,100%{text-shadow:none} 50%{text-shadow:-3px 0 rgba(255,0,0,.8),3px 0 rgba(0,0,255,.8)} }
@keyframes shadowExpand { from{text-shadow:none} to{text-shadow:2px 2px 0 rgba(0,0,0,.15),4px 4px 0 rgba(0,0,0,.1),6px 6px 0 rgba(0,0,0,.05)} }
```

### Background Keyframes
```css
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes auroraAnim {
  0%{background-position:0% 50%;filter:hue-rotate(0deg)}
  50%{background-position:100% 50%;filter:hue-rotate(30deg)}
  100%{background-position:0% 50%;filter:hue-rotate(0deg)}
}
@keyframes waveBg {
  0%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
  50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
  100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
}
@keyframes matrixRainDrop { 0%{transform:translateY(-100%);opacity:0} 10%{opacity:1} 90%{opacity:.8} 100%{transform:translateY(120%);opacity:0} }
@keyframes rippleBg { 0%{transform:scale(0);opacity:.8} 100%{transform:scale(4);opacity:0} }
@keyframes bokehFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-20px,30px) scale(0.9)} }
@keyframes conicSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes confettiShoot { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(-200px) rotate(720deg);opacity:0} }
@keyframes bubbleRise { 0%{transform:translateY(0) scale(1);opacity:.7} 100%{transform:translateY(-300px) scale(0);opacity:0} }
@keyframes spotlightMove { 0%,100%{background-position:30% 30%} 50%{background-position:70% 70%} }
```

### Button Keyframes
```css
@keyframes rippleEffect { 0%{transform:scale(0);opacity:.8} 100%{transform:scale(3);opacity:0} }
@keyframes glowPulseBtn { 0%,100%{box-shadow:0 0 5px currentColor} 50%{box-shadow:0 0 20px currentColor,0 0 40px currentColor} }
@keyframes fillLeft { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
@keyframes fillRight { from{transform:scaleX(0);transform-origin:right} to{transform:scaleX(1);transform-origin:right} }
@keyframes fillTop { from{transform:scaleY(0);transform-origin:top} to{transform:scaleY(1);transform-origin:top} }
@keyframes fillBottom { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
@keyframes shineBtn { 0%{background-position:-100% 0} 100%{background-position:200% 0} }
@keyframes shakeError { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
@keyframes successCheck { 0%{transform:scale(0) rotate(-20deg)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
@keyframes jellyBtn { 0%,100%{transform:scale(1)} 30%{transform:scaleX(1.15) scaleY(.85)} 50%{transform:scaleX(.95) scaleY(1.05)} 70%{transform:scaleX(1.05) scaleY(.97)} }
@keyframes magneticPull { 0%,100%{transform:translate(0)} 25%{transform:translate(3px,-3px)} 75%{transform:translate(-3px,3px)} }
@keyframes gradientBorderRotate { from{background-position:0%} to{background-position:100%} }
```

### Card Keyframes
```css
@keyframes cardLift { 0%,100%{transform:translateY(0);box-shadow:0 4px 12px rgba(0,0,0,.08)} 50%{transform:translateY(-8px);box-shadow:0 16px 32px rgba(0,0,0,.15)} }
@keyframes cardFlip3D { from{transform:perspective(600px) rotateY(0deg)} to{transform:perspective(600px) rotateY(180deg)} }
@keyframes cardTilt { 0%,100%{transform:perspective(600px) rotateX(0) rotateY(0)} 25%{transform:perspective(600px) rotateX(5deg) rotateY(8deg)} 75%{transform:perspective(600px) rotateX(-5deg) rotateY(-8deg)} }
@keyframes glowBorderCard { 0%,100%{box-shadow:0 0 5px rgba(99,102,241,.3)} 50%{box-shadow:0 0 20px rgba(99,102,241,.7),0 0 40px rgba(99,102,241,.3)} }
@keyframes overlayReveal { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes shadowBloom { 0%,100%{box-shadow:0 4px 12px rgba(0,0,0,.06)} 50%{box-shadow:0 8px 40px rgba(99,102,241,.25),0 4px 20px rgba(168,85,247,.15)} }
@keyframes neomorphPress { 0%,100%{box-shadow:6px 6px 12px #d1d9e6,-6px -6px 12px #ffffff} 50%{box-shadow:inset 6px 6px 12px #d1d9e6,inset -6px -6px 12px #ffffff} }
@keyframes polaroidDrop { from{transform:rotate(-8deg) translateY(-40px);opacity:0} to{transform:rotate(-2deg) translateY(0);opacity:1} }
@keyframes zoomCardImg { from{transform:scale(1)} to{transform:scale(1.1)} }
@keyframes glassShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
```

### Loader Keyframes
```css
@keyframes spinBorder { to{transform:rotate(360deg)} }
@keyframes dotsWaveAnim { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
@keyframes dotsBouncePop { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
@keyframes dotsScale { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
@keyframes orbitalPath { from{transform:rotate(0) translateX(28px) rotate(0)} to{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
@keyframes progressBarAnim { from{width:0} to{width:85%} }
@keyframes progressIndeterminate { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
@keyframes progressStriped { from{background-position:0 0} to{background-position:40px 0} }
@keyframes circleProgressAnim { from{stroke-dashoffset:188} to{stroke-dashoffset:28} }
@keyframes skeletonShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
@keyframes pingRipple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }
@keyframes barsWaveAnim { 0%,100%{height:8px} 50%{height:28px} }
@keyframes cubeSpinAnim { 0%{transform:rotateX(0) rotateY(0)} 100%{transform:rotateX(360deg) rotateY(360deg)} }
@keyframes dnaHelixSpin { from{transform:rotateY(0)} to{transform:rotateY(360deg)} }
@keyframes dotsGridPulse { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.5);opacity:1} }
```

### Micro-Interaction Keyframes
```css
@keyframes checkTick { from{stroke-dashoffset:30} to{stroke-dashoffset:0} }
@keyframes toggleSlideOn { from{left:3px} to{left:calc(100% - 23px)} }
@keyframes heartLike { 0%{transform:scale(1)} 15%{transform:scale(1.3)} 30%{transform:scale(.95)} 45%{transform:scale(1.15)} 60%{transform:scale(1)} }
@keyframes bellRing { 0%,100%{transform:rotate(0)} 15%{transform:rotate(10deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-6deg)} 75%{transform:rotate(4deg)} }
@keyframes badgeAppear { 0%{transform:scale(0) rotate(-20deg);opacity:0} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes starFillAnim { from{color:transparent;text-shadow:none;transform:scale(.5)} to{color:#fbbf24;text-shadow:0 0 8px rgba(251,191,36,.7);transform:scale(1)} }
@keyframes tooltipAppear { from{opacity:0;transform:translateY(4px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes notifPop { 0%{transform:translateX(100%);opacity:0} 15%{transform:translateX(-5px)} 25%,100%{transform:translateX(0);opacity:1} }
@keyframes modalOpenAnim { from{opacity:0;transform:scale(.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes hamburgerToX1 { from{transform:translateY(0) rotate(0)} to{transform:translateY(7px) rotate(45deg)} }
@keyframes hamburgerToX2 { from{opacity:1} to{opacity:0} }
@keyframes hamburgerToX3 { from{transform:translateY(0) rotate(0)} to{transform:translateY(-7px) rotate(-45deg)} }
```

### Fintech Keyframes
```css
@keyframes counterRoll { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes chartLineDraw { from{stroke-dashoffset:500} to{stroke-dashoffset:0} }
@keyframes tickerRun { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
@keyframes priceFlashUp { 0%{color:inherit;background:transparent} 40%{color:#10b981;background:rgba(16,185,129,.15)} 100%{color:#10b981} }
@keyframes priceFlashDown { 0%{color:inherit;background:transparent} 40%{color:#ef4444;background:rgba(239,68,68,.15)} 100%{color:#ef4444} }
@keyframes coinFlip3D { from{transform:perspective(400px) rotateY(0)} to{transform:perspective(400px) rotateY(360deg)} }
@keyframes barChartGrow { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
@keyframes walletPop { 0%{transform:scale(1) rotate(0)} 30%{transform:scale(1.15) rotate(-5deg)} 60%{transform:scale(.95) rotate(3deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes pieDrawAnim { from{stroke-dashoffset:565} to{stroke-dashoffset:142} }
```

### Gaming Keyframes
```css
@keyframes physicsBounce {
  0%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(.8,0,1,1)}
  50%{transform:translateY(-40px);animation-timing-function:cubic-bezier(0,0,.2,1)}
}
@keyframes explosionAnim {
  0%{transform:scale(0) rotate(0);opacity:1} 60%{transform:scale(1.5) rotate(180deg);opacity:.8} 100%{transform:scale(2) rotate(360deg);opacity:0}
}
@keyframes fireFlickerAnim {
  0%,100%{transform:scaleY(1) skewX(0);filter:brightness(1)} 25%{transform:scaleY(1.1) skewX(3deg);filter:brightness(1.2)}
  50%{transform:scaleY(.9) skewX(-3deg);filter:brightness(.9)} 75%{transform:scaleY(1.05) skewX(2deg);filter:brightness(1.1)}
}
@keyframes collectibleFloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(5deg)} }
@keyframes damageShake { 0%,100%{transform:translateX(0) rotate(0)} 20%{transform:translateX(-8px) rotate(-5deg)} 40%,80%{transform:translateX(8px) rotate(5deg)} 60%{transform:translateX(-4px) rotate(-2deg)} }
@keyframes levelUp { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.2) rotate(10deg)} 80%{transform:scale(.95)} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes coinCollect { 0%{transform:translateY(0) rotateY(0);opacity:1} 50%{transform:translateY(-30px) rotateY(360deg)} 100%{transform:translateY(0) rotateY(720deg);opacity:0} }
@keyframes healthBarFill { from{width:0%} to{width:var(--hp,70%)} }
@keyframes shieldPulse { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.7)} 70%{box-shadow:0 0 0 16px rgba(59,130,246,0)} }
```

---

## 6. UI/UX FEATURE SPEC

### Filter System
- **Left sidebar** category nav (16 categories, colored dots)
- **Top chip row** for quick category filter (same 16 + "All")
- **Search bar** (hero band) — searches: name, description, technique, category, tags
- **Tag cloud** in sidebar — quick keyword tags (e.g. "hover", "infinite", "SVG", "3D", "spring")
- Active filter state: highlighted chip/sidebar item, count badge
- **Grid / Compact** view toggle (top-right of grid)

### Animation Card
Each card in `data.js`:
```js
{
  id: 'e01-fade-in',
  name: 'Fade In',
  category: 'entrance',          // matches filter key
  categoryLabel: 'Entrance',
  technique: 'opacity',          // short mono tag
  tags: ['fade', 'opacity', 'basic', 'scroll'],
  description: 'Simple opacity 0→1 reveal. The most fundamental entrance animation.',
  preview: {
    html: '<div class="d-box anim-fade-in" style="--c:#6366f1"></div>',
    bgClass: '',  // 'is-bg' for full-fill backgrounds
  },
  css: `/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.6s ease both;
}`,
  html_usage: `<div class="fade-in">Your content here</div>`,
}
```

### Code Modal
- Title + category badge + technique tag
- 220px live preview
- Description paragraph
- Tabs: **CSS** | **HTML Usage**
- Syntax-highlighted code block (dark bg `#0f172a`)
- "Copy CSS" button → copies to clipboard → changes to "Copied! ✓" for 2s
- Keyboard: `Escape` closes, arrow keys navigate between cards

### Misc Features
- Card entrance animation (`animation: fadeInCard 0.35s ease both`) with stagger on filter change
- Scroll back to top button (appears after 400px)
- Smooth `scroll-behavior: smooth`
- `localStorage` persist: last active category + view mode
- `prefers-reduced-motion` media query respects system preferences
- Open Graph meta tags for social sharing
- README with `<img>` badges: MIT, GitHub Stars, Live Demo link

---

## 7. BRANDING & DONATION

### Bachao.AI
- **Name:** Bachao.AI
- **GitHub:** `https://github.com/bachao-ai`
- **Website:** `https://bachao.ai`
- **Donate URL:** `https://bachao.ai/donate`

### Donation Modal
- Triggered by: header "☕ Support" button, sidebar donate button, footer "Donate" link
- Shows:
  1. `assets/qr-cashfree.png` — CashFree / UPI QR code (replace with actual file)
  2. "Pay Online" button → `https://bachao.ai/donate`
  3. Donation perks list: MCP Server Access, Priority API, Feature Requests, Discord
  4. "⭐ Star on GitHub" link
- Style: centered modal, warm gradient tones (amber/red), white card on dark overlay

### Footer Credit
```
⚡ CSS3 Animations Encyclopedia — Open Source Community Tool by Bachao.AI
[GitHub] [MIT License] [Bachao.AI] [☕ Donate]
```

---

## 8. GITHUB PAGES SETUP

### `README.md` should contain:
```markdown
# ⚡ CSS3 Animation Encyclopedia

> 300+ live CSS animations · Zero dependencies · Open Source

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-blue.svg)](https://bachao-ai.github.io/css3-animations)
[![GitHub Stars](https://img.shields.io/github/stars/bachao-ai/css3-animations)](https://github.com/bachao-ai/css3-animations)

Community tool by [Bachao.AI](https://bachao.ai) · [Support the project ☕](https://bachao.ai/donate)

## Features
- 300+ CSS animations across 17 categories
- Live animated preview for every effect
- One-click CSS + HTML code copy
- Search + filter by category/tag
- Pure HTML/CSS/JS — no framework, no build step

## Usage
Just open `index.html` — or visit the live demo.

## Contributing
PRs welcome! Add new animations in `js/data.js`.

## License
MIT © Bachao.AI
```

### `.github/workflows/pages.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 9. MIT LICENSE

```
MIT License

Copyright (c) 2025 Bachao.AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## HANDOVER NOTES FOR CLAUDE CODE

### What to build:
1. `index.html` — shell with header, hero search, sidebar, main grid, two modals (code + donate)
2. `css/style.css` — light theme, all UI components, responsive
3. `css/keyframes.css` — all `@keyframes` from Section 5
4. `css/demos.css` — `.anim-*` classes applying keyframes to demo elements
5. `js/data.js` — `const ANIMATIONS = [...]` array with all 300+ entries per spec in Section 6
6. `js/app.js` — render cards, filter/search, modal open/close, copy-to-clipboard, view toggle, localStorage, keyboard nav
7. `LICENSE` — MIT text from Section 9
8. `README.md` — from Section 8
9. `.github/workflows/pages.yml` — deploy action
10. `assets/qr-cashfree.png` — placeholder (note: replace with actual QR)

### Critical requirements:
- Light background (`--bg: #f5f7fa`) so animations visually pop
- Card preview height 200px, checker pattern bg
- Every card must have a LIVE running animation (not static)
- Search must work across name + description + technique + tags
- Copy button must work via `navigator.clipboard.writeText()`
- `prefers-reduced-motion` must pause all animations when set
- All animations in `data.js` must have complete, copy-ready `css` field

### Animation count target:
| Category | Count |
|----------|-------|
| Entrance | 45 |
| Exit | 20 |
| Attention | 20 |
| Text Effects | 30 |
| Backgrounds | 25 |
| Buttons | 25 |
| Cards | 20 |
| Loaders | 30 |
| Navigation | 15 |
| Forms | 15 |
| 3D Transforms | 15 |
| Filters | 12 |
| Micro-interactions | 20 |
| Scroll | 10 |
| Creative | 15 |
| Fintech | 12 |
| Gaming | 15 |
| **TOTAL** | **344** |

---

*Document prepared by Bachao.AI research pipeline. Ready for Claude Code implementation.*
