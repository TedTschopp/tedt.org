# menus.json

- Table: `menus`
- Rows exported: `163`
- Fields detected: `8`

## Referenced In Code
- `htdocs/body.php`
- `htdocs/data_help.php`
- `htdocs/data_magestykc.php`
- `htdocs/functions/misc.php`
- `htdocs/help_about.php`
- `htdocs/help_navigate.php`
- `htdocs/help_print.php`
- `htdocs/index.php`
- `htdocs/menus/menu_data.php`
- `htdocs/menus/menu_fantasy_game.php`
- `htdocs/menus/menu_generators.php`
- `htdocs/menus/menu_genres.php`
- `htdocs/menus/menu_help_left.php`
- `htdocs/menus/menu_help_right.php`
- `htdocs/menus/menu_left.php`
- `htdocs/menus/menu_other_game.php`
- `htdocs/menus/menu_right.php`
- `htdocs/menus/menu_supplements.php`
- `htdocs/menus/menu_wizardawn_games.php`
- `htdocs/rpg_add.php`
- `htdocs/rpg_apoc.php`
- `htdocs/rpg_bdd.php`
- `htdocs/rpg_bfrpg.php`
- `htdocs/rpg_data.php`
- `htdocs/rpg_fantasy.php`
- `htdocs/rpg_gamma.php`
- `htdocs/rpg_horror.php`
- `htdocs/rpg_lablord.php`
- `htdocs/rpg_meta.php`
- `htdocs/rpg_millen.php`
- `htdocs/rpg_mutfut.php`
- `htdocs/rpg_necro.php`
- `htdocs/rpg_osric.php`
- `htdocs/rpg_ryft.php`
- `htdocs/rpg_sandw.php`
- `htdocs/rpg_scifi.php`
- `htdocs/rpg_ssxs.php`
- `htdocs/rpg_tt5e.php`
- `htdocs/rpg_tt7e.php`
- `htdocs/rpg_ttde.php`
- `htdocs/rpg_urthe.php`
- `htdocs/rpg_ww.php`
- `htdocs/tool_acity.php`
- `htdocs/tool_alchemist.php`
- `htdocs/tool_area.php`
- `htdocs/tool_bmbs.php`
- `htdocs/tool_books.php`
- `htdocs/tool_brew.php`
- `htdocs/tool_bxadvg.php`
- `htdocs/tool_coins.php`
- `htdocs/tool_data.php`
- `htdocs/tool_delve.php`
- `htdocs/tool_dice.php`
- `htdocs/tool_dmap.php`
- `htdocs/tool_door.php`
- `htdocs/tool_encounter.php`
- `htdocs/tool_ftown.php`
- `htdocs/tool_hexcrawl.php`
- `htdocs/tool_ladvg.php`
- `htdocs/tool_lists.php`
- `htdocs/tool_llb_spells.php`
- `htdocs/tool_locale.php`
- `htdocs/tool_loot.php`
- `htdocs/tool_mtown.php`
- `htdocs/tool_names.php`
- `htdocs/tool_oadvg.php`
- `htdocs/tool_osric_spells.php`
- `htdocs/tool_packs.php`
- `htdocs/tool_potions.php`
- `htdocs/tool_scavenge.php`
- `htdocs/tool_scifim.php`
- `htdocs/tool_smap.php`
- `htdocs/tool_suburb.php`
- `htdocs/tool_swmp.php`
- `htdocs/tool_tmap.php`
- `htdocs/tool_ttown.php`
- `htdocs/tool_uexfl.php`
- `htdocs/tool_ultimate.php`
- `htdocs/tool_uruins.php`
- `htdocs/tool_villg.php`
- `htdocs/tool_wander.php`
- `htdocs/tool_world.php`
- `htdocs/tool_wtown.php`
- `htdocs/tool_zombies.php`

## Field Dictionary

