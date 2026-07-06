#!/usr/bin/env python3
"""Add the Prompts category to 2025-10-17 prompt posts with empty categories."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "_posts" / "Prompts"
EMPTY_CATEGORIES_PATTERN = re.compile(r"^categories:\s*$", re.MULTILINE)


def fix_categories_in_prompts(prompts_dir: Path = PROMPTS_DIR) -> list[Path]:
    """Add the Prompts category to matching files with empty category blocks."""
    updated_files: list[Path] = []

    for file_path in prompts_dir.glob("2025-10-17-*.md"):
        try:
            content = file_path.read_text(encoding="utf-8")
        except OSError as error:
            print(f"Error reading {file_path}: {error}")
            continue

        if not EMPTY_CATEGORIES_PATTERN.search(content):
            continue

        new_content = EMPTY_CATEGORIES_PATTERN.sub("categories:\n- Prompts", content)

        try:
            file_path.write_text(new_content, encoding="utf-8")
        except OSError as error:
            print(f"Error writing {file_path}: {error}")
            continue

        updated_files.append(file_path)
        print(f"Updated: {file_path.relative_to(ROOT)}")

    print(f"\nUpdated {len(updated_files)} files")
    return updated_files


if __name__ == "__main__":
    print("Adding the Prompts category to new prompt files...")
    fix_categories_in_prompts()
    print("Done.")