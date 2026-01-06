# The Complete History of Google AI Models

## From BERT to Gemini 3

**Google’s AI models** have quietly defined most of the modern AI era: from the original Transformer paper that inspired today’s LLMs to the models that now power Search, Android, YouTube, and Workspace. Starting with **BERT** and moving through **T5**, **PaLM**, and the **Gemini** family, Google’s stack has steadily evolved from language understanding to fully multimodal, agentic systems that work across text, code, images, audio, and video. ([Wikipedia][1])

In this guide, we’ll walk through the evolution of **Google AI models**, mirroring the structure of your OpenAI history: early language models, generative media models like Imagen and Veo, foundation models for speech, open-weight Gemma models, and finally the Gemini series culminating in **Gemini 3**.

---

### BERT (2018) – Bidirectional Understanding for Search

Unveiled in **October 2018**, **BERT (Bidirectional Encoder Representations from Transformers)** was Google’s first blockbuster Transformer-based language model. It used the **encoder-only Transformer architecture** and was trained bidirectionally, meaning it looked at words both before and after a token to understand context. ([Wikipedia][1])

**Technical Highlights**

* **Architecture**: Encoder-only Transformer; BERT Base at ~110M parameters, BERT Large at ~340M. ([Wikipedia][1])
* **Training Objective**:

  * *Masked language modeling* (predict masked tokens).
  * *Next sentence prediction* (are two segments consecutive?). ([Wikipedia][1])
* **Training Data**: Toronto BooksCorpus (~800M words) + English Wikipedia (~2.5B words). ([Wikipedia][1])

**Impact**

* Delivered state‑of‑the‑art performance on GLUE, SQuAD, and SWAG benchmarks. ([Wikipedia][1])
* Deployed into **Google Search** in 2019, eventually used on almost every English query for better intent understanding. ([Wikipedia][1])
* Established the **“pretrain then fine‑tune”** paradigm for language understanding models.

BERT is to Google what GPT‑1 was to OpenAI: a proof that scaling Transformers on large corpora fundamentally changes NLP.

---

### T5 (2019) – Text‑to‑Text Transfer Transformer

In **2019**, Google introduced **T5 (Text‑to‑Text Transfer Transformer)**, reframing *all* NLP tasks—from translation to summarization—as “text in, text out.” ([Wikipedia][2])

**Key Ideas**

* **Unified text‑to‑text framework**: every task is expressed as a string‑to‑string mapping (e.g., `"translate English to German: ..."`). ([Google Research][3])
* **Architecture**: Encoder–decoder Transformer, similar to the original 2017 Transformer but scaled up and tuned for transfer learning. ([Wikipedia][2])
* **Pretraining Data**: The **C4 (“Colossal Clean Crawled Corpus”)** web dataset, filtered from Common Crawl. ([Google Research][3])

**Impact**

* Became a general‑purpose **sequence‑to‑sequence foundation model** for translation, summarization, QA, and more. ([Wikipedia][2])
* Strongly influenced later “instruction‑tuned” and “promptable” models, including PaLM‑style and Gemini‑era systems.

---

### LaMDA (2021) – Breakthrough Conversation Technology

In **May 2021**, Google announced **LaMDA (Language Model for Dialogue Applications)**, a Transformer‑based conversational model designed specifically for open‑ended dialogue. ([blog.google][4])

**What Made LaMDA Different**

* **Dialogue‑centric training** on human conversation, stories, and Q&A, to produce answers that are *sensible, specific, and interesting*. ([blog.google][4])
* Connected to tools like a **knowledge base, calculator, translation system, and clock**, making it one of the early “tool‑using” chatbots inside Google. ([Wikipedia][5])
* Optimized for **free‑flowing, multi‑turn conversation**, not just single‑shot Q&A. ([blog.google][4])

LaMDA underpinned early versions of Google’s Bard chatbot and served as a bridge between T5‑style models and later PaLM/Gemini systems. ([Wikipedia][5])

---

### PaLM (2022) – Pathways Language Model at 540B Parameters

In **April 2022**, Google introduced **PaLM (Pathways Language Model)**, a **540B‑parameter dense decoder‑only Transformer** trained with the Pathways system across multiple TPU v4 pods. ([Google Research][6])

