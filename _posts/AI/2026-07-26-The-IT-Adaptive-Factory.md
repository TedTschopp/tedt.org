---
layout: post

title: "The IT Adaptive Factory"
date: 2026-07-26 00:00:00 -0700
update: 2026-07-26 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

description: "An AI-driven IT factory is where those arguments become an operating model."

categories:
  - AI
  - Enterprise Architecture
  - Leadership
  - Opinion

tags:
  - ai-driven software development
  - adaptive IT factory
  - AI maturity model
  - software engineering
  - technical debt
  - operating model
  - engineering leadership
  - AI governance

image: "/img/2026-07/AI-driven-IT-Factory.webp"
image-alt: "An automated industrial factory floor with people overseeing robotic machinery and digital systems, representing an AI-driven software delivery environment."
image-title: "The IT Adaptive Factory"
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org/
image-credits: "Ted Tschopp"
image-credits-URL: https://tedt.org/
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: https://tedt.org/
---


## How an AI-driven IT Factory Grows Up

Overnight an automated system that is scanning all your code for security problems identifies a newly disclosed vulnerability.  The artificial intelligence system immediately generates a fix, opens a pull request, and notifies the relevant team members.  This patch, which addresses the vulnerability, is ready for review before anyone has had their morning coffee.

Forty-seven files changed. Those changes are in the authenticaion service, the shared library where the user roles are defined, and an old deployment script.  The agent even created a test harness to verify the changes.  Documentation was updated automatically as well.  

When the team gets in, they find that much of the work has already been done. The automated system has prepared the code for review, run initial tests, and updated the documentation.

Except the team has not modernized their code base.  The automated system followed industry best practices, but the team had not kept up.  They had always been meaning to refactor and update their code, but it had never gotten to be a priority above day-to-day firefighting and product owner needs.  They don't have a devops pipeline.  The testing is done by another team.  And because this is a change in how users are logging in and roles are applied to the system the impact ripples through multiple layers, requiring careful coordination and review by the whole development team.  

The team is stuck, you see that vulnerability is a zero day exploit that is actively being used in the wild, and their system, their users, and their company is vulnerable. The urgency is palpable, yet the path forward is obstructed by the very technical debt and organizational constraints that have accumulated over time. The tension between immediate security needs and long-term modernization goals creates a high-stakes environment where every decision carries significant risk.

Now if this were a one off, every one in a while problem, the team could manage this with crunch (Crunch refers to a period of intense work, often involving long hours and high pressure, typically used to meet a critical deadline.).

But we are now entering into an era where this will become a frequent and unavoidable challenge, requiring organizations to rethink how they manage both immediate security threats and long-term technical debt.

Organizations will need to figure out how to offensively use AI to not only address immediate security threats but also to proactively manage and reduce technical debt over time.

This scene tells us more about the limitations of AI in isolation. AI removes one constraint and exposes the next one. The queue moves from typing to task definition, then to review, integration, specification, and eventually governance.  While AI can handle specific tasks efficiently, the broader context of technical debt, organizational processes, and coordination requirements still dictates the overall pace and effectiveness of software delivery that organizations must use AI to buy down quickly.  

I approached the same problem from two directions in [Running to Stay Put][1] and [Beyond the Light Bulb][6]. The first article looked at the Red Queen problem: a company can invest heavily, improve locally, and still remain in the same relative position because the same capabilities spread across the market. The second looked at the light-bulb stage of adoption, where AI is added to existing work while the shape of the work stays mostly intact.

An AI-driven IT factory is where those arguments become an operating model. The model is one component. The factory includes the work request, repository, build system, tests, release path, permissions, logs, governance, rollback, and the people who decide what may ship.

The factory metaphor emphasizes that software delivery is a complex, interconnected system where each component must function correctly for the whole to succeed. AI can optimize individual tasks, but the overall efficiency depends on how well the organization integrates AI into its broader processes and governance structures.

This maturity guide uses a Level 0 foundation with five steps above it. It measures how much implementation responsibility the organization can hand to AI while keeping ownership of the outcome. Human work moves away from direct code production and toward direction, specification, evaluation, exception handling, and control. Each step trades one bottleneck for another.

