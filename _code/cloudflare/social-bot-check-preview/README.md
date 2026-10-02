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
  `fallback` for an account link, allowing direct deployment verification.

There is no login to social sites, database, image proxy, or paid storage. Social
sites may cache a preview longer than this Worker's profile cache.

## Test and Deploy

Use Node 22 or later, from the repository root:

```bash
npm ci --prefix _code/cloudflare/social-bot-check-preview
npm test --prefix _code/cloudflare/social-bot-check-preview
bundle exec jekyll build
```

Tests package the production entry point with Wrangler, then execute that bundle
and its real HTMLRewriter in Miniflare. All outbound requests use test fixtures;
the tests make no live account requests. The package is under `_code/` and is not
part of Jekyll's public output.

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

Verify initial HTML with an HTTP client, not just a browser's changed DOM:

```bash
curl -sS 'https://tedt.org/tools/social-bot-check.html?platform=bluesky&user=tedt.org&limit=100'
curl -sS 'https://tedt.org/tools/social-bot-check.html?platform=mastodon&user=%40Ted%40tschopp.net&limit=100'
curl -sS 'https://tedt.org/tools/social-bot-check.html'
```

The first two responses should contain the respective public account avatar in
both image tags. The third should retain `https://tedt.org/img/Site-Logo.webp`.
Also verify an account without a picture and the functioning checker UI.

Rollback by removing just this Worker's route in Cloudflare. The underlying
GitHub Pages page continues to work with the default sharing image.

## Deployment Record

Deployed October 1, 2026 as `tedt-social-bot-check-preview`, version
`975b9fec-49ac-4f5f-97aa-f8d16e89ca7a`, on the route above. The dashboard confirmed
the current Workers Free plan and the saved **Fail open (proceed)** setting.

Validation passed: 13 Worker runtime tests, eight existing provider/analysis
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
