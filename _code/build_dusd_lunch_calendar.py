#!/usr/bin/env python3
"""Build an iCalendar feed for Duarte USD elementary lunch menus.

The source menus are monthly PDFs hosted by School Nutrition and Fitness.
This script follows published links, identifies menus from their filenames,
labels and section headings, and reads PDF text when link dates are missing.
It writes one all-day event per lunch menu day for the requested year range.

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
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qsl, quote, unquote, urldefrag, urljoin, urlparse
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

try:
    import pdfplumber
    from pdfminer.pdfdocument import PDFException
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: pdfplumber. Install it with `pip install -r _code/dusd_lunch_menu_requirements.txt`."
    ) from exc


MENUS_PAGE_URL = "https://www.schoolnutritionandfitness.com/index.php?sid=1401100214572158&page=menus"
CALENDAR_NAME = "DUSD Elementary Lunch Menu"
CALENDAR_DESCRIPTION = (
    "Daily elementary lunch menus published by Duarte Unified School District."
)
USER_AGENT = (
    "Mozilla/5.0 (compatible; tedt.org dusd-lunch-menu bot/1.0; "
    "+https://tedt.org/)"
)
DAY_PREFIX_RE = re.compile(r"^(\d{1,2})(?:\s+|$)")
MONTH_NUMBERS = {
    name.lower(): month
    for month in range(1, 13)
    for name in (calendar.month_name[month], calendar.month_abbr[month])
}
MONTH_NUMBERS["sept"] = 9
MONTH_PATTERN = "|".join(sorted(MONTH_NUMBERS, key=len, reverse=True))
MONTH_YEAR_RE = re.compile(
    rf"(?<![a-z])({MONTH_PATTERN})[\s,._/-]*(20\d{{2}})(?!\d)", re.IGNORECASE
)
YEAR_MONTH_RE = re.compile(
    rf"(?<!\d)(20\d{{2}})[\s,._/-]+({MONTH_PATTERN})(?![a-z])", re.IGNORECASE
)
NUMERIC_YEAR_MONTH_RE = re.compile(r"(?<!\d)(20\d{2})\s*[-_./]\s*(0?[1-9]|1[0-2])(?!\d)")
NUMERIC_MONTH_YEAR_RE = re.compile(r"(?<!\d)(0?[1-9]|1[0-2])\s*[-_./]\s*(20\d{2})(?!\d)")
MONTH_NAME_RE = re.compile(rf"(?<![a-z])({MONTH_PATTERN})(?![a-z])", re.IGNORECASE)
ELEMENTARY_RE = re.compile(r"\b(?:elementary|elem|k (?:5|6|8))\b")
SECONDARY_RE = re.compile(r"\b(?:high school|middle school|secondary|csarts|dhs|mit)\b")
OTHER_MEAL_RE = re.compile(r"\b(?:breakfast|snack|snacks|supper|dinner)\b")


@dataclass(frozen=True)
class MenuEntry:
    date: dt.date
    summary: str
    description: str
    source_url: str


@dataclass(frozen=True)
class MenuLink:
    url: str
    label: str
    context: str = ""


class MenuLinksParser(HTMLParser):
    """Read real link attributes and visible labels, including section headings."""

    def __init__(self, base_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.base_url = base_url
        self.links: list[MenuLink] = []
        self.headings: dict[int, str] = {}
        self.heading_level: int | None = None
        self.heading_text: list[str] = []
        self.anchor_href: str | None = None
        self.anchor_text: list[str] = []
        self.anchor_context = ""

    def add_link(self, href: str, label: str, context: str) -> None:
        url = urldefrag(urljoin(self.base_url, href.strip()))[0]
        url = quote(url, safe=":/?@!$&'()*+,;=%[]")
        if urlparse(url).scheme in ("http", "https"):
            self.links.append(MenuLink(url, normalize_line(label), context))

    def finish_anchor(self) -> None:
        if self.anchor_href is not None:
            self.add_link(self.anchor_href, " ".join(self.anchor_text), self.anchor_context)
        self.anchor_href = None
        self.anchor_text = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        context = " ".join(self.headings[level] for level in sorted(self.headings))
        label = " ".join(attributes.get(key) or "" for key in ("title", "aria-label"))
        if tag == "base" and attributes.get("href"):
            self.base_url = urljoin(self.base_url, attributes["href"])
        elif re.fullmatch(r"h[1-6]", tag):
            self.heading_level = int(tag[1])
            self.headings = {level: text for level, text in self.headings.items() if level < self.heading_level}
            self.heading_text = []
        elif tag == "a" and attributes.get("href"):
            self.finish_anchor()
            self.anchor_href = attributes["href"]
            self.anchor_text = [label]
            self.anchor_context = context
        elif tag == "img" and self.anchor_href is not None:
            self.anchor_text.append(attributes.get("alt") or "")
        elif tag in ("iframe", "embed", "object"):
            href = attributes.get("data" if tag == "object" else "src")
            if href:
                self.add_link(href, label, context)

    def handle_data(self, data: str) -> None:
        if self.anchor_href is not None:
            self.anchor_text.append(data)
        if self.heading_level is not None:
            self.heading_text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "a":
            self.finish_anchor()
        if self.heading_level is not None and tag == f"h{self.heading_level}":
            self.headings[self.heading_level] = normalize_line(" ".join(self.heading_text))
            self.heading_level = None

    def close(self) -> None:
        super().close()
        self.finish_anchor()


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
        help="First year to include from published monthly menu PDFs.",
    )
    parser.add_argument(
        "--end-year",
        type=int,
        default=today.year + 1,
        help="Last year to include from published monthly menu PDFs.",
    )
    return parser.parse_args()


def fetch_text(url: str) -> str | None:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=60) as response:
            if response.status != 200:
                return None
            charset = response.headers.get_content_charset() or "utf-8"
            return response.read().decode(charset, errors="replace")
    except (HTTPError, URLError, TimeoutError) as exc:
        print(f"Could not fetch menu page {url}: {exc}", file=sys.stderr)
        return None


def fetch_pdf(url: str) -> bytes | None:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=60) as response:
            if response.status != 200:
                return None
            data = response.read()
            # Some download endpoints send PDFs as application/octet-stream.
            if not data.lstrip().startswith(b"%PDF-"):
                print(f"Published menu link did not return a PDF: {url}", file=sys.stderr)
                return None
            return data
    except (HTTPError, URLError, TimeoutError) as exc:
        print(f"Could not fetch published PDF {url}: {exc}", file=sys.stderr)
        return None


def menu_url_text(url: str) -> str:
    parsed = urlparse(url)
    parameters = parse_qsl(parsed.query)
    text = " ".join([Path(unquote(parsed.path)).name, *(value for _, value in parameters)])
    months = {value for key, value in parameters if key.lower() == "month"}
    years = {value for key, value in parameters if key.lower() == "year"}
    if len(months) == len(years) == 1:
        text += f" {next(iter(months))}-{next(iter(years))}"
    return text


def menu_words(text: str) -> str:
    text = re.sub(r"(?<=[a-z])(?=[A-Z])|(?<=[a-zA-Z])(?=\d)|(?<=\d)(?=[a-zA-Z])", " ", text)
    return " ".join(re.findall(r"[a-z0-9]+", text.lower()))


def is_elementary_lunch_menu_url(url: str, label: str = "", context: str = "") -> bool:
    filename = Path(unquote(urlparse(url).path)).name.lower()
    if ".pdf" in filename and not filename.endswith(".pdf"):
        return False
    direct = menu_words(f"{menu_url_text(url)} {label}")
    surrounding = menu_words(context)
    # Explicit link information takes precedence over a broad page heading.
    school = direct if ELEMENTARY_RE.search(direct) or SECONDARY_RE.search(direct) else surrounding
    meal = direct if re.search(r"\blunch\b", direct) or OTHER_MEAL_RE.search(direct) else surrounding
    return bool(
        ELEMENTARY_RE.search(school)
        and not SECONDARY_RE.search(school)
        and re.search(r"\blunch\b", meal)
        and not OTHER_MEAL_RE.search(meal)
    )


def parse_menu_date(text: str) -> tuple[int, int] | None:
    """Accept named or numeric month/year formats; never guess ambiguous dates."""
    text = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", text)
    dates = {(int(year), MONTH_NUMBERS[month.lower()]) for month, year in MONTH_YEAR_RE.findall(text)}
    dates.update((int(year), MONTH_NUMBERS[month.lower()]) for year, month in YEAR_MONTH_RE.findall(text))
    dates.update((int(year), int(month)) for year, month in NUMERIC_YEAR_MONTH_RE.findall(text))
    dates.update((int(year), int(month)) for month, year in NUMERIC_MONTH_YEAR_RE.findall(text))
    if not dates:
        months = {MONTH_NUMBERS[month.lower()] for month in MONTH_NAME_RE.findall(text)}
        years = {int(year) for year in re.findall(r"(?<!\d)(20\d{2})(?!\d)", text)}
        if len(months) == len(years) == 1:
            dates.add((years.pop(), months.pop()))
    return next(iter(dates)) if len(dates) == 1 else None


def parse_menu_year_month(url: str) -> tuple[int, int] | None:
    return parse_menu_date(menu_url_text(url))


def parse_pdf_year_month(pdf_bytes: bytes) -> tuple[int, int] | None:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages[:2])
    return parse_menu_date(text)


def discover_menu_urls(
    start_year: int, end_year: int, pdf_cache: dict[str, bytes] | None = None
) -> list[tuple[int, int, str]]:
    html = fetch_text(MENUS_PAGE_URL)
    if not html:
        return []

    parser = MenuLinksParser(MENUS_PAGE_URL)
    parser.feed(html)
    parser.close()
    links: dict[str, MenuLink] = {}
    for link in parser.links:
        if is_elementary_lunch_menu_url(link.url, link.label, link.context):
            existing = links.get(link.url)
            if existing is not None:
                link = MenuLink(link.url, f"{existing.label} {link.label}", f"{existing.context} {link.context}")
            links[link.url] = link

    print(f"Found {len(links)} published elementary lunch menu link(s) at {MENUS_PAGE_URL}")
    discovered: list[tuple[int, int, str]] = []
    for link in links.values():
        direct_text = f"{menu_url_text(link.url)} {link.label}"
        parsed = parse_menu_date(direct_text) or parse_menu_date(f"{direct_text} {link.context}")
        if parsed is None:
            pdf_bytes = fetch_pdf(link.url)
            if pdf_bytes is not None:
                if pdf_cache is not None:
                    pdf_cache[link.url] = pdf_bytes
                try:
                    parsed = parse_pdf_year_month(pdf_bytes)
                except PDFException as exc:
                    print(f"Could not read menu date from {link.url}: {exc}", file=sys.stderr)
        if parsed is None:
            print(f"Could not determine an unambiguous month and year for {link.url}", file=sys.stderr)
            continue

        year, month = parsed
        if start_year <= year <= end_year:
            discovered.append((year, month, link.url))

    # Keep distinct files and their page order so one dead link cannot hide another.
    return sorted(discovered, key=lambda source: source[:2])


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
    pdf_cache: dict[str, bytes] = {}
    for year, month, source_url in discover_menu_urls(start_year, end_year, pdf_cache):
        pdf_bytes = pdf_cache.get(source_url)
        if pdf_bytes is None:
            pdf_bytes = fetch_pdf(source_url)
        if pdf_bytes is None:
            continue
        try:
            entries = parse_pdf_menu(pdf_bytes, year, month, source_url)
        except PDFException as exc:
            print(f"Could not parse published menu {source_url}: {exc}", file=sys.stderr)
            continue
        print(f"Parsed {len(entries)} lunch events for {year}-{month:02d} from {source_url}")
        for entry in entries:
            entries_by_date[entry.date] = entry
    return sorted(entries_by_date.values(), key=lambda entry: entry.date)


def main() -> int:
    args = parse_args()
    if args.end_year < args.start_year:
        raise SystemExit("--end-year must be greater than or equal to --start-year")

    entries = collect_entries(args.start_year, args.end_year)
    if not entries:
        raise SystemExit(
            f"No DUSD elementary lunch events could be parsed for {args.start_year}-{args.end_year}. "
            f"Check the discovery and download messages above. Published menus: {MENUS_PAGE_URL}"
        )

    output_path = Path(args.output)
    output_path.write_text(render_ics(entries), encoding="utf-8")
    print(f"Wrote {len(entries)} lunch events to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
