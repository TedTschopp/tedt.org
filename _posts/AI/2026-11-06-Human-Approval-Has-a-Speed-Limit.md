---
layout: post

title: "Human Approval Has a Speed Limit"
subtitle: "Before you increase what your agents can produce, decide how much your people can responsibly review."
quote: "You kept the human in the loop. You just don't have enough humans to handle the volume of reviews."
excerpt: "AI can send work to people faster than they can review it. Calculate protected capacity, account for returned work, and set an explicit limit on incoming volume."
source: "Original Content"
source-url: ""
call-to-action: "Try the Review Capacity Lab"

date: 2026-11-06 00:00:00 -0700

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=mp"
  name: Ted Tschopp
  url: https://tedt.org/

description: "A practical method for estimating human review capacity, accounting for rework, and limiting AI-generated workload to what qualified people can responsibly handle."
seo-description: "How to calculate human review demand and protected capacity for AI workflows, including returned work, queue limits, and responsible intake planning."
image: "/img/2026-11/The-New-Bottle-Neck.webp"
image-alt: "A large funnel of requests narrows to an orange bottleneck before widening to a smaller number of outputs."
image-title: "The New Bottleneck"
image-description: "A funnel visualizes many incoming requests constricted by a narrow human review bottleneck."

categories:
  - AI
  - Business
  - Enterprise Architecture
  - Leadership
  - Opinion

tags:
  - human oversight
  - review capacity
  - AI governance
  - agentic AI
  - workflow management
  - operating model
  - responsible AI
  - queue management
  - AI implementation
mastodon-post-id: "117573573944110268"
mastodon-post-url: "https://tschopp.net/@Ted/117573573944110268"
---

# Human Approval Has a Speed Limit

*Before you increase what your agents can produce, decide how much your people can responsibly review.*

Imagine a team receiving 120 requests an hour. An AI system handles the routine work and sends 20% of the requests to a person. Each human review takes five minutes.

That sounds manageable. The machine handles most of the work. People look at the exceptions.

Now count the minutes.

Every hour produces 24 reviews. At five minutes each, those reviews require 120 minutes of human attention. Two qualified people would have to spend the entire hour reviewing just to keep pace.

There is no time left for a meeting, an unusual case, a conversation with a customer, or correcting yesterday's mistake. There is no time to help a colleague understand something the system got wrong.

You kept the human in the loop. You just don't have enough humans to handle the volume of reviews.

This is the next practical question for organizations putting AI into their work: **How much work can reach the review queue before the review stops being credible?**

## Count the hours people actually have

