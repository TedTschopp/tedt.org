# Sean Grove quote portrait

- Asset: `/img/quotes/authors/sean-grove.webp`
- Final dimensions: 1456 × 816 pixels, WebP.
- Method: built-in OpenAI image generation.
- Reference 1, likeness only: user-supplied conference photograph of Sean Grove from the quote request.
- Reference 2, style only: the existing Steve Jobs series portrait, `/img/quotes/authors/steve-jobs.webp` (the skill's unchanged portable copy was supplied to the generator).
- The workroom is an imagined editorial setting. The result is an AI-generated illustration, not a documentary photograph.
- The generated landscape image is scaled proportionally to 1456 pixels wide; one bottom row is trimmed to reach the series' canonical height of 816 pixels. The complete head remains inside the frame.

## Quote source

[The New Code — Sean Grove, OpenAI](https://www.youtube.com/watch?v=8rABwKRsec4&t=1139s), AI Engineer World's Fair 2025. The passage begins at about 18:59. Preserve the user's supplied quote wording, with spoken hesitations omitted.

The entry was added on October 25, 2026. Only the source year is recorded in `original-date`; no exact conference presentation date is inferred.

## Final generation prompt

```text
Use case: identity-preserve
Asset type: TedT.org Quotes author portrait; a clearly disclosed AI-generated editorial illustration.
Create one photorealistic editorial environmental portrait depicting exactly one person: Sean Grove, using the supplied conference photograph as the authoritative likeness reference.

INPUT IMAGE ROLES
Image 1 is Sean Grove's likeness reference only. Preserve his apparent age, short tousled brown hair, clean-shaven face, distinctive facial structure and nose, and recognizable features. His clothing should remain a gray V-neck shirt with a dark open scarf or soft dark draped collar as in the reference.
Image 2 is a STYLE reference only: the existing Steve Jobs author portrait. Match its soft window light, restrained natural colors, realistic photographic texture, and chest-up environmental framing. Do not include Steve Jobs, his facial features, glasses, black turtleneck, or other identity details.

ENVIRONMENT
An understated contemporary software engineer's workroom, with a desk and closed laptop softly blurred in the background, warm neutral walls, and natural window light. This is an imagined editorial setting, not a reconstruction of the conference. No corporate signage.

COMPOSITION
Output a 1456 by 816 pixel horizontal landscape image, approximately 16:9, suitable for the Quotes series hero and cropped listing thumbnails. Eye-level natural portrait perspective. Frame Sean from the chest upward with his full head clearly inside the central half of the frame, comfortable headroom, shoulders visible, and eyes sharply focused. Relaxed posture, thoughtful natural expression looking slightly toward the camera. Keep the face recognizable at thumbnail size.

PHOTOGRAPHIC TREATMENT
Soft directional window light, subtle catchlights, moderate shadows, sharp natural skin and hair texture, convincing fabric, and gentle background blur. Restrained natural color: warm neutrals, charcoal shadows, muted gray; no heavy sepia or extreme grading.

CONSTRAINTS
Exactly one person, no extra people, no duplicates or blended identities. Preserve the likeness and apparent age from Image 1. No beautification that changes identity, plastic skin, painterly texture, quotation text, captions, logos, lettering, watermarks, decorative borders, or headset microphone. Keep a fully visible head with margin for the final landscape crop.
```
