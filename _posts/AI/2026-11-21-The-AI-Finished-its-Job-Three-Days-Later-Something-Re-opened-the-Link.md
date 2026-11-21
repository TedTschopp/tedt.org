---
layout: post

title: "The AI Finished its job. Three Days Later, Something Re-opened the Link."
subtitle: "One tracking link puts an AI vendor’s privacy promise to the test."
quote: "A privacy promise becomes useful when someone can explain what happened to your information—and someone at your company can decide whether that explanation is good enough."
excerpt: "An AI service finishes a summary. Three days later, a tracking link in the report is opened. What can that event tell a company about its supplier’s privacy promise?"
source: "Original Content"
date: 2026-11-21 00:00:00 -0800

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=mp"
  name: Ted Tschopp
  url: https://tedt.org/

description: "A tracking link in an AI request raises questions about data retention, supplier privacy promises, and how companies investigate unexpected access."
seo-description: "How a tracking link can test an AI vendor’s privacy promise, and what companies should investigate when request data is accessed later."

image: "/img/2026-11/ai-privacy-promise-hero.webp"
image-alt: "A document connects to a chain of black squares, with a red square isolated inside a circle."
image-title: "The AI Privacy Promise"
image-description: "A document and connected squares face a separate red signal, representing an unexpected event after an AI request."
image_width: 1672
image_height: 941

categories:
  - AI
  - Business
  - Enterprise Architecture
  - Opinion

tags:
  - AI privacy
  - AI governance
  - data retention
  - AI supply chain
  - canary tokens
  - incident response
  - vendor risk
mastodon-post-id: "117655943580267942"
mastodon-post-url: "https://tschopp.net/@Ted/117655943580267942"
---

# The AI Finished its job. Three Days Later, Something Re-opened the Link.

Imagine your company wants to use AI to summarize reports about repairs at its factories.

Before putting real company information into the service, the security team runs a test by submitting a report with a unique tracking link. The report contains made-up information and that unique link to a harmless web page.

That page notifies security whenever someone, or some computer program, tries to open it. The team puts the link in this one report and nowhere else.

The AI produces a summary. The test appears to be finished.

Three days later, your security team gets notified that something opens the link.

Your company approved the AI service as being compliant with its privacy requirements. The people who set it up say they used the right settings. The supplier promised to handle the information according to an agreed privacy policy.

Yet something tried to access the unique link and came back for part of the report after the work was done.

That visit triggers an investigation.  Your security team now has to figure out what happened; who opened the link, how they get the link in the first place, and whether the people who accessed it were allowed to do so.

That is where the real work begins.

A company needs to be able to connect what its AI supplier promised with what actually happened. When those accounts do not fit together, someone needs to obtain an explanation and decide what information the company can keep sending while it waits.

This is no longer just a theoretical problem.

On Nov. 19, 2026, the security company Dragos published research involving approximately two million AI requests containing unique tracking information. It reported compromised providers, access by sellers of AI services, and behavior that appeared inconsistent with privacy settings. Some of the planted information was used in attempts to sign in to controlled test accounts. [Dragos’s research](https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens)

The researchers also described a limitation: detecting that information was used did not automatically reveal where it escaped. Even their additional investigation left some companies and systems unidentified.

This deserves attention. Dragos does not tell us what percentage of all enterprise AI requests are exposed, and their findings should not be treated as proof that every AI supplier has the same problem.

To understand why this can be difficult to investigate, start with what happens when you ask an AI a question.

You see an application: a chat window, a writing assistant or a tool inside another program. Behind it is an AI model, the software that produces the answer. The company you got that application from is probably using a model run by another company; one of their suppliers.

There may also be another third party service in the middle that chooses which model will handle your request and forwards the information to it.

So the company who built the application you are using may be only one of the companies involved.

Your question, along with any report or other material you attach, is what is called a *prompt*. That prompt may pass through several systems before an answer comes back.

