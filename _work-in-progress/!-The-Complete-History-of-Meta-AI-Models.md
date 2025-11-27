# The Complete History of Meta AI Models

## From Llama 1 to Llama 4

Meta’s AI journey runs in parallel to the rise of large language models: early translation and NLP work at Facebook AI Research (FAIR), then the *Llama* family of open‑weight LLMs, and, alongside them, powerful image, video, and music generators like **Emu** and **MusicGen**. Together, these models underpin the **Meta AI** assistant in WhatsApp, Instagram, Facebook, and beyond. ([Wikipedia][1])

Below is a Llama‑centric history, with the key generative and safety models that make up Meta’s AI stack.

---

### Pre‑Llama Foundations (2019–2022) – Translation, Multilinguality & Early Chatbots

Before Llama, FAIR built a series of influential models that set the stage for the later LLM family:

* **BART (2019)** – A denoising sequence‑to‑sequence transformer that combined a bidirectional encoder (like BERT) with an autoregressive decoder (like GPT), and became a workhorse for summarization, generation, and translation. ([arXiv][2])

* **XLM‑R (2019)** – A multilingual RoBERTa‑style model trained on 2.5 TB of CommonCrawl in 100 languages, pushing cross‑lingual understanding and transfer far beyond multilingual BERT. ([arXiv][3])

* **M2M‑100 (2020)** – A many‑to‑many MT model that directly translated between 100 languages (9,900 directions) without going through English, and was released as open source. ([Hugging Face][4])

* **BlenderBot 3 (2022)** – A 175B‑parameter open‑domain chatbot built on Meta’s OPT‑175B model, with internet search and long‑term memory, released with weights, data, and code as a research system. ([About Facebook][5])

These models gave Meta strong experience in **sequence‑to‑sequence learning, multilingual pretraining, and open‑dataset releases**—all ingredients that would later show up in Llama.

---

### Llama 1 (2023) – Research‑Only Foundation Model

**Llama 1** (often just “LLaMA”) was announced in **February 2023** as a family of decoder‑only transformers in sizes from ~7B to 65B parameters. Weights were *not* broadly released: academics and select organizations could apply for access under a non‑commercial license. ([Wikipedia][1])

Key points:

* **Training data:** ~1–1.4T tokens from publicly available sources, including CommonCrawl, GitHub, Wikipedia, books, ArXiv LaTeX, and StackExchange. ([Wikipedia][1])
* **Architecture:** GPT‑style transformer with tweaks—SwiGLU activations, rotary positional embeddings, and RMSNorm instead of LayerNorm. ([Wikipedia][1])
* **Performance:** The 13B model reportedly beat GPT‑3 (175B) on many benchmarks; the 65B model was competitive with PaLM and Chinchilla. ([Wikipedia][1])

In March 2023, the weights leaked via BitTorrent, quickly spreading across the open‑source community and effectively kick‑starting the modern open‑weight LLM ecosystem. ([Wikipedia][1])

---

### Llama 2 & Code Llama (2023) – Source‑Available for Commercial Use

In **July 2023**, Meta released **Llama 2** (7B, 13B, 70B) with weights available under a **source‑available license** that allowed many commercial uses but enforced an acceptable‑use policy. ([Wikipedia][1])

**What changed vs Llama 1:**

* ~**2T tokens** of curated data (more and cleaner). ([Wikipedia][1])
* **4K context window**, versus 2K before. ([Wikipedia][1])
* Official **chat‑tuned variants** (“Llama 2‑Chat”) trained with supervised fine‑tuning plus RLHF. ([Wikipedia][1])
* Partnered launches with **Microsoft Azure** and other clouds made Llama 2 widely accessible. ([About Facebook][6])

The Open Source Initiative argued that, despite marketing, Llama 2’s license isn’t truly “open source,” highlighting the tension between openness and control in frontier models. ([Wikipedia][1])

#### Code Llama (2023–24) – Specialization for Code

Released in **August 2023** (with a 70B version in January 2024), **Code Llama** fine‑tuned Llama 2 on hundreds of billions of code tokens plus long‑context data; variants included base, instruct, and Python‑specialized models. ([Wikipedia][1])

This positioned Meta as a serious player in **code generation and developer tooling**, and many open‑source IDE assistants quickly adopted Code Llama as a backbone.

