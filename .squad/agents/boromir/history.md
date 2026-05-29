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

