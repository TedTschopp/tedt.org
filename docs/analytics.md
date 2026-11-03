# Shared visitor analytics

All active TedT.org HTML sites use the deferred script at
`https://tedt.org/assets/analytics/v1/analytics.js`. It is separate from the global
header and receives its configuration from TedT.org's `analytics` settings.
GA4, Microsoft Clarity, and Cloudflare Web Analytics share the existing reporting
IDs. Advertising personalization and Google signals remain disabled.

```html
<script defer src="https://tedt.org/assets/analytics/v1/analytics.js"
        data-tedt-analytics="v1" data-privacy="standard"></script>
```

Use `data-privacy="masked"` for member pages and browser workspaces. The runtime
also recognizes those hosts and existing tool paths. It masks the document before
Clarity loads, removes unmask overrides, and omits private text, filenames, query
strings, and link labels from custom GA4 events. Clarity can still receive page
URLs and navigation metadata; content masking is not complete URL anonymization.
Authentication, payment, API, callback, and logout operations are excluded.
Localhost, file URLs, and hosts outside tedt.org never initialize collectors.

Every local publication pipeline finalizes its HTML and then verifies coverage:

```sh
python3 scripts/site_analytics.py _site
python3 scripts/site_analytics.py _site --check
```

The helper removes old GA4/Clarity initialization, adds one shared embed, and
extends existing CSP directives with collector origins. It preserves form and
frame restrictions. Run it after late-generated HTML reports are copied into the
published directory. Redirect-only documents and fragments are excluded.
Buildless consumers apply it to their served HTML sources. Consumer copies of
the helper carry this same contract; the collector implementation stays central.

Cloudflare's existing beacon token works across the apex and its subdomains.
The runtime detects server-injected beacons during migration. Once every consumer
has the manual integration, automatic injection can be disabled without replacing
the reporting site. Manual collection uses `https://cloudflareinsights.com`.

The eval lab instruments a separate hosted copy after portable build/package
checks. Its reference source and independent downloads do not contain this embed.
Media files, feeds, JSON, MCP responses, and binary downloads are not instrumented.

Validate with `python3 -m unittest discover -s tests -p test_site_analytics.py`,
`node --test tests/analytics/*.test.mjs`, and each consumer's existing checks.
Rollback restores the previous consumer commit or shared runtime release.
