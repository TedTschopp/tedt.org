# Continuous Integration / Automation Simplified

This repository uses a minimal GitHub Actions setup focused on two concerns:

1. Deploy the Jekyll site to GitHub Pages
2. Publish new feed items to Mastodon on a schedule or push

---

## 1. Deployment Workflow (`deploy.yml`)

Triggers:

- `push` to `main`
- Manual `workflow_dispatch`

Responsibilities:

- Install Ruby & bundle dependencies (cached)
- Run a production Jekyll build
- Upload `_site` as a Pages artifact and deploy via `actions/deploy-pages`

Environment / Permissions:

- `pages: write` & `id-token: write` for OIDC-based deployment
- Concurrency protects against overlapping deployments (`deploy-pages` group)

Toggle points:

- To enable profiling locally, run `JEKYLL_ENV=production bundle exec jekyll build --profile`
- Add HTML link checking later if desired (recommend a separate optional job)

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

## Adding Back Validation (If Needed Later)

If you decide to reintroduce validation (HTML Proofer, feed integrity, security audit):

- Create a new `validate.yml` triggered on PRs & scheduled.
- Keep deployment workflow lean to avoid blocking deploys on flaky external link checks.

Example skeleton snippet:

```yaml
name: Validate
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - run: bundle exec jekyll build --quiet
      - run: bundle exec htmlproofer ./_site --allow-missing-href || true
```

---

## Operational Notes

- If a deployment gets stuck or cancelled by a new push, GitHub Pages uses the latest successful artifact.
- To force a rebuild without code changes, use the "Run workflow" button (manual dispatch) or commit an empty change: `git commit --allow-empty -m 'chore: trigger deploy'`.
- The Mastodon workflow will no-op (skip) if your decision script indicates the latest item was already posted.

---

## Housekeeping

Removed legacy workflows:

- Complex CI validation, security audit, dedupe/backfill Mastodon routines, multi-step heartbeat instrumentation.

This keeps maintenance low while preserving core automation.

---

## Next Steps (Optional)

- Add status badges for Deploy & Mastodon workflows to `README.md`.
- Add a lightweight test job for `_code/` scripts (Python static checks) if script complexity grows.
- Consider Dependabot for gem & action updates.

---

Questions or want to reintroduce a piece? Open an issue or ask in chat.
