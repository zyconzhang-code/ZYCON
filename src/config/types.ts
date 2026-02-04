import type { SourceType } from "../types.js";

export interface AppConfig {
  timezone: string;
  cronSchedule: string;
  lookbackDays: number;
  topN: number;
  fetchArticleBody: boolean;
  respectRobots: boolean;
  requestTimeoutMs: number;
  maxRetries: number;
  domainRateLimitMs: number;
  fxUsdCny: number;
  recipient: string;
  subjectPrefix: string;
  subjectTags: string[];
  gdelt: {
    enabled: boolean;
    maxRecords: number;
    query: string;
  };
  rss: {
    enabled: boolean;
  };
  newsApi: {
    enabled: boolean;
    apiKey?: string;
  };
  smtp: {
    host?: string;
    port: number;
    secure: boolean;
    user?: string;
    pass?: string;
    from?: string;
  };
  llm: {
    provider?: "openai" | "openai-compatible" | string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  };
  sourceTypeWeight: Record<SourceType, number>;
}

export interface RssSourceItem {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  lang?: string;
  tags?: string[];
}

export interface RssSourcesFile {
  sources: RssSourceItem[];
}

export interface InvestorTierFile {
  tiers: Record<string, string[]>;
  weights: Record<string, number>;
}

export interface DomainTrustFile {
  default: number;
  allowlist: Record<string, number>;
  blocklist: string[];
  source_type_weight: Record<SourceType, number>;
}

export interface KeywordsFile {
  financing: string[];
  rounds: string[];
  domains: Record<string, string[]>;
  domain_hotness?: Record<string, number>;
  exclude?: string[];
}