| Field | Observed Type(s) | Description | Referenced In |
|---|---|---|---|
| `mn_group` | `str` | Menu grouping bucket. | `htdocs/menus/menu_data.php`<br>`htdocs/menus/menu_fantasy_game.php`<br>`htdocs/menus/menu_generators.php`<br>`htdocs/menus/menu_genres.php`<br>`htdocs/menus/menu_help_left.php`<br>`htdocs/menus/menu_help_right.php`<br>`htdocs/menus/menu_left.php`<br>`htdocs/menus/menu_other_game.php`<br>`htdocs/menus/menu_right.php`<br>`htdocs/menus/menu_supplements.php`<br>`htdocs/menus/menu_wizardawn_games.php` |
| `mn_id` | `str` | Menu identifier used to resolve current game/section. | `htdocs/functions/misc.php` |
| `mn_inactive` | `str` | Activation flag: 0 active, non-zero inactive. | `htdocs/functions/misc.php`<br>`htdocs/menus/menu_data.php`<br>`htdocs/menus/menu_fantasy_game.php`<br>`htdocs/menus/menu_generators.php`<br>`htdocs/menus/menu_genres.php`<br>`htdocs/menus/menu_help_left.php`<br>`htdocs/menus/menu_help_right.php`<br>`htdocs/menus/menu_left.php`<br>`htdocs/menus/menu_other_game.php`<br>`htdocs/menus/menu_right.php`<br>`htdocs/menus/menu_supplements.php`<br>`htdocs/menus/menu_wizardawn_games.php` |
| `mn_link` | `str` | Target PHP page for menu navigation and tool routing. | `htdocs/data_magestykc.php`<br>`htdocs/menus/menu_data.php`<br>`htdocs/menus/menu_fantasy_game.php`<br>`htdocs/menus/menu_generators.php`<br>`htdocs/menus/menu_genres.php`<br>`htdocs/menus/menu_help_left.php`<br>`htdocs/menus/menu_help_right.php`<br>`htdocs/menus/menu_left.php`<br>`htdocs/menus/menu_other_game.php`<br>`htdocs/menus/menu_right.php`<br>`htdocs/menus/menu_supplements.php`<br>`htdocs/menus/menu_wizardawn_games.php`<br>`htdocs/tool_acity.php`<br>`htdocs/tool_alchemist.php`<br>`htdocs/tool_area.php`<br>`htdocs/tool_bmbs.php`<br>`htdocs/tool_books.php`<br>`htdocs/tool_brew.php`<br>`htdocs/tool_bxadvg.php`<br>`htdocs/tool_coins.php`<br>`htdocs/tool_data.php`<br>`htdocs/tool_delve.php`<br>`htdocs/tool_dice.php`<br>`htdocs/tool_dmap.php`<br>`htdocs/tool_door.php`<br>`htdocs/tool_encounter.php`<br>`htdocs/tool_ftown.php`<br>`htdocs/tool_hexcrawl.php`<br>`htdocs/tool_ladvg.php`<br>`htdocs/tool_lists.php`<br>`htdocs/tool_llb_spells.php`<br>`htdocs/tool_locale.php`<br>`htdocs/tool_loot.php`<br>`htdocs/tool_mtown.php`<br>`htdocs/tool_names.php`<br>`htdocs/tool_oadvg.php`<br>`htdocs/tool_osric_spells.php`<br>`htdocs/tool_packs.php`<br>`htdocs/tool_potions.php`<br>`htdocs/tool_scavenge.php`<br>`htdocs/tool_scifim.php`<br>`htdocs/tool_smap.php`<br>`htdocs/tool_suburb.php`<br>`htdocs/tool_swmp.php`<br>`htdocs/tool_tmap.php`<br>`htdocs/tool_ttown.php`<br>`htdocs/tool_uexfl.php`<br>`htdocs/tool_ultimate.php`<br>`htdocs/tool_uruins.php`<br>`htdocs/tool_villg.php`<br>`htdocs/tool_wander.php`<br>`htdocs/tool_world.php`<br>`htdocs/tool_wtown.php`<br>`htdocs/tool_zombies.php` |
| `mn_members` | `str` | Membership filter list of section IDs (x<id>x pattern). | (no direct field token match) |
| `mn_misc` | `str` | Auxiliary menu metadata (tool-specific behavior). | `htdocs/menus/menu_fantasy_game.php`<br>`htdocs/menus/menu_other_game.php` |
| `mn_name` | `str` | Menu display label. | `htdocs/menus/menu_data.php`<br>`htdocs/menus/menu_fantasy_game.php`<br>`htdocs/menus/menu_generators.php`<br>`htdocs/menus/menu_genres.php`<br>`htdocs/menus/menu_help_left.php`<br>`htdocs/menus/menu_help_right.php`<br>`htdocs/menus/menu_left.php`<br>`htdocs/menus/menu_other_game.php`<br>`htdocs/menus/menu_right.php`<br>`htdocs/menus/menu_supplements.php`<br>`htdocs/menus/menu_wizardawn_games.php` |
| `mn_newwindow` | `str` | Flag for open behavior (same/new window). | `htdocs/menus/menu_supplements.php` |

