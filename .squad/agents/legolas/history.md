# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own images, fonts, lazy loading, PWA assets, and media performance.
- 2026-05-28T19:08:13.048-07:00 — Completed performance & media audit. Key findings:
  - Hero media: 11 WebP/MP4 pairs precached (good), but 11 PNG fallbacks (44 MB) unoptimized. Overlaps with #88 (image audit).
  - Service Worker: cache-first for hero works, but no offline fallback for failed loads. **New issue candidate.**
  - Font Awesome: full 7.0.0 CSS (50+ KB) loaded site-wide; site uses ~30 icons. Subsetting opportunity tied to #66.
  - PWA Manifest: commented out, no file found. Issue #62 covers but needs action.
  - Homepage image loading: carousel has lazy load (good), but hero image loads eagerly. Aligns with #68 scope.
  - CSS/Font loading: 15+ conditional sheets + 6 KB inline styles block rendering. Issue #66 tracks.
  - **Cross-issue mapping complete:** 6 findings; 3 existing issues cover 5; 1 new candidate (Service Worker fallback).
  - Site asset footprint: img/ (625M) + media/ (132M) = 757 MB; repo size likely contributor to #152 GitHub Pages 1.16 GB artifact limit.

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
✓ Orchestration log: `.squad/orchestration-log/2026-05-29T02:08:13Z-legolas.md`  
✓ Session summary: `.squad/log/2026-05-29T02:08:13Z-website-code-review.md`  
✓ GitHub issues: #163 (tracker), #165–#177 (new findings)

### Next Step
Await team triage and prioritization of recommendations.

