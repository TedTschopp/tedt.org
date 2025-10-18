#!/usr/bin/env python3
"""
Convert prompt files in work-in-progress directory to prompt-details format.
Move prompt content to front matter and add usage instructions.
"""

import os
import re
from pathlib import Path

def extract_front_matter_and_content(file_content):
    """Extract YAML front matter and remaining content from a markdown file."""
    if not file_content.startswith('---'):
        return "", file_content
    
    # Find the end of front matter
    parts = file_content.split('---', 2)
    if len(parts) < 3:
        return "", file_content
    
    front_matter_text = parts[1].strip()
    content = parts[2].strip()
    return front_matter_text, content

def create_usage_instructions(title, description, prompt_preview):
    """Create usage instructions for the prompt."""
    
    # Extract first 200 characters of prompt for preview
    preview = prompt_preview[:200] + "..." if len(prompt_preview) > 200 else prompt_preview
    
    instructions = f"""This prompt is designed for {description.lower()}

## How to Use This Prompt

1. **Copy the prompt** from the prompt content section above
2. **Customize variables** if any are marked with placeholders like {{variable_name}}
3. **Paste into your AI tool** (ChatGPT, Claude, Copilot, etc.)
4. **Provide your specific input** as requested by the prompt
5. **Review and iterate** on the generated output as needed

## Prompt Preview

```
{preview}
```

## Best Practices

- Read through the entire prompt before using to understand its requirements
- Prepare any background information or context the prompt might need
- Consider the intended audience and adjust examples accordingly
- Test with different inputs to see the range of outputs possible

## Supported AI Models

This prompt has been tested and optimized for use with the supported models listed above. It may work with other AI systems but performance may vary.

## Customization Tips

- Modify the tone and style instructions to match your needs
- Add specific examples relevant to your domain or industry
- Adjust the output format requirements if needed
- Include additional constraints or requirements as necessary
"""
    
    return instructions

def get_models_supported(filename, content):
    """Determine supported models based on prompt complexity and content."""
    
    # Default models that work well with most prompts
    models = [
        "gpt-4",
        "gpt-4-turbo", 
        "gpt-4-mini",
        "claude-3-sonnet",
        "claude-3-haiku",
        "microsoft-copilot",
        "github"
    ]
    
    return models

def process_file(file_path):
    """Process a single prompt file to convert to prompt-details format."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract front matter and content
        front_matter_text, body_content = extract_front_matter_and_content(content)
        
        if not front_matter_text:
            print(f"Skipping {file_path.name} - no valid front matter found")
            return False
        
        # Skip if already processed (has prompt_content)
        if 'prompt_content' in front_matter_text:
            print(f"Skipping {file_path.name} - already has prompt_content")
            return False
        
        # Clean up body content - remove any duplicate front matter
        lines = body_content.split('\n')
        cleaned_lines = []
        skip_front_matter = False
        
        for line in lines:
            if line.strip() == '---' and not cleaned_lines:
                skip_front_matter = True
                continue
            elif line.strip() == '---' and skip_front_matter:
                skip_front_matter = False
                continue
            elif not skip_front_matter:
                cleaned_lines.append(line)
        
        body_content = '\n'.join(cleaned_lines).strip()
        
        # Update front matter - change layout to prompt-details
        updated_front_matter = front_matter_text.replace('layout: post', 'layout: prompt-details')
        
        # Add models-supported if not present
        if 'models-supported' not in updated_front_matter:
            models_line = "models-supported:\n- gpt-4\n- gpt-4-turbo\n- gpt-4-mini\n- claude-3-sonnet\n- microsoft-copilot\n- github"
            updated_front_matter += f"\n{models_line}"
        
        # Add prompt_content field with the body content
        # Escape any quotes in the body content and format as YAML literal block
        escaped_content = body_content.replace('"', '\\"')
        prompt_content_section = f"prompt_content: |\n"
        
        # Indent each line of the content for YAML literal block
        for line in body_content.split('\n'):
            prompt_content_section += f"  {line}\n"
        
        updated_front_matter += f"\n{prompt_content_section}"
        
        # Generate usage instructions
        title_match = re.search(r'title:\s*["\']?([^"\'\n]+)["\']?', updated_front_matter)
        title = title_match.group(1) if title_match else 'Untitled Prompt'
        
        description_match = re.search(r'description:\s*["\']?([^"\'\n]+)["\']?', updated_front_matter)
        description = description_match.group(1) if description_match else 'advanced AI content generation'
        
        # Create a preview of the prompt for instructions
        prompt_preview = body_content[:500] if body_content else "Custom prompt content"
        
        usage_instructions = create_usage_instructions(title, description, prompt_preview)
        
        # Build new file content
        new_content = f"---\n{updated_front_matter}\n---\n\n{usage_instructions}"
        
        # Write the updated file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Processed: {file_path.name}")
        return True
        
    except Exception as e:
        print(f"Error processing {file_path.name}: {str(e)}")
        return False

def main():
    """Main function to process all files."""
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