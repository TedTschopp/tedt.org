# Unauthorized Application Remediation Communications Framework

## 1) Program goals and what “good” looks like

### Primary goals

1. **Reduce security and compliance risk** by eliminating or remediating unauthorized software.
2. **Standardize and support** a known set of applications (reduce helpdesk load, improve patching).
3. **Optimize licensing and cost** by removing redundant tools and ensuring licensing compliance.
4. **Minimize business disruption** through clear timelines, alternatives, and support.

### Success measures (track weekly)

* % reduction in unauthorized app installs (overall and by business unit)
* # of apps remediated (upgrade / replace / remove / approved via business case)
* # of exceptions requested vs approved vs denied
* Helpdesk ticket volume and top issue categories
* Adoption metrics for replacement apps (downloads, active users, training attendance)
* “Time to remediate” by disposition category

---

## 2) Guiding principles for communications

These principles keep the effort from feeling punitive and help you maintain trust.

1. **No surprises:** Default to advance notice windows (except critical security).
2. **Explain the “why” plainly:** tie actions to security, compliance, reliability, cost, and support.
3. **Offer a path forward:** always provide an alternative or an exception/business-case path.
4. **Target communications:** don’t blast 25k with app-specific detail unless impact is broad.
5. **Two-way:** make it easy to ask questions, request help, or submit a business case.
6. **Manager-enabled:** managers get toolkits and early notice when their teams are impacted.

---

## 3) Governance and operating model (who owns what)

A communications plan only works if it’s coupled to decision-making and execution.

### Recommended team structure

* **Executive Sponsor:** CIO or CISO (sets tone; approves enforcement posture)
* **Program Owner:** IT Asset Management / Endpoint / EUC lead
* **Security Lead:** risk classification, emergency actions
* **Comms Lead (Change Management):** calendar, messaging, channels, templates
* **Service Desk Lead:** scripts, KB articles, macros, staffing plan
* **App Owners / Product Teams:** replacement readiness, migration guides
* **Legal / Compliance / Procurement:** licensing, policy language, vendor terms
* **HR / People Ops (optional):** if policy updates or training requirements

### RACI (quick)

* **Program decisions (remove/replace/upgrade):** Program Owner (A), Security (R), App Owners (C), Legal/Procurement (C)
* **Messaging and cadence:** Comms Lead (R), Program Owner (A), Sponsor (C), HR/Legal (C)
* **Enforcement actions (block/uninstall):** Endpoint Engineering (R), Program Owner (A), Security (C)
* **Support readiness:** Service Desk Lead (A/R), App Owners (C)

---

## 4) Segmenting strategy: “Cohorts” based on install base

You asked to explicitly account for number of users. Use a tier model to drive comm intensity.

### Install-base tiers (adjust thresholds as you like)

* **Tier 1 – Long tail:** 1–25 users
* **Tier 2 – Small:** 26–250 users
* **Tier 3 – Medium:** 251–2,500 users
* **Tier 4 – Large:** 2,501–10,000 users
* **Tier 5 – Enterprise-wide:** 10,001+ users

### Why this matters

* Tier 1–2: you can do **direct outreach** and solve edge cases quickly.
* Tier 4–5: you must do **multi-channel, staged communications**, manager cascades, training, and heavier support readiness.

---

## 5) Technical disposition categories (what IT will do)

You’ll likely have more dispositions than the examples. Treat this as an extensible catalog.

### Core disposition types (recommended)

1. **Upgrade / migrate to supported version** (e.g., v1 → v3)
2. **Replace with supported/standard app** (Tool A → Tool B)
3. **Remove / uninstall** (no longer permitted; no equivalent needed)
4. **Block execution / quarantine** (immediate or phased, often security-driven)
5. **Allow with remediation** (e.g., license purchase, configuration hardening, add to software center)
6. **Requires resubmittal with business case** (to become approved/managed)
7. **Grandfather temporarily (time-bound exception)** (sunset plan)
8. **Investigate / validate usage** (unknown ownership; needs discovery before action)

Each disposition should map to:

* A **user story** (“what this means for me”)
* A **timeline**
* **What employees must do**
* The **support model**
* The **exception path**

---

## 6) “Reason” categories (why IT is taking action)

Also extensible, but keep the public-facing set small and understandable.

