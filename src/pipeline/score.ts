import type { DomainTrustFile, InvestorTierFile, KeywordsFile } from "../config/types.js";
import type { FundingEvent } from "../types.js";

const roundWeights: Record<string, number> = {
  "Pre-Seed": 4,
  "种子轮": 6,
  "天使轮": 5,
  "Pre-A": 8,
  "A轮": 12,
  "B轮": 16,
  "C轮": 18,
  "D轮": 20,
  "E轮": 20,
  "战略投资": 12,
  "并购": 14
};

function amountScore(amount?: number) {
  if (!amount || amount <= 0) return 0;
  const log = Math.log10(amount);
  const score = (log - 5) * 8; // 1M ~ 8, 10M ~ 16, 100M ~ 24
  return Math.max(0, Math.min(30, score));
}

function roundScore(round?: string) {
  if (!round) return 4;
  return roundWeights[round] ?? 6;
}

function investorScore(investors: string[], tiers: InvestorTierFile) {
  let best = tiers.weights.Other ?? 4;
  const names = investors.map((item) => item.toLowerCase());
  for (const [tier, list] of Object.entries(tiers.tiers)) {
    const hit = list.find((name) => names.includes(name.toLowerCase()));
    if (hit) {
      best = Math.max(best, tiers.weights[tier] ?? best);
    }
  }
  return Math.min(15, best);
}

function domainScore(tags: string[], keywords: KeywordsFile) {
  const hotness = keywords.domain_hotness ?? {};
  let max = 5;
  for (const tag of tags) {
    if (hotness[tag] !== undefined) {
      max = Math.max(max, hotness[tag]!);
    }
  }
  return Math.min(10, max);
}

function spreadScore(sourceCount: number) {
  if (sourceCount <= 1) return 5;
  return Math.min(15, 5 + (sourceCount - 1) * 3);
}

export function scoreEvents(
  events: FundingEvent[],
  tiers: InvestorTierFile,
  keywords: KeywordsFile,
  trust: DomainTrustFile
) {
  for (const event of events) {
    const scoreAmount = amountScore(event.amount);
    const scoreRound = roundScore(event.round);
    const scoreInvestor = investorScore(event.investors, tiers);
    const scoreDomain = domainScore(event.tags, keywords);
    const scoreReliability = Math.min(10, event.reliability * 10);
    const scoreSpread = spreadScore(event.sourceCount);

    const total = scoreAmount + scoreRound + scoreInvestor + scoreDomain + scoreReliability + scoreSpread;
    event.importanceScore = Math.max(0, Math.min(100, Math.round(total)));
    event.scoreBreakdown = {
      amount: Number(scoreAmount.toFixed(1)),
      round: Number(scoreRound.toFixed(1)),
      investor: Number(scoreInvestor.toFixed(1)),
      domain: Number(scoreDomain.toFixed(1)),
      reliability: Number(scoreReliability.toFixed(1)),
      spread: Number(scoreSpread.toFixed(1))
    };
  }
  return events;
}
