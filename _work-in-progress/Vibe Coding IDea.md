Utility QuickDesk — Product Requirements Document (PRD)

Merged app derived from ideas #1 Command‑K Launcher, #3 Jargon Translator, #4 Data‑Sensitivity Helper, #5 Safety Micro‑Logger, #6 Route & Site‑Day Planner, and #9 One‑Pager Builder
Version: 1.0 (Draft) • Date: 2025‑08‑15
Target environment: Southern California electric utility employees; desktop web first, mobile friendly
Build style: Single‑page PWA, vanilla HTML/CSS/JS, offline‑first, client‑side only (no external calls)

⸻

0) Executive Summary

Utility QuickDesk (UQD) is an offline‑capable, client‑side web app that gives employees a fast Command‑K palette to launch common links and complete six everyday tasks:
	1.	Quick Launch & Search across links, commands, saved docs
	2.	Plain‑Language Jargon Translator (short/medium/long explanations)
	3.	“Can I Share This?” Data‑Sensitivity Helper (policy‑guided decision tree)
	4.	Safety Micro‑Logger (60‑second personal capture + CSV export)
	5.	Route & Site‑Day Planner (multi‑stop ordering + Maps link)
	6.	One‑Pager Builder (problem→decision brief with live preview and export)

All data stays on device in localStorage/Cache Storage. Exports are user‑initiated (JSON/CSV/Markdown/PDF/ICS). No SSO, no APIs, no secrets.

⸻

1) Goals & Non‑Goals

1.1 Goals
	•	Speed to value: Launch anything with Cmd/Ctrl‑K in <250ms.
	•	Broad utility: At least one module useful to >70% of employees weekly.
	•	Zero‑risk demo: No backend, no enterprise data flow, no PII exfiltration.
	•	Offline‑first: Full functionality without network after first load.
	•	Clarity: Turn internal jargon into customer‑friendly language.
	•	Safer sharing: Provide a lightweight, explainable data‑classification helper.
	•	Frictionless capture: Log safety observations in under 60 seconds.
	•	Light planning: Create day routes and one‑pagers quickly.

1.2 Non‑Goals
	•	Replacing official systems (safety reporting, records, GIS, HR portals).
	•	Real‑time traffic optimization or precise routing with live data.
	•	Centralized storage or multi‑user collaboration.
	•	Accessing enterprise LLMs or external APIs.

⸻

2) Users & Key Use Cases

2.1 Personas
	•	Office/Field Hybrid Staff (Primary): Needs quick links, simple explanations, and day planning.
	•	Engineers/Planners: Occasionally need unit language simplification and brief writing.
	•	Comms/PMs/Analysts: Build one‑pagers; check data‑sharing guidance.
	•	Supervisors/Leads: Encourage safety culture with quick personal logging.

2.2 Top Scenarios
	•	Open UQD → Cmd‑K → launch VPN/HR/SharePoint link or “New One‑Pager”.
	•	Paste email text → Translate jargon to customer‑friendly short paragraph.
	•	Before sharing a screenshot → run Data‑Sensitivity Helper for channel guidance.
	•	While onsite → Log safety observation and export later to CSV.
	•	Plan 4–6 stops → Auto‑order route and open in Google Maps.
	•	Draft one‑pager, classify sensitivity, export Markdown/PDF, generate ICS reminders.

⸻

3) Constraints & Assumptions
	•	Client‑only: All computation/storage in browser.
	•	Privacy: No analytics or telemetry unless user exports local logs manually.
	•	Performance: First paint < 1s on modern laptop; search < 250ms @ 1,000 items.
	•	Browsers: Chromium‑based (Edge/Chrome) latest 2 versions; Safari/iOS recent.
	•	Accessibility: WCAG 2.2 AA; full keyboard navigation, ARIA roles.
	•	Content: Initial glossary and decision tree ship with editable JSON; users can adapt.

⸻

4) Information Architecture
	•	Single SPA with top‑bar: app title, search box (focus on Cmd/Ctrl‑K), settings.
	•	Command Palette (modal) for: Links, Commands, Glossary, Docs, Routes, Safety Logs.
	•	Modules as tabs: Home, Translator, Share Helper, Safety Log, Route Planner, One‑Pager, Settings.
	•	Unified storage namespace with versioned keys.

