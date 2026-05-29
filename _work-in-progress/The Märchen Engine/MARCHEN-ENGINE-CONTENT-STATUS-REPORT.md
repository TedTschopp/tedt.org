# Märchen Engine Content Status Report

**Date:** 2026-05-28T21:06:46.885-07:00  
**Prepared by:** Aragorn, Lead / Product Owner  
**Input:** Bilbo editorial review + Elrond information architecture audit + source analysis  
**Purpose:** Decision-oriented assessment of publication readiness and work sequencing

---

## Executive Summary

The Märchen Engine is a **sophisticated TTRPG with distinctive mechanical and philosophical identity**, grounded in a fairytale aesthetic and community-centered play values. The published introduction post establishes the right tone and sets strong expectations. However, the 21 work-in-progress subsystem documents reveal a **coherence and sequencing problem**: you have excellent building blocks (4D8 resolution, Social Combat/Engagement, Nemesis scaling, Magic Items framework, Bastion downtime mechanics) but they exist in isolation without:

1. A unified integration narrative explaining how they work together
2. Character creation as a formalized, publishable chapter
3. A proof-of-concept campaign showing all systems in play
4. Clear reading order, series metadata, and front-matter scaffolding
5. Mechanical grounding for several conceptually rich but operationally orphaned systems (Magical Schools, Morality Aspects)

**Publication verdict:** Marginally publishable *as individual documents* (3–4 subsystems ready now), but **not publishable as a coherent game line** without 5–7 days of structural work.

**Highest-leverage move:** Complete Character Creation chapter + publish 2–3 Tier 1 subsystems with series metadata + write one unified campaign example. This signals completion and unblocks all other content.

---

## Current State of the Märchen Engine Corpus

### Published Artifacts
- **"What is the Märchen Engine?" (2023-09-30)** — 1 post, ~3,000 words  
  Introduces: core philosophy, task resolution basics (4D8), iconography, roles, and values ("joy, kindness, integrity"). Strong tone, accessible narrative, solid community-focused framing.

### Work-in-Progress Artifacts  
- **21 files** spanning ~7,100 lines across multiple organizational schemes
  - **Core systems** (2): Game Rules for 4D8, Bastion Rules  
  - **Subsystems** (6): Social Combat, Nemesis, Magic Items, Magical Schools, Natural Weapons  
  - **Setting/Adventure** (5): Light of Life module, Seasonal Activities, Alpine Mirror campaign, Escalation/Descalation  
  - **Design sketches & fragments** (8): Character advancement, moral frameworks, knowledge levels, map marking, cycles-of-conflict visuals  

### Content Scale & Distribution
| Category | File Count | Line Range | Status |
|----------|-----------|-----------|--------|
| Published | 1 | ~3,000 | ✅ Ready |
| Core Mechanics Ready | 2 | 173–1,027 | ⚠️ Ready with light edits |
| Subsystems (Strong) | 3 | 274–719 | ⚠️ Ready + 1–2 hours polish |
| Subsystems (Needs Work) | 3 | 54–338 | 🔴 Needs mechanical grounding |
| Setting/Adventure | 5 | 82–1,228 | ⚠️ Strong but unmoored from core |
| Fragments/Sketches | 8 | 15–287 | 🔴 Incomplete or duplicate concepts |

---

## What Is Already Working Well

### 1. **Published Introduction — Tone & Accessibility** ✅
The intro post balances rules rigor with humane framing. Sections like "Have Fun" and "Stay in Communication" ground the system in community values rather than power optimization—unusual and valuable for TTRPG writing. Iconography section is clear and foundational.

**Assessment:** Publication-ready with minor wordiness trim in the "Value Others' Time" section (~20% reduction recommended).

