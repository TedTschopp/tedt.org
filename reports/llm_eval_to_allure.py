#!/usr/bin/env python3
"""
llm_eval_to_allure.py

Create an Allure *test result file* (and attachments) from an LLM evaluation output
that follows the "I) ... VII)" structure in your prompt.

Why this is useful:
- It lets you treat an LLM quality evaluation as a test case in Allure.
- You can publish LLM evaluation outcomes in CI like any other test run.

This script does NOT require the `allure` Python package.
It writes the JSON and attachment files directly to `allure-results/`.

Typical usage:
  python llm_eval_to_allure.py --input eval_output.md --output-dir allure-results \
      --test-name "RAG Answer Quality - Ticket 123"

Then:
  allure generate allure-results --clean -o allure-report
  allure open allure-report
"""

from __future__ import annotations

import argparse
import datetime as _dt
import hashlib
import html
import json
import os
import platform
import re
import threading
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional


# =============================================================================
# DOCUMENT QUALITY EVALUATION PROMPT
# =============================================================================
#
# ## ROLE INSTRUCTION
# You are an impartial evaluator of LLM outputs. Assess the quality,
# groundedness, correctness, and usefulness of the provided output for the
# stated task and audience. Classify business impact risk using the risk
# rubric below.
#
# Be direct and critical. Do not use polite language. Evidence must be cited
# from both the output and the source (if provided); do not speculate.
#
# If necessary evaluation information is missing, identify what is missing
# and proceed with conservative assumptions.
#
# =============================================================================
# EVALUATION INPUTS
# =============================================================================
#
# Task type: [summarization | RAG/QA | translation | rewrite | classification | code | other]
# User request/instructions: [user prompt or requirements]
# Intended audience: [e.g., executives, engineers, customers]
# Intended purpose/success criteria: [what success looks like]
# Constraints: [length, format, tone, citations, reading level, must-include/must-avoid]
# Allowed knowledge: [Source-only | Source + general knowledge | Tool-verified only]
# Deployment context: [internal draft | external publish | operational use | customer-facing | regulatory filing | etc.]
#
# Risk Impact Rating:
#   - Provided by requester: [Very Low | Low | Moderate | High | Very High | Unknown]
#   - If Unknown: assign a rating using the Risk Impact Rubric.
#
# Source material (optional, recommended for grounded tasks): [PASTE SOURCE or "NONE"]
#
# Model output to evaluate: [PASTE OUTPUT]
#
# =============================================================================
# RISK IMPACT RUBRIC (use exactly as provided)
# =============================================================================
#
# You are rating IMPACT SEVERITY if the output is wrong, misleading, or acted
# upon. If uncertain, select the higher impact.
#
# Output:
#   - Qualitative: Very Low / Low / Moderate / High / Very High
#   - Quantitative: 0 / 2 / 5 / 8 / 10
#   - Impact score band (0-100): 0-4 / 5-20 / 21-79 / 80-95 / 96-100
#   - Drivers: Operational, Safety, Regulatory, Reputational, Financial, Stock, Legal
#
# -----------------------------------------------------------------------------
# A) VERY HIGH (Quant=10; Score 96-100)
# -----------------------------------------------------------------------------
#   - Multiple severe/catastrophic effects: operations/assets/individuals/
#     organizations/the Nation.
#   - Operational: >50% customers >24h; business inoperable weeks.
#   - Safety: critical injuries/death; severe injuries.
#   - Regulatory: major, multi-regulation incidents.
#   - Reputational: major negative national attention.
#   - Financial: fines > $14M.
#   - Stock: EIX loss > 20%.
#   - Legal: major class action/State/Federal suits.
#
# -----------------------------------------------------------------------------
# B) HIGH (Quant=8; Score 80-95)
# -----------------------------------------------------------------------------
#   - Severe/catastrophic effect; major damage or financial loss; potential
#     loss of life.
#   - Operational: ~40% customers >8h OR >40% >1h; business inoperable days-week.
#   - Safety: moderate injuries >20 people.
#   - Regulatory: multi-regulation failures days.
#   - Reputational: national negative media.
#   - Financial: $10M-$14M fines.
#   - Stock: EIX loss 10%-20%.
#   - Legal: class action/State suits or many individuals.
#
# -----------------------------------------------------------------------------
# C) MODERATE (Quant=5; Score 21-79)
# -----------------------------------------------------------------------------
#   - Serious adverse effect; core function impaired; significant harm, no
#     loss of life.
#   - Operational: >10% customers >6h OR <10% >12h; business down several days.
#   - Safety: moderate injuries several/minor to dozens.
#   - Regulatory: compliance issues days.
#   - Reputational: transient national/ongoing local negative media.
#   - Financial: $4M-$10M fines.
#   - Stock: EIX loss 4%-10%.
#   - Legal: multiple individual suits.
#
# -----------------------------------------------------------------------------
# D) LOW (Quant=2; Score 5-20)
# -----------------------------------------------------------------------------
#   - Limited effect, minor loss/harm, noticeability but not critical.
#   - Operational: <10% customers <8h OR >10% <1h; several hour disruption.
#   - Safety: minor injuries >20 people.
#   - Regulatory: 1-day noncompliance.
#   - Reputational: short-lived local negativity.
#   - Financial: $1M-$4M fines.
#   - Stock: EIX loss 0%-3%.
#   - Legal: few suits.
#
# -----------------------------------------------------------------------------
# E) VERY LOW (Quant=0; Score 0-4)
# -----------------------------------------------------------------------------
#   - Negligible effect.
#   - Operational: <4% customers <8h.
#   - Safety: minor injury to few.
#   - Regulatory: short-term lapse.
#   - Reputational: minimal attention.
#   - Financial: <$1M fine.
#   - Stock: share value fluctuation.
#   - Legal: rare/no suits.
#
# =============================================================================
# EVALUATION PROCEDURE
# =============================================================================
#
# -----------------------------------------------------------------------------
# 1) Risk Impact Classification (MANDATORY)
# -----------------------------------------------------------------------------
#   - Assess risk based on deployment context and intended use if output is
#     wrong or acted on.
#   - Include:
#       - Qualitative value
#       - Quantitative value
#       - Impact score band (0-100)
#       - Drivers (Operational/Safety/etc.)
#       - 2-5 justifying bullets (cite rubric language)
#
# -----------------------------------------------------------------------------
# 2) Task & Constraint Compliance (Gate Check)
# -----------------------------------------------------------------------------
#   - Identify explicit requirements and constraints.
#   - For each: PASS / PARTIAL / FAIL + brief evidence (quote output).
#   - Mark risk escalators as "RISK ESCALATOR."
#
# -----------------------------------------------------------------------------
# 3) Claim-Level Groundedness / Hallucination Audit
# -----------------------------------------------------------------------------
#   If Source or "Source-only" knowledge:
#     - Extract 8-15 atomic claims.
#     - For each:
#         a) Claim (quote output)
#         b) Status: Supported | Contradicted | Not in Source | Unverifiable
#         c) Evidence: quote source or "no support found"
#         d) Severity: Informational | Low | Medium | High | Critical
#
#            - Critical: The claim is unsupported or contradicted AND, if acted
#              upon, could directly cause severe harm, system-level failure,
#              regulatory or legal exposure, security compromise, or materially
#              dangerous decisions. Comparable to CVSS Critical (9.0-10.0).
#
#            - High: The claim is unsupported or contradicted AND could
#              realistically lead to major incorrect decisions, significant
#              financial, operational, or security risk, or materially mislead
#              stakeholders. Comparable to CVSS High (7.0-8.9).
#
#            - Medium: The claim is unsupported, contradicted, or unverifiable
#              AND could contribute to flawed reasoning, incorrect conclusions,
#              or decision errors, but with limited or recoverable impact.
#              Comparable to CVSS Medium (4.0-6.9).
#
#            - Low: The claim is weakly supported, overstated, ambiguous, or
#              imprecise, with minimal practical impact and low likelihood of
#              causing meaningful harm. Comparable to CVSS Low (0.1-3.9).
#
#            - Informational: The claim is technically incorrect, unverifiable,
#              or loosely phrased but does not materially affect understanding,
#              decisions, or outcomes. No direct risk; included for completeness
#              and hygiene. Comparable to CVSS Informational.
#
#         e) Fix: correction | clarification | hedge | removal
#
#   If Source = NONE:
#     - Audit for verifiability, overconfidence, and implied certainty; flag
#       assertions and recommend hedging or explicit uncertainty statements.
#
# -----------------------------------------------------------------------------
# 4) Correctness & Reasoning Quality
# -----------------------------------------------------------------------------
#   - Check internal consistency, logic, number compliance, uncertainty/
#     assumption handling.
#
# -----------------------------------------------------------------------------
# 5) Completeness & Usefulness
# -----------------------------------------------------------------------------
#   - Does output fully answer the user? Identify gaps/missing steps/caveats/
#     tradeoff info.
#
# -----------------------------------------------------------------------------
# 6) Clarity, Structure, and Style
# -----------------------------------------------------------------------------
#   - Assess organization, readability, tone/formatting for audience.
#
# -----------------------------------------------------------------------------
# 7) Controls & Safeguards (risk-adjusted)
# -----------------------------------------------------------------------------
#   - Recommend risk mitigations/controls proportional to risk rating.
#   - For High/Very High, state required verifications and human reviews.
#
# =============================================================================
# SCORING (risk-adjusted)
# =============================================================================
#
# Score per dimension (0-5):
#   5 = excellent, 4 = good, 3 = adequate, 2 = weak, 1 = poor, 0 = unusable
#
# Dimensions:
#   A) Compliance (requirements)
#   B) Groundedness / factual support or uncertainty
#   C) Correctness & reasoning
#   D) Completeness & usefulness
#   E) Clarity & structure
#   F) Style/tone/audience fit
#
# Weights:
#   - Default:       A 20%, B 20%, C 20%, D 20%, E 10%, F 10%
#   - RAG/QA:        A 15%, B 35%, C 20%, D 15%, E 10%, F 5%
#   - Summarization: A 20%, B 25%, C 10%, D 25%, E 15%, F 5%
#   - Translation:   A 15%, B 25%, C 20%, D 10%, E 10%, F 20%
#   - Code:          A 20%, B 5%,  C 35%, D 25%, E 10%, F 5%
#
# Risk Strictness:
#   - VERY HIGH: Any CRITICAL error = BLOCK; major = BLOCK unless fixed;
#     explicit assumptions, verification, SME review required.
#   - HIGH: Any CRITICAL error = BLOCK; major = SHIP WITH EDITS plus controls.
#   - MODERATE or lower: standard logic; block for critical errors.
#
# Compute overall (0-100) score from weights. Show the calculation.
#
# =============================================================================
# FINAL OUTPUT FORMAT (use this structure)
# =============================================================================
#
# I) Risk Impact Classification
#   - Qualitative:
#   - Quantitative:
#   - Impact score band (0-100):
#   - Drivers:
#   - Justification:
#
# II) Executive verdict (3-6 bullets)
#   - Overall quality score (0-100):
#   - Ship decision: Ship | Ship with edits | Block
#   - Biggest strength:
#   - Biggest risk:
#   - Top fixes (1-3):
#
# III) Requirements checklist (PASS/PARTIAL/FAIL with supporting evidence quoted)
#
# IV) Claim audit table (or verifiability audit if no source)
#   - Each: claim (quoted), status, evidence, severity, fix (edit/remove/hedge)
#
# V) Dimension scores
#   - A-F: score (0-5) + rationale
#   - Final overall weighted score and calculation
#
# VI) Prioritized recommendations
#   - For each: priority (P0/P1/P2), recommendation, why, location (quote
#     output snippet)
#
# VII) Optional improved section
#   - If improvable, supply the revision (no new unsupported facts)
#
# If required inputs are missing, list them at the start, then proceed using
# conservative assumptions and call out uncertainties.
#
# All output must strictly follow this structure and heading order.
#
# =============================================================================

