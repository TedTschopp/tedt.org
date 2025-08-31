#!/usr/bin/env python3
"""Sync missing mastodon-post-id front matter fields from cache/jsonfeed-to-mastodon.json.

Problem: Some posts were tooted (entries exist in cache) but their markdown front
matter still lacks mastodon-post-id (null/empty/missing or commented out). This causes
the backfill logic (historically) to consider them unposted and risk duplicates.

Strategy (non-destructive, minimal formatting impact):
 1. For each markdown file under _posts, inspect the YAML front matter block (lines
    between the first two '---').
 2. If a line with 'mastodon-post-id:' exists containing a non-empty numeric id, skip.
    If it's 'null', empty, or placeholder, remove it and treat as missing.
 3. Derive possible cache keys (permalink, /slug/, /YYYY-MM-DD-slug/). If any cache
    entry has one or more toot URLs/objects, choose the LAST toot as canonical.
 4. Extract numeric id: if toot item is an object with 'id' use that; else parse the
    trailing digits of the toot URL.
 5. Insert a line 'mastodon-post-id: <id>' just before the closing '---' of front matter.
    (Preserves ordering & comments above.)
 6. Report counts; supports --write to persist changes; dry-run by default.

Notes:
 - We intentionally avoid reparsing/dumping full YAML to preserve existing comments
   (like lines starting with '##') which would break strict YAML parsers anyway.
 - If front matter is malformed (missing closing delimiter) we skip file.
"""

from __future__ import annotations
import os, re, json, argparse, pathlib, sys
from typing import List, Tuple

CACHE_PATH = 'cache/jsonfeed-to-mastodon.json'

RE_FM_DELIM = re.compile(r'^---\s*$')
RE_MASTO_LINE = re.compile(r'^mastodon-post-id:\s*(.*)$')

def load_cache() -> dict:
    if not os.path.isfile(CACHE_PATH):
        return {}
    try:
        with open(CACHE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def toot_id_from_entry(entry) -> str | None:
    if isinstance(entry, dict) and 'id' in entry and entry['id']:
        return str(entry['id'])
    if isinstance(entry, str):
        # Extract trailing digits
        m = re.search(r'(\d+)(?:/?$)', entry)
        if m:
            return m.group(1)
    return None

def collect_cache_id(cache: dict, keys: List[str]) -> str | None:
    for k in keys:
        ent = cache.get(k)
        if not ent or not isinstance(ent, dict):
            continue
        toots = ent.get('toots')
        if isinstance(toots, list) and toots:
            # Last toot considered authoritative
            last = toots[-1]
            if isinstance(last, list) and last:  # unlikely nested list
                last = last[-1]
            if isinstance(last, dict) and 'id' in last:
                return str(last['id'])
            if isinstance(last, dict) and 'url' in last:
                tid = toot_id_from_entry(last.get('url'))
                if tid:
                    return tid
            tid = toot_id_from_entry(last)
            if tid:
                return tid
    return None

def derive_keys(path: pathlib.Path, permalink: str | None) -> List[str]:
    keys: List[str] = []
    if permalink:
        p = permalink if permalink.startswith('/') else '/' + permalink
        if not p.endswith('/'):
            p += '/'
        keys.append(p)
    base = path.name
    m = re.match(r'^(\d{4}-\d{2}-\d{2})-(.+)\.md$', base)
    if m:
        date_part, slug_part = m.group(1), m.group(2)
        keys.append(f'/{slug_part}/')
        keys.append(f'/{date_part}-{slug_part}/')
    else:
        slug_part = base.rsplit('.',1)[0]
        keys.append(f'/{slug_part}/')
    # Deduplicate preserving order
    seen = set()
    out = []
    for k in keys:
        if k not in seen:
            seen.add(k)
            out.append(k)
    return out

def parse_front_matter(lines: List[str]) -> Tuple[int,int] | None:
    if not lines or not RE_FM_DELIM.match(lines[0]):
        return None
    for i in range(1, len(lines)):
        if RE_FM_DELIM.match(lines[i]):
            return (0, i)  # inclusive start, end index of closing delim
    return None

def extract_permalink(fm_lines: List[str]) -> str | None:
    for line in fm_lines:
        if line.startswith('permalink:'):
            return line.split(':',1)[1].strip().strip('"\'')
    return None

def existing_masto_id(fm_lines: List[str]) -> str | None:
    for line in fm_lines:
        m = RE_MASTO_LINE.match(line)
        if m:
            raw = m.group(1).strip().strip('"\'')
            if raw and raw.lower() not in ('null','none'):  # treat numeric or quoted numeric as present
                # ensure numeric subset
                digits = re.sub(r'[^0-9]','', raw)
                if digits:
                    return digits
    return None

def scrub_fm_remove_masto(fm_lines: List[str]) -> List[str]:
    return [l for l in fm_lines if not RE_MASTO_LINE.match(l)]

def process_file(path: pathlib.Path, cache: dict, write: bool) -> tuple[bool,bool]:
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()
    span = parse_front_matter(lines)
    if not span:
        return False, False
    start, end = span
    fm_lines = lines[start+1:end]  # exclude delimiters
    if existing_masto_id(fm_lines):
        return False, False  # already good
    permalink = extract_permalink(fm_lines)
    keys = derive_keys(path, permalink)
    masto_id = collect_cache_id(cache, keys)
    if not masto_id:
        return False, False  # nothing to add
    # Remove any placeholder line
    fm_clean = scrub_fm_remove_masto(fm_lines)
    # Insert new id before closing delimiter (lines[end])
    insertion_index = end  # position of closing '---'
    new_lines = lines[:start+1] + fm_clean + [f'mastodon-post-id: {masto_id}'] + [lines[end]] + lines[end+1:]
    if write:
        path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
    return True, True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true', help='Persist changes (default dry-run)')
    ap.add_argument('--gha', action='store_true', help='Emit GitHub Actions outputs (sync_candidates, sync_updated)')
    args = ap.parse_args()
    cache = load_cache()
    posts_root = pathlib.Path('_posts')
    updated = 0
    candidates = 0
    for md in posts_root.rglob('*.md'):
        changed, counted = process_file(md, cache, args.write)
        if counted:
            candidates += 1
        if changed:
            updated += 1
    print(f"Sync candidates (had matching cache toot, missing id): {candidates}")
    effective_updated = updated if args.write else candidates  # would update all candidates in dry-run
    print(f"Updated files: {updated}{' (dry-run; would update '+str(effective_updated)+')' if not args.write else ''}")
    if args.gha:
        gha = os.environ.get('GITHUB_OUTPUT')
        if gha:
            with open(gha, 'a', encoding='utf-8') as f:
                f.write(f"sync_candidates={candidates}\n")
                f.write(f"sync_updated={effective_updated if args.write else 0}\n")
    return 0

if __name__ == '__main__':
    sys.exit(main())
