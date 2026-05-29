# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Key Policies & Constraints

- **ADR 0009:** `ffi` pinned to 1.16.3 (temporary stability pin; 1.17.x unavailable on CI). Upgrade path deferred until Ruby baseline raised to >= 3.1.
- **Gemfile constraints:** Ruby >= 3.1 unlocks patched versions (`nokogiri >= 1.18.9`, `google-protobuf >= 3.25.5`, `sass-embedded >= 1.77.0`).
- **P0 blocker (Aragorn):** Node.js 20 deprecated June 2, 2026 → GitHub Actions must upgrade to Node.js 24 runtime ASAP.

## Work Log

- 2026-05-28T16:48:29.411-07:00 — **PR Security Review (13 open PRs).** 
  - Reviewed all 13 open PRs from security/privacy/dependency perspective.
  - **Recommend merge (10):** #149, #148, #146, #134, #133, #132, #131, #130, #129, +1 more (assess #131 locally).
  - **Recommend close (3):** #126 (violates ADR 0009), #145 (stale), #139 (stale/build failed), #137 (stale; good code but no merge signal).
  - **Key finding:** #126 is direct violation of ADR 0009 pinning policy. Updated PR triage in `.squad/decisions/inbox/boromir-pr-security-review-2026-05-28.md`.
  - **Automation surface:** All GitHub Actions bumps are safe; no new credential/exfiltration vectors. Require runner v2.329.0+ (GitHub hosted runners qualify).
  - **Privacy:** No changes detected.
  - **Learnings:** Dependabot unaware of ADR constraints; recommend policy update to `.dependabot.yml` to block ffi updates until formal upgrade decision.

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own security review, privacy safeguards, dependency risk, and automation safety.

## 2026-05-28: Security Review of 13 PRs (Scribe)

**Role:** Security and privacy assessment  
**Findings:** No privacy/analytics leaks; 3 security wins (#149 ReDoS, #145 CWE-1321, #137 XSS); all others low-risk  
**ADR Alignment:** Confirmed PR #126 conflicts with ADR 0009 ffi pin  
**Automation Risk:** Verified GitHub Actions v9 ESM change; recommend grep for require() patterns  
**Recommendation:** Merge P0 actions first; close #126 per ADR; update Dependabot policy  
**Consolidated:** Output merged into decisions.md  

## Learnings

- 2026-05-28T19:08:13.048-07:00 — **Full Codebase Security/Privacy Review.**
  - Reviewed: Gemfile, workflows, analytics includes, third-party integrations, automation scripts
  - **6 findings total:** 3 new issues recommended, 3 already tracked
  - **P0 confirmed:** Node.js 20 deprecation deadline (June 2) — #150 urgent
  - **Privacy gap:** GA4 + Clarity with session replay enabled but no cookie consent banner — recommend P2 issue
  - **Positive:** `main-site-analytics.js` has good privacy defaults (anonymize_ip, no signals); Gemfile enforces patched CVE versions on Ruby >= 3.1
  - **Automation safety:** Mastodon mutation guard in `mastodon-feed.yml` is a good pattern; should be documented for maintenance
  - **Documentation debt:** `COPILOT_ASSIGN_TOKEN` secret undocumented — creates ops friction
  - Review artifact: `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/code-review/boromir-review.md`


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
✓ Orchestration log: `.squad/orchestration-log/2026-05-29T02:08:13Z-boromir.md`  
✓ Session summary: `.squad/log/2026-05-29T02:08:13Z-website-code-review.md`  
✓ GitHub issues: #163 (tracker), #165–#177 (new findings)

### Next Step
Await team triage and prioritization of recommendations.

