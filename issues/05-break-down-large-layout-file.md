# Break Down Large Layout File

**Priority:** Medium  
**Type:** Refactoring  
**Status:** Open  

## Problem

The `_layouts/default.html` file is 557 lines, exceeding the project's 200-300 line guideline. It handles too many responsibilities:
- Hero section
- Blog post listing
- Folklore section
- Category carousel
- Career/projects sections

## Current Issues

- File too large and complex
- Multiple responsibilities in single file
- Hard to maintain and debug
- Violates single responsibility principle

## Proposed Solution

Break into focused includes:
1. `_includes/hero-section.html`
2. `_includes/blog-section.html` 
3. `_includes/folklore-section.html`
4. `_includes/category-carousel.html`
5. `_includes/career-section.html`
6. `_includes/projects-section.html`

## Implementation Plan

### Phase 1: Create Section Includes
- [ ] Extract hero section (lines ~44-60)
- [ ] Extract blog section (lines ~61-150)
- [ ] Extract folklore section (lines ~151-225)
- [ ] Extract category carousel (lines ~226-425)
- [ ] Extract career section (lines ~426-445)
- [ ] Extract projects section (lines ~446-end)

### Phase 2: Update Default Layout
- [ ] Replace sections with include calls
- [ ] Pass necessary variables to includes
- [ ] Test all sections render correctly

### Phase 3: Optimize and Clean
- [ ] Remove unused variables from main layout
- [ ] Ensure proper variable scoping
- [ ] Add comments for clarity

## Files to Create

- `_includes/hero-section.html`
- `_includes/blog-section.html`
- `_includes/folklore-section.html`
- `_includes/category-carousel.html`
- `_includes/career-section.html`
- `_includes/projects-section.html`

## Files to Modify

- `_layouts/default.html` (significantly simplified)

## New Default Layout Structure

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
  <head>
    <!-- Head content -->
  </head>
  <body>
    {% include top-nav-bar.html %}
    
    {% include hero-section.html %}
    
    <div class="container py-4 py-xl-5">
      <section>
        <div class="container h-100 position-relative" style="top: -75px;">
          <div class="row gy-5 gy-lg-0 row-cols-1 row-cols-md-2 row-cols-lg-3">
            {% include blog-section.html %}
            {% include folklore-section.html %}
            {% include category-carousel.html %}
          </div>
        </div>
      </section>
    </div>

    {% include career-section.html %}
    {% include projects-section.html %}
    {% include footer.html %}
    {% include js-bottom-of-body.html %}
  </body>
</html>
```

## Benefits

- Follows single responsibility principle
- Easier to test and maintain individual sections
- Better code organization
- Reusable components
- Meets file size guidelines
- Improved debugging experience

## Dependencies

- Should be implemented after Issue #2 (post card include)
- Consider implementing alongside Issue #3 (CSS extraction)

## Testing Checklist

- [ ] All sections render correctly
- [ ] No missing content
- [ ] CSS and JavaScript still work
- [ ] Variables are properly passed between includes
- [ ] Page performance is maintained
- [ ] Mobile responsiveness works
- [ ] Each include can be tested independently
