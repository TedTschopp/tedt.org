# ADR 0008: Memory Probe Instrumentation and Recent Content Caching

Date: 2025-09-14
Status: Accepted
Decision Makers: Site Maintainer

## Context

Large Jekyll site (≈900+ posts) experienced intermittent CI build cancellations (exit 137 / OOM) and elevated peak RSS during full site generation. Repeated wide Liquid loops over `site.posts` (especially for category carousels, homepage elements, and prompt-related layouts) increased object churn and heap growth. Diagnosis required visibility into memory behavior across document renders.

## Problem

1. Lack of visibility: No incremental insight into when/where memory was accumulating.
2. Redundant computation: Multiple templates recomputed recent posts or category subsets via full scans of `site.posts`.
3. Perceived memory spikes late in the build masked cumulative allocation growth.
4. Need to keep production lean—diagnostics should impose near-zero overhead unless explicitly enabled.

## Constraints

- Keep standard Jekyll build semantics (no external services, minimal gem changes).
- Avoid persistent large in-memory indexes beyond what is reused.
- CI environment has limited memory; must reduce unnecessary allocations.
- Instrumentation must be opt-in to avoid noise in local and production builds.

## Decision

Implement two complementary improvements:

1. Memory Probe Plugin (`_plugins/memory_probe.rb`):
   - Logs RSS (resident set size) deltas at controlled intervals (e.g., every N documents), plus cumulative build phases.
   - Enabled only when `ENV['MEM_PROBE']` is set.
   - Provides delta (current - previous) to highlight growth distribution rather than absolute snapshots alone.
2. Category & Recent Content Caching (`category_recent_index` plugin + adjusted layouts):
   - Precomputes per-category recent post arrays once.
   - Templates reference cached structures instead of recomputing `site.posts | where ... | sort ... | slice` repeatedly.
   - Reduces repeated allocations and object traversal, mitigating heap expansion.

An optional `periodic_gc` plugin was added to trigger Ruby GC at intervals (env gated) for experimentation; retained though its effect on RSS reclaim was minimal.

## Alternatives Considered

- Rely solely on Ruby GC tuning flags (`RUBY_GC_HEAP_*`): Rejected; opaque and environment-specific without insight.
- External memory profilers (e.g., `memory_profiler` gem): Too heavy for continuous use; increases build time and complexity.
- Dropping late-build content batches: Would sacrifice features and completeness.
- Full content sharding (multiple Jekyll runs merged): Operationally complex for limited benefit after caching.

## Rationale

- Lightweight instrumentation + structural caching offers the highest signal-to-overhead ratio.
- Delta RSS logging avoids misattributing normal steady growth to a single “spike.”
- Caching directly removes N× repeated loops—tangible reduction in allocations without semantic change.

## Consequences

### Positive

- Improved observability of memory trends (granular deltas).
- Lower redundant Liquid processing → modestly reduced peak memory and CPU.
- Env gating keeps production output clean and fast by default.
- Foundation for future targeted indices (e.g., prompt tags, bestiary sources) if needed.

### Neutral / Mixed

- Slight code complexity: additional plugins and documented env flags.
- Periodic GC hook retained despite limited measurable RSS reduction (kept for future tuning experiments).

### Negative / Risks

- Over-instrumentation temptation if more probes accumulate (mitigated via ADR + env gating discipline).
- Caching must be kept in sync if category logic or post selection rules evolve.

## Usage

Enable memory probe:

```sh
MEM_PROBE=1 bundle exec jekyll build
```

Enable periodic GC (optional):

```sh
FORCE_PERIODIC_GC=1 bundle exec jekyll build
```

(Flags are combinable.)

## Metrics / Success Criteria (Qualitative)

- Memory growth observed to be distributed across late document renders, not a single pathological post.
- Peak RSS stabilized after removing broad repeated `site.posts` scans.
- No significant regressions in build time; slight improvement due to reduced redundant sorting and filtering.

## Future Work (Deferred)

- Introduce consolidated post lookup hash (by slug/id) to accelerate related-content discovery.
- Add prompt tag index precompute to eliminate remaining tag-scan loops.
- Explore selective freezing (`.freeze`) of static string arrays in plugins to reduce object duplication.
- Integrate accessibility & performance CI gates leveraging existing cached structures.

## Decision Stability

Expected to remain valid unless:

- Site post volume increases by another order of magnitude.
- Migration to a different static site generator invalidates plugin approach.
- Ruby / Jekyll introduces native incremental caching that subsumes custom index plugin.

---

This ADR documents why lightweight, env-gated observability plus structural caching was adopted instead of heavier profiling or architectural fragmentation.

## References

- Related ADRs: 0000 (Index)
- `_plugins/memory_probe.rb`
- `_plugins/periodic_gc.rb`
- `_plugins/category_recent_index.rb`
