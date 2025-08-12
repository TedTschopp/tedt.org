#!/usr/bin/env python3
"""Audit posts for missing mastodon-post-id front matter.

Scans provided directories (default: common content dirs) and reports:
 - Total posts scanned
 - Count & list of posts missing mastodon-post-id
 - Optional JSON output (machine readable)

Usage:
    python3 _code/audit_masto_frontmatter.py [--json] [--csv report.csv] [dir1 dir2 ...]
"""

from __future__ import annotations
import sys, os, json, re
from dataclasses import dataclass

FRONT_MATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)

DEFAULT_DIRS = [
    "_posts/Blog Posts",
    "_posts/Prompts",
    "_posts/RPG Posts",
]

@dataclass
class PostAudit:
    path: str
    has_id: bool
    mastodon_id: str | None
    title: str | None


def read_file(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def extract_front_matter(raw: str) -> tuple[dict, str]:
    if not raw.startswith('---'):
        return {}, raw
    m = FRONT_MATTER_RE.match(raw)
    if not m:
        return {}, raw
    fm_block = m.group(1)
    data = {}
    try:
        import yaml  # optional dependency
        data = yaml.safe_load(fm_block) or {}
    except Exception:
        # Very naive fallback: parse lines key: value (no nested support)
        for line in fm_block.splitlines():
            if ':' in line:
                k, v = line.split(':', 1)
                data[k.strip()] = v.strip().strip('"')
    content = raw[m.end():]
    return data, content


def scan_post(path: str) -> PostAudit:
    raw = read_file(path)
    fm, _ = extract_front_matter(raw)
    mid = fm.get('mastodon-post-id') if isinstance(fm, dict) else None
    title = fm.get('title') if isinstance(fm, dict) else None
    return PostAudit(path=path, has_id=bool(mid), mastodon_id=str(mid) if mid else None, title=title)


def list_markdown_files(dir_path: str):
    for root, _, files in os.walk(dir_path):
        for f in files:
            if f.lower().endswith('.md'):
                yield os.path.join(root, f)


def main(argv: list[str]):
    as_json = '--json' in argv
    csv_path = None
    # simple parse for --csv filename
    if '--csv' in argv:
        try:
            idx = argv.index('--csv')
            csv_path = argv[idx+1]
        except Exception:
            print('ERROR: --csv requires a filename', file=sys.stderr)
    dirs = [a for a in argv if not a.startswith('-') and a not in (csv_path,)] or DEFAULT_DIRS
    audits: list[PostAudit] = []
    for d in dirs:
        if not os.path.isdir(d):
            continue
        for path in list_markdown_files(d):
            audits.append(scan_post(path))
    total = len(audits)
    missing = [a for a in audits if not a.has_id]
    if as_json:
        json.dump({
            'total': total,
            'missing_count': len(missing),
            'missing': [a.path for a in missing],
        }, sys.stdout, indent=2)
        return 0
    if csv_path:
        import csv
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(['path','title'])
            for a in missing:
                w.writerow([a.path, a.title or ''])
        print(f"CSV report written: {csv_path}")
    print(f"Total posts scanned: {total}")
    print(f"Missing mastodon-post-id: {len(missing)}")
    if missing:
        for a in missing:
            print(f" - {a.path}{' :: '+a.title if a.title else ''}")
    else:
        print("All posts have mastodon-post-id")
    return 0


if __name__ == '__main__':  # pragma: no cover
    raise SystemExit(main(sys.argv[1:]))
