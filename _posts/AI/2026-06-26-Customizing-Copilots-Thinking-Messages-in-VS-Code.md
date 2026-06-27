---
layout: post

title: "Customizing Copilot's Thinking Messages in VS Code"
subtitle: "A small settings change that makes the agent feel more like it belongs in your workspace"
quote: "The machinery does not have to sound like machinery."
excerpt: "VS Code lets you customize the short thinking messages shown while GitHub Copilot works. Here is how to replace the default agent status phrases with a custom list in your own voice."
source: "Original Content"
call-to-action: "Try the settings snippet in VS Code."

date: 2026-06-26 00:00:00 -0700
update: 2026-06-26 00:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
- VS Code can replace the short status phrases shown while GitHub Copilot is thinking.
- The setting lives in your VS Code user settings JSON under `chat.agent.thinking.phrases`.
- This changes the visible agent experience, not the model, its instructions, or its reasoning.
- Good thinking messages are short, varied, recognizable, and appropriate for the places where you work.
- Avoid putting secrets, customer names, or sensitive internal project names into synced settings.

description: "A practical guide to customizing GitHub Copilot's thinking messages in VS Code by adding a custom chat.agent.thinking.phrases setting to user settings JSON."
seo-description: "Learn how to customize GitHub Copilot thinking messages in VS Code with the chat.agent.thinking.phrases setting and a reusable example phrase pack."

categories:
- AI
- Computers

tags:
- github-copilot
- vs-code
- visual-studio-code
- ai-coding
- developer-experience
- agentic-engineering
- settings-json
- workflow-design

keywords:
- "GitHub Copilot thinking messages"
- "VS Code chat.agent.thinking.phrases"
- "customize Copilot agent messages"
- "VS Code user settings JSON"
- "Copilot agent mode"

image: "/img/2026-06/Middle-Earth-Panorama.webp"
image-alt: "A wide fantasy panorama with a round green door in a hillside home, travelers overlooking mountains, rivers, bridges, distant white cities, and riders moving through a sunlit valley."
image-artist: "Ted Tschopp"
image-artist-URL: "https://tedt.org/"
image-description: "A sweeping fantasy landscape with a hillside doorway, travelers, bridges, mountains, rivers, towers, and riders, used to echo the Middle-earth-inspired phrase pack in the article."
image-title: "Middle-Earth Panorama"
image_width: 1672
image_height: 941

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

mastodon-post-id:
---

Small details shape how a tool feels.

That is especially true with AI coding agents. Most of the attention goes to the model, the prompt, the context window, the tool calls, and the code that comes back. Those things matter. They are the load-bearing parts of the system.

But there is another layer that matters too: the experience around the waiting.

When GitHub Copilot is working in VS Code, it shows short status messages while the agent is thinking. By default, those messages are generic. That is fine. Generic is usually the right default.

But if you spend a lot of time working with agents, the default phrasing can start to feel like machinery talking about machinery.

VS Code gives you a small escape hatch.

You can replace those thinking messages with your own phrase list.

## What The Setting Does

The setting has two parts.

`mode` tells VS Code how to handle the custom list. The example above uses `replace`, which means your phrases replace the default thinking messages.

`phrases` is the list of messages VS Code can choose from while the agent is working.

The messages should be short. Think status text, not prose. The phrase is there to add texture while the system is busy. It should not compete with the actual work.

## Why This Is Useful

This is not about making a productivity tool cute for its own sake.

The better reason is that AI work already asks people to tolerate ambiguity. When an agent is thinking, calling tools, editing files, or checking context, the user is waiting inside a system they cannot fully see.

Small interface cues help set the tone of that waiting.

A good phrase set can make the experience feel:

- less sterile,
- more personally grounded,
- easier to recognize as part of your own workspace,
- and less like every other AI panel on the internet.

That matters because tools are not only functions. They are habits. The more often you use a tool, the more its small defaults become part of your working environment.

This is customization as ergonomics.

## A Middle-earth Phrase Pack

Here is the full version of the phrase pack I am using as a starting point.

