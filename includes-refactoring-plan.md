# Jekyll Includes Refactoring Plan

## Overview
Refactoring the `_includes/` directory to improve organization, naming consistency, and maintainability.

## New Directory Structure

### `/layout/` - Layout and structural components
- header.html → header.html
- footer.html → footer.html  
- top-nav-bar.html → top-nav-bar.html
- top-of-body.html → top-of-body.html
- bootstrap4-navigation.html → bootstrap4-navigation.html (if exists)

### `/assets/` - CSS, JS, and dependency management
- all-css-includes.html → all-css-includes.html
- css-bootstrap.html → css-bootstrap.html
- js-bootstrap.html → js-bootstrap.html
- js-bottom-of-body.html → js-bottom-of-body.html
- js-jquery.html → js-jquery.html
- js-fontawesome.html → js-fontawesome.html
- scripts.html → scripts.html
- rough-notation.html → rough-notation.html

### `/seo/` - SEO, metadata, and social cards
- meta-data-seo.html → meta-data-seo.html
- twitter-card-metadata.jekyll → twitter-card-metadata.html
- indieauth-and-webmentions-metadata.html → indieauth-webmentions-metadata.html

### `/social/` - Social media and third-party integrations
- embed-twitter.html → embed-twitter.html
- comments.html → comments.html
- comments-mastodon.html → comments-mastodon.html
- comments-mastodon-tree.html → comments-mastodon-tree.html
- comments-webmentions.html → comments-webmentions.html
- webmention-io-all-templates.html → webmention-all-templates.html
- webmention-io-bookmarks.html → webmention-bookmarks.html
- webmention-io-count.html → webmention-count.html
- webmention-io-likes.html → webmention-likes.html
- webmention-io-links.html → webmention-links.html
- webmention-io-posts.html → webmention-posts.html
- webmention-io-replies.html → webmention-replies.html
- webmention-io-reposts.html → webmention-reposts.html
- webmention-io-rsvps.html → webmention-rsvps.html
- webmention-io-webmentions.html → webmention-webmentions.html

### `/analytics/` - Analytics and tracking
- js-google-analytics.html → google-analytics.html
- js-facebook-analytics.html → facebook-analytics.html
- js-clarity.html → clarity.html
- js-drift.html → drift.html
- js-mailchimp.html → mailchimp.html

### `/content/` - Content display and navigation
- post_preview.html → post-preview.html
- next_and_previous.html → next-and-previous.html
- figure.html → figure.html
- progress.html → progress.html
- progress-bar.html → progress-bar.html
- link-tree.html → link-tree.html

### `/utility/` - Helper functions and utilities
- fuzzy-date.html → fuzzy-date.html
- title-case.html → title-case.html
- calculate-variables.html → calculate-variables.html
- expand-abbreviations.html → expand-abbreviations.html
- full-category.html → full-category.html
- category-emoji.html → category-emoji.html
- google-search.html → google-search.html
- js-toggle-theme.html → toggle-theme.html

### `/feeds/` - RSS and data feeds
- feeds.html → feeds.html
- feeds.jekyll → feeds.xml

### `/pwa/` - Progressive Web App features
- pwa-header-includes.html → pwa-header-includes.html

### `/gaming/` - RPG and gaming specific includes
- MCC-Creatures.html → mcc-creatures.html
- creatures.html → creatures.html
- gamma-world-error-messages.html → gamma-world-error-messages.html

### `/personal/` - Personal branding and identity
- Tschopp-HouseMark-Optimum.html → tschopp-house-mark.html
- h-card.html → h-card.html
- resume.html → resume.html
- html-contact-us-icons.html → contact-icons.html
- html-home-page-social-media-posts.html → home-social-posts.html

### `/themes/` - Template themes (rename from `/template/`)
- Keep existing template/ structure but rename directory

## Implementation Plan

1. **Phase 1: Create directory structure**
2. **Phase 2: Move and rename files by category**
3. **Phase 3: Update all references in layouts, posts, and includes**
4. **Phase 4: Test build and fix any broken references**
5. **Phase 5: Create documentation**

## References to Update

Based on grep search, major files using includes:
- All layout files in `_layouts/`
- Posts using `figure.html`
- Any other includes referencing each other

## Naming Convention Rules

- Use kebab-case for all filenames
- Remove redundant prefixes (js-, html-, webmention-io-)
- Keep descriptive but concise names
- Maintain .html extension (change .jekyll to .html where appropriate)
