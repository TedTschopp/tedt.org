#!/usr/bin/env python3
"""Write a simple Allure result JSON with attachments.

This is a lightweight helper to record non-test tooling (linters, link checkers, builds)
into Allure without requiring any Allure Python packages.

Allure statuses: passed, failed, broken, skipped, unknown
"""

from __future__ import annotations

import argparse
import json
import time
import uuid
from pathlib import Path
from typing import List, Optional


def _epoch_ms() -> int:
    return int(time.time() * 1000)


def _write_attachment(out_dir: Path, src_path: Path, display_name: str, mime: str) -> dict:
    attachment_name = f"attachment-{uuid.uuid4()}-{src_path.name}"
    dest = out_dir / attachment_name
    dest.write_bytes(src_path.read_bytes())
    return {"name": display_name, "source": attachment_name, "type": mime}


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--output-dir", required=True)
    p.add_argument("--name", required=True)
    p.add_argument("--status", required=True, choices=["passed", "failed", "broken", "skipped", "unknown"])
    p.add_argument("--suite", default="Quality")
    p.add_argument("--sub-suite", default=None)
    p.add_argument("--description", default=None)
    p.add_argument("--run-url", default=None)
    p.add_argument(
        "--attach",
        action="append",
        default=[],
        help="Attachment spec: <display_name>=<path> (can be repeated)",
    )
    args = p.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    start = _epoch_ms()
    stop = start

    labels = [{"name": "suite", "value": args.suite}]
    if args.sub_suite:
        labels.append({"name": "subSuite", "value": args.sub_suite})

    links = []
    if args.run_url:
        links.append({"name": "workflow run", "url": args.run_url, "type": "custom"})

    attachments: List[dict] = []
    for spec in args.attach:
        if "=" not in spec:
            continue
        display, path_str = spec.split("=", 1)
        src = Path(path_str)
        if not src.exists() or not src.is_file():
            continue
        mime = "text/plain"
        if src.suffix.lower() in {".json"}:
            mime = "application/json"
        elif src.suffix.lower() in {".html", ".htm"}:
            mime = "text/html"
        attachments.append(_write_attachment(out_dir, src, display, mime))

    result = {
        "uuid": str(uuid.uuid4()),
        "name": args.name,
        "status": args.status,
        "stage": "finished",
        "start": start,
        "stop": stop,
        "labels": labels,
        "links": links,
        "attachments": attachments,
    }

    if args.description:
        # Prefer HTML if you pass HTML; otherwise it will just render as text.
        result["descriptionHtml"] = args.description

    out_path = out_dir / f"{result['uuid']}-result.json"
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(str(out_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
