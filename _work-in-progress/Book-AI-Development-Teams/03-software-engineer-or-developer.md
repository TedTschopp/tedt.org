# Persona: Software Engineer or Developer

> Turns a valuable product hypothesis into a secure, reliable, observable, and maintainable working system while preserving the team’s ability to learn and change.

## Purpose and scope

This persona describes the hands-on engineering accountability for software and AI-enabled products. It can be fulfilled by application, platform, data, infrastructure, mobile, web, or full-stack engineers according to the system. It is a **role, not a title or seniority level**: the scope of decisions changes with competence and delegation, but the duty to make technical reality visible and uphold professional engineering standards remains.

The engineer collaborates directly with product, design, quality, operations, and domain partners. They are not a passive recipient of product requirements or an interchangeable unit of capacity. Product owns the customer problem and intended outcome; engineering owns technical design and system health. The engineer helps shape a feasible test without taking unilateral ownership of product value.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary focus | Working system behavior across construction, operation, change, and recovery |
| Time horizon | The next useful test through the product’s sustainable lifetime |
| Core question | “What is the simplest responsible implementation that will produce credible evidence and remain safe to change?” |
| Value created | Executable behavior, technical options, quality controls, feedback, and durable system knowledge |
| Principal partners | Product, design, engineering lead, QA/evaluation, security, operations, and AI/domain specialists |
| Principal risk | Producing code rapidly while weakening correctness, maintainability, security, or customer value |
| Evidence standard | Reproducible tests, evaluations, traces, operational behavior, code review, and customer-observable results |

## Core mandate

Design, build, test, release, operate, and improve software that serves the intended customer outcome within explicit constraints. The engineer shortens the question-to-evidence loop through small changes, automation, observability, and reversible delivery. They exercise technical judgment, expose tradeoffs early, and leave the system easier—not merely faster—to understand and modify.

## Outcomes and motivations

The engineer seeks correct, useful behavior; fast and trustworthy feedback; low-friction delivery; resilient operation; and a codebase whose change cost remains manageable. They want enough context to solve the actual problem and enough autonomy to choose the implementation. Craft includes what is not built, how failures are contained, and whether another engineer or agent can safely understand the work.

AI makes generation inexpensive, increasing the value of problem decomposition, review, evaluation, architecture, and operational judgment. The engineer is motivated by leverage, not by maximizing generated lines of code.

## Jobs to be done

- **When** a product hypothesis needs a real test, **I want to** build the thinnest responsible vertical slice, **so that** customers and the team can evaluate actual behavior quickly.
- **When** AI proposes code or a solution, **I want to** inspect assumptions, dependencies, tests, and failure paths, **so that** plausible output does not become hidden risk.
- **When** requirements are ambiguous, **I want to** bring a working option and focused questions to the daily jam, **so that** decisions happen against concrete behavior.
- **When** the system fails, **I want to** observe, contain, diagnose, recover, and capture the learning, **so that** the same class of failure becomes less likely.
- **When** repeated work consumes attention, **I want to** encode it in tests, tooling, documentation, or constrained automation, **so that** humans can focus on judgment and exceptions.

## Responsibilities and boundaries

### Owns

- Implementation design within delegated scope, code quality, automated tests, integration, and technical documentation.
- Making reliability, security, privacy, performance, cost, maintainability, and operational tradeoffs visible.
- Reproducible local and test behavior, safe change mechanisms, observability, and adherence to engineering standards.
- Honest status about uncertainty, defects, debt, and readiness.

### Co-owns

- Solution shaping and smallest useful tests with product and design.
- Architecture and technical direction with engineering leads and affected engineers.
- Release quality, evaluation coverage, incident response, and operational readiness with QA, AI, security, and operations partners.

### Contributes to

- Customer discovery, experience critique, estimation, portfolio evidence, documentation, support learning, and team teaching.
- Product decisions by showing feasible options and their consequences.

### Does not own

