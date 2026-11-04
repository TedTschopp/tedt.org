---
layout: post
title: What AI in 2024 Means for Us in 2025
subtitle: "Turn the New Choices Into One Measurable Utility Pilot"
quote: "A useful pilot starts with a task someone owns and an answer someone can check."
excerpt: "The 2024 releases give utilities more choices in model size, price, and inputs. A maintenance-planning example shows how to turn those choices into a measured trial with clear ownership and acceptance conditions."
source: Original Content
source-url: ''
call-to-action: "Choose one recurring task, name its owner, and agree on the evidence that would justify expanding its use of AI."
date: 2025-01-05
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
- "Small local models create options; they do not establish that every laptop can run a model suited to every task."
- "Image input and lower token prices are specific capabilities to test, rather than proof of business value."
- "A maintenance-planning pilot needs approved records, a responsible reviewer, and explicit acceptance conditions."
- "Count correction and review time when comparing AI assistance with the existing process."
description: "A January 2025 proposal for turning 2024 AI releases into a bounded utility pilot, with source-grounded capabilities, an accountable owner, and measurable acceptance conditions."
seo-description: "How utilities can test 2024 AI capabilities in 2025: define one task, validate its sources, measure review effort, and set acceptance conditions."
categories:
- Artificial Intelligence
- Business
- Opinion
tags:
- utility AI
- enterprise AI
- AI implementation
- multimodal AI
- data quality
keywords: utility AI implementation, enterprise AI strategy, electric utility technology,
  AI deployment 2025, utility customer service AI, operational efficiency AI
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709
image: /img/AI/What-AI-in-2024-Means-for-Us-in-2025.webp
image-alt: Utility infrastructure enhanced with AI capabilities
image-artist: Ted Tschopp
image-artist-URL: https://tedt.org/
image-credits: Ted Tschopp
image-credits-URL: https://tedt.org/
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-credits-title: ''
image-description: ''
image-title: ''
mastodon-post-id: '115017674689715289'
image_width: 1456
image_height: 816
---

The next useful step for AI at a utility is a task someone owns and an answer someone can check. More capable models give us choices. They do not tell us which work to change first.

In [AI in 2024: A Year in Review](https://tedt.org/AI-in-2024-A-Year-in-Review/), I looked at changes in model availability, prices, and capabilities. Here I want to bring that discussion down to a practical decision: what would justify using one of those tools in an ordinary piece of utility work?

## What the 2024 Releases Actually Give Us

Local deployment is one option. Microsoft's [April 23, 2024 introduction of Phi-3](https://news.microsoft.com/source/features/ai/the-phi-3-small-language-models-with-big-potential/) describes a 3.8-billion-parameter model available through tools including Ollama. That is a specific small-model example, not evidence that every laptop can run a general replacement for a larger hosted model. Memory, response time, and performance on the intended task still need testing.

Multimodal input is another option. Anthropic's [June 2024 Claude 3.5 Sonnet announcement](https://www.anthropic.com/news/claude-3-5-sonnet) describes vision capabilities, including interpreting images and charts. A utility team could test whether an image helps answer a particular question. It should also test whether the model misreads a label or overlooks a detail. Text, image, audio, and video support must be checked separately for the product being considered.

Price is a third choice. OpenAI's [July 18 GPT-4o mini release](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) lists $0.15 per million input tokens and $0.60 per million output tokens. Those are dated API prices with different units for what goes in and what comes out. They do not include the whole cost of a working application.

These releases support experimentation. They do not establish that local deployment removes infrastructure costs, that every multimodal feature is available in every tool, or that lower token prices necessarily reduce electricity use.

## Start With a Maintenance-Planning Brief

Consider a proposed assistant that turns an approved maintenance work pack into a short briefing for a planner. This is a design example, not a report of an SCE deployment.

The assistant would identify the asset, planned work, dependencies, and unresolved questions. It would point the reviewer to the relevant source passages. It would leave a missing approval unresolved rather than supplying a plausible answer. It would not issue operating instructions, authorize work, or change a work order.

The maintenance-planning manager would own the trial and decide what makes a briefing usable. A planner would verify each result. IT would help select an approved tool and confirm that the trial records are appropriate for it. A data steward would resolve uncertainty about record versions and missing fields.

That division gives each problem somewhere to go. A missing source record is a data issue. A summary that changes a date is an output-quality issue. An unclear acceptance rule is a decision the process owner needs to make.

## Agree on the Test Before Trying the Tool

For a small first trial, select 20 work packs that include straightforward cases, conflicting records, and missing information. Use records approved for this purpose. These are proposed trial conditions, not a statistical claim or an established company standard.

First, measure the existing method: the time to produce an acceptable brief, the corrections required, and the errors a reviewer finds. Then compare AI assistance on comparable work. Include preparation, drafting, checking, and correction in the assisted time. If someone has to reconstruct the answer from scratch, count that effort.

The owner could require every brief in this trial to preserve the required identifiers and dates, cite the applicable passages, and flag missing approvals. Any invented approval or unsafe instruction would stop expansion until its cause was addressed. Expansion would also require a lower median time to an accepted brief, without worse quality. Those are explicit proposed acceptance conditions; the owner should adjust them before the trial starts.

Here is a simple planning calculation. If 20 accepted briefs take 20 minutes each today, the baseline is 400 minutes. If assistance brings the complete task to 12 minutes per accepted brief, including review, the total is 240 minutes: a potential saving of 160 minutes. These are illustrative assumptions, not measured results. If review takes longer than expected, the saving shrinks or disappears.

## Make the Useful Method Repeatable

For SCE's IT organization, the practical opportunity is to help teams repeat a method that works: identify the source records, explain the prompt, define the review, and record the result. A shared platform can support that work, but availability alone will not establish adoption or benefit.

The first deliverable for 2025 could be modest: one recurring task, a named owner, a recorded baseline, and a decision about whether the result is good enough to expand. A colleague should be able to follow the same method and understand both the benefit and the remaining work.
