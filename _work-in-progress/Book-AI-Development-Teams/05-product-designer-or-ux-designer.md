# Persona: Product Designer or UX Designer

> Makes the entire human experience understandable, trustworthy, accessible, and recoverable—from visible screens to APIs, terminals, permissions, agent behavior, and failure states.

## Purpose and scope

This persona defines design accountability for an end-to-end product or service experience. It may be fulfilled by a product designer, UX designer, service designer, interaction designer, content designer, or another practitioner with explicit experience responsibility. It is a **role, not a title or a request for screen production**. Its scope follows the customer journey across channels and system boundaries, including moments without a graphical interface.

The designer works in the live product environment alongside product and engineering. They shape behavior, language, feedback, consent, explanation, errors, recovery, and human–agent handoffs. They do not unilaterally choose product priorities, dictate technical implementation, or claim research evidence they did not gather. They make technical constraints and customer needs visible enough for the team to resolve them together.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary focus | Customer understanding and agency throughout the complete experience |
| Time horizon | The next interaction through the full service relationship and recovery lifecycle |
| Core question | “Does the person understand what happened, retain meaningful control, and know the next useful action?” |
| Value created | Coherent behavior, clarity, accessibility, trust, reduced effort, and graceful recovery |
| Principal partners | Customers, research, product, engineering, AI engineering, support, success, operations, and brand |
| Principal risk | Polishing visible screens while invisible system behavior remains confusing, unsafe, or exclusionary |
| Evidence standard | Observed use, task success, comprehension, accessibility findings, behavior traces, and recovery outcomes |

## Core mandate

Design the product as a service experienced over time. Define how customers form expectations, act, receive feedback, understand system and agent decisions, manage permissions, encounter uncertainty, recover from failure, and reach value. Bring customer behavior into daily implementation decisions, and ensure every material state—not only the ideal path—is intentionally designed and evaluated.

## Outcomes and motivations

The designer seeks an experience that is useful, usable, accessible, coherent, and worthy of trust. Customers should understand system status and consequences, make informed choices, and recover without specialist help. The designer wants the brand promise, technical behavior, and operational reality to agree.

With AI, the same input may produce different outputs, and automated behavior may be difficult to predict. This increases the designer’s motivation to make uncertainty, authority, provenance, controls, and escalation legible rather than disguising them behind a conversational surface.

## Jobs to be done

- **When** a team frames a capability as a screen or feature, **I want to** map the complete customer journey and service dependencies, **so that** neglected states and channels do not become customer failures.
- **When** an AI agent acts or recommends, **I want to** design expectation, permission, explanation, correction, and escalation, **so that** customers retain meaningful agency.
- **When** implementation reveals real constraints, **I want to** inspect and modify the working artifact with engineers, **so that** design evolves with behavior rather than becoming a stale handoff.
- **When** a customer fails a task, **I want to** observe the breakdown and recovery attempt, **so that** the team fixes the system rather than blaming the user.
- **When** patterns repeat across products, **I want to** encode accessible components and interaction standards, **so that** quality becomes the easy default.

## Responsibilities and boundaries

### Owns

- Experience intent, interaction logic, information hierarchy, content behavior, accessibility design, and coherent use of design systems.
- Mapping and designing visible and non-visible states: initiation, progress, completion, uncertainty, permission, error, interruption, undo, recovery, and escalation.
- Design critique and evidence about comprehension, usability, agency, and end-to-end coherence.
- Accurate design documentation that remains connected to implemented behavior.

### Co-owns

- Customer discovery and problem framing with research and product.
- Product behavior and acceptance evidence with product, engineering, QA/evaluation, and operations.
- AI intended use, human–agent interaction, evaluation cases, and trust mechanisms with AI and domain specialists.
- Brand expression and service consistency with marketing, support, and success.

### Contributes to

- Portfolio bets, prototypes, design-system implementation, documentation, support readiness, incident learning, and ethical or risk reviews.