---

### Llama Guard & Prompt Guard (2023–2025) – Safety Companions

To complement open‑weight LLMs, Meta built a safety stack around **Llama Guard**:

* **Llama Guard (v1/v2)** – LLM‑based classifiers for filtering prompts and responses in line with an internal safety policy. ([Meta AI][7])
* **Llama Guard 3 (2024)** – An 8B model fine‑tuned from Llama 3.1 to classify content into the **MLCommons hazard taxonomy** (14 categories including violence, hate, self‑harm, elections, IP, etc.) in eight languages, with lower false‑positive rates than previous versions and even GPT‑4 on internal tests. ([Hugging Face][8])
* **Llama Guard 4‑12B (2025)** – A 12B, **multimodal** safety classifier capable of assessing both text and images, distributed via NVIDIA’s NIM stack for use in production systems. ([NVIDIA Documentation][9])

Meta also released **Prompt Guard** and other protection models to help developers apply guardrails when they deploy Llama in their own products. ([Llama][10])

---

### Llama 3 (April 2024) – Scaling Data, Not Just Parameters

**Llama 3** launched in **April 2024** with **8B and 70B** parameter models trained on ~**15T tokens**, heavily filtered for quality and primarily English with a minority of data from 30+ other languages. ([Wikipedia][1])

Highlights:

* **8K context window**, much larger training dataset than Llama 2. ([Wikipedia][1])
* Meta reported that **Llama 3‑70B** matched or beat **Gemini 1.5 Pro** and **Claude 3 Sonnet** on internal benchmarks at launch. ([Wikipedia][1])
* Focus on **better coding and reasoning**, with plans for multilingual and multimodal extensions. ([Wikipedia][1])

Llama 3 became the core of the **Meta AI assistant**, integrated into WhatsApp, Instagram, Facebook, and the meta.ai website in many countries. ([Medium][11])

---

### Llama 3.1 (July 2024) – Up to 405B Parameters & Long Context

In **July 2024**, Meta released **Llama 3.1** in **8B, 70B, and 405B** sizes. ([Wikipedia][1])

Key upgrades:

* **405B‑parameter model** – Among the largest open‑weight LLMs, positioned to rival top proprietary models like GPT‑4o and Claude 3.5 on MMLU, GPQA, MATH, and HumanEval. ([IBM][12])
* **128K token context** for all Llama 3.1 sizes (16× Llama 3). ([Amazon Web Services, Inc.][13])
* **Multilingual support** (at least 8 major languages) and stronger tool‑use capabilities. ([Amazon Web Services, Inc.][13])

Cloud providers like **AWS, IBM, and others** quickly onboarded Llama 3.1, emphasizing its combination of **open weights and enterprise‑grade performance**. ([Amazon Web Services, Inc.][13])

---

### Llama 3.2 & 3.3 (Late 2024) – Small, Multimodal, and Edge‑Ready

**Llama 3.2** (September 2024) introduced a family of **smaller models**—**1B, 3B, 11B, and 90B**—with **128K context** and a focus on **efficiency and multimodality**:

* Text‑only 1B/3B models optimized for mobile and edge devices. ([Hugging Face][14])
* **Vision‑enabled 11B and 90B “vision‑instruct” variants**, serving as multimodal LLMs that can process images and text together. ([NVIDIA Documentation][9])

Clouds such as Oracle Cloud Infrastructure added Llama 3.2 quickly, marketing it as a **small, multimodal model line** for real‑time applications. ([Oracle Blogs][15])

**Llama 3.3** (December 2024) is an incremental **70B** update that further improves performance and keeps the 128K context window, essentially serving as a refined “late‑Llama‑3” flagship. ([Wikipedia][1])

---

### Llama 4 (April 2025) – Mixture‑of‑Experts, 10M Context & New Controversies

**Llama 4**, released **April 5, 2025**, marks a major architectural shift to a **mixture‑of‑experts (MoE)** design and full **text+image multimodality** across 12 languages. ([Wikipedia][1])

Two main released variants (both with base and instruct versions): ([Wikipedia][1])

* **Llama 4 Scout** – 17B *active* parameters, 16 experts, total ~109B parameters, **10M‑token context window**.
* **Llama 4 Maverick** – 17B active parameters, 128 experts, ~400B parameters total, **1M‑token context window**.

