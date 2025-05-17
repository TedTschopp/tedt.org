#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

def check_file_categories(file_path):
    """Check if a file has truly empty categories field."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Extract the front matter
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "No front matter"
    
    front_matter = match.group(1)
    front_matter_lines = front_matter.split('\n')
    
    # Find the categories line
    category_line_idx = None
    for i, line in enumerate(front_matter_lines):
        if re.match(r'^categories:\s*$', line):
            category_line_idx = i
            break
    
    if category_line_idx is None:
        # Check for inline categories
        for i, line in enumerate(front_matter_lines):
            if re.match(r'^categories:.+', line):
                return False, f"Has inline category: '{line.strip()[11:].strip()}'"
        return False, "No categories field"
    
    # Check the next line if it exists
    if category_line_idx + 1 < len(front_matter_lines):
        next_line = front_matter_lines[category_line_idx + 1]
        if re.match(r'^\s*-\s+\S', next_line):
            return False, f"Has list item: '{next_line.strip()}'"
    
    # If we get here, the categories field exists but is empty
    return True, "Empty categories field"

def main():
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    
    # Test specific files
    test_files = [
        "_posts/Blog Posts/2003-12-19-happy-advent.md",
        "_posts/Blog Posts/2006-06-23-microsoft-teams-with-creative-commons-or-common-corporate-mistakes.md",
        "_posts/Quotes/Al-Swearengen-Announcing-your-plans-is-a-goo.md",
        "_posts/Policy/1993-01-01-about.md"
    ]
    
    print("Testing specific files:")
    for rel_path in test_files:
        file_path = os.path.join("/Users/tedtschopp/Developer/tedt.org", rel_path)
        empty, reason = check_file_categories(file_path)
        print(f"{rel_path}: Empty={empty}, Reason: {reason}")
    
    # Let's find one file that truly has empty categories
    empty_count = 0
    for subdir, _, files in os.walk(posts_dir):
        if "Gamma World" in subdir:
            continue
        for file in files:
            if file.endswith('.md') and empty_count < 3:
                file_path = os.path.join(subdir, file)
                empty, reason = check_file_categories(file_path)
                if empty:
                    empty_count += 1
                    rel_path = os.path.relpath(file_path, "/Users/tedtschopp/Developer/tedt.org")
                    print(f"Found truly empty: {rel_path}: {reason}")

if __name__ == "__main__":
    main()
