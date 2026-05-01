#!/usr/bin/env python3
"""Tests for the gh-aw daily report renderer."""
import json
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).parents[2]
SCRIPT = ROOT / "_code" / "publish_daily_report_from_aw.py"


def run_renderer(agent_output, output_path):
    return subprocess.run(
        [
            "python3",
            str(SCRIPT),
            "--agent-output",
            str(agent_output),
            "--output",
            str(output_path),
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


def main():
    test_renders_safe_daily_report()
    test_rejects_multiple_publish_items()
    print("Daily report renderer tests passed.")


if __name__ == "__main__":
    main()