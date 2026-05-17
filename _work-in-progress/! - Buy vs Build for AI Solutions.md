# Enterprise Guidance / Standard: AI Buy vs. Build Decisioning in the AI Era

**Document status:** Draft enterprise guidance / standard
**Intended audience:** Enterprise Architecture, IT leadership, product owners, business technology partners, procurement, security, risk, data governance, and AI delivery teams
**Scope:** Applies to AI-enabled software, generative AI, agentic AI, embedded AI features in SaaS products, AI copilots, workflow automation, AI-assisted decision support, and AI-enabled custom development.

## 1. Executive Position

The enterprise should no longer treat “Buy vs. Build” as a binary technology decision. In the AI era, the better framing is:

> **For this specific workflow, should we automate, build, buy, hire/develop capability, or wait?**

The centeral argument is that AI investment are not primarily an “AI strategy” question; it is a capital allocation question grounded in the **shape of the work**.  Models, vendors, and dashboards  are downstream from understanding how work is performed and where value is created. This means we have five levers to pull to solve this problem: **automate, build, buy, hire, and wait**.  

This is consistent with current enterprise risk guidance. Gartner has warned that more than 40% of agentic AI projects may be canceled by the end of 2027 because of escalating costs, unclear business value, or inadequate risk controls. Gartner also cautions that many vendors are “agent washing” existing assistants, RPA tools, or chatbots without substantial agentic capability. ([Gartner][1])

Therefore, our standard should be:

> **AI investment decisions shall be made at the workflow level, not at the department, application, vendor, or model level.**

The enterprise must first describe the work, then select the investment strategy.

---

## 2. Core Standard

All proposed AI investments must be evaluated through a **Workflow Investment Review** before funding, procurement, architecture approval, or production deployment.

The formal definition of a workflow is:

> A Workflow is a bounded, outcome-oriented operating loop that coordinates people, systems, information, decisions, controls, and exception handling to transform defined inputs into governed outputs with clear ownership and measurable quality standards. It is the unit of work at which the enterprise evaluates AI investment, automation, sourcing, governance, and accountability.

In business architecture terms, a Workflow is:

> A business process segment, subprocess, case flow, or operational realization of one or more value stream stages. It is enabled by one or more business capabilities and supported by specific roles, information, systems, controls, and services.

A Workflow is not

> a prompt, model, agent, tool feature, application, department, job role, user interface, or single task. Those elements may support, enable, or participate in the Workflow, but they are not the Workflow itself.

The Plain-language test:

> If the conversation is only about a model, prompt, screen, chatbot, feature, or vendor product, the Workflow has not yet been defined. The Workflow is the full operating loop: inputs, systems, decisions, actions, controls, exceptions, human review, escalations, outputs, and accountable ownership.

The minimum enterprise standard is:

1. **Do not automate what you cannot describe.**
2. **Do not buy what you have not decomposed into workflows.**
3. **Do not build what you cannot quantitatively evaluate.**
4. **Do not hire for AI capability; hire or develop for a specific workflow capability.**
5. **Do not wait passively; wait deliberately with triggers for reassessment into one of the above 4 categories.**

---

## 3. Why Traditional Buy vs. Build Is No Longer Sufficient

Traditional software decisions often worked reasonably well with a binary lens:

| Traditional Question                    | Typical Decision |
|-----------------------------------------|------------------|
| Is this a commodity capability?         | Buy              |
| Is this differentiating or proprietary? | Build            |
| Is there a mature vendor?               | Buy              |
| Do we need heavy customization?         | Build            |

AI changes this because AI-enabled work is less deterministic, more context-sensitive, and more dependent on data, controls, human judgment, and evaluation. A purchased AI product may not simply “fit” into the enterprise the way a traditional SaaS module does. A custom AI system may not be valuable unless the organization can define what “good” looks like and verify outputs reliably.

A team does not have one singular AI problem; collections prioritization, invoice matching, dispute resolution, cash application, reporting, escalation, and customer follow-up are different shapes of work that may route to different investments. Bundling them into one broad RFP risks buying a mediocre tool that does one workflow well and others poorly.

The enterprise should therefore treat “Buy vs. Build” as a portfolio of workflow-level decisions:

| AI Investment Lever           | What It Means                                                                                                                                        |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Automate / Delete**         | Remove, fully automate, or materially reduce routine work where patterns are clear and exceptions are manageable.                                    |
| **Build**                     | Create or compose an internal AI-enabled workflow because the work is company-specific, differentiating, data-dependent, or control-sensitive.       |
| **Buy**                       | Purchase a vendor product, platform, model, primitive, connector, or full workflow solution when market fit and workflow fit are strong.             |
| **Hire / Develop**            | Acquire or grow human capability needed to define, evaluate, govern, integrate, or operate AI-enabled workflows.                                     |
| **Wait / Prototype Narrowly** | Defer major investment when the market is immature, the workflow is low leverage, the risk is unclear, or change capacity is better spent elsewhere. |

Multiple levers may apply to the same workflow. For example, an enterprise may **buy model access and orchestration primitives**, **build the company-specific workflow**, **automate routine substeps**, and **hire evaluation design capability**.

