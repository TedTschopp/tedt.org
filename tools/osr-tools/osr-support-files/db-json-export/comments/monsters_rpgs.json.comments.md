# monsters_rpgs.json

- Table: `monsters_rpgs`
- Rows exported: `4038`
- Fields detected: `45`

## Referenced In Code
- `htdocs/data_magestykc_run.php`
- `htdocs/functions/monster.php`
- `htdocs/functions/monsters.php`
- `htdocs/functions/monsters_add.php`
- `htdocs/tool_bmbs.php`
- `htdocs/tool_delve.php`
- `htdocs/tool_door.php`
- `htdocs/tool_encounter.php`
- `htdocs/tool_hexcrawl.php`
- `htdocs/tool_lists.php`
- `htdocs/tool_locale.php`
- `htdocs/tool_uexfl.php`
- `htdocs/tool_ultimate.php`
- `htdocs/tool_uruins.php`
- `htdocs/tool_wander.php`

## Field Dictionary

| Field          | Observed Type(s) | Description                                         | Referenced In                                                                                                                                                                                                                                                                                                                                      |
|----------------|------------------|-----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ac`           | `str`            | Armor class / defense value.                        | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `al`           | `str`            | Alignment value.                                    | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `atk`          | `str`            | Attack profile text.                                | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `bravery`      | `null / str`     | Bravery/morale metadata.                            | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `creator`      | `str`            | Source/ruleset creator code for monster data.       | `htdocs/data_magestykc_run.php`<br>`htdocs/functions/monster.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_uruins.php`                                                                                                                                     |
| `description`  | `str`            | Long-form descriptive text rendered in tool output. | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `difficulty`   | `str`            | Difficulty marker.                                  | `htdocs/functions/monster.php`<br>`htdocs/tool_bmbs.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`<br>`htdocs/tool_wander.php` |
| `dmg`          | `str`            | Damage profile text.                                | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `enc`          | `str`            | Encounter grouping marker.                          | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `freq`         | `str`            | Frequency text label.                               | `htdocs/tool_bmbs.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_lists.php`                                                                                                                                                                                                                                                                        |
| `freq_code`    | `str`            | Numeric frequency code used for weighting logic.    | `htdocs/tool_bmbs.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_wander.php`                                                                                                                                                    |
| `hd`           | `null / str`     | Hit dice / power band value.                        | `htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_uruins.php`                                                                                                                                                                            |
| `id`           | `str`            | Primary identifier for the record.                  | `htdocs/tool_bmbs.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`<br>`htdocs/tool_wander.php`                                                              |
| `iq`           | `str`            | Intelligence profile.                               | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `lair`         | `null / str`     | Lair chance/metadata.                               | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `level`        | `str`            | Level/challenge value used for filtering.           | `htdocs/functions/monster.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_wander.php`                                                                                                                                                                                                                                                              |
| `location`     | `str`            | Environment/location tag used in filtering.         | `htdocs/data_magestykc_run.php`<br>`htdocs/functions/monsters.php`<br>`htdocs/tool_bmbs.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`<br>`htdocs/tool_wander.php`                       |
| `loot`         | `null / str`     | Loot metadata used by loot/scavenge tools.          | `htdocs/data_magestykc_run.php`                                                                                                                                                                                                                                                                                                                    |
| `m_app_max`    | `str`            | Maximum appearance count for generated encounters.  | `htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                          |
| `m_app_min`    | `str`            | Minimum appearance count for generated encounters.  | `htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                          |
| `m_fort`       | `str`            | Fortification chance/value for lair generation.     | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `m_fort_name`  | `str`            | Fortification label/name.                           | `htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`                                                                                                                                                                                                                                                                                             |
| `m_hoard`      | `str`            | Hoard chance/value used by generator logic.         | `htdocs/tool_delve.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                                                                                    |
| `m_hp_max`     | `str`            | Maximum HP range value.                             | `htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`                                                                                                                                              |
| `m_hp_min`     | `str`            | Minimum HP range value.                             | `htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`                                                                                                                   |
| `m_hp_mod`     | `null / str`     | HP modifier applied during generation.              | `htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                          |
| `m_lair`       | `str`            | Lair chance/value used by generator logic.          | `htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`                                                                                                                                                                                                                                                                                             |
| `m_myname`     | `str`            | Alternate/custom display name.                      | `htdocs/tool_delve.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                                                                                                                                              |
| `m_no_dungeon` | `str`            | Flag controlling dungeon eligibility.               | `htdocs/tool_bmbs.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_ultimate.php`                                                                                                                                                                                |
| `m_trap`       | `str`            | Trap chance/value used by generator logic.          | `htdocs/functions/monster.php`                                                                                                                                                                                                                                                                                                                     |
| `move`         | `str`            | Movement value.                                     | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `mr`           | `str`            | Magic resistance profile text.                      | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `name`         | `str`            | Display name/title used in UI output.               | `htdocs/data_magestykc_run.php`<br>`htdocs/functions/monsters.php`<br>`htdocs/functions/monsters_add.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`                                    |
| `salvage`      | `null / str`     | Salvage metadata for post-apocalyptic tools.        | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `size`         | `str`            | Size category.                                      | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `spatk`        | `str`            | Special attack text.                                | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `spdef`        | `str`            | Special defense text.                               | `htdocs/data_magestykc_run.php`                                                                                                                                                                                                                                                                                                                    |
| `swimmer`      | `str`            | Water/swimming capability marker.                   | `htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`                                                                                                                                                                                                                                                                                             |
| `thaco`        | `str`            | THAC0/combat target number.                         | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `treasure`     | `null / str`     | Treasure class/text metadata.                       | `htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                                                            |
| `turn`         | `str`            | Turn resistance profile text.                       | `htdocs/tool_hexcrawl.php`<br>`htdocs/tool_locale.php`                                                                                                                                                                                                                                                                                             |
| `type`         | `str`            | Type/category label.                                | `htdocs/functions/monster.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_uruins.php`                                                                                                                                                                                                                              |
| `underground`  | `str`            | Underground/dungeon suitability marker.             | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `weapons`      | `str`            | Weapon metadata used in output text.                | (no direct field token match)                                                                                                                                                                                                                                                                                                                      |
| `xp`           | `null / str`     | XP/reward value.                                    | `htdocs/data_magestykc_run.php`<br>`htdocs/tool_lists.php`                                                                                                                                                                                                                                                                                         |

## Field Usage By Code Location

### `ac`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `ac` is used to drive PHP calculations and branching.
  - Line 352: `if ($sorting == 2){$smd = "ORDER BY ( m_hp_min+ac+difficulty ), name";} else {$smd = "ORDER BY name";}`
  - Line 545: `if ($sorting == 2){$smd = "ORDER BY ( m_hp_min+ac+difficulty ), name";} else {$smd = "ORDER BY name";}`
  - Line 669: `$add_ac = str_replace('AC: ', '', $ary[ac]);`

### `al`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `al` is used to drive PHP calculations and branching.
  - Line 677: `$add_al = str_replace('AL: ', '', $ary[al]); $ary[al];`

### `atk`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `atk` is used to drive PHP calculations and branching.
  - Line 672: `$add_atk = str_replace('ATK: ', '', $ary[atk]);`

### `bravery`
- No direct code references found in files that mention this table.

### `creator`
- Primary usage pattern: Selection, Filtering, Sorting, Grouping, Population, PHP Logic, Output Rendering
- `htdocs/tool_lists.php` — In this file, `creator` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 334: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='OSRIC' $mnd) $smd";`
  - Line 341: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='LL' $mnd) $smd";`
  - Line 347: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='SW' $smd";`
  - ... plus 20 additional references in this file
