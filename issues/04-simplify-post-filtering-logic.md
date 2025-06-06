# Simplify Post Filtering Logic

**Priority:** Low  
**Type:** Optimization  
**Status:** Open  

## Problem

The blog post filtering logic (lines 72-87 in `_layouts/default.html`) uses multiple elsif statements that are inefficient and hard to maintain:

```liquid
{% if post.categories contains "Bestiary" or post.category == "Bestiary" %}
  <!-- Do Nothing -->
{% elsif post.categories contains "Draft" or post.category == "Draft" %}
  <!-- Do Nothing -->
{% elsif post.categories contains "Role Playing Games" or post.category == "Role Playing Games" %}
  <!-- Do Nothing -->
<!-- ... 6 more similar elsif blocks ... -->
```

## Current Issues

- 8 separate elsif statements for exclusions
- Hard to maintain when adding/removing categories
- Inefficient logic processing
- Code duplication with category/categories checks

## Proposed Solution

1. Create `_data/excluded-categories.yml` with list of categories to exclude
2. Use Liquid's `unless` filter with `where_exp` for cleaner logic
3. Reduce from 8 elsif statements to single filter

## Implementation Plan

### Phase 1: Create Data File
- [ ] Create `_data/excluded-categories.yml`
- [ ] List all excluded categories:
  ```yaml
  categories:
    - "Bestiary"
    - "Draft"
    - "Role Playing Games"
    - "Folklore"
    - "Quotes"
    - "Home"
    - "Prompts"
  layouts:
    - "micropubpost"
    - "prompt"
  ```

### Phase 2: Update Template Logic
- [ ] Replace elsif chain with single filter
- [ ] Use `unless` condition with array contains
- [ ] Test that filtering still works correctly

### Phase 3: Optimize Further
- [ ] Consider using `where_exp` for more complex filtering
- [ ] Ensure performance is maintained or improved

## Files to Create

- `_data/excluded-categories.yml`

## Files to Modify

- `_layouts/default.html`

## New Logic Structure

```liquid
{% assign excluded_cats = site.data.excluded-categories.categories %}
{% assign excluded_layouts = site.data.excluded-categories.layouts %}

{% for post in site.posts %}
  {% unless excluded_cats contains post.category or 
           excluded_layouts contains post.layout %}
    <!-- Process post -->
  {% endunless %}
{% endfor %}
```

## Benefits

- More maintainable category exclusions
- Better performance with single condition check
- Cleaner template code
- Easier to add/remove excluded categories
- Centralized configuration

## Testing Checklist

- [ ] Same posts are displayed as before
- [ ] No excluded categories appear
- [ ] Performance is maintained or improved
- [ ] Easy to add new excluded categories
- [ ] Logic works for both category and categories fields
