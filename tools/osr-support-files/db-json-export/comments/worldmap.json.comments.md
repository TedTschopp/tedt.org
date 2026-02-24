# worldmap.json

- Table: `worldmap`
- Rows exported: `88`
- Fields detected: `5`

## Referenced In Code
- `htdocs/functions/hex_map.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `lm_amount` | `str` | Weight/duplication amount for random selection. | `htdocs/functions/hex_map.php` |
| `lm_category` | `str` | World map category bucket. | `htdocs/functions/hex_map.php` |
| `lm_done` | `str` | Activation flag used for world map tile pools. | `htdocs/functions/hex_map.php` |
| `lm_hexes` | `str` | Encoded tile composition string for world hex rendering. | `htdocs/functions/hex_map.php` |
| `lm_id` | `str` | World map record identifier. | (no direct field token match) |

## Field Usage By Code Location

### `lm_amount`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/functions/hex_map.php` — In this file, `lm_amount` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 9: `$sqry = "SELECT * FROM worldmap WHERE lm_amount>1 AND lm_done=1";`
  - Line 12: `$my_amounts = $sary['lm_amount']-1;`

### `lm_category`
- Primary usage pattern: Population, PHP Logic
- `htdocs/functions/hex_map.php` — In this file, `lm_category` is used to populate temporary or derived tables and drive PHP calculations and branching.
  - Line 14: `$aqry = "INSERT INTO $tablez (lm_category, lm_hexes) VALUES ('" . $sary['lm_category'] . "', '" . $sary['lm_hexes'] . "')";`

### `lm_done`
- Primary usage pattern: Selection, Filtering
- `htdocs/functions/hex_map.php` — In this file, `lm_done` is used to select values and filter records.
  - Line 7: `$tqry = "CREATE TEMPORARY TABLE $tablez SELECT * FROM worldmap WHERE lm_done=1";`
  - Line 9: `$sqry = "SELECT * FROM worldmap WHERE lm_amount>1 AND lm_done=1";`

### `lm_hexes`
- Primary usage pattern: Population, PHP Logic
- `htdocs/functions/hex_map.php` — In this file, `lm_hexes` is used to populate temporary or derived tables and drive PHP calculations and branching.
  - Line 14: `$aqry = "INSERT INTO $tablez (lm_category, lm_hexes) VALUES ('" . $sary['lm_category'] . "', '" . $sary['lm_hexes'] . "')";`
  - Line 480: `$l__hex = explode("_", $ary['lm_hexes']);`

### `lm_id`
- No direct code references found in files that mention this table.

