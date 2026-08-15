# Traveller Gear Catalog Contract

The character sheet reads a public, player-facing projection from
`RPG/Traveller/data/gear-catalog/`. The complete extraction and its source text
remain outside the website repository.

## Public files

- `manifest.json` describes the projection and points to `index.json`.
- `index.json` contains one compact search record for every exact gear variant.
- `details-00.json` through `details-15.json` contain the condensed description,
  rules summary, and book-title references used by the detail panel.

The picker loads the manifest and index once. It fetches only the selected
item's detail shard. If either request fails, the manual entry form and saved
table rows remain usable.

## Manifest

```json
{
  "schemaVersion": "1.0.0",
  "catalogVersion": "0.3.1",
  "entryCount": 1869,
  "personalDefaultCount": 1209,
  "defaultFilter": "personal",
  "detailShards": ["details-00.json", "details-01.json"]
}
```

Paths are resolved relative to `manifest.json`; `index.json` is the default
index path. The consumer also accepts an optional `index` path string, an
`index` object containing `path`, or `indexPath` for forward compatibility.

## Index and detail shards

Both the index and each detail shard use the same envelope:

```json
{
  "schemaVersion": "1.0.0",
  "catalogVersion": "0.3.1",
  "entryCount": 1869,
  "items": []
}
```

Each index item has this shape:

```json
{
  "itemId": "item:weapon:example:0123456789ab",
  "definitionId": "definition:0123456789abcdef01234567",
  "variantId": "variant:0123456789abcdef01234567",
  "kind": "weapon",
  "sheetRole": "inventory",
  "personalDefault": true,
  "summaryStatus": "complete",
  "reviewFlags": [],
  "requiredSkillStatus": "resolved",
  "domains": ["personal"],
  "combatScale": "personal",
  "mountContext": "handheld",
  "displayName": "Example Weapon - TL 10",
  "statLine": "TL 10 | Mass 2 kg | Cost Cr500 | Range 50m | Damage 3D",
  "detailShard": "details-00.json",
  "sheet": {
    "name": "Example Weapon",
    "tl": "10",
    "skill": "Gun Combat (slug)",
    "damage": "3D",
    "range": "50m",
    "weight": "2",
    "magazine": "20"
  }
}
```

The index is intentionally compact. Initial search covers name, stat line, role,
domain, and the exact `sheet` fields. Items with the same `itemId` are distinct
variants; `variantId` is the unique lookup key.

The matching detail record is intentionally smaller and keyed by `variantId`:

```json
{
  "variantId": "variant:0123456789abcdef01234567",
  "summaryStatus": "complete",
  "reviewFlags": [],
  "descriptionSummary": "A short, independently written description.",
  "rulesSummary": "A concise explanation of how a player resolves its rules.",
  "sourceReferences": [
    {
      "title": "Central Supply Catalogue",
      "pages": [112],
      "pageBasis": "pdf"
    }
  ]
}
```

The web projection never includes source filenames or verbatim book passages.
Every source reference supplies the published book `title`; page numbers may be
printed-page or PDF-page references as identified by `pageBasis`.

`summaryStatus: "needs_review"` or a non-empty `reviewFlags` array produces a
visible Source Review Needed notice. The panel translates known flags into
player-readable cautions and directs the player to the cited source. A weapon
whose `requiredSkillStatus` is `ambiguous` or `unresolved` must have an empty
`sheet.skill`; the UI repeats that warning and leaves the table's Skill field
blank and editable. This keeps uncertain extraction results from appearing
settled.

Supported `kind` values are `weapon`, `armour`, `augment`, and `equipment`.
Supported `sheetRole` values are `inventory`, `installed_component`,
`vehicle_system`, `spacecraft_system`, `innate_attack`, and `innate_defence`.
The default Personal Gear view selects only records where `personalDefault` is
`true`. It includes ordinary personal inventory and personal installed
components such as augments, while excluding innate attacks and defences,
vehicle systems, spacecraft systems, and inventory rows whose scale or mount
is not personal. All Catalog Entries exposes every role and domain.

The `sheet` object is the authoritative table mapping and always stores strings:

- Weapon: `name`, `tl`, `skill`, `damage`, `range`, `weight`, `magazine`.
- Armour: `name`, `rating`, `tl`, `radiation`.
- Augment: `type`, `tl`, `improvement`.
- Equipment: `name`, `tl`, `mass`, `cost`.

## Character save extension

Catalog-backed rows retain the existing table fields for legacy import,
offline rendering, and human-readable exports. They add two optional objects:

```json
{
  "name": "Example Weapon",
  "tl": "10",
  "skill": "Gun Combat (slug)",
  "damage": "3D",
  "range": "50m",
  "weight": "2",
  "magazine": "20",
  "catalogRef": {
    "schemaVersion": "1.0.0",
    "catalogVersion": "0.3.1",
    "itemId": "item:weapon:example:0123456789ab",
    "definitionId": "definition:0123456789abcdef01234567",
    "variantId": "variant:0123456789abcdef01234567"
  },
  "state": {
    "quantity": 1,
    "equipped": false,
    "notes": ""
  }
}
```

`catalogRef` is the exact catalog identity. `state` belongs to the character and
remains editable without changing the shared catalog. Characters that lack
either object continue to load and export in the original direct-character
format. The browser storage keys are unchanged.
