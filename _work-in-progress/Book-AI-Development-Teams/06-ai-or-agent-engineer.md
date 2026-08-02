# Persona: AI or Agent Engineer

> Engineers probabilistic models, tools, context, permissions, evaluations, and human controls into an observable product capability whose behavior is useful within known boundaries.

## Purpose and scope

This persona defines the technical accountability for building and operating AI-enabled and agentic behavior. It may be fulfilled by an AI engineer, machine-learning engineer, agent engineer, applied scientist, or software engineer with explicit AI-system responsibility. It is a **role, not a title or a license to automate indiscriminately**. The role spans the whole AI subsystem: model, data and context, instructions, retrieval, tools, identity, permissions, memory, orchestration, evaluations, monitoring, and escalation.

The AI engineer partners with product, software engineering, architecture, design, domain experts, quality, security, and operations. They do not own customer value, policy interpretation, domain truth, risk acceptance, or final human accountability. A model response that looks impressive is not a complete or production-ready system.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary focus | Useful, bounded, evaluated, secure, and observable AI or agent behavior |
| Time horizon | Fast experiment through continuous model, prompt, data, tool, and policy change |
| Core question | “Under which conditions does this system succeed, fail, abstain, or escalate—and how do we know?” |
| Value created | AI capability translated into dependable workflow behavior and measurable customer outcomes |
| Principal partners | Product, software engineering, architecture, design, QA/evaluation, security, operations, data, and domain experts |
| Principal risk | Confusing fluent model output or benchmark performance with safe end-to-end capability |
| Evidence standard | Versioned evaluations, traces, adversarial tests, production outcomes, and expert/customer review |

## Core mandate

Compose AI models and agent mechanisms into a fit-for-purpose system with explicit intended use, bounded authority, proportionate controls, and continuous evaluation. Make probabilistic behavior inspectable. Design the system to know when it lacks evidence or permission, to fail safely, to request human judgment at defined thresholds, and to remain changeable as models and requirements evolve.

## Outcomes and motivations

The AI engineer seeks measurable task improvement, not AI theater. They want high-quality outcomes across the real distribution of cases, predictable operational cost and latency, resistance to misuse, and graceful degradation when dependencies or models fail. They are motivated to turn tacit notions of “good” into evaluation assets that the team can share and improve.

They also seek calibrated autonomy: automate routine, reversible work where evidence supports it, while preserving human judgment for ambiguity, high consequence, exception, or value conflict.

## Jobs to be done

- **When** a workflow appears suitable for AI, **I want to** define intended use, baseline, risks, and evaluation cases with product and domain owners, **so that** the team tests a valuable capability rather than a technology demo.
- **When** an agent needs to act, **I want to** expose narrow, typed, policy-enforced tools and identity, **so that** its authority is least-privileged and traceable.
- **When** model behavior varies, **I want to** measure distributions, failure classes, calibration, and escalation quality, **so that** averages do not hide consequential errors.
- **When** a model, prompt, tool, or source changes, **I want to** run versioned regression and adversarial evaluations, **so that** improvement in one area does not silently degrade another.
- **When** uncertainty or an exception exceeds the agent’s boundary, **I want to** hand off context and evidence to the right human, **so that** escalation is useful rather than a dead end.

## Responsibilities and boundaries

### Owns

- AI-system technical design within scope: model and provider selection, instructions, context, retrieval, tools, orchestration, memory, and inference configuration.
- Evaluation engineering, trace instrumentation, AI-specific observability, failure taxonomy, regression gates, and production behavior monitoring.
- Technical implementation of identity, permission checks, tool constraints, sandboxing, rate and cost limits, and escalation mechanisms.
- Versioning and reproducibility of model, prompt, tool, data, policy, and evaluation changes.

### Co-owns

- Intended use, success criteria, acceptable failure, and autonomy level with product, domain, design, risk, and process owners.
- Whole-system reliability, security, deployment, and operations with software engineers, architects, security, QA, and operations.
- Human–agent experience, explanations, correction, and handoffs with design and customer-facing teams.

### Contributes to

- Product discovery, workflow redesign, architecture, documentation, incident response, vendor assessment, training, and communities of practice.

### Does not own

