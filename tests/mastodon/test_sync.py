import copy
import base64
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

MODULE = Path(__file__).resolve().parents[2] / '_code/mastodon_sync.py'
spec = importlib.util.spec_from_file_location('mastodon_sync', MODULE)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
NOW = '2026-10-25T12:00:00Z'
ACCOUNT = '109784960088344792'
MID = '117457611158583035'


def item(url='https://tedt.org/first/', source='_posts/AI/2026-01-01-first.md', date='2026-01-01T00:00:00Z', **extra):
    return {'canonical_url': url, 'source_path': source, 'published_at': date,
            'title': 'First', 'content_text': 'First\n' + url, 'aliases': [url],
            'mastodon_post_id': None, 'mastodon_post_url': None, **extra}


def manifest(*items):
    return {'version': 1, 'instance': 'https://tschopp.net', 'username': 'Ted', 'items': list(items or [item()])}


def ledger(*items, legacy=None):
    return m.prepare_ledger(manifest(*items), {'version': 1, 'entries': {}}, legacy or {}, NOW)


def status(mid=MID, url='https://tedt.org/first/', date='2026-01-01T00:00:00Z', **extra):
    return {'id': mid, 'url': 'https://tschopp.net/@Ted/' + mid, 'created_at': date,
            'account': {'id': ACCOUNT}, 'visibility': 'public',
            'content': f'<p><a href="{url}">{url}</a></p>', **extra}


class Client:
    account_id = ACCOUNT

    def __init__(self, statuses=None, known=None):
        self.statuses = statuses or []
        self.known = known or {}
        self.calls = []

    def timeline(self):
        return self.statuses

    def status(self, mid):
        self.calls.append(('get', mid))
        return self.known.get(mid)

    def account(self, verify=False):
        self.calls.append(('account', verify))

    def create(self, content, key):
        self.calls.append(('post', key))
        created = status(date=NOW)
        self.statuses.append(created)
        return created


class Store:
    durable = True

    def __init__(self, fail_at=None):
        self.saves = []
        self.fail_at = fail_at

    def save(self, value):
        if len(self.saves) + 1 == self.fail_at:
            raise m.SyncError('commit conflict')
        self.saves.append(copy.deepcopy(value))


class IdentityAndMigrationTests(unittest.TestCase):
    def test_absolute_relative_and_leaked_markdown_cache_keys_merge(self):
        values = {key: {'toots': [f'https://tschopp.net/users/Ted/statuses/{mid}']}
                  for key, mid in [('https://tedt.org/first/', '100'), ('/first/', '101'), ('/first.md/', '102')]}
        result = ledger(legacy=values)
        entry = result['entries']['https://tedt.org/first/']
        self.assertEqual({row['id'] for row in entry['history']}, {'100', '101', '102'})
        self.assertEqual(values['/first/']['toots'], ['https://tschopp.net/users/Ted/statuses/101'])

    def test_merged_prompts_have_one_canonical_entry(self):
        canonical = 'https://ai.tedt.org/prompts/prd/'
        rows = [item(canonical, source='_posts/Prompts/2025-01-01-prd-2.md', aliases=['https://tedt.org/prompts/prd-2/', canonical]),
                item(canonical, source='_posts/Prompts/2025-01-01-prd.md', aliases=['https://tedt.org/prompts/prd/', canonical])]
        result = ledger(*rows)
        self.assertEqual(len(result['entries']), 1)
        self.assertEqual(len(result['entries'][canonical]['source_paths']), 2)

    def test_ambiguous_guessed_alias_does_not_attach_a_thread(self):
        rows = [item('https://tedt.org/a/', aliases=['https://tedt.org/a/', 'https://tedt.org/shared/']),
                item('https://tedt.org/b/', source='_posts/RPG Posts/2026-01-01-b.md', aliases=['https://tedt.org/b/', 'https://tedt.org/shared/'])]
        result = ledger(*rows, legacy={'/shared/': {'toots': [f'https://tschopp.net/@Ted/{MID}']}})
        self.assertIn('/shared/', result['unmatched_legacy'])
        self.assertTrue(all(not row['history'] for row in result['entries'].values()))
        self.assertTrue(all('https://tedt.org/shared/' not in row['aliases'] for row in result['entries'].values()))

    def test_large_ids_remain_exact_strings(self):
        result = ledger(item(mastodon_post_id=MID))
        self.assertEqual(result['entries']['https://tedt.org/first/']['history'][0]['id'], MID)
        with self.assertRaises(m.SyncError):
            ledger(item(mastodon_post_id=int(MID)))

    def test_foreign_explicit_thread_is_not_rewritten_to_the_wrong_server(self):
        with self.assertRaises(m.SyncError):
            ledger(item(mastodon_post_id=MID, mastodon_post_url='https://other.example/@Ted/' + MID))

    def test_sources_removed_from_manifest_are_not_written(self):
        result = ledger(item(), item(source='_posts/AI/2026-01-02-alias.md'))
        m.prepare_ledger(manifest(item()), result, {}, NOW)
        self.assertEqual(result['entries']['https://tedt.org/first/']['source_paths'], [item()['source_path']])

    def test_unknown_schema_and_bad_source_fail_closed(self):
        with self.assertRaises(m.SyncError):
            m.prepare_ledger(manifest(), {'version': 99, 'entries': {}}, {}, NOW)
        with self.assertRaises(m.SyncError):
            ledger(item(source='_posts/../secret.md'))

    def test_exact_permalink_case_and_extension_are_preserved(self):
        self.assertEqual(m.web_url('http://www.tedt.org/A%20Case.html?utm=x#comment'), 'https://tedt.org/A%20Case.html')


