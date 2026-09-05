---
layout: post

title: "The Same Model, Different Rules"
subtitle: "What a Broken iPhone and a BlackBerry Pearl Teach Us About AI"
seo_title: "The Same Model, Different Rules for Enterprise AI"
quote: "Before handing over important work, know what your BlackBerry is. And make sure it is charged."
excerpt: "AI procurement must define not only which model is approved, but also its access rules, data custody, interruption response, and exit arrangements."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-09-05 09:00:00 -0700
update: 2026-09-05 09:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - "An approved model name does not define the complete service an enterprise is purchasing."
  - "Access rules, routing, safeguards, data custody, and fallback behavior belong in the approval record."
  - "Enterprise controls must govern what an AI service may do independently of provider permission."
  - "Continuity planning should test interruption, recovery, switching costs, and manual alternatives before access is lost."

description: "Enterprise AI procurement must account for access rules, data custody, service interruptions, recovery plans, and exit arrangements."
seo-description: "Why enterprise AI procurement must cover access rules, data custody, service interruption, recovery, and exit plans alongside model performance."

categories:
  - AI
  - Business
  - Opinion
  - Enterprise Architecture
  - Leadership

tags:
  - enterprise AI
  - AI procurement
  - AI governance
  - model access
  - operational resilience
  - service continuity
  - vendor risk
  - data custody
  - access controls
  - AI portability

keywords:
  - enterprise AI procurement
  - AI model access rules
  - AI service continuity
  - AI vendor risk management
  - AI interruption recovery
  - AI data custody
  - AI model governance
  - AI exit strategy
  - enterprise AI controls
  - model portability

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-09/iPhone-Pearl.webp"
image-alt: "A shattered first-generation iPhone beside a BlackBerry Pearl connected to a charging cable on a wooden table."
image-title: "A Broken iPhone and a Slowly Charging BlackBerry"
image-description: "A first-generation iPhone with shattered glass lies beside a charging BlackBerry Pearl, illustrating the need for a workable fallback when a critical service becomes unavailable."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1672
image_height: 941

mathjax: false
mermaid: false
mastodon-post-id:
---

# The Same Model, Different Rules

## A Broken iPhone and a Slowly Charging BlackBerry

