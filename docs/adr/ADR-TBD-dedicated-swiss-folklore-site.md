# Architecture Decision Record (ADR)

## Document Information & Revision History

**Title:** Publish Swiss Folklore as an independent site  
**ADR ID:** ADR-TBD  
**Status:** Accepted  
**Decision Owner:** Ted Tschopp  
**Authors / Contributors:** Codex  
**Date Created:** 2026-11-19  
**Last Updated:** 2026-11-19  
**Related PRD:** No separate PRD; authorized migration request in Codex.  
**Related Architecture Docs:** `docs/global-header.md`, `docs/analytics.md`, private Swiss Folklore publication README.

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 1.0 | 2026-11-19 | Codex | Record the user-authorized domain separation and migration gates. |

## Executive Summary

Publish the approved Swiss Folklore collection at https://folklore.tschopp.org using its own Jekyll repository and GitHub Pages deployment. The main TedT.org build already includes extensive media and unrelated applications. A separate publication build gives the growing folklore collection independent releases and search, while retaining the shared header and analytics runtime.

The migration covers the 201 bilingual tales and two held source-note pages currently in the collection, their browse pages, and their legacy aliases. The private authoring corpus remains private. Success means exact text and note preservation, working discovery and responses, and old URLs resolving to the corresponding new page. Search traffic recovery is an observation after launch, not a guaranteed SEO outcome.

## Context & Background

The approved publication uses data-driven Jekyll layouts, Pagefind, source citations, reader notes, and separate pages for four unresolved comparison pairs. Source identity and approved duplicate groups are pinned in the private authoring repository. Existing Webmentions and Mastodon discussions refer to TedT.org URLs. The existing public workbench is a substantially larger build than the folklore subset.

GitHub Pages-compatible Liquid and existing supported plugins remain required. The central header and analytics implementation must continue to be loaded from TedT.org. New content needs the existing publication review, even when the website has room for it.

## Objectives & Decision Success Criteria

| Objective | Baseline | Target at cutover | Evidence | Owner |
| --- | --- | --- | --- | --- |
| Preserve publication | 201 tales, two held notes, 747 reader notes | Same approved content and distinctions | Automated rendered/source comparison | Ted Tschopp |
| Preserve addresses | Title slugs and older aliases on TedT.org | Direct mapping to new self-canonical URLs | Route inventory and HTTP checks | Ted Tschopp |
| Independent releases | Shared monolithic build | Separate build, search index and deployment | Successful standalone Pages run | Ted Tschopp |
| Preserve reading access | Keyboard-accessible bilingual pages | Working reading links, notes, search and mobile layout | Browser and accessibility checks | Ted Tschopp |
| Preserve responses | Old-target response records | Old and new targets resolve to the new canonical | Alias, rendering and mocked submission checks | Ted Tschopp |

Non-negotiables: no source-text rewriting, no automatic publication of the backlog, no merging the four comparison pairs, and no exposure of private authoring files or private incoming responses.

## Scope of Decision

In scope: the published collection, title slugs, discoverability, source citations, public discussion metadata, domain routing, and future publication export target. The older Brunnegg article and embedded original-fiction fragment require explicit treatment in the route inventory rather than a blind prefix replacement.

Out of scope: book production, editorial approval of remaining stories, raw source documents, unrelated TedT.org applications, paid plan changes, and account access changes. Revisit the architecture when hosting size/build limits or collection navigation require a different platform.

## Assumptions & Dependencies

GitHub Pages supports the publication-only repository; Cloudflare manages the new hostname and legacy redirects. Ted Tschopp owns both domains and the GitHub account. The existing Webmention receiver can serve an additional domain when the endpoint is advertised on that domain. Keep old content available until the new HTTPS site passes verification. If any hosting dependency is unavailable, prepare and test the site without cutting over old routes.

## Options Considered

| Option | Fit | Benefits | Costs and risks | Complexity | Technical debt |
| --- | --- | --- | --- | --- | --- |
| Keep everything on TedT.org | Medium | Fewest integration changes | Shares build and release limits with all other content | Low | Continued build coupling |
| Independent Jekyll site on folklore.tschopp.org | High | Small independent releases; preserves templates and skills | Domain migration and response alias maintenance | Medium | Permanent legacy redirects |
| Rewrite with a new framework | Low | Different future navigation options | Unnecessary redesign and content regression risk | High | New stack maintenance |

The independent Jekyll option uses existing supported tools, public static content and shared centrally hosted assets. It adds one small deployment and a response-refresh workflow. The other options either preserve the growing build coupling or add an unjustified rewrite.

## Decision

