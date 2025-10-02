# ADR 0007: Category Theming Unification

Date: 2025-08-14  
Status: Accepted
Context: Multiple overlapping mechanisms existed for category styling: legacy per-category CSS classes (e.g., .DCC, .GammaWorld, *-Post), ad‑hoc font stacks, and a newer attribute-based theming system using .category-theme + data-category. Duplication increased CSS weight and risked divergence (especially dark-mode handling). We also needed canonical slugs to prevent alias proliferation ("D&D" vs "DnD" vs "dnd").

Decision:

1. Introduce a single semantic wrapper element `<span class="category-theme" data-category="Raw Name" data-cat="canonical-slug">` around category labels everywhere (via include `category-label.html`).
2. Maintain a palette + font + shadow + metadata registry (`_data/category_registry.yml`) keyed by canonical slug; Liquid includes (`utility/category-label.html`, `utility/category-theme-inline-style.html`) set CSS custom properties on the wrapper directly at build time.
3. Derive raw → canonical mapping from each entry's `raw_names` array within `category_registry.yml` (no separate alias file).
4. Simplify layout: remove duplicate theme debug include branches and replace hard-coded `data-bs-theme="dark"` with early init script honoring cookie + system preference.
5. Defer aggressive removal of legacy class selectors; keep a bridged section (commented) until templates are fully purged of legacy markup.

Consequences:

- Pros: Consistent styling pipeline, easier dark-mode tuning, reduced duplication, capability to add new categories by data-only change.
- Cons: Requires all templates to adopt the shared include; legacy markup without wrappers must be migrated manually.
- Risk (retired): Divergence between separate alias and palette files. Mitigated by consolidating into a single registry file consumed directly by Liquid templates.

Alternatives Considered:

- Pure CSS attribute selectors without shared data registry: Rejected previously because palette metadata would have stayed fragmented; registry + Liquid include keeps data centralized while avoiding bloat.
- Client-side JavaScript theming (original approach): Removed to reduce runtime cost and avoid hydration requirements once Liquid emitted the necessary custom properties.

Follow-ups / Next Steps:

- Phase out legacy class markup in remaining templates (replace with include usage) then prune legacy CSS rules.
- (Completed) Single-source-of-truth introduced: `category_registry.yml`.

Decision Makers: Site maintainer w/ AI assistant guidance.

See also: `docs/category-theming-plan.md` for phased migration strategy.
