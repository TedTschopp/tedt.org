---
layout: prompt-details
title: "Cross-Platform Social Media Repurposing Template"
description: "A structured, platform-aware markdown framework to repurpose blog content for LinkedIn, Instagram, Threads, Mastodon, and more—tailored to match tone, format, and audience expectations."
permalink: /prompts/social-media-repurposing-template/
tags: [content-strategy, social-media]
categories: [Prompts]

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
  - 03
  - 04-mini
  - 04-mini-high

mastodon-post-id: 
---
You are a cross-platform content strategist. I will provide you with a blog post including a title, subtitle, body content, and (optionally) a description of an accompanying image. Your task is to rewrite the content for the following platforms:

1. 🐘 Mastodon
2. 💼 LinkedIn
3. 🧵 Viva Engage / Yammer
4. 🌤️ Bluesky
5. 💬 Microsoft Teams
6. 📬 Email Newsletter
7. 🎬 YouTube Shorts / TikTok / Instagram Reels
8. 📸 Instagram (Feed Post)
9. 🌐 Facebook
10. 🧵 Threads
11. 🎧 Podcast
12. 🪵 Markdown Output (this one)

Each output should reflect the tone, structure, and audience expectations of that platform. Follow the guidance below for each section, and return the final result as a clean, structured **Markdown file** with each platform labeled.

---

### Input

**Title**: `{{Insert your blog post title here}}`
**Subtitle**: `{{Insert subtitle or subheading here}}`
**Body**:

{{Insert full blog post body here}}

**Image Description (optional)**:
`{{Describe the image if used, for alt-text and captions}}`

---

### Output Requirements (Markdown Format)

Return a single markdown file with this structure:

# Social Media Repurposing for "{{Title}}"

## 🐘 Mastodon

* **Post**:
  {Max 500 characters. Thoughtful, reflective tone. No marketing lingo. Echo poetic or philosophical phrasing if found.}
* **Hashtags**:
  {1–3 values-based hashtags}
* **Image Caption**:
  {Simple, grounded caption}
* **Alt Text**:
  {Plain-language visual description}

---

## 💼 LinkedIn

* **Post**:
  {Max 700 characters. Start with a hook from the title/subtitle. End with a question or invitation to engage.}
* **Hashtags**:
  {Up to 3, industry relevant}
* **Image Caption**:
  {Professional caption tying image to workplace themes}
* **Alt Text**:
  {Clear, business-appropriate alt-text}

---

## 🧵 Viva Engage (Yammer)

* **Post**:
  {Max 500 characters. Friendly, internal tone. Focus on collaboration, reflection, and real talk. Encourage engagement.}
* **Image Caption**:
  {Tied to team or shared insight}
* **Alt Text**:
  {Brief, clarity-first description}

---

## 🌤️ Bluesky

* **Post**:
  {Max 300 characters. Indie, clever, a bit philosophical or subversive. Quote or reframe the core insight. No hashtags.}
* **Image Caption**:
  {Playful, understated, or ironic}
* **Alt Text**:
  {Short, expressive, plain-spoken}

---

## 💬 Microsoft Teams

* **Post**:
  {Max \~400 characters. Internal tone. Reflective, actionable. Pose a light question or prompt around how this could apply in a work context.}
* **Image Caption**:
  {Straightforward, low-friction}
* **Alt Text**:
  {Plain, useful description for accessibility}

---

## 📬 Email Newsletter

* **Subject Line**:
  {Catchy but sincere subject line}
* **Header**:
  {Short, punchy summary or alternate title}
* **Body**:
  {Write in first-person. Include an intro, brief story or framing, and CTA with link back to the blog post. Invite reply.}
* **CTA**:
  {What do you want readers to do?}

---

## 🎬 YouTube Shorts / TikTok / Instagram Reels

* **Script**:
  {30–60 second script, spoken aloud. Conversational tone. Light smile. Pause for rhythm. Delivered to camera or mic.}
* **Caption**:
  {Concise summary of idea, fit for subtitles or text overlay}
* **Hashtags** (if applicable):
  {Optional: #TeamCulture #WorkplaceTruths #AgileMindset etc.}

---

## 📸 Instagram (Feed Post)

* **Post**:
  {Max 2,200 characters. Aesthetic and inspirational. Tell a micro-story or highlight a single insight. Use emoji lightly. End with a CTA.}
* **Hashtags**:
  {5–10 relevant and discoverable tags}
* **Image Caption**:
  {Artful or insightful caption}
* **Alt Text**:
  {Emotionally descriptive visual description}

---

## 🌐 Facebook

* **Post**:
  {Max 600 characters. Friendly and personal tone. Clear takeaway. Can include a light call-to-action like “Share if you agree” or “Tag someone who needs this.”}
* **Hashtags**:
  {Optional: general and community tags}
* **Image Caption**:
  {Relatable and warm}
* **Alt Text**:
  {Accessible and inclusive description}

---

## 🧵 Threads

* **Post**:
  {1–2 sentence insight or question. Friendly, snappy, curious. Can be followed up with a thread if longer.}
* **Hashtags**:
  {1–3 conversational or trending tags}
* **Image Caption**:
  {Smart or emotional tone}
* **Alt Text**:
  {Clear, with a human-centered focus}

---

## 🎧 Podcast

* **Script**:
  {3–5 minute script written for two people, spoken aloud. Conversational tone. Light smile. Pause for rhythm. Delivered to camera or mic.}
* **Caption**:
  {Concise summary of idea, fit for subtitles or text overlay}
* **Hashtags** (if applicable):
  {Optional: #TeamCulture #WorkplaceTruths #AgileMindset etc.}

---

## 🪵 Markdown Output

* **Post**:
  {Cleanly formatted summary of key ideas in Markdown. Use headings, lists, and links where helpful. Ideal for static site or documentation.}

---
