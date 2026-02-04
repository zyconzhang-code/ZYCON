import config from "../config/index.js";
import type { RawArticle } from "../types.js";
import { DomainRateLimiter } from "../utils/rateLimiter.js";
import { RobotsCache } from "../utils/robots.js";
import { fetchWithRetry } from "../utils/http.js";
import { logger } from "../utils/logger.js";

const limiter = new DomainRateLimiter(config.domainRateLimitMs);
const robots = new RobotsCache(limiter, config.requestTimeoutMs, config.maxRetries);

export async function enrichArticles(raws: RawArticle[]) {
  if (!config.fetchArticleBody) return raws;

  for (const item of raws) {
    if (item.content && item.content.length > 200) continue;
    if (!item.url) continue;
    try {
      if (config.respectRobots) {
        const allowed = await robots.canFetch(item.url);
        if (!allowed) continue;
      }
      const res = await fetchWithRetry(
        item.url,
        {
          timeoutMs: config.requestTimeoutMs,
          retries: config.maxRetries,
          headers: { "User-Agent": "FundingDailyBot/1.0" }
        },
        limiter
      );
      if (!res.ok) continue;
      const html = await res.text();
      item.content = html;
    } catch (error) {
      logger.warn("内容抓取失败", item.url, error instanceof Error ? error.message : error);
    }
  }

  return raws;
}
