import Database from "better-sqlite3";
import { ensureDir } from "../utils/fs.js";
import { DATA_DIR, DB_PATH } from "../utils/paths.js";

let db: Database.Database | null = null;

const schema = `
CREATE TABLE IF NOT EXISTS raw_articles (
  id TEXT PRIMARY KEY,
  source_id TEXT,
  source_name TEXT,
  url TEXT,
  title TEXT,
  description TEXT,
  content TEXT,
  published_at TEXT,
  fetched_at TEXT,
  domain TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  date_key TEXT,
  dedupe_key TEXT,
  title TEXT,
  normalized_title TEXT,
  company TEXT,
  round TEXT,
  amount REAL,
  amount_text TEXT,
  currency TEXT,
  investors TEXT,
  tags TEXT,
  tag_reasons TEXT,
  summary TEXT,
  bullets TEXT,
  published_at TEXT,
  main_url TEXT,
  source_name TEXT,
  other_sources TEXT,
  source_count INTEGER,
  importance_score REAL,
  score_breakdown TEXT,
  reliability REAL,
  created_at TEXT,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_key);
CREATE INDEX IF NOT EXISTS idx_events_dedupe ON events(date_key, dedupe_key);

CREATE TABLE IF NOT EXISTS sent_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT,
  date_key TEXT,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS run_logs (
  date_key TEXT,
  run_at TEXT,
  status TEXT,
  errors TEXT
);
`;

export function getDb() {
  if (!db) {
    ensureDir(DATA_DIR);
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(schema);
  }
  return db;
}
