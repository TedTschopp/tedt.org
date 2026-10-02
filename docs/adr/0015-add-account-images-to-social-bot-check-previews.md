# ADR 0015: Add Account Images to Social Bot Check Previews

- Status: Accepted
- Date: 2026-10-01
- Authors: Ted Tschopp, Codex
- Supersedes: None
- Superseded-By: None

## Context

Social Bot Check runs in the browser on a Jekyll page hosted by GitHub Pages.
Links carry an account in the `user` query parameter and select Bluesky or
Mastodon with `platform`. The page currently advertises the site logo in its
Open Graph and Twitter metadata. tedt.org already uses Cloudflare's proxied DNS.

## Problem

Shared account links should show that account's profile picture. GitHub Pages
serves the same generated metadata for every query string, and a browser script
does not put account metadata in the initial HTML fetched by preview crawlers.

## Decision

Add a Cloudflare Worker route for
`https://tedt.org/tools/social-bot-check.html*`. The Worker fetches the existing
page from GitHub Pages and rewrites only its social metadata. Requests outside
the exact page path pass through. No DNS change or Jekyll plugin is required.

For a valid account URL, look up one public profile using the selected provider.
Reuse the browser's account parsers. Set the Open Graph and Twitter images and
their alternative text from a safe public HTTPS avatar, and set their URL fields
to the account-specific checker link. Use a summary card for square avatars.
Keep the generated site logo if the account has no picture, is invalid, or the
public API fails. Preserve the search canonical URL and publisher identity.

## Rationale

- Preview crawlers receive the account image without running JavaScript.
- GitHub Pages continues to build and host the entire site and checker.
- A route on the existing proxied hostname avoids moving the site.
- The Worker needs no database, API key for social sites, or paid storage.
- A bounded profile lookup and short cache reduce latency and API traffic.

## Alternatives Considered

### Update Metadata in Browser JavaScript

Simple, but does not satisfy initial-HTML shared-link previews.

### Generate Pages for Known Accounts

Works for a fixed list with different paths, but cannot cover arbitrary accounts
in the checker's existing query-string URLs.

### Move the Site to a Server Rendering Framework

Would provide dynamic metadata but adds migration work beyond this feature.

## Consequences

### Positive

- Both Bluesky and Mastodon account links can have distinct preview images.
- Missing images and failed lookups retain the existing fallback.

### Negative

- The Worker has a separate deployment and requires Cloudflare authentication.
- An uncached account lookup adds up to two seconds before returning the page.
- Social sites may retain their own preview caches after an avatar changes.

### Operating Limits

- The Cloudflare dashboard confirmed the existing Workers Free plan on
  October 1, 2026: 100,000 requests per account per day and 10 milliseconds of
  CPU per invocation. No paid upgrade was needed.
- The route is configured to fail open on execution failures or exhausted
  limits, returning the original GitHub Pages page with its logo. Verify this
  setting after future deployments. This is a presentation enhancement.

## Implementation Notes

The isolated package is `_code/cloudflare/social-bot-check-preview/`. It reuses
the parsers in `tools/social-bot-check/providers/`, requests only public profile
JSON, disallows credentials and redirects, and bounds response size. Cache only
the small image/alternative-text result for ten minutes, or a failed lookup for
one minute. Do not cache transformed HTML or forward visitor credentials to
profile APIs. Preserve the account query in social URL metadata to keep previews
for different accounts distinct.

Test the actual Worker runtime and HTMLRewriter without browser JavaScript:
initial response metadata, independent accounts and platforms, missing/default avatars,
unsafe input, API errors and timeouts, and cache reuse. Run the ordinary Jekyll
build. Verify the deployed HTML directly.

The Worker was deployed on October 1, 2026. Thirteen Worker tests, eight existing
provider/analysis tests and the Jekyll build passed. Six published initial-HTML
checks verified Ted's Bluesky and Mastodon images, another account's distinct
image, and the original logo for absent, missing and invalid accounts. The
Cloudflare dashboard confirmed the saved fail-open route setting.

Rollback by removing only this Worker route; the existing page remains usable.

## Metrics / Success Criteria

- Initial HTML for Ted's Bluesky and Mastodon links contains the respective
  profile image in both Open Graph and Twitter tags.
- A link without `user` retains the original image metadata.
- Missing images, failed APIs and unsafe input return a usable checker page.
- The canonical search URL, JSON-LD publisher and checker assets remain intact.
- A warm profile lookup uses the cache; uncached lookup has a two-second limit.

## Future Work (Deferred)

Add preview adapters alongside any new checker providers. No scanning of posts
or calculation of bot signals moves to the Worker.

## Decision Stability

Revisit if the hostname stops using Cloudflare, the free CPU/request limits are
insufficient, or the social APIs stop exposing public profile pictures.

## References

- [Cloudflare Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
