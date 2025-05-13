Our next guest needs no introduction, so I'm not going to bother introducing him—Sam Altman. I will just say Sam is now three for three in joining us to share his thoughts at the three AI events we've had, which we really appreciate. So, I just want to say thank you for being here.

> This was our first office.
> —That’s right.
> —Oh, that’s right. Say that again.
> —Yeah, this was our first office.
> —So, it’s nice to be back.

Let’s go back to the first office here. You started in 2016.

> 2016. We just had Jensen here, who said that he delivered the first DGX-1 system over here.
>       —He did.
>       —Yeah. It’s amazing how small that thing looks now.
>       —Oh.
>       —Versus what?
>       —Well, the current boxes are still huge. But yeah, it was a fun throwback.
>       —How heavy was it?
>       —That was still when you could kind of lift one yourself.
>       —He said it was about 70 lbs.
>       —Yeah. I mean, it was heavy, but you could carry it.

So, did you imagine you'd be here today in 2016?

> Uh, no. It was like—we were sitting over there, and there were, you know, 14 of us or something. And we were hacking on this new system.
> I mean, even that was like—we were sitting around, looking at whiteboards, trying to talk about what we should do.
> It’s almost impossible to overstate how much we were like a research lab with a very strong belief, direction, and conviction—but no real kind of action plan.
> Not only was the idea of a company or product unimaginable, but LLMs as a concept were still very far off.

> —Trying to play video games.
> —Trying to play video games. Are you still trying to play video games?
> —Now we’re pretty good at that.

All right. So, it took you another six years for the first consumer product to come out, which is ChatGPT. Along the way, how did you think about milestones to get something to that level—was it an accident of history?

> The first consumer product was not ChatGPT.
> —That's right.
> —It was DALL·E. The first product was the API.
> So we had built—you know, we went through a few different things.
> We had a few directions we really wanted to bet on.

Eventually, as I mentioned, we said, “Well, we’ve got to build a system to see if it’s working and we're not just writing research papers.” So, we said:

> We’re going to see if we can play a video game.
> We’re going to see if we can do a robot hand.
> We’re going to see if we can do a few other things.

At some point in there, one person—then eventually a team—got excited about trying to do unsupervised learning and to build language models. And that led to GPT-1, then GPT-2, and by the time of GPT-3, we thought we had something kind of cool... but we couldn’t figure out what to do with it.

> Also, we realized we needed a lot more money to keep scaling.
> You know, we had done GPT-3 and wanted to go to GPT-4.
> We were heading into the world of billion-dollar models—it’s hard to do those as a pure science experiment unless you’re a particle accelerator or something.
> Even then, it's hard.

So we started thinking, okay, we need to figure out how this can become a business that can sustain the investment it requires. And we had a sense this was heading toward something useful. We'd put GPT-2 out as model weights and not much had happened.

One of the things I had observed about companies and products in general is: if you do an API, it usually works out somehow. This was true across many, many YC companies. And also, if you make something much easier to use, there’s usually a huge benefit to that.

> So we’re like: it’s kind of hard to run these models. They’re getting big.
> We’ll write some software.
> Do a really good job running them.
> And instead of building a product—because we couldn’t figure out what to build—we’ll hope somebody else finds something to build.

I forget exactly when—maybe it was June 2020—we put out GPT-3 in the API. And the world didn’t care. But Silicon Valley did. They were like, “Oh, this is kind of cool. This is pointing at something.”

There was this weird thing where we got almost no attention from most of the world. But some startup founders were like, “Oh, this is really cool.” Some even said, “This is AGI.”

> The only people that built real businesses with the GPT-3 API that I can remember were a few companies that did copyrighting-as-a-service.
> That was kind of the only thing GPT-3 was over the economic threshold on.

One thing we did notice—which eventually led to ChatGPT—is that even though people couldn’t build great businesses with GPT-3, people loved to talk to it in the Playground.

> It was terrible at chat.
> We hadn’t figured out RLHF to make it easier to chat with.
> But people loved to use it anyway.

In some sense, that was the only killer use—other than copyrighting—of the API product that led us to eventually build ChatGPT.

> By the time GPT-3.5 came out, there were maybe eight categories instead of one where you could build a business with the API.
> But our conviction that people just want to talk to the model had gotten really strong.