Try [Prompt Journey](https://tools.tedt.org/prompt-journey.html) to follow an example request through an application, a router and a model host. Turn on “Show possible stored copies and later use” to explore what may remain after the answer. The routes are illustrative: the tool does not trace your company’s systems or test a supplier’s privacy practices.

There can be good reasons for this arrangement. Using a middle service can make it easier for a company to choose among models, manage spending or keep working when one service is unavailable.

But each additional company introduces another practical question: what can that new company see, what can they do with the information, and how long may will they actuallykeep it?

In [The Same Model, Different Rules](https://tedt.org/The-Same-Model-Different-Rules/), I argued that choosing an AI model also means choosing the arrangements around it. Those arrangements include who can use it, how information reaches it and what happens when the service changes.

The next step is understanding how much of that arrangement you can actually check.

A diagram shows the path someone says your information follows. A setting shows what you asked the software to do. A record of an actual event shows something that happened.

You need to understand how those pieces fit together.

Consider three promises that sound similar:

- We do not use your information to train our models.
- We do not keep your information after completing the request.
- We do not allow people outside the approved process to read your information.

Each promise manages a different risk.

*Training* means using examples to change how a model behaves in the future. A company could promise not to train on your report while still keeping a copy to support a feature or investigate misuse.

*Keeping information* is usually called *retention*. A service that remembers an earlier conversation or saves an uploaded file may need to retain information to provide that feature.

Who is allowed to read it is another question again.

OpenAI’s and Anthropic’s published documentation describes differences among these uses. Their rules also vary across features. The privacy arrangement for generating one answer may not cover every tool that stores files or maintains an ongoing conversation. [OpenAI’s data controls](https://developers.openai.com/api/docs/guides/your-data), [Anthropic’s retention documentation](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)

Even the phrase *zero data retention* needs a careful reading. Which information does it cover? Which feature? Which company? Are there exceptions?

OpenRouter, a service that forwards requests to AI providers, says its retention controls for model requests do not automatically cover every additional tool a customer enables. Its published agreement also distinguishes selecting providers based on their stated policies from guaranteeing that those providers follow them. [OpenRouter’s documentation](https://openrouter.ai/docs/guides/features/zdr), [its data-processing agreement](https://openrouter.ai/assets/data-processing-agreement.pdf)

That does not tell us whether a particular supplier broke a particular promise. It explains why a privacy label cannot settle the question.

The investigation needs the rules and settings that applied when the request was sent. A supplier can change its policy and thus its behavior at the time the request was made may differ from what is published today. 

Now return to our fictional factory report.

Something opened its unique link three days later. The company needs to work through five ordinary questions.

1. **What happened?** Preserve the record showing when the report was sent and when the page was requested. Check whether anyone copied the link elsewhere. If someone pasted it into a support ticket, that creates another way it could have been discovered.

2. **Who did it?** A record may identify a computer or hosting service without identifying the person or company responsible. Finding the machine is one step toward finding the explanation.

3. **What information was kept?** Something had enough information to request that address later. That does not establish that someone stored the whole report. A program might have saved only the link or placed it in a list of tasks to complete.

4. **Was that allowed?** Perhaps a feature was permitted to inspect links. Perhaps the activity fell outside the agreed rules. The team needs to compare the explanation with the service the company actually bought and configured.

5. **What should we do while we find out?** The answer depends on the information involved and the consequences of getting this wrong.

That last decision does not have to wait for a complete investigation.

A public incident report from the AI infrastructure company Phala provides a useful example. In its Nov. 10 preliminary report, Phala described exposed requests on a particular AI service it operated. Planted test credentials showed misuse involving requests from two days. But the company told affected customers to treat a wider period as potentially exposed because the tests had sampled requests rather than observed everything. [Phala’s preliminary incident report](https://phala.com/posts/phala-november-preliminary-incident-report)

It also distinguished closing the attacker’s known ways into its systems from later use of information already stolen.

Those are different problems. Closing access does not make an attacker’s copies disappear.

Phala’s report was preliminary. The public accounts reviewed here do not establish whether its incident was one of the unnamed cases in the Dragos research.

What it illustrates is how to act without pretending to know more than the evidence supports. A company can be precise about the events it has confirmed while taking precautions over a wider area of uncertainty.

That is a useful standard for the company in our example.

Its security staff can investigate the unexpected visit without immediately accusing the supplier of breaking its contract. The person responsible for the business service can also pause sensitive use while the investigation continues.

Those actions serve different purposes. One establishes what happened. The other limits what could happen next.

The supplier needs a clear question it can investigate. Sending a general complaint about privacy may produce a general statement about privacy.

Instead, send the request identifier, the time of the unexpected event and a description of the behavior your company expected. Ask which service handled the information, what could explain the event and what records support that explanation.

This is where several parts of a large company need to work together.

The IT team knows how the service was set up. Security staff know how to examine suspicious activity. The people who buy and manage the service know what the supplier agreed to provide. Privacy specialists and lawyers can help determine which obligations apply. The business manager knows what happens if the work stops.

None of them is likely to have the whole answer alone.

Someone needs responsibility for bringing their answers together. That person also needs a deadline for the supplier’s response and the authority to decide what happens if the explanation remains incomplete.

Otherwise, the question can move from inbox to inbox until everyone assumes someone else is handling it.

A supplier may eventually provide a convincing explanation. That is a good outcome. The purpose of the investigation is to understand the event.

The explanation could also reveal a different problem: the service behaved exactly as its documentation described, but your company misunderstood what it had purchased.

Perhaps the team believed no information would be saved, while an enabled feature was allowed to keep it. The supplier may have followed its rules, yet the setup still fails to meet the company’s needs.

That requires a change too.

How much investigation is reasonable? A company should not need a research laboratory to summarize a public instruction manual. Nor should every employee become responsible for tracing information through several suppliers.

Start with the information that would cause the greatest harm if exposed. Identify the services handling it. Make sure someone knows the applicable rules and can obtain help when something looks wrong.

The response should fit the situation. An unexplained event involving public material may allow work to continue during the investigation. The same uncertainty involving employee records or confidential negotiations may justify using another approved service or handling the task manually.

There are tradeoffs. Investigations consume time. Restricting suppliers can increase costs or reduce choice. Moving work to another service can interrupt people who depend on it. A company running its own models takes on more responsibility for the computers, software and people operating them.

There is no useful answer that ignores those costs.

There is also a risk in collecting too much evidence. Saving every employee conversation forever, just in case something goes wrong, creates another store of sensitive information that somebody must protect.

Keep what is necessary to investigate. Limit who can see it. Decide how long it is needed.

Finally, remember what the tracking link can and cannot do.

Security teams often call a planted signal like this a *canary*. It gives them something recognizable to watch for.

If the link is never opened, the team has observed no visit. That does not prove nobody copied the report. Someone could keep information without touching the link.

If the link is opened, the signal has revealed an event. It has not stopped the event or explained everything behind it.

In [The Sandbox Was Not the Boundary](https://tedt.org/The-Sandbox-Was-Not-the-Boundary/), I made a related point: discovering a problem, stopping it and deciding that work can safely resume are separate responsibilities. Each requires evidence suited to that decision.

The privacy promise needs the same care.

In our example, the AI finished its summary in seconds. The information’s story continued after the answer appeared.

Before sending the next sensitive report, your company should know who will follow that story if something unexpected happens.

A privacy promise becomes useful when someone can explain what happened to your information—and someone at your company can decide whether that explanation is good enough.
