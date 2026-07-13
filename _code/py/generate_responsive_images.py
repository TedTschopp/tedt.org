#!/usr/bin/env python3
"""Build deterministic responsive WebP image sets for the Jekyll site.

The original public files under ``img/`` and ``RPG/`` are always retained and remain the canonical
``src`` fallback. Smaller variants are written beneath
``img/generated/responsive/`` and their intrinsic dimensions are recorded in
``_data/responsive_images.json`` for Liquid templates and the content filter.

Requirements: Pillow with WebP support and the local ``cwebp`` executable.

Usage:
  python3 _code/py/generate_responsive_images.py
  python3 _code/py/generate_responsive_images.py --check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, features


ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = ROOT / "img"
PUBLIC_SOURCE_ROOTS = (SOURCE_ROOT, ROOT / "RPG")
OUTPUT_ROOT = SOURCE_ROOT / "generated" / "responsive"
MANIFEST_PATH = ROOT / "_data" / "responsive_images.json"
TARGET_WIDTHS = (480, 768, 1200, 1456)
WEBP_QUALITY = 82


def source_images() -> list[Path]:
    """Return public WebP sources, excluding this script's generated output."""
    paths = (
        path
        for source_root in PUBLIC_SOURCE_ROOTS
        for path in source_root.rglob("*.webp")
        if OUTPUT_ROOT not in path.parents
    )
    return sorted(paths, key=lambda path: path.as_posix().casefold())


def url_for(path: Path) -> str:
    return "/" + path.relative_to(ROOT).as_posix()


def variant_path(source: Path, width: int) -> Path:
    relative = (
        source.relative_to(SOURCE_ROOT)
        if SOURCE_ROOT in source.parents
        else source.relative_to(ROOT)
    )
    return OUTPUT_ROOT / relative.parent / f"{relative.stem}--{width}w.webp"


def dimensions(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        if image.format != "WEBP":
            raise ValueError(f"expected WebP data: {path}")
        return image.width, image.height


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def make_variant(cwebp: str, source: Path, destination: Path, width: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix=f".{destination.stem}-", suffix=".webp", dir=destination.parent, delete=False
    ) as temporary:
        temporary_path = Path(temporary.name)
    try:
        subprocess.run(
            [
                cwebp,
                "-quiet",
                "-q",
                str(WEBP_QUALITY),
                "-m",
                "6",
                "-exact",
                "-resize",
                str(width),
                "0",
                str(source),
                "-o",
                str(temporary_path),
            ],
            check=True,
        )
        temporary_path.replace(destination)
    finally:
        temporary_path.unlink(missing_ok=True)


def expected_manifest(cwebp: str | None, generate: bool) -> tuple[dict, int]:
    images: dict[str, dict] = {}
    generated = 0

    for source in source_images():
        source_width, source_height = dimensions(source)
        candidates: list[dict[str, int | str]] = []

        for target_width in TARGET_WIDTHS:
            if target_width >= source_width:
                continue
            target = variant_path(source, target_width)
            # When one resize dimension is zero, cwebp preserves aspect ratio
            # and rounds the inferred dimension upward to a whole pixel.
            target_height = (source_height * target_width + source_width - 1) // source_width
            if generate:
                if cwebp is None:
                    raise RuntimeError("cwebp is required to generate variants")
                make_variant(cwebp, source, target, target_width)
                actual_width, actual_height = dimensions(target)
                if (actual_width, actual_height) != (target_width, target_height):
                    raise RuntimeError(
                        f"unexpected dimensions for {target}: "
                        f"{actual_width}x{actual_height}; expected {target_width}x{target_height}"
                    )
                generated += 1
            candidates.append(
                {"path": url_for(target), "width": target_width, "height": target_height}
            )

        # The untouched source is the largest candidate and the durable fallback.
        candidates.append(
            {"path": url_for(source), "width": source_width, "height": source_height}
        )
        images[url_for(source)] = {
            "src": url_for(source),
            "width": source_width,
            "height": source_height,
            "source_sha256": sha256(source),
            "variants": candidates,
        }

    return (
        {
            "schema_version": 1,
            "target_widths": list(TARGET_WIDTHS),
            "quality": WEBP_QUALITY,
            "images": images,
        },
        generated,
    )


def validate_manifest(expected: dict) -> list[str]:
    errors: list[str] = []
    if not MANIFEST_PATH.exists():
        return [f"missing manifest: {MANIFEST_PATH.relative_to(ROOT)}"]
    try:
        current = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return [f"invalid manifest: {error}"]
    if current != expected:
        errors.append("manifest is stale; run the generator")

    for image in expected["images"].values():
        for variant in image["variants"][:-1]:
            variant_file = ROOT / str(variant["path"]).lstrip("/")
            if not variant_file.exists():
                errors.append(f"missing variant: {variant['path']}")
                continue
            if dimensions(variant_file) != (variant["width"], variant["height"]):
                errors.append(f"incorrect variant dimensions: {variant['path']}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true", help="validate the manifest and generated files"
    )
    args = parser.parse_args()

    if not features.check("webp"):
        print("ERROR: Pillow does not have WebP support", file=sys.stderr)
        return 1

    cwebp = shutil.which("cwebp")
    if not args.check and not cwebp:
        print("ERROR: cwebp is not installed or not on PATH", file=sys.stderr)
        return 1

    expected, generated = expected_manifest(cwebp, generate=not args.check)
    if args.check:
        errors = validate_manifest(expected)
        if errors:
            for error in errors:
                print(f"ERROR: {error}", file=sys.stderr)
            return 1
        variants = sum(len(image["variants"]) - 1 for image in expected["images"].values())
        print(f"OK: {len(expected['images'])} WebP sources and {variants} generated variants")
        return 0

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps(expected, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {MANIFEST_PATH.relative_to(ROOT)} for {len(expected['images'])} sources; "
        f"generated {generated} variants without modifying originals."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
