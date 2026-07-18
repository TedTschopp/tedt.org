---
layout: post

title: "Running to Stay Put"
subtitle: "The Red Queen Problem in Enterprise AI"
date: 2026-07-18 00:00:00 -0700
update: 2026-07-18 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

description: "An enterprise architecture view of Red Queen dynamics in AI portfolios, why pilots often lag economics, and how process authority, measurement, and governance change the outcome."
seo-description: "A Red Queen framing for enterprise AI: why common tools can raise activity without changing relative position, and how process integration, governance, and outcome measurement create durable value."

categories:
  - AI
  - Enterprise Architecture
  - Business
  - Opinion

tags:
  - enterprise ai
  - red queen syndrome
  - ai governance
  - ai operating model
  - ai portfolio management
  - workflow redesign
  - ai agents
  - model evaluation

image: "/img/2026-07/Chasing-the-Red-Queen.webp"
image-alt: "A red queen chess-piece figure and a suited executive running across a chessboard cityscape with motion-blurred buildings and storm clouds."
image-title: "Chasing the Red Queen"
image-description: "A dramatic scene of a red queen chess-piece figure and a suited executive running across a large chessboard toward a stormy city skyline, with motion-blurred buildings suggesting speed, pressure, and competitive acceleration."
image-artist: "Ted Tschopp"
image-artist-URL: https://tedt.org/
image-credits: "Ted Tschopp"
image-credits-URL: https://tedt.org/
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: https://tedt.org/
---

## Running to Stay Put: The Red Queen Problem in Enterprise AI

As an enterprise architect, I am used to target states. We describe the present and choose a destination. Then we plan the transitions between them. AI makes that habit uncomfortable. A target architecture approved this quarter can look dated before the funding clears. A vendor changes its model. A software product adds the feature we planned to build. A competitor cuts the time required to serve a customer. Employees adopt a different tool on their own.

The Red Queen explains this pattern.

### What the Red Queen means

In Through the Looking-Glass, Alice runs beside the Red Queen and discovers that all of the effort has left her in the same place. Leigh Van Valen borrowed the scene for evolutionary theory. His Red Queen hypothesis described a world in which a species' environment includes other species that are adapting at the same time. A prey animal becomes harder to catch, so its predator must change. Both species may improve while their relative positions stay about the same.[^1]

I use Red Queen syndrome for the enterprise version of that pattern. Investment rises and local performance improves, yet the company's relative position barely moves. A capability that saves money this year may become a normal cost of doing business next year. Customers absorb the improvement into their expectations. Competitors buy similar technology. Vendors place the same feature inside products that many firms already own.

AI is unusually well suited to this pattern because its capabilities spread quickly. Model providers release a new function, software vendors package it, consulting firms repeat the implementation pattern, and employees bring the habit into work. Stanford's 2026 AI Index puts organizational adoption at 88 percent. On SWE-bench Verified, reported performance rose from 60 percent to nearly 100 percent in a year. McKinsey's 2025 survey found the same adoption rate, while only about one-third of respondents said their companies had begun to scale AI across the enterprise.[^2]

The gap matters. Almost every large company can point to AI work. Far fewer can point to a business process that now behaves differently from end to end.

### The Implementation Pattern in Large Enterprises

A common first move is a horizontal assistant. It drafts email, summarizes meetings, searches documents, and writes a first pass at analysis. Employees often save real time. The same assistant is available across the market. Within a short period, faster drafting becomes an expected part of office work. The company-specific difference is the assistant's access to policy, role context, workflow state, and decision history.[^3]

A retrieval-augmented generation (RAG) project often comes next. The retrieval system sits over shared drives, intranet pages, ticket systems, and document repositories. Search gets faster. Then the harder problem arrives. Two policy documents disagree. The metadata is incomplete. A procedure has no owner. A business term means one thing in finance and another in operations. The AI has exposed a knowledge-management problem the organization has that the AI search project cannot solve until the leaders decide to fix the newly surfaced KM problem.

Coding assistants can raise developer throughput. Product teams respond with larger backlogs. Security teams receive more risk assessments. Test suites grow. The maintenance inventory grows with them. A company gains little from producing code faster when test environments, release controls, product feedback from users, and operational responses to events remain slow.

Contact-center AI can summarize a call and suggest a response. Those functions can reduce handle time and in many cases increase customer satisfaction initially; but customers judge the full resolution. A system that writes a polite answer but cannot correct a request, issue a refund, change an address, or schedule a visit has sped up one part of a queue and overwhelmed another. Once every major provider supplies fast summaries and suggested replies, the market's response-time expectation drops and those investments that didn't take the Red Queen into account in their ROI have just damaged themselves.