- `htdocs/tool_encounter.php` — In this file, `creator` is used to select values, filter records, and sort results.
  - Line 26: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='OSRIC' OR creator='MoM') ORDER BY name";`
  - Line 32: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator LIKE 'AEC%' OR creator LIKE 'LL%') ORDER BY name";`
  - Line 38: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='SW' ORDER BY name";`
  - ... plus 12 additional references in this file
- `htdocs/tool_locale.php` — In this file, `creator` is used to select values, filter records, and sort results.
  - Line 29: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='OSRIC' OR creator='MoM') ORDER BY name";`
  - Line 36: `$qry = "SELECT * FROM monsters_rpgs WHERE creator LIKE 'SRC%' ORDER BY name";`
  - Line 43: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator LIKE 'AEC%' OR creator LIKE 'LL%') ORDER BY name";`
  - ... plus 10 additional references in this file
- `htdocs/tool_uruins.php` — In this file, `creator` is used to select values, filter records, sort results, and populate temporary or derived tables.
  - Line 29: `$res1 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 30: `$res2 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 32: `$res3 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' ORDER BY name");`
  - ... plus 6 additional references in this file
- `htdocs/tool_uexfl.php` — In this file, `creator` is used to select values, filter records, sort results, populate temporary or derived tables, drive PHP calculations and branching, and render user-visible output.
  - Line 62: `$res1 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='MF' ORDER BY name");`
  - Line 63: `$res2 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='MF' ORDER BY name");`
  - Line 65: `$res3 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='LL' OR creator='AEC' ORDER BY name");`
  - ... plus 5 additional references in this file
- `htdocs/functions/monster.php` — In this file, `creator` is used to select values, filter records, and sort results.
  - Line 11: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 16: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND() LIMIT 1";`
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - ... plus 3 additional references in this file
- `htdocs/data_magestykc_run.php` — In this file, `creator` is used to select values, filter records, sort results, and group rows.
  - Line 83: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' AND spdef!='None' AND spdef!='Any' GROUP BY spdef ORDER BY spdef";`
  - Line 147: `$tak = "SELECT * FROM monsters_rpgs WHERE creator='TT' AND (spdef='Any' OR spdef LIKE '%$speech%')";`
  - Line 200: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' and loot!='' ORDER BY xp DESC, name";`
  - ... plus 1 additional references in this file

### `description`
- No direct code references found in files that mention this table.

### `difficulty`
- Primary usage pattern: Selection, Filtering, Sorting, Population, PHP Logic, Output Rendering
- `htdocs/tool_hexcrawl.php` — In this file, `difficulty` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 823: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $area_monsters AND difficulty<=$f_level AND id>0";`
  - Line 897: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%FW%' AND difficulty<=$f_level AND id>0";`
  - Line 957: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $water_take AND difficulty<=$f_level AND swimmer=1 AND id>0";`
  - ... plus 26 additional references in this file
