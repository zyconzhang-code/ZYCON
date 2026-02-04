import { load } from "cheerio";

export function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function normalizeString(text: string) {
  return normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[“”"'’]/g, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanHtml(html: string) {
  if (!html) return "";
  const $ = load(html);
  $("script,style,noscript,header,footer,nav,aside,form,iframe").remove();
  const text = $.text();
  return normalizeWhitespace(text);
}

export function slugify(text: string) {
  return normalizeString(text).replace(/\s+/g, "-");
}

export function diceCoefficient(a: string, b: string) {
  const s1 = normalizeString(a);
  const s2 = normalizeString(b);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  const bigrams = (s: string) => {
    const pairs: string[] = [];
    for (let i = 0; i < s.length - 1; i += 1) {
      pairs.push(s.slice(i, i + 2));
    }
    return pairs;
  };
  const pairs1 = bigrams(s1);
  const pairs2 = bigrams(s2);
  const set = new Map<string, number>();
  for (const p of pairs1) {
    set.set(p, (set.get(p) ?? 0) + 1);
  }
  let matches = 0;
  for (const p of pairs2) {
    const count = set.get(p) ?? 0;
    if (count > 0) {
      set.set(p, count - 1);
      matches += 1;
    }
  }
  return (2 * matches) / (pairs1.length + pairs2.length);
}

export function splitSentences(text: string): string[] {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return [];
  const parts = normalized.split(/(?<=[。！？.!?])\s+/);
  return parts.map((part) => part.trim()).filter(Boolean);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
