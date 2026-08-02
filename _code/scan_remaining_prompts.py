#!/usr/bin/env python3
"""Scan remaining prompt files for company-specific references."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "prompts"
PATTERNS = {
    "SCE": re.compile(r"\bSCE\b", re.IGNORECASE),
    "Edison": re.compile(r"\bEdison\b", re.IGNORECASE),
    "PSPS": re.compile(r"\bPSPS\b", re.IGNORECASE),
    "Southern California Edison": re.compile(r"Southern California Edison", re.IGNORECASE),
}


def scan_for_references(directory: Path) -> dict[str, list[dict[str, object]]]:
    """Scan Markdown files in a directory for configured company references."""
    references: dict[str, list[dict[str, object]]] = {term: [] for term in PATTERNS}

    for file_path in directory.glob("*.md"):
        try:
            content = file_path.read_text(encoding="utf-8")
        except OSError as error:
            print(f"Error reading {file_path}: {error}")
            continue

        for term, pattern in PATTERNS.items():
            matches = pattern.findall(content)
            if matches:
                references[term].append(
                    {
                        "file": file_path,
                        "count": len(matches),
                    }
                )

    return references


def main() -> None:
    print(f"Scanning {PROMPTS_DIR.relative_to(ROOT)} for company references...")
    references = scan_for_references(PROMPTS_DIR)

    total_files_with_refs = 0
    total_references = 0

    for term, files in references.items():
        if not files:
            continue

        print(f"\n{term} references found:")
        for file_info in files:
            file_path = file_info["file"]
            count = int(file_info["count"])
            display_path = file_path.relative_to(ROOT) if isinstance(file_path, Path) else file_path
            print(f"  - {display_path}: {count} occurrences")
            total_references += count
        total_files_with_refs += len(files)

    if total_references == 0:
        print("\nNo SCE, Edison, PSPS, or Southern California Edison references found.")
    else:
        print(f"\nFound {total_references} total references in {total_files_with_refs} files")


if __name__ == "__main__":
    main()