Below is a **full, copy/paste-ready data definition for a single matrix cell** that’s:

* **LLM-friendly** (clear enums, consistent sections, minimal ambiguity)
* **human-editable** (YAML template)
* **extensible** (you can start small and fill in over time)
* **auditable** (IDs + rationale + references)

I’ll give you:

1. A **field-by-field data definition** (what each property means + type)
2. A **complete cell template** you can paste into every cell and fill in
3. Two **examples** (a “preferred” cell and a “not_supported” cell)

---

## 1) Cell data definition

A “cell” represents the intersection of:

* one **surface** (Web / Desktop / Mobile-Tablet / Voice)
* one **stack** (SPA Webapp / React-JS / Python / .NET / Swift-Apple)

### Required top-level fields

**`cell_id`**

* Type: `string`
* Format suggestion: `CELL-{SURFACE}-{STACK}-{NNN}`
* Purpose: Traceability and stable references in outputs (LLMs can cite it)

**`surface_id`**

* Type: `string` (must match your glossary keys)
* Example: `surface.web`

**`stack_id`**

* Type: `string` (must match your glossary keys)
* Example: `stack.react_js`

**`support_level`**

* Type: `enum string`
* Allowed values:

  * `preferred` → first-choice for this surface
  * `allowed` → acceptable without special approval
  * `exception` → requires explicit approval / review
  * `not_supported` → do not use
* LLM rule: Only pick `preferred`/`allowed` by default.

**`approved_technologies`**

* Type: `object` (structured categories)
* Purpose: The actual “tools you may use” for this cell.

### Strongly recommended fields (high value)

**`selection_guidance`**

* Type: `object`
* Purpose: Helps the LLM pick correctly and avoid “creative” wrong choices.
* Typical keys:

  * `intended_use_cases: string[]`
  * `anti_use_cases: string[]`
  * `decision_notes: string[]` (short, enforceable notes)

**`standards`**

* Type: `object`
* Purpose: Connect this cell to your standards library.
* Typical keys:

  * `required_additional: string[]` (standard IDs)
  * `recommended_additional: string[]` (standard IDs)
  * `overrides: object[]` (rare; must be explicit and justified)

**`constraints`**

* Type: `object`
* Purpose: Guardrails beyond “approved tools” (versions, hosting, security constraints).
* Typical keys:

  * `version_policy`
  * `hosting_deployment_constraints`
  * `data_security_constraints`
  * `performance_constraints`
  * `network_constraints`
  * `support_constraints`

**`deliverables`**

* Type: `object`
* Purpose: Artifacts required when this cell is used (ADRs, runbooks, etc.)

**`references`**

* Type: `object`
* Purpose: Links/IDs to internal docs, starter repos, templates.

### Conditional rules (so it stays consistent)

* If `support_level: not_supported`

  * `approved_technologies` should be `{}` (or omitted)
  * and include `selection_guidance.decision_notes` explaining why

* If `support_level: exception`

  * include `constraints.exception_process` + required artifacts

* If you “pin versions”

  * do it in `constraints.version_policy` (not scattered in notes)

---

## 2) Full cell template (paste this into any cell and fill in)

This is intentionally **fully expanded** so you can delete what you don’t need.