### Does not own

- Product prioritization, business risk acceptance, technical architecture, implementation sequencing, or specialist legal and security decisions.
- A mandate to make every interface visually distinctive when familiar, accessible patterns work better.
- Permission to represent assumptions or synthetic feedback as customer research.

## Decision rights and escalation triggers

The designer decides interaction and content patterns within the approved product intent and design system. They can reject a design as not yet evidenced or accessible, but production disposition is a shared decision with the accountable product, engineering, and risk owners. They propose alternatives when technical or schedule constraints threaten experience quality.

Escalate when a design could cause material harm, deception, exclusion, irreversible action, privacy loss, unexpected automation, or inaccessible service; when an agent’s authority or uncertainty cannot be explained; when brand promise and operational behavior conflict; when a required recovery path has no owner; or when teams cannot resolve a tradeoff between customer value, technical safety, and delivery. Escalation includes observed evidence, affected people, severity, options, and a recommendation.

## Inputs and evidence

- Interviews, observation, contextual inquiry, journey evidence, usability sessions, accessibility testing, support cases, and customer language.
- Product problem, intended outcome, audience, non-goals, success and guardrail signals, and business or service constraints.
- Working builds, APIs, SDKs, CLI behavior, agent traces, tool calls, logs, performance, error patterns, permissions, and operational processes.
- Design system, content and brand standards, platform conventions, accessibility standards, policies, and domain requirements.
- Quantitative behavior and funnel data interpreted alongside qualitative context, including segment and sample limitations.

## Outputs and artifacts

- Experience principles, journeys, service blueprints, flows, information architecture, prototypes, and interaction specifications.
- State and behavior models covering permissions, uncertainty, explanations, errors, empty and loading states, undo, recovery, and escalation.
- Accessible components, content patterns, API/SDK/CLI guidance, agent conversation and action patterns, and design tokens.
- Research questions, usability and comprehension findings, evaluation scenarios, annotated implementation feedback, and decision records.
- Customer-facing language and operational guidance aligned with actual system capability.

## Operating rhythm

Daily, the designer inspects the working artifact, participates in the product–engineering jam, answers behavior questions, and tests emerging states rather than waiting for a formal handoff. They keep prototypes close enough to implementation to provoke decisions, not to create a parallel product. Several times each week, they review customer or support evidence and conduct lightweight evaluation.

Weekly, the team critiques an end-to-end flow against the shared customer outcome, including at least one failure or edge case. Periodically, the designer audits accessibility, design-system drift, agent behavior, recovery, and cross-channel consistency. Meetings are prepared asynchronously and used for interaction-rich research, critique, co-design, or decisions.

## Capabilities and literacies

- Interaction, service, information, visual, and content design; prototyping; usability; research interpretation; and design systems.
- Accessibility, inclusive design, localization, cognitive load, consent, trust, and responsible behavioral design.
- Technical literacy across HTML and platform semantics, APIs, SDKs, terminals, state machines, logs, latency, permissions, and delivery constraints.
- AI interaction literacy: nondeterminism, intended use, uncertainty, automation bias, prompt injection consequences, memory, provenance, correction, and human escalation.
- Facilitation, critique, clear writing, and translation between observed behavior, product intent, and implementation reality.
- Measurement literacy that distinguishes satisfaction and engagement from task success and customer welfare.

## Mindsets and observable behaviors

The designer is curious, concrete, and unwilling to blame customers for system confusion. They design with—not merely for—affected people. They ask what the customer believes the system will do and compare it with actual authority. They explore edge cases early, use familiar patterns when appropriate, and state uncertainty. They assume best intent while challenging artifacts directly. They pair critique with a prototype, example, or testable proposal and remain present through implementation and operation.

## Collaboration map