---

## 4. Enterprise Decision Principles

### 4.1 Workflow First

Every AI proposal must begin with a workflow description, not a vendor demo, model choice, or “AI use case” label.

Required workflow description:

| Required Element | Questions to Answer                                                    |
|------------------|------------------------------------------------------------------------|
| Business outcome | What business result does this workflow produce?                       |
| Trigger          | What starts the workflow?                                              |
| Inputs           | What data, documents, events, systems, or human inputs are required?   |
| Decisions        | What decisions are made, by whom, and under what authority?            |
| Actions          | What actions may the system take? What actions require human approval? |
| Outputs          | What does good output look like?                                       |
| Consumers        | Who or what uses the output?                                           |
| Exceptions       | What cases do not follow the normal pattern?                           |
| Error cost       | What happens if the AI is wrong?                                       |
| Verification     | How will output quality be checked?                                    |
| Escalation       | When does the workflow move to a human or higher authority?            |
| Accountability   | Who owns the result?                                                   |
| Controls         | What security, privacy, audit, legal, and compliance controls apply?   |

### 4.2 Value Before Model

The enterprise shall not approve AI investment solely because a model, agent, copilot, or vendor feature is impressive. Approval requires a defined workflow, measurable value, and an evaluation method.

Poor enterprise AI decisions often arise when vendors show the routine case, buyers sign based on the impressive demo, and production traffic turns out to contain many exceptions.

### 4.3 Risk-Proportional Governance

Governance must scale with the consequence of error. A low-risk summarization assistant does not require the same governance as an autonomous agent that can change customer records, approve payments, modify configurations, or trigger production actions.

The organization should align AI risk management with recognized frameworks. NIST’s AI Risk Management Framework is designed to help organizations that design, develop, deploy, or use AI systems manage risks and promote trustworthy, responsible AI. ([NIST][2]) NIST’s Generative AI Profile is a companion resource for applying that framework to generative AI across design, development, use, and evaluation. ([NIST][3]) ISO/IEC 42001 provides requirements for establishing, implementing, maintaining, and continually improving an AI management system within organizations. ([ISO][4])

### 4.4 Human Accountability Remains Mandatory

AI may perform tasks, recommend actions, summarize information, classify inputs, orchestrate steps, or execute approved actions. But the enterprise must retain a named business owner accountable for workflow outcomes.

Rejects simplistic “AI versus people” framing and instead focus on where people should maximize their time, where they need to upskill, where talent gaps exist, and how job families change as bundles of tasks are automated.

### 4.5 Buy Commodities, Build Differentiators, Own Standards

The enterprise should buy mature commodity capabilities, build workflows that encode company-specific advantage, and own the standards by which AI outputs are judged.

Use an investment matrix with two axes: how specific the work is to the company and how mature the AI market solution is for that vertical. Common work in a mature market is an obvious buy; company-specific work with useful market primitives should generally be built using purchased building blocks, while the enterprise owns the workflow and standards.

---

## 5. The Five AI Investment Strategies

### Strategy 1: Automate / Delete the Workflow

#### Definition

Automation is appropriate when AI can eliminate, absorb, or materially reduce a repeatable workflow or sub-workflow without unacceptable risk.

This may include:

* Automating a routine decision.
* Reducing manual review volume.
* Routing exceptions to humans.
* Replacing repetitive information retrieval.
* Eliminating work that only exists because legacy systems are fragmented.
* Combining AI with traditional automation, rules, RPA, APIs, or workflow engines.

#### Use When

Automation is appropriate when:

| Criterion         | Strong Signal                                             |
|-------------------|-----------------------------------------------------------|
| Repeatability     | The workflow happens frequently.                          |
| Pattern clarity   | Most cases follow a known pattern.                        |
| Exception clarity | Exceptions are recognizable and can be defined.           |
| Verification      | Output quality can be checked cheaply.                    |
| Error cost        | Mistakes are low to moderate impact or easily reversible. |
| Human value       | Humans add little value to routine cases.                 |
| Controls          | Human escalation and audit controls are feasible.         |

Automation is the right call when work repeats often, follows a clear pattern, has recognizable exceptions that can be defined, and can be checked cheaply. Do not automate when the exception process is where most of the value is for the effort.

#### Enterprise Standard

The enterprise shall approve automation only when the workflow owner can provide:

1. A written workflow description.
2. A normal-case path.
3. An exception catalog.
4. A definition of “good output.”
5. A human escalation path.
6. A rollback or correction mechanism.
7. Monitoring and audit requirements.
8. Measurable business value.

#### Examples in IT

| Workflow                                  | Likely Strategy                                                        |
|-------------------------------------------|------------------------------------------------------------------------|
| Password reset support                    | Automate / buy                                                         |
| Standard knowledge-base response drafting | Automate / buy                                                         |
| Ticket categorization and routing         | Automate / buy                                                         |
| Routine status reporting                  | Automate                                                               |
| Basic log summarization                   | Automate with human review                                             |
| Production change approval                | Usually not full automation; assist or wait unless controls are mature |

