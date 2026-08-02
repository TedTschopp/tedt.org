---
layout: post

title: "How Much Work Can Your AI Safely Own?"
subtitle: "Applying the Adaptive Factory Model Across the Enterprise"
quote: "AI removes one constraint and exposes the next one."
excerpt: "Software delivery is only the first example. The same Levels 0–5 apply across enterprise value streams when leaders separate observed behavior, capability, control evidence and authorized AI responsibility."
source: "Original Content"
source-url: ""
call-to-action: "Assess one defined value stream."

date: 2026-08-01 00:00:00 -0700
update:

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g"
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - The six AI maturity levels describe increasing responsibility, not a race toward a corporate score.
  - Each assessment applies to one defined value stream, work class, risk tier and evidence window.
  - Observed team behavior, demonstrated capability, validated controls and authorized AI responsibility are different decisions.
  - People, process and technology must advance together before AI receives more authority.
  - The right target is the highest level the value stream can operate safely, prove and recover from.

description: "Apply AI maturity Levels 0–5 beyond software delivery to finance, legal, customer service, field operations and other value streams using evidence, controls and accountable authority."
seo-description: "A practical guide to applying AI maturity Levels 0–5 across enterprise value streams, separating observed behavior, capability, control evidence and authority."

categories:
  - AI
  - Enterprise Architecture
  - Leadership
  - Business
  - Opinion

tags:
  - enterprise AI
  - AI maturity
  - value streams
  - operating model
  - governed autonomy
  - AI governance
  - business process automation
  - organizational change
  - AI assessment
  - responsible AI

keywords:
  - enterprise AI maturity assessment
  - AI maturity by value stream
  - AI operating model
  - governed autonomy
  - AI controls
  - AI value streams
  - AI transformation
  - AI adoption levels
  - People Process Technology
  - How much work can AI own

image: "/img/2026-08/Enterprise-AI-Maturity.webp"
image-alt: "Six illuminated AI maturity stations progress from Level 0 assistance to Level 5 governed value streams, supported by people, process, controls, and authority."
image-title: "Enterprise AI Maturity Assessment for Your Value Stream"
image-description: "A wide, cinematic illustration of an enterprise AI operating model displayed as six connected factory stations. The stages progress from Level 0, where AI provides assistance, through task automation, workflow support, conditional autonomy, and high autonomy, to Level 5, where AI operates a governed value stream. A digital world map and data network appear above the earlier stages, while business teams collaborate in the background. People, process, controls, and authority are shown as the foundations required for safely increasing AI responsibility."
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org/
image-credits: "Ted Tschopp"
image-credits-URL: https://tedt.org/
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: https://tedt.org/
image_width: 1672
image_height: 941

mastodon-post-id:
---

## The Factory Extends Beyond Code

At 7:45 on Monday morning, the company has already had a productive day.

An AI system matched invoices to purchase orders. Another prepared contract redlines. A third drafted responses to customer complaints. A fourth assembled tomorrow's field work packages, complete with crew, equipment and safety information.

Then the people arrive.

A controller asks why an invoice was matched to a supplier whose bank account changed on Friday. An attorney finds that a proposed clause came from the wrong jurisdiction. A customer-service manager sees that a routine complaint contains a threat of legal action. A field supervisor notices that a job plan crosses a lockout boundary.

The work is fast. The authority to rely on it is not automatic.

In [The IT Adaptive Factory][1], I told a fictional story about how a security fix to an IT product required changes to forty-seven files.  The point of that story was to show how AI moves the IT bottleneck. The machine can finish the implementation before anyone has had coffee, but the organization still has to understand the change, verify the result, integrate it safely, approve the release and own what happens next.

That problem was easy to see in software because software already has globally accepted best practices, metrics, and other visible machinery. There is a work queue, a repository, a build, a test suite, a pull request, a release pipeline, production telemetry and rollback. Other parts of an enterprise have the same elements, even when nobody calls them a factory, and many times no one thinks of them that way.