**Technical Highlights**

* **Architecture**: GPT‑style, decoder‑only Transformer with large depth and width. ([Google Research][6])
* **Scale**: 540 billion parameters in its largest form, with smaller 8B and 62B variants for scaling studies. ([Wikipedia][7])
* **Training**: Multilingual web text, code, and other sources; trained with Google’s **Pathways** infrastructure to flexibly route computation. ([Google Research][6])

**Capabilities**

* Strong **commonsense and arithmetic reasoning**, especially when combined with chain‑of‑thought prompting. ([Wikipedia][7])
* Competitive on translation, code generation, and multi‑step reasoning, signaling Google’s entry into the “frontier LLM” race. ([Google Research][6])

PaLM set the stage for PaLM 2 and ultimately for Gemini, just as GPT‑3 paved the way for GPT‑4 and GPT‑5 on the OpenAI side.

---

### PaLM 2 (2023) – Multilingual, Reasoning, and Coding

Announced at **Google I/O 2023**, **PaLM 2** was presented as a more capable, efficient successor to PaLM, with better multilingual coverage and reasoning. ([blog.google][8])

**Key Advancements**

* **Multilingual**: Trained on data spanning **100+ languages**, with improved performance on translation and cross‑lingual tasks. ([blog.google][8])
* **Reasoning & coding**: Stronger performance on logic, math, and code benchmarks; specialized variants like **Med‑PaLM 2** (medicine) and **Sec‑PaLM 2** (cybersecurity). ([LeewayHertz - AI Development Company][9])
* **Model sizes**: Four deployment tiers — **Gecko, Otter, Bison, Unicorn** — from mobile‑friendly to large cloud models. ([blog.google][8])

**Impact**

* Became the foundation behind **Bard**, many **Workspace** features, and **Vertex AI** text and code models. ([Waii][10])
* Marked Google’s pivot from “research‑only” LLMs to widely deployed, product‑integrated models.

---

### Imagen Series (2022–2025) – Text‑to‑Image Diffusion

**Imagen** is Google’s flagship **text‑to‑image** family, first presented in a 2022 paper describing high‑fidelity diffusion models guided by powerful language encoders. ([Imagen][11])

**Timeline & Features**

* **Imagen (2022)** – Demonstrated photorealistic images with strong language understanding, comparable to or better than contemporary systems like DALL·E 2. ([Imagen][11])
* **Imagen 2 (Dec 2023)** – Improved text and **logo generation**, aimed at commercial use in Vertex AI and Google Labs experiments. ([Wikipedia][12])
* **Imagen 3 (2024)** – Introduced alongside Veo at Google I/O 2024 as Google’s **highest‑quality text‑to‑image model**, focusing on realism, text rendering, and safety. ([blog.google][13])
* **Imagen 4 (May 2025)** – Further upgrades to detail and lighting; integrated directly into Gemini, ImageFX, and Vertex AI. ([Wikipedia][12])

Imagen plays a similar role to **DALL·E** in OpenAI’s history: it’s the backbone of Google’s generative image tooling across Search, Gemini, and creative apps. ([blog.google][13])

---

### Speech & Audio Foundations – USM, Chirp, and AudioLM

As OpenAI launched Whisper, Google pushed its own speech and audio foundation models: **USM**, **Chirp**, and **AudioLM**.

#### Universal Speech Model (USM) & Chirp (2023–2024)

* **USM (Universal Speech Model)**: A ~2B‑parameter family of multilingual ASR models trained on **12M+ hours of speech** and **28B text sentences**, covering **100+ languages** and aiming toward 1,000 supported languages. ([arXiv][14])
* **Chirp**: A productionized USM variant deployed via **Cloud Speech‑to‑Text** and Vertex AI, offering state‑of‑the‑art multilingual transcription accuracy. ([Google Cloud][15])

These models are Google’s answer to general‑purpose speech recognition, powering transcription, captions, and speech interfaces across products.

#### AudioLM (2022) – Language Modeling for Audio

**AudioLM** casts audio generation as **language modeling over discrete audio tokens**, enabling long‑term consistent speech and piano music synthesis. ([Google Research][16])

