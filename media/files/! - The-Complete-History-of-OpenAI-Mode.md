

# The Complete History of OpenAI Models

## From GPT-1 to GPT-5

**OpenAI models** have transformed the landscape of artificial intelligence, redefining what’s possible in natural language processing, machine learning, and generative AI. From the early days of **GPT-1** to the capabilities of **GPT-5**, each iteration has brought significant advancements in architecture, training data, and real-world applications.

In this guide, we’ll explore the evolution of OpenAI models, highlighting key changes, improvements, and technological breakthroughs at each stage.

### GPT-1 (June 11, 2018) – The Proof of Concept

The first in the series of OpenAI models, **GPT-1**, was based on the transformer architecture introduced by **Vaswani et al. (2017)**. With **117 million parameters**, GPT-1 was trained on the **BooksCorpus** dataset (over **7,000** unpublished books), establishing large-scale unsupervised pre-training as a viable approach. ([OpenAI][1])

**Key advancements:**

- Established the modern pre-train-then-fine-tune recipe for NLP tasks. ([OpenAI][1])
- Demonstrated strong transfer from large-scale unsupervised text to supervised benchmarks. ([OpenAI][1])
- Validated transformer decoders as a scalable backbone for language modeling. ([OpenAI][1])

**Technical details:**

- ~117M parameters. ([OpenAI][1])
- 12-layer decoder-only transformer architecture. ([OpenAI][1])
- Trained on BooksCorpus with a next-token prediction objective. ([OpenAI][1])

### GPT-2 (February 14, 2019) – Scaling Up and Raising Concerns

GPT-2 expanded the GPT architecture to **1.5B parameters**, trained on the **WebText** dataset (**8 million high-quality web pages**). This leap in scale brought dramatic improvements in natural language generation, alongside renewed focus on deployment risks and responsible release strategies. ([OpenAI][2])

**Key advancements:**

- Showed much stronger long-form coherence and fluency at larger scale. ([OpenAI][2])
- Highlighted practical zero-shot task behavior at a level that drew wide attention. ([OpenAI][2])
- Elevated discussion of staged releases and misuse concerns for generative models. ([OpenAI][2])

**Technical details:**

- Full-release model size: 1.5B parameters. ([OpenAI][30])
- Trained on WebText (as described by OpenAI). ([OpenAI][2])
- Released in stages, culminating in publication of the full 1.5B weights. ([OpenAI][30])

### GPT-3 (May 28, 2020) – The 175 Billion Parameter Leap

GPT-3 marked a paradigm shift in large language models, scaling to **175B parameters** and trained on a mixture of Common Crawl, WebText2, Books, and Wikipedia. ([OpenAI][3])

**Key advancements:**

- Popularized few-shot prompting as a practical interface for new tasks. ([OpenAI][3])
- Demonstrated broad versatility without per-task fine-tuning. ([OpenAI][3])
- Brought “emergent behaviors” from scaling into mainstream discussion. ([OpenAI][3])

**Technical details:**

- 175B parameters. ([OpenAI][3])
- Trained on a mixture of Common Crawl, WebText2, Books, and Wikipedia. ([OpenAI][3])
- Autoregressive next-token prediction objective (decoder-only transformer). ([OpenAI][3])

### DALL·E (January 5, 2021) – The First Text-to-Image GPT

In **January 2021**, OpenAI introduced **DALL·E**, a 12B-parameter transformer trained to generate images directly from text prompts. ([OpenAI][4])

**Key advancements:**

- Demonstrated large-scale text-to-image generation using a GPT-style transformer approach. ([OpenAI][4])
- Showed compositional generation from language (“combine concepts”) as a core capability. ([OpenAI][4])
- Established a foundation for later DALL·E generations and editing workflows. ([OpenAI][4])

**Technical details:**

- 12B-parameter transformer (as described by OpenAI). ([OpenAI][4])
- Trained to map from text prompts to image generations in a token-based formulation. ([OpenAI][4])
- Early outputs were lower fidelity than later generations, reflecting the state of the approach. ([OpenAI][4])

