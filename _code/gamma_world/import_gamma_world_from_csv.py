#!/usr/bin/env python3
"""Update Gamma World markdown posts from a CSV edited in Google Sheets.

Usage:
  python _code/import_gamma_world_from_csv.py gamma_world.csv

CSV must have the header produced by export_gamma_world_to_csv.py:
  filename,title,date,categories,tags,description,image,image-alt,body

Rules:
  - Matches files by exact filename under _posts/Gamma World
  - Overwrites only the listed front matter keys + body
  - Preserves any additional existing front matter keys (e.g., layout, permalink)
  - categories / tags columns split on '|' back into arrays (empty string => omit)
  - Empty field in CSV removes that key (except title & date which are left blank if empty)
  - Creates a timestamped backup sibling file with .bak before modifying each post
"""
from __future__ import annotations
import csv
import sys
import pathlib
import shutil
import yaml
import hashlib
import json

ROOT = pathlib.Path(__file__).resolve().parent.parent
GW_DIR = ROOT / '_posts' / 'Gamma World'
IMMUTABLE_KEYS = set()  # placeholder if we later want to protect some keys
EXPORT_DIR = ROOT / '_data-to-be-developed' / 'Gamma World Import-Export'

def compute_body_checksum(body: str) -> str:
    return hashlib.sha256(body.encode('utf-8')).hexdigest()[:12]


def parse_csv(csv_path: pathlib.Path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield row

def load_post(path: pathlib.Path):
    text = path.read_text(encoding='utf-8')
    if not text.startswith('---'):
        return None, None, text
    parts = text.split('\n')
    try:
        closing_idx = next(i for i,l in enumerate(parts[1:], start=1) if l.strip() == '---')
    except StopIteration:
        return None, None, text
    fm_lines = parts[1:closing_idx]
    body_lines = parts[closing_idx+1:]
    data = yaml.safe_load('\n'.join(fm_lines)) or {}
    body = '\n'.join(body_lines)
    return data, closing_idx, body


def write_post(path: pathlib.Path, data: dict, body: str):
    # Re-emit YAML with consistent style
    yaml_text = yaml.safe_dump(data, sort_keys=False, allow_unicode=True).strip()
    content = f"---\n{yaml_text}\n---\n\n{body.strip()}\n"
    path.write_text(content, encoding='utf-8')


def update_from_row(row: dict):
    filename = row.get('filename')
    if not filename:
        return False, 'Row missing filename'
    post_path = GW_DIR / filename
    if not post_path.exists():
        return False, f'File not found: {filename}'

    data, _, old_body = load_post(post_path)
    if data is None:
        return False, f'Malformed front matter: {filename}'
    # Backup
    backup_path = post_path.with_suffix(post_path.suffix + '.bak')
    shutil.copy2(post_path, backup_path)

    # Iterate over all CSV columns except filename and body
    for key, csv_val in row.items():
        if key in ('filename','body'):
            continue
        if key in IMMUTABLE_KEYS:
            continue
        if key in ('categories','tags'):
            if csv_val.strip():
                seq = [v.strip() for v in csv_val.split('|') if v.strip()]
                data[key] = seq
            else:
                data.pop(key, None)
            continue
        # Attempt to JSON-decode dict-like values if they look like objects
        val_str = csv_val.strip()
        if not val_str:
            # Remove optional blank keys but keep title/date if originally present
            if key not in ('title','date'):
                data.pop(key, None)
            continue
        if (val_str.startswith('{') and val_str.endswith('}')) or (val_str.startswith('[') and val_str.endswith(']')):
            import json
            try:
                data[key] = json.loads(val_str)
                continue
            except Exception:
                pass
        data[key] = val_str
    # Body
    body = row.get('body','').replace('\r\n','\n')
    if body:
        old_body = body

    write_post(post_path, data, old_body)
    return True, f'Updated {filename}'


def main():
    if len(sys.argv) != 2:
        print('Usage: import_gamma_world_from_csv.py gamma_world.csv', file=sys.stderr)
        return 2
    csv_path = pathlib.Path(sys.argv[1])
    if not csv_path.exists():
        print(f'CSV not found: {csv_path}', file=sys.stderr)
        return 1

    successes = 0
    failures = 0
    for row in parse_csv(csv_path):
        ok, msg = update_from_row(row)
        if ok:
            successes += 1
            print(msg, file=sys.stderr)
        else:
            failures += 1
            print('ERROR:', msg, file=sys.stderr)
    # Write import summary
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    summary_path = EXPORT_DIR / 'last_import_summary.json'
    summary = {
        'source_csv': str(csv_path),
        'updated_files': successes,
        'failed_files': failures,
    }
    summary_path.write_text(json.dumps(summary, indent=2), encoding='utf-8')
    print(f'Done. {successes} updated, {failures} failed.', file=sys.stderr)
    print(f'Summary written to {summary_path.relative_to(ROOT)}', file=sys.stderr)
    return 0 if failures == 0 else 1

if __name__ == '__main__':
    raise SystemExit(main())
