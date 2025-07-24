# Feature Request: Tag-Based Navigation for Prompt Details

## Objective

Enable clickable tag navigation on prompt detail pages using Jekyll's static site generation capabilities to create dedicated tag pages, enhancing user experience and content discoverability using only GitHub Pages compatible features.

### Current State

Currently, in the `prompt-details.html` layout (lines 145-147), tags are displayed as static badges without navigation functionality:

```html
{% for tag in page.tags %}
    <span class="badge bg-primary"><i class="fas fa-tag"></i> {{ tag }}</span>
{% endfor %}
```

### Requirements

* Convert static tag badges into clickable anchor tags that navigate to dedicated tag pages
* Create Jekyll-generated static pages for each tag using liquid templating
* Maintain current visual styling and accessibility features
* Create a URL structure that supports tag-based navigation (e.g., `/prompts/tags/simulation/`)
* Generate tag pages that display filtered prompts using Jekyll's built-in tag functionality
* Ensure proper SEO with individual meta tags for each tag page
* Create individual tag pages manually (or with automation script run locally)
* Create a tag index page listing all available tags
* Solution must work with GitHub Pages standard Jekyll installation

### Proposed Solution

#### Implementation Steps

**1. Update Tag Display in `prompt-details.html`:**

Replace the current static badge implementation with clickable anchor tags:

```html
{% for tag in page.tags %}
    <a href="/prompts/tags/{{ tag | slugify }}/" class="badge bg-primary text-decoration-none">
        <i class="fas fa-tag"></i> {{ tag }}
    </a>
{% endfor %}
```

**2. Create Tag Page Layout (`_layouts/tag-page.html`):**

Create a new layout specifically for tag pages:

```html
---
layout: default
---

<main class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1>Prompts tagged with "{{ page.tag }}"</h1>
            {% assign tag_posts = site.tags[page.tag] | where: "layout", "prompt-details" %}
            <p class="text-muted">{{ tag_posts.size }} prompt(s) found</p>
        </div>
        <a href="/prompts/tags/" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left"></i> All Tags
        </a>
    </div>

    <!-- Breadcrumb Navigation -->
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item"><a href="/prompts/">Prompts</a></li>
            <li class="breadcrumb-item"><a href="/prompts/tags/">Tags</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ page.tag }}</li>
        </ol>
    </nav>

    <!-- Related Tags -->
    {% assign related_tags = "" | split: "" %}
    {% for post in site.tags[page.tag] %}
        {% for tag in post.tags %}
            {% unless tag == page.tag %}
                {% assign related_tags = related_tags | push: tag %}
            {% endunless %}
        {% endfor %}
    {% endfor %}
    {% assign unique_related_tags = related_tags | uniq | sort %}
    
    {% if unique_related_tags.size > 0 %}
    <div class="mb-4">
        <h6>Related Tags:</h6>
        {% for related_tag in unique_related_tags %}
            <a href="/prompts/tags/{{ related_tag | slugify }}/" class="badge bg-secondary text-decoration-none me-1 mb-1">
                {{ related_tag }}
            </a>
        {% endfor %}
    </div>
    {% endif %}

    <!-- Prompt Cards -->
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {% for post in site.tags[page.tag] %}
            {% if post.layout == 'prompt-details' %}
                <div class="col">
                    {% include prompt-card.html prompt=post %}
                </div>
            {% endif %}
        {% endfor %}
    </div>

    <!-- Empty State -->
    {% if tag_posts.size == 0 %}
        <div class="text-center py-5">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h3>No prompts found</h3>
            <p class="text-muted">There are no prompts with the tag "{{ page.tag }}" yet.</p>
            <a href="/prompts/" class="btn btn-primary">Browse All Prompts</a>
        </div>
    {% endif %}
</main>
```

**3. Create Tag Index Page (`prompts/tags/index.html`):**

Create an index page listing all available tags:

