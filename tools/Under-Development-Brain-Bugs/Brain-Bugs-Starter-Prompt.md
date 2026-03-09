# Website Implementation Brief: Brain Bugs

## 1) Project goal

Build a simple, visual, content-first educational website called **Brain Bugs**.

The site teaches people with roughly a **middle school reading level** how human thinking can go wrong. The site should cover:

- logical fallacies
- cognitive biases
- heuristics
- cognitive distortions
- rhetorical manipulation techniques
- statistical and probability errors
- decision-making traps
- social perception errors
- narrative and meaning errors
- metacognitive illusions

Use **Brain Bugs** as the main brand and **thinking errors** or **thinking traps** as the plain-English umbrella terms.

The site should help users quickly understand:
1. what the error means
2. what it sounds like
3. where it shows up
4. why people fall for it
5. how to spot it
6. what a better response looks like

The site should feel practical, friendly, and easy to browse.

---

## 2) Brand and positioning

### Site name
**Brain Bugs**

### Tagline options
Pick one and use it consistently:
- Spot the bugs in how we think
- Learn the thinking traps people fall into
- Find the bugs in bad reasoning

### Core promise
Brain Bugs makes tricky ideas simple. It teaches users how to notice bad reasoning, brain shortcuts, persuasion tricks, and decision errors in school, work, stories, and daily life.

---

## 3) Target audience

Primary audience:
- people with a middle school education
- curious learners
- students, parents, and adults who want simple explanations
- users who may be put off by jargon

Audience needs:
- short sentences
- common words
- clear headings
- concrete examples
- low reading load
- calm, non-judging tone

Reading level rules:
- aim for grade 6 to 8 readability
- define new terms right away
- prefer short paragraphs, usually 2 to 4 sentences
- explain technical terms in plain English
- use examples from school, work, family, shopping, sports, online life, and stories

Tone:
- friendly
- smart but simple
- curious
- respectful
- never mocking
- always remind users that everyone gets brain bugs sometimes

---

## 4) Information architecture

### Primary navigation
- Home
- Start Here
- Topics
- Practice
- Stories
- Real Life
- Glossary
- About

Include search in the header.

### Main route structure
- `/`
- `/start-here`
- `/topics`
- `/topics/[category-slug]`
- `/errors/[error-slug]`
- `/practice`
- `/practice/quizzes`
- `/practice/flashcards`
- `/practice/spot-the-bug`
- `/practice/scenario-lab`
- `/stories`
- `/stories/[theme-or-work-slug]`
- `/real-life`
- `/real-life/classrooms`
- `/real-life/business`
- `/real-life/everyday-life`
- `/glossary`
- `/about`
- `/search`
- `/compare/[comparison-slug]`

### Content architecture rules
- Every error gets its own canonical page under `/errors/[error-slug]`
- Every error belongs to one primary category
- Errors may also have secondary categories and aliases
- Every error page must link to related errors and comparison pages
- Keep the **Featured Examples** content block on the homepage and category pages
- Also include a **Featured Example** section on each error page

---

## 5) Navigation and labeling strategy

Lead with plain language, then show technical terms.

Examples:
- **Argument Mistakes** — Logical Fallacies
- **Brain Shortcuts** — Cognitive Biases and Heuristics
- **Thought Distortions** — Cognitive Distortions
- **Persuasion Tricks** — Rhetorical Manipulation
- **Number Mistakes** — Statistical Errors
- **Decision Traps** — Decision-Making Errors
- **People Mistakes** — Social Perception Errors
- **Story Traps** — Narrative Errors
- **Self-Knowledge Traps** — Metacognitive Illusions

On error pages:
- main heading = simple title
- subtitle = technical term or category label

Example:
- **Attacking the Person**
- Ad Hominem

---

## 6) Core content strategy

The site is a **teaching site first** and a **reference site second**.

Every page should answer:
- What is this?
- What does it sound like?
- Where does it show up?
- Why do people do this?
- What should I do instead?

### Main content types
1. Foundational pages
2. Category hub pages
3. Individual error pages
4. Comparison pages
5. Practice pages
6. Story and fiction pages
7. Glossary entries

