---
layout: page
title: "Presentations"
permalink: /slides/
description: "All slide decks and presentations from Ted Tschopp."
---

# 🎞 Presentations

Explore interactive, PowerPoint-style slide decks built with Reveal.js and integrated with the tedt.org theme.

<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">

{% assign slides = site.pages | where_exp: "page", "page.path contains 'slides/'" %}
{% for slide in slides %}
  {% if slide.url != '/slides/' and (slide.layout contains 'reveal' or slide.layout contains 'reveal-integrate') %}
  <div class="col">
    <div class="card h-100 shadow-sm border-0">
      <div class="ratio ratio-16x9">
        <img src="{{ slide.image | default: '/img/categories/prompt_library.webp' }}" 
             class="card-img-top object-fit-cover" 
             alt="{{ slide.title | escape }}">
      </div>
      <div class="card-body">
        <h5 class="card-title"><a href="{{ slide.url | relative_url }}">{{ slide.title }}</a></h5>
        {% if slide.description %}
          <p class="card-text text-muted small">{{ slide.description }}</p>
        {% else %}
          <p class="card-text text-muted small">View interactive slides →</p>
        {% endif %}
      </div>
    </div>
  </div>
  {% endif %}
{% endfor %}

</div>
