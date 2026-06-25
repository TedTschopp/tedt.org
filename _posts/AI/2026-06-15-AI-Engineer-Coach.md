---
layout: post

title: "AI Engineer Coach: A VS Code Extension for Measuring How You Work With AI"
subtitle: "A local dashboard for AI coding habits, output, context health, and cost signals"
quote: "You cannot improve what you cannot see."
excerpt: "AI Engineer Coach is a VS Code extension that reads local AI coding session logs and turns them into a practical feedback loop: usage patterns, anti-patterns, output, context health, token usage, and cost signals."
source: "Original Content"
source-url: "https://github.com/TedTschopp/AI-Engineering-Coach"
call-to-action: "Download the VSIX and try it in VS Code."

date: 2026-06-15 09:00:00 -0700
update: 2026-06-15 09:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
- AI Engineer Coach turns local AI coding logs into a dashboard for habits, output, context quality, and improvement opportunities.
- It supports multiple AI coding harnesses, including VS Code, GitHub Copilot for Xcode, Claude, Codex, OpenCode, and GitHub Copilot CLI.
- The extension is read-only and works from local session data; no usage data leaves your machine.
- The latest build includes visible token, AI credit, and estimated cost reporting with a runtime toggle on the Dashboard.
- A downloadable VSIX is included for coworkers who want to install and test it locally.

description: "A practical introduction to AI Engineer Coach, a local VS Code extension that analyzes AI coding assistant usage across multiple harnesses and exposes dashboards for activity, output, anti-patterns, context health, token usage, AI credits, and estimated cost."
seo-description: "Download and install AI Engineer Coach, a VS Code extension that analyzes local AI coding assistant usage, output, context health, token usage, AI credits, and estimated cost."

categories:
- AI
- Computers

tags:
- ai-engineer-coach
- vs-code
- github-copilot
- codex
- claude-code
- opencode
- ai-coding
- agentic-engineering
- developer-productivity
- ai-costs
- token-usage
- context-engineering

keywords:
- "AI Engineer Coach"
- "VS Code extension"
- "AI coding dashboard"
- "AI coding analytics"
- "GitHub Copilot usage"
- "Codex usage"
- "Claude Code usage"
- "token usage"
- "AI credits"
- "estimated AI cost"

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-06/ai-engineer-coach-burndown-video-frame.webp"
image-alt: "A laptop screen showing AI Engineer Coach's burndown chart and budget projection inside VS Code."
image-artist: "AI Engineer Coach project"
image-artist-URL: "https://github.com/TedTschopp/AI-Engineering-Coach"
image-credits: "Frame captured from the AI Engineer Coach README video"
image-credits-URL: "https://github.com/TedTschopp/AI-Engineering-Coach"
image-description: "A frame from the AI Engineer Coach README video showing the Burndown page inside VS Code, with cumulative usage, projected usage, and budget lines visible on a laptop screen."
image-title: "AI Engineer Coach Burndown"
image_width: 1280
image_height: 720

video:
  provider: github
  url: "https://github.com/user-attachments/assets/9f0239bf-20e0-459f-b137-17cce0edd1b2"
  type: "video/mp4"
  poster: "/img/2026-06/ai-engineer-coach-burndown-video-frame.webp"
  label: "Video Demo"
  title: "AI Engineer Coach video demo"
  description: "Watch the AI Engineer Coach video demo"
  aspect: "16x9"

mastodon-post-id:
---

AI coding tools are becoming part of the normal developer workbench. That means the question is changing.

It is no longer only, "Can the model write code?"

The better question is, "How are we actually using these systems, and are we getting better at it?"

That is what **AI Engineer Coach** is for.

AI Engineer Coach is a VS Code extension that reads local AI coding session logs and turns them into a dashboard. It gives you a way to see your own interaction patterns across tools such as VS Code, GitHub Copilot for Xcode, Claude, Codex, OpenCode, and GitHub Copilot CLI.

It is not trying to be another coding assistant. It is trying to be the mirror next to the coding assistant.

## Download

I packaged the current local build as a VSIX so coworkers can try it directly. This package was rebuilt after syncing with the latest Microsoft upstream changes:

[Download AI Engineer Coach 0.1.0 VSIX](/downloads/ai-engineer-coach-0.1.0.vsix)

