#!/usr/bin/env python3
"""
Fix the category format in the 2025-10-17 prompt files
"""

import os
import re
from pathlib import Path

def fix_category_format():
    """Fix malformed categories in the prompt files"""
    prompts_dir = Path("/Users/tedtschopp/Developer/tedt.org/_posts/Prompts")
    
    updated_files = []
    
    for file_path in prompts_dir.glob("2025-10-17-*.md"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix the nested category format
            if "categories:\n- Prompts\n    - Projects" in content:
                new_content = content.replace(
                    "categories:\n- Prompts\n    - Projects",
                    "categories:\n- Prompts\n- Projects"
                )
                
                # Write back the updated content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_files.append(str(file_path))
                print(f"✅ Fixed categories in: {file_path.name}")
                
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    print(f"\n📊 Fixed {len(updated_files)} files")
    return updated_files

if __name__ == "__main__":
    print("🔧 Fixing category format in prompt files...")
    fix_category_format()
    print("✅ Done!")