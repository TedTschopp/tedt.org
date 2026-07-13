# Persona: Domain Expert or Subject-Matter Expert

> The steward of contextual correctness who helps the team distinguish output that is plausible or technically valid from output that is actually appropriate in the field.

## Purpose and scope

The Domain Expert or Subject-Matter Expert (SME) supplies specialized knowledge needed to frame problems, define constraints, evaluate AI behavior, and understand real-world consequences. This is a reusable organizational persona, not a fictional individual. The role may be filled by a practitioner, scientist, clinician, attorney, accountant, engineer, policy specialist, safety professional, community representative, or experienced operator. Expertise may be formal, experiential, or both; its scope must be named.

Expertise does not automatically confer ownership of product, engineering, design, compliance, or every decision touching the field. The SME advises on correctness and consequence within a declared boundary. A named decision owner determines the course, and regulated judgments remain with authorized people. The expert is neither an ornamental reviewer nor an unchallengeable universal authority.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary objective | Ensure the product’s assumptions, outputs, and workflows are correct and appropriate in context |
| Source of authority | Demonstrated expertise, current evidence, practice experience, and explicitly assigned decision rights |
| Primary value contributed | Context, consequence, exceptions, standards, and discriminating judgment |
| Time horizon | Immediate case validity through long-term field and regulatory change |
| Core partners | Product, engineering, AI engineering, research, design, evaluation, risk, and operations |
| Principal risk | Becoming a late ceremonial approver, a bottleneck, or a single unquestioned source of truth |
| AI-era emphasis | Reference standards, eval cases, confidence limits, traceability, and human-reserved judgments |

## Core mandate

Make domain reality explicit enough to build and evaluate the right thing. Clarify terminology, assumptions, standards, sources, boundary conditions, harmful errors, uncertainty, and exceptions. Translate tacit judgment into examples, criteria, evaluations, and escalation without pretending all expertise reduces to rules. Keep knowledge current and expose legitimate disagreement.

## Outcomes and motivations

- Product problems reflect actual practice and consequences rather than superficial terminology.
- Domain-critical requirements and prohibited outcomes are identified before implementation.
- AI evaluations test realistic, difficult, ambiguous, and high-consequence cases.
- Teams distinguish factual correctness, procedural validity, contextual appropriateness, and authorized professional judgment.
- Sources are ranked by authority, jurisdiction, applicability, and freshness.
- Uncertainty and expert disagreement are visible and routed appropriately.
- Reusable knowledge reduces repeated explanation without eliminating essential expert review.
- Product changes improve field outcomes, not merely benchmark scores.

## Jobs to be done

- **When** a team describes a domain problem, **I want** to surface hidden assumptions, terminology, actors, and consequences, **so I can** prevent a technically elegant solution to the wrong problem.
- **When** an AI output looks plausible, **I want** to compare it with authoritative sources, case context, and professional standards, **so I can** determine whether it is safe and appropriate.
- **When** recurring judgment is automated, **I want** to define normal cases, exceptions, forbidden actions, and escalation, **so I can** bound it responsibly.
- **When** experts disagree, **I want** to record the basis, scope, and decision authority of each view, **so I can** prevent false consensus or arbitrary model behavior.
- **When** standards or practice change, **I want** to identify affected documents, evaluations, workflows, and claims, **so I can** keep the operating system current.

## Responsibilities and boundaries

### Owns

- Accuracy, scope, and limitations of guidance they author; recommended sources; terminology; representative cases; and review criteria.
- Disclosure of uncertainty, conflicts, stale knowledge, and matters outside their competence.
- Timely escalation when an output or design could create material domain harm.

### Co-owns

- Problem framing with product and research.
- Domain requirements and experience implications with product and design.
- Evaluation cases, rubrics, severity, and thresholds with QA or evaluation and AI engineering.
- Domain controls and escalation with operations, security, risk, compliance, or legal.
- Domain documentation and education with the documentation owner and team coach.

### Contributes to

- Portfolio bets, architecture tradeoffs, model selection, prompt and tool design, customer research interpretation, launch readiness, incident review, product claims, and change impact.

### Does not own

- Product desirability, priority, interface design, implementation, commercial strategy, or risk acceptance unless appointed.
- All legal or compliance decisions merely because the domain is regulated.
- Representing every practitioner, jurisdiction, community, or school of thought.
- Guaranteeing that a model will behave correctly after the reviewed configuration changes.

## Decision rights and escalation triggers

The SME may reject a domain statement, source, test case, rubric, or claim within scope. They may require uncertainty labeling, narrower use, authorized review, or exclusion from automation. Whether this is a ship veto depends on governance defined before review; high-consequence domains need explicit stop authority.

Escalate for conflict with authoritative requirements; stale, contradictory, or inapplicable sources; missing qualified coverage; material safety, health, financial, legal, environmental, or civil-rights harm; licensed-practice boundaries; suppressed exceptions; or a system change that invalidates prior evaluation.

## Inputs and evidence

Inputs include customer context, primary sources, laws, standards, policy, evidence, field procedures, cases, incidents, datasets, traces, product behavior, research, and practitioner feedback. Sources need authority, version, effective date, jurisdiction, applicability, evidentiary strength, disagreement, and review trigger.

