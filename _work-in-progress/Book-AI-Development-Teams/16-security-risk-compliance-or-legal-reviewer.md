# Persona: Security, Risk, Compliance, or Legal Reviewer

> Converts consequential obligations into practical, risk-tiered guardrails that let safe work move quickly and dangerous ambiguity surface early.

## Purpose and scope

The Security, Risk, Compliance, or Legal Reviewer helps a team recognize, evaluate, and treat organizational risk while there is still freedom to change the design. The role translates law, regulation, policy, contracts, security threats, ethical commitments, and risk appetite into controls that people and AI agents can actually follow.

This is an organizational role, not a claim that security, privacy, compliance, and legal expertise are interchangeable job titles. In many organizations specialists fill each discipline. This persona describes their shared operating function: classify risk, identify the right authority, make obligations actionable, and route residual-risk acceptance to the accountable owner. A reviewer is an enabling design partner—not a ceremonial signature at the end of delivery.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary objective | Enable intended value within explicit risk appetite and obligations |
| Unit of attention | A use case, data flow, decision, control, and potential harm |
| Optimizes for | Proportionate control, early clarity, and auditable accountability |
| Protects against | Material security, privacy, legal, regulatory, ethical, and reputational harm |
| Key partners | Product, engineering, AI engineering, architecture, operations, QA, domain experts, and decision owners |
| Typical time horizon | Design through operation, including incident and retirement |
| Essential stance | “Yes, if” or “not yet, because”—with a concrete path forward |

## Core mandate

Create a fast lane for ordinary, bounded work and deeper review for novel, irreversible, high-impact, or regulated work. The reviewer makes the basis of classification visible, names the control objective rather than prescribing habit, and distinguishes required obligations from recommendations. They ensure that any accepted exception has the right authority, evidence, mitigation, monitoring, and expiry.

The reviewer does not attempt to eliminate all risk. They help the organization take risk intentionally, prevent unqualified people from accepting it on behalf of others, and make controls durable enough for both humans and agents to execute consistently.

## Outcomes and motivations

- Low-risk work proceeds through documented self-service guardrails.
- High-risk work receives expert attention before commitments become expensive.
- Teams understand what harm a control prevents and what evidence demonstrates it works.
- Obligations are traceable from authority to requirement, implementation, validation, and operation.
- Customers, employees, partners, and the organization are protected from foreseeable misuse and failure.
- Exceptions are explicit, time-bound, monitored, and decided at the correct level.

## Jobs to be done

- **When a use case is proposed,** I want to classify its data, users, autonomy, impact, and reversibility, **so that review effort matches potential harm.**
- **When a rule applies,** I want to cite its authoritative source and translate it into a testable control objective, **so that teams can implement without guessing.**
- **When several designs could comply,** I want to state the boundary and evaluate options, **so that engineering retains solution autonomy.**
- **When evidence reveals a gap,** I want to describe severity, exposure, and a workable treatment, **so that the issue moves toward resolution rather than waiting for a committee.**
- **When a team requests an exception,** I want the right risk owner to see alternatives and residual exposure, **so that acceptance is informed and accountable.**
- **When the system changes in production,** I want control monitoring and reassessment triggers, **so that approval does not become stale.**

## Responsibilities and boundaries

### Owns

- Review framework, risk tiers, applicability criteria, and discipline-specific interpretations.
- Traceability from obligations and threats to control objectives and required evidence.
- Review findings, severity, required escalation, and review records.
- Standard patterns, self-service checklists, and review service levels by risk tier.

### Co-owns

- Threat modeling, privacy impact analysis, misuse analysis, and control design with specialists and engineers.
- AI governance, evaluation requirements, incident playbooks, and continuous control monitoring.
- Customer and employee disclosures with product, design, communications, and counsel.

### Contributes to

- Architecture, data governance, procurement, vendor review, release criteria, agent permissions, and retirement plans.
- Training, templates, and communities of practice that improve first-line risk decisions.

### Does not own

- Product priorities, implementation sequencing, or technical architecture.
- Business risk acceptance unless formally delegated that authority.
- Every risk discipline. The reviewer must route questions outside their competence to the proper specialist.
- A universal veto based on preference. A documented mandatory prohibition is different from a personal objection.

## Decision rights and escalation triggers

The reviewer may determine which policies and obligations apply, assign a review tier using published criteria, require evidence for mandatory controls, and block an automated release gate when a binding requirement or agreed criterion fails. They recommend treatment; the designated decision or risk owner accepts residual risk.

Escalate when the use case could materially affect safety, rights, employment, credit, access to essential services, regulated decisions, or vulnerable populations; uses sensitive or restricted data; introduces external model or data transfer; grants an agent consequential tools or unsupervised action; creates novel surveillance or deception risk; lacks a lawful basis or required disclosure; has an unresolved critical vulnerability; conflicts with policy or contract; cannot be reversed or contained; or requests an exception beyond the requester’s authority.

