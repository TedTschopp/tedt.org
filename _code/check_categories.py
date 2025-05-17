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
    
    # Look for categories: field
    category_match = re.search(r'^categories:\s*(.*?)$', front_matter, re.MULTILINE)
    if not category_match:
        return False, "No categories field"
    
    # Check what follows categories:
    full_line = category_match.group(0)
    value_part = category_match.group(1).strip()
    
    # If there's content on the same line after categories:, then it's not empty
    if value_part:
        return False, f"Has inline category: '{value_part}'"
    
    # Check if there's a list item on the next line (indented with dash)
    line_pos = front_matter.find(full_line) + len(full_line)
    rest_of_content = front_matter[line_pos:]
    next_line = rest_of_content.split('\n', 1)[0] if '\n' in rest_of_content else ""
    
    if re.match(r'^\s*-\s+\S', next_line):
        return False, f"Has list item: '{next_line.strip()}'"
    
    return True, "Empty categories field"

def main():
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    empty_categories = []
    
    # Check a specific file for testing
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

if __name__ == "__main__":
    main()
