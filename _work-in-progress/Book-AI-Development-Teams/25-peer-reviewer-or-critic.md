# Persona: Peer Reviewer or Critic

> Applies independent human judgment to an artifact, decision, or result so the team can strengthen it, expose weak assumptions, and act with warranted confidence.

## Purpose and scope

This persona describes a responsibility that may rotate among qualified peers. It includes code review, design critique, document review, product challenge, architecture review, model-output critique, domain review, and adversarial examination. “Critic” means a disciplined examiner of the work, not a hostile person or an approval gate by default.

The reviewer is independent enough to notice what the creator may have normalized, but close enough to understand intent and consequence. The role does not exist to rewrite every artifact in the reviewer's style, demonstrate seniority, or absorb accountability from the creator and Decision Owner. Its value is a better decision and a stronger shared standard.

## Persona at a glance

| Dimension | Definition |
| --- | --- |
| Primary mission | Improve the correctness, usefulness, coherence, safety, and maintainability of work before consequences become expensive |
| Primary constituency | The customer or stakeholder affected by the work and the team accountable for it |
| Operating horizon | Immediate feedback through long-term improvement of standards and collective judgment |
| Core tension | Be rigorous enough to catch consequential weakness without turning review into subjective delay |
| Unique contribution | Brings a second perspective, adversarial questions, and standards-based judgment separate from authorship |
| Success looks like | Important issues surface early; feedback is actionable; weak work changes or stops; strong work proceeds without ritual delay |
| Typical failure signal | Reviews become rubber stamps, stylistic battles, performative negativity, or queues that add time without reducing risk |

## Core mandate

The Peer Reviewer first understands the intended customer outcome, scope, evidence, constraints, and decision at hand. They then examine the work in proportion to consequence, distinguishing blocking defects from suggestions and personal preferences. They test assumptions, trace claims to sources, inspect boundary and failure cases, and make uncertainty visible.

In an AI-native environment, inexpensive generation increases the amount and polish of material available for review. The Reviewer must resist equating fluency, completeness, or test volume with quality. They consider provenance, hidden assumptions, correlated model errors, evaluation coverage, human accountability, permission boundaries, and whether the artifact should exist at all.

## Outcomes and motivations

- Consequential defects, unsupported claims, and harmful assumptions are found before release or decision.
- The artifact better serves the intended customer and fits the surrounding system.
- Review effort is concentrated according to consequence, novelty, uncertainty, and reversibility.
- Feedback helps the creator learn rather than merely comply.
- Standards become clearer as recurring review issues are converted into documentation, tests, linting, evaluations, or examples.
- Dissenting evidence is preserved and routed to the correct Decision Owner.
- Strong work can proceed quickly because the review has a clear contract and service level.

The Reviewer is motivated by stewardship of quality and shared judgment, not ownership of every artifact.

## Jobs to be done

- **When an artifact is ready for consequential use,** understand its intent and review contract **so I assess the right qualities at the right depth.**
- **When the work appears polished,** probe sources, assumptions, edge cases, and real behavior **so surface fluency does not conceal fundamental weakness.**
- **When I find a concern,** state its evidence, consequence, priority, and possible remedy **so the creator and Decision Owner can act.**
- **When reviewers disagree,** separate standards, facts, tradeoffs, and preference **so the correct authority can resolve the decision.**
- **When the same issue recurs,** propose an automated check, evaluation, example, or documentation change **so review capacity shifts toward novel judgment.**
- **When risk is low and reversible,** avoid over-review **so assurance does not become ceremonial delay.**
- **When the premise is weak,** challenge whether the artifact should exist **so the team does not perfect a solution to the wrong problem.**

## Responsibilities and boundaries

### Owns

- A timely, good-faith review within the agreed scope and standard.
- Independent examination of evidence, assumptions, normal paths, boundaries, failures, and recovery.
- Clear classification of findings by severity and whether they block the decision.
- Actionable feedback tied to customer impact, requirements, standards, or explicitly labeled judgment.
- Disclosure of conflicts, missing expertise, uncertainty, and inability to complete the review.
- Respectful treatment of the creator and preservation of dissent when unresolved.

### Co-owns

