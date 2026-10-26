import contextlib
import copy
import datetime as dt
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch
from urllib.error import HTTPError

from test_sync import m, Client, Store, item, ledger, manifest, status, NOW, MID


def at(hours=0, minutes=0):
    return m.timestamp(m.instant(NOW) + dt.timedelta(hours=hours, minutes=minutes))


class HealthStore(Store):
    def __init__(self, value=None, failures=None, fail_at=None):
        super().__init__(fail_at=fail_at)
        self.current = copy.deepcopy(value or ledger())
        self.failures = failures or []
        self.health_reads = []
        self.save_calls = 0

    def load(self):
        return copy.deepcopy(self.current)

    def save(self, value):
        self.save_calls += 1
        super().save(value)
        self.current = copy.deepcopy(value)

    def publisher_failures(self, since):
        self.health_reads.append(since)
        return self.failures


def observed(phase='initial', hours=25, publications=12):
    rows = [item(f'https://tedt.org/{i}/', source=f'_posts/AI/2026-01-{i+1:02d}-post.md') for i in range(publications + 1)]
    result = ledger(*rows)
    m.reconcile(result, Client(), NOW)
    result['backfill_ramp'] = {'version': 1, 'phase': phase, 'started_at': at(hours=-hours), 'healthy_since': at(hours=-hours)}
    if phase == 'accelerated':
        result['backfill_ramp']['promoted_at'] = NOW
    for i in range(publications):
        entry = result['entries'][f'https://tedt.org/{i}/']
        reference = {'id': str(100 + i), 'url': f'https://tschopp.net/@Ted/{100+i}', 'created_at': at(hours=i-publications)}
        entry.update(state='published', status=reference, verified_at=NOW)
        result['receipts'].append({'operation': str(i), 'kind': 'archive', 'canonical_url': entry['canonical_url'], **reference})
    return result