Finance has source records, accounting policy, reconciliations, approvals, close activities and financial reports. Legal has matter intake, authoritative sources, privileged facts, review, filing and obligation records. Customer service has requests, policies, remedies, escalations and outcome reports. Field operations has work orders, asset records, permits, crew qualifications, inspections and return-to-service decisions.

By value stream, I mean the path from a request to a business outcome. I explored the architecture behind that path in [The AI Value Stream][2]. The factory is the method around the model: how work enters, how context is supplied, how decisions are made, how results are checked, how exceptions are handled and how the organization learns.

Calling it a factory describes a method of work explicit enough to observe, test, interrupt and improve. People remain responsible for the judgments and consequences the method assigns to them.

| The IT Factory                 | The Enterprise Equivalent                                                               | The Question Leaders Must Answer                                       |
|--------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Issue or feature request       | Approved business request or outcome                                                    | Is the work eligible, bounded and owned?                               |
| Repository and documentation   | Systems of record, policy and authoritative knowledge                                   | Does the AI workflow have the right context?                           |
| Pull request                   | Decision-ready work package                                                             | Can a qualified person understand what is being proposed?              |
| Test suite and security checks | Independent verification, reconciliation, policy, fairness, safety or compliance checks | Does the evidence prove the intended result?                           |
| Release approval               | Business authority to act                                                               | Who may accept the outcome and under what limit?                       |
| Deployment and production      | Action inside the operating value stream                                                | What people, records, money, customers or physical systems can change? |
| Rollback and incident response | Containment, reversal, correction and recovery                                          | Can the organization stop and recover before harm spreads?             |
{: .table .table-striped .table-bordered .table-hover }


Each part of the modern enterprise has its own names for the same mechanism.

## Assess a Work Class, Not a Department

Finance is not Level 4. Legal is not Level 2. Customer service is not Level 5.

By work class, I mean a repeatable kind of job with the same purpose, rules and decision limits. One work class may operate at Level 4 while the rest of the function operates somewhere else.

A finance team might use outcome-based approval for routine, low-risk reconciliations while requiring full human preparation and review for a material accounting estimate. Customer service might allow AI to resolve a password-reset case inside a small remedy limit while keeping account termination and legal complaints entirely in human hands. A legal team may use AI to assemble a routine research package without giving it authority to provide legal advice, waive privilege or file a binding document.

The useful unit is specific:

1. One value stream.
2. One business unit or team.
3. One class of work.
4. One risk tier.
5. One recent evidence window.

That last item is important.  If we are going to apply AI to a given area we need to measure it and demonstrate the AI is performing above human levels of quality.  To do that you need evidence.  You need an assessment to understand what work you need to do for the AI to get started.  A pilot from six months ago does not describe standard work today. A plan in a slide deck is not an operating pattern. The assessment should use representative work from a defined period: the last eight to twelve weeks, one complete operating cycle, three complete operating cycles or a sustained cross-cycle window, depending on the work and target level.

This also changes how we think about legacy work. In software, hidden rules live in stored procedures, scripts, configuration files and the memory of the person everyone calls when month-end fails. Outside IT, the same rules hide in spreadsheets, email inbox rules, clause libraries, desk procedures, old forms, desktop automation scripts, unofficial checklists and the habits of experienced employees.

AI can help recover that knowledge. It can compare records, trace decisions, summarize cases and propose scenarios. But at the end of the day, people still have to decide whether a discovered pattern is policy, a useful exception, an obsolete workaround or a mistake that has been repeated for ten years.

You cannot safely automate a process the organization cannot explain and verify. The assessment should show whether the work is eligible, bounded and owned, whether the AI workflow has the right context, whether a qualified person can understand what is being proposed, whether the evidence proves the intended result and who may accept the outcome and under what limit.

> **Assess One Defined Value Stream**
>
> Separate observed behavior, demonstrated capability, validated controls and authorized AI responsibility, then turn the gaps into People, Process and Technology actions.
>
> [Take the Enterprise AI Maturity Assessment][9]{: .btn .btn-primary }
{: .alert .alert-call-to-action }

## The Six Levels Outside IT