* Learns **structure (syntax, melody)** as well as local acoustics.
* Serves as a research precursor to later multimodal models that treat audio as just another token stream, foreshadowing Gemini’s audio capabilities.

---

### Veo (2024–2025) – Text‑to‑Video Generation

Google’s generative video line, **Veo**, mirrors the role of OpenAI’s video models (like Sora).

* **Veo (2024)** – Announced at **Google I/O 2024** as a high‑definition text‑to‑video model generating >1‑minute 1080p clips with strong physics and scene understanding. ([Wikipedia][17])
* **Veo 2 (Dec 2024)** – Introduced with improved realism and 4K support; integrated into VideoFX, YouTube tools, and Gemini Advanced. ([Wikipedia][17])
* **Veo 3 & 3.1 (2025)** – Add synchronized **audio generation** and better cinematic control; exposed through Google’s **Flow** filmmaking interface and the Gemini app. ([Wikipedia][17])

Where Imagen brings high‑quality still images, Veo pushes toward full **AI‑assisted filmmaking**, tightly integrated with Gemini for prompt interpretation and story planning. ([blog.google][18])

---

### Gemini 1.0 (2023) – First Multimodal Gemini Models

In **December 2023**, Google unveiled **Gemini 1.0**, described as its **most capable and general AI model**, built to be multimodal from the ground up. ([blog.google][19])

**Model Family**

* **Gemini Ultra** – For highly complex tasks.
* **Gemini Pro** – General‑purpose cloud model powering Bard and later Gemini chat.
* **Gemini Nano** – On‑device model for Android (e.g., Pixel 8 Pro). ([arXiv][20])

**Capabilities**

* Native support for **text, images, audio, and video** in one model family. ([arXiv][20])
* Integrated into **Bard/Gemini**, **Search**, **Ads**, **Chrome**, and **Workspace** features. ([blog.google][19])

Gemini 1.0 is analogous to GPT‑4 in OpenAI’s history: the first widely marketed, general‑purpose multimodal foundation model.

---

### Gemini 1.5 (2024) – Long‑Context Multimodality

In **February 2024**, Google introduced **Gemini 1.5**, most famous for its **ultra‑long context windows**. ([blog.google][21])

**Key Features**

* **Context window up to 1M tokens** in production, with research and preview support up to **2M tokens**, allowing entire codebases, video transcripts, or large document collections in a single prompt. ([blog.google][21])
* Strong multimodal reasoning: can analyze documents, images, and long video sequences in one session. ([Google Cloud Documentation][22])

Gemini 1.5 made “long‑context” a defining axis of competition, much like OpenAI’s GPT‑4 Turbo and later long‑context models.

---

### Gemini 2.0 (2024–2025) – Agentic Era

Announced in **December 2024**, **Gemini 2.0** focuses less on raw benchmark scores and more on **agentic behavior**—models that can take actions and use tools. ([blog.google][23])

**Highlights**

* **Gemini 2.0 Flash & Flash‑Lite** – High‑speed, cost‑efficient models optimized for real‑time applications and image generation/editing. ([blog.google][23])
* Native **tool use** and **image/audio output**, designed to power assistants like **Project Astra** (real‑time multimodal assistant), **Project Mariner**, and other agentic experiences. ([blog.google][23])
* Became the default Gemini model in many apps before 2.5 arrived. ([Wikipedia][24])

Gemini 2.0 is Google’s equivalent of OpenAI’s “omni” models: optimized for interactivity, latency, and tool‑calling in real products.

---

### Gemini 2.5 (2025) – Thinking Models with Million‑Token Context

In **March 2025**, Google introduced **Gemini 2.5 Pro** and **2.5 Flash**, positioned as its **most intelligent models** at the time, with a focus on **deliberate reasoning**. ([blog.google][25])

**Breakthrough Features**

* **1M‑token context window** at launch, with a roadmap toward **2M tokens**, spanning hours of audio or video and huge text/code corpora. ([blog.google][25])
* **“Thinking” pipeline** – Models are trained to perform internal chain‑of‑thought‑style reasoning before replying, particularly for complex coding, math, and multimodal tasks. ([arXiv][26])
* **Gemini 2.5 Flash** – A **workhorse reasoning model** designed for speed and low cost, ideal for summarization, chat, and data extraction. ([Google DeepMind][27])