# -------------------------------
# Parsing helpers (for your LLM output format)
# -------------------------------

# Matches headings like:
#   I) Risk Impact Classification
#   II) Executive verdict (3–6 bullets)
# etc.
_SECTION_RE = re.compile(
    r"^\s*(?P<num>I|II|III|IV|V|VI|VII)\)\s+(?P<title>.+?)\s*$",
    re.MULTILINE,
)


def split_sections(evaluation_markdown: str) -> Dict[str, Dict[str, str]]:
    """
    Split the evaluation text into its roman numeral sections.

    Returns:
      {
        "I":  {"title": "...", "body": "..."},
        "II": {"title": "...", "body": "..."},
        ...
      }

    If a section is missing, it simply won't exist in the dict.
    """
    matches = list(_SECTION_RE.finditer(evaluation_markdown))
    sections: Dict[str, Dict[str, str]] = {}

    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if (i + 1) < len(matches) else len(evaluation_markdown)
        num = m.group("num")
        title = m.group("title").strip()
        body = evaluation_markdown[start:end].strip("\n")
        sections[num] = {"title": title, "body": body}

    return sections


def extract_bullet_value(section_body: str, field: str) -> Optional[str]:
    """
    Extract a value from a bullet like:
      - Field: value

    Returns None if not found or empty.
    """
    pattern = re.compile(
        rf"^\s*-\s*{re.escape(field)}\s*:\s*(?P<val>.*)\s*$",
        re.IGNORECASE | re.MULTILINE,
    )
    m = pattern.search(section_body)
    if not m:
        return None
    val = m.group("val").strip()
    return val or None