The model I talked about last week used software-oriented names such as coding intern, junior developer and dark factory. The enterprise model keeps the same progression and applies local names, owners, and actors names more directly.

### Level 0: Inline AI Assistance

AI owns a suggestion or draft fragment. The person still performs the work by copy and pasting it into the deliverable and checks each contribution as it is used.

An HR specialist may ask AI to summarize a policy or draft a routine message. A strategist may ask it to organize market evidence. A field technician may use it to retrieve an asset record. The AI helps, but it does not own a complete task.

The common mistake is measuring keystrokes, drafts or accepted suggestions. Those numbers tell us that the tool was used and perhaps how many letters were typed. They do not tell us whether the value stream became faster, safer or less expensive.

### Level 1: Bounded Task Delegation

AI owns one clearly limited task. A qualified person defines the boundary and fully reviews the result.

In finance, the task might be matching selected records or drafting one reconciliation explanation. In legal, it might be summarizing one document. In customer service, it might be drafting a response that a representative checks before sending.

The quality of the request begins to matter. This is where [specification thinking][3] becomes more useful than a clever prompt. The task needs a purpose, source material, exclusions, acceptance evidence and a clear stopping point. “Review this contract” is an invitation to guess. “Compare Section 12 with our approved fallback language, identify deviations, cite the source text and do not recommend a legal position” gives the AI workflow a bounded job.

### Level 2: Multi-Step Work Package Delegation

AI owns connected steps inside one work package. People manage context, review checkpoints and approve completion.

A procurement workflow might assemble the approved need, supplier records, bid evidence, conflict disclosures and evaluation criteria into a proposed recommendation. People still review material judgments, competition exceptions and conflicts. A field-operations workflow might combine the work order, asset history, crew qualifications, permits and safety rules into a proposed job package. Named field roles retain every required authorization, including safety-critical work, stop-work, emergency and return-to-service decisions.

When [output becomes abundant][4], review capacity becomes scarce. Faster assembly creates more packages for experienced people to inspect. If the context is stale, the checkpoints are vague or recovery is manual, the organization has built a faster way to create review debt.

### Level 3: End-to-End Deliverable Ownership

AI owns the routine path for one eligible deliverable. People design the work, govern exceptions and retain consequential decisions.

For an eligible customer-service case, AI might take the work from intake through fact gathering, policy selection, proposed remedy, communication, records and escalation checks. A human does not have to perform every intermediate step. The case still leaves the automated path when identity is uncertain, the remedy exceeds a limit, the customer may be harmed or a legal or regulatory issue appears.

This is the management where executives and managers need to step in and start to understand what's going on. The team judges a completed deliverable and its evidence. It also needs a normal way to reject the work, return it for correction, suspend the workflow and classify why it failed.

### Level 4: Outcome-Based Approval

AI owns the work needed to achieve an approved outcome inside explicit authority limits. The named accountable people, who executives and managers empowered, authorize the result using evidence produced independently of the AI workflow that performed the work.

In legal work, separate checks against the controlling authority, client facts and approved legal positions can test the work before counsel relies on it. Licensed counsel still gives the advice and retains filing, waiver, privilege and settlement decisions. In finance, independent reconciliation, accounting-policy and control evidence may support a routine work product. Authorized people retain posting, certification and material-judgment authority.

The word independent carries most of the weight. A polished artifact is not a decision; [the evidence and decision boundaries around it][5] determine what people may safely authorize. An AI workflow cannot establish independent assurance for its own work merely by writing the test, selecting the evidence and grading the answer. The organization needs protected scenarios, reconciliations, holdout cases, safety checks, fairness checks or other independently governed evaluations that can block the outcome.

### Level 5: Qualified Autonomous Operations

AI owns a governed stream of qualified outcomes inside fixed limits. People, who executives and managers empowered, govern policy, risk, capital, capacity, exceptions and reauthorization. Required reviews, irreversible actions and nondelegable decisions remain with named people.

