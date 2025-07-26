#!/bin/bash

# Jekyll Includes Refactoring Script
# This script updates all references to the moved include files

echo "Starting Jekyll includes refactoring..."

# Function to update includes in a file
update_includes() {
    local file="$1"
    echo "Updating includes in: $file"
    
    # Layout files
    sed -i '' 's/{% include header\.html %}/{% include layout\/header.html %}/g' "$file"
    sed -i '' 's/{% include footer\.html %}/{% include layout\/footer.html %}/g' "$file"
    sed -i '' 's/{% include top-nav-bar\.html %}/{% include layout\/top-nav-bar.html %}/g' "$file"
    sed -i '' 's/{% include top-of-body\.html %}/{% include layout\/top-of-body.html %}/g' "$file"
    sed -i '' 's/{% include bootstrap4-navigation\.html %}/{% include layout\/bootstrap4-navigation.html %}/g' "$file"
    
    # Assets files
    sed -i '' 's/{% include all-css-includes\.html %}/{% include assets\/all-css-includes.html %}/g' "$file"
    sed -i '' 's/{% include css-bootstrap\.html %}/{% include assets\/css-bootstrap.html %}/g' "$file"
    sed -i '' 's/{% include js-bootstrap\.html %}/{% include assets\/js-bootstrap.html %}/g' "$file"
    sed -i '' 's/{% include js-bottom-of-body\.html %}/{% include assets\/js-bottom-of-body.html %}/g' "$file"
    sed -i '' 's/{% include js-jquery\.html %}/{% include assets\/js-jquery.html %}/g' "$file"
    sed -i '' 's/{% include js-fontawesome\.html %}/{% include assets\/js-fontawesome.html %}/g' "$file"
    sed -i '' 's/{% include scripts\.html %}/{% include assets\/scripts.html %}/g' "$file"
    sed -i '' 's/{% include rough-notation\.html %}/{% include assets\/rough-notation.html %}/g' "$file"
    
    # SEO files
    sed -i '' 's/{% include meta-data-seo\.html %}/{% include seo\/meta-data-seo.html %}/g' "$file"
    sed -i '' 's/{% include twitter-card-metadata\.jekyll %}/{% include seo\/twitter-card-metadata.html %}/g' "$file"
    sed -i '' 's/{% include indieauth-and-webmentions-metadata\.html %}/{% include seo\/indieauth-webmentions-metadata.html %}/g' "$file"
    
    # Analytics files
    sed -i '' 's/{% include js-google-analytics\.html %}/{% include analytics\/google-analytics.html %}/g' "$file"
    sed -i '' 's/{% include js-facebook-analytics\.html %}/{% include analytics\/facebook-analytics.html %}/g' "$file"
    sed -i '' 's/{% include js-clarity\.html %}/{% include analytics\/clarity.html %}/g' "$file"
    sed -i '' 's/{% include js-drift\.html %}/{% include analytics\/drift.html %}/g' "$file"
    sed -i '' 's/{% include js-mailchimp\.html %}/{% include analytics\/mailchimp.html %}/g' "$file"
    
    # Social files
    sed -i '' 's/{% include embed-twitter\.html %}/{% include social\/embed-twitter.html %}/g' "$file"
    sed -i '' 's/{% include comments\.html %}/{% include social\/comments.html %}/g' "$file"
    sed -i '' 's/{% include comments-mastodon\.html %}/{% include social\/comments-mastodon.html %}/g' "$file"
    sed -i '' 's/{% include comments-mastodon-tree\.html %}/{% include social\/comments-mastodon-tree.html %}/g' "$file"
    sed -i '' 's/{% include comments-webmentions\.html %}/{% include social\/comments-webmentions.html %}/g' "$file"
    
    # Webmention files (with new naming)
    sed -i '' 's/{% include webmention-io-all-templates\.html %}/{% include social\/webmention-all-templates.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-bookmarks\.html %}/{% include social\/webmention-bookmarks.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-count\.html %}/{% include social\/webmention-count.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-likes\.html %}/{% include social\/webmention-likes.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-links\.html %}/{% include social\/webmention-links.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-posts\.html %}/{% include social\/webmention-posts.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-replies\.html %}/{% include social\/webmention-replies.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-reposts\.html %}/{% include social\/webmention-reposts.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-rsvps\.html %}/{% include social\/webmention-rsvps.html %}/g' "$file"
    sed -i '' 's/{% include webmention-io-webmentions\.html %}/{% include social\/webmention-webmentions.html %}/g' "$file"
    
    # Content files (including renamed ones)
    sed -i '' 's/{% include post_preview\.html %}/{% include content\/post-preview.html %}/g' "$file"
    sed -i '' 's/{% include next_and_previous\.html %}/{% include content\/next-and-previous.html %}/g' "$file"
    sed -i '' 's/{% include figure\.html %}/{% include content\/figure.html %}/g' "$file"
    sed -i '' 's/{% include progress\.html %}/{% include content\/progress.html %}/g' "$file"
    sed -i '' 's/{% include progress-bar\.html %}/{% include content\/progress-bar.html %}/g' "$file"
    sed -i '' 's/{% include link-tree\.html %}/{% include content\/link-tree.html %}/g' "$file"
    sed -i '' 's/{% include publish-and-update-date-time-v2\.html %}/{% include content\/publish-and-update-date-time-v2.html %}/g' "$file"
    sed -i '' 's/{% include publish-and-update-date-time\.html %}/{% include content\/publish-and-update-date-time.html %}/g' "$file"
    
    # Utility files (including renamed ones)
    sed -i '' 's/{% include fuzzy-date\.html %}/{% include utility\/fuzzy-date.html %}/g' "$file"
    sed -i '' 's/{% include title-case\.html %}/{% include utility\/title-case.html %}/g' "$file"
    sed -i '' 's/{% include calculate-variables\.html %}/{% include utility\/calculate-variables.html %}/g' "$file"
    sed -i '' 's/{% include expand-abbreviations\.html %}/{% include utility\/expand-abbreviations.html %}/g' "$file"
    sed -i '' 's/{% include full-category\.html %}/{% include utility\/full-category.html %}/g' "$file"
    sed -i '' 's/{% include category-emoji\.html %}/{% include utility\/category-emoji.html %}/g' "$file"
    sed -i '' 's/{% include google-search\.html %}/{% include utility\/google-search.html %}/g' "$file"
    sed -i '' 's/{% include js-toggle-theme\.html %}/{% include utility\/toggle-theme.html %}/g' "$file"
    
    # Feeds files
    sed -i '' 's/{% include feeds\.html %}/{% include feeds\/feeds.html %}/g' "$file"
    sed -i '' 's/{% include feeds\.jekyll %}/{% include feeds\/feeds.xml %}/g' "$file"
    
    # PWA files
    sed -i '' 's/{% include pwa-header-includes\.html %}/{% include pwa\/pwa-header-includes.html %}/g' "$file"
    
    # Gaming files (including renamed ones)
    sed -i '' 's/{% include MCC-Creatures\.html %}/{% include gaming\/mcc-creatures.html %}/g' "$file"
    sed -i '' 's/{% include creatures\.html %}/{% include gaming\/creatures.html %}/g' "$file"
    sed -i '' 's/{% include gamma-world-error-messages\.html %}/{% include gaming\/gamma-world-error-messages.html %}/g' "$file"
    
    # Personal files (including renamed ones)
    sed -i '' 's/{% include Tschopp-HouseMark-Optimum\.html %}/{% include personal\/tschopp-house-mark.html %}/g' "$file"
    sed -i '' 's/{% include h-card\.html %}/{% include personal\/h-card.html %}/g' "$file"
    sed -i '' 's/{% include resume\.html %}/{% include personal\/resume.html %}/g' "$file"
    sed -i '' 's/{% include html-contact-us-icons\.html %}/{% include personal\/contact-icons.html %}/g' "$file"
    sed -i '' 's/{% include html-home-page-social-media-posts\.html %}/{% include personal\/home-social-posts.html %}/g' "$file"
    
    # Template -> Themes directory
    sed -i '' 's/{% include template\//{% include themes\//g' "$file"
}

# Update all layout files
for file in /Users/tedtschopp/Developer/tedt.org/_layouts/*.html; do
    if [ -f "$file" ]; then
        update_includes "$file"
    fi
done

# Update posts that use figure.html and other includes
find /Users/tedtschopp/Developer/tedt.org/_posts -name "*.md" -exec grep -l "{% include" {} \; | while read file; do
    update_includes "$file"
done

# Update any other files that might include these
find /Users/tedtschopp/Developer/tedt.org -name "*.html" -o -name "*.md" | grep -v "_includes" | grep -v "_site" | xargs grep -l "{% include" | while read file; do
    update_includes "$file"
done

echo "Includes refactoring complete!"
