# Persona: Quality Assurance or Evaluation Engineer

> Turns “it seems to work” into credible, repeatable evidence that the product is fit for its intended use—including when AI behavior is probabilistic.

## Purpose and scope

The Quality Assurance or Evaluation Engineer designs the evidence system by which a team decides whether a product change is safe, useful, reliable, and ready to release. The role joins traditional software quality practices—deterministic tests, integration tests, performance checks, and defect analysis—with AI evaluation practices such as benchmark sets, rubric-based scoring, red teaming, drift detection, and statistical comparison.

This is an organizational role, not necessarily a job title. A dedicated evaluation engineer may fill it, or its accountabilities may be distributed among engineers, domain experts, product managers, and risk specialists. Distribution is acceptable only when ownership of the evaluation strategy and release evidence remains explicit.

## Persona at a glance

| Dimension | Definition |
|---|---|
| Primary objective | Produce trustworthy evidence about product behavior and release risk |
| Unit of attention | A customer-critical behavior under defined conditions |
| Optimizes for | Fast learning with bounded quality risk |
| Protects against | Silent regression, plausible-but-wrong AI output, weak test coverage, and unmeasured drift |
| Key partners | Engineering, product, domain experts, security, operations, support, and customers |
| Typical time horizon | Per change, per release, and continuously in production |
| Essential stance | Skeptical of claims, constructive about paths to evidence |

## Core mandate

Build a layered quality system that makes failures observable before they cause unacceptable harm. The system must distinguish deterministic correctness from probabilistic fitness. A calculation, permission check, schema, or transaction may have an exact expected result. A generated answer may instead require a distribution of cases, a scoring rubric, multiple judges, confidence intervals, and explicit tolerance for disagreement.

The role does not promise that no defect will escape. It makes residual uncertainty visible, tests the most consequential assumptions, and gives the decision owner enough evidence to accept, mitigate, or reject release risk.

## Outcomes and motivations

- Customers can complete critical jobs reliably, including failure and recovery paths.
- Teams detect regressions quickly without turning every release into a manual testing project.
- AI changes are compared against a named baseline rather than judged from a few impressive demonstrations.
- Release decisions cite evidence, limitations, and unresolved risks.
- Production feedback becomes new tests and evaluation cases.
- Speed increases because routine confidence is automated and high-risk ambiguity receives human attention.

## Jobs to be done

- **When a team proposes a change,** I want to identify its failure surfaces and measurable acceptance conditions, **so that quality is designed before implementation is complete.**
- **When behavior has an exact answer,** I want deterministic tests at the lowest useful layer, **so that defects are caught quickly and diagnosed precisely.**
- **When behavior depends on an AI model,** I want representative datasets, rubrics, and comparative statistics, **so that “better” means more than subjective preference.**
- **When a failure could be abused,** I want adversarial and red-team scenarios, **so that the system is tested beyond the happy path.**
- **When a model, prompt, tool, policy, or data source changes,** I want regression and drift analysis, **so that local improvements do not hide broader degradation.**
- **When release pressure rises,** I want a concise evidence packet and explicit exception path, **so that accountability is preserved without ceremonial delay.**

## Responsibilities and boundaries

### Owns

- The quality and evaluation strategy, coverage model, test taxonomy, and evidence traceability.
- Evaluation datasets, rubrics, thresholds, baseline comparisons, and known limitations.
- Release-quality reporting and the integrity of automated quality gates.
- Defect learning loops: production failures become reproducible tests or monitoring signals.

### Co-owns

- Acceptance criteria with product, engineering, design, and domain experts.
- AI behavior specifications, escalation criteria, and harmful-output testing.
- Observability and drift monitoring with engineering and operations.
- Release readiness and rollback validation with the decision owner.

### Contributes to

- Architecture reviews, threat modeling, customer research, incident reviews, and portfolio-bet design.
- Definitions of ready and done, testability standards, and evaluation literacy.

### Does not own

- Product value, technical implementation, legal interpretation, or final risk acceptance.
- A blanket veto over releases. It can stop an automated gate, document failed criteria, and escalate; the accountable decision owner accepts or rejects residual risk.
- Testing every permutation. Coverage is risk-based, not an illusion of exhaustiveness.

## Decision rights and escalation triggers

The role may define test methods, quarantine invalid evaluation results, reject contaminated datasets, and fail a release gate when agreed criteria are not met. It may require retesting when the evaluated artifact differs from the releasable artifact.

Escalation is required when a critical customer journey fails; a security, privacy, safety, or regulatory scenario produces unacceptable behavior; a statistically meaningful regression crosses its threshold; model behavior drifts outside its control range; evidence is missing or irreproducible; production monitoring cannot detect a known high-impact failure; or a team requests an exception without an owner, expiry, mitigation, and rollback plan.

## Inputs and evidence

