import type { RawArticle, SourceError } from "../types.js";

export interface SourceFetchResult {
  items: RawArticle[];
  errors: SourceError[];
}

export interface SourceConnector {
  id: string;
  name: string;
  enabled: boolean;
  fetch: () => Promise<SourceFetchResult>;
}
