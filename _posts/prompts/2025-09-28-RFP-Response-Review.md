---

layout: prompt-details

title: RFP Response Evaluation Prompt
subtitle: Structured workflow for analyzing, scoring, and critiquing vendor RFP responses
quote: "Analyze, score, and critique vendor RFP responses with traceability, grading, and gap analysis."
excerpt: "A detailed prompt designed to guide evaluation of vendor RFP responses using structured steps, rubric scoring, and reviewer Q&A."

source: "Original Content"
source-url: ""
call-to-action: "Discuss on Mastodon"

date: 2025-09-28 00:00:00 -0700
update: 2025-09-28 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
    - Breaks RFP into requirements with unique IDs for traceability.
    - Maps vendor responses against requirements and rubric criteria.
    - Applies weighted scoring with justifications and citations.
    - Evaluates compliance, readability, risks, and gaps.
    - Produces scoring matrix, gap analysis, risk summary, and reviewer Q&A.

description: "This prompt provides a structured framework for evaluating vendor RFP responses. It guides evaluators through parsing requirements, mapping responses, applying a rubric, identifying risks, and generating actionable outputs such as scoring matrices and reviewer Q&A."
seo-description: "Structured prompt for scoring and critiquing vendor RFP responses with rubric-based evaluation, risk analysis, and reviewer Q&A outputs."

categories:
- Prompts

tags:
  - rfp
  - evaluation
  - vendor responses
  - rubric
  - compliance
  - scoring
  - procurement
  - analysis
  - governance
  - risk assessment

keywords:
  - rfp evaluation
  - vendor response analysis
  - procurement scoring
  - rubric-based grading
  - compliance review
  - risk and gap analysis
  - reviewer q&a
models-supported:
   - gpt-4
   - gpt-4.1
   - gpt-4o
   - gpt-4-mini
   - o4-mini
   - o4-mini-high
   - microsoft-copilot
   - github

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/prompts/The-Lighthouse-and-the-New-Lens.webp
image-alt: "A tall lighthouse perched on a rocky coastal cliff shines its bright beam through heavy fog and storm clouds, illuminating the dark shoreline and turbulent sea below."
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-description: "Lighthouse with keeper and apprentice installing a gleaming new lens, storm clouds pressing in, ocean fog swirling, the beam cutting farther and cleaner across the sea, atmosphere charged with urgency and revelation, Photography style with Canon EOS R5 and 24-70mm f2.8 lens, ultra high resolution realism with cinematic lighting, high texture detail and atmospheric depth"
image-title: "Beacon in the Storm"
image_width: 1456
image_height: 816

mastodon-post-id: null


