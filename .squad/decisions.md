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