```yaml
cell_id: "CELL-WEB-REACTJS-001"
surface_id: "surface.web"
stack_id: "stack.react_js"

support_level: "preferred"  # preferred | allowed | exception | not_supported

selection_guidance:
  intended_use_cases:
    - "[FILL: e.g., internal web apps]"
    - "[FILL: e.g., customer-facing portals]"
  anti_use_cases:
    - "[FILL: e.g., offline-first mobile experiences]"
    - "[FILL: e.g., native iOS-only requirements]"
  decision_notes:
    - "[FILL: short rules-of-thumb the LLM should follow]"
    - "[FILL: e.g., prefer TS if available; otherwise JS with lint rules]"

approved_technologies:
  languages:
    - "[FILL: JavaScript]"
    - "[FILL: TypeScript (if approved for this cell)]"

  frontend:
    frameworks:
      - "[FILL: React]"
      - "[FILL: other approved web framework(s)]"
    routing:
      - "[FILL]"
    state_management:
      - "[FILL]"
    ui_components:
      - "[FILL: component library]"
    styling:
      - "[FILL: CSS modules/Tailwind/etc]"
    testing:
      unit:
        - "[FILL]"
      component:
        - "[FILL]"
      e2e:
        - "[FILL]"
    accessibility:
      tools:
        - "[FILL: lint tooling / testing tools if you mandate them]"

  backend:
    # If this cell includes backend (some orgs separate FE vs API standards)
    runtime:
      - "[FILL: Node.js LTS (if applicable)]"
    frameworks:
      - "[FILL]"
    api:
      styles:
        - "[FILL: REST]"
        - "[FILL: GraphQL (if approved)]"
      schema_contract:
        - "[FILL: OpenAPI, etc]"
    data_access:
      orm_or_query:
        - "[FILL]"
      migrations:
        - "[FILL]"
    testing:
      unit:
        - "[FILL]"
      integration:
        - "[FILL]"

  authn_authz:
    standards_or_patterns:
      - "[FILL: SSO pattern]"
      - "[FILL: OAuth/OIDC libs if standardized]"
    session_management:
      - "[FILL]"

  observability:
    logging:
      - "[FILL: structured logging library/approach]"
    metrics:
      - "[FILL]"
    tracing:
      - "[FILL]"
    error_reporting:
      - "[FILL]"

  security_tooling:
    dependency_scanning:
      - "[FILL]"
    sast:
      - "[FILL]"
    secrets_management:
      - "[FILL: tool name if you specify]"

  build_release:
    package_manager:
      - "[FILL: npm/yarn/pnpm]"
    linting:
      - "[FILL]"
    formatting:
      - "[FILL]"
    build_tools:
      - "[FILL: Vite/Webpack/etc]"
    ci_cd:
      - "[FILL: pipeline standard/tooling]"
    artifact_versioning:
      - "[FILL]"

  deployment:
    supported_patterns:
      - "[FILL: static hosting + CDN]"
      - "[FILL: container hosting]"
    infrastructure_constraints:
      - "[FILL: regions/accounts/tenancy rules]"
    config_management:
      - "[FILL]"
    rollback_strategy:
      - "[FILL]"

  documentation:
    required_docs:
      - "[FILL: README template]"
      - "[FILL: runbook template]"
      - "[FILL: ADR template]"

  notes:
    - "[FILL: anything else that is true but doesn’t fit above]"
    - "[FILL: keep this short; prefer structured fields over notes]"

standards:
  # These are IDs that map to your global standards library
  required_additional:
    - "[FILL: e.g., STD-WEB-001]"
    - "[FILL: e.g., STD-FE-002]"
  recommended_additional:
    - "[FILL: e.g., STD-PERF-001]"
  overrides:
    # Overrides should be rare; require justification.
    # Example override schema:
    # - target_standard_id: "STD-API-001"
    #   action: "modify"  # modify | waive
    #   justification: "Why this cell differs"
    #   replacement_requirements:
    #     - "Specific replacement rule here"
    []

constraints:
  version_policy:
    # Put your version pinning rules here
    runtime:
      - rule: "[FILL: e.g., Node must be Active LTS]"
        pinned_versions: ["[FILL if you pin exact versions]"]
    frameworks:
      - rule: "[FILL: e.g., use approved major versions only]"
        pinned_versions: []
    dependency_policy:
      - "[FILL: e.g., no unmaintained packages; weekly dependabot reviews]"

  hosting_deployment_constraints:
    - "[FILL: e.g., must run in approved cloud environment]"
    - "[FILL: e.g., only approved regions]"
    - "[FILL: e.g., TLS termination requirements]"

  data_security_constraints:
    data_classification_allowed:
      - "[FILL: e.g., Internal]"
      - "[FILL: e.g., Confidential]"
    encryption:
      in_transit: "[FILL: required]"
      at_rest: "[FILL: required]"
    secrets:
      - "[FILL: no secrets in env files checked into repo]"
    pii_phi_constraints:
      - "[FILL: if applicable]"

  performance_constraints:
    - "[FILL: e.g., SPA bundle size budgets]"
    - "[FILL: e.g., p95 latency targets for APIs]"

  network_constraints:
    - "[FILL: e.g., must work behind corporate proxy]"
    - "[FILL: e.g., no inbound connections allowed]"

  support_constraints:
    support_model: "[FILL: team oncall vs central]"
    sla_tier: "[FILL]"
    logging_retention: "[FILL]"

  exception_process:
    required_when_support_level_is_exception: true
    required_artifacts:
      - "Architecture Decision Record (ADR)"
      - "Security review notes"
      - "Operational/runbook plan"
    approver_roles:
      - "[FILL: Architecture Review Board]"
      - "[FILL: Security]"

deliverables:
  required:
    - "[FILL: ADR for major design decisions]"
    - "[FILL: Runbook]"
    - "[FILL: Threat model if handling sensitive data]"
  recommended:
    - "[FILL: Load test report]"
    - "[FILL: Cost estimate]"
  templates:
    adr_template_ref: "[FILL: internal doc id/link]"
    runbook_template_ref: "[FILL]"
    repo_template_ref: "[FILL]"

references:
  internal_docs:
    - title: "[FILL]"
      ref: "[FILL: URL or doc ID]"
  repo_templates:
    - name: "[FILL]"
      ref: "[FILL]"
  examples:
    - description: "[FILL]"
      ref: "[FILL]"

ownership:
  primary_owner: "[FILL: team name]"
  stewards:
    - "[FILL: platform team]"
    - "[FILL: security partner]"
  review_cycle:
    frequency: "[FILL: quarterly]"
    next_review_due: "YYYY-MM-DD"
```

