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

The email arrives with a photograph and a short note. “Same seal as the pump we bought in 2008. Can you get one by tomorrow?”

The nameplate in the photograph is missing two digits. There are three versions of the pump in the catalog. Someone at the parts counter has to figure out which one the customer owns before anyone can promise a delivery date.

Imagine you run that distributor. You could use an AI agent to help the quote desk deal with emails like this more cheaply. You could also sell a next-day sourcing service to customers who will pay to get a hard-to-find part located and verified. Both jobs start with the same email. They come to the investment meeting with different evidence. The new service needs paying customers. The quote desk needs a cost it can take out of the budget.

There is a third decision waiting for both teams. A model supplier will eventually ship another version. Some instructions and scripts that helped the old model may be work the new one can do. How do you find out what you can take away?

## Sell the new service

The distributor already sells parts. The new thing is a promise that customers can buy. Send us what you know about the broken pump, and by the next business day we will give you a verified source and a lead time. A person can deliver the first version of this service with a phone, a catalog and a way to take payment.

That pilot tells you something a demonstration cannot. Will a maintenance manager actually pay $100 for the promise? It also gives the team the first version of the process. Record how many paid orders customers place and how many the desk can finish. For each request, keep the part you identified, who verified it and when the answer went out. Those records become the beginning of the data model and the first cases against which the team can test the agent.

Say the team gets 200 eligible requests in a typical month. In this example, it manually fulfills 30 paid orders at $100 each. At $60 in delivery cost per order, the service contributes $1,200 a month before shared overhead. Suppose a workflow with the model can handle 45 orders a month. It costs $40 to deliver each order, plus $200 a month to run the workflow. Getting it started costs $2,000.

Start with the 30 orders you already have. At the same $100 fee, revenue is $3,000 a month either way. Over twelve months, the lower delivery cost adds $2,800 in contribution after the launch cost. Now find 15 more orders a month from customers willing to pay for the same promise. At 45 paid orders, monthly revenue rises to $4,500 and monthly contribution to $2,500. Over those twelve months, the gain over the manual pilot rises to $13,600 after the launch cost.

You can test whether the desk has room for those extra orders before you know whether customers will place them. The sales case needs both. If buyers move over from an existing paid service, account for the sales and margin that move with them. If the objective is to attract outside capital, track funding commitments as a separate result.

Greenfield helps because you can design a small process around what people are willing to buy. You can change the intake form or narrow the promise without unwinding years of practice. You still need a way to say what good work looks like. In this example, the team asks for at least 98% correct results and a turnaround within one working day on 95% of cases. The new service can use the same old catalog, inventory and supplier records as the quote desk. How much infrastructure you inherit is a separate question from where the money comes from.

## Take a cost out of the quote desk

Walk over to the existing desk and follow an email from arrival to the point when a correct quote reaches the customer. A written procedure helps. So do the people who can tell you what they do when the procedure runs out. One employee knows that a certain vendor reused part numbers. Another knows that a retired brand still appears on the plates people photograph. Some of that knowledge is in a catalog. A contractor also maintains a table of verified aliases and the script that searches it.

Here the advantage of a mature process is that you have something to compare. At 1,000 quotes a month, the desk spends $5,000, including $1,000 for the alias routine and its support contract. Look at ordinary cases, bad photographs, near matches and requests that should be sent to a person. Record correctness and elapsed time all the way through review. I’ve used cost per accepted outcome for this kind of comparison because the retries and corrections belong to the job. [The Cost of a Finished Job]({% link _posts/AI/2026-08-16-The-Cost-of-a-Finished-Job.md %})

