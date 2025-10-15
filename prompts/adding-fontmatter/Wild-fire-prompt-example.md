---
title: "Wild-fire-prompt-example"
tags:
  - goal-setting
  - okr
  - prompt
  - risk-assessment
keywords:
  - goal setting
  - okr
  - risk assessment
---
# **A good example (wildfire risk):**

## Narrative.

Create an end‑to‑end Wildfire Ignition Risk & PSPS Decision‑Support system for a Southern California investor‑owned utility operating in High Fire Threat District (HFTD) Tiers 2–3. The objective is to reduce equipment‑caused ignitions by 25% year over year while cutting Public Safety Power Shutoff (PSPS) customer‑minutes by 15%, without compromising safety or regulatory compliance.

The system’s scope covers all overhead distribution and sub‑transmission segments in HFTD Tiers 2–3 and their adjacent buffer zones. During Red Flag or Santa Ana conditions, it updates every 15 minutes; otherwise, it refreshes hourly. It supports three decision horizons: day‑ahead planning for the next 24–72 hours, near‑real‑time operations over the next 0–6 hours, and post‑event analysis after conditions normalize.

It ingests and time‑aligns multiple input domains. Weather data include wind gusts, sustained wind, relative humidity, temperature, precipitation, lightning, and stability indices. Fuels and terrain inputs cover live and dead fuel moisture proxies such as ERC and NDVI, slope and aspect, and historical burn perimeters. Grid‑asset data include conductor type (bare or covered), span information, protection devices such as reclosers and fuses, asset age and condition, inspection findings from UAS/IR/LiDAR, and recent work orders. Operations signals incorporate fault and momentary counts, load, switching states, prior PSPS footprints, and patrol outcomes. Vegetation data track clearance distances, overhangs, growth‑rate models, and any unresolved defects. Community and critical‑infrastructure context layers identify medical baseline customers, hospitals, water and wireless infrastructure, and access/egress constraints.

Each line segment receives a 0–100 risk score governed by an initial rubric to be tuned. A forecast wind gust exceeding 55 mph adds 25 points, while 45–55 mph adds 15. Relative humidity below 12% adds 15 points; 12–20% adds 10. If the Energy Release Component (ERC) is above the 90th seasonal percentile, 15 points are added; between the 80th and 90th percentiles, 10 are added. HFTD Tier 3 contributes 15 points and Tier 2 contributes 8. Any unresolved vegetation defect in the last 90 days adds 20 points. More than five momentaries in the past 30 days, or a recent ground fault, adds 10 points. A five‑year historical ignition density within one kilometer adds 10 points. Asset hardening—such as covered conductor or fast‑curve protection—reduces the score by 10 points, and wetting rain greater than 0.25 inches in the past 24 hours also reduces the score by 10.

Automated actions are tied to score thresholds, always with a human‑in‑the‑loop override. At scores of 85 or higher (Extreme), reclosing is disabled; the event is escalated to the Emergency Operations Center; patrols are initiated; and the system prepares a PSPS decision package that includes alternatives such as sectionalizing, mobile generation, and microgrids, while triggering a regulator‑compliant notifications workflow and sending a Slack or Teams alert to the Duty Officer and Communications. At 70–84 (Very High), the system applies sensitive protection settings, pre‑stages crews, schedules drone/IR patrols within 24 hours, issues customer advisories without promises, and generates contingency plans in the Outage and Advanced Distribution Management Systems (OMS/ADMS). At 55–69 (High), it schedules “quick‑hit” vegetation abatement within 72 hours, targets asset inspections, and reviews device coordination. At 40–54 (Elevated), it adds the segment to a rolling 30‑day work queue for vegetation and hardware and runs hardening simulations for the next capital‑planning cycle. Below 40 (Baseline), it monitors only.

For executive and operator decisions, the system auto‑generates a package that maps the top‑N risk segments and explains the drivers—for example, wind and fuels may account for 62 points of a segment’s score. It quantifies trade‑offs between expected ignition‑risk reduction and PSPS customer‑minutes, including exposure of critical loads. It ranks mitigation options, including sectionalizing plans, temporary reconfiguration, mobile generation, community resource centers, and the associated communications plan.