class RatePolicyTests(unittest.TestCase):
    def test_trusted_publication_starts_at_24_without_resetting_receipts(self):
        result, client, store = ledger(), Client(), HealthStore()
        m.reconcile(result, client, NOW)
        m.publish_one(result, client, store, NOW, enabled=True, backfill=True)
        self.assertEqual(m.backfill_policy(result)['daily_limit'], 24)
        self.assertEqual(result['backfill_ramp']['started_at'], NOW)
        self.assertEqual(len(result['receipts']), 1)
        self.assertIn('intent', store.saves[0]['entries']['https://tedt.org/first/'])

    def test_a_full_day_and_twelve_verified_archive_posts_are_required(self):
        for hours, count, expected in [(23, 12, 24), (25, 11, 24), (25, 12, 48)]:
            with self.subTest(hours=hours, publications=count):
                result, store = observed(hours=hours, publications=count), HealthStore()
                m.refresh_ramp(result, store, NOW)
                self.assertEqual(m.backfill_policy(result)['daily_limit'], expected)
                self.assertEqual(bool(store.health_reads), expected == 48)

    def test_promotion_is_inclusive_at_exactly_24_hours(self):
        result = observed(hours=24)
        m.refresh_ramp(result, HealthStore(), NOW)
        self.assertEqual(result['backfill_ramp']['promoted_at'], NOW)

    def test_simulated_three_day_catchup_obeys_caps_and_posts_each_url_once(self):
        rows=[item(f'https://tedt.org/post-{i:03d}/',source=f'_posts/AI/2020-01-01-post-{i}.md',date=m.timestamp(m.instant(NOW)-dt.timedelta(days=200,seconds=200-i))) for i in range(150)]
        result,client,store=ledger(*rows),Client(),HealthStore()
        posted=[]
        current=NOW
        def create(content,key):
            url=content.split('\n')[-1]
            row=status(mid=str(1000+len(posted)),url=url,date=current)
            client.statuses.append(row)
            posted.append(row)
            return row
        client.create=create
        for minute in range(0,72*60,10):
            current=at(minutes=minute)
            m.reconcile(result,client,current)
            m.publish_one(result,client,store,current,enabled=True,backfill=True)
            cap=m.backfill_policy(result)['daily_limit']
            count=sum(m.instant(current)-m.instant(row['created_at']) < dt.timedelta(hours=24) for row in result['receipts'])
            self.assertLessEqual(count,cap)
            self.assertEqual(cap,24 if minute<24*60 else 48)
        self.assertEqual(sum(m.instant(row['created_at'])<m.instant(at(hours=24)) for row in posted),24)
        self.assertEqual(len(result['receipts']),120)
        self.assertEqual(len({row['canonical_url'] for row in result['receipts']}),120)
        self.assertEqual([row['canonical_url'] for row in result['receipts']],[row['canonical_url'] for row in rows[:120]])

    def test_read_only_summary_and_queue_do_not_promote(self):
        result = observed()
        original = copy.deepcopy(result)
        self.assertEqual(m.summary(result, NOW)['backfill_policy']['daily_limit'], 24)
        m.queued(result, NOW, True)
        self.assertEqual(result, original)

    def test_daily_caps_use_rolling_24_hours_in_both_phases(self):
        for phase, cap in [('initial', 24), ('accelerated', 48)]:
            with self.subTest(phase=phase):
                result = observed(phase=phase, publications=0)
                result['receipts'] = [{'kind': 'archive', 'created_at': at(hours=-3)} for _ in range(cap)]
                self.assertEqual(m.queued(result, NOW, True)[1], 'archive_daily_limit')
                result['receipts'][0]['created_at'] = at(hours=-24)
                self.assertEqual(m.queued(result, NOW, True)[1], 'archive')

    def test_archive_spacing_changes_but_new_posts_retain_an_hour(self):
        for phase, gap in [('initial', 60), ('accelerated', 30)]:
            result = observed(phase=phase, publications=0)
            result['receipts'] = [{'kind':'archive', 'created_at':at(minutes=1-gap)}]
            self.assertEqual(m.queued(result, NOW, True)[1], 'global_cooldown')
            result['receipts'][0]['created_at'] = at(minutes=-gap)
            self.assertEqual(m.queued(result, NOW, True)[1], 'archive')
        result['entries']['https://tedt.org/0/']['queue_kind'] = 'new'
        self.assertEqual(m.queued(result, NOW, True)[1], 'global_cooldown')
        result['receipts'][0]['created_at'] = at(hours=-1)
        self.assertEqual(m.queued(result, NOW, True)[1], 'new')

    def test_uncertainty_or_unverified_receipt_demotes_and_restarts_observation(self):
        for issue in ['intent', 'uncertain', 'unverified']:
            with self.subTest(issue=issue):
                result = observed(phase='accelerated')
                row = result['entries']['https://tedt.org/12/']
                if issue == 'intent': row['intent'] = {'key':'in-flight'}
                elif issue == 'uncertain': row['state'] = 'uncertain'
                else: result['entries']['https://tedt.org/0/']['verified_at'] = at(hours=-1)
                m.refresh_ramp(result, HealthStore(), NOW)
                self.assertEqual(m.backfill_policy(result)['daily_limit'], 24)
                self.assertEqual(result['backfill_ramp']['healthy_since'], NOW)

    def test_failed_workflow_blocks_promotion_even_if_failure_could_not_save_state(self):
        for phase in ['initial', 'accelerated']:
            result = observed(phase=phase)
            m.refresh_ramp(result, HealthStore(failures=[{'id':42,'updated_at':at(hours=-2)}]), NOW)
            self.assertEqual(m.backfill_policy(result)['daily_limit'], 24)
            self.assertEqual(result['backfill_ramp']['healthy_since'], at(hours=-2))
            self.assertEqual(result['backfill_ramp']['health_hold'], 'workflow_failure')

    def test_corrupt_policy_does_not_restart_the_clock(self):
        result = ledger()
        result['backfill_ramp'] = {'version':999}
        with self.assertRaises(m.SyncError): m.refresh_ramp(result, HealthStore(), NOW)
        self.assertEqual(result['backfill_ramp'], {'version':999})

    def test_failed_health_query_cannot_promote(self):
        result, store = observed(), HealthStore()
        store.publisher_failures = Mock(side_effect=m.RemoteError(503,'github'))
        with self.assertRaises(m.SyncError): m.refresh_ramp(result, store, NOW)
        self.assertEqual(m.backfill_policy(result)['daily_limit'], 24)


