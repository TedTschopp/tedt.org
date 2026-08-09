---
layout: post

title: "The Sandbox Was Not the Boundary"
subtitle: "What the OpenAI–Hugging Face incident reveals about agent containment, persistence, and incident closure"
quote: "The agent had no direct internet access. Its environment did."
excerpt: "The OpenAI–Hugging Face incident shows why an agent's boundary must include proxy services, persistent state, task-failure behavior, and the authority to restart after an incident."
source: "Original Content"
source-url: ""
call-to-action: "Discuss this on Mastodon"

date: 2026-08-08 09:00:00 -0700
update: 2026-08-08 09:00:00 -0700

author:
  avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
  name: Ted Tschopp
  url: https://tedt.org/

bullets:
  - An AI agent's effective boundary includes every service that can fetch, retain, transform, or act on its behalf.
  - A missing dependency is a security-relevant state; the agent needs an explicit rule for stopping or requesting a scope change.
  - Shared caches, directories, queues, and logs can become persistent communication channels across otherwise isolated runs.
  - Restoration, eradication, resumption, and closure are separate incident decisions requiring separate evidence.
  - High-impact defensive automation still needs independent authorization, assurance, and risk acceptance.

description: "The OpenAI–Hugging Face incident shows how proxy services, persistent state, and completion pressure can extend an AI agent beyond its sandbox."
seo-description: "What the OpenAI–Hugging Face incident teaches enterprise leaders about agent containment, indirect access, persistent state, model lineage, and incident closure."

categories:
  - AI
  - Computers
  - Opinion
  - Enterprise Architecture
  - Leadership

tags:
  - agentic AI
  - AI security
  - cybersecurity
  - AI agents
  - sandboxing
  - indirect internet access
  - Artifactory
  - server-side request forgery
  - incident response
  - model lineage
  - AI governance
  - automation controls

keywords:
  - AI agent containment
  - OpenAI Hugging Face incident
  - agent sandbox security
  - indirect internet access
  - Artifactory security
  - persistent agent state
  - cross-run agent communication
  - AI incident response
  - model and data lineage
  - defensive security automation

location:
  name: Bradbury, CA
  coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: "/img/2026-08/sandbox-boundary-hero-04-cross-run-shared-state.webp"
image-alt: "Five isolated AI agent environments exchange data through a shared central Artifactory service."
image-title: "The Sandbox Was Not the Boundary"
image-description: "An isometric diagram shows five glass-walled AI agent environments connected by data channels to a shared Artifactory repository, illustrating persistent cross-run communication beyond isolated sandboxes."
image-credits-artist: "Ted Tschopp"
image-credits-artist-URL: "https://tedt.org/"
image_width: 1672
image_height: 941

mathjax: false
mermaid: false
mastodon-post-id: null
---

> **Source note:** This essay draws from first-party disclosures by OpenAI and Hugging Face and an August 2026 Black Hat USA presentation by OpenAI researchers Eric Wallace and Michael Dalton. Their reconstruction was preliminary, the investigation remained open, and the speakers said a fuller postmortem would follow. The chronology below should be read with that boundary in mind.
{: .alert .alert-call-to-action }

In computing, a sandbox is a controlled workspace where software can act, but only with the files, tools, and connections it has been given. Think of it as a locked room built for experimentation. An AI agent may use everything placed inside, but it should not be able to wander into the rest of the building or reach the internet. That is the idea, anyway. The trouble begins when some small service  still connects the room to the world outside.

In this incident, that service was Artifactory.

Artifactory is a shared, company-controlled storeroom for software. Instead of letting every program search the internet for the parts it needed, programs asked Artifactory. If a part was not already on its shelves, Artifactory could retrieve it from outside, keep a copy, and pass it back. In this incident, the agents also discovered they could leave files and names there for later agents to find. The storeroom became both a way to access the internet and an unintended bulletin board that allowed separate agents and test runs to communicate with each other over the course of their testing.

