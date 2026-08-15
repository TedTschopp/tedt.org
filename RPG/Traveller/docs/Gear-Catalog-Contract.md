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
catalog filters, a closed book-backed Tech Level help disclosure, book-backed
Law Level guidance for that gear kind, the catalog button, and the custom-entry
fallback. Opening the Add disclosure lazily loads only the manifest needed for
that guidance; opening Tech Level help does not load the catalog index. Choosing
an item from the catalog
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

Maximum Tech Level is a technology cutoff, not a legality or availability
claim. `Up to TL N` includes exact variants whose safely parsed recorded TL, or
the lower bound of a minimum/range expression, is no greater than N. Unknown,
variable, and malformed values are excluded from a numeric maximum and can be
selected separately. The Tech Level
help disclosure explains the selected cutoff, the gear-kind meaning, and the
relevant published book references without making the Add panel permanently
tall.

## Manifest

```json
{
  "schemaVersion": "1.3.0",
  "catalogVersion": "0.3.4",
  "entryCount": 1869,
  "personalDefaultCount": 1209,
  "defaultFilter": "personal",
  "detailShards": ["details-00.json", "details-01.json"],
  "techLevelReference": {
    "rulesContext": "Tech Level definitions and item introduction guidance.",
    "valueSemantics": "world_capability_and_item_introduction_level",
    "description": "Tech Level describes the scientific and industrial capability behind a technology.",
    "filterSemantics": "Up to TL N includes variants whose safely parsed recorded TL, or the lower bound of a minimum/range expression, is no greater than N.",
    "levels": [
      {
        "value": 9,
        "band": "pre_stellar",
        "title": "Pre-Stellar",
        "summary": "A mature pre-stellar technology level.",
        "sourceReferences": [
          {
            "title": "Core Rulebook (Digital)",
            "pages": [5, 6],
            "pageBasis": "printed"
          }
        ]
      }
    ],
    "higherLevels": {
      "minimum": 16,
      "title": "Advanced",
      "summary": "Advanced technology beyond mainstream Third Imperium science, with no theoretical upper limit.",
      "sourceReferences": [
        {
          "title": "Core Rulebook (Digital)",
          "pages": [6],
          "pageBasis": "printed"
        }
      ]
    },
    "unknownDescription": "No usable TL is recorded. Unknown is not TL0 and does not imply legality or availability.",
    "guidanceByKind": {
      "weapon": {
        "valueRole": "first_appearance",
        "description": "A weapon TL normally marks the version's first appearance.",
        "sourceReferences": [
          {
            "title": "Core Rulebook (Digital)",
            "pages": [73],
            "pageBasis": "printed"
          }
        ]
      },
      "armour": {
        "valueRole": "manufacturing_requirement",
        "description": "An armour TL normally identifies the capability needed to manufacture that version.",
        "sourceReferences": []
      },
      "augment": {
        "valueRole": "manufacturing_requirement",
        "description": "An augment TL normally identifies the capability needed to manufacture that version.",
        "sourceReferences": []
      },
      "equipment": {
        "valueRole": "manufacturing_requirement",
        "description": "The exact meaning varies by equipment subtype; use the item-specific explanation.",
        "sourceReferences": []
      }
    },
    "sourceReferences": [
      {
        "title": "Core Rulebook (Digital)",
        "pages": [5, 6, 226],
        "pageBasis": "printed"
      }
    ],
    "notes": "Imports, specialist access, and local repair capability can vary."
  },
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
            "shortLabel": "Light assault weapons and submachine guns",
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
            "shortLabel": "Cloth armour",
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
            "shortLabel": "No general augment threshold; check item rules",
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
            "shortLabel": "No general equipment threshold; check item rules",
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
    "undeterminedShortLabel": "No exact source-backed level",
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

`techLevelReference` is the player-facing, source-backed explanation of TL and
the Maximum Tech Level filter. `levels` contains one entry for every integer
from 0 through 15. `higherLevels` supplies the shared explanation used for UI
cutoffs 16 through 21 and for other recorded values at 16 or above. Each entry
contains a short band title, player-facing summary, and supporting published
book-title references. `guidanceByKind` distinguishes weapon first-appearance
semantics from the type-specific meaning supplied for armour, augments, and
equipment. The consumer renders each supplied description as written; it must
not assume every equipment subtype uses a manufacturing threshold.
`unknownDescription` must state that an unusable value is not TL0 and does not
determine legality or availability.

Root `sourceReferences` are limited to evidence for the general scale and world
context. Selected help combines those general references with only the selected
level (or `higherLevels`) references and that control's `guidanceByKind`
references. It never cites another gear kind's guidance. The consumer retains
`referenceType`, accepts explicitly identified Tech Level scale/world evidence,
rejects kind-marked root evidence, and defensively omits an ambiguous root
reference when it duplicates any kind-specific citation.

The consumer accepts camelCase and snake_case aliases for this object and its
children. A schema 1.2 manifest without `techLevelReference` remains usable:
the Maximum Tech Level filter keeps its existing recorded-value comparison and
the help disclosure says that book-backed guidance is unavailable for that
catalog version. It does not invent a citation.

`lawLevelReference` is the player-facing, source-backed description of the
cumulative Law Level ladder. Every numbered `levels` entry supplies separate
guidance for `weapon`, `armour`, `augment`, and `equipment`. Each guidance object
owns the `sourceReferences` that support that kind at that level. Its
`shortLabel` is concise, kind-specific option text: weapon controls must not
borrow armour terminology, and kinds outside the global table plainly say that
there is no general threshold. The UI prefixes these labels with `Level N` (or
`9+`) while preserving the stored filter value. `undeterminedShortLabel`
provides the shared concise suffix for the Undetermined option. `ruleStatus`
distinguishes a named table threshold from a level with no new threshold or a
gear kind outside the Core weapon-and-armour table. The character sheet must
not turn an `outside_global_table` description into a fabricated numeric ban or
append cumulative-ladder language to it. The Add control renders the selected
level's description for its own gear kind and cites only that guidance object's
published book titles and pages.

Static HTML contains the same kind-specific concise option labels and useful
Any-state explanations as a network-failure fallback. Manifest load updates
labels immediately when `shortLabel` is available. Neither the Law Level panel
nor the closed Tech Level help uses an instructional loading placeholder as its
initial content.

For compatibility with a transitional 1.1-style projection that supplies only
root `lawLevelReference.sourceReferences`, the UI still renders the guidance
copy but does not attach those all-root citations to a specific gear kind. It
instead states that no kind-specific reference is available.

## Index and detail shards

Both the index and each detail shard use the same envelope:

```json
{
  "schemaVersion": "1.3.0",
  "catalogVersion": "0.3.4",
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
  "techLevelDescription": "This exact weapon version first appears at TL 10.",
  "techLevelSourceReferences": [
    {
      "title": "Core Rulebook (Digital)",
      "pages": [73],
      "pageBasis": "printed"
    }
  ],
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

`techLevelDescription` explains what the exact variant's recorded TL means.
`techLevelSourceReferences` cites only the book evidence for that exact
explanation and appears in a closed Tech Level disclosure in the Gear Locker.
The UI must not substitute the manifest's global TL scale citations as though
they support the exact item. When these fields are absent in a schema 1.2 or
transitional detail record, the disclosure gives a neutral compatibility
message and directs the player to the item's general rules reference.

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
    "schemaVersion": "1.3.0",
    "catalogVersion": "0.3.4",
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
