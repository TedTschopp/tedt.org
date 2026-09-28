# Game Theory Playground: Next Steps

Last reviewed: September 27, 2026.

This is the working roadmap for the Game Theory Playground. When Ted asks for
Game Theory next steps, read this file first, compare it with the current catalog
and implementation, and recommend the next unfinished item. Update the status and
supporting evidence here as work is completed. This planning document is excluded
from the generated website.

The ideas below preserve the recommendations discussed after the first twenty
experiments were published. All unchecked items are **planned**. Their inclusion
here does not mean the lesson exists or that implementation or publication has
been requested.

## Purpose and Current Starting Point

Develop the playground into an interactive course with tools for building and
questioning models. A **model** is a simplified representation of a situation:
we choose which people, choices, rules, and outcomes to include so we can examine
how they fit together.

Readers should learn to explain their decisions, change an assumption, notice
when a conclusion stops holding, and apply an idea to a new situation. Support
readers with junior-high pre-algebra experience while providing optional formal
mathematics for experts.

The current [catalog](../_data/game_theory.yml) contains twenty experiments:

| Existing Group | Experiments Already Available |
| --- | --- |
| Foundations | [Trust](trust-machine/index.html), [equilibrium](equilibrium-explorer/index.html), [coordination](coordination-trap/index.html), [mixed strategies](mixed-strategy/index.html), [credible commitments](credible-threat/index.html), and [traffic](traffic-paradox/index.html) |
| Cooperation and information | [Public goods](public-goods/index.html), [shared resources](last-fish/index.html), [bargaining](bargaining-room/index.html), [auctions](auction-lab/index.html), [signaling](signaling-game/index.html), [expectations](expectations-game/index.html), [common knowledge](common-knowledge/index.html), and [evolution](evolution-arena/index.html) |
| Designing rules | [Correlated advice](correlation-experiment/index.html), [matching](stable-matching/index.html), [coalitions](coalition-calculator/index.html), [voting](voting-lab/index.html), [incentives](incentive-designer/index.html), and [mechanism design](mechanism-design/index.html) |

The [site-wide math guide](../math-guide/index.html) already explains notation,
vocabulary, and small worked examples. Use it as a reference and extend it when a
new symbol needs an explanation. The prerequisite lessons below should give
readers things to try, rather than repeat the guide as a second glossary.

Repeated encounters, working backward through decisions, and unpredictable
choices already appear in the playground. Extend that work where indicated.

## Recommended Implementation Order

Keep the full roadmap visible, but build and validate one coherent group at a time.

1. **Make the entrance easier.** Add the five short essential lessons P01–P05 and
   the “How to Read a Game” introduction. Let visitors skip directly to an
   experiment and open a refresher when needed.
2. **Teach readers to construct a game.** Build N01, Build Your Own Game; N02,
   Can You Cross Out This Choice?; and N03, Draw the Decision Tree, in that order.
3. **Show how different goals create opportunities.** Build N05, More Than One
   Thing to Trade, followed by N11, Can Everyone Prefer Their Own Share? Add P13
   for both lessons and P06 before the fair-division activity.
4. **Show why connections matter.** Build N09, Who You Know Changes What Spreads,
   with the graph and modeling bridges P11–P12.
5. **Deepen uncertainty and information.** Add P06–P10 as needed, then N04, N06,
   N07, N08, and N10. Each lesson should link to the particular refresher it uses.
6. **Study learning and combine the ideas.** Build N12 and the community-space
   capstone C01.

Introduce the shared modeling tools M01–M04 as the lessons need them. M01 belongs
in the first construction lessons; M02 belongs in the probability lessons;
M03 belongs in comparisons with changing costs or rewards; M04 belongs everywhere.

This keeps the original next-experiment priority: **Build Your Own Game → Cross
Out a Choice → Draw the Decision Tree → More Than One Thing to Trade → Fair
Division → Network Connections**, with preparation and teaching support added
around that sequence.

