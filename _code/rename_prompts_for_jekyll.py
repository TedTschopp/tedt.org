#!/usr/bin/env python3
"""
Rename all files in work-in-progress to proper Jekyll blog post format.
Format: YYYY-MM-DD-title.md
"""

import os
import re
from pathlib import Path

def create_url_slug(filename):
    """Convert filename to URL-friendly slug."""
    # Remove file extension
    name = filename.replace('.md', '')
    
    # Remove common prefixes
    name = re.sub(r'^(Architecture|Business|Communications|TTRPG|Self Improvement|Automation)\s*-\s*', '', name)
    
    # Clean up special characters and normalize
    name = name.replace(' - ', '-')
    name = name.replace('[', '').replace(']', '')
    name = name.replace('(', '').replace(')', '')
    name = name.replace(' & ', ' and ')
    name = name.replace('&', 'and')
    
    # Convert to lowercase and replace spaces with hyphens
    slug = re.sub(r'[^a-zA-Z0-9\s\-]', '', name)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    slug = slug.lower()
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    return slug

def rename_files():
    """Rename all files in work-in-progress directory."""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    # Get all markdown files
    md_files = list(work_dir.glob("*.md"))
    
    print(f"Found {len(md_files)} files to rename")
    
    renamed_count = 0
    
    for file_path in md_files:
        old_name = file_path.name
        slug = create_url_slug(old_name)
        
        # Create new filename with date prefix
        new_name = f"2025-10-17-{slug}.md"
        new_path = file_path.parent / new_name
        
        # Avoid naming conflicts
        counter = 1
        while new_path.exists():
            new_name = f"2025-10-17-{slug}-{counter}.md"
            new_path = file_path.parent / new_name
            counter += 1
        
        try:
            file_path.rename(new_path)
            print(f"Renamed: {old_name} → {new_name}")
            renamed_count += 1
        except Exception as e:
            print(f"Error renaming {old_name}: {e}")
    
    print(f"\nRenaming complete: {renamed_count} files renamed")

if __name__ == "__main__":
    rename_files()