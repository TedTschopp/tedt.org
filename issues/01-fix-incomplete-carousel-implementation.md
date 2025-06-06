# Fix Incomplete Carousel Implementation

**Priority:** High  
**Type:** Bug  
**Status:** Open  

## Problem

The carousel section in `_layouts/default.html` (lines ~360-400) has an incomplete implementation where the post loop starts but never completes the card structure. The code begins to handle posts with images but is missing the content areas and has no handling for posts without images.

## Current State

- Image posts start with `<div class="row g-0">` but never complete the structure
- No handling for posts without images in the carousel
- Results in broken HTML structure

## Expected Behavior

- Complete post cards should display in carousel footers
- Both image and non-image posts should be handled consistently
- HTML structure should be valid and complete

## Files Affected

- `_layouts/default.html` (lines ~360-400)

## Implementation Notes

The carousel section currently has:
```liquid
{% if post.image != nil and post.image != empty and post.image != "" %}
  <!-- Image handling starts but is incomplete -->
{% else %}
  <!-- No handling for posts without images -->
{% endif %}
```

Needs to be completed with proper card structure including:
- Card body with title, description, and date
- Proper image handling and layout
- Consistent styling with other sections

## Priority Justification

High priority because this causes broken HTML structure that affects the page layout and user experience.