- `htdocs/tool_locale.php` — In this file, `difficulty` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 1088: `$test_u_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty<=$f_level $limits_in_hex";`
  - Line 1100: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty<=$f_level AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 1157: `$test_u_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty<=$f_level $limits_in_hex";`
  - ... plus 25 additional references in this file
- `htdocs/tool_lists.php` — In this file, `difficulty` is used to support general application logic.
  - Line 326: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - Line 333: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - Line 340: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - ... plus 21 additional references in this file
- `htdocs/tool_encounter.php` — In this file, `difficulty` is used to drive PHP calculations and branching and render user-visible output.
  - Line 484: `$treasure_level = $ary['difficulty'];`
  - Line 494: `$loot_max = ceil($ary['difficulty']/2); if ($loot_max < 3){$loot_max = 2;} if ($loot_max > 10){$loot_max = 10;}`
  - Line 557: `echo PAcalculateLife($x_level,$x_characters,$x_game,$ary['hd'],$ary['difficulty'],$x_might1,$x_might2,area,0) . "<br>";`
  - ... plus 2 additional references in this file
- `htdocs/tool_uruins.php` — In this file, `difficulty` is used to select values, filter records, populate temporary or derived tables, drive PHP calculations and branching, and render user-visible output.
  - Line 623: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $more AND creator='MF' AND difficulty<=$f_level";`
  - Line 637: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $more AND creator='BU' AND type!='R' AND difficulty<=$f_level";`
  - Line 645: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' AND location LIKE '%DG%' AND difficulty<=$f_level LIMIT $ct_num";`
  - ... plus 2 additional references in this file
- `htdocs/functions/monster.php` — In this file, `difficulty` is used to select values, filter records, and sort results.
  - Line 11: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 38: `$qry = "SELECT * FROM monsters_rpgs WHERE difficulty>=$level AND difficulty<=$level_max AND creator='BU' $twe $mdn ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - ... plus 1 additional references in this file
- `htdocs/tool_delve.php` — In this file, `difficulty` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 707: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 712: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 1095: `if ($ary[difficulty] > $level_of_monster){$level_of_monster = $ary[difficulty];}`
  - ... plus 1 additional references in this file
- `htdocs/tool_ultimate.php` — In this file, `difficulty` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 846: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 851: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 1015: `if ($ary[difficulty] > $level_of_monster){$level_of_monster = $ary[difficulty];}`
- ... plus 4 more file(s) referencing `difficulty`

### `dmg`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `dmg` is used to drive PHP calculations and branching.
  - Line 673: `$add_dmg = str_replace('DMG: ', '', $ary[dmg]);`

### `enc`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `enc` is used to drive PHP calculations and branching.
  - Line 666: `$add_enc = str_replace('APP: ', '', $ary[enc]);`

### `freq`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_bmbs.php` — In this file, `freq` is used to select values and filter records.
  - Line 356: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_door.php` — In this file, `freq` is used to select values and filter records.
  - Line 585: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_lists.php` — In this file, `freq` is used to drive PHP calculations and branching.
  - Line 665: `$add_freq = str_replace('FREQ: ', '', $ary[freq]);`

### `freq_code`
- Primary usage pattern: Selection, Filtering, PHP Logic
- `htdocs/tool_hexcrawl.php` — In this file, `freq_code` is used to select values and filter records.
  - Line 828: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - Line 902: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - Line 962: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - ... plus 2 additional references in this file
- `htdocs/tool_locale.php` — In this file, `freq_code` is used to select values and filter records.
  - Line 1622: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - Line 2796: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - Line 3340: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
  - ... plus 1 additional references in this file
- `htdocs/tool_wander.php` — In this file, `freq_code` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 324: `$qry = "SELECT id, freq_code FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND level<=($x_level) AND freq_code>1";`
  - Line 329: `$frequency = $ary[freq_code] - 1;`
- `htdocs/tool_bmbs.php` — In this file, `freq_code` is used to drive PHP calculations and branching.
  - Line 361: `$frequency = $ary[freq_code] - 1;`
- `htdocs/tool_delve.php` — In this file, `freq_code` is used to select values and filter records.
  - Line 717: `$qry = "SELECT * FROM $table WHERE freq_code=2";`
- `htdocs/tool_door.php` — In this file, `freq_code` is used to drive PHP calculations and branching.
  - Line 590: `$frequency = $ary[freq_code] - 1;`
- `htdocs/tool_ultimate.php` — In this file, `freq_code` is used to select values and filter records.
  - Line 856: `$qry = "SELECT * FROM $table WHERE freq_code=2";`

### `hd`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_encounter.php` — In this file, `hd` is used to drive PHP calculations and branching and render user-visible output.
  - Line 557: `echo PAcalculateLife($x_level,$x_characters,$x_game,$ary['hd'],$ary['difficulty'],$x_might1,$x_might2,area,0) . "<br>";`
- `htdocs/tool_hexcrawl.php` — In this file, `hd` is used to drive PHP calculations and branching and render user-visible output.
  - Line 3267: `echo PAcalculateLife($x_level,$x_characters,$x_game,$ary[hd],$ary[difficulty],$x_might1,$x_might2,$v_scare,$how_many_monsters) . "<br>";`
