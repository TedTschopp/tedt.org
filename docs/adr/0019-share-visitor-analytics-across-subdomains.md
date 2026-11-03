# ADR 0019: Share visitor analytics across subdomains

Status: Accepted  
Date: 2026-11-02  
Authors: Ted Tschopp, Codex  
Supersedes: None  
Superseded-By: None

## Context

Ted requested the existing GA4, Clarity, and Cloudflare collectors on all active
rendered pages, including previews and masked signed-in member pages. Local
builds and live collection checks are required before delivery is complete.

## Problem

Separate layouts, standalone HTML, restrictive CSPs, and DNS-only hosting leave
inconsistent coverage. Cloudflare automatic injection alone misses some hosts.

## Decision

Publish a backward-compatible analytics v1 asset on tedt.org, separate from the
analytics-free global header. Reuse the existing IDs and baseline events.
Finalize and audit every published HTML artifact with the portable build helper.
Mask member/tool content before vendor startup. Permit Clarity URL/navigation
metadata as explicitly selected by Ted; do not promise complete URL anonymization.

## Rationale

- One shared runtime avoids divergent collector implementations.
- Build-time integration covers standalone pages without unsupported Jekyll plugins.
- Explicit Cloudflare loading covers DNS-only hosting and permits duplicate checks.
- A deferred, optional script keeps page functionality independent of analytics.

## Alternatives Considered

### Inject through the shared header

Rejected because the header contract promises no analytics and some pages omit it.

### Use Cloudflare automatic injection alone

Rejected because it does not provide GA4/Clarity or complete DNS-only coverage.

## Consequences

The shared asset and allowed vendor origins become explicit consumer dependencies.
Member privacy documentation and tests must reflect the authorized analytics
policy. Masking limits the usefulness of content replay on private workspaces.
Advertising features stay disabled. Existing authorization boundaries remain.

## Implementation Notes

See [the integration contract](../analytics.md). Keep independent eval downloads
unmodified. Detect automatic beacons until consumer rollout is verified, then
disable automatic injection on the existing Cloudflare analytics site.

## Metrics / Success Criteria

Every eligible artifact has one embed, local checks pass, and each deployed host
successfully collects through all three providers without duplicate initialization.

## Future Work (Deferred)

Restoring retired sites, changing analytics properties, and redesigning consent UX.

## Decision Stability

Revisit when collector vendors, trust boundaries, or the reporting scope change.

## References

- ADR 0018: shared global header
- Microsoft Clarity masking: https://learn.microsoft.com/en-us/clarity/faq/
- Cloudflare beacon setup: https://developers.cloudflare.com/web-analytics/faq/
