#!/usr/bin/env python3
"""
Detect Markdown files (Gamma World posts) whose YAML front matter starts with '---' but
does not contain a matching closing '---'. Append the closing delimiter safely.

Rules / Safety:
 - Only operate inside _posts/Gamma World/
 - A file is considered unterminated if:
     * First non-empty line is '---'
     * There is no subsequent line that is exactly '---' (optionally surrounded by whitespace)
 - If file already lacks front matter opening delimiter, ignore (we do not synthesize new front matter here).
 - Creates a timestamped .bak backup before modifying.
 - Reports all fixed files at end; exits non-zero only on unexpected IO errors.

Usage:
  python _code/close_unterminated_front_matter.py [--dry-run]

If --dry-run is passed, no files are modified; a report of would-be fixes is printed.
"""
from __future__ import annotations
import sys, argparse, shutil, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / '_posts' / 'Gamma World'

def is_unterminated(md_path: Path) -> bool:
    try:
        text = md_path.read_text(encoding='utf-8')
    except Exception:
        return False
    lines = text.splitlines()
    # Skip leading BOM/whitespace lines
    i = 0
    while i < len(lines) and not lines[i].strip():
        i += 1
    if i >= len(lines):
        return False
    if lines[i].strip() != '---':
        return False
    # Look for a terminating delimiter after the opening
    for j in range(i+1, len(lines)):
        if lines[j].strip() == '---':
            return False  # properly terminated
    return True

def fix_file(md_path: Path, dry_run: bool=False) -> bool:
    if not is_unterminated(md_path):
        return False
    if dry_run:
        return True
    backup = md_path.with_suffix(md_path.suffix + f'.bak-{int(time.time())}')
    shutil.copy2(md_path, backup)
    with md_path.open('a', encoding='utf-8') as f:
        f.write('\n---\n')
    return True

def main(argv=None):
    parser = argparse.ArgumentParser(description='Close unterminated YAML front matter blocks.')
    parser.add_argument('--dry-run', action='store_true', help='Only report files; do not modify')
    args = parser.parse_args(argv)

    if not POSTS_DIR.exists():
        print(f"Posts directory not found: {POSTS_DIR}", file=sys.stderr)
        return 2

    fixed = []
    for md in sorted(POSTS_DIR.glob('*.md')):
        try:
            if fix_file(md, dry_run=args.dry_run):
                fixed.append(md)
        except Exception as e:
            print(f"Error processing {md}: {e}", file=sys.stderr)
    if fixed:
        action = 'Would fix' if args.dry_run else 'Fixed'
        print(f"{action} {len(fixed)} file(s):")
        for f in fixed:
            print(f" - {f.relative_to(ROOT)}")
    else:
        print('No unterminated front matter blocks found.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
