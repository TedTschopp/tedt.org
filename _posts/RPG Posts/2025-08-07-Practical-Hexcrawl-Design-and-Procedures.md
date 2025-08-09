---
layout: post

title: Draft - Practical Hexcrawl Design and Procedures
subtitle: Turning Blank Wilderness into Living Adventure Space
quote:
excerpt: "A practical, procedural, table-driven approach to running engaging hexcrawls without getting lost in prep."
source:
source-url:
call-to-action:

date: 2025-08-07 09:00:00
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:

description: A grounded guide to building, stocking, and running an evocative hexcrawl using layered density, repeatable procedures, and emergent play loops.
seo-description: A grounded guide to building, stocking, and running an evocative hexcrawl using layered density, repeatable procedures, and emergent play loops.

categories:
- Role Playing Games
- Maps

tags:
- hexcrawl
- wilderness
- procedures
- emergent play
- mapping
keywords: Hexcrawl, wilderness exploration, referee procedures, emergent play, mapping discipline, encounter design

redirect_from:

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: img/2025-08/hex-map-seeded-frontier.webp
image-alt: A weathered campaign hex map with rivers, ridges, ruins, and colored exploration annotations
image-artist: Ted Tschopp (concept + Midjourney assist)
image-artist-URL: https://tedt.org/
image-description: Faded parchment style hex map of a frontier region with layered icons and subtle marginalia notes.
image-title: Seeded Frontier Hex Map

monster-or-magical-or-religious-ideas:
year-the-event-took-place:

mathjax:

order:
---

## Why Hexcrawl?

A good hexcrawl is not a travel simulator. It's a **structured uncertainty engine**. It trades scripted plot for layered geography, living factions, shifting risk envelopes, and consequential navigation choices. The map *is* the argument of play: *"What do you do next?"*

I’ve broken this into repeatable layers you can actually use at the table.

---

## Layer 1: Purpose Before Parchment

Before you draw a single river ask:

- What pressure pushes people outward? (Famine, war, prophecy, scarcity, mandate)
- What resists encroachment? (Terrain, weather, curse zones, political interdictions)
- What rewards deeper push? (Relics, fertile basins, lost routes, metaphysical leverage)
- What changes if the region is fully mapped? (Shifts economy, unlocks factions, unleashes sealed threat)

Write three sentences answering those. Everything else hangs off them. Put them in your referee notes margin. If something doesn’t serve one of those sentences, eject it.

---

## Layer 2: Scale & Discipline

### **Three-Level Hex Zoom Cascade (36 → 6 → 1 Mile)**

This streamlined model keeps only three practical tiers: a broad strategic frame (36), the classic daily exploration layer (6), and the tactically precise local layer (1). Fewer tiers = faster prep and clearer player mental maps.

#### **36 Miles per Hex – Strategic Region**

- **Use:** Map large territories spanning multiple polities or sweeping frontier zones; establish macro terrain, major routes, and anchor regions.
- **Tactical Zoom Trigger:** When players focus on a borderland, frontier, or specific kingdom segment — zoom to 6-mile hexes for wilderness-ready play.
- **Example Settings:**

  - Iberian Peninsula (Reconquista arc)
  - British Isles (Viking or Saxon pressures)
  - Silk Road steppe / caravan corridor

#### **6 Miles per Hex – Wilderness Exploration Core**

- **Use:** Primary hexcrawl layer; one hex ≈ a day’s mixed-foot travel (adjust for terrain). Stock anchors, active sites, and anomalies here.
- **Tactical Zoom Trigger:** Approaching a keyed site cluster, settlement environs, complex valley, or battlefield — zoom to 1-mile hexes for spatial choices.
- **Example Settings:**

  - Contested marches / border counties
  - Mountain basins & upland plateaus
  - Great forest interiors / national parks analogs

#### **1 Mile per Hex – Local Tactical Detail**

- **Use:** Site adjacency, farmland rings, fortress approaches, hamlet clusters, environmental micro-features; supports precise approach vectors.
- **Tactical Zoom Trigger:** Entering settlement limits, staging an assault, micro‑navigating hazards, or transitioning to dungeon / structure / battle maps.
- **Example Settings:**

  - Walled town + fields + mills
  - Fortified pass choke & watch towers
  - Estate, quarry, or battlefield layout

### **Integrated Scale Cascade Table**

| Tier | Hex Size | Scope              | Tactical Zoom Trigger             | Examples                         |
| ---- | -------- | ------------------ | --------------------------------- | -------------------------------- |
| 1    | **36 mi**| Strategic region   | Focus narrows to frontier zone    | Iberian Peninsula, British Isles |
| 2    | **6 mi** | Wilderness core    | Approach a keyed/local site area  | Border counties, mountain basins |
| 3    | **1 mi** | Local tactical     | Enter settlement / assault / setup| Town fields, forts, estates      |