## Before Game Theory: A Gentle On-Ramp

These are suggested preparations for this approachable playground, not entry
requirements for every kind of formal game-theory course. Visitors should be
able to start playing immediately. Offer one short readiness question, useful
feedback, and a link to a refresher, with no locked progression or entrance exam.

Calculators, counters, and explanations in words should remain available.
Calculus, advanced algebra, formal proofs, and memorized technical vocabulary
are not required for the beginner path.

### Five Essential Starting Lessons

| Status and ID | Lesson | Interactive Activity and Small Example | Ready to Continue When the Reader Can… |
| --- | --- | --- | --- |
| Planned · P01 | **Choices, Goals, and Limits** | Plan an afternoon with six available time blocks. Change the goal between having fun, resting, and finishing homework. A limit is something that restricts available choices. Show that minutes and points measure different things and cannot simply be added. | Identify who chooses, the available choices, one goal, and one limit. Explain why changing the goal can change the preferred choice. |
| Planned · P02 | **Totals and Changes** | Move counters between received and spent. Receiving four points and spending six gives a change of negative two. Receiving seven and spending six gives positive one. Keep a starting balance visible. | Calculate both changes, explain that the second is three points higher, and distinguish the final amount from the change in that amount. |
| Planned · P03 | **Read an Outcome Table** | Choose a row and a column to reveal a cell labeled “You: 3; Sam: 1.” Highlight whose choice selects each direction. Change only one person's choice and compare the two cells. | Find the correct cell, identify both scores without swapping their owners, and compare one person's results while keeping the other person's choice fixed. |
| Planned · P04 | **Letters Stand for Numbers** | Slide the number of tokens. Each token gives two points. Show “points = 2 × tokens” before introducing “p = 2t,” with both letters defined beside it. Translate greater than, less than, and equal into ordinary words. | Put three tokens into the rule and get six points. Explain that t names a quantity, and compare two results including a tie. |
| Planned · P05 | **If This Happens, Do That** | Arrange cards into a plan: “If it rains, choose the library. Otherwise, choose the park.” Reveal the weather before or after the choice. | State what is known at the time of a choice. When the weather is known first, write a plan covering both situations. Explain why a choice cannot depend on weather revealed only afterward. Distinguish a single action from a plan for several possible situations. |

Suggested sequence: P01, P02, P03, P04, P05. Readers who can already do an activity
should continue immediately. Simple choice, trust, coordination, and outcome-table
activities can begin before the whole sequence is finished; particular settings
may call for the probability bridges below.

P01 should also introduce **preference**, meaning which outcome a person would
choose over another, and **trade-off**, meaning that getting more of one thing
may require accepting less of something else. Introduce **opportunity cost** as
the value of the best alternative given up, using a choice between two afternoon
activities. Do not require readers to memorize these names before using the ideas.

### Lessons to Open When Needed

