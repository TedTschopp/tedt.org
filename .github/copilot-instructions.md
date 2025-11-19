## TedT.org – AI Agent Working Instructions

Purpose: Enable AI coding agents to make fast, correct, minimal, high‑signal changes to this Jekyll site.

### 1. Core Architecture
Static site powered by Jekyll 4.3.x. Primary levers:
* `_layouts/` define page skeletons (e.g. `default.html`, `post.html`).
* `_includes/` is heavily modularized into subfolders (analytics, assets, layout, utility, homepage, etc.). Always place new partials in the correct subdirectory using kebab‑case.
* `_data/` supplies structured metadata (notably `category_registry.yml` and `homepage_heroes.yml`). These drive dynamic category labeling, color palettes, carousel population, and hero media selection.
* `_config.yml` contains extended author/social metadata and optional caches like `recent_by_category` used to accelerate homepage/category rendering.
* Custom scripts in `_code/` (Python + one Ruby) perform Mastodon backfill, feed generation, YAML normalization, category audits. Do not duplicate logic—extend or parameterize an existing script first.

### 2. Homepage Dynamics
The homepage (`_layouts/default.html` + includes) assembles:
* Blog & Folklore cards: filtered to exclude specific categories/layouts (Bestiary, Draft, RPG variants, Quotes, Home, Prompts, micropub posts). When modifying these filters, document rationale in an inline Liquid comment.
* Category carousel: `_includes/homepage/carousel.html` builds a sorted list from `category_registry.yml`, using cached recent posts then (if needed) a broader scan across `site.posts` to surface up to 3 real posts per category. Never introduce synthetic placeholder content.
* Hero system: `_includes/homepage/hero-random.html` + `_data/homepage_heroes.yml` + `sw.js` for caching. When adding a hero, only modify the YAML and place matching `.webp`/`.mp4` assets; JavaScript auto‑selects.

### 3. Category & Theming Model
`_data/category_registry.yml` entries supply: slug → label, aliases (`raw_names`), emoji, palette (gradient + title color overrides), image, visibility flags, and optional `category_home_page`. Always use existing keys; don’t invent new ones without adding documentation at the top of that file. If adjusting visual tokens (e.g., `palette.titleColorLight`), ensure both light and dark variants have fallbacks.

### 4. Content & Front Matter Patterns
Permalink style: `/:title/`. Posts use rich front matter (images, credits, bullets, feature flags like `no_toc`, `mermaid`). Maintain consistent naming (`image-alt`, `image-credits-artist`, etc.). If you add a new flag, update README front‑matter section and (if globally referenced) add guarded logic (`{% if page.flag %}`) near the relevant include. Avoid bloating layouts with per‑page special cases—prefer small includes.

### 5. Performance & Build Workflow
Local build: `bundle exec jekyll serve` (or the provided VS Code task "Clean build + HTMLProofer (internal)"). Production builds use `JEKYLL_ENV=production`. CI uses GitHub Actions (`.github/workflows/deploy.yml`) running: build with heartbeat monitoring, artifact upload, deterministic deploy. Quick QA gate: `make qa` (normalize dates, build, feed checks, Mastodon validation). Full validation: `make all` (adds HTML Proofer). Keep Gemfile minimal; only add gems when absolutely required. Ruby conditional logic in `Gemfile` enforces secure transitive versions on newer Rubies (>=3.1)—preserve it.

### 6. Link & HTML Integrity
HTML Proofer runs locally via the build task (see failing external links in task output). When editing templates, prefer `post.url | absolute_url` for links and ensure internal anchors exist before referencing them. Don’t suppress proofer failures with blanket ignores; fix root causes or add narrowly scoped exceptions with comments.

### 7. Script Conventions (`_code/`)
Scripts are single‑purpose utilities: auditing categories, syncing Mastodon IDs, deduping statuses, generating RSS. Before writing a new script:
* Search for an existing one with similar output.
* If extending, keep original CLI arguments/backwards compatibility unless intentionally versioning.
* Add usage comments at top (shebang + docstring). Do not hardcode absolute local paths; assume repo root execution.
* Python scripts use type hints and graceful yaml fallback; see `backfill_masto_posts.py` as reference pattern.
* Ruby scripts follow Jekyll plugin conventions when manipulating site data.

