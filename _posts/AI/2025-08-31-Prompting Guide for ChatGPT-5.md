---
layout: post
title: "Prompting ChatGPT-5 (Specifically): 6 Moves That Consistently Work"
subtitle: "Set reasoning, verbosity, tools, and a private quality loop to get reliable results."
quote: "GPT-5 is a router model that can think, browse, code, write, and orchestrate tools."
excerpt: "Six proven moves to get consistent, high‑quality results from GPT‑5: set the reasoning and verbosity dials, name tools and outputs, enforce a self‑review loop, and use the official optimizer. Includes copy‑paste blueprints for research, code, branding, and a one‑page brief."
source: "Original Content"
source-url: ""
call-to-action: "Discuss on Mastodon"
date: "2025-08-31 10:56:40 -0700"
update: "2025-08-31 10:56:40 -0700"
author:
   name: "Ted Tschopp"
   avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
   url: "https://tedt.org/"
bullets:
   - "GPT‑5 behaves like a router model; results improve when you set reasoning and verbosity dials."
   - "Name tools and deliverables so ChatGPT coordinates browsing, code, files, and images in one pass."
   - "Add a private self‑reflection rubric and iterate to a clear quality threshold before delivery."
   - "Repair weak outputs with metaprompting—fix the prompt, not just the answer."
   - "Finish with OpenAI’s official Prompt Optimizer to tighten prompts."
   - "Includes copy‑paste blueprints for research briefs, production features, and brand kits."
description: "GPT‑5 acts as a router model that can think, browse, code, write, and orchestrate tools. This guide distills six moves that reliably raise output quality: set the reasoning and verbosity dials, explicitly name tools and deliverables, enforce a private self‑review rubric, repair prompts with metaprompting, and finish with OpenAI’s prompt optimizer. It also includes copy‑paste blueprints for research briefs, production features, and brand kits, plus a one‑page prompt for doing it right."
seo-description: "A practical GPT‑5 prompting guide: set reasoning/verbosity dials, name tools, add a quality loop, use meta‑prompting, and finish with OpenAI’s optimizer."
categories:
   - AI
   - Computers
   - Communications
tags:
   - GPT-5
   - ChatGPT
   - prompt engineering
   - prompting
   - metaprompting
   - self-reflection
   - web browsing
   - code interpreter
   - Canvas
   - ChatGPT Agent
   - prompt optimizer
   - research workflow
   - decision brief
   - brand kit
keywords:
   - GPT-5 prompting
   - ChatGPT-5 prompts
   - prompt engineering guide
   - self-reflection rubric
   - metaprompt
   - prompt optimizer
   - web browsing tool
   - code interpreter
   - ChatGPT agent
   - OpenAI Canvas
   - decision brief template
   - brand kit prompt
location:
   name: "Bradbury, CA"
coordinates:
   latitude: 34.1470
   longitude: -117.9709
image: "img/2025-08/GPT-5-router-model.webp"
image-alt: "Guide for prompting GPT-5 with tools and optimizer"
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-credits: "Ted Tschopp"
image-credits-URL: "https://tedt.org/"
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image-credits-title: ""
image-description: ""
image-title: "GPT-5 Router Model"
image_width: 1456
image_height: 816
mastodon-post-id: ""
---
> Why this works: GPT-5 is a *router* model that can think, browse, code, write, and orchestrate tools. Results improve dramatically when you **set the dials** (reasoning + verbosity), **name the tools**, and **force a quality loop**. OpenAI’s own guides and product notes back this approach. ([OpenAI Cookbook][1], [OpenAI Platform][2], [OpenAI][3])

## 1) Set the Reasoning Dial (every time)

Use explicit levels so the model doesn’t “guess.”

**Snippet (drop in any task)**

```
Reasoning: <think | think harder | ultra think>.
Before answering, produce an internal plan, resolve ambiguities, surface trade-offs, and justify choices.
```

Why: OpenAI’s GPT-5 prompting guide calls out insufficient reasoning and recommends prompt optimization to correct it; explicitly requesting deeper reasoning improves outcomes. ([OpenAI Cookbook][1])

## 2) Set the Verbosity Dial (every time)

