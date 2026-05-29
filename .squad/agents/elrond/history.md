# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own taxonomy, front matter design, schema, and information architecture.
- 2026-05-28T20:09:45.997-07:00 — **AI-SEO & Metadata Audit Complete**. Front matter validation plugin + metadata automation scripts are highest-leverage. Specialized JSON-LD schemas for Prompts/Slides/Quotes feasible in 2–3 hour sprints; collection discovery unlocks AI navigation. Image alt-text gap (699 posts, 69%) should be addressed in parallel with front matter validation.

## Session: Content Architecture Review (2026-05-28)

**Scope:** Full-site content model audit (1,009 posts across 14 categories)

**Findings Completed:**
- Identified 8 structural content IA issues with P1/P2 severity
- Mapped findings to existing issues (some escalations/new recommendations)
- Created comprehensive artifact: `/content-review/elrond-review.md`

**Key Discoveries:**
1. **Gamma World fragmentation (P1)**: 699 specialized creature posts use incompatible front matter schema
2. **Image A11y crisis (P1)**: 699 posts missing image-alt tags (escalate #171 to P1)
3. **Series underadoption (P2)**: Only 3 of 56 prompts use series metadata despite ADR 0002
4. **Tag inconsistency (P2)**: 36% of posts have missing/null/empty tags
5. **Homepage skew (P2)**: 69% of content is specialized (creatures); marginalizes blog/thought-leadership
6. **Schema coherence (P2)**: Category slug casing, description/excerpt canonical model gaps
7. **SEO blindspot (P2)**: No defined content pillars or topic clustering

**Recommendations:**
- Escalate #171 to P1 (image-alt backlog + category validation)
- Create 4 new issues for metadata adoption/standardization
- Coordinate with Galadriel (templates) on content filtering for homepage
- Schedule pillar/cluster strategy review before major content expansion

**Team Handoff:**
- Ready for backlog prioritization
- No blocking dependencies
- All recommendations use existing Jekyll infrastructure

## 2026-05-29: Scribe Inbox Consolidation & Priority Alignment

**Role:** Audit consolidated into decisions.md; validated against Aragorn content review + Gandalf/Faramir audits; orchestration recorded  
**Key Alignment:** All three specialist audits converge on metadata infrastructure as critical path  
**Cross-Team Validation:**
- Front Matter Validation Plugin (Elrond rec #1) aligns with Gandalf's "Enable CI validation" tier 1 work
- Image-alt escalation (#171 P2→P1) confirmed across all three audits
- Specialized schemas (Elrond #4) coordinate with issue #181 (RPG schema) from Aragorn consolidation
- Tag infrastructure dependency chain: Elrond validation → Faramir tag index → Aragorn priority tranche

**Next Phase:** Elrond lead on front-matter validation plugin (1–2 hrs, enables all downstream metadata work); coordinate implementation timeline with Aragorn  
**Output:** Orchestration log 2026-05-29T03:23:52Z-elrond.md; decisions.md consolidated

## 2026-05-28: Märchen Engine Content Architecture Review

**Scope:** Published intro post + 21 WIP subsystem documents (~7,100 lines); content review only (no structural changes)

**Key Findings:**
1. **System Identity:** Strong. Distinctive voice (classic adventure + 4d8 mechanics). All subsystems anchor to recursively meaningful design (stories unlock items, deeds evolve nemeses, downtime reinforces engagement).
2. **Fragmentation:** Moderate-to-severe. Concept duplication (3+ definitions of "Skill Levels," "Rank," time scales). No unified terminology or glossary. Chargen unpublished (blocking).
3. **Information Hierarchy:** Poor. 21 WIP files in flat directory; no manifest, reading order, cross-references, or series metadata. Bastion rules (1,027 lines) dwarf core mechanics (173 lines).
4. **Strongest Assets:** Magic-Items-Rules (exemplary rubric + design reasoning), A-Legacy-of-Scars (modular + accessible), Social Combat (clear framework). All three pub-ready + 1 hour Polish.
5. **Largest Gaps:** Character creation unpublished; no unified campaign example showing all systems interlock; ref guidance inconsistent across subsystems.

**Readiness Scorecard:**
- System Identity: 8/10
- Reading Progression: 4/10
- Information Hierarchy: 5/10
- Modular Coherence: 7/10
- Publication Readiness: 2/10
- **Composite: 53%**

**Recommendation:** 1 week of structural work (chargen formalization, front matter, campaign example) enables Phase 1 publishing (3 Tier-1 subsystems + chargen).

**Artifact:** `/session-state/marchen-engine-review/elrond-feedback.md` (comprehensive IA audit + priority roadmap)

---

## 2026-05-29T03:47:29Z – Märchen Engine Publishing Strategy Consolidated

**Role:** Information Architect  
**Mode:** Scribe consolidation  
**Task:** Merge inbox decision records; create orchestration log; stage for team review

### Deliverable
- **File:** elrond-feedback.md (IA audit + strategic roadmap)
- **Location:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/marchen-engine-review/elrond-feedback.md`
- **Archived in:** `.squad/decisions.md` as Decision #9 (Märchen Engine Publishing Strategy)
- **Status:** awaiting-decision (Ted to decide on 5 strategic points)
- **Orchestration Log:** `.squad/orchestration-log/2026-05-29T03:47:29Z-elrond.md`

### Strategic Decisions for Ted

**1. Product Scope:** Complete RPG (3–4 weeks) or Modular Toolkit MVP (1–2 weeks)?
- **Option A:** Full rules + all subsystems + ≥2 campaigns = high value, higher QA burden
- **Option B:** Core + 3 flagship subsystems (Magic Items, Legacy of Scars, Social Combat) = faster entry, user feedback shapes expansion
- **Recommendation:** Option B (modular). Deploy fast; let feedback drive.

**2. Character Creation:** Formalize as standalone post?
- **Current State:** Embedded in intro; incomplete; blocks other subsystems (Bastion assumes chargen complete; Social Combat references character stats)
- **Recommendation:** YES. Extract standalone "Character Creation" post with races, skill assignment, companion/sanctuary, starting gear, advancement. Effort: 4–6 hours. This gates all downstream work.

**3. Publishing Sequence:** Dependency order or value order?

**Tier 1 (Pub-ready):** Magic Items, Legacy of Scars, Social Combat  
**Tier 2 (1–2 day polish):** Character Creation, Bastion, Campaign Example  
**Tier 3 (consolidate/archive):** Morality, Knowledge Levels, Sketches

**Recommended Sequence:**
- Week 1: Formalize + publish Character Creation
- Week 1–2: Publish Tier 1 subsystems (Magic Items, Legacy of Scars, Social Combat)
- Week 2–3: Unified campaign example (proof that subsystems cohere)
- Week 3+: Bastion (Märchen-specific rewrite), consolidated Morality, advanced options

**Recommendation:** Follow this sequence. Chargen formalization gates everything; once done, subsystems ship fast.

**4. Terminology & Glossary:** Canonical glossary investment?
- **Problem:** Terms redefined per subsystem (Rank, Bond, Influence, Skill Levels, Knowledge Tier) creates friction
- **Recommendation:** Option A (canonical glossary). Invest 2–3 hours now. Create one reference post with:
  - Core task resolution (Ease, Degree of Success, Skill Total)
  - Character building (FAME, Skill Levels, Ranks, Bonds)
  - Social/Narrative (Influence, Composure, Engagement, Consequence)
  - Item & Nemesis (Bond Rank, Story Thread, Tier, Legacy)
  - Time scales (Watch, Moment, Once, etc.) with visual reference
  - Front matter: `no_toc: true`, `series_step: 1.5` (read after intro, before core)

**5. Campaign Example:** MVP or full arc?
- **MVP Option:** 3–4 session example showing chargen → first encounter → Nemesis → Bastion downtime → social negotiation. 1,500–2,000 words; 4–6 hours. **Proves** subsystems work together.
- **Full Option:** 12–20 session arc with multiple Nemesis escalations + item discovery + seasonal turns + final confrontation. 12–16 hours.
- **Defer Option:** Ship subsystems first; write example after feedback.
- **Recommendation:** MVP (Option 1). Tight 3–4 session proof-of-concept. Pair with Referee guidance post (see below).

**6. Referee Support:** Standardize across subsystems?
- **Current State:** Magic Items have excellent GM guidance; Social Combat minimal; Bastion D&D-ified
- **Recommended Structure (all subsystem posts):**
  - Prep Checklist (what to prepare before table)
  - Common Pitfalls (what GMs often miss)
  - Integration Notes (how this subsystem plays with others)
  - House Rule Ideas (optional tweaks for different playstyles)
- **Effort per subsystem:** 30 min–1 hour
- **Recommendation:** YES. Add to all published subsystems. Standardization signals quality + helps adoption.

### Team Coordination Requests

- **Galadriel (Templates/Navigation):** Märchen Engine posts form a series. Should homepage carousel surface this as a collection (like "Prompts" or "Slides")? Consider new category/subcategory for "TTRPG Systems"?
- **Faramir (Taxonomy/Search):** Introduce new taxonomy: `Subsystem Type` (core, optional, setting-specific). Need tag/metadata support to distinguish core mechanics (must-read) from optional subsystems (read-as-desired).
- **Aragorn (Content Strategy):** RPG schema expansion (issue #181) should account for Märchen Engine's `Story Thread Rank`, `Bond`, `Nemesis Tier` mechanics. Coordinate on front matter extensions once schema spec ready.

### Effort & Timeline Estimate

- **Chargen Extraction:** 4–6 hours
- **Canonical Glossary (if approved):** 2–3 hours
- **Campaign Example MVP (if approved):** 4–6 hours
- **Referee Support Standardization:** 30 min–1 hour per subsystem
- **Front Matter + Series Metadata:** 2–3 hours
- **Total for full MVP:** 12–18 hours (2–3 weeks at steady pace)

### Status & Blockers

- **Current:** Awaiting Ted's decisions on 5 strategic points
- **Blocker:** Ted approval required before Chargen extraction can proceed (gates all downstream)
- **Next Steps:** Once decisions locked, finalize chargen extraction → Tier 1 subsystems → campaign example

**Status:** ⏳ Awaiting-Decision

