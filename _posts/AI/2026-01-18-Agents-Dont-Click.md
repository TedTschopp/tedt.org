---
layout: post

title: "Agents Don’t Click"
subtitle: "How Agentic Workflows Turn UIs Into Receipts"
quote: "Agents don’t click. They read. They write. They prove."
excerpt: "A thesis about the next platform shift: agentic workflows move interaction from human-first UIs to tool calls, policy and auditability — turning many screens into generated receipts and approval gates."
source: "Original Content"
source-url: ""
call-to-action: ""

date: 2026-01-18 07:21:20 -0800
update: 2026-01-18 07:21:20 -0800

author:
   avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
   name: Ted Tschopp
   url: https://tedt.org/

bullets:
- Argues agentic workflows shift interaction away from human-first UIs.
- Reframes UIs as generated “receipts” for proof, approvals and exceptions.
- Proposes a layered model: durable truth, in-flight coordination, derived context and traceability.
- Explains why permissions, policy hooks and auditability replace seat-based assumptions.
- Outlines what “agent-grade” APIs need: idempotency, rich errors, provenance, trace IDs and versioned contracts.

description: "A thesis about how agentic workflows change software: systems of record and governed APIs become the durable value, while many UI-heavy workflows become synthetic, generated approval and audit surfaces."

seo-description: "Agentic workflows shift software away from UI-centric click paths toward policy, permissions, audit logs and agent-grade APIs — turning many screens into generated receipts and approval gates."

categories:
- AI
- Computers
- Communications
- Opinion

tags:
- agentic-systems
- ai-agents
- workflows
- systems-of-record
- systems-of-engagement
- ui
- apis
- governance
- auditability
- policy
- authorization
- idempotency
- observability
- traceability

keywords:
- "AI agents"
- "agentic workflows"
- "systems of record"
- "systems of engagement"
- "APIs are the product"
- "policy as code"
- "authorization and consent"
- "audit logs"
- "traceability and replay"
- "idempotency"

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/2026-01/Agentic-Office.webp
image-alt: "Dimly lit operations office seen through a glass wall, with desks and multiple monitors showing blue dashboards."
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org/
image-description: "A quiet, modern operations room viewed from outside through floor-to-ceiling glass. Several workstations line the space, each with multiple large monitors filled with blue interface screens. Overhead fluorescent panels and a warm light source create soft haze and reflections, with a blurred tabletop in the foreground adding depth to the scene."
image-title: "The Agentic Office"
image_width: 1456
image_height: 816


mastodon-post-id:
---

Every platform shift has a familiar pattern: the underlying machinery stays, but
the *interface layer* gets rewritten.

Command line didn’t “die” when the GUI arrived — it stopped being the default. The
mouse didn’t “die” when touch arrived — it stopped being the primary way most
people interacted with computers.

Something similar is happening now.

Not because SaaS, databases, or software disappear. Because the **primary
consumer of software is changing**.

Over the last 30 years, we optimized software around **human attention**:
screens, workflows, dashboards, training and click-paths. In the next era, a
growing share of interaction will be performed by **agents** — and agents don’t
click.

They read. They write. They prove.

That’s the pivot.

## My Claim, Stated Plainly

**SaaS isn’t dying. The role of SaaS is changing.** **Databases aren’t dying.
The role of databases is changing.** **Software isn’t dying. The role of
software is changing.**

What *is* dying is the idea that the **interface is the product** — especially in
enterprise workflow software where the UI has historically been the most visible
(and most monetized) layer.

A large chunk of what we pay a premium for today — **human-first, UI-centric,
seat-based software** — is about to get devalued.

I’m not arguing from the outside. I built and sold SaaS in the early era of the
web application model (starting in 1999) and I’ve lived through multiple shifts
in how software is packaged, sold and operated. So when I say “I get it,” I
do — and I also have enough scar tissue to recognize when a layer is becoming a
commodity.

## AI Is Still in the Apple II Phase

People point to the weaknesses of early AI chatbots and conclude: “See, it won’t
work.”

But the chatbot phase was never the final form. “Agent at the keyboard” is
closer — but it’s not the endpoint either. Voice assistants are also not the final form.

Tools like GitHub Copilot and Copilot for M365 matter not because they’re perfect, but because they’re **directionally correct**. Give these systems:

* larger and more durable working context (better memory)
* more ways to take real action (tooling and permissions)
* better verification harnesses (tests, evals, replay, constraints)
* steady model improvements (reasoning, planning, synthesis)

…and the “breakthrough moment” won’t be one giant leap. It will be slow
compounding day after day and week after week — until suddenly the world looks different.

## What *Is* an “Agent”?

When I say **agent**, I mean:

> A system that can observe, plan, decide and execute multi-step work by calling tools and APIs, operating under policy constraints, producing an auditable record of actions and outcomes.

That definition matters, because “agent” is not:

* a chatbot that only talks you
* a chatbot that guides you through a workflow
* a macro recorder
* a magical omniscient assistant
* a “smarter UI” that just makes the same clicks faster
* a “no-code” tool that generates a UI for you

It’s closer to **automation plus reasoning plus governance**.

## A Better Mental Model: Layered State and Layered Responsibility

If you want the cleanest mental model for agentic software, it isn’t “a smarter
UI.”

It’s a **layered model of state and responsibility**.

Enterprise systems already have distinct layers with distinct tradeoffs:

* **durable vs ephemeral**
* **authoritative vs derived**
* **global truth vs local convenience**
* **trusted vs speculative**
* **governed vs opportunistic**

Agentic software will formalize those layers — and make the interfaces between
them the product.

### Map the Layers to the Enterprise Stack

Here’s the mapping:

| Agentic stack layer                            | Enterprise analogue                         | What it’s for                                                                           |
| ---------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Durable truth (authoritative state)**        | **Systems of Record** (source of truth)     | Contracts, data, permissions, audit logs, canonical workflows, compliance artifacts     |
| **Operational coordination (in-flight state)** | **Operational state and event streams**     | In-flight work, queues, workflow state machines, triggers, reconciliation               |
| **Derived projections (contextual surfaces)**  | **Generated views and agent working context** | Fast task context, temporary summaries, “what matters right now,” ephemeral UI surfaces |
| **Step-level execution context**               | **Current task frame**                      | The specific request, constraints, approvals and tool calls for *this* step             |
| **Reproducibility and traceability**           | **Traceability, replay and versioning**     | “What changed?”, “Which truth is current?”, “Can we reproduce what happened?”           |
| **Access boundaries and guardrails**           | **AuthZ and policy enforcement**            | Least privilege, scoped permissions, risk tiers, approvals, separation of duties        |
| **Governance telemetry**                       | **Observability-as-governance**             | Accountability, anomaly detection, policy violations, cost and rate control             |

This is why “systems of record vs systems of engagement” is such a powerful
split:

* **Systems of record** are durable truth.
* **Systems of engagement** become derived surfaces: useful, fast, replaceable,
  and often regenerated.

The hard problem in agentic systems will feel very familiar to enterprise architects and system of systems engineers:

> Keeping derived surfaces consistent with durable truth is hard. Permissions
> are hard. Proving what happened is hard.

Which brings us to what “dies.”

## What I Mean by “Software Is Dying”

When people hear “software is dying,” they imagine I mean:

* databases disappear
* APIs disappear
* business logic disappears
* everything becomes vibes

No.

Here’s what I actually mean.

### Software Splits Into Two Classes

1. **Systems of record (durable truth)** Data. State. Contracts. Permissions.
   Audit logs. Policy enforcement points. APIs. The stuff that was true
   yesterday and will still be true tomorrow.

2. **Systems of engagement (ephemeral interaction)** Dashboards. Forms. Workflow
   screens. Task boards. Click paths. The stuff we built primarily so humans
   could steer the machine.

My claim is **not** that systems of engagement vanish.

It’s that they stop being the **centerpiece product**.

They become: thinner, more replaceable, more personalized and increasingly **generated on demand** from the system of record.

The UI becomes less like a “crafted application” and more like a **temporary
audit surface**.

## The Interface Doesn’t Vanish. It Becomes Synthetic

In an agent-forward world, the “screen” is often the equivalent of a receipt.

A good synthetic interface answers four questions:

* **What did the agent see?** (inputs, sources and versions)
* **What did it do?** (tool calls and state changes)
* **Why did it do it?** (policy, reasoning summary and constraints)
* **What does it need from me?** (approval, exception handling, or escalation)

In other words: the UI becomes the place humans go for **judgment, exceptions,
and accountability** — not the place where all work is performed.

