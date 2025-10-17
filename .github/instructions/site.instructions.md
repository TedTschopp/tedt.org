---
applyTo: "_layouts/**/*.html"
---

Layout design rules:
- Define page structure using semantic elements (`header`, `main`, `footer`).
- Include `{% include head.html %}` and `{% include footer.html %}` consistently.
- Reference CSS using the `{{ '/assets/css/' | relative_url }}` helper.
- Include analytics snippets only in production builds.
