# Planning: Random Carousel Start Position

## Objective

Implement functionality to make the homepage carousel start on a random category entry each time the page loads, providing equal exposure to all blog categories.

## Current State Analysis

- Carousel currently uses Jekyll liquid templating with `{% if forloop.first %}active{% endif %}` to set the first item as active
- Bootstrap carousel initialization happens automatically via `data-bs-ride="false"`
- Carousel contains multiple blog categories from `site.data['categories-on-blog']`

## Proposed Solution

1. **Remove hardcoded active class** from Jekyll template
2. **Add JavaScript** to randomly select and activate a carousel item on page load
3. **Ensure proper Bootstrap carousel initialization** with the random starting position

## Implementation Steps

1. Remove `{% if forloop.first %}active{% endif %}` from carousel item template
2. Add `data-category-index="{{ forloop.index0 }}"` for debugging purposes
3. Create JavaScript function that:
   - Waits for DOM ready
   - Finds all carousel items
   - Generates random index
   - Adds active class to random item
   - Properly initializes Bootstrap carousel

## Considerations

- Must ensure Bootstrap carousel is properly initialized after random selection
- Should maintain existing carousel functionality (controls, timing, etc.)
- Code should be defensive (check for element existence)
- Should not interfere with existing hero video transition script

## Testing Requirements

- Verify carousel starts on different items across page reloads
- Ensure carousel controls (prev/next) work correctly
- Confirm carousel timing and transitions remain intact
- Test across different browsers

## Impact Assessment

- **Low risk** - Isolated change to homepage carousel behavior
- **No breaking changes** - Maintains all existing functionality
- **Improved UX** - Provides equal exposure to all blog categories
