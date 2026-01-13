---
layout: post

title: "A Color Chart You Can Move Around"
subtitle: "Documenting the pan-and-zoom Color Chart tool"
quote: "Sometimes the difference between ‘I think I see it’ and ‘I know I see it’ is the ability to move closer."
excerpt: "A small documentation post for the Color Chart tool on tedt.org: how to pan, how to zoom, and how to feed it your own palette from the URL."
source: "Original Content"
source-url: ""
call-to-action: "Open the tool and explore your palette"

date: 2026-01-12 09:00:00 -0800
update: 2026-01-12 09:00:00 -0800

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
  name: "Ted Tschopp"
  url: "https://tedt.org/"

bullets:
  - Fullscreen pan/zoom so a big chart feels like a world.
  - On-screen controls (arrows, zoom, reset, center).
  - Mouse/trackpad and keyboard shortcuts for fast navigation.
  - URL-driven palettes via `?c=`.

description: "Documentation for the tedt.org Color Chart tool: a fullscreen, pannable, zoomable palette explorer with URL-driven inputs."
seo-description: "How to use the tedt.org Color Chart tool: pan/zoom controls, keyboard shortcuts, and URL palette parameters."

categories:
  - Computers
  - Projects

tags:
  - Color
  - UI
  - JavaScript
  - Accessibility
  - Tools
  - CSS

keywords:
  - color chart tool
  - palette explorer
  - pan and zoom
  - javascript ui controls
  - hex colors url parameter

location:
  name: Bradbury, CA
coordinates:
  latitude: 34.1470
  longitude: -117.9709

image: /img/2026-01/color-tool.webp
image-alt: "Screenshot of the Color Chart tool showing a grid of color swatches with pan and zoom controls"
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A screenshot of the Color Chart tool interface, demonstrating the pan and zoom functionality with a visible control pad and a colorful palette grid."
image-title: "Color Chart Tool Interface"
image_width: 1920
image_height: 1080


mathjax: false
mastodon-post-id:
---

## Open the tool

The Color Chart tool lives here:

- [tools/color-chart.html]({% link tools/color-chart.html %})

Think of it like a map: the screen is your viewport, and the chart is a larger world behind it.

## What the tool does

Given one or more base colors, the tool generates a grid of shades and supporting metadata (RGB/HSL/CMYK and contrast information) so you can evaluate a palette as a system, not as a collection of isolated swatches.

## Pan and zoom (three ways)

### 1) On-screen controls

The tool overlays a small control pad in the upper-left:

- `+` zoom in
- `−` zoom out
- `⟲` reset view
- `← ↑ → ↓` pan
- `◎` center the chart in the viewport
- `i` toggle the status readout (zoom % and x/y offset)

### 2) Mouse / trackpad

- Drag anywhere on the chart background to pan.
- Use the mouse wheel / trackpad scroll to zoom toward the pointer location.

### 3) Keyboard shortcuts

- Arrow keys: pan
- Shift + arrow keys: pan faster
- `+` / `=`: zoom in
- `-` / `_`: zoom out
- `0`: reset

## Feeding the tool your own palette (URL parameter)

The tool accepts a `c` query parameter so you can generate a chart from a specific palette without editing the file.

### Examples

**Use the built-in “teds” palette:**

- `{{ site.url }}{% link tools/color-chart.html %}?c=teds`

**Provide a comma-separated list of hex colors:**

- `{{ site.url }}{% link tools/color-chart.html %}?c=%2300a9e0,%23101820,%23fed141`

Notes:

- You can include `#` or omit it (the tool will add it when it’s clearly a hex value).
- 3-digit hex values (like `#0af`) are expanded to 6-digit (`#00aaff`).
- 8-digit hex values (`#RRGGBBAA`) are accepted; how the alpha channel affects the rendered swatch depends on browser + color parsing.

## A small (honest) note about network calls

Some metadata (like human-friendly color names) may rely on an external lookup. If you’re offline, or if a third-party service is slow, the chart still renders — but names may be missing or delayed.

## Why this matters (and why it’s worth documenting)

When a chart can’t move, you end up moving around it.

When a chart can move, you stop fighting the tool.

And once you stop fighting the tool, you can do the real work: noticing what the palette is actually saying.

If you want, I can also add a tiny “Help” overlay directly inside the tool (a quick legend for controls and the `?c=` parameter), so you don’t have to remember any of this next time.