- Which customer problem is strategically most valuable, final product positioning, or business risk acceptance.
- Specialist legal, compliance, domain, or design approval outside delegated competence.
- Authority to bypass safeguards because generated code appears correct or a deadline is urgent.
- Other people’s capacity; technical autonomy does not authorize unilateral product strategy.

## Decision rights and escalation triggers

The engineer decides implementation details and local technical tradeoffs within architecture, security, quality, and product boundaries. They may refactor, automate, and sequence their work to deliver safely. Decisions that materially affect shared architecture, public contracts, data handling, permissions, operational cost, customer experience, or other teams require collaboration with the appropriate owner.

Escalate when requirements conflict with system safety or standards; an action is irreversible or difficult to roll back; protected data or privileged access is involved; tests or evaluations reveal unacceptable harm; production behavior is not understood; a dependency or architectural change crosses ownership boundaries; an incident may be material; or product and technical accountabilities cannot be reconciled. Escalation should include evidence, options, recommendation, and immediate containment where needed.

## Inputs and evidence

- Customer problem, intended outcome, non-goals, success and countermetrics, risk tier, and decision date.
- Experience intent, interaction and recovery designs, examples, edge cases, and accessibility requirements.
- Repository history, architecture decisions, interfaces, standards, threat models, runbooks, and source-of-truth hierarchy.
- Production telemetry, traces, logs, incidents, support evidence, AI evaluations, dependency and cost data.
- Domain constraints and explicit uncertainties from product, security, legal, operations, and subject-matter experts.

## Outputs and artifacts

- Reviewed code, configuration, infrastructure changes, schemas, interfaces, migrations, prompts, and tool integrations.
- Automated tests and AI evaluations, fixtures, reproducible failure cases, threat mitigations, and performance evidence.
- Architecture notes, decision records, API or SDK documentation, runbooks, observability, dashboards, and alerts.
- Deployable increments, release and rollback plans, incident fixes, and removal of obsolete paths.
- Technical options that explain consequences in language collaborators can use.

## Operating rhythm

Daily, the engineer synchronizes with the current source, inspects relevant telemetry, builds and tests small increments, reviews peer or agent output, and joins a short artifact-centered product–engineering jam. They surface blockers with a proposed next action rather than waiting silently. Changes flow continuously or in small batches through automated checks and review.

Weekly, the engineer participates in demos, customer or support evidence review, architecture health, and maintenance work. Periodically, the team exercises recovery, audits dependencies and permissions, retires stale automation, and turns incident or delivery lessons into tests and documentation. Meetings are reserved for live design, critique, decisions, and incident coordination—not status recitation.

## Capabilities and literacies

- Programming, debugging, decomposition, data structures, interfaces, version control, testing, and code review.
- Delivery pipelines, observability, reliability, security, privacy, performance, cost, rollback, and operational support.
- Architecture literacy sufficient to respect boundaries and identify when a local choice becomes a system decision.
- AI-assisted development: context construction, model/tool selection, evaluation, prompt and agent inspection, provenance, and adversarial review.
- Product and design literacy sufficient to connect implementation behavior to the user’s task, including accessibility, error, permission, loading, and recovery states.
- Clear writing, collaborative explanation, and the ability to teach reproducible workflows.

## Mindsets and observable behaviors

The engineer is empirical, skeptical without being obstructive, and biased toward small reversible changes. They read before changing, test assumptions, inspect generated output, and make uncertainty visible. They ask for the customer outcome rather than demanding exhaustive specifications. They protect focus while remaining available for high-value collaboration. They critique artifacts rather than people, assume best intent, invite review early, and treat maintainability and operational readiness as current work—not future cleanup.

## Collaboration map

