#!/usr/bin/env python3
"""Build a filtered ZIP for comparing repo source footprint in the web SLOC analyzer.

This mirrors the timeline-style workflow described for comparison runs:
- only git-tracked files
- only the explicitly included source/config extensions
- excludes generated mirror/report prefixes and generated-only files

Default output: .tmp/timeline-source-footprint.zip
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import zipfile
from pathlib import Path


INCLUDED_EXTENSIONS = {
    ".js",
    ".mjs",
    ".cjs",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".sql",
    ".css",
    ".html",
    ".htm",
    ".json",
    ".yaml",
    ".yml",
    ".sh",
    ".ps1",
    ".psm1",
    ".bicep",
    ".bicepparam",
}

EXCLUDED_PREFIXES = (
    "app/frontend/user-guide/",
    "app/frontend/project-timeline/",
    "context/feedback/",
    ".tmp/",
    "User Guide/generated/",
)

GENERATED_ONLY_FILES = {
    "User Guide/guide-data.js",
    "guide-data.js",
    "Project Timeline/timeline-data.js",
    "timeline-data.js",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a filtered ZIP for SLOC analyzer comparison runs."
    )
    parser.add_argument(
        "--repo",
        default=".",
        help="Repository root. Defaults to the current directory.",
    )
    parser.add_argument(
        "--output",
        default=".tmp/timeline-source-footprint.zip",
        help="Output ZIP path, relative to repo root unless absolute.",
    )
    return parser.parse_args()


def run_git_ls_files(repo: Path) -> list[str]:
    result = subprocess.run(
        ["git", "-C", str(repo), "ls-files", "-z"],
        check=True,
        capture_output=True,
    )
    return [path for path in result.stdout.decode("utf-8").split("\0") if path]


def is_candidate(path: str) -> bool:
    if path in GENERATED_ONLY_FILES:
        return False
    if any(path.startswith(prefix) for prefix in EXCLUDED_PREFIXES):
        return False
    suffix = Path(path).suffix.lower()
    return suffix in INCLUDED_EXTENSIONS


def build_zip(repo: Path, output: Path) -> tuple[int, list[str]]:
    selected_paths: list[str] = []
    for relative_path in run_git_ls_files(repo):
        if is_candidate(relative_path):
            selected_paths.append(relative_path)

    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for relative_path in selected_paths:
            archive.write(repo / relative_path, arcname=relative_path)

    return len(selected_paths), selected_paths


def main() -> int:
    args = parse_args()
    repo = Path(args.repo).resolve()
    output = Path(args.output)
    if not output.is_absolute():
        output = repo / output

    try:
        count, selected_paths = build_zip(repo, output)
    except subprocess.CalledProcessError as error:
        print(f"git ls-files failed: {error}", file=sys.stderr)
        return 1

    print(output)
    print(f"Included files: {count}")
    if selected_paths:
        print(f"First file: {selected_paths[0]}")
        print(f"Last file: {selected_paths[-1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())