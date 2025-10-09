#!/usr/bin/env python3
"""Diff two Gamma World export CSV files and report added/removed/modified posts & field changes.

Usage:
  python _code/diff_gamma_world_exports.py --old path/to/older.csv --new path/to/newer.csv [--limit 20]

Notes:
  - Posts are keyed by 'filename'.
  - A field is considered changed if raw string values differ (no type coercion).
  - Reports summary counts plus per-change details (limited unless --limit increased or set to 0 for unlimited).
"""
from __future__ import annotations
import csv, argparse, sys
from pathlib import Path

def load(path: Path):
    with path.open(newline='', encoding='utf-8') as f:
        r = csv.DictReader(f)
        rows = {row['filename']: row for row in r}
        return rows, r.fieldnames

def main(argv=None):
    ap = argparse.ArgumentParser(description='Diff two Gamma World export CSV snapshots')
    ap.add_argument('--old', required=True, help='Old (baseline) CSV export file')
    ap.add_argument('--new', required=True, help='New CSV export file')
    ap.add_argument('--limit', type=int, default=25, help='Limit number of detailed changes shown (0 = unlimited)')
    args = ap.parse_args(argv)

    old_rows, old_fields = load(Path(args.old))
    new_rows, new_fields = load(Path(args.new))

    added = sorted(set(new_rows) - set(old_rows))
    removed = sorted(set(old_rows) - set(new_rows))
    potentially_common = set(old_rows) & set(new_rows)

    field_changes = []  # (filename, field, old_val, new_val)
    for fn in sorted(potentially_common):
        o = old_rows[fn]
        n = new_rows[fn]
        # Use union of fields to catch new columns
        for fld in sorted(set(o.keys()) | set(n.keys())):
            if fld == 'filename':
                continue
            ov = o.get(fld, '')
            nv = n.get(fld, '')
            if ov != nv:
                field_changes.append((fn, fld, ov, nv))

    print('=== Gamma World Export Diff Summary ===')
    print(f'Added posts: {len(added)}')
    print(f'Removed posts: {len(removed)}')
    print(f'Modified posts (any field change): {len({fc[0] for fc in field_changes})}')
    print(f'Total field-level changes: {len(field_changes)}')

    def show_list(title, items):
        if not items:
            return
        print(f'-- {title} ({len(items)}) --')
        lim = args.limit if args.limit > 0 else len(items)
        for it in items[:lim]:
            print(f'  {it}')
        if args.limit > 0 and len(items) > args.limit:
            print(f'  ... ({len(items)-args.limit} more)')

    show_list('Added', added)
    show_list('Removed', removed)

    if field_changes:
        print('-- Field Changes --')
        lim = args.limit if args.limit > 0 else len(field_changes)
        for fn, fld, ov, nv in field_changes[:lim]:
            print(f'  {fn}: {fld}:\n    - {ov!r}\n    + {nv!r}')
        if args.limit > 0 and len(field_changes) > args.limit:
            print(f'  ... ({len(field_changes)-args.limit} more)')

    return 0

if __name__ == '__main__':
    raise SystemExit(main())
