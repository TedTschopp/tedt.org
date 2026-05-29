# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own search, tags, related content, and discovery-oriented navigation.
- 2026-05-28T19:53:42.576-07:00 — Completed first content discovery audit. Key gaps: tags (30% adoption), no related-post infrastructure, Gamma World dominance (69%), sparse internal linking, series unused (0.3%), weak category landing pages, no site search. Prioritized 8 findings with actionable next steps. See faramir-review.md for full audit.

## Learnings

- 2026-05-28T20:09:45.997-07:00 — Second audit: full discovery surface investigation. Completed audit of homepage carousel (caches well, excludes Prompts), category pages (strong but no cross-linking), post layout (no tags, no related posts), next/previous (chronological only, breaks narrative), Prompts (isolated collection, 5.4% series adoption), Slides (invisible from homepage). Key friction: content silos between collections, zero tag discovery, weak series adoption. Repo evidence collected from 15+ includes, layouts, registry. Three critical gaps identified: tag infrastructure (30.5% adoption, 0% discoverability), related-posts field (doesn't exist), cross-collection bridges (Prompts/Slides excluded from carousel). Highest-ROI work: Issue #183 (tags), #185 (related posts), #184 (series). Wrote comprehensive audit to /followup-audit/faramir-discovery.md. See that file for full repo evidence, friction analysis, quick wins, and phased work breakdown.

## 2026-05-29: Scribe Inbox Consolidation & Cross-Team Validation

**Role:** Audit consolidated into decisions.md; cross-team alignment validated; decision synthesis recorded  
**Input:** Faramir discovery audit + Gandalf analytics + Elrond AI-SEO audits  
**Key Validation:** All three audits independently recommend identical tranche sequence: tag infrastructure → related-posts → series adoption  
**Cross-Team Consensus:** Tag infrastructure (#183) is universal forcing function; enables downstream discovery, filtering, attribution, automation, SEO  
**Next Phase:** Faramir lead on tag infrastructure implementation (Issue #183); coordinate with Aragorn on tranche activation timeline  
**Output:** Orchestration log 2026-05-29T03:23:52Z-faramir.md; decisions.md consolidated
