#!/usr/bin/env python3
"""One publication ledger for audit, recovery, and serialized Mastodon publishing.

Audit is offline and read-only. --online reads public API data. --write persists
verified mappings. Live publication additionally requires the repository pause
switch, the expected Mastodon account, and durable GitHub intent persistence.
"""
from __future__ import annotations

import argparse
import base64
import copy
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from urllib import error, parse, request

ROOT = Path(__file__).resolve().parents[1]
LEDGER_PATH = "cache/mastodon-ledger.json"
LEGACY_PATH = "cache/jsonfeed-to-mastodon.json"
STATE_BRANCH = "mastodon-state"
PUBLIC_VISIBILITY = {"public", "unlisted"}


class SyncError(RuntimeError):
    pass


class RemoteError(SyncError):
    def __init__(self, status, location):
        self.status = status
        super().__init__(f"HTTP {status} from {location}")


def timestamp(value=None):
    value = value or dt.datetime.now(dt.timezone.utc)
    return value.astimezone(dt.timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def instant(value):
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError) as exc:
        raise SyncError("Invalid publication timestamp") from exc
    if parsed.tzinfo is None:
        raise SyncError("Publication timestamps must include a timezone")
    return parsed.astimezone(dt.timezone.utc)


def web_url(value):
    """Normalize owned web URLs without changing case or adding path segments."""
    parts = parse.urlsplit(value)
    if parts.scheme not in {"http", "https"} or not parts.hostname or parts.username or parts.password:
        raise SyncError("Expected an absolute public HTTP(S) URL")
    host = parts.hostname.lower()
    if host == "www.tedt.org":
        host = "tedt.org"
    if parts.port and parts.port != 443:
        raise SyncError("Publication URLs must use the standard HTTPS port")
    path = parse.quote(parts.path or "/", safe="/%:@!$&'()*+,;=-._~")
    path = re.sub(r"%[0-9a-fA-F]{2}", lambda match: match[0].upper(), path)
    return parse.urlunsplit(("https", host, path, "", ""))


def numeric_id(value):
    return isinstance(value, str) and re.fullmatch(r"[0-9]+", value) is not None


def status_reference(value, instance, username):
    if isinstance(value, dict):
        url = value.get("url")
        mid = str(value.get("id") or "")
    else:
        url, mid = value, ""
    if isinstance(url, str) and url.startswith("https://"):
        parts = parse.urlsplit(url)
        match = re.fullmatch(r"/(?:@[^/]+/|users/[^/]+/statuses/)([0-9]+)/?", parts.path)
        if parts.netloc == parse.urlsplit(instance).netloc and match:
            return {"id": match[1], "url": url}
        return None
    if numeric_id(mid):
        return {"id": mid, "url": f"{instance}/@{username}/{mid}"}
    return None


