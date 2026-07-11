---
layout: post

title: "The Next AI Model Wave Has Already Been Funded"
subtitle: "What release cadence, benchmark progress, and a $149 billion quarter suggest about the next launches from OpenAI, Anthropic, Google, SpaceXAI, Meta, and nine fast-moving challengers"
quote: "The winning prediction is not which lab tops the next chart. It is that model capability, price, and deployment options will change faster than most governance and procurement cycles."
excerpt: "The next AI model wave is more likely to arrive as a continuous sequence of model-family upgrades, agent-focused releases, faster inference tiers, open-weight systems, and production refinements than as one dramatic naming moment."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-07-11 09:00:00 -0700
update: 2026-07-11 09:00:00 -0700

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - The next AI model wave is likely to arrive through continuous model-family upgrades, agent-focused releases, faster inference tiers, open-weight systems, and production refinements.
  - Benchmark history shows the competitive field compressing, with multiple providers now operating in a narrow frontier-adjacent band.
  - Hyperscaler capital expenditure has climbed from approximately $39.4 billion in Q1 2021 to $149.4 billion in Q1 2026, creating strong pressure to convert infrastructure into products and recurring revenue.
  - Enterprise leaders should evaluate completed work, govern agents as production systems, and architect model gardens instead of betting on a single provider.
  - The strategic constraint is no longer only model capability; it is the ability to evaluate quickly, switch safely, and govern autonomous systems.

description: "Ted Tschopp forecasts the next AI model release wave across OpenAI, Anthropic, Google, SpaceXAI, Meta, Mistral, DeepSeek, Qwen, Kimi, MiniMax, Xiaomi, MBZUAI, Upstage, and Z AI, using benchmark progression, release cadence, official signals, and infrastructure investment."
seo-description: "A forecast of the next AI model wave for late 2026 and early 2027, covering OpenAI, Anthropic, Google, SpaceXAI, Meta, Mistral, DeepSeek, Qwen, Kimi, MiniMax, Xiaomi, MBZUAI, Upstage, and Z AI."

categories:
  - AI
  - Enterprise Architecture
  - Business
  - Opinion

tags:
  - ai models
  - frontier models
  - enterprise ai
  - ai agents
  - model garden
  - open weights
  - ai governance
  - model evaluation
  - hyperscaler capex
  - autonomous systems

keywords:
  - AI model predictions 2026
  - GPT-6 forecast
  - Gemini 3.5 Pro forecast
  - Claude 5 forecast
  - Grok 5 forecast
  - Qwen model releases
  - Mistral open weight models
  - DeepSeek V4
  - enterprise AI governance
  - model garden architecture
  - AI agents
  - hyperscaler capex AI

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-07/Next-AI-Model-Wave.webp"
image-alt: "A technical illustration showing stacked capital expenditure bars and rising benchmark-style model performance lines over faint chips, servers, and workflow diagrams."
image-title: "Next AI Model Wave"
image-description: "A bright technical illustration combining multicolored stacked investment bars, rising model-performance lines, and faint infrastructure diagrams of chips, servers, and AI workflows."

mastodon-post-id:

---

# The Next AI Model Wave Has Already Been Funded

*What release cadence, benchmark progress, and a $149 billion quarter suggest about the next launches from OpenAI, Anthropic, Google, SpaceXAI, Meta, and nine fast-moving challengers.*

The artificial intelligence industry is waiting for another dramatic naming moment: GPT-6, Gemini 4, Claude 6, Grok 5.

The data suggests that is the wrong thing to watch.

The next wave is more likely to arrive as a continuous sequence of model-family upgrades, agent-focused releases, faster inference tiers, open-weight systems, and production refinements. Some will carry major new numbers. Many will not. Collectively, however, they will change what enterprises can automate long before any single launch becomes the symbolic start of a new generation.

Two charts make that visible.