Pin the length and structure so you get the depth you want.

**Snippet**

```
Verbosity: <low | medium | high>.
Format: <bullets | numbered steps | sections + tables>.
```

Why: OpenAI’s prompt-engineering guides encourage clear format/length instructions; GPT-5’s optimizer also standardizes this in the revised prompt. ([OpenAI Help Center][4], [OpenAI Cookbook][5])

## 3) Name the Tools and Deliverables (multi-tool prompts)

Tell ChatGPT which skills to invoke and what artifacts to return.

**Template**

```
Tools to use in one pass:
1) Web browsing: gather 8–12 recent, reputable sources; note dates.
2) Data/Code: run Python to analyze and produce a CSV.
3) Document export: return a 2–4 page PDF.
4) Image generation: produce a simple logo (PNG + SVG).

Return: links to files/embeds for each output.
Reasoning: think harder. Verbosity: medium.
```

Why: ChatGPT can coordinate multiple tools/skills in a single run (web, code, files, images, etc.), a capability surfaced in OpenAI’s docs on tools and the ChatGPT Agent. ([OpenAI Platform][2], [OpenAI][3])

## 4) Force Self-Reflection (private rubric)

Make the model quietly grade and fix its own work *before* you see it.

**Drop-in block**

```
Self-reflection (private): Create a 5–7 category rubric for this task
(e.g., Goal coverage, Factual accuracy with citations, Completeness, Technical quality, Readability/UX, Testability, Constraints met). 
Iterate until the draft would score ≥90% overall, with no category <80%.
Do not show the rubric or scores—only the improved result.
```

Why: OpenAI’s GPT-5 prompting materials and optimizer emphasize evaluation loops; adding an internal rubric turns “one-shot” into “plan-draft-review-revise.” ([OpenAI Cookbook][1])

## 5) Use Metaprompting when results miss

Fix the *prompt*, not just the output.

**Repair prompt**

```
Metaprompt:
Desired behavior: <what you wanted>.
Undesired behavior: <what you got that you don't like>.
Question: Provide minimal edits/additions to my original prompt so it consistently meets the desired behavior while preserving most wording. Return the revised prompt only.
```

Why: “Meta-prompting” (have the model improve your prompt) is a documented best practice and pairs well with OpenAI’s prompt optimizer. ([OpenAI Platform][6], [OpenAI Cookbook][5])

## 6) Finish with the Prompt Optimizer (free, official)

Paste your final prompt into OpenAI’s optimizer; use the tightened version going forward. ([OpenAI Cookbook][5])

## Copy-Paste Blueprints (fully specified)

### A) Decision Brief (research + data + PDF + citations)

```
Goal: Produce a decision brief on <topic>.
Audience: execs.
Reasoning: ultra think. Verbosity: high.

Tools & outputs (one pass):
- Web browsing: find 8–12 diverse, reputable sources from the last 18 months; capture titles, publishers, dates, and URLs.
- Data/Code: analyze any quantitative figures and produce a CSV (sources × key metrics).
- Doc export: compile a 3–5 page PDF brief.

Structure:
1) Executive Summary (8 bullets max)
2) Findings with inline citations [#] and a reference list with dates
3) Options & Trade-offs (table)
4) Recommendation & Assumptions
5) Risks & Mitigations
6) Next 30/60/90 days

Self-reflection (private): coverage, credibility/recency, synthesis clarity, decision usefulness, risk balance, measurability. Iterate to ≥90%.
Deliver: Markdown brief + CSV + PDF + bibliography with live links.
```

Cite recency and credibility per OpenAI’s browsing/capabilities guidance. ([OpenAI Platform][2], [OpenAI Help Center][7])

### B) Production-Grade Feature (design → code → tests → verification)

```
Goal: Implement <feature> in <tech stack>.
Reasoning: think harder. Verbosity: medium.

Outputs:
1) Design plan (data structures, API surfaces, error cases, perf/security notes).
2) Code (idiomatic, commented).
3) Tests (unit + one integration path).
4) Verification: explain how tests prove correctness; include documenting a runbook.

Self-reflection (private): correctness, robustness, readability, security, test coverage, DX. Revise until all categories ≥80%.
```

