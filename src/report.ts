import config from "./config/index.js";
import type { DailyReport, FundingEvent, SourceError } from "./types.js";

const roundRank: Record<string, number> = {
  "Pre-Seed": 1,
  "种子轮": 2,
  "天使轮": 3,
  "Pre-A": 4,
  "A轮": 5,
  "B轮": 6,
  "C轮": 7,
  "D轮": 8,
  "E轮": 9,
  "战略投资": 5,
  "并购": 10
};

function pickMaxAmount(events: FundingEvent[]) {
  let best: FundingEvent | undefined;
  for (const event of events) {
    if (!event.amount) continue;
    if (!best || (event.amount ?? 0) > (best.amount ?? 0)) {
      best = event;
    }
  }
  return best;
}

function pickHighestRound(events: FundingEvent[]) {
  let best: FundingEvent | undefined;
  for (const event of events) {
    const score = roundRank[event.round ?? ""] ?? 0;
    const bestScore = roundRank[best?.round ?? ""] ?? 0;
    if (score > bestScore) {
      best = event;
    }
  }
  return best;
}

export function buildDailyReport(
  events: FundingEvent[],
  errors: SourceError[],
  dateKey: string
): DailyReport {
  const domainCounts: Record<string, number> = {};
  for (const event of events) {
    for (const tag of event.tags) {
      domainCounts[tag] = (domainCounts[tag] ?? 0) + 1;
    }
  }

  const topItems = events.slice(0, config.topN);

  return {
    dateKey,
    timezone: config.timezone,
    total: events.length,
    topN: config.topN,
    domainCounts,
    maxAmountItem: pickMaxAmount(events),
    highestRoundItem: pickHighestRound(events),
    items: topItems,
    errors
  };
}
