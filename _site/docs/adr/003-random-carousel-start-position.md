# ADR-003: Random Carousel Start Position for Homepage Categories

## Status

**Status:** Accepted

## Context

The homepage carousel currently displays blog categories in a fixed order, always starting with the first category defined in the `categories-on-blog.yml` data file. This creates an imbalance in visibility, as the first category receives significantly more exposure than others, especially for users who don't interact with the carousel controls.

**Business Drivers:**

- Equal exposure for all blog categories
- Improved user engagement with diverse content
- Enhanced discoverability of different content types

**Technical Drivers:**

- Current Jekyll template uses static `{% if forloop.first %}active{% endif %}` logic
- Bootstrap carousel requires exactly one item to have the `active` class on initialization
- Need to maintain existing carousel functionality while randomizing start position

## Decision

We will implement client-side JavaScript to randomly select which carousel item is active on page load, replacing the static Jekyll template logic.

**Implementation approach:**

1. Remove hardcoded `active` class from Jekyll template
2. Add JavaScript that runs on DOM ready to randomly select and activate one carousel item
3. Properly initialize Bootstrap carousel with the random starting position

## Alternatives Considered

### Alternative 1: Server-side randomization in Jekyll

**Pros:** No client-side JavaScript required
**Cons:** Would require Jekyll plugin or complex Liquid logic; wouldn't work with static hosting limitations; less flexible

### Alternative 2: CSS-only solution using nth-child randomization

**Pros:** No JavaScript required
**Cons:** CSS cannot generate true randomness; would require complex media queries; not truly random

### Alternative 3: Keep current behavior

**Pros:** No development effort required
**Cons:** Continues to give unfair advantage to first category; poor user experience

## Consequences

### Positive

- **Equal visibility:** All blog categories get equal chance of being featured first
- **Improved UX:** Users see different content on repeat visits
- **Maintained functionality:** All existing carousel features continue to work
- **Low risk:** Isolated change with minimal impact on other systems

### Negative

- **Additional JavaScript:** Adds small amount of client-side code
- **Browser dependency:** Requires JavaScript to be enabled (graceful degradation to first item)
- **Testing complexity:** Need to verify randomization works across different scenarios

### Neutral

- **Performance impact:** Negligible - single DOM query and class manipulation
- **Maintainability:** Self-contained code with clear purpose

## Implementation Details

**Files modified:**

- `_layouts/default.html`: Remove static active class, add randomization script

**Code structure:**

- New JavaScript function isolated in its own block
- Defensive programming (checks for element existence)
- No interference with existing hero video transition script

**Browser support:**

- Compatible with all modern browsers
- Graceful degradation: falls back to no active item if JavaScript fails

## Monitoring and Success Criteria

**Success metrics:**

- Carousel successfully starts on different items across page reloads
- All carousel controls (previous/next) continue to function
- No JavaScript errors in browser console
- Page load performance remains unchanged

**Testing requirements:**

- Manual testing across multiple browsers
- Verification of randomization distribution
- Regression testing of existing carousel functionality

## Related Documents

- Planning document: `/docs/planning/carousel-random-start-position.md`
- Implementation: See changes in `_layouts/default.html`