#### Key Warning

Do not confuse “demo success” with “production readiness.” Vendor demos often show the routine case. Enterprise production traffic often contains exceptions, ambiguous data, missing context, and edge cases.

### Strategy 2: Build the AI-Enabled Workflow

#### Definition

Build means the enterprise designs, owns, and operates the AI-enabled workflow because the value depends on company-specific context, proprietary data, unique standards, integration complexity, or risk controls.

Build does **not** necessarily mean building every component from scratch. In most cases, build means composing internal workflows using purchased models, APIs, orchestration tools, knowledge systems, evaluation tools, and integration services.

#### Use When

Build is appropriate when:

| Criterion            | Strong Signal                                                                      |
|----------------------|------------------------------------------------------------------------------------|
| Company specificity  | The workflow depends on proprietary standards, policies, data, or operating model. |
| Differentiation      | The workflow creates competitive advantage or enterprise-specific leverage.        |
| Edge cases           | Exceptions are frequent and require internal context.                              |
| Integration depth    | The workflow spans internal systems, data, and decision rights.                    |
| Risk ownership       | The enterprise must control evaluation, auditability, and approval gates.          |
| Vendor fit           | Available products solve only part of the workflow.                                |
| Evaluation readiness | The organization can define and test what “good” looks like.                       |

Build is appropriate when the selected work is not suited to purchasing because it is unique, has many edge cases, or depends on company-specific context such as data, standards, processes, approval gates, and risk thresholds. It also emphasizes that building requires knowing what data goes into the workflow and what good output looks like.  

#### Enterprise Standard

A build proposal shall not be approved unless the team can demonstrate:

1. **Workflow ownership:** Named business owner and technical owner.
2. **Architecture:** Data, model, orchestration, integration, security, and observability design.
3. **Evaluation plan:** Test sets, expected outputs, quality metrics, and acceptance thresholds.
4. **Risk controls:** Human-in-the-loop requirements, access controls, and escalation rules.
5. **Data readiness:** Authoritative sources, data quality, lineage, retention, privacy, and access.
6. **Operational readiness:** Support model, monitoring, incident response, and cost controls.
7. **Lifecycle plan:** Model change management, prompt/configuration versioning, retraining or refresh plan, and retirement plan.

#### Recommended Build Pattern

For enterprise IT, the preferred pattern is usually:

> **Buy platform primitives; build the workflow; own the standards.**

Examples of primitives include:

* Foundation model access.
* Model gateway.
* Prompt and policy management.
* Retrieval and knowledge indexing.
* Agent orchestration.
* Evaluation tooling.
* Logging and observability.
* Identity and authorization.
* Connectors and APIs.
* Secure sandboxing.
* Human approval queues.

The enterprise should avoid building commodity primitives unless there is a compelling control, cost, regulatory, or strategic reason.

#### Examples in IT

| Workflow                                                        | Likely Strategy                                   |
|-----------------------------------------------------------------|---------------------------------------------------|
| Architecture review assistant trained on internal standards     | Build with bought primitives                      |
| Incident triage across proprietary telemetry and CMDB           | Build with bought primitives                      |
| AI-assisted change impact analysis                              | Build / assist, strong human approval             |
| Internal policy interpretation across company-specific controls | Build with governed knowledge retrieval           |
| AI development platform for engineering teams                   | Build platform capability using vendor primitives |

#### Key Warning

Build is not the fallback because “buy is too expensive.” Build requires durable ownership, evaluation discipline, integration capacity, and operational funding. If the enterprise cannot define “good,” building will likely produce a system that appears impressive but cannot be trusted.

---

### Strategy 3: Buy the AI Capability

#### Definition

Buy means acquiring an AI-enabled product, platform, primitive, model, or complete workflow solution from the market.

There are three different “buy” patterns:

| Buy Pattern                       | Description                                                                                                              | Enterprise Implication                                              |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| **Buy a primitive**               | Purchase a reusable building block such as a model, connector, vector database, orchestration layer, or evaluation tool. | Usually lower risk; useful across many workflows.                   |
| **Buy an embedded AI feature**    | Adopt AI built into an existing SaaS or platform already used by the enterprise.                                         | Requires governance of data use, access, output quality, and terms. |
| **Buy a whole workflow solution** | Purchase a vendor’s end-to-end AI workflow.                                                                              | Requires high workflow fit and deeper due diligence.                |

Be sure to distinguish between buying primitives that can be stacked into agentic workflows and buying whole workflow vendors. Whole workflow solutions require the buyer to determine whether the vendor’s workflow shape substantially overlaps with the enterprise’s own workflow.  

#### Use When

Buy is appropriate when:

| Criterion               | Strong Signal                                                         |
|-------------------------|-----------------------------------------------------------------------|
| Workflow commonality    | The workflow is common across companies or industries.                |
| Market maturity         | Multiple credible vendors exist with proven enterprise deployments.   |
| Workflow fit            | The vendor’s workflow aligns strongly with ours.                      |
| Time-to-value           | Buying accelerates value faster than building.                        |
| Integration feasibility | Data, identity, and process integration are manageable.               |
| Risk posture            | Vendor controls meet enterprise standards.                            |
| Exit strategy           | The enterprise can switch, retire, or contain the solution if needed. |

