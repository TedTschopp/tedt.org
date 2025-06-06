# Fade Watermark Behind Text

**Priority:** High
**Type:** Design / CSS Enhancement
**Status:** To Do

## Problem

The semi‑opaque "Energy for What’s Ahead" watermark currently sits directly behind long bullet lists and paragraph text, reducing legibility and causing visual noise—especially on lower‑brightness screens.

## Proposed Solution

* Identify the watermark element(s) and assign a unique class (e.g., `.watermark`).
* Reduce opacity from \~0.15 to ≤ 0.03.
* Add `pointer-events: none;` so the watermark never intercepts clicks/taps.
* Ensure the watermark is removed (or set to `display:none`) on narrow viewports where space is limited.

## Benefits

* Significantly better text clarity and reading comfort.
* Meets WCAG AA contrast guidelines.
* Cleaner aesthetic with no functional downside.

## Implementation Plan

### Phase 1: Audit Watermark Usage

* [ ] Locate all HTML elements that render the watermark.
* [ ] Verify they share a common class or add a new one.

### Phase 2: CSS Adjustment

* [ ] Create or modify a modular CSS override file.
* [ ] Apply new opacity and pointer‑events rules.

### Phase 3: Responsive & Regression Testing

* [ ] Test across breakpoints (≥ 1920 px to ≤ 360 px).
* [ ] Confirm no overlap with interactive elements.

## Files to Create

* `css/utilities/watermark.css`

## Files to Modify

* `index.html` (add class if missing)
* `scss/main.scss` (import watermark partial)

## Dependencies

* Build pipeline must include new CSS partial.

## Testing Checklist

* [ ] Lighthouse contrast score ≥ 90.
* [ ] No clickable links obscured by watermark.
* [ ] Visual QA on dark & light‑mode monitors.
