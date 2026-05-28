# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own build QA, accessibility checks, link integrity, and regression review.
- 2026-05-28T23:11:34Z — Quality scan merged into decisions.md. Core gates pass; three high-risk issues identified: (1) 3,457 internal HTMLProofer failures (non-blocking CI, includes 234 `<img>` with no `src` — template defect), (2) Node.js 20 deprecation (June 2 hard deadline), (3) 1.16 GB artifact (exceeds 1 GB limit). Additional issues: Ruby test YAML Date parse blindness (all 1,009 posts invisible to image/alt audits), Middle-earth cache drift, README TOC drift. P0/P1/P2/P3 action plan prioritizes Node.js updates and `<img>` defect fix this week.
