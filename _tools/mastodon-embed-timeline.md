---
title: "Mastodon Timeline Embed"
summary: "Embeddable Mastodon timelines (profile/hashtag/local) using a client-side widget."
subtitle: "Drop-in timeline widget pages"
status: maintained
tool_type: webapp
date: 2023-04-23
last_modified: 2026-01-04
featured: false
tags: [mastodon, social, embed, timeline, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
links:
  live: "/tools/mastodon/"
  repo: null
  docs: null
  download: null
image: "/img/2026-02/mastodon-embed-timeline.webp"
hero_image: "/img/2026-02/mastodon-embed-timeline.webp"
screenshots:
  - "/img/2026-02/mastodon-embed-timeline.webp"
features:
  - "Profile / hashtag / local timeline modes"
  - "Light/dark theme (auto via prefers-color-scheme)"
  - "Pure client-side embed (fetches from Mastodon API)"
license: "AGPL-3.0-only"
---

## What it does

This is a small collection of **static embed pages** that render a Mastodon timeline inside a container using the `MastodonTimeline` JavaScript widget.

It’s useful when you want an embeddable feed UI (e.g., profile posts) without running a server.

## How to use it

- Open: {% link tools/mastodon/index.html %}

There are multiple entry pages under `/tools/mastodon/` for different feed types:

- Profile timeline: {% link tools/mastodon/profile.html %}
- Hashtag timeline: {% link tools/mastodon/hashtag.html %}
- Local timeline: {% link tools/mastodon/local.html %}

To point the embed at a different instance / account / hashtag, edit the page’s inline initialization block (it passes settings like `instanceUrl`, `timelineType`, and `userId`).

## Notes

- The widget fetches public data via the instance’s API endpoints.
- Because this is client-side, the browser is the one making requests to the Mastodon instance.
