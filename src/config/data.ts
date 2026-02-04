import { readJson } from "../utils/fs.js";
import {
  DOMAIN_TRUST_PATH,
  INVESTOR_TIER_PATH,
  KEYWORDS_PATH,
  RSS_SOURCES_PATH
} from "../utils/paths.js";
import type {
  DomainTrustFile,
  InvestorTierFile,
  KeywordsFile,
  RssSourcesFile
} from "./types.js";

export function loadRssSources() {
  return readJson<RssSourcesFile>(RSS_SOURCES_PATH).sources;
}

export function loadInvestorTiers() {
  return readJson<InvestorTierFile>(INVESTOR_TIER_PATH);
}

export function loadDomainTrust() {
  return readJson<DomainTrustFile>(DOMAIN_TRUST_PATH);
}

export function loadKeywords() {
  return readJson<KeywordsFile>(KEYWORDS_PATH);
}
