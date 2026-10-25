# Mastodon legacy-history review — October 25, 2026

The ten unmatched cache keys contain sixteen URL references representing fifteen
unique Mastodon statuses. Public API checks found fourteen confirmed 404s and one
public status owned by `@Ted@tschopp.net`. The checked IDs and responses are
recorded in `_data/mastodon_legacy_review.json` with the review timestamp.

Seven keys can be associated with current canonical documents using existing
status IDs and Git rename records. Their eight distinct statuses all return 404.
The reviewed aliases preserve that history for the current articles; the normal
serialized publisher retains responsibility for duplicate checks and eventual
replacement. Receipts, queue priority, and publication generations stay intact.

Three records remain in `unmatched_legacy`: two removed publications and one
ambiguous shared key. All ten records have been reviewed. The original
`cache/jsonfeed-to-mastodon.json` is unchanged.

| Legacy key | Result | Evidence and action |
| --- | --- | --- |
| `/Critique-Content/` | Mapped to `https://ai.tedt.org/prompts/academic-critique-content/` | The current front-matter ID matches one cached status; [commit f1333cff0](https://github.com/TedTschopp/tedt.org/commit/f1333cff0) records the 99-percent source rename. Export the exact reviewed alias. |
| Long “Project Stargate Unveiled” title | Mapped to `/Project-Stargate-Unveiled/` | The exact cached ID matches current post front matter. Deduplicate the two URL representations of that ID. |
| `/Swiss-Folklore/:title:output_ext/` | Ambiguous; retained | A literal permalink template combined multiple stories. Five cached IDs are mixed across nine current story entries. All five statuses return 404, leaving no live post content to distinguish the destinations. Keep the shared record outside automatic remapping. |
| `/2025-10-20-From-Guesswork-to-Geometry-How-We-Measured-the-Mind/` | Mapped to `/From-Guesswork-to-Geometry-How-We-Measured-the-Mind/` | [Commit 6644a9969](https://github.com/TedTschopp/tedt.org/commit/6644a9969) records the source date/filename rename from October 20 to October 19. |
| `/2025-11-13-The-Intelligence-Inversion/` | Mapped to `/Winning-the-Intelligence-Inversion/` | [Commit 17af111f3](https://github.com/TedTschopp/tedt.org/commit/17af111f3) records the source rename. |
| `/2026-01-16-The-Death-of-Software/` | Mapped to `/Reprint-The-Death-of-Software/` | [Commit f8058a2cd](https://github.com/TedTschopp/tedt.org/commit/f8058a2cd) records the source rename adding `Reprint`. |
| `/Image-Tools-Design-and-Security/` | Removed publication; retained | [Commit 459a7dd6d](https://github.com/TedTschopp/tedt.org/commit/459a7dd6d) deletes the source. No current equivalent was established. Keep the old history without adding an article or queue entry. |
| `/The-Death-of-Software/` | Mapped to `/Reprint-The-Death-of-Software/` | The undated title-slug form belongs to the same renamed source as the dated key. |
| `/The-Harness-Around-the-Voice/` | Mapped to `/Why-AI-Needs-a-Harness/` | [Commit 95357e86d](https://github.com/TedTschopp/tedt.org/commit/95357e86d) records a 100-percent source rename. |
| `/TheOneRing-com-Legacy-Archive/` | Removed publication; live link repaired | [Commit cebefa838](https://github.com/TedTschopp/tedt.org/commit/cebefa838) deletes the introductory post. [Status 116868054336649343](https://tschopp.net/@Ted/116868054336649343) remains public and points to the old URL. The existing redirect plugin forwards that URL to the current `/TheOneRing-LegacyArchive/` landing page. The deleted post is not recreated or requeued. |

## Application and verification

`_code/mastodon_manifest.rb` exports mapped aliases from the review registry.
`prepare_ledger` retries previously unmatched keys against the exact alias index.
Only a unique eligible canonical match receives the existing references. This
operation preserves receipt history and existing published status selections.
Removed targets and ambiguous aliases remain unmatched.

Regression coverage exercises later alias resolution, competing destinations,
and preservation of an existing publication receipt and generation. The build
check also verifies each mapped source/canonical pair and the archive forwarding
page. Review commands create no Mastodon statuses and change no remote history.

## HTMLProofer findings during this review

The installed HTMLProofer is 5.2.2. Its supported API replaces the retired
`--check-html` option. The shared runner uses an absolute output root and resolves
root-relative directory URLs to their index files, matching GitHub Pages. This
avoids five false missing-anchor reports caused by `/profile.html` shadowing
`/profile/index.html`. The profile disclosure heading already exists.

The protocol-relative author avatar in the AI Value Stream post and its source
template now uses explicit HTTPS. Forty-two historical external HTTP references
remain visible under HTMLProofer's HTTPS policy. They are separate from missing
internal files and anchors. The strict scan returns nonzero for those findings;
CI retains the existing advisory treatment and publishes the actual scan output.
The fixture checks are blocking and verify both successes and real failures.
