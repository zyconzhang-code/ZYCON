import config from "../config/index.js";
import { sha256 } from "../utils/hash.js";
import { diceCoefficient, normalizeString } from "../utils/text.js";
import { parseDate, diffDays } from "../utils/date.js";
import type { FundingEvent, NormalizedArticle } from "../types.js";

function normalizeComparable(text?: string) {
  return text ? normalizeString(text) : "";
}

function isMatch(event: FundingEvent, item: NormalizedArticle) {
  const companyMatch =
    event.company && item.company
      ? normalizeComparable(event.company) === normalizeComparable(item.company)
      : false;
  const roundMatch =
    event.round && item.round
      ? normalizeComparable(event.round) === normalizeComparable(item.round)
      : true;
  const amountMatch =
    event.amount && item.amount
      ? Math.abs(event.amount - item.amount) / Math.max(event.amount, item.amount) <= 0.25
      : true;
  const titleSimilarity = diceCoefficient(event.titleNormalized, item.titleNormalized);

  const eventDate = parseDate(event.publishedAt, config.timezone);
  const itemDate = parseDate(item.publishedAt, config.timezone);
  const dateWithin = eventDate && itemDate ? diffDays(eventDate, itemDate) <= 3 : true;

  if (companyMatch && roundMatch && amountMatch && dateWithin) return true;
  if (titleSimilarity >= 0.78 && dateWithin) return true;
  return false;
}

function buildDedupeKey(event: FundingEvent) {
  const amountBucket = event.amount ? Math.round(event.amount / 1_000_000) + "m" : "na";
  const base = `${event.company ?? event.titleNormalized}|${event.round ?? "na"}|${amountBucket}|${event.dateKey}`;
  return sha256(base);
}

function chooseMain(event: FundingEvent, item: NormalizedArticle) {
  if (item.reliability > event.reliability + 0.05) return true;
  if (item.reliability + 0.05 < event.reliability) return false;
  const itemDate = item.publishedAt ? new Date(item.publishedAt).getTime() : Infinity;
  const eventDate = event.publishedAt ? new Date(event.publishedAt).getTime() : Infinity;
  if (itemDate < eventDate) return true;
  return item.title.length > event.title.length;
}

export function dedupeArticles(items: NormalizedArticle[], dateKey: string): FundingEvent[] {
  const events: FundingEvent[] = [];

  for (const item of items) {
    const existing = events.find((event) => isMatch(event, item));
    if (existing) {
      existing.investors = Array.from(new Set([...existing.investors, ...item.investors]));
      existing.tags = Array.from(new Set([...existing.tags, ...item.tags]));
      existing.tagReasons = { ...existing.tagReasons, ...item.tagReasons };
      existing.sourceCount += 1;
      existing.otherSources.push({ name: item.sourceName, url: item.url });
      existing.reliability = Math.max(existing.reliability, item.reliability);

      if (!existing.company && item.company) existing.company = item.company;
      if (!existing.round && item.round) existing.round = item.round;
      if (!existing.amount && item.amount) existing.amount = item.amount;
      if (!existing.amountText && item.amountText) existing.amountText = item.amountText;
      if (!existing.currency && item.currency) existing.currency = item.currency;

      if (chooseMain(existing, item)) {
        existing.title = item.title;
        existing.titleNormalized = item.titleNormalized;
        existing.mainUrl = item.url;
        existing.sourceName = item.sourceName;
        existing.publishedAt = item.publishedAt ?? existing.publishedAt;
      }
      continue;
    }

    const event: FundingEvent = {
      id: "",
      dateKey,
      dedupeKey: "",
      title: item.title,
      titleNormalized: item.titleNormalized,
      company: item.company,
      round: item.round,
      amount: item.amount,
      amountText: item.amountText,
      currency: item.currency,
      investors: [...item.investors],
      tags: [...item.tags],
      tagReasons: { ...item.tagReasons },
      summary: "",
      bullets: [],
      publishedAt: item.publishedAt,
      mainUrl: item.url,
      sourceName: item.sourceName,
      otherSources: [],
      sourceCount: 1,
      importanceScore: 0,
      scoreBreakdown: {},
      reliability: item.reliability
    };

    event.dedupeKey = buildDedupeKey(event);
    event.id = sha256(event.dedupeKey);
    events.push(event);
  }

  return events;
}
