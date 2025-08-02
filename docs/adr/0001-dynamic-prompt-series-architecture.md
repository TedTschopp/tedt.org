# ADR-0001: Dynamic Prompt Series Architecture

## Status
Accepted

## Context
The current prompt template system has static "Prompts in this Series" content that needs to be made dynamic. We need a flexible system where:
1. Any prompt can reference other prompts to create series/workflows
2. Prompts can be reused in multiple series at different steps
3. The series information should be defined in front matter
4. The template should dynamically generate the series display

## Decision
We will implement a dynamic prompt series system using Jekyll front matter with the following architecture:

### Front Matter Schema
```yaml
series:
  - step: 1
    title: "Step Title"
    description: "Brief description of what this step accomplishes"
    prompt_file: "2025-01-31-simple-blog-generator.md"
    current: true  # Optional: marks current step in series
  - step: 2
    title: "Content Critique"
    description: "Analyze and improve the generated content"
    prompt_file: "2025-08-01-Critique-Content.md"
```

### Template Logic
- Check if `page.series` exists and has content
- Dynamically render series steps with proper linking
- Support flexible step numbering and ordering
- Allow prompts to be reused across multiple series
- Show current step indication

### Data Flow
1. Front matter defines series structure in each prompt
2. Jekyll processes and validates series references
3. Template dynamically generates series navigation
4. Links resolve to proper prompt detail pages

## Consequences

### Positive
- Flexible prompt reuse across multiple series
- Easy to maintain and update series
- Self-documenting workflow structure
- No separate data files needed
- Supports complex multi-step workflows

### Negative
- Series information duplicated across files
- Need to manually maintain consistency
- Potential for broken links if files are renamed

### Mitigation
- Document series DSL clearly
- Create validation tools to check series consistency
- Use relative linking to minimize breakage

## Implementation Plan
1. Update prompt front matter schema documentation
2. Modify prompt-details.html template
3. Add series validation tools
4. Update existing prompts with series information
5. Create user documentation

## Examples
See updated prompt files:
- `2025-01-31-simple-blog-generator.md`
- `2025-08-01-Critique-Content.md`
- `universal-content-creator.md` (if exists)
