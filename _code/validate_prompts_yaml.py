#!/usr/bin/env python3
"""
Comprehensive YAML Front Matter Review for Prompts
Validates all markdown files in _posts/Prompts/ directory
"""

import os
import yaml
import re
from pathlib import Path
from collections import defaultdict

# Configuration
PROMPTS_DIR = Path("_posts/Prompts")
REQUIRED_FIELDS = ['layout', 'title', 'date', 'categories', 'tags', 'keywords']
VALID_LAYOUTS = ['prompt-details', 'post', 'page']
RECOMMENDED_TAG_RANGE = (3, 5)
RECOMMENDED_KEYWORD_RANGE = (5, 10)

# Results tracking
results = {
    'total': 0,
    'critical_errors': [],
    'warnings': [],
    'clean': [],
    'field_stats': defaultdict(lambda: defaultdict(int)),
    'common_issues': defaultdict(int)
}


def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown content"""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        return match.group(1), match.span()
    return None, None


def validate_yaml_syntax(yaml_str):
    """Validate YAML syntax and return parsed data or errors"""
    try:
        data = yaml.safe_load(yaml_str)
        return data, None
    except yaml.YAMLError as e:
        return None, str(e)


def check_indentation_issues(yaml_str):
    """Check for common indentation problems"""
    issues = []
    lines = yaml_str.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Check for tabs
        if '\t' in line:
            issues.append(f"Line {i}: Contains tab character (use 2 spaces)")
        
        # Check for odd indentation
        if line.startswith(' ') and not line.startswith('  ') and not line.strip().startswith('-'):
            leading_spaces = len(line) - len(line.lstrip(' '))
            if leading_spaces % 2 != 0:
                issues.append(f"Line {i}: Odd number of leading spaces ({leading_spaces})")
    
    return issues


def check_quote_issues(yaml_str):
    """Check for unescaped quotes and other quoting issues"""
    issues = []
    lines = yaml_str.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Skip comments and list items
        if line.strip().startswith('#') or line.strip().startswith('-'):
            continue
        
        if ':' in line:
            key, _, value = line.partition(':')
            value = value.strip()
            
            # Check for unescaped quotes in unquoted strings
            if value and not value.startswith('"') and not value.startswith("'"):
                if '"' in value and not value.startswith('['):
                    issues.append(f"Line {i}: Unescaped quote in value: {value[:50]}")
    
    return issues


def validate_file(filepath):
    """Validate a single markdown file's YAML frontmatter"""
    filename = filepath.name
    file_issues = []
    file_warnings = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for frontmatter delimiters
        yaml_content, span = extract_frontmatter(content)
        
        if yaml_content is None:
            results['common_issues']['missing_delimiters'] += 1
            return {
                'file': filename,
                'error': 'Missing or malformed YAML frontmatter delimiters (---)',
                'type': 'SYNTAX',
                'critical': True
            }
        
        # Check for trailing spaces after delimiters
        first_line = content.split('\n')[0]
        if first_line != '---':
            file_warnings.append(f"First line has trailing content: '{first_line}'")
        
        # Check indentation
        indent_issues = check_indentation_issues(yaml_content)
        if indent_issues:
            file_warnings.extend(indent_issues)
        
        # Check quote issues
        quote_issues = check_quote_issues(yaml_content)
        if quote_issues:
            file_warnings.extend(quote_issues)
        
        # Validate YAML syntax
        data, yaml_error = validate_yaml_syntax(yaml_content)
        
        if yaml_error:
            results['common_issues']['yaml_parse_error'] += 1
            return {
                'file': filename,
                'error': f'YAML parse error: {yaml_error}',
                'type': 'SYNTAX',
                'critical': True
            }
        
        if not isinstance(data, dict):
            return {
                'file': filename,
                'error': 'Frontmatter is not a valid dictionary',
                'type': 'STRUCTURE',
                'critical': True
            }
        
        # Check required fields
        missing_fields = [f for f in REQUIRED_FIELDS if f not in data or data[f] is None]
        if missing_fields:
            file_issues.append(f"Missing required fields: {', '.join(missing_fields)}")
            results['common_issues']['missing_required_fields'] += 1
        
        # Validate layout
        if 'layout' in data:
            layout = data['layout']
            results['field_stats']['layout'][layout] += 1
            if layout not in VALID_LAYOUTS:
                file_warnings.append(f"Unexpected layout value: '{layout}' (expected: {', '.join(VALID_LAYOUTS)})")
                results['common_issues']['invalid_layout'] += 1
        
        # Validate categories
        if 'categories' in data:
            cats = data['categories']
            if isinstance(cats, list):
                # Check for Prompts category
                if 'Prompts' not in cats:
                    file_warnings.append("'Prompts' category not found in categories list")
                    results['common_issues']['missing_prompts_category'] += 1
                
                # Check for nested structures (indentation errors)
                for cat in cats:
                    if isinstance(cat, dict):
                        file_issues.append(f"Categories contain nested structure (indentation error): {cat}")
                        results['common_issues']['nested_category_structure'] += 1
            elif isinstance(cats, str):
                file_warnings.append("Categories is a string, should be a list")
                results['common_issues']['categories_wrong_type'] += 1
            else:
                file_issues.append(f"Categories is not a list: {type(cats)}")
        
        # Validate tags
        if 'tags' in data:
            tags = data['tags']
            if isinstance(tags, list):
                tag_count = len(tags)
                results['field_stats']['tags_count'][tag_count] += 1
                if tag_count < RECOMMENDED_TAG_RANGE[0] or tag_count > RECOMMENDED_TAG_RANGE[1]:
                    file_warnings.append(f"Tags count ({tag_count}) outside recommended range ({RECOMMENDED_TAG_RANGE[0]}-{RECOMMENDED_TAG_RANGE[1]})")
                    results['common_issues']['tags_count_outside_range'] += 1
            else:
                file_issues.append(f"Tags is not a list: {type(tags)}")
                results['common_issues']['tags_wrong_type'] += 1
        
        # Validate keywords
        if 'keywords' in data:
            keywords = data['keywords']
            if isinstance(keywords, list):
                kw_count = len(keywords)
                results['field_stats']['keywords_count'][kw_count] += 1
                if kw_count < RECOMMENDED_KEYWORD_RANGE[0] or kw_count > RECOMMENDED_KEYWORD_RANGE[1]:
                    file_warnings.append(f"Keywords count ({kw_count}) outside recommended range ({RECOMMENDED_KEYWORD_RANGE[0]}-{RECOMMENDED_KEYWORD_RANGE[1]})")
                    results['common_issues']['keywords_count_outside_range'] += 1
            else:
                file_issues.append(f"Keywords is not a list: {type(keywords)}")
                results['common_issues']['keywords_wrong_type'] += 1
        
        # Check for image without image-alt
        if 'image' in data and data['image']:
            if 'image-alt' not in data or not data['image-alt']:
                file_warnings.append("Image defined but missing image-alt text (accessibility issue)")
                results['common_issues']['missing_image_alt'] += 1
        
        # Check for empty or placeholder values
        empty_fields = []
        for key, value in data.items():
            if value == "" or value == [] or (value is None and key not in ['mastodon-post-id', 'update']):
                empty_fields.append(key)
        if empty_fields:
            file_warnings.append(f"Empty or null values: {', '.join(empty_fields)}")
            results['common_issues']['empty_values'] += 1
        
        # Check date format
        if 'date' in data:
            date_str = str(data['date'])
            # Valid formats: YYYY-MM-DD or ISO 8601
            if not re.match(r'^\d{4}-\d{2}-\d{2}', date_str):
                file_warnings.append(f"Date format may be incorrect: '{date_str}'")
        
        # Check for inconsistent field naming
        field_styles = []
        for key in data.keys():
            if '-' in key:
                field_styles.append('kebab-case')
            elif '_' in key:
                field_styles.append('snake_case')
        if 'kebab-case' in field_styles and 'snake_case' in field_styles:
            file_warnings.append("Mixed field naming conventions (kebab-case and snake_case)")
            results['common_issues']['mixed_field_naming'] += 1
        
        # Return results
        if file_issues:
            return {
                'file': filename,
                'error': '; '.join(file_issues),
                'type': 'VALIDATION',
                'critical': True,
                'warnings': file_warnings
            }
        elif file_warnings:
            return {
                'file': filename,
                'warnings': file_warnings,
                'critical': False
            }
        else:
            return {
                'file': filename,
                'critical': False,
                'clean': True
            }
            
    except Exception as e:
        results['common_issues']['file_read_error'] += 1
        return {
            'file': filename,
            'error': f'File read error: {str(e)}',
            'type': 'FILE',
            'critical': True
        }


