# IndieWeb operations

Phase 1 uses webmention.io for receiving and verification, a moderated static
cache for display, and GitHub Actions for synchronization and outgoing delivery.
It adds no Jekyll plugin or application server.

## Public discussion

Articles submit an absolute canonical `target` to the receiver. The native form
works without JavaScript. Progressive enhancement announces that a submission
was queued; it does not claim verification or publication.

The site renders `_data/webmentions.json` during its build. The cache contains
approved public text and validated links, with separate groups for replies,
mentions, likes, reposts, bookmarks, RSVPs, and follows. It contains no HTML
payloads, private records, or authentication tokens. Content is escaped again
by Liquid. Readers do not need JavaScript or a successful provider API request
to read the responses.

Responses to the home page are collected at `/webmentions/`. A chronological
microformats feed is available at `/updates/`; existing RSS, Atom, and JSON feed
URLs remain available.

## Refresh and moderate

The **IndieWeb incoming mentions** workflow refreshes hourly. Run it manually
with `mode=approve` or `mode=block` and a numeric `mention_id` to make a decision.
The pending IDs are printed in the run log without publishing their content.
Review them in your signed-in webmention.io dashboard before approving them.
Decisions are kept in `_data/webmention_policy.json`; blocking takes priority.

Recognized Bridgy response and conversion URLs are trusted. Claiming a trusted
name or author URL does not confer trust. An independently operated site can be
trusted by adding its exact origin to `trusted_origins` after review.

The default complete refresh uses public per-target API queries, including known
legacy aliases and HTTP/HTTPS/www variants. An optional `WEBMENTION_IO_TOKEN`
Actions secret enables complete domain queries. Both modes filter out private
records. A failed page, invalid JSON, or incomplete pagination prevents cache
replacement. A successful full refresh reconciles edits and removed records.

Local commands, from the repository root:

```sh
bundle exec jekyll build
bundle exec ruby _code/indieweb.rb sync
bundle exec jekyll build
bundle exec ruby tests/check_indieweb_rendering.rb _site
bundle exec ruby _code/indieweb.rb approve --id 12345
bundle exec ruby _code/indieweb.rb block --id 12345
```

Synchronization commits only the approved cache and policy files. Because
pushes using `GITHUB_TOKEN` do not automatically trigger other workflows, the job
explicitly dispatches the site deployment as **IndieWeb cache refresh**. That
deployment is excluded from Mastodon cross-posting and outgoing discovery.

## Social backfeed and missing threads

The existing [Mastodon publishing and recovery](mastodon-integration.md) pipeline
owns verified status URLs and reconciliation. Phase 1 reads its
`mastodon-post-url` front matter and exposes it as `u-syndication`; it preserves
the current discussion renderer and publication ledger. Numeric IDs alone do not
become syndication links. Do not restart the retired cache-copying feed action.

Use that pipeline's read-only reconciliation to investigate missing statuses.
An unavailable social service does not remove the separate static Webmention
cache. Existing Mastodon publication controls and schedules remain in force.

Recoverable archived Webmention replies remain visible even when a live social
thread has disappeared. Do not fabricate replacement status IDs or re-post old
articles to repair a missing thread.

Bridgy account reconnection is an interactive owner operation. Sign in to the
existing account, confirm the website/profile links, and reconnect only the
networks the service currently supports. Then test one controlled public reply.
No account migration or automatic historical cross-posting is part of Phase 1.

## Outgoing delivery

**IndieWeb outgoing mentions** consumes the actual successful Pages artifact,
not a rebuilt approximation. The archive stays in runner temporary storage.
A bounded reader serializes regular HTML entries as data without extracting any
archive paths or executing artifact code; missing or duplicate article data stops
delivery. It extracts content links from the article's
`e-content`, compares the content with the live source, and discovers each
receiver in HTTP Link / HTML link-or-anchor order. It preserves endpoint queries,
preserves linked target fragments for exact verification, posts form-encoded
`source` and `target`, and treats any 2xx as acceptance.
Acceptance is not a claim that the receiver has verified or displayed a reply.

The first run initializes a baseline without notifying historical links. New or
edited articles notify current and previous targets, including removed links.
Deleted articles must return 404/410 before deletion notifications are sent.
Transient failures use bounded exponential backoff; at most 50 deliveries are
attempted per run. The hourly retry does not need an artifact download.

The workflow stores `webmention-outbox.json` on the `indieweb-state` branch and
loads a working copy at `cache/webmention-outbox.json`, excluded from Pages.
Receipt commits never advance `main`, trigger deployments, or interrupt the
Mastodon publisher's deployment check. A competing state writer fails rather
than overwriting receipts. The branch contains public source/target URLs and
delivery results; never add credentials or private content. An accepted pair is
reconsidered only after article content changes.

```sh
# No POST requests or state writes:
bundle exec ruby _code/indieweb.rb send
# Explicit live operation, normally performed by the workflow:
bundle exec ruby _code/indieweb.rb send --live
bundle exec ruby _code/indieweb.rb send --retry --live
```

Requests are limited in size, timeout, and redirects. DNS results are checked for
special-use networks and the checked address is pinned to the connection. TLS
hostname verification remains enabled. Credentials and POST bodies are not
forwarded across origins.

## Validate and qualify

```sh
bundle exec ruby tests/indieweb_test.rb
python3 tests/test_indieweb_artifact.py
bundle exec jekyll build
bundle exec ruby tests/check_indieweb_rendering.rb _site
bundle exec ruby tests/check_content_credits.rb _site
bundle exec ruby tests/check_web_publication_dates.rb _site
```

The render gate covers every article in `/indieweb-manifest.json`, not a small
sample. It checks article identity, author cards, content, known dates, receiver
discovery, absolute form targets, accessible controls, and static responses.

After deployment, separately record the public URL, deployment commit, and result
of: no-JavaScript reading; controlled receive/update/remove; one outgoing reply;
and provider failure behavior. Use Webmention Rocks for protocol qualification.
Fixture tests and read-only discovery do not establish live sending/receiving.

## Rollback and later phases

Disable the two IndieWeb workflows to pause synchronization and delivery while
keeping existing responses readable. Revert the site commit or deploy the prior
Pages artifact to roll back rendering. Retain the approved cache and delivery
ledger when reverting so moderation and accepted deliveries are not forgotten.

See [Phase 2 publishing and reader operations](indieweb-publishing.md) for Micropub,
account setup, private drafts, and the separate `media.tedt.org` GitHub Pages
repository. Phase 3 federation remains separate and preserves existing identities.
