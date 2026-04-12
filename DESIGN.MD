# Design System Document: The Working Library Framework

## 1. Overview & Creative North Star: "The Public Workbench"

This design system is built to make tedt.org feel like a personal publication
with a working lab attached. Our Creative North Star, **"The Public
Workbench,"** rejects both the generic blog template and the polished SaaS
dashboard. It should feel like a serious independent website where essays,
prompts, presentations, maps, projects, and browser-based tools live side by
side as one coherent body of work.

To break the "template" look, we use **editorial shelving**. Category pages
behave like shelves in a library. Each shelf is introduced with a strong title,
a short deck, a lead visual, and a group of cards that can be scanned quickly.
The site should feel curated rather than auto-generated: images are purposeful,
summaries are concise, tags are visible, statuses are explicit, and dates
matter.

The emotional target is not "premium product." It is **trusted craft**. tedt.org
should feel thoughtful, maintained, useful, and personal—more like an
architect’s notebook and tool cabinet than a marketing site.



## 2. Colors & Surface Philosophy

The palette is anchored in tedt.org’s production colors: warm off-white
`#F8F6F0`, slate-black `#101820`, deep primary blue `#00446F`, secondary orange
`#E86027`, utility cyan `#00A9E0`, and default category accents that can move
from cyan `#06B6D4` into violet `#A78BFA`.

### The "Paper & Slate" Rule
**Explicit Instruction:** Light mode should feel like a warm reading surface,
not a sterile blank canvas. Dark mode should feel like slate, not absolute
black. The site is for reading and browsing; comfort matters more than sterile
purity.

### The "Blue Backbone" Rule
The primary blue is the structural color of the system. Use it for links,
selected states, navigation emphasis, architectural UI, and practical actions.
Orange and cyan are supporting accents, not the main field. They should energize
the interface without destabilizing it.

### Surface Hierarchy & Theme Behavior
Treat the interface as a stack of readable surfaces:

- **Base Layer:** `page` — the reading field.
- **Section Layer:** `section` — category groups, archives, and major content
  bands.
- **Card Layer:** `card` — posts, tools, prompts, presentations, and project
  summaries.
- **Utility Layer:** `panel` — filters, sort controls, metadata blocks, and side
  utilities.
- **Accent Layer:** `accent` — links, active filters, badges, underlines, and
  status treatments.

### The "Category Accent" Rule
tedt.org’s strongest decorative move is not a giant panel or a glossy
background. It is the **category accent**: a restrained badge, a gradient
underline, or a focused accent strip that frames the content without
overwhelming it. Use gradients as identity markers, not as full-page decoration.

### The "Border with Intent" Rule
Borders are allowed, but only when they organize. Use them lightly for cards,
tool panels, and utility controls. Never let the interface turn into a box farm.
Spacing, imagery, typography, and badge accents should do most of the
compositional work.



## 3. Typography: Editorial Precision

Typography on tedt.org must support two modes at once: long-form reading and
fast catalog scanning.

* **Body & UI (Inter):** Inter is the engine of the site. Use it for body copy,
  summaries, labels, tags, dates, status text, and tool metadata. Body copy
  should feel generous and readable, around a comfortable editorial rhythm
  rather than a cramped application UI.
* **Headlines & Titles (Cal Sans / Titillium Web / Optima-led stack):** Page
  titles, category headings, and major content names should feel confident and
  composed. They should have enough personality to distinguish tedt.org from a
  generic framework site, but they must remain highly legible.
* **Display Moments (Homepage / Landing Use Only):** Condensed and
  display-driven typography—such as the site’s more dramatic homepage display
  faces—should appear only in special moments like hero treatments or major
  section intros. Display typography is punctuation, not the default voice.

**Hierarchy Tip:** Use a strong title, a short one- or two-sentence deck, and
then a calm metadata row. That is the core tedt.org rhythm: idea first,
explanation second, operational context third.

**Tone Tip:** Headings may be expressive, but body text must remain disciplined.
If typography ever feels louder than the writing or the tool description, it is
wrong.



## 4. Elevation & Depth: Editorial Layering

tedt.org does not need theatrical depth. It needs **organized depth**.

* **The Shelf Principle:** Sections should feel like curated shelves. A category
  header introduces the topic; cards beneath it provide browsable entries into
  the work.
* **The Card Principle:** Cards are the main structural unit. They create order
  through image, title, summary, metadata, and action—not through excessive
  visual effects.
* **The Image Principle:** Imagery carries much of the site’s emotional tone.
  Let thumbnails and lead images do that work. The UI around them should stay
  restrained and readable.
* **The Metadata Principle:** Status, update dates, tags, and provider markers
  are not trivia. They are part of the reading experience and should remain
  visible.
* **The Shadow Principle:** Use subtle lift only. A light shadow or gentle
  border can separate a card from the field, but nothing should float like a
  mobile app mockup or a glass panel.
* **The Motion Principle:** Hover and focus states should sharpen clarity, not
  perform spectacle. Slight lift, stronger underline, clearer border, or firmer
  color contrast is enough.