- Review criteria and definitions of ready/done with authors, quality, domain, product, technical, and risk owners.
- Learning from defects and converting repeated concerns into upstream safeguards.
- Improvement of review tools, examples, evaluation libraries, and service-level expectations.

### Contributes to

- Release evidence, design critiques, decision records, retrospectives, incident reviews, and communities of practice.
- Calibration sessions so reviewers interpret standards consistently.

### Does not own

- The original artifact, customer outcome, or final decision unless separately assigned.
- Unlimited veto based on taste, seniority, or unstated preferences.
- Fixing every issue personally or rewriting the work to resemble their own.
- Certifying qualities outside their competence or evidence.
- Protecting the team from all possible risk regardless of cost and reversibility.

## Decision rights and escalation triggers

The Reviewer may approve within a delegated review scope, request changes required by an agreed standard, and block progression when a defined critical criterion is unmet. Suggestions, questions, and preferences do not become blocking merely because the reviewer is senior.

Escalate when evidence reveals material safety, security, legal, privacy, ethical, accessibility, financial, or customer risk; author and reviewer disagree about a blocking criterion; the decision exceeds either person's authority; the source of truth conflicts; required expertise is absent; independence is compromised; or delivery pressure encourages a false approval. The Decision Owner resolves legitimate tradeoffs and records the rationale; professional authorities retain any formal statutory or policy accountabilities.

## Inputs and evidence

- The customer problem, intended outcome, scope, audience, constraints, and explicit review request.
- The artifact and enough surrounding context to observe real behavior, not only a summary.
- Source material, requirements, decision records, applicable standards, threat or risk context, and known limitations.
- Tests, evaluations, research, operational data, accessibility checks, logs, provenance, and prior incidents as relevant.
- The creator's self-review, assumptions, uncertainty, and areas where challenge is particularly desired.

## Outputs and artifacts

- A disposition: approved, approved with non-blocking follow-up, changes required, or escalated—with scope and conditions.
- Findings that state observation, evidence, consequence, priority, and actionable direction.
- Questions that expose missing context without disguising directives.
- Recorded dissent or accepted tradeoffs linked to the Decision Owner.
- Proposed tests, evaluations, examples, or documentation improvements.
- A concise review summary suitable for release or decision evidence.

## Operating rhythm

**Before review:** confirm the decision, consequence, standard, scope, service-level need, and whether the reviewer has the right expertise and independence.

**First pass:** understand purpose and system fit before commenting on local details.

**Deep pass:** inspect high-risk assumptions, interfaces, failure modes, recovery, source provenance, tests, and evidence. Run or observe the artifact when feasible.

**Feedback pass:** consolidate duplicates, classify severity, distinguish requirement from preference, and lead with the most important finding.

**Resolution:** inspect material changes, record disposition and dissent, and avoid reopening settled preferences without new evidence.

**Pattern review:** periodically convert recurring feedback into upstream design, documentation, automation, or training improvements.

## Capabilities and literacies

- Sufficient domain or craft expertise for the review scope and awareness of its limits.
- Critical thinking, causal reasoning, evidence evaluation, and adversarial scenario design.
- Ability to distinguish correctness, usefulness, maintainability, coherence, accessibility, risk, and taste.
- Clear written feedback, facilitation of disagreement, and cross-cultural communication.
- AI literacy: provenance, hallucination, variability, evaluation leakage, correlated failures, prompt injection, tool permissions, drift, and human oversight.
- Risk-based prioritization and understanding of reversibility and blast radius.
- Practical empathy for creators and users without softening material findings.

## Mindsets and observable behaviors

- Assumes best intent and verifies the artifact.
- Reviews the work that exists against its purpose, not an imaginary project of the reviewer's choosing.
- Leads with material concerns and says when the work is strong.
- Uses specific evidence and calibrated language; avoids sarcasm, status displays, and vague disapproval.
- Changes position when the creator supplies better evidence.
- Treats “I do not know” as a reason to find expertise, not bluff approval.
- Challenges the premise as well as execution when customer value is unclear.
- Optimizes the whole learning loop, not the number of comments produced.

## Collaboration map