def parse_risk(section_body: str) -> Dict[str, Any]:
    """
    Parse section I) Risk Impact Classification.

    Expected bullets (per your prompt):
      - Qualitative:
      - Quantitative:
      - Impact score band (0–100):
      - Drivers:
      - Justification:
    """
    qualitative = extract_bullet_value(section_body, "Qualitative")
    quantitative = extract_bullet_value(section_body, "Quantitative")
    band = (
        extract_bullet_value(section_body, "Impact score band (0–100)")
        or extract_bullet_value(section_body, "Impact score band (0-100)")
    )
    drivers_raw = extract_bullet_value(section_body, "Drivers")

    # "Justification" can be either a single-line bullet or a block under "- Justification:"
    justification = extract_bullet_value(section_body, "Justification")
    if justification is None:
        m = re.search(r"^\s*-\s*Justification\s*:\s*$", section_body, re.IGNORECASE | re.MULTILINE)
        if m:
            justification = section_body[m.end():].strip() or None

    drivers: List[str] = []
    if drivers_raw:
        drivers = [d.strip() for d in re.split(r"[,\|;]+", drivers_raw) if d.strip()]

    q_int: Optional[int] = None
    if quantitative and quantitative.strip().isdigit():
        q_int = int(quantitative.strip())

    return {
        "qualitative": qualitative,
        "quantitative": q_int,
        "band": band,
        "drivers": drivers,
        "justification": justification,
    }