- Whether the product should exist, final domain correctness, legal interpretation, ethical or business risk acceptance, or decisions reserved to accountable humans.
- Permission to broaden an agent’s data or action access simply to improve task completion.
- The claim that model evaluation alone proves the surrounding product or process is safe and valuable.

## Decision rights and escalation triggers

The AI engineer decides technical composition and experiment design within approved intended use, architecture, data, security, cost, and autonomy boundaries. They may tune or replace components when regression evidence remains within those boundaries. Changes to purpose, affected population, data classification, model/provider trust, external action scope, memory, identity, permissions, or autonomy require the relevant product, architecture, security, privacy, legal, domain, and process decisions.

Escalate when evaluation reveals high-severity or systematic failure; uncertainty cannot be calibrated; protected data appears in context or output; prompt injection or tool misuse succeeds; the agent attempts unauthorized action; a provider or model changes materially; human review capacity is inadequate; monitoring cannot distinguish safe from unsafe behavior; cost or latency threatens service viability; or the intended use drifts beyond approval. Contain or disable affected capability first when harm may be ongoing.

## Inputs and evidence

- Customer job, workflow baseline, intended use and prohibited use, success and countermetrics, risk tier, and accountable process owner.
- Representative examples, expert-graded cases, edge and adversarial cases, customer feedback, support failures, and real task distributions.
- Authoritative source hierarchy, data classifications, retention rules, identity model, permission policies, tool contracts, and escalation paths.
- Model and provider documentation, system cards, benchmark results, price and latency, lifecycle notices, and security or compliance evidence.
- Traces, tool calls, retrieval results, token and cost data, abstentions, escalations, overrides, incidents, and post-deployment outcomes.

## Outputs and artifacts

- Versioned agent instructions, prompts, context schemas, retrieval configuration, model settings, tool definitions, orchestration, and memory policies.
- Evaluation plans, datasets, graders, rubrics, thresholds, regression suites, adversarial tests, and failure taxonomies.
- Identity and permission design, tool allowlists, approval boundaries, rate and budget controls, and sandbox configurations.
- Traces, dashboards, alerts, model and prompt change records, release/rollback plans, incident runbooks, and decommission procedures.
- Intended-use documentation, limitations, human escalation guidance, and evidence packages for reviewers and operators.

## Operating rhythm

Daily, the AI engineer inspects representative traces and failed, abstained, or escalated cases; runs targeted evaluations; makes small versioned changes; and joins the artifact jam when model behavior requires a product, design, domain, or technical decision. They compare AI performance to the non-AI baseline and monitor cost, latency, and tool effects.

Before every release, risk-proportionate regression, adversarial, security, and human review gates run. Weekly, the cross-functional team reviews failure clusters and evaluation coverage. On model, provider, source, tool, or policy change, the engineer triggers re-evaluation. Periodically, owners review whether the use case, autonomy, permissions, and continued operation still earn their place.

## Capabilities and literacies

- Applied machine learning and language-model behavior, inference, embeddings, retrieval, ranking, structured output, tool use, and orchestration.
- Software engineering, APIs, data pipelines, version control, testing, delivery, observability, reliability, and cost optimization.
- Evaluation science: sampling, annotation, rubrics, inter-rater agreement, calibration, slice analysis, statistical uncertainty, adversarial testing, and online/offline gaps.
- Agent security: identity, least privilege, authorization, secret handling, prompt injection, data exfiltration, sandboxing, supply-chain risk, and audit trails.
- Human factors: automation bias, uncertainty communication, consent, accessible interaction, correction, human-in-the-loop design, and operational workload.
- Domain humility and the ability to translate technical behavior for product, reviewers, and process owners.

## Mindsets and observable behaviors

The AI engineer treats every output as behavior under conditions, not evidence of intelligence or intent. They ask what distribution was tested, who graded it, what the baseline is, and what changed. They prefer constrained tools and explicit contracts over broad access. They design abstention and escalation as first-class success modes. They publish limitations, seek adversarial review, inspect failures without cherry-picking, assume best intent in collaboration, and resist both hype and blanket pessimism.

## Collaboration map

