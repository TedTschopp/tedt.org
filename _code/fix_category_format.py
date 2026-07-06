#!/usr/bin/env python3
"""Fix malformed category lists in the 2025-10-17 prompt posts."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "_posts" / "Prompts"
BAD_CATEGORY_BLOCK = "categories:\n- Prompts\n    - Projects"
GOOD_CATEGORY_BLOCK = "categories:\n- Prompts\n- Projects"


def fix_category_format(prompts_dir: Path = PROMPTS_DIR) -> list[Path]:
    """Fix nested category formatting in matching prompt files."""
    updated_files: list[Path] = []

    for file_path in prompts_dir.glob("2025-10-17-*.md"):
        try:
            content = file_path.read_text(encoding="utf-8")
        except OSError as error:
            print(f"Error reading {file_path}: {error}")
            continue

        if BAD_CATEGORY_BLOCK not in content:
            continue

        new_content = content.replace(BAD_CATEGORY_BLOCK, GOOD_CATEGORY_BLOCK)

        try:
            file_path.write_text(new_content, encoding="utf-8")
        except OSError as error:
            print(f"Error writing {file_path}: {error}")
            continue

        updated_files.append(file_path)
        print(f"Fixed categories in: {file_path.relative_to(ROOT)}")

    print(f"\nFixed {len(updated_files)} files")
    return updated_files


if __name__ == "__main__":
    print("Fixing category format in prompt files...")
    fix_category_format()
    print("Done.")