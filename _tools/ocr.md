---
title: "Browser OCR Workspace"
summary: "Client-side OCR for PDFs and images using local PDF.js and Tesseract assets, with per-page output and a combined full-document view."
subtitle: "PDF and image OCR in the browser"
status: beta
tool_type: webapp
date: 2026-04-01
last_modified: 2026-04-01
featured: false
tags: [ocr, pdf, image, tesseract, pdfjs, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
  - PDF.js
  - Tesseract.js
links:
  live: "/tools/ocr.html"
  repo: null
  docs: null
  download: null
image: "/img/2026-04/ocr-workspace-tool-screenshot.png"
hero_image: "/img/2026-04/ocr-workspace-tool-screenshot.png"
screenshots:
  - "/img/2026-04/ocr-workspace-tool-screenshot.png"
features:
  - "Runs OCR entirely in the browser with local runtime assets"
  - "Accepts PDFs, JPG, PNG, GIF, and pasted clipboard images"
  - "Renders PDF pages before OCR so each page can be reviewed independently"
  - "Produces per-page textareas plus a combined full-document output"
  - "Includes a local starter catalog of OCR language packs"
license: "Mixed: tedt.org tool code plus Apache-2.0 vendored OCR/PDF runtimes"
---

## What it does

Browser OCR Workspace extracts text from PDFs and images without uploading files
to a server.

The workflow is intentionally inspectable: each rendered page or image is shown
next to the extracted text so you can review OCR quality before copying the
combined document.

## How to use it

- Open: {{ site.url }}{{ page.links.live }}
- Choose a local OCR language pack.
- Drop a PDF or image, choose a file, paste an image, or load the bundled example PDF.
- Review each page/image result.
- Copy the full document from the combined output panel.

## Notes

- The first implementation pass vendors the PDF.js and Tesseract runtime assets locally.
- The language selector currently reflects the traineddata files stored in
  `tools/ocr-tool/languages/`.
- Worker-based OCR is most reliable on the deployed site or over `http://localhost`.
