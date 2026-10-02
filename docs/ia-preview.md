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
- Search indexing and analytics disabled in the preview.

## Where to Edit

- `_data/site_navigation.yml`: primary menu and secondary links.
- `_data/site_sections.yml`: section overview descriptions and destinations.
- `_data/tool_groups.yml`: purpose-based tool groups.
- `_tools/plotto.md`: Plotto's catalog entry.
- `_sass/components/_information-architecture.scss`: shared styling.
- `_config.preview.yml`: preview-only configuration.

## Publishing and Cutover

Publish the compiled package through the separate preview repository's GitHub Pages workflow. Keep its source review material outside the deployed site. Do not copy the production repository's scheduled, publishing, or social-sync workflows into that repository.

After an explicit cutover request, bring the branch up to date with the current production content, run `bundle exec jekyll build` using production configuration plus the applicable checks, and integrate the approved change into main. The preview config and packaging must stay out of the production build invocation. Verify live HTML, navigation, existing paths, and production analytics settings after deployment.

Rollback reverts the redesign changes while preserving content added afterward.
