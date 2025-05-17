#!/usr/bin/env python3
import os
import re

def check_post_for_categories(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Check if this file has YAML front matter (between --- markers)
    yaml_pattern = re.compile(r'^---\s*?\n(.+?)\n---', re.DOTALL | re.MULTILINE)
    yaml_match = yaml_pattern.search(content)
    
    if not yaml_match:
        return False  # No YAML front matter
    
    yaml_content = yaml_match.group(1)
    
    # Check for categories: or category: in the YAML front matter
    # Look for pattern that is either:
    # 1. categories: followed by nothing or whitespace until end of line
    # 2. categories: followed by [] (empty list)
    # 3. categories: followed by whitespace and then another field (indicating empty value)
    categories_pattern = re.compile(r'^\s*?categor(?:y|ies):\s*?(?:$|\[\s*\]|\n\s*?[a-zA-Z_-]+?:)', re.MULTILINE)
    empty_categories = categories_pattern.search(yaml_content)
    
    # Check for existence of any categories field
    has_categories_pattern = re.compile(r'^\s*?categor(?:y|ies):', re.MULTILINE)
    has_categories = has_categories_pattern.search(yaml_content)
    
    # Return True if either:
    # - No categories field exists
    # - Categories field exists but is empty
    return not has_categories or empty_categories is not None

def find_posts_without_categories(posts_dir):
    posts_without_categories = []
    
    for root, dirs, files in os.walk(posts_dir):
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
        print(f"Found {len(result)} posts without categories:")
        for file_path in result:
            print(f"- {os.path.relpath(file_path, '/Users/tedtschopp/Developer/tedt.org')}")
    else:
        print("All posts have categories defined.")
