#!/usr/bin/env python3
import os
import re
import sys

def find_files_with_empty_categories(root_dir):
    """Find files with empty categories."""
    empty_categories_files = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip Gamma World files
        if "Gamma World" in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Look for "categories:" followed by end of line
                    if re.search(r'categories:\s*$', content, re.MULTILINE):
                        empty_categories_files.append(file_path)
                except Exception as e:
                    print(f"Error with file {file_path}: {str(e)}", file=sys.stderr)
    
    return empty_categories_files

if __name__ == "__main__":
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    empty_categories = find_files_with_empty_categories(posts_dir)
    
    if empty_categories:
        print(f"Found {len(empty_categories)} files with empty categories:")
        for file_path in sorted(empty_categories):
            rel_path = os.path.relpath(file_path, '/Users/tedtschopp/Developer/tedt.org')
            print(f"- {rel_path}")
    else:
        print("No files with empty categories found.")
