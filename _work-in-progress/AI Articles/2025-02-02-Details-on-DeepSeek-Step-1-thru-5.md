---
layout: post

title: "Details on DeepSeek: Step 1 through 5"
subtitle: "A Deep Dive into the Revolutionary Five-Step Training Pipeline Behind DeepSeek R1's Reasoning Capabilities"
quote: "Think of this like training a dog. You give a command, the dog responds, and if it does the right thing, you give it a treat. Over time, it learns which actions lead to rewards and improves its behavior."
excerpt: "An in-depth technical analysis of DeepSeek R1's groundbreaking five-step training methodology, using dog training metaphors to explain complex reinforcement learning concepts that created the first open-weight reasoning model trained from scratch."
source: "Original Content"
source-url: ""
call-to-action: "Explore each step of the DeepSeek training pipeline to understand how revolutionary AI reasoning models are built from the ground up."

date: 2025-02-02
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
    - DeepSeek R1-Zero is the first open-weight model trained exclusively with large-scale reinforcement learning from scratch
    - Five-step training pipeline combines cold-start RL, supervised fine-tuning, large-scale RL, rejection sampling, and final RL
    - Dog training metaphors make complex AI concepts accessible to general audiences
    - Reinforcement learning training time directly impacts model performance, not just inference time
    - Agile-style training with thousands of rapid updates accelerates reasoning model development

description: "A comprehensive technical breakdown of DeepSeek R1's revolutionary five-step training methodology, explaining how the first open-weight reasoning model was built from scratch using reinforcement learning, with accessible dog training metaphors to illustrate complex AI concepts."

seo-description: "Learn DeepSeek R1's groundbreaking 5-step AI training pipeline: cold-start reinforcement learning, supervised fine-tuning, large-scale RL, rejection sampling, and final optimization for reasoning AI models."

categories: 
    - AI
    - Computers
    - Science

tags: 
    - DeepSeek
    - reinforcement learning
    - AI training
    - reasoning models
    - machine learning
    - R1-Zero
    - supervised fine-tuning
    - rejection sampling
    - PPO algorithm
    - RLHF
    - cold-start training
    - model optimization

keywords: DeepSeek R1, reinforcement learning, AI training pipeline, reasoning models, open-weight models, supervised fine-tuning, rejection sampling, PPO algorithm, RLHF, cold-start training, machine learning methodology

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: 
image-alt: "Diagram showing the five-step DeepSeek R1 training pipeline with dog training metaphors"
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-credits: "Ted Tschopp"
image-credits-URL: "https://tedt.org/"
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image-credits-title: "DeepSeek R1 Training Pipeline"
image-description: "Visual representation of the five-step DeepSeek training methodology using dog training analogies to explain AI concepts"
image-title: "DeepSeek R1: Five Steps to Reasoning AI"

mastodon-post-id: 

---

**Step 1: Training R1-Zero with Synthetic Data to Initialize R1**

_Example for Step 1_

Throughout this paper I will be using the metaphor of training a dog to describe how this will work. To experts in this field, many will see these examples as wrong, or they will be able to come up with better examples. I have spent a lot of time trying to come up with something that most people can connect with and understand.

> You want to get puppy for your kids. You go down to the store and buy the dog. You have two options. You can train the dog yourself, or you can let the dog live over at your friends house who already has 3 well behaved dogs who are well behaved. Traditional AI model training take this second approach. Instead of training your new puppy, you let it spend a couple weeks to a month with the other older dogs and after that time, your dog knows how to behave and is well adjusted. It might not know every command you want, and the dog doesn't know your family, but there is a bunch of work you don't have to do to train your dog properly. The DeepSeek researchers took the approach of training their dog from day one once the dog was born. This takes longer, and your dog might not know how to behave properly in a pack, but overall that's a fair tradeoff.

**Details for Step 1**

DeepSeek R1-Zero represents a groundbreaking advancement as the first **open-weight model trained exclusively using large-scale reinforcement learning (RL) without relying on supervised fine-tuning (SFT) as an initial step.** While rumors suggested OpenAI’s o1 model employed a similar approach, its underlying mechanics were not well understood.

