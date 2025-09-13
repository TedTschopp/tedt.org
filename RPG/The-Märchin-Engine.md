---
title: "Three‑Layer Clock Cards (Printable + Web Component)"
date: 2025-09-13
tags: ["TTRPG", "GM Tools", "Clocks", "Printable", "BitD-style"]
summary: "Web-rendered, printable clock cards for a three‑layer, multi‑tempo TTRPG engine—Scene, Episode, and Meta (Factions, Campaign, Seasonal)."
permalink: /RPG/the-marchin-engine/
redirect_from:
  - /RPG/The-Märchin-Engine.html
  - /RPG/The-Märchin-Engine
  - /RPG/The-Marchin-Engine.html
  - /RPG/The-Marchin-Engine

---

Build and print the exact **clock cards** I use for three‑layer, multi‑tempo play: **Scene** (30‑minute interlocked clocks), **Episode** (tonight’s arc), and **Meta** (Factions, Campaign Goal, Seasonal Throughline).  
This page renders all cards **live** with inline SVG and lays them out **four per Letter page** with cut lines. Hit **Print** to get your deck.

> Prefer ready‑mades? Download the PDFs:
> - **Clock Cards PDF** — 4 per page, cut lines:  
>   [Download PDF](/assets/Three_Layer_Clock_Cards.pdf) <!-- replace with your hosted URL -->
>   (sandbox copy for reference: [here](sandbox:/mnt/data/Three_Layer_Clock_Cards.pdf))
>
> - **GM Procedure One‑Pager**:  
>   [Download PDF](/assets/GM_Procedure_One_Pager.pdf) <!-- replace with your hosted URL -->
>   (sandbox copy: [here](sandbox:/mnt/data/GM_Procedure_One_Pager.pdf))

---

## Quick Start

1. **Click Print** (browser print dialog) to produce 4 cards per US Letter page with light dashed cut lines.  
2. Use **pencil** on the threshold lines and notes so you can erase and reuse.  
3. Keep **Episode** and active **Meta** clocks in the center of the table; rotate **Scene** cards in per 30‑minute scene.

<div class="toolbar">
  <button onclick="window.print()">🖨️ Print Cards</button>
</div>

---

## Cards

The gallery below is generated entirely in‑page. You can edit titles, subtitles, and segment counts by changing the `cardsData` list at the bottom.

### What’s included

- **Scene** layer (30‑minute scenes): Objective, Alarm, Timer, Hazard, Integrity, Leads, Obstruction, Threat Matures, Exit Window, Counter‑Moves, Breach, Civilians/Assets, Supplies, Research, Track & Corner, Prey Adapts, Community Cost, Route Leg, Ambush, Cargo, Goodwill, Capital, Opposition Posture, Audience Mood, Protocol/Taboo, Exposure, Wayfinding, Rations/Power, Phenomenon/Predator, Ritual Steps, Interference, Anchor, Backlash, Stalker Proximity, Counter‑Prep, Civilian Spotlight, Tell Exposed, Infrastructure, Culture, Deterrence, Local Project, Stabilization, Secondary Hazards, Evacuations, Media/Blame.
- **Episode** layer: Episode Arc (8), Episode Arc (10).
- **Meta** layer: Campaign Goal (12/16), Seasonal (8/12), Faction Influence (10), Faction Project (8), Faction Legitimacy (8), **Opposed Meta** (Hope 8, Doom 8).
- **Generic blanks**: 4 / 6 / 8 / 10 / 12.

> **Layout features on each card**
> - Radial **segmented clock** (4/6/8/10/12)
> - **Thresholds** for 25% / 50% / 75%
> - **Links (multi‑tempo)** block (Threshold taps, Outcome taps, Echo Actions)
> - **Finisher** unlock prompt (Scene/Episode) and **Pushback** field
> - **Notes / Who ticks** field (use for naming which Faction/Seasonal reacts)

---

<!-- Card grid mounts here -->
<div id="card-pages"></div>

<style>
/* ====== Print & Layout ====== */
@page {
  size: Letter;
  margin: 0.5in;
}
@media print {
  .toolbar { display:none !important; }
  .cutline { border: 0; }
}
.toolbar {
  margin: 1rem 0;
}
#card-pages {
  display: grid;
  gap: 0.75rem;
}
/* One Letter page per .page; 2x2 grid inside with dashed cut lines */
.page {
  position: relative;
  break-after: page;
  padding: 0.25rem;
  outline: 1px dashed rgba(0,0,0,0.1);
}
.page-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 0.5rem;
}
/* Visual guides */
.page:before,
.page:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 0; border-left: 1px dashed rgba(0,0,0,0.25);
}
.page .hline {
  position: absolute; left:0; right:0; top:50%;
  border-top: 1px dashed rgba(0,0,0,0.25);
}

