---
title: "Color Chart"
summary: "Fullscreen palette workbench with pan/zoom, contrast matrix, token export, semantic roles, audits, previews, and source image extraction."
subtitle: "Pannable/zoomable color palette explorer"
status: active
tool_type: webapp
date: 2026-01-12
last_modified: 2026-07-18
featured: true
tags: [color, ui, javascript, accessibility, tools, css]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "https://tedt.org/tools/color-chart.html"
  repo: null
  docs: "/Color-Chart-Pan-Zoom/"
  download: null
image: "/img/2026-01/color-tool.webp"
hero_image: "/img/2026-01/color-tool.webp"

screenshots:
  - "/img/2026-01/color-tool.webp"
features:
  - "Pan/zoom navigation (mouse/trackpad/keyboard + on-screen controls)"
  - "URL-driven palettes via ?c="
  - "Palette extraction from readable URLs, uploaded images, and pasted screenshots"
  - "Swatch metadata (RGB/HSL/CMYK) + contrast cues"
  - "Workbench contrast matrix for shade pair accessibility checks"
  - "Design token exports for CSS, JSON, SCSS, Tailwind, and Bootstrap"
  - "Semantic role mapping, palette audit, theme suggestions, comparison, harmony, color-vision simulation, UI preview, and manual image sampling"
license: "MIT"
---

## What it does

Color Chart is a fullscreen palette workbench: it turns one or more base colors
into a grid of related shades, then lets you *move around the chart* (pan and
zoom) to evaluate the palette as a system. It can also extract a starting
palette from browser-readable URLs, uploaded images, or pasted screenshots, then
audit, compare, export, and preview the palette in common UI contexts.

## How to use it

- **Open the tool:** /tools/color-chart.html
- **Pan:** drag the background (or use arrow keys / on-screen arrows)
- **Zoom:** mouse wheel / trackpad scroll, or `+` / `-` (or the on-screen
  `+` / `−` buttons)
- **Reset:** `0` (or the reset button)
- **Extract from source:** enter a readable URL, upload an image, or paste a
  screenshot into the tool.
- **Use the workbench:** check shade-pair contrast, export tokens, map semantic
  roles, audit the palette, build themes, compare palettes, generate harmonies,
  preview color-vision simulations, test UI components, or sample image regions.

## URL palettes (`?c=`)

You can generate a chart from a specific palette without editing the tool:

- Built-in palette: `{{ site.url }}{% link tools/color-chart.html %}?c=teds`
- Comma-separated hex: `{{ site.url }}{% link tools/color-chart.html %}?c=%2300a9e0,%23101820,%23fed141`

## Notes

- Full usage docs live here: [A Color Chart You Can Move Around](/Color-Chart-Pan-Zoom/)
- Arbitrary websites may block direct browser analysis. In that case, paste or
  upload a screenshot; no backend proxy is used.
- The tool is intentionally self-contained (single HTML file) so it can be
  copied/modified easily.
