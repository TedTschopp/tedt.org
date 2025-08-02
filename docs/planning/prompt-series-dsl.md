# Prompt Series DSL (Domain Specific Language)

## Overview

The Prompt Series DSL allows you to define multi-step workflows where prompts can be chained together to create comprehensive content creation and refinement processes.

## Schema Definition

### Series Front Matter Structure

```yaml
series:
  - step: <number>                    # Required: Step number (can be any positive integer)
    title: "<step_title>"             # Required: Display title for this step
    description: "<brief_description>" # Required: What this step accomplishes
    prompt_file: "<filename.md>"      # Required: Filename of the prompt (without path)
    current: <boolean>                # Optional: true if this is the current prompt
```

### Field Specifications

#### `step` (Required)
- **Type**: Integer
- **Description**: The step number in the series
- **Notes**: 
  - Can start from any number (not required to start from 1)
  - Steps will be sorted numerically in display
  - Gaps in numbering are allowed

#### `title` (Required)
- **Type**: String
- **Description**: The display title for this step
- **Format**: "Step Title" (without "Step N:" prefix - this is added automatically)

#### `description` (Required)
- **Type**: String
- **Description**: Brief explanation of what this step accomplishes
- **Length**: Recommended 1-2 sentences
- **Purpose**: Helps users understand the workflow progression

#### `prompt_file` (Required)
- **Type**: String
- **Description**: Filename of the prompt file
- **Format**: Must include `.md` extension
- **Path**: Relative to `_posts/Prompts/` directory
- **Validation**: File must exist in the prompts directory

#### `current` (Optional)
- **Type**: Boolean
- **Description**: Marks the current prompt in the series
- **Default**: false
- **Usage**: Only one prompt in a series should have `current: true`

## Examples

### Basic Two-Step Series

```yaml
series:
  - step: 1
    title: "Content Generation"
    description: "Create initial blog post content based on your topic and audience"
    prompt_file: "2025-01-31-simple-blog-generator.md"
    current: true
  - step: 2
    title: "Content Critique"
    description: "Analyze and improve the generated content for quality and effectiveness"
    prompt_file: "2025-08-01-Critique-Content.md"
```

### Multi-Step Workflow

```yaml
series:
  - step: 1
    title: "Research & Planning"
    description: "Gather information and create content outline"
    prompt_file: "research-planner.md"
  - step: 2
    title: "Content Creation"
    description: "Generate initial content based on research"
    prompt_file: "content-creator.md"
    current: true
  - step: 3
    title: "Content Review"
    description: "Critical analysis and improvement suggestions"
    prompt_file: "2025-08-01-Critique-Content.md"
  - step: 4
    title: "Final Polish"
    description: "Apply improvements and finalize content"
    prompt_file: "content-finalizer.md"
```

### Non-Sequential Steps

```yaml
series:
  - step: 5
    title: "Advanced Analysis"
    description: "Deep dive analysis for complex content"
    prompt_file: "advanced-analyzer.md"
  - step: 10
    title: "Expert Review"
    description: "Final expert-level critique and recommendations"
    prompt_file: "expert-review.md"
    current: true
```

## Implementation Notes

### Template Rendering
- Series steps are automatically sorted by step number
- Current step is highlighted with a special badge
- Links are automatically generated to prompt detail pages
- Missing files are handled gracefully with error indicators

### Reusability
- The same prompt can be used in multiple series
- A prompt can appear multiple times in the same series (different steps)
- Series information is self-contained in each prompt file

### Validation
- Template validates that referenced prompt files exist
- Broken links are indicated in the rendered output
- Console warnings for development debugging

## Best Practices

1. **Consistent Numbering**: Use consistent step numbering within a series
2. **Clear Titles**: Use descriptive, action-oriented step titles
3. **Brief Descriptions**: Keep descriptions concise but informative
4. **Logical Flow**: Order steps in a logical workflow progression
5. **Current Marking**: Always mark the current prompt with `current: true`

## Migration Guide

For existing prompts with static series content:

1. Remove static HTML from the template
2. Add `series:` section to front matter
3. Define steps with proper titles and descriptions
4. Reference existing prompt files by filename
5. Mark current position in series

Example migration:

```yaml
# Before: Static HTML in template
# After: Dynamic front matter
series:
  - step: 1
    title: "Initial Creation"
    description: "Generate base content"
    prompt_file: "current-file.md"
    current: true
  - step: 2
    title: "Enhancement"
    description: "Improve and refine"
    prompt_file: "enhancement-prompt.md"
```
