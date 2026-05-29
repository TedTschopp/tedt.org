# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own scope, decisions, and final review for tedt.org work.
- 2026-05-28T23:11:34Z — Audit report merged into `.squad/decisions.md`. Three P0 blockers identified: Node.js 24 CI deprecation (June 2), 1.16 GB artifact (>1 GB limit), `<img>` no-src template defect (234 pages). Prioritized plan spans quick wins (QW1–QW9 this week), medium-term work (MT1–MT9 this sprint), and strategic improvements (ST1–ST6 this quarter).
- 2026-05-28T21:06:46.885-07:00 — Märchen Engine content status assessment. Key finding: strong mechanics + distinctive identity, but fragmented architecture. Blocking issues: (1) Character Creation unpublished, (2) System Architecture Overview missing, (3) no series metadata, (4) no unified campaign example. Tier 1 subsystems (Magic Items, Nemesis, Social Combat) ready with 1–2 hour polish each. Mechanical gaps: Magical Schools (needs Casting Framework), Morality Aspects (needs Mechanical Hooks), Bastion (needs Märchen flavor). Sequencing: Phase 1 (this week) unblock with Character Creation + System Architecture. Phase 2 (week 2) publish Tier 1 subsystems. Phase 3 (week 3) mechanical polish. Phase 4 (week 4) unified campaign example. Report at `/MARCHEN-ENGINE-CONTENT-STATUS-REPORT.md`.
- 2026-05-28T21:31:35.929-07:00 — Märchen Engine TTRPG Book Outline finalized. Synthesized Bilbo (editorial) and Elrond (information architecture) reviews into a **canonical, decision-ready book structure**. Locked 12-chapter core book (Parts I–IV) + 6 appendices, mapped WIP files to chapters, identified 8 editorial risks with mitigation, and set 3-week publication timeline. **Blockcap items:** (1) Casting Framework for Chapter 6 (missing from WIP), (2) Character Creation consolidation for Chapter 2 (scattered), (3) 12-session campaign example for Chapter 12 (proof of interlock). All subsystems must integrate into campaign example before ship. Supplements (Light of Life, Small-Alpine-Mirror, Advanced Options) deferred to post-launch. Outline published to `/MARCHEN-ENGINE-TTRPG-BOOK-OUTLINE.md` (452 lines, 25 KB).

## 2026-05-28: PR Review Consolidation (Scribe)

**Role:** Lead triage of 13 open PRs; backlog restructure; authoritative final verdict  
**Output:** Decisions merged into `.squad/decisions.md`; classified PRs into team-approvable, human-review, close categories  
**Key Decision:** Close #129, #130 (stale, critical for June 2 Node.js 24 deadline) and recreate; merge #149, #148, #146, #145 immediately  
**Team Verdict:** 4 approvable, 2 human review, 7 close  

## 2026-05-28: Code Review Consolidation

