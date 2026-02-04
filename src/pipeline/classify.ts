import type { KeywordsFile } from "../config/types.js";
import type { NormalizedArticle } from "../types.js";

export function classifyDomains(article: NormalizedArticle, keywords: KeywordsFile) {
  const text = `${article.title} ${article.description ?? ""} ${article.cleanContent}`.toLowerCase();
  const tags: string[] = [];
  const reasons: Record<string, string[]> = {};

  for (const [domain, words] of Object.entries(keywords.domains)) {
    const hit = words.filter((word) => text.includes(word.toLowerCase()));
    if (hit.length) {
      tags.push(domain);
      reasons[domain] = hit.slice(0, 5);
    }
  }

  if (!tags.length) {
    tags.push("先进制造");
    reasons["先进制造"] = ["默认兜底"];
  }

  return { tags, tagReasons: reasons };
}
