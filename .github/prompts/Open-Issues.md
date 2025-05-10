<!-- ========================================= -->
<!--  UX-001 : Increase Base Typography & Readability -->
<!-- ========================================= -->
## Summary
Raise baseline font size, tighten line-length, and adjust line-height so paragraphs are comfortable on mobile and desktop.

### User Story
As a **visitor on any device**,  
I want body text to be large and well-spaced,  
so that I can read long articles without eye strain.

### Acceptance Criteria
- [x] Base `<html>` font-size set to **16 px or rem equivalent**.
- [ ] Paragraphs constrained to **max-width: 65ch** on screens ≥ 640 px.
- [ ] Line-height between **1.4–1.6** for body copy.
- [ ] Typography changes pass **Lighthouse “Readability” audit** with score ≥ 90.

### Priority
`High`

---

<!-- ========================================= -->
<!--  NAV-002 : Introduce Sticky Section Navigation -->
<!-- ========================================= -->
## Summary
Provide a persistent, minimal navigation that appears after the hero image scrolls out of view.

### User Story
As a **scanning user**,  
I want quick access to Blog, Career, Projects, and Contact,  
so I can jump to sections without endless scrolling.

### Acceptance Criteria
- [x] When the hero `<section>` exits viewport, a sticky nav (height ≤ 56 px) fades in.
- [ ] Nav contains anchor links to **#blog, #career, #projects, #contact**.
- [ ] Nav respects `prefers-reduced-motion: reduce` (no animation if set).
- [ ] Tested on Chrome, Safari, Firefox, Edge (desktop + mobile) with no layout shift.

### Priority
`High`

---

<!-- ========================================= -->
<!--  RES-003 : Refactor "Career" Section into Collapsible Cards -->
<!-- ========================================= -->
## Summary
Replace bullet-list résumé with expandable cards to reduce cognitive load.

### User Story
As a **recruiter**,  
I want a terse overview of each role with the option to read details,  
so I can understand Ted’s trajectory quickly.

### Acceptance Criteria
- [ ] Each role displayed as a **card** (company logo, title, years, 1-line mission).
- [ ] Card expands on click/keyboard **Enter/Space** to reveal detailed bullets.
- [ ] **ARIA role="button"** and `aria-expanded` implemented for accessibility.
- [ ] Cards collapse automatically when another card opens (accordion behavior).

### Priority
`Medium`

---

<!-- ========================================= -->
<!--  VIS-004 : Harmonize Image Art Direction -->
<!-- ========================================= -->
## Summary
Ensure visual cohesion between AI illustrations, screenshots, and stock photos.

### User Story
As a **design-savvy visitor**,  
I want consistent imagery,  
so the site feels intentional and professional.

### Acceptance Criteria
- [ ] Choose **one** of the following strategies and apply globally:  
  - (A) Stylized illustration thumbnails for every section **OR**  
  - (B) Realistic photos + UI mockups with a shared color-grade overlay.
- [ ] All images share a common **aspect ratio** per section (e.g., 16:9).
- [ ] Implement a CSS overlay (`linear-gradient`) if mixing media.
- [ ] Largest Contentful Paint (LCP) image lazy-loads below the fold.

### Priority
`Medium`

---

<!-- ========================================= -->
<!--  A11Y-005 : WCAG 2.1 AA Compliance Pass -->
<!-- ========================================= -->
## Summary
Fix contrast issues and add semantic labels for icons.

### User Story
As a **low-vision user**,  
I want sufficient contrast and screen-reader cues,  
so I can navigate the site without barriers.

### Acceptance Criteria
- [ ] Text/background contrast ≥ 4.5:1 on all interactive elements.
- [ ] Social/footer icons include `aria-label` attributes.
- [ ] All `<img>` have descriptive `alt` text or `role="presentation"`.
- [ ] Site passes an **axe DevTools** scan with **0 critical** issues.

### Priority
`Medium`

---

<!-- ========================================= -->
<!--  FOOT-006 : Reformat Footer Bio & CTAs -->
<!-- ========================================= -->
## Summary
Break footer wall-of-text into digestible layout.

### User Story
As a **potential collaborator**,  
I want a quick bio and clear contact buttons,  
so I know who Ted is and how to reach him.

### Acceptance Criteria
- [ ] Two-column layout: left—avatar + 3-sentence bio; right—CTA buttons.
- [ ] Include buttons for **Email**, **LinkedIn**, **Résumé PDF**.
- [ ] Footer remains responsive down to 320 px width.

### Priority
`Low`

---

<!-- ========================================= -->
<!--  MOT-007 : Add Subtle Motion for Engagement -->
<!-- ========================================= -->
## Summary
Introduce light scroll-triggered fades/parallax with respect for motion preferences.

### User Story
As an **engaged reader**,  
I enjoy small motion cues that guide my attention,  
so the page feels alive but not distracting.

### Acceptance Criteria
- [ ] Section headers fade-in (opacity 0 → 1, duration ≤ 400 ms).
- [ ] Parallax effect on hero background limited to **translateY ≤ 20 px**.
- [ ] All motion disabled when `prefers-reduced-motion: reduce` is true.
- [ ] No JavaScript libraries ≥ 5 kB added; use CSS where possible.

### Priority
`Low`

---

<!-- ========================================= -->
<!--  LAY-008 : Enhance Section Spacing & Visual Rhythm -->
<!-- ========================================= -->
## Summary
Increase vertical whitespace and accent color on section titles.

### User Story
As a **reader skimming the page**,  
I want clear breaks between sections,  
so the structure is obvious at a glance.

### Acceptance Criteria
- [ ] Add `margin-top` of **6 rem** (desktop) / **4 rem** (mobile) between main sections.
- [ ] Section titles use accent color `#FFD166` (or design-system variable).
- [ ] Title font-size escalates progressively: h2 = 2.25 rem, h3 = 1.5 rem.

### Priority
`Low`

