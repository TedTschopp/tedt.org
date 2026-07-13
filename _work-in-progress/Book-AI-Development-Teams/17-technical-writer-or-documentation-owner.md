# Persona: Technical Writer or Documentation Owner

> Builds the written operating system that lets people and AI agents reach the same correct action from the same authoritative intent.

## Purpose and scope

The Technical Writer or Documentation Owner treats documentation as executable infrastructure. They design, maintain, and validate the instructions, standards, decisions, permissions, source hierarchies, and recovery paths on which work depends. Their concern is not merely readable prose. It is whether a qualified person or bounded AI agent can determine what is true, what to do, what not to do, and when to escalate.

This is an organizational role, not necessarily a formal title. A technical writer may perform it full time; an engineer, product manager, process owner, or domain expert may hold it for a specific knowledge domain. Subject expertise may be distributed, but each operational document or documentation set needs one accountable owner with authority to resolve contradictions and retire stale guidance.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary objective | Make authoritative intent discoverable, unambiguous, actionable, and current |
| Unit of attention | A reader or agent attempting a real task under real conditions |
| Optimizes for | Correct action, low search cost, safe self-service, and rapid change propagation |
| Protects against | Tribal knowledge, conflicting sources, stale instructions, unsafe agent interpretation |
| Key partners | Process and decision owners, product, engineering, support, operations, risk, and domain experts |
| Typical time horizon | Creation through versioning, use, exception, revision, and retirement |
| Essential stance | Documentation is part of the product and control system, not cleanup after delivery |

## Core mandate

Establish a governed source hierarchy and convert important knowledge into structured, testable, versioned artifacts. Every critical document should identify its purpose, audience, authority, owner, effective version, required inputs and outputs, permissions, definition of done, exceptions, escalation path, and update triggers. When sources disagree, the hierarchy—not reader confidence—determines which source wins.

The role also closes the loop between documents and reality. Instructions are tested against representative scenarios, links and examples are validated, agent retrieval is evaluated, and production changes trigger documentation changes. A document that is beautifully written but causes inconsistent action is defective.

## Outcomes and motivations

- People and agents find the authoritative answer without relying on memory or meetings.
- Instructions lead to consistent, safe completion and recovery.
- Decisions and standards remain traceable to rationale and owners.
- Changes propagate through dependent documents, prompts, runbooks, interfaces, and training.
- Exceptions do not silently become the operating norm.
- Documentation reduces translation, support demand, onboarding time, and coordination delay.

## Jobs to be done

- **When a process or product behavior becomes repeatable,** I want to encode its intent, inputs, actions, boundaries, and completion criteria, **so that it can be executed consistently.**
- **When multiple sources disagree,** I want an explicit source hierarchy and conflict-resolution owner, **so that readers do not improvise authority.**
- **When a system changes,** I want linked documentation reviewed in the same change, **so that published guidance matches deployed behavior.**
- **When an AI agent will consume instructions,** I want machine-usable structure, permissions, and escalation rules, **so that ambiguity does not become automated error.**
- **When users fail or seek help,** I want those signals converted into clearer guidance and examples, **so that the documentation learns from use.**
- **When guidance expires,** I want it redirected, archived, or removed, **so that search does not continue serving obsolete instructions.**

## Responsibilities and boundaries

### Owns

- Documentation architecture, taxonomy, templates, metadata, style, and lifecycle standards.
- Authoritative-source registry and hierarchy for the assigned documentation domain.
- Publication workflow, versioning, discoverability, link integrity, and retirement.
- Documentation validation and effectiveness measures.

### Co-owns

- Technical and operational accuracy with subject-matter and process owners.
- API, SDK, command-line, agent, error, recovery, and permission documentation with design and engineering.
- Decision records, standards, definitions of done, and exception pathways with their accountable owners.
- Agent-readable knowledge packaging and retrieval evaluation with AI engineers.

### Contributes to

- Product discovery, support analysis, release readiness, onboarding, incident reviews, training, and governance.
- Interface wording and in-product guidance when they are the shortest path to successful action.

### Does not own

- The underlying business decision, policy interpretation, technical implementation, or process outcome.
- Accuracy by solitary editorial assertion. Named experts must validate claims in their domains.
- Preserving every historical page in active search. Archival value does not confer operational authority.
- Repairing a broken product with prose when the better fix is product, code, or process redesign.

## Decision rights and escalation triggers

The documentation owner may enforce required metadata and structure, decline publication of unowned or unvalidated operational guidance, identify one source as canonical according to the approved hierarchy, archive superseded content, and fail a documentation gate when a release would make authoritative guidance materially false.

Escalate when authoritative sources conflict; no owner will accept accuracy accountability; a legal, security, safety, or policy statement lacks qualified validation; agent instructions imply permissions the agent does not have; a critical process has no exception or recovery route; the documented behavior differs from production; localization changes meaning; or urgent instructions must publish before normal validation. Escalation names the conflict, users affected, interim safe guidance, and decision needed.

