# Project Context

- **Owner:** Ted Tschopp
- **Project:** tedt.org
- **Description:** Personal blog and website built with Jekyll and GitHub Pages, with posts, slides, feeds, category taxonomy, and automation workflows.
- **Stack:** Jekyll 4.3.x, GitHub Pages, Ruby, Liquid, Bootstrap 5, SCSS, Python utilities, GitHub Actions
- **Created:** 2026-05-28T15:42:49.085-07:00

## Learnings

- 2026-05-28T15:42:49.085-07:00 — Team hired. I own docs, prose, descriptions, SEO copy, and readability polish.
- 2026-05-28T16:22:10.035-07:00 — Uplifted GitHub issue templates. Replaced 2 generic templates with 5 purpose-specific forms (Bug Report, UX Enhancement, Content Task, Architecture Task, Infrastructure Task) plus config.yml. All validated with Ruby YAML parser. Decision recorded in `.squad/decisions/inbox/bilbo-issue-templates.md`.
- 2026-05-28T17:31:39.169-07:00 — Created comprehensive roster export (squad-roster-export.yaml). Extracted all 13 team members (11 active agents + Scribe + Ralph) with domains, routing, and charter references. Source: team.md, routing.md, registry.json, member charters. Portable YAML format for reuse. File path: `.copilot/session-state/.../files/squad-roster-export.yaml`.

---

## 2026-05-28T17:31:39Z – Squad Roster Export Completed

**Role:** Editorial Writer  
**Mode:** Sync  
**Task:** Create a portable single-file squad roster export  

### Deliverable
- **File:** squad-roster-export.yaml (9.6 KB)
- **Location:** `/Users/tedtschopp/.copilot/session-state/5e7192b1-a46b-4398-9a32-3fd93e7a9e24/files/squad-roster-export.yaml`
- **Format:** YAML

### Contents
All 13 team members with:
- Name, emoji, role, status badge
- Charter path, primary domains, routing notes
- Project metadata and work routing table
- Orchestration principles

### Key Decisions
- YAML chosen for readability, portability, and machine reusability
- No invented data; missing fields left unspecified
- Structured for reuse in external systems and automation
- Emojis assigned per role/domain
- Status badges preserve team.md notation

### Next Steps
Export is stable and reusable. Can be imported into external documentation or parsed by automation scripts. Update process follows same structure and discipline.

**Status:** ✅ Complete