### Codex (August 10, 2021) – Specialization for Code

**Codex** is a specialized branch of OpenAI models fine-tuned from GPT-3 for programming tasks, translating natural language into code and powering early coding assistants. ([OpenAI][5])

**Key advancements:**

- Made natural-language-to-code generation a mainstream developer workflow. ([OpenAI][5])
- Improved code completion and synthesis across multiple languages. ([OpenAI][5])
- Helped popularize “AI pair programming” and code-assist products. ([OpenAI][5])

**Technical details:**

- Fine-tuned from GPT-3 for code generation tasks. ([OpenAI][5])
- Trained on natural language plus large volumes of publicly available code. ([OpenAI][5])
- Operates autoregressively, conditioning on user prompts and surrounding context. ([OpenAI][5])

### DALL·E 2 (April 2022) – Higher Fidelity and Realism

In **April 2022**, OpenAI announced **DALL·E 2**, a major upgrade with **4× higher resolution** and more photorealistic results. ([OpenAI][6])

**Key advancements:**

- **Sharper, more detailed images** suitable for design workflows. ([OpenAI][6])
- **Image editing (“inpainting”)**: Modify parts of an existing image with new text instructions. ([OpenAI][6])
- **Safety & access controls**: Gradual rollout and filtering to reduce harmful generations. ([OpenAI][6])

**Technical details:**

- 4× higher resolution than the prior generation (per OpenAI’s announcement). ([OpenAI][6])
- Supports inpainting and variations as part of the product workflow. ([OpenAI][6])
- Shipped with safety controls and staged access as described by OpenAI. ([OpenAI][6])

### Whisper (September 21, 2022) – Foundation Model for Speech

Released in **September 2022**, **Whisper** is OpenAI’s large-scale speech recognition foundation model: an encoder–decoder transformer trained on multilingual, multitask web audio. ([OpenAI][7])

**Key advancements:**

- Enabled general-purpose multilingual transcription and speech translation. ([OpenAI][7])
- Improved robustness to accents, background noise, and domain jargon. ([OpenAI][7])
- Released openly, enabling widespread community adoption and tooling. ([GitHub][8])

**Technical details:**

- Encoder–decoder transformer architecture. ([OpenAI][7])
- Trained on multilingual, multitask web audio (per OpenAI). ([OpenAI][7])
- Served as the basis for OpenAI’s `whisper-1` speech-to-text API model. ([OpenAI Platform][9])

### GPT-3.5 / ChatGPT (November 30, 2022) – The Conversational Bridge

GPT-3.5 served as a bridge between GPT-3 and GPT-4, refining conversational abilities and reducing latency. It powered the first public release of **ChatGPT** on **November 30, 2022**. ([OpenAI][10])

**Key advancements:**

- Turned LLMs into a mainstream conversational product via ChatGPT. ([OpenAI][10])
- Improved instruction following and conversational usefulness compared to earlier GPT-3 deployments. ([OpenAI][10])
- Established chat-based UX as the default interface for many LLM use cases. ([OpenAI][10])

**Technical details:**

- GPT-3.5 family model used for the first ChatGPT release. ([OpenAI][10])
- Trained with human feedback and safety mitigations (as described by OpenAI). ([OpenAI][10])
- Product launch date: Nov 30, 2022 (ChatGPT). ([OpenAI][10])

### GPT-4 (March 14, 2023) – Multimodal Intelligence

GPT-4 represented a major leap in generative AI capabilities, including multimodal input and improved reasoning. ([OpenAI][11])

**Key advancements:**

- Introduced a flagship multimodal model that can take text + image inputs. ([OpenAI][11])
- Improved reliability on complex reasoning and professional tasks. ([OpenAI][11])
- Became the foundation for later GPT-4 variants and the GPT-4o family. ([OpenAI][11])

**Technical details:**