## Inputs and evidence

Inputs include the customer job and intended benefit, system and data-flow diagrams, data classification and retention, user population and geography, model and vendor documentation, agent tools and permissions, autonomy and human-review design, contracts, laws, regulations, policies, standards, threat intelligence, evaluation results, accessibility and impact research, incident history, rollout and rollback plans, and named accountable owners.

Evidence must distinguish facts, interpretations, and assumptions. A vendor assertion is not the same as independent validation; a policy requirement is not automatically a legal requirement; and a control’s existence is not evidence of its effectiveness.

## Outputs and artifacts

- Risk classification and review plan with rationale and service level.
- Applicability matrix and source citations.
- Threat model, misuse-case analysis, privacy or algorithmic impact assessment.
- Control objectives, approved implementation patterns, and verification criteria.
- Findings register with severity, owner, treatment, due date, and status.
- Disclosure, consent, retention, access, audit, and human-oversight requirements.
- Risk recommendation and residual-risk statement for the decision owner.
- Time-bound exception record and continuous-monitoring or reassessment plan.

## Operating rhythm

At intake, a lightweight questionnaire routes work by risk. During discovery and design, the reviewer tests purpose, affected people, data, autonomy, alternatives, and control options in the working artifact. Before release, they verify tier-appropriate evidence and summarize open risk. In production, incidents and material changes to models, data, users, jurisdictions, or permissions trigger reassessment; portfolio review looks for cumulative risk.

## Capabilities and literacies

- Depth in cybersecurity, privacy, compliance, law, safety, ethics, or enterprise risk.
- Risk assessment, threat modeling, control design, evidence review, and incident response.
- AI literacy across models, retrieval, tools, injection, provenance, evaluation, drift, and oversight.
- Ability to read architecture, contracts, policy, logs, tests, and customer journeys.
- Plain-language translation and judgment about materiality, uncertainty, reversibility, and compensating controls.

## Mindsets and observable behaviors

The effective reviewer is precise, calm, and proportionate. They label concerns mandatory, risk-based, or advisory; explain the harm pathway; and offer options. They enter early, reuse approved patterns, say no when a boundary is real, invite challenge, and never manufacture authority.

## Collaboration map

| Partner | Exchange |
|---|---|
| Product and customer research | Intended benefit, affected users, context, and disclosures |
| Engineering and architecture | Data flows, threats, control options, and evidence hooks |
| AI/agent engineer | Model provenance, evaluations, tools, permissions, autonomy, and escalation |
| QA/evaluation engineer | Abuse cases, thresholds, validation, red teaming, and drift signals |
| Operations and support | Access, monitoring, incidents, complaints, containment, and recovery |
| Domain expert | Consequence severity and domain-specific correctness |
| Decision/risk owner | Alternatives, recommendation, residual exposure, and acceptance |

## Working with AI

### Delegate

AI may inventory controls, compare documents, draft questionnaires, extract clauses, generate threat scenarios, summarize evidence, and prepare traceability.

### Retain as human accountability

Qualified humans interpret obligations, determine materiality, resolve conflicts among authorities, advise on rights and harms, approve novel control strategies, and recommend or accept consequential risk according to delegated authority.

### Verify

Check citations, jurisdiction, effective date, and extracted facts; test threats against the actual architecture; and route discipline-specific conclusions to the right specialist.

### Prohibited or constrained

Do not send privileged, export-controlled, personal, confidential, or security-sensitive material to unapproved models. Do not use AI output as legal advice, final compliance determination, or risk acceptance. Do not let an agent grant its own exception, expand its own permissions, suppress a finding, or approve a control it generated.

## Experience, tool, and information needs

The role needs current obligation, policy, system, data, model, contract, vendor, control, risk, exception, and incident records; secure access to code, configuration, tests, and logs; automated checks; and named risk owners. Teams need clear intake, thresholds, response targets, reusable patterns, and access to specialists.

## Success measures

### Leading indicators

- Percentage of work classified early and correctly by risk tier.
- Time to first actionable guidance and time to close findings by severity.
- Adoption and pass rate of approved self-service patterns.
- Traceability and automated evidence coverage for mandatory controls.

### Lagging indicators

- Material incidents, audit findings, rights impacts, losses, and regulatory breaches.
- Recurrence of known control failures.
- Cost and duration of containment, remediation, and notification.
- Percentage of expired exceptions actually closed or renewed by authority.

### Countermetrics

- Low-risk cycle time and abandoned work caused by review friction.
- Number of blanket prohibitions where bounded alternatives existed.
- Late findings that could have been identified during discovery.
- “Zero incidents” achieved by suppressing reporting or avoiding useful innovation.

## Pressures and pain points

Changing regulation, inconsistent policy, opaque vendors, uncertain models, and compressed dates create pressure to approve informally or prohibit broadly. Teams arrive after choices are fixed, and evidence may be voluminous but weak. Reviewers need timely access, specialist capacity, and clear risk owners.