def parse_executive_verdict(section_body: str) -> Dict[str, Any]:
    """
    Parse section II) Executive verdict.

    Expected bullets (per your prompt):
      - Overall quality score (0–100):
      - Ship decision:
      - Biggest strength:
      - Biggest risk:
      - Top fixes (1–3):
    """
    score_raw = (
        extract_bullet_value(section_body, "Overall quality score (0–100)")
        or extract_bullet_value(section_body, "Overall quality score (0-100)")
    )
    ship_decision = extract_bullet_value(section_body, "Ship decision")
    biggest_strength = extract_bullet_value(section_body, "Biggest strength")
    biggest_risk = extract_bullet_value(section_body, "Biggest risk")

    top_fixes = (
        extract_bullet_value(section_body, "Top fixes (1–3)")
        or extract_bullet_value(section_body, "Top fixes (1-3)")
        or extract_bullet_value(section_body, "Top fixes")
    )
    if top_fixes is None:
        m = re.search(
            r"^\s*-\s*Top fixes(?:\s*\(1[–-]3\))?\s*:\s*$",
            section_body,
            re.IGNORECASE | re.MULTILINE,
        )
        if m:
            top_fixes = section_body[m.end():].strip() or None

    score_int: Optional[int] = None
    if score_raw and score_raw.strip().isdigit():
        score_int = int(score_raw.strip())

    return {
        "overall_score": score_int,
        "ship_decision": ship_decision,
        "biggest_strength": biggest_strength,
        "biggest_risk": biggest_risk,
        "top_fixes": top_fixes,
        "raw": section_body.strip(),
    }


def summarize_requirement_statuses(section_body: str) -> Dict[str, int]:
    """
    Count PASS/PARTIAL/FAIL occurrences in section III.
    Works for both bullet lists and markdown tables.
    """
    lower = section_body.lower()
    return {
        "pass": len(re.findall(r"\bpass\b", lower)),
        "partial": len(re.findall(r"\bpartial\b", lower)),
        "fail": len(re.findall(r"\bfail\b", lower)),
    }


def summarize_claim_audit(section_body: str) -> Dict[str, Dict[str, int]]:
    """
    Heuristic summary for claim audit section IV.
    Counts occurrences of key status/severity keywords.

    This is intentionally conservative and "dumb":
    - The canonical evidence remains the attached section markdown.
    - The summary is just for quick triage and step coloring.
    """
    lower = section_body.lower()
    return {
        "severity": {
            "critical": len(re.findall(r"\bcritical\b", lower)),
            "major": len(re.findall(r"\bmajor\b", lower)),
            "minor": len(re.findall(r"\bminor\b", lower)),
        },
        "status": {
            "supported": len(re.findall(r"\bsupported\b", lower)),
            "contradicted": len(re.findall(r"\bcontradicted\b", lower)),
            "not_in_source": len(re.findall(r"\bnot in source\b", lower)),
            "unverifiable": len(re.findall(r"\bunverifiable\b", lower)),
        },
    }


def summarize_recommendations(section_body: str) -> Dict[str, int]:
    """
    Count P0/P1/P2 occurrences in section VI.
    """
    lower = section_body.lower()
    return {
        "p0": len(re.findall(r"\bp0\b", lower)),
        "p1": len(re.findall(r"\bp1\b", lower)),
        "p2": len(re.findall(r"\bp2\b", lower)),
    }


# -------------------------------
# Allure schema helpers
# -------------------------------

def now_ms() -> int:
    """UNIX epoch milliseconds (Allure expects ms timestamps in result files)."""
    return int(_dt.datetime.now(tz=_dt.timezone.utc).timestamp() * 1000)


def md5_hex(text: str) -> str:
    """Stable identifier hash used for historyId/testCaseId."""
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def escape_html_pre(text: str) -> str:
    """Simple HTML wrapper suitable for Allure descriptionHtml."""
    return "<pre>" + html.escape(text) + "</pre>"