⸻

5) Functional Requirements (with IDs)

Format note: Each requirement has an ID for traceability. Acceptance tests are in §10.

5.1 CORE — Command Palette & Quick Launch

CORE‑G1 Provide a global Cmd/Ctrl‑K palette to fuzzy‑search and execute actions.

CORE‑FR1 (Palette Search)
	•	CORE‑FR1.1 Index: Quick Links, Commands, Glossary Terms (title + aliases), Saved Routes (name), Safety Logs (description snippet), One‑Pagers (title).
	•	CORE‑FR1.2 Fuzzy scoring: prefix > substring > token order; tie‑break by recency.
	•	CORE‑FR1.3 Keyboard: ↑/↓ to navigate, Enter to execute, Esc to close.
	•	CORE‑FR1.4 Render type badges (Link / Command / Glossary / Doc / Route / Log).
	•	CORE‑FR1.5 Search latency ≤ 250ms at 1,000 items.

CORE‑FR2 (Quick Links)
	•	CORE‑FR2.1 CRUD for user links: {id, title, url, tags[], pinned, lastUsedAt}.
	•	CORE‑FR2.2 Show grid on Home with pinned links; drag‑reorder; persist order.
	•	CORE‑FR2.3 Import/Export links as JSON.

CORE‑FR3 (Commands)
	•	CORE‑FR3.1 Built‑in commands: “New One‑Pager”, “New Safety Log”, “New Route”, “Classify Text”, “Translate Text”, “Open Settings”, “Import Data”, “Export Data”, “Open Today’s Items”.
	•	CORE‑FR3.2 Executing a command routes to the proper module with context (e.g., “Translate Text” opens Translator with clipboard content prefilled if permission granted).

CORE‑FR4 (Home)
	•	CORE‑FR4.1 Home shows: search bar, pinned links, recent docs (one‑pagers), quick actions (New One‑Pager, New Log, Plan Route), and a glossary quick‑lookup.

⸻

5.2 TRN — Plain‑Language Jargon Translator

TRN‑G1 Help users convert specialized terms into customer‑friendly language.

TRN‑FR1 (Glossary Data)
	•	TRN‑FR1.1 Ship with editable glossary:

{
  "id": "psps",
  "term": "PSPS",
  "aliases": ["Public Safety Power Shutoff"],
  "short": "Turning off power in high fire-risk weather to keep people safe.",
  "medium": "A temporary power shutoff during dangerous fire weather to reduce the chance that power lines could start a wildfire.",
  "long": "During extreme fire conditions (high winds, dry vegetation), utilities may temporarily turn off power in specific areas to reduce wildfire risk. We notify customers beforehand when possible and restore power as soon as conditions improve."
}


	•	TRN‑FR1.2 Required fields: {id, term, aliases[], short, medium, long, lastEditedAt}.
	•	TRN‑FR1.3 CRUD via UI; import/export JSON.

TRN‑FR2 (Translate Text)
	•	TRN‑FR2.1 Textarea input; detect glossary terms (case‑insensitive).
	•	TRN‑FR2.2 For each detected term, show short/medium/long explanations; click to copy.
	•	TRN‑FR2.3 “Rewrite paragraph” (client‑side rule‑based): replace jargon with short and simplify sentences (e.g., limit to 20–25 words; convert passive to active with simple heuristics).
	•	TRN‑FR2.4 Provide tone toggle: Neutral, Customer‑Friendly, Executive. (Use rule‑based substitutions: contractions, simpler verbs, bulleting).
	•	TRN‑FR2.5 Highlight substituted words and provide an “undo jargon replacement” per instance.

⸻

5.3 DSH — “Can I Share This?” Data‑Sensitivity Helper

DSH‑G1 Offer an explainable decision path to label content sensitivity and suggest channels.