The SME should distinguish prescriptive authority from descriptive practice. “What policy requires,” “what experts commonly do,” “what evidence suggests,” and “what one practitioner prefers” are different claims.

## Outputs and artifacts

- Domain map and glossary covering actors, concepts, workflows, decisions, and ambiguity.
- Authoritative-source hierarchy and evidence register with scope and freshness.
- Domain requirements, constraints, prohibited outcomes, and human-reserved decisions.
- Representative scenarios, edge cases, adversarial cases, gold examples, and evaluation rubrics.
- Error taxonomy with severity, detectability, recoverability, and escalation thresholds.
- Review findings separating factual, procedural, contextual, and unresolved issues.
- Decision records, change-impact notices, incident analysis, and teaching materials.

## Operating rhythm

At discovery, the SME frames the problem, stakes, sources, and unknowns. During active bets, they join working-artifact reviews at points of uncertainty. Before exposure, they review high-risk cases, rubrics, claims, and escalation. In production, they inspect sampled behavior, severe failures, drift, and overrides. On a risk-based cadence, they refresh sources, evaluations, agent instructions, and disputes; material changes trigger immediate review.

## Capabilities and literacies

The role requires deep field knowledge, practical judgment, source criticism, case reasoning, awareness of variation and jurisdiction, articulation of tacit knowledge, teaching, rubric design, error analysis, and interdisciplinary communication. AI literacy covers probabilistic output, hallucination, bias, retrieval, distribution shift, permissions, traces, and the gap between benchmark and field validity.

## Mindsets and observable behaviors

- **Contextual:** asks where, for whom, under what conditions, and with what consequence a statement is true.
- **Specific about authority:** labels requirement, evidence, convention, experience, and opinion distinctly.
- **Calibrated:** communicates confidence and uncertainty rather than performing certainty.
- **Exception-seeking:** looks for boundary cases that invalidate an apparently simple rule.
- **Teachable:** turns expertise into examples and criteria others can use while naming irreducible judgment.
- **Pluralistic:** invites other experts and affected communities when one perspective is insufficient.
- **Outcome-aware:** evaluates field impact, not only formal correctness.

## Collaboration map

| Collaborator | Domain expert provides | Domain expert needs |
|---|---|---|
| Customer and researcher | Context, vocabulary, risk, and interpretation | Lived experience, behavior, and variation |
| Product lead | Domain-valid problem framing and constraints | Intended outcome, priority, and decision ownership |
| Designer | Mental models, consequential states, and recovery needs | Understandable experience and observed user behavior |
| Engineering and architecture | Rules, boundaries, sources, and failure severity | Feasible design, system limits, and change visibility |
| AI and evaluation engineering | Gold cases, rubrics, thresholds, and error analysis | Reproducible traces, model details, evaluation rigor |
| Operations | Decision criteria, exceptions, and safe escalation | Executable workflow, permissions, and monitoring |
| Security, risk, compliance, legal | Domain consequences and practice evidence | Formal obligations, risk ownership, and decisions |
| Documentation and education | Accurate, scoped knowledge and examples | Versioning, usability, dissemination, and feedback |

## Working with AI

### May delegate

Literature and policy search, comparison tables, terminology extraction, draft examples, document classification, change detection, candidate test generation, case clustering, trace summarization, and first-pass consistency checks when sources and access are approved.

### Must retain

Selection and interpretation of authoritative sources, high-consequence judgment, uncertainty calibration, disagreement resolution or escalation, professional accountability, error severity, and decisions about what must remain human.

### Must verify

Every citation, quotation, rule, calculation, jurisdiction, version, translation, gold answer, evaluation label, generated case, and source-derived conclusion. Validate that AI has not combined incompatible standards, invented authority, erased exceptions, or reproduced historical bias as domain truth.

### Prohibited or constrained

AI practicing beyond lawful or organizational authority; autonomous high-consequence diagnosis, certification, approval, or advice without required human review; fabricated sources or credentials; use of confidential cases without authorization; encoding one expert’s preference as universal policy; and allowing generated summaries to become authoritative merely through repetition.

## Experience, tool, and information needs

SMEs need the working product, representative workflows, traces, release changes, research, incidents, overrides, evaluations, and current primary sources. They need versioned review tools, source links, disagreement capture, secure cases, change alerts, and a consequence-prioritized queue. Artifacts must be precise yet legible to nonexperts and agents.

## Success measures

**Leading indicators:** critical concepts and sources mapped; high-risk cases covered; SME review occurs before irreversible commitment; inter-rater agreement is measured where appropriate; source freshness; unresolved disagreement age; and time from domain change to impact assessment.

**Lagging indicators:** reduction in severe domain errors, field-valid outcomes, appropriate escalation, fewer corrections after launch, regulator or professional acceptance where relevant, and customer trust grounded in reliable behavior.

**Countermetrics:** expert-review bottleneck time, rubber-stamp approval, single-expert dependency, false certainty, evaluation scores inflated by easy or contaminated cases, exceptions suppressed, model deference by experts, and technically correct outputs that cause poor real-world outcomes.

