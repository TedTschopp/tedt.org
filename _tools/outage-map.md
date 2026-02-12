---
title: "Outage Map"
summary: "Location-based outage status prototype with map + notifications."
subtitle: "Geolocation + outage status demo"
status: prototype
tool_type: webapp
date: 2026-02-12
last_modified: 2026-02-12
featured: false
tags: [maps, geolocation, notifications, javascript, tools]
tech:
  - JavaScript
  - HTML
  - Leaflet
links:
  live: "https://tedtschopp.github.io/Outage-Map/"
  repo: null
  docs: null
  download: null
image: "/img/2026-02/outage-map.webp"
hero_image: "/img/2026-02/outage-map.webp"
screenshots:
  - "/img/2026-02/outage-map.webp"
features:
  - "Geolocation with a graceful fallback location"
  - "Map view with OpenStreetMap tiles"
  - "Mock outage status logic for UI prototyping"
  - "Optional notifications (where supported)"
license: null
---

## What it does

Outage Map is a small prototype that requests your location, shows it on a map,
and displays an “outage status” panel.

This version is intentionally lightweight: it’s designed to validate the
**UI and interaction model** (map + status + notifications) without requiring a
backend.

## How to use it

- Open: [Outage Map](https://tedtschopp.github.io/Outage-Map/)
- Allow location access (or let it fall back to a default location)
- Use the status panel and (optionally) enable notifications

## Notes

- The outage lookup is a prototype/mock implementation.
