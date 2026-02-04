import { setTimeout as delay } from "node:timers/promises";
import { DomainRateLimiter } from "./rateLimiter.js";
import { getDomain } from "./url.js";

export interface FetchOptions {
  timeoutMs: number;
  retries: number;
  headers?: Record<string, string>;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions,
  limiter?: DomainRateLimiter
) {
  const domain = getDomain(url);
  const run = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    try {
      return await fetch(url, {
        headers: options.headers,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      if (limiter) {
        return await limiter.schedule(domain, run);
      }
      return await run();
    } catch (error) {
      lastError = error;
      if (attempt < options.retries) {
        const backoff = 500 * Math.pow(2, attempt);
        await delay(backoff);
        continue;
      }
    }
  }
  throw lastError;
}
