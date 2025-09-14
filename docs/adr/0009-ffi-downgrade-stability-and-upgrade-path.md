# ADR 0009: Temporary Downgrade & Pin of `ffi` to 1.16.3

Date: 2025-09-14
Status: Accepted
Decision Type: Tactical (Stability / Build Infrastructure)

## Context (Build Failures)

Recent production and CI builds began failing when resolving the `ffi` gem. Versions `1.17.2` and subsequently `1.17.1` (previously present in the lockfile) became unavailable or incomplete for the CI environment. Attempts to keep the minor line (`~> 1.17.1`) or re-pin exactly (`= 1.17.1`) still failed remotely. The project depends on `ffi` transitively via gems like `ethon` / `typhoeus` / `listen` (used by Jekyll tooling and html-proofer) and requires a universally available version to guarantee reproducible builds.

Additional constraints:
- Local contributors are still on older Ruby (<= 2.6.x / 2.7.x) which limits adoption of the newest dependency chain (e.g., modern `nokogiri`, `google-protobuf`, `sass-embedded`).
- CI (GitHub Actions) runs a newer Ruby (>= 3.1) capable of resolving patched, security-fix versions.
- RubyGems version in some environments is outdated (3.0.3.1), emitting warnings and potentially impacting dependency resolution edge cases.

## Problem Statement (Unreliable ffi 1.17.x)

The locked `ffi` 1.17.x series became unreliable for installation in the CI environment (missing platform builds / yanked / transient replication gap). This caused hard build failures blocking content deployment. Without immediate remediation, other developers and automation would remain unable to build or verify site changes.

## Decision (Temporary Pin)

Temporarily pin `ffi` to the last widely-available, stable version: `1.16.3`.

```ruby
gem 'ffi', '= 1.16.3' # Downgraded: newer 1.17.x builds unavailable on CI; 1.16.3 widely present
```

A fresh `Gemfile.lock` was generated to lock compatible transitive versions. No functional site features depend directly on newer `ffi` APIs, so the downgrade introduces negligible risk.

## Rationale (Why Pin to 1.16.3)

- 1.16.3 has broad platform coverage and is still published.
- Minimizes churn: smallest change to restore green CI.
- Avoids speculative upgrade trees while local Ruby versions lag.
- Reversible: a future upgrade path is documented below.

## Considered Alternatives (Explored Options)

1. Keep floating (~> 1.17.1) and wait for registry recovery.
   - Rejected: Indeterminate outage window; blocks deployments.
2. Remove pin entirely and rely on transitive resolution.
   - Rejected: Still resolved to failing 1.17.x versions during tests.
3. Force upgrade to latest ecosystem (new Ruby + nokogiri + protobuf + sass-embedded).
   - Deferred: Requires coordinated local developer runtime upgrade.
4. Vendor or mirror the missing gem version internally.
   - Overkill for a static site pipeline; added maintenance burden.

## Consequences (Impact Analysis)

### Positive Outcomes

- Restores deterministic builds immediately.
- Simplifies incident closure and unblocks content updates.

### Negative / Risks

- Delays adoption of security patches tied to newer dependency graph until Ruby baseline is raised.
- Potential future incompatibility if upstream gems eventually require ffi >= 1.17.

### Mitigations

- Conditional constraints already present in `Gemfile` for security-relevant gems when Ruby >= 3.1.
- Scheduled upgrade path (see below) reduces long-term exposure.

## Security Considerations

No currently disclosed CVE specifically mandates moving off `ffi` 1.16.3 for our usage profile. However, lingering on older stacks extends window of latent risk. Implement monitoring via `bundler-audit` (already present) and Dependabot once configured.

## Upgrade Path (Planned Sequence)

1. Establish minimum Ruby version policy: raise baseline to >= 3.1 (target date: Q4 2025).
2. Upgrade local developer Ruby installations and CI matrix accordingly.
3. Remove the explicit `ffi` pin; run `bundle update ffi`.
4. Allow ecosystem updates: `nokogiri >= 1.18.9`, `google-protobuf >= 3.25.5`, `sass-embedded >= 1.77.0` unconditionally.
5. Re-run `bundler-audit` and address any newly surfaced advisories.
6. Remove this ADR’s “Temporary” classification after successful promotion (convert to Historical record with closure note) or supersede with a new ADR describing the modernization.

## Operational Recommendations (Near-Term)

- Add Dependabot configuration for Bundler to surface new gem releases/security fixes early.
- Periodically (monthly) run `bundle outdated --strict` in CI and record summary.
- Upgrade RubyGems system version (`gem update --system 3.2.3` or later) in build images.
Date: 2025-09-14
Status: Accepted
Decision Type: Tactical (Stability / Build Infrastructure)

