import importlib.util
import unittest
from pathlib import Path

script = Path(__file__).resolve().parents[1] / "scripts" / "verify_published.py"
spec = importlib.util.spec_from_file_location("verify_published", script)
verify = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verify)

VERSION = "975b9fec-49ac-4f5f-97aa-f8d16e89ca7a"
URL = verify.PAGE + "?platform=bluesky&user=tedt.org&limit=100"
AVATAR = "https://cdn.bsky.app/avatar.png"


def html(image=AVATAR, social_url=URL, extra="", body=True):
    return f'''<html><head><link rel="canonical" href="{verify.PAGE}">
    <meta property="og:url" content="{social_url}">
    <meta name="twitter:url" content="{social_url}">
    <meta property="og:image" content="{image}">
    <meta name="twitter:image" content="{image}">
    <meta property="og:image:alt" content="@tedt.org on Bluesky profile picture">
    {extra}</head><body>{'<main id="checker"></main><script src="/tools/social-bot-check/app.js"></script>' if body else ''}</body></html>'''


class PublishedMetadataTests(unittest.TestCase):
    def validate(self, content, kind="account", mode="avatar", version=VERSION):
        return verify.validate("fixture", URL, kind, 200, {
            "X-Social-Bot-Check-Preview": mode,
            "X-Social-Bot-Check-Preview-Version": version,
        }, content, VERSION)

    def test_matching_avatar_and_promoted_version_pass(self):
        self.assertEqual(self.validate(html())["image"], AVATAR)

    def test_http_success_does_not_hide_an_old_or_missing_worker(self):
        for version in (None, "old-version"):
            with self.assertRaises(ValueError):
                self.validate(html(), version=version)
        with self.assertRaises(ValueError):
            self.validate(html(), mode=None)

    def test_lost_checker_or_account_metadata_fails(self):
        for content in (html(body=False), html(social_url=verify.PAGE)):
            with self.assertRaises(ValueError):
                self.validate(content)

    def test_duplicate_or_insecure_image_metadata_fails(self):
        for content in (html(extra=f'<meta property="og:image" content="{AVATAR}">'),
                        html(image="http://example.com/avatar.png"),
                        html(image="https://user:password@example.com/avatar.png")):
            with self.assertRaises(ValueError):
                self.validate(content)

    def test_graceful_api_fallback_is_healthy_when_it_retains_the_logo(self):
        self.assertEqual(self.validate(html(image=verify.LOGO), mode="fallback")["mode"], "fallback")
        with self.assertRaises(ValueError):
            self.validate(html(), mode="fallback")

    def test_missing_account_and_unparameterized_links_keep_the_original_logo(self):
        self.validate(html(image=verify.LOGO), kind="missing", mode="fallback")
        self.validate(html(image=verify.LOGO, social_url=verify.PAGE), kind="logo", mode=None, version=None)
        with self.assertRaises(ValueError):
            self.validate(html(), kind="logo", mode=None, version=None)


if __name__ == "__main__":
    unittest.main()
