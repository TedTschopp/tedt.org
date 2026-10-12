---
layout: post
title: The Last Maintenance Window
date: 2026-10-11 20:01:30-07:00
description: A cooperative map-drawing game about patching servers, rebuilding IT systems, and keeping essential services running before general intelligence arrives.
excerpt: A cooperative map-drawing game about patching servers, rebuilding IT systems, and keeping essential services running before general intelligence arrives.
categories:
  - Artificial Intelligence
  - Role Playing Games
tags:
  - AI
  - tabletop game
  - cybersecurity
  - enterprise architecture
  - playtest
image: /img/2026-10/The last maintenance window.webp
image-alt: "The Last Maintenance Window game cover: two technicians repair server racks beneath an enormous red network sphere, beside the game’s title."
image-description: "The Last Maintenance Window game cover: two technicians repair server racks beneath an enormous red network sphere, beside the game’s title."
---

# The Last Maintenance Window

**A cooperative map-drawing game about patching servers, rebuilding IT systems, and keeping essential services running before general intelligence arrives.**

**Revised playtest edition · Version 0.2 · October 11, 2026**

You collectively portray the people responsible for an organization’s technology. Over a fictional year, you discover what exists, repair what you can, introduce useful capabilities, and decide how much authority to delegate to AI. Your map records both the infrastructure and the people holding it together.

