# ADR 0017: Unify Mastodon Publication and Recovery

- Status: Accepted
- Date: 2026-10-25
- Accepted: User-approved production rollout in PR #245, merged as `969dae3484f55c0c0c500b61613749dfebae5861`.

## Context

The feed action keys its history by absolute website URL, while the local sync
and normalization utilities expect relative paths. Recently published articles
therefore lack their Mastodon thread links. The twelve-item feed and partial
directory scans also omit much of the archive. Some recorded statuses no longer
exist. A successful workflow currently says little about the website's threads.

## Decision

Use one repository-owned Python runner for audit, reconciliation, and publication.
A standalone Ruby exporter reads Jekyll's published documents and exact URLs;
it is not a Jekyll plugin. A versioned ledger retains legacy URLs and status
history and groups relocated prompts by their verified final canonical URL.
All live publication uses one serialized GitHub Actions workflow. Persist an
intent before publication, use a stable Mastodon idempotency key, and reconcile
uncertain outcomes against a complete account timeline before attempting again.

Keep @TedT@twit.social as the public profile and @Ted@tschopp.net as the publishing
account. Recover live discussion links before posting. Replace confirmed missing
threads only after duplicate reconciliation. New publications take priority;
archive recovery proceeds oldest first, at most once every two hours and twelve
times in a rolling twenty-four-hour period. Publication is paused by default.

Use jekyll-redirect-from's redirect_to field for each relocated prompt, preserving
its old permalink and resolving merged aliases directly to the final destination.
Render public discussions with one deferred, accessible client and explicit
failure states. Mastodon completes authenticated interactions on its own pages.

## Alternatives

- Patching each cache reader independently retains incompatible writers and
  uncertain retry behavior.
- Increasing the public feed size couples archive recovery to a reader-facing
  feed and still does not reconcile deleted statuses.
- A separate publishing service adds deployment and credential infrastructure
  that this static site does not require.

## Consequences

The internal manifest covers the complete published archive without enlarging
the public feed. Account pagination and a small deferred script replace repeated
status requests and large inline comment scripts. The site remains static and
uses its existing GitHub Pages-compatible redirect plugin. Accessible loading,
empty, failure, and retry states replace blank cards. Secrets remain in Actions;
public operational records contain no tokens or private statuses.

Migration retains original cache data. Failed or ambiguous publication is an
actionable state, not permission to repost. Automated metadata commits explicitly
dispatch the existing deployment workflow. Disabling publication preserves the
ledger and public thread links.

## Verification

Test canonical aliases, prompt merges, exact string IDs, state migration,
missing-status replacement, complete timeline reconciliation, queue order and
rate limits, uncertain responses, persistence conflicts, and safe browser output.
Verify every legacy prompt redirect, build Jekyll, and exercise desktop/mobile
discussion and timeline states. Release behind pause switches; validate one real
queued publication and an idempotent rerun before enabling archive catch-up.
