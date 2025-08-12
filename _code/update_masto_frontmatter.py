#!/usr/bin/env python3
"""Update the mastodon-post-id front matter field for the most recently tooted post.

Inputs via environment variables (GitHub Actions step):
    TOOT_URL  - (required for update) Full Mastodon status URL the action created.
    ITEM_URL  - (optional) Original feed item URL (absolute). Preferred.
    ITEM_ID   - (optional) Feed item id (canonical path like /slug/).

Fallback resolution (when ITEM_URL / ITEM_ID absent):
    a. Look up toot URL inside cache/jsonfeed-to-mastodon.json; if found, use that key.
    b. Otherwise, pick the most recent post (by front matter date or filename date) that either
         lacks a mastodon-post-id or has it set to null/empty.

Logic summary:
    1. Extract toot numeric id from TOOT_URL.
    2. Resolve canonical path via (ITEM_URL | ITEM_ID | cache lookup | heuristic recent post).
    3. Locate markdown file by permalink or slug match.
    4. Insert/update mastodon-post-id in front matter (idempotent).

Exit codes:
    0 success or benign no-op
    1 unexpected failure
"""
from __future__ import annotations
import os, re, sys, pathlib, json, datetime

RE_DOMAIN = re.compile(r'^https?://[^/]+')
RE_FRONT_MATTER_DELIM = re.compile(r'^---\s*$')
RE_PERMALINK = re.compile(r'^permalink:\s*(.+?)\s*$')
RE_MASTO = re.compile(r'^mastodon-post-id:\s*(.+?)\s*$')

ROOT = pathlib.Path(__file__).parents[1]
POSTS_DIR = ROOT / '_posts'
CACHE_FILE = ROOT / 'cache' / 'jsonfeed-to-mastodon.json'
DATE_LINE_RE = re.compile(r'^date:\s*("?)(\d{4}-\d{2}-\d{2})(?:[^\n]*)')

def log(msg: str):
    print(f"[update-masto] {msg}")

def normalize_path(p: str) -> str:
    if not p:
        return ''
    p = p.strip()
    p = RE_DOMAIN.sub('', p)
    if not p.startswith('/'):
        p = '/' + p
    p = re.sub(r'\.md/?$', '/', p)
    if not p.endswith('/'):
        p += '/'
    p = re.sub(r'/{2,}', '/', p)
    return p

def extract_toot_id(toot_url: str) -> str | None:
    if not toot_url:
        return None
    parts = toot_url.rstrip('/').split('/')
    for seg in reversed(parts):
        if seg.isdigit():
            return seg
    return None

def candidate_files():
    return list(POSTS_DIR.rglob('*.md'))

def derive_slug_path(md_path: pathlib.Path) -> str:
    name = md_path.name
    m = re.match(r'(\d{4}-\d{2}-\d{2}-)?(.+?)\.md$', name)
    slug = m.group(2) if m else name.rsplit('.',1)[0]
    if '/Prompts/' in str(md_path):
        return f"/prompts/{slug.lower().replace(' ', '-').replace('_','-')}/"
    return f"/{slug}/"

def find_post_file(canonical_path: str):
    matches = []
    for f in candidate_files():
        try:
            with f.open('r', encoding='utf-8') as fh:
                lines = []
                delim_count = 0
                for _ in range(120):
                    line = fh.readline()
                    if not line:
                        break
                    lines.append(line)
                    if RE_FRONT_MATTER_DELIM.match(line):
                        delim_count += 1
                        if delim_count == 2:
                            break
                if delim_count < 2:
                    continue
            permalink = None
            for line in lines:
                pm = RE_PERMALINK.match(line)
                if pm:
                    val = pm.group(1).strip().strip('"\'')
                    permalink = normalize_path(val)
                    break
            if permalink == canonical_path:
                matches.append(f)
                continue
            if permalink is None:
                derived = normalize_path(derive_slug_path(f))
                if derived == canonical_path:
                    matches.append(f)
        except Exception:
            continue
    if matches:
        matches.sort(key=lambda p: len(str(p)))
        return matches[0]
    return None

def load_cache_mapping_for_toot(toot_url: str) -> str | None:
    if not CACHE_FILE.exists():
        return None
    try:
        data = json.loads(CACHE_FILE.read_text(encoding='utf-8'))
    except Exception:
        return None
    for key, entry in data.items():
        if isinstance(entry, dict) and 'toots' in entry:
            try:
                if toot_url in entry['toots']:
                    return normalize_path(key)
            except Exception:
                continue
    return None

