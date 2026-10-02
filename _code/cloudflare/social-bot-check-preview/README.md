# Social Bot Check Sharing Previews

This Cloudflare Worker adds account profile pictures to the **initial HTML**
served for `/tools/social-bot-check.html?platform=…&user=…`. Social preview
crawlers can read the Open Graph and Twitter images without JavaScript.

The existing GitHub Pages page remains the origin. The Worker runs only on
`https://tedt.org/tools/social-bot-check.html*` and checks the exact page path
before doing any work. A link without an account preserves the generated site
logo. Missing pictures, Mastodon's default avatar, invalid accounts, unavailable
APIs and timeouts also retain the logo.

## Behavior

- Bluesky: fetch `app.bsky.actor.getProfile` from its public AppView.
- Mastodon: fetch `/api/v1/accounts/lookup` on the account's home server; prefer
  `avatar_static` to an animated avatar.
- Reuse the checker's account parsers. Request HTTPS public domains without
  credentials or redirects. Never forward visitor cookies, authorization or
  referrer headers to profile APIs.
- Limit each lookup to two seconds and 256 KiB of JSON.
- Cache only the image URL and alternative text for ten minutes. Cache missing
  images or failed lookups for one minute. The key identifies the profile API
  endpoint, independently of scan limit, and keeps accounts/platforms separate.
- Replace `og:image`, `twitter:image`, their alternative text, and the social
  URL fields. Remove old image dimensions/type when an avatar replaces the logo.
  Use `twitter:card=summary` for the avatar. Keep the search canonical URL,
  publisher JSON-LD, visible checker and its assets intact.
- Do not cache transformed HTML. Set `X-Social-Bot-Check-Preview` to `avatar` or
  `fallback` for an account link, allowing direct deployment verification. Include
  the Cloudflare version ID in `X-Social-Bot-Check-Preview-Version`.

There is no login to social sites, database, image proxy, or paid storage. Social
sites may cache a preview longer than this Worker's profile cache.

## Test and Deploy

Use Node 22 or later and Python 3, from the repository root:

```bash
npm ci --prefix _code/cloudflare/social-bot-check-preview
npm test --prefix _code/cloudflare/social-bot-check-preview
bundle exec jekyll build
```

Tests package the production entry point with Wrangler, then execute that bundle
and its real HTMLRewriter in Miniflare. Deployment tests cover wrong accounts,
missing credentials, unidentified versions and failed promotions. Published-HTML
verification has separate fixture tests. All test requests use fixtures; the
tests make no live account requests. The package is under `_code/` and is not part
of Jekyll's public output.

Authenticate with Cloudflare's browser authorization flow. Grant only account
and user reads, zone reads, and Worker script/route deployment permissions:

```bash
cd _code/cloudflare/social-bot-check-preview
npx wrangler login --scopes account:read user:read workers_scripts:write workers_routes:write zone:read
npx wrangler whoami
npm run deploy
```

Confirm the account's plan and available quota before deploying. Keep the
current plan; this feature does not require a paid upgrade. Workers Free
currently includes 100,000 incoming Worker requests per account per day and
10 milliseconds of CPU per invocation. Only matching checker-page requests
invoke this Worker. See [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

After deployment, verify **Fail open (proceed)** in the Cloudflare route
settings. That returns the original GitHub Pages page on execution failures or
exhausted limits. Wrangler does not expose this setting in its route config, so
check it after future deployments too. `passThroughOnException()` also preserves
the origin on an uncaught Worker error. See [Workers limits](https://developers.cloudflare.com/workers/platform/limits/).

For later code updates, prefer `wrangler versions upload` followed by
`wrangler versions deploy VERSION_ID@100% --yes`. This preserves the existing
route and its failure mode. The CI deployment uses these version commands.

Verify initial HTML with an HTTP client, not just a browser's changed DOM:

```bash
curl -sS 'https://tedt.org/tools/social-bot-check.html?platform=bluesky&user=tedt.org&limit=100'
curl -sS 'https://tedt.org/tools/social-bot-check.html?platform=mastodon&user=%40Ted%40tschopp.net&limit=100'
curl -sS 'https://tedt.org/tools/social-bot-check.html'
```

The first two responses should contain the respective public account avatar in
both image tags. The third should retain `https://tedt.org/img/Site-Logo.webp`.
Also verify an account without a picture and the functioning checker UI.

`npm run verify:live` checks six published links. Set
`SOCIAL_PREVIEW_EXPECTED_VERSION` to the promoted version ID to require that exact
version in the account responses. A correct API fallback is reported as such and
passes; stale versions, broken metadata, duplicate images or lost checker markup
fail. The script does not publish to any social site.

Rollback by removing just this Worker's route in Cloudflare. The underlying
GitHub Pages page continues to work with the default sharing image.

## Automatic Deployment

`.github/workflows/social-bot-check-preview.yml` tests relevant pushes and pull
requests. The production job runs after those tests, only on `main`, and is
enabled by the repository variable `SOCIAL_BOT_CHECK_PREVIEW_DEPLOY_ENABLED=true`.
Until credential setup is complete, that job stays disabled. Pull requests do
not receive deployment credentials or publish a Worker.

Set up the `social-bot-check-preview` GitHub environment with:

- Deployment branch: `main` only.
- Secret: `CLOUDFLARE_API_TOKEN`.
- Cloudflare account: `13ebf849f1787412dc2c48a262de0407` (the workflow fixes this
  public account ID; it is not a secret).
- API token permission: **Account → Workers Scripts → Edit**, restricted to
  this account. Version uploads/promotions do not need zone or route permissions.

Create the token in Cloudflare and enter its value directly in GitHub's
environment-secret form. Never put it in source code, chat, command arguments or
Wrangler's saved browser-login file. See
[Cloudflare CI authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

After the secret is configured, enable the repository variable and run the
workflow once on `main`. Subsequent relevant pushes deploy automatically. Each
deployment uploads and promotes the tested version at 100 percent, leaves routes
intact, and verifies the exact published version and metadata. Deployment jobs
are serialized; a run skips if newer Worker files are already on `main`.
Unrelated new posts or cache commits do not discard a valid deployment.

For a local validation without publishing:

```bash
npm run deploy:ci --prefix _code/cloudflare/social-bot-check-preview -- --dry-run
```

Turn off the repository variable to pause automatic deployment. An immediate
code rollback can promote a previous known version with
`wrangler versions deploy PREVIOUS_VERSION_ID@100% --yes`, preserving routing.

## Deployment Record

Deployed October 1, 2026 as `tedt-social-bot-check-preview`, version
`975b9fec-49ac-4f5f-97aa-f8d16e89ca7a`, on the route above. The dashboard confirmed
the current Workers Free plan and the saved **Fail open (proceed)** setting.

Initial validation passed: 13 Worker runtime tests, eight existing provider/analysis
tests, the Jekyll build and six published initial-HTML checks. Live responses
contained the correct pictures for Ted's Bluesky and Mastodon accounts and a
distinct second Bluesky account; absent, missing and invalid accounts retained
the logo. The checker markup/assets and canonical search URL remained intact.

## Add a Provider

Add an entry to `previews` in `src/worker.mjs`, importing the new provider's
existing parser. Supply its public profile endpoint and a validated image/alt
result. Add initial-response and fallback tests in `tests/worker.test.mjs`.
The Worker never fetches posts or calculates bot signals.

See [ADR 0015](../../../docs/adr/0015-add-account-images-to-social-bot-check-previews.md).