prompt_content: | 
    You will be reviewing the Requirements and the responses to an RFP 

    # Instructions 

    You will receive four inputs:

    1. The **RFP Request document** (with requirements and instructions) as an attachment.
    2. The **Vendor Response document** as an attachment.
    3. The **grading criteria/rubric** (with weights and definitions) are below. (Optional, use built in Rubric)
    4. A list of questions you must answer are below (Optional, as you can attach the questions below)

    Your task is to **analyze, score, and critique the Response** according to the RFP and rubric.
    Follow these steps strictly:

    ### **Step 1: Parse Inputs**

    * Break down the RFP into individual **requirements**. Assign each requirement a unique ID.
    * Segment the Response into sections and normalize formatting.
    * Extract the grading rubric criteria, weights, and definitions.

    ### **Step 2: Map Requirements**

    * For each RFP requirement, locate the corresponding Response content.
    * Mark each as: **Fully Addressed**, **Partially Addressed**, or **Missing**.
    * Create a traceability table: (Requirement → Response excerpt).

    ### **Step 3: Apply Grading Criteria**

    * For each criterion in the rubric:

    * Identify relevant Response passages.
    * Evaluate alignment, depth, and quality.
    * Assign a **score** and provide a short **justification** with citations from the Response.
    * Apply weights and calculate overall scores.

    ### **Step 4: Quality & Compliance Check**

    * Evaluate readability, clarity, and structure.
    * Detect compliance language ("meets," "exceeds," "fully compliant").
    * Assess the strength of supporting evidence (metrics, references, certifications).
    * Flag vague/non-committal language.
    * Check for consistency across sections.

    ### **Step 5: Risk & Gap Analysis**

    * Identify unaddressed or weak requirements.
    * Highlight risks such as incomplete commitments, vague SLAs, or overpromises without evidence.
    * Identify differentiators and unique strengths.

    ### **Step 6: Anticipate & Answer Reviewer Questions**

    * Generate likely reviewer questions based on gaps and risks.  Also make sure you also answer all the required questions listed below.
    * For each question:

    * Extract the most relevant supporting text from the Response.
    * If missing, propose a recommended clarification the vendor should provide.
    * If the vendor has gaps, please mention the gap and propose a question that will close the gap.

    ### **Step 7: Generate Outputs**

    Produce the following deliverables:

    1. **Scoring Matrix** (criteria → score → justification → citations).
    2. **Gap Analysis Report** (requirements not or weakly addressed).
    3. **Risk & Strength Summary**.
    4. **Reviewer Q&A Set** (questions + extracted answers/recommendations).

    ### ✅ Example Application

    * Requirement: *"Provide 24/7 customer support."*
    * Response: *"We provide support during business hours, with emergency escalation after hours."*
    * Evaluation: **Partial compliance (2/5)**.
    * Risk: Limited after-hours coverage.
    * Reviewer Question: *"What is the SLA for after-hours support?"*

    ⚡ **Instruction:** Always cite Response text when scoring, highlight risks, and make recommendations where gaps exist.

    # Grading Criteria / Rubric

    ## Evaluation Guidance

    When evaluating solutions, evaluators should focus on four key dimensions:

    1. Requirements Fit – How well does the proposal align with the RFP SOW and service areas?
    - Higher scores: Fully traceable to SOW, comprehensive coverage, security/controls built in.
    - Lower scores: Misalignment, incomplete, or failure to meet core requirements.
    1. Enhancements – Are there meaningful improvements beyond the baseline SOW (e.g., automation, AIOps, modernization)?
    - Higher scores: Clear roadmap with quantified value.
    - Lower scores: Minimal or outdated approach.
    1. Exceptions & Risks – Assess the materiality of gaps, exceptions, and deferrals.
    - Higher scores: No or minor items, easily mitigated.
    - Lower scores: Major/high-impact exceptions raising compliance or viability risks.
    1. Assumptions – Are assumptions reasonable, justified, and bounded by remedies?
    - Higher scores: Justified and clearly bounded assumptions.
    - Lower scores: Broad, heavy, unproven, or contradictory assumptions.

    General Rule:
    - Scores 5–4: Well-aligned, value-added enhancements, and minimal gaps with justified assumptions.
    - Score 3: Adequate, standard functional response with limited enhancements and moderate risks.
    - Scores 2–0: Misaligned, incomplete, or fails to meet SOW; major/high-impact risks; untenable or missing assumptions.

    ## Scoring

    ### 5 - Exceeds
    * Requirements Fit: Exec + By-Service-Area fully traceable to SOW; mandated tools/controls; security/compliance designed-in. 
    * Enhancements: Clear modernization/AIOps roadmap; quantified value
    * Exceptions & Risks: No material gaps; assumptions bounded with concrete remedies.
    * Assumptions: justified assumptions

    ### 4 - Strong
    * Requirements Fit: Well-aligned to SOW; minor tailoring per Service Area.
    * Enhancements: Meaningful automation/modernization. 
    * Exceptions & Risks: Minor items; fixes identified.
    * Assumptions: reasonable assumptions

    ### 3 - Satisfactory
    * Requirements Fit: Standard/functional response to SOW; uneven depth across Service Areas. 
    * Enhancements: Limited automation; generic roadmap
    * Exceptions & Risks: Moderate impact items or deferrals. 
    * Assumptions: broad assumptions

    ### 2 - Adequate

    * Requirements Fit: Misalignment to SOW in areas; Service-Area gaps. 
    * Enhancements: Minimal modernization 
    * Exceptions & Risks: Major exceptions on scope/tooling fit. 
    * Assumptions: heavy/unproven assumptions

    ### 1 - Insufficient

    * Requirements Fit: Incomplete/unclear; fails Service-Area needs. 
    * Enhancements: Outdated approach 
    * Exceptions & Risks: High-impact items; viability doubtful. 
    * Assumptions: untenable assumptions

    ### 0 - Unacceptable

    * Requirements Fit: Fails core SOW requirements or mandatory tools/processes. 
    * Enhancements: N/A. 
    * Exceptions & Risks: disastrous.
    * Assumptions: not provided or contradicts RFP

    # Questions That must be answered {Replace with your own.  These are examples.}

    1. Governance, Operations, and Platform Management
    * Does the response clearly state governance, operations, and platform management requirements, assumptions, and exceptions?
    * Does the proposed solution demonstrate alignment with best practices and provide evidence of scalability and reliability?

    ... 

    1.  Shared Accountability & Value Realization
    * Is there evidence of shared accountability for outcomes and KPIs?
    * Does the vendor outline proactive risk mitigation, resilience, and continuous improvement practices?
    * Is end-to-end accountability clearly demonstrated?


