#!/usr/bin/env python3
"""Tests for the gh-aw daily report renderer."""
import json
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).parents[2]
SCRIPT = ROOT / "_code" / "publish_daily_report_from_aw.py"


def run_renderer(agent_output, output_path, *extra_args):
    return subprocess.run(
        [
            "python3",
            str(SCRIPT),
            "--agent-output",
            str(agent_output),
            "--output",
            str(output_path),
            *extra_args,
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )


def test_renders_safe_daily_report():
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = pathlib.Path(tmp)
        agent_output = tmp_path / "agent_output.json"
        rendered = tmp_path / "index.html"

        agent_output.write_text(
            json.dumps(
                {
                    "items": [
                        {
                            "type": "publish_daily_report",
                            "title": "Daily Report",
                            "executive_summary": "Bottom line up front.",
                            "report_markdown": "## Highlights\n- **High signal** update\n- <script>alert(1)</script>",
                            "source_notes": "- [Workflow](https://github.com/TedTschopp/tedt.org/actions)",
                        }
                    ]
                }
            ),
            encoding="utf-8",
        )

        result = run_renderer(agent_output, rendered)
        assert result.returncode == 0, result.stderr

        html = rendered.read_text(encoding="utf-8")
        assert "<strong>High signal</strong>" in html
        assert "&lt;script&gt;alert(1)&lt;/script&gt;" in html
        assert "<script>alert(1)</script>" not in html
        assert "https://github.com/TedTschopp/tedt.org/actions" in html


def test_rejects_multiple_publish_items():
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = pathlib.Path(tmp)
        agent_output = tmp_path / "agent_output.json"
        rendered = tmp_path / "index.html"

        item = {
            "type": "publish_daily_report",
            "title": "Daily Report",
            "executive_summary": "Summary",
            "report_markdown": "Body",
            "source_notes": "Sources",
        }
        agent_output.write_text(json.dumps({"items": [item, item]}), encoding="utf-8")

        result = run_renderer(agent_output, rendered)
        assert result.returncode != 0
        assert "Expected exactly one publish_daily_report item" in result.stderr


def test_renders_custom_ai_report():
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = pathlib.Path(tmp)
        agent_output = tmp_path / "agent_output.json"
        rendered = tmp_path / "ai" / "index.html"

        agent_output.write_text(
            json.dumps(
                {
                    "items": [
                        {
                            "type": "publish_yesterday_in_ai",
                            "title": "Yesterday in Enterprise AI",
                            "executive_summary": "Leaders should review AI policy changes.",
                            "report_markdown": "## Big Moves\n![Board room](https://example.com/ai.png)\n- [Source](https://example.com/story)",
                            "source_notes": "- items_fetched_count: 3",
                        }
                    ]
                }
            ),
            encoding="utf-8",
        )

        result = run_renderer(
            agent_output,
            rendered,
            "--item-type",
            "publish_yesterday_in_ai",
            "--eyebrow",
            "Yesterday in Enterprise AI",
            "--summary-heading",
            "TL;DR",
            "--report-heading",
            "Newsletter",
            "--sources-heading",
            "Editor's Notes",
        )
        assert result.returncode == 0, result.stderr

        html = rendered.read_text(encoding="utf-8")
        assert "Yesterday in Enterprise AI" in html
        assert "TL;DR" in html
        assert "Newsletter" in html
        assert "Editor's Notes" in html
        assert '<img src="https://example.com/ai.png" alt="Board room" loading="lazy">' in html


def main():
    test_renders_safe_daily_report()
    test_rejects_multiple_publish_items()
    test_renders_custom_ai_report()
    print("Daily report renderer tests passed.")


if __name__ == "__main__":
    main()