## Artisanal Software Development

If you are coming to this article from the point of view of a developer accustomed to artisanal software development, the transition to an AI-driven IT factory may seem antitechtical on one hand or both exciting and daunting. You are used to having direct control over every line of code, every design decision, and every deployment. The idea of delegating significant portions of this work to AI can feel like relinquishing control, even as it promises to accelerate delivery and reduce repetitive tasks.

The IT industry is not a religious organization, cult, or unchanging guild.  It is a place where value is created using the latest techniques and approaches.  Many of us no longer program solutions using 1's and 0's.  Many of us no longer write in assembly.  Many of us no longer write in C or Cobol.  Many of us now rely on higher-level languages, frameworks, and deterministic knowledge graphs to do activities like auto complete.  

I have said a lot about this already in another article titled [Artisanal Software Craftsman][7].  I will not be addressing this transition here.  But it is important to recognize that the shift from artisanal development to an AI-driven IT factory involves changes in mindset, processes, and the role of human developers.

## The First Steps Still Look like Ordinary Coding

### Level 0: Spicy Autocomplete

Level 0 is called spicy autocomplete. The name is funny because it is accurate. The developer writes the software, and the AI predicts a line, a block, or a familiar function. It saves keystrokes. It can also create the feeling that the whole delivery system has accelerated when only the typing has changed.

A team can measure this badly. It can count accepted suggestions, generated lines, or hours that developers believe they saved. None of those numbers tells us whether lead time fell, whether review became easier, or whether production defects changed. A developer may finish a function twelve minutes earlier and then wait four days for an environment.

Level 0 works when developers treat every suggestion as untrusted code. They understand it, run local checks, and review it in proportion to the risk. A team is ready to move when developers can describe the likely solution before asking for one and can explain the code after accepting it.

### Level 1: Coding Intern

Level 1 turns the assistant into a coding intern. The developer can delegate a bounded task: add a validation rule, write a unit test, refactor one module, or fix a narrow defect. The developer supplies the architecture and stays close to the result.

The quality of the request begins to matter here. “Clean up this service” gives the machine room to guess. “Remove the duplicate date conversion in these two methods, preserve the public interface, and run these four tests” gives it a job.

The most common Level 1 failure is quiet expansion. A small task spreads into unrelated files because the agent found a locally convenient path. The diff still looks plausible. The tests may even confirm the assumptions used to write the code. The reviewer has to ask whether the test proves the requested behavior, not whether the generated implementation agrees with itself.

Level 1 reduces more typing.  The developer still has to do everything else they use to do manually.

## Move the Queue to the Reviewers

### Level 2: Junior Developer

Level 2 lets the AI navigate a repository and make a change across several modules. It can follow dependencies, update tests, and assemble a feature that no longer fits inside one file.

The productivity story becomes uncomfortable here, as it did in the introductory story.

Suppose an agent finishes in forty minutes what used to take a developer two days. The pull request touches thirty-seven files. The senior engineer who understands the service boundary needs most of a day to review it. A second reviewer checks security assumptions. The test team finds that the new code works in isolation and breaks a downstream batch process.

The forty-minute implementation consumed a day of senior review and another test cycle.

Review capacity becomes the scarce resource. Senior engineers can turn into permanent inspection stations for machine-produced work. Pull requests get larger because generation is cheap. Approvals get thinner because attention is expensive. Architecture starts to erode through small, reasonable-looking decisions: a new cross-module import, a copied rule, an internal type leaking through a public interface.

The guardrails against this behavior are that a Level 2 repository has clear architectural boundaries within the software itself, tests at service or feature edges, and automated checks that catch security and maintainability problems before a person opens the pull request. The reviewers still need enough system knowledge to spot a change that compiles cleanly while violating the design.

Another way to say this is a robust software architecture plan that is well-documented, consistently enforced, and supported by automated checks to ensure compliance throughout the development process.  Most internally developed products do not have this as they rely on the tribal knowledge of the team working on the product.  

