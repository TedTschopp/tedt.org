#!/usr/bin/env python3
"""Lightweight sanity tests for cache normalization and mastodon frontmatter update."""
import os, json, tempfile, shutil, pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).parents[2]
CODE = ROOT / '_code'
CACHE = ROOT / 'cache'
POSTS = ROOT / '_posts'

normalize = CODE / 'normalize_masto_cache.py'
update = CODE / 'update_masto_frontmatter.py'
audit = CODE / 'audit_masto_frontmatter.py'
backfill = CODE / 'backfill_masto_posts.py'


def run(cmd, env=None):
    res = subprocess.run(cmd, cwd=ROOT, env=env, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stdout)
        print(res.stderr)
        raise SystemExit(f"Command failed: {' '.join(cmd)}")
    return res.stdout


def test_normalize_dry_run():
    # ensure script runs in dry run mode
    out = run(['python3', str(normalize)], env={**os.environ, 'DRY_RUN':'1'})
    assert 'DRY-RUN' in out or 'Cache already normalized' in out


def test_update_no_inputs():
    # Should no-op gracefully without TOOT_URL
    out = run(['python3', str(update)])
    assert 'No TOOT_URL provided' in out


def test_audit_runs():
    out = run(['python3', str(audit)])
    assert 'Total posts scanned' in out


def test_backfill_dry_run_limit():
    out = run(['python3', str(backfill), '--limit', '1'])
    assert 'Backfill candidate posts:' in out
    # If there were candidates, dry-run emits completion line; if none, script exits early.
    if 'Dry-run complete' not in out:
        # Accept zero-candidate scenario as success.
        assert 'Backfill candidate posts: 0' in out


def main():
    test_normalize_dry_run()
    test_update_no_inputs()
    test_audit_runs()
    test_backfill_dry_run_limit()
    print('All lightweight tests passed.')

if __name__ == '__main__':
    main()
