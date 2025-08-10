---
layout: prompt-details
title: Cross-Platform Social Media Repurposing Template
description: "A structured, platform-aware markdown framework to repurpose blog content\
  \ for LinkedIn, Instagram, Threads, Mastodon, and more\u2014tailored to match tone,\
  \ format, and audience expectations."
permalink: /prompts/social-media-repurposing-template/
categories:
- Prompts
tags:
- Content Strategy
- Social Media
mastodon-post-id: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
date: 2025-05-03
keywords:
- content strategy
- platform repurposing
- prompt template
- markdown
- AI tools
- social media copy
- tone adaptation
- audience engagement
- LinkedIn writing
- Threads content
- Mastodon post
- Instagram feed
- YouTube Shorts
- TikTok captions
- email newsletter
- multi-platform strategy
- writing prompts
- enterprise communication
- thought leadership
models-supported:
- gpt-4
- gpt-4-mini
- gpt-4.5
- 3
- 04-mini
- 04-mini-high
- microsoft-copilot
- github
prompt_content: "You are a cross-platform content strategist. I will provide you with\
  \ a blog post including a title, subtitle, body content, and (optionally) a description\
  \ of an accompanying image. Your task is to rewrite the content for the following\
  \ platforms:\n\n1. \U0001F418 Mastodon\n2. \U0001F4BC LinkedIn\n3. \U0001F9F5 Viva\
  \ Engage / Yammer\n4. \U0001F324\uFE0F Bluesky\n5. \U0001F4AC Microsoft Teams\n\
  6. \U0001F4EC Email Newsletter\n7. \U0001F3AC YouTube Shorts / TikTok / Instagram\
  \ Reels\n8. \U0001F4F8 Instagram (Feed Post)\n9. \U0001F310 Facebook\n10. \U0001F9F5\
  \ Threads\n11. \U0001F3A7 Podcast\n12. \U0001FAB5 Markdown Output (this one)\n\n\
  Each output should reflect the tone, structure, and audience expectations of that\
  \ platform. Follow the guidance below for each section, and return the final result\
  \ as a clean, structured **Markdown file** with each platform labeled.\n\n### Input\n\
  \n**Title**: `{{Insert your blog post title here}}`\n**Subtitle**: `{{Insert subtitle\
  \ or subheading here}}`\n**Body**:\n\n{{Insert full blog post body here}}\n\n**Image\
  \ Description (optional)**:\n`{{Describe the image if used, for alt-text and captions}}`\n\
  \n### Output Requirements (Markdown Format)\n\nReturn a single markdown file with\
  \ this structure:\n\n# Social Media Repurposing for \"{{Title}}\"\n\n## \U0001F418\
  \ Mastodon\n\n* **Post**:\n  {Max 500 characters. Thoughtful, reflective tone. No\
  \ marketing lingo. Echo poetic or philosophical phrasing if found.}\n* **Hashtags**:\n\
  \  {1\u20133 values-based hashtags}\n* **Image Caption**:\n  {Simple, grounded caption}\n\
  * **Alt Text**:\n  {Plain-language visual description}\n\n## \U0001F4BC LinkedIn\n\
  \n* **Post**:\n  {Max 700 characters. Start with a hook from the title/subtitle.\
  \ End with a question or invitation to engage.}\n* **Hashtags**:\n  {Up to 3, industry\
  \ relevant}\n* **Image Caption**:\n  {Professional caption tying image to workplace\
  \ themes}\n* **Alt Text**:\n  {Clear, business-appropriate alt-text}\n\n## \U0001F9F5\
  \ Viva Engage (Yammer)\n\n* **Post**:\n  {Max 500 characters. Friendly, internal\
  \ tone. Focus on collaboration, reflection, and real talk. Encourage engagement.}\n\
  * **Image Caption**:\n  {Tied to team or shared insight}\n* **Alt Text**:\n  {Brief,\
  \ clarity-first description}\n\n## \U0001F324\uFE0F Bluesky\n\n* **Post**:\n  {Max\
  \ 300 characters. Indie, clever, a bit philosophical or subversive. Quote or reframe\
  \ the core insight. No hashtags.}\n* **Image Caption**:\n  {Playful, understated,\
  \ or ironic}\n* **Alt Text**:\n  {Short, expressive, plain-spoken}\n\n## \U0001F4AC\
  \ Microsoft Teams\n\n* **Post**:\n  {Max \\~400 characters. Internal tone. Reflective,\
  \ actionable. Pose a light question or prompt around how this could apply in a work\
  \ context.}\n* **Image Caption**:\n  {Straightforward, low-friction}\n* **Alt Text**:\n\
  \  {Plain, useful description for accessibility}\n\n## \U0001F4EC Email Newsletter\n\
  \n* **Subject Line**:\n  {Catchy but sincere subject line}\n* **Header**:\n  {Short,\
  \ punchy summary or alternate title}\n* **Body**:\n  {Write in first-person. Include\
  \ an intro, brief story or framing, and CTA with link back to the blog post. Invite\
  \ reply.}\n* **CTA**:\n  {What do you want readers to do?}\n\n## \U0001F3AC YouTube\
  \ Shorts / TikTok / Instagram Reels\n\n* **Script**:\n  {30\u201360 second script,\
  \ spoken aloud. Conversational tone. Light smile. Pause for rhythm. Delivered to\
  \ camera or mic.}\n* **Caption**:\n  {Concise summary of idea, fit for subtitles\
  \ or text overlay}\n* **Hashtags** (if applicable):\n  {Optional: #TeamCulture #WorkplaceTruths\
  \ #AgileMindset etc.}\n\n## \U0001F4F8 Instagram (Feed Post)\n\n* **Post**:\n  {Max\
  \ 2,200 characters. Aesthetic and inspirational. Tell a micro-story or highlight\
  \ a single insight. Use emoji lightly. End with a CTA.}\n* **Hashtags**:\n  {5\u2013\
  10 relevant and discoverable tags}\n* **Image Caption**:\n  {Artful or insightful\
  \ caption}\n* **Alt Text**:\n  {Emotionally descriptive visual description}\n\n\
  ## \U0001F310 Facebook\n\n* **Post**:\n  {Max 600 characters. Friendly and personal\
  \ tone. Clear takeaway. Can include a light call-to-action like \"Share if you agree\"\
  \ or \"Tag someone who needs this.\"}\n* **Hashtags**:\n  {Optional: general and\
  \ community tags}\n* **Image Caption**:\n  {Relatable and warm}\n* **Alt Text**:\n\
  \  {Accessible and inclusive description}\n\n## \U0001F9F5 Threads\n\n* **Post**:\n\
  \  {1\u20132 sentence insight or question. Friendly, snappy, curious. Can be followed\
  \ up with a thread if longer.}\n* **Hashtags**:\n  {1\u20133 conversational or trending\
  \ tags}\n* **Image Caption**:\n  {Smart or emotional tone}\n* **Alt Text**:\n  {Clear,\
  \ with a human-centered focus}\n\n## \U0001F3A7 Podcast\n\n* **Script**:\n  {7\u2013\
  10 minute script written for two people, spoken aloud. Conversational tone. Light\
  \ smile. Pause for rhythm. Delivered to camera or mic.}\n* **Caption**:\n  {Concise\
  \ summary of idea, fit for subtitles or text overlay}\n* **Hashtags** (if applicable):\n\
  \  {Optional: #TeamCulture #WorkplaceTruths #AgileMindset etc.}\n\n## \U0001FAB5\
  \ Markdown Output\n\n* **Post**:\n  {Cleanly formatted summary of key ideas in Markdown.\
  \ Use headings, lists, and links where helpful. Ideal for static site or documentation.}\n"
