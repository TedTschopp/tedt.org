#!/usr/bin/env python3
"""Drain private Micropub queues using repository-scoped Actions credentials.

No private payload is committed or attached as a workflow artifact. The media
repository keeps an exact copy of this script; its credential has only media API
access, and its GITHUB_TOKEN can write only that repository.
"""
import argparse
import hashlib
import html.parser
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import urllib.parse
import uuid

API = 'https://tedt.org/micropub/publisher'
MEDIA = 'https://media.tedt.org/'
MAX_FILE = 50 * 1024 * 1024
MAX_SITE = 750 * 1024 * 1024
MEDIA_ID = re.compile(r'^[a-f0-9]{64}\.(jpg|png|gif|webp|avif|mp3|ogg|wav|m4a|mp4|webm|vtt)$')

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

class APIClient:
    def __init__(self, token):
        if not token or len(token) < 32:
            raise ValueError('The private publisher credential is not configured.')
        self.token = token
        self.opener = urllib.request.build_opener(NoRedirect())

    def call(self, action, *, binary=False, **fields):
        data = json.dumps({'action': action, **fields}).encode()
        req = urllib.request.Request(API, data=data, headers={
            'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json',
            'Accept': 'application/octet-stream' if binary else 'application/json',
            'User-Agent': 'tedt.org Micropub publisher/1.0',
        })
        with self.opener.open(req, timeout=60) as response:
            limit = 5 * 1024 * 1024 if binary else 2 * 1024 * 1024
            body = response.read(limit + 1)
            if len(body) > limit:
                raise ValueError('Publisher response exceeded its bound.')
        return body if binary else json.loads(body)


def command(*args, **options):
    return subprocess.run(args, check=True, text=True, capture_output=True, **options).stdout.strip()


def checked_id(value):
    if not isinstance(value, str) or str(uuid.UUID(value)) != value:
        raise ValueError('Invalid managed entry ID.')
    return value


def entry_path(row):
    ident = checked_id(row['id'])
    created = row['created'][:10]
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', created):
        raise ValueError('Invalid creation date.')
    if not re.fullmatch(r'https://tedt\.org/updates/' + created.replace('-', '/') + r'/[a-z0-9-]+' + re.escape(ident) + r'/', row['url']) and row['url'] != f'https://tedt.org/updates/{created.replace("-", "/")}/{ident}/':
        raise ValueError('Invalid managed entry URL.')
    if not isinstance(row['revision'], int) or isinstance(row['revision'], bool) or row['revision'] < 1:
        raise ValueError('Invalid entry revision.')
    return Path('_posts/Micropub') / f'{created}-{ident}.md'


def safe_file(root, relative):
    root = Path(root).resolve()
    candidate = root / relative
    if not candidate.resolve().is_relative_to(root):
        raise ValueError('Publication path escapes its repository.')
    for item in [candidate, *candidate.parents]:
        if item == root:
            break
        if item.is_symlink():
            raise ValueError('Publication paths cannot be symlinks.')
    return candidate


