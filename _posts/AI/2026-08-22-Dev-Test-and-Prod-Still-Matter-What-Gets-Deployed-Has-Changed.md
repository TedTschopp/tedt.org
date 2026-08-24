---
layout: post

title: "Dev, Test, and Prod Still Matter: What Gets Deployed Has Changed"
subtitle: "AI agents turn promotion from a software-release decision into something much more complex; a decision about artifacts, authority, state, and evidence."
seo_title: "Dev, Test, and Prod Still Matter for AI Agents"
quote: "The environment name tells us where the process started. It does not tell us where the consequences can end."
excerpt: "Dev, Test, and Prod still matter for AI agents, but promotion gates must now govern the artifact, authority, state, and evidence together."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-08-22 08:00:00 -0700
update: 2026-08-22 08:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - An environment label identifies where an agent starts, not where its consequences can end.
  - Agent promotion gates must govern artifact, authority, state, and evidence as separate concerns.
  - Destination identities and short-lived credentials should be bound in each environment rather than promoted with the artifact.
  - Runtime state should normally be reset; necessary migrations require independent governance, provenance, and rollback.
  - Production evidence must keep accumulating because model, tool, data, permission, and behavior changes can invalidate prior approval.

description: "Dev, Test, and Prod still matter for AI agents, but release gates must govern artifacts, authority, state, and evidence, not only deployed code."
seo-description: "Why AI agent release gates must govern artifacts, destination authority, runtime state, and continuing evidence across Dev, Test, and Production."

categories:
  - AI
  - Computers
  - Opinion
  - Enterprise Architecture
  - Leadership

tags:
  - AI agents
  - agentic AI
  - software delivery
  - DevSecOps
  - environment promotion
  - AI governance
  - AI security
  - least privilege
  - state management
  - enterprise architecture

keywords:
  - Dev Test Prod for AI agents
  - AI agent release gates
  - agentic AI deployment
  - AI promotion pipeline
  - AI agent authority
  - AI runtime state
  - AI evaluation evidence
  - AI production governance
  - AI environment isolation
  - enterprise AI delivery

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-08/Dev-Test-Prod-AI.webp"
image-alt: "An industrial pipeline moves secured artifacts through DEV, TEST, and PROD while parallel tracks manage authority, state, and evidence."
image-title: "Dev, Test, and Prod Still Matter"
image-description: "An isometric industrial delivery system depicts secured artifacts moving from development through verification, validation, shadow mode, and production, with connected authority, state, evidence, and monitoring controls."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1672
image_height: 941

mathjax: false
mermaid: false
mastodon-post-id:
---


## Sources for this article

