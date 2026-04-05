# Changelog

All notable changes to Animotion will be documented in this file.

## [1.0.1] - 2026-04-05

### Added
- Published MCP server to npm as `animotion-mcp`
- Zero-clone setup: `npx animotion-mcp` works out of the box
- Bundled api.json, icons-data.js, utilities.css inside npm package
- MCP-first page flow: hero leads with AI agent messaging
- Auto-playing animations (infinite loop, 0.5x speed default)
- Pause button, touch tap-to-play support

### Changed
- Hero: "Give Your AI Agent Real Animations & Real Icons"
- Primary CTA: "Connect via MCP" (was "Browse Animations")
- MCP section promoted above animation browser
- Manual CSS setup moved to bottom section
- Default animation speed: 0.5x (smoother)

## [1.0.0] - 2026-04-05

### Added
- 745 CSS3 animations across 20 categories
- 120 built-in SVG icons + 9,000+ via MCP server (Lucide, Heroicons, Tabler, Bootstrap)
- MCP server with 10 tools for AI agents (Claude Code, Cursor, Windsurf)
- PNG Animator — upload image, apply animation, export CSS
- Global animation speed slider (0.25x - 3x)
- Custom preview text input
- Dark mode with full theme support
- Responsive design with mobile sidebar
- Keyboard navigation and accessibility (ARIA, focus trap, skip link)
- URL hash routing for categories and animations
- Syntax-highlighted code modal (CSS/HTML/JS)
- CDN via jsDelivr
- REST API via api.json
- GitHub Actions QA workflow with auto-issue creation
- CONTRIBUTING.md and CODE_OF_CONDUCT.md
