---
presentation:
  # presentation theme
  # === available themes ===
  # "beige.css"
  # "black.css"
  # "blood.css"
  # "league.css"
  # "moon.css"
  # "night.css"
  # "serif.css"
  # "simple.css"
  # "sky.css"
  # "solarized.css"
  # "white.css"
  # "none.css"
  theme: white.css

  # The "normal" size of the presentation, aspect ratio will be preserved
  # when the presentation is scaled to fit different resolutions. Can be
  # specified using percentage units.
  width: 960
  height: 700

  # Factor of the display size that should remain empty around the content
  margin: 0.1

  # Bounds for smallest/largest possible scale to apply to content
  minScale: 0.2
  maxScale: 1.5

  # Display controls in the bottom right corner
  controls: true

  # Display a presentation progress bar
  progress: true

  # Display the page number of the current slide
  slideNumber: false

  # Push each slide change to the browser history
  history: false

  # Enable keyboard shortcuts for navigation
  keyboard: true

  # Enable the slide overview mode
  overview: true

  # Vertical centering of slides
  center: true

  # Enables touch navigation on devices with touch input
  touch: true

  # Loop the presentation
  loop: false

  # Change the presentation direction to be RTL
  rtl: false

  # Randomizes the order of slides each time the presentation loads
  shuffle: false

  # Turns fragments on and off globally
  fragments: true

  # Flags if the presentation is running in an embedded mode,
  # i.e. contained within a limited portion of the screen
  embedded: false

  # Flags if we should show a help overlay when the questionmark
  # key is pressed
  help: true

  # Flags if speaker notes should be visible to all viewers
  showNotes: false

  # Number of milliseconds between automatically proceeding to the
  # next slide, disabled when set to 0, this value can be overwritten
  # by using a data-autoslide attribute on your slides
  autoSlide: 0

  # Stop auto-sliding after user input
  autoSlideStoppable: true

  # Enable slide navigation via mouse wheel
  mouseWheel: false

  # Hides the address bar on mobile devices
  hideAddressBar: true

  # Opens links in an iframe preview overlay
  previewLinks: false

  # Transition style
  transition: 'default' # none/fade/slide/convex/concave/zoom

  # Transition speed
  transitionSpeed: 'default' # default/fast/slow

  # Transition style for full page slide backgrounds
  backgroundTransition: 'default' # none/fade/slide/convex/concave/zoom

  # Number of slides away from the current that are visible
  viewDistance: 3

  # Parallax background image
  parallaxBackgroundImage: '' # e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

  # Parallax background size
  parallaxBackgroundSize: '' # CSS syntax, e.g. "2100px 900px"

  # Number of pixels to move the parallax background per slide
  # - Calculated automatically unless specified
  # - Set to 0 to disable movement along an axis
  parallaxBackgroundHorizontal: null
  parallaxBackgroundVertical: null

  # Parallax background image
  parallaxBackgroundImage: '' # e.g. "https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg"

  # Parallax background size
  parallaxBackgroundSize: '' # CSS syntax, e.g. "2100px 900px" - currently only pixels are supported (don't use % or auto)

  # Number of pixels to move the parallax background per slide
  # - Calculated automatically unless specified
  # - Set to 0 to disable movement along an axis
  parallaxBackgroundHorizontal: 200
  parallaxBackgroundVertical: 50

  # Enable Speaker Notes
  enableSpeakerNotes: false
---

<!-- slide -->

# Human's as AI Context

<!-- slide -->

## Words, Speech, and Thought Rates

- Humans speak ~15,000 words per day. [^1]
- A person thinks between 4 and 30 words for every word spoken [^2]
- A person thinks between 60,000 and 450,000 words per day. [^2]

##### Therefore

- A person speaks at a rate of 125 to 175 words per minute [^2]
- A person thinks at a rate of 1,000 to 3,000 words per minute 

[^1]: [Some speak 4x more then others, while others speak a lot less](https://www.scientificamerican.com/article/women-talk-more-than-men/#:~:text=In%20most%20of%20the%20samples,numbers%20to%20suit%20their%20tastes.%22)

[^2]: [Given the need to account for the fact that this ratio isn't a precise due to the non-linear nature of thought for each individual and the content being processed.](https://journals.sagepub.com/doi/abs/10.2466/pms.1990.71.3.1043)

<!-- slide -->

## Human words per token

- On average 1 word is approximately 1.33 tokens.
- Therefore, the average human speaks ~20,000 (19,950) tokens per day.
- Therefore, the average human thinks ~600,000 (598,500) tokens per day.

<!-- slide -->
## Current LLM Context Size

- GPT-1: 2,048 tokens (~1,500 words) - June 2018
- GPT-2: 2,048 tokens (~1,500 words) - February 2019
- GPT-3: 4,096 tokens (~3,000 words) - June 2020
- GPT-4: 8,192 tokens (~6,000 words) - March 2023
- GPT-4-turbo: 128,000 tokens (~96,000 words) - November 2023
- GPT-5-Standard: 128,000 tokens (~96,000 words) - July 2025
- GPT-5-Pro: 196,000 tokens (~147,000 words) - July 2025
- GPT-5-API: 400,000 tokens (~300,000 words) - July 2025

<!-- slide -->

## Human Speech vs. Human thought vs LLM Tokens Per Second by model

- Human Speech - ~2.08 tokens per second
- Human Thought - ~25 to 50 tokens per second
- GPT 1 - ~10 tokens per second
- GPT 2 - ~10 tokens per second
- GPT 3 - ~15 tokens per second
- GPT 4 - ~20 tokens per second
- GPT 4-turbo - 80 tokens per second
- GPT 5 - 50 tokens per second




<!-- slide -->

## Length of time by Context Window

| Model            | Context Size (tokens) | Approx. Words | Length of Human Speech | Length of Human Thought |
|------------------|-----------------------|---------------|----------------------|----------------------|
| GPT-1            | 2,048                 | ~1,500        | ~0.075 days (1.8 hours)  |  0.033 days (0.8 hours) |
| GPT-2            | 2,048                 | ~1,500        | ~0.075 days (1.8 hours)  |  0.033 days (0.8 hours) |
| GPT-3            | 4,096                 | ~3,000        | ~0.15 days (3.6 hours)   |  0.067 days (1.6 hours) |
| GPT-4            | 8,192                 | ~6,000        | ~0.3 days (7.2 hours)    |  0.133 days (3.2 hours) |
| GPT-4-turbo      | 128,000               | ~96,000       | ~4.8 days                |  2.4 days (57.6 hours)  |
| GPT-5-Standard   | 128,000               | ~96,000       | ~4.8 days                |  2.4 days (57.6 hours)  |
| GPT-5-Pro        | 196,000               | ~147,000      | ~7.35 days               |  3.6 days (86.4 hours)  |
| GPT-5-API        | 400,000               | ~300,000      | ~15 days                 |  7.2 days (172.8 hours) |


<!-- slide -->