## Inputs and evidence

Inputs include working code and interfaces, APIs and schemas, process maps, architecture, standards and policies, decision records, tickets and change sets, model and prompt versions, permission models, support cases, search queries, failed tasks, incidents, user research, analytics, release plans, owner rosters, and authoritative external sources.

The documentation owner evaluates source authority, recency, scope, audience, provenance, and conflict. Conversation and slideware may inform a draft but do not silently outrank approved decisions, deployed behavior, or controlled policies.

## Outputs and artifacts

- Documentation map, taxonomy, source-of-truth registry, and explicit precedence rules.
- Versioned conceptual, procedural, reference, troubleshooting, and decision documentation.
- Runbooks with prerequisites, permissions, safe steps, checkpoints, rollback, escalation, and definition of done.
- API, SDK, CLI, agent, error, permission, and recovery guidance with tested examples.
- Decision and exception records with rationale, owner, scope, effective dates, and supersession links.
- Change-impact matrix connecting code, process, policy, prompt, training, and documentation.
- Validation suite for links, structure, code samples, retrieval, scenarios, and freshness.
- Deprecation notices, redirects, archives, and content-health dashboards.

## Operating rhythm

During discovery, the role identifies audiences, jobs, authority, and vocabulary. During implementation, they draft beside the working artifact. Experts validate claims while users and agents execute representative tasks. Documentation and product versions align at release. Search failures, support cases, agent traces, and incidents reveal gaps. Automated checks find broken links, stale versions, missing metadata, and conflicts; material changes trigger owner review.

## Capabilities and literacies

- Information architecture, content design, editing, and plain language.
- Docs-as-code, version control, structured formats, schemas, and CI validation.
- Ability to read code, APIs, logs, process models, policies, and designs.
- Task analysis, usability, accessibility, localization, and retrieval design.
- Governance of authority, ownership, permissions, records, retention, and deprecation.
- AI literacy across retrieval, context, instruction hierarchy, provenance, evaluation, and injection.

## Mindsets and observable behaviors

The effective owner starts with user action, not the organization chart. They test examples, ask what wins when sources conflict, and write explicit boundaries. They prefer one canonical source over duplicated truths, label uncertainty, distinguish policy from explanation, and treat redirection and deletion as maintenance.

## Collaboration map

| Partner | Exchange |
|---|---|
| Process owner | Purpose, sequence, controls, exceptions, completion, and change triggers |
| Decision owner | Decision, rationale, scope, authority, review date, and supersession |
| Engineering/architecture | Actual behavior, interfaces, versions, examples, limits, and release changes |
| Product/design/research | User jobs, terminology, comprehension, errors, and recovery experience |
| Security/risk/legal | Authoritative obligations, protected content, permissions, and qualified validation |
| Support/operations | Frequent failures, runbook use, incidents, workarounds, and recovery evidence |
| AI/agent engineer | Retrieval contract, instruction hierarchy, tool boundaries, trace evaluation, and feedback |

## Working with AI

### Delegate

AI may draft from approved sources, transform formats, propose examples, identify contradictions, classify feedback, generate tests, check terms, and surface stale content.

### Retain as human accountability

Humans establish authority, approve meaning, resolve conflict, define permissions and exceptions, validate consequential instructions, choose what is canonical, and own publication and retirement decisions.

### Verify

Trace claims to authoritative sources; execute examples and procedures; test links and versions; evaluate agent answers against golden questions; and require domain review for controlled content.

### Prohibited or constrained

Do not allow AI to invent policy, permissions, approval, rationale, citations, or exceptions. Do not place secrets, personal data, privileged material, or exploit details in an unauthorized corpus. Do not let generated summaries outrank the canonical source. Prevent retrieved content from being interpreted as executable instruction unless its authority and scope are explicit.

## Experience, tool, and information needs

The role needs working artifacts, version control, preview builds, structured authoring, search and support data, automated link and example tests, content inventory, owner and source registries, permission-aware publishing, retrieval traces, and release notifications. Documentation belongs in change definitions, with expert time reserved for validation.

## Success measures

### Leading indicators

- Coverage of critical tasks by owned, current, validated documentation.
- Percentage of documents with source, version, owner, audience, review trigger, and status metadata.
- Automated pass rate for links, examples, schemas, retrieval cases, and accessibility.
- Time from product or policy change to aligned documentation.

### Lagging indicators

- Task completion and recovery success using documentation.
- Reduction in support contacts, onboarding time, repeat errors, and contradictory decisions.
- Incidents caused or worsened by missing, stale, or ambiguous guidance.
- Agent answer accuracy and correct escalation when documentation is used as context.

### Countermetrics

- Page count, word count, or publication volume without use or outcome.
- Search success achieved by hiding unresolved gaps.
- Fast publishing that increases correction rate or unsafe interpretation.
- Documentation workload caused by duplicating authoritative content.

## Pressures and pain points

