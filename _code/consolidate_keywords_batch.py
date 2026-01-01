#!/usr/bin/env python3
"""
Consolidate keywords across all prompt files in _posts/Prompts/
Applies standardized keyword mapping to reduce duplication and improve consistency.
"""

import os
import re

# Consolidation mapping
consolidation_map = {
    # Architecture (7→3)
    "system architecture": "system architecture",
    "solution architecture": "solution architecture",
    "application architecture": "solution architecture",
    "data architecture": "system architecture",
    "business architecture": "business architecture",
    "technology architecture": "system architecture",
    "architecture": None,
    
    # AI & Prompt Engineering (8→4)
    "AI prompts": "AI prompts",
    "prompt": "AI prompts",
    "prompt templates": "prompt templates",
    "prompt design": "prompt templates",
    "teaching assistant prompt": "prompt templates",
    "educational AI": "educational AI",
    "AI tutoring": "educational AI",
    "teaching assistant": "educational AI",
    "prompt engineering": "prompt engineering",
    
    # Content & Writing (12→5)
    "content creation": "content creation",
    "content strategy": "content creation",
    "content cleanup": "content creation",
    "content evaluation": "content creation",
    "creative writing": "creative writing",
    "novel writing": "creative writing",
    "writing prompts": "creative writing",
    "writing style": "creative writing",
    "technical writing": "technical writing",
    "documentation": "documentation",
    "copywriting": "copywriting",
    "marketing": "copywriting",
    "blog writing": "content writing",
    "scriptwriting": "content writing",
    "podcast scripting": "content writing",
    
    # Education & Learning (15→6)
    "instructional design": "instructional design",
    "lesson planning": "instructional design",
    "education technology": "instructional design",
    "adaptive learning": "adaptive learning",
    "active learning": "adaptive learning",
    "skill-based learning": "adaptive learning",
    "experiential learning": "experiential learning",
    "guided practice": "experiential learning",
    "student roleplay": "experiential learning",
    "roleplay simulation": "experiential learning",
    "scaffolding": "scaffolding",
    "scaffolding techniques": "scaffolding",
    "quiz and test preparation": "assessment tools",
    "rubric-based grading": "assessment tools",
    "socratic method": "socratic method",
    
    # Gaming/RPG (6→4)
    "RPG tools": "RPG tools",
    "module builder": "RPG tools",
    "character generator": "RPG tools",
    "weapon generator": "RPG tools",
    "TTRPG": "TTRPG",
    "tabletop gaming": "tabletop gaming",
    "worldbuilding": "worldbuilding",
    
    # Business & Strategy (14→8)
    "strategic planning": "strategic planning",
    "product management": "product management",
    "product requirements (PRD)": "product requirements",
    "business strategy": "business strategy",
    "business case": "business strategy",
    "stakeholder management": "stakeholder communications",
    "communications": "stakeholder communications",
    "enterprise communication": "stakeholder communications",
    "goal setting": "goal setting",
    "objective setting": "goal setting",
    "OKR": "goal setting",
    "procurement": "procurement",
    "RFP": "procurement",
    "vendor analysis": "procurement",
    "risk assessment": "risk assessment",
    
    # Visual/Media (8→3)
    "visual generation": "visual generation",
    "AI art": "visual generation",
    "AI image generation": "visual generation",
    "image prompts": "visual generation",
    "visual analysis": "visual generation",
    "visualization": "visual generation",
    "artistic interpretation": "visual generation",
    "video generation": "video generation",
    "AI video": "video generation",
    "audio content": "audio content",
    
    # Social Media (8→1)
    "social media": "social media",
    "Instagram feed": "social media",
    "TikTok captions": "social media",
    "YouTube Shorts": "social media",
    "email newsletter": "social media",
    "multi-platform strategy": "social media",
    "platform repurposing": "social media",
    "web strategy": "social media",
    
    # Quality & Review (6→3)
    "compliance": "compliance",
    "compliance review": "compliance",
    "security": "compliance",
    "peer review": "quality review",
    "quality review": "quality review",
    "reviewer q&a": "quality review",
    "validation feedback": "quality review",
    "risk and gap analysis": "risk assessment",
    "IT risk": "risk assessment",
    
    # DELETE (Fragments/Invalid)
    "block": None, "building": None, "find": None, "improvement": None,
    "objective": None, "role": None, "self": None, "super": None,
    "variables": None, "your": None, "10th grade level": None, "customization": None,
}

def process_file(filepath):
    """Process a single markdown file and consolidate keywords."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract front matter
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return False, "No front matter"
    
    front_matter = match.group(1)
    
    # Extract keywords section
    keywords_match = re.search(r'^keywords:\s*\n((?:[ ]*- [^\n]+\n?)+)', front_matter, re.MULTILINE)
    if not keywords_match:
        return False, "No keywords"
    
    old_section = keywords_match.group(0)
    keywords_text = keywords_match.group(1)
    keywords = re.findall(r'^[ ]*- (.+)$', keywords_text, re.MULTILINE)
    keywords = [k.strip() for k in keywords]
    original_count = len(keywords)
    
    # Apply consolidation
    new_keywords = set()
    for kw in keywords:
        if kw in consolidation_map:
            mapped = consolidation_map[kw]
            if mapped:  # Not None (deleted)
                new_keywords.add(mapped)
        else:
            new_keywords.add(kw)  # Keep as-is
    
    # Ensure minimum keywords
    if len(new_keywords) < 5:
        if "AI prompts" not in new_keywords:
            new_keywords.add("AI prompts")
        if "prompt engineering" not in new_keywords:
            new_keywords.add("prompt engineering")
        if "documentation" not in new_keywords and len(new_keywords) < 5:
            new_keywords.add("documentation")
    
    # Sort alphabetically
    new_keywords = sorted(list(new_keywords), key=str.lower)
    
    # Check if changed
    if sorted(keywords, key=str.lower) == new_keywords:
        return False, "No change"
    
    # Build new keywords section
    new_section = "keywords:\n" + "\n".join([f"  - {kw}" for kw in new_keywords])
    
    # Replace in content
    new_content = content.replace(old_section, new_section)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, f"{original_count} → {len(new_keywords)}"

def main():
    prompt_dir = "_posts/Prompts"
    files = sorted([f for f in os.listdir(prompt_dir) if f.endswith('.md')])
    
    total = len(files)
    modified = 0
    skipped = 0
    
    print(f"Processing {total} prompt files...")
    print("=" * 80)
    
    for filename in files:
        filepath = os.path.join(prompt_dir, filename)
        changed, msg = process_file(filepath)
        
        if changed:
            modified += 1
            print(f"✓ {filename}: {msg}")
        else:
            skipped += 1
    
    print("=" * 80)
    print(f"Total files: {total}")
    print(f"Modified: {modified}")
    print(f"Skipped: {skipped}")

if __name__ == "__main__":
    main()