The platform integrates with Geographic Information Systems (e.g., Esri) for network topology; ADMS/OMS/SCADA for switching and telemetry; Enterprise Asset Management (e.g., SAP or Maximo) for work orders; Customer/Communications systems (e.g., Everbridge or Twilio) for notifications; and a Data Lake and Feature Store for model features. Identity and access are aligned to NERC‑CIP controls.

Reporting and performance management focus on safety, reliability, model quality, operations, and financial outcomes. Safety metrics include equipment‑caused ignitions, acres impacted, and near‑misses. Reliability metrics include PSPS customer‑minutes of interruption (CMI) and SAIDI/SAIFI segmented by HFTD versus non‑HFTD. Model metrics include precision and recall for top‑decile risk segments, lead‑time accuracy, and false‑positive rate. Operations metrics include patrol SLA adherence, time‑to‑decision, and crew utilization. Financial metrics include cost per avoided ignition and proxies for claim or litigation avoidance.

The system is designed with clear guardrails. It complies with CPUC requirements for wildfire, PSPS, and Wildfire Mitigation Plan reporting as well as customer‑contact obligations. Accessibility is built in so that Access and Functional Needs (AFN) populations receive redundant communication paths. Security and privacy controls enforce NERC‑CIP segmentation, exclude PII from field tools, and maintain audit logs for all automated decisions. A human override is required for any de‑energization, and every PSPS action must document the alternatives that were considered.

Acceptance criteria are explicit. Backtests over five or more years must show that at least 80% of historical equipment ignitions occurred in hours or segments that the system scored at 70 or higher. A live pilot spanning one fire season must demonstrate a 20% or greater ignition reduction in HFTD Tier 3 circuits versus matched controls and at least a 10% reduction in PSPS CMI with equal or better safety outcomes. Operators must rate the clarity and actionability of decision packages at 4 out of 5 or higher, and regulator reporting should be generated without manual rework.
The scoring, actions, and integrations can be tailored to a specific technology stack—for example, Esri with GE or Schneider ADMS and SAP or Maximo for asset management—and delivered as a concise, one‑page prompt specification suitable for direct handoff to a data and operations team.

## Prompt Driven

**Create an end‑to‑end Wildfire Ignition Risk & PSPS Decision‑Support system** for a Southern California investor‑owned utility operating in High Fire Threat District (HFTD) Tiers 2–3. The goal is to **reduce equipment‑caused ignitions by 25% year‑over‑year while cutting PSPS customer‑minutes by 15%**, without violating safety or regulatory requirements.

### **Scope & cadence**

* Coverage: all overhead distribution and sub‑transmission segments in HFTD Tiers 2–3, plus adjacent buffer zones.
* Update frequency: **every 15 minutes** during Red Flag/Santa Ana conditions; hourly otherwise.
* Decision horizons: **Day‑ahead (24–72h)** planning, **near‑real‑time (0–6h)** operations, and **post‑event** analysis.

### **Inputs (ingested and timestamp‑aligned)**

* **Weather**: wind gusts, sustained wind, RH, temperature, precipitation, lightning, stability indices.
* **Fuels/terrain**: live/dead fuel moisture proxies (e.g., ERC/NDVI), slope/aspect, historical burn perimeters.
* **Grid assets**: conductor type (bare/covered), spans, protection devices (reclosers, fuses), age/condition, inspection findings (UAS/IR/LiDAR), recent work orders.
* **Operations signals**: fault/momentary counts, load, switching states, prior PSPS footprints, patrol outcomes.
* **Vegetation**: clearance distances, overhangs, growth rate models, unresolved defects.
* **Community/criticality**: medical baseline customers, hospitals, water/wireless infrastructure, access/egress constraints.

### **Risk scoring (per line segment, 0–100) – initial rubric to be tuned**

* Forecast **wind gust > 55 mph**: **+25**; 45–55 mph: **+15**
* **RH < 12%**: **+15**; 12–20%: **+10**
* Fuels: **ERC > 90th percentile** seasonal: **+15**; 80–90th: **+10**
* HFTD Tier: **Tier 3 +15**; **Tier 2 +8**
* Unresolved vegetation defect (last 90 days): **+20**
* **>5 momentaries** past 30 days or recent ground fault: **+10**
* **Historical ignition density** (5‑yr, within 1 km): **+10**
* Asset hardening (covered conductor, fast‑curve protection) present: **−10**
* Wetting rain > 0.25" in past 24h: **−10**