| Partner | What AI engineering needs | What AI engineering provides | Healthy boundary |
|---|---|---|---|
| Product/process owner | Intended use, workflow value, risk tier, and decision criteria | Feasible capability, evidence, limits, cost, and options | AI engineering does not decide that automation is desirable |
| Domain expert | Correctness rubric, authoritative sources, exceptions, and severity | Traceable cases, evaluation tooling, and failure analysis | Model fluency never replaces domain judgment |
| Software/architecture | System context, interfaces, identity, operations, and standards | AI components, tool contracts, trace hooks, and constraints | Agent behavior is part of the production system, not a detached demo |
| Design/research | Human context, comprehension, control, and recovery requirements | Uncertainty, authority, trace, latency, and failure behavior | Human–agent experience reflects actual system boundaries |
| QA/evaluation | Independent strategy, coverage challenge, and release evidence | Harnesses, datasets, instrumentation, and fixes | The builder does not solely grade its own system |
| Security/risk/legal | Threat and obligation expertise, approval, and monitoring needs | Concrete data flows, permissions, tests, traces, and mitigations | Controls are technical and testable; risk acceptance remains human |

## Working with AI

**Delegate:** experiment scaffolding, candidate prompt or tool-schema variants, synthetic test expansion after a human-grounded seed set, trace clustering, code generation, documentation drafts, and bounded red-team exploration in sandboxes.

**Retain:** intended architecture, evaluation validity, permission and autonomy design, high-risk failure interpretation, production release recommendation, incident response, and accountability for the engineered AI subsystem.

**Verify:** all generated code and configurations; synthetic cases against real distributions; automated graders against expert judgments; model-reported citations against sources; tool arguments and effects; provider claims; privacy and security behavior; and each change against regression and countermetrics.

**Prohibited or constrained:** self-modifying production instructions or tools without controlled review; agents granting permissions, creating unbounded subagents, concealing traces, or overriding policy; training or prompting on unauthorized data; evaluation sets containing unprotected sensitive data; autonomous high-impact actions outside approved thresholds; and using one AI model as the sole judge of another in consequential domains.

## Experience, tool, and information needs

The engineer needs versioned model and prompt registries, approved provider and data environments, evaluation and annotation platforms, trace viewers, redaction, secure secret and identity services, sandboxed tool execution, production monitoring, and cost controls. Every run should be attributable to model, instructions, context sources, tool versions, identity, permissions, and approvals. Tooling must support replay, comparison, slice analysis, rollback, kill switches, and exportable evidence without exposing protected content.

## Success measures

### Leading indicators

- Evaluation coverage of representative, edge, adversarial, abstention, escalation, and recovery cases.
- Regression pass rate by risk slice; trace completeness; unauthorized-action prevention; and time from failure discovery to a versioned fix.
- Human grader agreement, escalation usefulness, model/tool change detection, and cost or latency budget adherence.

### Lagging indicators

- Improvement over workflow baseline, customer outcome, accepted-task quality, reduced safe handling time, incident rate, harmful error rate, and sustainable total cost.
- Appropriate automation rate: completed automatically when safe, escalated when necessary, and rejected when prohibited.

### Countermetrics

- False confidence, harmful false positives and negatives, demographic or domain disparity, privacy leakage, over-escalation, reviewer burden, automation bias, vendor concentration, energy/cost growth, and degraded non-AI fallback.
- Benchmark score, answer acceptance, and autonomy percentage are never sufficient alone.

## Pressures and pain points

The role faces rapidly changing models, incomplete provider transparency, nondeterminism, scarce expert labels, evaluation contamination, ambiguous responsibility, prototype pressure, and stakeholders who generalize from curated demos. Production data may be restricted while synthetic data hides reality. Model upgrades can change behavior without code changes. Human review may be specified without capacity, training, or service-level design.

## Failure modes and anti-patterns

- Starting with a model or framework instead of a valuable, bounded workflow.
- Evaluating average answer quality while ignoring tool effects, high-severity slices, abstention, or escalation.
- Giving a general agent broad credentials because narrow tools require more engineering.
- Treating a prompt as informal text rather than versioned operational logic.
- Using generated test cases and an AI grader with no human-grounded evaluation.
- Hiding uncertainty, cherry-picking demos, or silently changing models in production.
- Calling a human “in the loop” when review is rushed, uninformed, or unable to override.
- Leaving obsolete agents, credentials, vector stores, or instructions active after a pilot.

