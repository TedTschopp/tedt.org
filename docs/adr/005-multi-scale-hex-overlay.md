# ADR-005: Multi-Scale Hex Overlay Visualization

**Status:** Proposed  
**Date:** 2025-08-07  
**Authors:** Ted Tschopp, GitHub Copilot  

## Context

Layer 2 of the "Practical Hexcrawl Design and Procedures" article introduces multiple operational hex scales (1, 3, 6, 12, 24 mile tiers and higher macro tiers) intended to help referees reason about zoom levels for wilderness exploration. The current article presents scale data textually but lacks an interactive or visual aid to convey nested relationships. A reusable, lightweight visual overlay would:

- Reinforce the conceptual cascade of hex scales
- Provide an at-a-glance reference for proportion differences
- Avoid dependence on heavy external mapping libraries
- Leverage existing in-repo `hex.js` primitives already vetted

Constraints:

- Must be embeddable in Jekyll posts via an include
- Must not introduce build-time dependencies (pure client-side)
- Must degrade gracefully if scripting is disabled
- Must minimize layout shift & respect responsive widths

## Decision

Implement a custom `hex-multi-scale.js` module that draws layered hex grids (1, 3, 6, 12, 24 mile tiers) onto a single `<canvas>` element using existing `hex.js` geometry utilities, exposed through a new include `_includes/utility/hex-multi-scale.html` and embedded below the Layer 2 scale section in the article.

## Rationale

- Reuses existing `hex.js` (no new geometry code risk)
- Single canvas cheaper than DOM/SVG for large counts of outlines
- Progressive enhancement: static caption + canvas fallback
- Distinct color palette & translucency communicates nesting
- HiDPI scaling handled for crispness
- Keeps script isolated; defer-loaded to reduce blocking

## Alternatives Considered

### Alternative 1: SVG + Individual Paths

- **Pros:** DOM-inspectable, accessible labeling per region
- **Cons:** Larger DOM, more memory for many hexes, manual layout math
- **Decision:** Rejected; canvas already supported & sufficient

### Alternative 2: External Library (PixiJS / D3)

- **Pros:** Rich feature set, future animation hooks
- **Cons:** Heavy payload vs. simple static overlay need
- **Decision:** Rejected for performance + dependency weight

### Alternative 3: Pre-rendered static image

- **Pros:** Zero runtime cost
- **Cons:** Not adaptive to theme sizing / DPI, harder to iterate
- **Decision:** Rejected; interactive/resize clarity preferable

## Consequences

### Positive

- Visual reinforcement of procedural scale concept
- Reusable include for future mapping articles
- Minimal maintenance (pure functions + single render path)
- No build pipeline impact

### Negative

- Adds one more JS payload (small, but non-zero)
- Canvas content not inherently accessible to screen readers
- Color distinctions rely on adequate contrast perception

## Mitigations

- Provide `<figcaption>` textual description
- Keep file size small; no external requests
- Use semantic `<figure>` wrapper for assistive context

## Implementation Notes

- File: `js/hex-multi-scale.js` (depends on `hex.js` loaded first)
- Include: `_includes/utility/hex-multi-scale.html`
- Embedded via Liquid `{% include utility/hex-multi-scale.html %}` under Layer 2
- HiDPI: dynamic scaling via `devicePixelRatio`
- Resize listener re-renders after width changes
- Layer config centralized in SCALES array for easy tuning

## Success Criteria

- Canvas renders distinct nested grids in supported browsers (Chrome, Firefox, Safari)
- No console errors when post loads
- Lighthouse performance impact negligible (< 1KB compressed incremental logic excluding existing dependency)
- Article builds without Jekyll warnings related to the include

## Future Enhancements (Deferred)

- Toggle controls to show/hide individual tiers
- Legend with clickable scale filters
- Hover tooltip translating pixel -> hex coordinate per tier
- Export to PNG button

## Status Tracking

Move to **Accepted** once reviewed and tested with production build locally.
