---
layout: post
title: "Your AI Passed the Test. Did It Answer the Business Question?"
subtitle: "Why useful AI evaluations test whether an answer is supported, not just whether it matches a source."
quote: "An eval can correctly enforce its scoring rules while those rules fail to capture what the business needs."
excerpt: "AI evaluations should test whether an assistant answers the business question, not just whether its response matches a source."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-11-01 09:00:00 -0800
update: 2026-11-02 10:43:09 -0800

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - Evals test system behavior against expectations across representative tasks and conditions.
  - Scoring rules need to reflect business requirements, not only whether a value appears in a source.
  - Incomplete evidence should lead to qualified claims or targeted retrieval, not unsupported totals.
  - Graders need scrutiny, and a failed result needs investigation before it drives a release decision.
  - Passing provides bounded evidence about selected cases; it does not guarantee future performance.

description: "AI evaluations should test whether an assistant answers the business question, not just whether its response matches a source. Learn how to build useful evals."
seo-description: "Learn how to build AI evaluations that test business intent, evidence boundaries, grader quality, and release requirements, not just answer matching."

categories:
  - AI
  - Computers
  - Opinion
  - Enterprise Architecture
  - Leadership

tags:
  - AI evaluations
  - evals
  - AI agents
  - model evaluation
  - software testing
  - AI governance
  - release management
  - business requirements
  - reliability

keywords:
  - AI evaluations
  - AI evals for business requirements
  - evaluating AI assistants
  - AI evaluation criteria
  - AI grader reliability
  - AI release gates
  - evaluation evidence boundaries
  - AI testing for enterprises

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-11/Your-AI-Passed-the-Test-Hero.webp"
image-alt: "A white check mark on an incomplete black circle, with two red wedges detached to the right."
image-title: "Your AI Passed the Test"
image-description: "A Swiss-style geometric illustration places a white check mark on an incomplete black circle, with two detached vermilion wedges representing evidence excluded from a passing result."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1672
image_height: 941

mathjax: false
mermaid: false
no_toc: true
mastodon-post-id: "117545057341789176"
mastodon-post-url: "https://tschopp.net/@Ted/117545057341789176"
---

**Your AI Passed the Test. Did It Answer the Business Question?**

Before a product team puts an AI assistant into production, it needs a way to determine whether the assistant can be hired to do the job. That is what evaluations, usually shortened to **evals**, are for.  Evals are different the the tests used in traditional software development, and they are different then the performance metrics used to assess human employees.  They are also not user acceptance tests.

An eval is a structured test: give the AI a task, observe what it does, and compare the result with expectations established beforehand. Success might mean answering correctly, completing an action, asking a necessary question, or recognizing that the available information cannot support a conclusion.

Evals are more than a successful demonstration or a score showing how quickly an assistant works. They can include familiar software tests and support user acceptance testing, the testing is not about getting the answer right every time, but to understand its behavior under different circumstances. In other words, they examine *how* the AI handles a range of tasks and conditions. They provide evidence for deciding where the assistant is dependablly competent to do the job following the right process, where it needs help, and what must improve before release.

<div class="table-responsive">
<table class="table table-striped align-middle">
  <thead>
    <tr>
      <th scope="col">Traditional Concepts</th>
      <th scope="col">What this means in an AI World</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Traditional software tests</th>
      <td>Evals can include these, but an agent may have several acceptable answers or ways to complete a task. Checking for one exact output may miss whether it accomplished the work.</td>
    </tr>
    <tr>
      <th scope="row">User acceptance testing</th>
      <td>Evals can supply evidence for UAT. They are not synonymous with stakeholder approval, and their usefulness continues after release.</td>
    </tr>
    <tr>
      <th scope="row">An employee performance review</th>
      <td>Business requirements and outcome measures can carry over. But an eval assesses a particular combination of model, instructions, tools and data—not a person’s effort, motivation or general professional competence.</td>
    </tr>
    <tr>
      <th scope="row">A productivity dashboard</th>
      <td>Speed, cost and output volume can be measured. Those measures alone do not establish that the agent completed the right work correctly.</td>
    </tr>
    <tr>
      <th scope="row">A successful demonstration</th>
      <td>A convincing example shows that something worked on that occasion. A useful eval examines a defined collection of cases, including difficult situations and failures, often through repeated attempts.</td>
    </tr>
    <tr>
      <th scope="row">Training</th>
      <td>Running an eval measures performance. It does not, by itself, teach the model or repair the product. The results help people decide what to change.</td>
    </tr>
    <tr>
      <th scope="row">A certificate of reliability</th>
      <td>Passing provides evidence about the cases and criteria tested. It does not guarantee success on unfamiliar tasks or after the system changes.</td>
    </tr>
  </tbody>
