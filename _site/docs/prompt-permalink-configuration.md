# Prompt Permalink Configuration

## Overview
This document describes the permalink configuration for prompt detail pages.

## Configuration
Added to `_config.yml`:

```yaml
# Defaults for different types of posts
defaults:
  - scope:
      path: "_posts/Prompts"
      type: "posts"
    values:
      permalink: "/prompts/:slug/"
```

## URL Structure
All prompt posts located in `_posts/Prompts/` will now use the following URL pattern:

- **Old pattern**: `/:title/` (e.g., `/simple-blog-generator/`)
- **New pattern**: `/prompts/:slug/` (e.g., `/prompts/simple-blog-generator/`)

## Examples
| Filename | Slug | Generated URL |
|----------|------|---------------|
| `2025-01-31-simple-blog-generator.md` | `simple-blog-generator` | `/prompts/simple-blog-generator/` |
| `2025-05-03-AI-Simulation-Creator-Prompt.md` | `ai-simulation-creator-prompt` | `/prompts/ai-simulation-creator-prompt/` |
| `2025-08-01-Critique-Content.md` | `critique-content` | `/prompts/critique-content/` |

## Automatic Updates
The following components automatically use the new URL structure:

1. **Prompt Library Layout** (`_layouts/prompt-library.html`)
   - Card links use `{{ post.url | relative_url }}`
   - Copy prompt button uses `data-prompt-url="{{ post.url | relative_url }}"`

2. **Tag Links** (`_layouts/prompt-details.html`)
   - Tag filter links already point to `/tools/prompt-library.html?filter=tag`
   - No changes needed for cross-linking between prompts

## Benefits
- **SEO Friendly**: Clear URL structure indicates content type
- **Organization**: All prompts grouped under `/prompts/` namespace
- **Consistency**: Follows REST-like URL conventions
- **Maintainable**: No individual file modifications required

## Testing
To verify the configuration:

1. Start Jekyll server: `bundle exec jekyll serve`
2. Visit `/tools/prompt-library.html`
3. Click any prompt card to verify URL structure
4. Confirm URLs follow `/prompts/[slug]/` pattern

## Notes
- The `:slug` variable automatically converts filenames to URL-friendly format
- Date prefixes in filenames are automatically removed from URLs
- Spaces and special characters are converted to hyphens
- All letters are converted to lowercase
