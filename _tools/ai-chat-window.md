---
title: "AI Chat Window"
summary: "Client-side AI prompt workbench with system-prompt history, streaming output, markdown rendering, and copy-ready responses."
subtitle: "Browser-based AI prompt and response tool"
status: active
tool_type: webapp
date: 2026-02-22
last_modified: 2026-02-22
featured: true
tags: [prompt, llm, ai, streaming, markdown, developer-tools]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "/tools/ai-chat-window.html"
  repo: null
  docs: null
  download: null
image: "/img/2026-02/ai-chat-window-screenshot.png"
hero_image: "/img/2026-02/ai-chat-window-hero.png"
screenshots:
  - "/img/2026-02/ai-chat-window-hero.png"
  - "/img/2026-02/ai-chat-window-screenshot.png"
  - "/img/2026-02/ai-chat-window-screenshot-monitor.png"
features:
  - "Streaming responses from chat-completions APIs"
  - "Optional system prompt with local history"
  - "Live request/response monitor for debugging API calls"
  - "Ctrl/⌘+Enter submit shortcut"
  - "Markdown-rendered output and one-click copy"
  - "Client-side API key storage (localStorage)"
  - "URL-encoded paste auto-decode helper"
license: "MIT"
---

## What it does

AI Chat Window is a browser-based prompt runner for AI models. It supports
an optional system instruction, streaming response output, markdown rendering,
and local prompt history for fast iteration.

## How to use it

- Open: {{ site.url }}{{ page.links.live }}
- Enter an optional **System Prompt** and your **Content** prompt.
- Pick or type a model id.
- Click **Submit** (or use **Ctrl/⌘+Enter**).
- Copy the generated response using **Copy to clipboard**.

## Notes

- API keys are stored in browser local storage and sent directly to the selected provider.
- No server-side processing is performed by this site for prompt generation.
- Streaming output is incremental; errors appear inline below controls.
- Monitor panel logs request URL, sanitized headers, payload, response status,
  and stream events to debug API behavior (including 429s).