Backed by OpenAI tool docs (code execution/tools) and prompt-engineering guidance. ([OpenAI Platform][2], [OpenAI Help Center][4])

### C) Brand Kit (logo + PDF + posts + competitor table)

```
Goal: “<Name>” mini brand kit.
Reasoning: think harder. Verbosity: medium.

Tools:
- Image generation: primary logo + mono variant (PNG, SVG).
- PDF export: 3-page brand guide (palette hex, typography, spacing, misuse).
- Web browsing: 8 peer brands with URLs and 1-sentence positioning.
- Copywriting: an announcement post + 3 alternates.

Self-reflection (private): distinctiveness, legibility, consistency, practicality, copy clarity, differentiation. Iterate, then deliver links to assets.
```

Leverages images, docs, browsing, and copy in one run; see tools and agent references. ([OpenAI Platform][2], [OpenAI][3])

# Tools ChatGPT Can Call (and what they’re for)

> Availability varies by plan and region. Names shift as features evolve, but these are the **major, documented tools/skills** in ChatGPT as of Aug 30, 2025, with official references.

1. **Web Browsing / Agentic Web Actions**
   Search, open pages, extract facts, and (with Agent) complete multi-step tasks on the web with user approval. ([OpenAI Platform][2], [OpenAI][3])

2. **Code Execution / Data Analysis (Python sandbox)**
   Run code, analyze datasets, generate charts/tables, and create files (CSV, PPTX, etc.). (In product UIs this is often presented as “data analysis”/“code interpreter.”) ([OpenAI Platform][2])

3. **File Handling & Projects/Canvas**
   Upload files, co-edit in **Canvas** (side-by-side doc/code space), and organize work in **Projects**. Canvas supports inline edits, comments, and code fixes. ([OpenAI Help Center][7], [OpenAI][8])

4. **Image Generation & Editing**
   Create or edit images from prompts (logos, diagrams, mockups). (In-app image tools draw on the platform’s image capabilities.) ([OpenAI Platform][2])

5. **Document Creation/Export**
   Compose and export docs (e.g., PDF) directly from chat/canvas workflows. (OpenAI docs show tool calls that generate artifacts; Agent can also orchestrate outputs.) ([OpenAI Platform][2], [OpenAI][3])

6. **Prompt Optimizer (official)**
   Paste any prompt to get an optimized version tailored to GPT-5 behavior; recommended by the GPT-5 prompting guide. ([OpenAI Cookbook][5])

7. **Automations / Tasks (scheduled & conditional)**
   Create reminders or recurring checks (“tasks”) that notify you later (e.g., “search X weekly”). Manageable from Settings → Notifications → Manage tasks. ([OpenAI Help Center][9])

8. **Voice Mode**
   Speak naturally; get spoken responses (mobile/desktop). Useful for hands-free prompting. ([OpenAI Help Center][7])