def print_report():
    """Print comprehensive analysis report"""
    print("=" * 80)
    print("YAML FRONT MATTER REVIEW REPORT FOR PROMPTS")
    print("=" * 80)
    print()
    
    print("1. SUMMARY STATISTICS")
    print("-" * 80)
    print(f"Total files reviewed:        {results['total']}")
    print(f"Files with critical errors:  {len(results['critical_errors'])}")
    print(f"Files with warnings only:    {len(results['warnings'])}")
    print(f"Clean files:                 {len(results['clean'])}")
    print()
    
    if results['critical_errors']:
        print("=" * 80)
        print("2. CRITICAL ERRORS (May Block Jekyll Build or Cause Issues)")
        print("=" * 80)
        for i, error in enumerate(results['critical_errors'], 1):
            print(f"\n{i}. File: {error['file']}")
            print(f"   Type: {error['type']}")
            print(f"   Error: {error['error']}")
            if 'warnings' in error and error['warnings']:
                print(f"   Additional warnings:")
                for w in error['warnings']:
                    print(f"     - {w}")
    
    if results['warnings']:
        print()
        print("=" * 80)
        print("3. WARNINGS (Builds Successfully But May Cause Issues)")
        print("=" * 80)
        for i, warning in enumerate(results['warnings'], 1):
            print(f"\n{i}. File: {warning['file']}")
            for w in warning['warnings']:
                print(f"   - {w}")
    
    print()
    print("=" * 80)
    print("4. FIELD STATISTICS")
    print("=" * 80)
    
    print("\nLayout Distribution:")
    for layout, count in sorted(results['field_stats']['layout'].items()):
        print(f"  {layout}: {count} files")
    
    print("\nTags Count Distribution:")
    for count, files in sorted(results['field_stats']['tags_count'].items()):
        status = "✓" if RECOMMENDED_TAG_RANGE[0] <= count <= RECOMMENDED_TAG_RANGE[1] else "⚠"
        print(f"  {status} {count} tags: {files} files")
    
    print("\nKeywords Count Distribution:")
    for count, files in sorted(results['field_stats']['keywords_count'].items()):
        status = "✓" if RECOMMENDED_KEYWORD_RANGE[0] <= count <= RECOMMENDED_KEYWORD_RANGE[1] else "⚠"
        print(f"  {status} {count} keywords: {files} files")
    
    print()
    print("=" * 80)
    print("5. COMMON ISSUES FREQUENCY")
    print("=" * 80)
    for issue, count in sorted(results['common_issues'].items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            print(f"  {issue.replace('_', ' ').title()}: {count} files")
    
    print()
    print("=" * 80)
    print("6. RECOMMENDATIONS")
    print("=" * 80)
    print()
    
    recommendations = []
    
    if results['common_issues']['missing_prompts_category'] > 0:
        recommendations.append(
            "• Ensure all prompt files include 'Prompts' in their categories array"
        )
    
    if results['common_issues']['tags_count_outside_range'] > 0:
        recommendations.append(
            f"• Standardize tags to {RECOMMENDED_TAG_RANGE[0]}-{RECOMMENDED_TAG_RANGE[1]} entries per file for consistency"
        )
    
    if results['common_issues']['keywords_count_outside_range'] > 0:
        recommendations.append(
            f"• Standardize keywords to {RECOMMENDED_KEYWORD_RANGE[0]}-{RECOMMENDED_KEYWORD_RANGE[1]} entries per file for SEO"
        )
    
    if results['common_issues']['missing_image_alt'] > 0:
        recommendations.append(
            "• Add image-alt text to all files with images (accessibility requirement)"
        )
    
    if results['common_issues']['empty_values'] > 0:
        recommendations.append(
            "• Remove or populate empty fields (quote, excerpt, source-url, etc.)"
        )
    
    if results['common_issues']['nested_category_structure'] > 0:
        recommendations.append(
            "• Fix category indentation errors - categories should be a flat list"
        )
    
    if results['common_issues']['mixed_field_naming'] > 0:
        recommendations.append(
            "• Standardize on kebab-case for field names (image-alt not image_alt)"
        )
    
    recommendations.extend([
        "• Consider using multiline YAML ('>-' or '|') for long descriptions",
        "• Ensure all string values with colons or special chars are quoted",
        "• Use boolean true/false (not 'true'/'false' strings) for flags",
        "• Validate dates are in YYYY-MM-DD or ISO 8601 format"
    ])
    
    for rec in recommendations:
        print(rec)
    
    print()
    print("=" * 80)
    print("END OF REPORT")
    print("=" * 80)


def main():
    """Main execution function"""
    if not PROMPTS_DIR.exists():
        print(f"Error: Directory {PROMPTS_DIR} not found")
        return
    
    files = sorted(PROMPTS_DIR.glob("*.md"))
    results['total'] = len(files)
    
    print(f"Analyzing {results['total']} prompt files...\n")
    
    for filepath in files:
        result = validate_file(filepath)
        
        if result.get('clean'):
            results['clean'].append(result['file'])
        elif result.get('critical'):
            results['critical_errors'].append(result)
        else:
            results['warnings'].append(result)
    
    print_report()


if __name__ == '__main__':
    main()
