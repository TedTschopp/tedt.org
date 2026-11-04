import datetime as dt
import http.server
import json
import threading
import unittest
from unittest.mock import patch

import check_services as check


class Fixture(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        status, mime, body = {
            '/asset': (200, 'text/html', b'<!doctype html><title>Fallback</title>'),
            '/good.css': (200, 'text/css', b'body { color: black; }'),
            '/invalid-json': (200, 'application/jrd+json', b'{"links": []}'),
            '/webfinger': (200, 'application/jrd+json', b'{"subject":"acct:test@example.org","links":[{"rel":"self"}]}'),
            '/redirect': (301, 'text/html', b''),
        }[self.path]
        self.send_response(status)
        self.send_header('Content-Type', mime)
        if self.path == '/redirect':
            self.send_header('Location', 'https://example.org/')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


class ServicesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Fixture)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.server.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_asset_fallback_is_rejected_even_with_http_200(self):
        self.assertIsNotNone(check.public_check({'url': self.base + '/asset', 'status': 200, 'types': ['text/css'], 'asset': True}))
        self.assertIsNone(check.public_check({'url': self.base + '/good.css', 'status': 200, 'types': ['text/css'], 'asset': True}))

    def test_webfinger_requires_a_document_and_links(self):
        self.assertIsNotNone(check.public_check({'url': self.base + '/invalid-json', 'status': 200, 'webfinger': True}))
        self.assertIsNone(check.public_check({'url': self.base + '/webfinger', 'status': 200, 'webfinger': True}))

    def test_redirect_destination_is_checked_without_following(self):
        self.assertIsNone(check.public_check({'url': self.base + '/redirect', 'status': 301, 'location': 'https://example.org'}))
        self.assertIsNotNone(check.public_check({'url': self.base + '/redirect', 'status': 301, 'location': 'https://wrong.example/'}))

    def test_transient_failure_recovers_but_repeated_failure_fails(self):
        policy = {'public_checks': [{'url': 'https://example.org', 'status': 200}], 'redirects': {}}
        with patch.object(check, 'public_check', side_effect=['temporary', None]):
            self.assertFalse(check.public_checks(policy, 0)['failures'])
        with patch.object(check, 'public_check', return_value='still failing'):
            self.assertTrue(check.public_checks(policy, 0)['failures'])

    def test_stale_or_failed_schedule_does_not_count_as_success(self):
        now = 2000000
        event = {'timestamp': now, '$workers': {'scriptName': 'member', 'eventType': 'scheduled', 'outcome': 'ok'}}
        self.assertFalse(check.cron_errors([event], ['member'], now))
        self.assertTrue(check.cron_errors([event], ['member'], now + 21 * 60000))
        event['$workers']['outcome'] = 'exception'
        self.assertTrue(check.cron_errors([event], ['member'], now))

    def test_usage_warning_changes_from_events_to_bytes_on_december_1(self):
        usage = {'events': 2000001, 'breakdown': [{'eventSize': 1000}]}
        self.assertTrue(check.usage_summary(usage, dt.date(2026, 11, 30))['warning'])
        self.assertFalse(check.usage_summary(usage, dt.date(2026, 12, 1))['warning'])
        usage['breakdown'][0]['eventSize'] = 5000000001
        self.assertTrue(check.usage_summary(usage, dt.date(2026, 12, 1))['warning'])


if __name__ == '__main__':
    unittest.main()
