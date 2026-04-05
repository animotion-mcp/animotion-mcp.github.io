# Animotion Launch Posts — Ready to Publish

## 1. Dev.to Article

**Title:** I built an MCP server so Claude Code stops hallucinating SVG icons

**Tags:** mcp, css, opensource, ai

**Body:**

Every time I ask Claude, Cursor, or Windsurf to add icons to my UI, I get hallucinated SVGs — paths that look almost right but are slightly off. Misaligned strokes, weird proportions, icons that don't match any real design system.

So I built **Animotion** — an open-source MCP server that gives AI coding tools access to:

- **745 CSS3 animations** (entrance, exit, attention, loaders, 3D transforms, and 15 more categories)
- **9,000+ real SVG icons** from Lucide, Heroicons, Tabler, and Bootstrap
- **10 MCP tools** including `search_animations`, `get_icon`, `suggest_animation`, and more

### Zero-clone setup

```json
{
  "mcpServers": {
    "animotion": {
      "command": "npx",
      "args": ["-y", "animotion-mcp"]
    }
  }
}
```

Paste that into your Claude Code / Cursor / Windsurf MCP config. That's it. No repo clone, no npm install, no paths.

Your AI agent can now:
- `search_icons("shopping cart")` and get a real Lucide/Heroicons SVG
- `search_animations("fade in")` and get production-ready CSS
- `suggest_animation("modal appearing with bounce")` and get the best match

### Also works as a traditional CSS library

Don't use AI tools? The animations work as plain CSS classes too:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animotion-mcp/animotion-mcp.github.io@v1.0.0/css/animotion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/animotion-mcp/animotion-mcp.github.io@v1.0.0/css/keyframes.css">

<div class="animotion-fade-in">Hello World</div>
```

### Links

- **Live demo:** https://animotion-mcp.github.io
- **npm:** https://www.npmjs.com/package/animotion-mcp
- **GitHub:** https://github.com/animotion-mcp/animotion-mcp.github.io
- **MIT Licensed** — free forever

Built by Bachao.AI. Feedback and contributions welcome!

---

## 2. Reddit r/webdev Post

**Title:** I built an open-source MCP server with 745 CSS animations and 9,000+ real SVG icons — so AI coding tools stop hallucinating icons

**Body:**

Hey r/webdev,

I got tired of Claude and Cursor generating fake SVG icons every time I asked for UI work. The paths always look slightly wrong — misaligned strokes, weird proportions.

So I built **Animotion** — an MCP server that gives AI agents access to real assets:

- 745 CSS3 animations across 20 categories
- 9,000+ real SVG icons (Lucide, Heroicons, Tabler, Bootstrap)
- 10 MCP tools (search, suggest, compose)

**Setup is one JSON paste:**

```json
{
  "mcpServers": {
    "animotion": {
      "command": "npx",
      "args": ["-y", "animotion-mcp"]
    }
  }
}
```

No clone needed. Works with Claude Code, Cursor, Windsurf.

Also works as a plain CSS library if you don't use AI tools.

- Live demo: https://animotion-mcp.github.io
- npm: https://www.npmjs.com/package/animotion-mcp  
- GitHub: https://github.com/animotion-mcp/animotion-mcp.github.io

MIT licensed, open source. Would love feedback!

---

## 3. Reddit r/ClaudeAI Post

**Title:** Made an MCP server that gives Claude 745 CSS animations + 9,000 real SVG icons — no more hallucinated icons

**Body:**

If you use Claude Code and ask it to add icons to your project, it generates SVG paths that look plausible but are slightly off. After dealing with this too many times, I built an MCP server for it.

**Animotion MCP** gives Claude access to:
- 9,000+ real SVG icons from Lucide, Heroicons, Tabler, Bootstrap
- 745 CSS animations (fade, bounce, slide, 3D transforms, loaders, etc.)
- Tools like `search_icons("home")`, `suggest_animation("loading spinner")`

**Add to your Claude Code config:**
```json
{
  "mcpServers": {
    "animotion": {
      "command": "npx",
      "args": ["-y", "animotion-mcp"]
    }
  }
}
```

Now when Claude needs an icon, it gets a real one from a real design system instead of hallucinating SVG paths.

- npm: https://www.npmjs.com/package/animotion-mcp
- Demo: https://animotion-mcp.github.io
- Open source, MIT licensed

---

## 4. Twitter/X Thread

**Tweet 1:**
I built an MCP server so Claude Code stops hallucinating SVG icons.

9,000+ real icons from Lucide, Heroicons, Tabler, Bootstrap
745 CSS animations
One command setup: npx animotion-mcp

Open source. MIT licensed.

https://animotion-mcp.github.io

**Tweet 2 (reply):**
Setup is one JSON paste into your MCP config:

{"mcpServers":{"animotion":{"command":"npx","args":["-y","animotion-mcp"]}}}

Works with Claude Code, Cursor, Windsurf. No clone, no install.

npm: https://www.npmjs.com/package/animotion-mcp

**Tweet 3 (reply):**
Why I built this:

Every time I ask AI to add a shopping cart icon, I get a hallucinated SVG that looks almost right but isn't.

Now Claude calls search_icons("shopping cart") and gets the real Lucide icon. 

GitHub: https://github.com/animotion-mcp/animotion-mcp.github.io
