#!/usr/bin/env python3
"""Compatibility preview for the complete Jekyll archive. Live runs use Actions."""
import argparse
import json
import sys
from mastodon_sync import ROOT, export_manifest, load_json, prepare_ledger, timestamp, SyncError

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--limit', type=int)
    parser.add_argument('--since')
    parser.add_argument('--rate', type=int, default=7200)
    parser.add_argument('dirs', nargs='*')
    args = parser.parse_args()
    if args.write:
        sys.exit('Live backfill is serialized through mastodon-feed.yml. Dispatch publish with write=true after enabling the rollout switches.')
    try:
        manifest = export_manifest(ROOT)
        ledger = prepare_ledger(manifest, load_json(ROOT / 'cache/mastodon-ledger.json'),
                                load_json(ROOT / 'cache/jsonfeed-to-mastodon.json'), timestamp())
        rows = [row for row in ledger['entries'].values() if row['eligible'] and row['state'] in {'pending', 'missing', 'uncertain'}]
        if args.since:
            rows = [row for row in rows if row['published_at'][:10] >= args.since]
        if args.dirs:
            rows = [row for row in rows if any(source.startswith(directory.rstrip('/') + '/') for source in row['source_paths'] for directory in args.dirs)]
        rows.sort(key=lambda row: (row['published_at'], row['canonical_url']))
        if args.limit is not None:
            if args.limit < 0: parser.error('--limit must be nonnegative')
            rows = rows[:args.limit]
        print(f'Backfill candidate posts: {len(rows)} (unverified preview; reconcile before publishing)')
        for row in rows:
            print(json.dumps({'url': row['canonical_url'], 'published_at': row['published_at'], 'state': row['state']}))
        print('Dry-run complete. Use the shared Actions publisher for verified live recovery.')
    except SyncError as exc:
        sys.exit(str(exc))