The final effect should feel like an ordered archive of live work: written
material, active utilities, evolving prompts, and durable references all sitting
within one coherent visual language.



## 5. Components

### Content Cards (The Core Component)
- **Base:** Lead image, title, short summary, metadata, and linked destination.
- **Purpose:** These cards unify blog entries, category pages, and mixed-content
  shelves.
- **Interaction:** On hover, increase clarity with modest lift, stronger title
  emphasis, or a firmer border.
- **Priority:** The title and summary always outrank ornamental treatment.

### Tool Cards
- **Base:** Thumbnail, tool name, concise functional description, status,
  updated date, and action row.
- **Status Vocabulary:** Use explicit labels such as `ACTIVE`, `BETA`,
  `MAINTAINED`, `PROTOTYPE`, and `ARCHIVED`.
- **Action Row:** Use direct actions such as `Live`, `Details`, and `Code`.
- **Tone:** Tool cards should feel practical and maintained, not promotional.

### Prompt Cards
- **Base:** Prompt title, short description, topical categories, and provider
  indicators.
- **Browsing Controls:** Sorting, category filters, tag filters, and keyword
  filters should be clear, visible, and text-forward.
- **Provider Treatments:** AI-provider buttons or badges may use brand-specific
  colors, but they should remain secondary to the prompt itself.
- **Tone:** These cards should read like reusable working assets, not novelty
  prompts.

### Presentation Cards
- **Base:** Cover image, title, short abstract, update date, and topic tags.
- **Behavior:** Presentations should inherit tedt.org’s broader visual language
  rather than feeling like a disconnected microsite.
- **Tone:** Executive clarity over slideware flash.

### Category Headers
- **Base:** Category badge, strong title, short deck, optional lead image, and
  an accent underline or thematic separator.
- **Purpose:** These headers orient the reader quickly and set the tone for the
  shelf they are entering.
- **Rule:** Let the category framing be distinctive, but keep the content cards
  consistent underneath.

### Navigation & Theme Controls
- **Primary Navigation:** Keep major destinations visible and compact: Profile,
  Projects, Tools, Presentations, Prompts.
- **Maturity Labels:** Beta and gamma markers are useful when they communicate
  the state of a section. Treat them as product truth, not decoration.
- **Theme Toggle:** Light, system, and dark modes should be visible, simple, and
  fast to understand.
- **Menu Behavior:** Compact, clear, and obvious. No clever hiding of core site
  paths.

### Buttons & Action Links
- **Primary:** Blue-led, direct, and utilitarian.
- **Secondary:** Quiet outline or low-emphasis treatments for filter resets,
  details, or supporting actions.
- **Tertiary:** Plain text links are acceptable when context is obvious.
- **Link Affordance:** Links should remain obviously link-like. Underlines are a
  feature, not a flaw, when they help clarity.
- **Rule:** Use plainspoken labels. tedt.org actions should sound like tools,
  not advertisements.

### Filters, Tags, and Sort Controls
- **Structure:** Let tags wrap. Dense filters are acceptable if they remain
  readable.
- **Language:** Prefer explicit controls like `Reset filter`, `Clear Filters`,
  `Newest first`, or `Alphabetical`.
- **Behavior:** Filtering should feel immediate and mechanical, like working
  with an index.

### Metadata Rows
- **Base:** Date, status, category, tags, and related markers.
- **Purpose:** Metadata should help the user decide what to read, open, or trust
  next.
- **Rule:** Do not bury update dates or content state beneath interaction.

### Cards & Lists
- Use spacing and repeated card anatomy to create rhythm.
- Divider lines are acceptable when they support dense utility layouts, but
  never let them become the dominant visual language.
- In mixed shelves, keep image aspect ratios and metadata placement consistent
  enough that scanning feels easy.



## 6. Do's and Don'ts

### Do
- **Do** treat tedt.org like a living library of essays, tools, prompts,
  presentations, and experiments.
- **Do** make freshness, status, and content type visible.
- **Do** let imagery and strong summaries carry much of the site’s character.
- **Do** use the deep blue as the structural UI color and reserve brighter
  accents for emphasis.
- **Do** allow category pages to have personality through badges, accent
  gradients, and imagery.
- **Do** support both deep reading and fast scanning.
- **Do** let special landing pages use more expressive display typography, while
  keeping article and archive pages calmer.

### Don't
- **Don't** make the site feel like a SaaS admin dashboard, startup landing
  page, or generic theme demo.
- **Don't** hide dates, statuses, or metadata that help readers judge freshness
  and maturity.
- **Don't** overuse gradients, glassmorphism, or oversized shadows.
- **Don't** let buttons or controls sound promotional.
- **Don't** flatten essays, tools, prompts, and presentations into one
  indistinguishable card treatment.
- **Don't** use pure white or pure black as the dominant reading field when
  softer production tones are available.
- **Don't** let decorative typography overwhelm the writing.

The test is simple: if the page feels like a trustworthy place to read, think,
browse, and use real tools, it belongs on tedt.org. If it feels like a product
landing page, a UI trend exercise, or a content farm, it has failed the brief.