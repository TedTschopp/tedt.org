#!/usr/bin/env python3
"""Compatibility entry point for verified reconciliation, never unverified ID copying."""
import argparse
import sys
from mastodon_sync import main, SyncError

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--gha', action='store_true')
    args = parser.parse_args()
    command = ['reconcile'] if args.write else ['audit']
    if args.write: command.append('--write')
    try:
        sys.exit(main(command))
    except SyncError as exc:
        sys.exit(str(exc))
