---
title: "Markdown Front Matter Preview"
summary: "Paste Markdown with YAML front matter, edit the blob live, and preview the parsed YAML above the rendered Markdown."
subtitle: "Live YAML + Markdown preview"
status: active
tool_type: webapp
date: 2026-03-07
last_modified: 2026-03-07
featured: false
tags: [markdown, yaml, frontmatter, preview, editor, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "/tools/markdown-frontmatter-preview.html"
  repo: null
  docs: null
  download: null
image: null
hero_image: null
screenshots: []
features:
  - "Editable source pane for full Markdown + YAML front matter blobs"
  - "Second-column preview with collapsible YAML metadata above rendered Markdown"
  - "Live parsing with front matter fence and YAML error states"
  - "Sample document loader, clipboard actions, and remembered UI state"
  - "Runs entirely in the browser"
license: "MIT"
---

## What it does

Markdown Front Matter Preview is a small client-side workspace for validating
content that starts with YAML front matter.

It splits the document into two concerns:

- the raw source blob you edit
- the preview column that shows parsed YAML first and rendered Markdown second

## How to use it

- Open: {{ site.url }}{% link tools/markdown-frontmatter-preview.html %}
- Paste a document that starts with `---`, includes YAML front matter, and then closes with another `---` line.
- Edit the source on the left.
- Watch the preview update on the right.
- Expand the YAML section only when you want to inspect metadata in detail.

## Notes

- If no front matter fence is detected, the tool renders the whole blob as Markdown.
- If the opening fence exists but the closing fence is missing, the tool stops and shows the fence error clearly.
- YAML parsing uses `js-yaml`, and Markdown rendering uses `marked`, both loaded in-browser.
- The last edited document and the YAML panel open/closed state are remembered in browser storage, with a cookie fallback.