A team should stay at Level 2 when its senior engineers are already buried.  A good way to determine if a teams senior engineers are overwhelmed is to see if they are spending most of their time doing quality reviews instead of designing and guiding the overall architecture. Another key indicator is to measure the number of products an individual senior engineer is responsible for.   If you find that senior engineers are consistently overloaded, it is a sign that the team can not move beyond Level 2.  Giving the agent larger work items will create larger review debt.

Most organizations, product teams, and engineering groups I am familiar with will find themselves operating at Level 2 only on the best of days until senior leadership within the company does something to address this.

## Change the Developer’s Job

### Level 3: Developer

Level 3 is the management turn. The agent receives a feature-sized work item and returns a pull request or completed work package. The developer directs the work, reviews the evidence, and decides whether to accept it, reject it, or send it back.

That last option matters. Generated work has almost no emotional claim on the team. A person may feel awkward discarding another person’s week of effort. There is no reason to preserve an agent’s afternoon because it used a lot of tokens. Bad work should be deleted without ceremony.

This pull request becomes the unit of management at this level. A useful one carries the original request, an implementation summary, the unit, contract / integration, ui/usability tests that ran (and their results), known limits on the non-functional requirements, and any architecture or security decision that changed. Reviewers need to judge feature behavior and system impact. Line-by-line reading remains available for code that carries unusual risk, but it cannot be the only control.

This means that your AI agent needs to do more than just generate code. It must understand the context of the request, follow the architectural guidelines, write and run the necessary tests, and provide evidence of compliance with non-functional requirements.

Accountability gets slippery here. “The agent wrote it” explains the source of the requested change. It does not identify the owner. The person who approves the change owns the accepted behavior, and the product team owns what happens after release.

The surrounding agent system now matters as much as the model. Repository permissions, branch rules, test commands, tool access, time limits, and stop conditions live in the harness and delivery platform. I explored that larger system in [The AI Value Stream][2].

The challenge you will have with level 3 is: how many people on the product team can properly review and manage pull requests today?  How many can effectively make architectural decisions and enforce design consistency?  How many can balance the immediate feature needs with long-term system health?  How many can know when to accept work and reject it?  How many can understand the full context and implications of the changes being proposed?  The teams that succeed at level 3 are those who freed up their Lead Engineers in the previous step and who turned all their product team members into capable reviewers and managers of generated work.

Level 3 is stable only when feature requests have written acceptance criteria, the pipeline catches common agent errors, rollback remains practical, and rejection is a normal engineering outcome.

## Make the Specifications Executable

### Level 4: Engineering Team

Level 4 changes the primary artifact. The human writes the specification. The AI performs the implementation. The team evaluates the result through behavior, evidence, and operating limits.

A vague user story is dangerous here. Consider the request, “Let customers change their mailing address.” A human team can fill in missing details through conversation and habit. An agent will also fill in the missing details, but it may choose answers by surveying all its training data and picking the most common path through the problem.  A path that doesn't differentiate between similar but distinct cases.  A path that ignores edge cases and unique business rules.  In other words a path that may satisfy the letter of the request but fail to meet business need.

A usable specification has to say who may request the change, which addresses are allowed, what records must stay synchronized, how identity is verified, which notices are required, what happens during an outage, and how the change is reversed. It also has to state what the new capability must leave alone. Those details used to live in meetings, old tickets, experienced people’s memories, and code review comments. Level 4 forces them into the work request.

The controls move earlier. Scenario tests are written before implementation. Edge cases are chosen before the builder sees the evaluation set. External systems are represented by sandboxes, mocks, simulators, or test tenants. The release evidence shows why the team accepted the outcome.

Visible tests are insufficient on their own. An agent can optimize for them and still miss the customer need. A test that checks whether a database row changed may pass while the notification, downstream billing update, or authorization rule is wrong. Holdout scenarios help because the builder cannot tailor the implementation to every check it will face.

I have observed that teams often underestimate the effort required to produce a truly executable specification. It is not enough to write down the desired behavior; one must also anticipate the edge cases, define the evaluation criteria, and ensure that the necessary test infrastructure is in place before implementation begins.  I have written on this topic in [How to Communicate in a World of AI][5].