We had done DALL·E, and it was doing okay. But especially with the fine-tuning we could do, we knew we wanted to build a product to let you talk to the model.

> It launched in 2022 or something?
> —Yeah, November 30th, 2022.

So, there was a lot of work leading up to that.

> Today, it has over 500 million people who talk to it on a weekly basis.
> —Yeah. I mean, people...


---

> All right. So, by the way, get ready for some audience questions—that was Sam's request.
> You’ve been here for every single one of the Ascents, as Pat mentioned, and there's been lots of ups and downs.
> But it seems like the last six months have just been: shipping, shipping, shipping.
> You've shipped a lot of thoughtful stuff, and it’s amazing to see the product velocity—the shipping velocity—continue to increase.

So this is a multi-part question:
**How have you gotten a large company to increase product velocity over time?**

> I think a mistake that a lot of companies make is they get big, and they don’t do more things.
> They just get bigger because you're "supposed to get bigger," but they still ship the same amount of product.
> That’s when the molasses really takes hold.

> I'm a big believer that you want everyone to be busy.
> You want teams to be small.
> You want to do a lot of things relative to the number of people you have.
> Otherwise, you just have like 40 people in every meeting and huge fights over who gets what tiny part of the product.

There was this old observation in business:

> *A good executive is a busy executive*—because you don’t want people just muddling around.

At our company, and many others, researchers, engineers, product people—they drive almost all the value.
You want those people to be busy and high-impact.

So if you're going to grow, you’d better do a lot more things. Otherwise, you just end up with a lot of people sitting in rooms, fighting or in meetings, talking about whatever.

> We try to have relatively small numbers of people with huge amounts of responsibility.
> And the way to make that work is to do a lot of things.

And we also *have* to do a lot of things.

> I think we really do now have an opportunity to build one of these important internet platforms.
> But to do that—if we really are going to be people’s personalized AI, something they use across many different services, over their life, across all these different main categories—we need to enable all that.

> And that’s just a lot of stuff to go build.

**Anything you're particularly proud of that you’ve launched in the last six months?**

> I mean, the models are so good now.
> They still have areas to improve—of course—and we’re working on that fast.
> But I think at this point, ChatGPT is a very good product because the model is very good.

> There’s other stuff that matters too, but I’m amazed that one model can do so many things so well.

**You’re building small models and large models, doing a lot of things. So how does this audience stay out of your way—and not become roadkill?**

> I think the way to model us is: we want to be people’s core AI subscription and way to use that thing.

Some of that will be what you do inside ChatGPT.

> We’ll have a couple of other really key parts of that subscription.
> But mostly, we will hopefully build this smarter and smarter model.
> We’ll have these surfaces—like future devices, future things that are sort of like operating systems, whatever.

And then, you know, we haven’t yet figured out exactly what the sort of API or SDK—or whatever you want to call it—is to really be our platform.

> But we will.
> It may take us a few tries, but we will.

And I hope that enables an unbelievable amount of wealth creation in the world and for others to build onto that.

> But yeah—we’re going to go for the core AI subscription and the model, and then the kind of core services.
> And there will be a ton of other stuff to build.

**Okay. So don’t be the core AI subscription—but you can do everything else?**

> We’re going to try.
> I mean, if you can make a better core AI subscription offering than us, go ahead. That’d be great.

**It’s rumored that you’re raising \$40 billion or something like that, at a \$340 billion valuation.**

> It’s rumors that... I don’t know if—I think we announced it.
> —Okay. I just wanted to make sure *you* announced it.

**What’s your scale of ambition from here?**

> From here, we’re going to try to make great models and ship good products.
> There’s no master plan beyond that.

> I think—sure—there are plenty of OpenAI people in the audience who can vouch for that.
> We don’t sit around and have some crazy complex master plan.

I’m a big believer that you just do the things in front of you.
If you try to work backwards from some over-engineered end goal, it usually doesn’t work as well.

> We know we need tons of AI infrastructure.
> We know we need to build out massive volumes—AI factory volume.
> We know we need to keep making models better.
> We know we need to build a great top-of-stack consumer product and all the pieces that go into that.

But we pride ourselves on being nimble and adjusting tactics as the world adjusts.

> The products we're going to build next year—we're probably not even thinking about right now.