Marketing teams can produce far more content with the same staff. Competitors can do the same. The supply of competent copy rises and customer attention becomes harder to earn. Brand trust, first-party customer knowledge, distribution access, and good commercial judgment continue to matter because a general model cannot buy them from a catalog.

Agent programs bring the same issue into transactional work. McKinsey found that 23 percent of respondents were scaling an agentic system somewhere in the enterprise and another 39 percent were experimenting. Most companies that were scaling agents were doing so in one or two functions.[^4] An agent may coordinate a service request across several systems, which can be useful. Its business effect depends on the authority it receives and the quality of the process around it. It also depends on whether the company measures what happened after the agent acted, because if the next step after the Agent isn't: "And the customers is satisfied with the way their request was fulfilled" has more work to do.

### Why the Pilot Count Climbs While the Economics Lag

Large enterprises are good at funding small projects to with a visible sponsor and a clean demonstration. End-to-end process change crosses budget and organizational boundaries. It also reaches policy, job design, system ownership, and service commitments. The pilot therefore enters at the edge of the process, where approval is easier and never moves further.  Today's organizational structures and team compositions were designed to optimize for customer need fulfillment, coordination costs across boundaries, and their flexibility to manage this in an age without AI.

So as ideas pile up and the use-case register overflows. Each entry can make sense on its own and in the world of yesterday.  But across the portfolio, teams duplicate model gateways, retrieval stores, prompt libraries, and evaluation code. Business units buy overlapping assistants. The organization pays several times for similar capabilities and still lacks a common way to measure them; are customers who pay the company money getting their needs met, are coordination costs minimized, and can leadership manage with flexibility?

McKinsey's 2025 survey illustrates the problem. Thirty-nine percent of respondents attributed some enterprise Earnings Before Interest and Taxes(EBIT) effect to AI, and most of that group put the effect below 5 percent. The same research found a strong association between business impact and fundamental workflow redesign.[^5] The financial effect appears when the process changes to assume AI from the very beginning.

Governance often carries the same mentality. A committee approves a use case at a point in time. After deployment, the model version changes, the system instructions change, source content changes, and the tool gains access to another action. The original approval assumed one set of risks but never considered about how each underlying subsystem would change each month.

I have also become skeptical of the phrase "data moat." Possession alone does very little. A million PDFs with uncertain ownership and conflicting definitions remain a million uncertain PDFs after a chatbot indexes them. Company data starts to matter when it improves a decision, otherwise it's just extra processing waste. And when data is used to make a change in reality, the result must be recorded and used to change the next decision.

### How I Would Reshape the Portfolio

For every material AI use case, I would ask how common the underlying capability is and how deeply it changes a company-specific process.

A meeting summarizer is common and shallow. I would treat it as table stakes. The company needs safe access and cost controls. A meeting summarizer does not distinguish a company for long.

A claims assistant connected to policy, authority limits, claim history, and payment controls is different. The underlying model may still be common. The process integration is company-specific, and the outcome can be measured in cycle time or loss.

Then there is the custom chatbot with no workflow authority. Large enterprises build many of these because they make good demonstrations. They are often expensive wrappers around a general model. The operating model survives untouched.

Cases deep inside a process can produce feedback after use, but is the organization using it?  Did the system capture it?  Were users required to provide it?  Once this data is collected, the next challange occurs; custom model training is always modest at first. The asset is the grows with inputs, decisions, exceptions, and outcomes. A competitor cannot acquire that record through a software license, and many times the enterprise refuses to spend the money to capture this while they are running.

This view changes how I would fund the portfolio. Utilities need cost control, adoption support, shared security, and vendor management. Process work needs a business owner who can alter targets or capacity. A change to a customer offer needs revenue accountability. A research bet needs a loss limit and a date for the next decision.  Each these are different things that require different metrics, processes, decisions, exceptions, and in the end, outcomes. 

The outcome should be named before the model is selected. A claims system should change elapsed time and leakage. A service system should change first-contact resolution and cost per resolved case. A coding assistant should change lead time, rework, escaped defects, and maintenance load.  Is your enterprise capturing these metrics?  If not, you need to include the costs of capturing these metrics in your Agent buildout.

I have little patience for business cases that multiply minutes saved by every employee and call the result value. The calculation skips the hard part. Someone must change a capacity plan, a service level, a staffing assumption, or a queue rule. The person who is qualified to do this is someone the product owner which we can call a benefit owner.

### Architecture for a Moving Target

