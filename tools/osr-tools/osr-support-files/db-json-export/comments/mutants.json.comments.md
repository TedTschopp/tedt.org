# mutants.json

- Table: `mutants`
- Rows exported: `127`
- Fields detected: `8`

## Referenced In Code
- `htdocs/functions/traps_post_apocalyptic.php`
- `htdocs/game_urthe.php`
- `htdocs/rpg_scifi.php`
- `htdocs/rpg_urthe.php`
- `htdocs/tool_bmbs.php`
- `htdocs/tool_encounter.php`
- `htdocs/tool_hexcrawl.php`
- `htdocs/tool_lists.php`
- `htdocs/tool_locale.php`
- `htdocs/tool_mtown.php`
- `htdocs/tool_scifim.php`
- `htdocs/tool_uruins.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `attack1` | `str` | Primary attack profile for mutants. | (no direct field token match) |
| `attack2` | `str` | Secondary attack profile for mutants. | (no direct field token match) |
| `fins` | `str` | Aquatic trait marker. | `htdocs/tool_scifim.php` |
| `id` | `str` | Primary identifier for the record. | `htdocs/tool_scifim.php` |
| `legs` | `str` | Leg/locomotion trait marker. | `htdocs/tool_scifim.php` |
| `name` | `str` | Display name/title used in UI output. | (no direct field token match) |
| `slither` | `str` | Slithering locomotion trait marker. | (no direct field token match) |
| `wings` | `str` | Flight trait marker. | (no direct field token match) |

## Field Usage By Code Location

### `attack1`
- No direct code references found in files that mention this table.

### `attack2`
- No direct code references found in files that mention this table.

### `fins`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/tool_scifim.php` — In this file, `fins` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 2333: `$qry4 = "SELECT * FROM mutants WHERE fins=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`
  - Line 3303: `$qry4 = "SELECT * FROM mutants WHERE fins=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`

### `id`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/tool_scifim.php` — In this file, `id` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 2333: `$qry4 = "SELECT * FROM mutants WHERE fins=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`
  - Line 2337: `$qry4 = "SELECT * FROM mutants WHERE legs=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`
  - Line 3303: `$qry4 = "SELECT * FROM mutants WHERE fins=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`
  - ... plus 1 additional references in this file

### `legs`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/tool_scifim.php` — In this file, `legs` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 2337: `$qry4 = "SELECT * FROM mutants WHERE legs=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`
  - Line 3307: `$qry4 = "SELECT * FROM mutants WHERE legs=1 AND id!=$ary[0] ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RA...`

### `name`
- No direct code references found in files that mention this table.

### `slither`
- No direct code references found in files that mention this table.

### `wings`
- No direct code references found in files that mention this table.

