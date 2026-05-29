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

### 8. Märchen Engine Content Review — Editorial Findings

**Date:** 2026-05-28T20:41:20.012-07:00  
**Author:** Bilbo (Editorial Writer)  
**Type:** content-review  
**Status:** awaiting-decision

**Summary:** Completed editorial review of the Märchen Engine (1 published post + 18 WIP docs). The system has a **strong, differentiated identity** (fairness-centric, innovative mechanics, three-realm magic) but the **WIP corpus lacks integration narrative**. The published intro is publication-ready (with minor edits); most WIP pieces need structural work before they cohere.

**Key Strengths:**
- Published intro balances accessibility with depth; warm and inclusive tone
- 4D8 system mechanically elegant and ties to human aspects
- Three-Realms magic system conceptually coherent and ambitious
- Morality aspects theoretically grounded
- Social Combat ("Engagement") is a full subsystem, not a skin

**Blocking Issues (P1):**
1. **No system integration narrative** — WIP files read as isolated modules. Needs: System Architecture Overview document
2. **No character creation process** — Players can't make a character from existing material. Needs: Character Creation chapter

**High-Priority Issues (P2):**
3. Inconsistent terminology and voice across documents
4. Magical Schools lack mechanical grounding — beautiful concepts but no casting rolls, resources, or time costs defined
5. Moral Aspects lack mechanical hooks — philosophical but not playable
6. Bastion Rules appear D&D-copied; no Märchen DNA
7. Incomplete / draft content scattered in WIP folder

**Readiness Ranking:**
- Published Intro: ✅ Minor edits (~30 min)
- 4D8 System: ⚠️ Add 1 example (~1 hr)
- Engagement / Social Combat: ⚠️ Integration note + example (~1.5 hrs)
- Magical Schools: ⚠️ Casting framework (~3 hrs)
- Morality Aspects: ⚠️ Mechanical hooks (~2 hrs)
- Adventure Structure: ❌ Rewrite or cut (~4 hrs)
- Bastion Rules: ❌ Replace or integrate (~4 hrs)
- Incomplete docs: ❌ Move to drafts or complete (~2 hrs)

**Decisions Needed (For Ted):**
1. **Publication Timeline:** Will Märchen Engine be published as a complete book, or as incremental blog posts?
2. **Book Structure:** Should Character Creation be a dedicated chapter, or woven into the intro?
3. **Bastion Integration:** Keep, replace, or integrate Bastion rules with moral/realm mechanics?
4. **WIP Folder Cleanup:** Should incomplete docs be moved to `_drafts/`, marked with `[INCOMPLETE]` prefix, or deleted?

**Recommended Next Steps:**
- Write System Architecture Overview (3–4 hrs) — unblocks everything
- Write Character Creation chapter (2–3 hrs)
- Add Casting Framework to Magical Schools (2–3 hrs)
- Establish Märchen Style Guide + standardize terminology (2–3 hrs)
- Migrate incomplete docs; mark stubs (1–2 hrs)

**Full Artifact:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/marchen-engine-review/bilbo-feedback.md`

---

### 9. Märchen Engine Publishing Strategy

**Date:** 2026-05-28T20:41:20.012-07:00  
**Author:** Elrond (Information Architect)  
**Type:** strategic-decision  
**Status:** awaiting-decision

**Summary:** IA audit complete on Märchen Engine corpus (1 published intro + 21 WIP subsystem docs). Strong mechanics, fragmented information architecture. Publishing requires structural work before content ships.

**Key Decision Points for Ted:**

**1. Product Scope: Complete RPG vs. Modular Toolkit?**

**Option A: Complete Game (3–4 weeks)** — Ship full rules: core mechanics, all subsystems, ≥2 example campaigns. Benefit: high perceived value, one-stop-shop. Risk: higher QA burden, requires coordinating all subsystems.

**Option B: Modular Toolkit (1–2 weeks MVP)** — Ship core mechanics + 2–3 flagship subsystems (Magic Items, Social Combat, Legacy of Scars). Benefit: faster market entry, lower QA friction. Risk: may dilute perceived completeness.

**Recommendation:** Option B (modular). Deploy fast; let user feedback shape expansion.

**2. Character Creation: Extract, Formalize, or Defer?**

Currently embedded in published intro; not comprehensive. Blocking dependencies: Bastion rules assume character creation complete; Social Combat references character stats.

**Recommendation:** YES. Extract & publish standalone "Character Creation" post with races, skill assignment, companion/sanctuary selection, starting gear, advancement hooks. Effort: 4–6 hours.

**3. Publishing Order: Dependency vs. Value?**

**Tier 1 (Pub-ready):** Magic Items, Legacy of Scars, Social Combat
**Tier 2 (1–2 day polish):** Character Creation, Bastion, Campaign Example
**Tier 3 (consolidate/archive):** Morality, Knowledge Levels, Sketches

**Recommended Sequence:**
- Week 1: Formalize + publish Character Creation
- Week 1–2: Publish Magic Items, Legacy of Scars, Social Combat
- Week 2–3: Unified campaign example
- Week 3+: Bastion rules (rewritten for Märchen), consolidated Morality, advanced options

**Recommendation:** Follow Recommended Sequence. Chargen formalization gates all subsystems; once done, ship fast.

**4. Terminology & Glossary: Unify or Accept Variance?**

Terms redefined per subsystem (Rank, Bond, Influence, Skill Levels, Knowledge Tier). Creates friction for readers.

**Recommendation:** Option A (canonical glossary). Invest 2–3 hours now. Include: core task resolution, character building, social/narrative, item & nemesis, time scales. Link each definition to subsystem post where formalized. Front matter: `no_toc: true`, `series_step: 1.5`.

**5. Campaign Example: MVP or Full Arc?**

Current "Light of Life" is excellent but doesn't show subsystem integration.

**Recommendation:** Option A (MVP). 3–4 session example showing chargen → first encounter → Nemesis introduced → Bastion downtime → social negotiation. 1,500–2,000 words; 4–6 hours. **Proves** Nemesis + Bastion + Magic Items work together.

**6. Referee Support: Standardize or Keep Subsystem-Specific?**

Magic Items have excellent GM guidance; Social Combat minimal; Bastion D&D-ified.

**Recommended structure (all subsystem posts):**
- Prep Checklist
- Common Pitfalls
- Integration Notes
- House Rule Ideas

**Recommendation:** YES. Add to all published subsystem posts. Effort per subsystem: 30 min–1 hour. Standardization signals quality + helps adoption.

**Team Coordination Notes:**

- **Galadriel (Templates/Navigation):** Märchen Engine posts form a series. Homepage carousel should surface as collection (like "Prompts" or "Slides"). Consider new category/subcategory for "TTRPG Systems"?
- **Faramir (Taxonomy/Search):** Introduce new taxonomy: `Subsystem Type` (core, optional, setting-specific). Tag/metadata support to distinguish core mechanics from optional subsystems.
- **Aragorn (Content Strategy):** RPG schema expansion (issue #181) should account for Märchen Engine's `Story Thread Rank`, `Bond`, `Nemesis Tier` mechanics. Coordinate on front matter extensions.

**Ted to Decide:**
1. Choose product scope: Complete RPG or Modular Toolkit?
2. Approve publishing sequence or customize?
3. Confirm glossary investment: spend 2–3 hours now?
4. Commit to campaign example: Option A (MVP 4–6 hrs) or Option C (defer)?
5. Referee support: Add standardized GM guidance to all subsystem posts?

**Effort Estimate:** 12–18 hours for full MVP publication (chargen + Tier 1 subsystems + campaign example + glossary). Can be accomplished in 2–3 weeks at steady pace.

**Full Artifact:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/marchen-engine-review/elrond-feedback.md`

