#!/usr/bin/env python3
"""
Find all files that mention Edison or SCE with specific context.
"""

import os
import re
from pathlib import Path

def search_for_terms(file_path, terms):
    """Search for specific terms in a file and return matches with context."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            for term in terms:
                # Case-insensitive search for the terms as whole words
                if re.search(rf'\b{re.escape(term)}\b', line, re.IGNORECASE):
                    matches.append({
                        'term': term,
                        'line_num': i + 1,
                        'line_content': line.strip(),
                        'context': get_context(lines, i, 1)  # 1 line before and after
                    })
        
        return matches
        
    except Exception as e:
        return [{'error': f"Error reading file: {e}"}]

def get_context(lines, center_line, context_lines=1):
    """Get context around a specific line."""
    start = max(0, center_line - context_lines)
    end = min(len(lines), center_line + context_lines + 1)
    
    context = []
    for i in range(start, end):
        prefix = ">>> " if i == center_line else "    "
        context.append(f"{prefix}{i+1:3d}: {lines[i]}")
    
    return '\n'.join(context)

def scan_directory():
    """Scan the work-in-progress directory for Edison and SCE."""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    # Terms to search for - focused on Edison and SCE
    search_terms = ['Edison', 'SCE']
    
    md_files = list(work_dir.glob("*.md"))
    files_with_matches = []
    
    for file_path in md_files:
        matches = search_for_terms(file_path, search_terms)
        if matches and not any('error' in match for match in matches):
            files_with_matches.append({
                'file': file_path.name,
                'matches': matches
            })
    
    return files_with_matches, search_terms

def main():
    files_with_matches, search_terms = scan_directory()
    
    if not files_with_matches:
        print("✅ No files found containing Edison or SCE references.")
        return
    
    print(f"🔍 FOUND {len(files_with_matches)} FILES WITH EDISON/SCE REFERENCES")
    print("=" * 80)
    print()
    
    # Count totals
    edison_total = 0
    sce_total = 0
    
    for file_data in files_with_matches:
        filename = file_data['file']
        matches = file_data['matches']
        
        edison_count = len([m for m in matches if m['term'].lower() == 'edison'])
        sce_count = len([m for m in matches if m['term'].lower() == 'sce'])
        
        edison_total += edison_count
        sce_total += sce_count
        
        print(f"📄 **{filename}**")
        if edison_count > 0:
            print(f"   • Edison: {edison_count} references")
        if sce_count > 0:
            print(f"   • SCE: {sce_count} references")
        print()
        
        # Show actual matches with context
        for match in matches:
            print(f"   🔍 **{match['term']}** (Line {match['line_num']}):")
            print(f"      {match['line_content'][:100]}{'...' if len(match['line_content']) > 100 else ''}")
            print("      Context:")
            for context_line in match['context'].split('\n'):
                print(f"      {context_line}")
            print()
        
        print("-" * 60)
        print()
    
    # Summary
    print(f"📊 **SUMMARY:**")
    print(f"Files with references: {len(files_with_matches)}")
    print(f"Edison references: {edison_total}")
    print(f"SCE references: {sce_total}")
    print(f"Total references: {edison_total + sce_total}")
    
    print(f"\n🎯 **FILES TO SANITIZE:**")
    for file_data in files_with_matches:
        filename = file_data['file']
        matches = file_data['matches']
        edison_count = len([m for m in matches if m['term'].lower() == 'edison'])
        sce_count = len([m for m in matches if m['term'].lower() == 'sce'])
        print(f"   • {filename} (Edison: {edison_count}, SCE: {sce_count})")

if __name__ == "__main__":
    main()