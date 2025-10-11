#!/usr/bin/env python3
"""Repair utility for ArchiMate 3.0 Exchange Format XML files.

Usage:
  python _code/fix_archimate_exchange.py /absolute/path/to/model.xml [--dry-run]

Problems this script attempts to fix (non‑destructive, creates a .bak):
  1. Stray space in the namespace URI (e.g. 'http:// www.opengroup.org/...').
  2. Missing <model:name> (or <name>) element as the first child of <model:Model>.
  3. <metadata> (or <model:metadata>) appearing before <name> – it will be moved after <name>.
  4. Ensures consistent prefix usage if a model: prefix is declared.

What it DOES NOT do:
  * Deep schema validation.
  * Reconstruct truncated XML or fix arbitrary structural corruption.
  * Modify element content beyond minimal structural reordering.

Safety:
  * Original file is copied to <filename>.bak BEFORE changes are written.
  * If --dry-run is supplied, no changes are written; a unified diff is printed.

Exit codes:
  0 = success (or no change needed)
  1 = fatal error / could not process

Author: Automated helper script generated for site maintenance & model recovery.
"""

from __future__ import annotations
import sys, re, pathlib, difflib, argparse

EXPECTED_NS = "http://www.opengroup.org/xsd/archimate/3.0/"

def load_text(path: pathlib.Path) -> str:
    return path.read_text(encoding='utf-8', errors='replace')

def normalize_namespace(text: str) -> tuple[str, bool]:
    # Remove accidental whitespace inside the namespace URI
    fixed = re.sub(r'(http://)\s+(www\.opengroup\.org/xsd/archimate/3\.0/)', r'\1\2', text)
    return fixed, fixed != text

def find_root(text: str):
    # Very lightweight root detection without full XML parse (file may be invalid initially)
        # Lightweight root detection without full XML parse.
        # Accept typical variants we may encounter in malformed exchange files.
        for pattern in (r'<model:Model\b[^>]*>',  # proper prefixed root
                        r'<model\b[^>]*>',       # bare lowercase root (incorrect)
                        r'<Model\b[^>]*>'        # capitalized unprefixed root
                        ):
            m = re.search(pattern, text)
            if m:
                return m
        return None

def determine_prefix(root_tag: str) -> str:
    # If root already contains model:Model prefix, keep it. Otherwise we'll normalize to prefixed form.
    return 'model:' if '<model:Model' in root_tag else ''

def ensure_name_first(text: str, prefix: str, filename: str) -> tuple[str, list[str]]:
    notes: list[str] = []
    root_match = find_root(text)
    if not root_match:
        notes.append('Root <Model> tag not found; no structural changes applied.')
        return text, notes
    start = root_match.end()
    after_root = text[start:]

    # Upgrade bare root tag BEFORE any child inspection
    root_tag = root_match.group(0)
    if (root_tag.startswith('<model\n') or root_tag.startswith('<model ')) and 'model:Model' not in root_tag:
        attrs = root_tag[len('<model'): -1]
        m_default_ns = re.search(r'xmlns="([^"]+)"', attrs)
        default_ns = m_default_ns.group(1) if m_default_ns else EXPECTED_NS
        if 'xmlns:model=' not in attrs:
            attrs += f' xmlns:model="{default_ns}"'
        new_root_tag = '<model:Model' + attrs + '>'
        text = text[:root_match.start()] + new_root_tag + text[root_match.end():]
        # Recompute positions after replacement
        start = root_match.start() + len(new_root_tag)
        after_root = text[start:]
        prefix = 'model:'
        notes.append('Upgraded root <model> to <model:Model> and added xmlns:model binding.')

    # Identify first child element name (skip whitespace/comments)
    child_re = re.compile(r'\s*(?:<!--.*?-->)?\s*<([a-zA-Z0-9:]+)')
    c = child_re.match(after_root)
    first_child = c.group(1) if c else None

    # Patterns for name & metadata
    name_pattern = re.compile(r'\s*<(?:%s)?name>.*?</(?:%s)?name>\s*' % (prefix, prefix), re.DOTALL)
    metadata_pattern = re.compile(r'\s*<(?:%s)?metadata>.*?</(?:%s)?metadata>\s*' % (prefix, prefix), re.DOTALL)

    name_match = name_pattern.search(after_root)
    metadata_match = metadata_pattern.search(after_root)

    modified = False

    if not name_match:
        # Insert a generated name before any existing first element
        generated_name = filename.rsplit('.', 1)[0]
        name_el = f"\n  <{prefix}name>{generated_name}</{prefix}name>\n"
        text = text[:start] + name_el + after_root
        after_root = text[start:]
        name_match = name_pattern.search(after_root)
        notes.append('Inserted missing <name> element as first child.')
        modified = True
    else:
        # Ensure it is first
        if first_child and not re.fullmatch(r'(?:%s)?name' % prefix, first_child):
            # Move existing name block to top
            name_block = name_match.group(0)
            # Remove original
            new_after_root = after_root[:name_match.start()] + after_root[name_match.end():]
            # Prepend name block
            text = text[:start] + '\n  ' + name_block.strip() + '\n' + new_after_root
            after_root = text[start:]
            notes.append('Moved existing <name> to be first child.')
            modified = True

    # After ensuring name, ensure metadata (if present) is after name
    # Refresh matches (structure may have changed)
    after_root = text[start:]
    name_match = name_pattern.search(after_root)
    metadata_match = metadata_pattern.search(after_root)
    if metadata_match and name_match and metadata_match.start() < name_match.end():
        # metadata precedes name; swap order by moving metadata after name
        meta_block = metadata_match.group(0)
        # Remove original metadata
        remainder = after_root[:metadata_match.start()] + after_root[metadata_match.end():]
        # Recompute name position in remainder
        # (Name block might be removed if overlapping, but it doesn't)
        name_match2 = name_pattern.search(remainder)
        if name_match2:
            insertion_point = name_match2.end()
            new_after = remainder[:insertion_point] + '\n  ' + meta_block.strip() + '\n' + remainder[insertion_point:]
            text = text[:start] + new_after
            notes.append('Reordered <metadata> to appear after <name>.')
            modified = True

    return text, notes if modified else notes

