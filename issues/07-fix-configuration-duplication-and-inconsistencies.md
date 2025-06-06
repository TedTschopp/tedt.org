# Fix Configuration Duplication and Inconsistencies

**Priority:** High
**Type:** Bug/Configuration
**Status:** Open

## Problem

The `_config.yml` file (495 lines) contains significant duplication and inconsistencies that could lead to maintenance issues and configuration conflicts:

1. **Social media links duplicated** across multiple sections without clear hierarchy
2. **Plugin configurations scattered** throughout the file instead of being grouped
3. **Inconsistent formatting** between similar configuration blocks
4. **Redundant author information** defined in multiple places
5. **Missing validation** for critical configuration values
6. **Unclear organization** making it difficult to find and update settings

**Specific Issues Found:**
- Social links appear in multiple sections with different structures
- Plugin configurations are not grouped logically
- Some configurations use different naming conventions
- Author data is duplicated between site-level and post-level defaults

## Proposed Solution

1. **Consolidate social media configuration** into a single, well-structured section
2. **Group related configurations** (plugins, SEO, social, author, etc.)
3. **Standardize naming conventions** across all configuration sections
4. **Create clear hierarchy** between global and context-specific settings
5. **Add configuration validation** comments and examples
6. **Document all configuration options** with inline comments

## Benefits

- **Easier maintenance**: Single source of truth for each configuration type
- **Reduced errors**: Elimination of conflicting duplicate settings
- **Better organization**: Logical grouping makes configuration more manageable
- **Improved documentation**: Clear comments help future maintainers
- **Validation support**: Easier to spot configuration errors
- **Consistency**: Standardized naming and structure across all sections

## Implementation Plan

### Phase 1: Audit and Document Current Configuration
- [ ] Create backup of current `_config.yml`
- [ ] Document all duplicate configurations found
- [ ] Map relationships between different configuration sections
- [ ] Identify unused or conflicting settings

### Phase 2: Restructure Configuration File
- [ ] Create new organized structure with logical grouping
- [ ] Consolidate social media configurations
- [ ] Group plugin configurations together
- [ ] Standardize author and site metadata
- [ ] Add clear section headers and documentation

### Phase 3: Validate and Test
- [ ] Test site build with new configuration
- [ ] Verify all social links work correctly
- [ ] Confirm plugin functionality is preserved
- [ ] Validate SEO metadata is properly generated
- [ ] Check that all includes receive correct data

## Files to Create

- `_config.yml.backup` (backup of original)
- `docs/configuration-guide.md` (documentation for maintainers)

## Files to Modify

- `_config.yml` (complete restructure and consolidation)
- Include files that reference configuration values (may need updates)

## Dependencies

- Must review all include files that reference social media data
- Need to update any templates that depend on specific configuration structures
- May affect feeds.html and other social media includes

## Testing Checklist

- [ ] Site builds successfully with new configuration
- [ ] All social media links appear correctly in navigation
- [ ] SEO metadata is properly generated in page headers
- [ ] Plugin functionality (comments, analytics, etc.) works correctly
- [ ] Feed generation works with new author configuration
- [ ] No duplicate social icons appear on pages
- [ ] Configuration validation passes (no Jekyll warnings)
- [ ] All include files receive expected data structure
