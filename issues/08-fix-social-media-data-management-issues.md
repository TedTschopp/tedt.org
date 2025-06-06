# Fix Social Media Data Management Issues

**Priority:** Medium
**Type:** Refactoring/Data Management
**Status:** Open

## Problem

Social media links and data are scattered across multiple locations without a centralized management system:

1. **Social media links duplicated** in different include files
2. **Inconsistent data structures** between different social implementations
3. **No single source of truth** for social media information
4. **Redundant code** for rendering social links in multiple places
5. **Difficult maintenance** when updating social media accounts
6. **Potential for inconsistencies** when links need to be updated

**Specific Issues Found:**
- Social links appear in navigation includes
- Separate social data in `_config.yml` sections
- Different rendering logic in multiple include files
- No validation for social media URL formats
- Missing or inconsistent social media icons

## Proposed Solution

1. **Create centralized social media data structure** in `_config.yml`
2. **Build reusable social media include** for consistent rendering
3. **Standardize social media data format** across all implementations
4. **Create validation** for social media URLs and handles
5. **Implement icon management system** for consistent social media icons
6. **Document social media management process** for maintainers

## Benefits

- **Single source of truth**: All social media data in one place
- **Consistent rendering**: Same look and functionality across all pages
- **Easier updates**: Change social links in one place, updates everywhere
- **Better validation**: Catch broken or malformed social media links
- **Improved maintainability**: Clear process for managing social presence
- **Icon consistency**: Standardized social media icons across site

## Implementation Plan

### Phase 1: Audit Current Social Media Implementation
- [ ] Catalog all social media references in includes
- [ ] Document current data structures in `_config.yml`
- [ ] Identify inconsistencies between implementations
- [ ] Map where social media links appear on site

### Phase 2: Design Centralized System
- [ ] Create standardized social media data structure
- [ ] Design flexible include for rendering social links
- [ ] Plan icon management system (SVG, Font Awesome, etc.)
- [ ] Design validation system for social media data

### Phase 3: Implement New System
- [ ] Update `_config.yml` with centralized social media data
- [ ] Create `_includes/social-media.html` for consistent rendering
- [ ] Update all existing includes to use new system
- [ ] Implement icon management solution
- [ ] Add validation and error handling

### Phase 4: Clean Up and Optimize
- [ ] Remove duplicate social media code
- [ ] Optimize include performance
- [ ] Add documentation for social media management
- [ ] Test all social media links and functionality

## Files to Create

- `_includes/social-media.html` (centralized social media rendering)
- `_includes/social-media-icons.html` (icon management system)
- `docs/social-media-management.md` (maintenance documentation)

## Files to Modify

- `_config.yml` (centralized social media data structure)
- `_includes/navigation.html` (use new social media system)
- `_includes/footer.html` (use new social media system)
- Any other includes that render social media links
- Layout files that include social media functionality

## Dependencies

- **Issue #07**: Configuration restructuring should be completed first
- **Icon system**: Need to decide on icon management approach (SVG vs Font Awesome)
- **URL validation**: May need Jekyll plugin for URL validation

## Testing Checklist

- [ ] All social media links appear correctly in navigation
- [ ] Social media links work in footer
- [ ] Icons display consistently across all social media implementations
- [ ] Social media metadata appears correctly in page headers
- [ ] No duplicate social media elements on any page
- [ ] Social media links open correctly (new tab/window as appropriate)
- [ ] Site builds without warnings related to social media data
- [ ] Mobile responsiveness of social media elements maintained
