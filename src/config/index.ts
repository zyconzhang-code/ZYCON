import dotenv from "dotenv";
import type { AppConfig } from "./types.js";

dotenv.config();

const DEFAULT_RECIPIENT = "ZYCON1@163.com";
const DEFAULT_SUBJECT_TAGS = [
  "AI",
  "机器人",
  "先进制造",
  "出海",
  "智能硬件",
  "汽车",
  "新能源",
  "半导体"
];

const config: AppConfig = {
  timezone: process.env.TIMEZONE ?? "Asia/Kolkata",
  cronSchedule: process.env.CRON_SCHEDULE ?? "30 8 * * *",
  lookbackDays: Number(process.env.LOOKBACK_DAYS ?? 1),
  topN: Number(process.env.TOP_N ?? 20),
  fetchArticleBody: process.env.FETCH_ARTICLE_BODY === "true",
  respectRobots: process.env.RESPECT_ROBOTS !== "false",
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 10000),
  maxRetries: Number(process.env.MAX_RETRIES ?? 2),
  domainRateLimitMs: Number(process.env.DOMAIN_RATE_LIMIT_MS ?? 1200),
  fxUsdCny: Number(process.env.FX_USD_CNY ?? 7.2),
  recipient: process.env.MAIL_TO ?? DEFAULT_RECIPIENT,
  subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX ?? "【一级市场融资日报】",
  subjectTags: (process.env.EMAIL_SUBJECT_TAGS
    ? process.env.EMAIL_SUBJECT_TAGS.split(/[\\/|,\\s]+/)
    : DEFAULT_SUBJECT_TAGS
  )
    .map((item) => item.trim())
    .filter(Boolean),
  gdelt: {
    enabled: process.env.ENABLE_GDELT !== "false",
    maxRecords: Number(process.env.GDELT_MAX_RECORDS ?? 250),
    query:
      process.env.GDELT_QUERY ??
      "(融资 OR 投资 OR 融资轮 OR 获得投资 OR \"Series A\" OR \"Series B\" OR \"funding round\" OR raised OR raises OR funding)"
  },
  rss: {
    enabled: process.env.ENABLE_RSS !== "false"
  },
  newsApi: {
    enabled: Boolean(process.env.NEWSAPI_KEY),
    apiKey: process.env.NEWSAPI_KEY
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  },
  llm: {
    provider: process.env.LLM_PROVIDER,
    apiKey: process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
    model: process.env.LLM_MODEL
  },
  sourceTypeWeight: {
    gdelt: 0.7,
    rss: 0.6,
    api: 0.8
  }
};

export default config;
