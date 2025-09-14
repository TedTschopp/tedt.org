# ADR Index

This directory contains Architecture Decision Records (ADRs) capturing significant, irreversible, or high-impact technical decisions for the site.

## Numbering Scheme

- Files are numbered with zero-padded 4-digit prefixes: `0001`, `0002`, etc.
- `0000-index.md` (this file) is reserved as the stable index and MUST NOT be repurposed.
- Numbers are assigned at ADR creation time and never renumbered—this preserves permalinks in commit history and external references.
- Status keywords: `Proposed`, `Accepted`, `Deprecated`, `Superseded`.
- When an ADR is superseded, update its status and add a `Superseded-By:` line referencing the replacement ADR number.

## Workflow

1. Draft ADR (`Proposed`) with context, decision, alternatives, consequences.
2. Review + refine (optional lightweight discussion in PR).
3. Mark `Accepted` once merged.
4. If direction changes later, create a new ADR; do not edit historical decisions beyond status annotations / links.

## Current ADRs

| Number | Title | Status | Date | Summary |
|--------|-------|--------|------|---------|
| 0001 | Memory Probe Instrumentation & Recent Content Caching | Accepted | 2025-09-14 | Env-gated memory deltas + cached per-category recent posts reduce redundant loops & improve observability. |
| 0002 | Dynamic Prompt Series Architecture | Accepted | 2025-08-06 | Structure for multi-post prompt series with navigation & metadata cohesion. |
| 0003 | Random Carousel Start Position | Accepted | 2025-08-10 | Randomizes homepage category carousel start index for varied exposure. |
| 0004 | Prompt Library Jekyll Integration | Proposed | 2025-08-05 | Replace static prompt cards with dynamic posts-driven library & tag filters. |
| 0005 | Multi-Scale Hex Overlay Visualization | Proposed | 2025-08-07 | Layered hex grid visualization strategy for mapping content. |
| 0006 | Registry-Driven Category Carousel & Accessibility | Accepted | 2025-08-14 | Central registry powering carousel; accessibility & maintainability improvements. |
| 0007 | Category Theming Unification | Accepted | 2025-08-14 | Unified category color/theme mapping across layouts & components. |
| 0001 (Deprecated) | Prompt Library Integration (Placeholder) | Deprecated | 2025-08-05 | Empty stub superseded by ADR 0004. |

## Conventions

- Use imperative mood in titles (e.g., "Adopt X", "Introduce Y").
- Keep each ADR self-contained; link related ADRs in a `See Also` section when relevant.
- Prefer concise rationale; move deep analysis to `/docs/planning/` if needed.

## Future Candidates (Backlog)

- Precompute prompt tag index.
- Introduce unified post lookup map for cross-linking.
- Add accessibility CI gating strategy.
- Evaluate migration path if post volume grows 10x.

---
_This index is maintained manually to keep ordering explicit and reviewable._
