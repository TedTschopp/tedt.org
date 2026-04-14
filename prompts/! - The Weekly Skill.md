# The Skill Prompt

*One skill. One reusable capability for an AI agent.*

**Skill Name:** {{LOWERCASE-HYPHENATED-SKILL-NAME}}
**Job to Be Done:** {{SHORT DESCRIPTION OF THE NEW CAPABILITY}}
**Environment / Constraints:** {{TARGET AGENT, TOOLS, PACKAGES, NETWORK, OS, OR OTHER LIMITS}}

## Why This Skill Exists

A short, grounded explanation of *why this skill should exist*.

* What recurring task or problem does it solve?
* What does the agent tend to get wrong without it?
* Why should this live as a reusable skill instead of a one-off answer?

Keep this practical and specific.
Think: *“This is the task that keeps coming back…”* or *“This is where the agent needs guidance, defaults, and guardrails…”*

> Optional framing sentence that captures the real value of the skill.

## The Skill Package

Return a complete Agent Skill package, not just an idea.

Include:

1. A directory tree
2. A complete `SKILL.md`
3. Optional support files only when they materially improve reliability:
   * `scripts/`
   * `references/`
   * `assets/`
4. A short validation section with:
   * a validation command
   * 3–5 should-trigger example prompts
   * 3–5 should-not-trigger example prompts

Use this general structure:

```text
{{skill-name}}/
├── SKILL.md
├── scripts/          # optional
├── references/       # optional
├── assets/           # optional
└── ...
```

## The `SKILL.md`

Write a spec-aligned `SKILL.md` file.

It must begin with YAML frontmatter, followed by Markdown instructions.

Use this shape:

```yaml
---
name: {{lowercase-hyphenated-skill-name}}
description: {{A concise trigger-oriented description that says what the skill does and when to use it. Prefer wording like: "Use this skill when..."}}
license: {{OPTIONAL}}
compatibility: {{OPTIONAL}}
metadata:
  author: {{OPTIONAL}}
  version: {{OPTIONAL}}
allowed-tools: {{OPTIONAL SPACE-SEPARATED TOOLS}}
---
```

Rules for the frontmatter:

* `name` must be lowercase, hyphenated, and match the folder name
* `description` must explain both what the skill does and when to use it
* Write the description for triggering, based on user intent rather than implementation details
* Include `compatibility` only when the environment really matters
* Include optional fields only when they add real value

## The Body of `SKILL.md`

Write the Markdown body so the agent can actually perform the task reliably.

Recommended sections:

* **Purpose**
* **When to use this skill**
* **When not to use this skill**
* **Inputs / assumptions**
* **Default approach**
* **Step-by-step workflow**
* **Gotchas**
* **Validation / self-check**
* **Examples**
* **File references**

The body should be:

* procedural, not generic
* reusable, not tailored to one exact request
* concise enough to stay focused
* explicit about defaults
* clear about scope boundaries

Prefer:
* defaults over menus
* methods over one-off answers
* concrete gotchas over vague advice
* validation loops over “hope it worked”

Avoid generic filler like:
* “handle errors appropriately”
* “follow best practices”
* “use whatever tool seems right”

## Support Files (Only When Needed)

### `scripts/`

Only add scripts when they make the skill more reliable, repeatable, or easier for the agent to execute.

If you include scripts, they should:

* be non-interactive
* accept input via flags, environment variables, or stdin
* support `--help`
* print structured data to stdout when possible
* print diagnostics to stderr
* return helpful, specific error messages
* use safe defaults
* support `--dry-run` for destructive or stateful actions when appropriate

Show exactly how the agent should invoke each script from the skill root.

### `references/`

Use `references/` for focused documentation the agent should load on demand.

Examples:
* domain rules
* schemas
* API quirks
* detailed edge cases
* structured templates

Tell the agent exactly **when** to open each reference file.

### `assets/`

Use `assets/` for static resources such as:

* templates
* schemas
* examples
* lookup tables
* sample outputs

Only include assets that improve execution quality.

## File References

When referencing supporting files:

* use relative paths from the skill root
* keep references shallow and easy to follow
* avoid deep chains of linked files
* state when a file should be opened, not just that it exists

Examples:

* Read `references/api-errors.md` if the API returns a non-200 response.
* Use `assets/report-template.md` when the user asks for a formal summary.
* Run `scripts/validate.py` before producing the final output.

## What This Skill Does Well

List 3–5 concrete strengths of the skill.

Examples:
* reliable triggering
* clear default path
* strong handling of known edge cases
* explicit validation before final output
* reusable support files instead of bloated instructions

(Optional)
**What it intentionally avoids:** define the edges of scope so the skill does not become too broad.

## Practical Guidance

Explain how the agent should use the skill in practice.

Cover:

* when it should trigger
* when it should not trigger
* what input quality matters most
* what assumptions the skill makes
* what the agent should validate before finishing

You can include:

* a short checklist
* one example task
* one example of a bad trigger
* one example of escalation to a support file

## Variations

Offer 3–5 lightweight packaging variations for the same skill.

* **Minimal version:**
  > A single-file `SKILL.md` with no support files.

* **Script-backed version:**
  > Add `scripts/` for repeatable execution or validation.

* **Reference-backed version:**
  > Keep `SKILL.md` lean and move detailed rules into `references/`.

* **Safer version:**
  > Add stronger validation, `--dry-run`, or stricter guardrails.

* **Team-specific version:**
  > Encode organization-specific conventions, naming, or workflows.

## Common Failure Modes

Name the ways skills like this usually fail.

Examples:

* vague or weak `description` text that never triggers
* over-broad descriptions that trigger too often
* too much theory and not enough procedure
* too many tool choices with no default
* missing gotchas
* no validation step
* scripts that require interaction
* bloated `SKILL.md` content that should be moved into references
* instructions that solve one example instead of teaching a reusable method

## Validation

End with a lightweight validation section.

Include:

* a command like `skills-ref validate ./{{skill-name}}`
* 3–5 should-trigger prompts
* 3–5 should-not-trigger prompts
* one quick note on how to test the skill against a realistic task

## A Question to Pressure-Test the Skill

End with one human design question—not a prompt.

> *What would the agent still get wrong after reading this skill, and what instruction, script, or reference would prevent that?*

## Final Output Order

Return the final answer in this order:

1. A short rationale for the skill
2. The directory tree
3. The full `SKILL.md`
4. Any optional support files in full
5. The validation section

Write the result so an agent could use it immediately.
Aim for a coherent unit of work, moderate detail, strong defaults, and reliable execution.