---

### 10. Märchen Engine Content Status Assessment — May 2026

**Date:** 2026-05-28T21:06:46.885-07:00  
**Owner:** Aragorn (Lead / Product Owner)  
**Type:** content-publication-readiness  
**Status:** active

I am establishing the authoritative assessment of Märchen Engine publication readiness and sequencing strategy. Key findings:

#### Verdict
- **Published intro:** Ready now (minor edit)
- **Tier 1 subsystems (Magic Items, Nemesis, Social Combat):** Ready with 1–2 hour polish per piece + worked examples
- **System-wide publication:** NOT READY without structural work

#### Blocking Issues (Must Fix Before Publishing Coherent Game Line)

1. **Character Creation (unpublished)** — No onramp for players; blocks all subsystems
2. **System Architecture Overview (missing)** — No integration narrative; subsystems feel isolated
3. **Series metadata (absent)** — Posts won't form discoverable collections
4. **Campaign proof-of-concept (missing)** — No evidence that systems work together

#### Mechanical Grounding Gaps

- **Magical Schools:** Beautiful but unmechanical; needs Casting Framework section
- **Morality Aspects:** Philosophical but rules-invisible; needs Mechanical Hooks section
- **Bastion Rules:** D&D-ified; needs Märchen flavor pass or native rewrite

#### Sequencing Strategy

**Phase 1 (This Week): Unblock Publishing**
- Write Character Creation chapter (~2–3 hours)
- Write System Architecture Overview (~2–2.5 hours)
- Add front-matter series metadata to all subsystems

**Phase 2 (Week 2): Build Reader Confidence**
- Publish Tier 1 subsystems (Magic Items, Nemesis, Social Combat) with worked examples
- Publish Character Creation (series_step: 2)
- Publish System Architecture Overview (series_step: 1)

**Phase 3 (Week 3): Mechanical Completion**
- Add Casting Framework; publish Magical Schools
- Add Moral Mechanics; publish Morality Aspects
- Publish Game Rules 4D8 with worked example

**Phase 4 (Week 4): Proof of Concept**
- Publish Unified Campaign Example (3,000 words, 6–12 session arc)
- This proves all systems interlock

**Post-Launch:** Setting modules, advanced subsystems, supplements

#### High-Leverage Moves (Next 5–7 Days)

1. Formalize Character Creation (prerequisite for all subsystems)
2. Write System Architecture Overview (proves coherence)
3. Add series metadata to 4 Tier 1 subsystems
4. Publish 1–2 Tier 1 pieces as proof-of-concept

#### Deliverable

- **Report created:** `MARCHEN-ENGINE-CONTENT-STATUS-REPORT.md`
- **Format:** Decision-oriented, actionable, file-by-file assessment
- **Includes:** Executive summary, current state, working pieces, gaps, publishability scorecard, priority roadmap, specific sequencing strategy

#### Team Impact

- **Bilbo (Editorial):** Use report as quality gate for WIP publishing. Before moving docs to `_posts/`, ensure they pass "mechanical clarity" test: Could a GM actually run this?
- **Elrond (Information Architect):** Coordinate front-matter standardization, series metadata, and reading order once Character Creation + System Architecture Overview are complete.
- **Ted (Author):** Make three decisions this week: (1) scope (complete RPG vs. modular toolkit?), (2) commit to Character Creation, (3) choose System Architecture style.

