# Repository Structure Standard

This repository is a Jekyll site with supporting automation, public tools,
draft material, and historical assets. Keep those concerns separated so build
behavior, publishing behavior, and local working state remain easy to reason
about.

## Path Ownership

- `_posts/`: published or publishable dated content.
  Commit source Markdown only. Slide decks remain under `_posts/Slides/`.
- `_layouts/`, `_includes/`, `_sass/`, `_plugins/`: Jekyll rendering system.
  Commit source templates, partials, styles, and plugins.
- `_data/`: structured data required by the site build.
  Commit only data used by current build paths.
- `_code/`: repo automation and content maintenance scripts.
  Commit reusable scripts and keep paths repo-relative.
- `scripts/`: Node or CI helpers outside Jekyll-specific automation.
  Commit maintained helpers used by `package.json`, CI, or docs.
- `tests/`: Ruby, Python, and Playwright checks.
  Commit executable quality gates and fixtures.
- `docs/`: architecture, operating model, and maintenance documentation.
  Commit durable guidance, ADRs, and baselines that explain decisions.
- `css/`, `js/`, `img/`, `fonts/`, `media/`: public static assets.
  Commit deployable web assets only.
- `tools/`: public browser tools and self-contained tool applications.
  Commit only tools intended to be published or maintained.
- `_work-in-progress/`: drafts and unpublished writing.
  Commit selectively and avoid generated scratch files.
- `_data-to-be-developed/`: developmental data not loaded by Jekyll.
  Treat as quarantine; do not add new build dependencies here.
- `reports/`: committed report tooling and explicit baselines.
  Commit baselines and report generators; ignore generated run output.
- `cache/`: operational caches used by publishing workflows.
  Commit only caches that are intentional workflow inputs.
- `tmp/`, `Logs/`, `_site/`, `node_modules/`, `vendor/bundle/`: generated
  or dependency output. Do not commit.

## Working Rules

- New repo automation belongs in `_code/` or `scripts/`, not at the
  repository root.
- New backup, shadow, or editor-copy files should not be committed. Use Git
  history for rollback.
- Large source masters such as PSD files should not be added unless there is a
  documented reason and an explicit repo guard allowlist entry.
- Jekyll-visible data belongs in `_data/`; exploratory datasets belong outside
  the build path until promoted.
- Public static assets should be optimized for web delivery. Keep source
  masters separate from deployable files.
- If a generated file must be committed, document the producer, consumer, and
  refresh command in the nearest README or maintenance doc.

## Enforcement

The `repo_guard` target enforces the highest-risk structure rules:

```bash
make repo_guard
```

Current checks include oversized tracked files, blocked binary/source-master
extensions, blocked dependency paths, backup/shadow file patterns, and top-level
utility scripts. Historical exceptions live in `.ci/allowed-large-files.txt`;
keep that allowlist narrow and remove entries when legacy files are deleted or
moved.
