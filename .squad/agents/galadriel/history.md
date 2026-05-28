# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own Jekyll architecture, GitHub Pages compatibility, and build strategy.
- 2026-05-28T23:11:34Z — Architectural assessment merged into decisions.md. Five structural recommendations prioritized: (1) remove 36 `.bak` files (high/low), (2) decompose `default.html` 630-line layout (medium/medium), (3) add prompt tag index to `category_recent_index.rb` (medium/medium, ADR 0008 deferred), (4) ratify ADR 0004 (medium/low), (5) commit `.squad/` to git (high/low). Strong ADR governance, registry-driven architecture, and modular includes; weak on source hygiene.
