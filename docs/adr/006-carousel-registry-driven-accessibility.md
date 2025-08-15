# ADR-006: Registry-Driven Homepage Category Carousel & Accessibility Enhancements

Date: 2025-08-14
Status: Accepted
Authors: Ted Tschopp, GitHub Copilot

## Context

The homepage previously contained a category carousel whose slide content and ordering were maintained via a legacy data file (`categories-on-blog.yml`) and sporadically duplicated metadata (titles, images, subtitles) across templates. Attempts to refactor the carousel using Liquid array mutation (`push`) to assemble a filtered list of categories encountered reliability issues (empty arrays in build output) and added complexity. Additionally, the carousel lacked robust accessibility semantics (minimal labeling, duplicated navigation controls on every slide, no region description) and used hard-coded first-slide activation creating unequal exposure.

Drivers:

- Single source of truth for category metadata (aliases, palette, subtitles, description, imagery, hide flags)
- Eliminate brittle Liquid array mutation in favor of deterministic iteration
- Prevent showing categories lacking posts or flagged to hide
- Improve accessibility to meet ARIA carousel guidance (landmark, list semantics, descriptive labels, reduced redundancy)
- Maintain Bootstrap compatibility and existing visual design
- Preserve / enable random start position behavior (ADR-003) without server-side randomness

## Decision

1. Adopt `_data/category_registry.yml` as authoritative data source for the carousel (already used for theming unification – see Category Theming ADR).
2. Implement a two-pass Liquid strategy inside `_includes/homepage/carousel.html`:
   - Pass 1: Iterate registry to count qualifying categories (not hidden, has ≥1 matching post by slug, canonical title, or any `raw_names` alias) producing `total`.
   - Pass 2: Iterate registry again applying identical filter, incrementing an index and rendering each qualifying category slide.
3. Match posts per category by checking `post.categories` membership against: `entry.title`, `slug`, and each alias in `entry.raw_names` (scalar or array) to accommodate historical naming variance.
4. Remove reliance on Liquid `push` (which proved unreliable in this environment) in favor of pure scanning logic.
5. Add accessibility enhancements:
   - Wrap carousel in a `role="region"` with `aria-roledescription="carousel"`, labelled by a visually hidden heading and described by hidden instructions.
   - Convert slide container to `role="list"` and each slide to `role="listitem"` with `aria-roledescription="slide"` and an `aria-label` of the form `"Slide X of Y: Category Title"`; mark active slide with `aria-current="true"`.
   - Consolidate Prev/Next controls to a single instance outside slide items (removing duplicate interactive elements per slide).
   - Add `aria-live="polite"` to announce slide changes via updated `aria-current` + label.
6. Preserve server-side assignment of first slide as active while allowing client-side randomization script (ADR-003) to override on load.
7. Respect `entry.hide_from_carousel` boolean/string flags to exclude categories.
8. Avoid adding new data files or duplicating metadata (use registry only).

## Rationale

- Two-pass deterministic scan is simpler than fragile array building under Liquid, improving reliability and transparency.
- Centralizing metadata reduces risk of divergence and simplifies future additions (data-only changes generate new slides if posts exist).
- Accessibility improvements align with WAI-ARIA Authoring Practices for carousels, reducing cognitive load and eliminating redundant focusable controls.
- Consolidated controls decrease tab stop count, improving keyboard navigation efficiency.
- Retaining random start behavior improves equitable exposure without complicating build-time logic.

## Alternatives Considered

### Alternative 1: Single-pass with dynamic push accumulation

- Pros: Potentially fewer iterations.
- Cons: Liquid `push` inconsistency led to empty arrays; debugging overhead high.
- Decision: Rejected due to reliability concerns.

### Alternative 2: Precompute category list via a custom Jekyll plugin

- Pros: Cleaner template markup, single traversal.
- Cons: Increases build complexity; not desirable for GitHub Pages compatibility; unnecessary for scale.
- Decision: Rejected for simplicity & portability.

### Alternative 3: Client-side rendering from JSON

- Pros: Reduces initial HTML size; flexible runtime filtering.
- Cons: Delays content for non-JS users; complicates SEO; duplicates registry in generated asset.
- Decision: Rejected to preserve static HTML & accessibility.

## Consequences

### Positive

- Reliable, data-driven category carousel with zero duplicated metadata.
- Enhanced accessibility (landmarks, labels, reduced redundant controls, live region updates).
- Easy future extension (e.g., pause/play control) without restructuring data.
- Improved maintainability: Adding a category requires data + posts only.

### Negative

- Two registry passes add minimal build-time overhead (negligible at current registry size).
- Slightly more Liquid logic inline; mitigated by comments and clear structure.

### Neutral

- First-slide active remains for no-JS fallback; randomization still client-side.

## Implementation Notes

Key file: `_includes/homepage/carousel.html` (refactored to two-pass, added ARIA semantics, removed per-slide controls).
Supporting ADR references: ADR-003 (random start), Category Theming Unification ADR (registry establishment).
Data file: `_data/category_registry.yml` ($schema line removed to simplify iteration/skip logic).

## Success Criteria

- Build generates >0 slides (currently 27) with accurate total count.
- Each slide `aria-label` matches pattern and updates on randomization (screen reader announces correctly).
- Only one set of navigation controls exists in DOM (tab order reduced).
- Adding a new registry entry + at least one post renders a new slide automatically.

## Follow-ups / Future Enhancements

- Optional pause/play button for auto-advance (if autoplay later enabled).
- Add `aria-live=off` toggle when user interacts to reduce verbosity.
- Provide keyboard shortcut help text (press ? to open help) referencing carousel controls.
- Expand test suite: automated HTML proofer check for required ARIA attributes.

## References

- ADR-003: Random Carousel Start Position
- Category Theming Unification ADR
- WAI-ARIA Authoring Practices 1.2 – Carousel Pattern
- `_includes/homepage/carousel.html`
- `_data/category_registry.yml`
