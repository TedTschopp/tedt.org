# Squad Decisions

## Active Decisions

### 1. Product Audit — tedt.org — May 2026

**Date:** 2026-05-28  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** product-audit  
**Status:** active

**Key Findings:**
- **3 P0 Blockers** within 5 days: Node.js 20 CI deprecation (June 2), GitHub Pages artifact at 1.16 GB (limit 1 GB), 3,457 internal HTMLProofer failures (non-blocking).
- **1,009 posts** across 13 directories; 33 active categories; 10 accepted ADRs.
- **Template defect:** 234 `<img>` tags with no `src` attribute in rendered HTML — production bug affecting hundreds of pages.
- **Ruby test blindness:** `check_image_paths.rb`, `check_image_alt_text.rb`, `check_no_backup_posts.rb` crash on YAML Date constants; all 1,009 posts invisible to test harness.
- **36 tracked `.bak` files** from 2026-03-07 refactor; excluded from build but in git.
- **Mastodon gap:** ~800 posts have no `mastodon-post-id` field; backfill infrastructure exists.

**Prioritized Plan:**
- **Quick Wins (QW1–QW9):** Node.js 24 action updates, cache rebuild, Ruby test fixes, icon.webp fix, README TOC sync, ADR ratification.
- **Medium-Term (MT1–MT9):** Identify/fix `<img>` defect (highest ROI), remove `.bak` files, fix Monster Manual paths, fix category slugs, move large media to CDN.
- **Strategic (ST1–ST6):** Decompose `default.html`, extend cache index for prompts, tighten CI gates, Mastodon syndication decision, WIP triage, slides strategy.

**Three Critical Actions (My Call):**
1. Update GitHub Actions versions by June 2.
2. Find and fix the `<img>` no-src Liquid defect.
3. Commit `.squad/` infrastructure to git for durability.

**Rating:** Architecture is well-designed (ADRs, registry-driven theming, performance caching). Risks are execution debt and CI hygiene, not fundamental design.

---

### 2. Site Architecture Status Assessment — May 2026

**Date:** 2026-05-28  
**Author:** Galadriel (Site Architect)  
**Type:** architectural-assessment  
**Status:** draft

**Scope:** Full architectural scan of `_config.yml`, Gemfile, `_layouts/`, `_includes/`, `_data/category_registry.yml`, `_plugins/`, ADRs, CI workflows, tests, and `.squad/`.

**Architectural Health:**
- **Strong:** Data architecture (registry-driven), template structure (modular), CI/quality gates, governance/ADRs, test coverage, dependency management.
- **Weak:** Source hygiene (36 `.bak` files, untracked `.squad/`).

**Top 5 Recommendations:**
1. **Remove all 36 `.bak` files from git** (high priority, low effort).
2. **Decompose `default.html` (630 lines) into named sub-includes** (medium priority, medium effort).
3. **Add prompt tag index to `category_recent_index.rb`** to eliminate 3 `site.posts` scans in `prompt-details.html` (medium priority, ADR 0008 deferred work).
4. **Formally accept or reject ADR 0004** — Prompt Library is implemented; decision just needs documentation.
5. **Commit `.squad/` to version control** for durability of governance artifacts.

**ADR Findings:**
- ADR 0004 (Prompt Library): Fully implemented but status remains "Proposed" — documentation debt.
- ADR 0005 (Hex Overlay): May also be implemented; needs status resolution.

---

### 3. Quality Scan Report — tedt.org

**Date:** 2026-05-28  
**Author:** Samwise (Quality Steward)  
**Type:** quality-assessment  
**Status:** active

**Core Status:** Site deploys successfully; all core gates pass. However, **quality checks are non-blocking** and three issues need immediate attention.

**Passing Checks (14):** Build, feeds, legacy keys, Mastodon sync, CSS sync, category fonts, sitemap, no backup posts, CI steps, all others.

**Warnings (4):**
1. **`recent_by_category` Cache Drift (Middle-earth):** Fix: clean rebuild.
2. **YAML Front Matter Parse Failures:** Test scripts fail on `Date` constants; all 1,009 posts invisible to image/alt-text audits.
3. **README TOC Drift:** Run `make docs-toc`.
4. **Feed Diff — 5 Removed Items:** Update `tests/feed_snapshots/` baseline.

