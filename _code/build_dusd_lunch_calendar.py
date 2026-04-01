#!/usr/bin/env python3
"""Build an iCalendar feed for Duarte USD elementary lunch menus.

The source menus are monthly PDFs hosted by School Nutrition and Fitness.
This script probes all month URLs for the current year and next year, parses
the published PDFs, and writes a single ICS file containing one all-day event
per lunch menu day.

Usage:
  python3 _code/build_dusd_lunch_calendar.py --output dusd-lunch-menu.ics
"""

from __future__ import annotations

import argparse
import calendar
import datetime as dt
import hashlib
import io
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

try:
    import pdfplumber
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: pdfplumber. Install it with `pip install -r _code/dusd_lunch_menu_requirements.txt`."
    ) from exc


BASE_URL_TEMPLATE = (
    "https://www.schoolnutritionandfitness.com/schools/"
    "dusd_1401100214572158/menus/Elementary_Menu_-_{month}_{year}_-_Lunch.pdf"
)
CALENDAR_NAME = "DUSD Elementary Lunch Menu"
CALENDAR_DESCRIPTION = (
    "Daily elementary lunch menus published by Duarte Unified School District."
)
USER_AGENT = (
    "Mozilla/5.0 (compatible; tedt.org dusd-lunch-menu bot/1.0; "
    "+https://tedt.org/)"
)
DAY_PREFIX_RE = re.compile(r"^(\d{1,2})(?:\s+|$)")


@dataclass(frozen=True)
class MenuEntry:
    date: dt.date
    summary: str
    description: str
    source_url: str


def parse_args() -> argparse.Namespace:
    today = dt.date.today()
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default="dusd-lunch-menu.ics",
        help="Path to the generated iCalendar file.",
    )
    parser.add_argument(
        "--start-year",
        type=int,
        default=today.year,
        help="First year to probe for monthly menu PDFs.",
    )
    parser.add_argument(
        "--end-year",
        type=int,
        default=today.year + 1,
        help="Last year to probe for monthly menu PDFs.",
    )
    return parser.parse_args()


def iter_months(start_year: int, end_year: int) -> Iterable[tuple[int, int]]:
    for year in range(start_year, end_year + 1):
        for month in range(1, 13):
            yield year, month


def build_menu_url(year: int, month: int) -> str:
    return BASE_URL_TEMPLATE.format(month=calendar.month_name[month].upper(), year=year)


def fetch_pdf(url: str) -> bytes | None:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=60) as response:
            content_type = response.headers.get("Content-Type", "")
            if response.status != 200 or "pdf" not in content_type.lower():
                return None
            return response.read()
    except HTTPError as exc:
        if exc.code == 404:
            return None
        raise
    except URLError:
        return None


def normalize_line(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def parse_cell(cell_text: str | None, year: int, month: int, source_url: str) -> MenuEntry | None:
    if not cell_text:
        return None

    lines = [normalize_line(line) for line in cell_text.splitlines() if normalize_line(line)]
    if not lines:
        return None

    match = DAY_PREFIX_RE.match(lines[0])
    if not match:
        return None

    day = int(match.group(1))
    try:
        entry_date = dt.date(year, month, day)
    except ValueError:
        return None

    details = lines[1:]
    if not details:
        return None

    summary = details[0]
    description_lines = [
        f"Lunch: {summary}",
        f"Date: {entry_date.isoformat()}",
        "",
        "Menu details:",
    ]
    description_lines.extend(f"- {line}" for line in details)
    description_lines.extend(["", f"Source PDF: {source_url}"])

    return MenuEntry(
        date=entry_date,
        summary=summary,
        description="\n".join(description_lines),
        source_url=source_url,
    )


def parse_pdf_menu(pdf_bytes: bytes, year: int, month: int, source_url: str) -> list[MenuEntry]:
    entries_by_date: dict[dt.date, MenuEntry] = {}
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables() or []:
                for row in table:
                    if not row:
                        continue
                    for cell in row:
                        entry = parse_cell(cell, year, month, source_url)
                        if entry is None:
                            continue
                        existing = entries_by_date.get(entry.date)
                        if existing is None or len(entry.description) > len(existing.description):
                            entries_by_date[entry.date] = entry
    return sorted(entries_by_date.values(), key=lambda entry: entry.date)


def escape_ical_text(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\n", "\\n")
    )


def fold_ical_line(line: str, limit: int = 75) -> str:
    if len(line) <= limit:
        return line
    chunks = [line[:limit]]
    remaining = line[limit:]
    while remaining:
        chunks.append(f" {remaining[: limit - 1]}")
        remaining = remaining[limit - 1 :]
    return "\n".join(chunks)


def build_uid(entry: MenuEntry) -> str:
    digest = hashlib.sha1(
        f"{entry.date.isoformat()}|{entry.summary}|{entry.source_url}".encode("utf-8")
    ).hexdigest()
    return f"dusd-lunch-{digest[:16]}@tedt.org"


def event_dtstamp(entry: MenuEntry) -> str:
    return entry.date.strftime("%Y%m%dT120000Z")


def render_ics(entries: list[MenuEntry]) -> str:
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//tedt.org//DUSD Lunch Menu//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        fold_ical_line(f"X-WR-CALNAME:{escape_ical_text(CALENDAR_NAME)}"),
        fold_ical_line(f"X-WR-CALDESC:{escape_ical_text(CALENDAR_DESCRIPTION)}"),
    ]

    for entry in entries:
        next_day = entry.date + dt.timedelta(days=1)
        lines.extend(
            [
                "BEGIN:VEVENT",
                fold_ical_line(f"UID:{build_uid(entry)}"),
                f"DTSTAMP:{event_dtstamp(entry)}",
                f"DTSTART;VALUE=DATE:{entry.date.strftime('%Y%m%d')}",
                f"DTEND;VALUE=DATE:{next_day.strftime('%Y%m%d')}",
                fold_ical_line(f"SUMMARY:{escape_ical_text(entry.summary)}"),
                fold_ical_line(f"DESCRIPTION:{escape_ical_text(entry.description)}"),
                fold_ical_line(f"URL:{entry.source_url}"),
                "STATUS:CONFIRMED",
                "TRANSP:TRANSPARENT",
                "END:VEVENT",
            ]
        )

    lines.append("END:VCALENDAR")
    return "\n".join(lines) + "\n"


def collect_entries(start_year: int, end_year: int) -> list[MenuEntry]:
    entries_by_date: dict[dt.date, MenuEntry] = {}
    for year, month in iter_months(start_year, end_year):
        source_url = build_menu_url(year, month)
        pdf_bytes = fetch_pdf(source_url)
        if pdf_bytes is None:
            continue
        for entry in parse_pdf_menu(pdf_bytes, year, month, source_url):
            entries_by_date[entry.date] = entry
    return sorted(entries_by_date.values(), key=lambda entry: entry.date)


def main() -> int:
    args = parse_args()
    if args.end_year < args.start_year:
        raise SystemExit("--end-year must be greater than or equal to --start-year")

    entries = collect_entries(args.start_year, args.end_year)
    if not entries:
        raise SystemExit("No published DUSD lunch menu PDFs were found in the requested year range.")

    output_path = Path(args.output)
    output_path.write_text(render_ics(entries), encoding="utf-8")
    print(f"Wrote {len(entries)} lunch events to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())