---

layout: post

title: "The Pancake Protocol: an Agentic Kitchen"
subtitle: "How the Industry Uses “Standard Work” to Define AI Agents, MCP Servers, skills & Specs"
quote: "These standards don’t make models “smarter.” They make the environment clearer, safer, and more repeatable."
excerpt: "A kitchen metaphor for the standards behind agentic AI systems. MCP provides the plumbing for tools and context, while agents and skills make work repeatable with guardrails."
source: "Original Content"
source-url: ""
call-to-action: ""

date: 2026-01-12 07:21:20 -0800
update: 2026-01-12 07:21:20 -0800

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
- Uses a pancake-making kitchen metaphor to explain “standard work” for agentic AI systems.
- Frames MCP as an open protocol that standardizes how AI apps connect to tools and context.
- Breaks down MCP servers into tools (actions), resources (read-only context), and prompts (reusable routines).
- Highlights guardrails like authorization, consent, and scope as prerequisites for trust and safety.
- Distinguishes agents, sub-agents, and skills as the execution structure that makes work composable and repeatable.

description: "Using a pancake-making kitchen as a metaphor, this essay breaks down the emerging standards behind agentic AI systems. It explains the Model Context Protocol (MCP) as the wiring that connects hosts to tools, resources, and prompts, and argues for guardrails like consent and scope. It then contrasts MCP with agents, sub-agents, and reusable skills—the routines that turn capability into reliable work."

seo-description: "Kitchen metaphors explain how MCP, agents, sub-agents, and reusable skills create clear, safe, repeatable tool use in modern agentic AI systems."

categories:
- AI
- Computers
- Communications
- Opinion

tags:
- agentic-systems
- ai-agents
- mcp
- model-context-protocol
- tool-use
- context
- standard-work
- lean-six-sigma
- guardrails
- authorization
- consent
- prompts
- skills
- composability

keywords:
- "Model Context Protocol"
- "MCP"
- "MCP servers"
- "AI agents"
- "agentic systems"
- "tool calling"
- "standard work"
- "Lean Six Sigma"
- "authorization and consent"
- "agent skills"

location:
name: Bradbury, CA
coordinates:
latitude: 34.1470
longitude: -117.9709

image:  /img/AI/The-Kitchen-Protocol.webp
image-alt: "Three children wearing aprons carefully shape pancakes together on baking trays in a warm, sunlit kitchen."
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org/
image-description: "In a quiet kitchen filled with morning light, three kids work side by side, forming pancakes with focused joy. Each has a role, each follows the same simple steps, and together they turn a messy task into a smooth, shared rhythm—an everyday example of how clarity and standard work create flow, even before breakfast."
image-title: "The Pancake Protocol"
image_width: 1456
image_height: 816

mastodon-post-id:

---

Last week I wrote about making pancakes with my kids in the kitchen—how we got breakfast made, and how we now have a routine where we can crank out a *lot* of pancakes in a short amount of time without the whole thing turning into a flour-dusted episode of “Kitchen Nightmares.”

The secret wasn’t better batter. It was **Standard Work**—that steady, almost boring wisdom from **Lean Six Sigma** that says: *clarity creates capacity.*

We didn’t need to “try harder.” We **set the work up** so we could get into a state of flow.

This week, we’re going back into that kitchen—this time to talk about AI agents and the standards forming around them. These standards don’t make models “smarter.” They make the environment clearer, safer, and more repeatable—so agents can actually get useful work done.

So let’s go back into that kitchen.

Because once you see it there, you start seeing it everywhere.

## Model Context Protocol (MCP)

The **Model Context Protocol (MCP)** is an open standard for connecting AI applications to **tools and context** (data, systems, and interactive experiences) in a consistent way.

One important distinction up front: **MCP doesn’t make an agent “think.”** It doesn’t dictate planning, reasoning, or how you orchestrate multiple models. It standardizes how an AI app *reaches* the world—how it discovers capabilities and exchanges context—so you can build reliable systems without re-inventing connectors every time.

The best way to understand MCP is to think of it as the **plumbing and wiring** of a kitchen. It’s the infrastructure that lets you connect appliances, tools, and ingredients in a way that makes cooking possible.

If you’ve ever tried to cook in a kitchen where every drawer is mislabeled, every appliance has a different plug, and half the ingredients are “somewhere,” you already understand why this matters.

Here’s the “wiring diagram” version:

> **Host (AI app)** → **MCP client** → **MCP server** → **tools / resources / prompts** → **external systems**

MCP turns “a pile of one-off integrations” into something closer to standard outlets and labeled drawers: predictable, repeatable, and safe to build on.

### MCP Servers

MCP servers are the stations around the counter: the places where work becomes possible and controlled. In MCP terms, servers typically expose three kinds of things:

#### Tools — *the utensils and appliances*

These are concrete actions the system can take: run a report, create a ticket, modify a file, trigger a workflow.

The point isn’t “give the AI power.” The point is **controlled capability**—actions that are available in a standard shape, with clear inputs/outputs, so the host can safely call them without duct tape and guesswork.

#### Resources — *the pantry and reference binder*

These are read-only materials: files, schemas, documentation, knowledge bases—things you don’t “cook with” directly, but constantly consult.

