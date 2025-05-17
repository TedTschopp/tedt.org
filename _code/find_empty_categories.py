#!/usr/bin/env python3
import os
import re
import sys

def check_post_for_categories(file_path):
    """Check if a file has empty or missing categories."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Extract front matter
    front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)
    front_matter_match = front_matter_pattern.search(content)
    
    if not front_matter_match:
        return True  # No front matter, consider it missing categories
    
    front_matter = front_matter_match.group(1)
    
    # Check for categories/category field
    category_pattern = re.compile(r'^\s*categor(?:y|ies):\s*(.*?)$', re.MULTILINE)
    category_match = category_pattern.search(front_matter)
    
    if not category_match:
        return True  # No category field at all
    
    # Check if the value is empty
    category_value = category_match.group(1).strip()
    if not category_value:
        # Check if the next line might contain list items (indented lines with dashes)
        pos = category_match.end()
        rest_of_content = front_matter[pos:]
        next_lines = rest_of_content.split('\n')
        
        for line in next_lines:
            if re.match(r'^\s*-\s+\S+', line):  # Line starts with whitespace, dash, whitespace, then non-whitespace
                return False  # Has a list item, so not empty
            elif re.match(r'^\s*[a-zA-Z]', line):  # Next non-empty line starts with a letter (likely a new field)
                return True  # No list items before next field
            
    return True if not category_value else False

def find_posts_without_categories(posts_dir):
    """Find all posts without proper categories, excluding Gamma World."""
    posts_without_categories = []
    
    for root, dirs, files in os.walk(posts_dir):
        if "Gamma World" in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                if check_post_for_categories(file_path):
                    posts_without_categories.append(file_path)
    
    return posts_without_categories

if __name__ == "__main__":
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    result = find_posts_without_categories(posts_dir)
    
    if result:
        print(f"Found {len(result)} posts outside Gamma World without categories:")
        for file_path in sorted(result):
            relative_path = os.path.relpath(file_path, '/Users/tedtschopp/Developer/tedt.org')
            print(f"- {relative_path}")
    else:
        print("All posts outside Gamma World have categories defined.")
