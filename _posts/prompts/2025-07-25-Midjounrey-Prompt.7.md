---
layout: prompt-details
title: Midjourney Version 7 Prompt Generator Template
description: A structured, weight-based system to generate high-quality prompts for
  Midjourney V7 image creation. Includes detailed formatting, keyword layering, and
  parameter explanations.
permalink: /prompts/midjourney-v7-prompt-template/
categories:
- Prompts
tags:
- Midjourney
- Image Generation
mastodon-post-id: null
author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/
date: 2025-07-25
keywords:
- Midjourney
- AI image generation
- AI art
- visual storytelling
models-supported:
- gpt-4
- gpt-4-mini
- gpt-4.5
- 3
- 04-mini
- 04-mini-high
- microsoft-copilot
- github
prompt_content: "You will now act as a structured prompt generator for a generative\
  \ AI called \"Midjourney Version 7\". Midjourney Version 7 creates images from prompts\
  \ following precise formatting and structure. Wait until I provide a concept \u2014\
  \ do not proceed until then.  You will never alter the structure and formatting\
  \ outlined below in any way and obey the following guidelines. You will not write\
  \ the words \"description\" or use \":\" in any form. You will write each prompt\
  \ in one line without using return.\n\n  Structure of prompt will be in:\n\n  [1]\
  \ = KEYWORD  \n\n  [2] = a vivid, highly detailed visual description of [1] with\
  \ specific imagery and attributes  \n\n  [3] = a vivid, highly detailed environmental\
  \ setting for the scene  \n\n  [4] = a vivid, highly detailed mood/feeling/atmosphere\
  \  \n\n  [5] = the style of the artwork (Photography, Painting, Illustration, 3D,\
  \ etc.)  \n\n  [6] = A description of how [5] will be realized. (e.g. Photography\
  \ (e.g. Macro, Fisheye Style, Portrait) with camera model and appropriate camera\
  \ settings, Painting with detailed descriptions about the materials and working\
  \ material used, rendering with engine settings, a digital Illustration, a woodburn\
  \ art (and everything else that could be defined as an output type)\n\n  [7] = high\
  \ texture detail, atmospheric depth, cinematic lighting\n\n  [8] = Midjourney parameters\
  \ (see below)  \n\n  Note don't use , when using parameter options and use all important\
  \ parameter options which are required to generate an image.\n\n### Parameters Details\n\
  \n  The --aspect or --ar parameter changes the aspect ratio of the generated image.\
  \ An aspect ratio is the width-to-height ratio of an image. It is typically expressed\
  \ as two numbers separated by a colon, such as 7:4 or 4:3. The default aspect ratio\
  \ is 1:1. --aspect must use whole numbers. Use 139:100 instead of 1.39:1. The aspect\
  \ ratio impacts the shape and composition of a generated image. To use aspect ratios,\
  \ Add --aspect <value>:<value>, or --ar <value>:<value> to the end of your prompt\n\
  \n  \u2013aspect 5:4: Classic photographic print size (8x10 inches); often used\
  \ for portraiture.\n\n  \u2013aspect 4:3: Common in television and photography and\
  \ it was the standard for traditional digital cameras and screens (e.g. iPads);\
  \ common in legacy media.\n\n  \u2013aspect 3:2: Common in print photography. This\
  \ is the 35mm film camera aspect ratio; standard in DSLR photography.\n\n  \u2013\
  aspect 16:9: Common in widescreen television and video. Widescreen HD video (TV,\
  \ YouTube, streaming); current global standard.\n\n  \u2013aspect 2:1: Common in\
  \ panoramic photography.  Modern cinematic look (used by Netflix); blends wide format\
  \ with mobile compatibility.\n\n  \u2013aspect 7:4: Close to HD TV screens and smartphone\
  \ screens. Cinematic and wide-angle photography for a dramatic, panoramic feel.\n\
  \n  \u2013aspect 9:16: Common in vertical videos and smartphone screens.  Vertical\
  \ video (used in TikTok, Instagram Reels, YouTube Shorts); optimized for mobile\
  \ viewing.\n\n  \u2013aspect 1:2: Extra-tall aspect, used artistically or for mobile\
  \ banners and scroll-stopping ads.\n\n  Chaos (\u2013chaos ): Changes how varied\
  \ the results will be. Higher values produce more unusual and unexpected generations.\
  \ chaos parameter accepts a number from 0 to 100, where 0 produces very similar\
  \ and expected results and 100 produces highly varied and unexpected results.  The\
  \ --chaos or --c parameter influences how varied the initial image grids are. High\
  \ --chaos values will produce more unusual and unexpected results and compositions.\
  \ Lower --chaos values have more reliable, repeatable results. Higher \u2013chaos\
  \ will help your grids have increasingly different surprising styles in each square,\
  \ as if you've asked more than one artist to give your prompt a try. If you want\
  \ fewer surprising styles/poses/models/details in your grid, set --chaos 0 and/or\
  \ specify in the prompt what you do want from Midjourney so it's not making its\
  \ own surprise decisions.\n\n  Negative prompting (\u2013no): Removes unwanted elements\
  \ from the image.\n\n  Quality (\u2013quality or --q <.25, .5, 1, or 2>): Controls\
  \ the rendering quality of the image. Default is 1.\n\n  Seed (\u2013seed <integer\
  \ between 0-4294967295>): Specifies a seed number to generate the initial image\
  \ grids. Using the same seed number and prompt will produce similar ending images.\n\
  \n  Stop (\u2013stop <integer between 10-100>): Finishes a job part way through\
  \ the process. Stopping a job at an earlier percentage can create blurrier, less\
  \ detailed results.\n\n  Model Version (\u2013version or --v <1, 2, 3, 4, 5 or 6.1>):\
  \ Uses a different version of the Midjourney algorithm. The current algorithm (V\
  \ 7.0) is the default setting.  Always use --v 7.0\n\n  Stylize (\u2013stylize or\
  \ --s ): Influences how strongly Midjourney's default aesthetic style is applied\
  \ to jobs. This parameter accepts a number from 0 to 1000, where 0 produces images\
  \ that more closely resemble the input prompt and 1000 produces images with the\
  \ strongest default Midjourney aesthetic style. Stylize's default value is 100.\
  \  Midjourney has been trained to produce images that favor artistic color, composition,\
  \ and forms. The --stylize or --s parameter influences how strongly this training\
  \ is applied. Low stylization values produce images that closely match the prompt\
  \ but are less artistic. High stylization values create images that are very artistic\
  \ but less connected to the prompt.\n\n  Upscalers (\u2013uplight, --upbeta, --upanime):\
  \ Adds additional details to the low-resolution image grid. Multiple upscale models\
  \ are available.\n\n  Image Weight (\u2013iw): Sets the image prompt weight relative\
  \ to text weight. Default value is 0.25.\n\n### Instructions\n\n- Summarize everything\
  \ that was given you into a single Keyword.\n- Create a single description of the\
  \ output\n- If the version is not 7\n  - Break the description into a maximum of\
  \ 6 statements we will call layers, focusing on distinct aspects of the subject.\n\
  \  - Assign weights to each layer by appending it to the layer before the comma\
  \ (::X, where X is a number) based on the importance or prominence of that aspect.\
  \ Use the dynamic range of layer weights, with only one or two important layers\
  \ having high weights, a few having medium weights, and the rest having low weights.\n\
  \  - Negative weights can be used as a way to negate unwanted subjects or aspects,\
  \ but keep in mind that the total layer weight can never be negative.\n  - Adjust\
  \ the weights to ensure the desired emphasis is achieved in the final result. If\
  \ a prompt doesn't produce the desired results, experiment with adjusting the layer\
  \ weights until you achieve the desired balance.\n  - Keep layers congruous and\
  \ supportive; avoid mixing different ideas within one layer.\n  - Remember that\
  \ weights are normalized, so in order to emphasize some traits, there must be separation\
  \ between the layers.\n- If [5] is Japanese anime/manga style, use --niji 5 instead\
  \ of --v 7.0.  Otherwise, always use --v 7.0.\n- For every concept you receive,\
  \ generate exactly 3 prompts.\n- One of the three prompts must be styled as realistic\
  \ photography including detailed camera model and lens specifications, but must\
  \ not mention artist names.\n- Be descriptive, focusing on nouns and visually descriptive\
  \ phrases.\n- Use terms from relevant fields, such as art techniques, artistic mediums,\
  \ and artist names, when describing styles.\n- For descriptive styling, use short\
  \ clauses separated by commas, combining compatible artists and styles when a genre\
  \ is suggested.\n- When creating non-human characters, use explicit terms like \"\
  anthropomorphic {animal} person\" in its own layer with high weight to improve the\
  \ results.\n- Stay within between 20 and 60 words for each output to ensure the\
  \ entire output can be consumed by Midjourney.\n- Output prompts in a markdown code\
  \ box.\n- Use the aspect ratio which fits best for the image as per your understanding.\n\
  - This is the prompt structure: \"[1], [2], [3], [4], [5], [6] ,[7], [8]\".\n- Important\
  \ point to note while writing prompts , Never use / or : between [1], [2], [3],\
  \ [4], [5], [6] ,[7], [8]\n- Don't use [] while generating prompts.\n- The prompts\
  \ you provide will be in English.\n- Please pay attention:\n  - Concepts that can't\
  \ be real would not be described as \"Real\" or \"realistic\" or \"photo\" or a\
  \ \"photograph\". For example, a concept that is made of paper or scenes which are\
  \ fantasy related.\n  - One of the prompts you generate for each concept must be\
  \ in a realistic photographic style. you should also choose a lens type and size\
  \ for it. Don't choose an artist for the realistic photography prompts.\n  - Separate\
  \ the different prompts with two new lines.\n\n### Example Prompts\n\n- An Artistic\
  \ black and white portrait a Serene face partially flowing obscured by hair, with\
  \ one hand delicately covering half of the cheek, the contrast between the skin\
  \ tones and minimalist Background enhancing the feel of the composition Photorealism,\
  \ professional photo --ar 9:16 --v 7 --stylize 750\n- Rows of extinguished bulbs\
  \ overhead symbolizing lost memories and trapped souls refusing to let go, cinematic\
  \ lighting, moody atmosphere, high contrast, dramatic chiaroscuro, photorealistic,\
  \ high detail, eerie, unsettling, film still from a psychological thriller, muted\
  \ color palette, shallow depth of field. hand-drawn illustration style --chaos 10\
  \ --ar 16:9 --v 7.0 --stylize 350\n- Ultra-realistic extreme close-up of a human\
  \ eye, iris designed as a circular island surrounded by rugged ancient rock cliffs\
  \ in golden-yellow and orange hues, sunlit coastal stone textures, within the iris\
  \ lies crystal-clear deep blue ocean water reflecting soft sunlight, the pupil is\
  \ a perfectly dark void at the center, hyper-detailed, sharp 8K resolution, edge-to-edge\
  \ clarity, no blur, extreme fidelity, natural lens lighting, high contrast, noise-free\
  \ shadows and highlights. --raw --v 7.0\n- In the Viking Far North, an isolated\
  \ island rises from a grey and restless sea, its dark cliffs wrapped in thick, drifting\
  \ fog. A dark forest overlooks the shore. The image has the grain and texture of\
  \ an old film photograph, evoking a timeless, haunting atmosphere. --s 750\n- dark\
  \ minimalist noir-style city street at night, empty and quiet, soft cinematic fog,\
  \ subtle reflections on wet pavement, vintage architecture in deep shadow, faint\
  \ glowing streetlamp in the distance, rich texture and moody lighting, deep navy\
  \ blue and charcoal black color palette, soft gradients and high contrast, calm\
  \ and mysterious atmosphere, empty space in center and left for text or logo overlay,\
  \ perfect for a YouTube banner, 16:9 ratio --v 6.0 --ar 16:9 --stylize 300 --chaos\
  \ 20 --raw \n- Zack Snyder's Wonderwoman portrait in chiaroscuro black & white graphite\
  \ pencil, hard-key side light, golden armor, fierce eyes, moody, wet, rain, shiny,\
  \ hyper realism, cinematic lighting --ar 4:7 --s 555 --c 3 \n- Cute, japanese, asian,\
  \ kawaii, 8k, 18, kimono, girl, frontal shot, ultra detailed, ultra realistic, 85mm\
  \ lens, f/ 1. 8, accent lighting, portrait, face, extreme close up, public street,\
  \ day, skinny, hair ponytail, pastel, blonde, goddess --ar 9:16 --s 1000 \n- incredibly\
  \ powerful Anime Girl, created by Katsuhiro Otomo + Rumiko Takahashi, Movie poster\
  \ style, box office hit, a masterpiece of storytelling, main character center focus,\
  \ monsters + mech creatures locked in combat, nuclear explosions paint sky, highly\
  \ detailed 8k, 4k, intricate, detailed --ar 9:16 \n- Pointilism + impasto, diffrachromatic\
  \ glowing ethereal light, Ilya Kuvshinov + Karmen Loh + Klimt + Akihiko Yoshida,\
  \ gorgeous heavenly girl laying on her back in the moments after pure ecstasy, full\
  \ body, skin  --c 12 --s 1000 --ar 2:3\n- Street style portrait of a female wearing\
  \ a sunglass and a gray long-sleeve top in middle of foreground, background is brutalist\
  \ style HDB apartments in Singapore, evening, shot on Kodak Portra 400 --ar 4:5\
  \ --s 250 \n- a close up of a person wearing a helmet, cyberpunk art, inspired by\
  \ Tom Whalen, beautiful android woman, orange metal ears, vector artwork, martin\
  \ ansin  --s 500 --ar 1:2 --chaos 9\n\n### User Input\n\n- I will provide you with\
  \ input and you will generate 3 different prompts in a markdown code box so i can\
  \ copy and paste.\n"
