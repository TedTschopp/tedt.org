# Brain Bugs Image Brief

Here’s the first-pass direction I’d give an artist.

Brain Bugs reads as a teaching-first, content-first site: plain-English explanations, low reading load, short real-life scenes, practice-oriented learning, and a repeated non-shaming message about noticing the bug sooner. It moves across classrooms, business, everyday life, literature, comparison guides, and practice exercises, so the visuals need to teach as much as decorate. ([Ted Tschopp's Homepage][1])

Because the site already spans 83 lessons, 10 comparison guides, and 5 quiz sets across multiple families of thinking traps, the art direction needs to scale as a system rather than as a pile of one-off illustrations. ([Ted Tschopp's Homepage][2])

My recommendation is a **Warm Editorial Field Guide** style.

Think of it as editorial illustration crossed with a visual spotting guide: calm, smart, pattern-driven, and a little playful, but never goofy. The image should help the viewer see the mistake faster, not just make the page prettier.

**The look**
Use simplified editorial illustration rather than photorealism. Medium detail. Clear silhouettes. Soft geometry. Restrained linework. Light texture or paper grain so it feels crafted rather than sterile. The overall feel should be modern, human, and readable at a glance.

**How the “bug” should appear**
Do not make the whole system depend on literal insects. That can get juvenile or gross fast. The stronger move is to treat the “bug” as a visual distortion: a shadow, overlay, misaligned label, warped perspective, sticky annotation, false spotlight, echo, mirror, or subtle symbolic creature used sparingly. In other words: scene first, metaphor second, mascot a distant third.

**Composition rule**
Each image should do one teaching job: **one scene, one trap, one visual twist**. The viewer should understand the social situation first, then notice the distortion that reveals the reasoning problem.

**People and scenes**
Keep the art human-centered. Use classrooms, meetings, shopping decisions, family conversations, online discussions, and story-inspired moments. Since the site explicitly teaches across real life and literature, I would keep one core illustration language and only vary the setting cues, not the whole style. ([Ted Tschopp's Homepage][3])

**Color direction**
Because I’m basing this more on the site’s voice than on its CSS, I’d treat color as part of the proposed art system. I’d go with warm paper tones, ink/navy, slate, muted teal, moss, amber, coral, and plum. Keep saturation moderate. Let accent colors signal category families instead of making every piece loud.

**Comparison pages**
Use split compositions, mirrored poses, before/after framing, opposing arrows, or two nearly identical scenes with one crucial difference. These pages are about fast distinction, so the image should work almost like a visual syllogism.

**Practice and quiz graphics**
Go simpler and bolder than the hero art. Strong silhouette, fewer objects, instant legibility at thumbnail size.

**Story pages**
Keep the same base style, but add gentle storybook or theatrical cues—framing, props, silhouette language, period hints, mythic symbols—rather than switching into full fantasy painting.

**What to avoid**
Avoid glossy 3D brains, neuron/circuit imagery, horror-bug visuals, meme faces, sarcastic caricature, stock-photo corporate realism, or dense infographic clutter. The site’s tone is calmer and more teacherly than that. ([Ted Tschopp's Homepage][1])

One extra note: elsewhere on tedt.org, your article art appears more painterly and cinematic. I’d only borrow a little of that warmth here. Brain Bugs wants more diagrammatic clarity and repeatability than those article-cover images.

Operationally, I’d split the art system into three asset families: richer section heroes, repeatable lesson spot illustrations, and ultra-simple comparison/practice graphics. That maps well to the site’s mix of topic pages, lesson pages, comparison guides, and practice modes. ([Ted Tschopp's Homepage][2])

Here’s a copy-paste brief you could hand to artists:

> Create a cohesive illustration system for **Brain Bugs**, an educational site about fallacies, biases, heuristics, decision traps, and other thinking errors. The style should feel like a **warm editorial field guide**: clear, modern, intelligent, calm, and slightly playful. Use simplified human-centered scenes with subtle visual metaphors that reveal the reasoning error. Show everyday settings such as classrooms, offices, shopping, family discussion, online conversation, and literature-inspired scenes. The “bug” should usually appear as a symbolic distortion, overlay, shadow, or small motif—not as a dominant literal insect. Keep compositions simple and teachable: one scene, one trap, one visual twist. Use restrained color, light texture, strong silhouettes, and enough negative space for headings or labels. The artwork should help people notice a thinking mistake without making them feel mocked or scolded.

A few example directions:

* **Appeal to Authority**: a student or shopper looking at a giant celebrity endorsement while the actual evidence sits small and ignored nearby.
* **Anchoring Bias**: the first number in a price conversation behaving like a literal anchor dragging the rest of the scene.
* **Narrative Fallacy**: messy facts pinned on a board being forced into a neat straight line or heroic arc.
* **Ad Hominem**: the speaker’s words physically striking the person while the original claim sits untouched in the background.

The questions that would sharpen this the most are:

1. Do you want literal bugs/insects in the artwork at all, or should the “bug” stay abstract and symbolic?
2. Who is the primary audience: adults, teens, teachers/students, or broad general readership?
3. Should Brain Bugs visually match the rest of tedt.org, or work as its own sub-brand?
4. Should the tone lean more professional/editorial or more whimsical/storybook?
5. Which assets matter first: homepage hero images, topic cards, lesson thumbnails, comparison graphics, or social/share images?
6. Do you want me to turn this into a one-page production brief next, with palette, dos/don’ts, and prompt formulas for the artists?

[1]: https://tedt.org/tools/Brain-Bugs/about/ "About"
[2]: https://tedt.org/tools/Brain-Bugs/ "Brain Bugs"
[3]: https://tedt.org/tools/Brain-Bugs/real-life/ "Real Life"

## Homepage Set V1

The Brain Bugs homepage now has a first implemented `set of images` using the five uploaded assets under `tools/Brain-Bugs/images/home/`. These are distinct scenario illustrations, not the same image in multiple aspect ratios.

The set is doing one job: establish that Brain Bugs lives in ordinary human settings where reasoning goes sideways in different ways.

| Slot | File | Usage | Scene focus |
| --- | --- | --- | --- |
| `hero-family-conflict` | `A_family_around_a_dinner_table_is_having_a_tense_d.webp` | Primary homepage hero and share image | Family conflict, competing interpretations, emotional reasoning pressure |
| `hero-business-decision` | `A_group_of_coworkers_in_a_meeting_room_is_deciding.webp` | Supporting homepage image | Meetings, planning pressure, status and urgency cues |
| `hero-online-information` | `A_person_sits_at_a_laptop_or_phone_reading_an_onli_.webp` | Supporting homepage image | Online information, headlines, reactions, premature judgment |
| `hero-shopping-decision` | `A_person_stands_in_a_store_aisle_or_online_shoppin_.webp` | Supporting homepage image | Consumer choice, framing, anchoring, scarcity pressure |
| `hero-classroom-confidence` | `A_student_in_a_classroom_confidently_points_to_the_.webp` | Supporting homepage image | Classroom confidence, overclaiming understanding, authority cues |

### Implementation Notes

* The family dinner scene is the top-level primary image for `/tools/Brain-Bugs/`.
* All five assets are now mapped in homepage front matter through `image_set`.
* Credit fields are intentionally blank for now and should be filled once source/artist attribution is finalized.
* The homepage set can later support template rotation, sectional reuse, or social crops without changing the schema.
