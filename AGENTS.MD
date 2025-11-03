# AGENTS.md

## Project Context
This repository powers a static site built with **Jekyll** and hosted via **GitHub Pages**.

## Agent Behavior
When assisting with this project:
1. Use Liquid syntax compatible with GitHub Pages' version of Jekyll.
2. Do **not** introduce unsupported plugins — GitHub Pages runs in safe mode.
3. Validate builds by running `bundle exec jekyll build` before suggesting changes.
4. Respect existing permalink and layout structures.
5. Follow accessibility best practices (semantic HTML, labeled elements, color contrast).
6. Use `commit-guidelines.md` when proposing commits.
7. For pull requests, reference `pr-guidelines.md`.
8. For reviews, follow `review-guidelines.md`.

## Site Structure Reference
- `_layouts/` → page templates
- `_includes/` → reusable snippets
- `_sass/` → shared styling
- `assets/` → compiled static resources
- `_posts/` → Markdown content
-- `_config.yml` → site configuration


### Slides Canonical Location

Reveal.js slide decks are regular posts stored strictly under `_posts/Slides/` (NO separate `slides` collection; that legacy approach is deprecated). Templates filter `site.posts` by `relative_path` containing `_posts/Slides/` to build the index and topic filters. If a future architecture change proposes re‑introducing a collection, it MUST be formalized in a new Accepted ADR first—until then, never reference `site.slides`.

When adding or modifying decks:

1. Place file in `_posts/Slides/` with front matter `layout: reveal-integrated`.
2. Include mandatory `date`, `title`, `description`; optional `topics`, `preview_html`, `image`, `aspect_ratio`, `last_modified`, `deck-style`.
3. Avoid inline `<style>`; extend `_sass/components/_slides-theme.scss` or `_sass/components/_slides-archetypes.scss`.
4. Set explicit `permalink: /slides/{slug}/` (slug derived from filename) to keep stable URLs.
5. Do not create a `slides` collection—submit an ADR if requirements evolve.