class ReconciliationTests(unittest.TestCase):
    def test_cache_mapping_is_verified_before_recovery(self):
        result = ledger(legacy={'https://tedt.org/first/': {'toots': [f'https://tschopp.net/@Ted/{MID}']}})
        m.reconcile(result, Client([status()]), NOW)
        entry = result['entries']['https://tedt.org/first/']
        self.assertEqual(entry['state'], 'recovered')
        self.assertEqual(entry['status']['id'], MID)

    def test_existing_live_preference_wins_and_history_is_preserved(self):
        result = ledger(item(mastodon_post_id=MID))
        m.reconcile(result, Client([status('100'), status()]), NOW)
        self.assertEqual(result['entries']['https://tedt.org/first/']['status']['id'], MID)

    def test_oldest_live_duplicate_is_chosen_without_preference(self):
        result = ledger()
        m.reconcile(result, Client([status('200', date=NOW), status('100')]), NOW)
        self.assertEqual(result['entries']['https://tedt.org/first/']['status']['id'], '100')

    def test_deleted_status_requires_direct_confirmation(self):
        result, client = ledger(item(mastodon_post_id=MID)), Client()
        m.reconcile(result, client, NOW)
        self.assertIn(('get', MID), client.calls)
        self.assertEqual(result['entries']['https://tedt.org/first/']['state'], 'missing')

    def test_auth_and_throttle_errors_are_not_deletions(self):
        for code in [401, 403, 429, 500]:
            result, client = ledger(item(mastodon_post_id=MID)), Client()
            client.status = lambda mid: (_ for _ in ()).throw(m.RemoteError(code, 'test'))
            with self.assertRaises(m.RemoteError):
                m.reconcile(result, client, NOW)
            self.assertNotEqual(result['entries']['https://tedt.org/first/']['state'], 'missing')

    def test_private_and_wrong_owner_statuses_are_not_exported(self):
        for row in [status(visibility='private'), status(account={'id': 'other'})]:
            with self.assertRaises(m.SyncError):
                m.reconcile(ledger(), Client([row]), NOW)

    def test_pagination_must_exhaust_and_preserves_large_cursors(self):
        client = m.Mastodon('https://tschopp.net', 'Ted')
        client.account_id = ACCOUNT
        client.api = unittest.mock.Mock(side_effect=[[status()], [status('100')], []])
        self.assertEqual(len(client.timeline()), 2)
        self.assertIn('max_id=' + MID, client.api.call_args_list[1].args[0])
        client.api = unittest.mock.Mock(side_effect=[[status()], [status()]])
        with self.assertRaises(m.SyncError):
            client.timeline()


