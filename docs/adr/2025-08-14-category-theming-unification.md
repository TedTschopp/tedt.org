# ADR: Category Theming Unification

Date: 2025-08-14
Status: Accepted
Context: Multiple overlapping mechanisms existed for category styling: legacy per-category CSS classes (e.g., .DCC, .GammaWorld, *-Post), ad‑hoc font stacks, and a newer attribute-based theming system using .category-theme + data-category plus a JavaScript palette. Duplication increased CSS weight and risked divergence (especially dark-mode handling). We also needed canonical slugs to prevent alias proliferation ("D&D" vs "DnD" vs "dnd").

Decision:

1. Introduce a single semantic wrapper element `<span class="category-theme" data-category="Raw Name" data-cat="canonical-slug">` around category labels everywhere (via include `category-label.html`).
2. Maintain a palette + font + shadow + metadata registry (`_data/category_registry.yml`) keyed by canonical slug; JS (`js/category-theme.js`) sets CSS custom properties on the wrapper.
3. Derive raw → canonical mapping from each entry's `raw_names` array within `category_registry.yml` (no separate alias file).
4. Export `window.CategoryTheme` helpers for future progressive enhancement, testing, or server-side precomputation.
5. Gracefully wrap legacy standalone elements bearing legacy classes into a `.category-theme` wrapper at runtime (one migration cycle) to avoid FOUC and allow incremental template cleanup.
6. Simplify layout: remove duplicate theme debug include branches and replace hard-coded `data-bs-theme="dark"` with early init script honoring cookie + system preference.
7. Defer aggressive removal of legacy class selectors; keep a bridged section (commented) until templates are fully purged of legacy markup.

Consequences:

- Pros: Consistent styling pipeline, easier dark-mode tuning, reduced duplication, capability to add new categories by data-only change. Exported API enables potential build-time hydration avoidance later.
- Cons: Small JS cost on first paint; temporary wrapper creation for legacy elements adds minimal DOM operations. Slight delay in early theme set when script executes after body (acceptable; can inline in <head> later if FOUC observed).
- Risk (retired): Divergence between separate alias and palette files. Mitigated by consolidating into a single registry file consumed directly by JS.

Alternatives Considered:

- Pure CSS attribute selectors without JS: Rejected due to complex per-category shadow and font hover logic requiring many individual rules (weight + maintainability).
- Server-side Liquid expansion only: Would still require duplication of palette values in multiple places; JS centralization preferred.

Follow-ups / Next Steps:

- Phase out legacy class markup in remaining templates (replace with include usage) then prune legacy CSS rules.
- (Completed) Single-source-of-truth introduced: `category_registry.yml`.
- Optional pre-render: write category custom properties directly in HTML to allow removing JS for static theming.

Decision Makers: Site maintainer w/ AI assistant guidance.

See also: `docs/category-theming-plan.md` for phased migration strategy.