9. **Connectors & Account Integrations (Agent-driven)**
   With your approval, ChatGPT Agent can use connected services (e.g., Gmail, Google Drive/Calendar, GitHub) to retrieve or act on information during tasks, pausing for consent. ([Tom's Guide][10], [The Times of India][11])

> Why I didn’t include third-party “tool catalogs”: they’re not authoritative for ChatGPT’s *native* capabilities. The list above maps to OpenAI’s own help docs, platform docs, and product announcements. ([OpenAI Platform][2], [OpenAI Help Center][7], [OpenAI][3])

# A One-Page “Do It Right” Prompt (fully specified)

Use this when you want reliable, citable research + a polished brief in one go.

```
Goal: Create a decision brief on <topic>.
Audience: senior leadership.
Reasoning: ultra think. Verbosity: high.

Tools & outputs:
- Web browsing: find 8–12 reputable sources published in the last 18 months; extract title, publisher, date, URL.
- Data/Code: compute any comparable metrics; output a CSV of sources × metrics.
- Document export: produce a 3–5 page PDF brief + Markdown version.

Structure:
1) Executive Summary (≤8 bullets)
2) Key Findings (with inline bracketed citations and a numbered References section with dates/links)
3) Options & Trade-offs (comparison table with 0–5 scores + rationale)
4) Recommendation (with assumptions)
5) Risks & Mitigations
6) 30/60/90-day plan

Constraints:
- Show publish dates after facts likely to change.
- Prefer primary/official sources; avoid low-credibility blogs.
- List any material uncertainties.

Self-reflection (private): coverage, credibility/recency, synthesis clarity, decision usefulness, risk balance, measurability. Iterate until ≥90% overall; no category <80%.
Deliver: links to PDF + CSV + Markdown + full reference list with live URLs.
```

Justification: aligns directly with OpenAI’s tools/browsing guidance and prompt-optimization practices. ([OpenAI Platform][2], [OpenAI Cookbook][5])

# Rubric (to judge this guide and your own)

Score each 1–5; aim ≥31/35.

1. **Task Clarity & Goal Framing** – Clear goals, when/why, before/after.
2. **Actionability & Structure** – Copy-paste blocks, checklists, decision tables.
3. **Router Controls Coverage** – Reasoning, Verbosity, Tools, Self-Reflection, Metaprompting, Optimizer.
4. **Quality Loop** – Private rubric, iterate-until-good thresholds.
5. **Examples & Transferability** – Research, code, branding, enterprise.
6. **Precision & Safety** – Dates, citations, constraints, credible sources.
7. **Brevity-by-Design** – Dense, skimmable sections; purposeful length.

## Sources (official & reputable)

* **GPT-5 Prompting Guide** – how to diagnose/optimize prompts; references to the optimizer. ([OpenAI Cookbook][1])
* **Optimize Prompts (Cookbook)** – official optimizer walkthrough and patterns. ([OpenAI Cookbook][5])
* **Platform “Tools” Docs** – how ChatGPT/Assistants call tools (code, browsing, files, functions). ([OpenAI Platform][2])
* **ChatGPT Capabilities Overview** – Voice Mode and Canvas overview. ([OpenAI Help Center][7])
* **Introducing Canvas** – official product intro and collaboration workflow. ([OpenAI][8])
* **Tasks in ChatGPT** – creating and managing scheduled tasks/automations. ([OpenAI Help Center][9])
* **Introducing ChatGPT Agent** – multi-step, agentic actions with approvals and connectors. ([OpenAI][3])
* **News coverage on Agent capabilities** – independent summaries of what the Agent can do (web actions, connectors). ([Tom's Guide][10], [The Times of India][11])
* **Prompt-engineering best practices (Help Center)** – explicit instructions, formats, and constraints improve outcomes. ([OpenAI Help Center][4])

[1]: https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide?utm_source=chatgpt.com "GPT-5 prompting guide"
[2]: https://platform.openai.com/docs/guides/tools?utm_source=chatgpt.com "Using built-in tools"
[3]: https://openai.com/index/introducing-chatgpt-agent/?utm_source=chatgpt.com "Introducing ChatGPT agent: bridging research and action"
[4]: https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt?utm_source=chatgpt.com "Prompt engineering best practices for ChatGPT"
[5]: https://cookbook.openai.com/examples/optimize_prompts?utm_source=chatgpt.com "Optimize Prompts"
[6]: https://platform.openai.com/docs/guides/prompt-engineering?utm_source=chatgpt.com "OpenAI - Prompt Engineering"
[7]: https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview?utm_source=chatgpt.com "ChatGPT Capabilities Overview"
[8]: https://openai.com/index/introducing-canvas/?utm_source=chatgpt.com "Introducing canvas"
[9]: https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt?utm_source=chatgpt.com "Tasks in ChatGPT"
[10]: https://www.tomsguide.com/ai/openais-new-chatgpt-agent-is-here-5-features-that-change-everything?utm_source=chatgpt.com "OpenAI's new ChatGPT agent is here - 5 features that change everything"
[11]: https://timesofindia.indiatimes.com/technology/tech-news/openai-launches-chatgpt-agent-to-automate-complex-tasks-what-it-is-capable-of-who-can-use-it-and-more/articleshow/122718609.cms?utm_source=chatgpt.com "OpenAI launches ChatGPT Agent to automate complex tasks: What it is capable of, who can use it and more"