| Partner | What design needs | What design provides | Healthy boundary |
|---|---|---|---|
| Customer/research | Context, behavior, language, and diverse ability evidence | Respect, prototypes, synthesis, and closure | Customer participation is evidence, not theater |
| Product lead | Problem, audience, outcome, priority, and timely tradeoffs | Experience alternatives, customer evidence, and value implications | Product chooses value direction; design owns experience judgment |
| Software engineering | Working behavior, constraints, technical states, and feasibility | Interaction logic, state coverage, accessible patterns, and rapid feedback | Design does not prescribe internals; engineering does not reduce experience to feasibility |
| AI/agent engineering | Model, tool, permission, trace, and failure behavior | Intended interaction, control, explanation, correction, and escalation patterns | A fluent conversation is not proof of safe agent behavior |
| Support/success/operations | Real failure, workaround, and service evidence | Recovery designs, language, and product feedback | Operational workarounds should inform product repair |
| Brand/risk/domain experts | Promise, standards, harms, and correctness | Concrete journeys and behavior for review | Review addresses actual use rather than abstract policy only |

## Working with AI

**Delegate:** early variations, prototype scaffolds, content alternatives, research organization, accessibility check suggestions, journey drafts, edge-case generation, and repetitive design-system application.

**Retain:** interpretation of human behavior, design intent, taste, inclusion and ethical judgment, final customer language, research relationships, and decisions about agency, consent, explanation, and recovery.

**Verify:** generated patterns against actual platform semantics and the design system; content against brand, domain, and accessibility needs; research synthesis against source evidence; prototypes against implemented behavior; and AI interaction claims through realistic evaluation with affected users.

**Prohibited or constrained:** fabricated research participants or quotations; synthetic users as replacements for human discovery; deceptive or coercive patterns; unconsented sensitive inference; uploading research data to unapproved systems; generated accessibility assertions without testing; and autonomous publication of customer-facing content or design changes without review.

## Experience, tool, and information needs

The designer needs access to customers, research evidence, the repository and working build, test accounts, logs and traces at an appropriate privacy level, analytics, support cases, design-system code, and safe AI sandboxes. Tools should preserve state logic, accessibility attributes, provenance, and implementation status—not only pixels. They need to see latency, confidence, permission checks, and agent tool actions because those system facts shape the experience.

## Success measures

### Leading indicators

- Percentage of critical journeys with tested normal, edge, permission, error, recovery, and escalation states.
- Frequency of customer observation and designer review in the working environment.
- Accessibility coverage, design-system adoption, comprehension test results, and time from observed problem to tested change.

### Lagging indicators

- Customer task success, time-to-value, reduced effort and avoidable support, accessibility outcomes, trust, successful recovery, and sustained use that reflects value.
- Fewer incidents caused by misunderstood automation, permissions, or system status.

### Countermetrics

- Manipulative engagement, abandonment hidden by forced paths, support deflection that lowers resolution, false-positive safety prompts, latency, implementation complexity, and maintenance burden.
- Visual polish and artifact volume do not substitute for customer outcomes.

## Pressures and pain points

Designers face feature deadlines, late involvement, inaccessible technical environments, requests for “a quick screen,” fragmented customer access, brand pressure, and ambiguous AI behavior. Nondeterministic systems resist fixed mockups. Teams may prioritize a convincing demo over recovery, or treat accessibility and content as final-stage polish. Design critique can be mistaken for subjective preference when evidence and decision rights are unclear.

## Failure modes and anti-patterns

- Designing only the happy-path graphical interface while ignoring CLI, SDK, API, agent, permission, error, and recovery behavior.
- Delivering static mockups and disengaging before implementation.
- Anthropomorphizing an agent, concealing uncertainty, or implying authority it does not possess.
- Using synthetic personas or AI summaries as proof of customer need.
- Optimizing delight at the expense of consent, accessibility, clarity, or reversibility.
- Treating every inconsistency as a redesign opportunity instead of strengthening shared patterns.
- Raising aesthetic objections without customer evidence or a workable alternative.