### **Automated actions by threshold (with human‑in‑the‑loop override)**

* **≥85 (Extreme):** Disable reclosing; escalate to EOC; initiate patrols; **prepare PSPS decision package** with alternatives (sectionalizing, mobile gen, microgrids); trigger regulator‑compliant notifications workflow; **Slack/Teams alert** to Duty Officer & Comms.
* **70–84 (Very High):** Sensitive protection settings; pre‑stage crews; drone/IR patrol within **24 hours**; customer advisory (no‑promise comms); **OMS/ADMS** contingency plans generated.
* **55–69 (High):** Schedule “quick‑hit” vegetation abatement **within 72 hours**; targeted asset inspection; review device coordination.
* **40–54 (Elevated):** Add to rolling 30‑day work queue (veg & hardware); simulate hardening scenarios for next capital plan cycle.
* **<40 (Baseline):** Monitor only.

### **Decision package contents (auto‑generated for operators/executives)**

* Map of top‑N segments by risk with **explainable factors** (e.g., wind + fuels contributed 62 points).
* Impact trade‑offs: expected ignition risk reduction vs. **customer‑minutes** and critical‑load exposure.
* Mitigation options ranked: sectionalizing plans, temp reconfiguration, mobile generation, community resource centers, comms plan.

### **Systems & integrations**

* **GIS** (e.g., Esri) for segment topology; **ADMS/OMS/SCADA** for switching & telemetry; **EAM** (e.g., SAP/Maximo) for work orders; **CIS/Comms** (e.g., Everbridge/Twilio) for notifications; **Data Lake/Feature Store** for model features; **Identity** aligned to NERC‑CIP controls.

### **KPIs & reporting**

* Safety: **equipment‑caused ignitions**, acres impacted, near‑misses.
* Reliability: **PSPS CMI**, SAIDI/SAIFI (HFTD vs non‑HFTD).
* Model: precision/recall for top‑decile risk segments, lead‑time accuracy, false‑positive rate.
* Operations: patrol SLA adherence, time‑to‑decision, crew utilization.
* Financial: **cost per avoided ignition**, claim/litigation avoidance proxies.

### **Constraints & guardrails**

* Comply with CPUC wildfire/PSPS/WMP reporting and customer‑contact requirements.
* Accessibility: AFN populations get redundant comms paths.
* Security & privacy: NERC‑CIP segmentation; no PII in field tools; audit logs for all automated decisions.
* **Human override** required for any de‑energization; every PSPS must include a documented alternatives review.

### **Acceptance criteria**

* Backtests on 5+ years show **≥80% of historical equipment ignitions** occurred in hours/segments the system scored **≥70**.
* Live pilot over one fire season demonstrates **≥20% ignition reduction** in HFTD Tier 3 circuits vs. matched controls and **≥10% PSPS CMI reduction** with equal or better safety outcomes.
* Operators rate decision packages **≥4/5** for clarity and actionability; regulator reporting generated **without manual rework**.

---

## Prompt Spec A — *Esri ArcGIS + GE ADMS (GE Vernova) + SAP EAM + Everbridge + Lakehouse (e.g., Databricks on ADLS/S3)* - Use a different Prompt Spec for a different Technology package

### 0) Objective

Create an end‑to‑end **Wildfire Ignition Risk & PSPS Decision‑Support system** that reduces **equipment‑caused ignitions by 25% YoY** and **PSPS customer‑minutes by 15%**, while maintaining CPUC compliance and operator authority. Coverage: HFTD Tiers 2–3 + 1‑mile buffer. Cadence: **15‑min** during Red Flag/Santa Ana; hourly otherwise. Horizons: **Day‑ahead (24–72h)**, **near‑real‑time (0–6h)**, **post‑event**.

### 1) Inputs & Feature Catalog (ingest + time‑align)