- Supports multimodal inputs (text + images) in the GPT-4 family. ([OpenAI][11])
- Released with evaluations and safety framing alongside the announcement. ([OpenAI][11])
- Deployed through OpenAI products and APIs under staged access. ([OpenAI][11])

### DALL·E 3 (September 2023) – Deeper Prompt Understanding

In **September 2023**, OpenAI introduced **DALL·E 3**, focused on better prompt fidelity (understanding nuance, attributes, and layouts more precisely than earlier versions). ([OpenAI][12])

**Key advancements:**

- Improved prompt fidelity for complex, compositional image requests. ([OpenAI][12])
- Integrated into ChatGPT workflows for iterative prompting and refinements. ([OpenAI][12])
- Began being superseded in ChatGPT by GPT-4o-powered image generation in 2025 for many use cases. ([The Verge][13])

**Technical details:**

- Released as an OpenAI image generation product with ChatGPT-based creation flows. ([OpenAI][12])
- Designed to follow natural-language instructions more precisely than prior DALL·E versions. ([OpenAI][12])
- Safety controls and usage constraints were described alongside the launch. ([OpenAI][12])

### GPT-4 Turbo (November 6, 2023) – Cheaper, Longer-Context GPT-4

OpenAI released **GPT-4 Turbo** at its first DevDay event in **November 2023**, positioning it as a more practical GPT-4 variant for large-scale usage. ([OpenAI][14])

**Key advancements:**

- **128K context window** for very long prompts. ([OpenAI][14])
- **Lower cost** than GPT-4 for long-context workloads. ([OpenAI][14])
- **Fresher knowledge cutoff** (training data extended to April 2023). ([OpenAI][14])

**Technical details:**

- GPT-4 family variant (“Turbo”) announced at DevDay. ([OpenAI][14])
- Context window up to 128K tokens (per OpenAI). ([OpenAI][14])
- Shipped as part of a broader set of platform and API updates at DevDay. ([OpenAI][14])

### GPT-4o (May 13, 2024) – Omni Multimodal Flagship

In **May 2024**, OpenAI announced **GPT-4o** (“o” for omni), a flagship model trained end-to-end across text, vision, and audio. ([OpenAI][15])

**Key advancements:**

- Unified text, vision, and audio as an “omni” model family. ([OpenAI][15])
- Improved latency and cost trade-offs relative to earlier GPT-4 variants. ([OpenAI][15])
- Powered newer image generation experiences in ChatGPT that began replacing DALL·E 3 for many use cases. ([The Verge][13])

**Technical details:**

- Trained end-to-end across text, vision, and audio (per OpenAI). ([OpenAI][15])
- Released across OpenAI products and the API as described in the announcement. ([OpenAI][15])
- Designed to support more real-time style interactions via faster responses. ([OpenAI][15])

### GPT-4o mini (July 18, 2024) – Cost-Efficient Intelligence

In **July 2024**, OpenAI introduced **GPT-4o mini**, a smaller, cheaper variant aimed at high-volume and latency-sensitive workloads. ([OpenAI][16])

**Key advancements:**

- Lowered the cost floor for deploying GPT-4o-family capabilities. ([OpenAI][16])
- Increased accessibility for apps that need fast responses at scale. ([OpenAI][16])
- Provided a clearer cost/quality option alongside GPT-4o. ([OpenAI][16])

**Technical details:**

- Smaller GPT-4o-family model optimized for efficiency (per OpenAI). ([OpenAI][16])
- Intended for high-throughput workloads where price and latency dominate. ([OpenAI][16])
- Released as an API model and used within OpenAI products (as described). ([OpenAI][16])

### o1 (September 12, 2024) – Reasoning-First Model

With **o1**, OpenAI introduced a reasoning-focused model designed to spend more compute “thinking” before responding. ([OpenAI][17])

**Key advancements:**

- Introduced “reasoning models” optimized for difficult math, science, and coding. ([OpenAI][17])
- Made “spend more compute to think” a first-class trade-off in the model lineup. ([OpenAI][17])
- Marked the start of the o-series as a distinct reasoning-oriented family. ([OpenAI][17])