Faster work can give people time back. That time has value, especially when someone is waiting for an answer. A field study of a customer support assistant found a 15% average increase in issues resolved per hour. To claim a reduction in operating and maintenance expense, the budget owner at our parts desk also needs to show that the team can reduce overtime, end a support contract or take another identifiable expense out of the operation. [Generative AI at Work](https://doi.org/10.1093/qje/qjae044)

## Give the model a particular job

I’d start with the part of the request that needs interpretation. A general-purpose language model can take the email and photograph, propose a part family and decide which approved lookup to try next. It can ask for the missing dimensions if the evidence runs out. A straightforward workflow can call the model once for a routine request. Some exceptions may justify letting the agent choose among several lookups.

The price comes from the transaction system. The catalog and manufacturer specifications tell you which parts are compatible. A person with the right authority decides what to do when two plausible parts remain. Put these boundaries in the tools and workflow so they apply each time the agent acts. When the model lacks an up-to-date fact, give it a lookup. When a rule is clear, implement it as a rule. A narrower machine learning model may be the right choice for a recurring classification task if you have examples and it performs better on them.

Today’s general-purpose model still struggles with some of those old vendor aliases. So keep the alias routine and give the agent access to it. Now suppose the whole desk costs $3,650 a month before the $1,000 contract. That’s $350 a month below the original desk. After a $2,000 cutover, the first year saves $2,200. The business case can stand on that result if the quality and turnaround also hold.

The table and the script do different jobs. The table holds old names that people have checked. The script looks them up. Before you switch off the script, put the verified aliases in the catalog and give someone responsibility for keeping them current. Give both workflows access to the same records. Keep compatibility, pricing and approval checks in the systems responsible for those decisions.

## Run the upgrade with the routine turned off

Use the same cases for the model you have, the new model with the script, and the new model without it. The desk requires 98% correct quotes and a turnaround of two hours or less on 95% of cases, including time spent in review. It also requires separate passes on two kinds of request. When a vendor has reused a part number, the workflow has to verify the manufacturer and the compatible part. When two plausible matches remain, it has to send the case to a person before releasing a quote. A miss on either test can block the change even at 98.9% overall. The usual pricing and approval checks still apply.

Say the new model without the script comes in at 98.9% correct, with an hour and a half for 95% of cases, and passes the required tests. That earns a trial on live requests with people still releasing the quotes. You now have an answer to whether the upgrade can do the work without the script. You still have to decide whether to buy the upgrade.

From the original quote desk, suppose the total cutover would cost $3,000. At $3,800 a month for the new workflow, ending the $1,000 support contract would save $11,400 over twelve months after accounting for the cutover. Keep paying for support and the same comparison shows a $600 loss.

If today’s model is already running, start with the $4,650 the desk spends each month. The original cutover is behind you. Suppose another $1,000 is still needed to switch. End the support contract and you save $850 a month, or $9,200 over twelve months after the switch cost. Keep the contract and the new model costs $150 more each month. Including the switch cost, keeping today’s model saves $2,800 over those twelve months.

A different desk may still need the contractor. Keep that bill in the calculation until someone can cancel it. If the trial holds and the switch pays, roll it out with a fallback and retire the script once the desk can do without it.

There is precedent for removing instructions that newer models can do without. Cursor reported cutting roughly two-thirds of its system prompt and described using A/B tests to tune the system on live traffic. Model changes can go the other direction too. OpenAI rolled back a GPT‑4o update in ChatGPT after it made the model too agreeable. I would keep the production version fixed where the provider allows it and run a new release through the same workflow tests before moving traffic. [Cursor’s engineering write-up](https://cursor.com/blog/improved-token-efficiency) · [OpenAI’s account of the rollback](https://openai.com/index/sycophancy-in-gpt-4o/) · [Model Portability Is Not AI Portability]({% link _posts/AI/2026-08-28-Model-Portability-Is-Not-AI-Portability.md %})

## Try the Agent Business Case Lab

Open the [Agent Business Case Lab](https://tools.tedt.org/agent-business-case-lab.html) and start with the distributor. In **Growth**, set **Paid orders placed per month** to 30 and leave fulfillment capacity at 45. See how much of the case comes from lowering the cost of delivery. In **Operating cost**, turn off the option to cancel the support contract. The delivery checks can still pass for the upgrade without the script, even when keeping today’s model costs less. Set **Unsafe near-match tests** to **Failed** to see what happens to the upgrade without the routine. Choose **Start blank** to enter your own figures and identify where they came from.

If you’re choosing where to begin, pull up one real request with the people who have to finish it. Follow it until a customer has an answer. Somewhere between that blurry photograph and the correct seal, you’ll find a job you can price, a rule somebody has to own, and a case worth keeping for the next time the model changes.
