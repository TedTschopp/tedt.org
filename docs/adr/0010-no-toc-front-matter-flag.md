# ADR 0010: `no_toc` Front Matter Flag to Suppress Table of Contents

Date: 2025-09-14
Status: Accepted
Decision Type: Presentation / UX Control

## Context
Some posts (short announcements, visual essays, or tightly formatted prompt collections) render an unnecessary Table of Contents (TOC) card, consuming above‑the‑fold space without adding navigational value. Previously every post layout rendered the TOC block unconditionally.

## Problem
Unconditionally injecting the TOC can:

- Add visual noise for short or single‑section posts.
- Create misleading affordances (empty or trivial TOCs).
- Slightly increase DOM size and client hydration / scroll scripting cost.

## Decision
Introduce an explicit boolean front matter flag `no_toc`. When `true`, the TOC card is not rendered.

```yaml
---
no_toc: true
---
```

## Implementation
In `/_layouts/post.html` the TOC wrapper `<div class="card ...">` is wrapped with:

```liquid
{% unless page.no_toc == true or page.no_toc == 'true' %}
  ... TOC card markup ...
{% endunless %}
```

## Rationale

- Opt‑out model preserves current behavior for existing content.
- Simple predicate; supports YAML boolean or quoted string.
- Minimizes layout branching complexity.

## Alternatives Considered

| Alternative | Reason Rejected |
| ----------- | --------------- |
| Global site config flag | Too coarse; need per‑post granularity. |
| Auto-hide when < N headings | Requires runtime parsing; adds JS complexity. |
| Post length heuristic | Unreliable; headings, not word count, govern TOC utility. |

## Consequences

### Positive

- Cleaner presentation for concise content.
- Reduced distraction and cognitive load.
- Slight performance improvement on posts where TOC is hidden.

### Negative

- Author must remember to set the flag (documentation mitigates this).
- Inconsistent experience if authors overuse the flag.

## Migration Plan

1. Merge change (complete).
2. Update documentation (see README/front matter flags section).
3. Optionally audit existing short posts to add `no_toc: true` where appropriate.

## Testing

- Post with `no_toc: true` renders without `#table-of-contents-card` element.
- Post without flag or with `no_toc: false` preserves original TOC.

## Future Enhancements

- Add automated lint rule or build-time plugin to recommend `no_toc` when heading count < 2.
- Add `toc: false` alias if author preference emerges.

## Status Tracking

| Item | Status |
| ---- | ------ |
| Layout conditional merged | Done |
| Docs updated | Done |
| ADR indexed | Done |

## Decision Owner
Content & Site Engineering
