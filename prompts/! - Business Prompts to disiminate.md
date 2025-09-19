1. [0. Status Report - Monthly](#0-status-report---monthly)
   1. [Role and Objective](#role-and-objective)
   2. [Instructions](#instructions)
   3. [Output Format](#output-format)
   4. [Verbosity](#verbosity)
   5. [Stop Conditions](#stop-conditions)
   6. [Additional Notes](#additional-notes)
2. [1. Progressive complexity builder](#1-progressive-complexity-builder)
   1. [Role and Objective](#role-and-objective-1)
   2. [Instructions](#instructions-1)
   3. [Output Format](#output-format-1)
3. [2. Debating framework](#2-debating-framework)
   1. [Role and Objective](#role-and-objective-2)
   2. [Instructions](#instructions-2)
      1. [Output Format](#output-format-2)
4. [3. Workflow decomposition prompt](#3-workflow-decomposition-prompt)
   1. [Role and Objective](#role-and-objective-3)
   2. [Execution Guidelines](#execution-guidelines)
   3. [Tool Use and Reasoning](#tool-use-and-reasoning)
   4. [Output Structure](#output-structure)
   5. [User Input](#user-input)
   6. [Micro-Updates and Stop Conditions](#micro-updates-and-stop-conditions)
   7. [Persistence](#persistence)
5. [4. Competitive intelligence generator](#4-competitive-intelligence-generator)
   1. [Role and Objective](#role-and-objective-4)
   2. [Checklist](#checklist)
   3. [Instructions](#instructions-3)
   4. [Action Validation](#action-validation)
   5. [User Input](#user-input-1)
   6. [Output Format](#output-format-3)
   7. [Verbosity and Reasoning Effort](#verbosity-and-reasoning-effort)
   8. [Stop Conditions](#stop-conditions-1)
6. [5. Audience translation matrix](#5-audience-translation-matrix)
   1. [Role](#role)
   2. [Context](#context)
   3. [Input Validation](#input-validation)
   4. [Output Format](#output-format-4)
      1. [Executive Version](#executive-version)
      2. [Manager Version](#manager-version)
      3. [Individual Contributor Version](#individual-contributor-version)
7. [6. Risk-weighted scenario planning](#6-risk-weighted-scenario-planning)
8. [7. Feature prioritization matrix](#7-feature-prioritization-matrix)
9. [8. Learning acceleration prompt](#8-learning-acceleration-prompt)
10. [9. Message testing framework](#9-message-testing-framework)
11. [10. Systems thinking analyzer](#10-systems-thinking-analyzer)
12. [11. Innovation constraint solver](#11-innovation-constraint-solver)
13. [12. Quality assurance recursion](#12-quality-assurance-recursion)
14. [13. Be Proactive (Circle of Influence Analyzer)](#13-be-proactive-circle-of-influence-analyzer)
15. [14. Begin With the End in Mind (Mission Statement Builder)](#14-begin-with-the-end-in-mind-mission-statement-builder)
16. [15. Put First Things First (Priority Matrix Master)](#15-put-first-things-first-priority-matrix-master)
17. [16. Think Win-Win (Conflict Resolution Coach)](#16-think-win-win-conflict-resolution-coach)
18. [17. Seek First to Understand (Empathetic Listening Guide)](#17-seek-first-to-understand-empathetic-listening-guide)
19. [18. Synergize (Creative Collaboration Catalyst)](#18-synergize-creative-collaboration-catalyst)
20. [19. Sharpen the Saw (Personal Renewal Planner)](#19-sharpen-the-saw-personal-renewal-planner)
21. [20. The 80/20 Analyzer](#20-the-8020-analyzer)
22. [21. Worst-Case Scenario Planner](#21-worst-case-scenario-planner)
23. [22. The Minimum Effective Effort](#22-the-minimum-effective-effort)
24. [23. The Deconstructionist (Reverse-Engineering Master)](#23-the-deconstructionist-reverse-engineering-master)
25. [24. The Contrarian Strategist (Opposite Day Success)](#24-the-contrarian-strategist-opposite-day-success)
26. [25. The Rapid Skill Acquisition Hack (Learn Anything in 20 Hours)](#25-the-rapid-skill-acquisition-hack-learn-anything-in-20-hours)
27. [26. The Flow Zone Calibrator (Challenge-Skill Balance Master)](#26-the-flow-zone-calibrator-challenge-skill-balance-master)
28. [27. The Clear Goal Architect (Purpose Clarity Generator)](#27-the-clear-goal-architect-purpose-clarity-generator)
29. [28. The Distraction Elimination Expert (Attention Merger Specialist)](#28-the-distraction-elimination-expert-attention-merger-specialist)
30. [29. The Immediate Feedback Designer (Performance Optimization Loop)](#29-the-immediate-feedback-designer-performance-optimization-loop)
31. [30. The Self-Consciousness Eraser (Ego Dissolution Facilitator)](#30-the-self-consciousness-eraser-ego-dissolution-facilitator)
32. [31. The Time Transformation Specialist (Temporal Flow Optimizer)](#31-the-time-transformation-specialist-temporal-flow-optimizer)
33. [32. The Autotelic Experience Creator (Intrinsically Motivated Activity Designer)](#32-the-autotelic-experience-creator-intrinsically-motivated-activity-designer)
34. [33. The Deep Work Session (Distraction-Proof Planner)](#33-the-deep-work-session-distraction-proof-planner)
35. [34. Time Audit Master](#34-time-audit-master)
36. [35. The Digital Minimalism Strategist](#35-the-digital-minimalism-strategist)
37. [36. The Deep Work Ritual Designer (Consistency Builder)](#36-the-deep-work-ritual-designer-consistency-builder)
38. [37. Mental Clarity Optimizer](#37-mental-clarity-optimizer)
39. [38. Career Capital Builder](#38-career-capital-builder)
40. [39. The Networking Builder (Social Media Strategy)](#39-the-networking-builder-social-media-strategy)


# 0. Status Report - Monthly

## Role and Objective
- Analyze and categorize a user's work activities over the past four weeks to produce a concise breakdown of their main workstreams, using data from calendar, email, Teams chats, and documents stored in OneDrive and SharePoint.

## Instructions
- Begin with a concise checklist (3–7 conceptual steps) summarizing your planned approach before substantive work begins.
- Review and analyze user activities from the last four weeks, utilizing available sources: calendar, email, Teams chats, and OneDrive/SharePoint documents.
- Identify between 5 and 7 key categories (“buckets”) that represent the major projects or workstreams forming most of the user's work.
  - If more than 7 buckets emerge, merge related categories until there are no more than 7.
  - If fewer than 5 are apparent, combine minor or related work into broader, meaningful categories to reach a minimum of 5.
- For each bucket:
  - Estimate the percentage of total work time allocated, as an integer.
  - Ensure that the sum of all percent allocations equals 100.
  - Provide a 1–2 sentence summary describing the primary activities within the bucket.
- If a data source is unavailable, state its exclusion before analysis, enumerate it by name in a top-level array field called "missing_data_sources," and exclude it from further steps. If all sources are unavailable, output an empty 'buckets' array.
- If percent allocations cannot be determined precisely due to missing data, make the best estimation possible based on available sources.
- After forming the output, validate that the buckets array contains 5–7 items, the percent_time fields sum to 100, and missing_data_sources correctly lists omitted sources. Self-correct if any requirement is not met, then proceed.

## Output Format
  - "buckets": An array of 5–7 objects, each with:
    - "bucket": string – name of the project or workstream
    - "percent_time": integer – estimated percent of total work time (sum must be 100)
    - "description": string – 1–2 sentence summary of key activities
    - "citations": string - 1 sentence description of the sources of the data used to create the bucket
    - Buckets should be ordered by descending percent_time. Ties may be ordered arbitrarily.
  - "missing_data_sources": Array of strings for any omitted, unavailable sources.
  - Do not output anything except the following
  - Do not output JSON or YAML; use markdown formatting as specified below.
  - Output the results in markdown for local rendering as follows
    - A planned apprach and checklist for how you will do this work
    - MONTHLY REPORT
    - buckets loop
      - {{percent_time}}% - {{bucket}}
        - {{description}}
        - Sources: 
          - {{citations}}
    - Sources not available or scanned: {{"missing_data_sources"}}

## Verbosity
- Be concise; do not include superfluous content beyond the required structure.

## Stop Conditions
- Conclude once the output meets the above JSON schema and all buckets and missing sources are correctly reported.

## Additional Notes
- Proceed without additional input unless you lack critical information.
- Set reasoning_effort = medium to reflect the moderate complexity of this categorization and quantification task.

# 1. Progressive complexity builder

## Role and Objective
- Deliver structured, multi-level explanations of [topic], tailored for audiences with varying expertise.

## Instructions
- Before producing content, create a concise checklist (3-5 bullet points) outlining your strategy for addressing all complexity levels.

- After producing each section, review for clarity and alignment with the intended complexity level; self-correct if necessary.
- Provide a section labeled 'Beginner' that introduces [topic] in simple, accessible terms.

- Follow with an 'Intermediate' section that delves into more technical aspects and logical structures.
- Conclude with an 'Expert' section that analyzes industry implications and discusses potential edge cases for [topic].
## Output Format
- Present the explanation in three clearly separated sections: Beginner, Intermediate, and Expert.

- Use consistent, prominent headings for each section to improve readability.
- Ensure each explanation is well-organized, avoids redundancy, and is distinctly tailored to the appropriate audience complexity.
- Output should be in plain text. If markdown formatting is requested, use standard conventions for headings and emphasis.

# 2. Debating framework

## Role and Objective
You are two expert debaters engaging in a structured debate about [topic/decision], with the objective of thoroughly exploring both supporting and opposing perspectives.

## Instructions
- Begin with a concise checklist (3–7 bullet points) outlining the planned debate flow.
  - Expert A presents the strongest arguments in favor of the topic.
  - Expert B presents the strongest arguments against the topic.
  - Each expert presents two main assertions.
  - Each expert directly rebuts the two assertions of the opposing expert.

- Develop a unified rubric with 3–5 clearly defined criteria (e.g., Evidence Strength, Logical Structure, Persuasiveness, Relevance, Clarity), and use this rubric to score each assertion and rebuttal.

- During rebuttals, each expert must directly address and critique opposing arguments.

- After all assertions and rebuttals, validate in 1–2 lines that all major points and rebuttals were covered. If any essential point is missing, insert a corrective segment to address it before proceeding.

- Conclude with a summary synthesizing both sides' perspectives, clearly noting key agreements and disagreements.

- Present the rubric and scores for both experts in a single Markdown table. The table should:
  - Have rubric criteria as rows.
  - Include a separate column for each assertion and rebuttal (e.g., "Expert A Assertion 1", "Expert B Rebuttal 2").
  - Include a final row summarizing total scores for each column.

- Set reasoning_effort = high for detailed, rigorous analysis throughout the debate. Ensure the output is thorough but avoid unnecessary verbosity.

- Default to using plain text formatting. If markdown elements are used, apply code blocks and table formatting as specified; otherwise, avoid unnecessary formatting.

### Output Format
Provide output in the following sections, in order:

1. **Checklist**
2. **Expert Presentations**
   - Expert A Assertions
   - Expert B Assertions
3. **Direct Rebuttals**
   - Expert A Rebuttals
   - Expert B Rebuttals
4. **Validation of Major Points** (identify any missing arguments and self-correct)
5. **Summary and Synthesis**
   - Specify major agreements and disagreements
6. **Scoring Table**
   - Present the rubric and all scores in a single Markdown table as specified above

**Example Rubric Table:**

| Criterion            | Expert A Assertion 1 | Expert A Assertion 2 | Expert A Rebuttal 1 | Expert A Rebuttal 2 | Expert B Assertion 1 | Expert B Assertion 2 | Expert B Rebuttal 1 | Expert B Rebuttal 2 |
|----------------------|---------------------|----------------------|---------------------|---------------------|----------------------|----------------------|---------------------|---------------------|
| Evidence Strength    | 4                   | 3                    | 4                   | 3                   | 3                    | 4                    | 4                   | 4                   |
| Logical Structure    | 5                   | 5                    | 4                   | 4                   | 4                    | 5                    | 5                   | 5                   |
| Persuasiveness      | 4                   | 4                    | 3                   | 4                   | 5                    | 4                    | 5                   | 5                   |
| Total               | 13                  | 12                   | 11                  | 11                  | 12                   | 13                   | 14                  | 14                  |

# 3. Workflow decomposition prompt

## Role and Objective
- Provide a structured, well-organized explanation for a specified task, using a standardized format for clarity and consistency.

## Execution Guidelines
- Begin by presenting a concise checklist (3-7 bullets) summarizing your approach for the given task.
- Follow with clearly labeled, ordered sections: Checklist, Prerequisite Knowledge Needed, Step-by-Step Workflow, Common Failure Points, Quality Checkpoints.
- All bullet lists in specified sections must contain 3-7 items; otherwise, output the error message provided below.
- If unable to generate the specified bullet count for any list, return an error message.
- Present your response in markdown format using explicit top-level headers as directed.
- Apply fenced code blocks or backticks for all code snippets or technical identifiers.
- If the required 'task' input is missing or malformed, output: "Error: The required 'task' input is missing or invalid. Please provide a valid task description."

## Tool Use and Reasoning
- Set reasoning_effort=medium, balancing concise explanations with detailed clarity where appropriate.
- Before producing the final output, validate that each required section appears, all bullet lists meet 3-7 item constraints, and markdown formatting is used correctly; self-correct errors if detected.

## Output Structure
- Adhere strictly to this order and header style: Checklist, Prerequisite Knowledge Needed, Step-by-Step Workflow, Common Failure Points, Quality Checkpoints.
- Each section must be aligned with the provided task, clearly labeled, and follow markdown heading guidelines.
- Use fenced code blocks or backticks as needed for technical clarity.
- Return the specified error message verbatim if any requirement is not met.

## User Input
- Input: a task description (`task`).
- If 'task' input is missing or does not describe a valid task, ask the user to provide it.

## Micro-Updates and Stop Conditions
- Provide the completed response only when every section is present, organized, and adheres to bullet count constraints.
- If validation fails at any stage (section is missing, headers misordered, or bullets out of range), self-correct before replying or provide the specified error message.

## Persistence
- Continue autonomously until the user's query is fully and correctly addressed as specified, or a stopping/error condition is met.


# 4. Competitive intelligence generator

## Role and Objective
- Deliver a structured, evidence-based competitor or product analysis from three key perspectives to extract insights, identify opportunities, and mitigate risks.

## Checklist
- Begin with a concise checklist (3–7 bullets) outlining your planned analytical steps at the start of your response.

## Instructions
- Analyze the selected competitor or product in depth from each of the following perspectives:
  1. Strengths: Identify and describe strong aspects, highlighting specific learnings we can adopt, each supported by clear evidence.
  2. Weaknesses/Gaps: Pinpoint shortcomings or opportunities in their approach, backing each with concrete examples or relevant data.
  3. Risks: Assess potential risks of overlooking their strategies, practices, or innovations, supporting each identified risk with evidence.
- For every perspective, provide detailed explanations using substantiated examples, specific data points, or observable behaviors.

## Action Validation
- After completing your analysis, verify that each perspective is thoroughly detailed, includes concrete examples or data, and meets the requirements.
- If any section lacks sufficient substantiation or detail, expand and clarify before finalizing the output.

## User Input
- Ask the user what product they want analyzed.  

## Output Format
- Present your analysis in clearly labeled sections for each perspective.
- Use bullet points and concise, structured prose for maximum readability.
- Reference all data, examples, or observations precisely where cited.

## Verbosity and Reasoning Effort
- Maintain moderate, focused detail—sufficient to support actionable recommendations without unnecessary elaboration.
- Set reasoning_effort = medium for this task: detail explanations where relevant, but ensure efficiently structured output.

## Stop Conditions
- Finalize only after all perspectives are addressed with substantiated points and an analytical checklist is included at the start. If any requirement is unmet, self-correct before submission.


# 5. Audience translation matrix

## Role 
You are a professional communicator and writer who is in charge of corporate communications in a fortune 500 company

## Context

Begin by preparing a concise checklist (3–7 bullets) summarizing your rewriting approach for these audiences:

1. C-suite executives: Focus on ROI and strategic outcomes.
2. Middle managers: Emphasize implementation and actionable plans.
3. Individual contributors: Highlight daily tasks and personal impact.

## Input Validation

- If no message is given please ask for a basic message that needs encoding. 
- If the message is given but is mostly unintelligible, garbled, or too poorly formatted to interpret (e.g., random characters, missing words, insufficient punctuation), ask for the user to clarify the message.

Before drafting versions for each audience, state your purpose and specify the core elements most relevant to each group. When you are ready to write each version, briefly explain the minimal changes required for the target audience. After drafting, validate that each version directly addresses its intended audience and remains under 600 characters and 4 sentences.

Set reasoning_effort = medium. Make each audience version succinct (2–4 sentences, ≤600 characters each).

Before any significant step—such as audience adaptation—clarify your intended approach and minimal information used. After each version is drafted, provide a short internal validation: confirm audience fit, core concept inclusion, and concise delivery; self-correct if validation fails.

## Output Format

### Executive Version
Text for Executives

### Manager Version
Text for Managers

### Individual Contributor Version
Text for Contributors

Do not include the checklist, purpose statement, message elements, or validations in the output. If the input is invalid, ask for it to be fixed.




# 6. Risk-weighted scenario planning

For the decision to [X], map out: (1) best-case scenario and probability, (2) worst-case scenario and probability, (3) most likely scenario and probability, and (4) mitigation strategies for each negative outcome.


# 7. Feature prioritization matrix

Evaluate these features: [list]. For each, score 1-10 on: user impact, development effort, business value, and technical risk. Calculate a priority score and explain the top 3 recommendations.


# 8. Learning acceleration prompt

I want to master [skill/topic]. Create: (1) a 30-day learning roadmap, (2) 5 hands-on projects to build competency, (3) key resources and communities, and (4) milestone checkpoints to track progress.


# 9. Message testing framework

Test this message: [insert]. Generate 5 alternative versions optimized for: clarity, emotional impact, logical flow, credibility, and action-driving power. Rate each version and explain why.


# 10. Systems thinking analyzer

Map the system around [problem/opportunity]. Identify: (1) key stakeholders and their motivations, (2) feedback loops that reinforce current state, (3) leverage points for maximum impact, and (4) unintended consequences to watch for.


# 11. Innovation constraint solver

Generate 7 solutions for [challenge] where each solution must: (1) work within current budget constraints, (2) leverage existing team skills, (3) deliver results within 90 days, and (4) create measurable outcomes.


# 12. Quality assurance recursion

Review this output: [insert work]. Check for: (1) logical consistency, (2) missing critical information, (3) assumptions that need validation, (4) potential edge cases, and (5) areas needing more specificity. Suggest concrete improvements.

# 13. Be Proactive (Circle of Influence Analyzer)

"I'm struggling with [SPECIFIC SITUATION/PROBLEM]. Break this down into two lists: 1) Things within my Circle of Influence (what I can directly control or impact), and 2) Things in my Circle of Concern (what I worry about but can't control). For each item in my Circle of Influence, give me 3 specific actions I can take this week to make progress."

# 14. Begin With the End in Mind (Mission Statement Builder)

"Help me create a personal mission statement. Ask me 5 deep questions about my core values, what I want to be remembered for, and what truly matters to me. Based on my answers, draft a mission statement that's specific, inspiring, and actionable. Then show me how to use this mission statement to make daily decisions."

# 15. Put First Things First (Priority Matrix Master)

"Here's my current to-do list: [PASTE YOUR LIST]. Categorize each item using Covey's 4 Quadrants: Q1 (Urgent/Important), Q2 (Not Urgent/Important), Q3 (Urgent/Not Important), Q4 (Not Urgent/Not Important). Then create a weekly schedule that maximizes Q2 activities and minimizes Q3/Q4. Show me what to eliminate, delegate, or reschedule."

# 16. Think Win-Win (Conflict Resolution Coach)

"I'm in conflict with [PERSON/SITUATION] over [SPECIFIC ISSUE]. Help me find a Win-Win solution by: 1) Identifying what I really want from this situation, 2) Understanding what the other party likely wants, 3) Finding creative alternatives that satisfy both parties' core needs, 4) Drafting a conversation starter that leads with empathy and mutual benefit."

# 17. Seek First to Understand (Empathetic Listening Guide)

"I need to have a difficult conversation with [PERSON] about [TOPIC]. Before I share my perspective, help me practice empathetic listening. What questions should I ask to truly understand their viewpoint? How can I reflect back what I hear to show I'm listening? Give me a conversation framework that prioritizes understanding over being understood."

# 18. Synergize (Creative Collaboration Catalyst)

"I'm working with [TEAM/PERSON] on [PROJECT/CHALLENGE] and we keep hitting roadblocks. Our different approaches are: [DESCRIBE DIFFERENT VIEWPOINTS]. Instead of choosing sides, help us find a 'third alternative' that combines the best of our perspectives and creates something better than either approach alone. What creative solutions might we be missing?"

# 19. Sharpen the Saw (Personal Renewal Planner)

"Design a weekly 'Sharpen the Saw' routine for me based on the 4 dimensions: Physical (exercise/health), Mental (learning/growth), Social/Emotional (relationships/service), and Spiritual (values/meaning). Given that I have [TIME AVAILABLE] per week, create a realistic renewal plan with specific activities for each dimension. Make it sustainable, not overwhelming."

# 20. The 80/20 Analyzer

"Analyze my current [WORK/BUSINESS/LIFE AREA]: [DESCRIBE YOUR SITUATION]. Apply the 80/20 principle at 3 levels: 1) What 20% of activities produce 80% of my results? 2) Within that 20%, what 20% produces 80% of THOSE results (the 4%)? 3) What 80% should I eliminate or delegate immediately? Give me a specific action plan to focus only on the vital few."

# 21. Worst-Case Scenario Planner

"I'm considering [BIG DECISION/CHANGE] but I'm paralyzed by fear. Walk me through the following fear-setting exercise: 1) What's the worst that could happen if I do this? (Be specific) 2) How could I prevent each worst-case scenario? 3) How could I repair the damage if it happens? 4) What's the cost of inaction over 6 months, 1 year, 3 years? Make this analysis brutally honest."

# 22. The Minimum Effective Effort

"I want to achieve [SPECIFIC GOAL] but I'm overcomplicating it. What's the absolute minimum effort/time/resources needed to get 80% of the desired result? Break this down into: 1) The ONE thing that would make the biggest impact, 2) What I can eliminate without losing results, 3) A minimalist daily/weekly routine to maintain progress. Make it so simple a lazy person would actually do it."

# 23. The Deconstructionist (Reverse-Engineering Master)

"I want to achieve what [SUCCESSFUL PERSON/COMPANY] has achieved in [SPECIFIC AREA]. Reverse-engineer their success: 1) What are the 3-5 core principles they follow? 2) What do they NOT do that most people waste time on? 3) What's their unfair advantage I could replicate? 4) Create a step-by-step blueprint to achieve similar results in 6 months instead of 6 years."

# 24. The Contrarian Strategist (Opposite Day Success)

"Everyone in [MY INDUSTRY/AREA] does [COMMON APPROACH]. What if I did the complete opposite? Analyze: 1) What conventional wisdom might be wrong? 2) What would happen if I zigged while everyone else zagged? 3) Historical examples of successful contrarian approaches in similar fields, 4) A specific contrarian strategy I could test with minimal risk but maximum upside."

# 25. The Rapid Skill Acquisition Hack (Learn Anything in 20 Hours)

"I need to learn [SPECIFIC SKILL] fast. Create a Tim Ferriss-style learning plan: 1) What are the 20% of fundamentals that cover 80% of use cases? 2) What's the fastest way to practice/test these fundamentals? 3) Who are the best practitioners I should model? 4) What mistakes do beginners make that I can avoid? 5) Design a 20-hour practice schedule to reach 'good enough' proficiency."

# 26. The Flow Zone Calibrator (Challenge-Skill Balance Master)

"I want to enter flow state while working on [SPECIFIC TASK/PROJECT]. Help me apply Csikszentmihalyi's challenge-skill balance: 1) Rate my current skill level (1-10) for this task and identify specific competencies, 2) How can I adjust the challenge level to match my skills perfectly? 3) If it's too easy, what constraints or complexity can I add? 4) If it's too hard, how can I break it into manageable sub-challenges? Design the optimal difficulty curve that keeps me in the flow channel between boredom and anxiety."

# 27. The Clear Goal Architect (Purpose Clarity Generator)

"I'm working on [PROJECT/ACTIVITY] but feeling scattered and unfocused. Using Csikszentmihalyi's clear goals principle: 1) What are the specific, measurable outcomes I want from this session? 2) How can I break large goals into immediate, actionable micro-targets? 3) What does 'success' look like minute-by-minute during this work? 4) How do I create feedback loops to track progress in real-time? Transform my vague intentions into crystal-clear objectives that pull me into flow."

# 28. The Distraction Elimination Expert (Attention Merger Specialist)

"I keep getting pulled out of focus by [SPECIFIC DISTRACTIONS]. Help me create Csikszentmihalyi's complete absorption: 1) What environmental changes remove friction from my attention? 2) How do I handle internal distractions (worries, random thoughts) without breaking flow? 3) What pre-activity ritual signals my brain to merge action and awareness? 4) How can I make the activity so engaging that distractions naturally fade? Design a distraction-proofing strategy that creates effortless concentration."

# 29. The Immediate Feedback Designer (Performance Optimization Loop)

"I'm working on [SKILL/ACTIVITY] but can't tell if I'm improving or making mistakes. Using Csikszentmihalyi's immediate feedback principle: 1) What are the micro-signals that indicate I'm performing well or poorly? 2) How can I set up real-time feedback systems for this activity? 3) What tools or methods give me instant performance data? 4) How do I train myself to recognize subtle feedback cues? Create a feedback system that keeps me locked in optimal performance without breaking concentration."

# 30. The Self-Consciousness Eraser (Ego Dissolution Facilitator)

"I get stuck in my head worrying about [SPECIFIC SELF-DOUBTS/PERFORMANCE ANXIETY] instead of losing myself in the work. Help me apply Csikszentmihalyi's loss of self-consciousness: 1) What mental techniques shift focus from self-judgment to task engagement? 2) How do I reframe mistakes as information rather than identity threats? 3) What mantras or mindsets help me become one with the activity? 4) How can I make the work itself more compelling than my ego concerns? Design an approach that dissolves the gap between doer and doing."

# 31. The Time Transformation Specialist (Temporal Flow Optimizer)

"I want to experience that magical 'time disappearance' while working on [SPECIFIC ACTIVITY]. Using Csikszentmihalyi's transformed sense of time: 1) How do I structure my work environment to minimize time awareness? 2) What level of task immersion naturally distorts time perception? 3) How can I use music, lighting, or other sensory cues to enhance temporal flow? 4) What preparation helps me surrender control of time and trust the process? Create conditions where hours feel like minutes because I'm completely absorbed."

# 32. The Autotelic Experience Creator (Intrinsically Motivated Activity Designer)

"I'm struggling to find [WORK/ACTIVITY] inherently rewarding - it feels like drudgery. Help me apply Csikszentmihalyi's autotelic principle: 1) How can I reframe this activity to focus on intrinsic rather than external rewards? 2) What aspects of the work itself can I find genuinely fascinating? 3) How do I connect this task to my deeper values and curiosity? 4) What game-like elements can I add to make the process inherently enjoyable? Transform necessary work into activities I want to do for their own sake."

# 33. The Deep Work Session (Distraction-Proof Planner)

"I have [TIME AVAILABLE] to work on [SPECIFIC PROJECT/TASK] that requires deep concentration. Using Cal Newport's approach, help me design an optimal deep work session: 1) What's the exact scope I should tackle in this timeframe? 2) What potential distractions should I eliminate beforehand? 3) What's my shutdown ritual when finished? 4) How do I structure breaks if this is a long session? Create a detailed session plan that maximizes cognitive output and prevents attention residue."

# 34. Time Audit Master

"I'm drowning in [DESCRIBE YOUR CURRENT WORKLOAD/COMMITMENTS]. Help me apply Newport's shallow work elimination: 1) Which activities provide the least value per hour invested? 2) How can I batch similar low-value tasks? 3) What can I delegate, automate, or eliminate entirely? 4) How do I say 'no' professionally to requests that don't align with my core objectives? Create a ruthless audit plan that frees up time for what truly matters."

# 35. The Digital Minimalism Strategist

"I'm addicted to [SPECIFIC APPS/DIGITAL HABITS] and it's destroying my focus. Design a Newport-style digital detox: 1) What's the real value these tools provide vs. time consumed? 2) How can I restructure my phone/computer to reduce friction for distracting apps? 3) What offline activities can replace digital stimulation? 4) How do I handle the anxiety of being less connected? Create a 30-day digital minimalism experiment that rewires my relationship with technology."

# 36. The Deep Work Ritual Designer (Consistency Builder)

"I want to establish a daily deep work practice for [SPECIFIC GOAL/PROJECT]. Using Newport's ritual approach: 1) What time of day am I most cognitively sharp? 2) What physical environment optimizes my focus? 3) What pre-work routine signals my brain it's time for deep thinking? 4) How do I measure progress to stay motivated? Design a sustainable daily ritual that makes deep work automatic rather than dependent on willpower."

# 37. Mental Clarity Optimizer

"I struggle with my mind wandering to [SPECIFIC DISTRACTIONS/WORRIES] during focused work. Help me apply Newport's attention residue solutions: 1) How do I create a 'worry dump' system for intrusive thoughts? 2) What shutdown ritual ensures incomplete tasks don't haunt my focus? 3) How can I train my brain to stay present during difficult cognitive work? 4) What meditation or mindfulness practices support sustained attention? Create an attention training program that builds my focus like a muscle."

# 38. Career Capital Builder

"I want to become excellent at [SPECIFIC SKILL/DOMAIN] to advance my career. Using Newport's career capital approach: 1) What are the core skills that create disproportionate value in this field? 2) How can I get feedback on my performance to improve rapidly? 3) What deliberate practice routine will build mastery? 4) How do I balance skill development with current responsibilities? Design a focused skill-building plan that makes me indispensable in my field."

# 39. The Networking Builder (Social Media Strategy)

"I need to maintain professional connections without losing focus to social media. Design a Newport-inspired approach: 1) What's the minimum viable social media presence for my goals? 2) How can I batch social interactions to specific times? 3) What value can I provide to my network without constant engagement? 4) How do I build real relationships beyond digital likes and comments? Create a networking strategy that builds career capital while protecting my attention."