In 2007, [I dropped my iPhone at lunch](https://tedt.org/sucks-to-be-me-from-blackberry-to-iphone-to-blackberry-again/). The glass shattered.

At the Apple Store, I was told the repair would cost $250. I asked for a loaner. They didn’t have one. I asked to have the repaired phone shipped to my home. One employee said they couldn’t do that. Another corrected him: they could. A refurbished replacement wasn’t an option either.

So I was back on my BlackBerry, which was charging slowly, while I waited for an iPhone expected back in two or three business days.

The broken glass was easy to see. The other dependencies became visible one question at a time. What would the store repair? What could it replace? Who knew the shipping rules? What could I use while the phone was gone?

The answers determined how I would get through the interruption.

An enterprise choosing an AI service faces a version of that same problem. The technology may be impressive. But the work also depends on arrangements around it: who can use it, who can change the conditions, and what remains available when the preferred option disappears.

Those arrangements deserve attention before something breaks.

*AI procurement now includes the conditions under which work can start, continue, and stop.*

On June 9, Anthropic released Claude Fable 5 and its restricted-access counterpart, Mythos 5. Three days later, access to both was suspended.

In its account of the interruption, Anthropic said newly imposed export controls required restrictions based on nationality. Unable to verify nationality reliably in real time, it suspended access for everyone. Fable access was restored on July 1. [Anthropic’s account](https://www.anthropic.com/news/redeploying-fable-5).

A team evaluating the model could have tested its answers, measured its speed, and calculated its cost. Those tests would have helped determine whether it could do useful work. They would not have established whether the team could keep using it when the conditions of access changed.

That is the purchasing question the September announcements bring into sharper focus.

An enterprise needs to approve a service configuration: the model, the route to it, the people permitted to use it, the data arrangements, and the response when any of those conditions changes. A model name alone cannot describe that purchase.

## The Differences Are Already Reaching Buyers

Anthropic describes Fable 5.1 and Mythos 5.1 as the same underlying model with different safeguards. Fable is generally available; Mythos is offered through trusted-access arrangements supporting sensitive cybersecurity and life-sciences work. Access remains program-dependent. [Anthropic’s September announcement](https://www.anthropic.com/claude-fable-and-mythos-5-1).

Google describes Gemini 3.8 Flash and Flash Cyber as sharing foundational intelligence, with different safeguards and deployment arrangements. Flash Cyber is restricted to trusted defenders through Fairwind. Google’s wording does not establish identical model weights, so the two companies’ claims should not be treated as interchangeable. [Google’s announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/).

Restricted access is not new. What these releases make increasingly visible is how much of the product sits around the intelligence.

The differences also extend beyond the model companies’ announcements.

Harvey’s Sept. 1 notice makes Fable 5.1 an opt-in offering. It warns that the model’s processing practices may differ from commitments in existing customer agreements, describes a time-bound zero-retention arrangement for eligible customers, and says processing occurs in the United States. Those statements describe Harvey’s published offering; they should not be generalized to every distribution channel. [Harvey’s implementation notice](https://www.harvey.ai/blog/fable-5-1-in-harvey).

Cursor documents a different set of operating decisions. Enterprise customers need explicit approval to enable Fable 5.1. Cursor’s own Privacy Mode does not eliminate Anthropic’s separate retention requirements. Requests that trigger safeguards can automatically fall back to Opus. [Cursor’s documentation](https://cursor.com/docs/models/claude-fable-5-1).

These are commercially interested providers describing their implementations, not independent studies of customer outcomes. They nevertheless establish something useful: choosing the model does not settle the terms under which an employee encounters it.

The route matters. So does the agreement attached to that route.

## Write Down the Service You Are Approving

In [“Model Portability Is Not AI Portability,”](https://tedt.org/Model-Portability-Is-Not-AI-Portability/) I argued that moving a model does not automatically move the complete working system. The newer question is what happens when parts of that system change while the model name stays the same.

Anthropic’s versioning documentation provides a concrete example. A model ID pins the model’s weights and configuration, but surrounding infrastructure—including routing, safety classifiers, and sampling logic—can change. The documentation says those changes can affect observable behavior. [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions).

A fixed model version is useful. It is not a frozen service.

The enterprise catalog therefore needs to record more than “approved model.” It needs to describe the approved use of that model and the evidence supporting the approval.

Consider a hypothetical internal source-code review service. Its purpose is to inspect approved repositories and propose repairs. The following is a proposed approval record, not a claim that a particular product already satisfies every requirement.

| Boundary                    | Proposed Configuration                                                                                      | Owner and Evidence                                                                                                                                    |
|-----------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Model and routing           | Fable 5.1 through the company gateway to the Claude API; no unapproved fallback                             | The platform owner records the exact model ID, interface, routing settings, and test results. Supplier-controlled changes are tracked separately.     |
| Eligible users and entities | One corporate entity’s internal security team; no assumed access for affiliates or contractors              | Procurement confirms applicable access rights. The identity team enforces membership. Unconfirmed coverage blocks access.                             |
| Permitted actions           | Read isolated copies of two approved repositories and draft patches; no merging or production deployment    | The application owner enforces tool permissions and tests attempted actions outside that scope.                                                       |
| Data handling               | Only approved source code, with processing, storage, review locations, and retention explicitly accepted    | Privacy and security owners retain the applicable terms and verified data-flow description. Unknown locations or retention conditions block approval. |
| Monitoring and evidence     | Company-held records of requests, actions, approvals, and unfinished work, limited to necessary information | Security identifies authorized reviewers and tests whether required evidence remains retrievable after supplier access is lost.                       |
| Interruption and recovery   | Pause affected jobs; use a separately approved alternative or manual review                                 | The service owner names the person authorized to resume work and records a tested recovery procedure.                                                 |
{: .well .table .table-striped}

Each row needs a status: documented, contractually confirmed where necessary, or not yet tested. A public description of a feature is not evidence that the enterprise has enabled it correctly.

There are also two different owners to record. One can change the condition. The other decides whether the enterprise can continue operating after that change.

The supplier may change a classifier. Your architecture board cannot prevent that merely by approving a design. It can decide what evidence is needed afterward and whether the affected workflow must pause.

That distinction turns an inventory into an operating record.

## Keep Control of the Actions

Provider permission and enterprise authority still answer different questions.

A supplier may permit vulnerability analysis. That does not authorize an agent to inspect every system reachable from your network. An employee may be allowed to read a repository without being allowed to deploy a repair.

The earlier [capability-versus-authority argument](https://tedt.org/Dev-Test-and-Prod-Still-Matter-What-Gets-Deployed-Has-Changed/) remains the foundation. The purchasing decision now needs to establish which controls the enterprise can enforce independently of the supplier’s judgment.

For consequential workflows, those controls should include user identity, permitted tools and targets, approval before consequential changes, records of completed actions, and a way to stop further execution. Their effectiveness should not depend on the model agreeing that a request is inappropriate.

Google’s Fairwind requirements illustrate the division. Google controls program admission, while participants must implement user authentication, phishing-resistant multifactor authentication, applicable access controls, and tracking of employee access and use. Access is limited to specified internal security teams. [Fairwind’s governance requirements](https://deepmind.google/fairwind-program/).

This does not mean every enterprise should rebuild the provider’s safeguards.

A managed service may be sufficient when it can demonstrate the required controls and the customer can administer and audit them. An enterprise-controlled harness becomes necessary where the workflow requires permissions, approvals, evidence, or recovery that the managed service cannot reliably provide.

“Controlled” does not have to mean “built from scratch.” It means the organization can establish and enforce the required boundary. If neither the purchased service nor an integration can do that, the consequential action should remain outside the automation.

## Data Custody Is Another Operating Responsibility

Anthropic’s planned Enterprise Frontier Safeguards would allow monitoring data to reside in customer-controlled cloud infrastructure, with options for customer-managed keys and customer review of flagged activity. Rollout is planned in phases later this fall. The storage, key-management, and review options are separately configurable; the announcement should not be read as proof that every customer already has them. [Enterprise Frontier Safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards).

Its interim zero-retention arrangement also has limits. Anthropic describes it as temporary and restricted to eligible uses. Real-time safeguards and enforcement continue to apply, and the company says it may modify or withdraw the arrangement. [Covered Models guidance](https://support.claude.com/en/articles/15425695-covered-models).

Moving records into the customer’s environment changes custody. It does not remove the need to monitor activity, investigate problems, or establish who can suspend service.

Someone must receive the alert. Someone must have permission to examine the evidence. Someone must distinguish misuse from legitimate work that was incorrectly flagged.

For a multinational organization, the approval record should separately identify the contracting entity, eligible users, inference locations, stored-data locations, and locations from which people may review the data. An approved storage region does not answer all those questions.

Harvey’s processing notice supplies one concrete reason to ask. It does not establish what every organization in Europe, the United Kingdom, or Asia-Pacific may lawfully or contractually do. Those decisions require the exact service configuration and applicable agreement, not a general claim of global availability.

## Purchase the Change and Exit Arrangements

The contract discussion should describe events, not merely desirable qualities.

Anthropic’s public commercial terms, for example, allow suspension in specified circumstances and describe reasonable efforts to provide written notice and restore access after a curable cause is resolved. That is different from a guaranteed advance-warning period or a fixed recovery time. Customer-specific agreements may differ. [Public commercial terms, Section I](https://www.anthropic.com/legal/commercial-terms).

Procurement, legal, security, and the service owner should resolve four practical matters:

- **Changes and versions:** What is pinned, what can change around it, what notice is available, and what testing is required before affected work continues?
- **Scope and location:** Which entities, employees, contractors, purposes, and processing arrangements are covered? Does an approval survive a change in any of them?
- **Evidence and review:** What information can the customer obtain during an incident, who reviews disputed flags, and what remains accessible if the account is suspended?
- **Revocation and exit:** What can trigger loss of eligibility, how can a decision be challenged, and what export, transition assistance, charges, and time limits apply?

These are matters to confirm or negotiate, not assurances that suppliers necessarily offer.

The purchasing decision must also survive an unwelcome answer. If the provider cannot guarantee advance notice, a critical workflow needs a tested interruption response. If the evidence needed to reconstruct a transaction cannot be obtained, that workflow may need different architecture.

A contract cannot prevent every interruption. It can make the responsibilities clearer before people are trying to recover under pressure.

## Rehearse Losing Access

Now take the hypothetical code-review service and interrupt it.

The supplier suspends the organization’s access while several reviews are underway. Some draft patches have been saved. Other jobs are waiting. This is a planning scenario, not a reported customer incident.

The platform should stop dispatching affected work and preserve the records it is authorized to retain. The service owner should establish which jobs completed, which produced partial work, and which never started.

Paused does not mean rolled back.

Next, determine the scope and reason for the restriction. A service interruption, suspected credential misuse, and a prohibition on the requested activity require different responses. An alternative model is appropriate only when the work remains permitted and the replacement’s access rights, data handling, quality, and controls have been approved. Changing accounts to evade a restriction is not recovery.

If no approved alternative exists, route the work to manual review or hold it. The owner should know how much work that alternative can absorb and when delays become unacceptable.

This is where the [harness around the model](https://tedt.org/Why-AI-Needs-a-Harness/) earns its cost. It preserves the organization’s ability to understand and manage unfinished work, even when the supplier is unavailable.

The rehearsal should also produce a cost estimate.

Suppose a switch requires 80 engineering hours and 40 review hours at an assumed blended rate of $150 an hour. That is $18,000 before additional licenses, parallel operation, service charges, or delayed work. These are illustrative assumptions, not measured customer costs.

Use your own drill to replace them.

Record the effort required to reconstruct work, validate the replacement, obtain approvals, and clear the backlog. Compare that expense with the cost of maintaining a ready alternative. Some workflows will justify the investment. Others will be adequately served by a documented manual procedure.

Token prices alone cannot make that decision.

## Keep the Claim Proportionate

The public evidence supports a narrower conclusion than a sweeping transformation of every enterprise purchase.

Specialized access may remain concentrated in sensitive domains. Providers may be better equipped than individual customers to operate sophisticated safeguards. A routine drafting workflow may need little beyond existing access controls and a human fallback.

There is also an evidence boundary. Harvey and Cursor document real service arrangements, but their notices are not independent evaluations of enterprise outcomes. Public documentation does not establish the full regional eligibility of restricted programs, negotiated customer commitments, or measured switching costs. Those parts of the original reporting brief remain open.

The practical conclusion does not require pretending otherwise.

Before placing consequential work behind a model endpoint, describe the complete service, identify who can change its conditions, and test how the work will be recovered. Scale that preparation to the consequence of interruption.

We don't need to return to June.  This week OpenAI launched a new set of models, including those that are restricted to people working in the cyber security space.  If you intend to apply for access to these systems, you need to understand the eligibility requirements and prepare the necessary documentation, the question was no longer simply how well the model could perform.  It also needs to include how you will handle interruptions, maintain continuity, and ensure that critical work can proceed even if access is temporarily unavailable.

The work still needs somewhere to go.

A useful AI purchasing decision gives it that place: a permitted route, a recoverable state, and a person who knows what happens next.

## The Practical Lesson

I broke that iPhone, and for a while lost access to my brand new phone.  A shattered screen and a supplier suspending model access are different failures.

But both lead to a practical question: what can you do while the thing you depend on is unavailable?

I had asked for a loaner. What I actually had was my old phone, aslowly charging BlackBerry. Returning to it was inconvenient, but it gave me something to use while I waited.

For an enterprise, the equivalent deserves more preparation. The alternative needs the right permissions, access to the necessary work, and someone authorized to decide when it is safe to continue. Its limitations need to be understood before people are depending on it.

Choose the capable model. Test what it can accomplish. Then give the arrangements around it the same attention.

Before handing over important work, know what your BlackBerry is.

And make sure it is charged.
