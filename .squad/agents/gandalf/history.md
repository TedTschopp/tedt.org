# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own scripts, feeds, Mastodon integrations, and workflow automation.
- 2026-05-28T19:08:13.048-07:00 — Completed automation & integration review focused on workflows, scripts, and Mastodon tooling. Key findings: (1) Node.js 20 EOL risk tracked in #150 (P0), (2) Mastodon dry-run validation gap (P1), (3) Embedded Python API calls in bash for Allure (P2 maintainability debt), (4) Missing retry backoff on artifact downloads (P2 resilience), (5) Inconsistent Python entry points (P3 hygiene), (6) Token scope validation missing (P2 safety). All findings documented in gandalf-review.md. #142 (Mastodon hardening) should expand to include dry-run gates and scope validation. No new critical blockers beyond #150.

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
✓ Orchestration log: `.squad/orchestration-log/2026-05-29T02:08:13Z-gandalf.md`  
✓ Session summary: `.squad/log/2026-05-29T02:08:13Z-website-code-review.md`  
✓ GitHub issues: #163 (tracker), #165–#177 (new findings)

### Next Step
Await team triage and prioritization of recommendations.

---

## Analytics & Editorial Automation Audit — May 28, 2026

**Date:** 2026-05-28T20:09:45.997-07:00  
**Scope:** Analytics tracking surfaces + editorial metadata automation  
**Output:** `.copilot/session-state/.../files/followup-audit/gandalf-analytics.md`

### Key Findings

**Analytics:**
- GA4 + Clarity instrumentation in place but lacks content classification (no category dimension).
- Search/outbound/download tracking enabled; no scroll depth or conversion goals.
- Feed analytics dark (no measurement of JSON Feed / Mastodon post performance).
- Consent compliance gap: no banner; assumes implied consent.

**Editorial Automation:**
- 5 working automation scripts (tagging, Mastodon backfill, validation) scattered across `_code/`.
- Validation suite (image alt, feeds, paths) exists but **not enforced in CI**.
- Massive metadata gaps per Aragorn review: excerpt (29%), tags (31%), image-alt (31%), internal links (0%).
- **Blocker:** 699 posts without alt text; accessibility + SEO risk.

**Automation Opportunities:**
- Consolidate tag automation into unified metadata CLI.
- Auto-generate excerpts from content + tags from categories.
- Detect related posts by tag overlap (unblock Aragorn #185).
- Add GA4 custom dimension for `post_category` (unblock discovery analysis).

### Quick Wins (This Sprint)
1. Enable CI validation gates (30 min) — Block alt-text gaps on deployment.
2. Add GA4 category dimension (30 min) — Unblock discovery analysis.
3. Consolidate tag automation (1 hour) — Reduce manual tagging debt.
4. Stub excerpt auto-generation (1 hour) — Improve SEO meta descriptions.

### Medium-Term Infrastructure
1. Build unified editorial CLI with subcommands (validate, enrich, audit) — 3 hours.
2. Mastodon metadata auto-generation — 1.5 hours.
3. Attribution model: content discovery tracking — 2 hours.
4. Metadata health observability (Prometheus metrics export) — 3–4 hours.

### Strategic Recommendations
- Tier 1 (this sprint): CI validation + GA4 category dimension.
- Tier 2 (next sprint): Unified editorial CLI + excerpt/tag consolidation.
- Tier 3 (roadmap): Attribution, observability, consent modernization.

### Coordination Notes
- Coordinate with Aragorn on content priorities (issues #178, #183, #184, #185).
- Coordinate with Gimli on CI/deployment sequencing (enable validation gates).
- No new infrastructure or dependencies required; reuses existing patterns.

### Repository Evidence
- Analytics: `_config.yml` (131–146), `js/main-site-analytics.js`, `_includes/analytics/`, `.github/workflows/mastodon-feed.yml`
- Automation: `_code/add_prompt_tags.py`, `_code/backfill_masto_posts.py`, `_code/validate_prompts_yaml.py`, etc.
- Validation: `tests/check_image_alt_text.rb`, `tests/check_feed_integrity.rb` (not in CI yet).
- Content audit: Aragorn issue summary (1,009 posts, 9 new issues, metric deltas)

## 2026-05-29: Scribe Inbox Consolidation & Cross-Team Synthesis

**Role:** Team audits merged into `.squad/decisions.md`; orchestration log recorded; cross-team alignment synthesized  
**Input:** Gandalf (automation/analytics audit), Faramir (discovery audit), Elrond (AI-SEO/metadata audit)  
**Output:** Consolidated decision records; 4 orchestration logs; Aragorn priority synthesis  
**Key Alignment:** All three audits independently converge on metadata infrastructure (tags, related-posts, series) as critical bottleneck  
**Next Steps:** Aragorn activates "three-move tranche" for immediate execution (tag infra → related-posts → series pilot)