## A Concrete Example: “Agent Eats the UI” in a Real Enterprise Workflow

Let’s take a workflow almost every enterprise recognizes:

### Example: Access Request + Least Privilege Approval (Teams → SailPoint → Azure AD → Audit)

#### How It Works Today (Human-First UI Loop)

1. Employee pings IT in chat: “Need access to finance reporting.”
2. IT creates a ticket in BMC Helix or SailPoint (or the employee fills a form).
3. IT checks policy docs, role definitions and manager approval requirements.
4. IT logs into identity admin UI, searches the user, assigns a role or group.
5. IT updates the ticket, notifies manager, maybe attaches screenshots.
6. Security or audit later asks: “Why was this access granted? Who approved it?”

This is *all UI*.

It’s not “hard” work. It’s **coordination work**.

#### How It Works in an Agent-First Model (API, Policy and Audit)

1. Employee asks in chat: “I need finance reporting access for Project X.”
2. The agent:

   * pulls the user’s org context (SuccessFactors)
   * checks the access policy (policy-as-code)
   * finds the least-privilege role that satisfies the request
   * generates an approval request to the manager and data owner
3. Once approvals are granted, the agent calls identity APIs to assign the role.
4. The agent writes back:

   * ticket updates
   * identity change record
   * audit log entry with trace IDs
5. If anything is unclear (conflict, risky role, missing justification), it
   escalates.

#### What the “UI” Becomes (Synthetic Receipt and Approval Surface)

Instead of a maze of admin screens, the human sees a generated review panel:

* **Request:** “Finance reporting access for Project X”
* **Recommended role:** `FIN_REPORT_VIEWER` (least privilege match)
* **Policy basis:** `FIN-ACCESS-042` (requires manager and data owner approval)
* **Risk tier:** Medium (read-only; no export)
* **Approvers:** Manager ✅, Data Owner ✅
* **Planned change:** Add user to group `fin-report-viewer`
* **Rollback plan:** Remove group membership (idempotent)
* **Evidence:** Links to the exact policy version, relevant tickets and trace log
* **Action:** Approve, reject or request an exception

That’s “UI,” but it’s not UI-as-product. It’s UI-as-proof.

And note what became valuable:

* the **policy**
* the **role model**
* the **audit trail**
* the **APIs**
* the **ability to replay and explain**
* the **operational controls** (rate limits, approvals, trace IDs)

Not a beautifully designed workflow screen.

## So Why Is SaaS in for a Rougher Ride?

Because a lot of SaaS pricing and product strategy assumes:

* a **human** user
* a bounded amount of activity
* a UI-driven loop
* a seat-based price metric that maps to value

Agents break those assumptions.

Agents don’t need seats. They need:

* scoped access
* throughput
* governance
* budgets
* auditability

Which forces a shift:

### Permissions Replace Seats

The unit of value drifts from “named user” to something closer to:

* scope of access (what can it touch?)
* volume of work (how many transactions or actions?)
* risk tier (what’s the blast radius?)
* audit or compliance level (what evidence must exist?)
* business criticality (what happens if it’s wrong?)

You don’t license an agent the way you license a person. You govern it the way
you govern **an integration** — except with more autonomy and more need for proof.

## Why the “APIs Become the Product” Line Becomes Literally True

People say “APIs are the product” today, but they often still mean: “We have
APIs, plus the real product is the UI.”

In an agent-forward world, the API *is* the primary interface.

But not just any API.

CRUD APIs won’t carry the weight. Agent-grade products need APIs with:

* **task-level verbs** (not just create or update)
* **idempotency** and conflict handling
* **rich error semantics** (what failed, why, what to do next)
* **trace IDs** and end-to-end correlation
* **versioned contracts** (breaking changes are catastrophic under automation)
* **policy hooks** (what is allowed, blocked, or requires approval)
* **provenance** (“where did this data come from?”)

If an agent can’t complete the workflow end-to-end through those interfaces, the
UI becomes secondary — useful for humans, but not the primary value carrier.

## Commoditization: Where Value Moves When “Software” Gets Cheap

When capabilities converge, the software layer stops being the differentiator.
Price pressure rises, switching gets easier, margins compress and value
migrates to what’s scarce.

Here’s the quick economic chain (same pattern shows up everywhere):

   1) raw inputs → 2) commodities → 3) products → 4) services → 5)
    outcomes and experiences