DSH‑FR1 (Decision Tree)
	•	DSH‑FR1.1 Questions (Yes/No):
	1.	Does this contain customer identifiers (name, address, account #, phone, email)?
	2.	Does this include government‑issued IDs (SSN, driver’s license, passport)?
	3.	Does this include financial details (banking, payment, card numbers)?
	4.	Does this include employee‑private info (HR, medical, performance)?
	5.	Does this include operational vulnerabilities (system credentials, detailed network diagrams, security procedures)?
	6.	Does this include non‑public outage/restoration timelines or investigative details?
	7.	Has this information been publicly released on official channels?
	8.	Is sharing limited to internal employees/contractors with a business need?
	•	DSH‑FR1.2 Classification logic (deterministic, client‑side rules):
	•	If Q2 or Q3 = Yes → Highly Restricted
	•	Else if Q1 or Q4 or Q5 or Q6 = Yes → Restricted
	•	Else if Q7 = Yes and Q8 = Yes → Internal
	•	Else if Q7 = Yes and Q8 = No → Public
	•	Else → Internal (default)
	•	DSH‑FR1.3 Output card: Label, rationale (list of triggered rules), recommended channels:
	•	Public → Company website/social/media briefings.
	•	Internal → Company email/Teams/SharePoint (internal only).
	•	Restricted → Secure share (access‑controlled), avoid external email; consider redaction.
	•	Highly Restricted → Do not share; escalate to data owner/security.
	•	DSH‑FR1.4 Show “Suggested redactions” with regex highlights in user text:
	•	Potential account numbers: \b\d{8,12}\b
	•	Potential SSN: \b\d{3}-\d{2}-\d{4}\b
	•	Emails: \b\S+@\S+\.\S+\b
	•	Phone: \b(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b
	•	(Highlight only; user must confirm.)
	•	DSH‑FR1.5 Disclaimer text (exact):
“This tool is guidance only. You are responsible for compliance with company policies and law. When in doubt, do not share and consult the data owner/security.”
	•	DSH‑FR1.6 Save assessments locally with {id, textHash, answers[], label, timestamp}.

Integration
	•	DSH‑FR2.1 One‑Pager export requires the user to select a label; include it in the document footer.
	•	DSH‑FR2.2 Before generating share links (mailto, Maps link in docs), prompt if label is Restricted/Highly Restricted.

⸻

5.4 SFT — Safety Micro‑Logger (Personal)

SFT‑G1 Reduce friction to record safety observations privately; enable later export.

SFT‑FR1 (Capture)
	•	Fields: {id, timestamp (default now), locationName, lat (optional), lng (optional), category (Near Miss, Hazard, Good Catch, Property Damage, Injury), severity (Low/Med/High), description (max 500 chars), actionTaken (optional), photo (optional data URL), anonymous (bool), tags[]}.
	•	One‑screen form; primary button “Save in 1 click”.

SFT‑FR2 (Management)
	•	List with filters (date range, category, severity, tag, location).
	•	Edit/Delete entries; CSV export (RFC 4180).
	•	“Quick tag presets” editable in Settings.

SFT‑FR3 (Privacy)
	•	Local only; prominent note: “Personal log—not an official report.”
	•	Option to wipe all logs from device.

⸻

5.5 RTE — Route & Site‑Day Planner

RTE‑G1 Create and sequence a day’s stops without external APIs.

RTE‑FR1 (Stops)
	•	Stops: {id, name, address (free text), durationMin (default 30), timeWindowStart (optional), timeWindowEnd (optional), notes}.
	•	Add origin (default “Current location” free text), destination (optional).
	•	Drag to reorder manually.

RTE‑FR2 (Optimize)
	•	RTE‑FR2.1 Provide Nearest‑Neighbor ordering using Haversine distance on text geocentroids derived from a simple cache (see note below) or treat addresses as opaque and optimize by string similarity if no coords.
	•	RTE‑FR2.2 If durations/time windows exist, compute naive ETA by sequential sum (no traffic).
	•	RTE‑FR2.3 Show total drive time estimate using fixed 30 mph average when no distances known (configurable in Settings).

Note: Because no external geocoding is allowed, the app stores user‑provided lat/lng per known site (substations, yards, offices) in Settings. If coords are missing, optimization falls back to manual or simple name‑based grouping.

RTE‑FR3 (Open in Maps)
	•	Construct a Google Maps multi‑stop URL:

https://www.google.com/maps/dir/?api=1&origin=<enc>&destination=<enc>&waypoints=<enc;|enc;...>

and open in a new tab. Warn if label is Restricted/Highly Restricted.

RTE‑FR4 (Save/Export)
	•	Save named routes; export/import routes as JSON; print summary.

⸻

5.6 OPG — One‑Pager Builder (Project/Issue Brief)

OPG‑G1 Turn bullet inputs into a clean, consistent one‑pager.

OPG‑FR1 (Structure & Fields)
	•	Metadata: {id, title, owner, date (auto), sensitivityLabel (link DSH)}
	•	Sections: Problem, Context, Options (list of {title, pros, cons}), Risks, Recommendation, Decision, Next Steps (list of {who, what, dueDate}), Stakeholders, Contact.
	•	Live preview panel in Markdown/HTML.

OPG‑FR2 (Assist)
	•	TRN integration: Highlight jargon; show tap‑to‑insert short/medium/long explanations as footnotes or tooltips.
	•	DSH integration: Require selecting Public/Internal/Restricted/Highly Restricted before export; show banner with guidance.
	•	Action Items → ICS: Generate an .ics file per Next Step with UID, summary, due date as all‑day reminder.

OPG‑FR3 (Export)
	•	Export as Markdown, HTML, or PDF (client‑side print to PDF).
	•	Footer on export (exact string):
“Sensitivity: {LABEL}. Generated with Utility QuickDesk on {YYYY‑MM‑DD}.”

OPG‑FR4 (Library)
	•	Save drafts locally; show recent one‑pagers on Home; duplicate template.

⸻

5.7 SET — Settings & Data Management

SET‑FR1 (General)
	•	Light/Dark mode; font size; default driving speed; week start (Mon/Sun).
	•	Holiday list (used by any date math, e.g., ICS reminders if needed).
	•	Quick tag presets (Safety).

SET‑FR2 (Data)
	•	Export All (single JSON bundle with version header).
	•	Import (merge strategy with conflict resolution by timestamp).
	•	Factory Reset (wipe all local data after confirm).

SET‑FR3 (Sites & Coordinates)
	•	Manage known sites: {id, name, address, lat, lng}. Used by Route Planner.

SET‑FR4 (About)
	•	Version, changelog, license, disclaimers.

⸻

6) Non‑Functional Requirements (NFR)
	•	NFR‑1 Performance:
	•	First interactive: ≤ 1.0s on modern laptop; ≤ 2.5s on mid mobile.
	•	Palette open/search: ≤ 250ms at 1k items.
	•	Memory footprint steady ≤ 150MB for typical use.
	•	NFR‑2 Offline:
	•	PWA with service worker caching index.html, JS/CSS, icons, and data seed JSON.
	•	Graceful offline indicator; retry strategy N/A (no network needed).
	•	NFR‑3 Accessibility: WCAG 2.2 AA; focus rings, ARIA for dialogs, semantic landmarks; all actions keyboard accessible.
	•	NFR‑4 Security & Privacy:
	•	No external requests after load.
	•	Content‑Security‑Policy set to disallow remote scripts.
	•	Data at rest: browser localStorage/Cache; provide “Wipe Data”.
	•	File exports are user‑initiated downloads only.
	•	NFR‑5 Reliability:
	•	Storage versioning + migrations; no data loss on upgrade.
	•	NFR‑6 Internationalization:
	•	Prepare string table; EN‑US default.
	•	NFR‑7 Theming:
	•	System dark/light detection with user override; design tokens.

⸻

7) Data Model (Storage Keys & Schemas)