### 2. **Distinctive Mechanical Voice** ✅
- **4D8 task resolution:** Elegant probability mapping to four human aspects (physical, mental, social, magical). Sophisticated degree-of-success granularity opens rich narrative doors.
- **Three-Realms Magic System:** Conceptual layering (Physical/Mental/Spiritual) feels like a real curriculum, not a list. Nine magical branches suggest depth.
- **Nemesis scaling (Legacy of Scars):** FAME-tied progression with narrative callbacks. Concise, modular, clear quick-reference. This demonstrates how subsystems can be both mechanically rigorous *and* story-integrated.
- **Magic Items framework:** Excellent meta-commentary. Treats items as story arcs; includes design rubric and Märchen Compatibility scoring. **This is a template for all subsystems.**

### 3. **Social Combat / Engagement Subsystem** ✅
Fully formed alternative to physical violence. Defense, Influence, Composure, and Exchanges structure social conflict with the same rigor as physical combat. Stat mapping (Cunning, Perception, Status) is explicit. Missing only a worked example scenario.

### 4. **Bastion Downtime Mechanics** ✅
Solid depth; structures downtime as agency rather than bookkeeping. Seasonal turns create campaign pacing hooks. Scale and production rules are clear. **Issue:** tone is too D&D-ified; terminology feels borrowed (Bastion, Faction) rather than native to Märchen identity.

### 5. **Morality Framework (Philosophy Layer)** ✅
Théorique grounding. Twelve moral dimensions (Care, Fairness, Loyalty, Authority, Sanctity, Liberty, Equity, Honesty, Hospitality, Wisdom, Humility, Self-Control) avoid false binaries. Treating morality as a *playable axis* is innovative. **Issue:** no mechanical hooks specified; readers admire philosophy but don't know where it lives in rules.

---

## What Is Missing or Underdeveloped

### 1. **System Integration Narrative** — P1 (BLOCKING)
The WIP corpus reads as **independent modules, not a unified engine**. Critical gaps:
- How do Three Realms connect to character creation? (Not explained anywhere.)
- When do players invoke moral aspects? Are they traits, environmental triggers, or mechanical gates?
- How do Social Combat and physical conflict interact? Can you escalate from Engagement to violence mid-scene?
- Do magical schools scale with character advancement? How does item progression relate to nemesis rank?
- **Which subsystems are mandatory core vs. optional add-ons?**

**Editorial impact:** New readers will feel the system is powerful but not cohesive. A new GM won't know where to start. Narratively isolated subsystems feel like design sketches, not a game.

**Fix required:** Add a **System Architecture Overview** document (3–5 pages) framing how Three Realms, Aspects, 4D8 mechanics, Social Combat, Magical Schools, and Nemesis scale work together. Show *one complete example*: "A player wants to negotiate with a merchant, then rob him; here's how Engagement + Moral Aspects + magical advantage + nemesis reputation interact from roll through resolution."

### 2. **Character Creation — COMPLETELY UNPUBLISHED** — P1 (BLOCKING)
The published intro hints at character creation but nowhere in the WIP documents details the full flow:
- Ability score allocation method? (Roll 4D8? Point buy? Class-based?)
- How do moral aspects factor into chargen? Selection? Random? Weighted profile?
- Magical school learning path?
- Starting item selection and naming?
- Bastion selection / creation?
- Starting Nemesis rank or patron relationship?

**Impact:** Readers cannot create a complete character. This is a hard stop for any RPG.

**Fix required:** Extract and formalize into a standalone **Character Creation** chapter (~2,000 words):
1. Step-by-step flow (abilities → aspects → magical tradition → items → bastion → allies)
2. Example character walkthrough (Elara, Metaphysics-trained Courier with high Honesty/Hospitality)
3. Links to relevant subsystem rules (cross-reference Magical Schools for selection, Bastion for mechanics)
4. Front matter: `series: Märchen Engine Rules`, `series_step: 2`

---

