# Gamma World Content Management Tools

This directory houses scripts and utilities for exporting, auditing, and re-importing the Gamma World (and related MCC / Bestiary) Markdown posts located under `_posts/Gamma World/`.

## Overview

These tools enable a round‑trip workflow:
1. Export every post's YAML front matter plus Markdown body to a normalized CSV.
2. Edit the CSV in a spreadsheet (Google Sheets / Excel).
3. Re-import changes: front matter keys (dynamic) and body content are applied back to the originating Markdown files with backups.
4. Diff two export snapshots to understand content drift before applying imports.
5. (Safety) Normalize any posts missing a closing YAML delimiter.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `export_gamma_world_to_csv.py` | Produce a timestamped CSV (and metadata JSON) containing all discovered front matter keys + body. |
| `import_gamma_world_from_csv.py` | Apply CSV edits back to Markdown files (dynamic fields, list/dict handling, body checksum). |
| `diff_gamma_world_exports.py` | Compare two CSV snapshots: added / removed posts and field-level changes. |
| `close_unterminated_front_matter.py` | Detect & close YAML front matter blocks missing a terminating `---`. |
| `requirements.txt` | Python dependencies (PyYAML). |

## Export Details

Running:

```bash
python _code/gamma_world/export_gamma_world_to_csv.py
```
Generates: `_data-to-be-developed/Gamma World Import-Export/gamma_world_export_YYYYMMDD_HHMMSS.csv` and matching `.meta.json` with:

* `row_count` (posts exported)
* `column_count` (unique front matter keys + body)
* `columns` (ordered header list)
* `sha256` checksum for integrity

List & dict serialization:

* Lists (e.g., `categories`, `tags`) become pipe-delimited: `Gamma World|Bestiary`.
* Dict / list nested structures serialize to JSON text. Edit cautiously; malformed JSON will be imported as a raw string.

## Import Details
```bash
python _code/gamma_world/import_gamma_world_from_csv.py path/to/export.csv
```
Behavior:

* Matches posts by `filename` column.
* Any column (except `filename`) updates/sets that front matter key.
* Empty cell removes key (except `title` and `date`, which are left blank if cleared).
* `categories` / `tags` pipe-split back into arrays.
* Body replaced if `body` column non-empty.
* Adds `_export_body_sha` (first 12 chars of SHA256) to front matter for quick body change detection.
* Writes one backup per touched file: `<name>.md.bak` (created if missing).
* Generates `_data-to-be-developed/Gamma World Import-Export/last_import_summary.json` with counts.

## Diffing Snapshots
```bash
python _code/gamma_world/diff_gamma_world_exports.py --old older.csv --new newer.csv [--limit 40]
```
Reports:

* Added / removed filenames.
* Field-level changes (string comparison) with optional limit (0 = unlimited).

Make targets (top-level `Makefile`):
```bash
make gw-export          # export (timestamped)
make gw-diff A=old.csv B=new.csv
```
`A` and `B` can be relative or absolute; if relative and not found, prepend `_data-to-be-developed/Gamma World Import-Export/` manually.

## YAML Safety / Normalization
Use before heavy editing if you suspect malformed front matter:

```bash
python _code/gamma_world/close_unterminated_front_matter.py --dry-run
python _code/gamma_world/close_unterminated_front_matter.py
```

## Design Notes

* Dynamic schema discovery: Every run re-scans all posts to assemble the union of front matter keys, ensuring newly added keys appear automatically.
* No placeholder content inserted: posts lacking valid front matter are skipped silently (or warned during import).
* Performance: Single pass over posts; acceptable for current scale (< 1k files).
* Integrity: Meta JSON + SHA256 support reproducibility and diff friendliness.
* Extensibility: Add additional transformation or validation scripts here, keeping naming consistent (`snake_case` verbs: `audit_`, `validate_`, `refresh_`).

## Future Ideas

* Validation script for required keys (title, date, categories) with severity levels.
* `--changed-only` export variant comparing against last snapshot.
* Automated regeneration of a catalog index page from export data.
* Git pre-commit hook to block malformed front matter.

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Missing columns in new export | Added a key after exporting | Re-run export; schema auto-updates |
| Import skips a file | Unterminated or malformed YAML | Run `close_unterminated_front_matter.py` or inspect manually |
| List field imported as single string | Forgot pipe delimiter | Edit cell using two values separated by a single pipe |
| JSON dict lost structure | Edited and broke JSON syntax | Fix JSON; re-import |

\n## Environment
Create (if not already):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r _code/gamma_world/requirements.txt
```

\n## License / Attribution
Scripts inherit repository license. Keep changes atomic and document any new flags in this README.