The effort required to produce an executable specification is non-trivial and often underestimated.  It will require that the product team work with their product owner and the team that supports them in their day to day job in the business to get all their subject matter experts up to speed on how to communicate an effective set of needs. The product team's sphere of influence and transformation now extends into the business.

By Level 4, weak requirements become deployed defects, therefore they must be governed before they even get into the IT system. Specification quality and evaluation quality set the ceiling for delivery quality.

## A Production System

### Level 5: Dark Factory

A dark factory is a manufacturing facility that can operate without continuous human presence, relying on automation, robotics, sensors, artificial intelligence, and autonomous control systems to produce goods.

A dark IT Factory is an IT delivery environment that functions like a dark factory producing physical goods. Humans primarily define business intent, establish governance, review exceptions, and improve the platform rather than manually performing each development task.  A specification enters the factory. Agents plan the work, change code in an isolated environment, run tests, face scenario checks, and prepare a release. Policy gates decide whether the change can move. Production telemetry watches the result. The system retains enough evidence to reconstruct what the agents saw, which tools they used, what checks passed, who authorized the release, and what happened afterward.

This level requires narrow boundaries. The factory needs a named set of repositories, systems, product areas, and release types. It needs a list of people or systems allowed to submit work. Every external dependency needs containment. Automatic stop conditions have to be explicit. Release approval and rollback paths have to work under pressure. Quality, cost, latency, failures, and incidents need continuous monitoring.

The main risk is loss of trust. One unexplained production incident can discredit the entire approach. Weak specifications that are accepted accumulate as a new kind of technical debt. Missing scenarios hide risk until the factory meets a case nobody modeled. Broad permissions can turn a coding error into a customer or data incident. Unbounded runs can burn money while producing duplicate work. The temptation to leaders in the organization is that they will want to hollow out its own technical bench leading to circumstances where too few people still understand how the factory produces the product and how it behaves.

A Level 5 factory has to keep proving that it builds the intended thing, stops at the right boundary, leaves an audit trail, and can be disabled or rolled back. People still need to understand the product and its failure modes.

That idea is the practical side of [Making AI Boring on Purpose][3]. A normal factory run should be uneventful. The work enters through a known door, follows a controlled path, and leaves evidence behind. Nobody should need a heroic engineer to explain why the release happened.

## Dealing with Legacy Systems

The maturity model is clean on paper. Enterprise software is rarely clean.  So what do you do when faced with a legacy system that does not fit neatly into the levels?

An old application may have a requirements document, but its actual specification is scattered across stored procedures, configuration tables, production data, support tickets, release scripts, and the memory of the person everyone calls when month-end processing fails.

That system cannot jump to Level 4 because a coding agent can read whats in the repository. The organization first has to recover what the system does and document it.  Completely.  AI can help trace code paths, summarize dependencies, compare documentation with behavior, and propose tests.   It may even be able to write all that down someplace for referencing later.  But the work still needs maintainers and product owners who can tell the difference between an accidental quirk of their system, a mistake made by the AI and a business rule that customers depend on.

For most brownfield systems, I would use Levels 1 and 2 for bounded maintenance and software archaeology. Teams can document observed behavior and build scenario tests around it. New components can move toward Levels 3 and 4 once their boundaries are understood. Level 5 belongs in contained areas where rollback is real and the evidence is strong.

This part will feel slow because it is slow. Fifteen years of allowing teams to proceed with exceptions from standards do not become a specification after one repository scan.  You have 15 years of accumulated decisions and work to dig youself out from under.  All the while while trying to [catch up with the new system][1]. A model can generate a new service in an afternoon. Recovering the decisions buried in the old one takes longer.

## Changing the Apprenticeship

The maturity guide changes roles before it removes them. That distinction matters because software organizations have always developed judgment through work.

A junior developer used to learn by fixing defects, writing small features, and having a senior engineer explain what was wrong. When an agent takes much of that work, the junior still needs practice. The apprenticeship has to include task framing, review, debugging, test interpretation, system behavior, and the ability to explain generated code.

Senior engineers spend less time producing routine implementations and more time deciding what should exist, where the boundaries belong, and what evidence is enough. Testing specialists on the team design scenarios that a builder cannot easily game. DevOps and SRE specialists on the team own containment, permissions, rollback, cost controls, and runtime safety. Product Owners become specification owners. Architects design where autonomy is allowed and how responsibility moves through the system.

