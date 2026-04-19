# The Skill Prompt

*One skill. One reusable capability for an AI agent.*

## Skill Snapshot

**Skill Name:** `{{lowercase-hyphenated-skill-name}}`  
**Job to Be Done:** `{{one-sentence description of the capability}}`  
**Best Used When:** `{{repeatable situation where this skill clearly helps}}`  
**Do Not Use When:** `{{adjacent tasks this skill should not handle}}`  
**Environment / Constraints:** `{{target agent, tools, packages, network, OS, permissions, or limits}}`

## Why This Skill Exists

Write a short, grounded explanation of why this skill should exist.

Address these questions directly:

- What recurring task or problem does it solve?
- What does the agent tend to get wrong without it?
- Why should this be a reusable skill instead of a one-off answer?

Keep this practical and specific.

> Optional framing sentence that captures the real value of the skill.

## Inputs This Skill Expects

List the minimum context needed for good performance.

- Required inputs
- Helpful optional context
- Files, formats, or examples the agent should look for
- Assumptions the agent is allowed to make

## Outputs This Skill Should Produce

Describe the expected deliverable.

- Final format
- Tone or style requirements
- Quality bar
- What “done” looks like

## The Skill Package

```text
---
name: {{lowercase-hyphenated-skill-name}}
description: "{{what the skill does, when to use it, and what it helps avoid}}"
license: "{{license or usage note}}"
---

# {{Human-Readable Skill Title}}

## Purpose
{{One paragraph explaining the capability in plain language.}}

## Use This When
- {{repeatable trigger 1}}
- {{repeatable trigger 2}}
- {{repeatable trigger 3}}

## Do Not Use This When
- {{nearby but out-of-scope case 1}}
- {{nearby but out-of-scope case 2}}

## Required Inputs
- {{input 1}}
- {{input 2}}

## Defaults
- {{sensible assumption 1}}
- {{sensible assumption 2}}

## Constraints
- {{tooling, policy, latency, environment, or formatting limits}}

## Steps
1. {{how the agent should begin}}
2. {{how the agent should reason or inspect the task}}
3. {{how the agent should produce the output}}
4. {{how the agent should check its work}}

## Quality Bar
- {{criterion 1}}
- {{criterion 2}}
- {{criterion 3}}

## Failure Handling
- {{what to do when inputs are missing or ambiguous}}
- {{what to avoid bluffing or inventing}}

## Example Invocation
{{one realistic example of a request that should trigger this skill}}
```

## Support Files

### Directory Tree

```text
{{directory tree for support files, if any}}
```

### File Contents

```text
{{contents or summaries of support files, if any}}
```

## How to Use It

Explain how someone should interact with the prompt.

Cover:

- When to use it
- When not to use it
- What kind of input quality matters most

A short checklist works well here.

## Variations

Offer 3 to 5 lightweight variations.

**For speed:**  
> {{shortened or constrained version}}

**For depth:**  
> {{more reflective or multi-step version}}

**For teams:**  
> {{collaborative or facilitation version}}

**For critique:**  
> {{devil’s-advocate or stress-test version}}

## Common Failure Modes

Name the ways people often misuse or misunderstand a prompt like this.

- Over-specifying too early
- Treating output as truth instead of input
- Skipping context
- Asking for answers instead of reasoning
- {{task-specific failure mode}}

## Acceptance Check

Before publishing the skill, verify:

- A new agent could use it without extra explanation
- The boundaries are clear
- The defaults are explicit
- The output format is obvious
- The skill does not encourage bluffing

## A Question to Sit With

End with a human question, not another prompt.

> *{{a question that lingers after the scroll}}*

## Closing

Add a short, warm sign-off in your voice.

Examples:

- A reflection from the week
- A reminder about curiosity
- An invitation to reply or share how it went

**— {{Your Name}}** *{{Series or Signature}}*