The word qualified really matters here.  You can't just have AI doing whatever it wants.  It has to be qualified to do the work, and the organization has to have a way to govern it.  The organization needs to know what the AI is doing, how it's doing it, and what the consequences are.  Those people who are empowered to govern the AI need to have the right authority, craftmanship, knowledge, experience, and oversight to ensure that the AI is operating within the defined limits and producing outcomes that are safe, reliable, and aligned with the organization's goals.  This is not a role for someone who is just a manager or an executive.  This is not a role for someone who tracks metrics and compliance to them, this is not someone who is good at managing a the delivery of a product.  This is the role for a person on your team who has deep knowledge in a handful of areas and an above average level of knowledge in the rest of the value stream.

A Level 5 field-operations factory is a governed queue that can plan and coordinate routine, qualified work. People control physical execution and retain dispatch, stop-work, emergency and return-to-service authority.

A Level 5 finance factory may process routine eligible activity within approved policies and authorities. People still own material judgments, certifications, external reporting and exceptions. A Level 5 HR factory may handle routine employee-service requests. It does not make consequential hiring, pay, discipline or separation decisions.

The sequence moves human attention from performing each step to defining intent, setting boundaries, evaluating evidence, handling exceptions and governing the operating system. It makes responsibility more explicit.

## The Same Level Can Carry Different Risk

A marketing workflow that drafts an internal campaign brief and a field workflow that prepares a safety-critical job plan may show the same maturity pattern. They should not receive the same authority.

Risk classification applies to the end-to-end workload. The assessment asks about five things:

- Business and operational impact.
- Data sensitivity and regulatory exposure.
- What the AI may decide, change or access.
- How far an error could spread and whether the organization can reverse it.
- Safety, customer, financial and reporting consequences.

The highest triggered factor sets the risk tier. Lower-risk factors do not offset it.

**Not Classified** means material facts or required approvals are missing, so existing authority limits remain in place. **Low** describes localized, readily reversible work using public or low-sensitivity information with no consequential decision authority. **Moderate** may use approved confidential information or scoped system access when standard recovery can restore the expected state. **High** includes sensitive or regulated information, privileged access, several connected systems or consequential recommendations whose failure could cause material harm, loss, disruption or compliance exposure. **Critical** covers potentially irreversible harm or enterprise-wide loss of control involving life safety, legal rights, employment, essential operations, market-moving or material financial reporting, highly restricted information or enterprise-wide authority.

Risk changes what authority the workflow may receive. It also changes the evidence, independence, approval, monitoring and recovery required before that authority is granted.

Enterprise policy may authorize Level 4 handling for a lower-risk work class while restricting a critical work class to Level 1. That difference comes from policy and the accountable risk owner's authorization, not from a hidden arithmetic penalty in the maturity score.

## Four Questions, Not One Maturity Number

Maturity models become dangerous when a leader asks for one number and the organization gives one.

Assessments should keep the following four judgement areas separate.

1. **What pattern is ordinary?** The observed operating pattern is the lowest of seven completed ratings: the largest delegated work unit, intake detail, AI workflow responsibility, human review, verification and validation, operating authority and the work that consumes most human attention.
2. **What capabilities are present?** The capability index is a weighted result across 50 ratings. It asks whether the team can frame the work, maintain standards and source knowledge, verify results independently, protect data, recover from failure, assign ownership and measure outcomes.
3. **Have the cumulative controls been demonstrated?** A control-validated level requires every control from Level 1 through the candidate level to be Demonstrated. Partial, failed or unassessed controls do not authorize that level.
4. **Does the validated result meet the planning target?** Target Authorization says whether the control-validated level meets the selected target. Risk tier, enterprise policy and a named decision owner still determine what operating authority may actually be granted.

A team may behave like Level 4 and have strong capability ratings while still lacking the control evidence needed to authorize Level 4 work. Perhaps identity is shared. Perhaps the evaluation set is visible to the builder. Perhaps nobody has rehearsed rollback. Perhaps an accountable owner appears on the organization chart, but neither the team's operating practice nor the technology's decision and escalation routing identifies who acts when the workflow reaches an exception.

