# Standardize Image Handling Logic

**Priority:** Low  
**Type:** Code Consistency  
**Status:** Open  

## Problem

Different sections use slightly different approaches for image validation and fallbacks:
- Some use `{% if post.image %}`
- Others use `{% if post.image != nil and post.image != empty and post.image != "" %}`
- Inconsistent variable assignments for image metadata

## Current Inconsistencies

### Blog Section
```liquid
{% if post.image %}
  {% assign image_alt = post.image-alt | default: post.image-description | default: post.title %}
  <!-- ... -->
{% endif %}
```

### Folklore Section  
```liquid
{% if post.image %}
  {% assign image_alt = post.image-alt | default: post.image-description | default: post.title %}
  <!-- ... -->
{% endif %}
```

### Carousel Section
```liquid
{% if post.image != nil and post.image != empty and post.image != "" %}
  {% assign image_alt = post.image-alt | default: post.image-description | default: post.title %}
  <!-- ... -->
{% endif %}
```

## Issues

- Inconsistent image validation methods
- Repeated variable assignment logic
- Different fallback behaviors
- Hard to maintain image-related features

## Proposed Solution

1. Create standardized image handling logic in the post card include
2. Ensure consistent fallback behavior across all sections
3. Standardize image metadata variable assignments
4. Use most robust validation method everywhere

## Implementation Plan

### Phase 1: Define Standard Image Validation
- [ ] Choose most robust validation method
- [ ] Document image handling standards
- [ ] Create reusable image logic

### Phase 2: Implement in Post Card Include
- [ ] Add standardized image handling to post-card.html
- [ ] Include all metadata assignments
- [ ] Handle all fallback scenarios

### Phase 3: Test Consistency
- [ ] Verify same behavior across all sections
- [ ] Test edge cases (empty strings, nil values, etc.)
- [ ] Ensure proper alt text generation

## Recommended Standard

```liquid
<!-- Most robust image validation -->
{% if post.image and post.image != "" and post.image != nil %}
  {% assign image_alt = post.image-alt | default: post.image-description | default: post.title %}
  {% assign image_credits_title = post.image-credits-title | default: post.image-title | default: "Unknown" %}
  {% assign image_credits = post.image-credits-artist | default: post.image-artist | default: "Unknown" %}
  {% assign image_credits_artist_URL = post.image-credits-artist-URL | default: post.image-artist-URL %}
  {% assign image_URL = post.image %}
{% endif %}
```

## Benefits

- Consistent user experience
- Reduces bugs from different handling logic
- Easier to maintain image features
- Single source of truth for image handling
- Better accessibility with consistent alt text

## Dependencies

- Should be implemented as part of Issue #2 (post card include)
- Consider implementing with Issue #5 (layout breakdown)

## Files Affected

- `_includes/post-card.html` (when created)
- `_layouts/default.html`

## Testing Checklist

- [ ] Images display consistently across all sections
- [ ] Alt text is always present and meaningful
- [ ] Fallbacks work for missing image metadata
- [ ] No broken images or empty src attributes
- [ ] Consistent behavior for edge cases
- [ ] Accessibility testing passes