## Field Usage By Code Location

### `mn_group`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/menus/menu_help_right.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' ORDER BY mn_name");`
  - Line 9: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
- `htdocs/menus/menu_right.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
  - Line 10: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Free Game' ORDER BY mn_name");`
- `htdocs/menus/menu_supplements.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Supplements' $for ORDER BY mn_name");`
  - Line 18: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Non' $for ORDER BY mn_name");`
- `htdocs/menus/menu_data.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Data Files' ORDER BY mn_name");`
- `htdocs/menus/menu_fantasy_game.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' AND mn_misc='Fantasy' ORDER BY mn_name");`
- `htdocs/menus/menu_generators.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Generators' $for ORDER BY mn_name");`
- `htdocs/menus/menu_genres.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
- `htdocs/menus/menu_help_left.php` — In this file, `mn_group` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Free Game' ORDER BY mn_name");`
- ... plus 3 more file(s) referencing `mn_group`

### `mn_id`
- Primary usage pattern: Selection, Filtering
- `htdocs/functions/misc.php` — In this file, `mn_id` is used to select values and filter records.
  - Line 120: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_id='$game'" );`

### `mn_inactive`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic
- `htdocs/menus/menu_help_right.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' ORDER BY mn_name");`
  - Line 9: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
- `htdocs/menus/menu_right.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
  - Line 10: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Free Game' ORDER BY mn_name");`
- `htdocs/menus/menu_supplements.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Supplements' $for ORDER BY mn_name");`
  - Line 18: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Non' $for ORDER BY mn_name");`
- `htdocs/functions/misc.php` — In this file, `mn_inactive` is used to drive PHP calculations and branching.
  - Line 122: `if ($ary['mn_inactive'] == 0){$status = "true";} else {$status = "false"; header("Location:../" . $webdir . "/");}`
- `htdocs/menus/menu_data.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Data Files' ORDER BY mn_name");`
- `htdocs/menus/menu_fantasy_game.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' AND mn_misc='Fantasy' ORDER BY mn_name");`
- `htdocs/menus/menu_generators.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Generators' $for ORDER BY mn_name");`
- `htdocs/menus/menu_genres.php` — In this file, `mn_inactive` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
- ... plus 4 more file(s) referencing `mn_inactive`

