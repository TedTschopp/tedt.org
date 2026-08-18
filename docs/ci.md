# Continuous Integration / Quality Gate

This repository uses one authoritative CI quality workflow and distinct supporting publishing workflows:

1. `deploy.yml` is the source of truth for the site's quality gate and deployment.
2. `mastodon-feed.yml` handles scheduled or push-driven Mastodon publishing.
3. `substack-publish.yml` prepares Substack artifacts after a verified deployment and isolates any approved mutation from the Pages workflow.

---

## 1. Site Quality + Deploy (`deploy.yml`)

Triggers:

- `push` to `main`
- `pull_request`
- Manual `workflow_dispatch`

Responsibilities:

- Install Node, Playwright, Ruby, and bundle dependencies using CI caches where possible
- Record advisory lint results in Allure artifacts (`lint:md`, `lint:js`, `lint:css:overrides`)
- Run the blocking structural checks that back `make qa`
- Build Jekyll once, then run representative accessibility coverage against the generated `_site` output via Playwright + axe
- Run HTMLProofer for internal links / basic HTML validation
- Publish Allure and HTMLProofer artifacts for triage
- Upload `_site` and deploy to GitHub Pages on successful pushes to `main`

Blocking checks:

- `make repo_guard`
- `make substack_check`
- `make normalize`
- Jekyll production build
- `make legacy_check`
- `make feed_check`
- `make validate_mastodon`
- `make feed_diff`
- `make tools_css_sync_check`
- `npm run test:a11y:allure`
- `bundle exec htmlproofer ./_site --root-dir ./_site --check-html --allow-missing-href --disable-external`

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

## 3. Substack Publishing Bridge (`substack-publish.yml`)

Triggers:

- Successful completion of `Site Quality + Deploy` for this repository's
  `main` branch, including a successful Pages `deploy` job
- Manual dispatch from `main` in `prepare`, `publish`, `reconcile`, or
  `record-manual` mode

Workflow boundaries:

1. The credential-free stage checks out the exact deployed SHA, runs
   `make substack_check`, reads a durable ledger snapshot from
   `substack-state`, renders every eligible opt-in, validates assets, and
   uploads a checksum-protected package.
2. When `SUBSTACK_ADAPTER` is `artifact_only`, the workflow ends at the
   artifact. This is the initial and supported fallback state.
3. Only the mutation job enters the literal `substack-production` environment.
   It revalidates artifact checksums, confirms the prepared SHA is still the
   latest successful Pages deployment, re-reads the serialized state branch,
   and then performs a manual ledger record or approved official-API action.
4. A draft record and any email `publish_intent` are committed to
   `substack-state` before release. Ambiguous email outcomes become `unknown`
   and are never retried automatically.
5. More than one email-delivery candidate fails the run after retaining the
   review artifact but before entering the mutation job.

`prepare` is the only manual mode that may be used before the production
environment is configured. `record-manual` does not call Substack, but it does
change durable operational state, so it uses the same required-reviewer gate as
future API mutations. Manual dispatch is not a bypass for environment review.

The repository intentionally ships an unavailable adapter. Both
`artifact_only` and `official` fail closed before reading a credential. Do not
configure `SUBSTACK_ADAPTER=official` until documented Substack write access,
adapter code, contract tests, and a capability canary are present in the same
reviewed change.

`substack-state` is a normal Git branch. In this public repository its ledger
and history are public even though `_config.yml` excludes the JSON file from the
rendered site. The ledger may contain operational post IDs, URLs, hashes,
states, and timestamps. It must never contain API tokens, cookies, subscriber
data, email addresses, private delivery evidence, or other secrets.

Full setup and operations are documented in `docs/substack-publishing.md`.

Required configuration:

- Repository variables: `SUBSTACK_PUBLICATION_URL` and `SUBSTACK_ADAPTER`
- Protected environment: `substack-production`, exact `main` deployment branch,
  required reviewer, and (only after API approval) `SUBSTACK_API_TOKEN`
- Durable branch: `substack-state`, with force pushes disabled

These are GitHub repository settings, not files created by this change. Create
and verify the environment, reviewer rule, branch restriction, state branch,
and branch protections before using any state-changing manual mode or enabling
an adapter.

---

## Why There Is No Separate Validation Workflow

The repository previously had a standalone HTMLProofer workflow. That duplication made it harder to answer a simple question: which workflow is the real quality gate?

The answer is now explicit:

- `deploy.yml` is the authoritative quality workflow.
- Supporting workflows should exist only when they serve a distinct operational purpose, such as social/newsletter publishing or cache maintenance.

---

## Operational Notes

- If a deployment gets stuck or cancelled by a new push, GitHub Pages uses the latest successful artifact.
- To force a rebuild without code changes, use the "Run workflow" button (manual dispatch) or commit an empty change: `git commit --allow-empty -m 'chore: trigger deploy'`.
- The Mastodon workflow will no-op (skip) if your decision script indicates the latest item was already posted.
- The Substack workflow no-ops when all payload hashes already match the durable ledger; source deletion or disabled opt-in creates an alert rather than a remote deletion.
- Pull request runs cancel older in-progress runs for the same ref to avoid spending runner time on superseded commits.
- External link checking remains intentionally excluded from the blocking gate to avoid flaky deploy blockers.

---

## Artifacts and Triage

On each CI run, the workflow publishes:

- Allure results and generated report
- HTMLProofer log artifact
- GitHub Actions log-derived diagnostics when the job fails

This keeps failure triage attached to the same workflow that produced the verdict.

---

Questions or want to reintroduce a piece? Open an issue or ask in chat.