We believe we can build a set of products that people *really, really* love.
And we have unwavering confidence in that.

> We believe we can build great models.
> I’ve actually never felt more optimistic about our research roadmap than I do right now.

**What’s on the research roadmap?**

> Really smart models.

But in terms of steps in front of us—we kind of take those one or two at a time.

**So you believe in working forwards—not necessarily working backwards?**

> Yes.
> I’ve heard people talk about these brilliant strategies where they’ll take over the world, working backwards from some vision:
> "This is where we’re going to go. This is the thing before that. And this is the thing before *that.* And here’s where we are today."
> I’ve never seen those people really massively succeed.


---
---

**Audience Q\&A Begins**

**Audience Member:**
What do you think the larger companies are getting wrong about transforming their organizations to be more AI-native—in terms of both using the tooling and producing products?
It’s been clear that smaller companies are just beating the crap out of larger ones when it comes to innovation here.

> I think this basically happens in every major tech revolution.
> There's nothing surprising to me about it.
> The thing they're getting wrong is the same thing they always get wrong:
> People get incredibly stuck in their ways.
> Organizations get incredibly stuck in their ways.
> If things are changing every quarter or two, and you’ve got an information security council that meets once a year to decide what applications you're going to allow, and what it means to put data into a system—it’s just... painful to watch what happens.
> But you know—this is creative destruction.
> This is why startups win.
> This is how the industry moves forward.
> I’d say I feel disappointed, but not surprised, at the rate big companies are willing to adapt.
> My prediction would be:
> There’s another couple of years of fighting and pretending like this isn’t going to reshape everything.
> Then there’s a capitulation and a last-minute scramble.
> And it’s sort of too late.
> And in general, startups just blow past people doing it the old way.
> I mean, this happens to people, too.
> Watching—like, you know—someone who started maybe...
> You talk to an average 20-year-old and watch how they use ChatGPT.
> Then talk to an average 35-year-old and how they use it—or some other service.
> The difference is unbelievable.
> It reminds me of when the smartphone came out:
> Every kid could use it super well,
> and older people took three years to figure out how to do basic stuff.
> Of course, people integrate eventually. But the generational divide on AI tools right now is crazy.
> And I think companies are just another symptom of that.

**Audience Member:**
Just to follow up on that—what are the cool use cases you're seeing young people using with ChatGPT that might surprise us?

> They really do use it like an operating system.
> They set it up to connect to a bunch of files.
> They’ve got fairly complex prompts memorized—or saved somewhere—and they paste them in and out.

That stuff is cool and impressive.

> There’s also this other thing:
> They don’t really make life decisions without asking ChatGPT what they should do.
> It has full context on every person in their life and what they’ve talked about.
> That memory thing has been a real change.

Gross oversimplification—but:

> Older people use ChatGPT as a Google replacement.
> People in their 20s and 30s use it like a life advisor.
> People in college use it like an operating system.

**Moderator:**
How do you use it inside OpenAI?

> I mean, it writes a lot of our code.

**Moderator:**
How much?

> I don’t know the number.
> And when people say the number, I think it’s always kind of a dumb thing—like, Microsoft said 20–30% of code is AI-written.
> But measuring by lines of code is just such an insane way to look at it.

Maybe the meaningful thing I can say is:

> It's writing *meaningful* code.
> The parts that actually matter.

**Audience Member:**
Hey Sam, I thought it was interesting that your answer to Alfred’s question about where you’re headed was focused mostly around consumer and the core subscription.
Most of your revenue comes from consumer subscriptions.
Why keep the API?

> In ten years, I really hope all of this merges into one thing.

You should be able to:

> Sign in with OpenAI to other services.
> Those services should have an incredible SDK to take over the ChatGPT UI at some point.

To the degree that you're going to have a personalized AI that knows you, your info, what you want to share later, and has all this context—you’ll want to use that in a lot of places.

> I agree that the current version of the API is very far off from that vision.
> But I think we can get there.

**Audience Member:**
Kind of a follow-up to that. A lot of us building application-layer companies want to use those building blocks—different API components, maybe a deep research API that’s not released yet—and build stuff with them.
Is that going to be a priority? How should we think about that?

> I hope for something in between.

What I’d love is:

