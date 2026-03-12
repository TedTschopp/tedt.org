---
title: "Mandelbrot Deep Zoom"
summary: "Interactive Mandelbrot explorer with smooth pan and zoom, GPU rendering, and double-float emulation for deeper navigation than a typical WebGL fractal demo."
subtitle: "WebGL Mandelbrot explorer"
status: active
tool_type: webapp
date: 2026-03-12
last_modified: 2026-03-12
featured: false
tags: [fractal, mandelbrot, webgl, math, visualization, javascript, tools]
tech:
  - WebGL
  - JavaScript
  - HTML
links:
  live: "/tools/fractal.html"
  repo: null
  docs: null
  download: null
image: "/img/2026-03/fractal-tool-preview.svg"
hero_image: "/img/2026-03/fractal-tool-preview.svg"
screenshots:
  - "/img/2026-03/fractal-tool-preview.svg"
features:
  - "Scroll-wheel zoom centered on the cursor"
  - "Drag to pan across the set"
  - "Double-click to zoom in and double-right-click to zoom out"
  - "Live HUD with center point, scale, depth, and iteration count"
  - "Double-float shader math for deeper zoom than standard float precision"
---

## What it does

This tool renders the Mandelbrot set in real time with WebGL and keeps the
navigation fluid even as you zoom well past the range where ordinary single
precision shaders start to fall apart.

The renderer uses double-float emulation in the fragment shader, splitting each
coordinate into high and low float parts to preserve more useful precision.

## How to use it

- Open: {{ site.url }}{{ page.links.live }}
- Scroll to zoom toward or away from the cursor.
- Drag with the left mouse button to pan.
- Double-click to zoom in faster.
- Double-right-click to zoom out.
- Single-click to recenter on a point.

## Notes

- This tool requires WebGL.
- The HUD shows the current center coordinates, scale, depth, and iteration cap.
- Interior points render black; escaping points use a smooth cyclic palette.

## Precision model

Typical WebGL Mandelbrot demos rely on single-precision floats, which limits how
far you can zoom before coordinates smear or collapse. This version uploads the
center position as float32 high and low parts and reconstructs arithmetic in the
shader, pushing usable exploration deeper while remaining fully client-side.