### `mn_link`
- Primary usage pattern: Selection, Filtering, PHP Logic, Output Rendering
- `htdocs/menus/menu_supplements.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 10: `if ($ary['mn_newwindow'] == 1){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ar...`
  - Line 11: `else if ($ary['mn_newwindow'] == 2){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='" . $ary['m...`
  - Line 12: `else { echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='files/" . $ary['mn_link'] . "'>" . $ary['...`
  - ... plus 1 additional references in this file
- `htdocs/menus/menu_help_right.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 6: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
  - Line 12: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
- `htdocs/menus/menu_right.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 6: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
  - Line 13: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
- `htdocs/data_magestykc.php` — In this file, `mn_link` is used to select values and filter records.
  - Line 11: `if (wa_db_num_rows(wa_db_query( $connection, "SELECT * FROM menus WHERE mn_link='$menu_in_center' $for")) == 0){ $game_defaults = "T&T 5e"; include("game_defaults.php"...`
- `htdocs/menus/menu_data.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 9: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='data/" . $ary['mn_link'] . "'>" . $ary['mn_name'...`
- `htdocs/menus/menu_fantasy_game.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 7: `echo "<li><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></li>";`
- `htdocs/menus/menu_generators.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 10: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
- `htdocs/menus/menu_genres.php` — In this file, `mn_link` is used to drive PHP calculations and branching and render user-visible output.
  - Line 7: `echo "<li><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></li>";`
- ... plus 46 more file(s) referencing `mn_link`

### `mn_members`
- No direct code references found in files that mention this table.

### `mn_misc`
- Primary usage pattern: Selection, Filtering, Sorting
- `htdocs/menus/menu_fantasy_game.php` — In this file, `mn_misc` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' AND mn_misc='Fantasy' ORDER BY mn_name");`
- `htdocs/menus/menu_other_game.php` — In this file, `mn_misc` is used to select values, filter records, and sort results.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' AND mn_misc='Other' ORDER BY mn_name");`

### `mn_name`
- Primary usage pattern: Selection, Filtering, Sorting, PHP Logic, Output Rendering
- `htdocs/menus/menu_supplements.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Supplements' $for ORDER BY mn_name");`
  - Line 10: `if ($ary['mn_newwindow'] == 1){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ar...`
  - Line 11: `else if ($ary['mn_newwindow'] == 2){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='" . $ary['m...`
  - ... plus 3 additional references in this file
- `htdocs/menus/menu_help_right.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' ORDER BY mn_name");`
  - Line 6: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
  - Line 9: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
  - ... plus 1 additional references in this file
- `htdocs/menus/menu_right.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
  - Line 6: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
  - Line 10: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Free Game' ORDER BY mn_name");`
  - ... plus 1 additional references in this file
- `htdocs/menus/menu_data.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Data Files' ORDER BY mn_name");`
  - Line 9: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='data/" . $ary['mn_link'] . "'>" . $ary['mn_name'...`
- `htdocs/menus/menu_fantasy_game.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Game Choice' AND mn_misc='Fantasy' ORDER BY mn_name");`
  - Line 7: `echo "<li><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></li>";`
- `htdocs/menus/menu_generators.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Generators' $for ORDER BY mn_name");`
  - Line 10: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
- `htdocs/menus/menu_genres.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Genres' ORDER BY mn_name");`
  - Line 7: `echo "<li><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></li>";`
- `htdocs/menus/menu_help_left.php` — In this file, `mn_name` is used to select values, filter records, sort results, drive PHP calculations and branching, and render user-visible output.
  - Line 3: `$qry = wa_db_query( $connection, "SELECT * FROM menus WHERE mn_inactive=0 AND mn_group='Free Game' ORDER BY mn_name");`
  - Line 6: `echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ary['mn_name'] . "</a></p>";`
- ... plus 3 more file(s) referencing `mn_name`

### `mn_newwindow`
- Primary usage pattern: PHP Logic, Output Rendering
- `htdocs/menus/menu_supplements.php` — In this file, `mn_newwindow` is used to drive PHP calculations and branching and render user-visible output.
  - Line 10: `if ($ary['mn_newwindow'] == 1){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a href='" . $ary['mn_link'] . "'>" . $ar...`
  - Line 11: `else if ($ary['mn_newwindow'] == 2){ echo "<p style='margin-top: " . $menu_spacing . "px; margin-bottom: " . $menu_spacing . "px;'><a target='_blank' href='" . $ary['m...`

