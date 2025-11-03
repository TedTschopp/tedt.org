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

### Technology Stack & Included Tooling

High-level components and libraries in active use. Agents should leverage existing patterns instead of introducing parallel solutions.

Core Framework & Build:

- Jekyll 4.3.x+ (static site generation; Liquid templating). See ADR 0008 for performance considerations (recent caching) and memory probe instrumentation.
- Ruby (>=3.1 on CI) with conditional gem constraints for security (Gemfile logic controlling `nokogiri`, `google-protobuf`, `sass-embedded`).
- Bundler (dependency management) + `bundler-audit` for Ruby Advisory DB checks.

Templating & Content:

- Liquid (filters, control flow). Avoid heavy nested `where` + `sort` chains; prefer cached indices per ADR 0008.
- Markdown posts under `_posts/` (including `_posts/Slides/` for Reveal.js decks).
- Front matter feature flags (ADR 0010 `no_toc`, ADR 0011 `mermaid`). Keep new flags documented in README + instructions before use.

Presentation & Styling:

- SCSS (`_sass/`), compiled via Jekyll pipeline; global slides theme (`_sass/components/_slides-theme.scss`) and archetypes (`_sass/components/_slides-archetypes.scss`).
- Rouge (syntax highlighting) – do not inline highlight logic.
- Reveal.js integrated via `layout: reveal-integrated` (decks only; rely on shared theming, no per-deck inline CSS except minimal overrides when absolutely necessary).

Data & Registry Structures:

- `_data/category_registry.yml` drives category theming & carousel (ADR 0006, 0007).
- `recent_by_category` cache (ADR 0008) to avoid repeated full scans.

Social / Syndication:

- Custom Python scripts in `_code/` for Mastodon feed management (`backfill_masto_posts.py`, `sync_masto_ids_from_cache.py`, etc.)—extend rather than duplicate.
- RSS / JSON feeds via Liquid + helper scripts (`generate_rss.py`).

Quality Gates & CI:

- HTML Proofer (link + HTML integrity). When adjusting templates, prefer fixing root cause rather than ignoring failures.
- Memory probe plugin (env gated `MEM_PROBE=1`) and optional periodic GC (ADR 0008). Use only during diagnostics.
- GitHub Actions workflows: site build, deploy, Mastodon sync/audit.

Security & Dependency Constraints:

- `ffi` pinned to 1.16.3 (ADR 0009) for build stability; revisit only if CVE necessitates.
- Conditional enforcement of patched versions for `nokogiri` and `google-protobuf` when Ruby runtime allows.

Filtering & Client-Side Behavior:

- Topic filtering for slides implemented in `_includes/slides/filter-controls.html` (no synthetic content; real decks only).
- Random start position for category carousel (ADR 0003) implemented client-side for equitable exposure.

Extensibility Guidelines:

- Before adding a new library: check existing includes (`_includes/assets/`) and ADRs for overlap.
- Avoid introducing plugins unsupported by GitHub Pages safe mode.
- Prefer data-driven adjustments (YAML, includes) over expanding layout complexity.

When proposing major shifts (e.g., adopting a collection, changing caching strategy, introducing a new diagram library), draft a new ADR first with clear performance/accessibility impact analysis.

