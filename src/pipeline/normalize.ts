import type { DomainTrustFile, KeywordsFile } from "../config/types.js";
import type { NormalizedArticle, RawArticle } from "../types.js";
import { cleanHtml, normalizeString, normalizeWhitespace } from "../utils/text.js";
import { getDomainReliability } from "./trust.js";
import config from "../config/index.js";

const roundPatterns: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /pre[- ]?seed/i, value: "Pre-Seed" },
  { pattern: /seed|种子/i, value: "种子轮" },
  { pattern: /angel|天使/i, value: "天使轮" },
  { pattern: /pre[- ]?a|prea/i, value: "Pre-A" },
  { pattern: /series\s*a|a轮/i, value: "A轮" },
  { pattern: /series\s*b|b轮/i, value: "B轮" },
  { pattern: /series\s*c|c轮/i, value: "C轮" },
  { pattern: /series\s*d|d轮/i, value: "D轮" },
  { pattern: /series\s*e|e轮/i, value: "E轮" },
  { pattern: /strategic|战略/i, value: "战略投资" },
  { pattern: /并购|收购|acquisition|acquired/i, value: "并购" }
];

const investorSeparators = /、|,|，|;|；|\s+and\s+|\s+&\s+|\s+以及\s+|\s+及\s+|\s+和\s+/i;

function containsAny(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function detectFinancing(text: string, keywords: KeywordsFile) {
  if (keywords.exclude?.length && containsAny(text, keywords.exclude)) {
    return false;
  }
  return (
    containsAny(text, keywords.financing) ||
    containsAny(text, keywords.rounds) ||
    /\b(raised|raises|funding|investment)\b/i.test(text) ||
    /\b(融资|获投|投资)\b/.test(text)
  );
}

function extractRound(text: string): string | undefined {
  for (const { pattern, value } of roundPatterns) {
    if (pattern.test(text)) return value;
  }
  return undefined;
}

function extractCompany(title: string): string | undefined {
  const patterns = [
    /^(.+?)(?:完成|获|宣布|宣布完成|完成了|获得|获投|获得投资|完成融资|获融资)/,
    /^(.+?)(?:raises|raised|secures|secured|lands|closes|bags|announces)/i,
    /^(.+?)(?:融资|投资|funding|investment)/i
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match?.[1]) {
      return match[1]
        .replace(/[“”"'’（）()\[\]<>《》]/g, "")
        .trim();
    }
  }
  return undefined;
}

function extractAmount(text: string): {
  amount?: number;
  amountText?: string;
  currency?: "CNY" | "USD" | "UNKNOWN";
} {
  if (/未披露|金额未披露|undisclosed/i.test(text)) {
    return { amountText: "未披露", currency: "UNKNOWN" };
  }

  const usdPattern = /(?:US\$|USD|\$)\s?([\d.]+)\s?(b|bn|billion|m|million|k|thousand)?/i;
  const usdMatch = text.match(usdPattern);
  if (usdMatch) {
    const value = Number(usdMatch[1]);
    const unit = (usdMatch[2] ?? "").toLowerCase();
    const multiplier = unit.startsWith("b")
      ? 1e9
      : unit.startsWith("m")
        ? 1e6
        : unit.startsWith("k")
          ? 1e3
          : 1;
    const amount = value * multiplier;
    const suffix = unit ? unit.toUpperCase() : "";
    return { amount, amountText: `US$${value}${suffix}`, currency: "USD" };
  }

  const cnPattern = /([\d.]+)\s*(亿|千万|百万|万)\s*(人民币|元|美元|美金|USD|US\$)?/;
  const cnMatch = text.match(cnPattern);
  if (cnMatch) {
    const value = Number(cnMatch[1]);
    const unit = cnMatch[2];
    const currencyRaw = cnMatch[3] ?? "";
    const multiplier =
      unit === "亿" ? 1e8 : unit === "千万" ? 1e7 : unit === "百万" ? 1e6 : 1e4;
    const amountValue = value * multiplier;
    const currency = /美元|美金|USD|US\$/i.test(currencyRaw) ? "USD" : "CNY";
    const amount = currency === "USD" ? amountValue : amountValue / config.fxUsdCny;
    const amountText = `${value}${unit}${currency === "USD" ? "美元" : "人民币"}`;
    return { amount, amountText, currency };
  }

  return { currency: "UNKNOWN" };
}

function extractInvestors(text: string): string[] {
  const patterns = [
    /投资方包括([^。；;\n]+)/,
    /投资人包括([^。；;\n]+)/,
    /由([^。；;\n]+)领投/,
    /由([^。；;\n]+)投资/,
    /led by ([^\.]+)/i,
    /investors include ([^\.]+)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1]
        .split(investorSeparators)
        .map((item) => item.replace(/[“”"'’（）()\[\]<>《》]/g, "").trim())
        .filter((item) => item.length >= 2)
        .slice(0, 6);
    }
  }
  return [];
}

export function normalizeArticles(
  raws: RawArticle[],
  keywords: KeywordsFile,
  trust: DomainTrustFile
): NormalizedArticle[] {
  return raws
    .map((raw) => {
      const content = cleanHtml(raw.content ?? raw.description ?? "");
      const mergedText = normalizeWhitespace(`${raw.title} ${raw.description ?? ""} ${content}`);
      const isFinancing = detectFinancing(mergedText, keywords);
      if (!isFinancing) return null;
      const round = extractRound(mergedText);
      const { amount, amountText, currency } = extractAmount(mergedText);
      const investors = extractInvestors(mergedText);
      const company = extractCompany(raw.title) ?? extractCompany(mergedText);
      const reliability = getDomainReliability(trust, raw.domain, raw.sourceType);
      const titleNormalized = normalizeString(raw.title);

      return {
        ...raw,
        titleNormalized,
        cleanContent: content,
        isFinancing,
        company,
        round,
        amount,
        amountText,
        currency,
        investors,
        tags: [],
        tagReasons: {},
        reliability
      } satisfies NormalizedArticle;
    })
    .filter((item): item is NormalizedArticle => Boolean(item));
}