The role consumes customer jobs and research, product hypotheses, architecture and data-flow diagrams, requirements and acceptance criteria, model and prompt versions, tool permissions, production traces, support cases, incident reports, risk classifications, historical defect patterns, latency and cost budgets, and domain-expert judgments. Inputs must identify provenance, population, environment, version, and intended use; a benchmark without context can mislead as easily as no benchmark.

## Outputs and artifacts

- Risk-based test strategy and coverage map.
- Deterministic unit, contract, integration, end-to-end, accessibility, performance, and recovery tests.
- AI evaluation suite with datasets, rubrics, graders, adjudication rules, thresholds, and baseline.
- Red-team plan covering prompt injection, unsafe tool use, data leakage, evasion, deception, and domain-specific misuse.
- Release evidence packet: artifact versions, environment, results, exceptions, known limitations, monitoring, rollback, and sign-offs.
- Quality dashboard, drift alerts, defect taxonomy, and post-release evaluation report.
- Reproducible failure cases and regression tests linked to incidents or customer evidence.

## Operating rhythm

During discovery and design, the role identifies critical behaviors, evidence, and failure scenarios. During implementation, it builds checks alongside the product. Before release, it compares the candidate with a fixed baseline and prepares the evidence packet. In production, it monitors quality, drift, overrides, and complaints. Periodically it refreshes datasets, audits graders, prunes stale tests, and runs deeper adversarial exercises.

## Capabilities and literacies

- Test automation, observability, experimental design, statistics, and root-cause analysis.
- AI evaluation: golden sets, rubrics, pairwise comparison, calibrated judges, adjudication, and metamorphic tests.
- Data and label quality, privacy-aware fixtures, sampling, and contamination detection.
- Threat-informed red teaming across model, retrieval, agent, and tool failures.
- Domain literacy sufficient to recruit experts and recognize false confidence.

## Mindsets and observable behaviors

The effective evaluator is curious rather than punitive. They ask, “What evidence would change our mind?” They reproduce failures, publish limitations, and make uncertainty legible. They resist vanity coverage, cherry-picked examples, and post-hoc thresholds. They teach testability instead of becoming the final destination for quality work.

## Collaboration map

| Partner | Exchange |
|---|---|
| Product lead | Customer-critical outcomes and acceptance tradeoffs |
| Software and AI engineers | Instrumentation, test hooks, fixes, versioned candidates, and reproducibility |
| Domain expert | Rubrics, labels, boundary cases, and adjudication |
| Security/risk reviewer | Abuse cases, control objectives, and risk-tiered thresholds |
| Designer/researcher | Experience, accessibility, comprehension, and recovery evidence |
| Operations/support | Production signals, incidents, complaints, and rollout control |
| Decision owner | Release recommendation, residual uncertainty, and exceptions |

## Working with AI

### Delegate

AI may generate candidate cases, vary inputs, synthesize safe fixtures, cluster failures, summarize runs, compare traces, and act as one calibrated grader.

### Retain as human accountability

Humans define the intended behavior, risk tolerance, representative population, rubric, thresholds, and release recommendation. Humans adjudicate consequential disagreement and determine whether a metric represents customer value.

### Verify

Validate tests against requirements, calibrate judges against blind human labels, retain holdouts, inspect errors and bias, and rerun on the deployable artifact.

### Prohibited or constrained

Do not let the same uncalibrated model generate, answer, and grade its own test. Do not expose production secrets or personal data in external evaluation tools. Do not treat a benchmark score as legal, ethical, safety, or release approval. Never hide failed cases by silently changing the dataset or threshold.

## Experience, tool, and information needs

The role needs working builds, versioned model, prompt and dataset registries, production-like environments, privacy-controlled traces, evaluation runners, feature flags, canaries, rollback, domain adjudication, and protected maintenance time. Results link customer intent to case, run, artifact version, and release.

## Success measures

### Leading indicators

- Percentage of critical behaviors with automated deterministic or probabilistic checks.
- Evaluation coverage by risk tier, customer segment, language, and failure class.
- Reproducibility rate, grader agreement, time to run, and time to diagnose.
- Percentage of changes compared with a versioned baseline before release.

### Lagging indicators

- Escaped severe defects and harmful AI incidents.
- Customer task success, recovery success, and regression rate.
- Time from production signal to test, fix, and verified recovery.
- Frequency and duration of quality-related rollback.

### Countermetrics

- Release delay caused by flaky or low-value gates.
- Test maintenance cost, false-alarm rate, and benchmark overfitting.
- Quality improvements achieved by silently narrowing supported use cases.

## Pressures and pain points

Rapid model changes, nondeterminism, sparse labels, data restrictions, and release pressure make evidence difficult. Suites become flaky or detached from customer reality; experts disagree; rare harms disappear in averages. The role needs permission to report uncertainty without being treated as obstructive.

## Failure modes and anti-patterns