**Technical details:**

- Trained and evaluated with a focus on reasoning performance (as described by OpenAI). ([OpenAI][17])
- Designed to allocate additional compute for harder questions. ([OpenAI][17])
- Released with product/API positioning and evaluation framing in the announcement. ([OpenAI][17])

### o1-mini (September 12, 2024) – Cost-Efficient Reasoning

Alongside o1, OpenAI introduced **o1-mini**, a more cost-efficient reasoning variant for many STEM-heavy workloads. ([OpenAI][18])

**Key advancements:**

- Brought reasoning-focused performance to more cost-sensitive deployments. ([OpenAI][18])
- Expanded the o-series lineup beyond a single flagship option. ([OpenAI][18])
- Made reasoning performance more accessible for high-volume STEM workloads. ([OpenAI][18])

**Technical details:**

- Positioned as a smaller, more cost-efficient member of the o1 family. ([OpenAI][18])
- Designed to preserve key reasoning strengths with lower cost/latency trade-offs. ([OpenAI][18])
- Released with deployment guidance and positioning in OpenAI’s announcement. ([OpenAI][18])

### Sora (December 9, 2024) – Production Video Generation

OpenAI launched **Sora** to the public in **December 2024**, making high-quality text-to-video generation more broadly available. ([OpenAI][19])

**Key advancements:**

- Brought high-quality text-to-video generation into a broader product rollout. ([OpenAI][19])
- Expanded creative control for generative video while emphasizing safe deployment. ([OpenAI][19])
- Documented risks, mitigations, and evaluation in a dedicated system card. ([OpenAI][20])

**Technical details:**

- Product launch and access described in the “Sora is here” announcement. ([OpenAI][19])
- Risk areas and safeguards documented in the Sora system card. ([OpenAI][20])
- Supports text prompting and creation controls as described in OpenAI’s product materials. ([OpenAI][19])

### GPT-4.5 (February 27, 2025) – The Transitional Giant

Released in **February 2025**, **GPT-4.5** was positioned as an intermediate release in the GPT-4-era lineage before later 2025 models. ([OpenAI][21])

**Key advancements:**

- Continued the GPT-4-era performance trajectory ahead of GPT-5. ([OpenAI][21])
- Expanded the set of available flagship options for advanced workloads. ([OpenAI][21])
- Provided an interim “best available” model choice during the 2025 transition. ([OpenAI][21])

**Technical details:**

- Announced as a distinct GPT family release (“GPT-4.5”). ([OpenAI][21])
- Packaged for API/product usage as described in the OpenAI announcement. ([OpenAI][21])
- Evaluation and safety framing provided alongside the release. ([OpenAI][21])

### GPT-4.1 (April 14, 2025) – High-Performance Long-Context Model

Launched in **April 2025**, **GPT-4.1** and its mini/nano variants deliver substantial gains over earlier GPT-4 models, including long-context comprehension and strong coding performance. ([OpenAI][22])

**Key advancements:**

- Introduced a 1 million token context option for ultra-long documents and codebases. ([OpenAI][22])
- Improved instruction following and developer-oriented performance. ([OpenAI][22])
- Added mini/nano variants to better cover cost and latency needs. ([OpenAI][22])

**Technical details:**

- Context window up to 1 million tokens (per OpenAI). ([OpenAI][22])
- Released as an API-focused model family with multiple variants. ([OpenAI][22])
- Positioned for long-context comprehension and coding-heavy workloads. ([OpenAI][22])

### o3 (April 16, 2025) – Frontier Reasoning

Released in **April 2025**, **OpenAI o3** represents a major step forward in the o-series: a reasoning model trained to think longer before responding, with deeper tool use and stronger multimodal reasoning. ([OpenAI][23])

**Key advancements:**

- Advanced the o-series reasoning focus beyond o1. ([OpenAI][23])
- Strengthened tool use for more agentic workflows. ([OpenAI][23])
- Positioned as a frontier reasoning model in OpenAI’s lineup. ([OpenAI][23])

