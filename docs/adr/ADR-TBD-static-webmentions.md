# Architecture Decision Record (ADR)

## Document Information & Revision History

**Title:** Render moderated Webmentions during the static build  
**ADR ID:** ADR-TBD  
**Status:** Accepted  
**Decision Owner:** Ted Tschopp, site owner  
**Author(s):** Codex  
**Date Created:** 2026-10-25  
**Last Updated:** 2026-10-25  
**Related PRD:** IndieWeb restoration plan approved in this chat  
**Related Architecture Docs:** AGENTS.md; README.md; docs/indieweb.md

| Version | Date | Author | Summary |
| --- | --- | --- | --- |
| 1.0 | 2026-10-25 | Codex | Record the authorized Phase 1 architecture; live qualification remains separate. |

## Executive Summary

**Decision Statement:** Keep webmention.io as the receiver. Synchronize approved public records into a canonical-URL-indexed cache and render it through Liquid. Send outgoing notifications from CI after deployment.

**Problem / Opportunity:** The previous JavaScript renderer omitted historical aliases, depended on live API availability, and merged replies into reactions. All audited forms submitted relative targets.

**Affected Scope:** Public article layouts, identity markup, synchronization, moderation, and outgoing delivery. Publishing, media hosting, and federation routing belong to later phases.

**Options Considered:** A live browser renderer; a moderated static cache; a self-hosted receiver.

**Chosen Option & Rationale:** A moderated static cache provides readable responses without JavaScript, explicit moderation, and a recoverable record without new runtime subscriptions.

| Leading indicator | Baseline | Target | Window | Source | Owner |
| --- | --- | --- | --- | --- | --- |
| Relative article form targets | 1,043 audited forms | 0 | First deployment | Rendering gate | Site owner |

| Outcome | Baseline | Target | Timeframe | Source | Owner |
| --- | --- | --- | --- | --- | --- |
| Responses readable offline from provider | No | Yes | First deployment | Browser test with API blocked | Site owner |

**Key Risks / Tradeoffs:** Synchronization adds publication delay; hourly refresh and retained cache bound its impact. Third-party verification remains a dependency.

**Status / Next Steps:** Accepted by the site owner's implementation request. Build, hosted CI, and live protocol tests must supply separate evidence.

## Context & Background

- Jekyll and GitHub Pages publish the site. Unsupported plugins are prohibited.
- The 2026-10-24 audit found 16 public mentions, including eight attached to www aliases.
- The receiver verifies sources; the site decides which verified public records it displays.
- Dependencies are webmention.io, GitHub Actions, and the existing Ruby/Nokogiri toolchain.

## Objectives & Decision Success Criteria

1. Keep article URLs stable and recover mentions attached to known aliases.
2. Display only approved public content, escaped as text.
3. Deliver changed articles after the corresponding public build is available.

| Objective | Evidence | Baseline | Target | Timeframe | Source | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Article interoperability | Canonical URL, author, content, dates, endpoint | Partial | All current article layouts | First deployment | Render gate | Site owner |

**Non-Negotiables:** No new paid services; no private records or tokens in Git; no bulk historical outgoing notifications at activation.

## Scope of Decision

**In Scope:** Static responses, alias matching, moderation policy, metadata, and a persistent sender ledger.

**Out of Scope:** Micropub, Microsub, new media storage, identity-provider migration, and federation account changes.

**Anti-Goals:** A new receiver service or a new Jekyll collection.

**Revisit Triggers:** An unavailable receiver, unacceptable refresh delay, or scale beyond reasonable CI/API usage.

## Assumptions & Dependencies

- Public per-target API queries remain available. An optional account token can reduce API requests; private records are filtered before persistence.
- A complete refresh is required before replacing the cache. Failed or incomplete refreshes preserve the previous file.
- Scheduling and automatic deployment require the workflows to be merged into the default branch.
- Account reconnection may require the owner's interactive authorization.

## Options Considered

| Option | Fit | Pros | Cons | Complexity | Debt |
| --- | --- | --- | --- | --- | --- |
| Live browser API | Medium | Immediate updates | Availability, moderation, no-script gaps | Low | Yes |
| Moderated static cache | High | Accessible, recoverable, explicit policy | Refresh delay and CI work | Medium | No |
| Self-hosted receiver | Low | Full operational control | More service and abuse-handling maintenance | High | Yes |

### Option 1 — Live browser API

The browser fetches provider records on every visit. Support and moderation remain coupled to that renderer. Untrusted response handling and network failures affect readers directly. No hosting charge, but the observed behavior needs replacement.

