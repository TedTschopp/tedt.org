# TedT.org → Substack Publishing Bridge

## Current status

TedT.org remains the authoritative source. The bridge can currently:

- validate explicitly opted-in `_posts/` content;
- render Jekyll/Liquid/Kramdown prose into transport-neutral HTML and JSON;
- normalize and validate links and images;
- produce a checksum-protected GitHub Actions artifact and preview;
- plan idempotent first publications, draft changes, web corrections, and web-only backfills;
- maintain a versioned operational ledger on a dedicated state branch; and
- record a post that was published manually in Substack.

The repository intentionally contains **no live Substack write adapter**. Both
`artifact_only` and `official` fail before network access because no documented
Publisher API contract has been supplied. Do not substitute a session cookie,
private endpoint, browser automation, or a password. Add an adapter only after
Substack grants official write access and the capability canary below passes.

This implementation also cannot create GitHub repository variables, a protected
environment, reviewer rules, branch restrictions, or the durable state branch.
Those setup steps are manual prerequisites. Until they are completed, use only
artifact preparation; do not use a state-changing manual mode and do not enable
an adapter.

`substack-state` is a normal Git branch and is publicly readable in this public
repository. Its ledger is operational metadata, not a secret store. It may hold
post IDs, draft IDs, public URLs, hashes, states, schedules, and timestamps. It
must never contain credentials, session cookies, subscriber data, email
addresses, private delivery evidence, or other secrets. Excluding the ledger in
`_config.yml` keeps it out of the rendered Pages artifact; it does not make the
file or its Git history private.

## Publication flow

```text
opted-in _posts file
        ↓
successful Site Quality + Deploy on main
        ↓
credential-free render, validation, and artifact
        ↓
protected substack-production environment approval
        ↓
official adapter (when available)
        ↓
durable state + web/email acceptance + later reconciliation
```

The following states are deliberately separate:

1. TedT.org deployment verified.
2. Substack package prepared.
3. Substack draft accepted.
4. Web publication or schedule accepted.
5. Email/app request accepted.
6. Actual email delivery independently evidenced.

An API success must never be described as proof of mailbox delivery.

## Post front matter

Publishing is fail-closed and opt-in. Add this mapping to an eligible file under
`_posts/`:

```yaml
substack:
  enabled: true
  id: "cost-of-a-finished-job-2026-08-16"
  delivery:
    web: true
    email: true
  audience: everyone
  publish_at:
  slug:
  section:
  tags: []
  paywall_after:
  public_source_acknowledged: false
```

Rules:

- `enabled` is a YAML Boolean and defaults to `false`.
- `id` is required when enabled. It must be a unique, immutable, lowercase
  identifier of 3–128 URL-safe characters. It is the recovery and ledger key,
  so a file rename must not change it.
- `delivery.web` and `delivery.email` are both required YAML Booleans. At least
  one must be `true`. The adapter capability canary must prove each enabled
  combination before production use.
- `audience` defaults to `everyone`; allowed values are `everyone`, `free`,
  `paid`, and `founding`.
- `paid` and `founding` require `public_source_acknowledged: true`. This creates
  an internal validation warning only. It does not insert a reader-visible
  disclosure into the Substack article. The complete TedT.org source remains
  public, so these modes segment delivery rather than protect exclusive text.
- `publish_at` is empty for release immediately after approval. A schedule must
  be a future ISO-8601 timestamp with an explicit `Z` or numeric offset and may
  be no more than three calendar months ahead. A backfill discards its schedule.
- `slug` is optional. Once the ledger records a published slug, changing it is
  a conflict. Leaving it empty permits a future official API to assign it.
- `section` is optional.
- `tags` is an optional array of strings. If the key is absent, the article's
  top-level Jekyll tags are used. An explicit empty array sends no tags.
- `paywall_after` is valid only for `paid` or `founding` and must identify one
  unambiguous top-level boundary.

`published: false`, `draft: true`, future-dated Jekyll posts, files outside
`_posts/`, and posts without `substack.enabled: true` are never candidates.
`_work-in-progress/` is never scanned.

### Preview boundaries

For a heading boundary, use its visible text:

```yaml
paywall_after: "What changes for members"
```

The matching heading remains in the preview; paid content begins after it. The
heading text must match exactly once after whitespace normalization.

For a precise marker boundary, use a named marker:

```yaml
paywall_after: "marker:members"
```

```markdown
Public preview text.

<!-- substack-paywall:members -->

Member text begins here.
```

The marker is removed from all rendered output. `paywall_after: marker` pairs
with the unnamed `<!-- substack-paywall -->` marker.

## Rendering and validation

`_code/substack/bridge.rb` uses the repository's Jekyll, Liquid, Kramdown, and
Nokogiri dependencies. It renders the article body only, not a site layout. The
result therefore excludes navigation and page chrome by construction.

The renderer also:

- removes Jekyll-only standalone attribute lines and explicitly marked comment,
  related-content, call-to-action, and navigation modules;
