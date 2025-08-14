# Category Theming Migration Plan

Date: 2025-08-14
Owner: Site Maintainer
Related ADR: `docs/adr/2025-08-14-category-theming-unification.md`

## Goal

Unify all category visual treatments under a single, data-driven theming system using `.category-theme` wrappers with `data-category` (raw) + `data-cat` (canonical slug) while preserving legacy look & feel during transition.

## Phases

### Phase 0 (Complete)

- Introduce wrapper output in `category-label.html` include.
- Create unified `_data/category_registry.yml` (replacing separate alias, palette, styles, and categories-on-blog files).
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

- (Simplified) JS now derives alias map from `raw_names` in registry; no separate generation step required. Potential future enhancement: build-time precomputation of CSS custom properties to drop JS for static theming.

### Phase 4

- Precompute CSS custom properties server-side (Liquid loop using palette data) to allow removing JS dependency for first paint, leaving JS only for progressive features.
- Optional: implement `<noscript>` fallback style block with minimal palette for top N categories.

### Phase 5

- Remove unused palette entries & consolidate gradients for performance.
- Lighthouse / bundle size audit to quantify CSS reduction.

## Data Source

- `_data/category_registry.yml` authoritative for raw → canonical (`raw_names`), palette, typography, label overrides, emoji, subtitle, description, and imagery.

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Alias drift between JS and data file | Eliminated by deriving from unified registry |
| FOUC of wrong theme | Optionally inline early init script in `<head>` or server‑render theme attribute once preference cookie known |
| Legacy templates missed | Add temporary console warnings for elements with legacy classes not wrapped after Phase 1 |
| Performance regression (extra wrappers) | Later consolidate by merging wrapper + inner element if markup becomes redundant |

## Success Criteria

- 0 occurrences of legacy category class usage in templates (excluding controlled bridge CSS) by end of Phase 2.
- No visual diffs (manual spot check + screenshot compare for key categories) between legacy and unified system.
- < 5% increase (prefer decrease) in total CSS size after pruning.
- Single source for alias + palette + metadata in registry file.

## Open Questions

- Should palette live entirely in data to allow non-JS builds? (Likely yes Phase 3/4.)
- Add accessibility contrast tests per category automatically? (Future enhancement.)

## Tracking

Create GitHub issues per phase milestone; reference this plan in each for continuity.