**Technical details:**

- Released as part of the o3 / o4-mini announcement. ([OpenAI][23])
- Framed as a reasoning model designed for longer “thinking” before responding. ([OpenAI][23])
- Evaluation and safety considerations described in OpenAI’s release materials. ([OpenAI][23])

### o4-mini (April 16, 2025) – Efficient Frontier Reasoning

Alongside o3, OpenAI released **o4-mini** as a smaller, more cost-efficient reasoning model option. ([OpenAI][23])

**Key advancements:**

- Expanded the o-series with an efficiency-focused option for broader deployment. ([OpenAI][23])
- Preserved core reasoning and tool-use positioning with lower cost/latency trade-offs. ([OpenAI][23])
- Supported reasoning workflows where throughput and cost are critical constraints. ([OpenAI][23])

**Technical details:**

- Released under the same announcement as o3, positioned as a smaller counterpart. ([OpenAI][23])
- Intended to deliver strong reasoning at lower cost than frontier-scale models. ([OpenAI][23])
- Details and positioning provided in OpenAI’s release materials. ([OpenAI][23])

### GPT-OSS (August 5, 2025) – Open-Weight Freedom

OpenAI’s **GPT-OSS** marks its first open-weight model release since GPT-2, a major shift toward transparency and developer empowerment.

**Key advancements:**

- Returned to open-weight releases as a first-class strategy (after years of closed frontier models). ([OpenAI][31])
- Enabled local and self-hosted deployment for more developer control. ([OpenAI][31])
- Positioned as “open-weight models” with supporting documentation for usage and safety. ([OpenAI][31])

**Technical details:**

- Released under an open license (as described in OpenAI’s open-weight materials). ([OpenAI][31])
- Accompanied by a model card describing safety, capabilities, and limitations. ([OpenAI][32])
- Framed explicitly as “open-weight” (weights available; not necessarily fully open training data/code). ([OpenAI][31])

### GPT-5 (August 7, 2025) – The Next Frontier

GPT-5 marks a major leap in capability, combining multimodal skills, long-context handling, and adaptive reasoning modes in one system. ([OpenAI][24])

**Key advancements:**

- Positioned as the next major step after the GPT-4 and GPT-4o era. ([OpenAI][24])
- Emphasized broad capability improvements across common AI workloads. ([OpenAI][24])
- Consolidated model-family direction under the GPT-5 banner. ([OpenAI][24])

**Technical details:**

- Released as the GPT-5 family in OpenAI products and the API. ([OpenAI][24])
- Technical and product positioning documented in OpenAI’s launch materials. ([OpenAI][24])
- Evaluations and release framing provided alongside the announcement. ([OpenAI][24])

### Sora 2 (September 30, 2025) – Video + Audio Generation

In **September 2025**, OpenAI introduced **Sora 2**, positioning it as a new state-of-the-art model for **video generation with synchronized audio**, building on the original Sora while expanding realism, steerability, and stylistic range. ([OpenAI][29])

OpenAI also published details on how it approached safety, provenance, likeness protections, and content moderation as part of the Sora 2 and Sora app rollout. ([OpenAI][28])

**Key advancements:**

- Added synchronized audio generation alongside high-quality video generation. ([OpenAI][27])
- Improved realism and controllability compared to Sora 1 (as described in the system card). ([OpenAI][27])
- Shipped with an explicit “launching responsibly” framework and provenance controls. ([OpenAI][28])

**Technical details:**

- Capabilities, risks, and mitigations documented in the Sora 2 system card. ([OpenAI][27])
- Rollout constraints and safety measures detailed in “Launching Sora responsibly.” ([OpenAI][28])
- Announced alongside product availability information (e.g., via sora.com). ([OpenAI][29])

### GPT-5.1 (November 12, 2025) – Smarter, More Conversational GPT-5