#### Enterprise Standard

A buy recommendation shall include:

1. Workflow fit assessment.
2. Market maturity assessment.
3. Build comparison.
4. Total cost of ownership.
5. Integration architecture.
6. Data usage and retention review.
7. Security and privacy review.
8. AI risk assessment.
9. Contractual protections.
10. Exit plan.
11. Pilot results using representative enterprise data and exceptions.

#### Required Vendor Due Diligence Questions

A vendor shall be evaluated against the following:

| Area               | Required Questions                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------------------|
| Workflow fit       | What exact workflow does the product assume? How does that compare to our workflow?                      |
| Exception handling | What exceptions can the product handle? What requires human review?                                      |
| Data use           | What data is sent to the vendor? Is it used for training? Is it retained?                                |
| Controls           | What access controls, audit logs, and approval mechanisms exist?                                         |
| Explainability     | Can the system provide reasons, evidence, source references, or traceability?                            |
| Evaluation         | What metrics are used? Can we run our own test set?                                                      |
| Security           | How does the product address prompt injection, output handling, plugin/tool risk, and supply chain risk? |
| Agency             | What actions can the AI take? Can permissions be scoped by workflow and role?                            |
| Lock-in            | Can prompts, configurations, data, logs, and workflows be exported?                                      |
| Roadmap risk       | Is the category stable enough for a long-term contract?                                                  |

OWASP identifies major LLM application risks including prompt injection, insecure output handling, supply chain vulnerabilities, sensitive information disclosure, excessive agency, and overreliance. These risks should be explicitly addressed in vendor reviews and architecture reviews. ([OWASP Foundation][5])

#### Examples in IT

| Workflow                                          | Likely Strategy                |
|---------------------------------------------------|--------------------------------|
| Commodity ITSM ticket summarization               | Buy embedded feature           |
| Standard help desk chatbot                        | Buy if mature and controlled   |
| Meeting transcription and action item capture     | Buy                            |
| Cloud cost anomaly detection                      | Buy or buy primitive           |
| Generic code assistant                            | Buy with policy controls       |
| Enterprise-specific architecture decision support | Buy primitives, build workflow |

#### Key Warning

A purchased AI workflow must be “workflow-shaped” like the enterprise workflow. If the product assumes a different operating model, the organization may spend more time adapting the product than expected. For whole-workflow vendors, require a representative pilot using real exception patterns, not only vendor-provided happy-path demos.

---

### Strategy 4: Hire or Develop Capability

#### Definition

Hiring or developing capability is the correct strategy when the enterprise lacks the human expertise needed to define, build, integrate, evaluate, govern, or operate AI-enabled workflows.

This is not simply “hire AI people.” The enterprise should avoid vague roles such as “AI expert” or “AI transformation lead” unless the specific workflow capability gap is defined.

Do not search for the “purple unicorn” who is simultaneously a domain expert, AI builder, systems architect, executive leader, and change agent. Instead, identify the missing human capability required by the workflows as a part of the project planning process.

#### Use When

Hire or develop capability when:

| Capability Gap       | Example Role / Skill                                           |
|----------------------|----------------------------------------------------------------|
| Workflow definition  | Business architect, process architect, domain SME              |
| AI product ownership | AI product manager, workflow product owner                     |
| Evaluation design    | AI evaluator, quality engineer, test data designer             |
| Architecture         | AI solution architect, integration architect                   |
| Data readiness       | Data engineer, data steward, knowledge manager                 |
| Security             | AI security architect, identity engineer, application security |
| Governance           | AI risk lead, model governance lead                            |
| Change               | Adoption lead, training lead, organization design partner      |

#### Enterprise Standard

Before opening an AI role, the hiring manager must document:

1. Which workflow or portfolio of workflows the role supports.
2. Which capability gap exists.
3. Why the gap cannot be addressed through training, partner support, or platform enablement.
4. What deliverables the role will own.
5. How success will be measured.
6. Whether the role is permanent, transitional, or project-based.

#### Build Internal Capability First When Feasible

If someone on the current team can level up within a reasonable period, the enterprise should train and retain that person rather than reflexively hiring externally.

For enterprise IT, this means:

* Train enterprise architects in AI workflow assessment.
* Train product owners in AI evaluation and risk framing.
* Train developers in secure AI application patterns.
* Train security teams in LLM and agent threat models.
* Train business analysts in workflow decomposition.
* Train procurement teams in AI vendor due diligence.
* Train operations teams in AI observability and incident response.

#### Key Warning

Hiring is often the right answer when nobody can define the workflow, evaluation standard, or accountability model. But vague hiring will slow the organization down. Hire or develop for the missing capability, not the AI buzzword.

---

### Strategy 5: Wait or Prototype Narrowly

#### Definition

Waiting is an intentional investment decision to defer major commitment while monitoring the market, improving readiness, or focusing scarce resources on higher-value workflows.

