#!/usr/bin/env python3
"""Build a Markdown JavaScript inventory report for Fantasy Name Generator URLs.

Reads newline-separated page URLs from an input file, fetches each page, extracts
external script src references, computes common scripts across all successful pages,
and computes per-page unique scripts.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import socket
import threading
import time
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Sequence, Set, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen


DEFAULT_INPUT = "tools/Name-Generator.html"
DEFAULT_OUTPUT = "tools/name-generator-js-report.md"
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36"
)


@dataclass
class UrlLoadStats:
    total_lines: int
    valid_urls: List[str]
    invalid_lines: List[Tuple[int, str]]
    duplicate_count: int


@dataclass
class FetchResult:
    url: str
    ok: bool
    status_code: int | None
    error: str | None
    generator_name: str | None
    scripts: List[str]


class ScriptSrcParser(HTMLParser):
    """Collect script src attributes from HTML."""

    def __init__(self) -> None:
        super().__init__()
        self.script_srcs: List[str] = []

    def handle_starttag(self, tag: str, attrs: Sequence[Tuple[str, str | None]]) -> None:
        if tag.lower() != "script":
            return
        for key, value in attrs:
            if key.lower() == "src" and value:
                self.script_srcs.append(value.strip())


class ContentDivH1Parser(HTMLParser):
    """Extract the first h1 text inside a div with id/class contentdiv."""

    def __init__(self) -> None:
        super().__init__()
        self._contentdiv_depth = 0
        self._capturing_h1 = False
        self._chunks: List[str] = []
        self.name: str | None = None

    def handle_starttag(self, tag: str, attrs: Sequence[Tuple[str, str | None]]) -> None:
        attrs_map = {k.lower(): (v or "") for k, v in attrs}
        tag_lower = tag.lower()

        if tag_lower == "div":
            div_id = attrs_map.get("id", "")
            div_class = attrs_map.get("class", "")
            class_values = {part.strip() for part in div_class.split() if part.strip()}
            if div_id == "contentdiv" or "contentdiv" in class_values:
                self._contentdiv_depth += 1

        if self._contentdiv_depth > 0 and tag_lower == "h1" and self.name is None:
            self._capturing_h1 = True

    def handle_endtag(self, tag: str) -> None:
        tag_lower = tag.lower()
        if tag_lower == "h1" and self._capturing_h1:
            text = " ".join("".join(self._chunks).split())
            self.name = text if text else None
            self._chunks = []
            self._capturing_h1 = False
            return

        if tag_lower == "div" and self._contentdiv_depth > 0:
            self._contentdiv_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._capturing_h1:
            self._chunks.append(data)


class RateLimiter:
    """Simple global request pacing across worker threads."""

    def __init__(self, delay_ms: int) -> None:
        self.delay_seconds = max(0.0, delay_ms / 1000.0)
        self._lock = threading.Lock()
        self._next_allowed = 0.0

    def wait(self) -> None:
        if self.delay_seconds <= 0:
            return
        with self._lock:
            now = time.monotonic()
            if now < self._next_allowed:
                time.sleep(self._next_allowed - now)
            self._next_allowed = time.monotonic() + self.delay_seconds


def is_probably_php_url(value: str) -> bool:
    try:
        parts = urlsplit(value)
    except ValueError:
        return False
    if parts.scheme not in {"http", "https"}:
        return False
    if not parts.netloc:
        return False
    return parts.path.endswith(".php")


def load_urls(input_path: Path) -> UrlLoadStats:
    total_lines = 0
    invalid_lines: List[Tuple[int, str]] = []
    valid_urls: List[str] = []
    seen: Set[str] = set()
    duplicate_count = 0

    for line_number, raw_line in enumerate(input_path.read_text(encoding="utf-8").splitlines(), start=1):
        total_lines += 1
        value = raw_line.strip()
        if not value:
            continue
        if not is_probably_php_url(value):
            invalid_lines.append((line_number, value))
            continue
        if value in seen:
            duplicate_count += 1
            continue
        seen.add(value)
        valid_urls.append(value)

    return UrlLoadStats(
        total_lines=total_lines,
        valid_urls=valid_urls,
        invalid_lines=invalid_lines,
        duplicate_count=duplicate_count,
    )


def normalize_script_url(script_url: str, page_url: str, strip_query: bool) -> str:
    absolute = urljoin(page_url, script_url)
    parts = urlsplit(absolute)
    query = "" if strip_query else parts.query
    normalized = urlunsplit((parts.scheme, parts.netloc, parts.path, query, ""))
    return normalized


def parse_page(page_url: str, html: str, strip_query: bool) -> Tuple[str | None, List[str]]:
    parser = ScriptSrcParser()
    parser.feed(html)
    title_parser = ContentDivH1Parser()
    title_parser.feed(html)
    scripts = {
        normalize_script_url(script_url=src, page_url=page_url, strip_query=strip_query)
        for src in parser.script_srcs
        if src
    }
    return title_parser.name, sorted(scripts)


def should_retry_http_status(status_code: int) -> bool:
    return status_code == 429 or 500 <= status_code <= 599


def fetch_with_retries(
    url: str,
    timeout: float,
    retries: int,
    backoff_seconds: float,
    user_agent: str,
    strip_query: bool,
    limiter: RateLimiter,
) -> FetchResult:
    last_error: str | None = None
    last_status: int | None = None

    for attempt in range(retries + 1):
        try:
            limiter.wait()
            request = Request(url, headers={"User-Agent": user_agent})
            with urlopen(request, timeout=timeout) as response:
                status = getattr(response, "status", None)
                payload = response.read()
                html = payload.decode("utf-8", errors="ignore")
                generator_name, scripts = parse_page(page_url=url, html=html, strip_query=strip_query)
                return FetchResult(
                    url=url,
                    ok=True,
                    status_code=status,
                    error=None,
                    generator_name=generator_name,
                    scripts=scripts,
                )
        except HTTPError as exc:
            last_status = exc.code
            last_error = f"HTTP {exc.code}"
            if attempt < retries and should_retry_http_status(exc.code):
                time.sleep(backoff_seconds * (2 ** attempt))
                continue
            break
        except (URLError, TimeoutError, socket.timeout, ValueError) as exc:
            last_error = str(exc)
            if attempt < retries:
                time.sleep(backoff_seconds * (2 ** attempt))
                continue
            break

    return FetchResult(
        url=url,
        ok=False,
        status_code=last_status,
        error=last_error,
        generator_name=None,
        scripts=[],
    )


def php_file_from_url(url: str) -> str:
    path = urlsplit(url).path
    return Path(path).name or path


def analyze_results(results: Dict[str, FetchResult], ordered_urls: Sequence[str]) -> Tuple[Set[str], Dict[str, List[str]], Dict[str, int]]:
    successful_urls = [url for url in ordered_urls if results[url].ok]
    script_sets: Dict[str, Set[str]] = {url: set(results[url].scripts) for url in successful_urls}

    if successful_urls:
        common_scripts = set(script_sets[successful_urls[0]])
        for url in successful_urls[1:]:
            common_scripts.intersection_update(script_sets[url])
    else:
        common_scripts = set()

    script_counts: Dict[str, int] = {}
    for url in successful_urls:
        for script in script_sets[url]:
            script_counts[script] = script_counts.get(script, 0) + 1

    unique_by_url: Dict[str, List[str]] = {}
    for url in ordered_urls:
        if not results[url].ok:
            unique_by_url[url] = []
            continue
        unique_by_url[url] = sorted([script for script in results[url].scripts if script_counts.get(script, 0) == 1])

    return common_scripts, unique_by_url, script_counts


def build_markdown(
    input_path: Path,
    load_stats: UrlLoadStats,
    ordered_urls: Sequence[str],
    results: Dict[str, FetchResult],
    common_scripts: Set[str],
    unique_by_url: Dict[str, List[str]],
    include_common_section: bool,
) -> str:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    success_count = sum(1 for url in ordered_urls if results[url].ok)
    failure_count = len(ordered_urls) - success_count

    all_success_scripts: Set[str] = set()
    for url in ordered_urls:
        if results[url].ok:
            all_success_scripts.update(results[url].scripts)

    lines: List[str] = []
    lines.append("# JavaScript Inventory Report")
    lines.append("")
    lines.append(f"Generated: `{now}`")
    lines.append("")
    lines.append("## Summary")
    lines.append(f"- Input file: `{input_path}`")
    lines.append(f"- Total lines read: `{load_stats.total_lines}`")
    lines.append(f"- Valid PHP URLs analyzed: `{len(ordered_urls)}`")
    lines.append(f"- Duplicate URLs skipped: `{load_stats.duplicate_count}`")
    lines.append(f"- Invalid lines skipped: `{len(load_stats.invalid_lines)}`")
    lines.append(f"- Successful fetches: `{success_count}`")
    lines.append(f"- Failed fetches: `{failure_count}`")
    lines.append(f"- Distinct JS files across successful pages: `{len(all_success_scripts)}`")
    lines.append(f"- JS files common across all successful pages: `{len(common_scripts)}`")

    if load_stats.invalid_lines:
        lines.append("")
        lines.append("## Invalid Input Lines")
        for line_number, value in load_stats.invalid_lines:
            lines.append(f"- Line {line_number}: `{value}`")

    if include_common_section:
        lines.append("")
        lines.append("## JavaScript Files Common Across All Successfully Fetched Pages")
        if common_scripts:
            for script in sorted(common_scripts):
                lines.append(f"- `{script}`")
        else:
            lines.append("- (none)")

    lines.append("")
    lines.append("")
    lines.append("## Generator Table")
    lines.append("")
    lines.append("| Generator | PHP File | Unique JavaScript |")
    lines.append("|---|---|---|")

    for url in ordered_urls:
        result = results[url]
        php_file = php_file_from_url(url)

        if not result.ok:
            status_text = f"HTTP {result.status_code}" if result.status_code else "no-status"
            error_text = result.error or "unknown-error"
            generator_name = "(fetch failed)"
            unique_js_cell = f"(fetch failed: {status_text}; {error_text})"
        else:
            generator_name = result.generator_name or "(name not found)"
            if unique_by_url[url]:
                unique_js_cell = "<br>".join(f"`{script}`" for script in unique_by_url[url])
            else:
                unique_js_cell = "(no unique JavaScript files)"

        lines.append(f"| {generator_name} | `{php_file}` | {unique_js_cell} |")

    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Fetch each URL in a newline-separated list and build a Markdown report "
            "of common and per-page unique JavaScript files."
        )
    )
    parser.add_argument("--input", default=DEFAULT_INPUT, help="Input file containing URLs (default: tools/Name-Generator.html)")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Markdown output path")
    parser.add_argument("--timeout", type=float, default=15.0, help="Per-request timeout in seconds")
    parser.add_argument("--retries", type=int, default=2, help="Retry attempts per URL after first try")
    parser.add_argument("--backoff", type=float, default=1.5, help="Base exponential backoff in seconds")
    parser.add_argument("--workers", type=int, default=8, help="Concurrent worker threads")
    parser.add_argument("--delay-ms", type=int, default=100, help="Global delay between requests in milliseconds")
    parser.add_argument("--user-agent", default=DEFAULT_USER_AGENT, help="HTTP User-Agent header")
    parser.add_argument("--strip-query", action="store_true", help="Drop query strings when comparing/reporting JS URLs")
    parser.add_argument("--max-urls", type=int, default=0, help="Optional cap for testing (0 means no cap)")
    parser.add_argument(
        "--no-common-section",
        action="store_true",
        help="Skip the global section listing JavaScript files common across all successful pages",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    load_stats = load_urls(input_path)
    ordered_urls = load_stats.valid_urls

    if args.max_urls > 0:
        ordered_urls = ordered_urls[: args.max_urls]

    limiter = RateLimiter(delay_ms=args.delay_ms)

    results: Dict[str, FetchResult] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = {
            executor.submit(
                fetch_with_retries,
                url,
                args.timeout,
                max(0, args.retries),
                max(0.0, args.backoff),
                args.user_agent,
                args.strip_query,
                limiter,
            ): url
            for url in ordered_urls
        }

        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            results[result.url] = result

    common_scripts, unique_by_url, _script_counts = analyze_results(results=results, ordered_urls=ordered_urls)

    markdown = build_markdown(
        input_path=input_path,
        load_stats=load_stats,
        ordered_urls=ordered_urls,
        results=results,
        common_scripts=common_scripts,
        unique_by_url=unique_by_url,
        include_common_section=not args.no_common_section,
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")

    print(f"Wrote report: {output_path}")
    print(f"URLs analyzed: {len(ordered_urls)}")
    print(f"Successful fetches: {sum(1 for u in ordered_urls if results[u].ok)}")
    print(f"Failed fetches: {sum(1 for u in ordered_urls if not results[u].ok)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
