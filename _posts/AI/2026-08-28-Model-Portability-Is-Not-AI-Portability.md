---
layout: post

title: "Model Portability Is Not AI Portability"
subtitle: "Large enterprises are learning how to switch models. Moving a working business process without losing quality, controls, or money is a different problem."
seo_title: "Model Portability Is Not AI Portability"
quote: "The model may pull the train. The enterprise system determines whether the cargo arrives."
excerpt: "Large enterprises are learning how to switch models. Moving a working business process without losing quality, controls, or money is a different problem."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-08-28 09:00:00 -0700
update: 2026-08-28 09:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - "Model portability means that an application can call another model. AI portability means that another model can complete the same business task without unacceptable losses in quality, permissions, observability, recovery, regulatory control, or cost."
  - "The enterprise must retain control over meaning, authority, and proof."
  - "Portability should be tested, not declared or assumed."
  - "Portability is not a moral virtue. It is an option that will cost you."
  - "The practical test of AI portability is whether the same business task can be completed with another model without unacceptable losses."

description: "Large enterprises are learning how to switch models. Moving a working business process without losing quality, controls, or money is a different problem."
seo-description: "Why model choice and multi-model gateways do not make enterprise AI portable, and how to test business workflows across providers."

categories:
  - AI
  - Business
  - Opinion
  - Enterprise Architecture
  - Leadership

tags:
  - enterprise AI
  - AI portability
  - model portability
  - multi-model gateways
  - AI agent harness
  - AI governance
  - vendor lock-in
  - workflow portability
  - AI operating model
  - model migration
  - platform engineering
  - technology contracts

keywords:
  - AI portability
  - model portability
  - enterprise AI portability
  - multi-model gateway
  - AI provider switching
  - AI agent harness
  - AI vendor lock-in
  - AI workflow migration
  - enterprise AI governance
  - cost per accepted outcome

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-08/The-System-Behind-the-Engine.webp"
image-alt: "A father and child operate a model railway beside a full-size steam locomotive, with digital system overlays connecting tracks and signals."
image-title: "The System Behind the Engine"
image-description: "A father and child stand at the controls of a model railway while a full-size steam locomotive passes at sunset, surrounded by digital overlays for data integration, interoperability, portability, and adaptive infrastructure."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1672
image_height: 941

mathjax: false
mermaid: false
mastodon-post-id:
---

# Model Portability Is Not AI Portability

*Large enterprises are learning how to switch models. Moving a working business process without losing quality, controls, or money is a different problem.*

When I was a child, I loved trains. I still do. To me, they are the Industrial Revolution made visible: steel, power, motion, and human coordination assembled into machines capable of carrying people and freight across great distances. A train is not merely a machine. It is an entire system moving through the world.  They made the world a smaller and more connected place.  

My dad would take me to the model train exhibits at the LA County Fair and to the train store in Pasadena on Route 66. Fairplex offered both ends of the experience. It had a collection of full-sized trains outside and an entire section devoted to model railroads.

For my parents, this was a wonderfully efficient arrangement. They could settle into the shade while I remained occupied for most of the day. They watched me watch the model trains travel round and round their carefully built layouts. I could also go and climb over those enormous beasts of steel and by the end of the day, I was exhausted, happy, and if I had been paying attention, I would have learned something about how the system worked.

You see as I moved back and forth between two versions of the same world. On one side of Fairplex, I could stand over an entire railway and watch the system operate in miniature. But over on the other side, I was the miniature, climbing through locomotives built on a scale that made a child look very small.

The difference was scale. The resemblance was the system.

The locomotives were what drew the eye, whether they were small enough to hold or large enough to climb through. But even a model train cannot make a journey by itself.

The locomotive needs track of the right gauge. It needs compatible power and controls. Its couplers must fit the cars. Switches must send it down the intended line. Signals must keep it from colliding with something already there. Behind the entire layout is someone who built it, maintains it, and knows what to do when a train stops where it should not.

You can place two locomotives beside the same track and say that you have a choice of engines. That does not mean you can move the same set of rail cars to another railway and expect the journey to work unchanged.

The engine may be replaceable. The journey still depends on the system around it that makes up the locomotive, the switches, the signals, and the layout of the tracks.

Those model railways offer a useful parable for Enterprise AI. Companies are adding second and third models, putting gateways in front of them, and declaring themselves vendor independent.

What they have usually gained is model choice.

Whether they have gained AI portability is a much harder question.

## The Model Is the Visible Part

A multi-model gateway can route requests to models from OpenAI, Anthropic, Google, or an open-weight provider. It can centralize authentication, monitor usage, apply cost controls, ensure DLP policies are adhered to and redirect traffic when one provider is unavailable.

That is useful. In many enterprises, it is also necessary.

But it is not the same as moving a business workflow.  Model portability means that an application can call another model.  AI portability means that another model can complete the same business task without unacceptable losses in quality, permissions, observability, recovery, regulatory control, or cost.  The first is an interface problem.  The second is a systems problem.

