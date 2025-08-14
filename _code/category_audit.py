#!/usr/bin/env python3
"""(Retired) Category audit utility.

This script is deprecated and retained only as a historical artifact.
The site now uses a unified `_data/category_registry.yml` file which
renders previous style / alias / blog metadata audits obsolete.

Future scripts should operate directly against `category_registry.yml`.
Running this script will exit with code 0 after printing a notice.
"""
import sys

def main():
    print("[deprecated] _code/category_audit.py is retired. Use category_registry.yml as single source of truth.")
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