Despite its innovation, R1-Zero exhibits certain reliability issues, including sporadic language shifts during reasoning tasks. These usability challenges highlight a key insight: while large-scale RL is essential for unlocking reasoning capabilities, **it alone is insufficient to produce a fully reliable model**. This underscores the need for additional refinement steps beyond reinforcement learning to create robust reasoning models.

**Breakthrough in Reinforcement Learning Scaling**

DeepSeek’s research introduces a pivotal finding—**demonstrating how reinforcement learning training time directly impacts model performance**. Prior industry focus has primarily been on inference-time scaling, where longer inference times correlate with improved evaluation scores. DeepSeek’s work extends this understanding to training time, providing empirical evidence that prolonged reinforcement learning improves reasoning model quality.

Internal testing suggests that had the team allowed this phase to continue for a longer period, the overall performance of R1 would have further improved. Unlike other AI training curves that plateau, the reinforcement learning phase for R1-Zero **did not reach a saturation point before deployment**. However, hardware constraints and computational resources imposed limitations on further optimization.

If a well-funded research team—particularly in Western institutions—were to replicate this approach using modern hardware and extend training duration, they could likely **achieve significantly higher benchmark scores**. This suggests that reinforcement learning-driven reasoning models have not yet reached their full potential and could benefit from further scaling and refinement.

**The Significance of Cold-Start Training**

Step 1, the **"cold start" phase**, is fundamental for model training. Many AI teams bypass this stage by leveraging existing models as a foundation, rather than training from scratch. DeepSeek’s findings indicate that investing in this phase **yields a stronger final model**, reinforcing the value of a complete end-to-end training pipeline. This insight presents an opportunity for AI teams to revisit their model initialization strategies to enhance reasoning capabilities.

**Optimizing Model Design for Reasoning AI**

DeepSeek’s research also highlights an important consideration for reasoning models: **response verbosity and its impact on reasoning chains**. If a base model generates excessively long responses, it may struggle to maintain logical consistency in multi-step reasoning tasks. This issue suggests that reasoning models could benefit from an optimized balance between verbosity and structured thinking to maintain coherence in complex problem-solving scenarios.

**Agile Training Approaches for Rapid Model Improvement**

Resource constraints led the DeepSeek team to adopt an **agile-style training methodology**, iterating in small batches with frequent updates. While typical reasoning model training involves hundreds of optimization cycles, DeepSeek performed **thousands of rapid updates ("sprints")**, allowing for continuous refinement. This **high-frequency iterative approach** presents another avenue for improvement, as more frequent training updates could accelerate advancements in reasoning models.

**Step 2: Supervised Fine-Tuning (SFT) for Enhanced Readability and Performance**

_Example for Step 2_

> Now that we have our puppy and we are not going to ignore his training, we need to establish a couple things. One is a reward marker, usually a clicker, and some form of negative marker, generally a "No", "Opps", a tug on the leash, or some other sort of sound to let the dog know the exact location they did well, or where they went wrong.

**Step 2**

To **improve the clarity, consistency, and reasoning accuracy** of the final model, DeepSeek applies a **targeted supervised fine-tuning (SFT) phase** before reinforcement learning. This step refines the base model using a curated dataset consisting of **a few thousand high-quality completions** generated by R1-Zero.

**Key Refinement Techniques**

While this fine-tuning process is relatively lightweight, it plays a critical role in improving output quality. DeepSeek employs several optimization techniques, including:

*   **Few-shot prompting** with structured, multi-step reasoning examples to guide model responses.
*   **Direct prompting for detailed answers**, encouraging self-reflection and verification within responses.
*   **Formatting model outputs for readability**, ensuring consistency in structure and presentation.
*   **Post-processing by human annotators**, refining data quality and improving response reliability.

For teams looking to replicate this process, **any of these techniques can be applied**, and leveraging DeepSeek R1 itself may provide the most efficient path forward.

This supervised fine-tuning step **optimizes the model’s training trajectory**, making it easier to develop **self-correction and reasoning behaviors** during reinforcement learning. It enhances the likelihood that the model will exhibit advanced cognitive traits such as:

*   **Self-verification:** "Let me double-check my work."
*   **Error recognition:** "That answer seems incorrect; let me refine it."

By laying this groundwork early, the reinforcement learning phase can **more effectively strengthen these reasoning capabilities**, resulting in a more reliable and interpretable AI model.

**Step 3: Large-Scale Reinforcement Learning for Reasoning Models**

