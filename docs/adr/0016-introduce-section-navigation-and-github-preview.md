# ADR 0016: Introduce Section Navigation and an Isolated GitHub Preview

- Status: Proposed
- Date: 2026-10-02
- Authors: Ted Tschopp, Codex

## Context

TedT.org holds essays, folklore, game resources, tools, interactive learning, and professional information. Category overlap repeats recent articles on the homepage. The shared menu emphasizes individual applications and career material, making the wider collection difficult to understand.

Ted requested a balanced home for all interests, GitHub hosting, minimal Cloudflare use, and an always-available preview at `preview.tedt.org` before a separately requested cutover. He explicitly accepted an unlinked, publicly accessible preview without a login. Plotto is an active project under development.

## Proposed Decision

Use six reader-facing section entrances: Essays, Stories & Folklore, Games & Worlds, Tools, Learn, and About. Use YAML data for menu labels, section links, and tool groups. Reuse existing posts, categories, tools, and application destinations; add no collection, plugin, or JavaScript framework. Keep article permalinks and the canonical posts-based slides arrangement.

Give each primary item a direct section link and a separate disclosure control. Reuse the same menu data in standalone assessments. Preserve keyboard operation, focus visibility, responsive navigation, and theme controls. Give Plotto a tool entry with an accurate Under Development status, and links from writing and GM resources.

Use one recent-writing stream and five balanced homepage entrances. Keep the bestiary in its own reference views. Add a local search index and purpose-based tool filtering.

## Preview and Cutover

The preview builds with `_config.preview.yml`, disables production analytics and homepage service-worker registration, shows a persistent preview banner, and applies noindex to rendered pages. A separate GitHub repository hosts prebuilt output through its own GitHub Pages workflow. Public media is reused from the current site to keep the static preview package within Pages limits. Cloudflare only receives the preview DNS record.

The production repository's main checkout and deployment remain unchanged. Copy the changed source files and the baseline commit identity into the preview repository's review material, so the implementation can be inspected and reconstructed.

After Ted requests cutover, reconcile intervening content, run production checks, integrate approved changes into main, and verify the public deployment. Revert redesign commits for rollback rather than resetting newer content.

## Consequences

- Navigation gains predictable reader-oriented groups while retaining all existing destinations.
- New section pages depend on existing public content and applications.
- The unlinked preview is publicly accessible. Noindex controls search indexing and provides no authentication.
- Existing Cloudflare Worker-backed endpoints retain their current runtime; a runtime migration is outside this change.
- YAML configuration is reviewed alongside navigation tests; unmapped tools and broken section destinations fail the preview checks.

## Validation

Run Jekyll, navigation/search/filter browser tests, link checks on new entrances, and accessibility checks in light and dark modes. Verify desktop and phone rendering and compare existing permalink paths against the baseline sitemap before publishing the preview.

This ADR remains Proposed until a production cutover is approved.
