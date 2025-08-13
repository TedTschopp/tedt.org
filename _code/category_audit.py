#!/usr/bin/env python3
"""Category audit & listing utility.

Usage:
  python _code/category_audit.py                 # Print audit report
  python _code/category_audit.py list <cats...>  # List files whose front matter includes each category

Audits:
  * Enumerates distinct categories across all Markdown posts in _posts/
  * Shows which categories are missing from _data/category_styles.yml and _data/categories-on-blog.yml
  * Suggests YAML stubs for missing style mappings

List Mode:
  * Exact (case-insensitive) match first
  * Falls back to hyphen/underscore normalized match
  * Then substring fuzzy match (last resort)
"""
from __future__ import annotations

import sys
import re
import yaml
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / '_posts'
STYLE_FILE = ROOT / '_data' / 'category_styles.yml'
BLOG_FILE = ROOT / '_data' / 'categories-on-blog.yml'

def read_front_matter(path: Path) -> dict:
    """Return YAML front matter dict or empty dict.

    We read line-by-line to avoid greedy regex edge cases and only consider
    a front-matter block if the file starts with '---'.
    """
    try:
        with path.open('r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception:
        return {}
    if not lines or not lines[0].strip() == '---':
        return {}
    fm_lines = []
    for line in lines[1:]:
        if line.strip() == '---':
            break
        fm_lines.append(line)
    if not fm_lines:
        return {}
    try:
        data = yaml.safe_load(''.join(fm_lines)) or {}
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}

def collect_categories(include_files: bool = False):
    counts: Counter[str] = Counter()
    file_map: dict[str, set[Path]] = defaultdict(set)
    for md in POSTS_DIR.rglob('*.md'):
        fm = read_front_matter(md)
        if not fm:
            continue
        cats: list[str] = []
        if isinstance(fm.get('categories'), (list, tuple)):
            cats.extend(fm['categories'])
        if isinstance(fm.get('category'), str):
            cats.append(fm['category'])
        for raw in cats:
            if not raw:
                continue
            cat = str(raw).strip()
            if not cat:
                continue
            counts[cat] += 1
            if include_files:
                file_map[cat].add(md.relative_to(ROOT))
    if include_files:
        return counts, file_map
    return counts

def load_yaml(path: Path):
    if not path.exists():
        return None
    try:
        with path.open('r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception:
        return None

def norm(s: str) -> str:
    return re.sub(r'[\s_]+', '-', s.strip().lower())

def audit():
    counts = collect_categories()
    styles = load_yaml(STYLE_FILE) or {}
    blog_entries = load_yaml(BLOG_FILE) or []

    style_norm = {norm(k): k for k in (styles.keys() if isinstance(styles, dict) else [])}
    blog_norm = {}
    if isinstance(blog_entries, list):
        for entry in blog_entries:
            if isinstance(entry, dict) and 'category' in entry:
                blog_norm[norm(str(entry['category']))] = entry['category']

    missing_styles = []
    missing_blog = []
    for c in sorted(counts.keys(), key=str.lower):
        nc = norm(c)
        if nc not in style_norm:
            missing_styles.append(c)
        if nc not in blog_norm:
            missing_blog.append(c)

    unused_styles = [orig for nkey, orig in style_norm.items() if nkey not in {norm(c) for c in counts}]
    unused_blog = [orig for nkey, orig in blog_norm.items() if nkey not in {norm(c) for c in counts}]

    print("=== CATEGORY AUDIT REPORT ===")
    print(f"Total distinct categories: {len(counts)}\n")
    print("-- Usage (descending) --")
    for cat, cnt in counts.most_common():
        print(f"{cat}: {cnt}")
    print()
    if missing_styles:
        print("-- Missing in category_styles.yml --")
        for c in missing_styles:
            print(c)
        print()
    if missing_blog:
        print("-- Missing in categories-on-blog.yml --")
        for c in missing_blog:
            print(c)
        print()
    if unused_styles:
        print("-- Unused style mappings --")
        for c in unused_styles:
            print(c)
        print()
    if unused_blog:
        print("-- Unused blog data categories --")
        for c in unused_blog:
            print(c)
        print()
    if missing_styles:
        print("-- Suggested style YAML additions --")
        for c in missing_styles:
            slug = re.sub(r'[^a-zA-Z0-9]+','-', c).strip('-')
            print(f"{c}:\n  class: {slug}-Post")
        print()
    print("Audit complete.")

def list_categories(targets: list[str]):
    counts, file_map = collect_categories(include_files=True)
    norm_lookup = {norm(k): k for k in file_map}
    print("=== CATEGORY FILE LIST ===")
    for t in targets:
        key = norm(t)
        matches = []
        # Exact normalized match
        if key in norm_lookup:
            matches.append(norm_lookup[key])
        # Hyphen/underscore swap already normalized; attempt fuzzy if not found
        if not matches:
            matches = [orig for nk, orig in norm_lookup.items() if key in nk]
        if not matches:
            print(f"\n{t}: (no matching category)")
            continue
        for m in matches:
            files = sorted(str(p) for p in file_map[m])
            print(f"\n{m} ({counts[m]} posts):")
            for f in files:
                print(f"  - {f}")
    print("\nDone.")

def main(argv: list[str]) -> int:
    if len(argv) > 1 and argv[1].lower() == 'list':
        cats = [c for c in argv[2:] if c.strip()]
        if not cats:
            print("Provide categories after 'list'. Example: python _code/category_audit.py list AI Technology")
            return 1
        list_categories(cats)
        return 0
    audit()
    return 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
