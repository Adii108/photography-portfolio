-- Migration: create photos table
CREATE TABLE IF NOT EXISTS photos (
  id         TEXT PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  image_key  TEXT NOT NULL,
  image_url  TEXT NOT NULL,
  caption    TEXT,
  place      TEXT,
  category   TEXT DEFAULT 'other',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category   ON photos(category);
