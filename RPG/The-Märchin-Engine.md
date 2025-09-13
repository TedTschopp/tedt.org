---
title: "Three‑Layer Plot Library (Scene → Episode → Meta)"
date: 2025-09-13
tags: ["TTRPG", "GM Tools", "Clocks", "Plot Design"]
summary: "A complete three‑layer plot library with scene clocks, thresholds, episode arcs, meta hooks, seeds for 7 genres, and scores."
---


# The Märchin Engine — GM Guide to the Web Plot Library

1. [The Märchin Engine — GM Guide to the Web Plot Library](#the-märchin-engine--gm-guide-to-the-web-plot-library)
   1. [0) What this webpage is (and why it’s useful)](#0-what-this-webpage-is-and-why-its-useful)
   2. [1) Glossary (all terms you’ll see on the page)](#1-glossary-all-terms-youll-see-on-the-page)
   3. [2) How to navigate the page (quick UI tour)](#2-how-to-navigate-the-page-quick-ui-tour)
   4. [3) Session prep in 12 minutes (for any ruleset)](#3-session-prep-in-12-minutes-for-any-ruleset)
   5. [4) Running play at the table — the loop](#4-running-play-at-the-table--the-loop)
      1. [During a scene (≈30 minutes)](#during-a-scene-30-minutes)
      2. [Between scenes](#between-scenes)
      3. [End of session](#end-of-session)
   6. [5) Tick sizing and difficulty (system‑agnostic core)](#5-tick-sizing-and-difficulty-systemagnostic-core)
   7. [6) System adapters (D\&D, Traveller, GURPS, BRP)](#6-system-adapters-dd-traveller-gurps-brp)
      1. [6.1 D\&D / d20 (5e or similar)](#61-dd--d20-5e-or-similar)
      2. [6.2 Traveller (2d6 + skill + DM; “Effect” = total − 8)](#62-traveller-2d6--skill--dm-effect--total--8)
      3. [6.3 GURPS (3d6 roll under Skill; Margin of Success/Failure)](#63-gurps-3d6-roll-under-skill-margin-of-successfailure)
      4. [6.4 BRP / d100 (Regular/Hard/Extreme/Critical; Fumbles)](#64-brp--d100-regularhardextremecritical-fumbles)
   8. [7) End‑to‑end example (10 minutes to read, 90 minutes to run)](#7-endtoend-example-10-minutes-to-read-90-minutes-to-run)
   9. [8) Using the Meta layer well (factions, campaign, seasons)](#8-using-the-meta-layer-well-factions-campaign-seasons)
   10. [9) Printing aids from the page](#9-printing-aids-from-the-page)
   11. [10) Troubleshooting (common issues → quick fixes)](#10-troubleshooting-common-issues--quick-fixes)
   12. [11) Quick reference (laminate this)](#11-quick-reference-laminate-this)
2. [Example or Play **The Gala Heist** — Three Layers in Action](#example-or-play-the-gala-heist--three-layers-in-action)
   1. [Cast \& Setup](#cast--setup)
   2. [The Three Layers we’ll run](#the-three-layers-well-run)
      1. [Layer 3 — **Meta** (always on)](#layer-3--meta-always-on)
      2. [Layer 2 — **Episode Arc (8): “Steal the Starling”**](#layer-2--episode-arc-8-steal-the-starling)
      3. [Layer 1 — **Scene 1 Clocks** (first 30 minutes)](#layer-1--scene-1-clocks-first-30-minutes)
   3. [Actual Example](#actual-example)
      1. [Scene 1 — Red Carpets \& Warded Glass (Casing)](#scene-1--red-carpets--warded-glass-casing)
      2. [Scene 2 — Breach Under a Toast](#scene-2--breach-under-a-toast)
      3. [Scene 3 — Extraction (Climax)](#scene-3--extraction-climax)
   4. [Post‑Game Board (how the layers moved)](#postgame-board-how-the-layers-moved)
   5. [“Make It Look Easy” — How to run this tonight](#make-it-look-easy--how-to-run-this-tonight)
   6. [Quick Reskins (same scene beats, new skin)](#quick-reskins-same-scene-beats-new-skin)
   7. [What made this session **sing** (for your table, too)](#what-made-this-session-sing-for-your-table-too)
      1. [Want the table kit?](#want-the-table-kit)



*How to run three‑layer clocks at your table with adaptation rules for D\&D, Traveller, GURPS, and BRP*

## 0) What this webpage is (and why it’s useful)

The page at **The Märchin Engine** is an **interactive library** of clock‑driven plots built for a **three‑layer structure**. It lets you:

* **Browse plots** that each include: the **Scene** clocks you’ll use at the table, the **Episode** beats for tonight, and the **Meta** hooks that move factions/season/campaign forward.
* **Search** by keyword and **highlight seeds by genre** (Vaesen, Gamma World, High Fantasy, Cyberpunk, Space Opera, Superhero, Modern Investigation).
* Jump from a **table of contents** to any plot; each plot page shows **scene clocks**, **25/50/75% thresholds**, **episode arc beats**, **meta‑link rules**, and **genre seeds**. ([Ted Tschopp's Homepage][1])

## 1) Glossary (all terms you’ll see on the page)

**Clock** — A segmented progress track you fill (**tick**) or reduce (**erase**). Common sizes: **4 / 6 / 8 / 10 / 12** segments.

**Tick / Erase** — Add or remove filled segments on a clock.

**Layer** — The engine runs in **three tempos** at once:

* **Scene Layer (≈30 minutes):** Interlocked clocks for the immediate situation (e.g., *Objective 8*, *Alarm 6*, *Hazard 6*, *Exit 4*).
* **Episode Layer (8–10):** Tonight’s mission throughline (e.g., *The Job*, *Name the Truth*).
* **Meta Layer (8–16):** Always‑on background clocks: **Faction clocks** (one per major faction), a **Campaign Goal** clock (the party’s long arc), and a **Seasonal Throughline** (festival/ritual/weather calendar). ([Ted Tschopp's Homepage][1])

**Threshold (25% / 50% / 75%)** — Predetermined beats on a clock that **change the situation** (new guard route, ritual unlock, last‑stand choice).

**Threshold Tap** — When a **Scene** clock crosses **25/50/75%**, you **tick the Episode clock**; at 50% or 75% you may also tick a relevant **Meta** clock (a faction notices, the season stirs).

**Outcome Tap** — At the **end of a scene**, success/failure/mixed results **tick a Meta clock** (e.g., success → **Campaign/Ally +1**, failure → **Opposition/Season +1**).

**Echo Action** — A **player‑initiated conversion**: spend table currency (Intel, Favor, Lore, Rep, Salvage, Faith, Clout—use what fits your game) to **tick or erase** a chosen Meta clock by 1.

**Time Drift** — At the **end of each 30‑minute scene**, tick **Seasonal +1** and **one reactive Faction +1** (pause this during a climax).

**Finisher** — A finale move unlocked near **75%** (e.g., *Showdown*, *Seal the Breach*, *Stabilize*).

**Pushback** — A listed way for players to **erase** enemy/faction progress (e.g., “cleanup job erases 2 Heat”).

**Seeds** — Short, setting‑flavored prompts for Vaesen, Gamma World, High Fantasy, Cyberpunk, Space Opera, Superhero, Modern Investigation.

## 2) How to navigate the page (quick UI tour)

1. **Search box** — Type any keyword: plot name, clock, threshold effect, or seed text; the list narrows live. ([Ted Tschopp's Homepage][1])
2. **“Highlight seeds for” menu** — Choose a genre to highlight those seeds in each plot (helps re‑skin fast). ([Ted Tschopp's Homepage][1])
3. **TOC tiles** — Click a plot to jump to its section (each tile shows its overall score).
4. Inside a plot:

   * **Scene Layer — Clocks**: Names, segment counts, and concise descriptions.
   * **Thresholds**: 25/50/75% effects—copy these onto your paper/virtual cards.
   * **Episode Arc (8–10)**: Tonight’s beats in order.
   * **Meta Hooks**: Exactly **when** and **which** meta clocks tick, plus **Echo** and **Pushback** hooks.
   * **Genre Seeds**: Ready reskins.

> To print physical aids, follow the page’s links to **Clock Cards** and **GM Procedure One‑Pager**. ([Ted Tschopp's Homepage][1])

## 3) Session prep in 12 minutes (for any ruleset)

**A) Pick tonight’s Episode**

* From the page, choose a plot that fits your goal (e.g., **Heist**, **Investigation**, **Ritual**). Note the **Episode Arc (8–10)** beats.

**B) Choose 3–4 Scene clocks** for the **first scene**

* Typical set: **Objective 8**, **Alarm 6**, **Hazard 6**, **Exit 4** (swap to fit the plot).
* Write **25/50/75% thresholds** as shown on the page (modify to taste).

**C) Select Meta clocks** to keep visible this session

* **Campaign Goal (12–16)**, **Seasonal (8 or 12)**, and **2–3 Faction clocks** (Influence/Project/Legitimacy).
* Jot **what ticks them** (from each plot’s **Meta Hooks**).

**D) Currency**

* Decide which currencies exist in your setting (e.g., *Intel*, *Favors*, *Lore*). Tell players they can **Echo** to move Meta.

**E) Safety & difficulty**

* Decide your **tick sizes** (see §5), and set **difficulty bands** for your system (DCs, Target Numbers, etc.).

## 4) Running play at the table — the loop

### During a scene (≈30 minutes)

1. **Frame it**: Stakes and which **Scene clocks** are in play.
2. **Play to the first threshold**: Ask “What do you do?”; call for rolls; on results **tick/erase** the relevant clock(s).
3. **Announce threshold effects** at **25/50/75%** (new guard route, public move, finale unlock).
4. **Offer Echo**: Once per scene, remind players they can **spend currency** to tick/erase a **Meta**.
5. **Close the scene**: Resolve the immediate objective or escalate naturally.

### Between scenes

* Apply **Outcome Taps** (success/failure/mixed → Meta ticks).
* Apply **Time Drift**: **Seasonal +1**, and **one reactive Faction +1**.
* If the **Episode Arc** is ≈ **75%**, **pause Time Drift** and run the **Finisher** in the next scene.

### End of session

* If any **Meta** clock fills, **end with a stinger** and log “**permission to schedule**” a finale built around that meta (don’t auto‑run it).
* Award currency; reveal how factions reacted in downtime.

## 5) Tick sizing and difficulty (system‑agnostic core)

Use these **tick magnitudes** as defaults:

* **+2 ticks**: big swing, critical success, brilliant plan, or heavy resource spend.
* **+1 tick**: clear success; time passes under pressure.
* **0 / +1 trade**: success **with a cost** (progress **and** a small enemy/hazard tick).
* **Enemy +1**: clear failure; time lost; you’re noisy.
* **Enemy +2**: fumble, botch, or a hard consequence lands.
* **Erase 1**: clever mitigation, perfect cover, or “clean up the scene” action.

> Apply ticks to **the clock that makes the most sense** (Objective, Alarm, Hazard, etc.). Keep **Episode**/**Meta** taps as described in the plot’s Meta Hooks.

## 6) System adapters (D\&D, Traveller, GURPS, BRP)

Use your native resolution mechanics; **map the result quality to ticks**. The tables below keep pacing consistent.

### 6.1 D\&D / d20 (5e or similar)

Use normal **ability checks / tool checks / attack rolls** vs. a **DC**.
Suggested **DC bands** (tune per tier): 10 easy • 13–15 standard • 16–18 hard • 20+ extreme.

| d20 outcome                                    | Tick guidance                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| **Natural 20** or beat DC by **10+**           | **+2** to the target clock **or** **erase 1** on a threat (GM’s call). |
| **Success** (meet/exceed DC)                   | **+1** to the target clock.                                            |
| **Success at a cost** (use 5e’s optional rule) | **+1** to target **and** **enemy/hazard +1**.                          |
| **Fail by ≤5**                                 | **Enemy/hazard +1**.                                                   |
| **Fail by ≥6** or **natural 1**                | **Enemy/hazard +2** (and possibly trigger a threshold effect early).   |

**Advantage/Disadvantage**: On **Advantage**, you may **upgrade** one step (e.g., success→+1 *plus* erase 1 on Alarm **or** push a small clock). On **Disadvantage**, **downgrade** one step (success→success‑with‑cost).

### 6.2 Traveller (2d6 + skill + DM; “Effect” = total − 8)

| Traveller Effect | Tick guidance                                                                     |
| ---------------- | --------------------------------------------------------------------------------- |
| **+6 or more**   | **+2** to target or **erase 1** on opposition; narrate a decisive technical edge. |
| **+3 to +5**     | **+1** to target.                                                                 |
| **+1 to +2**     | **+1** to target **and** minor **enemy/hazard +1** (you rushed, left traces).     |
| **0 to −2**      | **Enemy/hazard +1** (you stall or attract notice).                                |
| **−3 or worse**  | **Enemy/hazard +2** (bad jam, loud signature, collateral).                        |

**Boon/Bane**: Upgrade/downgrade one row. **Effect** can also **erase 1** on a related threat when it’s +6 or higher.

### 6.3 GURPS (3d6 roll under Skill; Margin of Success/Failure)

| GURPS result                         | Tick guidance                                                            |
| ------------------------------------ | ------------------------------------------------------------------------ |
| **Critical success** or **MoS ≥ 10** | **+2** to target or **erase 1** on threat.                               |
| **MoS 5–9**                          | **+1** to target.                                                        |
| **MoS 1–4**                          | **+1** to target **and** minor **enemy/hazard +1** (time or noise cost). |
| **MoF 1–4**                          | **Enemy/hazard +1**.                                                     |
| **MoF ≥ 5** or **critical failure**  | **Enemy/hazard +2**.                                                     |

**Task difficulty modifiers** apply as normal. Use **Time Use** rules to justify **Time Drift** between scenes.

### 6.4 BRP / d100 (Regular/Hard/Extreme/Critical; Fumbles)

| BRP degree                                               | Tick guidance                                       |
| -------------------------------------------------------- | --------------------------------------------------- |
| **Critical or Extreme** (≤ skill/5; edition‑specific)    | **+2** to target or **erase 1** on threat.          |
| **Hard** (≤ skill/2)                                     | **+1** to target.                                   |
| **Regular** (≤ skill)                                    | **+1** to target **and** minor **enemy/hazard +1**. |
| **Failure**                                              | **Enemy/hazard +1**.                                |
| **Fumble** (per edition, e.g., 00 or 96–00 at low skill) | **Enemy/hazard +2**.                                |

**Opposed tests**: Compare degrees; the winner applies their tick row; a tie → **success at a cost** for the acting side.

## 7) End‑to‑end example (10 minutes to read, 90 minutes to run)

**Plot**: *Heist / Infiltration* → Episode: “The Job”
**Scene clocks**: *Objective 8*, *Alarm 6*, *Hazard 6*, *Exit 4*
**Meta active**: *Campaign Goal 12*, *Seasonal 8*, *Emerald Court Influence 10*, *City Watch Legitimacy 8*

**Scene 1 (Casing, 30 min)**

* Players gather intel (D\&D Investigation vs DC 15): success → **Objective +1**.
* **25% Alarm** threshold triggers: new patrol path (add a complication).
* Player spends **Intel (Echo)** to **erase 1** on City Watch Legitimacy (they plant a story).
* **End scene**: Outcome = **success** (they have a plan) → **Campaign Goal +1**. **Time Drift**: **Seasonal +1**, **Emerald Court +1**.

**Scene 2 (Breach, 30 min)**

* A failure on stealth (Traveller Effect −3) → **Alarm +2**; triggers **50% Alarm** (lockdown of a wing).
* Great tool use (GURPS critical) to bypass a ward → **Objective +2** and **erase 1** on Hazard.
* **End scene**: mixed (they got in but left traces) → **Campaign +1** **and** **Opposition +1**. Drift: **Seasonal +1**, reactive **City Watch +1**.

**Scene 3 (Extraction, 30 min; Episode ≈75%)**

* **Pause Time Drift** for the climax.
* Finisher unlocked (from thresholds): **Exit Window 4** races to close.
* BRP Hard success on the carry → **Objective +1**; Exit hits 3/4; a last push (D\&D success at cost) **Objective +1** and **Alarm +1**.
* **End episode**: **Success** → **Ally Faction +1** and a **stinger**: Emerald Court announces a gala next week (permission to schedule a finale).

## 8) Using the Meta layer well (factions, campaign, seasons)

* Keep **2–3 Faction clocks** visible (even if their thresholds are veiled) so players **feel** the world moving.
* Use **Outcome Taps** to ensure **every scene** advances *something*. Success should grow **Campaign/Allies**; failure should fuel **Opposition/Season**.
* Offer **Echo Actions** every scene so players can **steer the campaign tempo** (spend Intel to accelerate your *Campaign Goal*, or burn Favor to **erase** Doom).
* Treat **Seasonal Throughline** as your *metronome*: it **ticks at scene end**, surfaces omens, and unlocks a **seasonal set‑piece** around 50%. (Pause drift during climaxes.)

## 9) Printing aids from the page

* Click the links on the page to get the **Clock Cards** (4 per letter page) and the **GM Procedure One‑Pager**. Use pencil so you can reuse cards. ([Ted Tschopp's Homepage][1])
* Keep the **Episode Arc card** in the middle of your table; rotate **Scene** cards in/out every 30 minutes; park **Meta** cards at the top edge so everyone sees the slow drum.

## 10) Troubleshooting (common issues → quick fixes)

* **“Alarms always spike too fast.”**
  Lower Alarm to **4 segments** but **soften** its thresholds; or make **critical stealth** erase 1 Alarm.

* **“Players don’t touch Echo Actions.”**
  Hand out **visible currency tokens**. Prompt once per scene: “Anyone want to spend Intel/Favor?”

* **“Meta clocks race past the Episode.”**
  Use the **Climax Pause**: **no Time Drift** during the final scene; limit outcome taps to **one** Meta on the finale.

* **“Too many clocks on the table.”**
  Cap to **3–4 Scene** clocks at a time; keep **Meta** at **Campaign + Seasonal + two Factions**.

* **“D\&D doesn’t do success‑with‑cost.”**
  Use **DMG’s optional rule** (or simply narrate a minor cost: time, noise, position).

## 11) Quick reference (laminate this)

**Scene (≈30m)**

* Put down 3–4 clocks with written **25/50/75** thresholds.
* Roll → **Tick/Erase** the right clock(s); call the threshold effects.
* Offer **Echo**; **end scene** → Outcome Tap → **Time Drift** (Seasonal +1; one Faction +1).

**Episode (8–10)**

* 25%: the plan becomes clear • 50%: momentum • 75%: **Finisher unlocked** • Full: **credits** (then stinger).

**Meta (8–16)**

* Keep **Campaign Goal**, **Seasonal**, and **2–3 Factions** visible.
* Use **Pushback** missions to **erase** faction progress; use **Echo** to steer Hope/Doom.

# Example or Play **The Gala Heist** — Three Layers in Action

*An example session you can emulate at your own table (D\&D / Traveller / GURPS / BRP friendly)*

> **What you’ll see:** a full table read with **GM + players**, three **layers** running at once (Scene → Episode → Meta), clocks **ticking on‑screen**, and choices that feel like TV. I’ll use clean, high‑energy table language in the style of top Actual Play GMs—clear stakes, fast rulings, and celebratory beats.

## Cast & Setup

**Players & PCs**

* **Sam** as **Rook**, an unflappable infiltrator (stealth, sleight, parkour)
* **Jules** as **Vera**, the face (forged invites, pressure reads, improv lies)
* **Mason** as **Patch**, the tech (sensors, locks, “it’s already hacked” energy)
* **Priya** as **Ash**, the scout (roof access, spotters, contingency planning)

**System‑agnostic resolution**
When I call for a roll, I’ll say the **result quality** we care about at the table:

* **Strong Success** (treat like crit / Effect +3 / MoS 5+ / Hard+ / Extreme)
* **Success**
* **Success with Cost** (you progress, *and* a threat ticks)
* **Fail** (threat ticks)
* **Hard Fail** (threat ticks big)

> Use your system’s native mechanics to hit those bands—see the quick mapping in the GM guide. The point here is the **tick** (filling a segment) or **erase** (clearing a segment) on a **clock**.

## The Three Layers we’ll run

### Layer 3 — **Meta** (always on)

* **Campaign Goal (12): “Break the Syndicate’s Grip”** → **3/12**
* **Faction A — Syndicate Influence (10)** → **4/10**
* **Faction B — City Watch Legitimacy (8)** → **3/8**
* **Seasonal Throughline (8): “Festival Week”** → **2/8**
  *(Each end‑of‑scene, **Seasonal +1** and one **reactive Faction +1**; pause this during a climax.)*

### Layer 2 — **Episode Arc (8): “Steal the Starling”**

*(The Starling is a world‑famous micro‑sculpture; you’ve all seen the movie.)*
**0/8** → **Beats:** Casing → Breach → Extraction → Handoff

### Layer 1 — **Scene 1 Clocks** (first 30 minutes)

* **Objective (8):** *Case the museum floor and ID the swap point* → **0/8**
* **Alarm (6):** *Suspicion, patrols, warded glass* → **0/6**
* **Hazard (6):** *Crowd density, laser grid calibration* → **0/6**
* **Exit Window (4):** *The cleanest egress route closes at full* → **0/4**

> **Thresholds:** at **25/50/75%** on any scene clock, something **changes**. Also, each threshold **taps** the **Episode Arc +1**; at **50/75%** on certain threats, the **Meta** may tick, too.

## Actual Example

### Scene 1 — Red Carpets & Warded Glass (Casing)

**GM** *(brisk, warm)*:
Floodlights rake the museum facade. Inside, a string quartet bows something expensive. The **Starling** spins in a glass plinth under a sleepwalking web of red lasers. Waiters orbit. Security wears smiles and shoelace earpieces. **What do you do?**

**Vera (Jules)**: I glide in on the gala guest list I forged last downtime. Target a curator for small talk—fishing for schedule and guard cadence.

> **Roll** → **Success**.
> **Tick**: **Objective +1** → **1/8** *(Episode +1 → 1/8)*
> **Note**: The curator mentions, “After the speech, they **recalibrate the grid**.”

**GM (to table)**: That’s a **clue** which arms you against the **Hazard** later.

**Patch (Mason)**: While Vera distracts, I peel off to the service corridor. I want the **laser grid diagnostic**—network sniff, no alarms.

> **Roll** → **Success with Cost**.
> **Tick**: **Objective +1** → **2/8** *(Episode +1 → 2/8)*
> **Cost**: **Alarm +1** → **1/6** *(a camera blinks awake)*

**Rook (Sam)**: I ghost behind a moving waiter, slip through a staff door, and test the **maintenance catwalk** above the exhibit—looking for a drop point.

> **Roll** → **Strong Success**.
> **Tick**: **Objective +2** → **4/8** *(Episode +1 → 3/8)*
> **Erase**: **Alarm −1** → **0/6** *(you kill the blinking camera with a felt sticker)*

**Ash (Priya)**: I post on the roof with binoculars, counting patrols and **marking the safest exit window**—preferably a **service elevator** that opens onto an alley.

> **Roll** → **Success**.
> **Tick**: **Exit Window +1** → **1/4** *(Episode +1 → 4/8)*
> **GM Threshold (Exit 25%)**: The **Service Elevator** is perfect *now*, but… the **caterer’s truck** will block it **after the speech**.

**GM**: You’ve got the layout. The speech is in fifteen. **End of Scene 1.**
**Outcome Tap (success)** → **Campaign Goal +1** (**4/12**)
**Time Drift** → **Seasonal +1** (**3/8**) & **Syndicate Influence +1** (**5/10**) *(they notice you casing)*

**Echo Action (player‑driven conversion)**
**Vera**: I’ll **spend 1 Favor** to smooth over our camera blip—call in a journalist I know to pull a friendly **Watch** supervisor away.
**GM**: Love it. **Erase City Watch Legitimacy −1** *(your vibe lowers public pressure)* → **2/8** *(pushback on the wrong faction would be weird; you opted to ease heat)*

### Scene 2 — Breach Under a Toast

> **Reframe Layer 1 Clocks** for the breach:
>
> * **Objective (8):** *Swap the Starling* → **4/8** (from last scene)
> * **Alarm (6)** → **0/6**
> * **Hazard (6)** → **0/6**
> * **Exit Window (4)** → **1/4**

**GM**: The director taps the mic. As crystal chimes, the **laser grid shifts**—higher intensity, faster sweep. The crowd tightens around the plinth. **What do you do?**

**Patch**: Exploit the recalibration window I learned. I **mirror‑spike** the grid to open a 3‑second **blind arc**.

> **Roll** → **Success**.
> **Tick**: **Objective +1** → **5/8** *(Episode +1 → 5/8)*

**Rook** *(quiet grin)*: Three seconds is a lifetime. I drop from the catwalk, **swap** the Starling with our **weight‑matched duplicate**, and vanish behind a curtain.

> **Roll** → **Success with Cost**.
> **Tick**: **Objective +1** → **6/8** *(Episode +1 → 6/8)*
> **Cost**: **Alarm +1** → **1/6** *(a server *almost* sees you; champagne splashes)*

**GM Threshold (Objective 75%)**: Hitting **6/8** **unlocks the Finisher**: **“Ghost Walk”**—if you can keep Alarm ≤ 3 and Exit < full, the swap holds without a manual glass reset.

**Ash**: I cut power to **one** of the lobby spotlights to steer a guard’s gaze the wrong way.

> **Roll** → **Success**.
> **Tick**: **Alarm −1** → **0/6** *(clean)*

**Vera** *(performer voice)*: I clink my glass, launch into a heartfelt impromptu **donor mini‑toast** that ends right as the music swells, drawing every eye.

> **Roll** → **Strong Success**.
> **Tick**: **Alarm −1** (floor stays cool) → stays **0/6**
> **Tick**: **Objective +1** (cover is perfect) → **7/8** *(Episode +1 → 7/8)*

**GM** *(smiling)*: You are **one tick** from the **swap** being locked. The music ends; the **service elevator** hums—**Exit Window 2/4** as staff move trays.

> **End of Scene 2**
> **Outcome Tap (mixed)** → **Campaign Goal +1** (**5/12**) **and** **Syndicate Influence +1** (**6/10**) *(rumors: “someone’s pulling a move at the gala”)*
> **Time Drift** **pauses next scene** if we hit a **climax**. We’re at **Episode 7/8**—climax **next**.

**Echo Action**
**Patch**: Spend **1 Intel** from earlier casing to **erase 1** on **Syndicate Influence**—we seed a tip blaming a rival.
**GM**: Perfect. **Syndicate Influence 5/10** *(pushback lands; they glare at each other, not you)*

### Scene 3 — Extraction (Climax)

> **Climax Rule**: We’re at **Episode 7/8**; **pause Time Drift**. Only **Outcome Taps** affect Meta.

**Layer 1 Clocks now:**

* **Objective (8)** → **7/8** (*secure the swap*)
* **Alarm (6)** → **0/6**
* **Hazard (6)** → **0/6** *(but watch the recalibration tail*)
* **Exit Window (4)** → **2/4**

**GM**: The director unveils the Starling to polite awe. The **grid purrs**—a final micro‑sweep threatens to notice the mass difference *unless* you walk out right **now**.

**Ash**: I radio, **“All green. Move.”**

**Rook**: I drift with a cluster of guests, carrying a covered tray with the **real Starling** cushioned inside. Timing the sweep, I **Ghost Walk** toward the service elevator.

> **Roll** → **Success**.
> **Tick**: **Objective +1** → **8/8** **(FULL)**
> **Episode Arc +1** → **8/8 (FULL)**
> **Finisher resolves**: The swap **holds**; no glass reset needed.

**GM** *(snapping fingers, playful)*: The elevator doors start to close… a guard’s hand **reaches**. “Hey! You can’t—”

**Vera** *(without missing a beat)*: “Oh, perfect timing—**kitchen needs you** on the spill by the director’s shoes.” I flash the most **earnest** smile.

> **Roll** → **Success with Cost**.
> **Alarm +1** → **1/6** *(the guard hesitates but buys it)*
> **Exit Window +1** → **3/4** *(doors nearly shut; any stall closes the clean route)*

**Patch**: I jam the **elevator panel** for a fraction longer—keeps it open for Rook, then **auto‑sends** to service level.

> **Roll** → **Strong Success**.
> **Erase**: **Exit Window −1** → **2/4** *(you reopen the breathing room)*

**GM**: The car descends. Basement corridor, rubber mats, humming compressors. Loading dock door rolls up to the alley—that’s the **handoff**.

**Ash**: Roof to alley zipline. I’m already there to receive the **package** into the **flower van**.

> **Roll** → **Success**.
> **Episode resolved**; we cut on the van fading into festival traffic.

**End of Scene 3 (Climax) — End of Session**

* **Outcome Tap (success)** → **Campaign Goal +1** (**6/12**)
* **Stinger**: An invite arrives *tomorrow*—Syndicate gala, “prove your innocence.” **Permission to schedule** a faction‑heavy follow‑up.
* **Rewards**: You earn **2 Intel** and **1 Favor** (currency for future **Echo Actions**).

## Post‑Game Board (how the layers moved)

**Scene layer** created moment‑to‑moment pressure and changed the room at 25/50/75%.
**Episode layer** gave the night a satisfying arc with a **Finisher**.
**Meta layer** made your actions matter across sessions.

**Final clocks:**

* **Campaign Goal 6/12** (you’re halfway to breaking their grip)
* **Syndicate Influence 5/10** (you pushed back via Echo; expect retaliation)
* **City Watch Legitimacy 2/8** (Vera’s media favor cooled heat tonight)
* **Seasonal 3/8** (Festival Week is gathering speed—expect a set‑piece at \~4/8 or 5/8)

**GM Aside (what I did behind the screen)**

* I called out **thresholds** to telegraph danger and opportunity.
* Every scene **advanced something**—even when you succeeded, a faction or the season reacted.
* I offered a **once‑per‑scene Echo** so you could steer the meta.
* At **Episode 75%**, I paused **Time Drift** so the **climax** got all the oxygen.
* I made sure the finale had a **cheer point** (doors closing, last‑second save) and a **stinger** to propel the campaign.

## “Make It Look Easy” — How to run this tonight

1. **Pick the Episode** (e.g., *Heist — The Job*). Put out an **Episode Arc (8–10)** card.
2. **Start Scene 1** with **Objective 8**, **Alarm 6**, **Hazard 6**, **Exit 4**. Write 25/50/75% effects.
3. **Name the Meta**: Campaign (12–16), Season (8 or 12), two Factions (8–12). Put their cards at the top edge.
4. **Say the loop out loud**: “Cross a threshold → **Episode +1**. End a scene → **Meta ticks**. Spend currency → **Echo**.”
5. **Celebrate wins** (Strong Success = +2 ticks or erase on threats). **Price progress** (Success with Cost = +1 and an enemy tick).
6. At **Episode 75%**: **pause Time Drift**, unlock a **Finisher**, and **go cinematic**.
7. **End with a stinger** if any Meta filled or crossed a big threshold.

## Quick Reskins (same scene beats, new skin)

* **Fantasy**: Royal masquerade, swapping a dragon‑bone cameo blessed by the High Priest. *Hazard*: sanctified wards. *Faction*: Night Market vs. Inquisition.
* **Cyberpunk**: Corporate unveiling; swap an AI seed crystal. *Hazard*: ICE‑nailed smartglass. *Faction*: Rival megacorps; *Seasonal*: citywide blackout drill.
* **Space Opera**: Orbital museum gala; swap a quantum reliquary. *Hazard*: grav‑mesh oscillation. *Faction*: Sector Authority; *Seasonal*: migration festival.
* **Superhero**: Charity gala; disable a mind‑control broadcast node. *Hazard*: meta‑detectors. *Faction*: Vigilante Trust vs. City Hall PR.
* **Modern Investigation**: Sting operation; plant a lawful sniffer to catch insider trades. *Hazard*: RF‑shielded server room. *Faction*: DA’s Office vs. Private Security.

---

## What made this session **sing** (for your table, too)

* **Clear, tempting choices** (steal now or wait for the speech?)
* **Visible pressure** (Exit Window climbing, Alarm creeping)
* **Table agency** (Echo spends moved Factions/campaign)
* **A real finale** (Finisher unlocked, breath‑holding exit)
* **A lasting world change** (Meta clocks shifted; a new gala invites a showdown)

> You can drop this exact scaffolding into D\&D, Traveller, GURPS, or BRP without rewriting core rules. The **clocks** carry the drama; your system supplies the **texture**.

---

### Want the table kit?

Use the **Clock Cards** and the **GM One‑Pager** you’ve already got. Put **Episode** in the middle, **Scene** clocks near player hands, **Meta** at the top edge. Tell your players, “If you make noise, the **Alarm** ticks. If you’re brilliant, **erase** something. Spend **Intel/Favor/Lore** to steer the big story.”

Now go steal the Starling.




---

<div class="toolbar">
  <label for="search">🔎 Search:</label>
  <input id="search" type="search" placeholder="Search title, clocks, beats, hooks, or seeds…" />
  <label for="genre">🎭 Highlight seeds for:</label>
  <select id="genre">
    <option value="">All Genres</option>
    <option value="vaesen">Vaesen</option>
    <option value="gamma">Gamma World</option>
    <option value="highFantasy">High Fantasy</option>
    <option value="cyberpunk">Cyberpunk</option>
    <option value="spaceOpera">Space Opera</option>
    <option value="superhero">Superhero</option>
    <option value="modern">Modern Investigation</option>
  </select>
</div>

<div id="toc"></div>
<hr/>
<div id="plots"></div>

<style>
:root{
  --ink:#111; --muted:#555; --rule:#ddd;
  --chip:#eee; --chipTxt:#222; --badge:#000;
}
* { box-sizing: border-box; }
.toolbar{
  display:flex; gap:0.75rem; flex-wrap:wrap;
  align-items:center; margin:0.5rem 0 1rem 0;
}
#search{
  padding:0.45rem 0.6rem; min-width:16rem; font-size:0.95rem;
}
#genre{
  padding:0.45rem 0.6rem; font-size:0.95rem;
}
#toc{
  display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap:0.5rem; margin-bottom:0.75rem;
}
.toc-item{
  border:1px solid var(--rule); padding:0.5rem 0.6rem; border-radius:6px;
  display:flex; justify-content:space-between; align-items:center;
}
.toc-item a{ font-weight:600; text-decoration:none; color:var(--ink); }
.toc-item .score{ font-size:0.85rem; color:var(--muted); }

.plot{
  border-top:1px solid var(--rule); padding-top:1.25rem; margin-top:1.25rem;
}
.plot h2{
  margin:0.2rem 0 0.4rem 0;
}
.meta-line{
  display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center; color:var(--muted);
  font-size:0.95rem; margin-bottom:0.6rem;
}
.badge{
  display:inline-block; padding:0.15rem 0.5rem; border-radius:999px;
  background:var(--chip); color:var(--chipTxt); font-weight:600; font-size:0.8rem;
}
.score-chips .chip{
  display:inline-block; background:var(--chip); color:var(--chipTxt);
  padding:0.15rem 0.45rem; border-radius:4px; font-size:0.8rem; margin-right:0.25rem;
}
.grid{
  display:grid; gap:0.75rem;
}
.grid-2{ grid-template-columns:repeat(2,minmax(0,1fr)); }
.grid-3{ grid-template-columns:repeat(3,minmax(0,1fr)); }
.grid-4{ grid-template-columns:repeat(4,minmax(0,1fr)); }

.section h3{ margin:0.2rem 0 0.4rem 0; }
.clock-list{
  display:grid; gap:0.6rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.clock-card{
  border:1px solid var(--rule); border-radius:8px; padding:0.6rem; display:grid;
  grid-template-columns: 96px 1fr; gap:0.6rem; align-items:center;
}
.clock-card h4{ margin:0; }
.clock-card .desc{ font-size:0.9rem; color:var(--muted); }
.clock-svg{ display:grid; place-items:center; }
.clock-caption{ font-size:0.8rem; color:var(--muted); }

.thresholds ul, .meta-hooks ul, .episode ul { margin:0.2rem 0 0.4rem 1.1rem; }
.thresholds li, .meta-hooks li, .episode li { margin:0.2rem 0; }
.seeds{
  border:1px solid var(--rule); border-radius:8px; padding:0.6rem; background:#fafafa;
}
.seed-tag{ font-weight:600; font-size:0.88rem; margin-right:0.35rem; }
.seed{ margin:0.15rem 0 0.3rem 0; }

mark.seedHL{ background: #fff3b0; }

.small{ font-size:0.9rem; color:var(--muted); }
hr{ border:0; border-top:1px solid var(--rule); margin:1.2rem 0; }

/* Print tweaks */
@page { size: Letter; margin: 0.5in; }
@media print {
  .toolbar { display:none; }
  a[href^="#"]::after { content:""; }
}
</style>

<script>
/* ========= Utility: SVG radial clock ========= */
function makeClockSVG(segments, size=88){
  const NS="http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS,"svg");
  svg.setAttribute("width",size); svg.setAttribute("height",size);
  svg.setAttribute("viewBox",`0 0 ${size} ${size}`); svg.setAttribute("role","img");
  svg.setAttribute("aria-label", segments + "-segment progress clock");
  const cx=size/2, cy=size/2, r=size/2-5;
  const circ=document.createElementNS(NS,"circle");
  circ.setAttribute("cx",cx); circ.setAttribute("cy",cy); circ.setAttribute("r",r);
  circ.setAttribute("fill","none"); circ.setAttribute("stroke","#111"); circ.setAttribute("stroke-width","2");
  svg.appendChild(circ);
  for(let i=0;i<segments;i++){
    const theta = -Math.PI/2 - i*(2*Math.PI/segments);
    const x=cx+r*Math.cos(theta), y=cy+r*Math.sin(theta);
    const ln=document.createElementNS(NS,"line");
    ln.setAttribute("x1",cx); ln.setAttribute("y1",cy); ln.setAttribute("x2",x); ln.setAttribute("y2",y);
    ln.setAttribute("stroke","#111"); ln.setAttribute("stroke-width","1");
    svg.appendChild(ln);
  }
  const dot=document.createElementNS(NS,"circle");
  dot.setAttribute("cx",cx); dot.setAttribute("cy",cy); dot.setAttribute("r",2.1);
  dot.setAttribute("fill","#111");
  svg.appendChild(dot);
  return svg;
}

/* ========= Data: Full three-layer Plot Library ========= */
const plotLibrary = [
  {
    id:"heist",
    title:"Heist / Infiltration",
    score:{fun:98, tension:98, catharsis:97, overall:97.75},
    sceneClocks:[
      {name:"Objective", segments:8, desc:"Get/plant/swap the thing."},
      {name:"Alarm / Suspicion", segments:6, desc:"Patrols, wards, security heat."},
      {name:"Exit Window", segments:4, desc:"Easiest route closes at full."}
    ],
    thresholds:[
      {clock:"Alarm", at:"25%", effect:"Extra patrol added."},
      {clock:"Alarm", at:"50%", effect:"Lockdown of a wing / ward strengthens."},
      {clock:"Alarm", at:"75%", effect:"Red alert; each action also ticks Exit +1."}
    ],
    episode:{title:"The Job", beats:["Casing","Breach","Extraction","Handoff"]},
    metaHooks:{
      thresholdTaps:"Objective 50% → Campaign Goal +1. Alarm 75% → Opposition Faction +1.",
      outcome:"Success → Ally Faction +1 or Heat Faction −1 (erase). Failure → Opposition Faction +1.",
      echo:"Spend Intel/Favor to erase 1 on a Faction Project or to +1 Campaign Goal.",
      reversibility:"A cleanup mini‑job can erase 2 Alarm fallout from the Heat Faction.",
      visibility:"Objective & Alarm open; Exit Window veiled."
    },
    seeds:{
      vaesen:"Swap a baron’s portrait with a runemarked forgery to appease the house‑spirit.",
      gamma:"Lift a cold‑fusion core from a corporate arcology during rolling blackouts.",
      highFantasy:"Replace a duke’s signet with a cursed copy to expose the usurper.",
      cyberpunk:"Ghost a neural map off a black‑site without tripping ICE guardians.",
      spaceOpera:"Board a customs barge to retrieve impounded contraband before hyperjump.",
      superhero:"Dismantle a mind‑control broadcast array at a museum gala.",
      modern:"Plant a lawful sniffer in a data center to catch insider trades."
    }
  },
  {
    id:"investigation",
    title:"Investigation / Mystery Ladder",
    score:{fun:97, tension:96, catharsis:97, overall:96.65},
    sceneClocks:[
      {name:"Leads Found", segments:8, desc:"Every clue is forward."},
      {name:"Obstruction", segments:6, desc:"Red tape, rivals, wards."},
      {name:"Threat Matures", segments:6, desc:"Culprit escalates."}
    ],
    thresholds:[
      {clock:"Leads", at:"25%", effect:"First true pattern emerges."},
      {clock:"Threat", at:"50%", effect:"Public move / brazen escalation."},
      {clock:"Leads", at:"75%", effect:"Actionable theory → point to confrontation."}
    ],
    episode:{title:"Name the Truth", beats:["Fragments","Pattern","Suspect","Reveal","Confrontation (spawn Showdown 4–6)"]},
    metaHooks:{
      thresholdTaps:"Leads 50% → Campaign Goal +1; Leads 75% → Opposition Faction +1 (they react).",
      outcome:"Success → Ally Faction +1. Failure → Opposition Faction +1 and Seasonal +1 (panic/sacrifice).",
      echo:"Publish findings (spend Rep/Lore) to move Ally Legitimacy +1 or erase 1 Doom.",
      reversibility:"Expose a plant/dupe to erase 1 on Opposition Posture next scene.",
      visibility:"Leads open; Obstruction & Threat veiled."
    },
    seeds:{
      vaesen:"Why does the bell toll at midnight when the bell‑ringer is dead?",
      gamma:"Who reprogrammed water purifiers into mind‑emitters?",
      highFantasy:"Track a demon’s true name hidden in court poetry.",
      cyberpunk:"Correlate darknet drops to a citywide black‑ICE outbreak.",
      spaceOpera:"Decode sabotage among rival guild captains.",
      superhero:"Unmask a villain laundering powers through a charity front.",
      modern:"Connect the arsons to a land‑grab conspiracy."
    }
  },
  {
    id:"race",
    title:"Race Against Time",
    score:{fun:97, tension:99, catharsis:96, overall:97.45},
    sceneClocks:[
      {name:"Timer / Countdown", segments:6, desc:"Immutable (choose 6–8)."},
      {name:"Solve / Build", segments:8, desc:"Defuse/assemble/convince."},
      {name:"Complications", segments:6, desc:"Hazards that can speed the Timer."}
    ],
    thresholds:[
      {clock:"Timer", at:"25%", effect:"Subsystem fails; stakes rise."},
      {clock:"Timer", at:"50%", effect:"Public pressure / attention spikes."},
      {clock:"Timer", at:"75%", effect:"All failures also tick Timer +1."}
    ],
    episode:{title:"Beat the Clock", beats:["Locate","Stabilize","Capstone"]},
    metaHooks:{
      thresholdTaps:"Any Timer threshold → Seasonal Throughline +1.",
      outcome:"Success → Campaign Goal +1. Failure → Opposition Faction +1 and spawn Damage Control (6).",
      echo:"Burn Supplies/Salvage to +1 Solve and erase 1 Timer (once per scene).",
      reversibility:"Emergency shutdown mission can reset Timer to prior threshold.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Stop a midsummer rite before the boundary opens.",
      gamma:"Patch a reactor before the dome breaches.",
      highFantasy:"Seal a collapsing portal as constellations align.",
      cyberpunk:"Quarantine a worm before it bricks municipal implants.",
      spaceOpera:"Recalibrate a star‑gate before surge reversal.",
      superhero:"Contain a city‑wide time freeze.",
      modern:"Evacuate and neutralize a dirty device."
    }
  },
  {
    id:"siege",
    title:"Siege / Hold the Line",
    score:{fun:96, tension:98, catharsis:97, overall:96.95},
    sceneClocks:[
      {name:"Breach", segments:8, desc:"Enemy advance through defenses."},
      {name:"Civilians / Assets", segments:6, desc:"Evacuate/preserve/keep morale."},
      {name:"Counter‑Moves", segments:8, desc:"Sorties, repairs, bargains."},
      {name:"Supplies", segments:6, desc:"Ammo, charms, coolant, favors."}
    ],
    thresholds:[
      {clock:"Breach", at:"25%", effect:"Weak point exposed."},
      {clock:"Breach", at:"50%", effect:"Inner ward collapses; new front opens."},
      {clock:"Breach", at:"75%", effect:"Last stand—choose Civilians or buy Time."}
    ],
    episode:{title:"Endure or Break", beats:["Hold","Tradeoffs","Relief or Rout"]},
    metaHooks:{
      thresholdTaps:"Breach 75% → Opposition Faction +1 and Seasonal +1.",
      outcome:"Success → Ally Faction +1 or erase 1 Opposition Influence. Failure → Opposition +1 ×2.",
      echo:"Spend Favor to call Relief (4); if filled, erase 2 Breach.",
      reversibility:"Counter‑siege strike can reset Breach to prior threshold.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Defend a parsonage from mylings till dawn.",
      gamma:"Junk‑fort vs marauder mechs until the solar cannon spins up.",
      highFantasy:"Keep the bridge while the ritual completes.",
      cyberpunk:"Hold a safehouse through corp strike waves.",
      spaceOpera:"Keep the hangar open for evac while shields flicker.",
      superhero:"Protect civilians while a portal collapses.",
      modern:"Hold a perimeter while the bomb squad works."
    }
  },
  {
    id:"hunt",
    title:"Hunt the Monster",
    score:{fun:97, tension:96, catharsis:97, overall:96.65},
    sceneClocks:[
      {name:"Research Signs", segments:6, desc:"Weaknesses, bait, tells."},
      {name:"Track & Corner", segments:8, desc:"Terrain, moon phases, traps."},
      {name:"Prey Adapts", segments:6, desc:"New behaviors, lair changes."},
      {name:"Community Cost", segments:4, desc:"Livestock, missing folks."}
    ],
    thresholds:[
      {clock:"Track", at:"25%", effect:"First true sighting."},
      {clock:"Research", at:"50%", effect:"Unlock Finisher (bonus effect in showdown)."},
      {clock:"Prey Adapts", at:"75%", effect:"It flips a layer (new move or minions)."}
    ],
    episode:{title:"From Sign to Slaying", beats:["Signs","Lair","Showdown"]},
    metaHooks:{
      thresholdTaps:"Research 50% → Campaign Goal +1.",
      outcome:"Failed showdown → Opposition +1 and Seasonal +1. Success spawns Showdown clock with advantage if Research ≥50%.",
      echo:"Sanctify bait (spend Lore/Faith) for +1 effect and erase 1 Prey Adapts once.",
      reversibility:"Appease consequences: community vigil can erase 1 Community Cost.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Lure a brook horse with a hymn it hates.",
      gamma:"Trap a phase‑shifting scraper beast with strobing beacons.",
      highFantasy:"Corner a basilisk with mirrored shields.",
      cyberpunk:"Snare a rogue biosynth in coolant tunnels.",
      spaceOpera:"Hunt an energy leech in nebula fog.",
      superhero:"Track a fear‑entity feeding on headlines.",
      modern:"Expose a human predator while media churns."
    }
  },
  {
    id:"escort",
    title:"Escort / Convoy",
    score:{fun:96, tension:97, catharsis:96, overall:96.35},
    sceneClocks:[
      {name:"Route Leg (repeat)", segments:4, desc:"Waypoints; one per leg."},
      {name:"Ambush Pressure", segments:6, desc:"Raiders/spirits/bureaucrats."},
      {name:"Cargo Integrity", segments:6, desc:"Person, relic, reactor core."},
      {name:"Goodwill", segments:6, desc:"Locals help or hinder."}
    ],
    thresholds:[
      {clock:"Ambush", at:"50%", effect:"Major set‑piece attack."},
      {clock:"Ambush", at:"75%", effect:"Route blocked; add a new Leg."}
    ],
    episode:{title:"From A to B, Mostly Intact", beats:["Depart","Run the Gauntlet","Deliver"]},
    metaHooks:{
      thresholdTaps:"Every completed Leg → Campaign Goal +1.",
      outcome:"If Cargo < 50% at end → Opposition +1.",
      echo:"Spend Rep with a town or Favor with a patrol to erase 1 Ambush or +1 Leg progress.",
      reversibility:"Return leg (optional) to restore Goodwill; erases 1 Opposition tick.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Guide a midwife through a haunted moor.",
      gamma:"Haul a cryo‑seed vault across irradiated flats.",
      highFantasy:"Escort a prince through troll country.",
      cyberpunk:"Extract a defector across corporate zones.",
      spaceOpera:"Shepherd a refugee convoy past blockades.",
      superhero:"Protect a witness from meta‑hit squads.",
      modern:"Move a protected server farm during a storm."
    }
  },
  {
    id:"social",
    title:"Social Coup / Influence Game",
    score:{fun:98, tension:96, catharsis:97, overall:97.05},
    sceneClocks:[
      {name:"Capital (Leverage)", segments:8, desc:"Favors, dirt, proofs."},
      {name:"Opposition Posture", segments:6, desc:"Spin, smear, obstruction."},
      {name:"Audience Mood", segments:6, desc:"Undecided → convinced."},
      {name:"Protocol / Taboo", segments:4, desc:"Breaches speed Opposition."}
    ],
    thresholds:[
      {clock:"Audience", at:"25%", effect:"Room leans your way."},
      {clock:"Opposition", at:"50%", effect:"Counter‑narrative lands; require new evidence type."},
      {clock:"Audience", at:"75%", effect:"Bandwagon effect; +1 effect to closing moves."}
    ],
    episode:{title:"Sway the Room", beats:["Groundwork","Reveal","Vote/Edict"]},
    metaHooks:{
      thresholdTaps:"Audience 75% → Campaign Goal +1 and Opposition +1 (they regroup).",
      outcome:"Success → Ally +1 and erase 1 Opposition Legitimacy; Failure → Opposition +1 and Seasonal +1 (public spectacle).",
      echo:"Spend Receipts (Intel/Proofs) to push 2 Capital or erase 1 Opposition.",
      reversibility:"Quiet retraction can erase 1 Blame but ticks Opposition +1.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Win the guild to honor a bargain with the forest‑wife.",
      gamma:"Secure an orbital beam‑time license for your settlement.",
      highFantasy:"Pass a charter in the city council.",
      cyberpunk:"Turn a shareholders’ meeting against a black‑ops CEO.",
      spaceOpera:"Persuade a sector moot to lift sanctions.",
      superhero:"Adopt a hero oversight board with city support.",
      modern:"Flip a jury through narrative and evidence."
    }
  },
  {
    id:"survival",
    title:"Survival Trek / Hazard Crawl",
    score:{fun:96, tension:98, catharsis:96, overall:96.70},
    sceneClocks:[
      {name:"Exposure", segments:8, desc:"Heat/cold/radiation/psychic weather."},
      {name:"Wayfinding", segments:6, desc:"Navigation, omens."},
      {name:"Rations / Power", segments:6, desc:"Dwindling supplies."},
      {name:"Phenomenon / Predator", segments:6, desc:"Pursuit or stormfront."}
    ],
    thresholds:[
      {clock:"Exposure", at:"50%", effect:"Exhaustion tags/conditions."},
      {clock:"Rations", at:"75%", effect:"Hunger/fuel scarcity forces hard choices."}
    ],
    episode:{title:"Reach Shelter", beats:["Choose Routes","Trade Time vs. Safety","Arrive"]},
    metaHooks:{
      thresholdTaps:"Each shelter reached → Campaign Goal +1.",
      outcome:"Failure → Seasonal +1 (the land turns against you).",
      echo:"Convert Wayfinding surplus into erase 1 Exposure at scene end.",
      reversibility:"Supply cache side‑mission can reset Rations to prior threshold.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Cross a fairy winter where fire burns cold.",
      gamma:"Traverse a glassed desert under aurora fallout.",
      highFantasy:"Mountain pass during dragon migrations.",
      cyberpunk:"Blackout crawl through failing life‑support blocks.",
      spaceOpera:"EVA hike across a derelict hull in ion storms.",
      superhero:"Evacuate a city under kaiju weather.",
      modern:"Wilderness search in blizzard conditions."
    }
  },
  {
    id:"ritual",
    title:"Ritual / Exorcism / Containment",
    score:{fun:96, tension:97, catharsis:97, overall:96.60},
    sceneClocks:[
      {name:"Ritual Steps", segments:8, desc:"Materials, circles, words."},
      {name:"Interference", segments:6, desc:"Entity disrupts; intruders."},
      {name:"Anchor Integrity", segments:6, desc:"Vessel, wards, host body."},
      {name:"Backlash", segments:4, desc:"Mispronunciation, blood price, surges."}
    ],
    thresholds:[
      {clock:"Interference", at:"25%", effect:"Creeping manifestations."},
      {clock:"Anchor", at:"50%", effect:"Cracks; require repair mini‑task."},
      {clock:"Ritual", at:"75%", effect:"Finisher unlocked; entity becomes bindable."}
    ],
    episode:{title:"Bind It (or Set It Free)", beats:["Gather","Assemble","Invoke","Close"]},
    metaHooks:{
      thresholdTaps:"Ritual 75% → Campaign Goal +1; Anchor 50% → Opposition +1.",
      outcome:"Success → choose a Boon (Meta Ally +1 or permanent tag). Failure → Possession/Purge (6) next session and Seasonal +1.",
      echo:"Sacrifice Blood/Relic/Favor to double‑tick a step and erase 1 Backlash.",
      reversibility:"Appeasement rite can erase 1 Interference between scenes.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Return a troll‑wife’s name to bind her to the bridge.",
      gamma:"Phase a rogue nanite swarm into a containment lattice.",
      highFantasy:"Seal a hellmouth at eclipse.",
      cyberpunk:"Sandbox a sentient black‑ICE into a honeypot.",
      spaceOpera:"Re‑tune a psionic chorus to expel a hive mind.",
      superhero:"Exorcise a symbiote without harming the host.",
      modern:"Burn a haunted house clean with rites and permits."
    }
  },
  {
    id:"stalker",
    title:"Cat‑and‑Mouse / The Stalker",
    score:{fun:96, tension:99, catharsis:97, overall:97.30},
    sceneClocks:[
      {name:"Stalker Proximity", segments:8, desc:"Rumors → breathing on necks."},
      {name:"Counter‑Prep", segments:6, desc:"Traps, decoys, safehouses."},
      {name:"Civilian Spotlight", segments:4, desc:"Bystanders pull attention."},
      {name:"Tell Exposed", segments:4, desc:"Reveal the signature weakness."}
    ],
    thresholds:[
      {clock:"Proximity", at:"25%", effect:"First direct sign; paranoia rises."},
      {clock:"Tell", at:"50%", effect:"Weakness revealed; you can flip to Ambush Showdown (6) when ready."},
      {clock:"Proximity", at:"75%", effect:"Forced confrontation; remove one Counter‑Prep on entry."}
    ],
    episode:{title:"Flip the Hunt", beats:["Learn the Tell","Set the Killbox","Spring the Trap"]},
    metaHooks:{
      thresholdTaps:"Tell 50% → Campaign Goal +1. Missed civilians → Seasonal +1.",
      outcome:"Success → erase 1 Opposition Project (hunter asset lost). Failure → Opposition +1.",
      echo:"Spend Intel to fake trails (erase 1 Proximity, +1 Counter‑Prep).",
      reversibility:"Protective custody mini‑mission can erase 1 Civilian Spotlight.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Break a mare’s night‑ride with thorn wards.",
      gamma:"Spoof a cloaked retrieval drone into a compactor.",
      highFantasy:"Lure an assassin shade into moonlight.",
      cyberpunk:"Turn a corporate trace into a trap server.",
      spaceOpera:"Box a bounty droid in maintenance ducts.",
      superhero:"Reverse‑ambush a teleporter stalker.",
      modern:"Draw out a serial hoaxer without panic."
    }
  },
  {
    id:"rebuild",
    title:"Rebuild & Base‑Building Arc",
    score:{fun:98, tension:96, catharsis:97, overall:97.05},
    sceneClocks:[
      {name:"Infrastructure", segments:10, desc:"Power, water, wards, medbay."},
      {name:"Culture", segments:8, desc:"Laws, rites, school, markets."},
      {name:"Deterrence", segments:8, desc:"Patrols, treaties, charms."},
      {name:"Projects (Local)", segments:6, desc:"Workshops that mint boons."}
    ],
    thresholds:[
      {clock:"Any", at:"25%", effect:"Unlock a new capability (mini‑move)."},
      {clock:"Infrastructure", at:"50%", effect:"Self‑sustaining; costs drop."},
      {clock:"Culture", at:"75%", effect:"NPCs start solving small problems (morale boon)."}
    ],
    episode:{title:"Found the Haven", beats:["Survive","Establish","Expand"]},
    metaHooks:{
      thresholdTaps:"Each 25% unlock → Campaign Goal +1; rivals at border → opposing Faction +1.",
      outcome:"Success → permanent tag (e.g., +1 die on missions launched here). Failure → spawn a Siege next session and Opposition +1.",
      echo:"Donate Salvage/Favor to double‑tick Infrastructure or erase 1 Faction Influence.",
      reversibility:"Diplomatic tour can erase 1 Opposition Legitimacy.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Refound a þing place for human–spirit parley.",
      gamma:"Stand up a micro‑grid and fab shop.",
      highFantasy:"Raise a freehold with sanctuary laws.",
      cyberpunk:"Convert a warehouse into a community mesh hub.",
      spaceOpera:"Build a rebel safeport with drydock.",
      superhero:"Establish a neighborhood hero center.",
      modern:"Set up a joint‑task hub with an evidence lab."
    }
  },
  {
    id:"disaster",
    title:"Disaster Response / Crisis Management",
    score:{fun:96, tension:98, catharsis:97, overall:96.95},
    sceneClocks:[
      {name:"Stabilization", segments:8, desc:"Triage, douse, appease, decommission."},
      {name:"Secondary Hazards", segments:6, desc:"Collapses, aftershocks, looters, omens."},
      {name:"Evacuations", segments:6, desc:"Get people out."},
      {name:"Media / Blame", segments:4, desc:"Narrative control; promises."}
    ],
    thresholds:[
      {clock:"Hazards", at:"25%", effect:"First cascade; new zone opens."},
      {clock:"Evacuations", at:"50%", effect:"VIPs require attention."},
      {clock:"Stabilization", at:"75%", effect:"Capstone now possible if you can hold the line."}
    ],
    episode:{title:"Stop the Cascade", beats:["Contain","Cap","Recover"]},
    metaHooks:{
      thresholdTaps:"Any cascade → Seasonal +1; Evacs 50% → Ally +1 (grateful power).",
      outcome:"Success → Campaign Goal +1. Failure → Opposition +1 and your Legitimacy −1 unless you front up (Echo).",
      echo:"Align messaging to action (spend Rep) to erase 1 Blame and +1 Stabilization.",
      reversibility:"Community recompense can erase 1 Blame between sessions.",
      visibility:"Default visibility."
    },
    seeds:{
      vaesen:"Extinguish a ghostfire before it spreads.",
      gamma:"Seal a rift spewing time fractures.",
      highFantasy:"Reinforce levees against wizard‑flood.",
      cyberpunk:"Contain a grid cascade after a bad patch.",
      spaceOpera:"Stabilize a life‑support failure in station ring C.",
      superhero:"Manage collateral during a cosmic duel.",
      modern:"Coordinate a multi‑agency wildfire response."
    }
  }
];

/* ========= Render: TOC and Plot Explorer ========= */
const plotsMount = document.getElementById("plots");
const tocMount = document.getElementById("toc");
const searchEl = document.getElementById("search");
const genreEl = document.getElementById("genre");

function scoreChips(s){
  return `
    <span class="chip" title="Fun">Fun ${s.fun}</span>
    <span class="chip" title="Tension">Tension ${s.tension}</span>
    <span class="chip" title="Catharsis">Catharsis ${s.catharsis}</span>
    <span class="chip" title="Overall">Overall ${s.overall}%</span>
  `;
}

function seedLine(tag, text, highlight=false){
  const cls = highlight ? "seedHL" : "";
  return `<div class="seed"><span class="seed-tag">${tag}:</span> <span class="${cls}">${escapeHtml(text)}</span></div>`;
}

function escapeHtml(str){
  return (str||"").replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function renderTOC(data){
  tocMount.innerHTML = data.map(p => `
    <div class="toc-item">
      <a href="#${p.id}">${escapeHtml(p.title)}</a>
      <span class="score">${p.score.overall}%</span>
    </div>
  `).join("");
}

function renderPlots(data){
  plotsMount.innerHTML = data.map(p => {
    const seeds = p.seeds;
    const g = genreEl.value;
    const hl = {
      vaesen: g==="vaesen",
      gamma: g==="gamma",
      highFantasy: g==="highFantasy",
      cyberpunk: g==="cyberpunk",
      spaceOpera: g==="spaceOpera",
      superhero: g==="superhero",
      modern: g==="modern"
    };
    return `
      <section class="plot" id="${p.id}">
        <h2>${escapeHtml(p.title)}</h2>
        <div class="meta-line">
          <span class="badge">Three‑Layer</span>
          <span class="small">Scene (30m), Episode (8–10), Meta (8–16)</span>
          <span class="score-chips">${scoreChips(p.score)}</span>
        </div>

        <div class="section">
          <h3>Scene Layer — Clocks</h3>
          <div class="clock-list">
            ${p.sceneClocks.map(c => `
              <div class="clock-card">
                <div class="clock-svg">${makeClockSVG(c.segments).outerHTML}<div class="clock-caption">${c.segments} segments</div></div>
                <div>
                  <h4>${escapeHtml(c.name)}</h4>
                  <div class="desc">${escapeHtml(c.desc)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="grid grid-3">
          <div class="section thresholds">
            <h3>Thresholds</h3>
            <ul>
              ${p.thresholds.map(t => `<li><strong>${escapeHtml(t.clock)}</strong> @ <strong>${t.at}</strong> — ${escapeHtml(t.effect)}</li>`).join("")}
            </ul>
          </div>
          <div class="section episode">
            <h3>Episode Arc (8–10)</h3>
            <p><strong>${escapeHtml(p.episode.title)}</strong></p>
            <ul>${p.episode.beats.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>
          </div>
          <div class="section meta-hooks">
            <h3>Meta Hooks</h3>
            <ul>
              <li><strong>Threshold taps:</strong> ${escapeHtml(p.metaHooks.thresholdTaps)}</li>
              <li><strong>Outcome:</strong> ${escapeHtml(p.metaHooks.outcome)}</li>
              <li><strong>Echo:</strong> ${escapeHtml(p.metaHooks.echo)}</li>
              <li><strong>Reversibility:</strong> ${escapeHtml(p.metaHooks.reversibility)}</li>
              <li><strong>Visibility:</strong> ${escapeHtml(p.metaHooks.visibility)}</li>
            </ul>
          </div>
        </div>

        <div class="section seeds">
          <h3>Genre Seeds</h3>
          ${seedLine("Vaesen", seeds.vaesen, hl.vaesen)}
          ${seedLine("Gamma World", seeds.gamma, hl.gamma)}
          ${seedLine("High Fantasy", seeds.highFantasy, hl.highFantasy)}
          ${seedLine("Cyberpunk", seeds.cyberpunk, hl.cyberpunk)}
          ${seedLine("Space Opera", seeds.spaceOpera, hl.spaceOpera)}
          ${seedLine("Superhero", seeds.superhero, hl.superhero)}
          ${seedLine("Modern Investigation", seeds.modern, hl.modern)}
        </div>
      </section>
    `;
  }).join("");
}

function filterPlots(){
  const q = (searchEl.value||"").toLowerCase().trim();
  let data = plotLibrary;
  if(q){
    data = data.filter(p=>{
      const hay = [
        p.title,
        JSON.stringify(p.sceneClocks),
        JSON.stringify(p.thresholds),
        p.episode.title, ...(p.episode.beats||[]),
        p.metaHooks.thresholdTaps, p.metaHooks.outcome, p.metaHooks.echo,
        p.metaHooks.reversibility, p.metaHooks.visibility,
        p.seeds.vaesen, p.seeds.gamma, p.seeds.highFantasy, p.seeds.cyberpunk,
        p.seeds.spaceOpera, p.seeds.superhero, p.seeds.modern
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }
  renderTOC(data);
  renderPlots(data);
}

document.addEventListener("DOMContentLoaded", ()=>{
  filterPlots();
  searchEl.addEventListener("input", filterPlots);
  genreEl.addEventListener("change", filterPlots);
});
</script>