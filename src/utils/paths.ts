import path from "node:path";

export const ROOT_DIR = process.cwd();
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const DB_PATH = path.join(DATA_DIR, "app.db");
export const RSS_SOURCES_PATH = path.join(DATA_DIR, "rss_sources.json");
export const INVESTOR_TIER_PATH = path.join(DATA_DIR, "investor_tier.json");
export const DOMAIN_TRUST_PATH = path.join(DATA_DIR, "domain_trust.json");
export const KEYWORDS_PATH = path.join(DATA_DIR, "keywords.json");
