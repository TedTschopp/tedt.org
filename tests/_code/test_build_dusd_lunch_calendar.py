#!/usr/bin/env python3
"""Regression tests for discovery of published DUSD elementary lunch PDFs."""

from __future__ import annotations

import argparse
import datetime as dt
import importlib.util
import io
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from email.message import Message
from pathlib import Path
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "_code" / "build_dusd_lunch_calendar.py"
SPEC = importlib.util.spec_from_file_location("build_dusd_lunch_calendar", SCRIPT)
assert SPEC and SPEC.loader
builder = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = builder
SPEC.loader.exec_module(builder)

MENU_PATH = "schools/dusd_1401100214572158/menus/"
OCTOBER_FILENAME = "Elementary_Menu_-_OCTOBER_2026_-_Lunch_.pdf"
OCTOBER_URL = f"https://www.schoolnutritionandfitness.com/{MENU_PATH}{OCTOBER_FILENAME}"


class LunchMenuDiscoveryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        self.enterContext(redirect_stdout(self.stdout))
        self.enterContext(redirect_stderr(self.stderr))

    def test_discovers_published_october_lunch_pdf(self) -> None:
        html = f"""
            <a href="{MENU_PATH}Elementary_Menu_-_OCTOBER_2026_-_Breakfast.pdf">Breakfast</a>
            <a href="{MENU_PATH}{OCTOBER_FILENAME}">Lunch</a>
            <a href="{MENU_PATH}Sample_CSArts_Menu_for_SY_2026-2027_-_Lunch.pdf">CSArts</a>
            <a href="{MENU_PATH}Sample_Schedule_-_SY_2026-2027_-_AFTER_SCHOOL_SNACKS.pdf">Snacks</a>
        """
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(builder.discover_menu_urls(2026, 2027), [(2026, 10, OCTOBER_URL)])

    def test_accepts_existing_filenames_and_trailing_separators(self) -> None:
        for filename in (
            "Elementary_Menu_-_September_2026_-_Lunch.pdf",
            "_Elementary_Menu_-_APRIL_2026_-_Lunch.pdf",
            OCTOBER_FILENAME,
            "Elementary%20Menu%20-%20OCTOBER%202026%20-%20Lunch%20.PDF",
            "Elementary_Menu_-_OCTOBER_2026_-_Lunch-_.pdf?download=1",
            "Lunch_Menu_Elementary_2026-10_Revised.pdf",
            "ElemLunchMenu_Oct2026.pdf",
        ):
            with self.subTest(filename=filename):
                self.assertTrue(builder.is_elementary_lunch_menu_url(f"https://example.org/{filename}"))

    def test_rejects_other_meals_school_levels_and_non_pdf_files(self) -> None:
        for filename in (
            "Elementary_Menu_-_OCTOBER_2026_-_Breakfast.pdf",
            "Elementary_Menu_-_OCTOBER_2026_-_Breakfast_and_Lunch_.pdf",
            "High_School_Menu_-_OCTOBER_2026_-_Lunch_.pdf",
            "Elementary_Menu_-_OCTOBER_2026_-_Lunch_.pdf.html",
        ):
            with self.subTest(filename=filename):
                self.assertFalse(builder.is_elementary_lunch_menu_url(f"https://example.org/{filename}"))

    def test_filters_menus_to_requested_year_range(self) -> None:
        html = "\n".join(
            f'<a href="{OCTOBER_URL.replace("2026", str(year))}">Lunch</a>'
            for year in (2025, 2026, 2027)
        )
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(builder.discover_menu_urls(2026, 2026), [(2026, 10, OCTOBER_URL)])


    def test_uses_nested_labels_and_real_html_attributes(self) -> None:
        url = "https://example.org/menus/download?id=42&format=pdf"
        html = """
            <base href="https://example.org/menus/">
            <A HREF = 'download?id=42&amp;format=pdf#preview'>
                <strong>Elementary</strong> Lunch <span>Oct. 2026</span>
            </A>
            <a href=download?id=43 aria-label="High School Lunch October 2026"></a>
        """
        with patch.object(builder, "fetch_text", return_value=html), patch.object(builder, "fetch_pdf") as fetch:
            self.assertEqual(builder.discover_menu_urls(2026, 2027), [(2026, 10, url)])
            fetch.assert_not_called()

    def test_uses_section_headings_without_including_secondary_menus(self) -> None:
        html = """
            <h2>Elementary Menus</h2><h3>October 2026</h3>
            <a href="oct.pdf">Lunch</a>
            <a href="breakfast.pdf">Breakfast</a>
            <h2>High School Menus</h2><h3>October 2026</h3>
            <a href="secondary.pdf">Lunch</a>
        """
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(
                builder.discover_menu_urls(2026, 2027),
                [(2026, 10, "https://www.schoolnutritionandfitness.com/oct.pdf")],
            )

    def test_uses_aria_labels_image_alt_text_and_embedded_pdf_titles(self) -> None:
        html = """
            <a href="one.pdf" aria-label="Elementary Lunch October 2026"></a>
            <a href="two.pdf"><img alt="K–8 lunch Oct. 2026"></a>
            <object data="three.pdf" title="Elem. lunch 2026-10"></object>
        """
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(
                builder.discover_menu_urls(2026, 2027),
                [(2026, 10, f"https://www.schoolnutritionandfitness.com/{name}.pdf")
                 for name in ("one", "two", "three")],
            )

    def test_encodes_literal_spaces_and_preserves_query_parameters(self) -> None:
        html = """
            <a href="Elementary Lunch October 2026 .pdf?download=1&amp;view=print">PDF</a>
        """
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(
                builder.discover_menu_urls(2026, 2027),
                [(2026, 10, "https://www.schoolnutritionandfitness.com/Elementary%20Lunch%20October%202026%20.pdf?download=1&view=print")],
            )

    def test_uses_pdf_filename_supplied_by_a_download_endpoint(self) -> None:
        html = '<a href="download.php?file=Elementary_Lunch_2026-10.pdf&amp;token=public">Download</a>'
        url = "https://www.schoolnutritionandfitness.com/download.php?file=Elementary_Lunch_2026-10.pdf&token=public"
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(builder.discover_menu_urls(2026, 2027), [(2026, 10, url)])

    def test_uses_explicit_month_and_year_download_parameters(self) -> None:
        url = "https://example.org/download?school=elementary&meal=lunch&year=2026&month=10"
        html = f'<a href="{url}">Download</a>'
        with patch.object(builder, "fetch_text", return_value=html), patch.object(builder, "fetch_pdf") as fetch:
            self.assertEqual(builder.discover_menu_urls(2026, 2027), [(2026, 10, url)])
            fetch.assert_not_called()

    def test_deduplicates_urls_without_losing_descriptive_labels(self) -> None:
        html = """
            <h2>Elementary Lunch Menus</h2>
            <a href="opaque.pdf">October 2026</a>
            <a href="opaque.pdf#preview">Download lunch menu</a>
        """
        with patch.object(builder, "fetch_text", return_value=html), patch.object(builder, "fetch_pdf") as fetch:
            self.assertEqual(
                builder.discover_menu_urls(2026, 2027),
                [(2026, 10, "https://www.schoolnutritionandfitness.com/opaque.pdf")],
            )
            fetch.assert_not_called()

    def test_keeps_multiple_published_files_for_the_same_month(self) -> None:
        html = f"""
            <a href="{OCTOBER_URL}">Lunch</a>
            <a href="revised.pdf">Elementary lunch October 2026 revised</a>
        """
        with patch.object(builder, "fetch_text", return_value=html):
            self.assertEqual(len(builder.discover_menu_urls(2026, 2027)), 2)

    def test_reads_missing_dates_from_pdf_text_and_reuses_the_download(self) -> None:
        url = "https://www.schoolnutritionandfitness.com/opaque.pdf"
        html = '<a href="opaque.pdf">Elementary Lunch Menu</a>'
        pdf_bytes = b"%PDF-test-document"
        pdf = MagicMock()
        page = MagicMock()
        page.extract_text.return_value = "Elementary Lunch Menu\nOctober 2026"
        pdf.__enter__.return_value.pages = [page]
        entry = builder.MenuEntry(dt.date(2026, 10, 1), "Lunch", "Lunch details", url)
        with (
            patch.object(builder, "fetch_text", return_value=html),
            patch.object(builder, "fetch_pdf", return_value=pdf_bytes) as fetch,
            patch.object(builder.pdfplumber, "open", return_value=pdf),
            patch.object(builder, "parse_pdf_menu", return_value=[entry]) as parse,
        ):
            self.assertEqual(builder.collect_entries(2026, 2027), [entry])
            fetch.assert_called_once_with(url)
            parse.assert_called_once_with(pdf_bytes, 2026, 10, url)

    def test_does_not_guess_a_missing_or_ambiguous_year(self) -> None:
        html = '<a href="opaque.pdf">Elementary Lunch Menu</a>'
        for pdf_text in ("October", "October 2026 and November 2026", "School Year 2026-2027"):
            with self.subTest(pdf_text=pdf_text):
                pdf = MagicMock()
                page = MagicMock()
                page.extract_text.return_value = pdf_text
                pdf.__enter__.return_value.pages = [page]
                with (
                    patch.object(builder, "fetch_text", return_value=html),
                    patch.object(builder, "fetch_pdf", return_value=b"%PDF-fixture"),
                    patch.object(builder.pdfplumber, "open", return_value=pdf),
                ):
                    self.assertEqual(builder.discover_menu_urls(2026, 2027), [])
        self.assertIn("Could not determine an unambiguous month and year", self.stderr.getvalue())

    def test_bad_pdf_does_not_hide_another_published_menu(self) -> None:
        html = f'<a href="{OCTOBER_URL}">Lunch</a><a href="broken.pdf">Elementary Lunch October 2026</a>'
        entry = builder.MenuEntry(dt.date(2026, 10, 1), "Lunch", "Lunch details", OCTOBER_URL)

        def parse(pdf_bytes: bytes, year: int, month: int, url: str) -> list:
            if url.endswith("broken.pdf"):
                raise builder.PDFException("Broken PDF")
            return [entry]

        with (
            patch.object(builder, "fetch_text", return_value=html),
            patch.object(builder, "fetch_pdf", return_value=b"%PDF-fixture"),
            patch.object(builder, "parse_pdf_menu", side_effect=parse),
        ):
            self.assertEqual(builder.collect_entries(2026, 2027), [entry])
        self.assertIn("Could not parse published menu", self.stderr.getvalue())

    def test_failed_build_preserves_existing_calendar_and_reports_the_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "menu.ics"
            output.write_text("previous calendar", encoding="utf-8")
            args = argparse.Namespace(output=str(output), start_year=2026, end_year=2027)
            with patch.object(builder, "parse_args", return_value=args), patch.object(builder, "collect_entries", return_value=[]):
                with self.assertRaisesRegex(SystemExit, "No DUSD elementary lunch events") as error:
                    builder.main()
            self.assertIn(builder.MENUS_PAGE_URL, str(error.exception))
            self.assertEqual(output.read_text(encoding="utf-8"), "previous calendar")