Waiting is not the same as ignoring AI. It is an active portfolio choice.

Waiting is deliberate prioritization: organizations have limited change management capacity and should apply it where AI transformation provides the most leverage first.

#### Use When

Wait or prototype narrowly when:

| Criterion             | Strong Signal                                                               |
|-----------------------|-----------------------------------------------------------------------------|
| Market immaturity     | Vendor category is unstable or likely to change quickly.                    |
| Low leverage          | The workflow is not a priority compared with other opportunities.           |
| Strong current system | Existing deterministic process works well.                                  |
| High uncertainty      | Risk, value, or workflow fit is not yet clear.                              |
| Data unreadiness      | Required data is fragmented, low quality, or not governed.                  |
| Change constraints    | Teams cannot absorb more transformation right now.                          |
| Contract risk         | Long-term commitment would lock the enterprise into an immature category.   |
| Model volatility      | Upcoming model or platform improvements may materially change the decision. |

#### Enterprise Standard

A wait decision must include:

1. Reason for waiting.
2. Owner of the deferred opportunity.
3. Reassessment date.
4. Trigger conditions.
5. Learning plan.
6. Market watch responsibility.
7. Data or process readiness improvements to complete during the wait period.

#### Prototype Narrowly When Learning Is Valuable

Where the market is immature but the workflow may become strategic, the enterprise should run narrow prototypes with explicit learning goals.

A prototype should answer questions such as:

* Can AI handle the core task?
* What data is missing?
* What exceptions dominate?
* What controls are required?
* What is the cost profile?
* Does the vendor/product fit our workflow?
* What would production require?

#### Key Warning

Waiting should not become passive avoidance. Every wait decision must have a review date and decision trigger.

---

## 6. Enterprise AI Investment Matrix

The enterprise should classify each workflow using two primary axes:

1. **Company specificity:** Is the workflow common across the market or specific to how we operate?
2. **Market maturity:** Are credible, mature AI solutions available for this workflow?

The same two axes from before are looked at: how specific the work is to the company and how mature the AI market solution is for the vertical.

|                                                 | **Market Mature**                                                                                                                           | **Market Immature / Thin**                                                                                                           |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| **Common / Commodity Workflow**                 | **Buy**. Prefer mature SaaS, embedded AI, or standard platform capability. Configure rather than customize.                                 | **Wait or prototype narrowly**. Avoid long-term lock-in. Use pilots to learn.                                                        |
| **Company-Specific / Differentiating Workflow** | **Build with bought primitives**. Buy models, connectors, orchestration, and tools; own the workflow, rules, data, and evaluation standard. | **Build only if strategic; otherwise hire/develop or wait**. If the workflow is critical and differentiating, invest. If not, defer. |

### Practical Interpretation

* **Buy the common.**
* **Build the differentiating.**
* **Buy the primitives.**
* **Own the workflow standard.**
* **Hire for missing capability.**
* **Wait when the timing is wrong.**

---

## 7. Required Workflow Investment Review

Every AI proposal must include the following artifacts before funding or architecture approval.

| Artifact                     | Purpose                                                                                                                   |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| Workflow Charter             | Defines the workflow, owner, value, inputs, outputs, decisions, exceptions, and controls.                                 |
| Strategy Recommendation      | Recommends automate, build, buy, hire/develop, wait, or a combination.                                                    |
| Decision Matrix Score        | Scores workflow clarity, value, risk, repeatability, specificity, market maturity, data readiness, and verification cost. |
| Risk Assessment              | Identifies AI, security, privacy, legal, regulatory, operational, and reputational risks.                                 |
| Evaluation Plan              | Defines test data, acceptance criteria, metrics, thresholds, and failure handling.                                        |
| Architecture Overview        | Shows model, data, integration, identity, logging, orchestration, and human review points.                                |
| Operating Model              | Defines ownership, support, monitoring, incident response, escalation, and change management.                             |
| Financial Model              | Includes implementation cost, run cost, vendor cost, infrastructure cost, labor impact, and expected value.               |
| Vendor Review, if applicable | Validates vendor claims, data terms, security posture, workflow fit, and exit options.                                    |
| Production Readiness Plan    | Defines go-live criteria, rollback, observability, audit, user training, and post-implementation review.                  |

---

## 8. Recommended Scoring Model

Each workflow should be scored from **1 = low** to **5 = high**.

