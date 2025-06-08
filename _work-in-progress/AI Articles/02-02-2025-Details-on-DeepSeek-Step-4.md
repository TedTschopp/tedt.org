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