class MenuDateTests(unittest.TestCase):
    def test_accepts_unambiguous_named_numeric_and_reordered_dates(self) -> None:
        for date_text in (
            "OCTOBER_2026", "Oct. 2026", "2026-October", "2026-10", "10-2026",
            "Oct2026", "ElementaryLunchOctober2026", "OctoberLunch2026",
            "October Elementary Lunch Menu (2026)", "October 2026 School Year 2026-2027",
        ):
            with self.subTest(date_text=date_text):
                self.assertEqual(builder.parse_menu_date(date_text), (2026, 10))

    def test_rejects_ambiguous_dates_invalid_months_and_yearless_menus(self) -> None:
        for date_text in ("October", "October 26", "2026-13", "2026-2027", "October 2026 November 2026"):
            with self.subTest(date_text=date_text):
                self.assertIsNone(builder.parse_menu_date(date_text))


class MenuDownloadTests(unittest.TestCase):
    def setUp(self) -> None:
        self.stderr = io.StringIO()
        self.enterContext(redirect_stderr(self.stderr))

    def response(self, content_type: str, body: bytes) -> MagicMock:
        response = MagicMock()
        response.status = 200
        response.headers = Message()
        response.headers["Content-Type"] = content_type
        response.read.return_value = body
        response.__enter__.return_value = response
        return response

    def test_accepts_pdf_bytes_with_a_generic_download_content_type(self) -> None:
        body = b"%PDF-1.6\nexample"
        with patch.object(builder, "urlopen", return_value=self.response("application/octet-stream", body)):
            self.assertEqual(builder.fetch_pdf(OCTOBER_URL), body)

    def test_rejects_html_even_when_the_server_calls_it_a_pdf(self) -> None:
        with patch.object(builder, "urlopen", return_value=self.response("application/pdf", b"<html>Error</html>")):
            self.assertIsNone(builder.fetch_pdf(OCTOBER_URL))
        self.assertIn("did not return a PDF", self.stderr.getvalue())

    def test_reports_download_errors(self) -> None:
        for error in (HTTPError(OCTOBER_URL, 404, "Not found", None, None), URLError("Offline"), TimeoutError("Timed out")):
            with self.subTest(error=error), patch.object(builder, "urlopen", side_effect=error):
                self.assertIsNone(builder.fetch_pdf(OCTOBER_URL))
        self.assertIn("Could not fetch published PDF", self.stderr.getvalue())

    def test_reports_menu_page_errors(self) -> None:
        with patch.object(builder, "urlopen", side_effect=URLError("Offline")):
            self.assertIsNone(builder.fetch_text(builder.MENUS_PAGE_URL))
        self.assertIn("Could not fetch menu page", self.stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