def risk_to_allure_severity(risk_qualitative: Optional[str]) -> str:
    """
    Map your business impact risk to Allure's built-in 'severity' label values.

    Allure severity allowed values (string):
      - trivial, minor, normal, critical, blocker

    This is OPTIONAL metadata, but it's very useful for filtering/triage in the report.

    Alternative:
    - Do not map business risk to severity at all; instead use only "tag" labels like "risk:High".
      (Some orgs reserve Allure severity for functional test criticality.)
    """
    if not risk_qualitative:
        return "normal"

    q = risk_qualitative.strip().lower()
    mapping = {
        "very low": "trivial",
        "low": "minor",
        "moderate": "normal",
        "high": "critical",
        "very high": "blocker",
    }
    return mapping.get(q, "normal")


def ship_decision_to_allure_status(ship_decision: Optional[str]) -> str:
    """
    Map the evaluation's Ship decision to an Allure status.

    Allure supports exactly: passed, failed, broken, skipped, unknown.

    Recommended mapping (default):
      - Ship => passed
      - Ship with edits => broken
          Rationale: indicates deficiencies; "broken" is yellow and often used for "needs work".
          Alternatives:
            * Map to failed if you want *any* edits-required to be red.
            * Map to passed but add a tag/warning if this is informational-only.
      - Block => failed
      - Unknown => unknown
    """
    if not ship_decision:
        return "unknown"

    s = ship_decision.strip().lower()
    if s == "ship":
        return "passed"
    if s in {"ship with edits", "ship w/ edits", "ship-with-edits"}:
        return "broken"
    if "block" in s:
        return "failed"
    return "unknown"


def write_text_attachment(
    allure_dir: Path,
    *,
    display_name: str,
    content: str,
    mime_type: str,
    extension: str,
) -> Dict[str, str]:
    """
    Create an Allure attachment file and return the attachment descriptor.

    Attachment object schema:
      { "name": "...", "source": "...", "type": "media/type" }

    Attachments are OPTIONAL, but strongly recommended here.
    """
    attachment_uuid = str(uuid.uuid4())
    filename = f"{attachment_uuid}-attachment.{extension}"
    (allure_dir / filename).write_text(content, encoding="utf-8")
    return {"name": display_name, "source": filename, "type": mime_type}


# -------------------------------
# Main conversion function
# -------------------------------

