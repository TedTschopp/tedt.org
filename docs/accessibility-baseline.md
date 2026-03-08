# Accessibility Baseline

This document defines the representative accessibility audit surface for tedt.org and the repeatable commands used to evaluate it.

## Representative Page Set

- Homepage: `/`
- Prompt library: `/prompts/`
- Prompt detail page: `/prompts/business-case-and-requirements-assistant/`
- Profile page: `/profile/`
- Category archive: `/category/Prompts.html`
- Long-form article: `/Swiss-Folklore/The-Basilisk-Egg/`

These pages were chosen to cover the site's major rendering patterns without pretending that every standalone tool or legacy direct-entry HTML page is part of the same accessibility surface.

## Repeatable Commands

```bash
npm run test:a11y:baseline
npm run test:a11y
npm run test:a11y:strict
```

- `test:a11y:baseline` generates the current representative audit report.
- `test:a11y` runs the broader accessibility-oriented Playwright suite.
- `test:a11y:strict` is the enforcement mode for future CI gating once the known gaps are remediated.

## Latest Prioritized Gaps

Latest baseline summary from `npm run test:a11y:baseline`:

- Color contrast is the dominant remaining issue: 147 serious findings across the homepage, prompt library, prompt detail, category archive, and long-form article surfaces.
- Long-form article markup still has 4 serious list-structure findings on `/Swiss-Folklore/The-Basilisk-Egg/`.
- Profile currently audited clean for serious and critical axe findings in the representative page set.

## Audit Artifacts

The baseline Playwright run writes its current findings to:

- `reports/accessibility/site-baseline.json`
- `reports/accessibility/site-baseline.md`

This keeps the representative page set, repeatable command path, and latest findings tied together without turning this baseline issue into the implementation bucket for every accessibility defect.