The first is the model frontier. In the [benchmark history behind the accompanying chart](https://tedt.org/charts/index.html), the best score available from each provider rises in steps rather than in a smooth line. OpenAI and Anthropic currently occupy the highest band, but SpaceXAI, Meta, Google, Z AI, Alibaba, DeepSeek, Kimi, MiniMax, and Xiaomi have compressed much of the field into a surprisingly narrow range. The market is no longer defined by one laboratory moving while everyone else waits.

The second chart is [investment](https://tedt.org/charts/index.html). Combined quarterly capital expenditure by Microsoft, Google, Meta, Amazon, Oracle, and Apple increased from approximately **$39.4 billion in Q1 2021 to $149.4 billion in Q1 2026**—nearly four times as much in five years. Amazon represented about 29% of the latest quarter, Google 24%, Microsoft 21%, Meta 13%, Oracle 12.5%, and Apple 1.3%. This is total corporate capital expenditure, not a clean measure of AI spending, but the direction is unmistakable: the infrastructure for training and serving the next model wave is already being built.

[S&P Global Ratings estimates](https://www.spglobal.com/ratings/en/regulatory/article/creditweek-will-rising-capex-test-hyperscalers-credit-strength-s101685676) that the five major cloud providers could spend about **$750 billion in 2026**, or roughly 38% of their combined revenue. The release race is therefore not primarily constrained by ambition or access to capital. It is constrained by power, chips, data, safety validation, inference economics, and the ability to turn raw capability into dependable products.

That changes how we should forecast the next two to three quarters.

## How this forecast was built

This is not an insider roadmap, and the dates below are estimates rather than announced commitments. I used four signals:

1. **Benchmark progression.** I reconstructed each provider's cumulative frontier from the model release history used in the charts. Across the fourteen selected organizations, 410 eligible model variants collapse into 124 provider-frontier milestones.
2. **Release cadence.** Recent median intervals range from about 25 to 40 days for several leading labs, roughly two months for others, and much faster for Alibaba's broad Qwen portfolio. Cadence alone does not predict a flagship, but it reveals how each organization packages progress.
3. **Official signals.** Product announcements, model cards, developer documentation, roadmaps, and statements about models in training provide stronger evidence than naming rumors.
4. **Infrastructure pressure.** When capital deployment rises this quickly, providers have a strong incentive to convert capacity into products, usage, and recurring revenue.

The result is best read as a set of probability windows. A precise model name is fragile. A direction of travel—more autonomous agents, longer context, stronger tool use, lower inference cost, and more specialized model tiers—is much more predictable.

## Five forces shaping the next release cycle

### 1. The agent, not the chatbot, is becoming the unit of competition

Recent frontier announcements increasingly emphasize coding, computer use, tool orchestration, memory, and long-running work. OpenAI is positioning [GPT-5.6](https://openai.com/index/gpt-5-6/) around professional and agentic tasks. Meta's [Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/) combines multimodal reasoning, coding, computer use, and multi-agent workflows. Anthropic's latest Claude releases emphasize longer autonomous operation. MiniMax, Xiaomi, Qwen, Kimi, Mistral, and Z AI are all telling similar stories.

The important benchmark will increasingly be completed work: Can the system plan, call tools, recover from errors, preserve state, and finish a multi-hour task within a cost and policy envelope?

### 2. Model families are replacing single flagships

OpenAI's Sol, Terra, and Luna tiers are a clear example. Providers can advance capability, latency, and price independently rather than forcing every improvement into one monolithic release. Google, Anthropic, DeepSeek, Qwen, and Mistral are following comparable portfolio strategies.

This means the most consequential near-term release may be a cheaper or faster tier that makes an existing capability economically deployable—not the model with the highest benchmark score.

### 3. One-million-token context is becoming table stakes among frontier models

Several recent systems now advertise context windows near one million tokens. Context length still matters, but the competitive question is shifting from how much a model can ingest to how reliably it can reason across that material, retrieve the right evidence, preserve attention over long tasks, and avoid turning additional tokens into additional cost without additional value.

### 4. Open weights are becoming systems competition

DeepSeek, Mistral, Qwen, Z AI, Kimi, Xiaomi, and MBZUAI are not competing only on a downloadable checkpoint. They are pairing models with inference stacks, coding agents, tool protocols, deployment options, and increasingly strong economics. The open-versus-closed debate is evolving into a contest between integrated model, inference, and agent stacks.

### 5. Release gates will become more visible

Anthropic's Fable 5 suspension under a US export-control directive—and its use of classifiers and fallback routing for affected requests—showed how regulatory controls can alter a frontier rollout after launch. Google has used preview periods extensively. DeepSeek is consolidating legacy aliases. Enterprises should expect more staged rollouts, regional availability, changing system behavior, and model snapshots that coexist for longer than marketing announcements imply.

## The fourteen-provider release outlook

### OpenAI: another GPT-5.x move before GPT-6

**Forecast window:** August–November 2026

**Confidence:** Medium

OpenAI released GPT-5.6 on July 9, only months after GPT-5.4 and GPT-5.5. The family is organized into durable capability tiers—Sol, Terra, and Luna—that can improve independently. That structure makes a near-term tier refinement, lower-cost variant, or latency-focused update more likely than an immediate GPT-6 reveal.

My base case is an efficiency-oriented update in late summer, followed by a stronger GPT-5.x frontier release in the autumn. Expect deeper multi-agent orchestration, better coding and computer use, stronger science and cybersecurity performance, and fewer tokens required to reach the same result. OpenAI's larger strategic move is likely to connect these models more tightly to [OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/), its enterprise platform for building, deploying, and governing AI agents.

The biggest uncertainty is naming. The capability may arrive before the generational label.

### SpaceXAI: Grok 4.x first, Grok 5 after training matures

**Forecast window:** Grok 4.x refinement in September–November 2026; Grok 5 in late 2026 or early 2027

**Confidence:** Medium-low

[Grok 4.5](https://x.ai/news/grok-4-5) arrived on July 8, making another immediate flagship unlikely. A faster, cheaper, or more tool-integrated 4.x release is the more probable next step.

The longer-range signal is stronger: SpaceXAI has said [Grok 5 is in training](https://x.ai/news/series-e?stream=top), while SpaceX materials describe Colossus II and a push toward larger-scale pretraining, stronger reasoning fidelity, multimodality, and domain performance. That supports a late-2026-to-early-2027 window, but frontier training schedules are notoriously elastic.

When Grok 5 arrives, expect the story to be about a tightly integrated real-time agent stack spanning software, search, multimodal input, and SpaceXAI's distribution channels.

### Meta: a larger flagship behind Muse Spark

**Forecast window:** September–December 2026

**Confidence:** Medium-high

Meta's July release of [Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/) establishes the product direction: a Model API in public preview, multimodal reasoning, coding, computer use, multi-agent operation, and a one-million-token context window. Meta has also said that more capable models are training.

[Axios has reported](https://www.axios.com/2026/07/09/meta-ai-spark-model-update-developer) that a substantially larger model, code-named Watermelon, is expected later in 2026. The name and final packaging may change, but a larger autumn flagship is a reasonable forecast.

Look for more autonomous coding and computer-use behavior, deeper multimodal reasoning, and stronger personalization across Meta's products. The strategic question will be whether Meta treats the larger system as an open-weight release, a hosted API product, or a tiered combination of both.

### Google: Gemini 3.5 Pro is the clearest near-term call

**Forecast window:** Late July–August 2026

**Confidence:** High on the model; medium on timing

Google introduced [Gemini 3.5 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/) in May and indicated that Gemini 3.5 Pro would follow. The public [Gemini model page](https://deepmind.google/models/gemini/) still lists the Pro tier as forthcoming, making it the most straightforward prediction in this article.

The timing has already slipped beyond the earliest expectation, so the prudent window is late July through August. The likely emphasis is stronger reasoning, agentic coding, native multimodality, one-million-token-class context, and more dependable tool and computer use. Google's advantage is not just the model: it can connect Gemini to Workspace, Cloud, Search, Android, and a growing set of agent-development tools.

For enterprises, 3.5 Pro could matter as the model that makes Google's full-stack agent platform coherent.

### Anthropic: the next Claude 5 tier should emphasize endurance and efficiency

**Forecast window:** September–November 2026, with a cheaper derivative possible earlier

**Confidence:** Medium-high

Anthropic launched [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) on June 9, followed with [Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5) on June 30, and [restored Fable 5 globally](https://www.anthropic.com/news/redeploying-fable-5) on July 1. The company has said that more capable models are coming in the months ahead.

That language, combined with Anthropic's recent cadence, points to another substantial Claude release in the autumn. A Haiku 5 tier or a Sonnet 5 point update could arrive first.

Expect the next step to focus on long-running coding, research and scientific workflows, vision, memory, and token efficiency. Anthropic is also likely to make production safeguards more explicit, including routing, monitoring, and release controls. The lesson from Fable 5 is that behavioral reliability in deployment can matter as much as a pre-release score.

### Mistral: the next important launch is likely sparse and open-weight

**Forecast window:** August–September 2026

**Confidence:** High

[Mistral Medium 3.5](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/) is a dense 128-billion-parameter model with a 256,000-token context window and a unified focus on reasoning, coding, multimodality, and long-running agents. Mistral CEO Arthur Mensch has also [signaled a new sparse open-weight family](https://m.economictimes.com/tech/artificial-intelligence/modi-mistral-ai-ceo-arthur-mensch-discuss-human-centric-ai-open-weight-models-and-india-partnerships/amp_articleshow/131832937.cms), with partner access in July and a public release later in the summer.

That makes an August or September release one of the stronger forecasts here. A mixture-of-experts design would fit Mistral's position: high capability with self-hosting economics that appeal to governments and regulated enterprises. Expect multimodal and agentic features, favorable serving economics, and a strong sovereign-AI message; hardware requirements are not yet public.

Mistral may not win the absolute benchmark crown, but it can win important buying decisions where control, locality, and cost matter more than the last few points of intelligence.

### DeepSeek: V4 stabilization is more likely than a V5 surprise

**Forecast window:** Late July–September 2026

**Confidence:** Medium-high

DeepSeek's April [V4 preview](https://api-docs.deepseek.com/news/news260424/) introduced Pro and Flash variants, open weights, a one-million-token context window, dual thinking modes, and sparse designs with 49 billion active parameters for Pro and 13 billion for Flash. DeepSeek is also [retiring legacy API aliases](https://api-docs.deepseek.com/updates/) on July 24.

Those signals point to consolidation: a stabilized V4, a V4.1-style release, or updated production snapshots. It would be premature to predict V5 simply because competitors are moving quickly.

The likely gains are reliability in tools and coding, smoother production migration, and lower serving cost. DeepSeek's competitive pressure comes from making frontier-adjacent reasoning inexpensive enough to reshape the economics of every other provider.

### Upstage: Solar Pro 4 is the most date-specific challenger forecast

**Forecast window:** Late July–mid-August 2026

**Confidence:** High for Pro 4; medium for Solar Open 2

[Solar Pro 3](https://www.upstage.ai/blog/en/solar-pro-3-0323) uses a mixture-of-experts architecture with 102 billion total parameters and 12 billion active parameters, with a focus on agents, reasoning, and Korean-language performance. In a [reported roadmap statement](https://en.etnews.com/20260617200008), Upstage leadership targeted Solar Open 2 for the end of June and Solar Pro 4 for the end of July.

The public Open 2 release appears to have slipped, but the combined signal still points to a clustered release window from late July into mid-August.

Expect enterprise tool use, agent reliability, coding, Korean and English performance, and production economics to lead the announcement. Upstage's opportunity is not to imitate the largest American labs; it is to become the trusted high-performance platform for regional and regulated enterprise use.

### MiniMax: an M3 refinement before M4

**Forecast window:** August–September 2026

**Confidence:** Medium

[MiniMax M3](https://www.minimax.io/blog/minimax-m3) arrived on June 1 with native multimodality, one-million-token context, computer use, and a sparse-attention architecture designed for long agent tasks. It followed M2 in October 2025, M2.1 in December, M2.5 in February, and M2.7 in March. That cadence supports another refinement, but M3 is too recent to make a full M4 launch the base case.

A more plausible next step is M3.x: a high-speed tier, a lower-cost serving profile, or a specialized agent and computer-use update. The benchmark chart shows MiniMax already operating in the same broad band as DeepSeek, Kimi, Xiaomi, and Alibaba. A refinement that improves throughput and tool reliability could be more commercially meaningful than a new name.

I would place a major M4 generation in early 2027 unless MiniMax accelerates its historical cadence.

### Alibaba Qwen: the highest probability of frequent meaningful releases

**Forecast window:** August–October 2026

**Confidence:** Medium on the flagship name; high on continued releases

Qwen is the hardest portfolio to forecast by name because it ships so often. In the recent benchmark history, Alibaba has far more distinct release dates than any other provider in this group. The [Qwen model changelog](https://docs.qwencloud.com/changelog/models) also shows a portfolio expanding across general intelligence, coding, vision, audio, and agents.

The next general flagship could be branded Qwen 3.8, Qwen 4, or something else entirely. The safer prediction is a late Q3 release that pushes native multimodality, GUI and mobile action, long-horizon coding, persistent memory, and mixture-of-experts efficiency. Qwen's [AgentWorld work](https://qwen.ai/blog?id=qwen-agentworld) provides a useful clue: the laboratory is investing in environments where models learn to operate, not merely answer.

Qwen's advantage is velocity. It can turn research improvements into a family of deployable models faster than most organizations can finish an evaluation cycle.

### Kimi: a general successor is likely before a full K3

**Forecast window:** August–October 2026; K3 preview plausible in Q4

**Confidence:** Medium-low

Moonshot AI's Kimi portfolio has moved from long context toward coding, multimodal reasoning, and interleaved tool use. Its June code-specialist release builds on K2.6 with a 256,000-token context window and a large sparse architecture.

The next likely move is a general-purpose K2.x successor in late summer or early autumn rather than an immediate finished K3. A K3 preview becomes plausible in the fourth quarter, supported by the team's discussion of a new architecture and more efficient attention mechanisms in a [founders' AMA](https://platform.kimi.ai/blog/posts/Kimi_Founders_AMA_Recap).

Expect lower reasoning-token cost, tighter think-and-tool loops, stronger multimodality, and longer dependable tasks. Kimi's strategic differentiator is likely to be efficient agency rather than raw model size.

### Xiaomi MiMo: speed and product integration before the next generation

**Forecast window:** V2.5 refinement in Q3 2026; major V3-class release in Q4 2026–Q1 2027

**Confidence:** Medium

[MiMo-V2.5-Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro) combines a 1.02-trillion-parameter sparse architecture with 42 billion active parameters, a one-million-token context window, and an emphasis on coding and agents. Xiaomi followed with an [UltraSpeed serving profile](https://mimo.mi.com/docs/en-US/news/latest/1000tps) exceeding 1,000 tokens per second and a dedicated coding environment.

That productization work suggests the next release will improve availability, price, speed, memory, and agent harnesses before Xiaomi resets the model number. A more substantial V3-class system is more plausible late in 2026 or early in 2027.

Xiaomi has a distribution advantage most model labs do not: phones, vehicles, home devices, and robotics. The long-term release to watch is the one that turns MiMo from a cloud model into an action layer across that hardware ecosystem.

### MBZUAI Institute of Foundation Models: a sovereign agent release is the logical next step

**Forecast window:** September–December 2026

**Confidence:** Medium-low

[K2 Think V2](https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/) extends MBZUAI's [open K2 foundation](https://mbzuai.ac.ae/news/k2-an-open-source-model-that-delivers-frontier-capabilities/) with an emphasis on sovereign reasoning. Public roadmap language points toward additional 2026 updates, architectural experimentation, and reinforcement learning for tool and agent behavior.

The sparse release history makes a precise month difficult to defend, but a Q3–Q4 K2 update, K2 V3, or refreshed base model is plausible. Expect the message to center on full-stack sovereignty, transparent weights and data practices, planning, lower hallucination rates, and better tool use.

MBZUAI does not need to match the fastest commercial cadence. Its distinctive role is to prove that frontier-relevant research and deployment infrastructure can be built outside the dominant US and Chinese ecosystems.

### Z AI: another GLM 5.x release could arrive before summer ends

**Forecast window:** August–September 2026; a GLM 6-class move is plausible in Q4

**Confidence:** Medium-high for 5.x; low for the GLM 6 name

[GLM-5.2](https://z.ai/blog/glm-5.2) arrived in June with a one-million-token context window, long-horizon coding, agentic reinforcement learning, and an efficiency story. It followed GLM 4.6, 4.7, 5, and 5.1 at a rapid pace.

That pattern supports another 5.x point release by September. A GLM 6-class change by the end of the year is plausible, but the label is speculative.

The likely improvements are coding endurance, multi-tool coordination, context stability, agent training, and decoding efficiency. Z AI's position in the frontier chart is easy to underestimate: its current provider-best score places it just behind the leading US labs and among the strongest challengers.

## A probable release calendar

If the signals hold, the next wave should unfold in four overlapping phases:

**Late July through August 2026**

- Google Gemini 3.5 Pro
- Upstage Solar Pro 4 and possibly Solar Open 2
- DeepSeek V4 production stabilization
- OpenAI, MiniMax, or Xiaomi efficiency-focused point releases

**August through September 2026**

- Mistral's larger sparse open-weight family
- Z AI GLM 5.x
- New Qwen and Kimi general models
- MiniMax M3.x

**September through November 2026**

- Another OpenAI GPT-5.x frontier update
- Anthropic's next Claude 5 tier
- Meta's larger post-Spark model
- Grok 4.x refinement
- A sovereign-agent update from MBZUAI

**Fourth quarter 2026 through first quarter 2027**

- Grok 5
- Xiaomi's next major MiMo generation
- A Kimi K3 preview or release
- Possible Qwen 4, GLM 6, MiniMax M4, or other generational rebrands

The ordering matters more than the exact week. The market is moving toward continuous deployment, where every quarter contains several releases capable of changing an enterprise model portfolio.

## What enterprise leaders should do now

### Build a model garden, not a vendor bet

No single provider leads every combination of reasoning, coding, multimodality, latency, cost, data residency, and deployment control. Architect an abstraction layer that can route workloads across at least two frontier providers and one credible open-weight option.

### Evaluate completed work, not isolated answers

Traditional question-and-answer benchmarks are necessary but insufficient. Measure task completion, tool-call accuracy, recovery after failure, policy compliance, elapsed time, and total cost. A model that scores slightly lower but finishes reliably can be the better production system.

### Treat every model update as a production change

Point releases can alter tone, safety behavior, tool selection, token consumption, and failure modes. Pin versions where possible. Maintain regression suites. Require a controlled promotion process even when a provider describes an update as an improvement.

### Negotiate for capacity and portability

The capital-expenditure boom does not guarantee that the exact model, region, throughput, or price tier you need will always be available. Capacity commitments, fallback models, data-export rights, and portable agent tooling belong in procurement discussions now.

### Move governance from prompts to agents

An agent that can browse, write code, send messages, change records, or operate software creates a different risk profile from a chatbot. Governance must cover identity, delegated authority, tool permissions, audit trails, human approval points, memory, and rollback—not just model content.

## The bottom line

The next era of AI will arrive through a dense sequence of frontier upgrades, open-weight model families, faster serving tiers, and increasingly capable agents.

The benchmarks say the competitive field is widening. The capital-expenditure chart says the industry has funded the infrastructure to keep it moving. The product announcements say that the target has shifted from better conversation to dependable digital labor.

For enterprise leaders, the winning prediction is not which lab tops the next chart. It is that model capability, price, and deployment options will change faster than most governance and procurement cycles. That means investing in a model garden instead of a single model or provider. The organizations that win here will be the ones that can evaluate quickly, switch safely, govern autonomous systems, and convert a relentless release cycle into measurable work.

---

## Data and selected sources

- [Artificial Analysis trends](https://artificialanalysis.ai/trends)
- [Benchmark model data used in the chart](https://raw.githubusercontent.com/reyamira/models/main/data/benchmarks.json)
- [S&P Global Ratings: Will Rising Capex Test Hyperscalers' Credit Strength?](https://www.spglobal.com/ratings/en/regulatory/article/creditweek-will-rising-capex-test-hyperscalers-credit-strength-s101685676)
- [OpenAI GPT-5.6](https://openai.com/index/gpt-5-6/)
- [SpaceXAI Grok 4.5](https://x.ai/news/grok-4-5)
- [Meta Muse Spark 1.1](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)
- [Google Gemini 3.5](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/)
- [Anthropic Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5)
- [Mistral Medium 3.5](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/)
- [DeepSeek V4 preview](https://api-docs.deepseek.com/news/news260424/)
- [Upstage Solar Pro 3](https://www.upstage.ai/blog/en/solar-pro-3-0323)
- [Upstage roadmap report](https://en.etnews.com/20260617200008)
- [MiniMax M3](https://www.minimax.io/blog/minimax-m3)
- [MiniMax model release notes](https://platform.minimax.io/docs/release-notes/models)
- [Qwen model changelog](https://docs.qwencloud.com/changelog/models)
- [Kimi model documentation](https://platform.kimi.ai/docs/models)
- [Xiaomi MiMo-V2.5-Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro)
- [MBZUAI K2 Think V2](https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/)
- [Z AI GLM-5.2](https://z.ai/blog/glm-5.2)

*Disclosure: All future release windows in this article are analytical estimates based on public information available as of July 11, 2026. They are not vendor announcements. Corporate capital expenditure includes more than AI infrastructure and should be interpreted as a directional investment signal rather than AI-only spending.*
