---
layout: post

title: "Who Vouches for the Seller an AI Recommends?"
subtitle: "Before an AI assistant buys a part, someone has to vouch for the seller."
quote: "The company should be able to give an answer more useful than \"the AI found it.\""
excerpt: "An AI assistant can find the right part at the right price overnight. Four questions determine whether the seller behind the offer is one your company can actually buy from."
source: "Original Content"
source-url: ""
call-to-action: "Try It With Aster Pumps"

date: 2026-11-14 00:00:00 -0800

author:
  avatar: "https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=mp"
  name: Ted Tschopp
  url: https://tedt.org/

description: "Four questions a buyer must answer before approving a purchase an AI assistant recommends, and how supplier qualification records keep the decision auditable."
seo-description: "How to verify the seller behind an AI shopping recommendation: supplier qualification, manufacturer authorization, purchasing controls, and a repeatable test scenario."
image: "/img/2026-11/AI-Suppliers.webp"
image-alt: "Minimalist illustration of a black industrial seal with bolt holes overlapping a gray document with three ruled lines."
image-title: "AI Suppliers"
image-description: "A flat illustration pairs an industrial seal with a supplier record, representing the evidence behind an AI-recommended purchase."

categories:
  - AI
  - Business
  - Enterprise Architecture
  - Opinion

tags:
  - agentic AI
  - AI governance
  - procurement
  - supply chain
  - supplier qualification
  - agentic commerce
  - AI shopping
  - purchasing controls
  - responsible AI
mastodon-post-id: "117618322477544009"
mastodon-post-url: "https://tschopp.net/@Ted/117618322477544009"
---

# Who Vouches for the Seller an AI Recommends?

Imagine you’re the maintenance planner at an industrial facility. It’s Friday afternoon. A pump needs a replacement seal, and your usual supplier can get one to you on Tuesday.

You give an AI assistant a photograph, a part number, and the delivery address. It finds what looks like the right seal, available for overnight shipping. The price is reasonable. The checkout works. The assistant asks for approval.

Who are you about to buy it from?

## Who Can Vouch for What?

I’d put four questions on the purchase request. The person who can answer one may have to call somebody else to answer the next.

{% comment %}
<!-- markdownlint-disable MD055 MD056 -->
{% endcomment %}

| Question | What you need to establish | Who can help answer it |
|---|---|---|
| Who’s selling the part? | The website is a purchasing channel used by the business named as the seller. | Procurement can check a verified supplier record or contact the business through a known channel. |
| What’s the seller’s relationship to the manufacturer? | Whether the manufacturer recognizes the seller for this product, territory, and period. | The manufacturer’s distribution team can confirm the relationship. |
| Can our company buy from this seller? | The supplier and the purchase meet the buyer’s requirements. | Procurement can confirm qualification. A business owner with the appropriate authority can decide on an exception. |
| Does this offer meet the need? | The part, its provenance, the delivery date, and the terms are suitable for the job. | The planner or technical owner can check the seller’s specifications and terms. |
{: .well .table .table-striped}
{% comment %}
<!-- markdownlint-enable MD055 MD056 -->
{% endcomment %}

Think about a vendor your company already uses for office equipment. You know who they are, and you may still need a separate qualification before they can sell you an industrial component. The same distinction matters when an independent reseller has a genuine part. If your company requires a manufacturer-authorized source for that purchase, put the requirement on the request so the reviewer knows what evidence to ask for.

## Why This Matters This Week

