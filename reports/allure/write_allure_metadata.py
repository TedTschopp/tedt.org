#!/usr/bin/env python3
"""Write Allure run metadata into an allure-results directory.

Allure best practice:
- Include environment.properties (key/value) for runtime context.
- Include executor.json for CI/build context.

These files should be placed in the *results* directory before `allure generate`.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path


def _write_environment_properties(out_dir: Path) -> None:
    lines = []

    def add(key: str, value: str | None) -> None:
        if value is None or value == "":
            return
        # Allure expects simple key=value lines.
        safe = str(value).replace("\n", " ").strip()
        lines.append(f"{key}={safe}")

    add("ci", os.getenv("CI"))
    add("repo", os.getenv("GITHUB_REPOSITORY"))
    add("ref", os.getenv("GITHUB_REF"))
    add("sha", os.getenv("GITHUB_SHA"))
    add("run_id", os.getenv("GITHUB_RUN_ID"))
    add("run_number", os.getenv("GITHUB_RUN_NUMBER"))
    add("actor", os.getenv("GITHUB_ACTOR"))
    add("workflow", os.getenv("GITHUB_WORKFLOW"))
    add("job", os.getenv("GITHUB_JOB"))

    # Optional: record a base URL if the runner sets one.
    add("base_url", os.getenv("PLAYWRIGHT_BASE_URL"))

    (out_dir / "environment.properties").write_text("\n".join(lines) + "\n", encoding="utf-8")


def _write_executor_json(out_dir: Path, run_url: str | None) -> None:
    repo = os.getenv("GITHUB_REPOSITORY")
    run_id = os.getenv("GITHUB_RUN_ID")

    executor = {
        "name": "GitHub Actions",
        "type": "github",
        "buildName": os.getenv("GITHUB_WORKFLOW") or "workflow",
        "buildOrder": os.getenv("GITHUB_RUN_NUMBER"),
        "buildUrl": run_url
        or (
            f"{os.getenv('GITHUB_SERVER_URL','https://github.com')}/{repo}/actions/runs/{run_id}"
            if repo and run_id
            else None
        ),
        "reportUrl": None,
    }

    (out_dir / "executor.json").write_text(
        json.dumps(executor, indent=2, sort_keys=False) + "\n", encoding="utf-8"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Allure results directory (e.g., reports/allure/allure-results)",
    )
    parser.add_argument(
        "--run-url",
        default=None,
        help="Optional workflow run URL (overrides computed buildUrl)",
    )
    args = parser.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    _write_environment_properties(out_dir)
    _write_executor_json(out_dir, args.run_url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
