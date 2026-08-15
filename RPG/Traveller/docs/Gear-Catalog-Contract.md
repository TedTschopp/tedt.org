# Traveller Gear Catalog Contract

The character sheet reads a public, player-facing projection from
`RPG/Traveller/data/gear-catalog/`. The complete extraction and its source text
remain outside the website repository.

## Public files

- `manifest.json` describes the projection and points to `index.json`.
- `index.json` contains one compact search record for every exact gear variant.
- `details-00.json` through `details-15.json` contain the condensed description,
  rules summary, and book-title references used by the detail panel.

The character sheet does not fetch catalog JSON during ordinary page load.
Each gear table appears before a closed Add disclosure. Opening that disclosure
reveals the Maximum Tech Level, First Restricted Law Level, and Legal Category
catalog filters, book-backed Law Level guidance for that gear kind, the catalog
button, and the custom-entry fallback. Opening the disclosure lazily loads only
the manifest needed for that guidance. Choosing an item from the catalog
launches one shared Gear Locker and loads the index once. It fetches only the
selected exact variant's detail shard. If a request fails, the collapsible
custom-entry forms and saved table rows remain usable.

The Gear Locker groups search results by `itemId` and labels the group with
`canonicalName`. A singleton group opens directly. A group with multiple
rulebook, Tech Level, or configuration variants asks the player to choose an
exact `variantId` before Add is enabled. This keeps browsing concise without
discarding any catalog entries.

The Add-disclosure filters are applied to exact variants before `itemId`
grouping. Maximum Tech Level compares the variant's table TL. First Restricted
Law Level is an exact classification filter, not a claim that an item is legal
on a selected world. Legal Category is also an exact classification filter.
The filters never alter gear already on the character sheet.

## Manifest

```json
{
  "schemaVersion": "1.2.0",
  "catalogVersion": "0.3.3",
  "entryCount": 1869,
  "personalDefaultCount": 1209,
  "defaultFilter": "personal",
  "detailShards": ["details-00.json", "details-01.json"],
  "lawLevelReference": {
    "valueSemantics": "first_restricted_world_law_level",
    "description": "The numbered ladder is cumulative.",
    "levels": [
      {
        "value": "4",
        "title": "Assault weapons and cloth armour",
        "cumulative": true,
        "guidanceByKind": {
          "weapon": {
            "ruleStatus": "named_threshold",
            "description": "Light assault weapons and submachine guns first become restricted.",
            "sourceReferences": [
              {
                "title": "Core Rulebook (Digital)",
                "pages": [224],
                "pageBasis": "printed"
              }
            ]
          },
          "armour": {
            "ruleStatus": "named_threshold",
            "description": "Cloth armour first becomes restricted.",
            "sourceReferences": [
              {
                "title": "Core Rulebook (Digital)",
                "pages": [224],
                "pageBasis": "printed"
              }
            ]
          },
          "augment": {
            "ruleStatus": "outside_global_table",
            "description": "The Core table gives no blanket numeric ladder for augments.",
            "sourceReferences": [
              {
                "title": "Core Rulebook (Digital)",
                "pages": [213, 223],
                "pageBasis": "printed"
              }
            ]
          },
          "equipment": {
            "ruleStatus": "outside_global_table",
            "description": "General equipment uses exact-item or world rules.",
            "sourceReferences": [
              {
                "title": "Core Rulebook (Digital)",
                "pages": [223],
                "pageBasis": "printed"
              }
            ]
          }
        }
      }
    ],
    "undeterminedDescription": "No exact source-backed first restriction level is assigned.",
    "sourceReferences": [
      {
        "title": "Core Rulebook (Digital)",
        "pages": [223, 224],
        "pageBasis": "printed"
      }
    ]
  }
}
```

Paths are resolved relative to `manifest.json`; `index.json` is the default
index path. The consumer also accepts an optional `index` path string, an
`index` object containing `path`, or `indexPath` for forward compatibility.

`lawLevelReference` is the player-facing, source-backed description of the
cumulative Law Level ladder. Every numbered `levels` entry supplies separate
guidance for `weapon`, `armour`, `augment`, and `equipment`. Each guidance object
owns the `sourceReferences` that support that kind at that level. `ruleStatus`
distinguishes a named table threshold from a level with no new threshold or a
gear kind outside the Core weapon-and-armour table. The character sheet must
not turn an `outside_global_table` description into a fabricated numeric ban or
append cumulative-ladder language to it. The Add control renders the selected
level's description for its own gear kind and cites only that guidance object's
published book titles and pages.

For compatibility with a transitional 1.1-style projection that supplies only
root `lawLevelReference.sourceReferences`, the UI still renders the guidance
copy but does not attach those all-root citations to a specific gear kind. It
instead states that no kind-specific reference is available.

## Index and detail shards

Both the index and each detail shard use the same envelope:

```json
{
  "schemaVersion": "1.2.0",
  "catalogVersion": "0.3.3",
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
  "lawLevel": "6",
  "legalCategory": "category_2",
  "canonicalName": "Example Weapon",
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

The index is intentionally compact. Initial search covers canonical and display
names, stat line, role, domain, legality classification, and the exact `sheet`
fields. `canonicalName` is the player-facing item-group label. Items with the
same `itemId` are exact variants of that group; `variantId` is the unique lookup
key.

`lawLevel` and `legalCategory` are required string classifications for every
exact variant in the public projection:

- `lawLevel` is the first world Law Level at which possession or use is banned
  or restricted: `"0"` through `"8"`, `"9+"`, or `"undetermined"`.
- `legalCategory` is the Central Supply Catalogue classification: Category 1 —
  Unrestricted, Category 2 — Civilian Use, Category 3 — Paramilitary Use,
  Category 4 — Military Use, Category 5 — Restricted Military Use,
  `"prohibited"`, or `"undetermined"`. The stored enum values for numbered
  categories are `"category_1"` through `"category_5"`.

Missing, blank, or unstructured source data is emitted as the literal
`"undetermined"`; the web consumer also normalizes an absent or unsupported
value to `"undetermined"`. Determined values come from a direct item rule or a
conservative match between an exact source-backed class and the cited Core
Rulebook or Central Supply Catalogue class table. The classifier does not use
fuzzy matching, and unmatched or ambiguous entries remain `"undetermined"`.

The matching detail record is intentionally smaller and keyed by `variantId`:

```json
{
  "variantId": "variant:0123456789abcdef01234567",
  "summaryStatus": "complete",
  "reviewFlags": [],
  "descriptionSummary": "A short, independently written description.",
  "rulesSummary": "A concise explanation of how a player resolves its rules.",
  "lawLevelDescription": "First restricted at Law Level 4 because it matches the cited light-assault class.",
  "lawLevelSourceReferences": [
    {
      "title": "Core Rulebook (Digital)",
      "pages": [224],
      "pageBasis": "printed"
    }
  ],
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

`lawLevelDescription` explains the exact variant's assigned or undetermined
Law Level without claiming that an undetermined item is legal.
`lawLevelSourceReferences` cites the book evidence for that explanation and is
shown separately from the item's general `sourceReferences` in the Gear Locker.

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
    "schemaVersion": "1.2.0",
    "catalogVersion": "0.3.3",
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
