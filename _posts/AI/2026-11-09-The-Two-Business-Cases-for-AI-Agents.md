---
layout: post
title: "The Two Business Cases for AI Agents"
subtitle: "What a parts counter can teach us about growth, operating costs, and the next model release."
date: 2026-11-09 00:00:00 -0800
permalink: /The-Two-Business-Cases-for-AI-Agents/
mastodon-skip: true
author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=mp"
  name: Ted Tschopp
  url: https://tedt.org/
description: "A parts distributor uses the same AI capability to test a new paid service and lower quote desk costs. Follow both business cases and see what a model upgrade must prove before a workaround can go."
excerpt: "A paid sourcing service and a less expensive quote desk can start with the same email. They need different evidence, and both can benefit from a model upgrade that earns its place."
image: "/img/2026-11/two-business-cases-for-ai-agents.webp"
image-alt: "A blue industrial seal on a parts counter branches into an orange order ticket and a blue quote ticket."
image-title: "Two Jobs at the Parts Counter"
image-description: "Two paths from the same replacement part lead to a new sale and an existing quote, with a removable detour on the quote path."
image-credits-artist: "TedT.org"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1600
image_height: 900
categories:
  - AI
  - Business
  - Enterprise Architecture
  - Leadership
tags:
  - AI agents
  - enterprise AI strategy
  - value streams
  - business case
  - operating costs
  - technical debt
  - model evaluation
---

The email arrives with a photograph and one sentence. “Same seal as the pump we bought in 2008. Can you get one by tomorrow?”

The nameplate in the photograph is missing two digits. There are three versions of the pump in the catalog. Someone at the parts counter has to figure out which one the customer owns before anyone can promise a delivery date.

Imagine you run that distributor. You could use an AI agent to help the quote desk deal with emails like this more cheaply. You could also sell a next-day sourcing service to customers who will pay to get a hard-to-find part located and verified. Both jobs start with the same email. They come to the investment meeting with different evidence. The new service needs paying customers. The quote desk needs a cost it can take out of the budget.

There is a third decision waiting for both teams. A model supplier will eventually ship another version. Some instructions and scripts that helped the old model may be work the new one can do. How do you find out what you can take away?

## Sell the new service

The distributor already sells parts. The new thing is a promise that customers can buy. Send us what you know about the broken pump, and by the next business day we will give you a verified source and a lead time. A person can deliver the first version of this service with a phone, a catalog and a way to take payment.

That pilot tells you something a demonstration cannot. Will a maintenance manager actually pay $100 for the promise? It also gives the team the first version of the process. Record what came in, which part was identified, who verified it, when the answer went out and whether the customer paid. Those records become the beginning of the data model and the first cases against which the team can test the agent.

Say the team gets 200 eligible requests in a typical month. It manually fulfills 30 paid orders at $100 each. At $60 in delivery cost per order, the service contributes $1,200 a month before any shared overhead. Now suppose a workflow with the model can fulfill 45 paid orders from the same pool at $40 each, with $200 in additional monthly operating cost. That would bring in $4,500 in monthly revenue, $1,500 above the manual pilot. After delivery and operating costs, it would contribute $2,500 a month. With a $2,000 launch cost, the first year would contribute $13,600 more than continuing the manual pilot.

Those numbers are illustrative. The word that matters in both rows is *paid*. A team that handles 45 requests has proved it can handle 45 requests. It still has to see how many customers buy, and how much it costs to fulfill the promise. If buyers move over from an existing paid service, account for the sales and margin that move with them. If the objective is to attract outside capital, track funding commitments as a separate result.

Greenfield helps because you can design a small process around what people are willing to buy. You can change the intake form or narrow the promise without unwinding years of practice. You still need a way to say what good work looks like. In this example, the team asks for at least 98% correct results and a turnaround within one working day on 95% of cases. The new service can use the same old catalog, inventory and supplier records as the quote desk. How much infrastructure you inherit is a separate question from where the money comes from.

## Take a cost out of the quote desk

Walk over to the existing desk and follow an email from arrival to the point when a correct quote reaches the customer. A written procedure helps. So do the people who can tell you what they do when the procedure runs out. One employee knows that a certain vendor reused part numbers. Another knows that a retired brand still appears on the plates people photograph. Some of that knowledge is in a catalog. Some is in an alias table maintained by a contractor.

