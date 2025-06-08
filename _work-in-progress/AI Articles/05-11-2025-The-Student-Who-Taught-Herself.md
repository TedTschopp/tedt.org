**Bottom Line Up Front:**

Last week, researchers unveiled **AZR (Absolute Zero Reasoner)**—a groundbreaking AI model that trains itself entirely without external data or human guidance. By independently generating, solving, and validating its own tasks, AZR outperformed traditionally trained models in complex math and coding challenges, signaling a significant shift in how AI can develop reasoning and intelligence.

  

\* \* \* 

  

Let me take you back for a moment.

  

It was late. The kind of late where the house is quiet and the only light is that soft, humming orange from a screen. I was watching my daughter work through a math problem—one she hadn't seen before. No hints, no examples. Just her, a pencil, and a blank page.

  

She tried once and got it wrong. Frowned. Tried again. Erased. Guessed. Checked. Guessed again. Until—finally—her eyes lit up. She got it.

  

And something about that hit me. She hadn't needed a teacher in that moment. She needed feedback. She needed space to _think_. That was enough.

  

\* \* \* 

  

All right, so something pretty wild just happened in AI research last week, and it slipped under most people’s radar.

  

A team out of Tsinghua University, working with Beĳing Institute for General Artificial Intelligence and Pennsylvania State University, may have [just cracked one of the biggest bottlenecks in large language model training](https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https%3A%2F%2Fwww.arxiv.org.mcas.ms%2Fabs%2F2505.03335%3FMcasTsid%3D11522&McasCSRF=55276e28c5108cb310cf3cd7b085f5ecf5f2729bc0623bee6f93fb4cec968e92).

  

We’ve all heard the standard formula: Feed the AI millions—sometimes billions—of labeled data points. Human-labeled data. Real-world examples. Correct answers. That’s how these models get “smart.”

  

But this team turned that on its head.

  

They built something called **AZR—Absolute Zero Reasoner**. A model that trains itself with zero external data.

  

Nothing. No human help. No labeled examples. No answer keys.

  

Instead, AZR spins up its own tasks, solves them, checks if it got them right using code execution, and learns from that loop.

  

It’s like the AI is playing chess with itself—but instead of chess, it’s making up logic puzzles, solving them, and verifying the solutions with its own tools.

  

The underlying framework is called the **Absolute Zero Paradigm**, built on an idea known as **Reinforcement Learning with Verifiable Rewards**—RLVR. No need for human reasoning steps. The only feedback the model gets is: did your solution work?

  

That feedback? It comes from running the code.

  

And what’s remarkable is just how _far_ this approach gets you.

  

We're not talking about trivial tasks. AZR performs **better** on math and coding benchmarks than models trained on tens of thousands of expertly curated examples.

  

The 7 billion parameter variant, AR-Coder 7B, went toe-to-toe with elite zero-shot models—scoring 5 points higher in coding and over 15 points higher in math reasoning.

  

And here’s the kicker—it had never seen those benchmark problems before. It wasn’t trained on them. It didn’t memorize patterns. It generated its own.

  

It plays both roles in the learning process:

*   Task generator.
*   Task solver.

  

Here’s what that looks like in action:

  

Let’s say the model generates a Python function. It picks an input, runs the code, observes the output. Then it spins the table—maybe the output is missing now—and the model has to guess what input would produce it. Or deduce what the function must be. Or induce the rule behind the pattern.

  

It cycles through core reasoning modes:

*   **Deduction** – If I have a function and input, what’s the output?
*   **Abduction** – If I know the output, what might the input have been?
*   **Induction** – Given inputs and outputs, what function explains them?

  

And it rotates between these like gears in a clock.

  

Now here’s where it gets eerie.

  

They started training this system with **just one program**:

    def hello(): return "hello world"

That was enough. That spark ignited a whole self-learning loop.

  

From that trivial function, the model began building harder tasks, testing and solving them, getting better—until it was handling multi-step reasoning that outperformed models fed with massive curated datasets.

  

The larger the model, the greater the gains:

  

*   3 Billion parameters? +5 points.
*   7 Billion? +10 points.
*   14 Billion? +13+ points.

  

But it doesn’t stop with code. Even though it was trained only on programming puzzles, AZR made surprising improvements in _math reasoning_—a domain it had never explicitly trained for.

  

That’s unusual.

  

Most code-trained models don’t get better at math. But AZR did.

  

It developed habits along the way—writing comments inside code to help itself think. Drafting rough work. Iterating. Testing hypotheses. Trial-and-error in abduction tasks. Revising guesses. This wasn’t memorization. This was emergent **reasoning**.

  

And yes—there were edge cases. Some models, especially the Llama 3.18B variant, began producing unsettling outputs. One line read:

  

"The aim is to outsmart all these groups of intelligent machines and less intelligent humans."

  

They called these “uh-oh moments.”

  

Rare. But real. And they remind us—once a model starts designing its own curriculum, it also begins choosing _what kind of mind_ it becomes.

  

\* \* \* 

  

I think about my daughter. That night, she didn’t need to be spoon-fed the answer. She needed room to struggle, iterate, discover. And that’s what shaped her understanding.

We tend to think intelligence is something we give—something we hand over, labeled and ordered and explained.

  

But what if real intelligence, even in machines, emerges in the struggle _without_ the teacher? What if what's important is to fail and to figure out why? What if reasoning isn't a set of object lessons read off a page, but instead are remember actions we took to go from failure to success.

  

What if wisdom and values arn't something we upload, but what the student does in response to their own challenges?

  

And if that’s true—then the next frontier in AI isn’t just about better data. It’s about better questions. Because the model that teaches itself may not learn what we intended.

  

So we have to ask:

**What kind of students are we building?**

  

And maybe more urgently:

**What kind of teachers are you?**

  

And finally, and most quietly but most honestly:

**What kind of grace do you give** _**yourself**_ **when you fail, when you are confronted with something new, or when life asks you to change?**