**High Risk (3):**
1. **HTMLProofer: 3,457 Internal Failures (Non-Blocking):** 234 `<img>` with no `src`, 588 Monster Manual images broken, 11 broken asset links, 2 broken scripts, structural template issues. `continue-on-error: true` masks all from CI.
2. **Node.js 20 Deprecation (June 2, 2026):** Actions will be forced to Node.js 24; pipeline breakage imminent.
3. **GitHub Pages Artifact: 1.16 GB (Limit 1 GB):** Large audio files (57 MB), PSD (43 MB), DAT (34 MB), Playwright screenshots, htmlproofer logs. Risk: deployment failure on any size increase.

**Asset Hygiene:** 115+ large files tracked in git; allowlisted PSD and others.

**CI Gate Architecture:** Both a11y and HTMLProofer have `continue-on-error: true` — quality gates are advisory, not enforced.

**Prioritized Actions:**
- **P0 (This Week):** Update GitHub Actions for Node.js 24; fix `<img>` no-src template defect.
- **P1 (This Sprint):** Regenerate cache, fix icon.webp, fix tools/todo_hex.html, fix category links, update feed snapshots.
- **P2 (This Quarter):** Fix Ruby test YAML parsing, audit Monster Manual paths, fix Swiss Folklore permalink, update README TOC.
- **P3 (Ongoing):** Reduce artifact below 1 GB, tighten CI gates, track a11y violation budget.

---

### 4. Backlog Restructure — May 2026

**Date:** 2026-05-28T16:22:10.035-07:00  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** backlog-management  
**Status:** complete

## What Was Done

Performed a full GitHub issue backlog audit and restructure for TedTschopp/tedt.org.