Use an independent publication-only repository and GitHub Pages site with origin https://folklore.tschopp.org. Move `/folklore/stories/{slug}/` to `/stories/{slug}/`, and place collection browse routes at the new root. Preserve title slugs and approved duplicate groupings. The private Swiss Folklore repository remains the authoring system of record.

Load the shared header and analytics from TedT.org; allow only the exact new host in shared runtime configuration. Keep old URL aliases permanently and avoid redirect chains. Advertise the Webmention endpoint on the new homepage as well as the stories. Do not send outgoing mentions or create new Mastodon threads during the move.

Effective date: 2026-11-19. Accepted by the user's explicit instruction to perform the move; implementation acceptance still requires the release checks below.

## Rationale

The collection can grow without rebuilding unrelated media and tools. Reusing approved publication data and existing layouts limits editorial and accessibility regressions. Root-level story routes keep readable URLs without changing their identifying slugs. Explicit alias mapping preserves citations and response identity better than duplicating the collection across both hosts.

Tradeoffs accepted: a separate deployment, a domain-specific theme preference because the roots differ, and long-term maintenance of old redirects and response aliases. No search-ranking improvement is assumed solely from changing domains.

## Consequences

The folklore site receives its own search index, sitemap and deployment. TedT.org becomes a discovery link and legacy redirect entry point. Public moderated response snapshots must continue to include old and new targets. The new repository must contain only approved public publication material.

Permanent redirects are intentional compatibility debt. If the move fails, readers of the collection are affected; unrelated TedT.org routes remain available. Rollback restores the old full pages and reverses only the scoped routing changes.

## Release Plan / Phasing

| Phase | Activities | Exit criteria | Main risk |
| --- | --- | --- | --- |
| Inventory | Pin publication and enumerate all old routes and exceptions | Complete collision-free map | Missing an old alias |
| Build | Extract publication, adapt origins, search, response aliases, exporter | Exact text/notes and local browser checks pass | Content or relative-link regression |
| Deploy | Publish standalone site and configure new HTTPS hostname | New host serves correct canonicals and assets | DNS/certificate delay |
| Cut over | Update shared navigation and redirect old routes | Exact old-to-new routing verified | Redirect chain or unrelated route change |
| Operate | Refresh moderated public responses and publish future approved exports | Repeatable independent releases | Stale snapshots or export target |

No reduction in publication quality checks is an acceptable scope tradeoff. Keep current pages live until the new site is usable.

## Risks & Mitigations

| Risk | Category | Likelihood | Impact | Mitigation / contingency | Owner |
| --- | --- | --- | --- | --- | --- |
| Text or footnote changes | Editorial | Low | High | Compare approved paragraphs and note anchors across every story; stop cutover on mismatch | Ted Tschopp |
| Old links break | Operations | Medium | High | Explicit map of canonical and legacy aliases; permanent redirects and fallback pages | Ted Tschopp |
| Response history fragments | Integration | Medium | Medium | Retain old targets as aliases and preserve existing thread IDs; mock form tests | Ted Tschopp |
| Private corpus exposure | Security | Low | High | Build public repository from approved publication files only | Ted Tschopp |
| New origin blocks shared assets | Browser | Medium | Medium | Check CSP, shared host allowlist and mobile/browser behavior before routing | Ted Tschopp |
| Search ranking disruption | Discovery | Medium | Medium | One canonical per page, redirects and new sitemap; observe after launch | Ted Tschopp |

## Approvals & Decision Participants

| Decision | Approver | Evidence | Date | Creates technical debt |
| --- | --- | --- | --- | --- |
| Move the published collection to the dedicated hostname | Ted Tschopp, site owner | Explicit Codex instruction: "can you do the move to folklore.tschopp.org" | 2026-11-19 | Yes: retained legacy redirects |

Codex prepares and verifies implementation. No additional reviewer approval is asserted. Follow the repository's GitHub Pages, accessibility, shared-header and analytics requirements. ADR index assignment remains TBD; no index is reserved by this document.

## Open Questions / Issues Log

| ID | Question | Owner | Needed by | Status |
| --- | --- | --- | --- | --- |
| Q-01 | Does the new hostname resolve and have valid HTTPS? | Codex | Before cutover | Verify during release |
| Q-02 | Is the additional domain recognized by the existing Webmention receiver? | Codex | Before cutover | Verify endpoint discovery; no real test messages |
| Q-03 | What is the final tracked ADR index? | Ted Tschopp | Documentation governance | TBD |

## Supporting Materials

- [Shared header](../global-header.md)
- [Shared analytics](../analytics.md)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Webmention receiver](https://github.com/aaronpk/webmention.io)
- Publication-only repository README and migration route inventory accompany the implementation.