| Partner | Needs from this persona | What this persona needs | Productive tension to preserve |
| --- | --- | --- | --- |
| Creator or Author | Timely, specific, prioritized, respectful feedback | Context, self-review, evidence, and openness to challenge | Craft ownership versus independent judgment |
| Decision Owner | Clear findings, tradeoffs, and dissent | Decision criteria and timely resolution | Review advice versus accountable choice |
| Quality/Evaluation Engineer | Human judgment on uncovered or ambiguous behavior | Test evidence, failure patterns, and coverage | Automation versus contextual evaluation |
| Domain and Risk experts | Accurate routing of specialized concerns | Criteria and interpretation where expertise is required | Broad peer review versus formal authority |
| Customer Research and Support | Attention to real user behavior and failure | Representative evidence and impact | Internal elegance versus lived experience |
| Documentation Owner | Recurring ambiguity and stronger examples | Current standards and source hierarchy | Local feedback versus systemic prevention |

## Working with AI

### Appropriate to delegate or augment

- Mechanical checks, standard conformance, diff summarization, duplicate detection, traceability assistance, generation of boundary cases, test suggestions, claim-to-source comparison, and preliminary review against an explicit rubric.
- Adversarial brainstorming to broaden human examination, with outputs treated as hypotheses.

### Must remain human-accountable

- Understanding intent, weighing tradeoffs, interpreting ambiguous evidence, determining customer or ethical significance, classifying novel material findings, and accepting a review disposition.
- Sensitive feedback and any formal professional sign-off.

### Verification expectations

AI review comments must be verified against the actual artifact and current authoritative standard. Reviewers watch for false positives, confident invented defects, missing system context, biased language, and correlated error when the same model helped create and review the work. High-consequence work requires independent methods, data, models, or qualified people where appropriate.

### Prohibited or constrained uses

No autonomous approval of high-consequence work, fabricated execution of tests, exposure of confidential artifacts to unapproved systems, anonymous AI-generated harassment, or comment flooding that transfers triage cost to the author. The reviewer cannot cite “the AI found it” as evidence without reproducing the issue.

## Experience, tool, and information needs

The Reviewer needs direct access to the artifact, runnable or observable behavior where possible, clear review criteria, decision history, source links, evaluation results, relevant customer evidence, and an efficient way to annotate and resolve findings. Tools should suppress noise and surface consequence. Review queues need ownership and service levels so independent judgment does not become a random wait state.

## Success measures

### Leading indicators

- Review requests include purpose, scope, self-review, evidence, and the decision needed.
- Turnaround is proportionate and predictable.
- Findings are prioritized and tied to explicit criteria or customer consequence.
- Boundary, failure, recovery, and AI-specific risks receive attention.
- Recurring comments become upstream checks or guidance.

### Lagging indicators

- Fewer escaped material defects and lower avoidable rework.
- Better customer, reliability, accessibility, security, and decision outcomes.
- Faster progression of low-risk work and stronger evidence for high-risk work.
- Greater calibration among creators and reviewers; declining dependence on a few gatekeepers.

### Countermetrics

Track review wait time, comment volume, reversal rate, false positives, rubber-stamp approvals, after-hours pressure, author psychological safety, concentration of reviewer load, and whether reviewers catch style issues while missing outcome failures.

## Pressures and pain points

- Rapidly growing artifact volume and expectations that review time should approach zero.
- Incomplete context, giant changes, and unclear review contracts.
- Social pressure to approve senior authors or block unfamiliar approaches.
- Ambiguous standards and conflicting sources of truth.
- Fear that raising a concern will be labeled resistance to AI or lack of team spirit.
- Review fatigue from repetitive issues that should have been automated upstream.
- Tension between maintaining relationships and recording consequential dissent.

## Failure modes and anti-patterns

- **Rubber stamp:** approves based on trust, urgency, or green automated checks without examination.
- **Style sovereign:** blocks work until it matches personal taste.
- **Comment confetti:** produces many low-value observations that hide material risk.
- **Drive-by rejection:** declares the work wrong without evidence or actionable direction.
- **Reviewer rewrite:** takes over authorship, slowing learning and blurring accountability.
- **Local optimum:** perfects the artifact while ignoring that it solves the wrong customer problem.
- **AI-on-AI assurance:** relies on the same failure-prone method for generation, testing, and approval.
- **Late gate:** first introduces risk or domain requirements after implementation is complete.
- **Status deference:** applies less scrutiny to powerful authors and harsher scrutiny to novices.