In kitchen terms: substitutions, allergy notes, the recipe binder, the “how we do it here” guide.

#### Prompts — *the laminated cards taped to the cabinet*

These are standardized ways to run common tasks: pre-shaped instructions, consistent phrasing, reusable routines.

Not because people are dumb—because **consistency saves time** and reduces errors.

### Guardrails: Authorization, Consent, and Scope

In a well-run kitchen, the rules aren’t there to kill joy. They’re there to prevent disasters.

This is the “kids don’t touch the stove” rule:

* Not every capability should be available in every context
* Not every agent should be able to do every action
* Humans should be able to see *what is happening* and *why*

Guardrails keep trust intact. They also keep your system from turning into the **Master Control Program** from *TRON*—powerful, opaque, and confidently wrong.

### Interaction Patterns

*Menus and labels, not the dining room.*

Even in a home kitchen, you rely on small conventions: measuring cups are marked, salt and sugar aren’t stored in identical containers, and the stove knobs are labeled.

In agentic systems, you need the same kind of clarity so humans can understand what the agent can do—and what it’s asking for.

Common interaction patterns include:

* **Icons & metadata** — Visual cues and descriptions that help interfaces present tools clearly
* **Elicitation (form + URL modes)** — Structured ways for the system to ask a user for input, confirm a choice, or request additional details
* **Host UI integration** — How an application renders these capabilities so humans can understand what’s happening and why (maps, calendars, dashboards, previews)

These experiences are the “menus” users interact with: not the whole restaurant, but the part that makes ordering—and consent—clear.

### Composability: The “Pancake Mix” Effect

This is where things get fun—and where discipline matters.

Once you have a standard connection, you can start plugging in new capabilities without rebuilding your whole kitchen. You add a new tool station, a new pantry shelf, a new recipe card, and the workflow still makes sense.

It’s like pancake mix: not magic—just a pre-measured kit that lets you ship consistent results faster.

The risk is the same, too: you still want to know what’s in the box, who made it, and whether it’s safe to serve.

## Agents

Now we get to the actual cooks.

If MCP is the wiring and plumbing, **agents are the chefs**: they decide what matters, what to do next, what to delegate, and when to stop.

They decide:

* What matters right now
* What to do next
* What to delegate
* When to stop

Often they’re defined by a simple, explicit specification file that includes:

* What the agent is responsible for
* What it must never do
* The tone it should use
* The boundaries it must honor

In kitchen terms: the chef’s job description and the house rules on the wall.

## Sub-Agents

An industrial kitchen isn’t one chef. It’s a team.

Sub-agents are like **sous-chefs** you spin up for focused work—each assigned to a station with clear responsibilities:

* Narrow scope
* Parallel execution
* No independent authority beyond the parent agent

This is how you stop one “chef” from becoming the bottleneck.

And it’s also how you avoid the opposite problem: a kitchen full of people doing things “kind of” in the same direction while stepping on each other’s toes.

## Skills

A kitchen also runs on shared technique: the methods everyone can rely on.

In agentic systems, **skills** are reusable behaviors: not the “why,” but the “how.”

A skill is the equivalent of:

* How to dice an onion fast
* How to check doneness
* How to plate consistently
* How to clean as you go

In agentic systems, skills look like repeatable routines:

* “Write an executive summary of this PRD”
* “Compare these two documents and explain what changed”
* “Summarize these logs and highlight anomalies”
* “Draft an incident update for leadership”

If you’ve ever done Standard Work well, this will sound familiar: **stabilize the method so improvement is possible.** When everyone does things differently, it’s hard to know what’s working and what isn’t.

One helpful distinction in this metaphor:

* **Prompts** are the recipe cards
* **Skills** are the knife skills and kitchen routines that let you execute recipes consistently

## Technical Specifications and Constraints

In a kitchen, a recipe card doesn’t just say “make pancakes.” It defines success: ingredients, steps, timing, and what “done” means.

In agentic systems, the **technical specification and constraints** serve the same role:

* Desired output format (Word document, PDF, PowerPoint, etc.)
* Policy boundaries (what must never be done)
* Data boundaries (what sources are allowed)
* Time/cost limits
* Quality checks (what “good” looks like)

Same kitchen. Same basic goal. Different definition of success.

To stay in the pancake analogy:

One customer wants pancakes that are **gluten-free**, **nut-free**, and **cooked thoroughly**.

Another wants the same pancakes, but **vegan** and **fluffy**.

You can serve both… but only if the constraints are explicit.

## Closing: Back to the Griddle

This weekend I got up late and found the kids had already started making pancakes for themselves.

They asked me if I wanted pancakes, if I wanted chocolate chips, what color I wanted them, how many I wanted, and what syrup I wanted. I told them I wanted a pancake sandwich—and yogurt on the side.

My daughter decided I was getting chocolate chips with red food coloring, and that I could choose vanilla or raspberry yogurt.

From the bedroom I heard the kitchen full of laughter and the sound of the griddle sizzling. A few minutes later they came in with my order. I got breakfast—and they had a lot of fun making it.

And that’s what I want when I think about these leading-edge agentic systems. Not magic. Not hype. Just a kitchen that’s set up well—so the people in it can cook with joy, move with confidence, and end up with something nourishing on the table.