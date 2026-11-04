# Cloudflare Operations

The policy in `_code/cloudflare/operations/policy.json` describes the active
Workers, their logging sample rates, scheduled jobs, public health checks and
canonical redirect destinations. Logging keeps query strings redacted, leaves
tracing and external exports disabled, and uses existing account allowances.
WebFinger and the MCP Worker use a 10% sample; the ten quieter Workers use 100%.
Future deployments must preserve the live policy. The IndieWeb deployment files
in this repository declare these settings directly. Other application repositories
own their deployment configuration; the central policy detects live drift.

Run the public checks with:

```sh
python3 _code/cloudflare/operations/check_services.py
```

The checks validate response status, redirect destination, WebFinger JSON,
application health fields and shared-asset content types. A failed check is retried
before it fails the run. The MCP check verifies its expected GET 405 response
without invoking a tool. The evaluation check serves only static content and does
not start the container or call a model. The family Worker check is an HTTP check;
it does not send email. `tschopp.net` has an uptime check, but reviewing its web
requests still requires access to its separate host's logs.

The Service Health workflow runs every six hours on standard Ubuntu runners in
this public repository. It installs no dependencies, uploads no artifacts, and
creates no paid service. Healthy runs only record a normal Actions result. Failure
notifications follow the maintainer's GitHub notification settings.

Authenticated checks reuse the existing `CLOUDFLARE_API_TOKEN` in the
`social-bot-check-preview` environment:

```sh
python3 _code/cloudflare/operations/check_services.py --mode cloudflare
```

This mode verifies all 12 logging profiles, checks for a successful scheduled
invocation within 20 minutes for both member Workers, and reads rolling 30-day log
volume. It does not print request bodies, addresses, headers or token values.
It requires Workers Scripts Read and Workers Observability Write; Cloudflare
requires the latter permission even for a temporary, read-only telemetry query.
The workflow supports an explicit authenticated trial. Only enable the repository
variable `CLOUDFLARE_OPS_CHECKS_ENABLED=true` after that trial succeeds. A missing
permission is reported as a failed check rather than a healthy result.

The usage warning starts at 10% of the current 20-million-event allowance.
Beginning December 1, 2026 it checks bytes against 10% of the new 50 GB ingestion
allowance. This is an early-warning threshold using a rolling window, not a
billing statement, storage meter or hard spending cap. Review the first two days
of collected volume and review usage before December 1. Preserve current sampling
until actual event and byte volume supports changing it.

The evaluation host's sensitive-file guard rejects `/.git`, `/.git/*`, `/.env` and
`/.env.*` with HTTP 403 before the SPA fallback. Its existing homepage and real
assets remain available. The scope is only `evals.tedt.org`; this is separate from
the application's legitimate browser routes.

References: [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/),
[December Observability Pricing](https://developers.cloudflare.com/observability/pricing/),
and [GitHub Actions Billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