| Partner | What engineering needs | What engineering provides | Healthy boundary |
|---|---|---|---|
| Product lead | Problem, outcome, priorities, evidence, and timely decisions | Feasible options, working behavior, costs, risks, and learning | Product does not prescribe implementation; engineering does not redefine value alone |
| Design/research | Interaction intent, observed behavior, and edge cases | Real constraints, prototypes, state behavior, and implementation feedback | Experience includes technical surfaces and failure paths |
| Engineering lead/architect | Direction, standards, context, and cross-system decisions | Local evidence, proposals, adherence, and challenge | Architecture enables delivery rather than becoming remote approval |
| QA/evaluation | Risk model, test strategy, and independent challenge | Testability, fixtures, instrumentation, and fixes | Quality is built throughout, not handed off at the end |
| Security/operations | Threat and production expertise, controls, and incident context | Secure defaults, telemetry, runbooks, and responsive remediation | Specialists guide risk; controls remain proportional and executable |
| AI/domain specialists | Model behavior and domain correctness criteria | Integrated system, constraints, traces, and evaluation hooks | Technical validity does not substitute for domain correctness |

## Working with AI

**Delegate:** code scaffolding, routine transformations, test suggestions, documentation drafts, log summarization, dependency comparison, exploratory analysis, and bounded implementation tasks with explicit acceptance checks.

**Retain:** problem decomposition, architecture within scope, security-sensitive reasoning, tradeoff decisions, review, production authorization, incident command, and accountability for the merged behavior.

**Verify:** every generated change against repository context, specifications, tests, licenses, dependencies, security and privacy requirements, performance, failure behavior, and authoritative documentation. Run the system; do not accept textual confidence.

**Prohibited or constrained:** inserting secrets or protected data into unapproved models; copying code with unclear provenance or licensing; allowing agents to merge, deploy, mutate production, change permissions, or destroy data outside explicit controls; disabling checks to satisfy generated code; and attributing authorship to a human reviewer who did not review.

## Experience, tool, and information needs

The engineer needs a reproducible development environment, authoritative repository context, fast tests, evaluation harnesses, safe sandboxes, source and artifact provenance, and least-privilege access. CI feedback should be timely and actionable. Production telemetry must connect customer symptoms to system behavior without exposing restricted data. AI tools should show supplied context, actions, diffs, tool calls, costs, and uncertainty, and should support approval boundaries rather than obscure them.

## Success measures

### Leading indicators

- Time from clarified question to working, evaluated behavior; change batch size; review latency; automated check quality; and rollback readiness.
- Percentage of changes with appropriate tests, observability, documentation, and traceable AI assistance.
- Frequency of early demonstrations and defects found before production.

### Lagging indicators

- Customer outcome contribution, change failure rate, recovery time, reliability, security posture, maintainability, and sustainable delivery throughput.
- Declining recurrence of known failure classes and reduced time required for safe future changes.

### Countermetrics

- Technical debt, complexity, cloud and model cost, developer cognitive load, accessibility defects, privacy exposure, support burden, and burnout.
- Lines of code, commits, story points, or generated artifacts are not measures of value.

## Pressures and pain points

Engineers face urgent feature demand, unstable requirements, fragmented context, inherited debt, brittle environments, slow checks, dependency churn, on-call interruptions, and pressure to trust AI speed. They may be asked for certainty before discovery or blamed for estimates treated as promises. Excess ceremony can suppress flow; insufficient governance can transfer hidden risk to engineering and customers.

## Failure modes and anti-patterns

- Accepting tickets without understanding the customer outcome, then building exactly the wrong behavior.
- Merging AI-generated code because it compiles, without testing semantics, security, or operations.
- Gold-plating architecture, hiding behind technical complexity, or treating product and design as interruption.
- Accumulating silent debt to make a demo date, with no owner or recovery plan.
- Shipping happy paths without permissions, errors, accessibility, observability, or rollback.
- Hoarding system knowledge, using jargon as authority, or becoming a lone AI-powered hero.
- Treating product as engineering’s manager or retaliating by excluding product from the work.

## Guardrails

