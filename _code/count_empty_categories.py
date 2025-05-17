#!/usr/bin/env python3
import os
import re
import sys
from collections import defaultdict

def check_file_categories(file_path):
    """Check if a file has truly empty categories field."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract the front matter
        match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        if not match:
            return False
        
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
                    return False
            return False  # No categories field at all
        
        # Check the next line if it exists
        if category_line_idx + 1 < len(front_matter_lines):
            next_line = front_matter_lines[category_line_idx + 1]
            if re.match(r'^\s*-\s+\S', next_line):
                return False
        
        # If we get here, the categories field exists but is empty
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return False

def main():
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    empty_categories = defaultdict(list)
    
    for subdir, _, files in os.walk(posts_dir):
        if "Gamma World" in subdir:
            continue
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(subdir, file)
                if check_file_categories(file_path):
                    # Get the directory name (collection)
                    collection = os.path.basename(os.path.dirname(file_path))
                    empty_categories[collection].append(os.path.basename(file_path))
    
    # Print the results
    total_count = sum(len(files) for files in empty_categories.values())
    print(f"Found {total_count} files with truly empty categories:")
    for collection, files in sorted(empty_categories.items()):
        print(f"\n{collection} ({len(files)} files):")
        for file in sorted(files):
            print(f"- {file}")

if __name__ == "__main__":
    main()
