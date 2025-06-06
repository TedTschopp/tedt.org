# Fix Feed URL Concatenation Bugs

**Priority:** High
**Type:** Bug
**Status:** Open

## Problem

The feeds.html include file contains malformed URL concatenation that results in broken feed URLs:

1. **Incorrect URL concatenation** producing URLs like `tedt.orgatom.xml` instead of `tedt.org/atom.xml`
2. **Missing proper path separators** in URL construction
3. **Broken feed discovery** for RSS readers and feed aggregators
4. **SEO impact** from malformed canonical feed URLs
5. **Potential for other URL concatenation issues** throughout the site

**Specific Issues Found:**
- Feed URLs are concatenated without proper path separators
- Results in malformed URLs that don't resolve correctly
- Affects both Atom and RSS feed discoverability
- May impact search engine feed discovery

## Proposed Solution

1. **Fix URL concatenation logic** in feeds.html include
2. **Add proper path separator handling** for all feed URLs
3. **Implement URL validation** to catch similar issues
4. **Test all generated feed URLs** for correctness
5. **Add safeguards** to prevent future URL concatenation errors
6. **Document proper URL construction patterns** for maintainers

## Benefits

- **Working feed URLs**: RSS readers can properly discover and subscribe to feeds
- **Improved SEO**: Search engines can properly index feed URLs
- **Better user experience**: Feed subscription works correctly
- **Prevented errors**: Safeguards catch future URL concatenation issues
- **Standards compliance**: Feed URLs follow proper URL formatting standards

## Implementation Plan

### Phase 1: Identify and Document URL Issues
- [ ] Audit feeds.html for all URL concatenation
- [ ] Test current feed URLs for accessibility
- [ ] Document expected vs actual URL output
- [ ] Search for similar URL concatenation patterns in other includes

### Phase 2: Fix Feed URL Generation
- [ ] Update feeds.html with proper URL concatenation
- [ ] Add proper path separator handling
- [ ] Implement URL validation logic
- [ ] Test feed URL generation with different base URL configurations

### Phase 3: Comprehensive URL Audit
- [ ] Search entire codebase for similar URL concatenation patterns
- [ ] Fix any other malformed URL construction found
- [ ] Add URL construction helpers if needed
- [ ] Update documentation with proper URL construction patterns

### Phase 4: Testing and Validation
- [ ] Test all feed URLs in multiple RSS readers
- [ ] Validate feed XML with online validators
- [ ] Test with different base URL configurations
- [ ] Verify search engine feed discovery works correctly

## Files to Modify

- `_includes/feeds.html` (fix URL concatenation logic)
- Any other includes with similar URL construction issues
- `_config.yml` (if base URL configuration needs adjustment)

## Files to Create

- `docs/url-construction-guidelines.md` (development guidelines)
- Test script for validating feed URLs (optional)

## Dependencies

- **Base URL configuration**: Ensure `_config.yml` has correct base URL setup
- **Site URL structure**: Verify site URL configuration is correct
- **Include dependencies**: Other includes that might reference feeds

## Technical Details

**Current Issue Example:**
```liquid
{{ site.url }}{{ site.atom_feed_path }}
```
Results in: `tedt.orgatom.xml`

**Correct Implementation:**
```liquid
{{ site.url }}/{{ site.atom_feed_path }}
```
Results in: `tedt.org/atom.xml`

## Testing Checklist

- [ ] Atom feed URL resolves correctly: `{site.url}/atom.xml`
- [ ] RSS feed URL resolves correctly: `{site.url}/rss.xml`
- [ ] Feed URLs work in RSS readers (Feedly, NewsBlur, etc.)
- [ ] Feed XML validates with W3C Feed Validator
- [ ] Feed discovery meta tags point to correct URLs
- [ ] No broken feed links in HTML source
- [ ] Feed URLs work with both www and non-www versions of site
- [ ] Feed subscription works correctly in major RSS readers
