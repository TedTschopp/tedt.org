#!/usr/bin/env python3
"""Bulk add normalized tags & keywords front matter to /prompts/*.md files.

Heuristics:
  * Derive tags from filename tokens & known patterns.
  * Use kebab-case for tags; keep list deterministic (sorted).
  * Always include base tag: prompt
  * Only modify files under ./prompts (NOT _posts/Prompts).
  * If front matter exists, merge (preserve existing tags/keywords).
  * If no front matter, create one with title = filename stem.

Safe-guards:
  * Skips files > 200KB (likely non-prompt artifacts).
  * Creates a backup copy alongside original with .bak once per run.
  * Won't duplicate tags; preserves order: existing first, then new alpha-sorted.

Run:
  python _code/add_prompt_tags.py --dry-run (see planned changes)
  python _code/add_prompt_tags.py            (apply changes)
"""

from __future__ import annotations
import re
import sys
import argparse
from pathlib import Path
import shutil

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"

PATTERN_TAGS = [
    # pattern (regex, case-insensitive) -> tags
    (r"\bPRD\b", ["prd", "product-management", "requirements"]),
    (r"product requirements document", ["prd", "product-management", "requirements"]),
    (r"architecture", ["architecture", "software-architecture"]),
    (r"application architecture", ["application-architecture"]),
    (r"data architecture", ["data-architecture"]),
    (r"technology architecture", ["technology-architecture"]),
    (r"risk", ["risk-assessment"]),
    (r"user story", ["user-stories", "agile"]),
    (r"requirements", ["requirements", "requirements-analysis"]),
    (r"analysis", ["analysis"]),
    (r"review", ["review", "quality-assurance"]),
    (r"simulation", ["simulation", "experiential-learning"]),
    (r"ttrpg|vaesen", ["ttrpg", "game-design", "creative-writing"]),
    (r"weapon", ["ttrpg", "game-design"]),
    (r"novel|novelist", ["creative-writing", "fiction"]),
    (r"blog|blogger", ["blogging", "content-generation"]),
    (r"content", ["content-generation"]),
    (r"copy[- ]?writing", ["copywriting", "marketing"]),
    (r"podcast", ["podcasting", "audio-content"]),
    (r"tiered-messaging|messaging", ["communication", "messaging"]),
    (r"objective|okr|key-results", ["okr", "goal-setting"]),
    (r"goal", ["goal-setting"]),
    (r"lean[- ]six[- ]sigma", ["process-improvement", "lean-six-sigma"]),
    (r"power automate|automation", ["automation", "power-automate"]),
    (r"translator|translate|folklore", ["translation", "localization", "folklore"]),
    (r"style|writing style", ["style-guide", "tone"]),
    (r"midjourney", ["image-generation", "midjourney"]),
    (r"sora", ["video-generation"]),
    (r"gpt creator|ai-agent|agent", ["agent", "meta-prompt"]),
    (r"backlog", ["product-management", "backlog"]),
    (r"risk assessment", ["risk-assessment"]),
    (r"quality", ["quality-assurance"]),
]

STOPWORDS = {"the", "and", "of", "for", "to", "a", "an", "as"}

def slugify(token: str) -> str:
    token = token.lower()
    token = re.sub(r"[^a-z0-9]+", "-", token).strip('-')
    return token

def derive_tags(filename: str, content_head: str) -> list[str]:
    base = filename.rsplit('.', 1)[0]
    tags: set[str] = {"prompt"}
    haystack = f"{base}\n{content_head[:400]}".lower()
    for pattern, tlist in PATTERN_TAGS:
        if re.search(pattern, haystack, flags=re.IGNORECASE):
            for t in tlist:
                tags.add(slugify(t))
    # Fallback token extraction from filename
    for raw in re.split(r"[^A-Za-z0-9]+", base):
        if not raw or len(raw) < 3:
            continue
        low = raw.lower()
        if low in STOPWORDS:
            continue
        if low in {"prd", "ai"}:
            tags.add(low)
    return sorted(tags)

def parse_front_matter(text: str):
    if not text.startswith("---\n"):
        return None, text
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return None, text
    fm = parts[0][4:]  # strip leading ---\n
    rest = parts[1]
    return fm, rest