_Example for Step 3_

> Think of this like training a dog. You give a command, the dog responds, and if it does the right thing, you give it a treat. Over time, it learns which actions lead to rewards and improves its behavior. Here, the model is the "dog," the responses are its "actions," and the rewards help it learn what works best.

**Step 3**

Reinforcement Learning (RL) for reasoning models operates on a fundamental principle: **reward the model for producing correct answers in cases where correctness can be objectively verified**. This structured feedback loop helps shape the model’s reasoning capabilities, ensuring it converges toward higher accuracy and usability.

DeepSeek’s reinforcement learning approach incorporates **three key reward mechanisms** during the reasoning phase:

1.  **Accuracy Rewards** – The primary driver of learning, where the model receives a **positive score if its response is correct** and zero otherwise.
2.  **Format Rewards** – Ensures that responses follow a structured format using designated tags (e.g., <think> ... </think>, <answer> ... </answer>), reinforcing **stability and interpretability** in outputs.
3.  **Language Consistency Rewards** – Encourages responses to be in the **same language as the query** to improve user experience. While DeepSeek notes a slight reduction in raw performance from this adjustment, it enhances **alignment with human preferences**.

While accuracy rewards form the core learning mechanism, the **format and language consistency rewards act as guardrails**, ensuring that responses are both structured and user-friendly. To implement this reward system, DeepSeek utilizes a **customized Proximal Policy Optimization (PPO) algorithm**, a reinforcement learning approach widely adopted in AI research. Their version **relies on Monte Carlo advantage estimates for value approximation** instead of storing a separate value model in memory—an approach likely chosen for its efficiency and compatibility with DeepSeek’s existing infrastructure.

**The Importance of Verifiable Training Data**

The effectiveness of reinforcement learning in reasoning AI hinges on **the availability of verifiable, high-quality training data**. While DeepSeek has not publicly disclosed its dataset, OpenAI has described using fact-based evaluations, such as:

*   **Example Question:** _Who are President Obama’s children?_
*   **Evaluation Method:** A predefined list of correct, partially correct, and incorrect answers assigns scores accordingly.

This structured evaluation approach is particularly **valuable for domain-specific AI applications**, such as:

*   **Industrial AI models** that process sensor data, where equipment variability and environmental conditions must be factored into decision-making.
*   **Enterprise AI systems** trained on **proprietary internal knowledge**, where accuracy must be maintained despite the absence of widely agreed-upon external sources.

**Scaling Up Reinforcement Learning: Computational Considerations**

Reinforcement learning for reasoning requires **multiple model instances running in parallel**, alternating between generating responses, verifying outputs, and iterating backward to refine results. As one researcher at Cornell noted, **"We need to code up verifiers ASAP"**, emphasizing the importance of **building domain-specific verification systems**. For enterprises exploring RL-based AI, a **practical first step is to develop tools and datasets tailored to a single domain before scaling across multiple areas**.

**Step 4: Rejection Sampling to Introduce General Capabilities**

_Example for Step 4_

> Think of this like training a dog. You give the command to fetch a stick. But instead of rewarding the dog with any attempt, you observe all the possible ways he can retrieve the stick. Perhaps he crews on it. Perhaps he plays a game of tug of war with you when he returns it. Maybe he drops it at your feet. You make a list of all the ways your dog returns the stick and then decide that the best fetch is where he returns the stick to your feet, sits back and gets your attention. The sloppy fetch is him getting the stick and playing tug of war. A failed fetch would be where he either runs off with the stick or he ignores the stick. Now you take your dog out to the field and you throw the stick. This time the dog gets no rewards for failure, but the dog also gets better rewards for the behaviors you prefer. It might take a couple times to get the dog to fetch the stick, sit, and alert.

**Step 4**

Rejection sampling is a well-established post-training technique used to refine model outputs by **generating multiple responses, ranking them with a reward model, and fine-tuning the original model based on the highest-quality completions**. This method is commonly employed in AI training pipelines, including models like Llama 3, to enhance performance across a variety of tasks.

DeepSeek applies rejection sampling to **reintroduce general-purpose capabilities into the model**, ensuring that reasoning-focused refinements do not come at the cost of broader AI versatility. This phase is **the only stage where DeepSeek discloses specific training data volumes**:

