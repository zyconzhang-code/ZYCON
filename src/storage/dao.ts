import { getDb } from "./db.js";
import type { FundingEvent, RawArticle, SourceError } from "../types.js";

export function saveRawArticles(items: RawArticle[]) {
  if (!items.length) return 0;
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO raw_articles
    (id, source_id, source_name, url, title, description, content, published_at, fetched_at, domain)
    VALUES (@id, @sourceId, @sourceName, @url, @title, @description, @content, @publishedAt, @fetchedAt, @domain)
  `);
  const insertMany = db.transaction((rows: RawArticle[]) => {
    for (const row of rows) stmt.run(row as any);
  });
  insertMany(items);
  return items.length;
}

export function saveEvents(items: FundingEvent[]) {
  if (!items.length) return 0;
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO events (
      id, date_key, dedupe_key, title, normalized_title, company, round, amount, amount_text,
      currency, investors, tags, tag_reasons, summary, bullets, published_at, main_url,
      source_name, other_sources, source_count, importance_score, score_breakdown,
      reliability, created_at, updated_at
    )
    VALUES (
      @id, @dateKey, @dedupeKey, @title, @titleNormalized, @company, @round, @amount,
      @amountText, @currency, @investors, @tags, @tagReasons, @summary, @bullets,
      @publishedAt, @mainUrl, @sourceName, @otherSources, @sourceCount, @importanceScore,
      @scoreBreakdown, @reliability, @createdAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      normalized_title=excluded.normalized_title,
      company=excluded.company,
      round=excluded.round,
      amount=excluded.amount,
      amount_text=excluded.amount_text,
      currency=excluded.currency,
      investors=excluded.investors,
      tags=excluded.tags,
      tag_reasons=excluded.tag_reasons,
      summary=excluded.summary,
      bullets=excluded.bullets,
      published_at=excluded.published_at,
      main_url=excluded.main_url,
      source_name=excluded.source_name,
      other_sources=excluded.other_sources,
      source_count=excluded.source_count,
      importance_score=excluded.importance_score,
      score_breakdown=excluded.score_breakdown,
      reliability=excluded.reliability,
      updated_at=excluded.updated_at
  `);

  const insertMany = db.transaction((rows: FundingEvent[]) => {
    const now = new Date().toISOString();
    for (const row of rows) {
      stmt.run({
        ...row,
        investors: JSON.stringify(row.investors ?? []),
        tags: JSON.stringify(row.tags ?? []),
        tagReasons: JSON.stringify(row.tagReasons ?? {}),
        bullets: JSON.stringify(row.bullets ?? []),
        otherSources: JSON.stringify(row.otherSources ?? []),
        scoreBreakdown: JSON.stringify(row.scoreBreakdown ?? {}),
        createdAt: now,
        updatedAt: now
      } as any);
    }
  });

  insertMany(items);
  return items.length;
}

export function getEventsByDate(dateKey: string): FundingEvent[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM events WHERE date_key = ? ORDER BY importance_score DESC`)
    .all(dateKey) as any[];

  return rows.map((row) => ({
    id: row.id,
    dateKey: row.date_key,
    dedupeKey: row.dedupe_key,
    title: row.title,
    titleNormalized: row.normalized_title,
    company: row.company ?? undefined,
    round: row.round ?? undefined,
    amount: row.amount ?? undefined,
    amountText: row.amount_text ?? undefined,
    currency: row.currency ?? undefined,
    investors: JSON.parse(row.investors ?? "[]"),
    tags: JSON.parse(row.tags ?? "[]"),
    tagReasons: JSON.parse(row.tag_reasons ?? "{}"),
    summary: row.summary ?? "",
    bullets: JSON.parse(row.bullets ?? "[]"),
    publishedAt: row.published_at ?? undefined,
    mainUrl: row.main_url,
    sourceName: row.source_name,
    otherSources: JSON.parse(row.other_sources ?? "[]"),
    sourceCount: row.source_count ?? 1,
    importanceScore: row.importance_score ?? 0,
    scoreBreakdown: JSON.parse(row.score_breakdown ?? "{}"),
    reliability: row.reliability ?? 0
  }));
}

export function getSentEventIds(dateKey: string) {
  const db = getDb();
  const rows = db
    .prepare(`SELECT event_id FROM sent_events WHERE date_key = ?`)
    .all(dateKey) as Array<{ event_id: string }>;
  return rows.map((row) => row.event_id);
}

export function markSent(eventIds: string[], dateKey: string) {
  if (!eventIds.length) return 0;
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO sent_events (event_id, date_key, sent_at)
    VALUES (?, ?, ?)
  `);
  const now = new Date().toISOString();
  const insertMany = db.transaction((ids: string[]) => {
    for (const id of ids) {
      stmt.run(id, dateKey, now);
    }
  });
  insertMany(eventIds);
  return eventIds.length;
}

export function saveRunLog(dateKey: string, status: string, errors: SourceError[]) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO run_logs (date_key, run_at, status, errors)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(dateKey, new Date().toISOString(), status, JSON.stringify(errors ?? []));
}

export function getRunLog(dateKey: string) {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM run_logs WHERE date_key = ? ORDER BY run_at DESC LIMIT 1`)
    .get(dateKey) as any;
  if (!row) return null;
  return {
    dateKey: row.date_key,
    runAt: row.run_at,
    status: row.status,
    errors: JSON.parse(row.errors ?? "[]") as SourceError[]
  };
}
