#!/usr/bin/env python3
"""
Find all files that mention SCE, Edison, or PSPS with specific context.
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
                # Case-insensitive search for the terms
                if re.search(rf'\b{re.escape(term)}\b', line, re.IGNORECASE):
                    matches.append({
                        'term': term,
                        'line_num': i + 1,
                        'line_content': line.strip(),
                        'context': get_context(lines, i, 2)  # 2 lines before and after
                    })
        
        return matches
        
    except Exception as e:
        return [{'error': f"Error reading file: {e}"}]

def get_context(lines, center_line, context_lines=2):
    """Get context around a specific line."""
    start = max(0, center_line - context_lines)
    end = min(len(lines), center_line + context_lines + 1)
    
    context = []
    for i in range(start, end):
        prefix = ">>> " if i == center_line else "    "
        context.append(f"{prefix}{i+1:3d}: {lines[i]}")
    
    return '\n'.join(context)

def scan_directory():
    """Scan the work-in-progress directory for specific terms."""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    # Terms to search for
    search_terms = ['SCE', 'Edison', 'PSPS', 'Southern California Edison']
    
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
        print("✅ No files found containing SCE, Edison, or PSPS references.")
        return
    
    print(f"🔍 FOUND {len(files_with_matches)} FILES WITH SCE/EDISON/PSPS REFERENCES")
    print("=" * 80)
    print()
    
    for file_data in files_with_matches:
        filename = file_data['file']
        matches = file_data['matches']
        
        print(f"📄 **{filename}**")
        print(f"   Found {len(matches)} reference(s)")
        print()
        
        # Group matches by term for better organization
        by_term = {}
        for match in matches:
            term = match['term']
            if term not in by_term:
                by_term[term] = []
            by_term[term].append(match)
        
        for term, term_matches in by_term.items():
            print(f"   🔍 **{term}** ({len(term_matches)} occurrence(s)):")
            
            for match in term_matches:
                print(f"      Line {match['line_num']}: {match['line_content'][:100]}{'...' if len(match['line_content']) > 100 else ''}")
                
                # Show context for first few matches to avoid overwhelming output
                if len(term_matches) <= 3:
                    print("      Context:")
                    for context_line in match['context'].split('\n'):
                        print(f"      {context_line}")
                    print()
            print()
        
        print("-" * 60)
        print()
    
    # Summary
    total_matches = sum(len(file_data['matches']) for file_data in files_with_matches)
    print(f"📊 **SUMMARY:**")
    print(f"Files with references: {len(files_with_matches)}")
    print(f"Total references found: {total_matches}")
    
    print(f"\n🎯 **FILES TO REVIEW:**")
    for file_data in files_with_matches:
        print(f"   • {file_data['file']}")

if __name__ == "__main__":
    main()