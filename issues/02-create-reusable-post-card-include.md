# Create Reusable Post Card Include

**Priority:** Medium  
**Type:** Refactoring  
**Status:** Open  

## Problem

The same post card HTML structure is duplicated at least 4 times throughout `_layouts/default.html`:
- Blog section (lines ~95-150)
- Folklore section (lines ~170-225) 
- Carousel categories section (lines ~360-400+)

This violates DRY principles and creates maintenance issues.

## Proposed Solution

1. Create `_includes/post-card.html` with parameters for:
   - Post object
   - Layout variant (with/without image)
   - Container classes
   - Image size/positioning

2. Replace all duplicated code with include calls

## Benefits

- Reduces file size significantly
- Single source of truth for post card markup
- Easier maintenance and updates
- Consistent styling across sections

## Implementation Plan

### Phase 1: Create the Include
- [ ] Create `_includes/post-card.html`
- [ ] Define parameters for flexibility:
  ```liquid
  <!-- Usage: {% include post-card.html post=post layout="horizontal" %} -->
  ```

### Phase 2: Replace Duplicated Code
- [ ] Update blog section to use include
- [ ] Update folklore section to use include  
- [ ] Update carousel section to use include
- [ ] Test all sections work correctly

### Phase 3: Clean Up
- [ ] Remove old duplicated code
- [ ] Test responsive behavior
- [ ] Validate HTML structure

## Files to Create

- `_includes/post-card.html`

## Files to Modify

- `_layouts/default.html`

## Dependencies

- Should be implemented after Issue #1 (carousel fix) is complete
- Consider implementing alongside Issue #6 (standardize image handling)

## Testing Checklist

- [ ] Blog posts display correctly with images
- [ ] Blog posts display correctly without images
- [ ] Folklore posts display correctly
- [ ] Carousel posts display correctly
- [ ] Responsive behavior works on mobile
- [ ] All links and dates work properly