**Impact**

* Used as the engine behind **Gemini Code Assist**, **Gemini CLI**, long‑context analytics, and many enterprise integrations. ([Google Cloud Documentation][28])

Gemini 2.5 is conceptually similar to OpenAI’s **“o‑series” reasoning models**: more compute per question, better deliberate reasoning, and massive context windows.

---

### Gemma (2024–2025) – Google’s Open‑Weight Models

To match the open‑weight push in the broader ecosystem, Google launched **Gemma**, a family of **lightweight, open models** built from the same research as Gemini. ([blog.google][29])

**Gemma Family**

* **Gemma 1 (Feb 2024)** – Open weights at **2B and 7B parameters**, with base and instruction‑tuned variants under a permissive license, plus a **Responsible Generative AI Toolkit**. ([blog.google][29])
* **Gemma 2 (mid‑2024)** – Expanded to **2B, 9B, 27B** models, improved architecture (e.g., grouped‑query attention) and better reasoning/coding. ([Hugging Face][30])
* **Gemma 3 (2025)** – Multimodal, multilingual open models (1B–27B, up to 128K context) with strong math, coding, and function‑calling, positioned as the **“most powerful model that can run on a single GPU.”** ([Google AI for Developers][31])

**Vision‑Language & Specializations**

* **PaliGemma & PaliGemma 2** – Open **vision‑language models** connecting SigLIP vision encoders to Gemma backbones. ([arXiv][32])
* On‑device variants like **Gemma 3n**, optimized to run offline with as little as ~2GB RAM, enabling multimodal apps entirely on phones or edge devices. ([The Economic Times][33])

Gemma plays a role analogous to **GPT‑OSS / LLaMA**: it’s Google’s open‑weights family for researchers, startups, and on‑device deployments.

---

### Gemini 3 (2025) – The New Frontier in Google’s Stack

Launched in **November 2025**, **Gemini 3** is Google’s **most advanced model family** to date, with a strong emphasis on **reasoning, long‑context, and agentic behavior**. ([blog.google][34])

**Gemini 3 Pro**

* Described as **“our most intelligent model yet,”** designed for complex planning, coding, and multimodal analysis. ([Google DeepMind][35])
* **1M‑token context window** in the Pro Preview, extending the long‑context capabilities introduced in 2.5. ([Google Cloud][36])
* Introduces a **`thinking_level` parameter** (`"low"` / `"high"`) so developers can explicitly trade off latency vs depth of reasoning—Google’s counterpart to configurable reasoning effort. ([Google AI for Developers][37])
* Outperforms Gemini 2.5 Pro by **~35–50%** on a range of coding and reasoning benchmarks (e.g., LMArena, WebDev Arena, SWE‑bench‑style tasks). ([Google Cloud][38])

**Deep Think Mode & Agentic Use**

* **Gemini 3 Deep Think** (in preview) further extends multi‑step reasoning, especially for science, math, and visual puzzles. ([blog.google][34])
* Powers **Gemini Agent**, Gemini CLI, Antigravity IDE, and deeper integrations in Google Search’s AI Mode and Workspace. ([Google Developers Blog][39])

**Ecosystem & Media**

* Bundled with improved generative media tools like **Nano Banana Pro** (image generation) and **Veo 3.1** (video + audio), tightly integrated into the Gemini app and Google AI Studio. ([Android Central][40])

Gemini 3 is to Google what GPT‑5 is to OpenAI in your original article: a unifying, reasoning‑capable, multimodal frontier model designed to anchor the entire product stack.

---

### Technological Trends Across Google AI Models

Looking across BERT → T5 → PaLM → Gemini → Gemini 3, a few trends stand out:

1. **From Encoders to General‑Purpose LLMs**

   * Early models (BERT, T5) focused on **language understanding and sequence‑to‑sequence tasks**. Later families (PaLM, Gemini, Gemma) are **decoder‑only LLMs** that support both understanding and generation across tasks and modalities. ([Wikipedia][1])

2. **Multimodal Integration**

   * Imagen, AudioLM, USM/Chirp, Veo, and Gemini show a clear path from **text‑only** to **text+image+audio+video** in a unified representation space. ([Imagen][11])