/* ====== Card ====== */
.card {
  border: 1.5px solid #111;
  padding: 10px 10px 8px 10px;
  display: grid;
  grid-template-columns: 42% 58%;
  grid-template-rows: auto auto 1fr;
  gap: 6px 10px;
  font-family: ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}
.card h3 {
  margin: 0;
  font-size: 1.05rem;
}
.card .meta {
  font-size: 0.72rem;
  opacity: 0.85;
}
.card .layer {
  justify-self: end;
  font-size: 0.8rem;
  font-weight: 600;
}
.clock {
  grid-row: 2 / span 2;
  grid-column: 1 / 2;
  display: grid;
  place-items: center;
}
.clock figcaption {
  font-size: 0.70rem;
  margin-top: 4px;
}
.fields {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  font-size: 0.80rem;
}
.field-block h4 {
  margin: 0.15rem 0 0.25rem 0;
  font-size: 0.85rem;
}
.checkbox-line {
  display: flex;
  align-items: center;
  margin: 0.12rem 0;
}
.checkbox-line .box {
  width: 10px; height: 10px;
  border: 1px solid #111; margin-right: 6px;
  display: inline-block;
}
.lined {
  border-bottom: 0.8px solid #888;
  height: 1em;
  flex: 1;
  margin-left: 6px;
}
.small-line {
  border-bottom: 0.8px solid #888;
  width: 100%;
  height: 1em;
  margin: 0.12rem 0 0.3rem 0;
}
.footer-fields {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}
.footer-fields .row { margin-top: 0.25rem; }
.footer-fields label { font-size: 0.78rem; }
.footer-fields .small-line { margin-top: 0.18rem; }

/* Accessibility */
svg[role="img"] { outline: none; }
</style>

<script>
/* ====== Clock SVG generator ====== */
function makeClockSVG(segments, size=220){
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label", segments + "-segment progress clock");

  const cx = size/2, cy = size/2, r = size/2 - 8;

  // Outer circle
  const circ = document.createElementNS(NS,"circle");
  circ.setAttribute("cx", cx); circ.setAttribute("cy", cy);
  circ.setAttribute("r", r);
  circ.setAttribute("fill","none");
  circ.setAttribute("stroke","#111");
  circ.setAttribute("stroke-width","2");
  svg.appendChild(circ);

  // Segment spokes (start at 12 o'clock, clockwise)
  for (let i=0;i<segments;i++){
    const theta = -Math.PI/2 - (i * 2*Math.PI/segments);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    const line = document.createElementNS(NS,"line");
    line.setAttribute("x1", cx); line.setAttribute("y1", cy);
    line.setAttribute("x2", x);  line.setAttribute("y2", y);
    line.setAttribute("stroke","#111");
    line.setAttribute("stroke-width","1");
    svg.appendChild(line);
  }

  // Center dot
  const dot = document.createElementNS(NS,"circle");
  dot.setAttribute("cx", cx); dot.setAttribute("cy", cy);
  dot.setAttribute("r", 2.2);
  dot.setAttribute("fill","#111");
  svg.appendChild(dot);

  return svg;
}

