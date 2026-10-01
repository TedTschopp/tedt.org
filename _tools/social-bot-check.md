---
title: "Social Bot Check"
summary: "Inspect public Bluesky and Mastodon accounts for reply timing, repeated text, posting volume, and other observable patterns, with visible thresholds and linked evidence."
subtitle: "Public account patterns across social sites"
status: active
tool_type: webapp
date: 2026-10-01
last_modified: 2026-10-01
featured: false
tags: [bluesky, mastodon, social, analysis, javascript, tools]
tech:
  - JavaScript
  - HTML
  - CSS
  - Bluesky public API
  - Mastodon public API
links:
  live: "/tools/social-bot-check.html"
  repo: null
  docs: "/tools/social-bot-check/"
  download: null
features:
  - "Bluesky handles, DIDs, profile URLs, and post URLs"
  - "Mastodon account addresses and profile URLs"
  - "Up to 1,000 original posts, with boosts and reposts tracked separately"
  - "Visible thresholds, sample sizes, alternative explanations, and evidence posts"
  - "UTC activity chart with an accessible table of exact counts"
  - "Post search, type filters, and links to original and parent posts"
  - "Cancellable checks, partial-result warnings, and explicit missing-data states"
  - "Shareable account check links and downloadable JSON reports"
  - "Separate provider modules for adding other public social APIs"
  - "No login, account changes, API keys, or server-side report storage"
license: "MIT"
---

## What It Does

Social Bot Check reads public account activity and applies transparent checks for
patterns that can occur in automated posting. It supports **Bluesky** and
**Mastodon**. The report includes the observed values, the threshold for each
check, other possible explanations, and links to posts that match a check.

The report counts eligible behavior checks without assigning a probability that
an account is a bot. Platform metadata is shown separately. Neither activity
patterns nor client formatting can establish AI authorship.

## How to Use It

1. [Open Social Bot Check]({% link tools/social-bot-check.html %}).
2. Choose **Bluesky** or **Mastodon** and enter an account or profile URL.
3. Choose a sample of up to 100, 500, or 1,000 original posts and select **Check account**.
4. Open each signal to read its threshold and evidence. Use **Show matching posts**
   to filter the report to the relevant examples.
5. Open the original posts to review their context. Search or filter the scanned
   activity, copy a link to run the check again, or download the current JSON report.

Examples:

- Bluesky: `tedt.org`, `@name.bsky.social`, a `bsky.app` profile or post URL, or a DID.
- Mastodon: `@Ted@tschopp.net` or `https://tschopp.net/@Ted`.

## Data and Limits

Requests go directly from your browser to the selected public API without account
credentials. This tool does not store reports or request a login.

Private, blocked, deleted, and unavailable posts are outside the sample. Mastodon
servers can restrict public API access or block browser requests. Up to 40 recent
unique Mastodon parent posts are fetched for reply context; missing context is
reported, and edited replies are excluded from timing checks. Activity charts
show UTC because the account’s local time zone is unknown.

Share links contain the account and scan settings. Opening one runs a fresh check;
the JSON download captures the report at the time it was checked.

## Adding Another Site

Each platform has a provider module that parses account addresses and maps its
public API data into a shared profile and post format. New providers register in
`tools/social-bot-check/providers/index.js`. The analysis and report renderer are
shared; unsupported checks must retain an explicit unavailable state.

The checker is inspired by
[Simon Willison’s Bluesky reply bot checker](https://tools.simonwillison.net/bluesky-bot-check).
Its implementation and report wording were written for Ted’s Tools.