- converts article links and images to absolute TedT.org URLs;
- verifies local image existence and records its SHA-256 fingerprint;
- verifies the canonical article URL and prepared image URLs over public HTTPS
  after Pages deployment, including expected HTML/image content types;
- requires alt text for hero and inline images;
- preserves ordinary headings, tables, code, quotes, lists, figures, and prose;
- emits full HTML, preview HTML, paid HTML, text, payload JSON, and an asset
  manifest; and
- rejects scripts, event handlers, unsafe styles, forms, iframes, audio/video
  embeds, SVG/canvas markup, unsupported elements, unresolved Liquid, missing
  assets, and empty content.

Unsupported content fails the entire preparation. The bridge never publishes a
partially stripped article. Fix or replace the unsupported source construct and
run the preparation again.

Liquid-looking text inside Markdown code fences or inline code is preserved as
literal code. Jekyll tags/filters that require a full layout context (for
example, an unsupported include) fail preparation rather than disappearing or
publishing partial prose.

The transport-neutral JSON includes `canonical_url`. A future official adapter
must map that only to a documented canonical/source field. It must not add a
visible “also free on TedT.org” notice.

## GitHub setup

Complete these steps before enabling a mutation path.

### 1. Protect source and state

1. Add a `main` ruleset that requires pull requests and the existing
   `Site Quality + Deploy` check, and blocks force pushes and branch deletion.
2. Create `substack-state` from the main branch after this implementation is
   merged:

   ```bash
   git push origin main:refs/heads/substack-state
   ```

3. Restrict human writes to `substack-state`. Permit this workflow's
   `github-actions[bot]` identity to fast-forward only
   `cache/substack-sync.json`. Never permit force pushes.
4. Keep `cache/substack-sync.json` on `main` as the versioned bootstrap and
   schema example. `_config.yml` excludes it from GitHub Pages output. Runtime
   reads and writes use the state-branch copy.

The branch and its history remain visible to anyone who can read the repository.
Review ledger changes as public operational records and reject any change that
introduces a token, cookie, subscriber identifier, email address, or other
secret. Branch protection reduces accidental or unauthorized writes; it is not
confidentiality.

A source SHA contains an old ledger after a publication. That is why production
state cannot safely live only in the deployed commit. The mutation job re-reads
`substack-state` after approval and serializes all state changes.

### 2. Configure repository variables

Add these in **Settings → Secrets and variables → Actions → Variables**:

| Name | Initial value | Purpose |
|---|---|---|
| `SUBSTACK_PUBLICATION_URL` | Existing publication origin, such as `https://name.substack.com` | Validates manual records and scopes the future adapter |
| `SUBSTACK_ADAPTER` | `artifact_only` | Keeps mutation jobs disabled until an official adapter exists |

`SUBSTACK_ADAPTER` must remain a repository variable because it gates the job
before the protected environment is entered. Change it to `official` only in the
same controlled rollout that adds and validates the documented adapter.
An empty `SUBSTACK_PUBLICATION_URL` keeps the workflow artifact-only and prevents
the protected mutation job from starting.

### 3. Configure the protected environment

Create the literal environment `substack-production` with:

- one or more required reviewers;
- deployment branches restricted to the exact selected branch `main`;
- prevention of self-review when another trusted reviewer is available; and
- `SUBSTACK_API_TOKEN` as an environment secret, added only after official
  access and the canary succeed.

Do not use “protected branches only” until `main` actually has protection. The
workflow gives only the mutation job `contents: write`; preparation has no
credential and a read-only token. The environment secret is passed only to the
single adapter invocation step.

Create and verify these protections before using `record-manual`, even though
that mode does not receive the Substack API credential: it still changes the
durable ledger. The same protections are mandatory before enabling any official
adapter. A manual dispatch never bypasses the environment review gate.

### 4. Request official Publisher API access

Ask Substack to document and authorize all capabilities required by the chosen
front matter modes:

- create and update a draft;
- upload images or accept validated external image URLs;
- set or preserve canonical source metadata;
- set and lock a slug;
- assign sections and tags;
- select `everyone`, `free`, `paid`, and `founding` audiences;
- publish web-only, email/app-only, or combined delivery;
- schedule with an explicit timezone;
- look up draft/post state and remote revision;
- update an already published web/app article without resending email;
- expose an idempotency key or documented recovery key; and
- distinguish request acceptance from independently observable delivery.

Record the official endpoint, authentication, scope, rate-limit, retry,
idempotency, and error semantics in the future adapter tests. If any required
capability is absent, keep `artifact_only` and publish manually.

## Workflow behavior

`.github/workflows/substack-publish.yml` runs only from:

- a successful `Site Quality + Deploy` run whose Pages `deploy` job succeeded
  for this repository's `main` branch; or
- a manual dispatch selected from `main`.

It checks out the exact deployed SHA, not the default branch tip. Immediately
before a mutation it verifies that the same SHA is still the latest successful
main deployment; an approval that became stale fails closed.

