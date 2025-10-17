#!/usr/bin/env python3
"""
Add YAML front matter to prompt files in the work-in-progress directory.
"""

import os
import re
from pathlib import Path

# Base front matter template
FRONT_MATTER_TEMPLATE = """---
layout: post

title: "{title}"
subtitle: "{subtitle}"
quote: ""
excerpt: "{excerpt}"
source: "Original Content"
source-url: ""
call-to-action: ""

date: 2025-10-17
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
{bullets}

description: "{description}"

seo-description: "{seo_description}"

categories: 
{categories}

tags: 
{tags}

keywords: 
{keywords}

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: 
image-alt: ""
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-credits: "Ted Tschopp"
image-credits-URL: "https://tedt.org/"
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image-credits-title: ""
image-description: ""
image-title: ""
image_width: 
image_height: 

mastodon-post-id: 

---

"""

def extract_title_from_filename(filename):
    """Extract and clean title from filename"""
    # Remove file extension
    title = filename.replace('.md', '')
    
    # Remove leading exclamation and dash
    title = re.sub(r'^!\s*-\s*', '', title)
    
    # Replace hyphens and underscores with spaces
    title = title.replace('-', ' ').replace('_', ' ')
    
    # Clean up multiple spaces
    title = re.sub(r'\s+', ' ', title).strip()
    
    return title

def categorize_prompt(filename, content_preview=""):
    """Determine categories based on filename and content"""
    filename_lower = filename.lower()
    content_lower = content_preview.lower()
    
    categories = []
    
    # Primary category mapping
    if any(keyword in filename_lower for keyword in ['architecture', 'requirements', 'prd', 'business-case']):
        categories.append('Projects')
    elif any(keyword in filename_lower for keyword in ['ttrpg', 'vaesen', 'märchen', 'alpine', 'module']):
        categories.append('Role Playing Games')
    elif any(keyword in filename_lower for keyword in ['folklore', 'translate']):
        categories.append('ᚠᛟᛚᚲ ᛚᛟᚱᛖ - Folklore')
    elif any(keyword in filename_lower for keyword in ['communication', 'blog', 'writing', 'novelist', 'copy']):
        categories.append('Communications')
    elif any(keyword in filename_lower for keyword in ['business', 'goals', 'planning', 'lean']):
        categories.append('Opinion')
    elif any(keyword in filename_lower for keyword in ['midjourney', 'image', 'sora']):
        categories.append('AI')
    elif any(keyword in filename_lower for keyword in ['self improvement', 'simulation']):
        categories.append('Philosophy')
    elif any(keyword in filename_lower for keyword in ['automation', 'ai-agent', 'gpt']):
        categories.append('AI')
    else:
        categories.append('AI')  # Default category
    
    # Format for YAML
    formatted_categories = '\n'.join([f'    - {cat}' for cat in categories])
    return formatted_categories

def generate_tags(filename, content_preview=""):
    """Generate relevant tags based on filename and content"""
    filename_lower = filename.lower()
    tags = []
    
    # Tag mapping
    if 'architecture' in filename_lower:
        tags.extend(['Architecture', 'Requirements Engineering', 'Documentation'])
    if 'ttrpg' in filename_lower:
        tags.extend(['TTRPG', 'Roleplay', 'Game Master'])
    if 'communication' in filename_lower or 'blog' in filename_lower:
        tags.extend(['Content Creation', 'Writing', 'Communications'])
    if 'business' in filename_lower:
        tags.extend(['Business Strategy', 'Planning', 'Management'])
    if 'ai' in filename_lower or 'gpt' in filename_lower:
        tags.extend(['Artificial Intelligence', 'AI Prompts', 'Machine Learning'])
    if 'folklore' in filename_lower:
        tags.extend(['Folklore', 'Cultural Heritage', 'Translation'])
    if 'image' in filename_lower or 'midjourney' in filename_lower:
        tags.extend(['Image Generation', 'Creative AI', 'Visual Content'])
    
    # Remove duplicates and limit
    tags = list(set(tags))[:6]
    
    formatted_tags = '\n'.join([f'    - {tag}' for tag in tags])
    return formatted_tags