### 8. Styling & Assets
SCSS lives under `_sass/`; aggregated includes are managed via `_includes/assets/all-css-includes.html`. New global styles belong in SCSS partials, not inline `<style>` blocks (except tiny, data‑driven helper styles like carousel control tweaks). Reuse utility classes when expanding components.

### 9. Plugin System (`_plugins/`)
Custom Jekyll plugins extend build behavior:
* `memory_probe.rb`: Environment-gated RSS monitoring (enable with `MEM_PROBE=1`). Never remove probe checkpoints—they're used for performance regression detection (ADR 0008).
* `category_recent_index.rb`: Builds `recent_by_category` cache to avoid repeated `site.posts` scans. Auto-runs during build if cache missing.
* `periodic_gc.rb`: Optional forced GC (enable with `FORCE_PERIODIC_GC=1`). Use only for diagnostics.
* `lazy_images_filter.rb`, `safe_sort_filter.rb`: Liquid filters for template convenience.
* Do not add plugins incompatible with GitHub Pages safe mode unless deploying via separate CI workflow (which this site does).

### 9. Plugin System (`_plugins/`)
Custom Jekyll plugins extend build behavior:
* `memory_probe.rb`: Environment-gated RSS monitoring (enable with `MEM_PROBE=1`). Never remove probe checkpoints—they're used for performance regression detection (ADR 0008).
* `category_recent_index.rb`: Builds `recent_by_category` cache to avoid repeated `site.posts` scans. Auto-runs during build if cache missing.
* `periodic_gc.rb`: Optional forced GC (enable with `FORCE_PERIODIC_GC=1`). Use only for diagnostics.
* `lazy_images_filter.rb`, `safe_sort_filter.rb`: Liquid filters for template convenience.
* Do not add plugins incompatible with GitHub Pages safe mode unless deploying via separate CI workflow (which this site does).

### 10. Safe Change Principles
* Touch only related files; avoid cascading refactors.
* Preserve existing Liquid control flow; when altering loops add a Liquid comment explaining the constraint (e.g., reason for exclusion filters).
* Never introduce placeholders or dummy content into rendered HTML.
* If a change might widen query scope (e.g., scanning all `site.posts`), confirm it short‑circuits after meeting display limits.

### 10. Safe Change Principles
* Touch only related files; avoid cascading refactors.
* Preserve existing Liquid control flow; when altering loops add a Liquid comment explaining the constraint (e.g., reason for exclusion filters).
* Never introduce placeholders or dummy content into rendered HTML.
* If a change might widen query scope (e.g., scanning all `site.posts`), confirm it short‑circuits after meeting display limits.

### 11. Accessibility & Semantics
Images require meaningful `alt` (fallback to title if absent). Carousels must retain ARIA labels already present. Do not remove visually hidden instructional text. When adding interactive controls, mirror existing accessibility patterns.

### 11. Accessibility & Semantics
Images require meaningful `alt` (fallback to title if absent). Carousels must retain ARIA labels already present. Do not remove visually hidden instructional text. When adding interactive controls, mirror existing accessibility patterns.

### 12. Adding Categories or Heroes
Category: add an entry to `category_registry.yml` (slug: { title, raw_names, palette, image, description, ... }). Ensure unique slug, define both subtitle & description if shown on carousel.
Hero: add to YAML + assets; no template change needed.

### 12. Adding Categories or Heroes
Category: add an entry to `category_registry.yml` (slug: { title, raw_names, palette, image, description, ... }). Ensure unique slug, define both subtitle & description if shown on carousel.
Hero: add to YAML + assets; no template change needed.

### 13. Common Pitfalls to Avoid
* Breaking front matter with unescaped quotes → site renders raw (no layout).
* Adding broad `slice` limits that hide older but valid content.
* Introducing inline JS where a reusable include exists.
* Forgetting to use `| strip_html` before truncation (causes layout glitches).

### 13. Common Pitfalls to Avoid
* Breaking front matter with unescaped quotes → site renders raw (no layout).
* Adding broad `slice` limits that hide older but valid content.
* Introducing inline JS where a reusable include exists.
* Forgetting to use `| strip_html` before truncation (causes layout glitches).

### 14. Commit & PR Guidance
Atomic commits, clear imperative messages ("Fix blog loop exclusion for Folklore overlap"). If modifying build or category registry, mention potential impact on homepage density.