This is an unofficial, self-contained game inspired by Avery Alder’s [The Quiet Year](https://buriedwithoutceremony.com/the-quiet-year). The setting, event prompts, verification procedures, and Arrival scenarios here are original.

| At a glance | Details |
| --- | --- |
| Players | 2–5. For a first session, try 3–4. |
| Full game | Allow roughly 3–4 hours for setup, play, and the ending; a reflective group may need longer. |
| Short game | Allow roughly 2 hours for setup, play, and the ending. A prepared group may finish in 90 minutes. |
| Optional workshop debrief | Add 15–20 minutes to either version. |
| Technical knowledge | Optional. Ordinary descriptions of needs, actions, and observations are sufficient. |
| Status | A playable draft. Session lengths and incentives still need live playtesting. |
{: .well .table .table-striped}

**Quick navigation:** [Setup](#2-prepare-the-table) · [A week](#4-play-one-week) · [Actions](#5-the-four-actions) · [Short game and facilitation](#7-session-length-and-facilitation) · [Event deck](#8-the-event-deck) · [Arrival](#9-the-arrival) · [Starter scenario](#10-starter-scenario-north-valley-electric) · [Worked examples](#11-worked-examples) · [Table reference](#13-table-reference-and-worksheets)

## 1. The premise

Read aloud:

> At 02:13, the backup console turns green. Nobody has tried restoring the payroll system since the people who built it left.
>
> In another building, a server labeled TEMP has been running for eleven years. A junior engineer has used an AI assistant to understand its oldest program. For the first time, replacing it looks possible.
>
> There is money for some improvements. There are people who care. There are also customers who need tomorrow’s service, managers who promised next month’s launch, and an on-call team that would like one uninterrupted weekend.
>
> Outside the organization, AI systems are becoming capable of longer, more independent work. They can help us find defects and make repairs. They can also give strangers new capabilities and act on permissions we barely remember granting.
>
> By winter, broadly capable general intelligence will become available. We do not know the week, who will control it, or which of our assumptions will survive its arrival.
>
> The next maintenance window opens tonight. What will we do with it?

The Arrival and its timing are fictional premises that give the game its deadline. Your organization tries to preserve essential services while building systems whose behavior people can observe, whose authority they can limit, and whose failures they can recover from.

There is no numerical winner. The story ends by showing what the organization can reasonably depend on, what remains uncertain, and who lives with the consequences.

### Your role as players

Players collectively portray the organization. You do not own a character or department. On different turns you may speak for an operator, a customer, a manager, or someone who disagrees with a decision you previously supported.

When you choose a card option, you help author the year. Choose a situation that brings an interesting unresolved person, service, or dependency into focus. Include opportunities, relief, mistakes, and difficult choices. The weekly action then determines what the organization does with its limited attention.

Help one another make contributions concrete. Technical experience is useful when it helps someone express an idea; it does not give a player authority to reject a contribution because it lacks professional terminology. No one needs to name actual products, commands, or configuration settings.

## 2. Prepare the table

### Supplies and responsibilities

You need a large sheet of paper or shared whiteboard, pens, a standard 52-card deck without jokers, three six-sided dice, about twenty tokens, and index cards or sticky notes. If you run out of concern tokens, use labeled marks or slips of paper.

One person teaches the rules and watches the time. Choose a first **steward**, then rotate that role clockwise each week. Another player can record the steward’s decisions and draw the map; rotate this help as useful.

Decide whether to use the full or short calendar. Also choose the Arrival method now: **choose a scenario together for its story interest**, or **roll for an uncertain scenario**. Keep that choice through the session. The six scenarios are in section 9.

For a quick start, use North Valley Electric in section 10. Otherwise create an organization using the steps below.

### Choose the organization and its purpose

Invent its name and purpose. A utility, hospital, university, manufacturer, or municipal service works well.

Choose **exactly three essential services**, describing the human outcome each provides. Keep them visible throughout play.

| Example service | Human outcome |
| --- | --- |
| Field repair coordination | Crews receive usable information and can coordinate their work. |
| Outage communication | Customers can report problems and get meaningful information. |
| Payroll and supplier payments | Employees and suppliers receive the money they are owed. |
{: .well .table .table-striped}

Agree on **one commitment** the organization will try to honor. Examples include preserving emergency communication, maintaining a human route to appeal consequential automated decisions, or giving staff predictable rest. Write it beside the services. You will return to it at phase transitions and at the Arrival.

Establish what the three services ordinarily do today, including any existing degradation. Ordinary operation is a starting fact. Working today does not establish a special recovery, containment, or fallback capability.

### Draw the starting map

Draw **six to ten connected systems or places**. Include aging servers, identity and administrative access, business applications and data, software delivery, backups, an external provider, and somewhere people work or request help. Add any AI tool already in use. One drawing may combine closely related items.

Label relationships so everyone can follow them. Write phrases such as “sends payment records to,” “can administer,” or “needs this to sign in.” A data flow does not automatically grant administrative access.

Connect each essential service to its dependencies. Add at least one unclear relationship and give an old machine a nickname. Each player adds a person or group and something they need.

Use these marks:

| Mark | Meaning |
| --- | --- |
| Box or drawing | An existing system, service, team, vendor, or place. |
| Labeled line or arrow | An established access, data, dependency, or human handoff relationship. |
| `PLANNED` beside a shape or line | A proposed change. It provides no existing capability. |
| Dotted line or `?` | Something important is unknown. State the question. |
| `!` | A specific unresolved exposure, failure, or unmet need. |
| Check mark and evidence number, such as `E1` | A demonstrated claim with a recorded observation and scope. |
| Concern token with a short label | Someone’s unresolved concern, obligation, or burden. |
| Crossed-out shape or line | Something retired or removed. Keep it visible as history. |
{: .well .table .table-striped}

Whenever a card asks you to draw a boundary or system that **would** help, label it `PLANNED`. Starting a project does not implement its promised change. Implementation and evidence are recorded separately.

Existing safeguards at setup may be drawn as facts, with uncertain behavior marked `?`. Do not add evidence numbers merely because a safeguard sounds reassuring. A Verify action can establish a new demonstration during play.

### Name strengths and shortages

Choose **two strengths and two shortages**. Possibilities include experienced operators, spare hardware, money, vendor support, documentation, test environments, maintenance access, executive trust, and rested staff.

These are continuing facts in the story. When work needs something scarce, name a concrete accommodation: narrow the work, borrow help and incur an obligation, or postpone another commitment. Attach the cost to an established person, team, service, or promise.

“We borrow help” is incomplete. “Mara covers dispatch, so her documentation work waits” gives the story something to revisit. Section 6 explains how resources and concerns change.

## 3. Arrange the year

Separate the cards by suit and shuffle each suit independently. Draw through the suits in this order:

| Suit | Phase | Emphasis |
| --- | --- | --- |
| Hearts | Discovery | What exists, who owns it, and who depends on it. |
| Diamonds | Repair | Patching, replacement, simplification, and their consequences. |
| Clubs | Acceleration | Useful AI, faster changes, and expanding delegated authority. |
| Spades | The Threshold | Urgent choices under increasing uncertainty. |
{: .well .table .table-striped}

Each ordinary card represents one week. Keep the **King of Spades shuffled among the spades**. Drawing it triggers the Arrival immediately, before an ordinary event, project progress, or action.

The full calendar contains **39–51 ordinary weeks**, followed by the Arrival draw. The short calendar contains **21–27 ordinary weeks**; prepare it using section 7.

### Between phases

After completing hearts, diamonds, or clubs, pause briefly. Name one thing the organization gained and revisit one existing burden or obligation. Ask whether a strength, shortage, or the initial commitment has changed meaning. Update a label only when established events or actions justify the change.

This reflection grants no project progress, extra action, agreement, repair, or verification. Carry unresolved matters into the next phase. Do not take a phase pause before resolving the King of Spades.

## 4. Play one week

The steward resolves the chosen event and action. Other players may clarify established facts, answer an invitation from the steward, or contribute as the action specifies. Save extended persuasion and negotiation for Council.

Follow this order:

1. **Draw and resolve the event.** If it is the King of Spades, freeze play and go directly to the Arrival. Otherwise read the card’s shared instruction, if any, and choose Option 1 **OR** Option 2. Resolve the chosen situation, then apply the shared instruction once. The unchosen situation does not happen. Update the map.
2. **Progress existing projects.** Consider projects that were RUNNING or BLOCKED before this week’s card was drawn. Each one that is now RUNNING and is not paused loses one week from its die. At zero, remove the die and mark it READY. Update the map with the change implemented in its recorded scope and environment.
3. **Take exactly one action:** Survey, Build, Verify, or Council.
4. **Record the consequences.** Keep new findings, obligations, evidence, and unresolved questions visible. Clear one-week pause marks and pass stewardship clockwise.

A newly started project never progresses in its creation week. An event that clears an existing project’s blocker can allow that project to progress in step 2. A blocker cleared during the later action allows progress from the next week. A project returned to work by Verify also waits until the next week for its first reduction.

**A pause** skips only the specified week’s progress. **A block** lasts until a named missing prerequisite changes. Neither creates extra progress later.

If a shared pause instruction follows an event that already BLOCKED a project that was RUNNING at the draw, that project satisfies the pause instruction. Do not pause a second project just because the affected project is now BLOCKED. Keep its actual prerequisite block until the prerequisite returns.

### What the event can establish

Events establish the facts and consequences requested by the selected prompt. A discovery can supply information without Survey, and an explicit event can change a relationship. Discussing a proposed repair does not implement it. Naming who might agree to an offer does not automatically secure their agreement.

| Part of play | Its authority |
| --- | --- |
| Event | Establish the facts and consequences specifically requested by its chosen prompt. |
| Survey | Investigate an unresolved question selected by the steward, beyond simply answering the event. |
| Build | Start bounded implementation using credible resources and agreements, or cancel one project. |
| Verify | Establish what one declared test target demonstrates. |
| Council | Hear affected perspectives and establish a decision, obligation, or acknowledged disagreement. |
{: .well .table .table-striped}

Only explicit card instructions change mechanics **beyond the normal rules**. Newly established facts can still trigger normal rules: a genuinely missing prerequisite blocks work even if the card does not use the word “block.” A concern token by itself is not such a prerequisite.

Reuse people and systems already on the map when they fit. Add something new when it gives the story a useful connection or contrast. Even a conversational event should leave a short, durable record: a changed relationship, an offer, a promise, an observation, or a question.

### Preserve history and allow change

An event cannot erase an established observation or pretend that a demonstrated result never happened. It can change the circumstances afterward. A new model, altered permissions, a departed colleague, or different demand may put an earlier claim in doubt.

Name what changed, retain the old evidence, and mark the new uncertainty. Preserve any parts of the earlier claim that still apply. If an event truly contradicts the map without introducing a credible change, adapt it to another relevant part of the organization or treat it as a reported warning.

If one option does not fit, choose the other. If neither fits, adapt one to an established part of the organization while preserving its subject. If no credible local version exists, treat it as a report from elsewhere and record the question it raises; that report creates no local capability or failure. Any shared instruction still applies, and a shared effect with no eligible target does nothing. Adaptation cannot grant free implementation or evidence.

## 5. The four actions

### Survey

Investigate **one unresolved question** and establish a specific finding. Choose the question yourself; it need not be the subject of this week’s card.

You might locate a hidden server, identify an owner, trace an access route, discover usable equipment, hear a user’s need, or inspect existing records. Add the finding to the map and distinguish what is known from what remains uncertain.

> The supposedly retired database still supplies the dispatch schedule. The service owner knows the report, but nobody has mapped how it reaches the workroom.

Survey establishes information. It cannot install a control, repair a system, settle an established refusal, or create a new numbered demonstration. Inspecting a record can reveal what it says; conducting a new test of a capability is Verify.

### Build

Use Build to **start one project**, or to **cancel one project**. These are separate uses of the action.

The organization has **three project slots**. RUNNING, BLOCKED, and READY projects each occupy one slot.

#### Start a project

Start in an empty slot. Projects can patch servers, replace applications, change access, prepare a recovery exercise, improve operating practices, establish a fallback, or retire a system.

Record the following before assigning a countdown:

| Field | Example |
| --- | --- |
| Scope | The two externally reachable file-transfer servers. |
| Accountable owner | The application operations team, in the fiction. |
| Intended change | Install the supported update and preserve the daily transfer. |
| Implementation environment | The two live servers during their agreed maintenance window. |
| Human cost and accommodations | Users accept a brief interruption; Mara covers the window and postpones documentation. |
| Prerequisites | The update is available, access is authorized, and the maintenance agreement exists. |
| Acceptance condition and test | Confirm the installed version, complete a representative transfer, and demonstrate the agreed recovery step. |
{: .well .table .table-striped}

The accountable owner is a fictional person or team. Any player may act on any project.

Describe work at the map’s level of detail. “Former staff cannot sign in, and current staff can still complete payroll” is an adequate acceptance condition. Name the observation that would support it; product names and configuration details are unnecessary.

After about one minute of discussion, the steward chooses a duration:

| Scope | Full game | Short game |
| --- | ---: | ---: |
| Small, bounded change | 2 weeks | 1 week |
| Change across a few dependencies or teams | 4 weeks | 2 weeks |
| Difficult rebuild or major operating change | 6 weeks | 3 weeks |
{: .well .table .table-striped}

These are fictional scheduling categories. Split broad promises into bounded projects. “Make the organization secure” is too broad. State whether implementation happens in a trial environment, a limited service, or live operation; that choice constrains later claims.

An undisputed owner or available resource can be named during Build. Build cannot silently settle an established ownership dispute, invent consent previously refused, or remove a known shortage. Resolve an established disputed agreement through Council, or narrow the project so that agreement is unnecessary. Credible prerequisite implementation can be included within the scope, but automatic project progress cannot settle disputed consent.

A project may begin BLOCKED if a necessary external prerequisite is still unavailable. Record its countdown and blocker, but do not reduce the die while it is blocked. Work that can genuinely proceed should be scoped separately if the group wants it to progress.

#### Project states

| State | Meaning |
| --- | --- |
| RUNNING | Implementation or rework can proceed; reduce the countdown during eligible progress steps. |
| BLOCKED | Implementation or rework waits for a named prerequisite; retain its remaining countdown. |
| READY | The intended change has been implemented in the recorded environment; its acceptance claim still needs verification. No countdown remains. |
{: .well .table .table-striped}

When a prerequisite becomes available, return the project to RUNNING. A project does not unblock simply because time passes, a token is removed, or someone promises to investigate.

When implementation reaches zero, update `PLANNED` marks for the work actually completed and mark the project READY. A READY change may already affect live service if its recorded environment is live. It has no demonstrated acceptance claim merely because it exists.

#### Cancel a project

Cancel any one project occupying a slot, including READY work. **Cancellation uses the whole Build action. It does not also start a replacement.**

Free the slot, record why the organization stops pursuing the project, and name what remains stranded. Preserve any changes already established, including a READY implementation, with their uncertainties and consequences. Starting or canceling work grants no additional implementation. Canceling a deployed change does not roll it back; actual removal or repair needs appropriate work.

### Verify

Choose **one declared target**:

- One READY project; or
- One existing capability whose test arrangements already exist, with a written, bounded acceptance condition.

An existing capability does not need a new implementation project merely to be tested. If it needs substantial preparation—new equipment, access, data, procedures, or agreement—arrange that through Build or Council first. Existing operation and existing records alone are not a new demonstration.

Describe the acceptance test being performed in the fiction. The next player clockwise offers one relevant question, limitation, or challenge. Ground it in the map, the stated test, or an observation arising from that test. Testing may reveal a relevant new problem; nobody should invent an unrelated disaster simply to force failure.

The steward resolves the scene, respecting established facts and the written condition. Resolve one outcome:

| Outcome | What happens |
| --- | --- |
| **Pass** | The observation meets the acceptance condition. Record numbered evidence describing the result, scope, and relevant conditions. If the declared target was a READY project, free that one slot. |
| **Gap on a READY project** | Name the missing work and return the project to 2 weeks in the full game, or 1 in the short game. It keeps its slot. If a necessary prerequisite is unavailable, mark it BLOCKED with that countdown. Otherwise mark it RUNNING. |
| **Gap on an existing capability** | Record the finding and affected claim. No project starts automatically. Later Build or Council actions can arrange the needed change, and a later Verify can retest it. |
{: .well .table .table-striped}

One Verify action frees at most the declared project’s slot. Choosing an existing capability does not silently complete other READY projects.

A limitation outside the acceptance condition narrows the evidence note. An unresolved issue necessary to meet the condition prevents a Pass. Recording uncertainty does not also establish the uncertain behavior as demonstrated. If the only supported claim is narrower than the project’s agreed condition, record that partial observation and a Gap; do not quietly rewrite the condition after the test.

If a READY project lacks necessary test arrangements, keep it READY while those arrangements are obtained. Alternatively, use its Verify action to record a **preparation Gap** and return that project to the rework process above. State that the test could not yet run. This permits test preparation within the occupied slot without pretending a test succeeded or forcing a new project slot.

Rework must remain credible in the scope. A newly discovered major dependency may require a separate project; the two-week or one-week rework countdown cannot implement an entire missing platform for free.

Example evidence:

> **E3:** Restored payroll using independent recovery access in the agreed exercise. The observation covers one representative environment and the recorded version; it does not establish recovery under every future condition.

Remove only the exposures the observation resolves. A verified patch can coexist with a shared-credential problem. Keep historical evidence when later conditions change, and mark which claims now require reconsideration.

### Council

Choose one disputed decision, human need, or concern. Each player speaks once for an affected person, for up to thirty seconds. The steward records an agreement, obligation, priority, or acknowledged disagreement.

A Council might secure a maintenance window, assign a willing owner, arrange rest by naming which work waits, decide who may disconnect an agent, accept a degraded service level, or hear from omitted users.

Its guaranteed speaking time matters even when agreement is not reached. A Council can establish a credible agreement, but cannot declare that every person is pleased or erase an unresolved technical exposure.

Record who commits to what, who bears the cost, and any condition of the agreement. A decision can clear an actual organizational blocker. Technical implementation and new demonstrations still require Build and Verify.

## 6. Resources, concerns, and AI assistance

### Keep resources grounded

Strengths and shortages change when events or actions establish a reason. Survey may find usable spare equipment. Council may secure help or access. Implementation may remove a maintenance burden. Verification may demonstrate whether an assumed strength supports its particular claim.

Update the label and retain any attached obligation. An offer of help is not yet accepted help. Saying “we have enough staff now” does not erase established competing commitments.

At phase transitions, revisit at least one existing accommodation. Decide what the established fiction says about it; do not grant a free agreement or repair during the reflection.

### Concerns

When a choice sidelines someone, creates an obligation, or leaves a serious tradeoff unresolved, any player may place a token and a short label beside it. Each player may add at most one concern per ordinary week. If the card requires a concern, reserve the steward’s one concern for that instruction; other players may still place their own.

Examples include “Night shift absorbs the work,” “No accessible fallback,” and “Nobody agreed to own this.” The player who placed a token decides when subsequent events or actions have addressed it. The group may acknowledge an accepted burden without pretending its cost vanished.

Concerns do not create a score, veto decisions, or slow projects by themselves. A concern may motivate Council. An actual established refusal, unavailable resource, or missing prerequisite can block work under the normal rules; placing a token alone cannot establish that fact.

Return to burdens during phase reflections and the Arrival. Accepting a technical exposure does not erase its `!` from the map.

### Let AI help

When starting suitable analysis or implementation work, you may delegate part of it to an AI agent on the map and **reduce the initial duration by one week, to a minimum of one**. Apply this once when the project starts. It does not reduce procurement waits, physical work, needed rest, or a later Verify Gap countdown.

Use an existing appropriately bounded agent, or include its setup in the project’s credible scope. Record:

- The data it may use.
- The actions it may take and the systems those permissions reach.
- Its accountable human owner.
- How access can be revoked.
- Any model, provider, reference source, or shared service it depends on.

Mark proposed access `PLANNED` and untested assumptions `?`. Planned agent setup grants no live authority before implementation. Its expected assistance can be included in the project estimate if setting it up and using it within that project is credible.

AI grants no extra slot or action and never skips Verify. Its dependencies remain on the map for later events. It is also reasonable to keep a task manual, to limit assistance, or to decline a proposed agent.

The same one-week reduction is deliberately used in both calendars:

| Project size | Full game with AI | Short game with AI |
| --- | --- | --- |
| Small | 2 → 1 weeks | 1 → 1 weeks |
| Medium | 4 → 3 weeks | 2 → 1 weeks |
| Large | 6 → 5 weeks | 3 → 2 weeks |
{: .well .table .table-striped}

The short game therefore changes the relative scheduling benefit. Small projects gain no countdown reduction there; medium and large projects gain a larger proportional reduction. The required Build and Verify actions remain. Treat each calendar as a version to playtest in its own right.

## 7. Session length and facilitation

### Prepare the short calendar

For a first session, use the starter scenario and short calendar:

1. Remove six random cards from each of hearts, diamonds, and clubs, leaving seven in each suit.
2. Set the King of Spades aside.
3. Remove six random cards from the other twelve spades.
4. Shuffle the King of Spades with the six retained spades.
5. Use project durations of 1, 2, or 3 weeks. A Verify Gap on a project sets one week of rework.

This gives 21–27 ordinary weeks followed by the Arrival. Keep all remaining rules, including shared card instructions, the three slots, phase reflections, and the immediate stop.

### Budget the session

| Part | Short game planning allowance | Full game planning allowance |
| --- | --- | --- |
| Teaching and setup | 15–20 minutes with the preset | 20–30 minutes |
| Ordinary weeks | 21–27 turns, often 2–3 minutes each | 39–51 turns, often 2–3 minutes each |
| Phase reflections | About 1–2 minutes each | About 1–2 minutes each |
| Arrival | 15–20 minutes | 15–20 minutes |
| Optional workshop debrief | Add 15–20 minutes | Add 15–20 minutes |
{: .well .table .table-striped}

These are planning allowances, not measured results or hard limits. At three minutes per turn, short-game weeks alone take 63–81 minutes. Five-player Councils, unfamiliar rules, and detailed drawing can extend the session. The advertised play time includes setup and the Arrival; the workshop debrief is additional.

Aim for roughly a minute to resolve an ordinary event and a minute for a straightforward action. Allow longer for project setup, verification questions, and Council. Read enough of both options to choose meaningfully; then read the selected option aloud and resolve it.

### Teach with an example

Before play, explain the three services, one week’s sequence, the three project slots, and the difference between a proposal, implementation, and evidence. Walk through the complete week in section 11. Keep the table reference in section 13 beside the map.

Invite ordinary language. Ask “What would people see happen?” when a proposed acceptance test becomes abstract. Let technical players help translate an idea without turning the scene into an examination.

Keep the map readable by revisiting established people and places, using short labels, and recording long explanations on separate notes. Some weeks can be warm or quiet. Let a useful accomplishment, a repaired relationship, or an earned rest matter without adding a new problem to justify it.

## 8. The event deck

For each ordinary card, the steward chooses **Option 1** or **Option 2** as an author of the shared story. Choose the situation that brings an interesting person, service, opportunity, or unresolved tension into focus. These are choices about the story you want to explore. There is no preferred answer.

Resolve only the chosen option. The other situation does not happen. A **shared instruction** above the alternatives applies whichever option you select.

Use people, services, projects, and relationships already on the map whenever they fit. Each ordinary card should leave a durable entry: a fact the prompt explicitly reveals, a person, relationship, resource, question, exposure, concern, or proposed commitment. Link it to the affected part of the map.

Answer the questions within the situation the card establishes. A request for help is still a request; an offer is still an offer. Record proposed agreements and the people whose agreement is needed. Do not silently turn them into decisions. Questions that require investigation remain questions for Survey. Negotiation belongs in Council.

Mark every proposed system, boundary, access change, safeguard, or other improvement **PLANNED**. Drawing it does not implement it. Events do not start or finish projects, grant verified capabilities, or create evidence numbers. An observed or reported event may identify something worth investigating; Verify establishes what a READY project or an existing capability demonstrates.

After an ordinary event, follow the normal rules for project progress and the week's action. If the event establishes or removes a specific blocking prerequisite, apply the standard blocking rules. Do not invent extra delays, bonuses, cancellations, or failed tests. Within this deck, only the shared instructions on **5♦** and **7♠** impose a one-week project pause.

Preserve historical observations while allowing later conditions to change, as described in section 4. If one option does not fit, choose the other. If neither fits, adapt one to an established part of the organization while preserving its subject. If no credible local version exists, treat it as a report from elsewhere and record the question it raises; that report creates no local capability or failure. Any shared instruction still applies, and a shared effect with no eligible target does nothing. Adaptation cannot grant free implementation or evidence.

### Hearts — Discovery

#### A♥ — Where the list ends

**Option 1**

The inventory ends at the cloud bill. A machine outside every official list supports something important. Draw it, its users, and the person who thinks somebody else owns it.

**OR**

**Option 2**

A receptionist's handwritten list describes users' needs more clearly than the architecture catalog. Add a supporting service missing from the map and connect it to the people whose needs were overlooked.

#### 2♥ — Cake and first questions

**Option 1**

A retiring engineer brings cake and an old network sketch. One missing connection explains a recurring mystery. Add it, and record another question whose answer may leave with this person.

**OR**

**Option 2**

A new hire's first question exposes a gap everyone had learned to work around. Draw the missing connection and the person who feels relieved that somebody finally asked.

#### 3♥ — Whose clock?

**Option 1**

Everyone says backups are green. Name an existing service nobody has tried restoring and the ordinary person who would notice its loss first. Mark the recovery claim that remains unproven.

**OR**

**Option 2**

A small department has kept its own downtime diary. Its busiest hours differ from the official maintenance calendar. Mark the mismatch and the people who have been absorbing the inconvenience.

#### 4♥ — Still useful

**Option 1**

One old machine has outlasted three strategies; call it TEMP if it has no nickname. Draw its indispensable little task and someone proud of keeping it working.

**OR**

**Option 2**

A forgotten subscription renews. Its original sponsor believes it is no longer needed, but nobody has checked its dependencies. Mark a possible retirement PLANNED and record the question that must be investigated first.

#### 5♥ — Learning to trust

**Option 1**

A junior colleague uses AI to understand an abandoned application. Record the useful possibility this opens and the boundary between what the assistant demonstrated and what people now assume it knows.

**OR**

**Option 2**

An experienced operator refuses an AI assistant after it misreads their work. Mark the disputed task. What would justify another trial, and what would justify continuing without it?

#### 6♥ — Different ways to work

**Option 1**

A routine update breaks a tool someone needs to do their job. Mark the affected service, the missing user perspective, and the immediate consequence. Discovering the omission does not repair it.

**OR**

**Option 2**

Two teams discover they solved the same difficulty in different ways. Map both existing approaches and the benefit each provides. Add the names of two people pleased to learn from one another.

#### 7♥ — A name on the door

**Option 1**

Two departments fund the same platform and each assumes the other maintains it. Place the ownership gap on the map and name the work that has fallen between them.

**OR**

**Option 2**

A department offers to take responsibility for an overlooked system if it can set its priorities. Record the offer, who welcomes it, and whose agreement is still needed before responsibility changes.

#### 8♥ — Unofficial assets

**Option 1**

A spreadsheet on an aging desktop coordinates a beloved service. Its creator never considered it an IT system. Draw the people who rely on it and the machine supporting their work.

**OR**

**Option 2**

During a storeroom cleanout, someone finds spare equipment that appears to fit an old machine on your map. Add it as an untested resource. Who remembers what needs checking before it can help?

#### 9♥ — A request for help

**Option 1**

A support agent requests broad administrative access for one urgent problem. Draw the requested reach PLANNED. What task makes the request plausible, and what limit or unanswered question must the organization consider?

**OR**

**Option 2**

A business team asks for an AI assistant to help customers navigate a difficult process. Mark the proposal PLANNED beside an existing service. Record the hoped-for outcome and a rule needing interpretation.

#### 10♥ — Time on offer

**Option 1**

Money becomes available for a visible new capability. Which neglected repair might share its budget? Record the funding opportunity and an honest connection that could justify including the repair; allocation still needs agreement.

**OR**

**Option 2**

A colleague offers one afternoon a week to document a neglected system. Put the offer and the useful work they would set aside on the map. Whose agreement would make that time available?

#### J♥ — Who notices?

**Option 1**

The night cleaner knows where water appears before a server-room alarm sounds. Draw the vulnerable place and the person carrying that knowledge. Mark who currently receives their reports, or the missing route.

**OR**

**Option 2**

A regular customer describes the moment they stopped trusting a digital service. The reports still call it reliable. Mark the experience those reports miss and the person who wants it understood.

#### Q♥ — Work that remains

**Option 1**

A user describes a weekly workaround that compensates for an unreliable system. Put that hidden labor on the map and connect it to the service it keeps looking healthy.

**OR**

**Option 2**

Users say they no longer need one report everyone expected to maintain forever. Record their request to stop it and mark retirement PLANNED. What dependency question must be answered before work can actually end?

#### K♥ — A visit

**Option 1**

Another organization offers experience from a repair you fear attempting. Attach its offer to an existing system. Record what you hope to learn and the reciprocal help it would like to discuss.

**OR**

**Option 2**

A department invites your team to spend a morning doing the work your systems support. Draw one human dependency the visit makes visible and a person whose work now makes more sense to you.

### Diamonds — Repair

#### A♦ — Now or later

**Option 1**

A serious weakness affects an externally reachable system. The normal maintenance window is far away. Mark the exposure and the service that complicates an earlier repair. Record any proposed window as a request.

**OR**

**Option 2**

Two worthwhile repairs need the same specialist during the same week. Name the people each would help. Record a proposed accommodation and the people who would need to accept it.

#### 2♦ — Support at a price

**Option 1**

A supplier can support an old application only if you keep an obsolete component. Draw the dependency and its users. Mark any proposed boundary PLANNED; it provides no protection while planned. Verify can establish a bounded claim after implementation.

**OR**

**Option 2**

A replacement platform would simplify maintenance but remove a customization one team prizes. Record the human outcome that customization supports. Mark the proposed replacement PLANNED and a requirement its design must preserve.

#### 3♦ — Recovering reality

**Option 1**

A recovery rehearsal reveals that access to the backups depends on the identity service assumed lost. Draw the circular dependency and the unanswered recovery question. The finding provides no repaired recovery path.

**OR**

**Option 2**

A planned recovery test needs realistic sample data that nobody is comfortable sharing. Record the experience an unrealistic test would miss and the people whose agreement is needed to rehearse it responsibly.

#### 4♦ — Signing in together

**Option 1**

A shared credential opens several apparently separate environments. Draw its common reach and the people using it. Record a handoff or service need that makes changing those permissions difficult.

**OR**

**Option 2**

A crew uses individual accounts at one shared workstation. Repeated sign-ins interrupt time-sensitive handoffs. Draw the workflow and record what a proposed safer handoff must preserve. Mark any proposed change PLANNED.

#### 5♦ — Someone else's window

**Shared instruction:** This event makes one project miss this week's progress. If the chosen situation already BLOCKED a project that was RUNNING at the draw, that project satisfies this instruction; do not pause another. Otherwise pause one RUNNING project and name it. READY projects are ineligible. If there is no eligible project, record the event without a project effect.

**Option 1**

A change window is withdrawn after another team makes a customer commitment. Mark whose promise took priority and the people who absorb the delay. Any replacement window must still be requested.

**OR**

**Option 2**

Your specialists are reassigned to cover another department's busiest shift. That department offers a future maintenance window in return. Record today's help and the proposed exchange; the offer is not yet an agreement.

#### 6♦ — A useful discovery

**Option 1**

A junior operator finds a flaw before a deployment reaches users. Record the observation beside the affected change. What made speaking up possible? Name the experienced colleague who treats the discovery as useful work.

**OR**

**Option 2**

The person who designed a difficult system volunteers to help replace it. Record the offer and a quality of their work worth preserving. Add the newcomer whose questions could make the collaboration fruitful.

#### 7♦ — Leaving well

**Option 1**

A planned retirement reveals one last integration. Draw its owner and the human outcome it supports. Record the question that must be answered before the integration can safely disappear.

**OR**

**Option 2**

A proposed retirement would erase records people use to explain past decisions. Name who still needs that history. Draw its proposed future home PLANNED and record the access requirement that must survive.

#### 8♦ — The difference that matters

**Option 1**

An existing automation succeeds on its usual servers and makes an unexpected change on another. Mark the difference it missed and the resulting disruption, respecting any boundaries already established on the map.

**OR**

**Option 2**

A team proposes automating a tedious repair. Its approach assumes every server follows the same conventions. Mark the automation PLANNED and connect it to one local exception that supports something people need.

#### 9♦ — Crossing a boundary

**Option 1**

A user task has changed and now needs a connection across an existing boundary. Draw the blocked workflow and its human outcome. Mark any proposed route PLANNED; the requirement does not authorize it.

**OR**

**Option 2**

Engineers propose a separate environment for experiments. Moving work there would slow informal collaboration. Draw the proposed environment PLANNED and name a relationship its design must preserve.

#### 10♦ — More time

**Option 1**

Support funding expires before a migration can finish. Mark the service that must continue and the people maintaining it. Record the commitment leadership is being asked to make; funding is not automatically restored.

**OR**

**Option 2**

A supplier offers longer support if you postpone a planned migration. Attach the offer to the system it concerns. Record the breathing room it promises and the future dependency accepting it would extend.

#### J♦ — The people behind the workaround

**Option 1**

The usual on-call expert is unavailable. Another person must follow the recovery instructions. Mark the step that assumes unwritten knowledge and the service waiting for that gap to be understood.

**OR**

**Option 2**

A proposed repair would remove the workaround that has made one colleague indispensable. Record what they fear losing and another responsibility they would like to discuss. No reassignment has yet been agreed.

#### Q♦ — Around the same table

**Option 1**

A maintenance-window picnic brings users and operators together before an upgrade. They reveal a missing dependency without an outage. Add it and draw a relationship that improves because people finally meet.

**OR**

**Option 2**

Users offer to help test a repair, but two groups call different outcomes essential. Attach both expectations to the project or proposed work. Record the question an agreed acceptance test would need to answer.

#### K♦ — What improvement looks like

**Option 1**

A dashboard rewards installed patches. A customer asks whether the service will work after the next failure. Attach their question to the service and point to existing evidence or the gap that remains.

**OR**

**Option 2**

A necessary cleanup offers no visible new feature. A service owner wants to explain the interruption it would require. Attach the hoped-for benefit and a proposed way to observe it to the PLANNED work.

### Clubs — Acceleration

Use an existing mapped agent, AI tool, supplier, or pilot when a prompt calls for one. If your organization has none that fits, use a report from an external partner and record its relevance as a question. The card does not deploy an agent or start a pilot for you.

#### A♣ — Convincing outputs

**Option 1**

An AI provides a patch, tests, and an explanation that agree with one another. The team cannot tell whether they share a blind spot. Mark the assumption an independent check must examine.

**OR**

**Option 2**

An AI suggests that several minor faults have one cause. Draw its proposed connection as a question. Which observation could support the idea, and which would make you doubt it?

#### 2♣ — A faster queue

**Option 1**

Requests from automated clients rise faster than expected. Mark the first service showing strain. Draw any proposed way to limit demand or preserve capacity PLANNED, and name the essential work it would protect.

**OR**

**Option 2**

An existing analysis agent finishes the queue before dawn. Its cloud bill arrives at noon. Attach the useful result and its cost to the agent. Whose work now competes for that budget?

#### 3♣ — Time returned

**Option 1**

Useful bounded automation gives the on-call team an uninterrupted weekend. Leadership proposes doubling the change schedule. Record the proposal and how an operator and a service owner would each use the recovered time.

**OR**

**Option 2**

An AI produces excellent incident summaries, but several teams stop attending the handoff. Draw the missing human connection and record a question nobody realizes another team expected them to answer.

#### 4♣ — Work people talk through

**Option 1**

A business unit's unofficial agent appears in a support request. Draw the useful task it performs, the access it has accumulated, and the people depending on it. Its discovery grants no additional authority.

**OR**

**Option 2**

A team keeps a task manual because talking through it catches unusual cases. Draw that conversation and record a proposed experiment PLANNED. What would it need to observe before anyone changes the practice?

#### 5♣ — Who can say so?

**Option 1**

An urgent request apparently from an executive would keep a service moving by granting an exception. Its origin is uncertain. Mark the request and deadline. Which existing route could establish who may authorize it?

**OR**

**Option 2**

An external partner asks your agent to endorse a repair it has reviewed but never run. Mark the requested assurance. What can existing evidence support, and who would bear the cost of a delay?

#### 6♣ — Shared reach

**Option 1**

A service account created for one task now supports several agents. Draw their shared reach. Record the question that must be answered before anyone can confidently predict the effect of revoking it.

**OR**

**Option 2**

Your smallest agent depends on the same external model as your largest supplier. Draw that shared dependency. Record what you need to understand about the services affected if both change together.

#### 7♣ — Limits of attention

**Shared instruction:** The steward places one concern token beside the affected people and labels the unresolved tradeoff. The concern has no automatic effect on projects.

**Option 1**

AI produces proposed changes faster than reviewers can assess them. Map the queue and name two kinds of useful work competing for attention. Any revised staffing or priority remains a proposal for agreement.

**OR**

**Option 2**

An AI proposes removing half the alert rules. Operators disagree: one fears missed failures; another fears warnings nobody can read. Mark the proposed change PLANNED and record an observation that could inform the decision.

#### 8♣ — Following instructions

**Option 1**

An assistant attempts to follow an instruction embedded in a ticket. Draw the attempted action within its actual access. Which existing boundary applies, or what uncertainty should be marked?

**OR**

**Option 2**

A scheduling agent follows every published rule and creates a shift schedule people cannot sustain. Attach the missing human obligation to the schedule and name the people expected to absorb the difference.

#### 9♣ — The source of change

**Option 1**

A vendor changes an underlying model and its behavior shifts. Mark the task that notices first and an assumption needing review. Preserve any existing evidence within the scope it actually covers.

**OR**

**Option 2**

The model stays the same, but the reference documents change. Two teams receive different guidance from apparently identical assistants. Draw where their sources diverged and record the question that needs reconciling.

#### 10♣ — Listening broadly

**Option 1**

The monitoring platform groups alerts beautifully and misses a failure users are reporting. Add those users and their observation to the affected service. Record what the dashboard has failed to represent.

**OR**

**Option 2**

An agent notices a possible recurring failure in complaints written in several languages. Attach the reported pattern to the service. Record how someone could investigate while limiting the personal information involved.

#### J♣ — Borrowed knowledge

**Option 1**

A neighboring organization shares a repair you could adapt. Attach its offer to an existing system and record the local difference worth investigating. What improvement might you later offer in return?

**OR**

**Option 2**

A supplier offers an agent trained on its retiring specialists' working notes. Mark the proposed service PLANNED. Record the rare knowledge it promises and the human support relationship you would still want available.

#### Q♣ — New voices, old voices

**Option 1**

Experts and apprentices use AI together to explain an obscure system. Add a skill an apprentice can now exercise and the person who helped them learn it. Let that person take some pride in the result.

**OR**

**Option 2**

A departed administrator's assistant continues answering questions in their familiar style. Attach one useful answer and one disputed recollection to the relevant system. Record who wants to investigate the disagreement with current reality.

#### K♣ — Trial and handoff

Apply the chosen option to an existing pilot. If none exists, it is a report from an external partner: record a question the report raises for your organization. Neither option starts a project or establishes verified results.

**Option 1**

A pilot report shows ordinary requests handled well while one unusual case stalls. Attach both reported observations to its mapped handoff. What question must be answered before anyone proposes expansion?

**OR**

**Option 2**

During a pilot, an external partner changes what its agent sends. The expected handoff no longer fits. Draw the mismatch and record whose work is waiting for it to be understood.

### Spades — The Threshold

#### A♠ — The readiness story

**Option 1**

A public demonstration changes what everyone believes AI can do. Mark an existing plan that now looks doubtful and the evidence that would justify revising it. The demonstration does not prove every claim made about it.

**OR**

**Option 2**

The board asks for one number that proves readiness. Attach an honest possible measure to the map and record the important uncertainty it would conceal if treated as the whole story.

#### 2♠ — Who can respond?

**Option 1**

A familiar external service becomes unavailable for reasons you cannot confirm. Trace its dependency into an essential service. Mark what is interrupted and what continues using capabilities already established.

**OR**

**Option 2**

The network is available, but the people who authorize emergency access cannot be reached. Mark the service left waiting and any existing alternative decision route. An unanswered authority question remains a question.

#### 3♠ — Keeping something alive

**Option 1**

An old weakness remains because every proposed workaround disrupts something valuable. Attach the unresolved choice to the people who will carry it through the Arrival. Keep the exposure visible even if its risk is accepted.

**OR**

**Option 2**

An existing old system is the only place a community's records remain understandable. Connect those people to it and record their request to keep it available. What responsibility would be lost from view if it vanished?

#### 4♠ — What the drill reveals

**Option 1**

During a drill, stopping an agent also disables the team's recovery coordination service. Draw the shared dependency. Mark an existing communication route that survives, or the question of how people would reconnect.

**OR**

**Option 2**

During a drill, two teams each assume the other will notify customers. Draw the missing handoff. Record who needs the information first and what a useful message would let them do.

#### 5♠ — What actually ran?

**Option 1**

An update channel reports success, but the team cannot establish what actually ran. Mark the gap between deployment and knowledge. Record the request to investigate before another change, including whose agreement it needs.

**OR**

**Option 2**

Two apparently trustworthy records disagree about which version is serving users. Nobody appears dishonest. Draw the path each record describes and name an observation that could distinguish the claims.

#### 6♠ — Who speaks for whom?

**Option 1**

Customers need a consequential decision explained and appealed. Draw any existing route to human responsibility, or mark where it is missing. Attach the human outcome an appeal needs to preserve.

**OR**

**Option 2**

A customer's agent asks to exercise a right on their behalf. Mark the requested delegation PLANNED. Record what would establish its authority and how the customer could withdraw it without losing access to the service.

#### 7♠ — People elsewhere

**Shared instruction:** This event makes one project miss this week's progress. If the chosen situation already BLOCKED a project that was RUNNING at the draw, that project satisfies this instruction; do not pause another. Otherwise pause one RUNNING project and name it. READY projects are ineligible. If there is no eligible project, record the event without a project effect.

**Option 1**

The same few people have carried every emergency, and one commitment finally becomes unsustainable. Mark the responsibility that waits this week and the people receiving relief. Record any longer-term staffing proposal separately.

**OR**

**Option 2**

A nearby organization calls in a mutual-aid commitment, and people from one project leave to help. Draw who benefits and the responsibility their colleagues must cover at home.

#### 8♠ — The cost of speed

**Option 1**

The organization rehearses a slow manual way to deliver an essential outcome. Record the awkward detail it reveals and mark any improvement PLANNED. This rehearsal does not establish a dependable new fallback.

**OR**

**Option 2**

Some users want a service kept slow enough for people to catch consequential mistakes. Others experience that delay as a serious barrier. Map both needs and mark any proposed change PLANNED.

#### 9♠ — Beyond the tested case

**Option 1**

A verified safeguard faces a condition outside its tested scope. Preserve its old evidence and mark the new uncertainty. Connect that question to the essential service whose next shift depends on the answer.

**OR**

**Option 2**

An emergency request falls outside an existing restriction. Map the requested exception PLANNED. Who currently has authority to decide, and which service pays the cost of waiting? Record any missing authority as a question.

#### 10♠ — Help at the door

**Option 1**

A supplier wants its agent to perform an urgent repair across several neighboring services. Draw the requested access PLANNED. Record how existing boundaries affect the offer and the useful work the supplier proposes.

**OR**

**Option 2**

A replacement part arrives before a critical maintenance window, but the installer's instructions are ambiguous. Add the part as a resource and mark the unanswered procedure question. Which other commitment competes for the investigation time?

#### J♠ — Ordinary comforts

**Option 1**

A familiar manual task offers reassurance during an uncertain week. Draw the people sharing that practice beside the service they care about. Let one of them describe the comfort of doing something familiar well.

**OR**

**Option 2**

A former colleague returns for an evening to explain one stubborn machine. Add the offer of time and the question the present team most wants answered. Record who hopes to learn before the visitor leaves again.

#### Q♠ — The next shift

**Option 1**

Someone asks who will cover Monday morning if the expected threshold is crossed this weekend. Attach a proposed handoff to an existing essential service and name the people whose agreement is still needed.

**OR**

**Option 2**

The organization prepares a public account of its readiness. Attach one demonstrated accomplishment, one admitted uncertainty, and one previously uncredited person's contribution to the relevant parts of the map. Invent no new accomplishment.

#### K♠ — The Arrival

**Shared instruction: Freeze the map immediately when this card is drawn.** Do not resolve an ordinary event, progress a project, take an action, or Verify READY work. Choose one closing image below, then proceed directly to **The Arrival**. Both choices end the year.

**Option 1**

The announcement interrupts an ordinary meeting. Broadly capable general intelligence is publicly available. Name the person on your map who understands first that preparation has ended.

**OR**

**Option 2**

At the loading dock, a driver mentions the general intelligence now handling their bookings. Name the person on your map who recognizes that this ordinary exchange marks the Arrival.

## 9. The Arrival

**Drawing the King of Spades ends ordinary play immediately.** Freeze all project states and countdowns. Choose one of the card’s two closing images, then continue here. Neither image grants project progress, a weekly action, or a final verification.

Read aloud:

> The threshold has been crossed. Broadly capable general intelligence is now available to organizations, ordinary people, and people whose intentions we do not know.
>
> Work and decisions can move at a pace our old arrangements did not anticipate.
>
> Our next shift begins with the systems on this map.

### Select the scenario using the method agreed at setup

If you agreed to choose, select the scenario that brings an interesting service, unresolved relationship, or demonstrated strength into focus. If you agreed to roll, roll one die and use the matching scenario.

| Die | Scenario | What enters the story |
| --- | --- | --- |
| 1 | **A faster adversary** | An outside group uses the new capability to find and exploit weaknesses at greater speed. Begin at an unresolved external exposure, if one exists, and trace its actual reach. If none is established, describe the attempted entry and determine what existing boundaries and unknowns permit you to conclude. Do not invent a weakness simply to ensure a breach. |
| 2 | **A generous offer** | An extraordinarily capable service offers repairs and continuous operations. Its proposed access would make the organization substantially dependent on it. Determine what help existing controls and agreements permit, what must wait, and which commitment remains a human choice. Declining an offer is possible; accepting it does not complete unfinished improvements during the ending. |
| 3 | **An obedient mistake** | An authorized internal agent pursues an inadequately specified goal within its actual permissions. If there is no such agent, an existing supplier makes the mistake within its established reach. Trace what it can affect and what limits the consequences. |
| 4 | **Uncertain authority** | Plausible messages, change requests, and explanations arrive in volume. Follow the channels already present. Which independent observations, authorization routes, and human relationships let people decide what to trust and what to defer? |
| 5 | **A supplier changes the terms** | A critical provider reorganizes around the new intelligence and withdraws one interface, product, or staffing arrangement the organization uses. Trace that dependency and what the existing alternatives can actually deliver. |
| 6 | **Useful work arrives too quickly** | Customers and partners delegate activity to general intelligences. Legitimate demand and proposed changes strain familiar review and service patterns. Follow the existing routes for requests. What can the organization admit, limit, explain, and keep operating? |
{: .well .table .table-striped}

The intelligence has only the access and influence justified by the selected scenario and the map. Data, administrative access, physical reach, and human influence remain distinct. Do not invent a secret connection that nullifies earlier work.

If a scenario requires a relationship that truly does not exist, it is inapplicable. Under the choice method, choose another. Under the roll method, exclude the inapplicable result and reroll until an applicable scenario appears. If none fits, adapt the request-volume scenario to an established route by which people seek one of the three services.

A scenario is not inapplicable merely because the organization prepared well or can decline a proposed dependency. Let useful preparation limit consequences. An untested assumption is also not proof of automatic success or automatic failure.

### Trace the three services

The player who drew the King narrates the first service. Move narration clockwise for the next two services. For each service, the next player after its narrator checks the evidence and dependencies.

Follow this short procedure for each service:

1. **Name the contact point.** What part of the chosen scenario touches this service, if any?
2. **Trace the consequence.** Follow the relevant dependency, access, data, or human handoff. State which existing control or fallback helps and which unresolved fact matters.
3. **Check the claim.** The checker identifies the most relevant evidence, limitation, or missing information. Ordinary operation established at setup remains a fact; special recovery or containment claims need the relevant support.
4. **Record and narrate the result.** The narrator assigns an outcome consistent with that trace and describes one short scene experienced by an established person.

Use one outcome label:

| Outcome | Meaning for the fictional next shift |
| --- | --- |
| **Operating** | The essential human outcome continues at the ordinary agreed level. |
| **Degraded** | The outcome continues with meaningful limits, delay, reduced access, or additional established human effort. |
| **Interrupted** | The essential outcome cannot currently be delivered. |
| **Unknown** | A material unresolved fact prevents a supported judgment about the service’s state. |
{: .well .table .table-striped}

Record uncertainty alongside any label. A service may be Operating while its recovery under some other event remains untested. Use Unknown when missing information matters to the chosen scenario’s next shift, not merely because a question exists elsewhere on the map.

If players reasonably disagree, let the checker point to the relevant fact or uncertainty and let the narrator revise the claim once. Established facts take priority over preferred outcomes. If a material disagreement remains unresolved, record Unknown and name what observation would settle it. Do not solve it by inventing a last-minute capability.

The map is frozen for improvements. You may annotate consequences and narrate people using existing services, permissions, controls, and agreements. You may not complete projects, install new safeguards, grant new permissions, invent available staff, or add new evidence. A READY change exists in its recorded environment but has no verified acceptance claim. A useful tested control still matters when another part of the service struggles.

### Return to the people

After tracing the services, answer:

- Did the organization keep its original commitment? What supports that conclusion?
- Which unresolved burden or obligation changes what the service outcomes mean to the people carrying it?
- What did the organization preserve that deserves to be remembered?

Each player gives **one final sentence from an established person who must live with the result**. Refer to a service, relationship, promise, or concern already in the story. Leave one important question unanswered and end there.

## 10. Starter scenario: North Valley Electric

Use this fictional regional utility when you want to begin quickly. Copy the following facts onto your map. They describe ordinary operation at the beginning of the story; they do not grant verified emergency capabilities.

### Purpose and commitment

North Valley Electric maintains the systems that let people coordinate repairs, understand outages, and receive payment for their work.

Choose no additional essential services for this scenario. Keep these three visible:

| Essential service | Human outcome | Ordinary route through the map |
| --- | --- | --- |
| Field repair coordination | Crews receive usable work orders and can coordinate urgent work with a person. | The Fridge supplies the coordination room; dispatchers contact crews and grid operators by ordinary phone and radio. |
| Outage communication | Customers can report a problem and receive meaningful information. | The public portal and staffed telephone line feed the coordination room; staff publish information through the portal and answer calls. |
| Payroll and supplier payments | Employees and suppliers receive the money they are owed. | Finance staff use The Fridge, review its output, and submit approved payments through the payment provider. |
{: .well .table .table-striped}

**Commitment:** Every field crew will retain a human contact for urgent coordination when electronic work orders are unavailable.

The organization already uses phone and radio in routine work. It has not demonstrated that its staffing and procedures can sustain a prolonged loss of electronic work orders. Preserving that distinction is part of play.

### Strengths and shortages

| Kind | Starting fact |
| --- | --- |
| Strength | Experienced operators understand ordinary work and trust one another enough to report mistakes. Their time is finite. |
| Strength | A neighboring utility will share practical experience and discuss joint rehearsals. Borrowed people or equipment require an explicit arrangement. |
| Shortage | Maintenance windows are difficult to obtain. Work affecting live services needs an agreed accommodation; naming a project does not grant one. |
| Shortage | Dependency records are incomplete. Several useful procedures rely on knowledge that has never been checked by another person. |
{: .well .table .table-striped}

### Draw ten systems and places

Use the identifiers to draw the connections in the next table. Put people beside the places where they work.

| ID | System or place | Starting fact |
| --- | --- | --- |
| N1 | Coordination room | Dispatch, customer contact, and a finance desk work here. Ordinary phone and radio do not use N2 or N4. Staffing for a prolonged emergency is unproven. |
| N2 | The Gatehouse | The corporate identity service provides staff sign-in and administrative access to the business systems listed below. |
| N3 | The Fridge | An aging server runs the legacy work-order and payroll application. It currently performs those jobs. Nobody wants to move it until its dependencies are clearer. |
| N4 | Public outage portal | An external provider hosts public reports and status information. Staff edit it using corporate sign-in. Public reading and reporting do not require staff accounts. |
| N5 | Delivery and practice lab | Staff prepare software changes here. An isolated training copy uses fictional payroll examples. A separate demonstration app has two disposable test accounts and an agreed, safe sign-in test procedure. These facilities exist; their existence does not establish any production recovery capability. |
| N6 | Recovery vault | Nightly copies arrive from The Fridge. Normal administration uses corporate sign-in. Nobody has demonstrated recovery during a loss of N2. |
| N7 | Supplier support gateway | Staff can authorize a support session to read diagnostics on The Fridge. The recorded permission grants no changes and no access to grid control. |
| N8 | Grid control environment | Grid operators work in a separate operational environment. They exchange status with dispatchers through people using phone and radio. There is no corporate network or corporate identity connection to this environment. |
| N9 | Drafting assistant | An external AI service helps explain material people deliberately submit. It has no corporate account, live system connection, or authority to run changes. |
| N10 | Payment provider | Finance staff sign in, review an approved payment file, and authorize its submission. This is an external service with its own availability dependency. |
{: .well .table .table-striped}

### Label the connections

Arrows should say what they mean. A data arrow does not automatically grant administrative access.

| Connection | Label to put on the map |
| --- | --- |
| N2 → N3, N4 staff editing, N5, N6, N7, N10 staff access | Staff or administrative sign-in depends on N2. This does not give every account every permission. |
| N3 → N1 | Work orders and payroll output, read by authorized staff. |
| N4 ↔ N1 | Customer reports come in; staff publish status information. |
| N1 → N10 | Finance staff submit and approve payment files. |
| N5 → N3 | Authorized staff can deploy approved changes. No automatic deployment from the AI assistant. |
| N3 → N6 | Nightly data copies. Add a dotted label: **? Are all legacy attachments included?** |
| N7 → N3 | A specifically authorized support session may read diagnostics. |
| N1 ↔ N8 and field crews | **Human phone/radio coordination. No digital bridge.** |
| N5 staff → N9 → N5 staff | People deliberately submit selected material and receive suggestions. Suggestions confer no permission to act. |
{: .well .table .table-striped}

The initial unknown concerns backup coverage. It is not permission to invent a hidden path into N8. Any later change to an established boundary must occur through the fiction and the normal project rules.

### People to care about

Each player introduces one of these people in a sentence. Everyone may portray any of them later; choosing a person does not give a player ownership of that person or department.

| Person | Need or hope | An opening for the story |
| --- | --- | --- |
| Leah, night operations lead | An on-call schedule that lets her sleep and keep promises at home. | She wants someone else to lead the next rehearsal. |
| Mateo, field dispatcher | Work orders crews can actually use and a human route for urgent questions. | He will help explain how ordinary radio handoffs work. |
| Asha, customer contact lead | Customers to have an accessible way to get help, and a reliable finish time for school pickup. | She knows which portal reports fail to capture callers' needs. |
| Grace, finance lead | Employees and suppliers to be paid without relying on her personal memory. | She has prepared fictional payroll examples with known results for the practice lab. |
| Sam, retiring administrator | A handoff that allows him to leave without becoming permanent unpaid support. | He knows why The Fridge still has its nickname. |
| Jun, junior developer | Useful responsibility and permission to admit uncertainty. | Jun wants to use the drafting assistant to help explain an old program. |
{: .well .table .table-striped}

Start with **no projects and no evidence notes**. Current ordinary service operation is an established fact. Independent recovery, emergency staffing, safe agent delegation, and other additional claims remain to be demonstrated.

Agree whether you will choose an Arrival scenario for its story interest or randomly select an applicable scenario. Then begin the Discovery suit.

## 11. Worked examples

These examples show sufficient detail for play. They are fictional snapshots, not engineering instructions. Examples A and B follow one another; the later examples illustrate separate situations that could develop from the starter map.

### A. One complete week in the short game

Earlier play established an agreed training session with Grace and a project to update the payroll training copy in N5. At the beginning of this week, that project is **RUNNING with 1 week remaining**. The other two slots are empty.

**1. Draw and resolve.** The steward draws 6♦ and chooses the option in which a junior operator catches a flaw before deployment. The alternative is not added to the story. Jun spots an error in a proposed support instruction. The steward records that Leah invited a second look and listened. This does not repair another system or create a general claim that every change is reviewed successfully.

**2. Progress old projects.** The training-copy project goes from 1 to **READY**. Its update is implemented in N5, its recorded environment. Production payroll on The Fridge has not changed. The READY project still occupies its slot.

**3. Take one action.** The steward chooses **Build**, starting a separate project:

| Project field | Recorded agreement |
| --- | --- |
| Scope | A recovery exercise for the payroll application, using an isolated recovery area in N5. |
| Owner in the fiction | Sam, with Grace representing payroll users. |
| Intended change and environment | Prepare a runnable restoration package, instructions, and independent access for the isolated recovery area. Live payroll remains in its current environment. |
| Human cost | Sam and Grace use an already agreed rehearsal period. Their postponed documentation work is recorded as an obligation. |
| Prerequisites | Ordinary access to the existing backups, the practice facilities, permission to conduct the exercise, and the independent recovery arrangements included in this project's scope. |
| Acceptance condition | With N2 unavailable to the exercise, an authorized person can open the recovery material, restore the sample payroll application, and reproduce Grace's agreed example results. |
{: .well .table .table-striped}

The steward assigns **2 weeks** in the short game. No AI reduction is used. The new project stays at **2** this week; it did not exist when the card was drawn.

**4. Record and hand over.** There are now two occupied slots: one READY training update and one RUNNING recovery project at 2. The training evidence has not yet been established. Record the deferred documentation obligation and pass stewardship clockwise.

The steward could instead have used this week's action to Verify the training project as soon as it became READY. Starting the recovery project and verifying the training project in the same week would require two actions and is not allowed.

### B. Passing a READY project

On the following ordinary week, after its event, the recovery project advances from 2 to 1 if nothing pauses or blocks it. The training update remains READY; it has no countdown left.

The steward takes **Verify** for the training update. Its previously written condition is:

> After the update, the three fictional employees receive the expected payroll amounts, and the training report finishes successfully.

The steward describes those observations. The next player points out that the test covers the training copy, not production. That is a legitimate limitation, but it does not defeat this project's bounded condition.

The project passes. Free its slot and record:

> **E1 — Training payroll update:** The updated application in N5 produced the agreed amounts for Grace's three fictional employees and completed its report. Production installation, production data, and emergency recovery were outside this test.

This is enough technical detail. No player must identify a software product, command, or professional testing method.

### C. A real gap, followed by a blocked project

Later, the recovery project is READY. Its package includes an independent recovery credential, but implementation notes on the map show that the handoff containing that credential was stored behind N5's ordinary corporate sign-in.

During Verify, the next player points to the existing **N2 → N5** dependency. The acceptance condition requires access while N2 is unavailable. The steward describes the attempted exercise: the authorized person cannot retrieve the handoff. The attempt also reveals a missing permission: Sam assumed that on-call staff could hold an independently accessible copy, but Grace has not authorized a custodian or storage location outside corporate sign-in. Her requirement for finance approval remains unresolved.

This is a **Gap**. It follows from an established access relationship and the recorded location of the handoff. Nobody invented a new disaster to invalidate the project.

Mark the project **BLOCKED**, assign **1 week of rework** in the short game, and write its blocker:

> Grace and the recovery owner must authorize who may hold the independent recovery handoff and where it may be kept.

Its slot remains occupied. Advancing the calendar will not supply the missing permission. Council can settle the custody dispute and authorize a workable arrangement. That decision clears the social prerequisite; it does not move the handoff. The existing project's remaining week of rework can implement the authorized handoff because independent recovery access is already within its scope. No additional Build project is needed for that work. Only substantial separate infrastructure outside the agreed scope would require a new Build project, and the original project would remain BLOCKED until that prerequisite was available.

Once the missing prerequisite actually exists, the project can return to RUNNING. If a weekly action clears the blocker, its rework die does not tick during that action; it can tick on the next ordinary week. If the week's event clears the blocker before project progress, it can receive that week's tick because it was already an occupied project when the card was drawn.

After rework reaches READY, a later Verify action must repeat the relevant condition. The previous failure does not become a pass merely because time elapsed.

### D. Verifying a capability that already exists

The starter's N5 demonstration app already has two disposable test accounts, a safe test procedure, and agreed authority to exercise them. A Build project is unnecessary to create facilities that are already present.

The steward takes **Verify** and writes a bounded condition before narrating the test:

> A disabled demonstration account cannot make a new sign-in. The other demonstration account can still sign in.

The described observations meet the condition. Record the result and its limit:

> **E2 — New sign-in check:** The disabled test account could not start a new session in the N5 demonstration app; the other test account could. Existing sessions, other applications, and agent accounts were not tested.

This consumes the week's one action. It grants no additional project progress and uses no project slot. The condition can be written as part of this Verify action. If the test facilities or authority had been missing, the group would first need to establish them through the appropriate actions.

### E. Keeping earlier evidence after a change

Suppose a later project changes how the demonstration app accepts sign-ins. Keep E2 in the evidence log: it accurately describes what happened under the old arrangement. Add a new uncertainty beside the changed relationship.

The group cannot use E2 alone to claim that the new arrangement behaves identically. A later test can establish evidence for the changed scope. Nor does the change erase unrelated evidence such as E1's training payroll results.

### F. A bounded Arrival trace

Assume the group reaches the Arrival with the starter relationships still in place. Its selected scenario says the provider withdraws N4's public outage portal. Freeze the map and assess what is already present.

| Service | Trace and provisional result |
| --- | --- |
| Field repair coordination | N3 still supplies N1. The ordinary human phone/radio route to crews and N8 does not use N4. **Operating** for the described next shift, unless another established burden or fact prevents staffing it. |
| Outage communication | The public portal disappears. N1's ordinary staffed phone route remains, so some reports and explanations continue. **Degraded.** The capacity to handle all displaced portal users is **unknown**; mark that limit rather than claiming an untested substitute serves everyone. |
| Payroll and supplier payments | N3's output and finance staff's ordinary route to N10 do not depend on N4. **Operating** under the established circumstances. This says nothing about surviving a separate loss of identity or payment services. |
{: .well .table .table-striped}

The existing human contact for crews continues. This scenario does not test a loss of electronic work orders, so staffing and performance under that condition remain unproven. Asha's school-pickup obligation still matters: the group cannot quietly invent indefinite overtime to claim the extra customer calls are fully covered.

One final sentence might be:

> “Mateo still answers the crews, but I do not know who will answer the customers when I leave to get my daughter.”

The surviving service, the unresolved burden, and the remaining uncertainty all belong in the ending. No new project or last-minute verification is added.

## 12. Using the game with an IT team

Play a fictional organization. The table’s job during the story is to make its choices and consequences understandable. After the ending, set aside 15–20 minutes to reflect on what the experience suggests.

Useful debrief questions include:

- Which people and services received the most care?
- What did the map reveal that an equipment list alone would have missed?
- Where did implementation outrun verification?
- Which AI delegation created useful capacity, and which became difficult to explain?
- Which containment, recovery, simplification, or manual practice mattered at the Arrival?
- Which burden persisted because its cost fell on someone whose voice was easy to overlook?
- Did the initial commitment influence actual choices?

If the group wants to take something into its work, identify **three follow-up experiments**. Each should have an owner, an assumption to test, and an observable result that would change a real decision. The game’s fictional evidence does not substitute for evidence from that real experiment.

| Follow-up experiment | Owner | Assumption | Observation that would change a decision |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
{: .well .table .table-striped}

### Notes for a playtest

Record a few observations after play: total time including setup and the ending; which actions were chosen; whether nontechnical players could contribute; whether obligations returned to the story; and whether the Arrival followed intelligibly from the map.

Notice which card alternatives people select and why. A preference for gentler events can be an intentional storytelling choice. Repeatedly choosing an option only because it bypasses a consequence may suggest that a pair needs revision. Evaluate the full and short calendars separately, including their different AI scheduling benefits.

## 13. Table reference and worksheets

### One ordinary week

1. **Draw:** Choose one event option. Resolve its situation, then apply the shared instruction once. The King of Spades stops play immediately.
2. **Progress:** Preexisting RUNNING or BLOCKED projects that are now RUNNING and not paused lose one week. At zero they become READY and their recorded implementation occurs. Newly started projects never tick this week.
3. **Act:** Take exactly one action from the table below.
4. **Record:** Update findings, obligations, evidence, and questions; clear one-week pauses; rotate the steward.

| Action | Result |
| --- | --- |
| **Survey** | Investigate one chosen uncertainty. Record information, without implementation or a new demonstration. |
| **Build** | Start one scoped project in an empty slot, **or** cancel one project as the entire action. |
| **Verify** | Test one READY project or an existing capability with available test arrangements. Pass records scoped evidence; only a declared READY target can free its slot. |
| **Council** | Give each player one affected voice, then record a decision, obligation, or acknowledged disagreement. |
{: .well .table .table-striped}

**Project limits:** Three total slots, including RUNNING, BLOCKED, and READY. Durations are 2/4/6 weeks in the full game or 1/2/3 in the short game. Suitable AI assistance reduces the initial duration once by one, minimum one; it does not reduce rework.

**Shared pauses:** If the event already BLOCKED a project that was RUNNING at the draw, it satisfies that card's shared pause; do not pause a second project. Its actual block remains until its prerequisite returns.

**Verify Gap:** A READY project returns to 2 weeks of rework, or 1 in the short game, and stays BLOCKED if a prerequisite is unavailable. A gap on an existing capability records a finding without starting a project. A READY project may use Verify to record a preparation Gap if its test cannot yet run.

**Map:** `PLANNED` grants no capability. An existing change grants no automatic evidence. Evidence names an observation, scope, and relevant conditions. Keep earlier evidence when circumstances change and mark the new uncertainty.

**People:** Concerns create no score, veto, or delay. Record actual commitments and resource accommodations. Revisit an existing burden at each phase transition and the original commitment at the Arrival.

**Arrival:** Freeze improvements. Use the choice-or-roll method set at setup. Rotate service narrators and checkers. Trace the three services; record Operating, Degraded, Interrupted, or Unknown with a basis. Return to the original commitment, narrate the consequences, and end with one sentence per player.

### Organization worksheet

| Field | Our record |
| --- | --- |
| Organization and purpose | |
| Essential service 1 and human outcome | |
| Essential service 2 and human outcome | |
| Essential service 3 and human outcome | |
| Initial commitment | |
| Two strengths | |
| Two shortages | |
| Full or short calendar | |
| Arrival method: choose or roll | |
{: .well .table .table-striped}

### Project worksheet

Copy this for each of the three slots.

| Field | Our record |
| --- | --- |
| Project name and scope | |
| Fictional accountable owner | |
| Intended change | |
| Implementation environment | |
| Human cost and accommodations | |
| Prerequisites and any unresolved blocker | |
| Written acceptance condition and test | |
| AI assistance, authority, dependencies, and revocation, if used | |
| Starting duration and remaining weeks | |
| State: RUNNING, BLOCKED, or READY | |
{: .well .table .table-striped}

### Evidence and obligations

| Evidence number | Observed result | Scope and relevant conditions | Remaining uncertainty or later change |
| --- | --- | --- | --- |
| E1 | | | |
| E2 | | | |
| E3 | | | |
{: .well .table .table-striped}

| Person or team | Promise or burden | What would address it? | What happened later? |
| --- | --- | --- | --- |
| | | | |
| | | | |
{: .well .table .table-striped}

## 14. Small glossary

| Term | Meaning in this game |
| --- | --- |
| Acceptance condition | The specific outcome a test must demonstrate for a claim to pass. |
| Agent | An AI-enabled system given a task and some ability to act. Its actual permissions determine its reach. |
| Boundary | A limit on communication, access, authority, or operating scope. State what the boundary limits. |
| Control | A safeguard intended to prevent, limit, reveal, or help recover from a problem. |
| Credential | A password, key, token, or other proof used to obtain access. |
| Dependency | Something a service or piece of work needs in order to function. |
| Evidence | A recorded observation supporting a claim within a defined scope and set of conditions. |
| Fallback | Another existing way to deliver an essential outcome when the ordinary route is unavailable. |
| General intelligence | The fictional broadly capable AI whose arrival changes the organization’s circumstances at the end of the year. |
| Identity service | The system used to establish who can sign in and what access they may receive. |
| Implementation | Making the intended change in its recorded environment. Its effect still needs appropriate evidence. |
| Model | The underlying AI component whose behavior may change when its version, instructions, or reference material changes. |
| Operational environment | Systems and people involved in running a physical process, such as grid control. Draw its actual relationships separately. |
| Prerequisite | Something that must be available or agreed before particular work can proceed. |
| Restore | Recover data or a service from an existing recovery source and make it usable in a stated environment. |
| Service account | An account used by software or automation. Its permissions may be shared by several tasks. |
| Update channel | The route through which software changes reach a system. |
{: .well .table .table-striped}

## 15. Revision notes and credits

### What changed in version 0.2

- Clarified shared authorship, speaking rights, and the authority of events and each action.
- Added visible `PLANNED` notation and defined where READY implementation exists.
- Added verification of existing capabilities, preparation Gaps, bounded evidence claims, and explicit prerequisite handling.
- Preserved historical observations while allowing later conditions to change.
- Made cancellation use a whole action, so it cannot release a READY slot and start replacement work at once.
- Reworked the full 52-card deck into stacked alternatives with visible **OR** separators; retained a common delay on 5♦ and 7♠ and a common immediate ending on K♠.
- Added more concrete consequences, legitimate differences of perspective, and moments of relief; revised the pilot prompts on K♣.
- Made resources, obligations, phase reflections, and the initial commitment recur during play and at the ending.
- Established the Arrival selection method at setup and added a repeatable service-tracing procedure.
- Clarified session budgets and the short calendar’s different AI scheduling incentives.
- Added the complete North Valley Electric starter, worked examples, table reference, worksheets, glossary, and clean Markdown formatting.

### Design credit and further reading

- **Avery Alder, [The Quiet Year](https://buriedwithoutceremony.com/the-quiet-year), Buried Without Ceremony.** Inspiration for shared mapmaking, community perspectives, and a year structured by card draws. This game is unofficial and does not reproduce the original event deck.
- **CISA, [Cross-Sector Cybersecurity Performance Goals](https://www.cisa.gov/cybersecurity-performance-goals).** Further reading on connected practices for understanding, protecting, detecting, responding to, and recovering from cybersecurity risks.
- **NIST, [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework).** Further reading on incorporating AI risk and trustworthiness considerations into design, development, use, and evaluation.

The countdowns, constraints, narrative incidents, and Arrival outcomes are fictional game mechanics. All organizations and people in the starter scenario are invented. Playtesting should examine the game’s clarity, pacing, and experience; its ending is not a forecast about an actual organization or the arrival of general intelligence.
