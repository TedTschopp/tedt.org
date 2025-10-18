#!/usr/bin/env python3
"""
Script to sanitize Ted Tschopp references from prompt files.
Replaces author information with generic placeholders.
"""

import os
import re
from pathlib import Path

def sanitize_files():
    """Replace Ted Tschopp references in all prompt files."""
    base_path = Path("prompts/work-in-progress")
    
    if not base_path.exists():
        print(f"❌ Directory not found: {base_path}")
        return
    
    md_files = list(base_path.glob("*.md"))
    
    if not md_files:
        print(f"❌ No .md files found in {base_path}")
        return
    
    # Replacements to make
    replacements = [
        (r'name: Ted Tschopp', 'name: Content Creator'),
        (r'url: https://tedt\.org/', 'url: https://example.org/'),
        (r'image-artist: "Ted Tschopp"', 'image-artist: "Content Creator"'),
        (r'image-artist-URL: "https://tedt\.org/"', 'image-artist-URL: "https://example.org/"'),
        (r'image-credits: "Ted Tschopp"', 'image-credits: "Content Creator"'),
        (r'image-credits-URL: "https://tedt\.org/"', 'image-credits-URL: "https://example.org/"'),
        (r'image-credits-artist: "Ted Tschopp"', 'image-credits-artist: "Content Creator"'),
        (r'image-credits-artist-URL: "https://tedt\.org/"', 'image-credits-artist-URL: "https://example.org/"'),
    ]
    
    files_changed = []
    
    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Apply all replacements
            for pattern, replacement in replacements:
                content = re.sub(pattern, replacement, content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_changed.append(file_path.name)
                print(f"✅ Updated: {file_path.name}")
        
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    if files_changed:
        print(f"\n🎉 Successfully updated {len(files_changed)} files:")
        for filename in sorted(files_changed):
            print(f"   - {filename}")
    else:
        print("ℹ️  No files needed updating.")
    
    print(f"\n✅ Sanitization complete! Processed {len(md_files)} files.")

if __name__ == "__main__":
    sanitize_files()