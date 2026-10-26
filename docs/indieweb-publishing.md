# Publish and read with tedt.org

Phase 2 uses Micropub clients to author ordinary Jekyll posts. Draft source and
deleted source are private in the dedicated Cloudflare authoring database.
Public publication is automatic after validation, media readiness and a successful
site deployment. This adds no Jekyll collection/plugin or paid subscription.

## Connect the accounts

1. The owner supplied the IndieKey metadata link ending in `crse2y91vtsd5q0r`.
   Publish it on the homepage, then press **Verify** on the domain in IndieKey.
   Verification requires the exact public tag, not merely a local build. The
   owner completed verification on October 25, 2026; the public metadata and
   signing-key documents now return HTTP 200.
2. After verification, align the existing authorization/token discovery links to
   the endpoints returned by that metadata. Keep both legacy tags: older clients
   still use them. The current metadata URI is
   `https://indiekey.id/.well-known/oauth-authorization-server/s/crse2y91vtsd5q0r`.
   The verified authorization endpoint is
   `https://indiekey.id/s/crse2y91vtsd5q0r/auth`; the token endpoint is
   `https://indiekey.id/token`. The site's two legacy discovery tags point there
   so clients that do not read the metadata link also use IndieKey.
3. The owner supplied `https://aperture.p3k.io/microsub/1121`. This is a public
   discovery URL, not an access token. Sign in to Aperture, follow a feed, and sign
   in to [Monocle](https://monocle.p3k.io/) using `tedt.org`. The free reader keeps
   seven days. Publish a bookmark to retain an item on your own website. After
   changing the site's token endpoint, sign back into Aperture once: its login
   refreshes the endpoint it stores for token checks. Then sign back into Monocle.
4. Sign in to [Quill](https://quill.p3k.io/) with `tedt.org`. Approve the requested
   permissions with your passkey. Different clients expose different post types.
   Monocle can also publish replies, likes and bookmarks through Micropub.

IndieKey's signed access tokens are verified using the published key, exact
issuer, owner, Micropub audience, expiry and requested scope. A token issued only
for Microsub cannot write posts or read drafts. To use immediate revocation via
introspection, create a resource-server introspection credential in IndieKey and
store it with `wrangler secret put INDIEAUTH_INTROSPECTION_SECRET` in the service
directory. Never paste a token/passkey/recovery code into Git or a public issue.
Older reader servers may need IndieKey's documented temporary legacy token-check
compatibility enabled under Resource servers; verify the actual client flow
before retiring that compatibility.

## Authoring behavior

Supported: articles, notes, photos, replies, likes, reposts, bookmarks, RSVPs,
audio, video, events and check-ins. Use JSON for nested venue/photo objects and
updates. Both form-encoded and JSON create requests work. The media endpoint is
advertised through authenticated `q=config`.

- Save `post-status=draft` for private authoring; draft text and unreferenced media
  never enter public repositories. Public/private/unlisted visibility changes are
  not interchangeable: private/unlisted publication is explicitly rejected.
- Create returns HTTP 201 with a stable canonical URL and a clear queued/draft
  status. That is acceptance, not a live-publication claim. Edits/deletes return
  204 after private state is saved. Use authenticated `q=status&url=...` to
  distinguish queued, awaiting deployment and published states.
- `q=source` requires update scope and returns the typed source with an ETag.
  Send If-Match when editing to detect concurrent changes. Use an Idempotency-Key
  for retryable creates. URLs and slugs remain stable. A private draft can be
  retimed before its first publication; published dates then stay stable.
- JSON update supports replace/add/delete; delete and undelete preserve source
  privately. Removing a page does not erase its previously public Git history. This service edits only entries it created. Use Git for older posts.
- Requests with unsupported fields fail without saving. HTML is sanitized with
  existing Nokogiri before publication. Liquid syntax stays literal. Image alt
  text, audio/video controls, event dates and venue microformats are retained.
- Select the existing `https://tschopp.net/@Ted` syndication target to use the
  current Mastodon pipeline. Managed entries otherwise opt out. Verified status
  IDs/URLs survive subsequent Micropub edits. Existing social identities remain.

The entry and media workflows poll every five minutes, subject to GitHub scheduler
availability. Media must be publicly verified before a referencing entry is
committed. The existing site quality/build/deploy pipeline still controls the
public site. Failed validation or deployment retains pending state; source is not
reported live until its exact ID/revision is observed on the public page.

## Media

Public repository: `TedTschopp/media.tedt.org`; HTTPS delivery: `media.tedt.org`.
Client files: at most **5 MiB**. Repository files added through Git: at most
**50 MiB**. Complete public artifact: at most **750 MiB**. Active HTML/SVG uploads
are unsupported. Accepted file types must match their signatures.

Unpublished media has a signed one-hour preview URL for authoring clients, including
audio/video byte ranges. Reopening source renews private previews. The service
normalizes preview URLs to stable Pages URLs before storage/publication; preview
tokens never enter Git. Do not share an unpublished preview link.

The private upload buffer has a **64 MiB** pending budget. The service has limits
of **2,000** authoring records and **10,000** media records to bound private state.
A full budget returns an error; paid upgrades are never automatic. Unreferenced
uploads remain private. Operators can review and remove abandoned private uploads
in the dedicated database; do not delete uploads still referenced by drafts.

Files live under `public/files/SHA256.extension`. `public/manifest.json` contains
URL, MIME type, size and checksum. Existing bytes at an immutable URL cannot be
replaced. For a larger file, compute its SHA-256, give it that filename, and commit
it under `public/files/` in the media repository. Its workflow validates the
entire tree and regenerates the manifest before Pages publication. Git LFS and
Releases are not used. Never commit temporary private queue downloads.

## Operate, release and roll back

Main repository variables:
- `INDIEWEB_SERVICE_DEPLOY_ENABLED`: deploy tested service versions on main.
- `INDIEWEB_PUBLISH_ENABLED`: drain entries and confirm live deployments.

Media repository variable: `INDIEWEB_MEDIA_SYNC_ENABLED` drains uploads referenced
by public entries. Leave it disabled until the service and main layout are live.

The owner approved use of the existing main-only `social-bot-check-preview`
GitHub environment for this service on October 26, 2026. Its historical name
reflects its first use. The job uses that environment's `CLOUDFLARE_API_TOKEN`
without copying the credential to another environment. The two publisher roles
are independently scoped to entry and media queues, and deployment smoke checks
exercise both roles without logging private source.

The dedicated D1 schema was provisioned separately through the connected
Cloudflare administrator. `INDIEWEB_D1_MIGRATIONS_ENABLED=true` opts into automatic
schema migration only when the deployment credential includes D1 Write. Leave it
false with a Worker-only credential, and apply future schema migrations before
releasing code that requires them.

Main repository secrets:
`INDIEWEB_PUBLISHER_TOKEN` (entry queue) and `INDIEWEB_MEDIA_PUBLISHER_TOKEN`
(media queue/service). The latter is also stored in the media repository. These
are generated independently; neither is a GitHub account token. The service stores
corresponding secrets, and only the private upload binding can reach its internal
buffer Worker. Logs and Pages artifacts contain no private entry source.

Validation:

```sh
npm ci --prefix _code/cloudflare/indieweb
npm test --prefix _code/cloudflare/indieweb
bundle exec ruby tests/micropub_publication_test.rb
python3 -m unittest discover -s tests -p 'test_micropub_publish.py'
bundle exec jekyll build
bundle exec ruby tests/check_indieweb_rendering.rb _site
```

Live qualification additionally requires the owner's actual passkey login, an
explicit private draft, an owner-approved public canary, update/delete/undelete,
media playback and a reader reply/bookmark. Fixture tests are not evidence of that
account authorization. Record the resulting URLs, revisions and deployments.

To pause, set both queue-draining variables false. Preserve the D1 database and
private chunks; revert the service/site version or disable its two narrow routes
if needed. Existing pages and previously published immutable media stay readable.
Re-enable only after the restored version passes validation. A failure is not a
reason to reset the private state or recreate an existing social status.
