import { DateTime } from "luxon";
import config from "../config/index.js";
import { DomainRateLimiter } from "../utils/rateLimiter.js";
import { fetchWithRetry } from "../utils/http.js";
import { sha256 } from "../utils/hash.js";
import { getDomain } from "../utils/url.js";
import type { RawArticle, SourceError } from "../types.js";
import type { SourceFetchResult } from "./types.js";

const limiter = new DomainRateLimiter(config.domainRateLimitMs);

export async function fetchGdelt(): Promise<SourceFetchResult> {
  const items: RawArticle[] = [];
  const errors: SourceError[] = [];
  if (!config.gdelt.enabled) {
    return { items, errors };
  }

  try {
    const start = DateTime.utc().minus({ days: config.lookbackDays }).toFormat("yyyyMMddHHmmss");
    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc?" +
      new URLSearchParams({
        query: config.gdelt.query,
        mode: "ArtList",
        maxrecords: String(config.gdelt.maxRecords),
        format: "json",
        sort: "DateDesc",
        startdatetime: start
      }).toString();

    const res = await fetchWithRetry(
      url,
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
    const json = (await res.json()) as { articles?: any[]; results?: any[] };
    const articles = json.articles ?? json.results ?? [];
    for (const entry of articles) {
      const urlValue = entry.url ?? entry.link;
      if (!urlValue) continue;
      const title = entry.title ?? "";
      const publishedAt = entry.seendate ?? entry.date ?? undefined;
      const domain = entry.domain ?? getDomain(urlValue);
      const id = sha256(`${urlValue}|${title}|${publishedAt ?? ""}`);
      const parsedDate = publishedAt ? new Date(publishedAt) : null;
      const isoDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;
      items.push({
        id,
        sourceId: "gdelt",
        sourceName: "GDELT",
        sourceType: "gdelt",
        url: urlValue,
        title,
        description: entry.sourceCommonName ?? entry.sourcecountry ?? "",
        content: "",
        publishedAt: isoDate,
        language: entry.language,
        domain,
        fetchedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    errors.push({
      sourceId: "gdelt",
      sourceName: "GDELT",
      message: error instanceof Error ? error.message : String(error)
    });
  }

  return { items, errors };
}