- `htdocs/tool_lists.php` — In this file, `hd` is used to drive PHP calculations and branching.
  - Line 670: `$add_hd = str_replace('HD: ', '', $ary[hd]);`
- `htdocs/tool_locale.php` — In this file, `hd` is used to drive PHP calculations and branching and render user-visible output.
  - Line 3167: `echo PAcalculateLife($x_level,$x_characters,$x_game,$ary[hd],$ary['difficulty'],$x_might1,$x_might2,$v_scare,$how_many_monsters) . "<br>";`
- `htdocs/tool_uexfl.php` — In this file, `hd` is used to drive PHP calculations and branching and render user-visible output.
  - Line 573: `if ($ary[creator] == "MF"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; echo PAcalculateLife($x_level,$x_characters,'Mutant Future',$ary[hd],$ary[difficulty],$...`
- `htdocs/tool_uruins.php` — In this file, `hd` is used to drive PHP calculations and branching and render user-visible output.
  - Line 775: `echo PAcalculateLife($x_level,$x_characters,$x_game,$ary[hd],$ary[difficulty],$x_might1,$x_might2,$v_scare,$how_many_monsters) . "<br>";`

### `id`
- Primary usage pattern: Selection, Filtering, Sorting, Population, PHP Logic
- `htdocs/tool_hexcrawl.php` — In this file, `id` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 823: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $area_monsters AND difficulty<=$f_level AND id>0";`
  - Line 897: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%FW%' AND difficulty<=$f_level AND id>0";`
  - Line 957: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $water_take AND difficulty<=$f_level AND swimmer=1 AND id>0";`
  - ... plus 10 additional references in this file
- `htdocs/tool_locale.php` — In this file, `id` is used to select values, filter records, and drive PHP calculations and branching.
  - Line 1115: `$lair_owner = $lair_ary['id'];`
  - Line 1248: `$lair_owner = $lair_ary['id'];`
  - Line 1719: `$qry = "SELECT * FROM monsters_rpgs WHERE id=$lair_owner";`
  - ... plus 8 additional references in this file
- `htdocs/tool_wander.php` — In this file, `id` is used to select values, filter records, sort results, and populate temporary or derived tables.
  - Line 321: `$qry = "CREATE TEMPORARY TABLE $table SELECT id FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND difficulty<=($x_level)";`
  - Line 324: `$qry = "SELECT id, freq_code FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND level<=($x_level) AND freq_code>1";`
  - Line 336: `if ($num > 0){ $valids = substr($valids, 0, -2); wa_db_query($connection, "INSERT INTO $table (id) VALUES ($valids)"); }`
  - ... plus 1 additional references in this file
- `htdocs/tool_encounter.php` — In this file, `id` is used to select values and filter records.
  - Line 470: `$qry = "SELECT * FROM monsters_rpgs WHERE id=$x_enemy";`
  - Line 548: `$qry = "SELECT * FROM monsters_rpgs WHERE id=$x_enemy";`
- `htdocs/tool_uruins.php` — In this file, `id` is used to select values, filter records, and populate temporary or derived tables.
  - Line 626: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE creator='MF' AND (id=0 $cmd_monster_1 $cmd_monster_2)";`
  - Line 648: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE creator='BU' AND (id=0 $cmd_monster_1 $cmd_monster_2)";`
- `htdocs/tool_bmbs.php` — In this file, `id` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 365: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND id=$ary[id]";`
- `htdocs/tool_delve.php` — In this file, `id` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 666: `$qryf = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE id=$monster_check[0]";`
- `htdocs/tool_door.php` — In this file, `id` is used to select values, filter records, populate temporary or derived tables, and drive PHP calculations and branching.
  - Line 594: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND id=$ary[id]";`
- ... plus 2 more file(s) referencing `id`

### `iq`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `iq` is used to drive PHP calculations and branching.
  - Line 676: `$add_iq = str_replace('INT: ', '', $ary[iq]); $ary[iq];`

### `lair`
- No direct code references found in files that mention this table.

### `level`
- Primary usage pattern: Selection, Filtering, Sorting, Population
- `htdocs/functions/monster.php` — In this file, `level` is used to select values, filter records, and sort results.
  - Line 11: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 38: `$qry = "SELECT * FROM monsters_rpgs WHERE difficulty>=$level AND difficulty<=$level_max AND creator='BU' $twe $mdn ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - ... plus 1 additional references in this file
- `htdocs/tool_uexfl.php` — In this file, `level` is used to select values, filter records, and populate temporary or derived tables.
  - Line 455: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $edor AND $more AND level<=$f_level";`
  - Line 460: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE creator='MF' AND $more AND level<=$f_level";`
  - Line 463: `$qry = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE creator='MF' AND $more AND level<=$f_level";`
  - ... plus 1 additional references in this file
- `htdocs/tool_wander.php` — In this file, `level` is used to select values and filter records.
  - Line 324: `$qry = "SELECT id, freq_code FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND level<=($x_level) AND freq_code>1";`

### `location`
- Primary usage pattern: Selection, Filtering, Sorting, Population, PHP Logic
- `htdocs/tool_lists.php` — In this file, `location` is used to support general application logic.
  - Line 537: `$mnd = "WHERE creator='SW' AND location LIKE '%$trn%'";`
  - Line 544: `$mnd = "WHERE creator='TT' AND location LIKE '%$trn%'";`
  - Line 551: `$mnd = "WHERE creator='TT' AND location LIKE '%$trn%'";`
  - ... plus 6 additional references in this file
