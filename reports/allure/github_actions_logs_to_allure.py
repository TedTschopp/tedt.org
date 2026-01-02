#!/usr/bin/env python3
"""Create an Allure result from GitHub Actions workflow logs.

Goal
- Treat workflow-level errors/warnings (as surfaced in logs) as an Allure test result.
- Write output directly into an Allure results directory (no external Allure Python deps).

What it captures
- Lines containing GitHub Actions log markers: `##[error]`, `##[warning]`, and workflow commands `::error`, `::warning`.

Typical usage (in GitHub Actions)
- Download the run logs zip via GitHub API
- Unzip into a directory
- Run this script and then generate the HTML report using `allure generate ...`

Example:
  python3 reports/allure/github_actions_logs_to_allure.py \
    --logs-dir tmp/gha-logs \
    --output-dir reports/allure/allure-results \
    --run-url "https://github.com/<owner>/<repo>/actions/runs/<id>"
"""

from __future__ import annotations

import argparse
import json
import re
import time
import uuid
from pathlib import Path
from typing import Iterable, List, Optional, Tuple


_ERROR_RE = re.compile(r"(?:##\[(error)\]|::(error))", re.IGNORECASE)
_WARNING_RE = re.compile(r"(?:##\[(warning)\]|::(warning))", re.IGNORECASE)


def _epoch_ms() -> int:
    return int(time.time() * 1000)


def _iter_log_files(logs_dir: Path) -> Iterable[Path]:
    # GitHub run logs zip typically expands into job-named directories with *.txt files.
    # We stay permissive here.
    for path in logs_dir.rglob("*.txt"):
        if path.is_file():
            yield path


def _scan_file(path: Path) -> Tuple[List[str], List[str]]:
    errors: List[str] = []
    warnings: List[str] = []
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return errors, warnings

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if _ERROR_RE.search(line):
            errors.append(line)
        elif _WARNING_RE.search(line):
            warnings.append(line)

    return errors, warnings


def _write_attachment(output_dir: Path, name: str, content: str) -> dict:
    attachment_name = f"github-actions-{uuid.uuid4()}-{name}"
    attachment_path = output_dir / attachment_name
    attachment_path.write_text(content, encoding="utf-8")
    return {
        "name": name,
        "source": attachment_name,
        "type": "text/plain",
    }


def write_allure_result(
    *,
    output_dir: Path,
    name: str,
    status: str,
    description_html: str,
    attachments: List[dict],
    run_url: Optional[str],
) -> Path:
    start = _epoch_ms()
    stop = start

    labels = [
        {"name": "suite", "value": "GitHub Actions"},
        {"name": "subSuite", "value": "Workflow Diagnostics"},
    ]

    links = []
    if run_url:
        links.append({"name": "workflow run", "url": run_url, "type": "custom"})

    result = {
        "uuid": str(uuid.uuid4()),
        "name": name,
        "status": status,
        "stage": "finished",
        "start": start,
        "stop": stop,
        "descriptionHtml": description_html,
        "labels": labels,
        "links": links,
        "attachments": attachments,
    }

    out_path = output_dir / f"{result['uuid']}-result.json"
    out_path.write_text(json.dumps(result, indent=2, sort_keys=False), encoding="utf-8")
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--logs-dir", required=True, help="Directory containing extracted workflow log .txt files")
    parser.add_argument("--output-dir", required=True, help="Allure results output directory")
    parser.add_argument("--run-url", default=None, help="Optional URL to the workflow run")
    parser.add_argument(
        "--max-lines",
        type=int,
        default=300,
        help="Maximum number of error/warning lines to include in attachments (per category)",
    )
    args = parser.parse_args()

    logs_dir = Path(args.logs_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    all_errors: List[str] = []
    all_warnings: List[str] = []

    # Keep file context for debugging while staying compact.
    for file_path in _iter_log_files(logs_dir):
        errors, warnings = _scan_file(file_path)
        if errors:
            all_errors.append(f"\n# {file_path.relative_to(logs_dir)}")
            all_errors.extend(errors)
        if warnings:
            all_warnings.append(f"\n# {file_path.relative_to(logs_dir)}")
            all_warnings.extend(warnings)

    errors_trimmed = all_errors[: args.max_lines]
    warnings_trimmed = all_warnings[: args.max_lines]

    status = "failed" if any(line and not line.startswith("# ") for line in errors_trimmed) else "passed"

    summary_lines = [
        f"Errors: {sum(1 for l in all_errors if l and not l.startswith('# '))}",
        f"Warnings: {sum(1 for l in all_warnings if l and not l.startswith('# '))}",
        f"Included in attachments (trimmed): errors={sum(1 for l in errors_trimmed if l and not l.startswith('# '))}, warnings={sum(1 for l in warnings_trimmed if l and not l.startswith('# '))}",
    ]

    description_html = "<h3>Workflow diagnostics from GitHub Actions logs</h3>" + "".join(
        f"<p>{line}</p>" for line in summary_lines
    )

    attachments: List[dict] = []
    attachments.append(_write_attachment(output_dir, "summary.txt", "\n".join(summary_lines) + "\n"))

    if errors_trimmed:
        attachments.append(_write_attachment(output_dir, "errors.txt", "\n".join(errors_trimmed) + "\n"))
    if warnings_trimmed:
        attachments.append(_write_attachment(output_dir, "warnings.txt", "\n".join(warnings_trimmed) + "\n"))

    write_allure_result(
        output_dir=output_dir,
        name="GitHub Actions workflow diagnostics",
        status=status,
        description_html=description_html,
        attachments=attachments,
        run_url=args.run_url,
    )

    # Also print a compact line for step logs.
    print("; ".join(summary_lines))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
