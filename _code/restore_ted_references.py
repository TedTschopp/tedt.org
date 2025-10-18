#!/usr/bin/env python3
"""
Script to restore Ted Tschopp references in prompt files.
Replaces generic placeholders with original author information.
"""

import os
import re
from pathlib import Path

def restore_files():
    """Restore Ted Tschopp references in all prompt files."""
    base_path = Path("prompts/work-in-progress")
    
    if not base_path.exists():
        print(f"❌ Directory not found: {base_path}")
        return
    
    md_files = list(base_path.glob("*.md"))
    
    if not md_files:
        print(f"❌ No .md files found in {base_path}")
        return
    
    # Replacements to make (reverse of sanitization)
    replacements = [
        (r'name: Content Creator', 'name: Ted Tschopp'),
        (r'url: https://example\.org/', 'url: https://tedt.org/'),
        (r'image-artist: "Content Creator"', 'image-artist: "Ted Tschopp"'),
        (r'image-artist-URL: "https://example\.org/"', 'image-artist-URL: "https://tedt.org/"'),
        (r'image-credits: "Content Creator"', 'image-credits: "Ted Tschopp"'),
        (r'image-credits-URL: "https://example\.org/"', 'image-credits-URL: "https://tedt.org/"'),
        (r'image-credits-artist: "Content Creator"', 'image-credits-artist: "Ted Tschopp"'),
        (r'image-credits-artist-URL: "https://example\.org/"', 'image-credits-artist-URL: "https://tedt.org/"'),
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
                print(f"✅ Restored: {file_path.name}")
        
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    if files_changed:
        print(f"\n🎉 Successfully restored {len(files_changed)} files:")
        for filename in sorted(files_changed):
            print(f"   - {filename}")
    else:
        print("ℹ️  No files needed restoring.")
    
    print(f"\n✅ Restoration complete! Processed {len(md_files)} files.")

if __name__ == "__main__":
    restore_files()