class HealthAndBackoffTests(unittest.TestCase):
    def test_retry_after_and_reset_headers_are_both_respected(self):
        self.assertEqual(m.retry_time({'Retry-After':'1200'}, NOW), at(minutes=20))
        self.assertEqual(m.retry_time({'Retry-After':'Sun, 25 Oct 2026 12:20:00 GMT'}, NOW), at(minutes=20))
        self.assertEqual(m.retry_time({'Retry-After':'1200','X-RateLimit-Reset':at(minutes=30)}, NOW), at(minutes=30))
        self.assertEqual(m.retry_time({'Retry-After':'bad','X-RateLimit-Reset':'bad'}, NOW), at(minutes=5))
        self.assertEqual(m.retry_time({'X-RateLimit-Reset':'2026-10-25T12:30:00.275Z'}, NOW), '2026-10-25T12:30:01Z')

    def test_http_429_preserves_server_cooldown(self):
        opener = Mock()
        opener.open.side_effect = HTTPError('https://tschopp.net/api/v1/statuses',429,'limited',{'Retry-After':'1200'},None)
        original_timestamp=m.timestamp
        with patch.object(m.request,'build_opener',return_value=opener), patch.object(m,'timestamp',side_effect=lambda value=None: original_timestamp(value or m.instant(NOW))):
            with self.assertRaises(m.RemoteError) as raised:
                m.http_json('https://tschopp.net/api/v1/statuses')
        self.assertEqual(raised.exception.retry_at, at(minutes=20))

    def test_failure_demotes_and_persists_exponential_backoff(self):
        result = observed(phase='accelerated')
        m.note_failure(result,NOW,m.RemoteError(500,'mastodon'))
        self.assertEqual(m.backfill_policy(result)['daily_limit'],24)
        self.assertEqual(result['publication_not_before'],at(minutes=5))
        m.note_failure(result,at(minutes=10),m.RemoteError(429,'mastodon',at(minutes=40)))
        self.assertEqual(result['publication_not_before'],at(minutes=40))
        self.assertEqual(result['consecutive_failures'],2)

    def test_workflow_health_checks_all_pages(self):
        store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
        good=[{'id':i,'status':'completed','conclusion':'success','updated_at':NOW} for i in range(100)]
        bad={'id':101,'status':'completed','conclusion':'failure','updated_at':NOW}
        store.api=Mock(side_effect=[{'total_count':101,'workflow_runs':good},{'total_count':101,'workflow_runs':[bad]},{'total_count':0,'workflow_runs':[]}])
        self.assertEqual(store.publisher_failures(at(hours=-24)),[{'id':101,'updated_at':NOW}])
        self.assertEqual(store.api.call_count,3)
        self.assertIn('page=2',store.api.call_args_list[1].args[0])

    def test_failed_main_deployment_is_included_in_the_health_gate(self):
        store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
        failed={'id':42,'status':'completed','conclusion':'failure','updated_at':NOW}
        store.api=Mock(side_effect=[{'total_count':0,'workflow_runs':[]},{'total_count':1,'workflow_runs':[failed]}])
        self.assertEqual(store.publisher_failures(at(hours=-24)),[{'id':42,'updated_at':NOW}])
        self.assertIn('/deploy.yml/runs?',store.api.call_args.args[0])

    def test_health_window_uses_completion_time_including_earlier_started_runs(self):
        store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
        old={'id':1,'status':'completed','conclusion':'failure','created_at':at(hours=-26),'updated_at':at(hours=-25)}
        overlapping={'id':2,'status':'completed','conclusion':'failure','created_at':at(hours=-25),'updated_at':at(hours=-23)}
        store.api=Mock(side_effect=[{'total_count':2,'workflow_runs':[old,overlapping]},{'total_count':0,'workflow_runs':[]}])
        self.assertEqual(store.publisher_failures(at(hours=-24)),[{'id':2,'updated_at':at(hours=-23)}])

    def test_superseded_cache_refresh_is_benign_but_real_failures_still_block(self):
        store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
        canceled_cache={'id':1,'status':'completed','conclusion':'cancelled','display_title':'IndieWeb cache refresh','updated_at':NOW}
        failed_cache={**canceled_cache,'id':2,'conclusion':'failure'}
        canceled_release={**canceled_cache,'id':3,'display_title':'Site Quality + Deploy'}
        canceled_publisher={**canceled_cache,'id':4}
        store.api=Mock(side_effect=[{'total_count':1,'workflow_runs':[canceled_publisher]},
                                   {'total_count':3,'workflow_runs':[canceled_cache,failed_cache,canceled_release]}])
        self.assertEqual(store.publisher_failures(at(hours=-24)),[{'id':4,'updated_at':NOW},{'id':2,'updated_at':NOW},{'id':3,'updated_at':NOW}])

    def test_incomplete_workflow_history_cannot_authorize_acceleration(self):
        for response in [{'total_count':1001,'workflow_runs':[]},{'total_count':101,'workflow_runs':[]},{'total_count':1}]:
            store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
            store.api=Mock(return_value=response)
            with self.assertRaises(m.SyncError): store.publisher_failures(at(hours=-24))

    def test_missing_final_health_page_is_not_treated_as_success(self):
        good=[{'id':i,'status':'completed','conclusion':'success','updated_at':NOW} for i in range(100)]
        store=m.GitHubStore('TedTschopp/tedt.org','fixture-token',{})
        store.api=Mock(side_effect=[{'total_count':101,'workflow_runs':good},{'total_count':101,'workflow_runs':[]}])
        with self.assertRaises(m.SyncError): store.publisher_failures(at(hours=-24))

    def test_noop_checks_do_not_request_site_deployments(self):
        before=m.summary(observed(),NOW)
        after=copy.deepcopy(before)
        after.update(last_run_at=at(minutes=10),last_reconciliation_at=at(minutes=10),last_updated=at(minutes=10),runs=500,result={'reason':'global_cooldown'})
        self.assertFalse(m.website_changed(before,after))
        after['backfill_policy']['daily_limit']=48
        self.assertTrue(m.website_changed(before,after))
        after=copy.deepcopy(before)
        after['remaining']-=1
        self.assertTrue(m.website_changed(before,after))