Meta also announced but did *not* release **Llama 4 “Behemoth”**, a ~2T‑parameter MoE model with 288B active parameters. Maverick is codistilled from Behemoth; Scout is trained from scratch. ([Wikipedia][1])

Training data includes **public, licensed, and Meta‑proprietary data**, such as public posts from Instagram and Facebook and user interactions with Meta AI, with a knowledge cutoff around **August 2024**. ([Wikipedia][1])

Meta claimed that Llama 4 **outperformed GPT‑4o on the LMArena benchmark**, but the score used an unreleased “experimental chat” variant optimized for human preference. The benchmark maintainers later tightened their policies, and the episode spurred debate about **benchmark gaming and transparency**. ([Wikipedia][1])

---

## Visual & Audio Generative Models: Emu, CM3leon & MusicGen

Alongside Llama, Meta has built a substantial portfolio of **image, video, and music models** that power features like **Imagine with Meta AI** and Instagram’s **Restyle**.

### CM3leon (2023) – Efficient Text‑to‑Image with Retrieval

**CM3leon** is an autoregressive, retrieval‑augmented text‑to‑image model that demonstrated competitive quality with better efficiency than diffusion models on standard benchmarks. It combines a transformer over discrete image tokens with retrieval of relevant reference images, helping Meta explore alternatives to pure diffusion approaches. ([Meta AI][16])

### Emu, Emu Video & Emu Edit (2023–2025) – The Emu Visual Stack

Meta’s **Emu** family is the backbone of its image and video generation features:

* **Emu (2023)** – A quality‑tuned image generator; Meta describes it as an image foundation model fine‑tuned with a “small number of high‑quality examples” to push aesthetic quality, reportedly winning a large majority of human preference comparisons. ([Meta AI][17])
* **Emu Video (2023)** – A diffusion‑based **text‑to‑video** system that factorizes generation into two stages and can condition on text, images, or both. ([Emu Video][18])
* **Emu Edit (2023)** – A multi‑task **image editing** model that handles region‑based and free‑form edits using “task embeddings” to steer the generation process, aiming for precise, instruction‑following edits. ([Emu Edit][19])

These models power **Imagine with Meta AI**—Meta’s text‑to‑image experience—and emerging editing tools like **Instagram Restyle**, which lets users alter photos and videos via text prompts. ([Medium][11])

#### Emu 3.5 (2025) – Higher‑Capacity Image Generation

By 2025, **Emu 3.5** appears as a ~**34B‑parameter** image model trained on over **13T multimodal tokens** (mostly video frames and transcripts), supporting both text‑to‑image and image‑to‑image workflows with stronger realism and consistency. ([Overchat AI][20])

### Audiocraft & MusicGen (2023) – Foundation Models for Music

Meta’s **Audiocraft** project introduced **MusicGen**, a single transformer‑style model for text‑to‑music generation that can also condition on a melody. It was open‑sourced with code and samples, and became a popular base for music generation research and creative tools. ([AudioCraft][21])

---

## Technological Trends Across Meta AI Models

Across Llama, Emu, and earlier FAIR models, you can see a few clear trends:

1. **Open‑Weight, Not Fully Open‑Source**
   Meta consistently releases **weights and recipes**, but under **source‑available licenses with acceptable‑use policies** rather than OSI‑approved open‑source licenses. This makes Llama widely hackable while still letting Meta enforce some constraints. ([Wikipedia][1])

2. **Data‑First Scaling**
   Llama 3 and beyond emphasize **massive, cleaner datasets** (15T+ tokens) and show that performance continues to scale with data even past Chinchilla‑optimal regimes, especially when combined with strong filtering and synthetic data. ([Wikipedia][1])

3. **Multimodality via Parallel Families**
   Instead of building one giant omni‑model from the start, Meta has taken a **modular approach**: Llama for text/tool use, Emu for images/video, MusicGen for music, and now Llama 4 as a text+image MoE. These are gradually fused into product experiences like Meta AI chat, Imagine, and Restyle. ([Wikipedia][1])

4. **Edge & Ecosystem Focus**
   Llama 3.2’s small models and the 3.x line overall are tailored for **on‑device and edge deployment**, and Meta actively encourages hosting Llama on third‑party clouds and hardware platforms (AWS, Azure, Oracle, IBM, NVIDIA, etc.), betting that **Llama becomes the “Linux of AI”**. ([Oracle Blogs][15])

