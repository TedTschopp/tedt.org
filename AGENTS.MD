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

Reveal.js slide decks are regular posts stored under `_posts/Slides/` (not a separate collection). Templates attempt `site.slides` only if such a collection is reintroduced; otherwise they filter `site.posts` for that path prefix. When adding or modifying decks:

1. Place file in `_posts/Slides/` with front matter `layout: reveal-integrated`.
2. Include `date`, `title`, `description`, and optional `topics`, `preview_html`, `image`.
3. Avoid inline `<style>`; extend `_sass/components/_slides-theme.scss` or `_slides-archetypes.scss`.
4. Keep permalink pattern `/slides/{slug}/` via explicit `permalink` in front matter.
5. Do not recreate the old `slides` collection unless an ADR updates the architecture.

