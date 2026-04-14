---
layout: post

title: "A Practical AI Training Plan Across OpenAI, Anthropic, and Microsoft/GitHub"
subtitle: "A fast-start learning path from literacy to agents"
quote: "Start broad, build one thing, then scale with discipline."
excerpt: "A friend and former colleague asked for a quick AI training plan. This post shares a practical path with curated resources from OpenAI, Anthropic, and Microsoft/GitHub, plus a clear learning order."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-04-14 00:00:00 -0700
update: 2026-04-14 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
- Curated starting resources from OpenAI, Anthropic, and Microsoft/GitHub.
- A practical order for learning: literacy, quickstart, prompting, then agents.
- Direct links to official docs, courses, and quickstarts.
- Designed for busy professionals who need a high-signal path.
- Focused on real-world capability building, not tool tourism.

description: "A practical AI training plan that maps official learning resources from OpenAI, Anthropic, and Microsoft/GitHub into a clear sequence: start with literacy, complete a quickstart, study prompting deeply, then move into agentic systems."
seo-description: "Use this practical AI training plan to learn with OpenAI, Anthropic, and Microsoft/GitHub resources in the right order, from fundamentals to agents and orchestration."

categories:
- AI
- Business
- Computers

tags:
- ai training plan
- ai upskilling
- ai learning path
- openai academy
- anthropic claude
- microsoft ai for beginners
- github models
- prompt engineering
- agents sdk
- semantic kernel
- mcp

keywords:
- quick ai training plan
- openai learning path
- anthropic learning path
- microsoft github ai learning path
- prompt engineering resources
- ai agents learning path
- enterprise ai training resources

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-04/classrooms.webp"
image-alt: "A stylized classroom scene where a teacher presents maps and diagrams on a large board while a diverse group of students watches attentively, surrounded by books and notes."
image-artist: ""
image-artist-URL: ""
image-description: "A painterly, textured illustration depicting a classroom or workshop environment. At the center, an instructor stands before a large illuminated board filled with maps, charts, and handwritten notes, actively explaining concepts to a group. The students—diverse in age and background—sit and stand around, engaged and focused. The warm lighting contrasts with cool-toned surroundings, emphasizing the board as a focal point of knowledge transfer. The scene evokes themes of collaborative learning, exploration, and the structured communication of complex ideas."
image-title: "Mapping the Future: Learning in Motion"
image_width: 1792
image_height: 1024


mastodon-post-id:

---

A friend and former colleague reached out and asked for a quick AI training plan he could put to work immediately. I wrote one, then decided to post it here so everyone can use it, adapt it, and improve it.

If this helps, improve it for your context and share it with someone else who is
trying to level up.


## OpenAI

* **OpenAI Academy** — good first stop for broad AI literacy through more
  advanced engineering-oriented material. OpenAI describes it as covering
  workshops, discussions, and digital content from foundational AI literacy to
  advanced integration for engineers. ([OpenAI Academy][2])
* **OpenAI Developers Learn + Quickstart** — the fastest path to seeing how the
  platform works. The Learn hub collects docs, videos, community resources, and
  cookbook material, while the Quickstart walks through the first API call. ([OpenAI Developers][3])
* **Prompt engineering guides + Cookbook** — this is where users should spend
  real time after the quickstart. OpenAI’s prompt engineering docs cover how to
  structure instructions, and the Cookbook gives practical recipes and example
  code. ([OpenAI Developers][4])
* **Agents SDK + Evals** — once users understand basic prompting, these are the
  right next docs for building real workflows, tool use, and quality
  measurement. ([OpenAI Developers][5])

## Anthropic

* **Anthropic AI Fluency + Learn hub** — strong starting point for understanding
  capabilities, limitations, and practical collaboration patterns with AI before
  users get deep into code. ([Anthropic][6])
* **Build with Claude + Get started with Claude** — this is the hands-on path.
  Anthropic’s learning hub points to the developer docs, and the “Get started”
  guide walks through a first API call and a simple web-search assistant. ([Anthropic][7])
