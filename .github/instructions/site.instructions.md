---
applyTo: "_layouts/**/*.html"
---

Layout design rules:
- Define page structure using semantic elements (`header`, `main`, `footer`).
- Include `{% include head.html %}` and `{% include footer.html %}` consistently.
- Reference CSS using the `{{ '/assets/css/' | relative_url }}` helper.
- Include analytics snippets only in production builds.

Information architecture preview:
- The six reader-facing hubs use `layout: section` and a `section` key matching `_data/site_navigation.yml` and `_data/site_sections.yml`. Use existing content and permalink destinations.
- Keep the `/About/` article intact; the new About hub is `/about-ted/`.
- Edit shared menu data rather than duplicating labels; standalone assessments include the same data with their native disclosure handler.
- The site-level `preview` setting belongs only in `_config.preview.yml`. Preview builds disable production analytics and the homepage service worker, show a banner, and emit noindex.
- Cutover and production deployment require an explicit user request; build and review remain isolated from main.
