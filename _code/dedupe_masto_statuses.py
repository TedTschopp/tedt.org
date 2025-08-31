#!/usr/bin/env python3
"""Detect and optionally delete duplicate Mastodon statuses for your account.

Duplicates are defined (by default) as multiple statuses that reference the same
canonical site URL (e.g., https://tedt.org/whatever/). The script keeps one copy
and (optionally) deletes the extras. It rate‑limits deletions to avoid
overwhelming the instance.

Features:
  * Dry-run by default (no deletions unless --write specified)
  * Auto-detect your account id via /api/v1/accounts/verify_credentials
  * Pagination over recent statuses (configurable pages)
  * URL canonicalization (lowercased domain, ensures trailing slash, strips query/fragment)
  * Optional detection of purely identical status text duplicates (--also-identical)
  * Safety limits: --max-delete (default 10), --min-age-hours to avoid deleting very recent posts
  * Throttled deletes with --delay seconds between deletions (default 3)
  * Flexible domain filter (default tedt.org) and optional extra domains

Requirements:
    * Environment variable MASTODON_TOKEN with scope read:accounts read:statuses (and write:statuses if --write)
  * Instance base URL (defaults to https://tschopp.net but override with --instance)

Usage examples:
  Dry run, scan first 5 pages (≈200 statuses):
    python3 _code/dedupe_masto_statuses.py

  Actually delete duplicates (up to 5), 2 second delay:
    python3 _code/dedupe_masto_statuses.py --write --max-delete 5 --delay 2

  Include identical (no-link) duplicates and scan 10 pages:
    python3 _code/dedupe_masto_statuses.py --pages 10 --also-identical --write

Exit codes:
  0 success / dry-run complete
  2 configuration error (missing token)
  3 API error
"""
from __future__ import annotations
import argparse, os, sys, time, json, re, urllib.request, urllib.error, urllib.parse, datetime as dt
from typing import Dict, List, Tuple

DEFAULT_INSTANCE = "https://tschopp.net"
TDT_DOMAIN = "tedt.org"
URL_RE = re.compile(r'https?://[^\s)]+')


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--instance', default=DEFAULT_INSTANCE, help='Mastodon base URL')
    p.add_argument('--pages', type=int, default=5, help='Pages of statuses to scan (40 per page)')
    p.add_argument('--delay', type=float, default=3.0, help='Seconds between deletions')
    p.add_argument('--max-delete', type=int, default=10, help='Safety cap on deletions this run')
    p.add_argument('--write', action='store_true', help='Actually perform deletions')
    p.add_argument('--keep', choices=['oldest','newest'], default='oldest', help='Which status to retain among duplicates')
    p.add_argument('--domain', action='append', default=[TDT_DOMAIN], help='Domain(s) to treat as canonical site (repeatable)')
    p.add_argument('--also-identical', action='store_true', help='Also delete pure textual duplicates (identical content)')
    p.add_argument('--min-age-hours', type=float, default=1.0, help='Do not delete statuses younger than this many hours')
    p.add_argument('--verbose', action='store_true', help='Verbose logging')
    return p.parse_args()


def api_request(token: str, url: str, method: str='GET'):
    req = urllib.request.Request(url, method=method)
    req.add_header('Authorization', f'Bearer {token}')
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read().decode()
            if r.getheader('Content-Type','').startswith('application/json'):
                return json.loads(data), r.headers
            return data, r.headers
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors='ignore')
        raise SystemExit(f"API error {e.code} {url}: {body}")


def get_account_id(token: str, instance: str) -> str:
    data, _ = api_request(token, f'{instance}/api/v1/accounts/verify_credentials')
    return str(data['id'])


def fetch_status_page(token: str, instance: str, account_id: str, max_id: str|None=None):
    params = {'limit': '40'}
    if max_id:
        params['max_id'] = max_id
    q = urllib.parse.urlencode(params)
    url = f'{instance}/api/v1/accounts/{account_id}/statuses?{q}'
    data, headers = api_request(token, url)
    next_max = None
    link = headers.get('Link')
    if link:
        # Parse rel="next"
        for part in link.split(','):
            if 'rel="next"' in part:
                m = re.search(r'<([^>]+)>', part)
                if m:
                    parsed = urllib.parse.urlparse(m.group(1))
                    qs = urllib.parse.parse_qs(parsed.query)
                    if 'max_id' in qs:
                        next_max = qs['max_id'][0]
    return data, next_max


def canonicalize_site_url(raw: str) -> str|None:
    try:
        u = urllib.parse.urlparse(raw)
        if not u.scheme.startswith('http'):
            return None
        host = u.hostname or ''
        path = u.path or '/'
        # ensure trailing slash for directories
        if not path.endswith('/'):
            path += '/'
        return host.lower() + path
    except Exception:
        return None


