export type SourceType = "rss" | "gdelt" | "api";

export interface RawArticle {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  url: string;
  title: string;
  description?: string;
  content?: string;
  publishedAt?: string;
  language?: string;
  domain?: string;
  fetchedAt: string;
}

export interface SourceError {
  sourceId: string;
  sourceName: string;
  message: string;
}

export interface NormalizedArticle extends RawArticle {
  titleNormalized: string;
  cleanContent: string;
  isFinancing: boolean;
  company?: string;
  round?: string;
  amount?: number;
  amountText?: string;
  currency?: "CNY" | "USD" | "UNKNOWN";
  investors: string[];
  tags: string[];
  tagReasons: Record<string, string[]>;
  reliability: number;
}

export interface FundingEvent {
  id: string;
  dateKey: string;
  dedupeKey: string;
  title: string;
  titleNormalized: string;
  company?: string;
  round?: string;
  amount?: number;
  amountText?: string;
  currency?: "CNY" | "USD" | "UNKNOWN";
  investors: string[];
  tags: string[];
  tagReasons: Record<string, string[]>;
  summary: string;
  bullets: string[];
  publishedAt?: string;
  mainUrl: string;
  sourceName: string;
  otherSources: { name: string; url: string }[];
  sourceCount: number;
  importanceScore: number;
  scoreBreakdown: Record<string, number>;
  reliability: number;
}

export interface DailyReport {
  dateKey: string;
  timezone: string;
  total: number;
  topN: number;
  domainCounts: Record<string, number>;
  maxAmountItem?: FundingEvent;
  highestRoundItem?: FundingEvent;
  items: FundingEvent[];
  errors: SourceError[];
}