### Editorial rules
- Use the phrase **Brain Bug** often, especially for beginners
- Use examples before nuance
- Avoid dense academic intros
- Do not default to political examples
- Prefer school, work, family, shopping, sports, online posts, and fiction
- Distinguish between honest mistakes and manipulative tactics
- Show that some heuristics are useful shortcuts, not always bad
- Keep examples relatable and neutral

---

## 7) Required page templates

## A) Home page template

Sections in this order:

1. Hero
   - headline with Brain Bugs
   - one-line explanation
   - CTA buttons: Start Here, Try Practice

2. What is a Brain Bug?
   - short, plain-English explanation

3. Choose your path
   - Learn the basics
   - Browse topics
   - Practice spotting bugs
   - See stories and real-life examples

4. Topic grid
   - cards for all major categories

5. **Featured Examples**
   - keep this section
   - show 3 to 6 featured error cards with short, relatable examples

6. Quick comparisons
   - Fallacies vs Biases
   - Biases vs Heuristics
   - Sunk Cost vs Escalation of Commitment

7. Practice CTA

8. Footer

## B) Start Here page template

Sections:
1. What Brain Bugs Are
2. The easiest differences to learn first
3. Why everyone gets them sometimes
4. Beginner learning path
5. Most common bugs to learn first
6. Link to practice

## C) Category hub page template

Sections:
1. Category title
2. Plain-English explanation
3. Why this category matters
4. How it differs from nearby categories
5. Featured error cards
6. Common warning signs
7. Quick examples
8. Beginner-friendly starting points
9. Link to practice
10. Related comparison pages

## D) Error page template

Every error page must use this exact teaching structure.

1. Page title
   - simple title first
   - technical title second

2. One-line definition
   - 12 to 22 words

3. In plain English
   - 80 to 140 words

4. **Featured Example**
   - one strong scenario that makes the idea click fast
   - format as a highlighted card or quote-style mini story

5. **What this sounds like in Classrooms**
   - 2 to 4 short example lines
   - examples from teachers, students, assignments, group projects, debates, homework, or school discussions

6. **What this sounds like in Business**
   - 2 to 4 short example lines
   - examples from meetings, leadership, hiring, planning, sales, team conflict, roadmaps, or office politics

7. **What this sounds like in Real Life**
   - 2 to 4 short example lines
   - examples from family, shopping, social media, friendship, sports, health, or everyday decisions

8. **Examples from Literature or Fiction**
   - 2 to 4 examples
   - use short summaries of scenes, character behavior, or plot moments
   - prefer public-domain works, myths, fairy tales, fables, Shakespeare, classic novels, and widely known fictional stories
   - when using modern copyrighted works, summarize in original words and do not include long quotes
   - include why the example fits the error

9. Why people fall for it
   - simple explanation of the psychology or social pressure

10. How to spot it
   - 3 to 5 warning signs

11. What to say instead
   - 2 to 4 calm response tips
   - show better questions or better wording

12. Common confusion
   - “People mix this up with...”
   - link to related errors

13. Mini practice
   - one short question
   - answer
   - brief explanation

14. Remember this
   - one short takeaway sentence

15. Related Brain Bugs
   - 3 to 6 links

## E) Comparison page template

Sections:
1. Two concepts side by side
2. Main difference in one sentence
3. Simple comparison table or cards
4. Example where people confuse them
5. Quick memory trick
6. Links to full pages

## F) Practice page template

Sections:
1. Instructions
2. 5 to 10 scenario cards
3. Multiple-choice answers
4. Instant feedback
5. Short explanation
6. Link to the related error page

## G) Stories hub template

Purpose: collect literature and fiction examples across the site.

Sections:
1. Intro to how Brain Bugs show up in stories
2. Browse by story source
   - myths and legends
   - fairy tales
   - Shakespeare
   - classic novels
   - detective fiction
   - science fiction and fantasy
3. Browse by error
4. Featured story examples
5. Links back to error pages

## H) Glossary template

- A–Z list
- instant search
- one-line definitions
- support aliases and alternate names
- click through to the full error page

---

## 8) Required sections for every error page

Do not skip these. Every error page must include all of them:

