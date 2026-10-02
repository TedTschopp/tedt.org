# Review the Information Architecture Preview

The preview uses **GitHub Pages at https://preview.tedt.org/**. Cloudflare supplies its DNS record. Ted accepted an unlinked public preview without login protection; every HTML page receives noindex. Production cutover requires a separate explicit request.

## Build

Use the repository's configured Ruby and installed Bundler dependencies:

```sh
bundle exec jekyll build --config _config.yml,_config.preview.yml --destination /tmp/tedt-ia-build
python3 scripts/package-ia-preview.py /tmp/tedt-ia-build /tmp/tedt-ia-package
python3 scripts/check-ia-preview.py /tmp/tedt-ia-package
```

On this Mac, the existing Ruby is 3.2.9 and the main checkout stores its installed gems under vendor/bundle. Set RBENV_VERSION and BUNDLE_PATH when building from an isolated worktree rather than changing the lockfile.

For browser checks against a local preview server, set `PLAYWRIGHT_IA_PREVIEW=1`, `PLAYWRIGHT_SKIP_WEB_SERVER=1`, and `PLAYWRIGHT_BASE_URL` to that server's URL. Tests against `https://preview.tedt.org` recognize preview mode automatically. Without preview mode, the same navigation tests verify the banner and noindex directive are absent.

The package reuses published img and media files from tedt.org, removes authoring files and operational reports, writes the preview CNAME, and disables service-worker delivery. Package only into a task-owned directory; the script refuses to replace an unmarked directory.

## What to Review

- Home: five equally prominent content entrances, selected examples, one recent-writing list, and About Ted.
- The shared menu and six section hubs.
- Stories and game pages leading to Plotto, labeled Under Development.
- Tool search and status filtering.
- Site search, including bestiary-specific results.
- Existing articles, folklore, reference pages, assessments, and slide URLs.
- Navigation on a phone, keyboard disclosure controls, and light/dark themes.
- The Public Workbench design: Cal Sans headings at weight 400, Inter body copy, Paper and Night color tokens, underlined links, clear theme controls, and readable profile links.
- Search indexing and analytics disabled in the preview.

## Where to Edit

- `_data/site_navigation.yml`: primary menu and secondary links.
- `_data/site_sections.yml`: section overview descriptions and destinations.
- `_data/tool_groups.yml`: purpose-based tool groups.
- `_tools/plotto.md`: Plotto's catalog entry.
- `_sass/components/_information-architecture.scss`: shared styling.
- `_sass/components/_workbench-tokens.scss`: Paper and Night tokens from the tedtorg-preview-design skill.
- `_data/elsewhere.yml`: profile-link order, names, handles, and groups; URLs remain in `_config.yml`.
- `_config.preview.yml`: preview-only configuration.

## Publishing and Cutover

Publish the compiled package through the separate preview repository's GitHub Pages workflow. Keep its source review material outside the deployed site. Do not copy the production repository's scheduled, publishing, or social-sync workflows into that repository.

After an explicit cutover request, bring the branch up to date with the current production content, run `bundle exec jekyll build` using production configuration plus the applicable checks, and integrate the approved change into main. The preview config and packaging must stay out of the production build invocation. Verify live HTML, navigation, existing paths, and production analytics settings after deployment.

Rollback reverts the redesign changes while preserving content added afterward.

## Design Notes

The five shelves each open with a painted lead image. About uses the existing illustrated portrait of Ted, cropped with CSS. Images declare their actual source dimensions and retain focal points in navigation data.

Category indexes keep their existing aliases, content selection, and URLs while displaying dated writing rows and a restrained cyan-to-violet title underline. Tool details retain real screenshots and explicit artwork, without random fallback illustrations. Shared article layouts use the same type and reading colors; specialized interactive lessons and bestiary content keep their application behavior.

The navbar collapses below 1400px so six separate 44px disclosure buttons and the theme/TOC controls fit without crowding. The content grids retain the design system's 1200px and 768px breakpoints.

The shared footer opens with Ted’s linked name, description, views disclaimer and family mark, plus Explore and Keep in Touch navigation. Copyright and Back to Home follow. Elsewhere on the Web is the final section inside that same footer, with primary profile links, a closed-by-default native disclosure for additional profiles, and the support link. Profile links retain `rel="me"`; no icon font is used in the library pages or shared footer.

The up-right link cue uses `_includes/utility/arrow-up-right.html`: an inline SVG with a full-length top edge, side edge and diagonal. It scales to one em, inherits the text color, and uses heavier strokes alongside Cal Sans headings and semibold links. The decorative glyph is hidden from screen readers and receives no keyboard focus.
