# PRD: Browser‑Based SLOCCount (WebAssembly) Code Line & Cost Analyzer

## Document metadata

* **Product name:** SLOCCount Web Analyzer
* **One‑liner:** Analyze source code to count physical Source Lines of Code (SLOC) and generate rough cost/effort estimates—entirely in the browser—using the original SLOCCount Perl + C counters compiled to WebAssembly. ([Simon Willison Tools][1])
* **Status:** Draft
* **Primary users:** Developers, engineering managers, technical program managers, open-source maintainers
* **Platforms:** Desktop + mobile web (responsive)

---

## Background & context

SLOCCount is a long‑standing tool by David A. Wheeler that counts **physical SLOC** across many languages and can estimate effort/time/cost using the **Basic COCOMO** model. ([David A. Wheeler][2])

The reference implementation we’re matching is a web UI that:

* Runs SLOCCount algorithms in the browser via **WebAssembly** (Perl + C tools). ([Simon Willison Tools][1])
* Supports analyzing code via **Paste Code**, **GitHub Repository**, or **Upload ZIP** inputs. ([Simon Willison Tools][1])
* Displays totals (lines/languages/files) plus **COCOMO-based** effort + cost estimates with prominent warnings about roughness. ([Simon Willison Tools][1])
* Uses SLOCCount scripts from the `licquia/sloccount` repository (GPL). ([Simon Willison Tools][1])

---

## Problem statement

People often want a quick “how big is this codebase?” and “roughly what would it cost to build?” signal without installing tooling locally, uploading proprietary code to a server, or setting up CI.

Existing CLI tools are great but require local setup; web-based counters often reimplement logic and may differ from the canonical SLOCCount outputs.

---

## Goals

1. **Accurate SLOC counting using the real SLOCCount algorithms**, not a reimplementation. ([GitHub][3])
2. **Run entirely client-side** for privacy-preserving analysis (no server ingestion of code). ([GitHub][3])
3. Support three input modes:

   * Paste code
   * Load from a public GitHub repository
   * Upload a ZIP of source code ([Simon Willison Tools][1])
4. Provide clear, readable outputs:

   * Totals: lines, languages, files
   * Language breakdown table
   * Effort + cost estimates (with warnings) ([Simon Willison Tools][1])
5. Provide **editable cost model parameters** (salary/overhead/etc.) and preset options consistent with the tool behavior. ([Simon Willison Tools][1])

---

## Non-goals

* Supporting private GitHub repos requiring OAuth (v1).
* Producing “logical SLOC” or advanced metrics (cyclomatic complexity, duplication, etc.).
* Guaranteeing correctness of cost estimates beyond Basic COCOMO’s rough model (we explicitly warn users). ([Simon Willison Tools][1])
* Server-side storage, accounts, or history.

---

## Target personas

1. **Developer (Individual Contributor):** wants quick SLOC breakdown to understand a repo or validate scope.
2. **Engineering Manager/TPM:** wants rough cost/effort ballpark for planning conversations (with caveats).
3. **Open-source Maintainer:** wants quick stats to share publicly without requiring contributors to install tools.

---

## User journeys

### Journey A: Paste a file and analyze

1. User opens tool.
2. Selects **Paste Code** tab.
3. Pastes code into textarea and provides filename for language detection. ([Simon Willison Tools][1])
4. Clicks **Analyze**.
5. Sees totals + language breakdown + estimates. ([Simon Willison Tools][1])

### Journey B: Analyze a public GitHub repo

1. User selects **GitHub Repository** tab.
2. Enters `owner/repo` or full URL.
3. Tool fetches repository contents and analyzes in browser.
4. Tool displays results; user optionally tweaks cost assumptions. ([Simon Willison Tools][1])

### Journey C: Analyze a ZIP file

1. User selects **Upload ZIP** tab.
2. Uploads a `.zip` containing source.
3. Tool extracts code files and analyzes.
4. Tool displays results and allows cost assumption tuning. ([Simon Willison Tools][1])

---

## Functional requirements

### FR1 — Core UI shell

**Description:** Provide a simple mobile-friendly single-page UI with:

* Title and short description.
* Tabbed navigation: **Paste Code**, **GitHub Repository**, **Upload ZIP**. ([Simon Willison Tools][1])
* Status/progress area for messages.
* Results area hidden until analysis completes.

**Acceptance criteria**

* Tabs switch content panels without page reload.
* UI remains usable on mobile widths (responsive layout).
* Status messages can show info/success/error states.

---

