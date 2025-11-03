---
Date: 2025-11-03
Status: Accepted
Decision Type: Content Architecture Simplification
---

# ADR 0012: Posts-Based Slide Deck Architecture (Deprecate `slides` Collection)

## Context

Historically the site experimented with a dedicated `slides` collection (`site.slides`) to hold Reveal.js decks. Over time this introduced maintenance overhead (collection-specific loops, nil guard complexity, duplication of metadata logic) and conflicted with the established pattern of keeping standard content in `_posts/` for uniform indexing, theming, and feed considerations. During recent refactors the `slides` collection was fully removed; templates now filter `site.posts` for paths under `_posts/Slides/`.

## Decision

Adopt a purely posts‑based slide deck model:

- All decks reside in `_posts/Slides/`.
- Listing & topic filtering source: `site.posts | where_exp: 'p', "p.relative_path contains '_posts/Slides/'"`.
- No `slides` collection declared in `_config.yml`.
- Agents and contributors MUST NOT reintroduce `site.slides` without a future ADR proposing and justifying the change.

## Rationale

1. Simplicity: Eliminates conditional logic and nil checks around an optional collection.
2. Consistency: Reuses established post front matter parsing, date handling, and permalink patterns.
3. Performance: Avoids parallel indexing structures; one pass over `site.posts` with a narrow filter.
4. Documentation Clarity: Single, canonical storage location reduces contributor confusion.
5. Maintenance Risk Reduction: Fewer custom code paths; decreases chance of Liquid errors (e.g., sorting a null object).

## Front Matter Schema (Reference)

Required: `layout: reveal-integrated`, `date`, `title`, `description`.

Optional: `topics` (array), `image`, `image-alt`, `preview_html`, `aspect_ratio`, `last_modified`, `deck-style`.

Explicit permalink pattern enforced per deck: `permalink: /slides/{slug}/`.

## Alternatives Considered

- Retain collection + fallback: Rejected (complexity w/o benefit).
- New plugin to auto-index decks: Out of scope; GitHub Pages safe-mode restricts custom plugins.
- Tag-based auto-discovery: Less precise than path-based scoping; path keeps taxonomy explicit.

## Consequences

Positive:

- Cleaner templates (`slides/index.html` & filter include) with one deterministic source.
- Reduced future regression risk.

Negative / Trade-offs:

- Mixing posts and decks under `site.posts` may marginally increase loop scan size; mitigated by tight path filter.

## Migration Notes

- Remove any lingering references to `site.slides` in templates, includes, docs (completed in this change set).
- Ensure old collection configuration absent from `_config.yml`.
- Verify build after refactor (HTML Proofer internal links green) – completed.

## Future Considerations

If deck volume or querying needs grow substantially (e.g., multi-thousand decks) reconsider a collection only with:

- Benchmarked build impact.
- Clear separation advantages (feed exclusion, indexing optimization).
- A new ADR outlining performance instrumentation.

## Status

Accepted and implemented as of 2025-11-03.
