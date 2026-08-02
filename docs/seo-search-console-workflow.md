---
layout: null
sitemap: false
---

# Search Console SEO prioritization workflow

Use real Search Console performance data to decide which titles and pages to improve. Character counts are warning signals, not ranking rules.

## Export

1. Open **Search results → Performance** for the `tedt.org` property.
2. Select a 90-day comparison window when evaluating a sustained change.
3. Open the **Pages** tab and export CSV.
4. Save the export outside the repository if it contains private performance data.

## Generate the working queue

Build the site, then run:

```sh
bundle exec jekyll build
bundle exec ruby scripts/analyze_search_console_performance.rb \
  --pages /path/to/Pages.csv \
  --site _site \
  --output reports/seo/search-console
```

The report prioritizes pages with substantial impressions, low CTR, and average positions 4–20. It also shows the current rendered title and description lengths.

## Apply changes

- Use `seo_title:` for a concise search title when the visible `title:` is intentionally longer.
- Preserve the visible H1 unless the page itself needs editorial revision.
- Improve content only when it better answers the queries producing impressions.
- Add contextual links from the appropriate topic hub to promising pages in positions 10–20.
- Compare 28- and 90-day performance after Google has recrawled the changed URLs.

Do not commit raw Search Console exports unless they are intentionally approved for publication.
