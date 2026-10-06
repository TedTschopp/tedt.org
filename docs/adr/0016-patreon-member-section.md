# ADR 0016: Introduce a Patreon Member Section on Cloudflare

- Status: Accepted
- Date: 2026-10-06

## Context

TedT.org's public Jekyll site and public Git repository cannot protect exclusive content. The member section needs the same publishing and design approach while authenticating Patreon supporters and adapting automatically when the creator changes tier names, prices, or offerings.

## Decision

Keep public publishing on GitHub Pages. Store member source in the private `TedTschopp/member.tedt.org` repository and serve its Jekyll output through a Cloudflare Worker at `member.tedt.org`. The Worker authorizes every protected page, supporting asset, browser-tool dependency, and private R2 download. D1 stores encrypted creator tokens, opaque sessions, membership checks, and catalog snapshots.

Patreon API v2 supplies campaign, creator, tier identifiers, names, descriptions, prices, and entitlements. Content references a provider tier ID selected from the API catalog. Access compares the current price of the required tier with the current prices of the member's entitled tiers. No tier names, prices, ranks, counts, or IDs are application constants. Equal prices grant equal access; unpublished tiers can preserve existing entitlements; deleted references deny access until reassigned.

Paid and gifted memberships qualify, while unpaid trials and ordinary free memberships do not. Current paid-period entitlement is preserved after cancellation. Signed webhooks invalidate checks; API verification and bounded freshness prevent stale events or outages from granting access indefinitely.

The member build imports an allowlist of presentation sources from a pinned commit of this public repository. Member layouts omit public syndication, analytics, webmentions, external comments, and offline caching. Production and staging have separate secrets and storage. Production rejects staging fixtures.

The public `/members/` introduction renders tier metadata from the member service, never a manually maintained table. The `membership.enabled` configuration remains false until live verification succeeds. Existing public content remains public.

## Alternatives

- Client-side gating of public GitHub Pages content cannot prevent direct access to files or source.
- A separate application framework would duplicate the existing Jekyll publishing approach and design.
- Fixed tier names, slugs, prices, or ranks would require site changes for ordinary Patreon edits.

## Consequences

Member delivery requires a server authorization layer, private source, and separate operational credentials. Free Cloudflare allowances are the initial target; usage is monitored before considering paid upgrades. Price changes intentionally alter inheritance. Tier renames and additions require no deployment. A deleted tier reference needs explicit content reassignment.

## Verification

Verify tier changes, gifts/trials, paid-period cancellation, OAuth state, webhook replay/races, session revocation, private asset aliases, R2 ranges, stale-data denial, and cross-member caching. Run Jekyll, runtime, browser accessibility, and dry-run deployment checks before protected staging verification and public navigation activation.
