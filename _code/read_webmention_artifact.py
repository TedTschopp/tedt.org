#!/usr/bin/env python3
"""Read Pages archives as data. Never extract archive paths into the runner."""
import argparse
import base64
import json
import os
from pathlib import Path
import tarfile
import tempfile


def read_artifact(archive_path, output_path):
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tarfile.open(archive_path, 'r:*') as archive:
            members = []
            for member in archive:
                members.append(member)
                if len(members) > 50000:
                    raise ValueError('Pages archive has too many entries')
            manifests = [m for m in members if m.name.removeprefix('./') == 'indieweb-manifest.json']
            if len(manifests) != 1 or not manifests[0].isfile() or manifests[0].size > 2 * 1024 * 1024:
                raise ValueError('Pages archive must have one regular, bounded manifest')
            manifest = json.loads(archive.extractfile(manifests[0]).read())
            if not isinstance(manifest, dict) or manifest.get('version') != 1:
                raise ValueError('Unsupported Pages manifest')
            with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=output.parent, delete=False) as stream:
                temporary = Path(stream.name)
                stream.write(json.dumps({'manifest': manifest}) + '\n')
                total = 0
                for member in members:
                    if not member.isfile() or not member.name.endswith('.html') or member.size > 4 * 1024 * 1024:
                        continue
                    total += member.size
                    if total > 256 * 1024 * 1024:
                        raise ValueError('Pages HTML exceeds the data limit')
                    body = archive.extractfile(member).read()
                    stream.write(json.dumps({'path': member.name.removeprefix('./'), 'body': base64.b64encode(body).decode('ascii')}) + '\n')
            os.replace(temporary, output)
            temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive')
    parser.add_argument('output')
    args = parser.parse_args()
    try:
        read_artifact(args.archive, args.output)
    except (OSError, ValueError, tarfile.TarError) as error:
        parser.exit(1, f'Pages artifact: {error}\n')
