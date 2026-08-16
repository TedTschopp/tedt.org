---
layout: post

title: "The Cost of a Finished Job"
subtitle: "Why Enterprise AI Economics Begin with the Accepted Outcome"
quote: "The useful unit is not the token. It is the finished job."
excerpt: "Cheaper models do not automatically produce cheaper work. Enterprise AI economics depend on the total cost of delivering an accepted outcome."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-08-16 09:00:00 -0700
update: 2026-08-16 09:00:00 -0700

author: { avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g", name: "Ted Tschopp", url: "https://tedt.org/" }

bullets:
- The useful economic unit for enterprise AI is the accepted outcome, not the token or model call.
- Model choice, context, tools, retries, human review, and failure risk must be measured as one workflow.
- Shared AI infrastructure should centralize identity, evidence, controls, and cost attribution while preserving local ownership.
- Employee AI programs create an application lifecycle that requires owners, evaluations, budgets, reviews, and retirement paths.
- AI operating layers should grow in response to demonstrated work and risk rather than platform ambition alone.

description: "Cheaper models do not automatically make enterprise AI workflows cheaper. This essay explains cost per accepted outcome, the shared operating layer around AI, and how businesses can govern employee-built workflows from experiment through retirement."
seo-description: "Why enterprise AI economics should measure cost per accepted outcome, including model usage, tools, human review, retries, support, and failure risk."

categories:
- AI
- Business
- Opinion
- Enterprise Architecture
- Leadership

tags:
- enterprise AI
- AI economics
- cost per accepted outcome
- AI operating system
- agentic AI
- AI governance
- workflow optimization
- platform engineering
- employee AI
- operating model
- FinOps

keywords:
- enterprise AI economics
- cost per accepted outcome
- AI workflow cost
- AI operating system
- enterprise AI platform
- employee-built AI agents
- AI cost optimization
- AI governance
- human review cost
- AI workflow lifecycle

location: { name: "Bradbury, CA", coordinates: { latitude: 34.1470, longitude: -117.9709 } }

image: "/img/2026-08/the-cost-of-a-finished-job-hero-source.webp"
image-alt: "A complex tabletop machine transforms a plain wooden cube into a finished orange cube delivered into a person's hand."
image-title: "The Cost of a Finished Job"
image-description: "A precision mechanical apparatus accepts a plain wooden cube, routes it through tracks, tools, gauges, and inspection stations, then delivers a finished orange cube into an outstretched hand, representing the full system required to produce an accepted outcome."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1731
image_height: 909

mathjax: false
mermaid: false
mastodon-post-id:
---

*Cheaper models do not settle the economics of enterprise AI. They move the hard work into the system around the model and the way the business itself is designed.*

Tokens are like gallons of gasoline. They are easy to count. They are easy to price. They are also poor at telling you whether you arrived.

[OpenAI recently cut the published price of GPT-5.6 Luna by 80%](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/). That is a substantial change, but it does not make every workflow 80% cheaper. A low-cost model can still produce expensive work if it needs repeated attempts, makes too many tool calls, waits on slow systems, gives people more material to review, or produces an error that has to be repaired later.

The useful unit is not the token. It is the finished job.

Even that needs one more word. A job is not finished merely because the machine stopped. It is finished when the result clears a defined acceptance threshold: the claim is ready for a qualified decision, the code passes its tests and review, the employee receives the correct policy answer, or the customer problem is actually resolved.

So the economic measure I would use is closer to this:

> **Total workflow cost = AI usage + data and tools + human review + retries and rework + support + expected failure cost**  
> **Cost per accepted outcome = total workflow cost ÷ accepted outcomes**

This is why I have argued that [every AI capability needs a cost identity](https://tedt.org/Make-AI-Boring/): an owner, a budget, and a unit the business understands, such as dollars per case, ticket, work order, approved document, or repaired defect.

Price per token still matters. It belongs inside the equation. It simply does not get to be the equation.

## The System of Systems Controls the Price

So how do you lower the cost of an accepted outcome?

You can use a smaller model. You can route easy steps to a cheaper model and save the strongest model for the hard decisions. You can cache repeated information. You can shorten prompts. You can improve retrieval. You can reduce retries. You can give the model better tools and clearer tests.

In other words, you work on the system around your systems and model.

I have described [the harness as the structure that turns a fluent model into a useful partner](https://tedt.org/Why-AI-Needs-a-Harness/). It carries context, connects tools, retains state, applies permissions, checks results, handles failure, and decides what happens next. A recent OpenAI experiment puts useful numbers behind that idea.

On the public set of the ARC-AGI-3 benchmark, [OpenAI reports that GPT-5.6 Sol scored 13.3% with the official harness and 38.3% after retained reasoning and context compaction were enabled](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/). OpenAI also reports that the changed configuration used six times fewer output tokens. The reported improvement came from two harness settings, not a newly trained model.

That result has limits. It is a vendor-run benchmark experiment, not evidence that every enterprise workflow will become three times better. Retaining more context can also raise privacy and data-retention questions. But the mechanism is important: a model that forgets what it has learned has to solve the same problem again. A model given continuity can spend less effort rediscovering its own path.

Microsoft Research is testing the same broader principle from two other directions. [Orchard trains agents inside the deployment harnesses where they will actually work](https://www.microsoft.com/en-us/research/blog/orchard-an-open-framework-for-scalable-agentic-ai/). Microsoft reports that an Orchard software-engineering model with about three billion active parameters reached 69.7% on SWE-bench Verified. [Echoverse builds deep, stateful training environments](https://www.microsoft.com/en-us/research/blog/echoverse-deep-evolving-environments-for-computer-use-agents/) where an action changes underlying data and the result can be graded against that data. Its researchers report raising a nine-billion-parameter model's average score from 36.5% to 67.1% across their environments.

Those are research results, not production economics from a claims department or call center. Still, they reveal where optimization is moving. Model choice matters, but the surrounding system shapes what the model can accomplish and how much the result costs.

This is the larger [AI value stream](https://tedt.org/AI-Value-Stream/): everything between employee intent and physical infrastructure contributes to whether intelligence becomes useful work.

The performance of AI is not a property of the model alone. Neither is its cost.

Make now mistake that cost per accepted outcome is the business model for AI vendors in the future.  Waht this means is that once cost per accepted outcome becomes the measure, routing, context, authority, evidence, and learning can no longer be optimized as separate concerns. That metric forces them to be managed as one operating layer.

## From One Workflow to Fifteen Hundred

Tuning one workflow is difficult. Letting thousands of employees create workflows is a different class of problem.

In its customer account of the Dutch cooperative insurer Univé, [OpenAI reports 97% license activation, 85% weekly use, and roughly 1,500 custom agents created by employees](https://openai.com/index/unive/). It also describes a pet-insurance workflow in which claim preparation moved from hours to minutes while a trained claims professional retained the final decision.

Those numbers demonstrate adoption. They do not tell us whether every GPT solves a distinct problem or still deserves a place in the portfolio. Fifteen hundred custom agents can represent a remarkable reservoir of employee knowledge. They can also become 1,500 small applications looking for owners who can maintain them, evaluate them, and retire them when they no longer earn their place.

Stripe describes encountering the same tension at another scale. Its teams had created [more than 4,000 small agents before the company moved toward a shared Knowledge AI Platform](https://stripe.dev/blog/meet-stripes-knowledge-ai-platform). Stripe says the common platform now supports more than 1,000 tools and skills and reached 83% weekly workforce use. The important design choice was not to build one giant agent. It was to centralize the common machinery while allowing domain teams to retain responsibility for their own expertise.

Cloudflare has followed a related path for internal engineering. The company says its [shared AI engineering stack served 3,683 internal users and recorded 47.95 million AI messages during one 30-day period](https://blog.cloudflare.com/internal-ai-engineering-stack/). One central proxy provides authentication, model discovery, permission enforcement, and per-user cost attribution. Employees can use different models and local configurations without placing provider keys on their laptops or rebuilding the control plane for every team.

These are first-party company reports, not independent return-on-investment studies. They are useful because they show the same architectural pressure appearing in different organizations. Once employees can build with AI, a company must support local invention without asking every employee to become an identity engineer, security architect, evaluation specialist, and platform operator.

As I argued in [Beyond the Light Bulb](https://tedt.org/Beyond-the-Light-Bulb/), issuing more licenses may improve local productivity without changing the end-to-end value stream. A report drafted in five minutes can still wait four days for approval. An agent can prepare twice as many cases and merely bury the reviewer. Faster output does not become business value until the surrounding work changes with it.

## What I Mean by an AI Operating System

This is where the operating-system comparison becomes useful.

A conventional operating system does not write your document, approve your expense report, or calculate your budget. It manages the shared machinery that applications depend on.

An enterprise AI operating system would perform a similar coordinating role for intelligence:

| Conventional Operating System Components | Enterprise AI Operating Layer Components                          |
|-----------------------------------------:|:------------------------------------------------------------------|
|                 Processes and scheduling | Jobs, agent runs, model selection, and tool routing               |
|                         Memory and files | Working context, durable state, records, and retention            |
|                    Users and permissions | Employee identity, agent identity, approvals, and least privilege |
|                      Devices and drivers | Governed connectors to business data and applications             |
|                          Health and logs | Evaluations, traces, evidence, incidents, and recovery            |
|                          Resource quotas | Budgets, rate limits, latency targets, and capacity               |
|                Installation and upgrades | Inventory, ownership, versions, reviews, and retirement           |
{: .well .table .table-striped}

I do not mean that every company should buy a product labeled “AI OS,” or spend three years building one enormous platform. Most enterprises will accidentially assemble this from systems they already have: identity and access management, data platforms, API gateways, workflow engines, model services, observability, security controls, and software-delivery practices.

Is this simply platform engineering, data governance, identity, and observability wearing a new name?

Much of the machinery is familiar. What has changed is the thing being coordinated. These systems now surround probabilistic workers that can choose tools, generate intermediate plans, act across applications, and produce different results from the same request. The components are not all new. The need to coordinate them continuously around machine-performed work is.

For IT, this means becoming [the central engineering function for a shared production system](https://tedt.org/What-IT-Looks-Like-in-an-Enterprise-Where-AI-Is-Assumed/), not the sole builder of every employee solution. IT provides the roads: approved models, secure connectors, identity, sandboxes, evaluation services, logging, and production gates. Business teams choose the destinations. They define the job, the value, the exceptions, and the standard for acceptable work.

The [NIST AI Risk Management Framework organizes this work around four continuing functions: Govern, Map, Measure, and Manage](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/). That is a helpful reminder that an operating layer is not merely a runtime. It must also carry responsibility, measurement, monitoring, and an exit path.

## What This Means for Businesses Giving AI to Employees

The first implication is that an employee AI program is not a license program.

Licenses provide access. Training can provide competence. Neither one, by itself, changes a business process. The business has to decide which work should change, who owns the outcome, what quality means, and where the recovered time or capacity will go.

Imagine an employee who spends two hours assembling a weekly report. AI reduces the drafting to twenty minutes. That sounds like a large gain. But what happens next?

Does the report still wait for the same approval? Does the employee use the recovered time to investigate exceptions, speak with customers, or improve the source data? Does the organization simply produce six times as many reports that nobody reads? Time saved is potential energy. Management still has to decide where it moves.

The second implication is that adoption and value need different scorecards. A useful evidence ladder looks something like this:

1. People have access.
2. People use it.
3. A workflow changes.
4. Cycle time, quality, or service improves.
5. The total cost per accepted outcome improves.
6. The business converts that improvement into safer and reliabile operations, principled decisions, higher standards, continuous improvement, stronger teamwork, revenue, or customer value.

Each step matters. They are not interchangeable. Prompt counts and weekly active users tell you whether the system is being used. They do not tell you whether the business is better off in the executive suite.

The third implication is that the foundation should be shared while improvement remains local. Fully centralized AI programs turn into queues because the central team cannot understand every job. Fully decentralized programs produce duplicate agents, inconsistent permissions, uneven quality, and abandoned tools. The better pattern is federated: common roads, local destinations, and an explicit exception path.

The fourth implication is that employees need more than permission to experiment. They need time, examples, trusted data, clear boundaries, and managers willing to redesign the work. None of this is merely a platform change. [AI is a people change](https://tedt.org/AI-Is-a-People-Change/) touching roles, incentives, professional identity, training, trust, and the way expertise is passed from one generation of employees to the next.

This is also where telemetry can cross a line. The operating layer can reveal which employees use AI, which sources they touch, how long tasks take, and where they struggle. That information can improve the system and control risk. Used carelessly, it can become an unusually intimate system of worker surveillance. Businesses should tell employees what is recorded, why it is recorded, who can see it, and how long it is retained.

The fifth implication is that “human in the loop” is not enough. A person cannot meaningfully own a decision if the review queue is impossible, the evidence is hidden, or rejecting the machine's recommendation requires more time than accepting it. Human accountability needs enough context, time, expertise, authority, and a real ability to stop or reverse the action.

Finally, employee-built AI creates a lifecycle problem. Every production workflow needs a business owner, a technical owner, a risk classification, a version history, a budget, an evaluation set, a review date, and a retirement path. Otherwise, cheaper creation produces an expanding estate of invisible software.

## Advice for the People Building This Now

If you are working on employee AI, I would use the following promotion path.

### 1. Start with a job, not a model

Find a repeatable piece of work with a visible owner, inputs, handoffs, exceptions, and an outcome. Ask [what job needs doing](https://tedt.org/Before-You-Reach-for-AI-Ask-What-Job-Needs-Doing/) before deciding whether the answer is a chatbot, an agent, a search tool, or ordinary automation.

“Give everyone an AI assistant” is a distribution plan. It is not a use case.

### 2. Establish the Baseline

Measure the work before changing it: elapsed time, employee effort, error rate, rework, wait time, exception volume, service level, and current cost. If you do not know the starting point, almost any demonstration can be made to look like progress.

### 3. Define What Accepted Means

Capture the job as [a reusable specification](https://tedt.org/How-to-Communicate-in-a-World-of-AI/): its purpose, authoritative inputs, boundaries, desired outcome, and the evidence that will count as complete.

Build a small evaluation set from real work. Include ordinary cases, difficult edge cases, and cases that should be refused or escalated. OpenAI is retiring its Evals platform later in 2026, but its published [guidance on task-specific tests, logging, human calibration, and continuous evaluation](https://developers.openai.com/api/docs/guides/evaluation-best-practices) remains useful.

### 4. Separate Assistance from Authority

Let the first version retrieve, organize, summarize, recommend, or draft. Give it permission to change records, send messages, approve transactions, or trigger physical work only after the evidence justifies the additional authority.

The practical question is [how much work the AI can safely own](https://tedt.org/How-Much-Work-Can-Your-AI-Safely-Own/), one value stream, work class, and risk tier at a time.

### 5. Optimize the Workflow, not Merely the Prompt

Choose the least expensive model that clears the quality threshold for each step. Improve retrieval. Remove unnecessary context. Cache stable material. Reduce tool calls. Tighten retry rules. Make human handoffs easier. Sometimes a more capable model will cost less overall because it needs fewer retries and less review.

The cheapest successful run is not always the correct target. Reliability, privacy, security, legal obligations, and human accountability are constraints, not items to trade away for a lower bill.

### 6. Make the Evidence Visible

Record the sources used, tools called, actions taken, checks passed, exceptions raised, and human decisions made. A person reviewing the work should be able to understand what happened without reconstructing the agent's entire hidden journey.

Track human-review minutes along with model cost. If a cheaper configuration saves ten dollars of inference and adds an hour of expert review, the workflow did not get cheaper.

### 7. Promote Carefully

Run consequential workflows in shadow mode before giving them authority. Compare the proposed result with real decisions. Move from experiment to shared service only after the workflow meets agreed thresholds for quality, cost, latency, security, and human review.

Then keep evaluating it. Models change. Prices change. Source data changes. Business rules change. A production agent is not a finished project. It is an operating responsibility.

### 8. Retire What no Longer Earns its Place

Cheaper AI will create more AI. That is a rebound effect, not a paradox. When the price of an individual run falls, companies will attempt more workflows and run them more often. Total spending, data exposure, and operational risk can rise even while each call gets cheaper.

Review the portfolio. Merge duplicate agents. Revoke unused permissions. Update evaluation sets. Replace poor configurations. Retire workflows whose owners have left or whose value never arrived.

## Build Only as Much Operating System as you Need

A small company does not need to recreate the platform of Stripe or Cloudflare. It may need an approved managed workspace, clean data boundaries, a handful of task evaluations, and a named owner.

A business unit with several production workflows may need shared connectors, reusable skills, an inventory, common logs, and a review process.

A large enterprise with agents acting across many systems will need policy-based routing, distinct agent identities, centralized evidence, incident handling, lifecycle controls, and portfolio economics.

The operating layer should grow in response to real work and real risk. Building a cathedral before the first useful workflow is another way to avoid arriving.

## The Road Between the Request and the Result

Cheaper intelligence moves the bottleneck. The difficult question becomes less about whether the company can afford a model and more about whether it can manage the system around that model.

Who defines the job? Who grants the context? Who chooses the tools? Who decides what may be changed? Who checks the result? Who pays for the run, supports the workflow, investigates the failure, and retires the agent when it is no longer useful?

These are operating-system questions.

The businesses that do this well will not merely have more AI. They will know which completed jobs became cheaper, faster, or better, and they will be able to explain why.

Tokens may tell us how much fuel we purchased. The finished job tells us whether the trip mattered and if those who took it were meaningfully and positiviely changed. The AI operating system is the machinery that helps the whole company arrive.