{% include utility/hex-multi-scale.html %}

<script>
// Enhanced debug script for layout monitoring
window.HEX_DEBUG = true; // Enable debug mode for hex-multi-scale.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('[blog-debug] DOM loaded, monitoring canvas layout...');

    const canvas = document.getElementById('hex-multi-scale');
    if (!canvas) {
        console.error('[blog-debug] Canvas not found!');
        return;
    }

    const container = canvas.parentElement;
    const figure = container.parentElement;

    function logLayout(event = 'check') {
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const figureRect = figure.getBoundingClientRect();

        console.log(`[blog-debug] Layout ${event}:`, {
            canvas: {
                width: canvas.width, height: canvas.height,
                style: { width: canvas.style.width, height: canvas.style.height },
                rect: { width: canvasRect.width, height: canvasRect.height }
            },
            container: {
                style: container.getAttribute('style'),
                rect: { width: containerRect.width, height: containerRect.height }
            },
            figure: {
                style: figure.getAttribute('style'),
                rect: { width: figureRect.width, height: figureRect.height }
            }
        });
    }

    // Initial layout check
    setTimeout(() => logLayout('initial'), 100);

    // Monitor for layout changes
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === canvas) {
                logLayout('canvas-resize');
            } else if (entry.target === container) {
                logLayout('container-resize');
            } else if (entry.target === figure) {
                logLayout('figure-resize');
            }
        }
    });

    resizeObserver.observe(canvas);
    resizeObserver.observe(container);
    resizeObserver.observe(figure);

    // Check dependencies and try manual render
    setTimeout(function() {
        console.log('[blog-debug] Dependencies:', {
            Layout: typeof Layout !== 'undefined',
            Hex: typeof Hex !== 'undefined',
            Point: typeof Point !== 'undefined'
        });

        const ctx = canvas.getContext('2d');
        if (ctx) {
            console.log('[blog-debug] Canvas context available');
            ctx.save();
            ctx.fillStyle = 'yellow';
            ctx.fillRect(10, 10, 20, 20);
            ctx.restore();
            console.log('[blog-debug] Test yellow rectangle drawn');
        }

        logLayout('after-test');
    }, 500);
});
</script>

---

## Layer 3: Minimal Base Stocking

Stop trying to lovingly handcraft every cell. Seed with **density bands**:

| Hex State | % of Region | Content Goal | Examples |
|-----------|-------------|--------------|----------|
| Anchor    | 5–10%       | Campaign identity | Capital, Mythic ruin, Great river confluence |
| Active    | 15–25%      | Drive decisions | Faction fort, Trade choke, Weather node |
| Lurking   | 25–35%      | Delayed reveal | Sealed vault, Rotting god husk, Dormant colony |
| Empty (textured) | 30–45% | Contrast & travel pacing | Broken causeway, Burn scar plain, Chatter dunes |

You only fully key Anchors and the first wave of Actives. Lurking slots get a **one-line seed**. Empties get a **terrain note + a travel complication die**.

---

## Layer 4: Terrain = Decision Pressure

Every terrain tag should do work:

- Alter navigation cost
- Modulate encounter table composition
- Convey risk signals (auras, carcasses, weather signatures)
- Telegraph deeper structure (river direction implies mountain ridge, basalt flows imply old catastrophe)

Add **one anomaly per 6–8 hexes**: inverted waterfall, glassed crater ridge, migrating sinkholes. Players remember anomalies more than generic forests.

---

## Layer 5: Encounter Architecture

Encounters are not random events; they’re **state probes**.

Daily Encounter Procedure (example):

1. Morning: Weather shift / omen check
2. Midday: Navigation hazard OR social contact
3. Afternoon: Predator / territorial assertion
4. Night: Camp complication / haunting / pursuit catch-up

Use different dice per zone (d8 civilized edge, d10 frontier, d12 deep) to **widen variance**.

Encounter Table Structure (d12):

- 1–3: Terrain expression (living geology, weather burst)
- 4–5: Faction patrol / scout / courier
- 6: Resource cache / salvage / spoor
- 7–8: Creature with motive intersecting party vector
- 9: Consequence echo from prior choice (fire spreads, rumor manifests)
- 10: Lurking site teaser
- 11: Environmental escalation (storm front walls travel, fae tide rises)
- 12: Clock advancement / front progression

Each result should **ask a question back**: Who sent them? What do you do with it? Do you press on? If a result doesn't change player calculus it's ornamental; cut it.

---

## Layer 6: Time & Clocks

Keep three visible pressure dials:

| Clock | Segments | Advances When |
|-------|----------|---------------|
| Frontier Consolidation | 6 | PCs map anchor + report / Faction treaty |
| Sleeping Engine Wakes  | 8 | Arcane extraction, seismic events |
| Famine Wave            | 4 | Supply convoy lost / harvest delayed |