def main():
    parser = argparse.ArgumentParser(description='Repair minor ordering/namespace issues in ArchiMate Exchange XML.')
    parser.add_argument('file', help='Path to the Exchange XML file')
    parser.add_argument('--dry-run', action='store_true', help='Show changes but do not write file')
    args = parser.parse_args()

    path = pathlib.Path(args.file).expanduser().resolve()
    if not path.exists():
        print(f"Error: File not found: {path}", file=sys.stderr)
        sys.exit(1)

    original = load_text(path)
    modified, ns_changed = normalize_namespace(original)
    notes: list[str] = []
    if ns_changed:
        notes.append('Normalized namespace URI (removed stray whitespace).')

    # Core structural normalization (name + metadata ordering and root upgrade)
    modified, struct_notes = ensure_name_first(modified, 'model:', path.name)
    notes.extend(struct_notes)

    # Final header normalization (deduplicate & reorder) using regex on the current buffer
    header_match = re.search(r'<model:Model[^>]*>.*?<elements>', modified, re.DOTALL)
    if header_match:
        header = header_match.group(0)
        # Extract region between root close and <elements>
        # We'll reconstruct only ordering of name/documentation/metadata
        def grab(tag):
            m = re.search(r'\s*<(model:)?%s(?:\s+[^>]*)?>.*?</(model:)?%s>\s*' % (tag, tag), header, re.DOTALL)
            return m
        name_blocks = list(re.finditer(r'\s*<(model:)?name(?:\s+[^>]*)?>.*?</(model:)?name>\s*', header, re.DOTALL))
        chosen_name = None
        for nb in name_blocks:
            if 'xml:lang=' in nb.group(0):
                chosen_name = nb
                break
        if not chosen_name and name_blocks:
            chosen_name = name_blocks[0]
        documentation = grab('documentation')
        metadata_block = grab('metadata')
        if chosen_name:
            consumed = []
            ordered_parts = []
            ordered_parts.append('\n  ' + chosen_name.group(0).strip() + '\n')
            consumed.append((chosen_name.start(), chosen_name.end()))
            if documentation:
                ordered_parts.append('  ' + documentation.group(0).strip() + '\n')
                consumed.append((documentation.start(), documentation.end()))
            if metadata_block:
                ordered_parts.append('  ' + metadata_block.group(0).strip() + '\n')
                consumed.append((metadata_block.start(), metadata_block.end()))
            # Remove all occurrences from header
            rebuilt = []
            last_i = 0
            for a,b in sorted(consumed):
                rebuilt.append(header[last_i:a])
                last_i = b
            rebuilt.append(header[last_i:])
            new_header = ''.join(rebuilt)
            # Strip any leftover duplicate name/documentation/metadata occurrences from new_header body part before <elements>
            body_part = re.sub(r'\s*<(model:)?name(?:\s+[^>]*)?>.*?</(model:)?name>\s*', '', new_header, flags=re.DOTALL)
            body_part = re.sub(r'\s*<(model:)?documentation(?:\s+[^>]*)?>.*?</(model:)?documentation>\s*', '', body_part, flags=re.DOTALL)
            body_part = re.sub(r'\s*<(model:)?metadata>.*?</(model:)?metadata>\s*', '', body_part, flags=re.DOTALL)
            final_header = ordered_parts[0] + (ordered_parts[1] if len(ordered_parts)>1 else '') + (ordered_parts[2] if len(ordered_parts)>2 else '') + body_part
            if final_header != header:
                modified = modified.replace(header, final_header)
                notes.append('Final header ordering normalized (name, documentation, metadata).')

    if modified == original:
        print('No changes needed.')
        sys.exit(0)

    if args.dry_run:
        print('\n'.join(notes))
        diff = difflib.unified_diff(original.splitlines(), modified.splitlines(), fromfile=str(path), tofile=str(path)+' (fixed)', lineterm='')
        for line in diff:
            print(line)
        sys.exit(0)

    backup = path.with_suffix(path.suffix + '.bak')
    if not backup.exists():
        backup.write_text(original, encoding='utf-8')
        print(f'Backup created: {backup.name}')
    else:
        print(f'Backup already exists: {backup.name} (not overwritten)')

    path.write_text(modified, encoding='utf-8')
    print('Applied changes:')
    for n in notes:
        print(f' - {n}')
    print('Done.')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nAborted by user.')
        sys.exit(1)