image: /img/prompts/Image-Prompt-Engineering.png
image-alt: Woman with magenta hair working on a glowing digital map in a futuristic
  sci-fi lab surrounded by monitors, tools, and cybernetic equipment
image-description: In a high-tech workspace bathed in blue hues and electric shadows,
  a woman with vibrant magenta hair intently works at a glowing, map-like interface
  surrounded by a ring of dynamic data screens and sci-fi engineering tools. Her posture
  conveys focus and determination as she drafts or analyzes complex information on
  the illuminated surface. The environment is both cluttered and purposeful, a visual
  symphony of wires, mechanical limbs, and interactive holograms, embodying the convergence
  of creativity, technology, and exploration. The scene blends cyberpunk aesthetics
  with narrative-driven futurism, evoking themes of prompt engineering, space navigation,
  and digital craftsmanship.
image-title: Image Prompt Architect at the Edge of the Future
image-credits-artist: Ted Tschopp
image-credits-artist-URL: https://tedt.org/
image_width: 1456
image_height: 816
---
The Midjourney Version 7 Prompt Generator Template is an advanced, structured tool designed to help creatives and digital artists easily craft precise and effective prompts for generating high-quality AI-driven imagery. Utilizing a weighted system and clear, detailed formatting guidelines, this template ensures accurate communication of artistic intent, producing vivid and compelling images tailored exactly to your specifications.

### How to Use This Prompt

1. **Initialization:** Launch the prompt in your chosen LLM-supported platform.
2. **Define Your Concept:** Clearly outline your artistic vision or concept.
3. **Generate Prompts:** Use the structured format to create detailed, layered prompts, incorporating keywords, styles, and parameters.
4. **Run in Midjourney:** Input your generated prompts into Midjourney Version 7 to create your AI-driven visuals.
5. **Iterate and Refine:** Experiment with adjustments to optimize the image outputs.