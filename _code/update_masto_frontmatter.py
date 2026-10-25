#!/usr/bin/env python3
"""Retired heuristic writer; verified mappings now come from mastodon_sync.py."""
import os
import sys

if __name__ == '__main__':
    if not os.environ.get('TOOT_URL'):
        print('[update-masto] No TOOT_URL provided; nothing to update.')
    else:
        sys.exit('Use mastodon_sync.py reconcile --write to verify the account, canonical article, and thread before changing front matter.')