5. **Dedicated Safety Models**
   Instead of baking all safety into one monolithic LLM, Meta invests in **separate safety models** (Llama Guard 3/4, Prompt Guard) aligned to shared hazard taxonomies, which developers can compose with Llama deployments. ([Hugging Face][8])

---

## The Role of AI Ethics, Openness & Governance

Meta’s strategy is unusually “open” for a mega‑platform, but it comes with complex trade‑offs:

* **Licensing & Open‑Source Debate** – Llama 2+ weights are free to download, modify, and deploy with few restrictions, yet the license is not considered open source by the OSI, raising questions about what “open” really means in frontier AI. ([Wikipedia][1])

* **Training Data & Copyright** – Llama models have faced lawsuits over alleged use of copyrighted books and datasets like Library Genesis and Books3. A key 2025 case around Trump’s *Art of the Deal* was dismissed, but the ruling did *not* resolve the legality of using copyrighted works in training data, and litigation continues across the industry. ([Wikipedia][1])

* **Social Data & Consent** – Llama 4 training includes public posts from Instagram and Facebook, plus user interactions with Meta AI—intensifying long‑standing concerns about user consent, privacy, and surveillance‑based data collection. ([Wikipedia][1])

* **National Security & Open Models** – Meta now allows U.S. government agencies and contractors to use Llama for some national‑security‑related tasks (logistics, cyber, terrorism analysis), while formally banning direct “warfare” applications in its policies. This highlights the tension between **open models and geopolitical competition**. ([The Verge][22])

* **Safety Infrastructure** – On the positive side, Meta’s Llama Guard line, Emu watermarks, and content filters for tools like Imagine and Restyle show a serious attempt to create **shared, standardized safety components** for open ecosystems. ([Hugging Face][8])

---

## Future Outlook for Meta’s AI Models

Looking ahead (speculatively, based on public signals):

* Expect **continued expansion of the Llama 4 family** (more languages, broader multimodality, possibly audio/video) and likely a **Llama 5** with stronger reasoning, tool use, and agent‑style workflows. ([Wikipedia][1])
* **On‑device Llama** will probably become central to Meta’s hardware—Ray‑Ban smart glasses, Quest headsets, and mobile apps—driving “intelligent AR overlays” and personal assistants that work with partial connectivity. ([Reuters][23])
* The **Emu line** (including Emu 3.5) is likely to converge with Llama 4‑style models, leading to richer, interactive multimodal assistants that can see, edit, and generate images and videos in real time. ([Overchat AI][20])
* Meta will remain at the center of debates over **open‑weight models, copyright, and AI safety**, especially as Llama 3/4 models are used by banks, telcos, defense contractors, and millions of independent developers. ([Reuters][23])

---

## Conclusion

The history of **Meta AI models** runs from early multilingual and seq2seq models like **BART** and **XLM‑R**, through the **Llama** family (1–4), to visual and audio systems like **Emu** and **MusicGen**. Each phase has pushed a different frontier:

* **Llama** – open‑weight, increasingly capable, and now MoE‑based long‑context LLMs.
* **Emu & CM3leon** – high‑quality text‑to‑image/video and editing models.
* **MusicGen** – accessible music generation for creators.
* **Llama Guard & friends** – safety and moderation as first‑class models.

Together, they reflect Meta’s bet that **open, widely distributed foundation models**—paired with strong guardrails—will shape the next era of AI, not just in standalone products but embedded across social platforms, messaging, AR, and beyond.

---