All objects include {id: string, createdAt: ISO, updatedAt: ISO}.

// Version header
AppStateMeta {
  schemaVersion: number;            // e.g., 1
  lastBackupAt?: ISOString;
}

// Links
QuickLink {
  id, title, url, tags: string[], pinned: boolean, lastUsedAt?: ISOString
}

// Glossary
GlossaryTerm {
  id, term, aliases: string[], short: string, medium: string, long: string, lastEditedAt: ISO
}

// Sensitivity Assessments
SensitivityRecord {
  id, textHash: string, answers: boolean[8], label: "Public"|"Internal"|"Restricted"|"Highly Restricted", timestamp: ISO
}

// Safety logs
SafetyLog {
  id, timestamp: ISO, locationName: string, lat?: number, lng?: number,
  category: "Near Miss"|"Hazard"|"Good Catch"|"Property Damage"|"Injury",
  severity: "Low"|"Medium"|"High",
  description: string, actionTaken?: string, photo?: dataURL, anonymous: boolean, tags: string[]
}

// Route planner
RouteStop { id, name: string, address: string, durationMin: number, timeWindowStart?: ISO, timeWindowEnd?: ISO, notes?: string }
RoutePlan { id, name: string, origin?: string, destination?: string, stops: RouteStop[], avgMph: number }

