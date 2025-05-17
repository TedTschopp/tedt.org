#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

def check_post_for_categories(file_path):
    """Check if a post file has categories or category in its YAML front matter with actual content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if this file has YAML front matter (between --- markers)
        yaml_pattern = re.compile(r'^---\s*?\n(.+?)\n---', re.DOTALL | re.MULTILINE)
        yaml_match = yaml_pattern.search(content)
        
        if not yaml_match:
            return False  # No YAML front matter
        
        yaml_content = yaml_match.group(1)
        
        # Find the categories/category line
        categories_line_pattern = re.compile(r'^\s*?(categor(?:y|ies)):\s*(.*?)$', re.MULTILINE)
        categories_match = categories_line_pattern.search(yaml_content)
        
        # If no category/categories line is found, or it's empty/just whitespace
        if not categories_match or not categories_match.group(2).strip():
            # Check if the next line is indented (indicating list items)
            if categories_match:
                # Get position of the match
                pos = categories_match.end()
                # Check if next line starts with a dash and is indented
                next_line_pattern = re.compile(r'\n\s*-\s+\S+', re.MULTILINE)
                next_line_match = next_line_pattern.search(yaml_content[pos:])
                if next_line_match:
                    # Has list items, so not empty
                    return False
            return True  # No categories or empty
            
        return False  # Has categories
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}", file=sys.stderr)
        return False

def find_posts_without_categories(posts_dir):
    """Find all posts that don't have categories, excluding the Gamma World collection."""
    posts_without_categories = []
    
    for root, dirs, files in os.walk(posts_dir):
        # Skip the Gamma World directory
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
