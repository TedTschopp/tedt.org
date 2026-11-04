#!/usr/bin/env python3
"""Read-only service checks. Uses the Python standard library and existing quotas."""
import argparse
import concurrent.futures
import datetime as dt
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
UA = 'TedT-Service-Health/1.0 (+https://tedt.org/)'


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url, method='GET', payload=None, headers=None, read_limit=65536):
    request = urllib.request.Request(url, method=method, data=payload,
                                     headers={'User-Agent': UA, **(headers or {})})
    opener = urllib.request.build_opener(NoRedirect())
    try:
        response = opener.open(request, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        body = response.read(read_limit)
        return response.code, dict(response.headers), body


def canonical_url(url):
    u = urllib.parse.urlsplit(url)
    return (u.scheme.lower(), u.netloc.lower(), u.path or '/', u.query, u.fragment)


def public_check(check):
    try:
        status, raw_headers, body = fetch(check['url'])
        headers = {k.lower(): v for k, v in raw_headers.items()}
        if status != check['status']:
            return f"expected HTTP {check['status']}, received {status}"
        if 'location' in check and canonical_url(headers.get('location', '')) != canonical_url(check['location']):
            return 'redirect destination differs from the configured homepage'
        mime = headers.get('content-type', '').split(';', 1)[0].lower()
        if 'types' in check and mime not in check['types']:
            return f'unexpected content type: {mime or "missing"}'
        if check.get('asset') and body.lstrip().lower().startswith((b'<!doctype html', b'<html')):
            return 'asset URL returned an HTML page'
        if check.get('webfinger'):
            data = json.loads(body)
            if not data.get('subject') or not isinstance(data.get('links'), list) or not data['links']:
                return 'WebFinger document lacks its subject or links'
        if 'json_value' in check:
            data = json.loads(body)
            key, expected = check['json_value']
            if data.get(key) != expected:
                return f'health document has an unexpected {key}'
        if 'json_keys' in check:
            data = json.loads(body)
            if not isinstance(data, dict) or any(key not in data for key in check['json_keys']):
                return 'discovery document is missing required keys'
        return None
    except (OSError, ValueError, KeyError) as error:
        return f'{type(error).__name__}: {error}'


def public_checks(policy, retry_delay):
    checks = policy['public_checks'][:]
    for domain, target in policy['redirects'].items():
        for host in (domain, 'www.' + domain):
            for scheme, path in [('http', '/'), ('https', '/'), ('https', '/__health_check?source=service-health')]:
                checks.append({'url': f'{scheme}://{host}{path}', 'status': 301, 'location': target})
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        initial = list(pool.map(public_check, checks))
    failed = [(check, error) for check, error in zip(checks, initial) if error]
    if failed and retry_delay:
        time.sleep(retry_delay)
    failures = []
    for check, _ in failed:
        error = public_check(check)
        if error:
            failures.append(f"{check['url']}: {error}")
    return {'checks': len(checks), 'initial_failures': len(failed), 'failures': failures}


def cf_api(account, token, path, body=None):
    url = f'https://api.cloudflare.com/client/v4/accounts/{account}/{path}'
    payload = json.dumps(body).encode() if body is not None else None
    status, _, raw = fetch(url, 'POST' if payload else 'GET', payload,
                           {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}, read_limit=2097152)
    if status != 200:
        raise RuntimeError(f'Cloudflare {path.split("?")[0]} returned HTTP {status}; check the existing token permissions')
    data = json.loads(raw)
    if not data.get('success'):
        raise RuntimeError(f'Cloudflare {path.split("?")[0]} did not report success')
    return data['result']


def logging_errors(workers, policy):
    actual = {w['id']: w for w in workers}
    errors = []
    for name, rate in policy['worker_sampling'].items():
        worker = actual.get(name, {})
        obs = worker.get('observability') or {}
        logs = obs.get('logs') or {}
        if not (obs.get('enabled') and logs.get('enabled') and logs.get('persist', True)
                and logs.get('invocation_logs') and obs.get('redact_query_string')
                and logs.get('head_sampling_rate', obs.get('head_sampling_rate', 1)) == rate):
            errors.append(f'{name}: retained logging, redaction or sampling differs from policy')
        if (worker.get('logpush') or (obs.get('traces') or {}).get('enabled')
                or any(d != 'cloudflare' for d in (logs.get('destinations') or []))):
            errors.append(f'{name}: an export or tracing configuration needs a cost review')
    return errors


def cron_errors(events, names, now_ms, max_age_minutes=20):
    errors = []
    for name in names:
        successful = [e['timestamp'] for e in events
                      if e.get('$workers', {}).get('scriptName') == name
                      and e.get('$workers', {}).get('eventType') == 'scheduled'
                      and e.get('$workers', {}).get('outcome') == 'ok']
        if not successful or max(successful) < now_ms - max_age_minutes * 60000:
            errors.append(f'{name}: no successful scheduled invocation observed in {max_age_minutes} minutes')
    return errors


def usage_summary(usage, today):
    # Rolling 30-day activity is a conservative early warning, not a billing statement.
    count = usage['events']
    size = sum(x.get('eventSize', 0) for x in usage.get('breakdown', []))
    after_change = today >= dt.date(2026, 12, 1)
    threshold = 5_000_000_000 if after_change else 2_000_000
    measured = size if after_change else count
    warning = measured >= threshold
    return {'rolling_30_day_events': count, 'rolling_30_day_bytes': size,
            'warning_threshold': threshold, 'warning_unit': 'bytes' if after_change else 'events',
            'warning': warning, 'hard_spending_cap': False}


def cloudflare_checks(policy):
    token = os.environ.get('CLOUDFLARE_API_TOKEN', '')
    if not token:
        raise RuntimeError('The existing CLOUDFLARE_API_TOKEN is unavailable; no new credential is created')
    account = policy['account_id']
    errors = logging_errors(cf_api(account, token, 'workers/scripts'), policy)
    end = int(time.time() * 1000)
    events = []
    for name in policy['scheduled_workers']:
        result = cf_api(account, token, 'workers/observability/telemetry/query', {
            'queryId': 'scheduled-service-health', 'dry': True, 'view': 'events', 'limit': 20,
            'timeframe': {'from': end - 30 * 60000, 'to': end},
            'parameters': {'datasets': [], 'filterCombination': 'and', 'filters': [
                {'key': '$metadata.service', 'operation': 'eq', 'type': 'string', 'value': name},
                {'key': '$workers.eventType', 'operation': 'eq', 'type': 'string', 'value': 'scheduled'}]}})
        events.extend(result['events']['events'])
    errors.extend(cron_errors(events, policy['scheduled_workers'], end))
    query = urllib.parse.urlencode({'from': end - 30 * 86400000, 'to': end, 'tz': 'America/Los_Angeles'})
    usage = usage_summary(cf_api(account, token, 'workers/observability/usage?' + query), dt.datetime.now(dt.timezone.utc).date())
    if usage['warning']:
        errors.append('Logging usage crossed the early-warning threshold; review sampling and shared usage')
    return {'failures': errors, 'usage': usage, 'scheduled_workers_checked': len(policy['scheduled_workers'])}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['public', 'cloudflare'], default='public')
    parser.add_argument('--policy', type=Path, default=ROOT / 'policy.json')
    parser.add_argument('--retry-delay', type=float, default=10)
    args = parser.parse_args()
    policy = json.loads(args.policy.read_text())
    try:
        result = public_checks(policy, args.retry_delay) if args.mode == 'public' else cloudflare_checks(policy)
    except (OSError, ValueError, KeyError, RuntimeError) as error:
        result = {'failures': [str(error)]}
    print(json.dumps(result, indent=2))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as out:
            out.write(f"### Service Health: {args.mode.title()}\n\n")
            out.write('Checks passed.\n' if not result['failures'] else '\n'.join('- ' + e for e in result['failures']) + '\n')
            if 'usage' in result:
                out.write('\n```json\n' + json.dumps(result['usage'], indent=2) + '\n```\n')
    return bool(result['failures'])


if __name__ == '__main__':
    sys.exit(main())
