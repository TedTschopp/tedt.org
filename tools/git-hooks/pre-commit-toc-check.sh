#!/usr/bin/env bash
# Pre-commit hook: verify README TOC consistency.
# Fails commit if TOC drift detected; allows override with SKIP_TOC=1.
set -euo pipefail

if [[ "${SKIP_TOC:-}" == "1" ]]; then
  echo "[toc-check] Skipped via SKIP_TOC=1"
  exit 0
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "[toc-check] python3 not found; skipping (install python3 to enable)." >&2
  exit 0
fi

python3 _code/update_readme_toc.py --check || {
  echo "[toc-check] README TOC drift detected. Run: make docs-toc" >&2
  exit 1
}

echo "[toc-check] README TOC OK"