File details:

- File: `ai-engineer-coach-0.1.0.vsix`
- Size: about 3.35 MB
- SHA-256: `27d1ccf352558c698872874ccdd3136d8f89af858c99d29ac85d6031aeed8a1e`
- Source repo: [TedTschopp/AI-Engineering-Coach](https://github.com/TedTschopp/AI-Engineering-Coach)

To install it:

1. Download the VSIX.
2. In VS Code, open the Extensions view.
3. Choose **Install from VSIX...**
4. Select the downloaded file.
5. Reload VS Code if prompted.
6. Open the command palette and run **AI Engineer Coach: Open Dashboard**.

You can also install from the command line:

```bash
code --install-extension ai-engineer-coach-0.1.0.vsix
```

## What It Shows

The extension organizes the experience into three practical questions.

**Observe:** What happened?

You get a dashboard, timeline, session history, and daily activity charts. This is the part that helps you see when you are using AI, which workspaces are active, and how your sessions overlap over time.

**Measure:** What did it produce?

The Output view shows AI-generated code volume by language and workspace. The current build also exposes Token Usage, AI Credits, Estimated Cost, and Burndown views so you can see cost and consumption signals from the local data the extension can read.

Those numbers should be treated as estimates, not billing records. They are useful as a feedback signal. They are not a replacement for the official system of record.

**Improve:** Where are the habits?

The anti-patterns and context-health views are the most useful parts for coaching. They look for repeated prompts, missing context, poor instruction files, weak agentic readiness, overlong sessions, and other patterns that make AI coding less effective.

The point is not to shame anyone for using AI badly. The point is to make invisible habits visible enough that they can be improved.

## Why This Matters

Most AI adoption discussions are still too model-centered.

Which model is smarter?

Which model is cheaper?

Which model writes better code?

Those are valid questions, but they are incomplete. In real work, the human and the harness matter just as much as the model. The same model can produce very different results depending on the quality of the prompt, the available context, the instructions in the repo, the tool loop, and the developer's review habits.

AI Engineer Coach is useful because it focuses on that layer.

It asks:

- Are you giving the agent enough context?
- Are you repeating prompts because the first request was underspecified?
- Are you using heavier models for work that does not need them?
- Are you reviewing generated code or just accepting output?
- Are you building reusable skills and instructions, or re-explaining the same task every time?
- Are your projects ready for agentic development, or are they missing the basic files agents need?

That is the kind of measurement developers and teams need if AI-assisted engineering is going to become a discipline instead of a vibe.

## The Cost Signal

The build linked above includes the token and cost reporting work I wanted visible.

In the Dashboard there is a **Token Reporting** control. When it is enabled, the Output and Burndown sections show token usage, AI credits, estimated cost, per-model breakdowns, and budget progress. When it is disabled, those views hide in real time.

That matters because cost reporting should be visible when you want to learn from it, but it should also be easy to turn off when it is not relevant to the conversation.

Again, this is local, approximate reporting. The value is in behavior change:

- noticing expensive patterns
- spotting heavier-model overuse
- seeing when cache behavior is poor
- understanding which workspaces and harnesses drive usage
- turning vague anxiety about cost into a more concrete signal

## Privacy And Scope

The extension reads local logs. It is designed as a local analysis tool.

No data leaves your machine.

That is important. A tool like this is useful precisely because it can look at sensitive developer workflow patterns without uploading them to another service. It is still software you should inspect and install intentionally, but the design goal is local visibility rather than centralized surveillance.

Also, this is not an official Microsoft product or support channel. Treat it as an open-source/community tool for learning, experimentation, and local productivity analysis.

## What I Would Use It For

If you install it, I would start with three views:

1. **Dashboard** - to get the broad read on your AI coding activity.
2. **Output** - to see code output, token usage, AI credits, and estimated cost.
3. **Context Health** - to see whether your workspace is giving agents enough structure to succeed.

Then look at the anti-patterns.

The uncomfortable findings are usually the most useful ones. Repeated prompts, missing context, and weak instructions are not character flaws. They are process signals. Fix the system around the agent and the agent gets better.

That is the real lesson here.

AI coding is not only about smarter models. It is about building a better feedback loop around the work.

AI Engineer Coach gives that loop a dashboard.