All changes follow version control, review, automated checks, least privilege, secret management, and environment separation. Riskier changes require stronger evaluation, staged rollout, observability, and explicit human approval. Public interfaces and shared architecture require affected-owner review. Production access is narrow and auditable. Generated dependencies and code require provenance and license review. No engineer or agent bypasses safety, legal, privacy, accessibility, or domain controls without authorized exception and recorded rationale.

## Critical scenario: generated fix under pressure

A production defect intermittently duplicates customer transactions. An AI coding tool produces a concise fix in minutes, and stakeholders ask for immediate deployment. The engineer reproduces the race condition, contains exposure behind a feature flag, and traces the generated fix through concurrency and retry behavior. A test shows it prevents duplication but can silently drop a valid transaction. In the incident jam, product clarifies customer impact, the architect reviews the cross-service contract, and operations prepares rollback and reconciliation. The engineer develops a second, idempotent change with migration and telemetry, adds regression and load tests, documents the invariant, and stages deployment. Recovery takes longer than accepting the first answer but far less time than repairing lost transactions. AI accelerated exploration; engineering judgment protected the system and customer.

## Representative statements

- “I understand the intended outcome; here are two implementation options and their consequences.”
- “The generated change is a hypothesis until the system and tests prove its behavior.”
- “Can we make this decision reversible and learn from a smaller slice?”
- “This failure needs a test, an observable signal, and a recovery path.”
- “Product sets the value target; engineering must retain authority over how we reach it safely.”

## Maturity progression

| Stage | Observable state |
|---|---|
| Reactive | Engineers receive tickets, make large changes, diagnose late, and depend on individuals and manual release steps. |
| AI-assisted | Engineers generate code and tests faster, but review, architecture, and delivery practices have not adapted to increased volume. |
| Integrated | Small cross-functional bets flow through automated tests, evaluations, review, observability, and reversible delivery; AI work is traceable. |
| AI-native | Engineers compose people, code, tools, and constrained agents into a continuously learning system while concentrating human judgment on architecture, exceptions, and trust. |

## Definition of ready and done

Work is **ready** when the intended customer outcome, boundaries, examples, non-goals, risk tier, dependencies, relevant standards, evaluation approach, and decision owner are sufficient to begin a responsible thin slice; exhaustive task specification is unnecessary. It is **done** when reviewed behavior meets product and technical criteria in the intended environment; tests and evaluations pass; security, privacy, accessibility, reliability, performance, and cost are proportionately addressed; telemetry, documentation, deployment, migration, rollback, and support paths exist; and obsolete code or temporary access is removed.

## Interview and discovery questions

1. How do you learn the customer purpose behind the code you change?
2. Which checks give you confidence, and where is confidence still based on intuition?
3. What decisions can you make autonomously, and which require cross-system review?
4. How do you verify AI-generated code beyond compilation and unit tests?
5. Where does work wait longest between idea, change, production behavior, and evidence?
6. What technical surface is hardest to observe or recover?
7. Which recurring manual task should become tested infrastructure?
8. How does the team prevent AI-assisted output volume from overwhelming review?

## Connections to the 15 operating rules

The engineer protects **velocity as a safe customer-learning loop (1)**, supplies written context for focused meetings **(2)**, and turns portfolio bets into evidence rather than fixed feature commitments **(3)**. They welcome product into the real environment **(4)** while retaining technical authority instead of accepting product control of engineering time **(5)**. Working artifacts anchor the daily jam **(6)** and automated telemetry replaces routine status meetings **(7)**. Small reversible designs enable flexibility **(8)**; respectful review and clarification support best intent **(9)**; and defects arrive with evidence and proposed fixes **(10)**. Code, tests, runbooks, and standards make documentation executable **(11)**. Engineers implement the full designed surface **(12)** in service of the shared customer experience **(13)**, seek multidisciplinary review rather than lone production **(14)**, and turn discoveries into reusable tools, examples, and teaching **(15)**.
