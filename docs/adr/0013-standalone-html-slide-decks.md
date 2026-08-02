# ADR 0013: Adopt Standalone HTML Artifacts for Slide Decks

Status: Accepted  
Date: 2026-07-27  
Authors: Ted Tschopp  
Supersedes: Reveal.js as the default authoring format described by ADR 0012  
Superseded-By: None

New slide decks are stored as self-contained HTML presentation artifacts and
published through lightweight posts that provide site metadata and stable URLs.

## Context

The Reveal.js slide path requires deck content to be translated into
site-specific sections, theme classes, and runtime dependencies. That translation
can lose layout fidelity and makes the website responsible for presentation
behavior that modern static exporters already provide.

DeckWeaver-style exports are complete HTML documents. They include their own
responsive canvas, slide navigation, thumbnails, speaker notes, fullscreen and
print controls, keyboard and touch input, reduced-motion handling, and embedded
assets. The site should preserve those capabilities instead of reimplementing or
transforming them.

ADR 0012 remains authoritative for discovery: decks are regular posts under
`_posts/Slides/`, and templates must not use a `slides` collection.

## Problem

The site needs to publish a self-contained HTML deck without:

- rewriting the exported document into Reveal.js markup;
- allowing Jekyll or Liquid to alter the artifact;
- coupling the deck's runtime to site-wide JavaScript or CSS;
- losing site navigation, metadata, topic filtering, or stable URLs; or
- loading every full presentation on the `/slides/` catalog page.

## Decision

Adopt an artifact-first slide architecture:

1. Save each self-contained presentation unchanged at
   `slides/decks/{slug}/index.html`. Files in this directory have no Jekyll front
   matter, so GitHub Pages copies them as static assets.
2. Create a regular post at `_posts/Slides/YYYY-MM-DD-{slug}.md` using
   `layout: slide-deck` and an explicit `/slides/{slug}/` permalink.
3. Point the post's `deck_url` to the static artifact. The layout embeds the
   artifact in an iframe so the document owns its presentation runtime and CSS.
4. Require metadata for `title`, `description`, `date`, `format`, `deck_url`,
   `slide_count`, and `deck_sha256`. The checksum proves that the stored artifact
   matches the reviewed export.
5. Keep `/slides/` posts-based. The catalog reads only post metadata and optional
   thumbnail images; it does not load deck iframes.
6. Retain `reveal-integrated` only as a compatibility layout for existing decks.
   New decks use the standalone HTML path.

No new Jekyll plugin, JavaScript framework, application service, API, database,
or runtime build step is introduced.

## Rationale

- Fidelity: the exported document is served byte-for-byte and renders in its own
  isolated browsing context.
- Portability: a deck remains usable outside Jekyll and can be replaced with a
  newly exported file.
- Reliability: new decks do not depend on CDN-hosted Reveal.js assets.
- Performance: the catalog renders metadata-only cards; a full deck loads only
  after a visitor opens it.
- Maintainability: Jekyll owns discovery and SEO while the artifact owns slide
  behavior.

## Alternatives Considered

### Continue Reveal.js as the only format

Rejected because every exported presentation would require a manual conversion
and a second styling/runtime implementation.

### Paste complete HTML documents directly into posts

Rejected because a post layout would create nested document structures and
Liquid processing could alter otherwise self-contained artifacts.

### Use a `slides` collection or custom generator plugin

Rejected by ADR 0012 and GitHub Pages safe-mode constraints. Post metadata already
provides deterministic discovery.

### Load raw decks directly from the catalog

Rejected because multiple interactive documents would increase transfer,
memory, scripting, and accessibility costs before a visitor chooses a deck.

## Consequences

### Positive

- Standalone exports retain their original visual and interactive behavior.
- Presentation JavaScript and CSS cannot collide with the site shell.
- Decks work with GitHub Pages safe mode.
- Legacy Reveal decks keep their existing URLs.
- A checksum and focused test make artifact drift visible.

### Negative

- Authors manage a metadata post and a static HTML artifact.
- Global site theme changes do not restyle content inside a standalone deck.
- Search engines primarily receive the post metadata; text inside the iframe is
  a separate static document.
- A deck's own accessibility remains the exporter's responsibility.

### Neutral / Unknowns

- Optional catalog thumbnails may be added later, but they are not required for
  publication.
- Very large decks may justify per-deck performance budgets in the future.

## Implementation Notes

- `_layouts/slide-deck.html` provides the site toolbar, fallback link, and iframe.
- `_includes/slides/filter-controls.html` provides catalog search and topic
  filters.
- `tests/check_slide_decks.rb` validates metadata, artifact existence, checksum,
  self-contained runtime markers, slide count, and basic accessibility markers.
- `_layouts/reveal-integrated.html` remains available for already-published
  decks, but is not the template for new work.

## Metrics / Success Criteria

- `bundle exec jekyll build` completes without a custom plugin.
- The raw deck checksum matches `deck_sha256`.
- The generated post contains an iframe pointing to the generated static deck.
- The artifact contains the declared number of slides.
- The deck provides labeled controls, keyboard navigation, touch navigation,
  fullscreen, notes, print support, and reduced-motion styling.
- The `/slides/` catalog can find and filter both new and legacy deck posts.

## Future Work (Deferred)

- Automated thumbnail generation from the first slide.
- Migrating legacy Reveal decks when equivalent standalone exports exist.
- Extracting an optional text transcript for additional search indexing.

## Decision Stability

Revisit this decision only if GitHub Pages can no longer serve the artifacts,
deck sizes create a measured performance problem, or a future export format
cannot run safely as a static same-origin document.

## References

- Related ADRs: ADR 0012
- WAI guidance for accessible names, keyboard operation, and reduced motion

