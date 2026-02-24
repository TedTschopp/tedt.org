# geomorphs.json

- Table: `geomorphs`
- Rows exported: `5436`
- Fields detected: `9`

## Referenced In Code
- `htdocs/db.php`
- `htdocs/functions/geomorphs.php`
- `htdocs/functions/map_draw.php`
- `htdocs/functions/map_draw_delves.php`
- `htdocs/help_about.php`
- `htdocs/tool_acity.php`
- `htdocs/tool_delve.php`
- `htdocs/tool_dmap.php`
- `htdocs/tool_ftown.php`
- `htdocs/tool_hexcrawl.php`
- `htdocs/tool_locale.php`
- `htdocs/tool_mtown.php`
- `htdocs/tool_smap.php`
- `htdocs/tool_suburb.php`
- `htdocs/tool_swmp.php`
- `htdocs/tool_ttown.php`
- `htdocs/tool_ultimate.php`
- `htdocs/tool_uruins.php`
- `htdocs/tool_villg.php`
- `htdocs/tool_wtown.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `coord` | `str` | Coordinate/layout encoding used by map renderers. | `htdocs/functions/map_draw.php`<br>`htdocs/functions/map_draw_delves.php` |
| `delve` | `str` | Dungeon/delve grouping code for geomorph records. | `htdocs/functions/map_draw_delves.php` |
| `done` | `str` | Activation flag used to include/exclude map records. | `htdocs/functions/map_draw.php`<br>`htdocs/functions/map_draw_delves.php` |
| `id` | `str` | Primary identifier for the record. | (no direct field token match) |
| `image` | `str` | Image filename used for map/tile rendering. | `htdocs/functions/map_draw.php` |
| `more` | `str` | Secondary coordinate/metadata encoding used by map renderers. | `htdocs/functions/map_draw.php` |
| `spot` | `str` | Placement/slot encoding for geomorph logic. | `htdocs/functions/map_draw.php`<br>`htdocs/functions/map_draw_delves.php` |
| `terrain` | `str` | Terrain/category code used for map tile selection. | `htdocs/functions/map_draw_delves.php` |
| `wayout` | `str` | Exit/connection encoding for geomorph logic. | (no direct field token match) |

## Field Usage By Code Location

### `coord`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/functions/map_draw.php` — In this file, `coord` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 119: `$grids = explode("_", $tile['coord']);`
  - Line 233: `$qry10 = "SELECT * FROM geomorphs WHERE done=1 AND $terra9 AND coord!='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(...`
  - Line 234: `$qry11 = "SELECT * FROM geomorphs WHERE done=1 AND $terra9 AND coord='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND()...`
  - ... plus 1 additional references in this file
- `htdocs/functions/map_draw_delves.php` — In this file, `coord` is used to drive PHP calculations and branching.
  - Line 105: `$grids = explode("_", $tile[coord]);`
  - Line 227: `$grids = explode("_", $tile[coord]);`
  - Line 381: `$grids = explode("_", $tile[coord]);`

### `delve`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/map_draw_delves.php` — In this file, `delve` is used to select values, filter records, and sort results.
  - Line 7: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 10: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tr' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 13: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND spot='bl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - ... plus 6 additional references in this file

### `done`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/map_draw_delves.php` — In this file, `done` is used to select values, filter records, and sort results.
  - Line 7: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 10: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tr' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 13: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND spot='bl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - ... plus 29 additional references in this file
- `htdocs/functions/map_draw.php` — In this file, `done` is used to select values, filter records, and sort results.
  - Line 15: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 18: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tr' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 21: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_b%' AND spot='bl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - ... plus 24 additional references in this file

### `id`
- No direct code references found in files that mention this table.

### `image`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/map_draw.php` — In this file, `image` is used to select values, filter records, and sort results.
  - Line 15: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 18: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tr' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 21: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_b%' AND spot='bl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - ... plus 7 additional references in this file

### `more`
- Primary usage pattern: PHP Logic
- `htdocs/functions/map_draw.php` — In this file, `more` is used to drive PHP calculations and branching.
  - Line 115: `$gridz = explode("_", $tile['more']);`

### `spot`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/map_draw_delves.php` — In this file, `spot` is used to select values, filter records, and sort results.
  - Line 7: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 10: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tr' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 13: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND spot='bl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - ... plus 28 additional references in this file
- `htdocs/functions/map_draw.php` — In this file, `spot` is used to select values, filter records, and sort results.
  - Line 15: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 18: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_c%' AND spot='tr' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - Line 21: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND image LIKE 'dgside_b%' AND spot='bl' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - ... plus 20 additional references in this file

### `terrain`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/map_draw_delves.php` — In this file, `terrain` is used to select values, filter records, and sort results.
  - Line 7: `$qry1 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 10: `$qry2 = "SELECT * FROM geomorphs WHERE done=1 AND spot='tr' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - Line 13: `$qry3 = "SELECT * FROM geomorphs WHERE done=1 AND spot='bl' AND delve!='X' AND terrain='$pix' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), ...`
  - ... plus 15 additional references in this file

### `wayout`
- No direct code references found in files that mention this table.