In **November 2025**, OpenAI released **GPT‑5.1** as an iterative upgrade to the GPT‑5 family, focused on making ChatGPT feel warmer, more natural, and more reliable in everyday use. ([OpenAI][25])

**Key advancements:**

- Improved everyday conversational quality within the GPT-5 generation. ([OpenAI][25])
- Strengthened instruction-following and “feel” for common chat interactions. ([OpenAI][25])
- Continued the point-release pattern for iterative quality and safety improvements. ([OpenAI][25])

**Technical details:**

- Released as a GPT-5 family update (not a new generation). ([OpenAI][25])
- Positioned as an upgrade for ChatGPT and related GPT-5 deployments. ([OpenAI][25])
- Technical and product deltas described in OpenAI’s announcement. ([OpenAI][25])

### GPT-5.2 (December 11, 2025) – Stronger Long-Context, Tool Use, and Vision

In **December 2025**, OpenAI introduced **GPT‑5.2**, emphasizing gains in long-context understanding, tool use reliability, and vision. ([OpenAI][26])

**Key advancements:**

- Improved long-context performance for professional knowledge work. ([OpenAI][26])
- Increased tool-use reliability for agentic workflows. ([OpenAI][26])
- Strengthened vision understanding and chart/UI interpretation. ([OpenAI][26])

**Technical details:**

- Released as an iterative GPT-5 family update with deployment details in the announcement. ([OpenAI][26])
- Positioned to support tool-calling and multi-step workflows more reliably. ([OpenAI][26])
- Benchmarks and evaluation framing included in OpenAI’s release materials. ([OpenAI][26])

### Technological Trends Across OpenAI Models

Across the timeline above, a few repeated technical themes stand out:

1. **Scale → generality**: Larger models trained on broader data mixtures tend to unlock more general-purpose behavior (and more effective prompting), as popularized by GPT-3. ([OpenAI][3])
2. **Product-first interfaces**: The “chat” interface turned language models into a daily tool for millions, shifting the center of gravity from research demos to interaction design (memory, tools, safety, UX). ([OpenAI][10])
3. **Multimodal convergence**: The frontier moved from text-only (GPT-3 era) to models designed for text + images, and then to “omni” systems spanning text, vision, and audio. ([OpenAI][11]) ([OpenAI][15])
4. **Reasoning as a controllable trade-off**: The o-series emphasizes deliberate reasoning and tool use, treating extra compute and structured “thinking” as a first-class knob rather than a side effect. ([OpenAI][17]) ([OpenAI][23])
5. **Open vs. closed distribution**: The GPT-OSS release signals renewed interest in open-weight deployments for some parts of the stack, even as frontier systems remain tightly managed. ([OpenAI][31])

### The Role of AI Ethics in Model Development

As OpenAI models became more capable and more widely deployed, safety moved from a “nice to have” to a core design constraint. Three patterns recur across releases:

- **Staged releases and risk framing**: GPT-2’s rollout made “capability vs. misuse” a public part of release strategy, not just an internal concern. ([OpenAI][2])
- **Alignment via human feedback**: ChatGPT’s success came with an emphasis on making model behavior more helpful and less harmful in practice, not just more accurate in benchmarks. ([OpenAI][10])
- **System cards for frontier media models**: For video generation in particular, OpenAI paired launches with system cards describing known risks, mitigations, and evaluation approaches (Sora and Sora 2). ([OpenAI][20]) ([OpenAI][27]) ([OpenAI][28])

### Future Outlook for OpenAI Models

Looking ahead, the most likely direction is not “one magic model,” but **systems**: models plus tools, memory, and safety infrastructure that make them reliable in real workflows.

- **Long-context becomes normal**: Long documents, codebases, and multi-step tasks push context windows and retrieval tooling to the forefront (as seen with GPT-4.1). ([OpenAI][22])
- **Multimodal as the default**: Expect more everyday interactions that blend text, images, audio, and video (GPT-4 → GPT-4o → Sora/Sora 2). ([OpenAI][11]) ([OpenAI][15]) ([OpenAI][19]) ([OpenAI][29])
- **Reasoning + tools**: Agentic workflows will likely treat tool use and verification as standard, with “spend more compute to think” as a user-facing control (o1 → o3/o4-mini). ([OpenAI][17]) ([OpenAI][23])
- **Selective openness**: Open-weight releases like GPT-OSS may grow as a parallel track where local deployment, customization, and auditability matter. ([OpenAI][31])

