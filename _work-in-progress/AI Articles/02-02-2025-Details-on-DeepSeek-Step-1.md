
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