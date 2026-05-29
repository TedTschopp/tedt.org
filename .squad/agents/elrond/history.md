# Elrond, Information Architect — Project History

**Role:** Protects information structure so the site can grow without turning incoherent.

---

## Sessions & Decisions

### Session 1: Märchen Engine Book Outline (2026-05-28)

**Requested by:** Ted Tschopp  
**Task:** Design a coherent table of contents / outline for a single-volume Märchen Engine TTRPG core rulebook.

#### Inputs Analyzed:
- Published intro post (2023-09-30, ~3,000 words, strong tone & philosophy)
- 21 WIP subsystem documents (~7,100 lines total)
- Status report (Aragorn, Product Owner)
- Editorial feedback (Bilbo, Editorial Writer)
- Previous IA audit (Elrond, own work)

#### Key Findings:
1. **Corpus has strong building blocks but lacks coherence narrative.**
   - Excellent subsystems: 4D8, Social Combat, Magic Items, Nemesis, Bastion
   - Missing: character creation (completely unpublished), system integration narrative, casting mechanics, proof-of-concept campaign
   
2. **Information architecture is fragmented.**
   - WIP directory is flat with no reading order
   - Concept duplication (Morality, Knowledge Levels appear in multiple forms)
   - No published chargen flow
   
3. **Core dependency chain is clear.**
   - Chargen gates all subsystems (can't roll without ability scores)
   - 4D8 gates all subsystems that layer onto it (Magic, Engagement, Nemesis)
   - Campaign example gates reader confidence in system coherence

#### Proposed Outline:
**Single-volume core rulebook with 13 chapters + appendices**

Structure:
- **Intro + Chapters 1–3:** Foundations (intro, chargen, 4D8 system)
- **Chapters 4–7:** Core subsystems (Engagement, Magic, Items, Nemesis)
- **Chapters 8–9:** Campaign mechanics (Bastion, Seasonal Activities) — optional
- **Chapters 10–12:** Referee toolkit (adventure design, opposition, maps)
- **Chapter 13:** Proof of concept (Alpine Mirror campaign example)
- **Appendices A–E:** Advanced frameworks, glossary, sheets

#### Five Critical Structural Risks:
1. Magic system without casting mechanics → readers can't adjudicate spells
2. Character creation incomplete → unplayable system (blocker)
3. Bastion reads as D&D-borrowed, not Märchen-native → trust erodes
4. No campaign proof of concept → readers doubt subsystems cohere
5. Morality becomes decorative if not woven into subsystems → philosophy decouples from mechanics

#### Mitigations:
1. Casting Framework (Ch. 5, mandatory) with worked examples
2. Chapter 2 (chargen) positioned as #2 in book; comprehensive + example character
3. Rewrite Bastion as "Sanctuary" with Märchen terminology + moral aspect ties (or defer to Appendix B)
4. Chapter 13 (Alpine Mirror) shows all systems in one coherent arc
5. Morality aspects in chargen (light intro, Ch. 2) + deep mechanics in Appendix A; sidebar hooks in Chs. 4 & 8

#### Deliverables:
- `/MARCHEN-ENGINE-BOOK-OUTLINE.md` — Comprehensive outline (13 chapters + appendices, ~10,000 words)
  - Table of contents
  - Chapter descriptions & source content
  - Dependencies & teaching sequence
  - Five structural risks & mitigations
  - Content migration guide (publish / defer / archive)
  - Success criteria
  - Timeline estimate (13–19 days for core book)

- `.squad/decisions/inbox/elrond-marchen-book-outline.md` — IA decision record
  - Architecture decisions embedded in outline
  - Structure rationale with dependency diagrams
  - Next steps for Ted

#### IA Confidence Score:
- Reading Order: 9/10 (dependencies explicit, teaching sequence sound)
- Coherence: 8/10 (depends on Alpine Mirror proof-of-concept edit)
- Completeness: 7/10 (chargen synthesis + casting framework are risks)
- Publication Ready: 5/10 (many chapters 80% ready; Ch. 2, 5, 8 highest effort)
- Risk Mitigation: 8/10 (all risks identified with clear mitigations)

**Overall Recommendation:** Proceed with complete rulebook outline. Effort manageable (13–19 days). Alpine Mirror already exists; chargen and casting framework are synthesis/extension work.

---

## Learnings & Patterns

### Pattern 1: Information Architecture Requires Proof of Concept
TTRPG systems with multiple subsystems need *one demonstrated campaign* showing all subsystems in play. Without this, readers won't trust that subsystems cohere. This is not a "nice to have"; it's a publication blocker.

**Implication:** When designing game rules collections, always reserve space for a worked example campaign. It's as important as the rules themselves.

### Pattern 2: Chargen Gates All Subsystems
Character creation is not *one* chapter; it's a foundational gate. If chargen is scattered across multiple files, unpublished, or incomplete, the entire system becomes unplayable. Priority order:
1. Finish chargen first (enables testing)
2. Core resolution mechanic (4D8 or equivalent)
3. Everything else

### Pattern 3: Mechanical Grounding Must Precede Lore
Conceptually beautiful subsystems (magic schools, moral frameworks) without mechanical hooks feel decorative. Readers admire philosophy but don't know where it lives in rules. Always pair lore with mechanics: "Here's how you cast the spell. Here's what it costs. Here's how to resolve it."

**Example:** New Magical Schools (338 lines) is conceptually rich but mechanically orphaned. Adding a Casting Framework (~1,000 words) unlocks the entire system from "beautiful but unplayable" to "coherent and adjudicable."

### Pattern 4: Terminology Consistency Is Architectural
When subsystems use the same concept with different names (Rank, Bond, Influence, Skill Level), readers feel the system is fragmented even if it's mechanically sound. Before publishing, establish a canonical glossary and enforce consistent naming across all subsystems.

### Pattern 5: Optional Subsystems Still Need Integration Chapters
Bastion is not mandatory for one-shots but is essential for campaigns. Rather than making it *feel* optional (by keeping it generic and D&D-borrowed), rewrite it as a Märchen-native system with clear Sanctuary terminology and moral aspect ties. Readers will understand: "This is optional in scope, but it's *native* when you use it."

---

## Observations for Future IA Work

1. **The Märchen Engine has a distinctive voice** anchored in fairytale aesthetics + community values ("joy, kindness, integrity"). This voice is present in the intro and subsystems like Magic Items and Legacy of Scars. When rewriting Bastion or adding Casting Framework, preserve this voice. Don't let borrowings from D&D or generic fantasy dilute the Märchen identity.

2. **The WIP directory structure is a red herring.** Physical folder organization doesn't map to information hierarchy. A flat WIP folder with 21 files suggests chaos, but the actual coherence problem is *logical* (dependencies, terminology, proof of concept), not *organizational*. Reorganizing files won't fix incoherence; rewriting chargen + casting mechanics + campaign example will.

3. **The Alpine Mirror is the skeleton for proof of concept.** It's ~1,200 lines, already written, and includes NPC stats, adventure structure, and campaign arcs. A light edit framing it as "Here's how all systems work together over 6–12 sessions" transforms it from a setting-specific module into the proof-of-concept that unlocks reader confidence in system coherence.

4. **Morality Aspects are under-leveraged.** The 12-dimension moral framework is theoretically sophisticated and practically interesting (unusual for TTRPGs). But it exists in isolation. By weaving morality into chargen selections, Bastion construction, and Engagement consequences, you elevate it from philosophical flavor to mechanical spine. This is a high-leverage IA move.

5. **Series metadata will be essential for web publication.** Once the chapters are written as posts, use ADR 0002 (series framework) to establish reading order. Front matter: `series: Märchen Engine Rules`, `series_step: 1, 2, 3…`. This enables the homepage carousel to surface the series coherently.

---

## Recommendations for Next IA Work

1. **Validate outline with Ted.** Does the chapter structure and dependency chain align with his vision for the system?

2. **Prioritize blocking work:**
   - Chapter 2 (Character Creation): Extract, synthesize, test. 3–4 days. This unblocks everything.
   - Chapter 5 (Casting Framework): Write from first principles. 1–2 days. This unblocks Magic rules.

3. **Decide on Bastion:** Invest in Märchen-native rewrite (2–3 days) or defer to supplement? Either way, decide now so effort can be allocated.

4. **Commission Chapter 13 edit:** Alpine Mirror is ~80% ready; light edit to frame it as proof-of-concept should be 1–2 days.

5. **After outline validation, create a publishing manifest:**
   - Which chapters are ready now (80%+)?
   - Which need significant work (40–70%)?
   - Which are new content (0–40%)?
   - Sequence publication based on dependencies (chargen first, always).

---

*Elrond, Information Architect*  
*Updated: 2026-05-28T21:31:35.929-07:00*

- 2026-05-29T04:51:50Z — Märchen Engine IA outline COMPLETED. Wrote `/MARCHEN-ENGINE-BOOK-OUTLINE.md` (comprehensive IA document). Cross-agent coordination with Bilbo (Editorial) and Aragorn (Product) produced binding core book decision. Contribution: Reading order + dependencies, chapter sequencing, content allocation, risk mapping, IA confidence scoring. Key IA decisions locked: (1) Character Creation Chapter 2 (gates all subsystems), (2) Casting Framework before school descriptions, (3) Bastion rewrite-or-defer, (4) Campaign example non-negotiable, (5) Morality in two layers (light + deep). Five critical risks identified + mitigated: Magic mechanics, Chargen completeness, Bastion genericity, coherence proof, morality mechanization. IA Confidence: Reading Order 9/10, Coherence 8/10, Completeness 7/10, Publication Ready 5/10, Risk Mitigation 8/10. Hand-off: IA outline published to team. Orchestration log: `.squad/orchestration-log/2026-05-29T04:51:50Z-elrond.md`.