### FR2 — Paste Code input mode

**Description:** Allow analyzing code pasted into a textarea, with a required filename field used to infer language. ([Simon Willison Tools][1])

**Acceptance criteria**

* If code is empty → show an error message and do not run analysis.
* If filename is empty → show an error message and do not run analysis.
* On success, results render in the standard results section.

---

### FR3 — GitHub Repository input mode (public repos)

**Description:** Analyze a public GitHub repository by:

* Accepting either `owner/repo` shorthand or a full `https://github.com/owner/repo` URL. (Behavior should match the reference.)
* Fetching file lists and downloading relevant code files.
* Handling API limitations gracefully (rate limit, truncation, missing repos).

**Acceptance criteria**

* If input is missing → show error.
* If repo not found → show error.
* If GitHub API rate-limited → show error with suggestion to retry later.
* If repository is too large for GitHub tree listing (truncation), instruct user to use the ZIP flow.
* Download files in batches with progress updates.
* Successful analysis renders results identically to other modes. ([Simon Willison Tools][1])

---

### FR4 — ZIP upload mode

**Description:** Allow uploading a ZIP file and analyzing source code within it. ([Simon Willison Tools][1])

**Acceptance criteria**

* Only accept `.zip`; non-zip triggers an error.
* If ZIP contains no recognized code files → show error.
* Extraction progress is visible (at least a status line).
* Successful analysis renders results identically to other modes.

---

### FR5 — Language/file selection rules

**Description:** Only analyze files matching a curated extension allowlist (covering major languages and matching SLOCCount’s intended usage). SLOCCount itself supports automatic identification and many languages. ([David A. Wheeler][2])

**Acceptance criteria**

* A centralized allowlist exists (shared between GitHub + ZIP modes).
* Tool ignores obvious non-code/binary artifacts (by extension allowlist and safe text decoding behavior).

---

### FR6 — Analysis engine (WebAssembly SLOCCount)

**Description:** Execute the real SLOCCount counting algorithms in browser:

* Use WebAssembly to run **Perl** plus the SLOCCount Perl scripts, and **C-based counters** compiled to WebAssembly. ([GitHub][3])
* Produce per-language totals: SLOC + file count.
* Return structured results to the UI.

**Acceptance criteria**

* No server-side execution is required for analysis.
* Analysis works offline for Paste + ZIP modes after assets are loaded.
* Results include language name, lines, and file counts.

**Notes**

* Must use the actual SLOCCount algorithm sources from `licquia/sloccount` (or compatible upstream), not a from-scratch reimplementation. ([GitHub][4])

---

### FR7 — Results display

**Description:** Display:

* **Total Lines**
* **Languages**
* **Files**
* **Est. Cost (USD)**
* **Est. Person-Years** ([Simon Willison Tools][1])

Also display a **Language Breakdown** table showing:

* Language
* Lines
* Percentage of total
* Files ([Simon Willison Tools][1])

**Acceptance criteria**

* Results section is hidden until analysis succeeds.
* Table sorts languages by descending lines.
* Percentages are computed from total SLOC.

---

### FR8 — Cost/effort estimation (Basic COCOMO) + warnings

**Description:** Provide effort + cost estimates using **Basic COCOMO** with clear warnings that estimates are rough. ([Simon Willison Tools][1])

Model details (as implemented in SLOCCount):

* Effort parameters correspond to Basic COCOMO (effort factor/exponent).
* Schedule estimate uses Basic COCOMO schedule factor/exponent.
* Defaults include salary `$56,286` and overhead `2.4` in SLOCCount’s original assumptions. ([Debian Sources][5])

**Acceptance criteria**

* UI includes an “About Cost Estimates” section that:

  * Names Basic COCOMO and attributes to Barry Boehm. ([Simon Willison Tools][1])
  * Shows an explicit warning about roughness. ([Simon Willison Tools][1])
  * Offers editable inputs for key assumptions (salary, overhead, etc.). ([Simon Willison Tools][1])
* Changing assumptions triggers recalculation without re-downloading the code (when feasible).

---

## Non-functional requirements

### NFR1 — Privacy & data handling

* Analysis runs in the browser; do not upload user code to a third-party backend for processing. ([GitHub][3])
* For GitHub mode, code is necessarily fetched from GitHub; do not transmit code anywhere else.

### NFR2 — Performance & scalability

* Tool should remain responsive during analysis with progress updates.
* Batching/concurrency limits for GitHub downloads to avoid UI lockups and network saturation.
* ZIP extraction should handle moderately large archives (tens of MB) on modern devices.