### Recommended reason tags (public-facing)

* **Security risk reduction** (malware exposure, unpatched software, admin elevation risk)
* **Compliance / regulatory** (audit findings, data handling requirements)
* **Data privacy** (unknown data sharing, unsanctioned cloud sync)
* **Cost & licensing** (duplicate tools, unlicensed installs, contract consolidation)
* **Supportability & reliability** (crashes, incompatibility, vendor EOL)
* **Standardization & productivity** (reduce fragmentation; improve collaboration)

**Tip:** In employee messaging, lead with the top 1–2 reasons. Don’t list 6 reasons in every email.

---

## 7) Communication intensity model (ties user count + disposition + reason)

Define **4 levels of communication intensity**. This gives you a simple rule system.

### Intensity levels

* **Level 0 – Silent / auto-remediation:** No user action; minimal impact (e.g., auto-upgrade).
  *Channels:* release notes + portal status.
* **Level 1 – Targeted notice:** Some user impact; limited population.
  *Channels:* targeted email + portal entry + service desk KB.
* **Level 2 – Coordinated change campaign:** noticeable impact and/or larger population.
  *Channels:* targeted email + Teams posts + manager toolkit + office hours + in-product/endpoint notifications.
* **Level 3 – Enterprise campaign / high risk:** broad impact, major replacement, or security-critical.
  *Channels:* exec sponsor note + intranet story + town hall segment + recurring reminders + endpoint popups + expanded support coverage.

### Suggested default mapping

| Install-base tier     | Upgrade/Migrate | Replace | Remove | Block/Quarantine (Security) | Business case resubmittal |
| --------------------- | --------------: | ------: | -----: | --------------------------: | ------------------------: |
| Tier 1 (1–25)         |              L1 |      L1 |     L1 |   L2–L3 (depending urgency) |                        L1 |
| Tier 2 (26–250)       |              L1 |      L2 |     L2 |                          L3 |                        L2 |
| Tier 3 (251–2,500)    |              L2 |      L2 |     L2 |                          L3 |                        L2 |
| Tier 4 (2,501–10,000) |              L2 |      L3 |     L3 |                          L3 |                        L3 |
| Tier 5 (10,001+)      |              L3 |      L3 |     L3 |                          L3 |                        L3 |

---

## 8) Program phases and timeline (run as waves)

Run this as a **wave-based change program** rather than one giant push.

### Phase 0 — Preparation (2–6 weeks)

**Outcomes:**

* Validate scan data quality; confirm app identity and versions
* Assign disposition + reason tag for each app
* Confirm replacements are ready (packaged, licensed, trained, documented)
* Build your **single source of truth** (portal page)
* Train service desk; prepare KBs, scripts, macros
* Define exception process and SLAs

**Key deliverables:**

* App Remediation Portal (status + deadlines + actions + alternatives)
* FAQ + policy summary (what “unauthorized” means, what’s allowed)
* Manager toolkit template
* Standard email templates per disposition
* Support readiness plan (staffing, categories, escalation paths)

### Phase 1 — Enterprise Awareness (Week 0)

One broad message that sets expectations, not a giant list of apps.

**Message goals:**

* Explain the initiative, why it’s happening, and what employees can expect
* Reinforce: “we will provide alternatives and support”
* Point to portal + exception process

**Sender:** CIO/CSO jointly (or CIO with CSO endorsement)

### Phase 2 — Targeted app-specific communications (Weeks 1–N)

This is where you segment by install base and disposition.

**Tactics:**

* Targeted emails to impacted users (distribution based on endpoint data)
* Manager cascade for affected teams (especially Tier 3+)
* Teams posts in relevant channels (IT announcements + business unit channels)
* Office hours and short training (especially replacements)

### Phase 3 — Enforcement / remediation execution (per app deadline)

**Tactics:**

* Endpoint prompts (toast notifications), in-product notices if feasible
* “Final reminder” + “Day-of” + “Post-change” communications
* Clear support pathway and exception path

### Phase 4 — Sustainment

* Monthly “what changed” digest
* Metrics reporting to executives and business unit leaders
* Keep the portal updated; deprecate resolved items

---

## 9) Channel strategy for a 25,000+ employee company

Use a **hub-and-spoke** model.

### Hub (single source of truth)

