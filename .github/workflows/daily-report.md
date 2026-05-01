---
name: Daily Report
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
engine: copilot
network:
  allowed:
    - defaults
    - github
tools:
  github:
    toolsets: [default, actions]
  bash:
    - date
    - ls
    - find
    - cat
    - head
    - tail
    - grep
    - wc
    - git status
    - git log
    - git diff
    - git show
safe-outputs:
  allowed-domains: [default-safe-outputs, tedt.org]
  max-bot-mentions: 1
  allowed-github-references: [repo]
  jobs:
    publish-daily-report:
      description: "Publish the validated daily report to Daily-Report/index.html. Call this exactly once when the report is ready."
      runs-on: ubuntu-latest
      permissions:
        actions: write
        contents: write
      output: "Daily report published to Daily-Report/index.html"
      inputs:
        title:
          description: "Short public title for the report."
          required: true
          type: string
        executive_summary:
          description: "A concise bottom-line summary in Markdown."
          required: true
          type: string
        report_markdown:
          description: "The full daily report body in Markdown. Use headings, bullets, and cited source links."
          required: true
          type: string
        source_notes:
          description: "Markdown list of sources, constraints, unavailable data, and assumptions."
          required: true
          type: string
      steps:
        - name: Checkout repository
          uses: actions/checkout@v5
          with:
            fetch-depth: 0
        - name: Setup Python
          uses: actions/setup-python@v6
          with:
            python-version: "3.12"
        - name: Render daily report
          run: |
            python3 _code/publish_daily_report_from_aw.py \
              --agent-output "$GH_AW_AGENT_OUTPUT" \
              --output Daily-Report/index.html
        - name: Validate generated report
          run: |
            test -s Daily-Report/index.html
            python3 tests/_code/test_publish_daily_report_from_aw.py
        - name: Commit daily report update
          id: commit_report
          run: |
            if [ -z "$(git status --porcelain -- Daily-Report/index.html)" ]; then
              echo "Daily report unchanged; nothing to commit."
              echo "changed=false" >> "$GITHUB_OUTPUT"
              exit 0
            fi

            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add Daily-Report/index.html
            git commit -m "chore: refresh daily report"
            git push
            echo "changed=true" >> "$GITHUB_OUTPUT"
        - name: Trigger site deploy
          if: steps.commit_report.outputs.changed == 'true'
          env:
            GH_TOKEN: ${{ github.token }}
          run: |
            gh workflow run deploy.yml --ref main
---

# Daily Report

Produce the public daily report for TedT.org and publish it to `/Daily-Report/index.html`.

## Operating Model

You are running inside GitHub Agentic Workflows. Treat this as a governed publishing workflow, not a free-form coding task.

- Read repository activity, recent commits, pull requests, issues, and workflow runs that are relevant to TedT.org.
- Use only verified repository context and GitHub tool output.
- Do not invent activity, metrics, failures, or risks.
- Do not edit files directly.
- Do not create issues or pull requests for the normal success path.
- When the report is ready, call the `publish_daily_report` safe-output tool exactly once.

## Report Requirements

The report is public. Keep it useful to a maintainer of this site.

Include:

- Bottom line up front.
- Recent repository activity.
- Site quality and workflow health.
- Content or publishing pipeline observations.
- Risks, blockers, or missing data.
- Recommended next actions.
- Source notes with links to GitHub commits, workflow runs, issues, or pull requests where available.

Use Ted's preferred style: direct, structured, pragmatic, and explicit about tradeoffs. Label assumptions as `[ASSUMPTION]`.

## Safe Output Contract

Call `publish_daily_report` with:

- `title`: short title, normally `Daily Report - YYYY-MM-DD`.
- `executive_summary`: concise Markdown summary.
- `report_markdown`: full Markdown report body.
- `source_notes`: Markdown list of sources, constraints, unavailable data, and assumptions.

If no meaningful repository activity is available, still publish a short report that says so plainly and explains what data was checked.

If required data is unavailable or a tool is missing, say that in `source_notes` instead of guessing.