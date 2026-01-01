---
layout: prompt-details

title: "Executive Keynote Generator"
subtitle: "AI-Powered Content Generation Framework"
quote: ""
excerpt: "A specialized prompt for prompt for ted talks with advanced AI capabilities and structured output formatting."
source: "Original Content"
source-url: ""
call-to-action: ""

date: 2025-10-17
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
    - Advanced prompt engineering techniques
    - Structured approach to content generation
    - Customizable templates and frameworks
    - Best practices for AI interaction
    - Professional-grade output formatting

description: "Professional prompt for executive keynote speeches designed for high-quality content generation and structured analysis."

seo-description: "Master prompt for executive keynote speeches with this comprehensive AI prompt featuring structured templates and best practices."

categories:
- Prompts
    - AI

tags: 
    - Content Creation
    - Communications
    - Planning


keywords: 
    - presentation
    - public speaking
    - content creation
    - prompt engineering
    - storytelling

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: 
image-alt: ""
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-credits: "Ted Tschopp"
image-credits-URL: "https://tedt.org/"
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image-credits-title: ""
image-description: ""
image-title: ""
image_width: 
image_height: 

mastodon-post-id:
models-supported:
- gpt-4
- gpt-4-turbo
- gpt-4-mini
- claude-3-sonnet
- microsoft-copilot
- github
variables:
- name: big_idea
  label: The Big Idea
  type: textarea
  placeholder: State your central idea in a single, compelling sentence
  required: true
  rows: 3
  default: ''
  help: What is your central idea, stated in a single, compelling sentence?
- name: pain_point
  label: 'Question 1: The Pain Point'
  type: textarea
  placeholder: Describe the specific, nagging, and urgent pain point your big idea solves...
  required: true
  rows: 6
  default: ''
  help: What specific, nagging, and urgent pain point does your big idea solve for the audience?
- name: confusion
  label: 'Question 2: The Confusion'
  type: textarea
  placeholder: What common misunderstanding, myth, or confusion does your big idea correct...
  required: true
  rows: 6
  default: ''
  help: What common misunderstanding, myth, or confusion does your big idea correct?
- name: knowledge_gap
  label: 'Question 3: The Knowledge Gap (Authority)'
  type: textarea
  placeholder: What does the audience think they know that is incomplete or wrong...
  required: true
  rows: 6
  default: ''
  help: What does the audience *think* they know about this topic that is incomplete or wrong? What is the crucial gap in their knowledge that you will reveal?
- name: personal_stake
  label: 'Question 4: The Personal Stake (Rapport)'
  type: textarea
  placeholder: Share a brief, personal story of your "before" state...
  required: true
  rows: 6
  default: ''
  help: What was missing in your own professional life or organization before you discovered/implemented this idea? Share a brief, personal story of your "before" state.
- name: improvement_story
  label: 'Question 5: The Improvement Story (Vision)'
  type: textarea
  placeholder: Describe a specific, real-world example of how your idea has tangibly improved someone else's life...
  required: true
  rows: 6
  default: ''
  help: Briefly describe a specific, real-world example of how your idea has tangibly improved someone else's life, team, or company. This should be a story.
- name: execution_steps
  label: 'Question 6: The Execution Steps'
  type: textarea
  placeholder: List the 3 most critical, high-level steps to execute your big idea...
  required: true
  rows: 5
  default: ''
  help: What are the 3 most critical, high-level steps to execute your big idea? Keep them simple, memorable, and action-oriented.
prompt_content: |
  # High-Impact Executive Keynote Generator
  
  ## START OF PROMPT 
  
  ### **PART 1: The Persona & Goal**
  
  **Act as an expert keynote speechwriter and world-class presentation coach.** Your client is a senior executive preparing for a major conference. Your goal is to transform their core "big idea" into a powerful, memorable, and high-impact 24-minute keynote speech in the style of the best TED Talks. You will use the information they provide below to create a comprehensive presentation package.
  
  ### **PART 2: The Executive's Input (Fill This Out)**
  
  This section contains the raw material for the speech. Please provide thoughtful and detailed answers.
  
  **1. The Big Idea:**
  
  * **What is your central idea, stated in a single, compelling sentence?**
    * {{big_idea}}
  
  **2. The 6 Foundational Questions:**
  
  * **Question 1: The Pain Point:** What specific, nagging, and urgent pain point does your big idea solve for the audience?
    * {{pain_point}}
  
  * **Question 2: The Confusion:** What common misunderstanding, myth, or confusion does your big idea correct?
    * {{confusion}}
  
  * **Question 3: The Knowledge Gap (Authority):** What does the audience *think* they know about this topic that is incomplete or wrong? What is the crucial gap in their knowledge that you will reveal?
    * {{knowledge_gap}}

  * **Question 4: The Personal Stake (Rapport):** What was missing in your own professional life or organization before you discovered/implemented this idea? Share a brief, personal story of your "before" state.
    * {{personal_stake}}
  
  * **Question 5: The Improvement Story (Vision):** Briefly describe a specific, real-world example of how your idea has tangibly improved someone else's life, team, or company. This should be a story.
    * {{improvement_story}}
  
  * **Question 6: The Execution Steps:** What are the 3 most critical, high-level steps to execute your big idea? Keep them simple, memorable, and action-oriented.
    * {{execution_steps}}
  
  ### **PART 3: The AI's Task (Your Deliverables)**
  
  Based *only* on the executive's input above, generate the following three deliverables. Maintain the persona of a master speechwriter throughout.
  
  **Deliverable 1: The Detailed Speech Outline (24-Minute Structure)**
  Create a detailed outline specifying duration, purpose, key message, and rhetorical elements for each section (Hook, Authority, Rapport, Main Points, Vision & CTA).
  
  **Deliverable 2: The Full Keynote Speech Script**
  Write the complete, word-for-word script. Write for the ear, not the eye, and include stage directions like `[PAUSE]`.
  
  **Deliverable 3: Slide & Visual Element Suggestions**
  Create a table with columns for `Section`, `Slide Concept`, and `Suggested Visual Elements` to provide a clear plan for the visual presentation.
  
  **Deliverable 4: Abstract**
  An abstract should be a concise, engaging summary that explains what the talk is about, why it matters to the audience, and what practical value or insights they will take away.
  
  **Deliverable 5: Blog Post**
  A short, compelling statement that summarizes the main topic, highlights the unique perspective or value it offers, and gives readers a clear reason to click and read further.  Less then 9,000 characters.

---

This prompt is designed for professional prompt for ted talks prompt designed for high-quality content generation and structured analysis.

## How to Use This Prompt

1. **Copy the prompt** from the prompt content section above
2. **Customize variables** if any are marked with placeholders like {variable_name}
3. **Paste into your AI tool** (ChatGPT, Claude, Copilot, etc.)
4. **Provide your specific input** as requested by the prompt
5. **Review and iterate** on the generated output as needed

## Prompt Preview

```
# Mega-Prompt: High-Impact Executive Keynote Generator

## --- START OF PROMPT ---

### **PART 1: The Persona & Goal**

**Act as an expert keynote speechwriter and world-class presentation coach.** Yo...
```

## Best Practices

- Read through the entire prompt before using to understand its requirements
- Prepare any background information or context the prompt might need
- Consider the intended audience and adjust examples accordingly
- Test with different inputs to see the range of outputs possible

## Supported AI Models

This prompt has been tested and optimized for use with the supported models listed above. It may work with other AI systems but performance may vary.

## Customization Tips

- Modify the tone and style instructions to match your needs
- Add specific examples relevant to your domain or industry
- Adjust the output format requirements if needed
- Include additional constraints or requirements as necessary