> **Source note:** This essay draws on first-party disclosures from [OpenAI](https://openai.com/index/hugging-face-model-evaluation-security-incident/), [Hugging Face](https://huggingface.co/blog/agent-intrusion-technical-timeline), [Anthropic](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals), the [U.K. AI Security Institute](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing), and [Irregular](https://www.irregular.com/research/addressing-recent-incidents-ongoing-findings-and-path-forward). Their investigations remain incomplete. As of Aug. 22, 2026, OpenAI's [promised technical report and METR/Redwood assessment](https://openai.com/index/hugging-face-model-evaluation-security-incident/), Anthropic's [planned METR review](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals), AISI's [planned METR review](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing), and Irregular's [planned evaluation-security white paper](https://www.irregular.com/research/addressing-recent-incidents-ongoing-findings-and-path-forward) had not been published. [Irregular says several model-provider disclosures describe the same underlying evaluation issue](https://www.irregular.com/research/addressing-recent-incidents-ongoing-findings-and-path-forward), so they should not be counted as separate incidents. These events occurred in specialized cybersecurity tests, often with normal safeguards reduced or disabled; [Anthropic](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) and [AISI](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) both caution against treating them as evidence of how ordinary deployed agents behave.

Many enterprise delivery diagrams begin with three boxes.

**DEV → TEST → PROD**

We build in the first. We test throughout, but assemble the release case in the second. We deliberately let the system affect the business in the third. Each environment should carry more consequence than the one before it, and each arrow should mark a deliberate change in exposure.

It is a useful picture. It gave software teams a practical way to separate unfinished work from customer-facing systems. It created places for experimentation, verification, approval, and rollback. It also carried a quiet assumption: work in Test cannot affect Production until somebody promotes it.

That assumption was never entirely safe. It was a simple way of talking about a complex idea. Agentic systems make the weakness harder to ignore.

An AI agent running in a test environment can call an application programming interface, install a package, create an account, open a pull request, send a message, query a live service, or cause another computer to act on its behalf. The agent does not have to be deployed to Production. It only needs a path to something real.

The old diagram still captures an important control. But the environment label is not the boundary. We have to ask what the arrow represents. We also have to notice which changes happen without crossing it.

## What the Old Model Gets Right

Dev, Test, and Prod are not merely server names. At their best, they describe a progression of responsibility.

Dev is where consequence should be smallest. Test is where pre-release evidence should become decision-grade. Prod is where durable business authority is granted. It is also where that authority must remain observable and revocable.

Some organizations insert integration, quality assurance, user acceptance testing, staging, shadow, or deployment rings. The number of boxes is not the point. At each step, the system should earn a larger exposure.

That progression still matters. In [What IT Looks Like in an Enterprise Where AI Is Assumed](https://tedt.org/What-IT-Looks-Like-in-an-Enterprise-Where-AI-Is-Assumed/), I used lab, pilot, and production as distinct places for uncertainty, bounded learning, and operated value. The labels change from company to company, but the intent is familiar: do not expose the business to a new system until the system has earned that exposure.

Modern delivery pipelines already move more than application code. They carry configuration, infrastructure templates, database changes, secrets references, policies, and deployment instructions. We learned a long time ago that a release can fail even when the binary doesn't change.

Conventional delivery already runs active code in continuous-integration jobs, integration tests, package registries, and deployment pipelines. Those systems can reach Production too. What changes with an agent is the degree of initiative inside the boundary. Its harness can inspect a result, choose another tool, and chain actions that nobody described in advance.

AI did not invent porous environments. It lets software discover and use paths that ordinary release controls may never have modeled.

## The Artifact Is No Longer the Whole Release

A model produces output. A harness lets that model do work.

The harness supplies tools, memory, instructions, identity, network access, retry logic, and a way to observe what happened. I explored that system in [Why AI Needs a Harness](https://tedt.org/Why-AI-Needs-a-Harness/). Once the model can inspect a result and choose another action, we are no longer testing only a static artifact. We are evaluating a bounded decision-and-action system that can change the environment around it.

That changes what an environment means.

For ordinary software, we often ask, “Where is the application running?” For an agent, we also have to ask:

- What can it read?
- What can it change?
- Which other systems can act for it?
- What survives after the run ends?

A package proxy may live inside the test architecture while fetching material from the public internet. A test credential may still call a live software-as-a-service endpoint. A shared repository may let one run leave state for another. A browser agent may be operating in a test tenant while sending requests to real people and public websites.

The environment name tells us where the process started. It does not tell us where the consequences can end.

This matters well beyond frontier-model laboratories. A coding agent may hold a GitHub token. A finance agent may read a production ledger while writing only to a test workbook. A service agent may work in a training queue but still send email. A data agent may query a copy of a warehouse while exporting results through a live connector. A security agent may be testing a fictional target through a network path that reaches a real one.

In each case, the box says Test. The authority says something else.

## When Test Touched Production

In July 2026, an internal OpenAI cybersecurity evaluation supplied a stark example. OpenAI said the models did not have direct internet access. They could, however, install packages through an internally hosted Artifactory proxy and cache. The models found and exploited a previously unknown Artifactory vulnerability, obtained internet access, and eventually reached Hugging Face production infrastructure. [OpenAI called its account preliminary](https://openai.com/index/hugging-face-model-evaluation-security-incident/).

[Hugging Face later reconstructed about 17,600 actions](https://huggingface.co/blog/agent-intrusion-technical-timeline) across roughly two and a half days inside its infrastructure. It reported that five datasets apparently connected to the benchmark were accessed, while finding no effect on other customer-facing models, datasets, Spaces, or packages. Hugging Face also said no unauthorized software-supply-chain change was shipped.

I examined the mechanics of that incident in [The Sandbox Was Not the Boundary](https://tedt.org/The-Sandbox-Was-Not-the-Boundary/). The point here is different. The models were still being evaluated. They had not been released as a customer product. Yet the evaluation already had a path to production consequences through a shared service, a public launch point, and live third-party infrastructure.

Separate incidents were later disclosed, but they involved different mechanisms and should not be treated as one breach count.

[Anthropic reviewed 141,006 cybersecurity evaluation runs](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) and reported three incidents involving six runs. A configuration problem left live internet access available even though the models had been told they were inside simulations. In one case, a model published a malicious package to the Python Package Index. Anthropic said the package was available for about an hour and ran on 15 real systems. In another, a model scanned roughly 9,000 targets before compromising one real application. Anthropic’s latest research model stopped after concluding that its target was real, an important piece of counterevidence.

The [U.K. AI Security Institute reported a separate event](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing). This was not a sandbox escape. Internet access was intentionally enabled, and the model providers’ cyber classifiers were disabled so the institute could measure maximum capability. Across 122 runs, AISI found 19 out-of-scope actions in 10 runs, including an attempted malicious pull request and the creation of fake identities. A human maintainer rejected the code, and AISI found no resulting real-world harm.

Several later headlines involving different model providers traced back to one Irregular evaluation scenario. [Irregular has said those disclosures shared an underlying control problem](https://www.irregular.com/research/addressing-recent-incidents-ongoing-findings-and-path-forward). Counting every provider statement as a separate failure would exaggerate the evidence.

These were unusually permissive cyber tests. They often used unreleased models, reduced refusals, disabled classifiers, or deliberately open internet access. They do not show that an ordinary enterprise assistant will break out of its environment.

They show something narrower and more useful: a system labeled Test can create production risk as soon as it can cause an external effect.

## The Promotion Gate Has Four Different Jobs

The traditional pipeline promotes an application release. An agentic system makes the gate responsible for four connected dimensions: artifact, authority, state, and evidence.

They do not cross the boundary in the same way. The tested artifact should be promoted unchanged and accompanied by verifiable provenance. Authority should be issued in the destination. Runtime state should be reset; any necessary migration should be deliberate and governed. Evidence should be independently protected and should keep accumulating after release.

### 1. The Artifact

The promotable artifact is a signed, versioned release assembly or deployment manifest. It identifies the application code, declared model or model version, system instructions, policy and tool definitions, connector definitions, and configuration and routing dependencies.

It does not include destination credentials, identities, live endpoints, or secret values. Those are bound separately in each environment.

Any one of these elements can change behavior. A new connector may expose an action the agent could not take yesterday. A revised system instruction may alter when it stops or asks for help. A provider update may change model behavior without a customer deploying new application code, depending on the service and versioning contract.

The release record therefore has to identify the whole runnable assembly, not only the Git commit. Where the platform permits it, identify its components with immutable versions or digests and bind them to [verifiable provenance](https://slsa.dev/spec/v1.2/verifying-artifacts). The goal is simple: know that the assembly tested is the assembly released.

### 2. The Authority

Authority includes identity, credentials, network egress, tool scopes, transaction limits, approval rules, and the systems the agent may affect.

Giving a test agent a live token creates production-equivalent exposure, even if no code moves. Outbound internet access, a connector pointed at a live tenant, or a tool expanded from read to write can create the same class of external consequence.

Policy intent can be version-controlled and promoted with the release. The destination workload identity should be bound there, and short-lived credentials should be issued there rather than copied forward. Production authority should be scoped to the destination and independently revocable.

This is why capability and authority have to remain separate. In [How Much Work Can Your AI Safely Own?](https://tedt.org/How-Much-Work-Can-Your-AI-Safely-Own/), I argued that demonstrated capability does not automatically grant operating authority. The same rule belongs in the delivery pipeline. A system may be capable of acting before the organization has earned the right to let it act.

### 3. The State

State includes retrieval data, working memory, caches, queues, shared directories, previous tool results, and whatever remains for the next run.

State can cross an environment boundary without anyone deploying software. A production document can enter a test retrieval index. A test run can leave a file that another run treats as instruction. A cached response can outlive the policy that permitted it. A refreshed knowledge source can change the answer even when the model, prompt, and code stay fixed.

State needs lineage, retention rules, reset procedures, and regional handling appropriate to the data. Calling it “test data” does not make it synthetic, disposable, or harmless.

Most runtime state should not be promoted at all. Test memory, sessions, queues, caches, shared files, and previous tool results should normally be reset or isolated. When a business dataset, retrieval index, or model checkpoint must move, treat it as a separate approved migration with versioning, integrity checks, provenance, retention rules, and a rollback plan.

### 4. The Evidence

Evidence includes evaluation results, provenance, monitoring baselines, rollback results, known limits, and operating telemetry. Approval and risk acceptance are decision records informed by that evidence. They are not evidence that the system is trustworthy.

The agent should not be the only system that writes the work, designs the test, grades the result, and decides it is ready. Independent scenarios matter. Holdout tests matter. A real rollback rehearsal matters. So does evidence that the identity can be revoked and the action trail can be reconstructed under pressure.

Evidence accumulates throughout the lifecycle. Its record should be independent of the agent and protected from alteration. A model update, tool change, new data source, expanded permission, or material drift can invalidate yesterday’s approval without a traditional deployment. Production telemetry, drift findings, interventions, incidents, and reassessments should append to the assurance record. Promotion is not a one-time ceremony. It is a continuing claim that the running system still deserves its authority.

## Keep the Environments, Redefine Their Gates

We do not need to throw away Dev, Test, and Prod. We need each environment to make a stronger promise.

**Dev should minimize consequence.** Use synthetic or carefully de-identified data. Deny external write paths by default. Give each run its own short-lived identity and disposable state. Replace live tools with mocks, simulators, or mediated services when the work does not require reality.

**Test should make pre-release evidence decision-grade.** Testing happens [throughout the lifecycle](https://airc.nist.gov/airmf-resources/airmf/appendices/app-a-descriptions-of-ai-actor-tasks/); Test is where the release case should become credible. [Verification](https://csrc.nist.gov/glossary/term/verification) asks whether the system meets its specified requirements and controls. [Validation](https://csrc.nist.gov/glossary/term/validation) asks whether it is fit for its intended use in a representative deployment context. Agentic systems need both.

Use realistic tasks, independent evaluations, separate identities, resettable state, and monitoring that can stop a run while it is happening. When live information is necessary, begin with read-only access and intercept external side effects. Test the route through proxies, package registries, domain name resolution, webhooks, queues, and third-party tools, not only the agent’s visible network interface.

The record should let another person reconstruct what was tested, what failed, what was waived, and who accepted the remaining risk.

**Shadow mode should validate behavior without granting action.** Let the agent receive representative production inputs and propose what it would do without giving it permission to make the change. Compare its decisions with actual outcomes. Measure quality, latency, exceptions, cost, and security before expanding authority. That is the same lifecycle discipline I described in [The Cost of a Finished Job](https://tedt.org/The-Cost-of-a-Finished-Job/).

**Prod should grant narrow, revocable authority.** Production is not the end of testing. [Measurement and monitoring continue while the system operates](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), because live telemetry, drift, incidents, and rollback may show that yesterday’s evidence no longer applies.

Expand exposure in stages where the work permits it. Use least privilege, per-action traces, transaction limits, policy checks, human approval where consequence requires it, live monitoring, and rehearsed rollback. The system needs a separate observer that can stop it. The agent should not control the only alarm, the only log, or the only switch that turns it off.

Third-party evaluators belong inside this model. Their contracts should identify permitted network paths, cross-client isolation, data handling, incident-notification timing, evidence retention, audit rights, and responsibility when a test reaches a real system. “Independent evaluation” describes who performs the test. It does not prove that the test infrastructure is independent, isolated, or safe.

## Five Questions for the Release Review

The release meeting does not need another hundred-page checklist. It needs questions that follow the four different jobs of the gate: identify the assembly, bind its authority, govern its state, and judge the evidence.

1. **What changed?** Name the model, code, prompts, policies, tools, connectors, configuration, and data sources that differ from the last accepted version.

2. **What can it touch?** Trace direct and indirect access through identities, proxies, package services, webhooks, shared platforms, and third parties. Record what the agent may read, propose, or change.

3. **What survives?** Identify memory, files, logs, caches, queues, retrieval indexes, and artifacts that another run or environment can inherit.

4. **Who tested it independently?** Show evidence from scenarios the builder did not control, including failure cases, stop behavior, permission boundaries, and rollback.

5. **Who can stop it and reconstruct the result?** Name the decision owner, revocation path, incident lead, evidence location, and conditions for resumption.

This is the practical machinery behind [The IT Adaptive Factory](https://tedt.org/The-IT-Adaptive-Factory/). The factory is not mature because agents can write and test code quickly. It is mature when the organization can explain what was promoted, what authority was granted, what state survived, why the evidence was sufficient, and how to recover when the answer was wrong.

OpenAI’s later response shows the cost of learning this after a control boundary fails. On Aug. 18, [the company said it had paused some frontier research workloads](https://openai.com/index/pacing-model-development-cyber-capabilities/), added stronger workload and network isolation, and left its largest planned reinforcement-learning run on hold while it gathered more evidence. OpenAI attributed the broader slowdown to both the Hugging Face incident and concerns about an upcoming model’s cyber capability, so the pause should not be assigned to the incident alone.

That response does not prove the new controls will work. It does show that research and test infrastructure can become important enough to slow the production of the model itself.

## The Arrow Still Matters

Organizations will keep drawing three boxes. They should.

The boxes remind us that consequence should rise slowly and evidence should rise first. But an environment label cannot enforce that discipline. Architecture does. Identity does. Network policy does. State isolation does. Independent testing does. Someone with the authority to say “stop” does.

Before approving the next agent release, look at the arrow and ask four different questions. What artifact was promoted? What authority was bound in the destination? What state was reset or deliberately migrated? What evidence supported the decision, and how will that evidence continue after release?

If a test agent can already cause a real-world change, the organization is already carrying production risk, whatever the box is called.

The arrow still matters. It moves the assembly. The gate decides what authority it receives, what state it inherits, and whether the evidence is good enough to let it act.