Here the advantage of a mature process is that you have something to compare. At 1,000 quotes a month, the desk spends $5,000, including $1,000 for the alias routine and its support contract. Look at ordinary cases, bad photographs, near matches and requests that should be sent to a person. Record correctness and elapsed time all the way through review. I’ve used cost per accepted outcome for this kind of comparison because the retries and corrections belong to the job. [The Cost of a Finished Job]({% link _posts/AI/2026-08-16-The-Cost-of-a-Finished-Job.md %})

Faster work can give people time back. That time has value, especially when someone is waiting for an answer. A field study of a customer support assistant found a 15% average increase in issues resolved per hour. To claim a reduction in operating and maintenance expense, the budget owner at our parts desk also needs to show that the team can reduce overtime, end a support contract or take another identifiable expense out of the operation. [Generative AI at Work](https://doi.org/10.1093/qje/qjae044)

## Give the model a particular job

I’d start with the part of the request that needs interpretation. A general-purpose language model can take the email and photograph, propose a part family and decide which approved lookup to try next. It can ask for the missing dimensions if the evidence runs out. A straightforward workflow can call the model once for a routine request. Some exceptions may justify letting the agent choose among several lookups.

The price comes from the transaction system. The catalog and manufacturer specifications tell you which parts are compatible. A person with the right authority decides what to do when two plausible parts remain. Put these boundaries in the tools and workflow so they apply each time the agent acts. When the model lacks an up-to-date fact, give it a lookup. When a rule is clear, implement it as a rule. A narrower machine learning model may be the right choice for a recurring classification task if you have examples and it performs better on them.

Today’s general-purpose model still struggles with some of those old vendor aliases. So keep the alias routine and give the agent access to it. Now suppose the whole desk costs $3,650 a month before the $1,000 contract. That’s $350 a month below the original desk. After a $2,000 cutover, the first year saves $2,200. The business case can stand on that result if the quality and turnaround also hold.

Document why the routine is there. In this example, its job is to turn old names into candidates. Any check that protects compatibility, pricing or approval belongs in the systems responsible for those decisions. That distinction gives the team a specific experiment to run when a model release arrives.

## Run the upgrade with the routine turned off

Use the same cases for the model you have, the new model with the routine, and the new model without it. Include the aliases that caused the team to keep paying for the routine. Include lookalikes for which a plausible guess could send a customer the wrong part. Repeat trials where outcomes vary. Watch how many cases people have to rescue and how long the customer waits.

Say the new model costs $3,800 a month to operate before legacy support, and the total cutover from the original desk would cost $3,000. Keep paying for the routine and you spend $4,800 a month. That saves $2,400 over twelve months and leaves a $600 first-year loss after cutover. Cancel the contract and you spend $3,800 a month. The same first year now saves $11,400.

The cheaper path still has to work. The fictional desk requires 98% correct quotes, a turnaround of two hours or less on 95% of cases and passing results on the required controls and exception tests. Say the new model without the routine comes in at 98.9% and an hour and a half, and passes those tests. You have a reason to try the simpler workflow on live cases without letting it send quotes yet. If that trial holds, roll it out with a fallback. Once the team can shut down the routine and cancel the contract, there is a real cost to remove. If the result comes in at 97% correct, keep the routine. If a different desk still needs the contract, keep its cost in the calculation.

There is precedent for removing instructions that newer models can do without. Cursor reported cutting roughly two-thirds of its system prompt and described using A/B tests to tune the system on live traffic. Model changes can go the other direction too. OpenAI rolled back a GPT‑4o update in ChatGPT after it made the model too agreeable. I would keep the production version fixed where the provider allows it and run a new release through the same workflow tests before moving traffic. [Cursor’s engineering write-up](https://cursor.com/blog/improved-token-efficiency) · [OpenAI’s account of the rollback](https://openai.com/index/sycophancy-in-gpt-4o/) · [Model Portability Is Not AI Portability]({% link _posts/AI/2026-08-28-Model-Portability-Is-Not-AI-Portability.md %})

## Try the Agent Business Case Lab

Open the [Agent Business Case Lab](https://tools.tedt.org/agent-business-case-lab.html) and start with the distributor. In **Growth**, change the number of paid orders the new service can deliver. Watch revenue and contribution move independently. In **Operating cost**, turn off the option to cancel the support contract. Then enter a correct-quote rate of 97% for the upgrade without the routine and watch the quality check fail. You can replace all the example figures with your own and mark whether they are estimates or measured inputs.

If you’re choosing where to begin, pull up one real request with the people who have to finish it. Follow it until a customer has an answer. Somewhere between that blurry photograph and the correct seal, you’ll find a job you can price, a rule somebody has to own, and a case worth keeping for the next time the model changes.