In [How Much Work Can Your AI Safely Own?](https://tedt.org/How-Much-Work-Can-Your-AI-Safely-Own/), I described review debt: faster assembly creates more work packages for experienced people to inspect. In [The Cost of a Finished Job](https://tedt.org/The-Cost-of-a-Finished-Job/), I argued that human accountability requires enough context, time, expertise, and authority to make a real decision.

The next step is to turn those requirements into a limit on incoming work.

Return to our example. Over eight hours, the team receives 960 requests. The 20% needing review produces 192 cases. At five minutes each, that is 16 hours of review work.

Suppose there are two reviewers. Both have eight-hour working days. But after their other responsibilities, each can protect four hours for this queue.

The team has eight review hours available. Sixteen hours arrive.

By the end of the first workday, eight hours remain unfinished. Under the same assumptions, another eight hours join them the next day. After ten workdays, the queue contains 80 hours of review work, equivalent to 960 average cases.

These are illustrative numbers. The arithmetic is useful because it exposes a common planning mistake: counting a person as a full day of available capacity while assigning that person several other jobs.

A headcount tells you how many people belong to the team. A review plan needs to say when those people can do this particular work.

{% comment %}
<!-- markdownlint-disable MD055 MD056 -->
{% endcomment %}

| Review arrangement                    | Review demand per day | Protected capacity per day | What the averaged model shows                         |
|---------------------------------------|:---------------------:|:--------------------------:|:------------------------------------------------------|
| Two reviewers with four hours each    |       16 hours        |          8 hours           | Eight hours added to the queue each day.              |
| Two reviewers with eight hours each   |       16 hours        |          16 hours          | No spare capacity. Any starting queue remains.        |
| Three reviewers with eight hours each |       16 hours        |          24 hours          | Eight hours available for existing work or variation. |
{: .well .table .table-striped}
{% comment %}
<!-- markdownlint-enable MD055 MD056 -->
{% endcomment %}

The eight-hour cases show the boundary in the calculation. They are not a recommendation to schedule uninterrupted reviewing for an entire working day.

## The queue is part of the control

Recent accounts of deployed systems make the human decision point visible.

In its [Nov. 2 account of building Copilot Cowork](https://commandline.microsoft.com/how-we-built-copilot-cowork-python-to-rust-migration/), Microsoft describes human review becoming a bottleneck as agents produced more code. The team used automated reviewers for early feedback and retained human checks for critical changes. It also reports a case in which several reviewer agents missed four blocking issues that people subsequently found. This is a first-party engineering account, not an independent comparison of review methods. It does, however, show why faster automated feedback and sufficient human judgment remain separate design questions.

An [AWS and U Mobile account published Nov. 4](https://aws.amazon.com/blogs/machine-learning/how-u-mobile-built-agentic-telco-operations-with-amazon-bedrock-agentcore/) describes a different setting. Its telco helpdesk investigates a subscriber's problem and prepares corrective actions. A support agent reviews and confirms before changes execute on the live account. That arrangement places a person at a consequential point in the workflow. The account does not establish how much review traffic that person can absorb.

The capacity question follows from both examples. What happens when requests arrive faster than qualified people can inspect them?

The system might wait. Someone might work late. A team might begin approving larger batches. Reviewers might spend less time recovering context or challenging the proposed action.

Those are different operating responses. Each deserves an explicit decision. A growing queue should make the limitation visible before people quietly absorb it through overtime or thinner review.

If approval is one of the controls that justifies letting an agent act, then the organization needs evidence that the control can operate at the authorized volume.

## Give incoming work a limit

The basic calculation is small enough to keep beside the workflow:

**Daily review demand = requests × fraction needing review × average review minutes.**

**Daily review capacity = qualified reviewers × protected review hours × 60.**

Divide demand by capacity to see the load being offered to the team. In our example, demand is 200% of capacity. That does not mean the reviewers are performing at 200% utilization. It means twice as much work is arriving as their protected time can accommodate.

At 100%, the averaged model has no spare capacity. An empty queue can remain empty if every assumption holds. An existing queue cannot shrink. A longer case or an interruption has no unused time waiting for it.

A team can choose to plan below that boundary. The appropriate margin depends on its work: variation in case difficulty, the cost of delay, access to specialists, and the consequences of an inadequate decision.

Suppose, purely as a planning example, the team chooses to admit new work up to 80% of its protected capacity. Eight available review hours become a new-work budget of 6.4 hours, or 384 minutes.

Each incoming request creates one minute of expected review work: 20% multiplied by five minutes. The corresponding intake limit is therefore **384 requests per workday**.

Keeping the original 960 requests would require five reviewers with four protected hours each to meet that example target. The team would then have 20 review hours, with 16 committed to new demand.

The 80% figure is an assumption to test, not a standard of safety. The useful change is making the relationship explicit. When protected review capacity changes, the amount of new work the system admits should be reconsidered too.

An agent platform can enforce this through a dispatch limit, a bounded queue, or a pause before starting additional work. The implementation depends on where work can safely wait. A customer request may still need to be accepted and acknowledged even when its processing must be delayed or escalated.

Someone should own that decision, including what happens when a time-sensitive case arrives at a full queue.

## Returned work also needs attention

Our first calculation assumes each reviewed case needs one pass. Real work can have mistakes that require additional review passes.  Additionally, a review might find something as complete, only to find out later that it was incomplete or incorrect, necessitating further review.

Consider the arrangement with two reviewers protecting eight hours each. New demand exactly fills their 16 hours. Now suppose 25% of reviewed cases need one additional four-minute pass.

The average workload becomes six minutes per reviewed case: five minutes initially, plus one minute for the additional pass averaged across all cases.

Daily demand rises from 16 hours to 19.2. Capacity remains at 16. The queue gains 3.2 hours each day.

This example includes exactly one additional pass. A workflow with repeated returns needs to measure those passes too. Counting only the first approval request would hide part of the job.

The same care applies to the work class. Five people are not interchangeable capacity if only one can judge a particular exception. Separate the specialist queue before pooling the hours. Otherwise, the total can look comfortable while the cases that matter wait for the same person.

Review time also has content. A useful review may require opening the source record, checking the relevant policy, resolving an ambiguity, and understanding what the proposed action will change. Measure that work, including corrections and follow-up. The time taken to click an approval button is a poor substitute.

## Know the process before you accelerate it

If this calculation and way of thinking feels strange to you, you are not yet ready to put AI into this process. You need to understand the work well enough to plan for what happens when more work arrives.

That may be uncomfortable to hear, especially if someone is already asking you for an AI implementation date. You may have inherited a process whose measurements were never collected. The people doing the work may have kept it moving through experience, informal conversations, and extra hours. Give yourself and those people time to make that work visible.

Start by following a request from arrival to a finished outcome. Sit with the people who handle it. Ask what they check, where they wait, what comes back, and which decisions require someone with particular experience or authority. Include the awkward cases that do not fit the procedure.

Then collect the information needed to make a capacity plan:

- How much work arrives, over what period, and how sharply arrivals vary.
- Which requests need human review, why they need it, and who can perform it.
- How much active effort a complete review takes, including gathering context and checking evidence.
- How often work returns and how much additional effort each return requires.
- How many qualified review hours are actually protected after other responsibilities.
- How much work is already waiting, how old it is, and what happens when a decision is late.

Use existing records where they are useful. Observe or sample the work where the records are incomplete. Include busy periods and difficult cases. Keep active effort separate from elapsed waiting time; both matter, but they answer different planning questions.

Your first estimates will have gaps. Mark them, ask the people closest to the work to challenge them, and replace them with observations. Collecting this information belongs in the AI implementation plan, with time and people assigned to it.

The queue should not be a surprise discovered after launch. Work through the demand, review effort, and available capacity while you can still change the plan. The people responsible for the decisions deserve that preparation before more work starts arriving.

## Try the Review Capacity Lab

The [Review Capacity Lab](https://tools.tedt.org/review-capacity-lab.html) lets you work through these choices in your browser. Start with the article example, then change the number of reviewers or their protected hours. Load the exact-capacity example and notice that its starting queue never clears. Add re-review and watch the workload change.

You can enter your own assumptions, inspect the daily table, and export the scenario and workload timeline. The staffing calculation distinguishes keeping up with new work from clearing the starting queue within the chosen window.

The lab uses averaged daily totals. It does not predict actual waiting times, reviewer fatigue, decision quality, or the effect of a morning burst of difficult cases. Its case-equivalent count expresses remaining workload; it is not a count of partly approved real decisions. A result showing spare hours is a reason to investigate the workflow, not permission to increase an agent's authority.

Use actual queue records to improve the assumptions. How many requests arrived? How many needed review? How long did the complete review take? How much work returned? How old were the cases when someone finally decided them?

Then compare those observations with the amount of review time the organization protected.

The practical response may be to improve the evidence package so people can review it more efficiently. It may be to narrow the work admitted to the automated path, allocate more qualified review time, or improve independent checks before reconsidering which cases require human attention. Required approvals still apply. Every proposed change needs its own evidence.

There is a human commitment inside this calculation. If a person is responsible for a decision, the organization owes that person a workable opportunity to understand it, challenge it, and refuse it.

Before the next batch starts, decide how much work can reach the review queue. Then protect the time in which someone qualified can finish the decision.
