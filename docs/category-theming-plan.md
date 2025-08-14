# Category Theming Migration Plan

Date: 2025-08-14
Owner: Site Maintainer
Related ADR: `docs/adr/2025-08-14-category-theming-unification.md`

## Goal

Unify all category visual treatments under a single, data-driven theming system using `.category-theme` wrappers with `data-category` (raw) + `data-cat` (canonical slug) while preserving legacy look & feel during transition.

## Phases

### Phase 0 (Complete)

- Introduce wrapper output in `category-label.html` include.
- Add `_data/category_aliases.yml`.
- Export JS theming helpers & runtime wrapper upgrade for legacy classes.
- Early theme init script to respect user/system preference.

### Phase 1 (In Progress)

- Replace any hard-coded category headings in templates with `{% include utility/category-label.html %}`.
- Verify no regressions in dark mode / reduced motion.
- Collect console summary counts to ensure all labels wrapped.

### Phase 2

- Remove runtime legacy wrapping path once templates migrated (toggle via flag inside `category-theme.js`).
- Prune unreferenced legacy font class selectors from `logo-and-company-fonts.css` (keep only bridge rules still needed).

### Phase 3

- Generate `EXPLICIT_ALIAS` object automatically from `_data/category_aliases.yml` during build (simple Liquid -> JS serialization include or prebuild script).
- Add test (liquid or script) that fails build if alias data and JS diverge.

### Phase 4

- Precompute CSS custom properties server-side (Liquid loop using palette data) to allow removing JS dependency for first paint, leaving JS only for progressive features.
- Optional: implement `<noscript>` fallback style block with minimal palette for top N categories.

### Phase 5

- Remove unused palette entries & consolidate gradients for performance.
- Lighthouse / bundle size audit to quantify CSS reduction.

## Data Sources

- `_data/category_aliases.yml` authoritative for raw → canonical.
- Future `_data/category_palette.yml` (not yet created) to become source of truth for start/end colors & font/shadow metadata.

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Alias drift between JS and data file | Move to generated JS from data file in Phase 3 |
| FOUC of wrong theme | Optionally inline early init script in `<head>` or server‑render theme attribute once preference cookie known |
| Legacy templates missed | Add temporary console warnings for elements with legacy classes not wrapped after Phase 1 |
| Performance regression (extra wrappers) | Later consolidate by merging wrapper + inner element if markup becomes redundant |

## Success Criteria

- 0 occurrences of legacy category class usage in templates (excluding controlled bridge CSS) by end of Phase 2.
- No visual diffs (manual spot check + screenshot compare for key categories) between legacy and unified system.
- < 5% increase (prefer decrease) in total CSS size after pruning.
- Single source for alias + palette data.

## Open Questions

- Should palette live entirely in data to allow non-JS builds? (Likely yes Phase 3/4.)
- Add accessibility contrast tests per category automatically? (Future enhancement.)

## Tracking

Create GitHub issues per phase milestone; reference this plan in each for continuity.
