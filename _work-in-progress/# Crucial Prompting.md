# Crucial Prompting

*How to Frame Questions That Get Machines (and People) to Think Clearly*

My boss once told me that to grow and get promoted in the company, I had to learn to communicate better.  As a part of the training plan we developed together I took the class *Crucial Conversations.*  I showed up to a room with too much air conditioning and too few power outlets, got handed a little book and a workbook full of blank spaces. The whole point was simple: when stakes are high, emotions run strong, and opinions differ, how you speak can either spark insight or shut someone down. That idea stayed with me.

So now, in a world where we’re just as likely to have a hard conversation with a machine as a manager, I want to draw from that same well. *Crucial Prompting* begins there—with the belief that how you ask shapes what you get. Whether you're sitting across from a person or typing into a chat box, the need is the same: clarity, intention, and respect.

And just like in those workshops, it turns out most folks don't need to be clever. They need to be clearer.

That's because the hardest part isn’t about getting an answer.

It’s asking the question well.

Ask any parent who’s tried to get a straight answer from a teenager, or a team lead struggling with an open-ended ask from a VP. Vague begets vague. And it’s no different with AI.

You want the model to think clearly?

You must think clearly first.

Writing prompts for AI isn’t just a technical skill—it’s a practice in self-awareness, clarity, and intention. And like all good practices, it humbles you because it takes practice.  It takes mistakes.  It takes self-forgiveness, acceptance and growth, all before mastery. 

So here’s what I’ve found: the best prompts aren’t quick or clever. They’re *structured*. Not like a bureaucrat, but like a building.  Stewart Brand noted that buildings consist of multiple layers.  The foundation deep, frame strong, with layers that shift at different speeds: the site, the structure, the skin, the services, the space plan, and the stuff. A good prompt, like a good building, makes room for change without losing its shape.

Let’s walk through what that looks like.

---

## What Are You Really Asking?

Before you even type, pause.

What are you trying to get done?

Write like a carpenter measuring wood, not like a poet in love with sound.

Don't think about *what do you want the AI to say*, but *what do you want to walk away with*? A list? A plan? A story? A risk matrix?  Make this output be something SMART: specific, measurable, achievable, relevant, and time bound. 

Too many prompts start with style and skip over purpose. Don’t ask for “creative ideas for a strategy workshop” if what you need is “a 2-hour agenda with specific goals and activities mapped to outcomes.” Be honest with yourself about the shape of your need.

## Structure: Your Best Friend

Here's a prompt I wrote recently that cuts through the fog like a lighthouse beam:

```markdown
{System}
You are an expert Project Manager...

{Context}
This is a structured process...

{Instructions}
1. Divide the document into the following sections:...

{Constraints}
- Avoid informal language...
- There should only be one Objective...
...
{Output Format}
Provide the output as a formatted specification document...

{Reasoning}
Apply Theory of Mind...
```

Looks long, doesn’t it? It is. But there’s no fluff.

Each piece earns its place, like bones beneath skin.

Let me show you what each bit does and why it matters.

### 1. `{System}` – Tell the AI Who It Is

This is where you give the model a mask. Not a costume—those are for play. A mask. A *role*.

“You are an expert Project Manager.” Simple. Clear. It sets the tone. The model now filters every response through that lens.

Want a storyteller? Say so. A lawyer? A therapist? A snarky teenager? Same deal.

Start here, or get ready to clean up later.

### 2. `{Context}` – What Is This Really For?

Don’t assume the model shares your frame. You must bring it into the room. This section lets you define the shape of the problem before you even touch the solution.

In my case: “This is a structured process for developing a list of tasks...” That tells the model *why it’s doing this*. AI models care about context the way plants care about sunlight.

Leave it out, and things get weird.

### 3. `{Instructions}` – Step-by-Step, No Wandering

The clearer you are here, the sharper the results.

If you want a structure, ask for one.

“Divide the document into these sections. Enumerate Objectives like this. Use this identifier pattern. Keep each item on its own line.”

It sounds nitpicky. It’s not. It’s *liberating*. You give the AI guardrails so it doesn’t spin into abstraction.

Give it form, and it will give you function.

### 4. `{Constraints}` – Define the Box

“Only one Objective.”\
“At least 3 Key Results.”\
“Don’t assign work on weekends or American holidays.”

These aren’t just rules—they’re expressions of care.

Care for reality. For the people doing the work. For the shape of your world. AI has no sense of weekends. You do.

Constraints humanize the machine’s output.

### 5. `{Output Format}` – Shape the End Before You Begin

Tell the model how to hand it back to you.

Markdown? Table? JSON? Bulleted text?\
Want traceability? A matrix? Date formats?

Don’t let it guess. The more effort you put here, the less editing you’ll need later.

### 6. `{Reasoning}` – The Soul of the Ask

Here’s where the thinking gets serious.

“Apply Theory of Mind.”\
“Use Strategic Chain-of-Thought.”\
“Balance depth with clarity.”

This is your way of asking the AI not just to *do*, but to *understand why*. For example, instead of simply asking, “Give me a list of tasks,” you might say, “You are a project manager helping plan a product launch. Break down the work into SMART goals, map each goal to tasks, and include due dates.” That small shift invites the AI to adopt your mental framework and return work that’s aligned with real-world expectations.

This is where good prompts cross the line from functional to profound.

## Ask Like a Human, Think Like a Machine

There’s something profound about asking a good question.

It honors the other. It assumes there’s something worth listening to. And when the other is a machine—reflecting back your own logic, structure, and emotion—the question becomes a mirror.

Bad prompts are like shouting into a cave. You get echoes.\
Good prompts are like tuning an instrument. You get harmony.

So next time you sit down to write one, slow down.

Ask yourself:

- What do I need, really?
- What shape should the answer take?
- What should never happen?
- What matters most?
- What would make this feel *done*?

Then build your prompt the way a good parent builds their family: \
With intention.\
With love.\
With room for grace.

They’re structured. Not like a bureaucrat, but like a building—foundation deep, frame strong, with layers that shift at different speeds: the site, the structure, the skin, the services, the space plan, and the stuff. A good prompt, like a good building, makes room for change without losing its shape.

The answers that come back might surprise you.

But they won’t confuse you.

And that’s the point.

---

In Greek mythology, a golden apple was anything but peaceful. It was Eris, the goddess of discord, who cast a golden apple into a wedding feast—inscribed "To the fairest"—and in doing so, set the gods against one another. That apple became the seed of the Trojan War, a symbol of envy, vanity, and divine chaos.

In contrast, an old saying from ancient Near Eastern wisdom literature speaks of a golden apple not as an agent of disruption, but as a symbol of harmony and grace. Its imagery—crafted beauty set against silver—captures the rare and enduring value of well-chosen words. The same object, entirely different meaning. Context, as always, is everything.

*"A word fitly spoken is like apples of gold in settings of silver."*

So speak fitly. Even to machines.\
Especially to machines.

