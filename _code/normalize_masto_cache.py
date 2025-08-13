#!/usr/bin/env python3
"""One-time (idempotent) normalization + dedupe for Mastodon feed cache.

Goals:
  * Collapse variant keys (relative vs absolute, .md suffix, missing trailing slash)
  * Ensure each already-tooted post has a single canonical key (root-relative, trailing slash)
  * Augment entries from front matter if a mastodon-post-id is set but cache lacks toot URL
  * Preserve existing metadata (title, summary, image, tags, dates) when available
  * Expose whether a normalization happened so workflow can set ignoreFirstRun once

Canonical key format: /slug-path/

Safe to re-run; only rewrites if change detected.
"""
from __future__ import annotations
import json, os, re, sys, time, pathlib

ROOT = pathlib.Path(__file__).parents[1]  # repo root (.. from _code)
CACHE_DIR = ROOT / "cache"
CACHE_FILE = CACHE_DIR / "jsonfeed-to-mastodon.json"
FLAG_FILE = CACHE_DIR / ".mastodon_cache_normalized"
POSTS_DIR = ROOT / "_posts"
MASTO_INSTANCE = "https://tschopp.net"
USER_HANDLE_PATH = "/users/Ted/statuses/"  # pattern observed in existing cache

fm_delim = re.compile(r'^---\s*$')
re_masto_id = re.compile(r'^mastodon-post-id:\s*(.+?)\s*$')
re_permalink = re.compile(r'^permalink:\s*(.+?)\s*$')

def epoch_ms() -> int:
    return int(time.time() * 1000)

def normalize_path(raw: str) -> str:
    if not raw:
        return raw
    raw = raw.strip()
    # Strip scheme+domain
    raw = re.sub(r'^https?://[^/]+', '', raw)
    # Ensure leading slash
    if not raw.startswith('/'):
        raw = '/' + raw
    # Strip .md suffix (with or without trailing slash)
    raw = re.sub(r'\.md/?$', '/', raw)
    # Ensure trailing slash
    if not raw.endswith('/'):
        raw += '/'
    # Collapse multiple slashes
    raw = re.sub(r'/{2,}', '/', raw)
    return raw

