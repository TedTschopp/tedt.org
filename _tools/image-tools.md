---
title: "Image Tools"
summary: "Client-side image editor, JPEG optimization, and SVG utilities (crop/resize/export, SVG sandbox, and embed helpers)."
subtitle: "Client-side image utilities"
status: active
tool_type: webapp
date: 2026-01-17
last_modified: 2026-02-12
featured: true
tags: [image, svg, jpeg, optimization, editor, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "{{ site.url }}{% link tools/image-tools.html %}"
  repo: null
  docs: "{{ site.url }}{% link tools/image-tools/image-tools.md %}"
  download: null
screenshots: []
features:
  - "Crop / resize / export (PNG + JPEG)"
  - "JPEG quality comparison + size estimates"
  - "Background remove (experimental)"
  - "SVG sanitize + preview sandbox"
  - "SVG → Raster export"
  - "Raster → SVG wrapper + embed helpers"
license: "MIT"
---

## What it does

Image Tools is a **single-page, client-side** toolkit for common image tasks: crop/resize/export, lightweight JPEG optimization, and several SVG utilities.

## How to use it

- **Open:** {{ site.url }}{% link tools/image-tools.html %}
- **Load an image:** drag/drop, choose a file, or paste from clipboard
- **Switch tools:** use the tabs (Editor, SVG tools, Vector Trace embed)

## Notes

- Everything runs locally in the browser (no uploads).
- Clipboard and service-worker features require a secure context (HTTPS or localhost).
