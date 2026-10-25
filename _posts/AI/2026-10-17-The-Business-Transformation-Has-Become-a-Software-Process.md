---
layout: post

title: "The Business Transformation has become a Software Process"
subtitle: "Business transformation depends on software we can keep changing. AI is changing how we build and maintain that capability."
quote: "The responsibility lasts as long as the promise does."
excerpt: "Business transformation depends on the ability to keep changing software. AI changes the development process, but maintenance, testing, and team learning remain continuing responsibilities."
source: "Original Content"

date: 2026-10-17 00:00:00 -0700
update: 2026-10-17 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - "Business transformation depends on software that can keep adapting to business needs."
  - "AI development workflows need maintained specifications, context, tests, and limits."
  - "The cost of change includes review, operations, repair, and the continued care of the service."
  - "Teams must preserve business knowledge and make learning part of everyday engineering work."

description: "Business transformation depends on maintainable software. AI changes how teams build it, test it, preserve business knowledge, and keep it useful."

categories:
  - AI
  - Business
  - Enterprise Architecture
  - Leadership

tags:
  - business transformation
  - software development
  - AI coding agents
  - software maintenance
  - specification-driven development
  - software testing
  - engineering leadership
  - team learning

image: "/img/2026-10/Software-Foundation.webp"
image-alt: "The business rests on a modular software foundation, with the red component representing ongoing maintenance."
image-title: "Software Foundation"
image-description: "The business rests on a modular software foundation, with the red component representing ongoing maintenance."
image_width: 1672
image_height: 941
mastodon-post-id: "117457611158583035"
mastodon-post-url: "https://tschopp.net/@Ted/117457611158583035"
---

# The Business Transformation has become a Software Process

*Business transformation depends on software we can keep changing. AI is changing how we build and maintain that capability.*

Suppose a distributor wants to let customers change tomorrow’s delivery without making a phone call.

The customer portal already exists. So does the scheduling system. Yet someone still has to check whether the warehouse has picked the order, whether the truck has room, and whether the customer has already paid for a particular delivery window. A simple request becomes several conversations between people looking at different screens.

The business wants to offer a better service. Making that promise real requires changing how its software works.

This is where I would begin a conversation about AI and software development. Business transformation now depends on software. A company can change its strategy in a meeting. Changing how the company actually operates usually reaches the systems that hold its information and carry out its decisions.

“We aren’t a software company” describes what the company's products.  It says very little about what the company must be able to change.  

Years ago corporate owners would buy everyone a PC and Office on it and call their transformation done.  Before that they might have invested in typewriters and filing cabinets, believing that equipping employees with the right tools was sufficient for transformation.  Before that they were investing in light bulbs and electricity, thinking that illumination alone would drive progress.  The pattern is clear: tools matter, but transformation occurs within the organization and the people who use the tools.

So today, you can buy most of your software and still have this responsibility. Someone must understand how the purchased products fit together, which business rules they enforce, and what happens when a vendor changes something. A supplier can maintain its product. Your company remains responsible for the service built around it.

Owning software, in this sense, means owning its continued fitness for the business. That requires proper maintenance. Security fixes are part of it. So are changing integrations, testing recovery, removing obsolete behavior, and adapting the system when the business makes a new promise. The obligation continues after the project budget closes.

There is a competitive problem here too. Buying generic software can be an excellent decision. Common capabilities seldom justify inventing everything again. But as competitors buy the same capable products, it becomes harder to claim a differentiating advantage from the purchase itself. The distinction has to come from how the business works with those products, what it knows, and how well it serves people.

