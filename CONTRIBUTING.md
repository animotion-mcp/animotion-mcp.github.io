# Contributing to Animotion

Thanks for your interest in contributing! Animotion is an open-source CSS3 animation library with 9,000+ SVG icons and an MCP server for AI agents.

## How to Contribute

### Reporting Bugs
- Use the [Bug Report](https://github.com/animotion-mcp/animotion-mcp.github.io/issues/new?template=bug_report.yml) template
- Include browser, OS, and steps to reproduce

### Suggesting Features
- Use the [Feature Request](https://github.com/animotion-mcp/animotion-mcp.github.io/issues/new?template=feature_request.yml) template
- Describe the use case and why it's needed

### Adding Animations
1. Fork the repo and create a branch: `git checkout -b add-animation-name`
2. Add your keyframe to `css/keyframes.css` or `css/keyframes-part2.css`
3. Add the animation entry to `js/data.js` following the existing format
4. Add the corresponding entry to `api.json`
5. Test by opening `index.html` locally
6. Submit a PR

### Animation Naming Convention
- All class names must start with `animotion-` prefix
- Use kebab-case: `animotion-slide-up-fade`
- Keyframe names match without prefix: `slide-up-fade`

### MCP Server Changes
1. The MCP server is published as `animotion-mcp` on npm
2. Navigate to `mcp/` directory for development
3. Run `npm install` to set up dependencies
4. Test with: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server.js`
5. Ensure all 10 tools are returned
6. After changes, bump version in `mcp/package.json` and publish: `cd mcp && npm publish`

## Development Setup

```bash
git clone https://github.com/animotion-mcp/animotion-mcp.github.io.git
cd animotion-mcp.github.io

# Website — just open in browser
open index.html

# MCP Server (for development)
cd mcp && npm install

# Test MCP (users just run: npx animotion-mcp)
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server.js
```

No build tools required. The website is pure static HTML/CSS/JS.

## Pull Request Process
1. Ensure your changes pass the QA workflow (runs automatically on PR)
2. Update `api.json` if you added/modified animations
3. Keep PRs focused — one feature or fix per PR
4. Write a clear PR description

## Code Style
- Pure vanilla JavaScript (no frameworks, no build tools)
- CSS custom properties for theming
- Event delegation over inline handlers
- `escapeHTML()` on all user-facing content

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
