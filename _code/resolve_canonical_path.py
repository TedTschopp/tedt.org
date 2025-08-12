#!/usr/bin/env python3
"""Resolve canonical path (feed item id) for a given Mastodon toot URL.

Reads cache/jsonfeed-to-mastodon.json and finds the entry containing the toot URL,
then prints the normalized key (canonical path) to stdout and sets GITHUB_OUTPUT
key CANONICAL_PATH if running in GitHub Actions.
"""
from __future__ import annotations
import json, sys, pathlib, os, re

ROOT = pathlib.Path(__file__).parents[1]
CACHE = ROOT / 'cache' / 'jsonfeed-to-mastodon.json'
RE_DOMAIN = re.compile(r'^https?://[^/]+')


def norm(p: str) -> str:
    p = RE_DOMAIN.sub('', p)
    if not p.startswith('/'):
        p = '/' + p
    p = re.sub(r'\.md/?$', '/', p)
    if not p.endswith('/'):
        p += '/'
    p = re.sub(r'/{2,}', '/', p)
    return p


def main():
    toot_url = os.environ.get('TOOT_URL', '').strip()
    if not toot_url:
        print('')
        return 0
    if not CACHE.exists():
        print('')
        return 0
    try:
        data = json.loads(CACHE.read_text(encoding='utf-8'))
    except Exception:
        print('')
        return 0
    for key, entry in data.items():
        if isinstance(entry, dict) and isinstance(entry.get('toots'), list):
            if toot_url in entry['toots']:
                canonical = norm(key)
                print(canonical)
                gha_out = os.environ.get('GITHUB_OUTPUT')
                if gha_out:
                    with open(gha_out, 'a', encoding='utf-8') as f:
                        f.write(f"CANONICAL_PATH={canonical}\n")
                return 0
    print('')
    return 0


if __name__ == '__main__':
    sys.exit(main())
