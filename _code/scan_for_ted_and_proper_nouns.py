#!/usr/bin/env python3
"""
Comprehensive scanner for Ted/Tschopp references and proper nouns in prompt files.
Scans all files in /prompts/work-in-progress/ for:
1. Any references to "Ted" or "Tschopp" (case-insensitive)
2. All proper nouns (capitalized words, company names, brand names, etc.)
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def extract_proper_nouns(text):
    """Extract potential proper nouns from text."""
    proper_nouns = set()
    
    # Pattern for words that start with capital letter
    # Exclude common words that are often capitalized for other reasons
    exclude_words = {
        'The', 'A', 'An', 'And', 'Or', 'But', 'For', 'Nor', 'So', 'Yet',
        'As', 'At', 'By', 'In', 'Of', 'On', 'To', 'Up', 'It', 'Is', 'Be',
        'Are', 'Was', 'Were', 'Been', 'Have', 'Has', 'Had', 'Do', 'Does',
        'Did', 'Will', 'Would', 'Could', 'Should', 'May', 'Might', 'Must',
        'Can', 'Cannot', 'This', 'That', 'These', 'Those', 'Here', 'There',
        'Where', 'When', 'Why', 'How', 'What', 'Which', 'Who', 'Whom',
        'Given', 'When', 'Then', 'And', 'Or', 'If', 'Unless', 'Until',
        'While', 'Since', 'Before', 'After', 'During', 'Between', 'Among',
        'Through', 'Throughout', 'Above', 'Below', 'Over', 'Under', 'Within'
    }
    
    # Find capitalized words (potential proper nouns)
    capitalized_words = re.findall(r'\b[A-Z][a-zA-Z]+\b', text)
    
    for word in capitalized_words:
        if word not in exclude_words and len(word) > 1:
            proper_nouns.add(word)
    
    # Find multi-word proper nouns (like "Microsoft Power Platform")
    multi_word_patterns = [
        r'\b[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)+\b',  # Multiple capitalized words
        r'\b[A-Z]{2,}\b',  # Acronyms like API, UI, etc.
        r'\b[A-Z][a-zA-Z]*[A-Z][a-zA-Z]*\b',  # CamelCase words
    ]
    
    for pattern in multi_word_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            # Split compound proper nouns and add individual parts
            words = re.findall(r'[A-Z][a-z]*', match)
            for word in words:
                if word not in exclude_words and len(word) > 1:
                    proper_nouns.add(word)
            # Also add the full match if it's multi-word
            if ' ' in match:
                proper_nouns.add(match)
    
    return sorted(proper_nouns)

def scan_files():
    """Scan all markdown files in prompts/work-in-progress/"""
    base_path = Path("prompts/work-in-progress")
    
    if not base_path.exists():
        print(f"❌ Directory not found: {base_path}")
        return
    
    md_files = list(base_path.glob("*.md"))
    
    if not md_files:
        print(f"❌ No .md files found in {base_path}")
        return
    
    print(f"🔍 Scanning {len(md_files)} files for Ted/Tschopp references and proper nouns...\n")
    
    ted_references = []
    all_proper_nouns = defaultdict(set)  # file -> set of proper nouns
    
    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for Ted/Tschopp references
            ted_pattern = r'\b(?:ted|tschopp)\b'
            ted_matches = []
            
            for line_num, line in enumerate(content.splitlines(), 1):
                if re.search(ted_pattern, line, re.IGNORECASE):
                    ted_matches.append((line_num, line.strip()))
            
            if ted_matches:
                ted_references.append((file_path, ted_matches))
            
            # Extract proper nouns
            proper_nouns = extract_proper_nouns(content)
            if proper_nouns:
                all_proper_nouns[file_path] = set(proper_nouns)
        
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")
    
    # Report Ted/Tschopp references
    if ted_references:
        print("🚨 FOUND TED/TSCHOPP REFERENCES:")
        print("=" * 50)
        for file_path, matches in ted_references:
            print(f"\n📁 File: {file_path}")
            for line_num, line in matches:
                print(f"   Line {line_num}: {line}")
    else:
        print("✅ No Ted/Tschopp references found!")
    
    print("\n" + "=" * 80)
    
    # Report proper nouns by file
    if all_proper_nouns:
        print("\n📝 PROPER NOUNS BY FILE:")
        print("=" * 50)
        
        # Also collect all unique proper nouns across all files
        all_unique_proper_nouns = set()
        
        for file_path, proper_nouns in all_proper_nouns.items():
            print(f"\n📁 File: {file_path.name}")
            print(f"   Count: {len(proper_nouns)}")
            
            # Group by type for better readability
            tech_terms = [noun for noun in proper_nouns if any(tech in noun.lower() for tech in ['app', 'api', 'platform', 'power', 'microsoft', 'dataverse', 'azure', 'office', 'excel', 'sql', 'json', 'xml', 'http', 'ui', 'ux'])]
            business_terms = [noun for noun in proper_nouns if any(biz in noun.lower() for biz in ['utility', 'electric', 'energy', 'field', 'technician', 'supervisor', 'manager', 'operations', 'maintenance', 'inspection'])]
            other_terms = [noun for noun in proper_nouns if noun not in tech_terms and noun not in business_terms]
            
            if tech_terms:
                print(f"   🔧 Technology: {', '.join(sorted(tech_terms))}")
            if business_terms:
                print(f"   🏢 Business: {', '.join(sorted(business_terms))}")
            if other_terms:
                print(f"   📚 Other: {', '.join(sorted(other_terms))}")
            
            all_unique_proper_nouns.update(proper_nouns)
        
        print(f"\n🔍 SUMMARY - UNIQUE PROPER NOUNS ACROSS ALL FILES:")
        print("=" * 50)
        print(f"Total unique proper nouns found: {len(all_unique_proper_nouns)}")
        
        # Categorize all proper nouns
        tech_all = [noun for noun in all_unique_proper_nouns if any(tech in noun.lower() for tech in ['app', 'api', 'platform', 'power', 'microsoft', 'dataverse', 'azure', 'office', 'excel', 'sql', 'json', 'xml', 'http', 'ui', 'ux', 'canvas', 'automate'])]
        business_all = [noun for noun in all_unique_proper_nouns if any(biz in noun.lower() for biz in ['utility', 'electric', 'energy', 'field', 'technician', 'supervisor', 'manager', 'operations', 'maintenance', 'inspection', 'falcon', 'project'])]
        methodology_all = [noun for noun in all_unique_proper_nouns if any(method in noun.lower() for method in ['agile', 'smart', 'moscow', 'invest', 'scrum', 'kanban', 'devops', 'qa', 'qdr', 'prd', 'bdd', 'tdd'])]
        standards_all = [noun for noun in all_unique_proper_nouns if any(std in noun.lower() for std in ['iso', 'ieee', 'wcag', 'owasp', 'nist', 'sox', 'coso', 'nerc', 'cip', 'osha'])]
        other_all = [noun for noun in all_unique_proper_nouns if noun not in tech_all and noun not in business_all and noun not in methodology_all and noun not in standards_all]
        
        if tech_all:
            print(f"\n🔧 Technology ({len(tech_all)}):")
            print(f"   {', '.join(sorted(tech_all))}")
        
        if business_all:
            print(f"\n🏢 Business/Domain ({len(business_all)}):")
            print(f"   {', '.join(sorted(business_all))}")
        
        if methodology_all:
            print(f"\n📋 Methodology/Process ({len(methodology_all)}):")
            print(f"   {', '.join(sorted(methodology_all))}")
        
        if standards_all:
            print(f"\n📜 Standards/Compliance ({len(standards_all)}):")
            print(f"   {', '.join(sorted(standards_all))}")
        
        if other_all:
            print(f"\n📚 Other ({len(other_all)}):")
            print(f"   {', '.join(sorted(other_all))}")
        
    else:
        print("ℹ️  No proper nouns found.")
    
    print(f"\n✅ Scan complete! Checked {len(md_files)} files.")

if __name__ == "__main__":
    scan_files()