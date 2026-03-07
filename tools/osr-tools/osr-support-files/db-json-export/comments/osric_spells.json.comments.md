# osric_spells.json

- Table: `osric_spells`
- Rows exported: `414`
- Fields detected: `15`

## Referenced In Code
- `htdocs/tool_osric_spells.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `area` | `str` | Area of effect. | (no direct field token match) |
| `casting` | `str` | Casting time. | (no direct field token match) |
| `components` | `str` | Spell components. | (no direct field token match) |
| `description` | `str` | Long-form descriptive text rendered in tool output. | `htdocs/tool_osric_spells.php` |
| `duration` | `str` | Spell duration. | (no direct field token match) |
| `id` | `str` | Primary identifier for the record. | `htdocs/tool_osric_spells.php` |
| `level` | `str` | Level/challenge value used for filtering. | (no direct field token match) |
| `mage` | `str` | Class access marker for arcane caster. | `htdocs/tool_osric_spells.php` |
| `name` | `str` | Display name/title used in UI output. | `htdocs/tool_osric_spells.php` |
| `range` | `str` | Spell range. | (no direct field token match) |
| `refs` | `str` | Reference/source citation. | `htdocs/tool_osric_spells.php` |
| `reverse` | `str` | Reverse-variant indicator/text. | (no direct field token match) |
| `save` | `str` | Saving throw effect. | (no direct field token match) |
| `school` | `str` | Spell school. | `htdocs/tool_osric_spells.php` |
| `type` | `str` | Type/category label. | `htdocs/tool_osric_spells.php` |

## Field Usage By Code Location

### `area`
- No direct code references found in files that mention this table.

### `casting`
- No direct code references found in files that mention this table.

### `components`
- No direct code references found in files that mention this table.

### `description`
- Primary usage pattern: PHP Logic
- `htdocs/tool_osric_spells.php` — In this file, `description` is used to drive PHP calculations and branching.
  - Line 252: `$more = str_replace("font-size: 12pt", "font-size:12pt", "$rary[description]");`

### `duration`
- No direct code references found in files that mention this table.

### `id`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_osric_spells.php` — In this file, `id` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 201: `$v = "spell_" . $ary[id];`
  - Line 249: `$rqry = "SELECT * FROM osric_spells WHERE id=$ary[refs]";`

### `level`
- No direct code references found in files that mention this table.

### `mage`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_osric_spells.php` — In this file, `mage` is used to select values, filter records, and sort results.
  - Line 31: `$res_c = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Cleric' ORDER BY name");`
  - Line 32: `$res_d = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Druid' ORDER BY name");`
  - Line 33: `$res_i = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Illusionist' ORDER BY name");`
  - ... plus 2 additional references in this file

### `name`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_osric_spells.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 31: `$res_c = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Cleric' ORDER BY name");`
  - Line 32: `$res_d = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Druid' ORDER BY name");`
  - Line 33: `$res_i = wa_db_query($connection, "SELECT * FROM osric_spells WHERE mage='Illusionist' ORDER BY name");`
  - ... plus 1 additional references in this file

### `range`
- No direct code references found in files that mention this table.

### `refs`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_osric_spells.php` — In this file, `refs` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 247: `<?php if (($extra > 0) && ($ary[refs] > 0))`
  - Line 249: `$rqry = "SELECT * FROM osric_spells WHERE id=$ary[refs]";`

### `reverse`
- No direct code references found in files that mention this table.

### `save`
- No direct code references found in files that mention this table.

### `school`
- Primary usage pattern: Selection, Filtering
- `htdocs/tool_osric_spells.php` — In this file, `school` is used to select values and filter records.
  - Line 181: `$get3 = "SELECT * FROM osric_spells WHERE school LIKE '%$listing%'";`

### `type`
- Primary usage pattern: Selection, Filtering, Sorting, Grouping
- `htdocs/tool_osric_spells.php` — In this file, `type` is used to select values, filter records, sort results, and group rows.
  - Line 35: `$res_t = wa_db_query($connection, "SELECT * FROM osric_spells WHERE type!='Various' GROUP BY type ORDER BY type");`
  - Line 173: `$get2 = "SELECT * FROM osric_spells WHERE type='$listing'";`