def extract_site_urls(text: str, domains: List[str]) -> List[str]:
    urls = []
    for m in URL_RE.finditer(text or ''):
        c = canonicalize_site_url(m.group(0))
        if not c:
            continue
        for d in domains:
            if c.startswith(d.lower()+"/"):
                urls.append(c)
                break
    return urls


def iso_to_dt(iso: str) -> dt.datetime:
    # Mastodon returns ISO with Z or offset; rely on fromisoformat (Python 3.11+ handles offset)
    try:
        return dt.datetime.fromisoformat(iso.replace('Z','+00:00'))
    except Exception:
        return dt.datetime.min.replace(tzinfo=dt.timezone.utc)


def main():
    args = parse_args()
    token = os.environ.get('MASTODON_TOKEN')
    if not token and args.write:
        print('ERROR: --write specified but MASTODON_TOKEN not set', file=sys.stderr)
        return 2
    if not token:
        print('WARNING: No MASTODON_TOKEN set; attempting public endpoints (may fail); dry-run only.')
    # Account id (needed even for dry-run; requires auth). Abort gracefully if missing.
    if not token:
        print('Cannot resolve account id without MASTODON_TOKEN; aborting dry-run.')
        return 2
    account_id = get_account_id(token, args.instance)
    if args.verbose:
        print(f'Account id: {account_id}')
    all_statuses = []
    max_id = None
    for page in range(args.pages):
        data, max_id = fetch_status_page(token, args.instance, account_id, max_id=max_id)
        if not data:
            break
        all_statuses.extend(data)
        if args.verbose:
            print(f'Fetched page {page+1}, total {len(all_statuses)}')
        if not max_id:
            break
    # Group by site URL
    by_url: Dict[str, List[dict]] = {}
    by_text: Dict[str, List[dict]] = {}
    now = dt.datetime.now(dt.timezone.utc)
    min_age_delta = dt.timedelta(hours=args.min_age_hours)
    for st in all_statuses:
        content = st.get('content') or ''  # HTML
        # Remove HTML tags
        plain = re.sub(r'<[^>]+>','', content).strip()
        urls = extract_site_urls(plain, args.domain)
        # Deduplicate urls in a single status
        for u in sorted(set(urls)):
            by_url.setdefault(u, []).append(st)
        if args.also_identical:
            if len(plain) > 0:
                by_text.setdefault(plain, []).append(st)
    dup_candidates: List[Tuple[str,List[dict],str]] = []  # key, statuses, type
    for k, lst in by_url.items():
        if len(lst) > 1:
            dup_candidates.append((k, lst, 'url'))
    if args.also_identical:
        for k, lst in by_text.items():
            if len(lst) > 1:
                dup_candidates.append((k, lst, 'text'))
    to_delete: List[dict] = []
    for key, sts, kind in dup_candidates:
        # Sort oldest first by created_at
        sorted_sts = sorted(sts, key=lambda s: s.get('created_at',''))
        keep = sorted_sts[0] if args.keep=='oldest' else sorted_sts[-1]
        for s in sorted_sts:
            created = iso_to_dt(s.get('created_at','1970-01-01T00:00:00Z'))
            if s is keep:
                continue
            if now - created < min_age_delta:
                continue  # too new to delete
            to_delete.append(s)
    # Deduplicate deletion list by id
    seen_ids = set()
    unique_delete = []
    for s in to_delete:
        sid = s.get('id')
        if sid and sid not in seen_ids:
            seen_ids.add(sid)
            unique_delete.append(s)
    if len(unique_delete) > args.max_delete:
        unique_delete = unique_delete[:args.max_delete]
    print(f"Scanned statuses: {len(all_statuses)}")
    print(f"Duplicate groups detected: {len(dup_candidates)}")
    print(f"Planned deletions (after filters & caps): {len(unique_delete)} (cap {args.max_delete})")
    for s in unique_delete:
        plain = re.sub(r'<[^>]+>','', (s.get('content') or ''))
        preview = (plain[:100] + '…') if len(plain)>100 else plain
        print(f" - {s.get('id')} created {s.get('created_at')} :: {preview}")
    if not args.write:
        print("Dry-run complete. Re-run with --write to delete.")
        return 0
    # Perform deletions
    for idx, s in enumerate(unique_delete, start=1):
        sid = s.get('id')
        url = f"{args.instance}/api/v1/statuses/{sid}"
        try:
            api_request(token, url, method='DELETE')
            print(f"Deleted {sid} ({idx}/{len(unique_delete)})")
        except SystemExit as e:
            print(f"ERROR deleting {sid}: {e}")
        time.sleep(args.delay)
    print("Deletion pass complete.")
    return 0


if __name__ == '__main__':
    sys.exit(main())
