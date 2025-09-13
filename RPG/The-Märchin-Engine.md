---
title: "Three‑Layer Plot Library (Scene → Episode → Meta)"
date: 2025-09-13
tags: ["TTRPG", "GM Tools", "Clocks", "Plot Design"]
summary: "A complete three‑layer plot library with scene clocks, thresholds, episode arcs, meta hooks, seeds for 7 genres, and scores."
---

This is a **complete, interactive library** of clock‑driven plots tuned for a **three‑layer engine**:

- **Layer 1 — Scene (30 minutes)**: interlocked clocks for the immediate tension.  
- **Layer 2 — Episode (8–10)**: tonight’s throughline mission clock.  
- **Layer 3 — Meta (8–16)**: multiple always‑on clocks (Factions, Campaign Goal, Seasonal Throughline).

Use the **filters** to jump to a plot or highlight a genre’s seeds. All clocks, thresholds, episode arcs, meta hooks, and scores are included.

> Want printables? See:  
> **Clock Cards** and **GM Procedure One‑Pager** (link to your existing posts).

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