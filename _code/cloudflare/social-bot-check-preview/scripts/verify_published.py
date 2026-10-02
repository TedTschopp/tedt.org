"""Verify initial published HTML, including the exact promoted Worker version."""

import concurrent.futures
import json
import os
import sys
import time
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urlparse

PAGE = "https://tedt.org/tools/social-bot-check.html"
LOGO = "https://tedt.org/img/Site-Logo.webp"
CHECKS = [
    ("bluesky", PAGE + "?platform=bluesky&user=tedt.org&limit=100", "account"),
    ("mastodon", PAGE + "?platform=mastodon&user=%40Ted%40tschopp.net&limit=100", "account"),
    ("another_account", PAGE + "?platform=bluesky&user=curiouscitizen.bsky.social&limit=1000", "account"),
    ("no_account", PAGE, "logo"),
    ("missing_account", PAGE + "?platform=bluesky&user=tedt-preview-account-that-does-not-exist.bsky.social", "missing"),
    ("invalid_account", PAGE + "?platform=mastodon&user=%40Ted%40127.0.0.1", "logo"),
]


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_head = False
        self.tags = {}
        self.canonical = []
        self.checker = False
        self.app = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if self.in_head and tag == "meta":
            key = attrs.get("property") or attrs.get("name")
            if key:
                self.tags.setdefault(key, []).append(attrs.get("content"))
        if self.in_head and tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        if tag == "main" and attrs.get("id") == "checker":
            self.checker = True
        if tag == "script" and attrs.get("src") == "/tools/social-bot-check/app.js":
            self.app = True

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False


def validate(name, url, kind, status, headers, html, expected_version=None):
    metadata = Metadata()
    metadata.feed(html)
    if status != 200:
        raise ValueError(f"{name}: page returned HTTP {status}")
    if metadata.canonical != [PAGE] or not metadata.checker or not metadata.app:
        raise ValueError(f"{name}: the original checker or canonical URL is missing")
    og = metadata.tags.get("og:image", [])
    twitter = metadata.tags.get("twitter:image", [])
    if len(og) != 1 or og != twitter:
        raise ValueError(f"{name}: social images must be unique and agree")
    mode = headers.get("X-Social-Bot-Check-Preview")
    version = headers.get("X-Social-Bot-Check-Preview-Version")
    if kind != "logo":
        if mode not in ("avatar", "fallback"):
            raise ValueError(f"{name}: the preview Worker did not handle this account")
        if expected_version and version != expected_version:
            raise ValueError(f"{name}: published Worker version differs from the promoted version")
        if metadata.tags.get("og:url") != [url] or metadata.tags.get("twitter:url") != [url]:
            raise ValueError(f"{name}: the sharing URL lost its account")
    if kind in ("logo", "missing") or mode == "fallback":
        if og != [LOGO]:
            raise ValueError(f"{name}: the original sharing logo is missing")
    else:
        image = urlparse(og[0])
        if mode != "avatar" or og == [LOGO] or image.scheme != "https" or not image.hostname or image.username or image.password:
            raise ValueError(f"{name}: account preview has no usable HTTPS image")
        if len(metadata.tags.get("og:image:alt", [])) != 1:
            raise ValueError(f"{name}: image alternative text is missing")
    if kind == "missing" and mode != "fallback":
        raise ValueError(f"{name}: a nonexistent account must retain the logo")
    return {"check": name, "status": status, "mode": mode, "version": version, "image": og[0]}


def check(item, expected_version):
    name, url, kind = item
    request = urllib.request.Request(url, headers={"User-Agent": "Twitterbot/1.0", "Accept": "text/html"})
    with urllib.request.urlopen(request, timeout=15) as response:
        return validate(name, url, kind, response.status, response.headers,
                        response.read().decode("utf-8"), expected_version)


def main():
    expected_version = os.environ.get("SOCIAL_PREVIEW_EXPECTED_VERSION")
    if os.environ.get("GITHUB_ACTIONS") == "true" and not expected_version:
        raise ValueError("CI verification requires the promoted Worker version ID")
    for attempt in range(3):
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                results = list(executor.map(lambda item: check(item, expected_version), CHECKS))
            avatars = [item["image"] for item in results if item["mode"] == "avatar"]
            if len(avatars) != len(set(avatars)):
                raise ValueError("Different checked accounts received the same preview image")
            print(json.dumps(results, indent=2))
            return
        except (ValueError, OSError) as error:
            if attempt == 2:
                raise
            print(f"Published metadata is not ready: {error}; retrying.", file=sys.stderr)
            time.sleep(2)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