| Status and ID | Lesson | Interactive Activity and Small Example | Ready to Continue When the Reader Can… |
| --- | --- | --- | --- |
| Planned · P06 | **Fractions, Shares, and Percentages** | Shade four of ten tiles. Switch between “4 out of 10,” “4/10,” “2/5,” and “40%.” Split six counters equally between two bowls. Keep the size of the whole visible. | Translate a simple share between words, a fraction, and a percentage. Explain that 40% means 40 out of 100 equal parts of a whole. |
| Planned · P07 | **Chance and Possible Results** | Draw from a bag with three blue tokens and one orange token. Mix before each draw and give every remaining token an equal chance. Replace each token after drawing it so the contents stay the same. Offer a second mode without replacement, keeping equal chances for remaining tokens, and show what changes. | Explain the initial three-in-four chance of blue, why orange can appear next, and why a likely result is not guaranteed. Explain when the next draw's chances stay the same. |
| Planned · P08 | **Averages With Unequal Chances** | Blue earns two points and orange earns six. Lay out three copies of the two-point result and one copy of the six-point result. Add them and divide twelve by four to get three. | Calculate the average and explain why one draw never pays three points. An expected score is an average that gives each possible result the weight of its chance, not a promised result. |
| Planned · P09 | **New Information Changes the Group You Count** | Show ten tickets: four starred and six plain. Three starred tickets and two plain tickets are red. Hide all non-red tickets. | Explain why three of the five remaining red tickets have stars, and why this differs from the three red tickets among four starred tickets. Explain “given” as considering only cases that fit the information. |
| Planned · P10 | **One Trial and Many Trials** | Repeat the token draw once, ten times, and one hundred times. Compare separate runs and the average after each draw. A trial is one attempt following the same stated procedure. | Explain why runs can differ, why more trials often give steadier averages under these rules, and why they do not promise an exact result or repair an unrealistic assumption. |
| Planned · P11 | **Read a Graph and Find a Turning Point** | In a deliberately simple travel model, walking takes two minutes per block and a shuttle takes six minutes total. Change the distance and show both times on a labeled graph. | Identify what each axis measures, find the three-block tie, and say which option is faster on either side. A threshold is an input value where the conclusion changes. |
| Planned · P12 | **Build and Question a Small Model** | Start with the travel calculator. Add waiting time, then change walking speed. Label the information entered, the calculation rule, and the result. Change one assumption at a time. | Name an assumption, predict what changing it will do, and identify a real observation that could challenge the model. Distinguish a model's prediction from evidence about the world. |
| Planned · P13 | **Compare Outcomes Without Hiding Who Gets What** | Distribute eight counters as “4 and 4,” “6 and 2,” and “8 and 0.” Ask both people which they prefer and why. Change the meaning of a counter from a reward to a minute of an unwanted chore. | Describe the total and each person's amount separately. Explain why an equal total does not settle fairness or how much each person benefits. |

Suggested dependencies:

- P06 builds on counting, sharing, and division; include a counter-based division
  refresher inside it. P07 uses P06, and P08 uses P07 plus adding and dividing.
- P09 uses P06–P07. Count visible cases before introducing a formal probability rule.
- P10 uses P07–P08. Introduce a graph's axes before showing a running average, or
  offer a table until the reader has tried P11.
- P11 uses P02 and P04. P12 builds on P11's travel example.
- P13 uses P01–P03 and can be taken before any probability lesson.

### Connect Preparation to the Existing Playground

| When a Reader Needs Help With… | Offer… |
| --- | --- |
| Trust, equilibrium, coordination, or who receives which score | P01–P05; add P07 when enabling chance or mistakes |
| Mixed strategies, auction uncertainty, signaling, or private information | P06–P09 as relevant to the selected activity |
| Comparing repeated runs or noisy results | P07, P08, and P10 |
| Traffic, resource changes over time, evolution, or networks | P11–P12, with a brief introduction to each changing quantity |
| Bargaining, public goods, coalitions, incentives, voting, or allocation | P01 and P13, keeping goals and individual outcomes visible |

### How to Read a Game

- [ ] **S01: Add a short bridge from the on-ramp into the playground.** Start with
  a familiar shared decision and let the visitor identify the players, available
  choices, order of moves, information available at each move, and outcomes.
- [ ] Explain that a **player** is a decision-maker. A player may be a person,
  team, organization, or another unit making choices in the model.
- [ ] Explain that a **payoff** is the model's score for an outcome from one
  player's point of view. It may represent money, time, fairness, reputation, or
  another stated goal. Explain what larger and smaller numbers mean locally.
- [ ] Explain that choosing what counts, and what gets left out, is part of
  building the model. Let visitors change a goal and see a recommendation change.
- [ ] Ask the reader to hold one person's choice fixed while comparing the other
  person's options. Introduce **best response** as a choice that does at least as
  well as that person's other choices against the choices being held fixed.
- [ ] End with a worked example and a new example the reader can describe in words.

## New Lessons and Extensions