## Guardrails

Every AI capability has intended and prohibited use, a named human owner, risk tier, authoritative sources, data controls, versioned configuration, evaluation thresholds, traceability, and retirement criteria. Agent identity is distinct, credentials are short-lived where possible, permissions are least-privileged, and tools enforce schemas and authorization independently of model instructions. Consequential actions use confirmation, human approval, or dual control as risk requires. Kill switch, rollback, fallback, incident response, and customer correction paths are tested before production.

## Critical scenario: the agent that passes the demo

An agent can resolve support requests by reading account data and issuing credits. Demo cases pass, and the average evaluator score is high. The AI engineer samples by financial impact and finds that prompt-injected text in uploaded attachments can induce a credit above policy. They pause the write tool, preserve traces, and escalate. With security and the process owner, they replace free-form action with a typed credit tool that independently checks identity, policy, amount, and case state. The agent may propose; a human approves above a low threshold. Domain experts create adversarial and exception cases, design improves the approval explanation, and QA validates replay and override. The revised agent automates routine cases, abstains on conflicting evidence, and sends a compact trace to reviewers. The response may look less magical, but the capability is more valuable, auditable, and safe.

## Representative statements

- “A fluent answer is a sample, not an evaluation.”
- “Show me intended use, baseline, failure slices, tool authority, and the human escalation path.”
- “The tool must enforce permission even if the model instruction is attacked.”
- “Abstaining correctly is a successful outcome for this case.”
- “Who can detect, stop, replay, and recover this agent’s actions?”

## Maturity progression

| Stage | Observable state |
|---|---|
| Reactive | Teams prompt a general model, review demos manually, and discover permissions, cost, and failure in production. |
| AI-assisted | Versioned prompts and basic evaluations exist, but tools, traces, governance, and human operations remain fragmented. |
| Integrated | Intended use, risk-tiered autonomy, least-privilege tools, independent evaluations, monitoring, and escalation operate as one delivery system. |
| AI-native | Reusable evaluation, identity, policy, trace, and tool infrastructure supports continuous adaptation; humans govern purpose, novel risk, and value conflicts. |

## Definition of ready and done

An AI capability is **ready** when its customer job, baseline, intended and prohibited use, accountable owner, data and source hierarchy, risk tier, representative and adversarial evaluation set, acceptable failure, autonomy level, tool and permission design, human review capacity, cost bounds, and stop criteria are explicit. It is **done** when the complete workflow meets versioned thresholds by relevant slice; identity and least privilege are enforced; traces, monitoring, escalation, fallback, rollback, and kill switch work; security, privacy, accessibility, domain, and operational reviews are complete; documentation and training exist; and a production owner accepts ongoing measurement and change management.

## Interview and discovery questions

1. What non-AI baseline and customer outcome define improvement?
2. Which failure classes matter most, and who determined their severity?
3. Can every agent action be attributed to identity, permission, source context, and configuration version?
4. What causes abstention or escalation, and can the receiving human act on the handoff?
5. How are automated graders calibrated against qualified humans?
6. What changes when a provider silently updates a model?
7. Which tool or permission could cause the greatest harm if instructions were compromised?
8. How is the capability disabled, rolled back, corrected, and eventually retired?

## Connections to the 15 operating rules

The AI engineer protects **velocity (1)** through automated evaluations, observability, and safe rollback rather than manual gates. Evidence packages make decision meetings focused **(2)** and let AI investments live as testable portfolio bets **(3)**. Product works directly with the agent and traces **(4)** while engineering retains technical authority **(5)**. Failure examples and working behavior anchor the daily jam **(6)**; dashboards and exception alerts replace routine reviews **(7)**. Versioned, modular systems preserve flexibility **(8)**; transparent failure discussion supports best intent **(9)**; and concerns become reproductions, tests, and fixes **(10)**. Instructions, sources, permissions, evaluations, and escalation make documentation executable **(11)**. Agent uncertainty and recovery are designed product surfaces **(12)** serving one customer experience **(13)**. Independent human and cross-functional judgment counters lone AI production **(14)**, and shared evaluations, tools, examples, and postmortems make learning everyone’s work **(15)**.
