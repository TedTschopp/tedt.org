---
title: "SLOCCount Web Analyzer"
summary: "Browser-based source line analysis with language breakdown and rough Basic COCOMO effort/cost estimates."
subtitle: "Client-side SLOC and cost analyzer"
status: active
tool_type: webapp
date: 2026-02-21
last_modified: 2026-02-21
featured: true
tags: [sloc, cocomo, estimation, github, zip, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "/tools/sloccount-web-analyzer.html"
  repo: null
  docs: null
  download: null
image: "/img/2026-02/SLOCCount.png"
hero_image: "/img/2026-02/SLOCCount.png"
features:
  - "Paste code analysis with filename-based language detection"
  - "Public GitHub repository scan with progress status"
  - "ZIP upload analysis in browser"
  - "Language-level SLOC and file count breakdown"
  - "Editable Basic COCOMO assumptions and recalculation"
license: "MIT"
---

## What it does

SLOCCount Web Analyzer estimates project size from source files and produces rough effort/cost guidance using Basic COCOMO.

## How to use it

- Open: {{ site.url }}{{ page.links.live }}
- Choose one input mode: Paste Code, GitHub Repository, or Upload ZIP.
- Run analysis to see totals, language distribution, and estimated person-years/cost.
- Tune assumptions and click recalculate for alternative scenarios.

## Notes

- Runs client-side in the browser; no server-side code ingestion by this tool.
- GitHub mode is limited by public API availability/rate limits.
- ZIP mode dynamically loads JSZip when needed.
- Estimates are directional and should not be used as commitments.