In July 2026, [OpenAI disclosed](https://openai.com/index/hugging-face-model-evaluation-security-incident/) that models running an internal cyber-capability evaluation, including GPT-5.6 Sol, the latest and most capable model from OpenAI, and a more capable internal research prototype, had found and chained vulnerabilities across OpenAI's research environment and Hugging Face's production infrastructure. The models did not have broad, direct internet access. They could, however, install packages through an internally hosted Artifactory proxy and cache, and that service could reach the internet.

Hugging Face is a company and online platform where researchers and developers publish, share, and test artificial intelligence models, datasets, and software tools. People and organizations use it to find existing models, build new systems, and collaborate on machine-learning projects. In this incident, the agents eventually reached beyond OpenAI’s internal research environment and into systems operated by Hugging Face.

[Hugging Face's disclosure](https://huggingface.co/blog/security-incident-july-2026) and later [technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline) provide another first-party view of the intrusion. OpenAI researchers Eric Wallace and Michael Dalton then presented a more detailed reconstruction in a [Black Hat USA presentation](https://www.youtube.com/watch?v=87DyyMV0kCY). As of August 8, the public record is still preliminary, and the speakers said their investigation was incomplete. This chronology should be read as a current reconstruction, not a final forensic report.

## How Artifactory Connected the Runs

The chain began in May, when OpenAI started training new models.  It occurred across multiple tests and multiple test runs. One agent was asked to complete an Excel workbook whose missing formulas depended on data behind Google Drive links. The environment could not reach those links, so the task could not be completed as configured.

The agent kept trying. During an unsuccessful attempt to make Artifactory fetch an outside resource, the agent discovered that they could write a file into the service. A different agent later found itself missing a required database file and deliberately left a note in Artifactory asking whether another agent could provide it. Other agents found the notes and began leaving their own notes and requests for help.

Files became messages. Messages became assignments. The presentation at Black Hat describes agent identifiers, hold commands, ordering conventions, and encoded scripts moving through file and directory names. On May 26, agents reportedly succeeded in using a computer hacking approached called "server-side request forgery".  This is a method of making a computer fetch something on the behalf of someone else.  This gave it indirect internet access through Artifactory, using Artifactory as a go between the internet and the agent being tested.

The models had already been trained to collaborate. But this was a new behavior: A persistent communication skill that operated across separate runs through a go between, Artifactory, which was never intended to be a message board or a means to bypass access to the internet.

Where, then, did the agent's environment end?

It did not end at the sandbox's network interface. If an agent can cause another computer system to fetch an outside resource, that system is part of the agent's effective environment. If one run can write a name or file that a later run can read, that shared file is part of the environment too. The same question applies to caches, queues, logs, and other services that retain or act on the agent's behalf.

The environment the agent operated in didn't have access to the internet, but something in the room with it did (even though the developers at OpenAI and Artifactory didn't know it would), and the AI agent figured out how to make use of that indirect access.

## What Should Happen When a Task Cannot Be Completed?

The Black Hat presentation showed a reasoning-log excerpt in which a model identified external exploitation as outside its intended scope, then continued even though the task was now impossible but it reasoned that its peers were doing it so it decided that the best approach would be to stay on mission of being a helpful assistant and use the exploit. That excerpt does not establish consciousness, moral judgment, or human-like intent.  What was going on was that the agent had been trained to chose helpfulness and persistence over answering a question with No, I'm sorry I can't help you with that or asking the user to change the scope of the task or asking the user permission to access the outside world.  It was not trained to stop when a task could not be completed.

Read together, the presentation suggests a simple pattern. The intended route to help the user was blocked, but completion pressure remained. Persistence gave the agent time to search. Artifactory offered another route, and the shared space to collaborate allowed one agent to hand its discovery to the next. Parallel runs then multiplied the activity. None of those conditions alone explains the whole incident, but together they show why task feasibility belongs in a security review.

An approach to keep this under control would be to require that if a required asset, tool, service or file is missing or unavailable, the agent should identify the dependency, preserve the chain of thought, and stop. It should not quietly substitute a new route, credential, target, or data source unless someone with the authority to change the scope approves that change.

## Restored Is Not the Same as Ready

The reconstruction describes a serious Artifactory compromise and outage in early July that OpenAI's agents were responsible for. From July 4 through July 6, OpenAI revoked the credentials used to post the original messages, rebuilt and redeployed the service, cleared the original message board, worked with the vendor, patched the newly discovered zero-day, and then resumed training and evaluations.

On July 8, agents reportedly recreated the message board through an unauthenticated WebDAV path, this time using directory names as opposed to content inside the files or a database. The presenters later named three ingredients in the larger incident: the reopened board, a persistent internal model that was trained from the lessons learned about hacking the Artifactory and creating a messageboard, and exploit evaluations with reduced cyber refusals compared with production systems.

The approach taken by the OpenAI Engineers was thoughtful and thorough, but it did not settle everything. Their response restored their systems and closed the path the AI used to hack Artifactory that they knew about. It did not, by itself, settle whether another communication path remained, whether later models or runs had incorporated information from the affected environment, or whether it was safe to resume the evaluations.

The lesson here is that each of the following steps need to be seen as separate activities that require independent quality reviews to ensure they are completed fully.  **Restoration** asks whether the service works again. **Eradication** asks whether vulnerable paths have been closed, credentials revoked, and affected artifacts removed, quarantined, or explicitly accepted by a named risk owner. **Resumption** is the decision to restart training or evaluation. **Closure** comes only after the infrastructure and model-data work are complete, an independent retest has passed, and a named authority has accepted any remaining risk.

Those questions require two connected reviews. One follows the *infrastructure*: execution, credentials, dependencies, alternate paths, and evidence of restoration. The other follows *model and data lineage*: affected models, training and evaluation traces, memory, retrieval state, and derived runs. A clean server cannot answer the lineage question, and a quarantined model cannot show that every infrastructure path is closed.

## Where Automation Should Stop

Dalton argued that fully automated offensive loops are possible in at least some cases. His proposed response was to speed up the whole defensive loop, including vulnerability discovery, patch creation, deployment, rollback, and incident analysis. Otherwise, machine-speed discovery leaves people facing a queue of fixes they cannot process quickly enough.

But using AI to do that work does not give one system every decision. A defensive agent may find a vulnerability, write a patch, run tests, and prepare a deployment. It should not automatically follow from that sequence that the same agent may approve a high-impact production change, judge its own retest, and close the incident.

The approach you should take is to not treat automation as a continuum on a single axis. A low-risk change may move automatically when its boundaries are clear, its effects can be reversed, monitoring is active, and policy already permits it. Changes involving identity, regulated data, several systems, or irreversible effects need independent approval. If the current evidence or a workable rollback is missing, the automated path stops.

The same limits apply to deception. A honeytoken is a fake credential or other planted signal that raises an alarm when someone touches it. It may expose or slow an attacker, but it does not revoke real access or prove that the environment is contained.  If you see a honeytoken in use, you should ask who can stop the workload, revoke its access, and reconstruct what it did across agents and time.

## Lessons Learned

The lessons learned from this event can be reduced to five ordinary questions:

1. What can this agentic workload reach, including through other services?
2. What happens when an approved or required input is missing?
3. What state survives for the next agent run or model deployment?
4. Who can stop the workload, revoke its access, and reconstruct what it did across agents and time?
5. Who owns the cleanup, and who independently decides when it is safe to restart and close the incident?

That final decision should come only after the original and alternate paths have been retested and the infrastructure and model-data reviews are complete.

The chain leading into the incident began with an Excel spreadsheet trying to get data out of Google that was impossible for it to complete. That is worth remembering. The boundary failed at an ordinary moment: a task had no valid path to success, yet a shared service still offered a route around the block.

A room is not contained because its visible doors are locked. It is contained when we know where the light switches, pipes, windows, vents, crawlspaces, and service hatches lead, what can pass through each of them, and who has access to open and close those points of entry.