As software commoditizes, value concentrates in the non-code parts:

* **Outcomes** (done-for-you results, not tooling)
* **Data advantage** (unique feedback loops, domain telemetry, labels)
* **Distribution** (being embedded in the system of record or the front door)
* **Trust, compliance and liability** (indemnities, auditability, safe defaults)
* **Operating excellence** (reliability, support, cost control, predictable
  change)
* **Ecosystems** (integrations, templates, partners, developer leverage)
* **Experience** (time-to-value, cognitive load, fit to workflow)

Agents accelerate this shift because they make “feature parity” arrive faster
and make “UI differentiation” matter less.

## What Slows This Down

This transition is real, but it won’t be smooth — and it won’t be uniform across
industries.

The hard problems aren’t “Can the model talk?” They’re:

### 1. Nondeterminism and Reproducibility

If an agent makes decisions, you need to answer:

* “Can we reproduce the action?”
* “What version of policy, model and tools did it use?”
* “What evidence supports the decision?”

That implies replay, versioning and evidence capture — not just logging.

### 2. Security: Adversarial Inputs and Tool Misuse

If agents can read and write across systems, your attack surface changes:

* prompt injection via tickets, docs or emails
* data exfiltration via tool calls
* privilege escalation via mis-scoped permissions

Agent systems need hardened boundaries and policy enforcement, not just
“smartness.”

### 3. Authorization Is Harder Than It Looks

“Permissions replace seats” is true — but implementing least privilege at
enterprise scale is painful:

* role explosion
* separation of duties
* exceptions
* temporary access
* approvals tied to policy and context

### 4. Regulated Workflows Still Require Humans

In many domains, humans must:

* approve high-risk actions
* validate identity and intent
* handle exceptions
* produce legally acceptable records

So UIs won’t disappear. They’ll become **more concentrated around high-stakes
gates**.

## Scope: Where This Thesis Applies — and Where It Doesn’t

This essay is most predictive for:

* high-volume operational workflows
* enterprise processes with clear systems of record
* work that is mostly coordination and state transition
* domains where “proof” is required

There are important categories where UI remains a primary product surface:

* creative tools (design, music, video)
* consumer social and entertainment
* exploratory analytics and sensemaking
* collaboration spaces where shared attention *is* the product
* edge cases and exception handling even inside enterprises

So the claim is not “UI dies.”

It’s:

> UI stops being the differentiator for a large class of workflow software,
> because the dominant operator becomes an agent.

## What This Means for SaaS Vendors

If your product’s moat is “people love clicking around in our workflow screens,”
you’re playing a game that is being re-scored.

The vendors that win will look more like **infrastructure**:

* boring, predictable, safe under automation
* API-first with strong contracts
* policy-aware and auditable by default
* operationally excellent under agent traffic
* priced and governed around access, throughput and risk

The UI still matters — but more as:

* an onboarding surface,
* an exception and approval surface,
* and marketing.

Not as the core engine of value capture.

## What This Means for Enterprises

When agents start operating across systems, the enterprise becomes a factory of
micro-transactions.

Humans do work in chunks. Agents do work in loops.

That creates the new bottleneck of **coordination and control**, not compute.

Enterprises will need new “boring layers”:

* agent traffic control (rate limits, budgets, quotas)
* idempotency and conflict handling
* policy-as-code guardrails
* traceability for every action
* standardized approval surfaces
* incident response for agent failure modes (runaway loops, silent corruption)

### Observability Becomes Governance

In a human-first world, observability is about uptime.

In an agent-first world, observability is about accountability:

* what inputs were used
* what tools were called
* what changed
* what approvals existed
* what policy allowed or blocked the action

The audit log stops being a compliance artifact and becomes the primary way
humans understand what the business is doing.

That is the new definition of trust.

## The Punchline

The point isn’t “software is dead.”

It’s this:

**Interfaces become more ephemeral.** **Durable truth becomes more valuable.**
**And the dominant consumer becomes an agent.**

If you’re building (or buying) software where the main value is “humans click
around to move state,” that advantage is shrinking.

If you’re building (or buying) software that is a trustworthy system of
record — clean contracts, strong governance, agent-grade APIs and real
auditability — you’re building the layers that survive every replatforming.

Because like every replatforming, this one rewards the layers that look boring…

…and breaks the layers that were optimized for the last world.