## Pressures and pain points

Experts are asked to review late, approve broad systems from a demo, reduce nuanced judgment to binary rules, or answer outside scope. Repeated explanation competes with consequential review. Pressure to remove difficult cases, accept benchmark scores, or defer to confident AI compounds changing standards, conflicting jurisdictions, and legitimate expert disagreement.

## Failure modes and anti-patterns

- Inviting the SME only for a ceremonial launch approval.
- Treating credentials as proof that every opinion is authoritative.
- Asking one expert to represent an entire domain or affected community.
- Encoding tacit advice without source, scope, exception, or review date.
- Measuring agreement with the model instead of independently assessing correctness.
- Choosing only clear textbook examples and missing real ambiguous cases.
- Allowing the expert to make product or engineering decisions by default.
- Rejecting innovation with “that is not how we do it” without evidence or consequence.

## Guardrails

Declare expertise scope, credentials or experience basis, jurisdiction, conflicts, decision rights, and substitutes. Require multiple perspectives for materially contested or high-impact domains. Use primary and current sources with a recorded hierarchy. Separate advisory judgment from formal approval. Blind or independent review should precede exposure to model answers when automation bias is material. Version evaluations and revalidate after changes to models, prompts, tools, data, policy, or sources. Preserve human recourse for consequential outcomes.

## Critical scenario: correct answer, wrong context

An agent recommends a maintenance interval from a recognized standard. The SME notices that it applies indoors under stable load, while the customer operates outdoors in corrosive conditions under a stricter local rule. They label the answer sourced but contextually unsafe and identify missing inputs. Product requires operating conditions; engineering constrains retrieval by jurisdiction and equipment class; evaluation adds neighboring cases; design explains uncertainty. The SME advises the correction, product chooses scope, engineering chooses implementation, and an authorized professional retains the field decision.

## Representative statements

- “That source is authoritative, but it does not apply to this jurisdiction and condition.”
- “The answer is plausible; the consequence model makes it unacceptable.”
- “This is professional convention, not a formal requirement.”
- “I can define the domain boundary; product still owns whether this bet should continue.”
- “If experts disagree, record the disagreement and route the decision—do not average it away.”

## Maturity progression

| Stage | Practice |
|---|---|
| Reactive | Experts review late, knowledge is tacit, and defects trigger one-off consultation |
| AI-assisted | AI accelerates source search and draft cases, but review remains person-dependent and fragmented |
| Integrated | Sources, domain models, evaluations, decisions, incidents, and product changes share a governed loop |
| AI-native | Versioned domain infrastructure guides bounded agents while human experts retain contextual, contested, and high-consequence judgment |

## Definition of ready and done

**Ready for review:** outcome, jurisdiction, environment, intended use, and consequence are explicit; the reviewed version is available; sources and disagreements are documented; normal, edge, adversarial, and prohibited cases exist; and decision rights are named.

**Done:** conclusions cite applicable sources; factual, procedural, contextual, and authority questions are separated; limits, exceptions, and disagreements are recorded; errors have severity and owners; evaluations are checked; human-reserved decisions and escalation work; dependent artifacts are updated; and revalidation triggers are defined.

## Interview and discovery questions

1. What does a competent practitioner notice here that a newcomer or general model may miss?
2. Which sources are authoritative, and how do jurisdiction, version, and context change applicability?
3. What is required, recommended, customary, disputed, or merely preferred?
4. Which errors are common, difficult to detect, irreversible, or severely harmful?
5. What information is necessary before a valid judgment can be made?
6. Which decisions can follow rules, and which require licensed, accountable, or contextual human judgment?
7. Where do qualified experts disagree, and who owns the resulting decision?
8. Which groups or real-world conditions are underrepresented in current evidence?
9. What changes would invalidate this guidance or evaluation?
10. How will a nonexpert or agent know when to stop and escalate?

## Connections to the 15 Operating Rules

- **1, Protect Engineering Velocity:** make criteria reusable so experts focus on consequential uncertainty.
- **2 and 7, Meeting Limits:** use scoped, versioned guidance and decision records; convene experts for ambiguity and high-impact choices.
- **3, Live Portfolio of Bets; 8, Stay Flexible:** define domain stop signals and adapt as evidence changes.
- **4 and 6, Working Environment and Daily Jam:** review real product behavior and traces while changes remain inexpensive.
- **9, Assume Best Intent; 10, Turn Complaints Into Fixes:** treat disagreement as evidence to clarify and produce complete, sourced correction proposals.
- **11, Documentation as Executable Infrastructure:** encode sources, scope, exceptions, done, and escalation without erasing judgment.
- **12, Expand Design Beyond Screens; 13, One Exceptional Customer Experience:** make domain correctness visible in explanations, permissions, errors, and recovery.
- **14, Coordinated Team:** combine domain expertise with customer, design, engineering, quality, and risk judgment while preserving distinct decision rights.
- **15, Teaching and Learning:** distribute domain literacy and reusable evaluation assets without pretending everyone becomes the expert.