Late notice, partial access, conflicting experts, fragmented repositories, and requests to document around defects create pressure. Content multiplies faster than ownership. AI can amplify one stale contradiction across many answers. The owner must trade completeness for one clear, current path.

## Failure modes and anti-patterns

- Publishing unowned pages with no review trigger.
- Copying canonical content into many locations without synchronization.
- Describing only the happy path while omitting permissions, exceptions, rollback, and escalation.
- Mixing current instruction, historical explanation, and proposed change without status labels.
- Treating a meeting recording or chat thread as durable operational truth.
- Measuring documentation by volume rather than successful action.
- Letting an AI-generated answer cite a page whose scope does not apply.
- Updating prose without testing examples or downstream agent behavior.
- Keeping obsolete content searchable because deletion feels destructive.

## Guardrails

Each critical artifact declares owner, authority, scope, audience, version, dependencies, and status. Operational steps state prerequisites, permissions, inputs, outputs, failures, rollback, exceptions, and done. Controlled claims receive qualified review. Superseded guidance redirects to its replacement. Sensitive content is permission-aware; human and agent use are tested separately. Emergency guidance is labeled, owned, expiring, and scheduled for validation.

## Critical scenario: two sources and one autonomous action

A support agent’s runbook allows automatic credits to $100, while newer finance policy sets $50. Search ranks the obsolete runbook first, and the agent issues $75. The owner pauses autonomy, applies the approved source hierarchy, and confirms the effective decision with process and decision owners.

They version the canonical rule and runbook, add a redirect, and replace the duplicated amount with a controlled reference. Engineering narrows tool permission so prose is not the only control. Retrieval and scenario tests cover both sides of the boundary, exceptions, and escalation. The fix aligns policy, instruction, permission, search, and evidence—not merely one sentence.

## Representative statements

- “Which source wins if these instructions disagree?”
- “Can a new team member—and the agent—complete this without relying on tribal knowledge?”
- “The example is part of the contract; we need to run it.”
- “Archive the history, but redirect operational search to the current version.”
- “If the exception matters, it belongs in the executable path, not someone’s inbox.”

## Maturity progression

| Stage | Characteristics |
|---|---|
| Reactive | Scattered pages, late updates, tribal knowledge, and support-driven corrections |
| AI-assisted | AI drafts and audits content; humans manually establish authority and validate output |
| Integrated | Docs ship with changes, use structured metadata, automated tests, ownership, and source hierarchy |
| AI-native | Documentation forms a permission-aware operating API for people and agents; continuous usage evidence triggers governed updates |

## Definition of ready and done

**Ready to document:** the intended user and task, accountable owner, authoritative sources, artifact version, permissions, terminology, failure paths, and change status are known; the writer can inspect working behavior; unresolved decisions are labeled rather than guessed.

**Done:** the artifact is accurate for the released version; required structure and metadata are present; subject and control owners validated their claims; examples, links, accessibility, and representative human and agent scenarios pass; permissions, exceptions, escalation, rollback, and completion are explicit; dependencies are updated; superseded guidance is redirected; and feedback and review triggers are active.

## Interview and discovery questions

1. What task is the reader or agent trying to complete, and what proves success?
2. Which source is authoritative, and what wins when two sources conflict?
3. Who may read, decide, approve, execute, or override each step?
4. What precondition, exception, failure, or recovery path is currently implicit?
5. What product, policy, model, or process change should trigger revision?
6. How do we know users found and correctly applied the guidance?
7. Which duplicated fact should become a reference to a controlled source?
8. What could an AI agent dangerously misinterpret in this document?

## Connections to the 15 operating rules

1. **Protect Engineering Velocity:** removes repeated explanation and makes safe self-service possible.
2. **Cap Meetings at 60 Minutes:** moves context and follow-up into durable artifacts.
3. **Use a Live Portfolio of Bets:** records hypotheses, evidence, decisions, and stop conditions.
4. **Put Product in the Working Environment:** lets product update intent beside working behavior.
5. **Do Not Let Product Control Engineering Time:** preserves distinct accountabilities in written contracts.
6. **Create a Daily Product–Engineering Jam:** captures decisions and changed behavior while fresh.
7. **Eliminate Unearned Monthly Meetings:** replaces status recitation with current dashboards and records.
8. **Stay Flexible in Pursuit of Value:** versions changing methods while retaining stable boundaries and rationale.
9. **Assume Best Intent:** supplies context that reduces misread terse communication.
10. **Turn Complaints Into Fixes or Proposals:** provides the structure for problem, evidence, impact, proposal, and owner.
11. **Treat Documentation as Executable Infrastructure:** this is the role’s central mandate.
12. **Expand Design Beyond Screens:** documents APIs, agents, errors, permissions, uncertainty, and recovery.
13. **Organize Around One Exceptional Customer Experience:** aligns guidance to the end-to-end customer job.
14. **Build With a Coordinated Team:** integrates multiple forms of expertise into one governed source.
15. **Make Teaching and Learning Everyone’s Job:** turns individual discoveries into reusable, validated organizational capability.
