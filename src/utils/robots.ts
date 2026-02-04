import { getDomain } from "./url.js";
import { fetchWithRetry } from "./http.js";
import { DomainRateLimiter } from "./rateLimiter.js";

interface RobotsRules {
  disallow: string[];
}

export class RobotsCache {
  private readonly cache = new Map<string, RobotsRules>();
  private readonly limiter: DomainRateLimiter;
  private readonly timeoutMs: number;
  private readonly retries: number;

  constructor(limiter: DomainRateLimiter, timeoutMs: number, retries: number) {
    this.limiter = limiter;
    this.timeoutMs = timeoutMs;
    this.retries = retries;
  }

  async canFetch(url: string) {
    const domain = getDomain(url);
    if (!domain) return true;
    if (!this.cache.has(domain)) {
      await this.load(domain);
    }
    const rules = this.cache.get(domain);
    if (!rules) return true;
    let path = "/";
    try {
      path = new URL(url).pathname || "/";
    } catch {
      return true;
    }
    return !rules.disallow.some((rule) => rule === "/" || (rule !== "" && path.startsWith(rule)));
  }

  private async load(domain: string) {
    try {
      const robotsUrl = `https://${domain}/robots.txt`;
      const res = await fetchWithRetry(
        robotsUrl,
        {
          timeoutMs: this.timeoutMs,
          retries: this.retries,
          headers: { "User-Agent": "FundingDailyBot/1.0" }
        },
        this.limiter
      );
      if (!res.ok) {
        this.cache.set(domain, { disallow: [] });
        return;
      }
      const text = await res.text();
      this.cache.set(domain, this.parse(text));
    } catch {
      this.cache.set(domain, { disallow: [] });
    }
  }

  private parse(text: string): RobotsRules {
    const lines = text.split(/\r?\n/);
    let inGlobal = false;
    const disallow: string[] = [];
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const [field, value] = line.split(":").map((part) => part.trim());
      if (!field || value === undefined) continue;
      if (field.toLowerCase() === "user-agent") {
        inGlobal = value === "*";
        continue;
      }
      if (inGlobal && field.toLowerCase() === "disallow") {
        disallow.push(value);
      }
    }
    return { disallow };
  }
}