| Dimension                 | Question                                                                                                   | High Score Means                       |
|---------------------------|------------------------------------------------------------------------------------------------------------|----------------------------------------|
| Business value            | Does this workflow materially affect cost, revenue, risk, speed, quality, or customer/employee experience? | Strong business case                   |
| Repeatability             | Does the workflow repeat often?                                                                            | Good automation candidate              |
| Workflow clarity          | Can the work be described clearly?                                                                         | Ready for investment                   |
| Exception clarity         | Are exceptions known and classifiable?                                                                     | Safer automation/build                 |
| Error cost                | What is the cost of a wrong output or action?                                                              | Higher governance needed               |
| Judgment intensity        | How much human judgment is required?                                                                       | More likely assist/build than automate |
| Company specificity       | Does the workflow depend on proprietary context?                                                           | More likely build                      |
| Market maturity           | Are credible solutions available?                                                                          | More likely buy                        |
| Data readiness            | Are authoritative data sources available and governed?                                                     | More likely production-ready           |
| Verification cost         | Can outputs be checked cheaply and consistently?                                                           | More likely automate                   |
| Integration complexity    | How deeply must this integrate with enterprise systems?                                                    | Higher delivery risk                   |
| Change capacity           | Can the organization absorb the change now?                                                                | More likely proceed                    |
| Strategic differentiation | Does this create competitive or operational advantage?                                                     | More likely build/invest               |
| Vendor lock-in risk       | Would buying constrain future options?                                                                     | Higher contract scrutiny               |
| Security/privacy exposure | Does the workflow involve sensitive data or privileged actions?                                            | Higher control burden                  |

### Suggested Decision Guidance

| Pattern                                                              | Likely Strategy                                    |
|----------------------------------------------------------------------|----------------------------------------------------|
| High repeatability, high clarity, low error cost, cheap verification | Automate                                           |
| High company specificity, high value, strong data readiness          | Build                                              |
| Low company specificity, mature market, strong vendor fit            | Buy                                                |
| High value but missing evaluation or architecture capability         | Hire/develop, then build/buy                       |
| Low value, immature market, high uncertainty                         | Wait                                               |
| Mature primitives but unique workflow                                | Buy primitives + build workflow                    |
| High error cost, high judgment, unclear workflow                     | Do not automate; define workflow or keep human-led |

---

## 9. Enterprise Architecture Standards for AI Workflows

### 9.1 Reference Architecture Expectations

All AI-enabled workflows should identify the following architectural components:

| Component                | Standard Expectation                                                                                        |
|--------------------------|-------------------------------------------------------------------------------------------------------------|
| Identity and access      | AI systems and agents must operate under scoped identities with least privilege.                            |
| Data access              | Access must be limited to approved data sources and governed by data classification.                        |
| Model access             | Model usage must be routed through approved providers, gateways, or platforms.                              |
| Prompt/config management | Prompts, system instructions, tools, policies, and configurations must be versioned.                        |
| Retrieval                | Knowledge retrieval must use authoritative, maintained sources.                                             |
| Tool use                 | Tools and APIs must be permissioned, logged, and limited by workflow role.                                  |
| Human approval           | High-risk actions must require explicit human approval.                                                     |
| Logging                  | Inputs, outputs, actions, tool calls, approvals, and exceptions must be auditable subject to privacy rules. |
| Evaluation               | Systems must be tested before production and monitored after deployment.                                    |
| Monitoring               | Quality, cost, latency, drift, incidents, and user feedback must be monitored.                              |
| Rollback                 | Production workflows must have a failure and rollback plan.                                                 |
| Exit                     | Vendor-dependent solutions must include portability and termination options.                                |

### 9.2 Security Standards

AI-enabled workflows must address:

* Prompt injection.
* Insecure output handling.
* Sensitive information disclosure.
* Excessive agency.
* Overreliance.
* Supply chain vulnerabilities.
* Insecure plugin or tool design.
* Model denial of service and cost abuse.
* Unauthorized data access.
* Privilege escalation through agent tools.

These areas align directly with OWASP’s LLM application risk categories, including prompt injection, insecure output handling, supply chain vulnerabilities, sensitive information disclosure, excessive agency, and overreliance. ([OWASP Foundation][5])

### 9.3 Agentic AI Standards

For agentic AI, the following additional controls are required:

1. **Agent identity:** Each agent must have a defined identity, role, permissions, and owner.
2. **Action boundaries:** The agent’s allowed actions must be explicitly defined.
3. **Tool allowlist:** Agents may only call approved tools and APIs.
4. **Least privilege:** Agents must not inherit broad user, admin, or service account privileges.
5. **Human approval:** Material business, financial, legal, security, production, or customer-impacting actions require approval unless explicitly authorized by risk governance.
6. **State and memory governance:** Persistent memory must be reviewed for privacy, security, and correctness.
7. **Auditability:** Agent reasoning summaries, tool calls, decisions, and outputs must be logged where appropriate.
8. **Kill switch:** Production agents must be disableable quickly.
9. **Budget controls:** Token, API, infrastructure, and transaction costs must be monitored and capped.
10. **Evaluation:** Agent behavior must be tested against normal cases, edge cases, adversarial cases, and failure cases.

---

## 10. Procurement and RFP Standards

The enterprise shall not issue broad AI RFPs that combine many distinct workflows into one vague request. Broad asks hide many workflows inside a single vendor conversation, resulting in unclear outputs and mismatched expectations.

### 10.1 RFPs Must Be Workflow-Based

Every AI RFP must include:

* Workflow description.
* Current-state process.
* Target-state outcomes.
* Input and output requirements.
* Exception patterns.
* Integration requirements.
* Data classification.
* Security and privacy requirements.
* Human review requirements.
* Evaluation criteria.
* Pilot success metrics.
* Exit requirements.

