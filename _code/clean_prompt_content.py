#!/usr/bin/env python3
"""
Clean up any remaining duplicate front matter in prompt_content sections.
"""

import os
import re
from pathlib import Path

def clean_prompt_content(file_path):
    """Clean up duplicate front matter in prompt_content section."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find prompt_content section
        if 'prompt_content: |' not in content:
            return False
        
        # Split into parts
        parts = content.split('prompt_content: |', 1)
        if len(parts) != 2:
            return False
        
        before_prompt = parts[0] + 'prompt_content: |'
        prompt_and_after = parts[1]
        
        # Find the end of the front matter (---)
        end_front_matter = content.find('---\n\n', content.find('prompt_content: |'))
        if end_front_matter == -1:
            return False
        
        # Get just the prompt content part
        prompt_content = content[content.find('prompt_content: |') + len('prompt_content: |'):end_front_matter]
        after_prompt = content[end_front_matter:]
        
        # Clean the prompt content - remove any duplicate front matter
        lines = prompt_content.split('\n')
        cleaned_lines = []
        in_duplicate_front_matter = False
        front_matter_count = 0
        
        for line in lines:
            if line.strip() == '---' and not cleaned_lines:
                # Skip first --- that starts duplicate front matter
                in_duplicate_front_matter = True
                front_matter_count += 1
                continue
            elif line.strip() == '---' and in_duplicate_front_matter and front_matter_count == 1:
                # Skip second --- that ends duplicate front matter
                in_duplicate_front_matter = False
                front_matter_count += 1
                continue
            elif not in_duplicate_front_matter:
                cleaned_lines.append(line)
        
        cleaned_prompt_content = '\n'.join(cleaned_lines)
        
        # Rebuild the file
        new_content = before_prompt + cleaned_prompt_content + after_prompt
        
        # Only update if we made changes
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned: {file_path.name}")
            return True
        
        return False
        
    except Exception as e:
        print(f"Error cleaning {file_path.name}: {str(e)}")
        return False

def main():
    """Main function to clean all files."""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    # Get all markdown files
    md_files = list(work_dir.glob("*.md"))
    
    print(f"Found {len(md_files)} markdown files to check")
    
    cleaned = 0
    
    for file_path in md_files:
        if file_path.name == 'index.html':
            continue
            
        if clean_prompt_content(file_path):
            cleaned += 1
    
    print(f"\nCleaning complete:")
    print(f"Files cleaned: {cleaned}")

if __name__ == "__main__":
    main()