#!/usr/bin/env python3
import os
import re
import sys

def find_files_with_empty_categories(root_dir):
    """Find files with empty categories or no categories field."""
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
                    
                    # First check if the file has YAML front matter
                    yaml_pattern = re.compile(r'^---\s*?\n(.*?)\n---', re.DOTALL | re.MULTILINE)
                    yaml_match = yaml_pattern.search(content)
                    
                    if yaml_match:
                        yaml_content = yaml_match.group(1)
                        
                        # Look for categories field in YAML front matter
                        categories_pattern = re.compile(r'^categories:\s*$', re.MULTILINE)
                        empty_categories = categories_pattern.search(yaml_content)
                        
                        # Also check for categories followed by some whitespace then a newline
                        categories_ws_pattern = re.compile(r'^categories:\s+$', re.MULTILINE)
                        empty_categories_ws = categories_ws_pattern.search(yaml_content)
                        
                        # Check for the case where categories is empty or just whitespace
                        if empty_categories or empty_categories_ws:
                            pos = empty_categories.end() if empty_categories else empty_categories_ws.end()
                            next_line = yaml_content[pos:].lstrip().split('\n')[0]
                            
                            # If the next line is a new YAML field (starts with a letter or dash)
                            if next_line == '' or next_line.startswith('-') or next_line[0].isalpha():
                                empty_categories_files.append(file_path)
                except Exception as e:
                    # print(f"Error with file {file_path}: {str(e)}", file=sys.stderr)
                    pass
    
    return empty_categories_files

if __name__ == "__main__":
    posts_dir = "/Users/tedtschopp/Developer/tedt.org/_posts"
    
    # Dictionary to organize files by directory
    files_by_dir = {}
    
    empty_categories = find_files_with_empty_categories(posts_dir)
    
    if empty_categories:
        for file_path in sorted(empty_categories):
            rel_path = os.path.relpath(file_path, '/Users/tedtschopp/Developer/tedt.org')
            
            # Get directory part
            dir_part = os.path.dirname(rel_path).split('/')[-1]
            
            # Initialize list for this directory if not already present
            if dir_part not in files_by_dir:
                files_by_dir[dir_part] = []
            
            # Add filename to the list
            files_by_dir[dir_part].append(os.path.basename(file_path))
        
        # Print summary
        print(f"Found {len(empty_categories)} files with empty categories:\n")
        
        # Print files by directory
        for dir_name, files in sorted(files_by_dir.items()):
            print(f"**{dir_name}** ({len(files)} files):")
            for file in sorted(files):
                print(f"- {file}")
            print("")
    else:
        print("No files with empty categories found.")