def load_cache() -> dict:
    if CACHE_FILE.exists():
        with CACHE_FILE.open('r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("WARNING: Cache JSON invalid; starting fresh", file=sys.stderr)
                return {}
    return {}

def merge_entry(dest: dict, src: dict):
    if 'toots' in src:
        dest.setdefault('toots', [])
        for t in src['toots']:
            if t not in dest['toots']:
                dest['toots'].append(t)
    if 'lastTootTimestamp' in src:
        dest['lastTootTimestamp'] = max(src.get('lastTootTimestamp', 0), dest.get('lastTootTimestamp', 0))
    for k, v in src.items():
        if k in ('toots','lastTootTimestamp'): continue
        if k not in dest or dest[k] in (None, '', []):
            dest[k] = v

def parse_front_matter(path: pathlib.Path):
    masto_id = None
    permalink = None
    slug = None
    try:
        with path.open('r', encoding='utf-8') as f:
            in_fm = False
            for line in f:
                if not in_fm:
                    if fm_delim.match(line):
                        in_fm = True
                    else:
                        break
                    continue
                if fm_delim.match(line):
                    break
                m = re_masto_id.match(line)
                if m:
                    raw = m.group(1).strip()
                    if raw.lower() != 'null' and raw != '' and raw.lower() != 'none':
                        masto_id = re.sub(r'[^0-9]', '', raw)
                p = re_permalink.match(line)
                if p:
                    permalink = p.group(1).strip().strip('"\'')
        if not permalink:
            fname = path.name
            m = re.match(r'\d{4}-\d{2}-\d{2}-(.+?)\.md$', fname)
            if m:
                slug = m.group(1)
        return masto_id, permalink, slug
    except Exception as e:
        print(f"ERROR parsing front matter {path}: {e}", file=sys.stderr)
        return None, None, None

def main():
    dry_run = os.environ.get('DRY_RUN','').lower() in ('1','true','yes')
    original = load_cache()
    merged: dict[str, dict] = {}

    for key, entry in original.items():
        norm = normalize_path(key)
        merged.setdefault(norm, {})
        merge_entry(merged[norm], entry)
        merged[norm]['id'] = norm

    if POSTS_DIR.exists():
        for md in POSTS_DIR.rglob('*.md'):
            masto_id, permalink, slug = parse_front_matter(md)
            if not masto_id:
                continue
            # Determine preferred canonical path.
            # If a permalink is declared, honor it.
            # Else, if a date-prefixed variant already exists in cache, prefer that (prevents re-toots
            # when feed used date slug previously). Otherwise fall back to slug-only path.
            if permalink:
                norm = normalize_path(permalink)
            else:
                # Build both possibilities
                fname_base = md.name[:-3]  # strip .md
                date_slug_match = None
                m = re.match(r'^(\d{4}-\d{2}-\d{2}-.+)$', fname_base)
                if m:
                    date_slug = m.group(1)
                    date_variant = normalize_path('/' + date_slug + '/')
                    date_slug_match = date_variant
                slug_only = normalize_path('/' + (slug or fname_base) + '/')
                # Prefer whichever already exists in merged (so we don't create a duplicate key)
                if date_slug_match and date_slug_match in merged:
                    norm = date_slug_match
                else:
                    norm = slug_only
            merged.setdefault(norm, {'id': norm})
            toot_url = f"{MASTO_INSTANCE}{USER_HANDLE_PATH}{masto_id}"
            merged[norm].setdefault('toots', [])
            if toot_url not in merged[norm]['toots']:
                merged[norm]['toots'].append(toot_url)
            merged[norm].setdefault('lastTootTimestamp', epoch_ms())

    # Optional cleanup: drop keys that looked like raw .md exposures (already normalized into merged)
    legacy_md_keys = [k for k in original.keys() if k.endswith('.md') or '.md/' in k]

    # Additional de-duplication: merge slug-only and date-prefixed variants of same post.
    # We prefer the date-prefixed path IF it exists because feed IDs may have used it, avoiding re-posts.
    # Pattern: /YYYY-MM-DD-slug/  vs /slug/
    date_slug_re = re.compile(r'^/(\d{4}-\d{2}-\d{2})-([A-Za-z0-9-]+)/$')
    to_delete = []
    for k in list(merged.keys()):
        dm = date_slug_re.match(k)
        if not dm:
            continue
        slug_part = dm.group(2)
        slug_key = f'/{slug_part}/'
        if slug_key in merged and slug_key != k:
            # Merge toot lists & metadata into date key k
            merge_entry(merged[k], merged[slug_key])
            to_delete.append(slug_key)
    if to_delete:
        for dk in to_delete:
            del merged[dk]

    new_keys = set(merged.keys())
    old_norm_keys = {normalize_path(k) for k in original.keys() if k not in legacy_md_keys}
    changed = new_keys != old_norm_keys
    # If duplicate normalized keys collapsed (count differs) mark changed
    if not changed and len(original.keys()) != len(old_norm_keys):
        changed = True
    # If we removed any slug duplicates explicitly
    if not changed and to_delete:
        changed = True
    if not changed:
        for k in new_keys:
            old_entry = original.get(k) or next((original[ok] for ok in original if normalize_path(ok)==k), {})
            new_entry = merged[k]
            if len(new_entry.get('toots', [])) != len(old_entry.get('toots', [])):
                changed = True
                break

    if changed:
        if dry_run:
            print(f"[DRY-RUN] Would write normalized cache. Entries: {len(merged)} (was {len(original)})")
        else:
            tmp = CACHE_FILE.with_suffix('.tmp')
            with tmp.open('w', encoding='utf-8') as f:
                json.dump(merged, f, indent=2, ensure_ascii=False, sort_keys=True)
                f.write('\n')
            tmp.replace(CACHE_FILE)
            FLAG_FILE.write_text('normalized\n', encoding='utf-8')
            print(f"Normalized cache written. Entries: {len(merged)} (was {len(original)})")
            if legacy_md_keys:
                print(f"Removed legacy .md variant keys: {len(legacy_md_keys)}")
    else:
        print("Cache already normalized; no changes written.")

    gha_out = os.environ.get('GITHUB_OUTPUT')
    if gha_out and not dry_run:
        with open(gha_out, 'a', encoding='utf-8') as f:
            f.write(f"ignore_first_run={'true' if changed else 'false'}\n")

if __name__ == '__main__':
    main()
