---
layout: prompt-details
title: "Simple Blog Post Generator"
subtitle: "Basic example with essential variables"
description: "A straightforward blog post generator demonstrating basic variable functionality."
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
date: 2025-01-31
categories: [Prompts]
tags: 
  - Content Creation
  - Writing
  - Communications
keywords:
  - content creation
  - content writing
  - copywriting
  - prompt engineering
  - prompt templates
bullets:
  - Basic variable functionality demonstration
  - Generates 500-800 word blog posts
  - Customizable topic, audience, and tone
models-supported: [gpt-4, gpt-4-mini, microsoft-copilot, github]

series:
  - step: 1
    title: "Content Generation"
    description: "Create initial blog post content based on your topic and audience"
    prompt_file: "2025-01-31-simple-blog-generator.md"
    current: true
  - step: 2
    title: "Content Critique"
    description: "Analyze and improve the generated content for quality and effectiveness"
    prompt_file: "2025-08-01-Critique-Content.md"

variables:
  - name: "blog_topic"
    label: "Blog Topic"
    type: "text"
    placeholder: "What do you want to write about?"
    required: true
    default: "productivity tips"

  - name: "audience"
    label: "Target Audience"
    type: "select"
    options: 
      - "professionals"
      - "students"
      - "general readers"
    default: "professionals"
    required: true

  - name: "tone"
    label: "Writing Tone"
    type: "radio"
    options:
      - "formal"
      - "casual"
      - "inspirational"
    default: "casual"

prompt_content: |
  Write a blog post about {{blog_topic}} for {{audience}} using a {{tone}} tone.

  The blog post should:
  - Be engaging and informative
  - Include an attention-grabbing headline
  - Have a clear introduction, body, and conclusion
  - Be approximately 500-800 words
  - Include practical tips or insights
  - End with a call-to-action

  Please make it relevant and valuable for {{audience}}.
---

This is a simple example demonstrating the basic variable functionality. Fill in the variables above to customize this blog post prompt for your specific needs.

The variables will replace the placeholders in the prompt text, giving you a personalized prompt for generating blog content.