### 14. Commit & PR Guidance
Atomic commits, clear imperative messages ("Fix blog loop exclusion for Folklore overlap"). If modifying build or category registry, mention potential impact on homepage density.

### 15. When Unsure
Prefer inspecting similar existing include. If introducing a new pattern, isolate it in `_includes/utility/` or a new logically named subfolder and document at top of file.

Stay minimal, data‑driven, and reversible.

### 15. Test & TDD Workflow (Red / Green / Refactor Adapted)
The site has limited traditional unit tests; we approximate TDD using content fixtures + build gates:
1. Red: Introduce (or modify) a minimal post / include to express the desired behavior (e.g., a post requiring `mermaid`, a category edge case) and run `bundle exec jekyll build` (or the provided task) expecting failure (missing asset, layout issue, HTML Proofer error, etc.).
2. Green: Implement the minimal template/include/plugin change to satisfy the scenario. Re‑run build + (optionally) `SKIP_EXTERNAL=1` HTML Proofer to validate internal structure.
3. Refactor: Simplify Liquid, extract repeated blocks into `_includes/utility/`, ensure comments explain non-obvious loops, and remove any exploratory debug output.
4. Regression Safety: For complex behaviors (carousel counts, feature flags), keep a dedicated “test” post in `_work-in-progress/` or under a clearly named draft path so future modifications can be validated quickly.
5. Memory / Performance Checks: When altering wide loops or adding new scans over `site.posts`, optionally run with `MEM_PROBE=1` to ensure no unexpected memory spikes (see ADR 0008).

Principles:
* One behavioral delta per patch.
* Prefer data-driven adjustments over new conditionals in layouts.
* Keep refactors separate from feature commits unless trivial.

### 16. Architecture Decision Digest (Accepted ADRs)
Concise reference of currently Accepted ADRs (see `/docs/adr/` for full text):
* 0001 Prompt Details UX & Accessibility: Mobile-first, clearer form states, dynamic related prompt sections, accessibility improvements.
* 0002 Dynamic Prompt Series Architecture: Front matter–driven series navigation; prompts can belong to multiple ordered workflows.
* 0003 Random Carousel Start Position: Client-side JS randomizes active category slide for equitable exposure.
* 0006 Registry-Driven Category Carousel & Accessibility: Two-pass deterministic build from `category_registry.yml`, improved ARIA semantics, duplicate control reduction.
* 0007 Category Theming Unification: Single registry + `.category-theme` wrapper with JS-driven custom properties to eliminate palette duplication.
* 0008 Memory Probe & Recent Content Caching: Env-gated memory logging + precomputed per-category recent cache to cut redundant loops.
* 0009 Temporary ffi Downgrade Pin: Stability pin to `ffi 1.16.3` until Ruby baseline uplift allows ecosystem upgrades.
* 0010 `no_toc` Flag: Opt-out of TOC card for concise posts.
* 0011 `mermaid` Flag: Opt-in conditional diagram support + collapsible source panels amendment.

Proposed (for awareness, not yet binding): 0004 Prompt Library Integration, 0005 Multi-Scale Hex Overlay Visualization. Treat these as directional; avoid implementation drift until status is Accepted.

### 17. `recent_by_category` Cache Maintenance
Purpose: Speed homepage & carousel rendering by avoiding repeated global scans when selecting recent posts per category.
Location: Stored in `_config.yml` (or generated plugin structure) as a hash keyed by category slug.
Refresh Situations:
* Adding many posts that should immediately appear on the homepage but are absent due to stale cache.
* Changing category slug / alias logic in `category_registry.yml`.
* Modifying selection heuristics (e.g., filtering out new layouts or categories).
Refresh Method:
1. Remove or comment the existing `recent_by_category` block in `_config.yml` (or run a dedicated script if present).
2. Run a full clean build: `rm -rf _site && bundle exec jekyll build` (or CI task). A plugin or script (see ADR 0008) repopulates cached data if implemented; otherwise consider adding a helper script under `_code/` to regenerate deterministically.
3. Commit regenerated cache only if deterministic and stable; otherwise leave empty to force runtime computation (trade-off: slower builds vs. clarity).
Verification: Ensure homepage blog & carousel display expected new posts (no placeholders, at least up to 3 genuine items per category when available).