* **Prompting best practices** — Anthropic’s core prompt guide is worth reading
  carefully because it is very practical and very builder-focused. ([Claude API Docs][8])
* **Building with the Claude API + Tool use + MCP** — this is the next layer
  after basics: structured course material, function/tool calling, and MCP for
  connecting models to external systems. ([Anthropic][9])

## Microsoft / GitHub

* **Microsoft Generative AI for Beginners** — probably the best Microsoft
  starting repo for modern GenAI. If users want a broader AI foundation first,
  Microsoft’s **AI for Beginners** is the companion option. ([GitHub][10])
* **GitHub Models Quickstart + GitHub Models docs** — this is especially useful
  because GitHub says you can run models with your GitHub credentials, then
  prototype, optimize, evaluate, and store prompts right in the repo workflow.
  That makes it a very practical “learn by doing” path. ([GitHub Docs][11])
* **GitHub Copilot prompt engineering** — use the GitHub Docs page together with
  Microsoft Learn’s prompt-engineering module and Copilot learning path. This is
  great for someone who already lives in engineering and operations workflows. ([GitHub Docs][12])
* **AI Agents for Beginners + Semantic Kernel** — after fundamentals, this is
  the best Microsoft path into agentic systems. Semantic Kernel is Microsoft’s
  model-agnostic SDK for building AI agents in C#, Python, or Java, and the
  quickstart plus MicrosoftLearning repo make it concrete. ([GitHub][13])

## The Order

1. **Start broad:** OpenAI Academy, Anthropic AI Fluency, and Microsoft
   Generative AI for Beginners. ([OpenAI Academy][2])
2. **Do one vendor quickstart end to end:** OpenAI Developer Quickstart or
   Anthropic Get Started. ([OpenAI Developers][14])
3. **Use GitHub Models next:** it lowers setup friction and helps users compare
   models and prompts in a familiar GitHub workflow. ([GitHub Docs][11])
4. **Study prompting seriously:** OpenAI prompt guides, Anthropic prompting best
   practices, and GitHub Copilot prompt engineering. ([OpenAI Developers][4])
5. **Then move into agents and enterprise orchestration:** OpenAI Agents/Evals,
   Anthropic tool use/MCP, and Microsoft Semantic Kernel. ([OpenAI Developers][5])


[2]: https://academy.openai.com/ "https://academy.openai.com/"
[3]: https://developers.openai.com/learn "https://developers.openai.com/learn"
[4]: https://developers.openai.com/api/docs/guides/prompt-engineering "https://developers.openai.com/api/docs/guides/prompt-engineering"
[5]: https://developers.openai.com/api/docs/guides/agents "https://developers.openai.com/api/docs/guides/agents"
[6]: https://anthropic.skilljar.com/ai-fluency-framework-foundations "https://anthropic.skilljar.com/ai-fluency-framework-foundations"
[7]: https://www.anthropic.com/learn/build-with-claude "https://www.anthropic.com/learn/build-with-claude"
[8]: https://docs.anthropic.com/en/prompt-library/library "https://docs.anthropic.com/en/prompt-library/library"
[9]: https://anthropic.skilljar.com/claude-with-the-anthropic-api "https://anthropic.skilljar.com/claude-with-the-anthropic-api"
[10]: https://github.com/microsoft/generative-ai-for-beginners "https://github.com/microsoft/generative-ai-for-beginners"
[11]: https://docs.github.com/en/github-models/quickstart "https://docs.github.com/en/github-models/quickstart"
[12]: https://docs.github.com/copilot/concepts/prompt-engineering-for-copilot-chat "https://docs.github.com/copilot/concepts/prompt-engineering-for-copilot-chat"
[13]: https://github.com/microsoft/ai-agents-for-beginners "https://github.com/microsoft/ai-agents-for-beginners"
[14]: https://developers.openai.com/api/docs/quickstart "https://developers.openai.com/api/docs/quickstart"

