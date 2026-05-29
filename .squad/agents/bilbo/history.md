# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own docs, prose, descriptions, SEO copy, and readability polish.
- 2026-05-28T16:22:10.035-07:00 — Uplifted GitHub issue templates. Replaced 2 generic templates with 5 purpose-specific forms (Bug Report, UX Enhancement, Content Task, Architecture Task, Infrastructure Task) plus config.yml. All validated with Ruby YAML parser. Decision recorded in `.squad/decisions/inbox/bilbo-issue-templates.md`.
- 2026-05-28T17:31:39.169-07:00 — Created comprehensive roster export (squad-roster-export.yaml). Extracted all 13 team members (11 active agents + Scribe + Ralph) with domains, routing, and charter references. Source: team.md, routing.md, registry.json, member charters. Portable YAML format for reuse. File path: `.copilot/session-state/.../files/squad-roster-export.yaml`.
- 2026-05-28T19:53:42.576-07:00 — Completed read-only editorial content review of tedt.org. Scanned 1,009 posts across 12+ categories. Findings: Strong content health (98.3% description coverage), excellent front matter, but 8 high-signal discoverability & SEO gaps identified. Deliverable: bilbo-review.md with P2/P3 recommendations (blog excerpt strategy, prompt pillar curation, quote theming, contributor guide, RPG SEO tagging, slide gallery, homepage siloing, pillar pages). Coordinated with existing issues #160, #86, #166, #165 to avoid duplication. Decision needed on content-market fit strategy (homepage coverage scope).
- 2026-05-28T20:41:20.012-07:00 — Editorial review of Märchen Engine corpus (published intro + 18 WIP design docs). Finding: System has strong identity (fairness-centric philosophy, innovative 4D8 mechanics, three-realm magic) and publishable intro, but WIP corpus reads as isolated subsystems lacking integration narrative. 8 core editorial concerns identified (no system architecture overview, inconsistent terminology, incomplete content, unmechanical magic, etc.). Ranked WIP files by readiness; 5–8 highest-priority improvements defined. Deliverable: comprehensive feedback artifact (bilbo-feedback.md) in session output. Decision needed: publication timeline and book structure (char creation chapter integration strategy).

---

## 2026-05-28T17:31:39Z – Squad Roster Export Completed

**Role:** Editorial Writer  
**Mode:** Sync  
**Task:** Create a portable single-file squad roster export  

### Deliverable
- **File:** squad-roster-export.yaml (9.6 KB)
- **Location:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/squad-roster-export.yaml`
- **Format:** YAML

### Contents
All 13 team members with:
- Name, emoji, role, status badge
- Charter path, primary domains, routing notes
- Project metadata and work routing table
- Orchestration principles

### Key Decisions
- YAML chosen for readability, portability, and machine reusability
- No invented data; missing fields left unspecified
- Structured for reuse in external systems and automation
- Emojis assigned per role/domain
- Status badges preserve team.md notation

### Next Steps
Export is stable and reusable. Can be imported into external documentation or parsed by automation scripts. Update process follows same structure and discipline.

**Status:** ✅ Complete

---

## 2026-05-28T19:53:42Z – Editorial Content Review Completed

**Role:** Editorial Writer  
**Mode:** Sync  
**Task:** Full read-only editorial content review; create findings artifact and open tickets

### Deliverable
- **File:** bilbo-review.md (17.7 KB)
- **Location:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/content-review/bilbo-review.md`
- **Format:** Markdown with structured findings table

### Scope
- Posts scanned: 1,009 across 12+ categories (AI, Blog Posts, Prompts, Quotes, Folklore, RPG Posts, Slides, Gamma World, Cub Scout, Policy, Reprints, Checkins)
- Metrics: 98.3% description coverage (992/1009), 29.1% explicit excerpts (294), all descriptions present except 1 file
- Review focuses: Content quality, readability, freshness, descriptions, duplicates, thin copy, conversion gaps, discoverability

### Key Findings (8 total; P2=6, P3=2)

1. **Blog Post Excerpts Lack SEO Depth** (P2) — Excerpts describe topic but not value/insight; undercuts Google snippets and social sharing.
2. **Prompts Collection Lacks Pillar Curation** (P2) — 56 prompts well-documented but no grouping/pillar architecture; discoverable but not navigable.
3. **Quotes Need Thematic Tagging** (P2) — 78+ quotes exist but lack context/theming; isolated rather than curated.
4. **README Lacks Editorial Guide** (P2) — Technical documentation strong; missing content contributor voice/structure guidelines.
5. **RPG/Fantasy Content Lacks SEO Tagging** (P2) — 700+ Gamma World + 78+ folklore posts but no consistent tagging/hub linking.
6. **Slides Collection Needs Gallery** (P2) — 9 decks exist; no discoverable gallery or topic filtering surface.
7. **Homepage Filters Silos Content** (P2) — By design, homepage excludes niche content (RPG, folklore, prompts); strategic decision needed on scope.
8. **Pillar Pages Missing** (P3) — No hub-spoke linking for topic clusters; missed SEO + internal link equity.

### Coordination with Existing Issues
- Prompt findings (2, 6) may overlap with #160 (ADR 0004 docs debt), #86 (Prompt Details UX), #166 (Refactor layouts) — audit before ticketing.
- Pillar page finding (8) relates to #165 (extend caching for tags) — can leverage `recent_by_category` infrastructure.
- No duplication found; findings either new or coordinating with known work.

