# Repository Issues and Improvements

This directory contains issues identified during comprehensive repository analysis. Issues are organized by priority, type, and implementation dependencies.

## Quick Overview

| Issue | Priority | Type | Status | Description |
|-------|----------|------|--------|-------------|
| [#01](01-fix-incomplete-carousel-implementation.md) | High | Bug | Open | Fix broken carousel post card structure |
| [#02](02-create-reusable-post-card-include.md) | Medium | Refactoring | Open | Eliminate code duplication with reusable include |
| [#03](03-extract-inline-css-to-external-files.md) | Medium | Code Organization | Open | Move inline CSS to external files |
| [#04](04-simplify-post-filtering-logic.md) | Low | Optimization | Open | Replace elsif chain with data-driven filtering |
| [#05](05-break-down-large-layout-file.md) | Medium | Refactoring | Open | Split large file into focused includes |
| [#06](06-standardize-image-handling-logic.md) | Low | Code Consistency | Open | Consistent image validation across sections |
| [#07](07-fix-configuration-duplication-and-inconsistencies.md) | High | Bug/Configuration | Open | Fix duplicate and conflicting config settings |
| [#08](08-fix-social-media-data-management-issues.md) | Medium | Refactoring/Data | Open | Centralize social media data management |
| [#09](09-fix-feed-url-concatenation-bugs.md) | High | Bug | Open | Fix malformed feed URLs breaking RSS discovery |
| [#10](10-improve-include-file-organization.md) | Medium | Refactoring/Organization | Open | Organize 60+ include files with logical structure |

## Implementation Order

### Phase 1: Critical System Fixes (High Priority)
1. **Issue #09** - Fix feed URL concatenation bugs (breaks RSS discovery)
2. **Issue #07** - Fix configuration duplication (foundation for other fixes)
3. **Issue #01** - Fix incomplete carousel implementation (blocks functionality)

### Phase 2: Data and Structure Foundation
4. **Issue #08** - Fix social media data management (depends on #07)
5. **Issue #02** - Create reusable post card include (enables other refactoring)
6. **Issue #06** - Standardize image handling (implement with #02)

### Phase 3: Organization and Architecture  
7. **Issue #10** - Improve include file organization (depends on #08)
8. **Issue #03** - Extract CSS to external files
9. **Issue #05** - Break down large layout file (depends on #02, #03)

### Phase 4: Optimization
10. **Issue #04** - Simplify post filtering logic (can be done anytime)

## Dependencies

### Critical Dependencies
- **#07** (config fixes) should be completed before **#08** (social media data)
- **#09** (feed URLs) should be fixed immediately (breaks RSS)
- **#01** (carousel) should be fixed early (blocks functionality)

### Structural Dependencies  
- **#08** (social media) should be completed before **#10** (include organization)
- **#02** (post cards) should be completed before **#05** (layout breakdown)
- **#06** (image handling) should be implemented alongside **#02**

### Optimization Dependencies
- **#03** (CSS extraction) can be done independently
- **#04** (filtering logic) can be done independently, but benefits from **#05**

## Impact Analysis

### Configuration & Data Issues (High Impact)
- **#07**: Affects entire site configuration and build process
- **#08**: Affects social media functionality across all pages  
- **#09**: Breaks RSS feed discovery and subscription

### Layout & Structure Issues (Medium Impact)
- **#05**: Affects maintainability of main layout file (557 lines)
- **#10**: Affects organization of 60+ include files
- **#02**: Affects code duplication in multiple sections

### Functionality Issues (Variable Impact)
- **#01**: High impact - breaks carousel functionality
- **#03**: Medium impact - affects CSS maintainability
- **#04**: Low impact - affects filtering performance
- **#06**: Low impact - affects image handling consistency

## File Size Impact

Current `default.html`: 557 lines

After all refactoring:
- `default.html`: ~100-150 lines (estimated)
- `_includes/post-card.html`: ~50 lines
- `_includes/*-section.html`: ~50-100 lines each
- `_sass/_carousel.scss`: ~80 lines

## Testing Strategy

1. Fix issues one at a time
2. Test each change thoroughly before proceeding
3. Use Jekyll's development server to validate changes
4. Test responsive behavior on mobile
5. Validate HTML structure with each change
6. Ensure all links and functionality work correctly

## Code Quality Goals

- ✅ Files under 200-300 lines
- ✅ No code duplication  
- ✅ Separation of concerns
- ✅ Consistent patterns
- ✅ Maintainable structure
- ✅ Following Jekyll best practices
