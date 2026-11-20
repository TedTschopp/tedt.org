# Folklore promotion and legacy addresses

Swiss folklore translations live at https://folklore.tschopp.org/. TedT.org keeps
its existing homepage folklore column as an outward reading invitation.

`_data/featured_folklore.json` is the approved snapshot of 99 distinct published
stories. Each entry has an English title, canonical destination, teaser, and its
own reviewed wordless illustration with four responsive WebP sizes. The private
Swiss Folklore authoring repository retains the masters and reviews; its
`scripts/export_featured_folklore.py` verifies them and exports matching manifests
to both sites. This does not clear held stories or change translations.

`_includes/homepage/featured-folklore.html` renders three real links in HTML.
`assets/js/featured-folklore.js` samples three unique entries once per page load,
updating the entire card together. It does not rotate stories while reading or
fetch a remote catalogue. With JavaScript disabled, the first three links remain.
Only the displayed cards load images.

The local Folklore category and eleven translation posts have been retired.
`_data/folklore/migration.json` inventories their former addresses, aliases,
verified discussion references, and direct destinations. The existing Cloudflare
domain router in the folklore repository supplies permanent HTTP redirects;
noindex HTML fallbacks also retain canonical links and the Webmention endpoint.
Older collection routes resolve to the current English URLs without extra hops.

The old Betten Dog article contains the Weatherman telling, so both old article
URLs lead to that text. A Beginning remains original fiction on TedT.org, without
the Folklore category. House of the Blood Comet remains a byte-identical embeddable
fragment at `/stories/house-of-the-blood-comet.html`, with its old address redirected.
Original fiction and RPG posts are not part of the 99-story promotion pool.

Verify with `make build`, `bundle exec ruby tests/check_folklore_archive.rb _site`,
`node --test tests/featured-folklore.test.mjs`, and
`FOLKLORE_BUILD=/path/to/folklore/_site node tests/featured-folklore-browser.mjs`.
The browser check also accepts a live site URL as its first argument. Run the
shared header and analytics checks when their integration data changes.
