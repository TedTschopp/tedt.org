---
layout: reveal-integrated
title: "Responsible AI Implementation Roadmap" 
markdown: false
permalink: /slides/responsible-ai-implementation-roadmap/
categories: [Slides]
aspect_ratio: 16:9
---
{% comment %}
Wrapper post to surface slide deck in site.posts for legacy queries.
Replacing invalid include_relative path traversal with dynamic collection lookup.
{% endcomment %}
{% assign deck = site.slides | where: "permalink", "/slides/responsible-ai-implementation-roadmap/" | first %}
{% if deck %}
  {{ deck.content }}
{% else %}
  <div class="notice--warning"><p>Slide content unavailable (collection lookup failed).</p></div>
{% endif %}
