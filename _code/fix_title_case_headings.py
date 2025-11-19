#!/usr/bin/env python3
"""
Convert Markdown ATX headings (# ...) to Chicago-style Title Case.
- Skips fenced code blocks.
- Preserves existing emphasis markers (*, **, _, backticks) around words.
- Handles hyphenated words (capitalizes each segment unless a small word not first/last).
- Leaves existing all-caps abbreviations untouched.
Dry-run by default; use --write to apply changes.
Usage:
  python _code/fix_title_case_headings.py path/to/file.md            # dry run prints to stdout
  python _code/fix_title_case_headings.py path/to/file.md --write    # in-place modify
"""
import re, sys, pathlib

SMALL_WORDS = {
    "a","an","the","and","but","or","for","nor","so","yet",
    "as","at","by","in","of","on","per","to","up","via","vs","vs.","is"
}

WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9']*")

def is_all_caps(w:str)->bool:
    # treat words like 'AI', 'GPU', 'CPU', 'UBI', 'SLOs' as already correct if majority caps
    letters = ''.join(ch for ch in w if ch.isalpha())
    return letters.isupper() and len(letters) > 1

def transform_word(w:str, position:int, total:int)->str:
    if is_all_caps(w):
        return w
    lw = w.lower()
    if '-' in w:
        parts = w.split('-')
        new_parts=[]
        for i,p in enumerate(parts):
            lp = p.lower()
            if is_all_caps(p):
                new_parts.append(p)
                continue
            # Determine absolute position for small word logic only if single segment word; for hyphen treat each segment like a start unless small word and not first/last overall
            if (lw in SMALL_WORDS and position not in (0,total-1)):
                # but hyphenated segments usually capitalized; keep Chicago style: don't lowercase segments unless recognized small words inside compound seldom lowercased. We'll always capitalize hyphen segments.
                pass
            if lp in SMALL_WORDS and i not in (0, len(parts)-1):
                new_parts.append(lp)
            else:
                new_parts.append(p[:1].upper()+p[1:])
        return '-'.join(new_parts)
    if lw in SMALL_WORDS and position not in (0,total-1):
        return lw
    return w[:1].upper()+w[1:]

def title_case(segment:str)->str:
    # Preserve punctuation spacing tokens
    tokens = re.split(r'(\s+)', segment)
    # Rebuild sequence of word tokens indexes for position logic
    words = [t for t in tokens if not re.match(r'\s+', t) and WORD_RE.search(t)]
    total = len(words)

    def process_token(t:str)->str:
        if re.match(r'\s+', t):
            return t
        # Strip surrounding emphasis markers for processing, then rewrap
        prefix = ''
        suffix = ''
        m = re.match(r'^([*_`]+)(.*?)([*_`]+)$', t)
        core = t
        if m:
            prefix, core, suffix = m.group(1), m.group(2), m.group(3)
        # If token contains non-word chars only, return as is
        if not WORD_RE.search(core):
            return t
        # For multi-word tokens (unlikely), just handle each word
        # Determine position by locating first word portion inside 'words' list
        # Simpler: iterate words again to find mapping
        # We'll split core by non-word boundaries but keep original
        parts = re.split(r'(?=\b)', core)  # keep boundaries
        # Actually easier: treat entire core as one word for position context
        # Find its index among words list by matching first WORD_RE result
        first_word = WORD_RE.search(core).group(0)
        # Determine the absolute position of first_word
        pos = None
        for i,w in enumerate(words):
            if w == t or first_word in w:
                pos = i
                break
        if pos is None:
            pos = 0
        # Apply transformation to each word piece inside core using regex substitution
        def repl(mw):
            # compute relative position; if more than one word inside token treat each sequentially
            # For simplicity use same pos for all subwords
            return transform_word(mw.group(0), pos, total)
        new_core = re.sub(WORD_RE, repl, core)
        return prefix + new_core + suffix

    return ''.join(process_token(t) for t in tokens)

def fix(path:pathlib.Path, write:bool=False)->None:
    lines = path.read_text(encoding='utf-8').splitlines()
    in_code = False
    for i,l in enumerate(lines):
        if l.strip().startswith('```'):
            in_code = not in_code
        if in_code:
            continue
        if re.match(r'#{1,6}\s', l):
            prefix, rest = l.split(' ',1)
            # Remove trailing period from heading if present (except if abbreviation like U.S.)
            rest_stripped = rest.rstrip()
            if rest_stripped.endswith('.') and not re.search(r'[A-Za-z]\.[A-Za-z]\.$', rest_stripped):
                rest = rest_stripped[:-1]
            lines[i] = f"{prefix} {title_case(rest)}"
    output = '\n'.join(lines)+('\n' if lines and not lines[-1].endswith('\n') else '')
    if write:
        path.write_text(output, encoding='utf-8')
    else:
        print(output)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python _code/fix_title_case_headings.py FILE.md [--write]')
        sys.exit(1)
    p = pathlib.Path(sys.argv[1])
    fix(p, write='--write' in sys.argv)
