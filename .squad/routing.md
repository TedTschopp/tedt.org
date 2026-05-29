# Work Routing

How to decide who handles what on tedt.org.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Scope, priorities, and final review | Aragorn | decisions, acceptance criteria, reviewer gates, conflict resolution |
| Site architecture and build strategy | Galadriel | Jekyll structure, GitHub Pages constraints, Ruby build decisions |
| Frontend UI and templating | Arwen | layouts, includes, SCSS, UI polish |
| Automation and integrations | Gandalf | feed generation, Mastodon sync, workflow automation, utility scripts |
| Quality, accessibility, and regressions | Samwise | build QA, link checks, accessibility, regressions |
| Security and privacy review | Boromir | dependencies, secrets, analytics privacy, automation safety |
| Release and DevOps readiness | Gimli | CI stability, Pages deploys, workflow failures, merge readiness |
| Editorial and documentation | Bilbo | docs, prose, descriptions, SEO copy, readability |
| Taxonomy, schema, and content modeling | Elrond | front matter design, schema markup, category structure |
| Performance and media optimization | Legolas | images, fonts, PWA, Lighthouse, media assets |
| Search and discovery | Faramir | search, tags, related content, navigation |
| Decision capture and session logging | Scribe | decisions, assumptions, handoffs, session logs |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze the issue, assign the right `squad:{member}` label, and note routing | Aragorn |
| `squad:{member}` | Pick up issue and complete the work in that member's domain | Named member |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, **Aragorn** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern and pull Aragorn in only when a trade-off needs a call.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. The Lead handles all `squad` (base label) triage.
