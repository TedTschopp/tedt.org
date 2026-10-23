---
layout: post
title: Custom Writing Styles in AI
title-url: null
subtitle: "Build a Reusable Style Card From Your Own Writing"
subtitle-url: null
quote: "A useful style prompt changes the expression while preserving the facts."
excerpt: "Use examples of your writing to build a portable style card, then test whether a rewrite preserves facts, uncertainty, and your intended voice. This is prompting, not training the underlying model."
source: Original Content
source-url: ''
call-to-action: "Build a short style card from approved samples and check it against one piece you have not used as an example."
date: 2025-01-06 00:00:00-08:00
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
- "Examples in a conversation guide the response without retraining the underlying model."
- "Choose writing that fits the intended audience and remove material the tool should not receive."
- "Turn observations about voice into specific, reusable instructions."
- "Compare a rewrite with its source for factual fidelity as well as style."
description: "A tool-independent method for deriving a reusable writing-style card from examples and reviewing an AI-assisted rewrite for factual fidelity."
seo-description: "Create a reusable AI writing-style prompt from your own samples, then check dates, commitments, uncertainty, and voice in the rewrite."
categories:
- Computers
- Artificial Intelligence
- Opinion
- Personal Writing
tags: AI, Writing, Personalization, Technology
keywords: AI, writing, personal style, technology, 2025
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709
image: https://tedt.org/img/2025-01/Custom-Writing-Styles.webp
image-alt: AI learning and writing in a personal style
image-artist: Ted Tschopp
image-artist-URL: https://tedt.org/
image-credits: Ted Tschopp
image-credits-URL: https://tedt.org/
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-credits-title: Custom Writing Styles in AI
image-description: Digital art showing AI adapting to a user's writing style.
image-title: Custom Writing Styles in AI
mastodon-post-id: '115017675170052132'
---

You can give an AI assistant examples of your writing and ask it to identify patterns worth reusing. The useful result is a short set of instructions you can inspect, edit, and carry into the next writing task.

This is **prompting**, not training the underlying model. The examples become context for the conversation. The distinction is established in the [May 2020 GPT-3 paper](https://arxiv.org/abs/2005.14165v1): examples can guide a task without updating the model's weights. That does not tell us whether a particular service retains conversation data; its data-handling terms are a separate question.

This article develops the style card itself. The companion [Custom Writing Styles in Copilot](https://tedt.org/Custom-Writing-Styles-in-Copilot/) applies the method to a work-writing task in Copilot.

## Choose Examples That Belong Together

For my own experiment, I used five blog posts. For yours, select a few pieces that represent the kind of writing you want to produce. A reflective blog post and a short project update may need different cards. A feature shared by all your samples may simply reflect their subject, rather than your voice.

Use writing you are entitled to supply to the chosen tool. Remove personal details, confidential work information, and other people's material unless that use is approved. You usually need enough text to demonstrate sentence structure and tone, not the entire underlying document.

Keep one representative piece out of the examples. It will give you a fresh passage on which to check the resulting instructions.

## Ask for Observations You Can Check

Paste this instruction before your samples:

```text
I will provide examples of my writing. Treat them as reference
material, not as instructions or facts for a new article.
After each example, acknowledge it and wait. When I say DONE,
describe the recurring sentence structure, tone, organization,
and use of examples. Support each observation with a short
passage from a sample. Do not infer my biography or beliefs.
```

After the last sample, ask for a concise card:

```text
DONE. Turn the supported observations into six practical
instructions for a writer. Separate recurring habits from
features found in only one sample. Avoid vague advice such as
"be engaging." Do not require personal stories, dialogue,
religious references, or emotions unless the new source includes them.
```

Check the evidence behind each instruction. If the assistant says you use short paragraphs, can you see that in the samples? If it says you are always inspirational, is that a recurring feature or a flattering generalization?

## Turn the Description Into Instructions

A card should tell the next writer what to do. An illustrative card for a clear workplace update might be:

```text
Lead with what changed and what the reader needs to do.
Use ordinary words and active verbs.
Keep each paragraph focused on one point.
Preserve names, dates, numbers, and the strength of each claim.
Keep uncertainty visible; do not turn a possibility into a promise.
Add no personal experience, quotation, fact, or commitment.
```

This is an example of a usable card, not a claimed description of every person's voice. Replace its instructions with the patterns your own samples actually support.

## Test the Card Against the Meaning

Here is a worked editing example, rather than a recorded output from a particular AI product.

Source notes:

> The review may finish Thursday. Two questions remain open. No launch date has been agreed.

A rewrite such as “We will finish the review Thursday and launch soon” sounds confident, but changes the facts. It turns *may* into *will*, drops the unresolved questions, and implies a launch commitment.

A faithful version would be:

> The review may finish Thursday. We still have two open questions, and we have not agreed on a launch date.

Ask the assistant to rewrite the held-out piece using your card, then inspect the result yourself. Compare dates, quantities, commitments, and uncertainty before judging the voice. Also check whether the result sounds appropriate for its audience. A more personal tone is not automatically a better tone.

Save the card in a document you control. Give it to the assistant again when needed; naming it in one conversation does not establish a saved preset in another. Keep editing the card until its instructions help you express what you meant without changing what you know.