* **Weather** (grid at 1–3 km): sustained/gust wind, RH, temp, precip, lightning, stability indices; 0–6 h nowcast + day‑ahead forecast.
* **Fuels & Terrain**: ERC percentile, live/dead fuel moisture proxies (NDVI/EVI), slope/aspect, recent burn perimeters.
* **Esri/GIS**: line sections (GlobalID, CircuitId, SectionId), HFTD Tier, span attributes, device locations (reclosers, fuses, switches), covered vs bare conductor, patrol zones, communities/AFN.
* **GE ADMS/OMS/SCADA**: momentary counts (last 30/90 days) by device/section/feeder, ground‑fault events (last 30 days), switching states, protection mode profiles, prior PSPS footprints.
* **SAP EAM**: asset condition (inspection findings incl. UAS/IR/LiDAR), unresolved vegetation defects, work orders (open/closed), asset age/material.
* **Historical ignitions**: point density (5‑yr, 1‑km kernel).
* **Rain index**: wetting rain in last 24h.

> **Join keys & crosswalk**
>
> * `Esri.SectionId` ↔ `ADMS.LineSectionId` (maintain a **section\_id\_xwalk** table).
> * `Esri.DeviceGUID` ↔ `ADMS.DeviceId`.
> * `SAP.AssetId` ↔ `Esri.AssetId` (maintain **asset\_id\_xwalk**).
>   All features must resolve to a **canonical `section_id`**.

### 2) Risk Scoring (per `section_id`, 0–100) — initial weights

* **Wind gust > 55 mph**: **+25**; 45–55 mph: **+15**
* **RH < 12%**: **+15**; 12–20%: **+10**
* **Fuels (ERC percentile)**: >90th **+15**; 80–90th **+10**
* **HFTD Tier**: Tier 3 **+15**; Tier 2 **+8**
* **Unresolved vegetation defect (past 90d)**: **+20**
* **Ops stress**: `momentaries_30d > 5` **or** `recent_ground_fault = true`: **+10**
* **Historical ignition density (5‑yr within 1 km)**: **+10**
* **Asset hardening present** (covered conductor **or** fast‑curve protection profile bound to section): **−10**
* **Wetting rain ≥ 0.25" in 24h**: **−10**

**Explainability**: store top contributors with SHAP‑like attributions: `{"wind": +22, "fuels": +12, "veg_defect": +20, ...}`.

**Config example (`risk_config.json`)**

```json
{
  "cadence_minutes": 15,
  "thresholds": {"extreme": 85, "very_high": 70, "high": 55, "elevated": 40},
  "weights": {
    "wind_gust": {"gt_55": 25, "45_to_55": 15},
    "rh": {"lt_12": 15, "12_to_20": 10},
    "erc_pct": {"gt_90": 15, "80_to_90": 10},
    "hftd": {"tier3": 15, "tier2": 8},
    "veg_defect_90d": 20,
    "ops_stress": 10,
    "ignition_density": 10,
    "asset_hardening": -10,
    "wetting_rain_24h": -10
  }
}
```

### 3) Actions by Threshold (human‑in‑the‑loop override required)

**Extreme (≥85)**

1. **GE ADMS**:

   * Apply **Fire‑Safety Protection Profile** on affected reclosers/sections (disable reclosing / set instantaneous/fast trip as per profile).
   * Generate **Switching Plan** template for PSPS alternative (sectionalize, back‑tie options).
2. **Operations**: EOC escalation; initiate targeted ground/UAS patrols.
3. **Comms**: Create Everbridge advisory template (no promise), pre‑stage PSPS notice.
4. **Decision Package** auto‑generated for Duty Officer (see §6).

**Very High (70–84)**

* **GE ADMS**: enable **Sensitive Settings** (fast‑curve), pre‑arm recloser lockout on specified devices.
* **Patrols**: schedule drone/IR within **24h**; pre‑stage crews at staging depots.
* **OMS**: generate contingency scenarios; customer advisory via Everbridge (FYI only).

**High (55–69)**

* **SAP**: create “quick‑hit” WO for veg abatement within **72h**; targeted asset inspection WOs.
* **Protection**: review device coordination for impacted sections.

**Elevated (40–54)**

* Add to **30‑day** veg/hardware queue in SAP; run hardening simulation (covered conductor, FDO profiles) for next capital cycle.

**Baseline (<40)**

* Monitor only.

### 4) Integrations & Contracts

**Esri**