class QueueAndPublicationTests(unittest.TestCase):
    def ready(self, *rows):
        result = ledger(*rows)
        m.reconcile(result, Client(), NOW)
        return result

    def test_oldest_archive_first_even_beyond_twelve_items(self):
        rows = [item(f'https://tedt.org/{i}/', source=f'_posts/AI/2026-01-{i:02d}-post.md', date=f'2026-01-{i:02d}T00:00:00Z') for i in range(1, 20)]
        result = self.ready(*reversed(rows))
        entry, kind = m.queued(result, NOW, True)
        self.assertEqual(entry['canonical_url'], 'https://tedt.org/1/')
        self.assertEqual(kind, 'archive')

    def test_new_content_takes_priority_and_edits_do_not_requeue(self):
        result = self.ready()
        old = result['entries']['https://tedt.org/first/']
        old.update(state='published', status={'id': MID, 'url': 'https://tschopp.net/@Ted/' + MID})
        new = item('https://tedt.org/new/', source='_posts/AI/2026-10-25-new.md', date=NOW)
        m.prepare_ledger(manifest(item(title='Edited'), new), result, {}, NOW)
        m.reconcile(result, Client([status()]), NOW)
        selected, kind = m.queued(result, NOW, True)
        self.assertEqual(selected['canonical_url'], new['canonical_url'])
        self.assertEqual(kind, 'new')
        self.assertEqual(old['state'], 'published')

    def test_archive_pause_global_cooldown_and_archive_interval(self):
        result = self.ready()
        self.assertEqual(m.queued(result, NOW, False)[1], 'backfill_paused')
        result['receipts'] = [{'kind': 'archive', 'created_at': '2026-10-25T11:30:00Z'}]
        self.assertEqual(m.queued(result, NOW, True)[1], 'global_cooldown')
        result['receipts'][0]['created_at'] = '2026-10-25T10:30:00Z'
        self.assertEqual(m.queued(result, NOW, True)[1], 'archive_cooldown')

    def test_rolling_daily_limit_is_independent_of_calendar_and_dst(self):
        result = self.ready()
        result['receipts'] = [{'kind': 'archive', 'created_at': '2026-10-25T09:00:00Z'} for _ in range(12)]
        self.assertEqual(m.queued(result, NOW, True)[1], 'archive_daily_limit')

    def test_unreconciled_entries_cannot_be_published(self):
        self.assertEqual(m.queued(ledger(), NOW, True)[1], 'queue_empty')

    def test_pause_and_local_store_prevent_posts(self):
        result, client = self.ready(), Client()
        with self.assertRaises(m.SyncError):
            m.publish_one(result, client, Store(), NOW)
        store = Store()
        store.durable = False
        with self.assertRaises(m.SyncError):
            m.publish_one(result, client, store, NOW, enabled=True, backfill=True)
        self.assertFalse(any(call[0] == 'post' for call in client.calls))

    def test_intent_commit_failure_prevents_post(self):
        client = Client()
        with self.assertRaises(m.SyncError):
            m.publish_one(self.ready(), client, Store(fail_at=1), NOW, enabled=True, backfill=True)
        self.assertFalse(any(call[0] == 'post' for call in client.calls))

    def test_lost_receipt_is_reconciled_without_a_second_post(self):
        result, client, store = self.ready(), Client(), Store(fail_at=2)
        with self.assertRaises(m.SyncError):
            m.publish_one(result, client, store, NOW, enabled=True, backfill=True)
        saved_intent = copy.deepcopy(store.saves[0])
        self.assertEqual(saved_intent['entries']['https://tedt.org/first/']['state'], 'uncertain')
        m.reconcile(saved_intent, client, NOW)
        self.assertEqual(len(saved_intent['receipts']), 1)
        self.assertNotIn('intent', saved_intent['entries']['https://tedt.org/first/'])
        self.assertEqual(m.queued(saved_intent, NOW, True)[1], 'global_cooldown')
        self.assertEqual(sum(call[0] == 'post' for call in client.calls), 1)

    def test_retry_uses_the_same_persisted_idempotency_key(self):
        result, client, store = self.ready(), Client(), Store()
        client.create = unittest.mock.Mock(side_effect=m.SyncError('uncertain response'))
        for _ in range(2):
            m.reconcile(result, client, NOW)
            with self.assertRaises(m.SyncError):
                m.publish_one(result, client, store, NOW, enabled=True, backfill=True)
        self.assertEqual(client.create.call_args_list[0].args[1], client.create.call_args_list[1].args[1])


