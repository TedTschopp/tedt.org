#!/usr/bin/env python3
"""Export Gamma World bestiary markdown front matter + body to a CSV for Google Sheets.

Default behavior now writes a timestamped CSV file into:
    _data-to-be-developed/Gamma World Import-Export/

File naming pattern:
    gamma_world_export_YYYYMMDD_HHMMSS.csv

You can still force stdout with --stdout (useful for quick previews or piping).

Usage:
    python _code/export_gamma_world_to_csv.py            # writes file, prints path to stderr
    python _code/export_gamma_world_to_csv.py --stdout   # writes CSV to stdout
    python _code/export_gamma_world_to_csv.py --output custom.csv

Each row includes:
  filename, title, date, categories (| delimited), tags (| delimited), description, image, image-alt, body (Markdown without front matter)

Body newlines are preserved; embedded double quotes are doubled for CSV escaping.

Assumptions:
  - All Gamma World posts live under _posts/Gamma World/
  - YAML front matter delimited by first two lines starting with '---'
  - Unrecognized keys are ignored (extend FIELDS if needed)

Round-trip plan:
  1. Export to CSV, edit in Google Sheets.
  2. Re-import using a companion script (to be created) that matches on filename and rewrites front matter + body.
"""
from __future__ import annotations
import csv
import sys
import pathlib
import re
import yaml
from datetime import datetime, timezone
import argparse
import hashlib
import json

ROOT = pathlib.Path(__file__).resolve().parent.parent
GW_DIR = ROOT / '_posts' / 'Gamma World'
RESERVED_ALWAYS = {'layout','permalink'}

def collect_all_fields():
    keys = set()
    for path in sorted(GW_DIR.glob('*.md')):
        text = path.read_text(encoding='utf-8', errors='ignore')
        if not text.startswith('---'):
            continue
        parts = text.split('\n')
        try:
            closing_idx = next(i for i,l in enumerate(parts[1:], start=1) if l.strip() == '---')
        except StopIteration:
            continue
        fm_raw = '\n'.join(parts[1:closing_idx])
        try:
            data = yaml.safe_load(fm_raw) or {}
        except yaml.YAMLError:
            continue
        for k in data.keys():
            keys.add(k)
    # Ensure stable ordering: filename first, then common keys if present
    ordered = []
    priority = ['title','date','categories','tags','description','image','image-alt']
    for p in priority:
        if p in keys:
            ordered.append(p)
            keys.discard(p)
    # add remaining sorted
    for k in sorted(keys):
        if k not in ordered:
            ordered.append(k)
    return ordered

ALL_FIELDS = collect_all_fields()
CSV_HEADER = ['filename'] + ALL_FIELDS + ['body']

EXPORT_DIR = ROOT / '_data-to-be-developed' / 'Gamma World Import-Export'

def ensure_export_dir():
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    return EXPORT_DIR

def extract(post_path: pathlib.Path):
    text = post_path.read_text(encoding='utf-8')
    # Front matter must start at beginning
    if not text.startswith('---'):
        return None
    parts = text.split('\n')
    try:
        # find closing '---'
        closing_idx = next(i for i,l in enumerate(parts[1:], start=1) if l.strip() == '---')
    except StopIteration:
        return None
    fm_lines = parts[1:closing_idx]
    body_lines = parts[closing_idx+1:]
    fm_raw = '\n'.join(fm_lines)
    try:
        data = yaml.safe_load(fm_raw) or {}
    except yaml.YAMLError:
        return None
    row = {'filename': post_path.name}
    for f in ALL_FIELDS:
        val = data.get(f, '')
        if isinstance(val, (list, tuple)):
            val = '|'.join(str(v) for v in val)
        elif isinstance(val, dict):
            # Serialize nested dicts as JSON-ish YAML inline for manual editing awareness
            import json
            val = json.dumps(val, ensure_ascii=False)
        row[f] = str(val)
    body = '\n'.join(body_lines).strip('\n')
    row['body'] = body
    return row

def parse_args(argv=None):
    p = argparse.ArgumentParser(description='Export Gamma World markdown front matter + body to CSV.')
    p.add_argument('--stdout', action='store_true', help='Write CSV to stdout instead of file in export directory')
    p.add_argument('--output', help='Explicit output CSV file path (overrides default name); implies file output')
    return p.parse_args(argv)

def open_writer(args):
    if args.stdout:
        return csv.writer(sys.stdout, quoting=csv.QUOTE_MINIMAL), None, None
    ensure_export_dir()
    if args.output:
        out_path = pathlib.Path(args.output)
        if not out_path.is_absolute():
            out_path = EXPORT_DIR / out_path
    else:
        stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        out_path = EXPORT_DIR / f'gamma_world_export_{stamp}.csv'
    f = out_path.open('w', encoding='utf-8', newline='')
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    return writer, out_path, f

def main(argv=None):
    args = parse_args(argv)
    if not GW_DIR.exists():
        print(f"ERROR: {GW_DIR} missing", file=sys.stderr)
        return 1
    writer, out_path, file_handle = open_writer(args)
    writer.writerow(CSV_HEADER)
    for path in sorted(GW_DIR.glob('*.md')):
        row = extract(path)
        if not row:
            continue
        writer.writerow([row.get(col,'') for col in CSV_HEADER])
    if out_path and file_handle:
        file_handle.flush()
        file_handle.close()
        # Build meta summary
        content_bytes = out_path.read_bytes()
        sha = hashlib.sha256(content_bytes).hexdigest()
        row_count = sum(1 for _ in open(out_path, 'r', encoding='utf-8')) - 1  # minus header
        meta = {
            'export_path': str(out_path.relative_to(ROOT)),
            'generated_at': datetime.now(timezone.utc).isoformat(),
            'row_count': row_count,
            'column_count': len(CSV_HEADER),
            'columns': CSV_HEADER,
            'sha256': sha,
        }
        meta_path = out_path.with_suffix(out_path.suffix + '.meta.json')
        meta_path.write_text(json.dumps(meta, indent=2), encoding='utf-8')
        print(f"Export written to {out_path.relative_to(ROOT)} ({row_count} rows, {len(CSV_HEADER)} cols, sha256={sha[:12]}...)", file=sys.stderr)
        print(f"Meta: {meta_path.relative_to(ROOT)}", file=sys.stderr)
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
