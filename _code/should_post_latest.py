#!/usr/bin/env python3
"""Decide whether to post to Mastodon based on the latest post's front matter.

Outputs (GHA):
  should_post=true|false
  latest_file=<path>
  latest_date=<YYYY-MM-DD>

Rule: If the newest markdown in _posts has a non-empty mastodon-post-id, skip posting.
"""
from __future__ import annotations
import pathlib, re, os, sys, datetime, json

ROOT = pathlib.Path(__file__).parents[1]
POSTS = ROOT / '_posts'

RE_FM_DELIM = re.compile(r'^---\s*$')
RE_DATE = re.compile(r'^date:\s*"?(\d{4}-\d{2}-\d{2})')
RE_MASTO = re.compile(r'^mastodon-post-id:\s*(.+?)\s*$')

def parse_meta(p: pathlib.Path):
    date = None
    masto = None
    try:
        with p.open('r', encoding='utf-8') as f:
            in_fm = False
            for i in range(200):
                line = f.readline()
                if not line:
                    break
                if not in_fm:
                    if RE_FM_DELIM.match(line):
                        in_fm = True
                    else:
                        break
                    continue
                if RE_FM_DELIM.match(line):
                    break
                m = RE_DATE.match(line)
                if m and not date:
                    try:
                        date = datetime.date.fromisoformat(m.group(1))
                    except Exception:
                        pass
                mm = RE_MASTO.match(line)
                if mm and masto is None:
                    val = mm.group(1).strip().strip('\"\'')
                    masto = val
    except Exception:
        pass
    if date is None:
        m = re.match(r'^(\d{4})-(\d{2})-(\d{2})-', p.name)
        if m:
            try:
                date = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            except Exception:
                date = datetime.date.min
        else:
            date = datetime.date.min
    return date, masto

def main():
    files = sorted(POSTS.rglob('*.md'))
    if not files:
        print('No posts found; defaulting to should_post=false')
        sp = 'false'
        gha = os.environ.get('GITHUB_OUTPUT')
        if gha:
            with open(gha,'a',encoding='utf-8') as out:
                out.write(f"should_post={sp}\n")
        print(json.dumps({'should_post': sp}))
        return 0
    latest = None
    latest_date = datetime.date.min
    latest_masto = None
    for p in files:
        d, m = parse_meta(p)
        if d >= latest_date:
            latest_date = d
            latest = p
            latest_masto = m
    # Decide: post only if mastodon-post-id is missing/null/empty
    sp = 'true'
    if latest_masto is not None:
        v = latest_masto.strip().lower()
        if v not in ('', 'null', 'none'):
            sp = 'false'
    gha = os.environ.get('GITHUB_OUTPUT')
    if gha:
        with open(gha,'a',encoding='utf-8') as out:
            out.write(f"should_post={sp}\n")
            out.write(f"latest_file={latest}\n")
            out.write(f"latest_date={latest_date.isoformat()}\n")
    print(json.dumps({
        'should_post': sp,
        'latest_file': str(latest),
        'latest_date': latest_date.isoformat(),
        'latest_mastodon_post_id': latest_masto,
    }))
    return 0

if __name__ == '__main__':
    sys.exit(main())