### 10.2 Vendor Demonstrations Must Use Representative Cases

Vendor demos must include:

1. Normal cases.
2. Edge cases.
3. Known failure cases.
4. Ambiguous cases.
5. Security/adversarial cases.
6. Cases using enterprise-like data.
7. Exception routing.
8. Human escalation.
9. Audit trace.
10. Cost and latency profile.

### 10.3 Contracting Considerations

AI contracts should address:

| Area           | Required Contract Consideration                                                       |
|----------------|---------------------------------------------------------------------------------------|
| Data use       | No training on enterprise data unless explicitly approved.                            |
| Data retention | Defined retention, deletion, and audit rights.                                        |
| Security       | Security controls, certifications, incident notification, and vulnerability handling. |
| Model changes  | Notice and controls for model/version changes that affect output.                     |
| Audit          | Access to logs, evaluation evidence, and control documentation.                       |
| Performance    | SLAs/SLOs for availability, latency, and support.                                     |
| Cost           | Transparent pricing, usage caps, and overage controls.                                |
| Portability    | Export of configurations, prompts, logs, workflows, and data where feasible.          |
| Termination    | Clear offboarding and data deletion obligations.                                      |
| Liability      | Allocation of risk for harmful outputs, data exposure, or unauthorized actions.       |

---

## 11. Governance and Decision Rights

### 11.1 Required Roles

|                         Role | Accountability                                                                     |
|-----------------------------:|------------------------------------------------------------------------------------|
|      Business Workflow Owner | Owns outcome, value, risk tolerance, and acceptance criteria.                      |
|             IT Product Owner | Owns delivery roadmap and product lifecycle.                                       |
|         Enterprise Architect | Owns architectural fit, platform alignment, integration, and standards compliance. |
|           Security Architect | Owns threat model, access controls, and security approval.                         |
|         Data Owner / Steward | Owns data quality, classification, access, and lineage.                            |
|              Legal / Privacy | Owns legal, privacy, contractual, and regulatory review.                           |
|                  Procurement | Owns vendor sourcing, commercial terms, and contracting process.                   |
|                      Finance | Validates business case, cost model, and benefits tracking.                        |
| AI Governance / Risk Council | Owns policy alignment, risk tiering, and exception approval.                       |
|             Operations Owner | Owns support, monitoring, incident response, and production health.                |

### 11.2 Decision Rights by Risk Tier

| Risk Tier | Quantitative Score | Examples                                                                                       | Required Approval                                                                       |
|----------:|:------------------:|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
|       Low |     0.1 - 3.9      | Summarization, drafting, internal productivity, low-risk retrieval                             | Product owner + architecture/security pattern approval                                  |
|    Medium |     4.0 - 6.9      | Workflow recommendations, ticket routing, customer support assistance                          | Business owner + EA + security + data governance                                        |
|      High |     7.0 - 8.9      | Financial, legal, HR, security, production, customer-impacting decisions                       | AI governance/risk council + legal/privacy + executive sponsor                          |
|  Critical |     9.0 - 10.0     | Autonomous actions affecting regulated, safety, material financial, or production environments | Executive approval, formal risk assessment, human approval controls, ongoing monitoring |

---

## 12. Applying the Standard to Common IT Workflows

|                      IT Workflow | Recommended Strategy                             | Rationale                                                                                   |
|---------------------------------:|--------------------------------------------------|---------------------------------------------------------------------------------------------|
| Service desk knowledge assistant | Buy or automate                                  | Common workflow, mature market, low to moderate risk if scoped.                             |
|        Ticket triage and routing | Buy / automate                                   | Repeatable, measurable, human override possible.                                            |
|           Incident summarization | Automate with human review                       | Useful productivity gain; do not allow autonomous remediation without controls.             |
|   Major incident command support | Build with primitives                            | Company-specific systems, escalation rules, and operational context.                        |
|          Change request drafting | Automate / buy embedded                          | Good drafting use case; approval remains human.                                             |
|              Change risk scoring | Build or buy carefully                           | Requires internal CMDB, incident history, architecture, and business impact context.        |
|       Production change approval | Wait or assist-only unless mature controls exist | High error cost and accountability requirements.                                            |
|    Architecture review assistant | Build with bought primitives                     | Depends on internal standards, reference architectures, exception patterns, and governance. |
|        Code generation assistant | Buy with strong controls                         | Mature market; requires secure SDLC, IP, data, and code review controls.                    |
|     Vulnerability prioritization | Build or buy depending on data fit               | Value depends on internal asset criticality, exposure, threat intel, and risk appetite.     |
| Vendor risk review summarization | Buy / automate with legal review                 | Useful document processing workflow; final judgment remains human.                          |
|            Enterprise policy Q&A | Build with retrieval                             | Needs authoritative internal policy sources and traceable answers.                          |
|  Financial operations automation | Workflow-specific; likely build/buy hybrid       | High risk; requires strong controls, audit, and exception management.                       |

---

## 13. Anti-Patterns to Avoid

The enterprise should explicitly avoid the following patterns:

