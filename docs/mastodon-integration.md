# Mastodon publishing and recovery

The public profile and timeline use `@TedT@twit.social`. Article syndication and
public discussions use `@Ted@tschopp.net`. Update `profile.social` and
`mastodon_comments` separately when those roles change.

## One publisher and one history

`_code/mastodon_manifest.rb` reads Jekyll's published documents, exact permalinks,
publication dates, and explicit redirect destinations. It includes articles,
quotes, Gamma World records, presentations, and relocated prompts, while excluding
drafts and the Policy/Homepage utility sections. `web_published_at` takes
precedence over a historical source `date`.

`_code/mastodon_sync.py` owns migration, reconciliation, queue selection, receipts,
and front-matter updates. The original `cache/jsonfeed-to-mastodon.json` remains
an immutable migration input. Do not normalize its keys and restart the retired
feed action: that action uses a different identity scheme and could repost items.
Legacy writer entry points now preview or delegate to verified reconciliation.

The versioned ledger groups documents by final canonical URL, retains all known
status references, and records unmapped legacy history separately. Merged prompt
aliases produce one announcement. Account and status IDs are exact strings.
The website retains `mastodon-post-id` and adds `mastodon-post-url` for the
verified original or replacement discussion.

Live runs persist the ledger on the `mastodon-state` branch. Before posting, the
runner commits an intent with a stable idempotency key. After posting, it commits
the returned receipt. A failed receipt commit leaves the intent intact; the next
run scans the complete account timeline and recovers the existing post rather
than blindly repeating the request. A competing ledger writer causes a failure.
GitHub's blob API handles ledgers larger than the Contents API's inline limit.

## Local inspection

These commands create no Mastodon statuses:

```sh
python3 _code/mastodon_sync.py audit
python3 _code/mastodon_sync.py reconcile --report tmp/mastodon/review.json
```

`audit` is offline. `reconcile` reads public APIs and reports live, missing, and
pending discussions. Its default is read-only; `--write` saves verified mappings
and progress locally. It never interprets an authentication failure, throttling,
or a partial timeline as deletion. Confirmed 404s are retained with their check
timestamp; a queued replacement is checked again immediately before posting.
Private statuses are never rendered or exported into the public site.

Local files alone cannot authorize publication. Live publishing requires the
serialized GitHub Actions workflow and durable GitHub state.

## Rollout controls

The workflow runs after a successful trusted main deployment and every two hours.
Both repository variables default to `false`:

| Variable | Effect when true |
| --- | --- |
| `MASTODON_PUBLISH_ENABLED` | Allow one publication per run after token identity verification and a successful deployment of the current main commit. |
| `MASTODON_BACKFILL_ENABLED` | Allow automatic archive catch-up and replacement of confirmed missing threads. |

`MASTODON_TOKEN` must belong to `@Ted@tschopp.net` and permit `read:accounts`
for identity verification and `write:statuses` for publication. Public timeline
reconciliation does not require a token. Before enabling publication, check the
account's automatic post-deletion policy so syndicated discussions remain
available. The cause of the historical missing statuses has not been established.

1. Merge and deploy the redirects, discussion renderer, verified links, and
   replacement workflow with both variables false. Scheduled runs reconcile
   existing threads without posting.
2. Review `/mastodon-backfill-summary/` and a manual `reconcile` dry run.
3. Set `MASTODON_PUBLISH_ENABLED=true`, retaining automatic backfill as false.
   Dispatch one real archive canary:

   ```sh
   gh workflow run mastodon-feed.yml --ref main \
     -f mode=publish -f write=true -f archive_canary=true
   ```

4. Verify the real status, persisted receipt, website discussion link, and
   explicitly dispatched deployment. Run a publish dry run or reconciliation
   again and verify that it does not propose another copy of that article.
5. Set `MASTODON_BACKFILL_ENABLED=true` after the canary succeeds.

Newly discovered publications take priority. Archive entries run oldest first,
with at least two hours between archive announcements and a maximum of twelve
in any rolling twenty-four-hour period. A global one-hour gap also applies to new
announcements. Edits do not requeue an existing live discussion.

Setting `MASTODON_PUBLISH_ENABLED=false` pauses every publication while preserving
reconciliation, receipts, and existing discussion links. Do not roll back by
re-enabling the former feed action. Never delete the state branch to retry a run.

The Actions token commits verified website metadata with a `chore(mastodon):`
message and explicitly dispatches `deploy.yml`, because token-authored pushes
do not trigger normal push workflows. The publisher ignores that metadata
deployment's completion event to prevent a deployment loop. Push conflicts rebase
metadata only; publication is never repeated as a Git retry.

## Website behavior and redirects

The timeline resolves the configured handle before fetching statuses. The
discussion client loads public JSON anonymously, sanitizes supported markup,
preserves attachment descriptions, and displays loading, empty, unavailable,
and retry states. Native Mastodon pages complete replies and reactions. Slides
expose discussion links without adding comment cards inside the presentation.

Legacy prompt posts use the existing `jekyll-redirect-from` plugin's explicit
`redirect_to` field. Keep old permalinks stable. Resolve merged aliases directly
to the final AI Library page; a matching slug is not sufficient. The two migrated
skills use `/skills/generating-podcast-script/` and `/skills/ted-writing-style/`.
The shared redirect layout provides an accessible fallback and canonical URL.
GitHub Pages serves generated HTML forwarding pages; these are not HTTP 301s.

## Checks and operational evidence

```sh
bundle exec jekyll build
make mastodon_check
npx playwright test tests/a11y/mastodon-integration.spec.ts
```

The checks cover all eligible sources and every legacy prompt redirect, as well
as duplicate recovery, pagination, rate limits, publication uncertainty, ledger
conflicts, keyboard interactions, safe markup, and narrow-screen accessibility.
Normal CI uses fixtures and never publishes test statuses.

The public progress JSON uses real reconciliation/publication timestamps, not
the build time. Existing `current_missing`, `total_processed`, and completion
fields remain available; `states` distinguishes recovered, published, missing,
pending, and uncertain entries. `total_processed` counts confirmed publications,
not restored front-matter fields. Workflow summaries and diagnostic artifacts
retain errors and uncertain receipts. The detailed ledger is excluded from the
rendered website and contains no credentials.