/* ====== Card renderer ====== */
function cardEl({title, layer, subtitle, segments, finisher=true, showLinks=true, showThresholds=true}){
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div style="grid-column: 1 / 2;">
      <h3>${escapeHtml(title)}</h3>
      <div class="meta">${escapeHtml(subtitle||"")}</div>
    </div>
    <div class="layer">${escapeHtml(layer)}</div>
    <figure class="clock"></figure>
    <div class="fields"></div>
    <div class="footer-fields"></div>
  `;

  // clock svg
  const fig = el.querySelector(".clock");
  fig.appendChild(makeClockSVG(segments));
  const cap = document.createElement("figcaption");
  cap.textContent = `Segments: ${segments}`;
  fig.appendChild(cap);

  const fields = el.querySelector(".fields");
  if (showThresholds){
    fields.insertAdjacentHTML("beforeend", `
      <div class="field-block">
        <h4>Thresholds</h4>
        <div class="checkbox-line"><span class="box"></span><span>25% — Effect / Twist</span><span class="lined" aria-hidden="true"></span></div>
        <div class="checkbox-line"><span class="box"></span><span>50% — Escalation / Unlock</span><span class="lined" aria-hidden="true"></span></div>
        <div class="checkbox-line"><span class="box"></span><span>75% — Climax / Gate Opens</span><span class="lined" aria-hidden="true"></span></div>
      </div>
    `);
  }
  if (showLinks){
    fields.insertAdjacentHTML("beforeend", `
      <div class="field-block">
        <h4>Links (multi‑tempo)</h4>
        <div class="checkbox-line"><span class="box"></span><span>Threshold taps → Episode +1</span></div>
        <div class="checkbox-line"><span class="box"></span><span>At 50%/75% also → Meta +1 (Faction/Season)</span></div>
        <div class="checkbox-line"><span class="box"></span><span>On Success → Meta +1 (Campaign/Ally)</span></div>
        <div class="checkbox-line"><span class="box"></span><span>On Failure → Meta +1 (Opposition/Season)</span></div>
        <div style="margin-top: 0.22rem;">
          <div style="font-size:0.78rem; opacity:0.9;">Echo Actions (spend currency to tick/erase):</div>
          <div class="small-line" aria-hidden="true"></div>
        </div>
      </div>
    `);
  }

  const foot = el.querySelector(".footer-fields");
  let footerHTML = "";
  if (finisher){
    footerHTML += `
      <div class="row"><label>Finisher unlocked at:</label><div class="small-line" aria-hidden="true"></div></div>
    `;
  }
  footerHTML += `
      <div class="row"><label>Pushback (erase/reverse):</label><div class="small-line" aria-hidden="true"></div></div>
      <div class="row"><label>Notes / Who ticks:</label><div class="small-line" aria-hidden="true"></div></div>
  `;
  foot.innerHTML = footerHTML;

  return el;
}

function escapeHtml(str){
  return (str || "").replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

/* ====== Paginate (4 per page) ====== */
function renderPages(cards){
  const mount = document.getElementById("card-pages");
  mount.innerHTML = "";
  for (let i=0;i<cards.length;i+=4){
    const page = document.createElement("div");
    page.className = "page";
    const grid = document.createElement("div");
    grid.className = "page-grid";
    for (let j=i;j<i+4 && j<cards.length;j++){
      grid.appendChild(cardEl(cards[j]));
    }
    page.appendChild(grid);
    const hline = document.createElement("div");
    hline.className = "hline";
    page.appendChild(hline);
    mount.appendChild(page);
  }
}

/* ====== Data ====== */
const cardsData = [
  // ---------- Scene layer ----------
  {title:"Objective / Progress", layer:"SCENE", subtitle:"Heist, build, solve, rescue", segments:8},
  {title:"Alarm / Suspicion", layer:"SCENE", subtitle:"Patrols, wards, scrutiny", segments:6},
  {title:"Timer / Countdown", layer:"SCENE", subtitle:"Immutable clock (detonation, eclipse, departure)", segments:6},
  {title:"Timer / Countdown", layer:"SCENE", subtitle:"Longer timer", segments:8},
  {title:"Hazard / Complications", layer:"SCENE", subtitle:"Environmental risks, traps, setbacks", segments:6},
  {title:"Resource / Integrity", layer:"SCENE", subtitle:"Cargo, wards, reactor core, evidence", segments:6},
  {title:"Leads Found", layer:"SCENE", subtitle:"Investigation progress", segments:8},
  {title:"Obstruction", layer:"SCENE", subtitle:"Red tape, rivals, locks", segments:6},
  {title:"Threat Matures", layer:"SCENE", subtitle:"Culprit/curse escalates", segments:6},
  {title:"Exit Window", layer:"SCENE", subtitle:"The easy route closes at full", segments:4},
  {title:"Counter‑Moves", layer:"SCENE", subtitle:"Sorties, repairs, bargains", segments:8},
  {title:"Breach", layer:"SCENE", subtitle:"Enemy advances through defenses", segments:8},
  {title:"Civilians / Assets", layer:"SCENE", subtitle:"Evacuate/preserve", segments:6},
  {title:"Supplies", layer:"SCENE", subtitle:"Ammo, holy water, coolant, goodwill", segments:6},
  {title:"Research Signs", layer:"SCENE", subtitle:"Weaknesses, baits, tells", segments:6},
  {title:"Track & Corner", layer:"SCENE", subtitle:"Herd the prey into your killbox", segments:8},
  {title:"Prey Adapts", layer:"SCENE", subtitle:"Evolves new behaviors", segments:6},
  {title:"Community Cost", layer:"SCENE", subtitle:"Victims, livestock, panic", segments:4},
  {title:"Route Leg", layer:"SCENE", subtitle:"Waypoint (repeatable leg clock)", segments:4},
  {title:"Ambush Pressure", layer:"SCENE", subtitle:"Raiders/spirits/bureaucrats", segments:6},
  {title:"Cargo Integrity", layer:"SCENE", subtitle:"Person/relic/reactor", segments:6},
  {title:"Goodwill", layer:"SCENE", subtitle:"Locals help or hinder", segments:6},
  {title:"Capital (Leverage)", layer:"SCENE", subtitle:"Favors, dirt, proofs", segments:8},
  {title:"Opposition Posture", layer:"SCENE", subtitle:"Spin, smear, obstruction", segments:6},
  {title:"Audience Mood", layer:"SCENE", subtitle:"Undecided → convinced", segments:6},
  {title:"Protocol / Taboo", layer:"SCENE", subtitle:"Breaches speed Opposition", segments:4},
  {title:"Exposure", layer:"SCENE", subtitle:"Heat/cold/radiation", segments:8},
  {title:"Wayfinding", layer:"SCENE", subtitle:"Navigation, omens", segments:6},
  {title:"Rations / Power", layer:"SCENE", subtitle:"Dwindling supplies", segments:6},
  {title:"Phenomenon / Predator", layer:"SCENE", subtitle:"Stormfront or pursuit", segments:6},
  {title:"Ritual Steps", layer:"SCENE", subtitle:"Materials, circles, words", segments:8},
  {title:"Interference", layer:"SCENE", subtitle:"Entity disruption, outsiders", segments:6},
  {title:"Anchor Integrity", layer:"SCENE", subtitle:"Vessel, wards, host", segments:6},
  {title:"Backlash", layer:"SCENE", subtitle:"Blood price, surges", segments:4},
  {title:"Stalker Proximity", layer:"SCENE", subtitle:"Rumors → breathing on neck", segments:8},
  {title:"Counter‑Prep", layer:"SCENE", subtitle:"Traps, decoys, safehouses", segments:6},
  {title:"Civilian Spotlight", layer:"SCENE", subtitle:"Bystanders complicate", segments:4},
  {title:"Tell Exposed", layer:"SCENE", subtitle:"Reveal weakness", segments:4},
  {title:"Infrastructure", layer:"SCENE", subtitle:"Power, water, medbay, wards", segments:10},
  {title:"Culture", layer:"SCENE", subtitle:"Laws, rites, markets", segments:8},
  {title:"Deterrence", layer:"SCENE", subtitle:"Patrols, treaties, charms", segments:8},
  {title:"Project (Local)", layer:"SCENE", subtitle:"Workshops, upgrades", segments:6},
  {title:"Stabilization", layer:"SCENE", subtitle:"Triage/douse/appease", segments:8},
  {title:"Secondary Hazards", layer:"SCENE", subtitle:"Cascades, aftershocks", segments:6},
  {title:"Evacuations", layer:"SCENE", subtitle:"Get people out", segments:6},
  {title:"Media / Blame", layer:"SCENE", subtitle:"Narrative control", segments:4},

  // ---------- Episode layer ----------
  {title:"EPISODE ARC", layer:"EPISODE", subtitle:"Tonight’s throughline (8‑segment)", segments:8},
  {title:"EPISODE ARC", layer:"EPISODE", subtitle:"Tonight’s throughline (10‑segment)", segments:10},

  // ---------- Meta layer ----------
  {title:"Campaign Goal", layer:"META", subtitle:"Party’s long arc", segments:12, finisher:false},
  {title:"Campaign Goal", layer:"META", subtitle:"Party’s long arc (extended)", segments:16, finisher:false},
  {title:"Seasonal Throughline", layer:"META", subtitle:"Calendar rites / storms / festivals", segments:8, finisher:false},
  {title:"Seasonal Throughline", layer:"META", subtitle:"Calendar year / major arc", segments:12, finisher:false},
  {title:"Faction: Influence", layer:"META", subtitle:"Reach over territory/institutions", segments:10, finisher:false},
  {title:"Faction: Project", layer:"META", subtitle:"Weapon / ritual / AI rollout", segments:8, finisher:false},
  {title:"Faction: Legitimacy", layer:"META", subtitle:"Public support / piety / brand", segments:8, finisher:false},
  {title:"Hope (Opposed Meta)", layer:"META", subtitle:"Preparation / solidarity", segments:8, finisher:false},
  {title:"Doom (Opposed Meta)", layer:"META", subtitle:"Threat / entropy / oppression", segments:8, finisher:false},

  // ---------- Generic blanks ----------
  {title:"Generic Clock (Blank)", layer:"SCENE", subtitle:"Use‑anywhere template", segments:4},
  {title:"Generic Clock (Blank)", layer:"SCENE", subtitle:"Use‑anywhere template", segments:6},
  {title:"Generic Clock (Blank)", layer:"SCENE", subtitle:"Use‑anywhere template", segments:8},
  {title:"Generic Clock (Blank)", layer:"SCENE", subtitle:"Use‑anywhere template", segments:10},
  {title:"Generic Clock (Blank)", layer:"SCENE", subtitle:"Use‑anywhere template", segments:12}
];

document.addEventListener("DOMContentLoaded", () => renderPages(cardsData));
</script>
