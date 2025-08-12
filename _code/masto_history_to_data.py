#!/usr/bin/env python3
"""Convert Logs/mastodon-backfill-history.csv to _data JSON for Jekyll."""
from __future__ import annotations
import csv, json, pathlib

hist_path = pathlib.Path('Logs/mastodon-backfill-history.csv')
out_path = pathlib.Path('_data/masto_backfill_history.json')

if not hist_path.exists():
    print('No history file present.')
else:
    rows = list(csv.DictReader(hist_path.open()))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    print(f'Wrote {len(rows)} rows to {out_path}')
