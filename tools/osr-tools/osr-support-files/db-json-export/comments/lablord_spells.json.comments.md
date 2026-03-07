# lablord_spells.json

- Table: `lablord_spells`
- Rows exported: `161`
- Fields detected: `10`

## Referenced In Code
- `htdocs/tool_ladvg.php`
- `htdocs/tool_llb_spells.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `ls_class` | `str` | Class/category that can use the spell. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |
| `ls_duration` | `str` | Spell duration text. | (no direct field token match) |
| `ls_id` | `str` | Spell record identifier. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |
| `ls_level` | `str` | Spell level. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |
| `ls_name` | `str` | Spell name. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |
| `ls_range` | `str` | Spell range text. | (no direct field token match) |
| `ls_ref` | `str` | Reference/source citation. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |
| `ls_reverse` | `str` | Reverse-variant indicator/text. | (no direct field token match) |
| `ls_rules` | `str` | Ruleset/source system marker. | `htdocs/tool_ladvg.php` |
| `ls_text` | `str` | Spell effect/description body. | `htdocs/tool_ladvg.php`<br>`htdocs/tool_llb_spells.php` |

## Field Usage By Code Location

### `ls_class`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_llb_spells.php` — In this file, `ls_class` is used to select values, filter records, and sort results.
  - Line 31: `$res_c = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Cleric' ORDER BY ls_name");`
  - Line 32: `$res_m = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Mage' ORDER BY ls_name");`
  - Line 33: `$res_e = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Mage' AND ls_level<6 ORDER BY ls_name");`
- `htdocs/tool_ladvg.php` — In this file, `ls_class` is used to select values, filter records, and sort results.
  - Line 343: `$qry = wa_db_query($connection, "SELECT * FROM $database.lablord_spells WHERE ls_rules='Basic' AND ls_class='$spell_caster_class' AND ls_level<($maximum_spell_level_fo...`

### `ls_duration`
- No direct code references found in files that mention this table.

### `ls_id`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_llb_spells.php` — In this file, `ls_id` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 170: `$v = "spell_" . $ary[ls_id];`
  - Line 205: `$rqry = "SELECT * FROM lablord_spells WHERE ls_id=$ary[ls_ref]";`
- `htdocs/tool_ladvg.php` — In this file, `ls_id` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 374: `$rqry = "SELECT * FROM lablord_spells WHERE ls_id=$ary[ls_ref]";`

### `ls_level`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_ladvg.php` — In this file, `ls_level` is used to select values, filter records, and sort results.
  - Line 343: `$qry = wa_db_query($connection, "SELECT * FROM $database.lablord_spells WHERE ls_rules='Basic' AND ls_class='$spell_caster_class' AND ls_level<($maximum_spell_level_fo...`
- `htdocs/tool_llb_spells.php` — In this file, `ls_level` is used to select values, filter records, and sort results.
  - Line 33: `$res_e = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Mage' AND ls_level<6 ORDER BY ls_name");`

### `ls_name`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_llb_spells.php` — In this file, `ls_name` is used to select values, filter records, and sort results.
  - Line 31: `$res_c = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Cleric' ORDER BY ls_name");`
  - Line 32: `$res_m = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Mage' ORDER BY ls_name");`
  - Line 33: `$res_e = wa_db_query($connection, "SELECT * FROM lablord_spells WHERE ls_class='Mage' AND ls_level<6 ORDER BY ls_name");`
- `htdocs/tool_ladvg.php` — In this file, `ls_name` is used to select values, filter records, and sort results.
  - Line 343: `$qry = wa_db_query($connection, "SELECT * FROM $database.lablord_spells WHERE ls_rules='Basic' AND ls_class='$spell_caster_class' AND ls_level<($maximum_spell_level_fo...`

### `ls_range`
- No direct code references found in files that mention this table.

### `ls_ref`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_ladvg.php` — In this file, `ls_ref` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 372: `if ($ary[ls_ref] > 0)`
  - Line 374: `$rqry = "SELECT * FROM lablord_spells WHERE ls_id=$ary[ls_ref]";`
- `htdocs/tool_llb_spells.php` — In this file, `ls_ref` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 203: `if (($extra > 0) && ($ary[ls_ref] > 0))`
  - Line 205: `$rqry = "SELECT * FROM lablord_spells WHERE ls_id=$ary[ls_ref]";`

### `ls_reverse`
- No direct code references found in files that mention this table.

### `ls_rules`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_ladvg.php` — In this file, `ls_rules` is used to select values, filter records, and sort results.
  - Line 343: `$qry = wa_db_query($connection, "SELECT * FROM $database.lablord_spells WHERE ls_rules='Basic' AND ls_class='$spell_caster_class' AND ls_level<($maximum_spell_level_fo...`

### `ls_text`
- Primary usage pattern: PHP Logic
- `htdocs/tool_ladvg.php` — In this file, `ls_text` is used to drive PHP calculations and branching.
  - Line 367: `$notes = str_replace("\n", "<br>", $ary[ls_text]);`
  - Line 377: `$more = str_replace("\n", "<br>", $rary[ls_text]);`
- `htdocs/tool_llb_spells.php` — In this file, `ls_text` is used to drive PHP calculations and branching.
  - Line 198: `$notes = str_replace("\n", "<br>", $ary[ls_text]);`
  - Line 208: `$more = str_replace("\n", "<br>", $rary[ls_text]);`