// One-pagers
NextStep { who: string, what: string, dueDate?: ISO }
Option { title: string, pros: string[], cons: string[] }
OnePager {
  id, title: string, owner: string, date: ISO,
  sensitivityLabel: "Public"|"Internal"|"Restricted"|"Highly Restricted",
  problem: string, context: string, options: Option[], risks: string[],
  recommendation: string, decision?: string, nextSteps: NextStep[],
  stakeholders: string[], contact: string
}

// Settings & Sites
Settings {
  theme: "system"|"light"|"dark", fontScale: number, defaultMph: number,
  weekStart: "Mon"|"Sun", holidays: ISO[], quickTags: string[]
}
Site { id, name: string, address: string, lat?: number, lng?: number }

Storage keys
uqd.meta, uqd.links, uqd.glossary, uqd.sensitivity, uqd.safety.logs, uqd.routes, uqd.onepagers, uqd.settings, uqd.sites.

Migration rule (example)
	•	If schemaVersion < 1 → initialize defaults and set to 1.
	•	Future: add mappers for renamed fields; never break exports.

⸻

8) Algorithms & Logic

8.1 Fuzzy Search (Palette)
	•	Tokenize query; for each item compute a score:
	•	+100 for prefix match on title; +60 for substring; +40 for alias match;
	•	−2 per extra unmatched token; +recency boost (≤ 14 days).
	•	Sort by score desc, then lastUsedAt desc, then title asc.

8.2 Route Optimization (Nearest‑Neighbor)

function orderStops(stops, start) {
  let remaining = [...stops], ordered = [], current = start;
  while (remaining.length) {
    let nextIdx = argmin(remaining, s => distance(current, s)); // Haversine if coords; else 0
    let next = remaining.splice(nextIdx, 1)[0];
    ordered.push(next);
    current = next;
  }
  return ordered;
}

	•	distance(a,b):
	•	If both have lat/lng → Haversine (earth radius 3959 mi).
	•	Else → 0 (preserve input order or treat as equal, allow manual drag).

8.3 Data Classification Logic

As specified in DSH‑FR1.2 (deterministic rules).

8.4 Paragraph Simplifier (Rule‑Based)
	•	Replace jargon tokens with glossary short.
	•	Split long sentences at ; : — then at conjunctions if > 25 words.
	•	Replace passive “will be restored” → “we will restore” when pattern matches.

⸻

9) UX Specifications

9.1 Visual & Layout
	•	Design tokens:
	•	Radius 8px; spacing 8/12/16/24; font system UI; line‑height 1.5.
	•	Focus outline 2px; min tappable 44×44.
	•	Palette modal: centered, 640px max width, input on top, list with type badges.
	•	Tabs: top bar: Home, Translator, Share Helper, Safety, Route, One‑Pager, Settings.

9.2 Keyboard Shortcuts
	•	Global: Cmd/Ctrl‑K (palette), ? (help), g h (home), g t (translator), g s (share helper), g l (logs), g r (route), g o (one‑pager).
	•	Within lists: ↑/↓, Enter (open), Delete (remove with confirm), e (edit).
	•	One‑Pager: Cmd/Ctrl+S save; Cmd/Ctrl+P export/print; Cmd/Ctrl+B/I Markdown toggles.

9.3 Exact UI Copy (selected)
	•	Home empty‑state: “Add your first link or press Cmd/Ctrl‑K to get started.”
	•	Share Helper disclaimer (see DSH‑FR1.5) must display verbatim.
	•	Safety log banner: “Personal safety notes for your use—not an official report.”

⸻

10) Acceptance Criteria (AT) — High Level

CORE
	•	AT‑CORE‑1: Cmd/Ctrl‑K opens palette from any tab; typing “one” shows “New One‑Pager” within top 3 if no other stronger matches.
	•	AT‑CORE‑2: Add three links, pin two; reload app → order and pins persist.
	•	AT‑CORE‑3: Import a JSON link set → merges without data loss; export reproduces data.