All twelve items below are planned. Each needs a concrete activity, a beginner
walkthrough, a prediction question, visible assumptions, and an optional expert
section. Expert terminology should also be explained where it first appears.

### N01: Build Your Own Game

- [ ] Turn a familiar disagreement into a small table of choices and outcomes.
  Let visitors name two players, choose actions, and specify what each values.
- [ ] Change the value of time, money, fairness, or reputation and compare the
  resulting choices. Keep each person's score separate.
- [ ] Teach that assumptions create the model and that different goals can
  change the best choice. Reuse the outcome-table and best-response work already
  present in the equilibrium experiment.
- [ ] Expert extension: distinguish a ranking of outcomes from numerical scores
  whose differences are meaningful. Explain which conclusions need which kind
  of score, especially before introducing averages over uncertain outcomes.

Preparation: P01–P05 and S01. Add P13 when comparing different people's results.

### N02: Can You Cross Out This Choice?

- [ ] Remove a choice that gives a player a lower score than another choice,
  whatever the other player does. Repeat and discover further removable choices.
- [ ] Introduce **strict dominance** as one choice doing better in every case
  being compared. Let the visitor inspect every comparison before crossing it out.
- [ ] Show what happens when some results tie. Explain **weak dominance** as doing
  at least as well in every case and better in at least one. Keep the two rules
  distinct, and show that the order of weak eliminations can affect what remains.
- [ ] Explain the assumptions about players' goals and reasoning. Do not present
  elimination as a guarantee of how actual people will behave.

Preparation: P03–P04 and S01. Build on the existing equilibrium table.

### N03: Draw the Decision Tree

- [ ] Let visitors arrange decisions as branches, name who moves, and attach
  consequences to the ends. Compare moving first with moving second.
- [ ] Step backward from final choices to earlier ones. Extend the existing
  credible-threat lesson, which already includes backward reasoning and deposits.
- [ ] Compare observing a previous move with having that move hidden. Explain a
  **strategy** as a plan covering the situations where the player might act,
  including situations that do not occur in the particular play shown.
- [ ] Expert extension: mark decision points a player cannot distinguish as an
  **information set**. Require the same available choices there and prevent the
  model from using hidden information. Do not apply the simple fully observed
  backward procedure as though the player could see a hidden move.

Preparation: P05 and S01; P07–P09 for optional uncertain or hidden-information cases.

### N04: How Unpredictable Should You Be?

- [ ] Extend Mixed Strategy with unequal rewards so an equal mix is not always
  the appropriate recommendation. Let visitors set each move's percentage.
- [ ] Let an opponent exploit an overly predictable mix, and show why changing
  the rewards can change the useful mix.
- [ ] Compare a calculated long-run score with actual sampled rounds. A deliberate
  choice to use chance is different from a chance event imposed by the situation.
- [ ] Expert extension: explain how balancing the opponent's relevant expected
  scores can determine a mix, and when a choice should get zero probability.
  Define **minimax** as choosing to make the worst loss as small as possible in
  the stated opposing-interest game; distinguish that guarantee from a sample run.

Preparation: P06–P08 and P10. Reuse the current Mixed Strategy experiment.

### N05: More Than One Thing to Trade

- [ ] Negotiate over two things that people value differently, such as equipment
  access and meeting time. Display each person's values and alternatives.
- [ ] Let players discover a trade both prefer before deciding how to divide
  the remaining benefit. Compare this with bargaining over one fixed reward.
- [ ] Explain **outside option** as what someone can do if no agreement is reached.
- [ ] Expert extension: show outcomes where helping one person further would
  require hurting another under the model, called **Pareto-efficient** outcomes.
  Explain that this condition does not by itself establish fairness.

Preparation: P01–P04 and P13. Extend the existing Bargaining Room.

### N06: Your Reputation Arrives First

- [ ] Give players new partners who can see all, some, or none of their histories.
  Add accidental mistakes, unreliable reviews, and an opportunity to repair trust.
