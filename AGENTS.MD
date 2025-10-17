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
- `_config.yml` → site configuration
