# Continuous Integration / Quality Gate

This repository now uses one authoritative CI quality workflow and one supporting social publishing workflow:

1. `deploy.yml` is the source of truth for the site's quality gate and deployment.
2. `mastodon-feed.yml` handles scheduled or push-driven Mastodon publishing.

---

## 1. Site Quality + Deploy (`deploy.yml`)

Triggers:

- `push` to `main`
- `pull_request`
- Manual `workflow_dispatch`

Responsibilities:

- Install Node, Playwright, Ruby, and bundle dependencies
- Record advisory lint results in Allure artifacts (`lint:md`, `lint:js`, `lint:css:overrides`)
- Run the blocking structural checks that back `make qa`
- Run representative accessibility coverage via Playwright + axe
- Run HTMLProofer for internal links / basic HTML validation
- Publish Allure and HTMLProofer artifacts for triage
- Upload `_site` and deploy to GitHub Pages on successful pushes to `main`

Blocking checks:

- `make repo_guard`
- `make normalize`
- Jekyll production build
- `make legacy_check`
- `make feed_check`
- `make validate_mastodon`
- `make feed_diff`
- `make tools_css_sync_check`
- `npm run test:a11y:allure`
- `SKIP_EXTERNAL=1 bundle exec htmlproofer ./_site --root-dir ./_site --check-html --allow-missing-href`

Advisory checks:

- Markdown lint
- JavaScript syntax lint
- CSS overrides stylelint

Deployment behavior:

- Pull requests run the quality job only.
- Pushes to `main` run the same quality gate and then deploy if it passes.

Environment / Permissions:

- `pages: write` and `id-token: write` support GitHub Pages deployment on `main`
- Concurrency protects against overlapping deployments (`deploy-pages` group)

Local parity:

- `make qa` for the fast structural/content gate
- `make quality_gate` for the full local gate (`make qa` + a11y + HTMLProofer)
- `ruby tests/diff_feeds.rb --refresh` when intentionally updating feed baselines after feed format or baseline-policy changes

Informational output emitted during the gate:

- `make length_report` publishes Mastodon length distribution data for visibility

---

## 2. Mastodon Feed Workflow (`mastodon-feed.yml`)

Triggers:

- `push` to `main`
- Scheduled every 6 hours (`cron: 0 */6 * * *`)
- Manual `workflow_dispatch`

Workflow logic:

1. Run `_code/should_post_latest.py` to decide if the latest piece of content needs a toot.
2. If yes, use `nhoizey/github-action-feed-to-mastodon` to post from `feed-mastodon.json`.
3. Update cache/front matter with returned toot URL using existing repository scripts.
4. Commit any changes (cache / updated post front matter) automatically.

Secrets Required:

- `MASTODON_TOKEN` (saved in repo/organization secrets)

Optional Improvements (not currently enabled):

- Backfill / dedupe jobs (previously present) – intentionally removed for simplicity.
- Retry / error alerting (could add a simple Slack webhook step if failures persist).
- Multi-instance cross-posting (add additional steps with different tokens).

---

## Why There Is No Separate Validation Workflow

The repository previously had a standalone HTMLProofer workflow. That duplication made it harder to answer a simple question: which workflow is the real quality gate?

The answer is now explicit:

- `deploy.yml` is the authoritative quality workflow.
- Supporting workflows should exist only when they serve a distinct operational purpose, such as social publishing or cache maintenance.

---

## Operational Notes

- If a deployment gets stuck or cancelled by a new push, GitHub Pages uses the latest successful artifact.
- To force a rebuild without code changes, use the "Run workflow" button (manual dispatch) or commit an empty change: `git commit --allow-empty -m 'chore: trigger deploy'`.
- The Mastodon workflow will no-op (skip) if your decision script indicates the latest item was already posted.
- External link checking remains intentionally excluded from the blocking gate to avoid flaky deploy blockers.

---

## Artifacts and Triage

On each CI run, the workflow publishes:

- Allure results and generated report
- HTMLProofer log artifact
- GitHub Actions log-derived diagnostics

This keeps failure triage attached to the same workflow that produced the verdict.

---

Questions or want to reintroduce a piece? Open an issue or ask in chat.