```html
---
layout: default
title: "Browse Prompts by Tag"
description: "Explore AI prompts organized by tags and categories"
permalink: /prompts/tags/
---

<main class="container my-4">
    <div class="mb-4">
        <h1>Browse Prompts by Tag</h1>
        <p class="lead">Explore our collection of AI prompts organized by tags and themes.</p>
    </div>

    <!-- Breadcrumb Navigation -->
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item"><a href="/prompts/">Prompts</a></li>
            <li class="breadcrumb-item active" aria-current="page">Tags</li>
        </ol>
    </nav>

    <!-- Tag Cloud -->
    <div class="row">
        <div class="col-12">
            <h2>All Tags</h2>
            {% assign sorted_tags = site.tags | sort %}
            {% for tag in sorted_tags %}
                {% assign tag_name = tag[0] %}
                {% assign tag_posts = tag[1] | where: "layout", "prompt-details" %}
                {% if tag_posts.size > 0 %}
                    <a href="/prompts/tags/{{ tag_name | slugify }}/" 
                       class="badge bg-primary text-decoration-none me-2 mb-2 fs-6"
                       style="font-size: {{ tag_posts.size | times: 0.1 | plus: 1.0 }}rem !important;">
                        {{ tag_name }} <span class="badge bg-light text-dark ms-1">{{ tag_posts.size }}</span>
                    </a>
                {% endif %}
            {% endfor %}
        </div>
    </div>

    <!-- Tag Statistics -->
    <div class="row mt-5">
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    {% assign prompt_tags = site.tags | where_exp: "tag", "tag[1] contains site.posts" %}
                    {% assign unique_prompt_tags = 0 %}
                    {% for tag in site.tags %}
                        {% assign tag_posts = tag[1] | where: "layout", "prompt-details" %}
                        {% if tag_posts.size > 0 %}
                            {% assign unique_prompt_tags = unique_prompt_tags | plus: 1 %}
                        {% endif %}
                    {% endfor %}
                    <h3 class="card-title">{{ unique_prompt_tags }}</h3>
                    <p class="card-text text-muted">Total Tags</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    {% assign prompt_posts = site.posts | where: "layout", "prompt-details" %}
                    <h3 class="card-title">{{ prompt_posts.size }}</h3>
                    <p class="card-text text-muted">Total Prompts</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    {% assign most_used_tag = "" %}
                    {% assign max_count = 0 %}
                    {% for tag in site.tags %}
                        {% assign tag_posts = tag[1] | where: "layout", "prompt-details" %}
                        {% if tag_posts.size > max_count %}
                            {% assign max_count = tag_posts.size %}
                            {% assign most_used_tag = tag[0] %}
                        {% endif %}
                    {% endfor %}
                    <h3 class="card-title">{{ most_used_tag }}</h3>
                    <p class="card-text text-muted">Most Popular Tag</p>
                </div>
            </div>
        </div>
    </div>
</main>
```

**4. Create Individual Tag Pages (Manual Creation):**

For each unique tag, create a page at `prompts/tags/[tag-name]/index.html`. Based on the example prompt, you would create:

**Example: `prompts/tags/simulation/index.html`:**

```html
---
layout: tag-page
tag: "Simulation"
title: "Prompts tagged with 'Simulation'"
description: "Browse all prompts tagged with 'Simulation' - curated AI prompts and templates."
permalink: /prompts/tags/simulation/
---
```

**Example: `prompts/tags/roleplay/index.html`:**

```html
---
layout: tag-page
tag: "Roleplay"
title: "Prompts tagged with 'Roleplay'"
description: "Browse all prompts tagged with 'Roleplay' - curated AI prompts and templates."
permalink: /prompts/tags/roleplay/
---
```

**Example: `prompts/tags/instructional-design/index.html`:**

```html
---
layout: tag-page
tag: "Instructional Design"
title: "Prompts tagged with 'Instructional Design'"
description: "Browse all prompts tagged with 'Instructional Design' - curated AI prompts and templates."
permalink: /prompts/tags/instructional-design/
---
```

Continue this pattern for each unique tag found in your prompt posts.

**5. Create Prompt Card Include (`_includes/prompt-card.html`):**

Create a reusable prompt card component:

```html
<div class="card h-100">
    <div class="card-body d-flex flex-column">
        <h5 class="card-title">
            <a href="{{ include.prompt.url }}" class="text-decoration-none">
                {{ include.prompt.title }}
            </a>
        </h5>
        <p class="card-text flex-grow-1">{{ include.prompt.description | truncate: 120 }}</p>
        <div class="mt-auto">
            <div class="mb-2">
                {% for tag in include.prompt.tags limit: 3 %}
                    <a href="/prompts/tags/{{ tag | slugify }}/" class="badge bg-secondary text-decoration-none me-1">
                        {{ tag }}
                    </a>
                {% endfor %}
                {% if include.prompt.tags.size > 3 %}
                    <span class="badge bg-light text-dark">+{{ include.prompt.tags.size | minus: 3 }}</span>
                {% endif %}
            </div>
            <small class="text-muted">
                <i class="fas fa-calendar"></i> {{ include.prompt.date | date: "%B %d, %Y" }}
            </small>
        </div>
    </div>
</div>
```

**6. Update Configuration (`_config.yml`):**

Add basic configuration (no plugins required):

```yaml
# Basic Jekyll configuration
plugins:
  - jekyll-sitemap
  - jekyll-feed
  - jekyll-seo-tag

# No custom plugins needed for GitHub Pages compatibility
```

**7. Create a Script to Generate Tag Pages (Optional):**

Create a simple script `scripts/generate-tag-pages.rb` to automate tag page creation:

```ruby
#!/usr/bin/env ruby

require 'yaml'
require 'fileutils'

# Read all posts and collect unique tags
tags = Set.new
Dir.glob('_posts/**/*.md').each do |file|
  content = File.read(file)
  if content =~ /^---\s*\n(.*?)\n---\s*\n/m
    frontmatter = YAML.load($1)
    if frontmatter['tags']
      frontmatter['tags'].each { |tag| tags.add(tag) }
    end
  end
end

# Create tag pages
tags.each do |tag|
  tag_slug = tag.downcase.gsub(/\s+/, '-')
  dir = "prompts/tags/#{tag_slug}"
  FileUtils.mkdir_p(dir)
  
  File.open("#{dir}/index.html", 'w') do |f|
    f.write <<~EOF
      ---
      layout: tag-page
      tag: "#{tag}"
      title: "Prompts tagged with '#{tag}'"
      description: "Browse all prompts tagged with '#{tag}' - curated AI prompts and templates."
      permalink: /prompts/tags/#{tag_slug}/
      ---
    EOF
  end
end

puts "Generated #{tags.size} tag pages"
```

### Technical Considerations

**No Plugin Dependency:** This approach works with GitHub Pages' standard Jekyll installation without requiring custom plugins.

**Two Implementation Options:**

1. **Manual Tag Pages:** Create individual pages for each tag (better SEO, more maintenance)
2. **Dynamic Filtering:** Use a single page with JavaScript filtering (easier maintenance, still SEO-friendly with URL parameters)

**SEO Optimization:** Each approach provides proper meta tags and semantic HTML for search engine indexing.

**Performance:** Static pages load faster than plugin-generated content and work without JavaScript enabled.

**Maintenance:** The script approach can automate tag page creation, or they can be created manually as needed.

**URL Structure:** Clean, SEO-friendly URLs following the pattern `/prompts/tags/tag-name/` or `/prompts/tags/?tag=tag-name`.

**GitHub Pages Compatible:** Uses only standard Jekyll features available on GitHub Pages.

### User Experience Benefits

* **Improved Navigation:** Users can quickly find related prompts by clicking on relevant tags
* **Content Discovery:** Easier exploration of prompts within specific categories or themes  
* **Better SEO:** Individual tag pages can be indexed by search engines, improving discoverability
* **Fast Loading:** Static pages load faster than JavaScript-filtered content
* **Accessibility:** Works without JavaScript and provides proper semantic navigation
* **Shareable URLs:** Users can bookmark and share specific tag pages
* **Tag Relationships:** Related tags are shown on each tag page for further exploration

### Alternatives Considered

* **JavaScript-Based Filtering:** Client-side filtering (rejected due to SEO and accessibility concerns)
* **Collection-Based Approach:** Using Jekyll collections instead of posts (could be implemented alongside)
* **Category vs. Tags:** Using Jekyll categories instead of tags (tags are more flexible for multiple associations)

## Success Criteria

* [ ] Tag badges in prompt details are clickable and navigate to tag-filtered views
* [ ] Tag filtering works using either individual static pages or dynamic JavaScript filtering
* [ ] Tag pages display only prompts with the selected tag using Jekyll liquid templating
* [ ] Tag index page lists all available tags with post counts
* [ ] URL structure follows the pattern `/prompts/tags/tag-name/` or `/prompts/tags/?tag=tag-name`
* [ ] Navigation maintains accessibility standards (WCAG 2.1 AA)
* [ ] Visual styling remains consistent with current design system
* [ ] No breaking changes to existing prompt library functionality
* [ ] Mobile responsiveness is maintained across all screen sizes
* [ ] Proper SEO meta tags are generated for each tag page
* [ ] Related tags are displayed on individual tag pages
* [ ] Empty state is handled gracefully when no prompts exist for a tag
* [ ] Solution works on GitHub Pages without custom plugins

### Related Files

* `/Users/tedtschopp/Developer/tedt.org/_layouts/prompt-details.html` (lines 145-147)
* `/Users/tedtschopp/Developer/tedt.org/_layouts/prompt-library.html` (reference for styling)
* `/Users/tedtschopp/Developer/tedt.org/_posts/Prompts/` (various prompt markdown files)
* `_layouts/tag-page.html` (new file to create - for manual approach)
* `_includes/prompt-card.html` (new file to create)
* `prompts/tags/index.html` (new file to create)
* `prompts/tags/[tag-name]/index.html` (individual tag pages - for manual approach)
* `scripts/generate-tag-pages.rb` (optional automation script)
* `_config.yml` (minimal configuration updates)

### Additional Context

This enhancement leverages Jekyll's native capabilities to create a robust tag-based navigation system without requiring custom plugins, making it fully compatible with GitHub Pages. The solution provides two approaches: individual static tag pages for better SEO, or a dynamic JavaScript-based approach for easier maintenance.

The implementation uses Jekyll's built-in tag functionality and liquid templating to create tag-filtered views. For sites with many tags, the JavaScript approach provides a single-page solution that still maintains SEO benefits through URL parameters and proper meta tags.

Both approaches ensure that the tag navigation system works seamlessly with the existing Jekyll/Bootstrap-based architecture and maintains consistency with the current design system. The solution is particularly well-suited for GitHub Pages deployment since it uses only standard Jekyll features.