* **Read**: Feature Services for line sections/devices, HFTD, AFN.
* **Write**: `RiskSegments` Feature Layer with fields:

  * `section_id` (string, key), `score` (int), `band` (string), `window_start`, `window_end`, `top_factors` (JSON), `actions_suggested` (JSON), `last_updated`.
* Map service in Portal for situational awareness (operator filter: `band in ('EXTREME','VERY_HIGH')`).

**GE ADMS**

* **Input**: `risk-events` topic (Kafka/AMQP) with payload:

```json
{
  "section_id": "SEC-12345",
  "score": 87,
  "band": "EXTREME",
  "devices": ["RC-7781","RC-7782"],
  "recommended_profile": "FIRE_SAFETY",
  "expires_at": "2025-09-08T18:15:00Z"
}
```

* **Output** (ack/action): `adms-actions` topic:

```json
{
  "section_id": "SEC-12345",
  "action_id": "ACT-9001",
  "actions_applied": [
    {"device_id":"RC-7781","setting":"RECL_CYCLES","value":0},
    {"device_id":"RC-7782","profile":"FIRE_SAFETY"}
  ],
  "requested_by":"DutyOfficer",
  "timestamp":"2025-09-08T17:58:10Z"
}
```

* **Switching Plan** API: generate plan with isolation points & back‑ties; return `plan_id` for operator review/approval.

**SAP EAM**

* **Create WO** on thresholds (`HIGH`/`ELEVATED`):

  * Type: VEGETATION / INSPECTION, Priority: High/Normal, Location: `section_id`, GIS link to Esri.
* **Sync**: backwrite WO IDs into `RiskSegments` attributes for traceability.

**Everbridge**

* **Templates**:

  * `Wildfire Advisory (No Promise)`, `PSPS Watch`, `PSPS Warning`, multilingual + AFN variants.
* **Trigger**: from Decision Package with geofenced audience from Esri polygon; record notification IDs.

**Lakehouse**

* **Tables**: `features_section_hourly`, `risk_scores_15min`, `risk_events`, `actions_audit`, `work_orders`, `notifications`.
* **Model registry/feature store**: versioned features & models; retain attributions.

### 5) Governance, Security, Guardrails

* **NERC‑CIP**: segment compute and ADMS interfaces; enforce RBAC, MFA, audit logs for all command suggestions and applied actions.
* **CPUC/PSPS**: enforce notice windows, reporting schemas, AFN redundancy.
* **PII**: exclude from field tools; comms use hashed customer IDs joined only within CIS boundary.

### 6) Decision Package (auto‑generated)

* Top N sections (map + list), score/band, **explainable factors** with percentages.
* Alternatives matrix: ignition‑risk reduction vs **customer‑minutes** and critical load exposure.
* Proposed actions with **expected effect** (e.g., fast‑curve reduces fault energy X%).
* Comms checklist and Everbridge template drafts.
* Attach `Switching Plan` IDs and SAP WO IDs where applicable.

### 7) KPIs & Acceptance Tests

* **Backtest** (≥5 yrs): ≥80% of historical equipment‑caused ignitions fall in hours/sections scored **≥70**.
* **Pilot** (one fire season): ≥20% ignition reduction (Tier 3 circuits) vs matched controls; ≥10% PSPS CMI reduction with equal/better safety.
* **Ops UX**: operators rate packages **≥4/5**; regulator reports generated **without manual rework**.
* **Traceability**: 100% of automated suggestions have audit trail from features → score → action → outcome.

---

## Prompt Spec B — *Esri ArcGIS + Schneider Electric EcoStruxure ADMS + IBM Maximo + Twilio + Snowflake* - Use a Different Prompt Spec for a different Technology Platform.

### 0) Objective

Deploy the same decision‑support outcomes as Spec A, tuned to **EcoStruxure ADMS** operations, **Maximo** work management, **Twilio** communications, and **Snowflake** analytics. Cadence, coverage, and horizons identical.

### 1) Inputs & Feature Catalog

* **Weather / Fuels / Terrain**: as in Spec A.
* **Esri/GIS**: identical structure; ensure **GlobalID** present for all line sections.
* **EcoStruxure ADMS**: LineSection persistent IDs (LSID), device inventory (reclosers/switches/fuses), **Protection Modes** library (Normal/Sensitive/Fire), feeder topology, OMS events, SCADA alarms.
* **Maximo**: assets (`ASSETNUM`), locations (`LOCATION`), inspection results (`INSPECTRESULT`), open vegetation defects, WOs (`WOTRACK`).
* **Historical ignitions** and **rain index**: as in Spec A.