1. **The “AI strategy” blob:** Treating AI as one enterprise initiative rather than a portfolio of workflow investments.
2. **The mega-RFP:** Combining many workflows into one broad vendor ask.
3. **Demo-led buying:** Selecting a vendor based on happy-path demos.
4. **Build without evaluation:** Funding internal build without knowing what good output looks like.
5. **Automation religion:** Trying to automate everything, including workflows where exceptions contain the value.
6. **Agent washing:** Accepting vendor “agentic” claims without verifying actual planning, tool use, autonomy, and governance.
7. **Unbounded agents:** Giving AI systems broad access or action authority without role limits.
8. **No workflow owner:** Deploying AI without a named accountable business owner.
9. **No exit path:** Signing long-term contracts in immature categories without portability or termination rights.
10. **Hiring the unicorn:** Opening vague AI roles instead of hiring for specific workflow gaps.
11. **Waiting without triggers:** Deferring decisions without a review date or reassessment criteria.

---

## 14. Recommended Implementation Roadmap

### Phase 1: Establish the Standard

* Approve this guidance as the enterprise AI investment decision standard.
* Create a required Workflow Investment Review template.
* Add AI workflow review to the existing Architecture Review Board or AI Governance Council.
* Define risk tiers and approval paths.
* Update procurement intake for AI-enabled products.

### Phase 2: Inventory and Prioritize Workflows

* Inventory candidate workflows across IT and business functions.
* Decompose broad opportunities into discrete workflows.
* Score each workflow using the standard scoring model.
* Identify quick automation opportunities.
* Identify strategic build opportunities.
* Identify mature buy opportunities.
* Identify capability gaps.
* Identify wait/prototype opportunities.

### Phase 3: Build Shared AI Platform Primitives

The enterprise should create a governed AI enablement layer so teams do not independently reinvent controls.

Recommended platform primitives:

* Approved model access.
* Identity-aware AI gateway.
* Retrieval and knowledge services.
* Prompt/configuration registry.
* Evaluation framework.
* Logging and observability.
* Agent/tool permissioning.
* Human approval workflow.
* Cost monitoring.
* Security testing patterns.
* Data governance integration.

### Phase 4: Modernize Procurement

* Require workflow-level RFPs.
* Require representative pilots.
* Add AI data usage clauses.
* Add model/version change clauses.
* Add agentic capability verification.
* Add portability and exit terms.
* Add security and risk evidence requirements.

### Phase 5: Operationalize and Scale

* Track realized value against business case.
* Monitor quality, risk, usage, cost, and incidents.
* Review model/vendor changes.
* Update workflows as business processes evolve.
* Retire low-value AI deployments.
* Expand successful patterns to adjacent workflows.

---

## 15. Sample Enterprise Policy Language

The following language can be inserted directly into an enterprise standard:

> **AI Workflow Investment Standard**
> The enterprise shall evaluate AI investments at the workflow level. No AI-enabled solution, agentic workflow, generative AI application, embedded AI feature, or AI automation shall be approved for procurement, build, or production deployment without a documented Workflow Investment Review.
>
> The Workflow Investment Review shall define the business outcome, workflow owner, inputs, outputs, decision points, allowed actions, human review points, exception handling, risk classification, evaluation method, operating model, and selected investment strategy.
>
> The approved investment strategy shall be one or more of the following: automate/delete, build, buy, hire/develop capability, or wait/prototype narrowly.
>
> The enterprise shall not automate workflows that cannot be clearly described, shall not build workflows that cannot be evaluated, shall not buy workflow solutions without validating workflow fit, shall not hire for undefined AI capability, and shall not defer opportunities without documented reassessment triggers.
>
> AI-enabled workflows shall comply with enterprise architecture, cybersecurity, data governance, privacy, procurement, legal, accessibility, audit, and operational standards. High-risk workflows require formal AI governance review and defined human accountability.

---

## 16. Bottom Line

The organization should move from **Buy vs. Build** to **Workflow Investment Strategy**.

The right enterprise question is not:

> “Should we buy an AI tool or build one?”

The right questions are:

> “What workflow are we trying to improve?”
>
> “Can we describe it?”
>
> “Where is the value?”
>
> “Where are the exceptions?”
>
> “What does good output look like?”
>
> “What is the cost of being wrong?”
>
> “Is this work common or company-specific?”
>
> “Is the market mature?”
>
> “Do we have the capability to evaluate and operate it?”
>
> “Should we automate, build, buy, hire/develop, or wait?”

This reframing gives IT and enterprise architecture a more durable standard for AI investment. It avoids hype-led buying, unfocused internal builds, vague hiring, and passive waiting. It also creates a practical way to invest where AI can produce real leverage while preserving governance, accountability, and architectural control.

[1]: https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027 "Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027"
[2]: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10 "Artificial Intelligence Risk Management Framework (AI RMF 1.0) | NIST"
[3]: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile | NIST"
[4]: https://www.iso.org/standard/42001 "ISO/IEC 42001:2023 - AI management systems"
[5]: https://owasp.org/www-project-top-10-for-large-language-model-applications/ "OWASP Top 10 for Large Language Model Applications | OWASP Foundation"