### 18. CI Failure Triage Order
When CI fails, debug in the following priority sequence:
1. YAML / Front Matter Parse Errors: Look for unescaped quotes, inconsistent indentation, or leading tabs causing raw page output.
2. Build / Jekyll Exceptions: Template errors, missing includes, bad Liquid filters.
3. Plugin Failures: Memory probe, caching, or custom index plugins raising exceptions.
4. Feed Generation / Mastodon Sync Scripts: Breakage in `_code/` utilities affecting JSON/RSS correctness.
5. HTML Proofer Internal Links: Broken anchors, 404s on local pages—fix root HTML or link path.
6. External Link Errors / Timeouts: Retry locally; if persistent, consider narrowly scoped ignore with comment stating reason & review date.
7. Performance Warnings (Optional): Investigate memory probe anomalies or excessive build time deltas.

Always address earlier layers before masking later issues; avoids piling ignores over fundamental template problems.

### 19. YAML & Front Matter Pitfalls
Common Failure Modes:
* Unescaped quotes in titles/descriptions: `title: "The "Best" Idea"` (bad) vs `title: 'The "Best" Idea'` (good) or multiline folded style.
* Trailing spaces after `---` fences in rare cases leading to parse quirks (avoid).
* Mixing tabs and spaces—use spaces consistently.
* Boolean strings vs. booleans: Accept both for flags (`no_toc: 'true'` or `no_toc: true`) but prefer actual booleans for clarity.
* Arrays without brackets when containing colon or commas inside values—quote those values.
Recommended Patterns:
```yaml
title: >-
	Guardrails and Gigawatts: Building the AI–Energy
	Flywheel at the Grid Edge
description: "Short single-line; escape embedded quotes with \" like this."
tags:
	- AI
	- Energy
image-alt: "Human hands reaching toward innovation"
no_toc: true
mermaid: false
```
Use folded (`>-`) for multi-line but single-paragraph strings; use literal (`|`) when line breaks must be preserved (e.g., code snippets in examples).

### 20. Front Matter Glossary (Key Fields)
Reference (not exhaustive—extend if adding new flags):
* `layout` (string): Which layout to apply (`post`, `page`, `prompt-details`, etc.).
* `title` (string): Display title used in listings, `<title>` tag fallback.
* `description` (string): Short summary used in meta tags; do not exceed ~160 chars.
* `excerpt` (string/auto): Auto-generated if absent; prefer explicit concise summary when SEO sensitive.
* `date` (ISO8601): Post date; if omitted Jekyll infers from filename.
* `categories` (array): Category labels matched against registry slug/title/aliases.
* `tags` (array): Free-form tagging, used for future filtering (Prompt Library ADR 0004).
* `image` (path): Hero/preview image path relative to site root.
* `image-alt` (string): Accessible alt text; required if `image` present.
* `image-credits-artist` / `image-credits-artist-URL` (string): Attribution metadata.
* `image-credits-source` / `image-credits-source-URL` (string): Original source attribution if distinct from artist.
* `bullets` (array): Short list used in some article intros / summaries.
* `no_toc` (boolean): Suppress TOC card (ADR 0010).
* `mermaid` (boolean): Enable Mermaid diagrams & source panels (ADR 0011).
* `series` / `series_step` (string/int): Multi-step prompt/workflow navigation (ADR 0002).
* `canonical` (url): Canonical URL override for SEO consolidation.
* `redirect_from` (array/string): Legacy paths to redirect (ensure plugin / meta logic supports it before use).
* `permalink` (string): Override generated permalink; keep consistent with pattern if used.
* `draft` (boolean): If using drafts feature (ensure not committed live unless intended).
Validation: When adding new keys, document in README + here; guard usage with Liquid conditionals.

### 21. Performance & Memory Instrumentation Quick Reference
Enable memory probe to observe build RSS deltas:
`MEM_PROBE=1 bundle exec jekyll build`
Optional periodic GC experimentation:
`FORCE_PERIODIC_GC=1 bundle exec jekyll build`
Interpretation Tips:
* Look for sudden large delta near new template logic—may indicate wide scan inside nested loops.
* Prefer precomputing indexes (following ADR 0008) over repeated `where` + `sort` pipelines.