I would design the model as a replaceable dependency. I would design the prompts, skills, tools, and harnesses as replaceable dependencies that focus business context.  However the actual business state stays in the workflow platform or system of record. The model receives the context required for a bounded task. It returns an output with enough trace information to evaluate what happened.

A consequential action needs a record of the source material, the AI instructions,  and the model version. The record should also retain the instruction, output, human override, and later outcome. That history supports incident review. It also makes model replacement possible because the company can replay known cases against a candidate model.

Identity must follow every retrieval and every tool call. A conversational interface does not get extra access merely because it feels informal. The agent acts with a named identity, a defined scope, an expiration time, and a limit on what it can change. The workflow engine remains responsible for state, retries, compensation, and timeout behavior.

Full vendor neutrality can create a low common denominator. Stable contracts should surround the business capability. Teams can then use a vendor-specific function deliberately when its benefit is worth the switching cost. Architecture decision records should state where that cost exists.

Production evaluation belongs in normal operations. A launch score tells us how a system performed on yesterday's cases. The running service needs sampling, failure review, cost monitoring, and outcome checks. NIST's AI Risk Management Framework calls for risk tracking over time and for post-deployment plans that cover user input, appeal or override, decommissioning, incident response, recovery, and change management.[^6]

### Governance Should Follow Authority

Risk tiering should start with what the system can do.

An internal drafting aid has a small blast radius. A recommendation used in a regulated decision has a larger one. An agent that writes to a system of record needs stronger identity controls, narrow authority, complete logs, and a tested rollback path.

Autonomy can advance in steps. A system may read, draft, recommend, execute after approval, and execute within a narrow policy. Each step changes the evidence and controls required. A human reviewer needs enough time, access to the source material, authority to disagree, and a recorded reason for an override.

The operating model needs a similar division of work. A central group owns shared contracts, platform services, identity patterns, and evaluation methods. Domain teams own the process outcome, exception rules, operating procedures, and user adoption. Risk and legal specialists join the work where the decision has consequence. They do not have to recreate a full review for every low-risk assistant.

The finance side is simple to state and hard to do. Time saved becomes value after the company changes overtime, hiring, throughput, price, loss, or service capacity. A benefit owner chooses the conversion mechanism. The finance team checks whether the gain appeared. The measure is revisited after competitors reset price or service expectations.

The workforce problem is easy to miss. When AI writes the first draft of an analysis, junior staff lose one of the ways they used to learn. Senior staff need to make the reasoning visible and review the work as both instruction and quality control. Role design should state where people practice judgment and how they gain authority over time. A company can increase output while its bench of experienced people gets thinner.

### A Claims Example

Consider a large insurer that has deployed an office assistant, a coding copilot, call summaries, and a policy chatbot. Employees use them. Local measures improve. Other insurers have bought similar products, so the relative position changes very little.

**Now apply AI to the claims process itself.**

At intake, a model reads the submitted form and photographs. A retrieval service fetches the applicable policy language and records the source. Business rules establish authority limits. A fraud model adds its score without deciding the claim. The adjuster receives the source evidence, the model's uncertainty, the applicable authority, and the next action permitted by policy.

An agent can request a missing document or schedule an inspection. Payment remains under the controls of the claims platform. Exceptions return to a person with the case history intact. Every action is logged under an identity.

The program measures elapsed time, reopened claims, leakage, complaint rate, and human overrides. Closed claims become evaluation cases when their outcomes are known. The team can see where the model helps and where it adds noise. It can also find policy ambiguity and process defects.

The foundation model is widely available. The insurer's policy interpretation, exception history, operating rules, and measured claim outcomes belong to the insurer. Those assets improve through use. A model can be replaced while the claims capability remains.

### What I Would Ask at the Next Architecture Review

A crowded  roadmap tells me that a company is active. It says little about relative progress.

I would ask what work changed, what result moved, what can be replaced, and what the company learned. I would ask who owns the benefit after deployment. I would ask how the system fails and how the team knows.

Much of the AI portfolio is ordinary modernization. That work keeps employee tools and unit costs near the market baseline. A smaller set of investments can change the company's position by reaching into a process and producing evidence for the next decision.

When the answers are licenses, active users, prompt counts, and polished demonstrations, the organization is running, but the scenery is still in the same place.

---

[^1]: [Springer](https://link.springer.com/article/10.1007/s13752-021-00391-w)
[^2]: [Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report)
[^3]: [McKinsey & Company](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
[^4]: [McKinsey & Company](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
[^5]: [McKinsey & Company](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
[^6]: [NIST AI Resource Center](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)