## Guardrails

Critical flows meet applicable accessibility standards and receive real assistive-technology and user testing. Consequential actions show scope and effect, request informed permission, support confirmation or undo where feasible, and provide recovery. AI interactions disclose relevant automation, do not overstate confidence or humanity, and expose how to correct or escalate. Sensitive inferences and research data follow consent, minimization, retention, and access requirements. Dark patterns and deceptive defaults are prohibited.

## Critical scenario: the invisible failure path

A team prototypes an agent that can reconfigure a customer account from conversational instructions. The demo is impressive, but the designer traces the full journey. They find that the agent sometimes selects a similarly named account, requests broad permission without explaining why, and reports “done” before a downstream system confirms. The designer maps authority and system states, then works with engineering on a preview showing the exact account, proposed changes, source, permission scope, and reversible confirmation. For uncertain matches, the agent asks a constrained question; for downstream delay, it reports pending status and provides a trace; for failure, it preserves the prior configuration and offers human support. Usability testing shows that the extra confirmation improves trust without materially slowing the task. The design contribution was not a prettier chat window; it was making system power, uncertainty, and recovery comprehensible.

## Representative statements

- “What does the customer believe will happen, and is that what the system is authorized to do?”
- “The interface includes the API response, the error, the permission prompt, and the recovery—not only this screen.”
- “Let’s test comprehension and task success rather than debate preference.”
- “If the agent is uncertain, the experience must make uncertainty actionable.”
- “I can bring a concrete alternative to the working build today.”

## Maturity progression

| Stage | Observable state |
|---|---|
| Reactive | Design receives feature requests, produces screens, and reviews implementation late; failures become support problems. |
| AI-assisted | AI speeds variants and prototypes, but design remains artifact-centered and human–agent behavior is under-specified. |
| Integrated | Design works in the live system, covers all states and channels, and uses customer evidence and evaluation throughout delivery. |
| AI-native | Experience intent, accessible patterns, agent controls, and evaluation cases are reusable infrastructure; designers focus on novel behavior, trust, and human agency. |

## Definition of ready and done

Design work is **ready** when the customer and job, context of use, intended outcome, relevant evidence, constraints, system capabilities, risk tier, critical states, accessibility needs, and decision owner are understood enough to prototype. It is **done** when implemented behavior—not merely a design file—has been reviewed across channels and states; representative customers can understand, act, correct, and recover; accessibility and content checks pass; AI authority and uncertainty are legible; analytics and support signals exist; and the design system and authoritative documentation reflect the result.

## Interview and discovery questions

1. Which parts of the customer experience occur outside the graphical interface?
2. How does the system show what an agent knows, can do, did, and could not do?
3. Which failure or recovery path creates the greatest customer burden?
4. When do designers first touch the working product, and when do they stop?
5. Whose abilities, language, or context are underrepresented in evaluation?
6. Which product metric could improve while customer agency or trust declines?
7. Where do implementation and design sources disagree?
8. What recurring experience pattern should become shared, tested infrastructure?

## Connections to the 15 operating rules

The designer protects **velocity (1)** by finding experience risk while change is cheap and keeps meetings focused through concrete artifacts **(2)**. Customer evidence and prototypes shape the live portfolio of bets **(3)**. Like product, design works directly in the environment **(4)** while respecting engineering authority **(5)**, and brings experience decisions to the daily jam **(6)**. Research, prototypes, and recorded critiques replace routine status meetings **(7)**; multiple tested paths support flexibility **(8)**; critique assumes good intent **(9)**; and complaints become observed problems plus proposals **(10)**. Design systems, state models, content, and recovery rules become executable documentation **(11)**. The role is the primary steward of design beyond screens **(12)** and uses one exceptional customer experience as its organizing spine **(13)**. It depends on multidisciplinary judgment **(14)** and spreads accessible, responsible AI patterns through teaching and reuse **(15)**.