def extract_list_from_yaml(fm: str, key: str) -> list[str]:
    # naive extraction (not full YAML parse) OK for simple lists
    pattern = re.compile(rf"^ {0,2}{key}:\s*\n( (?:- .+\n)+)", re.MULTILINE)
    m = pattern.search(fm)
    if not m:
        return []
    lines = [l.strip()[2:].strip() for l in m.group(1).splitlines() if l.strip().startswith('- ')]
    return lines

def merge_list(existing: list[str], new: list[str]) -> list[str]:
    seen = set()
    merged = []
    for item in existing + new:
        if item not in seen:
            merged.append(item)
            seen.add(item)
    return merged

def inject_list_yaml(fm: str, key: str, values: list[str]) -> str:
    if not values:
        return fm
    block = f"{key}:\n" + "".join([f"  - {v}\n" for v in values])
    if re.search(rf"^ {0,2}{key}:\s*$", fm, re.MULTILINE):
        # empty key line present
        fm = re.sub(rf"^ {0,2}{key}:\s*$", block.rstrip(), fm, count=1, flags=re.MULTILINE)
    elif re.search(rf"^ {0,2}{key}:\s*\n( (?:- .+\n)+)", fm, re.MULTILINE):
        # replace existing list
        fm = re.sub(rf"^ {0,2}{key}:\s*\n( (?:- .+\n)+)", block.rstrip(), fm, count=1, flags=re.MULTILINE)
    else:
        # append at end
        if not fm.endswith("\n"):
            fm += "\n"
        fm += block
    if not fm.endswith("\n"):
        fm += "\n"
    return fm

def ensure_front_matter(path: Path, dry_run=False) -> bool:
    text = path.read_text(encoding='utf-8', errors='ignore')
    if len(text) > 200_000:
        return False
    fm, rest = parse_front_matter(text)
    head_sample = text[:300]
    derived = derive_tags(path.name, head_sample)
    keywords = [kw.replace('-', ' ') for kw in derived if kw not in {"prompt"}][:20]
    changed = False
    if fm is None:
        title = path.stem
        # Build new FM
        fm_lines = ["title: \"" + title.replace('"', '\\"') + "\"",]
        fm_lines.append("tags:")
        fm_lines.extend([f"  - {t}" for t in derived])
        if keywords:
            fm_lines.append("keywords:")
            fm_lines.extend([f"  - {k}" for k in keywords])
        new_text = "---\n" + "\n".join(fm_lines) + "\n---\n" + text
        if not dry_run:
            backup(path)
            path.write_text(new_text, encoding='utf-8')
        changed = True
    else:
        # merge existing
        existing_tags = extract_list_from_yaml(fm, 'tags')
        merged_tags = merge_list(existing_tags, derived)
        if merged_tags != existing_tags:
            fm_new = inject_list_yaml(fm, 'tags', merged_tags)
            fm = fm_new
            changed = True
        existing_keywords = extract_list_from_yaml(fm, 'keywords')
        merged_keywords = merge_list(existing_keywords, keywords)
        if merged_keywords != existing_keywords:
            fm = inject_list_yaml(fm, 'keywords', merged_keywords)
            changed = True
        if changed and not dry_run:
            backup(path)
            new_text = "---\n" + fm.strip('\n') + "\n---\n" + rest
            path.write_text(new_text, encoding='utf-8')
    return changed

def backup(path: Path):
    bak = path.with_suffix(path.suffix + ".bak")
    if not bak.exists():
        shutil.copy2(path, bak)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    changed_files = []
    for md in sorted(PROMPTS_DIR.glob('*.md')):
        try:
            if ensure_front_matter(md, dry_run=args.dry_run):
                changed_files.append(md.name)
        except Exception as e:
            print(f"ERROR processing {md}: {e}", file=sys.stderr)
    if args.dry_run:
        print("[DRY RUN] Files that would change ({}):".format(len(changed_files)))
        for f in changed_files:
            print("  ", f)
    else:
        print("Updated files ({}):".format(len(changed_files)))
        for f in changed_files:
            print("  ", f)

if __name__ == '__main__':
    main()