3. **Long‑Context & “Thinking” Models**

   * Gemini 1.5, 2.5, and 3 push context windows into the **1M+ token** regime and add explicit controls for **internal reasoning** (`thinking_budget`, then `thinking_level`). ([blog.google][21])

4. **Open‑Weight & On‑Device AI**

   * Gemma and PaliGemma show Google embracing **open weights and edge deployment**, paralleling industry demand for models that run on a single GPU or even a smartphone. ([blog.google][29])

5. **Alignment, Safety, and Governance**

   * Google’s **AI Principles** (2018) and subsequent **responsible AI frameworks** guide development of PaLM, Gemini, and Gemma, including model cards, safety classifiers (e.g., ShieldGemma), and phased launches with red‑teaming. ([blog.google][41])

---

### The Role of AI Ethics in Google’s Model Development

Google formalized **AI Principles** in 2018—“be socially beneficial,” “avoid unfair bias,” “be built and tested for safety,” and others—as a framework for how its AI should be developed and deployed. ([blog.google][41])

For modern models like **Gemini 2.0, 2.5, and 3**, this shows up as:

* **Frontier Safety Frameworks** and governance processes in Google DeepMind for evaluating new capabilities before wide release. ([blog.google][42])
* Dedicated **Responsible AI teams** and tools (Explainable AI, Model Cards, content safety classifiers like ShieldGemma) embedded into the model lifecycle. ([Google Cloud][43])
* Developer‑facing resources like the **Responsible Generative AI Toolkit** for Gemma and Gemini API users. ([Google AI for Developers][44])

There’s also public scrutiny and debate—over data usage, military applications, and policy shifts—which continues to shape how Google balances innovation with risk. ([EPIC][45])

---

### Future Outlook for Google AI Models

Based on current trajectories, we can reasonably expect:

* **Deeper agentic capabilities** – More robust “AI agents” that can autonomously use tools, browse, and act within Google’s ecosystem (Search, Workspace, Android, Cloud) under tight safety constraints. ([blog.google][23])
* **Even longer context & richer thinking controls** – Gemini 2.5 and 3 already expose 1M‑token windows and reasoning knobs; future generations will likely push further while making reasoning more transparent and steerable. ([blog.google][25])
* **Stronger on‑device models** – Successive Gemma and Gemini Nano / Gemma 3n variants will continue to push high‑quality multimodal AI into offline, low‑power devices. ([Google DeepMind][46])
* **Tighter coupling of media models** – Imagen 4, Veo 3.1, and Nano Banana Pro suggest a future where images, audio, and video are all **first‑class citizens** in everyday Gemini workflows, not separate tools. ([Wikipedia][12])

---

### Conclusion

The history of **Google AI models** runs in parallel to, and often underpins, the broader deep‑learning revolution:

* **BERT and T5** redefined how we represent and manipulate language.
* **LaMDA and PaLM** showed that large‑scale Transformers could converse, reason, and code.
* **Imagen, USM/Chirp, AudioLM, and Veo** turned generative AI into a full multimedia stack.
* **Gemma** brought cutting‑edge research into the open‑weights world.
* **Gemini 1 → 2.5 → 3** unified all of this into multimodal, long‑context, reasoning‑centric systems deployed across Google’s products and cloud.

Just as your OpenAI article charts the journey from GPT‑1 to GPT‑5, this story traces Google’s path from **BERT’s humble bidirectional encodings to Gemini 3’s agentic, multimodal intelligence**—two parallel arcs that together define much of the modern AI landscape.

---

