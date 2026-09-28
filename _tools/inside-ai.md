---
title: Inside AI
summary: "Follow a prompt through GPT-2. Inspect tokens, attention, and next-token probabilities, then try live inference in your browser."
subtitle: See how a transformer chooses the next token
status: prototype
tool_type: EducationalApplication
date: 2026-09-27
last_modified: 2026-09-27
featured: true
tags: [ai, learning, transformer, gpt-2, visualization, tools]
tech: [Svelte, D3, WebAssembly, Jekyll]
links:
  live: /inside-ai/
  repo: https://github.com/TedTschopp/tedt.org/tree/main/_apps/inside-ai
image: /img/inside-ai/social-preview.png
hero_image: /img/inside-ai/social-preview.png
image-alt: "Inside AI, an interactive guide to tokens, attention, and the next word."
image_width: 1200
image_height: 630
features:
  - Guided explanations of tokens, embeddings, attention, and sampling
  - Prepared model examples with inspectable values
  - Optional GPT-2 inference in your browser
  - Keyboard controls, numerical tables, and light and dark themes
---

Open [Inside AI]({{ '/inside-ai/' | relative_url }}) to follow a prompt through a
transformer. Start with a prepared example, inspect its token and attention
values, and change the sampling controls. Live mode downloads the model only
when you choose to load it. Your prompts stay in your browser.

The [guided explanation]({{ '/inside-ai/' | relative_url }}#inside-ai-guide)
remains readable without JavaScript. Use it alongside the diagram, or begin
there before loading the model.

Inside AI adapts [Transformer Explainer](https://poloclub.github.io/transformer-explainer/)
by the Polo Club of Data Science under its
[MIT license](https://github.com/poloclub/transformer-explainer/blob/bfe50afba10b9b560b84143ee1107d977defa74f/LICENSE).
The adaptation is based on upstream commit
[bfe50afba10b9b560b84143ee1107d977defa74f](https://github.com/poloclub/transformer-explainer/tree/bfe50afba10b9b560b84143ee1107d977defa74f).