#### Deferred / Out-of-Scope

- Integration of Bastion Rules with moral framework (defer to decision; option to rewrite or replace)
- Setting modules (Light of Life, Alpine Mirror) — post-launch supplements after core rules stabilize
- Generic advice pieces without Märchen hooks — archive or expand

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


# Decision: Content Review Consolidation — May 2026

**Date:** 2026-05-28T19:53:42.576-07:00  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** backlog-management  
**Status:** complete

## Context

Three specialist content reviews (Bilbo, Elrond, Faramir) produced 24 findings spanning editorial quality, information architecture, and content discovery. Task was to dedupe against 26 existing open issues, consolidate overlapping findings, and create a concise actionable backlog.

## Decision

Applied the following consolidation strategy:

1. **Merge overlapping findings** — Related findings from different reviewers combined into single issues when they address the same content infrastructure (e.g., excerpt strategy + pillar pages)

2. **Fold into existing issues** — Findings that extend scope of existing tracked work referenced via comments rather than new issues (e.g., image-alt gap added to #171)

3. **Preserve domain separation** — Findings affecting distinct content types kept as separate issues (e.g., quotes #179 vs. slides #182)

4. **Priority alignment** — All content findings assigned P2; no P1 content blockers (escalation recommended for #171)

## Outcome

| Metric | Count |
|--------|-------|
| New issues created | 9 |
| Existing issues expanded | 1 |
| Duplicates avoided | 7 |
| Findings consolidated | 15 |

**Tracker issue #163 updated with grouped summary of all 9 new issues.**

## Issues Created

- #178 — SEO pillar pages and excerpt strategy (P2)
- #179 — Quote thematic curation (P2)
- #180 — README editorial guide (P2)
- #181 — RPG schema unification (P2)
- #182 — Slides gallery (P2)
- #183 — Tagging model standardization (P2)
- #184 — Prompt series adoption (P2)
- #185 — Related posts infrastructure (P2)
- #186 — Category landing page enhancements (P2)

## Rationale

Goal was **high-signal, minimal duplication**. The consolidation approach:
- Reduces cognitive overhead for assignees (one issue, complete scope)
- Enables parallel work on independent infrastructure (tags, series, related posts)
- Preserves traceability from reviewer findings to issue acceptance criteria
- Keeps backlog focused on actionable work, not fragmented observations

## Escalation Recommendation

Issue #171 (front matter validation) should be escalated from P2 to P1:
- 699 posts (69% of all images) missing `image-alt`
- WCAG 2.1 Level A non-compliance
- SEO penalty risk for indexed content
- Bulk of gap is Gamma World creatures; #181 (schema unification) enables remediation
# Follow-Up Audit Synthesis: Priority Decision

**Date:** 2026-05-28T20:09:45.997-07:00  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** prioritization  
**Status:** active  
**Distribution:** Squad leads, Engineering, Content Editor  

---

## Decision: Activate Three-Move Tranche Immediately

### Situation
Three specialist audits (Analytics/Automation, Discovery/Navigation, AI-SEO/Metadata) converge on identical bottleneck: **metadata infrastructure gaps (tags 31%, related 0%, series 5%) block every downstream feature.** Audits identify 24 findings across automation, discovery, and SEO lanes; all map to existing backlog issues #178–#186.

### Key Findings (Consensus)
- **Tag infrastructure #183** is a forcing function: unblocks filtering, clouds, discovery, attribution, and automation pipelines
- **Related-posts field #185** is immediate UX win: visible to readers; breaks content silos
- **Series adoption pilot #184** is proof-of-concept: motivates investment in editorial CLI

All three are prerequisites for medium-term work (slides gallery, category enhancements, pillar pages).

### Decision
**Activate three-move tranche for immediate execution** (week 1–3):
1. Tag infrastructure audit + plugin + archive pages (3–4 hrs) → Unblocks discovery, filtering, attribution
2. Related-posts field + sidebar card + seed data (2–3 hrs) → Breaks silos, bridges collections
3. Series adoption pilot + automation consolidation (2–3 hrs) → Proof-of-concept

**Defer everything else** to tier 2 (slides gallery, category pages, consent banner) and tier 3 (pillar pages, schema expansion) until metadata model stabilizes.

### Rationale
- **Data-driven:** All three audits independently recommend tag + related + series as critical blockers
- **Low risk:** Reuses existing patterns (templates, plugins, scripts already established)
- **Unblocking:** Clears path for 100+ posts of follow-on work
- **Team-ready:** Issues already created and consolidated; no scope ambiguity

### Acceptance Criteria
- [ ] Tag index plugin generates; 50+ posts tagged; `/tag/{slug}/` pages render
- [ ] Related-posts include created; 5+ high-traffic posts link manually; docs updated
- [ ] Series metadata populated on 5–10 prompts; prompt-details navigation functional; curation playbook documented
- [ ] Editorial CLI or consolidated script demonstrates metadata gap detection
- [ ] CI validation gates enabled (image-alt, feed integrity)

### Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| Series adoption feels empty if only 5–10 populated | Highlight proof-of-concept on Prompt Library page; document curation playbook |
| Tagging audit fatigue (1,000+ posts) | Start with top 50–100 by traffic; automation fills gaps; accept "good enough" |
| Related-posts maintenance burden (manual curation) | Seed high-traffic posts; automation can infer via tags in future; not every post needs field |

### Timeline
- **Week 1:** Tag infrastructure (infrastructure + audit)
- **Week 2:** Related-posts field (templates + curation seed)
- **Week 3:** Series pilot + automation consolidation (proof-of-concept + editorial CLI)

### Next Steps
1. **Engineering:** Coordinate tag index + related-posts includes + automation consolidation roadmap
2. **Content Editor:** Prepare tagging audit scope (top 50–100 by traffic); curation guide for series
3. **QA:** Define acceptance criteria for tag display, related-posts rendering, series navigation
4. **Product:** Track progress via GitHub project board; escalate blocking dependencies

---

**Authority:** Aragorn (Lead / Product Owner)  
**Approved:** 2026-05-28T20:09:45.997-07:00  
**Distribution:** Ted Tschopp, Squad leads
---
author: Bilbo (Editorial Writer)
date: 2026-05-28T19:53:42.576-07:00
status: pending_decision
---

# Decision Inbox: Content-Market Fit Strategy – Homepage Coverage Scope

## Context

During editorial review, found that homepage content filtering **intentionally excludes**:
- Quotes (separate carousel)
- Folklore, Bestiary, RPG Posts (niche categories)
- Prompts (different layout)
- Slides (different layout)

This keeps homepage focused on **Blog + Folklore carousel**, but **siloes high-value niche assets** from casual discovery.

## The Question

**Should homepage surface more niche content (RPG design, folklore, prompts), or keep current focused scope?**

### Option A: Keep Focused (Current)
**Pros:**
- Clean, fast homepage (fewer cards to render).
- Blog posts are primary discovery entry point.
- Niche content has dedicated pages; users can find via search/navigation.

**Cons:**
- RPG design essays (transferable to business strategy) buried.
- Prompt library (solves real work problems) undiscovered.
- Missed cross-pollination (blog post on "systems thinking" could link to Gamma World encounter using similar patterns).

### Option B: Add Thematic Bridges
**Approach:** Don't add more homepage cards, but **add "Related Resources" sections** to blog posts and create **cross-collection landing pages**.

**Pros:**
- Homepage stays clean; internal linking does the work.
- Users organically discover niche assets while reading related posts.
- SEO improves (more internal link equity).
- Better content-market fit (readers understand depth of your expertise).

**Cons:**
- Requires tagging + cross-linking infrastructure (small lift).
- More editorial curation needed per post.

### Option C: Add Niche Carousel Hint
**Approach:** Add small "Explore More" section on homepage (e.g., "Also in this collection: RPG Design, Folklore, Prompts") with light cards or dropdown.

**Pros:**
- Signals content breadth without cluttering homepage.
- Users know assets exist.
- Builds traffic to niche sections.

**Cons:**
- Homepage becomes busier; design trade-off.
- Requires updated design/layout.

## Recommendation (Editorial perspective)

**Option B + small Option C** — Keep homepage clean, but:
1. Build content bridges (related resources, cross-links).
2. Create 1–2 pillar pages linking thematic clusters (e.g., "/guides/systems-thinking/").
3. Add subtle "Explore More" hint on homepage (optional).

**Rationale:** Your niche content is **genuinely valuable and unique** — RPG design teaches systems thinking, prompts solve real problems. Burying them wastes SEO + discovery opportunity. Light internal linking does the work without cluttering UI.

## Decision Owner

**Ted** — This is a content strategy call. Recommend a 15-min sync to confirm approach before ticketing infrastructure work.

## Waiting For

- [ ] Ted's decision on homepage scope
- [ ] Confirmation on Option A/B/C preference
- [ ] Direction on pillar page priorities (which 2–3 clusters to pilot first?)
---
Date: 2026-05-28T19:53:42.576-07:00
Agent: Elrond (Information Architect)
Type: Content Model & IA Audit
Status: Complete (awaiting team prioritization)
---

# Content Architecture Review Decision Record

## Decision: Eight structural content IA issues identified and documented for backlog

### Context
Performed read-only content model audit spanning 1,009 posts across 14 categories. Systematic analysis of front matter conventions, taxonomy alignment, metadata completeness, and series/workflow structure.

### Issues Identified (Priority Order)

**P1 (Urgent):**
1. **Specialized content schema fragmentation** — Gamma World creatures (699 posts) use incompatible front matter; blocks scalability
2. **Image accessibility & SEO gap** — 699 posts missing image-alt; escalate existing #171 from P2 to P1

**P2 (Near-term):**
3. Prompt series adoption <5% (only 3 of 56 prompts)
4. Tag metadata inconsistency (36% missing/null/empty)
5. Homepage distribution skew (69% specialized content)
6. Category case normalization & description/excerpt canonical model
7. Missing content pillars & topic clustering for SEO/discovery

### Rationale for Decisions

**Why P1 for specialized schema:**
- Blocks clean information architecture
- 69% of site content affected
- Will compound with each new specialized collection (books, NPCs, etc.)

**Why escalate image-alt to P1:**
- WCAG 2.1 Level A compliance issue
- 699 posts non-compliant
- Affects search indexing and assistive technology users

**Why P2 for adoption issues:**
- High-value but not blocking (infrastructure already in place)
- Can be driven through content governance and template polishing
- Lower severity than schema/compliance issues

### Implications

**For templates/render:**
- Homepage carousel must account for distribution skew
- Schema handling needs to support both standard + specialized fields
- Feed/syndication logic must handle dual metadata schemas

**For content governance:**
- Need clear guidelines on when series/tags are mandatory vs. optional
- Tagging standards should be documented in README
- New categories should follow established casing conventions

**For future scaling:**
- Topic pillars & clustering enable buyer-stage alignment (awareness/consideration/decision)
- Structured pillar pages improve AI SEO discoverability
- Hub-and-spoke architecture supports cross-category discovery

### No Conflicts with Accepted ADRs
All findings align with:
- ADR 0002 (Dynamic Prompt Series) — calls for higher adoption
- ADR 0006/0007 (Category theming & registry) — calls for slug consistency
- ADR 0008 (Memory probe & caching) — topic clustering informs future cache strategies

### Next Steps
1. Route findings to backlog prioritization
2. Team to assess resource requirements for P1 schema redesign
3. Coordinate with Galadriel (templates) on homepage filtering
4. Schedule content strategy review for pillar definitions

**Artifact:** `/content-review/elrond-review.md` (8 findings with evidence, severity, and suggested issues)
# Decision: AI-SEO & Metadata-Automation Audit Findings

**Date:** 2026-05-28T20:09:45.997-07:00  
**Agent:** Elrond (Information Architect)  
**Status:** Recommended for Aragorn Review & Backlog Prioritization

---

## Context

Conducted structured-data and metadata-automation audit covering:
- JSON-LD schema coverage (BlogPosting, WebSite, BreadcrumbList present; specialized schemas missing)
- Meta tag completeness (OG, Twitter, canonical, author signals present; image metadata sparse)
- Front matter consistency (no validation; 69% of posts missing image-alt, 36% missing tags)
- Feed & bot discoverability (robots.txt + llms.txt present but minimal; feeds lack structured metadata)
- Automation opportunities (image dimensions, mastodon-post-id backfill, excerpt generation)

Full audit: `/followup-audit/elrond-ai-seo.md`

---

## Key Findings

### Strengths
- ✅ Solid foundational SEO (OG, Twitter, canonical, description, keywords)
- ✅ JSON-LD ArticlePosting on post pages with author & date signals
- ✅ Indieweb integration (rel="me" links, WebMention, IndieAuth)
- ✅ Mastodon integration infrastructure (211 posts linked; scripts in place)

### Gaps (High Impact)
- ❌ No specialized JSON-LD for Prompts (CreativeWork), Slides (Presentation), Quotes (FAQPage), Collections (ItemList)
- ❌ No front-matter validation plugin; metadata inconsistency silent
- ❌ Image alt-text: 699 posts (69%) missing (P1 risk per Aragorn #171)
- ❌ Image dimensions: ~0% of posts have OG image_width/image_height
- ❌ Collection discoverability: Prompts, Slides, Bestiary not discoverable as structured collections
- ❌ Author schema: /profile/ page lacks Person JSON-LD; author URLs not canonical in schema

---

## Recommended Decisions

### Decision 1: Prioritize Front Matter Validation Plugin
**Rationale:** Unblocks metadata backfill; enables targeted audits; breaks silent inconsistency.  
**Action:** Create `_plugins/validate-front-matter.rb` (estimated 1–2 hours). Warn on missing image-alt (if image present), missing excerpt (if >1000 words), missing tags. Emit summary report at build end.  
**Aligns with:** Issues #171 (image-alt P1), #183 (tagging), #178 (excerpts).

### Decision 2: Run Batch Image Dimensions Script Next
**Rationale:** Quick win (1–2 hours); fixes OG image sizing for social shares immediately.  
**Action:** Create `_code/py/generate_image_dimensions.py`; scans all posts, populates image_width/image_height.  
**Aligns with:** Issue #88 (image optimization); OG metadata completeness.

### Decision 3: Implement Person Schema on /profile/ Page
**Rationale:** Establishes author canonical entity; supports Knowledge Graph.  
**Action:** Add Person JSON-LD to profile layout; include email, social URLs (from site.profile_social), bio.  
**Estimated Effort:** 30 min.

### Decision 4: Phase Specialized Content-Type Schemas
**Rationale:** Unlock AI discovery for specialized content; align with ADRs.  
**Phase 1 (High Value):**
- CreativeWork schema for Prompts (aligns with ADR 0002 series adoption; Issue #184)
- Collection schema for content discovery (Prompts, Slides, Quotes index)

**Phase 2 (Medium Value):**
- Presentation schema for Slides (currently invisible)
- FAQPage schema for Quotes (enables featured snippets)

**Phase 3 (Lower Value):**
- Dataset schema for Bestiary (niche; defer)

**Estimated Effort per Schema:** 2–4 hours.

### Decision 5: Expand llms.txt with Structured Content Index
**Rationale:** Helps AI systems navigate content structure; low effort.  
**Action:** Add sections: Collections (Prompts, Slides, Quotes), Categories, Structured Data, Feeds (with topic hints).  
**Estimated Effort:** 30 min.

---

## Impact Summary

| Decision | Effort | Impact | Dependencies |
|----------|--------|--------|--------------|
| Front Matter Validation | 1–2 hrs | 🟢 Very High | None |
| Image Dimensions Script | 1–2 hrs | 🟢 High | None |
| Person Schema on /profile/ | 30 min | 🟢 High | None |
| Specialized Content Schemas | 10–15 hrs (phased) | 🔵 Medium–High | Validation plugin (enables batch backfill) |
| llms.txt Expansion | 30 min | 🔵 Medium | None |

**Total Phased Effort:** ~15–20 hours (5–6 week sprint at 3–4 hrs/week).

---

## Alignment with Aragorn's Consolidated Issues

- **Issue #178** (SEO & discoverability): Structured data directly addresses excerpt/pillar page / metadata strategy.
- **Issue #181** (RPG schema): Dataset schema for Bestiary provides unification path.
- **Issue #183** (Tagging model): Front matter validation surfaces tagging gaps; feeds adoption.
- **Issue #184** (Series adoption): CreativeWork schema for Prompts enables series discovery.
- **Issue #185** (Related posts): Collection schema enables post-to-collection linking.

---

## Recommended Backlog Order

1. **Front Matter Validation Plugin** (1–2 hrs) — Unblocks all metadata work
2. **Image Dimensions Script** (1–2 hrs) — Quick win; improves OG metadata
3. **Person Schema on /profile/** (30 min) — Author entity canonicalization
4. **CreativeWork for Prompts** (3–4 hrs) — Aligns with ADR 0002; high value
5. **Collection/ItemList Schema** (4–5 hrs) — Content discovery infrastructure
6. **Presentation Schema for Slides** (2–3 hrs) — Unlock Slides discoverability
7. **FAQPage for Quotes** (2–3 hrs) — Featured snippet enablement
8. **Metadata Backfill Pipeline** (4–6 hrs) — Automate image-alt, excerpt, mastodon-post-id population

---

## Questions for Aragorn / Team

1. Should front matter validation warnings block build, or only log?
2. For mastodon-post-id backfill: acceptable to auto-generate during build, or prefer manual review per post?
3. Priority: Author entity canonicalization (Person schema) vs. Specialized content schemas?
4. Should image-alt backfill be AI-generated or manual?

---

**Next Steps:** Aragorn to review, prioritize in backlog, and assign to Galadriel (Templates) and/or engineer for phased implementation.

---

*Audit authored by Elrond; recorded 2026-05-28T20:09:45.997-07:00*
---
date: 2026-05-28T19:53:42.576-07:00
owner: Faramir (Search & Discovery)
topic: Content discovery audit findings & prioritization
status: inbox
---

# Content Discovery Audit Findings & Prioritization

## Key Insight
1,009 posts across 27 categories have **high fragmentation and low interconnection**. Gamma World dominance (69%) is masking content discovery for the remaining 30%. Tags are underutilized (30% adoption), related-content infrastructure doesn't exist, and internal linking is sparse (27% of posts). Search discovery is missing entirely.

## Critical Issues to Address

### P1: Gamma World Content Dominance + No Related-Post Infrastructure
**Impact:** High-volume category (699 posts) may suppress visibility of research/blog content. Users landing on a Gamma World post have no thematic navigation to related content.

**Recommendation:**
- Weight category carousel and recent-post caching to balance display
- Build related-content template (sidebar or footer) with automatic or manual suggestions
- Consider Gamma World sub-categorization (e.g., "Creatures," "Locations") if organizational depth warrants

### P2: Tags Severely Underutilized + No Tag Archive Pages
**Impact:** Only 308/1009 posts (30.5%) are tagged. Zero tag archive or tag cloud pages exist. Content remains siloed; users cannot navigate by topic or skill.

**Recommendation:**
- Expand issue #75 ("Prompts: Add Dedicated Tag Archive Pages") to cover all tags, not just prompts
- Create tag archive pages: `/tags/`, `/tags/{tag-name}/`, tag cloud on category landing pages
- Tag audit & bulk tagging campaign for priority clusters (AI, prompts, business)

### P2: Series Field Adoption ~0%
**Impact:** Despite ADR 0002 architecture, only 3 posts use the series field. Multi-step workflows (prompt series, content sequences) cannot be navigated.

**Recommendation:**
- Audit ADR 0002 templates for bugs
- Populate 5 natural series candidates in prompts as pilots
- Wire series list/index into prompt-library page

### P2: Sparse Internal Linking (73% of Posts Have None)
**Impact:** 730 posts lack thematic links to related content. Content silos isolate users; search engine link equity isn't distributed across topic clusters.

**Recommendation:**
- Content graph audit: identify 5–10 priority clusters (AI, Business, Leadership, Theology)
- Manual linking campaign for cluster posts: each should reference 2–4 related posts
- Create inline linking guideline ("see also," "related," "next step in this topic")

### P2: Category Landing Pages Have Minimal Navigation Value
**Impact:** 41 category pages exist but are redirect stubs with no secondary CTAs. Visitors see recent posts but no related categories, tag cloud, or depth indicators.

**Recommendation:**
- Add "Related Categories" cross-links (from registry)
- Add tag cloud for each category (top 10 tags + post count)
- Add metadata row: "N posts | M tags | Last updated [date]"
- Breadcrumb: Home > Category > Tags

### P2: No Site-Wide Search
**Impact:** Issue #70 exists but is unfunded. 1,009 posts become undiscoverable except via category/carousel browsing.

**Recommendation:**
- Choose search tool: Algolia, DuckDuckGo, or custom JSON feed + search page
- Scope: search widget in top-nav + floating button, results page, JSON feed generation
- Integrate with #72 (JSON-LD schema) for search engine discovery

## Dependencies & Sequencing

1. **Immediate (Week 1–2):**
   - Expand #75 to all-tags audit + archives
   - Populate series pilots (5 prompts)
   - Start content graph audit (top 5 clusters)

2. **Follow-on (Week 3–4):**
   - Finalize related-posts template
   - Deploy tag archives + category enhancements
   - Begin bulk tagging campaign

3. **Strategic (Week 4+):**
   - Internal linking editorial campaign
   - Search tool selection & implementation (#70)
   - Consider Gamma World sub-categorization

## Team Notes
- These findings are read-only observations; no code changes are recommended without Engineering/Editorial alignment.
- Existing issues (#70, #75) should be expanded, not duplicated.
- Content pillar strategy (ADR 0008 cache precomputation) may already reduce some query costs; coordinate with caching decisions.

# Discovery Infrastructure Decisions — Faramir

**Date:** 2026-05-28T20:09:45.997-07:00  
**Author:** Faramir (Search & Discovery Engineer)  
**Status:** recorded (not yet team reviewed)

## Key Findings

### Current Discovery State
- **Strong surfaces:** Homepage carousel (caching, category theming), category pages, next/previous cards
- **Critical gaps:** Tag-based discovery (0% visibility), content silos (Prompts/Slides isolated), related-posts infrastructure absent
- **Adoption crisis:** Series metadata 5.4% (3 of 56 prompts), tag coverage 30.5% but 0% discoverability, related links 0%

### Friction Points
1. **Topic Isolation:** Reader cannot browse by tag; category exhaustion → dead end
2. **Series Abandonment:** 94% of prompts appear broken (no series metadata)
3. **Collection Silos:** Homepage carousel hardcoded to exclude Prompts and Slides (by design, but prevents discovery)
4. **Chronological Drift:** Next/previous links are purely chronological, breaking narrative threads
5. **Tag Metadata Waste:** Tags exist in 360+ posts but are invisible to readers

## Recommended Decision

### Immediate Action (Issue #183, #184, #185)

**D1: Enforce Tag Infrastructure as Discovery Foundation**
- Populate `tags:` front-matter on 50–100 high-traffic posts
- Build `/tag/{slug}/` archive pages + tag-to-posts index in plugins
- Timeline: 1–2 weeks
- Unlocks: filtering, tag clouds, related-content inference

**D2: Add Related-Posts Field + Sidebar Card**
- Schema: `related: [post-slug-1, post-slug-2, ...]`
- Render card in post sidebar below categories
- Manual curation initially; can be inferred later via shared tags
- Timeline: 3–4 days
- Impact: breaks silos immediately

**D3: Pilot Series Adoption**
- Audit 56 Prompts; populate `series` metadata for 5–10 multi-part workflows
- Update Prompt Library landing to highlight series section
- Timeline: 1–2 days
- Impact: series feature becomes visible; motivates adoption

### Medium-Term (4–6 weeks)
- Extend homepage carousel to include Prompts and Slides (currently excluded)
- Add tag clouds to category pages (issue #186)
- Build Slides gallery landing page (issue #182)

### Longer-Term (strategic)
- Pillar pages / topic hubs (issue #178) — requires tags + related posts first
- Thematic series navigation beyond prompts
- Cross-collection series discovery

## Rationale

**Why not more immediate?**
- Tag infrastructure must come first; it enables all downstream features (tag filtering, clouds, related-posts inference)
- Related-posts field is manual curation at first (sustainable; avoids complexity)
- Series adoption is a curator task, not technical work

**Why this order?**
1. Tags = foundational; no other feature can fully leverage them until infrastructure exists
2. Related posts = low technical risk; high editorial control
3. Series adoption = immediate ROI (5–10 series unblock narrative discovery)
4. Carousel extension = safe once tags/related are ready

**Alignment with ADRs:**
- ADR 0008 (caching): Tag index can follow same pattern as `recent_by_category`
- ADR 0006 (carousel): Extend filter logic to include cross-collections with feature flag
- No new ADRs needed; decisions are refinements within existing architecture

## Open Questions for Team Review

1. **Tag Governance:** Should all posts have tags eventually? Or just curated sets? (Propose: start with 50–100 high-traffic, then scale)
2. **Related-Posts Maintenance:** Should curation be manual (sustainable) or auto-inferred via shared tags? (Propose: manual for 6 months, then explore inference)
3. **Carousel Composition:** When extending to include Prompts/Slides, what proportion? Alternating? Separate carousel rows? (Propose: alternate rows, with feature flag for easy rollback)
4. **Series Scope:** Prompts only, or expand to blog post series later? (Propose: Prompts first; blog series can follow if infrastructure proves robust)

## Next Steps

1. **Aragorn**: Review this decision note; approve or suggest modifications
2. **Bilbo**: Audit Prompts for multi-part workflows; flag candidates for series adoption
3. **Elrond**: Confirm tag schema and front-matter patterns; align with any planned taxonomy work
4. **Faramir**: Once approved, begin tag infrastructure work (issue #183 implementation)
# Decision: Analytics & Editorial Automation Audit (May 28, 2026)

**Date:** 2026-05-28T20:09:45.997-07:00  
**Agent:** Gandalf (Automation & Integration Engineer)  
**Status:** Audit complete; recommendations staged for team review  
**Related Issues:** Aragorn #178, #183, #184, #185; #158, #142 (tracked)

---

## Context

Gandalf conducted a comprehensive audit of analytics tracking surfaces and editorial automation pipelines to identify gaps, quick wins, and strategic opportunities.

**Driving Questions:**
1. What analytics/tracking surfaces exist in the site?
2. Is current tracking sufficient to make content decisions about discovery, traffic, engagement, conversion?
3. What attribution gaps or consent/privacy constraints block better measurement?
4. Which automation opportunities could reduce editorial debt (metadata/excerpts/tags/alt text)?
5. What are the highest-leverage next steps?

---

## Key Findings

### Analytics Lane
- **Current State:** GA4 + Clarity active; basic event tracking (search, downloads, outbound links) enabled.
- **Strengths:** Privacy-hardened defaults (anonymize IP, no ad signals); localhost suppression; modular config flags.
- **Gaps:**
  - No content category classification → can't slice traffic by Prompts/Gamma World/etc.
  - No scroll depth or engagement timing → can't assess "hook early" vs "sustained" content.
  - No conversion goals → can't measure newsletter signups, RPG tool usage, etc.
  - Feed analytics dark → no measurement of JSON Feed / Mastodon post CTR.
  - No internal link attribution → can't measure cross-content discovery paths.
  - **Consent compliance gap:** No banner; assumes implied consent (GDPR/CCPA exposure if EU/CA audience).

### Editorial Automation Lane
- **Current State:** 5 working scripts + validation test suite; scattered across `_code/` and `tests/`.
- **Strengths:** Dry-run gates on Mastodon posting; YAML schema validation; tag heuristics; feed integrity checks.
- **Gaps:**
  - Automation isolated (no unified CLI) → hard to run coherent metadata operations.
  - **Validation not in CI** → image-alt, image-paths, feed integrity tests run locally but don't block deployment.
  - Massive metadata debt per Aragorn review (1,009 posts analyzed):
    - Excerpt: 29.1% coverage (714 posts missing)
    - Tags: 30.5% coverage (369 posts missing/null)
    - Image-alt: 30.5% coverage (699 posts; **a11y + SEO risk**)
    - Internal links: 0% (730 posts with zero refs)
    - Series adoption: 5.4% (only 3 of 56 prompts)
  - **Blocker:** Tag automation (`add_prompt_tags.py`) only touches `/prompts/` dir; inconsistent with standardization goal (Aragorn #183).

---

## Recommendations

### Tier 1: This Sprint (Enable Blocking)
1. **Enable CI validation** (30 min)
   - Wrap `tests/check_image_alt_text.rb`, `check_image_paths.rb`, `check_feed_integrity.rb` in GitHub Actions.
   - Fail CI if image-alt coverage < 90% or feed malformed.
   - **Impact:** Block deployment of ALT text gaps; unblock SEO/a11y risk mitigation.

2. **Add GA4 category dimension** (30 min)
   - Modify `main-site-analytics.js` to extract and dispatch `post_category` custom dimension.
   - **Impact:** Unblock "which categories drive traffic?" analysis.

### Tier 2: Next Sprint (Consolidate Automation)
3. **Consolidate tag automation** (1 hour)
   - Expand `add_prompt_tags.py` scope from `/prompts/` → `_posts/` + all collections.
   - Add `--dry-run` output to `make qa` for pre-commit validation.
   - **Impact:** Reduce manual tagging debt; unblock tag filtering / tag cloud (Aragorn #183).

4. **Stub excerpt auto-generation** (1 hour)
   - Add Liquid filter to auto-generate excerpts from first 150 chars (strip HTML).
   - Use in `<meta name="description">` + frontmatter fallback.
   - **Impact:** Improve SEO meta descriptions without bulk front-matter edits.

5. **Build unified editorial CLI** (3 hours)
   - Create `_code/editorial-cli.py` with subcommands: `validate`, `enrich`, `audit`.
   - Consolidate `add_prompt_tags.py`, `validate_prompts_yaml.py`, audit scripts.
   - Output: YAML + JSON report (coverage %, gap trends, recommendations).
   - **Impact:** Centralize metadata operations; enable team dashboard; unblock Aragorn issues #178, #183, #185.

### Tier 3: Roadmap (Attribution & Observability)
6. **Attribution model: content discovery tracking** (2 hours)
   - Add GA4 events for "discovery source" (category carousel, category page, search, etc.).
   - **Impact:** Answer "how does each discovery surface drive engagement?"

7. **Mastodon metadata auto-generation** (1.5 hours)
   - Extend `backfill_masto_posts.py` to auto-generate post descriptions from excerpt or content.
   - **Impact:** Improve social card quality; reduce manual metadata burden.

8. **Metadata health observability** (3–4 hours)
   - Extend editorial CLI audit mode to output Prometheus metrics.
   - **Impact:** Make metadata health visible to team; enable data-driven prioritization.

9. **Consent modernization** (4–6 hours, aligned with team privacy policy)
   - Implement cookie banner; add `site.analytics.consent_required` flag.
   - Switch to GA4 "Consent Mode" for GDPR/CCPA compliance.

---

## No New Infrastructure Required
- All recommendations reuse existing patterns: GA4 custom dimensions, Jekyll plugins, Python scripts, Mastodon API, Liquid filters.
- No new languages, dependencies, or deployment targets.

---

## Dependencies & Coordination
- **Aragorn:** Coordinate on content priorities (issues #178, #183, #184, #185 — all unblocked by Tier 2 work).
- **Gimli:** Coordinate on CI/deployment (enable validation gates, lock metadata defaults).
- **Full audit document:** `.copilot/session-state/.../files/followup-audit/gandalf-analytics.md`

---

## Decision
**Recommend:** Proceed with Tier 1 + Tier 2 sequencing. Tier 1 enables quick risk mitigation; Tier 2 unblocks content discovery + SEO efforts. Tier 3 is strategic roadmap (no blockers; nice-to-have).

**Next Step:** Aragorn / Gimli review; sequencing decision by sprint planning.

---

**Prepared by:** Gandalf (Automation & Integration Engineer)  
**Date:** 2026-05-28T20:09:45.997-07:00
