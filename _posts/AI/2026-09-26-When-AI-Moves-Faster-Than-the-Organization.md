---
layout: post

title: "When AI Moves Faster Than the Organization"
subtitle: "Why capability belongs to the whole system and plans need evidence"
excerpt: "We should evaluate the capability of the organization we are assembling around AI, including the people who remain responsible for its work."
source: "Original Content"

date: 2026-09-26 00:00:00 -0700

author: { avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g", name: "Ted Tschopp", url: "https://tedt.org/" }

description: "We should evaluate the capability of the organization we are assembling around AI, including the people who remain responsible for its work."

categories:
- AI
- Business
- Enterprise Architecture
- Leadership

tags:
- enterprise AI
- agentic AI
- collective intelligence
- operating model
- scenario planning
- AI governance
- value stream
- evidence-based evaluation

image: "/img/2026-09/Lego-cat-story.webp"
image-alt: "A Lego cat-building project illustrating collaboration, learning, and progress."
image-title: "When AI Moves Faster Than the Organization"
image_width: 1672
image_height: 941
---

My daughter Hannah saved for months to buy a Lego Tuxedo Cat. When it arrived, she had the pieces, the instructions, and a great deal of enthusiasm. She also discovered that a complicated model could ask more of her than she had expected.

She turned to her brother and sister and me for help. We had built similar models before. Our experience gave her another way to approach the work, and her confidence grew as she learned. I [wrote about that experience](https://tedt.org/Building-a-Lego-Cat/) as a lesson in helping people through change.

Lately, I have been thinking about it as a lesson in how we recognize progress.

You could count pieces handled, pages read, or the number of people helping. Each might tell you something useful. None would establish that the next assembly fit where it belonged. For that, you would have to look at what was being built.

That distinction is becoming important in enterprise AI. We are acquiring more capable models, giving them tools, and arranging them into teams. We need to understand what the resulting organization can accomplish, where its work gets stuck, and what evidence should cause us to change the plan.

The paper [*From AGI to ASI*](https://arxiv.org/abs/2606.12683v2), by Tim Genewein and colleagues, gives us a reason to examine those questions. It considers how artificial general intelligence might develop beyond human-level performance. Its definition of superintelligence is demanding: a system whose cognitive abilities exceed those of large groups of human experts across virtually all domains.

Among its possible pathways is collective intelligence. Many coordinated AI agents might achieve capabilities beyond those of any individual member. The authors also examine scaling, algorithmic change, and recursive improvement. These pathways could interact. They remain uncertain, and the paper does not establish an inevitable transition or a reliable arrival date.

For an enterprise architect, the collective possibility has an immediate implication. We should evaluate the capability of the organization we are assembling around AI, including the people who remain responsible for its work.

## Capability belongs to the working system

A model can answer a question about a supplier. A working procurement system must establish which supplier we mean, retrieve the relevant records, recognize a conflict in those records, apply the right policy from the document desk procedures, and leave evidence someone can examine and audit.  You may also need to stop, find the right person, and ask that person to resolve a disagreement.

It's that information, documented, repeatable, and measured, in the system, that enables the system to work effectively.

All of this applies when you add AI agents to the mix, except now you also have to make all that information available to them in a usable format as well.  Giving one agent research, another analysis, and a third review creates a division of labor. Whether that division helps depends on the task, the information they share, and how their results are reconciled. Three agents repeating the same unsupported assumption have given us three versions of the same problem.

The DeepMind Institute essay [*Artificial Symbiotic Intelligence*](https://institute.deepmind.com/essays/artificial-symbiotic-intelligence/) develops this institutional view. Its authors argue that capability may emerge through arrangements of models, tools, people, and governing structures. It is a conceptual argument about a possible future. We still need experiments that show which arrangements work.

There is relevant empirical evidence. [*Towards a Science of Scaling Agent Systems*](https://arxiv.org/abs/2512.08296v3) examines 260 configurations across six benchmarks. Relative to single-agent baselines, results range from an 80.8 percent improvement on decomposable financial reasoning to a 70 percent decline on sequential planning. Those findings apply to the tested systems and tasks. They demonstrate why adding agents requires an architectural decision about the work.

I would therefore ask a team proposing an agent workforce to show its dependencies. All of them.  They need to demonstrate which tasks can proceed independently.  Where must one result be correct before the next action begins?  What happens when two agents disagree? Who can tell whether the final answer rests on evidence or on repeated agreement?

These questions give us something concrete to design. They also give us something to test when a new model arrives and changes things.  A stronger model may make a particular review step unnecessary, or expose a weakness elsewhere. We need to know which happened.

## Be precise about what improved

AI discussions that I participate in compress several changes into the word “better.” That makes it difficult to decide what to fund or authorize. I would keep four questions visible.

**Throughput** asks how much acceptable work the system completes in a given period. Producing more drafts can help, but we also need to count how many become usable results and how long they wait along the way.

**Intelligence** asks whether the system can handle harder or unfamiliar problems. Completing more examples of a familiar task does not, by itself, demonstrate that broader capability.

**Autonomy** asks how much work the system can carry without intervention. That requires recording the help it receives, including corrections and cleanup after it reports completion. The authority we grant it remains a separate decision.

**Business value** asks what changed for the organization and the people it serves. Lower cost, shorter waits, fewer errors, or a service that becomes possible for the first time can all matter. Their importance depends on the purpose of the work.

The distinction is visible in NVIDIA's recent [SoL-Pi research](https://arxiv.org/abs/2609.20519). On its 51-task EdgeBench evaluation, the researchers report comparable performance to the Pi coding harness while reducing recorded token traffic by roughly 45 to 49 percent and API cost by about a third. The improvements came from the surrounding execution system. That is evidence of greater efficiency under the reported conditions. It does not establish a corresponding increase in general intelligence or savings across every business workflow.

A team could make a worthwhile investment on exactly that basis. We do not need to turn every efficiency gain into a claim about workforce replacement, general intelligence, or superintelligence to justify it.

In [*The Cost of a Finished Job*](https://tedt.org/The-Cost-of-a-Finished-Job/), I argued for measuring cost per accepted outcome. That measure includes the work people perform around the machine: review, correction, support, and recovery. It also forces us to define acceptance before we celebrate production.

If two configurations finish the same work at the same quality, and one requires less money and less supervision, we have learned something useful. If one handles previously unsolvable cases but costs more, we have learned something different. A single adoption score would hide the decision we need to make.

## Follow the work to its next constraint

Once a task becomes faster, the rest of the process receives its output sooner. That can shorten delivery. It can also create a queue somewhere else.

Anthropic provides a concrete example in its September 14, 2026 account of [agentic coding straining continuous integration](https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic). The company reports a 25-fold increase in CI jobs over six months. Its service for selecting relevant tests struggled to keep up. Three successive fixes lasted 70 days, 29 days, and less than a day before the team moved to a more scalable design.

This is Anthropic reporting on its own environment. Its growth rate is not a forecast for every engineering organization. But the account illustrates a failure mode worth testing for: accelerated production can overwhelm the machinery used to establish whether the work is ready.

The responses also cost more to operate. Solving a bottleneck can improve the service while increasing expenses. We need to measure the whole result before declaring either success or waste.

For people who work in companies that have a robust physical component to their value stream, such as the utility I work for, this is easy to recognize. An AI system might prepare an engineering planning package faster. Components still have to be manufactured and delivered. A crew still needs access to the site. The heavy equiptment to do the work, still needs to routed to the work location.  And someone still has to establish that the work can proceed safely. Improved analysis can help with those constraints, but generating the analysis does not move the atoms around in the real world, nor create complete the actual change in reality.

Some delays deserve to be removed. Others contain essential steps that need to remain to ensure safety and to allow for human judgement in order to avoid a consequential mistake. Calling every delay “friction” makes it too easy to treat them as interchangeable.

The people with boots on the ground will help you distinguish between them. They know when an approval catches a real issue and when it merely sends the same information to another inbox. They also know which unofficial repair keeps a supposedly automated process running.

I explored this movement of scarce work in [*When Output Becomes Abundant*](https://tedt.org/When-Output-Becomes-Abundant/). The practical next step for almost every organization I have observed is to make all of this more visible. Measure time spent working, waiting, reviewing, and repairing. Follow a sample of jobs until the intended outcome occurs. Include the cases that fail, get abandoned, or return later with a problem.

Otherwise, an impressive productivity gain in one department can become an unmeasured burden in another.  All too often, I have seen cases where someone wants to automate a task to benefit some local maximum while negatively impacting the enterprise as a whlie.  In such situations, the costs and delays shift and potentially multiply rather than disappear, creating friction that can undermine the overall efficiency of the organization.

## Give each scenario evidence that could change it

This is where scenario planning becomes useful. An organization needs several plausible accounts of how its work could change with the introduction of AI, with observations that would help distinguish between them.

Suppose model capability improves slowly, while lower costs and better tooling make familiar tasks economical to automate. That future favors careful workflow engineering. We would look for stable quality at lower total cost and sustained reductions in human effort.

Suppose coordinated systems begin completing longer, more difficult assignments reliably. That future could justify changes to roles and delegated responsibility. We would need evidence from complete assignments, including exceptions, recovery, and performance on work that differs from the examples used to tune the system.

Suppose generation accelerates while verification, integration, or physical delivery remains constrained. That future calls for investment in the limiting stages. Rising queues, older unfinished work, repeated corrections, and delayed customer outcomes would be signals to investigate.

These possibilities can coexist. Software maintenance, procurement, and field engineering may develop at different rates inside the same company. An enterprise-wide label for AI maturity would conceal those differences.

Each scenario should connect to a decision. What would persuade us to expand delegation? What would cause us to invest in testing capacity? What result would tell us to stop adding agents and simplify the workflow? Which commitment would be expensive to reverse if our assumptions proved wrong?

Set thresholds before the pilot. A team should agree on acceptable quality, cost, intervention, and recovery requirements while it can still discuss them without defending a rollout. The thresholds will differ by class of work and consequence.

In [*How Much Work Can Your AI Safely Own?*](https://tedt.org/How-Much-Work-Can-Your-AI-Safely-Own/), I distinguished capability, evidence, and authority. Demonstrated ability contributes to a decision about responsibility. It does not make that decision for us.

## Collect evidence that can survive a change of mind

So how would you begin; I would begin with one important class of work and its current baseline. Record the time, cost, quality, and human effort required today. Then compare the proposed AI arrangement on representative cases, including difficult exceptions.

Keep the model version, instructions, tools, permissions, and relevant data changes with the results. If several of those change together, be careful about attributing the improvement to one of them. Preserve failed attempts and escalations alongside successes, with access and retention appropriate to the information involved. If you do not track that information, or you fail to account for this, you will not have a reliable basis for evaluating progress.

This also means you should track the consequences after acceptance too. A support case that reopens, a code change that requires repair, or a document that creates confusion downstream is a type of failure that belongs in the evaluation. The reporting boundary should follow the processes already established lines of responsibility starting with the customers request all the way to the customer getting their need answered.  In other words, the full and complete Value Stream should be considered when evaluating the impact of AI on work.

This evidence collection needs an owner and a place in ordinary operations. The development team that's building the solution needs to have access to it.  The operational teams that are supporting the technology need to have access to it.  Every relevant team should review it often enough to act before a growing queue or recurring error becomes normal. Material changes to the model, workflow, or workload should trigger another look at the assumptions behind the plan.

The purpose is to make changing course less expensive. We should be able to discover that one agent works better than five, that a stronger model earns its higher price, or that an apparently successful automation moved too much work onto someone else. Each finding should have a route into a decision.

The part of Hannah's Lego project I keep returning to is her willingness to change how she approached it. The instructions were available from the beginning. Progress also involved recognizing when help would be useful and learning how to use the experience around her.

There are limits to the comparison. A Lego set comes with a known design. An enterprise adopting AI is still discovering some of what it can build. That makes it even more important to examine the work as it takes shape and to preserve what we learn.

Hannah had saved for a cat she wanted to build. My help mattered because it supported that purpose and her growing ability to carry it forward. When we decide how to organize AI at work, I want us to keep an equally clear view of the people we are helping, the outcome they need, and the evidence that we are getting closer to it.