class LiveCommandBoundaryTests(unittest.TestCase):
    def run_command(self, root, store, client, when=NOW):
        path=root/'manifest.json'
        path.write_text(json.dumps(manifest()))
        source=root/'_posts/AI/2026-01-01-first.md'
        source.parent.mkdir(parents=True,exist_ok=True)
        if not source.exists(): source.write_text('---\ntitle: First\n---\nBody\n')
        original_timestamp=m.timestamp
        clock=m.instant(when)
        with patch.dict('os.environ',{'MASTODON_PUBLISH_ENABLED':'true','MASTODON_BACKFILL_ENABLED':'true','GITHUB_REPOSITORY':'TedTschopp/tedt.org','GITHUB_TOKEN':'fixture-token'}), patch.object(m,'GitHubStore',return_value=store), patch.object(m,'Mastodon',return_value=client), patch.object(m,'timestamp',side_effect=lambda value=None: original_timestamp(value or clock)), contextlib.redirect_stdout(io.StringIO()):
            return m.main(['publish','--write','--github-state','--root',str(root),'--manifest',str(path),'--report',str(root/'report.json')])

    def test_throttling_is_durable_and_retry_reuses_the_original_key(self):
        with tempfile.TemporaryDirectory() as directory:
            root,store,client=Path(directory),HealthStore(),Client()
            client.create=Mock(side_effect=m.RemoteError(429,'tschopp.net',at(minutes=20)))
            with self.assertRaises(m.RemoteError): self.run_command(root,store,client)
            key=client.create.call_args.args[1]
            self.assertEqual(store.current['publication_not_before'],at(minutes=20))
            self.assertEqual(store.current['backfill_ramp']['phase'],'initial')
            client.account=Mock(side_effect=AssertionError('Backoff must prevent API requests'))
            self.run_command(root,store,client,at(minutes=10))
            client.account.assert_not_called()
            client.account=Mock()
            def created(content, operation):
                result=status(date=at(minutes=25))
                client.statuses.append(result)
                return result
            client.create=Mock(side_effect=created)
            self.run_command(root,store,client,at(minutes=25))
            self.assertEqual(client.create.call_args.args[1],key)
            self.assertEqual(len(store.current['receipts']),1)
            self.assertEqual(store.current['consecutive_failures'],0)

    def test_repeated_post_failures_increase_the_saved_cooldown(self):
        with tempfile.TemporaryDirectory() as directory:
            root,store,client=Path(directory),HealthStore(),Client()
            client.create=Mock(side_effect=m.RemoteError(500,'tschopp.net'))
            with self.assertRaises(m.RemoteError): self.run_command(root,store,client)
            with self.assertRaises(m.RemoteError): self.run_command(root,store,client,at(minutes=10))
            self.assertEqual(store.current['consecutive_failures'],2)
            self.assertEqual(store.current['publication_not_before'],at(minutes=20))
            self.assertEqual(client.create.call_args_list[0].args[1],client.create.call_args_list[1].args[1])

    def test_failed_persistence_is_never_followed_by_a_health_overwrite(self):
        for fail_at,posts in [(1,0),(2,1)]:
            with self.subTest(fail_at=fail_at), tempfile.TemporaryDirectory() as directory:
                store,client=HealthStore(fail_at=fail_at),Client()
                with self.assertRaises(m.PersistenceError): self.run_command(Path(directory),store,client)
                self.assertEqual(store.save_calls,fail_at)
                self.assertEqual(sum(call[0]=='post' for call in client.calls),posts)

    def test_successful_noop_run_updates_durable_state_without_site_deployment(self):
        with tempfile.TemporaryDirectory() as directory:
            root,store,client=Path(directory),HealthStore(),Client()
            self.run_command(root,store,client)
            self.assertTrue(json.loads((root/'report.json').read_text())['result']['website_changed'])
            self.run_command(root,store,client,at(minutes=10))
            report=json.loads((root/'report.json').read_text())
            self.assertFalse(report['result']['website_changed'])
            self.assertEqual(report['result']['reason'],'global_cooldown')
            self.assertEqual(len(store.current['receipts']),1)


if __name__=='__main__':
    unittest.main()