* **Intranet / Service Portal Page:** “Software Changes & Approved Apps”

  * Searchable app list (by name)
  * Status: investigate / upgrade / replace / remove / blocked / exception available
  * Deadlines by wave
  * “What do I need to do?” steps
  * Replacement guides + training links
  * Exception/business case submission button
  * Contact/support links

### Spokes (distribution channels)

* **Targeted email** to impacted users (primary)
* **Teams/Slack** IT announcements + BU channels (secondary)
* **Endpoint notifications** (high effectiveness; use for enforcement timelines)
* **Manager toolkits** (for Tier 3+ or high-impact changes)
* **Town halls / all-hands segment** (Tier 5 or highly visible replacements)
* **Service Desk** (KBs + scripts; ensure consistent answers)
* **Office hours / short webinars** (replacements, migrations)

---

## 10) Cadence by tier (how often to communicate)

This is a practical cadence you can standardize.

### Tier 1 (1–25 users): “Concierge”

* Day -14: direct email + manager CC (optional)
* Day -7: follow-up
* Day -1: reminder
* Day 0: execution notice + support link
* Day +3: check-in

### Tier 2 (26–250): “Targeted campaign lite”

* Day -21: initial notice
* Day -10: reminder
* Day -3: final reminder
* Day 0: execution notice
* Day +7: wrap-up + how to request exception if needed

### Tier 3 (251–2,500): “Standard campaign”

* Day -30: initial notice + portal entry
* Day -14: reminder + office hours schedule (if replace)
* Day -7: reminder + endpoint notification
* Day -1: final reminder
* Day 0: execution notice + support instructions
* Day +7: post-change tips + FAQ refresh

### Tier 4–5 (2,501+): “Enterprise campaign”

* Day -45 to -60: pre-announce + manager heads-up
* Day -30: official notice from IT + portal live
* Weekly: short reminders + progress updates
* Day -14: training push (if replace) + endpoint banners/toasts
* Day -7: final manager toolkit + service desk readiness spike
* Day -1: final reminder (multi-channel)
* Day 0: execution notice + prominent support banner
* Day +7/+14: adoption follow-up + known issues + success metrics

---

## 11) Message framework (consistent structure)

Every app-specific message should include:

1. **What’s changing**
2. **Who is impacted** (and how you know)
3. **When it happens** (date/time, timezone)
4. **What you need to do** (clear action steps)
5. **Why we’re doing it** (1–2 reason tags)
6. **What to use instead / how to get help**
7. **Exception path** (if applicable) + deadlines

Keep the core email body short; link to the portal for details.

---

## 12) Message matrix by disposition (what to say + what assets to provide)

| Disposition               | What employees hear (plain language)                                                                                  | Required assets                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Upgrade/Migrate           | “We’re updating to a supported version for security and reliability. Minimal action required / here’s how to update.” | Upgrade guide, known issues, rollback plan (internal), helpdesk KB             |
| Replace                   | “This tool will be replaced with [Supported App]. Here’s why and how to switch.”                                      | Replacement mapping, migration steps, training, FAQs, comparison chart         |
| Remove                    | “This app will be removed because it’s not approved/supported. Use [alternative] or request an exception.”            | Alternatives list, exception process, uninstall behavior explanation           |
| Block/Quarantine          | “To protect the company, this app will be blocked (or removed). Here’s what to do if you need it for business.”       | Security rationale summary, urgent support path, exception pathway (tight SLA) |
| Allow with remediation    | “This app can stay if it meets requirements (license/config). We will manage it going forward.”                       | Steps, deadline, auto-remediation notes, procurement/licensing steps           |
| Business case resubmittal | “If you still need this app, submit a short business case by X date.”                                                 | Business case form + criteria, decision SLAs, interim guidance                 |

---

## 13) Exception and business-case strategy (critical to adoption)

If you don’t make this simple, people will work around controls.

### Recommended exception types

* **Time-bound exception** (e.g., 30/60/90 days) with owner and sunset plan
* **Permanent approval path** (becomes a managed/approved app after review)
* **Break-glass security exception** (rare, strict controls)

### Suggested business case criteria (simple scoring)

* Business criticality + # users
* Data classification touched
* Vendor risk/security posture (if known)
* Total cost (licenses + support) and duplication with existing tools
* Availability of supported alternative
* Migration effort/time

### Communication rule

