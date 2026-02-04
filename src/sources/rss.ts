import Parser from "rss-parser";
import config from "../config/index.js";
import { loadRssSources } from "../config/data.js";
import { DomainRateLimiter } from "../utils/rateLimiter.js";
import { fetchWithRetry } from "../utils/http.js";
import { parseDate, withinLookback } from "../utils/date.js";
import { sha256 } from "../utils/hash.js";
import { getDomain, normalizeUrl } from "../utils/url.js";
import type { RawArticle, SourceError } from "../types.js";
import type { SourceFetchResult } from "./types.js";

const parser = new Parser({
  customFields: {
    item: ["content:encoded", "content:encodedSnippet"]
  }
});

const limiter = new DomainRateLimiter(config.domainRateLimitMs);

export async function fetchRssSources(): Promise<SourceFetchResult> {
  const items: RawArticle[] = [];
  const errors: SourceError[] = [];
  const sources = loadRssSources().filter((source) => source.enabled);

  for (const source of sources) {
    try {
      const res = await fetchWithRetry(
        source.url,
        {
          timeoutMs: config.requestTimeoutMs,
          retries: config.maxRetries,
          headers: { "User-Agent": "FundingDailyBot/1.0" }
        },
        limiter
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const xml = await res.text();
      const feed = await parser.parseString(xml);
      for (const entry of feed.items) {
        const publishedAt = entry.isoDate ?? entry.pubDate ?? undefined;
        const dt = parseDate(publishedAt, config.timezone);
        if (!withinLookback(dt, config.lookbackDays, config.timezone)) {
          continue;
        }
        const url = normalizeUrl(entry.link ?? "");
        if (!url) continue;
        const title = entry.title ?? "";
        const description = entry.contentSnippet ?? entry.summary ?? "";
        const content = (entry["content:encoded"] as string | undefined) ?? entry.content ?? "";
        const domain = getDomain(url);
        const id = sha256(`${url}|${title}|${publishedAt ?? ""}`);
        const parsedDate = publishedAt ? new Date(publishedAt) : null;
        const isoDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;
        items.push({
          id,
          sourceId: source.id,
          sourceName: source.name,
          sourceType: "rss",
          url,
          title,
          description,
          content,
          publishedAt: isoDate,
          language: source.lang,
          domain,
          fetchedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      errors.push({
        sourceId: source.id,
        sourceName: source.name,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return { items, errors };
}