TRN
	•	AT‑TRN‑1: Pasting “PSPS may occur…” highlights PSPS and shows S/M/L explanations.
	•	AT‑TRN‑2: “Rewrite paragraph” replaces jargon and shortens sentences (<25 words avg).
	•	AT‑TRN‑3: Editing a term updates lastEditedAt and search results instantly.

DSH
	•	AT‑DSH‑1: If Q2 (IDs) = Yes → result is Highly Restricted with appropriate channel guidance.
	•	AT‑DSH‑2: Emails/phones in text are highlighted for redaction suggestions.
	•	AT‑DSH‑3: One‑Pager export blocked until a sensitivity label is selected.

SFT
	•	AT‑SFT‑1: Create a log with photo; it appears in list; CSV export contains columns including base64 photo indicator.
	•	AT‑SFT‑2: “Wipe all logs” removes only safety logs and leaves other data intact.

RTE
	•	AT‑RTE‑1: Add 4 stops with coords; “Optimize” changes order to nearest‑neighbor from origin.
	•	AT‑RTE‑2: “Open in Maps” generates a URL with waypoints in the same order.
	•	AT‑RTE‑3: Saving a route and reopening recovers all fields and notes.

OPG
	•	AT‑OPG‑1: Create one‑pager; TRN highlights jargon inside; inserting medium explanation works.
	•	AT‑OPG‑2: Setting label to Restricted shows banner; export PDF includes footer with label and date.
	•	AT‑OPG‑3: Next Step with due date generates valid .ics file (importable to Outlook/Google) with summary "[One‑Pager] {title} – {what}".

NFR
	•	AT‑NFR‑1: First load interactive ≤ 1.0s (cold cache test asset size ≤ 300KB gzipped).
	•	AT‑NFR‑2: Palette query across 1,000 items returns results ≤ 250ms.

⸻

11) Seed Content (shipped editable data)

11.1 Quick Links (examples)
	•	“VPN Portal” — https://vpn.example
	•	“Intranet Home” — https://intranet.example
	•	“Safety Policies” — https://intranet.example/safety

11.2 Glossary (examples)
	•	PSPS (see TRN‑FR1.1 example).
	•	SCADA
	•	short: “Systems that monitor and control equipment remotely.”
	•	medium: “Software and hardware used to monitor and control field devices like switches and breakers from a central location.”
	•	long: “Supervisory Control and Data Acquisition systems allow operators to remotely monitor and control grid devices, improving reliability and response times.”
	•	Recloser
	•	short: “A switch that can automatically turn power back on after a brief fault.”
	•	medium: “An automatic switch that briefly interrupts power when a fault occurs, then closes again to see if the problem has cleared.”
	•	long: “Reclosers improve reliability by temporarily opening when a fault is detected and then reclosing after a short delay. If the fault persists, they can lock open to prevent damage.”

(All content is placeholders; users can edit.)

11.3 Safety Categories & Tags
	•	Categories: Near Miss, Hazard, Good Catch, Property Damage, Injury.
	•	Quick tags: “Trip Hazard”, “PPE”, “Vehicle”, “Electrical”, “Weather”.

11.4 Known Sites (examples)
	•	“Central Yard” — 34.0, -118.2
	•	“Substation A” — 34.05, -118.25
	•	“HQ” — 34.05, -118.24

11.5 One‑Pager Template (starter text)
	•	Problem: “Brief 2–3 sentences.”
	•	Context: “Key facts, constraints, stakeholders.”
	•	Options: at least two with pros/cons.
	•	Risks: bullets.
	•	Recommendation: one clear statement.
	•	Decision: text or “Pending.”
	•	Next Steps: up to 8.

⸻

12) Error Handling & Empty States
	•	No results in palette: “No matches. Try fewer words or open a module.”
	•	Route with <2 stops: Disable Optimize with tooltip “Add 2+ stops to optimize.”
	•	Export with no data: Greyed out with “Nothing to export yet.”
	•	PDF print blocked by browser: Show tip to use “Save as PDF” option.

⸻

13) Security, Privacy, and Compliance Notes
	•	No network calls post‑load; set strict CSP (default-src 'self').
	•	Local‑only storage; provide wipe and export controls.
	•	Guidance disclaimer must accompany Data‑Sensitivity results.
	•	No automatic PII detection beyond regex highlights (user confirmation required).