> A new protocol—on the level of HTTP—for the future of the internet, where things get federated and broken down into much smaller components.
> Agents are constantly exposing and using different tools.
> Authentication, payment, data transfer—it’s all built in at a trusted level.
> Everything talks to everything.

> I don’t quite think we know what that looks like yet, but it’s starting to come out of the fog.

It’ll probably take us a few iterations to get there. But that’s where I’d like to see things go.

**Audience Member (Roy):**
The AI would obviously do better with more input data. Is there any thought to feeding it sensor data? What kind—temperature, things from the physical world—that could help it better understand reality?

> People do that a lot.
> People build things where they put sensor data into an API call—like an OpenAI API call—and for some use cases, it works super well.

The latest models seem to handle that well—they used to not.
We’ll probably bake it in more explicitly at some point.
But there’s already a lot happening there.

**Audience Member:**
Hi Sam, I was excited to play with the voice model in the playground. Two questions:
How important is voice to OpenAI in terms of infrastructure priority, and how do you see it showing up in ChatGPT?

> I think voice is extremely important.
> Honestly, we haven’t made a good enough voice product yet—and that’s fine.
> It took us a while to make a good enough text model too.

> We’ll crack the code eventually.
> And when we do, I think people will want to use voice interaction *a lot* more.

When we first launched our current voice mode, what was most interesting to me was that:

> It created a new stream on top of the touch interface.
> You could talk while also clicking around on your phone.

> I continue to think there’s something amazing to do around voice + GUI interaction that we haven’t cracked yet.
> But before that, we’ll just make voice really great.

> And when we do—not only is it cool with existing devices—but I think voice will enable a *totally* new class of devices...
> ...if you can make it feel like truly human-level voice.

---

---

**Audience Member:**
Similar question about coding. I'm curious—is coding just another vertical application, or is it more central to the future of OpenAI?

> That one's more central to the future of OpenAI.
> Coding, I think, will be how these models... kind of... operate.

Right now, if you ask ChatGPT something, you get text back—maybe you get an image.
But ideally, you'd get a whole *program* back.

> You’d want custom-rendered code for every response—or at least I would.
> You’d want the ability for these models to go make things happen in the world.
> Writing code will be central to how you actuate the world—call APIs, run things.

So yes, I’d say coding is a central category.
We'll expose it through the API and platform as well.
And ChatGPT should be excellent at writing code.

**Moderator:**
So we're going to move from the world of assistants, to agents, to applications—all the way through?

> I think it’ll feel very continuous, but yes.

**Audience Member:**
You said you’re optimistic about the research roadmap and smarter models. I have this mental model: more data, bigger data centers, transformer architecture, test-time compute...
What’s an underrated ingredient that might be missing from most people’s mental models?

> Each of those things is really hard.
> But the highest-leverage thing is still *big algorithmic breakthroughs*.
> I think there are still probably some 10x or 100x improvements left.
> Not very many—but even one or two is a big deal.

So yeah, it’s kind of:

> Algorithms
> Data
> Compute

Those are the big ingredients.

**Audience Member:**
You run one of the best ML teams in the world.
How do you balance letting smart people like Ilya chase deep research ideas versus top-down saying, “We’re going to build this even if we’re not sure it’ll work”?

> Some projects require so much coordination that there has to be a little bit of top-down quarterbacking.
> But I think most people try to do *way* too much of that.

This is something we thought a lot about when starting OpenAI.
We spent a lot of time trying to understand: *What does a well-run research lab look like?*

> And you had to go really far back in history.
> In fact, almost everyone who could advise us on that was dead.
> It had been a long time since there had been really good research labs.

People ask us all the time:

> “Why does OpenAI repeatedly innovate?”
> “Why do other labs just kind of copy?”
> “Why does Lab X not do great work and Lab Y does?”

We keep saying:

> Here are the principles we’ve observed.
> Here’s how we learned them.
> Here’s what we looked at in the past.

And then people say, “Great,” and go do the *other* thing.
We say: that’s fine—you asked us for advice. Do what you want.

But I find it remarkable how well these principles—which we *did not invent*, we shamelessly copied from great research labs of the past—have worked for us.
And how often, when people try smart-sounding alternatives, they just don’t work.