def parse_post_date(md_path: pathlib.Path) -> datetime.date:
    # Try front matter date line first; fallback to filename.
    try:
        with md_path.open('r', encoding='utf-8') as f:
            for i in range(40):
                line = f.readline()
                if not line:
                    break
                if line.startswith('---') and i > 0:
                    break
                m = DATE_LINE_RE.match(line)
                if m:
                    return datetime.date.fromisoformat(m.group(2))
    except Exception:
        pass
    # Filename pattern YYYY-MM-DD-...
    m = re.match(r'(\d{4})-(\d{2})-(\d{2})-', md_path.name)
    if m:
        try:
            return datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except Exception:
            return datetime.date.min
    return datetime.date.min

def post_needs_masto_id(md_path: pathlib.Path) -> bool:
    try:
        with md_path.open('r', encoding='utf-8') as f:
            delim = 0
            for i in range(120):
                line = f.readline()
                if not line:
                    break
                if line.startswith('---'):
                    delim += 1
                    if delim == 2:
                        break
                    continue
                if RE_MASTO.match(line):
                    val = RE_MASTO.match(line).group(1).strip().lower()
                    if val in ('', 'null', 'none'):  # needs update
                        return True
                    return False
        # No mastodon-post-id line found -> needs one
        return True
    except Exception:
        return False

def heuristic_recent_post_path() -> str | None:
    files = candidate_files()
    candidates = [f for f in files if post_needs_masto_id(f)]
    if not candidates:
        return None
    candidates.sort(key=lambda f: parse_post_date(f), reverse=True)
    top = candidates[0]
    return normalize_path(derive_slug_path(top))

def update_front_matter(md_path: pathlib.Path, toot_id: str) -> bool:
    text = md_path.read_text(encoding='utf-8')
    if not text.startswith('---'):
        log(f"File lacks front matter: {md_path}")
        return False
    parts = text.split('---', 2)
    if len(parts) < 3:
        log(f"Malformed front matter in {md_path}")
        return False
    _blank, fm, rest = parts
    lines = fm.splitlines()
    found = False
    changed = False
    new_lines = []
    for line in lines:
        m = RE_MASTO.match(line)
        if m:
            found = True
            current = m.group(1).strip()
            if current != toot_id:
                new_lines.append(f"mastodon-post-id: {toot_id}")
                changed = True
            else:
                new_lines.append(line)
            continue
        new_lines.append(line)
    if not found:
        new_lines.append(f"mastodon-post-id: {toot_id}")
        changed = True
    if changed:
        new_fm = '\n'.join(new_lines) + '\n'
        new_text = f"---{new_fm}---{rest}"
        md_path.write_text(new_text, encoding='utf-8')
        log(f"Updated mastodon-post-id in {md_path}")
    else:
        log(f"No change needed for {md_path}")
    return changed

def main():
    toot_url = os.environ.get('TOOT_URL','').strip()
    item_url = os.environ.get('ITEM_URL','').strip()
    item_id = os.environ.get('ITEM_ID','').strip()
    if not toot_url:
        log('No TOOT_URL provided; exiting (no toot this run).')
        return 0
    toot_id = extract_toot_id(toot_url)
    if not toot_id:
        log('Could not extract toot id; aborting.')
        return 0
    canonical_path = normalize_path(item_url or item_id)
    if not canonical_path:
        # Attempt cache mapping
        cache_path = load_cache_mapping_for_toot(toot_url)
        if cache_path:
            canonical_path = cache_path
            log(f'Resolved path via cache: {canonical_path}')
        else:
            heuristic = heuristic_recent_post_path()
            if heuristic:
                canonical_path = heuristic
                log(f'Resolved path via heuristic recent post: {canonical_path}')
            else:
                log('Could not resolve canonical path (no inputs, cache miss, heuristic miss); aborting.')
                return 0
    md = find_post_file(canonical_path)
    if not md:
        log(f"No markdown file matched canonical path {canonical_path}; aborting.")
        return 0
    changed = update_front_matter(md, toot_id)
    gha_out = os.environ.get('GITHUB_OUTPUT')
    if gha_out:
        with open(gha_out,'a',encoding='utf-8') as f:
            f.write(f"frontmatter_updated={'true' if changed else 'false'}\n")
    return 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:
        log(f"Unexpected error: {e}")
        sys.exit(1)