class PersistenceAndFormattingTests(unittest.TestCase):
    def test_missing_initialized_state_branch_cannot_reset_publication_history(self):
        store = m.GitHubStore('TedTschopp/tedt.org', 'fixture-token', {'durable_initialized_at': NOW})
        store.api = unittest.mock.Mock(side_effect=m.RemoteError(404, 'github'))
        with self.assertRaises(m.SyncError):
            store.load()

    def test_large_ledger_uses_the_blob_api_when_contents_encoding_is_none(self):
        store = m.GitHubStore('TedTschopp/tedt.org', 'fixture-token', {})
        value = {'version': 1, 'entries': {}}
        store.api = unittest.mock.Mock(side_effect=[
            {'encoding': 'none', 'sha': 'large'},
            {'encoding': 'base64', 'content': base64.b64encode(json.dumps(value).encode()).decode()}
        ])
        self.assertEqual(store.read_remote(), (value, 'large'))
        self.assertEqual(store.api.call_args.args[0], '/git/blobs/large')

    def test_archive_canary_cannot_be_enabled_from_an_untrusted_dispatch(self):
        with patch.dict('os.environ', {'GITHUB_EVENT_NAME': 'push', 'GITHUB_REF': 'refs/heads/main'}):
            with self.assertRaises(m.SyncError):
                m.main(['publish', '--archive-canary'])

    def test_frontmatter_preserves_comments_body_order_and_crlf(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'test.md'
            path.write_bytes(b'---\r\n# Keep me\r\ntitle: "Original"\r\nmastodon-post-id: null\r\ncustom: |\r\n  Keep indentation\r\n---\r\nBody\r\n---\r\nEnd\r\n')
            reference = {'id': MID, 'url': 'https://tschopp.net/@Ted/' + MID}
            self.assertTrue(m.patch_frontmatter(path, reference))
            self.assertFalse(m.patch_frontmatter(path, reference))
            text = path.read_bytes()
            self.assertIn(b'# Keep me\r\ntitle: "Original"', text)
            self.assertIn(b'custom: |\r\n  Keep indentation', text)
            self.assertTrue(text.endswith(b'Body\r\n---\r\nEnd\r\n'))
            self.assertIn(f'mastodon-post-id: "{MID}"'.encode(), text)

    def test_corrupt_json_never_becomes_an_empty_history(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'broken.json'
            path.write_text('{broken')
            with self.assertRaises(m.SyncError):
                m.load_json(path, {})

    def test_github_conflict_does_not_overwrite_another_writer(self):
        store = m.GitHubStore('TedTschopp/tedt.org', 'fixture-token', {})
        store.previous, store.sha = {'version': 1}, 'old'
        store.api = unittest.mock.Mock(side_effect=m.RemoteError(409, 'github'))
        store.read_remote = unittest.mock.Mock(return_value=({'version': 1, 'other_writer': True}, 'new'))
        with self.assertRaises(m.SyncError):
            store.save({'version': 1, 'mine': True})
        self.assertEqual(store.api.call_count, 1)

    def test_github_retries_a_branch_race_only_when_ledger_unchanged(self):
        store = m.GitHubStore('TedTschopp/tedt.org', 'fixture-token', {})
        store.previous, store.sha = {'version': 1}, 'old'
        store.api = unittest.mock.Mock(side_effect=[m.RemoteError(409, 'github'), {'content': {'sha': 'saved'}}])
        store.read_remote = unittest.mock.Mock(return_value=({'version': 1}, 'same'))
        store.save({'version': 1, 'mine': True})
        self.assertEqual(store.sha, 'saved')
        self.assertEqual(store.api.call_count, 2)


if __name__ == '__main__':
    unittest.main()