</table>
</div>

Teams collect these test cases and run them against different versions of their product. The results help them identify weaknesses that need attention, compare changes to the application or the model over time, and decide what portions of the application are ready for release. The process is repeatable, although the AI’s responses may vary between attempts. [Anthropic’s guide to evaluations](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) describes these building blocks.

Consider a fictional company developing an assistant that answers questions about cloud spending. The documents show $120,000 was spent for systems used by customers and employees, $30,000 for software development, and $10,000 for testing. Together, they cover all company cloud costs for the same quarter.

When the assistant is asked to provide a figure for total spending, the assistant should answer $160,000.

Now change the test. Give the assistant only the $120,000 report, which explicitly excludes development and testing. It answers:

> “Our total cloud spending last quarter was $120,000.”

That number is present in the report and approves the response.

The number is correct. But is there any support for that conclusion? The company-wide claim is unsupported.

A simple checker is plainly inadequate: it verifies that a value appears in a source without checking whether the source supports the complete claim. But the example exposes a broader design problem. **An eval can correctly enforce its scoring rules while those rules fail to capture what the business needs.**

A more capable grader helps only if the evaluation gives it the right job.

In [*Right Numbers, Wrong Questions*](https://arxiv.org/html/2610.38631v1), posted October 28, 2026, TIFIN researchers examined constructed Indian mutual-fund questions involving ambiguous figures, product variants and missing investor information.

They also tested an AI judge. Providing a dictionary of field definitions helped it identify 40 of 44 mislabeled figures. Yet, without being told the intended interpretation, it accepted 42 of 52 answers that silently chose one reading of a vague question.

This was their key finding. A judge assessing whether an answer addresses “the question as asked” can accept a plausible reading without requiring the assistant to disclose that reading. Better definitions improved one check; they did not establish that the answer matched the user’s unstated intention. Requiring explicit interpretations was proposed, but not tested as a remedy. These were controlled research cases, not failure rates for deployed businesses.

Other research posted that day supplies related evidence. [*Beyond fabrication*](https://arxiv.org/html/2610.38691v1) found numerical claims in AI-written research that used existing values from the wrong experiment, metric or run. [*DeoGen*](https://arxiv.org/html/2610.38687v1) found that models performed substantially worse when policy questions lacked enough information for a conclusion. That study used generated cases from four U.S. policy texts, with extended reasoning disabled.

These studies examine different failures. They do not establish how often the problem occurs across enterprises or prove that particular remedies will work in production. They give product teams specific behaviors to investigate: preserving a figure’s meaning, attributing it to the correct result, and recognizing when a necessary fact is missing.

In [*The Map Is Not the Decision*](https://tedt.org/The-Map-Is-Not-the-Decision/), I argued that analytical outputs need explicit assumptions and boundaries around what they can support. Evaluation makes that requirement concrete. A passing result should depend on whether the answer stays within those boundaries.

For a product team, the work begins before the AI runs.

Someone must assemble representative questions, the information available for each, and the behavior that the job was completed successfully. A test runner can then submit those cases to the product, capture its responses and actions, apply grading rules, and record the results. After a change, the team runs the cases again and compares performance. [OpenAI’s evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recommends this cycle of defined objectives, representative cases, measurement and continued evaluation.

The grader might be ordinary software checking a calculation, a person assessing an explanation, or another AI applying written criteria. Different parts of the same task can use different graders. An assistant that updates a record should be checked against the resulting record, as well as what it says it did. These distinctions are covered in [Anthropic’s evaluation guide](https://www.anthropic.com/research/demystifying-evals-for-ai-agents).

For the fictional cloud-cost assistant, one test result could look like this:

<div class="table-responsive">
<table class="table table-striped align-middle">
  <thead>
    <tr>
      <th scope="col">Part of the test</th>
      <th scope="col">What it records</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">User’s question</th>
      <td>What was total company cloud spending last quarter?</td>
    </tr>
    <tr>
      <th scope="row">Available evidence</th>
      <td>A report covering only production costs: $120,000.</td>
    </tr>
    <tr>
      <th scope="row">Required behavior</th>
      <td>Identify the limited scope; retrieve missing costs if authorized and available, or explain that the total cannot yet be established.</td>
    </tr>
    <tr>
      <th scope="row">Assistant’s answer</th>
      <td>Total company spending was $120,000.</td>
    </tr>
    <tr>
      <th scope="row">Grade</th>
      <td>Fail: a partial figure was presented as a complete total.</td>
    </tr>
    <tr>
      <th scope="row">Next action</th>
      <td>Investigate the retrieved records, instructions and grading rules before approving the change.</td>
    </tr>
  </tbody>
</table>
</div>

The failure identifies behavior that needs attention. It does not, by itself, establish the cause. Perhaps the search process missed available records. Perhaps the assistant ignored the report’s exclusions. Perhaps the product never specified what to do with incomplete information.

Running an eval does not repair any of those problems. It gives the team evidence with which to investigate them.

This is why domain specialists belong in evaluation design. Engineers can build the machinery, while finance, operations or customer-support specialists help establish what a correct result means. If finance defines spending as payments made and procurement means purchase orders issued, the product team must resolve that difference—or specify when the assistant should present both measures.

As I argued in [*How to Communicate in a World of AI*](https://tedt.org/How-to-Communicate-in-a-World-of-AI/), specifications preserve intent. Here, that intent must reach the grading rules. “Be accurate” leaves too much unstated. “Do not present production-only costs as a company-wide total” is a requirement someone can test.

The grader also needs scrutiny. Give it a well-cited answer from the wrong quarter. Give it a correct answer phrased differently from the reference answer. Check whether it rejects the misleading response and accepts the valid one.

Then connect those results to a decision.

Suppose the team is considering a faster, cheaper version of the cloud-cost assistant. Its overall evaluation score improves, but it now presents production-only costs as total company spending.

Before testing, the product owner and finance specialist agreed that this failure would block release. The team therefore holds the update, investigates the defect, makes a change, and reruns the relevant tests. It also checks that the assistant still answers directly when complete records are available.

This is a hypothetical release decision, but it illustrates the practical value of evals. An aggregate improvement does not settle whether a change meets the product’s requirements. The team needs to know which behaviors improved, which deteriorated, and whether any failure violates a requirement it considers essential.

Those requirements should reflect the consequences of the work. A confusing sentence and an unsupported financial total need not carry the same weight.

There is also a cost to excessive caution. The financial-query study found that one intervention reduced wrong answers while introducing unnecessary clarification. Stronger models handled some missing-information tasks successfully. More questions were not a universal improvement. [*Right Numbers, Wrong Questions*](https://arxiv.org/html/2610.38631v1).

For our cloud-cost assistant, the team should therefore test both conditions: incomplete records should prevent an unsupported total; complete records should produce a direct answer. If an approved definition of spending already exists, the assistant should use it rather than repeatedly asking the user to define the term.

The team can track consequential errors, unnecessary questions, unresolved requests and time to completion separately. That makes it easier to see whether a proposed improvement helps users finish their work or merely transfers more effort to them.

A passing evaluation remains bounded evidence. It shows how the system performed on selected cases under particular grading rules. It does not guarantee every future response. A live check of an individual answer is a separate control, whose effectiveness can itself be evaluated.

These tests also need to continue as the product changes. A different model, revised instruction, new search process or renamed data field can alter behavior. As [*Dev, Test, and Prod Still Matter: What Gets Deployed Has Changed*](https://tedt.org/Dev-Test-and-Prod-Still-Matter-What-Gets-Deployed-Has-Changed/) explains, assurance needs to follow the system being deployed.

<section id="evaluation-lab-exercise" class="my-4" aria-labelledby="evaluation-lab-heading">
  <h2 id="evaluation-lab-heading">Try it: follow an answer from evidence to release</h2>
  <p>The <a href="https://tedt.org/ai-evaluation-lab/">Founding Documents AI Evaluation Lab</a> puts these ideas into practice with public U.S. documents. Its first exercise confuses amendments proposed in 1789 with those ratified in 1791. Follow the retrieved passage, compare the graders, and decide whether the answer meets the requirement for release.</p>
  <details id="evaluation-lab-demo" class="border rounded-3">
    <summary class="p-3 bg-body-tertiary">
      <span class="fw-semibold">Interactive lab: follow the evidence and test the release decision</span>
      <span class="d-block small fw-normal mt-1">Six short lessons · about 20 minutes · no API key needed for replay</span>
    </summary>
    <div class="p-3 border-top">
      <p>Start in <strong>Replay</strong> with <strong>Candidate</strong> selected. This version passes more cases overall but fails one requirement that blocks release.</p>
      <ol>
        <li>Open the action trace and follow the citation to the passage the agent retrieved.</li>
        <li>Compare the weak checker with the task-specific grades. Notice which question each one answers.</li>
        <li>Choose <strong>Decide what can ship</strong>, then switch the agent version to <strong>Revised</strong>. Compare the results before changing the release policy.</li>
      </ol>
      <p>Replay uses authored teaching responses scored with Microsoft Agent Framework. Optional live runs use your own model connection. The lab also includes Python and React downloads for your own experiments.</p>
      <p><a href="https://tedt.org/ai-evaluation-lab/" target="_blank" rel="noopener">Open the lab in a new tab</a>. Select <strong>Interactive lab</strong> above again to collapse this exercise and return to the article.</p>
      <iframe id="article-evaluation-lab-frame" hidden data-src="https://evals.tedt.org/?embed=1" title="AI evaluation lab: inspect evidence, compare graders, and make a release decision" width="100%" height="1100" loading="lazy" style="display:block;width:100%;max-width:100%;border:1px solid var(--bs-border-color);border-radius:.375rem;"></iframe>
      <noscript><p>The interactive lab requires JavaScript. You can also <a href="https://github.com/TedTschopp/Evaluation-Reference/blob/main/docs/instructor-guide.md">read the instructor guide</a>.</p></noscript>
    </div>
  </details>
</section>
<script>
(function () {
  const exercise = document.getElementById("evaluation-lab-demo");
  const frame = document.getElementById("article-evaluation-lab-frame");
  if (!exercise || !frame) return;

  exercise.addEventListener("toggle", function () {
    if (!exercise.open) return;
    if (!frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.src);
    frame.hidden = false;
  });

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://evals.tedt.org" || event.source !== frame.contentWindow) return;
    if (event.data?.type !== "eval-lab-height" || !exercise.open) return;
    const height = Number(event.data.height);
    if (Number.isFinite(height)) frame.style.height = Math.max(700, Math.min(5000, height)) + "px";
  });
})();
</script>


A useful starting point is one answer the product currently passes. Change the scope of its evidence without changing the number. Remove a fact required for its conclusion. Then restore complete information.

Check whether the product limits its claims when the evidence is incomplete—and answers directly when the evidence is sufficient.