* [The Guardian](https://www.theguardian.com/technology/article/2024/jul/23/meta-launches-open-source-ai-app-competitive-with-closed-rivals?utm_source=chatgpt.com)
* [Reuters](https://www.reuters.com/technology/artificial-intelligence/meta-says-its-llama-ai-models-being-used-by-banks-tech-companies-2024-08-29/?utm_source=chatgpt.com)
* [The Verge](https://www.theverge.com/2024/11/4/24287951/meta-ai-llama-war-us-government-national-security?utm_source=chatgpt.com)
* [Lifewire](https://www.lifewire.com/what-to-know-llama-3-8713943?utm_source=chatgpt.com)
* [New York Post](https://nypost.com/2025/06/30/business/lawsuit-accusing-meta-of-stealing-from-trumps-art-of-the-deal-dismissed/?utm_source=chatgpt.com)
* [TechRadar](https://www.techradar.com/ai-platforms-assistants/how-to-use-instagrams-new-restyle-ai-tool-to-reimagine-your-photos?utm_source=chatgpt.com)

[1]: https://en.wikipedia.org/wiki/Llama_%28language_model%29 "Llama (language model) - Wikipedia"
[2]: https://arxiv.org/abs/1910.13461?utm_source=chatgpt.com "BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation, Translation, and Comprehension"
[3]: https://arxiv.org/abs/1911.02116?utm_source=chatgpt.com "Unsupervised Cross-lingual Representation Learning at Scale"
[4]: https://huggingface.co/facebook/m2m100_418M?utm_source=chatgpt.com "facebook/m2m100_418M"
[5]: https://about.fb.com/news/2022/08/blenderbot-ai-chatbot-improves-through-conversation/?utm_source=chatgpt.com "BlenderBot 3: An AI Chatbot That Improves Through ..."
[6]: https://about.fb.com/news/2021/06/helping-build-better-translation-systems-around-the-world/?utm_source=chatgpt.com "Helping Build Better Translation Systems Around the World"
[7]: https://ai.meta.com/research/publications/llama-guard-llm-based-input-output-safeguard-for-human-ai-conversations/ "ai.meta.com"
[8]: https://huggingface.co/meta-llama/Llama-Guard-3-8B "meta-llama/Llama-Guard-3-8B · Hugging Face"
[9]: https://docs.api.nvidia.com/nim/reference/meta-llama-guard-4-12b "meta / llama-guard-4-12b"
[10]: https://www.llama.com/llama-protections/?utm_source=chatgpt.com "Llama Protections"
[11]: https://medium.com/generative-ai-art/meta-ais-text-to-image-generative-ai-tool-2ff5e0ec8055?utm_source=chatgpt.com "Meta AI's Text-to-Image Generative AI tool | by Edmond Yip"
[12]: https://www.ibm.com/think/news/meta-releases-llama-3-1-models-405b-parameter-variant "Meta releases new Llama 3.1 models, including highly anticipated 405B parameter variant | IBM"
[13]: https://aws.amazon.com/blogs/aws/announcing-llama-3-1-405b-70b-and-8b-models-from-meta-in-amazon-bedrock/ "Announcing Llama 3.1 405B, 70B, and 8B models from Meta in Amazon Bedrock | AWS News Blog"
[14]: https://huggingface.co/meta-llama/Llama-3.2-1B?utm_source=chatgpt.com "meta-llama/Llama-3.2-1B"
[15]: https://blogs.oracle.com/ai-and-datascience/announcing-metas-llama-32 "Announcing Meta’s Llama 3.2 90B and 11B models on OCI Generative AI | ai-and-datascience"
[16]: https://ai.meta.com/blog/generative-ai-text-images-cm3leon/?utm_source=chatgpt.com "Introducing CM3leon, a more efficient, state-of-the-art ..."
[17]: https://ai.meta.com/research/publications/emu-enhancing-image-generation-models-using-photogenic-needles-in-a-haystack/?utm_source=chatgpt.com "Emu: Enhancing Image Generation Models Using ..."
[18]: https://emu-video.metademolab.com/?utm_source=chatgpt.com "Emu Video | Meta"
[19]: https://emu-edit.metademolab.com/?utm_source=chatgpt.com "Emu Edit"
[20]: https://overchat.ai/ai-hub/emu-3-5-and-chronoedit?utm_source=chatgpt.com "Emu 3.5 and ChronoEdit — New Image Models Now ..."
[21]: https://audiocraft.metademolab.com/musicgen.html?utm_source=chatgpt.com "MusicGen - AudioCraft"
[22]: https://www.theverge.com/2024/11/4/24287951/meta-ai-llama-war-us-government-national-security?utm_source=chatgpt.com "Meta AI is ready for war"
[23]: https://www.reuters.com/technology/artificial-intelligence/meta-says-its-llama-ai-models-being-used-by-banks-tech-companies-2024-08-29/?utm_source=chatgpt.com "Meta says its Llama AI models being used by banks, tech companies"