def generate_keywords(filename, title):
    """Generate SEO keywords based on filename and title"""
    keywords = []
    
    # Extract key terms from title
    title_words = [word.lower() for word in title.split() if len(word) > 3]
    keywords.extend(title_words[:5])
    
    # Add specific keywords based on file type
    filename_lower = filename.lower()
    if 'prompt' in filename_lower:
        keywords.extend(['prompt engineering', 'AI prompts'])
    if 'architecture' in filename_lower:
        keywords.extend(['system architecture', 'requirements analysis'])
    if 'ttrpg' in filename_lower:
        keywords.extend(['tabletop gaming', 'RPG tools'])
    
    # Remove duplicates and format
    keywords = list(set(keywords))[:8]
    formatted_keywords = '\n'.join([f'    - {keyword}' for keyword in keywords])
    return formatted_keywords

def generate_bullets(content_preview):
    """Generate bullet points based on content preview"""
    bullets = [
        '    - Advanced prompt engineering techniques',
        '    - Structured approach to content generation', 
        '    - Customizable templates and frameworks',
        '    - Best practices for AI interaction',
        '    - Professional-grade output formatting'
    ]
    return '\n'.join(bullets)

def process_file(file_path):
    """Process a single file to add front matter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has front matter
        if content.startswith('---'):
            print(f"Skipping {file_path.name} - already has front matter")
            return False
        
        filename = file_path.name
        title = extract_title_from_filename(filename)
        
        # Get content preview for analysis
        content_preview = content[:500]
        
        # Generate front matter components
        categories = categorize_prompt(filename, content_preview)
        tags = generate_tags(filename, content_preview)
        keywords = generate_keywords(filename, title)
        bullets = generate_bullets(content_preview)
        
        # Create subtitle based on content type
        if 'architecture' in filename.lower():
            subtitle = "Enterprise Architecture and Requirements Engineering"
        elif 'ttrpg' in filename.lower():
            subtitle = "Tabletop RPG Content Generation Tools"
        elif 'communication' in filename.lower():
            subtitle = "Professional Content Creation Assistant"
        elif 'business' in filename.lower():
            subtitle = "Strategic Business Planning and Analysis"
        else:
            subtitle = "AI-Powered Content Generation Framework"
        
        # Create descriptions
        excerpt = f"A specialized prompt for {title.lower()} with advanced AI capabilities and structured output formatting."
        description = f"Professional {title.lower()} prompt designed for high-quality content generation and structured analysis."
        seo_description = f"Master {title.lower()} with this comprehensive AI prompt featuring structured templates and best practices."
        
        # Format front matter
        front_matter = FRONT_MATTER_TEMPLATE.format(
            title=title,
            subtitle=subtitle,
            excerpt=excerpt,
            description=description,
            seo_description=seo_description,
            categories=categories,
            tags=tags,
            keywords=keywords,
            bullets=bullets
        )
        
        # Write new content
        new_content = front_matter + content
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Added front matter to: {filename}")
        return True
        
    except Exception as e:
        print(f"Error processing {file_path.name}: {str(e)}")
        return False

def main():
    """Main function to process all files"""
    work_dir = Path("/Users/tedtschopp/Developer/tedt.org/prompts/work-in-progress")
    
    if not work_dir.exists():
        print(f"Directory not found: {work_dir}")
        return
    
    # Get all markdown files
    md_files = list(work_dir.glob("*.md"))
    
    print(f"Found {len(md_files)} markdown files to process")
    
    processed = 0
    skipped = 0
    
    for file_path in md_files:
        if file_path.name == 'index.html':  # Skip non-markdown files
            continue
            
        result = process_file(file_path)
        if result:
            processed += 1
        else:
            skipped += 1
    
    print(f"\nProcessing complete:")
    print(f"Files processed: {processed}")
    print(f"Files skipped: {skipped}")

if __name__ == "__main__":
    main()