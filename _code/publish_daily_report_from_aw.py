#!/usr/bin/env python3
"""Render the gh-aw daily report safe output into Daily-Report/index.html.

Usage:
  python3 _code/publish_daily_report_from_aw.py \
    --agent-output "$GH_AW_AGENT_OUTPUT" \
    --output Daily-Report/index.html

The agentic workflow supplies a single publish_daily_report item. This script
validates that item, escapes model-controlled content, renders a small Markdown
subset, and writes a static HTML page for GitHub Pages/Jekyll to copy through.
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ITEM_TYPE = "publish_daily_report"
MAX_FIELD_CHARS = 120_000

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
ORDERED_ITEM_RE = re.compile(r"^\d+[.)]\s+(.*)$")
UNORDERED_ITEM_RE = re.compile(r"^[-*]\s+(.*)$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render gh-aw daily report output.")
    parser.add_argument(
        "--agent-output",
        default=os.environ.get("GH_AW_AGENT_OUTPUT"),
        help="Path to the gh-aw agent_output.json file.",
    )
    parser.add_argument(
        "--output",
        default="Daily-Report/index.html",
        help="Destination HTML file.",
    )
    return parser.parse_args()


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def require_text(item: dict[str, Any], key: str) -> str:
    value = item.get(key)
    if not isinstance(value, str) or not value.strip():
        fail(f"Missing required text field: {key}")
    if len(value) > MAX_FIELD_CHARS:
        fail(f"Field is too large: {key}")
    return value.strip()


def load_report_item(agent_output_path: Path) -> dict[str, Any]:
    if not agent_output_path.is_file():
        fail(f"Agent output file not found: {agent_output_path}")

    try:
        payload = json.loads(agent_output_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        fail(f"Agent output is not valid JSON: {error}")

    items = payload.get("items")
    if not isinstance(items, list):
        fail("Agent output JSON must contain an items array")

    report_items = [item for item in items if isinstance(item, dict) and item.get("type") == ITEM_TYPE]
    if len(report_items) != 1:
        fail(f"Expected exactly one {ITEM_TYPE} item, found {len(report_items)}")

    return report_items[0]


def is_allowed_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme == "https" and parsed.netloc:
        return True
    if url.startswith("/") and not url.startswith("//"):
        return True
    if url.startswith("#"):
        return True
    return False


def format_text_segment(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    return escaped


def render_inline(text: str) -> str:
    rendered: list[str] = []
    position = 0
    for match in LINK_RE.finditer(text):
        rendered.append(format_text_segment(text[position : match.start()]))
        label = format_text_segment(match.group(1))
        url = match.group(2).strip()
        if is_allowed_url(url):
            rendered.append(f'<a href="{html.escape(url, quote=True)}">{label}</a>')
        else:
            rendered.append(label)
        position = match.end()
    rendered.append(format_text_segment(text[position:]))
    return "".join(rendered)


def render_markdown(markdown: str) -> str:
    parts: list[str] = []
    paragraph: list[str] = []
    active_list: str | None = None

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            parts.append(f"<p>{render_inline(' '.join(paragraph))}</p>")
            paragraph = []

    def close_list() -> None:
        nonlocal active_list
        if active_list:
            parts.append(f"</{active_list}>")
            active_list = None

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            close_list()
            continue

        if stripped == "---":
            flush_paragraph()
            close_list()
            parts.append("<hr>")
            continue

        heading_match = re.match(r"^(#{2,4})\s+(.+)$", stripped)
        if heading_match:
            flush_paragraph()
            close_list()
            level = len(heading_match.group(1))
            parts.append(f"<h{level}>{render_inline(heading_match.group(2))}</h{level}>")
            continue

        unordered_match = UNORDERED_ITEM_RE.match(stripped)
        if unordered_match:
            flush_paragraph()
            if active_list != "ul":
                close_list()
                parts.append("<ul>")
                active_list = "ul"
            parts.append(f"<li>{render_inline(unordered_match.group(1))}</li>")
            continue

        ordered_match = ORDERED_ITEM_RE.match(stripped)
        if ordered_match:
            flush_paragraph()
            if active_list != "ol":
                close_list()
                parts.append("<ol>")
                active_list = "ol"
            parts.append(f"<li>{render_inline(ordered_match.group(1))}</li>")
            continue

        if stripped.startswith("> "):
            flush_paragraph()
            close_list()
            parts.append(f"<blockquote>{render_inline(stripped[2:])}</blockquote>")
            continue

        close_list()
        paragraph.append(stripped)

    flush_paragraph()
    close_list()
    return "\n".join(parts)


def build_html(item: dict[str, Any]) -> str:
    title = require_text(item, "title")
    executive_summary = require_text(item, "executive_summary")
    report_markdown = require_text(item, "report_markdown")
    source_notes = require_text(item, "source_notes")
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    generated_label = generated_at.replace("+00:00", "Z")

    page_title = html.escape(title, quote=False)
    summary_html = render_markdown(executive_summary)
    report_html = render_markdown(report_markdown)
    sources_html = render_markdown(source_notes)

    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{page_title} | TedT.org</title>
  <meta name="robots" content="noindex, follow">
  <style>
    :root {{
      color-scheme: light dark;
      --bg: #f6f4ef;
      --fg: #20242a;
      --muted: #5f6670;
      --line: #d8d2c7;
      --panel: #ffffff;
      --accent: #1f6feb;
    }}
    @media (prefers-color-scheme: dark) {{
      :root {{
        --bg: #111418;
        --fg: #eef1f5;
        --muted: #aab2bd;
        --line: #30363d;
        --panel: #171b21;
        --accent: #79c0ff;
      }}
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--fg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }}
    main {{ max-width: 960px; margin: 0 auto; padding: 48px 20px 64px; }}
    header {{ border-bottom: 1px solid var(--line); margin-bottom: 32px; padding-bottom: 24px; }}
    .eyebrow {{ color: var(--muted); font-size: 0.9rem; letter-spacing: 0; text-transform: uppercase; }}
    h1 {{ font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin: 8px 0 12px; }}
    h2 {{ border-top: 1px solid var(--line); margin-top: 36px; padding-top: 24px; }}
    h3, h4 {{ margin-top: 28px; }}
    a {{ color: var(--accent); }}
    .summary, .sources {{ background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 20px; }}
    .meta {{ color: var(--muted); font-size: 0.95rem; }}
    code {{ background: color-mix(in srgb, var(--muted) 16%, transparent); border-radius: 4px; padding: 0.1em 0.3em; }}
    blockquote {{ border-left: 4px solid var(--line); margin-left: 0; padding-left: 16px; color: var(--muted); }}
    footer {{ border-top: 1px solid var(--line); color: var(--muted); margin-top: 40px; padding-top: 20px; }}
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">Daily Report</div>
      <h1>{page_title}</h1>
      <p class="meta">Generated <time datetime="{generated_at}">{generated_label}</time> by GitHub Agentic Workflows.</p>
    </header>
    <section class="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Bottom Line Up Front</h2>
      {summary_html}
    </section>
    <article aria-labelledby="report-heading">
      <h2 id="report-heading">Report</h2>
      {report_html}
    </article>
    <section class="sources" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources And Notes</h2>
      {sources_html}
    </section>
    <footer>
      <p>This page is generated from a constrained gh-aw safe output. The agent proposes report content; a deterministic renderer writes the HTML.</p>
      <p><a href="/">Return to TedT.org</a></p>
    </footer>
  </main>
</body>
</html>
"""

    lowered = document.lower()
    blocked_tokens = ["<script", "</script", "javascript:", " onerror=", " onload="]
    if any(token in lowered for token in blocked_tokens):
        fail("Rendered report contains blocked active-content patterns")

    return document


def main() -> None:
    args = parse_args()
    if not args.agent_output:
        fail("--agent-output is required or GH_AW_AGENT_OUTPUT must be set")

    agent_output_path = Path(args.agent_output)
    output_path = Path(args.output)
    report_item = load_report_item(agent_output_path)
    rendered = build_html(report_item)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()