Incomplete controls do not reduce that team to Level 0. Level 0 is a real pattern in which AI provides suggestions while people perform the work. After all seven operating ratings and 50 capability ratings are complete, Level 0 means the observed pattern or capability index does not meet the Level 1 base. When behavior and capability meet that base but the required Level 1 controls do not, the accurate result is **Control Validation Not Established**.

The control statuses carry the same discipline. **Demonstrated** can support authority. **Partly Demonstrated** records progress. **Not Demonstrated** records a gap. **Not Assessed** says the evidence has not been examined. Progress is useful, but it is not permission.

## Team Behavior, Human Skill and the AI Workflow Are Different Things

The sentence “we have a control” can hide three different thigns.

**Practitioner skill** is something a named person can demonstrate on realistic work. Can the practitioner frame a bounded task, detect a bad source, challenge an answer, interpret evidence and know when to escalate? A course completion record shows that someone attended training. It does not prove the skill.

**Value-stream team practice** is a repeated way people work together. Does the team hold specification clinics, compare difficult cases, calibrate reviewers, name decision owners, record exceptions and learn from failures? A written procedure does not prove the team follows it when the queue is full.

**AI workflow and technology** are the controls enforced or recorded by [the agent system and the harness around it][6]. Does each run use a managed identity? Are permissions limited to the work? Are authoritative sources versioned? Can independent checks stop the workflow? Are actions logged? Can the system suspend, reverse or reconstruct a failed run?

A manual workaround does not prove the technology enforces the boundary. An automated gate does not prove the team knows how to handle the exception it creates. A skilled individual does not replace a missing organizational decision.

One person may fill several compatible roles, but every responsibility still needs a name beside it: the business outcome, work design, independent verification, platform, security, continuity and records. Some duties need separation. The person preparing work should not be the only person deciding whether the evidence is sufficient. The technology owner should not silently acquire business authority because the tool can perform an action.

The handoff is part of the control.

## People, Process and Technology Have to Move Together

I described the executive side of this shift in [Beyond the Light Bulb][7]. It is tempting to describe the path to Level 5 as a tooling program. When leaders do that, Level 5 remains a demonstration instead of becoming the normal way of working.

### People

People need time to practice work design, specification, evidence review, exception handling and incident decisions on real cases. Leaders need to name the accountable owner, the people who may authorize outcomes, the people who verify them and the deputies who act when the usual expert is absent.

The apprenticeship changes too. A junior analyst, buyer, paralegal, HR specialist or dispatcher still needs a place to build judgment after AI takes over routine preparation. Teams need case reviews, paired evaluation, failure analysis and supervised authority. I made the broader case for designing roles, trust and incentives in [AI Is a People Change][8]. A value stream that produces more work while producing fewer people who understand the work has borrowed productivity from its future.

### Process

The operating process needs an eligibility rule, a risk classification, an evidence standard, decision limits, exception paths, appeals, change control and reauthorization. Each work class needs a defined intake, authoritative sources, completion criteria and a recovery method.

Leaders should know what the evidence can authorize. A successful pilot may support a decision to run another bounded pilot. A representative evidence window may support narrow expansion only after the required capability thresholds and cumulative controls pass. Neither a pilot nor a small sample proves that the whole function can operate autonomously.

### Technology

The technology needs managed identities, least-privilege tools, versioned context, durable state, independent evaluation, policy enforcement, monitoring, stop controls and recovery. It must retain enough evidence to show what the AI workflow saw, what it did, which checks ran, who authorized the outcome and what happened afterward.

The model matters. The operating platform matters more over time. A company can replace a model. Rebuilding its specifications, decision rules, scenario library, operating evidence and recovery discipline is harder.

## Measure the Queue That Moved

AI output is easy to count. Accepted suggestions, generated pages, closed cases and completed work packages all make a busy dashboard.

But easy metrics do not align with the value-producing outcomes.  You need to ask if the whole value stream improved.

Establish a baseline before changing the workflow. Software teams may use DevOps Research and Assessment (DORA) measures alongside flow and quality measures. Other value streams can use Lean Six Sigma measures suited to their work. The shared questions are familiar:

- Did end-to-end cycle time fall?
- Did human touch time fall, or did it move to senior more scarce reviewers?
- Did queue time, rework or exceptions increase?
- Did defects, complaints, incidents or control failures escape?
- Did cost fall after evaluation, repair and operating effort were included?
- Did the customer, employee, supplier or business outcome improve?

Measure quality-adjusted flow. If AI completes a package in ten minutes and creates three hours of expert review who have work in progress (WIP), the ten-minute number is not the result. If a customer case closes faster and reopens twice, closure rate is not the outcome. If a reconciliation is automated and the controller cannot reconstruct it, the saved effort came with a new liability.

AI removes one constraint and exposes the next one. The measurement system should tell you where the queue went.

## Set the Right Authority for the Work

Different work classes should stop at different levels. Some work belongs at Level 1. Some work may operate at Level 4 for years because human outcome approval is valuable. Some critical decisions may never qualify for autonomous operation.

The useful target is the highest level the value stream can operate safely, prove with current evidence and recover from when the result is wrong.

Start with one work class. Classify the risk. Name the decisions that remain human. Record the current cycle time, effort, quality, exceptions and cost. Demonstrate the next level on representative work. Remove the blockers in people, process and technology. Expand authority only after the evidence supports it.

I built the [Enterprise AI Maturity Assessment for Your Value Stream][9] to make that discussion concrete. It covers 29 value streams across core, supporting, strategic and control functions. It uses six levels, seven operating axes, 50 capability ratings and 31 cumulative controls. The result separates observed behavior, capability, control validation and Target Authorization, then organizes the next actions into People, Process and Technology.

Use it with the people who do the work, the people who own the outcome and the people who independently challenge or verify it, including risk, compliance, audit, legal or safety partners where they are needed. Their disagreements are useful. They show where the operating model still depends on assumptions.

> **Assess one defined value stream**
>
> Separate observed behavior, demonstrated capability, validated controls and authorized AI responsibility, then turn the gaps into People, Process and Technology actions.
>
> [Take the Enterprise AI Maturity Assessment][9]{: .btn .btn-primary }
{: .alert .alert-call-to-action }

## A Factory That Can Explain Itself

Return to that Monday morning.

A dashboard may announce that invoices were matched, contracts were redlined, customer cases were closed and field work was planned while everyone slept. That report is only the start.

The enterprise needs to know which invoice matches were qualified, which contract changes require counsel, which customer cases crossed a remedy or legal boundary, and which field jobs need a human safety decision. The evidence should show why the routine work was accepted. The workflow should stop when the facts no longer fit the approved case.

An adaptive factory learns from those stops. It studies the exception, corrects the rule or source material, strengthens the evaluation, adjusts the boundary and decides whether that class of work should qualify again.

AI can perform more of the steps. The enterprise still decides which steps count as success.

AI may finish the work before morning coffee. When the people arrive, the organization must still explain why that work was allowed, how it was judged and who owns the consequence.

[1]: https://tedt.org/The-IT-Adaptive-Factory/ "The IT Adaptive Factory"
[2]: https://tedt.org/AI-Value-Stream/ "The AI Value Stream: Why the System Matters More Than the Model"
[3]: https://tedt.org/How-to-Communicate-in-a-World-of-AI/ "How to Communicate in a World of AI"
[4]: https://tedt.org/When-Output-Becomes-Abundant/ "When Output Becomes Abundant"
[5]: https://tedt.org/The-Map-Is-Not-the-Decision/ "The Map Is Not the Decision"
[6]: https://tedt.org/Why-AI-Needs-a-Harness/ "Why AI Needs a Harness"
[7]: https://tedt.org/Beyond-the-Light-Bulb/ "Beyond the Light Bulb: The Executive Work of AI Adoption"
[8]: https://tedt.org/AI-Is-a-People-Change/ "AI Is a People Change, Not Just a Technology Change"
[9]: https://tedt.org/assessments/enterprise-ai-maturity-assessment/ "Enterprise AI Maturity Assessment for Your Value Stream"