## Context

Recent production and CI builds began failing when resolving the `ffi` gem. Versions `1.17.2` and subsequently `1.17.1` (previously present in the lockfile) became unavailable or incomplete for the CI environment. Attempts to keep the minor line (`~> 1.17.1`) or re-pin exactly (`= 1.17.1`) still failed remotely. The project depends on `ffi` transitively via gems like `ethon` / `typhoeus` / `listen` (used by Jekyll tooling and html-proofer) and requires a universally available version to guarantee reproducible builds.

Additional constraints:

- Local contributors are still on older Ruby (<= 2.6.x / 2.7.x) which limits adoption of the newest dependency chain (e.g., modern `nokogiri`, `google-protobuf`, `sass-embedded`).
- CI (GitHub Actions) runs a newer Ruby (>= 3.1) capable of resolving patched, security-fix versions.
- RubyGems version in some environments is outdated (3.0.3.1), emitting warnings and potentially impacting dependency resolution edge cases.

## Problem Statement

The locked `ffi` 1.17.x series became unreliable for installation in the CI environment (missing platform builds / yanked / transient replication gap). This caused hard build failures blocking content deployment. Without immediate remediation, other developers and automation would remain unable to build or verify site changes.

## Decision

Temporarily pin `ffi` to the last widely-available, stable version: `1.16.3`.

```ruby
gem 'ffi', '= 1.16.3' # Downgraded: newer 1.17.x builds unavailable on CI; 1.16.3 widely present
```

## Rationale

- 1.16.3 has broad platform coverage and is still published.
- Minimizes churn: smallest change to restore green CI.
- Avoids speculative upgrade trees while local Ruby versions lag.
- Reversible: a future upgrade path is documented below.

## Considered Alternatives

1. Keep floating (~> 1.17.1) and wait for registry recovery.
   - Rejected: Indeterminate outage window; blocks deployments.
2. Remove pin entirely and rely on transitive resolution.
   - Rejected: Still resolved to failing 1.17.x versions during tests.
3. Force upgrade to latest ecosystem (new Ruby + nokogiri + protobuf + sass-embedded).
   - Deferred: Requires coordinated local developer runtime upgrade.
4. Vendor or mirror the missing gem version internally.
   - Overkill for a static site pipeline; added maintenance burden.

## Consequences

### Positive

- Restores deterministic builds immediately.
- Simplifies incident closure and unblocks content updates.

### Negative / Risks (Delay & Compatibility)

- Delays adoption of security patches tied to newer dependency graph until Ruby baseline is raised.
- Potential future incompatibility if upstream gems eventually require ffi >= 1.17.

### Mitigations (Risk Reduction)

- Conditional constraints already present in `Gemfile` for security-relevant gems when Ruby >= 3.1.
- Scheduled upgrade path (see below) reduces long-term exposure.

## Security Considerations (Exposure Window)

No currently disclosed CVE specifically mandates moving off `ffi` 1.16.3 for our usage profile. However, lingering on older stacks extends window of latent risk. Implement monitoring via `bundler-audit` (already present) and Dependabot once configured.

## Upgrade Path (Planned)

1. Establish minimum Ruby version policy: raise baseline to >= 3.1 (target date: Q4 2025).
2. Upgrade local developer Ruby installations and CI matrix accordingly.
3. Remove the explicit `ffi` pin; run `bundle update ffi`.
4. Allow ecosystem updates: `nokogiri >= 1.18.9`, `google-protobuf >= 3.25.5`, `sass-embedded >= 1.77.0` unconditionally.
5. Re-run `bundler-audit` and address any newly surfaced advisories.
6. Remove this ADR’s “Temporary” classification after successful promotion (convert to Historical record with closure note) or supersede with a new ADR describing the modernization.

## Operational Recommendations

- Add Dependabot configuration for Bundler to surface new gem releases/security fixes early.
- Periodically (monthly) run `bundle outdated --strict` in CI and record summary.
- Upgrade RubyGems system version (`gem update --system 3.2.3` or later) in build images.

## Status Tracking

| Item | Status |
| ---- | ------ |
| CI builds green on ffi 1.16.3 | Confirmed |
| ADR committed | This change |
| Dependabot config added | Pending |
| Ruby baseline decision | Pending |

## References

- Previous ADRs: 0007 (category theming), 0008 (memory probe) for format consistency.
- `bundler-audit` advisories (local run context, Sept 2025).

## Decision Owner

Site Engineering / Build Infrastructure Steward

---

This ADR will be revisited after Ruby baseline uplift or if upstream gems mandate ffi >= 1.17.x.
