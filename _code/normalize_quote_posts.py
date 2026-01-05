#!/usr/bin/env python3
"""Normalize quote post filenames and front matter (Phase 1)

Actions:
1. Expand year-only -> YYYY-01-01
2. Expand year-month -> YYYY-MM-01
3. Convert negative (BC) year `-431` -> `0431-01-01` and add original-date: '-431'
4. Pad years < 1000 to four digits
5. Skip files with blank / century / vague dates (already moved to phase2)
6. Prefix filenames with normalized date (YYYY-MM-DD-)
7. Collapse consecutive initials in slug by removing periods (e.g., C.S.-Lewis -> CSLewis or CS-Lewis?).
   We retain hyphens already present and simply strip periods, then collapse multiple hyphens.
8. Add redirect_from preserving old (pre-rename) slug URL if slug changed OR filename gained a date prefix.

Idempotent: running multiple times should not duplicate redirects or re-alter already normalized dates.

Assumptions:
* Permalink pattern is '/:title/' (from _config.yml), so the output path is based on filename slug.
* Phase 2 files reside under `_posts/Quotes/phase2/` and are ignored.
* Existing front matter delimited by '---' start and end.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUOTES_DIR = ROOT / '_posts' / 'Quotes'
PHASE2 = QUOTES_DIR / 'phase2'

DATE_RE_FULL = re.compile(r'^(?P<y>\d{4})-(?P<m>\d{2})-(?P<d>\d{2})$')
DATE_RE_YM = re.compile(r'^(?P<y>\d{4})-(?P<m>\d{2})$')
DATE_RE_YEAR = re.compile(r'^(?P<y>-?\d{1,4})$')
CENTURY_RE = re.compile(r'\bcentury\b', re.IGNORECASE)


def normalize_date(raw: str) -> tuple[str | None, str | None]:
    """Return (normalized_date, original_date_if_added) or (None, None) if skip.
    Skip if blank, contains 'century', or has non-supported pattern.
    """

    value = raw.strip()
    if not value:
        return None, None
    if CENTURY_RE.search(value):  # defer to phase 2
        return None, None
    # full date already normalized
    if DATE_RE_FULL.match(value):
        return value, None
    m = DATE_RE_YM.match(value)
    if m:
        return f"{m.group('y')}-{m.group('m')}-01", value
    m = DATE_RE_YEAR.match(value)
    if m:
        y = m.group('y')
        orig = value if ('-' in y or len(y) != 4) else None
        if y.startswith('-'):
            y = y.lstrip('-')  # absolute per directive
        y = y.zfill(4)
        return f"{y}-01-01", orig
    return None, None


def collapse_initials(slug: str) -> str:
    # Remove periods from sequences like C.S.-Lewis -> CS-Lewis (keep hyphens)
    new = slug.replace('.', '')
    # Collapse multiple hyphens
    new = re.sub(r'-{2,}', '-', new)
    return new


def parse_front_matter(text: str):
    if not text.startswith('---'):
        return None, None, None
    parts = text.split('\n')
    fm_end_idx = None
    for i, line in enumerate(parts[1:], 1):
        if line.strip() == '---':
            fm_end_idx = i
            break
    if fm_end_idx is None:
        return None, None, None
    fm_lines = parts[1:fm_end_idx]
    body = '\n'.join(parts[fm_end_idx + 1 :])
    return fm_lines, fm_end_idx, body


def update_front_matter(
    lines: list[str],
    normalized_date: str,
    original_date: str | None,
    old_slug: str,
    new_slug: str,
    add_redirect: bool,
) -> list[str]:
    out = []
    have_redirect = False
    have_original_date = any(l.startswith('original-date:') for l in lines)
    for line in lines:
        if line.startswith('date:'):
            out.append(f'date: {normalized_date}')
            if original_date and not have_original_date:
                out.append(f'original-date: {original_date}')
        elif line.startswith('redirect_from:'):
            have_redirect = True
            out.append(line)
        else:
            out.append(line)

    if add_redirect:
        if not have_redirect:
            out.append('redirect_from:')
            out.append(f'  - /{old_slug}/')
        else:
            # append if not already present
            key = f'  - /{old_slug}/'
            if key not in out:
                out.append(key)

    return out


def main():
    changed = 0
    skipped = 0
    for path in sorted(QUOTES_DIR.glob('*.md')):
        if path.is_dir():
            continue
        if PHASE2 in path.parents:
            continue

        original_name = path.name
        slug = original_name[:-3]  # drop .md

        # If already has date prefix (YYYY-MM-DD-)
        m = re.match(r'^(\d{4}-\d{2}-\d{2})-(.+)$', slug)
        if m:
            current_slug_part = m.group(2)
        else:
            current_slug_part = slug

        text = path.read_text(encoding='utf-8')
        fm_lines, _fm_end_idx, body = parse_front_matter(text)
        if fm_lines is None:
            continue

        # Extract date line
        raw_date = ''
        for l in fm_lines:
            if l.startswith('date:'):
                raw_date = l.split(':', 1)[1].strip()
                break

        normalized_date, original_date = normalize_date(raw_date)
        if normalized_date is None:
            skipped += 1
            continue

        # slug normalization (remove periods)
        new_slug_part = collapse_initials(current_slug_part)
        slug_changed = new_slug_part != current_slug_part

        new_filename = f'{normalized_date}-{new_slug_part}.md'
        add_redirect = slug_changed or not m  # always add redirect when adding date prefix

        new_fm_lines = update_front_matter(
            fm_lines,
            normalized_date,
            original_date,
            current_slug_part,
            new_slug_part,
            add_redirect,
        )
        new_content = '---\n' + '\n'.join(new_fm_lines) + '\n---\n' + body.lstrip()

        # Write to new file path (avoid overwrite if same)
        target_path = path.with_name(new_filename)
        if target_path != path:
            target_path.write_text(new_content, encoding='utf-8')
            path.unlink()
        else:
            path.write_text(new_content, encoding='utf-8')

        changed += 1

    print(f'Changed: {changed}, Skipped (phase2/century/blank): {skipped}')


if __name__ == '__main__':
    main()