- `htdocs/tool_delve.php` — In this file, `location` is used to select values, filter records, sort results, and populate temporary or derived tables.
  - Line 707: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 712: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 804: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' $freqned AND m_myname='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - ... plus 1 additional references in this file
- `htdocs/tool_locale.php` — In this file, `location` is used to select values, filter records, and sort results.
  - Line 1110: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 2267: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 3437: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%SW%' AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(),...`
  - ... plus 1 additional references in this file
- `htdocs/tool_hexcrawl.php` — In this file, `location` is used to select values, filter records, and sort results.
  - Line 897: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%FW%' AND difficulty<=$f_level AND id>0";`
  - Line 1172: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 2336: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
- `htdocs/tool_ultimate.php` — In this file, `location` is used to select values, filter records, sort results, and populate temporary or derived tables.
  - Line 846: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 851: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 1301: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' $freqned AND m_myname='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
- `htdocs/tool_bmbs.php` — In this file, `location` is used to select values and filter records.
  - Line 353: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 356: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_door.php` — In this file, `location` is used to select values and filter records.
  - Line 582: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 585: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_wander.php` — In this file, `location` is used to select values and filter records.
  - Line 321: `$qry = "CREATE TEMPORARY TABLE $table SELECT id FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND difficulty<=($x_level)";`
  - Line 324: `$qry = "SELECT id, freq_code FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' AND level<=($x_level) AND freq_code>1";`
- ... plus 3 more file(s) referencing `location`

### `loot`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic, Output Rendering
- `htdocs/data_magestykc_run.php` — In this file, `loot` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 200: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' and loot!='' ORDER BY xp DESC, name";`
  - Line 252: `<?php if ($tt7 > 0){ echo "<td NOWRAP colspan='5' align='center'><u>" . $ary['loot'] . "</u></td>"; }`
  - Line 256: `$stat = explode(" ", $ary['loot']);`
  - ... plus 1 additional references in this file

### `m_app_max`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_delve.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1090: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
  - Line 1456: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_encounter.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 479: `echo calculateLife($x_level,$x_characters,$ary['m_app_min'],$ary['m_app_max'],$ary['m_hp_min'],$ary['m_hp_max'],$ary['m_hp_mod'],$x_game,$my_mr_is,$x_hit_dice,$tt_adds...`