### Next Steps
1. **For Ted:** Review bilbo-review.md; decide on 3–5 highest-impact tickets.
2. **For Team:** Audit issues #160, #86, #166 to consolidate overlapping findings before new tickets.
3. **Strategic Decision:** Document content-market fit strategy (finding 7) in `.squad/decisions/` — should homepage hint at niche assets?
4. **Quick Wins:** Excerpt strategy (P2, 2–3 hrs), quote themes (P2, 1 hr), pilot pillar page (P3, 3 hrs).

**Status:** ✅ Complete

---

## 2026-05-29T03:47:29Z – Märchen Engine Editorial Review Completed

**Role:** Editorial Writer  
**Mode:** Sync  
**Task:** Editorial review of Märchen Engine corpus; identify P1/P2 issues; create decision record

### Deliverable
- **File:** bilbo-feedback.md (comprehensive editorial audit)
- **Location:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/marchen-engine-review/bilbo-feedback.md`
- **Archived in:** `.squad/decisions.md` as Decision #8 (Märchen Engine Content Review — Editorial Findings)
- **Status:** awaiting-decision (Ted to decide on 4 key points)

### Scope
- Content Audited: 1 published intro + 18 WIP subsystem documents
- Review Focus: Editorial quality, mechanical clarity, voice consistency, integration narrative, publication readiness

### Key Findings

**Strengths:**
- Published intro balances accessibility + depth; warm tone
- 4D8 system mechanically elegant; ties to human dimensions (physical, mental, social, magical)
- Three-Realms magic system conceptually coherent
- Morality aspects theoretically grounded; avoid false binaries
- Social Combat ("Engagement") is full subsystem, not reskin

**Blocking Issues (P1):**
1. No system integration narrative — WIP files isolated; need System Architecture Overview
2. No character creation process — can't make character from existing material; need Character Creation chapter

**High-Priority Issues (P2):**
3. Terminology/voice inconsistency across documents (Engagement vs. Social Combat; POV drift; Märchen/Marchen typos)
4. Magical Schools ungrounded — beautiful but no casting rolls, resources, time costs
5. Moral Aspects unpayable — philosophical but no mechanical hooks
6. Bastion Rules D&D-copied — no Märchen DNA or moral/realm integration
7. Incomplete/draft content scattered (Power Apps copy-paste in Levels of Knowledge; stubs everywhere)

**Readiness Matrix:**
| Item | Status | Effort |
|------|--------|--------|
| Published Intro | ✅ Ready | ~30 min |
| 4D8 System | ⚠️ Minor | ~1 hr |
| Engagement/Social | ⚠️ Polish | ~1.5 hrs |
| Magical Schools | ⚠️ Casting | ~3 hrs |
| Morality Aspects | ⚠️ Hooks | ~2 hrs |
| Adventure Structure | ❌ Rewrite | ~4 hrs |
| Bastion Rules | ❌ Replace | ~4 hrs |
| Incomplete docs | ❌ Cleanup | ~2 hrs |

### Decision Points for Ted

1. **Publication Timeline:** Complete book or incremental blog posts?
2. **Book Structure:** Dedicated Character Creation chapter or woven into intro?
3. **Bastion Integration:** Keep, replace, or integrate with moral/realm mechanics?
4. **WIP Folder:** Move to _drafts, mark [INCOMPLETE], or delete?

### Recommended Next Steps (After Ted Decides)

**Priority-blocking work (8–10 hrs total):**
- Write System Architecture Overview (3–4 hrs) — unblocks everything
- Write Character Creation chapter (2–3 hrs)
- Add Casting Framework to Magical Schools (2–3 hrs)

**Consistency pass (2–3 hrs):**
- Establish Märchen Style Guide
- Standardize terminology (Engagement, Realm, Ability names)
- Fix typos and voice

**Cleanup (1–2 hrs):**
- Migrate incomplete docs; mark stubs
- QA each WIP against "mechanical clarity" test

### Coordination

- **Cross-agent coordination:** Pairs with Elrond's publishing strategy (Decision #9)
- **Team review:** Awaiting approval from Aragorn, Galadriel, Elrond
- **Blocker:** Ted's decisions unlock project timeline

**Status:** ⏳ Awaiting-Decision


---

## 2026-05-29T04:06:46Z – Märchen Engine Status Assessment Complete (Decision #10)

**Role:** Editorial Writer  
**Directive:** Content Publication Quality Gate  

### Handoff
- **From:** Aragorn (Product Owner)
- **Decision:** Märchen Engine Content Status Assessment (Decision #10)
- **Your Action:** Use this report as quality gate for WIP publishing
  - Before moving docs to `_posts/`, ensure they pass "mechanical clarity" test
  - Question: "Could a GM actually run this?"
- **Team Coordination:** Pairs with Elrond's publishing strategy (Decision #9) for metadata standardization

### Key Quality Checkpoints
1. Character Creation chapter must formalize before subsystems publish
2. System Architecture Overview must prove coherence across Magic Items, Nemesis, Social Combat
3. Each Tier 1 subsystem requires worked examples
4. Campaign proof-of-concept validates systems interlock (Week 4 target)

**Status:** ⏳ Awaiting-coordination with Elrond on series metadata
