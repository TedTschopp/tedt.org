import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('site_analytics', Path(__file__).parents[1] / 'scripts/site_analytics.py')
analytics = importlib.util.module_from_spec(spec)
spec.loader.exec_module(analytics)

class AnalyticsBuildTests(unittest.TestCase):
    def test_migration_is_idempotent_and_preserves_application(self):
        source = '''<!doctype html><html><head><script src="https://www.googletagmanager.com/gtag/js?id=OLD"></script>
        <script src="/js/main-site-analytics.js"></script><script>var endpoint="https://www.clarity.ms/tag/";</script>
        <script src="/app.js"></script></head><body><h1>Preserve me</h1></body></html>'''
        result = analytics.transform(source)
        self.assertEqual(result, analytics.transform(result))
        self.assertEqual([], analytics.check(result))
        self.assertIn('<script src="/app.js"></script>', result)
        self.assertIn('<h1>Preserve me</h1>', result)
        self.assertNotIn('id=OLD', result)

    def test_private_content_is_masked_before_deferred_script(self):
        source = '<html><head></head><body><div data-clarity-unmask="true">Private content</div></body></html>'
        result = analytics.transform(source, True)
        self.assertIn('<html data-clarity-mask="true">', result)
        self.assertNotIn('data-clarity-unmask', result)
        self.assertEqual([], analytics.check(result, True))
        self.assertEqual(result, analytics.transform(result, True))

    def test_csp_retains_authorization_and_embedding_boundaries(self):
        original = "default-src 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self'"
        result = analytics.csp(original)
        self.assertIn("form-action 'self'", result)
        self.assertIn("frame-ancestors 'none'", result)
        self.assertIn('https://cloudflareinsights.com', result)
        self.assertNotIn("default-src *", result)
        self.assertEqual(result, analytics.csp(result))

    def test_fragments_and_redirect_stubs_are_excluded(self):
        self.assertFalse(analytics.eligible('<p>Fragment</p>'))
        self.assertFalse(analytics.eligible('<html><head><meta http-equiv="refresh" content="0;url=/new/"></head></html>'))
        self.assertTrue(analytics.eligible('<!doctype html><html><head></head><body>404</body></html>'))

    def test_check_rejects_missing_duplicate_and_competing_collectors(self):
        source = analytics.transform('<html><head></head><body></body></html>')
        self.assertTrue(analytics.check('<html></html>'))
        self.assertTrue(analytics.check(source.replace('</head>', analytics.EMBED.search(source).group() + '</head>')))
        self.assertTrue(analytics.check(source.replace('</head>', '<script src="https://www.clarity.ms/tag/other"></script></head>')))

if __name__ == '__main__': unittest.main()
