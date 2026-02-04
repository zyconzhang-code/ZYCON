import type { DomainTrustFile } from "../config/types.js";
import type { SourceType } from "../types.js";

export function getDomainReliability(
  trust: DomainTrustFile,
  domain: string | undefined,
  sourceType: SourceType
) {
  const normalizedDomain = (domain ?? "").replace(/^www\./, "");
  if (normalizedDomain && trust.blocklist.includes(normalizedDomain)) {
    return 0.2;
  }
  const base =
    (normalizedDomain && trust.allowlist[normalizedDomain]) ?? trust.default ?? 0.5;
  const typeWeight = trust.source_type_weight[sourceType] ?? 0.6;
  return Math.min(1, Math.max(0, base * typeWeight));
}
