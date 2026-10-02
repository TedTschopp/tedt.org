#!/usr/bin/env python3
"""Package an already-built IA preview for a separate GitHub Pages repository."""
import argparse
import json
import re
import shutil
from pathlib import Path

ROOT_ASSET = re.compile(r"""(?<=[\s"'(,=])/(img|media)/""")
ROBOTS = re.compile(r"""<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>\s*""", re.I)
TEXT_EXTENSIONS = {".html", ".css", ".js", ".mjs", ".json", ".xml", ".svg"}
AUTHORING_EXTENSIONS = {".psd", ".psb", ".xcf", ".afdesign", ".afphoto", ".blend"}
EXCLUDED_DIRECTORIES = {"img", "media", "reports"}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("build", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--origin", default="https://preview.tedt.org")
    parser.add_argument("--assets", default="https://tedt.org")
    args = parser.parse_args()
    source, destination = args.build.resolve(), args.output.resolve()
    if not (source / "index.html").is_file():
        parser.error("The input must be a completed Jekyll build.")
    if source == destination or destination.is_relative_to(source):
        parser.error("Package into a separate directory.")
    marker = destination / ".ia-preview-package"
    if destination.exists():
        if not marker.is_file():
            parser.error("Refusing to replace a directory not created by this packager.")
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    marker.write_text("Generated IA preview package.\n")
    rewritten = 0
    for path in source.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(source)
        if relative.parts[0] in EXCLUDED_DIRECTORIES or path.suffix.lower() in AUTHORING_EXTENSIONS:
            continue
        if relative.name in {"CNAME", "robots.txt", "sw.js", "package-lock.json", "package.json"}:
            continue
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if path.suffix.lower() in TEXT_EXTENSIONS:
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                shutil.copy2(path, target)
                continue
            for directory in ("img", "media"):
                text = text.replace(args.origin + "/" + directory + "/", args.assets + "/" + directory + "/")
            text = ROOT_ASSET.sub(lambda match: args.assets + "/" + match.group(1) + "/", text)
            if path.suffix.lower() == ".html" and re.search(r"</head\s*>", text, re.I):
                text = ROBOTS.sub("", text)
                text = re.sub(r"</head\s*>", '<meta name="robots" content="noindex, nofollow">\n</head>', text, count=1, flags=re.I)
                rewritten += 1
            target.write_text(text, encoding="utf-8")
        else:
            shutil.copy2(path, target)
    (destination / ".nojekyll").touch()
    (destination / "CNAME").write_text("preview.tedt.org\n")
    # Let crawlers read the noindex directive; do not advertise a preview sitemap.
    (destination / "robots.txt").write_text("User-agent: *\nDisallow: /*.json$\nDisallow: /*.xml$\n")
    files = [path for path in destination.rglob("*") if path.is_file()]
    total = sum(path.stat().st_size for path in files)
    if total >= 1024**3:
        raise SystemExit("The package exceeds the GitHub Pages 1 GiB site limit.")
    oversized = [str(path.relative_to(destination)) for path in files if path.stat().st_size >= 100 * 1024**2]
    if oversized:
        raise SystemExit("Files exceed GitHub's regular-Git size limit: " + ", ".join(oversized))
    print(json.dumps({"files": len(files), "size_mib": round(total / 1024**2, 1), "html_noindex": rewritten, "asset_origin": args.assets}, indent=2))

if __name__ == "__main__":
    main()