### Milestones Created
- **2026-Q2: Critical Fixes** (milestone #3) — P0/P1 items, due 2026-06-30
- **2026-Q3: Site Health** (milestone #2) — P2/P3 items, due 2026-09-30

### Labels Created
- `P0`, `P1`, `P2`, `P3` — priority tiers
- `mastodon`, `governance`, `git-hygiene`, `audit-2026-05`, `ci-cd` — domain/tracking labels

### New Issues Created (13 total from May 2026 audit)

**P0 — 2026-Q2: Critical Fixes**
- #150 Update GitHub Actions from Node.js 20 → 24 (deadline June 2)
- #151 Fix `<img>` no-src Liquid defect (234 pages)
- #152 Reduce GitHub Pages artifact below 1 GB (currently 1.16 GB)

**P1 — 2026-Q2: Critical Fixes**
- #153 Fix YAML Date constant crashes in Ruby test harness (1,009 posts invisible)
- #154 Fix 588 broken Monster Manual image paths
- #155 Update feed snapshot baselines (5 removed items)
- #156 Fix 11 broken internal asset links + 2 broken script refs
- #157 Enforce CI quality gates (remove continue-on-error) — depends on #151 #154 #155 #156

**P2 — 2026-Q3: Site Health**
- #158 Remove 36 .bak files from git
- #159 Commit .squad/ governance artifacts to git
- #160 Accept ADR 0004 (Prompt Library — implemented, docs debt)
- #161 Resolve ADR 0005 (Hex Overlay — accept or reject)

**P3 — 2026-Q3: Site Health**
- #162 Mastodon backfill: syndicate ~800 posts (depends on #142)

---

### 5. PR Review & Triage — May 28, 2026

**Reviewer:** Aragorn (Lead/Product Owner)  
**Date:** 2026-05-28T16:48:29.411-07:00  
**Context:** 13 open PRs spanning security patches, dependency bumps, action updates, and security fixes. P0 blocker: Node.js 20 deprecation (June 2).

#### TEAM-APPROVABLE (Merge now)

**PR #149** — addressable 2.8.7 → 2.9.0 (security patch)
- Status: MERGEABLE, CLEAN, build SUCCESS
- Risk: None
- Action: Merge. No dependencies; security improvement.

**PR #148** — actions/github-script 7 → 9
- Status: MERGEABLE, CLEAN, build SUCCESS
- Risk: None. Action v7 → v9 is stable; widely adopted.
- Action: Merge. Critical for June 2 deadline.

**PR #146** — actions/deploy-pages 4 → 5
- Status: MERGEABLE, CLEAN, build SUCCESS
- Risk: None. Standard action upgrade; proven compatible.
- Action: Merge. Critical for June 2 deadline.

**PR #145** — flatted 3.3.3 → 3.4.2
- Status: MERGEABLE, CLEAN, build SUCCESS
- Risk: None. Patch within compatible range.
- Action: Merge.

**PR #137** — Fix CodeQL alert 295 (DOM text reinterpreted as HTML)
- Status: MERGEABLE, CLEAN, draft PR, all CodeQL checks SUCCESS
- Risk: Low. Fix validates URLs before navigation; prevents javascript: and data: schemes.
- Action: Team approval pending draft author sign-off. Ted should confirm intent; fix is sound and ready.

#### HUMAN FULL REVIEW

**PR #139** — actions/upload-artifact 6 → 7
- Status: MERGEABLE, UNSTABLE, build FAILURE (Mar 8, 2026)
- Risk: Build failure is old (2.5 months) and likely caused by state of main, not PR #139 itself. However, failure needs investigation before merge.
- Action: Rebase to current main and retry. If passes, merge. If not, investigate root cause.
- Urgency: HIGH — Critical P0 for Node.js 24 compatibility.

#### CLOSE (Stale / Conflicting / Architectural Violation)

**PR #126** — ffi 1.16.3 → 1.17.2
- Violates ADR 0009 explicit pin. Current main explicitly re-pinned ffi to `= 1.16.3`.
- Action: CLOSE. If ffi needs bumping, require new ADR justifying the change.

**PR #134, #133, #132** — bundler-audit, google-protobuf, sass-embedded
- Status: CONFLICTING, DIRTY (6 months old)
- Action: CLOSE. Stale. Dependabot will recreate fresh.

**PR #131** — html-proofer 3.19.4 → 5.1.1
- Status: CONFLICTING, DIRTY (6 months old)
- Issue: Major version change with breaking API; 3,457 existing failures need fixing first.
- Action: CLOSE as stale. Track as deliberate P2/P3 migration work item, not a routine bump.

**PR #130** — actions/checkout 5 → 6
- Status: CONFLICTING, DIRTY (6 months old)
- Issue: Stale, critical for Node.js 24 compatibility. Needs recreation.
- Action: CLOSE. File new quick-PR for June 2 deadline.

**PR #129** — actions/setup-node 4 → 6
- Status: CONFLICTING, DIRTY (6 months old)
- Issue: Stale, critical for Node.js 24 compatibility. Needs recreation.
- Action: CLOSE URGENTLY. File new quick-PR for June 2 deadline.

---

### 6. Authoritative PR Verdict — May 28, 2026

**Date:** 2026-05-28T16:48:29.411-07:00  
**Author:** Aragorn (Lead / Product Owner) — Reconciliation of Samwise, Gimli, Boromir  
**Type:** pr-verdict-final  
**Status:** active

Final team call reconciliation:
- **TEAM-APPROVABLE now:** #149, #148, #146, #145
- **HUMAN FULL REVIEW:** #139, #137
- **CLOSE:** #134, #133, #132, #131, #130, #129, #126
- **Key rationale:** #129 and #130 should be closed and recreated urgently for current workflow updates; #131 should close because it is a dirty major-version migration; #126 should close due ADR 0009; #137 is technically sound but still draft and needs Ted's gate; #139 has unstable/failing CI and needs rebase or recreation before approval

---

### 7. Editorial Decision: Issue Template System Uplift

**Date:** 2026-05-28T16:22:10.035-07:00  
**Author:** Bilbo (Editorial Writer)  
**Type:** editorial-decision  
**Status:** complete

Replaced two existing catch-all issue templates with purpose-specific system:

| File | Purpose |
|------|---------|
| `UX-Issue.yml` | UX Enhancement (complete rewrite) |
| `full-featured-template.yml` | Bug Report (repurposed from generic catch-all) |
| `content-task.yml` | Content-layer work (new) |
| `architecture-task.yml` | ADR proposals and ratification (new) |
| `infrastructure-task.yml` | CI, deps, artifact size, GitHub Actions (new) |
| `config.yml` | Disables blank issues; adds ADR Index and Decisions Log as contact links (new) |

All 6 YAML files validated and parse without error. Acceptance criteria required on all templates. Priority scale aligned to audit P0–P3. ADR traceability on all forms. `blank_issues_enabled: false`.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
# Decision: Create Portable Squad Roster Export

**Date:** 2026-05-28T17:31:39.169-07:00  
**Actor:** Bilbo (Editorial Writer)  
**Status:** ✅ Executed

## Request
Ted Tschopp requested a single portable roster file that could be used elsewhere—human-readable, factual, and complete.

## What Was Done
Created `squad-roster-export.yaml` (9.6 KB) containing:
- **Top-level metadata**: project, generated_at, requested_by, source_files, universe
- **All 13 roster members**: 11 active agents (Aragorn, Galadriel, Arwen, Gandalf, Samwise, Boromir, Gimli, Bilbo, Elrond, Legolas, Faramir) plus Scribe and Ralph
- **Per-member details**: name, emoji, role, status badge, charter path, primary domains/ownership, routing notes
- **Project context**: owner, stack, creation date
- **Work routing table**: canonical mapping of work types to owners
- **Orchestration rules**: team coordination principles (eager spawn, Scribe always background, etc.)

## Why This Format
YAML was chosen for:
- Human readability (structured, comment-friendly, portable)
- Machine reusability (parses cleanly in Python, Ruby, Go, shell)
- Single-file simplicity (no dependencies, no nested calls needed to assemble roster)
- Durable storage (version-controllable if needed later)

## Sources & Accuracy
- **team.md**: roster table, member names, roles, status, charter paths
- **routing.md**: work type assignments, routing rules, issue label conventions
- **registry.json**: casting data (persistent names, universe, creation date, status)
- **charter.md files**: domain ownership, work style, boundaries, responsibilities
- No data was invented; missing fields were left unspecified rather than guessed

## Location
`/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/squad-roster-export.yaml`

## Reusability Pattern
This export can be:
- Imported into external team documentation
- Parsed by automation (Python/Ruby dict, JSON conversion, shell scripts)
- Shared across systems as a portable reference
- Updated by re-running the extraction process if roster changes

Future exports can follow the same structure and sourcing discipline.

## Decision Notes
- Emojis assigned based on role/domain (e.g., Bilbo → ✍️, Gimli → 🚀, Scribe → 📋)
- Status badges preserve team.md notation (✅ Active, 📋 Silent, 🔄 Monitor)
- All routing notes extracted verbatim or paraphrased from routing.md routing table
- Decision records reference this export for permanent roster snapshot
# Decision: Code Review Consolidation — May 2026

**Date:** 2026-05-28T19:08:13.048-07:00  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** backlog-management  
**Status:** complete

## Context

Six specialist code reviews (Galadriel, Arwen, Gandalf, Samwise, Boromir, Legolas) produced 35 findings spanning architecture, frontend, automation, quality, security, and performance domains. Task was to dedupe against 26 existing open issues, consolidate overlapping findings, and create a concise actionable backlog.

## Decision

Applied the following consolidation strategy:

1. **Merge overlapping findings** — Related findings from different reviewers combined into single issues when they address the same codebase area (e.g., prompt-library + prompt-details decomposition)

2. **Fold into existing issues** — Findings that extend scope of existing tracked work added as comments rather than new issues (e.g., mixed GH Actions versions folded into #150)

3. **Preserve domain separation** — Findings affecting distinct systems kept as separate issues even when related (e.g., Mastodon preflight #169 vs. Allure hardening #170)

4. **Priority alignment** — Assigned P1/P2/P3 based on impact and risk, not reviewer severity ratings

## Outcome

| Metric | Count |
|--------|-------|
| New issues created | 12 |
| Existing issues expanded | 2 |
| Duplicates avoided | 12 |
| Findings consolidated | 8 |

**Tracker issue #163 updated with grouped summary of all 12 new issues.**

## Issues Created

- #165 — Prompt tag index performance (P1)
- #166 — Prompt layout decomposition (P2)
- #167 — Mastodon component extraction (P2)
- #168 — External link security attributes (P2)
- #169 — Mastodon workflow preflight (P2)
- #170 — Allure history restore hardening (P2)
- #171 — Front matter validation (P2)
- #172 — Accessibility test expansion (P2)
- #173 — Cookie consent banner (P2)
- #174 — COPILOT_ASSIGN_TOKEN docs (P2)
- #175 — Service Worker offline fallback (P2)
- #176 — Python entry point standardization (P3)
- #177 — _code/ script documentation (P3)

## Rationale

Goal was **high-signal, minimal duplication**. The consolidation approach:
- Reduces cognitive overhead for assignees (one issue, complete scope)
- Prevents backlog fragmentation (no 20+ tiny issues)
- Maintains traceability (every finding maps to exactly one issue)
- Respects existing work (no duplication with #150, #66, #67, etc.)

## Artifacts

- Summary: `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/aragorn-issue-summary.md`
- Tracker comment: https://github.com/TedTschopp/tedt.org/issues/163
# Frontend Code Review Decision — May 2026

**Date:** 2026-05-28T19:08:13.048-07:00  
**Actor:** Arwen (Frontend Developer)  
**Type:** code-review-findings  
**Status:** recorded

## Summary

Completed read-only frontend review of tedt.org. Focused on Liquid templates, component structure, accessibility, responsive behavior, SCSS organization, and user-facing polish. Identified 6 high-signal findings.

## Key Findings

| Finding | Severity | Effort | Owner | Notes |
|---------|----------|--------|-------|-------|
| Extract Mastodon comments styles to SCSS | P2 | M | Arwen | 60+ lines inline; 6x `!important` flags |
| Decompose prompt-details.html (159 conditionals) | P2 | M | Arwen | Extract hero, tags, shell, series, related sections |
| Add rel="noopener noreferrer" to external links | P2 | S | Arwen | 5 `target="_blank"` links missing security attr |
| Consolidate inline media queries (10 locations) | P3 | M | Arwen | Split across prompt-vars, mermaid, all-css-includes |
| Refactor Mastodon comments tree (1,748 lines) | P3 | L | Arwen | Decompose styles, DOM, JS into sub-components |
| Centralize typography scale (52 inline rules) | P3 | M | Arwen | Consolidate into `_typography-scale.scss`; coordinate with #41 |

## Recommendation

- **Prioritize P2 items** (#1, #2) in next sprint — high polish/maintainability ROI
- **Include P2 #3** in next security refresh PR
- **Track P3 items** (#4, #5, #6) as strategic backlog; no urgency

## Non-Findings

- #151 (img no-src): Already tracked as production defect
- #156 (#157): Asset links + CI gates already have open issues
- This review focuses on structure and polish, not data hygiene

## Artifact

Review details: `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/arwen-review.md`
# Decision: Security & Privacy Codebase Review

**Date:** 2026-05-28T19:08:13.048-07:00  
**Author:** Boromir (Security & Privacy Steward)  
**Type:** security-review  
**Status:** complete

## Context

Ted requested a detailed code review of the website. As Security & Privacy Steward, I conducted a read-only review focused on dependency posture, secrets hygiene, analytics/privacy surfaces, third-party integrations, workflow safety, and automation blast radius.

## Findings Summary

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | No cookie consent banner for GA4/Clarity (session replay enabled) | P2 | **New issue recommended** |
| 2 | 36 .bak files in git (potential stale configs) | P3 | Covered by #158 |
| 3 | Node.js 20 deprecation deadline (June 2, 2026) | P0 | Covered by #150 |
| 4 | Mixed GitHub Actions versions (v4/v5 inconsistency) | P3 | **New issue recommended** |
| 5 | COPILOT_ASSIGN_TOKEN secret undocumented | P2 | **New issue recommended** |
| 6 | Mastodon mutation guard scope documentation | P3 | Partially covered by #142 |

## New Issues Recommended

### 1. [P2] Privacy: Implement Cookie Consent Banner Before Analytics Load

GA4 and Microsoft Clarity are active with session replay. `_config.yml` includes a privacy note recommending consent flow, but none exists. Under GDPR/CCPA, this may create compliance risk.

### 2. [P3] CI: Standardize GitHub Actions Versions Across Workflows

Mix of `@v4` and `@v5` across workflows creates maintenance debt. Should be standardized during Node.js 24 migration.

### 3. [P2] Docs: Document COPILOT_ASSIGN_TOKEN Secret Requirements

Secret referenced in squad workflows without documentation. Creates ops friction when configuring new environments.

## Positive Observations

- **Gemfile security:** Correctly enforces patched versions for nokogiri, google-protobuf on Ruby >= 3.1
- **ADR 0009 respected:** ffi pin correctly blocks PR #126
- **Analytics hardening:** `main-site-analytics.js` uses privacy-preserving defaults (anonymize_ip, no signals)
- **Workflow permissions:** All workflows use least-privilege blocks
- **Mastodon guard:** Mutation guard pattern in `mastodon-feed.yml` is a strong security practice

## Decision

This review is complete. I recommend:
1. Prioritize #150 (Node.js 20) — deadline in < 5 days
2. Create 3 new issues for consent banner, actions standardization, and secret documentation
3. Continue tracking #158, #142 for existing hygiene items

Full review artifact: `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/boromir-review.md`

---

*Reviewed by Boromir, Security & Privacy Steward*
# Architecture Review Report — tedt.org
**Date:** 2026-05-28T19:08:13.048-07:00  
**Author:** Galadriel (Site Architect)  
**Type:** architecture-review  
**Status:** complete

## Review Scope

Comprehensive read-only code review focusing on Jekyll structure, template boundaries, data-driven design, build strategy, plugin architecture, and maintainability across:
- Core layouts (default.html, prompt-details, prompt-library, category, etc.)
- Include organization and modularity
- Category registry and theming architecture
- Plugin strategy (category_recent_index, memory_probe, etc.)
- ADR governance and decision closure
- Existing open issues cross-reference

## Key Findings Summary

**6 strategic findings identified; 4 align with existing tracked issues; 2 are new.**

### Finding 1: ADR Ratification Gap (P2, Tracked)
ADR 0004 (Prompt Library Integration) and ADR 0005 (Hex Overlay) are fully implemented but retain "Proposed" status. Ratification is trivial effort with high clarity ROI. Maps to GitHub issues #160 and #161.

**Action:** Issue triage (Aragorn/Bilbo decision, not Galadriel).

---

### Finding 2: Prompt Tag Index Debt (P1, NEW)
`prompt-details.html` (1000 lines) and `prompt-library.html` (1883 lines) perform **3+ redundant site.posts scans each render** using `.slice: 0, 300+`. With 1,009 posts, this compounds to O(n) waste. ADR 0008 deferred this; now a strategic candidate for performance recovery.

**Evidence:** Multiple `| slice:` operations in both layouts; ADR 0008 lists as deferred work.

**Recommended action:** Extend `_plugins/category_recent_index.rb` to precompute `recent_by_series` and `recent_by_tags` indices, then refactor layouts to use cache instead of scans. Depends on ADR closure for clarity (Finding 1).

**Issue title:** `[P1] Extend category_recent_index to precompute prompt series and related-tag caches`

---

### Finding 3: .squad/ Durability Gap (P2, Tracked)
`.squad/` governance infrastructure (charters, decisions, rosters, history) is not version-controlled. Session filesystem loss = governance evaporation. Maps to GitHub issue #159.

**Action:** Commit `.squad/` to git (issue #159).

---

### Finding 4: default.html Decomposition (P3, Tracked)
`default.html` (630 lines) contains inline `<style>` blocks, MathJax config, and nested Liquid. Extracting sub-includes for head, theme vars, and math setup would improve readability and enable future refactors without monolithic touch. Maps to GitHub issue #67.

**Action:** Already tracked; deprioritized as P3 but valid refactoring candidate.

---

### Finding 5: Prompt Layout Scale Risk (P2, NEW)
Combined prompt layouts exceed 2800 lines. High correlation with merge conflicts, cognitive load, and bugs. Extracting cohesive sub-includes (series-nav, related-prompts, card template, filters) would lower coupling and enable fixture testing.

**Evidence:** prompt-library.html (1883 lines), prompt-details.html (1000 lines), complex filtering/series/related logic.

**Recommended action:** Decompose into `_includes/prompts/*.html` sub-includes; keep each layout <500 lines.

**Issue title:** `[P2] Refactoring: Decompose prompt-library and prompt-details layouts`

---

### Finding 6: _code/ Utility Documentation Debt (P3, NEW)
16+ prompt-related and automation scripts in `_code/` lack README, CLI versioning, or test coverage. Future developers must reverse-engineer script intent. Sustainable for small utilities; debt if extended.

**Evidence:** add_prompt_tags.py, convert_prompts_to_details.py, validate_prompts_yaml.py, etc. — no entry in architecture docs.

**Recommended action:** Create `_code/README.md` cataloging each script (purpose, usage, maintenance notes); standardize CLI args; mark deprecated scripts.

**Issue title:** `[P3] Document and organize _code/ utility scripts`

---

## Strategic Assessment

**Architectural Health: Strong**

✅ **Strengths:**
- Data-driven design (registry-driven theming, category taxonomy)
- Modular include structure (organized into subfolders: analytics, assets, layout, homepage, etc.)
- Performance caching strategy (ADR 0008, `category_recent_index`)
- ADR governance system (12 accepted + 2 pending decisions)
- Plugin discipline (custom generators, filters, probes)
- Dependency management (conditional security constraints, version pinning)

⚠️ **Execution Debt:**
- Prompt layouts approaching 2000 lines each (cognitive load)
- Redundant site.posts scans (deferred by ADR 0008, now ripe for addressing)
- Governance infrastructure (`.squad/`) not version-controlled
- Utility scripts lack centralized documentation

**Risk Profile:**
- No anti-patterns detected
- No fundamental architectural flaws
- Recommendations are *evolution*, not correction
- Tech debt is organizational, not structural

---

## Decision

All six findings are **valid architectural observations**. Four align perfectly with existing tracked issues (no duplicates); two are new strategic items worth adding to backlog.

**No new ADR required** — findings align with existing ADR framework (especially ADR 0008, 0001, 0002).

**Next steps** (for Ted / Aragorn):
1. Ratify ADR 0004 and ADR 0005 per GitHub issues #160, #161
2. File two new issues: Prompt Tag Index (P1) and Prompt Layout Refactoring (P2)
3. Consider P3 items (_code/ docs, default.html decomposition) for future sprint
4. Continue execution against existing P0/P1 blockers (Node.js 24, artifact size, <img> defect)

---

## Artifacts

- **Review artifact:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/galadriel-review.md`
- **Existing open issues validated:** #67, #159, #160, #161
- **New issues proposed:** 2 (Finding 2, Finding 5, Finding 6 optional)

---

## Handoff Notes

Review is **complete and read-only**. No changes made to codebase. Findings are architectural strategy recommendations, not bug fixes. Team decision required on issue priority and triage sequence.

Ted: If you agree with any findings, create corresponding GitHub issues or add to sprint backlog.
# Decision: Performance & Media Review Audit – May 2026

**Date:** 2026-05-28T19:08:13.048-07:00  
**Author:** Legolas (Performance & Media Optimizer)  
**Type:** audit-findings  
**Status:** recorded  

## Context
Performed comprehensive read-only review of tedt.org performance and media assets, cross-referencing against 18 open issues to identify opportunities and avoid duplicates.

## Key Findings
1. **Hero media footprint:** 11 WebP/MP4 pairs cached (good); 11 PNG fallbacks (44 MB unoptimized) available but not in service worker cache.
2. **Service Worker gap:** Cache-first strategy for hero media works, but no offline fallback if both cache miss + network unavailable.
3. **Font Awesome optimization:** Full CSS (~50+ KB) loaded site-wide; site uses ~30 icons. Subsetting opportunity.
4. **PWA manifest:** Link commented out; no `manifest.webmanifest` file. Prevents installability despite Service Worker registration.
5. **Homepage image loading:** Carousel correctly lazy-loads; hero image loads eagerly, delaying FCP.
6. **CSS/Font loading:** 15+ conditional stylesheets + 6 KB inline styles block rendering on first visit.

## Issue Mapping
- **Issue #88** (Image Optimization Audit): Covers hero PNG cleanup; recommend scope clarification.
- **Issue #68** (Image Loading Strategy): Covers homepage images; hero eager→lazy refactor needed.
- **Issue #66** (CSS & Font Loading): Covers CSS rationalization; Font Awesome subsetting is sub-task.
- **Issue #62** (PWA Manifest): Covers manifest; needs re-enable + scope definition.
- **New opportunity:** Service Worker offline fallback for hero media cache misses.

## Artifact
Review recorded at: `.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/legolas-review.md`

## Recommendation
1. Accept existing P2 issues (#68, #66, #62) without opening new duplicates.
2. Consider new issue for Service Worker offline fallback (low effort, high UX impact).
3. Asset cleanup (#152 GitHub Pages artifact size) will benefit from hero PNG removal.
4. Future CDN migration path recommended for videos (1.5–5.9 MB each; 11 pairs in repo).

## Next Steps
- Team review findings and close/clarify existing issues.
- Squad member responsible for #62 (PWA) to re-enable manifest and define scope.
- Squad member responsible for #68 to include hero image eager→lazy refactor.
# Quality Review Decision: Six Actionable Findings

**Date:** 2026-05-28T19:08:13.048-07:00  
**Author:** Samwise (Quality Steward)  
**Type:** quality-assessment  
**Status:** active

## Summary

Performed comprehensive QA review of tedt.org. Site builds and deploys successfully, but **two validation systems silently fail**, and **quality gates are non-blocking**. Six distinct findings documented; four are already in backlog, two are newly identified gaps.

## Findings & Recommendations

### P1 (Blocking)

**1. Ruby Test YAML Date Parsing — 18+ Posts Invisible to Image Audits**
- Impact: Image path and alt text validators crash on YAML `Date` constants; 18+ posts silently skipped
- Rootcause: `YAML.safe_load` requires `permitted_classes: [Date, Time]` but constant is undefined at runtime
- Tracking: #153
- Recommendation: Fix Date constant instantiation in tests/check_image_paths.rb and check_image_alt_text.rb

**2. Non-Blocking CI Quality Gates (HTMLProofer & a11y)**
- Impact: Both accessibility and link-integrity checks use `continue-on-error: true`; CI passes despite 234 `<img>` with no `src`
- Rootcause: `continue-on-error: true` masks 3,457 internal failures; gates are advisory, not enforced
- Tracking: #157
- Recommendation: Remove `continue-on-error: true` from a11y and htmlproofer steps **after** fixing #151 (img/src defect) and #154 (Monster Manual images)

### P2 (This Sprint)

**3. Front Matter Validation Gaps — No Required Field Checks**
- Issue: No validation that `image-alt` is present when `image` is present; no category slug validation; no date format checking
- Scope: New issue — not yet tracked
- Recommendation: Create comprehensive front matter schema validator; make it blocking on build
- Suggested title: `[P2] Add front matter validation: required field checks (image/image-alt, category slugs, date format)`

**4. Incomplete a11y Test Coverage**
- Issue: 10 a11y specs exist but don't systematically audit form labeling, ARIA, carousel keyboard, heading hierarchy, color contrast
- Scope: New issue — partially related to #88 (Image Audit)
- Recommendation: Expand Playwright suite with systematic pattern audits for accessibility compliance
- Suggested title: `[P2] Expand a11y test coverage: form labeling, ARIA, carousel keyboard nav, heading hierarchy`

**5. Monolithic Template Complexity (630–1,883 lines)**
- Issue: prompt-library (1,883L), prompt-details (1,000L), default (630L) layouts exceed maintainability thresholds
- Tracking: #67 (partially covers default.html)
- Recommendation: Decompose into focused sub-includes; establish regression tests per layout
- Note: This is strategic refactoring; schedule before major feature work on these layouts

**6. Feed Snapshot Baseline Drift (No Clear Workflow)**
- Issue: 5 feed items differ; no clear escalation between "refresh baseline" vs. "investigate diff"
- Tracking: #155 (partially covers)
- Recommendation: Document semi-automated baseline refresh with audit trail; add age warning if baseline >7 days stale

## Quality Posture Assessment

- **Build Health:** ✓ Site builds and deploys successfully on every PR
- **Test Coverage:** ⚠️ 2 validators silently skip 18+ posts; a11y tests incomplete
- **CI Enforcement:** ⚠️ Quality gates are advisory (continue-on-error); real failures masked
- **Template Debt:** ⚠️ Three layouts >600 lines; maintainability risk
- **Validation Completeness:** ⚠️ Front matter lacks required field checks; feed baseline unclear

## Team Decision

1. **Immediately prioritize** #153 and #157 (P1 blocking issues) before next release
2. **Scope next sprint** to include the two NEW P2 issues (front matter validation + a11y coverage) for estimation
3. **Document feed baseline workflow** in #155 resolution to clarify automation scope
4. **Schedule template decomposition** (#67, #5, #6 synthesis) as preparatory work before next feature wave

## Rationale

This review was driven by regression risk mitigation. Two validation systems currently **fail silently**, and quality gates are **non-blocking**. Addressing P1 items closes the blind spots and enforces gates properly. The P2 gaps prevent future regressions and reduce maintainability debt.

---

*Delivery: Review artifact created at `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/samwise-review.md`*


