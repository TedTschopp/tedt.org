---
layout: reveal-integrated
title: "Master Professional Slide Archetypes"
permalink: /slides/master-professional-examples/
aspect_ratio: 16:9
date: 2025-01-17
categories: [Slides]
description: "Comprehensive gallery of professional slide types: agenda, section breaks, KPIs, timelines, process flows, comparisons, quotes, team, appendix & more."
image: /img/categories/artificial-intelligence.webp
image-alt: "Abstract AI themed background"
topics:
  - design
  - archetypes
  - presentation
preview_html: "<div class='preview-fragment'><h3>Professional Slide Archetypes</h3><p>Reusable patterns for executive decks.</p></div>"
# Canonical updated to self to avoid cross-deck duplication.
canonical: https://tedt.org/slides/master-professional-examples/
redirect_from:
  - /slides/master-professional-examples-old/
last_modified: 2025-02-10
---

<section>
  <h1>Professional Slide Archetypes</h1>
  <p>Ted Tschopp — The Tschopp Collective<br><strong>Reusable Patterns for Executive Communication</strong></p>
</section>

<section>
  <h2>Agenda</h2>
  <ol>
    <li>Context & Goals</li>
    <li>Current State</li>
    <li>Strategic Pillars</li>
    <li>Roadmap & Timeline</li>
    <li>KPIs & Outcomes</li>
    <li>Risks & Mitigations</li>
    <li>Next Steps / Q&A</li>
  </ol>
</section>

<section>
  <h2>Section Break</h2>
  <h3 class="fragment">Strategic Pillars</h3>
  <p class="fragment">Deep dive into capability layers & enablement path.</p>
</section>
{% include slides/section-break.html title="Strategic Pillars" subtitle="Capability Deep Dive" kicker="Enablement Path" %}

<section>
  <h2>Current State Snapshot</h2>
  <ul>
    <li class="fragment">Data Platform: Mature ingestion, emerging governance</li>
    <li class="fragment">Model Operations: Manual promotion workflows</li>
    <li class="fragment">Risk Management: Ad hoc documentation</li>
  </ul>
</section>

<section>
  <h2>Strategic Pillars</h2>
  <div class="columns">
    <div class="fragment">
      <h3>Architecture</h3>
      <p>Integrated model hubs & governed gateways.</p>
    </div>
    <div class="fragment">
      <h3>Governance</h3>
      <p>Transparent lifecycle & risk registry.</p>
    </div>
    <div class="fragment">
      <h3>Enablement</h3>
      <p>Developer productivity & ethical tooling.</p>
    </div>
  </div>
</section>

<section>
  <h2>Comparison Matrix</h2>
  <table>
    <thead>
      <tr><th>Option</th><th>Pros</th><th>Cons</th><th>Decision</th></tr>
    </thead>
    <tbody>
      <tr><td>Centralized Hub</td><td>Unified control</td><td>Potential bottleneck</td><td class="fragment highlight">✔ Selected</td></tr>
      <tr><td>Federated</td><td>Domain autonomy</td><td>Inconsistent standards</td><td class="fragment">✖</td></tr>
      <tr><td>Hybrid</td><td>Balanced governance</td><td>Higher coordination cost</td><td class="fragment">△ Future Eval</td></tr>
    </tbody>
  </table>
</section>

<section>
  <h2>Roadmap Timeline</h2>
  <div class="mermaid">
  timeline
    title Execution Roadmap
    Q1 2025 : Governance Framework Initiated
    Q2 2025 : AI Gateway MVP
    Q3 2025 : Model Hub Integration
    Q4 2025 : Developer Enablement Rollout
    2026 : Scale & Optimize
  </div>
</section>

<section>
  <h2>Process Flow</h2>
  <div class="mermaid">
  flowchart LR
    A[Intake] --> B[Risk Assessment]
    B --> C[Architecture Review]
    C --> D[Model Development]
    D --> E[Validation]
    E --> F[Deployment]
    F --> G[Monitoring]
    G --> H[Feedback & Improvement]
  </div>
</section>

<section>
  <h2>KPI Dashboard</h2>
  {%- comment -%} Replaced inline KPI list with reusable include to reduce duplication across decks. {%- endcomment -%}
  {% include slides/kpi-dashboard.html %}
</section>

<section>
  <h2>Data Visualization (Placeholder)</h2>
  <p class="fragment">Bar / line chart can be embedded via generated SVG or canvas. Use accessible labels.</p>
  <p class="fragment">Example placeholder:</p>
  <pre><code class="language-json">{
    "releases": [5,8,11,13],
    "riskCoverage": [55,60,73,95]
  }</code></pre>
</section>

<section>
  <h2>Risk & Mitigation Grid</h2>
  <table>
    <thead><tr><th>Risk</th><th>Impact</th><th>Probability</th><th>Mitigation</th></tr></thead>
    <tbody>
      <tr><td>Model Drift</td><td>High</td><td>Medium</td><td>Scheduled retraining triggers</td></tr>
      <tr><td>Opaque Decisions</td><td>Medium</td><td>Medium</td><td>Explainability layer integration</td></tr>
      <tr><td>Regulatory Change</td><td>High</td><td>Low</td><td>Adaptive policy rule engine</td></tr>
    </tbody>
  </table>
</section>

<section>
  <h2>Quote Slide</h2>
  <blockquote>“Strategy without governance is acceleration without brakes.”</blockquote>
  <p class="fragment">— Ted Tschopp</p>
</section>

<section>
  <h2>Team Introduction</h2>
  <div class="columns">
    <div class="fragment"><strong>Architecture Lead</strong><br>T. Tschopp</div>
    <div class="fragment"><strong>Data Steward</strong><br>A. Analyst</div>
    <div class="fragment"><strong>Risk Partner</strong><br>R. Manager</div>
    <div class="fragment"><strong>Dev Enablement</strong><br>D. Engineer</div>
  </div>
</section>

<section>
  <h2>Call to Action</h2>
  <p class="fragment">Align roadmaps with governance milestones.</p>
  <p class="fragment">Accelerate shared model reuse.</p>
  <p class="fragment">Embed observability earlier.</p>
</section>

<section>
  <h2>Thank You</h2>
  <p>Questions? Explore additional resources in the appendix.</p>
</section>

<section>
  <h2>Q&A</h2>
  <p class="fragment">Discussion Points: Prioritization, Tooling, Resource Alignment.</p>
</section>

<section>
  <h2>Appendix</h2>
  <ul>
    <li>Glossary</li>
    <li>Reference Architecture Diagram(s)</li>
    <li>Policy Frameworks</li>
    <li>Extended KPI Definitions</li>
  </ul>
</section>