- [ ] Compare meeting the same partner again with meeting a new partner who has
  heard about previous behavior. Define **reputation** as others' beliefs about
  someone based on available information about their past behavior.
- [ ] Show when a bad record is informative and when it reflects bad luck or a
  misleading report. Make the programmed partner's decision rule visible.
- [ ] Expert extension: study how future opportunities change current choices,
  with explicit assumptions about matching, observation, and review reliability.

Preparation: Trust Machine, P07–P10. Connect to signaling without duplicating it.

### N07: Where Did the Good Offers Go?

- [ ] Offer one buying price for products whose quality sellers know but buyers
  cannot see. Let sellers decide whether to remain in the market.
- [ ] Watch how the available mixture of quality changes, then test inspections
  and warranties, including their costs and what they can actually establish.
- [ ] Explain **adverse selection** as hidden differences affecting who accepts
  an offer, which changes the group the buyer ends up dealing with.
- [ ] Expert extension: introduce **screening**, where the less-informed side
  offers several contracts so choices may reveal differences between sellers.
  Check whether each seller would actually choose the intended contract.

Preparation: P06–P09 and P12. Connect to Signaling Game and Incentive Designer.

### N08: What If Their Priorities Are Hidden?

- [ ] Give opponents different private goals or costs. Let visitors change the
  chance of meeting each kind of opponent and predict a useful choice.
- [ ] Separate what is true about an opponent from what the visitor believes.
  Reveal evidence and let the visitor update those beliefs by counting cases.
- [ ] Explain **incomplete information** as missing relevant facts about another
  player's circumstances or goals. Introduce **Bayesian game** as a game model
  that represents private information and beliefs about it.
- [ ] Expert extension: compare plans for different private circumstances, often
  called **types**, and show how a choice is checked against the stated beliefs.

Preparation: P06–P09, S01, and the Signaling Game.

### N09: Who You Know Changes What Spreads

- [ ] Arrange the same people in a circle, separate clusters, or around one highly
  connected person. Let visitors choose the first adopters and add or remove links.
- [ ] Make each person's choice depend on specified neighbors. Compare two networks
  with the same overall number of adopters and different arrangements.
- [ ] Explain **network** as people or other units connected by specified links;
  state whether a link means observation, contact, influence, or something else.
- [ ] Expert extension: vary how many neighbors must adopt before a person changes,
  and test links between clusters. Separate effects of the connection pattern
  from effects of the chosen update rule.

Preparation: P11–P12 and Coordination Trap. Its current aggregate peer-adoption
model supplies the comparison; this extension adds local connections.

### N10: Following the Crowd

- [ ] Give each person a private clue and show earlier people's choices. Ask each
  person to decide in sequence, then reveal all the clues after the round.
- [ ] Compare seeing previous choices with seeing the clues behind those choices.
  Let an early misleading clue lead the group toward the wrong answer.
- [ ] Explain an **information cascade** as a situation where earlier choices
  lead later people to make the same choice regardless of their own private clue.
- [ ] Expert extension: display the beliefs behind each decision, explain which
  information is counted, and avoid treating copied choices as independent clues.

Preparation: P07–P09. Connect to Expectations and Common Knowledge while retaining
the distinction between learning from others and merely wanting to match them.

### N11: Can Everyone Prefer Their Own Share?

- [ ] Divide a cake whose flavors people value differently. Then try objects
  that cannot be split and unwanted chores. Let people state their own values.
- [ ] Compare several meanings of fairness using the same allocation. Explain
  **envy-free** as no person preferring another person's share to their own,
  according to that person's preferences.
- [ ] Explain why equal size, equal stated value, and equal burden can disagree.
  Show when the chosen fairness condition cannot be met for indivisible objects.
- [ ] Expert extension: compare formal fairness conditions and assumptions about
  divisibility, reporting, and compensation. Test whether misreporting values helps.

Preparation: P06 and P13. Connect to matching, coalitions, bargaining, and mechanisms.

