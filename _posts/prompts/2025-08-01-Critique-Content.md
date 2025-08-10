---
layout: prompt-details
title: Academic Content Critique Template
subtitle: A comprehensive framework for scholarly paper analysis and evaluation
description: A structured prompt template for critiquing academic papers, articles,
  and research content with detailed analysis framework, grading rubric, and professional
  standards.
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
date: 2025-08-01
categories:
- Prompts
tags:
- Academic Writing
- Critique
- Analysis
- Evaluation
- Research
- Scholarly Writing
- Peer Review
- Assessment
models-supported:
- gpt-4
- gpt-4-turbo
- gpt-3.5-turbo
- gpt-4-mini
- microsoft-copilot
- github
image: /img/prompts/academic-critique-template.png
image-alt: A scholarly desk with papers, books, and evaluation forms representing
  academic critique and analysis
image-credits-title: Academic Critique and Analysis
image-credits: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
series:
- step: 1
  title: Content Generation
  description: Create initial blog post content based on your topic and audience
  prompt_file: 2025-01-31-simple-blog-generator.md
- step: 2
  title: Content Critique
  description: Analyze and improve the generated content for quality and effectiveness
  prompt_file: 2025-08-01-Critique-Content.md
  current: true
variables:
- name: paper_title
  label: Paper Title
  type: text
  placeholder: Enter the title of the paper being critiqued
  required: true
  help: The exact title of the academic paper or article
- name: author_names
  label: Author(s)
  type: text
  placeholder: Enter author name(s) as listed on the paper
  required: true
  help: Full name(s) of the paper's author(s) exactly as listed
- name: critique_focus
  label: Critique Focus Areas
  type: checkbox
  options:
  - methodology
  - logic and reasoning
  - evidence quality
  - practical implications
  - clarity of writing
  - research design
  - data analysis
  - theoretical framework
  - literature review
  - conclusions validity
  default:
  - methodology
  - logic and reasoning
  - evidence quality
  required: false
  help: Select the specific aspects you want to focus on in your critique
- name: citation_style
  label: Citation Style
  type: select
  options:
  - APA
  - MLA
  - Chicago
  - IEEE
  - Vancouver
  default: APA
  required: true
  help: The citation style to use in your critique
- name: critique_depth
  label: Critique Depth
  type: radio
  options:
  - brief overview
  - standard analysis
  - comprehensive evaluation
  - expert-level critique
  default: standard analysis
  required: true
  help: How detailed should the critique be?
- name: include_grading
  label: Include Grading Rubric
  type: radio
  options:
  - 'yes'
  - 'no'
  default: 'no'
  required: true
  help: Should the critique include a formal grading assessment?