- one-line definition
- plain-English explanation
- Featured Example
- What this sounds like in Classrooms
- What this sounds like in Business
- What this sounds like in Real Life
- Examples from Literature or Fiction
- why people fall for it
- how to spot it
- what to say instead
- common confusion
- mini practice
- remember this
- related errors

---

## 9) Initial content inventory

Create canonical pages for the following.

### Logical Fallacies
- Attacking the Person (Ad Hominem)
- Straw Man
- Appeal to Authority
- False Dilemma
- Slippery Slope
- Circular Reasoning
- False Cause (Post Hoc Ergo Propter Hoc)
- Red Herring
- Bandwagon Fallacy
- Appeal to Emotion
- Hasty Generalization
- No True Scotsman
- Tu Quoque
- Composition Fallacy
- Division Fallacy

### Cognitive Biases
- Confirmation Bias
- Anchoring Bias
- Dunning–Kruger Effect
- Overconfidence Bias
- Status Quo Bias
- Loss Aversion
- Survivorship Bias
- Halo Effect
- Fundamental Attribution Error
- Self-Serving Bias
- Recency Bias
- Framing Effect
- Optimism Bias
- Groupthink
- In-Group Bias
- Negativity Bias
- Projection Bias
- Illusory Correlation
- Moral Licensing
- Just-World Hypothesis
- False Consensus Effect

### Heuristics
- Availability Heuristic
- Representativeness Heuristic
- Affect Heuristic
- Recognition Heuristic
- Scarcity Heuristic

### Cognitive Distortions
- Black-and-White Thinking
- Catastrophizing
- Mind Reading
- Emotional Reasoning
- Personalization
- Overgeneralization

### Rhetorical Manipulation Techniques
- Loaded Language
- Appeal to Fear
- Appeal to Pity
- Whataboutism
- Moving the Goalposts
- Gish Gallop

### Statistical and Probability Errors
- Base Rate Neglect
- Law of Small Numbers
- Regression to the Mean
- Correlation vs. Causation
- Texas Sharpshooter Fallacy
- Simpson’s Paradox
- Gambler’s Fallacy

### Decision-Making Traps
- Sunk Cost Fallacy
- Escalation of Commitment
- Planning Fallacy
- Decision Fatigue
- Choice Overload
- Endowment Effect
- IKEA Effect

### Social Perception Errors
- Stereotyping
- Outgroup Homogeneity Bias
- Actor–Observer Bias
- Authority Bias
- Conformity Bias
- Social Proof Bias

### Narrative and Meaning Errors
- Narrative Fallacy
- Hindsight Bias
- Outcome Bias
- Illusion of Explanatory Depth
- Patternicity

### Metacognitive Illusions
- Illusion of Knowledge
- Illusion of Control
- Curse of Knowledge
- Fluency Illusion

### Aliases and redirects
Use aliases or redirects for:
- Appeal to Popularity -> Bandwagon Fallacy
- Post Hoc Ergo Propter Hoc -> False Cause
- Personal Attack -> Ad Hominem
- All-or-Nothing Thinking -> Black-and-White Thinking

---

## 10) Content model

Use structured content in JSON, YAML, or MDX with frontmatter.

Each error should support fields like this:

