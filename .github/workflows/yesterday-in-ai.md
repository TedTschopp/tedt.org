---
name: Yesterday in Enterprise AI
on:
  schedule: daily around 6am utc-7
  workflow_dispatch:
permissions:
  contents: read
  actions: read
engine: copilot
network:
  allowed:
    - defaults
    - github
    - rss.tedt.org
    - tedt.org
tools:
  bash:
    - date
    - ls
    - find
    - cat
    - head
    - tail
    - grep
    - wc
    - curl
    - python3
safe-outputs:
  allowed-domains:
    - default-safe-outputs
    - allenai.org
    - archive.is
    - archive.md
    - arxiv.org
    - aws.amazon.com
    - blog.cloudflare.com
    - blog.eladgil.com
    - blog.google
    - claude.com
    - cloud.google.com
    - cursor.com
    - deepmind.google
    - developers.openai.com
    - hbr.org
    - huggingface.co
    - jsonfeed.org
    - mistral.ai
    - news.google.com
    - openai.com
    - poolside.ai
    - rss.tedt.org
    - simonwillison.net
    - slack.engineering
    - techcrunch.com
    - tedt.org
    - venturebeat.com
    - www.a16z.news
    - www.anthropic.com
    - www.bain.com
    - www.glean.com
    - www.ibm.com
    - www.kimi.com
    - www.langchain.com
    - www.mckinsey.com
    - www.nvidia.com
    - www.nytimes.com
    - www.salesforce.com
    - www.technologyreview.com
    - www.theverge.com
    - www.viksnewsletter.com
    - x.com
  max-bot-mentions: 1
  allowed-github-references: []
  jobs:
    publish-yesterday-in-ai:
      description: "Publish the validated Yesterday in Enterprise AI newsletter to Daily-Report/AI/index.html. Call this exactly once when the newsletter is ready."
      runs-on: ubuntu-latest
      permissions:
        actions: write
        contents: write
      output: "Yesterday in Enterprise AI published to Daily-Report/AI/index.html"
      inputs:
        title:
          description: "Short public title for the newsletter."
          required: true
          type: string
        executive_summary:
          description: "The newsletter TL;DR in Markdown."
          required: true
          type: string
        report_markdown:
          description: "The full newsletter body in Markdown. Use headings, bullets, and Markdown links to original sources."
          required: true
          type: string
        source_notes:
          description: "Markdown list of editor's notes, feed counts, source constraints, unavailable data, and assumptions."
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
        - name: Render AI newsletter
          run: |
            python3 _code/publish_daily_report_from_aw.py \
              --agent-output "$GH_AW_AGENT_OUTPUT" \
              --item-type publish_yesterday_in_ai \
              --eyebrow "Yesterday in Enterprise AI" \
              --summary-heading "TL;DR" \
              --report-heading "Newsletter" \
              --sources-heading "Editor's Notes" \
              --output Daily-Report/AI/index.html
        - name: Validate generated newsletter
          run: |
            test -s Daily-Report/AI/index.html
            python3 tests/_code/test_publish_daily_report_from_aw.py
        - name: Commit AI newsletter update
          id: commit_newsletter
          run: |
            if [ -z "$(git status --porcelain -- Daily-Report/AI/index.html)" ]; then
              echo "Yesterday in Enterprise AI unchanged; nothing to commit."
              echo "changed=false" >> "$GITHUB_OUTPUT"
              exit 0
            fi

            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add Daily-Report/AI/index.html
            git commit -m "chore: refresh yesterday in enterprise ai"
            git push
            echo "changed=true" >> "$GITHUB_OUTPUT"
        - name: Trigger site deploy
          if: steps.commit_newsletter.outputs.changed == 'true'
          env:
            GH_TOKEN: ${{ github.token }}
          run: |
            gh workflow run deploy.yml --ref main
---

# Yesterday in Enterprise AI

Generate the public `Yesterday in Enterprise AI` newsletter and publish it to `/Daily-Report/AI/index.html`.

## Operating Model

You are running inside GitHub Agentic Workflows. Treat this as a governed publishing workflow, not a free-form coding task.

- Use the source prompt below as the editorial contract.
- Fetch the feed URLs named in the prompt using available read-only tools.
- Use current Pacific Time for date filtering. If needed, derive it with `date` or Python's `zoneinfo`.
- Check the existing `Daily-Report/AI/index.html`, if present, to avoid repeating items already covered in the last 7 days.
- Do not edit files directly.
- Do not create issues or pull requests for the normal success path.
- Because this runs unattended, do not ask the user to paste feed XML. If feed data is unavailable, publish a short report explaining the missing data in `source_notes`.
- When the newsletter is ready, call the `publish_yesterday_in_ai` safe-output tool exactly once.

## Source Prompt

Read `prompts/! - Yesterday in AI.md` from the checked-out repository and follow it as the editorial contract. Use `cat 'prompts/! - Yesterday in AI.md'` before fetching feed data so the repository prompt remains the source of truth.

## Safe Output Contract

Call `publish_yesterday_in_ai` with:

- `title`: short title, normally `Yesterday in Enterprise AI - YYYY-MM-DD` using the Pacific Time date.
- `executive_summary`: the TL;DR section in Markdown.
- `report_markdown`: the full newsletter body in Markdown.
- `source_notes`: the Editor's Notes section in Markdown, including feed counts and assumptions.

Use Markdown links for source URLs. Use HTTPS source URLs only. Do not emit raw HTML.

If no qualifying 24-36 hour feed items are available, still publish a short newsletter that says so plainly and explains what data was checked.