> **Join keys & crosswalk**
>
> * `Esri.SectionId` ↔ `ADMS.LSID` (maintain **section\_id\_xwalk**).
> * `Esri.DeviceGUID` ↔ `ADMS.DeviceId`.
> * `Maximo.ASSETNUM` ↔ `Esri.AssetId`.
>   Canonical `section_id` = `ADMS.LSID`.

### 2) Risk Scoring (per `section_id`, 0–100)

Use the same base weights, with two Schneider‑specific tunings:

* **Protection Mode = Fire** already active on the section: additional **−5** (to avoid duplicate recommendations).
* **Fault Passage Indicator (FPI) alarms** last 7 days on the section: **+5** (proxy for intermittent contact risks).

Updated deltas (apply on top of base):

* `protection_mode_fire_active`: **−5**
* `fpi_alarm_7d`: **+5**

### 3) Actions by Threshold (human‑in‑the‑loop)

**Extreme (≥85)**

1. **EcoStruxure ADMS**:

   * Set **Protection Mode = Fire** for impacted sections; where supported, **Disable Reclosing** on named devices (`Operate Device` API).
   * Generate **Network Reconfiguration Study** with PSPS alternatives (sectionalize/back‑feed).
2. **Patrols**: immediate ground/UAS patrol tasking.
3. **Twilio**: prepare bilingual SMS/voice/IVR PSPS templates (no promise advisory + watch).
4. Decision Package for Duty Officer.

**Very High (70–84)**

* **EcoStruxure ADMS**: set **Sensitive Mode** (fast trip) on sections.
* **Crew Staging**: pre‑position resources; **UAS/IR within 24h**.
* **OMS**: run contingency; send Twilio advisory (FYI).

**High (55–69)**

* **Maximo**: auto‑create “quick‑hit” veg WOs (72h SLA) and targeted inspection WOs.
* **Protection Review**: confirm device coordination for the affected sections.

**Elevated (40–54)**

* **Maximo**: add to 30‑day veg/hardware plan; flag sections for capital hardening analysis.

**Baseline (<40)**

* Monitor only.

### 4) Integrations & Contracts

**Esri**

* Same `RiskSegments` feature layer and fields as Spec A.
* Provide **WebMap item** for ADMS/OMS operators with filter chips by `band`.

**EcoStruxure ADMS**

* **Input**: `risk-events` topic (Kafka/AMQP) — payload aligns to Spec A but includes **LSID**:

```json
{
  "section_id": "LSID-90210",
  "score": 91,
  "band": "EXTREME",
  "devices": ["RC-2201","RC-2203"],
  "recommended_mode": "FIRE",
  "expires_at": "2025-09-08T18:15:00Z"
}
```

* **Operate Device API** (logical example):

  * `POST /adms/device/{deviceId}/mode` → `{ "mode": "FIRE", "recloseEnabled": false }`
* **Study/Plan API**: `POST /adms/study/reconfigure` with candidate isolation/back‑tie points; returns `study_id` for operator review.

**Maximo**

* **Create WO** (via REST/Integration Framework):

```json
{
  "wonum": null,
  "worktype": "VEG-QUICK",
  "priority": 2,
  "location": "LSID-90210",
  "description": "Quick-hit veg abatement due to Very High risk",
  "targetfinish": "2025-09-11T23:59:00Z",
  "longdescription": "Drivers: wind, RH, ERC; see Esri RiskSegments for map.",
  "esri_section_id": "LSID-90210"
}
```

* Backwrite `wonum` to `RiskSegments`.

**Twilio**

* **Templates**: `wildfire_advisory`, `psps_watch`, `psps_warning` with localization (`en`, `es`) and AFN routing.
* **Trigger**: from Decision Package with Esri geofence; capture `sid`/status for audit.

**Snowflake**

