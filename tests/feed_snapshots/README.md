# Feed Snapshots

This directory contains normalized baseline snapshots of the site's JSON feeds used for regression testing.

## Files

- `feed.json` - Normalized snapshot of the main site feed
- `feed-mastodon.json` - Normalized snapshot of the Mastodon-optimized feed

## Purpose

These snapshots are used by the feed diff regression guard (`tests/diff_feeds.rb`) to detect unexpected changes in feed structure, content, or behavior. The guard helps prevent silent regressions in:

- Feed item ordering
- Content truncation logic
- URL canonicalization
- Metadata changes
- Item additions/removals

## Normalization

Snapshots are normalized to remove non-deterministic fields:
- Date/time stamps (date_published, date_modified)
- Build timestamps
- Keys are sorted alphabetically for consistent comparison

## Usage

The feed diff script automatically updates these snapshots on successful runs. To manually update snapshots:

```bash
ruby tests/diff_feeds.rb --update-snapshots
```

## Configuration

Diff thresholds and behavior are configured in `tests/config/feed_diff.yml`.

## Bypass

To bypass diff checking (e.g., when intentionally changing feed structure):
- Set environment variable: `ALLOW_FEED_DIFF=1`
- Or include `[feed-diff-accept]` in commit message