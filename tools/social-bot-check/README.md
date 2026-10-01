# Social Bot Check

Static, browser-based public account analysis for Bluesky and Mastodon. The live
entry point is `/tools/social-bot-check.html`; the Jekyll catalog record is
`_tools/social-bot-check.md` and renders the documentation route.

The tool uses the existing `tools/colors_and_type.css` tokens, native ES modules,
and public APIs. No build step, additional package, plugin, backend, or API key is
required.

## Provider Contract

Register each provider in `providers/index.js`. A provider supplies:

- `id`, `label`, `placeholder`, `example`, `inputHelp`, and documentation `sources`.
- `parse(input)`: validated account lookup parameters; throw a readable error for invalid input.
- `scan(target, { client, limit, signal, progress })`: a public profile, normalized
  posts, and coverage. Use the supplied client so requests are cancellable,
  time-limited, and counted. All requests omit credentials and referrers.

A normalized profile has `id`, `handle`, `name`, `url`, `bio`, `createdAt` (epoch
milliseconds or null), follower/following/post counts, and `declaredBot` (boolean
or null). Use null for missing data; false is an observed value.

Normalized posts include `id`, `authorId`, `text`, `url`, `time` (epoch
milliseconds or null), `isBoost`, `isReply`, `parentId`, `parentAuthorId`, and
optional parent text/link/time. They also include `prompted` (boolean or null),
`delayMs` and `delaySource`, `length` excluding links, `hasMedia`, `hasQuote`,
`hasQuestion`, language/timestamp metadata, and engagement counts. An edited post
that may have changed after creation must not participate in reply timing.

Coverage includes `exhausted`, `pages`, `limit`, `warnings`, `source` (a label and
HTTPS URL for the API actually queried), and the parent lookup
budget when relevant. `exhausted` describes the public API feed, not the complete
account history. The limit counts original posts and replies; boosts are separate
and the provider also enforces a page budget. Pagination must deduplicate IDs and
stop on repeated cursors. Never follow arbitrary API-provided pagination URLs.

`analysis.js` computes the shared behavior checks, platform-specific metadata,
sample coverage, and per-post evidence. The UI distinguishes `flag`, `clear`,
`insufficient`, `unavailable`, and `declared`. Missing platform data must never be
treated as a passing check. Behavior totals are counts, not calibrated probabilities.

## API References

- [Bluesky author feed lexicon](https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/getAuthorFeed.json)
- [Bluesky profile lexicon](https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/actor/getProfile.json)
- [Mastodon account API](https://docs.joinmastodon.org/methods/accounts/)
- [Mastodon status API](https://docs.joinmastodon.org/methods/statuses/)
- [Mastodon account entity](https://docs.joinmastodon.org/entities/Account/)
- [Mastodon status entity](https://docs.joinmastodon.org/entities/Status/)

## Validation

```sh
bundle exec jekyll build
node --test tests/social-bot-check/*.test.mjs
npx playwright test tests/a11y/social-bot-check.spec.ts --reporter=list
```

The browser tests serve the built Jekyll site and stub external API responses.
They cover normalization, pagination, incomplete data, cancellation, hostile HTML,
mobile layout, and accessibility. Live public API checks are separate from these
repeatable fixtures.

## Attribution

Inspired by [Simon Willison’s Bluesky reply bot checker](https://tools.simonwillison.net/bluesky-bot-check),
with an independent implementation and report wording for Ted’s Tools.
