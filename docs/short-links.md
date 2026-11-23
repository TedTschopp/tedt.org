# Short links

Open [Create short link](https://github.com/TedTschopp/tedt.org/actions/workflows/short-links.yml)
in GitHub Actions and select **Run workflow** on `main`. Paste the full HTTPS
destination. Leave **code** blank for an automatically generated eight-character
code, or enter eight lowercase letters or digits. Subdomains of tedt.org and
tschopp.org are supported. The destination's query string and fragment are kept.

Copy the short URL from the run summary. The link starts resolving when
[Site Quality + Deploy](https://github.com/TedTschopp/tedt.org/actions/workflows/deploy.yml)
publishes the updated site. Running the workflow again with the same destination
and a blank code reuses the existing link.

To add a link locally from the repository root, run:

```sh
node _code/short-links/cli.mjs add 'https://tedt.org/about/'
```

To change or remove a link, edit [the registry](../_data/short_links.json) and
publish the change through the normal repository workflow. Git and the deployed
site contain the full URLs. Use public destinations.

## Hosting

The existing GitHub Pages build makes a browser redirect at `/s/<code>/` and a
small JSON destination record at `/assets/short-links/<code>.json`. The Cloudflare
Worker uses the record to serve an HTTP 302 directly at `/s/<code>`. GitHub Pages
handles missing links and supplies the browser redirect if the lookup fails.
New links use the existing Pages workflow and require no Worker redeploy.

To deploy the Worker itself, use Wrangler from the repository root:

```sh
npx wrangler deploy --config _code/short-links/wrangler.jsonc
```

Use **Fail open** on the `https://tedt.org/s/*` route so Pages can serve links
if the Worker reaches its daily allowance. The build needs no Cloudflare token,
database, or storage service. See [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/#daily-requests).

Verify a registered link and an unknown code with `curl -I`:

```sh
curl -I https://tedt.org/s/tedthome
curl -I https://tedt.org/s/missing0
```
