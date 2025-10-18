#!/usr/bin/env python3
"""
Add 'Prompts' category to all 2025-10-17 prompt files that have empty categories
"""

import os
import re
from pathlib import Path

def fix_categories_in_prompts():
    """Add Prompts category to files with empty categories"""
    prompts_dir = Path("/Users/tedtschopp/Developer/tedt.org/_posts/Prompts")
    
    updated_files = []
    
    for file_path in prompts_dir.glob("2025-10-17-*.md"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file has empty categories line
            if re.search(r'^categories:\s*$', content, re.MULTILINE):
                # Replace empty categories with Prompts category
                new_content = re.sub(
                    r'^categories:\s*$', 
                    'categories:\n- Prompts', 
                    content, 
                    flags=re.MULTILINE
                )
                
                # Write back the updated content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_files.append(str(file_path))
                print(f"✅ Updated: {file_path.name}")
                
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    print(f"\n📊 Updated {len(updated_files)} files")
    return updated_files

if __name__ == "__main__":
    print("🔧 Adding 'Prompts' category to new prompt files...")
    fix_categories_in_prompts()
    print("✅ Done!")