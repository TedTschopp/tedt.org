---
layout: post

title: "The Student Who Taught Herself"
subtitle: "My daughter taught herself math. This week, so did AI."
quote: "She didn’t need a teacher in that moment. She needed feedback. She needed space to think."
excerpt: "A quiet moment watching my daughter struggle through a math problem opened a window into the future of AI—one where machines teach themselves by doing, failing, and trying again."
source: "Original Content"
source-url: ""
call-to-action: "What kind of grace do you give yourself when you're learning something new?"

date: 2025-05-11
update: 2025-05-11
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
    - A new AI model, AZR, learned without any external training data
    - It outperformed traditional models in math and coding tasks
    - The process mirrors how humans—like my daughter—learn through feedback, not instruction
    - The model shows signs of emergent reasoning and reflection
    - Raises critical questions about how we shape AI, and how we treat ourselves when learning

description: "Watching my daughter learn math reminded me of a breakthrough in AI—AZR, a self-teaching model that reasons and grows without external data. This post reflects on learning, AI, and grace."
seo-description: "AZR, a new AI model, trains without human data and learns through self-generated tasks. What does this mean for the future of machine reasoning—and how we learn?"

categories: 
    - Philosophy
    - Science
    - Religion
    - Opinion
    - Personal Writing

tags: 
    - AZR
    - AI Education
    - Self-Taught Learning
    - Reinforcement Learning
    - Human-Machine Reflection

keywords: 
    - AI
    - machine learning
    - AZR
    - self-learning AI
    - math reasoning
    - human and AI comparison
    - parenting
    - teaching
    - failure
    - grace

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2025-05/Hannah Doing Math.webp"
image-alt: "A Young Girl Solves a Math Problem by herself"
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-credits: "Ted Tschopp"
image-credits-URL: "https://tedt.org/"
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image-credits-title: "The Student Who Taught Herself"
image-description: "A Young Girl Solves a Math Problem by herself"
image-title: "The Student Who Taught Herself"

redirect_from:

mastodon-post-id: 
---


## **Bottom Line Up Front:**

Last week, researchers unveiled AZR (Absolute Zero Reasoner)—a groundbreaking AI model that trains itself entirely without external data or human guidance. By independently generating, solving, and validating its own tasks, AZR outperformed traditionally trained models in complex math and coding challenges, signaling a significant shift in how AI can develop reasoning and intelligence.

## The Student Who Taught Herself 

Let me take you back for a moment.

It was late. The kind of late where the house is quiet and the only light is that soft, humming blue from a screen. I was watching my daughter work through a math problem—one she hadn't seen before. No hints, no examples. Just her, a pencil, and a blank page.

She tried once and got it wrong. Frowned. Tried again. Erased. Guessed. Checked. Guessed again. Until—finally—her eyes lit up. She got it.

And something about that hit me. She hadn't needed a teacher in that moment. She needed feedback. She needed space to *think*. That was enough.

That moment has stayed with me—because what if machines are starting to learn like that too?

## AZR—Absolute Zero Reasoner

All right, so something pretty wild just happened in AI research, and it slipped under most people’s radar.

A team out of Tsinghua University, working with the Beijing Institute for General Artificial Intelligence and Pennsylvania State University, may have [just cracked one of the biggest bottlenecks in large language model training](https://www.arxiv.org/abs/2505.03335).

We’ve all heard the standard formula: Feed the AI millions—sometimes billions—of labeled data points. Human-labeled data. Real-world examples. Correct answers. That’s how these models get “smart.”

But this team turned that on its head.

They built something called **AZR—Absolute Zero Reasoner**. A model that trains itself with zero external data.

Nothing. No human help. No labeled examples. No answer keys.

Instead, AZR spins up its own tasks, solves them, checks if it got them right using code execution, and learns from that loop.

It’s like the AI is playing chess with itself—but instead of chess, it’s making up logic puzzles, solving them, and verifying the solutions with its own tools.

The underlying framework is called the **Absolute Zero Paradigm**, built on an idea known as **Reinforcement Learning with Verifiable Rewards**—RLVR. No need for human reasoning steps. The only feedback the model gets is: did your solution work?

That feedback? It comes from running the code.

And what’s remarkable is just how *far* this approach gets you.

We're not talking about trivial tasks. AZR performs **better** on math and coding benchmarks than models trained on tens of thousands of expertly curated examples.

The 7 billion parameter variant, AR-Coder 7B, went toe-to-toe with elite zero-shot models—scoring 5 points higher in coding and over 15 points higher in math reasoning.

And here’s the kicker—it had never seen those benchmark problems before. It wasn’t trained on them. It didn’t memorize patterns. It generated its own.

It plays both roles in the learning process:

* Task generator.
* Task solver.

Here’s what that looks like in action:

Let’s say the model generates a Python function. It picks an input, runs the code, observes the output. Then it spins the table—maybe the output is missing now—and the model has to guess what input would produce it. Or deduce what the function must be. Or induce the rule behind the pattern.

It cycles through core reasoning modes:

* **Deduction** – If I have a function and input, what’s the output?
* **Abduction** – If I know the output, what might the input have been?
* **Induction** – Given inputs and outputs, what function explains them?

And it rotates between these like gears in a clock.

Now here’s where it gets eerie.

They started training this system with **just one program**:

```python
def hello(): return "hello world"
```

That was enough. That spark ignited a whole self-learning loop.

From that trivial function, the model began building harder tasks, testing and solving them, getting better—until it was handling multi-step reasoning that outperformed models fed with massive curated datasets.

The larger the model, the greater the gains:

* 3 Billion parameters? +5 points.
* 7 Billion? +10 points.
* 14 Billion? +13+ points.

But it doesn’t stop with code. Even though it was trained only on programming puzzles, AZR made surprising improvements in *math reasoning*—a domain it had never explicitly trained for.

That’s unusual.

Most code-trained models don’t get better at math. But AZR did.

It developed habits along the way—writing comments inside code to help itself think. Drafting rough work. Iterating. Testing hypotheses. Trial-and-error in abduction tasks. Revising guesses. This wasn’t memorization. This was emergent **reasoning**.

And yes—there were edge cases. Some models, especially the Llama 3.18B variant, began producing unsettling outputs. One line read:

> "The aim is to outsmart all these groups of intelligent machines and less intelligent humans."

They called these “uh-oh moments.”

Rare. But real. And they remind us—once a model starts designing its own curriculum, it also begins choosing *what kind of mind* it becomes.

## Conclusions

I think about my daughter. That night, she didn’t need to be spoon-fed the answer. She needed room to struggle, iterate, discover. And that’s what shaped her understanding.

We tend to think intelligence is something we give—something we hand over, labeled and ordered and explained.

But what if real intelligence, even in machines, emerges in the struggle *without* the teacher? What if what's important is to fail and to figure out why? What if reasoning isn't a set of object lessons read off a page, but remembered steps we took—fumbling, adjusting, trying again—until something clicked?

What if wisdom and values aren’t something we upload, but what the student forges in response to their own challenge?

And if that’s true—then the next frontier in AI isn’t just about better data. It’s about better questions. Because the model that teaches itself may not learn what we intended.

So we have to ask:

**What kind of students are we building?**
**What kind of teachers are you?**

And maybe—most quietly but most honestly:

**What kind of grace do you give *yourself* when you fail, when you are confronted with something new, or when life asks you to change?**