Mark segments on triggered encounters. When a clock fills, it **re-keys 3–5 hexes** (change occupants / conditions) and you tell the players what shifted. The world moves.

---

## Layer 7: Travel Turn Loop (Referee Card)

I keep a simple loop card:

```text
HEX TURN LOOP
1 Declare destination / vector
2 Check route known? If not -> navigation test
3 Mark movement (log hex ID) & decrement light/rations/water
4 Terrain feature? (if first entry) -> describe + question
5 Encounter slot resolution
6 Player actions (scout, forage, track, research, ritual)
7 Log notable state changes
```

Players learn this rhythm and start **pre-planning actions at step 1**.

---

## Layer 8: Information Economy

Players decide better when **information has tiers**:

- Vague rumor (region-level: “South marsh breathes at night”)
- Directional sign (terrain cue: “Trees bent inland”)
- Confirming detail (multi-sense: “Pulsing heat ripples over mud”)
- Immediate hook (actionable: “Steam vents align like a rune circle”)

Reward triangulation: if they collect three independent confirms, grant a **tactical advantage tag** (e.g. +1 initiative in that hex type, skip first hazard roll, negotiate from strength).

---

## Layer 9: Resource Tension Without Bean Counting

Track only deltas that affect decisions:

- Light: Safe navigation at night / reduces ambush chance
- Food: Force risk-taking if low (forage table may escalate clocks)
- Encumbrance Band: Normal / Strained / Overloaded (each band adds cost or slows hex rate)

Abstract ammo unless the fiction demands scarcity. Let **weather + terrain** be your meaningful attrition.

---

## Layer 10: Factions as Mobile Terrain

Treat factions like shifting terrain overlays:

- Patrol zones (expand / retract based on clocks)
- Influence markers in hexes (affect encounter substitutions)
- Supply lines (cutting them rewrites future tables)

Give each major faction a **stance matrix** (Need, Fear, Leverage). An encounter can flip one cell. Progress visible.

---

## Layer 11: Emergent Sites On Demand

When players laser-focus an empty-ish hex:

1. Roll / pick one Lurking seed to mature early
2. Add a terrain anomaly to justify why it was hidden
3. Tie it to an advancing clock or faction motive
4. Drop a **choice fork**: deeper delve, bargain, escalate risk

This keeps prep elastic and responsive.

---

## Layer 12: Mapping Conventions Players See

Show them a cleaned layer (rivers, coasts, major ridges). Let **player map evolves** with:

- Dashed outline = uncertain edge
- Icon with circle = confirmed site
- Hollow icon = rumored site
- Color wash = hazard zone (after 2+ confirmations)

They will begin setting their own vector goals. Momentum happens when **I ask less “What now?” and more “Are you changing plan?”**

---

## Layer 13: Failure Is Cartographic

Missed navigation? Don’t say “You’re lost.” Say: “You emerge at a basalt rim with steam fissures—this is Hex H13; your intended vector shifts one column east unless you backtrack (costs 1 watch). Proceed?”

Failure produces **new known geography** plus a resource or time tax. Nothing dead-ends. Even ambushes should teach about faction reach or terrain teeth.

---

## Layer 14: Session Close State Log

At end of session capture:

- Hexes entered (ID list)
- New / changed sites
- Clocks advanced (segments + triggers)
- Faction state flips
- Resource bands crossed
- Outstanding player-declared goals

This lets you re-key or escalate **surgically**, not wholesale.

---

## Quick Reference Tables

### Terrain Complication (d8)

1 Sudden grade / scree field (slow)  
2 Torrent surge cuts route  
3 Swarming insects (disadvantage on Perception / Listen)  
4 Heat shimmer / mirage masks ridge line  
5 Rot fog (choose: detour or Constitution saves)  
6 Territorial scent posts (foreshadow predator)  
7 Slumped earth reveals ancient paving  
8 Electromagnetic crackle disrupts compasses  

### Forage Outcome (d6)

1 Nothing; sign of overuse  
2 Low yield; reduces one hunger band  
3 Adequate; stabilize food  
4 Rich pocket; bonus + omen sign  
5 Dangerous cluster; encounter check at +2  
6 Rare herb / catalyst; trade leverage  

### Weather Shift (d10)

1 Static. 2 Pressure drop omen. 3 Sudden wind shear. 4 Horizon wall cloud. 5 Needle rain. 6 Radiant cold inversion. 7 Lightning crawl along ground. 8 Rolling fog banks. 9 Sky glow aurora thread. 10 Cycle reset with anomaly.

---

## Closing Principle

A hexcrawl thrives when **procedures produce fiction** the players want to interrogate. If you feel like you’re pushing them, pull back. Tighten your loops, sharpen anomalies, surface clearer questions. The wilderness will start talking. Let them choose how to answer.

*Run fewer prep marathons. Run tighter cycles with higher information yield.*