---

## 3) Example: a “preferred” cell (Web + Single Page Webapp)

This shows how to represent the idea that **SPA is a delivery style**, and may require a separate backend stack selection.

```yaml
cell_id: "CELL-WEB-SPA-001"
surface_id: "surface.web"
stack_id: "stack.spa_webapp"
support_level: "preferred"

selection_guidance:
  intended_use_cases:
    - "Web user interfaces requiring rich client-side interactivity"
    - "Internal portals and dashboards"
  anti_use_cases:
    - "SEO-critical public marketing sites (unless SSR is explicitly approved)"
  decision_notes:
    - "This cell governs UI delivery style (SPA). Backend/API stack must be selected separately."
    - "Prefer reuse of shared API standards across surfaces."

approved_technologies:
  frontend:
    app_style:
      - "Single Page Application (SPA)"
    routing:
      - "[YOUR APPROVED ROUTER]"
    state_management:
      - "[YOUR APPROVED STATE TOOL]"
    build_tools:
      - "[YOUR APPROVED BUILD TOOL]"
    testing:
      unit: ["[YOUR UNIT TEST TOOL]"]
      e2e: ["[YOUR E2E TOOL]"]
  deployment:
    supported_patterns:
      - "Static hosting + CDN"
  notes:
    - "Backend/API technologies are defined by the selected backend stack cell."

standards:
  required_additional:
    - "STD-WEB-001"
    - "STD-FE-001"
  recommended_additional:
    - "STD-PERF-001"
  overrides: []

constraints:
  performance_constraints:
    - "Define and enforce bundle size budgets."
  version_policy:
    frameworks:
      - rule: "Use approved major versions only."
        pinned_versions: []
  hosting_deployment_constraints:
    - "Use approved static hosting pattern."

deliverables:
  required:
    - "Runbook"
    - "ADR for UI architecture"
references: {}
ownership:
  primary_owner: "[TEAM]"
  stewards: ["[TEAM]"]
  review_cycle: { frequency: "quarterly", next_review_due: "YYYY-MM-DD" }
```

---

## 4) Example: a “not_supported” cell (Voice + Swift Apple)

```yaml
cell_id: "CELL-VOICE-SWIFT-001"
surface_id: "surface.voice"
stack_id: "stack.swift_apple"
support_level: "not_supported"

selection_guidance:
  intended_use_cases: []
  anti_use_cases:
    - "All voice solutions"
  decision_notes:
    - "Swift/Apple stack is not an approved implementation approach for the Voice surface in this standards matrix."

approved_technologies: {}

standards:
  required_additional: []
  recommended_additional: []
  overrides: []

constraints: {}
deliverables: {}
references: {}
ownership:
  primary_owner: "[TEAM]"
  stewards: []
  review_cycle: { frequency: "annual", next_review_due: "YYYY-MM-DD" }
```

---

## Practical tip: keep “approved_technologies” consistent across cells

Even if some categories are empty, keeping the same structure makes LLM outputs much more consistent (and easier to diff).

If you tell me what categories you *already* standardize on (for example: “we always specify testing tools, CI, deployment, observability”), I can slim the template to the exact set you need—so you’re not filling out fields you’ll never use.
