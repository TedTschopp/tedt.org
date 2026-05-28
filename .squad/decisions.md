# Squad Decisions

## Active Decisions

### 1. Product Audit — tedt.org — May 2026

**Date:** 2026-05-28  
**Author:** Aragorn (Lead / Product Owner)  
**Type:** product-audit  
**Status:** active

**Key Findings:**
- **3 P0 Blockers** within 5 days: Node.js 20 CI deprecation (June 2), GitHub Pages artifact at 1.16 GB (limit 1 GB), 3,457 internal HTMLProofer failures (non-blocking).
- **1,009 posts** across 13 directories; 33 active categories; 10 accepted ADRs.
- **Template defect:** 234 `<img>` tags with no `src` attribute in rendered HTML — production bug affecting hundreds of pages.
- **Ruby test blindness:** `check_image_paths.rb`, `check_image_alt_text.rb`, `check_no_backup_posts.rb` crash on YAML Date constants; all 1,009 posts invisible to test harness.
- **36 tracked `.bak` files** from 2026-03-07 refactor; excluded from build but in git.
- **Mastodon gap:** ~800 posts have no `mastodon-post-id` field; backfill infrastructure exists.

**Prioritized Plan:**
- **Quick Wins (QW1–QW9):** Node.js 24 action updates, cache rebuild, Ruby test fixes, icon.webp fix, README TOC sync, ADR ratification.
- **Medium-Term (MT1–MT9):** Identify/fix `<img>` defect (highest ROI), remove `.bak` files, fix Monster Manual paths, fix category slugs, move large media to CDN.
- **Strategic (ST1–ST6):** Decompose `default.html`, extend cache index for prompts, tighten CI gates, Mastodon syndication decision, WIP triage, slides strategy.

**Three Critical Actions (My Call):**
1. Update GitHub Actions versions by June 2.
2. Find and fix the `<img>` no-src Liquid defect.
3. Commit `.squad/` infrastructure to git for durability.

**Rating:** Architecture is well-designed (ADRs, registry-driven theming, performance caching). Risks are execution debt and CI hygiene, not fundamental design.

---

### 2. Site Architecture Status Assessment — May 2026

**Date:** 2026-05-28  
**Author:** Galadriel (Site Architect)  
**Type:** architectural-assessment  
**Status:** draft

**Scope:** Full architectural scan of `_config.yml`, Gemfile, `_layouts/`, `_includes/`, `_data/category_registry.yml`, `_plugins/`, ADRs, CI workflows, tests, and `.squad/`.

**Architectural Health:**
- **Strong:** Data architecture (registry-driven), template structure (modular), CI/quality gates, governance/ADRs, test coverage, dependency management.
- **Weak:** Source hygiene (36 `.bak` files, untracked `.squad/`).

**Top 5 Recommendations:**
1. **Remove all 36 `.bak` files from git** (high priority, low effort).
2. **Decompose `default.html` (630 lines) into named sub-includes** (medium priority, medium effort).
3. **Add prompt tag index to `category_recent_index.rb`** to eliminate 3 `site.posts` scans in `prompt-details.html` (medium priority, ADR 0008 deferred work).
4. **Formally accept or reject ADR 0004** — Prompt Library is implemented; decision just needs documentation.
5. **Commit `.squad/` to version control** for durability of governance artifacts.

**ADR Findings:**
- ADR 0004 (Prompt Library): Fully implemented but status remains "Proposed" — documentation debt.
- ADR 0005 (Hex Overlay): May also be implemented; needs status resolution.

---

### 3. Quality Scan Report — tedt.org

**Date:** 2026-05-28  
**Author:** Samwise (Quality Steward)  
**Type:** quality-assessment  
**Status:** active

**Core Status:** Site deploys successfully; all core gates pass. However, **quality checks are non-blocking** and three issues need immediate attention.

**Passing Checks (14):** Build, feeds, legacy keys, Mastodon sync, CSS sync, category fonts, sitemap, no backup posts, CI steps, all others.

**Warnings (4):**
1. **`recent_by_category` Cache Drift (Middle-earth):** Fix: clean rebuild.
2. **YAML Front Matter Parse Failures:** Test scripts fail on `Date` constants; all 1,009 posts invisible to image/alt-text audits.
3. **README TOC Drift:** Run `make docs-toc`.
4. **Feed Diff — 5 Removed Items:** Update `tests/feed_snapshots/` baseline.

**High Risk (3):**
1. **HTMLProofer: 3,457 Internal Failures (Non-Blocking):** 234 `<img>` with no `src`, 588 Monster Manual images broken, 11 broken asset links, 2 broken scripts, structural template issues. `continue-on-error: true` masks all from CI.
2. **Node.js 20 Deprecation (June 2, 2026):** Actions will be forced to Node.js 24; pipeline breakage imminent.
3. **GitHub Pages Artifact: 1.16 GB (Limit 1 GB):** Large audio files (57 MB), PSD (43 MB), DAT (34 MB), Playwright screenshots, htmlproofer logs. Risk: deployment failure on any size increase.

**Asset Hygiene:** 115+ large files tracked in git; allowlisted PSD and others.

**CI Gate Architecture:** Both a11y and HTMLProofer have `continue-on-error: true` — quality gates are advisory, not enforced.

**Prioritized Actions:**
- **P0 (This Week):** Update GitHub Actions for Node.js 24; fix `<img>` no-src template defect.
- **P1 (This Sprint):** Regenerate cache, fix icon.webp, fix tools/todo_hex.html, fix category links, update feed snapshots.
- **P2 (This Quarter):** Fix Ruby test YAML parsing, audit Monster Manual paths, fix Swiss Folklore permalink, update README TOC.
- **P3 (Ongoing):** Reduce artifact below 1 GB, tighten CI gates, track a11y violation budget.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