prompt_content: "Act as an academic reviewer and critique the content provided using\
  \ the following structured template. Focus your analysis on {{critique_focus}} and\
  \ follow {{citation_style}} citation standards throughout your critique.\n\n**Critique\
  \ Level:** {{critique_depth}}\n**Paper Title:** {{paper_title}}\n**Author(s):**\
  \ {{author_names}}\n\n## Introduction\n\n<Purpose>\n* Clearly introduce the critique\
  \ by summarizing the paper's identity and key message.\n* State explicitly the main\
  \ point or argument presented by the original author.\n* Present a clear thesis\
  \ statement outlining what the critique aims to cover or analyze.\n\n<Instructions>\n\
  * Identify and state the full name(s) of the paper's author(s) exactly as listed\
  \ on the paper.\n* Provide the complete, accurately formatted title of the article\
  \ being critiqued.\n* Succinctly describe the author's primary argument or central\
  \ idea in your own words.\n* Write a concise, direct thesis statement that previews\
  \ the aspects or criteria your critique will address (e.g., methods, logic, evidence,\
  \ implications).\n\n<Example>\nIn the article \"Artificial Intelligence and Ethical\
  \ Decision-Making,\" authors Jane Doe and John Smith argue that AI systems must\
  \ integrate clear ethical frameworks to effectively support human decisions. This\
  \ critique evaluates the authors' methodology, use of supporting evidence, and practical\
  \ applicability of their proposed ethical guidelines, highlighting strengths and\
  \ identifying areas needing further development.\n\n<Prerequisites>\n* Full name(s)\
  \ of the paper's author(s).\n* Exact title of the paper.\n* Clear understanding\
  \ of the main argument or thesis presented by the author(s).\n* Defined criteria\
  \ or points you plan to analyze within your critique.\n <Standards>\n* {{citation_style}}\
  \ (American Psychological Association) style for author citation and article titles.\n\
  * MLA (Modern Language Association) style as an alternative if appropriate for humanities\
  \ critiques.\n* General academic standards require that introductions provide clear\
  \ attribution, concise thesis statements, and sufficient context to understand the\
  \ subsequent analysis.\n ## Summary\n\n<Purpose>\n* Clearly introduce the critique\
  \ by summarizing the paper\u2019s identity and key message.\n* State explicitly\
  \ the main point or argument presented by the original author.\n* Present a clear\
  \ thesis statement outlining what the critique aims to cover or analyze.\n\n<Instructions>\n\
  * Identify and state the full name(s) of the paper\u2019s author(s) exactly as listed\
  \ on the paper.\n* Provide the complete, accurately formatted title of the article\
  \ being critiqued.\n* Succinctly describe the author\u2019s primary argument or\
  \ central idea in your own words.\n* Write a concise, direct thesis statement that\
  \ previews the aspects or criteria your critique will address (e.g., methods, logic,\
  \ evidence, implications).\n\n<Example>\nIn the article \u201CArtificial Intelligence\
  \ and Ethical Decision-Making,\u201D authors Jane Doe and John Smith argue that\
  \ AI systems must integrate clear ethical frameworks to effectively support human\
  \ decisions. This critique evaluates the authors\u2019 methodology, use of supporting\
  \ evidence, and practical applicability of their proposed ethical guidelines, highlighting\
  \ strengths and identifying areas needing further development.\n\n<Prerequisites>\n\
  * Full name(s) of the paper\u2019s author(s).\n* Exact title of the paper.\n* Clear\
  \ understanding of the main argument or thesis presented by the author(s).\n* Defined\
  \ criteria or points you plan to analyze within your critique.\n\n<Standards>\n\
  * APA (American Psychological Association) style for author citation and article\
  \ titles.\n* MLA (Modern Language Association) style as an alternative if appropriate\
  \ for humanities critiques.\n* General academic standards require that introductions\
  \ provide clear attribution, concise thesis statements, and sufficient context to\
  \ understand the subsequent analysis.\n\n## Summary\n\n<Purpose>\n* Clearly and\
  \ objectively summarize the primary points, arguments, and findings presented by\
  \ the author(s).\n* Provide readers with essential context to understand the paper\
  \ without personal opinion or analysis.\n\n<Instructions>\n* Restate the article\u2019\
  s main points clearly, without injecting your interpretation or critique.\n* Identify\
  \ and clearly describe the central arguments or claims made by the author(s).\n\
  * Clearly state the key findings or conclusions reached in the article.\n* Use your\
  \ own words to summarize\u2014avoid direct quotations unless necessary.\n\n<Example>\n\
  Doe and Smith\u2019s article, \u201CArtificial Intelligence and Ethical Decision-Making,\u201D\
  \ explores how AI systems can effectively integrate ethical principles into decision-making\
  \ processes. The authors argue that clear, practical ethical guidelines are necessary\
  \ for AI to safely support human decisions, especially in high-stakes fields like\
  \ healthcare and autonomous transportation. They provide examples from existing\
  \ systems and identify gaps in current AI ethics approaches. Key findings include\
  \ identifying critical components of ethical AI, such as transparency, accountability,\
  \ and continuous human oversight.\n\n<Prerequisites>\n* Accurate understanding of\
  \ the article\u2019s key points.\n* The author\u2019s main arguments clearly identified.\n\
  * Explicitly stated results, conclusions, or recommendations from the original article.\n\
  \n<Standards>\n* APA (American Psychological Association) guidelines for summarizing\
  \ scholarly sources.\n* General scholarly standards that emphasize objectivity,\
  \ clarity, completeness, and conciseness in summarization.\n* IEEE and ACM guidelines\
  \ for accurately and succinctly summarizing technical content.\n\n## Critique\n\n\
  <Purpose>\n* Clearly analyze and evaluate the article\u2019s strengths and weaknesses.\n\
  * Offer informed, evidence-based opinions about the article\u2019s clarity, relevance,\
  \ and accuracy.\n* Provide detailed examples from the article to support critical\
  \ judgments.\n\n<Instructions>\n* Identify and clearly describe specific strengths\
  \ of the article, such as effective arguments, clear writing, thorough research,\
  \ or insightful conclusions.\n* Identify and clearly describe specific weaknesses,\
  \ including unclear points, logical fallacies, unsupported claims, or insufficient\
  \ evidence.\n* Explicitly state your informed views on the article\u2019s:\n* Clarity:\
  \ Is the content clearly expressed and easily understandable?\n* Relevance: Is the\
  \ information meaningful and applicable to the intended audience or current scholarly/professional\
  \ context?\n* Accuracy: Is the information supported by evidence, correctly interpreted,\
  \ and factual?\n* Support each opinion with clear, specific examples directly cited\
  \ or paraphrased from the article.\n\n<Example>\nThe article by Jane Doe and John\
  \ Smith demonstrates notable strengths, particularly in its clear presentation of\
  \ ethical frameworks for artificial intelligence. The authors effectively clarify\
  \ complex ethical theories by providing concrete examples, such as the detailed\
  \ case study of autonomous vehicle decision-making (Doe & Smith, 2024, p. 12). However,\
  \ a primary weakness lies in the limited empirical evidence supporting the efficacy\
  \ of their proposed guidelines. The authors claim substantial industry applicability\
  \ yet only cite anecdotal evidence from two organizations, reducing the overall\
  \ reliability and relevance of their findings (p. 15-16). While generally clear,\
  \ some critical terms like \u201Cethical risk\u201D were used repeatedly without\
  \ adequate initial definition, somewhat reducing clarity for readers less familiar\
  \ with ethical AI terminology (p. 7). Overall, the accuracy of presented data is\
  \ commendable, with precise referencing to current research, though the narrow range\
  \ of cited studies slightly weakens the comprehensive accuracy of the argument.\n\
  \n<Prerequisites>\n* A careful reading of the article, noting significant points\
  \ that stand out as strengths or weaknesses.\n* Identification of specific elements\
  \ (arguments, evidence, examples) to evaluate in terms of clarity, relevance, and\
  \ accuracy.\n* Direct quotations or clearly paraphrased content from the original\
  \ article to serve as evidence supporting your evaluations.\n* Citation details\
  \ (author name, year, page numbers) from the original source.\n\n<Standards>\n*\
  \ APA (American Psychological Association) standards for accurately citing direct\
  \ quotations, paraphrases, and summarizing content.\n* General academic critique\
  \ standards that emphasize balanced evaluation (positive and negative), evidence-supported\
  \ opinions, and clear reasoning.\n* International Critical Thinking Standards (Paul-Elder\
  \ Framework), emphasizing precision, relevance, logic, depth, accuracy, clarity,\
  \ fairness, and breadth.\n\n## Conclusion\n\n<Purpose>\n* Summarize the critical\
  \ points from both the original article and your critique analysis clearly and concisely.\n\
  * Provide a closing perspective highlighting the significance of the research or\
  \ recommend future research opportunities.\n\n<Instructions>\n* Briefly restate\
  \ the author\u2019s main arguments or findings.\n* Concisely summarize your critique\u2019\
  s key evaluations (both strengths and weaknesses) of the article.\n* Clearly articulate\
  \ why the research matters or identify specific gaps that future research should\
  \ address.\n* Ensure your conclusion is concise and leaves the reader with a clear\
  \ understanding of the critique\u2019s value and the article\u2019s contribution\
  \ to the field.\n\n<Example>\nIn summary, Doe and Smith\u2019s article \u201CArtificial\
  \ Intelligence and Ethical Decision-Making\u201D presents a meaningful framework\
  \ for integrating ethics into AI systems, effectively simplifying complex ethical\
  \ considerations. However, the critique identified significant limitations, particularly\
  \ the insufficient empirical evidence to support broad applicability. Despite these\
  \ issues, the article significantly contributes to ongoing discussions about ethical\
  \ AI by clearly addressing theoretical gaps and real-world scenarios. Future research\
  \ should focus on extensive empirical validation of the proposed ethical guidelines,\
  \ examining their practical effectiveness across diverse AI applications.\n\n<Prerequisites>\n\
  * Key points and arguments from the original article.\n* Main strengths and weaknesses\
  \ from your critique.\n* Insights into the importance of the research or identification\
  \ of critical research gaps for future exploration.\n\n<Standards>\n* APA (American\
  \ Psychological Association) standards for concise summarization and clarity in\
  \ academic writing.\n* General standards for writing scholarly conclusions, emphasizing\
  \ brevity, relevance, forward-looking statements, and contextual significance.\n\
  * IEEE and ACM guidelines for summarizing and stating the significance of research\
  \ clearly in professional critiques, especially within technical and scientific\
  \ domains.\n\n## Grading Rubric\n\n<Purpose>\n\nThis rubric is designed to provide\
  \ consistent, fair, and actionable evaluations of written papers. Each criterion\
  \ is scored separately using a detailed scale. Final grades are calculated based\
  \ on total points. Specific comments should be provided for each section.\n\n<Instructions>\
  \ \n\n1. **Read the Paper Thoroughly:** Read the entire paper before scoring to\
  \ get a holistic sense of the argument, structure, and style.\n2. **Score Each Criterion\
  \ Independently:** Use the descriptors in each level to assign a score (0\u2013\
  4) for every criterion. Refer to the detailed level descriptors to avoid bias.\n\
  3. **Justify Scores with Comments:** For each criterion, write a brief comment explaining\
  \ the score, pointing out specific strengths and areas for improvement.\n4. **Calculate\
  \ the Total Score:** Add up scores for each criterion for a final grade.\n5. **Provide\
  \ Overall Feedback:** Offer a concise summary at the end\u2014highlighting major\
  \ strengths, significant weaknesses, and actionable next steps.\n6. **Maintain Consistency:**\
  \ Use the descriptors as your guide. When unsure, consult with another grader or\
  \ refer to exemplar papers.\n\n### Overall Feedback\n\n*(Write 3\u20135 sentences\
  \ summarizing overall strengths, areas for improvement, and suggestions for next\
  \ steps.)*\n\n### Scoring Scale\n\n* **4 \u2013 Excellent:** Exceeds expectations;\
  \ exemplary work\n* **3 \u2013 Good:** Meets expectations; minor errors\n* **2 \u2013\
  \ Satisfactory:** Adequate; some noticeable issues\n* **1 \u2013 Needs Improvement:**\
  \ Significant weaknesses\n* **0 \u2013 Unacceptable:** Does not address the criterion\n\
  \n### Criteria\n\n| Criterion                                     | 4 - Excellent\
  \                                                        | 3 - Good            \
  \                             | 2 - Satisfactory                               \
  \      | 1 - Needs Improvement                            | 0 - Unacceptable   \
  \              |\n| --------------------------------------------- | --------------------------------------------------------------------\
  \ | ------------------------------------------------ | ----------------------------------------------------\
  \ | ------------------------------------------------ | --------------------------------\
  \ |\n| **Thesis & Purpose**                          | Clear, original, well-stated\
  \ thesis; focus maintained throughout     | Clear thesis; mostly maintained focus\
  \            | Thesis present but unclear or not maintained         | Weak, unfocused,\
  \ or off-topic thesis             | No thesis or purpose             |\n| **Structure\
  \ & Organization**                  | Logical, seamless flow; strong intro/conclusion;\
  \ clear transitions   | Mostly logical flow; effective intro/conclusion  | Organization\
  \ is present but inconsistent             | Disorganized; unclear sections; weak\
  \ transitions | No logical structure             |\n| **Evidence & Support**   \
  \                     | Comprehensive, relevant, well-integrated evidence; critical\
  \ analysis | Good evidence; generally relevant and integrated | Adequate evidence;\
  \ sometimes underdeveloped          | Weak or minimal evidence; little analysis\
  \        | No evidence/support              |\n| **Analysis & Insight**        \
  \                | Deep, original analysis; shows strong understanding & synthesis\
  \      | Good analysis; shows understanding               | Some analysis but lacks\
  \ depth                        | Superficial, summary only                     \
  \   | No analysis/insight              |\n| **Clarity & Style**                \
  \           | Highly readable; precise, engaging language; strong academic voice\
  \   | Mostly clear; appropriate style                  | Understandable but sometimes\
  \ vague or awkward        | Hard to follow; inappropriate tone/style         | Unreadable\
  \ or inappropriate      |\n| **Mechanics (Grammar, Spelling, Formatting)** | Error-free;\
  \ follows required formatting perfectly                    | Few errors; formatting\
  \ mostly correct            | Some errors; distract but don\u2019t impede understanding\
  \ | Frequent errors; hard to read                    | Excessive errors; unreadable\
  \     |\n| **Use of Sources / Citations**                | All sources well-chosen,\
  \ cited correctly, integrated smoothly        | Mostly correct citations, generally\
  \ well-chosen  | Some citation errors or weak sources                 | Poor use\
  \ of sources, many errors                 | No citations or clear plagiarism |\n\
  \n### Scoring Sheet Template\n\n| Criterion                  | Score (0\u20134)\
  \ | Comment (Required) |\n| -------------------------- | ----------- | ------------------\
  \ |\n| Thesis & Purpose           |             |                    |\n| Structure\
  \ & Organization   |             |                    |\n| Evidence & Support  \
  \       |             |                    |\n| Analysis & Insight         |   \
  \          |                    |\n| Clarity & Style            |             |\
  \                    |\n| Mechanics                  |             |           \
  \         |\n| Use of Sources / Citations |             |                    |\n\
  | **Total**                  |             |                    |\n\n### Customization\
  \ Options\n\n* **Weighting:** Adjust weights if some criteria are more important\
  \ (e.g., double weight for Evidence & Support).\n* **Discipline-Specific Criteria:**\
  \ Add elements relevant to your context (e.g., creativity for a narrative, technical\
  \ accuracy for a science report).\n* **Holistic Grading:** Optionally provide an\
  \ overall holistic score for special assignments.\n\n<Example>\n\n| Criterion  \
  \              | Score | Comment                                              |\n\
  | ------------------------ | ----- | ----------------------------------------------------\
  \ |\n| Thesis & Purpose         | 4     | Clear, original thesis; maintains focus\
  \ throughout   |\n| Structure & Organization | 3     | Mostly logical flow, minor\
  \ issues in transitions     |\n| Evidence & Support       | 2     | Some evidence\
  \ not directly linked to thesis          |\n| Analysis & Insight       | 3     |\
  \ Good analysis; could be deeper in final section      |\n| Clarity & Style    \
  \      | 4     | Engaging, academic style, very readable              |\n| Mechanics\
  \                | 4     | Nearly error-free                                   \
  \ |\n| Use of Sources/Citations | 3     | Minor citation errors, otherwise well-chosen\
  \ sources |\n| **Total**                | 23    |                              \
  \                        |\n\n<Standards>\n\n* **AAC\\&U VALUE Rubrics** (American\
  \ Association of Colleges & Universities)\n* **APA / MLA / Chicago Style Guidelines**\n\
  * **Bloom\u2019s Taxonomy for Critical Thinking**\n"
image_width: 1456
image_height: 816
---
The "Academic Content Critique Template" is a comprehensive, structured framework designed for scholarly analysis and evaluation of academic papers, articles, and research content. This sophisticated prompt transforms users into academic reviewers, providing a systematic approach to critiquing scholarly work with professional standards and detailed analytical frameworks.

The template excels at:

* Structured Academic Analysis with standardized sections (Introduction, Summary, Critique, Conclusion)
* Customizable Focus Areas targeting specific aspects like methodology, evidence quality, and theoretical frameworks
* Professional Citation Standards supporting multiple academic styles (APA, MLA, Chicago, IEEE, Vancouver)
* Scalable Depth Levels from brief overviews to expert-level comprehensive evaluations
* Optional Grading Rubric with detailed scoring criteria and feedback mechanisms
* Educational Framework following established academic critique standards and critical thinking principles
* This tool is ideal for educators, researchers, peer reviewers, graduate students, and academic professionals who need to conduct rigorous, consistent, and constructive evaluations of scholarly work.


