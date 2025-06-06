# Extract Inline CSS to External Files

**Priority:** Medium  
**Type:** Code Organization  
**Status:** Open  

## Problem

Large blocks of CSS (lines 230-318 in `_layouts/default.html`) are embedded directly in the HTML template. This violates separation of concerns and makes the layout file harder to read and maintain.

## Current Issues

- 80+ lines of carousel-specific CSS inline
- Mixing presentation with structure
- File exceeds recommended 200-300 line guideline
- CSS not reusable across other templates

## Proposed Solution

1. Create `_sass/_carousel.scss` for carousel-specific styles
2. Move all inline CSS to the new file
3. Import in main stylesheet
4. Remove `<style>` block from HTML

## Implementation Plan

### Phase 1: Create Carousel Stylesheet
- [ ] Create `_sass/_carousel.scss`
- [ ] Move all carousel CSS from default.html
- [ ] Organize CSS with proper comments and structure

### Phase 2: Update Main Stylesheet
- [ ] Add `@import 'carousel';` to main stylesheet
- [ ] Ensure proper load order

### Phase 3: Clean Up HTML
- [ ] Remove `<style>` block from `default.html`
- [ ] Test carousel functionality still works
- [ ] Validate CSS is loading correctly

## Files to Create

- `_sass/_carousel.scss`

## Files to Modify

- `_layouts/default.html` (remove inline CSS)
- Main CSS file (add import)

## CSS to Move

The following styles need to be moved:
- `.carousel-control-prev-icon`, `.carousel-control-next-icon`
- `.carousel-control-prev`, `.carousel-control-next`  
- `.carousel-indicators`
- Hover states and transitions
- Custom positioning and styling

## Benefits

- Cleaner HTML templates
- Reusable carousel styles
- Better maintainability
- Follows CSS best practices
- Reduces template file size

## Testing Checklist

- [ ] Carousel controls display correctly
- [ ] Hover effects work properly
- [ ] Carousel indicators function correctly
- [ ] No broken styles or missing CSS
- [ ] Works across different browsers
