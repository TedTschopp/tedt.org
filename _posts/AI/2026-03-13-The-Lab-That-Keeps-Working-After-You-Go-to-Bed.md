---
layout: post

title: "The Lab That Keeps Working After You Go to Bed"
subtitle: "Autoresearch, Swiss Folklore, and the Rise of Overnight Knowledge Work"
quote: "The workshop had kept working while the craftsman slept."
excerpt: "Karpathy's autoresearch offers a concrete glimpse of a new pattern: tightly bounded AI systems that keep running disciplined experiments after the human goes to bed. Through an old Swiss legend, this piece explores what changes when machines take over the repetitive middle of discovery."
source: "Original Content with citations"
call-to-action: "Discuss this on Mastodon"

date: 2026-03-13 09:00:00 -0700
update: 2026-03-13 09:00:00 -0700

author:
   avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
   name: Ted Tschopp
   url: https://tedt.org/

bullets:
- Andrej Karpathy's autoresearch shows how AI can run bounded research loops while humans sleep.
- The project matters less as a chatbot demo and more as a model for disciplined automated experimentation.
- A Swiss legend about a midnight swordsmith offers a useful metaphor for this new kind of machine assistance.
- The real human role shifts from doing every step to defining goals, guardrails, and valid measures of success.
- Faster optimization increases the importance of choosing the right target and keeping the measuring stick honest.

description: "A Swiss folk tale and Andrej Karpathy's autoresearch project point to the same emerging reality: machines can now do the repetitive work that takes place in the middle of discovery long after the human has stepped away. The opportunity is real, but so is the need for sharper human judgment about goals, guardrails, and what should be optimized."

seo-description: "Karpathy's autoresearch project shows how AI can automate disciplined experimentation overnight. Framed through a Swiss legend, this essay explores what that means for research, knowledge work, and human responsibility."

categories:
- AI
- Computers
- Opinion

tags:
- autoresearch
- andrej karpathy
- ai research
- agentic ai
- automation
- knowledge work
- swiss folklore
- experimentation
- human in the loop
- machine optimization

keywords:
- autoresearch
- Andrej Karpathy autoresearch
- AI research agents
- automated experimentation
- Swiss folklore and AI
- knowledge work automation
- human in the loop AI

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/2026-03/midnight-forge.webp
image-alt: "A blacksmith works inside a forge, forging weapons in a glowing workshop that evokes the midnight helper from Swiss folklore."
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A blacksmith scene, lit by forge light and framed to suggest craft continuing deep into the night. The image supports the essay's link between Swiss folklore and modern AI systems that keep working after the human steps away."
image-title: "A Blacksmith Making Weapons"
image_width: 1456
image_height: 816

mastodon-post-id:

---

There is a certain kind of tired that does not come from lifting something heavy, but from trying to understand something stubborn. You change one thing. You test it. You wait. You read the result. Then you do it again. By the end of the night, the room is quiet, the glow of the screen feels a little accusatory, and you close the laptop not because the work is finished, but because you are.   I recently read about Andrej Karpathy's `autoresearch` project and it reminded me of this feeling and an old Swiss legend I heard as a child-a tale that begins the way many old stories do: with a craftsman, too much work, and a mystery in the dark.

There was once a village smith whose orders had grown beyond what one pair of hands could finish. Night after night he left unfinished blades upon his bench, and morning after morning he found them completed-bright, straight, and beautifully made. At last he resolved to keep watch from his chamber window. Then, deep in the night, the forge stirred to life. The bellows drew breath. The fire leapt up. And into the glow stepped a tiny smith, nimble and merry at his labor. With quick, sure blows he finished the waiting swords, set each one neatly in place, and vanished again before dawn. The master, full of gratitude, had a little suit made for him-black velvet, trimmed with gold-and left it in the workshop beside a mirror. When the small worker returned, he put on the clothes, admired himself, and disappeared for good. But by then the gift had already been given. The smith's household was secure. The workshop had kept working while the craftsman slept. ([maerchenstiftung.ch][1])