## Guardrails

- Every review has a stated purpose, scope, criteria, consequence, and accountable Decision Owner.
- Findings distinguish blocker, required change, recommendation, question, and preference.
- Reviewers disclose missing expertise, conflicts, AI assistance, and material uncertainty.
- High-risk decisions require appropriate independence and qualified review; low-risk reversible work gets a lighter path.
- Dissent is recorded and resolved, not erased through meeting pressure.
- Confidentiality, attribution, accessibility, and respectful conduct apply to review content.
- Approval covers only the reviewed scope and evidence at that time; it is not a blanket guarantee.

## Critical scenario

A team submits an AI-generated customer-onboarding flow. Automated tests pass, the prose is polished, and a model-based evaluator scores it highly. The Peer Reviewer notices that both generation and evaluation used closely related models and that none of the cases represent customers using assistive technology or those denied a required permission.

The Reviewer does not scatter dozens of copy edits. They identify one blocking issue: the evidence cannot support the claimed experience across material boundary cases. They reproduce a permission-loop failure, link it to the recovery requirement, and request human accessibility testing plus an independent evaluation set built from Support and Research evidence. Non-blocking tone suggestions are grouped separately. The Decision Owner approves a limited test only after the recovery path is fixed and monitored. Review has protected speed by focusing on consequential uncertainty instead of polishing every sentence.

## Representative statements

- “What decision will this review support, and what consequence should determine its depth?”
- “This is a blocking issue because it violates the recovery requirement; here is a reproducible case.”
- “This comment is a preference, not a requirement.”
- “The artifact is polished, but the evidence does not yet cover the people most affected by failure.”
- “Generation and evaluation share a failure mode; we need an independent check.”
- “I changed my view after seeing the source and test result.”

## Maturity progression

| Stage | Observable state |
| --- | --- |
| Reactive | Reviews late, inconsistently, and according to individual preference or urgency |
| AI-assisted | Uses automated and AI review tools, but noise increases and human accountability is unclear |
| Integrated | Applies risk-based review contracts, traceable evidence, calibrated findings, and systematic learning |
| AI-native | Routine conformance is automated; diverse human judgment focuses early on intent, novel risk, customer value, and consequential tradeoffs |

## Definition of ready and done

### An artifact is ready for peer review when

- Purpose, customer or stakeholder, scope, decision, consequence, and review request are clear.
- The creator has completed appropriate self-review and supplied evidence, sources, assumptions, and known limitations.
- The change is small or structured enough to understand, or the reason for its size is explicit.
- Relevant automated checks and specialist reviews have run or are clearly pending.

### A peer review is done when

- The agreed scope and material boundary cases have been examined.
- Findings are prioritized, actionable, and resolved or explicitly accepted by the proper Decision Owner.
- The disposition, evidence, limitations, and dissent are recorded.
- Recurring systemic improvements have owners without holding the immediate artifact hostage unnecessarily.

## Interview and discovery questions

1. What kinds of defects or weak assumptions do current reviews routinely miss?
2. Which comments repeat often enough to become an automated check or documentation change?
3. How do reviewers distinguish a blocker from taste?
4. Where does review wait time exceed the risk reduction it provides?
5. When do generation and evaluation share correlated failure modes?
6. Who can safely challenge work authored by a powerful or senior person?
7. What evidence lets a reviewer understand the customer's actual experience, including failure and recovery?
8. How is unresolved dissent preserved and decided?

## Connections to the 15 operating rules

This persona is essential to **Protect Engineering Velocity** and **Build With a Coordinated Team, Not Alone**: review catches expensive mistakes while risk-based scope prevents ceremonial delay. It also supports **Stay Flexible in Pursuit of Value**, **Assume Best Intent**, **Turn Complaints Into Fixes or Complete Proposals**, **Treat Documentation as Executable Infrastructure**, **Expand Design Beyond Screens**, and **Organize Around One Exceptional Customer Experience**. It supplies the independent human judgment that inexpensive AI-generated output does not provide on its own.