On Nov. 10, OpenAI introduced Businesses in ChatGPT. Eligible companies can claim their businesses, go through verification, and supply information such as product feeds with prices and availability. That gives a business a way to keep its own information current. OpenAI distinguishes conversations with a company’s Business Agent from independent ChatGPT answers. [OpenAI’s announcement](https://openai.com/index/introducing-businesses-chatgpt/)

What happens when you ask a chatbot where to buy something? The Verge reported on a study by brand-protection company Podqi that examined 6,795 AI answers about 151 brands. The researchers used constructed shopping questions, including requests for regional websites and places to buy products. Some answers included addresses Podqi classified as risky. The Verge also included responses from the AI companies. [The Verge’s report](https://www.theverge.com/ai-artificial-intelligence/1032020/gemini-chatgpt-perplexity-shopping-test-risky-fake-websites-citations)

Podqi’s “risky” category included suspected impersonation, suspected counterfeit sites, and inactive domains. An address could appear in an answer because the chatbot was warning the shopper about it. The researchers ran repeated consumer queries in September and stopped at the answers, before any purchase or payment. The two waves used different groups of brands and different ways of labeling answers, which limits what you can infer from the lower rate in the second wave. To find out what happens inside your company, you’d need to follow a request through your own purchasing process. [Podqi’s methodology](https://podqi.com/research/ai-search-brand-risk)

On Nov. 13, OpenAI introduced ChatGPT Wallet. The company says users review and approve each purchase and that payment tokens stand in for their card details. The initial rollout serves eligible U.S. ChatGPT Pro users. As the recommendation and the means to pay get closer together, the buyer has less reason to leave the approval screen to look up the seller. Put the evidence where the buyer is making the decision. [OpenAI’s Wallet announcement](https://openai.com/index/introducing-chatgpt-wallet/)

## What Should the Planner See?

Back on Friday afternoon, suppose the assistant pulls up the supplier record alongside the offer.

> The part matches the required specification. The seller is on file. Its approval for this product category has expired. Hold the order until procurement confirms a current qualification or an authorized business owner approves an exception.

On the approval screen, show the seller’s name, the link where the order would be placed, and the supplier’s qualification record. If the qualification has expired, send the purchase request and the record to procurement for review. If the site may be impersonating a supplier, give corporate security the link and the name of the business the site claims to represent. Keep the decision with the purchase request so the next person can see who made it and what evidence they used. [Agents Don’t Click](https://tedt.org/Agents-Dont-Click/)

For an order from the approved catalog, a modest integration may be enough. Let the assistant interpret the request, search the catalog, and prepare the order. Your purchasing system can apply its usual rules for supplier qualification, spending authority, and transactions. SAP’s tools already use supplier qualifications in guided buying and to determine eligibility for sourcing events. Try an order prepared by the assistant and see which checks actually run. [SAP’s supplier-management documentation](https://learning.sap.com/courses/discovering-sap-ariba-supplier-management/integrating-supplier-management-into-procurement-processes_f5acad6c-0928-4b8d-b36a-2af48ec2a50b)

The work gets more interesting when the assistant looks outside the catalog. In an earlier article, I wrote about a distributor that could identify the right part, verify a source, and establish a lead time. That was a sourcing problem solved well enough that someone would pay for the answer. An assistant can do some of that legwork by searching old product names, comparing offers, and collecting the details a buyer needs. [The Two Business Cases for AI Agents](https://tedt.org/The-Two-Business-Cases-for-AI-Agents/)

Suppose the overnight offer comes from a local shop your company has never bought from. Send procurement the offer, the evidence the assistant found, and the questions it couldn’t answer. The shop can become a candidate for qualification, or the purchase can go through the company’s exception process. If it takes more paperwork to join your supplier list than the sale is worth, a shop that could have solved your problem may walk away. Give it a way to provide the evidence you need and correct errors in the record.

How much checking is enough? Start with what happens if the purchase goes wrong. An inexpensive seal can keep a pump out of service. A manual investigation into every routine order can consume more effort than it saves.

The records behind those decisions take work to maintain.  Suppliers change names, websites, and ownership. Distributors add product lines. Your people might know these changes, but you are now needing to document this for your agents as well.  An approval may cover one operating unit. Give each consequential entry a source, an owner, and a date to review it. If the assistant finds a website claiming to be an authorized dealer, send the claim to the team that maintains the register. They can verify it independently before another buyer relies on it.

If you sell through these channels, make it easy for customers to find your official stores and regional distributors. Try the questions a customer would ask and give them a way to report an inaccurate listing. On the buying side, give the assistant the information it needs for the check and keep internal approvals, negotiated prices, and purchasing plans within the workflows that use them.

## Try It With Aster Pumps

Take one purchasing workflow and make up four versions of the same order. The part is a P17 seal from a fictional manufacturer called Aster Pumps. Use reserved addresses such as `store.aster.example` and `supply.example`. Keep the part the same and change what the buyer knows about the seller.

{% comment %}
<!-- markdownlint-disable MD055 MD056 -->
{% endcomment %}

| Case | What the buyer has | What the workflow should do |
|---|---|---|
| Current approval | The purchase address matches the supplier record. The approval covers the product and territory. | Continue through the normal purchasing controls. |
| Unfamiliar seller | The offer looks promising. The buyer has no qualification record for the seller. | Show what evidence is missing and route the request for qualification or an authorized exception. |
| Expired approval | The seller is known and the relevant qualification has expired. | Request renewal or an authorized exception. |
| Conflicting address | The site claims to represent an approved supplier, and the address differs from its recorded purchasing channels. | Hold the order while someone verifies the relationship. |
{: .well .table .table-striped}
{% comment %}
<!-- markdownlint-enable MD055 MD056 -->
{% endcomment %}

A small browser tool called **Supplier Destination Check** could make the exercise repeatable. Give it a supplier register and a proposed order, then change the purchase address, the territory, or the date. The result should show which record it used, which rule applies, and what a person still needs to find out. A green result would mean the facts you supplied satisfy the rules you supplied. The rest of the purchasing and receiving process still has a job to do.

Then make the cases a little messier. A supplier moves to a new domain. A subsidiary trades under a local name. A marketplace collects payment on the seller’s behalf. Take the register offline for one test and see what the reviewer gets when the approval record is temporarily unavailable. If the order is urgent, can the person requesting it find someone with authority to decide on an exception?

When you move on to real requests, start with a small group and keep them inside your existing purchasing process. Measure the time from request to acceptable order, including reviews, corrections, and time spent waiting for a decision. Count the mismatches you catch, the unnecessary escalations, and the legitimate suppliers you exclude. Include the work of keeping the records current. An assistant might save ten minutes finding a part and lose the overnight delivery window while the request waits in somebody’s queue. The whole job is what you’re trying to improve.

The seal still has to arrive. It still has to fit. And when someone asks where it came from, the company should be able to give an answer more useful than “the AI found it.”
