# ADR 0004: Prompt Library Jekyll Integration

Status: Proposed  
Date: 2025-08-05  
Authors: Ted Tschopp, GitHub Copilot  
Supersedes: ADR 0001 (empty placeholder)

## Context

The website currently has:

- A `prompt-library` layout in `_layouts/prompt-library.html` with static example cards
- A prompts index page at `/prompts/index.html` using this layout
- 26+ prompt posts in `_posts/Prompts/` directory with Jekyll front matter
- Posts use `layout: prompt-details` and have consistent metadata structure

The current prompt library layout displays static example cards instead of dynamically loading the actual prompt posts from the Jekyll collection.

## Decision

We will integrate the prompt library layout with Jekyll's post collection system to:

1. **Replace static cards** with dynamic Jekyll Liquid templating that loads posts from `_posts/Prompts/`
2. **Generate category filters** dynamically based on actual post tags
3. **Maintain existing functionality** for search, filtering, and copy-to-clipboard features
4. **Preserve accessibility** and responsive design patterns already implemented
5. **Use existing post metadata** (title, description, tags, permalink) for card content

## Implementation Details

### Data Source

- Posts in `_posts/Prompts/` directory
- Filter by `categories: [Prompts]` in front matter
- Use `tags` array for category filtering
- Use `description` field for card descriptions, fallback to `excerpt`

### Dynamic Elements

- **Prompt cards**: Generated from Jekyll posts collection
- **Category buttons**: Generated from unique tags across all prompt posts
- **Card links**: Use post `permalink` for navigation
- **Copy functionality**: Copy actual post content, not description

### Backward Compatibility

- Existing `/prompts/index.html` page structure preserved
- All current CSS classes and JavaScript functionality maintained
- Bootstrap responsive grid layout unchanged

## Consequences

### Positive

- **Automated content management**: New prompt posts automatically appear in library
- **Consistent metadata**: Single source of truth for prompt information
- **SEO benefits**: Each prompt gets individual page with proper metadata
- **Maintainability**: No need to manually update library when adding prompts

### Negative

- **Build dependency**: Library content depends on Jekyll build process
- **Performance**: Larger collections may impact build time
- **Complexity**: More Liquid templating logic in layout file

## Alternatives Considered

1. **Manual card management**: Continue with static cards (rejected - not maintainable)
2. **External API integration**: Use headless CMS or API (rejected - adds complexity)
3. **JavaScript-only solution**: Client-side rendering from JSON (rejected - SEO concerns)

## Implementation Plan

1. Update `_layouts/prompt-library.html` with Jekyll Liquid templating
2. Replace static category buttons with dynamic tag-based generation
3. Update JavaScript to work with dynamic content structure
4. Test with existing prompt posts
5. Document usage in README or contribution guidelines
