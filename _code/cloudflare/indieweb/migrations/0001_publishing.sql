-- Private authoring state; never export this database into a public artifact.
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  properties TEXT NOT NULL CHECK (length(properties) <= 98304),
  type TEXT NOT NULL CHECK (type IN ('h-entry', 'h-event')),
  revision INTEGER NOT NULL DEFAULT 1,
  applied_revision INTEGER NOT NULL DEFAULT 0,
  live_revision INTEGER NOT NULL DEFAULT 0,
  was_public INTEGER NOT NULL DEFAULT 0,
  deleted INTEGER NOT NULL DEFAULT 0,
  created TEXT NOT NULL,
  modified TEXT NOT NULL,
  commit_sha TEXT,
  request_key TEXT UNIQUE,
  request_digest TEXT
);
CREATE INDEX IF NOT EXISTS entries_pending ON entries(applied_revision, revision);
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0 AND size <= 5242880),
  published INTEGER NOT NULL DEFAULT 0,
  complete INTEGER NOT NULL DEFAULT 0,
  created TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS media_pending ON media(published, complete, created);
CREATE TABLE IF NOT EXISTS entry_media (
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL,
  PRIMARY KEY (entry_id, media_id)
);
CREATE INDEX IF NOT EXISTS entry_media_reverse ON entry_media(media_id, entry_id);
CREATE TABLE IF NOT EXISTS media_chunks (
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  data BLOB NOT NULL,
  PRIMARY KEY (media_id, sequence)
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value INTEGER NOT NULL);
INSERT OR IGNORE INTO settings VALUES ('external_media_bytes', 0);
CREATE TRIGGER IF NOT EXISTS entry_capacity BEFORE INSERT ON entries
WHEN (SELECT count(*) FROM entries) >= 2000
BEGIN SELECT RAISE(ABORT, 'Authoring capacity reached'); END;
CREATE TRIGGER IF NOT EXISTS media_capacity BEFORE INSERT ON media
WHEN NOT EXISTS (SELECT 1 FROM media WHERE id = NEW.id)
AND (SELECT coalesce(sum(size), 0) FROM media) + NEW.size
  + (SELECT value FROM settings WHERE key = 'external_media_bytes') > 786432000
BEGIN SELECT RAISE(ABORT, 'Media capacity reached'); END;

CREATE TRIGGER IF NOT EXISTS media_record_capacity BEFORE INSERT ON media
WHEN NOT EXISTS (SELECT 1 FROM media WHERE id = NEW.id) AND (SELECT count(*) FROM media) >= 10000
BEGIN SELECT RAISE(ABORT, 'Media record capacity reached'); END;

CREATE TRIGGER IF NOT EXISTS pending_media_capacity BEFORE INSERT ON media
WHEN NOT EXISTS (SELECT 1 FROM media WHERE id = NEW.id)
AND (SELECT coalesce(sum(size), 0) FROM media WHERE published=0) + NEW.size > 67108864
BEGIN SELECT RAISE(ABORT, 'Pending media capacity reached'); END;
