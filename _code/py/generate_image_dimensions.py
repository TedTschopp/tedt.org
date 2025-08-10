#!/usr/bin/env python3
"""
Scan Jekyll posts for front matter 'image:' fields, locate the corresponding image file, extract width/height,
and write them back into the front matter as image_width / image_height (integers) if not already present or changed.

Supports .png, .jpg/.jpeg, .webp, .gif, .avif (if Pillow compiled with support). Falls back to ImageMagick 'identify' if Pillow fails.

Idempotent: running multiple times will not duplicate keys or reorder unrelated front matter keys.
Backups: writes a sibling file with suffix .bak once per run BEFORE modifying.

Usage:
  python3 _code/py/generate_image_dimensions.py [--dry-run]

Assumptions:
  * Repository root is current working directory (script resolves paths relative to it).
  * Images referenced without scheme (no '://') are local. Leading '/' means repository root; otherwise treat path as relative to repo root.
  * External (absolute URL) images are skipped.

Exit codes:
  0 success (even if some images missing)
  1 unexpected exception
"""
from __future__ import annotations
import sys, re, shutil
try:
    import yaml  # type: ignore
except Exception as e:  # pragma: no cover
    print("ERROR: PyYAML not installed. Install with 'pip install pyyaml' and re-run.", file=sys.stderr)
    sys.exit(1)
from pathlib import Path
from typing import Optional, Tuple

DRY_RUN = '--dry-run' in sys.argv
ROOT = Path(__file__).resolve().parents[2]  # repo root:  _code/py/ -> _code -> repo
POSTS_DIR = ROOT / '_posts'
IMG_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'}

try:
    from PIL import Image  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    Image = None  # type: ignore

IDENTIFY_CMD = shutil.which('identify')

FRONT_MATTER_BOUNDARY = re.compile(r'^---\s*$')


def parse_front_matter(text: str) -> Tuple[dict, str]:
    """Return (front_matter_dict, body). If no front matter, return empty dict."""
    lines = text.splitlines(keepends=True)
    if not lines or not FRONT_MATTER_BOUNDARY.match(lines[0]):
        return {}, text
    # find closing '---'
    for i in range(1, len(lines)):
        if FRONT_MATTER_BOUNDARY.match(lines[i]):
            yaml_block = ''.join(lines[1:i])
            body = ''.join(lines[i+1:])
            data = yaml.safe_load(yaml_block) or {}
            return data, body
    return {}, text  # no closing boundary


def dump_front_matter(data: dict) -> str:
    return '---\n' + yaml.safe_dump(data, sort_keys=False).strip() + '\n---\n'


def resolve_image_path(image_field: str) -> Optional[Path]:
    if not image_field:
        return None
    image_field = image_field.strip().strip('"').strip("'")
    if '://' in image_field:  # external URL
        return None
    # drop leading slash for local FS resolution
    rel = image_field[1:] if image_field.startswith('/') else image_field
    p = ROOT / rel
    return p if p.exists() else None


def get_dimensions(p: Path) -> Optional[Tuple[int, int]]:
    # Fast path: Pillow
    if Image is not None and p.suffix.lower() in IMG_EXTS:
        try:
            with Image.open(p) as im:
                return im.width, im.height
        except Exception:
            pass
    # Fallback: identify
    if IDENTIFY_CMD:
        import subprocess, shlex
        try:
            # identify -format "%w %h" file
            result = subprocess.run([
                IDENTIFY_CMD, '-format', '%w %h', str(p)
            ], capture_output=True, text=True, check=True)
            parts = result.stdout.strip().split()
            if len(parts) == 2 and all(part.isdigit() for part in parts):
                return int(parts[0]), int(parts[1])
        except Exception:
            return None
    return None


def process_post(path: Path) -> Optional[str]:
    original = path.read_text(encoding='utf-8')
    fm, body = parse_front_matter(original)
    if not fm:
        return None  # no front matter
    image_field = fm.get('image')
    if not image_field or str(image_field).strip() in {'', '""', "''"}:
        return None  # nothing to do
    img_path = resolve_image_path(str(image_field))
    if not img_path:
        return f"SKIP (external/missing): {path.relative_to(ROOT)} -> {image_field}"
    dims = get_dimensions(img_path)
    if not dims:
        return f"WARN (no dims): {path.relative_to(ROOT)} -> {img_path}"
    w, h = dims
    updated = False
    if fm.get('image_width') != w:
        fm['image_width'] = w
        updated = True
    if fm.get('image_height') != h:
        fm['image_height'] = h
        updated = True
    if not updated:
        return f"OK (unchanged): {path.relative_to(ROOT)} ({w}x{h})"

    new_text = dump_front_matter(fm) + body.lstrip('\n')

    if DRY_RUN:
        return f"DRY (would update): {path.relative_to(ROOT)} ({w}x{h})"
    # Backup once per execution (avoid overwriting prior backups)
    backup = path.with_suffix(path.suffix + '.bak')
    if not backup.exists():
        backup.write_text(original, encoding='utf-8')
    path.write_text(new_text, encoding='utf-8')
    return f"UPDATED: {path.relative_to(ROOT)} ({w}x{h})"


def main():
    posts = sorted(POSTS_DIR.rglob('*.md'))
    results = []
    for p in posts:
        try:
            r = process_post(p)
            if r:
                results.append(r)
        except Exception as e:  # keep going
            results.append(f"ERROR: {p} -> {e}")
    for line in results:
        print(line)
    # Summary
    updated = sum(1 for l in results if l.startswith('UPDATED'))
    skipped = sum(1 for l in results if l.startswith('SKIP'))
    warns = sum(1 for l in results if l.startswith('WARN'))
    unchanged = sum(1 for l in results if l.startswith('OK'))
    print(f"\nSummary: updated={updated} unchanged={unchanged} skipped={skipped} warn={warns}")

if __name__ == '__main__':
    main()
