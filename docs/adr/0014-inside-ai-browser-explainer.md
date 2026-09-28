---
Date: 2026-09-27
Status: Accepted
Decision Type: Browser Application Integration
sitemap: false
robots: "noindex, follow"
---

# ADR 0014: Inside AI Browser Explainer

## Context

Inside AI brings the MIT-licensed Transformer Explainer into TedT.org as an interactive learning tool. The approved plan requires real GPT-2 inference, a guided introduction, site branding and independent ownership of model assets. The instrumented model is 656,662,664 bytes and must not enlarge the main Pages deployment by that amount.

## Decision

Use a scoped Svelte/D3 application compiled with Vite under `_apps/inside-ai/` and mounted inside a Jekyll-owned page at `/inside-ai/`. Commit reproducible browser output under `inside-ai/assets/`; CI rebuilds it and rejects stale output. No Jekyll plugin or site-wide application framework is introduced.

Pin upstream source to `bfe50afba10b9b560b84143ee1107d977defa74f`. Preserve MIT attribution and instrumented outputs. Serve model chunks from the separate public `TedTschopp/inside-ai-models` Pages repository in immutable version directories with a size/hash manifest. Keep tokenizer and ONNX runtime assets local to TedT.org.

Load prepared examples first and download the model only after an explicit visitor action. Perform single-threaded WebAssembly inference in a worker, without an inference API or prompt telemetry. Namespace model caches and expose cancellation, retry and cache clearing. A page-scoped CSP allowance enables WebAssembly without changing the policy on other pages.

## Performance and Accessibility

Lessons remain readable without JavaScript. Model loading is opt-in, cached and cancellable. Diagram scrolling stays inside its own labeled region; keyboard controls, numerical tables, reduced motion and theme-aware contrast support equivalent exploration. Recorded outputs and illustrative vectors are labeled separately from live model results. Use a visible 32-token context limit.

## Alternatives

An external iframe would prevent full integration. Putting model files in the main deployment would add approximately 657 MB. Remote inference would introduce a server, costs and transmission of prompts. Rewriting the entire site as Svelte would expand scope unnecessarily.

## Validation and Rollout

Verify deterministic application builds, numerical sampling behavior, all examples and live model inference, three browser engines, accessibility, internal links and Jekyll output. Publish model assets before the application. Verify real inference on the published page before reporting completion. Preserve existing site content and unrelated work.

## Status

Accepted through the user-approved implementation plan on September 27, 2026 (Pacific time).