### Conclusion

OpenAI’s model history is a tight loop of **scale**, **interface**, and **deployment reality**: each generation improves raw capability, then product constraints (latency, cost, safety, and usability) shape what comes next.

From GPT-1’s proof-of-concept transformer scaling ([OpenAI][1]) to modern multimodal systems and reasoning-focused variants ([OpenAI][15]) ([OpenAI][23]), the arc is clear: the frontier is increasingly about **reliable, tool-using systems** that can operate safely in the messy environment of real users and real consequences.



[1]: https://openai.com/index/language-unsupervised/ "Improving language understanding with unsupervised learning"
[2]: https://openai.com/index/better-language-models/ "Better language models and their implications"
[3]: https://openai.com/index/language-models-are-few-shot-learners/ "Language models are few-shot learners"
[4]: https://openai.com/index/dall-e/ "DALL·E: Creating images from text"
[5]: https://openai.com/index/openai-codex/ "OpenAI Codex"
[6]: https://openai.com/index/dall-e-2/ "DALL·E 2"
[7]: https://openai.com/index/whisper/ "Introducing Whisper"
[8]: https://github.com/openai/whisper "openai/whisper"
[9]: https://platform.openai.com/docs/guides/speech-to-text "Speech to text - OpenAI API"
[10]: https://openai.com/index/chatgpt/ "Introducing ChatGPT"
[11]: https://openai.com/research/gpt-4 "GPT-4"
[12]: https://openai.com/index/dall-e-3/ "DALL·E 3"
[13]: https://www.theverge.com/openai/635118/chatgpt-sora-ai-image-generation-chatgpt "OpenAI rolls out image generation powered by GPT-4o to ChatGPT"
[14]: https://openai.com/index/new-models-and-developer-products-announced-at-devday/ "New models and developer products announced at DevDay"
[15]: https://openai.com/index/hello-gpt-4o/ "Hello GPT-4o"
[16]: https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/ "GPT-4o mini: Advancing cost-efficient intelligence"
[17]: https://openai.com/index/learning-to-reason-with-llms/ "Learning to reason with LLMs"
[18]: https://openai.com/index/openai-o1-mini-advancing-cost-efficient-reasoning/ "OpenAI o1-mini"
[19]: https://openai.com/index/sora-is-here/ "Sora is here"
[20]: https://openai.com/index/sora-system-card/ "Sora system card"
[21]: https://openai.com/index/introducing-gpt-4-5/ "Introducing GPT-4.5"
[22]: https://openai.com/index/gpt-4-1/ "Introducing GPT-4.1 in the API"
[23]: https://openai.com/index/introducing-o3-and-o4-mini/ "Introducing o3 and o4-mini"
[24]: https://openai.com/index/introducing-gpt-5/ "Introducing GPT-5"
[25]: https://openai.com/index/gpt-5-1/ "GPT-5.1: A smarter, more conversational ChatGPT"
[26]: https://openai.com/index/introducing-gpt-5-2/ "Introducing GPT-5.2"
[27]: https://openai.com/index/sora-2-system-card/ "Sora 2 System Card"
[28]: https://openai.com/index/launching-sora-responsibly/ "Launching Sora responsibly"
[29]: https://openai.com/index/sora-2/ "Sora 2 is here"
[30]: https://openai.com/index/gpt-2-1-5b-release/ "GPT-2: 1.5B release"
[31]: https://help.openai.com/en/articles/11870455-openai-open-weight-models-gpt-oss "OpenAI open-weight models: GPT-OSS"
[32]: https://openai.com/index/gpt-oss-model-card/ "GPT-OSS model card"
