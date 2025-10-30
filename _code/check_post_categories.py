#!/usr/bin/env python3
"""
Consolidated category checking utility for Jekyll posts.

This script consolidates the functionality of multiple similar scripts:
- find_empty_categories.py
- find_truly_empty_categories.py
- find_posts_without_categories.py
- find_non_gamma_world_posts_without_categories.py

Usage:
    python check_post_categories.py [OPTIONS]

Options:
    --posts-dir PATH        Path to _posts directory (default: inferred from script location)
    --exclude-gamma-world   Skip Gamma World posts (default: True)
    --include-gamma-world   Include Gamma World posts
    --check-type TYPE       Type of check: missing, empty, or truly-empty (default: missing)
                           - missing: No category field at all
                           - empty: Category field exists but has no value
                           - truly-empty: Only matches 'categories:' with no content after
    --help, -h             Show this help message
"""

import os
import re
import sys
import argparse
from pathlib import Path


def check_post_missing_categories(file_path):
    """Check if a file has no categories field at all."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract front matter
        front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)
        front_matter_match = front_matter_pattern.search(content)
        
        if not front_matter_match:
            return True  # No front matter
        
        front_matter = front_matter_match.group(1)
        
        # Check for categories/category field
        has_categories_pattern = re.compile(r'^\s*categor(?:y|ies):', re.MULTILINE)
        return not has_categories_pattern.search(front_matter)
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}", file=sys.stderr)
        return False


def check_post_empty_categories(file_path):
    """Check if a file has empty or missing categories."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract front matter
        front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)
        front_matter_match = front_matter_pattern.search(content)
        
        if not front_matter_match:
            return True  # No front matter, consider it missing categories
        
        front_matter = front_matter_match.group(1)
        
        # Check for categories/category field
        category_pattern = re.compile(r'^\s*categor(?:y|ies):\s*(.*?)$', re.MULTILINE)
        category_match = category_pattern.search(front_matter)
        
        if not category_match:
            return True  # No category field at all
        
        # Check if the value is empty
        category_value = category_match.group(1).strip()
        if not category_value:
            # Check if the next line might contain list items (indented lines with dashes)
            pos = category_match.end()
            rest_of_content = front_matter[pos:]
            next_lines = rest_of_content.split('\n')
            
            for line in next_lines:
                if re.match(r'^\s*-\s+\S+', line):  # Line starts with whitespace, dash, whitespace, then non-whitespace
                    return False  # Has a list item, so not empty
                elif re.match(r'^\s*[a-zA-Z]', line):  # Next non-empty line starts with a letter (likely a new field)
                    return True  # No list items before next field
                
        return True if not category_value else False
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}", file=sys.stderr)
        return False


def check_post_truly_empty_categories(file_path):
    """Check if a file has 'categories:' with nothing after it (truly empty)."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract front matter
        front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---', re.DOTALL)
        front_matter_match = front_matter_pattern.search(content)
        
        if not front_matter_match:
            return False  # No front matter, skip it
        
        front_matter = front_matter_match.group(1)
        
        # Look for the pattern "categories:" followed by a blank line or no content
        empty_categories_pattern = re.compile(r'categories:\s*$', re.MULTILINE)
        if empty_categories_pattern.search(front_matter):
            # Check if there's no indented content after it
            lines = front_matter.split('\n')
            for i, line in enumerate(lines):
                if 'categories:' in line and line.strip() == 'categories:':
                    # If this is the last line or next line isn't indented
                    if i+1 >= len(lines) or not lines[i+1].startswith(' '):
                        return True  # Empty categories
                        
        return False  # Has categories or we couldn't determine
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}", file=sys.stderr)
        return False


def find_posts_with_category_issues(posts_dir, check_type='missing', exclude_gamma_world=True):
    """
    Find posts with category issues based on check_type.
    
    Args:
        posts_dir: Path to _posts directory
        check_type: Type of check ('missing', 'empty', or 'truly-empty')
        exclude_gamma_world: Whether to exclude Gamma World posts
    
    Returns:
        List of file paths with category issues
    """
    check_functions = {
        'missing': check_post_missing_categories,
        'empty': check_post_empty_categories,
        'truly-empty': check_post_truly_empty_categories,
    }
    
    if check_type not in check_functions:
        raise ValueError(f"Invalid check_type: {check_type}. Must be one of: {', '.join(check_functions.keys())}")
    
    check_func = check_functions[check_type]
    posts_with_issues = []
    
    for root, dirs, files in os.walk(posts_dir):
        if exclude_gamma_world and "Gamma World" in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                if check_func(file_path):
                    posts_with_issues.append(file_path)
    
    return posts_with_issues


def main():
    parser = argparse.ArgumentParser(
        description='Check Jekyll posts for category issues',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    # Infer default posts directory from script location
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    default_posts_dir = repo_root / '_posts'
    
    parser.add_argument(
        '--posts-dir',
        type=str,
        default=str(default_posts_dir),
        help=f'Path to _posts directory (default: {default_posts_dir})'
    )
    
    parser.add_argument(
        '--check-type',
        type=str,
        choices=['missing', 'empty', 'truly-empty'],
        default='missing',
        help='Type of check to perform (default: missing)'
    )
    
    gamma_group = parser.add_mutually_exclusive_group()
    gamma_group.add_argument(
        '--exclude-gamma-world',
        action='store_true',
        default=True,
        help='Skip Gamma World posts (default)'
    )
    gamma_group.add_argument(
        '--include-gamma-world',
        action='store_true',
        help='Include Gamma World posts in check'
    )
    
    args = parser.parse_args()
    
    # Check if posts directory exists
    if not os.path.isdir(args.posts_dir):
        print(f"Error: Posts directory not found: {args.posts_dir}", file=sys.stderr)
        sys.exit(1)
    
    exclude_gamma_world = not args.include_gamma_world
    
    # Run the check
    result = find_posts_with_category_issues(
        args.posts_dir,
        check_type=args.check_type,
        exclude_gamma_world=exclude_gamma_world
    )
    
    # Report results
    check_type_labels = {
        'missing': 'without categories',
        'empty': 'with empty categories',
        'truly-empty': 'with truly empty categories (categories: only)'
    }
    
    gamma_note = " (excluding Gamma World)" if exclude_gamma_world else ""
    
    if result:
        print(f"Found {len(result)} posts {check_type_labels[args.check_type]}{gamma_note}:")
        for file_path in sorted(result):
            rel_path = os.path.relpath(file_path, repo_root)
            print(f"- {rel_path}")
        sys.exit(1)  # Exit with error code if issues found
    else:
        print(f"No posts {check_type_labels[args.check_type]}{gamma_note}.")
        sys.exit(0)


if __name__ == "__main__":
    main()