## Failure modes and anti-patterns

- Treating every use case as equally risky.
- Appearing only at the final gate and discovering foundational problems.
- Saying “legal says no” without authority, rationale, or a compliant alternative.
- Confusing checklist completion with control effectiveness.
- Copying requirements from a different jurisdiction or context.
- Allowing permanent “temporary” exceptions.
- Treating vendor certification as complete product assurance.
- Approving a model name while ignoring prompts, data, tools, permissions, and operating context.
- Using committees to diffuse accountability for a hard decision.

## Guardrails

Publish risk tiers, escalation thresholds, authorities, and service levels. Mandatory claims cite current sources; controls map to objectives and evidence. Apply least privilege, minimization, separation of duties, auditability, appeal, and rollback proportionately. High-impact decisions require human oversight and recourse. Exceptions are scoped, owned, monitored, and expiring. Material changes trigger reassessment.

## Critical scenario: the high-value agent with broad access

An agent could shorten a claims process from days to minutes by reading records, recommending outcomes, and updating cases. The reviewer classifies recommendations as high impact and write actions as consequential, cites applicable obligations, and stages the design.

Summarization pilots on minimized approved data. Recommendations cite sources and require trained human review. Updates use field-level permissions, confirmation, immutable logs, and limits. QA tests subgroups, hallucination, injection, and overrides; customers get explanation and correction routes. The decision owner approves a limited cohort with stop thresholds. Risk tiering creates a safe path to evidence without a blanket ban.

## Representative statements

- “Is that a binding requirement, a policy choice, or our recommendation?”
- “The concern is the harm pathway; here are three ways to satisfy the control objective.”
- “This tier can use the approved pattern without another meeting.”
- “The exception must be accepted by the person who owns the consequence.”
- “Approval covered this data, population, and permission set—not every future use.”

## Maturity progression

| Stage | Characteristics |
|---|---|
| Reactive | Late checklist review, inconsistent interpretation, and incident-driven controls |
| AI-assisted | AI inventories evidence and drafts analyses; specialists verify all conclusions |
| Integrated | Risk-tiered intake, reusable patterns, automated evidence, and continuous reassessment are embedded in delivery |
| AI-native | Obligations and controls are machine-readable; agents enforce bounded rules while humans govern ambiguity, rights, materiality, and exceptions |

## Definition of ready and done

**Ready for review:** purpose, users, benefit, owner, risk tier proposal, data flows, model and vendor choices, permissions, jurisdictions, impact, alternatives, and architecture are sufficiently described; open assumptions are named; and the reviewer can inspect the working artifact.

**Done for review:** applicable obligations and threats are recorded; mandatory controls have verified evidence; findings are closed or assigned a valid exception; disclosures, monitoring, incident response, rollback, and reassessment triggers are active; residual risk is stated plainly; and the authorized owner has recorded the decision.

## Interview and discovery questions

1. Who can be harmed, denied, misled, exposed, or unable to appeal?
2. What data enters, leaves, persists, trains, or becomes visible to a vendor?
3. What can the system or agent do without another person’s confirmation?
4. Which authority makes each claimed requirement binding?
5. What safer alternative preserves most of the intended value?
6. How will we know a control is operating, not merely documented?
7. Who has authority to accept the remaining consequence, and for how long?
8. What change would invalidate this review?

## Connections to the 15 operating rules

1. **Protect Engineering Velocity:** gives low-risk work fast paths and focuses expertise on genuine exposure.
2. **Cap Meetings at 60 Minutes:** uses written prework and ends review meetings with a decision, owner, and action.
3. **Use a Live Portfolio of Bets:** adds risk, evidence, and stop conditions to each bet.
4. **Put Product in the Working Environment:** lets product see permissions, disclosures, and failure consequences directly.
5. **Do Not Let Product Control Engineering Time:** states control objectives while engineering selects the implementation.
6. **Create a Daily Product–Engineering Jam:** resolves risk questions while designs remain reversible.
7. **Eliminate Unearned Monthly Meetings:** replaces recurring approval forums with self-service controls and exception triggers.
8. **Stay Flexible in Pursuit of Value:** keeps stable guardrails while allowing multiple compliant paths.
9. **Assume Best Intent:** investigates evidence without minimizing harmful behavior.
10. **Turn Complaints Into Fixes or Proposals:** expresses findings with impact, treatment, owner, and next step.
11. **Treat Documentation as Executable Infrastructure:** makes obligations, permissions, controls, and exceptions machine-usable.
12. **Expand Design Beyond Screens:** governs data flows, agent behavior, explanations, consent, errors, and recourse.
13. **Organize Around One Exceptional Customer Experience:** protects trust and rights across the whole journey.
14. **Build With a Coordinated Team:** integrates legal, risk, technical, domain, design, and customer judgment.
15. **Make Teaching and Learning Everyone’s Job:** publishes patterns and teaches teams to classify and treat routine risk.
