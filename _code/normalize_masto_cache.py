#!/usr/bin/env python3
"""Compatibility entry point: import aliases into the shared ledger, read-only.

The original feed cache is an immutable migration input. Rewriting its keys can
cause the retired feed action to announce old items again.
"""
import sys
from mastodon_sync import main, SyncError

if __name__ == '__main__':
    print('DRY-RUN: inspect canonical aliases; legacy cache will remain unchanged.')
    try:
        sys.exit(main(['audit']))
    except SyncError as exc:
        sys.exit(str(exc))
