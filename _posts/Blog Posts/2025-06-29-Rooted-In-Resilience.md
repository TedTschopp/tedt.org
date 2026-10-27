---
layout: post
title: Rooted in Resilience
subtitle: "What Must Stay Dependable When Software Becomes Easier to Change"
quote: "Resilience depends on knowing what can change quickly and what must remain dependable."
excerpt: "A June 2025 conversation between Garry Tan and Sam Altman proposes software generated as needed. For a utility enterprise, the practical question is which interfaces can change while records, permissions, and business rules remain dependable."
source: Original Content
source-url: ''
call-to-action: "Choose one proposed generated interface and identify its source records, permissions, tests, and responsible owner before expanding the experiment."
date: 2025-06-29
update: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
bullets:
- "Tan and Altman's June 2025 discussion is a forecast about software, rather than evidence that SaaS has been replaced."
- "Generating an interface does not settle ownership of records, access control, or business rules."
- "A small read-only trial can test whether a generated view preserves the facts and permissions of its source."
- "Utility resilience requires clear responsibility for both the changing interface and the dependable service beneath it."
description: "A publication-era examination of Tan and Altman's June 2025 just-in-time software forecast, with a proposed utility example and practical questions about records, permissions, and ownership."
seo-description: "What June 2025 forecasts about generated software mean for utility SaaS decisions: preserve dependable records, business rules, permissions, and responsibility."
categories:
- Artificial Intelligence
- Business
- Opinion
- Philosophy
tags:
- artificial intelligence
- enterprise software
- SaaS transformation
- utility companies
- digital transformation
- Sam Altman
- OpenAI
- just-in-time software
- business strategy
- technology leadership
keywords: AI revolution, enterprise SaaS, utility software, digital transformation,
  artificial intelligence strategy, just-in-time software, Sam Altman, OpenAI, enterprise
  technology, business resilience
location:
  name: Bradbury, CA
coordinates:
  latitude: 34.147
  longitude: -117.9709
image: /img/AI/Rooted-in-Resilience.webp
image-alt: Deep-rooted tree weathering a storm, symbolizing enterprise resilience
  during AI transformation
image-artist: Ted Tschopp
image-artist-URL: https://tedt.org/
image-credits: Ted Tschopp
image-credits-URL: https://tedt.org/
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image-credits-title: ''
image-description: Metaphorical representation of how enterprises with deep roots
  can weather the storm of AI transformation
image-title: Enterprise Resilience in the AI Storm
mastodon-post-id: 115005878057980331
image_width: 1536
image_height: 1024
---

Every autumn, when the Santa Ana winds sweep across Southern California, I watch how the landscape responds. Some trees stand firm. Others, poorly anchored, bend or break. Resilience depends partly on what remains secure when everything around it moves.

Working in a large utility enterprise, I find that a useful question for software, too. We rely on Software-as-a-Service (SaaS), systems in our own facilities, and applications on individual devices. If AI makes software easier to create and alter, which parts should we change quickly, and which parts need to remain dependable?

## A Forecast Worth Examining

In [Y Combinator's conversation with Sam Altman](https://www.youtube.com/watch?v=V979Wd1gmTU), held June 16 and published June 21, 2025, Garry Tan proposed an arrangement with underlying data, an API enforcing access and business rules, and a language-model interface that generates software as needed. Altman agreed that he expected this direction and argued that a changing industry gives fast-moving startups an opportunity.

That is a forecast from a startup event, with a supplier's perspective on AI. It is not a finding that generated software has replaced enterprise SaaS, or that an arbitrary generated application can safely run a utility process. The question is useful enough to examine without treating the prediction as an accomplished fact.

Within our IT Technology Strategy Group, we have discussed related possibilities: systems that adapt to the work a person needs to do, with software helping assemble the right view or workflow. Those discussions describe a direction to explore. They do not establish that the operational, security, or maintenance questions have been solved.

## The Interface Is Only Part of the Service

Imagine a planner asking for a view of overdue inspections by district. Generating a useful screen could remove some of the effort of building a fixed report. But the screen still needs to use the right records, apply the right definition of overdue, and show only information that the planner is permitted to see.

If the underlying dates disagree, a more flexible interface has not resolved the disagreement. If business rules live only in generated code, someone needs to explain which version is authoritative. If a useful draft becomes a shared application, someone needs to maintain it when the data or rules change.

As I discussed in [AI in Software Development: Breaking Myths and Building Teams](https://tedt.org/AI-in-Software-Development-Breaking-Myths-and-Building-Teams/), the work involves people and responsibilities as well as code. Easier generation changes the effort of producing a component. It does not determine who accepts responsibility for the service.

## Try One View Before Replacing a System

Consider a proposed read-only planning view, built from approved sample work orders. This is an illustrative trial, not a description of an operating SCE system. The process owner would define the fields and business rules, a data owner would confirm the source, and a reviewer would compare the generated view with a checked reference.

The trial could include four cases:

| Case | Required Result |
| --- | --- |
| A straightforward set of work orders | The displayed identifiers, dates, and totals match the checked source |
| An overdue date conflicts with another record | The conflict is visible; the interface does not silently invent a resolution |
| The user lacks access to one district | That district's records remain unavailable, including through exports or alternate requests |
| The user asks to change a work order | The read-only view cannot perform the change; it directs the user to the authorized process |
{: .well .table .table-striped}

These are proposed acceptance conditions, not proof that a generated interface already meets them. Start with sample data so failures can be examined without changing live records. Before connecting to an operating service, the responsible teams would need to approve the design, verify its behavior, and agree on support and recovery.

Compare the complete effort with the existing report: building the view, checking it, correcting it, and keeping it usable when a field changes. If that effort is lower and the agreed conditions hold, the experiment supports a limited next step. It does not automatically support replacing the system beneath it.

## Put the Roots in the Right Place

The electrical grid offers an analogy without requiring a claim about one historical turning point. People can connect many kinds of equipment because the shared service underneath has defined operating responsibilities. The appliance can change while the service remains dependable.

Software has its own boundaries: source records, access decisions, business rules, and the people responsible for correcting an error. A generated interface may give us more freedom above those boundaries. It is worth asking whether that freedom makes the underlying responsibilities clearer or simply hides them.

In [Learning by Doing](https://tedt.org/Learning-by-Doing-How-Scouting-Wisdom-Can-Guide-our-AI-Journey/), I connected experimentation with the discipline of trying, observing, and adjusting. That remains a useful approach here. Test one view. Inspect the result. Learn what has become easier and what still needs care.

The roots of resilience are not a particular screen or software contract. They are the dependable records, rules, and responsibilities that let us change the screen without losing our footing.
