#!/usr/bin/env python3
"""
Find and remove duplicate prompts between _posts/Prompts and prompts/work-in-progress
"""

import os
import re
from pathlib import Path

def extract_prompt_content(file_path):
    """Extract the main prompt content from a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for prompt_content field
        if 'prompt_content:' in content:
            # Extract content after prompt_content:
            parts = content.split('prompt_content:', 1)
            if len(parts) > 1:
                prompt_part = parts[1]
                # Find the end of this section (either --- or end of file)
                end_match = re.search(r'\n---\n', prompt_part)
                if end_match:
                    prompt_part = prompt_part[:end_match.start()]
                
                # Clean up the content - remove YAML formatting
                lines = prompt_part.split('\n')
                cleaned_lines = []
                for line in lines:
                    # Remove leading pipe and spaces from YAML literal blocks
                    if line.startswith('  '):
                        cleaned_lines.append(line[2:])
                    elif line.strip() and not line.startswith('|'):
                        cleaned_lines.append(line.strip())
                
                return '\n'.join(cleaned_lines).strip()
        
        # If no prompt_content field, look in the body
        if '---' in content:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                body = parts[2].strip()
                return body[:1000]  # First 1000 chars for comparison
        
        return content[:1000]  # Fallback
        
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def normalize_text(text):
    """Normalize text for comparison."""
    # Remove extra whitespace, convert to lowercase
    text = re.sub(r'\s+', ' ', text.lower().strip())
    # Remove common formatting
    text = re.sub(r'[*_`#]', '', text)
    return text

def find_duplicates():
    """Find duplicate prompts between the two directories."""
    
    posts_dir = Path("/Users/tedtschopp/Developer/tedt.org/_posts/Prompts")
    wip_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not posts_dir.exists() or not wip_dir.exists():
        print("One or both directories not found")
        return
    
    # Get all published prompts
    published_prompts = {}
    for file_path in posts_dir.glob("*.md"):
        content = extract_prompt_content(file_path)
        normalized = normalize_text(content)
        if normalized:
            published_prompts[file_path.name] = {
                'path': file_path,
                'content': normalized,
                'raw_content': content
            }
    
    # Check work-in-progress prompts against published ones
    duplicates = []
    
    for wip_file in wip_dir.glob("*.md"):
        wip_content = extract_prompt_content(wip_file)
        wip_normalized = normalize_text(wip_content)
        
        if not wip_normalized:
            continue
        
        # Look for matches
        for pub_name, pub_data in published_prompts.items():
            pub_normalized = pub_data['content']
            
            # Check for substantial similarity
            if len(wip_normalized) > 50 and len(pub_normalized) > 50:
                # Simple similarity check - look for common phrases
                wip_words = set(wip_normalized.split())
                pub_words = set(pub_normalized.split())
                
                if len(wip_words) > 0 and len(pub_words) > 0:
                    intersection = wip_words.intersection(pub_words)
                    union = wip_words.union(pub_words)
                    similarity = len(intersection) / len(union) if union else 0
                    
                    # Also check for exact phrase matches
                    common_phrases = 0
                    wip_phrases = [wip_normalized[i:i+50] for i in range(0, len(wip_normalized)-49, 25)]
                    for phrase in wip_phrases[:10]:  # Check first 10 phrases
                        if phrase in pub_normalized:
                            common_phrases += 1
                    
                    phrase_similarity = common_phrases / min(10, len(wip_phrases)) if wip_phrases else 0
                    
                    if similarity > 0.6 or phrase_similarity > 0.3:
                        duplicates.append({
                            'wip_file': wip_file,
                            'published_file': pub_data['path'],
                            'similarity': max(similarity, phrase_similarity),
                            'wip_content_preview': wip_content[:200],
                            'pub_content_preview': pub_data['raw_content'][:200]
                        })
    
    return duplicates

def main():
    print("Scanning for duplicate prompts...")
    duplicates = find_duplicates()
    
    if not duplicates:
        print("No clear duplicates found.")
        return
    
    print(f"\nFound {len(duplicates)} potential duplicates:")
    
    for i, dup in enumerate(duplicates, 1):
        print(f"\n--- Duplicate {i} ---")
        print(f"WIP File: {dup['wip_file'].name}")
        print(f"Published File: {dup['published_file'].name}")
        print(f"Similarity Score: {dup['similarity']:.2f}")
        print(f"WIP Preview: {dup['wip_content_preview'][:100]}...")
        print(f"Published Preview: {dup['pub_content_preview'][:100]}...")
        
        # Ask for confirmation to delete
        response = input(f"Delete {dup['wip_file'].name}? (y/N): ").strip().lower()
        if response == 'y':
            try:
                dup['wip_file'].unlink()
                print(f"Deleted: {dup['wip_file'].name}")
            except Exception as e:
                print(f"Error deleting {dup['wip_file'].name}: {e}")
        else:
            print(f"Kept: {dup['wip_file'].name}")

if __name__ == "__main__":
    main()