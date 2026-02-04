import config from "../config/index.js";
import { DomainRateLimiter } from "../utils/rateLimiter.js";
import { fetchWithRetry } from "../utils/http.js";
import { sha256 } from "../utils/hash.js";
import { getDomain } from "../utils/url.js";
import type { RawArticle, SourceError } from "../types.js";
import type { SourceFetchResult } from "./types.js";

const limiter = new DomainRateLimiter(config.domainRateLimitMs);

export async function fetchNewsApi(): Promise<SourceFetchResult> {
  const items: RawArticle[] = [];
  const errors: SourceError[] = [];

  if (!config.newsApi.enabled || !config.newsApi.apiKey) {
    return { items, errors };
  }

  try {
    const url =
      "https://newsapi.org/v2/everything?" +
      new URLSearchParams({
        q: "(funding OR financing OR \"Series A\" OR \"Series B\" OR 融资 OR 投资)",
        language: "en",
        pageSize: "100",
        sortBy: "publishedAt",
        apiKey: config.newsApi.apiKey
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
    const json = (await res.json()) as { articles?: any[] };
    const articles = json.articles ?? [];
    for (const entry of articles) {
      const urlValue = entry.url;
      if (!urlValue) continue;
      const title = entry.title ?? "";
      const publishedAt = entry.publishedAt ?? undefined;
      const domain = getDomain(urlValue);
      const id = sha256(`${urlValue}|${title}|${publishedAt ?? ""}`);
      const parsedDate = publishedAt ? new Date(publishedAt) : null;
      const isoDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;
      items.push({
        id,
        sourceId: "newsapi",
        sourceName: "NewsAPI",
        sourceType: "api",
        url: urlValue,
        title,
        description: entry.description ?? "",
        content: entry.content ?? "",
        publishedAt: isoDate,
        language: entry.language,
        domain,
        fetchedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    errors.push({
      sourceId: "newsapi",
      sourceName: "NewsAPI",
      message: error instanceof Error ? error.message : String(error)
    });
  }

  return { items, errors };
}