```jsonc
{
  "chat.agent.thinking.phrases": {
    "mode": "replace",
    "phrases": [
      "Packing lembas for the journey",
      "Consulting the maps in Rivendell",
      "Listening to Elrond's counsel",
      "Sharpening Sting",
      "Polishing mithril mail",
      "Checking the road out of the Shire",
      "Saddling Bill the Pony",
      "Reading the Red Book",
      "Following the Ranger's trail",
      "Lighting the beacons of Gondor",
      "Summoning the riders of Rohan",
      "Counting ponies at the Prancing Pony",
      "Preparing second breakfast",
      "Looking for mushrooms off the path",
      "Checking Gandalf's fireworks",
      "Translating Elvish runes",
      "Reading moon-letters by starlight",
      "Remembering the word for friend",
      "Opening the western gate",
      "Crossing the Bridge of Khazad-dûm",
      "Listening for drums in the deep",
      "Keeping watch in Lothlórien",
      "Receiving wisdom from Galadriel",
      "Filling waterskins by the Silverlode",
      "Singing songs beneath the mallorn trees",
      "Launching boats from Lórien",
      "Paddling down the Anduin",
      "Scouting the riverbanks",
      "Taking counsel with Aragorn",
      "Tracking footprints across the plains",
      "Following hobbit tracks through Rohan",
      "Speaking gently to Shadowfax",
      "Braiding the horses of the Mark",
      "Sounding the horn of Helm Hammerhand",
      "Mending mail in Helm's Deep",
      "Holding the Deeping Wall",
      "Riding out with the dawn",
      "Gathering at Edoras",
      "Checking the muster of Rohan",
      "Raising the banner of the White Tree",
      "Guarding the walls of Minas Tirith",
      "Climbing the stairs of the Citadel",
      "Planting saplings in the court of the king",
      "Searching the archives of Gondor",
      "Restoring the shards of Narsil",
      "Carrying Andúril into battle",
      "Taking the Paths of the Dead",
      "Calling old oaths to account",
      "Sailing from the southern havens",
      "Standing with the Captains of the West",
      "Finding courage in small hands",
      "Sharing stories by the campfire",
      "Keeping the Fellowship together",
      "Checking the Elven cloaks",
      "Fastening leaf-shaped brooches",
      "Packing rope from Lórien",
      "Testing the strength of dwarf-craft",
      "Consulting Gimli on stonework",
      "Asking Legolas about distant movement",
      "Counting arrows in the quiver",
      "Listening for eagle wings",
      "Sending word by swift riders",
      "Reading the stars above Eriador",
      "Watching for sunrise over the mountains",
      "Crossing the Misty Mountains carefully",
      "Finding the safest pass",
      "Avoiding shortcuts through old forests",
      "Taking tea in Bag End",
      "Tidying up after an unexpected party",
      "Checking the pantry for seed-cake",
      "Refilling the ink in Bilbo's study",
      "Copying verses into the Red Book",
      "Practicing swordplay with wooden blades",
      "Learning courage from old tales",
      "Standing watch while friends sleep",
      "Sharing the last bite of lembas",
      "Carrying hope through dark places",
      "Remembering the Shire",
      "Thinking of home and green hills",
      "Trusting to friendship and good timing",
      "Waiting for Gandalf to explain",
      "Looking for a sign from the Eagles",
      "Listening to the Entmoot",
      "Counting Entish syllables",
      "Carrying messages through Fangorn",
      "Planting trees where shadows passed",
      "Healing in the Houses of Healing",
      "Calling for athelas",
      "Washing off the dust of the road",
      "Reforging what was broken",
      "Finding the path where none is marked",
      "Choosing the road that must be taken",
      "Taking one more step toward the light"
    ]
  }
}
```

## How To Write Your Own Pack

The best phrase packs have a coherent world behind them.

They do not need to be elaborate. They just need to sound like they belong together.

Good patterns:

- Use verbs that imply useful motion: checking, reading, sorting, tracing, testing, preparing.
- Keep each line short enough to scan without effort.
- Vary the energy level so every message does not sound equally dramatic.
- Avoid anything that sounds like the agent is making promises it cannot keep.
- Keep workplace context in mind. A phrase that is charming on your personal machine may be distracting during a screen share.

Weak patterns:

- Long jokes that get old by the third run.
- Phrases that imply the model is conscious, certain, or authoritative.
- Team-only references that will confuse future you.
- Sensitive names, incident labels, customer names, or unreleased project code names.

The point is not to pretend the agent is something it is not.

The point is to make the interface fit the human using it.

## A Better Default For Your Own Tools

This is also a useful reminder for anyone building internal AI tools.

The technical behavior matters most. But the perceived behavior matters too.

When a system is slow, vague, or opaque, people fill the silence with guesses. When the system gives small, coherent signs of life, people are more willing to stay oriented.

That does not mean adding noise. It means designing the waiting state with the same care as the successful state.

In this case, VS Code already gives us the hook. We just have to decide what voice belongs in the room.
