#!/usr/bin/env python3
"""Behavior checks for treating deployed artifacts as data, never executable files."""
import base64
import io
import json
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '_code'))
from read_webmention_artifact import read_artifact


class ArtifactTests(unittest.TestCase):
    def create(self, path, entries):
        with tarfile.open(path, 'w') as archive:
            for name, body, kind in entries:
                member = tarfile.TarInfo(name)
                if kind == 'link':
                    member.type = tarfile.SYMTYPE
                    member.linkname = '/etc/passwd'
                    archive.addfile(member)
                else:
                    member.size = len(body)
                    archive.addfile(member, io.BytesIO(body))

    def manifest(self):
        return ('./indieweb-manifest.json', b'{"version":1,"entries":[]}', 'file')

    def test_unicode_long_names_remain_data_and_archive_paths_are_never_extracted(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            archive, output = root / 'pages.tar', root / 'pages.jsonl'
            name = 'Café-' + 'long-' * 25 + '/index.html'
            self.create(archive, [self.manifest(), (name, '<p>café</p>'.encode(), 'file'), ('../outside.html', b'hostile', 'file'), ('_code/indieweb.rb', b'hostile code', 'file'), ('linked.html', b'', 'link')])
            read_artifact(archive, output)
            rows = [json.loads(line) for line in output.read_text().splitlines()]
            self.assertEqual(1, rows[0]['manifest']['version'])
            self.assertEqual(name, rows[1]['path'])
            self.assertEqual('<p>café</p>', base64.b64decode(rows[1]['body']).decode())
            self.assertFalse((root.parent / 'outside.html').exists())
            self.assertFalse((root / '_code').exists())
            self.assertFalse(any(row.get('path') == 'linked.html' for row in rows))
            self.assertEqual({'pages.tar', 'pages.jsonl'}, {p.name for p in root.iterdir()})

    def test_linked_manifest_is_rejected_and_previous_data_is_preserved(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            archive, output = root / 'pages.tar', root / 'pages.jsonl'
            output.write_text('previous')
            self.create(archive, [('indieweb-manifest.json', b'', 'link')])
            with self.assertRaises(ValueError):
                read_artifact(archive, output)
            self.assertEqual('previous', output.read_text())

    def test_duplicate_manifest_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            archive = root / 'pages.tar'
            self.create(archive, [self.manifest(), self.manifest()])
            with self.assertRaises(ValueError):
                read_artifact(archive, root / 'pages.jsonl')

    def test_invalid_json_never_replaces_previous_data(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            archive, output = root / 'pages.tar', root / 'pages.jsonl'
            output.write_text('previous')
            self.create(archive, [('indieweb-manifest.json', b'invalid', 'file')])
            with self.assertRaises(ValueError):
                read_artifact(archive, output)
            self.assertEqual('previous', output.read_text())


if __name__ == '__main__':
    unittest.main()