### N12: Do Sensible Adjustments Settle Down?

- [ ] Let players revise choices simultaneously or one at a time. Compare choosing
  the currently best option, copying neighbors, and adjusting after a mistake.
- [ ] Trace the changes over rounds. Show examples that settle, cycle, or depend
  on starting conditions and the order of updates.
- [ ] Explain **equilibrium** locally as a situation where no player can improve
  their own score by changing their own choice alone while others hold theirs
  fixed. Explain **convergence** as a sequence of updates approaching a stable
  result. A model can have an equilibrium without the selected updates reaching it.
- [ ] Expert extension: compare the conditions under which different update rules
  settle. Keep simulated evidence separate from a mathematical proof.

Preparation: P11–P12 and Equilibrium Explorer. Connect to Expectations and Evolution
Arena, which already implement particular update rules rather than all learning.

## Shared Modeling Tools

### M01: Compare Two Worlds

- [ ] Put two copies of a model side by side and change one assumption at a time.
- [ ] Highlight the changed input, explain why outputs differ, and keep the other
  inputs visible. For random models, allow matching random starting settings so
  the comparison is reproducible; explain how random events are paired.
- [ ] Include cases where the change makes little difference or reverses a result.

### M02: Run Many Trials

- [ ] Show the average, range, and distribution of outcomes over repeated trials.
  A **distribution** describes which results occur and how often they occur.
- [ ] Show individual players' outcomes and unusual runs, not just a group average.
- [ ] Label exact calculations separately from sampled simulations. Explain that
  an observed minimum or maximum is not necessarily a theoretical limit.
- [ ] Keep random runs reproducible and show the number of trials. Reproducible
  means the same stated settings can produce the same run again.

### M03: Find Where the Conclusion Changes

- [ ] Vary a cost, probability, reward, or other input over a range and identify
  where the preferred choice changes. Define every axis and unit.
- [ ] Show ties and boundary cases. Distinguish a mathematically calculated
  threshold from an approximate turning point found by trying many settings.
- [ ] Offer a “How much would this assumption need to change?” question after
  each recommendation.

### M04: Challenge the Model

- [ ] Ask what was omitted, whose goals are represented, and what observations
  could support or contradict the explanation.
- [ ] Make every programmed opponent's rule inspectable in plain language.
- [ ] Distinguish a result following from chosen rules from a claim about actual
  people. A simulation shows the consequences of its assumptions; its output
  alone does not establish that those assumptions describe the real world.
- [ ] Explain when a comparison supports a claim within the model and what further
  evidence would be needed to make a claim about a real cause and effect.

## Teaching Support Across the Collection

- [ ] **S02: Guided paths.** Offer an introductory route, a cooperation and
  information route, and a rules and fairness route. Show the next useful lesson
  and relevant refresher without locking access to other experiments.
- [ ] **S03: Prediction questions.** Ask visitors to predict before running a
  model, then explain the result and offer a nearby case that tests the explanation.
- [ ] **S04: Classroom pair play.** Provide a short two-person activity with cards
  or counters before revealing the model's analysis. Distinguish role instructions
  and private information from the shared rules.
- [ ] **S05: Consistent lesson layers.** Start with a familiar example, then the
  interactive activity, a pre-algebra walkthrough, and an optional expert section.
  Explain vocabulary within definitions so one unfamiliar term does not depend
  on several unexplained terms.
- [ ] **S06: Accessible explanations and controls.** Support keyboards, labeled
  controls, visible focus, readable contrast, reduced motion, and a text or table
  alternative for charts. Do not rely on color, hovering, or animation alone.
- [ ] Keep definitions beside advanced symbols and use **“In words:”** for their
  spoken readings. Avoid dash separators that can resemble mathematical operators.
- [ ] Keep examples, live model values, and formal formulas consistent. Define
  what each letter means in the local example even if it appears in the math guide.

## C01: Design a Shared Community Space