* [The Verge](https://www.theverge.com/news/635502/google-gemini-2-5-reasoning-ai-model?utm_source=chatgpt.com)
* [The Verge](https://www.theverge.com/news/635502/google-gemini-2-5-reasoning-ai-model?utm_source=chatgpt.com)
* [Android Central](https://www.androidcentral.com/apps-software/ai/gemini-3-pro-googles-new-ai-model-aims-to-redefine-multimodal-understanding?utm_source=chatgpt.com)
* [Business Insider](https://www.businessinsider.com/salesforce-ceo-marc-benioff-gemini-3-praise-chatgpt-2025-11?utm_source=chatgpt.com)
* [Investors.com](https://www.investors.com/news/technology/ai-stocks-google-stock-risk-gemini-3/?utm_source=chatgpt.com)
* [The Verge](https://www.theverge.com/ai-artificial-intelligence/627968/google-gemma-3-open-ai-model?utm_source=chatgpt.com)
* [The Verge](https://www.theverge.com/news/648816/google-veo-2-ai-video-generation-gemini-advanced?utm_source=chatgpt.com)
* [TechRadar](https://www.techradar.com/ai-platforms-assistants/gemini/google-launches-nano-banana-pro-a-massive-leap-in-ai-image-editing-powered-by-gemini-3-pro?utm_source=chatgpt.com)
* [Android Central](https://www.androidcentral.com/apps-software/ai/googles-november-gemini-drop-adds-gemini-3-nano-banana-pro-and-more?utm_source=chatgpt.com)
* [Android Central](https://www.androidcentral.com/apps-software/ai/google-home-app-update-improves-geminis-voice-assistant-and-simplifies-descriptions?utm_source=chatgpt.com)

[1]: https://en.wikipedia.org/wiki/BERT_%28language_model%29?utm_source=chatgpt.com "BERT (language model)"
[2]: https://en.wikipedia.org/wiki/T5_%28language_model%29?utm_source=chatgpt.com "T5 (language model)"
[3]: https://research.google/blog/exploring-transfer-learning-with-t5-the-text-to-text-transfer-transformer/?utm_source=chatgpt.com "Exploring Transfer Learning with T5: the Text-To ..."
[4]: https://blog.google/technology/ai/lamda/?utm_source=chatgpt.com "LaMDA: our breakthrough conversation technology"
[5]: https://en.wikipedia.org/wiki/LaMDA?utm_source=chatgpt.com "LaMDA"
[6]: https://research.google/blog/pathways-language-model-palm-scaling-to-540-billion-parameters-for-breakthrough-performance/?utm_source=chatgpt.com "Pathways Language Model (PaLM): Scaling to 540 Billion ..."
[7]: https://en.wikipedia.org/wiki/PaLM?utm_source=chatgpt.com "PaLM"
[8]: https://blog.google/technology/ai/google-palm-2-ai-large-language-model/?utm_source=chatgpt.com "What to know about the PaLM 2 large language model"
[9]: https://www.leewayhertz.com/google-palm2/?utm_source=chatgpt.com "Google PaLM 2: Features, applications and development"
[10]: https://blog.waii.ai/google-enters-the-race-can-palm-2-beat-gpt-4-in-sql-8a827e6e0d4a?utm_source=chatgpt.com "Google enters the race, can PaLM 2 beat GPT-4 in SQL? - Waii"
[11]: https://imagen.research.google/?utm_source=chatgpt.com "Imagen: Text-to-Image Diffusion Models - Google Research"
[12]: https://en.wikipedia.org/wiki/Imagen_%28text-to-image_model%29?utm_source=chatgpt.com "Imagen (text-to-image model)"
[13]: https://blog.google/technology/ai/google-generative-ai-veo-imagen-3/?utm_source=chatgpt.com "Introducing Veo and Imagen 3 generative AI tools"
[14]: https://arxiv.org/abs/2303.01037?utm_source=chatgpt.com "Google USM: Scaling Automatic Speech Recognition Beyond 100 Languages"
[15]: https://cloud.google.com/blog/products/ai-machine-learning/bringing-power-large-models-google-clouds-speech-api?utm_source=chatgpt.com "Google Cloud Chirp model for Speech AI"
[16]: https://research.google/blog/audiolm-a-language-modeling-approach-to-audio-generation/?utm_source=chatgpt.com "AudioLM: a Language Modeling Approach to Audio ..."
[17]: https://en.wikipedia.org/wiki/Veo_%28text-to-video_model%29?utm_source=chatgpt.com "Veo (text-to-video model)"
[18]: https://blog.google/technology/ai/google-flow-veo-ai-filmmaking-tool/?utm_source=chatgpt.com "Meet Flow: AI-powered filmmaking with Veo 3"
[19]: https://blog.google/technology/ai/google-gemini-ai/?utm_source=chatgpt.com "Introducing Gemini: our largest and most capable AI model"
[20]: https://arxiv.org/abs/2312.11805?utm_source=chatgpt.com "Gemini: A Family of Highly Capable Multimodal Models"
[21]: https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/?utm_source=chatgpt.com "Introducing Gemini 1.5, Google's next-generation AI model"
[22]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/long-context?utm_source=chatgpt.com "Long context | Generative AI on Vertex AI"
[23]: https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/?utm_source=chatgpt.com "Introducing Gemini 2.0: our new AI model for the agentic era"
[24]: https://en.wikipedia.org/wiki/Gemini_%28language_model%29?utm_source=chatgpt.com "Gemini (language model)"
[25]: https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/?utm_source=chatgpt.com "Gemini 2.5: Our most intelligent AI model"
[26]: https://arxiv.org/html/2507.06261v2?utm_source=chatgpt.com "Gemini 2.5: Pushing the Frontier with Advanced Reasoning ..."
[27]: https://deepmind.google/models/gemini/flash/?utm_source=chatgpt.com "Gemini 2.5 Flash"
[28]: https://docs.cloud.google.com/gemini/docs/release-notes?utm_source=chatgpt.com "Gemini for Google Cloud release notes"
[29]: https://blog.google/technology/developers/gemma-open-models/?utm_source=chatgpt.com "Gemma: Introducing new state-of-the-art open models"
[30]: https://huggingface.co/google/gemma-2-9b?utm_source=chatgpt.com "google/gemma-2-9b"
[31]: https://ai.google.dev/gemma/docs/core?utm_source=chatgpt.com "Gemma 3 model overview - Google AI for Developers"
[32]: https://arxiv.org/abs/2407.07726?utm_source=chatgpt.com "[2407.07726] PaliGemma: A versatile 3B VLM for transfer"
[33]: https://economictimes.indiatimes.com/magazines/panache/meet-gemma-3n-googles-lightweight-ai-model-that-works-offline-with-just-2gb-ram/articleshow/122114583.cms?utm_source=chatgpt.com "Meet Gemma 3n: Google's lightweight AI model that works offline with just 2GB RAM"
[34]: https://blog.google/products/gemini/gemini-3/?utm_source=chatgpt.com "A new era of intelligence with Gemini 3"
[35]: https://deepmind.google/models/gemini/pro/?utm_source=chatgpt.com "Gemini 3 Pro"
[36]: https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/gemini-3-pro-preview?utm_source=chatgpt.com "Gemini 3 Pro Preview – Vertex AI"
[37]: https://ai.google.dev/gemini-api/docs/thinking?utm_source=chatgpt.com "Gemini thinking | Gemini API - Google AI for Developers"
[38]: https://cloud.google.com/blog/products/ai-machine-learning/gemini-3-is-available-for-enterprise?utm_source=chatgpt.com "Gemini 3 is available for enterprise"
[39]: https://developers.googleblog.com/en/5-things-to-try-with-gemini-3-pro-in-gemini-cli/?utm_source=chatgpt.com "5 things to try with Gemini 3 Pro in Gemini CLI"
[40]: https://www.androidcentral.com/apps-software/ai/googles-november-gemini-drop-adds-gemini-3-nano-banana-pro-and-more?utm_source=chatgpt.com "Everything Google added to the Gemini app in November, from Gemini 3 to Nano Banana Pro"
[41]: https://blog.google/technology/ai/ai-principles/?utm_source=chatgpt.com "AI at Google: our principles"
[42]: https://blog.google/technology/ai/responsible-ai-2024-report-ongoing-work/?utm_source=chatgpt.com "Responsible AI: Our 2024 report and ongoing work"
[43]: https://cloud.google.com/responsible-ai?utm_source=chatgpt.com "Responsible AI"
[44]: https://ai.google.dev/responsible?utm_source=chatgpt.com "Responsible Generative AI Toolkit | Google AI for Developers"
[45]: https://epic.org/google-rolls-back-responsible-ai-principles-breaking-promise-to-limit-military-use-of-its-products/?utm_source=chatgpt.com "Google Rolls Back Responsible AI Principles, Breaking ..."
[46]: https://deepmind.google/models/gemma/gemma-3/?utm_source=chatgpt.com "Gemma 3"