```json
{
  "id": "ad-hominem",
  "slug": "ad-hominem",
  "simpleTitle": "Attacking the Person",
  "technicalTitle": "Ad Hominem",
  "primaryCategory": "logical-fallacies",
  "secondaryCategories": [],
  "aliases": ["personal attack"],
  "shortDefinition": "Attacking the person instead of answering the argument.",
  "plainEnglish": "Explain the idea in simple language.",
  "featuredExample": {
    "title": "Group project argument",
    "summary": "A student ignores the idea and insults the classmate who said it."
  },
  "soundsLikeClassrooms": [
    "You only think that because you're the teacher's favorite.",
    "Why should we listen to him? He got a bad grade last time."
  ],
  "soundsLikeBusiness": [
    "Ignore her plan. She has only been here six months.",
    "That idea is weak because it came from the sales team."
  ],
  "soundsLikeRealLife": [
    "Don't listen to him about budgeting. He buys dumb stuff.",
    "Her opinion on health doesn't count because she looks tired."
  ],
  "fictionExamples": [
    {
      "source": "A public-domain novel, myth, fairy tale, or other story",
      "summary": "Short paraphrase of the scene",
      "whyItFits": "Explain why this is an example of the error"
    }
  ],
  "whyItHappens": "Simple explanation of why people use or believe it.",
  "warningSigns": [
    "The speaker gets attacked instead of the point.",
    "The original claim is ignored."
  ],
  "responseTips": [
    "Bring the discussion back to the claim.",
    "Ask for evidence about the idea itself."
  ],
  "confusedWith": ["straw-man", "appeal-to-emotion"],
  "relatedErrors": ["red-herring", "tu-quoque"],
  "difficulty": "beginner",
  "featured": true,
  "glossaryDefinition": "A personal attack used instead of a real answer."
}
````

Each category should support:

* slug
* simple title
* technical title
* intro
* why it matters
* common signals
* featured errors
* beginner errors
* related comparison pages

---

## 11) Search and findability

Search must work with:

* technical terms
* simple terms
* aliases
* phrase-based intent

Examples:

* “attacking the person” -> Ad Hominem
* “everyone agrees so it must be true” -> Bandwagon Fallacy or Social Proof Bias
* “I already spent money on it” -> Sunk Cost Fallacy
* “I can remember one example so it must happen a lot” -> Availability Heuristic

Users must be able to find pages from:

* header navigation
* topics
* glossary
* search
* related links
* practice feedback
* comparison pages
* stories hub

---

## 12) UX and design requirements

Build a clean, mobile-first site.

### UX rules

* large readable type
* short paragraphs
* strong heading hierarchy
* cards instead of long text walls
* breadcrumbs on error pages
* sticky or easy-to-find search
* clear beginner path from Home and Start Here
* strong internal linking

### Visual strategy

Use:

* icons
* simple illustrations
* quote boxes
* example cards
* warning sign callouts
* “Remember this” boxes
* badges for Classroom, Business, Real Life, and Fiction

Avoid:

* dense textbook layouts
* cluttered dashboards
* overly abstract visuals
* giant blocks of text

### Accessibility rules

* semantic HTML
* keyboard-friendly navigation
* strong color contrast
* descriptive link labels
* alt text
* visible focus states
* no color-only meaning
* large mobile tap targets

---

## 13) Reusable components

Create reusable components for:

* SiteHeader
* SiteFooter
* SearchBar
* Breadcrumbs
* HeroBlock
* CategoryCard
* ErrorCard
* ComparisonCard
* DefinitionBox
* FeaturedExampleCard
* SoundLikeSection
* FictionExampleCard
* WarningSignsList
* ResponseTipsBox
* RelatedErrorsRail
* PracticeQuestion
* QuizResultFeedback
* GlossaryList
* CTASection

---

## 14) Learning paths

Create guided learning paths.

### Path 1: Spot bad arguments

* Ad Hominem
* Straw Man
* False Dilemma
* Red Herring
* Appeal to Emotion

### Path 2: Understand brain shortcuts

* Confirmation Bias
* Anchoring Bias
* Availability Heuristic
* Framing Effect
* Loss Aversion

### Path 3: Make better decisions

* Sunk Cost Fallacy
* Planning Fallacy
* Decision Fatigue
* Choice Overload
* Endowment Effect

### Path 4: Avoid being fooled at work or online

* Loaded Language
* Whataboutism
* Gish Gallop
* Bandwagon Fallacy
* Social Proof Bias

### Path 5: Think better with numbers

* Correlation vs. Causation
* Base Rate Neglect
* Law of Small Numbers
* Gambler’s Fallacy
* Simpson’s Paradox

### Path 6: See Brain Bugs in stories

* Hindsight Bias
* Narrative Fallacy
* Tragic overconfidence examples
* Misjudgment in myths and fairy tales
* Deception and manipulation in fiction

---

## 15) Content rules for literature and fiction examples

This requirement is important.

For every error page:

* include 2 to 4 fiction or literature examples
* prioritize clear, well-known stories
* prefer public-domain sources when possible
* use paraphrase and scene summary, not long direct quotes
* explain why the scene is a match
* keep examples readable for a young audience

Good source pools:

* Aesop’s fables
* Greek myths
* fairy tales
* Shakespeare
* Sherlock Holmes
* Dracula
* Frankenstein
* Alice in Wonderland
* Pride and Prejudice
* Moby-Dick
* The Wizard of Oz
* public-domain children’s literature
* well-known fictional archetypes summarized in original words

---

## 16) Recommended build approach

Preferred stack:

* Make this a Static site built with a static site generator Jekyll.
* Build the "homepage" here:
  /Users/tedtschopp/Developer/tedt.org/tools/Brain-Bugs/
* Make sure the incluides, templates and data files are reusable and scalable to generate all the category and error pages from the same content model.
* Use the same content model and templates to generate the comparison pages, practice pages, and Stories hub pages.
* Use the same route structure as outlined in the brief.
* Make sure the includes, templates and data files all start with bb- to avoid confusion with other projects.
* Use the same content model and templates to generate the glossary entries from the same error data files, so that every error page has a matching glossary entry.
* Use Jekyll's built-in support for markdown content files, data files, and reusable includes and layouts to build the site.
* Use Jekyll's collection feature to manage the error pages and category pages, so that new pages can be added by simply adding new markdown files with the correct frontmatter.
* Use Jekyll's Liquid templating language to create reusable components and templates that can be used across the site, ensuring consistency and scalability.
 
This is a content-first system. It should scale from dozens to hundreds of error pages without redesigning the site.

---

## 17) Implementation phases

### Phase 1: Foundation

Build:

* global layout
* navigation
* homepage
* Start Here page
* Topics hub
* Glossary
* About
* category template
* error template
* Stories hub
* search shell

### Phase 2: Core category pages

Build all major category hub pages.

### Phase 3: Seed content

Create at least these first:

* Ad Hominem
* Straw Man
* False Dilemma
* Red Herring
* Bandwagon Fallacy
* Confirmation Bias
* Anchoring Bias
* Availability Heuristic
* Framing Effect
* Loss Aversion
* Sunk Cost Fallacy
* Planning Fallacy
* Loaded Language
* Whataboutism
* Correlation vs. Causation
* Base Rate Neglect
* Hindsight Bias
* Black-and-White Thinking
* Groupthink
* Social Proof Bias

Every seed page must include:

* Featured Example
* sounds like in Classrooms
* sounds like in Business
* sounds like in Real Life
* fiction/literature examples

### Phase 4: Full library

Generate the rest of the error pages from the same schema.

### Phase 5: Practice and compare

Build:

* quizzes
* flashcards
* spot-the-bug
* scenario lab
* comparison pages

### Phase 6: QA and polish

Check:

* reading level
* consistent tone
* mobile design
* internal linking
* alias resolution
* search quality
* fiction examples clarity
* no orphan pages

---

## 18) Acceptance criteria

The build is successful if:

1. A new user can understand the difference between a fallacy and a bias in under 2 minutes.
2. Every error page includes:

   * simple definition
   * plain-English explanation
   * Featured Example
   * What this sounds like in Classrooms
   * What this sounds like in Business
   * What this sounds like in Real Life
   * Examples from Literature or Fiction
   * warning signs
   * response tips
   * mini practice
   * related links
3. Featured Examples appear on the homepage and category pages.
4. Every error is reachable from search, glossary, and at least one category page.
5. Aliases resolve correctly.
6. The site works well on mobile.
7. The language remains readable for a middle school audience.
8. Fiction examples are paraphrased clearly and not buried in literary jargon.
9. There are no orphan pages.

---

## 19) What to output when implementing this brief

When executing this brief, produce:

1. the folder and route structure
2. the content schema
3. the data files for categories and errors
4. the reusable page templates
5. the homepage copy
6. the Start Here page copy
7. one complete category hub page
8. five complete error pages as examples
9. one comparison page
10. one practice page
11. one Stories hub page
12. a scalable method to generate the remaining pages from structured data

Do not use lorem ipsum.
Do not make the tone academic.
Do not skip the classroom, business, real-life, or fiction sections.
Do not remove the Featured Examples sections.
Build for clarity, scanning, and learning.