image: /img/prompts/Cross-Platform-Content.png
image-alt: Illustration of social media icons scattered across a dark, textured surface
  with a dramatic depth-of-field effect.
image-description: A dynamic visual representation featuring various social media
  platform icons, including LinkedIn, YouTube, Pinterest, Twitter, and Facebook, dispersed
  across a dark, textured background. The icons appear as circular, glossy bubbles
  of different colors and sizes, rendered with a shallow depth of field, giving the
  impression of interconnectedness and highlighting cross-platform social media strategies.
image-title: Unified Social Media Presence Across Platforms
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image_width: 1456
image_height: 816
---
This Cross-Platform Social Media Repurposing Template empowers content creators and marketers by providing a structured markdown framework for adapting blog content across multiple social media platforms, including LinkedIn, Instagram, Threads, Mastodon, YouTube Shorts, TikTok, and more. It ensures each post matches the unique tone, format, and audience expectations of its intended platform, enhancing engagement and reach.

### How to Use This Prompt

1. **Initialization:** Activate the prompt in your chosen LLM-compatible interface.
2. **Provide Content:** Input your blog post title, subtitle, body content, and optionally, an image description.
3. **Generate Content:** Run the prompt to receive tailored content outputs for each platform, formatted in Markdown.
4. **Review and Adjust:** Verify and fine-tune the generated outputs for tone and audience alignment before posting.
5. **Publish:** Distribute the optimized content across your selected social media platforms.