Manual modes:

| Mode | Behavior |
|---|---|
| `prepare` | Render and upload an artifact only; no environment or secret |
| `publish` | Prepare one changed ID and, only with an official adapter, enter the approval gate |
| `reconcile` | Read one remote post through the official adapter; matching state records verification, drift records a conflict |
| `record-manual` | Validate one fresh package and record supplied remote IDs/URL and observed acceptance state without an API token |

`record-manual` records evidence after an operator publishes or updates the post
outside this bridge. It never performs the Substack publication itself. It is a
state-changing operation and therefore requires the configured production
environment and reviewer approval.

Set `backfill: true` only with one `source_id`. The package forcibly sets
`delivery` to `{web: true, email: false}` and clears `publish_at`. Backfills never
email subscribers.

At most one source ID may request email/app delivery in a workflow run. If an
automatic scan finds more, the artifact is retained for review but the workflow
fails before entering the protected mutation job. Dispatch `publish` separately
for each source ID.

Preparation uploads:

```text
manifest.json
validation-report.json
summary.md
checksums.sha256
posts/<source-id>/payload.json
posts/<source-id>/article.html
posts/<source-id>/preview.html
posts/<source-id>/assets.json
```

The manifest records the deployed SHA, candidate operations, prior/current
payload hashes, effective delivery, schedule, and ledger snapshot hash. All
artifact paths are fixed from validated IDs and every file is checksum-verified
again inside the approval gate.

## Ledger and failure semantics

The versioned `cache/substack-sync.json` entries record source path/SHA, payload
hash, slug, audience, effective delivery, schedule, remote IDs/URL/revision,
state, web status, email request status, delivery evidence, and verification
times.

Important invariants:

- Every scan considers all eligible opt-ins; it never depends only on a Git diff
  or the newest post.
- The immutable source ID makes a path rename a no-op instead of a duplicate.
- A successful draft upsert is committed to `substack-state` before release.
- `publish_intent` is committed and pushed before any email request.
- A timeout after a possible email request becomes `unknown`. `pending`,
  `accepted`, and `unknown` email states cannot be retried automatically.
- Once email is accepted, a content change uses only `update_web_post`; it never
  invokes release/send again.
- A remote revision mismatch becomes `conflict`. The bridge never overwrites
  an unexpected manual edit.
- Disabled or deleted sources produce a manual-disposition alert. The bridge
  never deletes a Substack post.
- A non-fast-forward state push aborts. There is no force-push fallback.

Substack web publication, email request acceptance, and actual delivery remain
separate fields even when they occur in one API response.

## Local commands

Use the repository Ruby version:

```bash
RBENV_VERSION=3.2.9 rbenv exec bundle exec ruby tests/check_substack_bridge.rb
RBENV_VERSION=3.2.9 rbenv exec bundle exec ruby _code/substack/cli.rb prepare \
  --root . \
  --output tmp/substack-package \
  --ledger cache/substack-sync.json \
  --source-sha "$(git rev-parse HEAD)"
```

Or run the contract suite through Make:

```bash
make substack_check
```

Local preparation uses the bootstrap ledger and performs no API call. Omit
`--validate-remote-assets` when working before the corresponding Pages deploy;
the post-deployment workflow always enables it.

## Adapter implementation gate

The future official adapter must implement the four methods in
`_code/substack/adapter.rb`:

- `upsert_draft`
- `publish_or_schedule`
- `get_post`
- `update_web_post`

It must return normalized IDs, URL, remote revision, web status, and email
request acceptance without leaking the credential into logs or exceptions. Add
recorded contract fixtures from official documentation; do not infer endpoint
paths or payloads from browser traffic.

Current limitation: neither registered adapter can create a draft, upload an
asset, schedule or publish a post, send email/app delivery, read remote state, or
verify a Substack URL. The supported automated result today is a validated
artifact. Manual publication remains outside the bridge and can only be recorded
afterward with `record-manual` once the GitHub environment protections exist.

Before changing `AdapterRegistry` or `SUBSTACK_ADAPTER`, prove in a disposable
canary publication:

1. one draft create and idempotent rerun;
2. one draft update preserving the same remote ID;
3. image upload or external-image behavior;
4. one web-only release and status lookup;
5. one scheduled release and cancellation/update behavior;
6. one approved email/app request with an intentionally observable recipient;
7. one post-email web correction with no resend; and
8. timeout recovery with no duplicate.

## Rollout

1. Obtain official API access and pass the capability canary.
2. Run two artifact-only weekly preparations and compare the preview with
   TedT.org.
3. Add the official adapter and run one approved draft, then one approved
   web-only canary.
4. Run one approved email/app canary.
5. Keep every first publication, schedule, email request, and correction behind
   environment approval for at least four clean weekly cycles.

Acceptance requires matching title/body/images, a verified Substack URL, no
duplicate on rerun, correct durable ledger state, and separate evidence for web
publication, email request acceptance, and actual delivery.
