# Private Micropub authoring with validated static publication

- Status: Accepted for implementation by the site owner's Phase 2 request.
- Date: 2026-10-25
- Scope: Micropub, delegated IndieAuth, Microsub discovery, and Pages-only media.

The approved restoration plan retains Jekyll, GitHub Pages, existing social
identities, no new recurring subscription, and a separate public media repository.
A static site needs an authenticated authoring service; drafts cannot be stored
in a public Git repository, including its branches or build artifacts.

Use a narrowly routed Cloudflare Worker at `/micropub` and `/micropub/*` with a
new private D1 database dedicated to this service. Do not reuse membership data.
The service validates owner, resource, expiry, signature and action scope through
IndieKey. It also supports active-token introspection when a resource-server
credential is configured. Signed-token mode has the provider's documented
revocation delay, bounded by token expiry. Retain existing identity delegation
until the owner verifies the new metadata link; then align legacy discovery with
the verified provider so older clients obtain compatible tokens.

The Worker stores typed source, draft state, deletion state, immutable URLs,
revisions and pending media privately. It has no GitHub account credential.
Separate repository-scoped GitHub Actions jobs drain public entry/media queues
using independent private publisher credentials. Draft/deleted source bodies
are never exported to those queues. The main job sanitizes HTML with existing
Nokogiri, prevents Liquid evaluation, preserves verified Mastodon receipts, writes
ordinary `_posts/Micropub/` posts and dispatches the existing site build. There
is no new collection or Jekyll plugin. Git writes use ordinary non-forced pushes;
concurrent source changes retain the pending request on conflict.

Media is delivered exclusively through `TedTschopp/media.tedt.org` GitHub Pages.
An internal Worker with no public routes processes bounded 128 KiB upload chunks
through a service binding, avoiding multi-megabyte D1 conversions in a single
invocation. Uploads remain private until referenced by a public entry. The media
job publishes immutable hash filenames and a checksum/size/type manifest, verifies
the live bytes, then releases private upload chunks. Entries wait for referenced
media before entering the public repository. A commit is acknowledged separately
from a confirmed live deployment; neither an accepted request nor a failed build
is reported as published.

Launch limits: 5 MiB client upload; 50 MiB media repository file; 750 MiB Pages
artifact; 64 MiB pending private media; 2,000 authoring records; 10,000 media
records. These private limits leave headroom below D1's free single-database
capacity. Capacity failures stop writes; no paid plan is enabled automatically.
Internal service bindings, public GitHub Actions and existing Ruby/Node tooling
avoid a new application subscription. Actual provider quotas remain enforcement
boundaries, not availability guarantees.

Aperture supplies the owner's Microsub endpoint and Monocle supplies reading and
responding. Its free service retains seven days; saved bookmarks belong on the
website. No direct federation, identity migration to new Mastodon/Bluesky accounts,
public private-source mirror, or historical social reposting is included.

Release gates: real Worker/D1 tests, cryptographic token tests, all post-type
rendering, the production Jekyll build, existing Webmention/Mastodon checks,
repository-scoped publisher tests and staged live checks. Enable queue draining
only after the service, media site and main rendering code are deployed. Rollback
pauses publisher variables first and preserves private authoring state.

References: [Micropub](https://www.w3.org/TR/micropub/),
[IndieKey resource servers](https://indiekey.id/docs/resource-servers),
[Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/),
[D1 limits](https://developers.cloudflare.com/d1/platform/limits/),
[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits),
[Aperture pricing](https://aperture.p3k.io/pricing).