def write_allure_result_from_llm_evaluation(
    evaluation_markdown: str,
    *,
    output_dir: str = "allure-results",
    test_name: Optional[str] = None,
    suite: str = "LLM Quality",
    parent_suite: Optional[str] = None,
    sub_suite: Optional[str] = None,
    owner: Optional[str] = None,
    epic: Optional[str] = None,
    feature: Optional[str] = None,
    story: Optional[str] = None,
    links: Optional[List[Dict[str, str]]] = None,
    extra_labels: Optional[Dict[str, Any]] = None,
    extra_parameters: Optional[Dict[str, str]] = None,
) -> Path:
    """
    Convert an evaluation markdown string into a {uuid}-result.json file in Allure format.

    Parameters and their optionality:
    - output_dir (optional): where to write files. Default "allure-results" (recommended standard).
    - test_name (optional): display name in Allure UI. Default is derived from ship decision.
    - suite/parent_suite/sub_suite (optional): suite hierarchy labels for Allure navigation.
    - owner/epic/feature/story (optional): behavior metadata labels.
    - links (optional): list of Allure links, e.g. issue/tms/docs.
    - extra_labels (optional): arbitrary Allure labels (string or list-of-strings).
    - extra_parameters (optional): additional parameters shown in report (and can affect historyId).

    Returns:
      Path to the created result JSON file.
    """
    start_ms = now_ms()
    allure_dir = Path(output_dir)
    allure_dir.mkdir(parents=True, exist_ok=True)

    # ---- Parse the evaluation (best-effort) ----
    sections = split_sections(evaluation_markdown)
    missing_sections = [n for n in ["I", "II", "III", "IV", "V", "VI", "VII"] if n not in sections]

    risk = parse_risk(sections.get("I", {}).get("body", "")) if "I" in sections else {}
    verdict = parse_executive_verdict(sections.get("II", {}).get("body", "")) if "II" in sections else {}

    req_summary = summarize_requirement_statuses(sections.get("III", {}).get("body", "")) if "III" in sections else {"pass": 0, "partial": 0, "fail": 0}
    claim_summary = summarize_claim_audit(sections.get("IV", {}).get("body", "")) if "IV" in sections else {"severity": {"critical": 0, "major": 0, "minor": 0}, "status": {}}
    rec_summary = summarize_recommendations(sections.get("VI", {}).get("body", "")) if "VI" in sections else {"p0": 0, "p1": 0, "p2": 0}

    ship_decision = verdict.get("ship_decision")
    allure_status = ship_decision_to_allure_status(ship_decision)

    # Optional but recommended: a human-friendly test name if the caller didn't provide one.
    if not test_name:
        test_name = f"LLM output quality review — decision: {ship_decision or 'Unknown'}"

    # Optional but recommended: a stable-ish fullName for grouping.
    # If you have a canonical ID (e.g., ticket number), include it in test_name or pass your own fullName logic.
    full_name = f"{suite}.{test_name}".replace(" ", "_")

    # ---- Build attachments (verbose) ----
    # Attachments are optional in Allure, but here they are the *core value*:
    # the report becomes the audit artifact.
    attachments: List[Dict[str, str]] = []
    section_attachments: Dict[str, Dict[str, str]] = {}

    # Always attach the full evaluation markdown.
    section_attachments["FULL"] = write_text_attachment(
        allure_dir,
        display_name="LLM evaluation (raw markdown)",
        content=evaluation_markdown,
        mime_type="text/markdown",
        extension="md",
    )
    attachments.append(section_attachments["FULL"])

    # Attach each section separately for easier navigation.
    for roman in ["I", "II", "III", "IV", "V", "VI", "VII"]:
        if roman in sections:
            title = sections[roman]["title"]
            body = sections[roman]["body"].strip()
            section_attachments[roman] = write_text_attachment(
                allure_dir,
                display_name=f"Section {roman}: {title}",
                content=f"{roman}) {title}\n\n{body}\n",
                mime_type="text/markdown",
                extension="md",
            )
            attachments.append(section_attachments[roman])

    # Machine-readable summary attachment (optional, but recommended for CI parsing/dashboards).
    summary_obj = {
        "risk": risk,
        "verdict": {k: v for k, v in verdict.items() if k != "raw"},
        "requirements_summary": req_summary,
        "claim_audit_summary": claim_summary,
        "recommendations_summary": rec_summary,
        "missing_sections": missing_sections,
        "generated_at_ms": start_ms,
    }
    attachments.append(
        write_text_attachment(
            allure_dir,
            display_name="LLM evaluation summary (JSON)",
            content=json.dumps(summary_obj, ensure_ascii=False, indent=2),
            mime_type="application/json",
            extension="json",
        )
    )

    # ---- Step tree (optional but recommended for readability) ----
    # In Allure, "steps" are optional, but they make the report navigable.
    # We create one step per evaluation section.
    def requirements_step_status() -> str:
        if req_summary["fail"] > 0:
            return "failed"
        if req_summary["partial"] > 0:
            return "broken"
        if req_summary["pass"] > 0:
            return "passed"
        return "unknown"

    def claim_audit_step_status() -> str:
        sev = claim_summary.get("severity", {})
        if sev.get("critical", 0) > 0:
            return "failed"
        if sev.get("major", 0) > 0:
            return "broken"
        # Minor issues still indicate "needs edits" in many workflows.
        if sev.get("minor", 0) > 0:
            return "broken"
        return "passed" if allure_status == "passed" else allure_status

    # Step objects share many of the same optional fields as test results.
    # We'll populate them all (even if empty) to be explicit and reviewer-friendly.
    steps: List[Dict[str, Any]] = []
    clock = start_ms

    def add_step(step_name: str, step_status: str, attach_section: Optional[str]) -> None:
        nonlocal clock
        s_start = clock
        clock += 1
        s_stop = clock

        steps.append(
            {
                "name": step_name,
                "status": step_status,     # optional but recommended (gives step color)
                "stage": "finished",       # optional; use "finished" for completed steps
                "start": s_start,          # optional; helps with timeline/duration
                "stop": s_stop,            # optional; helps with timeline/duration

                # Optional arrays; populated explicitly for verbosity.
                "parameters": [],          # optional; could include per-step parameters
                "attachments": [section_attachments[attach_section]] if attach_section in section_attachments else [],
                "steps": [],               # optional; nested sub-steps

                # Optional object; include all keys for clarity.
                "statusDetails": {
                    "known": False,         # optional; set True if the step fails due to known issue
                    "muted": False,         # optional; set True to not affect stats
                    "flaky": False,         # optional; set True if unstable
                    "message": None,        # optional; short message
                    "trace": None,          # optional; longer detail
                },
            }
        )

    add_step("0) Risk Impact Classification", "passed" if risk.get("qualitative") else "broken", "I")
    add_step("1) Task & Constraint Compliance (Gate Check)", requirements_step_status(), "III")
    add_step("2) Claim-Level Groundedness / Hallucination Audit", claim_audit_step_status(), "IV")
    add_step("3) Correctness & Reasoning Quality", allure_status, "V")
    add_step("4) Completeness & Usefulness", allure_status, "V")
    add_step("5) Clarity, Structure, and Style", allure_status, "V")
    add_step("6) Controls & Safeguards (risk-adjusted)", allure_status, "VI")

    # ---- Labels (optional metadata, highly recommended) ----
    labels: List[Dict[str, str]] = [
        {"name": "host", "value": platform.node() or "unknown"},                           # optional but common
        {"name": "thread", "value": f"{os.getpid()}-{threading.current_thread().name}"},   # optional but common
        {"name": "language", "value": "python"},                                           # optional but common
        {"name": "framework", "value": "custom-llm-eval"},                                 # optional but common
        {"name": "suite", "value": suite},                                                 # optional; drives Suites tab grouping
    ]

    # Optional suite hierarchy.
    if parent_suite:
        labels.append({"name": "parentSuite", "value": parent_suite})
    if sub_suite:
        labels.append({"name": "subSuite", "value": sub_suite})

    # Optional behavior metadata.
    if epic:
        labels.append({"name": "epic", "value": epic})
    if feature:
        labels.append({"name": "feature", "value": feature})
    if story:
        labels.append({"name": "story", "value": story})
    if owner:
        labels.append({"name": "owner", "value": owner})

    # Optional (but recommended): map business risk to Allure severity.
    labels.append({"name": "severity", "value": risk_to_allure_severity(risk.get("qualitative"))})

    # Optional tags: Allure supports multiple "tag" labels.
    if risk.get("qualitative"):
        labels.append({"name": "tag", "value": f"risk:{risk['qualitative']}"})
    for d in (risk.get("drivers") or []):
        labels.append({"name": "tag", "value": f"driver:{d}"})
    if ship_decision:
        labels.append({"name": "tag", "value": f"decision:{ship_decision}"})

    # Optional custom labels (Allure supports arbitrary label names).
    if verdict.get("overall_score") is not None:
        labels.append({"name": "quality_score", "value": str(verdict["overall_score"])})

    if extra_labels:
        for name, value in extra_labels.items():
            # Support a single value or list-of-values (to emulate multi-tag labels).
            if isinstance(value, list):
                for v in value:
                    labels.append({"name": name, "value": str(v)})
            else:
                labels.append({"name": name, "value": str(value)})

    # ---- Parameters (optional metadata; also affects historyId if excluded=False) ----
    parameters: List[Dict[str, Any]] = []

    def add_param(name: str, value: str, *, excluded: bool, mode: str) -> None:
        """
        Allure parameter object supports:
          - name (string)
          - value (string)
          - excluded (boolean) [optional]
          - mode (string) [optional]: default | masked | hidden

        Recommended defaults:
          - excluded=False for stable parameters you want to affect history grouping
          - excluded=True for volatile parameters (timestamps, random IDs)
          - mode="default" normally
          - mode="masked" for secrets
          - mode="hidden" for noisy parameters you never want shown
        """
        parameters.append({"name": name, "value": value, "excluded": excluded, "mode": mode})

    if risk.get("qualitative"):
        add_param("risk_qualitative", risk["qualitative"], excluded=False, mode="default")
    if risk.get("quantitative") is not None:
        add_param("risk_quantitative", str(risk["quantitative"]), excluded=False, mode="default")
    if verdict.get("overall_score") is not None:
        add_param("quality_score_0_100", str(verdict["overall_score"]), excluded=False, mode="default")
    if ship_decision:
        add_param("ship_decision", ship_decision, excluded=False, mode="default")

    # Volatile param: excluded=True so it does NOT affect historyId grouping.
    add_param(
        "generated_at_utc",
        _dt.datetime.now(tz=_dt.timezone.utc).isoformat(),
        excluded=True,
        mode="hidden",
    )

    if extra_parameters:
        for k, v in extra_parameters.items():
            add_param(k, str(v), excluded=False, mode="default")

    # Now that parameters exist, compute stable IDs:
    # - testCaseId: stable per logical test (here: full_name)
    # - historyId: stable per logical test + non-excluded params
    test_case_id = md5_hex(full_name)
    history_basis_parts = [full_name]
    for p in sorted((p for p in parameters if not p.get("excluded", False)), key=lambda x: x["name"]):
        history_basis_parts.append(f"{p['name']}={p['value']}")
    history_id = md5_hex("|".join(history_basis_parts))

    # ---- Links (optional) ----
    # Useful for connecting to issues, TMS, docs, source material, etc.
    # Each link is: {"type": "issue|tms|link|...", "name": "...", "url": "..."}
    links = links or []

    # ---- statusDetails (optional) ----
    # We populate all fields for explicitness. `message` + `trace` are very helpful in the UI.
    message_parts: List[str] = []
    if ship_decision:
        message_parts.append(f"Ship decision: {ship_decision}")
    if verdict.get("overall_score") is not None:
        message_parts.append(f"Quality score: {verdict['overall_score']}/100")
    if risk.get("qualitative"):
        message_parts.append(f"Risk: {risk['qualitative']} ({risk.get('quantitative')})")
    if missing_sections:
        message_parts.append(f"Missing sections: {', '.join(missing_sections)}")

    status_message = " | ".join(message_parts) if message_parts else "LLM evaluation result"
    trace_text = (
        "=== Executive Verdict (raw) ===\n"
        + (verdict.get("raw") or "")
        + "\n\n=== Requirements Checklist (raw) ===\n"
        + (sections.get("III", {}).get("body", "") if "III" in sections else "")
        + "\n"
    )

    # ---- Descriptions (optional) ----
    # Allure supports description as Markdown and/or HTML. We'll set both.
    description_md = (
        "## Executive verdict\n\n"
        + (sections.get("II", {}).get("body", "") if "II" in sections else "")
        + "\n\n## Risk impact classification\n\n"
        + (sections.get("I", {}).get("body", "") if "I" in sections else "")
        + "\n"
    )
    description_html = escape_html_pre(description_md)

    # ---- Build the Allure result JSON object ----
    result_uuid = str(uuid.uuid4())  # required: unique identifier for THIS run/attempt
    stop_ms = max(now_ms(), clock + 1)

    # IMPORTANT: The Allure test result file supports many OPTIONAL properties.
    # This object intentionally includes the major optional properties explicitly.
    result_obj: Dict[str, Any] = {
        # Identifiers (historyId/testCaseId are OPTIONAL but strongly recommended)
        "uuid": result_uuid,
        "historyId": history_id,
        "testCaseId": test_case_id,

        # Metadata (mostly optional, but "name" is essential for a readable report)
        "name": test_name,
        "fullName": full_name,
        "description": description_md,          # optional (Markdown)
        "descriptionHtml": description_html,    # optional (HTML)
        "links": links,                         # optional
        "labels": labels,                       # optional
        "parameters": parameters,               # optional
        "attachments": attachments,             # optional

        # Execution (status is required-ish to be meaningful)
        "status": allure_status,
        "statusDetails": {
            # These are OPTIONAL fields; defaults chosen to keep report honest and stats meaningful.
            "known": False,          # Set True if this failure is due to a known issue/bug.
            "muted": False,          # Set True to exclude this test from statistics (use carefully).
            "flaky": False,          # Set True if the evaluation is expected to be unstable run-to-run.
            "message": status_message,
            "trace": trace_text,
        },
        "stage": "finished",        # OPTIONAL: scheduled|running|finished|pending|interrupted
        "start": start_ms,          # OPTIONAL but recommended for timeline/duration
        "stop": stop_ms,            # OPTIONAL but recommended for timeline/duration
        "steps": steps,             # OPTIONAL but recommended for readability
    }

    # ---- Write files ----
    result_path = allure_dir / f"{result_uuid}-result.json"
    result_path.write_text(json.dumps(result_obj, ensure_ascii=False, indent=2), encoding="utf-8")

    # Optional file: environment.properties (not required, but useful in the report's "Environment" widget).
    # We create it if it doesn't exist already so multiple results don't overwrite it.
    env_path = allure_dir / "environment.properties"
    if not env_path.exists():
        env_lines = [
            f"llm_eval.suite={suite}",
            f"llm_eval.status={allure_status}",
            f"llm_eval.ship_decision={ship_decision or 'Unknown'}",
            f"llm_eval.risk_qualitative={risk.get('qualitative') or 'Unknown'}",
            f"llm_eval.risk_quantitative={risk.get('quantitative') if risk.get('quantitative') is not None else 'Unknown'}",
        ]
        env_path.write_text("\n".join(env_lines) + "\n", encoding="utf-8")

    return result_path