### NFR3 — Reliability

* Clear error states for:

  * Missing inputs
  * No code files found
  * GitHub repo not found / rate-limited
  * ZIP errors
* Partial failures (some files can’t be fetched) should not always fail the entire run; warn and continue where possible.

### NFR4 — Accessibility

* Keyboard navigable tabs and buttons.
* Proper labeling for inputs.
* Sufficient color contrast for status indicators.

---

## Dependencies & constraints

### Third-party / upstream components

* **SLOCCount algorithms:** from `licquia/sloccount` (GPL-2.0) ([GitHub][4])
* **SLOCCount concept & behavior:** described on David A. Wheeler’s site. ([David A. Wheeler][2])
* **WebAssembly Perl runtime (WebPerl):** referenced as a key enabler for running Perl in the browser. ([Simon Willison’s Weblog][6])

### Licensing requirement

Because SLOCCount sources are GPL‑licensed (GPL‑2.0 in `licquia/sloccount`), distribution of those scripts/counters in your web tool likely triggers GPL obligations. Plan a license review and ensure your project license and distribution approach are compliant. ([GitHub][4])

---

## Success metrics

* **Time-to-first-result:** Median analysis completes within:

  * Paste mode: < 2 seconds for small snippets
  * Repo mode: < 60 seconds for typical repos (< 200 files)
  * ZIP mode: < 60 seconds for typical repos zipped
* **Completion rate:** > 90% of analyses that start successfully render results (excluding GitHub API failures/rate limits).
* **User comprehension:** Users acknowledge warnings (e.g., via UI prominence) and don’t interpret cost estimates as authoritative.

---

## QA / test plan

1. **Unit tests**

   * Extension allowlist logic
   * Cost model math (COCOMO calculations)
2. **Integration tests**

   * Paste mode: known snippet + filename yields non-zero count
   * ZIP mode: sample zip yields expected languages and totals
   * GitHub mode: analyze a known small public repo and validate results render
3. **Regression tests**

   * Ensure “About Cost Estimates” warnings always visible and not accidentally removed.

---

## Risks & mitigations

* **GitHub API rate limits / CORS:** GitHub mode may fail often for heavy usage.

  * Mitigation: clear error message; recommend ZIP for large repos; keep batch sizes small.
* **Large repo memory constraints in browser:**

  * Mitigation: cap max files by default; warn; encourage ZIP or local approach.
* **License compliance risk (GPL):**

  * Mitigation: explicit compliance plan and repository licensing alignment. ([GitHub][4])
* **Users over-trust cost estimates:**

  * Mitigation: prominent warnings and “rough estimate” language, matching reference. ([Simon Willison Tools][1])

---

## Milestones (suggested)

1. **MVP UI + Paste mode + results UI**
2. **WASM SLOCCount engine integration**
3. **ZIP mode**
4. **GitHub repo mode**
5. **Cost estimates section + editable parameters**
6. **Accessibility + mobile polish**
7. **Automated tests + release**

---

## Appendix: Copilot-ready build brief (paste into Copilot as the “job”)

Build a responsive single-page web app named “SLOCCount Web Analyzer” that:

* Provides three tabs: Paste Code, GitHub Repository (public), Upload ZIP
* Runs real SLOCCount counting logic in the browser using WebAssembly (Perl scripts + C counters)
* Displays totals (lines/languages/files) + a per-language breakdown table + Basic COCOMO-based person-years and cost estimates
* Includes a prominent “About Cost Estimates” warning section with editable assumptions (salary, overhead, effort coefficient)
* Has clear error handling and progress/status messaging
* Does not send user code to any server for processing (client-side only), except fetching from GitHub when using repo mode
* Includes an automated test suite covering at least one successful analysis flow per mode

[1]: https://tools.simonwillison.net/sloccount "SLOCCount - Count Lines of Code"
[2]: https://dwheeler.com/sloccount/ "SLOCCount"
[3]: https://raw.githubusercontent.com/simonw/tools/main/sloccount.docs.md "raw.githubusercontent.com"
[4]: https://github.com/licquia/sloccount "GitHub - licquia/sloccount: Personal changes to David Wheeler's sloccount, as forked from SourceForge."
[5]: https://sources.debian.org/src/sloccount/2.26-4/get_sloc "File: get_sloc
\| Debian Sources
"
[6]: https://simonwillison.net/2025/Oct/22/sloccount-in-webassembly/ "SLOCCount in WebAssembly"