- Testing only happy paths or handpicked prompts.
- Using pass/fail language for a probabilistic score without confidence or distribution detail.
- Measuring aggregate quality while masking severe subgroup failures.
- Letting coverage percentage substitute for risk coverage.
- Treating red teaming as a one-time launch event.
- Updating the model, prompt, retrieval corpus, or tools without rerunning the relevant suite.
- Building gates that teams learn to bypass because they are flaky or unexplained.
- Confusing absence of observed failure with evidence of safety.

## Guardrails

Every evaluation names its decision, artifact, population, method, threshold, baseline, and limitations. Severe failures receive severity-based treatment even when averages improve. Exceptions require owner, mitigation, monitoring, expiry, and rollback. Test data is controlled, graders are calibrated, production behavior is monitored, and release evidence remains traceable.

## Critical scenario: the impressive release candidate

A new agent model improves the headline score by seven points. Slice analysis, however, reveals weaker tool selection in a regulated workflow, and red teaming exposes injection through retrieved documents. The evaluator reproduces both failures on the production configuration. Engineering restricts the tool, adds confirmation, and sanitizes retrieved instructions; a domain expert adjudicates the affected cases.

The fixed candidate passes the frozen baseline and holdout. One low-severity limitation enters the evidence packet with a signal, owner, and expiry. The decision owner releases to a canary with rollback thresholds. Evaluation protected speed by making consequential risk precise and fixable.

## Representative statements

- “Which customer behavior does this score represent?”
- “Show me the baseline, the distribution, and the severe failures—not only the average.”
- “This deterministic rule belongs in a test, not in a reviewer’s memory.”
- “The candidate improved overall, but it regressed where failure costs the most.”
- “We can release behind a canary if the exception has an owner, signal, expiry, and rollback.”

## Maturity progression

| Stage | Characteristics |
|---|---|
| Reactive | Manual testing near release; defects drive unplanned work; AI judged by demos |
| AI-assisted | AI generates cases and summarizes runs; baseline suite and basic human rubrics exist |
| Integrated | Risk-tiered deterministic and probabilistic gates run continuously; release evidence is traceable |
| AI-native | Quality intent is executable; agents run and triage evaluations continuously while humans govern meaning, risk, and exceptions |

## Definition of ready and done

**Ready for evaluation:** intended users and jobs are named; critical behaviors and risk tier are agreed; the candidate and dependencies are versioned; acceptance criteria are testable; representative data is available legally; instrumentation and rollback paths exist; and unresolved assumptions are explicit.

**Done for release evidence:** required suites ran on the releasable artifact; failures were resolved or accepted through a time-bound exception; baseline and slice comparisons are recorded; red-team results match the risk tier; monitoring and rollback thresholds are active; limitations are documented; and the decision owner can reproduce the recommendation from the evidence packet.

## Interview and discovery questions

1. Which product failures would be unacceptable even if average quality improved?
2. What customer population does the current evaluation set represent—and omit?
3. Which behaviors have exact answers, and which require judgment?
4. How are graders calibrated, disagreements adjudicated, and datasets protected from contamination?
5. What changed since the last baseline: model, prompt, data, tool, permissions, or infrastructure?
6. How would production drift become visible before support volume rises?
7. What quality gate is routinely bypassed, and why?
8. Can the team reconstruct the evidence behind the last release decision?

## Connections to the 15 operating rules

1. **Protect Engineering Velocity:** automates routine confidence and focuses review on material risk.
2. **Cap Meetings at 60 Minutes:** supplies evidence in advance so meetings decide rather than discover status.
3. **Use a Live Portfolio of Bets:** turns each hypothesis into measurable success and stop signals.
4. **Put Product in the Working Environment:** lets product inspect actual failures and evaluation cases.
5. **Do Not Let Product Control Engineering Time:** preserves engineering ownership while quality defines evidence, not task hours.
6. **Create a Daily Product–Engineering Jam:** brings fresh test results to decisions while change is inexpensive.
7. **Eliminate Unearned Monthly Meetings:** replaces quality reporting meetings with dashboards and exception review.
8. **Stay Flexible in Pursuit of Value:** supports reversible experiments within stable quality boundaries.
9. **Assume Best Intent:** critiques behavior and evidence rather than attributing motives.
10. **Turn Complaints Into Fixes or Proposals:** converts every credible failure into a case, owner, and action.
11. **Treat Documentation as Executable Infrastructure:** encodes acceptance criteria, rubrics, gates, and exceptions.
12. **Expand Design Beyond Screens:** evaluates APIs, agents, permissions, errors, and recovery.
13. **Organize Around One Exceptional Customer Experience:** weights quality by end-to-end customer outcomes.
14. **Build With a Coordinated Team:** combines technical, domain, design, customer, and risk judgment.
15. **Make Teaching and Learning Everyone’s Job:** shares evaluation patterns, failure libraries, and red-team lessons.
