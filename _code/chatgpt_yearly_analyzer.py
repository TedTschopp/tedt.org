#!/usr/bin/env python3
"""
chatgpt_yearly_analyzer.py

Analyze a ChatGPT data export (conversations.json) for a given year.
Outputs summary markdown + CSVs for conversation-level data, categories, and use-cases.

Usage:
  python3 chatgpt_yearly_analyzer.py /path/to/conversations.json --year 2025 --tz America/Los_Angeles

You can also pass the exported .zip; it will try to find conversations.json inside.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo  # py3.9+
except Exception:
    ZoneInfo = None  # type: ignore


# -----------------------------
# Configuration: categories & use-cases
# -----------------------------

CATEGORY_RULES = [
    ("Work: Enterprise architecture & strategy",
     r"\b(enterprise\s+architecture|capabilit(y|ies)|roadmap|operating\s+model|target\s+state|togaf|archimate|portfolio|governance)\b"),
    ("Work: Cloud & infrastructure",
     r"\b(aws|azure|gcp|kubernetes|k8s|terraform|iam|vpc|networking|vpn|load\s*balancer|dns)\b"),
    ("Work: Security & risk",
     r"\b(threat\s+model|risk|vulnerability|cve|zero\s+trust|encryption|soc2|iso\s*27001|pci|hipaa)\b"),
    ("Tech: Coding & debugging",
     r"\b(python|javascript|typescript|java|c\+\+|c#|golang|rust|sql|regex|git|docker|stack\s*trace|traceback|exception|bug|debug)\b"),
    ("Tech: Data & analytics",
     r"\b(kpi|metrics|dashboard|data\s+model|etl|dbt|warehouse|lakehouse|pandas|excel|spreadsheet|query)\b"),
    ("Communication: Writing & editing",
     r"\b(rewrite|revise|edit|proofread|polish|tone|draft|email|memo|proposal|executive\s+summary|slide|deck|presentation)\b"),
    ("Learning: Explanations & research",
     r"\b(explain|teach\s+me|what\s+is|how\s+does|difference\s+between|pros\s+and\s+cons|compare)\b"),
    ("Planning: Productivity & decisions",
     r"\b(plan|planning|itinerary|schedule|priorit(y|ize)|okr|goal|to-?do|checklist|decision)\b"),
    ("Creative: Storytelling & games",
     r"\b(d&d|dnd|ttrpg|campaign|npc|worldbuild|lore|plot|character\s+backstory|story)\b"),
    ("Personal: Family & life",
     r"\b(parent(ing)?|kid(s)?|child(ren)?|school|marriage|relationship|family|vacation)\b"),
]

USE_CASE_RULES = [
    ("Drafting / rewriting text",
     r"\b(rewrite|revise|edit|proofread|polish|tone|draft|write an email|cover letter|resume|cv)\b"),
    ("Summarization / extracting key points",
     r"\b(summarize|tl;dr|key points|meeting notes|minutes|bullet points|action items)\b"),
    ("Coding help / debugging",
     r"\b(traceback|stack trace|error|exception|debug|bug|refactor|unit test)\b|\b(python|javascript|typescript|sql|regex|git|docker)\b"),
    ("Systems / solution design",
     r"\b(architecture|design|integration|api|microservice|event-driven|roadmap|target state)\b"),
    ("Research / explanations",
     r"\b(explain|what is|how does|difference between|examples|tutorial)\b"),
    ("Planning / prioritization",
     r"\b(plan|itinerary|schedule|okr|goals|priorit(y|ize)|checklist)\b"),
    ("Brainstorming / ideation",
     r"\b(brainstorm|ideas|generate|options|names|themes)\b"),
    ("Decision support / comparisons",
     r"\b(compare|pros and cons|trade-?offs|which should|recommend)\b"),
    ("Data / tables / spreadsheets",
     r"\b(table|spreadsheet|excel|csv|pivot|formula|analy(sis|ze)|metrics)\b"),
    ("Creative writing / roleplay",
     r"\b(story|plot|character|worldbuild|npc|campaign|scene)\b"),
]


STOPWORDS = {
    "the","a","an","and","or","but","if","then","than","that","this","those","these",
    "to","of","in","on","for","with","at","by","from","as","is","are","was","were",
    "be","been","being","it","its","i","you","we","they","he","she","them","us",
    "my","your","our","their","me","can","could","should","would","may","might",
    "do","does","did","done","not","no","yes","what","how","why","when","where",
}


# -----------------------------
# Data structures
# -----------------------------

@dataclass
class Msg:
    ts: float
    role: str
    text: str

@dataclass
class ConvSummary:
    conv_id: str
    title: str
    created: datetime
    updated: datetime
    category: str
    user_msgs_year: int
    assistant_msgs_year: int
    user_words_year: int
    assistant_words_year: int


# -----------------------------
# Helpers
# -----------------------------

def load_export(path: Path) -> list[dict]:
    if path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path, "r") as z:
            # Try common locations/names
            candidates = [n for n in z.namelist() if n.endswith("conversations.json")]
            if not candidates:
                raise FileNotFoundError("Could not find conversations.json inside the .zip export.")
            # Pick the first match
            with z.open(candidates[0]) as f:
                return json.load(f)
    else:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)


def to_dt(ts: float | None, tz_name: str) -> datetime:
    if ts is None:
        return datetime.fromtimestamp(0, tz=timezone.utc)

    if ZoneInfo is not None:
        try:
            tz = ZoneInfo(tz_name)
        except Exception:
            tz = timezone.utc
    else:
        tz = timezone.utc

    return datetime.fromtimestamp(ts, tz=tz)


def message_text(message_obj: dict | None) -> str:
    """
    Extract best-effort plain text from an exported message node.
    """
    if not message_obj:
        return ""

    content = message_obj.get("content") or {}
    # Common export structure: content.parts = [ "...", ... ]
    parts = content.get("parts")
    if isinstance(parts, list):
        # parts can include strings or nested structures; stringify safely
        return "\n".join([p if isinstance(p, str) else json.dumps(p, ensure_ascii=False) for p in parts]).strip()

    # Fallback fields sometimes present
    if isinstance(content.get("text"), str):
        return content["text"].strip()

    # Last resort: stringify content
    return json.dumps(content, ensure_ascii=False)


def collect_messages(conv: dict) -> list[Msg]:
    mapping = conv.get("mapping") or {}
    out: list[Msg] = []

    for node in mapping.values():
        msg = node.get("message")
        if not msg:
            continue
        author = msg.get("author") or {}
        role = author.get("role") or "unknown"
        ts = msg.get("create_time")
        if ts is None:
            continue
        text = message_text(msg)
        if not text:
            continue
        out.append(Msg(ts=float(ts), role=str(role), text=text))

    out.sort(key=lambda m: m.ts)
    return out


def pick_category(title: str, sample_text: str) -> str:
    blob = f"{title}\n{sample_text}".lower()
    for name, pattern in CATEGORY_RULES:
        if re.search(pattern, blob, flags=re.IGNORECASE):
            return name
    return "Other / uncategorized"


def year_bounds(year: int, tz_name: str) -> tuple[datetime, datetime]:
    if ZoneInfo is not None:
        try:
            tz = ZoneInfo(tz_name)
        except Exception:
            tz = timezone.utc
    else:
        tz = timezone.utc
    start = datetime(year, 1, 1, 0, 0, 0, tzinfo=tz)
    end = datetime(year + 1, 1, 1, 0, 0, 0, tzinfo=tz)
    return start, end


def in_year(dt: datetime, start: datetime, end: datetime) -> bool:
    return start <= dt < end


def word_count(s: str) -> int:
    # simple word count
    return len(re.findall(r"\b[\w'-]+\b", s))


def tokenish_words(s: str) -> list[str]:
    words = re.findall(r"\b[a-zA-Z][a-zA-Z'-]{1,}\b", s.lower())
    return [w for w in words if w not in STOPWORDS]


def use_case_hits(text: str) -> list[str]:
    hits = []
    for name, pattern in USE_CASE_RULES:
        if re.search(pattern, text, flags=re.IGNORECASE):
            hits.append(name)
    return hits


# -----------------------------
# Main analysis
# -----------------------------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("export_path", help="Path to conversations.json or the exported .zip file")
    ap.add_argument("--year", type=int, default=2025, help="Year to analyze (default: 2025)")
    ap.add_argument("--tz", default="America/Los_Angeles", help="Timezone for boundaries (default: America/Los_Angeles)")
    ap.add_argument("--sample_user_msgs", type=int, default=5, help="How many early user messages to use for categorization (default: 5)")
    args = ap.parse_args()

    path = Path(args.export_path).expanduser()
    conversations = load_export(path)

    start, end = year_bounds(args.year, args.tz)

    conv_summaries: list[ConvSummary] = []
    categories = Counter()
    use_cases = Counter()
    top_words = Counter()

    chats_started_in_year = 0
    chats_active_in_year = 0

    total_user_msgs_year = 0
    total_assistant_msgs_year = 0

    for conv in conversations:
        conv_id = str(conv.get("id") or conv.get("conversation_id") or "")
        title = str(conv.get("title") or "").strip()

        created = to_dt(conv.get("create_time"), args.tz)
        updated = to_dt(conv.get("update_time"), args.tz)

        msgs = collect_messages(conv)

        # Determine "active in year" based on any message timestamp in year
        active = False
        user_msgs_year = 0
        assistant_msgs_year = 0
        user_words_year = 0
        assistant_words_year = 0

        # Sample text for categorization: title + first N user messages
        early_user_texts = []
        for m in msgs:
            dt = to_dt(m.ts, args.tz)
            if in_year(dt, start, end):
                active = True
                if m.role == "user":
                    user_msgs_year += 1
                    user_words_year += word_count(m.text)
                    total_user_msgs_year += 1

                    # use-cases per user message
                    for hit in use_case_hits(m.text):
                        use_cases[hit] += 1

                    for w in tokenish_words(m.text):
                        top_words[w] += 1

                elif m.role == "assistant":
                    assistant_msgs_year += 1
                    assistant_words_year += word_count(m.text)
                    total_assistant_msgs_year += 1

            # Early user message capture (for categorization)
            if m.role == "user" and len(early_user_texts) < args.sample_user_msgs:
                early_user_texts.append(m.text)

        if in_year(created, start, end):
            chats_started_in_year += 1
        if active:
            chats_active_in_year += 1
        else:
            # skip conversations with no activity in selected year
            continue

        sample_text = "\n".join(early_user_texts[: args.sample_user_msgs])
        category = pick_category(title, sample_text)

        categories[category] += 1

        conv_summaries.append(
            ConvSummary(
                conv_id=conv_id,
                title=title,
                created=created,
                updated=updated,
                category=category,
                user_msgs_year=user_msgs_year,
                assistant_msgs_year=assistant_msgs_year,
                user_words_year=user_words_year,
                assistant_words_year=assistant_words_year,
            )
        )

    # Sort outputs
    conv_summaries.sort(key=lambda c: (c.created, c.conv_id))
    top_categories = categories.most_common()
    top_use_cases = use_cases.most_common(10)
    top_terms = top_words.most_common(30)

    # Write CSV: per conversation
    with open(f"chatgpt_{args.year}_conversations.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "conv_id","title","created","updated","category",
            "user_msgs_year","assistant_msgs_year","user_words_year","assistant_words_year"
        ])
        for c in conv_summaries:
            w.writerow([
                c.conv_id,
                c.title,
                c.created.isoformat(),
                c.updated.isoformat(),
                c.category,
                c.user_msgs_year,
                c.assistant_msgs_year,
                c.user_words_year,
                c.assistant_words_year,
            ])

    # Write CSV: categories
    with open(f"chatgpt_{args.year}_categories.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["category","conversations"])
        for cat, n in top_categories:
            w.writerow([cat, n])

    # Write CSV: use cases
    with open(f"chatgpt_{args.year}_use_cases.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["use_case","hits"])
        for uc, n in use_cases.most_common():
            w.writerow([uc, n])

    # Write Markdown summary
    with open(f"chatgpt_{args.year}_summary.md", "w", encoding="utf-8") as f:
        f.write(f"# ChatGPT usage summary for {args.year}\n\n")
        f.write(f"- Timezone used for year boundaries: `{args.tz}`\n")
        f.write(f"- Chats started in {args.year}: **{chats_started_in_year}**\n")
        f.write(f"- Chats active in {args.year}: **{chats_active_in_year}**\n")
        f.write(f"- User messages in {args.year}: **{total_user_msgs_year}**\n")
        f.write(f"- Assistant messages in {args.year}: **{total_assistant_msgs_year}**\n\n")

        f.write("## Category breakdown (by conversations)\n\n")
        for cat, n in top_categories:
            f.write(f"- {cat}: {n}\n")

        f.write("\n## Top 10 use-cases (by user-message hits)\n\n")
        for uc, n in top_use_cases:
            f.write(f"- {uc}: {n}\n")

        f.write("\n## Top prompt terms (rough)\n\n")
        f.write(", ".join([t for t, _ in top_terms]) + "\n")

    print(f"Done. Wrote:")
    print(f"  chatgpt_{args.year}_summary.md")
    print(f"  chatgpt_{args.year}_conversations.csv")
    print(f"  chatgpt_{args.year}_categories.csv")
    print(f"  chatgpt_{args.year}_use_cases.csv")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
