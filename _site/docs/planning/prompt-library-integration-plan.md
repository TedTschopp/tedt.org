# Prompt Library Integration Plan

**Date:** 2025-08-05  
**Author:** Ted Tschopp, GitHub Copilot  

## Overview

Integrate the existing `prompt-library` layout with Jekyll posts from `_posts/Prompts/` directory to create a dynamic, maintainable prompt library interface.

## Current State Analysis

### Existing Assets

- **Layout file**: `_layouts/prompt-library.html` - Complete UI with static cards
- **Index page**: `/prompts/index.html` - Uses prompt-library layout  
- **Prompt posts**: 26+ markdown files in `_posts/Prompts/`
- **Post structure**: Consistent front matter with categories, tags, descriptions

### Prompt Post Structure (Example)

```yaml
---
layout: prompt-details
title: "AI Teaching Assistant Prompt Creator"
description: "A structured dialogue-based prompt..."
permalink: /prompts/ai-teaching-assistant-prompt-creator/
categories: [Prompts]
tags: 
  - Education
  - Instructional Design
  - AI Assistants
---
```

## Implementation Steps

### Phase 1: Dynamic Card Generation

1. **Replace static cards section** in `_layouts/prompt-library.html`
2. **Add Jekyll liquid templating** to iterate through prompt posts
3. **Extract post metadata** (title, description, tags, permalink)
4. **Maintain existing card structure** and CSS classes

### Phase 2: Dynamic Category Filters

1. **Generate category buttons** from unique tags across all prompt posts
2. **Update JavaScript** to handle dynamic category filtering
3. **Preserve existing filter functionality**

### Phase 3: Enhanced Features

1. **Improve copy functionality** to copy actual prompt content
2. **Add search capability** across post titles and descriptions
3. **Implement sorting** by date and other criteria

### Phase 4: Testing & Validation

1. **Test with existing posts** to ensure proper rendering
2. **Validate responsive design** across different screen sizes
3. **Check accessibility** features and ARIA labels
4. **Performance testing** with full post collection

## Technical Decisions

### Data Filtering

- Use `categories: [Prompts]` to filter relevant posts
- Leverage existing `tags` array for category filtering
- Fallback from `description` to `excerpt` for card text

### Backward Compatibility

- Maintain all existing CSS classes and JavaScript
- Preserve Bootstrap grid layout and responsive behavior
- Keep current accessibility features intact

### Performance Considerations

- Limit initial display to reasonable number (12-15 cards)
- Consider pagination for larger collections
- Optimize liquid templating for build performance

## File Changes Required

1. **`_layouts/prompt-library.html`**
   - Replace static cards with Jekyll loops
   - Update category filter buttons
   - Enhance JavaScript for dynamic content

2. **No changes needed to**
   - `/prompts/index.html` (already uses correct layout)
   - Individual prompt post files
   - CSS or styling files

## Success Criteria

- [ ] All existing prompt posts display correctly as cards
- [ ] Category filtering works with actual post tags
- [ ] Search functionality operates on real content
- [ ] Copy feature works with actual prompt content
- [ ] Responsive design preserved
- [ ] Accessibility features maintained
- [ ] Page loads performantly with full collection

## Risk Mitigation

- **Build performance**: Monitor Jekyll build times with full collection
- **Content consistency**: Validate all posts have required front matter
- **Browser compatibility**: Test JavaScript across supported browsers
