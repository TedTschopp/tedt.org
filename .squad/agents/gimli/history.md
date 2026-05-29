# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own CI health, Pages deploys, workflow stability, and merge readiness.

## 2026-05-28: Merge-Readiness Review of 13 PRs (Scribe)

**Role:** DevOps/release readiness assessment  
**Findings:** 5 CLEAN mergeable; 5 DIRTY/CONFLICTING (6 months old); 2 blocked/failing; 1 ADR-violation  
**ADR 0009 Alert:** PR #126 violates ffi pin; recommend close + policy update  
**Critical:** PR #129 (setup-node) is highest-priority action — feeds June 2 deadline  
**Consolidated:** Output merged into decisions.md  

## 2026-05-29: PR State Changes (Ted Tschopp → Gimli)

**Operation:** GitHub PR merge & close per merge-readiness assessment  
**Merged (4):** #149, #148, #146, #145 (approved PRs)  
**Closed (7):** #126, #129, #130, #131, #132, #133, #134 (stale/dirty, rationale comments added)  
**Left open (2):** #137, #139 (retained for future review)  
**Rationale:** ADR 0009 constraint preserved (ffi 1.16.3 pinned); stale dirty workflow/dependency PRs retired cleanly so fresh replacements can be raised against current main.

