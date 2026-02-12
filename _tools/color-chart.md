---
title: "Color Chart"
summary: "Fullscreen palette explorer with pan/zoom, contrast readouts, and URL-driven palettes."
subtitle: "Pannable/zoomable color palette explorer"
status: active
tool_type: webapp
date: 2026-01-12
last_modified: 2026-01-12
featured: true
tags: [color, ui, javascript, accessibility, tools, css]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "/tools/color-chart.html"
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
  - "Swatch metadata (RGB/HSL/CMYK) + contrast cues"
license: "MIT"
---

## What it does

Color Chart is a fullscreen palette explorer: it turns one or more base colors
into a grid of related shades, then lets you *move around the chart* (pan and
zoom) to evaluate the palette as a system.

## How to use it

- **Open the tool:** /tools/color-chart.html
- **Pan:** drag the background (or use arrow keys / on-screen arrows)
- **Zoom:** mouse wheel / trackpad scroll, or `+` / `-` (or the on-screen
  `+` / `−` buttons)
- **Reset:** `0` (or the reset button)

## URL palettes (`?c=`)

You can generate a chart from a specific palette without editing the tool:

- Built-in palette: `{{ site.url }}{% link tools/color-chart.html %}?c=teds`
- Comma-separated hex: `{{ site.url }}{% link tools/color-chart.html %}?c=%2300a9e0,%23101820,%23fed141`

## Notes

- Full usage docs live here: [A Color Chart You Can Move Around](/Color-Chart-Pan-Zoom/)
- The tool is intentionally self-contained (single HTML file) so it can be
  copied/modified easily.