### 22. Contribution Review Checklist (Pre-PR)
Use this quick pass before opening a PR:
1. Front matter valid (build passes locally; no raw page output).
2. No placeholder/dummy content introduced.
3. Loops have inline Liquid comments if exclusion logic non-trivial.
4. Accessibility: meaningful alt text, ARIA attributes preserved.
5. Performance: Avoided unnecessary global scans; considered cache usage.
6. ADR Alignment: Changes don't contradict Accepted ADRs (or new ADR drafted if direction shifts).
7. README / Instructions updated for new flags or processes.
8. Build & HTML Proofer (internal links) green locally (`SKIP_EXTERNAL=1`).
9. Commit messages: imperative, scoped, no unrelated refactors bundled.
10. Security / Dependencies: No new gems unless justified; pinned versions respected.

If any item fails, iterate before submitting to keep review cycles short and focused.

### 23. Key Development Workflows

**Local Development:**
```bash
bundle install                           # First-time setup
bundle exec jekyll serve                 # Live reload dev server
make qa                                  # Quick validation (dates, feeds, Mastodon)
make all                                 # Full validation including HTML Proofer
```

**Available VS Code Tasks:**
* "Clean build + HTMLProofer (internal)" - Full build with link checking
* "Jekyll clean prod build (tee log)" - Production build with logging

**CI/CD Pipeline:**
1. `deploy.yml` - Main deployment workflow
   - Builds with heartbeat monitoring (prevents timeout)
   - Ruby 3.2 with platform locking
   - Uploads artifact and deploys to GitHub Pages
2. `mastodon-feed.yml` - Automated social posting
3. `docs-markdown-toc.yml` - README TOC validation

**Testing Categories:**
* Feed integrity: `ruby tests/check_feed_integrity.rb`
* Mastodon validation: `ruby tests/validate_mastodon_feed.rb`
* Legacy key check: `ruby tests/check_no_legacy_siteurl.rb`
* Image paths: `ruby tests/check_image_paths.rb`
* Alt text audit: `ruby tests/check_image_alt_text.rb`

**Common Diagnostic Commands:**
```bash
# Memory profiling during build
MEM_PROBE=1 bundle exec jekyll build

# Force garbage collection (debug only)
FORCE_PERIODIC_GC=1 bundle exec jekyll build

# Skip external link checks (faster local validation)
SKIP_EXTERNAL=1 bundle exec htmlproofer ./_site --check-html --allow-missing-href
```

### 24. Slides & Reveal.js Integration

**Critical: No separate `slides` collection.** All slide decks are posts in `_posts/Slides/`:
* Use `layout: reveal-integrated` in front matter
* Set explicit `permalink: /slides/{slug}/`
* Filter templates check `relative_path` containing `_posts/Slides/`
* Never reference `site.slides` - it doesn't exist (legacy approach deprecated per ADR 0012)

**Slide-specific front matter:**
* `topics`: Array for client-side filtering
* `preview_html`: Custom card preview (overrides auto-extraction)
* `aspect_ratio`: One of `16:9`, `16:10`, `4:3`
* `deck-style`: Palette variant (`light`, `dark`, `accent-blue`, `accent-orange`, `accent-gold`)

**Styling locations:**
* Global theme: `_sass/components/_slides-theme.scss`
* Archetypes (reusable patterns): `_sass/components/_slides-archetypes.scss`
* Slide includes: `_includes/slides/` (section-break, filter-controls, architecture-metadata, meta-footer)

### 25. Mastodon Integration Patterns

The site auto-syncs content to Mastodon using a sophisticated backfill system:

**Key scripts:**
* `backfill_masto_posts.py` - Creates toots for posts lacking `mastodon-post-id`
* `sync_masto_ids_from_cache.py` - Updates front matter from cache
* `dedupe_masto_statuses.py` - Removes duplicate toots
* `update_masto_frontmatter.py` - Batch front matter updates

**Front matter field:** `mastodon-post-id: "12345678"` - Add to enable comment integration

**Cache file:** `cache/jsonfeed-to-mastodon.json` - Canonical toot ID registry

**Workflow safeguards:**
* Dry-run by default (use `--write` flag for live posting)
* Requires `MASTODON_TOKEN` environment variable
* Rate limiting with configurable delays (`--rate` flag)
* Date filtering (`--since` flag) to process recent content only

**Example usage:**
```bash
# Dry-run: see what would be posted
python3 _code/backfill_masto_posts.py

# Actually post with 8-second delays
python3 _code/backfill_masto_posts.py --write --rate 8

# Only process content from 2024 onwards
python3 _code/backfill_masto_posts.py --write --since 2024-01-01 --limit 10
```