* **Schemas**: `RAW`, `FEATURES`, `RISK`, `OPS`.
* **Tables**: `FEATURES.SECTION_15MIN`, `RISK.SCORES_15MIN`, `RISK.EVENTS`, `OPS.ACTIONS_AUDIT`, `OPS.WO`, `OPS.NOTIFICATIONS`.
* **Streams/Tasks** for incremental scoring & audit rollups.

### 5) Governance, Security, Guardrails

* Same as Spec A; ensure ADMS operations require **two‑person approval** for any PSPS‑related action; all writes are **append‑only** with immutable logs.

### 6) Decision Package

* Same structure as Spec A, with ADMS study IDs and Maximo WO references. Twilio campaign drafts attached.

### 7) KPIs & Acceptance Tests

* Same targets as Spec A; add **FPI alarm correlation** precision/recall for Schneider telemetry.

## Common Implementation Details (both stacks)

### A) Run Logic

* **Scheduler**: run scoring every **15 min** during Red Flag/Santa Ana; else hourly.
* **Windows**: produce `near_real_time` (0–6h) and `day_ahead` (24–72h) scores; label outputs with `window_start/end`.
* **Idempotency**: key by `(section_id, window_start, window_end)`; re‑runs update same row/version.
* **Explainability**: persist driver attributions; surface top 3 in UIs.

### B) Operator UX

* Single **Esri Web App** showing sections color‑ramped by band; click reveals score, drivers, suggested actions, linked WOs/Plans/Comms.
* **One‑click** to open ADMS plan, Maximo WO, and Comms campaign draft.

### C) Error Handling & Data Quality

* If critical inputs missing (e.g., wind or RH), **degrade gracefully**: label scores `DEGRADED`, suppress auto‑suggested actions above `HIGH`.
* Emit `dq_alerts` topic when inputs stale > 1 hour.

### D) Observability

* Metrics: pipeline latency, percent sections scored on time, feature freshness, action acceptance rate, PSPS CMI, ignition proxy outcomes, operator overrides.
* Dashboards by band, feeder, and HFTD tier.

### E) Deployment & Security

* Network segmentation per NERC‑CIP; outbound‑only from ADMS zone via broker/proxy where required.
* Secrets in vault; signed containers; RBAC tied to enterprise IAM; all command suggestions require authenticated user approval.

## What to Hand the Team (deliverables checklist)

1. `risk_config.json` (weights/thresholds; one per stack).
2. **Data contracts** (Avro/JSON): `risk-events`, `adms-actions`, `dq_alerts`.
3. **Esri**: `RiskSegments` schema + WebMap/WebApp item definitions.
4. **ADMS**: example payloads for Protection Mode and Switching Plan APIs (GE & Schneider variants).
5. **EAM**: SAP/Maximo WO create examples; field mapping tables.
6. **Comms**: Everbridge/Twilio templates with merge fields (geofence polygon, window, band, AFN tags).
7. **Backtest notebook** and **acceptance test script** producing KPI set.
8. **Runbook**: who approves what at each band; rollback steps; audit locations.

### Optional: minimal “single‑page prompt” for a build sprint kickoff

> **Build an end‑to‑end Wildfire Ignition Risk & PSPS Decision‑Support system** with Esri + \[GE ADMS **or** Schneider ADMS] + \[SAP **or** Maximo] + \[Everbridge **or** Twilio] + \[Databricks/ADLS **or** Snowflake]. Score each `section_id` every 15 min (Red Flag) or hourly otherwise, using the exact weights defined in `risk_config.json` above. Publish scores and recommended actions to a `risk-events` topic and to an Esri `RiskSegments` feature layer. When `band ∈ {EXTREME, VERY_HIGH}`, generate ADMS protection mode suggestions (GE: Fire‑Safety profile; Schneider: Protection Mode = Fire), a Switching Plan/Study for sectionalizing alternatives, and a Decision Package summarizing risk drivers and PSPS trade‑offs with geofenced comms drafts. For `HIGH` and `ELEVATED`, create Maximo/SAP work orders per the thresholds. Enforce human‑in‑the‑loop for any ADMS changes and all PSPS. Log every suggestion/action to `actions_audit`. Acceptance: backtest ≥80% recall for historical equipment ignitions at score ≥70; pilot shows ≥20% ignition reduction and ≥10% PSPS CMI reduction; operators rate packages ≥4/5; regulator reporting produces with no manual rework.