I made the broader people argument in [AI Is a People Change][4]. The factory will fail if the organization treats people as spare parts and assumes judgment will somehow replenish itself.

The apprenticeship question should be part of the architecture for the product.  Who learns to debug the system when routine debugging is automated? Where do people practice judgment before they receive authority? How does an expert turn tacit knowledge into rules, examples, and exception paths that others can use?

A factory that produces software faster than it produces people who understand the software is like ripe fruit on the vine, its good for today, but tomorrow it spoils.

## Focusing on the Right Level

Maturity models become dangerous when leaders turn them into scoreboards. A company declares itself Level 3. A business unit sets Level 5 as a target. A vendor delivers proof that it is a level 4 provider that can do the work.  Everyone is ready.  This is missing the point.

I have little patience for an enterprise maturity score with a decimal point. The guide gives a simpler rule: record the lowest level that describes the normal way the team works. Track it by product, repository, workflow, or team. Do not average a Level 4 digital service and a Level 0 legacy system into a corporate score with a decimal point. The number would look precise and explain very little.

A team should look at where they are at and their weaknesses.  Work on getting good at the areas where they are weak.  If they encounter a situation where review is weak, tests do not prove behavior, system boundaries are unclear, or nobody can name the owner of generated behavior.  Then stop and get better.  High production risk, uncertain costs, and weak security controls are also good reasons to wait and get better. The right target is the highest level the operating model can the team and the organization can support.

When doing a review I ask what level describes ordinary work, what evidence shows it is working, and where the queue moved after AI arrived. I would ask what breaks if generated-code volume doubles. I would ask who owns a failed change, how rollback works, and how junior engineers are gaining judgment. Those questions are less exciting than a demo. They are much closer to production.

## Testing the Factory

[The Red Queen part of this problem][1] is unforgiving.  Coding models keep improving.  They are now at the point where they are better then humans at finding security problems you find in the smallest of businesses all the way to largest enterprises.  This means that in order to even stay put, you need to be at level 3 to address the security patches you will need to refactor into your products.  The timeline to get to that level is measured in months.  This pace of patching will only increase as the models and cheaper.  Up until now the only organizations that could afford to run these systems are large global enterprises, but today an advanced coding model can be run on hardware that will cost you under $200,000.  This puts this within reach of 15% of the worlds population.  

But this also means you don't need to be a large global enterprise to leverage advanced coding models for patching software.  Even the smallest organization can access these global models at a price of $40 a month per user to strengthen their approach.  

My bet is that the durable organizations will build out a version of this factory model above.  They will have a competitive advantage, and the difference will sit in the factory: the accumulated specifications, scenario libraries, system boundaries, permissions, release evidence, rollback paths, and operating history. Those assets let a company replace one model with another, replay known cases, compare results, and keep the process under control.

### A Final Thought on the Factory

A new model can improve the engine. It cannot supply a missing owner, recover an undocumented business rule, or decide how much risk the organization is willing to accept.

When the next generation of coding agents arrives, one group will announce another pilot. The other will connect it to a factory that already knows how to judge the work.

## Next Week

I will cover how this model applies to other areas of enterprise AI adoption.

[1]: https://tedt.org/Running-to-stay-put-the-Red-Queen-problem-in-enterprise-AI/ "Running to Stay Put"
[2]: https://tedt.org/AI-Value-Stream/ "The AI Value Stream: Why the System Matters More Than the Model"
[3]: https://tedt.org/Make-AI-Boring/ "Making AI Boring on Purpose"
[4]: https://tedt.org/AI-Is-a-People-Change/ "AI Is a People Change, Not Just a Technology Change"
[5]: https://tedt.org/How-to-Communicate-in-a-World-of-AI/ "How to Communicate in a World of AI"
[6]: https://tedt.org/Beyond-the-Light-Bulb/ "Beyond the Light Bulb"
[7]: https://tedt.org/Artisanal-Software-Craftsman/ "The Artisanal Software Craftsman"
