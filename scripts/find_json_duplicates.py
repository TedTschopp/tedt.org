#!/usr/bin/env python3
"""Find exact duplicate JSON objects in a JSON array file.

Usage:
  python3 scripts/find_json_duplicates.py path/to/file.json

This treats two objects as duplicates if they are deeply equal when serialized
as canonical JSON with sorted object keys (array order is preserved).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any


def canonical_json(value: Any) -> str:
    # ensure_ascii=False keeps UTF-8 characters readable and stable.
    # separators removes whitespace for a stable representation.
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise SystemExit(f"Invalid JSON in {path}: {e}")
    except OSError as e:
        raise SystemExit(f"Failed to read {path}: {e}")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Identify duplicate JSON objects in a JSON array file")
    parser.add_argument("json_file", type=Path, help="Path to a JSON file containing a top-level array of objects")
    parser.add_argument(
        "--show",
        type=int,
        default=2,
        help="How many sample fields to print per duplicate group (default: 2; 0 to disable)",
    )
    args = parser.parse_args(argv)

    data = load_json(args.json_file)

    if not isinstance(data, list):
        raise SystemExit(f"Expected top-level JSON array in {args.json_file}, got {type(data).__name__}")

    # Map digest -> list of (index, canonical_string)
    buckets: dict[str, list[tuple[int, str]]] = defaultdict(list)

    for idx, item in enumerate(data):
        canon = canonical_json(item)
        digest = hashlib.sha256(canon.encode("utf-8")).hexdigest()
        buckets[digest].append((idx, canon))

    # Group duplicates by canonical string to avoid any theoretical hash collision issues.
    duplicate_groups: list[list[int]] = []
    for entries in buckets.values():
        if len(entries) < 2:
            continue
        by_canon: dict[str, list[int]] = defaultdict(list)
        for idx, canon in entries:
            by_canon[canon].append(idx)
        for indices in by_canon.values():
            if len(indices) > 1:
                duplicate_groups.append(sorted(indices))

    duplicate_groups.sort(key=lambda g: (-len(g), g[0]))

    if not duplicate_groups:
        print("No exact duplicate objects found.")
        return 0

    print(f"Found {len(duplicate_groups)} duplicate group(s).")
    total_dupe_items = sum(len(g) for g in duplicate_groups)
    print(f"Total items involved (including originals): {total_dupe_items}")

    for n, indices in enumerate(duplicate_groups, start=1):
        print("-")
        print(f"Group {n}: {len(indices)} items at indexes: {indices}")

        if args.show and isinstance(data[indices[0]], dict):
            obj0 = data[indices[0]]
            # Heuristic: show a couple of common identifying fields if present.
            preferred = ["Title", "SourceURL", "Author", "AuthorCategoryLocation"]
            shown = 0
            for key in preferred:
                if key in obj0:
                    val = obj0.get(key)
                    if isinstance(val, str) and len(val) > 140:
                        val = val[:140] + "…"
                    print(f"  {key}: {val}")
                    shown += 1
                    if shown >= args.show:
                        break

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
