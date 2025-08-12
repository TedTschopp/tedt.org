#!/usr/bin/env python3
"""Generate rolling markdown summary from history CSV."""
from __future__ import annotations
import csv, pathlib

hist = pathlib.Path('Logs/mastodon-backfill-history.csv')
summary_path = pathlib.Path('Logs/mastodon-backfill-summary.md')

if not hist.exists():
    summary_path.write_text('# Mastodon Backfill Summary\n\nNo history yet.\n')
else:
    rows = list(csv.DictReader(hist.open()))
    if not rows:
        summary_path.write_text('# Mastodon Backfill Summary\n\nNo rows.\n')
    else:
        first = rows[0]
        last = rows[-1]
        total_runs = len(rows)
        total_processed = sum(int(r['processed'] or 0) for r in rows)
        initial_missing = int(first['missing_before'] or 0)
        current_missing = int(last['missing_after'] or 0)
        completed = initial_missing - current_missing if initial_missing else 0
        pct = (completed / initial_missing * 100) if initial_missing else 0
        recent = rows[-5:]
        lines = []
        lines.append('# Mastodon Backfill Summary')
        lines.append('')
        lines.append(f"* Last run (UTC): **{last['timestamp']}** dry_run={last['dry_run']} processed={last['processed']}")
        lines.append(f"* Total runs: **{total_runs}**")
        lines.append(f"* Initial missing: **{initial_missing}**")
        lines.append(f"* Current missing: **{current_missing}**")
        lines.append(f"* Total processed: **{total_processed}**")
        lines.append(f"* Completion: **{completed}/{initial_missing} ({pct:.1f}%)**")
        lines.append('')
        lines.append('## Recent Runs')
        lines.append('')
        lines.append('| timestamp | dry_run | delay | limit | since | missing_before | missing_after | processed |')
        lines.append('|-----------|---------|-------|-------|-------|----------------|---------------|-----------|')
        for r in recent:
            lines.append(f"| {r['timestamp']} | {r['dry_run']} | {r['delay']} | {r['limit']} | {r['since']} | {r['missing_before']} | {r['missing_after']} | {r['processed']} |")
        summary_path.write_text('\n'.join(lines) + '\n')
        print('Updated summary at', summary_path)
