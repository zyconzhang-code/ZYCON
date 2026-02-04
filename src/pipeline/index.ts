import config from "../config/index.js";
import { loadDomainTrust, loadInvestorTiers, loadKeywords } from "../config/data.js";
import type { RawArticle, FundingEvent } from "../types.js";
import { normalizeArticles } from "./normalize.js";
import { classifyDomains } from "./classify.js";
import { dedupeArticles } from "./dedupe.js";
import { scoreEvents } from "./score.js";
import { summarizeEvents } from "./summarize.js";

export async function processArticles(raws: RawArticle[], dateKey: string): Promise<FundingEvent[]> {
  const keywords = loadKeywords();
  const trust = loadDomainTrust();
  const tiers = loadInvestorTiers();

  const normalized = normalizeArticles(raws, keywords, trust).map((item) => {
    const { tags, tagReasons } = classifyDomains(item, keywords);
    item.tags = tags;
    item.tagReasons = tagReasons;
    return item;
  });

  const deduped = dedupeArticles(normalized, dateKey);
  const scored = scoreEvents(deduped, tiers, keywords, trust);
  const summarized = await summarizeEvents(scored);

  return summarized.sort((a, b) => b.importanceScore - a.importanceScore);
}
