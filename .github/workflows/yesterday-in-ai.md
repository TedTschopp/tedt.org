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
    - a16z.news
    - aisnakeoil.com
    - aisnakeoil.substack.com
    - aiweekly.co
    - algolia.com
    - allenai.org
    - anthropic.com
    - archive.is
    - archive.md
    - arstechnica.com
    - artificialintelligence-news.com
    - arxiv.org
    - aws.amazon.com
    - bain.com
    - blog.cloudflare.com
    - blog.eladgil.com
    - blog.google
    - blog.samaltman.com
    - claude.com
    - cloud.google.com
    - cursor.com
    - deepmind.com
    - deepmind.google
    - developers.openai.com
    - export.arxiv.org
    - feed.infoq.com
    - feeds.arstechnica.com
    - futurism.com
    - glean.com
    - hbr.org
    - hn.algolia.com
    - hnrss.org
    - huggingface.co
    - ibm.com
    - infoworld.com
    - jsonfeed.org
    - kimi.com
    - langchain.com
    - magazine.sebastianraschka.com
    - marktechpost.com
    - mckinsey.com
    - mistral.ai
    - natural20.com
    - news.google.com
    - nvidia.com
    - nytimes.com
    - oneusefulthing.org
    - oneusefulthing.substack.com
    - openai.com
    - poolside.ai
    - reddit.com
    - rss.tedt.org
    - salesforce.com
    - sciencedaily.com
    - simonwillison.net
    - slack.engineering
    - techcrunch.com
    - technologyreview.com
    - techrepublic.com
    - tedt.org
    - the-decoder.com
    - theverge.com
    - venturebeat.com
    - viksnewsletter.com
    - wired.com
    - x.ai
    - x.com
    - zdnet.com
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
          description: "The newsletter TL;DR in Markdown. Do not include a TL;DR heading; the page template supplies it."
          required: true
          type: string
        report_markdown:
          description: "The full newsletter body after the TL;DR and before Editor's Notes. Use only ##-#### headings, paragraphs, bullets, numbered lists, bold text, inline code, blockquotes, horizontal rules, images, and Markdown links. Do not use top-level # headings, Markdown pipe tables, single-asterisk italics, or raw HTML."
          required: true
          type: string
        source_notes:
          description: "Markdown bullet list of editor's notes, feed counts, source constraints, unavailable data, and assumptions. Do not include an Editor's Notes heading; the page template supplies it. Do not use Markdown pipe tables."
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

## Renderer Constraints

The publisher renders a constrained Markdown subset only: `##`-`####` headings, paragraphs, unordered lists, numbered lists, links, inline code, bold text, blockquotes, horizontal rules, and images.

- Do not use top-level `#` headings. The `title` field supplies the page `<h1>`.
- Do not repeat the newsletter title inside `report_markdown`.
- Do not include a `## TL;DR` heading in `executive_summary`; the page template supplies it.
- Do not include a `## Editor's Notes` heading in `source_notes`; the page template supplies it.
- Do not use Markdown pipe tables, single-asterisk italics, or raw HTML. These will not publish as intended.
- For comparisons, counts, source notes, and quick hits, use bullets or numbered lists with labeled fields instead.

## Safe Output Contract

Call `publish_yesterday_in_ai` with:

- `title`: short title, normally `Yesterday in Enterprise AI - YYYY-MM-DD` using the Pacific Time date.
- `executive_summary`: the TL;DR content in Markdown, without a TL;DR heading.
- `report_markdown`: the full newsletter body in Markdown, starting with a `##` section heading such as `## Big Moves`; do not start with `#`.
- `source_notes`: the Editor's Notes content in Markdown bullet-list form, including feed counts and assumptions, without an Editor's Notes heading.

Use Markdown links for source URLs. Use HTTPS source URLs only. Do not emit raw HTML.

If no qualifying 24-36 hour feed items are available, still publish a short newsletter that says so plainly and explains what data was checked.
