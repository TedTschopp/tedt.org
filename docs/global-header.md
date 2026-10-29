# Shared Header

The public navigation is maintained in `_data/site_navigation.yml`. Participating
hosts and their selected sections are in `_data/header_sites.yml`. The five
section hubs use `_data/site_sections.yml`. Build and publish tedt.org to update
the navigation across all thirteen consumers after normal browser/CDN cache expiry.

## Embed Contract, Version 1

Load a small local copy of `embed.css` to reserve the header's 70px space and style
the fallback. Place one `tedt-global-header` before the site's own navigation.
Its optional `site` attribute is a registry key; `section` is one of `essays`,
`stories`, `games`, `tools`, `learn`, or `about`. Leave the section empty on the
main homepage. The component can also identify a participating hostname.

```html
<tedt-global-header site="busy" section="tools">
  <nav class="tedt-header-fallback" aria-label="Primary">
    <a href="https://tedt.org/">Ted Tschopp</a>
    <a href="https://tedt.org/essays/">Essays</a>
    <a href="https://tedt.org/stories/">Stories &amp; Folklore</a>
    <a href="https://tedt.org/games/">Games &amp; Worlds</a>
    <a href="https://tools.tedt.org/">Tools</a>
    <a href="https://tedt.org/learn/">Learn</a>
    <a href="https://tedt.org/about-ted/">About</a>
  </nav>
</tedt-global-header>
<script defer src="https://tedt.org/assets/global-header/v1/header.js"></script>
```

The external classic script contains the generated menu and theme controller.
It fetches `header.css` and `logo.svg` from the same directory. No cross-origin
JSON request or framework is needed. Navigation enhances only after its stylesheet
loads; the local fallback stays available on failure. Embedded frames suppress
their header when the script runs. Keep skip links outside the component.

The fallback and optional local pre-paint theme bootstrap are small consumer
snapshots. They receive maintenance updates during that site's next build; the
enhanced menu and interactive appearance controller always come from tedt.org.
Do not copy the full header implementation into a consumer.

## Appearance

`window.TedTTheme.get()` returns `light`, `auto`, or `dark`; `set(value)` applies
and saves a preference; `resolved()` returns `light` or `dark`; `refresh()` reads
the shared cookie again. `window.__TedColorScheme` remains a compatibility alias
for older public-site controls.

The controller emits `tedt:theme-change` on `window` with
`{ preference, resolved }`, and sets `data-theme`, `data-bs-theme`,
`data-color-scheme`, and `data-theme-preference` on the document element.
Consumers should listen to this event instead of maintaining another controller.
Giscus and application theme adapters retain their existing origin restrictions.

The `tedt-appearance` preference cookie is shared across tedt.org, lasts one year,
and uses Secure, SameSite=Lax, and Path=/. Existing saved preferences migrate when
the cookie is absent. Blocked storage leaves the current page usable. System
changes, page restoration, visibility, and focus refresh the selected appearance.

## CSP and Compatibility

Permit `https://tedt.org/assets/global-header/v1/` in `script-src`, `style-src`,
and, when needed, `img-src`. Do not loosen member `connect-src`, session cookies,
entitlements, downloads, or public file allowlists. The header includes no
analytics, identity requests, or member content.

Keep v1 paths and attributes compatible. Breaking changes require a v2 directory
and an explicit consumer migration. Revert the central release commit to roll
back a compatible update; revert a consumer's integration commit to restore its
previous header. Git history retains each release's exact asset bytes.

## Verification

```sh
bundle exec jekyll build
npm run test:global-header
```

The browser suite tests six sections, disclosures and focus, responsive widths,
touch targets, axe accessibility, CSS isolation, asset failure, disabled
JavaScript, shared cookies between subdomain origins, System appearance, central
updates without rebuilding consumers, and iframe suppression. Assets are routed
to the current build during tests, so an unpublished change can be verified.

Follow with each consumer's own checks and a live browser check after deployment.
See ADR 0018 for the architecture and trust decision.