*   **800,000 total completions**
    *   **600,000 focused on reasoning tasks**
    *   **200,000 focused on general chat interactions**

**The Strategic Value of Training Data**

The goal in this stage is to **curate a training set of high-quality completions**, particularly for factual reasoning tasks. Consider the example of asking, _"Who are President Obama’s (or Trump’s) children?"_—this represents a **chain of reasoning grounded in verifiable facts and widely accepted processes**, such as:

*   **Scientific methodologies**
*   **Programming and algorithmic principles**
*   **Theoretical foundations of chemistry, physics, and philosophy**

For AI applications in corporate environments, this phase underscores the **critical importance of proprietary domain-specific datasets**. Whether building AI for **enterprise decision-making, industry-specific automation, or knowledge management**, access to validated, high-quality training data is a key differentiator.

**DeepSeek’s Approach to Rejection Sampling**

DeepSeek refines this process by leveraging multiple data sources and verification strategies:

*   **Generative reward models** – Using another **large language model (LLM) as a judge** (e.g., ChatGPT) to verify responses that lack explicit factual answers.
*   **DeepSeek-V3’s post-training pipeline** – Incorporating refined data from prior AI iterations to enhance response quality.
*   **Augmented chat data with structured reasoning steps** – Training the model to interpret and **apply logical reasoning even in less formally structured conversations**, improving its ability to generalize across different use cases.

**Step 5: Final Reinforcement Learning for General Use**

_Example for Step 5_

> In our dog example, think of this final phase and the socialization phase of your dogs education. While I mentioned earlier things that look like socialization, this is a bit different. You want to walk your dog around the neighborhood to see how it reacts to loud noises, like leaf blowers. You want to take your dog to the dog park to see how it will interact with other dogs. You want to make sure you dog knows how to behave around humans and other animals you have in the house and in the neighborhood.

**Step 5**

In the final stage, DeepSeek R1 undergoes a second round of **reinforcement learning (RL)**, a process that is increasingly becoming the dominant method for fine-tuning AI models. This phase is designed to **enhance the model’s reasoning capabilities while optimizing it for general usability**, focusing on improving both **helpfulness and safety**.

However, it is important to note that in this stage, DeepSeek appears to have operated under **different regulatory and data constraints** than Western AI labs. Reports suggest that **content alignment measures** were influenced by external factors, including the potential prioritization of **state-approved narratives in politically sensitive areas**. While this may be driven by a need to secure continued research funding, it underscores the complex relationship between AI model development and geopolitical considerations.

**Fine-Tuning Strategy: Reinforcement Learning with Multiple Reward Models**

To refine general usability, DeepSeek combines two key reinforcement learning techniques:

1.  **Verifiable Domain Reinforcement Learning** – Extending the **fact-based training** used in R1-Zero to reinforce accuracy in areas with clear correctness standards.
2.  **Reinforcement Learning with Human Feedback (RLHF)** – Incorporating preference tuning to **align responses with user expectations** and ensure a more natural, human-like interaction.

This approach builds upon DeepSeek’s existing **post-training pipeline from V3**, leveraging multiple reward models to optimize response quality and adherence to structured reasoning.

**Challenges in Reinforcement Learning Fine-Tuning**

Successfully executing this phase requires addressing several open research questions:

*   **Data Balance:** How much factual, verifiable data should be used versus human preference-driven tuning?
*   **Reward Model Selection:** Can an existing off-the-shelf reward model be used, or does it need exposure to complex reasoning traces?
*   **Performance Trade-offs:** Are additional safeguards needed to prevent degradation in reasoning ability while improving user-friendliness?

As AI research advances, these challenges will be refined through ongoing experimentation and iteration.

**Scalability and Future Considerations**

One of the most significant advantages of this approach is that once an AI model learns a task, **replicating that knowledge across subsequent models becomes exponentially more efficient**. As knowledge transfer becomes more streamlined, AI training will increasingly resemble a simple **"Copy-Paste"** process, where fundamental reasoning skills and alignment strategies can be rapidly applied to new models with minimal additional effort.

While many details of DeepSeek’s methodology remain undisclosed, the broader framework for reasoning model fine-tuning is becoming clearer. Future research will focus on **optimizing reinforcement learning strategies** to balance reasoning depth, general usability, and ethical considerations.