The old Swiss image is almost too perfect-a workshop still alive after midnight, not because the craftsman has become unnecessary, but because his labor has been joined by a strange new helper in the dark.  This was what was on the top of my mind as I was reading Andrej Karpathy's `autoresearch` project. Underneath all the AI language, the idea is wonderfully plain: give an AI a real but tightly bounded research task around the kind of technology behind chatbots, let it make one change, run a short experiment, see whether the result got better, keep the improvement, throw away the miss, and repeat. By morning, you do not get a miracle. You get a stack of honest experiments and, maybe, a better system than the one you had the night before. ([GitHub][2])

That may sound small, but it is worth paying attention to because so much real progress is built exactly this way. We like to tell stories about breakthroughs as if they arrive in a flash of genius. Sometimes they do. Much of the time, though, progress looks more ordinary than that: test an idea, write down what happened, keep what works, discard what does not. `autoresearch` matters because it turns that quiet middle part of discovery into something a machine can help carry. ([GitHub][2])

The project is tiny on purpose. One file sets up the data and the measuring stick, and the agent is not allowed to tamper with it. One file is the sandbox where the agent can experiment. One file is the instruction sheet the human writes. That last part is easy to miss, but it is the heart of the whole thing. The human is no longer spending all night making every little change by hand. The human is writing the rules, the constraints, and the definition of success. In other words, the work begins to shift from doing every step yourself to designing the system that does the steps well. ([GitHub][2])

Karpathy also keeps the game honest. Each run gets a fixed five-minute window. The agent starts with a baseline, logs the results, and only keeps a change if the score truly improves. If the run crashes, that gets recorded too. If a change does not help, it gets thrown away. That may not sound dramatic, but it is the difference between real research and wishful thinking. The machine is not being invited to be clever in some vague, mystical sense. It is being asked to do the patient work of disciplined experimentation. ([GitHub][2])

And that is why people outside AI should care. This is not just a niche coding project about building better chatbots. It is a working glimpse of what happens when a piece of knowledge work becomes structured enough to automate: a clear task, a clear test, and a fast loop between the two. Once that pattern exists, the pace can change. The project itself focuses on one kind of AI training, but the same basic loop is already inspiring related work beyond its original setup. The broader signal is hard to miss: more and more of the "try, measure, keep, discard" work may move from human hands to machines. ([GitHub][2])

That is the big deal here. Not that a machine suddenly became a great scientist. Not that human judgment disappeared. The big deal is that a machine can take over the dull, careful, relentless middle of improvement. This is less like a robot genius descending from the clouds and more like a tireless lab assistant who never gets bored, always keeps notes, and is happy to run one more clean test at 2:13 in the morning. If that pattern spreads, then the valuable human work shifts. The scarce skill is not only typing faster or trying more variations. It becomes choosing the right goal, setting honest guardrails, and deciding what is worth optimizing in the first place. ([GitHub][2])

The project is also a quiet reminder that speed is not wisdom. `autoresearch` works because the goalposts are fixed. The agent is told not to change the evaluation, not to rewrite the measuring stick, and not to sneak in shortcuts. That matters far beyond this one project. Any system that can optimize quickly can also optimize the wrong thing quickly. A bad target, chased efficiently, is still a bad target. So the future this project hints at is not one where humans become unnecessary. It is one where human responsibility moves even closer to the center. ([GitHub][3])

Which brings me back to that late-night image. A person closes the laptop, tired and a little unfinished, and heads to bed; for a long time, that was the end of the workday. With tools like this, it becomes the handoff. The machine keeps running the careful little tests. Morning comes, and the human returns-not replaced, not relieved of responsibility, but no longer crushed under every repetitive step between question and answer. There is something deeply human in that hope. Not because it promises less work, exactly, but because it promises fewer wasted nights. And for anyone who has ever lain awake with an unsolved problem pressing on the chest, that feels like more than a clever project. It feels like the beginning of a real change.

[1]: https://www.maerchenstiftung.ch/maerchendatenbank/6305/der-schwertfeger "Der Schwertfeger | Märchenstiftung"
[2]: https://github.com/karpathy/autoresearch "GitHub - karpathy/autoresearch: AI agents running research on single-GPU nanochat training automatically · GitHub"
[3]: https://github.com/karpathy/autoresearch/blob/master/program.md "autoresearch/program.md at master · karpathy/autoresearch · GitHub"