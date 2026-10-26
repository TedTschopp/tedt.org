import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('micropub_publisher', ROOT / '_code/micropub_publish.py')
pub = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pub)

class FakeAPI:
    def __init__(self, rows): self.rows = rows; self.calls = []
    def call(self, action, **fields):
        self.calls.append((action, fields))
        if action == 'pending': return {'entries': self.rows}
        return {'acknowledged': True}

def row(ident='a2607c7e-6bee-48c2-937f-2f8261ec085a', content='Public note'):
    return {'id': ident, 'url': f'https://tedt.org/updates/2026/10/25/{ident}/', 'created': '2026-10-25T10:00:00Z', 'type': 'h-entry', 'revision': 1, 'publish': True, 'properties': {'content': [content], 'published': ['2026-10-25T10:00:00Z'], 'post-status': ['published']}}

class PublisherTest(unittest.TestCase):
    def test_media_template_matches_the_canonical_adapter(self):
        self.assertEqual((ROOT / '_code/micropub_publish.py').read_bytes(), (ROOT / '_code/indieweb-media-template/scripts/publish.py').read_bytes())

    def test_safe_paths_reject_traversal_and_symlinks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); (root / 'link').symlink_to(root.parent, target_is_directory=True)
            for target in ['../outside', 'link/outside']:
                with self.assertRaises(ValueError): pub.safe_file(root, target)
        for bad in ['../../file', 'a' * 36]:
            data = row(); data['id'] = bad
            with self.assertRaises(ValueError): pub.entry_path(data)

    def test_media_manifest_requires_hash_names_and_file_integrity(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); (root / 'files').mkdir()
            data = b'ID3\x04\x00\x00test binary'; digest = pub.hashlib.sha256(data).hexdigest()
            path = root / 'files' / f'{digest}.mp3'; path.write_bytes(data)
            manifest, _ = pub.media_manifest(root)
            self.assertEqual(manifest['files'][0]['sha256'], digest)
            path.write_bytes(b'changed')
            with self.assertRaises(ValueError): pub.media_manifest(root)

    def test_media_file_and_site_budgets_fail_before_deployment(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); (root / 'index.html').write_bytes(b'x' * 1025)
            with patch.object(pub, 'MAX_FILE', 1024):
                with self.assertRaises(ValueError): pub.media_manifest(root)
            with patch.object(pub, 'MAX_SITE', 1024):
                with self.assertRaises(ValueError): pub.media_manifest(root)

    def test_live_confirmation_requires_the_exact_id_and_revision(self):
        class Response:
            status = 200
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self, n): return b'<meta name="micropub-id" content="a2607c7e-6bee-48c2-937f-2f8261ec085a"><meta name="micropub-revision" content="1">'
        class Opener:
            def open(self, *args, **kwargs): return Response()
        self.assertTrue(pub.live_entry(row(), Opener()))
        changed = row(); changed['revision'] = 2
        self.assertFalse(pub.live_entry(changed, Opener()))
        deleted = row(); deleted['publish'] = False
        self.assertFalse(pub.live_entry(deleted, Opener()))

    def test_unauthenticated_or_redirected_publisher_transport_is_refused(self):
        with self.assertRaises(ValueError): pub.APIClient('')
        redirect = pub.NoRedirect()
        self.assertIsNone(redirect.redirect_request(None, None, 302, '', {}, 'https://foreign.example/'))

    def test_real_git_publication_is_idempotent_and_retains_mastodon_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp); remote = base / 'remote.git'; checkout = base / 'checkout'
            subprocess.run(['git', 'init', '--bare', str(remote)], check=True, capture_output=True)
            subprocess.run(['git', 'init', '--initial-branch=main', str(checkout)], check=True, capture_output=True)
            previous = Path.cwd()
            try:
                os.chdir(checkout)
                (checkout / '_code').symlink_to(ROOT / '_code', target_is_directory=True)
                (checkout / 'README').write_text('fixture')
                for args in [('config','user.name','Fixture'),('config','user.email','fixture@example.com'),('add','README'),('commit','-m','Initial'),('remote','add','origin',str(remote)),('push','-u','origin','main')]: pub.command('git',*args)
                with patch.dict(os.environ, {'BUNDLE_GEMFILE': str(ROOT / 'Gemfile')}):
                    data = row(); api = FakeAPI([data]); pub.apply_site(api, checkout)
                    path = checkout / pub.entry_path(data)
                    self.assertIn('Public note', path.read_text())
                    count = pub.command('git','rev-list','--count','HEAD')
                    pub.apply_site(FakeAPI([data]), checkout)
                    self.assertEqual(pub.command('git','rev-list','--count','HEAD'), count)
                    text = path.read_text().replace('\n---\n', '\nmastodon-post-id: "123456"\nmastodon-post-url: "https://tschopp.net/@Ted/123456"\n---\n', 1)
                    path.write_text(text); pub.commit_paths([pub.entry_path(data)], 'Fixture syndication receipt')
                    data['revision'] = 2; data['properties']['content'] = ['Edited public note']
                    pub.apply_site(FakeAPI([data]), checkout)
                    self.assertIn('123456', path.read_text()); self.assertIn('Edited public note', path.read_text())
                    data['revision'] = 3; data['publish'] = False; del data['properties']
                    pub.apply_site(FakeAPI([data]), checkout)
                    self.assertFalse(path.exists())
                    data['publish'] = True; data['revision'] = 4; data['properties'] = row()['properties']
                    pub.apply_site(FakeAPI([data]), checkout)
                    self.assertTrue(path.exists())
                    private = row('b2607c7e-6bee-48c2-937f-2f8261ec085a', 'PRIVATE_SENTINEL'); private['publish'] = False
                    with self.assertRaises(ValueError): pub.apply_site(FakeAPI([private]), checkout)
                    self.assertNotIn('PRIVATE_SENTINEL', pub.command('git','log','-p','--all'))
            finally: os.chdir(previous)

if __name__ == '__main__': unittest.main()
