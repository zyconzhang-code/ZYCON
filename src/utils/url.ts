export function getDomain(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    return url.toString();
  } catch {
    return rawUrl;
  }
}
