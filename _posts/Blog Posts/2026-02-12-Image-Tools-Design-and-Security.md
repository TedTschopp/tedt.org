---
layout: post

title: "Image Tools: Design and Security"
subtitle: "How SVG sanitization and offline caching work"
quote: "Small tools feel safe when they’re predictable."
excerpt: "A short documentation post for Image Tools on tedt.org: what it includes, how it persists state, how offline caching is scoped, and what the SVG sanitizer removes."
source: "Original Content"
source-url: ""
call-to-action: "Open Image Tools"

date: 2026-02-12 09:00:00 -0800
update: 2026-02-12 09:00:00 -0800

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
  name: "Ted Tschopp"
  url: "https://tedt.org/"

bullets:
  - Crop/resize/export with predictable output.
  - SVG tools that sanitize input before rendering.
  - Shareable links + local state persistence.
  - Offline cache scoped to /tools/.

description: "Documentation for the Image Tools web app on tedt.org: design goals, privacy model, SVG sanitization behavior, and offline caching scope."
seo-description: "How Image Tools on tedt.org works: client-side image editing, SVG sanitization for safety, shareable URL state, and an offline cache scoped to /tools/."

categories:
  - Computers
  - Projects

tags:
  - Image
  - SVG
  - JavaScript
  - Security
  - Tools
  - CSS

keywords:
  - image tools
  - svg sanitizer
  - client side image editor
  - service worker offline cache
  - url state persistence

location:
  name: Bradbury, CA
coordinates:
  latitude: 34.1470
  longitude: -117.9709

image: /img/2026-02/image-tools-hero.webp
image-alt: "Screenshot of Image Tools showing the editor panel, tool tabs, and the preview area"
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A screenshot of the Image Tools interface: tabbed tool collections on the left and a preview workspace on the right."
image-title: "Image Tools Interface"
image_width: 1920
image_height: 1080

mathjax: false
mastodon-post-id:
---

## Open the tool

Image Tools lives here:

- [tools/image-tools.html]({% link tools/image-tools.html %})

Everything runs locally in your browser (no uploads).

## What it includes

Image Tools is a single-page toolkit with a few focused “tabs”:

- **Editor**: crop/zoom, resize, export (PNG/JPEG), plus a small JPEG quality comparison view.
- **Raster → SVG**: wraps a raster image into an SVG using an `<image href="data:…">` element.
  - This is **not** vector tracing. It preserves pixels; it just packages them in SVG.
- **SVG → Raster**: sanitizes SVG input, renders it to a canvas, then exports to PNG/JPEG.
- **SVG Sandbox**: sanitizes and previews SVG, showing the sanitized source.
- **SVG Embed**: sanitizes SVG and generates an `<img>` tag / data URI.
- **Vector Trace**: an embedded iframe of the standalone tracing tool.

## Design goals

The tool is built around a few constraints:

- **Client-side only**: no server calls, no telemetry, no background uploads.
- **Immediate feedback**: the preview updates as you change settings.
- **Safe-by-default SVG handling**: pasted SVG is treated as untrusted input.
- **Portability**: the “Copy link” button captures the current settings in the URL.

## Sharing + persistence

Image Tools persists *settings*, not your original image.

- **URL state**: key settings (active tab, output size, format, background options, etc.) are encoded into the page URL as query parameters.
- **Local state**: settings are also saved to `localStorage` so a refresh restores your last-used configuration.
- **Text fields**: SVG text areas (in the SVG tabs) are saved to `localStorage` with a size cap to avoid runaway storage usage.

If you want to share a configuration, use **Copy link**.

## Offline cache scope (service worker)

Image Tools registers a service worker to support offline use *after the first load*:

- The service worker is [tools/image-tools-sw.js]({% link tools/image-tools-sw.js %}).
- The cache is intentionally scoped to **`/tools/`** so it doesn’t affect the rest of the site.
- It pre-caches the Image Tools HTML/CSS/JS plus the consolidated fonts stylesheet.

Notes:

- Service workers require a secure context (**HTTPS** or **localhost**).
- When online, navigation requests prefer the network first; when offline, cached resources are used as a fallback.

## SVG sanitization model (what gets removed)

SVG is powerful enough to be dangerous, especially when it’s pasted from untrusted sources.

Before rendering SVG (or generating embed tags), Image Tools sanitizes input with a strict allowlist mindset:

- Removes scripting/embedding primitives like `script`, `foreignObject`, `iframe`, `object`, and `embed`.
- Strips all inline event handlers (`onload`, `onclick`, …).
- Removes `javascript:` URLs anywhere they appear.
- Restricts link-like attributes (`href`, `xlink:href`, `src`) to safe forms (internal fragments like `#id` or `data:` URLs).
- Sanitizes `<style>` blocks by stripping `@import` and removing external `url(...)` references.

Important limitation:

- This is a **risk-reduction** measure, not a formal security guarantee. Treat untrusted SVG cautiously even when sanitized.