⸻

14) Accessibility Details
	•	Palette uses role="dialog" + aria-modal="true"; focus trapped inside.
	•	Buttons, toggles, tabs have ARIA labels; lists are role="listbox" when applicable.
	•	Color contrast ≥ 4.5:1; do not rely on color alone for state.

⸻

15) Delivery Artifacts (LLM Build Checklist)

Create these files exactly (root folder):
	•	index.html — shell, tabs, modal, app root.
	•	styles.css — design tokens, light/dark, components.
	•	app.js — router, event bus, state/store, modules.
	•	store.js — storage API, migrations, import/export.
	•	search.js — fuzzy search scoring.
	•	utils.js — date, ICS generator, CSV export, Haversine, regex helpers.
	•	seed.json — initial links, glossary, settings, sample sites.
	•	manifest.webmanifest — PWA manifest (name “Utility QuickDesk”).
	•	service-worker.js — cache on install; stale‑while‑revalidate for shell (no network needed).
	•	icons/* — 192, 512 PNGs.

Build constraints for the LLM
	•	No external libraries or CDN dependencies.
	•	All processing client‑side; do not request remote fonts or scripts.
	•	Keep minified size ≤ 300KB gzipped total.
	•	Use semantic HTML; avoid complex frameworks.

⸻

16) PWA & Update Behavior
	•	Installable (manifest + icons); offline after first load.
	•	Update prompt: if service-worker finds a new version, show non‑blocking toast:
“Update available — Reload” with button to call skipWaiting/reload.

⸻

17) Future Enhancements (Post‑MVP)
	•	Optional opt‑in local analytics dashboard (on device) for personal usage stats.
	•	Redaction tool for images/PDF pages (canvas‑based).
	•	Tag‑based saved search views in palette.
	•	Template library for one‑pagers by department.

⸻

18) Definition of Done (DoD)
	•	All Acceptance Tests in §10 pass in Chrome/Edge latest.
	•	Lighthouse PWA score ≥ 90; Accessibility ≥ 90; Performance ≥ 85.
	•	Cold‑load bundle ≤ 300KB gzipped; no network after install.
	•	QA verifies storage export/import round‑trip without data loss.
	•	Code passes manual keyboard‑only navigation review.

⸻

19) Quick Developer Notes (for the LLM)
	•	State pattern: single AppState object; modules subscribe via a simple event bus (publish(topic, payload), subscribe(topic, fn)).
	•	Routing: hash‑based (#/translator, #/share, #/safety, #/route, #/onepager, #/settings).
	•	Printing PDF: use window.print() with print CSS in styles.css.
	•	ICS generation: minimal VCALENDAR with VEVENT per Next Step; timezone naive (UTC or local with TZID omitted).
	•	CSV: Escape quotes, commas; newlines as \r\n.
	•	Images: Store as data URLs; caution about size; warn if >1MB.

⸻

Appendix A — Example Export Bundle (truncated)

{
  "meta": {"schemaVersion":1,"lastBackupAt":"2025-08-15T10:00:00Z"},
  "links":[{"id":"l1","title":"Intranet Home","url":"https://intranet.example","tags":["home"],"pinned":true,"lastUsedAt":null}],
  "glossary":[{"id":"psps","term":"PSPS","aliases":["Public Safety Power Shutoff"],"short":"Turning off power in high fire-risk weather to keep people safe.","medium":"A temporary power shutoff during dangerous fire weather to reduce the chance that power lines could start a wildfire.","long":"During extreme fire conditions (high winds, dry vegetation), utilities may temporarily turn off power in specific areas to reduce wildfire risk. We notify customers beforehand when possible and restore power as soon as conditions improve.","lastEditedAt":"2025-08-15T10:00:00Z"}],
  "sensitivity":[],
  "safetyLogs":[],
  "routes":[],
  "onepagers":[],
  "settings":{"theme":"system","fontScale":1,"defaultMph":30,"weekStart":"Mon","holidays":[],"quickTags":["PPE","Vehicle","Weather"]},
  "sites":[{"id":"site1","name":"HQ","address":"HQ, Los Angeles, CA","lat":34.05,"lng":-118.24}]
}