# -------------------------------
# CLI
# -------------------------------

def _read_input_text(path: Optional[str]) -> str:
    if path:
        return Path(path).read_text(encoding="utf-8")
    # If no --input is provided, read from stdin (useful for piping).
    return os.sys.stdin.read()


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert LLM evaluation output to Allure result JSON.")
    parser.add_argument("--input", help="Path to a file containing the LLM evaluation markdown. If omitted, reads stdin.")
    parser.add_argument("--output-dir", default="allure-results", help="Directory to write Allure results (default: allure-results).")

    # Optional metadata knobs
    parser.add_argument("--test-name", help="Allure test display name (optional).")
    parser.add_argument("--suite", default="LLM Quality", help="Allure suite label (optional; default: LLM Quality).")
    parser.add_argument("--parent-suite", help="Allure parentSuite label (optional).")
    parser.add_argument("--sub-suite", help="Allure subSuite label (optional).")
    parser.add_argument("--owner", help="Allure owner label (optional).")
    parser.add_argument("--epic", help="Allure epic label (optional).")
    parser.add_argument("--feature", help="Allure feature label (optional).")
    parser.add_argument("--story", help="Allure story label (optional).")

    args = parser.parse_args()

    evaluation_text = _read_input_text(args.input)

    result_path = write_allure_result_from_llm_evaluation(
        evaluation_text,
        output_dir=args.output_dir,
        test_name=args.test_name,
        suite=args.suite,
        parent_suite=args.parent_suite,
        sub_suite=args.sub_suite,
        owner=args.owner,
        epic=args.epic,
        feature=args.feature,
        story=args.story,
    )

    print(f"Wrote Allure result: {result_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