- `htdocs/tool_hexcrawl.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 2058: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_locale.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1989: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_uexfl.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 574: `else { echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,0,0,0,0,0) . "<br>"; }`
- `htdocs/tool_ultimate.php` — In this file, `m_app_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1010: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`

### `m_app_min`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_delve.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1090: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
  - Line 1456: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_encounter.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 479: `echo calculateLife($x_level,$x_characters,$ary['m_app_min'],$ary['m_app_max'],$ary['m_hp_min'],$ary['m_hp_max'],$ary['m_hp_mod'],$x_game,$my_mr_is,$x_hit_dice,$tt_adds...`
- `htdocs/tool_hexcrawl.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 2058: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_locale.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1989: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_uexfl.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 574: `else { echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,0,0,0,0,0) . "<br>"; }`
- `htdocs/tool_ultimate.php` — In this file, `m_app_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1010: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`

### `m_fort`
- No direct code references found in files that mention this table.

### `m_fort_name`
- Primary usage pattern: PHP Logic
- `htdocs/tool_hexcrawl.php` — In this file, `m_fort_name` is used to drive PHP calculations and branching.
  - Line 1186: `case 0: $flur = "Cave of the " . $lair_ary[m_fort_name]; break;`
  - Line 1187: `case 1: $flur = "Den of the " . $lair_ary[m_fort_name]; break;`
  - Line 1188: `case 2: $flur = "Lair of the " . $lair_ary[m_fort_name]; break;`
  - ... plus 14 additional references in this file
- `htdocs/tool_locale.php` — In this file, `m_fort_name` is used to drive PHP calculations and branching.
  - Line 1124: `case 0: $flur = "Cave of the " . $lair_ary['m_fort_name']; break;`
  - Line 1125: `case 1: $flur = "Den of the " . $lair_ary['m_fort_name']; break;`
  - Line 1126: `case 2: $flur = "Lair of the " . $lair_ary['m_fort_name']; break;`
  - ... plus 14 additional references in this file

### `m_hoard`
- Primary usage pattern: PHP Logic
- `htdocs/tool_delve.php` — In this file, `m_hoard` is used to drive PHP calculations and branching.
  - Line 1098: `if ($ary[m_hoard] == 3){$xx_hord = 50;} else if ($ary[m_hoard] == 2){$xx_hord = 90;} else if ($ary[m_hoard] == 1){$xx_hord = 70;}`
  - Line 1099: `if (($ary[m_hoard] > 0) && ($x_l_c > 0)){$level_of_monster = $xx_hord + $x_l_c;}`
  - Line 1464: `if ($ary[m_hoard] == 3){$xx_hord = 50;} else if ($ary[m_hoard] == 2){$xx_hord = 90;} else if ($ary[m_hoard] == 1){$xx_hord = 70;}`
  - ... plus 1 additional references in this file
- `htdocs/tool_hexcrawl.php` — In this file, `m_hoard` is used to drive PHP calculations and branching.
  - Line 2065: `if ($ary[m_hoard] == 3){$xx_hord = 50;} else if ($ary[m_hoard] == 2){$xx_hord = 90;} else if ($ary[m_hoard] == 1){$xx_hord = 70;}`
  - Line 2066: `if (($ary[m_hoard] > 0) && ($x_l_c > 0)){$level_of_monster = $xx_hord + $x_l_c;}`
- `htdocs/tool_locale.php` — In this file, `m_hoard` is used to drive PHP calculations and branching.
  - Line 1996: `if ($ary[m_hoard] == 3){$xx_hord = 50;} else if ($ary[m_hoard] == 2){$xx_hord = 90;} else if ($ary[m_hoard] == 1){$xx_hord = 70;}`
  - Line 1997: `if (($ary[m_hoard] > 0) && ($x_l_c > 0)){$level_of_monster = $xx_hord + $x_l_c;}`
- `htdocs/tool_ultimate.php` — In this file, `m_hoard` is used to drive PHP calculations and branching.
  - Line 1018: `if ($ary[m_hoard] == 3){$xx_hord = 50;} else if ($ary[m_hoard] == 2){$xx_hord = 90;} else if ($ary[m_hoard] == 1){$xx_hord = 70;}`
  - Line 1019: `if (($ary[m_hoard] > 0) && ($x_l_c > 0)){$level_of_monster = $xx_hord + $x_l_c;}`

### `m_hp_max`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_delve.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1090: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
  - Line 1456: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_encounter.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 479: `echo calculateLife($x_level,$x_characters,$ary['m_app_min'],$ary['m_app_max'],$ary['m_hp_min'],$ary['m_hp_max'],$ary['m_hp_mod'],$x_game,$my_mr_is,$x_hit_dice,$tt_adds...`
  - Line 556: `if ($x_game == "Mutant Future"){ $x_might1=$ary['m_hp_min']; $x_might2=$ary['m_hp_max']; }`
- `htdocs/tool_hexcrawl.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 2058: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
  - Line 3265: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`
- `htdocs/tool_locale.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1989: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
  - Line 3166: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`
- `htdocs/tool_uexfl.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 573: `if ($ary[creator] == "MF"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; echo PAcalculateLife($x_level,$x_characters,'Mutant Future',$ary[hd],$ary[difficulty],$...`
  - Line 574: `else { echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,0,0,0,0,0) . "<br>"; }`
- `htdocs/tool_ultimate.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1010: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_uruins.php` — In this file, `m_hp_max` is used to drive PHP calculations and branching.
  - Line 773: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`

### `m_hp_min`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_delve.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1090: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
  - Line 1456: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_encounter.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 479: `echo calculateLife($x_level,$x_characters,$ary['m_app_min'],$ary['m_app_max'],$ary['m_hp_min'],$ary['m_hp_max'],$ary['m_hp_mod'],$x_game,$my_mr_is,$x_hit_dice,$tt_adds...`
  - Line 556: `if ($x_game == "Mutant Future"){ $x_might1=$ary['m_hp_min']; $x_might2=$ary['m_hp_max']; }`
- `htdocs/tool_hexcrawl.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 2058: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
  - Line 3265: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`
- `htdocs/tool_lists.php` — In this file, `m_hp_min` is used to support general application logic.
  - Line 352: `if ($sorting == 2){$smd = "ORDER BY ( m_hp_min+ac+difficulty ), name";} else {$smd = "ORDER BY name";}`
  - Line 545: `if ($sorting == 2){$smd = "ORDER BY ( m_hp_min+ac+difficulty ), name";} else {$smd = "ORDER BY name";}`
- `htdocs/tool_locale.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1989: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
  - Line 3166: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`
- `htdocs/tool_uexfl.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 573: `if ($ary[creator] == "MF"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; echo PAcalculateLife($x_level,$x_characters,'Mutant Future',$ary[hd],$ary[difficulty],$...`
  - Line 574: `else { echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,0,0,0,0,0) . "<br>"; }`
- `htdocs/tool_ultimate.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1010: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_uruins.php` — In this file, `m_hp_min` is used to drive PHP calculations and branching.
  - Line 773: `if ($x_game == "Mutant Future"){ $x_might1=$ary[m_hp_min]; $x_might2=$ary[m_hp_max]; }`

### `m_hp_mod`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/tool_delve.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1090: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
  - Line 1456: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`
- `htdocs/tool_encounter.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 479: `echo calculateLife($x_level,$x_characters,$ary['m_app_min'],$ary['m_app_max'],$ary['m_hp_min'],$ary['m_hp_max'],$ary['m_hp_mod'],$x_game,$my_mr_is,$x_hit_dice,$tt_adds...`
- `htdocs/tool_hexcrawl.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 2058: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_locale.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1989: `if ($do_not_show_creatures != 1){echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_...`
- `htdocs/tool_uexfl.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 574: `else { echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,0,0,0,0,0) . "<br>"; }`
- `htdocs/tool_ultimate.php` — In this file, `m_hp_mod` is used to drive PHP calculations and branching and render user-visible output.
  - Line 1010: `echo calculateLife($x_level,$x_characters,$ary[m_app_min],$ary[m_app_max],$ary[m_hp_min],$ary[m_hp_max],$ary[m_hp_mod],$x_game,$my_mr_is,$x_hit_dice,$tt_adds,$tt_vary,...`

### `m_lair`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/tool_hexcrawl.php` — In this file, `m_lair` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 1162: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty<=$f_level AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 1167: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 1172: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - ... plus 4 additional references in this file
- `htdocs/tool_locale.php` — In this file, `m_lair` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 1100: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty<=$f_level AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - Line 1105: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 1110: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND m_lair>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAN...`
  - ... plus 4 additional references in this file

### `m_myname`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_delve.php` — In this file, `m_myname` is used to select values, filter records, and sort results.
  - Line 804: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' $freqned AND m_myname='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 1745: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' $freqned AND m_myname='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
- `htdocs/tool_ultimate.php` — In this file, `m_myname` is used to select values, filter records, and sort results.
  - Line 1301: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$x_terrain%' $freqned AND m_myname='' ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`

### `m_no_dungeon`
- Primary usage pattern: Selection, Filtering, Sorting, Population
- `htdocs/tool_hexcrawl.php` — In this file, `m_no_dungeon` is used to select values, filter records, and sort results.
  - Line 1307: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2400: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2791: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $area_monsters AND difficulty>4 AND m_no_dungeon!=1 $cratermnd ORDER BY RAND(), RAND(), RAND(), RAND(), RAND()...`
- `htdocs/tool_locale.php` — In this file, `m_no_dungeon` is used to select values, filter records, and sort results.
  - Line 1245: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2331: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2687: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $lair_command AND difficulty>4 AND m_no_dungeon!=1 $cratermnd ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(),...`
- `htdocs/tool_bmbs.php` — In this file, `m_no_dungeon` is used to select values and filter records.
  - Line 353: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 356: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_delve.php` — In this file, `m_no_dungeon` is used to select values, filter records, and populate temporary or derived tables.
  - Line 707: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 712: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
- `htdocs/tool_door.php` — In this file, `m_no_dungeon` is used to select values and filter records.
  - Line 582: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 585: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' AND difficulty<=$f_level AND freq>1 AND m_no_dungeon!=1";`
- `htdocs/tool_ultimate.php` — In this file, `m_no_dungeon` is used to select values, filter records, and populate temporary or derived tables.
  - Line 846: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%DG%' $haunted AND difficulty<=$f_level AND m_no_dungeon!=1";`
  - Line 851: `$qrys2 = "INSERT INTO $table SELECT * FROM monsters_rpgs WHERE $take AND location LIKE '%$more%' AND difficulty<=$f_level AND m_no_dungeon!=1";`

### `m_trap`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/functions/monster.php` — In this file, `m_trap` is used to select values, filter records, and sort results.
  - Line 11: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 16: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND() LIMIT 1";`
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - ... plus 3 additional references in this file

### `move`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `move` is used to drive PHP calculations and branching.
  - Line 668: `$add_move = str_replace('MV: ', '', $ary[move]);`

### `mr`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `mr` is used to drive PHP calculations and branching.
  - Line 674: `$add_mr = str_replace('MR: ', '', $ary[mr]); $ary[mr];`

### `name`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_lists.php` — In this file, `name` is used to support general application logic.
  - Line 326: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - Line 333: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - Line 340: `if ($sorting == 2){$smd = "ORDER BY difficulty, name";} else {$smd = "ORDER BY name";}`
  - ... plus 19 additional references in this file
- `htdocs/tool_encounter.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 26: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='OSRIC' OR creator='MoM') ORDER BY name";`
  - Line 32: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator LIKE 'AEC%' OR creator LIKE 'LL%') ORDER BY name";`
  - Line 38: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='SW' ORDER BY name";`
  - ... plus 13 additional references in this file
- `htdocs/tool_locale.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 29: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator='OSRIC' OR creator='MoM') ORDER BY name";`
  - Line 36: `$qry = "SELECT * FROM monsters_rpgs WHERE creator LIKE 'SRC%' ORDER BY name";`
  - Line 43: `$qry = "SELECT * FROM monsters_rpgs WHERE (creator LIKE 'AEC%' OR creator LIKE 'LL%') ORDER BY name";`
  - ... plus 11 additional references in this file
- `htdocs/tool_uruins.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 29: `$res1 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 30: `$res2 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 32: `$res3 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' ORDER BY name");`
  - ... plus 3 additional references in this file
- `htdocs/tool_uexfl.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 62: `$res1 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='MF' ORDER BY name");`
  - Line 63: `$res2 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='MF' ORDER BY name");`
  - Line 65: `$res3 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='LL' OR creator='AEC' ORDER BY name");`
  - ... plus 1 additional references in this file
- `htdocs/data_magestykc_run.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 200: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' and loot!='' ORDER BY xp DESC, name";`
  - Line 324: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' ORDER BY name";`
- `htdocs/functions/monsters.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE $cmd ORDER BY name";`
- `htdocs/functions/monsters_add.php` — In this file, `name` is used to select values, filter records, and sort results.
  - Line 18: `$qry = "SELECT * FROM monsters_rpgs WHERE $cmd ORDER BY name";`
- ... plus 2 more file(s) referencing `name`

### `salvage`
- No direct code references found in files that mention this table.

### `size`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `size` is used to drive PHP calculations and branching.
  - Line 667: `$add_size = str_replace('SZ: ', '', $ary[size]);`

### `spatk`
- No direct code references found in files that mention this table.

### `spdef`
- Primary usage pattern: Selection, Filtering, Sorting, Grouping, PHP Logic
- `htdocs/data_magestykc_run.php` — In this file, `spdef` is used to select values, filter records, sort results, group rows, and drive PHP calculations and branching.
  - Line 83: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' AND spdef!='None' AND spdef!='Any' GROUP BY spdef ORDER BY spdef";`
  - Line 93: `$living = explode("/", $ary['spdef']);`
  - Line 147: `$tak = "SELECT * FROM monsters_rpgs WHERE creator='TT' AND (spdef='Any' OR spdef LIKE '%$speech%')";`
  - ... plus 1 additional references in this file

### `swimmer`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/tool_locale.php` — In this file, `swimmer` is used to select values, filter records, and sort results.
  - Line 1245: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2331: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 3405: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $area_monsters AND difficulty<=$f_level AND swimmer=1";`
  - ... plus 2 additional references in this file
- `htdocs/tool_hexcrawl.php` — In this file, `swimmer` is used to select values, filter records, and sort results.
  - Line 957: `$qry = "CREATE TEMPORARY TABLE $table SELECT * FROM monsters_rpgs WHERE $take AND $water_take AND difficulty<=$f_level AND swimmer=1 AND id>0";`
  - Line 1307: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`
  - Line 2400: `$lair_qry = "SELECT * FROM monsters_rpgs WHERE $take AND $this_spot_monsters AND difficulty>4 AND m_no_dungeon!=1 AND swimmer=1 ORDER BY RAND(), RAND(), RAND(), RAND()...`

### `thaco`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `thaco` is used to drive PHP calculations and branching.
  - Line 675: `$add_thaco = str_replace('THAC0: ', '', $ary[thaco]);`
  - Line 936: `if ( $ary[thaco] < 1 ){ $svsx = $ary[thaco]; } else { $svsx = "+" . $ary[thaco]; }`

### `treasure`
- Primary usage pattern: PHP Logic
- `htdocs/tool_lists.php` — In this file, `treasure` is used to drive PHP calculations and branching.
  - Line 697: `$add_spc = str_replace('SPATK', 'ATTACK', $ary[treasure]);`

### `turn`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/tool_hexcrawl.php` — In this file, `turn` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 1207: `if ($ary[turn] > 0){$tomb = 1;} else {$tomb = 0;}`
  - Line 2036: `$qry = "SELECT * FROM $table WHERE turn>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 2041: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND turn>0 AND difficulty<=($x_level + $lvl_modifier)";`
- `htdocs/tool_locale.php` — In this file, `turn` is used to select values, filter records, sort results, and drive PHP calculations and branching.
  - Line 1145: `if ($ary['turn'] > 0){$tomb = 1;} else {$tomb = 0;}`
  - Line 1965: `$qry = "SELECT * FROM $table WHERE turn>0 ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 1970: `$qry = "SELECT * FROM monsters_rpgs WHERE $take AND turn>0 AND difficulty<=($x_level + $lvl_modifier)";`

### `type`
- Primary usage pattern: Selection, Filtering, Sorting, Population
- `htdocs/functions/monster.php` — In this file, `type` is used to select values, filter records, and sort results.
  - Line 11: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - Line 16: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type ORDER BY RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND(), RAND() LIMIT 1";`
  - Line 24: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='MF' AND m_trap=$type AND difficulty>=$level AND difficulty<=$level_max ORDER BY RAND(), RAND(), RAND(), RAND(), RAND...`
  - ... plus 3 additional references in this file
- `htdocs/tool_encounter.php` — In this file, `type` is used to select values, filter records, and sort results.
  - Line 73: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name";`
  - Line 74: `$qry2 = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' ORDER BY name";`
  - Line 89: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name";`
  - ... plus 3 additional references in this file
- `htdocs/tool_uruins.php` — In this file, `type` is used to select values, filter records, sort results, and populate temporary or derived tables.
  - Line 29: `$res1 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 30: `$res2 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name");`
  - Line 32: `$res3 = wa_db_query($connection, "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' ORDER BY name");`
  - ... plus 3 additional references in this file
- `htdocs/tool_locale.php` — In this file, `type` is used to select values, filter records, and sort results.
  - Line 97: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name";`
  - Line 98: `$qry2 = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type='R' ORDER BY name";`
  - Line 112: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='BU' AND type!='R' ORDER BY name";`
  - ... plus 1 additional references in this file

### `underground`
- No direct code references found in files that mention this table.

### `weapons`
- No direct code references found in files that mention this table.

### `xp`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/data_magestykc_run.php` — In this file, `xp` is used to select values, filter records, and sort results.
  - Line 200: `$qry = "SELECT * FROM monsters_rpgs WHERE creator='TT' and loot!='' ORDER BY xp DESC, name";`
- `htdocs/tool_lists.php` — In this file, `xp` is used to drive PHP calculations and branching.
  - Line 678: `$add_xp = str_replace('XP: ', '', $ary[xp]); $ary[xp];`

