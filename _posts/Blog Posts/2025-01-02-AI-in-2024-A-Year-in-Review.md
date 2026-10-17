---
layout: post
title: 'AI in 2024: A Year in Review'
subtitle: "More Choice, Lower Token Prices, and a Harder Question About Useful Work"
quote: "Access to a better model is a starting point. Useful work still depends on the task, the evidence, and the person reviewing the result."
excerpt: "The 2024 releases give us more choices in price, context, and reasoning. For 2025, the practical question is which choices improve a task we can measure."
source: Original Content
source-url: ''
call-to-action: "Choose one recurring task and compare quality, correction time, elapsed time, and cost before expanding its use of AI."
date: 2025-01-02
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
- "Dated releases provide firmer evidence than an undefined “GPT-4 class” label."
- "Compare input and output token prices separately, with dates and units."
- "Longer context and more reasoning computation create choices rather than guarantees."
- "Reported training-compute costs do not represent the full cost of developing or operating a model."
- "The next step is to measure useful work and help colleagues adopt what proves effective."
description: "A source-grounded review of 2024 AI releases, token costs, context windows, and reasoning, with practical priorities for enterprise adoption in 2025."
seo-description: "What 2024 AI releases establish about price, context, and reasoning, and how to turn those choices into measurable enterprise value in 2025."
categories:
- Artificial Intelligence
- Science
tags:
- AI review
- technology trends
- GPT-4 class models
- multimodal AI
- AI accessibility
keywords: "AI 2024 review, LLM prices, GPT-4o mini, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3, OpenAI o1, enterprise AI adoption"
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709
image: /img/AI/What-AI-in-2024-Means-for-Us-in-2025.webp
image-alt: Visual representation of AI breakthroughs in 2024
image-artist: Ted Tschopp
image-artist-URL: https://tedt.org/
image-credits: Ted Tschopp
image-credits-URL: https://tedt.org/
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-credits-title: ''
image-description: ''
image-title: ''
mastodon-post-id: '115017674210477849'
image_width: 1456
image_height: 816
---

The most useful change in AI during 2024 was the increase in choices. We can choose among models with different strengths, prices, context limits, and ways of handling a problem. The harder work is deciding which choice improves a real task.

[Simon Willison's December 31 review](https://simonwillison.net/2024/Dec/31/llms-in-2024/) provides a broad account of the year's developments and informs the themes here. For an enterprise reader, I want to narrow that account to a few changes we can connect to dated releases and decisions about our own work.

## More Models Deserve a Look

Anthropic [released Claude 3.5 Sonnet on June 20](https://www.anthropic.com/news/claude-3-5-sonnet). DeepSeek published its [V3 technical report on December 27](https://arxiv.org/abs/2412.19437v1). Alongside OpenAI and Google's releases, these give teams more candidates to compare.

“GPT-4 class” can be a convenient shorthand, but it needs a named comparison. Performance on one benchmark does not establish equivalent behavior on every task. A useful selection starts with examples of the work we need done, including the cases where a plausible answer would be wrong.

Local deployment adds another choice. Whether a model fits on a particular laptop depends on its size, precision, available memory, and the application's demands. A claim that something runs locally is worth testing on the actual machine before turning it into a general deployment recommendation.

## Token Prices Need Units and Dates

OpenAI's [July 18 GPT-4o mini announcement](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) lists launch prices of **$0.15 per million input tokens** and **$0.60 per million output tokens**. That is a concrete example of access to a lower-cost model. It is more useful than a single claim that all models became a fixed number of times cheaper.

The unit matters because a response consumes both input and output. A longer prompt, repeated attempts, and a verbose answer can change the cost of completing the task. The lowest price per token is therefore not necessarily the lowest cost per acceptable result.

Human review belongs in that calculation. If a cheaper model needs much more correction, the apparent saving can disappear. Compare the finished work and the effort required to get there.

## More Context Is Room for Input

Google's [June 27 developer announcement](https://developers.googleblog.com/en/new-features-for-the-gemini-api-and-google-ai-studio/) makes a two-million-token context window available for Gemini 1.5 Pro. That is an important option for working with a larger collection of material.

It is not a two-million-token output allowance, and it does not guarantee that every relevant detail will be used correctly. For a long-document task, test whether the model finds the applicable passage, preserves dates, and recognizes conflicting information.

The design choice is whether to supply a large body of material, retrieve selected passages, or combine the approaches. The right answer depends on the task's evidence needs, response time, and cost.

## Reasoning Adds Another Trade-Off

OpenAI's [September 12 o1-preview release](https://openai.com/index/introducing-openai-o1-preview/) introduces models designed to spend more time working through difficult problems before responding. That creates another dimension for comparison: how much computation at answer time is worth using for a particular question?

A straightforward extraction task and a difficult reasoning problem may not need the same treatment. Test whether the additional time improves an answer enough to justify the delay and expense. A new model category does not eliminate the need to check the result.

Cost claims about training need similar care. DeepSeek-V3's December report estimates compute costs for its official training, while excluding earlier research and experiments. That is not the total cost of creating the organization, developing the model, or serving its users. It should not become a promise that another enterprise can reproduce the whole capability for the same amount.

## The Adoption Question at SCE

In my own work, GitHub Copilot's coding assistance has helped streamline development, while GPT-4's voice features have been useful for learning and personal development. Those experiences identify useful activities; they do not establish a measured productivity gain for everyone.

Here at SCE, making AI tools available has not produced even adoption. Some colleagues have incorporated them into daily work, while others have not taken advantage of the investment. The next question is what helps someone move from access to a useful habit.

A practical start is one recurring task, an approved tool, and an example that someone can try and discuss. Compare the result with the existing process. Track accuracy, correction effort, elapsed time, and cost. Then share the method and its limits so another colleague can decide whether it fits their work.

The infrastructure question remains relevant, too. The Department of Energy's [December 2024 data-center report summary](https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers) describes rising electricity use and a range of possible future demand. Greater efficiency in one model or device does not settle the environmental effect of growing total use.

For 2025, the useful priority is to turn these additional choices into evidence of better work. Start with a task, inspect the result, and expand the methods that hold up when someone else tries them.
