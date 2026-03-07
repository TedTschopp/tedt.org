# store_items.json

- Table: `store_items`
- Rows exported: `1876`
- Fields detected: `9`

## Referenced In Code
- `htdocs/functions/city_fantasy.php`
- `htdocs/functions/city_gn.php`
- `htdocs/functions/city_post_apocalyptic.php`
- `htdocs/functions/city_tt.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `cost` | `str` | Cost/value text. | (no direct field token match) |
| `era` | `str` | Era filter marker. | `htdocs/functions/city_fantasy.php` |
| `game` | `str` | Ruleset/game filter marker. | `htdocs/functions/city_fantasy.php`<br>`htdocs/functions/city_gn.php`<br>`htdocs/functions/city_tt.php` |
| `id` | `str` | Primary identifier for the record. | (no direct field token match) |
| `item` | `str` | Store item name/text. | `htdocs/functions/city_fantasy.php`<br>`htdocs/functions/city_gn.php`<br>`htdocs/functions/city_post_apocalyptic.php`<br>`htdocs/functions/city_tt.php` |
| `note1` | `str` | Auxiliary note field 1. | `htdocs/functions/city_tt.php` |
| `note2` | `str` | Auxiliary note field 2. | (no direct field token match) |
| `qty` | `str` | Quantity expression/range. | (no direct field token match) |
| `store` | `str` | Store/category code used for item pools. | `htdocs/functions/city_fantasy.php`<br>`htdocs/functions/city_gn.php`<br>`htdocs/functions/city_post_apocalyptic.php`<br>`htdocs/functions/city_tt.php` |

## Field Usage By Code Location

### `cost`
- No direct code references found in files that mention this table.

### `era`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/city_fantasy.php` — In this file, `era` is used to select values, filter records, and sort results.
  - Line 677: `if ($type == 99){$qry = "SELECT * FROM store_items WHERE game='DD' AND store='Priest' and era<=$stock ORDER BY item"; $stock = 100;}`

### `game`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/city_fantasy.php` — In this file, `game` is used to select values, filter records, and sort results.
  - Line 677: `if ($type == 99){$qry = "SELECT * FROM store_items WHERE game='DD' AND store='Priest' and era<=$stock ORDER BY item"; $stock = 100;}`
  - Line 678: `else {$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";}`
- `htdocs/functions/city_gn.php` — In this file, `game` is used to select values, filter records, and sort results.
  - Line 678: `$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";`
- `htdocs/functions/city_tt.php` — In this file, `game` is used to select values, filter records, and sort results.
  - Line 774: `$qry = "SELECT * FROM store_items WHERE game='TT' $mgmd $store $no_boats ORDER BY note1, item";`

### `id`
- No direct code references found in files that mention this table.

### `item`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/functions/city_fantasy.php` — In this file, `item` is used to select values, filter records, and sort results.
  - Line 677: `if ($type == 99){$qry = "SELECT * FROM store_items WHERE game='DD' AND store='Priest' and era<=$stock ORDER BY item"; $stock = 100;}`
  - Line 678: `else {$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";}`
- `htdocs/functions/city_post_apocalyptic.php` — In this file, `item` is used to select values, sort results, and drive PHP calculations and branching.
  - Line 584: `$qry = "SELECT * FROM store_items $goods $section $store ORDER BY item";`
  - Line 587: `if ((mt_rand(1,100) <= $stock) \|\| ($ary[item] == "Cloning Tube (Cloning Services)"))`
- `htdocs/functions/city_gn.php` — In this file, `item` is used to select values, filter records, and sort results.
  - Line 678: `$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";`
- `htdocs/functions/city_tt.php` — In this file, `item` is used to select values, filter records, and sort results.
  - Line 774: `$qry = "SELECT * FROM store_items WHERE game='TT' $mgmd $store $no_boats ORDER BY note1, item";`

### `note1`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/city_tt.php` — In this file, `note1` is used to select values, filter records, and sort results.
  - Line 774: `$qry = "SELECT * FROM store_items WHERE game='TT' $mgmd $store $no_boats ORDER BY note1, item";`

### `note2`
- No direct code references found in files that mention this table.

### `qty`
- No direct code references found in files that mention this table.

### `store`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/city_fantasy.php` — In this file, `store` is used to select values, filter records, and sort results.
  - Line 677: `if ($type == 99){$qry = "SELECT * FROM store_items WHERE game='DD' AND store='Priest' and era<=$stock ORDER BY item"; $stock = 100;}`
  - Line 678: `else {$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";}`
- `htdocs/functions/city_gn.php` — In this file, `store` is used to select values, filter records, and sort results.
  - Line 678: `$qry = "SELECT * FROM store_items WHERE game='DD' $store ORDER BY item";`
- `htdocs/functions/city_post_apocalyptic.php` — In this file, `store` is used to select values and sort results.
  - Line 584: `$qry = "SELECT * FROM store_items $goods $section $store ORDER BY item";`
- `htdocs/functions/city_tt.php` — In this file, `store` is used to select values, filter records, and sort results.
  - Line 774: `$qry = "SELECT * FROM store_items WHERE game='TT' $mgmd $store $no_boats ORDER BY note1, item";`

