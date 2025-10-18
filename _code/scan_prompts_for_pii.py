#!/usr/bin/env python3
"""
Scan prompt files for PII, Edison/SCE references, and proper nouns.
"""

import os
import re
from pathlib import Path

def extract_text_content(file_path):
    """Extract text content from a markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract prompt_content field if it exists
        if 'prompt_content:' in content:
            parts = content.split('prompt_content:', 1)
            if len(parts) > 1:
                prompt_part = parts[1]
                # Find the end of this section
                end_match = re.search(r'\n---\n', prompt_part)
                if end_match:
                    prompt_part = prompt_part[:end_match.start()]
                
                # Clean up YAML formatting
                lines = prompt_part.split('\n')
                cleaned_lines = []
                for line in lines:
                    if line.startswith('  '):
                        cleaned_lines.append(line[2:])
                    elif line.strip() and not line.startswith('|'):
                        cleaned_lines.append(line.strip())
                
                return '\n'.join(cleaned_lines).strip()
        
        # If no prompt_content, get the whole content
        return content
        
    except Exception as e:
        return f"Error reading file: {e}"

def find_pii_and_references(text, filename):
    """Find PII, Edison/SCE references, and proper nouns."""
    findings = {
        'pii': [],
        'edison_sce': [],
        'proper_nouns': [],
        'suspicious_patterns': []
    }
    
    # Convert to lines for context
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        
        # Check for Edison/SCE references
        edison_patterns = [
            r'\b(edison|sce|southern california edison)\b',
            r'\b(psps|public safety power shutoff)\b',
            r'\b(wildfire|wild-fire|wild fire)\b'
        ]
        
        for pattern in edison_patterns:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for match in matches:
                findings['edison_sce'].append({
                    'file': filename,
                    'line': i + 1,
                    'text': line.strip(),
                    'match': match.group()
                })
        
        # Check for potential PII patterns
        pii_patterns = [
            (r'\b\d{3}-\d{2}-\d{4}\b', 'SSN'),
            (r'\b\d{3}-\d{3}-\d{4}\b', 'Phone'),
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 'Email'),
            (r'\b\d{1,5}\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b', 'Address'),
        ]
        
        for pattern, pii_type in pii_patterns:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for match in matches:
                findings['pii'].append({
                    'file': filename,
                    'line': i + 1,
                    'type': pii_type,
                    'text': line.strip(),
                    'match': match.group()
                })
        
        # Find proper nouns (capitalized words that aren't at start of sentence)
        # Exclude common false positives
        words = re.findall(r'\b[A-Z][a-z]+\b', line)
        for word in words:
            # Skip common false positives and single letters
            if word not in ['The', 'This', 'That', 'Then', 'There', 'They', 'These', 'Those', 'When', 'Where', 'What', 'Who', 'Why', 'How', 'Your', 'You', 'For', 'From', 'With', 'Without', 'Through', 'During', 'Before', 'After', 'Above', 'Below', 'Up', 'Down', 'In', 'On', 'At', 'By', 'Of', 'To', 'As', 'An', 'A', 'And', 'Or', 'But', 'So', 'If', 'Because', 'Since', 'While', 'Although', 'Unless', 'Until', 'Before', 'After', 'When', 'Where', 'Why', 'How', 'What', 'Which', 'Who', 'Whom', 'Whose'] and len(word) > 1:
                if word not in [item['word'] for item in findings['proper_nouns'] if item['file'] == filename]:
                    findings['proper_nouns'].append({
                        'file': filename,
                        'word': word,
                        'context': line.strip()[:100] + '...' if len(line.strip()) > 100 else line.strip()
                    })
    
    return findings

def scan_all_files():
    """Scan all files in work-in-progress directory."""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    md_files = list(work_dir.glob("*.md"))
    print(f"Scanning {len(md_files)} files for PII, Edison/SCE references, and proper nouns...\n")
    
    all_findings = {
        'pii': [],
        'edison_sce': [],
        'proper_nouns': [],
        'suspicious_patterns': []
    }
    
    for file_path in md_files:
        text_content = extract_text_content(file_path)
        findings = find_pii_and_references(text_content, file_path.name)
        
        # Merge findings
        for key in all_findings:
            all_findings[key].extend(findings[key])
    
    return all_findings

def print_findings(findings):
    """Print formatted findings."""
    
    # PII Findings
    if findings['pii']:
        print("🚨 POTENTIAL PII FOUND:")
        print("=" * 50)
        for item in findings['pii']:
            print(f"File: {item['file']}")
            print(f"Line: {item['line']}")
            print(f"Type: {item['type']}")
            print(f"Match: {item['match']}")
            print(f"Context: {item['text']}")
            print("-" * 30)
        print()
    else:
        print("✅ No PII patterns detected\n")
    
    # Edison/SCE References
    if findings['edison_sce']:
        print("⚠️  EDISON/SCE REFERENCES FOUND:")
        print("=" * 50)
        for item in findings['edison_sce']:
            print(f"File: {item['file']}")
            print(f"Line: {item['line']}")
            print(f"Match: {item['match']}")
            print(f"Context: {item['text']}")
            print("-" * 30)
        print()
    else:
        print("✅ No Edison/SCE references found\n")
    
    # Proper Nouns
    if findings['proper_nouns']:
        print("📝 PROPER NOUNS FOUND:")
        print("=" * 50)
        
        # Group by file for better readability
        files_with_nouns = {}
        for item in findings['proper_nouns']:
            if item['file'] not in files_with_nouns:
                files_with_nouns[item['file']] = []
            files_with_nouns[item['file']].append(item)
        
        for filename, nouns in files_with_nouns.items():
            print(f"\n📄 {filename}:")
            unique_words = list(set([noun['word'] for noun in nouns]))
            unique_words.sort()
            
            for word in unique_words:
                # Find first context for this word
                context = next(noun['context'] for noun in nouns if noun['word'] == word)
                print(f"  • {word} - {context}")
        print()
    else:
        print("✅ No proper nouns found\n")

def main():
    findings = scan_all_files()
    print_findings(findings)
    
    # Summary
    print("📊 SUMMARY:")
    print("=" * 50)
    print(f"PII Issues: {len(findings['pii'])}")
    print(f"Edison/SCE References: {len(findings['edison_sce'])}")
    print(f"Proper Nouns: {len(findings['proper_nouns'])}")

if __name__ == "__main__":
    main()