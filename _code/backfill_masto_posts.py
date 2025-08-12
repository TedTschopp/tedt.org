#!/usr/bin/env python3
"""Backfill Mastodon posts for markdown files missing mastodon-post-id.

Creates toots for posts that lack mastodon-post-id using the Mastodon API.
Adds mastodon-post-id to front matter and updates cache/jsonfeed-to-mastodon.json.

Safeguards:
 - Dry-run by default (use --write to actually modify files)
 - Requires MASTODON_TOKEN in environment for live posting
 - Optional --limit to cap number of posts processed
 - Optional --since YYYY-MM-DD to only process newer content

Usage:
  python3 _code/backfill_masto_posts.py [--write] [--limit N] [--since 2024-01-01] [--rate 8] [dirs...]
"""

from __future__ import annotations
import sys, os, re, json, time, argparse, datetime as dt
from typing import Any, Dict
import urllib.request
import urllib.error

# Optional yaml import; script degrades with simplistic parser if unavailable
try:
    import yaml  # type: ignore
except Exception:  # pragma: no cover
    yaml = None  # type: ignore

FRONT_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
DEFAULT_DIRS = ["_posts/Blog Posts", "_posts/Prompts", "_posts/RPG Posts"]


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--write', action='store_true', help='Actually post & modify files (default dry-run)')
    p.add_argument('--limit', type=int, help='Maximum posts to process')
    p.add_argument('--since', type=str, help='Only include posts with date >= this (YYYY-MM-DD)')
    p.add_argument('--rate', type=int, default=8, help='Seconds sleep between live posts')
    p.add_argument('--site-url', default=None, help='Override site URL (auto from _config.yml)')
    p.add_argument('dirs', nargs='*', default=DEFAULT_DIRS)
    return p.parse_args()


def read_config_site_url() -> str | None:
    if not os.path.isfile('_config.yml'):
        return None
    with open('_config.yml', 'r', encoding='utf-8') as f:
        if yaml:
            cfg = yaml.safe_load(f) or {}
        else:  # naive fallback
            cfg = {}
            for line in f:
                if ':' in line:
                    k, v = line.split(':', 1)
                    cfg[k.strip()] = v.strip()
    url = cfg.get('url')
    baseurl = cfg.get('baseurl') or ''
    if url:
        return url.rstrip('/') + baseurl.rstrip('/')
    return None


def list_markdown(dirs):
    for d in dirs:
        if not os.path.isdir(d):
            continue
        for root, _, files in os.walk(d):
            for f in files:
                if f.lower().endswith('.md'):
                    yield os.path.join(root, f)


def extract_front(path):
    raw = open(path, 'r', encoding='utf-8').read()
    if not raw.startswith('---'):
        return {}, raw, raw
    m = FRONT_RE.match(raw)
    if not m:
        return {}, raw, raw
    if yaml:
        data = yaml.safe_load(m.group(1)) or {}
    else:
        data = {}
        for line in m.group(1).splitlines():
            if ':' in line:
                k, v = line.split(':', 1)
                data[k.strip()] = v.strip().strip('"')
    body = raw[m.end():]
    return data, body, raw


def write_front(path, fm: dict, body: str):
    with open(path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        if yaml:
            yaml.safe_dump(fm, f, sort_keys=False, allow_unicode=True)
        else:
            for k, v in fm.items():
                f.write(f"{k}: {v}\n")
        f.write('---\n')
        f.write(body.lstrip('\n'))


def canonical_path(fm: dict, path: str) -> str:
    # Use permalink if present, else derive from filename (excluding date & extension)
    if 'permalink' in fm and fm['permalink']:
        p = fm['permalink']
        if not p.startswith('/'):
            p = '/' + p
        if not p.endswith('/'):
            p += '/'
        return p
    # pattern: YYYY-MM-DD-{slug}.md
    base = os.path.basename(path)
    m = re.match(r"\d{4}-\d{2}-\d{2}-(.*)\.md", base)
    slug = m.group(1) if m else base.rsplit('.', 1)[0]
    # honor config permalinks: assume /:title/ already (so just slug)
    return f'/{slug}/'


def build_status(fm: dict, site_url: str, canon: str) -> str:
    title = fm.get('title') or '(untitled)'
    url = site_url.rstrip('/') + canon
    excerpt = fm.get('excerpt') or ''
    # Compose within ~450 chars target
    base = f"{title}\n{url}"
    remaining = 450 - len(base)
    if excerpt and remaining > 20:
        ex = excerpt.strip().replace('\n', ' ')
        if len(ex) > remaining:
            ex = ex[:remaining-1].rstrip() + '…'
        return f"{base}\n\n{ex}"
    return base


def post_status(token: str, status: str) -> dict[str, Any]:
    data = urllib.parse.urlencode({'status': status}).encode()
    req = urllib.request.Request(
        'https://tschopp.net/api/v1/statuses', data=data,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/x-www-form-urlencoded'}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP error posting status: {e.code} {e.read().decode(errors='ignore')}")


def load_cache() -> Dict[str, Any]:
    path = 'cache/jsonfeed-to-mastodon.json'
    if not os.path.isfile(path):
        return {}
    try:
        return json.loads(open(path, 'r', encoding='utf-8').read())
    except Exception:
        return {}


def save_cache(cache: Dict[str, Any]):
    os.makedirs('cache', exist_ok=True)
    with open('cache/jsonfeed-to-mastodon.json', 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False, sort_keys=True)


def main():
    args = parse_args()
    site_url = args.site_url or read_config_site_url() or 'https://tedt.org'
    token = os.environ.get('MASTODON_TOKEN') if args.write else None
    cutoff = None
    if args.since:
        cutoff = dt.date.fromisoformat(args.since)

    cache = load_cache()
    processed = 0
    to_process = []
    for path in list_markdown(args.dirs):
        fm, body, raw = extract_front(path)
        if fm.get('mastodon-post-id'):
            continue
        # date gating
        date_str = str(fm.get('date') or '')
        try:
            pdate = dt.date.fromisoformat(date_str[:10]) if date_str else None
        except ValueError:
            pdate = None
        if cutoff and pdate and pdate < cutoff:
            continue
        to_process.append((path, fm, body))

    # Oldest first for chronological catch-up
    to_process.sort(key=lambda t: t[1].get('date') or '')
    if args.limit is not None:
        to_process = to_process[: args.limit]

    print(f"Backfill candidate posts: {len(to_process)} (site base {site_url})")
    if not to_process:
        return 0

    for path, fm, body in to_process:
        canon = canonical_path(fm, path)
        status = build_status(fm, site_url, canon)
        print(f"\n== {path}\nCanonical: {canon}\nChars: {len(status)}")
        print(status)
        if args.write:
            if not token:
                print("ERROR: --write specified but MASTODON_TOKEN not set; aborting.")
                return 2
            resp = post_status(token, status)
            masto_id = resp.get('id')
            fm['mastodon-post-id'] = str(masto_id)
            write_front(path, fm, body)
            # update cache entry
            entry = cache.setdefault(canon, {'id': canon, 'toots': []})
            entry.setdefault('toots', []).append({
                'id': str(masto_id),
                'url': resp.get('url'),
                'created_at': resp.get('created_at'),
            })
            save_cache(cache)
            processed += 1
            print(f"Posted -> mastodon-post-id {masto_id}")
            time.sleep(args.rate)
    if args.write:
        print(f"\nCompleted backfill of {processed} posts.")
    else:
        print("\nDry-run complete. Use --write to post & persist changes.")
    return 0


if __name__ == '__main__':  # pragma: no cover
    raise SystemExit(main())
