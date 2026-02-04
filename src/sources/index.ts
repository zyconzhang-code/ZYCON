import config from "../config/index.js";
import { fetchGdelt } from "./gdelt.js";
import { fetchRssSources } from "./rss.js";
import { fetchNewsApi } from "./newsapi.js";
import type { SourceConnector, SourceFetchResult } from "./types.js";

const connectors: SourceConnector[] = [
  {
    id: "gdelt",
    name: "GDELT",
    enabled: config.gdelt.enabled,
    fetch: fetchGdelt
  },
  {
    id: "rss",
    name: "RSS",
    enabled: config.rss.enabled,
    fetch: fetchRssSources
  },
  {
    id: "newsapi",
    name: "NewsAPI",
    enabled: config.newsApi.enabled,
    fetch: fetchNewsApi
  }
];

export async function fetchAllSources(): Promise<SourceFetchResult> {
  const items = [] as SourceFetchResult["items"];
  const errors = [] as SourceFetchResult["errors"];

  for (const connector of connectors) {
    if (!connector.enabled) continue;
    const result = await connector.fetch();
    items.push(...result.items);
    errors.push(...result.errors);
  }

  return { items, errors };
}
