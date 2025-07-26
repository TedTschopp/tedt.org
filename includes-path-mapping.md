# Jekyll Includes Refactoring - File Path Mapping

This file documents all the path changes made during the refactoring.

## Old Path → New Path Mappings

### Layout Files
- `header.html` → `layout/header.html`
- `footer.html` → `layout/footer.html`
- `top-nav-bar.html` → `layout/top-nav-bar.html`
- `top-of-body.html` → `layout/top-of-body.html`

### Assets Files
- `all-css-includes.html` → `assets/all-css-includes.html`
- `css-bootstrap.html` → `assets/css-bootstrap.html`
- `js-bootstrap.html` → `assets/js-bootstrap.html`
- `js-bottom-of-body.html` → `assets/js-bottom-of-body.html`
- `js-jquery.html` → `assets/js-jquery.html`
- `js-fontawesome.html` → `assets/js-fontawesome.html`
- `scripts.html` → `assets/scripts.html`
- `rough-notation.html` → `assets/rough-notation.html`

### SEO Files
- `meta-data-seo.html` → `seo/meta-data-seo.html`
- `twitter-card-metadata.jekyll` → `seo/twitter-card-metadata.html`
- `indieauth-and-webmentions-metadata.html` → `seo/indieauth-webmentions-metadata.html`

### Analytics Files
- `js-google-analytics.html` → `analytics/google-analytics.html`
- `js-facebook-analytics.html` → `analytics/facebook-analytics.html`
- `js-clarity.html` → `analytics/clarity.html`
- `js-drift.html` → `analytics/drift.html`
- `js-mailchimp.html` → `analytics/mailchimp.html`

### Social Files
- `embed-twitter.html` → `social/embed-twitter.html`
- `comments.html` → `social/comments.html`
- `comments-mastodon.html` → `social/comments-mastodon.html`
- `comments-mastodon-tree.html` → `social/comments-mastodon-tree.html`
- `comments-webmentions.html` → `social/comments-webmentions.html`
- `webmention-io-all-templates.html` → `social/webmention-all-templates.html`
- `webmention-io-bookmarks.html` → `social/webmention-bookmarks.html`
- `webmention-io-count.html` → `social/webmention-count.html`
- `webmention-io-likes.html` → `social/webmention-likes.html`
- `webmention-io-links.html` → `social/webmention-links.html`
- `webmention-io-posts.html` → `social/webmention-posts.html`
- `webmention-io-replies.html` → `social/webmention-replies.html`
- `webmention-io-reposts.html` → `social/webmention-reposts.html`
- `webmention-io-rsvps.html` → `social/webmention-rsvps.html`
- `webmention-io-webmentions.html` → `social/webmention-webmentions.html`

### Content Files
- `post_preview.html` → `content/post-preview.html`
- `next_and_previous.html` → `content/next-and-previous.html`
- `figure.html` → `content/figure.html`
- `progress.html` → `content/progress.html`
- `progress-bar.html` → `content/progress-bar.html`
- `link-tree.html` → `content/link-tree.html`
- `publish-and-update-date-time-v2.html` → `content/publish-and-update-date-time-v2.html`
- `publish-and-update-date-time.html` → `content/publish-and-update-date-time.html`

### Utility Files
- `fuzzy-date.html` → `utility/fuzzy-date.html`
- `title-case.html` → `utility/title-case.html`
- `calculate-variables.html` → `utility/calculate-variables.html`
- `expand-abbreviations.html` → `utility/expand-abbreviations.html`
- `full-category.html` → `utility/full-category.html`
- `category-emoji.html` → `utility/category-emoji.html`
- `google-search.html` → `utility/google-search.html`
- `js-toggle-theme.html` → `utility/toggle-theme.html`

### Feeds Files
- `feeds.html` → `feeds/feeds.html`
- `feeds.jekyll` → `feeds/feeds.xml`

### PWA Files
- `pwa-header-includes.html` → `pwa/pwa-header-includes.html`

### Gaming Files
- `MCC-Creatures.html` → `gaming/mcc-creatures.html`
- `creatures.html` → `gaming/creatures.html`
- `gamma-world-error-messages.html` → `gaming/gamma-world-error-messages.html`

### Personal Files
- `Tschopp-HouseMark-Optimum.html` → `personal/tschopp-house-mark.html`
- `h-card.html` → `personal/h-card.html`
- `resume.html` → `personal/resume.html`
- `html-contact-us-icons.html` → `personal/contact-icons.html`
- `html-home-page-social-media-posts.html` → `personal/home-social-posts.html`

### Themes (formerly Template)
- `template/` → `themes/` (directory renamed)

## Files That Need Reference Updates

Based on the grep search, these are the main files that reference includes and need updates:

### Layout Files (Priority: High)
- `_layouts/micropubpost.html`
- `_layouts/post.html`
- `_layouts/prompt-details.html`
- `_layouts/prompt-library.html`
- `_layouts/quotes.html`
- `_layouts/category.html`
- `_layouts/gammaworld.html`
- `_layouts/default.html`

### Posts (Priority: Medium)
- Various posts using `figure.html` in `_posts/RPG Posts/`

### Other Includes (Priority: Medium)
- Some includes may reference other includes

## Update Strategy

1. Start with the most commonly used includes (layout, assets, seo)
2. Update layout files first since they're used by all pages
3. Update content and utility includes
4. Update gaming and personal includes
5. Test build after each major category of updates