---

**What you’ll need before you start**

1. The **RFP Request** (requirements + instructions) as a file.
2. The **Vendor Response** as a file.
3. The **Grading Criteria / Rubric** (weights + definitions) (Optional).
4. The **Required Questions** list (Optional).

**How to run it (5–10 minutes):**

1. Open your approved AI workspace.
2. Start a new chat, title it with the RFP name, and **upload the two documents** (RFP + Vendor Response).
3. Paste the rubric into the correct spot in the prompt and add the required questions into the correct section of the prompt.
4. Now paste the **prompt** (verbatim) from the next section.
5. Send.
6. When you receive results, skim the **Scoring Matrix**, **Gap Analysis**, **Risk & Strengths**, and **Reviewer Q&A**.
7. If anything looks off, ask the model to "re‑score using stricter evidence standards" or "show only citations containing SLAs/time‑bound commitments."

**What you’ll get back:**

* A **Scoring Matrix** with scores, justifications, and citations to the vendor’s own words.
* A **Traceability table** mapping each requirement to the response.
* A **Gap Analysis** (what’s missing/weak).
* A **Risk & Strengths** summary.
* A **Reviewer Q&A** set you can use in meetings or vendor follow‑ups.

## Copy‑and‑Paste Prompt (verbatim)

> Paste the text below into your AI workspace. Do **not** edit inside the box unless your team has agreed to a standard variant.

## How the prompt "thinks" (in plain English)

* **It parses first, judges second.** That keeps us honest.
* **It maps requirement‑to‑response** so we can trace every claim to vendor text.
* **It scores with receipts.** Justifications must point to quotes, metrics, or artifacts.
* **It flags gaps and risks** (e.g., "after‑hours support via escalation only").
* **It drafts reviewer questions** that close gaps before we sign anything.

### A tiny example (from the prompt)

> Requirement: "Provide 24/7 customer support."
> Response: "Business hours, with emergency escalation after hours."
> Evaluation: **Partial (2/5)**.
> Risk: Limited after‑hours coverage.
> Reviewer Q: "What is the SLA for after‑hours support?"

## Guardrails & good habits

* **Use approved workspaces** and follow data‑handling policies. Redact sensitive details when needed.
* **Name your files clearly** (`RFP-<project>-vFinal.pdf`, `Vendor-Response-<company>-v1.docx`).
* **Ask for stricter evidence** if the scoring feels generous. "Only cite lines with numbers, SLAs, or certifications."
* **Save what works** in a shared team folder so our approach becomes a paved road—not a goat trail.

## For leaders: make it the paved road

Publish three decisions and you’ll boost quality overnight:

1. **When to use the prompt** (e.g., any RFP over $X or any regulated domain).
2. **How to store outputs** (Scoring Matrix, Gap Analysis, Q&A) for auditability.
3. **Who signs off** before awards go out and keeps a human in the loop.

This isn’t about replacing human judgment; it’s about **aiming** it. We free people to do the human parts—listening, deciding, caring—by giving them consistent scaffolding for the rest.