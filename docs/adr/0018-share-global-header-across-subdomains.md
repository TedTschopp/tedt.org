# ADR 0018: Share the Global Header Across Subdomains

Status: Accepted
Date: 2026-10-29
Authors: Ted Tschopp, Codex
Supersedes: None
Superseded-By: None

## Context

Thirteen independently built websites need the Public Workbench navigation. Their
Jekyll, Astro, and standalone HTML implementations currently drift. Ted approved
runtime sharing, six navigation sections, five public landing pages, and a shared
Light / System / Dark preference on October 29, 2026.

## Problem

A navigation correction currently requires editing and publishing several copies.
Bootstrap versions, global styles, fixed positioning, and theme controllers differ
between consumers.

## Decision

Publish a dependency-free custom element, stylesheet, logo, and theme controller
under `https://tedt.org/assets/global-header/v1/`. Generate navigation from Jekyll
data with existing Liquid filters. Use an open Shadow DOM to isolate presentation
and native links with separate disclosure buttons. Each consumer retains a small,
readable HTML fallback and its own local navigation.

Use a non-sensitive `tedt-appearance` cookie with Domain=tedt.org, Path=/,
Secure, SameSite=Lax, and a one-year lifetime. Its values are light, auto, and dark.
The common controller drives existing theme attributes and emits a change event.
Member session and entitlement logic are independent of this preference.

## Rationale

- One central deployment updates compatible consumers after normal cache expiry.
- Shadow DOM isolates Bootstrap, legacy resets, and application CSS.
- Real links remain usable without enhancement; reserved height prevents overlap.
- No framework, unsupported Jekyll plugin, iframe, or navigation API is required.
- The header fetches public assets only and includes no analytics or member data.

## Alternatives Considered

### Copies bundled during each site build

Avoids a runtime dependency, but requires thirteen rebuilds for a menu correction.
Ted selected automatic runtime updates.

### Cross-origin iframe

Isolates CSS, but complicates dropdown sizing, navigation, theme control, and
keyboard focus. Rejected.

## Consequences

### Positive

Consistent destinations, accessible interaction, and appearance preferences across
the selected websites. Existing permalink structures and local controls remain.

### Negative

Enhanced navigation depends on tedt.org availability. Its JavaScript is trusted
code in each consumer origin; member CSP permits only the shared asset directory.
Fallback links remain available if the script or stylesheet fails.

### Neutral / Unknowns

Automatic propagation follows browser/CDN cache expiry and the next page load;
already loaded pages do not fetch replacement application code.

## Implementation Notes

Publish destinations and assets before consumer integrations. Keep v1 interfaces
backward compatible. Breaking changes receive a new major-version directory.
Retain Git revisions of every published release and consumer integration for
rollback. Preview, media, API, and unavailable Password Challenge hosts are excluded.

## Metrics / Success Criteria

- All thirteen public sites render the same six sections and working destinations.
- Keyboard, mobile, no-JavaScript, blocked-asset, and cross-subdomain theme checks pass.
- Existing catalogs, playback, generators, and member authorization still work.
- A central asset update reaches consumers without rebuilding their sites.

## Future Work (Deferred)

Full-site redesigns and changes to non-participating hosts.

## Decision Stability

Revisit if runtime availability or the trust boundary requires build-time sharing.

## References

- ADR 0008: Memory Probe Instrumentation and Recent Content Caching.
- ADR 0016: Introduce a Patreon Member Section on Cloudflare.
- https://html.spec.whatwg.org/multipage/custom-elements.html
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
