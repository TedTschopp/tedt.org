# Accessibility & Semantic QA Checklist

Use this list before publishing significant layout or component changes.

## Landmarks & Structure

- [ ] Exactly one `<main>` per page.
- [ ] Skip link focuses `#main_content`.
- [ ] Sidebars use `<aside role="complementary" aria-labelledby>`.

## Headings

- [ ] Single `<h1>` per page.
- [ ] No skipped heading levels.

## Images

- [ ] Meaningful alt text (or empty alt for decorative images).
- [ ] Avatar alts follow pattern: "Name avatar".
- [ ] Webmention/logo images have alt or `aria-hidden`.
- [ ] Non-hero post images lazy-load.

## Navigation & Controls

- [ ] Icon-only links have `aria-label`.
- [ ] Dropdowns manage `aria-expanded`.

## Lists

- [ ] Only `<li>` children under `<ul>/<ol>`.
- [ ] Category/post lists expose accessible link text.

## Progress / Status

- [ ] Draft stages rendered as list with `aria-current="step"`.

## Maps / Media

- [ ] Map has nearby descriptive context (heading or caption).

## Structured Data

- [ ] Article JSON-LD on posts; WebSite schema global.

## Performance

- [ ] Hero image not lazy-loaded.
- [ ] Fonts optimized (subset / preload) (planned).

## Automated Audit

Run (example):

```bash
npx lighthouse http://localhost:4000 --only-categories=accessibility,seo,best-practices,performance
```

---
Generated {{ "now" | date: "%Y-%m-%d" }}.