### 3. **Magical Schools Lack Mechanical Grounding** — P2
The **New Magical Schools** document is conceptually rich but operationally orphaned:
- How do you roll to cast? Difficulty? Degree-of-success interpretation?
- Resource cost? Mana, fatigue, components? Fatigue per casting or per rank?
- Time cost? Always 1 Round? Varies by spell? Stack multiple casts?
- What prevents abuse (e.g., reading every NPC's mind)?
- How do the three mystical attributes (Potency, Channeling, ?) map to ability scores?

**Impact:** GM reads this and thinks, "Beautiful lore, but I have no idea how to adjudicate it at the table."

**Fix required:** Add **Casting Framework** section (~800 words):
- Example spell cast: "Arcane Level 2. Mage identifies cursed sword. Difficulty = 18. Rolls 4D8 + Potency + Channeling. Success = identifies curse. Degree modifies detail level."
- Resource cost table (mana pool? Composure drain?)
- Time cost rules (can you fast-cast? Concentration checks?)

---

### 4. **Morality Aspects Lack Mechanical Hooks** — P2
**Morality Aspects** document articulates 12 moral dimensions beautifully but **never says how they affect gameplay**:
- Are these character traits (like D&D alignment)?
- Do you earn/shift points mid-campaign?
- Do they gate actions? (Low Honesty = can you never lie?)
- Do they interact with Social Combat, spellcasting, or nemesis reputation?

**Impact:** Philosophy admired, but mechanics invisible. Feels decorative rather than systemic.

**Fix required:** Add **Moral Mechanics** section (~1,000 words) with three options:
- **Option A (Traits):** "Distribute 10 points across 12 aspects during chargen. Higher values unlock abilities; lower values create roleplay constraints and disadvantages."
- **Option B (Situational):** "When acting against your core, Referee imposes ⚅-2 or requires Will save."
- **Option C (Social Capital):** "Social Combat advantage if Honesty high, disadvantage if low—others sense trustworthiness."

Choose one and commit (or use a matrix showing when each applies).

---

### 5. **Bastion Rules Are Generic D&D, Not Märchen** — P2
**Bastion Rules Cleaned up** appears copied or heavily adapted from D&D 5e Tasha's rules. No Märchen DNA:
- No mention of Three Realms integration
- No moral dimension (Can Bastions built on betrayal suffer reduced power?)
- No unique flavor tying to intro's "kindness and integrity" philosophy
- Terminology feels borrowed (Bastion, Faction, Activity)

**Impact:** "Märchen is D&D with prettier intro" → trust in originality erodes.

**Fix required:** Either:
- **Option A:** Reframe with Märchen terminology + morality hooks: Replace "Bastion" with "Sanctuary," "Faction" with "Patron," show how moral compromises affect production/loyalty.
- **Option B:** Write a Märchen-native stronghold system leveraging Three Realms and magical schools (faster path if Bastion feels out-of-scope).

Minimum: Add sidebar showing 2–3 Märchen-specific twists differentiating from other systems.

---

### 6. **Incomplete / Draft Content in WIP** — P3
Several files are **clearly incomplete** and should not be visible to collaborators or readers:
- **Levels of Knowledge** — Starts mid-thought with Power Apps examples (copy-paste from unrelated material). 18 lines.
- **Adventure Structure** — 39-line skeleton checklist; could apply to *any* system, no Märchen specifics.
- **Seasonal Activities** — Strong (1,117 lines) but marked with `#` prefix suggesting archived state.
- **Escalation and Descalation** — 287 lines, structure present but feels outline-like.
- **The Light of Life** — 436 lines; appears to be adventure module + NPC stat blocks, but boundary unclear.
- **Enrich Your TTRPG Sessions** — 82-line stub; generic advice without Märchen hooks.

**Impact:** If published, they confuse readers. If internal, they should be marked/organized differently.

**Fix required:**
- Move truly incomplete docs to `_work-in-progress/Drafts/` or prefix with `[DRAFT]`
- For each remaining file, add 1–2 sentence front-matter header: "This document explains X. Status: ready / needs mechanics clarification / incomplete."

---

### 7. **No Glossary or Quick-Start Reference** — P3
The intro defines iconography but **lacks full lexicon**:
- Defined everywhere, explained nowhere: Realm, Ease vs. Difficulty, degree of success, FAME, Engagement, Composure, Potency, Channeling, Rank, Bond, etc.
- Readers pause mid-document to re-read earlier sections.

**Fix required:**
- **Glossary** (1 page): ~20 core terms with 1–2 sentence definitions + cross-links
- **Quick-Start Reference** (1 page): "Most Common Rolls," "Modifier Lookup," "When Do I Use 4D8?"

---

### 8. **Inconsistent Terminology & Voice** — P2
The corpus mixes formal rulebook tone (Bastion Rules) with narrative flavor (Social Combat's cinematic opener). Examples:
- "Engagement" capitalized and final; "Social Combat" appears without distinction
- Some docs address player ("You will..."), others referee, others both
- "Märchen Engine" vs. "Marchen Engine" (umlaut inconsistency)
- Ability names vary ("Cunning," "Perception," "Will") without single stat block

**Fix required:** Establish internal **Style Guide** (not published):
- Pick: Narrator, Referee, or GM (use consistently)
- Standardize ability names + abbreviations (create canonical stat block)
- Capitalization rules (Three Realms? Magical Schools? Engagement always? Social Combat?)
- Voice: second-person advice or third-person reference?

---

### 9. **No Proof-of-Concept Campaign** — P3 (STRATEGIC)
You have subsystems but **no example showing all systems in play together**:
- No 6–12 session campaign showing Nemesis escalation + Bastion downtime + Named Item story thread + Social Combat negotiation in sequence
- No pacing guidance (How often do Nemesis rank escalations happen? Bastion seasonal turns?)
- No examples of subsystem interaction at the table

**Impact:** Readers can't envision how to *run* this. No marketing proof that systems cohere. Doubt creeps in.

**Fix required:** Write **Unified Campaign Example** (~3,000 words):
- Character creation → Bastion selection
- Arc 1: Nemesis introduction + 2–3 rank escalations
- Downtime: Bastion seasonal activity + Named Item discovery
- Arc 2: Item story thread + Nemesis final confrontation
- Social Combat scenario (negotiation with patron)
- Epilogue showing campaign arc influence on future play

---

## Publishability Assessment

### Immediately Publishable (No Revision)

1. **Published intro post** ✅
   - Minor wordiness trim (~20%) in "Value Others' Time" section
   - Ready to ship as-is with light edit

### Publishable with Light Edits (1–2 hours per piece)

2. **Game Rules for a 4D8 System** ⚠️
   - Clear structure, well-reasoned
   - Add: one full worked example (roll, modifiers, degree-of-success interpretation)
   - Add: cross-reference callouts from other subsystems

3. **Social Combat / Engagement** ⚠️
   - Well-conceived subsystem
   - Add: integration note (escalation to/from physical combat)
   - Add: one worked example scenario (negotiation start→finish showing Influence in action)

4. **A-Legacy-of-Scars** (Nemesis) ⚠️
   - Excellent quick-reference and modular design
   - Add: worked example showing 6-session rank escalation
   - Add: note on party-size scaling

5. **Magic-Items-Rules** ⚠️
   - Exemplary meta-commentary and rubric
   - Add: one fully detailed example item (Bond ranks 1–8)
   - Add: sidebar "How Items Advance During Play"

### Publishable if Mechanical Hooks Added (2–4 hours per piece)

6. **New Magical Schools** 🔴
   - Conceptually rich but **mechanically orphaned**
   - **Blocking:** Casting Framework section required (see above)
   - Then: publication-ready

7. **Morality Aspects** 🔴
   - Philosophically sound but **rules-invisible**
   - **Blocking:** Mechanical hooks section required (see above)
   - Then: publication-ready

### Requires Substantial Development

8. **Character Creation** 🔴🔴
   - **Missing entirely; unpublished**
   - **Blocking:** All subsystem publications depend on this
   - Required: full chapter (~2,000 words) with step-by-step flow + example

9. **System Architecture Overview** 🔴🔴
   - **Missing entirely**
   - **Blocking:** Coherence narrative needed to bind subsystems
   - Required: integration document (~3,000–5,000 words) showing full example

10. **Unified Campaign Example** 🔴
    - **Missing entirely; critical proof-of-concept**
    - Required: ~3,000 word worked example showing all systems in concert
    - High-leverage for marketing and reader confidence

11. **Bastion Rules** 🔴
    - Mechanically solid but **identity misaligned**
    - Requires: either Märchen-native rewrite (~3 hours) or terminology/flavor pass (~2 hours)

### Not Ready for Publication

12. **Adventure Structure** ❌
    - Too generic; no Märchen-specific content
    - Options: rewrite with examples (3 hours) or deprioritize

13. **Incomplete Fragments** ❌
    - Levels of Knowledge, Enrich Sessions, fragments
    - Options: move to `_drafts/`, complete, or archive

14. **Setting Modules (Light of Life, Alpine Mirror)** ❌
    - Strong but campaign-scale
    - Strategy: defer to post-launch supplements (after core rules stable)

---

## Highest-Priority Work Needed Next

### Phase 1: Unblock Publishing (4–6 hours) — **START HERE**

**Goal:** Make it possible to publish core subsystems with confidence.

1. **Write Character Creation chapter** (2–3 hours)
   - Extract from intro + subsystem hints
   - Step-by-step chargen flow
   - Example character (Elara, Metaphysics Courier)
   - Cross-references to Magical Schools, Bastion, Named Items
   - Front matter: `series: Märchen Engine Rules`, `series_step: 2`

2. **Add front matter + series metadata** to all subsystem posts ready to publish (1 hour)
   - Standardize: `series: Märchen Engine Rules`, `series_step: [number]`
   - Canonical category: `Role Playing Games → The Märchen Engine`
   - Tags: `rules`, `subsystem`, `core`/`optional` distinction
   - Example:
     ```yaml
     series: Märchen Engine Rules
     series_step: 3
     categories:
       - Role Playing Games
       - The Märchen Engine
     tags:
       - rules
       - subsystem
       - core
     ```

### Phase 2: Proof of Concept (2–3 hours)

3. **Write System Architecture Overview** (2–2.5 hours)
   - Frame integration: 4D8 → Character Abilities → Moral Aspects → Social Combat escalation → Magical Schools → Nemesis scaling
   - Full example: negotiation turning into conflict, showing Engagement + Aspects + possible escalation to violence
   - Front matter: `series: Märchen Engine Rules`, `series_step: 1` (introduce *before* Chargen)

4. **Publish Tier 1 subsystems with front matter** (0.5 hours)
   - Magic-Items-Rules (+ example item)
   - A-Legacy-of-Scars (+ Nemesis example)
   - Social Combat (+ worked scenario)
   - These signal coherence and attract readers to full system

### Phase 3: Polish & Mechanical Grounding (3–4 hours)

5. **Write Casting Framework** for Magical Schools (1.5 hours)
   - Example spell with roll, difficulty, resource cost, time cost
   - Abuse prevention guidelines
   - Integration with character advancement

6. **Write Moral Mechanics section** for Morality Aspects (1.5 hours)
   - Choose one path (Traits / Gates / Social Capital)
   - Clarify chargen integration
   - Show interaction with other subsystems

7. **Märchen-ify Bastion Rules** (1–2 hours)
   - Rename: Sanctuary, Patron, etc.
   - Add 2–3 moral/realm-specific twists
   - Or: replace with Märchen-native system

### Phase 4: Strategic / Post-Launch

8. **Write Unified Campaign Example** (2–3 hours, but high-leverage)
   - 6–12 session arc showing all systems in play
   - Publish as proof-of-concept before setting modules
   - Marketing artifact showing coherence

9. **Create Glossary + Quick-Start Reference** (1 hour)
   - 1-page glossary, 1-page quick-ref lookup
   - Reduce re-reading friction

10. **Organize WIP folder** (0.5 hours)
    - Move fragments to `_drafts/`
    - Mark incomplete with `[DRAFT]` prefix

---

## Recommended Sequencing / Publication Strategy

### Week 1: Unblock Everything
1. Publish Character Creation (series_step: 2)
2. Publish System Architecture Overview (series_step: 1)
3. Add front matter to all ready subsystems

### Week 2: Build Reader Confidence
4. Publish Tier 1 subsystems with examples:
   - Magic-Items-Rules (series_step: 4)
   - A-Legacy-of-Scars (series_step: 5)
   - Social Combat (series_step: 6)

### Week 3: Complete Core Mechanics
5. Publish Game Rules for 4D8 with worked example (series_step: 3)
6. Add Casting Framework; publish Magical Schools (series_step: 7)
7. Add Moral Mechanics; publish Morality Aspects (series_step: 8)

### Week 4: Proof of Concept
8. Publish Unified Campaign Example (series_step: 50 — "advanced, read rules first")

### Post-Launch (Tier 2)
- Publish setting modules (Light of Life, Alpine Mirror) as supplements
- Publish Bastion Rules (rewritten) as advanced subsystem
- Archive or complete fragments

---

## File-by-File Status Notes

| File | Lines | Status | Priority | Key Issue | Fix |
|------|-------|--------|----------|-----------|-----|
| **Published Intro** | ~3,000 | ✅ | — | Wordiness in "Value Others' Time" | Trim 20%; tighten sentences |
| **Game Rules 4D8** | 173 | ⚠️ | P1 | Abstract; no full example | Add worked example: ease 24, roll 5+6+3+1, success, degree +6 |
| **Social Combat** | 649 | ⚠️ | P1 | Island subsystem | Add escalation note; worked example (negotiation → conflict) |
| **Magic-Items-Rules** | 719 | ⚠️ | P1 | Needs 1 example item | Add Bond Rank 1–8 example; "How Items Advance" sidebar |
| **A-Legacy-of-Scars** | 274 | ⚠️ | P1 | Needs rank escalation example | Add 6-session Nemesis arc example; party-size note |
| **New Magical Schools** | 338 | 🔴 | P2 | Unmechanical | Add Casting Framework section (~800 words) |
| **Morality Aspects** | 49 | 🔴 | P2 | Philosophy only | Add Moral Mechanics section (~1,000 words); choose option A/B/C |
| **Bastion Rules Cleaned up** | 1,027 | 🔴 | P2 | D&D-ified; no Märchen DNA | Rewrite with Märchen terminology + moral hooks (3 hrs) or defer |
| **Character Creation** | 0 | 🔴🔴 | **BLOCKING** | **Missing entirely** | Write full chapter (~2,000 words); step-by-step + example; series_step: 2 |
| **System Architecture Overview** | 0 | 🔴🔴 | **BLOCKING** | **Missing entirely** | Write integration doc (~3,000–5,000 words); full example; series_step: 1 |
| **Unified Campaign Example** | 0 | 🔴 | P3 | Missing proof-of-concept | Write 6–12 session arc (~3,000 words); shows all systems together |
| **Adventure Structure** | 39 | ❌ | P4 | Too generic | Rewrite with Märchen examples (3 hrs) or archive |
| **Levels of Knowledge** | 18 | ❌ | P4 | Incomplete; copy-paste error | Move to `_drafts/` or rewrite |
| **Enrich Sessions** | 82 | ❌ | P4 | Generic; no Märchen hooks | Move to `_drafts/` or expand with Märchen-specific advice |
| **Escalation/Descalation** | 287 | ⚠️ | P3 | Outline-like; content unclear | Complete or move to `_drafts/` |
| **Seasonal Activities** | 1,117 | ⚠️ | P3 | Strong but needs Bastion link | Add front matter; link to Bastion turns; clarify optional status |
| **The Light of Life** | 436 | ⚠️ | P4 | Adventure module; dependency unclear | Mark as supplement; defer to post-launch; series_step: 99 (post-core) |
| **The-Small-Alpine-Mirror** | 1,228 | ⚠️ | P5 | Campaign-scale; defer | Mark as supplement; defer to post-launch (2–3 months) |
| **Natural-Weapons** | 54 | 🔴 | P4 | Fragment; no context | Merge into Gear subsystem or stand alone with integration note |
| **Marking Maps** | 273 | 🔴 | P4 | Standalone value unclear | Expand or merge into Adventure Structure |
| **Cycles-of-conflict.mermaid** | Visual | ⚠️ | P3 | Visual aid; needs context | Include in Unified Campaign Example or System Architecture |
| **magnitude** | 255 | ❌ | P4 | Design sketch | Move to Design Notes (outside _work-in-progress) |
| **morality axesis** | 15 | ❌ | P4 | Duplicate of Morality Aspects | Merge into canonical Morality Aspects file |

---

## Editorial vs. Structural Issues: Distinction

### Editorial Issues (Content/Clarity)
- Wordiness in intro post
- Inconsistent terminology (Engagement vs. Social Combat)
- Missing worked examples (4D8, Social Combat, Nemesis progression)
- Copy-paste errors (Power Apps in Knowledge Levels)
- Generic tone (Adventure Structure, Enrich Sessions)

**Responsibility:** Bilbo (Editorial Writer). Estimated effort per file: 30 min–2 hours.

### Structural Issues (Architecture/Sequencing)
- **Missing Character Creation** — No onramp for players
- **Missing System Architecture Overview** — No integration narrative; subsystems feel isolated
- **Missing Campaign Example** — No proof that systems work together
- **No series metadata or front-matter scaffolding** — Posts won't form discoverable collections
- **Incomplete WIP folder organization** — Fragments mixed with publication-ready content
- **No reading order** — Learners don't know where to start after intro

**Responsibility:** Elrond (Information Architect) + you (decision-maker). Estimated effort: 3–5 hours for all blocking issues.

---

## Final Recommendation

### Ship Plan (Next 4 Weeks)

**Week 1 (This Week):** Make three decisions:
1. **Decide scope:** Is Märchen Engine a complete RPG or a modular toolkit? This shapes weeks 2–4.
2. **Commit to Character Creation:** Extract, flesh out, publish as series_step: 2 (prerequisite for everything else).
3. **Choose System Architecture style:** Integration narrative or reference diagram + examples? This shapes Phase 2 work.

**Weeks 2–3:** Publish Tier 1 content (Magic Items, Nemesis, Social Combat with examples) + Character Creation + System Architecture Overview. This establishes reader confidence and proves coherence.

**Week 4:** Write Casting Framework + Moral Mechanics sections. Publish Magical Schools + Morality Aspects. Publish unified campaign example as proof-of-concept.

### Bottom Line

**The Märchen Engine is fundationally strong.** Your mechanical thinking is sophisticated; your identity is distinctive; your subsystems are well-designed. **You're not fixing broken content—you're completing architecture.**

The next 5–7 days of work will move you from "impressive design sketches" to "publishable game line." The highest-leverage moves are:
1. Formalize Character Creation
2. Write System Architecture Overview
3. Publish 3–4 Tier 1 subsystems with series metadata + worked examples

This signals completion and gives readers an onramp. Everything else (polish, supplements, advanced options) flows naturally from that foundation.

---

**Prepared by:** Aragorn, Lead / Product Owner  
**Status:** Ready for decision-making  
**Recommendation:** Activate Phase 1 immediately; target Week 1 completion.
