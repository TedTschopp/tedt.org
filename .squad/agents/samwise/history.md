# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own build QA, accessibility checks, link integrity, and regression review.
- 2026-05-28T23:11:34Z — Quality scan merged into decisions.md. Core gates pass; three high-risk issues identified: (1) 3,457 internal HTMLProofer failures (non-blocking CI, includes 234 `<img>` with no `src` — template defect), (2) Node.js 20 deprecation (June 2 hard deadline), (3) 1.16 GB artifact (exceeds 1 GB limit). Additional issues: Ruby test YAML Date parse blindness (all 1,009 posts invisible to image/alt audits), Middle-earth cache drift, README TOC drift. P0/P1/P2/P3 action plan prioritizes Node.js updates and `<img>` defect fix this week.

## 2026-05-28: QA Review of 13 PRs (Scribe)

**Role:** Quality/regression review; PR tiering (Tier 1–4)  
**Findings:** Tier 1 (4 PRs ready), Tier 2 (6 stale/conflicting), Tier 3 (2 policy-gated), Tier 4 (1 draft)  
**P0 Actions:** #146, #148, #139, #130, #129 all on Node.js 24 critical path (June 2 deadline)  
**Consolidated:** Output merged into decisions.md Section 5–6  


## 2026-05-28T19:08: Detailed QA Review — 6 Quality Findings

**Scope:** Build QA, accessibility, test harness gaps, CI gates, template complexity, validation blindness

**Deliverable:** `samwise-review.md` at `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/`

**Key Findings:**
1. **P1: Ruby test YAML Date parsing blindness** — 18+ posts skipped by image/alt validators (mapped to #153)
2. **P1: Non-blocking CI gates** — HTMLProofer & a11y use `continue-on-error: true`, masking 234 img/src bugs (mapped to #157)
3. **P2: Front matter validation gaps** — No checks for required fields (image-alt, category slugs, date format) — NEW
4. **P2: a11y test coverage incomplete** — No systematic form labeling, ARIA, carousel keyboard, heading hierarchy tests — NEW
5. **P2: Monolithic template complexity** — prompt-library 1,883L, prompt-details 1,000L, default 630L (mapped to #67 partial)
6. **P2: Feed snapshot baseline drift** — No clear refresh workflow; 5 items differ (mapped to #155 partial)

**Mapping to existing issues:** 4 of 6 findings already tracked (#153, #157, #67, #155); 2 are NEW (front matter validation, a11y coverage).

**Quality Posture:** Site deploys successfully. However, quality checks are advisory (continue-on-error), and two validation systems silently skip content (Ruby YAML parsing). Both P1 issues are blocking and should be addressed before next release.


## Team Code Review Session — May 28, 2026

**Date:** 2026-05-29T02:08:13Z  
**Type:** cross-agent-coordination  
**Outcome:** Specialist review completed; findings consolidated into 13 new issues + 2 expanded issues

### Session Role
- Delivered read-only code review focusing on [specialist domain]
- Findings merged into `.squad/decisions.md`
- Consolidated by Aragorn (Lead) to avoid duplication
- New issues queued for team prioritization

### Integration
✓ Orchestration log: `.squad/orchestration-log/2026-05-29T02:08:13Z-samwise.md`  
✓ Session summary: `.squad/log/2026-05-29T02:08:13Z-website-code-review.md`  
✓ GitHub issues: #163 (tracker), #165–#177 (new findings)

### Next Step
Await team triage and prioritization of recommendations.

