#!/usr/bin/env python3
"""
update_readme_toc.py

Regenerates the ordered Table of Contents section in README.md.

Behavior:
1. Scans README.md for top-level (##) and selected subsection headings to include.
2. Rebuilds the numbered list under the '## Table of Contents' header.
3. Preserves existing indentation (3 spaces before nested items) and anchor formatting.
4. Does not modify any other content; aborts if the pattern boundaries cannot be found.

Anchor Generation:
- Lowercase
- Replace spaces with '-'
- Remove characters not alphanumeric, dash, or underscore
- Collapse consecutive dashes

Usage:
    python _code/update_readme_toc.py --write
    (Without --write prints the new TOC to stdout.)

Limitations:
- Designed specifically for current README structure.
- Will ignore headings inside fenced code blocks.

"""
from __future__ import annotations
import re
import sys
from pathlib import Path

README_PATH = Path(__file__).parent.parent / "README.md"
TOC_HEADER = "## Table of Contents"

# Headings to include: H2 (##) only for brevity, but we treat first H1 as root item.
HEADING_PATTERN = re.compile(r"^(#{1,3})\s+(.*)$")
CODE_FENCE_PATTERN = re.compile(r"^```")

EXCLUDE_ANCHORS = {
    "table-of-contents"  # We'll insert this manually as #table-of-contents reference
}

def slugify(title: str) -> str:
    slug = title.strip().lower()
    slug = re.sub(r"[\s]+", "-", slug)
    slug = re.sub(r"[^a-z0-9\-_]", "", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug

def extract_headings(lines: list[str]) -> list[tuple[int, str, str]]:
    headings = []
    in_code = False
    for line in lines:
        if CODE_FENCE_PATTERN.match(line.strip()):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = HEADING_PATTERN.match(line)
        if m:
            level = len(m.group(1))
            title = m.group(2).strip()
            if level > 3:
                continue  # skip deeper headings
            anchor = slugify(title)
            if anchor in EXCLUDE_ANCHORS:
                continue
            headings.append((level, title, anchor))
    return headings

def build_toc(headings: list[tuple[int, str, str]], include_h3: bool = True) -> list[str]:
    """Build TOC lines.
    First H1 becomes item 1. H2 headings are numbered sequentially. Optional H3 headings become nested bullets.
    """
    if not headings:
        return []
    toc_lines: list[str] = []
    toc_lines.append(f"1. [{headings[0][1]}](#{headings[0][2]})")
    sub_counter = 1
    last_h2_index = None
    for level, title, anchor in headings[1:]:
        if level == 2:
            sub_counter += 1
            toc_lines.append(f"   {sub_counter}. [{title}](#{anchor})")
            last_h2_index = sub_counter
        elif level == 3 and include_h3:
            toc_lines.append(f"      - [{title}](#{anchor})")
    return toc_lines


def find_toc_block(lines: list[str]) -> tuple[int, int] | None:
    start = None
    for i, line in enumerate(lines):
        if line.strip() == TOC_HEADER:
            # TOC content starts after this header until first blank line followed by heading or next H2
            start_content = i + 1
            # Skip initial blank lines
            while start_content < len(lines) and lines[start_content].strip() == "":
                start_content += 1
            # Collect until a blank line followed by '## '
            end = start_content
            while end < len(lines):
                if lines[end].startswith("## "):
                    break
                end += 1
            return start_content, end
    return None


def main(write: bool = False, include_h3: bool = True, check: bool = False) -> int:
    if not README_PATH.exists():
        print("README.md not found", file=sys.stderr)
        return 1
    text = README_PATH.read_text(encoding="utf-8").splitlines()
    headings = extract_headings(text)
    toc_lines = build_toc(headings, include_h3=include_h3)
    block = find_toc_block(text)
    if block is None:
        print("Could not locate TOC block boundaries", file=sys.stderr)
        return 2
    start, end = block
    new_content = text[:start] + ["", *toc_lines, ""] + text[end:]
    if check:
        # Compare existing block with newly generated lines (ignoring leading/trailing blanks)
        existing = [l for l in text[start:end] if l.strip()]
        generated = [l for l in toc_lines if l.strip()]
        if existing == generated:
            print("TOC OK (no changes needed).")
            return 0
        else:
            print("TOC drift detected. Run with --write to update.")
            return 3
    if write:
        README_PATH.write_text("\n".join(new_content) + "\n", encoding="utf-8")
        print("README TOC updated.")
    else:
        print("\n".join(toc_lines))
    return 0

if __name__ == "__main__":
    write_flag = "--write" in sys.argv
    no_h3_flag = "--no-h3" in sys.argv
    check_flag = "--check" in sys.argv
    if "--help" in sys.argv:
        print("Usage: update_readme_toc.py [--write] [--no-h3] [--check]\n" \
              "  --write  Persist updated TOC into README.md\n" \
              "  --no-h3  Exclude third-level headings from TOC\n" \
              "  --check  Exit non-zero if TOC drift detected (CI/pre-commit use)")
        sys.exit(0)
    sys.exit(main(write=write_flag, include_h3=not no_h3_flag, check=check_flag))