I explored that moving baseline in [the Red Queen problem in enterprise AI](https://tedt.org/Running-to-stay-put-the-Red-Queen-problem-in-enterprise-AI/). An improvement can become an expectation once everyone can acquire it. Custom code offers no automatic escape. A well-run business using shared products can outperform one burdened with expensive custom systems. The useful question is which capabilities deserve to be distinctive, and how the company will keep them effective.

That also gives us a better way to discuss development speed. An older method can remain appropriate. We should judge it by the service it supports and the cost of changing that service. When a needed improvement waits for another planning cycle while employees maintain a spreadsheet workaround, the delay has a business cost. Familiarity does not settle whether the method is still adequate.

AI gives us reasons to reconsider that method. The opportunity reaches well beyond companies that sell software.

## The Software Development Method Needs Modern Engineering

 You might not be facing this level of competition yet, but in the coming years the pressure to handle massive volumes of changes efficiently will likely affect more organizations.  Consider what happens at the far end of the scale.

In its Oct. 13 account of [redesigning source control](https://www.anthropic.com/engineering/redesigning-source-control), Anthropic said daily code changes in its main repository had risen from about 2,500 in May to more than 30,000 by September. This means that the company is making 2,500 - 30,000 changes to how its business runs every day. The company built a replacement for how it manages its software it around its increasingly agent-generated workload. Moving code into places where it could be inspected and tested had become an enormous infrastructure problem.

Two days later, the Claude Code team described [changing how it reviews code](https://claude.dev/blog/solving-code-review-at-anthropic/). Working in on a seperate track, its experts were reducing the human attention each change requires while watching incidents and reversions.

These are accounts from a company with extraordinary access to its own models. Anthropic acknowledges that its  requirements are unusual (for now). A distributor does not need to match its daily volume.

The more useful observation is where effort went. Faster changes put pressure on the machinery for receiving, judging, combining, and releasing changes. The process of software development needed a process redesign and re-development of its own.

In [The IT Adaptive Factory](https://tedt.org/The-IT-Adaptive-Factory/), I described how delegating implementation moves responsibility into specifications, evaluation, infrastructure, and governance. These recent accounts show more of that responsibility taking a form that machines can use.

AI is turning the software development process into an evolving software ecosystem. Teams express judgment through instructions, context, environments, checks, and limits. Those mechanisms need to be tested and maintained as the models and the work change.

For a business that depends on software, which is almost every business these days, this becomes part of maintaining its ability to adapt to change. The application might be an ordinary billing service or scheduling tool. It need not contain AI. The change is in how people produce and care for it.

## Architecture and Engineering Knowledge Becomes an Input

Return to the delivery request. An agent could add a rescheduling button quickly. Whether that button should work after the truck has been loaded is a different question.

An experienced colleague may know where that rule is documented. They may also know that the document is wrong and which person can explain the exception. Much of software development involves recovering this tribal knowledge that has accumulated since the last change took place before making the next change so that you can make the right change that won't break things.

That knowledge contains the very thing the business wants to preserve, a functioning business. A distributor might allow an exception because it understands a customer’s receiving hours or can combine nearby deliveries. A generic platform cannot infer which arrangements the company has promised to honor.

An agent needs a way to gain that understanding. Otherwise it can implement a plausible generic process that quietly removes something the customers and the business values.

Andreas Martin and Sandro Schwander’s September paper proposes [a specification-driven development lifecycle](https://arxiv.org/abs/2609.24348) using written specifications, repository instructions, and skills associated with different phases of work. The approach was applied in a university course and explored through student feedback. It is a useful process proposal with a more limited evidentiary basis than a demonstrated enterprise standard.

Its practical premise matters. Agreements about the work become inputs an agent can consult while doing it. Someone must establish which agreements are authoritative and notice when they become wrong.

There is a cost to carrying too much guidance. In September, [Cursor described trimming its system prompt by roughly two-thirds](https://cursor.com/blog/improved-token-efficiency), loading some tools only when needed, and improving context reuse. Its team tested the changes against production behavior. Instructions that helped earlier models were no longer always necessary.

So the task includes currating relevant context, preserving the reasons behind important constraints, and retiring stale guidance. The instructions need an owner and evidence of their usefulness.

A business rule buried in someone’s memory is difficult to maintain. Once its written down, it needs to be managed and maintained as an asset.  Once its managed, it can be questioned. Connected to a test, it can be checked. The organization can then change its implementation while preserving the processes.

## The Workplace Expands

How do people bring that understanding into the work?

The familiar picture puts a developer at a keyboard in a local copy of the application. That remains useful. Other ways of participating are becoming practical too.

Addy Osmani’s [guide to Claude Code cloud sessions](https://claude.dev/blog/claude-code-in-the-cloud/) demonstrates independent tasks running on separate machines. Each environment has its own files and processes. Isolation lets work proceed simultaneously, but one session cannot assume another session’s unfinished fix is available. Someone still needs to define the boundaries and the order for combining results.

Simon Willison offers a smaller example. He [built much of a Django feature through voice conversation](https://simonwillison.net/2026/Oct/9/built-using-my-voice/) while cooking dinner, following progress through a browser preview. He returned to the keyboard for detailed corrections and the remaining work before deployment. His account shows both the reach of the conversational interface and where typing remained more efficient.

GitHub’s September guide to [custom canvases](https://github.blog/ai-and-ml/github-copilot/github-copilot-app-for-beginners-how-to-build-custom-workflows-with-canvases/) describes an agent building a board, checklist, or other interface around a workflow. Both the person and the agent can update it.

These examples suggest that the workspace must fit the assignment. A person might describe intent through conversation, inspect a working result, adjust a shared board, or investigate the code directly.

For the distributor, use that flexibility to bring the dispatcher into the conversation earlier. Let the person who understands the route examine the proposed behavior while it is still cheap to correct. Their participation should produce a decision the development system can retain.

A more convenient interface does not grant the agent authority to change a customer commitment. Nor does parallel execution resolve a disputed rule. Three agents working from the same unanswered question give us three implementations to reconsider.

The business needs a way to settle the question and make the answer available to everyone doing the work.

## The Machinery Needs Its Own Tests

Once machines help translate business knowledge into software, we need evidence to show that it got everything correct and that the translation worked.

A coding agent can satisfy the examples it sees without implementing the full requirement. A second agent can repeat the same assumption. Agreement between them may leave the original misunderstanding intact.

The October [Generative Test-Driven Development paper](https://arxiv.org/abs/2610.02952) proposes holding a candidate implementation unchanged while a separate testing agent generates fresh inputs. A trusted evaluator checks the results. The method separates feedback used to improve the implementation from evidence used to accept it. The paper includes a limited experiment on a stateful key-value store, leaving substantial work before we can generalize its results.

The enterprise implication is straightforward. Showing that the rescheduling button works, use to be sufficient, but now you need to know if the change is better then the previous behavior overall. We also need cases that challenge the rule, with an independent basis for deciding what should happen.

We also need to take into account that the development machinery can fail in its own way. One change in the Claude Code account went through more than 50 rounds of automated review and repair overnight. The team limited rounds, narrowed subsequent reviews, and suppressed repeated findings. [The review system needed correction too](https://claude.dev/blog/solving-code-review-at-anthropic/).

In [Dev, Test, and Prod Still Matter](https://tedt.org/Dev-Test-and-Prod-Still-Matter-What-Gets-Deployed-Has-Changed/), I distinguished the deployed assembly from its authority, state, and supporting evidence. The machinery producing that assembly deserves the same attention. Changing an agent’s instructions or access can change its output and the consequences it can cause. Those changes belong in the record of what was evaluated.

This is part of proper maintenance. The company needs to know whether its way of changing software continues to protect the service people depend on.

## Operational Maintenance Becomes a Standing Assignment

A successful launch begins a continuing obligation to keep the system operational and aligned with evolving business needs.

The delivery service will encounter new customer arrangements and changes to other systems. Its dependencies will need updates. Some behavior will become unnecessary. Keeping yesterday’s implementation running may eventually preserve the wrong thing.

That gives operations a direct role in business transformation. Each improvement becomes something the organization must keep useful, revise, or retire. A plan that funds the new capability and leaves its care to whoever has time is incomplete.

In its September account of [making claude.ai faster](https://claude.dev/blog/how-we-made-claude-ai-faster/), Anthropic described a two-week performance effort organized around measured user journeys. Claude helped investigate bottlenecks, construct benchmarks, propose changes, and examine results after deployment. Engineers supplied direction, considered tradeoffs, and approved changes.

The measurements required scrutiny too. The team checked that laboratory improvements corresponded to better user latency and discarded unsuitable benchmarks. A number an agent can improve is useful only when moving it helps the experience people actually have.

This suggests a different shape for some operational work. A team can give an agent a continuing responsibility for a bounded problem, with measurements, limits, and a route back to the people responsible for the service. The investment in detecting a problem can then support future fixes and reveal when an improvement has been lost.

At the distributor, operational work begins by measuring whether customers can complete a valid change and whether it reaches the warehouse and driver correctly. Page speed alone would miss most of the promise.

Someone must remain responsible for questioning the target. A faster process can make the wrong decision sooner. A lower infrastructure bill can introduce an unacceptable delay. People need the authority to stop an assignment or revise its purpose.

The business can delegate work while retaining accountability for the result. Buying the software and employing an agent both require that distinction.

## Cheaper Change Reopens Old Decisions

If change becomes less expensive, some decisions about what to buy, build, or leave alone deserve another look.

A small integration may once have cost too much to justify. A useful service variation may have been rejected because the standard product could not support it. Lower development costs could make either worth reconsidering.

The estimate still has to cover the whole obligation.

Osmani’s explanation of [cost per task](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/) shows how repeated attempts, context, caching, and reasoning effort affect the cost of completed work. A cheaper interaction can produce a more expensive assignment when it creates another cycle of investigation and repair.

In [The Cost of a Finished Job](https://tedt.org/The-Cost-of-a-Finished-Job/), I argued for including human review, support, rework, and failure costs in the accepted outcome. That remains the useful boundary. For a build-or-buy decision, I would also include the cost of keeping the capability useful and eventually replacing it.

The economics continue after the code runs. Willison argues for [hard spending limits](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/) because agents make it easier to create systems that consume paid services. A notification received while someone sleeps does not stop the expenditure. Limits and stop behavior belong in the design of unattended work.

There are more surprising possibilities. Developer Popcar’s October [commentary on game decompilation](https://popcar.bearblog.dev/ai-is-mass-decompiling-games-thats-both-awesome-and-scary/) points to AI-assisted efforts to recover and port older games. The examples raise questions about preservation and the cost of reconstructing software with overwhelming amounts of technical debt.

An old application contains behavior people rely on, sometimes for reasons its documentation no longer explains. AI may help recover that understanding. The company still has to decide what to preserve and prove that the replacement does so.

There is a useful competitive question underneath these decisions. If implementing a familiar feature becomes easier for us, it may become easier for competitors too. I would be cautious about treating possession of the code as the lasting advantage. The ability to understand a customer need, change the service safely, and learn from the result is harder to do than to customize the code or modernize the process.

Use shared products where they serve the business well. Put deliberate engineering effort into the capabilities that matter to how the business competes. Budget for their continued care.

## The Team Has to Keep Learning

This argument depends on human judgment. That judgment needs somewhere to grow.  Which means that the team must humbly accept that what they know today is incomplete, inaccurate, and incorrect.  Otherwise that ongoing learning opportunity will never materalize.

Anthropic’s October [study of employment inside the company](https://www.anthropic.com/research/employment-at-anthropic) describes employees spending more effort managing agents and hiring managers emphasizing autonomy and judgment. It also documents a declining share of junior technical hiring. This is one company undergoing rapid growth and intensive AI adoption. Its experience gives us a case to examine, with clear limits on conclusions about employment elsewhere.

The apprenticeship question is: How will people gain the necessary understanding of the system and its boundaries when the AI generates implementations before they have explored the problem themselves?  Small defects taught people where system boundaries were. Routine features exposed younger developers to the tribal knowledge about the system. Explaining a change to a colleague revealed gaps in that understanding.

How will people acquire that understanding when an implementation arrives before they have worked through the problem?

The solution to this is to use development methodologies that already solve for this kind of learning.  Look at Mob programming, where the team rotates through roles and everyone gets exposure to the problem-solving process. This ensures that knowledge is shared and that learning is embedded in the workflow.  Look at XP (Extreme Programming), which emphasizes pair programming, collective code ownership, and continuous feedback. These practices create structured opportunities for learning and knowledge transfer within the team.

If you adopt these methodologies, you will provide the newer engineers the opportunities to explain generated systems, investigate failures, write independent scenarios, and defend architectural choices.  They will also get to work directly with the code while having someone guide them.  You are trying to pair them with people who can distinguish a convincing explanation from an adequate one.

This takes an active decision to prioritize learning over immediate being busy. A person learning to diagnose an agent’s failure while the whole mob watches and teach them the process may seem like even a slower immediate cycle.  However, this is a deliberate and sound investment in the team’s ability to maintain the service next year, and grow the culture of the team past the current generation of engineers.

Experienced people need protection too. A senior engineer can become the destination for every unresolved question. Adding agents can overload that person even as a dashboard reports more and more completed work.  Having a team of people who that senior engineer can work with to share the load and distribute knowledge helps prevent burnout and ensures that critical understanding is not concentrated in a single individual.

The same problem reaches the project manager who understands unusual deliveries. Turning their knowledge into instructions should make it available to the team and help successors learn it. Otherwise the business risks depending on a person and a growing collection of rules that nobody else understands.

In [Beyond the Mirror](https://tedt.org/Beyond-the-Mirror/), I argued that people need a meaningful part in shaping the work and sharing in its gains. Here that means influence over the development machinery, time to understand its failures, and a sustainable limit on the attention it demands.

A business that needs software must retain a full team that has the ability to know how that software works. Maintaining that ability includes developing the people who will exercise it.

I should also point out, that this is the responsibility of the whole team.  Everyone's role includes contributing to the shared understanding, mentoring newer members, and ensuring that critical knowledge is not siloed in a single individual.  This means that everyone learns from everyone else.  This isn't a call for more specializatoin, but for a culture of collective cross-pollination and knowledge sharing.  

## Start With One Recurring Correction

Much of this rests on going back to achievements from earlier eras of software development. Written requirements, automated tests, paired programming, team accountability, isolated environments, and feedback from production remain useful foundations. Their age tells us little about whether a particular practice still serves the work.

What is changing is the division of responsibility. We can increasingly give a system an objective and let it investigate, choose intermediate actions, and propose an implementation. Its behavior depends partly on instructions and context that can produce different results across runs. The method around it needs continuing evaluation.

I would begin with one recurring class of change in a business capability people understand. It might involve a purchased platform and a small integration. It might involve an application the company has maintained for years.

Agree on the improvement customers or employees should experience. Establish what an acceptable result looks like and what today’s method costs in elapsed time, money, attention, and repair. Include the work people do while waiting for the software to catch up.

Then find a correction an experienced person keeps making. Decide whether it belongs in a specification, available context, an executable check, or a decision that should continue to require a person. Try the revised method on representative work, including awkward cases. Keep failed attempts in the account.

Give someone responsibility for maintaining the instruction or check. Make it possible to revise or remove it. See whether the next change requires less rediscovery and repair, and whether the resulting service actually improves.

That is a practical place to begin, regardless of whether software appears on the company’s invoices.

For the customer changing tomorrow’s delivery, the test is simple: Does the company keep its new promise?

A competitor can buy the same scheduling product. The difference can come from how well your business understands the delivery and how reliably it turns that understanding into service. Maintaining that ability is part of running the business. The responsibility lasts as long as the promise does.