- [ ] Build a capstone in which a group plans a small shared space with limited
  room, time, and resources. A **capstone** is a final activity combining earlier
  lessons in one problem.
- [ ] Let participants state different preferences, allocate space, negotiate
  trades, choose funding rules, and select a voting or allocation method.
- [ ] Test what happens when a participant changes behavior, misreports a preference,
  declines to contribute, or has a different outside option.
- [ ] Compare each person's outcome, resource use, and explicitly chosen fairness
  criteria. Explain conflicts between criteria rather than declaring one universal
  winner from a single combined score.
- [ ] Finish with a short explanation of the chosen rules, their assumptions, and
  one change that would make the group reconsider them.

Start with a small fixed example so readers can inspect every consequence. Add
custom scenarios only after that example is understandable and verified. Link
back to public goods, bargaining, voting, matching, coalitions, and mechanisms.

## Implementation and Completion Notes

Use the existing Jekyll layout, catalog, experiment includes, isolated model
modules, and scoped styles described in the [README](../README.md#game-theory-playground).
Reuse the current `math: true` integration. Preserve existing permalinks and
GitHub Pages compatibility. New lesson pages should follow the existing large,
uncropped hero-image treatment and [artwork guidance](../docs/artwork/game-theory-heroes.md).

For each implemented lesson or modeling tool:

1. Define the reader's learning outcome and a concrete readiness or prediction
   check. Identify the prerequisite refresher links it actually needs.
2. Write the rules, score meanings, information available to each player,
   tie handling, and limitations before implementing the interactive model.
3. Keep one hand-checkable small example. Test meaningful mathematical properties,
   boundary cases, and settings validation; check the interaction and accessibility.
4. Run `bundle exec jekyll build` and the model/browser checks appropriate to the
   changed behavior. Document any remaining limitation honestly.
5. Update this file with the item's status and a link to its implementation and
   relevant validation evidence. Distinguish **implemented locally**, **validated**,
   and **published**; a successful build alone does not demonstrate publication.
6. Recheck the recommended order after each group. Preserve unfinished ideas,
   and explain deliberate deferrals so a later session can resume coherently.

### Progress Record

| Date | Item | Status and Evidence |
| --- | --- | --- |
| September 27, 2026 | Existing twenty-experiment collection | Published baseline; current inventory is in `_data/game_theory.yml`. Deployment: [GitHub Actions run 36370421341](https://github.com/TedTschopp/tedt.org/actions/runs/36370421341). |
| September 27, 2026 | This roadmap | Planning recorded. P01–P13, N01–N12, M01–M04, S01–S06, and C01 remain planned. |

## Sources to Consult While Developing Lessons

These references support mathematical coverage and examples. The beginner
sequence and interface activities above are proposals for this site, not a claim
that these sources prescribe a junior-high curriculum.

- [OpenStax Prealgebra](https://openstax.org/books/prealgebra/pages/preface):
  reference for small arithmetic and pre-algebra steps and worked examples.
- [MIT Economic Applications of Game Theory lectures](https://ocw.mit.edu/courses/14-12-economic-applications-of-game-theory-fall-2025/video_galleries/video-lectures/):
  reference for representation, dominance, equilibrium, sequential decisions,
  bargaining, repeated games, and private information.
- [Stanford Game Theory course syllabus](https://web.stanford.edu/~jacksonm/gtocsyllabus.pdf):
  reference for checking broad game-theory coverage.
- [Cornell network adoption chapter](https://www.cs.cornell.edu/~rafael/networks-html/chapter5.html)
  and [information cascades chapter](https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book-ch16.pdf):
  references for local connections, diffusion, and learning from earlier choices.
- [George Akerlof on the market for lemons](https://www.nobelprize.org/prizes/economic-sciences/2001/akerlof/article/):
  primary explanation of hidden quality and market participation.
- [Carnegie Mellon course on fair division](https://www.cs.cmu.edu/~arielpro/15896s16/schedule.html):
  reference for distinctions among fair-division settings and criteria.