### Option 2 — Moderated static cache

CI retrieves a complete snapshot, applies the policy, then writes approved text records atomically. Liquid reads an indexed group for the article. The runbook documents refresh, approval, blocking, failed delivery, and rollback. There is no new application server.

### Option 3 — Self-hosted receiver

A new public service would own verification, parsing, moderation, storage, and abuse handling. It adds operational responsibility beyond the chosen first phase.

## Decision

**Chosen Option:** Moderated static cache with hosted receiving and CI delivery.

**Architectural Guardrails:** Exact known alias mappings; no heuristic path lowercasing; text-only cached content; validated HTTP links; DNS-checked, address-pinned requests; independent receiving and sending state; delivery receipts on a dedicated Git branch so they cannot interrupt deployment checks; no public rendering of pending/private payloads.

**Effective Date:** 2026-10-25  
**Status:** Accepted

## Rationale

The approved plan prioritizes Webmentions, preservation of current URLs, trusted-source moderation, and existing/free infrastructure. Standalone scripts and Liquid meet those constraints without expanding the Jekyll plugin surface.

**Evidence / Inputs:** Full sitemap audit and public API inventory from 2026-10-24; the site's existing build and deployment workflows; W3C Webmention.

**Tradeoffs Accepted:** Hourly synchronization rather than immediate browser-side publication. Provider verification and account availability remain external dependencies.

## Consequences

**Positive:** Responses survive browser scripting and provider outages. Changes are reviewable in Git. Source and target remain traceable.

**Negative:** Scheduled synchronization consumes CI/API requests. An unavailable provider delays new responses.

**Migration:** Replace the active browser renderer after recovering approved records; retain historical mention data even when original social threads are gone.

**Technical Debt:** No new runtime dependency. ADR indexing is TBD because no ID was supplied.

**Blast Radius:** Public discussion displays and outgoing notifications. Rollback restores the previous site deployment; the approved cache and ledger should be retained.

## Release Plan / Phasing

| Phase | Goal | Activities | Exit criteria | Risk | Excluded |
| --- | --- | --- | --- | --- | --- |
| Build | Implement Phase 1 | Fixtures, metadata, cache, workflows | Local gates pass | Parsing regressions | Account changes |
| Review | Validate hosted build | Draft PR and CI | Hosted checks pass | Configuration differences | Automatic merge |
| Qualify | Verify public behavior | Controlled receive/update/remove and delivery tests | Recorded live evidence | External accounts | Later phases |

**Scope Negotiation Rules:** Later publishing, media, and federation work must preserve the approved no-new-cost and separate-media-repository decisions.

## Risks & Mitigations

| Risk | Category | Likelihood | Impact | Mitigation | Contingency | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Incomplete refresh drops responses | Operations | Medium | High | Atomic replacement only after all pages succeed | Retain prior cache | Site owner |
| Untrusted content executes | Security | Medium | High | Discard HTML; escape text and validate URLs | Block source/record | Site owner |
| Repeated delivery | Operations | Medium | Medium | Persist ledger, content hashes, bounded retries | Disable sending workflow | Site owner |
| Stale deployment is announced | Operations | Medium | Medium | Match the live content to the deployment artifact | Retain pending delivery | Site owner |

## Approvals & Decision Participants

**Decision Participants:** Ted Tschopp (site owner); Codex (implementation).

| Decision | Approver | Description | Date | Technical debt |
| --- | --- | --- | --- | --- |
| ADR-TBD | Ted Tschopp | Authorized implementation of Phase 1 of the supplied restoration plan | 2026-10-25 | No |

**Standards / Reference Architecture Impact:** W3C Webmention and microformats2; existing GitHub Pages constraints. No standards exception or waiver applies.

## Open Questions / Issues Log

| ID | Question | Owner | Needed by | Status |
| --- | --- | --- | --- | --- |
| Q-01 | Assign the repository ADR index | Site owner | Documentation maintenance | TBD |
| Q-02 | Confirm interactive receiver/bridge account access | Site owner | Live qualification | Pending |

## Supporting Materials

- [W3C Webmention](https://www.w3.org/TR/webmention/)
- [Webmention.io API](https://github.com/aaronpk/webmention.io#api)
- [Webmention Rocks](https://webmention.rocks/)
- [h-entry](https://microformats.org/wiki/h-entry)
- [Runbook](../indieweb.md)

**Diagrams:** The data flow is provider → complete snapshot → moderation → indexed cache → Liquid; deployment artifact → content comparison → sender → ledger.

**Related ADRs:** Supersedes none; superseded by none.
