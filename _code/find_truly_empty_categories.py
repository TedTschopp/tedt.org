#!/usr/bin/env python3
import os
import re
import sys

def check_post_for_empty_categories(file_path):
    """Check if a file has empty/missing categories or only has 'categories:' with nothing after it."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract front matter
        front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)
        front_matter_match = front_matter_pattern.search(content)
        
        if not front_matter_match:
            return False  # No front matter, skip it
        
        front_matter = front_matter_match.group(1)
        
        # Look for the pattern "categories:" followed by a blank line or no content
        empty_categories_pattern = re.compile(r'categories:\s*$', re.MULTILINE)
        if empty_categories_pattern.search(front_matter):
            # Check if there's no indented content after it
            lines = front_matter.split('\n')
            for i, line in enumerate(lines):
                if 'categories:' in line and line.strip() == 'categories:':
                    # If this is the last line or next line isn't indented
                    if i+1 >= len(lines) or not lines[i+1].startswith(' '):
                        return True  # Empty categories
                        
        return False  # Has categories or we couldn't determine
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}", file=sys.stderr)
        return False

def find_empty_category_files(root_dir):
    """Find markdown files with empty categories."""
    empty_category_files = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip Gamma World directory
        if "Gamma World" in root:
            continue
        
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                if check_post_for_empty_categories(file_path):
                    empty_category_files.append(file_path)
    
    return empty_category_files

if __name__ == "__main__":
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    empty_categories = find_empty_category_files(posts_dir)
    
    if empty_categories:
        print(f"Found {len(empty_categories)} files with empty categories:")
        for file_path in sorted(empty_categories):
            rel_path = os.path.relpath(file_path, '/Users/tedtschopp/Developer/tedt.org')
            print(f"- {rel_path}")
    else:
        print("No files with empty categories found outside of Gamma World.")