[Zalando](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html)offers a useful example. Its engineering platform gives more than 250 teams access to models through a LiteLLM-based proxy connected to OpenAI, Amazon Bedrock, and Google Vertex. Their proxy centralizes adoption measurements, cost tracking, caching, client configuration, and model retirement.

But that proxy is only part of the story.

Around it, Zalando has developed authentication injection, Model Context Protocol access, shared agent skills, configuration management, and other supporting services. The company is also working on an identity broker, token vault, agent sandboxing, and model routing.

Even then, it reports that users become attached to particular coding tools and model styles. They rarely switch models unless a limit or error forces the issue. This is not a criticism of Zalando. It is evidence of how the work really evolves.

The gateway solved a lot of problems.  It centralized and simplified access.  Adoption created a platform. The platform created new operating responsibilities.  Human habits created a dependency.

And dependencies that can not disappear, create risk.

## The Harness Is Part of the Product

I have argued before that an AI harness gives a model tools, memory, permissions, verification, and recovery. It turns a model that can discuss work into a system that can participate in the work. [Why AI Needs a Harness](https://tedt.org/Why-AI-Needs-a-Harness/)

What is now clear is that the harness determines how replaceable the model really is.

NVIDIA recently reported that its Agentic Variation Operators system completed all 183 levels in the public ARC-AGI-3 set. The system paired a frontier model with persistent memory, tools, supervision, feedback, and recovery mechanisms.

The important point was not simply the benchmark score. NVIDIA argued that long-running performance belonged to the complete agent system, not to the model alone. [NVIDIA’s AVO report](https://developer.nvidia.com/blog/nvidia-avo-reaches-100-on-arc-agi-3-demonstrating-a-frontier-level-general-purpose-architecture-for-long-horizon-autonomous-agents/)

That result requires repeatability.  This was vendor-reported, and only applies to the public benchmark set.  It was not a controlled measurement of the harness’s individual contribution. NVIDIA acknowledges those limitations.

Still, the architectural lesson is useful and a warning for enterprises.

If memory, tools, instructions, evaluation, and recovery materially affect the result, replacing the model while changing nothing else may be impossible. A prompt tuned for one model may fail with another. A tool-calling pattern may behave differently. A safety filter may block a previously accepted workflow. A replacement model may produce the correct answer while losing the evidence required to trust it.

Performance and portability belong to the whole system and so does risk.

## What Must the Enterprise Own?

Does this mean the enterprise must build and own the entire AI stack?

No.

An enterprise does not need to own every model, user interface, orchestration framework, or piece of infrastructure. It does need to control the assets that define successful work.

The first is the workflow contract. This describes what the task is, which inputs it requires, what the agent may do, what it may not do, what the output should contain, and how the organization knows the work is complete.

The second is the evaluation set. This includes representative cases, known edge conditions, failure examples, adversarial tests, acceptance thresholds, and situations requiring human review. If a vendor owns the only credible test of the system, the enterprise cannot independently determine whether a replacement works.

The third is identity and authorization. An agent acting for an employee, customer, or business process must carry the correct permissions and delegation history. Those controls cannot quietly disappear when the model changes.

The fourth is operational evidence. The enterprise needs usable traces showing what information the system accessed, which tools it called, what actions it attempted, what failed, and how it produced the final result.

Finally, the enterprise must own the recovery process. The business must decide when the system stops, when a person intervenes, what gets rolled back, what gets retried, and what evidence is retained.

These assets form the trusted action surface around AI. That is where much of the durable enterprise value now lives. [The AI Value Stream](https://tedt.org/AI-Value-Stream/)

The model supplies capability.

The enterprise must retain control over meaning, authority, and proof.

## How Do You Measure a Switch?

Portability should be tested, not declared or assumed. If the workflow is critical to the company the enterprise should have metrics around how much it costs to move.

Choose one bounded production workflow. Establish a baseline using the current model and platform. Measure whether the system completes the task correctly, how often a person must intervene, how long the work takes, what it costs, and what happens when something goes wrong.

Then move that workflow to another model or provider.

Do not stop when the new endpoint returns a response. Record the complete portability delta:

- **Migration time:** How long did the change take, including security review, integration, testing, deployment, and employee preparation?

- **Engineering effort:** How many instructions, skills, tool definitions, integrations, and recovery routines had to be rewritten?

- **Quality change:** Did completion rates, factual errors, policy violations, or human corrections improve or decline?

- **Control loss:** Were permissions, regional restrictions, logs, citations, retention rules, and rollback capabilities preserved?

- **Economic change:** Did the cost of a completed and accepted result improve, or did a lower model price create more retries and human review?

- **Behavioral change:** Could employees use the replacement effectively, or had the existing tool become part of how they understood the work?

The organization should not compress these measures into a single portability score. It needs enough evidence to see where the dependency actually resides.

It may reside in the model. It may reside in a proprietary tool interface, a vendor-specific memory system, a skill library, an evaluation service, or the accumulated habits of the workforce.

The economic measure is especially important. Token prices are easy to compare because vendors publish them. The meaningful unit is the cost of a finished job. [The Cost of a Finished Job](https://tedt.org/The-Cost-of-a-Finished-Job/)

A cheaper engine does not lower the cost of the journey if every car must be rebuilt before it can move.

## When Is an Internal Harness Worth Building?

An internal harness makes sense when the workflow differentiates the business, crosses several enterprise systems, handles sensitive or regulated information, or operates at enough scale to justify a shared platform.

It may also be necessary when the enterprise needs to move between providers or regions for resilience, sovereignty, negotiating leverage, or legal compliance.

But an internal harness is not automatically the mature answer.

For standardized work, an integrated vendor platform may be the better decision. [Salesforce and Anthropic](https://www.salesforce.com/news/press-releases/2026/08/26/salesforce-and-anthropic-announce-claudeforce/), for example, are combining Claude with Salesforce data, permissions, business rules, workflows, and prebuilt skills. Salesforce says authentication and permissions can be managed centrally while actions continue to pass through Salesforce controls.

Some of those capabilities remain in pilot or planned availability, and the claims come from the vendors themselves. Still, the attraction is easy to understand especially if you are already invested heavily into Salesforce and believe that the vendor’s controls meet your business needs.

If the business process already lives inside one platform, the integrated option may reduce implementation time, preserve an established security boundary, and provide a more coherent user experience.  

The decision therefore depends on the value of the option.

Build or configure with the vendor's platform or retain an enterprise-controlled harness so that when you switch suppliers, you can preserve specialized workflows, or control critical business actions has material value.

Choose the integrated platform when the workflow is standard, the provider’s controls meet the business need, and the organization would gain little from operating another internal platform.

Portability is not a moral virtue. It is an option that will cost you.

The enterprise should purchase that option when the likely cost of disruption, regulatory change, supplier failure, or strategic dependence exceeds the cost of maintaining the vendor / model lock-in.

## What Belongs in the Contract?

If a model or platform is supposed to be replaceable, the commercial agreement should preserve the evidence and assets needed to replace it.

That includes:

- Access to prompts, skills, workflow configurations, and evaluation results
- Export of logs, traces, business state, and system-generated records
- Ownership and permitted reuse of derived artifacts
- Notice before model retirement or material behavioral changes
- Access to fixed model versions when reproducibility matters
- Clear rules for data retention, model training, subprocessors, and regional processing
- Tool-call and application programming interface compatibility commitments
- The right to test alternative models against enterprise evaluation sets
- Transition assistance when the contract ends
- Rollback procedures when an upgrade changes workflow behavior

A contract cannot make two models behave identically.

It can prevent the enterprise from discovering, too late, that the information needed to perform a migration belongs to the supplier.

It should be noted that if a vendor refuses to provide these rights, the enterprise may have to accept that the model is not replaceable and that the business process is now dependent on a single supplier.  This actually might be that vendor's strategy, and it is not necessarily a bad one for either party.  It is just a business decision that you need to make for your enterprise and completely understand before it invests in a lock-in.

## When Does the Harness Become the New Risk?

There is one more complication.

An enterprise may reduce its dependence on a model provider and create a new dependency on its own internal platform.

The warning signs are familiar:

- One person or small team understands the gateway.
- No product owner is accountable for the platform.
- Evaluations are stale or maintained separately by each business unit.
- Model retirements trigger emergency migrations.
- Costs can be traced to requests but not to accepted business outcomes.
- Permissions and agent identities work differently across tools.
- Teams copy prompts and skills because the shared service is unreliable.
- No one has completed a provider-switching exercise.

At that point, the harness is no longer strategic leverage. It is an underfunded internal product sitting in the path of critical work.  Many times this problem is multiplied by the fact that the enterprise will have different harnesses from different internal teams, and each of those harnesses will have different levels of maturity, different levels of documentation, and different levels of support.  The result is a patchwork of internal platforms that are not portable, not reliable, and not well understood.

Adding another abstraction layer on top of this will not fix your problem.

Each harness needs a roadmap, service objectives, security engineering, evaluation management, incident procedures, dedicated funding, and a clear boundary between platform responsibilities and business-workflow responsibilities.

Enterprises already know how to operate identity platforms, integration platforms, data platforms, and developer platforms. An AI harness belongs to the same family.

This means that these harnesses must be governed with similar seriousness at the enterprise architecture, operational, and business levels.

## Moving the Cargo

The practical test of AI portability is not whether another model appears in the company’s catalog.  It's also not whether the model can be called through a gateway.  It is whether the same business task can be completed with another model without unacceptable losses in quality, permissions, observability, recovery, regulatory control, or cost.

Again to validate this, choose one important workflow and move it.

Use another model, another provider, or another region. Measure what had to be rebuilt. Measure how quality changed. Determine which controls survived, how people adapted, and what it cost to deliver an accepted result.

My dad took a boy who loved trains to see model railways at the LA County Fair and at a train store in Pasadena. Years later, those layouts offer another lesson.

The locomotive was the part that drew attention.

The track, switches, signals, power, controls, and maintenance were what made the journey possible.

An enterprise that counts models is still looking at the locomotives.

An enterprise that tests whether the same business task can travel safely across multiple providers is actually planning on running a railway responsibly.

The model may pull the train.

The enterprise system determines whether the cargo arrives.
