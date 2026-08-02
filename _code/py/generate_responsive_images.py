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
  python3 _code/py/generate_responsive_images.py --check-post-images
  python3 _code/py/generate_responsive_images.py --ensure-post-images
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = ROOT / "img"
PUBLIC_SOURCE_ROOTS = (SOURCE_ROOT, ROOT / "RPG")
OUTPUT_ROOT = SOURCE_ROOT / "generated" / "responsive"
MANIFEST_PATH = ROOT / "_data" / "responsive_images.json"
POSTS_ROOT = ROOT / "_posts"
TARGET_WIDTHS = (480, 768, 1200, 1456)
WEBP_QUALITY = 82
SITE_HOSTS = {"tedt.org", "www.tedt.org"}
IMAGE_FIELD = re.compile(r"^image:\s*(.*?)\s*$")
IMAGE_PATH_FIELD = re.compile(r"^\s+path:\s*(.*?)\s*$")


@lru_cache(maxsize=1)
def pillow_modules():
    """Load Pillow only for commands that inspect or generate image data."""
    try:
        from PIL import Image, features
    except ImportError as error:
        raise RuntimeError(
            "Pillow is required; install _code/py/requirements.txt"
        ) from error
    if not features.check("webp"):
        raise RuntimeError("Pillow does not have WebP support")
    return Image


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
    return "/" + path.resolve().relative_to(ROOT.resolve()).as_posix()


def variant_path(source: Path, width: int) -> Path:
    relative = (
        source.relative_to(SOURCE_ROOT)
        if SOURCE_ROOT in source.parents
        else source.relative_to(ROOT)
    )
    return OUTPUT_ROOT / relative.parent / f"{relative.stem}--{width}w.webp"


def dimensions(path: Path) -> tuple[int, int]:
    Image = pillow_modules()
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


def image_manifest_entry(cwebp: str | None, source: Path, generate: bool) -> dict:
    """Return manifest metadata for one source, optionally creating its variants."""
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
        candidates.append(
            {"path": url_for(target), "width": target_width, "height": target_height}
        )

    # The untouched source is the largest candidate and the durable fallback.
    candidates.append(
        {"path": url_for(source), "width": source_width, "height": source_height}
    )
    return {
        "src": url_for(source),
        "width": source_width,
        "height": source_height,
        "source_sha256": sha256(source),
        "variants": candidates,
    }


def expected_manifest(cwebp: str | None, generate: bool) -> tuple[dict, int]:
    images: dict[str, dict] = {}
    generated = 0

    for source in source_images():
        metadata = image_manifest_entry(cwebp, source, generate)
        images[url_for(source)] = metadata
        generated += len(metadata["variants"]) - 1

    return (
        {
            "schema_version": 1,
            "target_widths": list(TARGET_WIDTHS),
            "quality": WEBP_QUALITY,
            "images": images,
        },
        generated,
    )


def scalar_value(raw_value: str) -> str:
    """Return a simple YAML scalar used by image front matter."""
    value = raw_value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value.split(" #", 1)[0].strip()


def post_image_value(post: Path) -> str | None:
    """Read a string image or image.path value from a post's front matter."""
    lines = post.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return None

    image_mapping = False
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if image_mapping:
            path_match = IMAGE_PATH_FIELD.match(line)
            if path_match:
                return scalar_value(path_match.group(1)) or None
            if line and not line[0].isspace():
                image_mapping = False
        match = IMAGE_FIELD.match(line)
        if not match:
            continue
        value = scalar_value(match.group(1))
        if value:
            return value
        image_mapping = True
    return None


def source_for_image_value(value: str) -> Path | None:
    """Resolve a local post image value to its source file."""
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc:
        if parsed.scheme not in {"http", "https"} or parsed.hostname not in SITE_HOSTS:
            return None
        image_path = parsed.path
    else:
        image_path = value.split("?", 1)[0].split("#", 1)[0]
    if not image_path.lower().endswith(".webp"):
        return None

    source = (ROOT / unquote(image_path).lstrip("/")).resolve()
    public_roots = tuple(root.resolve() for root in PUBLIC_SOURCE_ROOTS)
    if not any(source == root or root in source.parents for root in public_roots):
        return None
    if OUTPUT_ROOT.resolve() in source.parents:
        return None
    if not source.is_file():
        raise FileNotFoundError(f"post image source does not exist: {url_for(source)}")
    return source


def post_image_sources() -> list[Path]:
    """Return unique local WebP sources explicitly referenced by posts."""
    sources: dict[str, Path] = {}
    if not POSTS_ROOT.is_dir():
        return []
    for post in sorted(POSTS_ROOT.rglob("*.md")):
        value = post_image_value(post)
        if not value:
            continue
        source = source_for_image_value(value)
        if source:
            sources[url_for(source)] = source
    return [sources[url] for url in sorted(sources, key=str.casefold)]


def load_manifest() -> dict:
    """Load the existing manifest without recomputing the full image library."""
    if not MANIFEST_PATH.is_file():
        return {
            "schema_version": 1,
            "target_widths": list(TARGET_WIDTHS),
            "quality": WEBP_QUALITY,
            "images": {},
        }
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def post_images_requiring_ensure(manifest: dict | None = None) -> list[Path]:
    """Find post images with missing, stale, or incomplete manifest entries."""
    current = manifest if manifest is not None else load_manifest()
    images = current.get("images", {})
    pending: list[Path] = []
    for source in post_image_sources():
        metadata = images.get(url_for(source))
        if not metadata or metadata.get("source_sha256") != sha256(source):
            pending.append(source)
            continue
        variants = metadata.get("variants", [])[:-1]
        if any(not (ROOT / variant["path"].lstrip("/")).is_file() for variant in variants):
            pending.append(source)
    return pending


def ensure_post_images(cwebp: str) -> int:
    """Generate only missing or stale responsive assets referenced by posts."""
    manifest = load_manifest()
    pending = post_images_requiring_ensure(manifest)
    if not pending:
        return 0

    images = manifest.setdefault("images", {})
    for source in pending:
        images[url_for(source)] = image_manifest_entry(cwebp, source, generate=True)
    manifest["schema_version"] = 1
    manifest["target_widths"] = list(TARGET_WIDTHS)
    manifest["quality"] = WEBP_QUALITY
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return len(pending)


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
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--check", action="store_true", help="validate the manifest and generated files"
    )
    mode.add_argument(
        "--check-post-images",
        action="store_true",
        help="validate only responsive assets explicitly referenced by posts",
    )
    mode.add_argument(
        "--ensure-post-images",
        action="store_true",
        help="generate only missing or stale responsive assets referenced by posts",
    )
    args = parser.parse_args()

    try:
        if args.check_post_images:
            pending = post_images_requiring_ensure()
            if pending:
                for source in pending:
                    print(f"ERROR: post image needs responsive variants: {url_for(source)}", file=sys.stderr)
                return 1
            print(f"OK: {len(post_image_sources())} post WebP sources are managed")
            return 0

        if args.ensure_post_images:
            pending = post_images_requiring_ensure()
            if not pending:
                print(f"OK: {len(post_image_sources())} post WebP sources are already managed")
                return 0
            cwebp = shutil.which("cwebp")
            if not cwebp:
                print("ERROR: cwebp is not installed or not on PATH", file=sys.stderr)
                return 1
            pillow_modules()
            generated = ensure_post_images(cwebp)
            print(f"Ensured responsive variants for {generated} post image source(s)")
            return 0

        pillow_modules()
    except (FileNotFoundError, json.JSONDecodeError, RuntimeError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
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