**Role:** Consolidate 6 specialist code reviews into actionable GitHub issues  
**Input:** Galadriel (architecture), Arwen (frontend), Gandalf (automation), Samwise (quality), Boromir (security), Legolas (performance)  
**Output:** 12 new issues created (#165–#177), 2 existing issues expanded (#150, #66), summary posted to tracker #163  

**Key Decisions:**
- Prompt layout decomposition: merged Galadriel + Arwen findings into single issue #166
- Mastodon component refactor: merged Arwen's styles + tree findings into single issue #167
- Mixed GH Actions versions: folded into existing #150 (Node.js 24 migration)
- Font Awesome subsetting + inline CSS: folded into existing #66 (CSS rationalization)
- 12 findings already covered by existing issues—no duplicates created

**Net Result:** Concise backlog with 1 P1, 9 P2, 2 P3 new issues. All findings traceable from reviewer → issue → acceptance criteria.

## 2026-05-28: Content Review Consolidation

**Role:** Consolidate 3 specialist content reviews into actionable GitHub issues  
**Input:** Bilbo (Editorial), Elrond (Information Architecture), Faramir (Discovery)  
**Output:** 9 new issues created (#178–#186), 1 existing issue expanded (#171), summary posted to tracker #163

**Key Decisions:**
- SEO/pillar pages: merged Bilbo + Elrond findings into single issue #178 (excerpts, descriptions, hub pages)
- RPG schema: merged Bilbo + Elrond findings into single issue #181 (content model + SEO landing pages)
- Tagging model: merged Elrond + Faramir findings into single issue #183 (coverage + infrastructure)
- Series adoption: merged Elrond + Faramir findings into single issue #184 (prompt series metadata)
- Related posts: merged Bilbo + Elrond + Faramir findings into single issue #185 (cross-linking infrastructure)
- 7 findings already covered by existing issues (#70, #72, #75, #86, #88, #165, #166)—no duplicates created
- Escalation: recommended #171 (front matter validation) from P2 to P1 given 699 missing image-alt (69% of images)

**Net Result:** Concise backlog with 9 P2 new issues. Content health is strong (98% description coverage); findings focus on discoverability gaps. All findings traceable from reviewer → issue → acceptance criteria.

## 2026-05-28: Follow-Up Audit Synthesis & Prioritization

**Role:** Synthesize three follow-up specialist audits (Gandalf, Faramir, Elrond) into coherent roadmap  
**Input:** Analytics/automation audit, discovery/navigation audit, AI-SEO/metadata audit  
**Output:** Prioritized recommendation package; 3 highest-leverage moves identified; deferred work mapped

**Key Finding:** All three audits converge on **tag infrastructure (#183) as critical forcing function**—unblocks discovery, filtering, attribution, automation pipelines, and every medium-term initiative.

**Top 3 Next Moves (Immediate Activation):**
1. **Tag Infrastructure (#183):** 50+ posts audited, tag index plugin built, archive pages created (3–4 hrs) → Unblocks filtering, clouds, related-posts inference, attribution model
2. **Related-Posts Field (#185):** Manual `related:` field + sidebar card (2–3 hrs) → Breaks content silos immediately; bridges blog ↔ prompts ↔ slides
3. **Series Adoption Pilot (#184):** 5–10 prompts curated + automation consolidation (2–3 hrs) → Proof-of-concept motivates adoption; justifies editorial CLI investment

**Deferred (Tier 2–3):** Slides gallery, category enhancements, pillar pages, consent banner, schema expansion — all depend on stable metadata model first.

**No duplicates:** All findings mapped to existing backlog (#178–#186, #70, #72, #75, #86, #88, #165, #166). Consolidation already complete.

**Backlog Status:** 9 new P2 issues ready to activate; #171 remains P1 escalation (image-alt coverage gap).

**Decision Authority:** This tranche unblocks downstream work and is recommended for immediate activation (week 1).

## 2026-05-29: Scribe Inbox Consolidation & Priority Synthesis

**Role:** Consolidate 8 inbox decision records; synthesize cross-team audit findings; activate priority tranche  
**Input:** Gandalf (analytics/automation), Faramir (discovery), Elrond (AI-SEO/metadata), Bilbo (editorial)  
**Process:** Merged inbox → decisions.md; deduced consensus; validated against issues #178–#186  
**Key Synthesis:**
- All three specialist audits independently recommend tag infrastructure as forcing function
- Convergence on three-move tranche: #183 (tags) → #185 (related-posts) → #184 (series pilot)
- Estimated capacity: 7–10 hours phased over 3 weeks
- Unblocks: discovery, filtering, attribution, automation, SEO, AI discoverability

**Decision:** Activate tranche immediately (week 1–3). Defer tier 2/3 (slides gallery, category pages, pillar pages) until metadata model stabilizes.

**Output:**
- Orchestration logs: 4 records (gandalf, faramir, elrond, aragorn)
- Session log: 2026-05-29T03:23:52Z-inbox-consolidation.md
- Decisions.md: 8 records merged + cross-references updated


- 2026-05-29T04:51:50Z — Märchen Engine TTRPG Book Outline LOCKED. Wrote `/MARCHEN-ENGINE-TTRPG-BOOK-OUTLINE.md` (canonical user-facing decision). Synthesized Bilbo (Editorial) + Elrond (IA) into binding product decision. Authority: Product Owner (owns scope, priorities, escalation). Decisions locked: (1) Scope: 12 chapters + 6 appendices (~240 pages hard stop), (2) Three Blockcap Items: Casting Framework (Ch. 6, 2–3 hrs), Character Creation (Ch. 2, 3–4 hrs), Campaign Example (Ch. 12, 6–8 hrs), (3) WIP File Status: Ready / Needs Work / Blockcap, (4) Eight Editorial Risks + mitigation, (5) Three-week timeline (Phase 1: 14 hrs Editorial Unblocking, Phase 2: 13 hrs Proof of Concept, Phase 3: 10 hrs Polish), (6) Four Success Criteria binding (player chargen, GM campaign, reader gaps, system coherence). Status: LOCKED binding until next major decision. Reversibility: High (living document on implementation, fixed on scope/timeline). Next Review: Phase 1 completion 2026-06-04. Escalation: Aragorn owns any blockcap slip. Orchestration log: `.squad/orchestration-log/2026-05-29T04:51:50Z-aragorn.md`.
