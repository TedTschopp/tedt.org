---
title: "Direct Hex Test"
summary: "Standalone test page for the multi-scale hex overlay canvas (pan/zoom + legend)."
subtitle: "Multi-scale hex overlay visual regression test"
status: prototype
tool_type: webapp
date: 2025-08-07
last_modified: 2025-08-07
featured: false
tags: [rpg, hexcrawl, javascript, canvas, visualization, testing]
tech:
  - JavaScript
  - HTML
  - Canvas
  - Bootstrap
links:
  live: "/tools/hex-test-direct.html"
  repo: null
  docs: "/Practical-Hexcrawl-Design-and-Procedures/"
  download: null
image: "/img/2025-08/hex-map-seeded-frontier.webp"
hero_image: "/img/2025-08/hex-map-seeded-frontier.webp"

screenshots:
  - "/img/2025-08/hex-map-seeded-frontier.webp"
features:
  - "Renders 36/6/1-mile layered hex grids on one canvas"
  - "Pan + wheel/pinch zoom controls with reset"
  - "Intended for verifying layout sizing and rendering fixes"
license: "MIT"
---

## What it does

This page is a **direct / standalone test harness** for the multi-scale hex
overlay (`/js/hex-multi-scale.js` + `/js/hex.js`). It exists so you can quickly
validate pan/zoom behavior, canvas sizing, and legend rendering without the
surrounding post layout.

## How to use it

- **Open the test page:** /tools/hex-test-direct.html
- **Pan:** drag on the canvas
- **Zoom:** mouse wheel / trackpad scroll, pinch (touch), or `+` / `-` buttons
- **Reset:** use the `⟳` button

## Notes

- Primary writeup / context: [Practical Hexcrawl Design and Procedures](/Practical-Hexcrawl-Design-and-Procedures/)
- There’s also a more formal visual verification page at `/tests/hex-multi-scale-test.html`.
