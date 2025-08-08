# ADR-002: Dynamic Prompt Series Architecture

## Status

Accepted

## Context

The current Jekyll prompt template system has static "Prompts in this Series" content hardcoded in the `prompt-details.html` layout. This creates several problems:

1. **Maintenance overhead**: Series information must be manually updated in the template when prompts are added, removed, or reordered
2. **Inflexibility**: Prompts cannot be reused across multiple series or workflows
3. **Coupling**: The template is tightly coupled to specific prompt files, making it difficult to create new series
4. **User experience**: Users cannot easily see their position in multi-step workflows or navigate between related prompts

The blog currently has prompts that would benefit from being organized into coherent multi-step workflows (e.g., content creation → critique → optimization), but the static approach prevents this logical grouping.

## Decision

We will implement a dynamic prompt series system using Jekyll front matter to define series relationships, with the template automatically generating navigation based on this metadata.

The solution includes:

- **YAML-based series definitions** in prompt front matter
- **Dynamic template rendering** using Liquid templating
- **Flexible step ordering** supporting arbitrary workflows
- **Current step highlighting** for user orientation

## Rationale

The decision was made to use front matter-based series definitions because:

- **Low implementation barrier**: Leverages existing Jekyll infrastructure without requiring external dependencies
- **Developer familiarity**: Uses standard YAML front matter that Jekyll developers already understand  
- **Flexibility**: Allows prompts to participate in multiple series at different positions
- **Maintainability**: Changes to series structure only require updating individual prompt files
- **Backward compatibility**: Existing prompts without series definitions continue to work unchanged

This approach aligns with Jekyll's philosophy of using metadata to drive content organization and presentation.

## Alternatives Considered

### External Series Configuration File

- **Pros**: Centralized series management, easier to maintain consistency across large numbers of prompts
- **Cons**: Introduces another configuration file to maintain, breaks Jekyll's content-centric model
- **Decision**: Rejected due to added complexity and deviation from Jekyll patterns

### Hardcoded Series in Template

- **Pros**: Simple implementation, no metadata required
- **Cons**: Inflexible, requires template changes for new series, cannot reuse prompts across series
- **Decision**: This is the current state that we're replacing

### Category-Based Series Generation

- **Pros**: Automatic series creation based on existing categories
- **Cons**: Limited control over step order, assumes categories map to workflow steps
- **Decision**: Rejected due to insufficient control over workflow presentation

## Consequences

### Positive

- Flexible prompt reuse across multiple series/workflows
- Easy to maintain and update series without template changes  
- Self-documenting workflow structure in prompt metadata
- No separate configuration files needed
- Supports complex multi-step workflows with custom ordering
- Enables clear user navigation through related prompts

### Negative

- Series information duplicated across related prompt files
- Manual maintenance required to keep series consistency across files
- Potential for broken links if prompt files are renamed or moved
- No built-in validation of series completeness or correctness

### Mitigation

- Document series DSL specification clearly in `/docs/planning/`
- Create validation tools to check series consistency and completeness
- Use relative linking patterns to minimize breakage from file moves
- Implement proper error handling in template for missing series references

## Implementation Notes

- Implementation requires updating `_layouts/prompt-details.html` template with dynamic Liquid logic
- Series front matter follows the DSL specification in `/docs/planning/prompt-series-dsl.md`  
- Template automatically sorts series steps and highlights current step
- Links are generated using Jekyll's post URL structure for reliability
- Backward compatibility maintained for prompts without series definitions

## References

- [Jekyll Front Matter Documentation](https://jekyllrb.com/docs/front-matter/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- `/docs/planning/prompt-series-dsl.md` - DSL specification for series definitions
- Implemented example prompts:
  - `2025-01-31-simple-blog-generator.md`
  - `2025-08-01-Critique-Content.md`  
  - `2025-01-31-universal-content-creator-demo.md`
