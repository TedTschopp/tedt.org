---
layout: prompt-details
title: "Universal Content Creator - Variable Types Demo"
subtitle: "A comprehensive demonstration of all variable input types"
description: "This prompt demonstrates all supported variable types including text, textarea, number, select, radio, and checkbox inputs for dynamic content creation."
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
date: 2025-01-31
categories: [Prompts]
tags: 
  - Content Creation
  - Demo
  - Variables
  - Writing
  - Customization

models-supported: [gpt-4, gpt-4-turbo, gpt-3.5-turbo, gpt-4-mini, microsoft-copilot, github]
image: "/img/prompts/prompt-variable-demo.png"
image-alt: "A futuristic interface showing dynamic form elements and variables being processed"
image-credits-title: "Dynamic Prompt Variables Interface"
image-credits: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"

series:
  - step: 1
    title: "Content Planning"
    description: "Comprehensive content creation with all customization options"
    prompt_file: "2025-01-31-universal-content-creator-demo.md"
    current: true
  - step: 2
    title: "Content Critique"
    description: "Analyze and improve the generated content for quality and effectiveness"
    prompt_file: "2025-08-01-Critique-Content.md"

variables:
  - name: "topic"
    label: "Content Topic"
    type: "text"
    placeholder: "Enter the main topic for your content"
    required: true
    default: "artificial intelligence"
    help: "The primary subject matter for your content"

  - name: "content_description"
    label: "Detailed Description"
    type: "textarea"
    placeholder: "Provide a detailed description of what you want to cover..."
    required: false
    rows: 4
    default: "A comprehensive overview covering key concepts, practical applications, and future implications"
    help: "Optional: Add more specific details about your content requirements"

  - name: "target_audience"
    label: "Target Audience"
    type: "select"
    options: 
      - "general public"
      - "students"
      - "professionals"
      - "experts"
      - "beginners"
      - "intermediate learners"
      - "advanced practitioners"
    default: "general public"
    required: true
    help: "Who is the intended audience for this content?"

  - name: "content_length"
    label: "Content Length (words)"
    type: "number"
    min: 100
    max: 5000
    step: 50
    default: 800
    required: true
    help: "Approximate word count for the final content"

  - name: "writing_style"
    label: "Writing Style"
    type: "radio"
    options:
      - "formal"
      - "conversational"
      - "academic"
      - "journalistic"
      - "creative"
    default: "conversational"
    required: true
    help: "Choose the tone and approach for your content"

  - name: "content_features"
    label: "Include These Features"
    type: "checkbox"
    options:
      - "examples"
      - "statistics"
      - "expert quotes"
      - "case studies"
      - "actionable tips"
      - "future predictions"
      - "historical context"
      - "visual descriptions"
    default: ["examples", "actionable tips"]
    required: false
    help: "Select which elements to include in your content"

  - name: "format_type"
    label: "Content Format"
    type: "select"
    options:
      - "blog post"
      - "article"
      - "report"
      - "guide"
      - "tutorial"
      - "review"
      - "analysis"
    default: "blog post"
    required: true
    help: "What type of content format do you need?"

  - name: "urgency_level"
    label: "Priority Level"
    type: "radio"
    options:
      - "low"
      - "medium"
      - "high"
      - "urgent"
    default: "medium"
    required: false
    help: "How quickly do you need this content?"

prompt_content: |
  Create a comprehensive {{format_type}} about {{topic}} for {{target_audience}}.

  **Content Requirements:**
  - Topic: {{topic}}
  - Target Audience: {{target_audience}}
  - Content Length: Approximately {{content_length}} words
  - Writing Style: {{writing_style}}
  - Format: {{format_type}}
  - Priority: {{urgency_level}} priority

  **Detailed Description:**
  {{content_description}}

  **Include These Features:**
  {{content_features}}

  **Instructions:**
  1. Research the topic thoroughly and ensure accuracy
  2. Structure the content logically with clear headings and subheadings
  3. Write in a {{writing_style}} style appropriate for {{target_audience}}
  4. Include relevant examples and practical applications
  5. Ensure the content is engaging and informative
  6. Add a compelling introduction and strong conclusion
  7. Include actionable takeaways where appropriate

  **Additional Guidelines:**
  - Use clear, concise language
  - Include transition sentences between sections
  - Optimize for readability and engagement
  - Fact-check all claims and statistics
  - Consider SEO best practices if this is for web publication

  Please provide a well-structured, informative {{format_type}} that meets these specifications.
---

This prompt demonstrates all available variable types in the dynamic prompt system:

1. **Text Input** - For simple text values like topics
2. **Textarea** - For longer descriptions and detailed requirements  
3. **Number Input** - For numeric values with validation (word count)
4. **Select Dropdown** - For single-choice selections from predefined options
5. **Radio Buttons** - For single-choice selections with visible options
6. **Checkboxes** - For multiple selections from a list of features

The prompt dynamically updates as you fill in the variables, allowing you to see exactly how your customized prompt will look before copying or sending it to an AI provider.

## Features Demonstrated

- **Real-time Preview** - See your prompt update as you type
- **Validation** - Required fields are validated before submission
- **Default Values** - Pre-populated with sensible defaults
- **Help Text** - Guidance for each variable
- **Reset Functionality** - Easily return to default values
- **Copy/Download** - Get your customized prompt for use
- **AI Provider Integration** - Send directly to ChatGPT, Microsoft Copilot, GitHub Copilot, etc.

This system makes prompts more accessible and user-friendly while maintaining the flexibility needed for different use cases and audiences.
