#!/usr/bin/env python3
"""Check preview indexing, hub destinations, and optional legacy sitemap paths."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

HUBS = ("/", "/essays/", "/stories/", "/games/", "/tools/", "/learn/",
        "/about-ted/", "/directory/", "/search/", "/subscribe/", "/tools/plotto/")


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids, self.robots, self.scripts = [], set(), [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.robots.append(attrs.get("content", "").lower())
        if tag == "script" and attrs.get("src"):
            self.scripts.append(attrs["src"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site", type=Path)
    parser.add_argument("--baseline-sitemap", type=Path, help="JSON inventory with a urls list")
    args = parser.parse_args()
    root, errors, cache = args.site.resolve(), [], {}

    def target(url):
        path = unquote(urlsplit(url).path).lstrip("/")
        file = root / path
        return file / "index.html" if file.is_dir() else file

    def document(file):
        if file not in cache:
            cache[file] = Document(file.read_text(encoding="utf-8"))
        return cache[file]

    html_files = list(root.rglob("*.html"))
    full_html = 0
    for file in html_files:
        text = file.read_text(encoding="utf-8")
        if not re.search(r"</head\s*>", text, re.I):
            continue
        full_html += 1
        doc = document(file)
        if len(doc.robots) != 1 or "noindex" not in doc.robots[0]:
            errors.append(f"Missing or conflicting noindex: {file.relative_to(root)}")
        if any(re.search(r"googletagmanager\.com|clarity\.ms|cloudflareinsights\.com/beacon", src) for src in doc.scripts):
            errors.append(f"Analytics loaded: {file.relative_to(root)}")

    checked_links = 0
    for hub in HUBS:
        file = target(hub)
        if not file.is_file():
            errors.append(f"Missing hub: {hub}")
            continue
        for href in document(file).links:
            url = urlsplit(href)
            if url.scheme or url.netloc or (url.path and not url.path.startswith("/")):
                continue
            destination = target(url.path or hub)
            checked_links += 1
            if not destination.is_file():
                errors.append(f"Missing destination on {hub}: {href}")
            elif url.fragment and destination.suffix == ".html" and unquote(url.fragment) not in document(destination).ids:
                errors.append(f"Missing anchor on {hub}: {href}")

    legacy_count = 0
    if args.baseline_sitemap:
        for url in json.loads(args.baseline_sitemap.read_text())["urls"]:
            legacy_count += 1
            if not target(url).is_file():
                errors.append(f"Legacy path missing: {urlsplit(url).path}")
    if (root / "CNAME").read_text().strip() != "preview.tedt.org":
        errors.append("Unexpected preview domain")
    if (root / "sw.js").exists():
        errors.append("Production service worker included")
    if errors:
        raise SystemExit("\n".join(errors))
    print(json.dumps({"html_noindex": full_html, "hub_links": checked_links,
                      "legacy_paths_preserved": legacy_count, "analytics": "disabled"}, indent=2))


if __name__ == "__main__":
    main()
