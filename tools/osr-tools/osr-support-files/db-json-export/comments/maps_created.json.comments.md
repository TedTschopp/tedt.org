# maps_created.json

- Table: `maps_created`
- Rows exported: `12`
- Fields detected: `5`

## Referenced In Code
- `htdocs/functions/geomorphs.php`
- `htdocs/map_window.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `mc_code` | `str` | Unique map code used to retrieve generated maps. | `htdocs/functions/geomorphs.php`<br>`htdocs/map_window.php` |
| `mc_date` | `str` | Map creation timestamp. | `htdocs/functions/geomorphs.php` |
| `mc_id` | `str` | Identifier field. | (no direct field token match) |
| `mc_layout` | `str` | Serialized map layout payload. | `htdocs/functions/geomorphs.php`<br>`htdocs/map_window.php` |
| `mc_type` | `str` | Map/tool type discriminator. | `htdocs/functions/geomorphs.php` |

## Field Usage By Code Location

### `mc_code`
- Primary usage pattern: Selection, Filtering, Population
- `htdocs/functions/geomorphs.php` — In this file, `mc_code` is used to select values, filter records, and populate temporary or derived tables.
  - Line 32: `$qry = wa_db_query( $connection, "SELECT * FROM maps_created WHERE mc_code='$code'");`
  - Line 38: `wa_db_query( $connection, "INSERT INTO maps_created (mc_code, mc_type, mc_layout, mc_date) VALUES ('$code', '$type', '$map', CURRENT_DATE)");`
- `htdocs/map_window.php` — In this file, `mc_code` is used to select values and filter records.
  - Line 15: `$qry = wa_db_query( $connection, "SELECT * FROM maps_created WHERE mc_code='$code'");`

### `mc_date`
- Primary usage pattern: Filtering, Population, Deletes
- `htdocs/functions/geomorphs.php` — In this file, `mc_date` is used to filter records, populate temporary or derived tables, and apply delete criteria.
  - Line 18: `$clean = wa_db_query( $connection, "DELETE FROM maps_created WHERE (TO_DAYS(CURRENT_DATE)-3) > TO_DAYS(mc_date)");`
  - Line 38: `wa_db_query( $connection, "INSERT INTO maps_created (mc_code, mc_type, mc_layout, mc_date) VALUES ('$code', '$type', '$map', CURRENT_DATE)");`

### `mc_id`
- No direct code references found in files that mention this table.

### `mc_layout`
- Primary usage pattern: Population, PHP Logic
- `htdocs/functions/geomorphs.php` — In this file, `mc_layout` is used to populate temporary or derived tables.
  - Line 38: `wa_db_query( $connection, "INSERT INTO maps_created (mc_code, mc_type, mc_layout, mc_date) VALUES ('$code', '$type', '$map', CURRENT_DATE)");`
- `htdocs/map_window.php` — In this file, `mc_layout` is used to drive PHP calculations and branching.
  - Line 19: `$drawing = explode("\|", $ary['mc_layout']);`

### `mc_type`
- Primary usage pattern: Population
- `htdocs/functions/geomorphs.php` — In this file, `mc_type` is used to populate temporary or derived tables.
  - Line 38: `wa_db_query( $connection, "INSERT INTO maps_created (mc_code, mc_type, mc_layout, mc_date) VALUES ('$code', '$type', '$map', CURRENT_DATE)");`