Every “remove/block” message should include:

* The **exception link**
* A **deadline**
* A **what happens if you do nothing** statement

---

## 14) Support readiness plan

For Tier 3+ and any replace/remove/block action:

* Create a **Service Desk category**: “Unauthorized App Remediation”
* Add KBs:

  * “Why was this removed?”
  * “How to install the approved alternative”
  * “How to request an exception”
  * “Troubleshooting replacement app”
* Provide **macros/scripts** so support answers are consistent
* Staff **office hours** (especially for replacement/migration)
* Establish **escalation path** to app owners and endpoint engineering

---

## 15) Sample communication artifacts (ready-to-use)

### A) Enterprise awareness email (from CIO/CSO)

**Subject:** Upcoming software standardization and security changes

Hello team,
To improve security, compliance, and supportability, IT is standardizing the applications installed on company devices. We recently completed an inventory scan and identified software that is not currently approved or managed by IT.

Over the coming weeks, you may receive targeted notices if software on your device requires an update, replacement, removal, or review. In most cases, we will provide a supported alternative and clear instructions. If you have a valid business need for a tool, you will have an option to request an exception or submit a business case.

Please visit the Software Changes portal for the latest updates, timelines, and instructions: **[link]**.
Thank you for helping keep our environment secure and reliable.

— [CIO Name], [CSO Name]

### B) Targeted email – Replace disposition (Tier 3+)

**Subject:** Action required: [App Name] will be replaced by [Supported App] by [Date]

You are receiving this message because [App Name] was detected on a company device associated with your account.

**What’s changing**

* [App Name] will be removed/disabled on **[Date]**.
* Please transition to **[Supported App]**.

**Why**
This change is being made for **[Reason tag: Security / Compliance / Cost / Supportability]**.

**What you need to do (by [Date])**

1. Install [Supported App] from [Software Center / Company Portal]
2. Follow the migration steps here: [link]
3. Join an office hour session if you need help: [link]

**Need an exception?**
If you believe you need [App Name] for a business-critical purpose, submit a request by **[Date]**: [link]. Requests are reviewed within [SLA].

Help: [Service Desk link] | FAQ: [link]

### C) Targeted email – Remove disposition (Tier 1–2)

**Subject:** Notice: [App Name] will be removed on [Date]

[App Name] is not an approved application and will be removed on **[Date]** to reduce risk and improve supportability.

If you still need this functionality, please use **[Alternative]**: [link]
If you believe you require [App Name], request an exception by **[Date]**: [link]

### D) “Day-of enforcement” message (endpoint toast + email snippet)

**Headline:** [App Name] is now blocked/removed
If you need an exception for business reasons, submit here: [link]. For support, contact: [link].

---

## 16) Communications calendar template (example for one wave)

Use this as a repeatable structure per wave.

**Wave duration:** 6 weeks (typical Tier 3–5 replace/remove)

* **Week -2 to -1:** Manager pre-brief (only impacted orgs), service desk readiness, portal updates
* **Week 0:** Targeted notices to impacted users + Teams post + portal live
* **Week 1:** Office hours (if replace), reminder
* **Week 2:** Reminder + endpoint notifications begin (Tier 4–5)
* **Week 3:** Final reminder + manager toolkit resend
* **Week 4:** Enforcement (remove/block) + day-of communications
* **Week 5:** Post-change tips + metrics snapshot + “how to request exception” final window
* **Week 6:** Wrap-up and lessons learned (internal)

For **critical security blocks**, run an emergency cadence:

* Same day: exec security alert + endpoint block notice + exception process (tight SLA)
* 24–72 hours: follow-ups, office hours, postmortem FAQ update

---

## 17) What to do next

If you want to operationalize this quickly, do these in order:

1. **Define your cohorting spreadsheet** for each app:
   App name | install count | tier | disposition | reason tag(s) | replacement | deadline | comm level | owner | wave
2. Stand up the **Software Changes portal** as your hub.
3. Build **3–5 reusable templates** (awareness, upgrade, replace, remove, business case).
4. Align with endpoint engineering on **what will actually happen** (uninstall vs block vs restrict) so communications match reality.
5. Run a **pilot wave** (10–20 apps across a few dispositions and tiers), measure support impact, refine cadence.
6. Scale by waves with consistent reporting.