def load_json(path, default=None):
    if not path.exists():
        if default is not None:
            return copy.deepcopy(default)
        raise SyncError(f"Missing input: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError) as exc:
        raise SyncError(f"Cannot read JSON input {path}: {exc}") from exc


def atomic_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(dir=path.parent, prefix=".mastodon-")
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            json.dump(data, stream, indent=2, ensure_ascii=False, sort_keys=True)
            stream.write("\n")
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


class NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def http_json(url, method="GET", token=None, data=None, headers=None):
    payload = json.dumps(data).encode() if data is not None else None
    configured = {"Accept": "application/json", "User-Agent": "tedt.org-mastodon-sync/1"}
    if token:
        configured["Authorization"] = f"Bearer {token}"
    if payload is not None:
        configured["Content-Type"] = "application/json"
    configured.update(headers or {})
    req = request.Request(url, data=payload, headers=configured, method=method)
    try:
        with request.build_opener(NoRedirect).open(req, timeout=30) as response:
            raw = response.read(20_000_001)
            if len(raw) > 20_000_000:
                raise SyncError("Remote JSON exceeded the size limit")
            return json.loads(raw)
    except error.HTTPError as exc:
        # Do not log response bodies: authenticated endpoints may contain private data.
        raise RemoteError(exc.code, parse.urlsplit(url).hostname) from exc
    except (error.URLError, TimeoutError, ValueError, OSError) as exc:
        raise SyncError(f"Could not complete {method} request to {parse.urlsplit(url).hostname}") from exc


class GitHubStore:
    """CAS writes on a state branch; an intent must be durable before POST."""
    durable = True

    def __init__(self, repository, token, bootstrap):
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository) or not token:
            raise SyncError("Durable state requires GITHUB_REPOSITORY and GITHUB_TOKEN")
        self.base = f"https://api.github.com/repos/{repository}"
        self.token = token
        self.bootstrap = bootstrap
        self.sha = None
        self.previous = None
        self.branch_exists = True

    def api(self, path, method="GET", data=None):
        return http_json(self.base + path, method, self.token, data,
                         {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"})

    def read_remote(self):
        result = self.api(f"/contents/{LEDGER_PATH}?ref={STATE_BRANCH}")
        blob = result if result.get("encoding") == "base64" else self.api(f"/git/blobs/{result['sha']}")
        if blob.get("encoding") != "base64":
            raise SyncError("Unexpected GitHub ledger encoding")
        return json.loads(base64.b64decode(blob["content"])), result["sha"]

    def load(self):
        try:
            self.api(f"/git/ref/heads/{STATE_BRANCH}")
        except RemoteError as exc:
            if exc.status != 404:
                raise
            if self.bootstrap.get("durable_initialized_at"):
                raise SyncError("The previously initialized mastodon-state branch is missing; restore its history before publishing") from exc
            self.branch_exists = False
            self.previous = copy.deepcopy(self.bootstrap)
            return copy.deepcopy(self.bootstrap)
        self.previous, self.sha = self.read_remote()
        return copy.deepcopy(self.previous)

    def save(self, ledger):
        if not self.branch_exists:
            main = self.api("/git/ref/heads/main")
            self.api("/git/refs", "POST", {"ref": f"refs/heads/{STATE_BRANCH}", "sha": main["object"]["sha"]})
            self.branch_exists = True
            try:
                old, self.sha = self.read_remote()
                if old != self.previous:
                    raise SyncError("State changed during branch initialization; reconcile again")
            except RemoteError as exc:
                if exc.status != 404:
                    raise
        ledger.setdefault("durable_initialized_at", timestamp())
        body = {
            "message": "chore(mastodon): persist publication state",
            "branch": STATE_BRANCH,
            "content": base64.b64encode((json.dumps(ledger, indent=2, ensure_ascii=False, sort_keys=True) + "\n").encode()).decode(),
        }
        for attempt in range(3):
            if self.sha:
                body["sha"] = self.sha
            try:
                result = self.api(f"/contents/{LEDGER_PATH}", "PUT", body)
                self.sha = result["content"]["sha"]
                self.previous = copy.deepcopy(ledger)
                return
            except RemoteError as exc:
                if exc.status != 409 or attempt == 2:
                    raise
                latest, self.sha = self.read_remote()
                if latest != self.previous:
                    raise SyncError("Another writer changed the ledger; reconcile without repeating publication") from exc


class LocalStore:
    durable = False

    def __init__(self, path):
        self.path = path

    def load(self):
        return load_json(self.path, {"version": 1, "entries": {}})

    def save(self, ledger):
        atomic_json(self.path, ledger)


class Links(HTMLParser):
    def __init__(self, content):
        super().__init__(convert_charrefs=True)
        self.urls = set()
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            href = dict(attrs).get("href", "")
            try:
                self.urls.add(web_url(href))
            except (SyncError, ValueError):
                pass


class Mastodon:
    def __init__(self, instance, username, token=None):
        self.instance = instance.rstrip("/")
        self.username = username
        self.token = token
        self.account_id = None
        if web_url(self.instance) != "https://tschopp.net/" or username != "Ted":
            raise SyncError("This publisher is configured only for @Ted@tschopp.net")

    def api(self, path, method="GET", data=None, headers=None):
        return http_json(self.instance + path, method, self.token, data, headers)

    def account(self, verify=False):
        account = self.api("/api/v1/accounts/lookup?" + parse.urlencode({"acct": self.username}))
        if not numeric_id(account.get("id")) or account.get("username", "").lower() != self.username.lower():
            raise SyncError("The Mastodon account lookup did not match the configured identity")
        self.account_id = account["id"]
        if verify:
            if not self.token:
                raise SyncError("MASTODON_TOKEN is required for publication")
            identity = self.api("/api/v1/accounts/verify_credentials")
            if identity.get("id") != self.account_id:
                raise SyncError("MASTODON_TOKEN belongs to a different account")
        return account

    def timeline(self):
        if not self.account_id:
            self.account()
        statuses, seen, cursor = [], set(), None
        for _ in range(250):
            query = {"limit": 40, "exclude_reblogs": "true", "exclude_replies": "true"}
            if cursor:
                query["max_id"] = cursor
            page = self.api(f"/api/v1/accounts/{self.account_id}/statuses?" + parse.urlencode(query))
            if not isinstance(page, list):
                raise SyncError("Unexpected account timeline response")
            if not page:
                return statuses
            identifiers = [row.get("id") for row in page]
            if not all(numeric_id(mid) for mid in identifiers):
                raise SyncError("Mastodon returned an invalid status ID")
            next_cursor = min(identifiers, key=int)
            if cursor and int(next_cursor) >= int(cursor):
                raise SyncError("Timeline pagination stalled; absence cannot be established")
            for status in page:
                if status["id"] not in seen and not status.get("reblog"):
                    seen.add(status["id"])
                    if status.get("visibility") in PUBLIC_VISIBILITY:
                        statuses.append(status)
            cursor = next_cursor
        raise SyncError("Timeline exceeded the page limit; refusing incomplete reconciliation")

    def status(self, mid):
        try:
            return self.api(f"/api/v1/statuses/{mid}")
        except RemoteError as exc:
            if exc.status in {404, 410}:
                return None
            raise

    def create(self, content, key):
        return self.api("/api/v1/statuses", "POST", {"status": content, "visibility": "public", "language": "en"},
                        {"Idempotency-Key": key})


def add_history(entry, reference):
    if reference and reference["id"] not in {row["id"] for row in entry["history"]}:
        entry["history"].append(reference)


def prepare_ledger(manifest, ledger, legacy, now):
    if manifest.get("version") != 1 or not isinstance(manifest.get("items"), list):
        raise SyncError("Unsupported publication manifest")
    if ledger.get("version") != 1 or not isinstance(ledger.get("entries"), dict):
        raise SyncError("Unsupported publication ledger; refusing to reset history")
    initial = not ledger.get("initialized_at")
    ledger.setdefault("receipts", [])
    ledger.setdefault("unmatched_legacy", {})
    ledger.setdefault("account", {"instance": manifest["instance"], "username": manifest["username"]})
    if ledger["account"] != {"instance": manifest["instance"], "username": manifest["username"]}:
        raise SyncError("Ledger account differs from the manifest")
    alias_index = {}
    for entry in ledger["entries"].values():
        entry["source_paths"] = []
        entry["preferred_ids"] = []
    for item in manifest["items"]:
        key = web_url(item["canonical_url"])
        if not item.get("source_path", "").startswith("_posts/") or ".." in Path(item["source_path"]).parts:
            raise SyncError("Manifest source is not a post path")
        instant(item["published_at"])
        if not isinstance(item["content_text"], str) or len(item["content_text"]) > 480:
            raise SyncError("Manifest status text exceeds the publication limit")
        entry = ledger["entries"].setdefault(key, {
            "canonical_url": key, "first_seen_at": now, "queue_kind": "archive" if initial else "new",
            "state": "pending", "history": [], "generation": 0,
        })
        entry["eligible"] = True
        entry["title"] = item["title"]
        entry["published_at"] = min(entry.get("published_at", item["published_at"]), item["published_at"])
        # Aliased prompts share a single announcement with the canonical page's title.
        if ("content_text" not in entry
                or parse.urlsplit(web_url(item["aliases"][0])).path == parse.urlsplit(key).path):
            entry["content_text"] = item["content_text"]
        entry.setdefault("source_paths", [])
        if item["source_path"] not in entry["source_paths"]:
            entry["source_paths"].append(item["source_path"])
        entry.setdefault("aliases", [])
        for alias in item["aliases"] + [key]:
            normalized = web_url(alias)
            if normalized not in entry["aliases"]:
                entry["aliases"].append(normalized)
            alias_index.setdefault(normalized, set()).add(key)
        mid = item.get("mastodon_post_id")
        if mid and not numeric_id(mid):
            raise SyncError(f"Non-numeric Mastodon ID in {item['source_path']}")
        if mid:
            reference = status_reference({"id": mid, "url": item.get("mastodon_post_url")}, manifest["instance"], manifest["username"])
            if reference is None:
                raise SyncError(f"Unsupported Mastodon thread URL in {item['source_path']}")
            add_history(entry, reference)
            entry.setdefault("preferred_ids", [])
            if mid not in entry["preferred_ids"]:
                entry["preferred_ids"].append(mid)
    current = {web_url(row["canonical_url"]) for row in manifest["items"]}
    for key, entry in ledger["entries"].items():
        entry["eligible"] = key in current
        entry["aliases"] = [alias for alias in entry.get("aliases", [])
                            if len(alias_index.get(alias, {key})) == 1 or alias == key]
    if not ledger.get("legacy_imported_at"):
        for old_key, old in legacy.items():
            if not isinstance(old, dict):
                raise SyncError("Unexpected legacy cache entry")
            keys = set()
            for alias in [old_key, old.get("url"), old.get("id")]:
                if not isinstance(alias, str):
                    continue
                try:
                    normalized = web_url(parse.urljoin("https://tedt.org/", alias))
                    keys.update(alias_index.get(normalized, set()))
                    exposed_markdown = re.sub(r"\.md/?$", "/", normalized)
                    keys.update(alias_index.get(exposed_markdown, set()))
                except (ValueError, SyncError):
                    pass
            references = [status_reference(value, manifest["instance"], manifest["username"]) for value in old.get("toots", [])]
            if len(keys) == 1:
                entry = ledger["entries"][keys.pop()]
                for reference in references:
                    add_history(entry, reference)
            else:
                ledger["unmatched_legacy"][old_key] = [value for value in references if value]
        ledger["legacy_imported_at"] = now
    if initial:
        ledger["initialized_at"] = now
    return ledger


def public_status(status, account_id):
    if (not numeric_id(status.get("id")) or status.get("account", {}).get("id") != account_id
            or status.get("visibility") not in PUBLIC_VISIBILITY or status.get("reblog")):
        raise SyncError("A recorded status is private or does not belong to the publishing account")
    url = status.get("url")
    reference = status_reference(url, "https://tschopp.net", "Ted")
    if not reference or reference["id"] != status["id"]:
        raise SyncError("Unexpected canonical Mastodon status URL")
    instant(status["created_at"])
    return {"id": status["id"], "url": url, "created_at": status["created_at"]}


def confirm(entry, status, ledger, now, account_id):
    reference = public_status(status, account_id)
    add_history(entry, reference)
    operation = entry.pop("intent", None)
    if operation:
        if operation["key"] not in {receipt["operation"] for receipt in ledger["receipts"]}:
            ledger["receipts"].append({"operation": operation["key"], "kind": operation["kind"],
                                       "canonical_url": entry["canonical_url"], **reference})
        ledger["last_publication_at"] = reference["created_at"]
        entry["state"] = "published"
    else:
        entry["state"] = "published" if entry.get("state") == "published" else "recovered"
    entry["status"] = reference
    entry["verified_at"] = now
    entry.pop("missing_checked_at", None)


def reconcile(ledger, client, now):
    statuses = client.timeline()  # Must finish pagination before interpreting absence.
    by_id, by_url = {}, {}
    for status in statuses:
        public_status(status, client.account_id)
        by_id[status["id"]] = status
        for url in Links(status.get("content", "")).urls:
            by_url.setdefault(url, []).append(status)
    for entry in ledger["entries"].values():
        if not entry["eligible"]:
            continue
        known_ids = {row["id"] for row in entry["history"]}
        candidates = {mid: by_id[mid] for mid in known_ids if mid in by_id}
        for alias in entry["aliases"]:
            candidates.update({row["id"]: row for row in by_url.get(alias, [])})
        preferred = entry.get("status", {}).get("id")
        if preferred in candidates:
            chosen = candidates[preferred]
        elif candidates:
            preferred_matches = [row for row in candidates.values() if row["id"] in entry.get("preferred_ids", [])]
            chosen = min(preferred_matches or list(candidates.values()), key=lambda row: (instant(row["created_at"]), int(row["id"])))
        else:
            chosen = None
        if chosen:
            confirm(entry, chosen, ledger, now, client.account_id)
        elif known_ids and entry.get("state") == "missing" and entry.get("missing_checked_at"):
            # A complete current timeline can recover a restored status. Recheck
            # a confirmed 404 directly only when this item reaches publication.
            entry["state"] = "missing"
        elif known_ids:
            # Check a known root directly: timeline absence alone is not a deletion.
            mid = preferred or min(known_ids, key=int)
            status = client.status(mid)
            if status is not None:
                confirm(entry, status, ledger, now, client.account_id)
            else:
                entry["state"] = "uncertain" if entry.get("intent") else "missing"
                entry["missing_checked_at"] = now
        else:
            entry["state"] = "uncertain" if entry.get("intent") else "pending"
        entry["reconciled_at"] = now
    ledger["last_reconciliation_at"] = now
    ledger["live_status_count"] = len(statuses)


def queued(ledger, now, backfill=False):
    ready = [entry for entry in ledger["entries"].values()
             if entry["eligible"] and entry["state"] in {"pending", "missing", "uncertain"}]
    ready = [entry for entry in ready if entry.get("reconciled_at") == now]
    fresh = sorted((entry for entry in ready if entry["queue_kind"] == "new"), key=lambda row: (row["published_at"], row["canonical_url"]))
    receipts = ledger.get("receipts", [])
    current = instant(now)
    # Preserve a global hour between announcements, including deploy-triggered runs.
    if any(current - instant(row["created_at"]) < dt.timedelta(hours=1) for row in receipts):
        return None, "global_cooldown"
    if fresh:
        return fresh[0], "new"
    if not backfill:
        return None, "backfill_paused"
    archive = [row for row in receipts if row["kind"] == "archive"]
    if any(current - instant(row["created_at"]) < dt.timedelta(hours=2) for row in archive):
        return None, "archive_cooldown"
    if sum(current - instant(row["created_at"]) < dt.timedelta(hours=24) for row in archive) >= 12:
        return None, "archive_daily_limit"
    older = sorted((entry for entry in ready if entry["queue_kind"] == "archive"), key=lambda row: (row["published_at"], row["canonical_url"]))
    return (older[0], "archive") if older else (None, "queue_empty")


def publish_one(ledger, client, store, now, enabled=False, backfill=False):
    if not enabled:
        raise SyncError("Publication is paused: set MASTODON_PUBLISH_ENABLED=true after the rollout checks")
    if not store.durable:
        raise SyncError("Publication requires durable GitHub state; local writes cannot authorize a POST")
    client.account(verify=True)
    entry, reason = queued(ledger, now, backfill)
    if entry is None:
        return {"published": False, "reason": reason}
    if entry["state"] == "missing" and entry.get("history") and entry.get("missing_checked_at") != now:
        mid = entry.get("status", {}).get("id") or min((row["id"] for row in entry["history"]), key=int)
        previous = client.status(mid)
        if previous is not None:
            confirm(entry, previous, ledger, now, client.account_id)
            store.save(ledger)
            return {"published": False, "reason": "existing_thread_recovered"}
        entry["missing_checked_at"] = now
    if not entry.get("intent"):
        entry["generation"] += 1
        key = hashlib.sha256(f"tedt.org|{entry['canonical_url']}|{entry['generation']}".encode()).hexdigest()
        entry["intent"] = {"key": key, "kind": entry["queue_kind"], "started_at": now}
    entry["state"] = "uncertain"
    store.save(ledger)  # A failed intent commit must prevent the external POST.
    result = client.create(entry["content_text"], entry["intent"]["key"])
    confirm(entry, result, ledger, now, client.account_id)
    store.save(ledger)  # Failure leaves the durable intent for the next reconciliation.
    return {"published": True, "url": entry["status"]["url"], "kind": entry["queue_kind"]}


def patch_frontmatter(path, reference):
    original = path.read_bytes()
    text = original.decode("utf-8")
    match = re.match(r"\A---[ \t]*\r?\n(.*?)^---[ \t]*(?:\r?\n|$)", text, re.M | re.S)
    if not match:
        raise SyncError(f"Malformed front matter: {path}")
    newline = "\r\n" if "\r\n" in match[0] else "\n"
    lines = match[1].splitlines(keepends=True)
    replacements = {"mastodon-post-id": reference["id"], "mastodon-post-url": reference["url"]}
    output, seen = [], set()
    for line in lines:
        key = next((key for key in replacements if re.match(rf"^{key}:", line)), None)
        if key:
            if key not in seen:
                output.append(f"{key}: {json.dumps(replacements[key])}{newline}")
                seen.add(key)
        else:
            output.append(line)
    for key, value in replacements.items():
        if key not in seen:
            output.append(f"{key}: {json.dumps(value)}{newline}")
    updated = (text[:match.start(1)] + "".join(output) + text[match.end(1):]).encode()
    if updated != original:
        path.write_bytes(updated)
        return True
    return False


def sync_sources(root, ledger):
    updated = 0
    for entry in ledger["entries"].values():
        if not entry["eligible"] or entry["state"] not in {"recovered", "published"}:
            continue
        for source in entry["source_paths"]:
            path = (root / source).resolve()
            if not path.is_relative_to(root.resolve() / "_posts") or not path.is_file():
                raise SyncError("A ledger source is not an existing post")
            updated += patch_frontmatter(path, entry["status"])
    return updated


def summary(ledger, now, result=None):
    counts = {}
    eligible = [row for row in ledger["entries"].values() if row["eligible"]]
    for entry in eligible:
        counts[entry["state"]] = counts.get(entry["state"], 0) + 1
    pending = sum(counts.get(key, 0) for key in ("pending", "missing", "uncertain"))
    return {
        "version": 1, "last_run_at": now, "last_reconciliation_at": ledger.get("last_reconciliation_at"),
        "last_publication_at": ledger.get("last_publication_at"), "eligible": len(eligible),
        "remaining": pending, "states": counts, "confirmed_publications": len(ledger.get("receipts", [])),
        "unmatched_legacy_entries": len(ledger.get("unmatched_legacy", {})), "result": result or {},
        "has_history": bool(ledger.get("last_reconciliation_at")),
        "runs": ledger.get("run_count", 0), "initial_missing": ledger.get("initial_missing", len(eligible)),
        "current_missing": pending, "total_processed": len(ledger.get("receipts", [])),
        "completion_percent": round(100 * (len(eligible) - pending) / len(eligible), 1) if eligible else 0,
        "last_updated": ledger.get("last_reconciliation_at"),
        "publication_enabled": os.environ.get("MASTODON_PUBLISH_ENABLED") == "true",
        "backfill_enabled": os.environ.get("MASTODON_BACKFILL_ENABLED") == "true",
    }


def export_manifest(root):
    result = subprocess.run(["bundle", "exec", "ruby", "-W0", str(root / "_code/mastodon_manifest.rb"), "--root", str(root)],
                            cwd=root, text=True, capture_output=True)
    if result.returncode:
        raise SyncError("Jekyll manifest export failed: " + result.stderr[-3000:])
    return json.loads(result.stdout)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["audit", "reconcile", "publish"], nargs="?", default="audit")
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--ledger", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--online", action="store_true")
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--github-state", action="store_true")
    parser.add_argument("--archive-canary", action="store_true", help="Allow one manually dispatched archive item while automatic backfill remains paused")
    args = parser.parse_args(argv)
    if args.archive_canary and (args.mode != "publish" or os.environ.get("GITHUB_EVENT_NAME") != "workflow_dispatch"
                               or os.environ.get("GITHUB_REF") != "refs/heads/main"):
        raise SyncError("An archive canary is available only through a manual publish dispatch on main")
    root = args.root.resolve()
    now = timestamp()
    manifest = load_json(args.manifest) if args.manifest else export_manifest(root)
    local = args.ledger or root / LEDGER_PATH
    bootstrap = load_json(local, {"version": 1, "entries": {}})
    store = (GitHubStore(os.environ.get("GITHUB_REPOSITORY", ""), os.environ.get("GITHUB_TOKEN", ""), bootstrap)
             if args.github_state else LocalStore(local))
    ledger = prepare_ledger(manifest, store.load(), load_json(root / LEGACY_PATH, {}), now)
    result = {"mode": args.mode, "dry_run": not args.write, "online": args.online or args.mode != "audit", "archive_canary": args.archive_canary}
    try:
        if result["online"]:
            client = Mastodon(manifest["instance"], manifest["username"], os.environ.get("MASTODON_TOKEN"))
            reconcile(ledger, client, now)
        if args.mode == "publish" and args.write:
            result.update(publish_one(ledger, client, store, now,
                                     enabled=os.environ.get("MASTODON_PUBLISH_ENABLED") == "true",
                                     backfill=args.archive_canary or os.environ.get("MASTODON_BACKFILL_ENABLED") == "true"))
        elif args.mode == "publish":
            candidate, reason = queued(ledger, now, args.archive_canary or os.environ.get("MASTODON_BACKFILL_ENABLED") == "true")
            result.update({"would_publish": candidate["canonical_url"] if candidate else None, "reason": reason})
        if args.write:
            if not result["online"]:
                raise SyncError("Offline audit cannot write verified thread mappings")
            ledger["run_count"] = ledger.get("run_count", 0) + 1
            ledger.setdefault("initial_missing", len([row for row in ledger["entries"].values() if row["eligible"]]))
            store.save(ledger)
            atomic_json(local, ledger)
            result["updated_sources"] = sync_sources(root, ledger)
            atomic_json(root / "_data/mastodon_status.json", summary(ledger, now, result))
        report = summary(ledger, now, result)
        if args.report:
            atomic_json(args.report, report)
        print(json.dumps(report, indent=2))
        return 0
    except SyncError as exc:
        result["error"] = str(exc)
        # Preserve receipts as a diagnostic artifact even if remote persistence failed.
        if args.report:
            atomic_json(args.report, summary(ledger, now, result))
            atomic_json(args.report.with_suffix(".ledger.json"), ledger)
        raise


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (SyncError, ValueError, KeyError) as exc:
        print(f"Mastodon sync failed: {exc}", file=sys.stderr)
        sys.exit(1)
