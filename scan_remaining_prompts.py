#!/usr/bin/env python3
"""
Scan remaining prompts directory for SCE, Edison, and PSPS references
"""

import os
import re
from pathlib import Path

def scan_for_references(directory):
    """Scan all .md files in directory for company references"""
    references = {
        'SCE': [],
        'Edison': [],
        'PSPS': [],
        'Southern California Edison': []
    }
    
    patterns = {
        'SCE': re.compile(r'\bSCE\b', re.IGNORECASE),
        'Edison': re.compile(r'\bEdison\b', re.IGNORECASE),  
        'PSPS': re.compile(r'\bPSPS\b', re.IGNORECASE),
        'Southern California Edison': re.compile(r'Southern California Edison', re.IGNORECASE)
    }
    
    directory_path = Path(directory)
    
    for file_path in directory_path.glob("*.md"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            for term, pattern in patterns.items():
                matches = pattern.findall(content)
                if matches:
                    references[term].append({
                        'file': str(file_path),
                        'count': len(matches)
                    })
                    
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    return references

def main():
    directory = "/Users/tedtschopp/Developer/tedt.org/prompts"
    
    print(f"Scanning {directory} for company references...")
    references = scan_for_references(directory)
    
    total_files_with_refs = 0
    total_references = 0
    
    for term, files in references.items():
        if files:
            print(f"\n{term} references found:")
            for file_info in files:
                print(f"  - {file_info['file']}: {file_info['count']} occurrences")
                total_references += file_info['count']
            total_files_with_refs += len(files)
    
    if total_references == 0:
        print("\n✅ No SCE, Edison, PSPS, or Southern California Edison references found!")
    else:
        print(f"\n⚠️  Found {total_references} total references in {total_files_with_refs} files")

if __name__ == "__main__":
    main()