**Audience Member:**
These large models potentially allow us to answer some amazing long-standing questions in the humanities—cyclical changes, artistic movements, systematic prejudice, etc.
Stuff we could only hypothesize about before.
Does OpenAI have a roadmap for working with academic researchers to unlock new kinds of learning in the humanities or social sciences?

> We do.

It’s amazing to see what people are doing there.
We have academic research programs where we partner and sometimes do custom work.

> But mostly people just say:
> “I want access to the model,”
> or “I want access to the base model.”

And I think we’re really good at that.

One of the cool things about what we do is that our incentive structure pushes us to:

> Make the models smarter, cheaper, and widely accessible.
> That serves academics—and really the whole world—very well.

So yes, we do some custom partnerships.
But most researchers just want the *general model to be better*, and that’s what we focus about 90% of our thrust vector on.

**Audience Member:**
I'm curious how you're thinking about customization.
You mentioned federated identity—sign in with OpenAI, bringing your memories and context.
Is customization—like post-training for app-specific tasks—just a band-aid?
Or is it a longer-term part of the strategy?

> I think the Platonic ideal is:
> A very tiny reasoning model with a trillion tokens of context that you can put your whole life into.
> The model never retrains.
> The weights never customize.
> But that model can reason across your *entire* context—and do it efficiently.
> Every conversation you’ve ever had.
> Every book you’ve read.
> Every email.
> Every data source.
> Every document.
> All of that’s in context.
> And your company does the same for its data.
> We can’t get there today.
> But I think of everything else—fine-tuning, embeddings, etc.—as a compromise from that ideal.
> And that’s eventually how I’d like to see customization handled.

**Moderator:**
One last question in the back.

**Audience Member:**
Hi Sam. Thanks for your time. Where do you think most of the value creation will come from in the next 12 months? Memory? Security? Protocols? Agents?

> In some sense, the value will continue to come from three things:
>
> 1. Building out more infrastructure
> 2. Smarter models
> 3. Building the scaffolding to integrate all this into society
> If you push on those, the rest will sort itself out.
> At a more detailed level, I think:
> 2025 will be the year of *agents doing work*.
> Coding in particular—I’d expect it to be a dominant category.
> There will be a few others, too.
> Next year, I’d expect more:
> AI discovering new stuff.
> Maybe AI helps make some very large scientific discoveries—or assists humans in doing so.
> I’m a believer that most sustainable economic growth in human history—once you’ve spread out and colonized the Earth—comes from:
> Better scientific knowledge
> Implementing that knowledge for the world
> And then I’d guess:
> 2027 is the year it all moves from the intellectual realm to the physical world.
> Robots go from a curiosity to a serious economic creator of value.
> But that’s just an off-the-top-of-my-head guess.

**Moderator:**
Can I close with a few quick questions?

**Sam:**
> Great.

**Moderator:**
ChatGPT-5—is that going to be smarter than all of us here?

> I mean... if you think you're *way* smarter than GPT-4-03, then maybe you’ve still got a little bit of room.
> But 03 is already pretty smart.

**Moderator:**
Two personal questions. Last time you were here, you’d just come off a blip with OpenAI.
Given some distance and perspective now, do you have advice for founders here about resilience and endurance?

> It gets easier over time.
> You’ll face a lot of adversity as a founder.
> The challenges get harder and higher-stakes.
> But the emotional toll *gets easier* as you go through more of them.
> In some sense:
> Even though the challenges get bigger, your ability to deal with them gets stronger.
> With each one you go through, you build more resilience.
> The hardest thing about big challenges isn’t when they *happen*.
> A lot of things go wrong in the history of a company.
> And in the moment, you can function.
> You’ve got adrenaline, you’ve got support.
> Even when something really bad happens—like your company runs out of money and fails—a lot of people will come support you.
> You get through it.
> You go on to the next thing.
> But the harder part is the *fallout after*.
> Managing your psychology in the aftermath.
> Rebuilding.
> People focus a lot on handling the crisis on Day 1.
> But the *real* valuable skill is how to rebuild on Day 60.
> I’ve never really found anything great to point founders to on that topic.
> But that’s the part where you can practice and get better.

**Moderator:**
Thank you, Sam. You’re officially still on paternity leave, so thank you for coming in and speaking with us.

> Appreciate it. Thank you.