def commit_paths(paths, message):
    if not paths:
        return command('git', 'rev-parse', 'HEAD'), False
    command('git', 'add', '--', *[str(p) for p in paths])
    staged = subprocess.run(['git', 'diff', '--cached', '--quiet'], check=False).returncode
    if staged == 0:
        return command('git', 'rev-parse', 'HEAD'), False
    if staged != 1:
        raise ValueError('Unable to inspect staged publication changes.')
    command('git', 'diff', '--cached', '--check')
    command('git', 'config', 'user.name', 'github-actions[bot]')
    command('git', 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com')
    command('git', 'commit', '-m', message)
    # Rebase preserves unrelated metadata/editorial work on main. A conflict fails
    # without a force push; the queue is retained until it can be reconciled.
    for attempt in range(3):
        result = subprocess.run(['git', 'push', 'origin', 'HEAD:main'], text=True, capture_output=True)
        if result.returncode == 0:
            return command('git', 'rev-parse', 'HEAD'), True
        if attempt == 2:
            raise ValueError('Publication push failed; the private queue remains pending.')
        command('git', 'pull', '--rebase', 'origin', 'main')
    raise AssertionError('unreachable')


def apply_site(client, root):
    rows = client.call('pending')['entries']
    prepared = []
    # Validate the whole snapshot before writing anything into the checkout.
    for row in rows:
        relative = entry_path(row)
        target = safe_file(root, relative)
        if not row['publish'] and 'properties' in row:
            raise ValueError('Draft or deleted content must not be exported from private storage.')
        result = subprocess.run(['bundle', 'exec', 'ruby', '_code/micropub_serialize.rb', '--existing-file', str(target)], input=json.dumps(row), text=True, capture_output=True)
        if result.returncode == 75:
            print(f'Entry {row["id"]} waits for referenced media.')
            continue
        if result.returncode != 0:
            raise ValueError('Entry validation failed; no publication files were written.')
        rendered = json.loads(result.stdout)
        if rendered['path'] != str(relative) or (row['publish'] and not isinstance(rendered['content'], str)):
            raise ValueError('Serializer returned an invalid publication path.')
        body = rendered['content']
        if row['publish']:
            ids = sorted({urllib.parse.urlsplit(value).path.rsplit('/', 1)[-1] for value in rendered['media'] if value.startswith(MEDIA + 'files/')})
            if not client.call('media-references', id=row['id'], revision=row['revision'], ids=ids).get('acknowledged'):
                print(f'Entry {row["id"]} changed before media validation; retrying its current source later.')
                continue
            readiness = subprocess.run(['bundle', 'exec', 'ruby', '_code/micropub_serialize.rb', '--check-media', '--existing-file', str(target)], input=json.dumps(row), text=True, capture_output=True)
            if readiness.returncode == 75:
                print(f'Entry {row["id"]} waits for referenced media.')
                continue
            if readiness.returncode != 0:
                raise ValueError('Media readiness validation failed; nothing was committed.')
        prepared.append((row, relative, target, body))
    for _, _, target, body in prepared:
        if body is None:
            target.unlink(missing_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(body)
    paths = [p for _, p, target, body in prepared if body is not None or subprocess.run(['git', 'ls-files', '--error-unmatch', str(p)], capture_output=True).returncode == 0]
    sha, changed = commit_paths(paths, 'Publish validated Micropub entries')
    for row, _, _, _ in prepared:
        client.call('applied', id=row['id'], revision=row['revision'], commit_sha=sha)
    print(f'Applied {len(prepared)} entries; repository changed: {changed}.')
    return bool(prepared)


class RevisionParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.values = {}
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta' and a.get('name') in ('micropub-id', 'micropub-revision'):
            self.values[a['name']] = a.get('content')


def live_entry(row, opener=None):
    ident = checked_id(row['id'])
    if not re.fullmatch(r'https://tedt\.org/updates/\d{4}/\d{2}/\d{2}/[a-z0-9-]+/', row['url']):
        raise ValueError('Invalid live confirmation URL.')
    opener = opener or urllib.request.build_opener(NoRedirect())
    req = urllib.request.Request(row['url'], headers={'Cache-Control': 'no-cache', 'User-Agent': 'tedt.org Micropub live verifier/1.0'})
    try:
        with opener.open(req, timeout=30) as response:
            data = response.read(2 * 1024 * 1024 + 1)
            if len(data) > 2 * 1024 * 1024:
                return False
            if not row['publish'] or response.status != 200:
                return False
            parsed = RevisionParser()
            parsed.feed(data.decode('utf-8'))
            return parsed.values == {'micropub-id': ident, 'micropub-revision': str(row['revision'])}
    except urllib.error.HTTPError as error:
        return not row['publish'] and error.code in (404, 410)
    except (urllib.error.URLError, TimeoutError, UnicodeDecodeError):
        return False


def confirm_site(client):
    waiting = False
    for row in client.call('candidates')['entries']:
        if live_entry(row):
            client.call('live', id=row['id'], revision=row['revision'])
            print(f'Confirmed public state for entry {row["id"]}, revision {row["revision"]}.')
        else:
            waiting = True
    return waiting


def request_deployment():
    # Do not queue a new build while another main publication is running.
    runs = json.loads(command('gh', 'run', 'list', '--repo', 'TedTschopp/tedt.org', '--workflow', 'deploy.yml', '--branch', 'main', '--limit', '5', '--json', 'status'))
    if any(row['status'] != 'completed' for row in runs):
        print('A site deployment is already pending; publication confirmation will retry.')
        return
    command('gh', 'workflow', 'run', 'deploy.yml', '--repo', 'TedTschopp/tedt.org', '--ref', 'main')
    print('Requested the existing validated Pages deployment.')


def file_hash(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        while chunk := stream.read(262144):
            digest.update(chunk)
    return digest.hexdigest()


def media_type(path, overrides):
    with path.open('rb') as stream: head = stream.read(40)
    suffix = path.suffix.lower()
    checks = {
        '.jpg': ('image/jpeg', head[:3] == b'\xff\xd8\xff'),
        '.png': ('image/png', head[:8] == b'\x89PNG\r\n\x1a\n'),
        '.gif': ('image/gif', head[:6] in (b'GIF87a', b'GIF89a')),
        '.webp': ('image/webp', head[:4] == b'RIFF' and head[8:12] == b'WEBP'),
        '.avif': ('image/avif', head[4:8] == b'ftyp' and (b'avif' in head[8:] or b'avis' in head[8:])),
        '.mp3': ('audio/mpeg', head[:3] == b'ID3' or (len(head)>1 and head[0] == 255 and head[1] & 224 == 224)),
        '.ogg': ('audio/ogg', head[:4] == b'OggS'),
        '.wav': ('audio/wav', head[:4] == b'RIFF' and head[8:12] == b'WAVE'),
        '.m4a': ('audio/mp4', head[4:8] == b'ftyp'),
        '.mp4': ('video/mp4', head[4:8] == b'ftyp'),
        '.webm': ('video/webm', head[:4] == b'\x1aE\xdf\xa3'),
        '.vtt': ('text/vtt', head.startswith(b'WEBVTT')),
    }
    if suffix not in checks or not checks[suffix][1]:
        raise ValueError('A media file has an unsupported or mismatched signature.')
    mime = checks[suffix][0]
    if suffix == '.webm' and overrides.get(path.name) == 'audio/webm': mime = 'audio/webm'
    return mime


def media_manifest(public, overrides=None):
    known = {}
    previous = public / 'manifest.json'
    if previous.exists():
        try: known = {Path(row['path']).name: row['content_type'] for row in json.loads(previous.read_text())['files']}
        except (ValueError, KeyError, TypeError): raise ValueError('The existing media manifest is malformed.')
    known.update(overrides or {})
    files = []
    total = 0
    allowed = {'index.html', 'CNAME', '.nojekyll', 'manifest.json'}
    for path in sorted(public.rglob('*')):
        if path.is_symlink():
            raise ValueError('Media publication cannot contain symlinks.')
        if not path.is_file():
            continue
        size = path.stat().st_size
        total += size
        relative = path.relative_to(public).as_posix()
        if size > MAX_FILE:
            raise ValueError('A media file exceeds the 50 MiB Git limit for this site.')
        if relative in allowed:
            continue
        if path.parent != public / 'files' or not MEDIA_ID.fullmatch(path.name):
            raise ValueError('Media must use an immutable SHA-256 filename under files/.')
        digest = file_hash(path)
        if digest != path.stem:
            raise ValueError('A media filename does not match its checksum.')
        mime = media_type(path, known)
        files.append({'path': relative, 'url': MEDIA + relative, 'content_type': mime or 'application/octet-stream', 'size': size, 'sha256': digest})
    payload = {'version': 1, 'files': files}
    encoded = json.dumps(payload, indent=2) + '\n'
    old_manifest = public / 'manifest.json'
    projected = total - (old_manifest.stat().st_size if old_manifest.exists() else 0) + len(encoded.encode())
    if projected > MAX_SITE:
        raise ValueError('The 750 MiB media site budget is full. No paid upgrade was enabled.')
    return payload, encoded


def sync_media(client, root, state_file):
    public = root / 'public'
    public.mkdir(exist_ok=True)
    pending = client.call('pending')['media']
    prepared = []
    if not pending and os.environ.get('GITHUB_EVENT_NAME') == 'schedule':
        state_file.write_text('[]')
        output = os.environ.get('GITHUB_OUTPUT')
        if output:
            with open(output, 'a') as stream: stream.write('deploy_needed=false\n')
        print('No pending uploads; media deployment is unchanged.')
        return
    for row in pending:
        if not MEDIA_ID.fullmatch(row['id']) or row['path'] != 'files/' + row['id'] or not isinstance(row['size'], int) or not 0 < row['size'] <= 5 * 1024 * 1024:
            raise ValueError('Invalid queued media metadata.')
        data = client.call('content', binary=True, id=row['id'])
        if len(data) != row['size'] or hashlib.sha256(data).hexdigest() != row['id'].split('.')[0]:
            raise ValueError('Upload checksum or length does not match.')
        target = safe_file(public, row['path'])
        if target.exists() and target.read_bytes() != data:
            raise ValueError('An immutable media URL would change content.')
        prepared.append((row, target, data))
    # Preflight all final sizes before writing/deploying the public artifact.
    current = sum(p.stat().st_size for p in public.rglob('*') if p.is_file())
    additional = sum(len(data) for _, target, data in prepared if not target.exists())
    if current + additional > MAX_SITE:
        raise ValueError('The 750 MiB media site budget is full.')
    for _, target, data in prepared:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    manifest, body = media_manifest(public, {row['id']: row['content_type'] for row, _, _ in prepared})
    (public / 'manifest.json').write_text(body)
    known = set(client.call('inventory')['ids'])
    external = sum(row['size'] for row in manifest['files'] if Path(row['path']).name not in known)
    client.call('quota', external_bytes=external)
    paths = [Path('public')]
    sha, changed = commit_paths(paths, 'Publish validated immutable media')
    state_file.write_text(json.dumps([row for row, _, _ in prepared]))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as stream: stream.write(f'deploy_needed={str(changed or bool(prepared)).lower()}\n')
    print(f'Media manifest: {len(manifest["files"])} files; {len(prepared)} uploads prepared; repository changed: {changed}.')


def confirm_media(client, state_file):
    opener = urllib.request.build_opener(NoRedirect())
    for row in json.loads(state_file.read_text()):
        if not MEDIA_ID.fullmatch(row['id']) or row['path'] != 'files/' + row['id']:
            raise ValueError('Invalid media acknowledgement.')
        with opener.open(urllib.request.Request(MEDIA + row['path'], headers={'Cache-Control': 'no-cache'}), timeout=60) as response:
            data = response.read(5 * 1024 * 1024 + 1)
            if response.status != 200 or len(data) != row['size'] or hashlib.sha256(data).hexdigest() != row['id'].split('.')[0]:
                raise ValueError('Live media differs from the saved upload; private chunks retained.')
        client.call('published', id=row['id'])
        print(f'Confirmed published media {row["id"]}.')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['site', 'confirm-site', 'media', 'confirm-media', 'check-media'])
    parser.add_argument('--commit-manifest', action='store_true')
    parser.add_argument('--root', type=Path, default=Path.cwd())
    parser.add_argument('--state', type=Path, default=Path(os.environ.get('RUNNER_TEMP', tempfile.gettempdir())) / 'indieweb-media-publication.json')
    args = parser.parse_args()
    if args.mode == 'check-media':
        _, encoded = media_manifest(args.root / 'public')
        if args.commit_manifest:
            (args.root / 'public/manifest.json').write_text(encoded)
            commit_paths([Path('public/manifest.json')], 'Update validated media manifest')
        print('Media checksums, immutable names, file limits and site budget passed.')
        return
    client = APIClient(os.environ.get('INDIEWEB_PUBLISHER_TOKEN'))
    if args.mode == 'site':
        apply_site(client, args.root)
        if confirm_site(client):
            request_deployment()
    elif args.mode == 'confirm-site':
        confirm_site(client)
    elif args.mode == 'media':
        sync_media(client, args.root, args.state)
    else:
        confirm_media(client, args.state)


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        # Never echo private queue payloads, credential-bearing requests or tokens.
        print(f'Publication stopped safely ({type(exc).__name__}); pending state is retained.', file=sys.stderr)
        if isinstance(exc, ValueError): print(str(exc)[:200], file=sys.stderr)
        sys.exit(1)
